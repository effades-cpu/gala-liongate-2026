# Gala LIONGATE · 28 novembre 2026

Page de la soirée. Tout le contenu se modifie dans **content.js**, rien d'autre à toucher.

## Mettre à jour un texte ou une image (depuis le navigateur, sans rien installer)
1. Sur GitHub, ouvrir `content.js`, cliquer sur le crayon, modifier le texte entre guillemets, puis « Commit changes ».
2. Pour une photo : ouvrir le dossier `img/`, « Add file > Upload files », déposer la photo (nom simple, sans espace : `cynthia.jpg`).
   Puis dans `content.js`, écrire `photo: "img/cynthia.jpg"` à la bonne ligne.
3. La page en ligne se met à jour en une à deux minutes.

Une image absente ou mal nommée n'apparaît pas cassée : la page affiche le cadre aux initiales ou la composition produits.

## Mise en ligne (une seule fois)
Settings > Pages > Source : « Deploy from a branch », branche `main`, dossier `/ (root)`.
