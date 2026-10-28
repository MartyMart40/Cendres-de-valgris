// Sauvegardes : aller-retour, conversions des anciennes versions, parties abîmées.
function recharger() { save(); const sv = loadSave(); startGame(sv); S.pend = []; closePanel(); return sv; }

// v6.26 : une arme d’avant reçoit son bonus de base aux attaques au chargement. Le banc saute le choix de classe (qui donne l’arme de classe) :
// l’épée de départ sans classe est donc normalisée avant la photo, comme le fait le chargement.
test('aller-retour : niveau, or, sac, équipement, talents, quêtes et graine sont gardés', () => {
  nouvellePartie(); heros(12); for (const k in p.eq) normItem(p.eq[k]); p.gold = 4321; p.pot = 9; bagAdd(objet('helm', 2, 12)); rankUp('mastery', 3); quete('q1', 3); quete('q2', 1);
  const avant = JSON.stringify({ l: p.lvl, g: p.gold, pot: p.pot, b: p.bag, e: p.eq, sk: p.sk, q: S.q, seed: S.seed, lay: actLayout(1) });
  const sv = recharger(); egal([sv.v, sv.ver], [3, GAME_VER]);
  egal(JSON.stringify({ l: p.lvl, g: p.gold, pot: p.pot, b: p.bag, e: p.eq, sk: p.sk, q: S.q, seed: S.seed, lay: actLayout(1) }), avant);
});
test('aller-retour : monde, mondes visités, acolytes et quêtes de chaque monde', () => {
  nouvellePartie(); battreAcolytes(1, 2); quete('q3', 3); setWorld(2); S.aco.ossira = 1; quete('q1', 2);
  const themes = JSON.stringify(S.wtheme); recharger(); egal(JSON.stringify(S.wtheme), themes, 'mondes tirés perdus');
  // v6.15 : les mondes sont tirés au hasard ; le camp du monde 2 porte le nom de son thème
  egal([S.world, S.worldMax, S.cur.def.name], [2, 2, THEMES[curWorld().theme].camp]); ok(curWorld().theme !== WORLDS[1].theme, 'même thème que le monde 1');
  egal(S.q.q1.s, 2); egal(Object.keys(S.aco), ['ossira']); egal(S.qw[1].q3.s, 3); egal(acoCount(1), 1);
  setWorld(1); egal(acoCount(1), 2);
});
test('conversion v2 vers v3 : monde 1, acte 1, points de passage repris, copie de secours gardée', () => {
  localStorage.clear(); const v2 = { v: 2, p: { ...newPlayer(), lvl: 9, gold: 77, bag: [], eq: starterGear(9), sk: { fire: 3, nova: 1 }, tv: 2, stash: [[], [], [], []] }, q: { q1: { s: 3, n: 12 }, q2: { s: 1, n: 0 } }, wps: { town: 1, plain: 1, crypt: 1 }, done: false, riftMax: 1 };
  localStorage.setItem(SAVE_V2, JSON.stringify(v2)); const sv = loadSave();
  egal([sv.v, sv.world, sv.act, sv.from], [3, 1, 1, 2]); egal(sv.wps, { town: 1, m1a1z0: 1, m1a1z1: 1 }); ok(localStorage.getItem(SAVE_V2), 'la copie v2 a disparu');
  startGame(sv); egal([p.lvl, p.gold, S.q.q1.s, S.world], [9, 77, 3, 1]);
});
test('conversion v1 vers v3 : équipement neuf, 200 pièces d’or, points remboursés, message de bienvenue', () => {
  localStorage.clear(); localStorage.setItem(SAVE_OLD, JSON.stringify({ p: { lvl: 6, gold: 50, pot: 3, scroll: 1 }, q: { q1: { s: 3, n: 12 } }, wps: { town: 1, plain: 1 }, done: false }));
  const sv = loadSave(); egal([sv.v, sv.migr, sv.p.gold], [3, true, 250]); startGame(sv);
  ok(p.eq.weapon && p.eq.armor, 'pas d’équipement neuf'); egal(p.pts, ptsEarned()); avancer(1.5); ok(textePanneau().includes('Nouvelle version'), 'pas de message');
});
test('une sauvegarde abîmée ne bloque pas le jeu', () => {
  localStorage.clear(); localStorage.setItem(SAVE, '{pas du json'); egal(loadSave(), null);
  startGame(loadSave()); egal([S.cur.id, p.lvl], ['town', 1]);
});
test('ancien arbre de compétences : points remboursés', () => {
  nouvellePartie(); heros(20); save(); const sv = loadSave(); sv.p.tv = 1; sv.p.sk = { fire: 9, nova: 9, vieux: 4 }; sv.p.pts = 0;
  startGame(sv); egal(p.sk, { fire: 1, nova: 1 }); egal(p.pts, ptsEarned()); egal(p.tv, 2); egal(p.bar, ['fire', 'nova', null, null, null, null]); // v6 : barre de 6 cases
});
// Corrigé en v5.9 : le message était mis en attente avant l'entrée au camp, qui vidait les messages.
// v6.45 : un ancien arbre vient toujours d’une version d’avant la 6.45 ; le message qui s’affiche est « Talents remboursés », avec le nombre de points.
test('ancien arbre de compétences : le message « Talents remboursés » s’affiche après la conversion', () => {
  nouvellePartie(); heros(20); save(); const sv = loadSave(); sv.p.tv = 1; sv.p.sk = { fire: 9 }; sv.p.pts = 0; sv.ver = '5.8';
  startGame(sv); ok(!panneauOuvert(), 'message affiché trop tôt'); avancer(1.5);
  ok(textePanneau().includes('Talents remboursés'), 'pas de message'); ok(textePanneau().includes(String(p.pts)), 'nombre de points absent');
  egal(p.pts, ptsEarned()); cliquer('close'); ok(!panneauOuvert(), 'le message ne se ferme pas');
});
test('arbre déjà à jour : pas de message « Nouvel arbre de talents »', () => {
  nouvellePartie(); heros(20); recharger(); avancer(2); ok(!textePanneau().includes('Nouvel arbre'), 'message en trop');
});
// v6.45 : le second message est « Talents remboursés » (une partie v1 n’a pas de numéro de version)
test('conversion v1 : « Nouvelle version » puis « Talents remboursés », l’un après l’autre', () => {
  localStorage.clear(); localStorage.setItem(SAVE_OLD, JSON.stringify({ p: { lvl: 6, gold: 50, pot: 3, scroll: 1 }, q: { q1: { s: 3, n: 12 } }, wps: { town: 1, plain: 1 }, done: false }));
  startGame(loadSave()); avancer(1.5); ok(textePanneau().includes('Nouvelle version'), 'premier message absent');
  ok(!textePanneau().includes('Talents remboursés'), 'les deux messages en même temps');
  cliquer('close'); avancer(1); ok(textePanneau().includes('Talents remboursés'), 'second message absent');
});
test('objets qui se chevauchent dans le sac : rangés ailleurs, aucun perdu', () => {
  nouvellePartie(); save(); const sv = loadSave();
  sv.p.bag = [0, 1, 2].map(() => Object.assign(objet('armor', 1), { gx: 0, gy: 0 })); startGame(sv);
  egal(p.bag.length + p.stash.flat().length, 3); for (const it of p.bag) ok(fitsAt(p.bag, INV_W, INV_H, it, it.gx, it.gy, it), 'chevauchement restant');
});
test('partie v5.4 : 2 acolytes déjà vaincus brisent le sceau au chargement', () => {
  nouvellePartie(); quete('q2', 1); S.aco = { ossira: 1, korr: 1 }; S.acow[1] = S.aco; save(); const sv = loadSave(); delete sv.acow; delete sv.qw; sv.q.q2.s = 1;
  startGame(sv); egal(S.q.q2.s, 2); ok(!sealOf(antre(1)), 'antre encore scellé');
});
test('la sauvegarde se fait seule en rentrant au camp', () => {
  nouvellePartie(); localStorage.clear(); aller(zid(1, 0)); p.gold = 999; aller('town');
  egal(JSON.parse(localStorage.getItem(SAVE)).p.gold, 999);
});

// v5.11 : les actes passent à 8 zones ; une partie déjà tirée garde ses 5 zones
function partieA5Zones() {
  nouvellePartie(); const l = rollAct(1, 1, S.seed).slice(0, 5); S.layout = { '1-1': l }; placeAcolytes(l, curWorld().acts[0], S.seed, 1);
  S.wps = { town: 1, m1a1z0: 1, m1a1z2: 1, m1a1z4: 1 }; quete('q1', 3); quete('q2', 1); save(); return loadSave();
}
test('ancienne partie à 5 zones : elle garde ses 5 zones et son antre en zone 6', () => {
  startGame(partieA5Zones()); egal(actZones(1).length, 6); egal(antre(1), zid(1, 5)); ok(zoneDef(zid(1, 5)).last); egal(zoneDef(zid(1, 5)).boss, 'varsha');
});
test('ancienne partie à 5 zones : niveaux 1 à 7 comme avant', () => {
  startGame(partieA5Zones()); egal(actZones(1).slice(0, 5).map(id => zoneDef(id).lvl), [1, 3, 4, 6, 7]);
});
test('ancienne partie à 5 zones : points de passage et acolytes gardés', () => {
  startGame(partieA5Zones()); egal(actZones(1).slice(0, 5).map(id => zoneDef(id).wp), [true, false, true, false, true]);
  egal(actLayout(1).filter(x => x.aco).length, 3); ok(acoZone('ossira') && parseZ(acoZone('ossira')).i < 5, 'acolyte hors des 5 zones');
  closePanel(); enterZone('m1a1z4', 'wp'); ok(S.cur.objs.some(o => o.type === 'exit' && o.to === zid(1, 5)), 'pas de sortie vers l’antre');
});
test('ancienne partie à 5 zones : l’acte II, pas encore tiré, en a 8', () => {
  const sv = partieA5Zones(); delete sv.lay['1-2']; startGame(sv); egal(actZones(2).length, 9);
});
test('ancienne partie à 5 zones : le tirage survit à un aller-retour de sauvegarde', () => {
  startGame(partieA5Zones()); recharger(); egal(actLayout(1).length, 5); egal(antre(1), zid(1, 5));
});

// Portage de la 6.58 : une partie sauvegardée par la v5.13 (le site publié) doit se charger sans rien perdre.
// Format v5.13 : barre de 4 cases, arbre de 26 talents (tv 2), tirage d'acte sans évènements ni mutations, butin de boss à part (boss, bth), btry.
function partieV513() {
  const q = { q1: { s: 3, n: 12 }, q2: { s: 3, n: 0 }, q3: { s: 1, n: 0 }, q4: { s: 0, n: 0 }, q5: { s: 0, n: 0 } };
  return {
    v: 3, ver: '5.13', world: 1, act: 1, seed: 424242,
    lay: { '1-1': [{ f: 'plaine', n: 0, d: 'plain' }, { f: 'labyrinthe', n: 1, d: 'crypt', aco: 'ossira' }, { f: 'couloir', n: 0, d: 'plain' }, { f: 'arene', n: 2, d: 'lair', aco: 'korr' },
      { f: 'labyrinthe', n: 3, d: 'crypt' }, { f: 'plaine', n: 1, d: 'plain' }, { f: 'couloir', n: 2, d: 'crypt', aco: 'meliane' }, { f: 'arene', n: 0, d: 'lair' }] },
    p: {
      lvl: 18, xp: Math.floor(xpNextOld(18) / 2), gold: 12345, pot: 7, scroll: 4,
      bag: [
        { id: 30, type: 'helm', slot: 'helm', rar: 2, ilvl: 12, aff: { crit: 5, mana: 9, armorPct: 16, mf: 13, resF: 13 }, a: 18, rname: 'Braise des Tombes', val: 176, base: 'Casque de fer', name: 'Braise des Tombes', gx: 0, gy: 0 },
        { id: 31, type: 'boots', slot: 'boots', rar: 3, ilvl: 16, a: 9, aff: { move: 12, life: 30 }, val: 420, base: 'Bottes renforcées', name: 'Semelles du Brûle-Tombes', power: 'En marchant, tu laisses une traînée de feu qui brûle les ennemis.', boss: 'korr', bth: 'cendres', gx: 4, gy: 0 },
        { id: 32, type: 'ring', slot: 'ring', rar: 1, ilvl: 14, aff: { life: 14 }, val: 40, base: 'Anneau de cuivre', suf: 'du loup', name: 'Anneau de cuivre du loup', gx: 7, gy: 3 }],
      eq: {
        weapon: { id: 10, type: 'sword', slot: 'weapon', rar: 1, ilvl: 15, d: [6, 15], spd: 1, aff: { crit: 3 }, val: 60, base: 'Épée de fer', suf: 'du faucon', name: 'Épée de fer du faucon' },
        armor: { id: 11, type: 'armor', slot: 'armor', rar: 0, ilvl: 14, a: 30, aff: {}, val: 20, base: 'Cotte de mailles', name: 'Cotte de mailles' } },
      sk: { fire: 4, nova: 2, mastery: 5, whirl: 1, vigor: 3 }, pts: 2, bar: ['fire', 'whirl', 'nova', null], skipWhite: true, mute: false, tv: 2,
      stash: [[{ id: 40, type: 'amulet', slot: 'amulet', rar: 1, ilvl: 10, aff: { mana: 6 }, val: 30, base: 'Amulette de cuivre', suf: 'du sage', name: 'Amulette de cuivre du sage', gx: 2, gy: 1 }], [], [], []]
    },
    q, qw: { 1: JSON.parse(JSON.stringify(q)) }, wps: { town: 1, m1a1z0: 1, m1a1z2: 1, m1a1z4: 1 }, done: false, riftMax: 3, rec: {},
    aco: { ossira: 1, korr: 1 }, acow: { 1: { ossira: 1, korr: 1 } }, worldMax: 1, btry: { varsha: 4, ossira: 2 }
  };
}
function chargerV513() { localStorage.clear(); localStorage.setItem(SAVE, JSON.stringify(partieV513())); const sv = loadSave(); startGame(sv); return sv; }
test('partie v5.13 : niveau, or, fioles, parchemins, quêtes, acolytes, graine et compteurs de butin gardés', () => {
  const sv = chargerV513(); egal([sv.v, sv.ver], [3, '5.13']);
  egal([p.lvl, p.gold, p.pot, p.scroll, S.seed, S.world, S.worldMax, S.riftMax], [18, 12345, 7, 4, 424242, 1, 1, 3]);
  egal([S.q.q1.s, S.q.q1.n, S.q.q2.s, S.q.q3.s, S.q.q4.s], [3, 12, 3, 1, 0]); egal(S.qw[1], S.q);
  egal(S.aco, { ossira: 1, korr: 1 }); egal(acoCount(1), 2); egal(S.wps, { town: 1, m1a1z0: 1, m1a1z2: 1, m1a1z4: 1 }); egal(S.btry, { varsha: 4, ossira: 2 });
  egal([S.cur.id, S.br, S.brMax], ['town', 0, 0]); ok(p.skipWhite, 'filtre de butin perdu');
});
test('partie v5.13 : la barre d’expérience garde sa proportion (v6.03 et v6.13)', () => {
  chargerV513(); proche(p.xp / xpNext(18), .5, .01); ok(p.xp < xpNext(18), 'niveau gagné au chargement');
});
test('partie v5.13 : sac, coffre et équipement gardés, à leur place', () => {
  chargerV513(); egal(p.bag.length + p.stash.flat().length, 4, 'objet perdu');
  const casque = p.bag.find(it => it.id === 30); ok(casque, 'casque perdu'); egal([casque.gx, casque.gy, casque.rname, casque.aff.mf], [0, 0, 'Braise des Tombes', 13]);
  const anneau = p.bag.find(it => it.id === 32); ok(anneau, 'anneau perdu'); egal([anneau.gx, anneau.gy], [7, 3]);
  const amu = p.stash[0].find(it => it.id === 40); ok(amu, 'amulette du coffre perdue'); egal([amu.gx, amu.gy, amu.aff.mana], [2, 1, 6]);
  egal([p.eq.weapon.id, p.eq.weapon.d, p.eq.weapon.aff.crit, p.eq.armor.id, p.eq.armor.a], [10, [6, 15], 3, 11, 30]);
  egal(p.eq.weapon.aff.atk, TYPES.sword.atk, 'v6.26 : bonus de base aux attaques absent');
  for (const it of p.bag) ok(fitsAt(p.bag, INV_W, INV_H, it, it.gx, it.gy, it), 'chevauchement dans le sac');
  ok(itemId > 40, 'les nouveaux objets reprendraient un numéro déjà pris');
});
test('partie v5.13 : le butin de boss (Semelles de Korr) est gardé, au même niveau et à la même place', () => {
  chargerV513(); const b = p.bag.find(it => it.id === 31); ok(b, 'butin de boss perdu');
  egal([b.slot, b.rar, b.ilvl, b.gx, b.gy], ['boots', 3, 16, 4, 0]); ok(itemLines(b).length > 0, 'fiche de l’objet vide');
});
test('partie v5.13 : l’acte I garde ses 8 zones, ses acolytes et ses points de passage, et chaque zone s’ouvre', () => {
  chargerV513(); const l = actLayout(1); egal(l.length, 8); egal(l.map(x => x.f), ['plaine', 'labyrinthe', 'couloir', 'arene', 'labyrinthe', 'plaine', 'couloir', 'arene']);
  egal(l.map(x => x.aco || null).filter(Boolean), ['ossira', 'korr', 'meliane']); egal(antre(1), zid(1, 8)); egal(zoneDef(zid(1, 8)).boss, 'varsha');
  ok(!sealOf(antre(1)), 'antre scellé malgré 2 acolytes vaincus');
  for (const id of actZones(1)) { closePanel(); enterZone(id, 'spawn'); egal(S.cur.id, id); ok(S.cur.w > 0 && S.cur.objs.length > 0, 'zone vide : ' + id); }
  aller('town'); egal(S.cur.id, 'town');
});
test('partie v5.13 : talents remboursés (v6.45), barre de 6 cases, message affiché, choix de classe proposé', () => {
  chargerV513(); egal(p.sk, { fire: 1, nova: 1 }); egal(p.pts, ptsEarned()); egal(p.bar, ['fire', 'nova', null, null, null, null]); egal(p.tv, 2);
  avancer(1.5); ok(textePanneau().includes('Talents remboursés'), 'pas de message'); ok(textePanneau().includes(String(p.pts)), 'nombre de points absent');
  cliquer('close'); ok(attendre(() => textePanneau().includes('classe'), 6), 'choix de classe absent'); ok(p.clsAsked, 'classe pas demandée');
});
test('partie v5.13 : une fois chargée et resauvegardée, elle passe en 6.58 et se recharge à l’identique', () => {
  chargerV513(); S.pend = []; closePanel(); const avant = JSON.stringify({ l: p.lvl, g: p.gold, b: p.bag, e: p.eq, s: p.stash, sk: p.sk, q: S.q, lay: actLayout(1), bt: S.btry });
  const sv = recharger(); egal(sv.ver, GAME_VER);
  egal(JSON.stringify({ l: p.lvl, g: p.gold, b: p.bag, e: p.eq, s: p.stash, sk: p.sk, q: S.q, lay: actLayout(1), bt: S.btry }), avant);
  startGame(loadSave()); for (let i = 0; i < 8; i++) { avancer(.5); ok(!textePanneau().includes('Talents remboursés'), 'talents remboursés une seconde fois'); closePanel(); }
  egal(p.sk, { fire: 1, nova: 1 });
});
test('message gardé à l’entrée en zone : « Talents de ta classe » s’affiche quand un talent hors classe est remboursé', () => {
  nouvellePartie(); heros(12); p.cls = 'guerrier'; p.clsAsked = true; const hors = Object.keys(SK).find(k => SK[k].br >= 0 && !SK[k].gem && !CLS.guerrier.br.includes(SK[k].br));
  ok(hors, 'aucun talent hors classe'); p.sk[hors] = 2; save(); startGame(loadSave()); ok(!p.sk[hors], 'talent pas retiré');
  ok(attendre(() => textePanneau().includes('Talents de ta classe'), 6), 'message absent'); ok(/[0-9]+ points de plus à placer/.test(textePanneau()), 'points remboursés absents');
});
