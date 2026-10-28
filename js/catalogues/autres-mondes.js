'use strict';
/* Monde 2 : même gabarit d’actes, monstres plus hauts et plus durs (saut de difficulté) */
WORLDS[2]={theme:'givre',acts:WORLDS[1].acts,lvlAdd:17,mult:{hp:1.6,dmg:1.2,boss:0.5}};
/* Monde 3 : Marais putride (v5.16). Même gabarit, nouvelles allures, saut de difficulté. */
WORLDS[3]={theme:'marais',acts:WORLDS[1].acts,lvlAdd:34,mult:{hp:2,dmg:1.35,boss:0.42}};
THEMES.marais={n:'Marais putride',camp:'Halte de Fangebourg',
  decor:THEMES.cendres.decor,
  names:{
    plaine:[['Tourbière grise','la '],['Marais aux Noyés','le '],['Lande spongieuse','la '],['Prés de vase','les ']],
    labyrinthe:[['Racines creuses','les '],['Crypte engloutie','la '],['Terriers de la Fange','les '],['Ossuaire moussu','l’']],
    couloir:[['Chaussée des Pendus','la '],['Gué des Sangsues','le '],['Sentier des Feux follets','le '],['Digue pourrie','la ']],
    arene:[['Fosse aux Crapauds','la '],['Cuvette de boue','la '],['Cercle des Saules','le '],['Mare du Glas','la ']]},
  names2:{
    plaine:[['Delta des Brumes','le '],['Champs de roseaux noirs','les '],['Lande des Murmures','la '],['Vasière sans fond','la ']],
    labyrinthe:[['Cryptes noyées','les '],['Dédale de racines','le '],['Caveaux de tourbe','les '],['Galeries suintantes','les ']],
    couloir:[['Route des Fièvres','la '],['Pont des Noyés','le '],['Couloir de lianes','le '],['Passe du Héraut moisi','la ']],
    arene:[['Arène de vase','l’'],['Fosse aux Fièvres','la '],['Cirque des Saules','le '],['Cercle de tourbe','le ']]},
  antre:{1:['Antre de Varsha des Tourbes','l’'],2:['Sanctuaire de Valgris','le ']},
  pools:THEMES.cendres.pools,
  pal:{plain:{floor:[58,66,42],wall:[84,92,60],dark:.84,amb:'170,200,140',ember:0,fog:true,rain:true},
    crypt:{floor:[42,50,38],wall:[70,82,58],dark:.9,fog:true,amb:'150,190,120'},
    lair:{floor:[46,54,32],wall:[78,88,50],dark:.86,amb:'160,220,110',fog:true,lavaAdd:[6,52,-10],lavaGlow:['#7aff4a','rgba(140,255,90,.9)'],lavaLight:'120,255,80'},
    town:{floor:[88,92,66],wall:[96,82,58],dark:.36}},
  npcs:{corvel:{full:'Mère Aulne',short:'Aulne',a:'la ',robe:['#5a7a4a','#22301a']},bram:{full:'Gaspard le passeur',robe:['#6a5a3a','#2a2214']},
    eline:{full:'Sœur Mousse',robe:['#9ab88a','#3a4a30']},hilde:{full:'Brune la ferronnière',robe:['#6a4a30','#2a1a10']},demol:{full:'Tourbier le démolisseur',robe:['#4a4a3a','#1a1a12']},joueuse:{full:'Ondine la joueuse',robe:['#5a8a6a','#1a3022']}},
  skins:{
    rodeur:{n:'Noyé des marais',col:'#5a7a4a'},charognard:{n:'Crapaud géant',fur:['#7a9a4a','#2a3a18','#5a7a3a']},
    archer:{n:'Archer pourri',bone:'#c8d0a0'},sorcier:{n:'Sorcière des tourbes',bone:'#b0c890'},ombre:{n:'Feu follet',gcol:'#a0ff80'},
    brute:{n:'Colosse de vase',col:'#4a5a32'},ver:{n:'Sangsue gonflée',fur:['#9a6a5a','#3a1a14','#c08070']},cracheur:{n:'Cracheur de bile',col:'#4a5a2a'},bouclier:{n:'Porte-bouclier noyé',bone:'#c8d0a0'},pleureuse:{n:'Larve des eaux',gcol:'#c0e090'},
    ossira:{n:'Ossira, Tisseuse de lianes',col:'#6a8a4a',wake:'Ossira tend ses lianes',death:'Ossira, Tisseuse de lianes, est vaincue'},
    korr:{n:'Korr le Pataugeur',col:'#5a6a32',wake:'Korr remue la vase',death:'Korr le Pataugeur est vaincu'},
    meliane:{n:'Méliane la Noyée',gcol:'#b0e0a0',wake:'Méliane remonte de l’eau',death:'Méliane la Noyée est vaincue',call:'Méliane gargouille : ses larves accourent.'},
    varsha:{n:'Varsha des Tourbes',pal:['#10200a','#4a7a2a','#142a0a','#2a4a1a'],wake:'Varsha des Tourbes s’éveille',call:'Varsha appelle ses rejetons de vase.',death:'Varsha des Tourbes retourne à la boue'},
    heraut:{n:'Le Héraut moisi',col:'#6a7a5a',wake:'Le Héraut moisi lève son étendard',death:'Le Héraut moisi est vaincu'},
    cineraire:{n:'Dame des Brumes',gcol:'#c8e0b8',wake:'Dame des Brumes répand sa fièvre',death:'Dame des Brumes est vaincue'},
    forgeron:{n:'Le Forgeron de rouille',col:'#6a4a2a',wake:'Le Forgeron de rouille frappe son enclume',death:'Le Forgeron de rouille est vaincu'},
    etendard:{n:'Étendard du Héraut moisi'}},
  qtext:{
    q1n:'Les tourbières',q2n:'Les acolytes de Varsha',q3n:'La Mère des Tourbes',q4n:'Les lieutenants de Valgris',q5n:'Valgris',
    q1c0:'« Tu sens cette odeur ? Le marais a gonflé la nuit où tu es arrivé. Les noyés marchent jusqu’aux pilotis. Éclaircis leurs rangs, et on causera. »',
    q1c1:'« Il en reste. Retourne dans la tourbière. »',
    q1c2:'« Bien. Écoute : Varsha a repris forme dans la boue. Son antre est scellé, et trois acolytes en nourrissent le sceau : Ossira, Korr et Méliane. Abats-en au moins deux. »',
    q2c1:'« Le sceau tient encore. Les acolytes rôdent sur le chemin de l’antre, chacun dans sa mare. »',
    q2c2:'« Le sceau a coulé comme une pierre. Varsha des Tourbes t’attend. »',
    q3c2:'« Varsha retourne à la boue ? Alors les eaux vont baisser un peu. Mais quelque chose rit sous la vase. »',
    q3end:'Varsha des Tourbes s’est dissoute dans la vase. Au fond de son antre, un passage descend sous les eaux : l’acte II t’attend.',
    q4c0:'« Ce rire, tu le connais mieux que moi : Valgris. Trois lieutenants gardent son Sanctuaire : le Héraut moisi, Dame des Brumes et le Forgeron de rouille. Abats-en au moins deux. »',
    q4c1:'« Les lieutenants tiennent encore le sceau. Le Héraut se cache derrière son étendard, la Dame répand sa fièvre, et le Forgeron ne saigne qu’une fois son armure brisée. »',
    q4c2:'« Le sceau a cédé. Va. Et ne bois pas l’eau. »',
    q5c2:'« Il s’est encore relevé ? Plus grand qu’un saule ? Alors le marais n’était qu’une marche de plus. »',
    q5end:'Valgris s’est relevé une troisième fois, couvert de vase et de lumière. D’autres mondes t’attendent.'}};
REPLIQUES.valgris[3]={arrive:'« Ici, tout pourrit lentement. Toi aussi, peut-être. »',phase2:'« Mes serviteurs flottent toujours. Ils remontent pour toi. »',phase3:'« La vase se referme. Ne t’enlise pas. »',
  fall:'Valgris est tombé',hero:'« Une troisième fois… c’est fini. »',rise:'La vase bouillonne. Quelque chose d’immense se relève, ruisselant.',
  ascend:['« Toujours debout ? J’aime ça. »','« Troisième test réussi. Tu commences à me ressembler. »','« Mais l’escalier descend encore. Si tu l’acceptes. »'],
  notyet:'« Pas encore ? Le marais garde tout. Moi aussi. »'};
/* Monde 4 : le Pré blême (v5.24, proposition). Les licornes des contes sont mortes ici, et quelque chose les a relevées.
   Ton sérieux et horrifique : chevaux blêmes et décharnés, cornes brisées qui luisent, pèlerins aveugles. */
WORLDS[4]={theme:'pre',acts:WORLDS[1].acts,lvlAdd:51,mult:{hp:2.7,dmg:1.5,boss:.36}};
THEMES.pre={n:'Pré blême',camp:'Le Dernier Enclos',
  decor:THEMES.cendres.decor,
  names:{
    plaine:[['Pré blême','le '],['Champs de crins','les '],['Lande des Cornes','la '],['Pâture des Pendus','la ']],
    labyrinthe:[['Haras englouti','le '],['Écuries d’ivoire','les '],['Ossuaire des Juments','l’'],['Stalles muettes','les ']],
    couloir:[['Sentier des Sabots','le '],['Allée des Licols','l’'],['Chemin de nacre','le '],['Gorge du Hennissement','la ']],
    arene:[['Manège d’os','le '],['Cercle des Cornes','le '],['Enclos du Glas','l’'],['Arène de nacre','l’']]},
  names2:{
    plaine:[['Pré des Agonies','le '],['Herbes de lune','les '],['Steppe livide','la '],['Champs du Dernier Galop','les ']],
    labyrinthe:[['Cryptes du Haras','les '],['Dédale des Licornes','le '],['Caveaux de nacre','les '],['Reliquaire des Cornes','le ']],
    couloir:[['Route des Cavaliers morts','la '],['Défilé des Crins','le '],['Couloir d’ivoire','le '],['Passe de la Jument','la ']],
    arene:[['Arène blême','l’'],['Fosse aux Juments','la '],['Cirque d’ivoire','le '],['Cercle du Dernier Galop','le ']]},
  antre:{1:['Antre de la Jument blême','l’'],2:['Sanctuaire de Valgris','le ']},
  pools:THEMES.cendres.pools,
  pal:{plain:{floor:[86,88,92],wall:[128,128,134],dark:.86,amb:'220,222,235',ember:0,fog:true},
    crypt:{floor:[60,60,68],wall:[104,100,110],dark:.9,fog:true,amb:'210,210,230'},
    lair:{floor:[54,52,60],wall:[96,92,102],dark:.88,amb:'230,230,250',fog:true,lavaAdd:[60,60,80],lavaGlow:['#e8e8ff','rgba(235,235,255,.9)'],lavaLight:'230,230,255'},
    town:{floor:[96,92,84],wall:[90,80,70],dark:.4}},
  npcs:{corvel:{full:'Frère Osric',short:'Osric',robe:['#6a6a74','#24242a']},bram:{full:'Hulda la marchande',robe:['#7a6a5a','#2a2018']},
    eline:{full:'Sœur Pâle',robe:['#d8d8e0','#7a7a88']},hilde:{full:'Aldo le maréchal-ferrant',robe:['#5a4a3a','#201810']},
    demol:{full:'Mordant le démolisseur',robe:['#4a4a50','#18181c']},joueuse:{full:'Vesna la joueuse',robe:['#6a3a5a','#241020']}},
  skins:{
    rodeur:{n:'Pèlerin aveugle',col:'#8a8a90'},charognard:{n:'Licorne déchue',fur:['#d8d8dc','#6a6a72','#c8c8d0'],steed:true},
    archer:{n:'Archer de nacre',bone:'#e8e4f0'},sorcier:{n:'Prêtre du Pré',bone:'#d0cce0'},ombre:{n:'Âme blême',gcol:'#e8e8ff'},
    brute:{n:'Colosse d’ivoire',col:'#c8c0b0'},ver:{n:'Rat blême',fur:['#e0e0e8','#6a6a72','#f0f0f8']},cracheur:{n:'Cracheur de nacre',col:'#9a96a4'},bouclier:{n:'Porte-bouclier d’ivoire',bone:'#e8e4f0'},pleureuse:{n:'Poulain spectral',gcol:'#f0f0ff'},
    ossira:{n:'Ossira, Tisseuse de crins',col:'#b8b8c8',wake:'Ossira tend ses crins',death:'Ossira, Tisseuse de crins, est vaincue'},
    korr:{n:'Korr la Corne-Brisée',col:'#9a9aa4',wake:'Korr racle le sol de son sabot',death:'Korr la Corne-Brisée est vaincu'},
    meliane:{n:'Méliane l’Égarée',gcol:'#f0f0ff',wake:'Méliane hennit dans le noir',death:'Méliane l’Égarée est vaincue',call:'Méliane appelle ses poulains.'},
    varsha:{n:'La Jument blême',steed:true,pal:['#202024','#d8d8e0','#3a3a44','#8a8a96'],wake:'La Jument blême se relève',call:'La Jument appelle ses licornes déchues.',death:'La Jument blême retombe'},
    heraut:{n:'Le Héraut d’ivoire',col:'#c8c4bc',wake:'Le Héraut d’ivoire lève son étendard',death:'Le Héraut d’ivoire est vaincu'},
    cineraire:{n:'Dame de Nacre',gcol:'#f4f0ff',wake:'Dame de Nacre répand sa poussière',death:'Dame de Nacre est vaincue'},
    forgeron:{n:'Le Forgeron de cornes',col:'#7a7480',wake:'Le Forgeron de cornes frappe son enclume',death:'Le Forgeron de cornes est vaincu'},
    etendard:{n:'Étendard d’ivoire'}},
  qtext:{
    q1n:'Le pré blême',q2n:'Les acolytes de la Jument',q3n:'La Jument blême',q4n:'Les lieutenants de Valgris',q5n:'Valgris',
    q1c0:'« On racontait aux enfants que les licornes vivaient ici. C’était vrai. Elles y sont mortes. Et la nuit dernière, elles se sont relevées. Éclaircis leurs rangs. »',
    q1c1:'« Il en reste. J’entends encore les sabots. »',
    q1c2:'« Bien. La Jument blême règne sur leur troupeau. Son antre est scellé, et trois acolytes en gardent le sceau : Ossira, Korr et Méliane. Abats-en au moins deux. »',
    q2c1:'« Le sceau tient encore. Suis le bruit des sabots. »',
    q2c2:'« Le sceau s’est fendu comme une corne. La Jument t’attend. »',
    q3c2:'« La Jument est retombée ? Prie pour qu’elle reste couchée. Quelque chose rit sous le pré. »',
    q3end:'La Jument blême est retombée dans l’herbe pâle. Au fond de son antre, un passage descend : l’acte II t’attend.',
    q4c0:'« Valgris, encore. Trois lieutenants gardent son Sanctuaire : le Héraut d’ivoire, Dame de Nacre et le Forgeron de cornes. Abats-en au moins deux. »',
    q4c1:'« Les lieutenants tiennent encore le sceau. Le Héraut se cache derrière son étendard, la Dame sème sa poussière, et le Forgeron ne saigne qu’une fois son armure brisée. »',
    q4c2:'« Le sceau a cédé. Ne regarde pas les licornes dans les yeux. »',
    q5c2:'« Une quatrième fois. Il grandit à chaque monde. Toi aussi, j’imagine. »',
    q5end:'Valgris s’est relevé une quatrième fois, couronné de cornes brisées. D’autres mondes t’attendent.'}};
REPLIQUES.valgris[4]={arrive:'« Les contes d’enfants finissent toujours mal ici. »',phase2:'« Mes serviteurs galopent encore. Écoute. »',phase3:'« Le pré se referme. Cours. »',
  fall:'Valgris est tombé',hero:'« Quatre fois… ça suffit. »',rise:'L’herbe pâle se couche. Quelque chose d’immense se relève, couronné de cornes.',
  ascend:['« Tu n’abandonnes jamais. Moi non plus. »','« Quatrième test réussi. »','« L’escalier continue. Si tu l’acceptes. »'],
  notyet:'« Pas encore ? Les licornes t’attendront. Moi aussi. »'};

/* Monde 5 : la Fonderie des Saints (v5.33). On y fondait les saints pour en faire des machines ; les machines ont continué seules. */
WORLDS[5]={theme:'fonte',acts:WORLDS[1].acts,lvlAdd:68,mult:{hp:3.6,dmg:1.65,boss:.3}};
THEMES.fonte={"n": "Fonderie des Saints", "camp": "L’Atelier en ruine", "antre": {"1": ["Creuset de la Mère-Fonderie", "le "], "2": ["Sanctuaire de Valgris", "le "]}, "pal": {"plain": {"floor": [72, 58, 38], "wall": [112, 88, 54], "dark": 0.84, "amb": "255,200,120", "ember": 0.3}, "crypt": {"floor": [56, 46, 34], "wall": [98, 78, 50], "dark": 0.9}, "lair": {"floor": [62, 42, 26], "wall": [104, 76, 44], "dark": 0.86, "lavaAdd": [90, 60, 0], "lavaGlow": ["#ffcf6a", "rgba(255,200,90,.9)"], "lavaLight": "255,190,80"}, "town": {"floor": [90, 76, 56], "wall": [96, 78, 56], "dark": 0.38}}, "npcs": {"corvel": {"full": "Maître Aubertin", "short": "Aubertin", "robe": ["#8a6a3a", "#2a1e10"]}, "bram": {"full": "Odile la ferrailleuse", "robe": ["#6a5a4a", "#221a12"]}, "eline": {"full": "Sœur Cendrine", "robe": ["#d8c8a8", "#7a6a50"]}, "hilde": {"full": "Gaut le fondeur", "robe": ["#7a4a28", "#2a160a"]}, "demol": {"full": "Rive le démolisseur", "robe": ["#5a5048", "#1a1612"]}, "joueuse": {"full": "Lysandre la joueuse", "robe": ["#7a3a3a", "#2a1010"]}, "recruit": {"full": "Hector le recruteur", "robe": ["#6a5a32", "#221e10"]}}, "skins": {"rodeur": {"n": "Automate d’airain", "col": "#9a7a3a"}, "charognard": {"n": "Chien de laiton", "fur": ["#d0a850", "#5a4020", "#b08838"]}, "archer": {"n": "Arbalétrier mécanique", "bone": "#d8c088"}, "sorcier": {"n": "Prêtre de la Fonte", "bone": "#e8c878"}, "ombre": {"n": "Saint fondu", "gcol": "#ffd890"}, "brute": {"n": "Colosse d’airain", "col": "#8a6a30"}, "pleureuse": {"n": "Rouage hurlant", "gcol": "#ffe0a0"}, "ver": {"n": "Scarabée de forge", "fur": ["#ffb040", "#5a3010", "#ffd070"]}, "cracheur": {"n": "Cracheur de métal", "col": "#7a5a2a"}, "bouclier": {"n": "Templier de laiton", "bone": "#e0c070"}, "ossira": {"n": "Ossira, Tisseuse de chaînes", "col": "#b09060", "wake": "Ossira fait claquer ses chaînes", "death": "Ossira, Tisseuse de chaînes, est vaincue"}, "korr": {"n": "Korr le Marteau-Pilon", "col": "#8a6a3a", "wake": "Korr fait trembler les dalles", "death": "Korr le Marteau-Pilon est vaincu"}, "meliane": {"n": "Méliane la Cloche fêlée", "gcol": "#ffe8b0", "wake": "Méliane sonne faux", "death": "Méliane la Cloche fêlée est vaincue", "call": "Méliane sonne : ses rouages accourent."}, "varsha": {"n": "La Mère-Fonderie", "pal": ["#2a1a08", "#c89038", "#3a2410", "#7a5a28"], "wake": "La Mère-Fonderie ouvre ses portes brûlantes", "call": "La Mère-Fonderie coule de nouveaux enfants.", "death": "La Mère-Fonderie se fige"}, "heraut": {"n": "Le Héraut de laiton", "col": "#c0a060", "wake": "Le Héraut de laiton lève son étendard", "death": "Le Héraut de laiton est vaincu"}, "cineraire": {"n": "Dame des Scories", "gcol": "#ffd8a0", "wake": "Dame des Scories répand le métal en fusion", "death": "Dame des Scories est vaincue"}, "forgeron": {"n": "Le Forgeron Premier", "col": "#5a4a3a", "wake": "Le Forgeron Premier lève son marteau", "death": "Le Forgeron Premier est vaincu"}, "etendard": {"n": "Étendard de laiton"}}, "qtext": {"q1n": "La cour des scories", "q2n": "Les acolytes de la Mère-Fonderie", "q3n": "La Mère-Fonderie", "q4n": "Les lieutenants de Valgris", "q5n": "Valgris", "q1c0": "« Ici, on fondait les saints pour en faire des machines. Les machines ont continué sans nous. Éclaircis leurs rangs dans la cour. »", "q1c1": "« Il en reste. J’entends encore les rouages. »", "q1c2": "« Bien. La Mère-Fonderie coule encore ses enfants, au fond de son creuset scellé. Trois acolytes gardent le sceau : Ossira, Korr et Méliane. Abats-en au moins deux. »", "q2c1": "« Le sceau tient encore. Suis le bruit des cloches. »", "q2c2": "« Le sceau s’est fendu comme un moule trop chaud. La Mère-Fonderie t’attend. »", "q3c2": "« Elle s’est figée ? Alors les fours vont refroidir. Mais quelque chose rit sous les dalles. »", "q3end": "La Mère-Fonderie s’est figée dans son propre métal. Au fond du creuset, un passage descend : l’acte II t’attend.", "q4c0": "« Valgris, encore lui. Trois lieutenants gardent son Sanctuaire : le Héraut de laiton, Dame des Scories et le Forgeron Premier, celui qui a tout commencé. Abats-en au moins deux. »", "q4c1": "« Les lieutenants tiennent encore le sceau. Le Héraut se cache derrière son étendard, la Dame sème les scories, et le Forgeron ne saigne qu’une fois son armure brisée. »", "q4c2": "« Le sceau a cédé. Ne touche pas au métal qui brille. »", "q5c2": "« Cinq fois. Il ne tombe jamais pour de bon, hein ? »", "q5end": "Valgris s’est relevé une cinquième fois, couvert d’or fondu. D’autres mondes t’attendent."}, "decor": THEMES.cendres.decor, "pools": THEMES.cendres.pools, "names": {"plaine": [["Cour des Scories", "la "], ["Champs de laitier", "les "], ["Lande d’airain", "la "], ["Parvis fondu", "le "]], "labyrinthe": [["Nef des Moules", "la "], ["Cryptes de bronze", "les "], ["Ateliers murés", "les "], ["Reliquaire d’airain", "le "]], "couloir": [["Galerie des Soufflets", "la "], ["Coursive des Chaînes", "la "], ["Rigole de métal", "la "], ["Allée des Saints fondus", "l’"]], "arene": [["Creuset des Martyrs", "le "], ["Fosse de coulée", "la "], ["Chœur d’airain", "le "], ["Enclume du Glas", "l’"]], "archipel": [["Îlots de scories", "les "], ["Plateaux suspendus", "les "], ["Passerelles brûlantes", "les "], ["Récifs de laitier", "les "]], "spirale": [["Spirale du Fondeur", "la "], ["Vis de bronze", "la "], ["Puits de coulée", "le "], ["Clocher fondu", "le "]]}, "names2": {"plaine": [["Parvis des Saints", "le "], ["Champs de cendre dorée", "les "], ["Cour du Premier Feu", "la "], ["Lande des Rouages", "la "]], "labyrinthe": [["Cryptes des Moules", "les "], ["Dédale de laiton", "le "], ["Sacristie fondue", "la "], ["Caveaux des Cloches", "les "]], "couloir": [["Route des Templiers", "la "], ["Couloir des Cloches", "le "], ["Défilé d’airain", "le "], ["Chemin des Scories", "le "]], "arene": [["Arène du Creuset", "l’"], ["Fosse des Saints", "la "], ["Cirque de bronze", "le "], ["Cercle du Premier Feu", "le "]], "archipel": [["Îles d’airain", "les "], ["Plateaux du Fondeur", "les "], ["Récifs dorés", "les "], ["Passerelles des Saints", "les "]], "spirale": [["Spirale des Cloches", "la "], ["Puits du Premier Feu", "le "], ["Tour de laiton", "la "], ["Vis des Martyrs", "la "]]}};
REPLIQUES.valgris[5]={arrive:'« On fondait les saints, ici. Toi, on te gardera entier. Pour l’instant. »',phase2:'« Mes serviteurs sont coulés dans le bronze. Ils reviennent. »',phase3:'« Le métal se referme. Brûle vite. »',
  fall:'Valgris est tombé',hero:'« Cinq fois… cette fois, c’est la bonne. »',rise:'L’or fondu se soulève. Quelque chose d’immense se relève, ruisselant de lumière.',
  ascend:['« Tu tiens encore debout. Admirable. »','« Cinquième test réussi. Il en reste. Toujours. »','« L’escalier descend encore. Si tu l’acceptes. »'],
  notyet:'« Pas encore ? Le métal attendra. Moi aussi. »'};

/* v5.51 : monde 6, l’Ossuaire des Cloches. Pierre froide, os et cloches qui sonnent sans qu’on les touche. */
WORLDS[6]={theme:'ossu',acts:WORLDS[1].acts,lvlAdd:85,mult:{hp:4.7,dmg:1.8,boss:.26}};
THEMES.ossu={"n": "Ossuaire des Cloches", "camp": "La Chapelle basse", "antre": {"1": ["Clocher du Grand Bourdon", "le "], "2": ["Sanctuaire de Valgris", "le "]}, "pal": {"plain": {"floor": [54, 50, 58], "wall": [96, 90, 100], "dark": 0.86, "amb": "190,185,200", "ember": 0.05, "snow": true}, "crypt": {"floor": [44, 42, 50], "wall": [86, 82, 96], "dark": 0.91}, "lair": {"floor": [50, 38, 48], "wall": [92, 72, 88], "dark": 0.88, "lavaAdd": [40, 10, 60], "lavaGlow": ["#b07aff", "rgba(170,120,255,.85)"], "lavaLight": "170,120,255"}, "town": {"floor": [70, 66, 74], "wall": [92, 86, 96], "dark": 0.42}}, "npcs": {"corvel": {"full": "Frère Anselme", "short": "Anselme", "robe": ["#4a4458", "#16141c"]}, "bram": {"full": "Mathurin le fossoyeur", "robe": ["#5a5448", "#1a1812"]}, "eline": {"full": "Sœur Ombeline", "robe": ["#cfc8d8", "#6a6478"]}, "hilde": {"full": "Baude la fondeuse de cloches", "robe": ["#6a5040", "#22160e"]}, "demol": {"full": "Gilles le briseur d’os", "robe": ["#5a5450", "#1a1614"]}, "joueuse": {"full": "Margaux aux dés d’os", "robe": ["#5a3a5a", "#1e101e"]}, "recruit": {"full": "Thibaut le recruteur", "robe": ["#4a4a3a", "#181810"]}}, "skins": {"rodeur": {"n": "Pénitent décharné", "col": "#8a8478"}, "charognard": {"n": "Chien d’ossuaire", "fur": ["#c8c0b0", "#4a4440", "#a8a090"]}, "archer": {"n": "Sonneur d’os", "bone": "#ddd6cc"}, "sorcier": {"n": "Chanoine creux", "bone": "#c8c0dc"}, "ombre": {"n": "Âme en peine", "gcol": "#c8b8ff"}, "brute": {"n": "Porteur de cercueil", "col": "#5a5048"}, "pleureuse": {"n": "Cloche qui pleure", "gcol": "#e0d8ff"}, "ver": {"n": "Ver des tombes", "fur": ["#d8d0e0", "#3a3440", "#b0a8c0"]}, "cracheur": {"n": "Cracheur de chaux", "col": "#9a9488"}, "bouclier": {"n": "Garde du charnier", "bone": "#d0c8b8"}, "ossira": {"n": "Ossira, Mère des Os", "col": "#b8b0a0", "wake": "Ossira fait craquer mille os", "death": "Ossira, Mère des Os, est vaincue"}, "korr": {"n": "Korr le Fossoyeur", "col": "#6a6050", "wake": "Korr frappe le sol de sa pelle", "death": "Korr le Fossoyeur est vaincu"}, "meliane": {"n": "Méliane la Muette", "gcol": "#e8e0ff", "wake": "Méliane ouvre la bouche, sans un son", "death": "Méliane la Muette est vaincue", "call": "Méliane se tait : ses âmes accourent."}, "varsha": {"n": "Le Grand Bourdon", "pal": ["#1a1820", "#9a90b8", "#2a2632", "#6a6080"], "wake": "Le Grand Bourdon sonne, et les murs tremblent", "call": "Le Grand Bourdon sonne : les morts répondent.", "death": "Le Grand Bourdon se fêle et se tait"}, "heraut": {"n": "Le Héraut du Glas", "col": "#a8a0b8", "wake": "Le Héraut du Glas lève son étendard", "death": "Le Héraut du Glas est vaincu"}, "cineraire": {"n": "Dame des Chaux", "gcol": "#e8e4f0", "wake": "Dame des Chaux répand la chaux vive", "death": "Dame des Chaux est vaincue"}, "forgeron": {"n": "Le Sonneur Premier", "col": "#4a4450", "wake": "Le Sonneur Premier tire la corde", "death": "Le Sonneur Premier est vaincu"}, "etendard": {"n": "Étendard du Glas"}}, "qtext": {"q1n": "Le parvis des pénitents", "q2n": "Les acolytes du Grand Bourdon", "q3n": "Le Grand Bourdon", "q4n": "Les lieutenants de Valgris", "q5n": "Valgris", "q1c0": "« Ici, on enterrait les morts sous les cloches pour qu’ils n’entendent plus rien. Ils entendent quand même. Éclaircis les rangs sur le parvis. »", "q1c1": "« Il en reste. Tu entends ? Ils sonnent avec leurs os. »", "q1c2": "« Bien. Le Grand Bourdon sonne encore, au fond de son clocher scellé. Trois acolytes gardent le sceau : Ossira, Korr et Méliane. Abats-en au moins deux. »", "q2c1": "« Le sceau tient encore. Suis le silence : c’est là qu’ils se cachent. »", "q2c2": "« Le sceau s’est fêlé comme une vieille cloche. Le Grand Bourdon t’attend. »", "q3c2": "« Il s’est tu ? Alors les morts vont dormir. Mais quelque chose rit sous les dalles. Encore. »", "q3end": "Le Grand Bourdon s’est fêlé et s’est tu. Sous le clocher, un escalier descend : l’acte II t’attend.", "q4c0": "« Valgris, toujours lui. Trois lieutenants gardent son Sanctuaire : le Héraut du Glas, Dame des Chaux et le Sonneur Premier. Abats-en au moins deux. »", "q4c1": "« Les lieutenants tiennent encore le sceau. Le Héraut se cache derrière son étendard, la Dame sème la chaux, et le Sonneur ne saigne qu’une fois son armure brisée. »", "q4c2": "« Le sceau a cédé. Ne réponds pas si on t’appelle par ton nom. »", "q5c2": "« Six fois. Il aime ça, je crois. »", "q5end": "Valgris s’est relevé une sixième fois, dans un fracas de cloches. D’autres mondes t’attendent."}, "decor": THEMES.cendres.decor, "pools": THEMES.cendres.pools, "names": {"plaine": [["Parvis des Pénitents", "le "], ["Champ des Croix", "le "], ["Lande des Glas", "la "], ["Cimetière haut", "le "]], "labyrinthe": [["Catacombes", "les "], ["Charnier muré", "le "], ["Galeries des Crânes", "les "], ["Cryptes sourdes", "les "]], "couloir": [["Nef des Os", "la "], ["Allée des Gisants", "l’"], ["Cloître froid", "le "], ["Couloir des Cordes", "le "]], "arene": [["Chœur des Morts", "le "], ["Fosse commune", "la "], ["Rosace brisée", "la "], ["Cercle du Glas", "le "]], "archipel": [["Îlots de tombes", "les "], ["Tertres isolés", "les "], ["Caveaux suspendus", "les "], ["Récifs d’os", "les "]], "spirale": [["Escalier du clocher", "l’"], ["Spirale des Cordes", "la "], ["Tour sans cloche", "la "], ["Puits des Gisants", "le "]], "descente": [["Degrés du charnier", "les "], ["Marches des Morts", "les "], ["Fosse aux ossements", "la "]], "effondre": [["Cimetière qui s’affaisse", "le "], ["Champ des tombes ouvertes", "le "], ["Terre qui avale", "la "]]}, "names2": {"plaine": [["Parvis du Silence", "le "], ["Champ des Cloches tombées", "le "], ["Lande des Veuves", "la "], ["Jardin des Gisants", "le "]], "labyrinthe": [["Ossuaire profond", "l’"], ["Dédale des Reliques", "le "], ["Sacristie des Os", "la "], ["Caveaux du Glas", "les "]], "couloir": [["Route des Processions", "la "], ["Galerie des Suaires", "la "], ["Défilé des Croix", "le "], ["Chemin des Pleureuses", "le "]], "arene": [["Arène du Bourdon", "l’"], ["Fosse des Martyrs", "la "], ["Cirque d’os", "le "], ["Cercle des Cloches", "le "]], "archipel": [["Îles du Silence", "les "], ["Tertres des Veuves", "les "], ["Récifs de chaux", "les "], ["Caveaux flottants", "les "]], "spirale": [["Spirale du Glas", "la "], ["Puits sans écho", "le "], ["Tour des Pendus", "la "], ["Vis d’ossements", "la "]], "descente": [["Gouffre des Cloches", "le "], ["Degrés du Silence", "les "], ["Abîme des Gisants", "l’"]], "effondre": [["Charnier qui monte", "le "], ["Plaine des suaires", "la "], ["Tombes béantes", "les "]]}};
REPLIQUES.valgris[6]={arrive:'« Ici, les cloches sonnent pour toi. Écoute bien : elles comptent. »',phase2:'« Mes morts se relèvent au premier coup. »',phase3:'« Le glas se referme. Dépêche-toi. »',
  fall:'Valgris est tombé',hero:'« Six fois. Je commence à connaître le chemin. »',rise:'Toutes les cloches sonnent en même temps. Quelque chose se relève dans le vacarme.',
  ascend:['« Toujours debout. Les cloches sont jalouses. »','« Sixième test réussi. Il en reste. Il en reste toujours. »','« Plus bas, il n’y a plus de cloches. Seulement moi. »'],
  notyet:'« Pas encore ? Je sonnerai pour toi plus tard. »'};

/* v5.78 : monde 7, la Forge céleste. Or blanc, lumière froide, statues ; ici la lumière est la menace. */
WORLDS[7]={theme:'astre',acts:WORLDS[1].acts,lvlAdd:102,mult:{hp:6,dmg:1.95,boss:.22}};
THEMES.astre={"n": "Forge céleste", "camp": "Le Seuil blanc", "antre": {"1": ["Enclume du Ciel", "l’"], "2": ["Sanctuaire de Valgris", "le "]}, "pal": {"plain": {"floor": [86, 82, 70], "wall": [150, 140, 112], "dark": 0.8, "amb": "255,235,190", "ember": 0.25}, "crypt": {"floor": [70, 70, 80], "wall": [140, 136, 150], "dark": 0.86}, "lair": {"floor": [78, 66, 46], "wall": [150, 128, 84], "dark": 0.84, "lavaAdd": [80, 70, 40], "lavaGlow": ["#fff2b0", "rgba(255,240,180,.9)"], "lavaLight": "255,240,190"}, "town": {"floor": [96, 92, 82], "wall": [120, 112, 96], "dark": 0.38}}, "npcs": {"corvel": {"full": "L’Archiviste Théodore", "short": "Théodore", "robe": ["#d8d0b8", "#6a6050"]}, "bram": {"full": "Corneille la marchande", "robe": ["#6a6a7a", "#22222a"]}, "eline": {"full": "Sœur Aurore", "robe": ["#f0ead8", "#8a8270"]}, "hilde": {"full": "Maître Galmier, forgeur d’astres", "robe": ["#8a6a3a", "#2a1e10"]}, "demol": {"full": "Bastien le fondeur", "robe": ["#6a6458", "#1e1a16"]}, "joueuse": {"full": "Iseult aux étoiles", "robe": ["#3a3a7a", "#10102a"]}, "recruit": {"full": "Amaury le recruteur", "robe": ["#7a6a3a", "#221e10"]}}, "skins": {"rodeur": {"n": "Pénitent d’or", "col": "#b8a060"}, "charognard": {"n": "Chien d’airain ailé", "fur": ["#e0c070", "#5a4020", "#c0a050"]}, "archer": {"n": "Archer de lumière", "bone": "#f0e8c8"}, "sorcier": {"n": "Astrologue creux", "bone": "#e8e0ff"}, "ombre": {"n": "Écho d’étoile", "gcol": "#fff4c8"}, "brute": {"n": "Colosse d’enclume", "col": "#9a8050"}, "pleureuse": {"n": "Étincelle qui pleure", "gcol": "#fff0b0"}, "ver": {"n": "Scarabée d’astre", "fur": ["#fff0a0", "#6a5020", "#ffe080"]}, "cracheur": {"n": "Cracheur de métal blanc", "col": "#a89870"}, "bouclier": {"n": "Gardien du Seuil", "bone": "#f0e0b0"}, "invocateur": {"n": "Mage des constellations"}, "rampant": {"n": "Taupe d’orichalque"}, "lanterne": {"n": "Porteuse d’astre"}, "ossira": {"n": "Ossira, Fileuse d’étoiles", "col": "#d8c8a0", "wake": "Ossira tend des fils de lumière", "death": "Ossira, Fileuse d’étoiles, est vaincue"}, "korr": {"n": "Korr le Marteau d’astre", "col": "#a88850", "wake": "Korr fait sonner l’enclume du ciel", "death": "Korr le Marteau d’astre est vaincu"}, "meliane": {"n": "Méliane l’Aube", "gcol": "#fff8e0", "wake": "Méliane s’allume", "death": "Méliane l’Aube s’éteint", "call": "Méliane appelle ses étincelles."}, "varsha": {"n": "La Forgeuse d’astres", "pal": ["#2a2010", "#f0d080", "#3a2c14", "#b09050"], "wake": "La Forgeuse d’astres ouvre son four", "call": "La Forgeuse coule des étoiles vivantes.", "death": "La Forgeuse d’astres se fige"}, "heraut": {"n": "Le Héraut d’or blanc", "col": "#e0d0a0", "wake": "Le Héraut d’or blanc lève son étendard", "death": "Le Héraut d’or blanc est vaincu"}, "cineraire": {"n": "Dame de Poussière d’étoile", "gcol": "#fff8e8", "wake": "Dame de Poussière répand l’éclat", "death": "Dame de Poussière d’étoile est vaincue"}, "forgeron": {"n": "Le Forgeur Premier", "col": "#6a5a3a", "wake": "Le Forgeur Premier lève son marteau d’astre", "death": "Le Forgeur Premier est vaincu"}, "etendard": {"n": "Étendard d’or blanc"}}, "qtext": {"q1n": "Le parvis de lumière", "q2n": "Les acolytes de la Forgeuse", "q3n": "La Forgeuse d’astres", "q4n": "Les lieutenants de Valgris", "q5n": "Valgris", "q1c0": "« Ici, on forgeait les étoiles. Puis on a forgé autre chose. Ce qui brille n’est pas toujours bon. Éclaircis le parvis. »", "q1c1": "« Il en reste. La lumière ne les brûle pas, elle les nourrit. »", "q1c2": "« Bien. La Forgeuse d’astres attend derrière son sceau. Trois acolytes le gardent : Ossira, Korr et Méliane. Abats-en au moins deux. »", "q2c1": "« Le sceau tient encore. Suis les étincelles qui tombent à l’envers. »", "q2c2": "« Le sceau a fondu. La Forgeuse t’attend près de son enclume. »", "q3c2": "« Elle s’est figée dans son propre métal. Pourtant le ciel ne s’est pas éteint. Quelqu’un rit encore. »", "q3end": "La Forgeuse d’astres s’est figée. Derrière l’enclume, un escalier de lumière monte : l’acte II t’attend.", "q4c0": "« Valgris, encore. Ses trois lieutenants gardent le Sanctuaire : le Héraut d’or blanc, Dame de Poussière d’étoile et le Forgeur Premier. Abats-en au moins deux. »", "q4c1": "« Le sceau tient encore. Le Héraut se cache derrière son étendard, la Dame sème l’éclat, et le Forgeur ne saigne qu’une fois son armure brisée. »", "q4c2": "« Le sceau a cédé. Ne regarde pas la lumière en face. »", "q5c2": "« Sept fois. Il ne se fatigue jamais. Nous, si. »", "q5end": "Valgris s’est relevé une septième fois, couronné de lumière. D’autres mondes t’attendent."}, "decor": THEMES.cendres.decor, "pools": THEMES.cendres.pools, "names": {"plaine": [["Parvis de lumière", "le "], ["Champ des Enclumes", "le "], ["Lande dorée", "la "], ["Plaine des Étincelles", "la "]], "labyrinthe": [["Archives d’or", "les "], ["Galeries de l’Astre", "les "], ["Ateliers scellés", "les "], ["Cryptes blanches", "les "]], "couloir": [["Nef des Soufflets", "la "], ["Allée des Statues", "l’"], ["Couloir des Rayons", "le "], ["Galerie du Zénith", "la "]], "arene": [["Cercle de l’Enclume", "le "], ["Fosse de lumière", "la "], ["Chœur des Astres", "le "], ["Arène dorée", "l’"]], "archipel": [["Îles suspendues", "les "], ["Plateaux du Ciel", "les "], ["Passerelles d’or", "les "], ["Récifs d’étoiles", "les "]], "spirale": [["Spirale du Zénith", "la "], ["Tour d’horloge", "la "], ["Vis d’astre", "la "], ["Puits de lumière", "le "]], "descente": [["Degrés célestes", "les "], ["Marches d’or", "les "], ["Fosse aux étoiles", "la "]], "effondre": [["Champ qui fond", "le "], ["Plaine éblouie", "la "], ["Lumière qui avance", "la "]]}, "names2": {"plaine": [["Parvis du Zénith", "le "], ["Champs d’or blanc", "les "], ["Cour des Astres", "la "], ["Lande des Rayons", "la "]], "labyrinthe": [["Dédale d’orichalque", "le "], ["Sacristie céleste", "la "], ["Archives perdues", "les "], ["Caveaux d’étoiles", "les "]], "couloir": [["Route des Forgeurs", "la "], ["Couloir des Comètes", "le "], ["Défilé d’or", "le "], ["Chemin de l’Aube", "le "]], "arene": [["Arène du Ciel", "l’"], ["Fosse des Astres", "la "], ["Cirque d’or", "le "], ["Cercle du Zénith", "le "]], "archipel": [["Îles du Firmament", "les "], ["Plateaux d’or", "les "], ["Récifs du Ciel", "les "], ["Passerelles d’astre", "les "]], "spirale": [["Spirale des Comètes", "la "], ["Puits du Zénith", "le "], ["Tour d’orichalque", "la "], ["Vis céleste", "la "]], "descente": [["Gouffre de lumière", "le "], ["Degrés de l’Aube", "les "], ["Abîme doré", "l’"]], "effondre": [["Clarté dévorante", "la "], ["Champs aveuglés", "les "], ["Plaine qui brûle blanc", "la "]]}};
THEMES.givre.extra=['givreux'];THEMES.fonte.extra=['automate'];THEMES.fonte.extraL=5;THEMES.marais.extra=['noye'];THEMES.ossu.extra=['sonneur'];THEMES.astre.extra=['ange'];for(const t of['givre','marais','ossu','astre'])THEMES[t].extraL=5;
REPLIQUES.valgris[7]={arrive:'« Ici, on forgeait les étoiles. Je t’en ai gardé une. Elle brûle. »',phase2:'« Ma lumière revient toujours. Comme moi. »',phase3:'« Le ciel se referme. Plus vite. »',
  fall:'Valgris est tombé',hero:'« Sept. Je ne compte plus, je continue. »',rise:'Le ciel entier s’allume. Quelque chose de très grand se relève dans la lumière.',
  ascend:['« Tu brilles presque autant que moi. Presque. »','« Septième test réussi. La suite est plus sombre. »','« Au-delà, il n’y a plus de lumière. Viens quand même. »'],
  notyet:'« Pas encore ? La lumière attendra. »'};
THEMES.givre.npcs.recruit={full:'Sigrun la recruteuse',robe:['#6a7a8a','#222a32']};THEMES.marais.npcs.recruit={full:'Bastien le recruteur',robe:['#4a5a3a','#1a2212']};THEMES.pre.npcs.recruit={full:'Ulric le recruteur',robe:['#5a5a60','#1a1a1e']};
/* v5.54 : noms des nouveaux monstres dans chaque monde */
if(THEMES.givre&&THEMES.givre.skins)THEMES.givre.skins.invocateur={n:'Nécromant du givre'};
if(THEMES.givre&&THEMES.givre.skins)THEMES.givre.skins.rampant={n:'Rampant des glaces'};
if(THEMES.givre&&THEMES.givre.skins)THEMES.givre.skins.lanterne={n:'Lanterne de givre'};
if(THEMES.marais&&THEMES.marais.skins)THEMES.marais.skins.invocateur={n:'Sorcier des tourbières'};
if(THEMES.marais&&THEMES.marais.skins)THEMES.marais.skins.rampant={n:'Rampant de vase'};
if(THEMES.marais&&THEMES.marais.skins)THEMES.marais.skins.lanterne={n:'Feu follet'};
if(THEMES.pre&&THEMES.pre.skins)THEMES.pre.skins.invocateur={n:'Dresseur de juments mortes'};
if(THEMES.pre&&THEMES.pre.skins)THEMES.pre.skins.rampant={n:'Taupe blême'};
if(THEMES.pre&&THEMES.pre.skins)THEMES.pre.skins.lanterne={n:'Lanterne de nacre'};
if(THEMES.fonte&&THEMES.fonte.skins)THEMES.fonte.skins.invocateur={n:'Mouleur de saints'};
if(THEMES.fonte&&THEMES.fonte.skins)THEMES.fonte.skins.rampant={n:'Foreuse de laiton'};
if(THEMES.fonte&&THEMES.fonte.skins)THEMES.fonte.skins.lanterne={n:'Porte-creuset'};
if(THEMES.ossu&&THEMES.ossu.skins)THEMES.ossu.skins.invocateur={n:'Chanoine des morts'};
if(THEMES.ossu&&THEMES.ossu.skins)THEMES.ossu.skins.rampant={n:'Fouisseur de tombes'};
if(THEMES.ossu&&THEMES.ossu.skins)THEMES.ossu.skins.lanterne={n:'Veilleuse des gisants'};
/* Noms des formes Archipel et Spirale (v5.28) */
if(THEMES.cendres&&THEMES.cendres.names)THEMES.cendres.names.descente=[["Gradins du Gouffre", "les "], ["Marches de suie", "les "], ["Descente des Pendus", "la "]];
if(THEMES.cendres&&THEMES.cendres.names)THEMES.cendres.names.effondre=[["Champ qui s’effondre", "le "], ["Plaine dévorée", "la "], ["Lande engloutie", "la "]];
if(THEMES.cendres&&THEMES.cendres.names2)THEMES.cendres.names2.descente=[["Gouffre du Serment", "le "], ["Degrés des Échos", "les "], ["Puits aux mille marches", "le "]];
if(THEMES.cendres&&THEMES.cendres.names2)THEMES.cendres.names2.effondre=[["Terres mangées", "les "], ["Plaine du Dernier Souffle", "la "], ["Friche avalée", "la "]];
if(THEMES.givre&&THEMES.givre.names)THEMES.givre.names.descente=[["Crevasse en gradins", "la "], ["Marches de glace", "les "], ["Faille bleue", "la "]];
if(THEMES.givre&&THEMES.givre.names)THEMES.givre.names.effondre=[["Banquise qui cède", "la "], ["Plaine du Blizzard", "la "], ["Glace qui avale", "la "]];
if(THEMES.givre&&THEMES.givre.names2)THEMES.givre.names2.descente=[["Abîme du Nord", "l’"], ["Degrés gelés", "les "], ["Puits de verglas", "le "]];
if(THEMES.givre&&THEMES.givre.names2)THEMES.givre.names2.effondre=[["Toundra engloutie", "la "], ["Champ de neige noire", "le "], ["Steppe qui sombre", "la "]];
if(THEMES.marais&&THEMES.marais.names)THEMES.marais.names.descente=[["Terrasses noyées", "les "], ["Marches de vase", "les "], ["Fosse aux saules", "la "]];
if(THEMES.marais&&THEMES.marais.names)THEMES.marais.names.effondre=[["Tourbière qui monte", "la "], ["Lande avalée", "la "], ["Pré noyé", "le "]];
if(THEMES.marais&&THEMES.marais.names2)THEMES.marais.names2.descente=[["Gouffre des Fièvres", "le "], ["Degrés de tourbe", "les "], ["Puits aux noyés", "le "]];
if(THEMES.marais&&THEMES.marais.names2)THEMES.marais.names2.effondre=[["Vasière dévorante", "la "], ["Plaine qui sombre", "la "], ["Rives englouties", "les "]];
if(THEMES.pre&&THEMES.pre.names)THEMES.pre.names.descente=[["Gradins blêmes", "les "], ["Marches de nacre", "les "], ["Fosse aux juments", "la "]];
if(THEMES.pre&&THEMES.pre.names)THEMES.pre.names.effondre=[["Pré qui se défait", "le "], ["Prairie mangée", "la "], ["Herbage avalé", "l’"]];
if(THEMES.pre&&THEMES.pre.names2)THEMES.pre.names2.descente=[["Gouffre des Cornes", "le "], ["Degrés d’ivoire", "les "], ["Puits des Sabots", "le "]];
if(THEMES.pre&&THEMES.pre.names2)THEMES.pre.names2.effondre=[["Pâture du Néant", "la "], ["Plaine des Crins morts", "la "], ["Pré du Silence", "le "]];
if(THEMES.fonte&&THEMES.fonte.names)THEMES.fonte.names.descente=[["Fosse de coulée", "la "], ["Marches du Creuset", "les "], ["Puits de scories", "le "]];
if(THEMES.fonte&&THEMES.fonte.names)THEMES.fonte.names.effondre=[["Champ de laitier", "le "], ["Plaine qui fond", "la "], ["Atelier englouti", "l’"]];
if(THEMES.fonte&&THEMES.fonte.names2)THEMES.fonte.names2.descente=[["Gouffre des Saints", "le "], ["Degrés de fonte", "les "], ["Abîme du Moule", "l’"]];
if(THEMES.fonte&&THEMES.fonte.names2)THEMES.fonte.names2.effondre=[["Coulée qui avance", "la "], ["Halles dévorées", "les "], ["Cour des Forges mortes", "la "]];
THEMES.cendres.names.archipel=[["Îles de suie", "les "], ["Archipel des Braises", "l’"], ["Îlots du Glas", "les "], ["Récifs de cendre", "les "]];
THEMES.cendres.names.spirale=[["Spirale des Veilleurs", "la "], ["Puits tournant", "le "], ["Escargot de pierre", "l’"], ["Tour enfouie", "la "]];
THEMES.cendres.names2.archipel=[["Îles du Serment", "les "], ["Archipel des Échos", "l’"], ["Récifs de verre noir", "les "], ["Îlots brûlants", "les "]];
THEMES.cendres.names2.spirale=[["Spirale du Héraut", "la "], ["Puits des Échos", "le "], ["Vis de cendre", "la "], ["Tour du Silence", "la "]];
THEMES.givre.names.archipel=[["Banquise brisée", "la "], ["Îles de glace", "les "], ["Récifs gelés", "les "], ["Floes noirs", "les "]];
THEMES.givre.names.spirale=[["Spirale de givre", "la "], ["Puits gelé", "le "], ["Tourbillon blanc", "le "], ["Tour de glace", "la "]];
THEMES.givre.names2.archipel=[["Archipel du Nord", "l’"], ["Îles du Silence", "les "], ["Récifs de cristal", "les "], ["Banquise des Échos", "la "]];
THEMES.givre.names2.spirale=[["Spirale du Blizzard", "la "], ["Puits de cristal", "le "], ["Vis gelée", "la "], ["Tour du Grand Froid", "la "]];
THEMES.marais.names.archipel=[["Îlots de tourbe", "les "], ["Archipel des Saules", "l’"], ["Buttes noyées", "les "], ["Îles flottantes", "les "]];
THEMES.marais.names.spirale=[["Spirale de racines", "la "], ["Puits de vase", "le "], ["Tourbillon de lianes", "le "], ["Tour engloutie", "la "]];
THEMES.marais.names2.archipel=[["Delta des Noyés", "le "], ["Îles des Fièvres", "les "], ["Buttes moisies", "les "], ["Archipel des Brumes", "l’"]];
THEMES.marais.names2.spirale=[["Spirale des Fièvres", "la "], ["Puits sans fond", "le "], ["Vis de tourbe", "la "], ["Tour des Brumes", "la "]];
THEMES.pre.names.archipel=[["Îlots de crins", "les "], ["Buttes des Cornes", "les "], ["Archipel blême", "l’"], ["Îles des Juments", "les "]];
THEMES.pre.names.spirale=[["Spirale des Sabots", "la "], ["Manège creux", "le "], ["Puits de nacre", "le "], ["Tour d’ivoire", "la "]];
THEMES.pre.names2.archipel=[["Archipel des Agonies", "l’"], ["Îles livides", "les "], ["Buttes de lune", "les "], ["Îlots du Dernier Galop", "les "]];
THEMES.pre.names2.spirale=[["Spirale de la Jument", "la "], ["Manège des Morts", "le "], ["Puits d’ivoire", "le "], ["Tour des Cavaliers", "la "]];

/* v6.15 : biomes. Quatre nouveaux mondes (forêt, désert, volcan, abîme), chacun avec ses propres familles de monstres.
   À chaque nouvelle partie, les sept mondes sont tirés au hasard parmi les onze ; une partie déjà commencée garde ses mondes. */
Object.assign(MT,{
  cerf:{n:'Cerf des ronces',hp:30,dmg:[4,8],spd:3,xp:18,size:1.25,col:'#8a5a30',fur:['#a8703e','#3e2412','#c89a68'],antler:1,kind:'beast',ai:'dasher'},
  sanglier:{n:'Sanglier noir',hp:36,dmg:[4,9],spd:2.4,xp:20,size:1.1,col:'#3a2e26',fur:['#4a3a2e','#1a120c','#5a4a3a'],tusk:1,kind:'beast',ai:'dasher'},
  araignee:{n:'Araignée des futaies',hp:20,dmg:[3,6],spd:2.6,xp:15,size:.8,col:'#4a5a2a',kind:'weaver',ai:'melee'},
  sylvain:{n:'Sylvain tordu',hp:52,dmg:[5,10],spd:1.2,xp:28,size:1.4,col:'#5a4a2a',leaf:1,kind:'walker',ai:'melee'},
  scorpion:{n:'Scorpion des dunes',hp:26,dmg:[3,7],spd:2,xp:18,size:1.1,col:'#b08040',kind:'scorp',ai:'melee'},
  gelee:{n:'Gelée de feu',hp:18,dmg:[3,6],spd:1.6,xp:14,size:1,col:'#ff6a20',kind:'slime',ai:'melee',split:'geleeP'},
  geleeP:{n:'Petite gelée',hp:5,dmg:[2,4],spd:2.2,xp:4,size:.55,col:'#ff8a3a',kind:'slime',ai:'melee'},
  drake:{n:'Dragonnet roux',hp:30,dmg:[4,8],spd:1.9,xp:24,size:1.05,col:'#b0401a',kind:'drake',ai:'spitter',ranged:true},
  molosse:{n:'Molosse à trois têtes',hp:30,dmg:[4,8],spd:2.8,xp:24,size:1.2,col:'#5a1a14',fur:['#6a2218','#1e0806','#8a3020'],heads:3,kind:'beast',ai:'melee'},
  diablotin:{n:'Diablotin',hp:13,dmg:[3,6],spd:3,xp:12,size:.75,col:'#a83020',horns:1,kind:'walker',ai:'dasher'},
  loup:{n:'Loup des neiges',hp:22,dmg:[3,6],spd:3.4,xp:13,size:1,col:'#e0e8f0',fur:['#e8eef4','#6a7a8a','#f4f8ff'],kind:'beast',ai:'melee'}});
/* Bestiaire : une ligne par bête, avec sa famille (le monde où on la croise) */
Object.assign(MT.cerf,{lore:'Forêt. Il baisse ses bois et charge sans prévenir. Recule quand il gratte le sol.'});
Object.assign(MT.sanglier,{lore:'Forêt. Petit, têtu, et ses défenses traversent le cuir.'});
Object.assign(MT.araignee,{lore:'Forêt. Elle tombe des branches. Toujours en groupe.'});
Object.assign(MT.sylvain,{lore:'Forêt. Un arbre qui a décidé de marcher. Lent, mais il frappe fort.'});
Object.assign(MT.scorpion,{lore:'Désert. Pinces devant, dard au-dessus. C’est le dard qu’il faut surveiller.'});
Object.assign(MT.gelee,{lore:'Volcan et abîme. Frappe-la : elle se coupe en deux petites. Finis-les vite.'});
Object.assign(MT.geleeP,{lore:'Ce qui reste d’une gelée de feu. Rapide et fragile.'});
Object.assign(MT.drake,{lore:'Volcan. Un dragonnet roux qui crache du feu au sol. Ne reste pas dans les flammes.'});
Object.assign(MT.molosse,{lore:'Abîme. Trois têtes, une seule faim. Chasse en meute.'});
Object.assign(MT.diablotin,{lore:'Abîme. Il rit, il bondit, il recommence.'});
Object.assign(MT.loup,{lore:'Givre. Un loup ne vient jamais seul.'});
/* Allure : un habit (skin) peut changer la silhouette d’un monstre */
const MLOOK=['antler','tusk','heads','horns','leaf','flesh'];
function applyLook(m,src){if(!src)return;if(src.kind)m.kind=src.kind;for(const k of MLOOK)if(src[k])m[k]=src[k];}
function mkTheme(key,o){const base={decor:THEMES.cendres.decor,pools:THEMES.cendres.pools,antre:{1:o.antre1,2:['Sanctuaire de Valgris','le ']}};THEMES[key]=Object.assign(base,o);delete THEMES[key].antre1;return THEMES[key];}
mkTheme('foret',{n:'Forêt d’Ambreval',camp:'Clairière de Hautbois',antre1:['Cœur de la Sylve-Mère','le '],
  pal:{plain:{floor:[56,78,42],wall:[38,56,28],dark:.68,amb:'200,235,170',ember:0},crypt:{floor:[50,46,34],wall:[74,64,44],dark:.88},
    lair:{floor:[42,54,32],wall:[60,78,42],dark:.84,amb:'170,255,140',lavaAdd:[-60,60,-10],lavaGlow:['#9aff6a','rgba(160,255,120,.9)'],lavaLight:'150,255,120'},town:{floor:[96,104,70],wall:[92,72,50],dark:.3}},
  npcs:{corvel:{full:'Vieux Gaspard',short:'Gaspard',a:'le ',robe:['#5a6a3a','#1e2412']},bram:{full:'Tilda la cueilleuse',robe:['#7a6a3a','#2a2412']},eline:{full:'Sœur Fougère',robe:['#c8d8a8','#6a7a4a']},
    hilde:{full:'Bran le charron',robe:['#6a4a2a','#24160a']},demol:{full:'Écorce le démolisseur',robe:['#5a4a32','#1e160c']},joueuse:{full:'Pia la joueuse',robe:['#8a5a3a','#2a1a10']},
    recruit:{full:'Aubin le recruteur',robe:['#4a5a32','#181e10']},lapid:{full:'Ambre la lapidaire',robe:['#a87a2a','#3a2a0a']}},
  pools:[{upTo:2,m:['cerf','rodeur','charognard']},{upTo:5,m:['cerf','sanglier','rodeur','archer','araignee']},{upTo:9,m:['cerf','sanglier','araignee','archer','sylvain','brute','sorcier']},
    {upTo:999,m:['cerf','sanglier','araignee','archer','sylvain','brute','sorcier','cracheur','ombre','lanterne','invocateur','rampant']}],
  extra:['sylvain'],extraL:6,
  skins:{rodeur:{n:'Braconnier perdu',col:'#6a5a3a'},charognard:{n:'Renard roux',fur:['#c8682a','#4a2010','#e8a060']},archer:{n:'Archère des futaies',flesh:1,col:'#4a6a32'},
    sorcier:{n:'Druide dévoyé',flesh:1,col:'#5a7a3a'},ombre:{n:'Feu des sous-bois',gcol:'#a8ff8a'},brute:{n:'Ours des ronces',kind:'beast',fur:['#6a4428','#24140a','#8a5a38']},
    ver:{n:'Hérisson ardent',fur:['#c88a4a','#4a2a10','#e8b070']},cracheur:{n:'Crapaud cracheur',col:'#5a7a3a'},bouclier:{n:'Garde-chasse au pavois',flesh:1,col:'#5a4a2a'},
    pleureuse:{n:'Feu follet',gcol:'#c8ffb0'},invocateur:{n:'Mère des ronces',flesh:1,col:'#4a5a2a'},rampant:{n:'Taupe géante',fur:['#5a4a3a','#1e160e','#7a6a5a']},lanterne:{n:'Luciole-mère',gcol:'#e8ff9a'},
    ossira:{n:'Ossira, Reine des toiles',col:'#5a6a3a',wake:'Ossira descend de sa toile',death:'Ossira, Reine des toiles, est vaincue'},
    korr:{n:'Korr le Grand Sanglier',kind:'beast',tusk:1,fur:['#3a2e26','#140e0a','#5a4a3a'],wake:'Korr gratte la terre',death:'Korr le Grand Sanglier est vaincu'},
    meliane:{n:'Méliane la Dryade',gcol:'#b8f0a0',wake:'Méliane pleure de la sève',death:'Méliane la Dryade est vaincue',call:'Méliane chante : ses feux follets accourent.'},
    varsha:{n:'La Sylve-Mère',pal:['#14240a','#4a8a2a','#1a300c','#3a5a1a'],wake:'La Sylve-Mère ouvre les yeux',call:'La Sylve-Mère fait germer ses enfants.',death:'La Sylve-Mère se dessèche'},
    heraut:{n:'Le Héraut des chênes',col:'#6a5a3a',wake:'Le Héraut des chênes lève son étendard',death:'Le Héraut des chênes est vaincu'},
    cineraire:{n:'Dame des Spores',gcol:'#d8f0a0',wake:'Dame des Spores répand son pollen',death:'Dame des Spores est vaincue'},
    forgeron:{n:'Le Bûcheron sans visage',col:'#4a3a28',wake:'Le Bûcheron sans visage lève sa hache',death:'Le Bûcheron sans visage est vaincu'},etendard:{n:'Étendard des chênes'}},
  qtext:{q1n:'Les bêtes de la lisière',q2n:'Les gardiens de la Sylve-Mère',q3n:'La Sylve-Mère',q4n:'Les lieutenants de Valgris',q5n:'Valgris',
    q1c0:'« La forêt s’est refermée sur nous. Les cerfs chargent les chasseurs, les ronces poussent dans la nuit. Fais reculer les bêtes de la lisière. »',
    q1c1:'« Il en reste. J’entends encore les bois craquer. »',
    q1c2:'« Bien. Au cœur de la forêt, la Sylve-Mère a pris racine. Trois gardiens nourrissent son sceau : Ossira, Korr et Méliane. Abats-en au moins deux. »',
    q2c1:'« Le sceau tient encore. Les gardiens rôdent sur le chemin du cœur, chacun dans sa tanière. »',
    q2c2:'« Le sceau s’est ouvert comme une écorce fendue. La Sylve-Mère t’attend. »',
    q3c2:'« Elle s’est desséchée ? Alors les sentiers vont se rouvrir. Mais quelque chose rit sous les racines. »',
    q3end:'La Sylve-Mère s’est desséchée d’un coup. Sous sa souche, un passage s’enfonce dans la terre : l’acte II t’attend.',
    q4c0:'« Ce rire, c’est Valgris. Trois lieutenants gardent son Sanctuaire : le Héraut des chênes, Dame des Spores et le Bûcheron sans visage. Abats-en au moins deux. »',
    q4c1:'« Les lieutenants tiennent encore le sceau. Le Héraut se cache derrière son étendard, la Dame sème ses spores, et le Bûcheron ne saigne qu’une fois son armure brisée. »',
    q4c2:'« Le sceau a cédé. Garde ta hache près de toi. »'},
  names:{plaine:[['Sous-bois d’Ambreval','le '],['Clairière des Cerfs','la '],['Futaie claire','la '],['Lisière aux ronces','la ']],
    labyrinthe:[['Terriers des Ronces','les '],['Racines creuses','les '],['Galeries de mousse','les '],['Tanières oubliées','les ']],
    couloir:[['Sentier des Chasseurs','le '],['Ravine aux fougères','la '],['Allée des Chênes','l’'],['Coulée des Biches','la ']],
    arene:[['Cercle des Chênes','le '],['Clairière du Brame','la '],['Arène de mousse','l’'],['Souche du Roi','la ']],
    archipel:[['Îlots de l’étang','les '],['Mares aux saules','les '],['Bosquets noyés','les '],['Îles de fougères','les ']],
    spirale:[['Spirale des Racines','la '],['Vieux chêne creux','le '],['Puits de lierre','le '],['Tour de ronces','la ']],
    descente:[['Ravins boisés','les '],['Marches de racines','les '],['Combe aux loups','la ']],
    effondre:[['Forêt qui s’effondre','la '],['Talus mangé','le '],['Clairière avalée','la ']]},
  names2:{plaine:[['Bois des Murmures','le '],['Futaie ancienne','la '],['Clairière des Échos','la '],['Forêt sans soleil','la ']],
    labyrinthe:[['Dédale de racines','le '],['Terriers du Serment','les '],['Galeries des Spores','les '],['Caveaux de mousse','les ']],
    couloir:[['Route des Braconniers','la '],['Gorge aux mousses','la '],['Sentier des Pendus','le '],['Chemin des Cornes','le ']],
    arene:[['Arène des Cornes','l’'],['Cercle des Spores','le '],['Clairière du Serment','la '],['Fosse aux souches','la ']],
    archipel:[['Îles du marais vert','les '],['Bosquets flottants','les '],['Îlots des Spores','les '],['Mares des Échos','les ']],
    spirale:[['Spirale des Spores','la '],['Tronc du Monde','le '],['Vis de lierre','la '],['Tour des Corbeaux','la ']],
    descente:[['Gorge des Racines-Mères','la '],['Degrés de mousse','les '],['Combe sans fond','la ']],
    effondre:[['Sylve qui cède','la '],['Bois avalé','le '],['Futaie en ruine','la ']]}});
mkTheme('desert',{n:'Désert de Solmar',camp:'Oasis de Kesh',antre1:['Nid de la Reine-Scorpion','le '],
  pal:{plain:{floor:[176,146,96],wall:[150,108,66],dark:.5,amb:'255,240,200',ember:0},crypt:{floor:[112,90,60],wall:[150,118,78],dark:.84},
    lair:{floor:[136,98,58],wall:[168,118,68],dark:.72,amb:'255,220,160',lavaAdd:[60,40,-20],lavaGlow:['#ffd86a','rgba(255,220,120,.9)'],lavaLight:'255,210,110'},town:{floor:[170,148,108],wall:[128,98,66],dark:.25}},
  npcs:{corvel:{full:'Vieille Zahira',short:'Zahira',a:'la ',robe:['#c8a870','#5a4020']},bram:{full:'Selim le caravanier',robe:['#a8603a','#3a1e10']},eline:{full:'Sœur Amara',robe:['#f0e8d0','#9a8a68']},
    hilde:{full:'Tarik le forgeron',robe:['#7a5030','#2a1a0c']},demol:{full:'Grès le démolisseur',robe:['#9a7a50','#3a2a18']},joueuse:{full:'Nour la joueuse',robe:['#3a6a8a','#12222e']},
    recruit:{full:'Idris le recruteur',robe:['#8a6a3a','#2a2010']},lapid:{full:'Safa la lapidaire',robe:['#2a7a8a','#0a2a32']}},
  pools:[{upTo:2,m:['scorpion','charognard','rodeur']},{upTo:5,m:['scorpion','charognard','rodeur','archer','ver']},{upTo:9,m:['scorpion','charognard','archer','brute','sorcier','rampant','ver']},
    {upTo:999,m:['scorpion','charognard','archer','brute','sorcier','rampant','cracheur','bouclier','ombre','lanterne','invocateur']}],
  extra:['rampant'],extraL:6,
  skins:{rodeur:{n:'Desséché',col:'#b09868'},charognard:{n:'Chacal des dunes',fur:['#c8a060','#5a3a18','#e0c088']},archer:{n:'Archer des dunes',flesh:1,col:'#a87a48'},
    sorcier:{n:'Mage des sables',flesh:1,col:'#c89a50'},ombre:{n:'Mirage',gcol:'#ffe8a0'},brute:{n:'Golem de grès',col:'#b07848'},ver:{n:'Scarabée de feu',fur:['#ffb040','#5a3010','#ffd070']},
    cracheur:{n:'Cracheur de sable',col:'#a08050'},bouclier:{n:'Sentinelle de grès',flesh:1,col:'#a08058'},pleureuse:{n:'Tourbillon de sable',gcol:'#f0d8a0'},
    invocateur:{n:'Embaumeur',flesh:1,col:'#8a7050'},rampant:{n:'Ver des sables',fur:['#c8a068','#5a4020','#e8c898']},lanterne:{n:'Porte-soleil',gcol:'#fff0a0'},
    ossira:{n:'Ossira, Tisseuse de sable',col:'#c8a060',wake:'Ossira sort du sable',death:'Ossira, Tisseuse de sable, est vaincue'},
    korr:{n:'Korr le Bélier des dunes',col:'#a87040',wake:'Korr baisse les cornes',death:'Korr le Bélier des dunes est vaincu'},
    meliane:{n:'Méliane la Mirage',gcol:'#fff0c0',wake:'Méliane tremble dans la chaleur',death:'Méliane la Mirage est vaincue',call:'Méliane appelle : ses tourbillons accourent.'},
    varsha:{n:'La Reine-Scorpion',kind:'scorp',col:'#8a4a1a',pal:['#2a1406','#c07030','#3a1e0a','#8a5020'],wake:'La Reine-Scorpion lève son dard',call:'La Reine-Scorpion appelle sa couvée.',death:'La Reine-Scorpion s’effondre'},
    heraut:{n:'Le Héraut du Midi',col:'#c8a060',wake:'Le Héraut du Midi lève son étendard',death:'Le Héraut du Midi est vaincu'},
    cineraire:{n:'Dame des Sables',gcol:'#ffe0a0',wake:'Dame des Sables soulève le désert',death:'Dame des Sables est vaincue'},
    forgeron:{n:'Le Forgeron de verre',col:'#6a8a8a',wake:'Le Forgeron de verre souffle sur sa forge',death:'Le Forgeron de verre est vaincu'},etendard:{n:'Étendard du Midi'}},
  qtext:{q1n:'Les dunes affamées',q2n:'Les gardiens de la Reine',q3n:'La Reine-Scorpion',q4n:'Les lieutenants de Valgris',q5n:'Valgris',
    q1c0:'« Le soleil ne se couche plus vraiment, ici. Les scorpions sortent par centaines et les chacals suivent les caravanes. Éclaircis les dunes. »',
    q1c1:'« Il en reste. Le sable bouge encore. »',
    q1c2:'« Bien. Sous les dunes, la Reine-Scorpion pond sans fin. Trois gardiens tiennent le sceau de son nid : Ossira, Korr et Méliane. Abats-en au moins deux. »',
    q2c1:'« Le sceau tient encore. Les gardiens attendent sur la route du nid, chacun dans son repaire. »',
    q2c2:'« Le sceau a craqué comme de l’argile au soleil. La Reine-Scorpion t’attend. »',
    q3c2:'« La Reine est morte ? Alors les caravanes repartiront. Mais quelque chose rit sous le sable. »',
    q3end:'La Reine-Scorpion s’est effondrée dans son nid. Sous elle, un escalier de grès descend : l’acte II t’attend.',
    q4c0:'« Ce rire, c’est Valgris. Trois lieutenants gardent son Sanctuaire : le Héraut du Midi, Dame des Sables et le Forgeron de verre. Abats-en au moins deux. »',
    q4c1:'« Les lieutenants tiennent encore le sceau. Le Héraut se cache derrière son étendard, la Dame soulève le sable, et le Forgeron ne saigne qu’une fois son armure brisée. »',
    q4c2:'« Le sceau a cédé. Bois un coup avant d’y aller. »'},
  names:{plaine:[['Dunes de Solmar','les '],['Erg brûlant','l’'],['Plaine de sel','la '],['Sables rouges','les ']],
    labyrinthe:[['Tombeaux ensablés','les '],['Galeries du Scarabée','les '],['Caveaux de grès','les '],['Nécropole enfouie','la ']],
    couloir:[['Canyon des Vents','le '],['Défilé de grès','le '],['Gorge sèche','la '],['Route des Caravanes','la ']],
    arene:[['Cirque de sable','le '],['Arène du Soleil','l’'],['Cuvette de sel','la '],['Cercle des Dunes','le ']],
    archipel:[['Îlots de l’oasis','les '],['Plateaux de grès','les '],['Buttes rouges','les '],['Mesas brûlées','les ']],
    spirale:[['Spirale des Sables','la '],['Puits du désert','le '],['Tour ensablée','la '],['Vis de grès','la ']],
    descente:[['Gradins de grès','les '],['Marches du Puits','les '],['Faille ocre','la ']],
    effondre:[['Sables mouvants','les '],['Dune qui avale','la '],['Plaine qui s’affaisse','la ']]},
  names2:{plaine:[['Désert du Midi','le '],['Erg des Échos','l’'],['Mer de dunes','la '],['Plaine du Grand Soleil','la ']],
    labyrinthe:[['Tombeaux des Rois ensablés','les '],['Dédale ensablé','le '],['Hypogée du Serment','l’'],['Caveaux du Midi','les ']],
    couloir:[['Route du Mirage','la '],['Canyon des Échos','le '],['Couloir brûlant','le '],['Défilé du Vautour','le ']],
    arene:[['Arène du Midi','l’'],['Fosse aux scorpions','la '],['Cirque des Mirages','le '],['Cercle de verre','le ']],
    archipel:[['Mesas du Serment','les '],['Plateaux du Vautour','les '],['Îles de verre','les '],['Buttes du Mirage','les ']],
    spirale:[['Spirale du Midi','la '],['Puits des Mirages','le '],['Tour du Soleil','la '],['Vis de sable','la ']],
    descente:[['Gouffre ocre','le '],['Degrés du Soleil','les '],['Puits sans eau','le ']],
    effondre:[['Dunes qui croulent','les '],['Erg avalé','l’'],['Plaine de verre fendu','la ']]}});
mkTheme('volcan',{n:'Mont Ardent',camp:'Refuge de Basalte',antre1:['Caldeira de Pyrrha','la '],
  pal:{plain:{floor:[70,44,36],wall:[42,30,28],dark:.76,amb:'255,140,80',ember:.6},crypt:{floor:[50,36,32],wall:[82,52,40],dark:.9},
    lair:{floor:[58,30,24],wall:[92,44,30],dark:.86,amb:'255,120,60',lavaAdd:[80,0,-20],lavaGlow:['#ff7a2a','rgba(255,110,40,.9)'],lavaLight:'255,110,40'},town:{floor:[84,64,56],wall:[70,50,44],dark:.4}},
  npcs:{corvel:{full:'Doyenne Ignis',short:'Ignis',a:'la ',robe:['#8a3a1a','#2a0e06']},bram:{full:'Fumerol le colporteur',robe:['#5a5048','#1a1612']},eline:{full:'Sœur Braise',robe:['#e8c8a8','#8a5a40']},
    hilde:{full:'Orsa la forgeronne',robe:['#6a2a1a','#220a06']},demol:{full:'Magma le démolisseur',robe:['#4a3a32','#16100c']},joueuse:{full:'Cyprine la joueuse',robe:['#7a2a4a','#280a18']},
    recruit:{full:'Varn le recruteur',robe:['#5a3a2a','#1e120a']},lapid:{full:'Obsi la lapidaire',robe:['#2a2a3a','#0a0a12']}},
  pools:[{upTo:2,m:['gelee','rodeur','ver']},{upTo:5,m:['gelee','drake','rodeur','ver','archer','charognard']},{upTo:9,m:['gelee','drake','archer','brute','sorcier','charognard','ver']},
    {upTo:999,m:['gelee','drake','archer','brute','sorcier','charognard','cracheur','bouclier','ombre','invocateur','rampant']}],
  extra:['drake'],extraL:4,
  skins:{rodeur:{n:'Homme de magma',col:'#8a3a1a'},charognard:{n:'Salamandre',fur:['#d04a1a','#3a0c04','#ff8a3a']},archer:{n:'Archer de basalte',flesh:1,col:'#4a3a36'},
    sorcier:{n:'Pyromancien',flesh:1,col:'#a8401a'},ombre:{n:'Esprit de flamme',gcol:'#ffa060'},brute:{n:'Golem de lave',col:'#6a2a14'},
    cracheur:{n:'Cracheur de lave',col:'#5a2a1a'},bouclier:{n:'Garde d’obsidienne',flesh:1,col:'#2a2630'},pleureuse:{n:'Étincelle hurlante',gcol:'#ffc080'},
    invocateur:{n:'Prêtre du Cratère',flesh:1,col:'#7a2a1a'},rampant:{n:'Ver de lave',fur:['#ff6a20','#3a0c04','#ffb060']},lanterne:{n:'Porte-braise',gcol:'#ffb070'},
    ossira:{n:'Ossira, Tisseuse de braise',col:'#c05a2a',wake:'Ossira tisse une toile de feu',death:'Ossira, Tisseuse de braise, est vaincue'},
    korr:{n:'Korr le Brûle-Roches',col:'#8a2a10',wake:'Korr fend la roche',death:'Korr le Brûle-Roches est vaincu'},
    meliane:{n:'Méliane la Fumerolle',gcol:'#ffc8a0',wake:'Méliane siffle comme une fumerolle',death:'Méliane la Fumerolle est vaincue',call:'Méliane siffle : ses étincelles accourent.'},
    varsha:{n:'Pyrrha, la dragonne rousse',kind:'drake',col:'#c0481a',pal:['#2a0a04','#d0501a','#3a0e06','#8a2a10'],wake:'Pyrrha déploie ses ailes',call:'Pyrrha appelle ses dragonnets.',death:'Pyrrha s’écrase dans la lave'},
    heraut:{n:'Le Héraut de basalte',col:'#4a3a36',wake:'Le Héraut de basalte lève son étendard',death:'Le Héraut de basalte est vaincu'},
    cineraire:{n:'Dame des Laves',gcol:'#ffb080',wake:'Dame des Laves fait pleuvoir le feu',death:'Dame des Laves est vaincue'},
    forgeron:{n:'Le Forgeron du Cratère',col:'#3a2a26',wake:'Le Forgeron du Cratère plonge son marteau dans la lave',death:'Le Forgeron du Cratère est vaincu'},etendard:{n:'Étendard de basalte'}},
  qtext:{q1n:'Les pentes en feu',q2n:'Les gardiens de Pyrrha',q3n:'Pyrrha, la dragonne rousse',q4n:'Les lieutenants de Valgris',q5n:'Valgris',
    q1c0:'« La montagne s’est réveillée. Les gelées de feu coulent avec la lave et quelque chose de grand vole au-dessus du cratère. Nettoie les pentes. »',
    q1c1:'« Il en reste. Ça bouillonne encore. »',
    q1c2:'« Bien. Au fond de la caldeira dort Pyrrha, une dragonne rousse. Trois gardiens tiennent le sceau de son antre : Ossira, Korr et Méliane. Abats-en au moins deux. »',
    q2c1:'« Le sceau tient encore. Les gardiens sont sur le chemin du cratère, chacun dans son trou. »',
    q2c2:'« Le sceau a fondu. Pyrrha t’attend. Ne reste jamais devant sa gueule. »',
    q3c2:'« La dragonne est tombée ? Alors la montagne va se rendormir. Mais quelque chose rit sous la lave. »',
    q3end:'Pyrrha s’est écrasée dans sa propre lave. Derrière son nid, une cheminée descend : l’acte II t’attend.',
    q4c0:'« Ce rire, c’est Valgris. Trois lieutenants gardent son Sanctuaire : le Héraut de basalte, Dame des Laves et le Forgeron du Cratère. Abats-en au moins deux. »',
    q4c1:'« Les lieutenants tiennent encore le sceau. Le Héraut se cache derrière son étendard, la Dame fait pleuvoir le feu, et le Forgeron ne saigne qu’une fois son armure brisée. »',
    q4c2:'« Le sceau a cédé. Ne marche pas sur ce qui brille. »'},
  names:{plaine:[['Coulées de basalte','les '],['Plaine de lave','la '],['Champs de scories','les '],['Pentes fumantes','les ']],
    labyrinthe:[['Tunnels de lave','les '],['Galeries de soufre','les '],['Cheminées mortes','les '],['Caveaux d’obsidienne','les ']],
    couloir:[['Faille ardente','la '],['Défilé de magma','le '],['Rigole de feu','la '],['Gorge des Fumerolles','la ']],
    arene:[['Cratère du Brasier','le '],['Arène de basalte','l’'],['Cuvette de feu','la '],['Cercle des Geysers','le ']],
    archipel:[['Îlots de lave','les '],['Rochers flottants','les '],['Récifs de basalte','les '],['Îles de cendre vive','les ']],
    spirale:[['Spirale du Cratère','la '],['Cheminée du volcan','la '],['Puits de magma','le '],['Tour d’obsidienne','la ']],
    descente:[['Gradins de lave','les '],['Marches de basalte','les '],['Gouffre fumant','le ']],
    effondre:[['Croûte qui cède','la '],['Plaine qui fond','la '],['Coulée en marche','la ']]},
  names2:{plaine:[['Flancs du Mont Ardent','les '],['Champs de verre noir','les '],['Plaine des Dragons','la '],['Pentes du Serment','les ']],
    labyrinthe:[['Dédale de soufre','le '],['Nids de dragonnets','les '],['Galeries des Échos','les '],['Cryptes de basalte','les ']],
    couloir:[['Route des Coulées','la '],['Couloir du Dragon','le '],['Défilé des Échos','le '],['Fissure du Serment','la ']],
    arene:[['Arène du Dragon','l’'],['Fosse de magma','la '],['Cratère des Échos','le '],['Cercle de feu','le ']],
    archipel:[['Îles du Cratère','les '],['Récifs du Dragon','les '],['Rochers du Serment','les '],['Îlots de verre','les ']],
    spirale:[['Spirale du Dragon','la '],['Puits de feu','le '],['Vis de basalte','la '],['Tour des Fumées','la ']],
    descente:[['Gouffre du Dragon','le '],['Degrés de feu','les '],['Cheminée sans fond','la ']],
    effondre:[['Cratère qui s’ouvre','le '],['Plaine en fusion','la '],['Coulée des Échos','la ']]}});
mkTheme('abime',{n:'Abîme hurlant',camp:'Dernier Bastion',antre1:['Chenil de la Mère des Molosses','le '],
  pal:{plain:{floor:[70,32,28],wall:[92,32,28],dark:.8,amb:'255,90,70',ember:.5},crypt:{floor:[46,22,22],wall:[82,32,30],dark:.92},
    lair:{floor:[54,18,18],wall:[100,30,26],dark:.88,amb:'255,70,50',lavaAdd:[100,-20,-20],lavaGlow:['#ff3a2a','rgba(255,60,40,.9)'],lavaLight:'255,60,40'},town:{floor:[80,52,48],wall:[70,40,36],dark:.4}},
  npcs:{corvel:{full:'Frère Anselme',short:'Anselme',a:'le ',robe:['#5a2a2a','#1e0a0a']},bram:{full:'Jonas le colporteur',robe:['#5a4a3a','#1a140e']},eline:{full:'Sœur Clémence',robe:['#e8d8d0','#8a6a64']},
    hilde:{full:'Gorm le forgeron',robe:['#4a2a24','#180a08']},demol:{full:'Chaîne le démolisseur',robe:['#4a4040','#161212']},joueuse:{full:'Mara la joueuse',robe:['#6a1a3a','#220814']},
    recruit:{full:'Hugues le recruteur',robe:['#5a3030','#1e0e0e']},lapid:{full:'Rubis la lapidaire',robe:['#8a1a2a','#2a0610']}},
  pools:[{upTo:2,m:['diablotin','molosse','rodeur']},{upTo:5,m:['diablotin','molosse','rodeur','archer','gelee']},{upTo:9,m:['diablotin','molosse','archer','brute','sorcier','gelee','ombre']},
    {upTo:999,m:['diablotin','molosse','archer','brute','sorcier','gelee','ombre','cracheur','bouclier','invocateur','pleureuse']}],
  extra:['molosse'],extraL:1,
  skins:{rodeur:{n:'Damné',col:'#7a4a42'},charognard:{n:'Chien de l’Abîme',fur:['#5a1a14','#1e0806','#8a3020']},archer:{n:'Archer cornu',flesh:1,horns:1,col:'#7a2a1e'},
    sorcier:{n:'Sorcier des abîmes',flesh:1,horns:1,col:'#6a1a2a'},ombre:{n:'Âme hurlante',gcol:'#ff8a7a'},brute:{n:'Bourreau cornu',horns:1,col:'#6a2018'},
    ver:{n:'Rat de soufre',fur:['#ffb040','#5a1a08','#ffd060']},cracheur:{n:'Cracheur de soufre',col:'#6a5a1a'},bouclier:{n:'Légionnaire de l’Abîme',flesh:1,horns:1,col:'#4a1a16'},
    pleureuse:{n:'Âme perdue',gcol:'#ffb0a8'},gelee:{n:'Gelée de soufre'},invocateur:{n:'Geôlier des âmes',flesh:1,horns:1,col:'#3a1a1e'},rampant:{n:'Fouisseur cornu',fur:['#6a2a1a','#1e0806','#8a4a2a']},lanterne:{n:'Porte-chaînes',gcol:'#ffa090'},
    ossira:{n:'Ossira, Geôlière des toiles',col:'#8a2a2a',wake:'Ossira fait grincer ses chaînes',death:'Ossira, Geôlière des toiles, est vaincue'},
    korr:{n:'Korr le Bourreau',col:'#6a1a10',horns:1,wake:'Korr aiguise sa hache',death:'Korr le Bourreau est vaincu'},
    meliane:{n:'Méliane l’Âme hurlante',gcol:'#ffb8b0',wake:'Méliane hurle',death:'Méliane l’Âme hurlante est vaincue',call:'Méliane hurle : les âmes perdues accourent.'},
    varsha:{n:'La Mère des Molosses',kind:'beast',heads:3,fur:['#6a1a12','#1e0604','#8a2a1a'],pal:['#2a0604','#a02018','#3a0a06','#6a1a10'],wake:'La Mère des Molosses gronde de ses trois gueules',call:'La Mère des Molosses appelle sa meute.',death:'La Mère des Molosses s’écroule'},
    heraut:{n:'Le Héraut cornu',col:'#6a2a24',horns:1,wake:'Le Héraut cornu lève son étendard',death:'Le Héraut cornu est vaincu'},
    cineraire:{n:'Dame du Soufre',gcol:'#ffd080',wake:'Dame du Soufre empoisonne l’air',death:'Dame du Soufre est vaincue'},
    forgeron:{n:'Le Forgeron des Chaînes',col:'#3a2a2a',horns:1,wake:'Le Forgeron des Chaînes fait claquer ses chaînes',death:'Le Forgeron des Chaînes est vaincu'},etendard:{n:'Étendard cornu'}},
  qtext:{q1n:'Les meutes de l’Abîme',q2n:'Les geôliers de la Mère',q3n:'La Mère des Molosses',q4n:'Les lieutenants de Valgris',q5n:'Valgris',
    q1c0:'« Ici, la terre hurle. Les molosses à trois têtes chassent en meute et les diablotins rient dans le noir. Fais taire la plaine. »',
    q1c1:'« Il en reste. Écoute : ça aboie encore. »',
    q1c2:'« Bien. Au fond du chenil vit la Mère des Molosses. Trois geôliers tiennent le sceau : Ossira, Korr et Méliane. Abats-en au moins deux. »',
    q2c1:'« Le sceau tient encore. Les geôliers rôdent sur la route du chenil. »',
    q2c2:'« Le sceau a sauté. La Mère des Molosses t’attend. Trois gueules, une seule vie. »',
    q3c2:'« Elle est tombée ? Alors les meutes vont se disperser. Mais quelque chose rit, encore plus bas. »',
    q3end:'La Mère des Molosses s’est écroulée. Derrière le chenil, des marches de fer descendent : l’acte II t’attend.',
    q4c0:'« Ce rire, c’est Valgris. Trois lieutenants gardent son Sanctuaire : le Héraut cornu, Dame du Soufre et le Forgeron des Chaînes. Abats-en au moins deux. »',
    q4c1:'« Les lieutenants tiennent encore le sceau. Le Héraut se cache derrière son étendard, la Dame empoisonne l’air, et le Forgeron ne saigne qu’une fois son armure brisée. »',
    q4c2:'« Le sceau a cédé. Ici, même la lumière a peur. Va quand même. »'},
  names:{plaine:[['Plaine des Damnés','la '],['Champs de soufre','les '],['Terres rouges','les '],['Lande hurlante','la ']],
    labyrinthe:[['Geôles de l’Abîme','les '],['Fosses des Damnés','les '],['Cachots brûlants','les '],['Dédale de chaînes','le ']],
    couloir:[['Chemin des Chaînes','le '],['Défilé des Cris','le '],['Rigole de sang noir','la '],['Pont de fer','le ']],
    arene:[['Fosse aux Molosses','la '],['Arène des Damnés','l’'],['Cercle des Chaînes','le '],['Cirque hurlant','le ']],
    archipel:[['Îlots de soufre','les '],['Rochers suspendus','les '],['Récifs de chaînes','les '],['Îles des Cris','les ']],
    spirale:[['Spirale des Damnés','la '],['Puits hurlant','le '],['Tour des Chaînes','la '],['Vis de fer','la ']],
    descente:[['Cercles inférieurs','les '],['Marches de fer','les '],['Gouffre hurlant','le ']],
    effondre:[['Plaine qui s’ouvre','la '],['Sol qui crie','le '],['Lande avalée','la ']]},
  names2:{plaine:[['Plaine du Serment brisé','la '],['Champs de cendres rouges','les '],['Terres sans pitié','les '],['Lande des Échos','la ']],
    labyrinthe:[['Geôles du Serment','les '],['Dédale des Cris','le '],['Cachots des Échos','les '],['Fosses sans fond','les ']],
    couloir:[['Route des Damnés','la '],['Couloir des Molosses','le '],['Défilé des Échos','le '],['Pont des Cris','le ']],
    arene:[['Arène du Serment','l’'],['Fosse des Échos','la '],['Cercle de soufre','le '],['Cirque des Chaînes','le ']],
    archipel:[['Îles hurlantes','les '],['Rochers du Serment','les '],['Récifs rouges','les '],['Îlots des Échos','les ']],
    spirale:[['Spirale du Serment','la '],['Puits des Échos','le '],['Tour hurlante','la '],['Vis des Damnés','la ']],
    descente:[['Gouffre du Serment','le '],['Degrés des Cris','les '],['Puits aux chaînes','le ']],
    effondre:[['Abîme qui s’ouvre','l’'],['Sol qui cède','le '],['Plaine en chute','la ']]}});
/* Le Givre devient le monde des loups ; le désert et la forêt ont leur flore */
THEMES.givre.pools=[{upTo:2,m:['charognard','loup','rodeur']},{upTo:5,m:['charognard','loup','rodeur','archer','ombre']},{upTo:9,m:['loup','charognard','ombre','archer','brute','sorcier','ver']},
  {upTo:999,m:['loup','charognard','ombre','archer','brute','sorcier','ver','cracheur','bouclier','rampant','invocateur','lanterne']}];
THEMES.givre.skins.brute=Object.assign({},THEMES.givre.skins.brute,{n:'Yéti',col:'#dfe8f0'});
THEMES.foret.flora='foret';THEMES.desert.flora='desert';THEMES.volcan.flora='volcan';THEMES.abime.flora='abime';
/* v6.21 : le Pétardier des cratères (volcan), et ce que chaque famille fait de neuf, dans le bestiaire */
MT.grenadier={n:'Pétardier des cratères',hp:22,dmg:[4,8],spd:1.5,xp:22,size:.95,col:'#5a2a18',kind:'walker',ai:'grenadier',ranged:true,
  lore:'Volcan. Il lance des bombes de lave qui fument au sol avant d’éclater. Sors du cercle avant qu’il soit plein ; les monstres pris dedans brûlent aussi.'};
for(const P_ of THEMES.volcan.pools)if(P_.upTo>2&&!P_.m.includes('grenadier'))P_.m.push('grenadier');
MT.araignee.lore='Forêt. Elle tombe des branches et bondit de loin : son ombre grandit au sol là où elle va retomber.';
MT.rampant.lore='Il nage sous la cendre comme dans de l’eau. Le sol se fissure une seconde avant qu’il sorte : bouge.';
MT.diablotin.lore='Abîme. Il rit, disparaît dans une fumée noire et ressort derrière toi.';
THEMES.cendres.skins={brute:{lore:'Il gratte le sol, une ligne rouge montre sa course, puis il fonce tout droit. S’il heurte un mur, il reste sonné.'}};
Object.assign(THEMES.desert.skins.sorcier,{lore:'Désert. Il soulève des tourbillons de sable qui errent vers toi, poussent et blessent.'});
Object.assign(THEMES.givre.skins.ombre,{lore:'Givre. Il lâche des tourbillons de neige qui poussent et mordent.'});
Object.assign(THEMES.givre.skins.sorcier,{lore:'Givre. Le givre court au sol vers toi, puis une ligne de pics de glace en sort.'});
Object.assign(THEMES.ossu.skins.brute,{lore:'Ossuaire. Sa chaîne brille dans sa main, puis il la lance : touché, il te tire vers lui.'});
Object.assign(THEMES.marais.skins.cracheur,{lore:'Marais. Il gonfle les joues et crache une flaque d’acide qui ronge ton armure.'});
Object.assign(THEMES.astre.skins.archer,{lore:'Forge céleste. Un fil rouge te suit, se fige, puis un rayon très fort part tout droit.'});
/* v6.23 : lot 2 */
Object.assign(THEMES.pre.skins.archer,{lore:'Pré blême. Son arc s’illumine, puis cinq flèches partent en éventail.'});
Object.assign(THEMES.fonte.skins.brute,{lore:'Fonderie. Il se penche, siffle, puis tourne sur lui-même, lames sorties, en avançant.'});
Object.assign(THEMES.fonte.skins.cracheur,{lore:'Fonderie. Il tire en cloche là où tu vas être. Change de direction quand la cible apparaît.'});
Object.assign(THEMES.foret.skins.sorcier,{lore:'Forêt. Sa toile t’immobilise une seconde ; des fils blancs tremblent dans sa main avant.'});
Object.assign(THEMES.abime.skins.sorcier,{lore:'Abîme. Il se gonfle, brille, et un anneau lent part de lui. On le fuit.'});
Object.assign(THEMES.desert.skins.archer,{lore:'Désert. Son arme part et revient : deux chances de te toucher.'});
THEMES.cendres.skins.rodeur={lore:'Un mort que la cendre n’a pas voulu garder. Certains laissent derrière eux une traînée qui brûle.'};
MT.loup.lore='Givre. Un loup ne vient jamais seul : au hurlement, la meute t’encercle puis bondit ensemble.';
/* v6.24 : lot 3 */
MT.chapardeur={n:'Chapardeur des pilotis',hp:18,dmg:[1,2],spd:3.3,xp:16,size:.8,col:'#5a6a3a',kind:'walker',ai:'thief',lore:'Marais. Il court vers toi sans arme, vole de l’or ou une fiole et file. Abattu, il rend le double.'};
THEMES.marais.pools=THEMES.marais.pools.map(P_=>({upTo:P_.upTo,m:P_.m.concat(P_.upTo>2?['chapardeur']:[])}));
Object.assign(THEMES.foret.skins.rodeur,{lore:'Forêt. Certains attendent, invisibles : seul un léger miroitement les trahit.'});
Object.assign(THEMES.marais.skins.ver,{lore:'Marais. Elle s’accroche à toi, te ralentit et suce ta vie jusqu’à ce que tu la frappes.'});
Object.assign(THEMES.ossu.skins.archer,{lore:'Ossuaire. Ses flèches rebondissent deux fois sur les murs : son trajet en pointillé le montre.'});
Object.assign(THEMES.volcan.skins.brute,{lore:'Volcan. Il fait pleuvoir des roches : leurs ombres rondes grandissent au sol avant.'});
Object.assign(THEMES.volcan.skins.sorcier,{lore:'Volcan. Il pousse vers toi un mur de flammes ; contourne-le par un bout.'});
THEMES.givre.skins.rodeur=Object.assign({},THEMES.givre.skins.rodeur,{lore:'Givre. Certains laissent du verglas derrière eux : on y glisse.'});
Object.assign(THEMES.astre.skins.sorcier,{lore:'Forge céleste. Un rayon fait le tour de lui comme une aiguille d’horloge ; un tour pâle l’annonce.'});
Object.assign(THEMES.astre.skins.bouclier,{lore:'Forge céleste. Quand il devient argenté, tes sorts te reviennent dessus.'});
/* Répliques de Valgris dans les nouveaux mondes (les comptes « troisième fois »… viennent du numéro du monde) */
const VTH={foret:{arrive:'« Ici, tout repousse. Moi aussi. »',phase2:'« Mes serviteurs sortent de terre. Encore. »',phase3:'« Les racines se referment. Cours. »',fall:'Valgris est tombé',
    rise:'Les arbres s’écartent. Quelque chose d’immense se relève, couvert de mousse.',ascend:['« Tu as abattu ma forêt. Je t’en ferai pousser une autre. »','','« Plus loin, les arbres ne poussent plus. Viens quand même. »'],notyet:'« Pas encore ? La forêt attendra. Moi aussi. »'},
  desert:{arrive:'« Ici, le soleil ne pardonne rien. Moi non plus. »',phase2:'« Mes serviteurs sortent du sable. »',phase3:'« Le sable se referme. Plus vite. »',fall:'Valgris est tombé',
    rise:'Le désert se soulève. Quelque chose d’immense se relève, ruisselant de sable.',ascend:['« Tu as soif ? Moi, j’ai faim. »','','« L’escalier descend sous le sable. Si tu l’acceptes. »'],notyet:'« Pas encore ? Le soleil t’attendra. Moi aussi. »'},
  volcan:{arrive:'« Ici, la terre saigne du feu. Approche. »',phase2:'« Mes serviteurs remontent de la lave. »',phase3:'« Le cratère se referme. Brûle vite. »',fall:'Valgris est tombé',
    rise:'La lave jaillit. Quelque chose d’immense se relève, rouge comme une forge.',ascend:['« Tu ne brûles pas facilement. J’aime ça. »','','« Plus bas, le feu est encore plus vieux. Si tu l’acceptes. »'],notyet:'« Pas encore ? Le feu attendra. Moi aussi. »'},
  abime:{arrive:'« Ici, tout hurle. Ajoute ta voix. »',phase2:'« Mes serviteurs n’ont jamais dormi. »',phase3:'« L’abîme se referme. Dépêche-toi. »',fall:'Valgris est tombé',
    rise:'L’abîme rugit. Quelque chose d’immense se relève, couronné de cornes noires.',ascend:['« Même ici, tu tiens debout. »','','« Il y a encore plus bas. Il y a toujours plus bas. »'],notyet:'« Pas encore ? Les molosses garderont ta place. »'}};
const ORDW=['','première','deuxième','troisième','quatrième','cinquième','sixième','septième','huitième'];
/* Thèmes d’origine (parties d’avant 6.15) */
for(let w=1;w<=7;w++)if(WORLDS[w])WORLDS[w].theme0=WORLDS[w].theme;
function rollThemes(){const all=Object.keys(THEMES),out={},used=new Set();for(let w=1;w<=7;w++){let pool=all.filter(t=>!used.has(t)&&!(t==='abime'&&w<4)&&!(t==='astre'&&w<3));if(!pool.length)pool=all.filter(t=>!used.has(t));const t=pool[Math.floor(Math.random()*pool.length)];used.add(t);out[w]=t;}return out;}
function applyThemes(){for(let w=1;w<=7;w++)if(WORLDS[w])WORLDS[w].theme=(S&&S.wtheme&&THEMES[S.wtheme[w]]&&S.wtheme[w])||WORLDS[w].theme0;}
/* Répliques de Valgris : la couleur vient du thème, les comptes viennent du numéro du monde */
function vrep(){const w=(S&&S.world)||1,W_=WORLDS[w]||WORLDS[1],cnt=REPLIQUES.valgris[w]||REPLIQUES.valgris[1];if(!W_||W_.theme===W_.theme0)return cnt;
  let base=VTH[W_.theme];if(!base){for(let k=1;k<=7;k++)if(WORLDS[k]&&WORLDS[k].theme0===W_.theme){base=REPLIQUES.valgris[k];break;}}base=base||cnt;
  if(w===1)return Object.assign({},cnt,{phase3:base.phase3||cnt.phase3,rise:base.rise||cnt.rise});
  const A=base.ascend||cnt.ascend;return Object.assign({},base,{hero:cnt.hero,ascend:[A[0],(cnt.ascend||[])[1]||A[1],A[2]]});}

