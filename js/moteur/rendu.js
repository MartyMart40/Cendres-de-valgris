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
/* v6.15 : on rend tout de suite la mémoire d’un sol cuit (les téléphones, surtout l’iPhone, limitent la mémoire des canevas) */
function freeCv(o){if(o&&o.fcv){try{o.fcv.width=o.fcv.height=0;}catch(e){}}if(o)o.fcv=null;}
function bakeFloor(z){freeCv(z);
  const hw=TW/2*Z,hh=TH/2*Z,ox=(z.h+1)*hw;
  /* v6.36 : Safari refuse les canevas de plus de 16,7 millions de pixels (iPad, téléphone en paysage). Au-delà de 14 millions, on cuit le sol en plus petit et on l’étire au dessin. */
  const W0=Math.ceil((z.w+z.h+2)*hw),H0=Math.ceil((z.w+z.h+2)*hh),FK=Math.min(1,Math.sqrt(14e6/(W0*H0)));
  const c=document.createElement('canvas');c.width=Math.ceil(W0*FK);c.height=Math.ceil(H0*FK);
  const g=c.getContext('2d');if(FK<1)g.scale(FK,FK);z.fk=FK;const R=rng(z.seed);
  const pt=(sx,sy)=>{const u=R(),v=R();return[sx+(u-v)*hw,sy+(u+v)*hh];};
  const NK=natKind(z),NC=NK?({water:'#132420',tree:'#121c0c',ice:'#1a2a40',hedge:'#4a4a40',dune:shade(palOf(z.style).wall,.8)}[NK]||shade(palOf(z.style).wall,.45)):null;
  for(let y=0;y<z.h;y++)for(let x=0;x<z.w;x++){const i=y*z.w+x;if(z.g[i]===1&&!z.hide[i]){if(NC){dia(g,ox+(x-y)*hw,(x+y)*hh,hw+.5,hh+.5);g.fillStyle=NC;g.fill();}continue;}
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
  /* v5.67 : grandes taches cuites dans le sol (terre, humidité, brûlures), une seule fois par zone */
  if(z.id!=='town'){const N=Math.round(z.w*z.h/26);for(let k=0;k<N;k++){const x=Math.floor(R()*z.w),y=Math.floor(R()*z.h),i=y*z.w+x;if(z.g[i]===1)continue;const px=ox+(x-y)*hw,py=(x+y)*hh+hh,rr=(1.2+R()*2.2)*hw;
      const col=z.style==='plain'?(R()<.5?'40,32,22':'50,58,34'):z.style==='crypt'?(R()<.6?'10,12,18':'40,44,40'):(R()<.7?'20,6,2':'70,30,10');
      const gg=g.createRadialGradient(px,py,0,px,py,rr);gg.addColorStop(0,`rgba(${col},${(.18+R()*.16).toFixed(2)})`);gg.addColorStop(1,`rgba(${col},0)`);g.save();g.translate(px,py);g.scale(1,.5);g.translate(-px,-py);g.fillStyle=gg;g.beginPath();g.arc(px,py,rr,0,7);g.fill();g.restore();}
    for(let k=0;k<Math.round(z.w*z.h/40);k++){const x=Math.floor(R()*z.w),y=Math.floor(R()*z.h);if(z.g[y*z.w+x]===1)continue;const px=ox+(x-y)*hw+(R()-.5)*hw,py=(x+y)*hh+hh+(R()-.5)*hh;
      for(let j=0;j<3+R()*4;j++){const a=R()*6.28,d=R()*6*Z;g.fillStyle=R()<.5?'rgba(0,0,0,.35)':'rgba(220,210,190,.12)';g.beginPath();g.ellipse(px+Math.cos(a)*d,py+Math.sin(a)*d*.5,(1+R()*1.8)*Z,(.7+R())*Z,0,0,7);g.fill();}}}
  /* v5.92 : petits détails cuits au sol selon le monde (touffes, cailloux, éclats de glace, champignons, ossements, limaille, paillettes d’or) */
  if(z.id!=='town'){const th=(z.palTheme||curWorld().theme);
    for(let k=0;k<Math.round(z.w*z.h/14);k++){const x=Math.floor(R()*z.w),y=Math.floor(R()*z.h);if(z.g[y*z.w+x]===1)continue;const px=ox+(x-y)*hw+(R()-.5)*hw*1.2,py=(x+y)*hh+hh+(R()-.5)*hh*1.2,r=R();
      if(r<.35){g.fillStyle=R()<.5?'rgba(110,104,96,.6)':'rgba(70,66,60,.6)';g.beginPath();g.ellipse(px,py,(1.2+R()*1.8)*Z,(.8+R())*Z,0,0,7);g.fill();g.fillStyle='rgba(255,255,255,.12)';g.fillRect(px-.6*Z,py-.8*Z,1*Z,.6*Z);}
      else if(r<.6&&z.style==='plain'){g.strokeStyle=th==='givre'?'rgba(200,220,235,.5)':th==='marais'?'rgba(90,120,60,.7)':th==='pre'?'rgba(170,170,160,.6)':'rgba(110,100,60,.6)';g.lineWidth=1;g.beginPath();for(let j=0;j<5;j++){g.moveTo(px+j*1.2*Z-2.4*Z,py);g.lineTo(px+j*1.2*Z-2.4*Z+(R()-.5)*3*Z,py-(3+R()*4)*Z);}g.stroke();}
      else if(r<.72){if(th==='givre'){g.fillStyle='rgba(200,235,255,.55)';g.beginPath();g.moveTo(px,py-5*Z);g.lineTo(px+1.6*Z,py);g.lineTo(px-1.6*Z,py);g.fill();}
        else if(th==='marais'){g.fillStyle='#d8c8a0';g.fillRect(px-.5*Z,py-3*Z,1*Z,3*Z);g.fillStyle='rgba(160,90,60,.85)';g.beginPath();g.ellipse(px,py-3*Z,2.2*Z,1.3*Z,0,Math.PI,0);g.fill();}
        else if(th==='ossu'||th==='cendres'){g.strokeStyle='rgba(220,212,196,.5)';g.lineWidth=1.2*Z;g.beginPath();g.moveTo(px-3*Z,py);g.lineTo(px+3*Z,py-1*Z);g.stroke();g.fillStyle='rgba(220,212,196,.5)';g.beginPath();g.arc(px-3*Z,py,.9*Z,0,7);g.arc(px+3*Z,py-1*Z,.9*Z,0,7);g.fill();}
        else if(th==='fonte'){g.fillStyle='rgba(200,150,70,.5)';for(let j=0;j<3;j++)g.fillRect(px+(R()-.5)*5*Z,py+(R()-.5)*2*Z,1.4*Z,.8*Z);}
        else if(th==='astre'){g.fillStyle='rgba(255,240,180,.55)';for(let j=0;j<3;j++){g.beginPath();g.arc(px+(R()-.5)*5*Z,py+(R()-.5)*2*Z,.6*Z,0,7);g.fill();}}}}}
  z.fcv=c;z.fox=ox;z.bz=Z;
}
/* v6.28 : bordures naturelles dehors. Les zones de plaine ne sont plus fermées par des murs : arbres en forêt, dunes au désert, eau profonde au marais,
   crevasses de glace au givre, rochers ailleurs. Cryptes, antres et mondes bâtis (fonderie, ossuaire, forge céleste) gardent leurs murs. Ils bloquent toujours le passage et les tirs. */
const NATK={foret:'tree',desert:'dune',marais:'water',givre:'ice',volcan:'rock',cendres:'rock',abime:'rock',pre:'hedge'};
function natKind(z){if(z.style!=='plain'||z.id==='town')return null;return NATK[z.palTheme||curWorld().theme]||null;}
function hash2(x,y){let h=(x*374761393+y*668265263)>>>0;h=(h^(h>>>13))*1274126177>>>0;return(h>>>0)/4294967296;}
function drawNatural(z,x,y,sx,sy,fade,k){const hw=TW/2*Z,hh=TH/2*Z,r=hash2(x,y),wc=palOf(z.style).wall,cx=sx,cy=sy+hh;if(fade)ctx.globalAlpha=.35;
  if(k==='water'){ctx.fillStyle=`rgb(${18+r*6|0},${34+r*8|0},${30+r*6|0})`;dia(ctx,sx,sy,hw+.5,hh+.5);ctx.fill();const a=.12+.1*Math.sin(S.t*1.5+x*.7+y*.4);ctx.strokeStyle=`rgba(170,200,180,${a.toFixed(2)})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx-hw*.4,cy+Math.sin(S.t+x)*2*Z);ctx.lineTo(cx+hw*.2,cy+Math.sin(S.t+x)*2*Z-1);ctx.stroke();
    for(const[dx,dy,ex,ey]of[[-1,0,-1,0],[0,-1,1,0],[1,0,1,0],[0,1,-1,0]]){if(!isWall(z,x+dx,y+dy)){ctx.strokeStyle='rgba(210,225,210,.25)';ctx.lineWidth=2*Z;ctx.beginPath();if(dx===-1){ctx.moveTo(sx,sy);ctx.lineTo(sx-hw,sy+hh);}else if(dy===-1){ctx.moveTo(sx,sy);ctx.lineTo(sx+hw,sy+hh);}else if(dx===1){ctx.moveTo(sx+hw,sy+hh);ctx.lineTo(sx,sy+2*hh);}else{ctx.moveTo(sx-hw,sy+hh);ctx.lineTo(sx,sy+2*hh);}ctx.stroke();}}ctx.globalAlpha=1;return;}
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(cx,cy,hw*.95,hh*.95,0,0,7);ctx.fill();
  if(k==='tree'){const h=(30+r*22)*Z,G=['#1e3a14','#2a4a1a','#3a5a22'],g2=['#24401a','#335a20','#4a7a2a'];ctx.fillStyle='#3a2a18';ctx.fillRect(cx-2.5*Z,cy-h*.45,5*Z,h*.45);
    for(let i=0;i<3;i++){const ox=(hash2(x+i,y)-.5)*hw*.7,oy=-h*(.45+i*.18),rr=(13-i*2.5)*Z*(.9+r*.3);ctx.fillStyle=(r>.5?G:g2)[i];ctx.beginPath();ctx.arc(cx+ox,cy+oy,rr,0,7);ctx.fill();}
    ctx.fillStyle='rgba(255,255,220,.06)';ctx.beginPath();ctx.arc(cx-4*Z,cy-h*.85,6*Z,0,7);ctx.fill();}
  else if(k==='hedge'){const h=(14+r*10)*Z;for(let i=0;i<4;i++){const ox=(i-1.5)*hw*.38,rr=(8+hash2(x,y+i)*4)*Z;ctx.fillStyle=i%2?'#7a7a6a':'#8e8e7c';ctx.beginPath();ctx.arc(cx+ox,cy-h*.5-(i%2)*3*Z,rr,0,7);ctx.fill();}ctx.strokeStyle='rgba(60,60,50,.6)';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<5;i++){const ox=(hash2(x+i,y+1)-.5)*hw*1.4;ctx.moveTo(cx+ox,cy);ctx.lineTo(cx+ox+3*Z,cy-h);}ctx.stroke();}
  else if(k==='dune'){const h=(10+r*14)*Z,g=ctx.createLinearGradient(cx,cy-h,cx,cy+hh);g.addColorStop(0,shade(wc,1.25));g.addColorStop(1,shade(wc,.75));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(cx-hw*1.05,cy+hh*.3);ctx.quadraticCurveTo(cx-hw*.3,cy-h*1.1,cx+hw*.2,cy-h);ctx.quadraticCurveTo(cx+hw*.8,cy-h*.6,cx+hw*1.05,cy+hh*.3);ctx.quadraticCurveTo(cx,cy+hh*1.1,cx-hw*1.05,cy+hh*.3);ctx.fill();
    ctx.strokeStyle='rgba(255,240,200,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx-hw*.3,cy-h*.9);ctx.quadraticCurveTo(cx,cy-h*.5,cx+hw*.4,cy-h*.3);ctx.stroke();}
  else if(k==='ice'){const h=(14+r*20)*Z;ctx.fillStyle='rgba(20,40,70,.7)';dia(ctx,sx,sy,hw*.9,hh*.9);ctx.fill();for(let i=0;i<3;i++){const ox=(i-1)*hw*.45+(hash2(x,y+i)-.5)*6*Z,hh2=h*(.6+hash2(x+i,y)*.6);ctx.fillStyle=i===1?'rgba(200,230,255,.85)':'rgba(160,200,235,.8)';ctx.beginPath();ctx.moveTo(cx+ox-6*Z,cy);ctx.lineTo(cx+ox-2*Z,cy-hh2);ctx.lineTo(cx+ox+3*Z,cy-hh2*.8);ctx.lineTo(cx+ox+6*Z,cy);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1;ctx.stroke();}}
  else{const h=(16+r*20)*Z,pts=[];for(let i=0;i<7;i++){const a=Math.PI+i/6*Math.PI,rr=hw*(.75+hash2(x+i,y)*.3);pts.push([cx+Math.cos(a)*rr,cy+Math.sin(a)*h*.9*(i===0||i===6?.1:1)-(i>0&&i<6?h*.2:0)]);}
    const g=ctx.createLinearGradient(cx,cy-h,cx,cy+hh*.5);g.addColorStop(0,shade(wc,1.15));g.addColorStop(1,shade(wc,.55));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(cx-hw*.8,cy+hh*.4);for(const q of pts)ctx.lineTo(q[0],q[1]);ctx.lineTo(cx+hw*.8,cy+hh*.4);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pts[2][0],pts[2][1]);ctx.lineTo(cx,cy);ctx.stroke();}
  ctx.globalAlpha=1;}
function drawWall(z,x,y,sx,sy,fade){{const k_=natKind(z);if(k_){drawNatural(z,x,y,sx,sy,fade,k_);return;}}
  const hw=TW/2*Z,hh=TH/2*Z,h=z.wh[y*z.w+x]*Z,wc=palOf(z.style).wall;
  if(fade)ctx.globalAlpha=.3;
  /* v5.67 : faces en dégradé (ombre au pied), légère variation par bloc */
  const vq=(x*7349+y*1931)%4,vr=.92+vq*.053,key=wc.join()+'|'+Math.round(h)+'|'+vq;if(WGZ!==Z){WGC.clear();WGZ=Z;}let G_=WGC.get(key);
  if(!G_){const mk=(a,b,c)=>{const g=ctx.createLinearGradient(0,hh-h,0,2*hh);g.addColorStop(0,shade(wc,a*vr));g.addColorStop(.7,shade(wc,b*vr));g.addColorStop(1,shade(wc,c*vr));return g;};G_=[mk(.82,.66,.4),mk(.58,.45,.26)];WGC.set(key,G_);}
  ctx.save();ctx.translate(sx,sy);poly([[-hw,hh-h],[0,2*hh-h],[0,2*hh],[-hw,hh]],G_[0]);poly([[0,2*hh-h],[hw,hh-h],[hw,hh],[0,2*hh]],G_[1]);ctx.restore();
  ctx.strokeStyle='rgba(0,0,0,.38)';ctx.lineWidth=1;ctx.beginPath();
  if(z.style==='crypt'||z.style==='lair'){
    for(let k=1;k<4;k++){const o=h*k/4;ctx.moveTo(sx-hw,sy+hh-h+o);ctx.lineTo(sx,sy+2*hh-h+o);ctx.lineTo(sx+hw,sy+hh-h+o);}
    for(let k=0;k<4;k++){const o=h*k/4,ts=k%2?[.5]:[.25,.75];for(const t of ts){ctx.moveTo(sx-hw+t*hw,sy+hh+t*hh-h+o);ctx.lineTo(sx-hw+t*hw,sy+hh+t*hh-h+o+h/4);ctx.moveTo(sx+t*hw,sy+2*hh-t*hh-h+o);ctx.lineTo(sx+t*hw,sy+2*hh-t*hh-h+o+h/4);}}
  }else if(z.style==='town'){
    for(let k=1;k<4;k++){const t=k/4;ctx.moveTo(sx-hw+t*hw,sy+hh+t*hh-h);ctx.lineTo(sx-hw+t*hw,sy+hh+t*hh);ctx.moveTo(sx+t*hw,sy+2*hh-t*hh-h);ctx.lineTo(sx+t*hw,sy+2*hh-t*hh);}
  }
  ctx.stroke();
  if(z.style==='plain'){poly([[sx-hw,sy+hh-h*.4],[sx,sy+2*hh-h*.4],[sx,sy+2*hh],[sx-hw,sy+hh]],'rgba(0,0,0,.2)');poly([[sx,sy+2*hh-h*.4],[sx+hw,sy+hh-h*.4],[sx+hw,sy+hh],[sx,sy+2*hh]],'rgba(0,0,0,.2)');}
  /* v5.92 : détails sur les murs, tirés de la position du bloc (toujours les mêmes) */
  if(!p.eco&&h>14*Z){const r=((x*92821+y*68917)>>>0)%100,th=skyKey(z);
    if(r<22){ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=1;ctx.beginPath();const cx=sx-hw*.55,cy=sy+hh*.45-h*.75;ctx.moveTo(cx,cy);ctx.lineTo(cx+3*Z,cy+6*Z);ctx.lineTo(cx+1*Z,cy+11*Z);ctx.lineTo(cx+5*Z,cy+17*Z);ctx.moveTo(cx+3*Z,cy+6*Z);ctx.lineTo(cx+7*Z,cy+8*Z);ctx.stroke();}
    if(r>=22&&r<34&&(z.style==='plain'||th==='marais')){ctx.fillStyle=th==='marais'?'rgba(70,110,50,.55)':'rgba(70,90,50,.4)';for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(sx+hw*(.2+k*.15),sy+2*hh-hh*(k*.3)-3*Z,(3+k%2*2)*Z,2*Z,0,0,7);ctx.fill();}}
    if(r>=34&&r<42&&z.style==='crypt'){ctx.strokeStyle='rgba(220,220,230,.28)';ctx.lineWidth=.8;const cx=sx,cy=sy+2*hh-h+2*Z;ctx.beginPath();for(let k=0;k<5;k++){const a=Math.PI*.15+k*Math.PI*.17;ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*14*Z,cy+Math.sin(a)*10*Z);}for(const rr of[5,9,13]){ctx.moveTo(cx+Math.cos(Math.PI*.15)*rr*Z,cy+Math.sin(Math.PI*.15)*rr*.7*Z);for(let k=1;k<5;k++){const a=Math.PI*.15+k*Math.PI*.17;ctx.lineTo(cx+Math.cos(a)*rr*Z,cy+Math.sin(a)*rr*.7*Z);}}ctx.stroke();}
    if(r>=42&&r<52){const px=sx+hw*.45,py=sy+hh*1.55-h*.5;ctx.fillStyle=shade(wc,.95);ctx.beginPath();ctx.moveTo(px-4*Z,py);ctx.lineTo(px+4*Z,py-2*Z);ctx.lineTo(px+5*Z,py+3*Z);ctx.lineTo(px-3*Z,py+5*Z);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(px-3*Z,py+4*Z,8*Z,1.5*Z);}
    if(r>=52&&r<57&&(z.style==='crypt'||z.style==='lair')){ctx.strokeStyle='#3a3632';ctx.lineWidth=1.4*Z;const cx=sx-hw*.4,cy=sy+hh*.6-h*.85;ctx.beginPath();for(let k=0;k<6;k++){ctx.moveTo(cx,cy+k*3.2*Z);ctx.lineTo(cx+(k%2?1.5:-1.5)*Z,cy+(k+1)*3.2*Z);}ctx.stroke();ctx.beginPath();ctx.arc(cx,cy+20*Z,2.5*Z,0,7);ctx.stroke();}
    if(r>=57&&r<62&&th==='marais'){ctx.strokeStyle='rgba(60,90,40,.7)';ctx.lineWidth=1.2*Z;ctx.beginPath();for(let k=0;k<3;k++){const vx=sx+hw*(.15+k*.25),vy=sy+2*hh-hh*(.3+k*.25)-h;ctx.moveTo(vx,vy);ctx.quadraticCurveTo(vx+3*Z,vy+h*.4,vx-1*Z,vy+h*.7);}ctx.stroke();}}
  dia(ctx,sx,sy-h,hw,hh);ctx.fillStyle=shade(wc,1.12);ctx.fill();
  if(z.style==='town'){ctx.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(sx+(k-1)*hw*.5,sy+hh-h+(k%2?2:0)*Z,2.2*Z,0,7);ctx.fill();}}
  ctx.strokeStyle='rgba(255,236,200,.2)';ctx.beginPath();ctx.moveTo(sx-hw,sy+hh-h);ctx.lineTo(sx,sy+2*hh-h);ctx.lineTo(sx+hw,sy+hh-h);ctx.stroke();
  ctx.globalAlpha=1;
}
function lightsOf(z){
  const L=[],push=(x,y,r,a,col)=>L.push({x,y,r,a,col});
  push(p.x,p.y,(z.id==='town'?9:6.5)*(zHas(z,'nuit')?.78:1)*(zHas(z,'brume')?.86:1)*(z.storm?.72:1),1,null);
  if(z.ev&&z.ev.id==='wisp'&&z.ev.state==='on')push(z.ev.wx,z.ev.wy,3,.95,'170,255,140');for(const o of z.objs)if(o.type==='pyre'&&o.lit)push(o.x,o.y,4.2,.95,'255,140,50');
  for(const o of z.objs){if(o.type==='rift'&&riftOpen())push(o.x,o.y,3.5,.9,'190,90,255');if(o.type==='fire')push(o.x,o.y,7+Math.sin(S.t*9)*.3,1,'255,140,50');if(o.type==='cart'&&o.state!=='fail')push(o.x,o.y,4,.95,'255,190,110');if(o.type==='cvdest')push(o.x,o.y,4.5,.9,'210,200,255');if(o.type==='pkey'&&!o.got)push(o.x,o.y,3,.9,'230,220,190');if(o.type==='wp')push(o.x,o.y,2.6,.8,'90,140,255');if(o.type==='priest'&&z.ward&&z.ward.state!=='fail')push(o.x,o.y,4,.95,'210,200,255');if(o.type==='sfire'&&o.F.state==='on')push(o.x,o.y,4,.95,'255,140,50');if(o.type==='exit')push(o.x,o.y,2,.5,null);if(o.type==='stone'&&o.on)push(o.x,o.y,3,.85,'120,210,255');}
  for(const o of z.props)if(o.k==='candles')push(o.x,o.y,1.8,.7,'255,190,110');
  for(const o of z.props)if(o.k==='torch'||o.k==='brazier')push(o.x,o.y,(o.k==='torch'?3.4:4.4)+Math.sin(S.t*11+o.x*3)*.15,.95,'255,140,50');
  for(const po of portalsIn(z))push(po.x,po.y,3,.9,'90,140,255');
  for(const mt of S.mets)push(mt.x,mt.y,2.5,.6,'255,110,40');
  if(S.flashes)for(const f of S.flashes){const k=f.t/f.m;L.push({x:f.x,y:f.y,r:f.r*(.6+.4*k),a:.95*k,col:f.c,g:.6*k});}
  for(const n of S.novas){const k=1-n.r/n.max;if(k>.05)L.push({x:n.x,y:n.y,r:n.r+1.2,a:.6*k,col:n.col||'170,220,255',g:.28*k});}
  if(p.buff>0)push(p.x,p.y,3,.4,'255,200,90');
  for(const pr of S.proj)push(pr.x,pr.y,pr.kind==='arrow'||pr.kind==='parrow'?.8:pr.kind==='sbolt'?1.6:2.4,.9,pr.kind==='arrow'||pr.kind==='parrow'?null:pr.kind==='sbolt'?'140,160,255':pr.kind==='mbolt'?'180,100,255':'255,110,40');
  for(const m of z.mons)if(m.t==='lanterne'&&!m.dead)push(m.x,m.y,2.4,.85,'230,220,150');
  for(const m of z.mons)if(m.boss&&!m.dead)push(m.x,m.y,m.divine!=null?5+5*m.divine:3.2,.7,m.divine!=null?'255,244,220':'255,60,30');
  for(const m of z.mons)if(m.divine!=null&&!m.dead){push(m.x-2.2*m.divine,m.y-2.2*m.divine,9*m.divine,.95,'255,240,210');push(m.x-4.4*m.divine,m.y-4.4*m.divine,8*m.divine,.9,'255,230,200');}
  if(z.shafts)for(const q of z.shafts)if(Math.abs(q.x-p.x)+Math.abs(q.y-p.y)<16)push(q.x,q.y,2.2*q.w,.8,null);
  if(z.vents)for(const v of z.vents)if(v.t<1.2&&Math.abs(v.x-p.x)+Math.abs(v.y-p.y)<14)push(v.x,v.y,1.6,.6*(1-v.t/1.2),VENTS[v.k].glow);
  if(z.lavaList)for(const l of z.lavaList)if(Math.abs(l.x-p.x)+Math.abs(l.y-p.y)<18)push(l.x,l.y,1.8,.7,palOf('lair').lavaLight||'255,90,30');
  return L;
}
/* v5.42 : camp vivant, passe 2. Le dernier bastion est une île de roc qui flotte au-dessus d’une mer de cendre. */
function drawIsle(z){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a1820');g.addColorStop(.55,'#3a3236');g.addColorStop(1,'#5a4a42');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const t=S.t||0;
  for(let k=0;k<9;k++){const cx=((k*197+t*(6+k%3*3))%(W+400))-200,cy=H*(.12+(k*37%60)/100);ctx.fillStyle=`rgba(90,80,84,${.18+(k%3)*.05})`;ctx.beginPath();ctx.ellipse(cx,cy,(80+k%4*30)*Z,(14+k%3*5)*Z,0,0,7);ctx.fill();}
  const L=scr(0,z.h),B=scr(z.w,z.h),R=scr(z.w,0),dep=320*Z,Rn=rng(77);
  const N=16,bot=[];for(let k=0;k<=N;k++){const u=k/N,top=u<=.5?[L[0]+(B[0]-L[0])*u*2,L[1]+(B[1]-L[1])*u*2]:[B[0]+(R[0]-B[0])*(u-.5)*2,B[1]+(R[1]-B[1])*(u-.5)*2];const d=(k===0||k===N)?6*Z:dep*(.18+.82*Math.pow(Math.sin(Math.PI*u),1.6))*(.7+.6*Rn());bot.push([top[0]+(Rn()-.5)*10*Z,top[1]+d,top]);}
  for(let k=0;k<N;k++){const A=bot[k],C=bot[k+1],left=k<N/2;ctx.fillStyle=vgrad(Math.min(A[2][1],C[2][1]),Math.max(A[1],C[1]),left?'#4a3e34':'#3a3029',left?'#120e0c':'#0c0a09');ctx.beginPath();ctx.moveTo(A[2][0],A[2][1]);ctx.lineTo(C[2][0],C[2][1]);ctx.lineTo(C[0],C[1]);ctx.lineTo((A[0]+C[0])/2,Math.max(A[1],C[1])+(Rn()*30+10)*Z);ctx.lineTo(A[0],A[1]);ctx.closePath();ctx.fill();}
  ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1.5*Z;ctx.beginPath();for(let k=1;k<6;k++){const o=k*22*Z;ctx.moveTo(L[0]+30*Z,L[1]+o*.6);ctx.lineTo(B[0],B[1]+o*1.3);ctx.lineTo(R[0]-30*Z,R[1]+o*.6);}ctx.stroke();
  ctx.strokeStyle='rgba(60,70,40,.55)';ctx.lineWidth=1.2*Z;ctx.beginPath();for(let k=0;k<14;k++){const u=(k+.5)/14,a=u<.5?[L[0]+(B[0]-L[0])*u*2,L[1]+(B[1]-L[1])*u*2]:[B[0]+(R[0]-B[0])*(u-.5)*2,B[1]+(R[1]-B[1])*(u-.5)*2];ctx.moveTo(a[0],a[1]+4*Z);ctx.quadraticCurveTo(a[0]+3*Z,a[1]+18*Z,a[0]-2*Z,a[1]+(26+k%4*9)*Z);}ctx.stroke();
  for(let k=0;k<7;k++){const cx=B[0]+(((k*131+t*(4+k%2*3))%900)-450)*Z,cy=B[1]+dep*(.45+(k%3)*.18);ctx.fillStyle=`rgba(150,138,132,${.22+(k%2)*.1})`;ctx.beginPath();ctx.ellipse(cx,cy,(110+k%3*40)*Z,(18+k%2*8)*Z,0,0,7);ctx.fill();}
  const e1=scr(z.w,13),e2=scr(z.w,15),e3=scr(z.w+6,13),e4=scr(z.w+6,15);ctx.strokeStyle='#3a2a18';ctx.lineWidth=2*Z;ctx.beginPath();ctx.moveTo(e1[0],e1[1]-10*Z);ctx.quadraticCurveTo((e1[0]+e3[0])/2,(e1[1]+e3[1])/2+4*Z,e3[0],e3[1]-10*Z);ctx.moveTo(e2[0],e2[1]-10*Z);ctx.quadraticCurveTo((e2[0]+e4[0])/2,(e2[1]+e4[1])/2+4*Z,e4[0],e4[1]-10*Z);ctx.stroke();
  for(let k=0;k<12;k++){const u=k/12,d=Math.sin(u*Math.PI)*12*Z,a=[e1[0]+(e3[0]-e1[0])*u,e1[1]+(e3[1]-e1[1])*u+d],b=[e2[0]+(e4[0]-e2[0])*u,e2[1]+(e4[1]-e2[1])*u+d];ctx.strokeStyle=k%2?'#5a4228':'#4a3620';ctx.lineWidth=4*Z;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}}
let VG=null,GRAIN=null,WGZ=0;const WGC=new Map();
const GRADE={foret:[130,180,90,.2],desert:[255,215,150,.22],volcan:[255,100,40,.24],abime:[210,40,40,.26],astre:[255,235,180,.22],cendres:[210,120,70,.22],givre:[90,140,210,.24],marais:[110,150,80,.22],pre:[200,200,220,.2],fonte:[230,170,80,.22],ossu:[140,120,200,.24],town:[220,170,110,.16]};
function render(){
  try{groundUI();}catch(e){}
  const z=S.cur;{const q=scr(p.x,p.y);LPX=z.id==='town'?null:q[0];LPY=q[1];SHN=0;FLN=0;}ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  SHX=S.shake>0?(Math.random()-.5)*S.shake*18:0;SHY=S.shake>0?(Math.random()-.5)*S.shake*18:0;
  drawSun(z);
  if(z.id==='town')drawIsle(z);
  if(!z.fcv||z.bz!==Z)bakeFloor(z);
  if(z.fk&&z.fk<1)ctx.drawImage(z.fcv,W/2-S.cam.x-z.fox+SHX,H/2-S.cam.y+SHY,z.fcv.width/z.fk,z.fcv.height/z.fk);else ctx.drawImage(z.fcv,W/2-S.cam.x-z.fox+SHX,H/2-S.cam.y+SHY);
  const hw=TW/2*Z,hh=TH/2*Z;
  drawVents(z);
  for(const h of S.hz||[]){const[sx,sy]=scr(h.x,h.y),rx=h.r*hw*1.42,ry=h.r*hh*1.42;
    if(drawHzX(h,sx,sy,rx,ry))continue;
    if(h.arm>0){ctx.setLineDash([5,5]);ctx.strokeStyle=h.kind==='web'?'rgba(220,210,255,.7)':h.kind==='ember'?(h.tint?`rgba(${h.tint},.9)`:'rgba(255,120,40,.9)'):h.kind==='slam'?'rgba(240,230,210,.85)':h.kind==='ash'?'rgba(200,190,180,.7)':'rgba(255,140,60,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.stroke();ctx.setLineDash([]);continue;}
    const a=Math.min(1,h.t);
    if(h.kind==='web'){ctx.strokeStyle=`rgba(225,220,240,${.55*a})`;ctx.lineWidth=1.2;ctx.beginPath();for(let k=0;k<8;k++){const an=k/8*6.28;ctx.moveTo(sx,sy);ctx.lineTo(sx+Math.cos(an)*rx,sy+Math.sin(an)*ry);}ctx.stroke();
      for(const f of[.35,.65,.95]){ctx.beginPath();ctx.ellipse(sx,sy,rx*f,ry*f,0,0,7);ctx.stroke();}}
    else if(h.kind==='ring'){const cr=h.cr||.6;ctx.strokeStyle=`rgba(${h.col||'230,220,255'},.85)`;ctx.lineWidth=5*Z;ctx.beginPath();ctx.ellipse(sx,sy,cr*hw*1.42,cr*hh*1.42,0,0,7);ctx.stroke();ctx.strokeStyle=`rgba(${h.col||'230,220,255'},.25)`;ctx.lineWidth=12*Z;ctx.stroke();}
    else if(h.kind==='ash'){const g=ctx.createRadialGradient(sx,sy,0,sx,sy,rx);g.addColorStop(0,`rgba(190,180,170,${.6*a})`);g.addColorStop(.7,`rgba(120,60,40,${.35*a})`);g.addColorStop(1,'rgba(60,50,45,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.fill();}
    else{const g=ctx.createRadialGradient(sx,sy,0,sx,sy,rx);g.addColorStop(0,`rgba(255,170,60,${.55*a})`);g.addColorStop(1,'rgba(200,40,10,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.fill();}}
  if(z.ev&&z.ev.state==='on'&&z.ev.id==='ambush'){const[sx,sy]=scr(z.ev.x,z.ev.y),rx=z.ev.r*hw*1.42,ry=z.ev.r*hh*1.42;ctx.strokeStyle='rgba(120,70,30,.85)';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.stroke();
    ctx.strokeStyle='#3a2414';ctx.lineWidth=2;for(let k=0;k<40;k++){const a=k/40*6.28,x=sx+Math.cos(a)*rx,y=sy+Math.sin(a)*ry;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a+1)*7*Z,y-10*Z-(k%3)*4*Z);ctx.stroke();}}
  if(z.shrink){const[sx,sy]=scr(z.shrink.cx,z.shrink.cy),rx=z.shrink.r*hw*1.42,ry=z.shrink.r*hh*1.42;ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.fillStyle='rgba(70,64,58,.45)';ctx.fill('evenodd');
    ctx.strokeStyle=`rgba(210,200,185,${.6+Math.sin(S.t*6)*.2})`;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.stroke();ctx.restore();}
  if(z.creep)drawCreep(z);
  drawPuddles(z);drawWorldLifeGround(z);drawCritters(z);drawGrass(z);
  if(z.prints&&!p.eco)for(const q of z.prints){const a=1-(S.t-q.t)/14;if(a<=0)continue;const[sx,sy]=scr(q.x,q.y),u=Math.cos(q.a)-Math.sin(q.a),v=(Math.cos(q.a)+Math.sin(q.a))*.5,l=Math.hypot(u,v)||1;ctx.fillStyle=`rgba(${q.c},${(.4*a).toFixed(2)})`;ctx.save();ctx.translate(sx,sy);ctx.rotate(Math.atan2(v/l,u/l));ctx.beginPath();ctx.ellipse(0,0,3.2*Z,1.5*Z,0,0,7);ctx.fill();ctx.restore();}
  for(const d of z.decals){const[sx,sy]=scr(d.x,d.y);const a=Math.max(0,1-(S.t-d.t)/40);if(a<=0)continue;ctx.fillStyle=d.c.replace('A',(.6*a).toFixed(2));ctx.beginPath();ctx.ellipse(sx,sy,d.r*hw,d.r*hh,0,0,7);ctx.fill();}
  if(S.mark&&S.mark.t>0){const[sx,sy]=scr(S.mark.x,S.mark.y);ctx.strokeStyle=`rgba(232,196,106,${S.mark.t*1.6})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy,S.mark.t*30*Z,S.mark.t*15*Z,0,0,7);ctx.stroke();}
  const dr=[];
  let X0=1e9,X1=-1e9,Y0=1e9,Y1=-1e9;for(const[cx,cy]of[[0,0],[W,0],[0,H],[W,H]]){const q=wld(cx,cy);X0=Math.min(X0,q[0]);X1=Math.max(X1,q[0]);Y0=Math.min(Y0,q[1]);Y1=Math.max(Y1,q[1]);}
  X0=Math.max(0,Math.floor(X0)-3);Y0=Math.max(0,Math.floor(Y0)-3);X1=Math.min(z.w-1,Math.ceil(X1)+4);Y1=Math.min(z.h-1,Math.ceil(Y1)+4);
  for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){const i=y*z.w+x;if(z.g[i]!==1||!z.near[i])continue;const[sx,sy]=scr(x,y);if(sx<-hw-4||sx>W+hw+4||sy<-hh*2-50*Z||sy>H+4)continue;dr.push({d:x+y+1,k:'w',x,y,sx,sy});}
  for(const m of z.mons)if(m.dead){const[sx,sy]=scr(m.x,m.y);ctx.globalAlpha=Math.max(0,1-m.dt/25)*.8;ctx.fillStyle=m.kind==='archer'?'#8a826e':m.kind==='ghost'?'rgba(80,70,120,.6)':'#2a0806';ctx.beginPath();ctx.ellipse(sx,sy,14*Z*m.size,6*Z*m.size,0,0,7);ctx.fill();ctx.fillStyle=m.boss?'#4a1610':'#3a3226';ctx.beginPath();ctx.ellipse(sx+3,sy-2,9*Z*m.size,4*Z*m.size,.3,0,7);ctx.fill();ctx.globalAlpha=1;}
  for(const o of z.objs)if(o.type==='wp')drawWp(o);
  /* v5.75 : ondes en double anneau, à la couleur du sort, éclats de glace pour la nova */
  for(const n of S.novas){const[sx,sy]=scr(n.x,n.y);const a=1-n.r/n.max,c=n.col||'170,220,255',rx=n.r*hw*1.42,ry=n.r*hh*1.42;
    ctx.fillStyle=`rgba(${c},${(a*.14).toFixed(2)})`;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.fill();
    if(!p.eco)ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(${c},${a.toFixed(2)})`;ctx.lineWidth=5*Z*a+1;ctx.stroke();
    if(!p.eco){ctx.strokeStyle=`rgba(255,255,255,${(a*.6).toFixed(2)})`;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(sx,sy,rx*.82,ry*.82,0,0,7);ctx.stroke();
      if(!n.col){ctx.fillStyle=`rgba(220,240,255,${a.toFixed(2)})`;for(let k=0;k<10;k++){const t=k/10*6.28+n.r*.3,ex=sx+Math.cos(t)*rx,ey=sy+Math.sin(t)*ry;ctx.beginPath();ctx.moveTo(ex,ey-7*Z*a);ctx.lineTo(ex+1.5*Z,ey);ctx.lineTo(ex,ey+1.5*Z);ctx.lineTo(ex-1.5*Z,ey);ctx.closePath();ctx.fill();}}}
    ctx.globalCompositeOperation='source-over';}
  for(const it of z.items){const[sx,sy]=scr(it.x,it.y);ctx.fillStyle=it.kind==='gold'?'#d8b04a':it.kind==='pot'?'#c23a30':it.kind==='scroll'?'#cfc2a0':it.kind==='card'?'#d8a8ff':it.kind==='bagx'?'#c89a5a':it.kind==='egg'?'#e8e0cc':it.kind==='page'?'#e8dcc0':it.kind==='gem'?'#60e0c0':it.kind==='sup'?'#e0a0ff':itemCol(it.it);if(p.eco){ctx.beginPath();ctx.ellipse(sx,sy,5*Z,3*Z,0,0,7);ctx.fill();}else drawLoot(it,sx,sy);
    const beam=it.kind==='item'?(it.it.rar===3?'255,150,40':it.it.set?'95,208,106':it.it.uniq?'255,90,60':it.it.rar===2&&!p.eco?'232,210,90':null):it.kind==='gem'||it.kind==='egg'?'120,230,200':it.kind==='orb'&&['serment','aube','tumulte'].includes(it.k)?'255,216,144':null;
    if(beam){const hb=it.it&&it.it.rar===2&&!it.it.set?45:90;ctx.globalCompositeOperation='lighter';ctx.fillStyle=vgrad(sy-hb*Z,sy,`rgba(${beam},0)`,`rgba(${beam},${hb===45?.22:.35})`);ctx.fillRect(sx-4*Z,sy-hb*Z,8*Z,hb*Z);ctx.globalCompositeOperation='source-over';}}
  const on=(x,y)=>{const q=scr(x,y);return q[0]>-90&&q[0]<W+90&&q[1]>-40&&q[1]<H+140;};
  let nLying=0;
  for(const m of z.mons)if(!m.dead&&on(m.x,m.y))dr.push({d:m.x+m.y,k:'m',o:m});else if(m.dead&&m.dt<(p.gfx===1?.6:DEATH_T)&&!p.eco&&!m.nest&&m.kind!=='banner'&&!(m.boss&&!m.mini&&!m.guard)&&on(m.x,m.y)&&(nLying++)<14)dr.push({d:m.x+m.y,k:'md',o:m});
  for(const o of z.objs)if(o.type!=='wp')dr.push({d:o.x+o.y,k:'o',o});
  for(const o of z.props)if(o.k==='tent'||on(o.x,o.y))dr.push({d:o.k==='tent'?o.x+o.y+3.2:o.x+o.y,k:'pp',o});
  for(const po of portalsIn(z))dr.push({d:po.x+po.y,k:'pt',o:po});
  if(!p.dead)dr.push({d:p.x+p.y,k:'p'});
  if(S.ally&&on(S.ally.x,S.ally.y))dr.push({d:S.ally.x+S.ally.y,k:'al'});
  if(z.id==='town'&&z.life){for(const e of z.life.surv)dr.push({d:e.x+e.y,k:'sv',o:e});if(z.life.cat)dr.push({d:z.life.cat.x+z.life.cat.y,k:'cat',o:z.life.cat});}
  if(z.prey&&z.prey.on)dr.push({d:z.prey.x+z.prey.y,k:'prey',o:z.prey});
  for(const t of S.totems||[])dr.push({d:t.x+t.y,k:'tt',o:t});
  for(const pr of S.proj)dr.push({d:pr.x+pr.y,k:'pr',o:pr});
  dr.sort((a,b)=>a.d-b.d);
  const pd=p.x+p.y,pdiff=p.x-p.y;
  for(const e of dr){
    if(e.k==='w'){const ahead=(e.x+e.y+1)-pd;drawWall(z,e.x,e.y,e.sx,e.sy,ahead>0&&ahead<4&&Math.abs((e.x-e.y)-pdiff)<2.6);}
    else if(e.k==='m')drawMon(e.o);else if(e.k==='md')drawDying(e.o);else if(e.k==='o')drawObj(e.o);else if(e.k==='pp')drawProp(e.o);
    else if(e.k==='pt')drawPortal(e.o);else if(e.k==='p')drawPlayer();else if(e.k==='al')drawAlly(S.ally);else if(e.k==='sv')drawSurv(e.o);else if(e.k==='prey')drawPrey(e.o);else if(e.k==='cat')drawCat(e.o);else if(e.k==='tt'){const[sx,sy]=scr(e.o.x,e.o.y),s=Z;shadow(sx,sy,8);ctx.fillStyle=vgrad(sy-30*s,sy,'#8a7a62','#3a3024');ctx.fillRect(sx-5*s,sy-28*s,10*s,28*s);ctx.shadowColor='#ff9a3a';ctx.shadowBlur=10;ctx.fillStyle='#ffb050';ctx.fillRect(sx-3*s,sy-24*s,2*s,2*s);ctx.fillRect(sx+1*s,sy-24*s,2*s,2*s);ctx.shadowBlur=0;}else if(e.k==='pr')drawProj(e.o);
  }
  drawAtkMarks(z);
  for(const b of S.bolts){const A=scr(b.a.x,b.a.y),B=scr(b.b.x,b.b.y),cc=b.heal?'200,230,140':'170,210,255',al=Math.min(1,b.t*4);ctx.globalCompositeOperation='lighter';
    const P=[[A[0],A[1]-24*Z]];for(let k=1;k<6;k++){const t=k/6;P.push([A[0]+(B[0]-A[0])*t+rnd(-6,6)*Z,A[1]+(B[1]-A[1])*t-24*Z+rnd(-6,6)*Z]);}P.push([B[0],B[1]-20*Z]);
    const path=()=>{ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);for(const q of P)ctx.lineTo(q[0],q[1]);};
    if(!p.eco){path();ctx.strokeStyle=`rgba(${cc},${(al*.25).toFixed(2)})`;ctx.lineWidth=9*Z;ctx.stroke();
      ctx.strokeStyle=`rgba(${cc},${(al*.7).toFixed(2)})`;ctx.lineWidth=1.2;ctx.beginPath();for(let k=1;k<P.length-1;k+=2){ctx.moveTo(P[k][0],P[k][1]);ctx.lineTo(P[k][0]+rnd(-10,10)*Z,P[k][1]+rnd(4,12)*Z);}ctx.stroke();}
    path();ctx.strokeStyle=`rgba(${cc},${al.toFixed(2)})`;ctx.lineWidth=3*Z;ctx.stroke();ctx.lineWidth=1;ctx.strokeStyle='#fff';ctx.stroke();ctx.globalCompositeOperation='source-over';}
  for(const mt of S.mets){const[sx,sy]=scr(mt.x,mt.y);ctx.strokeStyle='rgba(255,120,40,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy,2.4*hw*1.42*(1-mt.t*.3),2.4*hh*1.42*(1-mt.t*.3),0,0,7);ctx.stroke();
    const fy=sy-mt.t*500*Z,fx=sx-mt.t*160*Z;ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(fx,fy,0,fx,fy,16*Z);g.addColorStop(0,'rgba(255,240,190,1)');g.addColorStop(.4,'rgba(255,120,30,.9)');g.addColorStop(1,'rgba(255,60,10,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(fx,fy,16*Z,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';}
  for(const q of S.parts){const[sx,sy]=scr(q.x,q.y);ctx.globalAlpha=clamp(q.life*2,0,1);ctx.fillStyle=q.col;ctx.fillRect(sx-1.5*Z,sy-q.z*20*Z-1.5*Z,3*Z,3*Z);}ctx.globalAlpha=1;
  if(S.hits&&S.hits.length){ctx.globalCompositeOperation='lighter';for(const h of S.hits){const[sx,sy]=scr(h.x,h.y),k=h.t/h.m,r=(8+12*(1-k))*Z,y=sy-20*Z;ctx.strokeStyle=`rgba(${h.c},${(.9*k).toFixed(2)})`;ctx.lineWidth=2*Z;ctx.beginPath();for(let i=0;i<4;i++){const a=h.a+i*Math.PI/2;ctx.moveTo(sx+Math.cos(a)*r*.25,y+Math.sin(a)*r*.25);ctx.lineTo(sx+Math.cos(a)*r,y+Math.sin(a)*r*.6);}ctx.stroke();}ctx.globalCompositeOperation='source-over';}
  if(z.id==='town'&&z.life)drawBirds(z.life);
  // obscurité
  const LS=lightsOf(z);
  lctx.setTransform(DPR,0,0,DPR,0,0);lctx.globalCompositeOperation='source-over';lctx.clearRect(0,0,W,H);
  lctx.fillStyle=`rgba(4,2,1,${Math.min(.97,palOf(z.style).dark+(zHas(z,'nuit')?.06:0)+(zHas(z,'brume')?.03:0)+(mut('ombres')&&z.id!=='town'?.04:0)+(z.storm?.05:0))})`;lctx.fillRect(0,0,W,H);lctx.globalCompositeOperation='destination-out';
  if(S.sunP){const q=S.sunP,g_=lctx.createRadialGradient(q.x,q.y,0,q.x,q.y,q.R*2.6);g_.addColorStop(0,'rgba(0,0,0,.95)');g_.addColorStop(1,'rgba(0,0,0,0)');lctx.fillStyle=g_;lctx.fillRect(q.x-q.R*2.6,q.y-q.R*2.6,q.R*5.2,q.R*5.2);}
  for(const l of LS){const[sx,sy]=scr(l.x,l.y);const R=l.r*hw;lctx.save();lctx.translate(sx,sy-10*Z);lctx.scale(1,.62);const g=lctx.createRadialGradient(0,0,0,0,0,R);g.addColorStop(0,`rgba(0,0,0,${l.a})`);g.addColorStop(.55,`rgba(0,0,0,${l.a*.7})`);g.addColorStop(1,'rgba(0,0,0,0)');lctx.fillStyle=g;lctx.beginPath();lctx.arc(0,0,R,0,7);lctx.fill();lctx.restore();}
  ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(lc,0,0);ctx.setTransform(DPR,0,0,DPR,0,0);
  // lueurs chaudes
  ctx.globalCompositeOperation='lighter';
  for(const l of LS){if(!l.col||(p.eco&&l!==LS[0]))continue;const[sx,sy]=scr(l.x,l.y);const R=l.r*hw*.8;ctx.save();ctx.translate(sx,sy-10*Z);ctx.scale(1,.62);const g=ctx.createRadialGradient(0,0,0,0,0,R);g.addColorStop(0,`rgba(${l.col},${l.g!=null?l.g.toFixed(2):'.22'})`);g.addColorStop(1,`rgba(${l.col},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,7);ctx.fill();ctx.restore();}
  drawShafts(z);ctx.globalCompositeOperation='lighter';
  for(const a of S.amb){const[sx,sy]=scr(a.x,a.y);const yy=sy-a.z*20*Z;const lf=Math.min(1,a.life,(a.max-a.life)*2);
    if(a.ember){ctx.fillStyle=`rgba(255,${120+(a.x*37%80)|0},40,${.8*lf})`;ctx.fillRect(sx-1,yy-1,2*Z,2*Z);}
    else if(a.rain){ctx.strokeStyle=`rgba(${a.c},${(.6*lf).toFixed(2)})`;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(sx,yy);ctx.lineTo(sx-2.5*Z,yy-12*Z);ctx.stroke();if(a.z<.3&&Math.random()<.1)S.parts.push({x:a.x,y:a.y,z:.05,vx:0,vy:0,vz:.6,life:.2,col:'rgba(180,200,210,.6)'});}
    else{const dd=Math.hypot(a.x-p.x,a.y-p.y);const al=lf*Math.max(0,1-dd/(z.id==='town'?11:7))*.5;if(al<=0)continue;ctx.fillStyle=`rgba(${a.c},${al})`;ctx.fillRect(sx,yy,a.s*Z,a.s*Z);}}
  ctx.globalCompositeOperation='source-over';
  /* v5.67 : étalonnage des couleurs par monde et grain de pellicule (coupés en économie de batterie) */
  if(!p.eco){const GR=GRADE[z.id==='town'?'town':(z.palTheme||curWorld().theme)]||GRADE.cendres;ctx.globalCompositeOperation='soft-light';ctx.fillStyle=`rgba(${GR[0]},${GR[1]},${GR[2]},${GR[3]})`;ctx.fillRect(0,0,W,H);
    ctx.globalCompositeOperation='overlay';if(p.gfx!==1){if(!GRAIN){GRAIN=document.createElement('canvas');GRAIN.width=GRAIN.height=256;const gc=GRAIN.getContext('2d'),id=gc.createImageData(256,256);for(let i=0;i<id.data.length;i+=4){const v=Math.random()*255|0;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255;}gc.putImageData(id,0,0);}
    ctx.globalAlpha=.07;const ox=-(Math.random()*256|0),oy=-(Math.random()*256|0);for(let y=oy;y<H;y+=256)for(let x=ox;x<W;x+=256)ctx.drawImage(GRAIN,x,y);ctx.globalAlpha=1;}ctx.globalCompositeOperation='source-over';}
  if(!VG||VG.w!==W||VG.h!==H){const g=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.32,W/2,H/2,Math.max(W,H)*.72);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.55)');VG={g,w:W,h:H};}ctx.fillStyle=VG.g;ctx.fillRect(0,0,W,H);
  drawWorldLifeSky(z);
  if(S.cine)drawCine(S.cine);
  if(S.fade>0){ctx.fillStyle=`rgba(0,0,0,${Math.min(1,S.fade)})`;ctx.fillRect(0,0,W,H);}
  if(p.hurt>0){ctx.fillStyle=`rgba(140,0,0,${p.hurt*.5})`;ctx.fillRect(0,0,W,H);}
  if(S.card){const C=S.card,e=C.m-C.t,a=Math.min(1,e/.35,C.t/.45),bh=H*.09*a;ctx.fillStyle='#000';ctx.fillRect(0,0,W,bh);ctx.fillRect(0,H-bh,W,bh);
    ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';const y0=H*.3,dx=(1-Math.min(1,e/.5))*40;let fz=Math.round(Math.min(40,W/9));ctx.font=`700 ${fz}px "Grenze Gotisch",Georgia,serif`;const tw=ctx.measureText(C.n).width;if(tw>W*.88){fz=Math.floor(fz*W*.88/tw);ctx.font=`700 ${fz}px "Grenze Gotisch",Georgia,serif`;}ctx.lineWidth=5;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(C.n,W/2-dx,y0);ctx.fillStyle='#f0c860';ctx.fillText(C.n,W/2-dx,y0);
    if(C.s){ctx.font=`italic ${Math.round(Math.min(18,W/24))}px "Alegreya Sans",sans-serif`;ctx.lineWidth=3;ctx.strokeText(C.s,W/2+dx,y0+26);ctx.fillStyle='#d8c8a8';ctx.fillText(C.s,W/2+dx,y0+26);}
    ctx.strokeStyle='rgba(240,200,96,.7)';ctx.lineWidth=1.5;const L=Math.min(W*.35,160)*Math.min(1,e/.6);ctx.beginPath();ctx.moveTo(W/2-L,y0+8);ctx.lineTo(W/2+L,y0+8);ctx.stroke();ctx.restore();ctx.textAlign='left';}
  if(p.hp<p.maxHp*.25&&!p.dead){const a=.25+Math.sin(S.t*6)*.12;const rg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.7);rg.addColorStop(0,'rgba(120,0,0,0)');rg.addColorStop(1,`rgba(120,0,0,${a})`);ctx.fillStyle=rg;ctx.fillRect(0,0,W,H);}
  for(const m of z.mons)if(m.divine!=null&&!m.dead){const[sx,sy]=scr(m.x,m.y);drawDivine(sx,sy,m,true);}
  // étiquettes
  ctx.textAlign='center';ctx.textBaseline='middle';
  const lab=(t,x,y,col,f)=>{ctx.font=f;ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText(t,x,y);ctx.fillStyle=col;ctx.fillText(t,x,y);};
  for(const o of z.objs){if(o.type==='tnpc'){const[sx,sy]=scr(o.x,o.y);lab((toneK()===o.tone?'● ':'')+o.name,sx,sy-(o.tone==='demon'?64:o.tone==='normal'?50:52)*Z,TONES[o.tone].c,`700 ${11*Z+1}px "Alegreya Sans",sans-serif`);}
    if(o.type==='npc'){const[sx,sy]=scr(o.x,o.y);lab(o.name,sx,sy-62*Z,'#e2d6c0',`700 ${12*Z+1}px "Alegreya Sans",sans-serif`);
      if(o.id==='corvel'&&corvelHas())lab('!',sx,sy-82*Z+Math.sin(S.t*4)*2,'#e8c46a',`700 ${24*Z}px "Grenze Gotisch",serif`);}
    if(o.type==='exit'&&dist(o,p)<5){const[sx,sy]=scr(o.x,o.y);lab(o.label,sx,sy-54*Z,'#d9c79a',`${12*Z+1}px "Alegreya Sans",sans-serif`);
      if(dist(o,p)<3&&!o.lock&&!sealOf(o.to))lab('Touche la porte pour passer',sx,sy-41*Z,'#a39680',`${10*Z+1}px "Alegreya Sans",sans-serif`);}
    if(o.type==='dummy'){const[sx,sy]=scr(o.x,o.y);if(sx>-80&&sx<W+80&&sy>-40&&sy<H+80){lab('Mannequin d’entraînement',sx,sy-60*Z,'#e8c46a',`700 ${12*Z+1}px "Alegreya Sans",sans-serif`);lab('Touche-le pour tester tes dégâts',sx,sy-47*Z,'#d9c79a',`${10*Z+1}px "Alegreya Sans",sans-serif`);}}
    if(o.type==='board'&&dist(o,p)<6){const[sx,sy]=scr(o.x,o.y);lab((S.ct&&S.ct.list.some(c=>!c.claimed&&c.cnt>=c.goal)?'★ ':'')+'Mutation : '+mutation(S.mutT).n,sx,sy-46*Z,'#e06a2b',`700 ${12*Z+1}px "Alegreya Sans",sans-serif`);}
    if(o.type==='stash'&&dist(o,p)<6){const[sx,sy]=scr(o.x,o.y);lab('Coffre',sx,sy-38*Z,'#e8c060',`700 ${12*Z+1}px "Alegreya Sans",sans-serif`);}
    if(o.type==='rift'&&riftOpen()&&dist(o,p)<6){const[sx,sy]=scr(o.x,o.y);lab('Pierre de faille',sx,sy-64*Z,'#d8a8ff',`700 ${12*Z+1}px "Alegreya Sans",sans-serif`);}
    if(o.type==='wp'&&dist(o,p)<3){const[sx,sy]=scr(o.x,o.y);lab('Point de passage',sx,sy-22*Z,'#a8c0ff',`${12*Z+1}px "Alegreya Sans",sans-serif`);}}
  for(const po of portalsIn(z))if(Math.hypot(po.x-p.x,po.y-p.y)<5){const[sx,sy]=scr(po.x,po.y);lab(po.label,sx,sy-62*Z,'#a8c0ff',`${12*Z+1}px "Alegreya Sans",sans-serif`);
    if(Math.hypot(po.x-p.x,po.y-p.y)<3)lab('Touche le portail pour entrer',sx,sy-49*Z,'#a39680',`${10*Z+1}px "Alegreya Sans",sans-serif`);}
  S.labels=[];ctx.font=`${11*Z+2}px "Alegreya Sans",sans-serif`;
  for(const it of z.items){if(Math.hypot(it.x-p.x,it.y-p.y)>8)continue;if(it.kind==='item'&&lootSkip(it.it))continue;const[sx,sy]=scr(it.x,it.y);
    const t=it.kind==='gold'?`${it.v} or`:it.kind==='pot'?'Fiole':it.kind==='scroll'?'Parchemin de portail':it.kind==='card'?'Carte d’épreuve':it.kind==='bagx'?'Sac de voyage':it.kind==='egg'?'Œuf de cendre':it.kind==='page'?'Page de carnet':it.kind==='gem'?'Pierre : '+SK[it.sk].n:it.kind==='sup'?'Soutien : '+SUPPORTS[it.k].n:it.kind==='orb'?ORBS[it.k].n:it.it.name;
    const w=ctx.measureText(t).width+8,h=15*Z+2,ly=sy-14*Z;ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(sx-w/2,ly-h/2,w,h);
    ctx.fillStyle=it.kind==='gold'?'#e8c46a':it.kind==='pot'?'#ff8a7a':it.kind==='scroll'?'#cfc2a0':it.kind==='card'?'#d8a8ff':it.kind==='bagx'?'#e0b070':it.kind==='egg'?'#ff9a3a':it.kind==='page'?'#f0e6c8':it.kind==='gem'?'#60e0c0':it.kind==='sup'?'#e0a0ff':it.kind==='orb'?ORBS[it.k].c:itemCol(it.it);ctx.fillText(t,sx,ly+1);
    S.labels.push({x0:sx-w/2,y0:ly-h/2,x1:sx+w/2,y1:ly+h/2,it});}
  for(const m of z.mons)if(!m.dead&&m.aggro&&(m.champ||m.hp<m.maxHp)&&(!m.boss||m.guard)){const[sx,sy]=scr(m.x,m.y);const w=26*Z*m.size,yy=sy-(m.kind==='beast'?26:54)*Z*m.size;const bh=m.champ||m.mini?3:2;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(sx-w/2-1,yy-1,w+2,bh+2);ctx.fillStyle=m.champ?champCol(m):'#c0281e';ctx.fillRect(sx-w/2,yy,w*Math.max(0,m.hp/m.maxHp),bh);
    if(m.cx&&m.cx.length){/* v6.34 : symboles des affixes au-dessus de la barre */const fs=Math.round(9*Z+3);ctx.font=`700 ${fs}px "Alegreya Sans",sans-serif`;ctx.textAlign='center';ctx.textBaseline='bottom';const n=m.cx.length,gap=fs*1.15;
      for(let k=0;k<n;k++){const A=CAFX[m.cx[k]],xx=sx+(k-(n-1)/2)*gap;ctx.fillStyle='rgba(0,0,0,.65)';ctx.beginPath();ctx.arc(xx,yy-2-fs*.5,fs*.58,0,7);ctx.fill();ctx.fillStyle=A.c;ctx.fillText(A.i,xx,yy-2-fs*.02);}ctx.textBaseline='alphabetic';}}
  drawTalk();
  for(const f of S.fx){const[sx,sy]=scr(f.x,f.y);ctx.globalAlpha=clamp(f.life*1.5,0,1);const k=1-f.life,e=1-(1-k)*(1-k),yy=sy-50*Z-e*40*Z;if(f.dx==null)f.dx=rnd(-1,1);const pop=f.big?1+.7*Math.max(0,1-k/.14):1;if(f.big&&!p.eco){ctx.font=`700 ${Math.round(19*Z*pop+1)}px "Alegreya Sans",sans-serif`;ctx.lineWidth=7;ctx.strokeStyle='rgba(255,170,40,.35)';ctx.strokeText(f.t,sx+f.dx*e*22*Z,yy);}lab(f.t,sx+f.dx*e*22*Z,yy,f.big?'#ffd860':f.col,`700 ${Math.round((f.big?19*pop:14)*Z+1)}px "Alegreya Sans",sans-serif`);}ctx.globalAlpha=1;
}
function shadow(sx,sy,r){
  /* v5.67 : ombre portée à l’opposé de la lanterne du héros */
  if(SHL&&LPX!=null&&!p.eco&&p.gfx!==1&&SHN++<18){const dx=sx-LPX,dy=sy-LPY,d=Math.hypot(dx,dy*2);if(d>6*Z&&d<260*Z){const b=Math.atan2(dy,dx),L=r*Z*(1.2+Math.min(1.6,d/(90*Z))),al=.32*(1-d/(260*Z));ctx.fillStyle=`rgba(0,0,0,${al.toFixed(2)})`;ctx.beginPath();ctx.ellipse(sx+Math.cos(b)*L*.55,sy+Math.sin(b)*L*.55,L,r*Z*.4,b,0,7);ctx.fill();}}
  ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.ellipse(sx,sy,r*Z,r*.45*Z,0,0,7);ctx.fill();}
let LPX=null,LPY=null,SHL=false,SHN=0,FLN=0;
function sdir(a){const dx=Math.cos(a),dy=Math.sin(a);return[(dx-dy),(dx+dy)/2];}
function flame(sx,sy,s,k){const f=Math.sin(S.t*14+k)*2*s;ctx.fillStyle='#e0502a';ctx.beginPath();ctx.moveTo(sx-5*s,sy);ctx.quadraticCurveTo(sx-2*s,sy-14*s,sx+f*.3,sy-20*s+f);ctx.quadraticCurveTo(sx+2*s,sy-12*s,sx+5*s,sy);ctx.fill();ctx.fillStyle='#ffd07a';ctx.beginPath();ctx.moveTo(sx-2.5*s,sy);ctx.quadraticCurveTo(sx,sy-12*s-f,sx+2.5*s,sy);ctx.fill();}
function drawAlly(a){const[sx,sy]=scr(a.x,a.y),s=Z,A=ALLIES[a.type],dx=Math.cos(a.face),side=(dx-Math.sin(a.face))>=0?1:-1,bob=a.moving?Math.abs(Math.sin(a.ph*10))*1.5*s:0;
  shadow(sx,sy,10);if(a.down>0)ctx.globalAlpha=.4;
  /* v5.81 : anneau de rang sous le compagnon (Aguerri vert, Vétéran bleu, Élite violet, Légendaire orange qui pulse) */
  if(p.comp&&!p.eco){const rk=allyRank(p.comp);if(rk>0){const RC=['','95,208,106','111,140,255','190,110,255','255,150,40'][rk];ctx.strokeStyle=`rgba(${RC},${rk===4?(.55+Math.sin(S.t*4)*.25).toFixed(2):'.6'})`;ctx.lineWidth=1.6*s;ctx.beginPath();ctx.ellipse(sx,sy,13*s,5.5*s,0,0,7);ctx.stroke();if(rk===4){ctx.globalCompositeOperation='lighter';glowG(ctx,sx,sy-14*s,16*s,RC,.12);ctx.globalCompositeOperation='source-over';}}}
  if(a.type==='rejeton'){const r=allyRank(p.comp),k=1.5+r*.15;ctx.fillStyle=vgrad(sy-22*s,sy-6*s,'#8a8278','#2a2622');ctx.beginPath();ctx.ellipse(sx,sy-12*s*k-bob,9*s*k,5*s*k,0,0,7);ctx.fill();
    for(const w of[-1,1]){ctx.fillStyle='rgba(70,64,58,.9)';ctx.beginPath();ctx.moveTo(sx+w*3*s,sy-15*s*k-bob);ctx.quadraticCurveTo(sx+w*16*s*k,sy-(26+Math.sin(a.ph*9)*4)*s*k-bob,sx+w*13*s*k,sy-10*s*k-bob);ctx.closePath();ctx.fill();}
    ctx.fillStyle='#4a4440';ctx.beginPath();ctx.ellipse(sx+side*9*s*k,sy-17*s*k-bob,4*s*k,3*s*k,0,0,7);ctx.fill();ctx.shadowColor='#ffb040';ctx.shadowBlur=8;ctx.fillStyle='#ffc060';ctx.fillRect(sx+side*10*s*k-1,sy-18*s*k-bob,2*s,1.5*s);ctx.shadowBlur=0;
    if(Math.random()<.3)S.parts.push({x:a.x,y:a.y,z:.6,vx:rnd(-.3,.3),vy:rnd(-.3,.3),vz:rnd(.5,1.2),life:.5,col:'#ff9a3a'});}
  else{ctx.fillStyle=vgrad(sy-34*s,sy-3*s,A.col[0],A.col[1]);ctx.beginPath();ctx.moveTo(sx-7*s,sy-32*s-bob);ctx.lineTo(sx+7*s,sy-32*s-bob);ctx.lineTo(sx+9*s,sy-3*s);ctx.lineTo(sx-9*s,sy-3*s);ctx.closePath();ctx.fill();
    ctx.fillStyle='#c9a882';ctx.beginPath();ctx.arc(sx,sy-37*s-bob,4.8*s,0,7);ctx.fill();ctx.fillStyle=A.col[1];ctx.beginPath();ctx.arc(sx,sy-38.5*s-bob,5.2*s,Math.PI,0);ctx.fill();
    if(a.type==='archer'){ctx.strokeStyle='#7a5a3a';ctx.lineWidth=2*s;ctx.beginPath();ctx.arc(sx+side*9*s,sy-24*s-bob,9*s,side>0?-1.2:1.95,side>0?1.2:4.35);ctx.stroke();}
    else if(a.type==='garde'){ctx.fillStyle=vgrad(sy-30*s,sy-10*s,'#a8acb2','#4a4e56');ctx.beginPath();ctx.moveTo(sx+side*6*s,sy-30*s-bob);ctx.lineTo(sx+side*16*s,sy-30*s-bob);ctx.lineTo(sx+side*16*s,sy-18*s);ctx.lineTo(sx+side*11*s,sy-10*s);ctx.lineTo(sx+side*6*s,sy-18*s);ctx.closePath();ctx.fill();}
    else{ctx.shadowColor='#ff8a3a';ctx.shadowBlur=10;ctx.fillStyle='#ffb050';ctx.beginPath();ctx.arc(sx+side*10*s,sy-26*s-bob+Math.sin(a.ph*5)*2*s,3*s,0,7);ctx.fill();ctx.shadowBlur=0;}
    if(a.swing>0){ctx.strokeStyle=`rgba(255,240,210,${a.swing*2})`;ctx.lineWidth=3*s;ctx.beginPath();ctx.arc(sx+side*6*s,sy-20*s,14*s,-1,1);ctx.stroke();}}
  ctx.globalAlpha=1;const w=22*s;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(sx-w/2-1,sy-48*s,w+2,4);ctx.fillStyle='#7fd07f';ctx.fillRect(sx-w/2,sy-47*s,w*Math.max(0,a.hp/a.maxHp),2);}
function drawPlayer(){const[sx,sy]=scr(p.x,p.y);
  /* v5.71 : arc de taille devant le héros au corps à corps */
  if(p.slash>0&&!p.eco){const k=p.slash/.18,a0=p.slashA;ctx.save();ctx.translate(sx,sy-18*Z);ctx.scale(1,.55);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(240,230,210,${(.55*k).toFixed(2)})`;ctx.lineWidth=5*Z*k+1;ctx.lineCap='round';
    const b=Math.atan2(Math.sin(a0)+Math.cos(a0),Math.cos(a0)-Math.sin(a0)),sp=(1-k)*1.6;ctx.beginPath();ctx.arc(0,0,34*Z,b-1+sp*.3,b-1+sp+.4);ctx.stroke();ctx.restore();ctx.globalCompositeOperation='source-over';}if(p.stealth>0)ctx.globalAlpha=.35;drawHero(ctx,sx,sy,Z,{cls:p.cls,look:p.look,eq:p.eq,face:p.face,moving:p.moving,t:S.t,swing:p.swing,spin:p.spin,buff:p.buff});ctx.globalAlpha=1;}
/* v5.68 : squelettes en os fins (bassin, colonne, côtes, membres articulés) */
function boneLegs(m,sx,sy,s,st){const B=m.bone||'#d9cfbb';ctx.strokeStyle=B;ctx.lineCap='round';ctx.lineWidth=1.8*s;ctx.beginPath();
  for(const[k,ph]of[[-3,1],[3,-1]]){const kx=sx+k*s+st*ph*.6,fx=sx+k*1.2*s+st*ph;ctx.moveTo(sx+k*.8*s,sy-15*s);ctx.lineTo(kx,sy-8*s);ctx.lineTo(fx,sy-1*s);}ctx.stroke();
  ctx.fillStyle=B;ctx.beginPath();ctx.ellipse(sx,sy-15.5*s,4.5*s,2.2*s,0,0,7);ctx.fill();ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(sx,sy-15.5*s,1.8*s,1*s,0,0,7);ctx.fill();}
function boneTorso(m,sx,sy,s,side){const B=m.bone||'#d9cfbb';ctx.strokeStyle=B;ctx.lineCap='round';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(sx,sy-16*s);ctx.quadraticCurveTo(sx-side*1.5*s,sy-26*s,sx,sy-35*s);ctx.stroke();
  ctx.lineWidth=1.3*s;ctx.beginPath();for(let i=0;i<4;i++){const y=sy-(32-i*3.6)*s,w=(6.5-i*.7)*s;ctx.moveTo(sx,y);ctx.quadraticCurveTo(sx-w,y+.5*s,sx-w*.8,y+2.4*s);ctx.moveTo(sx,y);ctx.quadraticCurveTo(sx+w,y+.5*s,sx+w*.8,y+2.4*s);}ctx.stroke();
  ctx.lineWidth=2.2*s;ctx.beginPath();ctx.moveTo(sx-6*s,sy-34*s);ctx.lineTo(sx+6*s,sy-34*s);ctx.stroke();
  const a=m.atk>0?1:0;ctx.lineWidth=1.6*s;ctx.beginPath();ctx.moveTo(sx+side*6*s,sy-34*s);ctx.lineTo(sx+side*(9+a*3)*s,sy-27*s);ctx.lineTo(sx+side*(11+a*4)*s,sy-28*s);ctx.moveTo(sx-side*6*s,sy-34*s);ctx.lineTo(sx-side*7*s,sy-26*s);ctx.lineTo(sx-side*6*s,sy-19*s);ctx.stroke();}
/* v5.99 : un monstre tué bascule sur le côté (à l’opposé du héros), rebondit un peu, reste couché puis s’efface. Mode Normaux : l’ancien écrasement court. */
const DEATH_T=2.6;
function drawDying(m){const[sx,sy]=scr(m.x,m.y),fl=m.flash;m.flash=0;ctx.save();
  if(p.gfx===1||m.kind==='ghost'||m.kind==='flyer'){const k=Math.min(1,m.dt/.6);ctx.globalAlpha=Math.max(0,1-k);ctx.translate(sx,sy);ctx.rotate((m.face>0?1:-1)*k*.5);ctx.scale(1+k*.25,Math.max(.05,1-k*.9));ctx.translate(-sx,-sy);drawMon(m);}
  else{if(m.fdir==null){const[px]=scr(p.x,p.y);m.fdir=sx>=px?1:-1;}const t=m.dt,k=Math.min(1,t/.42),e=k*k*(3-2*k),bounce=t>.42&&t<.7?Math.sin((t-.42)/.28*Math.PI)*3*Z:0;
    ctx.globalAlpha=t<1.6?1:Math.max(0,1-(t-1.6)/(DEATH_T-1.6));ctx.translate(sx,sy-bounce);ctx.rotate(m.fdir*e*1.35);ctx.scale(1,1-e*.25);ctx.translate(-sx,-sy);drawMon(m);
    if(t>.42){ctx.globalAlpha*=Math.min(.45,(t-.42)*.8);ctx.fillStyle='#000';ctx.translate(sx,sy);ctx.rotate(m.fdir*1.35);ctx.beginPath();ctx.ellipse(0,-14*Z*m.size,9*Z*m.size,16*Z*m.size,0,0,7);ctx.fill();}}
  ctx.restore();ctx.globalAlpha=1;m.flash=fl;}
function drawMon(m){
  if(m.dummy){const[sx,sy]=scr(m.x,m.y),s=Z*1.3;ctx.save();if(m.flash>0)ctx.globalAlpha=.75;shadow(sx,sy,10);ctx.strokeStyle='#5a3e24';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx,sy-40*s);ctx.moveTo(sx-11*s,sy-30*s);ctx.lineTo(sx+11*s,sy-30*s);ctx.stroke();ctx.fillStyle=m.flash>0?'#fff0d0':'#c8a868';ctx.beginPath();ctx.ellipse(sx,sy-24*s,7*s,11*s,0,0,7);ctx.fill();ctx.fillStyle='#b89858';ctx.beginPath();ctx.arc(sx,sy-40*s,5*s,0,7);ctx.fill();ctx.strokeStyle='#a02a20';ctx.lineWidth=1.5*s;ctx.beginPath();ctx.arc(sx,sy-24*s,4*s,0,7);ctx.stroke();ctx.restore();return;}
  if(m.hid>0)return;/* v6.21 : saute-ombre caché ; sauteur en l’air (l’ombre reste au sol) */
  const[sx,sy0]=scr(m.x,m.y),sy=sy0-(m.jz||0)*Z,s=Z*m.size,bob=Math.sin(m.ph*6)*1.5*s,hover=hoverMon===m||p.target===m;
  if(m.under){if(m.emerge>0)return;ctx.fillStyle='#4a3e2c';ctx.beginPath();ctx.ellipse(sx,sy,10*s,4*s,0,0,7);ctx.fill();ctx.fillStyle='#6a5a40';ctx.beginPath();ctx.ellipse(sx,sy-2*s,7*s,3*s,0,Math.PI,0);ctx.fill();return;}
  SHL=true;shadow(sx,sy0,11*m.size);SHL=false;
  if(hover){ctx.strokeStyle='rgba(232,196,106,.8)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(sx,sy0,15*Z*m.size,6.5*Z*m.size,0,0,7);ctx.stroke();}
  if((m.champ||m.mini||m.guard)&&!m.boss&&m.hp>0){/* v6.34 : anneau d’élite au sol, qui pulse */const pu=.5+.5*Math.sin(S.t*4+m.ph),col=m.guard?'#c060ff':m.mini?'#e8c46a':champCol(m),rx=(17+pu*2)*Z*m.size,ry=(7.4+pu*.9)*Z*m.size;
    ctx.save();ctx.globalAlpha=.55+.3*pu;ctx.strokeStyle=col;ctx.lineWidth=(m.mini||m.guard?2.4:1.8)*Z;ctx.beginPath();ctx.ellipse(sx,sy0,rx,ry,0,0,7);ctx.stroke();
    if(m.cx&&m.cx.length>1){ctx.strokeStyle=CAFX[m.cx[1]].c;ctx.globalAlpha=.45;ctx.lineWidth=1.2*Z;ctx.beginPath();ctx.ellipse(sx,sy0,rx*.8,ry*.8,0,0,7);ctx.stroke();}ctx.restore();}
  ctx.save();
  if(m.flash>0&&FLN++<4)ctx.filter='brightness(2.4)';
  if(m.champ){ctx.shadowColor=m.herald?m.hcol:champCol(m);ctx.shadowBlur=m.herald?22:12;}
  if(m.herald&&!m.dead&&!p.eco){const pu=.5+.5*Math.sin(S.t*3+m.ph);ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=m.hcol;ctx.globalAlpha=.10+.08*pu;ctx.beginPath();ctx.ellipse(sx,sy0-18*s,22*s,30*s,0,0,7);ctx.fill();ctx.restore();if(Math.random()<.25)S.parts.push({x:m.x+rnd(-.4,.4),y:m.y+rnd(-.4,.4),z:rnd(.2,1.2),vx:0,vy:0,vz:rnd(.4,.9),life:.9,col:m.hcol,fl:true});}
  if(m.guard){ctx.shadowColor='#c060ff';ctx.shadowBlur=18;}
  if(m.mini){ctx.shadowColor=m.tel>0?'#ff5020':m.shell>0?'#e8ecf2':(m.flag&&!m.flag.dead)?'#ffffff':'#e8c46a';ctx.shadowBlur=m.tel>0?26:(m.flag&&!m.flag.dead)?24:16;}
  if(m.echo){ctx.globalAlpha=.6;}
  if(m.lurk){ctx.globalAlpha=.1+.06*Math.sin(S.t*5+m.ph);}
  if(m.slow>0){ctx.shadowColor='#9fd4ff';ctx.shadowBlur=10;}
  const lunge=m.atk>0?6*s:0;const[fx]=sdir(m.face);const side=fx>=0?1:-1;
  if(m.fallen&&m.kind!=='lord'){ctx.globalAlpha=.75;ctx.translate(sx,sy);ctx.scale(1,.45);ctx.translate(-sx,-sy);}
  if(m.kind==='banner'){const w=Math.sin(S.t*3+m.ph)*3*s;ctx.strokeStyle='#3a2a1a';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx,sy-58*s);ctx.stroke();
    ctx.fillStyle=vgrad(sy-56*s,sy-24*s,'#a02a20','#4a0e0a');ctx.beginPath();ctx.moveTo(sx,sy-56*s);ctx.lineTo(sx+18*s+w,sy-54*s);ctx.lineTo(sx+15*s+w,sy-26*s);ctx.lineTo(sx+8*s+w*.5,sy-31*s);ctx.lineTo(sx,sy-24*s);ctx.closePath();ctx.fill();
    ctx.fillStyle='#d8d4c4';ctx.beginPath();ctx.arc(sx+9*s+w*.5,sy-43*s,3.5*s,0,7);ctx.fill();ctx.strokeStyle='rgba(255,120,80,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(sx,sy,BOSSES.heraut.banner.r*TW/2*Z*1.42,BOSSES.heraut.banner.r*TH/2*Z*1.42,0,0,7);ctx.stroke();}
  else if(m.kind==='lord'&&m.divine!=null){drawDivine(sx,sy,m);}
  else if(m.kind==='lord'){if(m.fallen){ctx.globalAlpha=.75;ctx.translate(sx,sy);ctx.scale(1,.45);ctx.translate(-sx,-sy);}
    const FM=m.fallen?1:(m.form||1);
    if(FM>=3){const fl=Math.sin(S.t*2.4)*4*s;for(const k of[-1,1]){ctx.fillStyle='rgba(40,34,30,.92)';ctx.beginPath();ctx.moveTo(sx+k*6*s,sy-42*s+bob);ctx.quadraticCurveTo(sx+k*30*s,sy-80*s+fl,sx+k*52*s,sy-70*s+fl);
        for(let q=0;q<4;q++)ctx.quadraticCurveTo(sx+k*(48-q*9)*s,sy-(56-q*6)*s+fl*.6,sx+k*(44-q*9)*s,sy-(44-q*7)*s);ctx.lineTo(sx+k*8*s,sy-24*s);ctx.closePath();ctx.fill();
        ctx.strokeStyle='#d8d0bc';ctx.lineWidth=2*s;ctx.beginPath();for(let q=0;q<4;q++){ctx.moveTo(sx+k*7*s,sy-40*s+bob);ctx.lineTo(sx+k*(50-q*9)*s,sy-(66-q*8)*s+fl*(1-q*.2));}ctx.stroke();}}
    ctx.fillStyle=vgrad(sy-50*s,sy,'#6a645c','#1e1c1a');ctx.beginPath();ctx.moveTo(sx-10*s,sy-44*s+bob);ctx.quadraticCurveTo(sx-22*s,sy-20*s,sx-18*s-side*2*s,sy);ctx.lineTo(sx+18*s-side*2*s,sy);ctx.quadraticCurveTo(sx+22*s,sy-20*s,sx+10*s,sy-44*s+bob);ctx.closePath();ctx.fill();
    ctx.fillStyle=vgrad(sy-46*s,sy-12*s,'#4a4844','#161514');ctx.beginPath();ctx.moveTo(sx-9*s,sy-45*s+bob);ctx.lineTo(sx+9*s,sy-45*s+bob);ctx.lineTo(sx+7*s,sy-12*s);ctx.lineTo(sx-7*s,sy-12*s);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#8a8478';ctx.lineWidth=1.2*s;ctx.beginPath();ctx.moveTo(sx,sy-44*s+bob);ctx.lineTo(sx,sy-14*s);ctx.moveTo(sx-7*s,sy-30*s);ctx.lineTo(sx+7*s,sy-30*s);ctx.stroke();
    ctx.fillStyle='#2a2826';ctx.beginPath();ctx.arc(sx,sy-51*s+bob,6.5*s,0,7);ctx.fill();
    ctx.fillStyle='#bdb6a8';for(let k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(sx+k*3*s-1.5*s,sy-56*s+bob);ctx.lineTo(sx+k*3*s,sy-(63+(2-Math.abs(k))*3)*s+bob);ctx.lineTo(sx+k*3*s+1.5*s,sy-56*s+bob);ctx.fill();}
    ctx.shadowColor='#f0ece0';ctx.shadowBlur=10;ctx.fillStyle='#f4f0e4';ctx.fillRect(sx-3.5*s,sy-52*s+bob,2.4*s,1.6*s);ctx.fillRect(sx+1.1*s,sy-52*s+bob,2.4*s,1.6*s);ctx.shadowBlur=0;
    const ax=sx+side*(12*s+lunge),ay=sy-30*s;ctx.strokeStyle='#cfcabe';ctx.lineWidth=4*s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax+side*16*s,ay-28*s);ctx.stroke();
    ctx.strokeStyle='#5a4a3a';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(ax-side*3*s,ay+5*s);ctx.lineTo(ax+side*1*s,ay-1*s);ctx.stroke();
    if(FM>=2){const sw=Math.sin(S.t*3+m.ph)*3*s;ctx.strokeStyle='#4a4640';ctx.lineWidth=3.6*s;ctx.lineCap='round';for(const k of[-1,1]){ctx.beginPath();ctx.moveTo(sx+k*8*s,sy-26*s+bob);ctx.quadraticCurveTo(sx+k*20*s,sy-20*s+sw*k,sx+k*24*s,sy-8*s+sw*k);ctx.stroke();
        ctx.strokeStyle='#cfcabe';ctx.lineWidth=1.4*s;ctx.beginPath();for(let c=-1;c<=1;c++){ctx.moveTo(sx+k*24*s,sy-8*s+sw*k);ctx.lineTo(sx+k*(26+c)*s,sy-3*s+sw*k+c*1.5*s);}ctx.stroke();ctx.strokeStyle='#4a4640';ctx.lineWidth=3.6*s;}}
    if(FM>=3){ctx.fillStyle='#e8e0cc';for(let k=-4;k<=4;k++){if(Math.abs(k)<=2)continue;const h=(16-Math.abs(k)*2)*s;ctx.beginPath();ctx.moveTo(sx+k*2.6*s-1.6*s,sy-55*s+bob);ctx.lineTo(sx+k*4.4*s,sy-55*s-h+bob);ctx.lineTo(sx+k*2.6*s+1.6*s,sy-55*s+bob);ctx.fill();}
      ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(255,110,50,${(.6+Math.sin(S.t*5)*.3).toFixed(2)})`;ctx.lineWidth=1.4*s;ctx.beginPath();for(let k=-1;k<=1;k++){ctx.moveTo(sx+k*4*s,sy-42*s+bob);ctx.lineTo(sx+k*5*s+2*s,sy-32*s);ctx.lineTo(sx+k*4*s-1*s,sy-20*s);}ctx.stroke();ctx.globalCompositeOperation='source-over';
      ctx.shadowColor='#ff4020';ctx.shadowBlur=12;ctx.fillStyle='#ff5a30';ctx.fillRect(sx-3.5*s,sy-52*s+bob,2.4*s,1.6*s);ctx.fillRect(sx+1.1*s,sy-52*s+bob,2.4*s,1.6*s);ctx.shadowBlur=0;}
    if(m.beaten){ctx.fillStyle='rgba(240,236,224,.15)';ctx.beginPath();ctx.ellipse(sx,sy-30*s,26*s,40*s,0,0,7);ctx.fill();}}
  else if(m.kind==='weaver'){
    ctx.strokeStyle='#2a2030';ctx.lineWidth=2.2*s;ctx.lineCap='round';
    for(const k of[-1,1])for(let j=0;j<4;j++){const ph=Math.sin(m.ph*10+j*1.7)*2*s,bx=sx+k*6*s,by=sy-12*s+j*2*s;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+k*(9+j*2)*s,by-8*s+ph);ctx.lineTo(bx+k*(14+j*2)*s,sy+1*s);ctx.stroke();}
    ctx.fillStyle=vgrad(sy-26*s,sy-6*s,m.col||'#9a8ab0','#2a2030');ctx.beginPath();ctx.ellipse(sx-side*4*s,sy-14*s,11*s,8*s,0,0,7);ctx.fill();
    ctx.fillStyle=shade(hexc(m.col||'#9a8ab0'),.6);ctx.beginPath();ctx.ellipse(sx+side*(8*s+lunge*.5),sy-16*s,6*s,5*s,0,0,7);ctx.fill();
    ctx.fillStyle='#ff4a6a';for(let k=0;k<3;k++)ctx.fillRect(sx+side*(10*s+lunge*.5)+(k-1)*2.2*s,sy-18*s,1.5*s,1.5*s);}
  else if(m.kind==='breach'){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy-26*s,2,sx,sy-26*s,26*s);g.addColorStop(0,'rgba(240,210,255,.95)');g.addColorStop(.4,'rgba(150,60,220,.8)');g.addColorStop(1,'rgba(60,10,100,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(sx,sy-26*s,14*s+Math.sin(S.t*7)*1.5*s,26*s,0,0,7);ctx.fill();ctx.strokeStyle='rgba(220,180,255,.8)';ctx.lineWidth=2*s;for(let k=0;k<3;k++){ctx.beginPath();ctx.ellipse(sx,sy-26*s,(10-k*3)*s,(20-k*6)*s,S.t*(3+k),0,4.5);ctx.stroke();}ctx.globalCompositeOperation='source-over';}
  else if(m.kind==='nest'){ctx.fillStyle=vgrad(sy-26*s,sy,'#5a3a26','#1e120a');ctx.beginPath();ctx.moveTo(sx-16*s,sy);ctx.quadraticCurveTo(sx-12*s,sy-26*s,sx,sy-28*s);ctx.quadraticCurveTo(sx+12*s,sy-26*s,sx+16*s,sy);ctx.closePath();ctx.fill();
    ctx.shadowColor='#ff7a2a';ctx.shadowBlur=10;ctx.strokeStyle=`rgba(255,${120+Math.sin(m.ph*4)*40|0},40,.9)`;ctx.lineWidth=1.6*s;ctx.beginPath();ctx.moveTo(sx-8*s,sy-4*s);ctx.lineTo(sx-3*s,sy-14*s);ctx.lineTo(sx+2*s,sy-8*s);ctx.lineTo(sx+7*s,sy-20*s);ctx.stroke();ctx.shadowBlur=0;}
  else if(m.kind==='shroom'){const hop=Math.abs(Math.sin(m.ph*8))*6*s;ctx.fillStyle='#ece4d4';ctx.fillRect(sx-4*s,sy-14*s-hop,8*s,14*s);ctx.fillStyle=m.col;ctx.beginPath();ctx.ellipse(sx,sy-14*s-hop,13*s,8*s,0,Math.PI,0);ctx.fill();
    ctx.fillStyle='#fff';for(const[a,b]of[[-6,-18],[3,-20],[7,-16]]){ctx.beginPath();ctx.arc(sx+a*s,sy+b*s-hop,1.8*s,0,7);ctx.fill();}ctx.fillStyle='#2a1a10';ctx.fillRect(sx-2.5*s,sy-9*s-hop,1.4*s,2*s);ctx.fillRect(sx+1.2*s,sy-9*s-hop,1.4*s,2*s);
    ctx.strokeStyle='#2a1a10';ctx.lineWidth=1*s;ctx.beginPath();ctx.arc(sx,sy-6*s-hop,2*s,.2,Math.PI-.2);ctx.stroke();}
  else if(m.steed){const F=m.fur||(m.pal?[m.pal[1],m.pal[0],m.pal[3]]:['#d8d8dc','#6a6a72','#c8c8d0']),st=Math.sin(m.ph*12)*3*s,bx=sx+side*lunge*.4,by=sy-22*s,hx=bx+side*20*s,hy=sy-38*s;
    ctx.strokeStyle='#3a3a42';ctx.lineWidth=3*s;ctx.lineCap='round';for(const[k,o]of[[-11,st],[-6,-st],[7,-st],[12,st]]){ctx.beginPath();ctx.moveTo(bx+k*s,by+4*s);ctx.lineTo(bx+k*s+o,sy-1*s);ctx.stroke();}
    ctx.strokeStyle=F[1];ctx.lineWidth=2.4*s;ctx.beginPath();ctx.moveTo(bx-side*16*s,by-2*s);ctx.quadraticCurveTo(bx-side*24*s,by+6*s,bx-side*20*s,by+14*s);ctx.stroke();
    ctx.fillStyle=vgrad(by-9*s,by+8*s,F[0],F[1]);ctx.beginPath();ctx.ellipse(bx,by,17*s,8.5*s,0,0,7);ctx.fill();
    ctx.strokeStyle='rgba(30,30,40,.4)';ctx.lineWidth=1*s;ctx.beginPath();for(let k=-1;k<=1;k++){ctx.moveTo(bx+k*4*s,by-6*s);ctx.quadraticCurveTo(bx+k*4*s+2*s,by,bx+k*4*s,by+5*s);}ctx.stroke();
    ctx.fillStyle=F[2];ctx.beginPath();ctx.moveTo(bx+side*10*s,by-6*s);ctx.lineTo(hx-side*4*s,hy-3*s);ctx.lineTo(hx+side*1*s,hy+5*s);ctx.lineTo(bx+side*15*s,by+2*s);ctx.closePath();ctx.fill();
    ctx.save();ctx.translate(hx+side*3*s,hy+3*s);ctx.rotate(side*.55);ctx.beginPath();ctx.ellipse(0,0,8*s,3.8*s,0,0,7);ctx.fill();ctx.restore();
    ctx.strokeStyle='#2a2a30';ctx.lineWidth=2*s;ctx.beginPath();for(let k=0;k<5;k++){const t=k/4,mx=bx+side*(10+t*(16))*s,my=by-6*s+(hy-by+3*s)*t;ctx.moveTo(mx,my);ctx.lineTo(mx-side*4*s,my+5*s+k);}ctx.stroke();
    ctx.shadowColor='#e8e8ff';ctx.shadowBlur=12;ctx.strokeStyle='#f6f6ff';ctx.lineWidth=2.6*s;ctx.beginPath();ctx.moveTo(hx+side*0*s,hy-3*s);ctx.lineTo(hx+side*7*s,hy-17*s);ctx.stroke();ctx.shadowBlur=0;
    ctx.strokeStyle='rgba(110,110,130,.9)';ctx.lineWidth=1*s;ctx.beginPath();for(let k=1;k<4;k++){const t=k/4;ctx.moveTo(hx+side*(t*7-1.5)*s,hy-(3+t*14)*s+1.5*s);ctx.lineTo(hx+side*(t*7+1.5)*s,hy-(3+t*14)*s-1.5*s);}ctx.stroke();
    ctx.shadowColor='#ff3020';ctx.shadowBlur=8;ctx.fillStyle='#ff4a3a';ctx.beginPath();ctx.arc(hx+side*4*s,hy+1*s,1.4*s,0,7);ctx.fill();ctx.shadowBlur=0;}
  else if(m.kind==='slime'){/* v6.15 : gelée qui rebondit (et brûle si elle est de feu) */
    const C=hexc(m.col||'#ff6a20'),sq=Math.sin(m.ph*7),w=12*s*(1+.14*sq),h=11*s*(1-.14*sq),cy=sy-h*.9;
    ctx.fillStyle=vgrad(cy-h,sy,shade(C,1.35),shade(C,.5));ctx.beginPath();ctx.moveTo(sx-w,sy-1*s);ctx.quadraticCurveTo(sx-w*1.05,cy-h*.9,sx,cy-h);ctx.quadraticCurveTo(sx+w*1.05,cy-h*.9,sx+w,sy-1*s);ctx.quadraticCurveTo(sx,sy+2*s,sx-w,sy-1*s);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(sx-w*.4,cy-h*.55,w*.18,h*.12,-.5,0,7);ctx.fill();
    ctx.fillStyle='#1a0a04';ctx.beginPath();ctx.ellipse(sx+side*3*s-2.5*s,cy-h*.2,1.5*s,2.2*s,0,0,7);ctx.ellipse(sx+side*3*s+2.5*s,cy-h*.2,1.5*s,2.2*s,0,0,7);ctx.fill();
    if(!p.eco){ctx.globalCompositeOperation='lighter';glowG(ctx,sx,cy-h*.3,w*1.6,`${C[0]},${C[1]},${C[2]}`,.25);ctx.globalCompositeOperation='source-over';if(C[0]>200&&C[2]<120)flame(sx,cy-h*.95,s*.6,m.ph);}}
  else if(m.kind==='scorp'){/* v6.15 : scorpion : pinces, huit pattes, queue recourbée et dard */
    const C=hexc(m.col||'#b08040'),st=Math.sin(m.ph*14)*1.6*s,bx=sx+side*lunge*.4,by=sy-7*s,tk=m.atk>0?6*s:0;
    ctx.strokeStyle=shade(C,.45);ctx.lineWidth=1.6*s;ctx.lineCap='round';ctx.beginPath();
    for(let k=0;k<4;k++){const lx=bx+side*(-6+k*4)*s,o=(k%2?st:-st);ctx.moveTo(lx,by);ctx.lineTo(lx-4*s+o,by+3*s);ctx.lineTo(lx-5*s+o,sy+1*s);ctx.moveTo(lx,by);ctx.lineTo(lx+4*s-o,by+3*s);ctx.lineTo(lx+5*s-o,sy+1.5*s);}ctx.stroke();
    ctx.strokeStyle=shade(C,.85);ctx.lineWidth=4*s;ctx.beginPath();ctx.moveTo(bx-side*10*s,by-1*s);ctx.bezierCurveTo(bx-side*20*s,by-10*s,bx-side*16*s,by-24*s,bx-side*5*s+side*tk,by-22*s-tk*.3);ctx.stroke();
    ctx.strokeStyle=shade(C,.6);ctx.lineWidth=1*s;ctx.beginPath();for(let k=1;k<5;k++){const u=k/5,ax=bx-side*(10+u*6)*s,ay=by-1*s-u*20*s;ctx.moveTo(ax-2*s,ay);ctx.lineTo(ax+2*s,ay);}ctx.stroke();
    {const stx=bx-side*5*s+side*tk,sty=by-22*s-tk*.3;ctx.fillStyle='#2a1a0a';ctx.beginPath();ctx.moveTo(stx,sty-2.5*s);ctx.lineTo(stx+side*6*s,sty+2*s);ctx.lineTo(stx,sty+2.5*s);ctx.fill();}
    ctx.fillStyle=vgrad(by-6*s,by+4*s,shade(C,1.25),shade(C,.55));for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(bx+side*(4-k*4)*s,by-1*s,(6-k*.6)*s,4.2*s,0,0,7);ctx.fill();}
    for(const o of[-2,2]){const px=bx+side*(10*s+lunge*.6),py=by+o*s;ctx.strokeStyle=shade(C,.7);ctx.lineWidth=2.4*s;ctx.beginPath();ctx.moveTo(bx+side*6*s,by);ctx.lineTo(px,py-2*s);ctx.stroke();
      ctx.fillStyle=shade(C,1.1);ctx.beginPath();ctx.ellipse(px+side*3*s,py-2*s,3.6*s,2.2*s,0,0,7);ctx.fill();ctx.strokeStyle='#1a0a04';ctx.lineWidth=1*s;ctx.beginPath();ctx.moveTo(px+side*1*s,py-2*s);ctx.lineTo(px+side*6*s,py-2*s);ctx.stroke();}
    ctx.shadowColor='#ffb030';ctx.shadowBlur=4;ctx.fillStyle='#ffe070';ctx.fillRect(bx+side*6*s-.6*s,by-4.5*s,1.2*s,1.2*s);ctx.fillRect(bx+side*7.6*s-.6*s,by-4.5*s,1.2*s,1.2*s);ctx.shadowBlur=0;}
  else if(m.kind==='drake'){/* v6.15 : dragon (dragonnet ou dragonne) : ailes, long cou, cornes, feu dans la gueule */
    const C=hexc(m.col||'#b0401a'),st=Math.sin(m.ph*12)*2*s,bx=sx+side*lunge*.3,by=sy-12*s,fl=Math.sin(S.t*5+m.ph)*5*s,dk=shade(C,.45);
    const wing=(o)=>{const wx=bx+side*2*s,wy=by-6*s+o*1*s;ctx.fillStyle=o<0?shade(C,.35):shade(C,.6);ctx.beginPath();ctx.moveTo(wx,wy);ctx.lineTo(bx-side*4*s+o*side*2*s,by-34*s+fl);ctx.quadraticCurveTo(bx-side*14*s,by-30*s+fl,bx-side*22*s,by-20*s+fl*.6);
      ctx.quadraticCurveTo(bx-side*14*s,by-16*s,bx-side*12*s,by-6*s);ctx.quadraticCurveTo(bx-side*6*s,by-12*s,wx,wy);ctx.fill();
      ctx.strokeStyle=dk;ctx.lineWidth=1.2*s;ctx.beginPath();ctx.moveTo(wx,wy);ctx.lineTo(bx-side*4*s,by-34*s+fl);ctx.moveTo(bx-side*4*s,by-34*s+fl);ctx.lineTo(bx-side*12*s,by-8*s);ctx.moveTo(bx-side*4*s,by-34*s+fl);ctx.lineTo(bx-side*20*s,by-20*s+fl*.6);ctx.stroke();};
    wing(-1);
    ctx.strokeStyle=shade(C,.7);ctx.lineWidth=4*s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(bx-side*10*s,by);ctx.quadraticCurveTo(bx-side*22*s,by+5*s+st,bx-side*28*s,by-3*s);ctx.stroke();
    ctx.fillStyle=dk;ctx.beginPath();ctx.moveTo(bx-side*27*s,by-3*s);ctx.lineTo(bx-side*34*s,by-8*s);ctx.lineTo(bx-side*31*s,by+1*s);ctx.fill();
    ctx.strokeStyle=dk;ctx.lineWidth=3.4*s;ctx.beginPath();for(const[ox,ph]of[[-7,1],[-3,-1],[5,-1],[9,1]]){ctx.moveTo(bx+side*ox*s,by+2*s);ctx.lineTo(bx+side*ox*s+st*ph,sy);}ctx.stroke();
    ctx.fillStyle=vgrad(by-8*s,by+6*s,shade(C,1.2),shade(C,.5));ctx.beginPath();ctx.ellipse(bx,by,13*s,7*s,0,0,7);ctx.fill();
    ctx.strokeStyle=shade(C,1.6);ctx.lineWidth=1*s;ctx.beginPath();for(let k=-2;k<=2;k++){ctx.moveTo(bx+k*4*s,by+3*s);ctx.lineTo(bx+k*4*s+side*1*s,by+6*s);}ctx.stroke();
    ctx.fillStyle=dk;for(let k=-3;k<=2;k++){ctx.beginPath();ctx.moveTo(bx+side*k*3.5*s-1.5*s,by-6.5*s);ctx.lineTo(bx+side*k*3.5*s,by-10*s);ctx.lineTo(bx+side*k*3.5*s+1.5*s,by-6.5*s);ctx.fill();}
    const hx=bx+side*(19*s+lunge*.4),hy=by-15*s;ctx.strokeStyle=shade(C,.95);ctx.lineWidth=5*s;ctx.beginPath();ctx.moveTo(bx+side*9*s,by-3*s);ctx.quadraticCurveTo(bx+side*15*s,by-6*s,hx-side*2*s,hy+1*s);ctx.stroke();
    ctx.fillStyle=vgrad(hy-5*s,hy+5*s,shade(C,1.25),shade(C,.6));ctx.beginPath();ctx.moveTo(hx-side*4*s,hy-4*s);ctx.quadraticCurveTo(hx+side*4*s,hy-6*s,hx+side*10*s,hy);ctx.lineTo(hx+side*9*s,hy+3*s);ctx.quadraticCurveTo(hx,hy+5*s,hx-side*4*s,hy+3*s);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#e8d8b0';ctx.lineWidth=1.6*s;ctx.beginPath();ctx.moveTo(hx-side*1*s,hy-4*s);ctx.quadraticCurveTo(hx-side*5*s,hy-9*s,hx-side*9*s,hy-9*s);ctx.moveTo(hx+side*1*s,hy-5*s);ctx.quadraticCurveTo(hx-side*2*s,hy-11*s,hx-side*6*s,hy-12*s);ctx.stroke();
    ctx.shadowColor='#ffd040';ctx.shadowBlur=6;ctx.fillStyle='#ffe060';ctx.fillRect(hx+side*3*s-.8*s,hy-2.6*s,1.6*s,1.3*s);ctx.shadowBlur=0;
    wing(1);
    if(m.atk>0||m.tel>0){ctx.save();ctx.globalCompositeOperation='lighter';const fx2=hx+side*10*s,fy=hy+1.5*s,L=(m.atk>0?26:10)*s,g=ctx.createLinearGradient(fx2,fy,fx2+side*L,fy);g.addColorStop(0,'rgba(255,240,160,.95)');g.addColorStop(.4,'rgba(255,140,40,.7)');g.addColorStop(1,'rgba(200,40,10,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(fx2,fy);ctx.lineTo(fx2+side*L,fy-L*.35);ctx.lineTo(fx2+side*L,fy+L*.35);ctx.closePath();ctx.fill();ctx.restore();}
    else if(!p.eco){ctx.save();ctx.globalCompositeOperation='lighter';glowG(ctx,hx+side*9*s,hy+1.5*s,4*s,'255,140,40',.5);ctx.restore();}}
  else if(m.kind==='beast'){/* v5.67 : bête à quatre pattes, échine, queue, gueule */
    const F=m.fur||['#a8704a','#4a2a16','#8c5a38'],st=Math.sin(m.ph*14)*2.4*s,bx=sx+side*lunge*.5;
    ctx.strokeStyle=F[1];ctx.lineWidth=2.6*s;ctx.lineCap='round';ctx.beginPath();
    for(const[ox,ph]of[[-8,1],[-4,-1],[5,-1],[9,1]]){ctx.moveTo(bx+ox*s*side,sy-7*s);ctx.lineTo(bx+ox*s*side+st*ph,sy);}ctx.stroke();
    ctx.strokeStyle=F[0];ctx.lineWidth=2.2*s;ctx.beginPath();ctx.moveTo(bx-side*12*s,sy-11*s);ctx.quadraticCurveTo(bx-side*18*s,sy-14*s+st*.5,bx-side*20*s,sy-9*s+st);ctx.stroke();
    ctx.fillStyle=vgrad(sy-17*s,sy-4*s,F[0],F[1]);ctx.beginPath();ctx.moveTo(bx-side*13*s,sy-9*s);ctx.quadraticCurveTo(bx-side*6*s,sy-17*s,bx+side*7*s,sy-14*s);ctx.quadraticCurveTo(bx+side*11*s,sy-8*s,bx+side*4*s,sy-5*s);ctx.lineTo(bx-side*10*s,sy-5*s);ctx.closePath();ctx.fill();
    ctx.strokeStyle=shade(hexc(F[1]),.6);ctx.lineWidth=1.3*s;ctx.beginPath();for(let k=-3;k<=2;k++){const x=bx+side*k*3*s,y=sy-15*s-Math.cos(k*.5)*1.5*s;ctx.moveTo(x,y);ctx.lineTo(x-side*2*s,y-3.5*s);}ctx.stroke();
    const hx=bx+side*(12*s+lunge*.5),hy=sy-13*s;ctx.fillStyle=F[2];ctx.beginPath();ctx.moveTo(hx-side*4*s,hy-4*s);ctx.quadraticCurveTo(hx+side*2*s,hy-6*s,hx+side*8*s,hy-1*s);ctx.lineTo(hx+side*7*s,hy+1.5*s);ctx.quadraticCurveTo(hx,hy+4*s,hx-side*4*s,hy+3*s);ctx.closePath();ctx.fill();
    ctx.fillStyle=F[1];ctx.beginPath();ctx.moveTo(hx-side*2*s,hy-4*s);ctx.lineTo(hx-side*1*s,hy-8*s);ctx.lineTo(hx+side*1*s,hy-4.5*s);ctx.fill();
    ctx.shadowColor='#ffb030';ctx.shadowBlur=5;ctx.fillStyle='#ffd060';ctx.fillRect(hx+side*2*s-.8*s,hy-2.8*s,1.6*s,1.4*s);ctx.shadowBlur=0;
    ctx.fillStyle='#e8e0cc';for(let k=0;k<3;k++)ctx.fillRect(hx+side*(4+k*1.4)*s-.4*s,hy+.6*s,.8*s,1.6*s);
    if(m.heads>1)for(const[ox,oy]of[[-3,-7],[-1,6]]){const qx=hx+side*ox*s,qy=hy+oy*s;ctx.strokeStyle=F[0];ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(bx+side*6*s,sy-11*s);ctx.lineTo(qx-side*2*s,qy);ctx.stroke();
      ctx.fillStyle=shade(hexc(F[2]),.85);ctx.beginPath();ctx.moveTo(qx-side*4*s,qy-3.5*s);ctx.quadraticCurveTo(qx+side*2*s,qy-5.5*s,qx+side*7*s,qy-1*s);ctx.lineTo(qx+side*6*s,qy+1.5*s);ctx.quadraticCurveTo(qx,qy+3.5*s,qx-side*4*s,qy+2.5*s);ctx.closePath();ctx.fill();
      ctx.fillStyle=F[1];ctx.beginPath();ctx.moveTo(qx-side*2*s,qy-3.5*s);ctx.lineTo(qx-side*1*s,qy-7*s);ctx.lineTo(qx+side*1*s,qy-4*s);ctx.fill();ctx.shadowColor='#ff3020';ctx.shadowBlur=6;ctx.fillStyle='#ff5a3a';ctx.fillRect(qx+side*2*s-.7*s,qy-2.4*s,1.4*s,1.2*s);ctx.shadowBlur=0;}
    if(m.antler){ctx.strokeStyle='#d8c8a0';ctx.lineWidth=1.4*s;ctx.lineCap='round';ctx.beginPath();for(const o of[-1.5,1]){const ax=hx+side*o*s,ay=hy-4*s;ctx.moveTo(ax,ay);ctx.lineTo(ax-side*3*s,ay-9*s);ctx.lineTo(ax-side*7*s,ay-15*s);ctx.moveTo(ax-side*1.5*s,ay-5*s);ctx.lineTo(ax+side*3*s,ay-10*s);ctx.moveTo(ax-side*3*s,ay-9*s);ctx.lineTo(ax,ay-14*s);ctx.moveTo(ax-side*5*s,ay-12*s);ctx.lineTo(ax-side*9*s,ay-12*s);}ctx.stroke();}
    if(m.tusk){ctx.strokeStyle='#f0e8d0';ctx.lineWidth=1.8*s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(hx+side*5*s,hy+1.5*s);ctx.quadraticCurveTo(hx+side*10*s,hy+2*s,hx+side*9*s,hy-4*s);ctx.stroke();}}
  else if(m.kind==='ghost'){ctx.globalAlpha=.85;ctx.fillStyle=vgrad(sy-46*s,sy,m.gcol||'#8a78c8','rgba(40,30,70,0)');ctx.beginPath();ctx.moveTo(sx-10*s,sy-6*s+bob);ctx.quadraticCurveTo(sx-13*s,sy-44*s+bob,sx,sy-47*s+bob);ctx.quadraticCurveTo(sx+13*s,sy-44*s+bob,sx+10*s,sy-6*s+bob);
    for(let k=0;k<4;k++)ctx.lineTo(sx+10*s-k*5*s-2.5*s,sy-2*s+bob+Math.sin(m.ph*8+k)*3*s);ctx.closePath();ctx.fill();
    ctx.globalAlpha=1;ctx.shadowColor='#cfe0ff';ctx.shadowBlur=8;ctx.fillStyle='#e8f0ff';ctx.fillRect(sx-5*s,sy-36*s+bob,3*s,3*s);ctx.fillRect(sx+2*s,sy-36*s+bob,3*s,3*s);
    ctx.fillStyle='#1a1030';ctx.beginPath();ctx.ellipse(sx,sy-29*s+bob,2.5*s,3.5*s,0,0,7);ctx.fill();
    /* v5.68 : halo froid et volutes qui traînent */
    if(!p.eco){ctx.globalCompositeOperation='lighter';const gc=hexc(m.gcol||'#8a78c8');glowG(ctx,sx,sy-28*s+bob,22*s,`${gc[0]},${gc[1]},${gc[2]}`,.22);ctx.globalCompositeOperation='source-over';
      ctx.strokeStyle=`rgba(${gc[0]},${gc[1]},${gc[2]},.35)`;ctx.lineWidth=1.4*s;ctx.beginPath();for(let k=0;k<3;k++){const ph=m.ph*3+k*2.1;ctx.moveTo(sx+(k-1)*5*s,sy-4*s+bob);ctx.bezierCurveTo(sx+(k-1)*5*s+Math.sin(ph)*5*s,sy+2*s,sx-side*(6+k*3)*s,sy-2*s+Math.cos(ph)*2*s,sx-side*(10+k*4)*s,sy-6*s+Math.sin(ph*1.3)*3*s);}ctx.stroke();}
    if(m.t==='lanterne'){const lx=sx+side*12*s,ly=sy-24*s+bob+Math.sin(m.ph*2)*1.5*s;ctx.strokeStyle='#4a4030';ctx.lineWidth=1.2*s;ctx.beginPath();ctx.moveTo(sx+side*6*s,sy-30*s+bob);ctx.lineTo(lx,ly-6*s);ctx.lineTo(lx,ly-3*s);ctx.stroke();
      ctx.fillStyle='#3a3020';ctx.fillRect(lx-3*s,ly-3*s,6*s,7*s);ctx.shadowColor='#ffe090';ctx.shadowBlur=12;ctx.fillStyle='#ffe8a0';ctx.fillRect(lx-2*s,ly-2*s,4*s,5*s);ctx.shadowBlur=0;}}
  else if(m.kind==='boss'){/* v5.70 : la Mère redessinée : ailes membraneuses à baleines d’os, robe en lambeaux, bras griffus, fissures qui respirent */
    const VP=m.pal||['#2a0a06','#b03020','#3a0d08','#5a120c'],br=Math.sin(S.t*2.2+m.ph)*.5+.5,fl=Math.sin(S.t*1.6+m.ph)*3*s,glw=m.tel>0?'255,90,40':'255,120,40';
    for(const k of[-1,1]){const wx=sx+k*12*s,wy=sy-34*s+bob;ctx.fillStyle=VP[0];ctx.beginPath();ctx.moveTo(wx,wy);ctx.quadraticCurveTo(sx+k*30*s,sy-62*s+bob+fl,sx+k*42*s,sy-48*s+bob+fl);
      for(let q=0;q<4;q++)ctx.quadraticCurveTo(sx+k*(38-q*7)*s,sy-(36-q*4)*s+bob,sx+k*(34-q*7)*s,sy-(26-q*5)*s+fl*.5);ctx.lineTo(wx,sy-18*s);ctx.closePath();ctx.fill();
      ctx.strokeStyle=shade(hexc(VP[3]),1.4);ctx.lineWidth=1.6*s;ctx.beginPath();for(let q=0;q<4;q++){ctx.moveTo(wx,wy+2*s);ctx.lineTo(sx+k*(40-q*7)*s,sy-(46-q*6)*s+bob+fl*(1-q*.25));}ctx.stroke();}
    ctx.fillStyle=vgrad(sy-44*s,sy,VP[1],VP[2]);ctx.beginPath();ctx.moveTo(sx-11*s,sy-42*s+bob);ctx.quadraticCurveTo(sx-15*s,sy-24*s,sx-19*s,sy-4*s);
    for(let k=0;k<7;k++)ctx.lineTo(sx-19*s+k*38/6*s,sy-(k%2?1:5)*s+Math.sin(m.ph*3+k)*1.2*s);ctx.quadraticCurveTo(sx+15*s,sy-24*s,sx+11*s,sy-42*s+bob);ctx.closePath();ctx.fill();
    ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(${glw},${(.45+br*.45).toFixed(2)})`;ctx.lineWidth=1.6*s;ctx.beginPath();
    for(let i=0;i<4;i++){const x0=sx-9*s+i*6*s;ctx.moveTo(x0,sy-38*s+bob);ctx.lineTo(x0+2*s,sy-30*s);ctx.lineTo(x0-1*s,sy-22*s);ctx.lineTo(x0+2*s,sy-12*s);}ctx.stroke();
    glowG(ctx,sx,sy-26*s,18*s,glw,.18+br*.12);ctx.globalCompositeOperation='source-over';
    for(const k of[-1,1]){const ax=sx+k*(11*s)+(k===side?side*lunge:0),ay=sy-36*s+bob;ctx.strokeStyle=VP[2];ctx.lineWidth=4*s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(sx+k*9*s,ay);ctx.quadraticCurveTo(ax+k*8*s,ay+6*s,ax+k*6*s,ay+18*s);ctx.stroke();
      ctx.strokeStyle='#d8cfbb';ctx.lineWidth=1.3*s;ctx.beginPath();for(let c=-1;c<=1;c++){ctx.moveTo(ax+k*6*s,ay+18*s);ctx.lineTo(ax+k*(6+c*2)*s+c*1*s,ay+23*s);}ctx.stroke();}
    const hx=sx+side*lunge*.3,hy=sy-48*s+bob;ctx.fillStyle=vgrad(hy-10*s,hy+8*s,VP[3],VP[0]);ctx.beginPath();ctx.moveTo(hx-8*s,hy+6*s);ctx.quadraticCurveTo(hx-10*s,hy-8*s,hx,hy-10*s);ctx.quadraticCurveTo(hx+10*s,hy-8*s,hx+8*s,hy+6*s);ctx.quadraticCurveTo(hx,hy+10*s,hx-8*s,hy+6*s);ctx.fill();
    ctx.strokeStyle='#d8cfbb';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(hx-6*s,hy-6*s);ctx.quadraticCurveTo(hx-17*s,hy-12*s,hx-14*s,hy-25*s);ctx.moveTo(hx+6*s,hy-6*s);ctx.quadraticCurveTo(hx+17*s,hy-12*s,hx+14*s,hy-25*s);ctx.stroke();
    ctx.lineWidth=1.6*s;ctx.beginPath();ctx.moveTo(hx-2*s,hy-9*s);ctx.lineTo(hx-3*s,hy-16*s);ctx.moveTo(hx+2*s,hy-9*s);ctx.lineTo(hx+3*s,hy-16*s);ctx.stroke();
    ctx.shadowColor='#ffb030';ctx.shadowBlur=10+br*8;ctx.fillStyle='#ffd870';ctx.beginPath();ctx.ellipse(hx-3.5*s,hy-1*s,2*s,1.2*s,-.3,0,7);ctx.ellipse(hx+3.5*s,hy-1*s,2*s,1.2*s,.3,0,7);ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle='rgba(10,4,2,.85)';ctx.beginPath();ctx.ellipse(hx,hy+4*s,3*s,1.6*s+(m.atk>0?1.6*s:0),0,0,7);ctx.fill();}
  else{
    const arch=m.kind==='archer',bone=arch&&!m.flesh;ctx.fillStyle=bone?(m.bone?shade(hexc(m.bone),.8):'#bfb59f'):'#2e281e';const wv=m.aggro&&!m.stun?Math.sin(m.ph*9):0,st=wv*3.2*s;if(bone&&!m.bolt)boneLegs(m,sx,sy,s,st);else{ctx.fillRect(sx-5*s+st,sy-14*s,4*s,14*s-Math.max(0,wv)*2.6*s);ctx.fillRect(sx+1*s-st,sy-14*s,4*s,14*s-Math.max(0,-wv)*2.6*s);}
    if(m.bolt){ctx.fillStyle=vgrad(sy-36*s,sy-6*s,'#6a4a9a','#241838');ctx.beginPath();ctx.moveTo(sx-6*s,sy-35*s);ctx.lineTo(sx+6*s,sy-35*s);ctx.lineTo(sx+9*s,sy-6*s);ctx.lineTo(sx-9*s,sy-6*s);ctx.closePath();ctx.fill();ctx.strokeStyle='#5a4030';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(sx+side*9*s,sy-44*s);ctx.lineTo(sx+side*9*s,sy-4*s);ctx.stroke();ctx.shadowColor='#c080ff';ctx.shadowBlur=10;ctx.fillStyle='#e0c0ff';ctx.beginPath();ctx.arc(sx+side*9*s,sy-46*s,3*s,0,7);ctx.fill();ctx.shadowBlur=0;}
    else if(bone&&m.ai==='shield'){boneTorso(m,sx,sy,s,side);
      ctx.fillStyle=m.open>0?'rgba(120,110,90,.5)':vgrad(sy-40*s,sy-6*s,'#9a8a6a','#3a3020');ctx.beginPath();ctx.moveTo(sx+side*6*s,sy-40*s);ctx.lineTo(sx+side*17*s,sy-38*s);ctx.lineTo(sx+side*17*s,sy-14*s);ctx.lineTo(sx+side*11*s,sy-6*s);ctx.lineTo(sx+side*6*s,sy-14*s);ctx.closePath();ctx.fill();ctx.strokeStyle='#d8cfbb';ctx.lineWidth=1.2*s;ctx.stroke();}
    else if(bone){boneTorso(m,sx,sy,s,side);ctx.fillStyle='#4b3420';ctx.fillRect(sx-side*8*s,sy-38*s,3*s,13*s);ctx.strokeStyle='#8a7050';ctx.lineWidth=.8*s;ctx.beginPath();for(let k=0;k<3;k++){ctx.moveTo(sx-side*7.5*s+k*.8*s,sy-38*s);ctx.lineTo(sx-side*7.5*s+k*.8*s,sy-41*s);}ctx.stroke();}
    else{/* v5.67 : marcheur plus détaillé, voûté, haillons, deux bras qui balancent */
      const C=hexc(m.col),sw=m.aggro?Math.sin(m.ph*9)*4*s:Math.sin(m.ph*3)*1.2*s,hb=bob-2*s;
      ctx.strokeStyle=shade(C,.38);ctx.lineWidth=3.2*s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(sx-side*6*s,sy-30*s+hb);ctx.lineTo(sx-side*(8*s)-sw*.6,sy-18*s);ctx.lineTo(sx-side*7*s-sw,sy-10*s);ctx.stroke();
      ctx.fillStyle=vgrad(sy-36*s,sy-10*s,shade(C,1.1),shade(C,.42));ctx.beginPath();ctx.moveTo(sx-8*s,sy-31*s+hb);ctx.quadraticCurveTo(sx-1*s+side*3*s,sy-39*s+hb,sx+8*s,sy-31*s+hb);ctx.lineTo(sx+7*s,sy-14*s);
      for(let k=0;k<5;k++)ctx.lineTo(sx+7*s-k*3.5*s,sy-(k%2?9:12)*s+Math.sin(m.ph*4+k)*.8*s);ctx.lineTo(sx-7*s,sy-13*s);ctx.closePath();ctx.fill();
      ctx.strokeStyle=shade(C,.3);ctx.lineWidth=1*s;ctx.beginPath();for(let k=0;k<3;k++){ctx.moveTo(sx-4*s,sy-(28-k*4)*s+hb);ctx.quadraticCurveTo(sx,sy-(26-k*4)*s+hb,sx+4*s,sy-(28-k*4)*s+hb);}ctx.stroke();
      ctx.strokeStyle=shade(C,.7);ctx.lineWidth=3.4*s;ctx.beginPath();ctx.moveTo(sx+side*6*s,sy-30*s+hb);ctx.lineTo(sx+side*(9*s+lunge*.6)+sw*.6,sy-20*s);ctx.lineTo(sx+side*(10*s+lunge)+sw,sy-12*s+(lunge?-4*s:0));ctx.stroke();
      ctx.fillStyle=shade(C,.55);ctx.beginPath();ctx.arc(sx+side*(10*s+lunge)+sw,sy-12*s+(lunge?-4*s:0),1.8*s,0,7);ctx.fill();
      ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(sx-side*2*s,sy-22*s+hb,3*s,7*s,0,0,7);ctx.fill();
      if(m.plates>0){ctx.fillStyle='#d8b860';ctx.strokeStyle='#5a4420';ctx.lineWidth=.8*s;for(let k=0;k<m.plates;k++){const px=sx+((k%2)?3:-4)*s,py=sy-(30-Math.floor(k/2)*6)*s+hb;ctx.fillRect(px,py,5*s,4.5*s);ctx.strokeRect(px,py,5*s,4.5*s);}}}
    if(arch&&!bone&&m.ai==='shield'){ctx.fillStyle=m.open>0?'rgba(120,110,90,.5)':vgrad(sy-40*s,sy-6*s,shade(hexc(m.col),1.2),shade(hexc(m.col),.4));ctx.beginPath();ctx.moveTo(sx+side*6*s,sy-40*s);ctx.lineTo(sx+side*17*s,sy-38*s);ctx.lineTo(sx+side*17*s,sy-14*s);ctx.lineTo(sx+side*11*s,sy-6*s);ctx.lineTo(sx+side*6*s,sy-14*s);ctx.closePath();ctx.fill();ctx.strokeStyle='#d8cfbb';ctx.lineWidth=1.2*s;ctx.stroke();}
    if(bone){ctx.fillStyle=m.bone||(m.bolt?'#d8d0ee':'#efe8d6');ctx.beginPath();ctx.arc(sx+side*2*s,sy-40*s+bob,5.5*s,0,7);ctx.fill();
      ctx.fillStyle='#120c08';ctx.beginPath();ctx.arc(sx+side*1*s,sy-41*s+bob,1.4*s,0,7);ctx.arc(sx+side*4*s,sy-41*s+bob,1.3*s,0,7);ctx.fill();ctx.fillRect(sx+side*1.5*s,sy-37*s+bob,3*s,1*s);
      if(m.bolt){ctx.fillStyle=vgrad(sy-50*s,sy-34*s,'#4a3470','#1a1028');ctx.beginPath();ctx.moveTo(sx-6*s,sy-34*s+bob);ctx.quadraticCurveTo(sx-8*s,sy-48*s+bob,sx+side*1*s,sy-50*s+bob);ctx.quadraticCurveTo(sx+side*9*s,sy-47*s+bob,sx+side*7.5*s,sy-38*s+bob);ctx.quadraticCurveTo(sx+side*5*s,sy-45*s+bob,sx+side*1*s,sy-45*s+bob);ctx.quadraticCurveTo(sx-side*3*s,sy-44*s+bob,sx-side*2*s,sy-35*s+bob);ctx.closePath();ctx.fill();
        ctx.shadowColor='#c080ff';ctx.shadowBlur=6;ctx.fillStyle='#d8a8ff';ctx.fillRect(sx+side*1*s-.6*s,sy-41.5*s+bob,1.2*s,1.2*s);ctx.fillRect(sx+side*4*s-.6*s,sy-41.5*s+bob,1.2*s,1.2*s);ctx.shadowBlur=0;}}
    else{const C=hexc(m.col),hx=sx+side*3*s,hy=sy-39*s+bob-2*s;ctx.fillStyle=vgrad(hy-6*s,hy+6*s,shade(C,1.3),shade(C,.7));ctx.beginPath();ctx.ellipse(hx,hy,5*s,6*s,side*.15,0,7);ctx.fill();
      ctx.fillStyle='rgba(10,6,4,.85)';ctx.beginPath();ctx.ellipse(hx+side*.3*s,hy-1*s,1.6*s,1.4*s,0,0,7);ctx.ellipse(hx+side*3.2*s,hy-1*s,1.3*s,1.3*s,0,0,7);ctx.fill();
      ctx.shadowColor='#ff5a2a';ctx.shadowBlur=6;ctx.fillStyle='#ff6a3a';ctx.fillRect(hx+side*.3*s-.6*s,hy-1.5*s,1.2*s,1.2*s);ctx.fillRect(hx+side*3.2*s-.6*s,hy-1.5*s,1.1*s,1.1*s);ctx.shadowBlur=0;
      ctx.strokeStyle='rgba(10,6,4,.7)';ctx.lineWidth=.9*s;ctx.beginPath();ctx.moveTo(hx-1*s,hy+3*s);ctx.lineTo(hx+side*3.5*s,hy+2.6*s);ctx.stroke();
      if(m.horns){ctx.fillStyle='#e8dcc0';for(const o of[-1,1]){ctx.beginPath();ctx.moveTo(hx+o*3*s,hy-4*s);ctx.quadraticCurveTo(hx+o*8*s,hy-8*s,hx+o*6*s,hy-13*s);ctx.lineTo(hx+o*1.5*s,hy-5*s);ctx.closePath();ctx.fill();}}
      if(m.leaf){for(const[a,b,r,c]of[[-6,-31,5,'#2e5a1e'],[6,-30,4.5,'#3a6a22'],[0,-46,6,'#2e5a1e'],[-4,-49,4,'#4a7a2a'],[4,-48,3.5,'#5a8a32']]){ctx.fillStyle=c;ctx.beginPath();ctx.arc(sx+a*s,sy+b*s+bob,r*s,0,7);ctx.fill();}}}
    if(arch&&!m.bolt&&m.ai!=='shield'){ctx.strokeStyle='#7a5a3a';ctx.lineWidth=2*s;ctx.beginPath();ctx.arc(sx+side*10*s,sy-28*s,10*s,side>0?-1.2:1.95,side>0?1.2:4.35);ctx.stroke();
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
  /* v6.51 : la table de jeu et ses quatre joueurs assis, dessinés par le jeu */
  if(o.type==='gtable'){shadow(sx,sy,22);ctx.fillStyle='#3a2414';ctx.fillRect(sx-2*s,sy-12*s,4*s,12*s);ctx.fillStyle=vgrad(sy-18*s,sy-8*s,'#7a5232','#4a301a');ctx.beginPath();ctx.ellipse(sx,sy-14*s,22*s,10*s,0,0,7);ctx.fill();ctx.strokeStyle='#2a180c';ctx.lineWidth=1.2*s;ctx.stroke();
    const cards=[[-9,-15,.3,'#f0e8d8'],[5,-16,-.4,'#f0e8d8'],[-2,-12,.1,'#d8483a'],[9,-12,.6,'#f0e8d8']];for(const[cx,cy,a,c]of cards){ctx.save();ctx.translate(sx+cx*s,sy+cy*s);ctx.rotate(a);ctx.fillStyle=c;ctx.fillRect(-2.6*s,-1.6*s,5.2*s,3.2*s);ctx.restore();}
    ctx.fillStyle='#e8d8b0';ctx.fillRect(sx-1*s,sy-22*s,2*s,6*s);glowG(ctx,sx,sy-23*s,10*s,'255,190,90',.45+Math.sin(S.t*7)*.08);ctx.fillStyle='#ffd070';ctx.beginPath();ctx.ellipse(sx,sy-23.5*s,1.2*s,2.2*s,0,0,7);ctx.fill();}
  if(o.type==='tnpc'){shadow(sx,sy,10);const br=Math.sin(S.t*2+o.x*2)*.6*s,T=o.tone;
    const P={demon:['#5a0e0e','#160404','#b8443a'],ange:['#f4f0e4','#b8a878','#f0d8b8'],clown:['#e84a8a','#3a8ad8','#f2d0b0'],normal:['#6a5236','#2a1e10','#c9a882']}[T];
    if(T==='ange'){ctx.fillStyle='rgba(255,255,255,.85)';for(const d of[-1,1]){ctx.beginPath();ctx.moveTo(sx+d*4*s,sy-26*s-br);ctx.quadraticCurveTo(sx+d*20*s,sy-36*s-br,sx+d*16*s,sy-14*s);ctx.quadraticCurveTo(sx+d*10*s,sy-18*s,sx+d*4*s,sy-18*s-br);ctx.fill();}}
    ctx.fillStyle=vgrad(sy-28*s,sy-4*s,P[0],P[1]);ctx.beginPath();ctx.moveTo(sx-7*s,sy-28*s-br);ctx.lineTo(sx+7*s,sy-28*s-br);ctx.lineTo(sx+11*s,sy-4*s);ctx.lineTo(sx-11*s,sy-4*s);ctx.closePath();ctx.fill();
    if(T==='clown'){ctx.fillStyle='#f0d040';for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(sx,sy-26*s+k*7*s-br);ctx.lineTo(sx+3.5*s,sy-22.5*s+k*7*s-br);ctx.lineTo(sx,sy-19*s+k*7*s-br);ctx.lineTo(sx-3.5*s,sy-22.5*s+k*7*s-br);ctx.fill();}ctx.fillStyle='#fff';for(let k=-3;k<=3;k++){ctx.beginPath();ctx.arc(sx+k*2.4*s,sy-28*s-br,2*s,0,7);ctx.fill();}}
    if(T==='demon'){ctx.fillStyle='#8a1a14';ctx.fillRect(sx-8*s,sy-17*s,16*s,2*s);}
    if(T==='ange'){ctx.fillStyle='#d8b850';ctx.fillRect(sx-8*s,sy-17*s,16*s,1.6*s);}
    ctx.fillStyle=P[2];ctx.beginPath();ctx.arc(sx,sy-33*s-br,5*s,0,7);ctx.fill();
    ctx.fillStyle=T==='demon'?'#ff3a2a':'rgba(30,20,12,.85)';ctx.fillRect(sx-2.6*s,sy-34*s-br,1.4*s,1.4*s);ctx.fillRect(sx+1.2*s,sy-34*s-br,1.4*s,1.4*s);
    if(T==='demon'){ctx.fillStyle='#2a0808';for(const d of[-1,1]){ctx.beginPath();ctx.moveTo(sx+d*2.5*s,sy-37*s-br);ctx.lineTo(sx+d*6.5*s,sy-44*s-br);ctx.lineTo(sx+d*5*s,sy-36*s-br);ctx.fill();}}
    if(T==='ange'){ctx.strokeStyle='#f0d060';ctx.lineWidth=1.6*s;ctx.beginPath();ctx.ellipse(sx,sy-41*s-br,6*s,2*s,0,0,7);ctx.stroke();glowG(ctx,sx,sy-41*s-br,9*s,'255,230,140',.25);}
    if(T==='clown'){ctx.fillStyle='#e8302a';ctx.beginPath();ctx.arc(sx,sy-32*s-br,1.6*s,0,7);ctx.fill();ctx.fillStyle='#3ac85a';ctx.beginPath();ctx.moveTo(sx-5*s,sy-36.5*s-br);ctx.lineTo(sx+5*s,sy-36.5*s-br);ctx.lineTo(sx+1*s,sy-48*s-br);ctx.closePath();ctx.fill();ctx.fillStyle='#f0d040';ctx.beginPath();ctx.arc(sx+1*s,sy-48*s-br,1.6*s,0,7);ctx.fill();}
    if(T==='normal'){ctx.fillStyle='#b8b0a0';ctx.beginPath();ctx.moveTo(sx-4*s,sy-31*s-br);ctx.lineTo(sx+4*s,sy-31*s-br);ctx.lineTo(sx,sy-24*s-br);ctx.fill();ctx.fillStyle='#3a2a18';ctx.beginPath();ctx.ellipse(sx,sy-37*s-br,8*s,2*s,0,0,7);ctx.fill();ctx.fillRect(sx-4*s,sy-42*s-br,8*s,5*s);}
    const ag=Math.sin(S.t*1.6+o.x*3)*1.2*s;ctx.fillStyle=P[2];ctx.beginPath();ctx.arc(sx-8*s,sy-17*s+ag,1.8*s,0,7);ctx.arc(sx+8*s,sy-17*s-ag,1.8*s,0,7);ctx.fill();ctx.fillStyle='#f0e8d8';ctx.fillRect(sx+6.5*s,sy-21*s-ag,3*s,4*s);}
  if(o.type==='npc'){shadow(sx,sy,12);const br=Math.sin(S.t*2+o.x)*.8*s;
    const robes=((THM().npcs||{})[o.id]||{}).robe||{autel:['#4a3a6a','#1a1028'],lapid:['#3a6a7a','#122a32'],corvel:['#7e6ca6','#2e2448'],bram:['#9a7a3a','#4a3414'],eline:['#d8d0c0','#7a7060'],hilde:['#6a4030','#2a160e'],demol:['#5a5048','#221c18'],joueuse:['#9a3a6a','#3a1028'],recruit:['#5a6a42','#222a16']}[o.id];
    if(o.id==='bram'){ctx.fillStyle=vgrad(sy-34*s,sy-14*s,'#6a4a24','#3a2810');ctx.fillRect(sx-15*s,sy-34*s,9*s,16*s);ctx.strokeStyle='#2a1a0c';ctx.lineWidth=1;ctx.strokeRect(sx-15*s,sy-34*s,9*s,16*s);}
    ctx.fillStyle=vgrad(sy-38*s,sy-4*s,robes[0],robes[1]);ctx.beginPath();ctx.moveTo(sx-8*s,sy-37*s-br);ctx.lineTo(sx+8*s,sy-37*s-br);ctx.lineTo(sx+12*s,sy-3*s);ctx.lineTo(sx-12*s,sy-3*s);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(sx-1*s,sy-30*s,2*s,26*s);
    /* v5.76 : plis de la robe, ceinture, bras et mains, visage */
    ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=1*s;ctx.beginPath();for(const k of[-6,-3,3,6]){ctx.moveTo(sx+k*.8*s,sy-28*s);ctx.lineTo(sx+k*1.4*s,sy-4*s);}ctx.stroke();
    ctx.fillStyle=shade(hexc(robes[1]),.8);ctx.fillRect(sx-9*s,sy-23*s-br*.5,18*s,2.4*s);
    const ag=Math.sin(S.t*1.3+o.x*3)*1.5*s;ctx.strokeStyle=robes[0];ctx.lineWidth=4*s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(sx-7*s,sy-34*s-br);ctx.lineTo(sx-10*s,sy-24*s+ag);ctx.moveTo(sx+7*s,sy-34*s-br);ctx.lineTo(sx+9*s,sy-24*s-ag);ctx.stroke();
    ctx.fillStyle='#c9a882';ctx.beginPath();ctx.arc(sx-10*s,sy-22.5*s+ag,1.8*s,0,7);ctx.arc(sx+9*s,sy-22.5*s-ag,1.8*s,0,7);ctx.fill();
    ctx.fillStyle='#c9a882';ctx.beginPath();ctx.arc(sx,sy-43*s-br,5.5*s,0,7);ctx.fill();
    ctx.fillStyle='rgba(30,20,12,.85)';ctx.fillRect(sx-2.6*s,sy-44*s-br,1.4*s,1.4*s);ctx.fillRect(sx+1.2*s,sy-44*s-br,1.4*s,1.4*s);ctx.fillStyle='rgba(120,60,40,.5)';ctx.fillRect(sx-1.2*s,sy-40.6*s-br,2.4*s,.8*s);
    if(o.id==='corvel'){ctx.fillStyle='#e0dacd';ctx.beginPath();ctx.moveTo(sx-4.5*s,sy-41*s-br);ctx.lineTo(sx+4.5*s,sy-41*s-br);ctx.lineTo(sx,sy-26*s-br);ctx.fill();
      ctx.strokeStyle='#6a4a2a';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx+13*s,sy-56*s);ctx.lineTo(sx+13*s,sy);ctx.stroke();
      ctx.shadowColor='#9fb8ff';ctx.shadowBlur=12;ctx.fillStyle='#bfd0ff';ctx.beginPath();ctx.arc(sx+13*s,sy-58*s,3.5*s,0,7);ctx.fill();ctx.shadowBlur=0;}
    if(o.id==='bram'){ctx.fillStyle='#4a3014';ctx.beginPath();ctx.ellipse(sx,sy-48*s-br,9*s,2.5*s,0,0,7);ctx.fill();ctx.fillRect(sx-5*s,sy-54*s-br,10*s,6*s);}
    if(o.id==='joueuse'){ctx.fillStyle='#c8a050';ctx.beginPath();ctx.ellipse(sx,sy-49*s-br,9*s,2.5*s,0,0,7);ctx.fill();ctx.fillStyle='#6a2a4a';ctx.fillRect(sx-4*s,sy-56*s-br,8*s,7*s);
      ctx.fillStyle='#e8d8b0';ctx.save();ctx.translate(sx+12*s,sy-24*s);ctx.rotate(.3);ctx.fillRect(-3*s,-4*s,6*s,8*s);ctx.restore();ctx.fillStyle='#b02a2a';ctx.fillRect(sx+11*s,sy-26*s,2*s,2*s);}
    if(o.id==='demol'){ctx.fillStyle='#8a8478';ctx.beginPath();ctx.moveTo(sx-4.5*s,sy-41*s-br);ctx.lineTo(sx+4.5*s,sy-41*s-br);ctx.lineTo(sx,sy-30*s-br);ctx.fill();ctx.strokeStyle='#4a3420';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx-12*s,sy-4*s);ctx.lineTo(sx-14*s,sy-40*s);ctx.stroke();ctx.fillStyle='#6a6e76';ctx.fillRect(sx-20*s,sy-44*s,12*s,6*s);
      ctx.fillStyle='#4a3a2a';ctx.beginPath();ctx.ellipse(sx+13*s,sy-6*s,6*s,5*s,0,0,7);ctx.fill();}
    if(o.id==='hilde'){ctx.fillStyle='#3a2a20';ctx.fillRect(sx-7*s,sy-30*s,14*s,18*s);ctx.fillStyle='#b05a2a';ctx.beginPath();ctx.arc(sx,sy-47*s,5*s,Math.PI,0);ctx.fill();ctx.strokeStyle='#7a7e86';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx+10*s,sy-34*s);ctx.lineTo(sx+14*s,sy-20*s);ctx.stroke();ctx.fillStyle='#8a8e96';ctx.fillRect(sx+10*s,sy-38*s,8*s,5*s);}
    if(o.id==='autel'){/* l’autel : une pierre gravée qui luit */const ax=sx-16*s,ay=sy+2*s;ctx.fillStyle=vgrad(ay-16*s,ay,'#6a6470','#2a262e');ctx.fillRect(ax-8*s,ay-14*s,16*s,14*s);ctx.fillStyle='#7a7480';ctx.fillRect(ax-10*s,ay-17*s,20*s,4*s);ctx.shadowColor='#c080ff';ctx.shadowBlur=10+Math.sin(S.t*3)*5;ctx.strokeStyle='#d8b0ff';ctx.lineWidth=1.4*s;ctx.beginPath();ctx.moveTo(ax-3*s,ay-10*s);ctx.lineTo(ax,ay-4*s);ctx.lineTo(ax+3*s,ay-10*s);ctx.moveTo(ax,ay-12*s);ctx.lineTo(ax,ay-3*s);ctx.stroke();ctx.shadowBlur=0;}
    if(o.id==='lapid'){const b=Math.sin(S.t*2.4)*1.5*s;ctx.fillStyle='#2a4a54';ctx.beginPath();ctx.arc(sx,sy-46*s-br,6*s,Math.PI,0);ctx.fill();ctx.shadowColor='#ffb860';ctx.shadowBlur=12;ctx.fillStyle=ORBS[ORB_KEYS[Math.floor(S.t/1.5)%ORB_KEYS.length]].c;ctx.beginPath();ctx.arc(sx+12*s,sy-27*s+b,3.6*s,0,7);ctx.fill();ctx.shadowBlur=0;}
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
  else if(o.type==='cchest'){ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(sx,sy,15*s,6.5*s,0,0,7);ctx.fill();ctx.fillStyle=vgrad(sy-17*s,sy-2*s,'#3a2a3a','#1a0e1a');ctx.fillRect(sx-12*s,sy-15*s,24*s,13*s);
    if(o.open){ctx.fillStyle='#0a060a';ctx.fillRect(sx-12*s,sy-17*s,24*s,3*s);ctx.fillStyle='#2a1a2a';ctx.fillRect(sx-12*s,sy-27*s,24*s,10*s);}
    else{ctx.fillStyle=vgrad(sy-23*s,sy-15*s,'#4a3448','#24162a');ctx.beginPath();ctx.ellipse(sx,sy-15*s,12*s,6*s,0,Math.PI,0);ctx.fill();ctx.shadowColor='#b040ff';ctx.shadowBlur=12+Math.sin(S.t*5)*5;ctx.fillStyle='#c060ff';ctx.fillRect(sx-2*s,sy-15*s,4*s,5*s);ctx.shadowBlur=0;}}
  else if(o.type==='sfire'){const F=o.F;shadow(sx,sy,10);ctx.fillStyle='#3a3530';ctx.beginPath();ctx.ellipse(sx,sy-6*s,11*s,5*s,0,0,7);ctx.fill();ctx.fillStyle='#5a524a';ctx.fillRect(sx-8*s,sy-14*s,16*s,8*s);
    if(F.state==='on'){flame(sx-3*s,sy-14*s,s*1.4,0);flame(sx+4*s,sy-14*s,s*1.2,2);const w=28*s;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(sx-w/2-1,sy-46*s,w+2,5);ctx.fillStyle='#ffb050';ctx.fillRect(sx-w/2,sy-45*s,w*Math.max(0,F.hp/F.hpMax),3);}
    else{ctx.fillStyle='rgba(120,110,100,.7)';for(let k=0;k<4;k++)ctx.fillRect(sx-6*s+k*3*s,sy-16*s-(k%2)*3*s,2*s,2*s);if(F.relit>0){ctx.strokeStyle='#ffb050';ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx,sy-24*s,10*s,-1.57,-1.57+6.28*F.relit/1.5);ctx.stroke();}}}
  else if(o.type==='cart'){const s=Z*1.3;shadow(sx,sy,20);const side=o.face!=null&&(Math.cos(o.face)-Math.sin(o.face))<0?-1:1,bob=o.moving?Math.sin(o.ph*12)*1*s:0;
    ctx.fillStyle='#2a1c10';for(const k of[-1,1]){ctx.beginPath();ctx.ellipse(sx+k*11*s,sy-6*s,3*s,6.5*s,0,0,7);ctx.fill();}
    ctx.fillStyle=vgrad(sy-28*s,sy-8*s,'#7a5634','#3a2614');ctx.fillRect(sx-15*s,sy-26*s+bob,30*s,16*s);ctx.strokeStyle='#22160c';ctx.lineWidth=1.2*s;ctx.strokeRect(sx-15*s,sy-26*s+bob,30*s,16*s);ctx.beginPath();ctx.moveTo(sx-5*s,sy-26*s+bob);ctx.lineTo(sx-5*s,sy-10*s+bob);ctx.moveTo(sx+5*s,sy-26*s+bob);ctx.lineTo(sx+5*s,sy-10*s+bob);ctx.stroke();
    ctx.fillStyle='#c8b890';ctx.beginPath();ctx.moveTo(sx-13*s,sy-26*s+bob);ctx.quadraticCurveTo(sx,sy-40*s+bob,sx+13*s,sy-26*s+bob);ctx.closePath();ctx.fill();
    if(o.state!=='fail'){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx+side*16*s,sy-30*s,0,sx+side*16*s,sy-30*s,12*s);g.addColorStop(0,'rgba(255,200,120,.9)');g.addColorStop(1,'rgba(255,160,60,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx+side*16*s,sy-30*s,12*s,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';}
    ctx.strokeStyle='#3a2a18';ctx.lineWidth=1.5*s;ctx.beginPath();ctx.moveTo(sx+side*15*s,sy-20*s);ctx.lineTo(sx+side*16*s,sy-27*s);ctx.stroke();
    const w=34*s,f=Math.max(0,o.hp/o.hpMax);ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(sx-w/2,sy-50*s,w,4*s);ctx.fillStyle=f>.35?'#c8a060':'#d04a3a';ctx.fillRect(sx-w/2,sy-50*s,w*f,4*s);}
  else if(o.type==='pkey'){if(o.got)return;const b=Math.sin(S.t*3+o.x)*3*s;ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy-14*s-b,0,sx,sy-14*s-b,18*s);g.addColorStop(0,'rgba(230,220,190,.55)');g.addColorStop(1,'rgba(230,220,190,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy-14*s-b,18*s,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';
    ctx.strokeStyle='#8a8478';ctx.lineWidth=2.4*s;ctx.beginPath();ctx.arc(sx,sy-20*s-b,4*s,0,7);ctx.moveTo(sx,sy-16*s-b);ctx.lineTo(sx,sy-5*s-b);ctx.moveTo(sx,sy-8*s-b);ctx.lineTo(sx+4*s,sy-8*s-b);ctx.moveTo(sx,sy-11*s-b);ctx.lineTo(sx+3*s,sy-11*s-b);ctx.stroke();}
  else if(o.type==='cvdest'){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy-6*s,0,sx,sy-6*s,40*s);g.addColorStop(0,`rgba(210,200,255,${.35+Math.sin(S.t*2)*.08})`);g.addColorStop(1,'rgba(210,200,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(sx,sy,40*s,20*s,0,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';
    for(let k=0;k<5;k++){const a=k/5*6.28,x=sx+Math.cos(a)*24*s,y=sy+Math.sin(a)*12*s;ctx.fillStyle=vgrad(y-24*s,y,'#9a96a4','#3a3842');ctx.fillRect(x-3*s,y-22*s,6*s,22*s);}}
  else if(o.type==='priest'){const W_=S.cur.ward||{hp:0,hpMax:1,state:'fail'};shadow(sx,sy,12);
    if(W_.state!=='fail'){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy-20*s,0,sx,sy-20*s,30*s);g.addColorStop(0,'rgba(220,210,255,.35)');g.addColorStop(1,'rgba(220,210,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy-20*s,30*s,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';}
    ctx.fillStyle=vgrad(sy-38*s,sy-3*s,'#ece8f4','#8a84a0');ctx.beginPath();ctx.moveTo(sx-7*s,sy-36*s);ctx.lineTo(sx+7*s,sy-36*s);ctx.lineTo(sx+12*s,sy-3*s);ctx.lineTo(sx-12*s,sy-3*s);ctx.closePath();ctx.fill();
    ctx.fillStyle='#d8c8b0';ctx.beginPath();ctx.arc(sx,sy-41*s,4.5*s,0,7);ctx.fill();ctx.fillStyle='#f4f0fa';ctx.beginPath();ctx.arc(sx,sy-43*s,6.5*s,Math.PI,0);ctx.lineTo(sx+7*s,sy-33*s);ctx.lineTo(sx-7*s,sy-33*s);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#c8b8ff';ctx.lineWidth=1.5*s;ctx.beginPath();ctx.moveTo(sx-9*s,sy-24*s);ctx.lineTo(sx-14*s,sy-30*s);ctx.moveTo(sx+9*s,sy-24*s);ctx.lineTo(sx+14*s,sy-30*s);ctx.stroke();
    const w=34*s;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(sx-w/2-1,sy-58*s,w+2,5);ctx.fillStyle='#b8a8ff';ctx.fillRect(sx-w/2,sy-57*s,w*Math.max(0,W_.hp/W_.hpMax),3);}
  else if(o.type==='shrine'){const ev=S.cur.ev||{},lit=ev.state==='idle';shadow(sx,sy,16);ctx.fillStyle=vgrad(sy-50*s,sy,'#5a5048','#221c18');ctx.beginPath();ctx.moveTo(sx-14*s,sy);ctx.lineTo(sx-14*s,sy-34*s);ctx.lineTo(sx,sy-50*s);ctx.lineTo(sx+14*s,sy-34*s);ctx.lineTo(sx+14*s,sy);ctx.closePath();ctx.fill();
    ctx.fillStyle='#120e0c';ctx.beginPath();ctx.moveTo(sx-6*s,sy-2*s);ctx.lineTo(sx-6*s,sy-24*s);ctx.quadraticCurveTo(sx,sy-32*s,sx+6*s,sy-24*s);ctx.lineTo(sx+6*s,sy-2*s);ctx.fill();ctx.strokeStyle='#8a7a5a';ctx.lineWidth=1.6*s;ctx.beginPath();ctx.moveTo(sx,sy-58*s);ctx.lineTo(sx,sy-48*s);ctx.moveTo(sx-3*s,sy-55*s);ctx.lineTo(sx+3*s,sy-53*s);ctx.stroke();
    for(let k=-1;k<=1;k++){const cx=sx+k*4*s,cy=sy-3*s;ctx.fillStyle='#d8d0bc';ctx.fillRect(cx-1*s,cy-6*s,2*s,6*s);if(lit){ctx.fillStyle='rgba(255,200,110,.95)';ctx.beginPath();ctx.ellipse(cx,cy-7.5*s+Math.sin(S.t*9+k)*.4*s,1*s,1.8*s,0,0,7);ctx.fill();}}}
  else if(o.type==='cage'){const ev=S.cur.ev||{},free_=ev.state==='done';shadow(sx,sy,14);
    if(!free_){ctx.fillStyle='#4a4038';ctx.fillRect(sx-4*s,sy-26*s,8*s,22*s);ctx.fillStyle='#b89a7a';ctx.beginPath();ctx.arc(sx,sy-29*s,4*s,0,7);ctx.fill();}
    ctx.strokeStyle='#2a2622';ctx.lineWidth=2*s;ctx.beginPath();ctx.ellipse(sx,sy-1*s,12*s,5*s,0,0,7);ctx.ellipse(sx,sy-40*s,12*s,5*s,0,0,7);ctx.stroke();ctx.beginPath();for(let k=0;k<8;k++){if(free_&&(k===2||k===3))continue;const a=k/8*6.28,x=sx+Math.cos(a)*12*s,y1=sy-1*s+Math.sin(a)*5*s,y2=sy-40*s+Math.sin(a)*5*s;ctx.moveTo(x,y1);ctx.lineTo(x,y2);}ctx.stroke();ctx.beginPath();ctx.moveTo(sx,sy-45*s);ctx.lineTo(sx,sy-60*s);ctx.stroke();}
  else if(o.type==='fgrave'){const ev=S.cur.ev||{};shadow(sx,sy,14);ctx.fillStyle=ev.state==='done'?'#1a140e':'#4a3a26';ctx.beginPath();ctx.ellipse(sx,sy,13*s,5.5*s,0,0,7);ctx.fill();if(ev.state!=='done'){ctx.fillStyle='#5a4a32';ctx.beginPath();ctx.ellipse(sx,sy-2*s,11*s,4*s,0,0,7);ctx.fill();}
    ctx.fillStyle=vgrad(sy-26*s,sy-6*s,'#7a746a','#3a3630');ctx.fillRect(sx+8*s,sy-24*s,7*s,18*s);ctx.beginPath();ctx.arc(sx+11.5*s,sy-24*s,3.5*s,Math.PI,0);ctx.fill();
    ctx.strokeStyle='#5a4a32';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(sx-10*s,sy-2*s);ctx.lineTo(sx-14*s,sy-22*s);ctx.stroke();ctx.fillStyle='#8a8478';ctx.fillRect(sx-12*s,sy-4*s,5*s,3*s);}
  else if(o.type==='corpse'){const f=o.f;ctx.fillStyle='rgba(60,10,8,.35)';ctx.beginPath();ctx.ellipse(sx,sy+1*s,14*s,5*s,0,0,7);ctx.fill();
    ctx.fillStyle=['#4a3a2a','#3a3a44','#4a2a22'][o.v];ctx.beginPath();ctx.moveTo(sx-11*s*f,sy-1*s);ctx.quadraticCurveTo(sx-2*s*f,sy-7*s,sx+8*s*f,sy-4*s);ctx.lineTo(sx+9*s*f,sy+1*s);ctx.quadraticCurveTo(sx,sy+3*s,sx-11*s*f,sy+1*s);ctx.fill();
    ctx.fillStyle='#d8ccb0';ctx.beginPath();ctx.arc(sx+11*s*f,sy-3*s,2.6*s,0,7);ctx.fill();ctx.fillStyle='#1a1410';ctx.fillRect(sx+10.5*s*f-.5*s,sy-3.6*s,1.2*s,1.2*s);
    ctx.strokeStyle='#cfc4a8';ctx.lineWidth=1.2*s;ctx.beginPath();ctx.moveTo(sx-4*s*f,sy-3*s);ctx.lineTo(sx-8*s*f,sy-8*s);ctx.lineTo(sx-6*s*f,sy-10*s);ctx.stroke();
    if(!o.done){ctx.fillStyle=vgrad(sy-10*s,sy-2*s,'#7a5a34','#3a2814');ctx.fillRect(sx-1*s*f-3*s,sy-10*s,7*s,7*s);ctx.fillStyle='#2a1a0c';ctx.fillRect(sx-1*s*f-3*s,sy-10*s,7*s,1.5*s);
      if(!p.eco){const a=.35+.25*Math.sin(S.t*3+o.x);ctx.fillStyle=`rgba(255,230,160,${a.toFixed(2)})`;ctx.beginPath();ctx.arc(sx,sy-12*s,1.4*s,0,7);ctx.fill();}}}
  else if(o.type==='lever'){shadow(sx,sy,6);ctx.fillStyle='#3a3632';ctx.fillRect(sx-4*s,sy-5*s,8*s,5*s);ctx.fillStyle='#5a544c';ctx.fillRect(sx-4*s,sy-6*s,8*s,1.5*s);
    const a=o.on?.7:-.7;ctx.strokeStyle='#6a4a2a';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(sx,sy-5*s);ctx.lineTo(sx+Math.sin(a)*14*s,sy-5*s-Math.cos(a)*14*s);ctx.stroke();
    ctx.fillStyle=o.on?'#8a8070':'#c8a040';ctx.beginPath();ctx.arc(sx+Math.sin(a)*14*s,sy-5*s-Math.cos(a)*14*s,2.4*s,0,7);ctx.fill();}
  else if(o.type==='urn'){shadow(sx,sy,8);if(o.v===0){ctx.fillStyle=vgrad(sy-16*s,sy,'#9a7a56','#4a3420');ctx.beginPath();ctx.moveTo(sx-3*s,sy-15*s);ctx.quadraticCurveTo(sx-9*s,sy-10*s,sx-6*s,sy-1*s);ctx.lineTo(sx+6*s,sy-1*s);ctx.quadraticCurveTo(sx+9*s,sy-10*s,sx+3*s,sy-15*s);ctx.closePath();ctx.fill();ctx.fillStyle='#3a2818';ctx.fillRect(sx-3.5*s,sy-17*s,7*s,2.4*s);ctx.strokeStyle='rgba(30,20,10,.5)';ctx.lineWidth=.8*s;ctx.beginPath();ctx.moveTo(sx-7*s,sy-8*s);ctx.lineTo(sx+7*s,sy-8*s);ctx.stroke();}
    else if(o.v===1){ctx.fillStyle=vgrad(sy-16*s,sy,'#7a5430','#3e2814');ctx.fillRect(sx-6*s,sy-15*s,12*s,14*s);ctx.fillStyle='#5a3c20';ctx.beginPath();ctx.ellipse(sx,sy-15*s,6*s,2.4*s,0,0,7);ctx.fill();ctx.strokeStyle='#2a2622';ctx.lineWidth=1.3*s;ctx.beginPath();ctx.moveTo(sx-6*s,sy-11*s);ctx.lineTo(sx+6*s,sy-11*s);ctx.moveTo(sx-6*s,sy-5*s);ctx.lineTo(sx+6*s,sy-5*s);ctx.stroke();}
    else{const hw_=9*s,hh_=4.5*s,h_=11*s;poly([[sx-hw_,sy-h_],[sx,sy+hh_-h_],[sx,sy+hh_],[sx-hw_,sy]],'#6a4c2c');poly([[sx,sy+hh_-h_],[sx+hw_,sy-h_],[sx+hw_,sy],[sx,sy+hh_]],'#4a3420');poly([[sx,sy-hh_-h_],[sx+hw_,sy-h_],[sx,sy+hh_-h_],[sx-hw_,sy-h_]],'#8a6a40');ctx.strokeStyle='rgba(30,20,10,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx-hw_,sy-h_);ctx.lineTo(sx,sy+hh_);ctx.stroke();}}
  else if(o.type==='keg'){shadow(sx,sy,9);ctx.fillStyle=vgrad(sy-18*s,sy,'#8a2a1a','#3a0e08');ctx.fillRect(sx-6.5*s,sy-17*s,13*s,16*s);ctx.fillStyle='#5a1a10';ctx.beginPath();ctx.ellipse(sx,sy-17*s,6.5*s,2.6*s,0,0,7);ctx.fill();ctx.strokeStyle='#2a2622';ctx.lineWidth=1.4*s;ctx.beginPath();ctx.moveTo(sx-6.5*s,sy-12*s);ctx.lineTo(sx+6.5*s,sy-12*s);ctx.moveTo(sx-6.5*s,sy-5*s);ctx.lineTo(sx+6.5*s,sy-5*s);ctx.stroke();
    ctx.fillStyle='#e8d8b0';ctx.font=`bold ${8*s}px sans-serif`;ctx.textAlign='center';ctx.fillText('☠',sx,sy-7*s);ctx.strokeStyle='#c8b890';ctx.lineWidth=1*s;ctx.beginPath();ctx.moveTo(sx+2*s,sy-18*s);ctx.quadraticCurveTo(sx+5*s,sy-23*s,sx+3*s,sy-26*s);ctx.stroke();
    if(o.fuse!=null){ctx.shadowColor='#ffb030';ctx.shadowBlur=10;ctx.fillStyle='#ffe080';ctx.beginPath();ctx.arc(sx+3*s,sy-26*s,2*s+Math.random()*s,0,7);ctx.fill();ctx.shadowBlur=0;}}
  else if(o.type==='well'){const ev=S.cur.ev||{};shadow(sx,sy,18);ctx.fillStyle=vgrad(sy-18*s,sy+4*s,'#6a6258','#2a2622');ctx.beginPath();ctx.ellipse(sx,sy-4*s,16*s,8*s,0,0,7);ctx.fill();ctx.fillRect(sx-16*s,sy-16*s,32*s,12*s);ctx.fillStyle='#7a7266';ctx.beginPath();ctx.ellipse(sx,sy-16*s,16*s,8*s,0,0,7);ctx.fill();
    ctx.fillStyle=ev.state==='idle'?'#0a1420':'#141210';ctx.beginPath();ctx.ellipse(sx,sy-16*s,12*s,6*s,0,0,7);ctx.fill();if(ev.state==='idle'){ctx.fillStyle=`rgba(120,160,220,${.15+Math.sin(S.t*2)*.08})`;ctx.beginPath();ctx.ellipse(sx,sy-16*s,8*s,4*s,0,0,7);ctx.fill();}
    ctx.strokeStyle='#3a2a1a';ctx.lineWidth=2.5*s;ctx.beginPath();ctx.moveTo(sx-14*s,sy-14*s);ctx.lineTo(sx-14*s,sy-40*s);ctx.lineTo(sx+14*s,sy-40*s);ctx.lineTo(sx+14*s,sy-14*s);ctx.stroke();ctx.lineWidth=1*s;ctx.beginPath();ctx.moveTo(sx,sy-40*s);ctx.lineTo(sx,sy-26*s);ctx.stroke();ctx.fillStyle='#4a3a26';ctx.fillRect(sx-3*s,sy-27*s,6*s,5*s);}
  else if(o.type==='peddler'){const ev=S.cur.ev||{};shadow(sx,sy,12);ctx.fillStyle='#5a4428';ctx.fillRect(sx+6*s,sy-20*s,16*s,14*s);ctx.fillStyle='#3a2a18';ctx.fillRect(sx+6*s,sy-22*s,16*s,3*s);
    ctx.fillStyle=vgrad(sy-36*s,sy-3*s,'#6a5a42','#2a2216');ctx.beginPath();ctx.moveTo(sx-6*s,sy-34*s);ctx.lineTo(sx+6*s,sy-34*s);ctx.lineTo(sx+10*s,sy-3*s);ctx.lineTo(sx-10*s,sy-3*s);ctx.closePath();ctx.fill();ctx.fillStyle='#b89870';ctx.beginPath();ctx.arc(sx,sy-38*s,4.5*s,0,7);ctx.fill();
    ctx.fillStyle='#3a2e22';ctx.beginPath();ctx.ellipse(sx,sy-42*s,9*s,3*s,0,0,7);ctx.fill();ctx.fillRect(sx-4*s,sy-48*s,8*s,6*s);if(ev.stock&&ev.stock.every(x=>!x))return;ctx.fillStyle='#e8c46a';ctx.font=`bold ${12*s}px serif`;ctx.textAlign='center';ctx.fillText('?',sx,sy-54*s);}
  else if(o.type==='gibbet'){const ev=S.cur.ev||{};shadow(sx,sy,20);ctx.strokeStyle='#2a1e14';ctx.lineWidth=4*s;ctx.beginPath();ctx.moveTo(sx-24*s,sy);ctx.lineTo(sx-24*s,sy-74*s);ctx.lineTo(sx+26*s,sy-74*s);ctx.moveTo(sx-24*s,sy-60*s);ctx.lineTo(sx-12*s,sy-74*s);ctx.stroke();
    ctx.strokeStyle='#8a7a5a';ctx.lineWidth=1.2*s;for(let k=0;k<3;k++){const x=sx-10*s+k*15*s,sw=Math.sin(S.t*1.3+k)*2*s;ctx.beginPath();ctx.moveTo(x,sy-74*s);ctx.lineTo(x+sw,sy-(ev.state==='idle'?52:66)*s);ctx.stroke();
      if(ev.state==='idle'){ctx.fillStyle='#4a443a';ctx.fillRect(x+sw-3.5*s,sy-52*s,7*s,22*s);ctx.fillStyle='#8a8070';ctx.beginPath();ctx.arc(x+sw,sy-54*s,3.5*s,0,7);ctx.fill();ctx.fillStyle='#3a342c';ctx.fillRect(x+sw-3*s,sy-30*s,2*s,8*s);ctx.fillRect(x+sw+1*s,sy-30*s,2*s,8*s);}}}
  else if(o.type==='altar'){const ev=S.cur.ev||{},on=ev.state==='idle';shadow(sx,sy,16);ctx.fillStyle=vgrad(sy-22*s,sy,'#5a5048','#2a221e');ctx.fillRect(sx-14*s,sy-18*s,28*s,16*s);ctx.fillStyle='#6a6056';ctx.fillRect(sx-16*s,sy-22*s,32*s,5*s);
    if(on||ev.state==='done'){ctx.shadowColor='#ff3020';ctx.shadowBlur=on?14:4;ctx.fillStyle=on?'#d02a1a':'#5a1a12';ctx.beginPath();ctx.ellipse(sx,sy-23*s,8*s,3*s,0,0,7);ctx.fill();ctx.shadowBlur=0;}}
  else if(o.type==='traveler'){const ev=S.cur.ev||{};if(ev.state==='fail'){ctx.fillStyle='#4a3a2a';ctx.beginPath();ctx.ellipse(sx,sy-3*s,13*s,5*s,0,0,7);ctx.fill();}else{shadow(sx,sy,11);
    ctx.fillStyle=vgrad(sy-34*s,sy-3*s,'#7a6248','#3a2a18');ctx.beginPath();ctx.moveTo(sx-7*s,sy-33*s);ctx.lineTo(sx+7*s,sy-33*s);ctx.lineTo(sx+10*s,sy-3*s);ctx.lineTo(sx-10*s,sy-3*s);ctx.closePath();ctx.fill();
    ctx.fillStyle='#c9a882';ctx.beginPath();ctx.arc(sx,sy-38*s,4.5*s,0,7);ctx.fill();ctx.fillStyle='#5a4028';ctx.beginPath();ctx.ellipse(sx,sy-41*s,7*s,2*s,0,0,7);ctx.fill();ctx.fillRect(sx-4*s,sy-46*s,8*s,5*s);
    ctx.fillStyle='#6a4a2a';ctx.fillRect(sx-15*s,sy-28*s,7*s,12*s);
    if(ev.state==='on'){const w=30*s;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(sx-w/2-1,sy-54*s,w+2,5);ctx.fillStyle='#7fd07f';ctx.fillRect(sx-w/2,sy-53*s,w*Math.max(0,ev.hp/ev.hpMax),3);}
    if(ev.state==='saved'){ctx.fillStyle='#e8c46a';ctx.font=`700 ${18*Z}px "Grenze Gotisch",serif`;ctx.textAlign='center';ctx.fillText('!',sx,sy-52*s+Math.sin(S.t*4)*2);}}}
  else if(o.type==='dummy'){shadow(sx,sy,9);ctx.strokeStyle='#5a3e24';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx,sy-40*s);ctx.moveTo(sx-11*s,sy-30*s);ctx.lineTo(sx+11*s,sy-30*s);ctx.stroke();ctx.fillStyle=vgrad(sy-38*s,sy-14*s,'#c8a868','#7a6034');ctx.beginPath();ctx.ellipse(sx,sy-24*s,7*s,11*s,0,0,7);ctx.fill();ctx.fillStyle='#b89858';ctx.beginPath();ctx.arc(sx,sy-40*s,5*s,0,7);ctx.fill();ctx.strokeStyle='#a02a20';ctx.lineWidth=1.5*s;ctx.beginPath();ctx.arc(sx,sy-24*s,4*s,0,7);ctx.stroke();ctx.beginPath();ctx.arc(sx,sy-24*s,1.5*s,0,7);ctx.stroke();}
  else if(o.type==='board'){shadow(sx,sy,10);ctx.strokeStyle='#4a3420';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx-8*s,sy);ctx.lineTo(sx-8*s,sy-30*s);ctx.moveTo(sx+8*s,sy);ctx.lineTo(sx+8*s,sy-30*s);ctx.stroke();ctx.fillStyle=vgrad(sy-38*s,sy-20*s,'#7a5a3a','#3a2814');ctx.fillRect(sx-11*s,sy-38*s,22*s,16*s);ctx.fillStyle='#e8dcc0';ctx.fillRect(sx-7*s,sy-35*s,14*s,10*s);ctx.fillStyle='#b02a1a';ctx.fillRect(sx-1*s,sy-37*s,2*s,2*s);}
  else if(o.type==='relic'){const ev=S.cur.ev||{},st=ev.state||'idle';shadow(sx,sy,14);ctx.fillStyle=vgrad(sy-14*s,sy,'#4a4258','#1e1a26');ctx.beginPath();ctx.ellipse(sx,sy-4*s,14*s,7*s,0,0,7);ctx.fill();
    if(st!=='fail'){const gl=st==='on'?'#e0c0ff':st==='done'?'#ffd060':'#b090e0';ctx.shadowColor=gl;ctx.shadowBlur=16+Math.sin(S.t*4)*6;ctx.fillStyle=vgrad(sy-46*s,sy-8*s,'#f4ecff',gl);ctx.beginPath();ctx.moveTo(sx,sy-48*s);ctx.lineTo(sx+7*s,sy-26*s);ctx.lineTo(sx,sy-8*s);ctx.lineTo(sx-7*s,sy-26*s);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
      if(st==='on'){const w=34*s;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(sx-w/2-1,sy-60*s,w+2,5);ctx.fillStyle='#c080ff';ctx.fillRect(sx-w/2,sy-59*s,w*Math.max(0,ev.hp/ev.hpMax),3);}}
    else{ctx.fillStyle='#5a4a6a';for(let k=0;k<4;k++)ctx.fillRect(sx-8*s+k*5*s,sy-8*s-(k%2)*3*s,4*s,4*s);}}
  else if(o.type==='stone'){shadow(sx,sy,12);if(o.kind==='cloche'){ctx.strokeStyle='#3a2a1a';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx-12*s,sy);ctx.lineTo(sx-12*s,sy-44*s);ctx.lineTo(sx+12*s,sy-44*s);ctx.lineTo(sx+12*s,sy);ctx.stroke();
      ctx.fillStyle=o.on?vgrad(sy-40*s,sy-16*s,'#d8c890','#6a5a30'):vgrad(sy-40*s,sy-16*s,'#6a6458','#2a2622');ctx.beginPath();ctx.moveTo(sx-4*s,sy-40*s);ctx.quadraticCurveTo(sx-9*s,sy-26*s,sx-10*s,sy-16*s);ctx.lineTo(sx+10*s,sy-16*s);ctx.quadraticCurveTo(sx+9*s,sy-26*s,sx+4*s,sy-40*s);ctx.closePath();ctx.fill();}
    else{ctx.fillStyle=vgrad(sy-46*s,sy,'#6a6a72','#26262c');ctx.beginPath();ctx.moveTo(sx-8*s,sy);ctx.lineTo(sx-6*s,sy-40*s);ctx.lineTo(sx,sy-46*s);ctx.lineTo(sx+6*s,sy-41*s);ctx.lineTo(sx+8*s,sy);ctx.closePath();ctx.fill();
      ctx.strokeStyle=o.on?'rgba(150,230,255,.95)':'rgba(120,140,160,.45)';ctx.lineWidth=1.6*s;ctx.beginPath();ctx.moveTo(sx-2*s,sy-34*s);ctx.lineTo(sx+2*s,sy-26*s);ctx.lineTo(sx-2*s,sy-18*s);ctx.lineTo(sx+1*s,sy-10*s);ctx.stroke();}
    if(o.on&&!p.eco){ctx.globalCompositeOperation='lighter';glowG(ctx,sx,sy-26*s,24*s,'120,210,255',.25+Math.sin(S.t*3)*.08);ctx.globalCompositeOperation='source-over';}}
  else if(o.type==='pyre'){shadow(sx,sy,12);ctx.strokeStyle='#3a2414';ctx.lineWidth=4*s;ctx.lineCap='round';ctx.beginPath();for(let k=0;k<4;k++){const a=k*.8+.3;ctx.moveTo(sx-Math.cos(a)*11*s,sy-Math.sin(a)*3*s-2*s);ctx.lineTo(sx+Math.cos(a)*11*s,sy+Math.sin(a)*3*s-6*s-k*2*s);}ctx.stroke();
    ctx.fillStyle='#d8d0bc';ctx.beginPath();ctx.ellipse(sx,sy-14*s,6*s,2.5*s,0,0,7);ctx.fill();if(o.lit){flame(sx-4*s,sy-10*s,s*1.4,o.x);flame(sx+4*s,sy-11*s,s*1.6,o.y);flame(sx,sy-14*s,s*1.2,2);}else{ctx.fillStyle='rgba(120,110,100,.8)';ctx.fillRect(sx-2*s,sy-18*s,4*s,2*s);}}
  else if(o.type==='statue'){shadow(sx,sy,10);if(o.broken){ctx.fillStyle='rgba(200,230,255,.6)';for(let k=0;k<5;k++)ctx.fillRect(sx+(k-2)*4*s,sy-3*s-(k%2)*2*s,3*s,3*s);}
    else{ctx.fillStyle=['#5a4a3a','#4a5a6a','#6a4a4a'][o.v||0];ctx.fillRect(sx-5*s,sy-34*s,10*s,30*s);ctx.fillStyle='#c9a882';ctx.beginPath();ctx.arc(sx,sy-38*s,4.5*s,0,7);ctx.fill();
      ctx.fillStyle='rgba(190,225,255,.55)';ctx.beginPath();ctx.moveTo(sx-11*s,sy);ctx.lineTo(sx-9*s,sy-40*s);ctx.lineTo(sx-2*s,sy-50*s);ctx.lineTo(sx+8*s,sy-44*s);ctx.lineTo(sx+11*s,sy);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(240,250,255,.8)';ctx.lineWidth=1.2*s;ctx.stroke();}}
  else if(o.type==='fire'){ctx.fillStyle='#4a4038';for(let k=0;k<7;k++){const a=k/7*6.28;ctx.beginPath();ctx.ellipse(sx+Math.cos(a)*12*s,sy+Math.sin(a)*6*s,3.5*s,2.5*s,0,0,7);ctx.fill();}
    ctx.strokeStyle='#3a2414';ctx.lineWidth=4*s;ctx.beginPath();ctx.moveTo(sx-10*s,sy-2*s);ctx.lineTo(sx+10*s,sy-6*s);ctx.moveTo(sx-10*s,sy-6*s);ctx.lineTo(sx+10*s,sy-2*s);ctx.stroke();
    flame(sx-3*s,sy-3*s,s*1.3,0);flame(sx+4*s,sy-3*s,s*1.1,2);}
}
function drawProp(o){
  const[sx,sy]=scr(o.x,o.y),s=Z*(o.s||1);
  if(o.k==='tree'&&o.leaf){shadow(sx,sy,18);const sw=Math.sin(S.t*1.2+o.x)*1.5*s;ctx.fillStyle=vgrad(sy-30*s,sy,'#5a4028','#2a1c10');ctx.beginPath();ctx.moveTo(sx-5*s,sy);ctx.lineTo(sx-2.5*s,sy-30*s);ctx.lineTo(sx+2.5*s,sy-30*s);ctx.lineTo(sx+5*s,sy);ctx.closePath();ctx.fill();
    const G=o.g||['#1e3a14','#2e5a1e','#4a7a2a'];for(let L=0;L<3;L++){ctx.fillStyle=G[L];for(const b of o.br){const r=(14-L*3)*s*b.w/2.2;ctx.beginPath();ctx.arc(sx+Math.cos(b.a)*b.l*s*.9+sw*(L+1)*.5-L*1.5*s,sy-b.h*s-12*s-L*3*s,r,0,7);ctx.fill();}}return;}
  if(o.k==='cactus'){shadow(sx,sy,9);ctx.fillStyle=vgrad(sy-32*s,sy,'#7a9a42','#2a4a1a');const rr=(x,y,w,h)=>{ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x,y+w/2);ctx.arc(x+w/2,y+w/2,w/2,Math.PI,0);ctx.lineTo(x+w,y+h);ctx.closePath();ctx.fill();};
    rr(sx-3.5*s,sy-32*s,7*s,32*s);rr(sx-11*s,sy-24*s,5*s,10*s);ctx.fillRect(sx-11*s,sy-15*s,8*s,4*s);rr(sx+6*s,sy-28*s,5*s,12*s);ctx.fillRect(sx+3*s,sy-18*s,8*s,4*s);
    ctx.strokeStyle='rgba(20,40,10,.5)';ctx.lineWidth=.8*s;ctx.beginPath();ctx.moveTo(sx,sy-30*s);ctx.lineTo(sx,sy-2*s);ctx.stroke();return;}
  if(o.k==='tree'){shadow(sx,sy,16);ctx.fillStyle=vgrad(sy-46*s,sy,'#3e3024','#1e1610');ctx.beginPath();ctx.moveTo(sx-5*s,sy);ctx.lineTo(sx-2*s,sy-44*s);ctx.lineTo(sx+2*s,sy-44*s);ctx.lineTo(sx+5*s,sy);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#2e241a';ctx.lineCap='round';for(const b of o.br){ctx.lineWidth=b.w*s;ctx.beginPath();const x0=sx,y0=sy-b.h*s,x1=x0+Math.cos(b.a)*b.l*s,y1=y0-Math.sin(b.a)*b.l*s;ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.lineTo(x1+Math.cos(b.a+b.t)*b.l*.5*s,y1-Math.sin(b.a+b.t)*b.l*.5*s);ctx.stroke();}}
  else if(o.k==='grave'){shadow(sx,sy,9);ctx.save();ctx.translate(sx,sy);ctx.rotate(o.t);ctx.fillStyle='#4e4b44';ctx.beginPath();ctx.moveTo(-6*s,0);ctx.lineTo(-6*s,-16*s);ctx.arc(-1*s,-16*s,5*s,Math.PI,0);ctx.lineTo(4*s,0);ctx.fill();
    ctx.fillStyle=vgrad(-24*s,0,'#8a867c','#5a564e');ctx.beginPath();ctx.moveTo(-8*s,0);ctx.lineTo(-8*s,-16*s);ctx.arc(-1*s,-16*s,7*s,Math.PI,0);ctx.lineTo(6*s,0);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=1.2*s;ctx.beginPath();ctx.moveTo(-1*s,-20*s);ctx.lineTo(-1*s,-10*s);ctx.moveTo(-4*s,-16*s);ctx.lineTo(2*s,-16*s);ctx.stroke();ctx.restore();}
  else if(o.k==='candles'){/* v5.72 : bougies, gravats, stalagmites */for(let i=0;i<o.n;i++){const a=i*2.4+o.x,cx=sx+Math.cos(a)*6*s,cy=sy+Math.sin(a)*3*s,h=(5+(i*7%5))*s;ctx.fillStyle='#d8d0bc';ctx.fillRect(cx-1.2*s,cy-h,2.4*s,h);ctx.fillStyle='rgba(255,200,110,.95)';ctx.beginPath();ctx.ellipse(cx,cy-h-1.6*s+Math.sin(S.t*9+i)*.4*s,1*s,1.8*s,0,0,7);ctx.fill();}}
  else if(o.k==='rubble'){const k=o.s*s;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(sx,sy,11*k,4*k,0,0,7);ctx.fill();for(const[a,b,r_,c]of[[-5,-1,4,'#5a5650'],[3,-2,3.4,'#6a665e'],[0,1,3,'#4a4640'],[6,1,2,'#7a766c'],[-2,-4,2.4,'#625e56']]){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(sx+a*k-r_*k,sy+b*k);ctx.lineTo(sx+a*k,sy+b*k-r_*1.2*k);ctx.lineTo(sx+a*k+r_*k,sy+b*k);ctx.lineTo(sx+a*k,sy+b*k+r_*.4*k);ctx.closePath();ctx.fill();}}
  else if(o.k==='spike'){const k=o.s*s;ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(sx,sy,8*k,3.5*k,0,0,7);ctx.fill();ctx.fillStyle=vgrad(sy-26*k,sy,'#6a3a2a','#1e0e08');ctx.beginPath();ctx.moveTo(sx-6*k,sy);ctx.lineTo(sx-1*k,sy-26*k);ctx.lineTo(sx+5*k,sy);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(sx+2*k,sy+1*k);ctx.lineTo(sx+6*k,sy-13*k);ctx.lineTo(sx+9*k,sy+1*k);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,120,40,.35)';ctx.lineWidth=1*k;ctx.beginPath();ctx.moveTo(sx-1*k,sy-24*k);ctx.lineTo(sx-2*k,sy-12*k);ctx.lineTo(sx,sy-4*k);ctx.stroke();}
  else if(o.k==='rock'){ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(sx,sy,9*s,4*s,0,0,7);ctx.fill();ctx.fillStyle=vgrad(sy-12*s,sy,'#7a746a','#3e3a34');ctx.beginPath();ctx.moveTo(sx-9*s,sy);ctx.lineTo(sx-7*s,sy-7*s);ctx.lineTo(sx-1*s,sy-11*s);ctx.lineTo(sx+6*s,sy-8*s);ctx.lineTo(sx+9*s,sy-1*s);ctx.closePath();ctx.fill();}
  else if(o.k==='shroom'){ctx.fillStyle='#e8e0d0';ctx.fillRect(sx-1.6*s,sy-9*s,3.2*s,9*s);ctx.fillStyle=o.c;ctx.beginPath();ctx.ellipse(sx,sy-9*s,7*s,4.5*s,0,Math.PI,0);ctx.fill();ctx.fillStyle='rgba(255,255,255,.85)';for(const[a,b]of[[-3,-11],[2,-12],[4,-9.5]]){ctx.beginPath();ctx.arc(sx+a*s,sy+b*s,1.1*s,0,7);ctx.fill();}}
  else if(o.k==='bones'){ctx.strokeStyle='#cfc6b2';ctx.lineWidth=2*Z;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(sx-8*Z,sy-2*Z);ctx.lineTo(sx+4*Z,sy+3*Z);ctx.moveTo(sx-3*Z,sy+4*Z);ctx.lineTo(sx+6*Z,sy-3*Z);ctx.stroke();ctx.fillStyle='#e0d8c6';ctx.beginPath();ctx.arc(sx+8*Z,sy-1*Z,3.5*Z,0,7);ctx.fill();ctx.fillStyle='#1a1410';ctx.fillRect(sx+7*Z,sy-2*Z,1.5*Z,1.5*Z);}
  else if(o.k==='coffin'){const P=[[-.7,0],[-.5,-.26],[.6,-.18],[.72,0],[.6,.18],[-.5,.26]].map(([a,b])=>o.rot?[b,a]:[a,b]).map(([a,b])=>scr(o.x+a,o.y+b));
    poly(P.map(q=>[q[0],q[1]]),'#1e140c');poly(P.map(q=>[q[0],q[1]-9*Z]),'#5a3c22');ctx.strokeStyle='#2a1a0e';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]-9*Z);ctx.lineTo(P[3][0],P[3][1]-9*Z);ctx.stroke();}
  else if(o.k==='brazier'){shadow(sx,sy,8);ctx.strokeStyle='#2a2622';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(sx-6*s,sy);ctx.lineTo(sx,sy-16*s);ctx.lineTo(sx+6*s,sy);ctx.moveTo(sx,sy+2*s);ctx.lineTo(sx,sy-16*s);ctx.stroke();
    ctx.fillStyle='#3a3632';ctx.beginPath();ctx.ellipse(sx,sy-17*s,9*s,4*s,0,0,Math.PI);ctx.fill();ctx.fillStyle='#ff8a3a';ctx.beginPath();ctx.ellipse(sx,sy-17*s,8*s,3*s,0,0,7);ctx.fill();flame(sx,sy-17*s,s,o.x);}
  else if(o.k==='torch'){ctx.strokeStyle='#4a3420';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx,sy-34*s);ctx.stroke();flame(sx,sy-34*s,s*.9,o.y);}
  else if(o.k==='barrel'){shadow(sx,sy,8);ctx.fillStyle=vgrad(sy-18*s,sy,'#7a5430','#3e2814');ctx.fillRect(sx-7*s,sy-16*s,14*s,15*s);ctx.beginPath();ctx.ellipse(sx,sy-1*s,7*s,3*s,0,0,Math.PI);ctx.fill();
    ctx.fillStyle='#5a3c20';ctx.beginPath();ctx.ellipse(sx,sy-16*s,7*s,3*s,0,0,7);ctx.fill();ctx.strokeStyle='#2a2622';ctx.lineWidth=1.5*s;ctx.beginPath();ctx.moveTo(sx-7*s,sy-12*s);ctx.lineTo(sx+7*s,sy-12*s);ctx.moveTo(sx-7*s,sy-5*s);ctx.lineTo(sx+7*s,sy-5*s);ctx.stroke();}
  else if(o.k==='hay'){shadow(sx,sy,10);ctx.fillStyle=vgrad(sy-14*s,sy,'#b89a52','#6a5428');ctx.beginPath();ctx.ellipse(sx,sy-7*s,11*s,8*s,0,0,7);ctx.fill();ctx.strokeStyle='rgba(60,44,18,.6)';ctx.lineWidth=1*s;ctx.beginPath();for(let k=-2;k<=2;k++){ctx.moveTo(sx+k*4*s,sy-14*s);ctx.lineTo(sx+k*4.5*s,sy-1*s);}ctx.stroke();
    ctx.strokeStyle='rgba(220,200,130,.5)';ctx.beginPath();for(let k=0;k<5;k++){const a=k*1.3+o.x;ctx.moveTo(sx+Math.cos(a)*9*s,sy-7*s+Math.sin(a)*6*s);ctx.lineTo(sx+Math.cos(a)*13*s,sy-6*s+Math.sin(a)*8*s);}ctx.stroke();}
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
/* v5.68 : lueurs pré-dessinées (une par couleur), bien moins coûteuses que des dégradés créés à chaque image */
function glowG(c,x,y,r,rgb,a){if(r<=0)return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a.toFixed(2)})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();}
/* v5.73 : butin au sol dessiné selon sa nature (pièces, fiole, parchemin, arme, armure, bijou…) */
function drawLoot(it,sx,sy){const s=Z,c=ctx;c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(sx,sy+1*s,6*s,2.4*s,0,0,7);c.fill();
  if(it.kind==='gold'){for(const[a,b]of[[-3,0],[2,-1],[0,1.5],[3,1],[-1,-1.5]]){c.fillStyle='#8a6a20';c.beginPath();c.ellipse(sx+a*s,sy+b*s,2.4*s,1.3*s,0,0,7);c.fill();c.fillStyle='#e8c46a';c.beginPath();c.ellipse(sx+a*s,sy+b*s-.6*s,2.4*s,1.2*s,0,0,7);c.fill();}return;}
  if(it.kind==='pot'){c.fillStyle='#5a1a14';c.fillRect(sx-1.2*s,sy-9*s,2.4*s,2.5*s);c.fillStyle='#c23a30';c.beginPath();c.arc(sx,sy-3.5*s,3.4*s,0,7);c.fill();c.fillStyle='rgba(255,200,190,.5)';c.fillRect(sx-1.6*s,sy-5.2*s,1.2*s,1.2*s);return;}
  if(it.kind==='scroll'||it.kind==='page'){c.fillStyle=it.kind==='page'?'#e8dcc0':'#cfc2a0';c.save();c.translate(sx,sy-2*s);c.rotate(-.3);c.fillRect(-5*s,-2*s,10*s,4*s);c.fillStyle='rgba(60,40,20,.5)';c.fillRect(-3.5*s,-.8*s,7*s,.6*s);c.fillRect(-3.5*s,.6*s,5*s,.6*s);c.restore();return;}
  if(it.kind==='card'){c.fillStyle='#3a2050';c.save();c.translate(sx,sy-3*s);c.rotate(.2);c.fillRect(-3.5*s,-4.5*s,7*s,9*s);c.strokeStyle='#d8a8ff';c.lineWidth=.8*s;c.strokeRect(-2.8*s,-3.8*s,5.6*s,7.6*s);c.restore();return;}
  if(it.kind==='orb'){const O=ORBS[it.k]||ORBS.braise;c.fillStyle=O.c;c.beginPath();c.arc(sx,sy-4*s,3.6*s,0,7);c.fill();c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.arc(sx-1.2*s,sy-5.2*s,1.1*s,0,7);c.fill();return;}
  if(it.kind==='gem'||it.kind==='sup'){c.fillStyle=it.kind==='gem'?'#60e0c0':'#e0a0ff';c.beginPath();c.moveTo(sx,sy-8*s);c.lineTo(sx+3.5*s,sy-3*s);c.lineTo(sx,sy+1*s);c.lineTo(sx-3.5*s,sy-3*s);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.moveTo(sx,sy-8*s);c.lineTo(sx+1.5*s,sy-4*s);c.lineTo(sx-1*s,sy-4*s);c.fill();return;}
  if(it.kind==='egg'){c.fillStyle='#e8e0cc';c.beginPath();c.ellipse(sx,sy-4*s,3.4*s,4.6*s,0,0,7);c.fill();c.strokeStyle='#ff9a3a';c.lineWidth=.8*s;c.beginPath();c.moveTo(sx-2*s,sy-5*s);c.lineTo(sx,sy-3*s);c.lineTo(sx+1*s,sy-6*s);c.stroke();return;}
  if(it.kind==='bagx'){c.fillStyle='#8a6a3a';c.beginPath();c.ellipse(sx,sy-3*s,5*s,4*s,0,0,7);c.fill();c.fillStyle='#5a4020';c.fillRect(sx-1.5*s,sy-8*s,3*s,2*s);return;}
  if(it.kind==='relic'){c.fillStyle='#6a4a1a';c.fillRect(sx-3.5*s,sy-5*s,7*s,5*s);c.fillStyle='#ffd27a';c.beginPath();c.moveTo(sx-4*s,sy-5*s);c.lineTo(sx,sy-9*s);c.lineTo(sx+4*s,sy-5*s);c.closePath();c.fill();c.fillStyle='rgba(255,240,200,.8)';c.beginPath();c.arc(sx,sy-3*s,1.2*s,0,7);c.fill();return;}
  const I=it.it||{},col=itemCol(I),t=I.type||'';c.strokeStyle=col;c.fillStyle=col;c.lineCap='round';
  if(['sword','dagger','axe','mace'].includes(t)){c.lineWidth=1.8*s;c.beginPath();c.moveTo(sx-6*s,sy+1*s);c.lineTo(sx+5*s,sy-3*s);c.stroke();c.strokeStyle='#5a4030';c.lineWidth=2.2*s;c.beginPath();c.moveTo(sx-4*s,sy-2*s);c.lineTo(sx-3*s,sy+3*s);c.stroke();if(t==='axe'||t==='mace'){c.beginPath();c.arc(sx+5*s,sy-3*s,2.4*s,0,7);c.fill();}}
  else if(t==='bow'){c.lineWidth=1.4*s;c.beginPath();c.arc(sx,sy-2*s,5*s,-2.4,.8);c.stroke();c.strokeStyle='rgba(230,220,200,.6)';c.lineWidth=.6*s;c.beginPath();c.moveTo(sx+Math.cos(-2.4)*5*s,sy-2*s+Math.sin(-2.4)*5*s);c.lineTo(sx+Math.cos(.8)*5*s,sy-2*s+Math.sin(.8)*5*s);c.stroke();}
  else if(t==='staff'||t==='orb'){c.lineWidth=1.4*s;c.strokeStyle='#6a4a2a';c.beginPath();c.moveTo(sx-6*s,sy+1*s);c.lineTo(sx+4*s,sy-4*s);c.stroke();c.beginPath();c.arc(sx+5*s,sy-4.5*s,2.2*s,0,7);c.fill();}
  else if(t==='ring'||t==='amulet'){c.lineWidth=1.3*s;c.beginPath();c.ellipse(sx,sy-2*s,3*s,2*s,0,0,7);c.stroke();c.beginPath();c.arc(sx,sy-4*s,1.2*s,0,7);c.fill();}
  else{const sh=c.fillStyle;c.fillStyle=vgrad(sy-7*s,sy+1*s,sh,shade(hexc(col.startsWith('#')?col:'#888888'),.4));c.beginPath();if(t==='helm'){c.arc(sx,sy-2*s,4*s,Math.PI,0);c.lineTo(sx+4*s,sy);c.lineTo(sx-4*s,sy);}else if(t==='boots'){c.rect(sx-4*s,sy-5*s,3*s,5*s);c.rect(sx+.5*s,sy-5*s,3*s,5*s);}else if(t==='gloves'){c.ellipse(sx-2*s,sy-2*s,2.4*s,3*s,0,0,7);c.ellipse(sx+2.5*s,sy-2*s,2.4*s,3*s,0,0,7);}else if(t==='shield'){c.moveTo(sx-4*s,sy-6*s);c.lineTo(sx+4*s,sy-6*s);c.lineTo(sx+3.5*s,sy-1*s);c.lineTo(sx,sy+1.5*s);c.lineTo(sx-3.5*s,sy-1*s);}else if(t==='belt'){c.rect(sx-5*s,sy-3*s,10*s,2.4*s);}else{c.moveTo(sx-5*s,sy-7*s);c.lineTo(sx+5*s,sy-7*s);c.lineTo(sx+4*s,sy);c.lineTo(sx-4*s,sy);}c.closePath();c.fill();}}
function drawProj(pr){const[sx,sy]=scr(pr.x,pr.y),s=Z;
  /* v5.67 : traînée lumineuse derrière les projectiles magiques, sillage pâle derrière les flèches */
  if(!p.eco){const glw=pr.kind==='fire'?'255,140,40':pr.kind==='sbolt'?'140,160,255':pr.kind==='mbolt'?'170,100,255':pr.kind==='bolt'?'255,90,30':null;
    if(glw){ctx.globalCompositeOperation='lighter';for(let k=1;k<=5;k++){const[tx,ty]=scr(pr.x-pr.vx*k*.022,pr.y-pr.vy*k*.022);glowG(ctx,tx,ty-14*s,(9-k*1.3)*s,glw,.45-k*.07);}ctx.globalCompositeOperation='source-over';}
    else if(pr.kind!=='totem'){const[tx,ty]=scr(pr.x-pr.vx*.06,pr.y-pr.vy*.06);ctx.strokeStyle='rgba(230,220,200,.18)';ctx.lineWidth=1.5*s;ctx.beginPath();ctx.moveTo(sx,sy-16*s);ctx.lineTo(tx,ty-16*s);ctx.stroke();}}
  if(pr.kind==='fire'&&pr.arrowFire){/* v6.35 : flèche dont la pointe brûle */const[dx,dy]=sdir(Math.atan2(pr.vy,pr.vx));const l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l;ctx.strokeStyle='#5a3a1e';ctx.lineWidth=2.2*s;ctx.beginPath();ctx.moveTo(sx-ux*11*s,sy-16*s-uy*11*s);ctx.lineTo(sx+ux*7*s,sy-16*s+uy*7*s);ctx.stroke();
    ctx.globalCompositeOperation='lighter';const hx=sx+ux*8*s,hy=sy-16*s+uy*8*s,g=ctx.createRadialGradient(hx,hy,0,hx,hy,8*s);g.addColorStop(0,'rgba(255,245,200,1)');g.addColorStop(.4,'rgba(255,150,50,.9)');g.addColorStop(1,'rgba(255,60,10,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(hx,hy,8*s,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';}
  else if(pr.kind==='fire'){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy-14*s,0,sx,sy-14*s,12*s);g.addColorStop(0,'rgba(255,240,190,1)');g.addColorStop(.35,'rgba(255,150,50,.9)');g.addColorStop(1,'rgba(255,60,10,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy-14*s,12*s,0,7);ctx.fill();if(!p.eco){const j=1+.18*Math.sin(S.t*40+pr.x*7);ctx.fillStyle='rgba(255,255,235,.85)';ctx.beginPath();ctx.arc(sx,sy-14*s,3.6*s*j,0,7);ctx.fill();}ctx.globalCompositeOperation='source-over';}
  else if(pr.kind==='parrow'){const[dx,dy]=sdir(Math.atan2(pr.vy,pr.vx));const l=Math.hypot(dx,dy);ctx.strokeStyle='#d8cfbb';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(sx-dx/l*9*s,sy-18*s-dy/l*9*s);ctx.lineTo(sx+dx/l*9*s,sy-18*s+dy/l*9*s);ctx.stroke();ctx.fillStyle='#8a7a6a';ctx.fillRect(sx-dx/l*9*s-1,sy-18*s-dy/l*9*s-1,3,3);}
  else if(pr.kind==='dagger'){const[dx,dy]=sdir(Math.atan2(pr.vy,pr.vx));const l=Math.hypot(dx,dy);ctx.strokeStyle='#c8c8d8';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(sx-dx/l*6*s,sy-14*s-dy/l*6*s);ctx.lineTo(sx+dx/l*6*s,sy-14*s+dy/l*6*s);ctx.stroke();}
  else if(pr.kind==='lance'){const[dx,dy]=sdir(Math.atan2(pr.vy,pr.vx));const l=Math.hypot(dx,dy);ctx.strokeStyle='#ece4d0';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx-dx/l*14*s,sy-14*s-dy/l*14*s);ctx.lineTo(sx+dx/l*10*s,sy-14*s+dy/l*10*s);ctx.stroke();}
  else if(pr.kind==='sbolt'){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy-16*s,0,sx,sy-16*s,7*s);g.addColorStop(0,'rgba(235,240,255,1)');g.addColorStop(.4,'rgba(140,160,255,.85)');g.addColorStop(1,'rgba(90,100,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy-16*s,7*s,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';}
  else if(pr.kind==='mbolt'){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy-14*s,0,sx,sy-14*s,9*s);g.addColorStop(0,'rgba(230,200,255,1)');g.addColorStop(1,'rgba(140,60,220,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy-14*s,9*s,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';}
  else if(pr.kind==='webshot'){ctx.strokeStyle='rgba(245,245,255,.9)';ctx.lineWidth=1.2;ctx.beginPath();for(let k=0;k<6;k++){const a=k*1.05+S.t*4;ctx.moveTo(sx,sy-14*s);ctx.lineTo(sx+Math.cos(a)*7*s,sy-14*s+Math.sin(a)*4*s);}ctx.stroke();}
  else if(pr.kind==='boom'){const a=S.t*20;ctx.strokeStyle='#d8b070';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx-Math.cos(a)*7*s,sy-16*s-Math.sin(a)*3.5*s);ctx.lineTo(sx,sy-16*s);ctx.lineTo(sx+Math.cos(a+1.6)*7*s,sy-16*s+Math.sin(a+1.6)*3.5*s);ctx.stroke();}
  else if(pr.kind==='bolt'){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy-14*s,0,sx,sy-14*s,9*s);g.addColorStop(0,'rgba(255,200,120,1)');g.addColorStop(1,'rgba(220,40,10,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy-14*s,9*s,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';}
  else{const[dx,dy]=sdir(Math.atan2(pr.vy,pr.vx));const l=Math.hypot(dx,dy);ctx.strokeStyle='#d8cfbb';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(sx-dx/l*9*s,sy-14*s-dy/l*9*s);ctx.lineTo(sx+dx/l*9*s,sy-14*s+dy/l*9*s);ctx.stroke();}}
function drawMini(){
  const z=S.cur,w=mm.width,h=mm.height;mctx.clearRect(0,0,w,h);const cx=w/2,cy=h/2,k=3;
  for(let y=0;y<z.h;y++)for(let x=0;x<z.w;x++){const i=y*z.w+x;const wall=z.g[i]===1&&!z.hide[i];if(wall){if(!z.near[i]||!neighSeen(z,x,y))continue;}else if(!z.seen[i])continue;
    const mx=cx+((x-y)-(p.x-p.y))*k,my=cy+((x+y)-(p.x+p.y))*k/2;if(mx<0||my<0||mx>w||my>h)continue;
    mctx.fillStyle=wall?(natKind(z)==='water'?'rgba(80,120,150,.8)':natKind(z)==='tree'?'rgba(70,120,60,.8)':'rgba(200,180,140,.75)'):'rgba(120,105,80,.35)';mctx.fillRect(mx,my,k,k/2+1);}
  const dot=(x,y,c,r)=>{const mx=cx+((x-y)-(p.x-p.y))*k,my=cy+((x+y)-(p.x+p.y))*k/2;mctx.fillStyle=c;mctx.beginPath();mctx.arc(mx,my,r,0,7);mctx.fill();};
  for(const o of z.objs){if(!z.seen[Math.floor(o.y)*z.w+Math.floor(o.x)])continue;if(o.type==='exit')dot(o.x,o.y,o.side?'#7fd0ff':'#e8c46a',4);if(o.type==='stone'&&!o.on)dot(o.x,o.y,'#a8d8f0',3);if(o.type==='wp')dot(o.x,o.y,'#6fa0ff',4);if(o.type==='npc')dot(o.x,o.y,'#7fd07f',3);if(o.type==='chest'&&o.relic&&!o.open)dot(o.x,o.y,'#ffd060',3);}
  for(const po of portalsIn(z))dot(po.x,po.y,'#9fb8ff',4);
  if(z.ev&&(z.ev.state==='idle'||z.ev.state==='on'))dot(z.ev.id==='wisp'&&z.ev.wx!=null?z.ev.wx:z.ev.x,z.ev.id==='wisp'&&z.ev.wy!=null?z.ev.wy:z.ev.y,z.ev.id==='wisp'?'#aaff8c':'#c080ff',4);
  for(const m of z.mons)if(m.hunt&&inView(m))dot(m.x,m.y,'#ff5adc',5);
  for(const m of z.mons)if(m.mini&&inView(m))dot(m.x,m.y,'#e8c46a',5);
  for(const m of z.mons)if(m.pc&&inView(m)&&z.pur0&&!z.purDone&&z.purK>=purNeed(z)*.6)dot(m.x,m.y,'#d04a30',2);
  for(const m of z.mons)if(m.herald&&inView(m))dot(m.x,m.y,m.hcol,5);/* v6.39 : la fin de la purification se voit sur la minicarte */
  /* v5.65 : plus de repères sur la mini-carte */
  const edge=(x,y,c,r)=>{let mx=cx+((x-y)-(p.x-p.y))*k,my=cy+((x+y)-(p.x+p.y))*k/2;mx=clamp(mx,r+1,w-r-1);my=clamp(my,r+1,h-r-1);mctx.fillStyle=c;mctx.beginPath();mctx.arc(mx,my,r,0,7);mctx.fill();};
  for(const o of z.objs){const sn=z.seen[Math.floor(o.y)*z.w+Math.floor(o.x)];if(o.type==='chest'&&!o.open&&!o.relic&&sn)dot(o.x,o.y,'#b89a5a',2);if(o.type==='pkey'&&!o.got&&sn)dot(o.x,o.y,'#f0e6c8',4);if(o.type==='cvdest')edge(o.x,o.y,'#d2c8ff',4);if(o.type==='cart')dot(o.x,o.y,'#ffbe6e',4);}
  if(z.prey&&z.prey.on&&Math.hypot(z.prey.x-p.x,z.prey.y-p.y)<12)dot(z.prey.x,z.prey.y,'#000',5),dot(z.prey.x,z.prey.y,'#ff3a2a',2);
  if(S.ally&&!S.ally.down)dot(S.ally.x,S.ally.y,'#7fd0ff',3);
  dot(p.x,p.y,'#ff4a3a',4);
}
function neighSeen(z,x,y){for(const[dx,dy]of DIR8){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<z.w&&ny<z.h&&z.seen[ny*z.w+nx]&&(!z.g[ny*z.w+nx]||z.hide[ny*z.w+nx]))return true;}return false;}


