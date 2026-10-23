// Portails (v5.12) : on n'entre que par un geste voulu, jamais en marchant dessus.
// Bornes des bonus d'objets (v5.12) : aucun objet au-dessus de la borne de son type, conversion des anciennes sauvegardes.

// Ouvre un portail dans une zone d'acte, le héros à côté
function portailIci() { nouvellePartie(); aller(zid(1, 0)); S.cur.mons = []; invincible(); p.scroll = 3; useScroll(); return portalsIn(S.cur)[0]; }
// Place le héros à une distance donnée du portail (sur une case libre)
function placer(dx, dy = 0) { const f = nearFloor(S.cur, S.portal.x + dx, S.portal.y + dy); p.x = f[0] + .5; p.y = f[1] + .5; p.path = null; p.target = null; p.targetObj = null; }
// Première zone de l'acte qui a cette forme (comme dans la suite des formes)
function zoneDeForme(f, a = 1) { for (let s = 1; s < 400; s++) { nouvellePartie(s); const i = actLayout(a).findIndex(l => l.f === f); if (i >= 0) return zid(a, i); } throw new Error('aucune zone ' + f); }
// Vrai toucher d'écran à un point de l'écran
async function toucherEcran(x, y) { await window.__toucherEcran(x, y); }
function centreBouton() { render(); const b = S.portalBtn; ok(b, 'pas de bouton « Entrer »'); return [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2]; }
function recharger() { save(); const sv = loadSave(); startGame(sv); closePanel(); return sv; }
// Objet absurde, comme une vieille partie pourrait en contenir
function objetAbsurde(type = 'ring', niv = 20) { const it = objet(type, 2, niv); it.aff.dmgPct = 90000; it.aff.crit = 500; return it; }

/* ---------- Portails ---------- */
test('ouvrir un portail ne téléporte pas : le héros reste dans la zone, même immobile dessus', () => {
  const po = portailIci(); ok(po, 'pas de portail'); const id = S.cur.id;
  p.x = S.portal.x; p.y = S.portal.y; avancer(4); egal(S.cur.id, id);
});
test('traverser un portail en marchant ne fait rien', () => {
  portailIci(); const id = S.cur.id; placer(-3);
  const f = nearFloor(S.cur, S.portal.x + 3, S.portal.y); p.path = pathTo(S.cur, Math.floor(p.x), Math.floor(p.y), f[0], f[1]); ok(p.path, 'pas de chemin');
  let mini = 99; attendre(() => { mini = Math.min(mini, Math.hypot(p.x - S.portal.x, p.y - S.portal.y)); return !p.path || !p.path.length; }, 10);
  egal(S.cur.id, id); ok(mini < 1.3, `le héros n'est pas passé près du portail (${mini.toFixed(2)})`);
});
test('grand couloir : un portail sur le seul chemin ne renvoie plus au camp', () => {
  const id = zoneDeForme('couloir'); aller(id); const z = S.cur; z.mons = []; invincible();
  const a = nearFloor(z, 8, z.h / 2) || z.spawn && [Math.floor(z.spawn.x), Math.floor(z.spawn.y)], b = (() => { for (let x = 60; x > 20; x--) for (let y = 0; y < z.h; y++) if (!isWall(z, x, y)) return [x, y]; })();
  p.x = a[0] + .5; p.y = a[1] + .5; const ch = pathTo(z, a[0], a[1], b[0], b[1]); ok(ch && ch.length > 20, 'pas de long chemin');
  const mil = ch[Math.floor(ch.length / 2)]; S.portal = { zone: id, x: mil[0] + .5, y: mil[1] + .5 };
  p.path = ch.slice(); let passe = false;
  attendre(() => { if (Math.hypot(p.x - S.portal.x, p.y - S.portal.y) < .6) passe = true; return S.cur.id !== id || !p.path || !p.path.length; }, 40);
  egal(S.cur.id, id); ok(passe, 'le héros n’a pas marché sur le portail'); ok(Math.hypot(p.x - b[0] - .5, p.y - b[1] - .5) < 1, 'le héros n’est pas au bout du couloir');
});
test('au camp : arriver par le portail ne renvoie pas aussitôt dans la zone', () => {
  portailIci(); interact(portalsIn(S.cur)[0]); egal(S.cur.id, 'town'); S.pend = [];
  avancer(5); egal(S.cur.id, 'town');
});
test('tout près du portail : portalNear le trouve ; plus loin, non', () => {
  portailIci(); placer(1, 0); ok(portalNear(S.cur), 'pas trouvé tout près'); placer(3, 0); egal(portalNear(S.cur), null);
});
test('le bouton « Entrer » apparaît tout près et disparaît en s’éloignant', () => {
  portailIci(); placer(1); render(); ok(S.portalBtn, 'pas de bouton'); placer(3.5); render(); egal(S.portalBtn, null);
});
test('le bouton « Entrer » n’existe pas sans portail', () => {
  nouvellePartie(); aller(zid(1, 0)); render(); egal(S.portalBtn, null); egal(portalNear(S.cur), null);
});
test('vrai toucher sur « Entrer » : retour au camp', async () => {
  portailIci(); placer(1); avancer(.5); const [x, y] = centreBouton(); await toucherEcran(x, y); egal(S.cur.id, 'town');
});
test('au camp, « Entrer » ramène dans la zone du portail', async () => {
  const po = portailIci(); const id = S.cur.id; interact(po); S.pend = []; const t = portalsIn(S.cur)[0]; ok(t, 'pas de portail au camp');
  p.x = t.x + 1; p.y = t.y; p.path = null; avancer(.5); const [x, y] = centreBouton(); await toucherEcran(x, y); egal(S.cur.id, id);
});
test('vrai toucher sur le portail lui-même, de loin : le héros y marche puis entre', async () => {
  portailIci(); placer(-4); avancer(.5); render(); const [sx, sy] = scr(S.portal.x, S.portal.y); await toucherEcran(sx, sy - 26 * Z);
  ok(p.targetObj && p.targetObj.dest === 'town', 'le portail n’est pas visé'); ok(attendre(() => S.cur.id === 'town', 10), 'le héros n’est pas entré');
});
test('toucher juste à côté du portail : on marche, sans entrer', async () => {
  portailIci(); const id = S.cur.id; placer(-4); avancer(.5); render(); const [sx, sy] = scr(S.portal.x, S.portal.y);
  await toucherEcran(sx + 22 * Z, sy - 10 * Z); ok(!p.targetObj, 'le portail est visé'); avancer(3); egal(S.cur.id, id);
});
test('toucher l’étiquette du portail de loin : rien ne se passe', async () => {
  portailIci(); const id = S.cur.id; placer(-3); avancer(.5); render(); egal(S.portalBtn, null); const [sx, sy] = scr(S.portal.x, S.portal.y);
  await toucherEcran(sx, sy - 62 * Z); ok(!p.targetObj, 'l’étiquette vise le portail'); avancer(3); egal(S.cur.id, id);
});
test('pickAt : le portail ne réagit que sur son ovale lumineux', () => {
  portailIci(); placer(-4); avancer(.2); const [sx, sy] = scr(S.portal.x, S.portal.y);
  const h = pickAt(sx, sy - 26 * Z); ok(h && h.obj && h.obj.dest === 'town', 'centre du portail non reconnu');
  for (const [dx, dy] of [[22, -10], [-22, -10], [0, -60], [0, 8]]) { const k = pickAt(sx + dx * Z, sy + dy * Z); ok(!(k && k.obj && k.obj.dest), `toucher à (${dx}, ${dy}) pris pour le portail`); }
});
test('un monstre devant le portail reste prioritaire au toucher', () => {
  portailIci(); placer(-4); const m = spawnMon(S.cur, 'rodeur', S.portal.x, S.portal.y); avancer(.1); const [sx, sy] = scr(m.x, m.y);
  const h = pickAt(sx, sy - 20 * Z); ok(h && h.mon === m, 'le monstre n’est pas visé');
});
test('touche Entrée du clavier : entre tout près, rien de loin', () => {
  portailIci(); const id = S.cur.id; placer(3); dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); egal(S.cur.id, id);
  placer(1); dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); egal(S.cur.id, 'town');
});
test('pas d’entrée pendant une scène ou quand le héros est mort', () => {
  portailIci(); placer(1); p.dead = true; egal(portalNear(S.cur), null); p.dead = false; S.cine = { m: {} }; egal(portalNear(S.cur), null); S.cine = null; ok(portalNear(S.cur));
});
test('le portail reste ouvert dans les deux sens après un aller-retour', () => {
  const po = portailIci(); const id = S.cur.id; interact(po); S.pend = []; interact(portalsIn(S.cur)[0]); egal(S.cur.id, id); ok(portalsIn(S.cur).length === 1, 'portail disparu');
});
test('comme le robot : viser le portail (objet visé) fait entrer en y arrivant', () => {
  portailIci(); placer(-4); const po = portalsIn(S.cur)[0]; p.targetObj = po; p.path = pathTo(S.cur, Math.floor(p.x), Math.floor(p.y), Math.floor(po.x), Math.floor(po.y));
  ok(attendre(() => S.cur.id === 'town', 10), 'pas entré');
});
test('non-régression : les sorties entre zones se prennent toujours en marchant', () => {
  nouvellePartie(); aller(zid(1, 0)); S.cur.mons = []; invincible(); const o = objetsDe('exit').find(o => o.to === zid(1, 1)); ok(o, 'pas de sortie');
  p.x = o.x; p.y = o.y; p.tpCd = 0; avancer(.3); egal(S.cur.id, zid(1, 1));
});
test('un parchemin de portail est bien dépensé, et sans parchemin rien ne s’ouvre', () => {
  nouvellePartie(); aller(zid(1, 0)); p.scroll = 1; useScroll(); egal(p.scroll, 0); ok(S.portal); S.portal = null; useScroll(); egal(S.portal, null);
});

/* ---------- Bornes des bonus d'objets ---------- */
test('chaque type de bonus du catalogue a une borne', () => {
  for (const k in AFX) { ok(typeof AFX[k].max === 'function', `${k} sans borne`); for (const L of [1, 30, 200]) ok(AFX[k].max(L) >= 1, `${k} : borne nulle au niveau ${L}`); }
});
test('les bornes des bonus fixes suivent la courbe G', () => {
  for (const k of ['dmg', 'life', 'armor']) { const r = AFX[k].max(80) / G(80), r2 = AFX[k].max(150) / G(150); proche(r / r2, 1, .01, k); }
});
test('les bornes en % restent sous les plafonds déjà en place', () => {
  entre(AFX.dmgPct.max(5000), 1, 260); entre(AFX.spell.max(5000), 1, 215); entre(AFX.crit.max(5000), 1, 75); entre(AFX.leech.max(1), 1, 20); entre(AFX.block.max(1), 1, 60);
  egal(AFX.allSk.max(999), 1);
});
test('4 000 objets tirés (niveaux 1 à 300, toutes raretés) : aucun au-dessus de sa borne', () => {
  graine(7); for (let i = 0; i < 4000; i++) { const it = genItem(1 + (i % 300), i % 4, 0); for (const k in it.aff) ok(it.aff[k] <= AFX[k].max(it.ilvl), `${k} = ${it.aff[k]} au niveau ${it.ilvl}`); egal(capItem(JSON.parse(JSON.stringify(it))), 0); }
});
test('légendaires de haut niveau : sous la borne', () => {
  graine(3); for (let i = 0; i < 300; i++) { const it = genItem(250, 3, 0); egal(it.rar, 3); for (const k in it.aff) ok(it.aff[k] <= AFX[k].max(250), `${it.name} : ${k}`); }
});
test('forge : un objet monté du niveau 3 au niveau 80 ne perd rien', () => {
  nouvellePartie(); heros(80); graine(11);
  for (let i = 0; i < 60; i++) { const it = genItem(3, 3, 0, 'axe'); const k = G(80) / G(3), att = { d: it.d.map(v => Math.max(1, Math.round(v * k))), dmg: it.aff.dmg && Math.max(1, Math.round(it.aff.dmg * k)) };
    p.gold = 1e9; ok(forge(it)); egal(it.d, att.d); if (att.dmg) egal(it.aff.dmg, att.dmg); }
});
test('forge : un objet trop fort est ramené à sa borne', () => {
  nouvellePartie(); heros(40); const it = objetAbsurde('ring', 10); p.gold = 1e9; ok(forge(it)); egal(it.aff.dmgPct, AFX.dmgPct.max(40)); egal(it.aff.crit, AFX.crit.max(40));
});
test('capItem : +90 000 % de dégâts ramené à la borne, avec le nombre de corrections', () => {
  const it = objetAbsurde('ring', 20); egal(capItem(it), 2); egal(it.aff.dmgPct, AFX.dmgPct.max(20)); egal(it.aff.crit, AFX.crit.max(20)); egal(capItem(it), 0);
});
test('capItem : bonus inconnu ou illisible retiré, la fiche de l’objet s’affiche', () => {
  const it = objet('amulet', 2, 15); it.aff.inconnu = 5; it.aff.life = NaN; it.aff.mf = 'beaucoup'; egal(capItem(it), 3);
  ok(!('inconnu' in it.aff) && !('life' in it.aff) && !('mf' in it.aff)); ok(itemLines(it).length > 0);
});
test('capItem : dégâts d’arme, armure et blocage de base ramenés au type d’objet', () => {
  const w = objet('sword', 0, 10); w.d = [1e9, 2e9]; capItem(w); ok(w.d[1] <= Math.ceil(8 * G(10) * MARGE) && w.d[0] <= w.d[1], 'arme');
  const s = objet('shield', 0, 10); s.a = 1e9; s.block = 75; capItem(s); ok(s.a <= Math.ceil(6 * G(10) * MARGE), 'armure'); egal(s.block, 10);
});
test('un légendaire ramené à la borne garde son pouvoir', () => {
  graine(5); const it = genItem(20, 3, 0, 'helm'); it.aff.lifePct = 999; capItem(it); egal(it.leg, 'fire3'); ok(itemLines(it).some(l => l.startsWith('★')));
});
test('conversion : objets trop forts du sac, de l’équipement et du coffre ramenés au chargement', () => {
  nouvellePartie(); heros(30); p.eq.ring1 = objetAbsurde('ring', 30); bagAdd(objetAbsurde('amulet', 30)); addTo(p.stash[1], ST_W, ST_H, objetAbsurde('gloves', 30)); recalc();
  ok(p.st.dmgPct > 90000, 'objet absurde non pris en compte'); recharger();
  for (const it of [p.eq.ring1, ...p.bag, ...p.stash[1]]) for (const k in it.aff) ok(it.aff[k] <= AFX[k].max(it.ilvl), `${it.name} : ${k} = ${it.aff[k]}`);
  egal(S.capped, 3); ok(p.st.dmgPct < 1000, `dégâts encore absurdes : ${p.st.dmgPct} %`);
});
test('conversion : un message prévient le joueur, une seule fois', () => {
  nouvellePartie(); heros(30); bagAdd(objetAbsurde('ring', 30)); save(); startGame(loadSave()); closePanel(); let vu = '';
  const dire = window.say; window.say = t => { vu += t; dire(t); }; try { avancer(2); } finally { window.say = dire; }
  ok(vu.includes('ramené'), 'pas de message : ' + vu); recharger(); egal(S.capped, undefined);
});
test('conversion : la sauvegarde corrigée est réécrite', () => {
  nouvellePartie(); heros(30); bagAdd(objetAbsurde('ring', 30)); save(); startGame(loadSave());
  const sv = JSON.parse(localStorage.getItem(SAVE)); ok(sv.p.bag.every(it => !it.aff.dmgPct || it.aff.dmgPct <= AFX.dmgPct.max(it.ilvl)), 'sauvegarde pas réécrite');
});
test('conversion : une partie normale n’est pas touchée', () => {
  nouvellePartie(); heros(25); for (const [t, r] of [['sword', 3], ['helm', 2], ['ring', 1], ['armor', 2], ['staff', 0]]) bagAdd(objet(t, r, 25)); rankUp('mastery', 3);
  const avant = JSON.stringify({ b: p.bag, e: p.eq, s: p.stash }); recharger(); egal(JSON.stringify({ b: p.bag, e: p.eq, s: p.stash }), avant); egal(S.capped, undefined);
});
test('conversion : partie v2 avec un objet trop fort, convertie puis bornée', () => {
  localStorage.clear(); const ring = objetAbsurde('ring', 9);
  const v2 = { v: 2, p: { ...newPlayer(), lvl: 9, gold: 77, bag: [ring], eq: starterGear(9), sk: { fire: 3, nova: 1 }, tv: 2, stash: [[], [], [], []] }, q: { q1: { s: 3, n: 12 } }, wps: { town: 1 }, done: false, riftMax: 1 };
  localStorage.setItem(SAVE_V2, JSON.stringify(v2)); startGame(loadSave()); closePanel(); egal(p.bag[0].aff.dmgPct, AFX.dmgPct.max(9)); egal(S.world, 1);
});
test('stats : même avec des objets bornés partout, les plafonds tiennent', () => {
  nouvellePartie(); heros(60); for (const sl of SLOTS) { const t = sl === 'weapon' ? 'dagger' : sl === 'offhand' ? 'shield' : sl.startsWith('ring') ? 'ring' : sl; const it = objet(t, 2, 60); for (const k in AFX) if (AFX[k].sl.includes(it.slot)) it.aff[k] = 1e9; capItem(it); p.eq[sl] = it; }
  recalc(); const s = p.st; entre(s.crit, 0, 75); entre(s.block, 0, 60); entre(s.leech, 0, 20); entre(s.aps, 0, 6); entre(s.move, 0, 80); entre(s.dmgPct, 0, 6 * 260 + 100);
});
