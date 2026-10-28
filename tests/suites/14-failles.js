// Failles sans fin : 50 monstres, un gardien, la faille suivante, les records.
function enFaille(n = 1) { nouvellePartie(); heros(20); quete('q3', 3); S.riftMax = n; S.riftSel = n; riftMenu(); cliquer('rift'); invincible(); return S.cur; }
// v6.05 : au-delà de 6 morts dans la même image, le reste attend les images suivantes. Ici, un monstre par image, comme en jeu.
function abattre(n) { for (let i = 0; i < n; i++) { S.killN = 0; tuer(monstre('rodeur')); } }

test('les failles s’ouvrent après Varsha', () => {
  nouvellePartie(); ok(!riftOpen()); quete('q3', 2); ok(riftOpen());
  const z = enFaille(3); egal([z.id, z.def.rift, z.def.lvl], ['rift', 3, 9]);
});
test('50 monstres abattus font surgir le gardien', () => {
  const z = enFaille(); egal(z.def.goal, 50);
  abattre(49); egal(z.kills, 49); ok(!z.guardSpawned, 'gardien trop tôt'); abattre(1);
  ok(z.guardSpawned && z.mons.some(m => m.guard && !m.dead), 'pas de gardien');
});
test('50 monstres tués dans la même image : 6 comptés tout de suite, le reste aux images suivantes, puis le gardien', () => {
  const z = enFaille(); S.killN = 0; for (let i = 0; i < 50; i++) tuer(monstre('rodeur'));
  egal([z.kills, S.killQ.length, KILL_BUDGET], [6, 44, 6]); ok(!z.guardSpawned, 'gardien avant la fin de la file');
  ok(attendre(() => z.guardSpawned, 2), 'la file ne se vide pas'); egal(z.kills, 50); ok(z.mons.some(m => m.guard && !m.dead), 'pas de gardien');
});
test('le gardien vaincu ouvre la faille suivante, donne un point la première fois, et note le record', () => {
  const z = enFaille(); const pts = p.pts; z.t0 = S.t - 125; abattre(50);
  const g = z.mons.find(m => m.guard); ok(g, 'pas de gardien'); S.killN = 0; tuer(g); ok(z.done); egal([S.riftMax, p.pts - pts, S.rec[1]], [2, 1, 125]);
  ok(z.objs.some(o => o.type === 'exit' && o.to === 'town'), 'pas de retour au camp');
  const z2 = enFaille(1); S.riftMax = 2; p.pts = 0; abattre(50); S.killN = 0; tuer(z2.mons.find(m => m.guard)); egal([S.riftMax, p.pts], [2, 0], 'point donné deux fois');
});
test('la pierre ne propose que les failles déjà ouvertes', () => {
  nouvellePartie(); quete('q3', 3); S.riftMax = 4; S.riftSel = 4; riftMenu(); cliquer('rs', { d: 10 }); egal(S.riftSel, 4); cliquer('rs', { d: -10 }); egal(S.riftSel, 1);
});
