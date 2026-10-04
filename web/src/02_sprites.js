// ================= SPRITES =================
function addOutline(c, color) {
  const cx = c.getContext('2d'); const w = c.width, h = c.height;
  const img = cx.getImageData(0, 0, w, h); const d = img.data;
  const op = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0;
  const marks = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (op(x, y)) continue;
    if (op(x - 1, y) || op(x + 1, y) || op(x, y - 1) || op(x, y + 1)) marks.push(x, y);
  }
  cx.fillStyle = color; for (let i = 0; i < marks.length; i += 2) cx.fillRect(marks[i], marks[i + 1], 1, 1);
}
function makeSprite(rows, pal, outline) {
  const h = rows.length, w = Math.max(...rows.map(r => r.length));
  const pad = outline ? 1 : 0;
  return offscreen(w + pad * 2, h + pad * 2, c => {
    for (let y = 0; y < h; y++) for (let x = 0; x < rows[y].length; x++) {
      const ch = rows[y][x]; if (ch === '.' || ch === ' ') continue;
      const col = pal[ch]; if (!col) continue;
      pix(x + pad, y + pad, col);
    }
    if (outline) addOutline(c, outline);
  });
}
function tintSprite(img, color) {
  return offscreen(img.width, img.height, c => {
    g.drawImage(img, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = color; g.fillRect(0, 0, c.width, c.height); g.globalCompositeOperation = 'source-over';
  });
}
function rotSprite(img, q) { // q quarter turns clockwise
  q = ((q % 4) + 4) % 4; if (q === 0) return img;
  const w = q % 2 ? img.height : img.width, h = q % 2 ? img.width : img.height;
  return offscreen(w, h, () => { g.translate(w / 2, h / 2); g.rotate(q * Math.PI / 2); g.drawImage(img, -img.width / 2, -img.height / 2); g.setTransform(1, 0, 0, 1, 0, 0); });
}
function flipSprite(img) {
  return offscreen(img.width, img.height, () => { g.translate(img.width, 0); g.scale(-1, 1); g.drawImage(img, 0, 0); g.setTransform(1, 0, 0, 1, 0, 0); });
}

// ---------- horses ----------
const HORSE_BODY = [
  '.....nn.....',
  '....nnnn....',
  '....cwwc....',
  '....cwcc....',
  '....cccc....',
  '...ecccce...',
  '....cmcc....',
  '....cmcc....',
  '...ccmccc...',
  '..cccmcccc..',
  '..cccccccc..',
  '..cccccccc..',
  '..cccccccc..',
  '..cccccccc..',
  '..cccccccc..',
  '..cccccccc..',
  '..cccccccc..',
  '...cccccc...',
  '...cccccc...',
  '....cccc....',
  '.....mm.....',
  '.....mm.....',
  '......m.....'
];
const JOCKEY_ROWS = {
  7: '.....kk.....',
  8: '....s..s....',
  9: '....shhs....',
  10: '...shhhhs...',
  11: '...shtths...',
  12: '...sshhss...',
  13: '...ssssss...',
  14: '....ssss....',
  15: '....pppp....',
  16: '...b....b...'
};
const LEG_OFFS = [[-2, -1, 2, 1], [-1, 0, 1, 0], [2, 1, -2, -1], [1, 0, -1, 0]];
const COATS = {
  bay: { n: C.plum, c: C.brown, l: C.tan, d: C.dbrown, m: C.plum, w: C.sand },
  chestnut: { n: C.dbrown, c: C.orange0, l: C.tan, d: C.rust, m: C.rust, w: C.sand },
  gray: { n: C.dgray, c: C.lgray, l: C.white, d: C.gray, m: C.dgray, w: C.white },
  black: { n: C.ink, c: C.slate, l: C.dgray, d: C.navy, m: C.ink, w: C.lgray },
  palomino: { n: C.brown, c: C.tan, l: C.sand, d: C.brown, m: C.sand, w: C.white },
  dun: { n: C.slate, c: C.gray, l: C.lgray, d: C.dgray, m: C.slate, w: C.white },
  wolfgray: { n: C.ink, c: C.dgray, l: C.gray, d: C.slate, m: C.ink, w: C.lgray }
};
const SILKS = {
  ayse: { s: C.red, h: C.gold },
  kemal: { s: C.blue, h: C.white },
  tayfun: { s: C.orange, h: C.navy },
  r1: { s: C.sky, h: C.white }, r2: { s: C.green, h: C.yellow }, r3: { s: C.magenta, h: C.salmon },
  r4: { s: C.purple, h: C.gold }, r5: { s: C.lgray, h: C.blue }, r6: { s: C.dgreen, h: C.red },
  r7: { s: C.yellow, h: C.purple }, r8: { s: C.salmon, h: C.slate },
  pirlanta: { s: C.purple, h: C.gold }, kurt: { s: C.ddgreen, h: C.lgray }, simsek: { s: C.wine, h: C.yellow },
  eskiya: { s: C.plum, h: C.red }, okcu: { s: C.teal, h: C.green }, reis: { s: C.wine, h: C.gold },
  deniz: { s: C.red, h: C.white } // the hero: red & white silks
};
const heroHorse = blanket => getHorse('bay', 'deniz', blanket);
function horseGrid(frame, withRider) {
  const grid = HORSE_BODY.map(r => r.split(''));
  if (frame === 2 || frame === 3) { grid[22][6] = '.'; grid[22][5] = 'm'; }
  if (frame === 4) { grid[22][6] = '.'; grid[21][6] = 'm'; }
  if (withRider) for (const k in JOCKEY_ROWS) { const row = JOCKEY_ROWS[k]; for (let x = 0; x < row.length; x++) if (row[x] !== '.') grid[k][x] = row[x]; }
  for (let y = 0; y < grid.length; y++) for (let x = 0; x < 12; x++) if (grid[y][x] === 'c') { if (x <= 3) grid[y][x] = 'l'; else if (x >= 8) grid[y][x] = 'd'; }
  // pad 1 column each side so the legs can sit outside the outline
  return grid.map(r => '.' + r.join('') + '.');
}
// legs are drawn after the outline so they read as thin limbs, not a blob
function drawLegs(c, frame, legCol, hoofCol) {
  const cx = c.getContext('2d');
  const put = (x, y, col) => { if (y >= 0 && y < c.height) { cx.fillStyle = col; cx.fillRect(x, y, 1, 1); } };
  if (frame === 4) { // tucked legs while airborne
    for (const [x, y] of [[2, 11], [13, 11], [2, 17], [13, 17]]) { put(x, y, legCol); put(x, y + 1, hoofCol); }
    return;
  }
  const offs = frame === 5 ? [0, 0, 0, 0] : LEG_OFFS[frame];
  const legs = [[2, 10, offs[0]], [13, 10, offs[1]], [2, 16, offs[2]], [13, 16, offs[3]]];
  for (const [lx, base, o] of legs) {
    for (let i = 0; i < 3; i++) put(lx, base + o + i, legCol);
    put(lx, o < 0 ? base + o : base + o + 2, hoofCol);
  }
}
const HORSE_CACHE = {};
function getHorse(coatKey, silkKey, blanket) {
  const key = coatKey + '|' + (silkKey || '-') + '|' + (blanket || '-');
  if (HORSE_CACHE[key]) return HORSE_CACHE[key];
  const imported = importedHorse(coatKey, silkKey, blanket);
  if (imported) return (HORSE_CACHE[key] = imported);
  const coat = COATS[coatKey] || COATS.bay; const silk = silkKey ? SILKS[silkKey] : null;
  const pal = { n: coat.n, c: coat.c, l: coat.l, d: coat.d, m: coat.m, w: coat.w, e: coat.d, g: coat.d, x: C.ink, k: C.skin, p: C.white, b: C.ink, q: blanket || coat.c };
  if (silk) { pal.s = silk.s; pal.h = silk.h; pal.t = silk.s; }
  const set = { frames: [], jump: null, stand: null };
  const grid = f => { let gr = horseGrid(f, !!silk); if (blanket) gr = gr.map((row, y) => (y >= 13 && y <= 16) ? row.split('').map((ch, x) => ((x === 3 || x === 4 || x === 9 || x === 10) && ch !== '.') ? 'q' : ch).join('') : row); return gr; };
  const mk = f => { const c = makeSprite(grid(f), pal, C.ink); drawLegs(c, f, coat.d === C.navy ? C.slate : coat.d, C.ink); return c; };
  for (let f = 0; f < 4; f++) set.frames.push(mk(f));
  set.jump = mk(4);
  set.stand = mk(5);
  set.white = tintSprite(set.frames[0], C.white);
  HORSE_CACHE[key] = set;
  return set;
}
const ROT_CACHE = {};
function horseDir(coatKey, silkKey, frameIdx, dir) { // dir: 0 up,1 right,2 down,3 left
  const key = coatKey + silkKey + frameIdx + '_' + dir;
  if (ROT_CACHE[key]) return ROT_CACHE[key];
  const set = getHorse(coatKey, silkKey);
  const base = frameIdx < 0 ? set.stand : set.frames[frameIdx];
  return (ROT_CACHE[key] = rotSprite(base, dir));
}

// ---------- icons ----------
const ICON_ROWS = {
  heart: ['.rr.rr.', 'rwrrrrr', 'rrrrrrd', '.rrrrd.', '..rrd..', '...d...'],
  coin0: ['.yyyy.', 'yywyyo', 'yyyyyo', 'yyyyyo', 'yyyyoo', '.oooo.'],
  coin1: ['..yy..', '.ywyo.', '.yyyo.', '.yyyo.', '.yyoo.', '..oo..'],
  coin2: ['...y..', '...w..', '...y..', '...y..', '...o..', '...o..'],
  clover: ['.gg.gg.', 'gllgllg', 'gggdggg', '.gdddg.', 'gggdggg', 'gllgllg', '.gg.gg.'],
  rozet: ['rr...rr', '.rr.rr.', '..rrr..', '.yyyyy.', 'yywyyyo', 'yyyyyyo', 'yyyyyyo', '.yyyyo.', '..ooo..'],
  star: ['...w...', '..wyy..', 'yyyyyyy', '.yyyyo.', '..yyo..', '.yo.yo.', '.o...o.'],
  gear: ['...g...', '.g.g.g.', '..ggg..', 'ggg.ggg', '..ggg..', '.g.g.g.', '...g...'],
  pause: ['ww.ww', 'ww.ww', 'ww.ww', 'ww.ww', 'ww.ww', 'ww.ww'],
  shoe: ['.gg...gg.', 'gwg...ggd', 'gg.....gd', 'gg.....gd', 'gg.....gd', '.gg...gd.', '.ggg.ggd.', '..ggggd..', '...ddd...'],
  lock: ['..ggg..', '.g...g.', '.g...g.', 'yyyyyyy', 'yyyoyyy', 'yyyoyyy', 'yyyyyyy', 'ooooooo'],
  hammer: ['ggggg', 'gwggg', 'ggggg', '..b..', '..b..', '..b..', '..b..'],
  crown: ['y...y...y', 'yy..y..yy', 'yyyyyyyyy', 'yryyryyry', 'yyyyyyyyy'],
  flame: ['..o..', '.oo..', '.ooo.', 'ooyoo', 'oyyyo', 'oywyo', '.yyy.'],
  bolt: ['...yy', '..yy.', '.yy..', 'yyyyy', '..yy.', '.yy..', 'yy...'],
  check: ['.....g', '....gg', 'g..gg.', 'gggg..', '.gg...'],
  cross: ['r...r', '.r.r.', '..r..', '.r.r.', 'r...r'],
  door: ['.bbbb.', 'bbbbbb', 'bbbbbb', 'bbbybb', 'bbbbbb', 'bbbbbb'],
  fountain: ['..c..', '.c.c.', '..c..', 'sssss', '.sss.', '.sss.'],
  stall: ['rwrwrwr', 'rwrwrwr', '.b...b.', '.b...b.', 'bbbbbbb'],
  skull: ['.www.', 'wwwww', 'w.w.w', 'wwwww', '.w.w.'],
  wing: ['#........', '##.......', '###......', '####.....', '#####....', '######...', '.#######.', '..#######', '....#####'],
  fire: ['....#....', '...##....', '...###...', '..####...', '..#####..', '.###.###.', '.##...##.', '.###.###.', '..#####..'],
  eight: ['..#####..', '.##...##.', '.##...##.', '..#####..', '.##...##.', '##.....##', '##.....##', '.##...##.', '..#####..'],
  spark: ['....#....', '....#....', '...###...', '#########', '.#######.', '..#####..', '..##.##..', '.##...##.', '.#.....#.'],
  wind: ['......##.', '.......#.', '######.#.', '......#..', '########.', '.........', '#####..#.', '......##.', '.........'],
  gust: ['..###', '.#...', '####.', '.....', '###..'],
  bag: ['..bb..', '.b..b.', 'yyyyyy', 'yyoyyy', 'yyyyyy', '.yyyy.'],
  run: ['..##.', '.####', '###..', '.#.#.', '#...#']
};
const ICON_PAL = { r: C.red, w: C.white, d: C.wine, y: C.gold, o: C.orange0, g: C.lgray, l: C.green, b: C.brown, '#': C.white, c: C.cyan, s: C.gray };
const ICON_PAL_OV = { clover: { g: C.dgreen, l: C.green, d: C.ddgreen }, rozet: { r: C.sky, w: C.yellow }, star: { w: C.white, y: C.yellow, o: C.gold }, coin0: { y: C.gold, w: C.yellow, o: C.orange0 }, coin1: { y: C.gold, w: C.yellow, o: C.orange0 }, coin2: { y: C.gold, w: C.yellow, o: C.orange0 }, check: { g: C.green }, flame: { o: C.orange, y: C.yellow, w: C.white }, door: { b: C.brown, y: C.gold }, bag: { b: C.brown, y: C.gold, o: C.orange0 }, run: { '#': C.white } };
const ICONS = {};
function buildIcons() {
  for (const k in ICON_ROWS) {
    const pal = Object.assign({}, ICON_PAL, ICON_PAL_OV[k] || {});
    const outline = (k === 'wing' || k === 'fire' || k === 'eight' || k === 'spark' || k === 'wind' || k === 'pause' || k === 'gust' || k === 'run') ? null : C.ink;
    ICONS[k] = makeSprite(ICON_ROWS[k], pal, outline);
  }
  ICONS.heartE = makeSprite(ICON_ROWS.heart, { r: C.slate, w: C.dgray, d: C.navy }, C.ink);
  ICONS.heartG = makeSprite(ICON_ROWS.heart, { r: C.gold, w: C.yellow, d: C.orange0 }, C.ink);
  ICONS.pauseO = makeSprite(ICON_ROWS.pause, { w: C.white }, C.ink);
}
const SPIRIT_ICON = { tulpar: 'wing', kirat: 'fire', sleipnir: 'eight', pegasus: 'spark', ruzgar: 'wind' };
const TINT_CACHE = {};
function tinted(iconKey, color) { const k = iconKey + color; return TINT_CACHE[k] || (TINT_CACHE[k] = tintSprite(ICONS[iconKey], color)); }

// ---------- obstacles & pickups ----------
const OB = {};
function buildObstacles() {
  OB.rock = makeSprite([
    '....bbbb.....', '..bbbbbbbb...', '.bbbwwbbbbb..', '.bbwwbbbbbbb.', 'bbbwbbbbbbbbs', 'bbbbbbbbbbbbs', 'bbbbbbbbbbbss', '.sbbbbbbbbss.', '..ssssssss...'
  ], { b: C.gray, w: C.lgray, s: C.dgray }, C.ink);
  OB.rock2 = makeSprite([
    '...bbbbb...', '.bbwwbbbbb.', 'bbwbbbbbbbs', 'bbbbbbbbbbs', 'bbbbbbbbbss', '.sbbbbbbss.', '..sssssss..'
  ], { b: C.dgray, w: C.gray, s: C.slate }, C.ink);
  OB.mossrock = makeSprite([
    '....gggg.....', '..ggggbbgg...', '.bggwbbbbbg..', '.bbwwbbbbbbb.', 'bbbwbbbbbbbbs', 'bbbbbbbbbbbbs', 'bbbbbbbbbbbss', '.sbbbbbbbbss.', '..ssssssss...'
  ], { b: C.gray, w: C.lgray, s: C.dgray, g: C.dgreen }, C.ink);
  OB.bale = [0, 1].map(f => makeSprite(f === 0 ? [
    'yyyyyyyyyyyyyy', 'yoyyyoyyyoyyyo', 'yyyyyyyyyyyyyy', 'yyoyyyoyyyoyyy', 'yyyyyyyyyyyyyy', 'yoyyyoyyyoyyyo', 'yyyyyyyyyyyyyy', 'oooooooooooooo'
  ] : [
    'yyyyyyyyyyyyyy', 'yyoyyyoyyyoyyy', 'yyyyyyyyyyyyyy', 'yoyyyoyyyoyyyo', 'yyyyyyyyyyyyyy', 'yyoyyyoyyyoyyy', 'yyyyyyyyyyyyyy', 'oooooooooooooo'
  ], { y: C.gold, o: C.orange0 }, C.ink));
  OB.wolf = [0, 1].map(f => makeSprite(f === 0 ? [
    '.......d.d.', 't.....dggg.', 'tgggggggggw', '.gggggggggg', '.g.g...g.g.'
  ] : [
    '.......d.d.', '......dggg.', 'tgggggggggw', 'tgggggggggg', '..g.g.g.g..'
  ], { g: C.dgray, d: C.slate, t: C.gray, w: C.yellow }, C.ink));
  OB.clump = makeSprite(['.d.d.', 'ddddd', '.ddd.'], { d: C.dbrown }, null);
  OB.coin = [ICONS.coin0, ICONS.coin1, ICONS.coin2, ICONS.coin1];
  OB.clover = ICONS.clover;
  OB.heart = ICONS.heart;
  // decorations
  OB.flowers = [
    makeSprite(['.y.', 'yoy', '.y.'], { y: C.yellow, o: C.orange }, null),
    makeSprite(['.w.', 'wyw', '.w.'], { w: C.white, y: C.gold }, null),
    makeSprite(['.r.', 'rsr', '.r.'], { r: C.salmon, s: C.yellow }, null),
    makeSprite(['.c.', 'cbc', '.c.'], { c: C.sky, b: C.white }, null)
  ];
  OB.tuft = makeSprite(['l.l', 'lll'], { l: C.green }, null);
  OB.tuftD = makeSprite(['l.l', 'lll'], { l: C.ddgreen }, null);
  OB.bush = makeSprite(['..ggg..', '.gllgg.', 'gllgggd', 'ggggggd', '.gggdd.'], { g: C.dgreen, l: C.green, d: C.ddgreen }, C.ink);
  OB.tree = makeSprite([
    '.....gggg.....', '...gglllggg....', '..gllllgggggd..', '.gllllgggggggd.', '.glllggggggggd.', 'gllgggggggggggd', 'ggggggggggggggd', 'gggggggggggggdd', '.ggggggggggddd.', '.gggggggggddd..', '..ggggdddddd...', '....ddddd......', '......bb.......', '......bb.......'
  ].map(r => r.padEnd(15, '.')), { g: C.dgreen, l: C.green, d: C.ddgreen, b: C.dbrown }, C.ink);
  OB.pine = makeSprite([
    '......g......', '.....ggg.....', '....gglgg....', '...gglgggd...', '.....ggd.....', '...gglggggd..', '..ggllggggdd.', '....gggggd...', '..gglggggggd.', '.gglgggggggdd', '.....bbb.....', '.....bbb.....'
  ], { g: C.ddgreen, l: C.dgreen, d: C.teal, b: C.plum }, C.ink);
  OB.mushroom = makeSprite(['.rrr.', 'rwrrr', '..s..'], { r: C.red, w: C.white, s: C.sand }, null);
}
const OB_CACHE = {};
function hurdleSprite(w) {
  const k = 'h' + w; if (OB_CACHE[k]) return OB_CACHE[k];
  return (OB_CACHE[k] = offscreen(w, 9, () => {
    rect(0, 8, w, 1, 'rgba(24,20,37,0.45)');
    // posts
    rect(0, 0, 2, 8, C.white); rect(w - 2, 0, 2, 8, C.white); rect(0, 0, 2, 2, C.red); rect(w - 2, 0, 2, 2, C.red);
    // rails
    for (let x = 2; x < w - 2; x++) { const red = Math.floor((x - 2) / 3) % 2 === 0; pix(x, 2, red ? C.red : C.white); pix(x, 5, red ? C.white : C.red); }
    rect(2, 3, w - 4, 1, C.lgray); rect(2, 6, w - 4, 1, C.lgray);
    box(-1, -1, w + 2, 10, 'rgba(0,0,0,0)');
  }));
}
function logSprite(w) {
  const k = 'l' + w; if (OB_CACHE[k]) return OB_CACHE[k];
  return (OB_CACHE[k] = offscreen(w, 10, () => {
    rect(1, 9, w - 2, 1, 'rgba(24,20,37,0.45)');
    rect(0, 1, w, 7, C.ink);
    rect(1, 0, w - 2, 9, C.ink);
    rect(1, 1, w - 2, 7, C.brown);
    rect(1, 1, w - 2, 2, C.tan);
    rect(1, 6, w - 2, 2, C.dbrown);
    for (let x = 4; x < w - 4; x += 5) { pix(x, 3 + (x % 3), C.dbrown); pix(x + 1, 3 + (x % 3), C.dbrown); }
    // end caps
    rect(1, 1, 3, 7, C.sand); pix(2, 4, C.brown); pix(2, 3, C.tan);
    rect(w - 4, 1, 3, 7, C.sand); pix(w - 3, 4, C.brown);
  }));
}
function puddleSprite(w, mud) {
  const k = 'p' + w + (mud ? 'm' : ''); if (OB_CACHE[k]) return OB_CACHE[k];
  const h = 10;
  return (OB_CACHE[k] = offscreen(w, h, () => {
    const cx = w / 2 - 0.5, cy = h / 2 - 0.5;
    ellipse(cx, cy, Math.floor(w / 2) - 1, 4, mud ? C.plum : C.navy);
    ellipse(cx, cy, Math.floor(w / 2) - 2, 3, mud ? C.dbrown : C.blue);
    ellipse(cx + 1, cy + 1, Math.floor(w / 2) - 5, 2, mud ? C.brown : C.sky);
    hline(Math.round(cx - w / 4), Math.round(cy - 1), 3, mud ? C.tan : C.cyan);
    hline(Math.round(cx + w / 6), Math.round(cy + 1), 2, mud ? C.tan : C.white);
  }));
}

// ---------- people ----------
function personSprite(o) {
  // o: {hat:'scarf'|'helmet'|'cap'|'spiky'|'straw'|'bun', hc, hc2, top, bot, skirt, skin}
  const rows = [
    '...HHH...',
    '..HHHHH..',
    '..HfffH..',
    '..fefef..',
    '...fmf...',
    '...ttt...',
    '..ttttt..',
    '.ttttttt.',
    '.fttttTf.',
    '..ttttt..',
    o.skirt ? '..bbbbb..' : '..bbbbb..',
    o.skirt ? '.bbbbbbb.' : '..bb.bb..',
    o.skirt ? '.bbbbbbb.' : '..bb.bb..',
    '..ss.ss..'
  ].map(r => r.split(''));
  if (o.hat === 'scarf') { rows[2][2] = 'H'; rows[2][6] = 'H'; rows[3][2] = 'H'; rows[3][6] = 'H'; rows[4][2] = 'H'; rows[4][6] = 'H'; rows[1][1] = '.'; }
  if (o.hat === 'helmet') { rows[0] = '...HHH...'.split(''); rows[1] = '..HJJHH..'.split(''); rows[2] = '..HfffH..'.split(''); }
  if (o.hat === 'cap') { rows[0] = '.........'.split(''); rows[1] = '..HHHHH..'.split(''); rows[2] = '.HHfffH..'.split(''); }
  if (o.hat === 'spiky') { rows[0] = '..H.H.H..'.split(''); rows[1] = '..HHHHH..'.split(''); rows[2] = '..HfffH..'.split(''); }
  if (o.hat === 'straw') { rows[0] = '...HHH...'.split(''); rows[1] = '.HHHHHHH.'.split(''); rows[2] = '..JfffJ..'.split(''); }
  if (o.mustache) { rows[4] = '...MMM...'.split(''); }
  const pal = { H: o.hc, J: o.hc2 || o.hc, f: o.skin || C.skin, e: C.ink, m: C.skin2, t: o.top, T: o.top2 || o.top, b: o.bot, s: C.ink, M: o.mustache || C.ink };
  return makeSprite(rows.map(r => r.join('')), pal, C.ink);
}
const PEOPLE = {};
function buildPeople() {
  PEOPLE.teyze = personSprite({ hat: 'scarf', hc: C.purple, top: C.magenta, bot: C.purple, skirt: true });
  PEOPLE.ayse = personSprite({ hat: 'helmet', hc: C.gold, hc2: C.red, top: C.red, top2: C.gold, bot: C.white });
  PEOPLE.kemal = personSprite({ hat: 'cap', hc: C.dbrown, top: C.blue, top2: C.white, bot: C.white, mustache: C.lgray });
  PEOPLE.tayfun = personSprite({ hat: 'spiky', hc: C.ink, top: C.orange, top2: C.navy, bot: C.white });
  PEOPLE.hasan = personSprite({ hat: 'straw', hc: C.tan, hc2: C.tan, top: C.dgreen, bot: C.dbrown, mustache: C.ink });
  PEOPLE.chick = [
    makeSprite(['..r..', '.wwo.', 'wwww.', '.ww..', '.y.y.'], { r: C.red, w: C.white, o: C.orange, y: C.gold }, C.ink),
    makeSprite(['..r..', '.wwo.', 'wwww.', '.ww..', '..yy.'], { r: C.red, w: C.white, o: C.orange, y: C.gold }, C.ink)
  ];
}

// ---------- portraits (28x28) ----------
const PORTRAIT = {};
function drawFace(o) {
  const cx = 14, cy = 16;
  ellipse(cx, cy, 7, 8, C.ink);
  ellipse(cx, cy, 6, 7, o.skin || C.skin);
  ellipse(cx + 2, cy + 2, 3, 4, o.skin2 || C.skin2); ellipse(cx, cy, 5, 6, o.skin || C.skin);
  // eyes
  rect(cx - 3, cy, 2, 2, C.white); rect(cx + 2, cy, 2, 2, C.white);
  pix(cx - 2, cy + 1, C.ink); pix(cx + 3, cy + 1, C.ink);
  // cheeks + mouth
  pix(cx - 4, cy + 3, C.salmon); pix(cx + 4, cy + 3, C.salmon);
  hline(cx - 1, cy + 5, 3, o.mouth || C.dbrown);
}
function buildPortraits() {
  PORTRAIT.teyze = offscreen(28, 28, () => {
    ellipse(14, 13, 10, 10, C.ink); ellipse(14, 13, 9, 9, C.purple);
    for (const [x, y] of [[8, 9], [12, 6], [17, 7], [20, 11], [7, 14]]) pix(x, y, C.salmon);
    drawFace({});
    // scarf front band and knot
    rect(6, 9, 16, 4, C.purple); hline(6, 12, 16, C.magenta); for (const x of [8, 12, 16, 20]) pix(x, 10, C.salmon);
    rect(12, 24, 5, 3, C.purple); pix(14, 25, C.magenta);
    // glasses
    box(9, 15, 5, 4, C.slate); box(15, 15, 5, 4, C.slate); hline(14, 16, 1, C.slate);
    pix(11, 17, C.ink); pix(17, 17, C.ink);
    rect(3, 27, 22, 1, C.magenta);
  });
  PORTRAIT.ayse = offscreen(28, 28, () => {
    rect(19, 14, 4, 10, C.dbrown); rect(20, 15, 2, 9, C.brown); // ponytail
    drawFace({});
    // helmet
    ellipse(14, 10, 9, 6, C.ink); ellipse(14, 10, 8, 5, C.gold); rect(6, 10, 17, 3, C.gold); hline(5, 13, 19, C.ink);
    rect(13, 4, 3, 9, C.red); pix(10, 7, C.yellow); pix(11, 6, C.yellow);
    vline(7, 13, 6, C.slate); vline(21, 13, 6, C.slate); // strap
    hline(12, 21, 5, C.dbrown); pix(12, 20, C.dbrown); pix(16, 20, C.dbrown); // smile
    rect(4, 25, 20, 3, C.red); rect(12, 25, 4, 3, C.gold);
  });
  PORTRAIT.kemal = offscreen(28, 28, () => {
    drawFace({ skin2: C.skin2 });
    rect(6, 14, 2, 5, C.lgray); rect(20, 14, 2, 5, C.lgray); // sideburns
    // cap
    ellipse(14, 9, 9, 5, C.ink); ellipse(14, 9, 8, 4, C.dbrown); rect(4, 11, 20, 2, C.ink); rect(5, 11, 18, 1, C.brown); pix(14, 6, C.tan);
    // mustache
    rect(10, 20, 9, 2, C.lgray); pix(9, 21, C.lgray); pix(19, 21, C.lgray); hline(12, 22, 5, C.dbrown);
    hline(10, 14, 3, C.dbrown); hline(16, 14, 3, C.dbrown);
    rect(4, 25, 20, 3, C.blue); rect(12, 25, 4, 3, C.white);
  });
  PORTRAIT.tayfun = offscreen(28, 28, () => {
    drawFace({ mouth: C.wine });
    // spiky hair
    g.fillStyle = C.ink;
    for (let i = 0; i < 6; i++) { const x = 6 + i * 3; rect(x, 4 + (i % 2) * 2, 3, 8, C.ink); }
    rect(6, 8, 17, 5, C.ink); rect(7, 9, 15, 3, C.navy);
    // goggles on forehead
    rect(7, 11, 15, 3, C.slate); rect(8, 11, 5, 3, C.cyan); rect(16, 11, 5, 3, C.cyan); pix(9, 11, C.white); pix(17, 11, C.white);
    // grin
    rect(11, 21, 7, 2, C.white); hline(11, 23, 7, C.wine);
    rect(4, 25, 20, 3, C.orange); rect(12, 25, 4, 3, C.navy);
  });
  PORTRAIT.hasan = offscreen(28, 28, () => {
    drawFace({});
    // straw hat
    ellipse(14, 10, 13, 3, C.ink); ellipse(14, 10, 12, 2, C.tan); ellipse(14, 7, 6, 4, C.ink); ellipse(14, 7, 5, 3, C.tan); hline(9, 9, 11, C.red);
    // mustache
    rect(9, 20, 11, 2, C.ink); pix(8, 21, C.ink); pix(20, 21, C.ink);
    rect(4, 25, 20, 3, C.dgreen);
  });
}

// ---------- farm buildings (pre-rendered) ----------
const BLD = {};
function shadeRect(x, y, w, h, base, light, dark) { rect(x, y, w, h, base); hline(x, y, w, light); vline(x, y, h, light); hline(x, y + h - 1, w, dark); vline(x + w - 1, y, h, dark); }
function roofTri(cx, y0, rows, hw0, grow, col, edge) {
  for (let r = 0; r < rows; r++) { const hw = Math.round(hw0 + r * grow); rect(cx - hw, y0 + r, hw * 2, 1, col); if (edge) { pix(cx - hw, y0 + r, edge); pix(cx + hw - 1, y0 + r, edge); } }
}
function buildBuildings() {
  // AHIR (barn)
  for (const broken of [false, true]) {
    BLD['ahir' + (broken ? 'X' : '')] = offscreen(56, 48, () => {
      const wall = broken ? C.dgray : C.rust, plank = broken ? C.slate : C.wine, trim = broken ? C.gray : C.white, roof = broken ? C.navy : C.dbrown, roofL = broken ? C.slate : C.brown;
      // roof (gambrel)
      for (let r = 0; r < 18; r++) { const hw = r < 7 ? 12 + r * 2 : 26 + Math.floor((r - 7) / 4); rect(28 - hw - 1, r, hw * 2 + 2, 1, C.ink); rect(28 - hw, r, hw * 2, 1, r % 3 === 0 ? roofL : roof); }
      // walls
      rect(3, 17, 50, 30, C.ink); rect(4, 17, 48, 29, wall);
      for (let x = 6; x < 52; x += 4) vline(x, 18, 28, plank);
      rect(4, 17, 48, 2, trim); vline(4, 17, 29, trim); vline(51, 17, 29, trim);
      // loft window
      rect(23, 20, 10, 7, trim); rect(24, 21, 8, 5, broken ? C.ink : C.gold); if (!broken) { hline(24, 23, 8, C.orange0); }
      // door
      rect(17, 29, 22, 17, trim); rect(18, 30, 20, 16, broken ? C.ink : C.wine);
      if (!broken) { for (let i = 0; i < 16; i++) { pix(18 + Math.round(i * 20 / 16), 30 + i, trim); pix(37 - Math.round(i * 20 / 16), 30 + i, trim); } vline(28, 30, 16, trim); }
      else { rect(16, 33, 24, 3, C.brown); rect(16, 40, 24, 3, C.dbrown); rect(8, 34, 5, 6, C.ink); rect(42, 22, 4, 7, C.ink); }
      hline(3, 46, 50, C.ink); hline(4, 47, 48, 'rgba(24,20,37,0.4)');
    });
  }
  // NALBANT (smithy)
  for (const broken of [false, true]) {
    BLD['nalbant' + (broken ? 'X' : '')] = offscreen(48, 42, () => {
      const stone = broken ? C.dgray : C.gray, line = broken ? C.slate : C.dgray, roof = broken ? C.navy : C.slate;
      // chimney
      rect(34, 0, 8, 14, C.ink); rect(35, 1, 6, 13, broken ? C.slate : C.dgray); hline(35, 1, 6, C.gray);
      roofTri(24, 4, 12, 10, 1.2, roof, C.ink); hline(10, 15, 28, C.ink);
      rect(3, 15, 42, 26, C.ink); rect(4, 15, 40, 25, stone);
      for (let y = 18; y < 40; y += 4) { hline(4, y, 40, line); for (let x = 4 + ((y / 4) % 2) * 3; x < 44; x += 7) vline(x, y + 1, 3, line); }
      // door arch
      rect(16, 25, 16, 15, C.ink); rect(17, 26, 14, 14, broken ? C.navy : C.plum);
      if (!broken) { rect(18, 31, 12, 9, C.orange); rect(20, 33, 8, 7, C.gold); rect(22, 35, 4, 5, C.yellow); }
      else { rect(15, 29, 18, 3, C.brown); rect(15, 35, 18, 3, C.dbrown); }
      // sign: horseshoe
      rect(6, 20, 8, 8, C.brown); hline(6, 20, 8, C.tan);
      spr(ICONS.shoe ? makeSprite(['g...g', 'g...g', 'g...g', '.ggg.'], { g: broken ? C.slate : C.lgray }, null) : null, 7, 22);
      hline(3, 40, 42, C.ink);
    });
  }
  // AMBAR (granary + silo)
  for (const broken of [false, true]) {
    BLD['ambar' + (broken ? 'X' : '')] = offscreen(44, 50, () => {
      const silo = broken ? C.dgray : C.lgray, band = broken ? C.slate : C.gray, wood = broken ? C.slate : C.tan, woodD = broken ? C.navy : C.brown, roof = broken ? C.navy : C.dbrown;
      // silo
      ellipse(10, 7, 8, 5, C.ink); ellipse(10, 7, 7, 4, broken ? C.slate : C.sky); ellipse(9, 6, 4, 2, broken ? C.dgray : C.cyan);
      rect(2, 8, 17, 41, C.ink); rect(3, 8, 15, 40, silo); vline(3, 8, 40, C.white); vline(16, 8, 40, band); vline(17, 8, 40, band);
      for (let y = 14; y < 46; y += 8) hline(3, y, 15, band);
      if (broken) { rect(7, 24, 4, 6, C.ink); rect(12, 36, 3, 4, C.ink); }
      // shed
      roofTri(31, 18, 8, 6, 1.4, roof, C.ink);
      rect(18, 25, 25, 24, C.ink); rect(19, 25, 23, 23, wood);
      for (let x = 21; x < 42; x += 3) vline(x, 26, 22, woodD);
      rect(25, 33, 11, 15, C.ink); rect(26, 34, 9, 14, broken ? C.navy : C.dbrown);
      if (!broken) { rect(26, 40, 9, 8, C.gold); hline(26, 42, 9, C.orange0); hline(26, 45, 9, C.orange0); }
      else { rect(24, 37, 13, 2, C.brown); }
      hline(2, 49, 41, C.ink);
    });
  }
  // VETERINER
  for (const broken of [false, true]) {
    BLD['veteriner' + (broken ? 'X' : '')] = offscreen(48, 40, () => {
      const wall = broken ? C.dgray : C.white, wallD = broken ? C.slate : C.lgray, roof = broken ? C.navy : C.dgreen, roofL = broken ? C.slate : C.green;
      roofTri(24, 0, 14, 8, 1.3, roof, C.ink);
      for (let r = 2; r < 14; r += 3) hline(24 - Math.round(8 + r * 1.3) + 2, r, Math.round(8 + r * 1.3) * 2 - 4, roofL);
      rect(3, 14, 42, 25, C.ink); rect(4, 14, 40, 24, wall); hline(4, 14, 40, wallD); rect(4, 34, 40, 4, wallD);
      // windows
      for (const wx of [8, 32]) { rect(wx, 19, 8, 7, C.ink); rect(wx + 1, 20, 6, 5, broken ? C.navy : C.sky); pix(wx + 2, 21, C.white); vline(wx + 4, 20, 5, C.ink); }
      // door
      rect(19, 22, 10, 16, C.ink); rect(20, 23, 8, 15, broken ? C.navy : C.blue); pix(26, 30, C.gold);
      // sign
      rect(17, 15, 14, 6, C.ink); rect(18, 16, 12, 4, broken ? C.slate : C.white);
      if (!broken) { spr(makeSprite(['.r.r.', 'rrrrr', '.rrr.', '..r..'], { r: C.red }, null), 21, 16); }
      if (broken) { rect(18, 26, 12, 2, C.brown); rect(18, 32, 12, 2, C.dbrown); }
      hline(3, 38, 42, C.ink);
    });
  }
  // JOKEY EVI
  for (const broken of [false, true]) {
    BLD['jokey' + (broken ? 'X' : '')] = offscreen(46, 42, () => {
      const wall = broken ? C.dgray : C.brown, plank = broken ? C.slate : C.dbrown, roof = broken ? C.navy : C.blue, roofL = broken ? C.slate : C.sky;
      // flag pole
      vline(40, 0, 18, C.ink); vline(41, 0, 18, C.lgray);
      roofTri(22, 4, 12, 8, 1.3, roof, C.ink);
      for (let r = 5; r < 12; r += 3) hline(22 - Math.round(8 + r * 1.3) + 2, 4 + r, Math.round(8 + r * 1.3) * 2 - 4, roofL);
      rect(3, 16, 38, 25, C.ink); rect(4, 16, 36, 24, wall);
      for (let y = 19; y < 40; y += 3) hline(4, y, 36, plank);
      rect(17, 25, 10, 15, C.ink); rect(18, 26, 8, 14, broken ? C.navy : C.plum); pix(24, 33, C.gold);
      rect(7, 22, 7, 6, C.ink); rect(8, 23, 5, 4, broken ? C.navy : C.yellow); vline(10, 23, 4, C.ink);
      rect(30, 22, 7, 6, C.ink); rect(31, 23, 5, 4, broken ? C.navy : C.yellow); vline(33, 23, 4, C.ink);
      if (broken) { rect(16, 29, 12, 2, C.tan); }
      hline(3, 41, 38, C.ink);
    });
  }
  // FARMHOUSE (Teyze)
  BLD.ev = offscreen(54, 44, () => {
    roofTri(27, 0, 16, 10, 1.1, C.rust, C.ink);
    for (let r = 3; r < 16; r += 3) hline(27 - Math.round(10 + r * 1.1) + 2, r, Math.round(10 + r * 1.1) * 2 - 4, C.orange0);
    rect(4, 16, 46, 27, C.ink); rect(5, 16, 44, 26, C.sand); hline(5, 16, 44, C.tan);
    // windows with flower boxes
    for (const wx of [9, 37]) { rect(wx, 20, 9, 8, C.ink); rect(wx + 1, 21, 7, 6, C.sky); vline(wx + 4, 21, 6, C.ink); hline(wx + 1, 23, 7, C.ink); pix(wx + 2, 21, C.white); rect(wx, 28, 9, 2, C.dbrown); pix(wx + 1, 27, C.red); pix(wx + 4, 27, C.salmon); pix(wx + 7, 27, C.red); }
    // door
    rect(22, 25, 10, 17, C.ink); rect(23, 26, 8, 16, C.dgreen); pix(29, 33, C.gold);
    // porch roof
    rect(15, 23, 24, 2, C.dbrown);
    vline(16, 25, 17, C.lgray); vline(37, 25, 17, C.lgray);
    hline(4, 42, 46, C.ink); hline(5, 43, 44, 'rgba(24,20,37,0.4)');
  });
  // NOTICE BOARD
  BLD.pano = offscreen(26, 24, () => {
    rect(3, 8, 2, 16, C.ink); rect(21, 8, 2, 16, C.ink); vline(3, 8, 16, C.dbrown); vline(21, 8, 16, C.dbrown);
    rect(0, 0, 26, 17, C.ink); rect(1, 1, 24, 15, C.brown); rect(2, 2, 22, 13, C.tan);
    rect(4, 4, 7, 8, C.white); hline(5, 6, 5, C.gray); hline(5, 8, 4, C.gray); pix(7, 4, C.red);
    rect(13, 3, 8, 6, C.sand); hline(14, 5, 6, C.gray); pix(17, 3, C.sky);
    rect(13, 10, 6, 4, C.white); pix(15, 10, C.green);
  });
  // GATE
  BLD.gate = offscreen(60, 30, () => {
    rect(2, 4, 5, 26, C.ink); rect(3, 4, 3, 26, C.brown); rect(53, 4, 5, 26, C.ink); rect(54, 4, 3, 26, C.brown);
    rect(0, 2, 60, 9, C.ink); rect(1, 3, 58, 7, C.dbrown); hline(1, 3, 58, C.brown);
    rect(14, 0, 32, 13, C.ink); rect(15, 1, 30, 11, C.sand);
  });
  BLD.fountain = offscreen(40, 30, () => {
    ellipse(20, 22, 18, 7, C.ink); ellipse(20, 22, 17, 6, C.gray); ellipse(20, 21, 14, 4, C.blue); ellipse(20, 21, 10, 2, C.sky);
    rect(17, 6, 6, 15, C.ink); rect(18, 6, 4, 15, C.lgray); ellipse(20, 6, 6, 2, C.ink); ellipse(20, 6, 5, 1, C.gray);
  });
  BLD.stall = offscreen(64, 44, () => {
    rect(4, 10, 3, 34, C.ink); rect(57, 10, 3, 34, C.ink); vline(5, 10, 34, C.dbrown); vline(58, 10, 34, C.dbrown);
    rect(0, 0, 64, 14, C.ink);
    for (let x = 1; x < 63; x++) { const red = Math.floor((x - 1) / 6) % 2 === 0; vline(x, 1, 11, red ? C.red : C.white); }
    for (let x = 1; x < 63; x += 6) { pix(x + 2, 12, C.ink); pix(x + 3, 13, C.ink); }
    rect(2, 30, 60, 14, C.ink); rect(3, 31, 58, 12, C.brown); hline(3, 31, 58, C.tan);
    for (let x = 6; x < 60; x += 9) { rect(x, 26, 6, 5, C.ink); rect(x + 1, 27, 4, 3, [C.red, C.green, C.gold, C.orange, C.salmon, C.purple][(x / 9 | 0) % 6]); }
  });
}
function buildArt() {
  buildIcons(); buildObstacles(); buildPeople(); buildPortraits(); buildBuildings(); buildArt2();
  // space-tournament art packs override the farm-era sprites when present
  if (typeof buildStationArt === 'function') buildStationArt();
  if (typeof buildRacerArt === 'function') buildRacerArt();
  if (typeof buildRivalArt === 'function') buildRivalArt();
  if (typeof applyPixelLabStaticArt === 'function') applyPixelLabStaticArt();
}
