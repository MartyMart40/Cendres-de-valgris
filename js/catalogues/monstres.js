'use strict';
/* Comportements : comment un monstre se bat (voir BEHAV plus bas pour le code) */
/* Monstres : kind = allure dessinée, ai = comportement, boss = entrée du catalogue BOSSES */
const MT={
  /* v5.86 : un monstre propre à certains mondes */
  automate:{n:'Automate de laiton',hp:44,dmg:[4,9],spd:1.4,xp:30,size:1.15,col:'#a88a4a',kind:'walker',ai:'melee',plates:6},
  givreux:{n:'Spectre de givre',hp:30,dmg:[3,7],spd:2.2,xp:26,size:1,col:'#a8d0f0',gcol:'#c8e8ff',kind:'ghost',ai:'frost'},
  noye:{n:'Noyé',hp:34,dmg:[4,8],spd:1.4,xp:24,size:1.05,col:'#4a6a4a',kind:'walker',ai:'drowned'},
  sonneur:{n:'Sonneur',hp:40,dmg:[4,8],spd:1.3,xp:30,size:1.1,col:'#6a6070',kind:'walker',ai:'ringer'},
  ange:{n:'Ange de laiton',hp:36,dmg:[5,9],spd:1.8,xp:32,size:1.05,col:'#d8c070',gcol:'#fff0b0',kind:'ghost',ai:'dasher'},
  invocateur:{n:'Nécromant',hp:26,dmg:[2,5],spd:1.6,xp:30,size:1,col:'#5a4a6a',bone:'#c8c0d8',kind:'archer',ai:'summoner'},
  rampant:{n:'Rampant des fosses',hp:30,dmg:[5,9],spd:2.2,xp:26,size:1.1,col:'#6a5a40',fur:['#8a7a5a','#2a2014','#a89870'],kind:'beast',ai:'burrow'},
  lanterne:{n:'Porte-lanterne',hp:28,dmg:[2,4],spd:1.7,xp:28,size:.95,col:'#a8a070',gcol:'#d8d0a0',kind:'ghost',ai:'healer'},
  arpenteur:{n:'Arpenteur du Voile',hp:34,dmg:[4,8],spd:2.6,xp:40,size:1,col:'#9a8ac8',kind:'ghost',ai:'melee'},
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
  ver:{n:'Rongeur incandescent',hp:9,dmg:[6,10],spd:4.2,xp:8,size:.6,col:'#e0702a',fur:['#ff9a4a','#6a2a10','#ffb060'],kind:'beast',ai:'bomber'},
  cracheur:{n:'Cracheur de suie',hp:22,dmg:[3,6],spd:1.6,xp:18,size:1.05,col:'#4a4038',kind:'walker',ai:'spitter',ranged:true},
  bouclier:{n:'Porte-bouclier d’os',hp:40,dmg:[4,8],spd:1.4,xp:24,size:1.1,col:'#c8bca0',kind:'archer',ai:'shield'},
  breche:{n:'Brèche d’invasion',hp:90,dmg:[0,0],spd:0,xp:60,size:1.4,col:'#8a40c0',kind:'breach',ai:'still'},
  nid:{n:'Nid de cendre',hp:70,dmg:[0,0],spd:0,xp:40,size:1.3,col:'#5a3020',kind:'nest',ai:'nest'},
  etendard:{n:'Étendard du Héraut',hp:60,dmg:[0,0],spd:0,xp:20,size:1,col:'#8a1e18',kind:'banner',ai:'still'},
  valgris:{n:'Valgris',hp:1000,dmg:[7,12],spd:1.8,xp:3000,size:2.3,col:'#cfc8b8',kind:'lord',ai:'valgris',boss:'valgris',lvl:20},
  varsha:{n:'Varsha, Mère des Cendres',hp:1200,dmg:[5,9],spd:1.7,xp:700,size:2.1,col:'#8a2219',kind:'boss',ai:'melee',boss:'varsha',lvl:12}
};

/* v5.38 : bestiaire */
if(MT.rodeur)MT.rodeur.lore="Un mort que la cendre n’a pas voulu garder. Il marche vers la chaleur.";MT.arpenteur.lore="Il marche entre deux pas du monde. On ne le voit qu’au moment où il est déjà ailleurs.";
MT.automate.lore="Six plaques de laiton le protègent. Chaque coup en fait sauter une ; après, il saigne de l’huile comme les autres.";MT.givreux.lore="Il ne frappe pas fort. Il ralentit. Le froid fait le reste.";MT.noye.lore="Il sort des mares en traînant l’eau avec lui. Là où il tombe, l’eau reste et ronge.";MT.sonneur.lore="Il frappe une cloche que personne ne voit. Ceux qui l’entendent restent figés.";MT.ange.lore="Une statue qui a appris à voler en ligne droite. Elle prévient toujours avant.";MT.invocateur.lore="Il ne se bat jamais. Il appelle ceux qui le font à sa place. Abats-le d’abord.";MT.rampant.lore="Il nage sous la cendre comme dans de l’eau, et sort là où tu étais.";MT.lanterne.lore="Sa lanterne recoud les morts. Tant qu’elle brille, rien ne reste à terre longtemps.";
if(MT.charognard)MT.charognard.lore="Il suit les autres morts et mange ce qu’ils laissent.";
if(MT.archer)MT.archer.lore="Ses doigts ont oublié tout, sauf la corde.";
if(MT.sorcier)MT.sorcier.lore="Il récite encore des prières, mais à l’envers.";
if(MT.ombre)MT.ombre.lore="Ce qui reste quand le corps a fini de brûler.";
if(MT.brute)MT.brute.lore="Un forgeron, un soldat ? Personne ne s’en souvient. Il cogne.";
if(MT.pleureuse)MT.pleureuse.lore="Elles pleurent pour Méliane. Elles ne savent faire que ça.";
if(MT.ver)MT.ver.lore="Un rongeur gorgé de braise. Il cherche à mourir contre toi.";
if(MT.cracheur)MT.cracheur.lore="Il a avalé trop de suie et la recrache, encore chaude.";
if(MT.bouclier)MT.bouclier.lore="Un garde d’os qui n’a jamais lâché son bouclier.";
if(MT.nid)MT.nid.lore="Un ventre de cendre qui pond sans fin.";
if(MT.ossira)MT.ossira.lore="Acolyte de Varsha. Elle tisse des toiles de cendre.";
if(MT.korr)MT.korr.lore="Acolyte de Varsha. Il charge en laissant le sol en feu.";
if(MT.meliane)MT.meliane.lore="Acolyte de Varsha. Elle apparaît là où on ne l’attend pas.";
if(MT.heraut)MT.heraut.lore="Lieutenant de Valgris. Abats son étendard d’abord.";
if(MT.cineraire)MT.cineraire.lore="Lieutenante de Valgris. Le sol brûle où elle passe.";
if(MT.forgeron)MT.forgeron.lore="Lieutenant de Valgris. Brise son armure avant tout.";
if(MT.varsha)MT.varsha.lore="La Mère des Cendres. Elle couve ses rejetons sous la montagne.";
if(MT.valgris)MT.valgris.lore="Il ne meurt jamais. Il dit que c’est un test.";
