// Sauvegardes : aller-retour, conversions des anciennes versions, parties abîmées.
function recharger() { save(); const sv = loadSave(); startGame(sv); S.pend = []; closePanel(); return sv; }

test('aller-retour : niveau, or, sac, équipement, talents, quêtes et graine sont gardés', () => {
  nouvellePartie(); heros(12); p.gold = 4321; p.pot = 9; bagAdd(objet('helm', 2, 12)); rankUp('mastery', 3); quete('q1', 3); quete('q2', 1);
  const avant = JSON.stringify({ l: p.lvl, g: p.gold, pot: p.pot, b: p.bag, e: p.eq, sk: p.sk, q: S.q, seed: S.seed, lay: actLayout(1) });
  const sv = recharger(); egal([sv.v, sv.ver], [3, GAME_VER]);
  egal(JSON.stringify({ l: p.lvl, g: p.gold, pot: p.pot, b: p.bag, e: p.eq, sk: p.sk, q: S.q, seed: S.seed, lay: actLayout(1) }), avant);
});
test('aller-retour : monde, mondes visités, acolytes et quêtes de chaque monde', () => {
  nouvellePartie(); battreAcolytes(1, 2); quete('q3', 3); setWorld(2); S.aco.ossira = 1; quete('q1', 2);
  recharger(); egal([S.world, S.worldMax, S.cur.def.name], [2, 2, 'Refuge de Brumegel']);
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
// Bogue connu de la v5.8 : le message « Nouvel arbre de talents » est mis en attente avant
// l'entrée au camp, qui vide les messages en attente. Il ne s'affiche donc jamais.
test('ancien arbre de compétences : points remboursés', () => {
  nouvellePartie(); heros(20); save(); const sv = loadSave(); sv.p.tv = 1; sv.p.sk = { fire: 9, nova: 9, vieux: 4 }; sv.p.pts = 0;
  startGame(sv); egal(p.sk, { fire: 1, nova: 1 }); egal(p.pts, ptsEarned()); egal(p.tv, 2); egal(p.bar, ['fire', 'nova', null, null]);
});
test('objets qui se chevauchent dans le sac : rangés ailleurs, aucun perdu', () => {
  nouvellePartie(); save(); const sv = loadSave();
  sv.p.bag = [0, 1, 2].map(() => Object.assign(objet('armor', 1), { gx: 0, gy: 0 })); startGame(sv);
  egal(p.bag.length + p.stash.flat().length, 3); for (const it of p.bag) ok(fitsAt(p.bag, INV_W, INV_H, it, it.gx, it.gy, it), 'chevauchement restant');
});
test('partie v5.4 : 2 acolytes déjà vaincus brisent le sceau au chargement', () => {
  nouvellePartie(); quete('q2', 1); S.aco = { ossira: 1, korr: 1 }; S.acow[1] = S.aco; save(); const sv = loadSave(); delete sv.acow; delete sv.qw; sv.q.q2.s = 1;
  startGame(sv); egal(S.q.q2.s, 2); ok(!sealOf(zid(1, 5)), 'antre encore scellé');
});
test('la sauvegarde se fait seule en rentrant au camp', () => {
  nouvellePartie(); localStorage.clear(); aller(zid(1, 0)); p.gold = 999; aller('town');
  egal(JSON.parse(localStorage.getItem(SAVE)).p.gold, 999);
});
