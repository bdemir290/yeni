// ================= BITMAP FONT (Turkish uppercase) =================
// Each glyph: body rows (5 tall), optional top (2 rows above) and bot (1 row below).
const GLYPHS = {
  'A': ['.##.', '#..#', '####', '#..#', '#..#'],
  'B': ['###.', '#..#', '###.', '#..#', '###.'],
  'C': ['.###', '#...', '#...', '#...', '.###'],
  'D': ['###.', '#..#', '#..#', '#..#', '###.'],
  'E': ['####', '#...', '###.', '#...', '####'],
  'F': ['####', '#...', '###.', '#...', '#...'],
  'G': ['.###', '#...', '#.##', '#..#', '.###'],
  'H': ['#..#', '#..#', '####', '#..#', '#..#'],
  'I': ['###', '.#.', '.#.', '.#.', '###'],
  'J': ['..##', '...#', '...#', '#..#', '.##.'],
  'K': ['#..#', '#.#.', '##..', '#.#.', '#..#'],
  'L': ['#...', '#...', '#...', '#...', '####'],
  'M': ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
  'N': ['#..#', '##.#', '#.##', '#..#', '#..#'],
  'O': ['.##.', '#..#', '#..#', '#..#', '.##.'],
  'P': ['###.', '#..#', '###.', '#...', '#...'],
  'Q': ['.##.', '#..#', '#..#', '#.#.', '.#.#'],
  'R': ['###.', '#..#', '###.', '#.#.', '#..#'],
  'S': ['.###', '#...', '.##.', '...#', '###.'],
  'T': ['###', '.#.', '.#.', '.#.', '.#.'],
  'U': ['#..#', '#..#', '#..#', '#..#', '.##.'],
  'V': ['#...#', '#...#', '.#.#.', '.#.#.', '..#..'],
  'W': ['#...#', '#...#', '#.#.#', '##.##', '#...#'],
  'X': ['#..#', '#..#', '.##.', '#..#', '#..#'],
  'Y': ['#.#', '#.#', '.#.', '.#.', '.#.'],
  'Z': ['####', '...#', '.##.', '#...', '####'],
  '0': ['###', '#.#', '#.#', '#.#', '###'],
  '1': ['.#.', '##.', '.#.', '.#.', '###'],
  '2': ['###', '..#', '###', '#..', '###'],
  '3': ['###', '..#', '.##', '..#', '###'],
  '4': ['#.#', '#.#', '###', '..#', '..#'],
  '5': ['###', '#..', '###', '..#', '###'],
  '6': ['###', '#..', '###', '#.#', '###'],
  '7': ['###', '..#', '..#', '.#.', '.#.'],
  '8': ['###', '#.#', '###', '#.#', '###'],
  '9': ['###', '#.#', '###', '..#', '###'],
  '.': ['.', '.', '.', '.', '#'],
  ',': ['.', '.', '.', '.', '#'],
  '!': ['#', '#', '#', '.', '#'],
  '?': ['###', '..#', '.##', '...', '.#.'],
  ':': ['.', '#', '.', '#', '.'],
  ';': ['.', '#', '.', '.', '#'],
  '-': ['...', '...', '###', '...', '...'],
  '+': ['...', '.#.', '###', '.#.', '...'],
  '=': ['...', '###', '...', '###', '...'],
  '/': ['..#', '..#', '.#.', '#..', '#..'],
  '%': ['#.#', '..#', '.#.', '#..', '#.#'],
  "'": ['#', '#', '.', '.', '.'],
  '"': ['#.#', '#.#', '...', '...', '...'],
  '(': ['.#', '#.', '#.', '#.', '.#'],
  ')': ['#.', '.#', '.#', '.#', '#.'],
  '<': ['..#', '.#.', '#..', '.#.', '..#'],
  '>': ['#..', '.#.', '..#', '.#.', '#..'],
  '#': ['.#.#.', '#####', '.#.#.', '#####', '.#.#.'],
  '*': ['.....', '.#.#.', '..#..', '.#.#.', '.....'],
  '←': ['..#..', '.#...', '#####', '.#...', '..#..'],
  '→': ['..#..', '...#.', '#####', '...#.', '..#..'],
  '↑': ['..#..', '.###.', '#.#.#', '..#..', '..#..'],
  '↓': ['..#..', '..#..', '#.#.#', '.###.', '..#..'],
  '♥': ['.#.#.', '#####', '#####', '.###.', '..#..'],
  '·': ['.', '.', '#', '.', '.'],
  ' ': ['..', '..', '..', '..', '..']
};
// derived (diacritics)
(function () {
  const add = (ch, base, top, bot) => { GLYPHS[ch] = { body: GLYPHS[base], top, bot }; };
  add('Ç', 'C', null, '.#..');
  add('Ş', 'S', null, '.#..');
  add('Ğ', 'G', ['#..#', '.##.'], null);
  add('Ü', 'U', ['#..#', null], null);
  add('Ö', 'O', [null, '#..#'], null);
  add('İ', 'I', [null, '.#.'], null);
  add('Â', 'A', [null, '.##.'], null);
  add('Î', 'I', [null, '.#.'], null);
  add('Û', 'U', [null, '.##.'], null);
  // v6.1: German and Spanish letters
  add('Ä', 'A', ['#..#', null], null);
  add('Á', 'A', ['..#.', '.#..'], null);
  add('É', 'E', ['..#.', '.#..'], null);
  add('Í', 'I', ['..#', '.#.'], null);
  add('Ó', 'O', ['..#.', '.#..'], null);
  add('Ú', 'U', ['..#.', '.#..'], null);
  add('Ñ', 'N', ['.#.#', '#.#.'], null);
  GLYPHS['¡'] = ['#', '.', '#', '#', '#'];
  GLYPHS['¿'] = ['.#.', '...', '##.', '#..', '###'];
  GLYPHS[','] = { body: ['.', '.', '.', '.', '#'], top: null, bot: '#' };
})();
function glyphOf(ch) {
  let gd = GLYPHS[ch];
  if (!gd) gd = GLYPHS['?'];
  if (Array.isArray(gd)) return { body: gd, top: null, bot: null };
  return gd;
}
const FONT_H = 8; // rows: 0-1 top marks, 2-6 body, 7 bottom
const LINE_H = 10;
// Build a white atlas once
const FONT = (function () {
  const chars = Object.keys(GLYPHS);
  const map = {};
  let x = 0;
  for (const ch of chars) { const gd = glyphOf(ch); const w = gd.body[0].length; map[ch] = { x, w }; x += w + 1; }
  const atlas = document.createElement('canvas');
  atlas.width = Math.max(1, x); atlas.height = FONT_H;
  const a = atlas.getContext('2d');
  a.fillStyle = '#fff';
  for (const ch of chars) {
    const gd = glyphOf(ch); const m = map[ch];
    gd.body.forEach((row, ry) => { for (let i = 0; i < row.length; i++) if (row[i] === '#') a.fillRect(m.x + i, ry + 2, 1, 1); });
    if (gd.top) gd.top.forEach((row, ry) => { if (!row) return; for (let i = 0; i < row.length; i++) if (row[i] === '#') a.fillRect(m.x + i, ry, 1, 1); });
    if (gd.bot) { for (let i = 0; i < gd.bot.length; i++) if (gd.bot[i] === '#') a.fillRect(m.x + i, 7, 1, 1); }
  }
  return { atlas, map, tinted: {} };
})();
function fontAtlas(color) {
  let t = FONT.tinted[color];
  if (!t) {
    t = document.createElement('canvas'); t.width = FONT.atlas.width; t.height = FONT.atlas.height;
    const c2 = t.getContext('2d');
    c2.drawImage(FONT.atlas, 0, 0);
    c2.globalCompositeOperation = 'source-in'; c2.fillStyle = color; c2.fillRect(0, 0, t.width, t.height);
    FONT.tinted[color] = t;
  }
  return t;
}
// gap = pixels between letters (1 normally; 0 squeezes a label that would not fit, e.g. long translations)
function textWidth(str, scale, gap) {
  scale = scale || 1; str = trUp(str); gap = gap == null ? 1 : gap;
  let w = 0;
  for (const ch of str) { const m = FONT.map[ch] || FONT.map['?']; w += (m.w + gap); }
  return Math.max(0, (w - gap)) * scale;
}
// draws text; y = top of glyph cell (cap top at y+2*scale)
function text(str, x, y, color, align, scale, shadow, gap) {
  scale = scale || 1; str = trUp(str);
  // a line wider than the screen (long translations) is squeezed instead of running off the edges
  if (gap == null) gap = textWidth(str, scale, 1) > W - 4 ? 0 : 1;
  const w = textWidth(str, scale, gap);
  let sx = Math.round(align === 'center' ? x - w / 2 : align === 'right' ? x - w : x);
  y = Math.round(y);
  if (shadow) drawTextRaw(str, sx, y + scale, shadow, scale, gap);
  drawTextRaw(str, sx, y, color || C.white, scale, gap);
  return w;
}
function drawTextRaw(str, x, y, color, scale, gap) {
  const at = fontAtlas(color); gap = gap == null ? 1 : gap;
  for (const ch of str) {
    const m = FONT.map[ch] || FONT.map['?'];
    g.drawImage(at, m.x, 0, m.w, FONT_H, x, y, m.w * scale, FONT_H * scale);
    x += (m.w + gap) * scale;
  }
}
// outlined text (for HUD readability). The 9-pass outline is rendered once per string/colour into a small
// cached canvas, so busy HUD frames cost one drawImage per label instead of nine per letter.
const TEXTO_CACHE = new Map();
function textO(str, x, y, color, align, scale, outline) {
  scale = scale || 1; outline = outline || C.ink; color = color || C.white; str = trUp(str);
  // big titles that would run off the screen (long translations) drop to a smaller size
  while (scale > 1 && textWidth(str, scale) > W - 6) scale--;
  const key = str + '|' + color + '|' + scale + '|' + outline;
  let c = TEXTO_CACHE.get(key);
  if (!c) {
    const w = textWidth(str, scale), d = scale;
    c = offscreen(w + d * 2, FONT_H * scale + d * 2, () => {
      for (const [dx, dy] of [[-d, 0], [d, 0], [0, -d], [0, d], [-d, -d], [d, -d], [-d, d], [d, d]]) drawTextRaw(str, d + dx, d + dy, outline, scale);
      drawTextRaw(str, d, d, color, scale);
    });
    c.tw = w;
    if (TEXTO_CACHE.size > 500) TEXTO_CACHE.clear();
    TEXTO_CACHE.set(key, c);
  }
  const sx = Math.round(align === 'center' ? x - c.tw / 2 : align === 'right' ? x - c.tw : x);
  g.drawImage(c, sx - scale, Math.round(y) - scale);
  return c.tw;
}
function wrapText(str, maxW, scale) {
  scale = scale || 1;
  const words = trUp(str).split(' ');
  const lines = []; let line = '';
  for (const wd of words) {
    if (wd === '\n') { lines.push(line); line = ''; continue; }
    const test = line ? line + ' ' + wd : wd;
    if (textWidth(test, scale) > maxW && line) { lines.push(line); line = wd; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}
// grey subtitle under a panel title; squeezed when a translation is wider than the panel
function panelSub(P, str) {
  text(str, P.x + P.w / 2, P.y + 18, C.lgray, 'center', 1, null, textWidth(str) > P.w - 6 ? 0 : 1);
}
function textBlock(str, x, y, maxW, color, align, scale, lineH) {
  scale = scale || 1; lineH = lineH || LINE_H * scale;
  const lines = wrapText(str, maxW, scale);
  lines.forEach((ln, i) => text(ln, x, y + i * lineH, color, align, scale));
  return lines.length * lineH;
}
