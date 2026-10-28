// Monde 2 : passage, saut de difficulté, nouveaux visages, voyage entre mondes.
// v6.15 : les thèmes des mondes sont tirés au hasard à chaque nouvelle partie (S.wtheme, rollThemes, applyThemes).
// Pour tester le Givre éternel au monde 2, on remet chaque monde à son thème d’origine (Cendres au 1, Givre au 2).
function mondesFixes() { S.wtheme = {}; for (let w = 1; w <= 7; w++) if (WORLDS[w]) S.wtheme[w] = WORLDS[w].theme0; applyThemes(); S.zones = {}; aller('town'); }
// v5.90 / v6.07 : Valgris a trois formes ; il faut l’abattre trois fois avant le choix (la scène finale dure environ 20 s)
function battreValgris(v) { for (let k = 1; k < v.formN; k++) { tuer(v); attendre(() => (v.form || 1) > k && !v.fake, 6); } tuer(v); attendre(panneauOuvert, 30); }
// sansHautsFaits : les hauts faits (v6.x, hfCheck) donnent aussi de l’or ; on les marque d’avance pour mesurer le seul butin d’arrivée
function accepterDefi(sansHautsFaits) {
  nouvellePartie(); mondesFixes(); quete('q3', 3); quete('q4', 3); quete('q5', 1); battreAcolytes(1, 2);
  if (sansHautsFaits) { S.hf = S.hf || {}; for (const h of HF) S.hf[h.id] = 1; }
  p.gold = 500; S.riftMax = 7; p.bag = []; bagAdd(objet('ring', 1)); p.stash[2].push(Object.assign(objet('belt', 2), { gx: 0, gy: 0 }));
  aller(antre(2)); invincible(); avancer(.3); const v = S.cur.mons.find(m => m.bossId === 'valgris');
  battreValgris(v); cliquer('vdefi'); avancer(1.5);
}

test('le tirage des mondes : sept thèmes tous différents, ni Abîme avant le monde 4 ni Astre avant le monde 3', () => {
  for (let n = 1; n <= 40; n++) {
    graine(n); const t = rollThemes(), l = [1, 2, 3, 4, 5, 6, 7].map(w => t[w]);
    ok(l.every(x => THEMES[x]), 'thème inconnu : ' + l.join(', ')); egal(new Set(l).size, 7, 'thème en double');
    ok(l.indexOf('abime') < 0 || l.indexOf('abime') >= 3, 'Abîme trop tôt'); ok(l.indexOf('astre') < 0 || l.indexOf('astre') >= 2, 'Astre trop tôt');
  }
  nouvellePartie(); ok(S.wtheme && THEMES[S.wtheme[2]], 'pas de tirage à la nouvelle partie'); egal(WORLDS[2].theme, S.wtheme[2]);
  mondesFixes(); egal([WORLDS[1].theme, WORLDS[2].theme], ['cendres', 'givre']);
});
test('« Accepter le défi » mène au Refuge de Brumegel, avec héros, sac, coffre et failles', () => {
  accepterDefi(); egal([S.world, S.cur.id, S.cur.def.name], [2, 'town', 'Refuge de Brumegel']);
  egal(S.riftMax, 7); egal(p.bag.length, 1); egal(p.stash[2].length, 1); ok(p.gold >= 500, 'or perdu'); egal(S.qw[1].q5.s, 3);
});
test('saut de difficulté : niveaux + 17, Varsha des Glaces au niveau 29', () => {
  nouvellePartie(); mondesFixes(); setWorld(2); egal(WORLDS[2].lvlAdd, 17); egal(actZones(1).slice(0, 8).map(id => zoneDef(id).lvl), [18, 19, 20, 21, 21, 22, 23, 24]);
  egal(zoneDef(antre(1)).lvl, 27); quete('q2', 3); aller(antre(1)); const v = S.cur.mons.find(m => m.bossId === 'varsha'); egal([v.lvl, v.name], [29, 'Varsha des Glaces']);
});
// La 6.58 a rééquilibré le monde 2 : vie × 1,6, dégâts × 1,2, boss d’acte vie × 0,5 en plus (WORLDS[2].mult).
// On compare au même monstre, même niveau, au monde 1 : seul le multiplicateur du monde change.
test('monstres : vie × 1,6 et dégâts × 1,2 ; boss d’acte : vie × 0,5 en plus', () => {
  egal(WORLDS[2].mult, { hp: 1.6, dmg: 1.2, boss: .5 });
  nouvellePartie(); mondesFixes(); aller(zid(1, 0)); const r1 = monstre('rodeur', 1.5, 20), v1 = monstre('varsha', 1.5, 29), k1 = monstre('korr', 2, 20);
  setWorld(2); aller(zid(1, 0)); const r = monstre('rodeur', 1.5, 20), v = monstre('varsha', 1.5, 29), k = monstre('korr', 2, 20);
  egal(r.hp, Math.round(r1.hp * 1.6)); egal(r.dmg[1], Math.max(1, Math.round(r1.dmg[1] * 1.2)));
  proche(v.hp / v1.hp, 1.6 * .5, .002, 'boss d’acte'); proche(k.hp / k1.hp, 1.6, .002, 'un acolyte n’est pas un boss d’acte');
});
test('le camp change de visages : Vieille Maren, Torvald, Sœur Nivé, Kolbe', () => {
  nouvellePartie(); mondesFixes(); setWorld(2); const noms = ['corvel', 'bram', 'eline', 'hilde'].map(id => pnj(id).name);
  ok(noms[0] === 'Vieille Maren' && noms[1].startsWith('Torvald') && noms[2] === 'Sœur Nivé' && noms[3] === 'Kolbe le forgeron', noms.join(', '));
  npcDialog('corvel'); ok(textePanneau().includes('Vieille Maren') && !textePanneau().includes('Corvel'), 'Corvel apparaît encore');
});
test('mêmes comportements, nouvelles allures : loups de givre, archers gelés, spectres glacés', () => {
  nouvellePartie(); mondesFixes(); setWorld(2); aller(zid(1, 0));
  egal([monstre('charognard').name, monstre('archer').name, monstre('ombre').name.startsWith('Spectre')], ['Loup de givre', 'Archer gelé', true]);
  egal(monstre('charognard').ai, atkAi('charognard', 'givre') || MT.charognard.ai); egal(monN('korr'), 'Korr le Brise-Glace');
});
// Portage 6.58 : le trophée de Valgris (UNIQUES.valgris) est garanti en acceptant le défi, au nom du monde quitté.
test('gros butin à l’arrivée : un légendaire, trois rares, le trophée de Valgris et de l’or', () => {
  accepterDefi(true); const it = S.cur.items.filter(o => o.kind === 'item' && !o.it.uniq).map(o => o.it.rar).sort();
  const u = S.cur.items.filter(o => o.kind === 'item' && o.it.uniq === 'valgris'); egal(u.length, 1, 'trophée de Valgris');
  egal([u[0].it.uth, u[0].it.name, u[0].it.leg], ['cendres', uniqName('valgris', 'cendres'), UNIQUES.valgris.leg]); egal(S.btry.valgris, 0);
  // L'or tombe aux pieds du héros, qui le ramasse tout de suite
  const or = p.gold - 500 + S.cur.items.filter(o => o.kind === 'gold').reduce((a, o) => a + o.v, 0);
  egal(it, [2, 2, 2, 3]); egal(or, Math.round(600 * (1 + .3 * (zoneDef(zid(1, 0)).lvl + 1))), 'or à l’arrivée');
});
test('quêtes et acolytes propres à chaque monde ; retour par la pierre de faille', () => {
  accepterDefi(); ok(Object.values(S.q).every(q => q.s === 0), 'quêtes du monde 2 déjà avancées'); egal(acoCount(1), 0);
  quete('q3', 3); riftMenu(); cliquer('world', { w: 1 }); egal([S.world, S.cur.def.name], [1, THEMES.cendres.camp]);
  egal(acoCount(1), 2); egal(S.q.q5.s, 3); egal(S.qw[2].q3.s, 3);
});
// v6.x : il y a maintenant sept mondes ; le défi n’est grisé qu’au dernier
test('au dernier monde, « Accepter le défi » est grisé', () => {
  const der = Math.max(...Object.keys(WORLDS).map(Number)); egal(der, 7);
  nouvellePartie(); setWorld(der); quete('q4', 3); aller(antre(2)); invincible(); avancer(.3);
  battreValgris(S.cur.mons.find(m => m.bossId === 'valgris'));
  const b = panel.querySelector('[data-a="vdefi"]'); ok(b && b.disabled, 'le défi n’est pas grisé');
});
