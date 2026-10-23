// Robot joueur, injecté dans la page du jeu. Il joue avec les mêmes fonctions qu'un vrai joueur :
// il marche (chemins du jeu), frappe, lance ses sorts, boit, ramasse, parle à Corvel, monte ses talents,
// prend les points de passage, puis enchaîne les failles. Le temps est celui du jeu, pas celui de l'horloge.
(function () {
  const PAS = 1 / 30;
  // Styles : compétence principale et poids des talents (le robot monte le talent le plus en retard sur son poids)
  const STYLES = {
    feu: { sort: 'fire', poids: { fire: 4, combust: 3, mind: 1, vigor: 2, skin: 1, meteor: 2, embers: 1, cataclysm: 1, lore: 4, regen: 1, bulwark: 1, bastion: 1 } },
    givre: { sort: 'nova', poids: { nova: 4, combust: 3, mind: 2, vigor: 2, skin: 1, meteor: 1, embers: 1, cataclysm: 1, lore: 4, regen: 1, bulwark: 1, bastion: 1 } },
    // La chaîne d'éclairs est au palier 3 : comme un joueur, le robot ouvre la branche avec la boule de feu
    eclairs: { sort: 'chain', poids: { chain: 4, fire: 1, combust: 3, mind: 2, vigor: 2, skin: 1, meteor: 1, embers: 1, cataclysm: 1, lore: 4, regen: 1, bulwark: 1, bastion: 1 } },
    tourbillon: { sort: 'whirl', poids: { whirl: 4, mastery: 3, thirst: 1, frenzy: 2, cry: 1, vigor: 2, skin: 2, execute: 1, avatar: 1, fury: 4, regen: 1, bulwark: 1, bastion: 1 } },
  };
  // Ordre des zones : acte I de la zone 0 à l'antre, puis acte II (100 rangs par acte, quel que soit le nombre de zones)
  const rang = id => { const k = parseZ(id); return k ? (k.a - 1) * 100 + k.i : id === 'town' ? -1 : 999; };
  const deRang = g => zid(Math.floor(g / 100) + 1, g % 100);
  const antre = a => zid(a, actLayout(a).length);

  let R = null; // état du robot

  function demarrer(opts) {
    performance.now = () => (S ? S.t * 1000 : 0);
    localStorage.clear(); startGame(null); S.pend = []; closePanel();
    p.skipWhite = true;
    R = { style: STYLES[opts.style] ? opts.style : 'feu', choix: opts.choix || 'pas', complet: !!opts.complet, vues: new Set(), faillesMin: opts.faillesMin || 0, limite: (opts.limiteMin || 240) * 60,
      t: 0, pense: 0, bloque: 0, dernier: { x: 0, y: 0 }, etapes: {}, morts: {}, faille: null, fini: false, phase: 'actes', retour: null };
    S.deaths = 0; resetTree(); depenser();
  }

  function marque(nom) { if (R.etapes[nom] == null) R.etapes[nom] = { min: +(S.t / 60).toFixed(2), niv: p.lvl, morts: S.deaths || 0 }; }

  function depenser() {
    const P = STYLES[R.style].poids; let n = 0;
    while (p.pts > 0 && n++ < 100000) {
      let best = null, bv = Infinity;
      for (const id in P) if (canRank(id)) { const v = (p.sk[id] || 0) / P[id]; if (v < bv) { bv = v; best = id; } }
      if (!best) { const any = Object.keys(SK).find(k => SK[k].pas && canRank(k)); if (!any) break; best = any; }
      rankUp(best, 1);
    }
    const sort = STYLES[R.style].sort; if (p.sk[sort]) marque('sort');
    if (p.sk[sort] && p.bar[0] !== sort) { const j = p.bar.indexOf(sort); if (j >= 0) p.bar[j] = p.bar[0]; p.bar[0] = sort; }
    for (const id of ACTIVE) if (p.sk[id] && !p.bar.includes(id)) { const e = p.bar.indexOf(null); if (e >= 0) p.bar[e] = id; }
  }

  // Au camp : vend, s'équipe, achète, rend et prend les quêtes
  function auCamp() {
    doAct('best', {}); closePanel();
    for (let i = p.bag.length - 1; i >= 0; i--) { const it = p.bag[i]; if (compareItem(it) <= .5) { p.gold += it.val; p.bag.splice(i, 1); } }
    // Sac encore plein (que des objets prometteurs) : vend le moins bon jusqu'à faire de la place, sinon il rentrerait en boucle
    while ((!bagFits({ type: 'armor' }) || p.bag.length > 6) && p.bag.length) { let j = 0; p.bag.forEach((it, i) => { if (compareItem(it) < compareItem(p.bag[j])) j = i; }); p.gold += p.bag[j].val; p.bag.splice(j, 1); }
    while (p.pot < 10 && p.gold >= potPrice() + 40) doAct('buyp', {});
    while (p.scroll < 3 && p.gold >= scrollPrice() + 40) doAct('buys', {});
    closePanel(); depenser();
    for (let k = 0; k < 6; k++) { const q = curQuest(); if (!q) break; const s = S.q[q].s;
      if (s === 0) { npcDialog('corvel'); doAct('qacc', { q }); }
      else if (s === 2) { npcDialog('corvel'); doAct('qret', { q }); }
      else break; closePanel(); }
    closePanel(); depenser(); p.hp = p.maxHp; p.mp = p.maxMp;
  }

  // Où aller maintenant ?
  function but() {
    const q = curQuest(), s = q && S.q[q].s;
    if (q && (s === 0 || s === 2)) return { zone: 'town' };
    if (q === 'q1') return { zone: zid(1, 0), chasse: true };
    if (q === 'q2' || q === 'q4') { const a = q === 'q2' ? 1 : 2; const b = curWorld().acts[a - 1].acolytes.filter(x => !S.aco[x]).map(x => acoZone(x)).sort((x, y) => Math.abs(rang(x) - rang(S.cur.id)) - Math.abs(rang(y) - rang(S.cur.id)))[0]; return { zone: b, mini: true }; }
    if (q === 'q3') return { zone: antre(1), boss: true };
    if (q === 'q5') return { zone: antre(2), boss: true };
    return { zone: 'rift' };
  }

  // Rend faux si l'endroit est inatteignable
  function allerVers(x, y) { const z = S.cur; const f = nearFloor(z, x, y); if (!f) return false; p.target = null; p.targetObj = null; p.path = pathTo(z, Math.floor(p.x), Math.floor(p.y), f[0], f[1]); return !!p.path || (Math.floor(p.x) === f[0] && Math.floor(p.y) === f[1]); }
  function allerObjet(o) { p.target = null; p.targetObj = o; p.path = pathTo(S.cur, Math.floor(p.x), Math.floor(p.y), Math.floor(o.x), Math.floor(o.y)) || p.path; }

  function sortir(vers) { const o = S.cur.objs.find(o => o.type === 'exit' && o.to === vers); if (o) { allerObjet(o); R.voulue = { x: o.x, y: o.y, zone: S.cur.id }; return true; } return false; }
  // Comme un joueur, le robot ne marche que sur la sortie (ou le portail) qu'il a choisie
  function eviterSorties() {
    const z = S.cur; if (R.voulue && R.voulue.zone !== z.id) R.voulue = null; // choix oublié en changeant de zone
    const v = R.voulue;
    const sous = z.objs.filter(o => o.type === 'exit').concat(portalsIn(z)).filter(o => Math.hypot(o.x - p.x, o.y - p.y) < 1);
    const voulue = o => v && v.zone === z.id && Math.hypot(v.x - o.x, v.y - o.y) < .1;
    if (sous.some(o => !voulue(o))) p.tpCd = Math.max(p.tpCd, .1);
  }

  // Voyage vers une zone : point de passage depuis le camp, sinon de zone en zone
  function voyager(cible) {
    const z = S.cur, ici = z.id;
    if (ici === 'town') {
      if (cible === 'town') return;
      if (cible === 'rift') { riftMenu(); S.riftSel = choisirFaille(); doAct('rift', {}); return; }
      const gC = rang(cible); let best = null;
      for (const id in S.wps) if (id !== 'town' && parseZ(id) && parseZ(id).w === S.world && rang(id) <= gC && (!best || rang(id) > rang(best))) best = id;
      if (best) { closePanel(); enterZone(best, 'wp'); return; }
      sortir(zid(1, 0)); return;
    }
    if (ici === 'rift') { if (z.done) sortir('town'); return; }
    if (cible === 'town' || cible === 'rift') { rentrer(); return; }
    const g = rang(ici), gC = rang(cible); if (g === gC) return;
    // Une arène se traverse en battant ses vagues : la sortie est fermée avant
    if (gC > g && z.arena && !z.arena.done) { allerVers(z.center[0], z.center[1]); return; }
    const wp = z.objs.find(o => o.type === 'wp'); if (wp && !S.wps[ici] && dist(p, wp) < 12) { allerVers(wp.x, wp.y); return; }
    sortir(gC > g ? (z.def.last ? zid(2, 0) : deRang(g + 1)) : (g === 0 ? 'town' : parseZ(ici).i === 0 ? antre(1) : deRang(g - 1)));
  }

  function rentrer() {
    if (S.cur.id === 'town') return;
    if (S.portal && S.portal.zone === S.cur.id) { allerObjet(portalsIn(S.cur)[0]); R.voulue = { x: S.portal.x, y: S.portal.y, zone: S.cur.id }; return; }
    if (p.scroll > 0) { useScroll(); return; }
    const k = parseZ(S.cur.id); if (S.cur.id === 'rift') { sortir('town'); return; }
    sortir(k.i === 0 ? (k.a === 1 ? 'town' : antre(1)) : zid(k.a, k.i - 1));
  }

  function choisirFaille() {
    const n = S.riftMax; const m = R.mortsFaille || {}; let sel = n;
    while (sel > 1 && (m[sel] || 0) >= 3) sel--; return sel;
  }

  function cibleMonstre(rayon) {
    const z = S.cur; let best = null, bd = rayon;
    for (const m of z.mons) { if (m.dead || m.beaten || m.robotNon > S.t) continue; let d = dist(m, p); if (m.t === 'etendard') d -= 3; if (m.boss) d -= 1; if (m.aggro) d -= 1; if (m === R.derniere) d -= 4; if (d < bd) { bd = d; best = m; } }
    // Le robot garde sa cible tant qu'elle reste proche (sinon il hésite à la limite de sa vue)
    R.derniere = best; return best;
  }

  // Ligne de vue : aucun mur entre le héros et la cible, sur la largeur d'un projectile
  // (sinon la boule de feu frôle un coin de mur, y explose, et le robot tire sans fin)
  function vue(m) {
    const z = S.cur, d = dist(m, p) || 1, n = Math.ceil(d * 4), ox = -(m.y - p.y) / d * .25, oy = (m.x - p.x) / d * .25;
    for (const k of [-1, 0, 1]) for (let i = 1; i < n; i++) { const t = i / n; if (isWall(z, Math.floor(p.x + (m.x - p.x) * t + k * ox), Math.floor(p.y + (m.y - p.y) * t + k * oy))) return false; }
    return true;
  }

  function combattre(m) {
    const st = STYLES[R.style], d = dist(m, p);
    if (!vue(m) && d > 1.2) { if (p.hp < p.maxHp * .45 && p.pot > 0) drink(); if (!allerVers(m.x, m.y) || !p.path) m.robotNon = S.t + 10; return; } // sans chemin ni vue, sinon le robot resterait planté là
    if (p.hp < p.maxHp * .45 && p.pot > 0) drink();
    if (p.hp < p.maxHp * .35 && skLvl('aegis') && !(p.cds.aegis > 0)) castSkill('aegis');
    for (const id of p.bar) { if (!id || id === st.sort) continue;
      if (['cry', 'avatar', 'cataclysm'].includes(id) && d < 6 && !(p.cds[id] > 0) && p.mp >= SK[id].cost + 10) castSkill(id, m.x, m.y);
      if (['meteor', 'embers', 'shock'].includes(id) && d < 7 && !(p.cds[id] > 0) && p.mp >= SK[id].cost + 20) castSkill(id, m.x, m.y); }
    // Tant que le sort du style n'est pas débloqué, le robot se sert de la boule de feu du départ
    const sort = skLvl(st.sort) ? st.sort : 'fire'; const portee = sort === 'whirl' ? 1.8 : sort === 'nova' ? 3 : 7;
    if (skLvl(sort) && d < portee && p.mp >= (SK[sort].cost || 0)) { castSkill(sort, m.x, m.y); if (sort !== 'whirl') { p.path = null; return; } }
    if (sort === 'nova' && d >= 3 && p.mp >= SK.nova.cost) { allerVers(m.x, m.y); return; }
    p.target = m; p.targetObj = null;
  }

  function ramasser() {
    const z = S.cur; let best = null, bd = 9;
    for (const o of z.items) { if (o.dropped || o.robotNon) continue; if (o.kind === 'item' && (o.it.rar === 0 || !bagFits(o.it))) continue; if (o.kind === 'pot' && p.pot >= POTIONS.fiole.max) continue; const d = Math.hypot(o.x - p.x, o.y - p.y); if (d < bd) { bd = d; best = o; } }
    // Une fois décidé, le robot garde son objet en vue (sinon il hésite à la limite des 9 cases)
    if (R.visee && R.visee !== best && z.items.includes(R.visee) && !R.visee.robotNon && Math.hypot(R.visee.x - p.x, R.visee.y - p.y) < 14) { best = R.visee; bd = Math.hypot(best.x - p.x, best.y - p.y); }
    if (!best) return false;
    // Essais comptés sur l'objet lui-même : un objet à la limite de la vue ne fait plus hésiter le robot sans fin
    if ((best.robotEssais = (best.robotEssais || 0) + 1) > 150) { best.robotNon = true; return false; }
    // Arrivé sur la case sans le ramasser (objet posé au bord), ou inatteignable : le robot passe son chemin
    if ((!p.path || !p.path.length) && bd < 1.5 && R.visee === best) { best.robotNon = true; return false; }
    R.visee = best; if (!allerVers(best.x, best.y)) { best.robotNon = true; return false; } return true;
  }

  // Journal des décisions (les 40 dernières), utile quand le robot se coince
  function note(a) { if (R.dec !== a) { R.dec = a; (R.journal = R.journal || []).push(`${(S.t / 60).toFixed(2)} ${S.cur.id} ${p.x.toFixed(1)},${p.y.toFixed(1)} ${a}`); if (R.journal.length > 40) R.journal.shift(); } }

  function penser() {
    const b0 = but(); note(`but ${b0.zone}${b0.mini ? ' mini' : ''}${b0.boss ? ' boss' : ''} · chemin ${p.path ? p.path.length : 0} · cible ${p.target ? p.target.t : '-'}`);
    if (S.cine) return;
    if (p.dead) { R.morts[S.cur.id] = (R.morts[S.cur.id] || 0) + 1; if (S.cur.id === 'rift') { R.mortsFaille = R.mortsFaille || {}; R.mortsFaille[S.cur.def.rift] = (R.mortsFaille[S.cur.def.rift] || 0) + 1; } closePanel(); doAct('revive', {}); auCamp(); return; }
    if (panneauOuvert()) {
      if (panel.querySelector('[data-a="vdefi"]')) { if (R.choix === 'defi' && !panel.querySelector('[data-a="vdefi"]').disabled) doAct('vdefi', {}); else doAct('vpas', {}); marque('valgris'); return; }
      closePanel();
    }
    const z = S.cur, b = but();
    if (z.id === 'town') { R.retour = null; if (!R.campFait) { auCamp(); R.campFait = true; } const b2 = but(); if (b2.zone !== 'town') voyager(b2.zone); else R.campFait = false; return; }
    R.campFait = false;
    if (z.def.last && parseZ(z.id) && parseZ(z.id).a === 1) marque('antre'); if (parseZ(z.id) && parseZ(z.id).a === 2) marque('acte2');
    if (z.def.last && parseZ(z.id) && parseZ(z.id).a === 2) marque('sanctuaire');
    if (S.q.q3.s >= 2) marque('varsha');
    if (z.id === 'rift') marque('failles');
    // Retour au camp : sac plein (pas en pleine faille, qui repartirait à zéro) ou plus de fioles et blessé
    if (R.retour || (z.id !== 'rift' && !bagFits({ type: 'armor' }) && p.bag.length > 8) || (p.pot === 0 && p.hp < p.maxHp * .5)) {
      R.retour = true; const m = cibleMonstre(2.5); if (m) combattre(m); else rentrer(); return;
    }
    const m = cibleMonstre(z.id === 'rift' || b.chasse || b.boss || b.mini || z.arena && !z.arena.done ? 9 : 6);
    if (m) { combattre(m); return; }
    if (ramasser()) return;
    if (b.zone === 'town' || (b.zone === 'rift' && z.id !== 'rift')) { rentrer(); return; }
    if (z.id === b.zone || (z.id === 'rift' && b.zone === 'rift')) {
      if (z.arena && !z.arena.done) { allerVers(z.center[0], z.center[1]); return; }
      if (z.id === 'rift' && z.done) { R.faillesFaites = (R.faillesFaites || 0) + 1; sortir('town'); return; }
      const cible = z.mons.filter(o => !o.dead && !o.beaten && !(o.robotNon > S.t)).sort((a, c) => (c.boss - a.boss) || dist(a, p) - dist(c, p))[0];
      if (cible) { if (!allerVers(cible.x, cible.y)) cible.robotNon = S.t + 10; return; }
      if (z.acoSpot && b.mini) { allerVers(z.acoSpot[0], z.acoSpot[1]); return; }
      return;
    }
    // Mode complet : comme un joueur qui explore, le robot nettoie chaque zone d'acte avant d'avancer
    if (R.complet && parseZ(z.id) && !z.def.last && b.zone !== 'rift' && rang(b.zone) > rang(z.id)) {
      const reste = z.mons.filter(o => !o.dead && !o.beaten && !(o.robotNon > S.t)).sort((a, c) => dist(a, p) - dist(c, p))[0];
      if (reste) { if (!allerVers(reste.x, reste.y)) reste.robotNon = S.t + 10; return; }
    }
    voyager(b.zone);
  }

  // Fait jouer le robot pendant « sec » secondes de jeu. Rend l'état pour le suivi.
  function jouer(sec) {
    const fin = R.t + sec;
    while (R.t < fin && !R.fini) {
      R.pense -= PAS; if (R.pense <= 0) {
        R.pense = .2; try { penser(); } catch (e) { R.erreur = String(e && e.stack || e); }
        // Coincé = immobile sans que les monstres de la zone perdent de la vie
        const vie = S.cur.mons.reduce((a, m) => a + (m.dead ? 0 : m.hp + (m.shell || 0)), 0) + S.cur.mons.filter(m => m.dead).length * 1e9;
        if (Math.hypot(p.x - R.dernier.x, p.y - R.dernier.y) < .05 && !S.paused && vie === R.vie) R.bloque += .2; else { R.bloque = 0; R.dernier = { x: p.x, y: p.y }; }
        // Tourne en rond = aucun monstre vivant de la zone ne perd de vie, et le robot repasse sur des cases déjà vues
        // pendant 40 s (une longue marche vers des cases nouvelles ne compte pas)
        const cle = S.cur.id + ':' + Math.floor(p.x) + ',' + Math.floor(p.y);
        if (vie === R.vie && !S.paused && S.cur.id !== 'town' && S.cur.mons.some(m => !m.dead)) { if (R.vues.has(cle)) R.rond = (R.rond || 0) + .2; else R.vues.add(cle); }
        else { R.rond = 0; R.vues = new Set(); }
        if (R.rond > 40) { R.rond = 0; R.tourne = (R.tourne || 0) + 1; if (!R.premierTourne) R.premierTourne = R.journal.slice(-12); closePanel(); enterZone('town', 'spawn'); }
        R.vie = vie;
        if (R.bloque > 15) { R.bloque = 0; R.coince = (R.coince || 0) + 1; if (!R.premierCoince) R.premierCoince = R.journal.slice(-12); if (S.cur.id !== 'town') { if (p.scroll > 0) useScroll(); else { closePanel(); enterZone('town', 'spawn'); } } }
      }
      if (S.paused && panneauOuvert()) { R.pense = 0; } else { eviterSorties(); update(PAS); }
      R.t += PAS;
      if (R.etapes.valgris && !R.debutFailles) R.debutFailles = R.t;
      if (R.debutFailles && R.faillesMin && R.t - R.debutFailles >= R.faillesMin * 60) R.fini = true;
      if (R.t >= R.limite) R.fini = true;
    }
    return bilan();
  }

  function bilan() {
    return { style: R.style, min: +(R.t / 60).toFixed(1), niveau: p.lvl, morts: S.deaths || 0, failleMax: S.riftMax, zone: S.cur.id, etapes: R.etapes, coince: R.coince || 0, tourne: R.tourne || 0, fini: R.fini, erreur: R.erreur || null, puissance: Math.round(powerOf(p.st, p.lvl)), sort: skLvl(STYLES[R.style].sort) };
  }

  window.ROBOT = { demarrer, jouer, bilan, STYLES, etat: () => R };
})();
