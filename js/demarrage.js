'use strict';
/* ---------- Boucle ---------- */
let last=performance.now(),hudT=0,saveT=0;
function loop(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  if(S){
    if(!S.paused){if(ptr){ptr.t-=dt;if(ptr.t<=0){ptr.t=.2;primary(lastPtr.x,lastPtr.y,false);}}update(dt);}
    render();hudT-=dt;if(hudT<=0){hudT=.1;hud();}
    saveT+=dt;if(saveT>20){saveT=0;save();}
  }else{ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#0b0907';ctx.fillRect(0,0,cv.width,cv.height);}
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
const sv=loadSave();if(sv)$('#bCont').classList.remove('hidden');
$('#bNew').addEventListener('click',()=>{if(loadSave()&&!confirm('Effacer ta partie actuelle et recommencer ?'))return;startGame(null);});
$('#bCont').addEventListener('click',()=>startGame(loadSave()));
