'use strict';
/* Comportements : un monstre choisit le sien par son champ ai. Ajouter un comportement = ajouter une entrée. */
const BEHAV={
  melee(m,dt,z,d,fd,spd){const reach=.7+m.size*.32;
    if(d<reach){if(m.cd<=0){m.cd=m.boss?1.05:1.25;m.atk=.3;const dm=Math.round(ri(m.dmg[0],m.dmg[1])*buffOf(m,z));S.pend.push({t:.15,fn:()=>{if(!m.dead&&dist(m,p)<reach+.3)hurtPlayer(dm,m.lvl,m);}});}return;}
    chase(m,dt,z,fd,spd);},
  ranged(m,dt,z,d,fd,spd){
    if(m.ranged&&d<7&&fd<10){
      if(m.cd<=0){m.cd=1.7;m.atk=.3;const dx=p.x-m.x,dy=p.y-m.y,l=Math.hypot(dx,dy)||1,sp=m.bolt?5.5:7;S.proj.push({x:m.x,y:m.y,vx:dx/l*sp,vy:dy/l*sp,from:'m',kind:m.bolt?'mbolt':'arrow',dmg:Math.round(ri(m.dmg[0],m.dmg[1])*buffOf(m,z)),L:m.lvl,life:1.8});}
      if(d<2.4){const dx=m.x-p.x,dy=m.y-p.y,l=Math.hypot(dx,dy)||1;step(m,dx/l,dy/l,spd*.7*dt,z);}
      return;}
    BEHAV.melee(m,dt,z,d,fd,spd);}
};
/* Ossira : jette des toiles au sol qui ralentissent */
BEHAV.weaver=function(m,dt,z,d,fd,spd){const W=BOSSES[m.bossId].web;m.at-=dt;
  if(m.at<=0&&d<9){m.at=W.every;S.hz.push({x:p.x,y:p.y,r:W.r,t:W.t,arm:W.arm,kind:'web'});m.atk=.3;}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Korr : se prépare, puis charge en ligne droite en laissant une traînée de feu */
BEHAV.charger=function(m,dt,z,d,fd,spd){const C=BOSSES[m.bossId].charge;
  if(m.chg>0){m.chg-=dt;const ox=m.x,oy=m.y;step(m,m.cdx,m.cdy,C.speed*dt,z);m.trT=(m.trT||0)-dt;
    if(m.trT<=0){m.trT=.08;S.hz.push({x:m.x,y:m.y,r:.8,t:C.trail,arm:0,kind:'fire',dps:Math.max(1,Math.round(m.dmg[0]*C.burn)),L:m.lvl});}
    if(!m.chHit&&dist(m,p)<.9+m.size*.3){m.chHit=true;hurtPlayer(Math.round(m.dmg[1]*C.hit),m.lvl,m);S.shake=Math.max(S.shake,.35);}
    if(Math.hypot(m.x-ox,m.y-oy)<C.speed*dt*.3)m.chg=0;return;}
  if(m.tel>0){m.tel-=dt;m.flash=.08;if(m.tel<=0){const dx=p.x-m.x,dy=p.y-m.y,l=Math.hypot(dx,dy)||1;m.cdx=dx/l;m.cdy=dy/l;m.chg=C.dur;m.chHit=false;sfx('boom');}return;}
  m.at-=dt;if(m.at<=0&&d<9&&fd>=0&&fd<12){m.at=C.every;m.tel=C.tel;return;}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Méliane : se téléporte autour du héros et appelle des pleureuses */
BEHAV.wailer=function(m,dt,z,d,fd,spd){const B=BOSSES[m.bossId];m.at-=dt;m.at2-=dt;
  if(m.at<=0){m.at=B.blink.every;let f=null;for(let t=0;t<25&&!f;t++){const a=rnd(0,6.28),r=rnd(4,7),q=nearFloor(z,p.x+Math.cos(a)*r,p.y+Math.sin(a)*r);if(q&&z.flow&&z.flow[q[1]*z.w+q[0]]>=0)f=q;}
    if(f){burst(m.x,m.y,'#c8d8ff',16);m.x=f[0]+.5;m.y=f[1]+.5;burst(m.x,m.y,'#c8d8ff',16);}}
  if(m.at2<=0){m.at2=B.summon.every;const n=z.mons.filter(o=>!o.dead&&o.t===B.summon.type).length;if(n<B.summon.max){for(let i=0;i<B.summon.n;i++){const f=nearFloor(z,m.x+rnd(-2,2),m.y+rnd(-2,2));if(f){const c=spawnMon(z,B.summon.type,f[0]+.5,f[1]+.5,false,m.lvl);c.aggro=true;if(m.wave)c.wave=true;burst(c.x,c.y,'#c8d8ff',8);}}say(bt(B,'call'));}}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Étendard du Héraut : renforce les monstres proches */
function buffOf(m,z){for(const o of z.mons)if(o.t==='etendard'&&!o.dead&&o!==m&&dist(o,m)<BOSSES.heraut.banner.r)return BOSSES.heraut.banner.buff;return 1;}
BEHAV.still=function(){};
/* Le Héraut gris : plante son étendard ; tant qu’il tient, le Héraut est presque intouchable */
BEHAV.herald=function(m,dt,z,d,fd,spd){const B=BOSSES.heraut.banner;if(!m.flag)m.at2=0;
  if(!m.flag||m.flag.dead){m.at2-=dt;if(m.at2<=0){m.at2=B.every;const f=nearFloor(z,m.x+rnd(-1.5,1.5),m.y+rnd(-1.5,1.5))||[Math.floor(m.x),Math.floor(m.y)];
    m.flag=spawnMon(z,'etendard',f[0]+.5,f[1]+.5,false,m.lvl);m.flag.aggro=true;burst(m.flag.x,m.flag.y,'#c03020',16);if(!m.told){m.told=true;say('Le Héraut plante son étendard : abats-le d’abord !');}}}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Dame Cinéraire : couvre le sol de cendre brûlante et lance des éclats */
BEHAV.cinder=function(m,dt,z,d,fd,spd){const A=BOSSES.cineraire.ash;m.at-=dt;
  if(m.at<=0&&d<10){m.at=A.every;if(S.hz.filter(h=>h.kind==='ash').length<A.max){S.hz.push({x:p.x+rnd(-.4,.4),y:p.y+rnd(-.4,.4),r:A.r,t:A.t,arm:A.arm,kind:'ash',dps:Math.max(1,Math.round(m.dmg[0]*A.burn)),L:m.lvl});m.atk=.3;}}
  BEHAV.ranged(m,dt,z,d,fd,spd);};
/* Le Forgeron sans visage : son armure prend les coups ; brisée, il chancelle et devient fragile */
BEHAV.forge=function(m,dt,z,d,fd,spd){if(m.shellMax&&m.shell<=0){m.vuln-=dt;if(m.vuln<=0){m.shell=m.shellMax;say('Le Forgeron reforge son armure.');burst(m.x,m.y,'#d0d4da',20);}}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Valgris : 1) seul au corps à corps, 2) rappelle les échos des lieutenants vaincus, 3) l’arène rétrécit sous les cendres */
BEHAV.valgris=function(m,dt,z,d,fd,spd){const B=BOSSES.valgris,L=REPLIQUES.valgris[S.world]||REPLIQUES.valgris[1];if(m.beaten)return;const f=m.hp/m.maxHp,c=z.center||[m.x,m.y];
  if(!m.ph2&&f<B.phase2){m.ph2=true;say(L.phase2);S.shake=.4;const act=curWorld().acts[1];let n=0;
    for(const b of act.acolytes)if(S.aco&&S.aco[b]){const q=nearFloor(z,m.x+rnd(-3,3),m.y+rnd(-3,3));if(!q)continue;const e=spawnMon(z,BOSSES[b].mon,q[0]+.5,q[1]+.5,false,m.lvl-3);
      e.hp=e.maxHp=Math.round(e.maxHp*B.echo);e.echo=true;e.noLoot=true;e.told=true;e.xp=Math.round(e.xp*.1);e.name='Écho : '+e.name;e.aggro=true;if(e.shellMax){e.shellMax=Math.round(e.maxHp*.45);e.shell=e.shellMax;}burst(e.x,e.y,'#a8a49c',24);n++;}}
  if(!m.ph3&&f<B.phase3){m.ph3=true;say(L.phase3);z.shrink={r:B.shrink.from,cx:c[0]+.5,cy:c[1]+.5,dps:Math.max(1,Math.round(m.dmg[1]*B.shrink.dps)),L:m.lvl};}
  m.at-=dt;if(m.at<=0&&d<4.5){m.at=B.slam.every;S.hz.push({x:m.x,y:m.y,r:B.slam.r,t:.15,arm:B.slam.arm,kind:'slam',hit:Math.round(m.dmg[1]*B.slam.hit),L:m.lvl});m.atk=.3;}
  if(m.ph3){m.vt-=dt;if(m.vt<=0){const V=B.volley;m.vt=V.cdEnr;const o=rnd(0,1);for(let i=0;i<V.nEnr;i++){const a=o+i/V.nEnr*Math.PI*2;S.proj.push({x:m.x,y:m.y,vx:Math.cos(a)*5,vy:Math.sin(a)*5,from:'m',kind:'bolt',dmg:ri(Math.round(m.bd*.8),Math.round(m.bd*1.3)),L:m.lvl,life:2.4});}}}
  BEHAV.melee(m,dt,z,d,fd,spd);};
