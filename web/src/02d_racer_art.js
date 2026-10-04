// ================= RACER PACK (Galaxy Cup): alien rivals + mounts, space foes, alien track props =================
// buildArt() calls buildRacerArt() last: it overwrites the farm-era sprites in OB / FOE_SPR / PROJ / ICONS and the
// hurdle / log / puddle sprite builders. Racers come from ALIEN_LOOKS through getMount(lookOrKey), which returns a
// cached set shaped exactly like getHorse(): { frames: [4 run frames], jump, stand, white }, all facing UP.

// ---------- palette ramps: one step darker / lighter inside C ----------
const RCR_DK = {}, RCR_LT = {};
(function () {
  const dk = 'rust>dbrown orange0>rust sand>tan tan>brown brown>dbrown dbrown>plum plum>ink wine>plum red>wine orange>rust gold>orange yellow>gold green>dgreen dgreen>ddgreen ddgreen>teal teal>ink blue>navy sky>blue cyan>sky white>lgray lgray>gray gray>dgray dgray>slate slate>navy navy>ink ink>ink hot>wine purple>plum magenta>purple salmon>magenta skin>skin2 skin2>brown';
  const lt = 'rust>orange0 orange0>tan sand>white tan>sand brown>tan dbrown>brown plum>purple wine>red red>salmon orange>gold gold>yellow yellow>white green>yellow dgreen>green ddgreen>dgreen teal>ddgreen blue>sky sky>cyan cyan>white white>white lgray>white gray>lgray dgray>gray slate>dgray navy>slate ink>navy hot>salmon purple>magenta magenta>salmon salmon>sand skin>sand skin2>skin';
  for (const p of dk.split(' ')) { const [a, b] = p.split('>'); RCR_DK[C[a]] = C[b]; }
  for (const p of lt.split(' ')) { const [a, b] = p.split('>'); RCR_LT[C[a]] = C[b]; }
})();
const rcrDk = c => RCR_DK[c] || c, rcrLt = c => RCR_LT[c] || c;

// ---------- looks ----------
// mount: lizard | beetle | ray | bird | beast      c/l/d: body base/light/dark   a: pattern accent   b: secondary
// eye: mount eye glow   leg: leg colour   rider: stalk tri fin dome robo hood tricorn horn mono ears squid crystal brute
// skin / suit / trim: rider colours   reye: rider eye / light colour   glass, brain, horn, hat, cape: kind extras
const ALIEN_LOOKS = {
  // generic rivals
  r1: { mount: 'lizard', c: C.green, l: C.yellow, d: C.dgreen, a: C.orange, eye: C.yellow, rider: 'stalk', skin: C.salmon, suit: C.purple, trim: C.yellow, reye: C.green },
  r2: { mount: 'beetle', c: C.red, l: C.salmon, d: C.wine, a: C.ink, b: C.navy, eye: C.yellow, rider: 'tri', skin: C.green, suit: C.gold, trim: C.white },
  r3: { mount: 'ray', c: C.sky, l: C.cyan, d: C.blue, a: C.white, eye: C.yellow, rider: 'dome', skin: C.green, suit: C.orange, trim: C.yellow, glass: C.salmon, brain: C.magenta },
  r4: { mount: 'bird', c: C.salmon, l: C.sand, d: C.magenta, a: C.cyan, b: C.gold, leg: C.gold, eye: C.ink, rider: 'fin', skin: C.cyan, suit: C.blue, trim: C.yellow },
  r5: { mount: 'beast', c: C.magenta, l: C.salmon, d: C.purple, a: C.salmon, b: C.salmon, eye: C.yellow, rider: 'robo', skin: C.lgray, suit: C.orange, trim: C.yellow, reye: C.cyan },
  r6: { mount: 'lizard', c: C.orange, l: C.gold, d: C.rust, a: C.yellow, eye: C.cyan, rider: 'horn', skin: C.sky, suit: C.white, trim: C.blue, horn: C.yellow },
  r7: { mount: 'beetle', c: C.gold, l: C.yellow, d: C.orange, a: C.blue, b: C.rust, eye: C.cyan, rider: 'mono', skin: C.green, suit: C.purple, trim: C.cyan, reye: C.red },
  r8: { mount: 'bird', c: C.lgray, l: C.white, d: C.gray, a: C.sky, b: C.orange, leg: C.orange, eye: C.ink, rider: 'ears', skin: C.green, suit: C.red, trim: C.yellow },
  // named rivals
  n1: { mount: 'ray', stripes: true, c: C.orange, l: C.gold, d: C.rust, a: C.yellow, eye: C.white, rider: 'squid', skin: C.magenta, suit: C.navy, trim: C.gold, reye: C.yellow },
  n2: { mount: 'beast', spikes: true, c: C.lgray, l: C.white, d: C.sky, a: C.blue, b: C.white, eye: C.cyan, rider: 'fin', skin: C.blue, suit: C.white, trim: C.cyan },
  n3: { mount: 'lizard', sail: true, c: C.sky, l: C.cyan, d: C.blue, a: C.yellow, eye: C.hot, rider: 'robo', skin: C.gold, suit: C.navy, trim: C.yellow, reye: C.hot },
  n4: { mount: 'bird', fancyTail: true, c: C.gold, l: C.yellow, d: C.orange, a: C.cyan, b: C.blue, leg: C.rust, eye: C.ink, rider: 'stalk', skin: C.purple, suit: C.sky, trim: C.white, reye: C.yellow },
  n5: { mount: 'beetle', horned: true, c: C.cyan, l: C.white, d: C.sky, a: C.magenta, b: C.blue, eye: C.yellow, rider: 'dome', skin: C.yellow, suit: C.magenta, trim: C.white, glass: C.green, brain: C.yellow },
  n6: { mount: 'ray', glowEdge: true, c: C.navy, l: C.slate, d: C.ink, a: C.gold, eye: C.gold, rider: 'ears', skin: C.lgray, suit: C.wine, trim: C.gold, reye: C.gold },
  // champions
  kristalo: { mount: 'ray', c: C.magenta, l: C.salmon, d: C.purple, a: C.cyan, b: C.white, eye: C.white, crystal: true, rider: 'crystal', skin: C.lgray, suit: C.white, trim: C.magenta, cape: C.cyan },
  gorm: { mount: 'beast', c: C.dgreen, l: C.green, d: C.ddgreen, a: C.gray, b: C.lgray, eye: C.yellow, big: true, rider: 'brute', skin: C.gray, suit: C.dgreen, trim: C.lgray, reye: C.yellow, horn: C.sand },
  // enemies
  korsan: { mount: 'lizard', c: C.slate, l: C.dgray, d: C.navy, a: C.wine, eye: C.red, rider: 'hood', skin: C.green, suit: C.plum, trim: C.gold, hat: C.red },
  nisanci: { mount: 'bird', c: C.teal, l: C.ddgreen, d: C.ink, a: C.green, b: C.cyan, leg: C.gold, eye: C.green, rider: 'mono', skin: C.dgreen, suit: C.slate, trim: C.green, reye: C.red },
  kaptan: { mount: 'beast', c: C.wine, l: C.red, d: C.plum, a: C.ink, b: C.salmon, eye: C.yellow, rider: 'tricorn', skin: C.green, suit: C.navy, trim: C.gold, hat: C.ink }
};

// ---------- tiny grid painter (char grids -> makeSprite) ----------
function rcrGrid(w, h) { const G = []; for (let y = 0; y < h; y++) G.push(new Array(w).fill('.')); return G; }
function rcrPut(G, x, y, ch) { x = Math.round(x); y = Math.round(y); if (y >= 0 && y < G.length && x >= 0 && x < G[0].length) G[y][x] = ch; }
function rcrGet(G, x, y) { x = Math.round(x); y = Math.round(y); return (y >= 0 && y < G.length && x >= 0 && x < G[0].length) ? G[y][x] : '.'; }
// fill n pixels each side of the centre line cx (cx = k + 0.5), shifted by dx
function rcrSpan(G, y, cx, n, ch, dx) { if (n <= 0) return; const a = Math.round(cx - 0.5 - (n - 1) + (dx || 0)), b = Math.round(cx + 0.5 + (n - 1) + (dx || 0)); for (let x = a; x <= b; x++) rcrPut(G, x, y, ch); }
function rcrEll(G, cx, cy, rx, ry, ch) {
  for (let y = Math.ceil(cy - ry); y <= Math.floor(cy + ry); y++) {
    const t = (y - cy) / ry, hw = rx * Math.sqrt(Math.max(0, 1 - t * t));
    for (let x = Math.ceil(cx - hw - 0.01); x <= Math.floor(cx + hw + 0.01); x++) rcrPut(G, x, y, ch);
  }
}
function rcrStamp(G, rows, ox, oy) { rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] !== '.') rcrPut(G, ox + x, oy + y, r[x]); }); }
function rcrMirror(G, x, y, ch, cx) { rcrPut(G, x, y, ch); rcrPut(G, 2 * cx - x, y, ch); }
// left edge pixels of each body run -> light, right edge -> dark
function rcrShade(G, base, light, dark, nl, nd) {
  for (const row of G) {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== base) { x++; continue; }
      let e = x; while (e < row.length && row[e] === base) e++;
      const len = e - x;
      if (len >= 3) { for (let i = 0; i < nl && i < len - 1; i++) row[x + i] = light; for (let i = 0; i < nd && i < len - 1; i++) row[e - 1 - i] = dark; }
      x = e;
    }
  }
}
function rcrRows(G) { return G.map(r => r.join('')); }
function rcrPx(c, x, y, col) { const cx = c.getContext('2d'); cx.fillStyle = col; cx.fillRect(x, y, 1, 1); }

// ---------- riders: small outlined sprites composited on the mount's back ----------
// rows are the rider's interior (the outline is added around them); a neck notch separates head and suit.
function rcrRiderRows(L, f) {
  const alt = f === 1 || f === 3, k = L.rider;
  const body = ['..JJ..', 'SSTTSS', 'SSTTSS', '.UTTU.'];
  switch (k) {
    case 'stalk': return [alt ? 'W....W' : '.W..W.', alt ? 'H....H' : '.H..H.', '.HHHH.', 'HHHHHH', '.HHHH.'].concat(body);
    case 'tri': return ['...HW...', 'HW.HH.WH', 'HH....HH', '........'].concat(body.map(r => '.' + r + '.'));
    case 'fin': return ['..T...', '..TT..', '.HTTH.', 'XHTTHX', '.HTTH.'].concat(body);
    case 'dome': return ['.QQQQ.', 'QWQQQQ', 'QQPPQV', 'QPPPPV', '.VVVV.'].concat(body);
    case 'robo': return [alt ? '..R...' : '..r...', '..N...', 'MMMMMM', 'MEEEEM', 'NNNNNN'].concat(body);
    case 'hood': return ['.BBBB.', 'BWBBWB', 'BBBBBB', 'HXHHXH', alt ? '.HHHHB' : 'BHHHH.'].concat(body);
    case 'tricorn': return ['...YY...', '..YOOY..', '.YOOOOY.', 'YOOWWOOY', 'YOOOOOOY', 'YYYYYYYY', '..HXXH..'].concat(body.map(r => '.' + r + '.'));
    case 'horn': return ['Z....Z', 'Z....Z', '.ZHHZ.', 'HXHHXH', '.HHHH.'].concat(body);
    case 'mono': return ['.HHHH.', 'HWWWWH', 'HWEXWH', 'HWWWWH', '.HHHH.'].concat(body);
    case 'ears': return ['H......H', 'HP....PH', '.HPHHPH.', '..XHHX..', '..HHHH..'].concat(body.map(r => '.' + r + '.'));
    case 'squid': return ['..HH..', '.HJJH.', 'HHHHHH', '.HJJH.', 'WXHHXW', alt ? 'H.HH.H' : '.H..H.'].concat(body.slice(1));
    case 'crystal': return ['C.CC.C', 'ICIICI', '.HHHH.', 'HXHHXH', '.HHHH.', '..JJ..', 'KSTTSK', 'KSTTSK', 'KKSSKK', alt ? 'K.KK.K' : '.K..K.'];
    case 'brute': return ['..T..T..', '.TFTTFT.', '.FFFFFF.', 'FFEFFEFF', 'FFFFFFFF', '.FFDDFF.', 'FFSTTSFF', 'FSSTTSSF', '.FUTTUF.'];
    default: return ['.HHHH.', 'HXHHXH', '.HHHH.'].concat(body);
  }
}
function rcrRider(L, f) {
  const rows = rcrRiderRows(L, f), w = Math.max(...rows.map(r => r.length));
  return makeSprite(rows.map(r => r.padEnd(w, '.')), rcrPal(L), C.ink);
}
function rcrPal(L) {
  const skin = L.skin || C.green, suit = L.suit || C.blue;
  return {
    // mount
    c: L.c, l: L.l || rcrLt(L.c), d: L.d || rcrDk(L.c), a: L.a || C.yellow, b: L.b || rcrLt(L.c), g: L.eye || C.yellow,
    n: L.n || C.gold, k: L.leg || rcrDk(L.d || rcrDk(L.c)), x: C.ink, w: C.white, m: L.m || rcrDk(L.d || L.c), o: rcrDk(L.a || C.yellow),
    // rider
    H: skin, J: L.skin2 || rcrDk(skin), S: suit, U: L.suit2 || rcrDk(suit), T: L.trim || C.white, X: C.ink, W: C.white,
    E: L.reye || C.yellow, Q: L.glass || C.cyan, V: rcrDk(L.glass || C.cyan), P: L.brain || C.salmon,
    R: L.reye || C.red, r: rcrDk(L.reye || C.red), M: skin, N: rcrDk(skin), B: L.hat || C.red, O: L.hat || C.navy, Y: C.gold, Z: L.horn || C.sand,
    F: skin, D: rcrDk(skin), K: L.cape || C.magenta, I: C.white, C: C.cyan, h: L.horn || C.sand
  };
}
// composite a rider (outlined) so that its spine sits on canvas x = cxc (a pixel boundary), top at row y
function rcrSeat(c, L, f, cxc, y) {
  const r = rcrRider(L, f);
  c.getContext('2d').drawImage(r, Math.round(cxc - r.width / 2), y);
  return c;
}
function rcrTpl(rows) { return rows.map(r => r.split('')); }

// ---------- mount bodies ----------
// every builder returns a canvas; f = 0..3 run cycle, 4 = jump (airborne), 5 = stand
const RCR_SWING = [[1, -1], [0, 0], [-1, 1], [0, 0]]; // leg group A / B: +1 forward, -1 back

const RCR_LIZARD_L = [
  '.......cc', '......ccc', '....ggccc', '.....xccc', '......ccc', '.......cc', '......ccc', '....ccccc',
  '....ccccc', '....ccccc', '....ccccc', '....ccccc', '....ccccc', '....ccccc', '.....cccc', '......ccc', '.......cc'];
function rcrLizard(L, f) {
  const cx = 8.5, G = rcrTpl(rcrMirrorRows(RCR_LIZARD_L));
  while (G.length < 28) G.push(new Array(18).fill('.'));
  const run = f < 4, air = f === 4;
  // swaying tail
  const ph = run ? f * Math.PI / 2 : 0, tx = [];
  for (let y = 17; y < 28; y++) {
    const t = (y - 16) / 11, dx = air ? 0 : Math.round(Math.sin(ph - t * 2.8) * 2.8 * t);
    tx[y] = dx;
    if (y < 22) rcrSpan(G, y, cx, 1, 'c', dx); else rcrPut(G, 8 + dx, y, 'c');
  }
  rcrShade(G, 'c', 'l', 'd', 1, 1);
  // pattern: side spots + crest spikes down the tail
  for (const y of [8, 11]) rcrMirror(G, 4, y, 'a', cx);
  if (L.sail) { // spiky dorsal sail down the tail
    for (let y = 17; y < 26; y++) { const x = 8 + tx[y]; rcrPut(G, x + (y < 22 ? 1 : 0), y, 'a'); if (y % 2 && y < 25) rcrPut(G, x + (y < 22 ? 2 : 1) + (y % 4 === 1 ? 0 : -3 + (y < 22 ? 0 : 1)), y, 'a'); }
  } else for (let y = 18; y < 26; y += 2) { const x = 8 + tx[y]; rcrPut(G, x, y, 'a'); if (y < 22) rcrPut(G, x + 1, y, 'a'); }
  // legs: 3 pairs, diagonal pairs alternate; always angled, with splayed toes
  const legs = [[7, 0, 1], [10, 1, 0], [13, 0, -1]];
  for (let i = 0; i < 3; i++) {
    const [y, grp, bias] = legs[i];
    for (const side of [0, 1]) {
      let s = run ? RCR_SWING[f][side ? 1 - grp : grp] : bias;
      if (s === 0) s = bias || (side ? -1 : 1);
      const X = x => side ? 2 * cx - x : x;
      if (air) { rcrPut(G, X(3), y + 1, 'd'); rcrPut(G, X(2), y + 2, 'k'); continue; }
      rcrPut(G, X(3), y, 'd'); rcrPut(G, X(2), y - s, 'd'); rcrPut(G, X(1), y - 2 * s, 'k'); rcrPut(G, X(0), y - 2 * s, 'k'); rcrPut(G, X(1), y - 3 * s, 'k');
    }
  }
  const c = makeSprite(rcrRows(G), rcrPal(L), C.ink);
  return rcrSeat(c, L, f, 10, 7);
}

function rcrBeetle(L, f) {
  const GW = 20, GH = 25, cx = 9.5, G = rcrGrid(GW, GH);
  const run = f < 4, air = f === 4;
  // mandibles, head, pronotum
  rcrMirror(G, 7, 1, 'm', cx); rcrMirror(G, 8, 2, 'm', cx);
  if (L.horned) { rcrSpan(G, 0, cx, 1, 'h'); rcrSpan(G, 1, cx, 1, 'h'); rcrPut(G, 9, 0, 'w'); }
  rcrSpan(G, 2, cx, 1, 'b'); rcrSpan(G, 3, cx, 2, 'b'); rcrSpan(G, 4, cx, 2, 'b');
  rcrSpan(G, 5, cx, 3, 'b'); rcrSpan(G, 6, cx, 4, 'b'); rcrSpan(G, 7, cx, 4, 'b');
  // elytra
  rcrEll(G, cx, 15.5, 6.6, 7.2, 'c');
  rcrShade(G, 'c', 'l', 'd', 1, 1);
  for (let y = 9; y <= 22; y++) rcrPut(G, 9, y, 'x');
  rcrPut(G, 10, 22, '.'); rcrPut(G, 9, 22, '.');
  // gloss + spots
  rcrPut(G, 5, 11, 'w'); rcrPut(G, 6, 10, 'l'); rcrPut(G, 4, 12, 'l'); rcrPut(G, 12, 10, 'l'); rcrPut(G, 11, 11, 'w');
  for (const [x, y] of [[5, 15], [7, 19], [6, 13]]) rcrMirror(G, x, y, 'a', cx);
  const c = makeSprite(rcrRows(G), rcrPal(L), C.ink);
  // thin legs + antennae drawn after the outline
  const P = rcrPal(L), leg = C.ink, tip = L.a === C.ink ? C.yellow : P.a;
  const ant = run ? [0, 1, 0, 1][f] : 0;
  for (const s of [-1, 1]) {
    const X = x => s < 0 ? x : 21 - x;
    rcrPx(c, X(7), 3, leg); rcrPx(c, X(6), 2, leg); rcrPx(c, X(5), 1, leg); rcrPx(c, X(4 + ant), 0, tip); rcrPx(c, X(4 + ant), 1, ant ? leg : tip);
    const rows = [11, 15, 19];
    for (let i = 0; i < 3; i++) {
      const grp = (i + (s < 0 ? 0 : 1)) % 2, sw = run ? RCR_SWING[f][grp] : 0, y = rows[i] + 1;
      if (air) { rcrPx(c, X(3), y, leg); rcrPx(c, X(2), y + 1, leg); continue; }
      const dir = i === 0 ? -1 : i === 2 ? 1 : 0;
      rcrPx(c, X(3), y, leg); rcrPx(c, X(2), y + dir - sw, leg); rcrPx(c, X(1), y + 2 * dir - sw, leg);
    }
  }
  return rcrSeat(c, L, f, 11, 3);
}

function rcrRay(L, f) {
  const GW = 20, GH = 25, cx = 9.5, G = rcrGrid(GW, GH);
  const run = f < 4, air = f === 4;
  const bob = run ? [0, 0, 1, 1][f] : 0;
  const flap = run ? [0, -1, 0, 1][f] : air ? -1 : 0; // -1 tips raised, 1 tips lowered
  const oy = 1 + bob;
  const prof = [4, 5, 6, 7, 8, 9, 10, 10, 8, 6, 5, 4, 4, 3, 2, 1];
  for (let i = 0; i < prof.length; i++) {
    let n = prof[i];
    if (flap < 0 && i >= 5 && i <= 7) n -= 1;
    if (flap > 0 && i === 5) n -= 1;
    if (flap > 0 && i === 8) n += 1;
    rcrSpan(G, oy + i, cx, n, 'c');
  }
  rcrMirror(G, 6, oy - 1, 'c', cx); rcrMirror(G, 7, oy - 1, '.', cx);
  const ph = run ? f * Math.PI / 2 : 0;
  for (let y = oy + 16; y < GH; y++) { const t = (y - oy - 16) / 8, dx = air ? 0 : Math.round(Math.sin(ph - t * 2.5) * 1.8 * t); rcrPut(G, 9 + dx, y, 'd'); }
  rcrShade(G, 'c', 'l', 'd', 2, 2);
  if (L.crystal) { // faceted crystal wings with sparkles
    for (let i = 0; i < 6; i++) { rcrMirror(G, 7 - i, oy + 3 + i, 'a', cx); }
    for (const [x, y] of [[2, 7], [6, 11], [4, 5], [7, 3]]) rcrMirror(G, x, oy + y, 'w', cx);
  } else if (L.stripes) { // tiger stripes + glowing tips
    for (const [x, y] of [[6, 4], [5, 5], [4, 6], [3, 7], [7, 7], [6, 8], [5, 9], [7, 10]]) if (rcrGet(G, x, oy + y) !== '.') rcrMirror(G, x, oy + y, 'd', cx);
    for (const [x, y] of [[0, 7], [1, 7], [0, 6], [1, 6]]) if (rcrGet(G, x, oy + y) !== '.') rcrMirror(G, x, oy + y, 'a', cx);
  } else if (L.glowEdge) { // glowing leading edges
    for (let y = oy; y < oy + 9; y++) { let x = 0; while (x < 10 && rcrGet(G, x, y) === '.') x++; if (x < 10) rcrMirror(G, x, y, 'a', cx); }
    for (const [x, y] of [[4, 7], [6, 9]]) rcrMirror(G, x, oy + y, 'a', cx);
  } else for (const [x, y] of [[3, 7], [5, 6], [6, 9]]) rcrMirror(G, x, oy + y, 'a', cx);
  const c = makeSprite(rcrRows(G), rcrPal(L), C.ink);
  return rcrSeat(c, L, f, 11, oy + 2);
}

// half templates (left 9 columns), mirrored into 18-wide rows
const RCR_BIRD_L = [
  '........n', '.......nn', '......ccc', '......cxc', '......ccc', '.......cc', '........c', '........c',
  '......ccc', '....ccccc', '...lccccc', '..lcdcccc', '.lccdcccc', 'ldd.ccccc', 'd.d.ccccc', '....ccccc',
  '.....cccc', '......ccc', '......aaa', '.....aaaa', '.....a.aa'];
const RCR_BIRD_WUP = ['..llccccc', 'lccdccccc', 'ldd.ccccc', 'd.d.ccccc', '....ccccc']; // rows 10-14, wings raised
function rcrMirrorRows(half) { return half.map(h => h + h.split('').reverse().join('')); }
function rcrBird(L, f) {
  const cx = 8.5, run = f < 4, air = f === 4;
  const half = RCR_BIRD_L.slice();
  const up = air || (run && (f === 1 || f === 3));
  if (up) for (let i = 0; i < 5; i++) half[10 + i] = RCR_BIRD_WUP[i];
  const nb = run ? [0, 1, 0, 1][f] : 0; // head bob: the neck shortens on the push-off frames
  if (nb) { half.splice(6, 1); half.unshift('.........'); }
  const G = rcrTpl(rcrMirrorRows(half));
  while (G.length < 26) G.push(new Array(18).fill('.'));
  const tb = run ? [0, 1, 0, -1][f] : 0;
  if (L.fancyTail) { // peacock fan with eye spots
    const ty = nb ? 19 : 18;
    const fan = rcrMirrorRows(['......aaa', '....aaaaa', '..aaabaaa', '..ab.aaba', '...a..a.a'].map(r => r));
    for (let i = 0; i < fan.length; i++) for (let x = 0; x < 18; x++) { const ch = fan[i][x]; rcrPut(G, x, ty + i, ch === '.' ? (i < 2 ? rcrGet(G, x, ty + i) : '.') : ch); }
  } else if (tb) { rcrPut(G, 8 + tb, 21, 'a'); rcrPut(G, 9 - tb, 21, '.'); }
  const c = makeSprite(rcrRows(G), rcrPal(L), C.ink);
  // long stepping legs after the outline: the foot pokes out ahead of / behind the body
  const leg = L.leg || C.gold;
  const reach = air ? [0, 0] : run ? [[1, -1], [0, 0], [-1, 1], [0, 0]][f] : [0, 0];
  for (const side of [0, 1]) {
    const X = x => side ? 19 - x : x, r = reach[side];
    if (r > 0) { for (let y = 6; y <= 9; y++) rcrPx(c, X(6), y, leg); rcrPx(c, X(5), 5, C.ink); rcrPx(c, X(6), 5, C.ink); rcrPx(c, X(7), 5, C.ink); }
    else if (r < 0) { for (let y = 21; y <= 23; y++) rcrPx(c, X(6), y, leg); rcrPx(c, X(5), 24, C.ink); rcrPx(c, X(7), 24, C.ink); }
  }
  return rcrSeat(c, L, f, 10, 9);
}

const RCR_BEAST_L = [
  '.........x', '........bb', '....c...bb', '....cc.ccc', '.....acccc', '.....ccgcc', '......cccc', '....b.bbbb',
  '...bbbbbbb', '....bbbbbb', '...ccccccc', '....cccccc', '...ccccccc', '....cccccc', '...ccccccc', '....cccccc',
  '...ccccccc', '....cccccc', '.....ccccc', '......cccc'];
// paws (left side) per frame for front / middle / hind legs: [x, y]; drawn as 2x2 pads peeking from under the fur
const RCR_BEAST_PAWS = [
  [[2, 7], [2, 15], [3, 20]],    // stretched
  [[2, 9], [2, 13], [2, 18]],
  [[1, 11], [2, 11], [2, 16]],   // gathered
  [[2, 9], [2, 13], [2, 18]],
  [[3, 11], [3, 14], [3, 17]],   // airborne: tucked
  [[2, 10], [2, 13], [2, 17]]    // stand
];
function rcrBeast(L, f) {
  const cx = 9.5, run = f < 4, air = f === 4;
  const G = rcrTpl(rcrMirrorRows(RCR_BEAST_L));
  while (G.length < 28) G.push(new Array(20).fill('.'));
  // paws first so the fur covers their inner half
  for (const [px, py] of RCR_BEAST_PAWS[f]) for (const side of [0, 1]) {
    const X = x => side ? 2 * cx - x : x;
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) if (rcrGet(G, X(px + dx), py + dy) === '.') rcrPut(G, X(px + dx), py + dy, dx ? 'm' : 'k');
  }
  // bushy tail
  const ph = run ? f * Math.PI / 2 : 0;
  for (let y = 20; y < 28; y++) {
    const t = (y - 19) / 8, dx = air ? 0 : Math.round(Math.sin(ph - t * 2) * 2.2 * t);
    rcrSpan(G, y, cx, y < 22 ? 1 : y < 26 ? (y % 2 ? 2 : 3) : 1, y >= 25 ? 'b' : 'c', dx);
  }
  rcrShade(G, 'c', 'l', 'd', 1, 1);
  rcrShade(G, 'b', 'b', 'c', 0, 1);
  for (const y of [16, 18]) { rcrPut(G, 8, y, 'd'); rcrPut(G, 11, y, 'd'); rcrPut(G, 9, y + 1, 'd'); rcrPut(G, 10, y + 1, 'd'); }
  if (L.spikes) for (const [x, y] of [[2, 10], [2, 14], [3, 8], [4, 18], [2, 12]]) rcrMirror(G, x, y, x === 2 && y === 12 ? 'a' : 'w', cx);
  if (L.big) { // horns instead of ears
    for (const [x, y] of [[4, 1], [4, 2], [5, 2], [5, 3], [6, 3]]) rcrMirror(G, x, y, '.', cx);
    for (const [x, y] of [[5, 4], [4, 4], [3, 3], [3, 2], [3, 1], [4, 0]]) rcrMirror(G, x, y, 'h', cx);
  }
  const c = makeSprite(rcrRows(G), rcrPal(L), C.ink);
  return rcrSeat(c, L, f, 11, 9);
}

const RCR_BODY = { lizard: rcrLizard, beetle: rcrBeetle, ray: rcrRay, bird: rcrBird, beast: rcrBeast };
const MOUNT_CACHE = {};
function getMount(lookOrKey) {
  if (typeof lookOrKey === 'string' && IMPORTED_ART.mounts[lookOrKey]) return IMPORTED_ART.mounts[lookOrKey];
  const key = typeof lookOrKey === 'string' ? lookOrKey : JSON.stringify(lookOrKey);
  if (MOUNT_CACHE[key]) return MOUNT_CACHE[key];
  const L = typeof lookOrKey === 'string' ? (ALIEN_LOOKS[lookOrKey] || ALIEN_LOOKS.r1) : lookOrKey;
  const mk = RCR_BODY[L.mount] || rcrLizard;
  const set = { frames: [0, 1, 2, 3].map(f => mk(L, f)), jump: mk(L, 4), stand: mk(L, 5), white: null };
  set.white = tintSprite(set.frames[0], C.white);
  MOUNT_CACHE[key] = set;
  return set;
}

// ---------- props & foes ----------
function rcrSpr(rows, pal, outline) { return makeSprite(rows, pal, outline === undefined ? C.ink : outline); }

function rcrBuildProjectiles() {
  // light arrow (no outline, glows over the dirt)
  PROJ.arrow = rcrSpr(['.w.', 'wcw', '.w.', '.c.', '.c.', '.s.', 's.s'], { w: C.white, c: C.cyan, s: C.sky }, null);
  // rail bolt
  PROJ.bolt = rcrSpr(['.w.', 'wcw', 'cwc', '.c.', '.s.', '.b.', 'sbs'], { w: C.white, c: C.cyan, s: C.sky, b: C.blue });
  // shock pellet
  PROJ.pebble = rcrSpr(['.y.', 'ywg', '.g.'], { y: C.yellow, w: C.white, g: C.green });
  // plasma ball
  PROJ.ball = rcrSpr(['.pppp.', 'pmmsmp', 'pmswsp', 'pmmssp', 'ppmmmp', '.pppp.'], { p: C.purple, m: C.magenta, s: C.salmon, w: C.white });
  // enemy laser bolt, pointing down
  PROJ.earrow = rcrSpr(['.r.', '.r.', 'rhr', '.h.', '.s.', 'sws', '.w.'], { r: C.wine, h: C.red, s: C.salmon, w: C.white });
}

function rcrBuildIcons() {
  // KRİSTAL: the meta currency gem (was the clover)
  ICONS.clover = rcrSpr(['..wws..', '.wwcss.', 'wwccssb', 'cccssbb', '.ccsbb.', '..csb..', '...b...'], { w: C.white, c: C.cyan, s: C.sky, b: C.blue });
  OB.clover = ICONS.clover;
  // IŞIK YAYI: glowing light bow with a nocked light arrow
  ICONS.w_yay = offscreen(11, 11, c => {
    for (let a = 0; a <= 16; a++) { const t = Math.PI + a / 16 * Math.PI / 2; pix(Math.round(9 + 7.5 * Math.cos(t)), Math.round(9 + 7.5 * Math.sin(t)), a % 8 === 0 ? C.white : C.lgray); }
    for (let i = 0; i <= 7; i++) pix(2 + i, 9 - i, C.cyan);
    for (let i = 0; i <= 5; i++) pix(3 + i, 3 + i, C.white);
    pix(2, 2, C.cyan); pix(3, 2, C.white); pix(2, 3, C.white); pix(8, 9, C.sky); pix(9, 8, C.sky); pix(9, 9, C.cyan);
    addOutline(c, C.ink);
  });
  // ŞOK SAPANI: fork + crackling band + glowing pellet
  ICONS.w_sapan = rcrSpr(['g.....g', 'gy.y.yg', '.gwyw g'.replace(' ', '.'), '..ggg..', '...d...', '...d...', '..ddd..'], { g: C.lgray, y: C.yellow, w: C.white, d: C.slate });
  // RAY ARBALETİ: crossbow with glowing rails and a bolt
  ICONS.w_tatar = rcrSpr(['...w...', 'gggcggg', 'g.scs.g', '...c...', '..sbs..', '...b...', '..ddd..'], { w: C.white, c: C.cyan, s: C.sky, b: C.blue, g: C.lgray, d: C.slate });
  // PLAZMA TOPU: blaster cannon with a plasma orb at the muzzle
  ICONS.w_top = rcrSpr(['..mwm...', '.msmm...', '..mm....', '.gggg...', 'gllggg..', 'gggggddd', '.dd..d..', '.d...d..'].map(r => r), { m: C.magenta, w: C.white, s: C.salmon, g: C.gray, l: C.lgray, d: C.slate });
}

function rcrBuildFoes() {
  // GÖZCÜ: flying eyeball with bat wings (2 flap frames)
  const eyeball = (c, up) => {
    const cx = 6, cy = up ? 4 : 4;
    // wings
    const wing = up ? [[0, 0], [1, 1], [2, 1], [1, 2], [2, 2], [3, 2], [2, 3], [3, 3], [3, 4]] : [[0, 5], [1, 4], [2, 3], [1, 5], [2, 4], [3, 3], [2, 5], [3, 4], [3, 5]];
    for (const [x, y] of wing) { pix(x, y, C.purple); pix(12 - x, y, C.purple); }
    for (const [x, y] of up ? [[1, 1], [2, 2], [3, 3]] : [[1, 4], [2, 4], [3, 4]]) { pix(x, y, C.magenta); pix(12 - x, y, C.magenta); }
    circle(cx, cy, 3, C.white); pix(cx - 2, cy - 2, C.white);
    pix(cx + 2, cy + 2, C.lgray); pix(cx + 1, cy + 3, C.lgray); pix(cx + 3, cy + 1, C.lgray);
    rect(cx - 1, cy - 1, 3, 3, C.red); pix(cx, cy, C.ink); pix(cx - 1, cy - 1, C.salmon);
    addOutline(c, C.ink);
  };
  FOE_SPR.karga = [offscreen(13, 9, c => { g.translate(0, 1); eyeball(c, true); g.setTransform(1, 0, 0, 1, 0, 0); }), offscreen(13, 9, c => { g.translate(0, 1); eyeball(c, false); g.setTransform(1, 0, 0, 1, 0, 0); })];
  // TOSBİK: horned beetle charging down the screen (horn at the bottom)
  const tos = f => rcrSpr([
    '...ddddd...', '..dccxccd..', '.dlccxcccd.', '.dlccxcccd.', '.dcccxcccd.', '.dccoxoccd.', '..dccxccd..', '...bbbbb...',
    '..bbebebb..', '...bbbbb...', '....hhh....', '....hwh....', '.....h.....', '.....h.....'
  ].map((r, y) => {
    let s = r.split('');
    const L1 = f ? [2, 6, 9] : [3, 5, 8];
    if (L1.indexOf(y) >= 0) { s[0] = 'k'; s[10] = 'k'; }
    return s.join('');
  }), { d: C.wine, c: C.red, l: C.salmon, x: C.plum, o: C.orange, b: C.dbrown, e: C.yellow, h: C.sand, w: C.white, k: C.ink });
  FOE_SPR.domuz = [tos(0), tos(1)];
  // KALKAN ROBOTU: boxy robot facing down behind a glowing energy shield / shield down, dazed
  FOE_SPR.kalkanli = [
    offscreen(15, 14, c => {
      rect(3, 1, 9, 6, C.gray); rect(3, 1, 9, 1, C.lgray); rect(4, 2, 7, 3, C.dgray); rect(5, 3, 5, 1, C.red); pix(7, 3, C.yellow);
      vline(7, 0, 1, C.slate);
      rect(1, 4, 2, 3, C.slate); rect(12, 4, 2, 3, C.slate);
      // energy shield
      rect(1, 7, 13, 5, C.sky); rect(0, 8, 15, 3, C.sky); rect(2, 8, 11, 3, C.cyan); hline(2, 7, 11, C.cyan);
      hline(3, 9, 9, C.white); pix(2, 8, C.white); pix(12, 10, C.white);
      for (const x of [4, 7, 10]) pix(x, 11, C.cyan);
      addOutline(c, C.ink);
    }),
    offscreen(15, 14, c => {
      rect(3, 0, 9, 6, C.gray); rect(3, 0, 9, 1, C.lgray); rect(4, 1, 7, 3, C.dgray);
      pix(5, 2, C.yellow); pix(6, 3, C.yellow); pix(6, 1, C.yellow); pix(5, 3, C.yellow); pix(7, 1, C.yellow);
      pix(8, 2, C.yellow); pix(9, 3, C.yellow); pix(9, 1, C.yellow); pix(8, 3, C.yellow); pix(10, 1, C.yellow);
      rect(4, 6, 7, 4, C.dgray); rect(5, 7, 5, 2, C.slate); pix(7, 7, C.red);
      rect(2, 6, 2, 3, C.slate); rect(11, 6, 2, 3, C.slate);
      rect(5, 10, 2, 3, C.slate); rect(8, 10, 2, 3, C.slate);
      // shield emitter flickering out
      for (const [x, y] of [[1, 10], [3, 12], [11, 12], [13, 10], [0, 9], [14, 11]]) pix(x, y, C.sky);
      addOutline(c, C.ink);
    })
  ];
  // KARGO KAPSÜLÜ: round metal cargo pod (exactly 12x12): shaded sphere, hazard band, gold credit mark
  FOE_SPR.fici = offscreen(12, 12, () => {
    const inside = (x, y) => x >= 0 && y >= 0 && x < 12 && y < 12 && (x - 5.5) * (x - 5.5) + (y - 5.5) * (y - 5.5) <= 34;
    for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) {
      if (!inside(x, y)) continue;
      const edge = !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1);
      const s = (x - 5.5) + (y - 5.5);
      let col = edge ? C.ink : s < -4.5 ? C.lgray : (s > 3.5 || y >= 10) ? C.dgray : C.gray;
      if (!edge && (y === 7 || y === 8)) col = ((x + y) % 4 < 2) ? C.yellow : C.ink;
      pix(x, y, col);
    }
    pix(3, 3, C.white); pix(2, 4, C.lgray);
    // gold credit coin on the lid
    rect(5, 2, 2, 4, C.gold); rect(4, 3, 4, 2, C.gold); pix(5, 3, C.yellow); pix(5, 2, C.yellow); pix(7, 4, C.orange0); pix(6, 5, C.orange0); vline(6, 3, 2, C.orange);
    hline(2, 9, 8, C.slate);
  });
}

function rcrBuildObstacles() {
  // meteor rock with glowing cracks
  OB.rock = rcrSpr([
    '....bbbbb....', '..bbbwwbbbb..', '.bbwwbbbobbb.', '.bwbbboybbbs.', 'bbbbbobbbobbs', 'bbobbbbbboyss', 'bbyobbbbbbsss', '.sbbbbbbbsss.', '..sssssssss..'
  ], { b: C.slate, w: C.dgray, s: C.plum, o: C.orange, y: C.yellow });
  // cyan crystal cluster
  OB.rock2 = rcrSpr([
    '.....w.....', '..c..wc....', '.wcs.wcs.c.', '.wcs.wcs.cs', 'wwcsswccswc', '.bbbbbbbbb.', '..bbbbbbb..'
  ], { w: C.white, c: C.cyan, s: C.sky, b: C.blue });
  // rock under glowing mushrooms (mushroom moon)
  OB.mossrock = rcrSpr([
    '..gg...mm....', '.ggGg.mMm.cc.', '..s..bbsbbCcc', '.bbsbwbsbbbs.', 'bbbwwbbbbbbbs', 'bbbwbbbbbbbbs', 'bbbbbbbbbbbss', '.sbbbbbbbbss.', '..ssssssssss.'
  ], { b: C.dgray, w: C.gray, s: C.slate, g: C.green, G: C.yellow, m: C.magenta, M: C.salmon, c: C.cyan, C: C.white });
  // spiky scrap drum rolling toward the player (spikes and the hazard band roll down)
  const drum = f => rcrSpr([0, 1, 2, 3, 4, 5, 6, 7].map(y => {
    let r = '';
    for (let x = 0; x < 14; x++) {
      if (y === 0 || y === 7) { r += ((x + (y ? 2 : 0) + f * 2) % 4 === 1 && x > 1 && x < 12) ? 's' : '.'; continue; }
      if (x < 2 || x > 11) { r += (y === 1 || y === 6) ? 'd' : (x === 0 || x === 13) ? 'd' : 'g'; continue; }
      const band = (y + f) % 6;
      if (y === 1 || y === 6) r += 'd';
      else if (band === 2 || band === 3) r += ((x + y + f) % 4 < 2) ? 'y' : 'k';
      else r += y < 4 ? 'l' : 'g';
    }
    return r;
  }), { d: C.dgray, g: C.gray, l: C.lgray, y: C.yellow, k: C.ink, s: C.white });
  OB.bale = [drum(0), drum(1)];
  // alien hound running right (the game flips it): lean six-legged runner, glowing eye, spines
  OB.wolf = [0, 1].map(f => rcrSpr(f === 0 ? [
    '......a.a..', 't..s.s.bbb.', 'tbbbbbbbbex', '.dbbbbbbbbw', '.d.d.d.d...'
  ] : [
    '.......a.a.', '...s.s.bbb.', 'tbbbbbbbbex', 'tdbbbbbbbbw', '..d.d.d..d.'
  ], { b: C.purple, d: C.plum, a: C.magenta, s: C.magenta, t: C.salmon, e: C.cyan, x: C.white, w: C.white }));
  // region decoration: glowing alien flora
  OB.flowers = [
    rcrSpr(['.c.', 'cwc', '.c.'], { c: C.cyan, w: C.white }, null),
    rcrSpr(['y.y', '.w.', 'y.y'], { y: C.yellow, w: C.white }, null),
    rcrSpr(['.s.', 'sys', '.s.'], { s: C.salmon, y: C.yellow }, null),
    rcrSpr(['g.g', '.c.', '.g.'], { g: C.green, c: C.cyan }, null)
  ];
  OB.tuft = rcrSpr(['m.s', 'mmm'], { m: C.magenta, s: C.salmon }, null);
  OB.tuftD = rcrSpr(['d.c', 'ddd'], { d: C.dgreen, c: C.cyan }, null);
  OB.bush = rcrSpr(['.c.c.c.', '.mcmcm.', 'mmmmmmp', 'mmmmmpp', '.mmppp.'], { m: C.magenta, p: C.purple, c: C.cyan });
  // giant glowing mushroom
  OB.tree = rcrSpr([
    '.....ccccc.....', '...ccwccccss...', '..cwwcccyccss..', '.ccwcccccccsss.', '.ccccyccccccss.', 'cccccccccyccsss', 'ccyccccccccssss', '.sssssssssssss.',
    '..bbb.lll.bbb..', '......lll......', '......lll......', '.....llll......', '.....llll......', '....lllll......'
  ].map(r => r.padEnd(15, '.')), { c: C.cyan, w: C.white, s: C.sky, y: C.yellow, b: C.blue, l: C.lgray });
  // cluster of tall mushrooms
  OB.pine = rcrSpr([
    '.....mmm.....', '....mwmms....', '....mmmss....', '.cc...l...gg.', 'cwcs..l..gGgd', 'ccss..l..ggdd', '.ss...l...dd.', '..l...l...l..', '..l...l...l..', '..l..ll...l..', '.ll..ll..ll..', '.ll.lll..ll..'
  ], { m: C.magenta, w: C.white, s: C.purple, c: C.cyan, g: C.green, G: C.yellow, d: C.dgreen, l: C.lgray });
  OB.mushroom = rcrSpr(['.ccc.', 'cwccs', '..l..'], { c: C.cyan, w: C.white, s: C.sky, l: C.lgray }, null);
}

// track-wide obstacles that scale with the lane width (replace the farm builders)
function rcrInstallBuilders() {
  hurdleSprite = function (w) {
    const k = 'rh' + w; if (OB_CACHE[k]) return OB_CACHE[k];
    return (OB_CACHE[k] = offscreen(w, 9, () => {
      rect(0, 8, w, 1, 'rgba(24,20,37,0.45)');
      // glowing beams
      alpha(0.45, () => { rect(2, 1, w - 4, 3, C.red); rect(2, 4, w - 4, 3, C.red); });
      hline(2, 2, w - 4, C.red); hline(2, 5, w - 4, C.red);
      for (let x = 2; x < w - 2; x++) { if ((x + 1) % 4 === 0) pix(x, 2, C.salmon); if ((x + 3) % 4 === 0) pix(x, 5, C.salmon); }
      // posts with emitters
      for (const px of [0, w - 2]) { rect(px, 0, 2, 8, C.ink); rect(px, 0, 2, 7, C.gray); vline(px, 0, 7, C.lgray); pix(px + (px ? 0 : 1), 2, C.hot); pix(px + (px ? 0 : 1), 5, C.hot); rect(px, 0, 2, 1, C.dgray); }
    }));
  };
  logSprite = function (w) {
    const k = 'rl' + w; if (OB_CACHE[k]) return OB_CACHE[k];
    return (OB_CACHE[k] = offscreen(w, 10, () => {
      rect(1, 9, w - 2, 1, 'rgba(24,20,37,0.45)');
      rect(0, 1, w, 7, C.ink); rect(1, 0, w - 2, 9, C.ink);
      rect(1, 1, w - 2, 7, C.gray); rect(1, 1, w - 2, 1, C.white); rect(1, 2, w - 2, 1, C.lgray); rect(1, 6, w - 2, 2, C.dgray);
      // seams + rivets
      for (let x = 8; x < w - 8; x += 7) { vline(x, 1, 7, C.dgray); pix(x + 1, 3, C.lgray); pix(x - 1, 3, C.dgray); pix(x + 1, 5, C.slate); }
      // hazard-striped end caps
      for (const ex of [1, w - 5]) {
        for (let y = 1; y < 8; y++) for (let x = 0; x < 4; x++) pix(ex + x, y, ((x + y) % 4 < 2) ? C.yellow : C.ink);
        vline(ex + (ex === 1 ? 4 : -1), 1, 7, C.ink);
      }
    }));
  };
  puddleSprite = function (w, mud) {
    const k = 'rp' + w + (mud ? 'm' : ''); if (OB_CACHE[k]) return OB_CACHE[k];
    const h = 10;
    return (OB_CACHE[k] = offscreen(w, h, () => {
      const cx = w / 2 - 0.5, cy = h / 2 - 0.5, rx = Math.floor(w / 2) - 1;
      if (mud) { // dark purple tar
        ellipse(cx, cy, rx, 4, C.ink); ellipse(cx, cy, rx - 1, 3, C.plum); ellipse(cx + 1, cy + 1, rx - 4, 2, C.purple);
        hline(Math.round(cx - w / 4), Math.round(cy - 1), 3, C.magenta); pix(Math.round(cx + w / 6), Math.round(cy + 1), C.salmon); pix(Math.round(cx + w / 6) + 1, Math.round(cy + 1), C.magenta);
      } else { // glowing cyan goo
        ellipse(cx, cy, rx, 4, C.teal); ellipse(cx, cy, rx - 1, 3, C.sky); ellipse(cx + 1, cy + 1, rx - 4, 2, C.cyan);
        hline(Math.round(cx - w / 4), Math.round(cy - 1), 3, C.white); pix(Math.round(cx + w / 6), Math.round(cy + 1), C.white); ring(Math.round(cx + w / 5), Math.round(cy - 1), 1, C.cyan);
      }
    }));
  };
}

function buildRacerArt() {
  // mecha horse for VOLTRAK (uses the regular horse builder)
  COATS.robot = { n: C.slate, c: C.gray, l: C.lgray, d: C.dgray, m: C.cyan, w: C.cyan };
  SILKS.voltrak = { s: C.red, h: C.ink };
  FOE_SPR.eskiya = getMount('korsan'); FOE_SPR.okcu = getMount('nisanci'); FOE_SPR.reis = getMount('kaptan');
  rcrBuildProjectiles(); rcrBuildIcons(); rcrBuildFoes(); rcrBuildObstacles(); rcrInstallBuilders();

}
