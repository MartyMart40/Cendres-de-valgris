'use strict';
function chase(m,dt,z,fd,spd){
  let tx=p.x,ty=p.y;
  if(fd>1){const cx=Math.floor(m.x),cy=Math.floor(m.y);let bd=fd;
    for(const[dx,dy]of DIR8){const nx=cx+dx,ny=cy+dy;if(isWall(z,nx,ny))continue;if(dx&&dy&&(isWall(z,cx+dx,cy)||isWall(z,cx,cy+dy)))continue;const v=z.flow[ny*z.w+nx];if(v>=0&&v<bd){bd=v;tx=nx+.5;ty=ny+.5;}}}
  const dx=tx-m.x,dy=ty-m.y,l=Math.hypot(dx,dy)||1,ox=m.x,oy=m.y;step(m,dx/l,dy/l,spd*dt,z);
  if(Math.hypot(m.x-ox,m.y-oy)<spd*dt*.3){const cx=Math.floor(m.x)+.5,cy=Math.floor(m.y)+.5,cl=Math.hypot(cx-m.x,cy-m.y);if(cl>.05)step(m,(cx-m.x)/cl,(cy-m.y)/cl,Math.min(cl,spd*dt),z);}
}
/* v5.66 : acolytes et lieutenants changent aussi avec les mondes. Monde 3 et plus : lances de cendre ; monde 5 et plus : deux champions à 40 % de vie. */
function miniWorld(m,dt,z){m.lt=(m.lt??5)-dt;if(m.lt<=0){m.lt=m.hp<m.maxHp*.5?6:8.5;for(let k=0;k<2;k++)S.hz.push({x:p.x+(k?rnd(-2,2):0),y:p.y+(k?rnd(-2,2):0),r:1.1,t:.15,arm:1.1+k*.3,kind:'slam',hit:Math.round(m.dmg[1]*.9),L:m.lvl});}
  if((S.world||1)>=5&&!m.twins&&m.hp<m.maxHp*.4){m.twins=true;for(let k=0;k<2;k++){const f=nearFloor(z,m.x+(k?2:-2),m.y+rnd(-1,1))||[Math.floor(m.x),Math.floor(m.y)];const c=spawnMon(z,pick(z.def.mons||['rodeur']),f[0]+.5,f[1]+.5,true,m.lvl);c.aggro=true;c.noLoot=true;burst(c.x,c.y,'#ffd060',20);}}}
function bossAI(m,dt,z){
  const B=(m.bossId&&BOSSES[m.bossId])||BOSS_BASE,V=B.volley||BOSS_BASE.volley,C=B.summon||BOSS_BASE.summon;
  const enr=m.hp<m.maxHp*.5;m.vt-=dt;m.st-=dt;
  /* v5.60 : la Mère change avec les mondes. Monde 2 et plus : ondes de glas à sauter ; monde 5 et plus : deux ondes ; monde 4 et plus : deux champions sous 30 % de vie. */
  if(m.bossId==='varsha'&&(S.world||1)>=2&&m.aggro){m.rt=(m.rt??5)-dt;if(m.rt<=0){m.rt=enr?7:9;const n=(S.world||1)>=5?2:1;for(let k=0;k<n;k++)S.hz.push({x:m.x,y:m.y,r:9,t:6,arm:.7+k*1.1,kind:'ring',sp:3.4,hit:Math.round(m.bd*2.4),L:m.lvl,col:THM().ringCol||'230,220,255'});sfx('boom');}
    if((S.world||1)>=4&&!m.twins&&m.hp<m.maxHp*.3){m.twins=true;for(let k=0;k<2;k++){const f=nearFloor(z,m.x+(k?2.5:-2.5),m.y+rnd(-1,1));if(f){const c=spawnMon(z,C.type,f[0]+.5,f[1]+.5,true,m.lvl);c.aggro=true;burst(c.x,c.y,'#ffd060',24);}}toast('Ses enfants accourent');}}
  if(m.vt<=0){m.vt=enr?V.cdEnr:V.cd;const n=enr?V.nEnr:V.n,o=rnd(0,1);for(let i=0;i<n;i++){const a=o+i/n*Math.PI*2;S.proj.push({x:m.x,y:m.y,vx:Math.cos(a)*5,vy:Math.sin(a)*5,from:'m',kind:'bolt',dmg:ri(Math.round(m.bd*.8),Math.round(m.bd*1.3)),L:m.lvl,life:2.4});}burst(m.x,m.y,'#ff5a2a',20);S.shake=Math.max(S.shake,.25);}
  /* v6.25 : deuxième forme du boss de l’acte I : il bondit (ombre au sol 1,2 s) et le sol se met à brûler autour de toi */
  if(m.bossId==='varsha'&&(m.form||1)>=2&&m.aggro){
    if(m.vj){m.vj.t-=dt;if(m.vj.t<=0){m.x=m.vj.x;m.y=m.vj.y;burst(m.x,m.y,'#ff7a2a',30);S.shake=Math.max(S.shake,.35);m.vj=null;}}
    else{m.jt=(m.jt??3)-dt;if(m.jt<=0&&dist(m,p)>2&&dist(m,p)<9&&losClear(z,m.x,m.y,p.x,p.y)){m.jt=VARSHA2.jump;const f=nearFloor(z,p.x,p.y)||[Math.floor(p.x),Math.floor(p.y)];const x=f[0]+.5,y=f[1]+.5;m.vj={x,y,t:1.2};
      S.hz.push({x,y,r:2.2,t:.15,arm:1.2,arm0:1.2,kind:'leap'});S.hz.push({x,y,r:2.2,t:.15,arm:1.2,arm0:1.2,kind:'slam',hit:Math.round(m.bd*3),L:m.lvl});sfx('cast');}}
    m.ft2=(m.ft2??2)-dt;if(m.ft2<=0){m.ft2=VARSHA2.fire;if(S.hz.filter(h=>h.vfire).length<9)for(let k=0;k<3;k++){const q=evRand(z,.5,4);if(q)S.hz.push({x:q[0],y:q[1],r:1.2,t:6,arm:1,arm0:1,kind:'fire',vfire:true,dps:Math.max(1,Math.round(m.bd*.6)),L:m.lvl});}}}
  if(m.st<=0){m.st=C.every;const alive=z.mons.filter(o=>!o.dead&&!o.boss).length;if(alive<C.max){for(let i=0;i<C.n;i++){const f=nearFloor(z,m.x+rnd(-2,2),m.y+rnd(-2,2));if(f){const c=spawnMon(z,C.type,f[0]+.5,f[1]+.5,false,m.lvl);c.aggro=true;burst(c.x,c.y,'#802010',10);}}if(bt(B,'call'))say(bt(B,'call'));}}
}
/* Une sortie est « voulue » si le dernier toucher au sol visait près d’elle (le toucher direct passe par interact) */
function exitWanted(o){return!!(p.goal&&Math.hypot(p.goal.x-o.x,p.goal.y-o.y)<1.8);}
function tryExit(o){if(o.lock){say(o.lockMsg||'La sortie s’ouvrira quand l’arène sera vide.');p.tpCd=2.5;return false;}const sl=sealOf(o.to);if(sl){say(sl.msg);p.tpCd=2.5;return false;}enterZone(o.to,'exit',S.cur.id);return true;}
/* v5.95 : évents du décor. Feu dans les mondes de braise, givre qui jaillit du sol gelé, gaz des marais et des ossuaires. */
const VENTS={fire:{tint:'255,120,40',bc:'#ff8a3a',glow:'255,110,30'},ice:{tint:'170,225,255',bc:'#cfefff',glow:'150,210,255'},gas:{tint:'150,220,90',bc:'#9adc5a',glow:'120,200,70'}};
function drawVents(z){if(!z.vents)return;const hw=TW/2*Z,hh=TH/2*Z;for(const v of z.vents){const[sx,sy]=scr(v.x,v.y);if(sx<-60||sx>W+60||sy<-60||sy>H+60)continue;const V=VENTS[v.k],warn=v.t<1.2?1-v.t/1.2:0,pu=.35+.15*Math.sin(S.t*3+v.x)+warn*.5;
  ctx.fillStyle='rgba(10,8,6,.55)';ctx.beginPath();ctx.ellipse(sx,sy,hw*.55,hh*.55,0,0,7);ctx.fill();
  if(!p.eco){const g=ctx.createRadialGradient(sx,sy,0,sx,sy,hw*.9);g.addColorStop(0,`rgba(${V.glow},${pu.toFixed(2)})`);g.addColorStop(1,`rgba(${V.glow},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(sx,sy,hw*.9,hh*.9,0,0,7);ctx.fill();}
  ctx.strokeStyle=`rgba(${V.glow},${Math.min(1,.5+pu).toFixed(2)})`;ctx.lineWidth=1.3*Z;ctx.beginPath();for(let k=0;k<5;k++){const a=k*1.26+v.x;ctx.moveTo(sx,sy);ctx.lineTo(sx+Math.cos(a)*hw*.5,sy+Math.sin(a)*hh*.5);ctx.lineTo(sx+Math.cos(a+.3)*hw*.75,sy+Math.sin(a+.3)*hh*.75);}ctx.stroke();
  if(v.k==='ice'){ctx.fillStyle='rgba(210,240,255,.8)';for(let k=0;k<3;k++){const dx=(k-1)*5*Z,h_=(6+k%2*4)*Z*(1+warn*.6);ctx.beginPath();ctx.moveTo(sx+dx-2*Z,sy);ctx.lineTo(sx+dx,sy-h_);ctx.lineTo(sx+dx+2*Z,sy);ctx.fill();}}
  if(!p.eco&&Math.random()<(v.k==='gas'?.12:.06)+warn*.3)S.parts.push({x:v.x+rnd(-.3,.3),y:v.y+rnd(-.3,.3),z:.05,vx:0,vy:0,vz:rnd(.4,1.4),life:rnd(.5,1),col:V.bc});}}
const NOTES=['« Trois jours sans voir le ciel. La cendre a un goût de fer. Si quelqu’un lit ceci, ne suis pas les cloches. »',
  '« J’ai caché ma part derrière un mur qui sonnait creux. Un levier, près du sol. Je reviendrai. »',
  '« Le Seigneur des cendres n’est pas mort à la première chute. Personne ne m’a cru au camp. »',
  '« Ma lanterne s’éteint quand ils approchent. Elle s’est éteinte il y a une heure. »',
  '« Liste : corde, sel, pain, deux flèches. Il me reste le sel. »',
  '« Les barils rouges sautent. Les monstres sont bêtes : ils se mettent juste à côté. »',
  '« Note pour moi-même : ne plus jamais caresser un ver géant, même s’il a l’air gentil. »',
  '« J’ai entendu un nom gravé sous l’autel : un nom d’homme ordinaire. Pourquoi un dieu aurait-il un nom ordinaire ? »',
  '« Le sol crache du feu quand il rougit. Compte jusqu’à un, puis cours. »',
  '« À ma sœur, au camp : garde la bague. Ne viens pas me chercher. »'];
function searchCorpse(o){if(o.done)return;o.done=true;const z=S.cur,L=Math.max(1,z.def.lvl||1);burst(o.x,o.y,'#8a7a60',12);sfx('gold');
  dropAt(z,o.x,o.y,{kind:'gold',v:Math.round(ri(10,26)*(1+.3*(L-1)))});if(Math.random()<LOOT.corpse)dropAt(z,o.x,o.y,{kind:'item',it:genItem(L,Math.random()<.15?1:0,p.st.mf+30)});if(Math.random()<.3)dropAt(z,o.x,o.y,{kind:'pot'});
  if(Math.random()<.1)dropAt(z,o.x,o.y,{kind:'orb',k:orbPick()});
  S.notes=(S.notes||0)+1;if(!(Math.random()<.45&&letterGive(z,o.x,o.y)))say(pick(NOTES));toast('Dépouille fouillée');}
function pullLever(o){if(o.on)return;o.on=true;const z=S.cur,i=o.wy*z.w+o.wx;sfx('portal');S.shake=Math.max(S.shake,.35);toast('Un pan de mur glisse…');
  z.g[i]=0;if(z.hide)z.hide[i]=0;z.fc[i]=z.fc[(o.y|0)*z.w+(o.x|0)]||z.fc[i]||'rgb(60,56,50)';freeCv(z);z.flow=null;z.flowT=0;for(let k=0;k<3;k++)burst(o.wx+.5+rnd(-.3,.3),o.wy+.5+rnd(-.3,.3),'#8a8070',14);
  z.objs.push({type:'chest',x:o.wx+.5,y:o.wy+.5,open:false,secret:true});}
function breakUrn(o){const z=S.cur;if(o.broken)return;o.broken=true;burst(o.x,o.y,o.v===0?'#8a6a4a':o.v===1?'#6a4a2a':'#a08060',16);sfx('hit');const L=Math.max(1,z.def.lvl||1),r=Math.random();
  if(r<.3)dropAt(z,o.x,o.y,{kind:'gold',v:Math.round(ri(5,15)*(1+.3*(L-1)))});else if(r<.34)dropAt(z,o.x,o.y,{kind:'pot'});else if(r<.36)dropAt(z,o.x,o.y,{kind:'item',it:genItem(L,0,p.st.mf)});
  else if(r<.38){const f=nearFloor(z,o.x,o.y);if(f){const m=spawnMon(z,'ver',f[0]+.5,f[1]+.5,false,L);m.aggro=true;toast('Quelque chose dormait dedans');}}
  z.objs=z.objs.filter(q=>q!==o);addDecal(z,o.x,o.y,.35,'');}
function lightKeg(o){if(o.fuse!=null)return;o.fuse=1.6;toast('La mèche brûle !');sfx('cast');}
function kegBoom(o){const z=S.cur;z.objs=z.objs.filter(q=>q!==o);S.shake=Math.max(S.shake,.6);sfx('boom');for(let k=0;k<3;k++)burst(o.x+rnd(-.5,.5),o.y+rnd(-.5,.5),'#ff8a3a',30);S.novas.push({x:o.x,y:o.y,r:0,max:3,col:'255,140,60'});
  const L=Math.max(1,z.def.lvl||1),dm=Math.round(40*G(L));for(const m of z.mons)if(!m.dead&&!m.boss&&Math.hypot(m.x-o.x,m.y-o.y)<3)hurtMon(m,Math.round(m.maxHp*.5+dm),'#ffb050');
  if(Math.hypot(p.x-o.x,p.y-o.y)<2.4)hurtPlayer(Math.round(p.maxHp*.2),L,null,'fire');addDecal(z,o.x,o.y,1.2,'boss');for(const q of z.objs)if(q.type==='keg'&&q.fuse==null&&Math.hypot(q.x-o.x,q.y-o.y)<3)q.fuse=.3;}
function interact(o){
  if(o.type==='urn'){breakUrn(o);return;}
  if(o.type==='keg'){lightKeg(o);return;}
  if(o.type==='corpse'){searchCorpse(o);return;}
  if(o.type==='lever'){pullLever(o);return;}
  if(o.type==='exit'){tryExit(o);return;}
  if(o.dest){enterZone(o.dest,'portal');return;}
  if(o.type==='tnpc'||o.type==='gtable'){tableDialog();return;}
  if(o.type==='npc')npcDialog(o.id);
  else if(o.type==='wp'){S.wps[S.cur.id]=1;wpMenu();}
  else if(o.type==='chest')openChest(o);
  else if(o.type==='relic')relicStart(o);
  else if(o.type==='traveler')travelerTalk();
  else if(o.type==='well')wellAsk();
  else if(o.type==='shrine')shrineAsk();
  else if(o.type==='fgrave')graveDig();
  else if(o.type==='peddler')peddlerTalk();
  else if(o.type==='cchest')cchestOpen(o);
  else if(o.type==='altar')altarAsk();
  else if(o.type==='stone')stoneTouch(o);
  else if(o.type==='pyre')pyreLight(o);
  else if(o.type==='statue')statueBreak(o);
  else if(o.type==='rift'&&riftOpen())riftMenu();
  else if(o.type==='stash')invPanel('stash');
  else if(o.type==='board')boardPanel();
  else if(o.type==='dummy')trainEnter();
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
