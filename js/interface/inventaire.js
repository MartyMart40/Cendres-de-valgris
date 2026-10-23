'use strict';
/* ---------- Inventaire, poupée et coffre ---------- */
let invMode='inv',SEL=null,drag=null;
const DOLL={weapon:[.2,.6,2,4],helm:[2.6,0,2,2],amulet:[4.8,.4,1,1],armor:[2.6,2.2,2,3],offhand:[4.8,1.7,2,4],gloves:[.2,4.8,2,2],belt:[2.6,5.4,2,1],ring1:[2.6,6.55,1,1],ring2:[3.6,6.55,1,1],boots:[4.8,5.85,2,1.75]};
function cellPx(){return Math.max(22,Math.min(34,Math.floor((Math.min(460,innerWidth*.94)-40)/12)));}
function gridOf(src){return src==='bag'?{list:p.bag,W:INV_W,H:INV_H}:src==='stash'?{list:p.stash[S.stab],W:ST_W,H:ST_H}:null;}
function findIt(src,id){id=+id;if(src==='eq'){for(const s of SLOTS)if(p.eq[s]&&p.eq[s].id===id)return{it:p.eq[s],slot:s};return null;}const g=gridOf(src);const it=g&&g.list.find(o=>o.id===id);return it?{it}:null;}
function itmHTML(it,src,c,x,y,w,h,extra){const up=src==='bag'&&invMode!=='sell'?compareItem(it):0;const sel=SEL&&SEL.it===it?' sel':'';
  return`<div class="itm r${it.rar}${sel}" data-src="${src}" data-id="${it.id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${iconURL(it)?`<img alt="" src="${iconURL(it)}">`:`<span class="ph">${TYPES[it.type].names[0][0]}</span>`}${up>.5?'<b class="upb">▲</b>':''}${extra||''}</div>`;}
function gridHTML(src,c){const g=gridOf(src);let h=`<div class="gridc" data-grid="${src}" style="width:${g.W*c}px;height:${g.H*c}px;background-size:${c}px ${c}px">`;
  for(const it of g.list){const[w,hh]=isz(it);h+=itmHTML(it,src,c,it.gx*c,it.gy*c,w*c,hh*c);}return h+'</div>';}
function dollHTML(c){let h=`<div class="doll" style="width:${12*c}px;height:${7.6*c}px">`;
  h+=`<canvas class="heroPrev" width="${Math.round(5*c*2)}" height="${Math.round(5.6*c*2)}" style="left:${7*c}px;top:0;width:${5*c}px;height:${5.6*c}px"></canvas>`;
  for(const sl of SLOTS){const[x,y,w,hh]=DOLL[sl],it=p.eq[sl];h+=`<div class="slot${SEL&&SEL.src!=='eq'&&slotAccepts(sl,SEL.it)?' ok':''}" data-slot="${sl}" style="left:${x*c}px;top:${y*c}px;width:${w*c}px;height:${hh*c}px">${it?'':`<span class="lbl">${SLOTN[sl]}</span>`}</div>`;
    if(it){const[iw,ih]=isz(it);const s=Math.min(w/iw,hh/ih,1.25);const W2=iw*s*c,H2=ih*s*c;h+=itmHTML(it,'eq',c,x*c+(w*c-W2)/2,y*c+(hh*c-H2)/2,W2,H2);}}
  const st=p.st;h+=`<div class="dstat" style="left:${7.2*c}px;top:${5.6*c}px;width:${4.6*c}px"><span>Puissance <b>${fmt(powerOf(st,p.lvl))}</b></span><span>Vie <b>${fmt(p.maxHp)}</b> · Armure <b>${fmt(st.armorT)}</b></span><span>Allure : <b>${TIERN[Math.max(0,Math.round(SLOTS.map(k=>p.eq[k]).filter(Boolean).reduce((a,it)=>a+tierOf(it),0)/Math.max(1,SLOTS.filter(k=>p.eq[k]).length)))]}</b></span></div>`;
  return h+'</div>';}
function selHTML(){if(!SEL)return`<div class="selbox"><p class="st">Touche un objet pour le voir. Glisse-le pour le déplacer, sur une case de la poupée pour l’équiper${invMode==='stash'?', ou entre le coffre et ton sac':''}.</p></div>`;
  const it=SEL.it,src=SEL.src;let cmp='';if(src!=='eq'){const v=compareItem(it);cmp=Math.abs(v)<.5?'<span class="st">≈ même puissance</span>':v>0?`<span class="up">▲ ${v.toFixed(v<10?1:0).replace('.',',')} % de puissance</span>`:`<span class="dn">▼ ${(-v).toFixed(-v<10?1:0).replace('.',',')} % de puissance</span>`;}
  let b='';
  if(src==='bag'){if(invMode==='sell')b+=`<button data-a="isell">Vendre ${fmt(it.val)} or</button>`;else b+=`<button data-a="iequip">Équiper</button>`;if(invMode==='stash')b+=`<button data-a="ito">Au coffre</button>`;b+=`<button class="min" data-a="idrop">Jeter</button>`;}
  else if(src==='eq'){b+=`<button data-a="iuneq">Retirer</button>`;if(invMode==='stash')b+=`<button data-a="ito">Au coffre</button>`;}
  else if(src==='stash'){b+=`<button data-a="ifrom">Prendre</button><button data-a="iequip">Équiper</button>`;}
  return`<div class="selbox"><div class="selhead"><img alt="" src="${iconURL(it)}" class="r${it.rar}"><div><div class="it" style="color:${RCOL[it.rar]}">${it.name}</div><div class="st">${it.boss?'Légendaire de boss':RNAME[it.rar]} · ${SLOTN[it.slot]} · niveau ${it.ilvl} · ${TIERN[tierOf(it)]}</div>${cmp}</div></div>
  <div class="st lines">${itemLines(it).join('<br>')}</div><div>${b}</div></div>`;}
function invPanel(mode){if(mode)invMode=mode;if(SEL&&!stillThere(SEL))SEL=null;const c=cellPx();let h='';
  if(invMode==='inv')h+=tabs();
  if(invMode==='sell'){h+=`<h2>${npcF('bram')}</h2><p class="st">Or : <b>${fmt(p.gold)}</b> · Fioles ${p.pot} · Parchemins ${p.scroll}</p>
    <button class="min" data-a="buyp">Fiole : ${potPrice()} or</button><button class="min" data-a="buyp5">5 fioles : ${potPrice()*5} or</button><button class="min" data-a="buys">Parchemin : ${scrollPrice()} or</button>
    ${p.bag.some(it=>it.rar<=1&&compareItem(it)<=0)?'<button class="min" data-a="selljunk">Vendre les normaux et magiques moins bons</button>':''}<p class="st">Touche un objet de ton sac pour le vendre.</p>`;}
  if(invMode==='stash'){h+=`<h2>Coffre</h2><div class="stabs">${[0,1,2,3].map(t=>`<button class="min ${S.stab===t?'on':''}" data-a="stab" data-t="${t}">${t+1} <span class="st">${p.stash[t].length}</span></button>`).join('')}<button class="min" data-a="isort" data-g="stash">Trier</button></div>`+gridHTML('stash',c)+'<h3>Sac</h3>';}
  if(invMode==='inv')h+=dollHTML(c);
  h+=gridHTML('bag',c);
  h+=`<div class="invbar"><span class="st">Or ${fmt(p.gold)}</span><button class="min" data-a="isort" data-g="bag">Trier</button>${invMode!=='sell'?'<button class="min" data-a="best">Équiper le meilleur</button>':''}<button class="min" data-a="white">${p.skipWhite?'Ramasser le normal':'Ignorer le normal'}</button></div>`;
  h+=selHTML()+'<div><button data-a="close">Fermer</button></div>';
  const sc=panel.scrollTop;openPanel(h);panel.scrollTop=sc;panel.classList.add('wide');
  const pc=panel.querySelector('.heroPrev');if(pc&&pc.getContext){const g=pc.getContext('2d');if(g&&g.setTransform){g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,pc.width,pc.height);drawHero(g,pc.width/2,pc.height-14,pc.height/66,{eq:p.eq,face:.3,moving:false,t:S.t,swing:0,spin:0,buff:0});}}
}
function stillThere(s){if(s.src==='eq')return SLOTS.some(k=>p.eq[k]===s.it);const g=gridOf(s.src);return g&&g.list.includes(s.it);}
function locate(it){for(const k of SLOTS)if(p.eq[k]===it)return{src:'eq',slot:k};if(p.bag.includes(it))return{src:'bag'};if(p.stash[S.stab].includes(it))return{src:'stash'};return null;}
// Déplacer un objet vers une grille (x,y facultatifs) ou un emplacement d’équipement
function moveTo_(it,dst,x,y){const from=locate(it);if(!from)return false;
  if(dst.slot){if(!slotAccepts(dst.slot,it)){say('Cet objet ne va pas là.');return false;}
    if(from.src==='eq'){if(from.slot===dst.slot)return true;const o=p.eq[dst.slot];p.eq[dst.slot]=it;p.eq[from.slot]=o||null;recalc();return true;}
    if(from.src==='bag')return equipItem(it,dst.slot);
    const st=p.stash[S.stab],ox=it.gx,oy=it.gy,old=p.eq[dst.slot];st.splice(st.indexOf(it),1);
    if(old){if(fitsAt(st,ST_W,ST_H,old,ox,oy)){old.gx=ox;old.gy=oy;st.push(old);}else if(!bagAdd(old)&&!addTo(st,ST_W,ST_H,old)){st.push(it);say('Pas de place.');return false;}}
    p.eq[dst.slot]=it;recalc();return true;}
  const g=gridOf(dst.grid);const same=from.src===dst.grid;
  if(x==null){if(same)return true;if(!findSpot(g.list,g.W,g.H,it)){say(dst.grid==='bag'?'Ton sac est plein.':'Cet onglet du coffre est plein.');return false;}}
  else if(!fitsAt(g.list,g.W,g.H,it,x,y,same?it:null)){say('Pas de place à cet endroit.');return false;}
  if(from.src==='eq'){p.eq[from.slot]=null;recalc();}else if(!same){const fl=gridOf(from.src).list;fl.splice(fl.indexOf(it),1);}
  if(x==null){addTo(g.list,g.W,g.H,it);}else{it.gx=x;it.gy=y;if(!same)g.list.push(it);}
  return true;}
function invAct(a,ds){
  if(a==='stab'){S.stab=+ds.t;SEL=null;}
  else if(a==='isort'){const g=gridOf(ds.g);if(!sortGrid(g.list,g.W,g.H))say('Impossible de mieux ranger.');}
  else if(SEL){const it=SEL.it;
    if(a==='iequip'){moveTo_(it,{slot:eqSlotFor(it)});SEL=null;}
    else if(a==='iuneq'){moveTo_(it,{grid:'bag'});SEL=null;}
    else if(a==='ito'){moveTo_(it,{grid:'stash'});SEL=null;}
    else if(a==='ifrom'){moveTo_(it,{grid:'bag'});SEL=null;}
    else if(a==='isell'){const i=p.bag.indexOf(it);if(i>=0){p.bag.splice(i,1);p.gold+=it.val;sfx('gold');}SEL=null;}
    else if(a==='idrop'){const i=p.bag.indexOf(it);if(i>=0){p.bag.splice(i,1);dropAt(S.cur,p.x,p.y,{kind:'item',it,dropped:true,forced:true});}SEL=null;}}
  save();invPanel();}
// Glisser-déposer et touchers
panel.addEventListener('pointerdown',e=>{const el=e.target.closest('.itm');if(!el||!S)return;e.preventDefault();const r=el.getBoundingClientRect();
  drag={el,src:el.dataset.src,id:el.dataset.id,sx:e.clientX,sy:e.clientY,ox:e.clientX-r.left,oy:e.clientY-r.top,w:r.width,h:r.height,on:false,pid:e.pointerId};try{el.setPointerCapture(e.pointerId);}catch(_){}});
panel.addEventListener('pointermove',e=>{if(!drag)return;if(!drag.on){if(Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)<7)return;drag.on=true;
    const f=findIt(drag.src,drag.id);if(!f){drag=null;return;}drag.it=f.it;SEL=null;const gh=document.createElement('div');gh.className='ghost itm r'+f.it.rar;gh.style.width=drag.w+'px';gh.style.height=drag.h+'px';gh.innerHTML=`<img alt="" src="${iconURL(f.it)}">`;document.body.appendChild(gh);drag.gh=gh;drag.el.style.opacity=.3;}
  drag.gh.style.left=(e.clientX-drag.ox)+'px';drag.gh.style.top=(e.clientY-drag.oy)+'px';
  const tgt=dropTarget(e.clientX,e.clientY);panel.querySelectorAll('.hl,.bad').forEach(n=>n.classList.remove('hl','bad'));if(tgt&&tgt.el)tgt.el.classList.add(tgt.ok?'hl':'bad');});
function dropTarget(x,y){const el=document.elementFromPoint(x,y);if(!el||!drag||!drag.it)return null;const sl=el.closest('[data-slot]');if(sl)return{slot:sl.dataset.slot,el:sl,ok:slotAccepts(sl.dataset.slot,drag.it)};
  const gr=el.closest('[data-grid]');if(gr){const c=cellPx(),r=gr.getBoundingClientRect();const gx=Math.round((x-drag.ox-r.left)/c),gy=Math.round((y-drag.oy-r.top)/c);const g=gridOf(gr.dataset.grid);const from=locate(drag.it);
    return{grid:gr.dataset.grid,x:gx,y:gy,el:gr,ok:fitsAt(g.list,g.W,g.H,drag.it,gx,gy,from&&from.src===gr.dataset.grid?drag.it:null)};}
  return null;}
function endDrag(e,cancel){if(!drag)return;const d=drag;drag=null;if(d.gh)d.gh.remove();
  if(!d.on){if(cancel)return;const f=findIt(d.src,d.id);if(f){SEL=SEL&&SEL.it===f.it?null:{it:f.it,src:d.src};invPanel();}return;}
  if(!cancel){const t=dropTarget(e.clientX,e.clientY);if(t){if(t.slot)moveTo_(d.it,{slot:t.slot});else moveTo_(d.it,{grid:t.grid},t.x,t.y);save();}}
  invPanel();}
panel.addEventListener('pointerup',e=>endDrag(e,false));panel.addEventListener('pointercancel',e=>endDrag(e,true));
// Toucher une case vide ou un emplacement avec un objet sélectionné
panel.addEventListener('click',e=>{if(!SEL||e.target.closest('.itm')||e.target.closest('button'))return;const sl=e.target.closest('[data-slot]');
  if(sl){if(moveTo_(SEL.it,{slot:sl.dataset.slot})){SEL=null;save();}invPanel();return;}
  const gr=e.target.closest('[data-grid]');if(gr){const c=cellPx(),r=gr.getBoundingClientRect();if(moveTo_(SEL.it,{grid:gr.dataset.grid},Math.floor((e.clientX-r.left)/c),Math.floor((e.clientY-r.top)/c))){SEL=null;save();}invPanel();}});
