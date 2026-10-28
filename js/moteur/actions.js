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
  if(p.dead)return;if(S.cur&&S.cur.def.trial&&S.cur.def.trial.card.mode==='duel'&&S.cur.def.trial.state==='on'){say('Pas de fiole pendant un duel.');return;}if(p.pot<=0){say('Plus de fioles.');return;}
  if(p.hp>=p.maxHp&&p.mp>=p.maxMp)return;
  const P=POTIONS.fiole,h=p.st.legs.potion?1:P.heal*(1+p.st.pot/100);
  p.pot--;p.hp=Math.min(p.maxHp,p.hp+p.maxHp*h);p.mp=Math.min(p.maxMp,p.mp+p.maxMp*P.mana);
  floatText(p.x,p.y,'+vie','#ff8a7a');
}
function nearestMon(x,y,r,ex){let best=null,bd=r;for(const m of S.cur.mons){if(m.dead||m.hid>0||(ex&&ex.has(m)))continue;const d=Math.hypot(m.x-x,m.y-y);if(d<bd){bd=d;best=m;}}return best;}
function autoAim(){
  if(p.target&&!p.target.dead)return{x:p.target.x,y:p.target.y};
  const m=nearestMon(p.x,p.y,9);if(m)return{x:m.x,y:m.y};
  return{x:p.x+Math.cos(p.face)*3,y:p.y+Math.sin(p.face)*3};
}
function rollHit(mult,spell){const s=p.st,cb=(p.stealth>0?50:0)+(p.night>0?100:0);let d=rnd(s.dmg[0],s.dmg[1])*(1+s.dmgPct/100)*mult*(p.buff>0?1+p.buffPct/100:1)*(p.av>0?1+p.avPct/100:1);if(spell)d*=1+s.spell/100;else d*=1+(s.atk||0)/100;
  const c=Math.random()*100<s.crit+cb;if(c)d*=1+s.critDmg/100;return{d:Math.max(1,Math.round(d)),c};}
function hitMon(m,mult,spell,col){if(m.dead)return;mult*=SYNM;{const gp=gapOf(m);if(gp)mult*=1-CAMP.gapOut*gp;}if(m.mirror>0&&spell){const h0=rollHit(mult,true);hurtPlayer(Math.min(Math.round(h0.d*.25),Math.round(m.dmg[1]*2)),m.lvl,null);S.fx.push({x:m.x,y:m.y,t:'Renvoyé',col:'#e8f0ff',life:.8});return;}{const n=(S.best||{})[m.t]||0;if(n>=1000)mult*=1.1;else if(n>=100)mult*=1.05;}if(!spell&&p.st.legs.u_web)m.slow=Math.max(m.slow||0,2);if(!spell&&p.st.legs.u_brk)m.brk=4;if(p.st.exec&&m.hp<m.maxHp*.35)mult*=1+p.st.exec/100;if(p.st.vital&&((m.poison&&m.poison.t>0)||m.curse>0||(m.toxU||0)>S.t))mult*=1+p.st.vital/100;if(p.st.legs.bourreau&&m.hp<m.maxHp*.3)mult*=2;if(S.cur&&S.cur.blessing==='force')mult*=1.3;if(p.st.legs.avare)mult*=.9;if(p.st.legs.souffle&&p.hp<p.maxHp*.3)mult*=1.5;const h=rollHit(mult,spell);hurtMon(m,h.d,h.c?'#ffe060':col,h.c);if((p.st.venom||p.night>0||p.st.legs.set_ombre4)&&!m.dead){const v=(p.st.venom||30)/100*h.d/3;m.poison={dps:Math.max(m.poison&&m.poison.t>0?m.poison.dps:0,v),t:3,tk:.5};}if(SUPC==='givre')m.slow=Math.max(m.slow||0,2);if(SUPC==='ignite'&&!m.dead){const v=h.d*.25/3;m.poison={dps:Math.max(m.poison&&m.poison.t>0?m.poison.dps:0,v),t:3,tk:.5};}if(SUPC==='vamp')p.hp=Math.min(p.maxHp,p.hp+Math.min(h.d*.02,p.maxHp*.05));
  if(p.st.leech){const lv=h.d*p.st.leech/100*(p.st.legs.vamp&&!spell?2:1)*(spell?.5:1);p.hp=Math.min(p.maxHp,p.hp+Math.min(lv,p.maxHp*.08));}}
/* v5.34 : pierres de soutien. Une par compétence ; elles modifient la façon dont elle agit. */
const SUPPORTS={
  multi:{n:'Projectiles multiples',ic:'✳️',d:'Deux projectiles de plus, chacun 25 % moins fort.',for:['fire','lance']},
  vaste:{n:'Zone élargie',ic:'⭕',d:'La zone d’effet est 40 % plus large.',for:['nova','whirl','shock','meteor','embers','cataclysm','bond','curse']},
  givre:{n:'Morsure du givre',ic:'🧊',d:'Les ennemis touchés sont ralentis 2 s.',dmg:true},
  vamp:{n:'Soif',ic:'🩸',d:'2 % des dégâts infligés te reviennent en vie.',dmg:true},
  echo:{n:'Écho',ic:'🔁',d:'20 % de chances que la compétence se relance gratuitement.',noUlt:true},
  ignite:{n:'Embrasement',ic:'🔥',d:'Les ennemis touchés brûlent : 25 % des dégâts en plus sur 3 s.',dmg:true},
  rapide:{n:'Célérité',ic:'⏱️',d:'Le temps de recharge est réduit de 30 %.',cdOnly:true}};
const DMGSK=['fire','nova','whirl','chain','meteor','shock','embers','cataclysm','lance','bond','totem','faux','chaines','ardente','salve','ruee','fendoir','coupb','inferno','lames','fgivre','repli'];
function supFits(k,id){const S_=SUPPORTS[k],sk=SK[id];if(!S_||!sk||sk.pas)return false;if(S_.for)return S_.for.includes(id);if(S_.dmg)return DMGSK.includes(id);if(S_.cdOnly)return!!sk.cd;if(S_.noUlt)return!sk.ult;return true;}
function supFree(k){const own=(p.supInv||{})[k]||0,used=Object.values(p.sup||{}).filter(x=>x===k).length;return own-used;}
let SUPC=null;
let FREEL=0;const AUTEL_XY=[18.5,21.5];
/* v6.20 : attire les ennemis proches (Hache-Tourbillon) */
function pullMons(R){const z=S.cur;for(const m of z.mons){if(m.dead||m.beaten||m.boss)continue;const dd=dist(m,p);if(dd>R||dd<1.2||!losClear(z,p.x,p.y,m.x,m.y))continue;const k=(dd-1)/dd,nx=m.x+(p.x-m.x)*k,ny=m.y+(p.y-m.y)*k;if(!isWall(z,Math.floor(nx),Math.floor(ny))){m.x=nx;m.y=ny;}}}
/* v6.55 : une case libre pour un déplacement de talent (sans traverser les murs ni sortir de la carte) */
function free_(z,x,y){return free(z,x,y,.22)&&(!z.flow||z.flow[Math.floor(y)*z.w+Math.floor(x)]>=0);}
function castSkill(id,tx,ty,free){
  if(!id||p.dead||S.cur.id==='town'||S.cine)return false;const sk=SK[id];let l=skLvl(id);if(!l&&free&&FREEL)l=FREEL;if(!l)return false;
  if(sk.bow&&!(p.eq.weapon&&p.eq.weapon.type==='bow')){if(!free)say('Il te faut un arc.');return false;}
  if(id==='veil')return veilStep(tx,ty,l);
  if(!free){if(p.cds[id]>0){return false;}if(p.cd>0){p.queued={id,tx,ty,t:.5};return true;}
    let cost=sk.cost;if(id==='nova'&&p.st.legs.freeNova)cost=0;if(id==='whirl'&&p.st.legs.whirl)cost=0;cost=powCost(id,cost);
    if(p.mp<cost){say('Pas assez de mana.');return false;}p.mp-=cost;p.cd=.35;if(sk.cd)p.cds[id]=powCd(id,sk.cd*((p.sup&&p.sup[id])==='rapide'?.7:1));}
  if(tx==null){const a=autoAim();tx=a.x;ty=a.y;}if(!free)sfx('cast');
  const dx=tx-p.x,dy=ty-p.y,ln=Math.hypot(dx,dy)||1;p.face=Math.atan2(dy,dx);p.swing=.2;
  SUPC=(p.sup&&p.sup[id])||null;const RZ=SUPC==='vaste'?1.4:1,MU=SUPC==='multi',np0=S.proj.length,nm0=S.mets.length,nv0=S.novas.length,nt0=(S.totems||[]).length;SYNM=synMult(id)*powMult(id)*SKILL_K*RELK;
  if(id==='fire'){const mult=(1.5+.15*(l-1))*(MU?.75:1),n=(p.st.legs.fire3?3:1)+(p.st.legs.set_penitent4?1:0)+(MU?2:0);for(let k=0;k<n;k++){const a=Math.atan2(dy,dx)+(k-(n-1)/2)*.28;S.proj.push({x:p.x+Math.cos(a)*.4,y:p.y+Math.sin(a)*.4,vx:Math.cos(a)*9,vy:Math.sin(a)*9,from:'p',kind:'fire',mult,life:1.4});}}
  /* v6.05 : la nova frappe quand l’anneau visible passe sur le monstre, jamais à travers un mur, un peu moins fort et moins loin */
  else if(id==='nova'){const mult=(1.15+.11*(l-1))*(p.st.legs.freeNova?1.4:1);S.novas.push({x:p.x,y:p.y,r:0,max:3.3*RZ*(p.st.legs.p_novabig?1.5:1),col:'170,220,255',hit:{mult,col:'#9fd4ff',slow:2.5,hiver:!!p.st.legs.hiver,sup:SUPC,done:new Set()}});if(p.st.legs.p_novachain&&!free)S.pend.push({t:.15,fn:()=>{FREEL=1;castSkill('chain',null,null,true);FREEL=0;}});}
  else if(id==='whirl'){const mult=1.5+.15*(l-1);p.spin=.4;if(p.st.legs.p_whirlpull)pullMons(5);else if(p.st.legs.rl_gouffre)pullMons(4);S.novas.push({x:p.x,y:p.y,r:0,max:2.7*RZ,col:'175,150,115'});for(const m of S.cur.mons)if(!m.dead&&dist(m,p)<2.6*RZ+m.size*.3&&losClear(S.cur,p.x,p.y,m.x,m.y))hitMon(m,mult,false);}
  else if(id==='chain'){const mult=1.15+.11*(l-1),n=Math.max(1,3+Math.min(12,Math.floor(l/3))+(p.st.legs.conduit?4:0)-(p.st.legs.p_chainx?2:0));let from={x:p.x,y:p.y},hit=new Set();let cur=(p.target&&!p.target.dead&&dist(p.target,p)<9)?p.target:nearestMon(tx,ty,4)||nearestMon(p.x,p.y,8);
    for(let k=0;k<n&&cur;k++){S.bolts.push({a:{x:from.x,y:from.y},b:{x:cur.x,y:cur.y},t:.25});hit.add(cur);hitMon(cur,k&&hit.size===1?mult*.5:mult,true,'#bfe0ff');from=cur;cur=nearestMon(cur.x,cur.y,5,hit)||(k<2&&!cur.dead?cur:null);}}
  else if(id==='cry'){p.buff=8*(p.st.legs.warlord?2:1);if(p.st.legs.p_cryheal)p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.25);p.buffPct=25+5*(l-1);S.novas.push({x:p.x,y:p.y,r:0,max:3,col:'255,200,90'});toast('Cri de guerre');}
  else if(id==='meteor'){const r=Math.min(ln,9);S.mets.push({x:p.x+dx/ln*r,y:p.y+dy/ln*r,t:.8,mult:3.2+.28*(l-1),r:2.4*RZ*(p.st.legs.p_meteor2?1.3:1)});if(p.st.legs.comete)for(const[ox,oy]of[[1.6,-1],[-1.4,1.2]])S.mets.push({x:p.x+dx/ln*r+ox,y:p.y+dy/ln*r+oy,t:1.05+Math.random()*.2,mult:(3.2+.28*(l-1))*.6,r:1.8*RZ});}
  else if(id==='shock'){const mult=2.6+.26*(l-1),cx=p.x+dx/ln*1.8,cy=p.y+dy/ln*1.8;p.swing=.25;S.novas.push({x:cx,y:cy,r:0,max:2.8*RZ*(p.st.legs.p_shock?1.6:1),col:'230,170,110'});S.shake=Math.max(S.shake,.2);burst(cx,cy,'#c8a070',18);
    for(const m of S.cur.mons)if(!m.dead&&Math.hypot(m.x-cx,m.y-cy)<2.8*RZ*(p.st.legs.p_shock?1.6:1)+m.size*.3&&losClear(S.cur,p.x,p.y,m.x,m.y)){hitMon(m,mult,false);if(!m.boss)m.stun=p.st.legs.p_shock?1.2:.6;}}
  else if(id==='avatar'){p.av=p.st.legs.p_avatar?20:10;p.avPct=150+15*(l-1);S.novas.push({x:p.x,y:p.y,r:0,max:4,col:'255,160,60'});burst(p.x,p.y,'#ffb050',40);S.shake=.3;toast('Avatar des Cendres');}
  else if(id==='embers'){const tgt=(p.target&&!p.target.dead)?p.target:{x:tx,y:ty};for(let k=0;k<(p.st.legs.p_embers?12:7);k++){const a=rnd(0,6.28),r=k?rnd(.5,3):0;S.mets.push({x:tgt.x+Math.cos(a)*r,y:tgt.y+Math.sin(a)*r,t:.35+k*.12,mult:1.4+.14*(l-1),r:1.5*RZ,small:true});}}
  else if(id==='cataclysm'){const mult=7+.7*(l-1);S.novas.push({x:p.x,y:p.y,r:0,max:9*RZ,col:'255,120,40'});S.shake=.6;sfx('boom');for(let k=0;k<20;k++)burst(p.x+rnd(-7,7),p.y+rnd(-7,7),'#ff8030',4);
    for(const m of S.cur.mons)if(!m.dead&&dist(m,p)<9*RZ)hitMon(m,mult,true,'#ffb347');toast('Cataclysme');}
  else if(id==='lance'){for(const da of MU||p.st.legs.osdague?[-.2,0,.2]:[0]){const a=Math.atan2(dy,dx)+da;S.proj.push({x:p.x+Math.cos(a)*.4,y:p.y+Math.sin(a)*.4,vx:Math.cos(a)*11,vy:Math.sin(a)*11,from:'p',kind:'lance',mult:(1.3+.13*(l-1))*(MU?.75:1),life:1.1,hit:[]});}}
  else if(id==='faux'){const a0=Math.atan2(dy,dx),R_=3.2*RZ;for(let k=0;k<9;k++){const a=a0-1+k*.25;S.parts.push({x:p.x+Math.cos(a)*R_*.8,y:p.y+Math.sin(a)*R_*.8,z:.5,vx:Math.cos(a+1.57)*2,vy:Math.sin(a+1.57)*2,vz:.5,life:.35,col:'#c8d0ff'});}
    for(const m of S.cur.mons){if(m.dead||m.beaten)continue;const ddx=m.x-p.x,ddy=m.y-p.y,dd=Math.hypot(ddx,ddy);let da=Math.abs(Math.atan2(ddy,ddx)-a0);if(da>Math.PI)da=2*Math.PI-da;if(dd<R_+m.size*.3&&(da<1.1||dd<.8)&&losClear(S.cur,p.x,p.y,m.x,m.y))hitMon(m,2+.2*(l-1),true,'#c8d0ff');}}
  else if(id==='chaines'){const z=S.cur;S.novas.push({x:p.x,y:p.y,r:0,max:6*RZ,col:'220,210,190'});for(const m of z.mons){if(m.dead||m.beaten)continue;const dd=dist(m,p);if(dd>6*RZ||!losClear(z,p.x,p.y,m.x,m.y))continue;
      if(!m.boss&&dd>1.3){const k=(dd-1.2)/dd,nx=m.x+(p.x-m.x)*k,ny=m.y+(p.y-m.y)*k;if(!isWall(z,Math.floor(nx),Math.floor(ny))){m.x=nx;m.y=ny;}else{const f=nearFloor(z,nx,ny);if(f&&z.flow&&z.flow[f[1]*z.w+f[0]]>=0){m.x=f[0]+.5;m.y=f[1]+.5;}}}
      if(!m.boss)m.stun=Math.max(m.stun||0,.8+.04*(l-1));hitMon(m,.8+.08*(l-1),true,'#e0d8c0');}}
  else if(id==='ardente'){const a=Math.atan2(dy,dx);S.proj.push({x:p.x+Math.cos(a)*.4,y:p.y+Math.sin(a)*.4,vx:Math.cos(a)*12,vy:Math.sin(a)*12,from:'p',kind:'fire',mult:2+.2*(l-1),life:1.2,arrowFire:true});}
  else if(id==='salve'){const t=(p.target&&!p.target.dead)?p.target:nearestMon(tx,ty,4)||nearestMon(p.x,p.y,8);const ax=t?t.x:tx,ay=t?t.y:ty;for(let k=0;k<(p.st.legs.p_salve5?5:3)+(p.st.legs.rl_rafale?2:0);k++)S.pend.push({t:k*.12,fn:()=>{const a=Math.atan2(ay-p.y,ax-p.x)+rnd(-.04,.04);S.proj.push({x:p.x+Math.cos(a)*.4,y:p.y+Math.sin(a)*.4,vx:Math.cos(a)*13,vy:Math.sin(a)*13,from:'p',kind:'parrow',mult:(1.1+.11*(l-1))*synMult('salve')*powMult('salve'),life:1.2,hit:[]});sfx('hit');}});}
  else if(id==='tempete'){p.storm=(6+Math.floor((l-1)/5))*(p.st.legs.p_tempete?2:1);p.stormM=.7+.07*(l-1);p.stormT=0;toast('Tempête de flèches');}
  else if(id==='bond'){const r=Math.min(ln,6),f=nearFloor(S.cur,p.x+dx/ln*r,p.y+dy/ln*r);if(f&&(!S.cur.flow||S.cur.flow[f[1]*S.cur.w+f[0]]>=0)){burst(p.x,p.y,'#c8a070',14);p.x=f[0]+.5;p.y=f[1]+.5;p.path=null;}
    S.novas.push({x:p.x,y:p.y,r:0,max:2.2*RZ,col:'230,170,110'});S.shake=Math.max(S.shake,.25);for(const m of S.cur.mons)if(!m.dead&&dist(m,p)<2.2*RZ+m.size*.3&&losClear(S.cur,p.x,p.y,m.x,m.y)){hitMon(m,1.8+.18*(l-1),false);if(!m.boss)m.stun=.5;}}
  else if(id==='totem'){S.totems=(S.totems||[]).filter(t=>t.t>0);S.totems.push({x:p.x+.6,y:p.y+.4,t:p.st.legs.p_totem?16:8,cd:.3,mult:.6+.06*(l-1),sup:SUPC});burst(p.x,p.y,'#a08060',16);}
  else if(id==='volley'){const mult=.8+.08*(l-1),nv=p.st.legs.p_volley?4:2;for(let k=-nv;k<=nv;k++){const a=Math.atan2(dy,dx)+k*(nv>2?.1:.16);S.proj.push({x:p.x+Math.cos(a)*.4,y:p.y+Math.sin(a)*.4,vx:Math.cos(a)*13,vy:Math.sin(a)*13,from:'p',kind:'parrow',mult,life:.8,hit:[]});}}
  else if(id==='pin'){const a=Math.atan2(dy,dx);S.proj.push({x:p.x+Math.cos(a)*.4,y:p.y+Math.sin(a)*.4,vx:Math.cos(a)*15,vy:Math.sin(a)*15,from:'p',kind:'parrow',mult:2.2+.22*(l-1),pin:1.5+.05*(l-1),life:.8,hit:[]});}
  else if(id==='arain'){const tgt=(p.target&&!p.target.dead)?p.target:{x:tx,y:ty};for(let k=0;k<10;k++){const a=rnd(0,6.28),r=k?rnd(.3,2.5):0;S.mets.push({x:tgt.x+Math.cos(a)*r,y:tgt.y+Math.sin(a)*r,t:.25+k*.13,mult:.9+.09*(l-1),r:1.1,small:true,arrow:true});}}
  else if(id==='dagger'){const mult=.9+.09*(l-1),nd=p.st.legs.p_dagger5?2:1;for(let k=-nd;k<=nd;k++){const a=Math.atan2(dy,dx)+k*(nd>1?.16:.22);S.proj.push({x:p.x+Math.cos(a)*.4,y:p.y+Math.sin(a)*.4,vx:Math.cos(a)*12,vy:Math.sin(a)*12,from:'p',kind:'dagger',mult,life:.7,hit:[]});}}
  else if(id==='smoke'){p.stealth=3+.1*(l-1)+(p.st.legs.p_smoke?2:0);if(p.st.legs.p_smoke)p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.3);for(const m of S.cur.mons)if(!m.boss)m.aggro=false;burst(p.x,p.y,'#8a8a9a',40);toast('Voile de fumée');}
  else if(id==='backstab'){const t=(p.target&&!p.target.dead)?p.target:nearestMon(tx,ty,4)||nearestMon(p.x,p.y,7);if(t){const a=Math.atan2(t.y-p.y,t.x-p.x),f=nearFloor(S.cur,t.x+Math.cos(a)*.9,t.y+Math.sin(a)*.9);if(f){burst(p.x,p.y,'#a890d8',12);p.x=f[0]+.5;p.y=f[1]+.5;p.path=null;}p.face=Math.atan2(t.y-p.y,t.x-p.x);p.swing=.25;hitMon(t,3+.3*(l-1),false,'#d8c8ff');}}
  else if(id==='nightfall'){p.night=8+Math.floor((l-1)/5);S.novas.push({x:p.x,y:p.y,r:0,max:4,col:'120,90,180'});toast('Nuit tombante');}
  else if(id==='curse'){const r=Math.min(ln,8),cx=p.x+dx/ln*r,cy=p.y+dy/ln*r;S.novas.push({x:cx,y:cy,r:0,max:3*RZ,col:'150,90,200'});for(const m of S.cur.mons)if(!m.dead&&Math.hypot(m.x-cx,m.y-cy)<3*RZ+m.size*.3){m.curse=6;m.curseP=25+2*(l-1);}}
  /* v6.55 : nouveaux talents actifs */
  else if(id==='ruee'){const z=S.cur,a=Math.atan2(dy,dx),ux=Math.cos(a),uy=Math.sin(a),x0=p.x,y0=p.y;let L=0;for(;L<6;L+=.2)if(!free_(z,p.x+ux*(L+.2),p.y+uy*(L+.2)))break;const mult=1.6+.16*(l-1);
    for(const m of z.mons){if(m.dead||m.beaten)continue;const qx=m.x-x0,qy=m.y-y0,al=qx*ux+qy*uy,pe=Math.abs(-qx*uy+qy*ux);if(al>-.3&&al<L+.6&&pe<.9+m.size*.3){hitMon(m,mult,false);if(!m.boss)m.stun=Math.max(m.stun||0,.3);}}
    for(let k=0;k<6;k++)burst(x0+ux*L*k/6,y0+uy*L*k/6,'#c8a070',4);p.x=x0+ux*L;p.y=y0+uy*L;p.path=null;p.goal=null;p.inv=Math.max(p.inv||0,.2);S.shake=Math.max(S.shake,.15);}
  else if(id==='fendoir'){const a0=Math.atan2(dy,dx),R_=2.4;p.swing=.3;for(let k=0;k<7;k++){const a=a0-1.1+k*.37;S.parts.push({x:p.x+Math.cos(a)*R_*.8,y:p.y+Math.sin(a)*R_*.8,z:.5,vx:Math.cos(a+1.57)*2,vy:Math.sin(a+1.57)*2,vz:.5,life:.3,col:'#e8d0a0'});}
    for(const m of S.cur.mons){if(m.dead||m.beaten)continue;const ddx=m.x-p.x,ddy=m.y-p.y,dd=Math.hypot(ddx,ddy);let da=Math.abs(Math.atan2(ddy,ddx)-a0);if(da>Math.PI)da=2*Math.PI-da;if(dd<R_+m.size*.3&&(da<1.2||dd<.8)&&losClear(S.cur,p.x,p.y,m.x,m.y))hitMon(m,2+.2*(l-1),false);}}
  else if(id==='seisme'){const mult=1.8+.18*(l-1),z=S.cur;[2,3.3,4.6].forEach((R_,k)=>S.pend.push({t:k*.35,fn:()=>{if(S.cur!==z||p.dead)return;S.novas.push({x:p.x,y:p.y,r:0,max:R_,col:'200,160,110'});S.shake=Math.max(S.shake,.18);
      for(const m of z.mons)if(!m.dead&&!m.beaten&&dist(m,p)<R_+m.size*.3&&losClear(z,p.x,p.y,m.x,m.y)){hitMon(m,mult,false);m.slow=Math.max(m.slow||0,1.5);}}}));}
  else if(id==='coupb'){const t=(p.target&&!p.target.dead&&dist(p.target,p)<2.5)?p.target:nearestMon(p.x,p.y,2.5);if(t){p.face=Math.atan2(t.y-p.y,t.x-p.x);p.swing=.25;hitMon(t,1.8+.18*(l-1),false,'#d8e0f0');if(!t.boss&&!t.dead)t.stun=Math.max(t.stun||0,Math.min(2,1+.03*(l-1)));burst(t.x,t.y,'#d8e0f0',10);}}
  else if(id==='provoc'){p.guard=6;p.guardP=Math.min(50,20+2*(l-1));S.novas.push({x:p.x,y:p.y,r:0,max:7,col:'230,90,70'});for(const m of S.cur.mons)if(!m.dead&&!m.beaten&&dist(m,p)<7){m.aggro=true;m.calm=0;}toast('Provocation');}
  else if(id==='marteau'){const t=(p.target&&!p.target.dead)?p.target:null,r=Math.min(ln,8),cx=t?t.x:p.x+dx/ln*r,cy=t?t.y:p.y+dy/ln*r,z=S.cur,mult=3.3+.3*(l-1);S.novas.push({x:cx,y:cy,r:0,max:.6,col:'255,240,190'});
    S.pend.push({t:.35,fn:()=>{if(S.cur!==z)return;burst(cx,cy,'#fff0c0',26);flash(cx,cy,4,'255,240,190',.4);S.novas.push({x:cx,y:cy,r:0,max:2,col:'255,240,190'});S.shake=Math.max(S.shake,.3);sfx('boom');
      for(const m of z.mons)if(!m.dead&&!m.beaten&&Math.hypot(m.x-cx,m.y-cy)<2+m.size*.3){hitMon(m,mult,false,'#fff0c0');if(!m.boss&&!m.dead)m.stun=Math.max(m.stun||0,1);}}});}
  else if(id==='flammes'){const z=S.cur,a=Math.atan2(dy,dx),ux=Math.cos(a),uy=Math.sin(a),x0=p.x+ux*.8,y0=p.y+uy*.8,mult=(.7+.07*(l-1))/2;
    for(let k=0;k<8;k++)S.pend.push({t:k*.5,fn:()=>{if(S.cur!==z)return;for(let j=0;j<6;j++){const u=j*5/5;if(!p.eco)S.parts.push({x:x0+ux*u+rnd(-.2,.2),y:y0+uy*u+rnd(-.2,.2),z:.2,vx:rnd(-.3,.3),vy:rnd(-.3,.3),vz:rnd(1.5,3),life:.55,col:j%2?'#ff9a3a':'#ffd060'});}
      for(const m of z.mons){if(m.dead||m.beaten)continue;const qx=m.x-x0,qy=m.y-y0,al=qx*ux+qy*uy,pe=Math.abs(-qx*uy+qy*ux);if(al>-.4&&al<5.4&&pe<.6+m.size*.3)hitMon(m,mult,true,'#ffb347');}}});}
  else if(id==='flare'){const t=(p.target&&!p.target.dead)?p.target:null,r=Math.min(ln,9);S.mets.push({x:t?t.x:p.x+dx/ln*r,y:t?t.y:p.y+dy/ln*r,t:.5,mult:2.6+.26*(l-1),r:1.6});}
  else if(id==='inferno'){const mult=.9+.09*(l-1);for(let k=0;k<8;k++){const a=k*Math.PI/4;S.proj.push({x:p.x+Math.cos(a)*.4,y:p.y+Math.sin(a)*.4,vx:Math.cos(a)*8,vy:Math.sin(a)*8,from:'p',kind:'fire',mult,life:1.1});}burst(p.x,p.y,'#ff8a3a',20);}
  else if(id==='sombre'){const a=Math.atan2(dy,dx);S.proj.push({x:p.x+Math.cos(a)*.4,y:p.y+Math.sin(a)*.4,vx:Math.cos(a)*11,vy:Math.sin(a)*11,from:'p',kind:'sbolt',mult:1.4+.14*(l-1),life:1,curse:15,col:'#b8a0e8'});}
  else if(id==='toxin'){const z=S.cur,t=(p.target&&!p.target.dead)?p.target:null,r=Math.min(ln,8),cx=t?t.x:p.x+dx/ln*r,cy=t?t.y:p.y+dy/ln*r,mult=(.6+.06*(l-1))/2;
    for(let k=0;k<10;k++)S.pend.push({t:k*.5,fn:()=>{if(S.cur!==z)return;if(!p.eco)for(let j=0;j<5;j++){const a=rnd(0,6.28),rr=rnd(0,2.2);S.parts.push({x:cx+Math.cos(a)*rr,y:cy+Math.sin(a)*rr,z:.2,vx:rnd(-.3,.3),vy:rnd(-.3,.3),vz:rnd(.3,1),life:.8,col:j%2?'#8ad05a':'#5a8a3a'});}
      for(const m of z.mons)if(!m.dead&&!m.beaten&&Math.hypot(m.x-cx,m.y-cy)<2.2+m.size*.3){m.toxU=S.t+1;hitMon(m,mult,true,'#a8e070');}}});}
  else if(id==='lames'){const mult=.9+.09*(l-1);for(let k=0;k<12;k++){const a=k*Math.PI/6;S.proj.push({x:p.x+Math.cos(a)*.4,y:p.y+Math.sin(a)*.4,vx:Math.cos(a)*12,vy:Math.sin(a)*12,from:'p',kind:'dagger',mult,life:.6,hit:[]});}}
  else if(id==='fgivre'){const a=Math.atan2(dy,dx);S.proj.push({x:p.x+Math.cos(a)*.4,y:p.y+Math.sin(a)*.4,vx:Math.cos(a)*14,vy:Math.sin(a)*14,from:'p',kind:'parrow',mult:1.6+.16*(l-1),chill:2,life:.8,hit:[]});}
  else if(id==='repli'){const z=S.cur,a=Math.atan2(dy,dx),bx=-Math.cos(a),by=-Math.sin(a);let L=0;for(;L<4;L+=.2)if(!free_(z,p.x+bx*(L+.2),p.y+by*(L+.2)))break;burst(p.x,p.y,'#c8b890',10);p.x+=bx*L;p.y+=by*L;p.path=null;p.goal=null;
    const t=(p.target&&!p.target.dead)?p.target:nearestMon(tx,ty,4)||nearestMon(p.x,p.y,9);const aa=t?Math.atan2(t.y-p.y,t.x-p.x):a;p.face=aa;S.proj.push({x:p.x+Math.cos(aa)*.4,y:p.y+Math.sin(aa)*.4,vx:Math.cos(aa)*14,vy:Math.sin(aa)*14,from:'p',kind:'parrow',mult:1.5+.15*(l-1),life:.9,hit:[]});}
  else if(id==='fragment'){const t=(p.target&&!p.target.dead)?p.target:nearestMon(tx,ty,4),r=Math.min(ln,10),cx=t?t.x:p.x+dx/ln*r,cy=t?t.y:p.y+dy/ln*r;for(let k=0;k<5;k++){const a=k*1.2566,rr=k?1:0;S.mets.push({x:cx+Math.cos(a)*rr,y:cy+Math.sin(a)*rr,t:.3+k*.08,mult:.9+.09*(l-1),r:1.2,small:true,arrow:true});}}
  else if(id==='aegis'){p.inv=Math.min(6,2+.1*(l-1));p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.4);S.novas.push({x:p.x,y:p.y,r:0,max:2.5,col:'255,240,170'});toast('Égide divine');}
  for(let i=np0;i<S.proj.length;i++)S.proj[i].sup=SUPC;for(let i=nm0;i<S.mets.length;i++)S.mets[i].sup=SUPC;
  /* v6.19 : synergies sur ce qui frappe plus tard (projectiles, météores, anneaux, totems, tempête) */
  relicAfter(id,tx,ty,free,np0,nm0);
  if(SYNM!==1){for(let i=np0;i<S.proj.length;i++)S.proj[i].mult*=SYNM;for(let i=nm0;i<S.mets.length;i++)S.mets[i].mult*=SYNM;for(let i=nv0;i<S.novas.length;i++)if(S.novas[i].hit)S.novas[i].hit.mult*=SYNM;if(S.totems)for(let i=nt0;i<S.totems.length;i++)S.totems[i].mult*=SYNM;if(id==='tempete')p.stormM*=SYNM;}SYNM=1;
  if(!free&&!sk.ult&&(p.st.legs.u_echo&&Math.random()<.15||SUPC==='echo'&&Math.random()<.2||p.st.kindle&&Math.random()*100<p.st.kindle))S.pend.push({t:.18,fn:()=>castSkill(id,tx,ty,true)});
  SUPC=null;return true;
}

