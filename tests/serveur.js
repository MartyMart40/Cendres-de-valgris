// Petit serveur local : sert le dépôt pour le banc d'essai, le robot et le rendu.
// « npm run jouer » l'ouvre pour jouer sur l'ordinateur.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const RACINE = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.json': 'application/json' };

function demarrer(port = 0) {
  const serveur = http.createServer((req, res) => {
    let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html';
    if (rel === 'favicon.ico') { res.writeHead(204); res.end(); return; } // le jeu n'a pas d'icône d'onglet
    const f = path.resolve(RACINE, rel);
    if (!f.startsWith(RACINE) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(ok => serveur.listen(port, '127.0.0.1', () => ok({ url: `http://127.0.0.1:${serveur.address().port}/`, fermer: () => serveur.close() })));
}

module.exports = { demarrer, RACINE };

if (require.main === module) {
  demarrer(8080).then(({ url }) => {
    console.log(`Le jeu tourne sur ${url} (Ctrl+C pour arrêter).`);
    if (process.argv.includes('--ouvrir')) require('node:child_process').exec(`start "" "${url}"`);
  });
}
