'use strict';
/* ---------- Effets ---------- */
function floatText(x,y,t,col){S.fx.push({x,y,t,col,life:1});}
function burst(x,y,col,n){for(let i=0;i<n;i++){const a=rnd(0,6.28),s=rnd(1,4);S.parts.push({x,y,z:.5,vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:rnd(1,4),life:rnd(.4,.9),col});}}
let toastT=0;function toast(t){t=fixN(t);const el=$('#toast');el.textContent=t;el.style.opacity=1;clearTimeout(toastT);toastT=setTimeout(()=>el.style.opacity=0,2200);}
let sayT=0;function say(t){t=fixN(t);const el=$('#msg');el.textContent=t;clearTimeout(sayT);sayT=setTimeout(()=>el.textContent='',3200);}

