// Inventaire en grille, équipement, comparaison, ramassage, vente.
function sacVide() { nouvellePartie(); p.bag = []; }

test('sac de 12 × 5 cases ; tailles des objets selon le document', () => {
  egal([INV_W, INV_H], [12, 5]);
  const t = { ring: [1, 1], amulet: [1, 1], orb: [1, 1], belt: [2, 1], helm: [2, 2], gloves: [2, 2], boots: [2, 2], shield: [2, 2], armor: [2, 3], axe: [2, 3], sword: [1, 3], mace: [1, 3], dagger: [1, 2], staff: [1, 4] };
  for (const [k, v] of Object.entries(t)) egal([TYPES[k].w, TYPES[k].h], v, k);
});
test('un objet se range dans la première case libre, jamais par-dessus un autre', () => {
  sacVide(); const a = objet('armor'); bagAdd(a); egal([a.gx, a.gy], [0, 0]);
  const b = objet('armor'); bagAdd(b); egal([b.gx, b.gy], [2, 0]);
  ok(!fitsAt(p.bag, INV_W, INV_H, objet('helm'), 1, 1), 'chevauchement accepté'); ok(!fitsAt(p.bag, INV_W, INV_H, objet('staff'), 11, 2), 'dépassement accepté');
});
test('sac plein : l’objet reste au sol', () => {
  sacVide(); while (bagAdd(objet('armor'))); const n = p.bag.length; egal(n, 6 * 1);
  aller(zid(1, 0)); S.cur.mons = []; const it = objet('armor'); S.cur.items.push({ kind: 'item', it, x: p.x, y: p.y }); avancer(.2);
  egal(p.bag.length, n); ok(S.cur.items.some(o => o.it === it), 'objet disparu');
});
test('marcher sur un objet le ramasse ; « Ignorer le normal » laisse les objets gris', () => {
  sacVide(); aller(zid(1, 0)); S.cur.mons = [];
  const a = objet('helm', 1); S.cur.items.push({ kind: 'item', it: a, x: p.x, y: p.y }); avancer(.2); ok(p.bag.includes(a), 'pas ramassé');
  p.skipWhite = true; const b = objet('helm', 0); S.cur.items.push({ kind: 'item', it: b, x: p.x, y: p.y }); avancer(.2); ok(!p.bag.includes(b), 'objet gris ramassé');
});
test('équiper un objet met l’ancien à sa place dans le sac', () => {
  sacVide(); const w = objet('sword', 1, 12); bagAdd(w); const x = w.gx, y = w.gy, old = p.eq.weapon;
  ok(equipItem(w)); egal(p.eq.weapon, w); ok(p.bag.includes(old)); egal([old.gx, old.gy], [x, y]);
});
test('anneaux : le premier va à gauche, le deuxième à droite', () => {
  sacVide(); const a = objet('ring', 1), b = objet('ring', 1); bagAdd(a); bagAdd(b); equipItem(a); equipItem(b); egal([p.eq.ring1, p.eq.ring2], [a, b]);
});
test('un objet refuse un emplacement qui n’est pas le sien', () => {
  sacVide(); const h = objet('helm', 1); bagAdd(h); egal(moveTo_(h, { slot: 'boots' }), false); ok(p.bag.includes(h)); ok(!p.eq.boots);
});
test('retirer un objet le remet dans le sac, à la case voulue', () => {
  sacVide(); const a = p.eq.armor; ok(unequip('armor', 5, 1)); ok(!p.eq.armor); egal([a.gx, a.gy], [5, 1]);
});
test('trier le sac garde tous les objets sans chevauchement', () => {
  sacVide(); const types = ['ring', 'staff', 'helm', 'belt', 'dagger', 'armor', 'ring', 'boots']; for (const t of types) bagAdd(objet(t));
  ok(sortGrid(p.bag, INV_W, INV_H)); egal(p.bag.length, types.length); for (const it of p.bag) ok(fitsAt(p.bag, INV_W, INV_H, it, it.gx, it.gy, it));
});
test('comparaison ▲ ▼ en pourcentage de puissance', () => {
  sacVide(); heros(10); const fort = objet('sword', 2, 30), faible = objet('dagger', 0, 1); bagAdd(fort); bagAdd(faible);
  ok(compareItem(fort) > 0 && compareItem(faible) < 0, `${compareItem(fort)} / ${compareItem(faible)}`);
  invPanel('inv'); SEL = { it: fort, src: 'bag' }; invPanel(); ok(textePanneau().includes('▲'), 'pas de ▲');
});
test('« Équiper le meilleur » remplit toujours un emplacement vide et garde les meilleurs objets', () => {
  sacVide(); heros(10); const h = objet('helm', 0, 1), faible = objet('sword', 0, 1); bagAdd(h); bagAdd(faible);
  invPanel('inv'); cliquer('best'); egal(p.eq.helm, h, 'casque vide non rempli'); ok(p.bag.includes(faible), 'arme plus faible équipée');
});
test('l’allure suit le niveau de l’objet : Cuir, Fer, Acier, Chevalier, Paladin', () => {
  egal([1, 11, 12, 27, 28, 49, 50, 79, 80, 200].map(l => tierOf({ ilvl: l })), [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]);
  for (const [l, t] of [[5, 0], [30, 2], [90, 4]]) { const it = objet('armor', 0, l); egal(it.base, TYPES.armor.names[t]); }
});
test('vendre chez Bram rapporte la valeur de l’objet', () => {
  sacVide(); const it = objet('armor', 1); bagAdd(it); const g = p.gold; npcDialog('bram'); SEL = { it, src: 'bag' }; invPanel(); cliquer('isell');
  egal(p.gold, g + it.val); ok(!p.bag.includes(it));
});
test('un objet jeté n’est pas ramassé aussitôt', () => {
  sacVide(); aller(zid(1, 0)); S.cur.mons = []; const it = objet('helm', 1); bagAdd(it); invPanel('inv'); SEL = { it, src: 'bag' }; invPanel(); cliquer('idrop'); closePanel();
  avancer(.5); ok(!p.bag.includes(it), 'ramassé aussitôt'); ok(S.cur.items.some(o => o.it === it));
});
