'use strict';
/* ---------- Icônes d’objets ---------- */
const ICONS=new Map();
function iconURL(it){const key=`${it.type}|${tierOf(it)}|${it.rar}|${it.leg||''}`;if(ICONS.has(key))return ICONS.get(key);
  let url='';try{const[w,h]=isz(it),cs=48;const cvs=document.createElement('canvas');cvs.width=w*cs;cvs.height=h*cs;const c=cvs.getContext('2d');drawIcon(c,it,w*cs,h*cs);url=cvs.toDataURL?cvs.toDataURL('image/png'):'';}catch(e){url='';}
  ICONS.set(key,url);return url;}
function drawIcon(c,it,W,H){
  const to=tierOf(it),M=MET[to],ty=it.type,cx=W/2,leg=it.rar===3;const u=Math.min(W,H)/48;
  const G_=(y0,y1,a,b)=>hg(c,y0,y1,a,b);
  if(leg||to===4){c.shadowColor=leg?'#ff9a3a':'#ffc060';c.shadowBlur=10*u;}
  c.lineCap='round';c.lineJoin='round';
  if(ty==='sword'||ty==='dagger'){const top=H*.05,gy=H*(ty==='dagger'?.6:.68),bw=W*(ty==='dagger'?.2:.17+to*.015);
    const bc=to===0?['#9a8070','#5a4636']:to===4?['#fff0c0','#c09040']:[M.l,M.d];
    c.fillStyle=G_(top,gy,bc[0],bc[1]);c.beginPath();c.moveTo(cx,top);c.lineTo(cx+bw/2,top+bw);c.lineTo(cx+bw/2,gy);c.lineTo(cx-bw/2,gy);c.lineTo(cx-bw/2,top+bw);c.closePath();c.fill();
    c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1*u;c.beginPath();c.moveTo(cx,top+bw);c.lineTo(cx,gy-2*u);c.stroke();
    if(to===0){c.fillStyle='rgba(120,60,20,.55)';for(let k=0;k<5;k++){c.beginPath();c.arc(cx+(Math.sin(k*7)*.3)*bw,top+bw+(gy-top-bw)*(k/5+.1),1.8*u,0,7);c.fill();}}
    c.fillStyle=to>=3?M.t:'#7a6a5a';c.fillRect(cx-W*(.28+to*.04),gy,W*(.56+to*.08),H*.04+2*u);
    c.fillStyle=to>=3?'#3a1a10':'#4a3020';c.fillRect(cx-W*.07,gy+H*.04,W*.14,H*(ty==='dagger'?.22:.17));
    c.fillStyle=to>=3?M.t:'#7a6a5a';c.beginPath();c.arc(cx,H*(ty==='dagger'?.9:.92),W*.1,0,7);c.fill();}
  else if(ty==='mace'){c.fillStyle='#4a3020';c.fillRect(cx-W*.08,H*.3,W*.16,H*.62);c.fillStyle=to>=3?M.t:'#6a5a4a';c.fillRect(cx-W*.12,H*.88,W*.24,H*.05);
    const r=W*(.28+to*.02);c.fillStyle=to===0?G_(H*.05,H*.35,'#7a5a40','#3e2814'):G_(H*.05,H*.35,M.l,M.d);c.beginPath();c.arc(cx,H*.2,r,0,7);c.fill();
    c.fillStyle=to===0?'#8a8a86':M.l;for(let k=0;k<(to===0?5:8);k++){const a=k/(to===0?5:8)*6.28;c.beginPath();c.moveTo(cx+Math.cos(a)*r*.8,H*.2+Math.sin(a)*r*.8);c.lineTo(cx+Math.cos(a)*r*1.3,H*.2+Math.sin(a)*r*1.3);c.lineTo(cx+Math.cos(a+.3)*r*.8,H*.2+Math.sin(a+.3)*r*.8);c.fill();}}
  else if(ty==='axe'){c.fillStyle='#5a3e24';c.fillRect(W*.55,H*.05,W*.09,H*.9);c.fillStyle=to>=3?M.t:'#6a5a4a';c.fillRect(W*.53,H*.88,W*.13,H*.05);
    c.fillStyle=to===0?G_(0,H*.45,'#9a8070','#5a4636'):G_(0,H*.45,M.l,M.d);c.beginPath();c.moveTo(W*.58,H*.1);c.quadraticCurveTo(W*.02,H*.02,W*.08,H*.28+to*H*.02);c.quadraticCurveTo(W*.2,H*.42,W*.58,H*.36);c.closePath();c.fill();
    if(to>=3){c.strokeStyle=M.t;c.lineWidth=2*u;c.stroke();}if(to>=2){c.beginPath();c.moveTo(W*.64,H*.12);c.quadraticCurveTo(W*.9,H*.2,W*.64,H*.3);c.closePath();c.fill();}}
  else if(ty==='staff'){c.fillStyle=to>=3?G_(0,H,'#5a4a66','#241a2c'):'#7a5a3a';c.fillRect(cx-W*.1,H*.12,W*.2,H*.86);c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=1.5*u;for(let k=0;k<4;k++){c.beginPath();c.moveTo(cx-W*.1,H*(.3+k*.15));c.lineTo(cx+W*.1,H*(.33+k*.15));c.stroke();}
    if(to>=1){c.strokeStyle=to>=3?M.t:'#8a8e96';c.lineWidth=3*u;c.beginPath();c.moveTo(cx-W*.3,H*.04);c.quadraticCurveTo(cx,H*.2,cx+W*.3,H*.04);c.stroke();}
    c.shadowColor=GEMC[to];c.shadowBlur=14*u;c.fillStyle=GEMC[to];c.beginPath();c.arc(cx,H*.08,W*(.2+to*.03),0,7);c.fill();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.arc(cx-W*.06,H*.06,W*.06,0,7);c.fill();}
  else if(ty==='shield'){const w=W*.4,h=H*.44,cy=H*.48;
    if(to<=1){c.fillStyle=G_(cy-h,cy+h,'#9a6a40','#4a2c14');c.beginPath();c.arc(cx,cy,w,0,7);c.fill();c.strokeStyle='#3a2410';c.lineWidth=2*u;for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(cx-w*.9,cy+k*w*.35);c.lineTo(cx+w*.9,cy+k*w*.35);c.stroke();}
      if(to===1){c.strokeStyle=M.l;c.lineWidth=4*u;c.beginPath();c.arc(cx,cy,w,0,7);c.stroke();c.fillStyle=M.l;c.beginPath();c.arc(cx,cy,w*.25,0,7);c.fill();}}
    else{c.fillStyle=to===4?G_(cy-h,cy+h,'#4a4456','#141218'):G_(cy-h,cy+h,M.l,M.d);c.beginPath();c.moveTo(cx-w,cy-h*.8);c.lineTo(cx+w,cy-h*.8);c.lineTo(cx+w,cy);c.quadraticCurveTo(cx+w*.7,cy+h*.7,cx,cy+h);c.quadraticCurveTo(cx-w*.7,cy+h*.7,cx-w,cy);c.closePath();c.fill();c.strokeStyle=to>=3?M.t:M.d;c.lineWidth=3*u;c.stroke();
      if(to===3){c.fillStyle='#9a2420';c.fillRect(cx-w*.6,cy-h*.55,w*1.2,h*.9);c.fillStyle=M.t;c.fillRect(cx-2*u,cy-h*.55,4*u,h*1.1);c.fillRect(cx-w*.55,cy-h*.15,w*1.1,4*u);}
      if(to===4){c.shadowColor='#ffa030';c.shadowBlur=14*u;c.fillStyle='#ffc060';c.beginPath();c.arc(cx,cy-h*.1,w*.3,0,7);c.fill();}}}
  else if(ty==='orb'){const g=c.createRadialGradient(cx-W*.1,H*.4,2*u,cx,H*.5,W*.38);g.addColorStop(0,'#fff');g.addColorStop(.3,GEMC[to]);g.addColorStop(1,'rgba(20,20,40,.9)');c.shadowColor=GEMC[to];c.shadowBlur=12*u;c.fillStyle=g;c.beginPath();c.arc(cx,H*.5,W*.36,0,7);c.fill();}
  else if(ty==='helm'){const cy=H*.55,r=W*.34;
    if(to===0){c.fillStyle=G_(H*.1,H*.9,'#9a6a40','#4a2c14');c.beginPath();c.arc(cx,cy,r,Math.PI,0);c.lineTo(cx+r,H*.92);c.lineTo(cx+r*.55,H*.92);c.lineTo(cx+r*.55,cy);c.lineTo(cx-r*.55,cy);c.lineTo(cx-r*.55,H*.92);c.lineTo(cx-r,H*.92);c.closePath();c.fill();}
    else if(to===1){c.fillStyle=G_(H*.2,cy,M.l,M.d);c.beginPath();c.arc(cx,cy,r,Math.PI,0);c.fill();c.fillStyle=M.m;c.beginPath();c.ellipse(cx,cy,r*1.45,H*.08,0,0,7);c.fill();}
    else if(to===2){c.fillStyle=G_(H*.15,H*.9,M.l,M.d);c.beginPath();c.arc(cx,cy,r,Math.PI,0);c.lineTo(cx+r,H*.88);c.lineTo(cx+r*.6,H*.88);c.lineTo(cx+r*.6,cy+H*.05);c.lineTo(cx-r*.6,cy+H*.05);c.lineTo(cx-r*.6,H*.88);c.lineTo(cx-r,H*.88);c.closePath();c.fill();c.fillStyle=M.d;c.fillRect(cx-2.5*u,cy-H*.05,5*u,H*.33);}
    else{c.fillStyle=G_(H*.1,H*.92,M.l,M.d);c.beginPath();c.moveTo(cx-r,H*.92);c.lineTo(cx-r,H*.4);c.quadraticCurveTo(cx,H*.05,cx+r,H*.4);c.lineTo(cx+r,H*.92);c.closePath();c.fill();
      c.fillStyle=to===4?'#ffb040':'#101216';if(to===4){c.shadowColor='#ffa030';c.shadowBlur=10*u;}c.fillRect(cx-r*.75,H*.5,r*1.5,H*.07);c.shadowBlur=0;c.fillStyle=M.t;c.fillRect(cx-2*u,H*.2,4*u,H*.68);
      if(to===3){c.fillStyle='#b02a22';c.beginPath();c.moveTo(cx,H*.18);c.quadraticCurveTo(cx+W*.4,H*.02,cx+W*.46,H*.3);c.quadraticCurveTo(cx+W*.2,H*.12,cx,H*.24);c.fill();}
      if(to===4){c.fillStyle=G_(0,H*.5,'#fff0c0','#c09030');for(const k of[-1,1]){c.beginPath();c.moveTo(cx+k*r,H*.45);c.lineTo(cx+k*W*.49,H*.06);c.lineTo(cx+k*W*.4,H*.3);c.lineTo(cx+k*W*.47,H*.28);c.lineTo(cx+k*r,H*.6);c.closePath();c.fill();}}}}
  else if(ty==='armor'){const top=H*.08,bot=H*.95;const body=[[cx-W*.3,top+H*.04],[cx+W*.3,top+H*.04],[cx+W*.27,bot],[cx-W*.27,bot]];
    const fill=to===0?G_(top,bot,'#a8744a','#4a2c14'):to===1?G_(top,bot,'#a8acb2','#3a3c40'):G_(top,bot,to===4?'#5a5466':M.l,M.d);
    c.fillStyle=fill;c.beginPath();c.moveTo(...body[0]);for(const q of body.slice(1))c.lineTo(...q);c.closePath();c.fill();
    c.beginPath();c.moveTo(cx-W*.3,top+H*.04);c.lineTo(cx-W*.46,top+H*.3);c.lineTo(cx-W*.34,top+H*.36);c.lineTo(cx-W*.26,top+H*.2);c.closePath();c.moveTo(cx+W*.3,top+H*.04);c.lineTo(cx+W*.46,top+H*.3);c.lineTo(cx+W*.34,top+H*.36);c.lineTo(cx+W*.26,top+H*.2);c.closePath();c.fill();
    c.fillStyle='#120c08';c.beginPath();c.ellipse(cx,top+H*.04,W*.11,H*.035,0,0,7);c.fill();
    if(to===0){c.strokeStyle='#2a1a0c';c.lineWidth=2*u;c.beginPath();for(let k=0;k<4;k++){c.moveTo(cx-5*u,H*(.2+k*.08));c.lineTo(cx+5*u,H*(.24+k*.08));c.moveTo(cx+5*u,H*(.2+k*.08));c.lineTo(cx-5*u,H*(.24+k*.08));}c.stroke();}
    if(to===1){c.fillStyle='rgba(30,32,36,.5)';for(let y=top+8*u;y<bot-4*u;y+=5*u)for(let x=cx-W*.26+((y/5|0)%2)*2.5*u;x<cx+W*.26;x+=5*u)c.fillRect(x,y,2.4*u,2.4*u);c.fillStyle='#6a3a22';c.fillRect(cx-W*.1,top+H*.18,W*.2,H*.75);}
    if(to>=2){c.strokeStyle=to>=3?M.t:'rgba(0,0,0,.4)';c.lineWidth=2*u;c.beginPath();c.moveTo(cx,top+H*.1);c.lineTo(cx,H*.6);c.moveTo(cx-W*.27,H*.62);c.lineTo(cx+W*.27,H*.62);c.moveTo(cx-W*.27,H*.75);c.lineTo(cx+W*.27,H*.75);c.stroke();}
    if(to===3){c.fillStyle='#8a1e18';c.fillRect(cx-W*.1,H*.62,W*.2,H*.32);c.fillStyle=M.t;c.fillRect(cx-1.5*u,H*.66,3*u,H*.2);}
    if(to===4){c.shadowColor='#ffa030';c.shadowBlur=10*u;c.fillStyle='#ffc060';c.beginPath();c.arc(cx,H*.35,4*u,0,7);c.fill();c.strokeStyle='#ffb040';c.lineWidth=1.5*u;c.beginPath();c.moveTo(cx-W*.2,H*.2);c.lineTo(cx-5*u,H*.32);c.moveTo(cx+W*.2,H*.2);c.lineTo(cx+5*u,H*.32);c.stroke();}}
  else if(ty==='gloves'||ty==='boots'){for(const k of[-1,1]){const ox=cx+k*W*.22;
      const f=to===0?G_(0,H,'#9a6a40','#4a2c14'):G_(0,H,to===4?'#5a5466':M.l,M.d);c.fillStyle=f;
      if(ty==='gloves'){c.beginPath();c.moveTo(ox-W*.14,H*.95);c.lineTo(ox-W*.15,H*.4);c.quadraticCurveTo(ox-W*.15,H*.08,ox,H*.08);c.quadraticCurveTo(ox+W*.15,H*.08,ox+W*.15,H*.4);c.lineTo(ox+W*.14,H*.95);c.closePath();c.fill();
        c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=1.5*u;for(let j=-1;j<=1;j++){c.beginPath();c.moveTo(ox+j*W*.05,H*.1);c.lineTo(ox+j*W*.05,H*.35);c.stroke();}
        c.fillStyle=to>=3?M.t:'rgba(0,0,0,.25)';c.fillRect(ox-W*.15,H*.62,W*.3,H*.08);}
      else{c.beginPath();c.moveTo(ox-W*.12,H*.05);c.lineTo(ox+W*.1,H*.05);c.lineTo(ox+W*.1,H*.7);c.lineTo(ox+k*W*.2+W*.04,H*.78);c.lineTo(ox+k*W*.2+W*.04,H*.95);c.lineTo(ox-W*.14,H*.95);c.closePath();c.fill();
        c.fillStyle=to>=3?M.t:'rgba(0,0,0,.3)';c.fillRect(ox-W*.12,H*.05,W*.22,H*.08);if(to>=2){c.beginPath();c.arc(ox,H*.38,W*.06,0,7);c.fill();}}}}
  else if(ty==='belt'){c.fillStyle=to===0?'#7a6a40':to===1?'#5a3e22':to>=3?'#2a1c12':'#3a3a40';c.fillRect(W*.04,H*.3,W*.92,H*.4);
    if(to>=1){c.fillStyle=to>=3?'#e8c060':'#a8acb2';for(let k=0;k<6;k++){c.beginPath();c.arc(W*(.1+k*.16),H*.5,2.5*u,0,7);c.fill();}}
    c.fillStyle=to>=3?'#f2c64a':to===2?'#c8ccd2':'#a08040';c.fillRect(cx-W*.1,H*.15,W*.2,H*.7);c.fillStyle='rgba(0,0,0,.5)';c.fillRect(cx-W*.05,H*.3,W*.1,H*.4);}
  else if(ty==='amulet'){c.strokeStyle=to>=3?'#e8c060':to===2?'#d8dce2':'#9a7a50';c.lineWidth=2*u;c.beginPath();c.arc(cx,H*.3,W*.3,.2,Math.PI-.2);c.stroke();
    c.fillStyle=to>=3?'#e8c060':'#a8acb2';c.beginPath();c.moveTo(cx,H*.5);c.lineTo(cx+W*.17,H*.68);c.lineTo(cx,H*.92);c.lineTo(cx-W*.17,H*.68);c.closePath();c.fill();
    c.shadowColor=RCOL[it.rar];c.shadowBlur=8*u;c.fillStyle=it.rar===0?'#8a8a80':RCOL[it.rar];c.beginPath();c.arc(cx,H*.7,W*.09,0,7);c.fill();}
  else if(ty==='ring'){c.strokeStyle=to>=3?'#e8c060':to===2?'#d8dce2':to===1?'#c08050':'#8a8a86';c.lineWidth=5*u;c.beginPath();c.ellipse(cx,H*.6,W*.26,H*.22,0,0,7);c.stroke();
    c.shadowColor=RCOL[it.rar];c.shadowBlur=8*u;c.fillStyle=it.rar===0?'#8a8a80':RCOL[it.rar];c.beginPath();c.arc(cx,H*.34,W*.13,0,7);c.fill();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.arc(cx-W*.04,H*.3,W*.04,0,7);c.fill();}
  c.shadowBlur=0;
}
