'use strict';
/* ---------- Zones ---------- */
function zoneName(id){const d=zoneDef(id);return d?d.name:'?';}
function enterZone(id,how,from){
  const prev=S.cur;if(prev)prev.left=performance.now();
  let z=S.zones[id];
  if(!z)z=S.zones[id]=makeZone(id);
  else if(id!=='town'&&id!=='rift'&&z.left&&performance.now()-z.left>90000)repopulate(z);
  S.cur=z;let pos=z.spawn;
  if(how==='exit'){const o=z.objs.find(o=>o.type==='exit'&&o.to===from);if(o)pos=o.arr;}
  else if(how==='wp'){const o=z.objs.find(o=>o.type==='wp');if(o)pos=o.arr;}
  else if(how==='portal'){const src=id==='town'?z.portalSpot:S.portal;pos=arrival(z,Math.floor(src.x),Math.floor(src.y));}
  p.x=pos.x;p.y=pos.y;p.path=null;p.target=null;p.targetObj=null;p.tpCd=1.2;
  S.proj=[];S.novas=[];S.parts=[];S.pend=[];S.amb=[];S.bolts=[];S.mets=[];S.hz=[];if(z.shrink&&!z.mons.some(m=>m.bossId==='valgris'&&!m.dead&&m.ph3))z.shrink=null;
  if(S.vpend&&S.vpend.dead)S.vpend=null;if(S.cine&&!z.mons.includes(S.cine.m))S.cine=null;
  {const bv=z.mons.find(m=>m.beaten&&!m.dead);if(bv&&!S.cine&&S.vpend!==bv){bv.fallen=false;bv.divine=1;bv.size=4.7;S.vpend=bv;}}
  const s=iso(p.x,p.y);S.cam.x=s[0];S.cam.y=s[1];z.flowT=0;
  $('#zname').textContent=z.def.name;toast(z.def.name);
  if(id==='town'){p.hp=Math.max(p.hp,p.maxHp*.5);save();}
}
function portalsIn(z){const r=[];if(!S.portal)return r;
  if(z.id==='town')r.push({x:z.portalSpot.x,y:z.portalSpot.y,dest:S.portal.zone,label:'Vers : '+zoneName(S.portal.zone)});
  if(z.id===S.portal.zone)r.push({x:S.portal.x,y:S.portal.y,dest:'town',label:'Vers le camp'});return r;}
function openRift(n){
  if(S.portal&&S.portal.zone==='rift')S.portal=null;
  S.zones.rift=makeZone('rift',riftDef(n));S.zones.rift.t0=S.t;enterZone('rift','spawn');sfx('portal');
}

