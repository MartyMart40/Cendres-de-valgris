// Transfert : vérifie que le jeu découpé se comporte exactement comme la v5.8 d'un seul fichier.
// Roule le banc, le robot et le rendu sur les deux versions, avec le même hasard, et compare.
// node outils/transfert/comparer.js
const path = require('node:path');
const T = path.join(__dirname, '..', '..', 'tests');
const { roulerBanc } = require(path.join(T, 'banc'));
const { roulerRobot, resume } = require(path.join(T, 'robot'));
const { roulerRendu } = require(path.join(T, 'rendu'));

(async () => {
  const v = {};
  for (const reference of [true, false]) {
    const k = reference ? 'v5.8' : 'découpé';
    console.log(`${k} : banc, robot, rendu…`);
    v[k] = { banc: await roulerBanc({ reference, silence: true }), robot: await roulerRobot({ reference, silence: true }), rendu: (await roulerRendu({ reference })).res };
  }
  const A = v['v5.8'], B = v['découpé'];
  const sans = p => p.map(({ duree, erreursPage, ...r }) => r);
  const lignes = [
    ['Banc d’essai', `${A.banc.reussis}/${A.banc.n}`, `${B.banc.reussis}/${B.banc.n}`, JSON.stringify(A.banc.resultats.map(r => [r.nom, r.ok])) === JSON.stringify(B.banc.resultats.map(r => [r.nom, r.ok]))],
    ['Robot, 4 styles, 2 h', A.robot.map(p => p.failleMax).join(' / '), B.robot.map(p => p.failleMax).join(' / '), JSON.stringify(sans(A.robot)) === JSON.stringify(sans(B.robot))],
    ...Object.keys(A.rendu).map(n => [`Rendu « ${n} »`, A.rendu[n].canvas, B.rendu[n].canvas, A.rendu[n].canvas === B.rendu[n].canvas && A.rendu[n].page === B.rendu[n].page]),
  ];
  console.log('\nComparaison                  v5.8                 découpé              pareil');
  for (const [n, a, b, ok] of lignes) console.log(`${n.padEnd(29)}${String(a).padEnd(21)}${String(b).padEnd(21)}${ok ? 'oui' : 'NON'}`);
  console.log('\nRobot, version découpée :\n' + resume(B.robot));
  const tout = lignes.every(l => l[3]);
  console.log(`\n${tout ? 'Le jeu découpé se comporte exactement comme la v5.8.' : 'DIFFÉRENCES TROUVÉES.'}`);
  process.exit(tout ? 0 : 1);
})().catch(e => { console.error(e); process.exit(2); });
