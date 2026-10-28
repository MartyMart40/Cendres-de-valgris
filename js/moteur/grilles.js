'use strict';
/* ---------- Grilles d’inventaire et de coffre ---------- */
const INV_W=12,ST_W=12,ST_H=8,ST_TABS=4,BAG_MAX=3;let INV_H=5;
function setBagRows(){INV_H=5+clamp((p&&p.bagRows)|0,0,BAG_MAX);}
function isz(it){const t=TYPES[it.type]||TYPES.ring;return[t.w,t.h];}
function occ(list,W,H,skip){const g=new Uint8Array(W*H);for(const o of list){if(o===skip)continue;const[w,h]=isz(o);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const X=o.gx+x,Y=o.gy+y;if(X>=0&&Y>=0&&X<W&&Y<H)g[Y*W+X]=1;}}return g;}
function fitsAt(list,W,H,it,x,y,skip){const[w,h]=isz(it);if(x<0||y<0||x+w>W||y+h>H)return false;const g=occ(list,W,H,skip);for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(g[(y+j)*W+x+i])return false;return true;}
function findSpot(list,W,H,it){const[w,h]=isz(it);const g=occ(list,W,H);for(let x=0;x<=W-w;x++)for(let y=0;y<=H-h;y++){let ok=true;for(let j=0;j<h&&ok;j++)for(let i=0;i<w;i++)if(g[(y+j)*W+x+i]){ok=false;break;}if(ok)return[x,y];}return null;}
function addTo(list,W,H,it){const s=findSpot(list,W,H,it);if(!s)return false;it.gx=s[0];it.gy=s[1];list.push(it);return true;}
function bagAdd(it){return addTo(p.bag,INV_W,INV_H,it);}
function bagFits(it){return!!findSpot(p.bag,INV_W,INV_H,it);}
function sortGrid(list,W,H){const old=list.map(o=>[o,o.gx,o.gy]);const items=list.splice(0);
  items.sort((a,b)=>{const A=isz(a),B=isz(b);return B[1]-A[1]||B[0]-A[0]||b.rar-a.rar||b.ilvl-a.ilvl;});
  for(const it of items)if(!addTo(list,W,H,it)){list.length=0;for(const[o,x,y]of old){o.gx=x;o.gy=y;list.push(o);}return false;}return true;}
function fixGrid(list,W,H){const items=list.splice(0);const lost=[];for(const it of items){normItem(it);if(it.gx!=null&&fitsAt(list,W,H,it,it.gx,it.gy))list.push(it);else lost.push(it);}for(const it of lost)if(!addTo(list,W,H,it))return lost.filter(o=>!list.includes(o));return[];}
/* v5.48 : arme de rechange. Une seconde arme rangée à part, qu’on échange d’un bouton (⇄ ou X). Elle ne compte pas dans les bonus tant qu’elle est rangée. */
/* v5.82 : filtre de butin à trois niveaux */
/* v6.48 : fenêtre « Au sol ». Repliée : le nombre d’objets proches ; touchée : la liste, et on touche un objet pour aller le prendre. Respecte le filtre de butin. */
function groundUI(force){const el=document.getElementById('ground');if(!el)return;const z=S.cur;
  if(!force&&S.t-(S.gT||0)<.25)return;S.gT=S.t;
  const L=(!z||z.id==='town'&&false||p.autoPick||p.dead)?[]:z.items.filter(o=>o.kind==='item'&&o.it&&!o.dropped&&!lootSkip(o.it)&&Math.hypot(o.x-p.x,o.y-p.y)<7).sort((a,b)=>(b.it.rar|0)-(a.it.rar|0)||Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y)).slice(0,12);
  const sig=(S.gOpen?'o':'c')+L.map(o=>o.it.id).join(',');if(sig===S.gSig&&!force)return;S.gSig=sig;S.gList=L;
  if(!L.length){el.classList.add('hidden');el.innerHTML='';S.gOpen=false;return;}
  el.classList.remove('hidden');
  el.innerHTML=`<button class="gchip" data-a="gopen">${S.gOpen?'▾':'▸'} Au sol : ${L.length} objet${L.length>1?'s':''}</button>`+(S.gOpen?`<div class="glist">${L.map((o,i)=>`<button data-a="gtake" data-i="${i}" style="color:${itemCol(o.it)}">${o.it.name}</button>`).join('')}</div>`:'');groundPos(el);}
/* v6.52 : la fenêtre « Au sol » se pose juste au-dessus de la bulle de mana, collée à son bord droit ; si les boutons du bas débordent à côté, elle monte juste au-dessus d’eux. La liste s’ouvre vers le haut. */
function groundPos(el){el=el||document.getElementById('ground');if(!el)return;const mp=document.querySelector('#bottom .orb.mp');if(!mp)return;const r=mp.getBoundingClientRect();if(!r.width)return;
  const right=Math.max(6,Math.round(innerWidth-r.right));el.style.right=right+'px';el.style.left='auto';el.style.top='auto';
  const ch=el.querySelector('.gchip'),w=ch?ch.offsetWidth:150;let top=r.top;const mid=document.getElementById('mid');
  if(mid){const m=mid.getBoundingClientRect();if(m.width&&r.right-w<m.right-2&&m.top<top)top=m.top;}
  el.style.bottom=Math.max(0,Math.round(innerHeight-top+8))+'px';}
function lootSkip(it){const f=p.lootF??(p.skipWhite?1:0);if(!it||it.set||it.uniq||it.rar===3)return false;return f>=1&&it.rar===0||f>=2&&it.rar===1;}
function swapWeapon(){if(!p.alt||p.dead)return false;if((p.swapCd||0)>0)return false;const w=p.eq.weapon||null;p.eq.weapon=p.alt;p.alt=w;recalc();p.swapCd=.8;p.cd=Math.max(p.cd||0,.25);toast('Arme : '+p.eq.weapon.name);sfx('hit');swapBtn();return true;}
function swapBtn(){const b=document.getElementById('swapb');if(b)b.classList.toggle('hidden',!p.alt);}
function setAlt(it){const i=p.bag.indexOf(it);if(i<0||it.slot!=='weapon')return false;p.bag.splice(i,1);const old=p.alt||null;p.alt=it;if(old&&!bagAdd(old)){p.bag.push(it);p.alt=old;say('Ton sac est plein.');return false;}swapBtn();return true;}
function altToBag(){if(!p.alt)return false;if(!bagAdd(p.alt)){say('Ton sac est plein.');return false;}p.alt=null;swapBtn();return true;}
function slotAccepts(sl,it){return it.slot===sl||(it.slot==='ring'&&(sl==='ring1'||sl==='ring2'));}
function equipItem(it,slot){const sl=slot||eqSlotFor(it);if(!slotAccepts(sl,it))return false;const i=p.bag.indexOf(it),ox=it.gx,oy=it.gy,old=p.eq[sl];
  if(i>=0)p.bag.splice(i,1);
  if(old){if(fitsAt(p.bag,INV_W,INV_H,old,ox,oy)){old.gx=ox;old.gy=oy;p.bag.push(old);}else if(!bagAdd(old)){if(i>=0)p.bag.push(it);say('Pas de place pour l’objet retiré.');return false;}}
  p.eq[sl]=it;recalc();return true;}
function unequip(sl,x,y){const it=p.eq[sl];if(!it)return false;if(x!=null&&fitsAt(p.bag,INV_W,INV_H,it,x,y)){it.gx=x;it.gy=y;p.bag.push(it);}else if(!bagAdd(it)){say('Inventaire plein.');return false;}p.eq[sl]=null;recalc();return true;}
function equip(i){return equipItem(p.bag[i]);}
