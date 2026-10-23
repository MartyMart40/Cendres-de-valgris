'use strict';
/* Valgris à zéro de vie : il ne meurt pas, il plie et propose le défi */
/* Valgris à zéro de vie : il tombe, le héros croit avoir gagné, puis Valgris se relève sous sa vraie forme, immense */
const CINE_V=[[0,'fall'],[1.4,'hero'],[3.4,'rise'],[7.2,'speak']];
function valgrisBeaten(m){const z=S.cur,L=REPLIQUES.valgris[S.world]||REPLIQUES.valgris[1];m.beaten=true;m.hp=1;m.stun=1e9;z.shrink=null;S.hz=[];S.proj=[];
  for(const o of z.mons)if(o!==m&&!o.dead){o.dead=true;o.dt=0;o.hp=0;}
  p.target=null;p.path=null;p.inv=Math.max(p.inv||0,12);p.queued=null;
  burst(m.x,m.y,'#e8e0cc',60);S.shake=.5;sfx('lvl');m.fallen=true;toast(L.fall);S.cine={m,t:0,step:1};}
function updCine(dt){const C=S.cine,m=C.m,L=REPLIQUES.valgris[S.world]||REPLIQUES.valgris[1];C.t+=dt;p.inv=Math.max(p.inv||0,2);
  while(C.step<CINE_V.length&&C.t>=CINE_V[C.step][0]){const k=CINE_V[C.step][1];C.step++;
    if(k==='hero')say(L.hero);
    if(k==='rise'){m.fallen=false;m.divine=0;S.shake=1;sfx('boom');say(L.rise);toast('Valgris se relève');burst(m.x,m.y,'#4a4440',80);}
    if(k==='speak'){S.cine=null;S.vpend=m;openValgrisChoice();return;}}
  if(m.divine!=null){m.divine=Math.min(1,m.divine+dt/3);m.size=2.3+2.4*m.divine;S.shake=Math.max(S.shake,.25*(1-m.divine)+.08);
    if(Math.random()<dt*30)S.parts.push({x:m.x+rnd(-2.5,2.5),y:m.y+rnd(-2.5,2.5),z:.2,vx:0,vy:0,vz:rnd(2,5),life:rnd(.6,1.4),col:Math.random()<.5?'#8a8278':'#f4ecd8'});}}
function openValgrisChoice(){const L=REPLIQUES.valgris[S.world]||REPLIQUES.valgris[1];
  openPanel(`<h2>Valgris</h2>${L.ascend.map(t=>`<p class="say">${t}</p>`).join('')}
  ${WORLDS[S.world+1]?`<button data-a="vdefi">Accepter le défi</button>`:`<button data-a="vdefi" disabled title="Le monde suivant arrive dans une prochaine version" style="opacity:.5">Accepter le défi (bientôt)</button>`}<button data-a="vpas">Pas encore</button>
  <p class="st">${WORLDS[S.world+1]?`« Accepter le défi » : tu pars pour le monde ${S.world+1}, ${worldName(S.world+1)}. Ton héros, ton sac, ton coffre et tes failles te suivent, et son gros butin t’y attend. Les monstres y sont bien plus durs. Tu pourras revenir ici par la pierre de faille.`:'Le monde suivant arrive dans une prochaine version.'} « Pas encore » : Valgris laisse son butin, remonte dans les cendres et t’attend pour la revanche.</p>`);}
function valgrisAccept(){const m=S.vpend,z=S.cur;if(!m||!WORLDS[S.world+1])return;S.vpend=null;closePanel();const B=BOSSES.valgris,from=S.world;
  gainXp(m.xp);z.mons=z.mons.filter(o=>o!==m);const q=S.q[B.quest];if(q&&q.s<3)q.s=3;p.inv=0;
  for(let k=0;k<6;k++)burst(m.x+rnd(-2,2),m.y+rnd(-2,2),'#f4ecd8',30);S.shake=.8;sfx('portal');
  S.pend.push({t:1.2,fn:()=>{setWorld(from+1);const L=REPLIQUES.valgris[S.world]||{};const lv=zoneDef(zid(1,0)).lvl+2;
    for(const[r,n]of[[3,1],[2,3]])for(let i=0;i<n;i++)dropAt(S.cur,p.x+rnd(-1,1),p.y+rnd(-1,1),{kind:'item',it:genItem(lv,r,p.st.mf+300)});
    // Son butin propre est garanti, au nom du monde où il est tombé
    if(bossLootOf('valgris')){S.btry=S.btry||{};S.btry.valgris=0;dropAt(S.cur,p.x+rnd(-1,1),p.y+rnd(-1,1),{kind:'item',it:genBossItem('valgris',lv,WORLDS[from].theme)});}
    dropAt(S.cur,p.x,p.y,{kind:'gold',v:Math.round(600*(1+.3*(lv-1)))});
    toast(`Monde ${S.world} : ${worldName(S.world)}`);if(L.arrive)S.pend.push({t:2.4,fn:()=>say(L.arrive)});
    S.pend.push({t:5,fn:()=>say(`Son butin t’attend à tes pieds. Parle à ${npcA('corvel').replace(/<\/?b>/g,'')}.`)});save();}});}
function valgrisNotYet(){const m=S.vpend,z=S.cur;S.vpend=null;closePanel();if(!m)return;const L=REPLIQUES.valgris[S.world]||REPLIQUES.valgris[1];
  const B=BOSSES.valgris;gainXp(m.xp);dropLoot(m,z);S.pend.push({t:.3,fn:()=>say(L.notyet)});for(let k=0;k<5;k++)burst(m.x+rnd(-1.5,1.5),m.y+rnd(-1.5,1.5),k%2?'#f4ecd8':'#6a645c',30);S.shake=.6;sfx('portal');z.mons=z.mons.filter(o=>o!==m);p.inv=0;
  const q=S.q[B.quest];if(q&&q.s<2){q.s=2;toast(bt(B,'death'));}nextActExit(z);save();}
