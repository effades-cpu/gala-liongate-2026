/*
  RÉGIE MC · Gala LIONGATE · Google Apps Script (lié au Google Sheet)
  ------------------------------------------------------------------
  - setup()            : à lancer UNE fois depuis l'éditeur (crée / normalise les onglets).
  - doGet(?format=json): flux public en lecture seule, lu par le site toutes les 10 s.
  - doGet()            : panneau de contrôle de la MC (Control.html).
  - mcState / mcCheckPin / mcAction : appelées par le panneau via google.script.run.
  Le code PIN est lu dans Propriétés du script > MC_PIN. Aucun secret dans ce fichier.

  Les transitions d'état (actStartNow_, actNext_, ...) sont des fonctions pures sur l'objet
  state = { start, durations:{id:min}, anchors:{id:ms}, pauseMs:{id:ms}, paused:{id,since}|null, rev }
  et utilisent le même moteur que le site (Engine.gs = engine.js).
*/

var TZ = "Africa/Douala";               // UTC+1 toute l'année (pas d'heure d'été)
var TZ_OFFSET_MS = 3600000;
var DEFAULT_START = Date.parse("2026-11-28T17:30:00+01:00");

var UNITS = [
  { id: "accueil",     title: "Accueil et photocall", duration: 30 },
  { id: "ouverture",   title: "Ouverture", duration: 4 },
  { id: "marketing",   title: "Le département Marketing et Communication", duration: 4 },
  { id: "expansion",   title: "Pôle Expansion de marchés", duration: 5 },
  { id: "it",          title: "IT & Software Outsourcing", duration: 5 },
  { id: "intermede",   title: "Intermède musical", duration: 3 },
  { id: "vision",      title: "Vision DRC & Présentation de la marque", duration: 8 },
  { id: "vision.spot", title: "Projection du spot", duration: 4 },
  { id: "cloture",     title: "Clôture", duration: 5 },
  { id: "cocktail",    title: "Cocktail dînatoire", duration: 145 }
];

var SHEET_PROG = "Programme", SHEET_SET = "Réglages", SHEET_LOG = "Journal";
var PROG_HEADER = ["id", "titre", "durée (min)", "début réel (auto)", "pause cumulée (auto, min)"];
var LOG_HEADER = ["horodatage", "action", "étape", "détail"];
var KEY_START = "début prévu", KEY_PID = "pause en cours (id)", KEY_PSINCE = "pause depuis", KEY_REV = "révision";
var SET_KEYS = [KEY_START, KEY_PID, KEY_PSINCE, KEY_REV];
var CACHE_KEY = "gala-feed-v1", CACHE_SECONDS = 5;
var PROTECT_TAG = "GALA (auto) : colonne gérée par le script";

/* ======================================================================
   Fonctions pures (testées dans node)
   ====================================================================== */

function unitIndex_(id) {
  for (var i = 0; i < UNITS.length; i++) if (UNITS[i].id === id) return i;
  return -1;
}
function unitIds_() { return UNITS.map(function (u) { return u.id; }); }

function planOf_(state) {
  return { start: state.start, units: UNITS.map(function (u) { return { id: u.id, duration: u.duration }; }) };
}

function cloneState_(s) {
  return {
    start: s.start,
    durations: copyMap_(s.durations), anchors: copyMap_(s.anchors), pauseMs: copyMap_(s.pauseMs),
    paused: s.paused ? { id: s.paused.id, since: s.paused.since } : null,
    rev: s.rev || 0
  };
}
function copyMap_(o) { var r = {}; if (o) for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r[k] = o[k]; return r; }

function durationOf_(s, id) {
  var v = s.durations ? s.durations[id] : undefined;
  if (typeof v === "number" && isFinite(v) && v >= 0) return v;
  var i = unitIndex_(id);
  return i >= 0 ? UNITS[i].duration : 0;
}

function schedule_(s, now) { return GalaEngine.computeSchedule(planOf_(s), s, now); }

// Heure de Douala "HH:MM" (fuseau fixe UTC+1).
function hhmm_(ms) { return new Date(ms + TZ_OFFSET_MS).toISOString().slice(11, 16); }
function hhmmss_(ms) { return new Date(ms + TZ_OFFSET_MS).toISOString().slice(11, 19); }

// ms du jour (Douala) de baseMs, à l'heure h:m:s.
function atTime_(baseMs, h, m, s) {
  var day0 = Math.floor((baseMs + TZ_OFFSET_MS) / 864e5) * 864e5 - TZ_OFFSET_MS;
  return day0 + ((h * 60 + m) * 60 + (s || 0)) * 1000;
}

// Ajoute la pause en cours au cumul de l'étape et lève la pause.
function foldPause_(s, now) {
  if (!s.paused) return;
  var id = s.paused.id;
  s.pauseMs[id] = (s.pauseMs[id] || 0) + Math.max(0, now - s.paused.since);
  s.paused = null;
}

function err_(msg) { return { error: msg }; }

/* "Commence maintenant" sur l'étape id :
   - anchors[id] = now ; les ancres et pauses des étapes suivantes sont effacées (recalcul depuis les durées) ;
   - la pause est levée (cumulée si elle portait sur une étape antérieure) ;
   - les étapes antérieures qui n'avaient pas encore commencé sont marquées comme passées
     (ancres 1 s, 2 s... avant now), sinon le moteur ignorerait l'ancre (elle serait antérieure à leur début). */
function actStartNow_(s0, id, now) {
  var i = unitIndex_(id);
  if (i < 0) return err_("Étape inconnue : " + id);
  var s = cloneState_(s0);
  if (s.paused) {
    var pi = unitIndex_(s.paused.id);
    if (pi >= 0 && pi < i) foldPause_(s, now); else s.paused = null;
  }
  for (var k = i; k < UNITS.length; k++) { delete s.anchors[UNITS[k].id]; delete s.pauseMs[UNITS[k].id]; }
  var sched = schedule_(s, now);
  var f = i;                                   // première étape antérieure pas encore commencée
  while (f > 0 && sched.units[f - 1].start >= now) f--;
  if (f < i) {
    var low = f > 0 ? sched.units[f - 1].start : -Infinity;
    var step = Math.min(1000, (now - low) / (i - f + 1));   // 1 s d'écart si possible (arrondi du Sheet)
    for (var j = f; j < i; j++) s.anchors[UNITS[j].id] = Math.round(now - (i - j) * step);
  }
  s.anchors[id] = now;
  return { state: s, unit: id, label: "Commence maintenant", detail: "début à " + hhmmss_(now),
           message: "« " + UNITS[i].title + " » commence maintenant (" + hhmm_(now) + ")." };
}

/* "Étape suivante". expectedId = l'étape affichée sur le bouton du panneau. Si le déroulé vient
   d'avancer tout seul sur cette étape (fin de durée pendant l'appui), on la (re)commence maintenant
   au lieu de sauter une étape de plus. */
function actNext_(s0, now, expectedId) {
  var sched = schedule_(s0, now), target, ei = expectedId ? unitIndex_(String(expectedId)) : -1;
  if (ei >= 0 && ei === sched.current && sched.units[ei].start > now - 20000) target = ei;
  else if (sched.phase === "before") target = 0;
  else if (sched.phase === "after") return err_("La soirée est terminée : aucune étape suivante.");
  else if (sched.current < 0) target = 0;
  else if (sched.current >= UNITS.length - 1) return err_("C'est déjà la dernière étape.");
  else target = sched.current + 1;
  var r = actStartNow_(s0, UNITS[target].id, now);
  if (r.error) return r;
  r.label = "Étape suivante";
  r.message = "Étape suivante : « " + UNITS[target].title + " » (" + hhmm_(now) + ").";
  return r;
}

function actPause_(s0, now) {
  if (s0.paused) return err_("Déjà en pause. Appuyez sur « Reprendre ».");
  var sched = schedule_(s0, now);
  if (sched.phase !== "live" || sched.current < 0) return err_("Aucune étape en cours à mettre en pause.");
  var s = cloneState_(s0), id = UNITS[sched.current].id;
  s.paused = { id: id, since: now };
  return { state: s, unit: id, label: "Pause", detail: "pause à " + hhmmss_(now),
           message: "Pause sur « " + UNITS[sched.current].title + " »." };
}

function actResume_(s0, now) {
  if (!s0.paused) return err_("Aucune pause en cours.");
  var s = cloneState_(s0), id = s.paused.id, len = Math.max(0, now - s.paused.since);
  foldPause_(s, now);
  return { state: s, unit: id, label: "Reprise", detail: "pause de " + Math.round(len / 1000) + " s",
           message: "Reprise. Les étapes suivantes sont décalées de " + fmtDur_(len) + "." };
}

function actAdjust_(s0, delta, now) {
  delta = Number(delta);
  if (!isFinite(delta) || delta === 0 || Math.abs(delta) > 30) return err_("Ajustement invalide.");
  var sched = schedule_(s0, now), idx;
  if (sched.phase === "before") idx = 0;
  else if (sched.phase === "live" && sched.current >= 0) idx = sched.current;
  else return err_("Aucune étape en cours à ajuster.");
  var s = cloneState_(s0), id = UNITS[idx].id, before = durationOf_(s0, id);
  var after = Math.min(600, Math.max(0, before + delta));
  if (after === before) return err_("La durée ne peut pas descendre sous 0 min.");
  s.durations[id] = after;
  return { state: s, unit: id, label: "Durée " + (delta > 0 ? "+" : "−") + Math.abs(delta) + " min",
           detail: "durée " + before + " → " + after + " min",
           message: "« " + UNITS[idx].title + " » : " + after + " min." };
}

function actBackToPlan_(s0) {
  var s = cloneState_(s0);
  s.anchors = {}; s.pauseMs = {}; s.paused = null;
  return { state: s, unit: "", label: "Revenir au plan", detail: "ancres et pauses effacées (durées conservées)",
           message: "Retour au plan : horaires recalculés depuis le début prévu." };
}

function applyAction_(s, action, arg, now) {
  switch (action) {
    case "start":  return actStartNow_(s, String(arg), now);
    case "next":   return actNext_(s, now, arg);
    case "pause":  return actPause_(s, now);
    case "resume": return actResume_(s, now);
    case "adjust": return actAdjust_(s, arg, now);
    case "plan":   return actBackToPlan_(s);
  }
  return err_("Action inconnue.");
}

function fmtDur_(ms) {
  var t = Math.round(ms / 1000), m = Math.floor(t / 60), sec = t % 60;
  return m ? m + " min " + (sec < 10 ? "0" : "") + sec + " s" : sec + " s";
}

function parseNum_(v) {
  if (typeof v === "string") v = parseFloat(v.replace(",", "."));
  return (typeof v === "number" && isFinite(v)) ? v : null;
}

function isDate_(v) { return Object.prototype.toString.call(v) === "[object Date]"; }

// Valeur de cellule -> ms (ou null). baseMs donne le jour quand seule une heure est saisie (ex. "18:00").
function cellMs_(v, baseMs) {
  if (v === "" || v === null || v === undefined) return null;
  if (isDate_(v)) {
    var t = v.getTime();
    if (isNaN(t)) return null;
    if (v.getFullYear() >= 2000) return t;
    var hms = Utilities.formatDate(v, TZ, "HH:mm:ss").split(":");   // heure seule saisie dans le Sheet
    return atTime_(baseMs, +hms[0], +hms[1], +hms[2]);
  }
  if (typeof v === "number") {
    if (v > 1.5e12 && v < 2.5e12) return v;
    if (v >= 0 && v < 1) return atTime_(baseMs, 0, 0, Math.round(v * 86400));
    return null;
  }
  var s = String(v).trim(), m;
  if ((m = /^(\d{1,2})\s*[:hH]\s*(\d{2})(?::(\d{2}))?$/.exec(s))) return atTime_(baseMs, +m[1], +m[2], +(m[3] || 0));
  if ((m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(s)))
    return Date.UTC(+m[3], +m[2] - 1, +m[1], +m[4], +m[5], +(m[6] || 0)) - TZ_OFFSET_MS;
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) { var p = Date.parse(s); return isNaN(p) ? null : p; }
  return null;
}

function normKey_(s) {
  return String(s || "").toLowerCase().trim().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ");
}

/* Lit l'état depuis les valeurs brutes des deux onglets (tableaux de getValues()). */
function stateFromValues_(progValues, setValues) {
  var settings = {}, setRow = {};
  for (var r = 1; r < setValues.length; r++) {
    var key = normKey_(setValues[r][0]);
    if (key) { settings[key] = setValues[r][1]; setRow[key] = r; }
  }
  var start = cellMs_(settings[normKey_(KEY_START)], DEFAULT_START);
  if (start === null) start = DEFAULT_START;
  var state = { start: start, durations: {}, anchors: {}, pauseMs: {}, paused: null, rev: 0 };
  var titles = {}, progRow = {};
  UNITS.forEach(function (u) { titles[u.id] = u.title; state.durations[u.id] = u.duration; });
  for (var i = 1; i < progValues.length; i++) {
    var row = progValues[i], id = String(row[0] || "").trim();
    if (unitIndex_(id) < 0) continue;
    progRow[id] = i;
    if (String(row[1] || "").trim()) titles[id] = String(row[1]).trim();
    var d = parseNum_(row[2]);
    if (d !== null && d >= 0 && d <= 600) state.durations[id] = d;
    var a = cellMs_(row[3], start);
    if (a !== null) state.anchors[id] = a;
    var pm = parseNum_(row[4]);
    if (pm !== null && pm > 0) state.pauseMs[id] = Math.round(pm * 60000);
  }
  var pid = String(settings[normKey_(KEY_PID)] || "").trim();
  var since = cellMs_(settings[normKey_(KEY_PSINCE)], start);
  if (pid && unitIndex_(pid) >= 0 && since !== null) state.paused = { id: pid, since: since };
  var rev = parseInt(settings[normKey_(KEY_REV)], 10);
  state.rev = isFinite(rev) && rev >= 0 ? rev : 0;
  return { state: state, titles: titles, progRow: progRow, setRow: setRow };
}

/* Corps du flux public (sans serverTime). Forme acceptée par engine.js cleanLive(x, ids). */
function feedBody_(state) {
  return {
    ok: true, rev: state.rev, start: state.start,
    durations: copyMap_(state.durations), anchors: copyMap_(state.anchors),
    pauseMs: copyMap_(state.pauseMs),
    paused: state.paused ? { id: state.paused.id, since: state.paused.since } : null
  };
}

function panelBody_(state, titles, pinConfigured) {
  var b = feedBody_(state);
  b.units = UNITS.map(function (u) { return { id: u.id, title: titles[u.id] || u.title, duration: u.duration }; });
  b.pinConfigured = !!pinConfigured;
  return b;
}

/* ======================================================================
   Accès Google (Sheet, cache, verrou, propriétés)
   ====================================================================== */

function getSs_() {
  var ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) { ss = null; }
  if (!ss) {
    var id = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
    if (!id) throw new Error("Google Sheet introuvable : lancez setup() depuis l'éditeur.");
    ss = SpreadsheetApp.openById(id);
  }
  return ss;
}

function readAll_(ss) {
  var prog = ss.getSheetByName(SHEET_PROG), set = ss.getSheetByName(SHEET_SET);
  if (!prog || !set) throw new Error("Onglets manquants : lancez setup() depuis l'éditeur.");
  var pv = prog.getDataRange().getValues(), sv = set.getDataRange().getValues();
  var r = stateFromValues_(pv, sv);
  r.progValues = pv; r.setValues = sv; r.prog = prog; r.set = set;
  return r;
}

function writeState_(ss, data, s) {
  // Programme : colonnes C..E réécrites en un seul appel.
  var pv = data.progValues, missing = [];
  var rows = [];
  for (var i = 1; i < pv.length; i++) rows.push([pv[i][2], pv[i][3], pv[i][4]]);
  UNITS.forEach(function (u) {
    var cells = [s.durations[u.id] !== undefined ? s.durations[u.id] : u.duration,
                 typeof s.anchors[u.id] === "number" ? new Date(s.anchors[u.id]) : "",
                 s.pauseMs[u.id] ? s.pauseMs[u.id] / 60000 : 0];
    var r = data.progRow[u.id];
    if (r === undefined) missing.push([u.id, u.title].concat(cells));
    else rows[r - 1] = cells;
  });
  if (rows.length) data.prog.getRange(2, 3, rows.length, 3).setValues(rows);
  if (missing.length) data.prog.getRange(pv.length + 1, 1, missing.length, 5).setValues(missing);

  // Réglages : colonne B réécrite en un seul appel.
  var sv = data.setValues, vals = [], extra = [];
  for (var j = 1; j < sv.length; j++) vals.push([sv[j][1]]);
  var want = {};
  want[KEY_START] = new Date(s.start);
  want[KEY_PID] = s.paused ? s.paused.id : "";
  want[KEY_PSINCE] = s.paused ? new Date(s.paused.since) : "";
  want[KEY_REV] = s.rev;
  SET_KEYS.forEach(function (k) {
    var r = data.setRow[normKey_(k)];
    if (r === undefined) extra.push([k, want[k]]);
    else if (k !== KEY_START) vals[r - 1] = [want[k]];     // le début prévu n'est jamais réécrit par une action
  });
  if (vals.length) data.set.getRange(2, 2, vals.length, 1).setValues(vals);
  if (extra.length) data.set.getRange(sv.length + 1, 1, extra.length, 2).setValues(extra);
}

function log_(ss, action, unitTitle, detail) {
  try {
    var sh = ss.getSheetByName(SHEET_LOG);
    if (!sh) { sh = ss.insertSheet(SHEET_LOG); sh.appendRow(LOG_HEADER); }
    sh.appendRow([new Date(), action, unitTitle || "", detail || ""]);
  } catch (e) { /* le journal ne doit jamais bloquer une action */ }
}

function clearCache_() { try { CacheService.getScriptCache().remove(CACHE_KEY); } catch (e) {} }

function pinConfigured_() {
  var p = PropertiesService.getScriptProperties().getProperty("MC_PIN");
  return !!(p && String(p).trim());
}

function checkPin_(pin) {
  var expected = PropertiesService.getScriptProperties().getProperty("MC_PIN");
  if (!expected || !String(expected).trim())
    return { ok: false, error: "Code PIN non configuré. Le propriétaire doit créer la propriété MC_PIN (Paramètres du projet > Propriétés du script).", noPin: true };
  if (String(pin || "").trim() !== String(expected).trim()) {
    Utilities.sleep(1200);   // ralentit les essais au hasard
    try { log_(getSs_(), "PIN refusé", "", ""); } catch (e) {}
    return { ok: false, error: "Code PIN incorrect.", badPin: true };
  }
  return { ok: true };
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ======================================================================
   Points d'entrée
   ====================================================================== */

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (String(p.format || "").toLowerCase().indexOf("json") === 0) {   // tolère "?format=json" ajouté deux fois
    try { return json_(feed_()); }
    catch (err) { return ContentService.createTextOutput('{"ok":false,"error":"feed"}').setMimeType(ContentService.MimeType.JSON); }
  }
  try {
    var t = HtmlService.createTemplateFromFile("Control");
    t.engineSrc = galaEngineFactory_.toString();
    return t.evaluate()
      .setTitle("Régie MC · Gala LIONGATE")
      .addMetaTag("viewport", "width=device-width, initial-scale=1, viewport-fit=cover");
  } catch (err) {
    return HtmlService.createHtmlOutput("<p style='font-family:sans-serif'>Erreur du panneau : " +
      String(err && err.message || err).replace(/[<>&]/g, "") + "</p>");
  }
}

function feed_() {
  try {
    var body = null, cache = null;
    try { cache = CacheService.getScriptCache(); var hit = cache.get(CACHE_KEY); if (hit) body = JSON.parse(hit); } catch (e) { body = null; }
    if (!body) {
      body = feedBody_(readAll_(getSs_()).state);
      try { if (cache) cache.put(CACHE_KEY, JSON.stringify(body), CACHE_SECONDS); } catch (e) {}
    }
    body.ok = true;
    body.serverTime = Date.now();
    return body;
  } catch (e) {
    return { ok: false, error: String(e && e.message || e), serverTime: Date.now() };
  }
}

// Panneau : état public + titres (aucun PIN nécessaire pour lire).
function mcState() {
  try {
    var d = readAll_(getSs_());
    var b = panelBody_(d.state, d.titles, pinConfigured_());
    b.serverTime = Date.now();
    return b;
  } catch (e) {
    return { ok: false, error: "Lecture impossible : " + String(e && e.message || e), serverTime: Date.now() };
  }
}

function mcCheckPin(pin) {
  try { return checkPin_(pin); }
  catch (e) { return { ok: false, error: "Erreur serveur : " + String(e && e.message || e) }; }
}

function mcAction(pin, action, arg, expectRev) {
  try {
    var chk = checkPin_(pin);
    if (!chk.ok) return chk;
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return { ok: false, error: "Serveur occupé, réessayez dans quelques secondes." };
    try {
      var ss = getSs_(), d = readAll_(ss), st = d.state, now = Date.now();
      var fresh = function (s, titles) { var b = panelBody_(s, titles, true); b.serverTime = Date.now(); return b; };
      if (action === "next" && expectRev !== null && expectRev !== undefined && Number(expectRev) !== st.rev)
        return { ok: false, stale: true, error: "Le déroulé vient de changer. Vérifiez l'étape en cours puis réessayez.", state: fresh(st, d.titles) };
      var r = applyAction_(st, action, arg, now);
      if (r.error) return { ok: false, error: r.error, state: fresh(st, d.titles) };
      r.state.rev = st.rev + 1;
      writeState_(ss, d, r.state);
      log_(ss, r.label, r.unit ? (d.titles[r.unit] || r.unit) : "", r.detail);
      SpreadsheetApp.flush();
      clearCache_();
      return { ok: true, message: r.message, state: fresh(r.state, d.titles) };
    } finally {
      lock.releaseLock();
    }
  } catch (e) {
    return { ok: false, error: "Erreur serveur : " + String(e && e.message || e) };
  }
}

/* Déclencheur simple : une modification manuelle du Sheet (secours) incrémente la révision,
   vide le cache et laisse une trace dans le Journal. */
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    var sh = e.range.getSheet(), name = sh.getName();
    if (name !== SHEET_PROG && name !== SHEET_SET) return;
    var ss = sh.getParent(), set = ss.getSheetByName(SHEET_SET);
    if (set) {
      var sv = set.getDataRange().getValues();
      for (var r = 1; r < sv.length; r++) {
        if (normKey_(sv[r][0]) === normKey_(KEY_REV)) {
          var isRevCell = name === SHEET_SET && e.range.getRow() === r + 1 && e.range.getColumn() <= 2 && e.range.getLastColumn() >= 2;
          if (!isRevCell) set.getRange(r + 1, 2).setValue((parseInt(sv[r][1], 10) || 0) + 1);
          break;
        }
      }
    }
    clearCache_();
    var v = e.range.getNumRows() === 1 && e.range.getNumColumns() === 1 ? e.range.getDisplayValue() : "(plusieurs cellules)";
    log_(ss, "Édition manuelle", name + "!" + e.range.getA1Notation(), String(v));
  } catch (err) { /* ne jamais bloquer l'édition */ }
}

/* ======================================================================
   setup() : à lancer une fois depuis l'éditeur (relançable sans perte)
   ====================================================================== */

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Ouvrez ce script depuis le Google Sheet (Extensions > Apps Script).");
  ss.setSpreadsheetTimeZone(TZ);
  PropertiesService.getScriptProperties().setProperty("SHEET_ID", ss.getId());

  // --- Programme
  var prog = ss.getSheetByName(SHEET_PROG) || ss.insertSheet(SHEET_PROG, 0);
  var old = prog.getLastRow() ? prog.getDataRange().getValues() : [];
  var byId = {}, others = [];
  for (var i = 1; i < old.length; i++) {
    var id = String(old[i][0] || "").trim();
    if (unitIndex_(id) >= 0 && !byId[id]) byId[id] = old[i];
    else if (old[i].join("") !== "") others.push(old[i].slice(0, 5));
  }
  var rows = [PROG_HEADER];
  UNITS.forEach(function (u) {
    var o = byId[u.id];
    rows.push([u.id,
      o && String(o[1]).trim() ? o[1] : u.title,
      o && o[2] !== "" ? o[2] : u.duration,
      o ? o[3] : "",
      o && o[4] !== "" ? o[4] : 0]);
  });
  others.forEach(function (r) { while (r.length < 5) r.push(""); rows.push(r); });
  prog.clearContents();
  prog.getRange(1, 1, rows.length, 5).setValues(rows);
  prog.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#441212").setFontColor("#f1d7a1");
  prog.setFrozenRows(1);
  prog.getRange(2, 3, UNITS.length, 1).setNumberFormat("0.##");
  prog.getRange(2, 4, UNITS.length, 1).setNumberFormat("dd/MM/yyyy HH:mm:ss");
  prog.getRange(2, 5, UNITS.length, 1).setNumberFormat("0.00");
  prog.getRange(2, 4, UNITS.length, 2).setBackground("#f2eee9");
  prog.setColumnWidth(1, 110); prog.setColumnWidth(2, 330); prog.setColumnWidth(3, 100);
  prog.setColumnWidth(4, 170); prog.setColumnWidth(5, 170);

  // --- Réglages
  var set = ss.getSheetByName(SHEET_SET) || ss.insertSheet(SHEET_SET, 1);
  var sOld = set.getLastRow() ? set.getDataRange().getValues() : [];
  var sMap = {};
  for (var j = 1; j < sOld.length; j++) sMap[normKey_(sOld[j][0])] = sOld[j][1];
  var startVal = sMap[normKey_(KEY_START)];
  if (cellMs_(startVal === undefined ? "" : startVal, DEFAULT_START) === null) startVal = new Date(DEFAULT_START);
  var help = {};
  help[KEY_START] = "Heure prévue de la première étape (heure de Douala). Modifiable.";
  help[KEY_PID] = "Rempli par le panneau MC (auto).";
  help[KEY_PSINCE] = "Rempli par le panneau MC (auto).";
  help[KEY_REV] = "Compteur de modifications (auto).";
  var sRows = [["réglage", "valeur", "aide"],
    [KEY_START, startVal, help[KEY_START]],
    [KEY_PID, sMap[normKey_(KEY_PID)] !== undefined ? sMap[normKey_(KEY_PID)] : "", help[KEY_PID]],
    [KEY_PSINCE, sMap[normKey_(KEY_PSINCE)] !== undefined ? sMap[normKey_(KEY_PSINCE)] : "", help[KEY_PSINCE]],
    [KEY_REV, parseInt(sMap[normKey_(KEY_REV)], 10) || 0, help[KEY_REV]]];
  set.clearContents();
  set.getRange(1, 1, sRows.length, 3).setValues(sRows);
  set.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#441212").setFontColor("#f1d7a1");
  set.setFrozenRows(1);
  set.getRange(2, 2).setNumberFormat("dd/MM/yyyy HH:mm");
  set.getRange(4, 2).setNumberFormat("dd/MM/yyyy HH:mm:ss");
  set.getRange(5, 2).setNumberFormat("0");
  set.getRange(3, 2, 3, 1).setBackground("#f2eee9");
  set.setColumnWidth(1, 180); set.setColumnWidth(2, 170); set.setColumnWidth(3, 420);

  // --- Journal
  var logSh = ss.getSheetByName(SHEET_LOG) || ss.insertSheet(SHEET_LOG, 2);
  if (!logSh.getLastRow()) logSh.appendRow(LOG_HEADER);
  logSh.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#441212").setFontColor("#f1d7a1");
  logSh.setFrozenRows(1);
  logSh.getRange("A:A").setNumberFormat("dd/MM/yyyy HH:mm:ss");
  logSh.setColumnWidth(1, 160); logSh.setColumnWidth(2, 170); logSh.setColumnWidth(3, 300); logSh.setColumnWidth(4, 320);

  // --- Protections (avertissement seulement) sur les colonnes gérées par le script
  [prog, set].forEach(function (sh) {
    sh.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (p) {
      if (p.getDescription() === PROTECT_TAG) p.remove();
    });
  });
  prog.getRange(2, 1, UNITS.length, 1).protect().setDescription(PROTECT_TAG).setWarningOnly(true);
  prog.getRange(2, 4, UNITS.length, 2).protect().setDescription(PROTECT_TAG).setWarningOnly(true);
  set.getRange(3, 2, 3, 1).protect().setDescription(PROTECT_TAG).setWarningOnly(true);

  // --- Feuille vide par défaut ("Feuille 1" / "Sheet1") supprimée seulement si elle est vide
  ss.getSheets().forEach(function (sh) {
    var n = sh.getName();
    if ([SHEET_PROG, SHEET_SET, SHEET_LOG].indexOf(n) < 0 && /^(feuille ?1|sheet ?1)$/i.test(n) &&
        sh.getLastRow() === 0 && sh.getLastColumn() === 0 && ss.getSheets().length > 1) ss.deleteSheet(sh);
  });

  SpreadsheetApp.flush();
  clearCache_();
  log_(ss, "setup", "", "onglets créés / normalisés");
  Logger.log("OK : onglets prêts. MC_PIN configuré : " + (pinConfigured_() ? "oui" : "NON (à créer dans Propriétés du script)"));
}

/* Export pour les tests node (ignoré par Apps Script, où `module` n'existe pas). */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    UNITS: UNITS, DEFAULT_START: DEFAULT_START, applyAction_: applyAction_, actStartNow_: actStartNow_,
    actNext_: actNext_, actPause_: actPause_, actResume_: actResume_, actAdjust_: actAdjust_,
    actBackToPlan_: actBackToPlan_, stateFromValues_: stateFromValues_, feedBody_: feedBody_,
    panelBody_: panelBody_, cellMs_: cellMs_, atTime_: atTime_, hhmm_: hhmm_, schedule_: schedule_,
    doGet: doGet, setup: setup, mcState: mcState, mcCheckPin: mcCheckPin, mcAction: mcAction, onEdit: onEdit
  };
}
