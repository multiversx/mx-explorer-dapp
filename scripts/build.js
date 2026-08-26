// scripts/build.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1) SHA pentru cache-bust
let sha = 'local';
try {
  sha = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
} catch { /* fără git -> 'local' */ }

// 2) Parsează argumente CLI ca să nu mai depindem de cross-env
//    ex: node scripts/build.js --share-prefix=devnet- --ga=G-XXXX --staging=true
const argv = process.argv.slice(2);
for (const a of argv) {
  if (a.startsWith('--share-prefix=')) {
    process.env.VITE_APP_SHARE_PREFIX = a.split('=')[1];
  } else if (a.startsWith('--ga=')) {
    process.env.VITE_APP_GA_ID = a.split('=')[1];
  } else if (a.startsWith('--staging=')) {
    process.env.VITE_APP_IS_STAGING = a.split('=')[1];
  }
}

// 3) Setează cache-bust
process.env.VITE_APP_CACHE_BUST = sha;

// 4) Rulează Vite cu API-ul oficial (nu prin npx)
(async () => {
  try {
    const { build } = require('vite');
    await build(); // Vite va afișa logurile: "vite vX building for production..."
  } catch (err) {
    // fallback (dacă nu există vite în deps)
    try {
      const { spawnSync } = require('child_process');
      const nodeCmd = process.platform === 'win32' ? 'node.exe' : 'node';
      const res = spawnSync(nodeCmd, [path.join('node_modules', 'vite', 'bin', 'vite.js'), 'build'], {
        stdio: 'inherit',
        env: process.env,
      });
      if (res.status !== 0) process.exit(res.status ?? 1);
    } catch (e2) {
      console.error('Build failed:', err);
      process.exit(1);
    }
  }

  // 5) Scrie build/version.json cu SHA
  fs.mkdirSync(path.join('build'), { recursive: true });
  fs.writeFileSync(path.join('build', 'version.json'), JSON.stringify(sha));
})();
