// Forge de Hilde et compétences actives.
test('Hilde monte un objet au niveau du héros, contre de l’or', () => {
  nouvellePartie(); heros(20); const it = objet('sword', 2, 8); p.eq.weapon = it; recalc(); const d = it.d[1], c = forgeCost(it); p.gold = c + 5;
  npcDialog('hilde'); cliquer('forge', { src: 'eq', k: 'weapon' });
  egal([it.ilvl, p.gold], [20, 5]); egal(it.d[1], Math.max(1, Math.round(d * G(20) / G(8)))); egal(it.base, TYPES.sword.names[tierOf(it)]);
});
test('pas assez d’or : Hilde refuse ; les objets gris ne sont pas proposés', () => {
  nouvellePartie(); heros(20); const it = objet('helm', 1, 3); p.eq.helm = it; p.gold = 0; ok(!forge(it)); egal(it.ilvl, 3);
  p.eq.weapon.ilvl = 1; npcDialog('hilde'); ok(!panel.querySelector('[data-a="forge"][data-k="weapon"]'), 'objet gris proposé');
});
test('lancer un sort coûte du mana et le sort part', () => {
  nouvellePartie(); aller(zid(1, 0)); const m = monstre('rodeur', 3); const mp = p.mp;
  ok(castSkill('fire', m.x, m.y)); egal(p.mp, mp - SK.fire.cost); p.mp = 0; p.cd = 0; egal(castSkill('fire', m.x, m.y), false, 'sort sans mana');
});
test('une compétence avec recharge attend sa recharge', () => {
  nouvellePartie(); heros(30); rankUp('mastery', 8); rankUp('cry', 1); aller(zid(1, 0)); p.mp = p.maxMp;
  ok(castSkill('cry')); p.cd = 0; egal(castSkill('cry'), false); avancer(SK.cry.cd + .2); p.cd = 0; ok(castSkill('cry'));
});
test('pas de sort au camp ; pendant une attaque le sort attend son tour', () => {
  nouvellePartie(); egal(castSkill('fire', p.x + 2, p.y), false); aller(zid(1, 0)); invincible();
  p.cd = .3; ok(castSkill('fire', p.x + 2, p.y)); ok(p.queued && p.queued.id === 'fire', 'sort non mis en file'); const mp = p.mp; avancer(.4); ok(p.mp < mp, 'le sort en file ne part pas');
});
