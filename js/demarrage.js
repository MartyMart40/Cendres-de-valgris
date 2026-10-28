'use strict';
/* ---------- Boucle ---------- */
let last=performance.now(),hudT=0,saveT=0;
/* v5.84 : qualité adaptative. Si une image coûte plus de 22 ms pendant 5 s en graphismes hauts, on passe en normaux (une fois par partie, réglable dans les Stats). */
let GW={ema:0,slow:0,done:false};
function gfxWatch(ms,dt){if(!p||p.eco||S.paused||GW.done||p.gfx===1)return;GW.ema=GW.ema*.92+ms*.08;if(GW.ema>22)GW.slow+=dt;else GW.slow=Math.max(0,GW.slow-dt*.5);
  if(GW.slow>5){GW.done=true;p.gfx=1;save();toast('Graphismes passés en normaux pour rester fluide');say('Le jeu ralentissait : graphismes normaux. Tu peux revenir en hauts dans les Stats.');}}
function loop(now){
  if(p&&p.eco&&now-last<30){requestAnimationFrame(loop);return;}
  const dt=Math.min(.05,(now-last)/1000);last=now;
  if(S){
    const w0=performance.now();
    if(!S.paused){S.playT=(S.playT||0)+dt;if(ptr){ptr.t-=dt;if(ptr.t<=0){ptr.t=.2;primary(lastPtr.x,lastPtr.y,false);}}if(S.hitstop>0){S.hitstop-=dt;update(dt*.12);}else update(dt);}
    render();gfxWatch(performance.now()-w0,dt);hudT-=dt;if(hudT<=0){hudT=.1;hud();}
    saveT+=dt;if(saveT>20){saveT=0;save();}
  }else{ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#0b0907';ctx.fillRect(0,0,cv.width,cv.height);}
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
const sv=loadSave();if(sv)$('#bCont').classList.remove('hidden');try{const M=mutation();$('#mutline').textContent=`Cette semaine : ${M.n}. ${M.d}`;}catch(e){}
/* v6.17 : la page publiée bloque les boîtes du navigateur (confirm répondait « non » tout seul) : la question est posée dans le jeu.
   L’ancienne partie est gardée de côté ; on peut la reprendre dans Réglages, Copie de secours. */
const SAVE_PREV=SAVE+'-avant';
$('#bNew').addEventListener('click',()=>{const v=loadSave();if(!v){startGame(null);return;}
  $('#newConfT').textContent=`Ta partie actuelle (niveau ${(v.p&&v.p.lvl)||1}, monde ${v.world||1}) sera remplacée. Elle est gardée de côté : tu pourras la reprendre dans Réglages, Copie de secours.`;$('#newConf').classList.remove('hidden');});
$('#bNewNo').addEventListener('click',()=>$('#newConf').classList.add('hidden'));
$('#bNewYes').addEventListener('click',()=>{try{const raw=localStorage.getItem(SAVE);if(raw)localStorage.setItem(SAVE_PREV,raw);}catch(e){}$('#newConf').classList.add('hidden');startGame(null);save();});
$('#bCont').addEventListener('click',()=>startGame(loadSave()));
