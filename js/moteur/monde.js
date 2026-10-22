'use strict';
function chase(m,dt,z,fd,spd){
  let tx=p.x,ty=p.y;
  if(fd>1){const cx=Math.floor(m.x),cy=Math.floor(m.y);let bd=fd;
    for(const[dx,dy]of DIR8){const nx=cx+dx,ny=cy+dy;if(isWall(z,nx,ny))continue;if(dx&&dy&&(isWall(z,cx+dx,cy)||isWall(z,cx,cy+dy)))continue;const v=z.flow[ny*z.w+nx];if(v>=0&&v<bd){bd=v;tx=nx+.5;ty=ny+.5;}}}
  const dx=tx-m.x,dy=ty-m.y,l=Math.hypot(dx,dy)||1,ox=m.x,oy=m.y;step(m,dx/l,dy/l,spd*dt,z);
  if(Math.hypot(m.x-ox,m.y-oy)<spd*dt*.3){const cx=Math.floor(m.x)+.5,cy=Math.floor(m.y)+.5,cl=Math.hypot(cx-m.x,cy-m.y);if(cl>.05)step(m,(cx-m.x)/cl,(cy-m.y)/cl,Math.min(cl,spd*dt),z);}
}
function bossAI(m,dt,z){
  const B=(m.bossId&&BOSSES[m.bossId])||BOSS_BASE,V=B.volley||BOSS_BASE.volley,C=B.summon||BOSS_BASE.summon;
  const enr=m.hp<m.maxHp*.5;m.vt-=dt;m.st-=dt;
  if(m.vt<=0){m.vt=enr?V.cdEnr:V.cd;const n=enr?V.nEnr:V.n,o=rnd(0,1);for(let i=0;i<n;i++){const a=o+i/n*Math.PI*2;S.proj.push({x:m.x,y:m.y,vx:Math.cos(a)*5,vy:Math.sin(a)*5,from:'m',kind:'bolt',dmg:ri(Math.round(m.bd*.8),Math.round(m.bd*1.3)),L:m.lvl,life:2.4});}burst(m.x,m.y,'#ff5a2a',20);S.shake=Math.max(S.shake,.25);}
  if(m.st<=0){m.st=C.every;const alive=z.mons.filter(o=>!o.dead&&!o.boss).length;if(alive<C.max){for(let i=0;i<C.n;i++){const f=nearFloor(z,m.x+rnd(-2,2),m.y+rnd(-2,2));if(f){const c=spawnMon(z,C.type,f[0]+.5,f[1]+.5,false,m.lvl);c.aggro=true;burst(c.x,c.y,'#802010',10);}}if(bt(B,'call'))say(bt(B,'call'));}}
}
function tryExit(o){if(o.lock){say('La sortie s’ouvrira quand l’arène sera vide.');p.tpCd=2.5;return false;}const sl=sealOf(o.to);if(sl){say(sl.msg);p.tpCd=2.5;return false;}enterZone(o.to,'exit',S.cur.id);return true;}
function interact(o){
  if(o.type==='exit'){tryExit(o);return;}
  if(o.dest){enterZone(o.dest,'portal');return;}
  if(o.type==='npc')npcDialog(o.id);
  else if(o.type==='wp'){S.wps[S.cur.id]=1;wpMenu();}
  else if(o.type==='chest')openChest(o);
  else if(o.type==='rift'&&riftOpen())riftMenu();
  else if(o.type==='stash')invPanel('stash');
}
function fmtT(s){s=Math.round(s);return`${Math.floor(s/60)} min ${String(s%60).padStart(2,'0')}`;}
function actBossDone(a){const act=curWorld().acts[(a||1)-1],B=act&&BOSSES[act.boss];return!!(B&&B.quest&&S.q[B.quest]&&S.q[B.quest].s>=2);}
function riftOpen(){return actBossDone(1)||Object.values(S.qw||{}).some(q=>q&&q.q3&&q.q3.s>=2);}
/* Changer de monde : quêtes, acolytes et zones propres à chaque monde ; héros, sac, coffre et failles gardés */
function setWorld(w){if(!WORLDS[w])return;syncWorld();S.world=w;S.worldMax=Math.max(S.worldMax||1,w);S.qw[w]=S.qw[w]||{};S.q=S.qw[w];
  for(const k in QUESTS){if(!S.q[k])S.q[k]={s:0};if(S.q[k].n==null)S.q[k].n=0;}
  S.acow[w]=S.acow[w]||{};S.aco=S.acow[w];S.zones={};S.portal=null;S.cine=null;S.vpend=null;S.act=1;enterZone('town','spawn');}
function syncWorld(){if(!S.qw)S.qw={};if(!S.acow)S.acow={};S.qw[S.world]=S.q;S.acow[S.world]=S.aco||{};}
function worldName(w){return THEMES[WORLDS[w].theme].n;}
function hexc(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
