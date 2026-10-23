'use strict';
/* ---------- Rendu ---------- */
let SHX=0,SHY=0;
function iso(x,y){return[(x-y)*TW/2*Z,(x+y)*TH/2*Z];}
function scr(x,y){return[(x-y)*TW/2*Z-S.cam.x+W/2+SHX,(x+y)*TH/2*Z-S.cam.y+H/2+SHY];}
function wld(px,py){const a=(px-W/2+S.cam.x-SHX)/(TW/2*Z),b=(py-H/2+S.cam.y-SHY)/(TH/2*Z);return[(a+b)/2,(b-a)/2];}
function dia(g,sx,sy,hw,hh){g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+hw,sy+hh);g.lineTo(sx,sy+2*hh);g.lineTo(sx-hw,sy+hh);g.closePath();}
function diamond(sx,sy){dia(ctx,sx,sy,TW/2*Z,TH/2*Z);}
function shade(c,k){return`rgb(${clamp(c[0]*k,0,255)|0},${clamp(c[1]*k,0,255)|0},${clamp(c[2]*k,0,255)|0})`;}
function poly(pts,fill){ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();}
function vgrad(y0,y1,a,b){const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function crack(g,R,pt,col,lw){let[a,b]=pt;g.strokeStyle=col;g.lineWidth=lw||1;g.beginPath();g.moveTo(a,b);for(let k=0;k<4;k++){a+=(R()-.5)*10*Z;b+=(R()-.5)*5*Z;g.lineTo(a,b);}g.stroke();}
function bakeFloor(z){
  const hw=TW/2*Z,hh=TH/2*Z,ox=(z.h+1)*hw;
  const c=document.createElement('canvas');c.width=Math.ceil((z.w+z.h+2)*hw);c.height=Math.ceil((z.w+z.h+2)*hh);
  const g=c.getContext('2d');const R=rng(z.seed);
  const pt=(sx,sy)=>{const u=R(),v=R();return[sx+(u-v)*hw,sy+(u+v)*hh];};
  for(let y=0;y<z.h;y++)for(let x=0;x<z.w;x++){const i=y*z.w+x;if(z.g[i]===1&&!z.hide[i])continue;
    const sx=ox+(x-y)*hw,sy=(x+y)*hh;
    dia(g,sx,sy,hw,hh);g.fillStyle=z.fc[i];g.fill();
    for(let k=0;k<7;k++){const[a,b]=pt(sx,sy);g.fillStyle=R()<.55?'rgba(0,0,0,.2)':'rgba(255,235,200,.07)';const s=(R()*1.6+.8)*Z;g.fillRect(a,b,s,s);}
    if(z.style==='plain'){
      if(R()<.22){const[a,b]=pt(sx,sy);g.strokeStyle=R()<.5?'#5f5c36':'#4b4a2d';g.lineWidth=1;g.beginPath();for(let k=0;k<4;k++){g.moveTo(a+k*1.5*Z,b);g.lineTo(a+k*1.5*Z+(R()-.5)*4*Z,b-(3+R()*4)*Z);}g.stroke();}
      if(R()<.07)crack(g,R,pt(sx,sy),'rgba(0,0,0,.35)');
      if(R()<.05){const[a,b]=pt(sx,sy);g.fillStyle='#6a6458';g.beginPath();g.ellipse(a,b,2.5*Z,1.6*Z,0,0,7);g.fill();g.fillStyle='rgba(255,255,255,.14)';g.fillRect(a-1,b-1.5,1.5,1);}}
    else if(z.style==='crypt'){
      g.strokeStyle='rgba(0,0,0,.42)';g.lineWidth=1;dia(g,sx,sy,hw,hh);g.stroke();
      g.strokeStyle='rgba(255,255,255,.05)';g.beginPath();g.moveTo(sx-hw+1,sy+hh);g.lineTo(sx,sy+1);g.stroke();
      if(R()<.12)crack(g,R,pt(sx,sy),'rgba(0,0,0,.45)');
      if(R()<.025){const[a,b]=pt(sx,sy);g.fillStyle='rgba(30,40,60,.5)';g.beginPath();g.ellipse(a,b,9*Z,4*Z,0,0,7);g.fill();}}
    else if(z.style==='lair'){
      if(z.lava[i]){const LG=palOf('lair').lavaGlow||['#ff6a1a','rgba(255,130,40,.9)'];g.shadowColor=LG[0];g.shadowBlur=6;for(let k=0;k<3;k++)crack(g,R,pt(sx,sy),LG[1],2);g.shadowBlur=0;}
      else if(R()<.15){const[a,b]=pt(sx,sy);g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(a,b,6*Z,3*Z,0,0,7);g.fill();}}
    else if(z.style==='town'){
      if(R()<.4){const[a,b]=pt(sx,sy);g.strokeStyle='rgba(200,170,90,.35)';g.lineWidth=1;g.beginPath();g.moveTo(a,b);g.lineTo(a+(R()-.5)*8*Z,b+(R()-.5)*3*Z);g.stroke();}}
    g.fillStyle='rgba(0,0,0,.4)';
    if(isWall(z,x-1,y)&&!z.hide[i-1]){g.beginPath();g.moveTo(sx,sy);g.lineTo(sx-hw,sy+hh);g.lineTo(sx-hw*.62,sy+hh*1.38);g.lineTo(sx+hw*.38,sy+hh*.38);g.closePath();g.fill();}
    if(isWall(z,x,y-1)&&!z.hide[i-z.w]){g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+hw,sy+hh);g.lineTo(sx+hw*.62,sy+hh*1.38);g.lineTo(sx-hw*.38,sy+hh*.38);g.closePath();g.fill();}
  }
  z.fcv=c;z.fox=ox;z.bz=Z;
}
function drawWall(z,x,y,sx,sy,fade){
  const hw=TW/2*Z,hh=TH/2*Z,h=z.wh[y*z.w+x]*Z,wc=palOf(z.style).wall;
  if(fade)ctx.globalAlpha=.3;
  poly([[sx-hw,sy+hh-h],[sx,sy+2*hh-h],[sx,sy+2*hh],[sx-hw,sy+hh]],shade(wc,.72));
  poly([[sx,sy+2*hh-h],[sx+hw,sy+hh-h],[sx+hw,sy+hh],[sx,sy+2*hh]],shade(wc,.5));
  ctx.strokeStyle='rgba(0,0,0,.38)';ctx.lineWidth=1;ctx.beginPath();
  if(z.style==='crypt'||z.style==='lair'){
    for(let k=1;k<4;k++){const o=h*k/4;ctx.moveTo(sx-hw,sy+hh-h+o);ctx.lineTo(sx,sy+2*hh-h+o);ctx.lineTo(sx+hw,sy+hh-h+o);}
    for(let k=0;k<4;k++){const o=h*k/4,ts=k%2?[.5]:[.25,.75];for(const t of ts){ctx.moveTo(sx-hw+t*hw,sy+hh+t*hh-h+o);ctx.lineTo(sx-hw+t*hw,sy+hh+t*hh-h+o+h/4);ctx.moveTo(sx+t*hw,sy+2*hh-t*hh-h+o);ctx.lineTo(sx+t*hw,sy+2*hh-t*hh-h+o+h/4);}}
  }else if(z.style==='town'){
    for(let k=1;k<4;k++){const t=k/4;ctx.moveTo(sx-hw+t*hw,sy+hh+t*hh-h);ctx.lineTo(sx-hw+t*hw,sy+hh+t*hh);ctx.moveTo(sx+t*hw,sy+2*hh-t*hh-h);ctx.lineTo(sx+t*hw,sy+2*hh-t*hh);}
  }
  ctx.stroke();
  if(z.style==='plain'){poly([[sx-hw,sy+hh-h*.4],[sx,sy+2*hh-h*.4],[sx,sy+2*hh],[sx-hw,sy+hh]],'rgba(0,0,0,.2)');poly([[sx,sy+2*hh-h*.4],[sx+hw,sy+hh-h*.4],[sx+hw,sy+hh],[sx,sy+2*hh]],'rgba(0,0,0,.2)');}
  dia(ctx,sx,sy-h,hw,hh);ctx.fillStyle=shade(wc,1.12);ctx.fill();
  if(z.style==='town'){ctx.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(sx+(k-1)*hw*.5,sy+hh-h+(k%2?2:0)*Z,2.2*Z,0,7);ctx.fill();}}
  ctx.strokeStyle='rgba(255,236,200,.2)';ctx.beginPath();ctx.moveTo(sx-hw,sy+hh-h);ctx.lineTo(sx,sy+2*hh-h);ctx.lineTo(sx+hw,sy+hh-h);ctx.stroke();
  ctx.globalAlpha=1;
}
function lightsOf(z){
  const L=[],push=(x,y,r,a,col)=>L.push({x,y,r,a,col});
  push(p.x,p.y,z.id==='town'?9:6.5,1,null);
  for(const o of z.objs){if(o.type==='rift'&&riftOpen())push(o.x,o.y,3.5,.9,'190,90,255');if(o.type==='fire')push(o.x,o.y,7+Math.sin(S.t*9)*.3,1,'255,140,50');if(o.type==='wp')push(o.x,o.y,2.6,.8,'90,140,255');if(o.type==='exit')push(o.x,o.y,2,.5,null);}
  for(const o of z.props)if(o.k==='torch'||o.k==='brazier')push(o.x,o.y,(o.k==='torch'?3.4:4.4)+Math.sin(S.t*11+o.x*3)*.15,.95,'255,140,50');
  for(const po of portalsIn(z))push(po.x,po.y,3,.9,'90,140,255');
  for(const mt of S.mets)push(mt.x,mt.y,2.5,.6,'255,110,40');
  if(p.buff>0)push(p.x,p.y,3,.4,'255,200,90');
  for(const pr of S.proj)push(pr.x,pr.y,pr.kind==='arrow'?.8:2.4,.9,pr.kind==='arrow'?null:pr.kind==='mbolt'?'180,100,255':'255,110,40');
  for(const m of z.mons)if(m.boss&&!m.dead)push(m.x,m.y,m.divine!=null?5+5*m.divine:3.2,.7,m.divine!=null?'255,244,220':'255,60,30');
  for(const m of z.mons)if(m.divine!=null&&!m.dead){push(m.x-2.2*m.divine,m.y-2.2*m.divine,9*m.divine,.95,'255,240,210');push(m.x-4.4*m.divine,m.y-4.4*m.divine,8*m.divine,.9,'255,230,200');}
  if(z.lavaList)for(const l of z.lavaList)if(Math.abs(l.x-p.x)+Math.abs(l.y-p.y)<18)push(l.x,l.y,1.8,.7,palOf('lair').lavaLight||'255,90,30');
  return L;
}
function render(){
  const z=S.cur;ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  SHX=S.shake>0?(Math.random()-.5)*S.shake*18:0;SHY=S.shake>0?(Math.random()-.5)*S.shake*18:0;
  if(!z.fcv||z.bz!==Z)bakeFloor(z);
  ctx.drawImage(z.fcv,W/2-S.cam.x-z.fox+SHX,H/2-S.cam.y+SHY);
  const hw=TW/2*Z,hh=TH/2*Z;
  for(const h of S.hz||[]){const[sx,sy]=scr(h.x,h.y),rx=h.r*hw*1.42,ry=h.r*hh*1.42;
    if(h.arm>0){ctx.setLineDash([5,5]);ctx.strokeStyle=h.kind==='web'?'rgba(220,210,255,.7)':h.kind==='slam'?'rgba(240,230,210,.85)':h.kind==='ash'?'rgba(200,190,180,.7)':'rgba(255,140,60,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.stroke();ctx.setLineDash([]);continue;}
    const a=Math.min(1,h.t);
    if(h.kind==='web'){ctx.strokeStyle=`rgba(225,220,240,${.55*a})`;ctx.lineWidth=1.2;ctx.beginPath();for(let k=0;k<8;k++){const an=k/8*6.28;ctx.moveTo(sx,sy);ctx.lineTo(sx+Math.cos(an)*rx,sy+Math.sin(an)*ry);}ctx.stroke();
      for(const f of[.35,.65,.95]){ctx.beginPath();ctx.ellipse(sx,sy,rx*f,ry*f,0,0,7);ctx.stroke();}}
    else if(h.kind==='ash'){const g=ctx.createRadialGradient(sx,sy,0,sx,sy,rx);g.addColorStop(0,`rgba(190,180,170,${.6*a})`);g.addColorStop(.7,`rgba(120,60,40,${.35*a})`);g.addColorStop(1,'rgba(60,50,45,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.fill();}
    else{const g=ctx.createRadialGradient(sx,sy,0,sx,sy,rx);g.addColorStop(0,`rgba(255,170,60,${.55*a})`);g.addColorStop(1,'rgba(200,40,10,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.fill();}}
  if(z.shrink){const[sx,sy]=scr(z.shrink.cx,z.shrink.cy),rx=z.shrink.r*hw*1.42,ry=z.shrink.r*hh*1.42;ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.fillStyle='rgba(70,64,58,.45)';ctx.fill('evenodd');
    ctx.strokeStyle=`rgba(210,200,185,${.6+Math.sin(S.t*6)*.2})`;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.stroke();ctx.restore();}
  for(const d of z.decals){const[sx,sy]=scr(d.x,d.y);const a=Math.max(0,1-(S.t-d.t)/40);if(a<=0)continue;ctx.fillStyle=d.c.replace('A',(.6*a).toFixed(2));ctx.beginPath();ctx.ellipse(sx,sy,d.r*hw,d.r*hh,0,0,7);ctx.fill();}
  if(S.mark&&S.mark.t>0){const[sx,sy]=scr(S.mark.x,S.mark.y);ctx.strokeStyle=`rgba(232,196,106,${S.mark.t*1.6})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy,S.mark.t*30*Z,S.mark.t*15*Z,0,0,7);ctx.stroke();}
  const dr=[];
  for(let y=0;y<z.h;y++)for(let x=0;x<z.w;x++){const i=y*z.w+x;if(z.g[i]!==1||!z.near[i])continue;const[sx,sy]=scr(x,y);if(sx<-hw-4||sx>W+hw+4||sy<-hh*2-50*Z||sy>H+4)continue;dr.push({d:x+y+1,k:'w',x,y,sx,sy});}
  for(const m of z.mons)if(m.dead){const[sx,sy]=scr(m.x,m.y);ctx.globalAlpha=Math.max(0,1-m.dt/25)*.8;ctx.fillStyle=m.kind==='archer'?'#8a826e':m.kind==='ghost'?'rgba(80,70,120,.6)':'#2a0806';ctx.beginPath();ctx.ellipse(sx,sy,14*Z*m.size,6*Z*m.size,0,0,7);ctx.fill();ctx.fillStyle=m.boss?'#4a1610':'#3a3226';ctx.beginPath();ctx.ellipse(sx+3,sy-2,9*Z*m.size,4*Z*m.size,.3,0,7);ctx.fill();ctx.globalAlpha=1;}
  for(const o of z.objs)if(o.type==='wp')drawWp(o);
  for(const n of S.novas){const[sx,sy]=scr(n.x,n.y);const a=1-n.r/n.max;ctx.strokeStyle=`rgba(170,220,255,${a})`;ctx.lineWidth=5*Z;ctx.beginPath();ctx.ellipse(sx,sy,n.r*hw*1.42,n.r*hh*1.42,0,0,7);ctx.stroke();ctx.fillStyle=`rgba(150,200,255,${a*.15})`;ctx.fill();}
  for(const it of z.items){const[sx,sy]=scr(it.x,it.y);ctx.fillStyle=it.kind==='gold'?'#d8b04a':it.kind==='pot'?'#c23a30':it.kind==='scroll'?'#cfc2a0':RCOL[it.it.rar];ctx.beginPath();ctx.ellipse(sx,sy,5*Z,3*Z,0,0,7);ctx.fill();if(it.kind==='item'&&it.it.rar===3){ctx.globalCompositeOperation='lighter';ctx.fillStyle=vgrad(sy-90*Z,sy,'rgba(255,150,40,0)','rgba(255,150,40,.35)');ctx.fillRect(sx-5*Z,sy-90*Z,10*Z,90*Z);ctx.globalCompositeOperation='source-over';}ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(sx-2*Z,sy-1.5*Z,2*Z,1.2*Z);}
  const on=(x,y)=>{const q=scr(x,y);return q[0]>-90&&q[0]<W+90&&q[1]>-40&&q[1]<H+140;};
  for(const m of z.mons)if(!m.dead&&on(m.x,m.y))dr.push({d:m.x+m.y,k:'m',o:m});
  for(const o of z.objs)if(o.type!=='wp')dr.push({d:o.x+o.y,k:'o',o});
  for(const o of z.props)if(o.k==='tent'||on(o.x,o.y))dr.push({d:o.k==='tent'?o.x+o.y+3.2:o.x+o.y,k:'pp',o});
  for(const po of portalsIn(z))dr.push({d:po.x+po.y,k:'pt',o:po});
  if(!p.dead)dr.push({d:p.x+p.y,k:'p'});
  for(const pr of S.proj)dr.push({d:pr.x+pr.y,k:'pr',o:pr});
  dr.sort((a,b)=>a.d-b.d);
  const pd=p.x+p.y,pdiff=p.x-p.y;
  for(const e of dr){
    if(e.k==='w'){const ahead=(e.x+e.y+1)-pd;drawWall(z,e.x,e.y,e.sx,e.sy,ahead>0&&ahead<4&&Math.abs((e.x-e.y)-pdiff)<2.6);}
    else if(e.k==='m')drawMon(e.o);else if(e.k==='o')drawObj(e.o);else if(e.k==='pp')drawProp(e.o);
    else if(e.k==='pt')drawPortal(e.o);else if(e.k==='p')drawPlayer();else if(e.k==='pr')drawProj(e.o);
  }
  for(const b of S.bolts){const A=scr(b.a.x,b.a.y),B=scr(b.b.x,b.b.y);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(170,210,255,${b.t*4})`;ctx.lineWidth=3*Z;ctx.beginPath();ctx.moveTo(A[0],A[1]-24*Z);for(let k=1;k<6;k++){const t=k/6;ctx.lineTo(A[0]+(B[0]-A[0])*t+rnd(-6,6)*Z,A[1]+(B[1]-A[1])*t-24*Z+rnd(-6,6)*Z);}ctx.lineTo(B[0],B[1]-20*Z);ctx.stroke();ctx.lineWidth=1;ctx.strokeStyle='#fff';ctx.stroke();ctx.globalCompositeOperation='source-over';}
  for(const mt of S.mets){const[sx,sy]=scr(mt.x,mt.y);ctx.strokeStyle='rgba(255,120,40,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy,2.4*hw*1.42*(1-mt.t*.3),2.4*hh*1.42*(1-mt.t*.3),0,0,7);ctx.stroke();
    const fy=sy-mt.t*500*Z,fx=sx-mt.t*160*Z;ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(fx,fy,0,fx,fy,16*Z);g.addColorStop(0,'rgba(255,240,190,1)');g.addColorStop(.4,'rgba(255,120,30,.9)');g.addColorStop(1,'rgba(255,60,10,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(fx,fy,16*Z,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';}
  for(const q of S.parts){const[sx,sy]=scr(q.x,q.y);ctx.globalAlpha=clamp(q.life*2,0,1);ctx.fillStyle=q.col;ctx.fillRect(sx-1.5*Z,sy-q.z*20*Z-1.5*Z,3*Z,3*Z);}ctx.globalAlpha=1;
  // obscurité
  const LS=lightsOf(z);
  lctx.setTransform(DPR,0,0,DPR,0,0);lctx.globalCompositeOperation='source-over';lctx.clearRect(0,0,W,H);
  lctx.fillStyle=`rgba(4,2,1,${palOf(z.style).dark})`;lctx.fillRect(0,0,W,H);lctx.globalCompositeOperation='destination-out';
  for(const l of LS){const[sx,sy]=scr(l.x,l.y);const R=l.r*hw;lctx.save();lctx.translate(sx,sy-10*Z);lctx.scale(1,.62);const g=lctx.createRadialGradient(0,0,0,0,0,R);g.addColorStop(0,`rgba(0,0,0,${l.a})`);g.addColorStop(.55,`rgba(0,0,0,${l.a*.7})`);g.addColorStop(1,'rgba(0,0,0,0)');lctx.fillStyle=g;lctx.beginPath();lctx.arc(0,0,R,0,7);lctx.fill();lctx.restore();}
  ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(lc,0,0);ctx.setTransform(DPR,0,0,DPR,0,0);
  // lueurs chaudes
  ctx.globalCompositeOperation='lighter';
  for(const l of LS){if(!l.col)continue;const[sx,sy]=scr(l.x,l.y);const R=l.r*hw*.8;ctx.save();ctx.translate(sx,sy-10*Z);ctx.scale(1,.62);const g=ctx.createRadialGradient(0,0,0,0,0,R);g.addColorStop(0,`rgba(${l.col},.22)`);g.addColorStop(1,`rgba(${l.col},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,7);ctx.fill();ctx.restore();}
  for(const a of S.amb){const[sx,sy]=scr(a.x,a.y);const yy=sy-a.z*20*Z;const lf=Math.min(1,a.life,(a.max-a.life)*2);
    if(a.ember){ctx.fillStyle=`rgba(255,${120+(a.x*37%80)|0},40,${.8*lf})`;ctx.fillRect(sx-1,yy-1,2*Z,2*Z);}
    else{const dd=Math.hypot(a.x-p.x,a.y-p.y);const al=lf*Math.max(0,1-dd/(z.id==='town'?11:7))*.5;if(al<=0)continue;ctx.fillStyle=`rgba(${a.c},${al})`;ctx.fillRect(sx,yy,a.s*Z,a.s*Z);}}
  ctx.globalCompositeOperation='source-over';
  const vg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.32,W/2,H/2,Math.max(W,H)*.72);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(p.hurt>0){ctx.fillStyle=`rgba(140,0,0,${p.hurt*.5})`;ctx.fillRect(0,0,W,H);}
  if(p.hp<p.maxHp*.25&&!p.dead){const a=.25+Math.sin(S.t*6)*.12;const rg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.7);rg.addColorStop(0,'rgba(120,0,0,0)');rg.addColorStop(1,`rgba(120,0,0,${a})`);ctx.fillStyle=rg;ctx.fillRect(0,0,W,H);}
  for(const m of z.mons)if(m.divine!=null&&!m.dead){const[sx,sy]=scr(m.x,m.y);drawDivine(sx,sy,m,true);}
  // étiquettes
  ctx.textAlign='center';ctx.textBaseline='middle';
  const lab=(t,x,y,col,f)=>{ctx.font=f;ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText(t,x,y);ctx.fillStyle=col;ctx.fillText(t,x,y);};
  for(const o of z.objs){if(o.type==='npc'){const[sx,sy]=scr(o.x,o.y);lab(o.name,sx,sy-62*Z,'#e2d6c0',`700 ${12*Z+1}px "Alegreya Sans",sans-serif`);
      if(o.id==='corvel'&&corvelHas())lab('!',sx,sy-82*Z+Math.sin(S.t*4)*2,'#e8c46a',`700 ${24*Z}px "Grenze Gotisch",serif`);}
    if(o.type==='exit'&&dist(o,p)<5){const[sx,sy]=scr(o.x,o.y);lab(o.label,sx,sy-54*Z,'#d9c79a',`${12*Z+1}px "Alegreya Sans",sans-serif`);}
    if(o.type==='stash'&&dist(o,p)<6){const[sx,sy]=scr(o.x,o.y);lab('Coffre',sx,sy-38*Z,'#e8c060',`700 ${12*Z+1}px "Alegreya Sans",sans-serif`);}
    if(o.type==='rift'&&riftOpen()&&dist(o,p)<6){const[sx,sy]=scr(o.x,o.y);lab('Pierre de faille',sx,sy-64*Z,'#d8a8ff',`700 ${12*Z+1}px "Alegreya Sans",sans-serif`);}
    if(o.type==='wp'&&dist(o,p)<3){const[sx,sy]=scr(o.x,o.y);lab('Point de passage',sx,sy-22*Z,'#a8c0ff',`${12*Z+1}px "Alegreya Sans",sans-serif`);}}
  // Tout près du portail, son étiquette devient le bouton « Entrer » (le seul endroit de l'étiquette qui réagit au toucher)
  S.portalBtn=null;const pn=portalNear(z);
  for(const po of portalsIn(z))if(Math.hypot(po.x-p.x,po.y-p.y)<5){const[sx,sy]=scr(po.x,po.y);
    if(!(pn&&pn.x===po.x&&pn.y===po.y)){lab(po.label,sx,sy-62*Z,'#a8c0ff',`${12*Z+1}px "Alegreya Sans",sans-serif`);continue;}
    const t='Entrer · '+po.label;ctx.font=`700 ${13*Z+1}px "Alegreya Sans",sans-serif`;const w=ctx.measureText(t).width+22*Z,h=26*Z,ly=sy-66*Z;
    ctx.fillStyle='rgba(16,24,52,.88)';ctx.strokeStyle='#8fb0ff';ctx.lineWidth=1.5;ctx.beginPath();ctx.rect(sx-w/2,ly-h/2,w,h);ctx.fill();ctx.stroke();ctx.fillStyle='#dfe8ff';ctx.fillText(t,sx,ly+1);
    S.portalBtn={x0:sx-w/2,y0:ly-h/2,x1:sx+w/2,y1:ly+h/2,po};}
  S.labels=[];ctx.font=`${11*Z+2}px "Alegreya Sans",sans-serif`;
  for(const it of z.items){if(Math.hypot(it.x-p.x,it.y-p.y)>8)continue;if(p.skipWhite&&it.kind==='item'&&it.it.rar===0)continue;const[sx,sy]=scr(it.x,it.y);
    const t=it.kind==='gold'?`${it.v} or`:it.kind==='pot'?'Fiole':it.kind==='scroll'?'Parchemin de portail':it.it.name;
    const w=ctx.measureText(t).width+8,h=15*Z+2,ly=sy-14*Z;ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(sx-w/2,ly-h/2,w,h);
    ctx.fillStyle=it.kind==='gold'?'#e8c46a':it.kind==='pot'?'#ff8a7a':it.kind==='scroll'?'#cfc2a0':RCOL[it.it.rar];ctx.fillText(t,sx,ly+1);
    S.labels.push({x0:sx-w/2,y0:ly-h/2,x1:sx+w/2,y1:ly+h/2,it});}
  for(const m of z.mons)if(!m.dead&&m.aggro&&(m.champ||m.hp<m.maxHp)&&(!m.boss||m.guard)){const[sx,sy]=scr(m.x,m.y);const w=26*Z*m.size,yy=sy-(m.kind==='beast'?26:54)*Z*m.size;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(sx-w/2-1,yy-1,w+2,4);ctx.fillStyle=m.champ?'#6f8cff':'#c0281e';ctx.fillRect(sx-w/2,yy,w*Math.max(0,m.hp/m.maxHp),2);}
  for(const f of S.fx){const[sx,sy]=scr(f.x,f.y);ctx.globalAlpha=clamp(f.life*1.5,0,1);const yy=sy-50*Z-(1-f.life)*34*Z;lab(f.t,sx,yy,f.col,`700 ${(f.big?19:14)*Z+1}px "Alegreya Sans",sans-serif`);}ctx.globalAlpha=1;
}
function shadow(sx,sy,r){ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.ellipse(sx,sy,r*Z,r*.45*Z,0,0,7);ctx.fill();}
function sdir(a){const dx=Math.cos(a),dy=Math.sin(a);return[(dx-dy),(dx+dy)/2];}
function flame(sx,sy,s,k){const f=Math.sin(S.t*14+k)*2*s;ctx.fillStyle='#e0502a';ctx.beginPath();ctx.moveTo(sx-5*s,sy);ctx.quadraticCurveTo(sx-2*s,sy-14*s,sx+f*.3,sy-20*s+f);ctx.quadraticCurveTo(sx+2*s,sy-12*s,sx+5*s,sy);ctx.fill();ctx.fillStyle='#ffd07a';ctx.beginPath();ctx.moveTo(sx-2.5*s,sy);ctx.quadraticCurveTo(sx,sy-12*s-f,sx+2.5*s,sy);ctx.fill();}
function drawPlayer(){const[sx,sy]=scr(p.x,p.y);drawHero(ctx,sx,sy,Z,{eq:p.eq,face:p.face,moving:p.moving,t:S.t,swing:p.swing,spin:p.spin,buff:p.buff});}
function drawMon(m){
  const[sx,sy]=scr(m.x,m.y),s=Z*m.size,bob=Math.sin(m.ph*6)*1.5*s,hover=hoverMon===m||p.target===m;
  shadow(sx,sy,11*m.size);
  if(hover){ctx.strokeStyle='rgba(232,196,106,.8)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(sx,sy,15*Z*m.size,6.5*Z*m.size,0,0,7);ctx.stroke();}
  ctx.save();
  if(m.flash>0)ctx.filter='brightness(2.4)';
  if(m.champ){ctx.shadowColor='#6f8cff';ctx.shadowBlur=12;}
  if(m.guard){ctx.shadowColor='#c060ff';ctx.shadowBlur=18;}
  if(m.mini){ctx.shadowColor=m.tel>0?'#ff5020':m.shell>0?'#e8ecf2':(m.flag&&!m.flag.dead)?'#ffffff':'#e8c46a';ctx.shadowBlur=m.tel>0?26:(m.flag&&!m.flag.dead)?24:16;}
  if(m.echo){ctx.globalAlpha=.6;}
  if(m.slow>0){ctx.shadowColor='#9fd4ff';ctx.shadowBlur=10;}
  const lunge=m.atk>0?6*s:0;const[fx]=sdir(m.face);const side=fx>=0?1:-1;
  if(m.kind==='banner'){const w=Math.sin(S.t*3+m.ph)*3*s;ctx.strokeStyle='#3a2a1a';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx,sy-58*s);ctx.stroke();
    ctx.fillStyle=vgrad(sy-56*s,sy-24*s,'#a02a20','#4a0e0a');ctx.beginPath();ctx.moveTo(sx,sy-56*s);ctx.lineTo(sx+18*s+w,sy-54*s);ctx.lineTo(sx+15*s+w,sy-26*s);ctx.lineTo(sx+8*s+w*.5,sy-31*s);ctx.lineTo(sx,sy-24*s);ctx.closePath();ctx.fill();
    ctx.fillStyle='#d8d4c4';ctx.beginPath();ctx.arc(sx+9*s+w*.5,sy-43*s,3.5*s,0,7);ctx.fill();ctx.strokeStyle='rgba(255,120,80,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(sx,sy,BOSSES.heraut.banner.r*TW/2*Z*1.42,BOSSES.heraut.banner.r*TH/2*Z*1.42,0,0,7);ctx.stroke();}
  else if(m.kind==='lord'&&m.divine!=null){drawDivine(sx,sy,m);}
  else if(m.kind==='lord'){if(m.fallen){ctx.globalAlpha=.75;ctx.translate(sx,sy);ctx.scale(1,.45);ctx.translate(-sx,-sy);}
    ctx.fillStyle=vgrad(sy-50*s,sy,'#6a645c','#1e1c1a');ctx.beginPath();ctx.moveTo(sx-10*s,sy-44*s+bob);ctx.quadraticCurveTo(sx-22*s,sy-20*s,sx-18*s-side*2*s,sy);ctx.lineTo(sx+18*s-side*2*s,sy);ctx.quadraticCurveTo(sx+22*s,sy-20*s,sx+10*s,sy-44*s+bob);ctx.closePath();ctx.fill();
    ctx.fillStyle=vgrad(sy-46*s,sy-12*s,'#4a4844','#161514');ctx.beginPath();ctx.moveTo(sx-9*s,sy-45*s+bob);ctx.lineTo(sx+9*s,sy-45*s+bob);ctx.lineTo(sx+7*s,sy-12*s);ctx.lineTo(sx-7*s,sy-12*s);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#8a8478';ctx.lineWidth=1.2*s;ctx.beginPath();ctx.moveTo(sx,sy-44*s+bob);ctx.lineTo(sx,sy-14*s);ctx.moveTo(sx-7*s,sy-30*s);ctx.lineTo(sx+7*s,sy-30*s);ctx.stroke();
    ctx.fillStyle='#2a2826';ctx.beginPath();ctx.arc(sx,sy-51*s+bob,6.5*s,0,7);ctx.fill();
    ctx.fillStyle='#bdb6a8';for(let k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(sx+k*3*s-1.5*s,sy-56*s+bob);ctx.lineTo(sx+k*3*s,sy-(63+(2-Math.abs(k))*3)*s+bob);ctx.lineTo(sx+k*3*s+1.5*s,sy-56*s+bob);ctx.fill();}
    ctx.shadowColor='#f0ece0';ctx.shadowBlur=10;ctx.fillStyle='#f4f0e4';ctx.fillRect(sx-3.5*s,sy-52*s+bob,2.4*s,1.6*s);ctx.fillRect(sx+1.1*s,sy-52*s+bob,2.4*s,1.6*s);ctx.shadowBlur=0;
    const ax=sx+side*(12*s+lunge),ay=sy-30*s;ctx.strokeStyle='#cfcabe';ctx.lineWidth=4*s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax+side*16*s,ay-28*s);ctx.stroke();
    ctx.strokeStyle='#5a4a3a';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(ax-side*3*s,ay+5*s);ctx.lineTo(ax+side*1*s,ay-1*s);ctx.stroke();
    if(m.beaten){ctx.fillStyle='rgba(240,236,224,.15)';ctx.beginPath();ctx.ellipse(sx,sy-30*s,26*s,40*s,0,0,7);ctx.fill();}}
  else if(m.kind==='weaver'){
    ctx.strokeStyle='#2a2030';ctx.lineWidth=2.2*s;ctx.lineCap='round';
    for(const k of[-1,1])for(let j=0;j<4;j++){const ph=Math.sin(m.ph*10+j*1.7)*2*s,bx=sx+k*6*s,by=sy-12*s+j*2*s;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+k*(9+j*2)*s,by-8*s+ph);ctx.lineTo(bx+k*(14+j*2)*s,sy+1*s);ctx.stroke();}
    ctx.fillStyle=vgrad(sy-26*s,sy-6*s,'#9a8ab0','#3a2a48');ctx.beginPath();ctx.ellipse(sx-side*4*s,sy-14*s,11*s,8*s,0,0,7);ctx.fill();
    ctx.fillStyle='#5a4a70';ctx.beginPath();ctx.ellipse(sx+side*(8*s+lunge*.5),sy-16*s,6*s,5*s,0,0,7);ctx.fill();
    ctx.fillStyle='#ff4a6a';for(let k=0;k<3;k++)ctx.fillRect(sx+side*(10*s+lunge*.5)+(k-1)*2.2*s,sy-18*s,1.5*s,1.5*s);}
  else if(m.kind==='beast'){
    ctx.fillStyle='#3a2416';const st=Math.sin(m.ph*14)*2*s;ctx.fillRect(sx-10*s+st,sy-5*s,3*s,6*s);ctx.fillRect(sx+7*s-st,sy-5*s,3*s,6*s);
    ctx.fillStyle=vgrad(sy-16*s,sy-3*s,m.fur?m.fur[0]:'#a8704a',m.fur?m.fur[1]:'#4a2a16');ctx.beginPath();ctx.ellipse(sx+side*lunge*.5,sy-9*s,14*s,7*s,0,0,7);ctx.fill();
    ctx.strokeStyle='#2a160c';ctx.lineWidth=1.5*s;ctx.beginPath();for(let k=-2;k<=2;k++){ctx.moveTo(sx+k*4*s,sy-15*s);ctx.lineTo(sx+k*4*s-side*2*s,sy-19*s);}ctx.stroke();
    ctx.fillStyle=m.fur?m.fur[2]:'#8c5a38';ctx.beginPath();ctx.ellipse(sx+side*(12*s+lunge),sy-13*s,6.5*s,5*s,0,0,7);ctx.fill();
    ctx.fillStyle='#ffd060';ctx.fillRect(sx+side*(14*s+lunge)-1,sy-15*s,2*s,2*s);ctx.fillStyle='#e8e0cc';ctx.fillRect(sx+side*(17*s+lunge)-1,sy-11*s,1.5*s,2.5*s);}
  else if(m.kind==='ghost'){ctx.globalAlpha=.85;ctx.fillStyle=vgrad(sy-46*s,sy,m.gcol||'#8a78c8','rgba(40,30,70,0)');ctx.beginPath();ctx.moveTo(sx-10*s,sy-6*s+bob);ctx.quadraticCurveTo(sx-13*s,sy-44*s+bob,sx,sy-47*s+bob);ctx.quadraticCurveTo(sx+13*s,sy-44*s+bob,sx+10*s,sy-6*s+bob);
    for(let k=0;k<4;k++)ctx.lineTo(sx+10*s-k*5*s-2.5*s,sy-2*s+bob+Math.sin(m.ph*8+k)*3*s);ctx.closePath();ctx.fill();
    ctx.globalAlpha=1;ctx.shadowColor='#cfe0ff';ctx.shadowBlur=8;ctx.fillStyle='#e8f0ff';ctx.fillRect(sx-5*s,sy-36*s+bob,3*s,3*s);ctx.fillRect(sx+2*s,sy-36*s+bob,3*s,3*s);
    ctx.fillStyle='#1a1030';ctx.beginPath();ctx.ellipse(sx,sy-29*s+bob,2.5*s,3.5*s,0,0,7);ctx.fill();}
  else if(m.kind==='boss'){
    const VP=m.pal||['#2a0a06','#b03020','#3a0d08','#5a120c'];ctx.fillStyle=VP[0];ctx.beginPath();ctx.moveTo(sx-14*s,sy-30*s+bob);ctx.quadraticCurveTo(sx-34*s,sy-46*s+bob,sx-30*s,sy-14*s);ctx.lineTo(sx-14*s,sy-22*s);ctx.fill();ctx.beginPath();ctx.moveTo(sx+14*s,sy-30*s+bob);ctx.quadraticCurveTo(sx+34*s,sy-46*s+bob,sx+30*s,sy-14*s);ctx.lineTo(sx+14*s,sy-22*s);ctx.fill();
    ctx.fillStyle=vgrad(sy-42*s,sy-4*s,VP[1],VP[2]);ctx.beginPath();ctx.moveTo(sx-16*s,sy-6*s);ctx.lineTo(sx-12*s,sy-40*s+bob);ctx.lineTo(sx+12*s,sy-40*s+bob);ctx.lineTo(sx+16*s,sy-6*s);ctx.closePath();ctx.fill();
    ctx.fillStyle=VP[3];ctx.beginPath();ctx.arc(sx+side*lunge*.3,sy-46*s+bob,9*s,0,7);ctx.fill();
    ctx.strokeStyle='#d8cfbb';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx-6*s,sy-52*s+bob);ctx.quadraticCurveTo(sx-16*s,sy-58*s+bob,sx-14*s,sy-70*s+bob);ctx.moveTo(sx+6*s,sy-52*s+bob);ctx.quadraticCurveTo(sx+16*s,sy-58*s+bob,sx+14*s,sy-70*s+bob);ctx.stroke();
    ctx.shadowColor='#ffb030';ctx.shadowBlur=10;ctx.fillStyle='#ffcf5a';ctx.fillRect(sx-5*s,sy-48*s+bob,3*s,2*s);ctx.fillRect(sx+2*s,sy-48*s+bob,3*s,2*s);ctx.shadowBlur=0;
    ctx.strokeStyle='#ff6a2a';ctx.lineWidth=1.5*s;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(sx-8*s+i*8*s,sy-34*s+bob);ctx.lineTo(sx-6*s+i*8*s,sy-24*s);ctx.lineTo(sx-8*s+i*8*s,sy-14*s);ctx.stroke();}
    const ax=sx+side*(16*s+lunge),ay=sy-30*s;ctx.strokeStyle='#2a1a14';ctx.lineWidth=4*s;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax+side*10*s,ay+18*s);ctx.stroke();}
  else{
    const bone=m.kind==='archer';ctx.fillStyle=bone?(m.bone?shade(hexc(m.bone),.8):'#bfb59f'):'#2e281e';const st=m.aggro?Math.sin(m.ph*9)*2*s:0;ctx.fillRect(sx-5*s+st,sy-14*s,4*s,14*s);ctx.fillRect(sx+1*s-st,sy-14*s,4*s,14*s);
    if(m.bolt){ctx.fillStyle=vgrad(sy-36*s,sy-6*s,'#6a4a9a','#241838');ctx.beginPath();ctx.moveTo(sx-6*s,sy-35*s);ctx.lineTo(sx+6*s,sy-35*s);ctx.lineTo(sx+9*s,sy-6*s);ctx.lineTo(sx-9*s,sy-6*s);ctx.closePath();ctx.fill();ctx.strokeStyle='#5a4030';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(sx+side*9*s,sy-44*s);ctx.lineTo(sx+side*9*s,sy-4*s);ctx.stroke();ctx.shadowColor='#c080ff';ctx.shadowBlur=10;ctx.fillStyle='#e0c0ff';ctx.beginPath();ctx.arc(sx+side*9*s,sy-46*s,3*s,0,7);ctx.fill();ctx.shadowBlur=0;}
    else if(bone){ctx.fillStyle=m.bone||'#d9cfbb';ctx.fillRect(sx-1.5*s,sy-34*s,3*s,20*s);for(let i=0;i<4;i++)ctx.fillRect(sx-7*s+i*.5*s,sy-32*s+i*4*s,14*s-i*s,2*s);
      ctx.fillStyle='#6b4a2a';ctx.fillRect(sx-side*7*s,sy-36*s,3*s,14*s);}
    else{ctx.fillStyle=vgrad(sy-34*s,sy-12*s,shade(hexc(m.col),1.15),shade(hexc(m.col),.5));ctx.beginPath();ctx.moveTo(sx-8*s,sy-34*s+bob);ctx.lineTo(sx+8*s,sy-32*s+bob);ctx.lineTo(sx+7*s,sy-12*s);ctx.lineTo(sx-7*s,sy-12*s);ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(30,20,10,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx-6*s,sy-26*s);ctx.lineTo(sx+5*s,sy-20*s);ctx.stroke();
      ctx.fillStyle='#5a6640';ctx.fillRect(sx+side*(8*s+lunge)-2*s,sy-30*s+bob,4*s,15*s);}
    ctx.fillStyle=bone?(m.bone||(m.bolt?'#d8d0ee':'#efe8d6')):shade(hexc(m.col),1.25);ctx.beginPath();ctx.arc(sx+side*2*s,sy-40*s+bob,5.5*s,0,7);ctx.fill();
    ctx.shadowColor='#ff5a2a';ctx.shadowBlur=bone?0:6;ctx.fillStyle=bone?'#120c08':'#ff6a3a';ctx.fillRect(sx+side*3*s-1,sy-41*s+bob,2*s,2*s);ctx.shadowBlur=0;
    if(bone&&!m.bolt){ctx.strokeStyle='#7a5a3a';ctx.lineWidth=2*s;ctx.beginPath();ctx.arc(sx+side*10*s,sy-28*s,10*s,side>0?-1.2:1.95,side>0?1.2:4.35);ctx.stroke();
      ctx.strokeStyle='rgba(230,220,200,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+side*10*s+Math.cos(side>0?-1.2:1.95)*10*s,sy-28*s+Math.sin(side>0?-1.2:1.95)*10*s);ctx.lineTo(sx+side*(10-(m.atk>0?6:0))*s,sy-28*s);ctx.lineTo(sx+side*10*s+Math.cos(side>0?1.2:4.35)*10*s,sy-28*s+Math.sin(side>0?1.2:4.35)*10*s);ctx.stroke();}}
  ctx.restore();
}
/* Vraie forme de Valgris : une immensité de cendre, d’ailes et de lumière blanche */
function drawDivine(sx,sy,m,glow){const g=m.divine,s=Z*m.size,fl=Math.sin(S.t*2)*3*s,top=sy-70*s+fl;
  if(glow){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.55*g;for(const k of[-1,1]){ctx.beginPath();ctx.moveTo(sx+k*8*s,top+12*s);ctx.quadraticCurveTo(sx+k*40*s,top-36*s+fl,sx+k*62*s,top-18*s);ctx.quadraticCurveTo(sx+k*50*s,top+6*s,sx+k*58*s,top+22*s);ctx.strokeStyle='#fff0d8';ctx.lineWidth=1.6*s;ctx.stroke();}
    ctx.globalAlpha=g;ctx.shadowColor='#fff4dc';ctx.shadowBlur=24;ctx.fillStyle='#fff6e6';for(let k=-3;k<=3;k++){const h=(4-Math.abs(k))*4*s+6*s;ctx.beginPath();ctx.moveTo(sx+k*3.6*s-2*s,top-7*s);ctx.lineTo(sx+k*3.6*s,top-7*s-h-Math.sin(S.t*8+k)*2*s);ctx.lineTo(sx+k*3.6*s+2*s,top-7*s);ctx.fill();}
    ctx.fillRect(sx-5*s,top-1.5*s,3.4*s,2*s);ctx.fillRect(sx+1.6*s,top-1.5*s,3.4*s,2*s);ctx.restore();return;}
  ctx.save();ctx.globalCompositeOperation='lighter';const au=ctx.createRadialGradient(sx,top+20*s,4*s,sx,top+20*s,60*s);au.addColorStop(0,`rgba(255,248,230,${.35*g})`);au.addColorStop(.5,`rgba(200,120,60,${.18*g})`);au.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=au;ctx.beginPath();ctx.arc(sx,top+20*s,60*s,0,7);ctx.fill();ctx.restore();
  for(const k of[-1,1]){ctx.fillStyle=vgrad(top-30*s,sy,`rgba(96,88,80,${.95*g})`,'rgba(20,16,14,0)');ctx.beginPath();ctx.moveTo(sx+k*8*s,top+12*s);
    ctx.quadraticCurveTo(sx+k*40*s,top-36*s+fl,sx+k*62*s,top-18*s);ctx.quadraticCurveTo(sx+k*50*s,top+6*s,sx+k*58*s,top+22*s);ctx.quadraticCurveTo(sx+k*40*s,top+20*s,sx+k*44*s,top+42*s);ctx.quadraticCurveTo(sx+k*24*s,top+30*s,sx+k*8*s,top+40*s);ctx.closePath();ctx.fill();
    ctx.strokeStyle=`rgba(255,246,226,${.7*g})`;ctx.lineWidth=1.4*s;ctx.stroke();}
  ctx.fillStyle=vgrad(top,sy,'#6a625a','rgba(30,26,24,.3)');ctx.beginPath();ctx.moveTo(sx-12*s,top+8*s);ctx.lineTo(sx+12*s,top+8*s);ctx.lineTo(sx+20*s,sy-4*s);ctx.lineTo(sx-20*s,sy-4*s);ctx.closePath();ctx.fill();
  ctx.fillStyle='#3a3430';ctx.beginPath();ctx.arc(sx,top,9*s,0,7);ctx.fill();ctx.strokeStyle='rgba(255,246,226,.6)';ctx.lineWidth=1.2*s;ctx.stroke();
  ctx.shadowColor='#fff4dc';ctx.shadowBlur=20;ctx.fillStyle='#fffaf0';for(let k=-3;k<=3;k++){const h=(4-Math.abs(k))*4*s+6*s;ctx.beginPath();ctx.moveTo(sx+k*3.6*s-2*s,top-7*s);ctx.lineTo(sx+k*3.6*s,top-7*s-h-Math.sin(S.t*8+k)*2*s);ctx.lineTo(sx+k*3.6*s+2*s,top-7*s);ctx.fill();}
  ctx.fillRect(sx-5*s,top-1.5*s,3.4*s,2*s);ctx.fillRect(sx+1.6*s,top-1.5*s,3.4*s,2*s);ctx.shadowBlur=0;
  ctx.strokeStyle=`rgba(255,250,235,${.5*g})`;ctx.lineWidth=1;for(let k=0;k<10;k++){const a=k/10*6.28+S.t*.4;ctx.beginPath();ctx.moveTo(sx+Math.cos(a)*14*s,top+20*s+Math.sin(a)*8*s);ctx.lineTo(sx+Math.cos(a)*(40+10*g)*s,top+20*s+Math.sin(a)*(22+6*g)*s);ctx.stroke();}}
function drawObj(o){
  const[sx,sy]=scr(o.x,o.y),s=Z;
  if(o.type==='npc'){shadow(sx,sy,12);const br=Math.sin(S.t*2+o.x)*.8*s;
    const robes=((THM().npcs||{})[o.id]||{}).robe||{corvel:['#7e6ca6','#2e2448'],bram:['#9a7a3a','#4a3414'],eline:['#d8d0c0','#7a7060'],hilde:['#6a4030','#2a160e']}[o.id];
    if(o.id==='bram'){ctx.fillStyle=vgrad(sy-34*s,sy-14*s,'#6a4a24','#3a2810');ctx.fillRect(sx-15*s,sy-34*s,9*s,16*s);ctx.strokeStyle='#2a1a0c';ctx.lineWidth=1;ctx.strokeRect(sx-15*s,sy-34*s,9*s,16*s);}
    ctx.fillStyle=vgrad(sy-38*s,sy-4*s,robes[0],robes[1]);ctx.beginPath();ctx.moveTo(sx-8*s,sy-37*s-br);ctx.lineTo(sx+8*s,sy-37*s-br);ctx.lineTo(sx+12*s,sy-3*s);ctx.lineTo(sx-12*s,sy-3*s);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(sx-1*s,sy-30*s,2*s,26*s);
    ctx.fillStyle='#c9a882';ctx.beginPath();ctx.arc(sx,sy-43*s-br,5.5*s,0,7);ctx.fill();
    if(o.id==='corvel'){ctx.fillStyle='#e0dacd';ctx.beginPath();ctx.moveTo(sx-4.5*s,sy-41*s-br);ctx.lineTo(sx+4.5*s,sy-41*s-br);ctx.lineTo(sx,sy-26*s-br);ctx.fill();
      ctx.strokeStyle='#6a4a2a';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx+13*s,sy-56*s);ctx.lineTo(sx+13*s,sy);ctx.stroke();
      ctx.shadowColor='#9fb8ff';ctx.shadowBlur=12;ctx.fillStyle='#bfd0ff';ctx.beginPath();ctx.arc(sx+13*s,sy-58*s,3.5*s,0,7);ctx.fill();ctx.shadowBlur=0;}
    if(o.id==='bram'){ctx.fillStyle='#4a3014';ctx.beginPath();ctx.ellipse(sx,sy-48*s-br,9*s,2.5*s,0,0,7);ctx.fill();ctx.fillRect(sx-5*s,sy-54*s-br,10*s,6*s);}
    if(o.id==='hilde'){ctx.fillStyle='#3a2a20';ctx.fillRect(sx-7*s,sy-30*s,14*s,18*s);ctx.fillStyle='#b05a2a';ctx.beginPath();ctx.arc(sx,sy-47*s,5*s,Math.PI,0);ctx.fill();ctx.strokeStyle='#7a7e86';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx+10*s,sy-34*s);ctx.lineTo(sx+14*s,sy-20*s);ctx.stroke();ctx.fillStyle='#8a8e96';ctx.fillRect(sx+10*s,sy-38*s,8*s,5*s);}
    if(o.id==='eline'){ctx.fillStyle='#ece6d8';ctx.beginPath();ctx.arc(sx,sy-44*s-br,7.5*s,Math.PI,0);ctx.lineTo(sx+8*s,sy-34*s);ctx.lineTo(sx-8*s,sy-34*s);ctx.closePath();ctx.fill();
      ctx.fillStyle='#c9a882';ctx.beginPath();ctx.arc(sx,sy-42*s-br,4.5*s,0,7);ctx.fill();ctx.fillStyle='#b03a2e';ctx.fillRect(sx-1*s,sy-30*s,2*s,7*s);ctx.fillRect(sx-3.5*s,sy-27.5*s,7*s,2*s);}}
  else if(o.type==='exit'){const sealed=!!sealOf(o.to)||!!o.lock;
    ctx.fillStyle=vgrad(sy-50*s,sy,'#8a7c64','#4a4030');ctx.beginPath();ctx.moveTo(sx-18*s,sy);ctx.lineTo(sx-18*s,sy-30*s);ctx.quadraticCurveTo(sx,sy-52*s,sx+18*s,sy-30*s);ctx.lineTo(sx+18*s,sy);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=1;ctx.beginPath();for(let k=1;k<4;k++){ctx.moveTo(sx-18*s,sy-k*8*s);ctx.lineTo(sx-11*s,sy-k*8*s);ctx.moveTo(sx+11*s,sy-k*8*s);ctx.lineTo(sx+18*s,sy-k*8*s);}ctx.stroke();
    ctx.fillStyle=sealed?vgrad(sy-38*s,sy,'#7a2414','#2a0a06'):vgrad(sy-38*s,sy,'#000','#1a1410');ctx.beginPath();ctx.moveTo(sx-11*s,sy);ctx.lineTo(sx-11*s,sy-26*s);ctx.quadraticCurveTo(sx,sy-40*s,sx+11*s,sy-26*s);ctx.lineTo(sx+11*s,sy);ctx.closePath();ctx.fill();
    if(sealed){ctx.strokeStyle='#e8a040';ctx.lineWidth=1.5*s;ctx.beginPath();ctx.arc(sx,sy-18*s,5*s,0,7);ctx.moveTo(sx,sy-25*s);ctx.lineTo(sx,sy-11*s);ctx.stroke();}}
  else if(o.type==='chest'){ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(sx,sy,14*s,6*s,0,0,7);ctx.fill();
    ctx.fillStyle=vgrad(sy-16*s,sy-2*s,'#6a4422','#3a2410');ctx.fillRect(sx-11*s,sy-14*s,22*s,12*s);ctx.fillStyle='#8a8e96';ctx.fillRect(sx-11*s,sy-10*s,22*s,1.5*s);
    if(o.open){ctx.fillStyle='#1a1008';ctx.fillRect(sx-11*s,sy-16*s,22*s,3*s);ctx.fillStyle='#4a3018';ctx.fillRect(sx-11*s,sy-26*s,22*s,10*s);}
    else{ctx.fillStyle=vgrad(sy-22*s,sy-14*s,'#7e5430','#4a3018');ctx.beginPath();ctx.ellipse(sx,sy-14*s,11*s,6*s,0,Math.PI,0);ctx.fill();}
    if(o.relic&&!o.open){ctx.shadowColor='#ffd060';ctx.shadowBlur=12+Math.sin(S.t*4)*5;}ctx.fillStyle=o.relic?'#e8c46a':'#a08040';ctx.fillRect(sx-2*s,sy-14*s,4*s,5*s);ctx.shadowBlur=0;}
  else if(o.type==='stash'){shadow(sx,sy,18);ctx.fillStyle=vgrad(sy-22*s,sy,'#5a3a1e','#2a180a');ctx.fillRect(sx-16*s,sy-20*s,32*s,18*s);ctx.fillStyle=vgrad(sy-30*s,sy-20*s,'#7a5028','#4a2e14');ctx.beginPath();ctx.ellipse(sx,sy-20*s,16*s,8*s,0,Math.PI,0);ctx.fill();
    ctx.fillStyle='#8a8e96';for(const k of[-10,0,10]){ctx.fillRect(sx+k*s-1.5*s,sy-27*s,3*s,25*s);}ctx.fillStyle='#e8c060';ctx.fillRect(sx-3*s,sy-18*s,6*s,6*s);ctx.fillStyle='#2a1a0a';ctx.fillRect(sx-1*s,sy-16*s,2*s,3*s);}
  else if(o.type==='rift'){const on=riftOpen();shadow(sx,sy,16);ctx.fillStyle=vgrad(sy-60*s,sy,'#4a4258','#1e1a26');ctx.beginPath();ctx.moveTo(sx-11*s,sy);ctx.lineTo(sx-8*s,sy-46*s);ctx.lineTo(sx-1*s,sy-60*s);ctx.lineTo(sx+7*s,sy-50*s);ctx.lineTo(sx+11*s,sy);ctx.closePath();ctx.fill();
    if(on){ctx.shadowColor='#c070ff';ctx.shadowBlur=14;ctx.strokeStyle=`rgba(210,150,255,${.7+Math.sin(S.t*3)*.3})`;ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(sx-2*s,sy-50*s);ctx.lineTo(sx+3*s,sy-36*s);ctx.lineTo(sx-3*s,sy-24*s);ctx.lineTo(sx+2*s,sy-10*s);ctx.stroke();ctx.shadowBlur=0;}}
  else if(o.type==='fire'){ctx.fillStyle='#4a4038';for(let k=0;k<7;k++){const a=k/7*6.28;ctx.beginPath();ctx.ellipse(sx+Math.cos(a)*12*s,sy+Math.sin(a)*6*s,3.5*s,2.5*s,0,0,7);ctx.fill();}
    ctx.strokeStyle='#3a2414';ctx.lineWidth=4*s;ctx.beginPath();ctx.moveTo(sx-10*s,sy-2*s);ctx.lineTo(sx+10*s,sy-6*s);ctx.moveTo(sx-10*s,sy-6*s);ctx.lineTo(sx+10*s,sy-2*s);ctx.stroke();
    flame(sx-3*s,sy-3*s,s*1.3,0);flame(sx+4*s,sy-3*s,s*1.1,2);}
}
function drawProp(o){
  const[sx,sy]=scr(o.x,o.y),s=Z*(o.s||1);
  if(o.k==='tree'){shadow(sx,sy,16);ctx.fillStyle=vgrad(sy-46*s,sy,'#3e3024','#1e1610');ctx.beginPath();ctx.moveTo(sx-5*s,sy);ctx.lineTo(sx-2*s,sy-44*s);ctx.lineTo(sx+2*s,sy-44*s);ctx.lineTo(sx+5*s,sy);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#2e241a';ctx.lineCap='round';for(const b of o.br){ctx.lineWidth=b.w*s;ctx.beginPath();const x0=sx,y0=sy-b.h*s,x1=x0+Math.cos(b.a)*b.l*s,y1=y0-Math.sin(b.a)*b.l*s;ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.lineTo(x1+Math.cos(b.a+b.t)*b.l*.5*s,y1-Math.sin(b.a+b.t)*b.l*.5*s);ctx.stroke();}}
  else if(o.k==='grave'){shadow(sx,sy,9);ctx.save();ctx.translate(sx,sy);ctx.rotate(o.t);ctx.fillStyle='#4e4b44';ctx.beginPath();ctx.moveTo(-6*s,0);ctx.lineTo(-6*s,-16*s);ctx.arc(-1*s,-16*s,5*s,Math.PI,0);ctx.lineTo(4*s,0);ctx.fill();
    ctx.fillStyle=vgrad(-24*s,0,'#8a867c','#5a564e');ctx.beginPath();ctx.moveTo(-8*s,0);ctx.lineTo(-8*s,-16*s);ctx.arc(-1*s,-16*s,7*s,Math.PI,0);ctx.lineTo(6*s,0);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=1.2*s;ctx.beginPath();ctx.moveTo(-1*s,-20*s);ctx.lineTo(-1*s,-10*s);ctx.moveTo(-4*s,-16*s);ctx.lineTo(2*s,-16*s);ctx.stroke();ctx.restore();}
  else if(o.k==='rock'){ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(sx,sy,9*s,4*s,0,0,7);ctx.fill();ctx.fillStyle=vgrad(sy-12*s,sy,'#7a746a','#3e3a34');ctx.beginPath();ctx.moveTo(sx-9*s,sy);ctx.lineTo(sx-7*s,sy-7*s);ctx.lineTo(sx-1*s,sy-11*s);ctx.lineTo(sx+6*s,sy-8*s);ctx.lineTo(sx+9*s,sy-1*s);ctx.closePath();ctx.fill();}
  else if(o.k==='bones'){ctx.strokeStyle='#cfc6b2';ctx.lineWidth=2*Z;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(sx-8*Z,sy-2*Z);ctx.lineTo(sx+4*Z,sy+3*Z);ctx.moveTo(sx-3*Z,sy+4*Z);ctx.lineTo(sx+6*Z,sy-3*Z);ctx.stroke();ctx.fillStyle='#e0d8c6';ctx.beginPath();ctx.arc(sx+8*Z,sy-1*Z,3.5*Z,0,7);ctx.fill();ctx.fillStyle='#1a1410';ctx.fillRect(sx+7*Z,sy-2*Z,1.5*Z,1.5*Z);}
  else if(o.k==='coffin'){const P=[[-.7,0],[-.5,-.26],[.6,-.18],[.72,0],[.6,.18],[-.5,.26]].map(([a,b])=>o.rot?[b,a]:[a,b]).map(([a,b])=>scr(o.x+a,o.y+b));
    poly(P.map(q=>[q[0],q[1]]),'#1e140c');poly(P.map(q=>[q[0],q[1]-9*Z]),'#5a3c22');ctx.strokeStyle='#2a1a0e';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]-9*Z);ctx.lineTo(P[3][0],P[3][1]-9*Z);ctx.stroke();}
  else if(o.k==='brazier'){shadow(sx,sy,8);ctx.strokeStyle='#2a2622';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(sx-6*s,sy);ctx.lineTo(sx,sy-16*s);ctx.lineTo(sx+6*s,sy);ctx.moveTo(sx,sy+2*s);ctx.lineTo(sx,sy-16*s);ctx.stroke();
    ctx.fillStyle='#3a3632';ctx.beginPath();ctx.ellipse(sx,sy-17*s,9*s,4*s,0,0,Math.PI);ctx.fill();ctx.fillStyle='#ff8a3a';ctx.beginPath();ctx.ellipse(sx,sy-17*s,8*s,3*s,0,0,7);ctx.fill();flame(sx,sy-17*s,s,o.x);}
  else if(o.k==='torch'){ctx.strokeStyle='#4a3420';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx,sy-34*s);ctx.stroke();flame(sx,sy-34*s,s*.9,o.y);}
  else if(o.k==='barrel'){shadow(sx,sy,8);ctx.fillStyle=vgrad(sy-18*s,sy,'#7a5430','#3e2814');ctx.fillRect(sx-7*s,sy-16*s,14*s,15*s);ctx.beginPath();ctx.ellipse(sx,sy-1*s,7*s,3*s,0,0,Math.PI);ctx.fill();
    ctx.fillStyle='#5a3c20';ctx.beginPath();ctx.ellipse(sx,sy-16*s,7*s,3*s,0,0,7);ctx.fill();ctx.strokeStyle='#2a2622';ctx.lineWidth=1.5*s;ctx.beginPath();ctx.moveTo(sx-7*s,sy-12*s);ctx.lineTo(sx+7*s,sy-12*s);ctx.moveTo(sx-7*s,sy-5*s);ctx.lineTo(sx+7*s,sy-5*s);ctx.stroke();}
  else if(o.k==='crate'){const hw=13*s,hh=6.5*s,h=14*s;poly([[sx-hw,sy-h],[sx,sy+hh-h],[sx,sy+hh],[sx-hw,sy]],'#6a4c2c');poly([[sx,sy+hh-h],[sx+hw,sy-h],[sx+hw,sy],[sx,sy+hh]],'#4a3420');poly([[sx,sy-hh-h],[sx+hw,sy-h],[sx,sy+hh-h],[sx-hw,sy-h]],'#8a6a40');
    ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx-hw,sy-h);ctx.lineTo(sx,sy+hh);ctx.moveTo(sx,sy+hh-h);ctx.lineTo(sx+hw,sy);ctx.stroke();}
  else if(o.k==='anvil'){shadow(sx,sy,10);ctx.fillStyle='#3a3632';ctx.fillRect(sx-4*s,sy-10*s,8*s,10*s);ctx.fillStyle=vgrad(sy-16*s,sy-10*s,'#8a8e96','#4a4e56');ctx.beginPath();ctx.moveTo(sx-12*s,sy-16*s);ctx.lineTo(sx+8*s,sy-16*s);ctx.lineTo(sx+13*s,sy-13*s);ctx.lineTo(sx+6*s,sy-10*s);ctx.lineTo(sx-8*s,sy-10*s);ctx.closePath();ctx.fill();if(Math.random()<.04)S.parts.push({x:o.x,y:o.y,z:.8,vx:rnd(-1,1),vy:rnd(-1,1),vz:rnd(1,2),life:.4,col:'#ffd060'});}
  else if(o.k==='banner'){ctx.strokeStyle='#3a2a1a';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx,sy-60*s);ctx.stroke();const w=Math.sin(S.t*2)*3*s;
    ctx.fillStyle=vgrad(sy-58*s,sy-26*s,'#8a1e18','#4a0e0a');ctx.beginPath();ctx.moveTo(sx,sy-58*s);ctx.lineTo(sx+16*s+w,sy-56*s);ctx.lineTo(sx+14*s+w,sy-30*s);ctx.lineTo(sx+7*s+w*.5,sy-35*s);ctx.lineTo(sx,sy-28*s);ctx.closePath();ctx.fill();
    ctx.fillStyle='#c9a45c';ctx.beginPath();ctx.arc(sx+8*s+w*.5,sy-46*s,3*s,0,7);ctx.fill();}
  else if(o.k==='tent'){const A=scr(o.x,o.y),B=scr(o.x+3,o.y),C=scr(o.x+3,o.y+2),D=scr(o.x,o.y+2),Hh=48*Z;const R1=scr(o.x,o.y+1),R2=scr(o.x+3,o.y+1);R1[1]-=Hh;R2[1]-=Hh;
    poly([A,B,R2,R1],o.c[1]);poly([B,C,R2],o.c[2]);const m=[(B[0]+C[0])/2,(B[1]+C[1])/2];poly([[m[0]-8*Z,m[1]-3*Z],[m[0]+8*Z,m[1]+3*Z],[m[0]+3*Z,m[1]-24*Z]],'#140e08');
    poly([D,C,R2,R1],o.c[0]);ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=2*Z;ctx.beginPath();for(let k=1;k<3;k++){const t=k/3;ctx.moveTo(D[0]+(C[0]-D[0])*t,D[1]+(C[1]-D[1])*t);ctx.lineTo(R1[0]+(R2[0]-R1[0])*t,R1[1]+(R2[1]-R1[1])*t);}ctx.stroke();
    ctx.strokeStyle='#2a1c10';ctx.lineWidth=2.5*Z;ctx.beginPath();ctx.moveTo(R1[0],R1[1]-6*Z);ctx.lineTo(R1[0],R1[1]);ctx.lineTo(R2[0],R2[1]);ctx.lineTo(R2[0],R2[1]-6*Z);ctx.stroke();}
}
function drawWp(o){const[sx,sy]=scr(o.x,o.y),s=Z,on=S.wps[S.cur.id];ctx.fillStyle=vgrad(sy-13*s,sy+13*s,'#4a4a52','#22222a');ctx.beginPath();ctx.ellipse(sx,sy,28*s,14*s,0,0,7);ctx.fill();ctx.fillStyle='#16161c';ctx.beginPath();ctx.ellipse(sx,sy+3*s,28*s,14*s,0,0,Math.PI);ctx.fill();ctx.beginPath();ctx.ellipse(sx,sy,28*s,14*s,0,0,7);ctx.fillStyle='#3a3a44';ctx.fill();
  ctx.strokeStyle=on?'#6fa0ff':'#555';ctx.lineWidth=2*s;if(on){ctx.shadowColor='#6fa0ff';ctx.shadowBlur=10;}ctx.beginPath();ctx.ellipse(sx,sy,21*s,10.5*s,0,0,7);ctx.stroke();
  for(let k=0;k<6;k++){const a=k/6*6.28+(on?S.t*.6:0);ctx.beginPath();ctx.arc(sx+Math.cos(a)*16*s,sy+Math.sin(a)*8*s,1.6*s,0,7);ctx.fillStyle=on?'#bfd0ff':'#555';ctx.fill();}
  if(on){ctx.setLineDash([4*s,6*s]);ctx.lineDashOffset=-S.t*20;ctx.beginPath();ctx.ellipse(sx,sy,12*s,6*s,0,0,7);ctx.stroke();ctx.setLineDash([]);}ctx.shadowBlur=0;}
function drawPortal(o){const[sx,sy]=scr(o.x,o.y),s=Z;const g=ctx.createRadialGradient(sx,sy-26*s,2,sx,sy-26*s,24*s);g.addColorStop(0,'#e8f0ff');g.addColorStop(.4,'#5a8cff');g.addColorStop(1,'rgba(30,50,160,.1)');
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(sx,sy-26*s,13*s+Math.sin(S.t*5)*s,24*s,0,0,7);ctx.fill();ctx.strokeStyle='rgba(180,210,255,.7)';ctx.lineWidth=2*s;for(let k=0;k<2;k++){ctx.beginPath();ctx.ellipse(sx,sy-26*s,(8-k*3)*s,(17-k*5)*s,S.t*(2+k),0,4);ctx.stroke();}}
function drawProj(pr){const[sx,sy]=scr(pr.x,pr.y),s=Z;
  if(pr.kind==='fire'){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy-14*s,0,sx,sy-14*s,12*s);g.addColorStop(0,'rgba(255,240,190,1)');g.addColorStop(.35,'rgba(255,150,50,.9)');g.addColorStop(1,'rgba(255,60,10,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy-14*s,12*s,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';}
  else if(pr.kind==='mbolt'){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy-14*s,0,sx,sy-14*s,9*s);g.addColorStop(0,'rgba(230,200,255,1)');g.addColorStop(1,'rgba(140,60,220,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy-14*s,9*s,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';}
  else if(pr.kind==='bolt'){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy-14*s,0,sx,sy-14*s,9*s);g.addColorStop(0,'rgba(255,200,120,1)');g.addColorStop(1,'rgba(220,40,10,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy-14*s,9*s,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';}
  else{const[dx,dy]=sdir(Math.atan2(pr.vy,pr.vx));const l=Math.hypot(dx,dy);ctx.strokeStyle='#d8cfbb';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(sx-dx/l*9*s,sy-14*s-dy/l*9*s);ctx.lineTo(sx+dx/l*9*s,sy-14*s+dy/l*9*s);ctx.stroke();}}
function drawMini(){
  const z=S.cur,w=mm.width,h=mm.height;mctx.clearRect(0,0,w,h);const cx=w/2,cy=h/2,k=3;
  for(let y=0;y<z.h;y++)for(let x=0;x<z.w;x++){const i=y*z.w+x;const wall=z.g[i]===1&&!z.hide[i];if(wall){if(!z.near[i]||!neighSeen(z,x,y))continue;}else if(!z.seen[i])continue;
    const mx=cx+((x-y)-(p.x-p.y))*k,my=cy+((x+y)-(p.x+p.y))*k/2;if(mx<0||my<0||mx>w||my>h)continue;
    mctx.fillStyle=wall?'rgba(200,180,140,.75)':'rgba(120,105,80,.35)';mctx.fillRect(mx,my,k,k/2+1);}
  const dot=(x,y,c,r)=>{const mx=cx+((x-y)-(p.x-p.y))*k,my=cy+((x+y)-(p.x+p.y))*k/2;mctx.fillStyle=c;mctx.beginPath();mctx.arc(mx,my,r,0,7);mctx.fill();};
  for(const o of z.objs){if(!z.seen[Math.floor(o.y)*z.w+Math.floor(o.x)])continue;if(o.type==='exit')dot(o.x,o.y,'#e8c46a',4);if(o.type==='wp')dot(o.x,o.y,'#6fa0ff',4);if(o.type==='npc')dot(o.x,o.y,'#7fd07f',3);if(o.type==='chest'&&o.relic&&!o.open)dot(o.x,o.y,'#ffd060',3);}
  for(const po of portalsIn(z))dot(po.x,po.y,'#9fb8ff',4);
  for(const m of z.mons)if(m.mini&&!m.dead&&z.seen[Math.floor(m.y)*z.w+Math.floor(m.x)])dot(m.x,m.y,'#e8c46a',5);
  dot(p.x,p.y,'#ff4a3a',4);
}
function neighSeen(z,x,y){for(const[dx,dy]of DIR8){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<z.w&&ny<z.h&&z.seen[ny*z.w+nx]&&(!z.g[ny*z.w+nx]||z.hide[ny*z.w+nx]))return true;}return false;}


