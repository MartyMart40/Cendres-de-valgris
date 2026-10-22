'use strict';
/* ---------- Grilles d’inventaire et de coffre ---------- */
const INV_W=12,INV_H=5,ST_W=12,ST_H=8,ST_TABS=4;
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
function slotAccepts(sl,it){return it.slot===sl||(it.slot==='ring'&&(sl==='ring1'||sl==='ring2'));}
function equipItem(it,slot){const sl=slot||eqSlotFor(it);if(!slotAccepts(sl,it))return false;const i=p.bag.indexOf(it),ox=it.gx,oy=it.gy,old=p.eq[sl];
  if(i>=0)p.bag.splice(i,1);
  if(old){if(fitsAt(p.bag,INV_W,INV_H,old,ox,oy)){old.gx=ox;old.gy=oy;p.bag.push(old);}else if(!bagAdd(old)){if(i>=0)p.bag.push(it);say('Pas de place pour l’objet retiré.');return false;}}
  p.eq[sl]=it;recalc();return true;}
function unequip(sl,x,y){const it=p.eq[sl];if(!it)return false;if(x!=null&&fitsAt(p.bag,INV_W,INV_H,it,x,y)){it.gx=x;it.gy=y;p.bag.push(it);}else if(!bagAdd(it)){say('Inventaire plein.');return false;}p.eq[sl]=null;recalc();return true;}
function equip(i){return equipItem(p.bag[i]);}
