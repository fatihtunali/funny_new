const fs = require('fs');
const path = require('path');

const en = JSON.parse(fs.readFileSync(path.join(__dirname, 'messages', 'en.json'), 'utf8'));
const es = JSON.parse(fs.readFileSync(path.join(__dirname, 'messages', 'es.json'), 'utf8'));

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    keys.push(fullKey);
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    }
  }
  return keys;
}

const enKeys = getAllKeys(en).sort();
const esKeys = getAllKeys(es).sort();

const missingInEs = enKeys.filter(k => !esKeys.includes(k));
const extraInEs = esKeys.filter(k => !enKeys.includes(k));

console.log('========== TRANSLATION VALIDATION REPORT ==========\n');
console.log(`Total keys in en.json: ${enKeys.length}`);
console.log(`Total keys in es.json: ${esKeys.length}\n`);

if (missingInEs.length > 0) {
  console.log(`MISSING in es.json (${missingInEs.length} keys):`);
  missingInEs.forEach(k => console.log(`  - ${k}`));
  console.log();
}

if (extraInEs.length > 0) {
  console.log(`EXTRA in es.json (${extraInEs.length} keys):`);
  extraInEs.forEach(k => console.log(`  - ${k}`));
  console.log();
}

if (missingInEs.length === 0 && extraInEs.length === 0) {
  console.log('✅ SUCCESS: Both files have matching structure!');
  console.log('✅ All translation keys are present in both languages.');
} else {
  console.log('❌ FAILED: Structure mismatch detected!');
}

console.log('\n===================================================');
