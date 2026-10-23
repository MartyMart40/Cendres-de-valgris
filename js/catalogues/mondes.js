'use strict';
/* Mondes et actes : chaque acte est une suite de zones. La dernière zone porte le boss de l’acte.
   seal : la zone reste fermée tant que la quête n’a pas atteint l’état voulu. */
/* Gabarit d’un acte :
   count  : nombre de zones avant l’antre, tirées au hasard avec la graine de la partie
            (une partie garde le nombre de zones de son tirage : changer count ne touche pas les actes déjà tirés)
   first  : forme et nom imposés pour la première zone
   formes : formes possibles (deux zones qui se suivent n’ont jamais la même)
   lvl    : niveau des monstres de la première à la dernière zone
   wp     : zones qui ont un point de passage ; relic : zone d’un coffre de quête (aucun pour l’instant)
   acolytes : mini-boss de l’acte, un par zone tirée ; seal : l’antre s’ouvre quand la quête atteint l’état voulu
   antre  : la zone du boss, toujours en dernier
   hidden : acte prévu mais pas encore jouable */
const WORLDS={
  1:{theme:'cendres',acts:[
    {n:'Acte I',boss:'varsha',count:8,first:{forme:'plaine',name:0},formes:['plaine','labyrinthe','couloir','arene'],lvl:[1, 7],wp:[0,2,4,6,7],relic:null,acolytes:['ossira','korr','meliane'],need:2,quest:'q2',breakMsg:['Le sceau de l’Antre se brise','La porte de l’Antre est ouverte.'],
      antre:{name:'Antre de Varsha',art:'l’',forme:'antre',lvl:10,mons:['ombre','charognard'],packs:4,size:44,boss:'varsha',
        seal:{q:'q2',s:2,msg:'Un sceau de cendre ferme l’Antre. Abats au moins 2 des 3 acolytes de Varsha.'}}},
    {n:'Acte II',boss:'valgris',count:8,bank:'names2',formes:['plaine','labyrinthe','couloir','arene'],lvl:[11, 17],wp:[0,2,4,6,7],relic:null,
      acolytes:['heraut','cineraire','forgeron'],need:2,quest:'q4',breakMsg:['Le sceau du Sanctuaire se brise','Le Sanctuaire de Valgris est ouvert.'],
      antre:{name:'Sanctuaire de Valgris',art:'le ',forme:'antre',lvl:19,mons:['ombre','brute'],packs:3,size:44,boss:'valgris',
        seal:{q:'q4',s:2,msg:'Un sceau gris ferme le Sanctuaire. Abats au moins 2 des 3 lieutenants de Valgris.'}}}
  ]}
};
/* Monde 2 : même gabarit d’actes, monstres plus hauts et plus durs (saut de difficulté) */
WORLDS[2]={theme:'givre',acts:WORLDS[1].acts,lvlAdd:17,mult:{hp:1.25,dmg:1.12,boss:0.55}};
