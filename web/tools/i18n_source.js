// Lists every TX('...') line with where it is used, for translators. Needs acorn (refactoring tool only).
const fs = require('fs'), path = require('path');
const acorn = require(process.env.ACORN || 'acorn');
const SRC = path.join(__dirname, '..', 'src');
const map = new Map();
for (const f of fs.readdirSync(SRC).filter(f => f.endsWith('.js')).sort()) {
  const code = fs.readFileSync(path.join(SRC, f), 'utf8'), lines = code.split('\n');
  const ast = acorn.parse(code, { ecmaVersion: 2022, locations: true });
  (function walk(n) {
    if (!n || typeof n.type !== 'string') return;
    if (n.type === 'CallExpression' && n.callee.type === 'Identifier' && n.callee.name === 'TX' && n.arguments[0] && n.arguments[0].type === 'Literal') {
      const v = n.arguments[0].value, ln = n.loc.start.line;
      if (!map.has(v)) map.set(v, []);
      const e = map.get(v); if (e.length < 2) e.push(f + ':' + ln + '  ' + lines[ln - 1].trim().slice(0, 260));
    }
    for (const k in n) { if (k === 'loc') continue; const c = n[k]; if (Array.isArray(c)) c.forEach(walk); else if (c && typeof c.type === 'string') walk(c); }
  })(ast);
}
const items = [...map.entries()].map(([tr, ctx]) => ({ tr, ctx }));
const n = +(process.argv[2] || 4), per = Math.ceil(items.length / n);
for (let i = 0; i < n; i++) fs.writeFileSync(path.join(__dirname, '..', 'i18n', 'work', 'src_' + (i + 1) + '.json'), JSON.stringify(items.slice(i * per, (i + 1) * per), null, 1));
console.log(items.length, 'lines in', n, 'chunks of', per);
