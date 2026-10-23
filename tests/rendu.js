// Rendu en image : photographie des scènes clés sur un écran de téléphone, avec le hasard fixé.
// Les images vont dans tests/sortie/rendu (ou rendu-reference). node tests/rendu.js [--reference]
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { preparer } = require('./navigateur');

const SORTIE = path.join(__dirname, 'sortie');

// Chaque scène prépare le jeu puis dessine une image (la boucle ne tourne pas : on dessine à la main)
const SCENES = {
  camp: () => { nouvellePartie(1); avancer(1); },
  plaine: () => { nouvellePartie(1); aller(zid(1, 0)); invincible(); avancer(2); },
  combat: () => { nouvellePartie(1); heros(8); aller(zid(1, 0)); invincible(); for (const t of ['rodeur', 'archer', 'ombre']) { const m = monstre(t, 2.5); m.aggro = true; } castSkill('fire', p.x + 3, p.y); avancer(.6); },
  inventaire: () => { nouvellePartie(1); heros(30); p.bag = []; for (const [t, r] of [['sword', 3], ['helm', 2], ['ring', 1], ['armor', 2], ['staff', 0], ['boots', 1]]) bagAdd(objet(t, r, 30)); invPanel('inv'); },
  talents: () => { nouvellePartie(1); heros(25); rankUp('mastery', 10); rankUp('whirl', 6); SELT = 'whirl'; talentPanel(); },
  valgris: () => { nouvellePartie(1); quete('q4', 3); aller(antre(2)); invincible(); avancer(.3); tuer(S.cur.mons.find(m => m.bossId === 'valgris')); avancer(5.5); },
  givre: () => { nouvellePartie(1); setWorld(2); aller(zid(1, 0)); invincible(); avancer(2); },
  portail: () => { nouvellePartie(1); aller(zid(1, 0)); invincible(); S.cur.mons = []; const f = nearFloor(S.cur, p.x + 6, p.y + 2); p.x = f[0] + .5; p.y = f[1] + .5; useScroll(); avancer(1.5); $('#toast').style.opacity = 0; },
  butin: () => { nouvellePartie(1); heros(30); p.bag = []; const it = genBossItem('korr', 30); bagAdd(it); bagAdd(genBossItem('heraut', 30)); bagAdd(objet('helm', 2, 30)); SEL = { it, src: 'bag' }; invPanel('inv'); panel.scrollTop = 1e4; },
  pouvoirs: () => { nouvellePartie(1); heros(30); aller(zid(1, 0)); invincible(); S.cur.mons = []; for (const b of ['korr', 'heraut']) { const it = genBossItem(b, 30); p.eq[it.slot] = it; } recalc(); const f = nearFloor(S.cur, p.x + 5, p.y + 1); p.path = pathTo(S.cur, Math.floor(p.x), Math.floor(p.y), f[0], f[1]); const m = monstre('rodeur', 3); m.stun = 1e9; avancer(1); $('#toast').style.opacity = 0; },
};

async function roulerRendu({ reference = false } = {}) {
  const env = await preparer({ reference });
  const dossier = path.join(SORTIE, reference ? 'rendu-reference' : 'rendu');
  fs.mkdirSync(dossier, { recursive: true });
  const res = {};
  try {
    for (const [nom, f] of Object.entries(SCENES)) {
      const { page, erreurs, fermer } = await env.ouvrir({ graine: 1 });
      await page.evaluate(`(${f})(); render(); hud();`);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(dossier, nom + '.png'), animations: 'disabled' });
      // Empreintes : le dessin du canvas, et le contenu de la page (HUD, panneaux). La capture elle-même
      // contient des fondus qui dépendent de l'horloge : elle sert à regarder, pas à comparer.
      const m = await page.evaluate(() => {
        const d = ctx.getImageData(0, 0, cv.width, cv.height).data, s = new Set(); for (let i = 0; i < d.length; i += 4 * 97) s.add(d[i] << 16 | d[i + 1] << 8 | d[i + 2]);
        // Les balises de script diffèrent forcément (un gros script contre plusieurs fichiers) : on les retire
        const b = document.body.cloneNode(true); b.querySelectorAll('script').forEach(n => n.remove());
        return { canvas: cv.toDataURL(), page: b.innerHTML.replace(/\s+/g, ' '), couleurs: s.size };
      });
      const h = t => crypto.createHash('sha256').update(t).digest('hex').slice(0, 16);
      res[nom] = { canvas: h(m.canvas), page: h(m.page), couleurs: m.couleurs, erreurs: erreurs.slice(0, 2) };
      await fermer();
    }
  } finally { await env.fermer(); }
  fs.writeFileSync(path.join(SORTIE, reference ? 'rendu-reference.json' : 'rendu.json'), JSON.stringify(res, null, 1));
  return { dossier, res };
}

module.exports = { roulerRendu };

if (require.main === module) {
  roulerRendu({ reference: process.argv.includes('--reference') }).then(({ dossier, res }) => {
    for (const [n, r] of Object.entries(res)) console.log(`  ${r.couleurs > 20 && !r.erreurs.length ? 'ok ' : 'ÉCHEC'} ${n.padEnd(11)} ${r.couleurs} couleurs${r.erreurs.length ? ' · ' + r.erreurs[0] : ''}`);
    console.log(`Images dans ${dossier}`);
  }).catch(e => { console.error(e); process.exit(2); });
}
