'use strict';
/* ---------- Mise à jour ---------- */
function step(e,dx,dy,a,z){const nx=e.x+dx*a,ny=e.y+dy*a;if(free(z,nx,e.y,.22))e.x=nx;if(free(z,e.x,ny,.22))e.y=ny;}
function update(dt){
  const z=S.cur;S.t+=dt;S.shake=Math.max(0,S.shake-dt);if(S.mark)S.mark.t-=dt;
  if(S.cine){if(S.cur.mons.includes(S.cine.m))updCine(dt);else S.cine=null;}
  if(S.vpend&&!S.vpend.dead&&S.cur.mons.includes(S.vpend)&&panel.classList.contains('hidden')&&!S.pend.some(h=>h.fn===openValgrisChoice)){openValgrisChoice();return;}
  {const cur=S.pend;S.pend=[];for(const h of cur){h.t-=dt;if(h.t<=0)h.fn();else S.pend.push(h);}}
  updAmb(dt,z);
  {p.webbed=false;let burn=0,bL=1;for(const h of S.hz||[]){if(h.arm>0){h.arm-=dt;continue;}
      if(h.kind==='slam'){if(!h.done){h.done=true;burst(h.x,h.y,'#cfc8b8',24);S.shake=Math.max(S.shake,.3);sfx('boom');if(!p.dead&&Math.hypot(p.x-h.x,p.y-h.y)<h.r)hurtPlayer(h.hit,h.L);}h.t=0;continue;}
      h.t-=dt;if(!p.dead&&Math.hypot(p.x-h.x,p.y-h.y)<h.r){if(h.kind==='web')p.webbed=true;else if(h.dps>burn){burn=h.dps;bL=h.L||1;}}}
    if(z.shrink){const Sk=BOSSES.valgris.shrink;z.shrink.r=Math.max(Sk.to,z.shrink.r-Sk.speed*dt);if(!p.dead&&Math.hypot(p.x-z.shrink.cx,p.y-z.shrink.cy)>z.shrink.r&&z.shrink.dps>burn){burn=z.shrink.dps;bL=z.shrink.L;}}
    S.hz=(S.hz||[]).filter(h=>h.t>0);p.burnT=Math.max(0,(p.burnT||0)-dt);if(burn&&!p.dead&&p.burnT<=0){p.burnT=.5;hurtPlayer(Math.max(1,Math.round(burn*.5)),bL);}}
  if(!p.dead){
    p.cd=Math.max(0,p.cd-dt);p.acd=Math.max(0,(p.acd||0)-dt);if(p.queued){p.queued.t-=dt;if(p.queued.t<=0)p.queued=null;else if(p.cd<=0){const q=p.queued;p.queued=null;castSkill(q.id,q.tx,q.ty);}}p.swing=Math.max(0,p.swing-dt);p.hurt=Math.max(0,p.hurt-dt);p.tpCd=Math.max(0,p.tpCd-dt);p.spin=Math.max(0,p.spin-dt);p.buff=Math.max(0,p.buff-dt);p.av=Math.max(0,(p.av||0)-dt);p.inv=Math.max(0,(p.inv||0)-dt);p.secCd=Math.max(0,(p.secCd||0)-dt);
    for(const k in p.cds)p.cds[k]=Math.max(0,p.cds[k]-dt);
    p.mp=Math.min(p.maxMp,p.mp+p.st.regen*dt);p.hp=Math.min(p.maxHp,p.hp+(z.id==='town'?p.maxHp*.1:p.maxHp*(.005+p.st.regenHp/100))*dt);
    if(p.target&&p.target.dead)p.target=null;
    if(p.target){const t=p.target,d=dist(p,t),reach=.85+t.size*.35;
      if(d<reach){p.path=null;p.face=Math.atan2(t.y-p.y,t.x-p.x);
        if(p.acd<=0&&p.cd<=0){p.acd=1/Math.min(7.8,p.st.aps*(p.av>0?1.3:1));p.swing=.25;S.pend.push({t:.11,fn:()=>{if(t.dead||dist(p,t)>reach+.4)return;
          if(p.st.legs.cleave){for(const m of S.cur.mons)if(!m.dead&&dist(m,p)<reach+.6)hitMon(m,1,false);}else hitMon(t,1,false);
          if(p.st.legs.echo&&Math.random()<.2)castSkill('chain',t.x,t.y,true);}});}}
      else{p.rp=(p.rp||0)-dt;if(p.rp<=0||!p.path){p.rp=.3;p.path=pathTo(z,Math.floor(p.x),Math.floor(p.y),Math.floor(t.x),Math.floor(t.y));}}}
    if(p.targetObj){const o=p.targetObj;if(dist(p,o)<1.3){p.path=null;p.targetObj=null;interact(o);}}
    p.moving=false;const spd=4.3*(1+p.st.move/100)*(p.webbed?.45:1);
    if(p.path&&p.path.length){const n=p.path[0],tx=n[0]+.5,ty=n[1]+.5,dx=tx-p.x,dy=ty-p.y,l=Math.hypot(dx,dy);
      if(l<.12){p.path.shift();}else{const s=Math.min(l,spd*dt),ox=p.x,oy=p.y;step(p,dx/l,dy/l,s,z);if(Math.hypot(p.x-ox,p.y-oy)<s*.3){const cx=Math.floor(p.x)+.5,cy=Math.floor(p.y)+.5;if(Math.hypot(cx-p.x,cy-p.y)>.05)step(p,cx-p.x,cy-p.y,Math.min(1,s/Math.hypot(cx-p.x,cy-p.y)),z);}p.face=Math.atan2(dy,dx);p.moving=true;}}
    const px=Math.floor(p.x),py=Math.floor(p.y);for(let y=py-9;y<=py+9;y++)for(let x=px-9;x<=px+9;x++)if(x>=0&&y>=0&&x<z.w&&y<z.h&&(x-px)**2+(y-py)**2<81)z.seen[y*z.w+x]=1;
    for(let i=z.items.length-1;i>=0;i--){const o=z.items[i];const dd=Math.hypot(o.x-p.x,o.y-p.y);if(o.dropped){if(dd>1.2)o.dropped=false;continue;}if(dd>(o.kind==='item'?.6:1.4))continue;
      if(o.kind==='gold'){p.gold+=o.v;sfx('gold');S.fx.push({x:o.x,y:o.y,t:`+${fmt(o.v)} or`,col:'#e8c46a',life:1});}
      else if(o.kind==='pot'){if(p.pot>=POTIONS.fiole.max)continue;p.pot++;floatText(o.x,o.y,'+1 fiole','#ff8a7a');}
      else if(o.kind==='scroll'){p.scroll++;floatText(o.x,o.y,'+1 parchemin','#9fb8ff');}
      else{if(p.skipWhite&&o.it.rar===0&&!o.forced)continue;if(!bagAdd(o.it)){if(!p.fullT||S.t-p.fullT>3){say('Ton inventaire est plein.');p.fullT=S.t;}continue;}floatText(o.x,o.y,o.it.name,RCOL[o.it.rar]);if(o.it.rar===3){toast('Légendaire : '+o.it.name);sfx('leg');}}
      z.items.splice(i,1);}
    if(p.tpCd<=0){
      for(const o of z.objs){if(o.type==='exit'&&dist(p,o)<.6){if(tryExit(o))return;break;}
        if(o.type==='wp'&&dist(p,o)<2.6&&!S.wps[z.id]){S.wps[z.id]=1;toast('Point de passage activé');save();}}
      for(const po of portalsIn(z))if(Math.hypot(po.x-p.x,po.y-p.y)<.6){enterZone(po.dest,'portal');return;}
    }
  }
  z.flowT-=dt;if(z.flowT<=0&&z.id!=='town'){z.flowT=.25;z.flow=bfs(z,Math.floor(p.x),Math.floor(p.y),26);}
  if(z.arena&&!z.arena.done&&!p.dead)updArena(z);
  if(z.id!=='town')for(const m of z.mons)updMon(m,dt,z);
  const act=z.mons.filter(m=>!m.dead&&m.aggro);
  for(let i=0;i<act.length;i++)for(let j=i+1;j<act.length;j++){const a=act[i],b=act[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),mn=.3*(a.size+b.size);if(d>0&&d<mn){const k=(mn-d)/2/d;step(a,-dx,-dy,k,z);step(b,dx,dy,k,z);}}
  z.mons=z.mons.filter(m=>!m.dead||m.dt<25||(m.boss&&!m.guard));
  for(const pr of S.proj){pr.x+=pr.vx*dt;pr.y+=pr.vy*dt;pr.life-=dt;
    if(pr.kind==='fire'&&Math.random()<.6)S.parts.push({x:pr.x,y:pr.y,z:.6,vx:rnd(-.5,.5),vy:rnd(-.5,.5),vz:rnd(0,1),life:.35,col:Math.random()<.5?'#ffb347':'#e0502a'});
    if(isWall(z,Math.floor(pr.x),Math.floor(pr.y))){pr.life=0;if(pr.kind==='fire')explode(pr);continue;}
    if(pr.from==='p'){for(const m of z.mons){if(m.dead)continue;if(Math.hypot(m.x-pr.x,m.y-pr.y)<.35+m.size*.3){pr.life=0;explode(pr);break;}}}
    else if(!p.dead&&Math.hypot(p.x-pr.x,p.y-pr.y)<.4){pr.life=0;hurtPlayer(pr.dmg,pr.L);}}
  S.proj=S.proj.filter(pr=>pr.life>0);
  for(const mt of S.mets){mt.t-=dt;if(mt.t<=0){burst(mt.x,mt.y,'#ff7a2a',mt.small?10:30);sfx('boom');S.shake=Math.max(S.shake,mt.small?.12:.3);S.novas.push({x:mt.x,y:mt.y,r:0,max:mt.r||2.4,col:'255,140,60'});addDecal(z,mt.x,mt.y,.9,'boss');
    for(const m of z.mons)if(!m.dead&&Math.hypot(m.x-mt.x,m.y-mt.y)<(mt.r||2.4)+m.size*.3)hitMon(m,mt.mult,true,'#ffb347');}}
  S.mets=S.mets.filter(m=>m.t>0);
  for(const b of S.bolts)b.t-=dt;S.bolts=S.bolts.filter(b=>b.t>0);
  for(const n of S.novas)n.r+=dt*9;S.novas=S.novas.filter(n=>n.r<n.max);
  for(const q of S.parts){q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;q.vz-=6*dt;if(q.z<0)q.z=0;q.life-=dt;}S.parts=S.parts.filter(q=>q.life>0);
  for(const f of S.fx)f.life-=dt;S.fx=S.fx.filter(f=>f.life>0);if(S.fx.length>60)S.fx.splice(0,S.fx.length-60);
  if(z.id==='town'&&Math.random()<dt*14){const fo=z.objs.find(o=>o.type==='fire');S.parts.push({x:fo.x+rnd(-.2,.2),y:fo.y+rnd(-.2,.2),z:.2,vx:rnd(-.2,.2),vy:rnd(-.2,.2),vz:rnd(1.5,3),life:rnd(.4,.9),col:Math.random()<.5?'#ffb347':'#e0502a'});}
  const c=iso(p.x,p.y);{const dv=(S.cine&&S.cine.m)||S.vpend;if(dv&&dv.divine!=null){const q=iso(dv.x,dv.y);c[0]=(c[0]+q[0])/2;c[1]=(c[1]+q[1])/2-150*Z*dv.divine;}}S.cam.x+=(c[0]-S.cam.x)*Math.min(1,dt*8);S.cam.y+=(c[1]-S.cam.y)*Math.min(1,dt*8);
}
function updArena(z){const A=z.arena,c=z.center;
  if(!A.on){if(Math.hypot(p.x-c[0]-.5,p.y-c[1]-.5)<11){A.on=true;toast('L’arène se referme');say('La sortie s’ouvrira quand l’arène sera vide.');}else return;}
  if(z.mons.some(m=>m.wave&&!m.dead))return;
  if(A.wave>=A.n){A.done=true;for(const o of z.objs)if(o.lock)o.lock=false;const f=nearFloor(z,c[0],c[1]);if(f)z.objs.push({type:'chest',x:f[0]+.5,y:f[1]+.5,open:false});
    toast('L’arène est vide : la sortie s’ouvre');sfx('lvl');return;}
  const w=A.wave++,n=5+2*w;
  for(let k=0;k<n;k++){let f=null;for(let t=0;t<30&&!f;t++){const a=rnd(0,6.28),r=rnd(8,12.5),q=nearFloor(z,c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r);if(q&&Math.hypot(q[0]-p.x,q[1]-p.y)>4)f=q;}
    if(!f)continue;const m=spawnMon(z,pick(z.def.mons),f[0]+.5,f[1]+.5,w===A.n-1&&k===0);m.aggro=true;m.wave=true;burst(m.x,m.y,'#ff7a2a',8);}
  if(w===A.n-1&&z.def.aco){const f=nearFloor(z,c[0]+3,c[1])||c;const m=spawnMon(z,BOSSES[z.def.aco].mon,f[0]+.5,f[1]+.5,false,Math.max(1,z.def.lvl)+1);m.aggro=true;m.wave=true;burst(m.x,m.y,BOSSES[z.def.aco].col,30);toast(bt(BOSSES[z.def.aco],'wake'));}
  toast(`Vague ${w+1} / ${A.n}`);}
function updAmb(dt,z){
  const st=z.style;const n={plain:45,crypt:28,lair:45,town:14}[st];
  while(S.amb.length<n){const a={x:p.x+rnd(-12,12),y:p.y+rnd(-12,12),life:rnd(3,8),vx:rnd(-.15,.15),vy:rnd(-.15,.15),s:rnd(1,2.2)};a.max=a.life;
    if(st==='plain'){const P=palOf('plain');a.ember=Math.random()<(P.ember??.12);a.z=a.ember?0:rnd(1,4);a.vz=a.ember?rnd(.3,.7):-rnd(.15,.35);a.vx+=.25;a.c=P.amb||'170,165,155';}
    else if(st!=='town'&&palOf(st).snow){a.z=rnd(1,4);a.vz=-rnd(.2,.5);a.vx+=.15;a.c=palOf(st).amb;}
    else if(st==='crypt'){a.z=rnd(.3,2.5);a.vz=rnd(-.05,.05);a.c='200,195,180';}
    else{a.ember=true;a.z=0;a.vz=rnd(.4,.9);if(st==='town'){const f=z.objs.find(o=>o.type==='fire');a.x=f.x+rnd(-.4,.4);a.y=f.y+rnd(-.4,.4);a.vz=rnd(.8,1.5);a.life=a.max=rnd(1,2.2);}}
    S.amb.push(a);}
  for(const a of S.amb){a.x+=a.vx*dt;a.y+=a.vy*dt;a.z+=a.vz*dt;a.life-=dt;if(a.ember)a.vx+=Math.sin(S.t*3+a.y)*dt*.3;}
  S.amb=S.amb.filter(a=>a.life>0&&a.z>-.1&&Math.abs(a.x-p.x)<14&&Math.abs(a.y-p.y)<14);
}
function explode(pr){
  if(pr.from!=='p')return;burst(pr.x,pr.y,'#ff8c3a',14);
  for(const m of S.cur.mons){if(m.dead)continue;const d=Math.hypot(m.x-pr.x,m.y-pr.y);if(d<1.3+m.size*.2)hitMon(m,d<.6?pr.mult:pr.mult*.6,true,'#ffb347');}
}
function updMon(m,dt,z){
  if(m.dead){m.dt+=dt;return;}
  if(m.stun>0){m.stun-=dt;m.flash=Math.max(0,m.flash-dt);return;}
  m.cd-=dt;m.flash=Math.max(0,m.flash-dt);m.slow=Math.max(0,m.slow-dt);m.atk=Math.max(0,m.atk-dt);m.ph+=dt;
  if(p.dead)return;
  const spd=m.spd*(m.slow>0?.5:1),d=dist(m,p);
  const fd=z.flow?z.flow[Math.floor(m.y)*z.w+Math.floor(m.x)]:-1;
  if(!m.aggro&&m.amb){if(fd>=0&&fd<=5){const g=m.amb;for(const o of z.mons)if(o.amb===g){o.aggro=true;o.amb=0;}toast('Embuscade !');S.shake=Math.max(S.shake,.2);}return;}
  if(!m.aggro){
    if(fd>=0&&fd<=(m.boss?11:8)){m.aggro=true;if(m.bossId&&bt(BOSSES[m.bossId],'wake'))toast(bt(BOSSES[m.bossId],'wake'));}
    else{m.wt-=dt;if(m.wt<=0){m.wt=rnd(2,5);m.wd=Math.random()<.5?null:[rnd(-1,1),rnd(-1,1)];}if(m.wd){step(m,m.wd[0],m.wd[1],spd*.3*dt,z);m.face=Math.atan2(m.wd[1],m.wd[0]);}return;}}
  if(fd<0||fd>24){if(!m.guard)m.aggro=false;if(fd<0)return;}
  m.face=Math.atan2(p.y-m.y,p.x-m.x);
  if(m.boss&&!m.mini&&!(m.bossId&&BOSSES[m.bossId].own))bossAI(m,dt,z);
  (BEHAV[m.ai]||BEHAV.melee)(m,dt,z,d,fd,spd);
}
