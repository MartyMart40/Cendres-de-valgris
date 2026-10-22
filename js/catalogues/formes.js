'use strict';
/* Formes de zone : comment la carte est tracée. gen(z) rend la case d’entrée.
   chests : 'order' (coffres le long du chemin), 'rooms' (coffres dans les salles), absent (aucun). */
const FORMES={
  plaine:{n:'Grande plaine',gen:z=>genCave(z),chests:'order',packs:15,size:64},
  labyrinthe:{n:'Labyrinthe',gen:z=>genRooms(z),chests:'rooms',packs:17,size:56},
  couloir:{n:'Grand couloir',gen:z=>genCorridor(z),chests:'alcoves',packs:9,ambush:true,w:112,h:30},
  arene:{n:'Arène',gen:z=>genArena(z),chests:'none',packs:0,waves:4,size:48,braziers:true},
  antre:{n:'Antre du boss',gen:z=>genLair(z),braziers:true}
};
