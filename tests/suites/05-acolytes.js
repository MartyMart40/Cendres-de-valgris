// Acolytes de Varsha, porte scellée de l'antre, Varsha.
function zoneAcolyte(b) { const id = acoZone(b); aller(id); return S.cur.mons.find(m => m.bossId === b); }

test('chaque acolyte attend dans sa zone, un niveau au-dessus, avec 200 à 320 points de vie de base', () => {
  nouvellePartie(3);
  for (const b of ['ossira', 'korr', 'meliane']) {
    const m = zoneAcolyte(b); ok(m || zoneDef(acoZone(b)).forme === 'arene', b + ' absent');
    if (m) { egal(m.lvl, zoneDef(acoZone(b)).lvl + 1, b + ' niveau'); entre(MT[b].hp, 200, 320, b + ' vie de base'); }
  }
});
test('Ossira tend des toiles qui ralentissent le héros', () => {
  nouvellePartie(); aller(zid(1, 0)); invincible(); avancer(.5); const m = monstre('ossira', 3); m.at = 0;
  BEHAV.weaver(m, .05, S.cur, dist(m, p), 3, m.spd); const w = S.hz.find(h => h.kind === 'web'); ok(w, 'pas de toile');
  w.arm = 0; avancer(.1); ok(p.webbed, 'le héros n’est pas ralenti');
});
test('Korr annonce sa charge, fonce et laisse une traînée de feu', () => {
  nouvellePartie(); aller(zid(1, 0)); invincible(); const m = monstre('korr', 4); m.at = 0; m.aggro = true;
  BEHAV.charger(m, .05, S.cur, dist(m, p), 4, m.spd); ok(m.tel > 0, 'pas d’annonce');
  for (let i = 0; i < 40 && !S.hz.some(h => h.kind === 'fire'); i++) BEHAV.charger(m, .05, S.cur, dist(m, p), 4, m.spd);
  ok(S.hz.some(h => h.kind === 'fire'), 'pas de traînée de feu');
});
test('Méliane se téléporte et appelle des pleureuses', () => {
  nouvellePartie(); aller(zid(1, 0)); invincible(); avancer(.5); const m = monstre('meliane', 3); m.at = 0; m.at2 = 0; const x = m.x, y = m.y;
  BEHAV.wailer(m, .05, S.cur, dist(m, p), 3, m.spd);
  ok(m.x !== x || m.y !== y, 'pas de téléportation'); ok(vivants().filter(o => o.t === 'pleureuse').length >= 1, 'pas de pleureuses');
});
test('un acolyte vaincu compte, avec un butin de boss', () => {
  nouvellePartie(); quete('q2', 1); aller(zid(1, 0)); const m = monstre('korr'); const n = S.cur.items.filter(o => o.kind === 'item').length;
  tuer(m); egal(S.aco.korr, 1); egal(acoCount(1), 1);
  egal(S.cur.items.filter(o => o.kind === 'item').length - n, 4, 'objets lâchés'); ok(S.cur.items.some(o => o.kind === 'item' && o.it.rar >= 2), 'aucun objet rare');
});
test('l’antre reste scellé tant que 2 des 3 acolytes ne sont pas vaincus', () => {
  nouvellePartie(); quete('q2', 1); const an = antre(1);
  ok(sealOf(an), 'antre ouvert sans acolyte'); battreAcolytes(1, 1); ok(sealOf(an), 'antre ouvert avec 1 acolyte');
  const avant = lastZone(1); aller(avant); const ex = S.cur.objs.find(o => o.type === 'exit' && o.to === an); egal(tryExit(ex), false); egal(S.cur.id, avant);
});
test('2 acolytes brisent le sceau, qui reste ouvert', () => {
  nouvellePartie(); quete('q2', 1); battreAcolytes(1, 2); egal(S.q.q2.s, 2); ok(!sealOf(antre(1)), 'antre encore scellé');
  aller(lastZone(1)); const ex = S.cur.objs.find(o => o.type === 'exit' && o.to === antre(1)); ok(tryExit(ex)); egal(S.cur.id, antre(1));
  S.aco = {}; quete('q2', 3); ok(!sealOf(antre(1)), 'le sceau s’est refermé');
});
test('Varsha : niveau 12, 1200 points de vie de base ; vaincue, elle ouvre la descente vers l’acte II', () => {
  nouvellePartie(); quete('q2', 3); quete('q3', 1); aller(antre(1)); const v = S.cur.mons.find(m => m.bossId === 'varsha');
  ok(v, 'Varsha absente'); egal([v.lvl, MT.varsha.hp], [12, 1200]); egal(v.hp, Math.round(1200 * G(12)));
  tuer(v); egal(S.q.q3.s, 2); ok(S.cur.objs.some(o => o.type === 'exit' && o.to === zid(2, 0)), 'pas de sortie vers l’acte II');
  ok(!vivants().length, 'des monstres survivent à Varsha');
});
