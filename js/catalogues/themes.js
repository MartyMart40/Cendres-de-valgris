'use strict';
/* Thèmes : le visage d’un monde (décor de chaque forme, nom du camp) */
const THEMES={
  cendres:{n:'Cendres',camp:'Camp de Halveth',
    decor:{plaine:['plain'],labyrinthe:['crypt'],couloir:['crypt','plain'],arene:['lair'],antre:['lair']},
    names:{
      plaine:[['Plaine des Cendres','la '],['Lande grise','la '],['Champs calcinés','les '],['Steppe de suie','la ']],
      labyrinthe:[['Crypte oubliée','la '],['Ossuaire muet','l’'],['Catacombes du Glas','les '],['Caveaux des Veilleurs','les ']],
      couloir:[['Défilé de suie','le '],['Allée des Pendus','l’'],['Tranchée des Veilleurs','la '],['Galerie des Murmures','la ']],
      arene:[['Fosse aux braises','la '],['Cirque des Os','le '],['Arène de cendre','l’'],['Cercle du Glas','le ']]},
    names2:{
      plaine:[['Désert de braise','le '],['Champs de verre noir','les '],['Plaine des Échos','la '],['Terres brûlées','les ']],
      labyrinthe:[['Ossuaire des Rois','l’'],['Cryptes du Silence','les '],['Dédale de suie','le '],['Caveaux du Serment','les ']],
      couloir:[['Route des Damnés','la '],['Couloir du Héraut','le '],['Défilé des Échos','le '],['Chemin des Cendres vives','le ']],
      arene:[['Arène du Serment','l’'],['Fosse des Échos','la '],['Cirque de verre','le '],['Cercle des Cendres','le ']]},
    pools:[{upTo:2,m:['rodeur','charognard','archer']},{upTo:4,m:['rodeur','ombre','archer','charognard']},{upTo:99,m:['ombre','archer','rodeur','brute','sorcier']}]}
};
/* Monde 2 : Givre éternel. Mêmes comportements, nouvelles allures, nouveaux noms, nouveau camp. */
THEMES.givre={n:'Givre éternel',camp:'Refuge de Brumegel',
  decor:THEMES.cendres.decor,
  names:{
    plaine:[['Plaine de Givre','la '],['Toundra muette','la '],['Champs de neige noire','les '],['Lande des Frimas','la ']],
    labyrinthe:[['Crypte gelée','la '],['Ossuaire de glace','l’'],['Caveaux du Gel','les '],['Galeries de Givre','les ']],
    couloir:[['Col des Bourrasques','le '],['Défilé de glace','le '],['Gorge du Blizzard','la '],['Passage des Gelés','le ']],
    arene:[['Cirque de glace','le '],['Fosse du Givre','la '],['Arène blanche','l’'],['Cercle des Frimas','le ']]},
  names2:{
    plaine:[['Désert blanc','le '],['Glacier des Échos','le '],['Plaine du Silence','la '],['Steppe gelée','la ']],
    labyrinthe:[['Tombeaux de cristal','les '],['Dédale gelé','le '],['Cryptes du Nord','les '],['Ossuaire du Blizzard','l’']],
    couloir:[['Route du Grand Froid','la '],['Faille gelée','la '],['Chemin des Statues','le '],['Couloir de cristal','le ']],
    arene:[['Arène de cristal','l’'],['Fosse des Glaces','la '],['Cirque du Silence','le '],['Cercle du Nord','le ']]},
  antre:{1:['Antre de Varsha des Glaces','l’'],2:['Sanctuaire de Valgris','le ']},
  pools:THEMES.cendres.pools,
  pal:{plain:{floor:[118,128,142],wall:[170,182,198],dark:.72,amb:'235,242,255',ember:0},
    crypt:{floor:[58,70,90],wall:[104,122,146],dark:.86},
    lair:{floor:[52,70,98],wall:[92,118,152],dark:.82,amb:'190,225,255',snow:true,lavaAdd:[-8,40,90],lavaGlow:['#6ac8ff','rgba(140,215,255,.9)'],lavaLight:'120,200,255'},
    town:{floor:[132,138,148],wall:[112,102,92],dark:.3}},
  npcs:{corvel:{full:'Vieille Maren',short:'Maren',a:'la ',robe:['#7a9ab8','#2a3a4e']},bram:{full:'Torvald le trappeur',robe:['#8a7a5a','#3a3020']},
    eline:{full:'Sœur Nivé',robe:['#e8eef4','#8a96a4']},hilde:{full:'Kolbe le forgeron',robe:['#5a6a7a','#20262e']}},
  skins:{
    rodeur:{n:'Rôdeur de givre',col:'#7a9ab8'},charognard:{n:'Loup de givre',fur:['#d0dae4','#5a6a7a','#9aaabb']},
    archer:{n:'Archer gelé',bone:'#cfe4f4'},sorcier:{n:'Sorcier de glace',bone:'#cfe4f4'},ombre:{n:'Spectre glacé',gcol:'#a8d0f0'},
    brute:{n:'Colosse de glace',col:'#8aaccc'},pleureuse:{n:'Gémisseuse',gcol:'#d8ecff'},
    ossira:{n:'Ossira, Tisseuse de givre',col:'#b8d0e8',wake:'Ossira tisse une toile de givre',death:'Ossira, Tisseuse de givre, est vaincue'},
    korr:{n:'Korr le Brise-Glace',col:'#6a8aa8',wake:'Korr racle la glace',death:'Korr le Brise-Glace est vaincu'},
    meliane:{n:'Méliane la Gelée',gcol:'#e0f0ff',wake:'Méliane pleure des larmes de glace',death:'Méliane la Gelée est vaincue',call:'Méliane gémit : ses gémisseuses accourent.'},
    varsha:{n:'Varsha des Glaces',pal:['#0a1a2a','#3a7ab0','#0a2238','#1a3a5a'],wake:'Varsha des Glaces s’éveille',call:'Varsha appelle ses rejetons gelés.',death:'Varsha des Glaces s’est brisée'},
    heraut:{n:'Le Héraut blanc',col:'#b0bcc8',wake:'Le Héraut blanc lève son étendard',death:'Le Héraut blanc est vaincu'},
    cineraire:{n:'Dame Givrée',gcol:'#d8e8f8',wake:'Dame Givrée étend son givre',death:'Dame Givrée est vaincue'},
    forgeron:{n:'Le Forgeron du Gel',col:'#5a7088',wake:'Le Forgeron du Gel frappe son enclume de glace',death:'Le Forgeron du Gel est vaincu'},
    etendard:{n:'Étendard du Héraut blanc'}},
  qtext:{
    q1n:'Les plaines gelées',q2n:'Les acolytes de Varsha',q3n:'La Mère des Glaces',q4n:'Les lieutenants de Valgris',q5n:'Valgris',
    q1c0:'« Le froid est tombé d’un coup, le jour où tu es arrivé. Les bêtes gelées rôdent jusqu’aux palissades. Éclaircis leurs rangs, et on verra ce que tu vaux ici. »',
    q1c1:'« Il en reste. Retourne dans la plaine. »',
    q1c2:'« Bien. Écoute : Varsha a repris forme dans la glace. Son antre est scellé, et trois acolytes gelés en nourrissent le sceau : Ossira, Korr et Méliane. Abats-en au moins deux. »',
    q2c1:'« Le sceau tient encore. Les acolytes rôdent sur le chemin de l’antre, chacun dans son repaire. »',
    q2c2:'« Le sceau a craqué comme un lac au printemps. Varsha des Glaces t’attend. »',
    q3c2:'« Varsha des Glaces est brisée ? Alors le froid va reculer un peu. Mais quelque chose rit, plus bas. »',
    q3end:'Varsha des Glaces s’est brisée en mille éclats. Au fond de son antre, un passage descend dans le froid : l’acte II t’attend.',
    q4c0:'« Ce rire, je le connais : Valgris. Il t’a suivi jusqu’ici, ou c’est toi qui le suis. Trois lieutenants gardent son Sanctuaire : le Héraut blanc, Dame Givrée et le Forgeron du Gel. Abats-en au moins deux. »',
    q4c1:'« Les lieutenants tiennent encore le sceau. Le Héraut se cache derrière son étendard, la Dame sème le givre, et le Forgeron ne saigne qu’une fois son armure brisée. »',
    q4c2:'« Le sceau a cédé. Va. Et reviens vivant, cette fois encore. »',
    q5c2:'« Encore plus grand que la dernière fois ? Alors chaque monde n’est qu’une marche de son escalier. »',
    q5end:'Valgris s’est relevé une fois de plus, plus immense encore. Le givre n’était qu’une marche. D’autres t’attendent.'}};
function themeDecor(th,forme){const d=th.decor[forme];return Array.isArray(d)?d[0]:d;}
