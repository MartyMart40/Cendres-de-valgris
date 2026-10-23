// Tirage des actes : 8 zones tirées avec la graine de la partie, puis l'antre du boss.
test('même graine, même tirage ; autre graine, autre tirage', () => {
  egal(rollAct(1, 1, 1234), rollAct(1, 1, 1234));
  const diff = [1, 2, 3, 4, 5].some(s => JSON.stringify(rollAct(1, 1, s)) !== JSON.stringify(rollAct(1, 1, 999)));
  ok(diff, 'le tirage ne change jamais');
});
test('le tirage est gardé dans la partie et ne change plus', () => {
  nouvellePartie(5); const a = JSON.stringify(actLayout(1)); S.seed = 777; egal(JSON.stringify(actLayout(1)), a);
});
test('acte I : 8 zones puis l’Antre de Varsha', () => {
  nouvellePartie(); egal(actZones(1).length, 9); egal(antre(1), zid(1, 8));
  const d = zoneDef(antre(1)); ok(d.last); egal([d.name, d.boss, d.lvl], ['Antre de Varsha', 'varsha', 10]);
});
test('la première zone est toujours la Plaine des Cendres', () => {
  for (let s = 1; s <= 30; s++) { const l = rollAct(1, 1, s * 7919); egal([l[0].f, l[0].n], ['plaine', 0]); }
  nouvellePartie(); egal(zoneDef(zid(1, 0)).name, 'Plaine des Cendres');
});
test('deux zones qui se suivent n’ont jamais la même forme', () => {
  for (let s = 1; s <= 200; s++) for (const a of [1, 2]) { const l = rollAct(1, a, s * 104729); for (let i = 1; i < l.length; i++) ok(l[i].f !== l[i - 1].f, `graine ${s}, acte ${a}, zone ${i}`); }
});
test('acte I : niveaux 1 à 7, points de passage en zones 1, 3, 5, 7 et 8', () => {
  nouvellePartie(); egal(actZones(1).slice(0, 8).map(id => zoneDef(id).lvl), [1, 2, 3, 4, 4, 5, 6, 7]);
  egal(actZones(1).slice(0, 8).map(id => zoneDef(id).wp), [true, false, true, false, true, false, true, true]);
});
test('acte II : niveaux 11 à 17, noms propres à l’acte II, Sanctuaire niveau 19', () => {
  nouvellePartie(); egal(actZones(2).slice(0, 8).map(id => zoneDef(id).lvl), [11, 12, 13, 14, 14, 15, 16, 17]);
  const noms2 = Object.values(THEMES.cendres.names2).flat().map(n => n[0]);
  for (const id of actZones(2).slice(0, 8)) ok(noms2.includes(zoneDef(id).name), zoneDef(id).name);
  egal([zoneDef(antre(2)).name, zoneDef(antre(2)).lvl], ['Sanctuaire de Valgris', 19]);
});
test('un acolyte par zone tirée, jamais dans la première', () => {
  for (let s = 1; s <= 40; s++) {
    nouvellePartie(s); for (const a of [1, 2]) {
      const l = actLayout(a); ok(!l[0].aco, 'acolyte en zone 1');
      egal(l.filter(x => x.aco).map(x => x.aco).sort(), [...curWorld().acts[a - 1].acolytes].sort());
    }
  }
});
test('toutes les zones des deux actes se génèrent avec une sortie atteignable', () => {
  for (const s of [1, 2, 3]) {
    nouvellePartie(s); for (const a of [1, 2]) for (const id of actZones(a)) {
      const z = makeZone(id); ok(z.w > 0 && z.spawn, id);
      for (const o of z.objs.filter(o => o.type === 'exit')) ok(z.distE[Math.floor(o.y) * z.w + Math.floor(o.x)] >= 0, `${id} : sortie vers ${o.to} inatteignable`);
      if (!zoneDef(id).last) ok(z.objs.some(o => o.type === 'exit' && o.to === zid(a, parseZ(id).i + 1)), id + ' sans sortie vers la suite');
    }
  }
});

// v5.11 : 8 zones tirées par acte
test('acte II : 8 zones puis le Sanctuaire de Valgris', () => {
  nouvellePartie(); egal(actZones(2).length, 9); egal(antre(2), zid(2, 8)); ok(zoneDef(antre(2)).last); egal(lastZone(2), zid(2, 7));
});
test('8 zones : les noms d’un même acte ne se répètent jamais', () => {
  for (let s = 1; s <= 100; s++) for (const a of [1, 2]) { const l = rollAct(1, a, s * 7919); egal(l.length, 8); egal(new Set(l.map(x => x.f + x.n)).size, 8, `graine ${s}, acte ${a}`); }
});
test('8 zones : au plus une arène par acte, et les 4 formes sont toutes présentes', () => {
  for (let s = 1; s <= 100; s++) for (const a of [1, 2]) { const f = rollAct(1, a, s * 31).map(x => x.f); ok(f.filter(x => x === 'arene').length <= 1, `graine ${s}`); egal(new Set(f).size, 4, `graine ${s}, acte ${a}`); }
});
test('8 zones : point de passage dans la dernière zone avant l’antre', () => {
  nouvellePartie(); ok(zoneDef(lastZone(1)).wp); ok(zoneDef(lastZone(2)).wp); ok(!zoneDef(antre(1)).wp);
});
test('8 zones : la quête de Varsha parle de la dernière zone tirée', () => {
  nouvellePartie(); quete('q3', 1); ok(QUESTS.q3.track[1]().includes(zoneDef(lastZone(1)).name), 'mauvaise zone');
});
test('8 zones : les niveaux montent sans jamais redescendre', () => {
  for (const s of [1, 2, 3]) { nouvellePartie(s); for (const a of [1, 2]) { const l = actZones(a).map(id => zoneDef(id).lvl); for (let i = 1; i < l.length; i++) ok(l[i] >= l[i - 1], `graine ${s}, acte ${a}, zone ${i}`); } }
});
test('8 zones : un point de passage de la dernière zone mène au bon endroit', () => {
  nouvellePartie(); S.wps[lastZone(1)] = 1; closePanel(); enterZone(lastZone(1), 'wp'); egal(S.cur.id, zid(1, 7));
  ok(S.cur.objs.some(o => o.type === 'exit' && o.to === antre(1)), 'pas de sortie vers l’antre');
});
