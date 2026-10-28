'use strict';
/* ---------- Génération ---------- */
function newGrid(z,w,h,v){z.w=w;z.h=h;z.g=new Uint8Array(w*h).fill(v);}
function isWall(z,x,y){if(x<0||y<0||x>=z.w||y>=z.h)return true;return z.g[y*z.w+x]===1;}
/* v6.05 : ligne de vue commune. Vrai si rien ne bloque entre deux points (pas de 0,2 case, coins de murs compris). */
function losClear(z,ax,ay,bx,by){const d=Math.hypot(bx-ax,by-ay),n=Math.max(1,Math.ceil(d/.2));let px=Math.floor(ax),py=Math.floor(ay);
  for(let k=1;k<=n;k++){const t=k/n,x=Math.floor(ax+(bx-ax)*t),y=Math.floor(ay+(by-ay)*t);if(x===px&&y===py)continue;if(isWall(z,x,y))return false;if(x!==px&&y!==py&&isWall(z,px,y)&&isWall(z,x,py))return false;px=x;py=y;}return true;}
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
  z.spawn={x:14.5,y:15.5};z.portalSpot={x:10.5,y:16.5};z.objs.push({type:'rift',x:13.5,y:7.5});z.objs.push({type:'stash',x:19.5,y:12.5});z.objs.push({type:'board',x:15.5,y:11.5});{const f_=nearFloor(z,8,3);if(f_)z.objs.push({type:'dummy',x:f_[0]+.5,y:f_[1]+.5});}z.objs.push({type:'npc',id:'hilde',name:npcF('hilde'),x:22.5,y:16.5,col:'#7a4a3a'});z.objs.push({type:'npc',id:'recruit',name:npcF('recruit'),x:22.5,y:9.5,col:'#4a5a3a'});z.objs.push({type:'npc',id:'joueuse',name:npcF('joueuse'),x:15.5,y:21.5,col:'#8a3a6a'});z.objs.push({type:'npc',id:'demol',name:npcF('demol'),x:6.5,y:14.5,col:'#5a5048'});z.objs.push({type:'npc',id:'lapid',name:npcF('lapid'),x:11.5,y:21.5,col:'#3a6a7a'});z.objs.push({type:'npc',id:'autel',name:npcF('autel'),x:AUTEL_XY[0],y:AUTEL_XY[1],col:'#5a4a7a'});{const tx=TABLE_XY[0],ty=TABLE_XY[1];z.objs.push({type:'gtable',x:tx,y:ty});for(const [t,dx,dy] of [['demon',0,-1.15],['ange',1.15,0],['clown',0,1.15],['normal',-1.15,0]])z.objs.push({type:'tnpc',tone:t,name:TONES[t].who,x:tx+dx,y:ty+dy});}
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
/* v6.28 : grande étendue. Une bordure naturelle tout autour, le centre dégagé, quelques obstacles épars (rochers, bosquets), sans couloirs. */
function genOpen(z){const s=z.def.size||92;newGrid(z,s,s,0);const R=Math.random,ph=[R()*6,R()*6,R()*6];
  for(let y=0;y<s;y++)for(let x=0;x<s;x++){const e=Math.min(x,y,s-1-x,s-1-y),b=Math.max(2,3.5+2*Math.sin(x*.21+ph[0])+1.5*Math.sin(y*.17+ph[1])+Math.sin((x+y)*.09+ph[2]));if(e<b)z.g[y*s+x]=1;}
  const n=Math.round(s*s*.006);for(let k=0;k<n;k++){const cx=ri(8,s-9),cy=ri(8,s-9),r=R()<.7?1:2;if(Math.abs(cx-6)<6&&Math.abs(cy-(s>>1))<6)continue;for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(dx*dx+dy*dy<=r*r+R()*1.5)setT(z,cx+dx,cy+dy,1);}
  largestRegion(z);let ent=null;for(let x=2;x<s&&!ent;x++){const y=s>>1;if(!isWall(z,x,y)&&!isWall(z,x+1,y))ent=[x,y];}return ent||[8,s>>1];}
function genRooms(z){
  const s=z.def.size;newGrid(z,s,s,1);const rooms=[];
  for(let t=0;t<300&&rooms.length<(s>60?18:12);t++){const w=ri(5,10),h=ri(5,10),x=ri(2,s-w-3),y=ri(2,s-h-3);
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
/* v5.28 : Archipel, des îlots reliés par des ponts étroits */
function genArchipel(z){const s=z.def.size||62;newGrid(z,s,s,1);const isl=[];
  for(let t=0;t<400&&isl.length<(s>70?11:8);t++){const r=ri(4,6),x=ri(r+2,s-r-3),y=ri(r+2,s-r-3);if(isl.some(o=>Math.hypot(o.x-x,o.y-y)<o.r+r+4))continue;isl.push({x,y,r});}
  isl.sort((a,b)=>(a.x+a.y)-(b.x+b.y));
  for(const o of isl)for(let y=o.y-o.r;y<=o.y+o.r;y++)for(let x=o.x-o.r;x<=o.x+o.r;x++)if(Math.hypot(x-o.x,y-o.y)<=o.r+Math.sin((x+y)*1.3)*.6)setT(z,x,y,0);
  for(let i=1;i<isl.length;i++){const a=isl[i-1],b=isl[i];let x=a.x,y=a.y;while(x!==b.x){setT(z,x,y,0);x+=Math.sign(b.x-x);}while(y!==b.y){setT(z,x,y,0);y+=Math.sign(b.y-y);}}
  largestRegion(z);z.isles=isl;return[isl[0].x,isl[0].y];}
/* v5.28 : Spirale, on tourne vers le centre où attend un groupe de champions */
function genSpiral(z){const s=z.def.size||50;newGrid(z,s,s,1);const c=s>>1;let x=3,y=3,dir=0,len=s-7,turns=0;const D=[[1,0],[0,1],[-1,0],[0,-1]];
  while(len>2&&turns<40){for(let k=0;k<len;k++){setT(z,x,y,0);setT(z,x+(dir%2?1:0),y+(dir%2?0:1),0);x+=D[dir][0];y+=D[dir][1];}dir=(dir+1)%4;turns++;if(turns%2===0)len-=4;}
  for(let yy=-4;yy<=4;yy++)for(let xx=-4;xx<=4;xx++)if(xx*xx+yy*yy<=17)setT(z,c+xx,c+yy,0);let gx=x,gy=y;while(gx!==c||gy!==c){setT(z,gx,gy,0);gx+=Math.sign(c-gx);if(gx===c)gy+=Math.sign(c-gy);}
  largestRegion(z);z.center=[c,c];z.spiral=true;return[3,3];}
/* v5.49 : Descente. Des paliers qui s’enfoncent en zigzag, le sol s’assombrit à chaque marche. */
function genDescent(z){const s=z.def.size||62;newGrid(z,s,s,1);const P=[];const n=5;
  for(let k=0;k<n;k++){const t=k/(n-1);const cx=Math.round(7+t*(s-15)+(k%2?5:-3)),cy=Math.round(7+t*(s-15)+(k%2?-5:3));P.push([Math.max(6,Math.min(s-7,cx)),Math.max(6,Math.min(s-7,cy))]);}
  for(const[cx,cy]of P)for(let y=cy-4;y<=cy+4;y++)for(let x=cx-4;x<=cx+4;x++)if(Math.abs(x-cx)+Math.abs(y-cy)<=7)setT(z,x,y,0);
  for(let k=1;k<n;k++){let[x,y]=P[k-1];const[bx,by]=P[k];while(x!==bx){setT(z,x,y,0);setT(z,x,y+1,0);x+=Math.sign(bx-x);}while(y!==by){setT(z,x,y,0);setT(z,x+1,y,0);y+=Math.sign(by-y);}}
  for(let k=0;k<8;k++){const a=P[ri(0,n-1)],x=a[0]+ri(-9,9),y=a[1]+ri(-9,9);for(let yy=-1;yy<=1;yy++)for(let xx=-1;xx<=1;xx++)setT(z,x+xx,y+yy,0);}
  largestRegion(z);z.descent=true;return P[0];}
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
    const k=parseZ(id),back=def.parent?def.parent:id==='rift'||!k?'town':k.i>0?zid(k.a,k.i-1):k.a>1?zid(k.a-1,actLayout(k.a-1).length):'town',fwd=id==='rift'||!k||def.last?null:zid(k.a,k.i+1);
    z.objs.push({type:'exit',x:ent[0]+.5,y:ent[1]+.5,to:back,label:id==='rift'?'Retour au camp':'Vers : '+zoneName(back)});
    z.distE=bfs(z,ent[0],ent[1],0);
    const order=[];for(let i=0;i<z.distE.length;i++)if(z.distE[i]>=0)order.push(i);order.sort((a,b)=>z.distE[a]-z.distE[b]);
    const far=order[order.length-1];
    if(k&&!def.last){const SX=sidesOf(k.a,k.i);if(SX.length){const fe=z.objs.find(o=>o.type==='exit'&&o.to===fwd);/* placé après la sortie : voir plus bas */z.sidesTodo=SX;}}
    {const sc=z.spiral&&z.center?nearFloor(z,z.center[0]+2,z.center[1]):null;if(fwd)z.objs.push({type:'exit',x:(sc?sc[0]:far%z.w)+.5,y:(sc?sc[1]:(far/z.w)|0)+.5,to:fwd,label:'Vers : '+zoneName(fwd)});}
    /* entrées des chemins de traverse : le plus loin possible du trajet entrée → sortie (un détour) */
    if(z.sidesTodo){const fe=z.objs.find(o=>o.type==='exit'&&o.to===fwd),DF=fe?bfs(z,Math.floor(fe.x),Math.floor(fe.y),0):null,base=fe?z.distE[Math.floor(fe.y)*z.w+Math.floor(fe.x)]:0,taken=[];
      for(const sk of z.sidesTodo){let best=-1,bi=-1;for(const i of order){const d=z.distE[i];if(d<8)continue;const x=i%z.w,y=(i/z.w)|0;if(DIR8.some(([dx,dy])=>isWall(z,x+dx,y+dy)))continue;if(taken.some(t=>Math.hypot(t[0]-x,t[1]-y)<8))continue;if(fe&&Math.hypot(fe.x-x,fe.y-y)<6)continue;
          const sc=(DF?d+Math.max(0,DF[i])-base:d)+Math.random()*2;if(sc>best){best=sc;bi=i;}}
        if(bi<0)bi=order[Math.floor(order.length*.6)];const x=bi%z.w,y=(bi/z.w)|0;taken.push([x,y]);const to=xid(k.a,sk);z.objs.push({type:'exit',x:x+.5,y:y+.5,to,side:true,label:'Chemin de traverse : '+((sideOf(k.a,sk)||{}).n||'?')});}delete z.sidesTodo;}
    if(def.wp){const w=order.find(i=>z.distE[i]===4)??order[Math.min(order.length-1,20)];z.objs.push({type:'wp',x:w%z.w+.5,y:((w/z.w)|0)+.5});}
    const chests=def.chests||F.chests;
    if(chests==='rooms'&&z.rooms){const rs=z.rooms.map(r=>({r,d:z.distE[r.cy*z.w+r.cx]})).filter(o=>o.d>0).sort((a,b)=>b.d-a.d);const rr=(rs[1]||rs[0]).r;
      const c=nearFloor(z,rr.cx,rr.cy);z.objs.push({type:'chest',x:c[0]+.5,y:c[1]+.5,relic:def.relic||false,open:false});
      for(let k=2;k<5&&k<rs.length;k++){const c2=nearFloor(z,rs[k].r.cx+1,rs[k].r.cy);if(c2)z.objs.push({type:'chest',x:c2[0]+.5,y:c2[1]+.5,open:false});}}
    if(chests==='order'){for(let k=0;k<3;k++){const i=order[Math.floor(order.length*(.35+k*.2))];z.objs.push({type:'chest',x:i%z.w+.5,y:((i/z.w)|0)+.5,open:false});}}
    if(def.mods&&def.mods.includes('tresors'))for(const fr of[.5,.78]){const i=order[Math.floor(order.length*fr)],c=nearFloor(z,i%z.w+1,(i/z.w)|0);if(c)z.objs.push({type:'chest',x:c[0]+.5,y:c[1]+.5,open:false});}
    if(chests==='alcoves'&&z.alcoves){z.alcoves.filter((_,k)=>k%2===1).slice(0,3).forEach(([ax,ay])=>{const c=nearFloor(z,ax,ay);if(c)z.objs.push({type:'chest',x:c[0]+.5,y:c[1]+.5,open:false});});}
    if(def.relic&&!z.objs.some(o=>o.relic)){const i=order[Math.floor(order.length*.85)];z.objs.push({type:'chest',x:i%z.w+.5,y:((i/z.w)|0)+.5,relic:def.relic,open:false});}
    if(z.arena&&fwd){const ex=z.objs.find(o=>o.type==='exit'&&o.to===fwd);if(ex)ex.lock=true;}
    if(def.aco){const i=order[Math.floor(order.length*.9)];z.acoSpot=[i%z.w,(i/z.w)|0];}
    if(def.ev&&EVENTS[def.ev]&&!z.arena){const room=i=>{const x=i%z.w,y=(i/z.w)|0;let n=0;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++)if(!isWall(z,x+dx,y+dy))n++;return n;};
      const f0=def.ev==='relic'?.7:.55;let best=null,bn=-1;for(let t=0;t<40;t++){const i=order[Math.floor(order.length*clamp(f0+(t%2?1:-1)*t*.006,.3,.85))];const n=room(i);if(n>bn){bn=n;best=i;}if(n>=34)break;}
      z.ev={id:def.ev,x:best%z.w+.5,y:((best/z.w)|0)+.5,state:'idle',v:def.evv||null};if(def.ev==='relic')z.objs.push({type:'relic',x:z.ev.x,y:z.ev.y});if(def.ev==='cchest')z.objs.push({type:'cchest',x:z.ev.x,y:z.ev.y});if(def.ev==='altar')z.objs.push({type:'altar',x:z.ev.x,y:z.ev.y});if(def.ev==='traveler')z.objs.push({type:'traveler',x:z.ev.x,y:z.ev.y});if(def.ev==='well')z.objs.push({type:'well',x:z.ev.x,y:z.ev.y});if(def.ev==='peddler')z.objs.push({type:'peddler',x:z.ev.x,y:z.ev.y});if(def.ev==='gibbet')z.objs.push({type:'gibbet',x:z.ev.x,y:z.ev.y});if(def.ev==='shrine')z.objs.push({type:'shrine',x:z.ev.x,y:z.ev.y});if(def.ev==='cage')z.objs.push({type:'cage',x:z.ev.x,y:z.ev.y});if(def.ev==='grave')z.objs.push({type:'fgrave',x:z.ev.x,y:z.ev.y});
      /* v6.22 : bûchers et statues autour de l’événement */
      if(def.ev==='pyre'||def.ev==='statues'){const n=def.ev==='pyre'?3:4,SP=spawnSpots(z,z.ev.x,z.ev.y,2.2,4.5,n);for(const f of SP)z.objs.push({type:def.ev==='pyre'?'pyre':'statue',x:f[0]+.5,y:f[1]+.5,v:ri(0,2)});
        if(SP.length<n){z.ev=null;z.objs=z.objs.filter(o=>o.type!=='pyre'&&o.type!=='statue');}}}
    z.spawn={x:ent[0]+.5,y:ent[1]+.5};
    if(F.creep){let mx=0;for(const v of z.distE)if(v>mx)mx=v;z.creep={t:22,d:-2,max:Math.max(4,mx-9),on:false,acc:0};}
    addProps(z);populate(z);
    /* v5.94 : objets cassables (urnes, tonneaux, caisses) et barils de poudre */
    if(!def.trial){const nU=Math.round(z.w*z.h/260),nK=z.style==='crypt'?0:ri(0,2);const okp=i=>{const x=i%z.w,y=(i/z.w)|0;return!isWall(z,x,y)&&!z.objs.some(o=>Math.hypot(o.x-x-.5,o.y-y-.5)<1.6)&&DIR8.filter(([dx,dy])=>!isWall(z,x+dx,y+dy)).length>=5;};
      for(let k=0,t=0;k<nU&&t<nU*8;t++){const i=order[Math.floor(Math.random()*order.length)];if(!okp(i)||z.distE[i]<4)continue;z.objs.push({type:'urn',x:i%z.w+.5+rnd(-.2,.2),y:((i/z.w)|0)+.5+rnd(-.2,.2),v:ri(0,2)});k++;}
      {const th=z.palTheme||curWorld().theme,vk=['cendres','fonte','astre','volcan','abime'].includes(th)?'fire':th==='givre'?'ice':'gas',nV=ri(2,4);z.vents=[];
        for(let k=0,t=0;k<nV&&t<60;t++){const i=order[Math.floor(Math.random()*order.length)];if(!okp(i)||z.distE[i]<7||z.vents.some(v=>Math.hypot(v.x-i%z.w,v.y-((i/z.w)|0))<6))continue;z.vents.push({x:i%z.w+.5,y:((i/z.w)|0)+.5,k:vk,t:rnd(2,7)});k++;}}
      /* v6.00 : rayons de lumière dans les cryptes et les antres ; flaques (ou plaques de glace) dans les plaines */
      {const th=z.palTheme||curWorld().theme;z.shafts=[];z.puddles=[];
        if(z.style!=='plain'){const nS=ri(2,4);for(let k=0,t=0;k<nS&&t<60;t++){const i=order[Math.floor(Math.random()*order.length)];if(!okp(i)||z.shafts.some(q=>Math.hypot(q.x-i%z.w,q.y-((i/z.w)|0))<7))continue;z.shafts.push({x:i%z.w+.5,y:((i/z.w)|0)+.5,w:rnd(.8,1.3),ph:rnd(0,6)});k++;}}
        else{const nP={marais:ri(6,9),pre:ri(4,6),ossu:3,givre:4,foret:ri(3,5)}[th]||0;for(let k=0,t=0;k<nP&&t<80;t++){const i=order[Math.floor(Math.random()*order.length)],x=i%z.w,y=(i/z.w)|0;if(z.distE[i]<3||isWall(z,x,y)||DIR8.some(([dx,dy])=>isWall(z,x+dx,y+dy))||z.puddles.some(q=>Math.hypot(q.x-x,q.y-y)<3))continue;z.puddles.push({x:x+.5+rnd(-.2,.2),y:y+.5+rnd(-.2,.2),r:rnd(.55,1.05),e:rnd(.6,1),ice:th==='givre'});k++;}}}
      /* v6.01 : touffes vivantes (herbes, roseaux, ronces, fleurs de givre, cristaux) */
      {const th=z.palTheme||curWorld().theme,gk=GRASS[th];z.grass=[];if(gk){const nG=Math.round(z.w*z.h/(z.style==='plain'?45:140));for(let k=0,t=0;k<nG&&t<nG*4;t++){const i=order[Math.floor(Math.random()*order.length)],x=i%z.w,y=(i/z.w)|0;if(z.distE[i]<2||isWall(z,x,y))continue;const nearW=DIR8.some(([dx,dy])=>isWall(z,x+dx,y+dy));if(z.style!=='plain'&&!nearW)continue;z.grass.push({x:x+rnd(.15,.85),y:y+rnd(.15,.85),n:ri(4,7),h:rnd(.7,1.3),ph:rnd(0,6),b:0});k++;}}}
      /* v5.97 : une dépouille d’aventurier à fouiller, et parfois un levier qui ouvre une cache dans le mur */
      if(Math.random()<.65)for(let t=0;t<40;t++){const i=order[Math.floor(Math.random()*order.length)];if(!okp(i)||z.distE[i]<6)continue;z.objs.push({type:'corpse',x:i%z.w+.5,y:((i/z.w)|0)+.5,v:ri(0,2),f:Math.random()<.5?1:-1});break;}
      if(Math.random()<.5){const c=[];for(let y=2;y<z.h-3;y++)for(let x=2;x<z.w-3;x++){if(!isWall(z,x,y)||z.hide&&z.hide[y*z.w+x])continue;for(const[dx,dy]of[[1,0],[0,1]]){const fx=x+dx,fy=y+dy;if(isWall(z,fx,fy)||!isWall(z,x-dx,y-dy)||!isWall(z,x+dy,y+dx)||!isWall(z,x-dy,y-dx))continue;const fi=fy*z.w+fx;if(z.distE[fi]<8||z.objs.some(o=>Math.hypot(o.x-fx-.5,o.y-fy-.5)<2))continue;c.push([x,y,fx,fy]);}}
        if(c.length){const[x,y,fx,fy]=c[Math.floor(Math.random()*c.length)];z.objs.push({type:'lever',x:fx+.5,y:fy+.5,wx:x,wy:y});}}
      for(let k=0,t=0;k<nK&&t<40;t++){const i=order[Math.floor(Math.random()*order.length)];if(!okp(i)||z.distE[i]<8)continue;z.objs.push({type:'keg',x:i%z.w+.5,y:((i/z.w)|0)+.5});k++;}}
    if(def.sideq)sideSetup(z,order);
    if(mut('voile')&&!def.trial&&Math.random()<.35){const i=order[Math.floor(order.length*rnd(.4,.8))],m=spawnMon(z,'arpenteur',i%z.w+.5,((i/z.w)|0)+.5,true);m.cx=['blink'];m.name='Arpenteur du Voile';}
    if(z.spiral&&z.center){for(let k=0;k<4;k++){const f=nearFloor(z,z.center[0]+rnd(-2,2),z.center[1]+rnd(-2,2));if(f)spawnMon(z,pick(def.mons),f[0]+.5,f[1]+.5,k<2);}}
    if(z.ev){z.mons=z.mons.filter(m=>m.boss||Math.hypot(m.x-z.ev.x,m.y-z.ev.y)>5.5);
      if(z.ev.id==='nests'){const DD=bfs(z,Math.floor(z.ev.x),Math.floor(z.ev.y),7);let n=0;for(let k=0;k<30&&n<3;k++){const a=k/3*6.28+.4+k*.37,r=2.5+(k%4)*.5,f=nearFloor(z,z.ev.x+Math.cos(a)*r,z.ev.y+Math.sin(a)*r);if(f&&DD[f[1]*z.w+f[0]]>=0&&!z.mons.some(m=>m.nest&&Math.hypot(m.x-f[0]-.5,m.y-f[1]-.5)<1.5)){spawnMon(z,'nid',f[0]+.5,f[1]+.5,false).nest=true;n++;}}}}
  }
  for(const o of z.objs)if(o.type==='exit'||o.type==='wp')o.arr=arrival(z,Math.floor(o.x),Math.floor(o.y));
  nextActExit(z);
  if(id!=='town')z.spawn=z.objs[0].arr;
  z.wh=new Uint8Array(z.w*z.h);z.lava=new Uint8Array(z.w*z.h);z.lavaList=st==='lair'?[]:null;
  for(let i=0;i<z.wh.length;i++)z.wh[i]=st==='plain'?20+Math.random()*20:st==='crypt'?38:st==='lair'?30+Math.random()*10:30;
  if(id==='town')for(let y=0;y<z.h;y++)for(let x=0;x<z.w;x++)if(x===z.w-1||y===z.h-1)z.wh[y*z.w+x]=9;
  z.seen=new Uint8Array(z.w*z.h);z.near=new Uint8Array(z.w*z.h);z.fc=new Array(z.w*z.h);
  const PB=(THM().pal&&THM().pal[st])||DECORS[st];const f=PB.floor;const LA=PB.lavaAdd||[70,18,0];
  for(let y=0;y<z.h;y++)for(let x=0;x<z.w;x++){const i=y*z.w+x;
    if(z.g[i]===1&&!z.hide[i]){for(const[dx,dy]of DIR8)if(!isWall(z,x+dx,y+dy)||z.hide[(y+dy)*z.w+x+dx]){z.near[i]=1;break;}continue;}
    let n=(Math.sin(x*12.9898+y*78.233)*43758.5453)%1;n=(n<0?n+1:n)*14-7;let r=f[0]+n,g=f[1]+n,b=f[2]+n;
    if(st==='crypt'&&(x+y)%2)r-=4,g-=4,b-=3;
    if(st==='plain'&&n>5.5){r+=10;g+=4;}
    if(st==='lair'&&n>6.2){r+=LA[0];g+=LA[1];b+=LA[2];z.lava[i]=1;if(z.lavaList.length<40&&Math.random()<.5)z.lavaList.push({x:x+.5,y:y+.5});}
    if(st==='town'&&n<-5.5){r-=8;g+=2;b-=6;}
    if(z.descent&&z.distE){const dm=z.dmax||(z.dmax=Math.max(1,...z.distE));const k=1-.5*Math.min(1,Math.max(0,z.distE[i])/dm);r*=k;g*=k;b*=k;}
    z.fc[i]=`rgb(${r|0},${g|0},${b|0})`;}
  z.flow=null;z.flowT=0;
  return z;
}
function addProps(z){
  z.hide=new Uint8Array(z.w*z.h);const st=z.style;
  const okSpot=(x,y)=>{for(const o of z.objs)if(Math.hypot(o.x-x-.5,o.y-y-.5)<2.6)return false;return true;};
  const open8=(x,y)=>DIR8.every(([dx,dy])=>!isWall(z,x+dx,y+dy));
  const block=(x,y)=>{z.g[y*z.w+x]=1;z.hide[y*z.w+x]=1;};
  const FL=(THEMES[z.palTheme||curWorld().theme]||{}).flora;
  if(st==='town'){
    const cols=[['#a08458','#5e4a30','#7a6242'],['#8a5a4a','#4e3028','#6a4436'],['#7e8466','#464a36','#5e644c']];
    z.tents.forEach((t,k)=>{z.props.push({k:'tent',x:t.x,y:t.y,c:cols[k%3]});for(let j=0;j<2;j++)for(let i=0;i<3;i++)z.hide[(t.y+j)*z.w+t.x+i]=1;});
    z.props.push({k:'torch',x:25.7,y:12.2},{k:'torch',x:25.7,y:15.8},{k:'barrel',x:8.4,y:6.6},{k:'barrel',x:8.6,y:7.4},{k:'crate',x:16.4,y:9.2},{k:'crate',x:16.6,y:10.1},{k:'banner',x:12.1,y:11.3},{k:'barrel',x:23.6,y:21.4},{k:'crate',x:3.6,y:8.6},{k:'torch',x:9.4,y:10.6},{k:'anvil',x:23.4,y:17.6},{k:'hay',x:7.6,y:16.4},{k:'hay',x:8.3,y:17.3},{k:'hay',x:21.4,y:6.8},{k:'torch',x:23.8,y:15.4},{k:'torch',x:5.4,y:13.2});
    return;}
  if(st==='crypt'&&z.rooms)for(const r of z.rooms)for(const[x,y]of[[r.x,r.y],[r.x+r.w-1,r.y+r.h-1]])if(!isWall(z,x,y)&&okSpot(x,y))z.props.push({k:'brazier',x:x+.5,y:y+.5});
  if(FORMES[z.forme]&&FORMES[z.forme].braziers&&z.center)for(let k=0;k<6;k++){const a=k/6*6.28+.3,f=nearFloor(z,z.center[0]+Math.cos(a)*10.5,z.center[1]+Math.sin(a)*10.5);if(f)z.props.push({k:'brazier',x:f[0]+.5,y:f[1]+.5});}
  for(let y=2;y<z.h-2;y++)for(let x=2;x<z.w-2;x++){if(isWall(z,x,y)||!okSpot(x,y))continue;const r=Math.random();
    if(st==='plain'&&FL){/* v6.15 : flore propre au biome */
      if(FL==='foret'){if(r<.05&&open8(x,y)){block(x,y);const br=[];for(let k=0;k<ri(3,5);k++)br.push({h:rnd(22,42),a:rnd(.3,2.8),l:rnd(8,14),w:rnd(1.6,2.8),t:0});z.props.push({k:'tree',leaf:1,x:x+.5,y:y+.5,br,s:rnd(.9,1.25),g:pick([['#1e3a14','#2e5a1e','#4a7a2a'],['#24401a','#3a6a22','#6a8a2a'],['#3a3014','#6a5a1e','#9a7a2a']])});}
        else if(r<.058)z.props.push({k:'shroom',x:x+.5,y:y+.5,c:pick(['#a83a2a','#c88a3a','#8a6a4a'])});else if(r<.068)z.props.push({k:'rock',x:x+rnd(.3,.7),y:y+rnd(.3,.7),s:rnd(.6,1)});}
      else if(FL==='desert'){if(r<.012&&open8(x,y)){block(x,y);z.props.push({k:'cactus',x:x+.5,y:y+.5,s:rnd(.8,1.2)});}else if(r<.03)z.props.push({k:'rock',x:x+rnd(.3,.7),y:y+rnd(.3,.7),s:rnd(.6,1.3)});else if(r<.036)z.props.push({k:'bones',x:x+.5,y:y+.5});}
      else if(FL==='volcan'){if(r<.02)z.props.push({k:'spike',x:x+rnd(.3,.7),y:y+rnd(.3,.7),s:rnd(.7,1.3)});else if(r<.04)z.props.push({k:'rock',x:x+rnd(.3,.7),y:y+rnd(.3,.7),s:rnd(.6,1.2)});else if(r<.05)z.props.push({k:'rubble',x:x+rnd(.3,.7),y:y+rnd(.3,.7),s:rnd(.7,1.1)});}
      else{if(r<.02)z.props.push({k:'spike',x:x+rnd(.3,.7),y:y+rnd(.3,.7),s:rnd(.7,1.3)});else if(r<.04)z.props.push({k:'bones',x:x+.5,y:y+.5});else if(r<.046)z.props.push({k:'rubble',x:x+rnd(.3,.7),y:y+rnd(.3,.7),s:rnd(.7,1.1)});}}
    else if(st==='plain'){
      if(r<.014&&open8(x,y)){block(x,y);const br=[];for(let k=0;k<ri(3,5);k++)br.push({h:rnd(22,42),a:rnd(.3,2.8),l:rnd(10,18),w:rnd(1.5,3),t:rnd(-.8,.8)});z.props.push({k:'tree',x:x+.5,y:y+.5,br,s:rnd(.85,1.2)});}
      else if(r<.024)z.props.push({k:'grave',x:x+.5,y:y+.5,t:rnd(-.2,.2)});
      else if(r<.027)z.props.push({k:'hay',x:x+.5,y:y+.5});
      else if(r<.031)z.props.push({k:'rubble',x:x+rnd(.3,.7),y:y+rnd(.3,.7),s:rnd(.7,1.1)});
      else if(r<.042)z.props.push({k:'rock',x:x+rnd(.3,.7),y:y+rnd(.3,.7),s:rnd(.6,1.2)});
      else if(r<.05)z.props.push({k:'bones',x:x+.5,y:y+.5});}
    else if(st==='crypt'){
      if(r<.012&&open8(x,y)){block(x,y);z.props.push({k:'coffin',x:x+.5,y:y+.5,rot:Math.random()<.5});}
      else if(r<.03)z.props.push({k:'bones',x:x+.5,y:y+.5});
      else if(r<.036&&(isWall(z,x-1,y)||isWall(z,x,y-1)))z.props.push({k:'candles',x:x+.5,y:y+.5,n:ri(3,6)});
      else if(r<.05)z.props.push({k:'rubble',x:x+rnd(.3,.7),y:y+rnd(.3,.7),s:rnd(.7,1.2)});}
    else if(st==='lair'){if(z.def.rift&&r<.006&&open8(x,y))z.props.push({k:'brazier',x:x+.5,y:y+.5});else if(r<.035)z.props.push({k:'bones',x:x+.5,y:y+.5});
      else if(r<.048)z.props.push({k:'spike',x:x+rnd(.3,.7),y:y+rnd(.3,.7),s:rnd(.7,1.3)});else if(r<.058)z.props.push({k:'rubble',x:x+rnd(.3,.7),y:y+rnd(.3,.7),s:rnd(.7,1.2)});}}
}
function spawnMon(z,type,x,y,champ,lvlOverride){
  const t=MT[type],W_=S&&WORLDS[S.world];let L=lvlOverride||(t.lvl?t.lvl+((W_&&W_.lvlAdd)||0):0)||Math.max(1,z.def.lvl);
  /* v6.13 : un boss d’acte se met au niveau du héros si celui-ci le dépasse (on ne l’écrase plus en revenant trop fort) */
  if(t.boss&&BOSSES[t.boss]&&!BOSSES[t.boss].mini&&!lvlOverride&&p&&p.lvl>L)L=p.lvl;const g=G(L);
  const m={t:type,name:(champ?'Champion ':'')+t.n,lvl:L,x,y,hp:Math.round(t.hp*g*(champ?2.6:1)),dmg:[Math.max(1,Math.round(t.dmg[0]*g*(champ?1.4:1))),Math.max(1,Math.round(t.dmg[1]*g*(champ?1.4:1)))],
    spd:t.spd*(champ?1.15:1),xp:Math.round(t.xp*(1+.25*(L-1))*(champ?3:1)),size:t.size*(champ?1.15:1),col:t.col,kind:t.kind,ai:t.ai||(t.ranged?'ranged':'melee'),ranged:t.ranged,bolt:t.bolt,champ,
    cd:rnd(0,1),flash:0,slow:0,aggro:false,dead:false,dt:0,wt:0,wd:null,face:1,atk:0,ph:Math.random()*6,hx:x,hy:y};
  if(!z.def.rift){m.hp=Math.round(m.hp*MON_CURVE(L));m.dmg=m.dmg.map(v=>Math.max(1,Math.round(v*EARLY_DMG(L))));}
  if(z.def.rift){const n=z.def.rift;m.hp=Math.round(m.hp*Math.pow(RIFT_HP,n));m.dmg=m.dmg.map(v=>Math.round(v*Math.pow(RIFT_DMG,n)));}
  if(z.pact&&!t.boss)m.hp=Math.round(m.hp*1.5);
  if(mut('sang'))m.dmg=m.dmg.map(v=>Math.max(1,Math.round(v*1.2)));if(mut('fragile'))m.hp=Math.round(m.hp*.8);if(mut('hate'))m.spd*=1.15;
  if(zHas(z,'rapides')&&!t.boss)m.spd*=1.25;
  if(hasMod(z,'tough'))m.hp=Math.round(m.hp*1.4);if(hasMod(z,'fast'))m.spd*=1.3;
  if(!z.def.rift&&W_&&W_.mult){m.hp=Math.round(m.hp*W_.mult.hp*(t.boss&&!BOSSES[t.boss].mini?(W_.mult.boss||1):1));m.dmg=m.dmg.map(v=>Math.max(1,Math.round(v*W_.mult.dmg)));}
  if(t.fur)m.fur=t.fur;if(t.bone)m.bone=t.bone;if(t.plates)m.plates=t.plates;applyLook(m,t);
  {const sk=skinOf(type);if(sk.n)m.name=(champ?'Champion ':'')+sk.n;if(sk.col)m.col=sk.col;if(sk.fur)m.fur=sk.fur;if(sk.bone)m.bone=sk.bone;if(sk.pal)m.pal=sk.pal;if(sk.gcol)m.gcol2=sk.gcol;if(sk.steed){m.steed=true;if(!t.boss)m.size*=1.25;}applyLook(m,sk);}
  /* v6.21 : certaines familles attaquent autrement selon le monde */
  if(!t.boss&&S&&S.world){const a=atkAi(type,curWorld().theme);if(a)m.ai=a;}
  if(champ&&!t.boss)giveAffixes(m,z);
  m.maxHp=m.hp;if(t.boss){const b=BOSSES[t.boss];m.boss=true;m.bossId=t.boss;/* v6.45 : l’équipement de début de partie est plus modeste ; les boss du début ont un peu moins de vie (−15 % au niveau 12, plus rien au niveau 30) */{const L_=m.lvl||1,k_=L_>=30?1:.8+.2*L_/30;m.hp=m.maxHp=Math.round(m.maxHp*k_);}m.vt=3;m.st=8;m.bd=Math.round((b.volley||BOSS_BASE.volley).dmg*g);if(b.mini){m.mini=true;m.at=2.5;m.at2=6;}}
  /* v6.56 : la campagne résiste. Hors failles et épreuves : acolytes, lieutenants et boss d’acte plus solides et plus dangereux, champions plus coriaces. */
  if(!z.def.rift&&!z.def.trial){if(t.boss&&BOSSES[t.boss]){const K=BOSSES[t.boss].mini?CAMP.mini:CAMP.boss;m.campK=K.hp;m.hp=m.maxHp=Math.round(m.maxHp*K.hp);m.dmg=m.dmg.map(v=>Math.max(1,Math.round(v*K.dmg)));m.bd=Math.round(m.bd*K.dmg);}else if(champ&&(z.def.lvl||1)>=6){/* v6.57 : pas avant le niveau 6 (un champion de début de partie bloquait un héros encore sans talent) */m.hp=m.maxHp=Math.round(m.maxHp*CAMP.champ.hp);m.dmg=m.dmg.map(v=>Math.max(1,Math.round(v*CAMP.champ.dmg)));}}
  if(brOn(z)){const n=S.br,kH=Math.pow(BR_HP,n),kD=Math.pow(BR_DMG,n);m.hp=m.maxHp=Math.round(m.maxHp*kH);m.dmg=m.dmg.map(v=>Math.max(1,Math.round(v*kD)));if(m.bd)m.bd=Math.round(m.bd*kD);m.campK=(m.campK||1)*kH;m.xp=Math.round(m.xp*(1+BR_XP*n));}
  if(t.gcol)m.gcol=t.gcol;if(m.gcol2){m.gcol=m.gcol2;delete m.gcol2;}
  if(t.boss&&BOSSES[t.boss].shell){/* v6.56 : l’armure du Forgeron ne grandit pas avec la vie de campagne (elle se reforge sans cesse) */m.shellMax=Math.round(m.maxHp/(m.campK||1)*BOSSES[t.boss].shell.part);m.shell=m.shellMax;}
  /* v6.07 : Valgris en trois formes. Chaque forme a sa propre barre de vie, pleine ; le total des trois est celui d’avant. */
  /* v6.13 : chaque forme a la vie entière d’avant (le combat est environ trois fois plus long) et frappe 25 % plus fort */
  /* v6.25 : le boss de l’acte I en deux formes ; chaque forme a 55 % de la vie d’avant */
  if(type==='varsha'){m.formN=2;m.form=1;m.hp=m.maxHp=Math.round(m.maxHp*VARSHA2.hp);}
  if(type==='valgris'){m.formN=VFORMS.n;m.form=1;m.hp=m.maxHp=Math.round(m.maxHp/VFORMS.n*VFORMS.kw[clamp((S&&S.world||1)-1,0,6)]);m.dmg=m.dmg.map(v=>Math.round(v*VFORMS.dmg));m.bd=Math.round(m.bd*VFORMS.dmg);}
  z.mons.push(m);return m;
}
function sideSetup(z,order){const sd=z.def.sideq,L=z.def.lvl,far=order[order.length-1],room=i=>{const x=i%z.w,y=(i/z.w)|0;let n=0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(!isWall(z,x+dx,y+dy))n++;return n;};
  const spot=f=>{let best=order[Math.floor(order.length*f)],bn=-1;for(let t=-12;t<=12;t++){const i=order[clamp(Math.floor(order.length*f)+t*3,0,order.length-1)];const n=room(i);if(n>bn){bn=n;best=i;}}return[best%z.w,(best/z.w)|0];};
  if(sd.type==='chef'){const[x,y]=z.center&&z.spiral?z.center:spot(.97);const f=nearFloor(z,x,y)||[x,y];const m=spawnMon(z,sd.mon,f[0]+.5,f[1]+.5,true,L+2);m.hp=m.maxHp=Math.round(m.maxHp*3);m.dmg=m.dmg.map(v=>Math.round(v*1.25));m.size*=1.35;m.name=sd.chef;m.sideChef=true;
    for(const c of spawnSpots(z,f[0]+.5,f[1]+.5,1.5,3.5,3))spawnMon(z,sd.mon,c[0]+.5,c[1]+.5,false,L+1);}
  if(sd.type==='stones'){for(const fr of[.3,.55,.78,.97]){const[x,y]=spot(fr);z.objs.push({type:'stone',x:x+.5,y:y+.5,on:false,kind:sd.stone});}}
  if(sd.type==='relic'){const[x,y]=spot(.98);z.objs.push({type:'chest',x:x+.5,y:y+.5,open:false,relic:true,sideRelic:true});for(const c of spawnSpots(z,x+.5,y+.5,2,4.5,5))spawnMon(z,pick(z.def.mons),c[0]+.5,c[1]+.5,Math.random()<.4,L+1);}
  z.sideN=z.mons.filter(m=>!m.boss).length;}
function stoneTouch(o){const z=S.cur;if(o.on||!z.def.sideq)return;o.on=true;sfx('portal');S.shake=Math.max(S.shake,.3);burst(o.x,o.y,'#7fd0ff',30);
  const n=z.objs.filter(q=>q.type==='stone'&&q.on).length;toast(`${(z.def.sideq&&z.def.sideq.sn)||(o.kind==='cloche'?'Cloche':'Pierre')} ${n} / 4`);for(const m of evSpawnRing(z,o.x,o.y,2.5,5,3+Math.min(2,n-1)))m.evm=false;if(n>=4)S.pend.push({t:1.5,fn:()=>{if(!z.mons.some(m=>!m.dead&&m.aggro&&dist(m,p)<8))sideDone(z);else z.sideWait=true;}});}
function sideTrack(z){const sd=z.def.sideq,st=sideState(z.def.sid);if(st>=2)return`<b>${sd.n}</b><br>Accompli. La sortie te ramène sur le chemin.`;
  if(sd.type==='chef'){const c=z.mons.find(m=>m.sideChef);return`<b>${sd.n}</b><br>Abats ${sd.chef}${c&&!c.dead&&c.hp<c.maxHp?` (${Math.ceil(c.hp/c.maxHp*100)} %)`:''}`;}
  if(sd.type==='stones')return`<b>${sd.n}</b><br>${sd.sp||(sd.stone==='cloche'?'Cloches':'Pierres')} réveillées : ${z.objs.filter(q=>q.type==='stone'&&q.on).length} / 4`;
  if(sd.type==='clear'){const a=z.mons.filter(m=>!m.dead&&!m.boss).length,goal=Math.ceil((z.sideN||1)*.15);return`<b>${sd.n}</b><br>Encore ${Math.max(0,a-goal)} créatures à abattre`;}
  return`<b>${sd.n}</b><br>Trouve la malle au fond.`;}
function updSide(z){const sd=z.def.sideq;if(!sd||sideState(z.def.sid)>=2)return;
  if(sd.type==='clear'&&z.mons.filter(m=>!m.dead&&!m.boss).length<=Math.ceil((z.sideN||1)*.15))sideDone(z);
  if(sd.type==='stones'&&z.sideWait&&!z.mons.some(m=>!m.dead&&m.aggro&&dist(m,p)<8)){z.sideWait=false;sideDone(z);}}
/* Récompenses des chemins de traverse */
function sideDone(z){const sd=z.def.sideq,sid=z.def.sid;if(!sd||sideState(sid)>=2)return;S.q.side=S.q.side||{};S.q.side[sid]=2;const L=z.def.lvl,x=p.x,y=p.y;let msg='';
  if(sd.reward==='ally'){if(!p.comp){p.comp={type:'archer',xp:ARANKS[1][1],ev:0};spawnAlly();msg='Une archère libérée te suit (rang Aguerri).';}else{p.comp.xp=(p.comp.xp||0)+200;msg='Ton compagnon gagne 200 d’expérience.';}}
  else if(sd.reward==='talent'){p.bonusPts=(p.bonusPts||0)+1;p.pts++;msg='+1 point de talent, pour toujours.';}
  else if(sd.reward==='bag'){if((p.bagRows|0)<BAG_MAX){p.bagRows=(p.bagRows|0)+1;setBagRows();msg=`Sac de voyage : ${INV_H} rangées.`;}else{for(let k=0;k<4;k++)addOrb(orbPick());msg='Ton sac est déjà au maximum : 4 orbes à la place.';}}
  else if(sd.reward==='orbs'){for(let k=0;k<3;k++)addOrb(orbPick());addOrb(pick(['tumulte','aube','serment']));msg='4 orbes de forge, dont un rare.';}
  else if(sd.reward==='orbsRare'){addOrb('aube');addOrb('serment');addOrb('tumulte',2);msg='Orbes rares : aube, serment, 2 tumultes.';}
  else if(sd.reward==='set'){dropAt(z,x,y,{kind:'item',it:genSetPiece(L+1)});for(let k=0;k<2;k++)addOrb(orbPick());msg='Une pièce d’ensemble à tes pieds, et 2 orbes.';}
  else if(sd.reward==='legend'){let it=genItem(L+1,3,200);for(let t=0;t<30&&it.rar!==3;t++)it=genItem(L+1,3,200);dropAt(z,x,y,{kind:'item',it});msg='Un objet légendaire à tes pieds.';}
  dropAt(z,x,y,{kind:'item',it:genItem(L+1,2,p.st.mf+80)});dropAt(z,x,y,{kind:'gold',v:Math.round(90*(1+.3*(L-1)))});
  S.sideDone=(S.sideDone||0)+1;S.pend.push({t:2.5,fn:()=>letterGive(z,x,y)});toast('Chemin de traverse accompli');say(sd.n+' : '+msg,6000);sfx('leg');for(let k=0;k<3;k++)burst(x+rnd(-1,1),y+rnd(-1,1),'#7fd0ff',24);save();}
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
  /* v6.49 : début moins chargé. Au niveau 1 : .8 des groupes, de 2 ou 3 monstres, bien espacés ; normal vers le niveau 8. */
  const early_=!d.rift&&!(S&&S.world>1)&&d.lvl<8,eK_=early_?Math.min(1,.8+(1-.8)*(d.lvl-1)/7):1,nP_=Math.round(d.packs*eK_),used_=[];
  for(let k=0;k<nP_;k++){let c=pick(cand);if(early_){for(let t=0;t<12;t++){const cx_=c%z.w,cy_=(c/z.w)|0;if(used_.every(([ux,uy])=>Math.hypot(ux-cx_,uy-cy_)>=9))break;c=pick(cand);}used_.push([c%z.w,(c/z.w)|0]);}const cx=c%z.w,cy=(c/z.w)|0,type=pick(d.mons),champ=z.distE[c]>18&&Math.random()<(d.rift?.18:.12)*(zHas(z,'elites')?2.5:1)*(hasMod(z,'elite')?2.5:1)*(mut('meute')?2:1),n=champ?ri(3,4):early_&&d.lvl<=3?ri(2,3):early_?ri(2,4):ri(2,4)+(d.rift?1:0)+(!d.rift&&d.lvl<=10&&!(S&&S.world>1)?1:0);
    for(let j=0;j<n;j++){const f=nearFloor(z,cx+ri(-1,1),cy+ri(-1,1));if(f){const m_=spawnMon(z,type,f[0]+.5,f[1]+.5,champ&&j===0);if(early_)m_.xp=Math.round(m_.xp*(1+.6*(1-(d.lvl-1)/7)));}}}
  if(z.alcoves&&FORMES[z.forme]&&FORMES[z.forme].ambush){let g=1;for(const[ax,ay]of z.alcoves){const type=pick(d.mons),n=ri(3,4),gid=g++;
      for(let j=0;j<n;j++){const f=nearFloor(z,ax+ri(-1,1),ay+ri(-1,1));if(f){const m=spawnMon(z,type,f[0]+.5,f[1]+.5,j===0&&Math.random()<.35);m.amb=gid;}}}}
  if(z.def.aco&&z.acoSpot&&!z.arena){const[ax,ay]=nearFloor(z,z.acoSpot[0],z.acoSpot[1])||z.acoSpot;spawnMon(z,BOSSES[z.def.aco].mon,ax+.5,ay+.5,false,Math.max(1,z.def.lvl)+1);
    for(let j=0;j<3;j++){const f=nearFloor(z,ax+ri(-2,2),ay+ri(-2,2));if(f)spawnMon(z,pick(d.mons),f[0]+.5,f[1]+.5,false);}}
  if(z.def.boss){const b=BOSSES[z.def.boss],c=z.center||[z.w>>1,z.h>>1],f=nearFloor(z,c[0],c[1])||c;spawnMon(z,b.mon,f[0]+.5,f[1]+.5,false);}
}
function repopulate(z){if(z.arena)return;
  if(z.def.aco&&z.acoSpot&&!z.mons.some(m=>m.mini&&!m.dead)&&z.mons.filter(m=>!m.dead).length>=12){const[ax,ay]=nearFloor(z,z.acoSpot[0],z.acoSpot[1])||z.acoSpot;spawnMon(z,BOSSES[z.def.aco].mon,ax+.5,ay+.5,false,Math.max(1,z.def.lvl)+1);}
  const hadBoss=z.mons.some(m=>m.boss);z.mons=z.mons.filter(m=>!m.dead);if(z.mons.filter(m=>!m.boss).length<12){const nb=z.mons.some(m=>m.boss);populate(z);if(nb||hadBoss){let seen=false;z.mons=z.mons.filter(m=>{if(!m.boss)return true;if(seen)return false;seen=true;return true;});}}}
