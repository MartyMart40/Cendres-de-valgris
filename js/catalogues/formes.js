'use strict';
/* Formes de zone : comment la carte est tracée. gen(z) rend la case d’entrée.
   chests : 'order' (coffres le long du chemin), 'rooms' (coffres dans les salles), absent (aucun). */
const FORMES={
  plaine:{n:'Grande plaine',gen:z=>genCave(z),chests:'order',packs:22,size:80},
  labyrinthe:{n:'Labyrinthe',gen:z=>genRooms(z),chests:'rooms',packs:25,size:70},
  couloir:{n:'Grand couloir',gen:z=>genCorridor(z),chests:'alcoves',packs:10,ambush:true,w:140,h:30},
  archipel:{n:'Archipel',gen:z=>genArchipel(z),chests:'order',packs:20,size:76},
  spirale:{n:'Spirale',gen:z=>genSpiral(z),chests:'order',packs:11,size:50},
  descente:{n:'Descente',gen:z=>genDescent(z),chests:'order',packs:13,size:76},
  effondre:{n:'Cendre qui avance',gen:z=>genCave(z),chests:'order',packs:17,size:72,creep:true},
  ouverte:{n:'Grande étendue',gen:z=>genOpen(z),chests:'order',packs:30,size:92},
  arene:{n:'Arène',gen:z=>genArena(z),chests:'none',packs:0,waves:4,size:48,braziers:true},
  antre:{n:'Antre du boss',gen:z=>genLair(z),braziers:true}
};
