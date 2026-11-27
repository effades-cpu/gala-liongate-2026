# Gala LIONGATE · 28 novembre 2026

Présentation en direct de la soirée : les teasers en couverture, puis le déroulé étape par étape. Chaque étape s'ouvre toute seule à son heure, avec l'intervenant et ses contenus.

En ligne : https://effades-cpu.github.io/gala-liongate-2026/

## Les adresses à utiliser

| Pour | Adresse |
|---|---|
| Le public (téléphones) | `https://effades-cpu.github.io/gala-liongate-2026/` |
| L'écran de la salle (vidéoprojecteur) | **Toujours** `https://effades-cpu.github.io/gala-liongate-2026/?ecran=1`, puis cliquer **Plein écran** (ou touche **F**). Ce clic active aussi le son. Après un rechargement de la page, recliquer une fois pour retrouver le son. |
| La MC (régie des horaires) | le lien du panneau Apps Script (voir `DEPLOIEMENT-APPS-SCRIPT.md` et `MC-GUIDE.md`) |

Sur l'écran de la salle :
- les flèches, Page précédente et Page suivante (télécommande de présentation) changent de section ;
- **M** coupe ou rétablit le son ;
- **Échap** quitte le plein écran.

## Ce qui se passe pendant la soirée

- **Avant le début** : les deux teasers tournent en boucle, avec le compte à rebours dans l'en-tête.
- **Étapes sans intervenant** (Accueil, Intermède, Cocktail) : une scène plein écran et l'étape « À suivre ».
- **Étapes avec intervenant** :
  - à gauche, la carte de l'intervenant et le déroulé ;
  - à droite, ses sections (logos, carrousels, produits, texte et image…) ;
  - dans l'en-tête, le temps restant et l'heure de fin de soirée.
- **Projection du spot** : c'est une sous-étape de « Vision DRC & Présentation de la marque ». Sur l'écran de la salle, la version française passe puis la version anglaise ; sur les téléphones, la version de la langue choisie.
- **Les horaires** viennent du Google Sheet de la MC : « Commence maintenant », « Étape suivante », « Pause », ± minutes. Si le Sheet n'est pas joignable, la page garde les derniers horaires reçus, sinon ceux de `content.js`.

## Modifier le contenu

Tout se trouve dans **`content.js`** : textes FR/EN, intervenants, durées prévues et sections de chaque étape. L'en-tête du fichier explique chaque mise en page :
- `logos`, `logo-alternate`, `title`, `text-image`, `carousel`, `products`, `timeline`, `quote`, `spots` ;
- `duration` en secondes pour une section ;
- `every` pour la vitesse d'un carrousel.

Exemple, « un carrousel qui défile 30 secondes, images 1 à 2 du dossier photos » :
```js
{ layout: "carousel", duration: 30, every: 5, images: ["assets/photos/dsc07951.webp", "assets/photos/dsc07955.webp"] },
```

Les médias sont dans `assets/` (versions web des fichiers d'origine) :
- `assets/video` : teasers et spots en MP4 H.264 1080p, avec leurs images d'attente ;
- `assets/logos` ;
- `assets/photos` : photos de campagne, converties depuis les RAW ;
- `assets/products/my-secret-skin` et `assets/products/inception`.

## Tester un horaire précis sans attendre

Ajouter `?t=18:05` à l'adresse pour voir la page comme à 18h05 le 28 novembre (exemple : `…/?t=18:27&ecran=1` pour la projection du spot).

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | La page (mise en page, animations, plein écran) |
| `content.js` | Le contenu |
| `engine.js` | Le calcul du déroulé (partagé avec l'Apps Script) |
| `apps-script/` | Le code du panneau de la MC et du flux d'horaires |
| `DEPLOIEMENT-APPS-SCRIPT.md` | Mise en place du Google Sheet et de l'Apps Script (une seule fois, environ 10 min) |
| `MC-GUIDE.md` | Guide d'une page pour la MC |

## Mise en ligne (une seule fois)

Settings > Pages > Source : « Deploy from a branch », branche `main`, dossier `/ (root)`.
