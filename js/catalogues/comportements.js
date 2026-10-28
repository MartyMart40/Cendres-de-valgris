'use strict';
/* Comportements : un monstre choisit le sien par son champ ai. Ajouter un comportement = ajouter une entrée. */
const BEHAV={
  /* v6.06 : un monstre ne frappe que s’il voit sa cible ; sinon il la contourne par le chemin */
  melee(m,dt,z,d,fd,spd){const reach=.7+m.size*.32;
    /* v6.54 : un animal se ramasse 1 s avant de mordre ; un cercle rouge marque où il va frapper. On peut s’écarter. */
    if(m.bite>0){m.bite-=dt;m.face=Math.atan2(m.bty-m.y,m.btx-m.x);if(m.bite<.3)m.flash=Math.max(m.flash,.05);if(m.bite<=0){m.cd=BITE.cd;m.atk=.3;if(m.bhz)m.bhz.t=0;m.bhz=null;
      if(!p.dead&&S.cur===z&&Math.hypot(p.x-m.btx,p.y-m.bty)<BITE.r&&losClear(z,m.x,m.y,p.x,p.y))hurtPlayer(m.bdm,m.lvl,m);else{S.fx.push({x:p.x,y:p.y,t:'Esquivé',col:'#c8e0ff',life:.8});}}return;}
    const al=S.ally;if(al&&!al.down&&ALLIES[al.type]&&dist(m,al)<reach&&(ALLIES[al.type].tank||dist(m,al)<d)&&losClear(z,m.x,m.y,al.x,al.y)){if(m.cd<=0){m.cd=m.boss?1.05:1.25;m.atk=.3;m.face=Math.atan2(al.y-m.y,al.x-m.x);allyHurt(Math.round(ri(m.dmg[0],m.dmg[1])*buffOf(m,z)));}return;}
    if(d<reach&&losClear(z,m.x,m.y,p.x,p.y)&&m.cd<=0&&isBeast(m)){const l=Math.max(.01,d),u=Math.min(d,reach*.8);m.btx=m.x+(p.x-m.x)/l*u;m.bty=m.y+(p.y-m.y)/l*u;m.bite=BITE.wind;m.bdm=Math.round(ri(m.dmg[0],m.dmg[1])*buffOf(m,z)*BITE.mult);
      m.bhz={x:m.btx,y:m.bty,r:BITE.r,t:99,kind:'bite',src:m};S.hz.push(m.bhz);atkTip('bite');return;}
    if(d<reach&&losClear(z,m.x,m.y,p.x,p.y)){if(m.cd<=0){m.cd=m.boss?1.05:1.25;m.atk=.3;const dm=Math.round(ri(m.dmg[0],m.dmg[1])*buffOf(m,z));S.pend.push({t:.15,fn:()=>{if(!m.dead&&dist(m,p)<reach+.3&&S.cur===z&&losClear(z,m.x,m.y,p.x,p.y))hurtPlayer(dm,m.lvl,m);}});}return;}
    if(al&&!al.down&&ALLIES[al.type]&&ALLIES[al.type].tank&&dist(m,al)<4&&dist(m,al)<d){const dx=al.x-m.x,dy=al.y-m.y,l=Math.hypot(dx,dy)||1;step(m,dx/l,dy/l,spd*dt,z);return;}
    chase(m,dt,z,fd,spd);},
  ranged(m,dt,z,d,fd,spd){
    if(m.ranged&&d<7&&fd<10&&losClear(z,m.x,m.y,p.x,p.y)){
      if(m.cd<=0){m.cd=1.7;m.atk=.3;const dx=p.x-m.x,dy=p.y-m.y,l=Math.hypot(dx,dy)||1,sp=m.bolt?5.5:7;S.proj.push({x:m.x,y:m.y,vx:dx/l*sp,vy:dy/l*sp,from:'m',kind:m.bolt?'mbolt':'arrow',dmg:Math.round(ri(m.dmg[0],m.dmg[1])*buffOf(m,z)),L:m.lvl,life:1.8});}
      if(d<2.4){const dx=m.x-p.x,dy=m.y-p.y,l=Math.hypot(dx,dy)||1;step(m,dx/l,dy/l,spd*.7*dt,z);}
      return;}
    BEHAV.melee(m,dt,z,d,fd,spd);}
};
/* v5.54 : trois nouveaux comportements */
BEHAV.summoner=function(m,dt,z,d,fd,spd){if(m.at==null)m.at=rnd(1.5,3);m.at-=dt;
  if(m.at<=0&&d<10){m.at=6;const n=z.mons.filter(o=>o.pup===m&&!o.dead).length;if(n<4&&z.mons.filter(o=>!o.dead).length<26){m.atk=.4;for(let k=0;k<2;k++){const f=nearFloor(z,m.x+rnd(-1.5,1.5),m.y+rnd(-1.5,1.5));if(f){const c=spawnMon(z,'rodeur',f[0]+.5,f[1]+.5,false,m.lvl);c.aggro=true;c.pup=m;c.noLoot=true;c.xp=Math.round(c.xp*.3);burst(c.x,c.y,'#7a6a9a',12);}}}}
  if(d<4){const dx=m.x-p.x,dy=m.y-p.y,l=Math.hypot(dx,dy)||1;step(m,dx/l,dy/l,spd*dt,z);m.face=Math.atan2(-dy,-dx);return;}
  if(d>7)chase(m,dt,z,fd,spd);};
/* BEHAV.burrow : réécrit en v6.21 (Fouisseur), plus bas avec les autres attaques */
BEHAV.healer=function(m,dt,z,d,fd,spd){if(m.at==null)m.at=rnd(1,3);m.at-=dt;
  if(m.at<=0){m.at=3;let best=null;for(const o of z.mons){if(o===m||o.dead||o.boss||o.hp>=o.maxHp)continue;if(dist(o,m)<6&&(!best||o.hp/o.maxHp<best.hp/best.maxHp))best=o;}
    if(best){const h=Math.round(best.maxHp*.12);best.hp=Math.min(best.maxHp,best.hp+h);m.atk=.4;S.bolts.push({a:{x:m.x,y:m.y},b:{x:best.x,y:best.y},t:.25,heal:true});S.fx.push({x:best.x,y:best.y,t:'+'+fmt(h),col:'#c8e0a0',life:.8});}}
  if(d<3.5){const dx=m.x-p.x,dy=m.y-p.y,l=Math.hypot(dx,dy)||1;step(m,dx/l,dy/l,spd*dt,z);return;}
  if(d>6)chase(m,dt,z,fd,spd);};
BEHAV.frost=function(m,dt,z,d,fd,spd){const reach=.7+m.size*.32;if(d<reach&&m.cd<=.05)p.chill=Math.max(p.chill||0,2);BEHAV.melee(m,dt,z,d,fd,spd);};
BEHAV.drowned=function(m,dt,z,d,fd,spd){BEHAV.melee(m,dt,z,d,fd,spd);};
BEHAV.ringer=function(m,dt,z,d,fd,spd){if(m.at==null)m.at=rnd(3,5);m.at-=dt;if(m.at<=0&&d<5){m.at=7;m.atk=.5;S.hz.push({x:m.x,y:m.y,r:2.6,t:.15,arm:1.1,kind:'slam',hit:Math.round(m.dmg[1]*.6),L:m.lvl,stun:.8});sfx('crit');}BEHAV.melee(m,dt,z,d,fd,spd);};
BEHAV.dasher=function(m,dt,z,d,fd,spd){if(m.at==null)m.at=rnd(2,4);
  if(m.dash>0){m.dash-=dt;const ox=m.x,oy=m.y;step(m,m.ddx,m.ddy,9*dt,z);if(!m.dHit&&dist(m,p)<.9&&losClear(z,m.x,m.y,p.x,p.y)){m.dHit=true;hurtPlayer(Math.round(m.dmg[1]*1.3),m.lvl,m);}if(Math.hypot(m.x-ox,m.y-oy)<.05)m.dash=0;return;}
  if(m.tel>0){m.tel-=dt;m.flash=.08;if(m.dlock)m.face=Math.atan2(m.ddy,m.ddx);if(m.tel<=0){if(!m.dlock){const l=Math.hypot(p.x-m.x,p.y-m.y)||1;m.ddx=(p.x-m.x)/l;m.ddy=(p.y-m.y)/l;}m.dlock=false;m.dash=.45;m.dHit=false;}return;}
  m.at-=dt;if(m.at<=0&&d>2&&d<7&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)){m.at=5;
    /* v6.54 : un animal vise au début, 1 s avant de foncer, et une ligne rouge montre sa course */
    if(isBeast(m)){const l=Math.hypot(p.x-m.x,p.y-m.y)||1;m.ddx=(p.x-m.x)/l;m.ddy=(p.y-m.y)/l;m.dlock=true;m.tel=m.tel0=1;S.hz.push({x:m.x,y:m.y,r:.8,t:99,kind:'bline',src:m,len:4.2});atkTip('charge');}else m.tel=.6;return;}BEHAV.melee(m,dt,z,d,fd,spd);};
/* Ossira : jette des toiles au sol qui ralentissent */
BEHAV.weaver=function(m,dt,z,d,fd,spd){const W=BOSSES[m.bossId].web;m.at-=dt;
  if(m.at<=0&&d<9&&losClear(z,m.x,m.y,p.x,p.y)){m.at=W.every;S.hz.push({x:p.x,y:p.y,r:W.r,t:W.t,arm:W.arm,kind:'web'});m.atk=.3;}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Korr : se prépare, puis charge en ligne droite en laissant une traînée de feu */
BEHAV.charger=function(m,dt,z,d,fd,spd){const C=BOSSES[m.bossId].charge;
  if(m.chg>0){m.chg-=dt;const ox=m.x,oy=m.y;step(m,m.cdx,m.cdy,C.speed*dt,z);m.trT=(m.trT||0)-dt;
    if(m.trT<=0){m.trT=.08;S.hz.push({x:m.x,y:m.y,r:.8,t:C.trail,arm:0,kind:'fire',dps:Math.max(1,Math.round(m.dmg[0]*C.burn)),L:m.lvl});}
    if(!m.chHit&&dist(m,p)<.9+m.size*.3&&losClear(z,m.x,m.y,p.x,p.y)){m.chHit=true;hurtPlayer(Math.round(m.dmg[1]*C.hit),m.lvl,m);S.shake=Math.max(S.shake,.35);}
    if(Math.hypot(m.x-ox,m.y-oy)<C.speed*dt*.3)m.chg=0;return;}
  if(m.tel>0){m.tel-=dt;m.flash=.08;if(m.tel<=0){const dx=p.x-m.x,dy=p.y-m.y,l=Math.hypot(dx,dy)||1;m.cdx=dx/l;m.cdy=dy/l;m.chg=C.dur;m.chHit=false;sfx('boom');}return;}
  m.at-=dt;if(m.at<=0&&d<9&&fd>=0&&fd<12&&losClear(z,m.x,m.y,p.x,p.y)){m.at=C.every;m.tel=C.tel;return;}
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
/* Rongeur incandescent : fonce et explose au contact */
BEHAV.bomber=function(m,dt,z,d,fd,spd){if(m.fuse>0){m.fuse-=dt;m.flash=.1;if(m.fuse<=0){burst(m.x,m.y,'#ff8a3a',30);sfx('boom');S.shake=Math.max(S.shake,.25);
      if(Math.hypot(p.x-m.x,p.y-m.y)<1.6&&losClear(z,m.x,m.y,p.x,p.y))hurtPlayer(Math.round(ri(m.dmg[0],m.dmg[1])*1.6),m.lvl,null,'fire');if(S.ally&&Math.hypot(S.ally.x-m.x,S.ally.y-m.y)<1.6&&losClear(z,m.x,m.y,S.ally.x,S.ally.y))allyHurt(m.dmg[1]);m.noLoot=false;m.hp=0;killMon(m);}return;}
  if(d<1.1){m.fuse=.5;return;}chase(m,dt,z,fd,spd*(d<5?1.25:1));};
/* Cracheur de suie : crache une flaque brûlante là où se tient le héros */
BEHAV.spitter=function(m,dt,z,d,fd,spd){if(d<7.5&&fd<11&&losClear(z,m.x,m.y,p.x,p.y)){if(m.cd<=0&&S.hz.filter(h=>h.kind==='ash').length<8){m.cd=2.6;m.atk=.4;S.hz.push({x:p.x+rnd(-.3,.3),y:p.y+rnd(-.3,.3),r:1.2,t:3.5,arm:.9,kind:'ash',el:m.t==='drake'?'fire':'pois',dps:Math.max(1,Math.round(m.dmg[1]*.8)),L:m.lvl});}
    if(d<3){const dx=m.x-p.x,dy=m.y-p.y,l=Math.hypot(dx,dy)||1;step(m,dx/l,dy/l,spd*.8*dt,z);}return;}chase(m,dt,z,fd,spd);};
/* Porte-bouclier d’os : encaisse de face ; il s’ouvre un instant quand il frappe */
BEHAV.shield=function(m,dt,z,d,fd,spd){m.open=Math.max(0,(m.open||0)-dt);const c0=m.cd;BEHAV.melee(m,dt,z,d,fd,spd*.9);if(m.cd>c0+.5)m.open=1.1;};
/* Nid de cendre : pond des bêtes tant que le héros est proche */
BEHAV.nest=function(m,dt,z,d,fd){m.at=(m.at==null?1:m.at)-dt;if(m.at>0||fd<0||fd>11)return;m.at=3.5;
  if(z.mons.filter(o=>o.brood&&!o.dead).length>=9)return;for(let i=0;i<2;i++){const f=nearFloor(z,m.x+rnd(-1.5,1.5),m.y+rnd(-1.5,1.5));if(!f)continue;
    const c=spawnMon(z,'charognard',f[0]+.5,f[1]+.5,false);c.aggro=true;c.brood=true;c.noLoot=true;c.xp=Math.round(c.xp*.3);burst(c.x,c.y,'#a05020',10);}m.atk=.3;};
/* Le Héraut gris : plante son étendard ; tant qu’il tient, le Héraut est presque intouchable */
BEHAV.herald=function(m,dt,z,d,fd,spd){const B=BOSSES.heraut.banner;if(!m.flag)m.at2=0;
  if(!m.flag||m.flag.dead){m.at2-=dt;if(m.at2<=0){m.at2=B.every;const f=nearFloor(z,m.x+rnd(-1.5,1.5),m.y+rnd(-1.5,1.5))||[Math.floor(m.x),Math.floor(m.y)];
    m.flag=spawnMon(z,'etendard',f[0]+.5,f[1]+.5,false,m.lvl);m.flag.aggro=true;burst(m.flag.x,m.flag.y,'#c03020',16);if(!m.told){m.told=true;say('Le Héraut plante son étendard : abats-le d’abord !');}}}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Dame Cinéraire : couvre le sol de cendre brûlante et lance des éclats */
BEHAV.cinder=function(m,dt,z,d,fd,spd){const A=BOSSES.cineraire.ash;m.at-=dt;
  if(m.at<=0&&d<10&&losClear(z,m.x,m.y,p.x,p.y)){m.at=A.every;if(S.hz.filter(h=>h.kind==='ash').length<A.max){S.hz.push({x:p.x+rnd(-.4,.4),y:p.y+rnd(-.4,.4),r:A.r,t:A.t,arm:A.arm,kind:'ash',dps:Math.max(1,Math.round(m.dmg[0]*A.burn)),L:m.lvl});m.atk=.3;}}
  BEHAV.ranged(m,dt,z,d,fd,spd);};
/* Le Forgeron sans visage : son armure prend les coups ; brisée, il chancelle et devient fragile */
BEHAV.forge=function(m,dt,z,d,fd,spd){if(m.shellMax&&m.shell<=0){m.vuln-=dt;if(m.vuln<=0){m.shell=m.shellMax;say('Le Forgeron reforge son armure.');burst(m.x,m.y,'#d0d4da',20);}}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* v6.21 : lot 1 des attaques ennemies. Dix façons d’attaquer, chacune annoncée au sol ou sur le monstre avant de frapper.
   Elles vont à des monstres existants selon le monde (table ATK_AI), ou au nouveau Pétardier des cratères (volcan).
   Toutes demandent une ligne de vue au départ ; aucune ne passe les murs. */
const ATK_AI={foret:{araignee:'leaper',sorcier:'webber'},desert:{sorcier:'whirler',archer:'boomer'},givre:{ombre:'whirler',sorcier:'icespike',loup:'wolf'},cendres:{brute:'bull',rodeur:'trailer'},ossu:{brute:'hooker'},marais:{cracheur:'acid'},astre:{archer:'sniper'},abime:{diablotin:'shade',sorcier:'slownova'},
  pre:{archer:'fan'},fonte:{brute:'spinner',cracheur:'mortar'}};
/* v6.23 : certaines attaques ne vont qu’à une partie de la famille (sinon le sol serait couvert de feu) */
const ATK_CH={cendres:{rodeur:.35},foret:{rodeur:.4},givre:{rodeur:.35}};
/* v6.24 : lot 3 */
Object.assign(ATK_AI.foret,{rodeur:'lurker'});Object.assign(ATK_AI.marais,{ver:'grabber'});Object.assign(ATK_AI.ossu,{archer:'rico'});Object.assign(ATK_AI.volcan=ATK_AI.volcan||{},{brute:'rocker',sorcier:'firewall'});
Object.assign(ATK_AI.givre,{rodeur:'icer'});Object.assign(ATK_AI.astre,{sorcier:'rotor',bouclier:'mirror'});
function atkAi(t,th,roll){const o=ATK_AI[th],a=(o&&o[t])||null;if(a&&roll!==false){const c=(ATK_CH[th]||{})[t];if(c!=null&&Math.random()>=c)return null;}return a;}
/* Premier contact avec une attaque : une phrase pour apprendre à l’éviter (une fois par partie) */
const ATK_TIP={bite:'Une bête se ramasse avant de mordre : un cercle rouge marque où elle va frapper. Écarte-toi.',charge:'Une ligne rouge part d’une bête : elle va foncer tout droit dans 1 s. Sors de la ligne.',leaper:'Une ombre grandit au sol : quelque chose va y retomber. Écarte-toi.',burrow:'Le sol se fissure sous tes pieds : bouge, ça sort de terre.',grenadier:'Une bombe fume au sol : sors du cercle avant qu’il soit plein.',
  whirler:'Un tourbillon erre vers toi : il pousse et blesse, contourne-le.',bull:'Une ligne rouge au sol : la bête va charger tout droit. Sors de la ligne ; si elle heurte un mur, elle reste assommée.',
  icespike:'Le givre court au sol vers toi : des pics vont sortir sur toute la ligne.',hooker:'Sa chaîne brille : il va te harponner et te tirer vers lui. Mets un obstacle entre vous.',
  acid:'Il gonfle les joues : une flaque d’acide va tomber là où tu es. Elle ronge ton armure.',sniper:'Un fil rouge te suit : quand il se fige, le tir part. Bouge à ce moment-là.',shade:'Une fumée noire derrière toi : il va en sortir.',
  fan:'Son arc s’illumine : cinq flèches vont partir en éventail. Écarte-toi de côté ou approche-toi.',spinner:'Il se penche et siffle : il va tourner sur lui-même, lames sorties. Recule.',
  mortar:'Une cible au sol devant toi : l’obus tombe là où tu allais. Change de direction.',webber:'Des fils blancs tremblent dans sa main : sa toile t’immobilise une seconde.',
  wolf:'Un hurlement : les loups t’encerclent, puis attaquent ensemble. Casse le cercle avant.',slownova:'Il se gonfle et brille : un anneau lent va partir de lui. Éloigne-toi plus vite que l’anneau.',
  boomer:'Son arme part et revient : elle peut te toucher deux fois. Sors de sa ligne.',
  lurker:'L’air miroite : quelque chose t’attend, invisible. Frappe le miroitement avant de passer à côté.',grabber:'Il s’accroche à toi et te ralentit : frappe-le pour le décrocher.',
  rico:'Son trajet en pointillé rebondit sur les murs : le coin ne te protège pas.',rocker:'Des ombres rondes au sol : des roches vont y tomber.',
  firewall:'Une ligne de braises au sol : un mur de feu va avancer vers toi. Contourne-le par un bout.',icer:'Le sol bleuit : c’est du verglas, tu glisses en marchant.',
  rotor:'Un rayon pâle fait un tour : ensuite il tourne pour de vrai. Reste derrière lui ou loin.',thief:'Il court vers toi sans arme : un voleur. Abats-le avant qu’il file, il rendra le double.',
  mirror:'Il devient argenté : tes sorts lui reviennent dessus et te touchent. Attends ou frappe à l’arme.',trailer:'Il laisse une traînée qui brûle derrière lui : ne le suis pas.'};
function atkTip(k){S.atkSeen=S.atkSeen||{};if(S.atkSeen[k]||!ATK_TIP[k])return;S.atkSeen[k]=1;say(ATK_TIP[k],5200);}
let HZG=0;
/* Sauteur : bondit sur toi de loin ; son ombre grandit là où il va retomber */
BEHAV.leaper=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(1.5,3);
  if(m.air>0){m.air-=dt;const k=clamp(1-m.air/m.airT,0,1);m.x=m.jx0+(m.jx1-m.jx0)*k;m.y=m.jy0+(m.jy1-m.jy0)*k;m.jz=Math.sin(k*Math.PI)*28*m.size;
    if(m.air<=0){m.jz=0;m.x=m.jx1;m.y=m.jy1;burst(m.x,m.y,'#8a7a5a',14);S.shake=Math.max(S.shake,.15);if(!p.dead&&Math.hypot(p.x-m.x,p.y-m.y)<1.2)hurtPlayer(Math.round(m.dmg[1]*1.3),m.lvl,m);m.cd=.9;}return;}
  if(m.tel>0){m.tel-=dt;if(m.tel<=0){m.air=m.airT=.55;m.jx0=m.x;m.jy0=m.y;}return;}
  m.xt-=dt;if(m.xt<=0&&d>2.5&&d<7.5&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)){m.xt=rnd(4.5,6.5);m.jx1=p.x;m.jy1=p.y;m.tel=.85;
    S.hz.push({x:p.x,y:p.y,r:1.2,t:.15,arm:1.4,arm0:1.4,kind:'leap'});atkTip('leaper');return;}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Fouisseur (v6.21, remplace l’ancien terrier) : plonge, file sous terre vers toi, le sol se fissure 1 s, puis il sort, frappe et replonge */
BEHAV.burrow=function(m,dt,z,d,fd,spd){if(m.at==null)m.at=rnd(2,4);
  if(m.under){if(m.emerge>0){m.emerge-=dt;if(m.emerge<=0){m.under=false;m.x=m.ex;m.y=m.ey;m.at=2.2;m.cd=.4;burst(m.x,m.y,'#8a7a5a',18);}return;}
    m.ut-=dt;chase(m,dt,z,fd,spd*2.2);if(Math.random()<.3)S.parts.push({x:m.x+rnd(-.3,.3),y:m.y+rnd(-.3,.3),z:.05,vx:0,vy:0,vz:rnd(.5,1.2),life:.4,col:'#6a5a40'});
    if(m.ut<=0||d<1.4){m.emerge=1;m.ex=p.x;m.ey=p.y;S.hz.push({x:p.x,y:p.y,r:1.4,t:.15,arm:1,arm0:1,kind:'slam',crack:true,hit:Math.round(m.dmg[1]*1.4),L:m.lvl});atkTip('burrow');}return;}
  m.at-=dt;if(m.at<=0&&d>2.5&&d<12&&fd>=0){m.under=true;m.ut=2.5;m.emerge=0;burst(m.x,m.y,'#6a5a40',14);return;}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Bombardier : lance des bombes qui explosent après un moment ; mèche allumée et cercle qui se remplit */
BEHAV.grenadier=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(1,2.5);
  if(d<8&&fd>=0&&fd<12&&losClear(z,m.x,m.y,p.x,p.y)){m.xt-=dt;
    if(m.xt<=0&&S.hz.filter(h=>h.kind==='bomb').length<6){m.xt=rnd(3,4);m.atk=.4;const f=nearFloor(z,p.x+rnd(-.5,.5),p.y+rnd(-.5,.5))||[Math.floor(p.x),Math.floor(p.y)];
      S.hz.push({x:f[0]+.5,y:f[1]+.5,r:1.6,t:.15,arm:2,arm0:2,fly:.55,ox:m.x,oy:m.y,kind:'bomb',hit:Math.round(m.dmg[1]*1.6),L:m.lvl,bc:'#ff9a3a'});sfx('cast');atkTip('grenadier');}
    if(d<3.2){const dx=m.x-p.x,dy=m.y-p.y,l=Math.hypot(dx,dy)||1;step(m,dx/l,dy/l,spd*.8*dt,z);}return;}
  chase(m,dt,z,fd,spd);};
/* Tourbillon : envoie un tourbillon qui erre vers toi, pousse et blesse ; la poussière tourne 1 s avant qu’il se forme */
BEHAV.whirler=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(2,4);m.xt-=dt;
  if(m.xt<=0&&d<9&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)&&S.hz.filter(h=>h.kind==='whirl').length<3){m.xt=rnd(6,8);m.atk=.5;const a=Math.atan2(p.y-m.y,p.x-m.x),f=nearFloor(z,m.x+Math.cos(a)*1.3,m.y+Math.sin(a)*1.3)||[Math.floor(m.x),Math.floor(m.y)];
    S.hz.push({x:f[0]+.5,y:f[1]+.5,r:1.1,t:6,arm:1,arm0:1,kind:'whirl',dps:Math.max(1,Math.round(m.dmg[0]*.8)),L:m.lvl,wa:rnd(0,6.28),ice:(z.palTheme||curWorld().theme)==='givre'});atkTip('whirler');}
  (m.ranged?BEHAV.ranged:BEHAV.melee)(m,dt,z,d,fd,spd);};
/* Pics de glace : une ligne de pics sort du sol vers toi ; le givre court au sol avant */
BEHAV.icespike=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(2,3.5);m.xt-=dt;
  if(m.xt<=0&&d<8&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)){m.xt=rnd(5,6.5);m.atk=.5;const a=Math.atan2(p.y-m.y,p.x-m.x),g=++HZG;
    for(let k=1;k<=9;k++){const x=m.x+Math.cos(a)*k*.95,y=m.y+Math.sin(a)*k*.95;if(isWall(z,Math.floor(x),Math.floor(y)))break;S.hz.push({x,y,r:.75,t:.15,arm:.95+k*.09,arm0:.95+k*.09,kind:'slam',ice:true,grp:g,hit:Math.round(m.dmg[1]*1.1),L:m.lvl});}atkTip('icespike');}
  (m.ranged?BEHAV.ranged:BEHAV.melee)(m,dt,z,d,fd,spd);};
/* Chargeur : gratte le sol, une ligne rouge montre sa course, puis il fonce tout droit ; s’il heurte un mur, il reste assommé */
BEHAV.bull=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(2,4);
  if(m.daze>0){m.daze-=dt;return;}
  if(m.chg>0){m.chg-=dt;const ox=m.x,oy=m.y,sp=11;step(m,m.cdx,m.cdy,sp*dt,z);
    if(!m.chHit&&dist(m,p)<.8+m.size*.3&&losClear(z,m.x,m.y,p.x,p.y)){m.chHit=true;hurtPlayer(Math.round(m.dmg[1]*1.5),m.lvl,m);S.shake=Math.max(S.shake,.3);step(p,m.cdx,m.cdy,.8,z);}
    if(Math.hypot(m.x-ox,m.y-oy)<sp*dt*.3){m.chg=0;if(!m.chHit&&m.chWall){m.daze=1.8;S.fx.push({x:m.x,y:m.y,t:'Assommé',col:'#e8d8a0',life:1});burst(m.x,m.y,'#c8b890',16);S.shake=Math.max(S.shake,.2);sfx('hit');}}
    if(m.chg<=0)m.chL=null;return;}
  if(m.tel>0){m.tel-=dt;m.flash=.06;if(Math.random()<.4)S.parts.push({x:m.x-m.cdx*.4+rnd(-.2,.2),y:m.y-m.cdy*.4+rnd(-.2,.2),z:.05,vx:-m.cdx*1.5,vy:-m.cdy*1.5,vz:rnd(.5,1.5),life:.4,col:'#7a6a50'});
    if(m.tel<=0){m.chg=m.chMax;m.chHit=false;sfx('boom');}return;}
  m.xt-=dt;if(m.xt<=0&&d>2.2&&d<8&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)){m.xt=rnd(5,7);const l=Math.hypot(p.x-m.x,p.y-m.y)||1;m.cdx=(p.x-m.x)/l;m.cdy=(p.y-m.y)/l;
    let L=0;for(;L<10;L+=.25)if(!free(z,m.x+m.cdx*(L+.25),m.y+m.cdy*(L+.25),.22))break;m.chWall=L<10;m.chL={x0:m.x,y0:m.y,x1:m.x+m.cdx*L,y1:m.y+m.cdy*L};m.chMax=L/11+(m.chWall?.2:0);m.tel=1;atkTip('bull');return;}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Harponneur : la chaîne brille dans sa main, puis il la lance ; touché, tu es tiré vers lui */
BEHAV.hooker=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(2,3.5);
  if(m.tel>0){m.tel-=dt;if(m.tel<=0){const dx=p.x-m.x,dy=p.y-m.y,l=Math.hypot(dx,dy)||1;S.proj.push({x:m.x,y:m.y,vx:dx/l*11,vy:dy/l*11,from:'m',kind:'hook',src:m,dmg:Math.max(1,m.dmg[0]),L:m.lvl,life:.8});m.atk=.3;sfx('cast');}return;}
  m.xt-=dt;if(m.xt<=0&&d>2.8&&d<7.5&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)){m.xt=rnd(5.5,7);m.tel=.8;atkTip('hooker');return;}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Cracheur d’acide : gonfle les joues, crache une flaque qui reste et ronge l’armure */
BEHAV.acid=function(m,dt,z,d,fd,spd){if(m.puff>0){m.puff-=dt;if(m.puff<=0){m.atk=.4;S.hz.push({x:m.ptx,y:m.pty,r:1.25,t:6,arm:.75,arm0:.75,kind:'acid',dps:Math.max(1,Math.round(m.dmg[1]*.6)),L:m.lvl});}return;}
  if(d<7.5&&fd>=0&&fd<11&&losClear(z,m.x,m.y,p.x,p.y)){if(m.cd<=0&&S.hz.filter(h=>h.kind==='acid').length<6){m.cd=3.2;m.puff=.55;m.ptx=p.x;m.pty=p.y;atkTip('acid');}
    if(d<3){const dx=m.x-p.x,dy=m.y-p.y,l=Math.hypot(dx,dy)||1;step(m,dx/l,dy/l,spd*.8*dt,z);}return;}
  chase(m,dt,z,fd,spd);};
/* Tireur d’élite : un fil rouge te suit, se fige 0,6 s avant le tir, puis un long rayon très fort part (les murs l’arrêtent) */
BEHAV.sniper=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(2,4);if(m.shot>0)m.shot-=dt;
  if(m.aim>0){m.aim-=dt;const vis=losClear(z,m.x,m.y,p.x,p.y);
    if(m.aim>.6){if(!vis){m.aim=0;m.beam=null;return;}m.beam={x:p.x,y:p.y,lock:false};}
    else if(m.beam&&!m.beam.lock){m.beam.lock=true;sfx('crit');}
    if(m.aim<=0&&m.beam){const a=Math.atan2(m.beam.y-m.y,m.beam.x-m.x);let L=.4;for(;L<14;L+=.2)if(isWall(z,Math.floor(m.x+Math.cos(a)*L),Math.floor(m.y+Math.sin(a)*L)))break;
      const ex=m.x+Math.cos(a)*L,ey=m.y+Math.sin(a)*L,vx=ex-m.x,vy=ey-m.y,u=clamp(((p.x-m.x)*vx+(p.y-m.y)*vy)/(vx*vx+vy*vy||1),0,1),qd=Math.hypot(m.x+vx*u-p.x,m.y+vy*u-p.y);
      if(qd<.55&&!p.dead)hurtPlayer(Math.round(m.dmg[1]*1.6),m.lvl,m);m.shot=.3;m.shotE={x:ex,y:ey};m.beam=null;m.atk=.3;sfx('boom');S.shake=Math.max(S.shake,.15);}
    return;}
  m.xt-=dt;if(m.xt<=0&&d<10&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)&&z.mons.filter(o=>o.aim>0&&!o.dead).length<2){m.xt=rnd(6.5,8);m.aim=1.6;m.beam={x:p.x,y:p.y,lock:false};atkTip('sniper');return;}
  BEHAV.ranged(m,dt,z,d,fd,spd);};
/* Saute-ombre : disparaît dans une fumée et ressort derrière toi ; la fumée noire montre où */
BEHAV.shade=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(2,4);
  if(m.hid>0){m.hid-=dt;if(m.hid<=0){m.x=m.sx;m.y=m.sy;burst(m.x,m.y,'#2a1a2a',20);m.cd=0;}return;}
  m.xt-=dt;if(m.xt<=0&&d>2.5&&d<9&&fd>=0){m.xt=rnd(1,2);const b=(p.face||0)+Math.PI;let f=null;
    for(const da of[0,.5,-.5,1,-1])for(const r of[1.4,1.1]){if(f)break;const x=p.x+Math.cos(b+da)*r,y=p.y+Math.sin(b+da)*r;if(!free(z,x,y,.22)||!z.flow||z.flow[Math.floor(y)*z.w+Math.floor(x)]<0||!losClear(z,p.x,p.y,x,y))continue;f=[x,y];}
    if(f){m.xt=rnd(5,7);m.hid=.9;m.sx=f[0];m.sy=f[1];burst(m.x,m.y,'#2a1a2a',20);S.hz.push({x:f[0],y:f[1],r:.9,t:.15,arm:.9,arm0:.9,kind:'smoke'});atkTip('shade');return;}}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Le cerf blanc : fuit (vers la case la plus loin du héros), s’arrête pour souffler, se défend s’il est acculé */
BEHAV.flee=function(m,dt,z,d,fd,spd){m.rest=(m.rest==null?3:m.rest)-dt;if(m.rest<0){if(m.rest<-1.6)m.rest=rnd(2.5,3.5);m.flash=0;if(d<1.2)BEHAV.melee(m,dt,z,d,fd,spd);return;}
  if(d>11||fd<0)return;const F=z.flow,cx=Math.floor(m.x),cy=Math.floor(m.y);let bv=F[cy*z.w+cx],tx=null,ty=null;
  for(const[dx,dy]of DIR8){const nx=cx+dx,ny=cy+dy;if(isWall(z,nx,ny))continue;if(dx&&dy&&(isWall(z,cx+dx,cy)||isWall(z,cx,cy+dy)))continue;const v=F[ny*z.w+nx];if(v>bv){bv=v;tx=nx+.5;ty=ny+.5;}}
  if(tx==null){if(d<1.2)BEHAV.melee(m,dt,z,d,fd,spd);return;}const l=Math.hypot(tx-m.x,ty-m.y)||1;step(m,(tx-m.x)/l,(ty-m.y)/l,spd*dt,z);m.face=Math.atan2(ty-m.y,tx-m.x);};
/* v6.23 : lot 2 des attaques ennemies */
/* Tireur en éventail : l’arc s’illumine 0,7 s, puis cinq flèches en cône */
BEHAV.fan=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(2,3.5);
  if(m.tel>0){m.tel-=dt;if(m.tel<=0){const a0=m.fanA!=null?m.fanA:Math.atan2(p.y-m.y,p.x-m.x);for(let k=-2;k<=2;k++){const a=a0+k*.24;S.proj.push({x:m.x,y:m.y,vx:Math.cos(a)*7.5,vy:Math.sin(a)*7.5,from:'m',kind:'arrow',dmg:Math.round(ri(m.dmg[0],m.dmg[1])*.85),L:m.lvl,life:1.4});}m.atk=.3;sfx('hit');}return;}
  m.xt-=dt;if(m.xt<=0&&d>2&&d<7.5&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)){m.xt=rnd(4.5,6);m.tel=.7;m.fanA=Math.atan2(p.y-m.y,p.x-m.x);m.cd=Math.max(m.cd,1.2);atkTip('fan');return;}
  BEHAV.ranged(m,dt,z,d,fd,spd);};
/* Tournoyeur : se penche et siffle 0,8 s, puis tourne 2,2 s, lames sorties, en avançant vers toi */
BEHAV.spinner=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(2,4);
  if(m.spin>0){m.spin-=dt;m.st2=(m.st2||0)-dt;chase(m,dt,z,fd,spd*1.35);if(m.st2<=0&&d<1.35&&losClear(z,m.x,m.y,p.x,p.y)){m.st2=.45;hurtPlayer(Math.round(m.dmg[1]*.7),m.lvl,m);}
    if(!p.eco&&Math.random()<.5)S.parts.push({x:m.x+rnd(-1,1),y:m.y+rnd(-1,1),z:.5,vx:rnd(-2,2),vy:rnd(-2,2),vz:rnd(.5,1.5),life:.3,col:'#e8e0c8'});return;}
  if(m.tel>0){m.tel-=dt;m.flash=.06;if(m.tel<=0){m.spin=2.2;m.st2=0;sfx('boom');}return;}
  m.xt-=dt;if(m.xt<=0&&d<5&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)){m.xt=rnd(6,8);m.tel=.8;sfx('cast');atkTip('spinner');return;}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Mortier : tir en cloche là où tu seras ; cible au sol 1,5 s avant l’impact */
BEHAV.mortar=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(1.5,3);const vx=m.lpx!=null?(p.x-m.lpx)/Math.max(dt,1e-3):0,vy=m.lpy!=null?(p.y-m.lpy)/Math.max(dt,1e-3):0;m.lpx=p.x;m.lpy=p.y;
  if(d<9&&fd>=0&&fd<13&&losClear(z,m.x,m.y,p.x,p.y)){m.xt-=dt;
    if(m.xt<=0&&S.hz.filter(h=>h.mort).length<4){m.xt=rnd(3.5,4.5);m.atk=.4;const lead=clamp(Math.hypot(vx,vy),0,6)>.5?1.2:0,f=nearFloor(z,p.x+clamp(vx,-6,6)*lead,p.y+clamp(vy,-6,6)*lead)||[Math.floor(p.x),Math.floor(p.y)];
      S.hz.push({x:f[0]+.5,y:f[1]+.5,r:1.3,t:.15,arm:1.5,arm0:1.5,kind:'slam',mort:true,hit:Math.round(m.dmg[1]*1.5),L:m.lvl});sfx('cast');atkTip('mortar');}
    if(d<3.5){const dx=m.x-p.x,dy=m.y-p.y,l=Math.hypot(dx,dy)||1;step(m,dx/l,dy/l,spd*.8*dt,z);}return;}
  chase(m,dt,z,fd,spd);};
/* Tisseuse : fils blancs qui tremblent 0,6 s, puis une toile lente qui t’immobilise 1 s */
BEHAV.webber=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(2,4);
  if(m.tel>0){m.tel-=dt;if(m.tel<=0){const dx=p.x-m.x,dy=p.y-m.y,l=Math.hypot(dx,dy)||1;S.proj.push({x:m.x,y:m.y,vx:dx/l*6,vy:dy/l*6,from:'m',kind:'webshot',dmg:Math.max(1,Math.round(m.dmg[0]*.6)),L:m.lvl,life:1.5});m.atk=.3;}return;}
  m.xt-=dt;if(m.xt<=0&&d>2&&d<8&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)){m.xt=rnd(5.5,7);m.tel=.6;atkTip('webber');return;}
  (m.ranged?BEHAV.ranged:BEHAV.melee)(m,dt,z,d,fd,spd);};
/* Meute : un hurlement, les loups tournent autour de toi 2 s, puis bondissent ensemble */
BEHAV.wolf=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(2,4);
  if(m.dash>0){m.dash-=dt;const ox=m.x,oy=m.y;step(m,m.ddx,m.ddy,8.5*dt,z);if(!m.dHit&&dist(m,p)<.85&&losClear(z,m.x,m.y,p.x,p.y)){m.dHit=true;hurtPlayer(Math.round(m.dmg[1]*1.1),m.lvl,m);}if(Math.hypot(m.x-ox,m.y-oy)<.03)m.dash=0;return;}
  if(m.circ>0&&m.circ<=1){m.circ-=dt;if(!m.dlock){const l=Math.hypot(p.x-m.x,p.y-m.y)||1;m.ddx=(p.x-m.x)/l;m.ddy=(p.y-m.y)/l;m.dlock=true;m.tel=m.circ;m.tel0=m.circ;S.hz.push({x:m.x,y:m.y,r:.8,t:99,kind:'bline',src:m,len:4.3});}m.tel=m.circ;m.face=Math.atan2(m.ddy,m.ddx);
    if(m.circ<=0){m.dlock=false;m.tel=0;m.dash=.5;m.dHit=false;}return;}
  if(m.circ>0){m.circ-=dt;m.ca+=dt*1.1;const tx=p.x+Math.cos(m.ca)*3.2,ty=p.y+Math.sin(m.ca)*3.2,l=Math.hypot(tx-m.x,ty-m.y);if(l>.1)step(m,(tx-m.x)/l,(ty-m.y)/l,Math.min(l,spd*1.3*dt),z);m.face=Math.atan2(p.y-m.y,p.x-m.x);
    return;}
  m.xt-=dt;if(m.xt<=0&&d<8&&fd>=0){m.xt=rnd(7,9);const P=z.mons.filter(o=>!o.dead&&o.ai==='wolf'&&!(o.circ>0)&&!(o.dash>0)&&o.aggro&&dist(o,p)<9&&losClear(z,o.x,o.y,p.x,p.y));
    if(P.length>=3){P.forEach((o,i)=>{o.circ=3;o.ca=Math.atan2(o.y-p.y,o.x-p.x);o.xt=rnd(7,9);});S.fx.push({x:m.x,y:m.y,t:'Hurlement',col:'#d8e8ff',life:1.2});sfx('portal');atkTip('wolf');return;}}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Nova lente : il se gonfle et brille 0,9 s, puis un anneau lent part de lui (on le fuit) */
BEHAV.slownova=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(3,5);
  if(m.swell>0){m.swell-=dt;m.flash=.05;if(m.swell<=0){S.hz.push({x:m.x,y:m.y,r:6,t:6,arm:0,kind:'ring',sp:2.2,hit:Math.round(m.dmg[1]*1.2),L:m.lvl,col:'255,120,90'});sfx('boom');}return;}
  m.xt-=dt;if(m.xt<=0&&d<5.5&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)){m.xt=rnd(7,9);m.swell=.9;atkTip('slownova');return;}
  (m.ranged?BEHAV.ranged:BEHAV.melee)(m,dt,z,d,fd,spd);};
/* Boomerang : on voit sa course en pointillé 0,6 s ; l’arme part et revient (deux chances de toucher) */
BEHAV.boomer=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(2,3.5);
  if(m.tel>0){m.tel-=dt;if(m.tel<=0&&m.bmA!=null){S.proj.push({x:m.x,y:m.y,vx:Math.cos(m.bmA)*8,vy:Math.sin(m.bmA)*8,from:'m',kind:'boom',boom:true,src:m,bt:0,half:.8,dmg:Math.round(ri(m.dmg[0],m.dmg[1])*1.1),L:m.lvl,life:3});m.bmA=null;m.atk=.3;sfx('cast');}return;}
  m.xt-=dt;if(m.xt<=0&&d>1.8&&d<7&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)){m.xt=rnd(4.5,6);m.tel=.6;m.bmA=Math.atan2(p.y-m.y,p.x-m.x);m.cd=Math.max(m.cd,1);atkTip('boomer');return;}
  BEHAV.ranged(m,dt,z,d,fd,spd);};
/* Traîneur : laisse derrière lui une traînée qui fume puis brûle */
BEHAV.trailer=function(m,dt,z,d,fd,spd){if(m.aggro&&fd>=0){m.trT=(m.trT||0)-dt;if(m.trT<=0){m.trT=.4;if(S.hz.filter(h=>h.trail).length<36){S.hz.push({x:m.x,y:m.y,r:.6,t:3,arm:.5,arm0:.5,kind:'fire',trail:true,dps:Math.max(1,Math.round(m.dmg[0]*.5)),L:m.lvl});if(d<6)atkTip('trailer');}}}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* v6.24 : lot 3 des attaques ennemies */
/* Embusqué : invisible (un léger miroitement) jusqu’à ce que tu passes tout près */
BEHAV.lurker=function(m,dt,z,d,fd,spd){if(!m.revealed){m.lurk=true;if(d<2.4&&fd>=0){m.lurk=false;m.revealed=true;burst(m.x,m.y,'#a8b890',16);m.cd=.3;S.fx.push({x:m.x,y:m.y,t:'Embusqué !',col:'#e8d8a0',life:1});atkTip('lurker');}else return;}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Agrippeur : rampe vite, s’accroche, ralentit et grignote jusqu’à ce qu’on le frappe */
BEHAV.grabber=function(m,dt,z,d,fd,spd){if(m.grab){m.x=p.x+.3;m.y=p.y+.15;p.grabbed=.15;m.gt=(m.gt||0)-dt;if(m.gt<=0){m.gt=1;hurtPlayer(Math.max(1,Math.round(m.dmg[0]*.6)),m.lvl,null);}return;}
  if(d<.9&&m.cd<=0&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)&&!z.mons.some(o=>o!==m&&o.grab&&!o.dead)){m.grab=true;m.gt=1;hurtPlayer(Math.max(1,m.dmg[0]),m.lvl,null);S.fx.push({x:p.x,y:p.y,t:'Agrippé',col:'#c8e0a0',life:.9});atkTip('grabber');return;}
  chase(m,dt,z,fd,spd*1.25);};
/* Ricocheur : un trajet en pointillé qui rebondit deux fois sur les murs, puis le tir */
function ricoPath(z,x,y,a,n){const P=[[x,y]];let vx=Math.cos(a)*.2,vy=Math.sin(a)*.2,b=n;for(let i=0;i<60;i++){const nx=x+vx,ny=y+vy;if(isWall(z,Math.floor(nx),Math.floor(ny))){if(b<=0){P.push([x,y]);break;}b--;const wx=isWall(z,Math.floor(nx),Math.floor(y)),wy=isWall(z,Math.floor(x),Math.floor(ny));if(wx||!wy)vx=-vx;if(wy||!wx)vy=-vy;P.push([x,y]);continue;}x=nx;y=ny;}P.push([x,y]);return P;}
BEHAV.rico=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(2,3.5);
  if(m.tel>0){m.tel-=dt;if(m.tel<=0&&m.rcA!=null){S.proj.push({x:m.x,y:m.y,vx:Math.cos(m.rcA)*7,vy:Math.sin(m.rcA)*7,from:'m',kind:'arrow',bounce:2,dmg:Math.round(ri(m.dmg[0],m.dmg[1])*1.1),L:m.lvl,life:1.8});m.rcA=null;m.atk=.3;sfx('hit');}return;}
  m.xt-=dt;if(m.xt<=0&&d<9&&fd>=0&&fd<12){const a=Math.atan2(p.y-m.y,p.x-m.x);let A=null;if(losClear(z,m.x,m.y,p.x,p.y))A=a;else for(let k=0;k<24&&A==null;k++){const b=k/24*6.28,P=ricoPath(z,m.x,m.y,b,2);for(let i=1;i<P.length;i++){const[x0,y0]=P[i-1],[x1,y1]=P[i],vx=x1-x0,vy=y1-y0,u=clamp(((p.x-x0)*vx+(p.y-y0)*vy)/(vx*vx+vy*vy||1),0,1);if(Math.hypot(x0+vx*u-p.x,y0+vy*u-p.y)<.5){A=b;break;}}}
    if(A!=null){m.xt=rnd(4,5.5);m.tel=.7;m.rcA=A;m.rcP=ricoPath(z,m.x,m.y,A,2);m.cd=Math.max(m.cd,1);atkTip('rico');return;}m.xt=1;}
  BEHAV.ranged(m,dt,z,d,fd,spd);};
/* Pluie de roches : des ombres rondes au sol autour de toi, puis les roches tombent (un seul coup par volée) */
BEHAV.rocker=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(3,5);m.xt-=dt;
  if(m.xt<=0&&d<7&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)){m.xt=rnd(8,10);m.atk=.5;const g=++HZG;for(let k=0;k<6;k++){const q=k?evRand(z,.8,3.2):[p.x,p.y];if(q)S.hz.push({x:q[0],y:q[1],r:.95,t:.15,arm:1.2+k*.15,arm0:1.2+k*.15,kind:'slam',rock:true,grp:g,hit:Math.round(m.dmg[1]*.9),L:m.lvl});}sfx('boom');atkTip('rocker');}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Mur de feu : une ligne de braises 1 s, puis un mur de flammes qui avance lentement vers toi */
BEHAV.firewall=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(3,5);m.xt-=dt;
  if(m.xt<=0&&d<8&&d>2&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)&&!S.hz.some(h=>h.kind==='fwall')){m.xt=rnd(9,11);m.atk=.5;const l=Math.hypot(p.x-m.x,p.y-m.y)||1,dx=(p.x-m.x)/l,dy=(p.y-m.y)/l;
    S.hz.push({x:m.x+dx*1.5,y:m.y+dy*1.5,dx,dy,hl:2.5,sp:1.6,r:2.5,t:5.5,arm:1,arm0:1,kind:'fwall',dps:Math.max(1,Math.round(m.dmg[1]*.9)),L:m.lvl});atkTip('firewall');}
  (m.ranged?BEHAV.ranged:BEHAV.melee)(m,dt,z,d,fd,spd);};
/* Verglas : il laisse des plaques de glace (le sol bleuit 1 s) ; dessus, tu glisses */
BEHAV.icer=function(m,dt,z,d,fd,spd){if(m.aggro&&d<7&&fd>=0){m.it=(m.it==null?rnd(1,3):m.it)-dt;if(m.it<=0){m.it=rnd(5,7);if(S.hz.filter(h=>h.kind==='ice').length<6){S.hz.push({x:m.x,y:m.y,r:1.5,t:9,arm:1,arm0:1,kind:'ice'});atkTip('icer');}}}
  BEHAV.melee(m,dt,z,d,fd,spd);};
/* Rayon tournant : un rayon pâle fait un tour (1,2 s), puis il tourne pour de vrai autour de lui (les murs le coupent) */
BEHAV.rotor=function(m,dt,z,d,fd,spd){if(m.xt==null)m.xt=rnd(3,5);
  if(m.rot){const R_=m.rot;R_.t+=dt;const pre=R_.t<1.2;R_.a+=(pre?6.28/1.2:6.28/3.5)*dt;let L=.4;for(;L<5.5;L+=.2)if(isWall(z,Math.floor(m.x+Math.cos(R_.a)*L),Math.floor(m.y+Math.sin(R_.a)*L)))break;R_.L=L;
    if(!pre){R_.cd-=dt;const qx=p.x-m.x,qy=p.y-m.y,al=qx*Math.cos(R_.a)+qy*Math.sin(R_.a),pe=Math.abs(-qx*Math.sin(R_.a)+qy*Math.cos(R_.a));if(R_.cd<=0&&al>0&&al<L&&pe<.45&&!p.dead){R_.cd=.8;hurtPlayer(Math.round(m.dmg[1]*.9),m.lvl,m);}}
    if(R_.t>=4.7)m.rot=null;return;}
  m.xt-=dt;if(m.xt<=0&&d<5.5&&fd>=0&&losClear(z,m.x,m.y,p.x,p.y)){m.xt=rnd(9,11);m.rot={a:Math.atan2(p.y-m.y,p.x-m.x)+Math.PI,t:0,cd:0,L:5};atkTip('rotor');return;}
  (m.ranged?BEHAV.ranged:BEHAV.melee)(m,dt,z,d,fd,spd);};
/* Chapardeur : court vers toi sans arme, vole de l’or ou une fiole, puis s’enfuit ; abattu, il rend le double */
BEHAV.thief=function(m,dt,z,d,fd,spd){if(m.loot){m.ft-=dt;if(m.ft<=0||fd<0||d>16){burst(m.x,m.y,'#6a7a4a',16);m.noLoot=true;m.dead=true;m.dt=99;toast('Le chapardeur s’est enfui avec ton butin');return;}
    const F=z.flow,cx=Math.floor(m.x),cy=Math.floor(m.y);let bv=F[cy*z.w+cx],tx=null,ty=null;for(const[dx,dy]of DIR8){const nx=cx+dx,ny=cy+dy;if(isWall(z,nx,ny))continue;if(dx&&dy&&(isWall(z,cx+dx,cy)||isWall(z,cx,cy+dy)))continue;const v=F[ny*z.w+nx];if(v>bv){bv=v;tx=nx+.5;ty=ny+.5;}}
    if(tx!=null){const l=Math.hypot(tx-m.x,ty-m.y)||1;step(m,(tx-m.x)/l,(ty-m.y)/l,spd*1.1*dt,z);}return;}
  if(d<.8&&losClear(z,m.x,m.y,p.x,p.y)&&!p.dead){if(p.gold>=20){const g=Math.max(1,Math.round(Math.min(p.gold*.08,40*(1+.3*(m.lvl-1)))));p.gold-=g;m.loot={gold:g};S.fx.push({x:p.x,y:p.y,t:`Volé : ${fmt(g)} or`,col:'#e8c46a',life:1.2});}
    else if(p.pot>0){p.pot--;m.loot={pot:1};S.fx.push({x:p.x,y:p.y,t:'Volé : une fiole',col:'#ff8a7a',life:1.2});}else{m.loot={gold:0};}m.ft=12;sfx('gold');atkTip('thief');return;}
  if(d<9)atkTip('thief');chase(m,dt,z,fd,spd);};
/* Miroir : devient argenté (on le voit venir 0,6 s) ; tant qu’il brille, tes sorts te reviennent */
BEHAV.mirror=function(m,dt,z,d,fd,spd){m.mt=(m.mt==null?rnd(2,4):m.mt)-dt;if(m.mirror>0)m.mirror-=dt;
  if(m.mt<=0&&d<9){m.mt=rnd(7,9);m.mpre=.6;}if(m.mpre>0){m.mpre-=dt;if(m.mpre<=0){m.mirror=2.4;atkTip('mirror');sfx('crit');}}
  BEHAV.shield(m,dt,z,d,fd,spd);};
/* v6.25 : le boss de l’acte I (Varsha et ses versions) en deux formes. À zéro dans la première, il s’effondre, puis se relève plus grand, plus rapide et plus dangereux. */
const VARSHA2={hp:.55,pause:2.6,size:1.18,dmg:1.15,jump:7,fire:5};
function varshaFall(m){const z=S.cur;m.hp=1;m.fake=VARSHA2.pause;m.fallen=true;m.stun=VARSHA2.pause;S.hz=[];S.proj=S.proj.filter(q=>q.from!=='m');p.inv=Math.max(p.inv||0,VARSHA2.pause+.4);p.target=null;
  for(const o of z.mons)if(!o.dead&&!o.boss){o.hp=0;o.dead=true;o.dt=0;}burst(m.x,m.y,'#ff7a2a',40);S.shake=.5;toast(monN(m.t)+' s’effondre');S.pend.push({t:1.2,fn:()=>{if(m.fake>0)say('Le silence… puis le sol se met à gronder. Ce n’est pas fini.');}});}
function varshaRise(m,z){m.fake=0;m.fallen=false;m.stun=0;m.form=2;m.hp=m.maxHp;m.size*=VARSHA2.size;m.dmg=m.dmg.map(v=>Math.round(v*VARSHA2.dmg));m.bd=Math.round(m.bd*VARSHA2.dmg);m.spd*=1.15;m.aggro=true;m.jt=2.5;m.ft2=1.5;
  for(let i=0;i<3;i++)burst(m.x+rnd(-1,1),m.y+rnd(-1,1),'#ff5a2a',30);S.shake=Math.max(S.shake,.8);sfx('boom');toast(monN(m.t)+' se relève : forme 2 sur 2');say('La bête se relève, plus grande et plus rapide : elle bondit sur toi et le sol brûle. Regarde les ombres et les braises.',5200);}
/* Dessin des signaux au sol (vrai si le danger a été dessiné ici) */
function drawHzX(h,sx,sy,rx,ry){const k=h.arm0?clamp(1-Math.max(0,h.arm)/h.arm0,0,1):1;
  if(h.kind==='bite'||h.kind==='bline'){const m=h.src;if(!m||m.dead||S.cur.mons.indexOf(m)<0||!((h.kind==='bite'?m.bite:m.tel)>0)){h.t=0;return true;}const q=clamp(1-(h.kind==='bite'?m.bite/BITE.wind:m.tel/(m.tel0||1)),0,1);
    if(h.kind==='bite'){ctx.fillStyle=`rgba(200,30,20,${(.15+.4*q).toFixed(2)})`;ctx.beginPath();ctx.ellipse(sx,sy,rx*(.35+.65*q),ry*(.35+.65*q),0,0,7);ctx.fill();ctx.strokeStyle=`rgba(255,80,60,${(.55+.4*q).toFixed(2)})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.stroke();}
    else{const A=scr(m.x,m.y),B=scr(m.x+m.ddx*h.len,m.y+m.ddy*h.len);ctx.lineCap='round';ctx.strokeStyle=`rgba(200,30,20,${(.15+.35*q).toFixed(2)})`;ctx.lineWidth=1.6*TH*Z*.9;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();ctx.strokeStyle=`rgba(255,80,60,${(.5+.45*q).toFixed(2)})`;ctx.lineWidth=2;ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);}
    return true;}
  /* v6.22 : signaux des événements de monde */
  if(h.kind==='line'||h.kind==='streak'){const A=scr(h.x0,h.y0),B=scr(h.x1,h.y1);ctx.lineCap='round';
    if(h.kind==='line'){ctx.strokeStyle=`rgba(235,235,255,${(.15+.45*k).toFixed(2)})`;ctx.lineWidth=h.r*2*TH*Z*.9;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();ctx.strokeStyle=`rgba(255,255,255,${(.4+.5*k).toFixed(2)})`;ctx.lineWidth=1.5;ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);}
    else{const a=Math.min(1,h.t/.4);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(230,230,255,${(.7*a).toFixed(2)})`;ctx.lineWidth=h.r*2*TH*Z*1.1*a;ctx.beginPath();ctx.moveTo(A[0],A[1]-14*Z);ctx.lineTo(B[0],B[1]-14*Z);ctx.stroke();ctx.globalCompositeOperation='source-over';}return true;}
  if(h.kind==='ring'&&h.gap!=null){const cr=h.arm>0?h.r:(h.cr||.6),pts=[];for(let a=h.gap+.55;a<=h.gap+2*Math.PI-.55;a+=.08)pts.push(scr(h.x+Math.cos(a)*cr,h.y+Math.sin(a)*cr));
    ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));if(h.arm>0){ctx.setLineDash([5,5]);ctx.strokeStyle='rgba(220,210,255,.7)';ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);}
    else{ctx.strokeStyle=`rgba(${h.col},.9)`;ctx.lineWidth=5*Z;ctx.stroke();ctx.strokeStyle=`rgba(${h.col},.25)`;ctx.lineWidth=12*Z;ctx.stroke();}
    const g=scr(h.x+Math.cos(h.gap)*cr,h.y+Math.sin(h.gap)*cr);ctx.fillStyle='rgba(140,255,160,.8)';ctx.beginPath();ctx.arc(g[0],g[1],4*Z,0,7);ctx.fill();return true;}
  if(h.kind==='slam'&&h.star&&h.arm>0){ctx.setLineDash([5,5]);ctx.strokeStyle='rgba(255,240,180,.85)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.stroke();ctx.setLineDash([]);
    const fy=sy-(1-k)*360*Z,fx=sx+(1-k)*120*Z;ctx.globalCompositeOperation='lighter';glowG(ctx,fx,fy,12*Z,'255,240,190',.9);ctx.strokeStyle='rgba(255,240,200,.5)';ctx.lineWidth=3*Z;ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+30*Z,fy-90*Z);ctx.stroke();ctx.globalCompositeOperation='source-over';return true;}
  if(h.kind==='slam'&&h.mort&&h.arm>0){ctx.strokeStyle=`rgba(255,90,60,${(.5+.4*k).toFixed(2)})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(sx-rx,sy);ctx.lineTo(sx+rx,sy);ctx.moveTo(sx,sy-ry);ctx.lineTo(sx,sy+ry);ctx.stroke();
    ctx.fillStyle=`rgba(255,90,60,${(.1+.25*k).toFixed(2)})`;ctx.beginPath();ctx.ellipse(sx,sy,rx*k,ry*k,0,0,7);ctx.fill();const by=sy-(1-k)*300*Z;ctx.fillStyle='#2a2420';ctx.beginPath();ctx.arc(sx,by,4.5*Z,0,7);ctx.fill();return true;}
  if(h.kind==='slam'&&h.rock&&h.arm>0){ctx.fillStyle=`rgba(0,0,0,${(.2+.45*k).toFixed(2)})`;ctx.beginPath();ctx.ellipse(sx,sy,rx*(.4+.6*k),ry*(.4+.6*k),0,0,7);ctx.fill();if(k>.6){const by=sy-(1-k)*240*Z;ctx.fillStyle='#5a4a40';ctx.beginPath();ctx.arc(sx,by-6*Z,6*Z,0,7);ctx.fill();}return true;}
  if(h.kind==='ice'){const a=h.arm>0?k:Math.min(1,h.t/1.5);ctx.fillStyle=`rgba(170,215,255,${(.35*a).toFixed(2)})`;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.fill();ctx.strokeStyle=`rgba(235,248,255,${(.55*a).toFixed(2)})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(sx,sy,rx*.9,ry*.9,0,Math.PI*1.1,Math.PI*1.7);ctx.stroke();return true;}
  if(h.kind==='fwall'){const ex=-h.dy,ey=h.dx,A=scr(h.x+ex*h.hl,h.y+ey*h.hl),B=scr(h.x-ex*h.hl,h.y-ey*h.hl);
    if(h.arm>0){ctx.strokeStyle=`rgba(255,120,40,${(.3+.5*k).toFixed(2)})`;ctx.lineWidth=5*Z;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();return true;}
    for(let i=0;i<=8;i++){const u=i/8,fx=A[0]+(B[0]-A[0])*u,fy=A[1]+(B[1]-A[1])*u;flame(fx,fy,Z*1.3,i*1.7+h.x);}ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,120,40,.35)';ctx.lineWidth=14*Z;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();ctx.globalCompositeOperation='source-over';return true;}
  if((h.trail||h.vfire)&&h.arm>0){ctx.fillStyle=`rgba(90,80,70,${(.25+.3*k).toFixed(2)})`;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.fill();if(!p.eco&&Math.random()<.2)S.parts.push({x:h.x,y:h.y,z:.1,vx:0,vy:0,vz:rnd(.5,1),life:.5,col:'#6a6058'});return true;}
  if(h.kind==='leap'){if(h.arm<=0)return true;ctx.fillStyle=`rgba(0,0,0,${(.25+.45*k).toFixed(2)})`;ctx.beginPath();ctx.ellipse(sx,sy,rx*(.3+.7*k),ry*(.3+.7*k),0,0,7);ctx.fill();ctx.strokeStyle=`rgba(220,90,60,${(.3+.5*k).toFixed(2)})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.stroke();return true;}
  if(h.kind==='smoke'){if(h.arm<=0)return true;for(let i=0;i<6;i++){const a=i*1.05+S.t*2,r=(.3+.7*k)*rx*.5;ctx.fillStyle=`rgba(14,8,16,${(.35+.4*k).toFixed(2)})`;ctx.beginPath();ctx.ellipse(sx+Math.cos(a)*r,sy+Math.sin(a)*r*.5-k*10*Z,rx*.35*(.5+k),ry*.5*(.5+k),0,0,7);ctx.fill();}return true;}
  if(h.kind==='bomb'){if(h.arm<=0)return false;ctx.setLineDash([5,5]);ctx.strokeStyle='rgba(255,140,50,.9)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=`rgba(255,110,40,${(.12+.3*k).toFixed(2)})`;ctx.beginPath();ctx.ellipse(sx,sy,rx*k,ry*k,0,0,7);ctx.fill();
    const fl=h.arm0-h.arm,f=h.fly?clamp(fl/h.fly,0,1):1,[ox,oy]=scr(h.ox==null?h.x:h.ox,h.oy==null?h.y:h.oy),bx=ox+(sx-ox)*f,by=oy+(sy-oy)*f-Math.sin(f*Math.PI)*60*Z-6*Z;
    ctx.fillStyle='#2a2420';ctx.beginPath();ctx.arc(bx,by,5*Z,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(bx-2*Z,by-3*Z,1.5*Z,1.5*Z);
    if(f>=1){const a=.6+.4*Math.sin(S.t*30);ctx.fillStyle=`rgba(255,${200+((S.t*80)|0)%55},80,${a.toFixed(2)})`;ctx.beginPath();ctx.arc(bx+3*Z,by-6*Z,2+Math.random()*1.5*Z,0,7);ctx.fill();}return true;}
  if(h.kind==='whirl'){const n=h.arm>0?3:5,al=h.arm>0?.35+.45*k:.95,col=h.ice?'225,240,255':'235,205,150';if(h.arm<=0){ctx.fillStyle=`rgba(${col},.18)`;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.fill();}ctx.strokeStyle=`rgba(${col},${al.toFixed(2)})`;ctx.lineWidth=3*Z;
    for(let i=0;i<n;i++){const a0=S.t*(h.arm>0?4:9)+i*6.28/n,rr=(h.arm>0?.5+.5*k:1)*(1-i*.12);ctx.beginPath();ctx.ellipse(sx,sy-(h.arm>0?0:i*7*Z),rx*rr,ry*rr,0,a0,a0+2.2);ctx.stroke();}
    if(h.arm<=0&&!p.eco&&Math.random()<.5)S.parts.push({x:h.x+rnd(-.6,.6),y:h.y+rnd(-.6,.6),z:.1,vx:rnd(-1,1),vy:rnd(-1,1),vz:rnd(1,3),life:.5,col:h.ice?'#e8f4ff':'#c8a878'});return true;}
  if(h.kind==='slam'&&h.crack&&h.arm>0){const j=(Math.random()-.5)*2*Z*k;ctx.strokeStyle=`rgba(30,18,8,${(.4+.5*k).toFixed(2)})`;ctx.lineWidth=2*Z;ctx.beginPath();
    for(let i=0;i<7;i++){const a=i*.9+h.x,L=(.25+.75*k);ctx.moveTo(sx+j,sy);ctx.lineTo(sx+j+Math.cos(a)*rx*L*.5,sy+Math.sin(a)*ry*L*.5);ctx.lineTo(sx+j+Math.cos(a+.3)*rx*L,sy+Math.sin(a+.3)*ry*L);}ctx.stroke();
    ctx.setLineDash([4,5]);ctx.strokeStyle='rgba(200,160,100,.6)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.stroke();ctx.setLineDash([]);if(!p.eco&&Math.random()<.4)S.parts.push({x:h.x+rnd(-.8,.8),y:h.y+rnd(-.8,.8),z:.05,vx:0,vy:0,vz:rnd(.6,1.4),life:.4,col:'#8a7a5a'});return true;}
  if(h.kind==='slam'&&h.ice&&h.arm>0){const hw=TW/2*Z*.55,hh=TH/2*Z*.55;ctx.fillStyle=`rgba(190,230,255,${(.12+.5*k).toFixed(2)})`;ctx.beginPath();ctx.moveTo(sx,sy-hh);ctx.lineTo(sx+hw,sy);ctx.lineTo(sx,sy+hh);ctx.lineTo(sx-hw,sy);ctx.closePath();ctx.fill();
    ctx.strokeStyle=`rgba(240,250,255,${(.2+.6*k).toFixed(2)})`;ctx.lineWidth=1;ctx.stroke();return true;}
  if(h.kind==='shard'){const a=Math.min(1,h.t*3);ctx.fillStyle=`rgba(200,235,255,${(.85*a).toFixed(2)})`;for(let i=0;i<3;i++){const dx=(i-1)*5*Z,hh=(14+i%2*8)*Z*a;ctx.beginPath();ctx.moveTo(sx+dx-3*Z,sy);ctx.lineTo(sx+dx,sy-hh);ctx.lineTo(sx+dx+3*Z,sy);ctx.fill();}return true;}
  if(h.kind==='acid'){if(h.arm>0){ctx.setLineDash([5,5]);ctx.strokeStyle='rgba(150,230,80,.85)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.stroke();ctx.setLineDash([]);
      const gy=sy-(1-k)*70*Z;ctx.fillStyle='rgba(140,220,60,.9)';ctx.beginPath();ctx.arc(sx,gy,4*Z,0,7);ctx.fill();return true;}
    const a=Math.min(1,h.t);const g=ctx.createRadialGradient(sx,sy,0,sx,sy,rx);g.addColorStop(0,`rgba(150,230,70,${(.55*a).toFixed(2)})`);g.addColorStop(.75,`rgba(80,140,30,${(.35*a).toFixed(2)})`);g.addColorStop(1,'rgba(40,70,20,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(sx,sy,rx,ry,0,0,7);ctx.fill();
    if(!p.eco&&Math.random()<.25)S.parts.push({x:h.x+rnd(-.8,.8),y:h.y+rnd(-.8,.8),z:.02,vx:0,vy:0,vz:rnd(.3,.8),life:.4,col:'#b8f070'});return true;}
  return false;}
/* Signaux portés par les monstres : ligne de charge, fil du tireur, rayon, chaîne, étourdi */
function drawAtkMarks(z){for(const m of z.mons){if(m.dead)continue;
    if(m.chL&&m.tel>0){const A=scr(m.chL.x0,m.chL.y0),B=scr(m.chL.x1,m.chL.y1),k=1-m.tel;ctx.strokeStyle=`rgba(230,50,30,${(.35+.5*k).toFixed(2)})`;ctx.lineWidth=(6+6*k)*Z;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();
      ctx.strokeStyle='rgba(255,180,150,.6)';ctx.lineWidth=1.5;ctx.stroke();}
    if(m.beam){const a=Math.atan2(m.beam.y-m.y,m.beam.x-m.x),A=scr(m.x,m.y),B=scr(m.x+Math.cos(a)*13,m.y+Math.sin(a)*13);ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();
      ctx.strokeStyle=m.beam.lock?'rgba(255,40,30,.95)':'rgba(255,60,40,.5)';ctx.lineWidth=m.beam.lock?2.4:1.2;if(!m.beam.lock)ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(A[0],A[1]-26*Z);ctx.lineTo(B[0],B[1]-26*Z);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
    if(m.shot>0&&m.shotE){const A=scr(m.x,m.y),B=scr(m.shotE.x,m.shotE.y),a=m.shot/.3;ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(255,240,190,${a.toFixed(2)})`;ctx.lineWidth=8*Z*a+1;ctx.beginPath();ctx.moveTo(A[0],A[1]-26*Z);ctx.lineTo(B[0],B[1]-26*Z);ctx.stroke();ctx.strokeStyle=`rgba(255,255,255,${a.toFixed(2)})`;ctx.lineWidth=2;ctx.stroke();ctx.globalCompositeOperation='source-over';}
    if(m.ai==='hooker'&&m.tel>0){const[sx,sy]=scr(m.x,m.y),a=.5+.5*Math.sin(S.t*20);ctx.globalCompositeOperation='lighter';glowG(ctx,sx+10*Z*m.size,sy-24*Z*m.size,12*Z,'200,220,255',.4+.4*a);ctx.globalCompositeOperation='source-over';}
    if(m.puff>0){const[sx,sy]=scr(m.x,m.y),r=(5+(.55-m.puff)*14)*Z;ctx.fillStyle='rgba(150,220,80,.75)';ctx.beginPath();ctx.arc(sx+6*Z,sy-36*Z*m.size,r,0,7);ctx.fill();}
    if((m.ai==='fan'||m.ai==='webber')&&m.tel>0){const[sx,sy]=scr(m.x,m.y),a=.5+.5*Math.sin(S.t*24);ctx.globalCompositeOperation='lighter';glowG(ctx,sx+10*Z*m.size,sy-28*Z*m.size,14*Z,m.ai==='fan'?'255,230,150':'240,240,255',.5+.4*a);ctx.globalCompositeOperation='source-over';
      if(m.ai==='webber'){ctx.strokeStyle='rgba(245,245,255,.8)';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<4;i++){const j=(Math.random()-.5)*4*Z;ctx.moveTo(sx+6*Z,sy-30*Z+i*2*Z);ctx.lineTo(sx+18*Z+j,sy-26*Z+i*3*Z+j);}ctx.stroke();}}
    if(m.ai==='fan'&&m.tel>0&&m.fanA!=null){const A=scr(m.x,m.y);ctx.strokeStyle=`rgba(255,220,140,${(.25+.5*(1-m.tel/.7)).toFixed(2)})`;ctx.lineWidth=2;ctx.setLineDash([6,6]);for(let k=-2;k<=2;k++){const a=m.fanA+k*.24,B=scr(m.x+Math.cos(a)*7,m.y+Math.sin(a)*7);ctx.beginPath();ctx.moveTo(A[0],A[1]-14*Z);ctx.lineTo(B[0],B[1]-14*Z);ctx.stroke();}ctx.setLineDash([]);}
    if(m.ai==='spinner'&&(m.tel>0||m.spin>0)){const[sx,sy]=scr(m.x,m.y),hw=TW/2*Z*1.42,hh=TH/2*Z*1.42;if(m.tel>0){ctx.setLineDash([5,5]);ctx.strokeStyle='rgba(255,140,60,.85)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy,1.35*hw,1.35*hh,0,0,7);ctx.stroke();ctx.setLineDash([]);}
      else{ctx.strokeStyle='rgba(240,230,210,.85)';ctx.lineWidth=3*Z;for(let i=0;i<3;i++){const a=S.t*18+i*2.1;ctx.beginPath();ctx.ellipse(sx,sy-14*Z,1.2*hw,1.2*hh*.7,0,a,a+1.2);ctx.stroke();}}}
    if(m.swell>0){const[sx,sy]=scr(m.x,m.y),k=1-m.swell/.9;ctx.globalCompositeOperation='lighter';glowG(ctx,sx,sy-24*Z*m.size,(14+26*k)*Z,'255,110,80',.35+.4*k);ctx.globalCompositeOperation='source-over';}
    if(m.ai==='boomer'&&m.tel>0&&m.bmA!=null){const A=scr(m.x,m.y),B=scr(m.x+Math.cos(m.bmA)*6.4,m.y+Math.sin(m.bmA)*6.4);ctx.strokeStyle='rgba(255,220,150,.75)';ctx.lineWidth=2;ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(A[0],A[1]-16*Z);ctx.lineTo(B[0],B[1]-16*Z);ctx.stroke();ctx.setLineDash([]);}
    if(m.ai==='rico'&&m.tel>0&&m.rcP){ctx.strokeStyle='rgba(230,220,200,.7)';ctx.lineWidth=2;ctx.setLineDash([3,6]);ctx.beginPath();m.rcP.forEach((q,i)=>{const P_=scr(q[0],q[1]);i?ctx.lineTo(P_[0],P_[1]-14*Z):ctx.moveTo(P_[0],P_[1]-14*Z);});ctx.stroke();ctx.setLineDash([]);}
    if(m.rot){const A=scr(m.x,m.y),pre=m.rot.t<1.2,B=scr(m.x+Math.cos(m.rot.a)*m.rot.L,m.y+Math.sin(m.rot.a)*m.rot.L);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=pre?'rgba(255,240,200,.3)':'rgba(255,240,190,.9)';ctx.lineWidth=pre?3:7*Z;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(A[0],A[1]-20*Z);ctx.lineTo(B[0],B[1]-20*Z);ctx.stroke();if(!pre){ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=2;ctx.stroke();}ctx.globalCompositeOperation='source-over';}
    if(m.mirror>0||m.mpre>0){const[sx,sy]=scr(m.x,m.y),a=m.mirror>0?.55:.25+.25*Math.sin(S.t*30);ctx.globalCompositeOperation='lighter';glowG(ctx,sx,sy-24*Z*m.size,26*Z,'225,235,255',a);ctx.globalCompositeOperation='source-over';}
    if(m.circ>0){const[sx,sy]=scr(m.x,m.y);ctx.strokeStyle='rgba(220,235,255,.7)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(sx,sy,12*Z,5*Z,0,0,7);ctx.stroke();}
    if(m.daze>0){const[sx,sy]=scr(m.x,m.y);ctx.fillStyle='#ffe890';for(let i=0;i<3;i++){const a=S.t*6+i*2.1;ctx.fillRect(sx+Math.cos(a)*9*Z-1.5,sy-50*Z*m.size+Math.sin(a)*3*Z,3,3);}}}
  for(const pr of S.proj)if(pr.kind==='hook'&&pr.src&&!pr.src.dead){const A=scr(pr.src.x,pr.src.y),B=scr(pr.x,pr.y);ctx.strokeStyle='#9a9aa4';ctx.lineWidth=2*Z;ctx.setLineDash([3*Z,2*Z]);ctx.beginPath();ctx.moveTo(A[0],A[1]-24*Z);ctx.lineTo(B[0],B[1]-16*Z);ctx.stroke();ctx.setLineDash([]);}
  {const e=z.ev;if(e&&e.id==='wisp'&&(e.state==='on'||e.state==='idle')){const[wx,wy]=e.state==='on'?[e.wx,e.wy]:[e.x,e.y],[sx,sy]=scr(wx,wy),b=Math.sin(S.t*3)*4*Z;ctx.globalCompositeOperation='lighter';glowG(ctx,sx,sy-30*Z+b,22*Z,'150,255,120',.45);glowG(ctx,sx,sy-30*Z+b,7*Z,'230,255,210',.95);ctx.globalCompositeOperation='source-over';}}
  if(p.pullT>0&&p.pullS&&!p.pullS.dead){const A=scr(p.pullS.x,p.pullS.y),B=scr(p.x,p.y);ctx.strokeStyle='#d8d8e0';ctx.lineWidth=3.5*Z;ctx.beginPath();ctx.moveTo(A[0],A[1]-24*Z);ctx.lineTo(B[0],B[1]-22*Z);ctx.stroke();}}
/* Valgris : 1) seul au corps à corps, 2) rappelle les échos des lieutenants vaincus, 3) l’arène rétrécit sous les cendres */
/* v5.90 : Valgris en trois formes. Forme 2 (sous 66 %) : 15 % plus grand et plus fort, deux bras de plus.
   Forme 3 (sous 33 %) : 30 % plus grand et plus fort, ailes d’os, couronne de cornes, coups plus difficiles à esquiver. */
function valgrisForm(m,k){if(!m.size0){m.size0=m.size;m.dmg0=m.dmg.slice();m.spd0=m.spd;}if((m.form||1)>=k)return;m.form=k;const g=k===2?1.15:1.3;
  m.size=m.size0*g;m.dmg=m.dmg0.map(v=>Math.round(v*g));m.spd=m.spd0*(k===2?1.08:1.15);m.bd=Math.round((m.bd0||(m.bd0=m.bd))*g);
  S.shake=Math.max(S.shake,.7);sfx('boom');for(let i=0;i<4;i++)burst(m.x+rnd(-1,1),m.y+rnd(-1,1),k===2?'#cfc8b8':'#ff6a3a',30);
  toast(k===2?'Valgris se déchire : deux bras de plus':'Valgris déploie ses ailes d’os');}
BEHAV.valgris=function(m,dt,z,d,fd,spd){const B=BOSSES.valgris,L=vrep();if(m.beaten)return;const f=m.hp/m.maxHp,c=z.center||[m.x,m.y];
  const F3=(m.form||1)>=3;
  if(!m.ph2&&((m.formN?(m.form||1)>=2:f<B.phase2))){m.ph2=true;say(L.phase2);S.shake=.4;const act=curWorld().acts[1];let n=0;
    for(const b of act.acolytes)if(S.aco&&S.aco[b]){const q=nearFloor(z,m.x+rnd(-3,3),m.y+rnd(-3,3));if(!q)continue;const e=spawnMon(z,BOSSES[b].mon,q[0]+.5,q[1]+.5,false,m.lvl-3);
      e.hp=e.maxHp=Math.round(e.maxHp*B.echo);e.echo=true;e.noLoot=true;e.told=true;e.xp=Math.round(e.xp*.1);e.name='Écho : '+e.name;e.aggro=true;if(e.shellMax){e.shellMax=Math.round(e.maxHp*.45);e.shell=e.shellMax;}burst(e.x,e.y,'#a8a49c',24);n++;}}
  if(!m.ph3&&(m.formN?(m.form||1)>=3:f<B.phase3)){m.ph3=true;say(L.phase3);z.shrink={r:B.shrink.from,cx:c[0]+.5,cy:c[1]+.5,dps:Math.max(1,Math.round(m.dmg[1]*B.shrink.dps)),L:m.lvl};}
  m.at-=dt;if(m.at<=0&&d<(F3?5.5:4.5)){m.at=B.slam.every*(F3?.7:(m.form||1)>=2?.85:1);S.hz.push({x:m.x,y:m.y,r:B.slam.r*(F3?1.35:1),t:.15,arm:B.slam.arm*(F3?.65:1),kind:'slam',hit:Math.round(m.dmg[1]*B.slam.hit),L:m.lvl});m.atk=.3;}
  if(m.ph3){m.vt-=dt;if(m.vt<=0){const V=B.volley;m.vt=V.cdEnr*(F3?.8:1);const o=rnd(0,1),nE=V.nEnr+(F3?6:0),sp=F3?6.5:5;for(let i=0;i<nE;i++){const a=o+i/nE*Math.PI*2;S.proj.push({x:m.x,y:m.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,from:'m',kind:'bolt',dmg:ri(Math.round(m.bd*.8),Math.round(m.bd*1.3)),L:m.lvl,life:2.4});}}}
  /* v5.64 : Valgris change avec les mondes. Monde 3 et plus : pluie de lances de cendre sur toi ; monde 6 : ondes de glas dans le cercle. */
  if(((S.world||1)>=3||F3)&&m.aggro){m.lt=(m.lt??4)-dt;if(m.lt<=0){m.lt=m.ph3?5.5:7.5;const nL=F3?5:3;for(let k=0;k<nL;k++)S.hz.push({x:p.x+(k?rnd(-2.5,2.5):0)+(k===1?p.vx||0:0),y:p.y+(k?rnd(-2.5,2.5):0),r:1.3,t:.15,arm:(F3?.75:1)+k*.2,kind:'slam',hit:Math.round(m.dmg[1]*1.1),L:m.lvl});}}
  if((S.world||1)>=6&&m.ph3){m.rt=(m.rt??3)-dt;if(m.rt<=0){m.rt=8;S.hz.push({x:m.x,y:m.y,r:10,t:6,arm:.6,kind:'ring',sp:3.6,hit:Math.round(m.bd*2.4),L:m.lvl,col:'230,220,255'});}}
  BEHAV.melee(m,dt,z,d,fd,spd);};
