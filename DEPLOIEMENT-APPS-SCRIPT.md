# Déployer la régie MC (Google Sheet + Apps Script) · environ 10 minutes

La régie a deux parties, toutes les deux sur **votre** compte Google :

- **Le flux public** (lecture seule) : le site le lit toutes les 10 secondes pour connaître les horaires en direct. Il ne contient **que des heures et des durées** : aucune donnée personnelle, aucun secret.
- **Le panneau MC** : une page pour téléphone avec les boutons « Commence maintenant », « Étape suivante », « Pause », etc. Chaque action exige le **code PIN** que vous choisissez.

Les fichiers à copier se trouvent dans le dossier `apps-script/` du dépôt :
`Code.gs`, `Engine.gs`, `Control.html`, `appsscript.json`.

---

## 1. Créer le Google Sheet (1 min)

1. Ouvrez <https://sheets.new> avec votre compte Google.
2. Renommez le fichier, par exemple **« Gala LIONGATE · Régie »**.

## 2. Ouvrir l'éditeur Apps Script (30 s)

Dans le Sheet : menu **Extensions › Apps Script**. Un éditeur s'ouvre dans un nouvel onglet avec un fichier `Code.gs`.
Renommez le projet (en haut à gauche, « Projet sans titre ») en **« Régie Gala »**.

## 3. Coller les 4 fichiers (3 min)

1. **Code.gs** : sélectionnez tout le contenu du fichier `Code.gs` de l'éditeur, supprimez-le, puis collez **tout** le contenu de `apps-script/Code.gs`.
2. **Engine.gs** : cliquez sur **+** (à côté de « Fichiers ») › **Script**, nommez-le `Engine` (l'éditeur ajoute `.gs`), puis collez tout le contenu de `apps-script/Engine.gs`.
3. **Control.html** : cliquez sur **+** › **HTML**, nommez-le `Control` (exactement, sans `.html`), puis remplacez le contenu par celui de `apps-script/Control.html`.
4. **appsscript.json** (le manifeste) : cliquez sur l'engrenage **Paramètres du projet** (barre de gauche), cochez **« Afficher le fichier manifeste "appsscript.json" dans l'éditeur »**. Revenez à l'éditeur (icône `< >`), ouvrez `appsscript.json` et remplacez son contenu par celui de `apps-script/appsscript.json`.
5. Cliquez sur **Enregistrer** (icône disquette, ou Ctrl+S).

## 4. Lancer `setup()` et autoriser (2 min)

1. Dans l'éditeur, ouvrez `Code.gs`. Dans la liste déroulante à côté de **Exécuter**, choisissez **`setup`**, puis cliquez sur **Exécuter**.
2. Google demande une autorisation : **Examiner les autorisations** › choisissez votre compte.
3. Un écran « Google n'a pas validé cette application » peut apparaître (normal pour un script personnel) : cliquez sur **Paramètres avancés** › **Accéder à Régie Gala (non sécurisé)** › **Autoriser**.
4. Le journal d'exécution doit afficher : `OK : onglets prêts.`

Revenez dans le Sheet : il contient maintenant 3 onglets.

| Onglet | Contenu |
|---|---|
| **Programme** | une ligne par étape : `id`, `titre`, `durée (min)`, `début réel (auto)`, `pause cumulée (auto, min)` |
| **Réglages** | `début prévu` (28/11/2026 17:30, heure de Douala), `pause en cours (id)`, `pause depuis`, `révision` |
| **Journal** | une ligne par action (horodatage, action, étape, détail) |

Le fuseau du Sheet est réglé sur **Africa/Douala**. Les colonnes « auto » sont protégées par un simple avertissement. Vous pouvez relancer `setup()` sans rien perdre : les durées et titres modifiés sont conservés.

## 5. Choisir le code PIN de la MC (1 min)

1. Dans l'éditeur : engrenage **Paramètres du projet** › tout en bas, **Propriétés du script** › **Ajouter une propriété du script**.
2. **Propriété** : `MC_PIN` · **Valeur** : un code de **6 chiffres ou plus** (évitez 123456, une date de naissance…).
3. **Enregistrer les propriétés du script**.

Le PIN n'est jamais dans le dépôt GitHub ni dans le Sheet. Sans cette propriété, le panneau refuse toutes les actions avec un message clair.

## 6. Déployer en application Web (2 min)

1. En haut à droite : **Déployer › Nouveau déploiement**.
2. Engrenage à côté de « Sélectionner le type » › **Application Web**.
3. **Description** : `Gala v1`.
4. **Exécuter en tant que** : **Moi** (votre adresse).
5. **Qui a accès** : **Tout le monde**.
6. **Déployer**. Si Google redemande l'autorisation, acceptez comme à l'étape 4.
7. Copiez l'**URL de l'application Web**. Elle ressemble à :
   `https://script.google.com/macros/s/AKfy…long…/exec`

## 7. Tester (1 min)

- **Flux public** : ouvrez dans un navigateur l'URL copiée suivie de `?format=json` :
  `https://script.google.com/macros/s/AKfy…/exec?format=json`
  Vous devez voir un texte qui commence par `{"ok":true,` avec `start`, `durations`, `anchors`, `serverTime`.
- **Panneau MC** : ouvrez l'URL **sans** `?format=json`. Le panneau s'affiche, entrez le PIN, il est mémorisé.
  Pour un essai : appuyez sur « +1 min », vérifiez que l'onglet **Journal** a une nouvelle ligne, puis **« Revenir au plan »** et remettez la durée d'Accueil à 30 dans le Sheet.

## 7 bis. Avant l'ouverture des portes (obligatoire)

Les essais de la veille laissent des traces dans le Sheet (« début réel », pause, durées modifiées). Avant l'arrivée des invités :

1. Dans le panneau, appuyer sur **Revenir au plan**.
2. Dans l'onglet **Programme**, vérifier la colonne `durée (min)` : 30 · 4 · 4 · 5 · 5 · 3 · 8 · 4 · 5 · 145 (ou les durées décidées le jour même). Les colonnes « début réel » et « pause cumulée » doivent être vides.
3. Dans l'onglet **Réglages**, vérifier `début prévu` = 28/11/2026 17:30 et que `pause en cours` est vide.
4. Ouvrir le site : l'en-tête doit afficher **Bientôt** et le compte à rebours.
5. Sur l'ordinateur de la salle, ouvrir `…/?ecran=1`, cliquer **Plein écran** (ce clic active le son). De préférence une connexion filaire ou 4G pour cet ordinateur.

Le site ignore de toute façon les « début réel » et la « pause en cours » enregistrés plus de 12 h avant le début prévu. En revanche, les durées modifiées et la colonne « pause cumulée » restent appliquées, et une répétition le jour même n'est pas filtrée : après **toute** répétition, appuyer sur « Revenir au plan » (étape 1) et vérifier que la colonne « pause cumulée » est vide (étape 2).

## 8. Brancher le site (1 min)

Dans le dépôt, ouvrez `content.js`. Vers la ligne 25, remplacez :

```js
  liveUrl: "",
```

par votre URL `/exec` (sans `?format=json`) :

```js
  liveUrl: "https://script.google.com/macros/s/AKfy…/exec",
```

Enregistrez et faites un commit sur la branche `main` : GitHub Pages met le site en ligne tout de suite (1 à 2 min). Faites-le **après** la fusion de la pull request. En ~10 secondes, le site suit les actions de la MC. Si le flux est injoignable, le site garde le dernier état reçu puis revient au plan de `content.js` : la page ne reste jamais vide.

## 9. Donner le panneau à la MC

- Envoyez-lui l'URL `/exec` (sans paramètre) et le **PIN séparément** (par exemple de vive voix). Attention : cette URL sera visible dans `content.js` (dépôt public). C'est donc le **PIN qui protège** le panneau : choisissez-en un de 6 chiffres ou plus.
- Sur son téléphone : ouvrir le lien › **Ajouter à l'écran d'accueil** (Safari : bouton Partager ; Chrome : menu ⋮).
- Elle entre le PIN une seule fois. Lien « Changer de code PIN » en bas du panneau si besoin.
- Un bandeau Google « Cette application a été créée par un utilisateur de Google Apps Script » peut s'afficher en haut : c'est normal.
- Guide d'une page pour elle : `MC-GUIDE.md`.

## 10. Après une modification du code : redéployer (URL inchangée)

Une modification du script n'est **pas** en ligne tant que vous ne publiez pas une nouvelle version :
**Déployer › Gérer les déploiements** › sélectionnez « Gala v1 » › **crayon (Modifier)** › **Version : Nouvelle version** › **Déployer**.
L'URL `/exec` reste **la même** : rien à changer dans `content.js` ni chez la MC.
(Ne partagez pas l'URL `/dev` de « Tester les déploiements » : elle exige votre connexion Google.)

## Secours : modifier directement le Sheet

Si le panneau ne répond plus, le Sheet reste utilisable (le site le reflète en ~10 s) :
- **Changer une durée** : colonne `durée (min)` de l'onglet **Programme**.
- **« Cette étape commence à… »** : tapez l'heure (ex. `18:05`) dans `début réel (auto)` de l'étape, et **videz** les cellules `début réel` des étapes suivantes. Pour **sauter** des étapes, remplissez aussi le `début réel` de chaque étape sautée (une minute plus tôt suffit) : sinon le site ignore l'heure tapée. Le bouton « Commence maintenant » du panneau fait tout cela automatiquement : préférez-le.
- **Annuler une correction** : videz la cellule `début réel` concernée.
- **Lever une pause** : videz `pause en cours (id)` et `pause depuis` dans **Réglages**.
- **Décaler tout le programme** : modifiez `début prévu` dans **Réglages**.

Chaque modification manuelle est notée dans le **Journal** (« Édition manuelle »).

## Sécurité, en bref

- Le flux `?format=json` est **public et en lecture seule** : il ne contient que des heures et des durées.
- Toute action passe par le **PIN** (vérifié sur le serveur ; un mauvais PIN est refusé, ralenti et noté au Journal « PIN refusé »).
- Le script s'exécute sous votre compte. Il ne lit et n'écrit que ce Sheet, mais l'écran d'autorisation de Google demande un accès plus large (« tous vos fichiers Sheets ») : c'est normal. Vous pouvez tout couper à tout moment : **Déployer › Gérer les déploiements › Archiver**.
