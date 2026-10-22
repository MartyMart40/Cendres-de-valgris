'use strict';
/* ---------- Mondes, actes et zones ---------- */
function THM(){return THEMES[curWorld().theme]||THEMES.cendres;}
function palOf(st){const P=THM().pal;return(P&&P[st])||DECORS[st];}
function npcF(id){const n=(THM().npcs||{})[id];return n?n.full:{corvel:'Ancien Corvel',bram:'Bram le colporteur',eline:'Sœur Éline',hilde:'Hilde la forgeronne'}[id];}
function npcS(id){const n=(THM().npcs||{})[id];return n?(n.short||n.full):'Corvel';}
function npcA(id){const n=(THM().npcs||{})[id];return n?`${n.a||''}<b>${n.full}</b>`:'l’<b>Ancien Corvel</b>';}
function fixN(t){return typeof t==='string'&&S&&THM().npcs?t.replace(/Corvel/g,npcS('corvel')):t;}
function skinOf(t){return((THM().skins)||{})[t]||{};}
function monN(t){return skinOf(t).n||MT[t].n;}
function bt(B,k){return skinOf(B.mon)[k]||B[k];}
function qt(k,d){const v=(THM().qtext||{})[k];return v==null?d:typeof v==='function'?v():v;}
function curWorld(){return WORLDS[S&&S.world]||WORLDS[1];}
function zid(a,i,w){return`m${w||S.world||1}a${a}z${i}`;}
function parseZ(id){const m=/^m(\d+)a(\d+)z(\d+)$/.exec(id||'');return m?{w:+m[1],a:+m[2],i:+m[3]}:null;}
/* Tirage de l’acte : formes, noms et décors, une seule fois par partie (gardé dans la sauvegarde) */
function rollAct(w,a,seed){const W_=WORLDS[w],act=W_&&W_.acts[a-1];if(!act||act.hidden)return[];
  const R=rng((seed^(a*7919+w*104729))>>>0),th=THEMES[W_.theme],pk=arr=>arr[Math.floor(R()*arr.length)];
  const formes=[act.first?act.first.forme:pk(act.formes)];
  for(let i=1;i<act.count;i++){const left=act.formes.filter(f=>!formes.includes(f));let pool=(left.length?left:act.formes.filter(f=>f!=='arene')).filter(f=>f!==formes[i-1]);
    if(!pool.length)pool=act.formes.filter(f=>f!==formes[i-1]);formes.push(pk(pool));}
  const used=new Set(),out=[];let prevD=null;
  formes.forEach((f,i)=>{const bank=(th[act.bank||'names']||th.names)[f]||[['Terres sans nom','les ']];let ni=i===0&&act.first&&act.first.name!=null?act.first.name:-1;
    if(ni<0){const free=bank.map((_,j)=>j).filter(j=>!used.has(f+j));ni=free.length?pk(free):pk(bank.map((_,j)=>j));}used.add(f+ni);
    const ds=Array.isArray(th.decor[f])?th.decor[f]:[th.decor[f]];const dd=ds.filter(d=>d!==prevD);const d=pk(dd.length?dd:ds);prevD=d;
    out.push({f,n:ni,d});});
  return out;}
function placeAcolytes(lay,act,seed,a){if(!act.acolytes||!lay.length||lay.some(l=>l.aco))return lay;const R=rng((seed^(a*31337+911))>>>0);
  const idx=lay.map((_,i)=>i).filter(i=>i>0);for(let i=idx.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}
  act.acolytes.forEach((b,k)=>{if(idx[k]!=null)lay[idx[k]].aco=b;});return lay;}
function actLayout(a){const k=(S.world||1)+'-'+a;S.layout=S.layout||{};if(!S.layout[k])S.layout[k]=rollAct(S.world||1,a,S.seed||1);
  const act=curWorld().acts[a-1];if(act)placeAcolytes(S.layout[k],act,S.seed||1,a);return S.layout[k];}
function acoCount(a){const act=curWorld().acts[(a||1)-1];return((act&&act.acolytes)||[]).filter(b=>S.aco&&S.aco[b]).length;}
function actOfMini(b){const i=curWorld().acts.findIndex(a=>(a.acolytes||[]).includes(b));return i+1;}
function acoZone(b){const a=actOfMini(b);if(a<1)return null;for(const id of actZones(a)){const d=zoneDef(id);if(d&&d.aco===b)return id;}return null;}
function actOpen(a){return a<=1||actBossDone(a-1);}
function poolFor(th,L){return(th.pools.find(p_=>L<=p_.upTo)||th.pools[th.pools.length-1]).m;}
function zoneDef(id){
  if(id==='town')return{name:THEMES[curWorld().theme].camp,lvl:0,style:'town'};
  if(id==='rift')return S.zones.rift?S.zones.rift.def:{name:'Faille'};
  const k=parseZ(id),wd=k&&WORLDS[k.w],act=wd&&wd.acts[k.a-1];if(!act||act.hidden)return null;
  const th=THEMES[wd.theme],lay=actLayout(k.a),base={world:k.w,act:k.a,idx:k.i};
  if(k.i===lay.length){const an=th.antre&&th.antre[k.a];return{...act.antre,...base,style:themeDecor(th,'antre'),last:true,lvl:act.antre.lvl+(wd.lvlAdd||0),...(an?{name:an[0],art:an[1]}:{})};}
  const L_=lay[k.i];if(!L_)return null;const F=FORMES[L_.f],nm=((th[act.bank||'names']||th.names)[L_.f]||[['Terres sans nom','les ']])[L_.n]||['Terres sans nom','les '];
  const lvl=Math.round(act.lvl[0]+(act.lvl[1]-act.lvl[0])*k.i/Math.max(1,act.count-1))+(wd.lvlAdd||0);
  return{...base,name:nm[0],art:nm[1],forme:L_.f,style:L_.d,lvl,mons:poolFor(th,lvl),packs:F.packs,size:F.size,w:F.w,h:F.h,waves:F.waves,
    wp:act.wp.includes(k.i),relic:act.relic&&act.relic.zone===k.i?act.relic.q:false,aco:L_.aco||null,last:false};}
/* « la Crypte oubliée », « les Champs calcinés »… */
function zoneIn(id){const d=zoneDef(id);return d?(d.art||'')+d.name:'';}
function zoneDe(id){const d=zoneDef(id);if(!d)return'';const a=d.art||'';return(a==='le '?'du ':a==='les '?'des ':'de '+a)+d.name;}
/* Antre d’un acte : une fois le boss de l’acte vaincu, une sortie mène à l’acte suivant */
function nextActExit(z){const k=parseZ(z.id);if(!k||!z.def.last||!z.distE)return;const nx=curWorld().acts[k.a];if(!nx||nx.hidden||!actBossDone(k.a))return;
  const to=zid(k.a+1,0);if(z.objs.some(o=>o.type==='exit'&&o.to===to))return;let far=0;for(let i=0;i<z.distE.length;i++)if(z.distE[i]>z.distE[far])far=i;
  const o={type:'exit',x:far%z.w+.5,y:((far/z.w)|0)+.5,to,label:'Vers : '+zoneName(to)};o.arr=arrival(z,Math.floor(o.x),Math.floor(o.y));z.objs.push(o);}
function sealOf(id){const d=parseZ(id)&&zoneDef(id);if(!d||!d.seal)return null;return S.q[d.seal.q]&&S.q[d.seal.q].s>=d.seal.s?null:d.seal;}
function actZones(a){const act=curWorld().acts[a-1];if(!act||act.hidden)return[];const n=actLayout(a).length;return Array.from({length:n+1},(_,i)=>zid(a,i));}
function lastZone(a){a=a||1;return zid(a,actLayout(a).length-1);}
function acoNeed(a){return curWorld().acts[(a||1)-1].need||2;}
/* Liste des acolytes pour Corvel : vaincu ou non, et la zone où il rôde */
function acoList(a){return curWorld().acts[(a||1)-1].acolytes.map(b=>`${S.aco&&S.aco[b]?'✓':'·'} ${monN(BOSSES[b].mon)} : ${zoneIn(acoZone(b))}`).join('<br>');}

let RIFT_HP=1.10,RIFT_DMG=1.055;
let S=null,p=null;
