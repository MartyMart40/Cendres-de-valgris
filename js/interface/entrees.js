'use strict';
/* ---------- Entrées ---------- */
let ptr=null,lastPtr={x:0,y:0};
function pickAt(px,py){
  for(const l of S.labels)if(px>=l.x0&&px<=l.x1&&py>=l.y0&&py<=l.y1)return{item:l.it};
  let best=null,bd=26*Z;for(const m of S.cur.mons){if(m.dead||m.hid>0)continue;const[sx,sy]=scr(m.x,m.y);const d=Math.hypot(px-sx,py-(sy-20*Z*m.size));if(d<bd+m.size*6){bd=d;best=m;}}
  if(best)return{mon:best};
  for(const o of S.cur.objs.concat(portalsIn(S.cur))){if(o.type==='fire'||(o.type==='rift'&&!riftOpen()))continue;const[sx,sy]=scr(o.x,o.y);
    if(o.dest){if(Math.abs(px-sx)<17*Z&&py>sy-52*Z&&py<sy+6*Z)return{obj:o};continue;}const top=o.type==='npc'?72*Z:o.type==='wp'?16*Z:o.type==='chest'?30*Z:o.type==='relic'?60*Z:o.type==='traveler'?60*Z:o.type==='board'?40*Z:o.type==='cchest'?30*Z:o.type==='altar'?44*Z:o.type==='gibbet'?80*Z:o.type==='urn'?22*Z:o.type==='corpse'?14*Z:o.type==='lever'?24*Z:o.type==='keg'?26*Z:o.type==='shrine'?60*Z:o.type==='cage'?56*Z:o.type==='fgrave'?30*Z:o.type==='peddler'?60*Z:o.type==='well'?34*Z:o.type==='stash'?40*Z:o.type==='rift'?70*Z:54*Z;if(Math.abs(px-sx)<(o.type==='wp'?30:24)*Z&&py>sy-top&&py<sy+14*Z)return{obj:o};}
  return null;
}
function moveTo(wx,wy){const z=S.cur;const f=nearFloor(z,wx,wy);if(!f)return;S.mark={x:wx,y:wy,t:.5};p.goal={x:wx,y:wy};p.target=null;p.targetObj=null;p.path=pathTo(z,Math.floor(p.x),Math.floor(p.y),f[0],f[1]);}
function primary(px,py,first){if(S&&S.cine)return;
  if(p.dead||S.paused)return;const h=pickAt(px,py);const[wx,wy]=wld(px,py);
  if(h&&h.mon){if(S.cur.id!=='town'){p.target=h.mon;p.targetObj=null;p.goal=null;}return;}
  if(!first&&(p.target||p.targetObj))return;
  if(first&&h&&h.obj){p.target=null;p.targetObj=h.obj;const z=S.cur;p.path=pathTo(z,Math.floor(p.x),Math.floor(p.y),Math.floor(h.obj.x),Math.floor(h.obj.y))||pathTo(z,Math.floor(p.x),Math.floor(p.y),...(nearFloor(z,h.obj.x+1,h.obj.y)||[0,0]));return;}
  if(h&&h.item){if(h.item.kind==='item')h.item.forced=true;moveTo(h.item.x,h.item.y);return;}
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
{let zt=0;$('#zmods').addEventListener('click',e=>{e.stopPropagation();const el=$('#zmods');el.classList.toggle('open');clearTimeout(zt);if(el.classList.contains('open'))zt=setTimeout(()=>el.classList.remove('open'),7000);});}
const TIP=$('#sktip');let tipT=0,lpT=0,lpFired=false;
function skTip(b,id,long){const sk=SK[id];if(!sk||!TIP)return;const l=Math.max(1,skLvl(id));
  TIP.innerHTML=`<b>${sk.n}</b>`+(long?`<br>${sk.cost?sk.cost+' mana':'Aucun coût'}${sk.cd?` · recharge ${String(sk.cd).replace('.',',')} s`:''}<br>${sk.d(l)}<br><span style="opacity:.7">Garde le doigt : fiche complète</span>`:'');TIP.classList.toggle('long',!!long);
  const r=b.getBoundingClientRect(),half=Math.min(150,innerWidth*.43);TIP.style.left=clamp(r.left+r.width/2,half+6,innerWidth-half-6)+'px';TIP.style.bottom=(innerHeight-r.top+8)+'px';TIP.style.opacity=1;clearTimeout(tipT);tipT=setTimeout(()=>{TIP.style.opacity=0;},long?3400:1100);}
$('#btns').addEventListener('pointerdown',e=>{const b=e.target.closest('button');lpFired=false;clearTimeout(lpT);if(!b||!S||!p)return;const k=b.dataset.b;if(!k||k==='swap'||k[0]!=='s')return;const id=p.bar[+k[1]];if(!id)return;lpT=setTimeout(()=>{lpFired=true;skTip(b,id,true);lpT=setTimeout(()=>{TIP.style.opacity=0;skFiche(id);},900);},450);});
for(const ev of['pointerup','pointercancel','pointerleave'])$('#btns').addEventListener(ev,()=>clearTimeout(lpT));
$('#btns').addEventListener('contextmenu',e=>e.preventDefault());
$('#btns').addEventListener('click',e=>{audioInit();const b=e.target.closest('button');if(!b||!S||S.paused||p.dead)return;const k=b.dataset.b;
  if(k!=='swap'&&k[0]==='s'&&lpFired){lpFired=false;return;}
  if(k==='swap')swapWeapon();else if(k[0]==='s'){const id=p.bar[+k[1]];if(id)skTip(b,id,false);useSlot(+k[1]);}else if(k==='pot')drink();else if(k==='tp')useScroll();else if(k==='menu')menuPanel('inv');});
addEventListener('keydown',e=>{if(!S)return;if(e.target&&/^(TEXTAREA|INPUT)$/.test(e.target.tagName))return;const k=e.key.toLowerCase();
  if(k==='escape'){closePanel();return;}
  if(k==='x'&&panel.classList.contains('hidden')){swapWeapon();return;}
  const open=!panel.classList.contains('hidden');const pan={i:'inv',k:'comp',j:'quetes',c:'perso'}[k];
  if(pan){if(open&&tab===pan&&(pan!=='inv'||invMode==='inv'))closePanel();else menuPanel(pan);return;}
  if(S.paused)return;const[wx,wy]=wld(lastPtr.x,lastPtr.y);const mouse=matchMedia('(pointer:fine)').matches;
  const slot={'1':0,'2':1,'3':2,'4':3,'5':4,'6':5,a:0,q:0,z:1,w:1,e:2,f:3}[k];if(slot!=null){useSlot(slot,mouse?wx:undefined,mouse?wy:undefined);return;}
  if(k==='r')drink();else if(k==='t')useScroll();});

