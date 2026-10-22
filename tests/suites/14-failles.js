// Failles sans fin : 50 monstres, un gardien, la faille suivante, les records.
function enFaille(n = 1) { nouvellePartie(); heros(20); quete('q3', 3); S.riftMax = n; S.riftSel = n; riftMenu(); cliquer('rift'); invincible(); return S.cur; }

test('les failles s’ouvrent après Varsha', () => {
  nouvellePartie(); ok(!riftOpen()); quete('q3', 2); ok(riftOpen());
  const z = enFaille(3); egal([z.id, z.def.rift, z.def.lvl], ['rift', 3, 9]);
});
test('50 monstres abattus font surgir le gardien', () => {
  const z = enFaille(); egal(z.def.goal, 50);
  for (let i = 0; i < 49; i++) tuer(monstre('rodeur')); ok(!z.guardSpawned, 'gardien trop tôt'); tuer(monstre('rodeur'));
  ok(z.guardSpawned && z.mons.some(m => m.guard && !m.dead), 'pas de gardien');
});
test('le gardien vaincu ouvre la faille suivante, donne un point la première fois, et note le record', () => {
  const z = enFaille(); const pts = p.pts; z.t0 = S.t - 125; for (let i = 0; i < 50; i++) tuer(monstre('rodeur'));
  tuer(z.mons.find(m => m.guard)); ok(z.done); egal([S.riftMax, p.pts - pts, S.rec[1]], [2, 1, 125]);
  ok(z.objs.some(o => o.type === 'exit' && o.to === 'town'), 'pas de retour au camp');
  const z2 = enFaille(1); S.riftMax = 2; p.pts = 0; for (let i = 0; i < 50; i++) tuer(monstre('rodeur')); tuer(z2.mons.find(m => m.guard)); egal([S.riftMax, p.pts], [2, 0], 'point donné deux fois');
});
test('la pierre ne propose que les failles déjà ouvertes', () => {
  nouvellePartie(); quete('q3', 3); S.riftMax = 4; S.riftSel = 4; riftMenu(); cliquer('rs', { d: 10 }); egal(S.riftSel, 4); cliquer('rs', { d: -10 }); egal(S.riftSel, 1);
});
