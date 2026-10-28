'use strict';
/* ---------- Apparence du héros selon l’équipement ---------- */
// Paliers : 0 cuir, 1 fer, 2 acier, 3 chevalier, 4 paladin
const MET=[{m:'#8a6040',d:'#3e2814',l:'#b8885a',t:'#5a3a20'},{m:'#7e8288',d:'#34363c',l:'#b4b8be',t:'#6a4a2a'},{m:'#bcc4cc',d:'#565e66',l:'#f2f6fa',t:'#8a9098'},{m:'#d4dae0',d:'#5e646c',l:'#ffffff',t:'#d4aa48'},{m:'#3a3644',d:'#141218',l:'#77708a',t:'#f2c64a'}];
const GEMC=['#9a8a6a','#7fb0e0','#5fa8ff','#c070ff','#ffb040'];
function tierE(e){return e?tierOf(e):-1;}
function hg(c,y0,y1,a,b){const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function hp_(c,pts,f){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.closePath();c.fillStyle=f;c.fill();}
/* v5.89 : apparence du héros (peau, cheveux, cape, casque caché) */
const LOOKS={skin:['#c9a882','#e2c4a4','#a87e5c','#7a5438','#5a3c28'],hair:['#4a3020','#1a1410','#a07040','#d8d0c0','#7a2a1a','#2a2a3a'],cape:[null,['#2a3a5a','#0c1220'],['#2a4a2a','#0c180c'],['#3a3a3a','#101010'],['#c8c0a8','#5a5448']],n:{skin:'Peau',hair:'Cheveux',cape:'Cape'}};
function drawHero(c,sx,sy,s,o){
  const E=o.eq,t=o.t,LK=o.look||{},SKN=LOOKS.skin[LK.skin|0],HAIR=LOOKS.hair[LK.hair|0],HIDEH=!!LK.nohelm;const dx=Math.cos(o.face),dy=Math.sin(o.face);const side=(dx-dy)>=0?1:-1;
  const bob=o.moving?Math.abs(Math.sin(t*11))*2*s:0,legA=o.moving?Math.sin(t*11)*3*s:0,sway=o.moving?Math.sin(t*11)*2*s:0;
  const X=v=>sx+v*s,Y=v=>sy-v*s;
  const ta=tierE(E.armor),th=tierE(E.helm),tg=tierE(E.gloves),tb=tierE(E.boots),tl=tierE(E.belt);
  c.fillStyle='rgba(0,0,0,.45)';c.beginPath();c.ellipse(sx,sy,13*s,5.8*s,0,0,7);c.fill();
  if(o.buff>0){c.strokeStyle=`rgba(255,200,90,${.4+Math.sin(t*8)*.2})`;c.lineWidth=2*s;c.beginPath();c.ellipse(sx,sy,18*s,8*s,0,0,7);c.stroke();}
  /* v6.50 : le Tourbillon a sa propre allure, une arme qui tourne : deux lames d’acier, leurs traînées, des étincelles au bout et la poussière soulevée. Rien de bleu, rien de magique : on ne le confond plus avec le portail. */
  if(o.spin>0){const a=Math.min(1,o.spin*2.5),R1=30*s,R2=13*s,cy=Y(20),T=t*22;
    c.fillStyle=`rgba(140,115,85,${(.28*a).toFixed(3)})`;c.beginPath();c.ellipse(sx,Y(1),38*s,16*s,0,0,7);c.fill();
    for(let j=0;j<6;j++){const b=T*.6+j*1.05,r=34*s+Math.sin(T+j)*4*s;c.fillStyle=`rgba(165,140,105,${(.35*a).toFixed(3)})`;c.beginPath();c.arc(sx+Math.cos(b)*r,Y(3)+Math.sin(b)*r*.42,(3+j%3)*s,0,7);c.fill();}
    c.lineCap='round';
    for(let k=0;k<2;k++){const b=T+k*Math.PI;
      c.strokeStyle=`rgba(200,206,215,${(.22*a).toFixed(3)})`;c.lineWidth=11*s;c.beginPath();c.ellipse(sx,cy,R1-3*s,R2-1*s,0,b-1.3,b);c.stroke();
      c.strokeStyle=`rgba(85,92,104,${(.85*a).toFixed(3)})`;c.lineWidth=6*s;c.beginPath();c.ellipse(sx,cy,R1,R2,0,b,b+1.05);c.stroke();
      c.strokeStyle=`rgba(240,245,255,${a.toFixed(3)})`;c.lineWidth=2*s;c.beginPath();c.ellipse(sx,cy,R1+2.5*s,R2+1.2*s,0,b+.1,b+1.1);c.stroke();
      const ex=sx+Math.cos(b+1.1)*(R1+3*s),ey=cy+Math.sin(b+1.1)*(R2+1.5*s);c.fillStyle=`rgba(255,196,96,${a.toFixed(3)})`;for(let j=0;j<4;j++){const q=T*2.7+j*1.7;c.fillRect(ex+Math.cos(q)*(3+j*2)*s,ey+Math.sin(q)*(2+j)*s,2*s,2*s);}}
    c.lineCap='butt';}
  if(ta>=4||E.weapon&&E.weapon.rar===3){c.fillStyle=`rgba(255,170,60,${.10+Math.sin(t*3)*.04})`;c.beginPath();c.ellipse(sx,Y(24),20*s,30*s,0,0,7);c.fill();}
  // cape
  const cape=ta>=3||(E.amulet&&E.amulet.rar===3);
  if(cape){const cc=LK.cape?LOOKS.cape[LK.cape]:ta>=4?['#5a1468','#1c0624']:['#9a2a24','#3a0e0b'];c.fillStyle=hg(c,Y(36),Y(3),cc[0],cc[1]);c.beginPath();c.moveTo(X(-9),Y(35)-bob);c.lineTo(X(9),Y(35)-bob);c.lineTo(X(14)-side*sway,Y(3));c.quadraticCurveTo(sx,Y(1),X(-14)-side*sway,Y(3));c.closePath();c.fill();
    if(ta>=4){c.strokeStyle='#f2c64a';c.lineWidth=1.5*s;c.beginPath();c.moveTo(X(14)-side*sway,Y(3));c.quadraticCurveTo(sx,Y(1),X(-14)-side*sway,Y(3));c.stroke();}}
  else if(ta<=0){c.fillStyle=hg(c,Y(34),Y(12),'#5a4a32','#2e2416');c.beginPath();c.moveTo(X(-8),Y(34)-bob);c.lineTo(X(8),Y(34)-bob);c.lineTo(X(10)-side*sway,Y(13));c.lineTo(X(-10)-side*sway,Y(13));c.closePath();c.fill();}
  // jambes
  /* v5.93 : vraie marche. Les jambes avancent à tour de rôle, le pied qui avance se soulève, les bras balancent à l’inverse. */
  const wk=o.moving?Math.sin(t*11):0,L0=wk*4.2*s,L1=-wk*4.2*s,lf0=o.moving?Math.max(0,wk)*2.8*s:0,lf1=o.moving?Math.max(0,-wk)*2.8*s:0;
  c.fillStyle=ta>=2?'#2a2a32':'#3a2a1c';c.fillRect(X(-5)+L0,Y(15),4*s,13*s-lf0);c.fillRect(X(1)+L1,Y(15),4*s,13*s-lf1);
  if(ta>=2){const M=MET[ta];c.fillStyle=hg(c,Y(15),Y(8),M.l,M.d);c.fillRect(X(-5.5)+L0,Y(15),5*s,6*s);c.fillRect(X(.5)+L1,Y(15),5*s,6*s);}
  // bottes
  for(const[lx,lft]of[[-6+L0/s,lf0],[0+L1/s,lf1]]){c.save();c.translate(0,-lft);
    if(tb<0){c.fillStyle='#2a1c12';c.fillRect(X(lx),Y(3),6*s,3*s);c.restore();continue;}
    const M=MET[tb],h=[6,8,9,10,10][tb];c.fillStyle=hg(c,Y(h),Y(0),M.l,M.d);c.fillRect(X(lx),Y(h),6*s,h*s);
    c.fillStyle=M.d;c.fillRect(X(lx)+(side>0?3:-1)*s,Y(2),4*s,2*s);
    if(tb===1){c.fillStyle=M.t;c.fillRect(X(lx)-.5*s,Y(h),7*s,2*s);}
    if(tb>=2){c.fillStyle=tb>=3?M.t:M.l;c.beginPath();c.arc(X(lx+3),Y(h),2.4*s,0,7);c.fill();}
    if(tb===4){c.strokeStyle='rgba(255,170,60,.9)';c.lineWidth=1*s;c.beginPath();c.moveTo(X(lx+1),Y(4));c.lineTo(X(lx+5),Y(4));c.stroke();}c.restore();}
  /* v6.32 : allure de classe. Carquois dans le dos de l’archer, robe longue du mage. */
  {const CL=o.cls;if(CL==='archer'){c.save();c.translate(X(-side*7),Y(30)-bob);c.rotate(-side*.35);c.fillStyle='#5a3a1e';c.fillRect(-2.5*s,-2*s,5*s,16*s);c.strokeStyle='#d8cfbb';c.lineWidth=1.2*s;c.beginPath();for(let k=-1;k<=1;k++){c.moveTo(k*1.4*s,-2*s);c.lineTo(k*1.4*s,-7*s);}c.stroke();c.fillStyle='#b03a2a';for(let k=-1;k<=1;k++)c.fillRect(k*1.4*s-.8*s,-8*s,1.6*s,2*s);c.restore();}
   if(CL==='mage'){c.fillStyle=hg(c,Y(22),Y(1),'#3a2a5a','#140c24');c.beginPath();c.moveTo(X(-7.5),Y(19));c.lineTo(X(7.5),Y(19));c.lineTo(X(10)-side*sway*.5,Y(1));c.quadraticCurveTo(sx,Y(-1),X(-10)-side*sway*.5,Y(1));c.closePath();c.fill();c.strokeStyle='rgba(200,170,255,.45)';c.lineWidth=1*s;c.beginPath();c.moveTo(X(-10)-side*sway*.5,Y(2));c.quadraticCurveTo(sx,Y(0),X(10)-side*sway*.5,Y(2));c.stroke();}}
  // bras
  const sleeve=ta<0?'#6a5a46':ta===0?'#7a5434':MET[ta].m;
  c.fillStyle=sleeve;c.fillRect(X(-11)-wk*1.6*s,Y(33)-bob-wk*1.4*s,4*s,13*s);c.fillRect(X(7)+wk*1.6*s,Y(33)-bob+wk*1.4*s,4*s,13*s);
  // torse
  const tp=[[X(-8),Y(35)-bob],[X(8),Y(35)-bob],[X(7),Y(15)],[X(-7),Y(15)]];
  if(ta<0){hp_(c,tp,hg(c,Y(35),Y(15),'#7a6a52','#3e3426'));}
  else if(ta===0){hp_(c,tp,hg(c,Y(35),Y(15),'#9a6a40','#4a2c14'));c.strokeStyle='#2a1a0c';c.lineWidth=1*s;c.beginPath();for(let k=0;k<3;k++){c.moveTo(X(-2),Y(31-k*4)-bob);c.lineTo(X(2),Y(29-k*4)-bob);c.moveTo(X(2),Y(31-k*4)-bob);c.lineTo(X(-2),Y(29-k*4)-bob);}c.stroke();
    c.setLineDash([1.5*s,1.5*s]);c.strokeStyle='rgba(30,18,8,.7)';c.beginPath();c.moveTo(X(-7),Y(33)-bob);c.lineTo(X(-6.5),Y(16));c.moveTo(X(7),Y(33)-bob);c.lineTo(X(6.5),Y(16));c.stroke();c.setLineDash([]);}
  else if(ta===1){const M=MET[1];hp_(c,tp,hg(c,Y(35),Y(15),M.l,M.d));c.fillStyle='rgba(30,32,36,.55)';for(let r=0;r<6;r++)for(let k=0;k<5;k++)c.fillRect(X(-6.5+k*3+(r%2)*1.5),Y(33-r*3)-bob,1.4*s,1.4*s);
    hp_(c,[[X(-3),Y(31)-bob],[X(3),Y(31)-bob],[X(3),Y(13)],[X(0),Y(11)],[X(-3),Y(13)]],'#6a3a22');}
  else{const M=MET[ta];hp_(c,tp,hg(c,Y(35),Y(15),M.l,M.d));
    c.strokeStyle=ta>=3?M.t:'rgba(0,0,0,.35)';c.lineWidth=(ta>=3?1.6:1)*s;c.beginPath();c.moveTo(sx,Y(34)-bob);c.lineTo(sx,Y(22));c.moveTo(X(-7),Y(22));c.lineTo(X(7),Y(22));c.moveTo(X(-7),Y(19));c.lineTo(X(7),Y(19));c.stroke();
    if(ta>=3){c.strokeStyle=M.t;c.lineWidth=1.4*s;c.beginPath();for(const q of tp)c.lineTo(q[0],q[1]);c.closePath();c.stroke();
      hp_(c,[[X(-3.5),Y(21)],[X(3.5),Y(21)],[X(3.5),Y(8)],[X(0),Y(5)],[X(-3.5),Y(8)]],ta===4?'#3a0e40':'#8a1e18');c.fillStyle=M.t;c.fillRect(X(-.6),Y(19),1.2*s,7*s);c.fillRect(X(-2.2),Y(16.5),4.4*s,1.2*s);}
    if(ta===4){c.shadowColor='#ffa030';c.shadowBlur=8*s;c.fillStyle='#ffc060';c.beginPath();c.arc(sx,Y(28)-bob,1.8*s,0,7);c.fill();c.strokeStyle='rgba(255,170,60,.85)';c.lineWidth=1*s;c.beginPath();c.moveTo(X(-5),Y(32)-bob);c.lineTo(X(-2),Y(26)-bob);c.moveTo(X(5),Y(32)-bob);c.lineTo(X(2),Y(26)-bob);c.stroke();c.shadowBlur=0;}}
  // ceinture
  {const bc=tl<0?'#4a3a24':tl===0?'#5a3e22':tl===1?'#3a2a1a':tl>=3?'#2a1c12':'#3a3a40';c.fillStyle=bc;c.fillRect(X(-7.5),Y(18)-bob,15*s,3*s);
    if(tl>=1){c.fillStyle=tl>=3?'#e8c060':'#a8acb2';for(let k=-1;k<=1;k+=2)c.fillRect(X(k*5-.6),Y(17.3)-bob,1.4*s,1.4*s);}
    c.fillStyle=tl<0?'#6a5a3a':tl>=3?'#f2c64a':tl===2?'#c8ccd2':'#a08040';if(tl===4){c.shadowColor='#ffa030';c.shadowBlur=6*s;}c.fillRect(X(-1.8),Y(18.3)-bob,3.6*s,3.6*s);c.shadowBlur=0;}
  // épaulières
  if(ta>=1){const M=MET[ta],r=[0,3.5,4.6,5.6,6.6][ta];for(const k of[-1,1]){c.fillStyle=hg(c,Y(37)-bob,Y(29)-bob,M.l,M.d);c.beginPath();c.ellipse(X(k*9),Y(33)-bob,r*s,r*.75*s,0,Math.PI,0);c.lineTo(X(k*9+r),Y(31)-bob);c.lineTo(X(k*9-r),Y(31)-bob);c.closePath();c.fill();
      if(ta>=3){c.strokeStyle=M.t;c.lineWidth=1.2*s;c.stroke();}
      if(ta===4){c.fillStyle=M.t;c.beginPath();c.moveTo(X(k*9-1.5),Y(37)-bob);c.lineTo(X(k*10),Y(42)-bob);c.lineTo(X(k*9+1.5),Y(37)-bob);c.fill();}}}
  // mains
  const hand=(hx)=>{if(tg<0){c.fillStyle=SKN;}else{const M=MET[tg];c.fillStyle=tg===0?'#6a4a2a':hg(c,Y(22)-bob,Y(18)-bob,M.l,M.d);}const sg=hx<sx?-1:1;c.beginPath();c.arc(hx+sg*wk*1.6*s,Y(20)-bob+sg*wk*1.4*s,(tg>=2?2.8:2.3)*s,0,7);c.fill();
    if(tg>=3){c.fillStyle=MET[tg].t;c.fillRect(hx-2.5*s,Y(23)-bob,5*s,1.2*s);}};
  hand(X(-9));hand(X(9));
  // tête
  c.fillStyle=SKN;c.beginPath();c.arc(sx,Y(41)-bob,5.5*s,0,7);c.fill();
  if(th<0||HIDEH){c.fillStyle=HAIR;c.beginPath();c.arc(sx,Y(42.5)-bob,5.8*s,Math.PI*1.05,-.05);c.fill();c.fillStyle='#2a1a10';c.fillRect(X(side*1.5)-.8*s,Y(41)-bob,1.6*s,1.6*s);}
  else if(th===0&&!HIDEH){c.fillStyle=hg(c,Y(49),Y(36),'#7a5434','#3e2814');c.beginPath();c.arc(sx,Y(42)-bob,7*s,Math.PI,0);c.lineTo(X(6.5),Y(36)-bob);c.lineTo(X(4),Y(37)-bob);c.lineTo(X(4),Y(42)-bob);c.lineTo(X(-4),Y(42)-bob);c.lineTo(X(-4),Y(37)-bob);c.lineTo(X(-6.5),Y(36)-bob);c.closePath();c.fill();}
  else if(th===1&&!HIDEH){const M=MET[1];c.fillStyle=hg(c,Y(49),Y(41),M.l,M.d);c.beginPath();c.arc(sx,Y(42)-bob,6*s,Math.PI,0);c.fill();c.fillStyle=M.m;c.beginPath();c.ellipse(sx,Y(42)-bob,9*s,2*s,0,0,7);c.fill();}
  else if(th===2&&!HIDEH){const M=MET[2];c.fillStyle=hg(c,Y(49),Y(36),M.l,M.d);c.beginPath();c.arc(sx,Y(42)-bob,6.6*s,Math.PI,0);c.lineTo(X(6.6),Y(37)-bob);c.lineTo(X(4.5),Y(37)-bob);c.lineTo(X(4.5),Y(41)-bob);c.lineTo(X(-4.5),Y(41)-bob);c.lineTo(X(-4.5),Y(37)-bob);c.lineTo(X(-6.6),Y(37)-bob);c.closePath();c.fill();c.fillStyle=M.d;c.fillRect(X(-.8),Y(43)-bob,1.6*s,6*s);}
  else if(!HIDEH){const M=MET[th];c.fillStyle=hg(c,Y(50),Y(35),M.l,M.d);c.beginPath();c.moveTo(X(-6.5),Y(35)-bob);c.lineTo(X(-6.8),Y(45)-bob);c.quadraticCurveTo(sx,Y(52)-bob,X(6.8),Y(45)-bob);c.lineTo(X(6.5),Y(35)-bob);c.closePath();c.fill();
    if(th===4){c.shadowColor='#ffa030';c.shadowBlur=8*s;}c.fillStyle=th===4?'#ffb040':'#121418';c.fillRect(X(-5),Y(42.5)-bob,10*s,1.6*s);c.shadowBlur=0;
    c.fillStyle=M.t;c.fillRect(X(-.7),Y(48)-bob,1.4*s,11*s);
    if(th===3){c.fillStyle='#b02a22';c.beginPath();c.moveTo(sx,Y(50)-bob);c.quadraticCurveTo(X(-side*10),Y(58)-bob,X(-side*12),Y(46)-bob);c.quadraticCurveTo(X(-side*6),Y(52)-bob,sx,Y(49)-bob);c.fill();}
    if(th===4){c.fillStyle=hg(c,Y(56),Y(42),'#fff0c0','#c09030');for(const k of[-1,1]){c.beginPath();c.moveTo(X(k*6.5),Y(46)-bob);c.lineTo(X(k*15),Y(55)-bob);c.lineTo(X(k*12),Y(49)-bob);c.lineTo(X(k*14),Y(48)-bob);c.lineTo(X(k*7),Y(43)-bob);c.closePath();c.fill();}}}
  /* v6.32 : capuche de classe quand le casque est caché ou absent */
  if(o.cls&&(th<0||HIDEH)){if(o.cls==='mage'){c.fillStyle=hg(c,Y(56),Y(36),'#4a3a6a','#1a1030');c.beginPath();c.moveTo(X(-7),Y(36)-bob);c.quadraticCurveTo(X(-8),Y(46)-bob,X(side*4),Y(57)-bob);c.quadraticCurveTo(X(8),Y(46)-bob,X(7),Y(36)-bob);c.quadraticCurveTo(sx,Y(40)-bob,X(-7),Y(36)-bob);c.fill();c.fillStyle=SKN;c.beginPath();c.arc(X(side*1),Y(40.5)-bob,3.6*s,0,7);c.fill();}
    else if(o.cls==='archer'){c.fillStyle=hg(c,Y(50),Y(36),'#3a5a2a','#1a2a12');c.beginPath();c.arc(sx,Y(42)-bob,6.6*s,Math.PI*.95,Math.PI*2.05);c.lineTo(X(-side*8),Y(34)-bob);c.closePath();c.fill();c.fillStyle=SKN;c.beginPath();c.arc(X(side*1.5),Y(41)-bob,3.6*s,0,7);c.fill();}}
  // main gauche
  const oh=E.offhand,shx=sx-side*12.5*s,shy=Y(24)-bob;
  if(oh&&oh.type==='orb'){const to=tierOf(oh);c.shadowColor=GEMC[to];c.shadowBlur=12*s;c.fillStyle=GEMC[to];c.beginPath();c.arc(shx,shy-4*s+Math.sin(t*3)*2*s,(3.5+to*.4)*s,0,7);c.fill();c.shadowBlur=0;}
  else if(oh){const to=tierOf(oh),M=MET[to];
    if(to===0){c.fillStyle=hg(c,shy-8*s,shy+8*s,'#8a6038','#4a3016');c.beginPath();c.arc(shx,shy,7*s,0,7);c.fill();c.strokeStyle='#3a2410';c.lineWidth=1*s;c.beginPath();c.moveTo(shx-7*s,shy);c.lineTo(shx+7*s,shy);c.moveTo(shx-5*s,shy-4*s);c.lineTo(shx+5*s,shy-4*s);c.moveTo(shx-5*s,shy+4*s);c.lineTo(shx+5*s,shy+4*s);c.stroke();}
    else if(to===1){c.fillStyle=hg(c,shy-8*s,shy+8*s,'#7a5532','#3e2814');c.beginPath();c.arc(shx,shy,7.5*s,0,7);c.fill();c.strokeStyle=M.l;c.lineWidth=1.6*s;c.stroke();c.fillStyle=M.l;c.beginPath();c.arc(shx,shy,2.2*s,0,7);c.fill();}
    else{const w=[0,0,7,8,9.5][to],h=[0,0,10,11,14][to];c.fillStyle=to===4?hg(c,shy-h*s,shy+h*s,'#4a4456','#141218'):hg(c,shy-h*s,shy+h*s,M.l,M.d);c.beginPath();c.moveTo(shx-w*s,shy-h*.7*s);c.lineTo(shx+w*s,shy-h*.7*s);c.lineTo(shx+w*s,shy);c.quadraticCurveTo(shx+w*.7*s,shy+h*.7*s,shx,shy+h*s);c.quadraticCurveTo(shx-w*.7*s,shy+h*.7*s,shx-w*s,shy);c.closePath();c.fill();
      c.strokeStyle=to>=3?M.t:M.d;c.lineWidth=1.5*s;c.stroke();
      if(to===3){c.fillStyle='#9a2420';c.fillRect(shx-w*.55*s,shy-h*.45*s,w*1.1*s,h*.7*s);c.fillStyle=M.t;c.fillRect(shx-.8*s,shy-h*.45*s,1.6*s,h*.9*s);c.fillRect(shx-w*.5*s,shy-h*.1*s,w*s,1.6*s);}
      if(to===4){c.shadowColor='#ffa030';c.shadowBlur=10*s;c.fillStyle='#ffc060';c.beginPath();c.arc(shx,shy-1*s,3*s,0,7);c.fill();c.strokeStyle='#ffc060';c.lineWidth=1*s;for(let k=0;k<8;k++){const a=k/8*6.28;c.beginPath();c.moveTo(shx+Math.cos(a)*4*s,shy-1*s+Math.sin(a)*4*s);c.lineTo(shx+Math.cos(a)*6.5*s,shy-1*s+Math.sin(a)*6.5*s);c.stroke();}c.shadowBlur=0;}}
    if(oh.rar===3){c.strokeStyle='rgba(255,154,58,.8)';c.lineWidth=1*s;c.beginPath();c.arc(shx,shy,11*s,0,7);c.stroke();}}
  // arme
  const sdx=dx-dy,sdy=(dx+dy)/2;const base=Math.atan2(sdy,sdx);const sw=o.swing>0?(1-o.swing/.25):0;const ang=base-.9+sw*1.8;const hx=sx+side*9*s,hy=Y(20)-bob;
  if(o.swing>0){c.strokeStyle=`rgba(255,240,210,${o.swing*1.8})`;c.lineWidth=5*s;c.beginPath();c.arc(hx,hy,20*s,base-.9,ang);c.stroke();}
  const wp=E.weapon;if(wp){const to=tierOf(wp),M=MET[to],ty=wp.type,leg=wp.rar===3;
    const len={dagger:13,sword:22+to,mace:20,axe:21,staff:28,bow:0}[ty]||22;
    if(ty==='bow'){c.strokeStyle=to>=3?M.t:'#7a5a3a';c.lineWidth=2.6*s;c.beginPath();c.arc(hx+side*4*s,hy-6*s,13*s,side>0?-1.25:1.9,side>0?1.25:4.4);c.stroke();c.strokeStyle='rgba(230,220,200,.7)';c.lineWidth=1;c.beginPath();c.moveTo(hx+side*4*s+Math.cos(side>0?-1.25:1.9)*13*s,hy-6*s+Math.sin(side>0?-1.25:1.9)*13*s);c.lineTo(hx+side*4*s+Math.cos(side>0?1.25:4.4)*13*s,hy-6*s+Math.sin(side>0?1.25:4.4)*13*s);c.stroke();c.shadowBlur=0;}
    else{const ex=hx+Math.cos(ang)*len*s,ey=hy+Math.sin(ang)*len*s;const ca=Math.cos(ang),sa=Math.sin(ang);
    c.lineCap='round';if(leg||to===4){c.shadowColor=leg?'#ff9a3a':'#ffc060';c.shadowBlur=10*s;}
    if(ty==='sword'||ty==='dagger'){const bc=to===0?'#8a7462':to===4?'#ffd890':M.l;c.strokeStyle=bc;c.lineWidth=(ty==='dagger'?2.4:2.8+to*.25)*s;c.beginPath();c.moveTo(hx+ca*3*s,hy+sa*3*s);c.lineTo(ex,ey);c.stroke();
      c.strokeStyle=to>=3?M.t:'#6a5a4a';c.lineWidth=2*s;c.beginPath();c.moveTo(hx-sa*(4+to*.6)*s,hy+ca*(4+to*.6)*s);c.lineTo(hx+sa*(4+to*.6)*s,hy-ca*(4+to*.6)*s);c.stroke();}
    else{c.strokeStyle=ty==='staff'?(to>=3?'#3a2a40':'#7a5a3a'):'#5a3e24';c.lineWidth=(ty==='staff'?3:2.6)*s;c.beginPath();c.moveTo(hx-ca*4*s,hy-sa*4*s);c.lineTo(ex,ey);c.stroke();
      if(ty==='mace'){c.fillStyle=to===0?'#5a4030':M.m;c.beginPath();c.arc(ex,ey,(4+to*.5)*s,0,7);c.fill();if(to>=1){c.fillStyle=M.l;for(let k=0;k<6;k++){const a=k/6*6.28;c.beginPath();c.arc(ex+Math.cos(a)*(4+to*.5)*s,ey+Math.sin(a)*(4+to*.5)*s,1.2*s,0,7);c.fill();}}}
      if(ty==='axe'){c.fillStyle=to===0?'#8a7462':hg(c,ey-8*s,ey+8*s,M.l,M.m);c.beginPath();c.moveTo(ex-ca*2*s,ey-sa*2*s);c.arc(ex,ey,(6+to*.7)*s,ang+.5,ang+2.7);c.closePath();c.fill();if(to>=3){c.strokeStyle=M.t;c.lineWidth=1*s;c.stroke();}}
      if(ty==='staff'){c.fillStyle=GEMC[to];c.shadowColor=GEMC[to];c.shadowBlur=10*s;c.beginPath();c.arc(ex,ey,(2.5+to*.5)*s,0,7);c.fill();}}
    }c.shadowBlur=0;}
}

