'use strict';
/* Valgris à zéro de vie : il ne meurt pas, il plie et propose le défi */
/* Valgris à zéro de vie : il tombe, le héros croit avoir gagné, puis Valgris se relève sous sa vraie forme, immense */
const VFORMS={n:3,k:3,kw:[4.2,4,2.6,2.2,1.8,1.6,1.4],dmg:1.25,pause:3.4,lines:{1:'« Tu crois que c’est fini ? Regarde mieux. »',2:'« Encore debout ? Alors je vais cesser de jouer. »'},rise:{2:'Valgris se relève : forme 2 sur 3',3:'Valgris se relève : forme 3 sur 3'}};
/* Fausse mort entre deux formes : il s’effondre, silence, une réplique, puis il se relève dans la forme suivante */
function valgrisFall(m){const z=S.cur;m.hp=1;m.fake=VFORMS.pause;m.fallen=true;m.stun=VFORMS.pause;m.at=Math.max(m.at||0,2);m.vt=Math.max(m.vt||0,2);
  S.hz=[];S.proj=S.proj.filter(q=>q.from!=='m');if(z)z.shrink=null;p.inv=Math.max(p.inv||0,VFORMS.pause+.4);p.target=null;
  burst(m.x,m.y,'#e8e0cc',40);S.shake=.5;toast('Valgris s’effondre');const k=m.form||1;S.pend.push({t:1.4,fn:()=>{if(m.fake>0)say(VFORMS.lines[k]||VFORMS.lines[1]);}});}
function valgrisRise(m,z){const k=Math.min(m.formN||3,(m.form||1)+1);m.fake=0;m.fallen=false;m.stun=0;valgrisForm(m,k);m.form=k;m.hp=m.maxHp;m.aggro=true;
  for(let i=0;i<3;i++)burst(m.x+rnd(-1,1),m.y+rnd(-1,1),k===2?'#cfc8b8':'#ff6a3a',30);S.shake=Math.max(S.shake,.8);sfx('boom');toast(VFORMS.rise[k]||'Valgris se relève');}
const CINE_V=[[0,'fall'],[1.6,'hero'],[3.6,'dark'],[5.2,'pillars'],[6.4,'rise'],[11.5,'name1'],[15.5,'name2'],[19.5,'speak']];
const NOM_V=['Tu m’as vaincu. Mais ce n’est pas moi qui décide de la suite.','Mon créateur, le dieu Martin Laliberté, me dit de te donner un choix.'];
function valgrisBeaten(m){const z=S.cur,L=vrep();if(!m.beaten&&!m.echo){relicDrop(m,z,1);brWin();}m.beaten=true;m.hp=1;m.stun=1e9;z.shrink=null;S.hz=[];S.proj=[];
  for(const o of z.mons)if(o!==m&&!o.dead){o.dead=true;o.dt=0;o.hp=0;}
  p.target=null;p.path=null;p.inv=Math.max(p.inv||0,12);p.queued=null;
  burst(m.x,m.y,'#e8e0cc',60);S.shake=.5;sfx('lvl');m.fallen=true;toast(L.fall);S.cine={m,t:0,step:1};}
/* v5.91 : monde vivant. Ce qui se passe au loin : un dragon dont l’ombre glisse sur le sol, des chauves-souris, des corbeaux, des comètes,
   des éclairs sur les marais, une aurore sur le givre, des nappes de brouillard. Purement visuel, coupé en économie. */
const SKY={cendres:{band:'120,40,10',fly:'dragon',glow:'255,90,30'},givre:{band:'60,160,200',fly:'crows',aurora:true},marais:{band:'60,90,50',fly:'crows',storm:true},pre:{band:'180,180,200',fly:'crows'},
  fonte:{band:'160,90,20',fly:'dragon',glow:'255,170,60'},ossu:{band:'90,70,130',fly:'bats'},astre:{band:'200,180,120',fly:'comets'},
  foret:{band:'90,140,60',fly:'crows'},desert:{band:'255,200,120',fly:'crows',sun:true},volcan:{band:'200,60,10',fly:'dragon',glow:'255,90,20'},abime:{band:'150,20,10',fly:'bats',glow:'255,40,20'}};
function skyKey(z){return z.palTheme||curWorld().theme;}
/* v5.96 : météo par monde, en avant-plan : cendre qui tombe et braises qui montent, neige, pluie fine, poussière lumineuse. Les flocons suivent un peu la caméra (parallaxe). */
const WX={cendres:{k:'ash',n:40,ember:.35},givre:{k:'snow',n:55},marais:{k:'rain',n:60},pre:{k:'dust',n:26},fonte:{k:'ash',n:30,ember:.6},ossu:{k:'dust',n:30,col:'190,170,255'},astre:{k:'dust',n:34,col:'255,235,170'},foret:{k:'leaf',n:22},desert:{k:'dust',n:34,col:'240,210,150'},volcan:{k:'ash',n:40,ember:.6},abime:{k:'ash',n:30,ember:.5}};
function updWeather(dt,z,L){const X=WX[skyKey(z)];if(!X){L.wx=null;return;}const n=Math.round(X.n*(p.gfx===1?.5:1));if(!L.wx||L.wxK!==X.k){L.wx=[];L.wxK=X.k;L.wcx=S.cam.x;L.wcy=S.cam.y;}
  const dcx=S.cam.x-L.wcx,dcy=S.cam.y-L.wcy;L.wcx=S.cam.x;L.wcy=S.cam.y;const jump=Math.abs(dcx)+Math.abs(dcy)>200;
  while(L.wx.length<n){const e=X.ember&&Math.random()<X.ember;L.wx.push({x:rnd(0,W),y:rnd(0,H),d:rnd(.4,1),e,ph:rnd(0,6)});}
  if(L.wx.length>n)L.wx.length=n;
  for(const q of L.wx){if(!jump){q.x-=dcx*q.d*.35;q.y-=dcy*q.d*.35;}q.ph+=dt;
    if(q.e){q.y-=(18+q.d*20)*dt;q.x+=Math.sin(q.ph*2)*10*dt;}
    else if(X.k==='snow'){q.y+=(22+q.d*30)*dt;q.x+=(Math.sin(q.ph*1.3)*14+8)*dt;}
    else if(X.k==='rain'){q.y+=(380+q.d*260)*dt;q.x-=60*dt;}
    else if(X.k==='ash'){q.y+=(14+q.d*16)*dt;q.x+=(Math.sin(q.ph)*12-5)*dt;}
    else if(X.k==='leaf'){q.y+=(16+q.d*14)*dt;q.x+=Math.sin(q.ph*1.5)*20*dt;}
    else{q.y+=Math.sin(q.ph*.7)*6*dt;q.x+=Math.cos(q.ph*.5)*6*dt;}
    if(q.y>H+10)q.y-=H+20;else if(q.y<-10)q.y+=H+20;if(q.x>W+10)q.x-=W+20;else if(q.x<-10)q.x+=W+20;}}
function inPuddle(z,x,y){if(!z.puddles)return null;for(const q of z.puddles)if(((x-q.x)**2+(y-q.y)**2/(q.e*q.e))<q.r*q.r)return q;return null;}
const GRASS={cendres:{k:'thorn',c:['#4a3a2a','#2a2018']},givre:{k:'frost',c:['#c8dcec','#7a9ab4']},marais:{k:'reed',c:['#6a7a3a','#3a4a1a']},pre:{k:'grass',c:['#9a9a72','#5a5a3a']},fonte:{k:'thorn',c:['#5a3a20','#2a180c']},ossu:{k:'grass',c:['#6a6080','#3a3448']},astre:{k:'crystal',c:['#fff0c0','#c8a860']},foret:{k:'grass',c:['#6a9a3a','#2e5a1e']},desert:{k:'thorn',c:['#a89060','#6a5030']},volcan:{k:'thorn',c:['#3a2a22','#1a100c']},abime:{k:'thorn',c:['#5a2020','#2a0a0a']}};
function drawGrass(z){if(!z.grass||!z.grass.length||p.eco)return;const G=GRASS[skyKey(z)];if(!G)return;const s=Z,few=p.gfx===1;
  for(let gi=0;gi<z.grass.length;gi++){if(few&&gi%2)continue;const q=z.grass[gi];const[sx,sy]=scr(q.x,q.y);if(sx<-30||sx>W+30||sy<-10||sy>H+50)continue;
    const dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy),push=d<1.1?(1.1-d)/1.1:0,dir=((dx-dy)>=0?1:-1),tgt=push*dir;q.b+=(tgt-q.b)*.2;if(push>.5&&!q.rs){q.rs=1;if(Math.random()<.5)S.parts.push({x:q.x,y:q.y,z:.3,vx:rnd(-.8,.8),vy:rnd(-.8,.8),vz:rnd(.5,1.5),life:.4,col:G.c[0]});}else if(push<.1)q.rs=0;
    const wind=Math.sin(S.t*1.6+q.x*.7+q.y*.3)*.18,bend=wind+q.b*1.1;
    if(G.k==='crystal'){for(let j=0;j<3;j++){const ox=(j-1)*3*s,h=(7+((q.ph*10+j*3)%5))*q.h*s;ctx.fillStyle=j===1?G.c[0]:G.c[1];ctx.beginPath();ctx.moveTo(sx+ox-1.6*s,sy);ctx.lineTo(sx+ox+(j-1)*2*s,sy-h);ctx.lineTo(sx+ox+1.6*s,sy);ctx.fill();}const a=.4+.4*Math.sin(S.t*3+q.ph);ctx.fillStyle=`rgba(255,250,220,${a.toFixed(2)})`;ctx.fillRect(sx-.6*s,sy-8*q.h*s,1.2*s,1.2*s);continue;}
    if(G.k==='frost'){ctx.strokeStyle=G.c[0];ctx.lineWidth=1*s;ctx.beginPath();for(let j=0;j<q.n;j++){const a=-Math.PI/2+(j-(q.n-1)/2)*.35+bend*.5,l=(4+j%3*2)*q.h*s;ctx.moveTo(sx,sy);ctx.lineTo(sx+Math.cos(a)*l,sy+Math.sin(a)*l);}ctx.stroke();ctx.fillStyle='rgba(240,250,255,.8)';ctx.fillRect(sx-.7*s,sy-7*q.h*s,1.4*s,1.4*s);continue;}
    ctx.strokeStyle=G.c[1];ctx.lineWidth=(G.k==='reed'?1.5:1.1)*s;ctx.beginPath();
    for(let j=0;j<q.n;j++){const bx=sx+(j-(q.n-1)/2)*1.6*s,h=(G.k==='reed'?14:G.k==='thorn'?8:9)*q.h*s*(.75+((j*37+q.ph*10)%10)/40),lean=(j-(q.n-1)/2)*.12+bend;ctx.moveTo(bx,sy);ctx.quadraticCurveTo(bx+lean*h*.4,sy-h*.6,bx+lean*h,sy-h*Math.cos(Math.min(1.2,Math.abs(lean))));}
    ctx.stroke();ctx.strokeStyle=G.c[0];ctx.lineWidth=.8*s;ctx.beginPath();for(let j=0;j<q.n;j+=2){const bx=sx+(j-(q.n-1)/2)*1.6*s,h=(G.k==='reed'?12:7)*q.h*s,lean=bend;ctx.moveTo(bx,sy-h*.2);ctx.quadraticCurveTo(bx+lean*h*.3,sy-h*.6,bx+lean*h*.9,sy-h*.95);}ctx.stroke();
    if(G.k==='reed'){ctx.fillStyle='#5a3a1a';for(let j=0;j<q.n;j+=3){const bx=sx+(j-(q.n-1)/2)*1.6*s,h=14*q.h*s;ctx.fillRect(bx+bend*h-1*s,sy-h-3*s,2*s,4*s);}}
    if(G.k==='thorn'&&q.n>5){ctx.fillStyle='rgba(120,30,20,.8)';ctx.fillRect(sx+2*s,sy-5*s,1.4*s,1.4*s);}}}
function drawPuddles(z){if(!z.puddles||!z.puddles.length)return;const hw=TW/2*Z,hh=TH/2*Z,K=skyOf(z);
  for(const q of z.puddles){const[sx,sy]=scr(q.x,q.y);if(sx<-80||sx>W+80||sy<-60||sy>H+60)continue;const rx=q.r*hw*1.3,ry=q.r*q.e*hh*1.3;
    ctx.fillStyle=q.ice?'rgba(150,190,220,.35)':'rgba(14,18,22,.55)';ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.fill();
    if(p.eco)continue;const g=ctx.createLinearGradient(sx-rx,sy-ry,sx+rx,sy+ry);g.addColorStop(0,`rgba(${q.ice?'230,245,255':K.band},${q.ice?.45:.28})`);g.addColorStop(.5,'rgba(255,255,255,0)');g.addColorStop(1,`rgba(${q.ice?'200,230,255':K.band},.12)`);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(sx,sy,rx*.92,ry*.85,0,0,7);ctx.fill();
    ctx.strokeStyle=q.ice?'rgba(240,250,255,.55)':'rgba(200,210,220,.18)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,Math.PI*1.1,Math.PI*1.6);ctx.stroke();
    if(q.ice){const a=.5+.5*Math.sin(S.t*2+q.x*3);ctx.fillStyle=`rgba(255,255,255,${(.5*a).toFixed(2)})`;ctx.fillRect(sx-rx*.3,sy-ry*.3,2*Z,2*Z);}}
  const L=z.wl;if(L&&L.rip)for(const r of L.rip){const[sx,sy]=scr(r.x,r.y),k=r.t/r.m;ctx.strokeStyle=`rgba(210,220,230,${(.5*(1-k)).toFixed(2)})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(sx,sy,(2+k*12*r.s)*Z,(1+k*6*r.s)*Z,0,0,7);ctx.stroke();}}
function updPuddles(dt,z,L){if(!z.puddles||!z.puddles.length)return;L.rip=L.rip||[];const rain=skyKey(z)==='marais';
  if(rain&&Math.random()<dt*10){const q=pick(z.puddles);if(!q.ice&&Math.abs(q.x-p.x)+Math.abs(q.y-p.y)<14){const a=rnd(0,6.28),d=rnd(0,q.r*.7);L.rip.push({x:q.x+Math.cos(a)*d,y:q.y+Math.sin(a)*d*q.e,t:0,m:.8,s:.5});}}
  if(p.moving){const q=inPuddle(z,p.x,p.y);if(q){p.splT=(p.splT||0)-dt;if(p.splT<=0){p.splT=.28;if(!q.ice){L.rip.push({x:p.x,y:p.y,t:0,m:1,s:1});for(let k=0;k<5;k++)S.parts.push({x:p.x,y:p.y,z:.05,vx:rnd(-1.2,1.2),vy:rnd(-1.2,1.2),vz:rnd(1.5,3),life:.35,col:'rgba(190,205,215,.8)'});}else for(let k=0;k<2;k++)S.parts.push({x:p.x,y:p.y,z:.05,vx:rnd(-.6,.6),vy:rnd(-.6,.6),vz:rnd(.5,1),life:.3,col:'#e8f4ff'});}}}
  for(const r of L.rip)r.t+=dt;L.rip=L.rip.filter(r=>r.t<r.m);if(L.rip.length>30)L.rip.splice(0,L.rip.length-30);}
function drawShafts(z){if(!z.shafts||!z.shafts.length||p.eco)return;const hw=TW/2*Z,hh=TH/2*Z,col=skyKey(z)==='givre'?'200,225,255':skyKey(z)==='astre'||skyKey(z)==='desert'?'255,240,190':skyKey(z)==='foret'?'220,245,170':'235,225,200';
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const q of z.shafts){const[sx,sy]=scr(q.x,q.y);if(sx<-150||sx>W+150||sy<-40||sy>H+300)continue;const fl=.8+.2*Math.sin(S.t*.7+q.ph),bw=q.w*hw*.9,tx=sx-70*Z,ty=sy-300*Z;
    const g=ctx.createLinearGradient(tx,ty,sx,sy);g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(1,`rgba(${col},${(.13*fl).toFixed(3)})`);ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(tx-bw*.35,ty);ctx.lineTo(tx+bw*.35,ty);ctx.lineTo(sx+bw,sy);ctx.lineTo(sx-bw,sy);ctx.closePath();ctx.fill();
    const pg=ctx.createRadialGradient(sx,sy,0,sx,sy,bw*1.2);pg.addColorStop(0,`rgba(${col},${(.18*fl).toFixed(3)})`);pg.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=pg;ctx.beginPath();ctx.ellipse(sx,sy,bw*1.2,bw*.6,0,0,7);ctx.fill();
    if(p.gfx!==1){ctx.fillStyle=`rgba(${col},.55)`;for(let k=0;k<7;k++){const u=((S.t*.05+k*.137+q.ph)%1),x=sx+(tx-sx)*u+Math.sin(S.t*.8+k*2)*bw*.5*(1-u*.6),y=sy+(ty-sy)*u;ctx.fillRect(x,y,1.4,1.4);}}}
  ctx.restore();}
function drawWeather(z){const L=z.wl;if(!L||!L.wx||p.eco)return;const X=WX[skyKey(z)];if(!X)return;
  if(X.k==='rain'){ctx.strokeStyle='rgba(170,190,210,.28)';ctx.lineWidth=1;ctx.beginPath();for(const q of L.wx){ctx.moveTo(q.x,q.y);ctx.lineTo(q.x-3*q.d,q.y+12*q.d);}ctx.stroke();return;}
  for(const q of L.wx){if(q.e){const a=.5+.4*Math.sin(q.ph*5);ctx.fillStyle=`rgba(255,${150+((q.ph*40)|0)%60},60,${(a*q.d).toFixed(2)})`;ctx.fillRect(q.x,q.y,2*q.d+.6,2*q.d+.6);continue;}
    if(X.k==='snow'){ctx.fillStyle=`rgba(235,242,255,${(.35+.5*q.d).toFixed(2)})`;const r=1+q.d*1.8;ctx.fillRect(q.x-r/2,q.y-r/2,r,r);}
    else if(X.k==='ash'){ctx.fillStyle=`rgba(${q.d>.7?'190,180,170':'110,100,95'},${(.3+.4*q.d).toFixed(2)})`;ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.ph);ctx.fillRect(-1.5*q.d,-.7,3*q.d,1.4);ctx.restore();}
    else if(X.k==='leaf'){ctx.fillStyle=q.d>.75?'rgba(200,140,50,.75)':q.d>.5?'rgba(120,150,50,.7)':'rgba(70,110,40,.6)';ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.ph*2);ctx.beginPath();ctx.ellipse(0,0,3*q.d+1,1.3*q.d+.5,0,0,7);ctx.fill();ctx.restore();}
    else{const a=(.15+.35*q.d)*(.6+.4*Math.sin(q.ph*2));ctx.fillStyle=`rgba(${X.col||'230,225,210'},${a.toFixed(2)})`;ctx.fillRect(q.x,q.y,1.6*q.d+.5,1.6*q.d+.5);}}}
/* v5.98 : petites bêtes. Elles vivent à côté du combat et détalent quand le héros approche. */
const CRIT={cendres:['rat','rat','moth'],givre:['hare','hare'],marais:['fly','fly','frog'],pre:['moth','hare','rat'],fonte:['lizard','lizard','rat'],ossu:['rat','rat','fly'],astre:['fly','fly','lizard'],foret:['hare','hare','moth','fly'],desert:['lizard','lizard'],volcan:['lizard','lizard'],abime:['rat','rat']};
function updCritters(dt,z,L){const C=CRIT[skyKey(z)];if(!C)return;const cr=L.cr||(L.cr=[]),n=p.gfx===1?3:6;
  if(cr.length<n&&Math.random()<dt*3)for(let t=0;t<6;t++){const a=rnd(0,6.28),d=rnd(3.5,8.5),x=p.x+Math.cos(a)*d,y=p.y+Math.sin(a)*d;if(!isWall(z,Math.floor(x),Math.floor(y))){const k=pick(C);cr.push({k,x,y,h:k==='fly'||k==='moth'?rnd(.6,1.2):0,ph:rnd(0,6),vx:0,vy:0,t:rnd(.5,2),fl:0,face:1});break;}}
  for(const c of cr){c.ph+=dt;const d=Math.hypot(c.x-p.x,c.y-p.y);
    if(c.k==='fly'||c.k==='moth'){c.x+=Math.cos(c.ph*.9+c.h*7)*.6*dt;c.y+=Math.sin(c.ph*1.1)*.6*dt;if(d<2){c.x+=(c.x-p.x)/d*2.5*dt;c.y+=(c.y-p.y)/d*2.5*dt;}continue;}
    if(d<2.8&&!c.fl){c.fl=1.2;const l=d||1;c.vx=(c.x-p.x)/l*(c.k==='hare'?6:c.k==='lizard'?5.5:4.5);c.vy=(c.y-p.y)/l*(c.k==='hare'?6:4.5);if(c.k==='frog')c.hop=.4;}
    if(c.fl>0){c.fl-=dt;const nx=c.x+c.vx*dt,ny=c.y+c.vy*dt;if(!isWall(z,Math.floor(nx),Math.floor(c.y)))c.x=nx;else c.vx*=-1;if(!isWall(z,Math.floor(c.x),Math.floor(ny)))c.y=ny;else c.vy*=-1;if(c.fl<=0)c.fl=0;}
    else{c.t-=dt;if(c.t<=0){c.t=rnd(.8,2.5);const a=rnd(0,6.28);c.vx=Math.cos(a)*.6;c.vy=Math.sin(a)*.6;c.mv=rnd(.2,.6);}if(c.mv>0){c.mv-=dt;const nx=c.x+c.vx*dt,ny=c.y+c.vy*dt;if(!isWall(z,Math.floor(nx),Math.floor(ny))){c.x=nx;c.y=ny;}}}
    if(c.vx)c.face=c.vx-c.vy>0?1:-1;}
  L.cr=cr.filter(c=>Math.hypot(c.x-p.x,c.y-p.y)<12);}
function drawCritters(z){const L=z.wl;if(!L||!L.cr||p.eco)return;const s=Z*1.4;
  for(const c of L.cr){const[sx,sy0]=scr(c.x,c.y);if(sx<-20||sx>W+20||sy0<-20||sy0>H+20)continue;const run=c.fl>0||c.mv>0,b=run?Math.abs(Math.sin(c.ph*22))*1.5*s:0,f=c.face;
    if(c.k==='fly'){const sy=sy0-c.h*TH*Z-Math.sin(c.ph*3)*4*s,a=.45+.45*Math.sin(c.ph*4+c.h*9);ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy,0,sx,sy,6*s);const col=skyKey(z)==='astre'?'255,230,150':'190,255,120';g.addColorStop(0,`rgba(${col},${a.toFixed(2)})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(sx-6*s,sy-6*s,12*s,12*s);ctx.restore();continue;}
    if(c.k==='moth'){const sy=sy0-c.h*TH*Z-Math.sin(c.ph*2)*3*s,w_=Math.abs(Math.sin(c.ph*18))*3*s+1;ctx.fillStyle='rgba(200,190,170,.75)';ctx.fillRect(sx-w_,sy-1*s,w_*2,1.6*s);continue;}
    ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(sx,sy0,4*s,1.6*s,0,0,7);ctx.fill();const sy=sy0-b-(c.k==='frog'&&run?Math.abs(Math.sin(c.ph*8))*5*s:0);
    if(c.k==='rat'){ctx.fillStyle='#3e3630';ctx.beginPath();ctx.ellipse(sx,sy-2*s,3.6*s,2*s,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(sx+3.4*s*f,sy-2.6*s,1.6*s,1.2*s,0,0,7);ctx.fill();ctx.strokeStyle='#6a5a50';ctx.lineWidth=.8*s;ctx.beginPath();ctx.moveTo(sx-3.4*s*f,sy-1.6*s);ctx.quadraticCurveTo(sx-6*s*f,sy-1*s+Math.sin(c.ph*6)*s,sx-7.5*s*f,sy-2.5*s);ctx.stroke();}
    else if(c.k==='hare'){ctx.fillStyle='#e8ecf0';ctx.beginPath();ctx.ellipse(sx,sy-2.6*s,3.4*s,2.4*s,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(sx+2.8*s*f,sy-4.4*s,1.6*s,1.4*s,0,0,7);ctx.fill();ctx.fillStyle='#c8ccd4';ctx.fillRect(sx+2.4*s*f-.5*s,sy-8.4*s,1*s,3.6*s);ctx.fillStyle='#202020';ctx.fillRect(sx+3.6*s*f-.4*s,sy-4.8*s,.8*s,.8*s);}
    else if(c.k==='lizard'){ctx.fillStyle=skyKey(z)==='astre'?'#c8b070':'#8a4a20';ctx.beginPath();ctx.ellipse(sx,sy-1*s,3.4*s,1.2*s,0,0,7);ctx.fill();ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=1*s;ctx.beginPath();ctx.moveTo(sx-3*s*f,sy-1*s);ctx.lineTo(sx-7*s*f,sy-.4*s+Math.sin(c.ph*10)*s);ctx.stroke();ctx.fillStyle='#ffb040';ctx.fillRect(sx+2.6*s*f,sy-1.6*s,.8*s,.8*s);}
    else if(c.k==='frog'){ctx.fillStyle='#4a6a2a';ctx.beginPath();ctx.ellipse(sx,sy-1.6*s,2.6*s,1.8*s,0,0,7);ctx.fill();ctx.fillStyle='#d8e0a0';ctx.fillRect(sx+1*s*f,sy-3.2*s,.9*s,.9*s);}}}
function updWorldLife(dt,z){if(p.eco||z.id==='town')return;const K=skyOf(z),L=z.wl||(z.wl={fl:[],ft:rnd(4,10),st:rnd(15,30),flash:0,fog:[]});updWeather(dt,z,L);updCritters(dt,z,L);updPuddles(dt,z,L);
  L.ft-=dt;if(L.ft<=0){L.ft=rnd(14,26);const dir=Math.random()<.5?1:-1;
    if(K.fly==='dragon')L.fl.push({k:'dragon',x:p.x-dir*16,y:p.y+rnd(-6,6),vx:dir*rnd(5,6.5),vy:rnd(-.8,.8),t:7,ph:0});
    /* v6.09 : oiseaux et chauves-souris volent dans le monde (ils défilent avec la carte) ; les comètes tombent derrière les bords de la carte */
    else if(K.fly==='bats'||K.fly==='crows'){const n=ri(4,8),sp=rnd(2.6,3.6),u=rnd(-7,-3),bx=p.x-dir*10+u,by=p.y+dir*10+u,h=rnd(3.5,6);for(let k=0;k<n;k++)L.fl.push({k:K.fly,x:bx-dir*k*.45+rnd(-.3,.3),y:by+dir*k*.45+rnd(-.3,.3),vx:dir*sp,vy:-dir*sp,h:h+rnd(-.5,.5),t:11,ph:rnd(0,6)});}
    else if(K.fly==='comets'){const A=skyAnchors(z).top,a=A[Math.floor(Math.random()*A.length)];L.fl.push({k:'comet',ax:a[0],ay:a[1],ox:rnd(-W*.4,W*.4),oy:-H*.3,vx:rnd(-120,-60),vy:rnd(90,140),t:4});}
    if(K.fly==='dragon'&&AC&&!p.mute)try{noise(1.6,'lowpass',260,.12,60);tone(70,1.4,'sawtooth',.04,45);}catch(e){}}
  for(const f of L.fl){f.t-=dt;f.ph=(f.ph||0)+dt;if(f.k==='comet'){f.ox+=f.vx*dt;f.oy+=f.vy*dt;}else{f.x+=f.vx*dt;f.y+=f.vy*dt;}}L.fl=L.fl.filter(f=>f.t>0);
  if(K.storm){L.st-=dt;if(L.st<=0){L.st=rnd(18,40);L.flash=.35;if(AC&&!p.mute)try{noise(2.2,'lowpass',400,.18,50,.4);}catch(e){}}L.flash=Math.max(0,L.flash-dt);}
  if(p.gfx!==1){while(L.fog.length<5)L.fog.push({x:p.x+rnd(-9,9),y:p.y+rnd(-9,9),r:rnd(2.5,4.5),vx:rnd(.1,.35),a:rnd(.04,.09),t:rnd(10,20)});for(const g of L.fog){g.x+=g.vx*dt;g.t-=dt;}L.fog=L.fog.filter(g=>g.t>0&&Math.abs(g.x-p.x)<14&&Math.abs(g.y-p.y)<14);}}
function drawWorldLifeGround(z){const L=z.wl;if(!L||p.eco)return;
  for(const f of L.fl)if(f.k==='dragon'){const[sx,sy]=scr(f.x,f.y),a=Math.min(1,f.t,(7-f.t))*.55,s=Z*1.8,fl=Math.sin(f.ph*4)*.35;ctx.save();ctx.translate(sx,sy);ctx.rotate(Math.atan2(f.vy*.5,f.vx)+(f.vx<0?Math.PI:0));ctx.scale(f.vx<0?-1:1,.5);ctx.fillStyle=`rgba(0,0,0,${a.toFixed(2)})`;
    ctx.beginPath();ctx.ellipse(0,0,40*s,8*s,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-10*s,0);ctx.quadraticCurveTo(0,-70*s*(1+fl),20*s,-60*s*(1+fl));ctx.lineTo(10*s,0);ctx.moveTo(-10*s,0);ctx.quadraticCurveTo(0,70*s*(1+fl),20*s,60*s*(1+fl));ctx.lineTo(10*s,0);ctx.fill();
    ctx.beginPath();ctx.moveTo(-40*s,0);ctx.lineTo(-75*s,6*s);ctx.lineTo(-40*s,3*s);ctx.fill();ctx.restore();}
  if(L.fog.length&&p.gfx!==1)for(const g of L.fog){const[sx,sy]=scr(g.x,g.y),r=g.r*TW*Z*.6,al=g.a*Math.min(1,g.t/2);const gr=ctx.createRadialGradient(sx,sy,0,sx,sy,r);gr.addColorStop(0,`rgba(200,200,205,${al.toFixed(3)})`);gr.addColorStop(1,'rgba(200,200,205,0)');ctx.fillStyle=gr;ctx.save();ctx.translate(sx,sy);ctx.scale(1,.5);ctx.translate(-sx,-sy);ctx.beginPath();ctx.arc(sx,sy,r,0,7);ctx.fill();ctx.restore();}}
/* v6.09 : le ciel est accroché à la carte. L’aurore et les comètes vivent derrière les bords du haut, les flammes lointaines derrière les bords du bas ;
   elles défilent plus lentement que le sol (profondeur), et on ne les voit que près de ces bords. */
const PARA=.55;
function skyAnchors(z){if(z.sky)return z.sky;const w=z.w,h=z.h;return z.sky={top:[[w*.22,-6],[w*.62,-6],[-6,h*.28],[-6,h*.7]],bottom:[[w+6,h*.3],[w+6,h*.72],[w*.3,h+6],[w*.74,h+6]]};}
function paraPt(wx,wy){const q=iso(wx,wy);return[W/2+(q[0]-S.cam.x)*PARA+SHX*.5,H/2+(q[1]-S.cam.y)*PARA+SHY*.5];}
function drawWorldLifeSky(z){if(p.eco||z.id==='town')return;const K=skyOf(z),L=z.wl,A=skyAnchors(z);
  const g=ctx.createLinearGradient(0,0,0,H*.3);g.addColorStop(0,`rgba(${K.band},.16)`);g.addColorStop(1,`rgba(${K.band},0)`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H*.3);
  if(false&&K.sun){const cx=W*.6,cy=H*.2,R=Math.min(W,H)*.08;ctx.save();ctx.globalCompositeOperation='lighter';const g2=ctx.createRadialGradient(cx,cy,R*.6,cx,cy,R*4.5);g2.addColorStop(0,'rgba(255,240,200,.45)');g2.addColorStop(.3,'rgba(255,200,120,.16)');g2.addColorStop(1,'rgba(255,180,100,0)');ctx.fillStyle=g2;ctx.fillRect(cx-R*4.5,cy-R*4.5,R*9,R*9);
    const d2=ctx.createRadialGradient(cx,cy,0,cx,cy,R);d2.addColorStop(0,'rgba(255,252,236,.95)');d2.addColorStop(.8,'rgba(255,236,170,.9)');d2.addColorStop(1,'rgba(255,210,120,0)');ctx.fillStyle=d2;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.fill();ctx.restore();}
  if(K.glow){for(const a of A.bottom){const P=paraPt(a[0],a[1]),by=P[1]+H*.32;if(by<H*.55||by>H*1.5||P[0]<-W*.8||P[0]>W*1.8)continue;
      const gb=ctx.createLinearGradient(0,by,0,by-H*.25);gb.addColorStop(0,`rgba(${K.glow},${(.1+Math.sin(S.t*.7)*.04).toFixed(3)})`);gb.addColorStop(1,`rgba(${K.glow},0)`);ctx.fillStyle=gb;ctx.fillRect(P[0]-W*.7,by-H*.25,W*1.4,H*.25);
      if(p.gfx!==1){ctx.save();ctx.globalCompositeOperation='lighter';for(let k=0;k<6;k++){const x=P[0]-W*.45+k*W*.18+((a[0]*7+k*37)%30),h_=(30+(k*29)%34)*(1+.3*Math.sin(S.t*(2.1+k*.37)+k*1.7)),w_=16+(k*13)%18,tx=x+Math.sin(S.t*2.6+k)*6;
        const fg=ctx.createLinearGradient(0,by,0,by-h_);fg.addColorStop(0,`rgba(${K.glow},.2)`);fg.addColorStop(1,`rgba(${K.glow},0)`);ctx.fillStyle=fg;ctx.beginPath();ctx.moveTo(x-w_,by);ctx.bezierCurveTo(x-w_,by-h_*.45,tx-w_*.2,by-h_*.7,tx,by-h_);ctx.bezierCurveTo(tx+w_*.25,by-h_*.6,x+w_,by-h_*.4,x+w_,by);ctx.fill();}ctx.restore();}}}
  if(K.aurora){ctx.save();ctx.globalCompositeOperation='lighter';for(const a of A.top){const P=paraPt(a[0],a[1]),ay=P[1]-H*.3;if(ay<-H*.4||ay>H*.45||P[0]<-W*.8||P[0]>W*1.8)continue;
      for(let k=0;k<3;k++){ctx.strokeStyle=`rgba(${['90,255,180','120,180,255','200,120,255'][k]},.07)`;ctx.lineWidth=18+k*6;ctx.beginPath();for(let x=-W*.55;x<=W*.55;x+=20){const y=ay+k*H*.05+Math.sin((x+a[0]*40)*.01+S.t*(.3+k*.1)+k)*14;x>-W*.55?ctx.lineTo(P[0]+x,y):ctx.moveTo(P[0]+x,y);}ctx.stroke();}}ctx.restore();}
  drawWeather(z);
  if(!L)return;
  for(const f of L.fl){if(f.k==='bats'||f.k==='crows'){const[bx,by]=scr(f.x,f.y),sy=by-f.h*20*Z+Math.sin(f.ph*3)*2;if(bx<-30||bx>W+30||sy<-30||sy>H+30)continue;const fl=Math.sin(f.ph*(f.k==='bats'?16:9))*5;ctx.strokeStyle=f.k==='bats'?'rgba(10,6,12,.9)':'rgba(16,14,14,.85)';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(bx-7,sy-fl);ctx.lineTo(bx,sy);ctx.lineTo(bx+7,sy-fl);ctx.stroke();}
    else if(f.k==='comet'){const P=paraPt(f.ax,f.ay),cx=P[0]+f.ox,cy=P[1]-H*.3+f.oy;if(cx<-60||cx>W+60||cy<-60||cy>H)continue;ctx.save();ctx.globalCompositeOperation='lighter';const tl=ctx.createLinearGradient(cx,cy,cx-f.vx*.4,cy-f.vy*.4);tl.addColorStop(0,'rgba(255,250,230,.9)');tl.addColorStop(1,'rgba(255,220,160,0)');ctx.strokeStyle=tl;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx-f.vx*.4,cy-f.vy*.4);ctx.stroke();ctx.restore();}}
  if(L.flash>0){ctx.fillStyle=`rgba(220,230,255,${(L.flash*.6).toFixed(2)})`;ctx.fillRect(0,0,W,H);}}
/* v6.13 : les paroles de la fin sont écrites par-dessus tout (barre du bas, noms d’objets, chiffres), en entier, au milieu de l’écran */
function cineText(t,a){const el=document.getElementById('cinetxt');if(!el)return;if(!t){el.style.opacity=0;document.body.classList.remove('cine');return;}if(el.dataset.t!==t){el.dataset.t=t;el.textContent=t;}el.style.opacity=(a==null?1:a).toFixed(2);document.body.classList.add('cine');}
function drawCine(C){const m=C.m,[sx,sy]=scr(m.x,m.y);
  if(C.dark!=null){ctx.fillStyle=`rgba(0,0,0,${(C.dark*.55).toFixed(2)})`;ctx.fillRect(0,0,W,H);}
  if(C.pill!=null){ctx.save();ctx.globalCompositeOperation='lighter';for(let k=0;k<7;k++){const a=k/7*6.28+C.pill*.3,r=(60+C.pill*18)*Z,x=sx+Math.cos(a)*r,w=(6+Math.sin(C.pill*3+k)*3)*Z,al=Math.min(.5,C.pill*.25);
      const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgba(255,246,220,0)`);g.addColorStop(.5,`rgba(255,240,200,${al.toFixed(2)})`);g.addColorStop(1,`rgba(255,200,140,0)`);ctx.fillStyle=g;ctx.fillRect(x-w,0,2*w,H);}ctx.restore();}
  const bar=Math.min(1,(C.t)/1.2)*H*.11;ctx.fillStyle='#000';ctx.fillRect(0,0,W,bar);ctx.fillRect(0,H-bar,W,bar);
  if(C.text&&false){const T=C.text,a=0;if(a>0){ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';const fs=Math.min(30,W/18);
      ctx.font=`700 ${fs}px "Cinzel","Alegreya Sans",serif`;ctx.shadowColor='#ffb060';ctx.shadowBlur=18*a;ctx.fillStyle=`rgba(255,244,220,${a.toFixed(2)})`;
      const words=T.s.split(' '),lines=[];let cur='';for(const w of words){const t=cur?cur+' '+w:w;if(ctx.measureText(t).width>W*.86&&cur){lines.push(cur);cur=w;}else cur=t;}lines.push(cur);
      lines.forEach((l,i)=>ctx.fillText(l,W/2,H*.78+(i-(lines.length-1)/2)*fs*1.25));ctx.restore();}}}
function updCine(dt){const C=S.cine,m=C.m,L=vrep();C.t+=dt;p.inv=Math.max(p.inv||0,2);
  while(C.step<CINE_V.length&&C.t>=CINE_V[C.step][0]){const k=CINE_V[C.step][1];C.step++;
    if(k==='hero')say(L.hero);
    if(k==='dark'){C.dark=0;say('Le silence tombe. Les cendres cessent de voler.');sfx('portal');}
    if(k==='pillars'){C.pill=0;S.shake=.6;sfx('boom');}
    if(k==='rise'){m.fallen=false;m.divine=0;S.shake=1.2;sfx('boom');setTimeout(()=>sfx('boom'),400);say(L.rise);toast('Valgris se relève');burst(m.x,m.y,'#4a4440',120);}
    if(k==='name1'){C.text={t:0,s:NOM_V[0]};sfx('leg');S.shake=.4;}
    if(k==='name2'){C.text={t:0,s:NOM_V[1]};sfx('leg');S.shake=.6;}
    if(k==='speak'){S.cine=null;cineText(null);S.vpend=m;openValgrisChoice();return;}}
  if(C.text){const T=C.text,a=Math.min(1,T.t/.8)*(T.t>3.4?Math.max(0,1-(T.t-3.4)/.6):1);cineText(T.s,a);}
  if(C.dark!=null)C.dark=Math.min(1,C.dark+dt*.6);if(C.pill!=null)C.pill+=dt;if(C.text)C.text.t+=dt;
  if(m.divine!=null){m.divine=Math.min(1,m.divine+dt/5);m.size=2.3+3.2*m.divine;S.shake=Math.max(S.shake,.25*(1-m.divine)+.08);
    if(Math.random()<dt*30)S.parts.push({x:m.x+rnd(-2.5,2.5),y:m.y+rnd(-2.5,2.5),z:.2,vx:0,vy:0,vz:rnd(2,5),life:rnd(.6,1.4),col:Math.random()<.5?'#8a8278':'#f4ecd8'});}}
function openValgrisChoice(){const L=vrep();
  openPanel(`<h2>Valgris</h2>${L.ascend.map(t=>`<p class="say">${t}</p>`).join('')}
  ${WORLDS[S.world+1]?`<button data-a="vdefi">Accepter le défi</button>`:`<button data-a="vdefi" disabled title="Le monde suivant arrive dans une prochaine version" style="opacity:.5">Accepter le défi (bientôt)</button>`}<button data-a="vpas">Pas encore</button>
  <p class="st">${WORLDS[S.world+1]?`« Accepter le défi » : tu pars pour le monde ${S.world+1}, ${worldName(S.world+1)}. Ton héros, ton sac, ton coffre et tes failles te suivent, et son gros butin t’y attend. Les monstres y sont bien plus durs. Tu pourras revenir ici par la pierre de faille.`:'Le monde suivant arrive dans une prochaine version.'} « Pas encore » : Valgris laisse son butin, remonte dans les cendres et t’attend pour la revanche.</p>`);}
function valgrisAccept(){const m=S.vpend,z=S.cur;if(!m||!WORLDS[S.world+1])return;S.vpend=null;closePanel();const B=BOSSES.valgris,from=S.world;
  gainXp(m.xp);z.mons=z.mons.filter(o=>o!==m);const q=S.q[B.quest];if(q&&q.s<3)q.s=3;p.inv=0;
  for(let k=0;k<6;k++)burst(m.x+rnd(-2,2),m.y+rnd(-2,2),'#f4ecd8',30);S.shake=.8;sfx('portal');
  S.pend.push({t:1.2,fn:()=>{setWorld(from+1);const L=vrep();const lv=zoneDef(zid(1,0)).lvl+2;
    for(const[r,n]of[[3,1],[2,3]])for(let i=0;i<n;i++)dropAt(S.cur,p.x+rnd(-1,1),p.y+rnd(-1,1),{kind:'item',it:genItem(lv,r,p.st.mf+300)});
    dropAt(S.cur,p.x,p.y,{kind:'gold',v:Math.round(600*(1+.3*(lv-1)))});rollUnique('valgris',p.x,p.y,lv);
    toast(`Monde ${S.world} : ${worldName(S.world)}`);if(L.arrive)S.pend.push({t:2.4,fn:()=>say(L.arrive)});
    S.pend.push({t:5,fn:()=>say(`Son butin t’attend à tes pieds. Parle à ${npcA('corvel').replace(/<\/?b>/g,'')}.`)});save();}});}
function valgrisNotYet(){const m=S.vpend,z=S.cur;S.vpend=null;closePanel();if(!m)return;const L=vrep();
  const B=BOSSES.valgris;gainXp(m.xp);dropLoot(m,z);rollUnique('valgris',m.x,m.y,m.lvl+1);if(!p.egg&&Math.random()<.01)dropAt(z,m.x,m.y,{kind:'egg'});S.pend.push({t:.3,fn:()=>say(L.notyet)});for(let k=0;k<5;k++)burst(m.x+rnd(-1.5,1.5),m.y+rnd(-1.5,1.5),k%2?'#f4ecd8':'#6a645c',30);S.shake=.6;sfx('portal');z.mons=z.mons.filter(o=>o!==m);p.inv=0;
  const q=S.q[B.quest];if(q&&q.s<2){q.s=2;toast(bt(B,'death'));}nextActExit(z);save();}
