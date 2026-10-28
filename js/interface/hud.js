'use strict';
/* ---------- HUD ---------- */
let hoverMon=null;
function keyArrow(z){let b=null,bd=1e9;for(const k of z.keys||[])if(!k.got){const d=Math.hypot(k.x-p.x,k.y-p.y);if(d<bd){bd=d;b=k;}}if(!b)return'';const sx=(b.x-p.x)-(b.y-p.y),sy=(b.x-p.x)+(b.y-p.y),a=Math.atan2(sy,sx),i=((Math.round(a/(Math.PI/4))%8)+8)%8;return['→','↘','↓','↙','←','↖','↑','↗'][i]+' '+Math.round(bd);}
function trackText(){const t_=trackText0(),u_=[S.cur&&purTxt(S.cur),S.cur&&guideTxt(S.cur)].filter(Boolean).join('<br>');return u_?(t_?t_+'<br>'+u_:u_):t_;}
function trackText0(){const q=S.q,z=S.cur;
  if(z.id==='train'){const D=dpsNow();return`<b>Cour d’entraînement</b><br>${D?`Dégâts par seconde : <b style="color:#ffd860">${fmt(Math.round(D.dps))}</b> (8 dernières s)<br>Total : ${fmt(Math.round(D.tot))}`:'Frappe le mannequin.'}`;}
  if(z.id==='rift'){const rm=(z.def.rmods||[]).length?`<br><span style="color:#d8a8ff">${z.def.rmods.map(k=>TMODS[k].n).join(' · ')}</span>`:'';return z.done?`<b>Faille vaincue</b><br>Prends la sortie pour rentrer.`:z.guardSpawned?`<b>Faille ${z.def.rift}</b><br>Abats le gardien.${rm}`:`<b>Faille ${z.def.rift}</b><br>Créatures : ${z.kills} / ${z.def.goal}${rm}`;}
  if(z.def.trial){const T=z.def.trial,left=Math.max(0,Math.ceil(TRIALS[T.card.mode].dur-(T.state==='on'?T.t:0)));
    return T.state==='won'?`<b>Épreuve réussie</b><br>${T.kills} abattus · prends ton butin`:T.state==='lost'?`<b>Épreuve perdue</b><br>La sortie est ouverte.`:T.state==='on'&&T.card.mode==='duel'?`<b>Duel</b><br>Champion ${Math.min(5,(T.round||0)+1)} / 5`:T.state==='on'&&T.card.mode==='braziers'?`<b>Braseros</b><br>${Math.floor(left/60)}:${String(left%60).padStart(2,'0')} · feux ${z.fires.filter(b=>b.state==='on').length} / 3`:T.state==='on'&&T.card.mode==='defense'?`<b>Défense</b><br>${Math.floor(left/60)}:${String(left%60).padStart(2,'0')} · prêtresse ${Math.max(0,Math.round(z.ward.hp))} %`:T.state==='on'&&T.card.mode==='prey'&&z.keys?`<b>Proie</b><br>${Math.floor(left/60)}:${String(left%60).padStart(2,'0')} · clés ${z.keys.filter(k=>k.got).length} / ${z.keys.length} ${keyArrow(z)}`:T.state==='on'&&T.card.mode==='convoy'&&z.cart?`<b>Convoi</b><br>chariot ${Math.max(0,Math.round(z.cart.hp/z.cart.hpMax*100))} % · route ${Math.min(100,Math.round(100*(1-(z.cvFlow[Math.floor(z.cart.y)*z.w+Math.floor(z.cart.x)]-1)/Math.max(1,z.cart.d0-1))))} %${z.cart.block?' · bloqué !':z.cart.wait?' · attend':''}`:T.state==='on'&&T.card.mode==='hunt'?`<b>Traque</b><br>${Math.floor(left/60)}:${String(left%60).padStart(2,'0')} · cibles ${5-z.mons.filter(m=>m.hunt&&!m.dead).length} / 5`:T.state==='wait'?`<b>${TRIALS[T.card.mode].n}</b><br>Prépare-toi…`:`<b>${TRIALS[T.card.mode].n}</b><br>${Math.floor(left/60)}:${String(left%60).padStart(2,'0')} · ${T.kills} abattus`;}
  if(z.arena&&z.arena.on&&!z.arena.done)return`<b>${z.def.name}</b><br>Vague ${z.arena.wave} / ${z.arena.n}`;
  if(z.ev&&z.ev.state==='on'&&EVENTS[z.ev.id]&&EVENTS[z.ev.id].th){const t_=evTrack(z);if(t_)return t_;}
  if(z.ev&&z.ev.state==='on'){if(z.ev.id==='ambush')return`<b>Embuscade</b><br>Abats-les tous : ${z.mons.filter(m=>m.evm&&!m.dead).length} restants`;
    if(z.ev.id==='invasion')return`<b>Portail d’invasion</b><br>Détruis la brèche : ${Math.max(0,Math.ceil(40-z.ev.t))} s`;
    if(z.ev.id==='traveler')return`<b>Voyageur assiégé</b><br>Assaillants : ${z.mons.filter(m=>m.evm&&!m.dead).length} · voyageur ${Math.max(0,Math.round(z.ev.hp/z.ev.hpMax*100))} %`;
    if(z.ev.id==='shrooms')return`<b>Clairière farfelue</b><br>Champignons restants : ${z.mons.filter(m=>m.evm&&!m.dead).length}`;
    if(z.ev.id==='nests')return`<b>Nids de cendre</b><br>Nids restants : ${z.mons.filter(m=>m.nest&&!m.dead).length} / 3`;
    if(z.ev.id==='cage'&&z.ev.state==='on')return`<b>Cage du geôlier</b><br>Geôliers debout : ${z.mons.filter(m=>m.evm&&!m.dead).length}`;
    if(z.ev.id==='gibbet')return`<b>Gibet</b><br>Pendus debout : ${z.mons.filter(m=>m.evm&&!m.dead).length}`;
    if(z.ev.id==='cchest')return`<b>Coffre maudit</b><br>Champions restants : ${z.mons.filter(m=>m.evm&&!m.dead).length}`;
    if(z.ev.id==='rain')return`<b>Pluie de braises</b><br>Encore ${Math.max(0,Math.ceil(30-z.ev.t))} s`;
    if(z.ev.id==='relic')return`<b>Reliquaire</b><br>Tiens encore ${Math.max(0,Math.ceil(60-z.ev.t))} s · relique ${Math.max(0,Math.round(z.ev.hp))} %`;}
  if(z.def.sideq)return sideTrack(z);
  const k=curQuest();if(k){const Q=QUESTS[k],s=q[k].s;if(s===0)return`Parle ${npcA('corvel').replace(/^le /,'au ').replace(/^(?!au )/,'à ')} au camp.`;if(Q.track[s])return`<b>${qt(k+'n',Q.n)}</b><br>${Q.track[s](q[k])}`;}
  return`<b>Failles sans fin</b><br>Plus haute : niveau ${S.riftMax}`;}
/* Quête en cours : la première du catalogue qui n’est pas terminée */
function curQuest(){for(const k in QUESTS)if(!S.q[k]||S.q[k].s<3)return k;return null;}
function zoneEffects(z){const out=[];if(!z||!z.def)return out;for(const k of z.def.mods||[])if(ZMODS[k])out.push({n:ZMODS[k].n,d:ZMODS[k].d+' (+10 % d’expérience et de butin)'});
  for(const k of z.def.rmods||[])if(TMODS[k])out.push({n:TMODS[k].n,d:TMODS[k].d});if(z.def.trial)for(const k of z.def.trial.mods||[])if(TMODS[k])out.push({n:TMODS[k].n,d:TMODS[k].d});
  if(z.pact)out.push({n:'Pacte',d:'+50 % de vie aux monstres, +50 % de butin'});if(z.blessing){const q=PRAYERS.find(q=>q.k===z.blessing);if(q)out.push({n:q.n,d:q.d});}if(z.invaded&&THEMES[z.invaded])out.push({n:'Envahie',d:`La zone a basculé vers ${THEMES[z.invaded].n} : monstres plus durs, +40 % de butin`});return out;}
let ZMK='';function zmodsHud(){const el=$('#zmods');if(!el)return;const E=zoneEffects(S.cur),key=S.cur.id+'|'+E.map(e=>e.n).join(',');if(key===ZMK)return;ZMK=key;el.classList.remove('open');
  if(!E.length){el.classList.add('hidden');el.innerHTML='';return;}el.classList.remove('hidden');el.innerHTML=E.map(e=>`<div>${e.n}<span class="d">${e.d}</span></div>`).join('');}
function hud(){
  $('#hpf').style.height=(p.hp/p.maxHp*100)+'%';$('#mpf').style.height=(p.mp/p.maxMp*100)+'%';
  $('#hpt').textContent=fmt(Math.ceil(p.hp));$('#mpt').textContent=Math.floor(p.mp);
  $('#xpf').style.width=(p.xp/xpNext(p.lvl)*100)+'%';$('#potn').textContent='Fiole '+p.pot;$('#tpn').textContent='Portail '+p.scroll;
  $('#track').innerHTML=fixN(`Niveau ${p.lvl}${S.world>1?` · monde ${S.world}`:''}<br>`+trackText());zmodsHud();
  for(let k=0;k<6;k++){const b=$('#sk'+k),id=p.bar[k];if(b&&k>=4)b.classList.toggle('hidden',k>=barSize());if(!b)continue;const sk=id&&SK[id];
    const key=(id||'')+'|'+(sk?skLvl(id):0);if(b.dataset.key!==key){b.dataset.key=key;b.innerHTML=sk?`<span class="g">${sk.ic}</span>${sk.sh}<kbd>${k+1}</kbd>`:`<span class="g">＋</span>Vide<kbd>${k+1}</kbd>`;}
    const cd=id&&p.cds[id]?p.cds[id]/SK[id].cd:0;b.style.background=cd>0?`linear-gradient(to top,#17110c ${100-cd*100}%,#3a1a10 ${100-cd*100}%)`:'';
    b.classList.toggle('dim',!!(sk&&p.mp<sk.cost));}
  $('#menuBadge').classList.toggle('hidden',!(p.pts>0));
  const t=hoverMon&&!hoverMon.dead?hoverMon:p.target&&!p.target.dead?p.target:(S.cur.mons.find(m=>m.boss&&m.aggro&&!m.dead)||null);
  const tb=$('#tbar');if(t){tb.style.display='block';$('#tname').textContent=toneName(t.name,t)+(t.lvl?` (niv. ${t.lvl})`:'')+(t.formN?(t.fake>0?' · à terre…':` · forme ${t.form||1} / ${t.formN}`):'')+(t.shellMax?(t.shell>0?` · armure ${Math.ceil(t.shell/t.shellMax*100)} %`:' · armure brisée'):'')+(t.flag&&!t.flag.dead?' · protégé par l’étendard':'');$('#tname').style.color=t.guard?'#d8a8ff':t.boss?'#e8c46a':t.champ?'#8796ff':'#e2d6c0';$('#thp').style.width=Math.max(0,t.hp/t.maxHp*100)+'%';}else tb.style.display='none';
  drawMini();
}

