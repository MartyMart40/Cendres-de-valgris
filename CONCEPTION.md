# Conception : Les Cendres de Valgris

Mis à jour le 22 octobre 2026 · Martin

Document de référence du jeu. Chaque chantier le lit au début et le met à jour à la fin.

## Liens

- Jouer (téléphone ou ordinateur) : https://martymart40.github.io/Cendres-de-valgris/ (GitHub Pages, mis à jour tout seul à chaque envoi sur GitHub).
- Dépôt : https://github.com/MartyMart40/Cendres-de-valgris (public, seule source de vérité depuis la v5.8).
- Archives, à ne plus modifier : l'ancien artefact du jeu (https://claude.ai/artifact/R197THvp93MsnVjV9UxNoM) et l'ancien Claude Doc de conception (https://claude.ai/artifact/V9aKNqAvSoWKEfmtQd3ZKA).
- Un seul chantier modifie le jeu à la fois.

## Vision

Un action-RPG sombre en vue isométrique, jouable au téléphone, avec du butin à collectionner, des talents à spécialiser et une progression presque infinie. Inspirations : Diablo 2 et Path of Exile. Univers, noms et graphismes originaux.

Priorités : plaisir au toucher, sensation de puissance qui grandit, jamais de blocage, sauvegarde solide.

### Vision long terme

- Jeu infini, toujours plus difficile, toujours surprenant, sur une base solide.
- Graphismes simples pour l'instant. Le niveau Path of Exile 2 est abandonné.
- Les Cycles : camp, zones, puis Valgris sous une nouvelle forme. Après sa défaite, le monde se transforme (nouveau thème, nouvelle quête, difficulté plus haute).
- Valgris est le boss final de chaque cycle (clin d'œil à Martin).
- Surprises : à chaque cycle terminé et chaque semaine réelle (tirage automatique). Chantiers « Saison » plus tard pour du contenu inventé par Claude.
- Principe de base : chaque partie a son propre monde. Deux joueurs n'ont jamais les mêmes zones, ni dans le même ordre. La mutation de la semaine est la même pour tous, pour que les amis puissent la comparer.
- Difficulté réglée sur des durées cibles fournies par Martin, vérifiées par le robot.

### Structure d'un monde

- Chaque monde a 2 actes. Acte I : boss Varsha (ou sa forme du monde). Acte II : boss Valgris.
- Durée visée : au moins 4 heures par acte, donc environ 8 heures par monde au premier passage.
- Chaque acte a des mini-boss (acolytes de Varsha, lieutenants de Valgris). On peut les contourner, mais sans leur expérience et leur butin, on est trop faible pour le boss.
- Les boss se farment : chaque boss a un butin rare propre à lui, avec une très petite chance de tomber.
- Changer de monde, c'est un saut de difficulté comme Normal vers Cauchemar. Celui qui rush Valgris sans s'être équipé aura de la misère dans le monde suivant.
- Porte scellée (en jeu depuis v5.5) : l'antre du boss s'ouvre après avoir battu au moins 2 de ses 3 acolytes ou lieutenants. Une fois ouverte, elle le reste pour le farm.

### Formes de zone

Aucune zone ne doit ressembler à la précédente. Une zone = une forme + un thème + parfois un événement, tirés au hasard.

| Forme | Comment ça se joue |
| --- | --- |
| Labyrinthe | Couloirs et salles (en jeu) |
| Grand couloir | Longue ligne droite, avec embuscades et événements en chemin (en jeu : alcôves à embuscades et coffres) |
| Arène | Vagues continues de monstres, la sortie s'ouvre quand tout est mort (en jeu : 4 vagues, coffre au centre) |
| Grande plaine | Grand carré ouvert, groupes de monstres dispersés (en jeu) |
| Archipel | Îlots reliés par des ponts étroits (idée de Claude) |
| Spirale | On avance vers le centre, où attend un mini-boss (idée de Claude) |
| Descente | Plusieurs petits étages d'affilée, de plus en plus durs (idée de Claude) |
| Zone qui rétrécit | Les cendres envahissent la carte, il faut avancer vite (idée de Claude) |

### Boss du monde 1 (décidé)

Acolytes de Varsha (Acte I, 2 sur 3 pour ouvrir l'antre) :

| Acolyte | Comment il se bat |
| --- | --- |
| Ossira la Tisseuse | Tend des toiles qui ralentissent, il faut bouger sans arrêt |
| Korr le Brûle-Tombes | Brute qui charge et laisse une traînée de feu |
| Méliane la Pleureuse | Ombre qui se téléporte et invoque des pleureuses |

Lieutenants de Valgris (Acte II, 2 sur 3 pour ouvrir l'antre) :

| Lieutenant | Comment il se bat |
| --- | --- |
| Le Héraut gris | Son étendard renforce les monstres autour : abattre l'étendard d'abord |
| Dame Cinéraire | Couvre le sol de zones de cendre brûlante |
| Le Forgeron sans visage | Armure à briser avant de pouvoir le blesser |

Valgris, forme du monde 1, en 3 phases (en jeu depuis v5.6) :

1. Il se bat seul, au corps à corps.
2. Il rappelle les échos des lieutenants que tu as battus : plus tu en as battu, plus il en rappelle.
3. L'arène rétrécit sous les cendres, il faut finir vite.

Chaque acolyte, lieutenant et forme de Valgris a son butin rare propre, à faible chance.

### Valgris ne meurt jamais

- Valgris est « imbattable » : c'est la blague du jeu (Valgris, c'est Martin).
- À zéro de vie, il ne meurt pas et ne plie jamais : il tombe, le héros croit avoir gagné (« Enfin… j'ai réussi. »), puis il se relève sous sa vraie forme, immense. Il dit : « C'est bien. Tu t'es bien débrouillé. Tu viens de passer le test. Mais d'autres tests t'attendent, si tu les acceptes. » (en jeu depuis v5.7)
- Il devient une entité divine, te lance un nouveau défi, puis disparaît.
- Tu réapparais dans un nouveau monde, et c'est là que son butin tombe.
- Ton : sombre, avec une touche d'humour dans ses répliques. Une réplique différente à chaque monde.

À zéro de vie, Valgris laisse le choix (en jeu depuis v5.6 ; « Accepter le défi » mène au monde suivant depuis v5.8, et reste grisé au dernier monde existant) :

- « Accepter le défi » : départ vers le nouveau monde, où son gros butin attend.
- « Pas encore » : il rit, traite le joueur de prudent, laisse un butin normal. On reste et on peut le refarmer autant qu'on veut.

À l'arrivée dans un nouveau monde, une réplique de Valgris présente le thème (exemple : « Ici, les licornes mordent. Bonne chance. »).

### Passage d'un monde à l'autre (décidé)

- On garde : héros, niveau, talents, inventaire, coffre, records de faille.
- Ce qui change : zones, monstres, camp et PNJ (mêmes rôles, nouveaux visages), difficulté.
- Les failles restent la fin de partie infinie, accessibles depuis chaque monde, à son niveau.
- On peut retourner dans un monde déjà fait par la pierre de faille du camp. Le butin y reste au niveau de ce monde (utile pour chercher un objet rare, pas pour progresser).

### Banque de thèmes de départ

Le monde 1 est toujours Cendres. Ensuite, chaque saut tire un thème pas encore vu.

| Thème | Ambiance | Monstres typiques |
| --- | --- | --- |
| Cendres | Sombre et brûlé (monde 1) | Rôdeurs, archers d'os, ombres |
| Givre éternel | Glaciers, tempêtes, ruines gelées | Loups de givre, spectres glacés |
| Marais putride | Brume, eau stagnante, champignons géants | Crapauds, sangsues, sorcières |
| Royaume des licornes | Couleurs vives, mais tout mord | Licornes enragées, fées piquantes |
| Forge céleste | Îles flottantes, machines d'airain | Automates, gardiens dorés |

Au début, les monstres d'un thème réutilisent les comportements existants avec une nouvelle allure. Les vrais nouveaux monstres arrivent ensuite, en continu.

### Principe technique : tout est un catalogue

Martin va ajouter du contenu sans arrêt (monstre à deux têtes qui crache du feu, gorille géant aux bras immenses qui tourne, nouvelles potions, etc.). Le code doit donc être organisé en catalogues : monstres, comportements, boss, objets, légendaires, potions, thèmes, formes de zone, mutations, répliques de Valgris. Ajouter une chose = ajouter une entrée au bon catalogue, sans toucher au reste du jeu.

### Banque d'événements (idées à construire plus tard)

- Portail d'invasion : un portail s'ouvre sans prévenir en pleine zone, et des monstres d'un autre thème (exemple : licornes) envahissent. Un compte à rebours démarre pour fermer le portail. En cas d'échec, la zone se transforme dans le thème envahisseur, avec des monstres plus durs et un meilleur butin, jusqu'à ce qu'on la quitte. L'échec reste amusant, il ne punit pas la progression.

## État actuel du jeu (v5.9)

### Monde

- Camp de Halveth : Ancien Corvel (quêtes), Bram le colporteur (achat et vente), Sœur Éline (soins), Hilde la forgeronne (monte un objet au niveau du héros), coffre, pierre de faille, point de passage.
- Deux mondes jouables, chacun à 2 actes. Monde 1 : Cendres. Monde 2 : Givre éternel (camp Refuge de Brumegel, niveaux de 18 à 38 environ), atteint en acceptant le défi de Valgris ; retour possible par la pierre de faille. Acte I : 5 zones tirées avec la graine de la partie, puis l'Antre de Varsha. La première zone est toujours la Plaine des Cendres ; les autres tirent une forme (grande plaine, labyrinthe, grand couloir, arène), un nom et un décor, sans jamais deux formes pareilles de suite. Niveaux 1 à 7, antre niveau 10. Points de passage en zones 1, 3 et 5. Acte II : 5 zones tirées (niveaux 11 à 17, noms propres à l'acte II) puis le Sanctuaire de Valgris (niveau 19). On y descend par une sortie qui s'ouvre au fond de l'antre de Varsha une fois celle-ci vaincue.
- Quêtes : les plaines souillées (12 créatures), les acolytes de Varsha (2 sur 3 brisent le sceau de l'antre, qui reste ouvert), la Mère des Cendres (boss Varsha) ; acte II : les lieutenants de Valgris (2 sur 3 ouvrent le Sanctuaire), puis Valgris.
- Points de passage, parchemins de portail, sorties entre zones.
- Failles sans fin : ouvertes après Varsha. 50 monstres puis un gardien. Chaque gardien vaincu ouvre le niveau suivant et donne un point de talent la première fois. Records de temps par faille.

### Monstres

- Rôdeur cendreux, Charognard, Archer d'os, Sorcier d'os, Ombre geignarde, Brute calcinée, Pleureuse, Varsha (boss), gardiens de faille. Acolytes de Varsha (un par zone tirée, jamais la première) : Ossira la Tisseuse (toiles qui ralentissent), Korr le Brûle-Tombes (charge annoncée, traînée de feu), Méliane la Pleureuse (téléportation, pleureuses). Dans une arène, l'acolyte arrive avec la dernière vague. Grand couloir : embuscades en groupe dans les alcôves. Lieutenants de Valgris (acte II) : le Héraut gris (son étendard le protège à 85 % et renforce les monstres proches, il le replante), Dame Cinéraire (cendre brûlante au sol, éclats à distance), le Forgeron sans visage (armure qui prend les coups ; brisée, il chancelle et devient fragile, puis la reforge). Valgris (niveau 20) : voir Boss du monde 1.
- Monde 2 : mêmes comportements, nouvelles allures (Loups de givre, Archers gelés, Spectres glacés, Colosses de glace), acolytes et lieutenants renommés (Korr le Brise-Glace, Dame Givrée…), Varsha des Glaces.
- Champions (bleus), gardiens (violets, salves et invocations).
- Note de Martin (Varsha trop facile) : renforcée en v5.5. Le robot met environ 1 minute à la battre au lieu de 15 s. À revoir avec les durées cibles.

### Objets

- 10 emplacements : arme, main gauche, casque, armure, gants, bottes, ceinture, amulette, deux anneaux.
- Raretés : normal (gris), magique (bleu), rare (jaune), légendaire (orange, 11 légendaires avec pouvoir unique).
- 17 types de bonus (dégâts, vie, armure, critique, vol de vie, vitesse, sorts, découverte d'objets, blocage, +1 à toutes les compétences, etc.).
- 5 paliers d'allure selon le niveau de l'objet : Cuir (moins de 12), Fer (12 à 27), Acier (28 à 49), Chevalier (50 à 79), Paladin (80 et plus). Le nom, l'icône et l'apparence du héros suivent le palier.
- Inventaire en grille de 12 × 5 cases. Tailles : anneau, amulette, orbe 1×1 ; ceinture 2×1 ; casque, gants, bottes, bouclier 2×2 ; armure, hache 2×3 ; épée, masse 1×3 ; dague 1×2 ; bâton 1×4.
- Coffre : 4 onglets de 12 × 8 cases.
- Comparaison ▲ ▼ en pourcentage de puissance, bouton « Équiper le meilleur ».

### Talents

- 26 talents en 3 branches (Guerre, Pyromancie, Rempart), 7 paliers chacune.
- Un palier demande un niveau ET des points déjà placés dans la branche :
  - niveaux : 1, 4, 8, 14, 22, 35, 50
  - points dans la branche : 0, 3, 8, 15, 25, 40, 60
- Un ultime par branche (Avatar des Cendres, Cataclysme, Égide divine) et un talent sans fin par branche.
- Rangs jusqu'à 1 000 000. Points : 1 par niveau, 1 de plus tous les 5 niveaux, 1 par nouvelle faille vaincue.
- Barre de 4 compétences.

### Autres

- Sons synthétisés (coupables dans Stats), records de faille, aimant à or.
- Sauvegarde automatique dans le navigateur, avec conversion des anciennes versions.

## Règles d'équilibre (chiffres clés)

- Courbe de puissance commune : G(L) = (1 + 0,15 × (L − 1)) × 1,05^(L − 1). Elle règle la vie et les dégâts des monstres, les stats des objets et la vie de base du héros.
- Niveau des monstres d'une faille n : 6 + n.
- Durcissement des failles : vie × 1,10^n, dégâts × 1,055^n.
- Réduction par l'armure : armure ÷ (armure + 30 × G(niveau du monstre)), au plus 85 %.
- Plafonds : 6 attaques par seconde (7,8 avec l'Avatar), 60 % de blocage, 20 % de vol de vie, 75 % de critique, 6 % de vie regagnée par seconde.
- Expérience : 50 × niveau^1,6 pour monter.
- Objectif mesuré par le robot : environ la faille 60 à 70 après 2 heures, avec un mur qui commence vers 45 à 55. Les 4 styles (Tourbillon, Feu, Givre, Éclairs) doivent rester à moins de 20 % d'écart.
- Durées cibles du monde 1 : Varsha vers 4 heures, Valgris vers 8 heures, en ayant battu les mini-boss. Le robot doit aussi vérifier qu'un joueur qui rush est trop faible pour le monde suivant.
- Acte I (v5.5) : zones de niveau 1 à 7, antre niveau 10, Varsha niveau 12 avec 1200 points de vie de base. Acolytes : un niveau au-dessus de leur zone, 200 à 320 points de vie de base, butin de boss. Arène : 4 vagues de 5, 7, 9 et 11 monstres. Mesure du robot (style Feu, sans esquive) : antre atteinte en 9 min au niveau 11, Varsha battue en 60 s. Le robot joue plus vite qu'un humain : ces chiffres servent à comparer les versions, pas à prédire les 4 heures visées.
- Acte II (v5.6) : zones de niveau 11 à 17, Sanctuaire niveau 19, Valgris niveau 20 avec 1000 points de vie de base (9 729 au niveau 20 ; le document disait 18 000 par erreur, corrigé au transfert). Lieutenants : 260 à 380 points de vie de base, un niveau au-dessus de leur zone. Mesure du robot (Feu, sans esquive, 5 parties) : acte II atteint vers 10 min au niveau 12, Valgris vers 20 min au niveau 19, amené à zéro 5 fois sur 5 en 60 à 280 s (médiane d'environ 2 minutes), 0 à 7 morts selon le butin trouvé.
- Monde 2 (v5.8) : même gabarit d'actes, niveaux +17 (acte I de 18 à 24, antre 27, Varsha des Glaces niveau 29), vie des monstres × 1,25, dégâts × 1,12, vie des boss d'acte × 0,55 en plus. Robot (Feu, sans esquive) : arrivée niveau 22, 0 à 2 morts sur la route, Varsha des Glaces battue 3 fois sur 3 en 1,5 à 5,5 min (0 à 7 morts). Un robot qui rush le monde 1 met 10 à 22 min contre elle : le rush est puni comme prévu.
- Mesures de référence du nouveau robot du dépôt (v5.8, graine 1, 2 heures de jeu simulé). Ce robot n'est pas celui des versions d'avant : ses chiffres servent de point de comparaison à partir d'ici.

  | Style | Antre | Varsha | Valgris à zéro | Niveau à 2 h | Faille à 2 h | Morts |
  | --- | --- | --- | --- | --- | --- | --- |
  | Feu | 11,5 min | 12,0 min | 21,3 min | 64 | 61 | 1 |
  | Givre | 12,8 min | 13,2 min | 20,2 min | 56 | 53 | 1 |
  | Éclairs | 10,1 min | 10,8 min | 19,6 min | 49 | 42 | 1 |
  | Tourbillon | 7,9 min | 8,4 min | 17,5 min | 59 | 58 | 0 |

  Feu est dans la cible (faille 60 à 70). Écart entre styles : 45 %, au-dessus de la cible de 20 % (Éclairs traîne).

## Méthode de travail

- Le code vit dans le dépôt GitHub, travaillé avec Claude Code. Chaque envoi sur GitHub met à jour le jeu en ligne (GitHub Pages) en une ou deux minutes.
- Le jeu s'ouvre sans compilation : `index.html` charge `css/style.css` puis les fichiers de `js/` dans l'ordre, avec de simples balises `<script>`.
  - `js/base.js` : outils communs et courbe G.
  - `js/catalogues/` : décors, formes de zone, thèmes, monstres, comportements, boss, mondes et actes, quêtes, fioles, répliques, failles, objets, talents. Ajouter du contenu = ajouter une entrée ici.
  - `js/moteur/` : génération des zones, combat, mise à jour, sauvegarde, statistiques, forge, sons, apparence du héros, icônes, rendu.
  - `js/interface/` : HUD, panneaux, touchers et clavier, inventaire et coffre.
  - `js/demarrage.js` : lance le jeu, toujours chargé en dernier.
  - Un nouveau fichier `js/` doit être ajouté dans `index.html`, à la bonne place dans l'ordre.
- Une seule commande roule tout : `npm test`, ou un double-clic sur `tester.cmd`. Environ une minute et demie.
  - Banc d'essai : 118 tests en 14 suites dans `tests/suites` (catalogues, équilibre, tirage des actes, formes de zone, acolytes et porte scellée, acte II et Valgris, monde 2, sauvegardes et conversions, inventaire, coffre, talents, forge et sorts, vrais touchers d'écran sur chaque PNJ, failles). On ajoute les tests d'une nouveauté dans la bonne suite, ou dans une nouvelle suite.
  - Robot (`tests/robot.js`) : joue les deux actes puis les failles, 2 heures de jeu simulé, 4 styles (Feu, Givre, Éclairs, Tourbillon), hasard fixé : deux parcours de la même version donnent les mêmes chiffres.
  - Rendu en image (`tests/rendu.js`) : 7 scènes sur un écran de téléphone, dans `tests/sortie/rendu`.
  - Commandes séparées : `npm run tests`, `npm run robot`, `npm run rendu`, et `npm run jouer` pour jouer sur l'ordinateur.
- Outils : Node.js portable dans `C:\Users\martin.laliberte\outils\node`, installé sans droits d'administrateur. Les tests pilotent Edge, déjà sur l'ordinateur.
- `tests/reference/v5.8.html` garde la v5.8 d'un seul fichier, et `outils/transfert/` les scripts du transfert : utiles seulement pour refaire la comparaison du transfert.
- Fin de chantier : `npm test` passe, commit, envoi sur GitHub (le jeu en ligne se met à jour), puis mise à jour de ce document (journal des versions, état du jeu, feuille de route).

### Chantiers

| Chantier | Rôle |
| --- | --- |
| Coach | Vision, ordre des chantiers, feuille de route |
| Moteur et équilibre | Cycles, difficulté, sauvegarde, robot |
| Ennemis et boss | Monstres, formes de Valgris, mécaniques |
| Équipement | Butin, ensembles, gemmes, artisanat |
| Mondes et histoire | Thèmes, quêtes, dialogues |
| Graphismes et son | Allure simple mais lisible |
| Saisons | Surprises nouvelles, plus tard |

## Feuille de route

0. Transfert vers GitHub et Claude Code (fait, 22 octobre 2026) : découpage en fichiers, tests et robot enregistrés, GitHub Pages.
1. Moteur : Mondes et actes (étapes 1 et 2 faites : v5.2 à v5.8)
   - Gabarit d'un monde : 2 actes, zones générées, mini-boss, boss d'acte, porte scellée (fait)
   - Acte II du monde 1 avec Valgris et ses lieutenants (fait, v5.6)
   - Acolytes de Varsha ajoutés à l'Acte I ; 4 formes de zone pour commencer (labyrinthe, grand couloir, arène, grande plaine) (fait), les autres ensuite
   - Butin rare propre à chaque boss
   - Passage au monde suivant : nouveau thème et saut de difficulté (fait, v5.8)
   - Banque de 4 ou 5 thèmes de départ (Givre éternel fait ; Marais putride, Royaume des licornes, Forge céleste à faire)
   - Mutation de la semaine (tirage automatique le lundi)
   - Rythme réglé sur les durées cibles (Varsha renforcée en v5.5 ; durées de 4 h par acte encore à régler)
   - Conversion des sauvegardes : partie en cours = monde 1 (fait)
2. Ennemis et boss : formes de Valgris, affixes de champions
3. Mondes et histoire : nouveaux thèmes, quêtes et dialogues liés aux mondes
4. Équipement : ensembles, gemmes, artisanat
5. Graphismes et son : quand Martin sera prêt
6. Saisons : contenu inventé par Claude, une fois la base solide

En attente : tutoriel court au premier lancement.

### Notes de Martin à traiter

- [ ] Portails : vérifier leur fonctionnement. Ils empiètent sur l'écran et bloquent les clics ailleurs ; quand un portail apparaît automatiquement, le joueur se retrouve coincé. Il faut distinguer clairement « je veux entrer dans le portail » de « je passe à côté » (ex. entrée seulement sur un geste voulu ou une confirmation).
- [ ] Équilibre des objets : plafonner les bonus. Aucun objet ne doit donner des valeurs absurdes (ex. plus de 90 000 % de dégâts). Revoir les formules de génération et ajouter des bornes.
- [ ] Bouton « Vendre tout » chez le marchand : vendre d'un coup tout l'inventaire, sauf l'équipement porté et les objets verrouillés (prévoir une confirmation).

Trouvé par le banc d'essai au transfert (pas corrigé, le transfert ne change pas le jeu) :

- [x] (corrigé en v5.9) Ancienne partie convertie : les points de talent sont remboursés, mais le message « Nouvel arbre de talents » ne s'affiche jamais (il est mis en attente juste avant l'entrée au camp, qui vide les messages en attente).
- [x] (corrigé en v5.9) Les récompenses des quêtes 2 et 3 donnent 3 fioles sans respecter le maximum de 15 (la quête 4, elle, le respecte). En fait seule la quête 2 était en cause : la quête 3 ne donne pas de fioles.
- [ ] À vérifier au doigt : un objet tombé au bord d'une case peut ne pas se ramasser quand on le touche, car le héros s'arrête au centre de la case (le robot s'y est fait prendre).
- [ ] Équilibre des styles : avec le robot du dépôt, Éclairs est 49 % derrière Feu à 2 heures en v5.9 (45 % en v5.8 ; cible : moins de 20 %).

## Journal des versions

| Version | Contenu |
| --- | --- |
| v5.9 | Chantier Moteur et équilibre : deux bogues trouvés au transfert. Une ancienne partie convertie affiche enfin le message « Nouvel arbre de talents » (il était effacé à l'entrée au camp) ; après une conversion v1, il vient juste après « Nouvelle version ». La récompense de la quête 2 respecte le maximum de 15 fioles, comme la quête 4. 118 tests réussis (5 nouveaux). Robot : Feu inchangé (faille 61), Tourbillon inchangé ; Givre faille 52 (53 avant), Éclairs faille 41 (42 avant), car le robot ne garde plus de fioles au-delà de 15. Écart entre styles : 49 %. |
| Transfert (v5.8) | Passage à GitHub et Claude Code, aucun changement de jeu. Le fichier unique est découpé en 39 fichiers selon les catalogues (chaque ligne de la v5.8 retrouvée une seule fois, intacte). Banc d'essai de 113 tests, robot (2 actes puis failles, 2 heures, 4 styles) et rendu en image enregistrés dans le dépôt, lancés par `npm test`. Comparaison avec la v5.8 d'un seul fichier : 113 tests réussis des deux côtés, robot identique au chiffre près, 7 images identiques au pixel près. Jeu en ligne sur GitHub Pages. Vie de Valgris corrigée dans ce document (9 729, pas 18 000). |
| v5.8 | Passage au monde suivant. « Accepter le défi » mène au monde 2, Givre éternel : camp Refuge de Brumegel (Vieille Maren, Torvald, Sœur Nivé, Kolbe), zones et monstres au thème du givre (mêmes comportements, nouvelles allures), Varsha des Glaces, nouvelles répliques de Valgris. Saut de difficulté (niveaux +17, vie × 1,25, dégâts × 1,12). Gros butin à l'arrivée. Quêtes et acolytes propres à chaque monde ; voyage entre mondes par la pierre de faille. 113 tests réussis. |
| v5.7 | Nouvelle fin de Valgris, à la demande de Martin : il ne plie plus. À zéro de vie, il tombe (« Valgris est tombé », le héros pense « Enfin… j'ai réussi »), puis se relève sous sa vraie forme : une immensité de cendre, d'ailes et de lumière blanche, couronnée de feu. Il dit que ce n'était qu'un test et que d'autres l'attendent. Scène d'environ 7 s, héros intouchable. Correction de grammaire. 96 tests réussis. |
| v5.6 | Acte II du monde 1 : 5 zones tirées (niveaux 11 à 17) puis le Sanctuaire de Valgris, ouvert après 2 des 3 lieutenants. Valgris en 3 phases. « Pas encore » fonctionne, « Accepter le défi » grisé en attendant le monde suivant. Quêtes 4 et 5. 90 tests réussis ; robot : Valgris amené à zéro 5 fois sur 5. |
| v5.5 | Porte scellée : l'antre s'ouvre après 2 des 3 acolytes et reste ouverte. Le Reliquaire est remplacé par la quête « Les acolytes de Varsha ». Varsha renforcée (niveau 12, 1200 points de vie de base, antre niveau 10, zones 1 à 7). Conversion des parties v5.4. 65 tests réussis ; robot : Varsha battue en 60 s en moyenne (15 s avant). |
| v5.4 | Les trois acolytes de Varsha, un par zone tirée (jamais la première). Butin de boss, se farment, visibles sur la mini-carte. 57 tests réussis. |
| v5.3 | Gabarit d'un monde à 2 actes. Acte I = 5 zones tirées avec la graine de la partie puis l'antre de Varsha. Nouvelles formes : Grand couloir et Arène. 43 tests réussis ; robot : antre atteinte en 8,6 min au niveau 9 (contre 4,8 min au niveau 6 en v5.1). |
| v5.2 | Code réorganisé en catalogues (décors, formes de zone, thèmes, monstres et comportements, boss, mondes et actes, quêtes, fioles). Sauvegarde v3 (monde, acte, graine) avec conversion des sauvegardes v1 et v2. Aucun changement de jeu. 45 tests réussis. |
| Doc 22 oct. 2026 | Document passé en Claude Doc. Ajout de la vision long terme, des chantiers et de la nouvelle feuille de route. |
| v5.1 | Un emplacement vide prend toujours l'objet avec « Équiper le meilleur ». |
| v5 | Arbre de 26 talents, ultimes, talents sans fin, rangs jusqu'à 1 000 000, barre de 4 compétences. |
| v4 | Inventaire en grille, poupée d'équipement, coffre, icônes par type et palier, héros qui change selon chaque pièce. |
| v3.1 | File d'attente des sorts, rééquilibrage des styles, forgeronne, sons, records. |
| v3 | 10 emplacements, raretés et légendaires, compétences, failles sans fin. |
| v2 | Graphismes améliorés, correction du dialogue avec les PNJ, premières simulations. |
| v1 | Acte I, quêtes, points de passage, portails, butin de base. |
