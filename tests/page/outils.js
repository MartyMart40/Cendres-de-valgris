// Outils du banc d'essai, injectés dans la page du jeu.
// Une suite appelle test(nom, fonction) ; la fonction peut être async.
window.BANC = { tests: [] };
function test(nom, f) { BANC.tests.push({ nom, f }); }
function ok(c, m) { if (!c) throw new Error(m || 'condition fausse'); }
function egal(a, b, m) { const A = JSON.stringify(a), B = JSON.stringify(b); if (A !== B) throw new Error(`${m ? m + ' : ' : ''}attendu ${B}, reçu ${A}`); }
function proche(a, b, tol, m) { if (!(Math.abs(a - b) <= tol)) throw new Error(`${m ? m + ' : ' : ''}attendu ${b} (± ${tol}), reçu ${a}`); }
function entre(a, min, max, m) { if (!(a >= min && a <= max)) throw new Error(`${m ? m + ' : ' : ''}attendu entre ${min} et ${max}, reçu ${a}`); }

// Hasard reproductible pour un test
function graine(n) { Math.random = rng(n); }
// Nouvelle partie propre, au camp, sans message en attente
function nouvellePartie(n = 1) { try { localStorage.clear(); } catch (e) { } graine(n); startGame(null); S.pend = []; closePanel(); return S; }
// Fait avancer le jeu comme la boucle le ferait (rien ne bouge quand un panneau est ouvert)
function avancer(sec, pas = 1 / 30) { const n = Math.round(sec / pas); for (let i = 0; i < n; i++) { if (!S.paused) update(pas); } }
// Avance jusqu'à ce que la condition soit vraie (ou jusqu'à la limite)
function attendre(cond, max = 30, pas = 1 / 30) { for (let t = 0; t < max; t += pas) { if (cond()) return true; if (!S.paused) update(pas); } return cond(); }
function aller(id) { closePanel(); enterZone(id, 'spawn'); S.pend = []; }
function heros(niv) { p.lvl = niv; p.xp = 0; p.pts = ptsEarned(); recalc(); p.hp = p.maxHp; p.mp = p.maxMp; }
function invincible() { p.inv = 1e9; }
// Fait apparaître un monstre à côté du héros
function monstre(type, dx = 1.5, niv) { const z = S.cur; const f = nearFloor(z, p.x + dx, p.y) || [Math.floor(p.x), Math.floor(p.y)]; return spawnMon(z, type, f[0] + .5, f[1] + .5, false, niv); }
function tuer(m) { hurtMon(m, 1e15); }
function vivants(z = S.cur) { return z.mons.filter(m => !m.dead); }
function objet(type, rar = 0, niv = 10) { return genItem(niv, rar, 0, type); }
function objetsDe(type) { return S.cur.objs.filter(o => o.type === type); }
function pnj(id) { return S.cur.objs.find(o => o.type === 'npc' && o.id === id); }
function panneauOuvert() { return !panel.classList.contains('hidden'); }
function textePanneau() { return panneauOuvert() ? panel.textContent : ''; }
function cliquer(a, extra = {}) { const b = [...panel.querySelectorAll('button')].find(b => b.dataset.a === a && Object.entries(extra).every(([k, v]) => b.dataset[k] === String(v))); if (!b) throw new Error(`bouton « ${a} » absent`); b.click(); }
// Quête : état direct (0 inconnue, 1 en cours, 2 à rendre, 3 terminée)
function quete(k, s) { S.q[k].s = s; }
// Bat les acolytes (ou lieutenants) d'un acte sans aller les chercher
function battreAcolytes(a, n) { const act = curWorld().acts[a - 1]; for (const b of act.acolytes.slice(0, n)) { S.aco[b] = 1; onAcolyte(b); } S.pend = []; }
// Vrai toucher d'écran sur un objet du monde (PNJ, coffre, pierre…)
async function toucherObjet(o) {
  render(); const top = o.type === 'npc' ? 40 * Z : 10 * Z; const [sx, sy] = scr(o.x, o.y);
  await window.__toucherEcran(sx, sy - top);
}
