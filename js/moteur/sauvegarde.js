'use strict';
/* ---------- Sauvegarde ---------- */
function save(){try{if(typeof syncWorld==='function'&&S.qw)syncWorld();localStorage.setItem(SAVE,JSON.stringify({v:3,ver:GAME_VER,world:S.world,act:S.act,seed:S.seed,lay:S.layout,p:{lvl:p.lvl,xp:p.xp,gold:p.gold,pot:p.pot,scroll:p.scroll,bag:p.bag,eq:p.eq,sk:p.sk,pts:p.pts,bar:p.bar,skipWhite:p.skipWhite,mute:p.mute,stash:p.stash,tv:p.tv,eco:p.eco,gfx:p.gfx,lootF:p.lootF,autoPick:!!p.autoPick,look:p.look||null,amb:p.amb,alt:p.alt||null,trophies:p.trophies,mats:p.mats,cards:p.cards,orbs:p.orbs||{},bonusPts:p.bonusPts||0,builds:p.builds||null,capes:p.capes||{},cls:p.cls||null,clsAsked:!!p.clsAsked,cube:p.cube||null,bagRows:p.bagRows,comp:p.comp,egg:p.egg,sup:p.sup,supInv:p.supInv,ess:p.ess||[],relics:p.relics||{}},q:S.q,qw:S.qw,wps:S.wps,done:S.done,riftMax:S.riftMax,rec:S.rec,aco:S.aco,acow:S.acow,worldMax:S.worldMax,btry:S.btry,evSeen:S.evSeen,best:S.best,pur:S.pur||{},hday:S.hday||{},tone:S.tone||'normal',lootLog:S.lootLog||[],here:(S.cur&&resumable(S.cur.id))?S.cur.id:null,portal:S.portal&&resumable(S.portal.zone)?{zone:S.portal.zone}:null,playT:Math.round(S.playT||0),deaths:S.deaths||0,champK:S.champK||0,bossK:S.bossK||0,stabN:S.stabN||null,sea:S.sea||null,hf:S.hf||{},pages:S.pages||{},ct:S.ct||null,trialsWon:S.trialsWon||0,tmodes:S.tmodes||{},wtheme:S.wtheme||null,atkSeen:S.atkSeen||{},letters:S.letters||{},loreSeen:S.loreSeen||{},carnetDone:S.carnetDone||0,br:S.br||0,brMax:S.brMax||0,brBest:S.brBest==null?-1:S.brBest}));}catch(e){}}
/* Conversions : v1 -> v2 (ancien équipement) puis v2 -> v3 (mondes et actes). La sauvegarde v2 reste intacte comme copie de secours. */
const WP_V2={town:'town',plain:'m1a1z0',crypt:'m1a1z1',lair:'m1a1z2'};
function migrate12(v){return{v:2,migr:true,p:{lvl:v.p.lvl||1,xp:0,gold:(v.p.gold||0)+200,pot:v.p.pot||4,scroll:v.p.scroll||2,bag:[],eq:starterGear(v.p.lvl||1),sk:{fire:1,nova:1},pts:Math.max(0,(v.p.lvl||1)-1),bar:['fire','nova',null]},q:v.q,wps:v.wps,done:v.done,riftMax:1};}
function migrate23(v){const wps={town:1};for(const k in(v.wps||{}))if(v.wps[k]&&WP_V2[k])wps[WP_V2[k]]=1;
  return{...v,v:3,world:1,act:1,seed:(Math.random()*1e9)|0,wps,from:2};}
/* v5.87 : copie de secours de la partie, en texte à garder ailleurs (notes du téléphone, courriel) */
function saveCode(){save();const raw=localStorage.getItem(SAVE)||'';try{return'CV1:'+btoa(unescape(encodeURIComponent(raw)));}catch(e){return'';}}
function readCode(code){try{code=(code||'').trim();if(!code.startsWith('CV1:'))return null;const raw=decodeURIComponent(escape(atob(code.slice(4))));const v=JSON.parse(raw);return v&&v.v===3&&v.p?raw:null;}catch(e){return null;}}
function backupPanel(){const c=saveCode();openPanel(`<h2>Copie de secours</h2><p class="st">Garde ce texte ailleurs (notes, courriel). Il contient toute ta partie.</p><textarea id="bkout" readonly style="width:100%;height:90px;font-size:10px">${c}</textarea><button class="min" data-a="bkcopy">Copier</button>
  <h3>Restaurer</h3><p class="st">Colle une copie ici. Ta partie actuelle sera remplacée.</p><textarea id="bkin" style="width:100%;height:70px;font-size:10px"></textarea><button class="min" data-a="bkload">Restaurer cette copie</button>${prevInfo()}<div><button data-a="close">Fermer</button></div>`);}
function prevInfo(){let v=null;try{v=JSON.parse(localStorage.getItem(SAVE_PREV)||'null');}catch(e){}if(!v||!v.p)return'';return`<h3>Partie d’avant</h3><p class="st">Gardée quand tu as commencé une nouvelle partie : niveau ${v.p.lvl||1}, monde ${v.world||1}. Les deux parties s’échangent : celle-ci sera gardée à son tour.</p><button class="min" data-a="bkprev">Reprendre la partie d’avant</button>`;}
function loadSave(){try{const s=localStorage.getItem(SAVE);if(s){const v=JSON.parse(s);if(v&&v.v===3)return v;}
  const s2=localStorage.getItem(SAVE_V2);if(s2)return migrate23(JSON.parse(s2));
  const o=localStorage.getItem(SAVE_OLD);if(o)return migrate23(migrate12(JSON.parse(o)));return null;}catch(e){return null;}}
/* portage de la 6.58 : les sauvegardes v5.13 (GitHub Pages) ont un butin de boss à part (it.boss, it.bth). Chaque objet devient le trophée du même boss,
   au même niveau et à la même place ; un objet porté qui ne va plus dans son emplacement retourne au sac. */
function convBossItem(it){if(!it||!it.boss||it.uniq)return it;const id=it.boss;if(!UNIQUES[id]){delete it.boss;delete it.bth;return it;}
  const nu=genUnique(id,it.ilvl||1,THEMES[it.bth]?it.bth:'cendres');nu.id=it.id;nu.gx=it.gx;nu.gy=it.gy;if(it.lock)nu.lock=it.lock;p.trophies=p.trophies||{};p.trophies[id]=1;return nu;}
function convBossItems(){p.bag=p.bag.map(convBossItem);p.stash=p.stash.map(t=>t.map(convBossItem));
  for(const k in p.eq){const it=p.eq[k];if(!it||!it.boss||it.uniq)continue;const nu=convBossItem(it);if(slotAccepts(k,nu))p.eq[k]=nu;else{delete p.eq[k];nu.gx=null;nu.gy=null;p.bag.push(nu);}}}
function startGame(sv){
  try{if(S&&S.zones)for(const k in S.zones)freeCv(S.zones[k]);}catch(e){}
  S={pend:[],amb:[],shake:0,mark:null,zones:{},cur:null,q:{},wps:{town:1},portal:null,fx:[],proj:[],parts:[],novas:[],bolts:[],mets:[],t:0,paused:false,done:false,labels:[],cam:{x:0,y:0},riftMax:1,riftSel:1,rec:{},world:1,act:1,seed:(Math.random()*1e9)|0,layout:{},aco:{},hz:[],worldMax:1};
  p=newPlayer();p.eq=starterGear(1);
  /* v6.15 : mondes tirés au hasard à chaque nouvelle partie ; une vieille partie garde ses mondes d’origine */
  S.wtheme=sv?((sv.wtheme&&typeof sv.wtheme==='object')?sv.wtheme:null):rollThemes();applyThemes();
  INV_H=5;
  if(sv){Object.assign(p,sv.p);setBagRows();
    /* v6.03 : nouvelle courbe d’expérience. Le héros garde son niveau, la barre est convertie en pourcentage. */
    if(!sv.ver||verNum(sv.ver)<verNum('6.13')){const L_=Math.max(1,p.lvl|0),old=(!sv.ver||verNum(sv.ver)<verNum('6.03'))?xpNextOld(L_):xpNext603(L_),f=clamp((+p.xp||0)/old,0,.999);p.xp=Math.floor(f*xpNext(L_));}S.q=sv.q||S.q;S.wps=sv.wps||S.wps;S.done=sv.done;S.riftMax=sv.riftMax||1;S.rec=sv.rec||{};
    if(WORLDS[sv.world])S.world=sv.world;if(sv.act&&curWorld().acts[sv.act-1])S.act=sv.act;if(sv.seed)S.seed=sv.seed;if(sv.lay&&typeof sv.lay==='object')S.layout=sv.lay;if(sv.aco&&typeof sv.aco==='object')S.aco=sv.aco;
    if(!p.stash)p.stash=[[],[],[],[]];while(p.stash.length<ST_TABS)p.stash.push([]);
    for(const it of p.bag.concat(Object.values(p.eq),...p.stash))if(it&&it.id>=itemId)itemId=it.id+1;
    for(const k in p.eq)normItem(p.eq[k]);
    convBossItems();
    const lost=fixGrid(p.bag,INV_W,INV_H);for(let t=0;t<ST_TABS;t++)lost.push(...fixGrid(p.stash[t],ST_W,ST_H));
    for(const it of lost){let ok=false;for(let t=0;t<ST_TABS&&!ok;t++)ok=addTo(p.stash[t],ST_W,ST_H,it);}}
  S.qw=(sv&&sv.qw&&typeof sv.qw==='object')?sv.qw:{};S.qw[S.world]=S.qw[S.world]||S.q;S.q=S.qw[S.world];
  S.acow=(sv&&sv.acow&&typeof sv.acow==='object')?sv.acow:{};S.acow[S.world]=S.acow[S.world]||S.aco||{};S.aco=S.acow[S.world];
  S.worldMax=Math.max(S.world,(sv&&sv.worldMax)||1);S.btry=(sv&&sv.btry&&typeof sv.btry==='object')?sv.btry:{};/* v6.58 : Brasiers. Une ancienne partie démarre au Brasier de base ; si Valgris a déjà plié, le Brasier 1 est ouvert. */S.br=Math.max(0,(sv&&+sv.br)||0);S.brMax=Math.max(0,(sv&&+sv.brMax)||0);S.brBest=(sv&&sv.brBest!=null)?+sv.brBest:-1;if(sv&&sv.brMax==null){const won=S.worldMax>1||Object.values((sv.qw&&typeof sv.qw==='object')?sv.qw:{}).some(q=>q&&q.q5&&q.q5.s>=2)||(sv.q&&sv.q.q5&&sv.q.q5.s>=2);if(won){S.brMax=1;S.brBest=0;}}S.br=Math.min(S.br,S.brMax);S.best=(sv&&sv.best&&typeof sv.best==='object')?sv.best:{};S.pur=(sv&&sv.pur&&typeof sv.pur==='object')?sv.pur:{};S.hday=(sv&&sv.hday&&typeof sv.hday==='object')?sv.hday:{};S.tone=(sv&&TONES[sv.tone])?sv.tone:'normal';S.lootLog=(sv&&Array.isArray(sv.lootLog))?sv.lootLog.slice(0,20):[];S.bb=[];S.playT=(sv&&+sv.playT)||0;S.deaths=(sv&&+sv.deaths)||S.deaths||0;S.champK=(sv&&+sv.champK)||0;S.bossK=(sv&&+sv.bossK)||0;S.stabN=(sv&&Array.isArray(sv.stabN))?sv.stabN:null;S.sea=(sv&&sv.sea&&typeof sv.sea==='object')?sv.sea:null;S.hf=(sv&&sv.hf&&typeof sv.hf==='object')?sv.hf:{};S.pages=(sv&&sv.pages&&typeof sv.pages==='object')?sv.pages:{};S.ct=(sv&&sv.ct&&Array.isArray(sv.ct.list))?sv.ct:null;S.trialsWon=(sv&&+sv.trialsWon)||0;S.tmodes=(sv&&sv.tmodes&&typeof sv.tmodes==='object')?sv.tmodes:{};S.hfQuiet=!!(sv&&!sv.hf);S.evSeen=(sv&&sv.evSeen&&typeof sv.evSeen==='object')?sv.evSeen:{};S.atkSeen=(sv&&sv.atkSeen&&typeof sv.atkSeen==='object')?sv.atkSeen:{};S.letters=(sv&&sv.letters&&typeof sv.letters==='object')?sv.letters:{};S.loreSeen=(sv&&sv.loreSeen&&typeof sv.loreSeen==='object')?sv.loreSeen:{};S.carnetDone=(sv&&sv.carnetDone)||0;
  for(const k in QUESTS){if(!S.q[k])S.q[k]={s:0};if(S.q[k].n==null)S.q[k].n=0;}
  curWorld().acts.forEach((a,i)=>{const q=a.quest&&S.q[a.quest];if(q&&q.s===1&&acoCount(i+1)>=acoNeed(i+1))q.s=2;});
  if(!p.stash)p.stash=[[],[],[],[]];S.stab=0;
  while(p.bar.length<6)p.bar.push(null);
  {const back=classPrune();if(back>0){const C_=CLS[p.cls];S.pend.push({t:3.2,fn:()=>openPanel(`<h2>Talents de ta classe</h2><p>Un ${C_.n.toLowerCase()} n’a plus accès qu’à ses propres branches : ${C_.br.map(b=>BR[b].n).join(' et ')}. Les talents que tu avais pris ailleurs t’ont été remboursés : <b>${back}</b> points de plus à placer. Ta classe a aussi dix nouveaux talents.</p><button data-a="tab" data-t="comp">Voir mes talents</button><button data-a="close">Plus tard</button>`)});}}
  if(sv&&sv.p.tv!==2){resetTree();S.pend.push({t:1.2,fn:()=>openPanel(`<h2>Nouvel arbre de talents</h2><p>Les compétences sont maintenant un arbre de 26 talents en trois branches, avec des ultimes et des talents sans fin. Tes points ont été remboursés : tu en as <b>${p.pts}</b> à placer.</p><p class="st">Menu, onglet Talents.</p><button data-a="tab" data-t="comp">Voir l’arbre</button><button data-a="close">Plus tard</button>`)});}
  S.riftSel=S.riftMax;
  recalc();p.hp=p.maxHp;p.mp=p.maxMp;
  $('#title').classList.add('hidden');$('#hud').classList.remove('hidden');
  S.portal=null;if(sv&&sv.portal&&sv.portal.zone&&resumable(sv.portal.zone))S.portal={zone:sv.portal.zone,x:null,y:null};
  const tvFix=!!(sv&&lockedActive());if(tvFix)resetTree();
  const pwFix=!!(sv&&verNum(sv.ver||'0')<verNum('6.45'));if(pwFix&&!tvFix)resetTree();
  if(sv&&sv.here&&resumable(sv.here)&&!sealOf(sv.here)){enterZone(sv.here,'spawn');S.pend.push({t:.8,fn:()=>toast('Reprise : '+zoneName(sv.here))});}else enterZone('town','spawn');
  if(pwFix&&!tvFix){S.pend.push({t:1.4,fn:()=>openPanel(`<h2>Talents remboursés</h2><p>La puissance vient maintenant surtout de l’équipement : les compétences frappent un peu moins fort d’elles-mêmes, et les bonus des objets grandissent avec leur niveau. Pour t’adapter, tes <b>${p.pts}</b> points de talent te sont rendus, gratuitement.</p><button data-a="close">D’accord</button>`)});}
  if(tvFix){S.pend.push({t:1.4,fn:()=>openPanel(`<h2>Talents remboursés</h2><p>Certains talents de départ étaient actifs avant d’avoir atteint leur palier. L’arbre a été corrigé : tes <b>${p.pts}</b> points te sont rendus, gratuitement, pour les replacer.</p><button data-a="close">D’accord</button>`)});}
  if(!sv)S.pend.push({t:.4,fn:()=>classPanel(true)});
  if(sv&&!p.cls&&!p.clsAsked){p.clsAsked=true;S.pend.push({t:3.4,fn:()=>classPanel(false)});}
  if(!sv)S.pend.push({t:.9,fn:()=>say(`Parle à ${npcA('corvel').replace(/<\/?b>/g,'')}, près du feu.`)});
  if(sv&&sv.ver&&verNum(sv.ver)<verNum(GAME_VER)){const fv=sv.ver;S.pend.push({t:2.6,fn:()=>newsPanel(fv)});}
  if(S.capFixed){const n=S.capFixed;S.capFixed=0;save();S.pend.push({t:1.3,fn:()=>openPanel(`<h2>Bonus plafonnés</h2><p>${n>1?`${n} vieux objets dépassaient`:'Un vieil objet dépassait'} les nouvelles limites de bonus. ${n>1?'Ils ont été ramenés':'Il a été ramené'} au maximum permis pour ${n>1?'leur':'son'} niveau. Rien n’a été supprimé.</p><button data-a="close">Compris</button>`)});}
  if(sv&&sv.migr)S.pend.push({t:1,fn:()=>openPanel('<h2>Nouvelle version</h2><p>Le jeu a maintenant dix emplacements d’équipement, des compétences et des failles sans fin. Ton niveau et tes quêtes sont gardés. Ton ancien équipement est remplacé par un équipement neuf et 200 pièces d’or.</p><p class="st">Tu as des points de compétence à placer dans Menu, onglet Compétences.</p><button data-a="close">Compris</button>')});
}

