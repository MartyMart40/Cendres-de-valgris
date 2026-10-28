'use strict';
/* ---------- Zones ---------- */
function zoneName(id){const d=zoneDef(id);return d?d.name:'?';}
/* v5.49 : Cendre qui avance. Après 22 s, une marée de cendre part de l’entrée et avance vers la sortie ; rester dedans brûle. */
function updCreep(z,dt){const C=z.creep;if(!C.on){C.t-=dt;if(C.t<=0){C.on=true;toast('La cendre avance…');say('Ne reste pas derrière : la cendre ronge tout ce qu’elle touche.');S.shake=.2;}return;}
  C.d=Math.min(C.max,C.d+.25*dt);C.mt=(C.mt||0)-dt;if(C.mt<=0){C.mt=.5;for(const m of z.mons){if(m.dead||m.boss)continue;const mv=z.distE[Math.floor(m.y)*z.w+Math.floor(m.x)];if(mv>=0&&mv<C.d)hurtMon(m,Math.max(1,Math.round(m.maxHp*.03)),'#b8a898');}}const v=z.distE[Math.floor(p.y)*z.w+Math.floor(p.x)];
  if(v>=0&&v<C.d&&!(p.inv>0)){C.acc+=p.maxHp*.04*dt;if(C.acc>=1){const n=Math.floor(C.acc);C.acc-=n;p.hp-=n;p.hurt=.2;if(Math.random()<.1)S.fx.push({x:p.x,y:p.y,t:'Cendre',col:'#b8a898',life:.6});if(p.hp<=0){p.hp=1;hurtPlayer(p.maxHp*99);}}}}
function drawCreep(z){const C=z.creep;if(!C||!C.on||C.d<=0)return;const hw=TW/2*Z,hh=TH/2*Z;let X0=1e9,X1=-1e9,Y0=1e9,Y1=-1e9;
  for(const[cx,cy]of[[0,0],[W,0],[0,H],[W,H]]){const q=wld(cx,cy);X0=Math.min(X0,q[0]);X1=Math.max(X1,q[0]);Y0=Math.min(Y0,q[1]);Y1=Math.max(Y1,q[1]);}
  X0=Math.max(0,Math.floor(X0)-1);Y0=Math.max(0,Math.floor(Y0)-1);X1=Math.min(z.w-1,Math.ceil(X1)+1);Y1=Math.min(z.h-1,Math.ceil(Y1)+1);
  for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){const v=z.distE[y*z.w+x];if(v<0||v>=C.d)continue;const[sx,sy]=scr(x,y),edge=C.d-v<1.2;
    ctx.fillStyle=edge?`rgba(150,70,40,${.35+Math.sin(S.t*5+x+y)*.1})`:'rgba(92,84,78,.55)';ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+hw,sy+hh);ctx.lineTo(sx,sy+2*hh);ctx.lineTo(sx-hw,sy+hh);ctx.closePath();ctx.fill();
    if(edge&&Math.random()<.04)S.parts.push({x:x+Math.random(),y:y+Math.random(),z:.1,vx:rnd(-.3,.3),vy:rnd(-.3,.3),vz:rnd(.5,1.5),life:.8,col:'#8a7a6a'});}}
/* v6.39 : zones purifiées. Abattre 80 % des monstres d’une zone d’acte la purifie : butin rare, orbes, or et un peu d’expérience, une fois par zone et par monde.
   Toutes les zones d’un acte purifiées : butin légendaire. C’est la durée « complète » d’un acte, au choix du joueur ; foncer reste possible. */
const PUR_K=.8;
function purEligible(z){const k=parseZ(z.id);return !!(k&&z.def&&!z.def.last&&!z.def.parent&&!z.def.trial&&z.id!=='rift');}
function purKey(z){return (S.world||1)+':'+z.id;}
function purInit(z){if(!purEligible(z))return;let n=0;for(const m of z.mons){if(m.dead||m.boss||m.guard||m.nest||m.kind==='banner'||m.pup)continue;m.pc=1;n++;}z.pur0=n;z.purK=0;if(S.pur&&S.pur[purKey(z)])z.purDone=1;if(Math.random()<(S.heraldP==null?.3:S.heraldP)&&(S.heraldP!=null||heraldOk(z)))spawnHerald(z);}
function purNeed(z){return z.arena?1:Math.max(1,Math.ceil(z.pur0*PUR_K));}
function purKill(z){if(!z||z.purDone||!z.pur0)return;z.purK=(z.purK||0)+1;if(!z.arena&&z.purK>=purNeed(z))purDone(z);}
function purDone(z){if(z.purDone||!purEligible(z))return;z.purDone=1;S.pur=S.pur||{};const key=purKey(z);if(S.pur[key])return;S.pur[key]=1;seaTrack('pur');
  const L=Math.max(1,z.def.lvl||1);dropAt(z,p.x,p.y,{kind:'item',it:genItem(L+1,2,p.st.mf+100)});for(let k=0;k<2;k++)dropAt(z,p.x,p.y,{kind:'orb',k:orbPick()});dropAt(z,p.x,p.y,{kind:'gold',v:Math.round(60*(1+.3*(L-1)))});
  gainXp(Math.round(xpNext(p.lvl)*.08));toast('Zone purifiée');sfx('lvl');if(typeof flash==='function')flash(p.x,p.y,4,'255,230,150',.6);burst(p.x,p.y,'#ffe09a',26);
  if(!S.purTold){S.purTold=1;S.pend.push({t:1,fn:()=>say('Zone purifiée : son butin est à tes pieds. Purifie toutes les zones d’un acte pour un trésor légendaire.',5200)});}
  const k=parseZ(z.id),n=actLayout(k.a).length,ak=(S.world||1)+':acte'+k.a;
  if(!S.pur[ak]&&Array.from({length:n},(_,i)=>zid(k.a,i)).every(id=>S.pur[(S.world||1)+':'+id])){S.pur[ak]=1;seaTrack('puract');dropAt(z,p.x,p.y,{kind:'item',it:genItem(L+2,3,p.st.mf+150)});for(let j=0;j<3;j++)dropAt(z,p.x,p.y,{kind:'orb',k:orbPick()});
    S.pend.push({t:1.2,fn:()=>{toast('Acte purifié !');sfx('leg');say('Toutes les zones de l’acte sont purifiées. Un trésor légendaire t’attend.',5000);}});}
  save();}
function purTxt(z){if(!purEligible(z)||(!z.pur0&&!z.arena))return'';if(z.purDone)return'<span style="color:#e8d08a">✓ Zone purifiée</span>';if(z.arena)return'';let ar='';if(z.purK>=purNeed(z)*.6){let b=null,bd=1e9;for(const m of z.mons){if(!m.pc||m.dead)continue;const d=dist(m,p);if(d<bd){bd=d;b=m;}}if(b)ar=` · restants : ${z.mons.filter(m=>m.pc&&!m.dead).length} ${dirArrow(b.x,b.y)}`;}return`<span style="color:#b8a888">Purification : ${Math.min(99,Math.floor(z.purK/purNeed(z)*100))} %${ar}</span>`;}
/* v6.40 : Saisons. Une saison dure 4 mois (calendrier réel), la première commence en octobre 2026, trois thèmes tournent.
   Chaque saison : un porteur de saison qui erre dans les zones d’acte, une monnaie, un journal de 8 objectifs et un comptoir.
   Tout se joue hors ligne ; le journal et la monnaie repartent à zéro à la saison suivante, les capes gagnées restent. */
const SEASON_T=[
  {n:'La Marée de suie',cur:'perles de suie',c1:'perle de suie',col:'#b090e0',her:'Héraut de la Marée',herP:'hérauts de la Marée',cape:['#3a2a5a','#0e0818'],capeN:'Cape de la Marée',
   d:'Une marée noire monte des failles. Ses hérauts errent dans les zones d’acte, chargés de perles de suie.'},
  {n:'Le Givre des étoiles',cur:'éclats d’étoile',c1:'éclat d’étoile',col:'#9fd4ff',her:'Veilleur stellaire',herP:'veilleurs stellaires',cape:['#2a4a7a','#0a1428'],capeN:'Cape des Étoiles',
   d:'Des étoiles froides tombent sur les mondes. Des veilleurs venus d’en haut les gardent jalousement.'},
  {n:'Les Braises vertes',cur:'braises vertes',c1:'braise verte',col:'#8ae08a',her:'Porte-flamme vert',herP:'porte-flammes verts',cape:['#2a5a2a','#081808'],capeN:'Cape des Braises vertes',
   d:'Un feu qui ne brûle pas court dans les herbes. Ses porteurs le sèment de zone en zone.'}];
const CAPE0=LOOKS.cape.length;for(const T of SEASON_T)LOOKS.cape.push(T.cape);
function seasonNow(t){const d=new Date(t==null?Date.now():t);const m=(d.getUTCFullYear()-2026)*12+d.getUTCMonth()-9;const k=Math.max(0,Math.floor(m/4));
  return{id:k+1,ti:k%SEASON_T.length,...SEASON_T[k%SEASON_T.length],start:Date.UTC(2026,9+k*4,1),end:Date.UTC(2026,9+k*4+4,1)};}
const SOBJ=[{k:'herald',n:s=>`Abattre 3 ${s.herP}`,g:3},
  {k:'pur',n:()=>'Purifier 5 zones',g:5},{k:'puract',n:()=>'Purifier un acte entier',g:1},{k:'boss',n:()=>'Vaincre 2 boss',g:2},
  {k:'champ',n:()=>'Abattre 40 champions',g:40},{k:'chest',n:()=>'Ouvrir 20 coffres',g:20},{k:'event',n:()=>'Terminer 5 événements',g:5},{k:'rift',n:()=>'Fermer 3 failles',g:3}];
const SOBJ_R=25;
const SSHOP=[{k:'orbs',n:'Trois orbes de forge',c:15},{k:'rare',n:'Un objet rare de ton niveau',c:20},{k:'leg',n:'Un objet légendaire de ton niveau',c:70},{k:'cape',n:'La cape de la saison (ou finis le journal)',c:150}];
function seaGet(){const N=seasonNow(S.seaT);if(!S.sea||S.sea.id!==N.id){const old=S.sea;S.sea={id:N.id,pts:0,cnt:{},done:{},bought:{}};if(old&&old.id)S.pend&&S.pend.push({t:1.5,fn:()=>toast('Nouvelle saison : '+N.n)});}return S.sea;}
function seaGain(n){const A=seaGet();A.pts+=n;A.tot=(A.tot||0)+n;}
function capeUnlocked(i){if(i<CAPE0)return true;return!!(p.capes&&p.capes[i-CAPE0]);}
function seaTrack(k,n){if(!S||!p)return;const A=seaGet(),N=seasonNow(S.seaT),o=SOBJ.find(q=>q.k===k);if(!o||A.done[k])return;A.cnt[k]=Math.min(o.g,(A.cnt[k]||0)+(n||1));
  if(A.cnt[k]>=o.g){A.done[k]=1;A.pts+=SOBJ_R;S.pend&&S.pend.push({t:.9,fn:()=>{toast(`Journal de saison : ${o.n(N)} (+${SOBJ_R} ${N.cur})`);sfx('lvl');}});
    if(SOBJ.every(q=>A.done[q.k])&&!capeUnlocked(CAPE0+N.ti)){p.capes=p.capes||{};p.capes[N.ti]=1;S.pend&&S.pend.push({t:2.4,fn:()=>{toast('Journal complet : '+N.capeN+' débloquée');sfx('leg');say('Ta nouvelle cape t’attend dans Réglages, Apparence.',4500);}});}}}
function spawnHerald(z){const N=seasonNow(S.seaT),c=z.mons.filter(m=>m.pc&&!m.dead);if(!c.length)return;const o=pick(c),f=nearFloor(z,o.x+rnd(-2,2),o.y+rnd(-2,2));if(!f)return;
  const m=spawnMon(z,pick(z.def.mons),f[0]+.5,f[1]+.5,true,Math.max(1,z.def.lvl)+1);m.herald=1;m.name=N.her;m.hp=m.maxHp=Math.round(m.maxHp*1.8);m.hcol=N.col;return m;}
function heraldDie(m){const N=seasonNow(S.seaT),n=ri(5,8);seaGain(n);seaTrack('herald');burst(m.x,m.y,N.col,34);if(typeof flash==='function')flash(m.x,m.y,4,'200,180,255',.5);S.fx.push({x:m.x,y:m.y,t:`+${n} ${N.cur}`,col:N.col,life:1.4,big:true});sfx('leg');}
function seasonHTML(){const N=seasonNow(S.seaT),A=seaGet(),days=Math.max(0,Math.ceil((N.end-(S.seaT||Date.now()))/86400000));
  let h=`<h2>${N.n}</h2><p class="say">${N.d}</p><p class="st">Saison ${N.id} · encore ${days} jour${days>1?'s':''}. Tu as <b style="color:${N.col}">${A.pts} ${N.cur}</b>. On en gagne sur les ${N.herP} (5 à 8), parfois sur les champions, et ${SOBJ_R} par objectif du journal.</p><h3>Journal</h3>`;
  for(const o of SOBJ){const c=A.cnt[o.k]||0;h+=`<div class="row"><div class="st">${A.done[o.k]?'✓ ':''}${o.n(N)}</div><div class="st"><b>${Math.min(c,o.g)} / ${o.g}</b></div></div>`;}
  h+=`<p class="st">Journal complet : la <b>${N.capeN}</b>, à toi pour toujours (Réglages, Apparence).</p><h3>Comptoir de saison</h3>`;
  for(const it of SSHOP){const own=it.k==='cape'&&capeUnlocked(CAPE0+N.ti);h+=`<div class="row"><div class="st">${it.k==='cape'?N.capeN:it.n}</div><div class="bt">${own?'<span class="st">Débloquée</span>':`<button class="min" data-a="seabuy" data-k="${it.k}"${A.pts>=it.c?'':' disabled style="opacity:.5"'}>${it.c} ${N.c1.split(' ')[0]}s</button>`}</div></div>`;}
  return h;}
function seaBuy(k){const N=seasonNow(S.seaT),A=seaGet(),it=SSHOP.find(q=>q.k===k);if(!it||A.pts<it.c)return false;
  if(k==='cape'){if(capeUnlocked(CAPE0+N.ti))return false;p.capes=p.capes||{};p.capes[N.ti]=1;}
  else if(k==='orbs'){for(let i=0;i<3;i++)addOrb(orbPick());}
  else{const it2=genItem(p.lvl,k==='leg'?3:2,p.st.mf);if(!bagAdd(it2)){toast('Ton sac est plein');return false;}}
  A.pts-=it.c;A.bought[k]=(A.bought[k]||0)+1;sfx('gold');toast('Comptoir de saison : '+(k==='cape'?N.capeN:it.n));save();return true;}
/* v6.41 : confort de jeu.
   Reprise : la sauvegarde garde la zone où tu es et ton portail ; à la réouverture tu reviens à l’entrée de cette zone. À ta mort, tu peux revenir par le portail.
   Grande carte : toucher la minicarte. Flèches vers la sortie (zone purifiée) et vers l’acolyte. Résumé en quittant une zone. Statistiques de partie. Onglets du coffre renommables. */
function resumable(id){const k=parseZ(id);if(!k)return false;const d=zoneDef(id);return!!(d&&!d.last);}
function dirArrow(x,y){const sx=(x-p.x)-(y-p.y),sy=(x-p.x)+(y-p.y),a=Math.atan2(sy,sx),i=((Math.round(a/(Math.PI/4))%8)+8)%8;return['→','↘','↓','↙','←','↖','↑','↗'][i];}
function fwdOf(z){const k=parseZ(z.id);if(!k||z.def.last)return null;return zid(k.a,k.i+1);}
function guideTxt(z){if(!z||z.id==='town')return'';const out=[];
  if(z.def&&z.def.aco&&BOSSES[z.def.aco]){const a=z.mons.find(m=>m.t===BOSSES[z.def.aco].mon&&!m.dead&&!m.beaten);if(a&&dist(a,p)>6)out.push(`<span style="color:#e8c46a">Acolyte ${dirArrow(a.x,a.y)}</span>`);}
  if(z.purDone||(z.arena&&z.arena.done)){const f=fwdOf(z),ex=f&&z.objs.find(o=>o.type==='exit'&&o.to===f);if(ex&&dist(ex,p)>5)out.push(`<span style="color:#c8d8a8">Sortie ${dirArrow(ex.x,ex.y)}</span>`);}
  return out.join(' · ');}
function bigMap(){const z=S.cur;if(!z||z.id==='town'&&!z.seen)return;const W_=340,H_=300,c=document.createElement('canvas');c.width=W_*2;c.height=H_*2;const g=c.getContext('2d');g.scale(2,2);g.fillStyle='#0e0b08';g.fillRect(0,0,W_,H_);
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(let y=0;y<z.h;y++)for(let x=0;x<z.w;x++){const i=y*z.w+x;if(!z.seen[i])continue;const mx=x-y,my=(x+y)/2;if(mx<x0)x0=mx;if(mx>x1)x1=mx;if(my<y0)y0=my;if(my>y1)y1=my;}
  if(x0>x1){x0=-5;x1=5;y0=-3;y1=3;}const k=Math.min((W_-20)/(x1-x0+2),(H_-20)/(y1-y0+2),9),ox=W_/2-(x0+x1)/2*k,oy=H_/2-(y0+y1)/2*k,P=(x,y)=>[ox+(x-y)*k,oy+(x+y)/2*k];
  for(let y=0;y<z.h;y++)for(let x=0;x<z.w;x++){const i=y*z.w+x;const wall=z.g[i]===1&&!z.hide[i];if(wall){if(!z.near[i]||!neighSeen(z,x,y))continue;}else if(!z.seen[i])continue;const[a,b]=P(x,y);
    g.fillStyle=wall?(natKind(z)==='water'?'rgba(80,120,150,.9)':natKind(z)==='tree'?'rgba(70,120,60,.9)':'rgba(200,180,140,.85)'):'rgba(120,105,80,.45)';g.beginPath();g.moveTo(a,b-k/2-.3);g.lineTo(a+k+.3,b);g.lineTo(a,b+k/2+.3);g.lineTo(a-k-.3,b);g.closePath();g.fill();}
  const dot=(x,y,col,r)=>{const[a,b]=P(x,y);g.fillStyle=col;g.beginPath();g.arc(a,b,r,0,7);g.fill();};
  for(const o of z.objs){if(!z.seen[Math.floor(o.y)*z.w+Math.floor(o.x)])continue;if(o.type==='exit')dot(o.x,o.y,o.side?'#7fd0ff':'#e8c46a',5);if(o.type==='wp')dot(o.x,o.y,'#6fa0ff',5);if(o.type==='npc')dot(o.x,o.y,'#7fd07f',4);if(o.type==='chest'&&!o.open)dot(o.x,o.y,'#d8b060',3);}
  for(const po of portalsIn(z))dot(po.x,po.y,'#9fb8ff',5);
  for(const m of z.mons)if(inView(m)&&(m.mini||m.herald||m.bossId))dot(m.x,m.y,m.herald?m.hcol:'#e8c46a',5);
  dot(p.x,p.y,'#ffffff',4.5);g.strokeStyle='#000';g.lineWidth=1.5;const[pa,pb]=P(p.x,p.y);g.beginPath();g.arc(pa,pb,4.5,0,7);g.stroke();
  const pu=z.pur0&&!z.arena?(z.purDone?' · purifiée':` · purification ${Math.min(99,Math.floor(z.purK/purNeed(z)*100))} %`):'';
  openPanel(`<h2>${z.id==='town'?'Camp':z.def.name}</h2><p class="st">${zoneIn(z.id)?'':''}Ce que tu as exploré${pu}.</p><div style="text-align:center"><img src="${c.toDataURL()}" width="${W_}" height="${H_}" style="max-width:100%;height:auto;border:1px solid #3a2e20"></div>
  <p class="st"><span style="color:#fff">●</span> toi · <span style="color:#e8c46a">●</span> sortie, élite · <span style="color:#7fd0ff">●</span> traverse · <span style="color:#9fb8ff">●</span> portail · <span style="color:#6fa0ff">●</span> point de passage</p>${zoneResettable(z.id)?'<p class="st">Quittée, cette zone reste telle quelle 15 minutes, puis se remet à neuf.</p><button class="min" data-a="znew">Remettre cette zone à neuf</button>':''}<button data-a="close">Fermer</button>`);}
function zoneSummary(z){if(!z||z.id==='town'||z.id==='trial'||!(z.kc>=8))return;const t=Math.max(1,Math.round(S.t-(z.t0||S.t))),mn=Math.floor(t/60),sc=t%60;
  const b=z.bestIt;say(`${z.def.name} : ${mn?mn+' min ':''}${sc} s · ${z.kc} monstres${b?` · meilleur butin : <b style="color:${itemCol(b)}">${b.name}</b>`:''}${z.purDone?' · purifiée':''}`,4800);}
function gameStatsHTML(){const t=Math.round(S.playT||0),h=Math.floor(t/3600),mn=Math.floor(t%3600/60),K=Object.values(S.best||{}).reduce((a,b)=>a+b,0),pz=Object.keys(S.pur||{}).filter(k=>!/acte/.test(k)).length;
  return`<h3>Ta partie</h3><div class="grid"><span>Temps de jeu</span><b>${h?h+' h ':''}${mn} min</b><span>Monstres abattus</span><b>${fmt(K)}</b><span>Champions</span><b>${fmt(S.champK||0)}</b><span>Boss vaincus</span><b>${fmt(S.bossK||0)}</b><span>Zones purifiées</span><b>${fmt(pz)}</b><span>Morts</span><b>${fmt(S.deaths||0)}</b><span>Record de faille</span><b>${fmt(Math.max(0,(S.riftMax||1)-1))}</b><span>Monde atteint</span><b>${S.worldMax||1}</b><span>Brasier actuel</span><b>${S.br>0?S.br:'base'}</b><span>Plus haut Brasier battu</span><b>${(S.brBest==null||S.brBest<0)?'aucun':S.brBest>0?S.brBest:'base'}</b></div>`;}
/* v6.42 : build et butin. Rachat chez le colporteur (10 derniers objets vendus, le temps de la séance), journal de butin (20 derniers rares et mieux),
   préréglages de talents (3, chargés gratuitement au camp), aperçu avant de placer un point, cour d’entraînement avec mannequin (dégâts par seconde). */
function bbPush(it){S.bb=S.bb||[];S.bb.unshift(it);if(S.bb.length>10)S.bb.length=10;}
function lootLog(it,z){if(!it||(it.rar|0)<2)return;S.lootLog=S.lootLog||[];S.lootLog.unshift({n:it.name,c:itemCol(it),z:z&&z.def?z.def.name:'',l:it.ilvl||0,d:Date.now()});if(S.lootLog.length>20)S.lootLog.length=20;}
function lootLogHTML(){const L=S.lootLog||[];return`<h3>Journal de butin</h3><p class="st">${L.length?L.map(e=>`<b style="color:${e.c}">${e.n}</b> <span style="color:#8a7a60">· ${e.z} · niv. ${e.l}</span>`).join('<br>'):'Tes objets rares, légendaires et d’ensemble apparaîtront ici (les 20 derniers).'}</p>`;}
const STATLBL=[['maxHp','Vie'],['maxMp','Mana'],['armorT','Armure'],['crit','Critique %'],['spell','Dégâts des sorts %'],['atk','Dégâts des attaques %'],['move','Déplacement %'],['dodge','Esquive %'],['block','Blocage %'],['aps','Attaques/s'],['rF','Rés. feu %'],['rC','Rés. froid %'],['rL','Rés. foudre %'],['rP','Rés. poison %']];
function talPreview(id){if(!canRank(id))return'';const nk={...p.sk,[id]:(p.sk[id]||0)+1},st1=computeStats(p.eq,p.lvl,nk),st0=p.st,out=[];
  const h0=skHit(id);const sk0=p.sk;p.sk=nk;p.st=st1;const h1=skHit(id);p.sk=sk0;p.st=st0;
  if(h0&&h1&&(h1.hi!==h0.hi||h1.lo!==h0.lo))out.push(`Dégâts par coup ${fmt(h0.lo)}–${fmt(h0.hi)} → <b style="color:#7fd07f">${fmt(h1.lo)}–${fmt(h1.hi)}</b>`);
  for(const[k,n]of STATLBL){const a=st0[k]||0,b=st1[k]||0;if(Math.abs(b-a)>1e-6)out.push(`${n} ${k==='aps'?fdec(a,2):fmt(Math.round(a))} → <b style="color:${b>a?'#7fd07f':'#d07060'}">${k==='aps'?fdec(b,2):fmt(Math.round(b))}</b>`);}
  const P0=powerOf(st0,p.lvl),P1=powerOf(st1,p.lvl);if(Math.abs(P1-P0)>.5)out.push(`Puissance ${fmt(Math.round(P0))} → <b style="color:#7fd07f">${fmt(Math.round(P1))}</b> (${P1>P0?'+':''}${fdec((P1/P0-1)*100)} %)`);
  return out.length?`<p class="st" style="margin:4px 0">Avec un point de plus : ${out.join(' · ')}</p>`:'';}
function buildCost(sk){const st=(p.cls&&CLS[p.cls]&&CLS[p.cls].start)||{fire:1,nova:1};let c=0;for(const k in sk){if(!SK[k]||SK[k].gem)continue;const r=Math.max(0,(sk[k]|0)-(st[k]|0));c+=r*tCost(k);}return c;}
function buildSave(i){if(p.pts>0){say('Place tous tes points avant d’enregistrer un préréglage.');return false;}p.builds=p.builds||[null,null,null];const sk={};for(const k in p.sk)if(SK[k]&&!SK[k].gem)sk[k]=p.sk[k];p.builds[i]={sk,bar:p.bar.slice(),cls:p.cls||null,n:'Build '+(i+1)};save();toast('Préréglage '+(i+1)+' enregistré');}
function buildLoad(i){const B=p.builds&&p.builds[i];if(!B)return false;if(S.cur.id!=='town'){say('Les préréglages se chargent au camp.');return false;}if((B.cls||null)!==(p.cls||null)){say('Ce préréglage est d’une autre classe.');return false;}
  const cost=buildCost(B.sk),earned=ptsEarned();if(cost>earned){say('Il te manque des points de talent pour ce préréglage.');return false;}
  const gems={};for(const k in p.sk)if(SK[k]&&SK[k].gem)gems[k]=p.sk[k];const st=(p.cls&&CLS[p.cls]&&CLS[p.cls].start)||{fire:1,nova:1};p.sk={...st,...B.sk,...gems};p.pts=earned-cost;
  p.bar=B.bar.map(k=>k&&p.sk[k]?k:null);while(p.bar.length<6)p.bar.push(null);if(p.sup)for(const k in p.sup)if(!p.sk[k])delete p.sup[k];recalc();p.hp=Math.min(p.hp,p.maxHp);save();toast('Préréglage '+(i+1)+' chargé');return true;}
function buildsHTML(){p.builds=p.builds||[null,null,null];return`<div class="st" style="margin:6px 0"><b>Préréglages</b> (build complet seulement, chargés gratuitement au camp) : ${[0,1,2].map(i=>{const B=p.builds[i];return`<span style="white-space:nowrap">${i+1}${B?'':' (vide)'} <button class="min" data-a="bsave" data-i="${i}">Enregistrer</button>${B?`<button class="min" data-a="bload" data-i="${i}"${S.cur.id==='town'?'':' disabled style="opacity:.5"'}>Charger</button>`:''}</span>`}).join(' · ')}</div>`;}
function trainEnter(){const d={name:'Cour d’entraînement',lvl:Math.max(1,p.lvl),style:'plain',forme:'arene',size:26,waves:0,packs:0,mons:['brute'],chests:'none'};
  const z=makeZone('train',d);z.arena=null;z.mons=[];z.items=[];z.ev=null;z.vents=[];const c=z.center||[z.w>>1,z.h>>1],f=nearFloor(z,c[0],c[1])||c;
  const m=spawnMon(z,'brute',f[0]+.5,f[1]+.5,false,Math.max(1,p.lvl));m.dummy=1;m.name='Mannequin';m.hp=m.maxHp=1e12;m.dmg=[0,0];m.spd=0;m.aggro=false;
  S.zones.train=z;S.dps=[];enterZone('train','spawn');say('Frappe le mannequin : tes dégâts par seconde s’affichent en haut. La porte te ramène au camp.',4500);}
function dpsNow(){const L=S.dps||[];if(!L.length)return null;const now=S.t,W8=L.filter(e=>now-e[0]<=8);if(!W8.length)return{dps:0,tot:L.reduce((a,e)=>a+e[1],0)};const span=Math.max(1,Math.min(8,now-W8[0][0]));return{dps:W8.reduce((a,e)=>a+e[1],0)/span,tot:L.reduce((a,e)=>a+e[1],0)};}
/* v6.44 : conversion. Un talent actif dont le palier n’est pas encore ouvert (ancien don de départ) : les talents sont remboursés une fois. */
function lockedActive(){for(const k in p.sk){const s_=SK[k];if(s_&&!s_.gem&&(p.sk[k]|0)>0&&!unlocked(k)){const st=(p.cls&&CLS[p.cls]&&CLS[p.cls].start)||{fire:1,nova:1};if(st[k]&&(p.sk[k]|0)<=st[k]&&s_.ti===0)continue;return k;}}return null;}
/* v6.44 : la mini-carte ne montre que les ennemis que le héros voit en ce moment */
function inView(m){if(!m||m.dead||m.hid>0||m.under||m.lurk&&!m.revealed)return false;const d=dist(m,p);return d<9.5&&losClear(S.cur,p.x,p.y,m.x,m.y);}
/* v6.44 : lieux fermés (cryptes, antres) : ni soleil, ni aurore, ni oiseaux ; des chauves-souris */
function isIndoor(z){return!!z&&(z.style==='crypt'||!!(z.def&&z.def.last));}
function skyOf(z){const K=SKY[skyKey(z)]||SKY['cendres'];return isIndoor(z)?{...K,sun:false,aurora:false,glow:null,storm:false,fly:'bats',band:'30,24,34'}:K;}
function drawSun(z){S.sunP=null;if(p.eco||z.id==='town'||!skyOf(z).sun)return;const A=skyAnchors(z),a=A.top[1],P=paraPt(a[0],a[1]),cx=P[0],cy=P[1]-H*.3,R=Math.min(W,H)*.08;if(cx<-R*5||cx>W+R*5||cy<-R*5||cy>H+R*5)return;
  S.sunP={x:cx,y:cy,R};ctx.save();ctx.globalCompositeOperation='lighter';const g2=ctx.createRadialGradient(cx,cy,R*.6,cx,cy,R*4.5);g2.addColorStop(0,'rgba(255,240,200,.45)');g2.addColorStop(.3,'rgba(255,200,120,.16)');g2.addColorStop(1,'rgba(255,180,100,0)');ctx.fillStyle=g2;ctx.fillRect(cx-R*4.5,cy-R*4.5,R*9,R*9);
  const d2=ctx.createRadialGradient(cx,cy,0,cx,cy,R);d2.addColorStop(0,'rgba(255,252,236,.95)');d2.addColorStop(.8,'rgba(255,236,170,.9)');d2.addColorStop(1,'rgba(255,210,120,0)');ctx.fillStyle=d2;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.fill();ctx.restore();}
/* v6.46 : revenir dans une zone ou la refaire. Une zone quittée reste telle quelle 15 minutes (monstres tués, coffres ouverts, objets au sol),
   puis se remet à neuf toute seule ; on peut aussi la remettre à neuf tout de suite (point de passage ou grande carte). Remise à neuf = nouvelle carte, même forme, nouveaux monstres.
   Garde-fou : le porteur de saison n’apparaît qu’une fois par zone et par jour. */
const ZONE_KEEP=15*60*1000;
function zoneResettable(id){if(!id||id==='town'||id==='rift'||id==='trial'||id==='train')return false;return!!(parseZ(id)||parseX&&parseX(id));}
function keptLeft(z){if(!z||!z.leftAt)return null;return Math.max(0,ZONE_KEEP-(Date.now()-z.leftAt));}
function resetZone(id){if(!zoneResettable(id))return false;const here=S.cur&&S.cur.id===id;if(S.portal&&S.portal.zone===id){S.portal.x=null;S.portal.y=null;}
  const old=S.zones[id];if(old)freeCv(old);delete S.zones[id];if(here){S.cur=null;enterZone(id,'spawn');toast('Zone remise à neuf');}return true;}
function heraldOk(z){const d=dayNo(Date.now()),k=purKey(z);S.hday=S.hday||{};if(S.hday[k]===d)return false;S.hday[k]=d;return true;}
function enterZone(id,how,from){
  const prev=S.cur;if(prev&&prev.id!==id)prev.leftAt=Date.now();if(prev&&prev.id!==id)try{zoneSummary(prev);}catch(e){}if(prev){prev.left=performance.now();freeCv(prev);if(S.killQ&&S.killQ.length)killFlush(1e9);}
  if(prev&&prev.id==='trial'&&id!=='trial'){if(prev.def.trial.state!=='won'&&prev.def.trial.state!=='lost'){prev.def.trial.state='lost';S.pend.push({t:1,fn:()=>say('Épreuve perdue. La carte est consumée.')});}if(S.portal&&S.portal.zone==='trial')S.portal=null;delete S.zones.trial;}
  let z=S.zones[id];if(z&&z.creep)Object.assign(z.creep,{t:22,d:-2,on:false,acc:0});
  if(!z){z=S.zones[id]=makeZone(id);purInit(z);}
  else if(zoneResettable(id)&&z.leftAt&&Date.now()-z.leftAt>ZONE_KEEP){freeCv(z);delete S.zones[id];if(S.portal&&S.portal.zone===id){S.portal.x=null;S.portal.y=null;}z=S.zones[id]=makeZone(id);purInit(z);z._fresh=1;}
  S.cur=z;let pos=z.spawn;if(S.portal&&S.portal.zone===id&&S.portal.x==null){S.portal.x=z.spawn.x+.9;S.portal.y=z.spawn.y-.4;}z.t0=S.t;z.kc=0;z.bestIt=null;
  if(how==='exit'){const o=z.objs.find(o=>o.type==='exit'&&o.to===from);if(o)pos=o.arr;}
  else if(how==='wp'){const o=z.objs.find(o=>o.type==='wp');if(o)pos=o.arr;}
  else if(how==='portal'){const src=id==='town'?z.portalSpot:S.portal;pos=arrival(z,Math.floor(src.x),Math.floor(src.y));}
  p.x=pos.x;p.y=pos.y;p.dots=[];p.path=null;p.target=null;p.targetObj=null;p.goal=null;p.tpCd=1.2;
  S.proj=[];S.novas=[];S.flashes=[];S.card=null;S.hitstop=0;S.parts=[];S.pend=[];S.totems=[];S.amb=[];S.bolts=[];S.mets=[];S.hz=[];S.hits=[];
  /* v5.40 : revenir dans l’antre : le boss d’acte se calme et le cercle de cendre de Valgris disparaît (il revient au prochain coup sous un tiers de vie). Plus de mort en boucle à l’entrée. */
  {for(const m of z.mons)if(m.boss&&!m.mini&&!m.guard&&!m.dead&&!m.beaten&&m.aggro&&!S.cine){m.ph3=false;m.aggro=false;m.vt=3;m.st=8;}z.mons=z.mons.filter(m=>!m.echo);}z.shrink=null;
  if(p.alt&&typeof p.alt==='object'){normItem(p.alt);if(p.alt.slot!=='weapon')p.alt=null;}else p.alt=null;swapBtn();
  if(p.comp&&p.comp.ev==null)p.comp.ev=Math.max(0,xpRank(p.comp)-2);
  if(p.comp)spawnAlly();else S.ally=null;
  if(z.ev&&z.ev.state==='on'&&z.ev.id==='traveler'){z.ev.state='fail';for(const m of z.mons)if(m.relic===z.ev)m.relic=null;}
  if(z.ev&&z.ev.state==='on'&&z.ev.id==='invasion'){z.ev.t=Math.max(0,z.ev.t-10);}
  if(z.ev&&z.ev.state==='on'){if(z.ev.id==='ambush')z.ev.state='idle';if(z.ev.id==='relic'){z.ev.state='fail';for(const m of z.mons)m.relic=null;}if(z.ev.id==='rain')z.ev.state='done';
    /* v6.22 : en revenant, un événement à tenir recommence ; le feu follet et le cerf blanc sont partis */
    if(['herd','glas','starfall','eruption','sandstorm'].includes(z.ev.id))z.ev.state='idle';
    if(z.ev.id==='wisp'||z.ev.id==='whitestag'){z.ev.state='fail';if(z.ev.boss)z.mons=z.mons.filter(m=>m!==z.ev.boss);}}
  z.storm=false;
  if(S.vpend&&S.vpend.dead)S.vpend=null;if(S.cine&&!z.mons.includes(S.cine.m))S.cine=null;
  {const bv=z.mons.find(m=>m.beaten&&!m.dead);if(bv&&!S.cine&&S.vpend!==bv){bv.fallen=false;bv.divine=1;bv.size=5.5;S.vpend=bv;}}
  const s=iso(p.x,p.y);S.cam.x=s[0];S.cam.y=s[1];z.flowT=0;
  /* v6.09 : la bannière d’entrée et les particularités restent 3 s de plus */
  $('#zname').textContent=z.def.name+(brOn(z)?' · B'+S.br:'');toast(z.def.name+(brOn(z)?' · '+brName(S.br):''),5200);S.fade=p.eco?0:1;
  if(z.def.mods&&z.def.mods.length)S.pend.push({t:1.2,fn:()=>say('Particularités : '+z.def.mods.map(k=>ZMODS[k].n+' ('+ZMODS[k].d.toLowerCase()+')').join(', ')+'. +'+z.def.mods.length*10+' % d’expérience et de butin.',6200)});
  if(z.def.sideq){S.q.side=S.q.side||{};if(!S.q.side[z.def.sid]){S.q.side[z.def.sid]=1;S.pend.push({t:1.4,fn:()=>say(z.def.sideq.intro+' (facultatif)',6200)});}}
  /* v6.56 : prévenir quand le héros est en retard sur la zone */
  if(id!=='town'&&!z.def.rift&&!z.def.trial&&z.def.lvl>=4&&z.def.lvl>=p.lvl+2){const gp=Math.min(CAMP.gapMax,z.def.lvl-p.lvl);S.pend.push({t:1.8,fn:()=>say(`Zone de niveau ${z.def.lvl} : ${gp} niveau${gp>1?'x':''} de retard. Les ennemis plus forts que toi frappent plus fort et encaissent mieux. Un chemin de traverse aide à rattraper.`,5200)});}
  if(z._fresh){delete z._fresh;S.pend.push({t:1.2,fn:()=>say('Cette zone s’est remise à neuf depuis ton dernier passage.',4200)});}
  if(id==='town'){p.hp=Math.max(p.hp,p.maxHp*.5);save();}
}
function portalsIn(z){const r=[];if(!S.portal)return r;
  if(z.id==='town')r.push({x:z.portalSpot.x,y:z.portalSpot.y,dest:S.portal.zone,label:'Vers : '+zoneName(S.portal.zone)});
  if(z.id===S.portal.zone)r.push({x:S.portal.x,y:S.portal.y,dest:'town',label:'Vers le camp'});return r;}
function openRift(n){
  if(S.portal&&S.portal.zone==='rift')S.portal=null;
  const d=riftDef(n);d.rmods=rollRmods(n);S.zones.rift=makeZone('rift',d);S.zones.rift.t0=S.t;if(d.rmods.length){S.zones.rift.lootBonus=(S.zones.rift.lootBonus||1)*(1+.15*d.rmods.length);S.pend.push({t:1.2,fn:()=>toast('Faille : '+d.rmods.map(k=>TMODS[k].n).join(', '))});}enterZone('rift','spawn');sfx('portal');
}

