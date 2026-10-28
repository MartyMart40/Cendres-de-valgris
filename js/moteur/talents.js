'use strict';
function skLvl(id){return effL(skRaw(id));}
function branchPts(b){let n=0;for(const k in p.sk)if(SK[k]&&SK[k].br===b)n+=p.sk[k];return n;}
function unlocked(id){const s=SK[id];if(s.gem)return true;return p.lvl>=Math.max(TL[s.ti],s.minL||0)&&branchPts(s.br)>=TP[s.ti];}
/* v6.30 : vraies classes. Chacune a ses deux branches au prix normal (les autres coûtent 2 points par rang), ses armes, une force et une faiblesse.
   Un héros d’avant peut rester « libre » (comme avant) jusqu’à ce qu’il choisisse ; choisir rembourse ses talents. */
const CLS={guerrier:{n:'Guerrier',ic:'⚔️',br:[0,2],w:['sword','axe','mace','dagger'],start:{},bar:[null,null],weapon:'sword',
    d:'Encaisse et frappe de près. Le Tourbillon se gagne au niveau 3. +30 % de vie, +20 % d’armure, −20 % de mana. Chaque coup d’arme touche aussi un deuxième monstre collé à lui (60 % des dégâts). Talents : Guerre et Rempart seulement. Épées, haches, masses, dagues.'},
  mage:{n:'Mage',ic:'🔥',br:[1,3],w:['staff','dagger'],start:{fire:1,nova:1},bar:['fire','nova'],weapon:'staff',
    d:'Frappe fort de loin, mais reste fragile. +25 % de mana et de régénération, +15 % de dégâts des sorts, −15 % de vie. Barrière de mana : 25 % des dégâts reçus sont absorbés par la mana tant qu’il en reste (1 point de mana pour 2 de dégâts). Talents : Pyromancie et Ombre seulement. Bâtons, dagues.'},
  archer:{n:'Archer',ic:'🏹',br:[4,3],w:['bow','dagger'],start:{ardente:1,volley:1},bar:['ardente','volley'],weapon:'bow',
    d:'Tire de loin et bouge vite. +10 % de déplacement, +5 % de critique, −10 % de vie. Talents : Archerie et Ombre seulement. Arcs, dagues.'}};
function tCost(id){const c=p&&p.cls&&CLS[p.cls],sk=SK[id];if(!c||!sk||sk.gem||sk.br<0)return 1;return c.br.includes(sk.br)?1:2;}
function clsWeaponOk(t){const c=typeof p!=='undefined'&&p&&p.cls&&CLS[p.cls];return!c||!t||c.w.includes(t);}
/* v6.55 : une classe n’a accès qu’à ses deux branches (un héros libre garde tout) */
function clsOk(id){const sk=SK[id];if(!sk)return false;if(sk.gem||sk.br<0)return true;const c=p&&p.cls&&CLS[p.cls];return !c||c.br.includes(sk.br);}
function myBranches(){const c=p&&p.cls&&CLS[p.cls];return c?c.br.slice():BR.map((_,i)=>i);}
function canRank(id){return clsOk(id)&&p.pts>=tCost(id)&&SK[id]&&!SK[id].gem&&unlocked(id)&&(p.sk[id]||0)<RMAX;}
/* conversion : rembourse les talents d’autres classes (payés 2 points par rang) et les retire de la barre et des préréglages */
function classPrune(){if(!p.cls||!CLS[p.cls])return 0;let back=0;const gone=[];for(const k of Object.keys(p.sk)){if(clsOk(k))continue;back+=(p.sk[k]|0)*2;gone.push(k);delete p.sk[k];}
  p.bar=p.bar.map(k=>k&&!clsOk(k)?null:k);if(p.sup)for(const k of Object.keys(p.sup))if(!clsOk(k))delete p.sup[k];if(p.cds)for(const k of gone)delete p.cds[k];
  if(Array.isArray(p.builds))p.builds.forEach(B=>{if(!B||!B.sk)return;for(const k of Object.keys(B.sk))if(SK[k]&&!SK[k].gem&&SK[k].br>=0&&!CLS[p.cls].br.includes(SK[k].br))delete B.sk[k];if(Array.isArray(B.bar))B.bar=B.bar.map(k=>k&&SK[k]&&!SK[k].gem&&SK[k].br>=0&&!CLS[p.cls].br.includes(SK[k].br)?null:k);});
  p.pts+=back;return back;}
/* Barre : 4 cases, 5 au niveau 15, 6 au niveau 30 */
function barSize(){return 4+(p.lvl>=15?1:0)+(p.lvl>=30?1:0);}
/* v5.47 : Pas du Voile. Butin des Arpenteurs (cartes « Voile déchiré »), 3 charges. */
function veilRe(){return Math.max(4,10-.5*(skLvl('veil')-1));}
function veilStep(tx,ty,l){const z=S.cur;if(p.veilC==null)p.veilC=3;
  if(z.shrink){say('Le Voile refuse de s’ouvrir ici.');return false;}
  if(p.veilC<1){say('Le Voile se referme. Attends une charge.');return false;}
  const R=8+Math.min(6,l);let a,dmax;if(tx==null){a=p.face||0;dmax=R;}else{a=Math.atan2(ty-p.y,tx-p.x);dmax=Math.min(R,Math.hypot(tx-p.x,ty-p.y));}
  const F=bfs(z,Math.floor(p.x),Math.floor(p.y),Math.ceil(R*1.6));let dst=null;
  for(let d=dmax;d>=1;d-=.5){const x=p.x+Math.cos(a)*d,y=p.y+Math.sin(a)*d,cx=Math.floor(x),cy=Math.floor(y);if(cx<0||cy<0||cx>=z.w||cy>=z.h)continue;if(isWall(z,cx,cy)||F[cy*z.w+cx]<0||F[cy*z.w+cx]>R*1.6)continue;if(!free(z,x,y,.22))continue;dst=[x,y];break;}
  if(!dst){say('Pas de passage.');return false;}
  burst(p.x,p.y,'#a890ff',22);p.x=dst[0];p.y=dst[1];p.path=null;p.goal=null;p.face=a;burst(p.x,p.y,'#a890ff',22);p.inv=Math.max(p.inv||0,.25);
  p.veilC--;if(p.veilC<1)p.cds.veil=veilRe()-(p.veilT||0);sfx('portal');return true;}
function learnGem(id){const first=!p.sk[id];p.sk[id]=(p.sk[id]||0)+1;if(first){const e=p.bar.slice(0,barSize()).indexOf(null);if(e>=0)p.bar[e]=id;}recalc();return first;}
function rankUp(id,n){let k=0;while(k<n&&canRank(id)){p.pts-=tCost(id);p.sk[id]=(p.sk[id]||0)+1;k++;}
  if(k&&!SK[id].pas&&p.sk[id]===k&&!p.bar.includes(id)){const e=p.bar.indexOf(null);if(e>=0)p.bar[e]=id;}if(k)recalc();return k;}
function ptsEarned(){return(p.lvl-1)+Math.floor(p.lvl/5)+Math.max(0,(S?S.riftMax:1)-1)+(p.bonusPts|0);}
function resetTree(){const keep={};for(const k in p.sk)if(SK[k]&&SK[k].gem)keep[k]=p.sk[k];const C_=p.cls&&CLS[p.cls];p.sk={...(C_?C_.start:{fire:1,nova:1}),...keep};p.pts=ptsEarned();p.bar=[...(C_?C_.bar:['fire','nova']),null,null,null,null];p.tv=2;recalc();}
function clsWeapon(k,L){const t=CLS[k].weapon,b=TYPES[t],g=G(L);return refreshName({id:itemId++,type:t,slot:'weapon',rar:0,ilvl:L,d:[Math.max(1,Math.round(b.d[0]*g)),Math.max(2,Math.round(b.d[1]*g))],spd:b.spd,aff:Object.assign({},b.atk?{atk:b.atk}:{},b.spell?{spell:b.spell}:{},b.crit?{crit:b.crit}:{}),val:6});}
function setClass(k,fresh){if(!CLS[k])return;p.cls=k;p.clsAsked=true;if(fresh){const w=clsWeapon(k,p.lvl);if(p.eq.weapon&&!bagAdd(p.eq.weapon)){}p.eq.weapon=w;}resetTree();p.hp=p.maxHp;p.mp=p.maxMp;closePanel();toast('Classe : '+CLS[k].n);save();}
function classPanel(fresh){const h=`<h2>${fresh?'Choisis ta classe':'Choisir une classe'}</h2><p class="st">${fresh?'Chaque classe a ses forces et ses faiblesses.':'Ton héros est libre (comme avant). Choisir une classe lui donne une force et une faiblesse, et rembourse tous ses points de talent pour que tu les replaces. Tu peux aussi rester libre.'} Les talents des deux branches de ta classe coûtent 1 point par rang, les autres 2. Une arme d’une autre classe frappe 30 % moins fort.</p>`
  +Object.entries(CLS).map(([k,c])=>`<div class="row"><div><div class="it">${c.ic} ${c.n}</div><div class="st">${c.d}</div></div><div class="bt"><button data-a="${fresh?'clsnew':'cls'}" data-k="${k}">Choisir</button></div></div>`).join('')
  +(fresh?'':'<button data-a="close">Rester libre</button>');openPanel(h);}


/* v6.57 : la forgeronne pose les essences et les reliques */
let HSEL=null,HREP=null;
function hildeTabs(){const T_=S.hTab||'reforger';return`<div class="tabs">${[['reforger','Reforger'],['ess','Essences ('+((p.ess||[]).length)+')'],['rel','Reliques ('+relCount()+')']].map(([k,n])=>`<button class="${T_===k?'on':''}" data-a="htab" data-k="${k}">${n}</button>`).join('')}</div>`;}
function essListHTML(){const E=p.ess||[];return`<div class="matbox"><b>Tes essences : ${E.length} / ${ESS_MAX}</b><div class="st">${E.length?E.map(e=>`<span style="color:${RCOL?RCOL[e.r]||'#ddd':'#ddd'}">${essTxt(e)}</span>`).join(' · '):'Aucune pour l’instant.'}</div></div>`;}
function hildeItems(){return SLOTS.filter(k=>p.eq[k]).map(k=>({it:p.eq[k],src:'eq'})).concat(p.bag.map(it=>({it,src:'bag'})));}
function hildeCraft(){const T_=S.hTab;if(HSEL&&!hildeItems().some(o=>o.it===HSEL))HSEL=null;let h=`<h2>${npcF('hilde')}</h2>${hildeTabs()}`;
  if(T_==='ess')h+=`<p class="say">« Une essence, c’est un morceau d’objet qui veut revivre. Donne-moi la bonne, je la fixe où tu veux. »</p><p class="st">Chaque objet a ${FP_MAX} points de forge : une essence posée en coûte un. À zéro, l’objet est fini. Les essences viennent du ${npcF('demol')}.</p>`;
  else h+=`<p class="say">« Une relique ne rend pas plus fort. Elle change la façon dont un sort se comporte. »</p><p class="st">Une relique par objet porté. Elle tombe sur les boss. La retirer la rend à ta sacoche, gratuitement.</p>`;
  if(HSEL){const it=HSEL;h+=`<div class="selbox" style="border-top:0;margin-top:0;padding-top:0"><div class="selhead"><img alt="" src="${iconURL(it)}" class="r${it.rar}"><div><div class="it" style="color:${itemCol(it)}">${it.name}</div><div class="st">${RNAME[it.rar]} · ${SLOTN[it.slot]} · niveau ${it.ilvl}${Object.values(p.eq).includes(it)?' · porté':''}</div></div></div><div class="st lines">${itemLines(it).join('<br>')}</div></div>`;
    if(T_==='ess'){const c=essCost(it);h+=`<p class="st">Coût d’une essence : ${fmt(c.gold)} or et ${matsTxt(c.mats)} · tu as ${fmt(p.gold)} or.</p>`;
      if(HREP!=null){const e=(p.ess||[])[HREP];h+=`<div class="matbox"><b>Objet plein : quelle propriété remplacer par ${e?essTxt(e):'?'} ?</b><div>${ownAff(it).filter(k=>k!==it.seal).map(k=>`<button class="min" data-a="hrep" data-k="${k}">${AFX[k].t(it.aff[k])}</button>`).join('')}<button class="min" data-a="hrepno">Annuler</button></div></div>`;}
      const E=p.ess||[];h+=`<h3>Essences</h3>`+(E.length?E.map((e,i)=>{const w=essWhy(e,it);return`<div class="row"><div><div class="it">${essTxt(e)}</div><div class="st">tirée d’un objet de niveau ${e.L}${w?` · <span style="color:#d07060">${w}</span>`:essFull(e,it)?' · remplacera une propriété':''}</div></div><div class="bt"><button class="min" data-a="hess" data-i="${i}" ${w?'disabled style="opacity:.4"':''}>Poser</button></div></div>`;}).join(''):`<p class="st">Aucune essence. Le ${npcF('demol')} les extrait, onglet Extraire.</p>`);}
    else{const R_=p.relics||{};h+=it.rel&&RELICS[it.rel]?`<button class="min" data-a="hrelx">Retirer ${RELICS[it.rel].n}</button>`:'';h+=`<h3>Tes reliques</h3>`+(REL_KEYS.filter(k=>R_[k]).map(k=>{const r=RELICS[k],mine=!p.cls||r.cls===p.cls;return`<div class="row"><div><div class="it" style="color:#ffd27a">${r.n} <span class="st">× ${R_[k]}</span></div><div class="st">${r.d} (${SK[r.sk]?SK[r.sk].n:r.sk})${mine?'':` · <span style="color:#d07060">relique de ${CLS[r.cls].n.toLowerCase()}</span>`}</div></div><div class="bt"><button class="min" data-a="hrel" data-k="${k}">Poser</button></div></div>`;}).join('')||'<p class="st">Aucune relique. Elles tombent sur les acolytes, les lieutenants et les boss d’acte.</p>');}
    h+=`<button class="min" data-a="hselno">Choisir un autre objet</button>`;}
  else h+=`<p class="st"><b>1.</b> Choisis un objet. <b>2.</b> Choisis ${T_==='ess'?'l’essence':'la relique'}.</p>`;
  h+=`<h3>${HSEL?'Autres objets':'Tes objets'}</h3><div class="laplist">${hildeItems().filter(o=>o.it!==HSEL).map(o=>`<button class="lapit" data-a="hsel" data-id="${o.it.id}"><img alt="" src="${iconURL(o.it)}" class="r${o.it.rar}"><span style="color:${itemCol(o.it)}">${o.it.name}</span><span class="st">${o.src==='eq'?'porté · ':''}${T_==='ess'?`forge ${fpOf(o.it)} / ${FP_MAX}`:(o.it.rel&&RELICS[o.it.rel]?'✧ '+RELICS[o.it.rel].n:'case vide')}</span></button>`).join('')||'<p class="st">Rien à travailler.</p>'}</div>`;
  const sc=panel.scrollTop;openPanel(h+'<div><button data-a="close">Fermer</button></div>');panel.classList.add('wide');panel.scrollTop=sc;}
function relPut(it,k){if(!it||!RELICS[k]||!((p.relics||{})[k]>0))return false;if(it.rel&&RELICS[it.rel])p.relics[it.rel]=(p.relics[it.rel]||0)+1;p.relics[k]--;if(!p.relics[k])delete p.relics[k];it.rel=k;if(Object.values(p.eq).includes(it))recalc();return true;}
function relTake(it){if(!it||!it.rel)return false;if(RELICS[it.rel]){p.relics=p.relics||{};p.relics[it.rel]=(p.relics[it.rel]||0)+1;}delete it.rel;if(Object.values(p.eq).includes(it))recalc();return true;}
