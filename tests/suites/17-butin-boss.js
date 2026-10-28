// Butin propre à chaque boss : les trophées de la 6.58 (catalogue UNIQUES) avec ce que la v5.13 avait de plus :
// garantie au 25e combat sans lui (S.btry), noms selon le thème du monde, trophée de Valgris garanti en acceptant le défi,
// et conversion des objets de boss des sauvegardes v5.13 (it.boss) en trophées.

const BOSS_M1 = ['ossira', 'korr', 'meliane', 'varsha', 'heraut', 'cineraire', 'forgeron', 'valgris'];
function trophees(z = S.cur) { return z.items.filter(o => o.kind === 'item' && o.it.uniq).map(o => o.it); }
// Zone de combat vide, héros invincible
function arene(niv = 20) { nouvellePartie(); heros(niv); aller(zid(1, 0)); S.cur.mons = []; invincible(); }
function recharger() { save(); const sv = loadSave(); startGame(sv); S.pend = []; closePanel(); return sv; }
function avecHasard(v, f) { const r = Math.random; Math.random = () => v; try { return f(); } finally { Math.random = r; } }
// Le monde 2 est le Givre (les mondes sont tirés au hasard depuis la v6.15)
function givreAuMonde2() { S.wtheme = Object.assign({}, S.wtheme, { 1: 'cendres', 2: 'givre' }); applyThemes(); }
// Tue un boss jusqu'au bout, même s'il a plusieurs formes
function abattre(id) { for (let k = 0; k < 6; k++) { const m = S.cur.mons.find(o => !o.dead && o.bossId === id); if (!m) return; tuer(m); avancer(3.5); } }

/* ---------- Catalogue ---------- */
test('catalogue : un trophée par boss du monde 1, pouvoirs distincts des légendaires', () => {
  egal(Object.keys(UNIQUES).sort(), BOSS_M1.slice().sort());
  const legs = Object.values(UNIQUES).map(u => u.leg); egal(new Set(legs).size, 8);
  ok(legs.every(l => !LEGS.some(L => L.id === l)), 'même identifiant qu’un légendaire'); ok(Object.keys(UNIQUES).every(k => BOSSES[k]), 'boss inconnu');
});
test('catalogue : 8 emplacements différents, types existants, petite chance, garantie au 25e combat', () => {
  const sl = Object.values(UNIQUES).map(u => TYPES[u.type] && TYPES[u.type].slot); ok(sl.every(Boolean), 'type inconnu'); egal(new Set(sl).size, 8);
  for (const k in UNIQUES) entre(UNIQUES[k].ch, .01, .05, k); egal(BOSS_PITY, 25);
});
test('catalogue : noms et pouvoirs écrits, noms du givre pour les acolytes, lieutenants et Varsha, aucun tiret quadratin', () => {
  ok(!JSON.stringify(UNIQUES).includes('—'), 'tiret quadratin');
  for (const k in UNIQUES) { const u = UNIQUES[k]; ok(u.n && u.p.length > 20, k); if (k !== 'valgris') ok(u.nt && u.nt.givre && u.nt.givre !== u.n, 'nom du givre : ' + k); }
  ok(Object.values(UNIQUES).every(u => !LEGS.some(l => l.n === u.n)), 'nom déjà pris');
});
test('un tirage normal ne donne jamais un trophée de boss', () => {
  graine(3); for (let i = 0; i < 3000; i++) { const it = genItem(ri(1, 60), 3, 0); ok(!it.uniq && !Object.values(UNIQUES).some(u => u.leg === it.leg), it.name); }
});

/* ---------- Génération ---------- */
test('trophée : légendaire, pouvoir, nom, thème, bon emplacement, niveau demandé', () => {
  nouvellePartie(); for (const k in UNIQUES) { const U = UNIQUES[k], it = genUnique(k, 15);
    egal([it.rar, it.leg, it.uniq, it.uth, it.name, it.power, it.ilvl], [3, U.leg, k, 'cendres', U.n, U.p, 15]); egal(it.slot, TYPES[U.type].slot); }
});
test('plafonds des bonus : aucun trophée au-dessus, du niveau 1 au niveau 100', () => {
  nouvellePartie(); graine(5); let n = 0;
  for (let L = 1; L <= 100; L += 3) for (const k in UNIQUES) for (let j = 0; j < 4; j++) { const c = JSON.parse(JSON.stringify(genUnique(k, L))); egal(capItem(c), 0, `${k} niveau ${L}`); n++; }
  ok(n > 1000);
});
test('courbe G : un trophée plus haut a des valeurs plus hautes', () => {
  nouvellePartie(); graine(6); const m = L => { let s = 0; for (let i = 0; i < 80; i++) s += genUnique('heraut', L).a; return s / 80; };
  ok(m(40) > m(10) * 1.5, 'armure du pavois');
});

/* ---------- Noms selon le monde ---------- */
test('monde du Givre : le trophée prend le nom du thème', () => {
  nouvellePartie(); egal(uniqName('korr', 'givre'), 'Semelles du Brise-Glace'); egal(uniqName('heraut', 'givre'), 'Pavois du Héraut blanc');
  const it = genUnique('varsha', 30, 'givre'); egal([it.name, it.uth, it.leg], ['Diadème de la Mère des Glaces', 'givre', UNIQUES.varsha.leg]);
});
test('nom manquant pour un thème : repli sur le nom des cendres (Valgris, autres mondes)', () => {
  nouvellePartie(); egal(uniqName('valgris', 'givre'), UNIQUES.valgris.n); egal(uniqName('korr', 'marais'), UNIQUES.korr.n); egal(uniqName('inconnu', 'givre'), '');
});
test('sans thème donné, le trophée prend celui du monde où l’on est', () => {
  nouvellePartie(); givreAuMonde2(); setWorld(2); egal(curWorld().theme, 'givre'); const it = genUnique('korr', 30); egal([it.name, it.uth], ['Semelles du Brise-Glace', 'givre']);
  setWorld(1); egal(it.name, 'Semelles du Brise-Glace', 'le nom reste celui du monde où il est tombé');
});
test('monde 2 : tuer un acolyte à la garantie donne son trophée au thème du givre', () => {
  nouvellePartie(); givreAuMonde2(); setWorld(2); heros(30); aller(zid(1, 0)); S.cur.mons = []; invincible(); S.btry = { korr: BOSS_PITY - 1 };
  const m = monstre('korr', 2); tuer(m); const b = trophees(); egal(b.length, 1); egal([b[0].uth, b[0].name, b[0].ilvl], ['givre', 'Semelles du Brise-Glace', m.lvl + 1]);
});

/* ---------- Chance et garantie ---------- */
test('malchance : 24 victoires sans trophée, la 25e le donne à coup sûr', () => {
  arene(); S.btry = {}; avecHasard(.999, () => { for (let i = 1; i < BOSS_PITY; i++) { egal(rollUnique('korr', p.x, p.y, 20), null, 'essai ' + i); egal(S.btry.korr, i); }
    const it = rollUnique('korr', p.x, p.y, 20); ok(it && it.uniq === 'korr', 'pas de trophée au 25e'); });
  egal(S.btry.korr, 0); egal(trophees().length, 1);
});
test('chaque boss a son propre compteur', () => {
  arene(); S.btry = {}; avecHasard(.999, () => { for (let i = 0; i < 10; i++) rollUnique('korr', p.x, p.y, 20); for (let i = 0; i < 3; i++) rollUnique('heraut', p.x, p.y, 20); });
  egal([S.btry.korr, S.btry.heraut, S.btry.ossira], [10, 3, undefined]);
});
test('coup de chance : le trophée tombe et le compteur repart à zéro', () => {
  arene(); S.btry = { ossira: 12 }; const it = avecHasard(0, () => rollUnique('ossira', p.x, p.y, 20)); ok(it, 'rien'); egal(S.btry.ossira, 0);
});
test('chance mesurée : proche de celle du catalogue (3 % pour un acolyte, 1,5 % pour Valgris)', () => {
  arene(); graine(11); const mes = k => { let n = 0; for (let i = 0; i < 20000; i++) { S.btry = {}; if (rollUnique(k, p.x, p.y, 5)) n++; } S.cur.items = []; return n / 20000; };
  proche(mes('korr'), UNIQUES.korr.ch, .006); proche(mes('valgris'), UNIQUES.valgris.ch, .004);
});
test('garanti (force) : tombe même sans chance et remet le compteur à zéro', () => {
  arene(); S.btry = { meliane: 7 }; const it = avecHasard(.999, () => rollUnique('meliane', p.x, p.y, 20, true)); ok(it); egal(S.btry.meliane, 0);
});
test('le trophée tombé annonce « Butin de boss » et brille au sol', () => {
  arene(); S.pend = []; avecHasard(0, () => rollUnique('heraut', p.x + 1, p.y, 20)); ok(S.pend.length >= 1, 'pas d’annonce'); egal(trophees().length, 1);
});

/* ---------- Combats ---------- */
test('tuer Korr à la garantie : son trophée tombe à ses pieds, compteur à zéro', () => {
  arene(); S.btry = { korr: BOSS_PITY - 1 }; const m = monstre('korr', 2); avecHasard(.999, () => tuer(m));
  const b = trophees(); egal(b.length, 1); egal(b[0].uniq, 'korr'); egal(S.btry.korr, 0); ok(Math.hypot(S.cur.items.find(o => o.it === b[0]).x - m.x, S.cur.items.find(o => o.it === b[0]).y - m.y) < 3);
});
test('une victoire sans trophée fait avancer le compteur du boss', () => {
  arene(); S.btry = {}; const m = monstre('ossira', 2); avecHasard(.999, () => tuer(m)); egal(S.btry.ossira, 1); egal(trophees().length, 0);
});
test('monstres et champions : jamais de trophée, compteurs intacts', () => {
  arene(); S.btry = {}; graine(12); for (let i = 0; i < 150; i++) { const m = monstre(pick(['rodeur', 'brute', 'archer', 'ombre']), 2); if (i % 5 === 0) m.champ = true; tuer(m); }
  egal(trophees().length, 0); egal(S.btry, {});
});
test('un écho de boss ne donne pas de trophée', () => {
  arene(); S.btry = { korr: BOSS_PITY - 1 }; const m = monstre('korr', 2); m.echo = true; tuer(m); egal(trophees().length, 0); egal(S.btry.korr, BOSS_PITY - 1);
});
test('Varsha : à la garantie, son trophée tombe dans l’antre', () => {
  nouvellePartie(); heros(20); quete('q2', 3); quete('q3', 1); aller(antre(1)); invincible(); S.btry = { varsha: BOSS_PITY - 1 }; avancer(.3);
  avecHasard(.999, () => abattre('varsha')); avancer(1); ok(trophees().some(it => it.uniq === 'varsha'), 'pas de trophée de Varsha'); egal(S.btry.varsha, 0);
});
test('Valgris, « Pas encore » : son trophée peut tomber, comme pour un autre boss', () => {
  arene(30); S.btry = { valgris: BOSS_PITY - 1 }; const m = monstre('valgris', 2); S.vpend = m; avecHasard(.999, () => valgrisNotYet());
  ok(trophees().some(it => it.uniq === 'valgris'), 'pas de trophée'); egal(S.btry.valgris, 0);
});
test('« Accepter le défi » : le trophée de Valgris est garanti, au nom du monde qu’on quitte', () => {
  arene(30); givreAuMonde2(); S.btry = { valgris: 3 }; const m = monstre('valgris', 2); S.vpend = m; avecHasard(.999, () => { valgrisAccept(); avancer(1.6); });
  egal(S.world, 2); const t = trophees().filter(it => it.uniq === 'valgris'); egal(t.length, 1); egal(t[0].uth, 'cendres'); egal(S.btry.valgris, 0);
});

/* ---------- Pouvoirs (version 6.58) ---------- */
function porter(k, niv = 20) { const it = genUnique(k, niv), sl = it.slot === 'ring' ? 'ring1' : it.slot; p.eq[sl] = it; recalc(); return it; }
test('Fil de la Tisseuse : les coups d’arme ralentissent l’ennemi', () => {
  arene(); porter('ossira'); const m = monstre('brute', 1.5, 20); m.hp = m.maxHp = 1e9; m.slow = 0; hitMon(m, 1, false); ok(m.slow >= 2, 'pas ralenti');
});
test('Marteau sans visage : les coups d’arme fendent l’armure', () => {
  arene(); porter('forgeron'); const m = monstre('brute', 1.5, 20); m.hp = m.maxHp = 1e9; m.brk = 0; hitMon(m, 1, false); ok(m.brk > 0, 'armure pas fendue');
});
test('le pouvoir porté est actif dans les statistiques, et disparaît une fois retiré', () => {
  arene(); const it = porter('meliane'); ok(p.st.legs[UNIQUES.meliane.leg], 'pouvoir absent'); delete p.eq[it.slot]; recalc(); ok(!p.st.legs[UNIQUES.meliane.leg], 'pouvoir resté');
});

/* ---------- Ramassage, inventaire, forge ---------- */
test('ramasser un trophée (ramassage automatique) : au sac et noté dans les trophées', () => {
  arene(); p.trophies = {}; p.bag = []; p.autoPick = true; dropAt(S.cur, p.x, p.y, { kind: 'item', it: genUnique('cineraire', 20) }); avancer(.5);
  ok(p.bag.some(it => it.uniq === 'cineraire'), 'pas au sac'); egal(p.trophies.cineraire, 1);
});
test('le filtre de butin ne laisse jamais un trophée au sol', () => {
  nouvellePartie(); p.lootF = 2; ok(!lootSkip(genUnique('korr', 10)));
});
test('infobulle de l’inventaire : « Trophée de boss », nom et pouvoir', () => {
  nouvellePartie(); p.bag = []; const it = genUnique('korr', 20); bagAdd(it); SEL = { it, src: 'bag' }; const h = selHTML();
  ok(h.includes('Trophée de boss'), 'mention absente'); ok(h.includes(it.name), 'nom absent');
});
test('détruire un trophée chez le Démolisseur rend 3 cœurs', () => {
  nouvellePartie(); egal(salvOf(genUnique('heraut', 20)), { heart: 3 });
});

/* ---------- Sauvegarde ---------- */
test('sauvegarde : compteurs de garantie et trophées gardés', () => {
  arene(); S.btry = { korr: 9, valgris: 24 }; p.trophies = { ossira: 1 }; p.bag = []; bagAdd(genUnique('ossira', 12)); recharger();
  egal(S.btry, { korr: 9, valgris: 24 }); egal(p.trophies, { ossira: 1 }); const it = p.bag.find(i => i.uniq === 'ossira'); ok(it, 'trophée perdu'); egal([it.ilvl, it.leg], [12, UNIQUES.ossira.leg]);
});
test('ancienne sauvegarde sans compteurs : elle se charge, compteurs à zéro', () => {
  nouvellePartie(); save(); const v = JSON.parse(localStorage.getItem(SAVE)); delete v.btry; localStorage.setItem(SAVE, JSON.stringify(v)); startGame(loadSave()); S.pend = [];
  egal(S.btry, {}); avecHasard(.999, () => rollUnique('korr', p.x, p.y, 5)); egal(S.btry.korr, 1);
});

/* ---------- Conversion des sauvegardes v5.13 (objets it.boss) ---------- */
// Objet de boss tel que la v5.13 l'écrivait (catalogue BOSSLOOT, retiré)
function vieilObjet(id, boss, type, slot, leg, bth, ilvl, plus = {}) { return Object.assign({ id, type, slot, rar: 3, ilvl, aff: { life: 20 }, leg, name: 'ancien nom', power: 'ancien pouvoir', boss, bth, val: 100, base: 'x' }, plus); }
function sauvegardeV513() {
  nouvellePartie(); heros(25); save(); const v = JSON.parse(localStorage.getItem(SAVE)); v.ver = '5.13'; v.btry = { korr: 7 };
  v.p.bag = [vieilObjet(501, 'ossira', 'gloves', 'gloves', 'toile', 'cendres', 18, { gx: 0, gy: 0, lock: true })];
  v.p.eq.ring1 = vieilObjet(502, 'valgris', 'ring', 'ring', 'sceau', 'cendres', 22); v.p.eq.armor = vieilObjet(503, 'varsha', 'armor', 'armor', 'mue', 'cendres', 14);
  v.p.stash = [[vieilObjet(504, 'korr', 'boots', 'boots', 'braise', 'givre', 30, { gx: 2, gy: 1 })], [], [], []];
  delete v.p.trophies; localStorage.setItem(SAVE, JSON.stringify(v)); startGame(loadSave()); S.pend = []; closePanel();
}
test('v5.13 : un objet de boss du sac devient le trophée du même boss, à la même place, verrou gardé', () => {
  sauvegardeV513(); const it = p.bag.find(i => i.id === 501); ok(it, 'objet perdu');
  egal([it.uniq, it.leg, it.name, it.ilvl, it.gx, it.gy, it.lock, it.boss], ['ossira', UNIQUES.ossira.leg, UNIQUES.ossira.n, 18, 0, 0, true, undefined]);
});
test('v5.13 : un objet de boss porté reste porté si l’emplacement est le même', () => {
  sauvegardeV513(); const r = p.eq.ring1; egal([r.uniq, r.leg, r.id, r.ilvl], ['valgris', UNIQUES.valgris.leg, 502, 22]); ok(p.st.legs[UNIQUES.valgris.leg], 'pouvoir inactif');
});
test('v5.13 : un objet porté dont l’emplacement a changé retourne au sac (rien n’est perdu)', () => {
  sauvegardeV513(); ok(!p.eq.armor || p.eq.armor.id !== 503, 'resté sur l’armure'); const all = p.bag.concat(...p.stash);
  const it = all.find(i => i.id === 503); ok(it, 'objet perdu'); egal([it.uniq, it.slot], ['varsha', TYPES[UNIQUES.varsha.type].slot]);
});
test('v5.13 : coffre converti, nom du givre gardé, trophées notés et compteurs repris', () => {
  sauvegardeV513(); const it = p.stash[0].find(i => i.id === 504); ok(it, 'objet perdu'); egal([it.uniq, it.uth, it.name], ['korr', 'givre', 'Semelles du Brise-Glace']);
  egal(Object.keys(p.trophies).sort(), ['korr', 'ossira', 'valgris', 'varsha']); egal(S.btry, { korr: 7 });
});
test('v5.13 : aucun objet ne garde l’ancien marqueur, et un second chargement ne change plus rien', () => {
  sauvegardeV513(); const tous = () => p.bag.concat(Object.values(p.eq), ...p.stash).filter(Boolean); ok(tous().every(i => !i.boss), 'it.boss restant');
  const avant = JSON.stringify(tous().map(i => [i.id, i.uniq, i.name, i.ilvl])); recharger(); egal(JSON.stringify(tous().map(i => [i.id, i.uniq, i.name, i.ilvl])), avant);
});
test('v5.13 : un boss inconnu laisse l’objet tel quel, sans le marqueur', () => {
  nouvellePartie(); const it = vieilObjet(9, 'inconnu', 'ring', 'ring', 'x', 'cendres', 5); const r = convBossItem(it); egal([r, r.boss, r.uniq], [it, undefined, undefined]);
});
