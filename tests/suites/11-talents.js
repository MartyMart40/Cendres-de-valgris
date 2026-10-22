// Arbre de talents : paliers, points, barre de compétences, réinitialisation.
test('un palier demande un niveau ET des points dans la branche', () => {
  nouvellePartie(); heros(3); ok(!unlocked('whirl'), 'Tourbillon ouvert au niveau 3');
  heros(4); ok(!unlocked('whirl'), 'Tourbillon ouvert sans points dans la branche'); rankUp('mastery', 3); ok(unlocked('whirl'), 'Tourbillon fermé avec niveau 4 et 3 points');
});
test('monter un talent dépense les points, et s’arrête à zéro', () => {
  nouvellePartie(); heros(6); const n = p.pts; egal(rankUp('vigor', 100), n); egal([p.pts, p.sk.vigor], [0, n]); egal(rankUp('vigor', 1), 0);
});
test('les ultimes demandent le niveau 35 et 40 points dans la branche', () => {
  nouvellePartie(); heros(60); ok(!canRank('avatar'), 'ultime ouvert sans points');
  rankUp('mastery', 39); ok(!unlocked('avatar')); rankUp('mastery', 1); ok(unlocked('avatar')); egal(SK.avatar.ti, 5); egal(TL[5], 35);
});
test('une compétence apprise va dans la barre ; on peut la changer de case', () => {
  nouvellePartie(); heros(6); rankUp('mastery', 3); rankUp('whirl', 1); egal(p.bar, ['fire', 'nova', 'whirl', null]);
  talentPanel(); SELT = 'whirl'; talentPanel(); cliquer('bar', { k: 0, s: 'whirl' }); egal(p.bar, ['whirl', 'nova', 'fire', null]);
});
test('tout réinitialiser coûte 50 or par niveau et rend tous les points', () => {
  nouvellePartie(); heros(10); rankUp('skin', 5); p.gold = 600; talentPanel(); cliquer('respec');
  egal([p.gold, p.pts], [100, ptsEarned()]); egal(p.sk, { fire: 1, nova: 1 });
  p.gold = 10; rankUp('skin', 2); talentPanel(); cliquer('respec'); egal(p.sk.skin, 2, 'réinitialisé sans or');
});
test('« +1 à toutes les compétences » monte le niveau effectif, pas le rang', () => {
  nouvellePartie(); p.eq.amulet = { id: 999, type: 'amulet', slot: 'amulet', rar: 1, ilvl: 1, aff: { allSk: 2 } }; recalc();
  egal([p.sk.fire, skLvl('fire'), skLvl('whirl')], [1, 3, 0]);
});
test('talents passifs : Maîtrise +8 % dégâts, Vitalité +7 % vie, Peau de pierre +12 % armure par rang', () => {
  const a = computeStats({}, 10, {}), b = computeStats({}, 10, { mastery: 2, vigor: 3, skin: 1 });
  egal([b.dmgPct - a.dmgPct, b.lifePct - a.lifePct, b.armorPct - a.armorPct, b.crit - a.crit], [16, 21, 12, 2]);
});
test('rangs jusqu’à 1 000 000 avec le bouton « Tout »', () => {
  nouvellePartie(); heros(60); rankUp('mastery', 60); p.pts = 3e6; SELT = 'fury'; talentPanel(); cliquer('rank', { s: 'fury', n: 'max' });
  egal(p.sk.fury, 1e6); egal(p.pts, 2e6); egal(canRank('fury'), false);
});
