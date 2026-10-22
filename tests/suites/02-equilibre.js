// Règles d'équilibre du document de conception.
test('courbe de puissance G(L) = (1 + 0,15 (L - 1)) × 1,05^(L - 1)', () => {
  egal(G(1), 1);
  for (const L of [2, 10, 20, 50, 100]) proche(G(L), (1 + .15 * (L - 1)) * Math.pow(1.05, L - 1), 1e-9, 'G(' + L + ')');
});
test('expérience pour monter : 50 × niveau^1,6', () => {
  for (const l of [1, 5, 20, 60]) egal(xpNext(l), Math.floor(50 * Math.pow(l, 1.6)));
});
test('failles : monstres de niveau 6 + n, vie × 1,10^n, dégâts × 1,055^n', () => {
  for (const n of [1, 10, 40]) egal(riftDef(n).lvl, 6 + n, 'faille ' + n);
  egal([RIFT_HP, RIFT_DMG], [1.10, 1.055]);
  nouvellePartie(); const z = makeZone('rift', riftDef(10)); const m = spawnMon(z, 'rodeur', z.spawn.x, z.spawn.y, false);
  egal(m.hp, Math.round(Math.round(MT.rodeur.hp * G(16)) * Math.pow(1.10, 10)));
});
test('réduction par l’armure : armure ÷ (armure + 30 × G), au plus 85 %', () => {
  nouvellePartie(); aller(zid(1, 0)); heros(10);
  p.st.block = 0; p.st.second = 0; p.st.thorns = 0; p.hp = p.maxHp = 1e9;
  const A = p.st.armorT, avant = p.hp; hurtPlayer(1000, 5);
  egal(avant - p.hp, Math.max(1, Math.round(1000 * (1 - Math.min(.85, A / (A + 30 * G(5)))))));
  p.st.armorT = 1e9; const av2 = p.hp; hurtPlayer(1000, 5); egal(av2 - p.hp, 150, 'plafond 85 %');
});
test('plafonds : 6 attaques par seconde, 60 % blocage, 20 % vol de vie, 75 % critique, 6 % de vie par seconde', () => {
  const eq = { weapon: { type: 'dagger', slot: 'weapon', d: [5, 9], spd: 1.3, aff: { aspd: 900, block: 900, leech: 900, crit: 900 } } };
  const s = computeStats(eq, 30, { frenzy: 500, regen: 500 });
  egal([s.aps, s.block, s.leech, s.crit, s.regenHp], [6, 60, 20, 75, 6]);
});
test('vie de base du héros suit la courbe G', () => {
  for (const L of [1, 12, 40]) egal(computeStats({}, L, {}).maxHp, Math.round(50 * G(L) * (1 + (L - 1) / 100)));
});
test('points de talent : 1 par niveau, 1 de plus tous les 5 niveaux, 1 par nouvelle faille', () => {
  nouvellePartie(); p.lvl = 1; p.xp = 0; p.pts = 0;
  gainXp(xpNext(1) + xpNext(2) + xpNext(3) + xpNext(4)); egal([p.lvl, p.pts], [5, 5], 'niveaux 2 à 5');
  S.riftMax = 4; p.lvl = 10; egal(ptsEarned(), 9 + 2 + 3);
});
test('mort : le héros perd 10 % de son or et peut revenir au camp', () => {
  nouvellePartie(); aller(zid(1, 0)); p.gold = 1000; p.st.block = 0; p.st.second = 0; p.hp = 1;
  hurtPlayer(1e9, 1); ok(p.dead); egal(p.gold, 900);
  attendre(panneauOuvert, 3); cliquer('revive'); ok(!p.dead); egal(S.cur.id, 'town'); egal(p.hp, p.maxHp);
});
