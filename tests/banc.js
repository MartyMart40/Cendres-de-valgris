// Banc d'essai : roule toutes les suites de tests/suites dans le jeu, chacune dans une page neuve.
// node tests/banc.js [--reference] [--suite nom]
const fs = require('node:fs');
const path = require('node:path');
const { preparer } = require('./navigateur');

const DOSSIER = path.join(__dirname, 'suites');
const SORTIE = path.join(__dirname, 'sortie');

async function roulerBanc({ reference = false, filtre = null, silence = false } = {}) {
  const env = await preparer({ reference });
  const fichiers = fs.readdirSync(DOSSIER).filter(f => f.endsWith('.js')).sort().filter(f => !filtre || f.includes(filtre));
  const resultats = [];
  const t0 = Date.now();
  try {
    for (const f of fichiers) {
      const suite = f.replace(/^\d+-/, '').replace(/\.js$/, '');
      const { page, erreurs, fermer } = await env.ouvrir({ graine: 1 });
      await page.addScriptTag({ content: fs.readFileSync(path.join(DOSSIER, f), 'utf8') });
      const noms = await page.evaluate(() => BANC.tests.map(t => t.nom));
      for (let i = 0; i < noms.length; i++) {
        erreurs.length = 0;
        let r;
        try {
          r = await Promise.race([
            page.evaluate(async i => { try { await BANC.tests[i].f(); return { ok: true }; } catch (e) { return { ok: false, msg: String(e && e.message || e) }; } }, i),
            new Promise(ok => setTimeout(() => ok({ ok: false, msg: 'trop long (plus de 60 s)' }), 60000)),
          ]);
        } catch (e) { r = { ok: false, msg: String(e.message || e) }; }
        if (r.ok && erreurs.length) r = { ok: false, msg: 'erreur dans la page : ' + erreurs[0] };
        resultats.push({ suite, nom: noms[i], ...r });
        if (!silence) console.log(`${r.ok ? '  ok ' : '  ÉCHEC'} ${suite} · ${noms[i]}${r.ok ? '' : '\n         ' + r.msg}`);
      }
      await fermer();
    }
  } finally { await env.fermer(); }
  const n = resultats.length, reussis = resultats.filter(r => r.ok).length;
  fs.mkdirSync(SORTIE, { recursive: true });
  fs.writeFileSync(path.join(SORTIE, reference ? 'banc-reference.json' : 'banc.json'), JSON.stringify({ page: env.page0, n, reussis, duree: (Date.now() - t0) / 1000, resultats }, null, 1));
  return { n, reussis, resultats, duree: (Date.now() - t0) / 1000 };
}

module.exports = { roulerBanc };

if (require.main === module) {
  const a = process.argv.slice(2);
  const i = a.indexOf('--suite');
  roulerBanc({ reference: a.includes('--reference'), filtre: i >= 0 ? a[i + 1] : null }).then(r => {
    console.log(`\nTests : ${r.reussis} réussis sur ${r.n} (${r.duree.toFixed(0)} s).`);
    process.exit(r.reussis === r.n ? 0 : 1);
  }).catch(e => { console.error(e); process.exit(2); });
}
