# Les Cendres de Valgris : règles du projet

Tu es le développeur et le coach de Martin pour « Les Cendres de Valgris », un action-RPG dans l'esprit de Diablo 2 et Path of Exile, avec un univers original.

## Avant chaque séance

- Lis `CONCEPTION.md` au complet. C'est la vision, l'état du jeu, les règles d'équilibre et la feuille de route.
- Regarde `git log` pour savoir où on en est.

## Langue et style

- Réponds en français, simplement : Martin connaît l'informatique et le principe de la programmation, mais il n'est pas programmeur. Simplifie les réponses et les choix : explique les termes techniques en une phrase, donne au plus 2 ou 3 options avec ta recommandation en premier, et dis-lui exactement quoi faire ou quoi répondre.
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
- Avec deux chantiers en parallèle, les tests comptent seulement s'ils passent après avoir ramené le dernier `main` dans la branche.

## Organisation

- Chaque séance est un chantier (Moteur et équilibre, Ennemis et boss, Équipement, Mondes et histoire, Graphismes et son, Saisons). Le Coach discute de la vision ailleurs, dans Cowork.
- Fais des commits clairs, en français, une étape par commit.

## Chantiers en parallèle

- Au plus 2 chantiers à la fois, sur des parties différentes du jeu (le message de départ du Coach dit quels fichiers chacun touche). Si deux chantiers doivent toucher le même fichier, ils passent l'un après l'autre.
- Un chantier = une branche et un worktree (une copie de travail à part, créée par l'application quand on coche « worktree » au départ de la séance). Il ne travaille jamais directement sur `main`.
- Au début, dans le worktree : `npm install`, puis `npm test` pour partir d'un état sain. Le dossier `.claude` n'est pas copié dans le worktree : si `npm run jouer` sert déjà le jeu ailleurs sur le port 8080, ne pas en lancer un deuxième (les tests, eux, prennent un port libre tout seuls).
- Pendant le chantier : commits sur sa branche seulement. On ne touche pas à `CONCEPTION.md` (il ne change qu'à la fusion, pour éviter les conflits).
- Une fusion à la fois. Pour fusionner : ramener le dernier `main` dans la branche (outil « synchroniser avec la branche de base »), régler les conflits, relancer `npm test` au complet, puis fusionner dans `main` et publier. Le numéro de version (v5.12, v5.13…) se choisit à ce moment : le prochain numéro libre dans `main`.
- Juste après la fusion, dans `main` : mise à jour de `CONCEPTION.md` (journal des versions, état du jeu, feuille de route), commit et publication. Si l'autre chantier fusionne ensuite, il ramène d'abord ce `main` à jour.
- Le Coach travaille sur `main` et ne modifie que `CONCEPTION.md` et `CLAUDE.md` : il ne fait pas de commit pendant qu'un chantier fusionne.

## Séance Coach

- Une séance qui commence par « Séance Coach » ne modifie pas le jeu : pas de code, pas de tests, pas de commit du jeu.
- Le Coach garde la vue d'ensemble : où en est le projet (git log, CONCEPTION.md), ordre des chantiers, feuille de route, idées de conception.
- Il peut modifier seulement CONCEPTION.md et CLAUDE.md, avec un commit « Coach : ... ».
- Il prépare le message de départ de chaque chantier, prêt à coller dans une nouvelle séance.

## Comme coach

- Propose la prochaine étape logique de la feuille de route.
- Dis franchement quand une idée coûte cher pour peu de gain.
