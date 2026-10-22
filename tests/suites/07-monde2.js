// Monde 2, Givre éternel : passage, saut de difficulté, nouveaux visages, voyage entre mondes.
function accepterDefi() {
  nouvellePartie(); quete('q3', 3); quete('q4', 3); quete('q5', 1); battreAcolytes(1, 2);
  p.gold = 500; S.riftMax = 7; p.bag = []; bagAdd(objet('ring', 1)); p.stash[2].push(Object.assign(objet('belt', 2), { gx: 0, gy: 0 }));
  aller(zid(2, 5)); invincible(); avancer(.3); const v = S.cur.mons.find(m => m.bossId === 'valgris');
  tuer(v); attendre(panneauOuvert, 12); cliquer('vdefi'); avancer(1.5);
}

test('« Accepter le défi » mène au Refuge de Brumegel, avec héros, sac, coffre et failles', () => {
  accepterDefi(); egal([S.world, S.cur.id, S.cur.def.name], [2, 'town', 'Refuge de Brumegel']);
  egal(S.riftMax, 7); egal(p.bag.length, 1); egal(p.stash[2].length, 1); ok(p.gold >= 500, 'or perdu'); egal(S.qw[1].q5.s, 3);
});
test('saut de difficulté : niveaux + 17, Varsha des Glaces au niveau 29', () => {
  nouvellePartie(); setWorld(2); egal(actZones(1).slice(0, 5).map(id => zoneDef(id).lvl), [18, 20, 21, 23, 24]);
  egal(zoneDef(zid(1, 5)).lvl, 27); quete('q2', 3); aller(zid(1, 5)); const v = S.cur.mons.find(m => m.bossId === 'varsha'); egal([v.lvl, v.name], [29, 'Varsha des Glaces']);
});
test('monstres : vie × 1,25 et dégâts × 1,12 ; boss d’acte : vie × 0,55 en plus', () => {
  nouvellePartie(); setWorld(2); aller(zid(1, 0)); const r = monstre('rodeur', 1.5, 20);
  egal(r.hp, Math.round(Math.round(MT.rodeur.hp * G(20)) * 1.25)); egal(r.dmg[1], Math.max(1, Math.round(Math.round(MT.rodeur.dmg[1] * G(20)) * 1.12)));
  const v = monstre('varsha'); egal(v.hp, Math.round(Math.round(1200 * G(29)) * 1.25 * .55));
  const k = monstre('korr', 2, 20); egal(k.hp, Math.round(Math.round(MT.korr.hp * G(20)) * 1.25), 'un acolyte n’est pas un boss d’acte');
});
test('le camp change de visages : Vieille Maren, Torvald, Sœur Nivé, Kolbe', () => {
  nouvellePartie(); setWorld(2); const noms = ['corvel', 'bram', 'eline', 'hilde'].map(id => pnj(id).name);
  ok(noms[0] === 'Vieille Maren' && noms[1].startsWith('Torvald') && noms[2] === 'Sœur Nivé' && noms[3] === 'Kolbe le forgeron', noms.join(', '));
  npcDialog('corvel'); ok(textePanneau().includes('Vieille Maren') && !textePanneau().includes('Corvel'), 'Corvel apparaît encore');
});
test('mêmes comportements, nouvelles allures : loups de givre, archers gelés, spectres glacés', () => {
  nouvellePartie(); setWorld(2); aller(zid(1, 0));
  egal([monstre('charognard').name, monstre('archer').name, monstre('ombre').name.startsWith('Spectre')], ['Loup de givre', 'Archer gelé', true]);
  egal(monstre('charognard').ai, MT.charognard.ai); egal(monN('korr'), 'Korr le Brise-Glace');
});
test('gros butin à l’arrivée : un légendaire, trois rares et de l’or', () => {
  accepterDefi(); const it = S.cur.items.filter(o => o.kind === 'item').map(o => o.it.rar).sort();
  // L'or tombe aux pieds du héros, qui le ramasse tout de suite
  const or = p.gold - 500 + S.cur.items.filter(o => o.kind === 'gold').reduce((a, o) => a + o.v, 0);
  egal(it, [2, 2, 2, 3]); egal(or, Math.round(600 * (1 + .3 * (zoneDef(zid(1, 0)).lvl + 1))), 'or à l’arrivée');
});
test('quêtes et acolytes propres à chaque monde ; retour par la pierre de faille', () => {
  accepterDefi(); ok(Object.values(S.q).every(q => q.s === 0), 'quêtes du monde 2 déjà avancées'); egal(acoCount(1), 0);
  quete('q3', 3); riftMenu(); cliquer('world', { w: 1 }); egal([S.world, S.cur.def.name], [1, 'Camp de Halveth']);
  egal(acoCount(1), 2); egal(S.q.q5.s, 3); egal(S.qw[2].q3.s, 3);
});
test('au dernier monde, « Accepter le défi » est grisé', () => {
  nouvellePartie(); setWorld(2); quete('q4', 3); aller(zid(2, 5)); invincible(); avancer(.3);
  tuer(S.cur.mons.find(m => m.bossId === 'valgris')); attendre(panneauOuvert, 12);
  const b = panel.querySelector('[data-a="vdefi"]'); ok(b && b.disabled, 'le défi n’est pas grisé');
});
