const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      results = results.concat(walk(full));
    } else if (/\.(tsx?|css)$/.test(file)) {
      results.push(full);
    }
  }
  return results;
}

const srcDir = 'c:/CreativeUpaay/pfundit/src';
const files = walk(srcDir);
let totalChanges = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Fix px values 1-9
  content = content.replace(/(!?)text-\[([1-9])px\]/g, (m, bang) => `${bang}text-[10px]`);

  // Fix rem values < 0.625 (= 10px at 16px base)
  content = content.replace(/(!?)text-\[0\.\d+rem\]/g, (m, bang) => {
    const inner = m.replace(/^!?text-\[/, '').replace(/\]$/, ''); // e.g. "0.62rem"
    const val = parseFloat(inner);
    if (val < 0.625) return `${bang}text-[0.625rem]`;
    return m;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', path.relative(srcDir, file));
    totalChanges++;
  }
}

console.log(`\nDone. Updated ${totalChanges} file(s).`);
