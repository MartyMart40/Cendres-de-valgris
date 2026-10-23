// Acte II : lieutenants de Valgris, Sanctuaire scellé, Valgris en 3 phases et sa fin.
function sanctuaire() { nouvellePartie(); quete('q3', 3); quete('q4', 3); quete('q5', 1); aller(antre(2)); invincible(); avancer(.3); return S.cur.mons.find(m => m.bossId === 'valgris'); }

test('lieutenants : un niveau au-dessus de leur zone, 260 à 380 points de vie de base', () => {
  nouvellePartie(4); quete('q3', 3);
  for (const b of ['heraut', 'cineraire', 'forgeron']) {
    entre(MT[b].hp, 260, 380, b); const id = acoZone(b); ok(parseZ(id).a === 2, b + ' hors de l’acte II');
    if (zoneDef(id).forme !== 'arene') { aller(id); const m = S.cur.mons.find(o => o.bossId === b); egal(m.lvl, zoneDef(id).lvl + 1, b); }
  }
});
test('le Héraut gris : son étendard le protège à 85 % et renforce les monstres proches', () => {
  nouvellePartie(); aller(zid(2, 0)); invincible(); avancer(.3); const h = monstre('heraut', 3); h.aggro = true;
  BEHAV.herald(h, .05, S.cur, dist(h, p), 3, h.spd); ok(h.flag && !h.flag.dead, 'pas d’étendard');
  const r = monstre('rodeur', 2); r.x = h.flag.x + .5; r.y = h.flag.y; egal(buffOf(r, S.cur), 1.4);
  const v = h.hp; hurtMon(h, 1000); egal(v - h.hp, 150, 'coup sur le Héraut protégé');
  tuer(h.flag); const v2 = h.hp; hurtMon(h, 1000); egal(v2 - h.hp, 1000, 'coup après l’étendard'); egal(buffOf(r, S.cur), 1);
});
test('Dame Cinéraire couvre le sol de cendre brûlante', () => {
  nouvellePartie(); aller(zid(2, 0)); avancer(.3); const m = monstre('cineraire', 3); m.at = 0;
  BEHAV.cinder(m, .05, S.cur, dist(m, p), 3, m.spd); const a = S.hz.find(h => h.kind === 'ash'); ok(a, 'pas de cendre');
  a.arm = 0; a.x = p.x; a.y = p.y; p.st.block = 0; const v = p.hp; avancer(1); ok(p.hp < v, 'la cendre ne brûle pas');
});
test('le Forgeron sans visage : l’armure prend les coups, brisée il chancelle et devient fragile', () => {
  nouvellePartie(); aller(zid(2, 0)); invincible(); avancer(.3); const f = monstre('forgeron', 3);
  egal(f.shellMax, Math.round(f.maxHp * .45)); const v = f.hp; hurtMon(f, 100); egal(f.hp, v, 'l’armure ne protège pas');
  hurtMon(f, f.shell + 1); egal(f.shell, 0); ok(f.stun > 0 && f.vuln > 0, 'pas de chancellement');
  const v2 = f.hp; hurtMon(f, 100); egal(v2 - f.hp, 160, 'pas fragile');
  f.vuln = .01; BEHAV.forge(f, .05, S.cur, dist(f, p), 3, f.spd); egal(f.shell, f.shellMax, 'armure non reforgée');
});
test('le Sanctuaire reste scellé tant que 2 des 3 lieutenants ne sont pas vaincus', () => {
  nouvellePartie(); quete('q3', 3); quete('q4', 1); ok(sealOf(antre(2))); battreAcolytes(2, 1); ok(sealOf(antre(2)));
  battreAcolytes(2, 2); egal(S.q.q4.s, 2); ok(!sealOf(antre(2)), 'Sanctuaire encore scellé');
});
// CONCEPTION.md disait « environ 18 000 » : le jeu v5.8 donne 1000 × G(20), soit 9 729.
test('Valgris : niveau 20, 1000 points de vie de base (9 729 au niveau 20)', () => {
  const v = sanctuaire(); ok(v); egal([v.lvl, MT.valgris.hp, v.hp], [20, 1000, Math.round(1000 * G(20))]); egal(v.hp, 9729);
});
test('phase 2 : Valgris rappelle un écho de chaque lieutenant battu', () => {
  for (const n of [0, 2, 3]) {
    const v = sanctuaire(); for (const b of curWorld().acts[1].acolytes.slice(0, n)) S.aco[b] = 1;
    v.hp = v.maxHp * .6; BEHAV.valgris(v, .05, S.cur, dist(v, p), 3, v.spd); ok(v.ph2);
    egal(vivants().filter(m => m.echo).length, n, n + ' lieutenants battus');
  }
});
test('phase 3 : l’arène rétrécit sous les cendres', () => {
  const v = sanctuaire(); v.hp = v.maxHp * .3; v.ph2 = true; BEHAV.valgris(v, .05, S.cur, dist(v, p), 3, v.spd);
  ok(v.ph3 && S.cur.shrink, 'pas de rétrécissement'); const r = S.cur.shrink.r; avancer(2); ok(S.cur.shrink.r < r, 'le cercle ne rétrécit pas');
});
test('à zéro de vie, Valgris tombe, se relève sous sa vraie forme et laisse le choix', () => {
  const v = sanctuaire(); tuer(v); ok(!v.dead && v.beaten && v.fallen, 'Valgris est mort ou debout');
  attendre(() => S.cine && S.cine.step >= 3, 5); ok(!v.fallen && v.divine != null, 'il ne se relève pas');
  attendre(panneauOuvert, 6); ok(textePanneau().includes('Accepter le défi') && textePanneau().includes('Pas encore'), 'pas de choix');
  ok(v.size > 4, 'pas immense'); ok(!panel.querySelector('[data-a="vdefi"]').disabled, 'défi grisé alors que le monde 2 existe');
});
test('« Pas encore » : butin normal, quête à rendre, et Valgris revient pour le farm', () => {
  const v = sanctuaire(); const z = S.cur; tuer(v); attendre(panneauOuvert, 12); cliquer('vpas');
  ok(!z.mons.includes(v), 'Valgris est resté'); egal(S.q.q5.s, 2); ok(z.items.filter(o => o.kind === 'item').length >= 4, 'pas de butin');
  egal(S.world, 1); aller(lastZone(2)); z.left = performance.now() - 100000; aller(antre(2));
  ok(S.cur.mons.some(m => m.bossId === 'valgris' && !m.dead), 'Valgris ne revient pas');
});
