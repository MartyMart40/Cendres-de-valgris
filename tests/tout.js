// npm test : le banc d'essai, le robot (4 styles, 2 heures de jeu simulé) et le rendu en image.
// node tests/tout.js [--reference] [--court]   (--court : robot de 30 minutes, style Feu seulement)
const { roulerBanc } = require('./banc');
const { roulerRobot, resume } = require('./robot');
const { roulerRendu } = require('./rendu');

(async () => {
  const reference = process.argv.includes('--reference'), court = process.argv.includes('--court');
  const t0 = Date.now();
  console.log(`Banc d'essai${reference ? ' (v5.8 de référence)' : ''}…`);
  const banc = await roulerBanc({ reference, silence: true });
  for (const r of banc.resultats.filter(r => !r.ok)) console.log(`  ÉCHEC ${r.suite} · ${r.nom}\n         ${r.msg}`);
  console.log(`  ${banc.reussis} réussis sur ${banc.n}`);

  console.log(`Robot (${court ? '30 min, Feu' : '2 h, 4 styles'})…`);
  const parties = await roulerRobot({ reference, silence: true, ...(court ? { styles: ['feu'], minutes: 30 } : {}) });
  console.log(resume(parties).split('\n').map(l => '  ' + l).join('\n'));

  console.log('Rendu en image…');
  const { dossier, res } = await roulerRendu({ reference });
  const vides = Object.entries(res).filter(([, r]) => r.couleurs <= 20 || r.erreurs.length);
  for (const [n, r] of vides) console.log(`  ÉCHEC ${n} : ${r.erreurs[0] || 'image vide'}`);
  console.log(`  ${Object.keys(res).length - vides.length} images sur ${Object.keys(res).length} dans ${dossier}`);

  const ok = banc.reussis === banc.n && !parties.some(p => p.erreur) && !vides.length;
  console.log(`\n${ok ? 'Tout est bon.' : 'Il y a des échecs.'} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error(e); process.exit(2); });
