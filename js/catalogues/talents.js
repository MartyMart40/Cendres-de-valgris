'use strict';
/* ---------- Compétences ---------- */
/* ---------- Arbre de talents ---------- */
// 3 branches, 7 paliers. Un palier demande un niveau ET des points déjà placés dans la branche. Rangs sans limite pratique.
const BR=[{n:'Guerre',c:'#e07a4a'},{n:'Pyromancie',c:'#ff9a3a'},{n:'Rempart',c:'#7fb0e0'},{n:'Ombre',c:'#a890d8'},{n:'Archerie',c:'#9ad07a'}];
/* v6.51 : la table de jeu du village. Quatre joueurs changent le ton du texte des ennemis (noms et répliques), jamais les noms des boss. */
const TONES={
  normal:{n:'Ton normal',who:'Maître Fendric',c:'#e2d6c0',d:'Les ennemis gardent leurs noms d’aujourd’hui.',lines:[]},
  /* v6.53 : tons poussés à fond, à la demande de Martin. Fins de noms sans accord de genre. */
  demon:{n:'Ton du démon',who:'Brasquin',c:'#ff5a4a',d:'Des noms et des menaces d’une violence démoniaque.',
    tail:['des charniers fumants','qui dévore les entrailles','aux crocs gorgés de sang','du puits des damnés','qui écorche les vivants','des fosses à viscères','qui boit le sang chaud','qui broie les crânes','du brasier sans fin','qui mâche les âmes','aux griffes de boucher','des chaînes de l’Abîme','qui arrache les yeux','de la Gueule sans fond','qui ronge les os','du sabbat écarlate'],
    lines:['Je vais boire ton sang encore chaud !','Ton crâne fera une belle coupe !','Je mâcherai ton âme pour l’éternité !','Saigne, vermine !','Je t’arrache le cœur et je le dévore sous tes yeux !','Tes tripes décoreront mon antre !','L’Abîme a faim, et c’est toi le repas !','Hurle ! J’adore quand ils hurlent !','Je vais t’écorcher lentement, lambeau par lambeau !','Ta peau fera un beau tapis !','Tes os craqueront sous mes dents !','Brûle ! Brûle avec nous pour toujours !','Encore de la viande fraîche !','À genoux devant les Gouffres, chair molle !','Je porterai tes dents en collier !','Ton sang nourrira mes frères !','Ici, pas de lumière : seulement la douleur !','Je vais t’ouvrir comme un sac de grain !','Les damnés t’attendent, ils t’ont gardé une place !','Crève, puis reviens que je te tue encore !','Mes chaînes ont soif de toi !','Je ferai des chandelles avec ta graisse !']},
  ange:{n:'Ton de l’ange',who:'Aubelle',c:'#f0e0a0',d:'Des noms et des paroles de dévot exalté : rien de clair, tout de sacré.',
    tail:['de la Lumière qui sait','qui prie sans cesse','du Cercle éternel','aux mains jointes','de l’Aube promise','qui a vu le Tout','du silence sacré','qui bénit ses propres coups','du septième Ciel','qui chante l’Unique','aux ailes de plume','de la Grâce infinie','qui pardonne avant de frapper','du Mystère béni','qui écoute les étoiles','de l’Amour sans fin'],
    lines:['Tout est déjà écrit, même ce qui ne l’est pas.','La Lumière sait. Moi aussi. Toi, pas encore.','Ce coup est une prière : reçois-la.','Je te frappe avec amour, comme le veut l’Aube.','Le chemin est un cercle, et le cercle est un chemin.','Béni sois-tu, même quand tu tombes.','Ce qui est en haut est en haut. Médite cela.','J’ai vu ta fin : elle était lumineuse.','Ne crains rien : la peur aussi est sacrée.','Le silence m’a tout dit de toi.','Gloire ! Gloire ! Gloire, enfin, à peu près.','L’Unique t’a choisi. Pour quoi ? Mystère.','Chaque blessure est une porte. Entre.','Je ne te combats pas : je te révèle.','Ton âme brille. Laisse-moi la polir.','Même la cendre a sa place au Ciel.','Le Tout est dans le rien, et toi dans le Tout.','Je ne sais pas ce que je fais, mais je le fais saintement.','Les étoiles m’ont parlé de toi. Elles ne disent rien. C’est un signe.','À genoux : non pour moi, pour la beauté du geste.','Reçois la paix. Elle pique un peu.','Amen. Et puis encore amen, pour être sûr.']},
  clown:{n:'Ton du clown',who:'Pirouette',c:'#ff9ad8',d:'Des noms idiots, des blagues bêtes et un peu vulgaires.',
    tail:['qui pète en marchant','aux fesses à l’air','qui fait pouet','du caleçon troué','qui sent les pieds','au nez qui coule','qui rote des confettis','aux grandes chaussures','des tartes à la crème','qui a perdu son pantalon','du coussin péteur','qui mange ses crottes de nez','au slip à pois','qui glisse sur sa banane','qui rit pour rien','du pipi dans la culotte'],
    lines:['Pouet pouet ! Oups, c’était pas mon nez.','Tire sur mon doigt !','J’ai fait caca dans mon armure !','Attention, tarte à la crème… au fromage !','Hé, ton lacet ! Ha ha, t’as même pas de lacets !','Je vais te frapper fort… avec ma banane !','Prout ! Pardon, c’est le trac.','Mon pantalon est tombé, attends-moi !','Qui sent le pied ? C’est moi !','Je sais compter jusqu’à trois : un, deux, banane !','Bisou baveux en approche !','Je suis pas méchant, j’ai juste faim de saucisse !','Ha ha ha ! J’ai oublié pourquoi je ris !','Tu veux voir mes fesses ? Trop tard !','Klaxon ! Pouet ! Klaxon !','Je t’attaque avec mon coussin péteur !','Mon nez coule, prête-moi ta cape !','Glissade ! Ah non, c’est moi qui tombe.','J’ai mis mes souliers à l’envers, comme mon cerveau !','Caca boudin !','Regarde mes chaussettes : une rouge, une sale !','Je me suis lavé l’an passé, profites-en !']}};
function toneK(){return(S&&TONES[S.tone])?S.tone:'normal';}
function hashS(t){let h=7;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))>>>0;return h;}
function toneCore(core){const k=toneK();if(k==='normal'||!core)return core;const T=TONES[k];const w=core.split(' ');let n=(['Petit','Petite','Grand','Grande','Dame','Le','La','Les','Vieux','Vieille'].includes(w[0])&&w.length>1)?2:1;if(w[n]&&/^(d’|de|du|des)$/.test(w[n])&&false)n++;
  const head=w.slice(0,n).join(' ');return head+' '+T.tail[hashS(core)%T.tail.length];}
/* nom affiché d’un ennemi : préfixes (Champion, Élite…) et affixes gardés ; les boss jamais touchés */
function toneName(name,m){if(!name||toneK()==='normal'||(m&&(m.boss||m.dummy)))return name;const mm=/^((?:Champion |Élite : |Écho : |Cible : |Gardien : )*)(.*?)((?: · .*)?)$/.exec(name);if(!mm)return name;return mm[1]+toneCore(mm[2])+mm[3];}
function toneType(k){const t=MT[k];if(!t||t.boss)return monN(k);return toneCore(monN(k));}
/* v6.54 : allure réelle d’un monstre (la peau du monde peut la changer). Seuls les humanoïdes parlent ; les animaux s’annoncent avant de mordre. */
const TALK_KINDS={walker:1,archer:1,ghost:1,lord:1};const BEAST_KINDS={beast:1,weaver:1,scorp:1,drake:1};
function mKind(m){const sk=skinOf(m.t);return sk.kind||m.kind||(MT[m.t]&&MT[m.t].kind);}
function canTalk(m){return !!TALK_KINDS[mKind(m)];}
function isBeast(m){return !!BEAST_KINDS[mKind(m)]&&!m.boss&&!m.dummy;}
const TALK_LIFE=5,TALK_GAP=30;/* v6.55 : 30 s au moins entre deux paroles */
function toneLine(m){const k=toneK();if(k==='normal'||!m||m.boss||m.dummy||!canTalk(m))return;if(!(m.champ||Math.random()<.14))return;if(S.t-(S.lineT||-99)<TALK_GAP)return;S.lineT=S.t;const L=TONES[k].lines;
  S.talk=(S.talk||[]).filter(o=>o.life>0&&o.z===S.cur);S.talk.push({m,z:S.cur,x:m.x,y:m.y,t:'« '+L[Math.floor(Math.random()*L.length)]+' »',col:TONES[k].c,life:TALK_LIFE});if(S.talk.length>3)S.talk.shift();}
function talkLines(t,maxW){const w=t.split(' '),out=[];let cur='';for(const x of w){const tr=cur?cur+' '+x:x;if(cur&&ctx.measureText(tr).width>maxW){out.push(cur);cur=x;}else cur=tr;}if(cur)out.push(cur);return out;}
function drawTalk(){if(!S.talk||!S.talk.length)return;const F=`700 ${Math.round(14*Z+1)}px "Alegreya Sans",sans-serif`;ctx.font=F;ctx.textAlign='center';const maxW=Math.min(W*.62,330*Z);
  for(const o of S.talk){if(o.z!==S.cur||o.life<=0)continue;if(o.m&&!o.m.dead){o.x=o.m.x;o.y=o.m.y;}const[sx,sy]=scr(o.x,o.y);const age=TALK_LIFE-o.life;ctx.globalAlpha=clamp(Math.min(o.life/.6,age/.15),0,1);
    const L=talkLines(o.t,maxW),lh=17*Z+2,top=sy-((o.m&&o.m.size)||1)*62*Z-(L.length-1)*lh-Math.min(age,.25)*24*Z;L.forEach((ln,i)=>{const y=top+i*lh;ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText(ln,sx,y);ctx.fillStyle=o.col;ctx.fillText(ln,sx,y);});}
  ctx.globalAlpha=1;}
const TABLE_XY=[5.5,10.5];
/* v6.54 : morsure annoncée. wind = temps pour s’écarter ; mult compense la cadence plus lente (même danger si on ne bouge pas). */
const BITE={wind:1,cd:.55,r:.85,mult:1.3};
function tableDialog(){const k=toneK(),ex=monN('rodeur');let h=`<h2>La table de jeu</h2><p class="say">Quatre joueurs se disputent une partie de cartes près du mur. Chacun te propose de changer la façon dont on parle des ennemis : leurs noms et ce qu’ils crient. Les noms des boss ne changent jamais.</p>`;
  for(const t of ['normal','demon','ange','clown']){const T=TONES[t],sv=S.tone;S.tone=t;const e=toneCore(ex);S.tone=sv;h+=`<div class="row"><div><div class="it" style="color:${T.c}">${T.who} · ${T.n}</div><div class="st">${T.d} Exemple : ${ex} → ${e}${T.lines.length?` · « ${T.lines[0]} »`:''}</div></div><div class="bt">${k===t?'<span class="st">✓ Choisi</span>':`<button class="min" data-a="tone" data-k="${t}">Choisir</button>`}</div></div>`;}
  openPanel(h+'<button data-a="close">Fermer</button>');}
const TL=[1,4,8,14,22,35,50],TP=[0,3,8,15,25,40,60],RMAX=1e6;
const fK=v=>fmt(v);
const SK={
  mastery:{br:0,ti:0,n:'Maîtrise des armes',ic:'⚔️',pas:true,d:l=>`+${fK(10*l)} % dégâts des attaques (coups d’arme et compétences qui ne sont pas des sorts), +${fK(l)} % chance critique.`},
  whirl:{br:0,ti:0,minL:3,sh:'Tourb.',n:'Tourbillon',ic:'🪓',cost:10,d:l=>`Frappe tous les ennemis autour : ${fK(150+15*(l-1))} %.`},
  thirst:{br:0,ti:2,n:'Soif de sang',ic:'🩸',pas:true,d:l=>`${fK(l)} % de vol de vie (20 % au plus).`},
  cry:{br:0,ti:1,sh:'Cri',n:'Cri de guerre',ic:'📯',cost:15,cd:12,d:l=>`+${fK(25+5*(l-1))} % dégâts et armure pendant 8 s.`},
  frenzy:{br:0,ti:3,n:'Frénésie',ic:'💢',pas:true,d:l=>`+${fK(4*l)} % vitesse d’attaque (6 coups par seconde au plus).`},
  shock:{br:0,ti:3,sh:'Onde',n:'Onde de choc',ic:'💥',cost:14,cd:1.2,d:l=>`Frappe le sol devant toi : ${fK(260+26*(l-1))} % en zone, étourdit.`},
  execute:{br:0,ti:4,n:'Exécution',ic:'🗡️',pas:true,d:l=>`+${fK(40+10*(l-1))} % dégâts contre les ennemis sous 35 % de vie.`},
  avatar:{br:0,ti:5,ult:true,sh:'Avatar',n:'Avatar des Cendres',ic:'🔱',cost:30,cd:30,d:l=>`Ultime. Pendant 10 s : +${fK(150+15*(l-1))} % dégâts et +30 % vitesse d’attaque.`},
  fury:{br:0,ti:6,inf:true,n:'Fureur éternelle',ic:'♾️',pas:true,d:l=>`+${fK(8*l)} % dégâts des attaques. Sans fin.`},
  fire:{br:1,ti:0,sh:'Feu',n:'Boule de feu',ic:'🔥',cost:5,d:l=>`Projectile qui explose : ${fK(150+15*(l-1))} % des dégâts de l’arme.`},
  nova:{br:1,ti:0,sh:'Givre',n:'Nova de givre',ic:'❄️',cost:12,d:l=>`Anneau de glace qui s’élargit autour de toi : ${fK(115+11*(l-1))} % des dégâts quand il passe sur un ennemi, ralentit. Les murs l’arrêtent.`},
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
  /* v5.35 : quatrième branche, l’Ombre (esquive, poison, critiques) */
  dodge:{br:3,ti:0,n:'Pas feutré',ic:'🌫️',pas:true,d:l=>`${fK(Math.min(30,l))} % d’esquive (30 % au plus) : le coup ne te touche pas.`},
  dagger:{br:3,ti:0,sh:'Dagues',n:'Dagues',ic:'🗡',cost:7,d:l=>`Lance trois dagues en éventail : ${fK(90+9*(l-1))} % chacune.`},
  venom:{br:3,ti:1,n:'Venin',ic:'🐍',pas:true,d:l=>`Tes coups empoisonnent : ${fK(20+4*(l-1))} % du coup en plus sur 3 s.`},
  smoke:{br:3,ti:2,sh:'Fumée',n:'Voile de fumée',ic:'💨',cost:15,cd:10,d:l=>`Disparais ${(3+.1*(l-1)).toFixed(1).replace('.',',')} s : les monstres te perdent, +50 % de chance critique.`},
  assassin:{br:3,ti:3,n:'Assassin',ic:'🎯',pas:true,d:l=>`+${fK(2*l)} % de chance critique et +${fK(10*l)} % de dégâts critiques.`},
  backstab:{br:3,ti:4,sh:'Lame',n:'Lame furtive',ic:'🔪',cost:14,cd:2,d:l=>`Surgis derrière la cible et frappe : ${fK(300+30*(l-1))} %.`},
  nightfall:{br:3,ti:5,ult:true,sh:'Nuit',n:'Nuit tombante',ic:'🌑',cost:30,cd:30,d:l=>`Ultime. Pendant ${fK(8+Math.floor((l-1)/5))} s, tous tes coups sont critiques et empoisonnent.`},
  /* v5.80 : branche Archerie (pour l’arc) */
  faucon:{br:4,ti:2,n:'Œil de faucon',ic:'🦅',pas:true,d:l=>`Avec un arc : +${fK(Math.min(20,2*l))} % de chance critique (20 % au plus) et +${fK(6*l)} % de dégâts des attaques.`},
  mainsure:{br:4,ti:1,n:'Main sûre',ic:'✋',pas:true,d:l=>`Avec un arc : +${fK(Math.min(40,4*l))} % de vitesse d’attaque (40 % au plus).`},
  ardente:{br:4,ti:0,bow:true,sh:'Ardente',n:'Flèche ardente',ic:'🔥',cost:6,d:l=>`Une flèche qui explose à l’impact : ${fK(200+20*(l-1))} % autour. Il faut un arc.`},
  perfo:{br:4,ti:3,n:'Perforation',ic:'🎯',pas:true,d:l=>`${fK(Math.min(60,6*l))} % de chances qu’une flèche traverse sa cible (60 % au plus).`},
  salve:{br:4,ti:4,bow:true,sh:'Salve',n:'Salve',ic:'🏹',cost:12,cd:3,d:l=>`Trois flèches coup sur coup sur la cible : ${fK(110+11*(l-1))} % chacune. Il faut un arc.`},
  tempete:{br:4,ti:5,ult:true,bow:true,sh:'Tempête',n:'Tempête de flèches',ic:'🌪️',cost:30,cd:35,d:l=>`Ultime. Pendant ${fK(6+Math.floor((l-1)/5))} s, une flèche part toute seule vers l’ennemi le plus proche, quatre fois par seconde : ${fK(70+7*(l-1))} % chacune.`},
  archinf:{br:4,ti:6,inf:true,n:'Archer sans fin',ic:'♾️',pas:true,d:l=>`+${fK(6*l)} % de dégâts des attaques et +${fK(Math.min(15,l*.5))} % de critique (15 % au plus). Sans fin.`},
  shade:{br:3,ti:6,inf:true,n:'Ombre sans fin',ic:'♾️',pas:true,d:l=>`+${fK(4*l)} % dégâts critiques et +${fK(2*l)} % dégâts. Sans fin.`},
  volley:{br:-1,gem:true,bow:true,sh:'Volée',n:'Volée',ic:'🏹',cost:9,d:l=>`Cinq flèches en éventail : ${fK(80+8*(l-1))} % chacune. Il faut un arc.`},
  pin:{br:-1,gem:true,bow:true,sh:'Clouer',n:'Flèche clouante',ic:'📌',cost:10,cd:3,d:l=>`Une flèche qui cloue la cible ${(1.5+.05*(l-1)).toFixed(1).replace('.',',')} s : ${fK(220+22*(l-1))} %. Il faut un arc.`},
  arain:{br:-1,gem:true,bow:true,sh:'Pluie',n:'Pluie de flèches',ic:'🌧️',cost:22,cd:5,d:l=>`Dix volées s’abattent autour de la cible : ${fK(90+9*(l-1))} % chacune. Il faut un arc.`},
  lance:{br:-1,gem:true,sh:'Lance',n:'Lance d’os',ic:'🦴',cost:8,d:l=>`Lance qui traverse tous les ennemis : ${fK(130+13*(l-1))} %.`},
  bond:{br:-1,gem:true,sh:'Bond',n:'Bond de cendre',ic:'💨',cost:12,cd:3,d:l=>`Bondis vers la cible et frappe autour : ${fK(180+18*(l-1))} %, étourdit.`},
  totem:{br:-1,gem:true,sh:'Totem',n:'Totem de cendre',ic:'🗿',cost:25,cd:10,d:l=>`Plante un totem qui tire pendant 8 s : ${fK(60+6*(l-1))} % par tir.`},
  veil:{br:-1,gem:true,rare:true,sh:'Voile',n:'Pas du Voile',ic:'🌀',cost:0,d:l=>`Tu apparais là où tu vises, jusqu’à ${8+Math.min(6,l)} cases. 3 charges ; une revient toutes les ${fK(Math.max(4,10-.5*(l-1)))} s. Ne passe pas les murs, refusé dans l’arène qui rétrécit.`},
  faux:{br:-1,gem:true,sh:'Faux',n:'Faux spectrale',ic:'🌙',cost:10,d:l=>`Un grand arc devant toi frappe tout ce qu’il touche : ${fK(200+20*(l-1))} %.`},
  chaines:{br:-1,gem:true,sh:'Chaînes',n:'Chaînes d’os',ic:'⛓️',cost:14,cd:6,d:l=>`Attire à toi les ennemis proches et les retient ${(.8+.04*(l-1)).toFixed(1).replace('.',',')} s : ${fK(80+8*(l-1))} %. Pas les boss.`},
  curse:{br:-1,gem:true,sh:'Malédic.',n:'Malédiction',ic:'🕸️',cost:15,cd:8,d:l=>`Les ennemis dans la zone subissent ${fK(25+2*(l-1))} % de dégâts en plus pendant 6 s.`},
  bastion:{br:2,ti:6,inf:true,n:'Bastion éternel',ic:'🏰',pas:true,d:l=>`+${fK(5*l)} % vie et armure. Sans fin.`},
  /* v6.55 : dix talents de plus par classe (cinq par branche) */
  ruee:{br:0,ti:1,sh:'Ruée',n:'Ruée',ic:'🏃',cost:10,cd:4,d:l=>`Fonce tout droit jusqu’à 6 cases et frappe tout ce que tu traverses : ${fK(160+16*(l-1))} %. Les murs t’arrêtent.`},
  brutal:{br:0,ti:1,n:'Brutalité',ic:'🥊',pas:true,d:l=>`+${fK(12*l)} % de dégâts critiques.`},
  fendoir:{br:0,ti:2,sh:'Fendoir',n:'Fendoir',ic:'⚒️',cost:8,d:l=>`Un grand coup en arc devant toi : ${fK(200+20*(l-1))} % à tous les ennemis touchés.`},
  carnage:{br:0,ti:3,n:'Carnage',ic:'🍷',pas:true,d:l=>`Chaque ennemi tué te rend ${fK(Math.min(5,.5*l))} % de ta vie (5 % au plus).`},
  seisme:{br:0,ti:4,sh:'Séisme',n:'Séisme',ic:'🏔️',cost:20,cd:5,d:l=>`Trois ondes partent de toi l’une après l’autre : ${fK(180+18*(l-1))} % chacune, ralentissent 1,5 s.`},
  coupb:{br:2,ti:0,sh:'Bouclier',n:'Coup de bouclier',ic:'🔰',cost:6,cd:1,d:l=>`Frappe l’ennemi le plus proche : ${fK(180+18*(l-1))} %, l’étourdit ${(Math.min(2,1+.03*(l-1))).toFixed(1).replace('.',',')} s (pas les boss).`},
  provoc:{br:2,ti:1,sh:'Provoc.',n:'Provocation',ic:'📢',cost:10,cd:12,d:l=>`Les ennemis à 7 cases se tournent vers toi ; pendant 6 s, tu subis ${fK(Math.min(50,20+2*(l-1)))} % de dégâts en moins.`},
  cuir:{br:2,ti:2,n:'Cuir des cendres',ic:'🧱',pas:true,d:l=>`+${fK(3*l)} % à toutes les résistances (le plafond reste le même).`},
  riposte:{br:2,ti:3,n:'Riposte',ic:'🤺',pas:true,d:l=>`Quand tu bloques un coup, tu frappes celui qui l’a porté : ${fK(80+8*(l-1))} %.`},
  marteau:{br:2,ti:4,sh:'Marteau',n:'Marteau du juge',ic:'🔨',cost:18,cd:4,d:l=>`Un marteau de lumière s’abat sur la cible : ${fK(330+30*(l-1))} % en zone, étourdit 1 s (pas les boss).`},
  flammes:{br:1,ti:1,sh:'Mur',n:'Mur de flammes',ic:'♨️',cost:14,cd:6,d:l=>`Une ligne de feu de 5 cases devant toi brûle 4 s : ${fK(70+7*(l-1))} % par seconde aux ennemis dedans.`},
  pyre:{br:1,ti:1,n:'Brasier intérieur',ic:'🔆',pas:true,d:l=>`+${fK(4*l)} % de dégâts des sorts et +${fK(3*l)} de mana.`},
  flare:{br:1,ti:2,sh:'Érupt.',n:'Éruption',ic:'🎆',cost:12,cd:1.5,d:l=>`Une colonne de feu jaillit sous la cible après 0,5 s : ${fK(260+26*(l-1))} % en zone.`},
  kindle:{br:1,ti:3,n:'Étincelle',ic:'✴️',pas:true,d:l=>`${fK(Math.min(25,2*l))} % de chances qu’une compétence (pas un ultime) se relance toute seule, gratuitement (25 % au plus).`},
  inferno:{br:1,ti:4,sh:'Couronne',n:'Couronne de feu',ic:'💫',cost:24,cd:3,d:l=>`Huit boules de feu partent en cercle autour de toi : ${fK(90+9*(l-1))} % chacune.`},
  sombre:{br:3,ti:0,sh:'Trait',n:'Trait d’ombre',ic:'🖤',cost:6,d:l=>`Un trait sombre : ${fK(140+14*(l-1))} %, et la cible subit 15 % de dégâts en plus pendant 3 s.`},
  fuyant:{br:3,ti:1,n:'Ombre fuyante',ic:'👣',pas:true,d:l=>`+${fK(Math.min(30,3*l))} % de vitesse de déplacement (30 % au plus).`},
  toxin:{br:3,ti:2,sh:'Toxique',n:'Nuage toxique',ic:'☠️',cost:16,cd:5,d:l=>`Un nuage à la cible empoisonne pendant 5 s : ${fK(60+6*(l-1))} % par seconde à tous ceux dedans.`},
  vital:{br:3,ti:3,n:'Points vitaux',ic:'💀',pas:true,d:l=>`+${fK(10*l)} % de dégâts contre les ennemis empoisonnés ou maudits.`},
  lames:{br:3,ti:4,sh:'Lames',n:'Danse des lames',ic:'🌠',cost:18,cd:3,d:l=>`Douze dagues partent en cercle autour de toi : ${fK(90+9*(l-1))} % chacune.`},
  fgivre:{br:4,ti:1,bow:true,sh:'Gel',n:'Flèche de givre',ic:'🥶',cost:7,d:l=>`Une flèche glacée : ${fK(160+16*(l-1))} %, ralentit 2 s. Il faut un arc.`},
  pistage:{br:4,ti:1,n:'Pas du chasseur',ic:'🥾',pas:true,d:l=>`+${fK(Math.min(25,2*l))} % de vitesse de déplacement (25 % au plus) et +${fK(3*l)} % de dégâts des attaques.`},
  repli:{br:4,ti:2,bow:true,sh:'Repli',n:'Saut en arrière',ic:'↩️',cost:8,cd:4,d:l=>`Bondis de 4 cases en arrière et tire : ${fK(150+15*(l-1))} %. Il faut un arc.`},
  fragment:{br:4,ti:3,bow:true,sh:'Fragm.',n:'Flèche à fragments',ic:'🎇',cost:14,cd:2,d:l=>`La flèche éclate sur la cible en cinq explosions : ${fK(90+9*(l-1))} % chacune. Il faut un arc.`},
  concentr:{br:4,ti:4,n:'Concentration',ic:'🧿',pas:true,d:l=>`Avec un arc : +${fK(12*l)} % de dégâts critiques.`},
};
const ACTIVE=Object.keys(SK).filter(k=>!SK[k].pas);
/* v6.13 : rendements décroissants des rangs. Jusqu’au rang 5, chaque rang compte en entier ; du 6e au 15e, 60 % ; au-delà, 35 %.
   Un talent monté à 40 rangs agit comme un rang 20 (au lieu de 40). Les points dépensés ne changent pas. */
function effL(l){l=+l||0;if(l<=5)return l;if(l<=15)return 5+(l-5)*.6;return 11+(l-15)*.35;}
function skRaw(id){const b=p.sk[id]||0;if(!b)return 0;return b+(p.st?p.st.allSk:0);}
