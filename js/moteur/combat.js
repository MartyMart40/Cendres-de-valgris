'use strict';
/* ---------- Combat ---------- */
function hurtMon(m,dmg,col,crit){m.hitT=S.t;if(m.calm>0)m.calm=0;
  if(m.dead||m.beaten||m.under||m.fake>0||m.hid>0)return;
  if(m.lurk){m.lurk=false;m.revealed=true;}if(m.grab){m.grab=false;m.cd=2.5;m.x=p.x+1;m.y=p.y;const f=nearFloor(S.cur,m.x,m.y);if(f){m.x=f[0]+.5;m.y=f[1]+.5;}S.fx.push({x:p.x,y:p.y,t:'Décroché',col:'#c8e0a0',life:.8});}
  if(m.plates>0){m.plates--;dmg=Math.max(1,Math.round(dmg*.4));if(!p.eco)for(let i=0;i<5;i++)S.parts.push({x:m.x,y:m.y,z:.8,vx:rnd(-2.5,2.5),vy:rnd(-2.5,2.5),vz:rnd(1,3),life:.4,col:'#ffe090'});if(m.plates===0){S.fx.push({x:m.x,y:m.y,t:'Plaques brisées',col:'#e8c46a',life:1});sfx('crit');}}
  if(m.bossId==='heraut'&&m.flag&&!m.flag.dead){dmg=Math.max(1,Math.round(dmg*BOSSES.heraut.banner.shield));col='#9a9a90';}
  if(m.shellMax){if(m.shell>0){m.shell-=dmg;m.flash=.15;m.aggro=true;S.fx.push({x:m.x,y:m.y,t:fmt(dmg),col:'#c8ccd2',life:.8});sfx('hit');
      if(m.shell<=0){m.shell=0;const Sh=BOSSES.forgeron.shell;m.vuln=Sh.vuln;m.stun=Sh.stun;toast('Armure brisée !');burst(m.x,m.y,'#d0d4da',30);S.shake=Math.max(S.shake,.3);}return;}
    dmg=Math.round(dmg*BOSSES.forgeron.shell.mult);}
  if(m.brk>0)dmg=Math.round(dmg*1.2);
  if(m.curse>0)dmg=Math.round(dmg*(1+(m.curseP||25)/100));
  if(m.cx&&m.cx.includes('garde'))dmg=Math.max(1,Math.round(dmg*.6));
  if(m.ai==='shield'&&!(m.open>0)&&!(m.stun>0))dmg=Math.max(1,Math.round(dmg*.35));
  if(m.dummy){S.dps=S.dps||[];S.dps.push([S.t,dmg]);if(S.dps.length>600)S.dps.splice(0,100);m.flash=.15;S.fx.push({x:m.x,y:m.y,t:fmt(dmg)+(crit?' !':''),col:col||'#f2e6cc',life:1,big:crit});sfx(crit?'crit':'hit');return;}
  if(!m.boss&&!m.nest&&m.kind!=='banner'&&S.cur&&p){const dx=m.x-p.x,dy=m.y-p.y,l=Math.hypot(dx,dy)||1;step(m,dx/l,dy/l,crit?.22:.1,S.cur);}
  m.hp-=dmg;if(m.hp<=0&&m.bossId==='varsha'&&m.formN&&(m.form||1)<m.formN){m.hp=1;varshaFall(m);return;}if(m.hp<=0&&m.bossId&&BOSSES[m.bossId].undying){m.hp=1;if(m.formN&&(m.form||1)<m.formN)valgrisFall(m);else valgrisBeaten(m);return;}m.flash=.15;if(m.amb){const g=m.amb;for(const o of S.cur.mons)if(o.amb===g){o.aggro=true;o.amb=0;}}if(Math.random()<.3||m.hp<=0)addDecal(S.cur,m.x+rnd(-.3,.3),m.y+rnd(-.3,.3),m.hp<=0?rnd(.35,.55)*m.size:rnd(.12,.25),m.kind);m.aggro=true;
  S.fx.push({x:m.x,y:m.y,t:fmt(dmg)+(crit?' !':''),col:col||'#f2e6cc',life:1,big:crit});sfx(crit?'crit':'hit');if(!p.eco&&p.gfx!==1&&S.hits&&S.hits.length<14)S.hits.push({x:m.x+rnd(-.15,.15),y:m.y+rnd(-.15,.15),t:crit?.2:.13,m:crit?.2:.13,c:crit?'255,230,140':'255,250,240',a:Math.random()*3});
  for(let i=0;i<3;i++)S.parts.push({x:m.x,y:m.y,z:.6,vx:rnd(-2,2),vy:rnd(-2,2),vz:rnd(1,3),life:.5,col:m.kind==='archer'?'#e8e0cc':'#7a1010'});
  if(m.hp<=0)killMon(m);
}
/* v6.35 : éclair de lumière bref (explosions, novas, météores) qui éclaire le décor autour */
function flash(x,y,r,col,t){if(!S.flashes)S.flashes=[];if(S.flashes.length>24)S.flashes.shift();S.flashes.push({x,y,r,c:col,t:t||.35,m:t||.35});}
function addDecal(z,x,y,r,kind){const c=kind==='scorch'?'rgba(26,16,10,A)':kind==='archer'?'rgba(200,190,170,A)':kind==='ghost'?'rgba(90,80,140,A)':kind==='boss'?'rgba(120,20,8,A)':'rgba(80,8,6,A)';z.decals.push({x,y,r,c,t:S.t});if(z.decals.length>140)z.decals.shift();}
/* v6.05 : quand beaucoup de monstres meurent dans la même image, leur butin, leur expérience et leurs effets sont traités sur les images suivantes (6 par image). */
const KILL_BUDGET=6;
function killMon(m){if(m.dead)return;const z=S.cur;S.killN=(S.killN||0)+1;if(p&&p.st&&p.st.carnage&&!p.dead&&!m.pup)p.hp=Math.min(p.maxHp,p.hp+p.maxHp*p.st.carnage/100);
  if(S.killN>KILL_BUDGET&&!m.boss&&!m.mini&&!m.guard&&!m.bossId&&!(mut('echos')&&m.champ)&&m.t!=='ver'){m.dead=true;m.dt=0;m.hp=Math.min(m.hp,0);m.killZ=z;(S.killQ=S.killQ||[]).push(m);return;}
  killMonNow(m);}
function killFlush(n){const q=S.killQ;if(!q||!q.length)return;const k=Math.min(q.length,n==null?KILL_BUDGET:n);for(let i=0;i<k;i++){const m=q.shift();if(m.killZ!==S.cur)continue;m.dead=false;killMonNow(m);}}
function killMonNow(m){
  if(m.t==='noye'&&S.cur)S.hz.push({x:m.x,y:m.y,r:1.5,t:6,arm:0,kind:'ash',dps:Math.max(1,Math.round(m.dmg[0]*.6)),L:m.lvl});
  if(!m.boss)sfx('mdie');
  if(!m.pup){ctTrack('kill');if(m.champ)ctTrack('champ');if(m.boss&&!m.guard&&!m.beaten)ctTrack('boss');}
  if(m.boss&&!m.guard&&S.cur&&S.cur.id!=='trial')pageDrop(S.cur,m.x,m.y,.3);
  if(mut('echos')&&m.champ&&!m.boss&&!m.echoed&&!m.noLoot){m.echoed=true;m.dead=false;m.hp=Math.round(m.maxHp*.35);m.name='Écho : '+m.name.replace(/^Champion /,'');m.col='#8a84a8';burst(m.x,m.y,'#a8a0d8',24);S.fx.push({x:m.x,y:m.y,t:'Il se relève',col:'#c8c0ff',life:1.2});dropLoot(m,S.cur);return;}
  const z=S.cur;m.dead=true;m.dt=m.dt||0;if(z)z.kc=(z.kc||0)+1;if(m.pc)purKill(z);if(m.herald)heraldDie(m);else if(!m.pup&&z&&z.id!=='town'&&Math.random()<(m.champ?.1:.005)){seaGain(1);S.fx.push({x:m.x,y:m.y,t:'+1 '+seasonNow(S.seaT).c1,col:seasonNow(S.seaT).col,life:1});}if(m.champ||m.mini||m.boss)S.hitstop=m.boss&&!m.guard?.18:.07;
  /* v6.15 : une gelée se divise en deux petites */
  if(MT[m.t]&&MT[m.t].split&&z&&MT[MT[m.t].split])for(let k=0;k<2;k++){const c=spawnMon(z,MT[m.t].split,m.x+rnd(-.4,.4),m.y+rnd(-.4,.4),false,m.lvl);c.aggro=true;c.noLoot=m.noLoot;}
  if(m.sideChef)S.pend.push({t:.6,fn:()=>sideDone(z)});
  if(m.loot){if(m.loot.gold)dropAt(z,m.x,m.y,{kind:'gold',v:m.loot.gold*2});for(let k=0;k<(m.loot.pot||0)*2;k++)dropAt(z,m.x,m.y,{kind:'pot'});toast('Le chapardeur rend ton butin, et plus');m.loot=null;}
  if(MT[m.t]){S.best=S.best||{};S.best[m.t]=(S.best[m.t]||0)+1;}
  const pen=xpFactor(p.lvl,m.lvl);gainXp(Math.round(m.xp*pen*modBonus(z)*(mut('sang')?1.25:1)));dropLoot(m,z);
  if(p.comp&&S.ally&&!S.ally.down&&Math.hypot(m.x-S.ally.x,m.y-S.ally.y)<10){const r0=allyRank(p.comp),x0=xpRank(p.comp);p.comp.xp=(p.comp.xp||0)+(m.boss?10:m.champ?3:1);if(xpRank(p.comp)>x0&&allyRank(p.comp)===r0)toast(ALLIES[p.comp.type].n+' est prêt à évoluer (voir le recruteur)');if(allyRank(p.comp)>r0){toast(`${ALLIES[p.comp.type].n} : ${ARANKS[allyRank(p.comp)][0]}`);sfx('lvl');spawnAlly();}}
  if(p.st.legs.u_tear){p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.02);p.mp=Math.min(p.maxMp,p.mp+p.maxMp*.02);}
  if(m.bossId&&!m.echo&&!m.noLoot&&UNIQUES[m.bossId])rollUnique(m.bossId,m.x,m.y,m.lvl+1);
  for(const k in QUESTS){const Q=QUESTS[k],q=S.q[k];if(!Q.kill||q.s!==1||z.def.act!==Q.act||z.def.idx!==Q.kill.zone)continue;q.n++;if(q.n>=Q.kill.n){q.s=2;toast(Q.kill.done);}}
  if(z.def.trial&&z.def.trial.state==='on'){z.def.trial.kills++;if(hasMod(z,'explode'))S.hz.push({x:m.x,y:m.y,r:1.4,t:.15,arm:.7,kind:'ember',hit:Math.max(1,m.dmg[1]),L:m.lvl});}
  if(z.id==='rift'&&!m.guard){z.kills++;if(hasMod(z,'explode'))S.hz.push({x:m.x,y:m.y,r:1.4,t:.15,arm:.7,kind:'ember',hit:Math.max(1,m.dmg[1]),L:m.lvl});if(z.kills>=z.def.goal&&!z.guardSpawned){z.guardSpawned=true;spawnGuardian(z);}}
  if(m.guard){burst(m.x,m.y,'#c060ff',60);z.done=true;ctTrack('rift');const n=z.def.rift;if(S.riftMax<n+1){S.riftMax=n+1;p.pts++;S.pend.push({t:2.5,fn:()=>say('Première victoire : +1 point de talent.')});}S.riftSel=S.riftMax;
    const f=nearFloor(z,m.x,m.y);const o={type:'exit',x:f[0]+.5,y:f[1]+.5,to:'town',label:'Retour au camp'};o.arr={x:o.x+.01,y:o.y+.01};z.objs.push(o);p.tpCd=2;
    const tm=S.t-(z.t0!=null?z.t0:S.t),best=S.rec[n];const rec=!best||tm<best;if(rec)S.rec[n]=Math.round(tm);sfx('lvl');
    toast(`Faille ${n} vaincue en ${fmtT(tm)}${rec&&best?' : record !':''}`);say(`La faille ${n+1} est maintenant ouverte.`);save();}
  if(mut('braises')&&!m.boss&&Math.random()<.15)S.hz.push({x:m.x,y:m.y,r:1.1,t:3,arm:.5,kind:'fire',dps:Math.max(1,Math.round(m.dmg[0]*.4)),L:m.lvl});
  if(m.cx&&m.cx.includes('braise'))for(let k=0;k<3;k++)S.hz.push({x:m.x+rnd(-1,1),y:m.y+rnd(-1,1),r:1.1,t:4,arm:.4,kind:'fire',dps:Math.max(1,Math.round(m.dmg[0]*.5)),L:m.lvl});
  if(m.echo){burst(m.x,m.y,'#a8a49c',20);}
  else if(m.mini){const B=BOSSES[m.bossId];burst(m.x,m.y,B.col,50);S.shake=Math.max(S.shake,.3);S.aco=S.aco||{};const first=!S.aco[m.bossId];S.aco[m.bossId]=1;
    const a_=actOfMini(m.bossId);toast(`${bt(B,'death')} (${acoCount(a_)} / ${curWorld().acts[a_-1].acolytes.length})`);if(first)onAcolyte(m.bossId);save();}
  else if(m.bossId){const B=BOSSES[m.bossId];burst(m.x,m.y,B.col||'#ff7a2a',60);if(B.quest&&S.q[B.quest].s<2){S.q[B.quest].s=2;toast(bt(B,'death'));}
    for(const o of z.mons)if(!o.dead&&!o.boss){o.hp=0;o.dead=true;o.dt=0;}nextActExit(z);}
}
function onAcolyte(id){const a=actOfMini(id),act=curWorld().acts[a-1];if(!act)return;const q=S.q[act.quest];
  if(q&&acoCount(a)>=acoNeed(a)&&q.s<2){q.s=2;const M=act.breakMsg||['Le sceau se brise',''];S.pend.push({t:2.4,fn:()=>{toast(M[0]);if(M[1])say(M[1]);sfx('portal');}});}}
/* v6.02 : l’armure compte moins contre les petits monstres (constante plus haute sous le niveau 14). */
function armorK(L){return 30*G(L)*(1+.75*clamp((14-L)/13,0,1));}
function hurtPlayer(d,L,src,el,noDot){
  if(p.dead)return;if(el===undefined)el=monEl(src);if(el&&!EL[el])el=null;const s=p.st;if(p.inv>0){S.fx.push({x:p.x,y:p.y,t:'Immunisé',col:'#fff0a0',life:.6});return;}if(p.guard>0)d=d*(1-(p.guardP||20)/100);{const gp=gapOf(src);if(gp)d*=1+CAMP.gapIn*gp;}
  if(src&&src.cx&&!src.dead){if(src.cx.includes('vampire'))src.hp=Math.min(src.maxHp,src.hp+d*.5);if(src.cx.includes('glace'))p.chill=1.5;}
  if(p.comp&&p.comp.type==='garde'&&S.ally&&!S.ally.down&&allyRank(p.comp)>=4&&Math.hypot(S.ally.x-p.x,S.ally.y-p.y)<4)d*=.9;
  if(S.cur&&S.cur.blessing==='garde')d*=.75;
  if(src&&s.thorns&&!src.dead){const th=Math.max(1,Math.round(d*s.thorns/100));hurtMon(src,th,'#9fe07f');}
  if(s.dodge&&Math.random()*100<s.dodge){S.fx.push({x:p.x,y:p.y,t:'Esquivé',col:'#c8b8ff',life:.8});return;}
  if(Math.random()*100<s.block){S.fx.push({x:p.x,y:p.y,t:'Bloqué',col:'#cfd8e0',life:.8});if(s.riposte&&src&&!src.dead&&src.hp>0&&S.cur&&S.cur.mons.includes(src)){const rp=s.riposte;S.pend.push({t:.05,fn:()=>{if(!src.dead)hitMon(src,rp/100,false,'#e8e0d0');}});}if(s.legs.aegis)p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.03);
    if(s.legs.set_heraut4&&src&&!src.dead)hurtMon(src,Math.max(1,Math.round(d*.5)),'#cfd8e0');
    if(s.legs.u_banner)for(const m of S.cur.mons)if(!m.dead&&!m.boss&&dist(m,p)<2.2)m.stun=Math.max(m.stun||0,.5);return;}
  const A=s.armorT*(p.buff>0?1+p.buffPct/100:1)*(mut('fragile')?.8:1),red=Math.min(.85,A/(A+armorK(L||1)));
  let r=Math.max(1,Math.round(d*(1-red)*(s.legs.u_veil?.85:1)*(s.legs.set_veilleur4?.9:1)*(p.corrode>0?1.15:1)*(el?(1-resOf(el)/100)*(el==='light'?rnd(.5,1.6):1):1)));if(p.cls==='mage'&&p.mp>=1){/* v6.36 : barrière de mana du mage */const a=Math.min(Math.round(r*.25),Math.floor(p.mp*2));p.mp-=Math.ceil(a/2);r-=a;/* v6.37 : un point de mana absorbe deux points de dégâts, pour que le mage garde de quoi lancer ses sorts */if(a>0&&Math.random()<.3)S.fx.push({x:p.x+.3,y:p.y,t:fmt(a),col:'#7fb0ff',life:.7});}if(el){const rv=resOf(el);if(el==='cold')p.chill=Math.max(p.chill||0,1.2*(1-Math.max(0,rv)/100));
    if(!noDot&&(el==='fire'||el==='pois')&&r>=3){const dd=Math.floor(r*(el==='fire'?.3:.6)),du=el==='fire'?2:4;r-=dd;p.dots=p.dots||[];if(!p.dots.some(o=>o.el===el))S.fx.push({x:p.x,y:p.y-.5,t:el==='fire'?'Brûlé':'Empoisonné',col:EL[el].c,life:.9});p.dots.push({el,left:dd,rate:dd/du});}}
  p.hp-=r;sfx('hurt');p.hurt=.3;S.shake=Math.max(S.shake,.18);if(Math.random()<.4)addDecal(S.cur,p.x+rnd(-.3,.3),p.y+rnd(-.3,.3),rnd(.1,.18),'');S.fx.push({x:p.x,y:p.y,t:fmt(r),col:el?EL[el].c:'#ff5a4a',life:1});
  if(s.legs.crater&&Math.random()<.12&&skLvl('meteor')>0){const m=nearestMon(p.x,p.y,6);if(m)S.mets.push({x:m.x,y:m.y,t:.6,mult:3.2+.28*(skLvl('meteor')-1)});}
  if(p.hp<=0&&s.second&&!(p.secCd>0)){p.hp=p.maxHp*.35;p.dots=[];p.secCd=s.second;p.inv=1;toast('Seconde vie');burst(p.x,p.y,'#fff0c0',30);sfx('lvl');}
  if(p.hp<=0){p.hp=0;p.dead=true;p.dots=[];sfx('die');p.path=null;p.target=null;S.deaths=(S.deaths||0)+1;
    const lost=Math.floor(p.gold*.1);p.gold-=lost;
    S.pend.push({t:.9,fn:()=>openPanel(`<h2>Tu as succombé</h2><p>Les cendres t’engloutissent. ${lost?`Tu perds ${fmt(lost)} pièces d’or.`:''}</p><button data-a="revive">Revenir au camp</button>${S.portal&&S.portal.zone!=='town'?'<button data-a="revivep">Revenir par le portail</button>':''}`)});}
}
function gainXp(v){p.xp+=v;while(p.xp>=xpNext(p.lvl)){p.xp-=xpNext(p.lvl);p.lvl++;p.pts+=1+(p.lvl%5===0?1:0);recalc();p.hp=p.maxHp;p.mp=p.maxMp;toast('Niveau '+p.lvl);sfx('lvl');if(p.cls==='guerrier'&&p.lvl===3&&!p.sk.whirl)S.pend.push({t:2.4,fn:()=>say('Le Tourbillon est débloqué : Menu, Talents.',5200)});say(p.lvl%5===0?'Deux points de talent : Menu, Talents.':'Nouveau point de talent : Menu, Talents.');burst(p.x,p.y,'#e8c46a',30);}}
/* v6.06 : le butin ne tombe plus de l’autre côté d’un mur mince */
function dropAt(z,x,y,o){for(let t=0;t<8;t++){const nx=x+rnd(-.9,.9),ny=y+rnd(-.9,.9);if(free(z,nx,ny,.1)&&losClear(z,x,y,nx,ny)){o.x=nx;o.y=ny;z.items.push(o);return;}}o.x=x;o.y=y;z.items.push(o);}
function dropLoot(m,z){if(m.noLoot){if(m.t==='arpenteur'&&Math.random()<.02)dropAt(z,m.x,m.y,{kind:'gem',sk:'veil'});return;}if(m.boss)relicDrop(m,z);
  const L=m.lvl,n=m.guard?5:m.boss?4:m.champ?2:1,mf=p.st.mf+(z.id==='rift'?Math.min(100,z.def.rift*2):0)+(brOn(z)?BR_MF*S.br:0);
  for(let i=0;i<n;i++){const r=Math.random();
    if(m.boss||m.champ&&i===0||r<(z.id==='rift'?LOOT.dropRift:LOOT.drop)*(z.lootBonus||1)*modBonus(z)*(mut('ombres')?1.2:1)*(mut('meute')&&m.champ?1.5:1))dropAt(z,m.x,m.y,{kind:'item',it:genItem(L+(m.boss?1:0)+(Math.random()<.3?1:0),m.boss&&i<2?2:0,mf+(m.guard?400:m.boss?250:m.champ?60:0))});
    else if(r<.5)dropAt(z,m.x,m.y,{kind:'gold',v:Math.round(ri(4,10)*(1+.3*(L-1))*(mut('avarice')?2:1))});
    else if(r<.6)dropAt(z,m.x,m.y,{kind:'pot'});
    else if(r<.63)dropAt(z,m.x,m.y,{kind:'scroll'});}
  if(Math.random()<(m.boss&&!m.guard?.08:m.champ?.01:0))dropAt(z,m.x,m.y,{kind:'bagx'});
  if(L>=8&&Math.random()<(m.boss?.06:m.champ?.03:.004))dropAt(z,m.x,m.y,{kind:'item',it:genSetPiece(L+1)});
  if(!z.def.trial&&Math.random()<(m.guard?.12:m.boss?.08:m.champ?.015:.0015))dropAt(z,m.x,m.y,{kind:'sup',k:pick(Object.keys(SUPPORTS))});
  if(!z.def.trial&&Math.random()<(m.guard?.2:m.boss?.15:m.champ?.03:.003))dropAt(z,m.x,m.y,{kind:'gem',sk:pick(Object.keys(SK).filter(k=>SK[k].gem&&!SK[k].rare))});
  if(m.t==='arpenteur'&&Math.random()<.02)dropAt(z,m.x,m.y,{kind:'gem',sk:'veil'});
  /* v6.11 : orbes de forge */
  {const ch=(m.guard?2.2:m.boss?1.4:m.champ?.12:.022)*(z.id==='rift'?1+Math.min(1.5,z.def.rift*.03):1);let n=Math.floor(ch)+(Math.random()<ch%1?1:0);while(n-->0)dropAt(z,m.x,m.y,{kind:'orb',k:orbPick()});}
  /* v6.04 : aucune carte d’épreuve avant la mort de Varsha (elles ne servent à rien avant), et deux fois plus rares ensuite */
  if(!z.def.trial&&riftOpen()&&Math.random()<(m.guard?.12:m.boss?.07:m.champ?.008:.0008))dropAt(z,m.x,m.y,{kind:'card',card:genCard(L)});
  if(m.boss)dropAt(z,m.x,m.y,{kind:'gold',v:Math.round(150*(1+.3*(L-1)))});
}
function openChest(o){
  if(o.open)return;o.open=true;ctTrack('chest');const z=S.cur;burst(o.x,o.y,'#e8c46a',16);
  if(o.relic&&QUESTS[o.relic]){const q=S.q[o.relic],R_=QUESTS[o.relic].relic;if(q.s<2){q.s=2;toast(R_.toast);say(R_.say);}}
  const L=Math.max(1,z.def.lvl);dropAt(z,o.x,o.y,{kind:'gold',v:Math.round(ri(14,32)*(1+.3*(L-1)))});if(Math.random()<LOOT.chest||o.relic||mut('braises'))dropAt(z,o.x,o.y,{kind:'item',it:genItem(L,o.relic?1:mut('braises')?1:0,p.st.mf+25)});if(Math.random()<.4)dropAt(z,o.x,o.y,{kind:'pot'});if(Math.random()<.02)dropAt(z,o.x,o.y,{kind:'bagx'});if(Math.random()<(o.secret?.6:.14))dropAt(z,o.x,o.y,{kind:'orb',k:orbPick()});
  pageDrop(z,o.x,o.y,o.relic?.5:.08);
  if(o.sideRelic)S.pend.push({t:.5,fn:()=>sideDone(z)});
}

