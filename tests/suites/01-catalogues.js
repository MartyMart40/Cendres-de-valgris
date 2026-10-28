// Catalogues : chaque entrée renvoie à des choses qui existent.
test('chaque monstre a un comportement connu', () => {
  for (const [k, m] of Object.entries(MT)) ok(BEHAV[m.ai || (m.ranged ? 'ranged' : 'melee')], `${k} : comportement ${m.ai} inconnu`);
});
test('chaque boss renvoie à un monstre, et chaque monstre boss à un boss', () => {
  for (const [k, b] of Object.entries(BOSSES)) ok(MT[b.mon], `boss ${k} : monstre ${b.mon} inconnu`);
  for (const [k, m] of Object.entries(MT)) if (m.boss) ok(BOSSES[m.boss], `monstre ${k} : boss ${m.boss} inconnu`);
});
test('chaque forme de zone sait se tracer', () => {
  for (const [k, f] of Object.entries(FORMES)) { ok(typeof f.gen === 'function', k); ok(f.n, k + ' sans nom'); }
});
test('chaque thème utilise des décors connus et a des noms pour chaque forme', () => {
  for (const [k, th] of Object.entries(THEMES)) {
    for (const f in th.decor) for (const d of [].concat(th.decor[f])) ok(DECORS[d], `${k}/${f} : décor ${d}`);
    for (const f of ['plaine', 'labyrinthe', 'couloir', 'arene']) { ok(th.names[f] && th.names[f].length >= 4, `${k} : noms ${f}`); ok(th.names2[f] && th.names2[f].length >= 4, `${k} : noms2 ${f}`); }
    ok(th.camp, k + ' sans camp');
  }
});
test('chaque monde a un thème et des actes aux formes connues', () => {
  for (const [w, W_] of Object.entries(WORLDS)) {
    ok(THEMES[W_.theme], `monde ${w} : thème ${W_.theme}`); egal(W_.acts.length, 2, `monde ${w} : nombre d'actes`);
    for (const a of W_.acts) { for (const f of a.formes) ok(FORMES[f], f); ok(BOSSES[a.boss], a.boss); for (const b of a.acolytes) ok(BOSSES[b] && BOSSES[b].mini, b); }
  }
});
test('les monstres des groupes de chaque thème existent', () => {
  for (const th of Object.values(THEMES)) for (const pl of th.pools) for (const m of pl.m) ok(MT[m], m);
});
test('les quêtes suivent l’ordre de l’histoire', () => {
  egal(Object.keys(QUESTS), ['q1', 'q2', 'q3', 'q4', 'q5']);
  egal(Object.values(QUESTS).map(q => q.act), [1, 1, 1, 2, 2]);
  for (const q of Object.values(QUESTS)) { ok(typeof q.ret === 'function'); ok(q.corvel && q.track); }
});
test('la fiole : 45 % de vie, 35 % de mana, 15 au plus', () => {
  egal([POTIONS.fiole.heal, POTIONS.fiole.mana, POTIONS.fiole.max], [.45, .35, 15]);
});
test('Valgris a ses répliques dans chaque monde', () => {
  for (const w in WORLDS) { const L = REPLIQUES.valgris[w]; ok(L, 'monde ' + w); for (const k of ['phase2', 'phase3', 'fall', 'hero', 'rise', 'ascend', 'notyet']) ok(L[k], `monde ${w} : ${k}`); }
});
// v6.26 : bonus aux dégâts des attaques ; v6.47 : cinq résistances (en plus des autres bonus) ; POWS : 26 pouvoirs légendaires de talents
test('objets : 10 emplacements, 5 paliers, 23 bonus dont 5 résistances, 46 légendaires', () => {
  egal(SLOTS.length, 10); egal(TIERN, ['Cuir', 'Fer', 'Acier', 'Chevalier', 'Paladin']);
  egal(Object.keys(AFX).length, 23); ok(AFX.atk, 'bonus aux dégâts des attaques');
  egal(Object.keys(AFX).filter(k => AFX[k].extra), ['resF', 'resC', 'resL', 'resP', 'resA'], 'résistances');
  egal(LEGS.length, 20 + POWS.length); egal(POWS.length, 26); egal(new Set(LEGS.map(l => l.id)).size, LEGS.length, 'légendaires en double');
  for (const P_ of POWS) for (const k of P_.sk) ok(SK[k], `${P_.id} : talent ${k} inconnu`);
  for (const l of LEGS) ok(TYPES[l.type], l.id);
  for (const t of Object.values(TYPES)) egal(t.names.length, 5, 'noms par palier');
});
// v6.30 : classes à deux branches ; v6.55 : dix talents de plus par classe ; gemmes (br -1) hors de l'arbre
test('talents : 76 dont 10 gemmes, 5 branches de 7 paliers, un ultime et un sans fin par branche, 2 branches par classe', () => {
  egal(Object.keys(SK).length, 76); egal(BR.length, 5);
  const gem = Object.keys(SK).filter(k => SK[k].br === -1); egal(gem.length, 10); for (const k of gem) ok(SK[k].gem && SK[k].ti == null, k);
  egal(Object.keys(CLS), ['guerrier', 'mage', 'archer']);
  for (const c of Object.values(CLS)) { egal(c.br.length, 2, c.n); for (const b of c.br) ok(BR[b], c.n); for (const k of c.bar) ok(k == null || SK[k], c.n + ' : barre ' + k); }
  egal(new Set(Object.values(CLS).flatMap(c => c.br)).size, 5, 'chaque branche sert une classe');
  for (let b = 0; b < 5; b++) {
    const ids = Object.keys(SK).filter(k => SK[k].br === b);
    egal([...new Set(ids.map(k => SK[k].ti))].sort(), [0, 1, 2, 3, 4, 5, 6], 'paliers branche ' + b);
    egal(ids.filter(k => SK[k].ult).length, 1, 'ultime branche ' + b); egal(ids.filter(k => SK[k].inf).length, 1, 'sans fin branche ' + b);
  }
  egal(TL, [1, 4, 8, 14, 22, 35, 50]); egal(TP, [0, 3, 8, 15, 25, 40, 60]); egal(RMAX, 1e6);
});
test('aucun tiret quadratin dans les textes du jeu', () => {
  const vus = new Set(), TQ = String.fromCharCode(0x2014);
  const fouiller = (v, ch) => {
    if (typeof v === 'string') { ok(!v.includes(TQ), 'tiret quadratin dans ' + ch); return; }
    if (typeof v === 'function') { ok(!String(v).includes(TQ), 'tiret quadratin dans ' + ch); return; }
    if (v && typeof v === 'object' && !vus.has(v)) { vus.add(v); for (const k in v) fouiller(v[k], ch + '.' + k); }
  };
  for (const [n, c] of Object.entries({ MT, BOSSES, THEMES, WORLDS, QUESTS, REPLIQUES, TYPES, AFX, LEGS, SK, FORMES })) fouiller(c, n);
  ok(!document.body.innerHTML.includes(TQ), 'tiret quadratin dans la page');
  // Le test sait bien en trouver un
  let pris = false; try { fouiller({ x: 'a' + TQ + 'b' }, 'essai'); } catch (e) { pris = true; } ok(pris, 'le test ne voit pas les tirets quadratins');
});
