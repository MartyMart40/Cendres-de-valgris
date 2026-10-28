'use strict';
/* ---------- Inventaire, poupée et coffre ---------- */
let invMode='inv',SEL=null,drag=null;
const DOLL={weapon:[.2,.6,2,4],helm:[2.6,0,2,2],amulet:[4.8,.4,1,1],armor:[2.6,2.2,2,3],offhand:[4.8,1.7,2,4],gloves:[.2,4.8,2,2],belt:[2.6,5.4,2,1],ring1:[2.6,6.55,1,1],ring2:[3.6,6.55,1,1],boots:[4.8,5.85,2,1.75]};
function cellPx(){return Math.max(22,Math.min(34,Math.floor((Math.min(460,innerWidth*.94)-40)/12)));}
function gridOf(src){return src==='bag'?{list:p.bag,W:INV_W,H:INV_H}:src==='stash'?{list:p.stash[S.stab],W:ST_W,H:ST_H}:null;}
function findIt(src,id){id=+id;if(src==='eq'){for(const s of SLOTS)if(p.eq[s]&&p.eq[s].id===id)return{it:p.eq[s],slot:s};return null;}const g=gridOf(src);const it=g&&g.list.find(o=>o.id===id);return it?{it}:null;}
function itmHTML(it,src,c,x,y,w,h,extra){const up=src==='bag'&&invMode!=='sell'?compareItem(it):0;const sel=SEL&&SEL.it===it?' sel':'';
  return`<div class="itm r${it.rar}${it.set?' set':''}${sel}" data-src="${src}" data-id="${it.id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${iconURL(it)?`<img alt="" src="${iconURL(it)}">`:`<span class="ph">${TYPES[it.type].names[0][0]}</span>`}${up>.5?'<b class="upb">▲</b>':''}${it.lock?'<b class="lockb">🔒</b>':''}${extra||''}</div>`;}
function gridHTML(src,c){const g=gridOf(src);let h=`<div class="gridc" data-grid="${src}" style="width:${g.W*c}px;height:${g.H*c}px;background-size:${c}px ${c}px">`;
  for(const it of g.list){const[w,hh]=isz(it);h+=itmHTML(it,src,c,it.gx*c,it.gy*c,w*c,hh*c);}return h+'</div>';}
function dollHTML(c){let h=`<div class="doll" style="width:${12*c}px;height:${7.6*c}px">`;
  h+=`<canvas class="heroPrev" width="${Math.round(5*c*2)}" height="${Math.round(5.6*c*2)}" style="left:${7*c}px;top:0;width:${5*c}px;height:${5.6*c}px"></canvas>`;
  for(const sl of SLOTS){const[x,y,w,hh]=DOLL[sl],it=p.eq[sl];h+=`<div class="slot${SEL&&SEL.src!=='eq'&&slotAccepts(sl,SEL.it)?' ok':''}" data-slot="${sl}" style="left:${x*c}px;top:${y*c}px;width:${w*c}px;height:${hh*c}px">${it?'':`<span class="lbl">${SLOTN[sl]}</span>`}</div>`;
    if(it){const[iw,ih]=isz(it);const s=Math.min(w/iw,hh/ih,1.25);const W2=iw*s*c,H2=ih*s*c;h+=itmHTML(it,'eq',c,x*c+(w*c-W2)/2,y*c+(hh*c-H2)/2,W2,H2);}}
  const st=p.st;h+=`<div class="dstat" style="left:${7.2*c}px;top:${5.6*c}px;width:${4.6*c}px"><span>Puissance <b>${fmt(powerOf(st,p.lvl))}</b></span><span>Vie <b>${fmt(p.maxHp)}</b> · Armure <b>${fmt(st.armorT)}</b></span><span>Allure : <b>${TIERN[Math.max(0,Math.round(SLOTS.map(k=>p.eq[k]).filter(Boolean).reduce((a,it)=>a+tierOf(it),0)/Math.max(1,SLOTS.filter(k=>p.eq[k]).length)))]}</b></span></div>`;
  return h+'</div>';}
function selHTML(){if(!SEL)return`<div class="selbox"><p class="st">Touche un objet pour le voir. Glisse-le pour le déplacer, sur une case de la poupée pour l’équiper${invMode==='stash'?', ou entre le coffre et ton sac':''}.</p></div>`;
  const it=SEL.it,src=SEL.src;let cmp='';if(src!=='eq'){const v=compareItem(it);cmp=Math.abs(v)<.5?'<span class="st">≈ même puissance</span>':v>0?`<span class="up">▲ ${pctTxt(v)} % de puissance</span>`:`<span class="dn">▼ ${pctTxt(v)} % de puissance</span>`;}
  let b='';
  if(src==='bag'&&invMode==='salv'&&S.salvTab==='extraire'){const own=ownAff(it).filter(k=>essOf(it,k));if(it.lock)b+=`<p class="st">Objet verrouillé 🔒.</p>`;else if(it.corr)b+=`<p class="st">Objet corrompu : rien à extraire.</p>`;else if(!own.length)b+=`<p class="st">Aucune propriété à extraire (il faut un objet magique ou mieux).</p>`;else b+=own.map(k=>`<button class="min" data-a="iext" data-k="${k}">Essence : ${essTxt(essOf(it,k))}</button>`).join('');}
  else if(src==='bag'&&invMode==='salv'&&(S.salvTab||'demolir')==='demolir'){if(!it.lock)b+=`<button data-a="isalv">Démolir : ${matsTxt(salvOf(it))}</button>`;}
  else if(src==='bag'&&invMode==='salv'){if(!it.lock){/* v6.31 : relancer, ajouter, monter la rareté passent par les orbes (lapidaire) ; la corruption reste ici */
    if(canCorrupt(it)){const cc=CORR[it.rar];b+=`<button class="min" data-a="icorr" style="color:#e05a5a${canPay(cc)?'':';opacity:.5'}"${canPay(cc)?'':' disabled'}>☠ Corrompre (${matsTxt(cc)}) : risqué</button>`;}else b+=`<p class="st">Cet objet ne peut pas être corrompu.</p>`;}}
  else if(src==='bag'){if(invMode==='sell'){if(!it.lock)b+=`<button data-a="isell">Vendre ${fmt(it.val)} or</button>`;}else{b+=`<button data-a="iequip">Équiper</button>`;if(it.slot==='weapon')b+=`<button class="min" data-a="ialt">En rechange</button>`;}if(invMode==='stash')b+=`<button data-a="ito">Au coffre</button>`;if(!it.lock)b+=`<button class="min" data-a="idrop">Jeter</button>`;}
  else if(src==='eq'){b+=`<button data-a="iuneq">Retirer</button>`;if(invMode==='stash')b+=`<button data-a="ito">Au coffre</button>`;}
  else if(src==='stash'){b+=`<button data-a="ifrom">Prendre</button><button data-a="iequip">Équiper</button>`;}
  b+=`<button class="min" data-a="ilock">${it.lock?'🔓 Déverrouiller':'🔒 Verrouiller'}</button>`;
  /* v6.14 : les orbes se posent chez la lapidaire */
  if(orbCount()&&invMode!=='sell'&&invMode!=='salv')b+=`<p class="st" style="margin-top:6px">◉ ${orbCount()} orbe${orbCount()>1?'s':''} : ${npcF('lapid')}, au camp, les pose sur tes objets.</p>`;
  return`<div class="selbox"><button class="selx" data-a="iselx" aria-label="Fermer">✕</button><div class="selhead"><img alt="" src="${iconURL(it)}" class="r${it.rar}"><div><div class="it" style="color:${itemCol(it)}">${it.name}</div><div class="st">${it.uniq?'Trophée de boss':it.set?'Pièce d’ensemble':RNAME[it.rar]} · ${SLOTN[it.slot]} · niveau ${it.ilvl} · ${TIERN[tierOf(it)]}${it.lock?' · 🔒 verrouillé':''}</div>${cmp}</div></div>
  <div class="st lines">${itemLines(it).join('<br>')}</div><div>${b}</div></div>`;}
function invPanel(mode){if(mode)invMode=mode;if(SEL&&!stillThere(SEL))SEL=null;const c=cellPx();let h='';
  if(invMode==='inv')h+=tabs();
  if(invMode==='sell'){h+=`<h2>${npcF('bram')}</h2><p class="st">Or : <b>${fmt(p.gold)}</b> · Fioles ${p.pot} · Parchemins ${p.scroll}</p>
    <button class="min" data-a="buyp">Fiole : ${potPrice()} or</button><button class="min" data-a="buyp5">5 fioles : ${potPrice()*5} or</button><button class="min" data-a="buys">Parchemin : ${scrollPrice()} or</button>
    <p class="st">Anneaux de résistance (${fmt(resPrice())} or) :</p>${[['resF','fire'],['resC','cold'],['resL','light'],['resP','pois']].map(([k,e])=>`<button class="min" data-a="buyres" data-k="${k}" style="color:${EL[e].c}">${EL[e].n}</button>`).join('')}
    ${p.bag.some(it=>!it.lock&&it.rar<=1&&compareItem(it)<=0)?'<button class="min" data-a="selljunk">Vendre les normaux et magiques moins bons</button>':''}${p.bag.some(it=>!it.lock)?'<button class="min" data-a="sellall">Vendre tout</button>':''}<p class="st">Touche un objet de ton sac pour le vendre.</p>${(S.bb&&S.bb.length)?`<h3>Rachat</h3><p class="st">Les ${S.bb.length} derniers objets vendus, au même prix (jusqu’à la fermeture du jeu).</p>${S.bb.map((it,i)=>`<button class="min" data-a="bback" data-i="${i}" style="color:${itemCol(it)}${p.gold>=it.val?'':';opacity:.5'}">${it.name} · ${fmt(it.val)} or</button>`).join('')}`:''}`;}
  /* v6.14 : le Démolisseur, forgeron des matériaux, en trois onglets : démolir, retravailler, matériaux */
  if(invMode==='salv'){const M=p.mats||{},T_=S.salvTab||'demolir';h+=`<h2>${npcF('demol')}</h2><div class="tabs">${[['demolir','Démolir'],['extraire','Extraire'],['retravailler','Corrompre'],['materiaux','Matériaux']].map(([k,n])=>`<button class="${T_===k?'on':''}" data-a="salvtab" data-k="${k}">${n}</button>`).join('')}</div>
    <p class="st">${MATS.map(m=>`<span style="color:${m.c}">${m.n} : <b>${fmt(M[m.k]||0)}</b></span>`).join(' · ')}</p>`;
    if(T_==='demolir')h+=`<p class="say">« Ce qui ne te sert plus, je le casse. Il en reste toujours quelque chose. »</p>${p.bag.some(it=>!it.lock)?'<button class="min" data-a="salvall">Démolir tout le sac</button>':''}<p class="st">Touche un objet pour le démolir. Les objets verrouillés 🔒 sont protégés.</p>`;
    else if(T_==='extraire')h+=`<p class="say">« Montre-moi l’objet et la propriété qui te plaît. Je casse le reste, et je t’en garde l’essence. »</p><p class="st">Touche un objet de ton sac, puis la propriété à garder. L’objet est détruit. Plus il est rare, plus l’essence est forte (magique 70 %, rare 85 %, légendaire 100 %). ${npcF('hilde')} pose ensuite l’essence sur un autre objet.</p>${essListHTML()}`;
    else if(T_==='retravailler')h+=`<p class="say">« Relancer, ajouter un bonus, monter la rareté ? C’est le métier de ${npcF('lapid')} maintenant, avec ses orbes. Moi, je casse. Et je corromps, pour ceux qui aiment jouer. »</p><p class="st">Touche un objet pour le corrompre : un seul essai, gros gain possible, une chance sur dix de tout perdre. Tes matériaux s’échangent contre des orbes chez ${npcF('lapid')}.</p>`;
    else{h+=matBox()+'<div><button data-a="close">Fermer</button></div>';const sc=panel.scrollTop;openPanel(h);panel.scrollTop=sc;panel.classList.add('wide');return;}}
  if(invMode==='stash'){h+=`<h2>Coffre</h2><div class="stabs">${[0,1,2,3].map(t=>`<button class="min ${S.stab===t?'on':''}" data-a="stab" data-t="${t}">${(S.stabN&&S.stabN[t])?S.stabN[t].replace(/[<>&"]/g,''):t+1} <span class="st">${p.stash[t].length}</span></button>`).join('')}<button class="min" data-a="isort" data-g="stash">Trier</button><button class="min" data-a="stabname">✎ Renommer</button></div>`+gridHTML('stash',c)+'<h3>Sac</h3>';}
  if(invMode==='inv'){h+=dollHTML(c);h+=`<div class="st" style="margin:4px 0">⇄ Rechange : ${p.alt?`<b style="color:${itemCol(p.alt)}">${p.alt.name}</b> <button class="min" data-a="aswap">Échanger</button><button class="min" data-a="abag">Au sac</button>`:'aucune (touche une arme du sac, puis « En rechange »)'}</div>`;}
  h+=gridHTML('bag',c);
  h+=`<div class="invbar"><span class="st">Or ${fmt(p.gold)}</span>${invMode==='inv'?`<button class="min" data-a="orbs" style="color:#e8a060">◉ Orbes ${orbCount()}</button>`:''}<button class="min" data-a="isort" data-g="bag">Trier</button>${invMode!=='sell'?'<button class="min" data-a="best">Équiper le meilleur</button>':''}<button class="min" data-a="white">${['Ramasser tout','Ignorer le normal','Rares et plus'][p.lootF??(p.skipWhite?1:0)]}</button>${invMode==='stash'?'<button class="min" data-a="allstash">Tout au coffre</button>':''}</div>`;
  h+=selHTML()+'<div><button data-a="close">Fermer</button></div>';
  const sc=panel.scrollTop;openPanel(h);panel.scrollTop=sc;panel.classList.add('wide');
  const pc=panel.querySelector('.heroPrev');if(pc&&pc.getContext){const g=pc.getContext('2d');if(g&&g.setTransform){g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,pc.width,pc.height);drawHero(g,pc.width/2,pc.height-14,pc.height/66,{cls:p.cls,look:p.look,eq:p.eq,face:.3,moving:false,t:S.t,swing:0,spin:0,buff:0});}}
}
/* v6.10 : encadré « Tes matériaux » chez le Démolisseur : à quoi ils servent et ce que ça coûte (tiré des vraies règles) */
function orbTradeBox(){return`<div class="matbox"><b>Échanger contre des orbes</b><div class="st">Tu as ${orbCount()} orbe${orbCount()>1?'s':''}. Un vert sur le bouton : tu peux payer.</div>${ORB_KEYS.map(k=>`<button class="min" data-a="otrade" data-k="${k}" ${canPay(ORB_TRADE[k])?'':'disabled style="opacity:.45"'} title="${ORBS[k].d}"><span style="color:${ORBS[k].c}">${ORBS[k].n}</span> : ${matsTxt(ORB_TRADE[k])}</button>`).join('')}</div>`;}
function matBox(){const M=p.mats||{},c=o=>`${canPay(o)?'<b style="color:#7fd07f">✓</b> ':''}${matsTxt(o)}`;const ev=AEVO.map(o=>o);
  return`<div class="matbox"><b>Tes matériaux</b><div>${MATS.map(m=>`<span style="color:${m.c}">${m.n} : <b>${fmt(M[m.k]||0)}</b></span>`).join(' · ')}</div>
  <div class="st">Un ✓ vert : tu peux le payer maintenant.<br><b>Orbes</b>, chez ${npcF('lapid')} : ${ORB_KEYS.map(k=>`${ORBS[k].n.replace('Orbe ','')} ${c(ORB_TRADE[k])}`).join(' · ')}. Ce sont eux qui relancent, ajoutent un bonus ou montent la rareté.<br>
  <b>Corrompre</b> (un seul essai, risqué) : magique ${c(CORR[1])}, rare ou légendaire ${c(CORR[2])}.<br>
  <b>Compagnon</b>, chez ${npcF('recruit')} : Élite ${c(ev[0])}, Légendaire ${c(ev[1])} (le Rejeton coûte trois fois plus).<br>
  <b>Démolir</b> rend : normal ${matsTxt(salvOf({rar:0,ilvl:1}))}, magique ${matsTxt(salvOf({rar:1,ilvl:1}))}, rare ${matsTxt(salvOf({rar:2,ilvl:1}))}, légendaire ${matsTxt(salvOf({rar:3,ilvl:1}))} ; un de plus pour les objets de niveau 20 et plus (sauf légendaires).</div></div>`;}
/* v5.11 : Vendre tout chez le marchand, sauf l’équipement porté et les objets verrouillés, avec confirmation */
function salvAllAsk(){const L=p.bag.filter(it=>!it.lock);if(!L.length){say('Rien à démolir : tout est verrouillé.');return;}const o={};for(const it of L){const g=salvOf(it);for(const k in g)o[k]=(o[k]||0)+g[k];}
  const leg=L.filter(it=>it.rar===3).length,tro=L.filter(it=>it.uniq).length;
  openPanel(`<h2>Démolir tout ?</h2><p>Démolir <b>${L.length}</b> objet${L.length>1?'s':''} de ton sac. Tu obtiens : ${matsTxt(o)}.</p>${leg?`<p class="dn">Dont ${leg} légendaire${leg>1?'s':''}${tro?` et ${tro} trophée${tro>1?'s':''} de boss`:''}.</p>`:''}<p class="st">L’équipement porté et les objets verrouillés 🔒 sont gardés.</p><button data-a="salvallok">Démolir</button><button data-a="salvback">Annuler</button>`);panel.classList.add('wide');}
function salvAll(){const L=p.bag.filter(it=>!it.lock);for(const it of L){p.bag.splice(p.bag.indexOf(it),1);addMats(salvOf(it));}SEL=null;sfx('hit');toast(`${L.length} objets démolis`);save();invPanel('salv');}
/* v5.19 : la Joueuse vend des objets voilés */
const GAMBLE={leg:.03,rare:.22,kinds:{weapon:{n:'Arme',slots:['weapon']},armor:{n:'Armure',slots:['helm','armor','gloves','boots','belt','offhand']},jewel:{n:'Bijou',slots:['amulet','ring'],mult:1.5},any:{n:'Au hasard',slots:null,mult:.8}}};
function gamblePrice(k){return Math.round((60+p.lvl*14)*(GAMBLE.kinds[k].mult||1));}
function gamble(k){const G_=GAMBLE.kinds[k];if(!G_)return null;const c=gamblePrice(k);if(p.gold<c){say('Pas assez d’or.');return null;}
  const r=Math.random(),rar=r<GAMBLE.leg?3:r<GAMBLE.leg+GAMBLE.rare?2:1;let type;
  if(G_.slots){const sl=pick(G_.slots);type=pick(SLOTTYPES[sl]);if(rar===3){const lt=LEGS.filter(l=>G_.slots.includes(l.slot));if(lt.length)type=pick(lt).type;}}
  let it=genItem(p.lvl,rar,p.st.mf,type);for(let t=0;t<40&&it.rar!==rar;t++)it=genItem(p.lvl,rar,p.st.mf,type);
  if(!bagFits(it)){say('Ton sac est plein.');return null;}p.gold-=c;bagAdd(it);sfx(it.rar===3?'leg':'gold');toast(`${RNAME[it.rar]} : ${it.name}`);save();return it;}
function sellList(){return p.bag.filter(it=>!it.lock);}
function sellAllAsk(){const L=sellList();if(!L.length){say('Rien à vendre : tout est verrouillé.');return;}const g=L.reduce((a,it)=>a+it.val,0),leg=L.filter(it=>it.rar===3).length,rare=L.filter(it=>it.rar===2).length;
  openPanel(`<h2>Vendre tout ?</h2><p>Vendre <b>${L.length}</b> objet${L.length>1?'s':''} de ton sac pour <b>${fmt(g)} or</b>.</p>${leg||rare?`<p class="dn">Dont ${leg?`${leg} légendaire${leg>1?'s':''}`:''}${leg&&rare?' et ':''}${rare?`${rare} rare${rare>1?'s':''}`:''}.</p>`:''}<p class="st">L’équipement porté et les objets verrouillés 🔒 sont gardés. Le coffre n’est pas touché.</p><button data-a="sellallok">Vendre</button><button data-a="isellback">Annuler</button>`);panel.classList.add('wide');}
function sellAll(){const L=sellList();let g=0;for(const it of L){g+=it.val;p.bag.splice(p.bag.indexOf(it),1);bbPush(it);}p.gold+=g;SEL=null;if(g)sfx('gold');toast(`+${fmt(g)} or`);save();invPanel('sell');}
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
    else if(a==='iorb'){if(ds.k==='serment'){SEL.seal=true;}else{const r=useOrb(ds.k,it);if(r){toast(r);sfx(ds.k==='aube'||ds.k==='tumulte'?'leg':'lvl');}}}
    else if(a==='iseal'){SEL.seal=false;const r=useOrb('serment',it,ds.k);if(r){toast(r);sfx('lvl');}}
    else if(a==='ilock'){it.lock=!it.lock;if(!it.lock)delete it.lock;toast(it.lock?'Objet verrouillé':'Objet déverrouillé');}
    else if(a==='icadd'){const k=craftAdd(it);if(k){toast('Nouveau bonus : '+AFX[k].t(it.aff[k]));sfx('lvl');}}
    else if(a==='ialt'){if(setAlt(it)){toast('En rechange : '+it.name);SEL=null;}}
    else if(a==='icorr'){if(!it.corrAsk){it.corrAsk=1;say('Corrompre est risqué : une chance sur dix de tout perdre. Touche encore pour confirmer.');}else{delete it.corrAsk;const r=corrupt(it);if(r){toast(CORR_MSG[r]);sfx(r==='ruine'?'die':r==='rien'?'hit':'leg');S.shake=.2;if(r==='ruine')SEL=null;}}}
    else if(a==='icup'){if(craftUp(it)){toast(`${RNAME[it.rar]} : ${it.name}`);sfx('leg');}}
    else if((a==='isalv'||a==='ireroll')&&it.lock){say('Objet verrouillé : déverrouille-le d’abord.');}
    else if(a==='iext'){if(it.lock){say('Objet verrouillé : déverrouille-le d’abord.');}else{const e=essExtract(it,ds.k);if(e){toast('Essence : '+essTxt(e));sfx('leg');SEL=null;}}}
    else if(a==='isalv'){const i=p.bag.indexOf(it);if(i>=0){p.bag.splice(i,1);const o=salvOf(it);addMats(o);sfx('hit');toast('+ '+MATS.filter(m=>o[m.k]).map(m=>o[m.k]+' '+m.n.toLowerCase()).join(', '));}SEL=null;}
    else if(a==='ireroll'){const r=reroll(it);if(r){toast(`${AFX[r.k].t(r.old)} → ${AFX[r.k].t(r.now)}`);sfx('lvl');}}
    else if((a==='isell'||a==='idrop')&&it.lock){say('Objet verrouillé : déverrouille-le d’abord.');}
    else if(a==='isell'){const i=p.bag.indexOf(it);if(i>=0){p.bag.splice(i,1);p.gold+=it.val;bbPush(it);sfx('gold');}SEL=null;}
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
let TAP2=null;
function quickEquip(it,src){if(src==='eq'){if(moveTo_(it,{grid:'bag'}))toast('Au sac : '+it.name);return;}
  if(!SLOTS.some(k=>slotAccepts(k,it)))return;const sl=eqSlotFor(it);if(moveTo_(it,{slot:sl})){toast('Équipé : '+it.name);sfx('hit');}}
function endDrag(e,cancel){if(!drag)return;const d=drag;drag=null;if(d.gh)d.gh.remove();
  if(!d.on){if(cancel)return;const f=findIt(d.src,d.id);if(f){const now=performance.now();S.pend.push({t:0,fn:()=>{}});/* v6.44 : plus de saut vers la description */
      /* v6.10 : double-toucher un objet du sac (ou du coffre) pour l’équiper ; sur la poupée, pour le renvoyer au sac */
      if(TAP2&&TAP2.id===d.id&&TAP2.src===d.src&&now-TAP2.t<400&&(invMode==='inv'||invMode==='stash')){TAP2=null;SEL=null;quickEquip(f.it,d.src);save();invPanel();return;}
      TAP2={id:d.id,src:d.src,t:now};SEL=SEL&&SEL.it===f.it?null:{it:f.it,src:d.src};invPanel();}return;}
  if(!cancel){const t=dropTarget(e.clientX,e.clientY);if(t){if(t.slot)moveTo_(d.it,{slot:t.slot});else moveTo_(d.it,{grid:t.grid},t.x,t.y);save();}}
  invPanel();}
panel.addEventListener('pointerup',e=>endDrag(e,false));panel.addEventListener('pointercancel',e=>endDrag(e,true));
// Toucher une case vide ou un emplacement avec un objet sélectionné
panel.addEventListener('click',e=>{if(!SEL||e.target.closest('.itm')||e.target.closest('button'))return;const sl=e.target.closest('[data-slot]');
  if(sl){if(moveTo_(SEL.it,{slot:sl.dataset.slot})){SEL=null;save();}invPanel();return;}
  const gr=e.target.closest('[data-grid]');if(gr){const c=cellPx(),r=gr.getBoundingClientRect();if(moveTo_(SEL.it,{grid:gr.dataset.grid},Math.floor((e.clientX-r.left)/c),Math.floor((e.clientY-r.top)/c))){SEL=null;save();}invPanel();}});
