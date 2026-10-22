// Équilibre des 4 styles (v5.10) : dégâts et cibles des sorts, coûts, textes des talents fidèles au code.
// Espionne les coups portés par un sort : [monstre, multiplicateur] pour chaque coup.
function coupsDe(id, cible) {
  const vrai = hitMon, coups = []; hitMon = (m, mult, ...r) => { coups.push([m, mult]); return vrai(m, mult, ...r); };
  try { p.cd = 0; p.cds = {}; p.mp = p.maxMp; castSkill(id, cible.x, cible.y); } finally { hitMon = vrai; }
  return coups;
}
// Un groupe de monstres solides autour du héros, sur des cases libres différentes, le plus proche en premier
function rangee(n) {
  const z = S.cur, l = [], pris = new Set(), x0 = Math.floor(p.x), y0 = Math.floor(p.y);
  for (let r = 1; r < 6 && l.length < n; r++) for (let dy = -r; dy <= r && l.length < n; dy++) for (let dx = -r; dx <= r && l.length < n; dx++) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) !== r || isWall(z, x0 + dx, y0 + dy) || pris.has(dx + ',' + dy)) continue;
    pris.add(dx + ',' + dy); l.push(spawnMon(z, 'rodeur', x0 + dx + .5, y0 + dy + .5, false, 60));
  }
  return l;
}
function preparer(id, rang) { nouvellePartie(); heros(60); aller(zid(1, 0)); invincible(); p.sk[id] = rang; recalc(); p.mp = p.maxMp; return skLvl(id); }
// Pourcentage écrit dans le texte du talent (le dernier nombre suivi de « % »)
function pctTexte(id, l) { const t = SK[id].d(l).replace(/\s/g, ''); const m = t.match(/(\d+)%/g); return +m[m.length - 1].replace('%', ''); }

test('boule de feu : 170 % au rang 1, +17 % par rang', () => {
  const l = preparer('fire', 1); const m = monstre('rodeur', 3, 60); castSkill('fire', m.x, m.y);
  proche(S.proj[S.proj.length - 1].mult, 1.7 + .17 * (l - 1), 1e-9);
  const l2 = preparer('fire', 10); castSkill('fire', p.x + 3, p.y); proche(S.proj[S.proj.length - 1].mult, 1.7 + .17 * (l2 - 1), 1e-9);
});
test('boule de feu : l’explosion frappe la cible à plein et les voisins à 60 %', () => {
  preparer('fire', 1); const [a, b] = rangee(2); const vrai = hitMon, coups = [];
  hitMon = (m, mult, ...r) => { coups.push([m, mult]); return vrai(m, mult, ...r); };
  try { explode({ from: 'p', x: a.x, y: a.y, mult: 2 }); } finally { hitMon = vrai; }
  egal(coups.find(c => c[0] === a)[1], 2); const vb = coups.find(c => c[0] === b); if (vb) proche(vb[1], 1.2, 1e-9);
});
test('tourbillon : 230 % au rang 1 sur tous les ennemis autour', () => {
  const l = preparer('whirl', 1); const ms = [monstre('rodeur', 1, 60), monstre('rodeur', -1, 60)];
  const c = coupsDe('whirl', ms[0]); egal(ms.every(m => c.some(x => x[0] === m)), true, 'un voisin oublié');
  for (const x of c) proche(x[1], 2.3 + .23 * (l - 1), 1e-9);
});
test('tourbillon : +23 % par rang', () => {
  const l = preparer('whirl', 15); const m = monstre('rodeur', 1, 60); const c = coupsDe('whirl', m); proche(c[0][1], 2.3 + .23 * (l - 1), 1e-9);
});
test('chaîne d’éclairs : 95 % au rang 1, sur 3 ennemis', () => {
  const l = preparer('chain', 1); const ms = rangee(8); const c = coupsDe('chain', ms[0]);
  egal(c.length, 3 + Math.min(6, Math.floor(l / 5))); egal(new Set(c.map(x => x[0])).size, c.length, 'un ennemi frappé deux fois');
  for (const x of c) proche(x[1], .95 + .095 * (l - 1), 1e-9);
});
test('chaîne d’éclairs : une cible de plus tous les 5 rangs', () => {
  for (const r of [5, 10, 15]) { const l = preparer('chain', r); const ms = rangee(12); egal(coupsDe('chain', ms[0]).length, 3 + Math.min(6, Math.floor(l / 5)), 'rang ' + r); }
});
test('chaîne d’éclairs : 9 ennemis au plus, même à très haut rang', () => {
  for (const r of [30, 60, 500]) { preparer('chain', r); const ms = rangee(14); egal(coupsDe('chain', ms[0]).length, 9, 'rang ' + r); }
});
test('chaîne d’éclairs : sur une cible seule, deux rebonds à moitié', () => {
  const l = preparer('chain', 4); const m = monstre('rodeur', 2, 60); const c = coupsDe('chain', m); const v = .95 + .095 * (l - 1);
  egal(c.length, 3); proche(c[0][1], v, 1e-9); proche(c[1][1], v / 2, 1e-9); proche(c[2][1], v / 2, 1e-9);
});
test('chaîne d’éclairs : pas de saut vers un ennemi trop loin', () => {
  preparer('chain', 1); const a = monstre('rodeur', 1.5, 60); const loin = monstre('rodeur', 12, 60); const c = coupsDe('chain', a);
  ok(!c.some(x => x[0] === loin), 'l’éclair a sauté à 10 cases');
});
test('nova de givre : coûte 10 mana, 130 % au rang 1, ralentit', () => {
  const l = preparer('nova', 1); egal(SK.nova.cost, 10); const m = monstre('rodeur', 1.5, 60); const mp = p.mp; p.cd = 0;
  const vrai = hitMon, coups = []; hitMon = (x, mult, ...r) => { coups.push([x, mult]); return vrai(x, mult, ...r); };
  try { ok(castSkill('nova', m.x, m.y)); } finally { hitMon = vrai; }
  egal(p.mp, mp - 10); proche(coups[0][1], 1.3 + .12 * (l - 1), 1e-9); ok(m.slow > 0, 'pas ralenti');
});
test('coûts en mana des 4 sorts de style', () => {
  egal([SK.fire.cost, SK.nova.cost, SK.chain.cost, SK.whirl.cost], [6, 10, 9, 10]);
});
test('textes des talents : le pourcentage affiché est celui du code', () => {
  for (const l of [1, 2, 7, 20, 101]) {
    egal(pctTexte('fire', l), Math.round((1.7 + .17 * (l - 1)) * 100), 'feu rang ' + l);
    egal(pctTexte('whirl', l), Math.round((2.3 + .23 * (l - 1)) * 100), 'tourbillon rang ' + l);
    egal(pctTexte('chain', l), Math.round((.95 + .095 * (l - 1)) * 100), 'éclairs rang ' + l);
    egal(pctTexte('nova', l), Math.round((1.3 + .12 * (l - 1)) * 100), 'givre rang ' + l);
  }
});
test('texte de la chaîne d’éclairs : le nombre d’ennemis affiché est celui du code', () => {
  for (const l of [1, 5, 14, 30, 1000]) egal(+SK.chain.d(l).match(/Saute sur (\d+)/)[1], 3 + Math.min(6, Math.floor(l / 5)), 'rang ' + l);
});
test('la chaîne d’éclairs s’ouvre au niveau 8 avec 8 points en Pyromancie', () => {
  nouvellePartie(); heros(8); ok(!unlocked('chain'), 'ouverte sans points'); rankUp('fire', 3); rankUp('mind', 3); ok(unlocked('chain'), 'fermée avec 8 points');
  nouvellePartie(); heros(7); rankUp('fire', 8); ok(!unlocked('chain'), 'ouverte au niveau 7');
});
test('les gantelets de l’Écho lancent une chaîne gratuite avec les nouveaux réglages', () => {
  preparer('chain', 1); const ms = rangee(5); const mp = p.mp; const vrai = hitMon, coups = [];
  hitMon = (m, mult, ...r) => { coups.push([m, mult]); return vrai(m, mult, ...r); };
  try { castSkill('chain', ms[0].x, ms[0].y, true); } finally { hitMon = vrai; }
  egal(p.mp, mp, 'la chaîne gratuite a coûté du mana'); egal(coups.length, 3);
});
