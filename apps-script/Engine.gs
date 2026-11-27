/*
  Engine.gs · copie EXACTE du moteur du site (engine.js), pour Google Apps Script.
  Ne pas modifier ce fichier à la main : modifier engine.js puis recopier.
  Seule l'enveloppe change : le corps de engine.js est placé dans galaEngineFactory_(root),
  exécutée ici pour le serveur, et envoyée telle quelle au panneau MC (Control.html).
*/
/*
  MOTEUR DU DÉROULÉ · Gala LIONGATE
  ---------------------------------
  Pure function shared by the website (engine.js) and the Google Apps Script (copy as Engine.gs).
  No DOM, no Date.now() inside: "now" is always passed in. Works in browsers and Apps Script V8.

  plan  = { start: ms (planned start of the first unit),
            units: [{ id, duration: minutes }] }   // ordered, sub-steps already flattened
  live  = { durations: { id: minutes },            // MC overrides of length
            anchors:   { id: ms },                 // "commence maintenant" / "étape suivante" stamps
            pauseMs:   { id: ms },                 // pause time already accumulated on a unit
            paused:    { id, since: ms } | null }  // current pause
  now   = ms

  Rules
  - start[0] = anchor[0] ?? plan.start
  - start[i] = anchor[i] ?? end[i-1]          (an anchor re-bases this unit and everything after it)
  - end[i]   = start[i] + duration[i] + pauseMs[i] (+ now - paused.since while this unit is paused)
  - Anchors are only honoured if they are later than the previous unit's start; older anchors that would
    go back in time are ignored (protects against stale anchors after "revenir au plan" partial edits).
  - While paused on unit k, the current unit is k regardless of the clock (it never auto-advances).
*/
function galaEngineFactory_(root) {
  function computeSchedule(plan, live, now) {
    live = live || {};
    var durations = live.durations || {}, anchors = live.anchors || {}, pauseMs = live.pauseMs || {}, paused = live.paused || null;
    var units = plan.units || [], out = [], prevEnd = plan.start, prevStart = -Infinity;
    for (var i = 0; i < units.length; i++) {
      var u = units[i];
      var dur = num(durations[u.id], u.duration) * 60000;
      var a = anchors[u.id];
      var start = (typeof a === "number" && a > prevStart) ? a : prevEnd;
      var extra = num(pauseMs[u.id], 0);
      if (paused && paused.id === u.id && typeof paused.since === "number") extra += Math.max(0, now - paused.since);
      var end = start + dur + extra;
      out.push({ id: u.id, start: start, end: end, duration: dur, paused: !!(paused && paused.id === u.id) });
      prevStart = start; prevEnd = end;
    }
    var current = -1;
    if (paused) { for (var k = 0; k < out.length; k++) if (out[k].id === paused.id) current = k; }
    if (current < 0) { for (var j = 0; j < out.length; j++) if (now >= out[j].start) current = j; }
    var first = out.length ? out[0].start : plan.start, last = out.length ? out[out.length - 1].end : plan.start;
    var phase = !out.length ? "before" : now < first && current < 0 ? "before" : (now >= last && !paused) ? "after" : "live";
    if (phase === "after") current = -1;
    return {
      units: out, current: current, phase: phase, first: first, end: last,
      next: phase === "before" ? 0 : (current >= 0 && current + 1 < out.length ? current + 1 : -1)
    };
  }
  function num(v, d) { v = typeof v === "string" ? parseFloat(v.replace(",", ".")) : v; return (typeof v === "number" && isFinite(v) && v >= 0) ? v : d; }

  // Validates a state object coming from the network; returns a clean `live` or null.
  function cleanLive(x, ids) {
    if (!x || typeof x !== "object") return null;
    var ok = {}; ids.forEach(function (id) { ok[id] = 1; });
    function map(o, f) { var r = {}; if (o && typeof o === "object") for (var k in o) if (ok[k]) { var v = f(o[k]); if (v !== null) r[k] = v; } return r; }
    var ms = function (v) { v = Number(v); return isFinite(v) && v > 1.5e12 && v < 2.5e12 ? v : null; };
    var mins = function (v) { v = num(v, -1); return v >= 0 && v <= 600 ? v : null; };
    var pos = function (v) { v = Number(v); return isFinite(v) && v >= 0 && v < 864e5 ? v : null; };
    var p = x.paused && ok[x.paused.id] && ms(x.paused.since) ? { id: x.paused.id, since: ms(x.paused.since) } : null;
    return { durations: map(x.durations, mins), anchors: map(x.anchors, ms), pauseMs: map(x.pauseMs, pos), paused: p, start: ms(x.start) };
  }

  var api = { computeSchedule: computeSchedule, cleanLive: cleanLive };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.GalaEngine = api;
}
galaEngineFactory_(typeof globalThis !== "undefined" ? globalThis : this);
