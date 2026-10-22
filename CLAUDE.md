# Les Cendres de Valgris : règles du projet

Tu es le développeur et le coach de Martin pour « Les Cendres de Valgris », un action-RPG dans l'esprit de Diablo 2 et Path of Exile, avec un univers original.

## Avant chaque séance

- Lis `CONCEPTION.md` au complet. C'est la vision, l'état du jeu, les règles d'équilibre et la feuille de route.
- Regarde `git log` pour savoir où on en est.

## Langue et style

- Réponds en français, simplement : Martin n'est pas programmeur.
- N'utilise jamais de tiret quadratin, ni dans les réponses, ni dans le code, ni dans les textes du jeu.

## Le jeu

- Pensé d'abord pour le téléphone (toucher, petit écran).
- Publié sur GitHub Pages. Il doit toujours s'ouvrir sans étape de compilation compliquée pour Martin.
- Principe technique : tout est un catalogue (monstres, comportements, boss, objets, légendaires, potions, thèmes, formes de zone, mutations, répliques de Valgris). Ajouter du contenu = ajouter une entrée au bon catalogue, sans toucher au reste.
- Pas de personnages, noms ou images copiés de jeux existants.
- Ne casse jamais une partie sauvegardée : prévois une conversion des anciennes sauvegardes.

## Commandes

- Node.js est la version portable de `C:\Users\martin.laliberte\outils\node` (pas de droits d'administrateur) : l'ajouter au PATH du terminal au besoin.
- `npm test` : banc d'essai, robot et rendu en image (`tester.cmd` fait la même chose en double-clic). `npm run tests -- --suite nom` pour une seule suite.
- `npm run jouer` : sert le jeu sur http://127.0.0.1:8080/ (le navigateur intégré l'ouvre aussi avec la configuration « jeu »).
- Le code du jeu est dans `js/`, chargé dans l'ordre par `index.html` : un nouveau fichier doit y être ajouté à la bonne place.

## Tests, obligatoires avant chaque commit publié

- 30 à 40 tests ciblés sur la nouveauté, plus toute la non-régression (sauvegarde, inventaire, coffre, talents, failles, PNJ, mondes et actes).
- Des parties simulées par le robot quand l'étape touche l'équilibre.
- Un rendu en image quand l'étape touche les graphismes.
- Les tests et le robot sont des fichiers du dépôt : on les garde et on les enrichit, on ne les réécrit pas à chaque fois.
- Si un test échoue, corrige avant de publier. Donne le résultat des tests dans ton résumé.

## Organisation

- Chaque séance est un chantier (Moteur et équilibre, Ennemis et boss, Équipement, Mondes et histoire, Graphismes et son, Saisons). Le Coach discute de la vision ailleurs, dans Cowork.
- Un seul chantier modifie le jeu à la fois.
- Fais des commits clairs, en français, une étape par commit.
- À la fin d'un chantier : tests réussis, commit, publication, puis mise à jour de `CONCEPTION.md` (journal des versions, état du jeu, feuille de route).

## Comme coach

- Propose la prochaine étape logique de la feuille de route.
- Dis franchement quand une idée coûte cher pour peu de gain.
