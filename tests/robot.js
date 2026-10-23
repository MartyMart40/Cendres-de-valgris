// Robot : joue des parties complètes, avec le hasard fixé, et donne les chiffres clés.
// node tests/robot.js [--reference] [--styles feu,givre,eclairs,tourbillon] [--minutes 120] [--failles 0] [--graine 1] [--complet]
//   --complet : le robot nettoie chaque zone d'acte avant d'avancer, comme un joueur qui explore (sinon il fonce vers la sortie)
//   --minutes : durée totale de jeu simulé ; --failles : minutes de failles après Valgris (0 = jusqu'à la fin)
const fs = require('node:fs');
const path = require('node:path');
const { preparer } = require('./navigateur');

const SORTIE = path.join(__dirname, 'sortie');
const CODE = fs.readFileSync(path.join(__dirname, 'page', 'robot.js'), 'utf8');

async function roulerRobot({ reference = false, styles = ['feu', 'givre', 'eclairs', 'tourbillon'], minutes = 120, failles = 0, graine = 1, complet = false, silence = false } = {}) {
  const env = await preparer({ reference });
  const parties = [];
  try {
    // Les styles jouent en même temps, chacun dans sa page
    await Promise.all(styles.map(async (style, k) => {
      const { page, erreurs, fermer } = await env.ouvrir({ graine: graine + k * 0 });
      await page.addScriptTag({ content: CODE });
      await page.evaluate(o => ROBOT.demarrer(o), { style, limiteMin: minutes, faillesMin: failles, complet });
      let b, t0 = Date.now(), dernier = 0;
      do {
        b = await page.evaluate(() => ROBOT.jouer(60));
        if (!silence && (b.min - dernier >= 10 || b.fini)) { dernier = b.min; console.log(`  robot ${style.padEnd(10)} ${String(b.min).padStart(6)} min · niveau ${b.niveau} · faille ${b.failleMax} · morts ${b.morts} · ${b.zone}`); }
      } while (!b.fini && !b.erreur);
      b.duree = (Date.now() - t0) / 1000; b.erreursPage = erreurs.slice(0, 3);
      parties[k] = b; await fermer();
    }));
  } finally { await env.fermer(); }
  fs.mkdirSync(SORTIE, { recursive: true });
  fs.writeFileSync(path.join(SORTIE, reference ? 'robot-reference.json' : 'robot.json'), JSON.stringify({ page: env.page0, minutes, failles, graine, parties }, null, 1));
  return parties;
}

function resume(parties) {
  const l = ['style       niveau  faille  morts  antre      Varsha     acte II    Valgris'];
  const e = (b, k) => b.etapes[k] ? `${b.etapes[k].min} min`.padEnd(11) : '-'.padEnd(11);
  for (const b of parties) l.push(`${b.style.padEnd(12)}${String(b.niveau).padEnd(8)}${String(b.failleMax).padEnd(8)}${String(b.morts).padEnd(7)}${e(b, 'antre')}${e(b, 'varsha')}${e(b, 'acte2')}${e(b, 'valgris')}${b.erreur ? '  ERREUR' : ''}${b.coince ? `  (coincé ${b.coince} fois)` : ''}${b.tourne ? `  (tourne en rond ${b.tourne} fois)` : ''}${b.sort ? '' : '  (SORT DU STYLE JAMAIS DÉBLOQUÉ)'}`);
  const f = parties.map(b => b.failleMax), ecart = f.length > 1 ? (Math.max(...f) / Math.max(1, Math.min(...f)) - 1) * 100 : 0;
  l.push(`Écart entre styles (faille la plus haute) : ${ecart.toFixed(0)} %`);
  return l.join('\n');
}

module.exports = { roulerRobot, resume };

if (require.main === module) {
  const a = process.argv.slice(2), val = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
  roulerRobot({ reference: a.includes('--reference'), styles: val('--styles', 'feu,givre,eclairs,tourbillon').split(','), minutes: +val('--minutes', 120), failles: +val('--failles', 0), graine: +val('--graine', 1), complet: a.includes('--complet') })
    .then(p => { console.log('\n' + resume(p)); for (const b of p) if (b.erreur) console.log(`\n${b.style} : ${b.erreur}`); process.exit(p.some(b => b.erreur) ? 1 : 0); })
    .catch(e => { console.error(e); process.exit(2); });
}
