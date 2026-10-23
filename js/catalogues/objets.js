'use strict';
/* ---------- Objets ---------- */
const SLOTS=['weapon','offhand','helm','armor','gloves','boots','belt','amulet','ring1','ring2'];
const SLOTN={weapon:'Arme',offhand:'Main gauche',helm:'Casque',armor:'Armure',gloves:'Gants',boots:'Bottes',belt:'Ceinture',amulet:'Amulette',ring:'Anneau',ring1:'Anneau',ring2:'Anneau'};
/* Types d’objets : taille dans l’inventaire (w×h), stats de base et nom selon le palier (cuir → chevalier → paladin) */
const TYPES={
  dagger:{slot:'weapon',w:1,h:2,d:[2,6],spd:1.3,crit:5,names:['Couteau rouillé','Dague de fer','Dague d’acier','Miséricorde de chevalier','Croc du Paladin']},
  sword:{slot:'weapon',w:1,h:3,d:[3,8],spd:1,names:['Épée rouillée','Épée de fer','Épée d’acier','Épée de chevalier','Lame du Paladin']},
  mace:{slot:'weapon',w:1,h:3,d:[4,10],spd:.95,cd:20,names:['Gourdin clouté','Masse de fer','Masse d’armes','Marteau de chevalier','Masse du Paladin']},
  axe:{slot:'weapon',w:2,h:3,d:[5,12],spd:.85,names:['Hachette','Hache de fer','Hache d’acier','Hache de guerre','Hache du Paladin']},
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
const SLOTTYPES={weapon:['dagger','sword','sword','mace','axe','staff'],offhand:['shield','shield','shield','orb'],helm:['helm'],armor:['armor'],gloves:['gloves'],boots:['boots'],belt:['belt'],amulet:['amulet'],ring:['ring']};
const SLOTW={weapon:3,offhand:2,helm:2,armor:2,gloves:2,boots:2,belt:2,amulet:1,ring:2};
// k: clé, sl: emplacements permis, f: valeur selon niveau d’objet, t: texte
// max: borne selon le niveau d’objet. C’est le plus haut tirage possible (légendaire × LEGK, plus la base du type d’objet) :
// un objet ne la dépasse jamais, même forgé, et les objets trop forts des anciennes sauvegardes y sont ramenés au chargement.
// MARGE : les valeurs qui suivent la courbe G gardent 25 % de jeu pour les arrondis (surtout aux petits niveaux) et la forge.
const LEGK=1.3,MARGE=1.25;
const AFX={
  dmg:{sl:['weapon','ring','amulet','gloves'],f:L=>Math.max(1,Math.round(rnd(1,3.2)*G(L))),t:v=>`+${fmt(v)} dégâts`,max:L=>Math.ceil(3.2*LEGK*MARGE*G(L)),s:'du Boucher'},
  dmgPct:{sl:['weapon','amulet','ring','gloves','offhand'],f:L=>ri(8,Math.min(200,18+L*.7)),t:v=>`+${v} % dégâts`,max:L=>Math.round(Math.ceil(Math.min(200,18+L*.7))*LEGK),s:'de la Furie'},
  life:{sl:['offhand','helm','armor','gloves','boots','belt','amulet','ring'],f:L=>Math.max(2,Math.round(rnd(5,11)*G(L))),t:v=>`+${fmt(v)} vie`,max:L=>Math.ceil(11*LEGK*MARGE*G(L)),s:'du Bœuf'},
  lifePct:{sl:['armor','belt','amulet','helm'],f:()=>ri(4,12),t:v=>`+${v} % vie`,max:()=>Math.round(12*LEGK),s:'du Colosse'},
  armor:{sl:['offhand','helm','armor','gloves','boots','belt'],f:L=>Math.max(1,Math.round(rnd(3,8)*G(L))),t:v=>`+${fmt(v)} armure`,max:L=>Math.ceil(8*LEGK*MARGE*G(L)),s:'du Rempart'},
  armorPct:{sl:['offhand','helm','armor','gloves','boots','belt'],f:()=>ri(10,30),t:v=>`+${v} % armure`,max:()=>Math.round(30*LEGK),s:'de la Forteresse'},
  aspd:{sl:['weapon','gloves','ring','amulet'],f:()=>ri(5,16),t:v=>`+${v} % vitesse d’attaque`,max:()=>Math.round(16*LEGK),s:'de la Rafale'},
  crit:{sl:['weapon','gloves','ring','amulet','helm'],f:()=>ri(2,6),t:v=>`+${v} % chance critique`,max:()=>5+Math.round(6*LEGK),s:'du Faucon'},
  critDmg:{sl:['weapon','amulet','helm','gloves'],f:()=>ri(15,40),t:v=>`+${v} % dégâts critiques`,max:()=>20+Math.round(40*LEGK),s:'du Bourreau'},
  leech:{sl:['weapon','ring','amulet'],f:()=>ri(1,3),t:v=>`${v} % de vol de vie`,max:()=>Math.round(3*LEGK),s:'de la Sangsue'},
  mana:{sl:['helm','ring','amulet','offhand'],f:L=>ri(5,12)+Math.floor(L/4),t:v=>`+${v} mana`,max:L=>8+Math.round((12+Math.floor(L/4))*LEGK),s:'du Sage'},
  manaReg:{sl:['helm','ring','amulet','offhand','belt'],f:()=>ri(10,40),t:v=>`+${v} % régénération de mana`,max:()=>Math.round(40*LEGK),s:'de la Source'},
  spell:{sl:['offhand','amulet','helm','weapon'],f:L=>ri(10,Math.min(150,24+Math.floor(L*.5))),t:v=>`+${v} % dégâts des sorts`,max:L=>20+Math.round(Math.min(150,24+Math.floor(L*.5))*LEGK),s:'des Braises'},
  move:{sl:['boots'],f:()=>ri(5,15),t:v=>`+${v} % vitesse de déplacement`,max:()=>5+Math.round(15*LEGK),s:'du Vent'},
  mf:{sl:['helm','ring','amulet','boots'],f:()=>ri(5,25),t:v=>`+${v} % découverte d’objets`,max:()=>Math.round(25*LEGK),s:'de la Fortune'},
  block:{sl:['offhand'],f:()=>ri(4,10),t:v=>`+${v} % blocage`,max:()=>Math.round(10*LEGK),s:'du Gardien'},
  allSk:{sl:['amulet','helm','offhand'],f:()=>1,t:v=>`+${v} à toutes les compétences`,max:()=>1,s:'du Maître',rare:true}
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
  {id:'whirl',type:'sword',n:'Lame du Derviche',slot:'weapon',base:1,p:'Le tourbillon ne coûte rien.'}
];
/* Butin propre à chaque boss : un légendaire qui ne tombe que sur lui. ch : chance par victoire ; garanti au BOSS_PITY-ième combat sans lui.
   n : nom selon le thème du monde (repli sur cendres) ; fix : bonus toujours présents ; p : pouvoir (voir mise-a-jour.js, bossPowers). */
const BOSS_PITY=25;
const BOSSLOOT=[
  {id:'toile',boss:'ossira',type:'gloves',ch:1/12,fix:['aspd','life'],n:{cendres:'Fileuses d’Ossira',givre:'Fileuses de givre'},p:'Tes coups ralentissent l’ennemi de 30 % pendant 2 s.'},
  {id:'braise',boss:'korr',type:'boots',ch:1/12,fix:['move','life'],n:{cendres:'Semelles du Brûle-Tombes',givre:'Semelles du Brise-Glace'},p:'En marchant, tu laisses une traînée de feu qui brûle les ennemis.'},
  {id:'larme',boss:'meliane',type:'amulet',ch:1/12,fix:['life','lifePct'],n:{cendres:'Larme de Méliane',givre:'Larme gelée de Méliane'},p:'Quand ta vie passe sous 35 %, tu te téléportes plus loin et tu es intouchable 1 s (au plus toutes les 20 s).'},
  {id:'mue',boss:'varsha',type:'armor',ch:1/10,fix:['lifePct','armorPct'],n:{cendres:'Mue de la Mère des Cendres',givre:'Mue de la Mère des Glaces'},p:'Toutes les 8 s en combat, une salve de braises part tout autour de toi.'},
  {id:'pavois',boss:'heraut',type:'shield',ch:1/12,fix:['block','armor'],n:{cendres:'Pavois du Héraut',givre:'Pavois du Héraut blanc'},p:'Toutes les 20 s en combat, tu plantes un étendard : près de lui, +25 % de dégâts et 15 % de dégâts subis en moins (8 s).'},
  {id:'voile',boss:'cineraire',type:'helm',ch:1/12,fix:['spell','mana'],n:{cendres:'Voile de Cendre vive',givre:'Voile de Givre vif'},p:'Tes sorts laissent au sol une flaque de cendre brûlante pendant 3 s.'},
  {id:'marteau',boss:'forgeron',type:'mace',ch:1/12,fix:['dmgPct','critDmg'],n:{cendres:'Marteau sans visage',givre:'Marteau du Gel'},p:'Chaque coup sur le même ennemi lui fait subir 4 % de dégâts en plus, jusqu’à 40 %.'},
  {id:'sceau',boss:'valgris',type:'ring',ch:1/10,fix:['life','leech'],n:{cendres:'Sceau de l’Imbattable'},p:'Quand tu devrais mourir, tu te relèves avec 50 % de ta vie (au plus toutes les 2 minutes).'}
];
const RARE_A=['Croc','Glas','Serment','Rune','Fléau','Murmure','Braise','Écharde','Lien','Sceau','Cri','Voile'];
const RARE_B=['du Crépuscule','des Tombes','de Cendre','des Abîmes','de l’Aube noire','du Veilleur','des Ronces','du Brasier','de la Faille'];
const RCOL=['#e2d6c0','#8796ff','#f0d050','#ff9a3a'];
const RNAME=['Normal','Magique','Rare','Légendaire'];
