// ================= RIVAL ART · DÜELLO =================
// Portraits for the six named alien rivals (dialog + logbook files) and the duel door icon.
// buildArt() calls buildRivalArt() after the racer pack; everything lives inside the function.
function buildRivalArt() {
  const K = C.ink;
  const grid = (x, y, rows, pal) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) pix(x + i, y + j, c); } });
  const line = (x0, y0, x1, y1, c) => {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let e = dx + dy;
    for (let n = 0; n < 256; n++) {
      pix(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * e;
      if (e2 >= dy) { e += dy; x0 += sx; }
      if (e2 <= dx) { e += dx; y0 += sy; }
    }
  };
  // shapes: { b:[x0,y0,x1,y1], t(x,y) } tested at pixel centres
  const RR = (x0, y0, w, h, rt, rb) => {
    if (rb === undefined) rb = rt;
    return {
      b: [x0, y0, x0 + w - 1, y0 + h - 1], t: (x, y) => {
        if (x < x0 || y < y0 || x >= x0 + w || y >= y0 + h) return false;
        const px = x + 0.5, py = y + 0.5;
        const top = py < y0 + rt, r = top ? rt : py > y0 + h - rb ? rb : 0;
        if (!r) return true;
        const cy = top ? y0 + rt : y0 + h - rb;
        const cx = px < x0 + r ? x0 + r : px > x0 + w - r ? x0 + w - r : px;
        return (px - cx) * (px - cx) + (py - cy) * (py - cy) <= r * r + r * 0.5;
      }
    };
  };
  const EL = (cx, cy, rx, ry) => ({
    b: [Math.floor(cx - rx) - 1, Math.floor(cy - ry) - 1, Math.ceil(cx + rx), Math.ceil(cy + ry)],
    t: (x, y) => { const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; return dx * dx + dy * dy <= 1; }
  });
  const TRI = (ax, ay, bx, by, cx, cy) => {
    const s = (px, py, qx, qy, rx, ry) => (px - rx) * (qy - ry) - (qx - rx) * (py - ry);
    return {
      b: [Math.floor(Math.min(ax, bx, cx)), Math.floor(Math.min(ay, by, cy)), Math.ceil(Math.max(ax, bx, cx)), Math.ceil(Math.max(ay, by, cy))],
      t: (x, y) => {
        const px = x + 0.5, py = y + 0.5;
        const d1 = s(px, py, ax, ay, bx, by), d2 = s(px, py, bx, by, cx, cy), d3 = s(px, py, cx, cy, ax, ay);
        return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
      }
    };
  };
  const AND = (S, f) => ({ b: S.b, t: (x, y) => S.t(x, y) && f(x, y) });
  const inner = (S, x, y) => S.t(x, y) && S.t(x - 1, y) && S.t(x + 1, y) && S.t(x, y - 1) && S.t(x, y + 1);
  const fill = (S, col, edge) => {
    const f = typeof col === 'function' ? col : () => col;
    for (let y = S.b[1]; y <= S.b[3]; y++) for (let x = S.b[0]; x <= S.b[2]; x++) {
      if (!S.t(x, y)) continue;
      const c = (edge && !inner(S, x, y)) ? edge : f(x, y);
      if (c) pix(x, y, c);
    }
  };

  // ---------------- duel door / tip icon: two crossed lances ----------------
  ICONS.duel = makeSprite([
    'W.......W',
    '.C.....S.',
    '..C...S..',
    '...CYS...',
    '....Y....',
    '...SYC...',
    '..S...C..',
    '.G.....G.',
    'G.......G'], { W: C.white, C: C.cyan, S: C.salmon, Y: C.yellow, G: C.gold }, K);

  // ---------------- show HUD: Grax's mini head (commentary) and the audience TV (rating) ----------------
  ICONS.grax = makeSprite([
    '...KKK...',
    '..KMYMK..',
    '.KPPPPPK.',
    'KPYKPYKPK',
    'KPPPPPPPK',
    'KPWWWWWPK',
    '.KPWWWPK.',
    '..KKKKK..'], { K, P: C.purple, M: C.magenta, Y: C.yellow, W: C.white }, null);
  ICONS.tv = makeSprite([
    '..K...K..',
    '...K.K...',
    'KKKKKKKKK',
    'KCCCCCWCK',
    'KCSCCCCCK',
    'KCCCCSCCK',
    'KKKKKKKKK'], { K, C: C.cyan, S: C.sky, W: C.white }, null);

  // ---------------- GLORB: jelly-brained scholar under a glass dome ----------------
  PORTRAIT.glorb = offscreen(28, 28, () => {
    fill(RR(3, 22, 22, 7, 5, 0), (x, y) => y === 22 ? C.white : x >= 20 ? C.purple : C.magenta, K);
    for (const x of [8, 19]) pix(x, 25, C.white);
    rect(12, 19, 4, 4, K); rect(13, 19, 2, 4, C.gold);
    fill(EL(14, 16, 7.5, 6), (x, y) => (x + 0.5 - 14) * 0.6 + (y + 0.5 - 16) > 3 ? C.gold : C.yellow, K);
    fill(AND(EL(14, 10, 8.5, 8), (x, y) => y <= 12), C.green, K);
    fill(AND(EL(14, 8, 5.5, 3.6), (x, y) => y <= 11), (x, y) => ((x * 3 + y * 5) % 7 === 0) ? C.salmon : C.yellow);
    for (const [x, y] of [[11, 8], [12, 7], [15, 6], [16, 7], [13, 9], [17, 9], [10, 9]]) pix(x, y, C.gold);
    for (const [x, y] of [[8, 6], [9, 5], [10, 4], [8, 7]]) pix(x, y, C.white);
    hline(6, 12, 17, C.lgray); hline(7, 13, 15, C.gold);
    for (const ex of [11, 17]) { ring(ex, 16, 2, C.lgray); pix(ex, 16, K); pix(ex - 1, 15, C.white); }
    pix(14, 16, C.lgray);
    hline(13, 19, 3, C.dbrown); pix(12, 18, C.dbrown);
  });

  // ---------------- KIZIL VUUM: nine-armed squid hauler, angry brows ----------------
  PORTRAIT.vuum = offscreen(28, 28, () => {
    fill(RR(2, 22, 24, 7, 6, 0), (x, y) => y === 22 ? C.gold : x >= 20 ? C.ink : C.navy, K);
    rect(6, 24, 2, 4, C.gold); rect(20, 24, 2, 4, C.gold);
    fill(EL(14, 10, 8.5, 9.5), (x, y) => { const dx = x + 0.5 - 14, dy = y + 0.5 - 10; return dx + dy * 0.4 > 4.5 ? C.purple : dx + dy < -8 ? C.salmon : C.magenta; }, K);
    for (const [x, y] of [[10, 4], [17, 3], [19, 7], [11, 8], [15, 6]]) pix(x, y, C.salmon);
    for (let i = 0; i < 6; i++) {
      const x0 = 6 + i * 3, len = 8 + (i % 2) * 3;
      let x = x0;
      for (let j = 0; j < len; j++) {
        x = x0 + Math.round(Math.sin(j * 0.7 + i * 1.3));
        const y = 15 + j;
        pix(x - 1, y, K); pix(x, y, C.magenta); pix(x + 1, y, C.purple); if (i === 5) pix(x + 2, y, K);
      }
      pix(x, 15 + len, K); pix(x + 1, 15 + len, K); pix(x + (i % 2 ? 2 : -1), 14 + len, C.salmon);
    }
    for (const ex of [10, 18]) { rect(ex - 2, 12, 5, 4, K); rect(ex - 1, 13, 3, 1, C.yellow); pix(ex, 13, K); pix(ex - 1, 13, C.white); }
    line(7, 10, 11, 11, K); line(21, 10, 17, 11, K);
  });

  // ---------------- GECE KANADI: bat-eared night runner from Noks ----------------
  PORTRAIT.gece = offscreen(28, 28, () => {
    fill(RR(2, 21, 24, 8, 5, 0), (x, y) => y === 21 ? C.gold : x >= 19 ? C.plum : C.wine, K);
    pix(14, 23, C.gold); pix(13, 24, C.gold); pix(15, 24, C.gold); pix(14, 25, C.gold);
    fill(TRI(5, 18, 11, 20, 4, 24), C.wine, K); fill(TRI(23, 18, 17, 20, 24, 24), C.plum, K);
    fill(TRI(2, 0, 12, 10, 6, 14), C.lgray, K); fill(TRI(26, 0, 16, 10, 22, 14), C.gray, K);
    fill(TRI(4, 3, 10, 10, 7, 12), C.salmon); fill(TRI(24, 3, 18, 10, 21, 12), C.magenta);
    fill(EL(14, 15, 7, 6.5), (x, y) => (x + 0.5 - 14) * 0.7 + (y + 0.5 - 15) > 3 ? C.gray : C.lgray, K);
    rect(8, 12, 13, 5, C.slate); rect(9, 11, 11, 1, C.slate);
    for (const ex of [11, 17]) { rect(ex - 2, 13, 4, 3, C.gold); rect(ex - 1, 12, 2, 1, C.gold); vline(ex, 13, 3, K); pix(ex - 1, 13, C.yellow); pix(ex - 2, 13, C.white); }
    pix(13, 17, K); pix(15, 17, K);
    hline(12, 19, 5, K); pix(12, 20, C.white); pix(16, 20, C.white);
  });

  // ---------------- DEMİR KISKAÇ: gold mining robot with a raised claw ----------------
  PORTRAIT.kiskac = offscreen(28, 28, () => {
    fill(RR(2, 22, 22, 7, 4, 0), (x, y) => y === 22 ? (((x >> 1) & 1) ? K : C.yellow) : x >= 18 ? C.navy : C.slate, K);
    rect(9, 19, 2, 4, C.gray); rect(15, 19, 2, 4, C.gray); pix(9, 20, C.lgray); pix(15, 20, C.lgray);
    vline(13, 1, 5, K); pix(12, 1, C.hot); pix(13, 0, C.hot); pix(14, 1, C.hot); pix(13, 1, C.salmon);
    fill(RR(5, 5, 16, 15, 3), (x, y) => y <= 6 ? C.yellow : x >= 18 ? C.orange : C.gold, K);
    for (const [x, y] of [[7, 7], [18, 7], [7, 17], [18, 17]]) pix(x, y, C.orange0);
    rect(7, 10, 12, 4, K); rect(8, 11, 10, 2, C.wine); rect(11, 11, 4, 2, C.hot); pix(12, 11, C.white);
    rect(8, 15, 10, 3, K); for (let x = 9; x < 17; x += 2) pix(x, 16, C.gray);
    // arm + open pincer on the right
    rect(22, 20, 3, 6, K); vline(23, 20, 6, C.gray);
    grid(19, 9, [
      '.KK...KK.',
      'KLLK.KLLK',
      'KLDK.KLDK',
      'KLDK.KLDK',
      '.KLDKLDK.',
      '..KLLLK..',
      '..KLLDK..',
      '...KLK...',
      '...KLK...',
      '...KKK...',
      '...KGK...',
      '...KGK...'], { K, L: C.lgray, D: C.gray, G: C.gray });
  });

  // ---------------- ALEV KUYRUK: proud stalk-eyed rider, fire plume behind ----------------
  PORTRAIT.alev = offscreen(28, 28, () => {
    for (let i = 0; i < 7; i++) {
      const bx = 4 + i * 3.4, h = 15 + ((i * 5) % 4) * 1.5 - Math.abs(i - 3) * 1.6, by = 22, tip = bx + (i % 2 ? 1.5 : -1.5);
      fill(TRI(bx - 3.2, by, bx + 3.2, by, tip, by - h), i % 2 ? C.orange : C.rust);
      fill(TRI(bx - 1.6, by, bx + 1.6, by, tip * 0.7 + bx * 0.3, by - h + 5), C.gold);
      fill(TRI(bx - 0.8, by, bx + 0.8, by, bx, by - h + 9), C.yellow);
    }
    fill(RR(3, 22, 22, 7, 5, 0), (x, y) => y === 22 ? C.white : x >= 20 ? C.blue : C.sky, K);
    fill(RR(8, 19, 12, 4, 2), (x, y) => (x + y) % 3 === 0 ? C.yellow : C.orange, K);
    fill(EL(14, 15, 6.5, 6), (x, y) => (x + 0.5 - 14) * 0.6 + (y + 0.5 - 15) > 3 ? C.plum : C.purple, K);
    for (const [x0, x1] of [[11, 8], [17, 20]]) { line(x0 - 1, 10, x1 - 1, 4, K); line(x0 + 1, 10, x1 + 1, 4, K); line(x0, 10, x1, 4, C.purple); }
    for (const ex of [8, 20]) { fill(EL(ex + 0.5, 3.5, 2.6, 2.6), C.yellow, K); pix(ex + (ex < 14 ? 0 : 1), 3, K); pix(ex, 2, C.white); }
    line(11, 18, 16, 17, K); pix(17, 16, K);
    pix(11, 14, K); pix(17, 14, K);
  });

  // ---------------- GRAX'IN GÖLGESİ: hooded veteran, half the face in shadow ----------------
  PORTRAIT.golge = offscreen(28, 28, () => {
    fill(RR(2, 20, 24, 9, 6, 0), (x, y) => (x >= 11 && x <= 16 && y >= 21) ? (y === 21 ? C.cyan : C.white) : x >= 18 ? C.ink : C.navy, K);
    fill(EL(14, 13, 10, 10.5), (x, y) => x >= 17 ? C.ink : C.navy, K);
    grid(12, 0, ['..K..', '.KCK.', '.KCWK', 'KCCWK', 'KCCWK'], { K, C: C.cyan, W: C.white });
    fill(EL(14, 14, 6, 7), (x, y) => x + 0.5 < 14.5 ? C.blue : C.navy, K);
    rect(10, 13, 3, 1, C.cyan); pix(10, 13, C.white); rect(16, 13, 3, 1, C.cyan);
    line(16, 10, 19, 17, C.gray);
    hline(12, 18, 4, K);
    for (const [x, y] of [[4, 24], [23, 23]]) pix(x, y, C.slate);
  });

  // ---------------- v5 rivals: busts built from the racer look (rider kind + colours) ----------------
  const bust = L => offscreen(28, 28, () => {
    const skin = L.skin || C.green, sd = rcrDk(skin), sl = rcrLt(skin), suit = L.suit || C.navy, trim = L.trim || C.yellow, eye = L.reye || C.yellow;
    const kind = L.rider;
    // back pieces first: hood, ears, fin
    if (kind === 'hood') fill(EL(14, 13, 10, 10.5), (x, y) => x >= 17 ? rcrDk(L.hat || suit) : (L.hat || suit), K);
    if (kind === 'ears') { fill(TRI(3, 1, 12, 9, 7, 14), skin, K); fill(TRI(25, 1, 16, 9, 21, 14), sd, K); fill(TRI(5, 4, 10, 10, 8, 12), C.salmon); fill(TRI(23, 4, 18, 10, 20, 12), C.magenta); }
    if (kind === 'fin') { fill(TRI(10, 8, 18, 8, 14, 0), trim, K); fill(TRI(4, 10, 8, 15, 3, 18), sd, K); fill(TRI(24, 10, 20, 15, 25, 18), sd, K); }
    if (kind === 'squid') for (let i = 0; i < 6; i++) {
      const x0 = 7 + i * 3, len = 6 + (i % 2) * 2;
      for (let j = 0; j < len; j++) { const x = x0 + Math.round(Math.sin(j * 0.8 + i)); pix(x - 1, 17 + j, K); pix(x, 17 + j, skin); pix(x + 1, 17 + j, sd); }
    }
    // shoulders, collar, neck
    fill(RR(3, 21, 22, 8, 5, 0), (x, y) => y === 21 ? trim : x >= 19 ? rcrDk(suit) : suit, K);
    pix(14, 24, trim); pix(13, 25, trim); pix(15, 25, trim);
    if (kind !== 'squid') { rect(11, 18, 6, 4, K); rect(12, 18, 4, 4, sd); }
    // head
    if (kind === 'robo') {
      fill(RR(6, 5, 16, 15, 3), (x, y) => y <= 6 ? sl : x >= 18 ? sd : skin, K);
      rect(8, 10, 12, 4, K); rect(9, 11, 10, 2, rcrDk(eye)); rect(12, 11, 4, 2, eye); pix(13, 11, C.white);
      vline(14, 1, 4, K); pix(14, 0, eye); for (let x = 9; x < 19; x += 3) pix(x, 16, C.gray);
    } else {
      const wide = kind === 'brute', rx = wide ? 9 : 7, ry = kind === 'squid' ? 8 : 6.5, cy = kind === 'squid' ? 11 : 13;
      fill(EL(14, cy, rx, ry), (x, y) => (x + 0.5 - 14) * 0.6 + (y + 0.5 - cy) > 3 ? sd : skin, K);
      for (const [x, y] of [[10, cy - 3], [16, cy - 4], [18, cy - 1]]) pix(x, y, sl);
    }
    // faces
    const eyeAt = (x, y, r) => { if (r) { fill(EL(x + 0.5, y + 0.5, r, r), C.white, K); pix(x, y, eye); pix(x + 1, y, K); } else { rect(x - 1, y - 1, 3, 3, K); pix(x, y, eye); pix(x - 1, y - 1, C.white); } };
    if (kind === 'stalk') {
      for (const [x0, x1] of [[11, 7], [17, 21]]) { line(x0 - 1, 9, x1 - 1, 3, K); line(x0 + 1, 9, x1 + 1, 3, K); line(x0, 9, x1, 3, skin); }
      eyeAt(7, 2, 2.6); eyeAt(20, 2, 2.6);
    } else if (kind === 'tri') { eyeAt(10, 13); eyeAt(14, 10); eyeAt(18, 13); }
    else if (kind === 'mono') { fill(EL(14.5, 12.5, 4, 3.6), C.white, K); fill(EL(14.5, 12.5, 2, 2), eye); pix(14, 12, K); pix(15, 12, K); pix(13, 11, C.white); }
    else if (kind === 'hood') { rect(9, 12, 4, 1, eye); rect(16, 12, 4, 1, eye); pix(9, 12, C.white); }
    else if (kind !== 'robo') { eyeAt(11, 13); eyeAt(17, 13); }
    if (kind === 'dome') {
      fill(AND(EL(14, 9, 8.5, 8), (x, y) => y <= 10), L.glass || C.cyan, K);
      fill(AND(EL(14, 7, 5.5, 3.6), (x, y) => y <= 9), (x, y) => ((x * 3 + y * 5) % 7 === 0) ? C.white : (L.brain || C.salmon));
      hline(6, 10, 17, C.lgray); for (const [x, y] of [[8, 5], [9, 4]]) pix(x, y, C.white);
    }
    if (kind === 'horn' || kind === 'brute') {
      const hc = L.horn || C.sand, s = kind === 'brute' ? 0 : 1;
      fill(TRI(7, 9 - s, 10, 8, 4, 1 + s * 2), hc, K); fill(TRI(21, 9 - s, 18, 8, 24, 1 + s * 2), rcrDk(hc), K);
    }
    if (kind === 'crystal') for (let i = 0; i < 5; i++) {
      const x = 7 + i * 3.5, h = 6 + (i === 2 ? 3 : i % 2 ? 1 : 0);
      fill(TRI(x - 2, 8, x + 2, 8, x, 8 - h), i % 2 ? (L.cape || C.cyan) : trim, K);
    }
    if (kind === 'fin') pix(14, 3, C.white);
    // mouth: brutes bare their teeth, the rest grin or frown
    if (kind === 'brute') { hline(10, 17, 9, K); pix(11, 16, C.white); pix(17, 16, C.white); }
    else if (kind !== 'robo' && kind !== 'squid') { hline(12, 17, 5, K); pix(12, 16, K); pix(16, 16, K); }
  });
  for (const id in RIVAL_BY_ID) if (!PORTRAIT[id]) PORTRAIT[id] = bust(ALIEN_LOOKS[RIVAL_BY_ID[id].look] || ALIEN_LOOKS.r1);
}
