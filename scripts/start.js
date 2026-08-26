// scripts/start.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// 1) Cache-bust cu SHA
let sha = 'local';
try {
  sha = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
} catch {}
process.env.VITE_APP_CACHE_BUST = process.env.VITE_APP_CACHE_BUST || sha;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// 2) Permite override prin CLI: --share-prefix= --ga= --staging=true
for (const a of process.argv.slice(2)) {
  if (a.startsWith('--share-prefix=')) process.env.VITE_APP_SHARE_PREFIX = a.split('=')[1];
  else if (a.startsWith('--ga='))       process.env.VITE_APP_GA_ID       = a.split('=')[1];
  else if (a.startsWith('--staging='))  process.env.VITE_APP_IS_STAGING  = a.split('=')[1];
}

// 3) Construiește map-ul pentru token-urile START_* (din .env.local)
const startTokens = Object.fromEntries(
  Object.entries(process.env)
    .filter(([k]) => k.startsWith('START_'))
    .map(([k, v]) => [k, v ?? ''])
);

// Plugin simplu care înlocuiește token-urile în sursele TS/JS/TSX/JSX
function tokenReplacePlugin() {
  const exts = /\.(ts|tsx|js|jsx)$/i;
  const keys = Object.keys(startTokens);
  if (!keys.length) return { name: 'token-replace', transform: code => ({ code, map: null }) };

  return {
    name: 'token-replace',
    enforce: 'pre',
    transform(code, id) {
      if (!exts.test(id)) return null;
      let out = code;
      for (const k of keys) {
        // Înlocuire textuală; dacă în cod e "START_XXX", îl schimbăm în stringul real
        const val = JSON.stringify(startTokens[k]);
        out = out.split(k).join(val);
      }
      return { code: out, map: null };
    },
    // Înlocuire și în index.html
    transformIndexHtml(html) {
      let out = html;
      for (const k of keys) {
        out = out.split(k).join(startTokens[k] ?? '');
      }
      return out;
    }
  };
}

(async () => {
  try {
    const { createServer } = require('vite');

    const server = await createServer({
      plugins: [tokenReplacePlugin()],
    });

    await server.listen();
    server.printUrls();

    const shutdown = async () => {
      try { await server.close(); } catch {}
      process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Failed to start Vite dev server:', err);
    process.exit(1);
  }
})();
