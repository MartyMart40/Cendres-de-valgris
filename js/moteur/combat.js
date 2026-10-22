'use strict';
/* ---------- Combat ---------- */
function hurtMon(m,dmg,col,crit){
  if(m.dead||m.beaten)return;
  if(m.bossId==='heraut'&&m.flag&&!m.flag.dead){dmg=Math.max(1,Math.round(dmg*BOSSES.heraut.banner.shield));col='#9a9a90';}
  if(m.shellMax){if(m.shell>0){m.shell-=dmg;m.flash=.15;m.aggro=true;S.fx.push({x:m.x,y:m.y,t:fmt(dmg),col:'#c8ccd2',life:.8});sfx('hit');
      if(m.shell<=0){m.shell=0;const Sh=BOSSES.forgeron.shell;m.vuln=Sh.vuln;m.stun=Sh.stun;toast('Armure brisée !');burst(m.x,m.y,'#d0d4da',30);S.shake=Math.max(S.shake,.3);}return;}
    dmg=Math.round(dmg*BOSSES.forgeron.shell.mult);}
  m.hp-=dmg;if(m.hp<=0&&m.bossId&&BOSSES[m.bossId].undying){m.hp=1;valgrisBeaten(m);return;}m.flash=.15;if(m.amb){const g=m.amb;for(const o of S.cur.mons)if(o.amb===g){o.aggro=true;o.amb=0;}}if(Math.random()<.3||m.hp<=0)addDecal(S.cur,m.x+rnd(-.3,.3),m.y+rnd(-.3,.3),m.hp<=0?rnd(.35,.55)*m.size:rnd(.12,.25),m.kind);m.aggro=true;
  S.fx.push({x:m.x,y:m.y,t:fmt(dmg)+(crit?' !':''),col:col||'#f2e6cc',life:1,big:crit});sfx(crit?'crit':'hit');
  for(let i=0;i<3;i++)S.parts.push({x:m.x,y:m.y,z:.6,vx:rnd(-2,2),vy:rnd(-2,2),vz:rnd(1,3),life:.5,col:m.kind==='archer'?'#e8e0cc':'#7a1010'});
  if(m.hp<=0)killMon(m);
}
function addDecal(z,x,y,r,kind){const c=kind==='archer'?'rgba(200,190,170,A)':kind==='ghost'?'rgba(90,80,140,A)':kind==='boss'?'rgba(120,20,8,A)':'rgba(80,8,6,A)';z.decals.push({x,y,r,c,t:S.t});if(z.decals.length>140)z.decals.shift();}
function killMon(m){
  const z=S.cur;m.dead=true;m.dt=0;
  const pen=Math.max(.1,1-Math.max(0,p.lvl-m.lvl-5)*.1);gainXp(Math.round(m.xp*pen));dropLoot(m,z);
  for(const k in QUESTS){const Q=QUESTS[k],q=S.q[k];if(!Q.kill||q.s!==1||z.def.act!==Q.act||z.def.idx!==Q.kill.zone)continue;q.n++;if(q.n>=Q.kill.n){q.s=2;toast(Q.kill.done);}}
  if(z.id==='rift'&&!m.guard){z.kills++;if(z.kills>=z.def.goal&&!z.guardSpawned){z.guardSpawned=true;spawnGuardian(z);}}
  if(m.guard){burst(m.x,m.y,'#c060ff',60);z.done=true;const n=z.def.rift;if(S.riftMax<n+1){S.riftMax=n+1;p.pts++;S.pend.push({t:2.5,fn:()=>say('Première victoire : +1 point de talent.')});}S.riftSel=S.riftMax;
    const f=nearFloor(z,m.x,m.y);const o={type:'exit',x:f[0]+.5,y:f[1]+.5,to:'town',label:'Retour au camp'};o.arr={x:o.x+.01,y:o.y+.01};z.objs.push(o);p.tpCd=2;
    const tm=S.t-(z.t0!=null?z.t0:S.t),best=S.rec[n];const rec=!best||tm<best;if(rec)S.rec[n]=Math.round(tm);sfx('lvl');
    toast(`Faille ${n} vaincue en ${fmtT(tm)}${rec&&best?' : record !':''}`);say(`La faille ${n+1} est maintenant ouverte.`);save();}
  if(m.echo){burst(m.x,m.y,'#a8a49c',20);}
  else if(m.mini){const B=BOSSES[m.bossId];burst(m.x,m.y,B.col,50);S.shake=Math.max(S.shake,.3);S.aco=S.aco||{};const first=!S.aco[m.bossId];S.aco[m.bossId]=1;
    const a_=actOfMini(m.bossId);toast(`${bt(B,'death')} (${acoCount(a_)} / ${curWorld().acts[a_-1].acolytes.length})`);if(first)onAcolyte(m.bossId);save();}
  else if(m.bossId){const B=BOSSES[m.bossId];burst(m.x,m.y,B.col||'#ff7a2a',60);if(B.quest&&S.q[B.quest].s<2){S.q[B.quest].s=2;toast(bt(B,'death'));}
    for(const o of z.mons)if(!o.dead&&!o.boss){o.hp=0;o.dead=true;o.dt=0;}nextActExit(z);}
}
function onAcolyte(id){const a=actOfMini(id),act=curWorld().acts[a-1];if(!act)return;const q=S.q[act.quest];
  if(q&&acoCount(a)>=acoNeed(a)&&q.s<2){q.s=2;const M=act.breakMsg||['Le sceau se brise',''];S.pend.push({t:2.4,fn:()=>{toast(M[0]);if(M[1])say(M[1]);sfx('portal');}});}}
function hurtPlayer(d,L,src){
  if(p.dead)return;const s=p.st;if(p.inv>0){S.fx.push({x:p.x,y:p.y,t:'Immunisé',col:'#fff0a0',life:.6});return;}
  if(src&&s.thorns&&!src.dead){const th=Math.max(1,Math.round(d*s.thorns/100));hurtMon(src,th,'#9fe07f');}
  if(Math.random()*100<s.block){S.fx.push({x:p.x,y:p.y,t:'Bloqué',col:'#cfd8e0',life:.8});if(s.legs.aegis)p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.03);return;}
  const A=s.armorT*(p.buff>0?1+p.buffPct/100:1),red=Math.min(.85,A/(A+30*G(L||1)));
  const r=Math.max(1,Math.round(d*(1-red)));p.hp-=r;sfx('hurt');p.hurt=.3;S.shake=Math.max(S.shake,.18);if(Math.random()<.4)addDecal(S.cur,p.x+rnd(-.3,.3),p.y+rnd(-.3,.3),rnd(.1,.18),'');S.fx.push({x:p.x,y:p.y,t:fmt(r),col:'#ff5a4a',life:1});
  if(s.legs.crater&&Math.random()<.12&&skLvl('meteor')>0){const m=nearestMon(p.x,p.y,6);if(m)S.mets.push({x:m.x,y:m.y,t:.6,mult:3.2+.28*(skLvl('meteor')-1)});}
  if(p.hp<=0&&s.second&&!(p.secCd>0)){p.hp=p.maxHp*.35;p.secCd=s.second;p.inv=1;toast('Seconde vie');burst(p.x,p.y,'#fff0c0',30);sfx('lvl');}
  if(p.hp<=0){p.hp=0;p.dead=true;sfx('die');p.path=null;p.target=null;S.deaths=(S.deaths||0)+1;
    const lost=Math.floor(p.gold*.1);p.gold-=lost;
    S.pend.push({t:.9,fn:()=>openPanel(`<h2>Tu as succombé</h2><p>Les cendres t’engloutissent. ${lost?`Tu perds ${fmt(lost)} pièces d’or.`:''}</p><button data-a="revive">Revenir au camp</button>`)});}
}
function gainXp(v){p.xp+=v;while(p.xp>=xpNext(p.lvl)){p.xp-=xpNext(p.lvl);p.lvl++;p.pts+=1+(p.lvl%5===0?1:0);recalc();p.hp=p.maxHp;p.mp=p.maxMp;toast('Niveau '+p.lvl);sfx('lvl');say(p.lvl%5===0?'Deux points de talent : Menu, Talents.':'Nouveau point de talent : Menu, Talents.');burst(p.x,p.y,'#e8c46a',30);}}
function dropAt(z,x,y,o){for(let t=0;t<8;t++){const nx=x+rnd(-.9,.9),ny=y+rnd(-.9,.9);if(free(z,nx,ny,.1)){o.x=nx;o.y=ny;z.items.push(o);return;}}o.x=x;o.y=y;z.items.push(o);}
function dropLoot(m,z){if(m.noLoot)return;
  const L=m.lvl,n=m.guard?5:m.boss?4:m.champ?2:1,mf=p.st.mf+(z.id==='rift'?Math.min(100,z.def.rift*2):0);
  for(let i=0;i<n;i++){const r=Math.random();
    if(m.boss||m.champ&&i===0||r<(z.id==='rift'?.2:.17))dropAt(z,m.x,m.y,{kind:'item',it:genItem(L+(m.boss?1:0)+(Math.random()<.3?1:0),m.boss&&i<2?2:0,mf+(m.guard?400:m.boss?250:m.champ?60:0))});
    else if(r<.5)dropAt(z,m.x,m.y,{kind:'gold',v:Math.round(ri(3,8)*(1+.3*(L-1)))});
    else if(r<.6)dropAt(z,m.x,m.y,{kind:'pot'});
    else if(r<.63)dropAt(z,m.x,m.y,{kind:'scroll'});}
  if(m.boss)dropAt(z,m.x,m.y,{kind:'gold',v:Math.round(150*(1+.3*(L-1)))});
}
function openChest(o){
  if(o.open)return;o.open=true;const z=S.cur;burst(o.x,o.y,'#e8c46a',16);
  if(o.relic&&QUESTS[o.relic]){const q=S.q[o.relic],R_=QUESTS[o.relic].relic;if(q.s<2){q.s=2;toast(R_.toast);say(R_.say);}}
  const L=Math.max(1,z.def.lvl);dropAt(z,o.x,o.y,{kind:'gold',v:Math.round(ri(10,25)*(1+.3*(L-1)))});if(Math.random()<.7||o.relic)dropAt(z,o.x,o.y,{kind:'item',it:genItem(L,o.relic?1:0,p.st.mf+50)});if(Math.random()<.4)dropAt(z,o.x,o.y,{kind:'pot'});
}

