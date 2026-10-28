'use strict';
/* ---------- Objets ---------- */
const SLOTS=['weapon','offhand','helm','armor','gloves','boots','belt','amulet','ring1','ring2'];
const SLOTN={weapon:'Arme',offhand:'Main gauche',helm:'Casque',armor:'Armure',gloves:'Gants',boots:'Bottes',belt:'Ceinture',amulet:'Amulette',ring:'Anneau',ring1:'Anneau',ring2:'Anneau'};
/* Types d’objets : taille dans l’inventaire (w×h), stats de base et nom selon le palier (cuir → chevalier → paladin) */
const TYPES={
  dagger:{slot:'weapon',w:1,h:2,d:[2,6],spd:1.3,crit:5,atk:10,names:['Couteau rouillé','Dague de fer','Dague d’acier','Miséricorde de chevalier','Croc du Paladin']},
  sword:{slot:'weapon',w:1,h:3,d:[3,8],spd:1,atk:15,names:['Épée rouillée','Épée de fer','Épée d’acier','Épée de chevalier','Lame du Paladin']},
  mace:{slot:'weapon',w:1,h:3,d:[4,10],spd:.95,cd:20,atk:15,names:['Gourdin clouté','Masse de fer','Masse d’armes','Marteau de chevalier','Masse du Paladin']},
  axe:{slot:'weapon',w:2,h:3,d:[5,12],spd:.85,atk:20,names:['Hachette','Hache de fer','Hache d’acier','Hache de guerre','Hache du Paladin']},
  bow:{slot:'weapon',w:1,h:4,d:[2,7],spd:1.1,crit:3,ranged:true,atk:15,names:['Arc court','Arc de chasse','Arc long','Arc de chevalier','Arc du Paladin']},
  staff:{slot:'weapon',w:1,h:4,d:[2,7],spd:.9,spell:20,names:['Bâton noueux','Bâton ferré','Bâton runique','Bâton de mage-chevalier','Sceptre astral']},
  shield:{slot:'offhand',w:2,h:2,a:6,block:10,names:['Rondache de bois','Écu de fer','Bouclier d’acier','Bouclier blasonné','Égide du Paladin']},
  orb:{slot:'offhand',w:1,h:1,spell:10,mana:8,names:['Pierre terne','Orbe de quartz','Orbe d’azur','Orbe de mage','Orbe astral']},
  helm:{slot:'helm',w:2,h:2,a:4,names:['Capuchon de cuir','Casque de fer','Heaume d’acier','Grand heaume','Heaume ailé du Paladin']},
  armor:{slot:'armor',w:2,h:3,a:12,names:['Tunique de cuir','Cotte de mailles','Cuirasse d’acier','Harnois de chevalier','Armure du Paladin']},
  gloves:{slot:'gloves',w:2,h:2,a:3,names:['Gants de cuir','Gants cloutés','Gantelets de fer','Gantelets d’acier','Poignes du Paladin']},
  boots:{slot:'boots',w:2,h:2,a:3,move:5,names:['Bottes de cuir','Bottes renforcées','Grèves de fer','Solerets d’acier','Solerets du Paladin']},
  belt:{slot:'belt',w:2,h:1,a:3,names:['Ceinture de corde','Ceinturon de cuir','Ceinture cloutée','Ceinture de chevalier','Ceinture du Paladin']},
  amulet:{slot:'amulet',w:1,h:1,names:['Amulette de bois','Amulette de cuivre','Amulette d’argent','Amulette d’or','Amulette astrale']},
  ring:{slot:'ring',w:1,h:1,names:['Anneau de fer','Anneau de cuivre','Anneau d’argent','Anneau d’or','Anneau astral']}
};
const TIERN=['Cuir','Fer','Acier','Chevalier','Paladin'];
function tierOf(it){const L=it.ilvl;return L<12?0:L<28?1:L<50?2:L<80?3:4;}
const SLOTTYPES={weapon:['dagger','sword','sword','mace','axe','staff','bow'],offhand:['shield','shield','shield','orb'],helm:['helm'],armor:['armor'],gloves:['gloves'],boots:['boots'],belt:['belt'],amulet:['amulet'],ring:['ring']};
const SLOTW={weapon:3,offhand:2,helm:2,armor:2,gloves:2,boots:2,belt:2,amulet:1,ring:2};
// k: clé, sl: emplacements permis, f: valeur selon niveau d’objet, t: texte
const AFX={
  dmg:{sl:['weapon','ring','amulet','gloves'],f:L=>Math.max(1,Math.round(rnd(1,3.2)*G(L)*Math.min(1,.4+L*.03))),t:v=>`+${fmt(v)} dégâts`,s:'du Boucher'},
  dmgPct:{sl:['weapon','amulet','ring','gloves','offhand'],f:L=>ri(3+Math.floor(L*.2),Math.min(200,8+Math.floor(L*1.05))),t:v=>`+${v} % dégâts`,s:'de la Furie'},
  life:{sl:['offhand','helm','armor','gloves','boots','belt','amulet','ring'],f:L=>Math.max(2,Math.round(rnd(3,7)*G(L))),t:v=>`+${fmt(v)} vie`,s:'du Bœuf'},
  lifePct:{sl:['armor','belt','amulet','helm'],f:()=>ri(4,12),t:v=>`+${v} % vie`,s:'du Colosse'},
  armor:{sl:['offhand','helm','armor','gloves','boots','belt'],f:L=>Math.max(1,Math.round(rnd(3,8)*G(L))),t:v=>`+${fmt(v)} armure`,s:'du Rempart'},
  armorPct:{sl:['offhand','helm','armor','gloves','boots','belt'],f:()=>ri(10,30),t:v=>`+${v} % armure`,s:'de la Forteresse'},
  aspd:{sl:['weapon','gloves','ring','amulet'],f:()=>ri(5,16),t:v=>`+${v} % vitesse d’attaque`,s:'de la Rafale'},
  crit:{sl:['weapon','gloves','ring','amulet','helm'],f:()=>ri(2,6),t:v=>`+${v} % chance critique`,s:'du Faucon'},
  critDmg:{sl:['weapon','amulet','helm','gloves'],f:()=>ri(15,40),t:v=>`+${v} % dégâts critiques`,s:'du Bourreau'},
  leech:{sl:['weapon','ring','amulet'],f:()=>ri(1,3),t:v=>`${v} % de vol de vie`,s:'de la Sangsue'},
  mana:{sl:['helm','ring','amulet','offhand'],f:L=>ri(5,12)+Math.floor(L/4),t:v=>`+${v} mana`,s:'du Sage'},
  manaReg:{sl:['helm','ring','amulet','offhand','belt'],f:()=>ri(10,40),t:v=>`+${v} % régénération de mana`,s:'de la Source'},
  spell:{sl:['offhand','amulet','helm','weapon'],f:L=>ri(4+Math.floor(L*.2),Math.min(150,10+Math.floor(L*1.1))),t:v=>`+${v} % dégâts des sorts`,s:'des Braises'},
  /* v6.26 : le pendant des sorts pour les coups d’arme et les attaques */
  atk:{sl:['weapon','gloves','amulet','ring'],f:L=>ri(4+Math.floor(L*.2),Math.min(150,10+Math.floor(L*1.1))),t:v=>`+${v} % dégâts des attaques`,s:'du Guerrier'},
  move:{sl:['boots'],f:()=>ri(5,15),t:v=>`+${v} % vitesse de déplacement`,s:'du Vent'},
  mf:{sl:['helm','ring','amulet','boots'],f:()=>ri(5,25),t:v=>`+${v} % découverte d’objets`,s:'de la Fortune'},
  block:{sl:['offhand'],f:()=>ri(4,10),t:v=>`+${v} % blocage`,s:'du Gardien'},
  /* v6.47 : résistances aux éléments */
  resF:{extra:1,sl:['offhand','helm','armor','gloves','boots','belt','ring','amulet'],f:L=>ri(5+Math.floor(L*.1),Math.min(40,12+Math.floor(L*.4))),t:v=>`+${v} % résistance au feu`,s:'de la Salamandre'},
  resC:{extra:1,sl:['offhand','helm','armor','gloves','boots','belt','ring','amulet'],f:L=>ri(5+Math.floor(L*.1),Math.min(40,12+Math.floor(L*.4))),t:v=>`+${v} % résistance au froid`,s:'du Pelage d’hiver'},
  resL:{extra:1,sl:['offhand','helm','armor','gloves','boots','belt','ring','amulet'],f:L=>ri(5+Math.floor(L*.1),Math.min(40,12+Math.floor(L*.4))),t:v=>`+${v} % résistance à la foudre`,s:'du Paratonnerre'},
  resP:{extra:1,sl:['offhand','helm','armor','gloves','boots','belt','ring','amulet'],f:L=>ri(5+Math.floor(L*.1),Math.min(40,12+Math.floor(L*.4))),t:v=>`+${v} % résistance au poison`,s:'de l’Antidote'},
  resA:{extra:1,sl:['amulet','ring','offhand','armor'],f:L=>ri(3+Math.floor(L*.05),Math.min(20,6+Math.floor(L*.2))),t:v=>`+${v} % à toutes les résistances`,s:'du Prisme',rare:true},
  allSk:{sl:['amulet','helm','offhand'],f:()=>1,t:v=>`+${v} à toutes les compétences`,s:'du Maître',rare:true}
};
const LEGS=[
  {id:'fire3',type:'helm',n:'Couronne du Brasier',slot:'helm',p:'La boule de feu se divise en trois.'},
  {id:'echo',type:'gloves',n:'Gantelets de l’Écho',slot:'gloves',p:'Tes coups ont 20 % de chances de lancer une chaîne d’éclairs gratuite.'},
  {id:'freeNova',type:'amulet',n:'Cœur de Varsha',slot:'amulet',p:'La nova de givre ne coûte rien et inflige 40 % de plus.'},
  {id:'vamp',type:'ring',n:'Anneau du Saigneur',slot:'ring',p:'Le vol de vie de tes attaques est doublé.'},
  {id:'wander',type:'boots',n:'Bottes du Vagabond',slot:'boots',p:'+35 % de vitesse de déplacement.'},
  {id:'aegis',type:'shield',n:'Égide de l’Aube',slot:'offhand',base:0,p:'+20 % de blocage, et bloquer soigne 3 % de ta vie.'},
  {id:'cleave',type:'axe',n:'Faux-Lune',slot:'weapon',base:3,p:'Tes attaques frappent tous les ennemis proches.'},
  {id:'crater',type:'armor',n:'Plastron du Cratère',slot:'armor',p:'Quand tu es touché, 12 % de chances de lancer un météore gratuit.'},
  {id:'potion',type:'belt',n:'Ceinture du Rebouteux',slot:'belt',p:'Les fioles soignent toute ta vie.'},
  {id:'warlord',type:'amulet',n:'Collier du Seigneur de guerre',slot:'amulet',p:'Le cri de guerre dure deux fois plus longtemps.'},
  {id:'pierce',type:'bow',n:'Corde du Veilleur',slot:'weapon',p:'Tes flèches traversent tous les ennemis.'},
  {id:'whirl',type:'sword',n:'Lame du Derviche',slot:'weapon',base:1,p:'Le tourbillon ne coûte rien.'},
  /* v5.55 : huit légendaires de plus */
  {id:'hiver',type:'staff',n:'Bâton de l’Hiver noir',slot:'weapon',p:'La nova de givre gèle sur place les ennemis ordinaires pendant 1 s.'},
  {id:'bourreau',type:'mace',n:'Masse du Bourreau',slot:'weapon',p:'Double dégâts contre les ennemis sous 30 % de vie.'},
  {id:'osdague',type:'dagger',n:'Dague d’ossuaire',slot:'weapon',p:'La lance d’os part en trois.'},
  {id:'comete',type:'orb',n:'Orbe des Comètes',slot:'offhand',p:'Le météore tombe en trois impacts.'},
  {id:'conduit',type:'gloves',n:'Gants du Conducteur',slot:'gloves',p:'La chaîne d’éclairs saute sur 4 ennemis de plus.'},
  {id:'avare',type:'ring',n:'Chevalière de l’Avare',slot:'ring',p:'Double l’or ramassé, mais −10 % de dégâts.'},
  {id:'souffle',type:'amulet',n:'Dernier Souffle',slot:'amulet',p:'Sous 30 % de vie : +50 % de dégâts.'},
  {id:'pelerin',type:'boots',n:'Semelles du Pèlerin',slot:'boots',p:'+20 % de vitesse ; hors combat, ta vie remonte trois fois plus vite.'}
];
/* v5.12 : butin propre à chaque boss. Un objet unique par boss, à petite chance. Ajouter un trophée = ajouter une entrée.
   portage de la 6.58, butin des boss de la v5.13 : garanti au BOSS_PITY-ième combat sans lui ; nt : nom selon le thème du monde où il tombe (repli sur n). */
const BOSS_PITY=25;
const UNIQUES={
  ossira:{type:'gloves',n:'Fil de la Tisseuse',nt:{givre:'Fil de la Tisseuse de givre'},leg:'u_web',ch:.03,p:'Tes attaques ralentissent les ennemis pendant 2 s.'},
  korr:{type:'boots',n:'Semelles du Brûle-Tombes',nt:{givre:'Semelles du Brise-Glace'},leg:'u_ember',ch:.03,p:'+20 % de vitesse de déplacement. En marchant, tu brûles les ennemis tout près (30 % des dégâts, deux fois par seconde).'},
  meliane:{type:'amulet',n:'Larme de Méliane',nt:{givre:'Larme gelée de Méliane'},leg:'u_tear',ch:.03,p:'Chaque ennemi abattu te rend 2 % de vie et de mana.'},
  varsha:{type:'helm',n:'Diadème de la Mère des Cendres',nt:{givre:'Diadème de la Mère des Glaces'},leg:'u_echo',ch:.02,p:'Tes sorts (sauf les ultimes) ont 15 % de chances de se relancer gratuitement.'},
  heraut:{type:'shield',n:'Pavois du Héraut',nt:{givre:'Pavois du Héraut blanc'},leg:'u_banner',ch:.03,p:'+15 % de blocage. Bloquer étourdit les ennemis proches pendant 0,5 s.'},
  cineraire:{type:'armor',n:'Linceul de Dame Cinéraire',nt:{givre:'Linceul de Dame Givrée'},leg:'u_veil',ch:.03,p:'Tous les dégâts reçus sont réduits de 15 %.'},
  forgeron:{type:'mace',n:'Marteau sans visage',nt:{givre:'Marteau du Gel'},leg:'u_brk',ch:.03,p:'Tes coups fendent l’armure : les ennemis touchés subissent 20 % de dégâts en plus pendant 4 s.'},
  valgris:{type:'ring',n:'Anneau de l’Épreuve',leg:'u_trial',ch:.015,p:'+1 à toutes les compétences et +25 % de dégâts.'}
};
function uniqName(id,th){const U=UNIQUES[id];return U?(U.nt&&U.nt[th])||U.n:'';}
function genUnique(id,L,th){const U=UNIQUES[id];if(!U)return null;const it=genItem(L,3,0,U.type);it.rar=3;delete it.rname;delete it.suf;th=th||(S?curWorld().theme:'cendres');
  it.leg=U.leg;it.name=uniqName(id,th);it.power=U.p;it.uniq=id;it.uth=th;capItem(it);return refreshName(it);}
/* Tirage à la mort d’un boss : chance du catalogue, garanti au BOSS_PITY-ième combat sans lui (force : garanti, par exemple en acceptant le défi de Valgris) */
function rollUnique(id,x,y,L,force,th){const U=UNIQUES[id];if(!U||!S.cur)return null;S.btry=S.btry||{};const n=(S.btry[id]||0)+1;
  if(!force&&n<BOSS_PITY&&Math.random()>=U.ch){S.btry[id]=n;return null;}S.btry[id]=0;
  const it=genUnique(id,L,th);dropAt(S.cur,x,y,{kind:'item',it});S.pend.push({t:.6,fn:()=>{toast('Butin de boss : '+it.name+' !');sfx('leg');}});burst(x,y,'#ffb040',50);return it;}
const RARE_A=['Croc','Glas','Serment','Rune','Fléau','Murmure','Braise','Écharde','Lien','Sceau','Cri','Voile'];
const RARE_B=['du Crépuscule','des Tombes','de Cendre','des Abîmes','de l’Aube noire','du Veilleur','des Ronces','du Brasier','de la Faille'];
const RCOL=['#e2d6c0','#8796ff','#f0d050','#ff9a3a'];
/* v5.32 : ensembles. Quatre pièces chacun ; bonus à 2 et à 4 pièces portées. Les pièces sont des objets rares verts. */
const SETS={
  veilleur:{n:'Linceul du Veilleur',parts:{helm:'Capuche du Veilleur',armor:'Linceul du Veilleur',gloves:'Mains du Veilleur',boots:'Pas du Veilleur'},b2:'+15 % de vie',b4:'−10 % de dégâts reçus et 1 % de vie regagnée par seconde'},
  penitent:{n:'Braises du Pénitent',parts:{weapon:'Bâton du Pénitent',amulet:'Chapelet du Pénitent',ring:'Anneau du Pénitent',belt:'Cilice du Pénitent'},types:{weapon:'staff'},b2:'+20 % de dégâts des sorts',b4:'La boule de feu lance un projectile de plus'},
  meute:{n:'Crocs de la Meute',parts:{gloves:'Griffes de la Meute',boots:'Foulée de la Meute',ring:'Croc de la Meute',amulet:'Collier de la Meute'},b2:'+10 % de vitesse d’attaque et de déplacement',b4:'Tes coups ont 15 % de chances de frapper deux fois'},
  heraut:{n:'Ossature du Héraut',parts:{offhand:'Pavois d’os',helm:'Crâne du Héraut',armor:'Côtes du Héraut',belt:'Vertèbres du Héraut'},types:{offhand:'shield'},b2:'+15 % de blocage',b4:'Bloquer renvoie la moitié du coup à l’attaquant'},
  /* v5.56 : trois ensembles de plus */
  guetteur:{n:'Plumes du Guetteur',parts:{weapon:'Arc du Guetteur',helm:'Capuchon du Guetteur',gloves:'Mitaines du Guetteur',boots:'Bottes du Guetteur'},types:{weapon:'bow'},b2:'+6 % de chances de critique',b4:'Tes flèches ralentissent les ennemis touchés'},
  ombre:{n:'Voiles de l’Ombre',parts:{weapon:'Lame du Voile',armor:'Pourpoint du Voile',belt:'Ceinture du Voile',ring:'Anneau du Voile'},types:{weapon:'dagger'},b2:'+10 % d’esquive',b4:'Tous tes coups empoisonnent'},
  glas:{n:'Cloches du Glas',parts:{offhand:'Cloche de main',amulet:'Battant du Glas',helm:'Heaume-cloche',armor:'Robe du Sonneur'},types:{offhand:'orb'},b2:'+25 % de mana et de régénération de mana',b4:'Toutes les 6 s, un coup de glas frappe tout autour de toi (150 %)'}};
const SETCOL='#5fd06a';
function itemCol(it){return it&&it.set?SETCOL:RCOL[(it&&it.rar)|0];}
function genSetPiece(L,sid){const S_=sid&&SETS[sid]?SETS[sid]:SETS[pick(Object.keys(SETS))],key=Object.keys(SETS).find(k=>SETS[k]===S_),sl=pick(Object.keys(S_.parts));
  const type=(S_.types&&S_.types[sl])||(sl==='ring'||sl==='amulet'?sl:pick(SLOTTYPES[sl]));let it=genItem(L,2,0,type);for(let t=0;t<20&&it.rar!==2;t++)it=genItem(L,2,0,type);
  it.rar=2;it.set=key;it.rname=S_.parts[sl];delete it.leg;delete it.power;return refreshName(it);}
function setCount(eq){const c={};for(const k in eq){const it=eq[k];if(it&&it.set)c[it.set]=(c[it.set]||0)+1;}return c;}
const RNAME=['Normal','Magique','Rare','Légendaire'];
