'use strict';
/* ---------- HUD ---------- */
let hoverMon=null;
function trackText(){const q=S.q,z=S.cur;
  if(z.id==='rift'){return z.done?`<b>Faille vaincue</b><br>Prends la sortie pour rentrer.`:z.guardSpawned?`<b>Faille ${z.def.rift}</b><br>Abats le gardien.`:`<b>Faille ${z.def.rift}</b><br>Créatures : ${z.kills} / ${z.def.goal}`;}
  if(z.arena&&z.arena.on&&!z.arena.done)return`<b>${z.def.name}</b><br>Vague ${z.arena.wave} / ${z.arena.n}`;
  const k=curQuest();if(k){const Q=QUESTS[k],s=q[k].s;if(s===0)return`Parle à ${npcA('corvel')} au camp.`;if(Q.track[s])return`<b>${qt(k+'n',Q.n)}</b><br>${Q.track[s](q[k])}`;}
  return`<b>Failles sans fin</b><br>Plus haute : niveau ${S.riftMax}`;}
/* Quête en cours : la première du catalogue qui n’est pas terminée */
function curQuest(){for(const k in QUESTS)if(!S.q[k]||S.q[k].s<3)return k;return null;}
function hud(){
  $('#hpf').style.height=(p.hp/p.maxHp*100)+'%';$('#mpf').style.height=(p.mp/p.maxMp*100)+'%';
  $('#hpt').textContent=fmt(Math.ceil(p.hp));$('#mpt').textContent=Math.floor(p.mp);
  $('#xpf').style.width=(p.xp/xpNext(p.lvl)*100)+'%';$('#potn').textContent='Fiole '+p.pot;$('#tpn').textContent='Portail '+p.scroll;
  $('#track').innerHTML=fixN(`Niveau ${p.lvl}${S.world>1?` · monde ${S.world}`:''}<br>`+trackText());
  for(let k=0;k<4;k++){const b=$('#sk'+k),id=p.bar[k];if(!b)continue;const sk=id&&SK[id];
    const key=(id||'')+'|'+(sk?skLvl(id):0);if(b.dataset.key!==key){b.dataset.key=key;b.innerHTML=sk?`<span class="g">${sk.ic}</span>${sk.sh}<kbd>${k+1}</kbd>`:`<span class="g">＋</span>Vide<kbd>${k+1}</kbd>`;}
    const cd=id&&p.cds[id]?p.cds[id]/SK[id].cd:0;b.style.background=cd>0?`linear-gradient(to top,#17110c ${100-cd*100}%,#3a1a10 ${100-cd*100}%)`:'';
    b.classList.toggle('dim',!!(sk&&p.mp<sk.cost));}
  $('#menuBadge').classList.toggle('hidden',!(p.pts>0));
  const t=hoverMon&&!hoverMon.dead?hoverMon:p.target&&!p.target.dead?p.target:(S.cur.mons.find(m=>m.boss&&m.aggro&&!m.dead)||null);
  const tb=$('#tbar');if(t){tb.style.display='block';$('#tname').textContent=t.name+(t.lvl?` (niv. ${t.lvl})`:'')+(t.shellMax?(t.shell>0?` · armure ${Math.ceil(t.shell/t.shellMax*100)} %`:' · armure brisée'):'')+(t.flag&&!t.flag.dead?' · protégé par l’étendard':'');$('#tname').style.color=t.guard?'#d8a8ff':t.boss?'#e8c46a':t.champ?'#8796ff':'#e2d6c0';$('#thp').style.width=Math.max(0,t.hp/t.maxHp*100)+'%';}else tb.style.display='none';
  drawMini();
}

