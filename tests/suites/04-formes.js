// Formes de zone : grand couloir, arène, plaine, labyrinthe.
function zoneDeForme(f, a = 1) { for (let s = 1; s < 400; s++) { nouvellePartie(s); const i = actLayout(a).findIndex(l => l.f === f); if (i >= 0) return zid(a, i); } throw new Error('aucune zone ' + f); }

test('grand couloir : long et étroit, avec des alcôves', () => {
  const id = zoneDeForme('couloir'); aller(id); const z = S.cur;
  egal([z.w, z.h], [112, 30]); ok(z.alcoves.length >= 5, 'alcôves : ' + z.alcoves.length);
});
test('grand couloir : embuscades en groupe dans les alcôves', () => {
  const id = zoneDeForme('couloir'); aller(id); const amb = S.cur.mons.filter(m => m.amb);
  ok(amb.length >= 3 * S.cur.alcoves.length - 1, 'monstres en embuscade : ' + amb.length);
  const g = amb[0].amb; hurtMon(amb[0], 1); ok(S.cur.mons.filter(m => m.amb === 0 && m.aggro).length >= 3, 'le groupe ne se réveille pas');
  ok(!S.cur.mons.some(m => m.amb === g), 'un monstre du groupe dort encore');
});
test('grand couloir : des coffres dans les alcôves', () => {
  const id = zoneDeForme('couloir'); aller(id); entre(objetsDe('chest').length, 1, 3);
});
test('arène : la sortie est fermée tant que les vagues ne sont pas vaincues', () => {
  const id = zoneDeForme('arene'); aller(id); const ex = S.cur.objs.find(o => o.type === 'exit' && o.lock);
  ok(ex, 'sortie non verrouillée'); egal(tryExit(ex), false); egal(S.cur.id, id);
});
test('arène : 4 vagues de 5, 7, 9 et 11 monstres, puis la sortie s’ouvre avec un coffre', () => {
  const id = zoneDeForme('arene'); aller(id); invincible(); const z = S.cur, c = z.center; p.x = c[0] + .5; p.y = c[1] + .5;
  const vagues = [];
  for (let w = 0; w < 4; w++) {
    updArena(z); const v = z.mons.filter(m => m.wave && !m.dead); vagues.push(v.filter(m => !m.mini).length); v.forEach(tuer); S.pend = [];
  }
  egal(vagues, [5, 7, 9, 11]); updArena(z); ok(z.arena.done); ok(!z.objs.some(o => o.lock), 'sortie encore fermée');
  ok(objetsDe('chest').length >= 1, 'pas de coffre au centre');
});
test('arène : l’acolyte arrive avec la dernière vague', () => {
  for (let s = 1; s < 400; s++) {
    nouvellePartie(s); const i = actLayout(1).findIndex(l => l.f === 'arene' && l.aco); if (i < 0) continue;
    aller(zid(1, i)); invincible(); const z = S.cur, c = z.center; p.x = c[0] + .5; p.y = c[1] + .5;
    ok(!z.mons.some(m => m.mini), 'acolyte présent avant les vagues');
    for (let w = 0; w < 3; w++) { updArena(z); ok(!z.mons.some(m => m.mini), 'acolyte trop tôt, vague ' + (w + 1)); z.mons.filter(m => m.wave).forEach(tuer); S.pend = []; }
    updArena(z); ok(z.mons.some(m => m.mini && m.bossId === actLayout(1)[i].aco), 'acolyte absent de la dernière vague'); return;
  }
  throw new Error('aucune arène avec acolyte');
});
test('grande plaine : des coffres le long du chemin et des groupes dispersés', () => {
  nouvellePartie(); aller(zid(1, 0)); egal(S.cur.forme, 'plaine'); egal(objetsDe('chest').length, 3); ok(vivants().length >= 30, 'monstres : ' + vivants().length);
});
test('labyrinthe : des salles, avec des coffres dedans', () => {
  const id = zoneDeForme('labyrinthe'); aller(id); ok(S.cur.rooms && S.cur.rooms.length >= 4, 'salles'); ok(objetsDe('chest').length >= 1, 'coffres');
});
