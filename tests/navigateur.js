// Ouvre le jeu dans Edge (ou Chrome) sans fenêtre, en mode essai.
// Mode essai : la boucle du jeu ne tourne pas seule (le test fait avancer le temps),
// le hasard peut être fixé par une graine, et confirm() répond toujours oui.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright-core');
const { demarrer } = require('./serveur');

const PAGES = { jeu: 'index.html', reference: 'tests/reference/v6.58.html' };
const TELEPHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true };

async function lancer() {
  const essais = [{ channel: 'msedge' }, { channel: 'chrome' }, {}];
  for (const o of essais) { try { return await chromium.launch({ headless: true, ...o }); } catch (e) { /* essai suivant */ } }
  throw new Error('Aucun navigateur trouvé : il faut Edge ou Chrome.');
}

// Prépare un navigateur et un serveur, et donne une fonction pour ouvrir une page du jeu.
async function preparer(opts = {}) {
  const serveur = await demarrer();
  const nav = await lancer();
  const page0 = opts.reference ? PAGES.reference : PAGES.jeu;
  const outils = fs.readFileSync(path.join(__dirname, 'page', 'outils.js'), 'utf8');
  async function ouvrir({ graine = null, boucle = false } = {}) {
    const ctx = await nav.newContext(TELEPHONE);
    await ctx.addInitScript(({ graine, boucle }) => {
      window.__ESSAI = true;
      if (graine != null) { let a = graine | 0; Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
      if (!boucle) window.requestAnimationFrame = () => 0;
      window.confirm = () => true;
      // Sauvegarde vidée au premier chargement seulement : un test peut recharger la page pour vérifier qu'elle reste
      try { if (!sessionStorage.__vu) { localStorage.clear(); sessionStorage.__vu = 1; } } catch (e) { }
    }, { graine, boucle });
    const page = await ctx.newPage();
    const erreurs = [];
    page.on('pageerror', e => erreurs.push(String(e && e.message || e)));
    page.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
    await page.goto(serveur.url + page0, { waitUntil: 'load' });
    await page.waitForFunction(() => typeof GAME_VER === 'string' && typeof startGame === 'function');
    await page.addScriptTag({ content: outils });
    // Les tests de toucher utilisent de vrais touchers d'écran
    await page.exposeFunction('__toucherEcran', (x, y) => page.touchscreen.tap(x, y));
    return { page, ctx, erreurs, fermer: () => ctx.close() };
  }
  return { ouvrir, page0, fermer: async () => { await nav.close(); serveur.fermer(); } };
}

module.exports = { preparer, lancer, PAGES };
