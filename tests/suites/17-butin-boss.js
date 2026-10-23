// Butin propre à chaque boss : catalogue BOSSLOOT, chance et garantie, monde 2, défi de Valgris,
// pouvoirs des 8 objets, sauvegarde, coffre, forge et infobulle.

const BOSS_M1 = ['ossira', 'korr', 'meliane', 'varsha', 'heraut', 'cineraire', 'forgeron', 'valgris'];
const SLOT_DE = { ossira: 'gloves', korr: 'boots', meliane: 'amulet', varsha: 'armor', heraut: 'offhand', cineraire: 'helm', forgeron: 'weapon', valgris: 'ring' };
function butinsAuSol(z = S.cur) { return z.items.filter(o => o.kind === 'item' && o.it.boss).map(o => o.it); }
// Équipe l'objet de ce boss (niveau 20 par défaut) et recalcule
function porter(boss, niv = 20) { const it = genBossItem(boss, niv); const sl = it.slot === 'ring' ? 'ring1' : it.slot; p.eq[sl] = it; recalc(); return it; }
// Zone de combat vide, héros niveau 20 invincible
function arene(niv = 20) { nouvellePartie(); heros(niv); aller(zid(1, 0)); S.cur.mons = []; invincible(); }
// Monstre immobile et solide pour mesurer les coups
function cible(dx = 1.5) { const m = monstre('brute', dx, 20); m.hp = m.maxHp = 1e9; m.stun = 1e9; return m; }
function coup(m, f) { graine(7); const h = m.hp; f(); return h - m.hp; }
function recharger() { save(); const sv = loadSave(); startGame(sv); S.pend = []; closePanel(); return sv; }
function avecHasard(v, f) { const r = Math.random; Math.random = () => v; try { return f(); } finally { Math.random = r; } }

/* ---------- Catalogue ---------- */
test('catalogue : un objet par boss du monde 1, identifiants uniques et distincts des légendaires', () => {
  egal(BOSSLOOT.map(b => b.boss).sort(), BOSS_M1.slice().sort());
  const ids = BOSSLOOT.map(b => b.id); egal(new Set(ids).size, 8); ok(ids.every(i => !LEGS.some(l => l.id === i)), 'même identifiant qu’un légendaire');
  ok(BOSSLOOT.every(b => BOSSES[b.boss]), 'boss inconnu');
});
test('catalogue : 8 emplacements différents, types existants, chance entre 1 sur 20 et 1 sur 8', () => {
  const sl = BOSSLOOT.map(b => TYPES[b.type] && TYPES[b.type].slot); ok(sl.every(Boolean), 'type inconnu'); egal(new Set(sl).size, 8);
  for (const b of BOSSLOOT) { entre(b.ch, 1 / 20, 1 / 8, b.id); egal(TYPES[b.type].slot, SLOT_DE[b.boss] === 'weapon' ? 'weapon' : SLOT_DE[b.boss]); }
  proche(bossLootOf('korr').ch, 1 / 12, 1e-9); proche(bossLootOf('varsha').ch, 1 / 10, 1e-9); proche(bossLootOf('valgris').ch, 1 / 10, 1e-9); egal(BOSS_PITY, 25);
});
test('catalogue : les bonus fixes sont permis à leur emplacement', () => {
  for (const b of BOSSLOOT) for (const a of b.fix) ok(AFX[a] && AFX[a].sl.includes(TYPES[b.type].slot), `${b.id} : ${a}`);
});
test('catalogue : noms et pouvoirs écrits, nom cendres toujours là, aucun tiret quadratin', () => {
  const txt = JSON.stringify(BOSSLOOT); ok(!txt.includes('—'), 'tiret quadratin');
  for (const b of BOSSLOOT) { ok(b.n.cendres && b.p.length > 20, b.id); ok(!LEGS.some(l => l.n === b.n.cendres), 'nom déjà pris : ' + b.n.cendres); }
});
test('un tirage normal ne donne jamais un objet de boss', () => {
  graine(3); for (let i = 0; i < 3000; i++) { const it = genItem(ri(1, 60), 3, 0); ok(!it.boss && !bossLootOf(it.leg) && !BOSSLOOT.some(b => b.id === it.leg), it.name); }
});

/* ---------- Génération ---------- */
test('objet de boss : légendaire orange, pouvoir, nom, bon emplacement, niveau demandé', () => {
  nouvellePartie(); for (const b of BOSSLOOT) { const it = genBossItem(b.boss, 15);
    egal([it.rar, it.leg, it.boss, it.bth, it.name, it.power, it.ilvl], [3, b.id, b.boss, 'cendres', b.n.cendres, b.p, 15]); egal(it.slot, TYPES[b.type].slot); }
});
test('bonus fixes toujours présents, au-dessus de la base du type (vitesse des bottes, critiques de la masse)', () => {
  nouvellePartie(); graine(4); for (let i = 0; i < 60; i++) for (const b of BOSSLOOT) { const it = genBossItem(b.boss, ri(1, 50)); for (const a of b.fix) ok(it.aff[a] > 0, `${b.id} sans ${a}`); }
  for (let i = 0; i < 40; i++) { ok(genBossItem('korr', 10).aff.move > TYPES.boots.move, 'bottes sans bonus de vitesse'); ok(genBossItem('forgeron', 10).aff.critDmg > TYPES.mace.cd, 'masse sans bonus'); }
});
test('bornes v5.12 : aucun objet de boss ne dépasse la borne de ses bonus, du niveau 1 au niveau 100', () => {
  nouvellePartie(); graine(5); let n = 0;
  for (let L = 1; L <= 100; L += 3) for (const b of BOSSLOOT) for (let k = 0; k < 6; k++) { const it = genBossItem(b.boss, L), c = JSON.parse(JSON.stringify(it)); egal(capItem(c), 0, `${b.id} niveau ${L}`);
    for (const a in it.aff) ok(it.aff[a] <= AFX[a].max(L), `${b.id} ${a}`); n++; }
  ok(n > 1500);
});
test('courbe G : un objet de boss plus haut a des valeurs plus hautes', () => {
  nouvellePartie(); graine(6); const m = L => { let s = 0; for (let i = 0; i < 80; i++) s += genBossItem('heraut', L).a; return s / 80; };
  const a = m(10), b = m(40); proche(b / a, G(40) / G(10), G(40) / G(10) * .1);
});
test('description : le nom du boss apparaît, avec le bon article', () => {
  nouvellePartie(); const l = id => itemLines(genBossItem(id, 10));
  ok(l('korr').includes('Butin de Korr le Brûle-Tombes')); ok(l('heraut').includes('Butin du Héraut gris')); ok(l('forgeron').includes('Butin du Forgeron sans visage'));
  ok(l('cineraire').includes('Butin de Dame Cinéraire')); ok(l('varsha').includes('Butin de Varsha, Mère des Cendres')); ok(l('valgris').includes('Butin de Valgris'));
  ok(l('ossira').some(t => t.startsWith('★ ')), 'pouvoir absent');
});

/* ---------- Monde 2 ---------- */
test('monde 2 : même objet renommé au thème, boss renommé dans la description', () => {
  nouvellePartie(); setWorld(2); const k = genBossItem('korr', 30), v = genBossItem('varsha', 30), h = genBossItem('heraut', 30);
  egal([k.name, k.bth, k.leg], ['Semelles du Brise-Glace', 'givre', 'braise']); ok(itemLines(k).includes('Butin de Korr le Brise-Glace'));
  ok(itemLines(v).includes('Butin de Varsha des Glaces')); ok(itemLines(h).includes('Butin du Héraut blanc')); egal(h.name, 'Pavois du Héraut blanc');
});
test('monde 2 : un nom manquant reprend celui des cendres ; l’objet garde son nom de retour au monde 1', () => {
  nouvellePartie(); setWorld(2); const s = genBossItem('valgris', 30), k = genBossItem('korr', 30); egal(s.name, 'Sceau de l’Imbattable');
  setWorld(1); ok(itemLines(k).includes('Butin de Korr le Brise-Glace')); egal(k.name, 'Semelles du Brise-Glace');
});
test('monde 2 : tuer un acolyte donne son objet au thème du givre', () => {
  nouvellePartie(); setWorld(2); heros(30); aller(zid(1, 0)); S.cur.mons = []; invincible(); S.btry = { korr: BOSS_PITY - 1 }; const m = monstre('korr', 2); tuer(m);
  const b = butinsAuSol(); egal(b.length, 1); egal([b[0].bth, b[0].name, b[0].ilvl], ['givre', 'Semelles du Brise-Glace', m.lvl + 1]);
});

/* ---------- Chute, chance et garantie ---------- */
test('tuer Korr : à la garantie, son objet tombe à ses pieds et le compteur repart à zéro', () => {
  arene(); S.btry = { korr: BOSS_PITY - 1 }; const m = monstre('korr', 2); tuer(m);
  const b = butinsAuSol(); egal(b.length, 1); egal([b[0].boss, b[0].leg, b[0].ilvl], ['korr', 'braise', m.lvl + 1]); egal(S.btry.korr, 0);
});
test('malchance : 24 victoires sans objet, la 25e le donne à coup sûr', () => {
  nouvellePartie(); S.btry = {}; avecHasard(.999, () => { for (let i = 1; i < BOSS_PITY; i++) { ok(!rollBossLoot('ossira'), 'tombé trop tôt'); egal(S.btry.ossira, i); } ok(rollBossLoot('ossira'), 'pas de garantie'); });
  egal(S.btry.ossira, 0);
});
test('chaque boss a son propre compteur', () => {
  nouvellePartie(); S.btry = {}; avecHasard(.999, () => { for (let i = 0; i < 5; i++) rollBossLoot('korr'); rollBossLoot('heraut'); });
  egal([S.btry.korr, S.btry.heraut, S.btry.meliane], [5, 1, undefined]);
});
test('chance mesurée : environ 1 sur 12 pour un acolyte, 1 sur 10 pour Varsha', () => {
  nouvellePartie(); graine(11); const mesure = id => { let n = 0; for (let i = 0; i < 20000; i++) { S.btry = {}; if (rollBossLoot(id)) n++; } return n / 20000; };
  proche(mesure('meliane'), 1 / 12, .008); proche(mesure('varsha'), 1 / 10, .008);
});
test('découverte d’objets : aide un peu, jamais plus de 1,5 fois', () => {
  nouvellePartie(); S.btry = {}; p.st.mf = 200; ok(avecHasard(1 / 12 * 1.49, () => rollBossLoot('korr')), 'la découverte n’aide pas');
  S.btry = {}; p.st.mf = 5000; ok(!avecHasard(1 / 12 * 1.51, () => rollBossLoot('korr')), 'plus de 1,5 fois'); recalc();
});
test('monstres, champions et échos : jamais d’objet de boss', () => {
  arene(); graine(12); S.btry = {}; for (let i = 0; i < 200; i++) tuer(monstre('rodeur', 2)); for (let i = 0; i < 40; i++) { const f = nearFloor(S.cur, p.x + 2, p.y); tuer(spawnMon(S.cur, 'archer', f[0] + .5, f[1] + .5, true)); }
  const e = monstre('korr', 2); e.echo = true; e.noLoot = true; S.btry.korr = BOSS_PITY - 1; tuer(e);
  egal(butinsAuSol().length, 0); egal(Object.keys(S.btry).filter(k => S.btry[k]), ['korr']);
});
test('Varsha : son objet tombe dans l’antre', () => {
  nouvellePartie(); heros(14); aller(antre(1)); invincible(); avancer(.2); const v = S.cur.mons.find(m => m.bossId === 'varsha'); ok(v, 'pas de Varsha');
  S.btry = { varsha: BOSS_PITY - 1 }; tuer(v); const b = butinsAuSol(); egal(b.length, 1); egal([b[0].leg, b[0].slot], ['mue', 'armor']);
});
test('Valgris, « Pas encore » : son objet peut tomber, comme pour un autre boss', () => {
  nouvellePartie(); quete('q4', 3); quete('q5', 1); aller(antre(2)); invincible(); avancer(.3); const v = S.cur.mons.find(m => m.bossId === 'valgris');
  S.btry = { valgris: BOSS_PITY - 1 }; tuer(v); attendre(panneauOuvert, 12); cliquer('vpas'); const b = butinsAuSol(); egal(b.length, 1); egal([b[0].leg, b[0].name], ['sceau', 'Sceau de l’Imbattable']);
});
test('« Accepter le défi » : l’objet de Valgris est garanti à l’arrivée, en plus du légendaire', () => {
  nouvellePartie(); quete('q3', 3); quete('q4', 3); quete('q5', 1); battreAcolytes(1, 2); S.btry = { valgris: 7 };
  aller(antre(2)); invincible(); avancer(.3); tuer(S.cur.mons.find(m => m.bossId === 'valgris')); attendre(panneauOuvert, 12); cliquer('vdefi'); avancer(1.5);
  egal(S.world, 2); const b = butinsAuSol().concat(p.bag.filter(it => it.boss)); egal(b.length, 1); egal([b[0].leg, b[0].bth, b[0].ilvl], ['sceau', 'cendres', zoneDef(zid(1, 0)).lvl + 2]); egal(S.btry.valgris, 0);
  ok(S.cur.items.map(o => o.it).concat(p.bag).some(it => it && it.rar === 3 && !it.boss), 'le légendaire habituel a disparu');
});

/* ---------- Pouvoirs ---------- */
test('Fileuses d’Ossira : les coups ralentissent l’ennemi 2 s', () => {
  arene(); porter('ossira'); const m = cible(); m.stun = 0; hitMon(m, 1, false); proche(m.web, 2, 1e-9); avancer(2.2); egal(m.web, 0);
  const sans = cible(); p.eq.gloves = null; recalc(); hitMon(sans, 1, false); ok(!sans.web, 'ralenti sans les gants');
});
test('Semelles du Brûle-Tombes : traînée de feu en marchant, qui brûle un ennemi dedans', () => {
  arene(); porter('korr'); const f = nearFloor(S.cur, p.x + 6, p.y); p.path = pathTo(S.cur, Math.floor(p.x), Math.floor(p.y), f[0], f[1]); avancer(1.2);
  ok((S.cur.phz || []).filter(h => h.kind === 'fire').length >= 3, 'pas de traînée'); const m = cible(); S.cur.phz.push({ kind: 'fire', x: m.x, y: m.y, r: .8, t: 2.5, mult: .3 });
  const h = m.hp; avancer(.3); ok(m.hp < h, 'la traînée ne brûle pas');
});
test('Larme de Méliane : sous 35 % de vie, le héros se téléporte et devient intouchable, puis 20 s d’attente', () => {
  arene(); porter('meliane'); p.inv = 0; avancer(.3); monstre('rodeur', 1.2); const x0 = p.x, y0 = p.y; p.hp = Math.floor(p.maxHp * .34);
  hurtPlayer(1, 1); ok(Math.hypot(p.x - x0, p.y - y0) > 2, 'pas de téléportation'); ok(p.inv > 0, 'pas intouchable'); egal(p.larmeCd, 20);
  p.inv = 0; const x1 = p.x; hurtPlayer(1, 1); egal(p.x, x1);
});
test('Mue de la Mère des Cendres : une salve de 8 braises en combat, toutes les 8 s', () => {
  arene(); porter('varsha'); avancer(.1); egal(S.proj.length, 0, 'salve sans ennemi'); cible(3); bossPowers(.01, S.cur);
  egal(S.proj.filter(q => q.from === 'p' && q.kind === 'fire').length, 8); proche(p.mueT, 8, .1);
});
test('Pavois du Héraut : étendard en combat, +25 % de dégâts et 15 % de dégâts subis en moins près de lui', () => {
  arene(); porter('heraut'); const m = cible(2); avancer(.05); ok(S.cur.pban && bannerOn(), 'pas d’étendard');
  const avec = coup(m, () => hitMon(m, 1, false)); const b = S.cur.pban; S.cur.pban = null; const sans = coup(m, () => hitMon(m, 1, false)); proche(avec / sans, 1.25, .02);
  p.inv = 0; p.st.block = 0; p.hp = p.maxHp; hurtPlayer(1000, 20); const pris = p.maxHp - p.hp; S.cur.pban = b; p.hp = p.maxHp; hurtPlayer(1000, 20); proche((p.maxHp - p.hp) / pris, .85, .02);
  p.x += 6; ok(!bannerOn(), 'actif loin de l’étendard'); avancer(9); ok(!S.cur.pban, 'l’étendard ne disparaît pas');
});
test('Voile de Cendre vive : un sort laisse une flaque qui brûle, sans s’emballer', () => {
  arene(); heros(20); porter('cineraire'); const m = cible(1.5); p.mp = p.maxMp; ok(castSkill('nova', m.x, m.y)); ok((S.cur.phz || []).some(h => h.kind === 'ash'), 'pas de flaque');
  const h = m.hp; avancer(1); ok(m.hp < h, 'la flaque ne brûle pas'); avancer(1.5); ok(S.cur.phz.length <= 2, 'les flaques s’emballent : ' + S.cur.phz.length);
  const n = S.cur.phz.length; hitMon(m, 1, false); egal(S.cur.phz.length, n, 'un coup d’arme fait une flaque');
});
test('Marteau sans visage : +4 % par coup sur le même ennemi, jusqu’à 40 %', () => {
  arene(); porter('forgeron'); const m = cible(); const d1 = coup(m, () => hitMon(m, 1, false)); for (let i = 0; i < 14; i++) hitMon(m, 1, false); egal(m.brk, 10);
  const d2 = coup(m, () => hitMon(m, 1, false)); proche(d2 / d1, 1.4, .02); const n = cible(2); egal(coup(n, () => hitMon(n, 1, false)), d1);
});
test('Sceau de l’Imbattable : un coup mortel relève le héros à 50 %, une fois toutes les 2 minutes', () => {
  arene(); porter('valgris'); p.inv = 0; p.hp = 1; hurtPlayer(1e9, 20); ok(!p.dead, 'mort'); proche(p.hp, p.maxHp * .5, 1); egal(p.sceauCd, 120);
  avancer(2); p.inv = 0; p.hp = 1; hurtPlayer(1e9, 20); ok(p.dead, 'relevé deux fois de suite');
});
test('Sceau et talent Seconde vie : le talent passe d’abord, le sceau reste en réserve', () => {
  arene(); porter('valgris'); p.inv = 0; p.st.second = 100; p.hp = 1; hurtPlayer(1e9, 20); ok(!p.dead); egal(p.sceauCd || 0, 0); proche(p.hp, p.maxHp * .35, 1);
});
test('sans l’objet, aucun pouvoir : ni flaque, ni étendard, ni salve, ni relève', () => {
  arene(); const m = cible(2); avancer(.2); castSkill('nova', m.x, m.y); hitMon(m, 1, false); avancer(.5);
  ok(!(S.cur.phz || []).length && !S.cur.pban && !m.web && !m.brk, 'un pouvoir agit sans objet'); p.inv = 0; p.hp = 1; hurtPlayer(1e9, 20); ok(p.dead);
});

/* ---------- Sauvegarde, coffre, forge, inventaire ---------- */
test('sauvegarde : objet de boss au sac, porté et au coffre, compteurs de garantie gardés', () => {
  nouvellePartie(); heros(20); p.bag = []; const a = genBossItem('korr', 20), e = porter('heraut'), c = genBossItem('cineraire', 20); bagAdd(a); addTo(p.stash[1], ST_W, ST_H, c); S.btry = { ossira: 12, varsha: 3 };
  const av = JSON.stringify([a, e, c]); recharger(); const b = p.bag[0], e2 = p.eq.offhand, c2 = p.stash[1][0];
  egal(JSON.stringify([b, e2, c2]), av); egal(S.btry, { ossira: 12, varsha: 3 }); ok(p.st.legs.pavois, 'pouvoir perdu'); ok(itemLines(b).includes('Butin de Korr le Brûle-Tombes'));
});
test('ancienne sauvegarde sans compteurs : elle se charge, compteurs à zéro, légendaires intacts', () => {
  nouvellePartie(); heros(10); p.bag = []; const l = objet('helm', 3, 10); bagAdd(l); save(); const v = JSON.parse(localStorage.getItem(SAVE)); delete v.btry; v.ver = 'v5.12';
  localStorage.setItem(SAVE, JSON.stringify(v)); startGame(loadSave()); S.pend = []; closePanel(); egal(S.btry, {}); egal([p.bag[0].leg, p.bag[0].name], [l.leg, l.name]); ok(!p.bag[0].boss);
  S.btry.korr = 4; recharger(); egal(S.btry.korr, 4);
});
test('coffre : l’objet de boss va au coffre et en revient', () => {
  nouvellePartie(); p.bag = []; interact(S.cur.objs.find(o => o.type === 'stash')); const it = genBossItem('meliane', 8); bagAdd(it); invPanel();
  SEL = { it, src: 'bag' }; invPanel(); cliquer('ito'); ok(p.stash[0].includes(it) && !p.bag.includes(it), 'pas rangé');
  SEL = { it, src: 'stash' }; invPanel(); cliquer('ifrom'); ok(p.bag.includes(it), 'pas repris'); egal(it.boss, 'meliane');
});
test('forge de Hilde : l’objet de boss monte au niveau du héros, garde son pouvoir et ses bornes', () => {
  nouvellePartie(); heros(40); const it = porter('heraut', 10); const a = it.a, c = forgeCost(it); p.gold = c + 5;
  npcDialog('hilde'); cliquer('forge', { src: 'eq', k: 'offhand' }); egal([it.ilvl, p.gold, it.leg, it.boss, it.name], [40, 5, 'pavois', 'heraut', 'Pavois du Héraut']);
  ok(it.a > a, 'armure pas montée'); egal(capItem(JSON.parse(JSON.stringify(it))), 0); ok(p.st.legs.pavois);
});
test('infobulle de l’inventaire : « Légendaire de boss », nom du boss et pouvoir', () => {
  nouvellePartie(); heros(20); p.bag = []; const it = genBossItem('heraut', 20); bagAdd(it); SEL = { it, src: 'bag' }; invPanel('inv'); const t = textePanneau();
  ok(t.includes('Légendaire de boss'), 'rareté'); ok(t.includes('Pavois du Héraut') && t.includes('Butin du Héraut gris'), 'nom'); ok(t.includes(it.power), 'pouvoir');
});
test('ramasser l’objet : message « Butin de … » et objet au sac', () => {
  arene(); p.bag = []; const it = genBossItem('korr', 20); S.cur.items.push({ kind: 'item', it, x: p.x, y: p.y }); avancer(.1);
  ok(p.bag.includes(it), 'pas ramassé'); ok($('#toast').textContent.includes('Butin de Korr le Brûle-Tombes'), $('#toast').textContent);
});
test('« Équiper le meilleur » et la comparaison acceptent l’objet de boss', () => {
  nouvellePartie(); heros(20); p.bag = []; p.eq.gloves = null; recalc(); const it = genBossItem('ossira', 20); bagAdd(it); ok(compareItem(it) > 0);
  ok(equipItem(it, eqSlotFor(it)) !== false); egal(p.eq.gloves, it); ok(p.st.legs.toile, 'pouvoir inactif');
});
