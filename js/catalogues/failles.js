'use strict';
/* Failles */
const RIFT_NAMES=['Faille des Braises','Faille du Glas','Faille des Ossuaires','Faille des Murmures','Faille du Brasier','Faille des Tombes'];
function riftDef(n){const st=['plain','crypt','lair'][(n-1)%3];return{name:`${RIFT_NAMES[(n-1)%RIFT_NAMES.length]} (niveau ${n})`,lvl:6+n,style:st,forme:st==='crypt'?'labyrinthe':'plaine',chests:'order',mons:st==='plain'?['rodeur','charognard','archer','brute','sorcier']:st==='crypt'?['rodeur','ombre','archer','sorcier','brute']:['ombre','charognard','brute','sorcier'],packs:24,size:st==='crypt'?58:60,rift:n,goal:50};}
