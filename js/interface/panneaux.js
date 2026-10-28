'use strict';
/* ---------- Panneaux ---------- */
const panel=$('#panel');
function openPanel(h){h=fixN(h);if(!/data-a="(revive|vdefi|pactyes|clsnew)"/.test(h))h='<button class="xclose" data-a="close" aria-label="Fermer">✕</button>'+h;panel.innerHTML=h;panel.classList.remove('hidden','wide');S.paused=true;}
function closePanel(){panel.classList.add('hidden');S.paused=false;}
function corvelHas(){const k=curQuest();return(!!k&&(S.q[k].s===0||S.q[k].s===2))||(typeof loreNew==='function'&&loreNew());}
function potPrice(){return Math.round(POTIONS.fiole.price()*(mut('avarice')?1.5:1));}function scrollPrice(){return 30+p.lvl*2;}
function itemRow(it,i,mode){
  const lines=itemLines(it).join(' · ');let cmp='';
  if(mode==='bag'){const c=compareItem(it);cmp=Math.abs(c)<.5?'<span class="st">≈</span>':c>0?`<span class="up">▲ ${pctTxt(c)} %</span>`:`<span class="dn">▼ ${pctTxt(c)} %</span>`;}
  const btn=mode==='bag'?`<button class="min" data-a="eq" data-i="${i}">Équiper</button><button class="min" data-a="drop" data-i="${i}">Jeter</button>`:mode==='sell'?`<button class="min" data-a="sell" data-i="${i}">${fmt(it.val)} or</button>`:mode==='eq'?`<button class="min" data-a="uneq" data-s="${i}">Retirer</button>`:'';
  return`<div class="row"><div><div class="st">${SLOTN[it.slot]} · niv. ${it.ilvl} ${cmp}</div><div class="it" style="color:${itemCol(it)}">${it.name}</div><div class="st">${lines}</div></div><div class="bt">${btn}</div></div>`;}
function npcDialog(id){
  const q=S.q;let h='';
  if(id==='corvel'){h=`<h2>${npcF('corvel')}</h2>`;const k=curQuest(),L=k&&QUESTS[k].corvel[q[k].s]&&QUESTS[k].corvel[q[k].s](q[k]);
    if(L)h+=`<p class="say">${qt(k+'c'+q[k].s,L.say)}</p>${L.st?`<p class="st">${L.st}</p>`:''}${L.btn?`<button data-a="${L.act}" data-q="${k}">${L.btn}</button>`:''}`;
    else h+=`<p class="say">« La pierre de faille, près du feu, mène toujours plus bas. Chaque gardien vaincu en ouvre une plus profonde. Personne n’en a vu le fond. »</p>`;
    h+=brHTML();
    if(LORE[loreTh()])h+=`<div><button class="min" data-a="lore">Parler de ce monde${loreNew()?' (nouveau)':''}</button></div>`;}
  else if(id==='bram'){invPanel('sell');return;const junk=p.bag.filter(it=>it.rar<=1&&compareItem(it)<=0).length;
    h=`<h2>${npcF('bram')}</h2><p class="say">« J’ai de quoi te garder en vie. Et je rachète ce que tu traînes. »</p><p class="st">Ton or : ${fmt(p.gold)} · Fioles ${p.pot} · Parchemins ${p.scroll}</p>
    <button data-a="buyp">Fiole : ${potPrice()} or</button><button data-a="buyp5">5 fioles : ${potPrice()*5} or</button><button data-a="buys">Parchemin : ${scrollPrice()} or</button>
    <h3>Vendre</h3>${junk?`<button data-a="selljunk">Vendre les ${junk} objets normaux et magiques moins bons</button>`:''}`;
    if(!p.bag.length)h+='<p class="st">Ton sac est vide.</p>';
    p.bag.forEach((it,i)=>{h+=itemRow(it,i,'sell');});}
  else if(id==='hilde'&&(S.hTab||'reforger')!=='reforger'){hildeCraft();return;}
  else if(id==='hilde'){h=`<h2>${npcF('hilde')}</h2>${hildeTabs()}<p class="say">« Ta vieille lame te plaît ? Je peux la remettre au goût du jour. Elle gardera ses pouvoirs, mais frappera comme une neuve. »</p><p class="st">Monte un objet à ton niveau (${p.lvl}). Ton or : ${fmt(p.gold)}.</p>`;
    const list=[...SLOTS.filter(s=>p.eq[s]).map(s=>({it:p.eq[s],src:'eq',k:s})),...p.bag.map((it,i)=>({it,src:'bag',k:i}))].filter(o=>o.it.ilvl<p.lvl&&o.it.rar>=1).sort((a,b)=>b.it.rar-a.it.rar);
    if(!list.length)h+='<p class="st">Rien à reforger : tes objets magiques, rares et légendaires sont déjà à ton niveau.</p>';
    for(const o of list)h+=`<div class="row"><div><div class="st">${SLOTN[o.it.slot]} · niv. ${o.it.ilvl} ${o.src==='eq'?'· équipé':''}</div><div class="it" style="color:${itemCol(o.it)}">${o.it.name}</div></div><div class="bt"><button class="min" data-a="forge" data-src="${o.src}" data-k="${o.k}">${fmt(forgeCost(o.it))} or</button></div></div>`;}
  else if(id==='demol'){invPanel('salv');return;}
  else if(id==='lapid'){lapidPanel();return;}
  else if(id==='autel'){CUBES=-1;autelPanel();return;}
  else if(id==='recruit'){h=`<h2>${npcF('recruit')}</h2><p class="say">« Personne ne devrait marcher seul là-dehors. J’ai des gens. Ils coûtent cher, et ils ne reviennent pas toujours. »</p><p class="st">Un compagnon à la fois. Il te suit, se bat, et gagne des rangs avec les ennemis abattus près de lui. Ton or : ${fmt(p.gold)}.</p>`;
    if(p.comp){const c=p.comp,A=ALLIES[c.type],r=allyRank(c),nx=ARANKS[r+1];h+=`<div class="row"><div><div class="it" style="color:#e8c46a">${A.n} · ${ARANKS[r][0]}</div><div class="st">${A.d}<br>Expérience ${fmt(c.xp||0)}${nx?` / ${nx[1]} pour ${nx[0]}`:' (rang maximal)'}</div></div><div class="bt"><button class="min" data-a="allyfire">Renvoyer</button></div></div>`;
      h+=`<div class="st" style="margin:4px 0 8px">${(ASK[c.type]||[]).map((t,i)=>`<div style="color:${r>=i+1?'#e8c46a':'#777'}">${ARANKS[i+1][0]} : ${t}</div>`).join('')}</div>`;
      const ec=evoCost(c);if(ec&&xpRank(c)>r&&r>=2)h+=`<div class="row"><div><div class="it">Faire évoluer vers ${ARANKS[r+1][0]}</div><div class="st">Coût : ${matsTxt(ec)}</div></div><div class="bt"><button class="min" data-a="allyevo" ${canPay(ec)?'':'disabled'}>Évoluer</button></div></div>`;
      else if(ec&&r>=2)h+=`<div class="st" style="color:#888">Prochaine évolution (${ARANKS[r+1][0]}) : ${fmt(ARANKS[r+1][1])} d’expérience, puis ${matsTxt(ec)}.</div>`;}
    {const M=p.mats||{},m=p.comp&&p.comp.type==='rejeton'?3:1,cc=o=>{const r={};for(const k in o)r[k]=o[k]*m;return r;};h+=`<div class="matbox"><b>Évolution du compagnon</b><div class="st">L’expérience le mène jusqu’à Vétéran. Ensuite, il évolue ici avec les matériaux que donne ${npcF('demol')} : Élite ${matsTxt(cc(AEVO[0]))}, Légendaire ${matsTxt(cc(AEVO[1]))}.<br>Tu as : ${MATS.map(x=>`<span style="color:${x.c}">${fmt(M[x.k]||0)} ${x.n.toLowerCase()}</span>`).join(', ')}.</div></div>`;}
    for(const[k,A]of Object.entries(ALLIES)){if(p.comp&&p.comp.type===k)continue;if(A.egg&&!p.egg)continue;h+=`<div class="row"><div><div class="it">${A.n}</div><div class="st">${A.d}</div></div><div class="bt"><button class="min" data-a="allyhire" data-k="${k}">${A.egg?'Faire éclore':fmt(A.price(p.lvl))+' or'}</button></div></div>`;}}
  else if(id==='joueuse'){h=`<h2>${npcF('joueuse')}</h2><p class="say">« Sous ce voile, peut-être une merveille. Peut-être un caillou. Tu paies, tu vois. »</p><p class="st">Ton or : ${fmt(p.gold)}. Objet de ton niveau (${p.lvl}), au moins magique : ${Math.round(GAMBLE.leg*100)} % légendaire, ${Math.round(GAMBLE.rare*100)} % rare.</p>`;
    for(const[k,G_]of Object.entries(GAMBLE.kinds))h+=`<button data-a="gamble" data-k="${k}">${G_.n} : ${fmt(gamblePrice(k))} or</button>`;}
  else if(id==='eline'){p.hp=p.maxHp;p.mp=p.maxMp;h=`<h2>${npcF('eline')}</h2><p class="say">« Assieds-toi près du feu. Voilà, tes blessures se referment. »</p><p class="st">Vie et mana restaurées.</p>`;}
  openPanel(h+'<div><button data-a="close">Fermer</button></div>');
}
let tab='inv';
/* v6.14 : le menu est découpé en onglets courts plutôt qu’en longues pages à faire défiler */
const MTABS=[['inv','Sac'],['perso','Stats'],['regl','Réglages'],['comp','Talents'],['pierres','Pierres'],['quetes','Quêtes'],['traverses','Traverses'],['journal','Découvertes'],['hf','Hauts faits'],['saison','Saison'],['histoire','Histoire'],['carnet','Carnet'],['best','Bestiaire']];
function tabs(){return`<div class="tabs">${MTABS.map(([k,n])=>`<button class="${tab===k?'on':''}" data-a="tab" data-t="${k}">${n}${k==='comp'&&p.pts?` (${fmt(p.pts)})`:''}</button>`).join('')}</div>`;}
function menuPanel(t){if(t)tab=t;if(tab==='sac')tab='inv';if(tab==='inv'){invPanel('inv');return;}if(tab==='comp'||tab==='pierres'){talentPanel();return;}let h=tabs();const s=p.st;
  if(tab==='perso'){
    h+=`<h2>Niveau ${p.lvl}</h2><p class="st">Touche le nom d’une statistique pour savoir à quoi elle sert.</p><div class="grid">
    <button class="fst" data-a="fstat" data-k="dmg">Dégâts</button><b>${fmt(s.dmg[0]*(1+s.dmgPct/100))} à ${fmt(s.dmg[1]*(1+s.dmgPct/100))}</b><button class="fst" data-a="fstat" data-k="aps">Attaques par seconde</button><b>${s.aps.toFixed(2).replace('.',',')}</b>
    <button class="fst" data-a="fstat" data-k="crit">Critique</button><b>${s.crit} % · +${s.critDmg} %</b><button class="fst" data-a="fstat" data-k="spell">Dégâts des sorts</button><b>+${s.spell} %</b><button class="fst" data-a="fstat" data-k="atk">Dégâts des attaques</button><b>+${s.atk||0} %</b>
    <button class="fst" data-a="fstat" data-k="life">Vie</button><b>${fmt(p.maxHp)}</b><button class="fst" data-a="fstat" data-k="mana">Mana</button><b>${p.maxMp}</b><button class="fst" data-a="fstat" data-k="armor">Armure</button><b>${fmt(s.armorT)}</b><button class="fst" data-a="fstat" data-k="block">Blocage</button><b>${s.block} %</b>
    <button class="fst" data-a="fstat" data-k="leech">Vol de vie</button><b>${s.leech} %</b><button class="fst" data-a="fstat" data-k="move">Déplacement</button><b>+${s.move} %</b><button class="fst" data-a="fstat" data-k="mf">Découverte d’objets</button><b>+${s.mf} %</b>${['fire','cold','light','pois'].map(e=>{const v=s[EL[e].k]||0;return`<button class="fst" data-a="fstat" data-k="res" style="color:${EL[e].c}">Résistance ${EL[e].d}</button><b style="color:${v<0?'#ff6a5a':v>=RES_CAP?'#e8c46a':'#e2d6c0'}">${v} %</b>`;}).join('')}${resMalus()?`<button class="fst" data-a="fstat" data-k="res">Pénalité du monde</button><b style="color:#ff8a6a">−${resMalus()} %</b>`:''}<button class="fst" data-a="fstat" data-k="power">Puissance</button><b>${fmt(powerOf(s,p.lvl))}</b>
    <span>Or</span><b>${fmt(p.gold)}</b><span>Faille la plus haute</span><b>${S.riftMax}</b>${MATS.map(m=>`<span>${m.n}</span><b style="color:${m.c}">${fmt((p.mats||{})[m.k]||0)}</b>`).join('')}</div>`;}
  else if(tab==='regl'){h+=`<h2>Réglages</h2><div class="regl"><button class="min" data-a="mute">${p.mute?'🔇 Sons coupés':'🔊 Sons activés'}</button><button class="min" data-a="look">🧑 Apparence</button><button class="min" data-a="guide">📖 Guide</button><button class="min" data-a="backup">💾 Copie de secours</button><button class="min" data-a="news">📜 Nouveautés</button><button class="min" data-a="ambt">${p.amb===false?'🌫️ Ambiance coupée':'🌫️ Ambiance activée'}</button><button class="min" data-a="autopk">🎒 Ramassage auto des objets : ${p.autoPick?'oui':'non'}</button><button class="min" data-a="gfx">🎨 Graphismes : ${p.eco?'économie':p.gfx===1?'normaux':'hauts'}</button></div>`;}
  else if(tab==='hf'){
    {const H=S.hf||{},n=HF.filter(x=>H[x.id]).length;h+=`<h2>Hauts faits</h2><p class="st">${n} / ${HF.length}</p><div class="st" style="columns:2;column-gap:12px;margin-bottom:10px">${HF.map(x=>H[x.id]?`<div style="color:#e8c46a">✓ ${x.secret?'Clairière farfelue':x.n}<br><span style="color:#9a8a70">${x.d}</span></div>`:`<div style="color:#5a5040">· ${x.secret?'???':x.n}<br><span>${x.secret?'Secret':x.d}</span></div>`).join('')}</div>`;}}
  else if(tab==='histoire'){h+=histoireHTML();}
  else if(tab==='saison'){h+=seasonHTML();}
  else if(tab==='carnet'){
    {const P=S.pages||{},n=PAGES.filter((_,i)=>P[i]).length;h+=`<h2>Carnet</h2><p class="st">${n} pages sur ${PAGES.length}. On les trouve dans les coffres et sur les boss.</p><div>${PAGES.map((x,i)=>P[i]?`<button class="min" data-a="page" data-k="${i}">${i+1}. ${x.t}</button>`:`<button class="min" disabled style="opacity:.4">${i+1}. ???</button>`).join('')}</div>`;}}
  else if(tab==='best'){const B=S.best||{},ks=Object.keys(MT).filter(k=>MT[k].lore);const seen=ks.filter(k=>B[k]);
    h+=`<h2>Bestiaire</h2><p class="st">${seen.length} créatures connues sur ${ks.length}. À 100 abattues : +5 % de dégâts contre elles. À 1 000 : +10 %.</p>`;
    /* v6.15 : seules les bêtes déjà croisées sont listées ; le reste tient en une ligne */
    for(const k of seen){const n=B[k]||0;h+=`<div class="row"><div><div class="it" style="color:${n>=1000?'#ff9a3a':n>=100?'#f0d050':'#e2d6c0'}">${toneType(k)}</div><div class="st">${skinOf(k).lore||MT[k].lore}</div></div><div class="st">${fmt(n)}${n>=1000?' · +10 %':n>=100?' · +5 %':''}</div></div>`;}
    if(ks.length>seen.length)h+=`<p class="st" style="color:#6b604e">Encore ${ks.length-seen.length} créatures à découvrir. Chaque monde a ses propres familles : bêtes de la forêt, du désert, du volcan, de l’abîme, loups du givre…</p>`;}
  else if(tab==='traverses'){
    {const SD=S.q.side||{},rows=[];curWorld().acts.forEach((a,ai)=>{(SIDES[ai+1]||[]).forEach((_,k)=>{const sd=sideOf(ai+1,k);const st=SD[`a${ai+1}x${k}`]||0;rows.push(`<div class="row"><div><div class="it" style="color:${st>=2?'#7fd0ff':st?'#f0d050':'#6b604e'}">${st?sd.n:'Chemin inconnu'} <span class="st">(acte ${ai+1})</span></div><div class="st">${st?sd.intro+' Récompense : '+sd.rd:'Un chemin de traverse part du chemin principal de l’acte '+(ai+1)+'.'}</div></div><div class="st">${st>=2?'Accompli':st?'En cours':'?'}</div></div>`);});});
      h+=`<h3>Chemins de traverse : ${Object.values(SD).filter(v=>v>=2).length} / ${rows.length}</h3><p class="st">Facultatifs, mais payants. Leurs entrées sont marquées en bleu sur la mini-carte.</p>`+rows.join('');}}
  else if(tab==='journal'){
    h+=lootLogHTML();
    {const E_=S.evSeen||{},ks=evKeys();h+=`<h3>Événements découverts : ${ks.filter(k=>E_[k]).length} / ${ks.length}</h3><p class="st">${ks.map(k=>E_[k]?`<span style="color:#c080ff">✓ ${EVENTS[k].n}</span>${EVENTS[k].th?` <span style="color:#8a7a60">(${THEMES[EVENTS[k].th].n})</span>`:''} : ${EVENTS[k].d}`:EVENTS[k].th?`· ? <span style="color:#6b604e">(propre à ${THEMES[EVENTS[k].th].n})</span>`:'· ?').join('<br>')}</p>`;}
    {const T_=p.trophies||{},ks=Object.keys(UNIQUES);h+=`<h3>Trophées de boss : ${ks.filter(k=>T_[k]).length} / ${ks.length}</h3><p class="st">${ks.map(k=>T_[k]?`<span style="color:#ff9a3a">✓ ${UNIQUES[k].n}</span>`:`· ? <span style="color:#6b604e">(${monN(BOSSES[k].mon)})</span>`).join('<br>')}</p><p class="st">Chaque boss cache un objet unique, très rare. Il faut le refarmer pour l’avoir.</p>`;}
    h+=`<div class="row"><div><div class="it" style="color:${riftOpen()?'#d8a8ff':'#6b604e'}">Failles sans fin</div><div class="st">${riftOpen()?`Ouvre la pierre de faille au camp. Plus haute atteinte : ${S.riftMax}.`:'Se révèle après la mort de Varsha.'}</div></div></div>`;}
  else{
    const st=['Inconnue','En cours','À rendre','Terminée'];h+='<h2>Quêtes</h2>';
    for(const k in QUESTS){const s=S.q[k].s;h+=`<div class="row"><div><div class="it" style="color:${s===3?'#e2d6c0':s?'#f0d050':'#6b604e'}">${qt(k+'n',QUESTS[k].n)}</div><div class="st">${s?txt(QUESTS[k].d):'Pas encore révélée.'}</div></div><div class="st">${st[s]}</div></div>`;}
    {const M=mutation(S.mutT);h+=`<h3>Mutation de la semaine</h3><p class="st"><b style="color:#e06a2b">${M.n}</b> : ${M.d}</p>`;}}
  if(tab==='perso')h+=gameStatsHTML();
  const sc=panel.scrollTop;openPanel(h+'<div><button data-a="close">Fermer</button></div>');if(t)panel.scrollTop=0;else panel.scrollTop=sc;
}
function respecPrice(){return 50*p.lvl;}
let SELT=null;

/* v6.19 : synergies (comme dans les vieux jeux du genre). Chaque rang d’un talent « source » ajoute des dégâts au talent qu’il nourrit.
   On compte le rang réel (après rendements décroissants) et le total est plafonné à +100 % par talent. */
const SYN={
  fire:[['meteor',8],['embers',6]],nova:[['chain',6],['mind',4]],chain:[['nova',6],['combust',4]],meteor:[['fire',8],['embers',5]],embers:[['meteor',8],['fire',5]],cataclysm:[['meteor',5],['embers',5],['fire',3]],
  whirl:[['frenzy',6],['shock',5]],shock:[['whirl',6],['execute',4]],
  dagger:[['venom',6],['backstab',5]],backstab:[['dagger',8],['assassin',4]],
  ardente:[['salve',6],['faucon',5]],salve:[['ardente',6],['perfo',5]],tempete:[['salve',5],['ardente',5]],volley:[['salve',5],['perfo',4]],pin:[['salve',5],['faucon',4]],arain:[['ardente',5],['salve',4]],
  lance:[['faux',6],['chaines',4]],faux:[['lance',6],['chaines',4]],chaines:[['faux',5],['lance',4]],bond:[['shock',6],['whirl',4]],totem:[['fire',6],['meteor',4]]};
const SYN_CAP=100;let SYNM=1;
/* v6.45 : la puissance vient de l’équipement. Les compétences frappent un peu moins fort d’elles-mêmes ; les objets portent la différence. */
const SKILL_K=.88;
function synPct(id){const L=SYN[id];if(!L)return 0;let t=0;for(const[src,pc]of L){const l=skLvl(src);if(l>0)t+=pc*l;}return Math.min(SYN_CAP,t);}
function synMult(id){return 1+synPct(id)/100;}
function synFeeds(src){return Object.keys(SYN).filter(k=>SYN[k].some(x=>x[0]===src));}
function synHTML(id){const L=SYN[id],F=synFeeds(id);if(!L&&!F.length)return'';let h='<p class="lines"><b>Synergies :</b>';
  if(L){h+=`<br>Ce talent gagne des dégâts grâce à :`;for(const[src,pc]of L){const l=skLvl(src);h+=`<br>· ${SK[src].ic} <button class="fst" data-a="fiche" data-s="${src}">${SK[src].n}</button> : +${pc} % par rang${l>0?` <span style="color:#7fd08a">(actuellement +${fdec(pc*l)} %)</span>`:' <span class="st">(pas appris)</span>'}`;}
    h+=`<br><span style="color:#e8c46a">Total : +${fdec(synPct(id))} %</span> <span class="st">(plafond +${SYN_CAP} %)</span>`;}
  if(F.length)h+=`<br>Ce talent renforce : ${F.map(k=>`${SK[k].ic} <button class="fst" data-a="fiche" data-s="${k}">${SK[k].n}</button>`).join(', ')}.`;
  return h+'</p>';}
/* v6.18 : fiches. Une petite fenêtre à part (par-dessus le menu) qui explique un talent avec les vrais chiffres de ton héros,
   une statistique, ou un chapitre du guide. Les chiffres viennent des mêmes formules que le combat. */
const SKINFO={
  ruee:{ty:'Attaque',mult:l=>1.6+.16*(l-1),props:['Jusqu’à 6 cases dans la direction visée.','Frappe chaque ennemi traversé une fois, le bouscule 0,3 s (pas les boss).'],tip:'Pour entrer dans un groupe ou en sortir.'},
  fendoir:{ty:'Attaque',mult:l=>2+.2*(l-1),props:['Arc large devant toi, 2,4 cases.'],tip:'Le meilleur coup du guerrier contre un groupe serré.'},
  seisme:{ty:'Attaque',mult:l=>1.8+.18*(l-1),n:()=>3,props:['Trois ondes : 2, 3,3 puis 4,6 cases, à 0,35 s d’écart.','Chaque onde frappe une fois chaque ennemi dans son rayon.'],tip:'Reste au milieu : les trois ondes touchent les plus proches.'},
  coupb:{ty:'Attaque',mult:l=>1.8+.18*(l-1),props:['Vise l’ennemi le plus proche à 2,5 cases.'],tip:'Coupe l’élan d’un monstre dangereux.'},
  provoc:{ty:'Cri',props:['Rayon 7 cases.','Dure 6 s.'],tip:'Avant une grosse mêlée, ou pour protéger ton compagnon.'},
  marteau:{ty:'Attaque',mult:l=>3.3+.3*(l-1),props:['Tombe 0,35 s après, rayon 2 cases.'],tip:'Vise le milieu d’un groupe.'},
  flammes:{ty:'Sort',spell:1,mult:l=>(.7+.07*(l-1))/2,n:()=>8,props:['Ligne de 5 cases, large d’une case.','Brûle 8 fois en 4 s (la moitié des dégâts par seconde à chaque fois).'],tip:'Pose-la entre toi et ce qui fonce sur toi.'},
  flare:{ty:'Sort',spell:1,mult:l=>2.6+.26*(l-1),props:['Jaillit 0,5 s après, rayon 1,6 case.'],tip:'Vise un peu devant un monstre qui marche.'},
  inferno:{ty:'Sort',spell:1,mult:l=>.9+.09*(l-1),n:()=>8,props:['Huit boules de feu, une par direction.','Chacune explose comme une Boule de feu.'],tip:'Excellent quand on est encerclé.'},
  sombre:{ty:'Sort',spell:1,mult:l=>1.4+.14*(l-1),props:['Maudit la cible 3 s : +15 % de dégâts subis.'],tip:'Ouvre avec, puis frappe fort.'},
  toxin:{ty:'Sort',spell:1,mult:l=>(.6+.06*(l-1))/2,n:()=>10,props:['Rayon 2,2 cases, dure 5 s.','Frappe 10 fois (la moitié des dégâts par seconde à chaque fois).','Les ennemis dedans sont empoisonnés (bon avec Points vitaux).'],tip:'Pose-le là où ils vont venir.'},
  lames:{ty:'Attaque',mult:l=>.9+.09*(l-1),n:()=>12,props:['Douze dagues en cercle.','Chaque dague s’arrête au premier ennemi touché.'],tip:'Pour se dégager quand on est encerclé.'},
  fgivre:{ty:'Attaque',mult:l=>1.6+.16*(l-1),props:['Ralentit 2 s.','Il faut un arc.'],tip:'Pour garder les coureurs à distance.'},
  repli:{ty:'Attaque',mult:l=>1.5+.15*(l-1),props:['Recule de 4 cases (les murs t’arrêtent), puis tire vers la cible.','Il faut un arc.'],tip:'Quand une bête va mordre, recule et tire.'},
  fragment:{ty:'Attaque',mult:l=>.9+.09*(l-1),n:()=>5,props:['Cinq explosions autour de la cible, rayon 1,2 case.','Il faut un arc.'],tip:'Contre les groupes serrés.'},
  whirl:{ty:'Attaque',mult:l=>1.5+.15*(l-1),props:['Touche tous les ennemis autour de toi (rayon 2,7 cases).','Les murs protègent les ennemis derrière.'],tip:'Fonce au milieu d’un groupe, puis tourne.'},
  cry:{ty:'Cri',props:['Dure 8 s.','Augmente tes dégâts ET ton armure.'],tip:'Lance-le avant un boss ou un gros groupe.'},
  shock:{ty:'Attaque',mult:l=>2.6+.26*(l-1),props:['Zone de 2,8 cases devant toi.','Étourdit 0,6 s (pas les boss).'],tip:'Parfait pour casser une charge.'},
  avatar:{ty:'Ultime',props:['Dure 10 s.','+30 % de vitesse d’attaque en plus des dégâts.'],tip:'Garde-le pour les boss.'},
  fire:{ty:'Sort',spell:true,mult:l=>1.5+.15*(l-1),n:()=>p.st.legs.fire3?3:1,props:['Projectile rapide, portée d’environ 12 cases.','Explose au contact : plein dégâts sur la cible, 60 % autour (rayon 1,3 case).','S’arrête sur les murs.'],tip:'Vise un groupe : l’explosion compte double.'},
  nova:{ty:'Sort',spell:true,mult:l=>(1.15+.11*(l-1))*(p.st.legs.freeNova?1.4:1),props:['Anneau qui part de toi jusqu’à 3,3 cases.','Touche chaque ennemi une seule fois, quand l’anneau passe.','Ralentit 2,5 s.','Les murs l’arrêtent.'],tip:'Entoure-toi d’ennemis avant de la lancer.'},
  chain:{ty:'Sort',spell:true,mult:l=>1.15+.11*(l-1),n:l=>3+Math.min(12,Math.floor(l/3))+(p.st.legs.conduit?4:0),props:['Saute d’ennemi en ennemi (5 cases au plus entre deux).','Sur une cible seule, rebondit à moitié dégâts.'],tip:'Meilleur quand les ennemis sont nombreux et serrés.'},
  meteor:{ty:'Sort',spell:true,mult:l=>3.2+.28*(l-1),props:['Tombe là où tu vises, 9 cases au plus.','Zone de 2,4 cases, arrive après 0,8 s.'],tip:'Vise là où les ennemis seront, pas là où ils sont.'},
  embers:{ty:'Sort',spell:true,mult:l=>1.4+.14*(l-1),n:()=>7,props:['7 petits impacts autour de la cible, l’un après l’autre.','Chaque impact : zone de 1,5 case.'],tip:'Excellent sur un boss qui bouge peu.'},
  cataclysm:{ty:'Ultime',spell:true,mult:l=>7+.7*(l-1),props:['Touche tout dans 9 cases autour de toi, même derrière les murs.'],tip:'Pour vider l’écran d’un coup.'},
  aegis:{ty:'Ultime',props:['Invulnérable pendant la durée.','Soigne 40 % de ta vie tout de suite.'],tip:'Ton bouton « sauve-moi ».'},
  dagger:{ty:'Attaque',mult:l=>.9+.09*(l-1),n:()=>3,props:['Trois dagues en éventail, portée d’environ 8 cases.','Chaque dague s’arrête au premier ennemi.'],tip:'De près, les trois dagues touchent la même cible.'},
  smoke:{ty:'Ruse',props:['Les monstres (pas les boss) te perdent de vue.','+50 % de chance critique pendant la durée.'],tip:'Pour fuir, ou pour préparer une Lame furtive.'},
  backstab:{ty:'Attaque',mult:l=>3+.3*(l-1),props:['Tu apparais derrière la cible (7 cases au plus) et tu frappes.'],tip:'Combine avec Voile de fumée pour un critique presque sûr.'},
  nightfall:{ty:'Ultime',props:['Tous tes coups sont critiques et empoisonnent.'],tip:'Monte les dégâts critiques pour en profiter.'},
  ardente:{ty:'Attaque à l’arc',mult:l=>2+.2*(l-1),props:['Flèche qui explose à l’impact (rayon 1,75 case, 90 % des dégâts autour).','Il faut un arc.'],tip:'Compte comme une attaque : les bonus « dégâts des attaques » la renforcent.'},
  salve:{ty:'Attaque à l’arc',mult:l=>1.1+.11*(l-1),n:()=>3,props:['Trois flèches de suite sur la même cible.','Il faut un arc.'],tip:'Pour les cibles seules et coriaces.'},
  tempete:{ty:'Ultime',mult:l=>.7+.07*(l-1),props:['Une flèche part toute seule vers l’ennemi le plus proche, 4 fois par seconde.','Il faut un arc.'],tip:'Continue de bouger : elle tire pour toi.'},
  volley:{ty:'Attaque à l’arc',mult:l=>.8+.08*(l-1),n:()=>5,props:['Cinq flèches en éventail, qui traversent.','Il faut un arc.'],tip:'Contre les groupes qui arrivent de face.'},
  pin:{ty:'Attaque à l’arc',mult:l=>2.2+.22*(l-1),props:['Cloue la cible sur place (pas les boss).','Il faut un arc.'],tip:'Pour arrêter un monstre rapide.'},
  arain:{ty:'Attaque à l’arc',mult:l=>.9+.09*(l-1),n:()=>10,props:['Dix flèches tombent autour de la cible, l’une après l’autre.','Il faut un arc.'],tip:'Sur un groupe immobile.'},
  lance:{ty:'Sort',spell:true,mult:l=>1.3+.13*(l-1),n:()=>p.st.legs.osdague?3:1,props:['Traverse tous les ennemis en ligne, portée d’environ 12 cases.'],tip:'Aligne les ennemis dans un couloir.'},
  bond:{ty:'Attaque',mult:l=>1.8+.18*(l-1),props:['Tu sautes jusqu’à 6 cases, puis tu frappes autour (2,2 cases).','Étourdit 0,5 s (pas les boss).'],tip:'Pour entrer ou sortir d’un combat.'},
  totem:{ty:'Sort',spell:true,mult:l=>.6+.06*(l-1),props:['Le totem tire une boule de feu toutes les 0,5 s pendant 8 s (environ 16 tirs).','Vise l’ennemi le plus proche, 7 cases au plus.'],tip:'Pose-le puis recule : il tient la ligne.'},
  veil:{ty:'Déplacement',props:['Trois charges.','Ne passe pas à travers les murs fermés.'],tip:'Pour éviter un coup annoncé au sol.'},
  faux:{ty:'Sort',spell:true,mult:l=>2+.2*(l-1),props:['Grand arc devant toi (3,2 cases).'],tip:'Reste face au groupe.'},
  chaines:{ty:'Sort',spell:true,mult:l=>.8+.08*(l-1),props:['Attire les ennemis dans 6 cases et les retient.','Pas les boss.'],tip:'Rassemble, puis enchaîne avec une Nova ou un Tourbillon.'},
  curse:{ty:'Malédiction',props:['Zone de 3 cases, là où tu vises (8 cases au plus).','Dure 6 s.'],tip:'Lance-la avant tes gros coups.'}
};
/* Ce qui améliore chaque talent : passifs, pouvoirs d’objets, ensembles. (Les synergies arrivent en 6.19 et les pouvoirs de build en 6.20.) */
const SKLEG={fire:['fire3','set_penitent4'],nova:['freeNova','hiver'],chain:['conduit','echo'],meteor:['comete','crater'],whirl:['whirl'],cry:['warlord'],lance:['osdague'],ardente:[],salve:[],volley:['pierce'],pin:['pierce']};
function legName(k){const L=LEGS.find(x=>x.id===k);if(L)return{n:L.n,p:L.p};if(k.startsWith('set_')){const sid=k.slice(4,-1),nb=k.slice(-1),S_=SETS[sid];return S_?{n:S_.n+' ('+nb+' pièces)',p:S_['b'+nb]}:null;}const U=Object.values(UNIQUES).find(u=>u.leg===k);return U?{n:U.n,p:U.p}:null;}
function skHit(id){const I=SKINFO[id];if(!I||!I.mult)return null;const l=Math.max(1,skLvl(id)||1),s=p.st,f=(1+s.dmgPct/100)*I.mult(l)*synMult(id)*powMult(id)*SKILL_K*(I.spell?1+s.spell/100:1+(s.atk||0)/100);
  return{lo:Math.max(1,Math.round(s.dmg[0]*f)),hi:Math.max(1,Math.round(s.dmg[1]*f)),crit:s.crit,cdm:s.critDmg,n:I.n?I.n(l):1,mult:I.mult(l)*synMult(id)*powMult(id)*SKILL_K};}
function fdec(v,d){return String(Math.round(v*Math.pow(10,d||1))/Math.pow(10,d||1)).replace('.',',');}
let FICHE=null;
function ficheOpen(h){const F=document.getElementById('fiche');if(!F)return;F.innerHTML='<button class="xclose" data-a="fclose" aria-label="Fermer">✕</button>'+fixN(h);F.classList.remove('hidden');F.scrollTop=0;FICHE=true;if(S)S.paused=true;}
function ficheClose(){const F=document.getElementById('fiche');if(F)F.classList.add('hidden');FICHE=null;if(S)S.paused=!panel.classList.contains('hidden');}
function skFicheHTML(id){const sk=SK[id];if(!sk)return'';const I=SKINFO[id]||{},r=p.sk[id]||0,raw=skRaw(id),l=skLvl(id),ty=sk.pas?'Passif':sk.ult?'Ultime':(I.ty||'Compétence');
  let h=`<h2>${sk.ic} ${sk.n}</h2><p class="st">${ty}${sk.gem?' · pierre de compétence':sk.br>=0?' · '+BR[sk.br].n:''}${sk.bow?' · il faut un arc':''}</p>`+barRowHTML(id);
  h+=`<div class="fgrid"><span>Rang</span><b>${fmt(raw)}${raw&&l<raw-.01?` <span class="st">(agit comme ${fdec(l)})</span>`:''}</b>`;
  if(!sk.pas){const c_=powCost(id,sk.cost||0),d_=sk.cd?powCd(id,sk.cd):0;h+=`<span>Coût</span><b>${c_?c_+' mana':'aucun'}</b><span>Recharge</span><b>${d_?fdec(d_)+' s':'aucune'}</b>`;}
  const H=raw?skHit(id):null;if(H){h+=`<span>Dégâts par coup</span><b>${fmt(H.lo)} à ${fmt(H.hi)}</b>${H.n>1?`<span>Coups par lancer</span><b>${H.n}</b>`:''}<span>Critique</span><b>${H.crit} % de chances, ×${fdec(1+H.cdm/100,2)}</b><span>Multiplicateur</span><b>${fmt(Math.round(H.mult*100))} % ${I.spell?'(sort)':'(attaque)'}${synPct(id)>0||powMult(id)>1?' <span class="st">synergies et pouvoirs compris</span>':''}</b>`;}
  h+='</div>';
  h+=`<p class="lines"><b>Effet :</b> ${raw?sk.d(l):sk.d(1)}${raw?'':' <span class="st">(au rang 1)</span>'}</p>`;
  if(I.props&&I.props.length)h+=`<p class="lines"><b>Comment ça marche :</b><br>${I.props.map(x=>'· '+x).join('<br>')}</p>`;
  if(!sk.gem)h+=`<p class="lines st">Rang suivant : ${sk.d(effL(raw+1))}</p>`;
  if(typeof synHTML==='function')h+=synHTML(id);
  /* ce qui l’améliore */
  const up=[];if(I.mult){up.push(I.spell?'Dégâts des sorts (Combustion, Savoir infini, objets « dégâts des sorts »).':'Dégâts de l’arme et « dégâts des attaques » (Maîtrise des armes, Fureur éternelle, Archer sans fin, objets « dégâts des attaques »).');up.push('Chance et dégâts critiques (Assassin, Combustion, objets).');}
  if(typeof powHTML==='function'){const ph=powHTML(id);if(ph)up.push(ph);}
  const sups=Object.keys(SUPPORTS).filter(k=>{const s_=SUPPORTS[k];return s_.for?s_.for.includes(id):s_.dmg?DMGSK.includes(id):s_.noUlt?!sk.ult:!sk.pas;});
  if(!sk.pas&&sups.length)up.push('Pierres de soutien possibles : '+sups.map(k=>SUPPORTS[k].ic+' '+SUPPORTS[k].n).join(', ')+'.');
  if(up.length)h+=`<p class="lines"><b>Ce qui l’améliore :</b><br>${up.map(x=>'· '+x).join('<br>')}</p>`;
  if(I.tip)h+=`<p class="lines" style="color:#c8b890">💡 ${I.tip}</p>`;
  h+=`<p class="st">Plus un talent monte, moins chaque rang compte : en entier jusqu’au rang 5, 60 % jusqu’au 15, 35 % ensuite.</p>`;
  return h;}
function skFiche(id){ficheOpen(skFicheHTML(id));}
/* v6.52 : les cases de la barre, à toucher pour y placer le sort. Même rangée dans la fiche du talent et dans la fiche complète. */
function barRowHTML(id){const sk=SK[id];if(!sk||sk.pas||!(p.sk[id]||0))return'';return`<div class="barrow"><span>Barre :</span>${Array.from({length:barSize()},(_,k)=>k).map(k=>{const o=p.bar[k],os=o&&SK[o];return`<button class="${o===id?'on':''}" data-a="bar" data-k="${k}" data-s="${id}" aria-label="Case ${k+1}">${k+1}<small>${os?os.ic:'·'}</small></button>`;}).join('')}</div>`;}
function barPlace(k,id){if(!SK[id]||SK[id].pas||!(p.sk[id]||0)||!(k>=0&&k<barSize()))return false;const j=p.bar.indexOf(id);if(j>=0)p.bar[j]=p.bar[k];p.bar[k]=id;save();return true;}
/* Statistiques expliquées */
const STATINFO={
  dmg:['Dégâts','Ce que fait un coup normal, arme comprise, avant critique. Tous les talents qui disent « % des dégâts » partent de là.'],
  aps:['Attaques par seconde','Vitesse de tes coups de base. Frénésie, Main sûre et certains objets la montent ; 6 par seconde au plus.'],
  crit:['Critique','Chance qu’un coup fasse un critique, et combien il fait en plus. Un critique est écrit en jaune.'],
  spell:['Dégâts des sorts','Bonus qui s’ajoute aux sorts seulement (Boule de feu, Nova, Chaîne d’éclairs, Météore…), pas aux attaques d’arme.'],
  atk:['Dégâts des attaques','Le pendant des sorts pour tout le reste : coups d’arme, Tourbillon, Onde de choc, flèches (Flèche ardente et Pluie de flèches comprises). Maîtrise des armes, Fureur éternelle et les armes en donnent.'],
  life:['Vie','Quand elle tombe à zéro, tu meurs. Les fioles en rendent une partie ; Régénération en rend chaque seconde.'],
  mana:['Mana','Ce que coûtent les compétences. Elle remonte seule ; Esprit vif la monte.'],
  armor:['Armure','Réduit les dégâts des coups reçus. Plus l’ennemi est haut niveau, plus il en faut pour le même effet.'],
  block:['Blocage','Chance d’annuler un coup avec un bouclier. 60 % au plus.'],
  leech:['Vol de vie','Une partie des dégâts infligés revient en vie (moitié moins avec les sorts). 8 % de ta vie au plus par coup.'],
  move:['Déplacement','Vitesse de marche en plus. Les bottes en donnent souvent.'],
  mf:['Découverte d’objets','Augmente les chances que les objets soient magiques, rares ou légendaires. Rendements décroissants : chaque point compte un peu moins.'],
  res:['Résistances','Réduisent les dégâts de feu, de froid, de foudre et de poison, après l’armure. 75 % au plus. À partir du monde 2, chaque monde retire 8 % à toutes tes résistances (40 % au plus) : cherche des objets qui en donnent, ou achète un anneau chez Bram. Feu : une partie brûle encore 2 secondes. Froid : ralentit. Foudre : coups très inégaux. Poison : la plus grande partie arrive lentement, sur 4 secondes.'],
  power:['Puissance','Un seul nombre pour comparer ton héros d’un moment à l’autre : dégâts, vie, armure et critique mélangés.']};
function statFiche(k){const S_=STATINFO[k];if(!S_)return;ficheOpen(`<h2>${S_[0]}</h2><p class="lines">${S_[1]}</p>`);}
/* Guide en chapitres */
const GUIDE2=[
  {t:'Bien commencer',x:'Touche le sol pour marcher, un ennemi pour frapper. Les boutons de compétence visent l’ennemi le plus proche. Garde le doigt sur un bouton : son nom et son effet ; garde-le encore : sa fiche complète. Chaque niveau donne un point de talent (deux tous les 5 niveaux).'},
  {t:'Combat',x:'Les cercles au sol annoncent les gros coups : sors-en. Les champions (bleus) ont des pouvoirs, écrits sous leur nom. Les murs bloquent les coups et les sorts, les tiens comme ceux des monstres. Une fiole rend une partie de ta vie.'},
  {t:'Talents et synergies',x:'Cinq branches. Un talent monte d’un rang par point ; après le rang 5, chaque rang compte moins. Les synergies : certains talents rendent un autre talent plus fort (sa fiche dit lesquels et combien). Monter deux ou trois talents qui se renforcent vaut souvent mieux que tout mettre dans un seul.'},
  {t:'Objets',x:'Normal (blanc), magique (bleu), rare (jaune), légendaire (orange, avec un pouvoir), ensemble (vert : bonus à 2, 4 et 6 pièces portées ; le bonus à 6 pièces multiplie une famille de talents). Beaucoup de légendaires changent un talent précis : la fiche de l’objet dit lequel, et la fiche du talent liste ses pouvoirs. Double-touche un objet pour l’équiper.'},
  {t:'Orbes et lapidaire',x:'La lapidaire, au camp, pose les orbes : braise (normal vers magique), écume (relance un magique), cendre (magique vers rare), tumulte (relance un rare), aube (ajoute un bonus), vide (en retire un), oubli (retour à normal), juste poids (relance les valeurs), serment (scelle un bonus), élévation (remonte l’objet à ton niveau).'},
  {t:'La table de jeu',x:'Au camp, quatre joueurs jouent aux cartes près du mur, à gauche. Chacun change le ton du texte des ennemis : Brasquin le démon (noms et menaces d’une violence démoniaque), Aubelle l’ange (dévot exalté : rien de clair, tout de sacré), Pirouette le clown (blagues bêtes et un peu vulgaires), et Maître Fendric, qui remet tout comme avant. Les noms des boss ne changent jamais.'},{t:'Ramasser le butin',x:'L’or, les fioles, les orbes et les pierres se ramassent seuls. Les objets, eux, se prennent au choix : touche le nom d’un objet au sol, ou ouvre la petite fenêtre « Au sol », au-dessus de la bulle de mana, et touche l’objet voulu. Pour tout ramasser en passant comme avant : Menu, Réglages, « Ramassage auto des objets ».'},{t:'Résistances',x:'Le feu, le froid, la foudre et le poison passent par ton armure, puis par ta résistance (75 % au plus). Chaque monde après le premier retire 8 % à toutes tes résistances : vérifie-les dans Menu, Stats, et cherche les bonus de résistance sur tes objets. Bram vend des anneaux de résistance. Feu : brûle encore un peu. Froid : ralentit. Foudre : coups inégaux. Poison : arrive lentement. Les champions Électriques et Venimeux frappent de foudre et de poison.'},{t:'Revenir ou refaire',x:'Une zone que tu quittes reste telle quelle 15 minutes : monstres tués, coffres ouverts, objets au sol. Ensuite elle se remet à neuf toute seule. Pour la refaire tout de suite : « Neuve » au point de passage, ou « Remettre cette zone à neuf » sur la grande carte. Le porteur de saison n’y revient qu’une fois par jour.'},{t:'Build et butin',x:'Au camp, le mannequin d’entraînement ouvre une petite cour où tu mesures tes dégâts par seconde. Talents : trois préréglages à enregistrer partout et à charger gratuitement au camp ; chaque talent montre ce que t’apporterait un point de plus. Le colporteur garde les 10 derniers objets vendus pour te les revendre au même prix. Découvertes : journal de tes 20 derniers objets rares et mieux.'},{t:'Confort',x:'Touche la minicarte pour la grande carte. Tu reprends ta partie dans la zone où tu l’as quittée, et ton portail reste ouvert. À ta mort, tu peux revenir par le portail. Une flèche montre la sortie quand la zone est purifiée, et l’acolyte quand il est loin. Au coffre, ✎ Renommer donne un nom à l’onglet ouvert.'},{t:'Saisons',x:'Une saison dure quatre mois. Son porteur erre dans certaines zones d’acte (gros point coloré sur la minicarte) : abats-le pour sa monnaie. Le journal de saison (Menu, Saison) donne 8 objectifs ; fini, il t’offre la cape de la saison pour toujours. Le comptoir échange la monnaie contre des orbes, des objets rares ou légendaires.'},{t:'Zones purifiées',x:'Abats 80 % des monstres d’une zone d’acte pour la purifier : butin rare, deux orbes, de l’or et un peu d’expérience, une fois par zone et par monde. Le pourcentage s’affiche sous le nom de la zone ; passé 60 %, une flèche montre le monstre restant le plus proche. Toutes les zones d’un acte purifiées : un objet légendaire et trois orbes. Rien ne t’oblige à le faire : foncer vers le boss reste possible.'},{t:'Démolisseur et matériaux',x:'Il casse les objets en matériaux et corrompt (un essai, gros gain possible, une chance sur dix de tout perdre). Les matériaux s’échangent contre des orbes chez la lapidaire, qui relance, ajoute des bonus et monte la rareté. Verrouille ce que tu veux garder.'},
  {t:'Camp et PNJ',x:'Colporteur : fioles et parchemins. Forgeronne : remet tes objets à ton niveau. Joueuse : objets à l’aveugle. Recruteur : compagnons. Lapidaire : orbes. Démolisseur : matériaux. Autel des empreintes : extrait le pouvoir d’un légendaire (l’objet disparaît) et te le prête ; trois pouvoirs actifs à la fois, à changer quand tu veux. Le tableau : mutation de la semaine et contrats.'},
  {t:'Actes, traverses et mondes',x:'Chaque acte a 8 zones avant l’antre et 4 chemins de traverse (entrées bleues sur la mini-carte), facultatifs mais payants. Après Valgris, accepte son défi pour passer au monde suivant. À chaque nouvelle partie, les mondes sont tirés au hasard parmi onze.'},
  {t:'Failles et épreuves',x:'La pierre de faille ouvre des failles de plus en plus dures. Chaque nouvelle faille vaincue donne un point de talent. Les cartes d’épreuve s’y ouvrent aussi : plus dures et plus payantes.'},
  {t:'Sauvegarde',x:'Le jeu sauve tout seul. Réglages, Copie de secours : un texte à garder ailleurs, et la partie d’avant si tu as recommencé.'}];
function guidePanel(k){const G=GUIDE2;k=k==null?0:+k;openPanel(`<h2>Guide</h2><div class="tabs">${G.map((g,i)=>`<button class="tab${i===k?' on':''}" data-a="gch" data-k="${i}">${g.t}</button>`).join('')}</div><p class="lines">${G[k].x}</p><button data-a="close">Fermer</button>`);}

function talentPanel(){if(tab!=='pierres')tab='comp';let h=tabs();const gemTab=tab==='pierres';if(!gemTab)h+=buildsHTML();
  if(!gemTab){
  h+=`<h2>Talents</h2><p class="st">${p.cls?`Classe : <b>${CLS[p.cls].ic} ${CLS[p.cls].n}</b> (talents de ${CLS[p.cls].br.map(b=>BR[b].n).join(' et ')} seulement, 1 point par rang).`:'Héros libre (sans classe). <button class="min" data-a="clspick">Choisir une classe</button>'} Points : <b>${fmt(p.pts)}</b>. Un point par niveau, un de plus tous les 5 niveaux, et un par nouvelle faille vaincue. Chaque palier demande un niveau et des points déjà placés dans sa branche. Les talents les plus forts sont au bas de l’arbre.</p><div class="tree${myBranches().length>3?' b4 b5':''}" style="grid-template-columns:repeat(${myBranches().length},1fr)">`;
  myBranches().forEach(bi=>{const b=BR[bi];h+=`<div class="brn"><div class="brh" style="color:${b.c}">${b.n}<span class="st">${fmt(branchPts(bi))} pts</span></div>`;
    for(let t=0;t<TL.length;t++){const ids=Object.keys(SK).filter(k=>SK[k].br===bi&&SK[k].ti===t);const open=p.lvl>=TL[t]&&branchPts(bi)>=TP[t];
      h+=`<div class="tier${open?'':' lockt'}">${open?'':`<span class="req">niv. ${TL[t]} · ${TP[t]} pts</span>`}`;
      for(const id of ids){const sk=SK[id],r=p.sk[id]||0;h+=`<button class="tal${r?' has':''}${sk.ult?' ult':''}${sk.inf?' inf':''}${SELT===id?' on':''}${canRank(id)?' can':''}" data-a="tal" data-s="${id}" aria-label="${sk.n}"><span>${sk.ic}</span>${r?`<i>${fmt(r)}</i>`:''}</button>`;}
      h+='</div>';}
    h+='</div>';});
  h+='</div>';
  }
  const id=SELT&&SK[SELT]&&(!!SK[SELT].gem===gemTab)?SELT:null;if(id){const sk=SK[id],r=p.sk[id]||0,l=skLvl(id),op=unlocked(id);
    h+=`<div class="selbox"><button class="selx" data-a="tselx" aria-label="Fermer">✕</button><div class="it" style="color:${sk.gem?'#60e0c0':BR[sk.br].c}">${sk.ic} ${sk.n}${sk.ult?' <span class="st">· ultime</span>':''}${sk.inf?' <span class="st">· sans fin</span>':''}</div>${barRowHTML(id)}
    <div class="st">${sk.gem?(r?'Pierre de compétence : un rang de plus par pierre en double.':'Pas encore trouvée. Elle tombe des champions, des boss et des gardiens de faille.'):`${BR[sk.br].n}, palier ${sk.ti+1} : niveau ${Math.max(TL[sk.ti],sk.minL||0)} et ${TP[sk.ti]} points dans la branche. ${op?'':'<b style="color:#d07060">Verrouillé.</b>'}`}</div>
    <p class="lines">Rang ${fmt(r)}${skRaw(id)>r?` (+${skRaw(id)-r})`:''}${r&&l<skRaw(id)-.01?` · agit comme le rang ${String(Math.round(l*10)/10).replace('.',',')}`:''} : ${r?sk.d(l):'non appris'}<br><span class="st">Rang suivant : ${sk.d(effL(skRaw(id)+1))}</span><br><span class="st">Plus un talent monte, moins chaque rang compte : en entier jusqu’au rang 5, 60 % jusqu’au 15, 35 % ensuite.</span>${sk.cost?`<br><span class="st">Coût : ${sk.cost} mana${sk.cd?`, recharge ${String(sk.cd).replace('.',',')} s`:''}.</span>`:''}</p>${SYN[id]&&synPct(id)>0?`<p class="st" style="color:#7fd08a">Synergies : +${fdec(synPct(id))} % de dégâts</p>`:''}${synFeeds(id).length?`<p class="st">Renforce : ${synFeeds(id).map(k=>SK[k].n).join(', ')}</p>`:''}<button class="min" data-a="fiche" data-s="${id}">📜 Fiche complète</button>
    ${talPreview(id)}<div>${canRank(id)?`<button data-a="rank" data-s="${id}" data-n="1">+1</button>${p.pts>=10?`<button data-a="rank" data-s="${id}" data-n="10">+10</button>`:''}${p.pts>=100?`<button data-a="rank" data-s="${id}" data-n="100">+100</button>`:''}${p.pts>1?`<button data-a="rank" data-s="${id}" data-n="max">Tout (${fmt(p.pts)})</button>`:''}`:''}</div>
    ${!sk.pas&&r?`<div class="st" style="margin-top:6px">Soutien : ${p.sup&&p.sup[id]?`<b style="color:#e0a0ff">${SUPPORTS[p.sup[id]].ic} ${SUPPORTS[p.sup[id]].n}</b> <button class="min" data-a="unsup" data-s="${id}">Retirer</button>`:'aucun'} ${Object.keys(SUPPORTS).filter(k=>supFits(k,id)&&supFree(k)>0&&!(p.sup&&p.sup[id]===k)).map(k=>`<button class="min" data-a="setsup" data-s="${id}" data-k="${k}" title="${SUPPORTS[k].d}">${SUPPORTS[k].ic} ${SUPPORTS[k].n}</button>`).join('')}</div>`:''}
    </div>`;}
  else h+=`<div class="selbox"><p class="st">Touche un talent pour le voir et le monter. Pour placer un sort dans la barre : touche-le, puis un numéro.</p><p class="st">Ta barre : ${Array.from({length:barSize()},(_,k)=>{const o=p.bar[k];return`${k+1} ${o&&SK[o]?SK[o].ic+' '+SK[o].n:'vide'}`;}).join(' · ')}</p></div>`;

  if(gemTab){
  {const I_=p.supInv||{},ks=Object.keys(SUPPORTS).filter(k=>I_[k]);if(ks.length)h+=`<h3>Pierres de soutien</h3><p class="st">${ks.map(k=>`${SUPPORTS[k].ic} ${SUPPORTS[k].n} : ${supFree(k)} libre${supFree(k)>1?'s':''} sur ${I_[k]}`).join('<br>')}<br>Touche une compétence active pour en sertir une.</p>`;}
  {const G_=Object.keys(SK).filter(k=>SK[k].gem);h+=`<h3>Pierres de compétence</h3><p class="st">Trouvées en butin. Chaque pierre en double monte la compétence d’un rang. La réinitialisation les garde.</p><div class="tree" style="grid-template-columns:repeat(4,1fr)">`;
    for(const id of G_){const sk=SK[id],r=p.sk[id]||0;h+=`<button class="tal${r?' has':''}${SELT===id?' on':''}" data-a="tal" data-s="${id}" aria-label="${sk.n}" style="${r?'':'opacity:.35'}"><span>${sk.ic}</span>${r?`<i>${fmt(r)}</i>`:''}</button>`;}h+='</div>';}
  }
  else h+=`<button class="min" data-a="respec">Tout réinitialiser (${fmt(respecPrice())} or)</button>`;
  h+=`<div><button data-a="close">Fermer</button></div>`;
  const sc=panel.scrollTop;openPanel(h);panel.scrollTop=sc;}
function wpMenu(){
  let h='<h2>Point de passage</h2><p class="st">Voyage vers un point déjà activé.</p>';
  const list=['town'];curWorld().acts.forEach((a,ai)=>{if(!actOpen(ai+1))return;for(const id of actZones(ai+1)){const d=zoneDef(id);if(d&&d.wp)list.push(id);}});
  for(const id of list){const on=S.wps[id],kz=S.zones[id],kl=kz&&id!==S.cur.id&&zoneResettable(id)?keptLeft(kz):null;h+=`<div class="row"><div><div class="it" style="color:${on?'#e2d6c0':'#5a5040'}">${zoneName(id)}</div>${kl!=null?`<div class="st">${kl>0?`Gardée encore ${Math.max(1,Math.ceil(kl/60000))} min`:'Sera neuve à ton retour'}</div>`:''}</div><div class="bt">${on&&id!==S.cur.id?`<button class="min" data-a="wp" data-z="${id}">Voyager</button>${kz&&zoneResettable(id)?`<button class="min" data-a="wpnew" data-z="${id}">Neuve</button>`:''}`:id===S.cur.id?'<span class="st">Ici</span>':'<span class="st">Inactif</span>'}</div></div>`;}
  h+='<p class="st">Une zone quittée reste telle quelle 15 minutes, puis se remet à neuf. « Neuve » la refait tout de suite (nouvelle carte, nouveaux monstres).</p>';
  openPanel(h+'<div><button data-a="close">Fermer</button></div>');
}
function riftMenu(){
  const n=S.riftSel,ml=riftDef(n).lvl,cur=S.zones.rift&&!S.zones.rift.done;
  let h=`<h2>Pierre de faille</h2><p class="st">Chaque faille vaincue en ouvre une plus profonde. Les monstres et le butin y deviennent toujours plus forts.</p>
  <div class="riftsel"><button data-a="rs" data-d="-10">−10</button><button data-a="rs" data-d="-1">−</button><b>Niveau ${n}</b><button data-a="rs" data-d="1">+</button><button data-a="rs" data-d="10">+10</button></div>
  <p class="st">Monstres de niveau ${ml}. Ton niveau : ${p.lvl}. Plus haute ouverte : ${S.riftMax}.${S.rec[n]?` Record : ${fmtT(S.rec[n])}.`:''}</p>
  <button data-a="rift">Ouvrir la faille ${n}</button>${cur?`<button data-a="riftback">Reprendre la faille ${S.zones.rift.def.rift}</button>`:''}`;
  {const C=p.cards||[];h+=`<h3>Cartes d’épreuve (${C.length} / ${CARD_MAX})</h3>`;if(!C.length)h+='<p class="st">Aucune carte. Elles tombent des champions, des boss et des gardiens de faille.</p>';
    C.forEach((c,i)=>{h+=`<div class="row"><div><div class="it" style="color:#d8a8ff">${TRIALS[c.mode].n} · niveau ${c.lvl}</div><div class="st">${cardMods(c)}. ${TRIALS[c.mode].d}</div></div><div class="bt"><button class="min" data-a="trial" data-i="${i}">Ouvrir</button><button class="min" data-a="trialdrop" data-i="${i}">Jeter</button></div></div>`;});}
  if((S.worldMax||1)>1){h+=`<h3>Mondes</h3><p class="st">Tu es dans le monde ${S.world} : ${worldName(S.world)}. Le butin d’un monde reste à son niveau.</p>`;
    for(let w=1;w<=S.worldMax;w++)if(WORLDS[w]&&w!==S.world)h+=`<button class="min" data-a="world" data-w="${w}">Monde ${w} : ${worldName(w)}</button>`;}
  openPanel(h+'<div><button data-a="close">Fermer</button></div>');
}
panel.addEventListener('click',e=>{const b=e.target.closest('button');if(b)doAct(b.dataset.a,b.dataset);});
document.getElementById('ground').addEventListener('click',e=>{e.stopPropagation();const b=e.target.closest('button');if(b)doAct(b.dataset.a,b.dataset);});
document.getElementById('fiche').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.a==='fclose'){ficheClose();return;}if(b.dataset.a==='fiche'){skFiche(b.dataset.s);return;}if(b.dataset.a==='bar'){const id=b.dataset.s;if(barPlace(+b.dataset.k,id)){const F=document.getElementById('fiche'),sc=F.scrollTop;skFiche(id);F.scrollTop=sc;if(!panel.classList.contains('hidden')&&(tab==='comp'||tab==='pierres')&&panel.querySelector('.tree'))talentPanel();}return;}});
function doAct(a,ds){const i=+ds.i;
  if(a==='close')closePanel();
  else if(a==='tone'){if(TONES[ds.k]){S.tone=ds.k;save();toast(TONES[ds.k].who+' : '+TONES[ds.k].n);tableDialog();}}
  else if(a==='tselx'){SELT=null;talentPanel();}
  else if(a==='iselx'){SEL=null;invPanel();}
  else if(a==='autopk'){p.autoPick=!p.autoPick;save();menuPanel('regl');}
  else if(a==='gopen'){S.gOpen=!S.gOpen;S.gSig='';groundUI(true);}
  else if(a==='gtake'){const o=(S.gList||[])[+ds.i];if(o&&S.cur.items.includes(o)){o.forced=true;moveTo(o.x,o.y);}S.gOpen=false;S.gSig='';groundUI(true);}
  else if(a==='tab')menuPanel(ds.t);
  else if(a==='vpas')valgrisNotYet();
  else if(a==='vdefi')valgrisAccept();
  else if(a==='world'){const w=+ds.w;if(WORLDS[w]&&w<=S.worldMax&&w!==S.world){closePanel();setWorld(w);toast(`Monde ${w} : ${worldName(w)}`);save();}}
  else if(a==='qacc'){const q=S.q[ds.q];if(q&&q.s===0){q.s=1;closePanel();toast('Nouvelle quête');save();}}
  else if(a==='qret'){const q=S.q[ds.q];if(q&&q.s===2)QUESTS[ds.q].ret();}
  else if(a==='buyp'||a==='buyp5'){const n=a==='buyp5'?5:1;if(p.pot+n>POTIONS.fiole.max){say(`Tu ne peux pas porter plus de ${POTIONS.fiole.max} fioles.`);return;}if(p.gold>=potPrice()*n){p.gold-=potPrice()*n;p.pot+=n;invPanel('sell');}else say('Pas assez d’or.');}
  else if(a==='buyres'){const k=ds.k;if(!AFX[k]||!/^res[FCLP]$/.test(k))return;if(p.gold<resPrice()){say('Pas assez d’or.');return;}let it=null;for(let t=0;t<30&&(!it||it.rar!==1);t++)it=genItem(p.lvl,1,0,'ring');if(!it||it.rar!==1)return;
    it.aff={[k]:Math.max(1,Math.round(AFX_MAX[k](p.lvl)*.6))};it.suf=AFX[k].s;delete it.rname;it.val=Math.round((6+p.lvl*3)*1.6);refreshName(it);if(!bagAdd(it)){say('Ton sac est plein.');return;}p.gold-=resPrice();sfx('gold');toast(it.name);save();invPanel('sell');}
  else if(a==='buys'){if(p.gold>=scrollPrice()){p.gold-=scrollPrice();p.scroll++;invPanel('sell');}else say('Pas assez d’or.');}
  else if(a==='sell'){if(p.bag[i]&&p.bag[i].lock){say('Objet verrouillé.');return;}const it=p.bag.splice(i,1)[0];if(it)p.gold+=it.val;save();npcDialog('bram');}
  else if(a==='sellall')sellAllAsk();
  else if(a==='isellback')invPanel('sell');
  else if(a==='pactyes')altarChoose(true);
  else if(a==='ctclaim'){const C=ctToday(),c=C.list[+ds.k];if(c&&!c.claimed&&c.cnt>=c.goal){c.claimed=true;const R_=ctReward();p.gold+=R_.gold;addMats(R_.mats);sfx('gold');toast('+'+fmt(R_.gold)+' or');save();}boardPanel();}
  else if(a==='page'){if((S.pages||{})[+ds.k])pageRead(+ds.k);}
  else if(a==='pray'){pray(ds.k);closePanel();}
  else if(a==='welldrink'){closePanel();wellDrink();save();}
  else if(a==='pedbuy'){const ev=S.cur.ev,i=+ds.k,it=ev&&ev.stock&&ev.stock[i];if(it){const pr=peddlerPrice(it);if(p.gold<pr){say('Pas assez d’or.');return;}if(!bagFits(it)){say('Ton sac est plein.');return;}p.gold-=pr;bagAdd(it);ev.stock[i]=null;sfx('gold');toast('Acheté : '+it.name);save();}peddlerTalk();}
  else if(a==='travbuy'){const ev=S.cur.ev;if(ev&&ev.state==='saved'&&ev.offer){if(p.gold<ev.price){say('Pas assez d’or.');return;}if(!bagFits(ev.offer)){say('Ton sac est plein.');return;}p.gold-=ev.price;bagAdd(ev.offer);ev.offer=null;ev.state='sold';sfx('gold');toast('Acheté');save();}closePanel();}
  else if(a==='trial')openTrial(i);
  else if(a==='allyhire'){const A=ALLIES[ds.k];if(A&&!(A.egg&&!p.egg)){const c=A.price(p.lvl);if(p.gold<c){say('Pas assez d’or.');return;}p.gold-=c;p.comp={type:ds.k,xp:0,ev:0};S.ally=null;spawnAlly();toast(A.n+' te suit');save();}npcDialog('recruit');}
  else if(a==='allyevo'){const c=p.comp,ec=c&&evoCost(c);if(ec&&xpRank(c)>allyRank(c)&&canPay(ec)){for(const k in ec)p.mats[k]-=ec[k];c.ev=(c.ev||0)+1;spawnAlly();sfx('lvl');toast(`${ALLIES[c.type].n} : ${ARANKS[allyRank(c)][0]}`);save();}npcDialog('recruit');}
  else if(a==='allyfire'){p.comp=null;S.ally=null;save();npcDialog('recruit');}
  else if(a==='gamble'){gamble(ds.k);npcDialog('joueuse');}
  else if(a==='trialdrop'){if(p.cards&&p.cards[i]){p.cards.splice(i,1);save();}riftMenu();}
  else if(a==='pactno')altarChoose(false);
  else if(a==='salvall')salvAllAsk();
  else if(a==='salvallok')salvAll();
  else if(a==='salvback')invPanel('salv');
  else if(a==='sellallok')sellAll();
  else if(a==='selljunk'){let g=0;p.bag=p.bag.filter(it=>{if(!it.lock&&it.rar<=1&&compareItem(it)<=0){g+=it.val;bbPush(it);return false;}return true;});p.gold+=g;toast(`+${fmt(g)} or`);save();invPanel('sell');}
  else if(a==='best'){let ch=true,n=0;while(ch&&n<40){ch=false;n++;let bi=-1,bv=.5;p.bag.forEach((it,k)=>{const c=compareItem(it);if(c>bv){bv=c;bi=k;}});if(bi>=0){equip(bi);ch=true;}}save();invPanel();}
  else if(a==='uneq'){const s=ds.s;if(p.eq[s]&&unequip(s))save();invPanel('inv');}
  else if(a==='drop'){if(p.bag[i]&&p.bag[i].lock){say('Objet verrouillé.');return;}const it=p.bag.splice(i,1)[0];if(it)dropAt(S.cur,p.x,p.y,{kind:'item',it,dropped:true,forced:true});invPanel('inv');}
  else if(a==='white'){p.lootF=((p.lootF??(p.skipWhite?1:0))+1)%3;p.skipWhite=p.lootF>=1;save();invPanel();}
  else if(a==='allstash'){let n=0;const s0=S.stab;for(const it of p.bag.slice()){if(it.lock)continue;let ok=false;for(let q=0;q<ST_TABS&&!ok;q++){S.stab=(s0+q)%ST_TABS;ok=moveTo_(it,{grid:'stash'});}S.stab=s0;if(ok)n++;}toast(n?`${n} objet${n>1?'s':''} au coffre`:'Rien à ranger');save();invPanel();}
  else if(['stab','isort','iequip','iuneq','ito','ifrom','isell','idrop','ilock','isalv','ireroll','icadd','icup','icorr','ialt','iorb','iseal','iext'].includes(a))invAct(a,ds);
  else if(a==='orbs')orbPanel();
  else if(a==='otrade'){if(orbTrade(ds.k)){toast('+1 '+ORBS[ds.k].n);sfx('gold');save();}lapidPanel();}
  else if(a==='cubetab'){CUBES=-1;autelPanel(ds.k);}
  else if(a==='cubex'){const it=p.bag.find(x=>x.id===+ds.id);const lk=it&&it.leg;if(cubeExtract(it)){toast('Pouvoir gravé : '+cubeName(lk));sfx('leg');save();}autelPanel();}
  else if(a==='cubes'){const i=+ds.k;CUBES=CUBES===i?-1:i;autelPanel();}
  else if(a==='cubeon'){if(CUBES>=0){cubeSet(CUBES,ds.k||null);CUBES=-1;save();toast(ds.k?'Pouvoir actif : '+cubeName(ds.k):'Emplacement vidé');}autelPanel();}
  else if(a==='laptab'){LSEAL=false;lapidPanel(ds.k);}
  else if(a==='lsel'){const id=+ds.id;const o=lapItems().find(o=>o.it.id===id);LSEL=o?o.it:null;LSEAL=false;lapidPanel();panel.scrollTop=0;}
  else if(a==='lselno'){LSEL=null;LSEAL=false;lapidPanel();}
  else if(a==='lorb'){if(LSEL){if(ds.k==='serment'){LSEAL=true;}else{const r=useOrb(ds.k,LSEL);if(r){toast(r);sfx(ds.k==='aube'||ds.k==='tumulte'?'leg':'lvl');save();}}}lapidPanel();}
  else if(a==='lseal'){LSEAL=false;if(LSEL){const r=useOrb('serment',LSEL,ds.k);if(r){toast(r);sfx('lvl');save();}}lapidPanel();}
  else if(a==='lsealno'){LSEAL=false;lapidPanel();}
  else if(a==='salvtab'){S.salvTab=ds.k;SEL=null;invPanel('salv');panel.scrollTop=0;}
  else if(a==='aswap'){swapWeapon();invPanel();}
  else if(a==='abag'){altToBag();invPanel();}
  else if(a==='rank'){const n=ds.n==='max'?RMAX:+(ds.n||1);if(rankUp(ds.s,n))save();talentPanel();}
  else if(a==='tal'){SELT=ds.s;talentPanel();}
  else if(a==='setsup'){if(supFits(ds.k,ds.s)&&supFree(ds.k)>0){p.sup=p.sup||{};p.sup[ds.s]=ds.k;save();}talentPanel();}
  else if(a==='unsup'){if(p.sup)delete p.sup[ds.s];save();talentPanel();}
  else if(a==='bar'){barPlace(+ds.k,ds.s);talentPanel();}
  else if(a==='respec'){const c=respecPrice();if(p.gold<c){say('Pas assez d’or.');return;}p.gold-=c;resetTree();save();talentPanel();}
  else if(a==='wp'){closePanel();enterZone(ds.z,'wp');}
  else if(a==='wpnew'){closePanel();resetZone(ds.z);enterZone(ds.z,'wp');}
  else if(a==='znew'){closePanel();resetZone(S.cur.id);}
  else if(a==='rs'){S.riftSel=clamp(S.riftSel+(+ds.d),1,S.riftMax);riftMenu();}
  else if(a==='rift'){closePanel();openRift(S.riftSel);}
  else if(a==='riftback'){closePanel();enterZone('rift','spawn');}
  else if(a==='brset'){if(brSet(+ds.k)){toast(brName(S.br));sfx('portal');}npcDialog('corvel');}
  else if(a==='htab'){S.hTab=ds.k;HREP=null;npcDialog('hilde');panel.scrollTop=0;}
  else if(a==='hsel'){const id=+ds.id;const o=hildeItems().find(o=>o.it.id===id);HSEL=o?o.it:null;HREP=null;hildeCraft();panel.scrollTop=0;}
  else if(a==='hselno'){HSEL=null;HREP=null;hildeCraft();}
  else if(a==='hess'){const e=(p.ess||[])[i];if(HSEL&&e){if(essFull(e,HSEL)&&!essWhy(e,HSEL)){HREP=i;}else{const r=essApply(i,HSEL);if(r){toast('Essence posée : '+r);sfx('leg');save();}}}hildeCraft();}
  else if(a==='hrep'){if(HSEL&&HREP!=null){const r=essApply(HREP,HSEL,ds.k);if(r){toast('Essence posée : '+r);sfx('leg');save();}}HREP=null;hildeCraft();}
  else if(a==='hrepno'){HREP=null;hildeCraft();}
  else if(a==='hrel'){if(relPut(HSEL,ds.k)){toast('Relique posée : '+RELICS[ds.k].n);sfx('leg');save();}hildeCraft();}
  else if(a==='hrelx'){if(relTake(HSEL)){toast('Relique retirée');save();}hildeCraft();}
  else if(a==='forge'){const it=ds.src==='eq'?p.eq[ds.k]:p.bag[+ds.k];if(forge(it)){toast(it.name+' : niveau '+it.ilvl);save();}npcDialog('hilde');}
  else if(a==='news'){newsPanel('5.40');}
  else if(a==='guide'){guidePanel();}
  else if(a==='clsnew'){setClass(ds.k,true);}
  else if(a==='cls'){setClass(ds.k,false);}
  else if(a==='clspick'){classPanel(false);}
  else if(a==='bback'){const it=S.bb&&S.bb[+ds.i];if(it){if(p.gold<it.val)say('Pas assez d’or.');else if(!bagAdd(it))say('Ton sac est plein.');else{p.gold-=it.val;S.bb.splice(+ds.i,1);sfx('gold');toast('Racheté : '+it.name);save();}}invPanel('sell');}
  else if(a==='bsave'){buildSave(+ds.i);talentPanel();}
  else if(a==='bload'){buildLoad(+ds.i);talentPanel();}
  else if(a==='stabname'){const cur=(S.stabN&&S.stabN[S.stab])||'';let v=null;try{v=prompt('Nom de l’onglet '+(S.stab+1)+' (12 lettres au plus)',cur);}catch(e){}if(v!=null){S.stabN=S.stabN||[null,null,null,null];S.stabN[S.stab]=v.trim().slice(0,12)||null;save();}invPanel('stash');}
  else if(a==='seabuy'){seaBuy(ds.k);menuPanel('saison');}
  else if(a==='lore'){lorePanel();}
  else if(a==='letter'){letterRead(ds.th,+ds.k);}
  else if(a==='look'){lookPanel();}
  else if(a==='lookset'){p.look=p.look||{};const k=ds.k;if(k==='nohelm')p.look.nohelm=!p.look.nohelm;else{let v=p.look[k]|0;for(let t=0;t<LOOKS[k].length;t++){v=(v+1)%LOOKS[k].length;if(k!=='cape'||capeUnlocked(v))break;}p.look[k]=v;}save();lookPanel();}
  else if(a==='backup'){backupPanel();}
  else if(a==='bkcopy'){const t=document.getElementById('bkout');try{t.select();navigator.clipboard&&navigator.clipboard.writeText(t.value);toast('Copié');}catch(e){toast('Sélectionne et copie le texte');}}
  else if(a==='fiche'){skFiche(ds.s);return;}
  else if(a==='fstat'){statFiche(ds.k);return;}
  else if(a==='gch'){guidePanel(ds.k);return;}
  else if(a==='bkprev'){try{const a_=localStorage.getItem(SAVE_PREV);save();const b_=localStorage.getItem(SAVE);if(!a_)return;localStorage.setItem(SAVE,a_);if(b_)localStorage.setItem(SAVE_PREV,b_);}catch(e){return;}closePanel();startGame(loadSave());toast('Partie d’avant reprise');}
  else if(a==='bkload'){const t=document.getElementById('bkin'),raw=readCode(t&&t.value);if(!raw){say('Ce texte n’est pas une copie valide.');return;}localStorage.setItem(SAVE,raw);closePanel();startGame(loadSave());toast('Partie restaurée');}
  else if(a==='ambt'){p.amb=p.amb===false;if(p.amb===false)ambStop(.5);else{audioInit();ambStart();}save();menuPanel('perso');}
  else if(a==='eco'){p.eco=!p.eco;S.amb=[];save();menuPanel('perso');}
  else if(a==='gfx'){GW.done=true;if(p.eco){p.eco=false;p.gfx=2;}else if(p.gfx===1){p.eco=true;}else p.gfx=1;S.amb=[];save();menuPanel('perso');}
  else if(a==='mute'){p.mute=!p.mute;if(!p.mute){audioInit();sfx('gold');}save();menuPanel('perso');}
  else if(a==='revive'){closePanel();p.dead=false;p.hp=p.maxHp;p.mp=p.maxMp;enterZone('town','spawn');}
  else if(a==='revivep'){closePanel();p.dead=false;p.hp=p.maxHp;p.mp=p.maxMp;if(S.portal&&S.zones[S.portal.zone]||S.portal&&resumable(S.portal.zone))enterZone(S.portal.zone,'portal');else enterZone('town','spawn');}
}

