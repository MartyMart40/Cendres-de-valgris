// Vrais touchers d'écran sur chaque PNJ et chaque objet du camp.
// Le héros s'approche d'abord (comme un joueur qui marche), la caméra le suit, puis on touche l'écran
async function toucher(o) {
  closePanel(); const f = nearFloor(S.cur, o.x - 1.5, o.y + 1.5); p.x = f[0] + .5; p.y = f[1] + .5; p.path = null; avancer(1);
  await toucherObjet(o); return attendre(panneauOuvert, 10);
}

test('toucher l’Ancien Corvel ouvre son dialogue et donne la première quête', async () => {
  nouvellePartie(); ok(await toucher(pnj('corvel')), 'pas de dialogue'); ok(textePanneau().includes('Ancien Corvel'));
  cliquer('qacc'); egal(S.q.q1.s, 1);
});
test('toucher Bram ouvre la boutique ; une fiole s’achète', async () => {
  nouvellePartie(); p.gold = 500; p.pot = 2; ok(await toucher(pnj('bram')), 'pas de boutique'); ok(textePanneau().includes('Bram'));
  const prix = potPrice(); cliquer('buyp'); egal([p.pot, p.gold], [3, 500 - prix]);
});
test('toucher Sœur Éline soigne la vie et le mana', async () => {
  nouvellePartie(); p.hp = 1; p.mp = 0; ok(await toucher(pnj('eline')), 'pas de dialogue'); egal([p.hp, p.mp], [p.maxHp, p.maxMp]);
});
test('toucher Hilde ouvre la forge', async () => {
  nouvellePartie(); ok(await toucher(pnj('hilde')), 'pas de forge'); ok(textePanneau().includes('Hilde'));
});
test('toucher le coffre l’ouvre ; toucher le point de passage ouvre les voyages', async () => {
  nouvellePartie(); ok(await toucher(objetsDe('stash')[0]), 'coffre fermé'); ok(textePanneau().includes('Coffre'));
  ok(await toucher(objetsDe('wp')[0]), 'point de passage muet'); ok(textePanneau().includes('Point de passage'));
});
test('la pierre de faille ne répond qu’après Varsha', async () => {
  nouvellePartie(); const r = objetsDe('rift')[0]; egal(await toucher(r), false, 'la pierre répond avant Varsha');
  quete('q3', 3); ok(await toucher(r), 'la pierre ne répond pas'); ok(textePanneau().includes('Pierre de faille'));
});
