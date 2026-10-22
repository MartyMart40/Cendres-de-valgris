'use strict';
/* ---------- Sauvegarde ---------- */
function save(){try{if(typeof syncWorld==='function'&&S.qw)syncWorld();localStorage.setItem(SAVE,JSON.stringify({v:3,ver:GAME_VER,world:S.world,act:S.act,seed:S.seed,lay:S.layout,p:{lvl:p.lvl,xp:p.xp,gold:p.gold,pot:p.pot,scroll:p.scroll,bag:p.bag,eq:p.eq,sk:p.sk,pts:p.pts,bar:p.bar,skipWhite:p.skipWhite,mute:p.mute,stash:p.stash,tv:p.tv},q:S.q,qw:S.qw,wps:S.wps,done:S.done,riftMax:S.riftMax,rec:S.rec,aco:S.aco,acow:S.acow,worldMax:S.worldMax}));}catch(e){}}
/* Conversions : v1 -> v2 (ancien équipement) puis v2 -> v3 (mondes et actes). La sauvegarde v2 reste intacte comme copie de secours. */
const WP_V2={town:'town',plain:'m1a1z0',crypt:'m1a1z1',lair:'m1a1z2'};
function migrate12(v){return{v:2,migr:true,p:{lvl:v.p.lvl||1,xp:0,gold:(v.p.gold||0)+200,pot:v.p.pot||4,scroll:v.p.scroll||2,bag:[],eq:starterGear(v.p.lvl||1),sk:{fire:1,nova:1},pts:Math.max(0,(v.p.lvl||1)-1),bar:['fire','nova',null]},q:v.q,wps:v.wps,done:v.done,riftMax:1};}
function migrate23(v){const wps={town:1};for(const k in(v.wps||{}))if(v.wps[k]&&WP_V2[k])wps[WP_V2[k]]=1;
  return{...v,v:3,world:1,act:1,seed:(Math.random()*1e9)|0,wps,from:2};}
function loadSave(){try{const s=localStorage.getItem(SAVE);if(s){const v=JSON.parse(s);if(v&&v.v===3)return v;}
  const s2=localStorage.getItem(SAVE_V2);if(s2)return migrate23(JSON.parse(s2));
  const o=localStorage.getItem(SAVE_OLD);if(o)return migrate23(migrate12(JSON.parse(o)));return null;}catch(e){return null;}}
function startGame(sv){
  S={pend:[],amb:[],shake:0,mark:null,zones:{},cur:null,q:{},wps:{town:1},portal:null,fx:[],proj:[],parts:[],novas:[],bolts:[],mets:[],t:0,paused:false,done:false,labels:[],cam:{x:0,y:0},riftMax:1,riftSel:1,rec:{},world:1,act:1,seed:(Math.random()*1e9)|0,layout:{},aco:{},hz:[],worldMax:1};
  p=newPlayer();p.eq=starterGear(1);
  if(sv){Object.assign(p,sv.p);S.q=sv.q||S.q;S.wps=sv.wps||S.wps;S.done=sv.done;S.riftMax=sv.riftMax||1;S.rec=sv.rec||{};
    if(WORLDS[sv.world])S.world=sv.world;if(sv.act&&curWorld().acts[sv.act-1])S.act=sv.act;if(sv.seed)S.seed=sv.seed;if(sv.lay&&typeof sv.lay==='object')S.layout=sv.lay;if(sv.aco&&typeof sv.aco==='object')S.aco=sv.aco;
    if(!p.stash)p.stash=[[],[],[],[]];while(p.stash.length<ST_TABS)p.stash.push([]);
    for(const it of p.bag.concat(Object.values(p.eq),...p.stash))if(it&&it.id>=itemId)itemId=it.id+1;
    for(const k in p.eq)normItem(p.eq[k]);
    const lost=fixGrid(p.bag,INV_W,INV_H);for(let t=0;t<ST_TABS;t++)lost.push(...fixGrid(p.stash[t],ST_W,ST_H));
    for(const it of lost){let ok=false;for(let t=0;t<ST_TABS&&!ok;t++)ok=addTo(p.stash[t],ST_W,ST_H,it);}}
  S.qw=(sv&&sv.qw&&typeof sv.qw==='object')?sv.qw:{};S.qw[S.world]=S.qw[S.world]||S.q;S.q=S.qw[S.world];
  S.acow=(sv&&sv.acow&&typeof sv.acow==='object')?sv.acow:{};S.acow[S.world]=S.acow[S.world]||S.aco||{};S.aco=S.acow[S.world];
  S.worldMax=Math.max(S.world,(sv&&sv.worldMax)||1);
  for(const k in QUESTS){if(!S.q[k])S.q[k]={s:0};if(S.q[k].n==null)S.q[k].n=0;}
  curWorld().acts.forEach((a,i)=>{const q=a.quest&&S.q[a.quest];if(q&&q.s===1&&acoCount(i+1)>=acoNeed(i+1))q.s=2;});
  if(!p.stash)p.stash=[[],[],[],[]];S.stab=0;
  while(p.bar.length<4)p.bar.push(null);
  let treeMsg=null;if(sv&&sv.p.tv!==2){resetTree();treeMsg={t:1.2,fn:()=>openPanel(`<h2>Nouvel arbre de talents</h2><p>Les compétences sont maintenant un arbre de 26 talents en trois branches, avec des ultimes et des talents sans fin. Tes points ont été remboursés : tu en as <b>${p.pts}</b> à placer.</p><p class="st">Menu, onglet Talents.</p><button data-a="tab" data-t="comp">Voir l’arbre</button><button data-a="close">Plus tard</button>`)};}
  S.riftSel=S.riftMax;
  recalc();p.hp=p.maxHp;p.mp=p.maxMp;
  $('#title').classList.add('hidden');$('#hud').classList.remove('hidden');
  enterZone('town','spawn');
  if(treeMsg)S.pend.push(treeMsg);
  if(!sv)S.pend.push({t:.9,fn:()=>say(`Parle à ${npcA('corvel').replace(/<\/?b>/g,'')}, près du feu.`)});
  if(sv&&sv.migr)S.pend.push({t:1,fn:()=>openPanel('<h2>Nouvelle version</h2><p>Le jeu a maintenant dix emplacements d’équipement, des compétences et des failles sans fin. Ton niveau et tes quêtes sont gardés. Ton ancien équipement est remplacé par un équipement neuf et 200 pièces d’or.</p><p class="st">Tu as des points de compétence à placer dans Menu, onglet Compétences.</p><button data-a="close">Compris</button>')});
}

