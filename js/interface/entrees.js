'use strict';
/* ---------- Entrées ---------- */
let ptr=null,lastPtr={x:0,y:0};
function pickAt(px,py){
  const b=S.portalBtn,pn=b&&portalNear(S.cur);if(pn&&px>=b.x0&&px<=b.x1&&py>=b.y0&&py<=b.y1)return{portal:pn};
  for(const l of S.labels)if(px>=l.x0&&px<=l.x1&&py>=l.y0&&py<=l.y1)return{item:l.it};
  let best=null,bd=26*Z;for(const m of S.cur.mons){if(m.dead)continue;const[sx,sy]=scr(m.x,m.y);const d=Math.hypot(px-sx,py-(sy-20*Z*m.size));if(d<bd+m.size*6){bd=d;best=m;}}
  if(best)return{mon:best};
  // Le portail ne réagit qu'à un toucher sur son ovale lumineux : à côté, on marche simplement
  for(const po of portalsIn(S.cur)){const[sx,sy]=scr(po.x,po.y);if(((px-sx)/(16*Z))**2+((py-sy+26*Z)/(27*Z))**2<1)return{obj:po};}
  for(const o of S.cur.objs){if(o.type==='fire'||(o.type==='rift'&&!riftOpen()))continue;const[sx,sy]=scr(o.x,o.y);const top=o.type==='npc'?72*Z:o.type==='wp'?16*Z:o.type==='chest'?30*Z:o.type==='stash'?40*Z:o.type==='rift'?70*Z:54*Z;if(Math.abs(px-sx)<(o.type==='wp'?30:24)*Z&&py>sy-top&&py<sy+14*Z)return{obj:o};}
  return null;
}
function moveTo(wx,wy){const z=S.cur;const f=nearFloor(z,wx,wy);if(!f)return;S.mark={x:wx,y:wy,t:.5};p.target=null;p.targetObj=null;p.path=pathTo(z,Math.floor(p.x),Math.floor(p.y),f[0],f[1]);}
function primary(px,py,first){if(S&&S.cine)return;
  if(p.dead||S.paused)return;const h=pickAt(px,py);const[wx,wy]=wld(px,py);
  if(first&&h&&h.portal){interact(h.portal);return;}
  if(h&&h.mon){if(S.cur.id!=='town'){p.target=h.mon;p.targetObj=null;}return;}
  if(!first&&(p.target||p.targetObj))return;
  if(first&&h&&h.obj){p.target=null;p.targetObj=h.obj;const z=S.cur;p.path=pathTo(z,Math.floor(p.x),Math.floor(p.y),Math.floor(h.obj.x),Math.floor(h.obj.y))||pathTo(z,Math.floor(p.x),Math.floor(p.y),...(nearFloor(z,h.obj.x+1,h.obj.y)||[0,0]));return;}
  if(h&&h.item){moveTo(h.item.x,h.item.y);return;}
  if(p.target&&!first)return;moveTo(wx,wy);
}
function useSlot(k,tx,ty){const id=p.bar[k];if(!id){menuPanel('comp');return;}castSkill(id,tx,ty);}
cv.addEventListener('pointerdown',e=>{
  audioInit();if(!S||S.paused)return;e.preventDefault();lastPtr={x:e.clientX,y:e.clientY};
  if(e.button===2){const[wx,wy]=wld(e.clientX,e.clientY);useSlot(0,wx,wy);return;}
  ptr={id:e.pointerId,t:.3};cv.setPointerCapture(e.pointerId);primary(e.clientX,e.clientY,true);
});
cv.addEventListener('pointermove',e=>{lastPtr={x:e.clientX,y:e.clientY};if(!S)return;if(e.pointerType==='mouse'){const h=pickAt(e.clientX,e.clientY);hoverMon=h&&h.mon||null;cv.style.cursor=h?'pointer':'default';}});
const endPtr=()=>{ptr=null;};cv.addEventListener('pointerup',endPtr);cv.addEventListener('pointercancel',endPtr);
cv.addEventListener('contextmenu',e=>e.preventDefault());
$('#btns').addEventListener('click',e=>{audioInit();const b=e.target.closest('button');if(!b||!S||S.paused||p.dead)return;const k=b.dataset.b;
  if(k[0]==='s')useSlot(+k[1]);else if(k==='pot')drink();else if(k==='tp')useScroll();else if(k==='menu')menuPanel();});
addEventListener('keydown',e=>{if(!S)return;const k=e.key.toLowerCase();
  if(k==='escape'){closePanel();return;}
  const open=!panel.classList.contains('hidden');const pan={i:'inv',k:'comp',j:'quetes',c:'perso'}[k];
  if(pan){if(open&&tab===pan&&(pan!=='inv'||invMode==='inv'))closePanel();else menuPanel(pan);return;}
  if(S.paused)return;const[wx,wy]=wld(lastPtr.x,lastPtr.y);const mouse=matchMedia('(pointer:fine)').matches;
  const slot={'1':0,'2':1,'3':2,'4':3,a:0,q:0,z:1,w:1,e:2,f:3}[k];if(slot!=null){useSlot(slot,mouse?wx:undefined,mouse?wy:undefined);return;}
  if(k==='r')drink();else if(k==='t')useScroll();else if(k==='enter'){const po=portalNear(S.cur);if(po)interact(po);}});

