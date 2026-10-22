'use strict';
/* Comportements : comment un monstre se bat (voir BEHAV plus bas pour le code) */
/* Monstres : kind = allure dessinée, ai = comportement, boss = entrée du catalogue BOSSES */
const MT={
  rodeur:{n:'Rôdeur cendreux',hp:24,dmg:[2,5],spd:1.5,xp:12,size:1,col:'#76845a',kind:'walker',ai:'melee'},
  charognard:{n:'Charognard',hp:13,dmg:[1,4],spd:3.3,xp:9,size:.8,col:'#8c5a38',kind:'beast',ai:'melee'},
  archer:{n:'Archer d’os',hp:16,dmg:[2,5],spd:1.9,xp:14,size:.95,col:'#d9cfbb',kind:'archer',ranged:true,ai:'ranged'},
  sorcier:{n:'Sorcier d’os',hp:18,dmg:[3,6],spd:1.8,xp:16,size:1,col:'#a898d8',kind:'archer',ranged:true,bolt:true,ai:'ranged'},
  ombre:{n:'Ombre geignarde',hp:30,dmg:[3,7],spd:2.5,xp:20,size:1,col:'#6a58a0',kind:'ghost',ai:'melee'},
  brute:{n:'Brute calcinée',hp:55,dmg:[5,10],spd:1.3,xp:28,size:1.35,col:'#8a6448',kind:'walker',ai:'melee'},
  ossira:{n:'Ossira la Tisseuse',hp:240,dmg:[3,7],spd:1.9,xp:260,size:1.6,col:'#9a8ab0',kind:'weaver',ai:'weaver',boss:'ossira'},
  korr:{n:'Korr le Brûle-Tombes',hp:320,dmg:[5,10],spd:1.4,xp:280,size:1.8,col:'#9a4a26',kind:'walker',ai:'charger',boss:'korr'},
  meliane:{n:'Méliane la Pleureuse',hp:200,dmg:[4,8],spd:2.2,xp:270,size:1.5,col:'#b8c8e8',gcol:'#c8d8f0',kind:'ghost',ai:'wailer',boss:'meliane'},
  pleureuse:{n:'Pleureuse',hp:10,dmg:[2,4],spd:3,xp:5,size:.7,col:'#b8c8e8',gcol:'#a8b8d8',kind:'ghost',ai:'melee'},
  heraut:{n:'Le Héraut gris',hp:300,dmg:[5,9],spd:1.6,xp:600,size:1.7,col:'#8a8a80',kind:'walker',ai:'herald',boss:'heraut'},
  cineraire:{n:'Dame Cinéraire',hp:260,dmg:[4,8],spd:1.9,xp:600,size:1.6,col:'#a0a0a0',gcol:'#c0bcb4',kind:'ghost',ai:'cinder',ranged:true,bolt:true,boss:'cineraire'},
  forgeron:{n:'Le Forgeron sans visage',hp:380,dmg:[6,11],spd:1.2,xp:650,size:1.9,col:'#5a5e66',kind:'walker',ai:'forge',boss:'forgeron'},
  etendard:{n:'Étendard du Héraut',hp:60,dmg:[0,0],spd:0,xp:20,size:1,col:'#8a1e18',kind:'banner',ai:'still'},
  valgris:{n:'Valgris',hp:1000,dmg:[7,12],spd:1.8,xp:3000,size:2.3,col:'#cfc8b8',kind:'lord',ai:'valgris',boss:'valgris',lvl:20},
  varsha:{n:'Varsha, Mère des Cendres',hp:1200,dmg:[5,9],spd:1.7,xp:700,size:2.1,col:'#8a2219',kind:'boss',ai:'melee',boss:'varsha',lvl:12}
};
