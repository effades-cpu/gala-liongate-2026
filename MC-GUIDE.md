# Guide MC · Régie du Gala LIONGATE (28/11/2026)

**Ouvrir** le lien de la régie sur votre téléphone (ajouté à l'écran d'accueil). **Code PIN** demandé une seule fois.
Le grand écran et les téléphones du public suivent vos actions en **environ 10 secondes**.
Sans action de votre part, les étapes s'enchaînent **toutes seules** selon leur durée.

## Avant l'ouverture des portes (obligatoire)

Les essais de la veille laissent des traces dans le Sheet (« début réel », pause, durées modifiées). Avant l'arrivée des invités :

1. Dans le panneau, appuyer sur **Revenir au plan**.
2. Dans l'onglet **Programme**, vérifier la colonne `durée (min)` : 30, 4, 5, 5, 3, 8, 4, 5, 145 (ou les durées décidées le jour même). Les colonnes « début réel » et « pause cumulée » doivent être vides.
3. Dans l'onglet **Réglages**, vérifier `début prévu` = 28/11/2026 17:30 et que `pause en cours` est vide.
4. Ouvrir le site : l'en-tête doit afficher **Bientôt** et le compte à rebours.
5. Sur l'ordinateur de la salle, ouvrir `…/?ecran=1`, cliquer **Plein écran** (ce clic active le son). De préférence une connexion filaire ou 4G pour cet ordinateur.

Le site ignore de toute façon les « début réel » et la « pause en cours » enregistrés plus de 12 h avant le début prévu. En revanche, les durées modifiées et la colonne « pause cumulée » restent appliquées, et une répétition le jour même n'est pas filtrée : après **toute** répétition, appuyer sur « Revenir au plan » (étape 1) et vérifier que la colonne « pause cumulée » est vide (étape 2).

## L'écran

- **En haut** : l'heure de Douala et l'état de la connexion (« synchronisé » ou « hors ligne »).
- **Carte bordeaux** : l'étape en cours, le **temps restant** (et le **dépassement** en orange, s'il y en a).
- **Déroulé** : toutes les étapes avec leurs horaires recalculés ; l'étape en cours est encadrée.

## Les boutons

| Bouton | Ce qu'il fait |
|---|---|
| **Commence maintenant** (sur chaque étape) | Cette étape démarre **à la minute** ; toutes les étapes suivantes se recalculent depuis leurs durées. Une confirmation est demandée. |
| **Étape suivante** | Termine l'étape en cours **maintenant** et lance celle indiquée sous le bouton. |
| **Pause** | Fige l'étape en cours : le compte à rebours s'arrête (sur l'écran de la salle aussi, avec « En pause »), rien n'avance tout seul. Les étapes suivantes sont décalées d'autant. |
| **Reprendre** | Relance l'étape ; les étapes suivantes sont décalées de la durée de la pause. |
| **−5 min / −1 min / +1 min / +5 min** | Raccourcit ou allonge l'étape en cours (avant le début : l'Accueil). La suite se décale. S'il reste moins de 5 min, −5 min fait la même chose qu'« Étape suivante » (l'étape suivante commence maintenant, rien n'est sauté) : le panneau demande confirmation. |
| **Revenir au plan** | Efface toutes les corrections d'horaires et les pauses, garde les durées. Confirmation demandée. |

## Cas concrets

**La soirée commence en retard.** Prévu à 17:30, l'Accueil commence réellement à 18:00.
- À **18:00**, appuyez sur **« Commence maintenant »** sur **Accueil et photocall** : l'Accueil dure ses 30 min, l'Ouverture passe à 18:30, et tout le reste suit.
- **ou**, si l'accueil a déjà eu lieu et que les discours commencent à 18:00 : appuyez sur **« Commence maintenant »** sur **Ouverture** à 18:00. Le reste se recalcule à partir de 18:00.

**Un intervenant dépasse son temps.**
- Appuyez sur **Pause** : l'étape reste à l'écran, rien ne passe à la suite.
- Quand il conclut : **Étape suivante** pour enchaîner tout de suite, **ou** **Reprendre** si sa présentation continue (le temps restant repart d'où il était).
- Vous pouvez aussi simplement ajouter **+1 min** ou **+5 min**.

**Un intervenant termine en avance.** Appuyez sur **Étape suivante**.

**Une étape est sautée ou l'ordre change.** Appuyez sur **« Commence maintenant »** sur l'étape qui commence réellement.

**Tout est faux, on repart de zéro.** **Revenir au plan** (puis, si besoin, **Commence maintenant** sur l'étape en cours).

## Bon à savoir

- Pendant l'envoi, les boutons sont grisés : **un seul appui suffit**. Un message confirme chaque action.
- « Code PIN incorrect » : retapez le PIN. « Le déroulé vient de changer » : regardez l'étape en cours, puis réappuyez si nécessaire.
- « Hors ligne » : vérifiez le réseau ; le grand écran continue tout seul avec le dernier état reçu.
- Chaque action est notée dans l'onglet **Journal** du Google Sheet.
