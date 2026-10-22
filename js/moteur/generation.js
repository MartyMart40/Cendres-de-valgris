'use strict';
/* ---------- Génération ---------- */
function newGrid(z,w,h,v){z.w=w;z.h=h;z.g=new Uint8Array(w*h).fill(v);}
function isWall(z,x,y){if(x<0||y<0||x>=z.w||y>=z.h)return true;return z.g[y*z.w+x]===1;}
function setT(z,x,y,v){if(x>0&&y>0&&x<z.w-1&&y<z.h-1)z.g[y*z.w+x]=v;}
function free(z,x,y,r){return !isWall(z,Math.floor(x-r),Math.floor(y-r))&&!isWall(z,Math.floor(x+r),Math.floor(y-r))&&!isWall(z,Math.floor(x-r),Math.floor(y+r))&&!isWall(z,Math.floor(x+r),Math.floor(y+r));}
function bfs(z,sx,sy,maxD){
  const n=z.w*z.h,d=new Int16Array(n).fill(-1),q=new Int32Array(n);let h=0,t=0;
  if(isWall(z,sx,sy))return d;
  d[sy*z.w+sx]=0;q[t++]=sy*z.w+sx;
  while(h<t){const c=q[h++],cx=c%z.w,cy=(c/z.w)|0,cd=d[c];if(maxD&&cd>=maxD)continue;
    for(const[dx,dy]of DIR8){const nx=cx+dx,ny=cy+dy;if(isWall(z,nx,ny))continue;if(dx&&dy&&(isWall(z,cx+dx,cy)||isWall(z,cx,cy+dy)))continue;const k=ny*z.w+nx;if(d[k]>=0)continue;d[k]=cd+1;q[t++]=k;}}
  return d;
}
function pathTo(z,sx,sy,tx,ty){
  if(isWall(z,tx,ty))return null;const d=bfs(z,tx,ty,0);let c=d[sy*z.w+sx];if(c<0)return null;
  const path=[];let x=sx,y=sy,g=0;
  while(c>0&&g++<600){let best=null,bd=c;
    for(const[dx,dy]of DIR8){const nx=x+dx,ny=y+dy;if(isWall(z,nx,ny))continue;if(dx&&dy&&(isWall(z,x+dx,y)||isWall(z,x,y+dy)))continue;const v=d[ny*z.w+nx];if(v>=0&&v<bd){bd=v;best=[nx,ny];}}
    if(!best)break;path.push(best);x=best[0];y=best[1];c=bd;}
  return path;
}
function nearFloor(z,x,y){x=Math.floor(x);y=Math.floor(y);if(!isWall(z,x,y))return[x,y];for(let r=1;r<5;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(!isWall(z,x+dx,y+dy))return[x+dx,y+dy];return null;}
function arrival(z,x,y){const d=bfs(z,x,y,4);let best=null;for(let i=0;i<d.length;i++)if(d[i]===2){best=i;break;}if(best===null)return{x:x+.5,y:y+.5};return{x:best%z.w+.5,y:((best/z.w)|0)+.5};}

function genTown(z){
  newGrid(z,28,28,0);
  for(let i=0;i<28;i++){z.g[i]=1;z.g[27*28+i]=1;z.g[i*28]=1;z.g[i*28+27]=1;}
  z.g[13*28+27]=0;z.g[14*28+27]=0;
  z.tents=[];const tent=(x,y)=>{for(let j=0;j<2;j++)for(let i=0;i<3;i++)z.g[(y+j)*28+x+i]=1;z.tents.push({x,y});};
  tent(4,5);tent(4,20);tent(19,4);tent(20,21);tent(9,23);
  const first=zid(S.act||1,0);z.objs.push({type:'exit',x:26.5,y:13.5,to:first,label:'Vers : '+zoneName(first)});
  z.objs.push({type:'wp',x:13.5,y:18.5});
  z.objs.push({type:'fire',x:13.5,y:13.5});
  z.objs.push({type:'npc',id:'corvel',name:npcF('corvel'),x:10.5,y:11.5,col:'#6b5a8c'});
  z.objs.push({type:'npc',id:'bram',name:npcF('bram'),x:18.5,y:9.5,col:'#8a6a2a'});
  z.objs.push({type:'npc',id:'eline',name:npcF('eline'),x:17.5,y:17.5,col:'#c8c0b0'});
  z.spawn={x:14.5,y:15.5};z.portalSpot={x:10.5,y:16.5};z.objs.push({type:'rift',x:13.5,y:7.5});z.objs.push({type:'stash',x:19.5,y:12.5});z.objs.push({type:'npc',id:'hilde',name:npcF('hilde'),x:22.5,y:16.5,col:'#7a4a3a'});
}
function largestRegion(z){
  const lab=new Int32Array(z.w*z.h).fill(-1);let best=-1,bestN=0,id=0;
  for(let i=0;i<lab.length;i++){if(z.g[i]===1||lab[i]>=0)continue;const st=[i];lab[i]=id;let n=0;
    while(st.length){const c=st.pop();n++;const cx=c%z.w,cy=(c/z.w)|0;for(const[dx,dy]of DIR8.slice(0,4)){const nx=cx+dx,ny=cy+dy;if(isWall(z,nx,ny))continue;const k=ny*z.w+nx;if(lab[k]<0){lab[k]=id;st.push(k);}}}
    if(n>bestN){bestN=n;best=id;}id++;}
  for(let i=0;i<lab.length;i++)if(lab[i]!==best)z.g[i]=1;
}
function genCave(z){
  const s=z.def.size;newGrid(z,s,s,0);
  for(let i=0;i<s*s;i++)z.g[i]=Math.random()<.45?1:0;
  for(let it=0;it<5;it++){const ng=new Uint8Array(s*s);
    for(let y=0;y<s;y++)for(let x=0;x<s;x++){let c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(isWall(z,x+dx,y+dy))c++;ng[y*s+x]=(c>=5||x<2||y<2||x>s-3||y>s-3)?1:0;}
    z.g=ng;}
  largestRegion(z);
  let ent=null;for(let x=2;x<s&&!ent;x++)for(let dy=0;dy<s/2;dy++){for(const y of[s/2+dy,s/2-dy]){if(!isWall(z,x,y|0)){ent=[x,y|0];break;}}if(ent)break;}
  return ent;
}
function genRooms(z){
  const s=z.def.size;newGrid(z,s,s,1);const rooms=[];
  for(let t=0;t<200&&rooms.length<12;t++){const w=ri(5,10),h=ri(5,10),x=ri(2,s-w-3),y=ri(2,s-h-3);
    if(rooms.some(r=>x<r.x+r.w+2&&x+w+2>r.x&&y<r.y+r.h+2&&y+h+2>r.y))continue;rooms.push({x,y,w,h,cx:x+(w>>1),cy:y+(h>>1)});}
  for(const r of rooms)for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)setT(z,x,y,0);
  for(let i=1;i<rooms.length;i++){const a=rooms[i-1],b=rooms[i];let x=a.cx,y=a.cy;
    while(x!==b.cx){setT(z,x,y,0);setT(z,x,y+1,0);x+=Math.sign(b.cx-x);}
    while(y!==b.cy){setT(z,x,y,0);setT(z,x+1,y,0);y+=Math.sign(b.cy-y);}}
  for(const r of rooms)if(r.w>7&&r.h>7){setT(z,r.x+2,r.y+2,1);setT(z,r.x+r.w-3,r.y+2,1);setT(z,r.x+2,r.y+r.h-3,1);setT(z,r.x+r.w-3,r.y+r.h-3,1);}
  z.rooms=rooms;return[rooms[0].cx,rooms[0].cy];
}
/* Grand couloir : une longue route qui serpente, avec des alcôves où attendent des embuscades */
function genCorridor(z){
  const W_=z.def.w||112,H_=z.def.h||30;newGrid(z,W_,H_,1);let y=H_>>1;const y0=y;z.alcoves=[];let nextA=ri(14,18);
  for(let x=2;x<W_-2;x++){
    if(x>6&&Math.random()<.28)y=clamp(y+ri(-1,1),6,H_-7);
    const r=Math.random()<.12?2:1;for(let dy=-r;dy<=r;dy++)setT(z,x,y+dy,0);
    if(x>=nextA&&x<W_-12){nextA=x+ri(12,17);const side=Math.random()<.5?-1:1,ay=clamp(y+side*5,4,H_-5);
      for(let yy=Math.min(y,ay);yy<=Math.max(y,ay);yy++)setT(z,x,yy,0);
      for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)setT(z,x+dx,ay+dy,0);z.alcoves.push([x,ay]);}}
  for(let dy=-1;dy<=1;dy++)setT(z,2,y0+dy,0);
  largestRegion(z);return[2,y0];
}
/* Arène : un couloir d’entrée, un grand cercle, une sortie fermée tant que les vagues ne sont pas vaincues */
function genArena(z){
  const s=z.def.size||48;newGrid(z,s,s,1);const cy=s>>1,cx=s>>1;
  for(let x=2;x<=cx;x++)for(let y=cy-1;y<=cy+1;y++)setT(z,x,y,0);
  for(let x=cx;x<s-2;x++)for(let y=cy-1;y<=cy+1;y++)setT(z,x,y,0);
  for(let y=0;y<s;y++)for(let x=0;x<s;x++)if(Math.hypot(x-cx,y-cy)<13.5)setT(z,x,y,0);
  for(let k=0;k<4;k++){const a=k/4*Math.PI*2+Math.PI/4;setT(z,Math.round(cx+Math.cos(a)*7),Math.round(cy+Math.sin(a)*7),1);}
  z.center=[cx,cy];z.arena={wave:0,on:false,done:false,n:z.def.waves||4};return[3,cy];
}
function genLair(z){
  const s=z.def.size;newGrid(z,s,s,1);const cy=22;
  for(let x=2;x<24;x++)for(let y=cy-1;y<=cy+1;y++)setT(z,x,y,0);
  for(let y=0;y<s;y++)for(let x=0;x<s;x++){const d=Math.hypot(x-30,y-cy);if(d<12.5+Math.sin(Math.atan2(y-cy,x-30)*5)*.8)setT(z,x,y,0);}
  for(const[a]of[[0],[1],[2],[3],[4],[5]]){const an=a/6*Math.PI*2+.3;setT(z,Math.round(30+Math.cos(an)*7),Math.round(cy+Math.sin(an)*7),1);}
  z.center=[30,cy];return[3,cy];
}
function makeZone(id,defOverride){
  const def=defOverride||zoneDef(id);const st=def.style;
  const z={id,def,style:st,forme:def.forme,objs:[],mons:[],items:[],decals:[],props:[],seed:(Math.random()*1e9)|0,kills:0};let ent;
  if(id==='town'){genTown(z);addProps(z);}
  else{
    const F=FORMES[def.forme]||FORMES.plaine;ent=F.gen(z);
    const k=parseZ(id),back=id==='rift'||!k?'town':k.i>0?zid(k.a,k.i-1):k.a>1?zid(k.a-1,actLayout(k.a-1).length):'town',fwd=id==='rift'||!k||def.last?null:zid(k.a,k.i+1);
    z.objs.push({type:'exit',x:ent[0]+.5,y:ent[1]+.5,to:back,label:id==='rift'?'Retour au camp':'Vers : '+zoneName(back)});
    z.distE=bfs(z,ent[0],ent[1],0);
    const order=[];for(let i=0;i<z.distE.length;i++)if(z.distE[i]>=0)order.push(i);order.sort((a,b)=>z.distE[a]-z.distE[b]);
    const far=order[order.length-1];
    if(fwd)z.objs.push({type:'exit',x:far%z.w+.5,y:((far/z.w)|0)+.5,to:fwd,label:'Vers : '+zoneName(fwd)});
    if(def.wp){const w=order.find(i=>z.distE[i]===4)??order[Math.min(order.length-1,20)];z.objs.push({type:'wp',x:w%z.w+.5,y:((w/z.w)|0)+.5});}
    const chests=def.chests||F.chests;
    if(chests==='rooms'&&z.rooms){const rs=z.rooms.map(r=>({r,d:z.distE[r.cy*z.w+r.cx]})).filter(o=>o.d>0).sort((a,b)=>b.d-a.d);const rr=(rs[1]||rs[0]).r;
      const c=nearFloor(z,rr.cx,rr.cy);z.objs.push({type:'chest',x:c[0]+.5,y:c[1]+.5,relic:def.relic||false,open:false});
      for(let k=2;k<5&&k<rs.length;k++){const c2=nearFloor(z,rs[k].r.cx+1,rs[k].r.cy);if(c2)z.objs.push({type:'chest',x:c2[0]+.5,y:c2[1]+.5,open:false});}}
    if(chests==='order'){for(let k=0;k<3;k++){const i=order[Math.floor(order.length*(.35+k*.2))];z.objs.push({type:'chest',x:i%z.w+.5,y:((i/z.w)|0)+.5,open:false});}}
    if(chests==='alcoves'&&z.alcoves){z.alcoves.filter((_,k)=>k%2===1).slice(0,3).forEach(([ax,ay])=>{const c=nearFloor(z,ax,ay);if(c)z.objs.push({type:'chest',x:c[0]+.5,y:c[1]+.5,open:false});});}
    if(def.relic&&!z.objs.some(o=>o.relic)){const i=order[Math.floor(order.length*.85)];z.objs.push({type:'chest',x:i%z.w+.5,y:((i/z.w)|0)+.5,relic:def.relic,open:false});}
    if(z.arena&&fwd){const ex=z.objs.find(o=>o.type==='exit'&&o.to===fwd);if(ex)ex.lock=true;}
    if(def.aco){const i=order[Math.floor(order.length*.9)];z.acoSpot=[i%z.w,(i/z.w)|0];}
    z.spawn={x:ent[0]+.5,y:ent[1]+.5};
    addProps(z);populate(z);
  }
  for(const o of z.objs)if(o.type==='exit'||o.type==='wp')o.arr=arrival(z,Math.floor(o.x),Math.floor(o.y));
  nextActExit(z);
  if(id!=='town')z.spawn=z.objs[0].arr;
  z.wh=new Uint8Array(z.w*z.h);z.lava=new Uint8Array(z.w*z.h);z.lavaList=st==='lair'?[]:null;
  for(let i=0;i<z.wh.length;i++)z.wh[i]=st==='plain'?20+Math.random()*20:st==='crypt'?38:st==='lair'?30+Math.random()*10:30;
  z.seen=new Uint8Array(z.w*z.h);z.near=new Uint8Array(z.w*z.h);z.fc=new Array(z.w*z.h);
  const f=palOf(st).floor;const LA=palOf(st).lavaAdd||[70,18,0];
  for(let y=0;y<z.h;y++)for(let x=0;x<z.w;x++){const i=y*z.w+x;
    if(z.g[i]===1&&!z.hide[i]){for(const[dx,dy]of DIR8)if(!isWall(z,x+dx,y+dy)||z.hide[(y+dy)*z.w+x+dx]){z.near[i]=1;break;}continue;}
    let n=(Math.sin(x*12.9898+y*78.233)*43758.5453)%1;n=(n<0?n+1:n)*14-7;let r=f[0]+n,g=f[1]+n,b=f[2]+n;
    if(st==='crypt'&&(x+y)%2)r-=4,g-=4,b-=3;
    if(st==='plain'&&n>5.5){r+=10;g+=4;}
    if(st==='lair'&&n>6.2){r+=LA[0];g+=LA[1];b+=LA[2];z.lava[i]=1;if(z.lavaList.length<40&&Math.random()<.5)z.lavaList.push({x:x+.5,y:y+.5});}
    if(st==='town'&&n<-5.5){r-=8;g+=2;b-=6;}
    z.fc[i]=`rgb(${r|0},${g|0},${b|0})`;}
  z.flow=null;z.flowT=0;
  return z;
}
function addProps(z){
  z.hide=new Uint8Array(z.w*z.h);const st=z.style;
  const okSpot=(x,y)=>{for(const o of z.objs)if(Math.hypot(o.x-x-.5,o.y-y-.5)<2.6)return false;return true;};
  const open8=(x,y)=>DIR8.every(([dx,dy])=>!isWall(z,x+dx,y+dy));
  const block=(x,y)=>{z.g[y*z.w+x]=1;z.hide[y*z.w+x]=1;};
  if(st==='town'){
    const cols=[['#a08458','#5e4a30','#7a6242'],['#8a5a4a','#4e3028','#6a4436'],['#7e8466','#464a36','#5e644c']];
    z.tents.forEach((t,k)=>{z.props.push({k:'tent',x:t.x,y:t.y,c:cols[k%3]});for(let j=0;j<2;j++)for(let i=0;i<3;i++)z.hide[(t.y+j)*z.w+t.x+i]=1;});
    z.props.push({k:'torch',x:25.7,y:12.2},{k:'torch',x:25.7,y:15.8},{k:'barrel',x:8.4,y:6.6},{k:'barrel',x:8.6,y:7.4},{k:'crate',x:16.4,y:9.2},{k:'crate',x:16.6,y:10.1},{k:'banner',x:12.1,y:11.3},{k:'barrel',x:23.6,y:21.4},{k:'crate',x:3.6,y:8.6},{k:'torch',x:9.4,y:10.6},{k:'anvil',x:23.4,y:17.6},{k:'torch',x:23.8,y:15.4});
    return;}
  if(st==='crypt'&&z.rooms)for(const r of z.rooms)for(const[x,y]of[[r.x,r.y],[r.x+r.w-1,r.y+r.h-1]])if(!isWall(z,x,y)&&okSpot(x,y))z.props.push({k:'brazier',x:x+.5,y:y+.5});
  if(FORMES[z.forme]&&FORMES[z.forme].braziers&&z.center)for(let k=0;k<6;k++){const a=k/6*6.28+.3,f=nearFloor(z,z.center[0]+Math.cos(a)*10.5,z.center[1]+Math.sin(a)*10.5);if(f)z.props.push({k:'brazier',x:f[0]+.5,y:f[1]+.5});}
  for(let y=2;y<z.h-2;y++)for(let x=2;x<z.w-2;x++){if(isWall(z,x,y)||!okSpot(x,y))continue;const r=Math.random();
    if(st==='plain'){
      if(r<.014&&open8(x,y)){block(x,y);const br=[];for(let k=0;k<ri(3,5);k++)br.push({h:rnd(22,42),a:rnd(.3,2.8),l:rnd(10,18),w:rnd(1.5,3),t:rnd(-.8,.8)});z.props.push({k:'tree',x:x+.5,y:y+.5,br,s:rnd(.85,1.2)});}
      else if(r<.024)z.props.push({k:'grave',x:x+.5,y:y+.5,t:rnd(-.2,.2)});
      else if(r<.042)z.props.push({k:'rock',x:x+rnd(.3,.7),y:y+rnd(.3,.7),s:rnd(.6,1.2)});
      else if(r<.05)z.props.push({k:'bones',x:x+.5,y:y+.5});}
    else if(st==='crypt'){
      if(r<.012&&open8(x,y)){block(x,y);z.props.push({k:'coffin',x:x+.5,y:y+.5,rot:Math.random()<.5});}
      else if(r<.03)z.props.push({k:'bones',x:x+.5,y:y+.5});}
    else if(st==='lair'){if(z.def.rift&&r<.006&&open8(x,y))z.props.push({k:'brazier',x:x+.5,y:y+.5});else if(r<.035)z.props.push({k:'bones',x:x+.5,y:y+.5});}}
}
function spawnMon(z,type,x,y,champ,lvlOverride){
  const t=MT[type],W_=S&&WORLDS[S.world],L=lvlOverride||(t.lvl?t.lvl+((W_&&W_.lvlAdd)||0):0)||Math.max(1,z.def.lvl),g=G(L);
  const m={t:type,name:(champ?'Champion ':'')+t.n,lvl:L,x,y,hp:Math.round(t.hp*g*(champ?2.6:1)),dmg:[Math.max(1,Math.round(t.dmg[0]*g*(champ?1.4:1))),Math.max(1,Math.round(t.dmg[1]*g*(champ?1.4:1)))],
    spd:t.spd*(champ?1.15:1),xp:Math.round(t.xp*(1+.25*(L-1))*(champ?3:1)),size:t.size*(champ?1.15:1),col:t.col,kind:t.kind,ai:t.ai||(t.ranged?'ranged':'melee'),ranged:t.ranged,bolt:t.bolt,champ,
    cd:rnd(0,1),flash:0,slow:0,aggro:false,dead:false,dt:0,wt:0,wd:null,face:1,atk:0,ph:Math.random()*6,hx:x,hy:y};
  if(z.def.rift){const n=z.def.rift;m.hp=Math.round(m.hp*Math.pow(RIFT_HP,n));m.dmg=m.dmg.map(v=>Math.round(v*Math.pow(RIFT_DMG,n)));}
  if(!z.def.rift&&W_&&W_.mult){m.hp=Math.round(m.hp*W_.mult.hp*(t.boss&&!BOSSES[t.boss].mini?(W_.mult.boss||1):1));m.dmg=m.dmg.map(v=>Math.max(1,Math.round(v*W_.mult.dmg)));}
  {const sk=skinOf(type);if(sk.n)m.name=(champ?'Champion ':'')+sk.n;if(sk.col)m.col=sk.col;if(sk.fur)m.fur=sk.fur;if(sk.bone)m.bone=sk.bone;if(sk.pal)m.pal=sk.pal;if(sk.gcol)m.gcol2=sk.gcol;}
  m.maxHp=m.hp;if(t.boss){const b=BOSSES[t.boss];m.boss=true;m.bossId=t.boss;m.vt=3;m.st=8;m.bd=Math.round((b.volley||BOSS_BASE.volley).dmg*g);if(b.mini){m.mini=true;m.at=2.5;m.at2=6;}}
  if(t.gcol)m.gcol=t.gcol;if(m.gcol2){m.gcol=m.gcol2;delete m.gcol2;}
  if(t.boss&&BOSSES[t.boss].shell){m.shellMax=Math.round(m.maxHp*BOSSES[t.boss].shell.part);m.shell=m.shellMax;}
  z.mons.push(m);return m;
}
function spawnGuardian(z){
  const type=pick(['brute','ombre','rodeur','sorcier']);let pos=null;
  for(let t=0;t<40&&!pos;t++){const a=rnd(0,6.28),r=rnd(5,8);const f=nearFloor(z,p.x+Math.cos(a)*r,p.y+Math.sin(a)*r);if(f&&!isWall(z,f[0],f[1])){const d=bfs(z,f[0],f[1],0)[Math.floor(p.y)*z.w+Math.floor(p.x)];if(d>0)pos=f;}}
  if(!pos)pos=[Math.floor(p.x),Math.floor(p.y)];
  const m=spawnMon(z,type,pos[0]+.5,pos[1]+.5,false,z.def.lvl+1);
  m.hp=m.maxHp=Math.round(m.maxHp*9);m.dmg=m.dmg.map(v=>Math.round(v*1.7));m.size*=1.6;m.boss=true;m.guard=true;m.vt=4;m.st=10;m.bd=Math.round(3*G(m.lvl));m.xp*=12;
  m.name='Gardien : '+monN(type);m.aggro=true;m.ranged=false;m.ai='melee';
  burst(m.x,m.y,'#c060ff',40);S.shake=.4;toast('Le gardien de la faille surgit');
}
function populate(z){
  const d=z.def,cand=[];for(let i=0;i<z.distE.length;i++)if(z.distE[i]>10)cand.push(i);
  for(let k=0;k<d.packs;k++){const c=pick(cand),cx=c%z.w,cy=(c/z.w)|0,type=pick(d.mons),champ=z.distE[c]>18&&Math.random()<(d.rift?.18:.12),n=champ?ri(3,4):ri(2,4)+(d.rift?1:0);
    for(let j=0;j<n;j++){const f=nearFloor(z,cx+ri(-1,1),cy+ri(-1,1));if(f)spawnMon(z,type,f[0]+.5,f[1]+.5,champ&&j===0);}}
  if(z.alcoves&&FORMES[z.forme]&&FORMES[z.forme].ambush){let g=1;for(const[ax,ay]of z.alcoves){const type=pick(d.mons),n=ri(3,4),gid=g++;
      for(let j=0;j<n;j++){const f=nearFloor(z,ax+ri(-1,1),ay+ri(-1,1));if(f){const m=spawnMon(z,type,f[0]+.5,f[1]+.5,j===0&&Math.random()<.35);m.amb=gid;}}}}
  if(z.def.aco&&z.acoSpot&&!z.arena){const[ax,ay]=z.acoSpot;spawnMon(z,BOSSES[z.def.aco].mon,ax+.5,ay+.5,false,Math.max(1,z.def.lvl)+1);
    for(let j=0;j<3;j++){const f=nearFloor(z,ax+ri(-2,2),ay+ri(-2,2));if(f)spawnMon(z,pick(d.mons),f[0]+.5,f[1]+.5,false);}}
  if(z.def.boss){const b=BOSSES[z.def.boss],c=z.center||[z.w>>1,z.h>>1],f=nearFloor(z,c[0],c[1])||c;spawnMon(z,b.mon,f[0]+.5,f[1]+.5,false);}
}
function repopulate(z){if(z.arena)return;
  if(z.def.aco&&z.acoSpot&&!z.mons.some(m=>m.mini&&!m.dead)&&z.mons.filter(m=>!m.dead).length>=12){const[ax,ay]=z.acoSpot;spawnMon(z,BOSSES[z.def.aco].mon,ax+.5,ay+.5,false,Math.max(1,z.def.lvl)+1);}
  const hadBoss=z.mons.some(m=>m.boss);z.mons=z.mons.filter(m=>!m.dead);if(z.mons.filter(m=>!m.boss).length<12){const nb=z.mons.some(m=>m.boss);populate(z);if(nb||hadBoss){let seen=false;z.mons=z.mons.filter(m=>{if(!m.boss)return true;if(seen)return false;seen=true;return true;});}}}
