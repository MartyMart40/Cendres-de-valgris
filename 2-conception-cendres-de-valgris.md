# Document de conception : Les Cendres de Valgris

Version du document : 22 octobre 2026

## Vision

Un action-RPG sombre en vue isométrique, jouable au téléphone, avec du butin à collectionner, des talents à spécialiser et une progression presque infinie. Inspirations : Diablo 2 et Path of Exile. Univers, noms et graphismes originaux.

Priorités : plaisir au toucher, sensation de puissance qui grandit, jamais de blocage, sauvegarde solide.

## État actuel du jeu

### Monde
- Camp de Halveth : Ancien Corvel (quêtes), Bram le colporteur (achat et vente), Sœur Éline (soins), Hilde la forgeronne (monte un objet au niveau du héros), coffre, pierre de faille, point de passage.
- Acte I : Plaine des Cendres, Crypte oubliée, Antre de Varsha. Cartes générées au hasard.
- Quêtes : les plaines souillées (12 créatures), le Reliquaire de l’Aube (coffre doré de la crypte), la Mère des Cendres (boss Varsha).
- Points de passage, parchemins de portail, sorties entre zones.
- Failles sans fin : ouvertes après Varsha. 50 monstres puis un gardien. Chaque gardien vaincu ouvre le niveau suivant et donne un point de talent la première fois. Records de temps par faille.

### Monstres
- Rôdeur cendreux, Charognard, Archer d’os, Sorcier d’os, Ombre geignarde, Brute calcinée, Varsha (boss), gardiens de faille.
- Champions (bleus), gardiens (violets, salves et invocations).

### Objets
- 10 emplacements : arme, main gauche, casque, armure, gants, bottes, ceinture, amulette, deux anneaux.
- Raretés : normal (gris), magique (bleu), rare (jaune), légendaire (orange, 11 légendaires avec pouvoir unique).
- 17 types de bonus (dégâts, vie, armure, critique, vol de vie, vitesse, sorts, découverte d’objets, blocage, +1 à toutes les compétences, etc.).
- 5 paliers d’allure selon le niveau de l’objet : Cuir (moins de 12), Fer (12 à 27), Acier (28 à 49), Chevalier (50 à 79), Paladin (80 et plus). Le nom, l’icône et l’apparence du héros suivent le palier.
- Inventaire en grille de 12 × 5 cases. Tailles : anneau, amulette, orbe 1×1 ; ceinture 2×1 ; casque, gants, bottes, bouclier 2×2 ; armure, hache 2×3 ; épée, masse 1×3 ; dague 1×2 ; bâton 1×4.
- Coffre : 4 onglets de 12 × 8 cases.
- Comparaison ▲ ▼ en pourcentage de puissance, bouton « Équiper le meilleur ».

### Talents
- 26 talents en 3 branches (Guerre, Pyromancie, Rempart), 7 paliers chacune.
- Un palier demande un niveau ET des points déjà placés dans la branche :
  - niveaux : 1, 4, 8, 14, 22, 35, 50
  - points dans la branche : 0, 3, 8, 15, 25, 40, 60
- Un ultime par branche (Avatar des Cendres, Cataclysme, Égide divine) et un talent sans fin par branche.
- Rangs jusqu’à 1 000 000. Points : 1 par niveau, 1 de plus tous les 5 niveaux, 1 par nouvelle faille vaincue.
- Barre de 4 compétences.

### Autres
- Sons synthétisés (coupables dans Stats), records de faille, aimant à or.
- Sauvegarde automatique dans le navigateur, avec conversion des anciennes versions.

## Règles d’équilibre (chiffres clés)

- Courbe de puissance commune : G(L) = (1 + 0,15 × (L − 1)) × 1,05^(L − 1). Elle règle la vie et les dégâts des monstres, les stats des objets et la vie de base du héros.
- Niveau des monstres d’une faille n : 6 + n.
- Durcissement des failles : vie × 1,10^n, dégâts × 1,055^n.
- Réduction par l’armure : armure ÷ (armure + 30 × G(niveau du monstre)), au plus 85 %.
- Plafonds : 6 attaques par seconde (7,8 avec l’Avatar), 60 % de blocage, 20 % de vol de vie, 75 % de critique, 6 % de vie regagnée par seconde.
- Expérience : 50 × niveau^1,6 pour monter.
- Objectif mesuré par le robot : environ la faille 60 à 70 après 2 heures, avec un mur qui commence vers 45 à 55. Les 4 styles (Tourbillon, Feu, Givre, Éclairs) doivent rester à moins de 20 % d’écart.

## Méthode de travail

- Le jeu est une seule page HTML, publiée en artefact.
- Tests à chaque étape : 30 à 40 tests automatiques, plus la non-régression. Total actuel : environ 105 tests (24 de base, 7 forge et sorts, 32 inventaire, 42 talents) et des tests de toucher sur chaque PNJ.
- Simulations : un robot joue l’Acte I puis les failles pendant 2 heures de jeu simulé, avec 4 styles de talents.
- Rendus en image pour vérifier le héros, les icônes et l’inventaire.

## Feuille de route

Phase 1, consolidation (prochaines étapes possibles)
- Écran d’aide ou tutoriel court au premier lancement.
- Affixes de champions dans les failles (rapide, enflammé, robuste).
- Réglage fin après tes premières vraies parties.

Phase 2, contenu
- Acte II : nouveau camp, 3 zones, nouveau boss, nouveaux monstres.
- Ensembles d’objets (bonus à 2, 4 et 6 pièces).
- Gemmes ou artisanat pour améliorer un objet.

Phase 3, graphismes (option simple)
- Animations de marche et d’attaque en 8 directions, monstres plus détaillés, sols et murs plus riches.
- Estimation : 15 à 25 étapes.

Phase 4, projet plus gros (long terme, à décider plus tard)
- Vraies images faites par un artiste ou un générateur d’images.
- Passage à Claude Code et à un dépôt GitHub quand le jeu dépassera un seul fichier.

## Journal des versions

- v1 : Acte I, quêtes, points de passage, portails, butin de base.
- v2 : graphismes améliorés, correction du dialogue avec les PNJ, premières simulations.
- v3 : 10 emplacements, raretés et légendaires, compétences, failles sans fin.
- v3.1 : file d’attente des sorts, rééquilibrage des styles, forgeronne, sons, records.
- v4 : inventaire en grille, poupée d’équipement, coffre, icônes par type et palier, héros qui change selon chaque pièce.
- v5 : arbre de 26 talents, ultimes, talents sans fin, rangs jusqu’à 1 000 000, barre de 4 compétences.
- v5.1 : un emplacement vide prend toujours l’objet avec « Équiper le meilleur ».
