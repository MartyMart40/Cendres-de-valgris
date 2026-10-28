'use strict';
let itemId=1;
function refreshName(it){const t=TYPES[it.type];it.base=t.names[tierOf(it)];
  it.name=it.rar===3?it.name:it.rar===2?it.rname:it.rar===1?`${it.base} ${it.suf||''}`.trim():it.base;return it;}
const LOOT={drop:.1,dropRift:.12,leg:.2,rare:5,mag:32,chest:.45,corpse:.3};
function mfEff(mf){return mf>0?mf*250/(mf+250):mf;}
function genItem(L,minR,mf,forceType){
  L=Math.max(1,Math.round(L));mf=mf||0;
  /* v6.04 : moins de rares et de légendaires, et la découverte d’objets a des rendements décroissants pour eux (250 % de découverte n’en valent plus que 125). */
  let rar;const r=Math.random()*100,k=1+mf/100,kr=1+mfEff(mf)/100;
  const leg=LOOT.leg*kr,rare=LOOT.rare*kr,mag=LOOT.mag*k;
  rar=r<leg?3:r<leg+rare?2:r<leg+rare+mag?1:0;if(minR)rar=Math.max(rar,minR);
  let legd=null,type;
  if(rar===3&&!forceType){legd=pick(LEGS);type=legd.type;}
  else if(forceType)type=forceType;
  else{const ws=Object.entries(SLOTW);let t=Math.random()*ws.reduce((a,b)=>a+b[1],0);type=pick(SLOTTYPES[ws.find(([,w])=>(t-=w)<0)[0]]);}
  const b=TYPES[type],slot=b.slot;
  if(rar===3&&!legd){const c_=LEGS.filter(l=>l.type===type);legd=c_.length?pick(c_):null;if(!legd)rar=2;}/* v6.20 : un type forcé tire au hasard parmi ses légendaires */
  if((slot==='ring'||slot==='amulet')&&rar===0)rar=1;
  const g=G(L);const it={id:itemId++,type,slot,rar,ilvl:L,aff:{}};
  if(b.d){it.d=[Math.max(1,Math.round(b.d[0]*g)),Math.max(2,Math.round(b.d[1]*g))];it.spd=b.spd;if(b.crit)it.aff.crit=b.crit;if(b.cd)it.aff.critDmg=b.cd;}
  if(b.spell)it.aff.spell=b.spell;if(b.atk)it.aff.atk=b.atk;if(b.mana)it.aff.mana=b.mana;
  if(b.a)it.a=Math.max(1,Math.round(b.a*g));if(b.block)it.block=b.block;if(b.move)it.aff.move=b.move;
  const n=rar===0?0:rar===1?ri(1,2):rar===2?ri(3,5):ri(4,6);
  const pool=Object.keys(AFX).filter(a=>!AFX[a].extra&&AFX[a].sl.includes(slot)&&(!AFX[a].rare||rar>=2)&&(a!=='allSk'||L>=12));
  pool.sort(()=>Math.random()-.5);const keys=pool.slice(0,n);
  for(const a of keys){let v=AFX[a].f(L);if(rar===3&&a!=='allSk')v=Math.round(v*1.3);it.aff[a]=(it.aff[a]||0)+v;}
  /* v6.47 : une résistance en plus des autres bonus, parfois (pièces d’armure et bijoux) */
  if(rar>=1&&AFX.resF.sl.includes(slot)&&Math.random()<RES_P[rar]){const a=rar>=2&&AFX.resA.sl.includes(slot)&&Math.random()<.25?'resA':pick(['resF','resC','resL','resP']);let v=AFX[a].f(L);if(rar===3)v=Math.round(v*1.3);it.aff[a]=(it.aff[a]||0)+v;}
  if(rar===3){it.leg=legd.id;it.name=legd.n;it.power=legd.p;}
  if(rar===1)it.suf=AFX[keys[0]].s;if(rar===2)it.rname=`${pick(RARE_A)} ${pick(RARE_B)}`;
  it.val=Math.round((6+L*3)*(1+rar*1.6));
  capItem(it);return refreshName(it);
}
/* v5.10 : plafonds des bonus. Valeur la plus haute qu’un bonus peut avoir selon le niveau de l’objet
   (légendaire : × 1,3), plus la base du type (crit de la dague, sorts du bâton…). Appliqué au tirage, à la forge et au chargement. */
const AFX_MAX={dmg:L=>3.2*G(L)*Math.min(1,.4+L*.03),dmgPct:L=>Math.min(200,8+L*1.05),life:L=>11*G(L),lifePct:()=>12,armor:L=>8*G(L),armorPct:()=>30,aspd:()=>16,crit:()=>6,critDmg:()=>40,
  leech:()=>3,mana:L=>12+Math.floor(L/4),manaReg:()=>40,spell:L=>Math.min(150,10+Math.floor(L*1.1)),atk:L=>Math.min(150,10+Math.floor(L*1.1)),move:()=>15,mf:()=>25,block:()=>10,allSk:()=>1,resF:L=>Math.min(40,12+Math.floor(L*.4)),resC:L=>Math.min(40,12+Math.floor(L*.4)),resL:L=>Math.min(40,12+Math.floor(L*.4)),resP:L=>Math.min(40,12+Math.floor(L*.4)),resA:L=>Math.min(20,6+Math.floor(L*.2))};
const FLAT_AFX={dmg:1,life:1,armor:1};
function affCap(k,it){const f=AFX_MAX[k];if(!f)return 0;const b=TYPES[it.type]||{},L=Math.max(1,it.ilvl||1);
  const base={crit:b.crit,critDmg:b.cd,spell:b.spell,mana:b.mana,move:b.move,atk:b.atk}[k]||0;let v=f(L);if(it.rar===3&&k!=='allSk')v*=1.3;if(it.cxk===k&&k!=='allSk')v*=1.5;
  if(FLAT_AFX[k])v=v*1.03+2;return Math.ceil(v)+base;}
function capItem(it){if(!it||typeof it!=='object')return 0;let n=0;if(!it.aff||typeof it.aff!=='object'){it.aff={};n++;}
  for(const k in it.aff){const v=+it.aff[k];if(!AFX[k]||!isFinite(v)){delete it.aff[k];n++;continue;}const m=affCap(k,it);
    if(v>m){it.aff[k]=m;n++;}else if(v<1){it.aff[k]=1;n++;}}
  const b=TYPES[it.type],g=G(Math.max(1,it.ilvl||1));
  if(b&&b.d&&Array.isArray(it.d)){const m0=Math.ceil(b.d[0]*g*1.03)+1,m1=Math.ceil(b.d[1]*g*1.03)+1;let d0=+it.d[0],d1=+it.d[1];
    if(!isFinite(d0)||!isFinite(d1)||d0>m0||d1>m1||d0>d1){d0=Math.min(isFinite(d0)?d0:m0,m0);d1=Math.min(isFinite(d1)?d1:m1,m1);it.d=[Math.max(1,Math.min(d0,d1)),Math.max(2,d1)];n++;}}
  if(b&&b.a&&it.a!=null){const m=Math.ceil(b.a*g*1.03)+1;if(!isFinite(+it.a)||it.a>m){it.a=m;n++;}}
  if(it.block!=null&&b&&it.block>(b.block||0)){it.block=b.block||0;if(!it.block)delete it.block;n++;}
  if(it.pot!=null&&(!isFinite(+it.pot)||it.pot>100)){it.pot=100;n++;}
  return n;}
/* v5.13 : le Démolisseur. Détruire un objet rend un matériau selon sa rareté ; les matériaux servent à relancer un bonus. */
const MATS=[{k:'dust',n:'Poussière grise',c:'#b8b4a8'},{k:'shard',n:'Éclats bleus',c:'#8796ff'},{k:'ember',n:'Braises jaunes',c:'#f0d050'},{k:'heart',n:'Cœurs de légende',c:'#ff9a3a'}];
function salvOf(it){const hi=it.ilvl>=20?1:0;if(it.uniq)return{heart:3};return[{dust:2+hi},{shard:2+hi,dust:1},{ember:2+hi,shard:2},{heart:1,ember:3}][it.rar]||{dust:1};}
function matsTxt(o){return MATS.filter(m=>o[m.k]).map(m=>`<span style="color:${m.c}">${o[m.k]} ${m.n.toLowerCase()}</span>`).join(', ');}
function addMats(o){p.mats=p.mats||{};for(const k in o)p.mats[k]=(p.mats[k]||0)+o[k];}
/* Relancer un bonus : magique 3 éclats, rare 3 braises, légendaire 1 cœur */
const REROLL={1:{shard:3},2:{ember:3},3:{heart:1}};
function canPay(c){p.mats=p.mats||{};for(const k in c)if((p.mats[k]||0)<c[k])return false;return true;}
function reroll(it){const c=REROLL[it.rar];if(!c||it.lock||it.corr)return null;const keys=Object.keys(it.aff).filter(k=>AFX[k]&&k!=='allSk');if(!keys.length)return null;if(!canPay(c)){say('Pas assez de matériaux.');return null;}
  for(const k in c)p.mats[k]-=c[k];const k=pick(keys),b=TYPES[it.type]||{},base={crit:b.crit,critDmg:b.cd,spell:b.spell,mana:b.mana,move:b.move,atk:b.atk}[k]||0,old=it.aff[k];
  let v=AFX[k].f(Math.max(1,it.ilvl));if(it.rar===3)v=Math.round(v*1.3);it.aff[k]=v+base;capItem(it);if(p.eq&&Object.values(p.eq).includes(it))recalc();
  return{k,old,now:it.aff[k]};}
/* v5.23 : artisanat. Ajouter un bonus (magique 2 au plus, rare 5) ou monter la rareté (normal → magique → rare). Jamais légendaire. */
const CRAFT={add:{1:{shard:4,dust:4},2:{ember:4}},up:{0:{dust:5},1:{shard:6,ember:2}},max:{1:2,2:5}};
function affPool(it){return Object.keys(AFX).filter(a=>!AFX[a].extra&&AFX[a].sl.includes(it.slot)&&!(a in it.aff)&&(!AFX[a].rare||it.rar>=2));}
function affCount(it){const b=TYPES[it.type]||{},base={crit:b.crit,critDmg:b.cd,spell:b.spell,mana:b.mana,move:b.move,atk:b.atk};return Object.keys(it.aff).filter(k=>!(base[k]&&it.aff[k]===base[k])).length;}
function rollAff(it){const pool=affPool(it);if(!pool.length)return null;const k=pick(pool);it.aff[k]=AFX[k].f(Math.max(1,it.ilvl));return k;}
function canAdd(it){return!!(!it.corr&&CRAFT.add[it.rar]&&affCount(it)<CRAFT.max[it.rar]&&affPool(it).length);}
function craftAdd(it){if(!canAdd(it)||it.lock)return null;const c=CRAFT.add[it.rar];if(!canPay(c)){say('Pas assez de matériaux.');return null;}for(const k in c)p.mats[k]-=c[k];
  const k=rollAff(it);capItem(it);refreshName(it);if(Object.values(p.eq).includes(it))recalc();return k;}
function craftUp(it){const c=CRAFT.up[it.rar];if(!c||it.lock||it.set||it.corr)return false;if(!canPay(c)){say('Pas assez de matériaux.');return false;}for(const k in c)p.mats[k]-=c[k];
  if(it.rar===0){it.rar=1;const k=rollAff(it);it.suf=k?AFX[k].s:'';}
  else{it.rar=2;it.rname=`${pick(RARE_A)} ${pick(RARE_B)}`;for(let g=0;g<30&&affCount(it)<3&&rollAff(it);g++);}
  it.val=Math.round((6+(it.vl??it.ilvl)*3)*(1+it.rar*1.6));capItem(it);refreshName(it);if(Object.values(p.eq).includes(it))recalc();return true;}
/* v5.46 : objets corrompus. Un seul essai par objet, et plus aucun artisanat ensuite.
   30 % rien, 25 % un bonus hors normes (plafond × 1,5), 20 % un bonus interdit en plus, 15 % tout relancé, 10 % l’objet tombe en poussière. */
const CORR={1:{ember:2},2:{heart:1},3:{heart:1}};
function canCorrupt(it){return!!(it&&CORR[it.rar]&&!it.corr&&!it.lock);}
function corrupt(it,r){if(!canCorrupt(it))return null;const c=CORR[it.rar];if(!canPay(c)){say('Pas assez de matériaux.');return null;}for(const k in c)p.mats[k]-=c[k];
  if(r==null)r=Math.random();let out;
  if(r<.10){const i=p.bag.indexOf(it);if(i>=0)p.bag.splice(i,1);addMats({dust:2});return'ruine';}
  it.corr=true;const keys=Object.keys(it.aff).filter(k=>AFX[k]&&k!=='allSk');
  if(r<.40)out='rien';
  else if(r<.65&&keys.length){const k=pick(keys);it.cxk=k;it.aff[k]=affCap(k,it);out='hors';}
  else if(r<.85){const pool=Object.keys(AFX).filter(a=>AFX[a].sl.includes(it.slot)&&!(a in it.aff)&&a!=='allSk');if(pool.length){const k=pick(pool);it.aff[k]=Math.round(AFX_MAX[k](Math.max(1,it.ilvl))*.8)||1;out='interdit';}else out='rien';}
  else{const b=TYPES[it.type]||{},base={crit:b.crit,critDmg:b.cd,spell:b.spell,mana:b.mana,move:b.move,atk:b.atk};for(const k of keys){let v=AFX[k].f(Math.max(1,it.ilvl));if(it.rar===3)v=Math.round(v*1.3);it.aff[k]=v+(base[k]||0);}out='relance';}
  capItem(it);if(p.eq&&Object.values(p.eq).includes(it))recalc();return out;}
/* v6.11 : orbes de forge. Des pierres qui tombent en butin et qu’on pose sur un objet pour le transformer.
   Chacune fait une seule chose. Elles ne touchent ni les objets verrouillés, ni les corrompus. */
const ORBS={
  braise:{n:'Orbe de braise',c:'#e8a060',w:28,d:'Rend magique un objet normal (1 ou 2 bonus).'},
  ecume:{n:'Orbe d’écume',c:'#8fc8e8',w:24,d:'Relance les bonus d’un objet magique.'},
  oubli:{n:'Orbe de l’oubli',c:'#b0a898',w:8,d:'Ramène un objet magique ou rare à l’état normal.'},
  cendre:{n:'Orbe de cendre',c:'#d8c070',w:10,d:'Rend rare un objet magique : il garde ses bonus et en gagne un.'},
  vide:{n:'Orbe du vide',c:'#8878b8',w:5,d:'Retire un bonus au hasard d’un objet magique ou rare.'},
  tumulte:{n:'Orbe du tumulte',c:'#e06a50',w:9,d:'Relance tous les bonus d’un objet rare (3 à 5 bonus).'},
  poids:{n:'Orbe du juste poids',c:'#e8e0c0',w:7,d:'Relance la valeur des bonus sans changer lesquels (magique, rare, ensemble, légendaire).'},
  elev:{n:'Orbe d’élévation',c:'#7fd07f',w:5,d:'Remonte un objet magique ou mieux au niveau du héros, gratuitement.'},
  serment:{n:'Orbe du serment',c:'#c080ff',w:2,d:'Scelle un bonus choisi : l’écume, le tumulte et le vide ne le touchent plus.'},
  aube:{n:'Orbe de l’aube',c:'#ffd890',w:2,d:'Ajoute un bonus à un objet rare (6 au plus).'}};
const ORB_KEYS=Object.keys(ORBS);
/* Échanges chez le Démolisseur : ses matériaux contre des orbes */
const ORB_TRADE={braise:{dust:4},ecume:{shard:3},oubli:{dust:2,shard:2},cendre:{ember:3},vide:{ember:3,shard:2},poids:{ember:4},tumulte:{ember:5},elev:{shard:6,ember:2},serment:{heart:2},aube:{heart:3}};
function orbPick(){let t=Math.random()*ORB_KEYS.reduce((a,k)=>a+ORBS[k].w,0);for(const k of ORB_KEYS){t-=ORBS[k].w;if(t<=0)return k;}return 'braise';}
function addOrb(k,n){p.orbs=p.orbs||{};p.orbs[k]=(p.orbs[k]||0)+(n||1);}
function orbCount(){return Object.values(p.orbs||{}).reduce((a,b)=>a+b,0);}
function baseAff(it){const b=TYPES[it.type]||{};return{crit:b.crit,critDmg:b.cd,spell:b.spell,mana:b.mana,move:b.move,atk:b.atk};}
function ownAff(it){const B=baseAff(it);return Object.keys(it.aff).filter(k=>AFX[k]&&!(B[k]&&it.aff[k]===B[k]));}
function dropAff(it,k){const B=baseAff(it);if(B[k])it.aff[k]=B[k];else delete it.aff[k];if(it.seal===k)delete it.seal;}
function addAffOrb(it){const pool=affPool(it).concat(Object.keys(AFX).filter(a=>AFX[a].sl.includes(it.slot)&&(baseAff(it)[a]&&it.aff[a]===baseAff(it)[a])&&(!AFX[a].rare||it.rar>=2)));if(!pool.length)return null;const k=pick(pool);
  let v=AFX[k].f(Math.max(1,it.ilvl));if(it.rar===3&&k!=='allSk')v=Math.round(v*1.3);if(!(v>0))v=1;/* v6.15 : jamais un bonus nul (sinon l’orbe tournait sans fin) */it.aff[k]=(baseAff(it)[k]||0)+v;return k;}
function sufFix(it){if(it.rar===1){const o=ownAff(it);it.suf=o.length?AFX[o[0]].s:'';}}
/* Vrai si l’orbe peut agir sur cet objet ; sinon le texte dit pourquoi */
/* v6.57 : un orbe qui change les propriétés coûte aussi un point de forge (sinon l’objet parfait vient trop vite) */
const ORB_FP=['braise','ecume','cendre','vide','tumulte','poids','aube'];
function orbWhy(k,it){if(!it)return'Aucun objet.';if(it.lock)return'Objet verrouillé.';if(it.corr)return'Objet corrompu : plus rien ne le change.';if(ORB_FP.includes(k)&&typeof fpOf==='function'&&fpOf(it)<=0)return'Plus de points de forge : cet objet est fini.';const own=ownAff(it).length,spec=it.rar===3||it.set||it.uniq;
  switch(k){case'braise':return it.rar===0?'':'Il faut un objet normal.';
    case'ecume':return it.rar===1&&!it.set?'':'Il faut un objet magique.';
    case'oubli':return(it.rar===1||it.rar===2)&&!it.set?'':'Il faut un objet magique ou rare.';
    case'cendre':return it.rar===1&&!it.set?'':'Il faut un objet magique.';
    case'vide':return(it.rar===1||it.rar===2)&&!it.set?(ownAff(it).filter(a=>a!==it.seal).length?'':'Aucun bonus à retirer.'):'Il faut un objet magique ou rare.';
    case'tumulte':return it.rar===2&&!it.set?'':'Il faut un objet rare.';
    case'poids':return it.rar>=1&&own?'':'Il faut un objet avec des bonus.';
    case'elev':return it.rar>=1?(it.ilvl<p.lvl?'':'Déjà à ton niveau.'):'Il faut un objet magique ou mieux.';
    case'serment':return it.rar>=1&&!spec&&own?'':'Il faut un objet magique ou rare avec des bonus.';
    case'aube':return it.rar===2&&!it.set?(own>=6?'Déjà 6 bonus.':affPool(it).length?'':'Plus aucun bonus possible sur ce type d’objet.'):'Il faut un objet rare.';}return'Inconnu.';}
function useOrb(k,it,sealKey){const why=orbWhy(k,it);if(why){say(why);return null;}if(!(p.orbs||{})[k]){say('Tu n’as pas cet orbe.');return null;}
  let msg='';const keep=it.seal&&it.aff[it.seal]!=null?it.seal:null;
  if(k==='braise'){it.rar=1;const n=ri(1,2);for(let i=0;i<n;i++)addAffOrb(it);sufFix(it);msg='L’objet devient magique.';}
  else if(k==='ecume'){for(const a of ownAff(it))if(a!==keep)dropAff(it,a);const n=ri(1,2);for(let g=0;g<30&&ownAff(it).length<n&&addAffOrb(it);g++);sufFix(it);msg='Nouveaux bonus.';}
  else if(k==='oubli'){for(const a of ownAff(it))dropAff(it,a);it.rar=0;delete it.suf;delete it.rname;delete it.seal;msg='L’objet redevient normal.';}
  else if(k==='cendre'){it.rar=2;it.rname=`${pick(RARE_A)} ${pick(RARE_B)}`;delete it.suf;addAffOrb(it);msg='L’objet devient rare.';}
  else if(k==='vide'){const c=ownAff(it).filter(a=>a!==keep);const a=pick(c);dropAff(it,a);sufFix(it);msg='Bonus retiré : '+AFX[a].t(1).replace(/^\+?1 ?%? ?/,'');}
  else if(k==='tumulte'){for(const a of ownAff(it))if(a!==keep)dropAff(it,a);const n=ri(3,5);for(let g=0;g<40&&ownAff(it).length<n&&addAffOrb(it);g++);msg='Tous les bonus ont changé.';}
  else if(k==='poids'){const B=baseAff(it);for(const a of ownAff(it)){if(a==='allSk')continue;let v=AFX[a].f(Math.max(1,it.ilvl));if(it.rar===3)v=Math.round(v*1.3);it.aff[a]=v+(B[a]||0);}msg='Les valeurs ont changé.';}
  else if(k==='elev'){it.vl=it.vl??it.ilvl;/* v6.45 : comme la forge, le prix de revente ne monte pas */const f=G(p.lvl)/G(it.ilvl),up=v=>Math.max(1,Math.round(v*f));if(it.d)it.d=it.d.map(up);if(it.a)it.a=up(it.a);for(const a of['dmg','life','armor'])if(it.aff[a])it.aff[a]=up(it.aff[a]);if(it.aff.mana)it.aff.mana+=Math.floor((p.lvl-it.ilvl)/4);it.ilvl=p.lvl;msg='Objet remonté au niveau '+p.lvl+'.';}
  else if(k==='serment'){if(!sealKey||!ownAff(it).includes(sealKey)){say('Choisis le bonus à sceller.');return null;}it.seal=sealKey;msg='Bonus scellé : '+AFX[sealKey].t(it.aff[sealKey]);}
  else if(k==='aube'){const a=addAffOrb(it);msg=a?'Nouveau bonus : '+AFX[a].t(it.aff[a]):'Rien à ajouter.';}
  if(ORB_FP.includes(k))it.fp=fpOf(it)-1;p.orbs[k]--;if(!p.orbs[k])delete p.orbs[k];it.val=Math.round((6+(it.vl??it.ilvl)*3)*(1+it.rar*1.6));capItem(it);refreshName(it);if(p.eq&&Object.values(p.eq).includes(it))recalc();S.orbsUsed=(S.orbsUsed||0)+1;return msg;}
function orbTrade(k){const c=ORB_TRADE[k];if(!c||!canPay(c)){say('Pas assez de matériaux.');return false;}for(const m in c)p.mats[m]-=c[m];addOrb(k);return true;}
/* v6.57 : craft de précision. Les orbes restent le hasard ; les essences ajoutent la précision.
   Démolisseur : extraire une propriété d’un objet (détruit) en essence. Forgeronne : poser l’essence sur un objet (place libre ou propriété remplacée).
   Chaque objet a 3 points de forge ; un transfert en coûte un ; à zéro, l’objet est fini. Une case de relique par objet. */
const FP_MAX=3,ESS_MAX=30,ESS_RF={1:.7,2:.85,3:1};
function fpOf(it){return it&&it.fp!=null?it.fp:FP_MAX;}
function essOf(it,k){if(!it||!it.aff||!ownAff(it).includes(k))return null;const B=baseAff(it)[k]||0,rf=(it.set||it.uniq)?1:(ESS_RF[it.rar]||0);if(!rf)return null;const v=Math.max(1,Math.round((it.aff[k]-B)*rf));return{k,v,L:it.ilvl,r:it.uniq||it.set?3:it.rar};}
function essTxt(e){return AFX[e.k]?AFX[e.k].t(e.v):'?';}
function essExtract(it,k){if(!it||it.lock||it.corr)return null;const i=p.bag.indexOf(it);if(i<0)return null;p.ess=p.ess||[];if(p.ess.length>=ESS_MAX){say(`Tu gardes déjà ${ESS_MAX} essences : pose-en chez ${npcF('hilde').replace(/<\/?b>/g,'')}.`);return null;}const e=essOf(it,k);if(!e)return null;p.bag.splice(i,1);p.ess.push(e);return e;}
function essCost(it){return{gold:Math.round(30*G(Math.max(1,it.ilvl||1))),mats:(it.rar>=2||it.set||it.uniq)?{ember:2}:{shard:2}};}
function essRoom(it){return it.rar>=2||it.set||it.uniq?6:2;}
function essWhy(e,it){if(!e||!it)return'Choisis un objet et une essence.';if(it.corr)return'Objet corrompu : plus rien ne le change.';if(fpOf(it)<=0)return'Plus de points de forge : cet objet est fini.';const A=AFX[e.k];if(!A||!A.sl.includes(it.slot))return'Cette essence ne va pas sur ce type d’objet.';if(A.rare&&it.rar<2&&!it.set&&!it.uniq)return'Il faut un objet rare ou mieux.';
  const B=baseAff(it)[e.k]||0,own=ownAff(it);if(own.includes(e.k)&&it.aff[e.k]-B>=e.v)return'Ce bonus est déjà aussi fort.';const c=essCost(it);if(p.gold<c.gold||!canPay(c.mats))return'Pas assez d’or ou de matériaux.';return'';}
function essFull(e,it){return!ownAff(it).includes(e.k)&&ownAff(it).length>=essRoom(it);}
function essApply(i,it,rep){const e=(p.ess||[])[i];const w=essWhy(e,it);if(w){say(w);return null;}if(essFull(e,it)){if(!rep||!ownAff(it).includes(rep)||rep===it.seal){say('Objet plein : choisis la propriété à remplacer.');return null;}dropAff(it,rep);}
  const c=essCost(it);p.gold-=c.gold;for(const m in c.mats)p.mats[m]-=c.mats[m];const B=baseAff(it)[e.k]||0,cur=it.aff[e.k]!=null?it.aff[e.k]-B:0;
  if(it.rar===0){it.rar=1;}it.aff[e.k]=B+Math.max(cur,e.v);it.fp=fpOf(it)-1;p.ess.splice(i,1);sufFix(it);capItem(it);refreshName(it);if(p.eq&&Object.values(p.eq).includes(it))recalc();S.essUsed=(S.essUsed||0)+1;return AFX[e.k].t(it.aff[e.k]);}
/* Reliques : une par objet ; elle change un sort au lieu d’ajouter des chiffres */
const RELICS={
  rl_gouffre:{n:'Relique du Gouffre',sk:'whirl',cls:'guerrier',d:'Le Tourbillon attire les ennemis proches (4 cases) avant de frapper.'},
  rl_replique:{n:'Cloche de la Réplique',sk:'shock',cls:'guerrier',d:'L’Onde de choc se répète une demi-seconde plus tard, à 60 %.'},
  rl_juge:{n:'Clou du Juge',sk:'marteau',cls:'guerrier',d:'Le Marteau du juge retombe une deuxième fois, à 60 %.'},
  rl_ecaille:{n:'Écaille du Rempart',sk:'coupb',cls:'guerrier',d:'Le Coup de bouclier te rend 5 % de ta vie.'},
  rl_etoile:{n:'Graine d’étoile',sk:'fire',cls:'mage',d:'La Boule de feu se divise en trois flammes à l’impact (40 % chacune).'},
  rl_hiver:{n:'Cœur de l’hiver',sk:'nova',cls:'mage',d:'La Nova de givre gèle 1 s les ennemis proches (pas les boss).'},
  rl_orage:{n:'Fil d’orage',sk:'chain',cls:'mage',d:'La Chaîne d’éclairs repart une deuxième fois, à 50 %.'},
  rl_pluie:{n:'Pluie d’étoiles',sk:'meteor',cls:'mage',d:'Deux petits météores tombent autour du premier (40 % chacun).'},
  rl_ricochet:{n:'Plume du ricochet',sk:'volley',cls:'archer',d:'Les flèches de la Volée rebondissent sur un deuxième ennemi.'},
  rl_eclat:{n:'Pointe d’éclat',sk:'ardente',cls:'archer',d:'La Flèche ardente éclate en trois flammes à l’impact (40 % chacune).'},
  rl_nord:{n:'Plume du Nord',sk:'fgivre',cls:'archer',d:'La Flèche de givre traverse tous les ennemis.'},
  rl_rafale:{n:'Corde de rafale',sk:'salve',cls:'archer',d:'La Salve tire deux flèches de plus.'}};
const REL_KEYS=Object.keys(RELICS);let RELK=1;
/* chance de relique : mini-boss 25 %, boss d’acte 60 %, Valgris à terre 100 % ; 70 % de la classe du héros. Le Brasier (plus tard) multipliera ici. */
function relicK(){return 1+BR_REL*((S&&brOn(S.cur))?S.br:0);}
function relicPick(){const mine=REL_KEYS.filter(k=>RELICS[k].cls===p.cls);return mine.length&&Math.random()<.7?pick(mine):pick(REL_KEYS);}
function relicDrop(m,z,ch){if(!m||!z||m.echo||m.pup||(z.def&&z.def.trial))return;const c=ch!=null?ch:m.mini?.25:m.guard?.15:.6;if(Math.random()<c*relicK())dropAt(z,m.x,m.y,{kind:'relic',k:relicPick()});}
function relicAfter(id,tx,ty,free,np0,nm0){const L=p.st.legs;
  if((id==='fire'&&L.rl_etoile)||(id==='ardente'&&L.rl_eclat))for(let i=np0;i<S.proj.length;i++)if(S.proj[i].kind==='fire'&&!S.proj[i].kid)S.proj[i].split=true;
  if(id==='volley'&&L.rl_ricochet)for(let i=np0;i<S.proj.length;i++)if(S.proj[i].kind==='parrow')S.proj[i].rico=1;
  if(id==='fgivre'&&L.rl_nord)for(let i=np0;i<S.proj.length;i++)if(S.proj[i].kind==='parrow')S.proj[i].pf=true;
  if(id==='meteor'&&L.rl_pluie&&S.mets.length>nm0){const m0=S.mets[nm0];for(const[ox,oy]of[[1.7,.8],[-1.2,-1.5]])S.mets.push({x:m0.x+ox,y:m0.y+oy,t:m0.t+.25,mult:m0.mult*.4,r:(m0.r||2.4)*.7});}
  if(id==='nova'&&L.rl_hiver){for(const m of S.cur.mons)if(!m.dead&&!m.boss&&dist(m,p)<3.3+m.size*.3)m.stun=Math.max(m.stun||0,1);}
  if(id==='coupb'&&L.rl_ecaille)p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.05);
  if(!free&&((id==='shock'&&L.rl_replique)||(id==='marteau'&&L.rl_juge)||(id==='chain'&&L.rl_orage))){const k=id==='chain'?.5:.6;S.pend.push({t:.5,fn:()=>{RELK=k;try{castSkill(id,tx,ty,true);}finally{RELK=1;}}});}}
function relCount(){return Object.values(p.relics||{}).reduce((a,b)=>a+b,0);}
/* v6.14 : la lapidaire. Elle pose les orbes, les échange contre des matériaux, et montre la sacoche. */
let LAPT='poser',LSEL=null,LSEAL=false;
function lapItems(){return SLOTS.filter(k=>p.eq[k]).map(k=>({it:p.eq[k],src:'eq'})).concat(p.bag.map(it=>({it,src:'bag'})));}
function lapidPanel(t){if(t)LAPT=t;if(LSEL&&!lapItems().some(o=>o.it===LSEL))LSEL=null;const O=p.orbs||{};
  let h=`<h2>${npcF('lapid')}</h2><div class="tabs">${[['poser','Poser un orbe'],['echanger','Échanger'],['sacoche','Sacoche ('+orbCount()+')']].map(([k,n])=>`<button class="${LAPT===k?'on':''}" data-a="laptab" data-k="${k}">${n}</button>`).join('')}</div>`;
  if(LAPT==='poser'){
    if(!LSEL)h+=`<p class="say">« Montre-moi l’objet. Je te dirai ce qu’on peut en faire. »</p><p class="st"><b>1.</b> Choisis un objet ci-dessous. <b>2.</b> Choisis l’orbe à poser. Un orbe qui change les propriétés coûte un des ${FP_MAX} points de forge de l’objet (l’élévation, le serment et l’oubli sont gratuits).</p>`;
    else{const it=LSEL;h+=`<div class="selbox" style="border-top:0;margin-top:0;padding-top:0"><div class="selhead"><img alt="" src="${iconURL(it)}" class="r${it.rar}"><div><div class="it" style="color:${itemCol(it)}">${it.name}</div><div class="st">${it.uniq?'Trophée de boss':it.set?'Pièce d’ensemble':RNAME[it.rar]} · ${SLOTN[it.slot]} · niveau ${it.ilvl}${Object.values(p.eq).includes(it)?' · porté':''}</div></div></div>
      <div class="st lines">${itemLines(it).join('<br>')}</div></div>`;
      if(LSEAL)h+=`<div class="matbox"><b>Quel bonus sceller ?</b><div>${ownAff(it).map(k=>`<button class="min" data-a="lseal" data-k="${k}">${AFX[k].t(it.aff[k])}</button>`).join('')}<button class="min" data-a="lsealno">Annuler</button></div></div>`;
      h+=`<h3>Orbes</h3>`+ORB_KEYS.map(k=>{const n=O[k]||0,why=orbWhy(k,it);return`<div class="row"><div><div class="it" style="color:${ORBS[k].c}">${ORBS[k].n} <span class="st">× ${n}</span></div><div class="st">${ORBS[k].d}${n&&why?` <span style="color:#d07060">${why}</span>`:''}</div></div><div class="bt"><button class="min" data-a="lorb" data-k="${k}" ${!n||why?'disabled style="opacity:.4"':''}>Poser</button></div></div>`;}).join('');
      h+=`<button class="min" data-a="lselno">Choisir un autre objet</button>`;}
    h+=`<h3>${LSEL?'Autres objets':'Tes objets'}</h3><div class="laplist">${lapItems().filter(o=>o.it!==LSEL).map(o=>`<button class="lapit" data-a="lsel" data-src="${o.src}" data-id="${o.it.id}"><img alt="" src="${iconURL(o.it)}" class="r${o.it.rar}"><span style="color:${itemCol(o.it)}">${o.it.name}</span><span class="st">${o.src==='eq'?'porté · ':''}${RNAME[o.it.rar]} · niv. ${o.it.ilvl}</span></button>`).join('')||'<p class="st">Ton sac est vide.</p>'}</div>`;}
  else if(LAPT==='echanger'){h+=`<p class="say">« Tes poussières et tes braises valent quelque chose, chez moi. »</p>${orbTradeBox()}<p class="st">Les matériaux viennent du ${npcF('demol')}, quand il démolit tes objets.</p>`;}
  else{h+=`<p class="st">Les orbes tombent des monstres (surtout champions et boss), des coffres et des dépouilles. Elles ne touchent ni les objets verrouillés, ni les corrompus.</p>`+ORB_KEYS.map(k=>`<div class="row"><div><div class="it" style="color:${ORBS[k].c}">${ORBS[k].n} : ${O[k]||0}</div><div class="st">${ORBS[k].d}</div></div></div>`).join('');}
  const sc=panel.scrollTop;openPanel(h+'<div><button data-a="close">Fermer</button></div>');panel.classList.add('wide');if(!t)panel.scrollTop=sc;}
function orbPanel(){const O=p.orbs||{};openPanel(`<h2>Sacoche d’orbes</h2><p class="st">Les orbes tombent des monstres, surtout des champions et des boss, et des coffres. Pour en poser un, va voir ${npcF('lapid')} au camp : elle pose les orbes et les échange contre tes matériaux.</p>
  ${ORB_KEYS.map(k=>`<div class="row"><div><div class="it" style="color:${ORBS[k].c}">${ORBS[k].n} : ${O[k]||0}</div><div class="st">${ORBS[k].d}</div></div></div>`).join('')}<div><button data-a="tab" data-t="inv">Retour au sac</button><button data-a="close">Fermer</button></div>`);}
const CORR_MSG={ruine:'L’objet se défait en poussière grise.',rien:'La corruption s’installe… sans rien changer.',hors:'Un bonus dépasse toutes les normes !',interdit:'Un bonus interdit s’ajoute.',relance:'Tous les bonus ont changé.'};
/* Comparaison affichée : au-delà de 999 %, on écrit « plus de 999 % » */
function pctTxt(v){v=Math.abs(v);return v>999?'plus de 999':v.toFixed(v<10?1:0).replace('.',',');}
const OLDBASE={'Dague':'dagger','Épée':'sword','Masse':'mace','Hache':'axe','Bâton':'staff','Bouclier':'shield','Orbe':'orb'};
function normItem(it){if(!it)return it;if(!it.type){it.type=OLDBASE[it.base]||({weapon:'sword',offhand:'shield',ring:'ring'}[it.slot])||it.slot;
    if(!TYPES[it.type])it.type='ring';it.slot=TYPES[it.type].slot;
    if(it.rar===1&&!it.suf){const k=Object.keys(it.aff).find(a=>AFX[a]&&it.name&&it.name.includes(AFX[a].s));it.suf=k?AFX[k].s:'';}
    if(it.rar===2&&!it.rname)it.rname=it.name;refreshName(it);}
  /* v6.26 : les armes d’avant reçoivent leur bonus de base aux dégâts des attaques */
  if(TYPES[it.type]&&TYPES[it.type].atk&&it.aff&&it.aff.atk==null)it.aff.atk=TYPES[it.type].atk;
  if(TYPES[it.type]){const n=capItem(it);if(n&&typeof S==='object'&&S)S.capFixed=(S.capFixed||0)+1;}return it;}
function itemLines(it){const l=[];if(it.slot==='weapon'&&typeof p!=='undefined'&&p&&p.cls&&!clsWeaponOk(it.type))l.push(`⚠ Arme hors de ta classe (${CLS[p.cls].n}) : 30 % de dégâts en moins`);if(it.rar>=2)l.push(it.base);if(it.d)l.push(`Dégâts : ${fmt(it.d[0])} à ${fmt(it.d[1])}`);if(it.a)l.push(`Armure : ${fmt(it.a)}`);if(it.block)l.push(`Blocage : ${it.block} %`);if(it.pot)l.push(`Fioles : +${it.pot} %`);
  for(const k in it.aff)l.push(AFX[k].t(it.aff[k])+(it.cxk===k?' ✦':'')+(it.seal===k?' 🔒 scellé':''));if(it.power)l.push('★ '+it.power);if((it.leg||it.set)&&typeof itemFor==='function'&&p&&p.sk){const f_=itemFor(it);if(f_)l.push(f_);}if(it.corr)l.push('☠ Corrompu : plus aucun artisanat possible');
  if(it.slot){l.push(`⚒ Points de forge : ${fpOf(it)} / ${FP_MAX}`);l.push(it.rel&&RELICS[it.rel]?`✧ ${RELICS[it.rel].n} : ${RELICS[it.rel].d}`:'✧ Case de relique : vide');}
  if(it.set&&SETS[it.set]){const S_=SETS[it.set],n=(p&&p.eq?setCount(p.eq)[it.set]:0)||0;l.push(`◆ ${S_.n} (${n} / ${Object.keys(S_.parts).length} portées)`);l.push(`${n>=2?'✓':'·'} 2 pièces : ${S_.b2}`);l.push(`${n>=4?'✓':'·'} 4 pièces : ${S_.b4}`);if(S_.b6)l.push(`${n>=6?'✓':'·'} 6 pièces : ${S_.b6}`);}return l;}

/* v6.20 : équipement qui change la façon de jouer.
   1. Pouvoirs légendaires de build : chacun transforme un talent précis (plus de dégâts, plus de projectiles, pas de recharge…).
   2. Ensembles à 6 pièces : le bonus à 6 pièces multiplie une famille de talents.
   3. L’Autel des empreintes (au camp) : extrait le pouvoir d’un légendaire pour le garder actif sans porter l’objet (3 pouvoirs à la fois). */
const POWS=[
  {id:'p_firecost',type:'ring',slot:'ring',n:'Anneau de la Flamme docile',sk:['fire'],m:1.4,cost:0,p:'La Boule de feu ne coûte plus de mana et fait 40 % de dégâts en plus.'},
  {id:'p_novachain',type:'gloves',slot:'gloves',n:'Gantelets du Givre-Foudre',sk:['nova','chain'],p:'Lancer la Nova de givre lance aussi une Chaîne d’éclairs gratuite (au moins au rang 1).'},
  {id:'p_meteorcd',type:'helm',slot:'helm',n:'Heaume de l’Astre tombé',sk:['meteor'],cd:0,costx:.7,p:'Le Météore n’a plus de recharge et coûte 30 % de mana en moins.'},
  {id:'p_embers',type:'boots',slot:'boots',n:'Sandales de la Pluie rouge',sk:['embers'],p:'La Pluie de braises tombe en 12 impacts au lieu de 7.'},
  {id:'p_chainx',type:'amulet',slot:'amulet',n:'Torque de l’Orage',sk:['chain'],m:2,p:'La Chaîne d’éclairs fait 100 % de dégâts en plus, mais saute sur 2 ennemis de moins.'},
  {id:'p_catacd',type:'armor',slot:'armor',n:'Robe du Soleil noir',sk:['cataclysm'],cdx:.5,p:'Le Cataclysme se recharge deux fois plus vite.'},
  {id:'p_novabig',type:'staff',slot:'weapon',n:'Bâton de la Banquise',sk:['nova'],m:1.3,p:'La Nova de givre va 50 % plus loin et fait 30 % de dégâts en plus.'},
  {id:'p_whirlpull',type:'axe',slot:'weapon',n:'Hache-Tourbillon',sk:['whirl'],m:1.5,p:'Le Tourbillon attire les ennemis proches (5 cases) avant de frapper, et fait 50 % de dégâts en plus.'},
  {id:'p_shock',type:'gloves',slot:'gloves',n:'Poings du Tremblement',sk:['shock'],p:'L’Onde de choc couvre une zone 60 % plus large et étourdit deux fois plus longtemps.'},
  {id:'p_cryheal',type:'belt',slot:'belt',n:'Ceinturon du Cri',sk:['cry'],p:'Le Cri de guerre soigne 25 % de ta vie.'},
  {id:'p_avatar',type:'helm',slot:'helm',n:'Couronne de l’Avatar',sk:['avatar'],p:'L’Avatar des Cendres dure 20 s au lieu de 10.'},
  {id:'p_shockcd',type:'mace',slot:'weapon',n:'Masse des Répliques',sk:['shock'],cd:0,m:1.3,p:'L’Onde de choc n’a plus de recharge et fait 30 % de dégâts en plus.'},
  {id:'p_dagger5',type:'dagger',slot:'weapon',n:'Éventail de lames',sk:['dagger'],m:1.3,p:'Les Dagues partent à cinq et font 30 % de dégâts en plus.'},
  {id:'p_backstab',type:'boots',slot:'boots',n:'Pas du Fantôme',sk:['backstab'],cdx:.25,m:1.6,p:'La Lame furtive se recharge quatre fois plus vite et fait 60 % de dégâts en plus.'},
  {id:'p_smoke',type:'armor',slot:'armor',n:'Manteau de brume',sk:['smoke'],p:'Le Voile de fumée dure 2 s de plus et soigne 30 % de ta vie.'},
  {id:'p_salve5',type:'bow',slot:'weapon',n:'Arc des Cinq Vents',sk:['salve'],p:'La Salve tire cinq flèches au lieu de trois.'},
  {id:'p_ardente',type:'gloves',slot:'gloves',n:'Gants du Brandon',sk:['ardente'],cost:0,m:1.8,p:'La Flèche ardente ne coûte plus de mana et fait 80 % de dégâts en plus.'},
  {id:'p_tempete',type:'amulet',slot:'amulet',n:'Plume de l’Ouragan',sk:['tempete'],p:'La Tempête de flèches dure deux fois plus longtemps.'},
  {id:'p_volley',type:'bow',slot:'weapon',n:'Arc de la Nuée',sk:['volley'],p:'La Volée tire neuf flèches au lieu de cinq.'},
  {id:'p_lance',type:'ring',slot:'ring',n:'Phalange du Lancier',sk:['lance'],m:1.6,costd:4,p:'La Lance d’os fait 60 % de dégâts en plus et coûte 4 mana de moins.'},
  {id:'p_totem',type:'shield',slot:'offhand',n:'Écu des Totems',sk:['totem'],p:'Le Totem de cendre tire pendant 16 s au lieu de 8.'},
  {id:'p_faux',type:'sword',slot:'weapon',n:'Lame de la Moisson',sk:['faux'],cost:0,m:1.7,p:'La Faux spectrale ne coûte plus de mana et fait 70 % de dégâts en plus.'},
  {id:'p_chaines',type:'belt',slot:'belt',n:'Ceinture aux Mille Maillons',sk:['chaines'],cdx:1/3,p:'Les Chaînes d’os se rechargent trois fois plus vite.'},
  {id:'p_bond',type:'boots',slot:'boots',n:'Bottes du Bond',sk:['bond'],cd:0,m:1.4,p:'Le Bond de cendre n’a plus de recharge et fait 40 % de dégâts en plus.'},
  {id:'p_aegis',type:'shield',slot:'offhand',n:'Bouclier de l’Aube éternelle',sk:['aegis'],cdx:20/45,p:'L’Égide divine se recharge en 20 s au lieu de 45.'},
  {id:'p_meteor2',type:'orb',slot:'offhand',n:'Orbe du Ciel ouvert',sk:['meteor'],m:1.6,p:'Le Météore fait 60 % de dégâts en plus et sa zone est 30 % plus large.'}];
for(const P_ of POWS)if(!LEGS.some(l=>l.id===P_.id))LEGS.push(P_);
/* Les anciens légendaires liés à un talent (pour les fiches) */
const POWSK={fire3:['fire'],freeNova:['nova'],hiver:['nova'],conduit:['chain'],comete:['meteor'],crater:['meteor'],whirl:['whirl'],warlord:['cry'],osdague:['lance'],pierce:['volley','pin','salve'],u_echo:[],set_penitent4:['fire']};
for(const P_ of POWS)POWSK[P_.id]=P_.sk;
/* Ensembles : deux pièces de plus et un bonus à 6 pièces qui multiplie une famille de talents */
const SET6={veilleur:{parts:{belt:'Ceinture du Veilleur',amulet:'Médaillon du Veilleur'},b6:'+40 % de vie et 2 % de vie regagnée par seconde en plus'},
  penitent:{parts:{helm:'Mitre du Pénitent',armor:'Bure du Pénitent'},sk:['fire','meteor','embers'],m:2.5,b6:'Boule de feu, Météore et Pluie de braises : +150 % de dégâts'},
  meute:{parts:{armor:'Pelisse de la Meute',helm:'Masque de la Meute'},sk:['whirl','shock','bond'],m:2.5,b6:'Tourbillon, Onde de choc et Bond : +150 % de dégâts'},
  heraut:{parts:{gloves:'Gantelets du Héraut',boots:'Grèves du Héraut'},sk:['shock','chaines','faux'],m:2.5,b6:'Onde de choc, Chaînes d’os et Faux spectrale : +150 % de dégâts'},
  guetteur:{parts:{armor:'Cuir du Guetteur',belt:'Ceinture du Guetteur'},sk:['salve','ardente','volley','pin','arain','tempete'],m:2.5,b6:'Toutes les flèches (Salve, Ardente, Volée, Clouante, Pluie, Tempête) : +150 % de dégâts'},
  ombre:{parts:{gloves:'Gants du Voile',boots:'Chaussons du Voile'},sk:['dagger','backstab'],m:2.5,b6:'Dagues et Lame furtive : +150 % de dégâts'},
  glas:{parts:{ring:'Anneau du Glas',belt:'Ceinture du Sonneur'},sk:['nova','chain','lance'],m:2.5,b6:'Nova de givre, Chaîne d’éclairs et Lance d’os : +150 % de dégâts'}};
for(const k in SET6)if(SETS[k]){Object.assign(SETS[k].parts,SET6[k].parts);SETS[k].b6=SET6[k].b6;if(SET6[k].sk){POWSK['set_'+k+'6']=SET6[k].sk;}}
function legsNow(){return(p&&p.st&&p.st.legs)||{};}
function powOf(k){return POWS.find(x=>x.id===k);}
/* multiplicateur de dégâts d’un talent venant des pouvoirs et des ensembles à 6 pièces */
function powMult(id){const L=legsNow();let m=1;for(const P_ of POWS)if(L[P_.id]&&P_.m&&P_.sk[0]===id)m*=P_.m;for(const k in SET6){const S6=SET6[k];if(S6.sk&&L['set_'+k+'6']&&S6.sk.includes(id))m*=S6.m;}return m;}
function powCost(id,c){const L=legsNow();for(const P_ of POWS)if(L[P_.id]&&P_.sk[0]===id){if(P_.cost===0)c=0;if(P_.costx)c=Math.round(c*P_.costx);if(P_.costd)c=Math.max(0,c-P_.costd);}return c;}
function powCd(id,cd){const L=legsNow();for(const P_ of POWS)if(L[P_.id]&&P_.sk[0]===id){if(P_.cd===0)cd=0;if(P_.cdx)cd*=P_.cdx;}return cd;}
/* fiche d’un talent : les pouvoirs qui le touchent (portés ou à l’autel en vert, connus en gris) */
function powHTML(id){const L=legsNow(),out=[];for(const k in POWSK){if(!POWSK[k].includes(id)||/^set_.*6$/.test(k))continue;const P_=LEGS.find(l=>l.id===k)||legName(k);if(!P_)continue;const on=!!L[k],known=p.cube&&p.cube.known.includes(k);
    out.push(`<span style="color:${on?'#7fd08a':'#ff9a3a'}">${P_.n}</span>${on?' (actif)':known?' (connu à l’autel)':''} : ${P_.p}`);}
  for(const k in SET6){const S6=SET6[k];if(S6.sk&&S6.sk.includes(id))out.push(`<span style="color:#5fd06a">${SETS[k].n} (6 pièces)</span>${L['set_'+k+'6']?' (actif)':''} : ${S6.b6}`);}
  return out.length?'Pouvoirs d’objets :<br>&nbsp;&nbsp;'+out.join('<br>&nbsp;&nbsp;'):'';}
/* Fiche d’objet : à quoi il sert pour TON héros */
function itemFor(it){const k=it.leg||(it.set?'set_'+it.set+'6':null);const S_=k&&POWSK[k];if(!S_||!S_.length)return'';const mine=S_.filter(id=>p&&p.sk&&(p.sk[id]||0)>0);
  return mine.length?`➜ Améliore ton talent : ${mine.map(id=>SK[id].n).join(', ')}`:`➜ Pour : ${S_.map(id=>SK[id]?SK[id].n:id).join(', ')}`;}
/* ---------- L’Autel des empreintes ---------- */
const CUBE_COST={shard:5,ember:2},CUBE_N=3;
function cubeInit(){if(!p.cube||typeof p.cube!=='object')p.cube={known:[],on:[null,null,null]};if(!Array.isArray(p.cube.known))p.cube.known=[];if(!Array.isArray(p.cube.on))p.cube.on=[null,null,null];while(p.cube.on.length<CUBE_N)p.cube.on.push(null);return p.cube;}
function cubeName(k){const L=LEGS.find(l=>l.id===k);if(L)return L.n;const U=Object.values(UNIQUES).find(u=>u.leg===k);return U?U.n:k;}
function cubeText(k){const L=LEGS.find(l=>l.id===k);if(L)return L.p;const U=Object.values(UNIQUES).find(u=>u.leg===k);return U?U.p:'';}
function cubeExtract(it){cubeInit();if(!it||it.rar!==3||!it.leg||it.lock)return false;if(!canPay(CUBE_COST)){say('Il me faut 5 éclats bleus et 2 braises jaunes.');return false;}
  const i=p.bag.indexOf(it);if(i<0)return false;for(const m in CUBE_COST)p.mats[m]-=CUBE_COST[m];p.bag.splice(i,1);if(!p.cube.known.includes(it.leg))p.cube.known.push(it.leg);
  if(!p.cube.on.includes(it.leg)){const f=p.cube.on.indexOf(null);if(f>=0)p.cube.on[f]=it.leg;}recalc();return true;}
function cubeSet(slot,k){cubeInit();if(slot<0||slot>=CUBE_N)return false;if(k&&!p.cube.known.includes(k))return false;if(k){const j=p.cube.on.indexOf(k);if(j>=0)p.cube.on[j]=null;}p.cube.on[slot]=k||null;recalc();return true;}
let CUBET='extraire',CUBES=-1;
function autelPanel(t){cubeInit();if(t)CUBET=t;const C=p.cube;let h=`<h2>Autel des empreintes</h2><p class="say">« Pose un légendaire sur la pierre. L’objet disparaît, son pouvoir reste gravé ici, et je te le prête, sans que tu le portes. »</p>
  <div class="tabs">${[['extraire','Extraire'],['pouvoirs','Pouvoirs actifs ('+C.on.filter(Boolean).length+' / '+CUBE_N+')'],['connus','Connus ('+C.known.length+')']].map(([k,n])=>`<button class="${CUBET===k?'on':''}" data-a="cubetab" data-k="${k}">${n}</button>`).join('')}</div>`;
  if(CUBET==='extraire'){const L=p.bag.filter(it=>it.rar===3&&it.leg);h+=`<p class="st">Coût : 5 éclats bleus et 2 braises jaunes (tu as ${fmt((p.mats||{}).shard||0)} et ${fmt((p.mats||{}).ember||0)}). Seuls les légendaires du sac. L’objet est détruit.</p>`;
    h+=L.length?L.map(it=>`<div class="row"><div><div class="it" style="color:#ff9a3a">${it.name}${it.lock?' 🔒':''}</div><div class="st">★ ${it.power||cubeText(it.leg)}${C.known.includes(it.leg)?' <b>(déjà connu)</b>':''}</div><div class="st">${itemFor(it)}</div></div><button class="min" data-a="cubex" data-id="${it.id}"${it.lock||!canPay(CUBE_COST)?' disabled':''}>Extraire</button></div>`).join(''):'<p class="st">Aucun légendaire dans ton sac.</p>';}
  else if(CUBET==='pouvoirs'){h+=`<p class="st">Trois pouvoirs actifs à la fois, en plus de ceux que tu portes. Change-les quand tu veux, gratuitement.</p>`;
    for(let i=0;i<CUBE_N;i++){const k=C.on[i];h+=`<div class="row"><div><div class="it" style="color:${k?'#ff9a3a':'#6b604e'}">${i+1}. ${k?cubeName(k):'Vide'}</div><div class="st">${k?cubeText(k):'Touche « Choisir » pour y mettre un pouvoir connu.'}</div></div><button class="min" data-a="cubes" data-k="${i}">${CUBES===i?'Annuler':'Choisir'}</button></div>`;
      if(CUBES===i){h+=`<div class="selbox">${C.known.length?C.known.map(k2=>`<button class="min" data-a="cubeon" data-k="${k2}">${cubeName(k2)}${C.on.includes(k2)?' ✓':''}</button>`).join(''):'<p class="st">Aucun pouvoir connu : extrais d’abord un légendaire.</p>'}${k?'<button class="min" data-a="cubeon" data-k="">Vider</button>':''}</div>`;}}}
  else{h+=C.known.length?C.known.map(k=>`<div class="row"><div><div class="it" style="color:#ff9a3a">${cubeName(k)}${C.on.includes(k)?' ✓':''}</div><div class="st">${cubeText(k)}</div></div></div>`).join(''):'<p class="st">Rien encore. Chaque pouvoir extrait reste connu pour toujours.</p>';}
  openPanel(h+'<div><button data-a="close">Fermer</button></div>');}

