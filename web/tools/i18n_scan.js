// One-off scanner: finds user-facing string literals (UPPERCASE Turkish text) in web/src.
// Usage: node i18n_scan.js [--json]   (needs acorn; only used when refactoring, not by build.py)
const fs = require('fs'), path = require('path');
const acorn = require(process.env.ACORN || 'acorn');
const SRC = path.join(__dirname, '..', 'src');
const UP = /[A-ZÇĞİÖŞÜ]/, LOW = /[a-zçğıöşü]/;
const VOW = /[AEIİOÖUÜ]/;
function visible(s, f) {
  if (!UP.test(s) || LOW.test(s) || s.length < 2) return false;
  if (/^(00_core|01_font|03_audio)\.js$/.test(f)) return false;   // glyph tables, Turkish helpers, note strings
  if (/^[A-Z.#]+$/.test(s) && s.indexOf('.') >= 0) return false;   // pixel-art grid rows
  if (/\d:[A-G]/.test(s)) return false;                           // song note strings
  if (!VOW.test(s)) return false;                                   // KKKKK, MWMWM ... sprite rows
  if (['MEEEEM', 'YOOWWOOY', 'YOOOOOOY', 'HWEXWH', 'ICIICI', 'FFEFFEFF'].includes(s)) return false;
  return true;
}
const out = [];
for (const f of fs.readdirSync(SRC).filter(f => f.endsWith('.js')).sort()) {
  const code = fs.readFileSync(path.join(SRC, f), 'utf8');
  const ast = acorn.parse(code, { ecmaVersion: 2022, sourceType: 'script', locations: true });
  (function walk(n, parent, key) {
    if (!n || typeof n.type !== 'string') return;
    if (n.type === 'Literal' && typeof n.value === 'string' && visible(n.value, f)) {
      const skip = (parent && parent.type === 'Property' && key === 'key' && !parent.computed)
        || (parent && parent.type === 'SwitchCase' && key === 'test')
        || (parent && parent.type === 'BinaryExpression' && /^[!=]==?$/.test(parent.operator))
        || (parent && parent.type === 'MemberExpression' && key === 'property')
        || (parent && parent.type === 'CallExpression' && parent.callee.type === 'Identifier' && parent.callee.name === 'TX');
      out.push({ f, line: n.loc.start.line, start: n.start, end: n.end, v: n.value, skip: skip ? (parent.type + (parent.operator || '')) : null, ctx: code.split('\n')[n.loc.start.line - 1].trim().slice(0, 220) });
    }
    for (const k in n) { if (k === 'loc') continue; const c = n[k]; if (Array.isArray(c)) c.forEach(x => walk(x, n, k)); else if (c && typeof c.type === 'string') walk(c, n, k); }
  })(ast, null, null);
}
if (process.argv.includes('--json')) process.stdout.write(JSON.stringify(out));
else {
  const kept = out.filter(o => !o.skip), uniq = new Set(kept.map(o => o.v));
  console.log('literals', out.length, 'kept', kept.length, 'unique', uniq.size, 'chars', [...uniq].join('').length);
  const sk = {}; for (const o of out.filter(o => o.skip)) sk[o.skip] = (sk[o.skip] || 0) + 1; console.log('skipped', sk);
  for (const o of out.filter(o => o.skip).slice(0, 15)) console.log('  SKIP', o.f, o.line, JSON.stringify(o.v), '|', o.ctx.slice(0, 100));
}
