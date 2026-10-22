'use strict';
/* ---------- Actions ---------- */
function useScroll(){
  if(p.dead||S.cine)return;
  if(S.cur.id==='town'){say('Tu es déjà au camp.');return;}
  if(p.scroll<=0){say('Aucun parchemin de portail. Bram en vend au camp.');return;}
  p.scroll--;S.portal={zone:S.cur.id,x:p.x+.9,y:p.y-.4};
  const f=nearFloor(S.cur,S.portal.x,S.portal.y);if(f){S.portal.x=f[0]+.5;S.portal.y=f[1]+.5;}
  p.tpCd=.8;burst(S.portal.x,S.portal.y,'#6fa0ff',24);sfx('portal');
}
function drink(){
  if(p.dead)return;if(p.pot<=0){say('Plus de fioles.');return;}
  if(p.hp>=p.maxHp&&p.mp>=p.maxMp)return;
  const P=POTIONS.fiole,h=p.st.legs.potion?1:P.heal*(1+p.st.pot/100);
  p.pot--;p.hp=Math.min(p.maxHp,p.hp+p.maxHp*h);p.mp=Math.min(p.maxMp,p.mp+p.maxMp*P.mana);
  floatText(p.x,p.y,'+vie','#ff8a7a');
}
function nearestMon(x,y,r,ex){let best=null,bd=r;for(const m of S.cur.mons){if(m.dead||(ex&&ex.has(m)))continue;const d=Math.hypot(m.x-x,m.y-y);if(d<bd){bd=d;best=m;}}return best;}
function autoAim(){
  if(p.target&&!p.target.dead)return{x:p.target.x,y:p.target.y};
  const m=nearestMon(p.x,p.y,9);if(m)return{x:m.x,y:m.y};
  return{x:p.x+Math.cos(p.face)*3,y:p.y+Math.sin(p.face)*3};
}
function rollHit(mult,spell){const s=p.st;let d=rnd(s.dmg[0],s.dmg[1])*(1+s.dmgPct/100)*mult*(p.buff>0?1+p.buffPct/100:1)*(p.av>0?1+p.avPct/100:1);if(spell)d*=1+s.spell/100;
  const c=Math.random()*100<s.crit;if(c)d*=1+s.critDmg/100;return{d:Math.max(1,Math.round(d)),c};}
function hitMon(m,mult,spell,col){if(m.dead)return;if(p.st.exec&&m.hp<m.maxHp*.35)mult*=1+p.st.exec/100;const h=rollHit(mult,spell);hurtMon(m,h.d,h.c?'#ffe060':col,h.c);
  if(p.st.leech){const lv=h.d*p.st.leech/100*(p.st.legs.vamp&&!spell?2:1)*(spell?.5:1);p.hp=Math.min(p.maxHp,p.hp+Math.min(lv,p.maxHp*.08));}}
function castSkill(id,tx,ty,free){
  if(!id||p.dead||S.cur.id==='town'||S.cine)return false;const sk=SK[id],l=skLvl(id);if(!l)return false;
  if(!free){if(p.cds[id]>0){return false;}if(p.cd>0){p.queued={id,tx,ty,t:.5};return true;}
    let cost=sk.cost;if(id==='nova'&&p.st.legs.freeNova)cost=0;if(id==='whirl'&&p.st.legs.whirl)cost=0;
    if(p.mp<cost){say('Pas assez de mana.');return false;}p.mp-=cost;p.cd=.35;if(sk.cd)p.cds[id]=sk.cd;}
  if(tx==null){const a=autoAim();tx=a.x;ty=a.y;}if(!free)sfx('cast');
  const dx=tx-p.x,dy=ty-p.y,ln=Math.hypot(dx,dy)||1;p.face=Math.atan2(dy,dx);p.swing=.2;
  if(id==='fire'){const mult=1.5+.15*(l-1),n=p.st.legs.fire3?3:1;for(let k=0;k<n;k++){const a=Math.atan2(dy,dx)+(k-(n-1)/2)*.28;S.proj.push({x:p.x+Math.cos(a)*.4,y:p.y+Math.sin(a)*.4,vx:Math.cos(a)*9,vy:Math.sin(a)*9,from:'p',kind:'fire',mult,life:1.4});}}
  else if(id==='nova'){const mult=(1.3+.12*(l-1))*(p.st.legs.freeNova?1.4:1);S.novas.push({x:p.x,y:p.y,r:0,max:3.6,col:'170,220,255'});for(const m of S.cur.mons){if(m.dead)continue;if(dist(m,p)<3.6){hitMon(m,mult,true,'#9fd4ff');m.slow=2.5;}}}
  else if(id==='whirl'){const mult=1.5+.15*(l-1);p.spin=.4;S.novas.push({x:p.x,y:p.y,r:0,max:2.7,col:'240,230,210'});for(const m of S.cur.mons)if(!m.dead&&dist(m,p)<2.6+m.size*.3)hitMon(m,mult,false);}
  else if(id==='chain'){const mult=1.15+.11*(l-1),n=3+Math.min(12,Math.floor(l/3));let from={x:p.x,y:p.y},hit=new Set();let cur=(p.target&&!p.target.dead&&dist(p.target,p)<9)?p.target:nearestMon(tx,ty,4)||nearestMon(p.x,p.y,8);
    for(let k=0;k<n&&cur;k++){S.bolts.push({a:{x:from.x,y:from.y},b:{x:cur.x,y:cur.y},t:.25});hit.add(cur);hitMon(cur,k&&hit.size===1?mult*.5:mult,true,'#bfe0ff');from=cur;cur=nearestMon(cur.x,cur.y,5,hit)||(k<2&&!cur.dead?cur:null);}}
  else if(id==='cry'){p.buff=8*(p.st.legs.warlord?2:1);p.buffPct=25+5*(l-1);S.novas.push({x:p.x,y:p.y,r:0,max:3,col:'255,200,90'});toast('Cri de guerre');}
  else if(id==='meteor'){const r=Math.min(ln,9);S.mets.push({x:p.x+dx/ln*r,y:p.y+dy/ln*r,t:.8,mult:3.2+.28*(l-1)});}
  else if(id==='shock'){const mult=2.6+.26*(l-1),cx=p.x+dx/ln*1.8,cy=p.y+dy/ln*1.8;p.swing=.25;S.novas.push({x:cx,y:cy,r:0,max:2.8,col:'230,170,110'});S.shake=Math.max(S.shake,.2);burst(cx,cy,'#c8a070',18);
    for(const m of S.cur.mons)if(!m.dead&&Math.hypot(m.x-cx,m.y-cy)<2.8+m.size*.3){hitMon(m,mult,false);if(!m.boss)m.stun=.6;}}
  else if(id==='avatar'){p.av=10;p.avPct=150+15*(l-1);S.novas.push({x:p.x,y:p.y,r:0,max:4,col:'255,160,60'});burst(p.x,p.y,'#ffb050',40);S.shake=.3;toast('Avatar des Cendres');}
  else if(id==='embers'){const tgt=(p.target&&!p.target.dead)?p.target:{x:tx,y:ty};for(let k=0;k<7;k++){const a=rnd(0,6.28),r=k?rnd(.5,3):0;S.mets.push({x:tgt.x+Math.cos(a)*r,y:tgt.y+Math.sin(a)*r,t:.35+k*.12,mult:1.4+.14*(l-1),r:1.5,small:true});}}
  else if(id==='cataclysm'){const mult=7+.7*(l-1);S.novas.push({x:p.x,y:p.y,r:0,max:9,col:'255,120,40'});S.shake=.6;sfx('boom');for(let k=0;k<20;k++)burst(p.x+rnd(-7,7),p.y+rnd(-7,7),'#ff8030',4);
    for(const m of S.cur.mons)if(!m.dead&&dist(m,p)<9)hitMon(m,mult,true,'#ffb347');toast('Cataclysme');}
  else if(id==='aegis'){p.inv=Math.min(6,2+.1*(l-1));p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.4);S.novas.push({x:p.x,y:p.y,r:0,max:2.5,col:'255,240,170'});toast('Égide divine');}
  return true;
}

