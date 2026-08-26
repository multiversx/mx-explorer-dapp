// scripts/version-make.js
const { execSync } = require('child_process');
const fs = require('fs');
let sha = 'local';
try {
  sha = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
} catch {}
fs.mkdirSync('build', { recursive: true });
fs.writeFileSync('build/version.json', JSON.stringify(sha));
