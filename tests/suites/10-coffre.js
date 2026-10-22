// Coffre : 4 onglets de 12 × 8 cases, échanges avec le sac et l'équipement.
function auCoffre() { nouvellePartie(); p.bag = []; interact(S.cur.objs.find(o => o.type === 'stash')); }

test('le coffre du camp a 4 onglets de 12 × 8 cases', () => {
  auCoffre(); egal([ST_TABS, ST_W, ST_H, p.stash.length], [4, 12, 8, 4]); ok(textePanneau().includes('Coffre'), 'le coffre ne s’ouvre pas');
  egal(panel.querySelectorAll('[data-a="stab"]').length, 4);
});
test('du sac au coffre, puis du coffre au sac', () => {
  auCoffre(); const it = objet('helm', 1); bagAdd(it); invPanel();
  SEL = { it, src: 'bag' }; invPanel(); cliquer('ito'); ok(p.stash[0].includes(it) && !p.bag.includes(it), 'pas rangé');
  SEL = { it, src: 'stash' }; invPanel(); cliquer('ifrom'); ok(p.bag.includes(it) && !p.stash[0].includes(it), 'pas repris');
});
test('chaque onglet garde ses objets ; un onglet plein refuse poliment', () => {
  auCoffre(); cliquer('stab', { t: 2 }); egal(S.stab, 2); while (addTo(p.stash[2], ST_W, ST_H, objet('armor')));
  const n = p.stash[2].length; egal(n, 12 / 2 * Math.floor(8 / 3)); const it = objet('armor'); bagAdd(it);
  egal(moveTo_(it, { grid: 'stash' }), false); ok(p.bag.includes(it)); egal(p.stash[0].length, 0); egal(p.stash[2].length, n);
});
test('équiper depuis le coffre : l’ancien objet prend sa place', () => {
  auCoffre(); const w = objet('axe', 2, 10); addTo(p.stash[0], ST_W, ST_H, w); const old = p.eq.weapon;
  ok(moveTo_(w, { slot: 'weapon' })); egal(p.eq.weapon, w); ok(p.stash[0].includes(old), 'ancienne arme perdue');
});
