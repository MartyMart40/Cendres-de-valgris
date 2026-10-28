// Acte II : lieutenants de Valgris, Sanctuaire scellé, Valgris en 3 formes et sa fin.
// v6.15 : les mondes sont tirés au hasard à chaque nouvelle partie ; on remet ici chaque monde à son thème d’origine (Cendres au monde 1).
function mondesFixes() { S.wtheme = {}; for (let w = 1; w <= 7; w++) if (WORLDS[w]) S.wtheme[w] = WORLDS[w].theme0; applyThemes(); S.zones = {}; aller('town'); }
function sanctuaire() { nouvellePartie(); mondesFixes(); quete('q3', 3); quete('q4', 3); quete('q5', 1); aller(antre(2)); invincible(); avancer(.3); return S.cur.mons.find(m => m.bossId === 'valgris'); }
// v5.90 / v6.07 : à zéro de vie, Valgris s’effondre (fausse mort) puis se relève dans la forme suivante, vie pleine
function abattreForme(v) { const k = v.form || 1; tuer(v); attendre(() => (v.form || 1) > k && !v.fake, 6); avancer(.2); }

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
// v6.56 : l’armure vaut 45 % de la vie d’avant le bonus de campagne (campK), elle ne grandit pas avec lui
test('le Forgeron sans visage : l’armure prend les coups, brisée il chancelle et devient fragile', () => {
  nouvellePartie(); aller(zid(2, 0)); invincible(); avancer(.3); const f = monstre('forgeron', 3);
  egal(f.campK, CAMP.mini.hp); egal(f.shellMax, Math.round(f.maxHp / f.campK * .45)); const v = f.hp; hurtMon(f, 100); egal(f.hp, v, 'l’armure ne protège pas');
  hurtMon(f, f.shell + 1); egal(f.shell, 0); ok(f.stun > 0 && f.vuln > 0, 'pas de chancellement');
  const v2 = f.hp; hurtMon(f, 100); egal(v2 - f.hp, 160, 'pas fragile');
  f.vuln = .01; BEHAV.forge(f, .05, S.cur, dist(f, p), 3, f.spd); egal(f.shell, f.shellMax, 'armure non reforgée');
});
test('le Sanctuaire reste scellé tant que 2 des 3 lieutenants ne sont pas vaincus', () => {
  nouvellePartie(); quete('q3', 3); quete('q4', 1); ok(sealOf(antre(2))); battreAcolytes(2, 1); ok(sealOf(antre(2)));
  battreAcolytes(2, 2); egal(S.q.q4.s, 2); ok(!sealOf(antre(2)), 'Sanctuaire encore scellé');
});
// v6.07 / v6.13 : trois formes, chacune avec sa barre pleine (vie d’une forme = vie totale / 3 × 4,2 au monde 1) et 25 % plus de dégâts.
// En plus : courbe des monstres (v6.x, MON_CURVE), boss du début un peu moins solides (v6.45) et bonus de campagne (v6.56, CAMP.boss).
test('Valgris : niveau 20, 1000 points de vie de base, trois formes à barre pleine', () => {
  const v = sanctuaire(); ok(v); egal([v.lvl, MT.valgris.hp, v.formN, v.form], [20, 1000, 3, 1]);
  let h = Math.round(1000 * G(20)); h = Math.round(h * MON_CURVE(20)); h = Math.round(h * (.8 + .2 * 20 / 30)); h = Math.round(h * CAMP.boss.hp);
  h = Math.round(h / VFORMS.n * VFORMS.kw[0]); egal([v.hp, v.maxHp], [h, h]); egal(v.hp, 44008);
  egal(v.dmg[1], Math.round(Math.max(1, Math.round(Math.max(1, Math.round(Math.round(MT.valgris.dmg[1] * G(20)) * EARLY_DMG(20))) * CAMP.boss.dmg)) * VFORMS.dmg));
});
// v5.90 : avec ses formes, la phase 2 commence à la forme 2 (et non plus sous 60 % de vie)
test('phase 2 : Valgris rappelle un écho de chaque lieutenant battu', () => {
  for (const n of [0, 2, 3]) {
    const v = sanctuaire(); for (const b of curWorld().acts[1].acolytes.slice(0, n)) S.aco[b] = 1;
    v.hp = v.maxHp * .6; BEHAV.valgris(v, .05, S.cur, dist(v, p), 3, v.spd); ok(!v.ph2, 'phase 2 avant la forme 2');
    abattreForme(v); egal(v.form, 2); egal(v.hp, v.maxHp, 'forme 2 sans barre pleine'); ok(v.ph2, 'pas de phase 2 à la forme 2');
    egal(vivants().filter(m => m.echo).length, n, n + ' lieutenants battus');
  }
});
test('phase 3 : l’arène rétrécit sous les cendres', () => {
  const v = sanctuaire(); abattreForme(v); ok(!S.cur.shrink, 'rétrécit dès la forme 2'); abattreForme(v); egal(v.form, 3);
  ok(v.ph3 && S.cur.shrink, 'pas de rétrécissement'); const r = S.cur.shrink.r; avancer(2); ok(S.cur.shrink.r < r, 'le cercle ne rétrécit pas');
});
test('à zéro de vie, Valgris tombe deux fois, puis se relève sous sa vraie forme et laisse le choix', () => {
  const v = sanctuaire(); tuer(v); ok(!v.dead && !v.beaten && v.fallen && v.fake > 0, 'pas de fausse mort à la forme 1');
  attendre(() => !v.fake, 6); egal([v.form, v.fallen], [2, false]); abattreForme(v); egal(v.form, 3);
  tuer(v); ok(!v.dead && v.beaten && v.fallen, 'Valgris est mort ou debout');
  attendre(() => S.cine && v.divine != null, 10); ok(!v.fallen && v.divine != null, 'il ne se relève pas');
  attendre(panneauOuvert, 20); ok(textePanneau().includes('Accepter le défi') && textePanneau().includes('Pas encore'), 'pas de choix');
  ok(v.size > 4, 'pas immense'); ok(!panel.querySelector('[data-a="vdefi"]').disabled, 'défi grisé alors que le monde 2 existe');
});
// v6.46 : une zone quittée reste telle quelle 15 minutes (ZONE_KEEP), puis se remet à neuf
test('« Pas encore » : butin normal, quête à rendre, et Valgris revient pour le farm', () => {
  const v = sanctuaire(); const z = S.cur; abattreForme(v); abattreForme(v); tuer(v); attendre(panneauOuvert, 30); cliquer('vpas');
  ok(!z.mons.includes(v), 'Valgris est resté'); egal(S.q.q5.s, 2); ok(z.items.filter(o => o.kind === 'item').length >= 4, 'pas de butin');
  egal(S.world, 1); aller(lastZone(2)); aller(antre(2)); ok(!S.cur.mons.some(m => m.bossId === 'valgris'), 'Valgris revient avant 15 minutes');
  aller(lastZone(2)); z.leftAt = Date.now() - ZONE_KEEP - 1000; aller(antre(2));
  ok(S.cur.mons.some(m => m.bossId === 'valgris' && !m.dead), 'Valgris ne revient pas');
});
