// scripts/config-from-env.js
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const placeholderPath = path.resolve('src', 'config', 'config.placeholder.ts');
const targetPath = path.resolve('src', 'config', 'index.ts');

if (!fs.existsSync(placeholderPath)) {
  console.error(`Nu găsesc ${placeholderPath}. Verifică calea.`);
  process.exit(1);
}

let content = fs.readFileSync(placeholderPath, 'utf8');

// Token-urile suportate (completează dacă apar altele)
const ALL_KEYS = [
  'START_NAME_STOP',
  'START_CHAIN_ID_STOP',
  'START_EGLD_LABEL_STOP',
  'START_WALLET_ADDRESS_STOP',
  'START_EXPLORER_ADDRESS_STOP',
  'START_NFT_EXPLORER_ADDRESS_STOP',
  'START_API_ADDRESS_STOP',
  'START_IS_SOVEREIGN_STOP'
];

// Chei booleene care trebuie injectate ca true/false fără ghilimele
const BOOL_KEYS = [
  'START_IS_SOVEREIGN_STOP'
];

const STR_KEYS = ALL_KEYS.filter(k => !BOOL_KEYS.includes(k));

function parseBool(v) {
  if (v == null) return false;
  const s = String(v).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(s)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(s)) return false;
  // fallback: orice altceva non-empty => true
  return Boolean(s);
}

// 1) Booleene: înlocuiește 'TOKEN' / "TOKEN" cu true/false (fără ghilimele)
//    și acoperă și cazul când TOKEN apare ne-ghilimat.
for (const k of BOOL_KEYS) {
  if (!(k in process.env)) continue;
  const b = parseBool(process.env[k]);
  // quote-agnostic: 'TOKEN' sau "TOKEN"
  const rxQuoted = new RegExp(`(['"])${k}\\1`, 'g');
  content = content.replace(rxQuoted, String(b));
  // fallback: TOKEN fără ghilimele
  content = content.split(k).join(String(b));
}

// 2) Stringuri: înlocuire textuală; dacă placeholderul are ghilimele,
//    valoarea rămâne string valid în TS.
for (const k of STR_KEYS) {
  if (!(k in process.env)) continue;
  const v = process.env[k] ?? '';
  content = content.split(k).join(v);
}

fs.writeFileSync(targetPath, content);
console.log(`Config generat în ${path.relative(process.cwd(), targetPath)} din .env.local`);
