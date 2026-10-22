'use strict';
/* ---------- Compétences ---------- */
/* ---------- Arbre de talents ---------- */
// 3 branches, 7 paliers. Un palier demande un niveau ET des points déjà placés dans la branche. Rangs sans limite pratique.
const BR=[{n:'Guerre',c:'#e07a4a'},{n:'Pyromancie',c:'#ff9a3a'},{n:'Rempart',c:'#7fb0e0'}];
const TL=[1,4,8,14,22,35,50],TP=[0,3,8,15,25,40,60],RMAX=1e6;
const fK=v=>fmt(v);
const SK={
  mastery:{br:0,ti:0,n:'Maîtrise des armes',ic:'⚔️',pas:true,d:l=>`+${fK(8*l)} % dégâts, +${fK(l)} % chance critique.`},
  whirl:{br:0,ti:1,sh:'Tourb.',n:'Tourbillon',ic:'🌀',cost:10,d:l=>`Frappe tous les ennemis autour : ${fK(150+15*(l-1))} %.`},
  thirst:{br:0,ti:2,n:'Soif de sang',ic:'🩸',pas:true,d:l=>`${fK(l)} % de vol de vie (20 % au plus).`},
  cry:{br:0,ti:2,sh:'Cri',n:'Cri de guerre',ic:'📯',cost:15,cd:12,d:l=>`+${fK(25+5*(l-1))} % dégâts et armure pendant 8 s.`},
  frenzy:{br:0,ti:3,n:'Frénésie',ic:'💢',pas:true,d:l=>`+${fK(4*l)} % vitesse d’attaque (6 coups par seconde au plus).`},
  shock:{br:0,ti:3,sh:'Onde',n:'Onde de choc',ic:'💥',cost:14,cd:1.2,d:l=>`Frappe le sol devant toi : ${fK(260+26*(l-1))} % en zone, étourdit.`},
  execute:{br:0,ti:4,n:'Exécution',ic:'🗡️',pas:true,d:l=>`+${fK(40+10*(l-1))} % dégâts contre les ennemis sous 35 % de vie.`},
  avatar:{br:0,ti:5,ult:true,sh:'Avatar',n:'Avatar des Cendres',ic:'🔱',cost:30,cd:30,d:l=>`Ultime. Pendant 10 s : +${fK(150+15*(l-1))} % dégâts et +30 % vitesse d’attaque.`},
  fury:{br:0,ti:6,inf:true,n:'Fureur éternelle',ic:'♾️',pas:true,d:l=>`+${fK(6*l)} % dégâts. Sans fin.`},
  fire:{br:1,ti:0,sh:'Feu',n:'Boule de feu',ic:'🔥',cost:6,d:l=>`Projectile qui explose : ${fK(150+15*(l-1))} % des dégâts de l’arme.`},
  nova:{br:1,ti:0,sh:'Givre',n:'Nova de givre',ic:'❄️',cost:12,d:l=>`Anneau de glace : ${fK(130+12*(l-1))} % des dégâts, ralentit.`},
  mind:{br:1,ti:1,n:'Esprit vif',ic:'🧠',pas:true,d:l=>`+${fK(6*l)} mana et +${fK(15*l)} % de régénération.`},
  chain:{br:1,ti:2,sh:'Éclairs',n:'Chaîne d’éclairs',ic:'⚡',cost:9,d:l=>`Saute sur ${fK(3+Math.min(12,Math.floor(l/3)))} ennemis : ${fK(115+11*(l-1))} %. Rebondit sur une cible seule.`},
  meteor:{br:1,ti:3,sh:'Météore',n:'Météore',ic:'☄️',cost:22,cd:2.5,d:l=>`Écrase une zone : ${fK(320+28*(l-1))} % des dégâts.`},
  combust:{br:1,ti:3,n:'Combustion',ic:'🌡️',pas:true,d:l=>`+${fK(8*l)} % dégâts des sorts, +${fK(15*l)} % dégâts critiques.`},
  embers:{br:1,ti:4,sh:'Braises',n:'Pluie de braises',ic:'🌋',cost:26,cd:4,d:l=>`7 impacts autour de la cible : ${fK(140+14*(l-1))} % chacun.`},
  cataclysm:{br:1,ti:5,ult:true,sh:'Catacl.',n:'Cataclysme',ic:'🌞',cost:40,cd:20,d:l=>`Ultime. Embrase tout l’écran : ${fK(700+70*(l-1))} % des dégâts.`},
  lore:{br:1,ti:6,inf:true,n:'Savoir infini',ic:'📖',pas:true,d:l=>`+${fK(6*l)} % dégâts des sorts. Sans fin.`},
  vigor:{br:2,ti:0,n:'Vitalité',ic:'❤️',pas:true,d:l=>`+${fK(7*l)} % vie.`},
  skin:{br:2,ti:0,n:'Peau de pierre',ic:'🪨',pas:true,d:l=>`+${fK(12*l)} % armure.`},
  bulwark:{br:2,ti:1,n:'Bouclier exercé',ic:'🛡️',pas:true,d:l=>`+${fK(2*l)} % blocage (60 % au plus), +${fK(8*l)} % armure.`},
  regen:{br:2,ti:2,n:'Régénération',ic:'🌿',pas:true,d:l=>`Regagne ${fK(Math.min(6,.4*l))} % de ta vie par seconde.`},
  thorns:{br:2,ti:3,n:'Épines',ic:'🌵',pas:true,d:l=>`Renvoie ${fK(60+12*(l-1))} % des coups reçus en mêlée.`},
  second:{br:2,ti:4,n:'Seconde vie',ic:'🕯️',pas:true,d:l=>`Un coup mortel te laisse à 35 % de vie. Recharge : ${fK(Math.max(25,150-6*(l-1)))} s.`},
  aegis:{br:2,ti:5,ult:true,sh:'Égide',n:'Égide divine',ic:'✨',cost:20,cd:45,d:l=>`Ultime. Invulnérable ${(Math.min(6,2+.1*(l-1))).toFixed(1).replace('.',',')} s et soigne 40 % de ta vie.`},
  bastion:{br:2,ti:6,inf:true,n:'Bastion éternel',ic:'🏰',pas:true,d:l=>`+${fK(5*l)} % vie et armure. Sans fin.`}
};
const ACTIVE=Object.keys(SK).filter(k=>!SK[k].pas);
