'use strict';
/* ---------- Panneaux ---------- */
const panel=$('#panel');
function openPanel(h){h=fixN(h);panel.innerHTML=h;panel.classList.remove('hidden','wide');S.paused=true;}
function closePanel(){panel.classList.add('hidden');S.paused=false;}
function corvelHas(){const k=curQuest();return!!k&&(S.q[k].s===0||S.q[k].s===2);}
function potPrice(){return POTIONS.fiole.price();}function scrollPrice(){return 30+p.lvl*2;}
function itemRow(it,i,mode){
  const lines=itemLines(it).join(' · ');let cmp='';
  if(mode==='bag'){const c=compareItem(it);cmp=Math.abs(c)<.5?'<span class="st">≈</span>':c>0?`<span class="up">▲ ${c.toFixed(c<10?1:0).replace('.',',')} %</span>`:`<span class="dn">▼ ${(-c).toFixed(-c<10?1:0).replace('.',',')} %</span>`;}
  const btn=mode==='bag'?`<button class="min" data-a="eq" data-i="${i}">Équiper</button><button class="min" data-a="drop" data-i="${i}">Jeter</button>`:mode==='sell'?`<button class="min" data-a="sell" data-i="${i}">${fmt(it.val)} or</button>`:mode==='eq'?`<button class="min" data-a="uneq" data-s="${i}">Retirer</button>`:'';
  return`<div class="row"><div><div class="st">${SLOTN[it.slot]} · niv. ${it.ilvl} ${cmp}</div><div class="it" style="color:${RCOL[it.rar]}">${it.name}</div><div class="st">${lines}</div></div><div class="bt">${btn}</div></div>`;}
function npcDialog(id){
  const q=S.q;let h='';
  if(id==='corvel'){h=`<h2>${npcF('corvel')}</h2>`;const k=curQuest(),L=k&&QUESTS[k].corvel[q[k].s]&&QUESTS[k].corvel[q[k].s](q[k]);
    if(L)h+=`<p class="say">${qt(k+'c'+q[k].s,L.say)}</p>${L.st?`<p class="st">${L.st}</p>`:''}${L.btn?`<button data-a="${L.act}" data-q="${k}">${L.btn}</button>`:''}`;
    else h+=`<p class="say">« La pierre de faille, près du feu, mène toujours plus bas. Chaque gardien vaincu en ouvre une plus profonde. Personne n’en a vu le fond. »</p>`;}
  else if(id==='bram'){invPanel('sell');return;const junk=p.bag.filter(it=>it.rar<=1&&compareItem(it)<=0).length;
    h=`<h2>${npcF('bram')}</h2><p class="say">« J’ai de quoi te garder en vie. Et je rachète ce que tu traînes. »</p><p class="st">Ton or : ${fmt(p.gold)} · Fioles ${p.pot} · Parchemins ${p.scroll}</p>
    <button data-a="buyp">Fiole : ${potPrice()} or</button><button data-a="buyp5">5 fioles : ${potPrice()*5} or</button><button data-a="buys">Parchemin : ${scrollPrice()} or</button>
    <h3>Vendre</h3>${junk?`<button data-a="selljunk">Vendre les ${junk} objets normaux et magiques moins bons</button>`:''}`;
    if(!p.bag.length)h+='<p class="st">Ton sac est vide.</p>';
    p.bag.forEach((it,i)=>{h+=itemRow(it,i,'sell');});}
  else if(id==='hilde'){h=`<h2>${npcF('hilde')}</h2><p class="say">« Ta vieille lame te plaît ? Je peux la remettre au goût du jour. Elle gardera ses pouvoirs, mais frappera comme une neuve. »</p><p class="st">Monte un objet à ton niveau (${p.lvl}). Ton or : ${fmt(p.gold)}.</p>`;
    const list=[...SLOTS.filter(s=>p.eq[s]).map(s=>({it:p.eq[s],src:'eq',k:s})),...p.bag.map((it,i)=>({it,src:'bag',k:i}))].filter(o=>o.it.ilvl<p.lvl&&o.it.rar>=1).sort((a,b)=>b.it.rar-a.it.rar);
    if(!list.length)h+='<p class="st">Rien à reforger : tes objets magiques, rares et légendaires sont déjà à ton niveau.</p>';
    for(const o of list)h+=`<div class="row"><div><div class="st">${SLOTN[o.it.slot]} · niv. ${o.it.ilvl} ${o.src==='eq'?'· équipé':''}</div><div class="it" style="color:${RCOL[o.it.rar]}">${o.it.name}</div></div><div class="bt"><button class="min" data-a="forge" data-src="${o.src}" data-k="${o.k}">${fmt(forgeCost(o.it))} or</button></div></div>`;}
  else if(id==='eline'){p.hp=p.maxHp;p.mp=p.maxMp;h=`<h2>${npcF('eline')}</h2><p class="say">« Assieds-toi près du feu. Voilà, tes blessures se referment. »</p><p class="st">Vie et mana restaurées.</p>`;}
  openPanel(h+'<div><button data-a="close">Fermer</button></div>');
}
let tab='inv';
function tabs(){const t=[['inv','Inventaire'],['perso','Stats'],['comp','Talents'+(p.pts?` (${fmt(p.pts)})`:'')],['quetes','Quêtes']];return`<div class="tabs">${t.map(([k,n])=>`<button class="${tab===k?'on':''}" data-a="tab" data-t="${k}">${n}</button>`).join('')}</div>`;}
function menuPanel(t){if(t)tab=t;if(tab==='inv'){invPanel('inv');return;}let h=tabs();const s=p.st;
  if(tab==='perso'){
    h+=`<h2>Niveau ${p.lvl}</h2><div class="grid">
    <span>Dégâts</span><b>${fmt(s.dmg[0]*(1+s.dmgPct/100))} à ${fmt(s.dmg[1]*(1+s.dmgPct/100))}</b><span>Attaques par seconde</span><b>${s.aps.toFixed(2).replace('.',',')}</b>
    <span>Critique</span><b>${s.crit} % · +${s.critDmg} %</b><span>Dégâts des sorts</span><b>+${s.spell} %</b>
    <span>Vie</span><b>${fmt(p.maxHp)}</b><span>Mana</span><b>${p.maxMp}</b><span>Armure</span><b>${fmt(s.armorT)}</b><span>Blocage</span><b>${s.block} %</b>
    <span>Vol de vie</span><b>${s.leech} %</b><span>Déplacement</span><b>+${s.move} %</b><span>Découverte d’objets</span><b>+${s.mf} %</b><span>Puissance</span><b>${fmt(powerOf(s,p.lvl))}</b>
    <span>Or</span><b>${fmt(p.gold)}</b><span>Faille la plus haute</span><b>${S.riftMax}</b></div><button class="min" data-a="mute">${p.mute?'🔇 Sons coupés':'🔊 Sons activés'}</button>`;}
  else if(tab==='comp'){talentPanel();return;}
  else{
    const st=['Inconnue','En cours','À rendre','Terminée'];h+='<h2>Quêtes</h2>';
    for(const k in QUESTS){const s=S.q[k].s;h+=`<div class="row"><div><div class="it" style="color:${s===3?'#e2d6c0':s?'#f0d050':'#6b604e'}">${qt(k+'n',QUESTS[k].n)}</div><div class="st">${s?txt(QUESTS[k].d):'Pas encore révélée.'}</div></div><div class="st">${st[s]}</div></div>`;}
    h+=`<div class="row"><div><div class="it" style="color:${riftOpen()?'#d8a8ff':'#6b604e'}">Failles sans fin</div><div class="st">${riftOpen()?`Ouvre la pierre de faille au camp. Plus haute atteinte : ${S.riftMax}.`:'Se révèle après la mort de Varsha.'}</div></div></div>`;}
  openPanel(h+'<div><button data-a="close">Fermer</button></div>');
}
function respecPrice(){return 50*p.lvl;}
let SELT=null;
function talentPanel(){tab='comp';let h=tabs();
  h+=`<h2>Talents</h2><p class="st">Points : <b>${fmt(p.pts)}</b>. Un point par niveau, un de plus tous les 5 niveaux, et un par nouvelle faille vaincue. Chaque palier demande un niveau et des points déjà placés dans sa branche. Les talents les plus forts sont au bas de l’arbre.</p><div class="tree">`;
  BR.forEach((b,bi)=>{h+=`<div class="brn"><div class="brh" style="color:${b.c}">${b.n}<span class="st">${fmt(branchPts(bi))} pts</span></div>`;
    for(let t=0;t<TL.length;t++){const ids=Object.keys(SK).filter(k=>SK[k].br===bi&&SK[k].ti===t);const open=p.lvl>=TL[t]&&branchPts(bi)>=TP[t];
      h+=`<div class="tier${open?'':' lockt'}">${open?'':`<span class="req">niv. ${TL[t]} · ${TP[t]} pts</span>`}`;
      for(const id of ids){const sk=SK[id],r=p.sk[id]||0;h+=`<button class="tal${r?' has':''}${sk.ult?' ult':''}${sk.inf?' inf':''}${SELT===id?' on':''}${canRank(id)?' can':''}" data-a="tal" data-s="${id}" aria-label="${sk.n}"><span>${sk.ic}</span>${r?`<i>${fmt(r)}</i>`:''}</button>`;}
      h+='</div>';}
    h+='</div>';});
  h+='</div>';
  const id=SELT;if(id&&SK[id]){const sk=SK[id],r=p.sk[id]||0,l=skLvl(id),op=unlocked(id);
    h+=`<div class="selbox"><div class="it" style="color:${BR[sk.br].c}">${sk.ic} ${sk.n}${sk.ult?' <span class="st">· ultime</span>':''}${sk.inf?' <span class="st">· sans fin</span>':''}</div>
    <div class="st">${BR[sk.br].n}, palier ${sk.ti+1} : niveau ${TL[sk.ti]} et ${TP[sk.ti]} points dans la branche. ${op?'':'<b style="color:#d07060">Verrouillé.</b>'}</div>
    <p class="lines">Rang ${fmt(r)}${l>r?` (+${l-r})`:''} : ${r?sk.d(l):'non appris'}<br><span class="st">Rang suivant : ${sk.d(l+1)}</span>${sk.cost?`<br><span class="st">Coût : ${sk.cost} mana${sk.cd?`, recharge ${String(sk.cd).replace('.',',')} s`:''}.</span>`:''}</p>
    <div>${canRank(id)?`<button data-a="rank" data-s="${id}" data-n="1">+1</button>${p.pts>=10?`<button data-a="rank" data-s="${id}" data-n="10">+10</button>`:''}${p.pts>=100?`<button data-a="rank" data-s="${id}" data-n="100">+100</button>`:''}${p.pts>1?`<button data-a="rank" data-s="${id}" data-n="max">Tout (${fmt(p.pts)})</button>`:''}`:''}</div>
    ${!sk.pas&&r?`<div class="st" style="margin-top:6px">Barre : ${[0,1,2,3].map(k=>`<button class="min ${p.bar[k]===id?'on':''}" data-a="bar" data-k="${k}" data-s="${id}">${k+1}</button>`).join('')}</div>`:''}</div>`;}
  else h+='<div class="selbox"><p class="st">Touche un talent pour le voir et le monter.</p></div>';
  h+=`<button class="min" data-a="respec">Tout réinitialiser (${fmt(respecPrice())} or)</button><div><button data-a="close">Fermer</button></div>`;
  const sc=panel.scrollTop;openPanel(h);panel.scrollTop=sc;}
function wpMenu(){
  let h='<h2>Point de passage</h2><p class="st">Voyage vers un point déjà activé.</p>';
  const list=['town'];curWorld().acts.forEach((a,ai)=>{if(!actOpen(ai+1))return;for(const id of actZones(ai+1)){const d=zoneDef(id);if(d&&d.wp)list.push(id);}});
  for(const id of list){const on=S.wps[id];h+=`<div class="row"><div class="it" style="color:${on?'#e2d6c0':'#5a5040'}">${zoneName(id)}</div>${on&&id!==S.cur.id?`<button class="min" data-a="wp" data-z="${id}">Voyager</button>`:id===S.cur.id?'<span class="st">Ici</span>':'<span class="st">Inactif</span>'}</div>`;}
  openPanel(h+'<div><button data-a="close">Fermer</button></div>');
}
function riftMenu(){
  const n=S.riftSel,ml=riftDef(n).lvl,cur=S.zones.rift&&!S.zones.rift.done;
  let h=`<h2>Pierre de faille</h2><p class="st">Chaque faille vaincue en ouvre une plus profonde. Les monstres et le butin y deviennent toujours plus forts.</p>
  <div class="riftsel"><button data-a="rs" data-d="-10">−10</button><button data-a="rs" data-d="-1">−</button><b>Niveau ${n}</b><button data-a="rs" data-d="1">+</button><button data-a="rs" data-d="10">+10</button></div>
  <p class="st">Monstres de niveau ${ml}. Ton niveau : ${p.lvl}. Plus haute ouverte : ${S.riftMax}.${S.rec[n]?` Record : ${fmtT(S.rec[n])}.`:''}</p>
  <button data-a="rift">Ouvrir la faille ${n}</button>${cur?`<button data-a="riftback">Reprendre la faille ${S.zones.rift.def.rift}</button>`:''}`;
  if((S.worldMax||1)>1){h+=`<h3>Mondes</h3><p class="st">Tu es dans le monde ${S.world} : ${worldName(S.world)}. Le butin d’un monde reste à son niveau.</p>`;
    for(let w=1;w<=S.worldMax;w++)if(WORLDS[w]&&w!==S.world)h+=`<button class="min" data-a="world" data-w="${w}">Monde ${w} : ${worldName(w)}</button>`;}
  openPanel(h+'<div><button data-a="close">Fermer</button></div>');
}
panel.addEventListener('click',e=>{const b=e.target.closest('button');if(b)doAct(b.dataset.a,b.dataset);});
function doAct(a,ds){const i=+ds.i;
  if(a==='close')closePanel();
  else if(a==='tab')menuPanel(ds.t);
  else if(a==='vpas')valgrisNotYet();
  else if(a==='vdefi')valgrisAccept();
  else if(a==='world'){const w=+ds.w;if(WORLDS[w]&&w<=S.worldMax&&w!==S.world){closePanel();setWorld(w);toast(`Monde ${w} : ${worldName(w)}`);save();}}
  else if(a==='qacc'){const q=S.q[ds.q];if(q&&q.s===0){q.s=1;closePanel();toast('Nouvelle quête');save();}}
  else if(a==='qret'){const q=S.q[ds.q];if(q&&q.s===2)QUESTS[ds.q].ret();}
  else if(a==='buyp'||a==='buyp5'){const n=a==='buyp5'?5:1;if(p.pot+n>POTIONS.fiole.max){say(`Tu ne peux pas porter plus de ${POTIONS.fiole.max} fioles.`);return;}if(p.gold>=potPrice()*n){p.gold-=potPrice()*n;p.pot+=n;invPanel('sell');}else say('Pas assez d’or.');}
  else if(a==='buys'){if(p.gold>=scrollPrice()){p.gold-=scrollPrice();p.scroll++;invPanel('sell');}else say('Pas assez d’or.');}
  else if(a==='sell'){const it=p.bag.splice(i,1)[0];if(it)p.gold+=it.val;save();npcDialog('bram');}
  else if(a==='selljunk'){let g=0;p.bag=p.bag.filter(it=>{if(it.rar<=1&&compareItem(it)<=0){g+=it.val;return false;}return true;});p.gold+=g;toast(`+${fmt(g)} or`);save();invPanel('sell');}
  else if(a==='best'){let ch=true,n=0;while(ch&&n<40){ch=false;n++;let bi=-1,bv=.5;p.bag.forEach((it,k)=>{const c=compareItem(it);if(c>bv){bv=c;bi=k;}});if(bi>=0){equip(bi);ch=true;}}save();invPanel();}
  else if(a==='uneq'){const s=ds.s;if(p.bag.length<30&&p.eq[s]){p.bag.push(p.eq[s]);p.eq[s]=null;recalc();menuPanel('perso');}}
  else if(a==='drop'){const it=p.bag.splice(i,1)[0];if(it)dropAt(S.cur,p.x,p.y,{kind:'item',it,dropped:true,forced:true});menuPanel('sac');}
  else if(a==='white'){p.skipWhite=!p.skipWhite;invPanel();}
  else if(['stab','isort','iequip','iuneq','ito','ifrom','isell','idrop'].includes(a))invAct(a,ds);
  else if(a==='rank'){const n=ds.n==='max'?RMAX:+(ds.n||1);if(rankUp(ds.s,n))save();talentPanel();}
  else if(a==='tal'){SELT=ds.s;talentPanel();}
  else if(a==='bar'){const k=+ds.k;const j=p.bar.indexOf(ds.s);if(j>=0)p.bar[j]=p.bar[k];p.bar[k]=ds.s;save();talentPanel();}
  else if(a==='respec'){const c=respecPrice();if(p.gold<c){say('Pas assez d’or.');return;}p.gold-=c;resetTree();save();talentPanel();}
  else if(a==='wp'){closePanel();enterZone(ds.z,'wp');}
  else if(a==='rs'){S.riftSel=clamp(S.riftSel+(+ds.d),1,S.riftMax);riftMenu();}
  else if(a==='rift'){closePanel();openRift(S.riftSel);}
  else if(a==='riftback'){closePanel();enterZone('rift','spawn');}
  else if(a==='forge'){const it=ds.src==='eq'?p.eq[ds.k]:p.bag[+ds.k];if(forge(it)){toast(it.name+' : niveau '+it.ilvl);save();}npcDialog('hilde');}
  else if(a==='mute'){p.mute=!p.mute;if(!p.mute){audioInit();sfx('gold');}save();menuPanel('perso');}
  else if(a==='revive'){closePanel();p.dead=false;p.hp=p.maxHp;p.mp=p.maxMp;enterZone('town','spawn');}
}

