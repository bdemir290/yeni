// ================= STATION ART PACK · ARENA-9 / DÜNYA BÖLMESİ =================
// Sci-fi replacements for the hub (station modules, decor, crew) and the story portraits.
// buildArt() (02_sprites.js) calls buildStationArt() last; it only overwrites entries of
// BLD / PEOPLE / PORTRAIT. Every helper lives inside the function so nothing can collide
// with names from other files of the IIFE.
function buildStationArt() {
  const K = C.ink, SHD = 'rgba(24,20,37,0.4)';

  // ---------------- tiny drawing kit ----------------
  const line = (x0, y0, x1, y1, c) => {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let e = dx + dy;
    for (let n = 0; n < 512; n++) {
      pix(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * e;
      if (e2 >= dy) { e += dy; x0 += sx; }
      if (e2 <= dx) { e += dx; y0 += sy; }
    }
  };
  // paint a char grid (no outline); unknown chars / '.' are skipped
  const grid = (x, y, rows, pal) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) pix(x + i, y + j, c); } });
  // shapes: { b:[x0,y0,x1,y1] bbox, t(x,y): is pixel inside } — pixel centres sit at +0.5
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
  const AND = (S, f) => ({ b: S.b, t: (x, y) => S.t(x, y) && f(x, y) });
  const OR = (A, B) => ({ b: [Math.min(A.b[0], B.b[0]), Math.min(A.b[1], B.b[1]), Math.max(A.b[2], B.b[2]), Math.max(A.b[3], B.b[3])], t: (x, y) => A.t(x, y) || B.t(x, y) });
  const inner = (S, x, y) => S.t(x, y) && S.t(x - 1, y) && S.t(x + 1, y) && S.t(x, y - 1) && S.t(x, y + 1);
  // fill a shape with a colour or fn(x,y) (null = skip); `edge` paints its 1px rim
  const fill = (S, col, edge) => {
    const f = typeof col === 'function' ? col : () => col;
    for (let y = S.b[1]; y <= S.b[3]; y++) {
      let rc = null, rx = 0;
      for (let x = S.b[0]; x <= S.b[2] + 1; x++) {
        let c = null;
        if (x <= S.b[2] && S.t(x, y)) c = (edge && !inner(S, x, y)) ? edge : f(x, y);
        if (c !== rc) { if (rc) rect(rx, y, x - rx, 1, rc); rc = c; rx = x; }
      }
    }
  };
  // paint rows / a column but only on the shape's interior (keeps the ink rim intact)
  const band = (S, y0, y1, col) => { for (let y = y0; y <= y1; y++) for (let x = S.b[0]; x <= S.b[2]; x++) if (inner(S, x, y)) pix(x, y, typeof col === 'function' ? col(x, y) : col); };
  const vband = (S, x, y0, y1, col) => { for (let y = y0; y <= y1; y++) if (inner(S, x, y)) pix(x, y, col); };
  // hull metal ramp; broken modules are darker and lose their whites
  const MET = br => br ? { hi: C.gray, l: C.dgray, m: C.slate, d: C.navy, k: C.navy } : { hi: C.white, l: C.lgray, m: C.gray, d: C.dgray, k: C.slate };
  const shadow = (x, y, w) => rect(x, y, w, 1, SHD);
  const tape = (x, y, w, h) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) pix(x + i, y + j, ((i + j) >> 1) & 1 ? K : C.yellow); };
  const cable = (x, y, n, dir) => { let lx = x; for (let i = 0; i <= n; i++) { lx = x + Math.round(Math.sin(i / n * 1.7) * 3 * dir); pix(lx, y + i, K); } pix(lx, y + n + 1, C.gray); };
  const crack = (pts, col) => { for (let i = 1; i < pts.length; i++) line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], col || K); };
  const glow = (cx, cy, r, col, a) => { const p = g.globalAlpha; g.globalAlpha = p * a; circle(cx, cy, r, col); g.globalAlpha = p; };
  // round porthole: metal frame + lit (or dead) glass
  const porthole = (cx, cy, r, M, lit, gl, gd) => {
    fill(EL(cx + 0.5, cy + 0.5, r + 0.5, r + 0.5), (x, y) => (x - cx) + (y - cy) > 0 ? M.d : M.l, K);
    const G = EL(cx + 0.5, cy + 0.5, r - 0.5, r - 0.5);
    if (lit) { fill(G, (x, y) => (x - cx) + (y - cy) >= r - 2 ? gd : gl, K); pix(cx - 1, cy - 2, C.white); pix(cx - 2, cy - 1, C.white); }
    else { fill(G, C.navy, K); pix(cx - 1, cy - 2, C.slate); }
  };
  // vertical cylinder shading across a span (light from the left)
  const cylCol = (x, x0, w, M) => { const t = (x - x0) / Math.max(1, w - 1); return t < 0.1 ? M.l : t < 0.3 ? M.hi : t < 0.62 ? M.l : t < 0.85 ? M.m : M.d; };

  // =====================================================================
  // BUILDINGS (door = bottom-centre of each canvas)
  // =====================================================================

  // ---- KAMARA (Deniz's capsule habitat) 54x44 · centre column 27 · portholes at (13,22) (41,22) ----
  BLD.ev = offscreen(54, 44, () => {
    const M = MET(false);
    shadow(5, 43, 45);
    for (const lx of [8, 46]) { // landing struts + pads
      rect(lx - 1, 32, 3, 9, K); vline(lx, 32, 8, M.d);
      rect(lx - 3, 40, 7, 3, K); hline(lx - 2, 41, 5, M.l);
    }
    // antenna with red beacon (left)
    rect(10, 3, 3, 9, K); vline(11, 3, 8, M.l);
    rect(9, 0, 5, 4, K); rect(10, 1, 3, 2, C.red); pix(10, 1, C.salmon);
    // dish (right)
    grid(37, 0, [
      '.....KK.',
      '...KKWLK',
      '..KWLLMK',
      '.KWLLMMK',
      'KLLLMMK.',
      'KMMDDK..',
      '.KKKK...',
      '..KLK...',
      '..KLK...',
      '.KKLKK..'], { K, W: M.hi, L: M.l, M: M.m, D: M.d });
    // roof hatch with skylight
    fill(RR(19, 5, 17, 8, 3, 0), (x, y) => y <= 6 ? M.hi : x >= 32 ? M.m : M.l, K);
    rect(22, 7, 11, 3, K); hline(23, 8, 9, C.cyan);
    // hull
    const body = RR(3, 10, 49, 29, 12);
    fill(body, (x, y) => {
      let v = y <= 11 ? 0 : y <= 14 ? 1 : y <= 27 ? 2 : y <= 34 ? 3 : 4;
      if (x <= 6 && v > 0 && v < 4) v--;
      if (x >= 48 && v < 4) v++;
      return [M.hi, M.l, M.m, M.d, M.k][v];
    }, K);
    for (const sx of [19, 35]) { vband(body, sx, 12, 37, M.d); for (const ry of [13, 26]) { pix(sx - 2, ry, M.d); pix(sx + 2, ry, M.d); } }
    band(body, 29, 29, C.white); band(body, 30, 30, C.red); band(body, 31, 31, C.wine);
    for (const x of [9, 14, 40, 45]) pix(x, 34, C.cyan);
    porthole(13, 22, 5, M, true, C.yellow, C.gold);
    porthole(41, 22, 5, M, true, C.yellow, C.gold);
    // door
    fill(RR(22, 24, 11, 16, 4, 0), (x, y) => x <= 23 ? M.hi : x >= 31 ? M.m : M.l, K);
    fill(RR(24, 26, 7, 14, 3, 0), (x, y) => y <= 27 ? C.cyan : x === 27 ? K : x < 27 ? C.slate : C.navy);
    pix(26, 33, C.cyan); pix(28, 33, C.cyan);
    // star badge above the door (Deniz's colours)
    grid(23, 15, ['.KKKKKKK.', 'KRRRWRRRK', 'KRWWWWWRK', 'KRRWWWRRK', 'KRRWRWRRK', '.KKKKKKK.'], { K, R: C.red, W: C.white });
    // ramp
    rect(21, 39, 13, 4, K); hline(22, 40, 11, M.l); hline(22, 41, 11, M.m);
  });

  // ---- AHIR MODÜLÜ (glass stable dome) 56x48 · centre column 27 · lamp at (27,13) ----
  for (const br of [false, true]) {
    BLD['ahir' + (br ? 'X' : '')] = offscreen(56, 48, () => {
      const M = MET(br);
      shadow(3, 47, 50);
      const CX = 27.5, CY = 35, RX = 25, RY = 31;
      const dome = AND(EL(CX, CY, RX, RY), (x, y) => y < 34);
      fill(dome, (x, y) => {
        const dx = x + 0.5 - CX, dy = y + 0.5 - CY, e = (dx / RX) * (dx / RX) + (dy / RY) * (dy / RY);
        if (br) return (e > 0.66 && e < 0.8 && dx < -3 && dy < -9) ? C.slate : C.navy;
        if (e > 0.68 && e < 0.82 && dx < -3 && dy < -9) return C.sky;
        const w = (dx / 19) * (dx / 19) + ((y + 0.5 - 27) / 11) * ((y + 0.5 - 27) / 11);
        if (w < 0.3) return C.gold; if (w < 0.62) return C.orange0; if (w < 1) return C.rust;
        return y < 15 ? C.navy : C.blue;
      }, K);
      // hanging lamp
      if (!br) { vline(27, 4, 8, K); grid(25, 11, ['.KKK.', 'KLLLK', 'KYWYK', '.KYK.'], { K, L: M.l, Y: C.yellow, W: C.white }); }
      else { vline(27, 4, 6, K); grid(25, 9, ['.KKK.', 'KDDDK', 'KKKKK'], { K, D: C.dgray }); }
      // hay bales stacked inside
      const bale = (x, y, w, h) => {
        rect(x, y, w, h, K); rect(x + 1, y + 1, w - 2, h - 2, br ? C.dbrown : C.gold);
        hline(x + 1, y + 1, w - 2, br ? C.brown : C.yellow);
        for (let i = x + 3; i < x + w - 1; i += 3) vline(i, y + 2, h - 3, br ? C.plum : C.orange0);
      };
      bale(4, 26, 12, 7); bale(7, 20, 9, 7); bale(39, 26, 12, 7); bale(41, 21, 8, 6);
      // glass ribs
      const rib = br ? C.slate : C.lgray;
      for (let y = 5; y < 33; y++) {
        const dy = (y + 0.5 - CY) / RY, k = Math.sqrt(Math.max(0, 1 - dy * dy));
        for (const f of [-0.56, 0.56]) { const x = Math.floor(CX + f * RX * k); if (inner(dome, x, y)) pix(x, y, rib); }
      }
      band(dome, 17, 17, rib);
      vband(dome, 27, 5, 10, rib);
      if (!br) { for (let i = 0; i < 4; i++) pix(11 + i, 14 - i, C.white); pix(8, 20, C.white); pix(9, 19, C.white); }
      else {
        crack([[13, 9], [17, 13], [15, 17], [19, 21]], C.gray); crack([[17, 13], [22, 12]], C.gray);
        crack([[38, 8], [36, 13], [40, 17]], C.gray);
        fill(AND(EL(42, 19, 4, 3), (x, y) => dome.t(x, y)), K);
        cable(33, 5, 9, 1);
      }
      // platform ring
      const base = RR(1, 32, 53, 15, 3);
      fill(base, (x, y) => y <= 33 ? M.l : y >= 44 ? M.k : x <= 2 ? M.l : x >= 52 ? M.d : M.m, K);
      for (const sx of [11, 43]) vband(base, sx, 34, 43, M.d);
      for (const x of [5, 15, 39, 49]) { pix(x, 38, br ? C.navy : C.cyan); pix(x + 1, 38, br ? C.navy : C.sky); }
      // entrance module with horseshoe emblem
      fill(RR(19, 25, 17, 22, 3, 0), (x, y) => y <= 26 ? M.hi : x <= 20 ? M.l : x >= 34 ? M.d : M.m, K);
      fill(RR(23, 27, 9, 7, 1), C.navy, K);
      grid(24, 28, ['Y.....O', 'Y.....O', 'YY...OO', '.YY.OO.', '..YOO..'], br ? { Y: C.slate, O: C.slate } : { Y: C.yellow, O: C.gold });
      fill(RR(21, 35, 13, 12, 1, 0), C.navy, K);
      if (!br) {
        rect(22, 37, 4, 9, M.d); rect(29, 37, 4, 9, M.d); vline(22, 37, 9, M.m); vline(29, 37, 9, M.m);
        rect(26, 37, 3, 9, C.yellow); rect(26, 42, 3, 4, C.gold);
        hline(22, 36, 11, C.cyan);
      } else {
        rect(22, 36, 11, 10, M.m); vline(27, 36, 10, K); tape(21, 39, 13, 3);
      }
    });
  }

  // ---- YEM DEPOSU (feed silo + cargo module) 44x50 · door centre ~28 ----
  for (const br of [false, true]) {
    BLD['ambar' + (br ? 'X' : '')] = offscreen(44, 50, () => {
      const M = MET(br);
      shadow(2, 49, 41);
      // feed pipe from the silo into the module roof
      rect(16, 12, 9, 4, K); hline(17, 13, 7, M.l); hline(17, 14, 7, M.m);
      rect(21, 15, 4, 6, K); vline(22, 15, 5, M.l); vline(23, 15, 5, M.m);
      rect(18, 11, 3, 2, K); pix(19, 11, br ? C.slate : C.red);
      // silo
      fill(EL(10, 8, 8, 5.5), (x, y) => y <= 4 ? M.hi : cylCol(x, 2, 16, M), K);
      rect(8, 0, 4, 3, K); hline(9, 1, 2, br ? C.slate : C.green);
      const tank = RR(2, 8, 16, 40, 0);
      fill(tank, (x, y) => cylCol(x, 2, 16, M), K);
      for (const ry of [17, 30, 42]) { band(tank, ry, ry, M.d); band(tank, ry - 1, ry - 1, br ? M.m : M.l); }
      band(tank, 10, 11, br ? C.ddgreen : C.green); band(tank, 12, 12, br ? C.navy : C.dgreen);
      // sight gauge with feed level
      rect(5, 19, 5, 21, K);
      for (let y = 20; y <= 38; y++) { const full = !br && y >= 26; hline(6, y, 3, full ? C.gold : C.navy); if (full) { pix(6, y, C.yellow); pix(8, y, C.orange0); } }
      if (!br) hline(6, 26, 3, C.yellow);
      for (let y = 21; y <= 37; y += 4) pix(11, y, M.d);
      if (br) { fill(EL(13.5, 24.5, 2.5, 2), K); crack([[14, 33], [12, 36], [13, 39]], C.navy); }
      // cargo module (green container)
      const CT = br ? { hi: C.dgreen, t: C.ddgreen, l: C.ddgreen, m: C.teal, d: C.navy } : { hi: C.lgray, t: C.green, l: C.green, m: C.dgreen, d: C.ddgreen };
      fill(RR(17, 20, 27, 6, 0), (x, y) => y === 21 ? CT.hi : CT.t, K);
      const box2 = RR(17, 25, 27, 24, 0);
      fill(box2, (x, y) => (x - 17) % 3 === 1 ? CT.l : (x - 17) % 3 === 2 ? CT.m : CT.d, K);
      for (const [cx, cy] of [[18, 26], [41, 26], [18, 46], [41, 46]]) rect(cx, cy, 2, 2, br ? C.navy : C.dgray);
      // stencilled clover (feed = yonca)
      grid(36, 30, ['WW.LL', 'WWLLL', '.LLL.', 'LLLLL', 'LL.LL'], br ? { W: C.dgreen, L: C.dgreen } : { W: C.white, L: C.lgray });
      // label plate above the door
      rect(24, 26, 9, 3, K); hline(25, 27, 7, br ? C.slate : C.yellow);
      // door: roll-up shutter half open, hay inside
      fill(RR(23, 30, 11, 19, 0), br ? M.m : M.l, K);
      if (!br) {
        for (let y = 31; y <= 37; y++) hline(24, y, 9, y % 2 ? M.l : M.m);
        hline(24, 38, 9, K);
        rect(24, 39, 9, 9, C.plum);
        rect(24, 42, 9, 6, C.gold); hline(24, 42, 9, C.yellow); vline(27, 43, 5, C.orange0); vline(30, 43, 5, C.orange0);
        rect(25, 40, 4, 2, C.orange0);
      } else {
        for (let y = 31; y <= 47; y++) hline(24, y, 9, y % 2 ? M.l : M.m);
        tape(22, 37, 13, 3);
        fill(RR(18, 39, 4, 5, 1), K);
        cable(29, 26, 3, -1);
      }
      hline(17, 48, 27, K);
    });
  }

  // ---- NAL ATÖLYESİ (horseshoe forge) 48x42 · centre column 23 · smoke from (38,1) ----
  for (const br of [false, true]) {
    BLD['nalbant' + (br ? 'X' : '')] = offscreen(48, 42, () => {
      const M = MET(br);
      shadow(3, 41, 42);
      // exhaust stack
      const st = RR(35, 2, 7, 13, 0);
      fill(st, (x, y) => x === 36 ? M.hi : x >= 40 ? M.d : M.l, K);
      band(st, 6, 6, M.d); band(st, 10, 10, M.d);
      fill(RR(34, 0, 9, 3, 0), M.m, K);
      hline(35, 1, 7, M.l); hline(36, 1, 5, br ? K : C.orange); if (!br) pix(38, 1, C.yellow);
      // roof pipe + warning light
      rect(13, 9, 3, 4, K); vline(14, 9, 3, M.l); rect(12, 7, 5, 3, K); hline(13, 8, 3, br ? C.slate : C.orange);
      // hull
      const body = RR(2, 12, 43, 29, 2);
      fill(body, (x, y) => y <= 13 ? M.hi : y <= 15 ? M.l : y === 16 ? K : x >= 42 ? M.d : x <= 3 ? M.l : M.m, K);
      for (const vx of [5, 20, 27]) hline(vx, 14, 4, M.d);
      for (const sx of [10, 34]) vband(body, sx, 17, 36, M.d);
      band(body, 27, 27, M.d);
      for (const [rx, ry] of [[4, 18], [4, 34], [42, 18], [42, 34]]) pix(rx, ry, M.d);
      // vent grille right of the door
      rect(36, 30, 7, 6, K); for (let y = 31; y <= 34; y += 2) hline(37, y, 5, br ? C.slate : C.dgray);
      for (let x = 3; x <= 43; x++) for (let y = 37; y <= 39; y++) if (x < 15 || x > 31) pix(x, y, ((x + y) >> 1) & 1 ? K : (br ? C.dgray : C.yellow));
      // forge door
      fill(RR(15, 21, 17, 20, 6, 0), (x, y) => x <= 16 ? M.hi : x >= 30 ? M.d : M.l, K);
      fill(RR(17, 23, 13, 18, 5, 0), (x, y) => br ? (y < 32 ? C.navy : K) : y <= 25 ? C.rust : y <= 29 ? C.orange : y <= 34 ? C.gold : C.yellow);
      grid(18, 34, ['KKKKKKKK.', '.KKKKKKKK', '...KKK...', '..KKKKK..'], { K: br ? C.slate : K });
      if (!br) { pix(21, 31, C.white); pix(24, 30, C.yellow); pix(19, 32, C.yellow); pix(26, 32, C.white); }
      // neon horseshoe sign
      fill(RR(4, 19, 9, 9, 1), C.navy, K);
      grid(6, 21, ['O...O', 'O...O', 'Y...Y', 'YO.OY', '.YYY.'], br ? { O: C.slate, Y: C.slate } : { O: C.orange, Y: C.yellow });
      // furnace porthole
      porthole(38, 23, 3, M, !br, C.orange, C.rust);
      if (br) { crack([[8, 30], [10, 33], [9, 36]], K); cable(30, 17, 7, 1); }
    });
  }

  // ---- CEPHANELİK (armory + holo target) 48x42 · body centre 21 · target at (42,25) ----
  for (const br of [false, true]) {
    BLD['silahhane' + (br ? 'X' : '')] = offscreen(48, 42, () => {
      const M = MET(br);
      shadow(2, 41, 44);
      // roof sign: crossed arrows in neon
      fill(RR(12, 0, 18, 12, 1), C.navy, K);
      grid(13, 1, [
        'HHH..........HHH',
        'Haa..........bbH',
        'H..aa......bb..H',
        '.....aa..bb.....',
        '.......XX.......',
        '.....bb..aa.....',
        '...bb......aa...',
        'Fbb..........aaF',
        'bF............Fa'], br ? { H: C.slate, a: C.slate, b: C.slate, X: C.slate, F: C.slate } : { H: C.yellow, a: C.orange, b: C.orange, X: C.yellow, F: C.white });
      // armoured hull with chamfered corners
      const body = AND(RR(2, 11, 38, 30, 0), (x, y) => (x - 2) + (y - 11) >= 4 && (39 - x) + (y - 11) >= 4);
      fill(body, (x, y) => {
        if (y <= 13) return y === 12 ? M.l : M.m;
        if (y === 14) return K;
        const px = (x - 3) % 9, py = (y - 17) % 8;
        if (py === 0 || px === 0) return M.m;
        if (py === 7 || px === 8) return M.k;
        return M.d;
      }, K);
      band(body, 15, 15, br ? C.plum : C.red); band(body, 16, 16, br ? C.navy : C.wine);
      // slit windows
      for (const sx of [5, 31]) { rect(sx, 20, 6, 3, K); hline(sx + 1, 21, 4, br ? C.navy : C.hot); }
      // blast door with hazard frame
      fill(RR(13, 24, 16, 17, 0), C.yellow, K);
      if (!br) tape(14, 25, 14, 16); else for (let y = 25; y < 40; y++) hline(14, y, 14, (y >> 1) & 1 ? C.slate : C.navy);
      fill(RR(15, 26, 12, 15, 0), (x, y) => x === 20 || x === 21 ? K : y === 27 ? M.l : M.m);
      if (!br) { rect(19, 22, 4, 2, K); hline(20, 22, 2, C.hot); }
      else tape(13, 31, 16, 3);
      // holo target on a projector stand (right edge)
      rect(41, 31, 3, 8, K); vline(42, 31, 7, M.m);
      fill(RR(38, 37, 9, 4, 1), (x, y) => y === 38 ? M.l : M.d, K);
      if (!br) pix(42, 38, C.cyan);
      circle(42, 25, 5, K); circle(42, 25, 4, M.l); circle(42, 25, 3, C.navy);
      if (!br) {
        ring(42, 25, 3, C.cyan); circle(42, 25, 1, C.hot); pix(42, 25, C.white);
        pix(40, 23, C.white); pix(39, 25, C.sky); pix(45, 25, C.sky);
      } else {
        crack([[40, 23], [42, 25], [41, 27]], C.slate); pix(43, 24, C.dgray);
        crack([[6, 30], [9, 33], [8, 36]], K); cable(33, 14, 8, -1);
      }
    });
  }

  // ---- JOKEY KOĞUŞU (bunk module) 46x42 · centre column 20 · flag pole at x 41 ----
  for (const br of [false, true]) {
    BLD['jokey' + (br ? 'X' : '')] = offscreen(46, 42, () => {
      const M = MET(br);
      shadow(2, 41, 42);
      // free-standing flag pole (the hub draws the flag at x+42, y+1)
      rect(40, 0, 2, 40, K); vline(41, 0, 39, M.l); pix(41, 0, br ? M.m : M.hi);
      rect(39, 22, 2, 2, K); rect(39, 33, 2, 2, K);
      rect(38, 38, 6, 3, K); hline(39, 39, 4, M.m);
      const walls = RR(2, 18, 37, 23, 0);
      const roof = AND(EL(20.5, 19, 18.5, 9.5), (x, y) => y < 19);
      const body = OR(walls, roof);
      fill(body, (x, y) => y < 19 ? M.l : y <= 19 ? M.hi : x <= 3 ? M.hi : x >= 37 ? M.m : M.l, K);
      fill(AND(EL(20.5, 19.5, 16.5, 8), (x, y) => y < 19), (x, y) => {
        if (br) return (y - 11) % 3 === 0 ? C.navy : C.slate;
        return (y - 11) % 3 === 0 ? C.sky : y <= 12 ? C.sky : C.blue;
      });
      hline(3, 19, 35, M.d);
      band(walls, 36, 38, M.m); band(walls, 39, 39, M.d);
      for (const x of [5, 9, 31, 35]) pix(x, 37, br ? C.navy : C.cyan);
      // windows with bunk beds
      for (const wx of [6, 28]) {
        fill(RR(wx, 22, 7, 7, 1), (x, y) => br ? C.navy : y <= 24 ? C.yellow : C.gold, K);
        if (!br) { hline(wx + 1, 25, 5, C.orange0); pix(wx + 1, 24, C.white); pix(wx + 1, 27, C.white); }
        else crack([[wx + 1, 23], [wx + 3, 25], [wx + 2, 27]], C.slate);
      }
      // door + bed sign
      fill(RR(15, 26, 11, 15, 2, 0), (x, y) => x <= 16 ? M.hi : x >= 24 ? M.m : M.l, K);
      fill(RR(17, 28, 7, 13, 1, 0), (x, y) => y <= 28 ? (br ? C.navy : C.cyan) : x === 20 ? K : x < 20 ? C.slate : C.navy);
      fill(RR(15, 20, 11, 6, 1), br ? C.navy : C.blue, K);
      grid(16, 21, ['L........', 'LYWWWWWW.', 'LSSSSSSSL', 'L.......L'], br ? { L: C.slate, Y: C.slate, W: C.slate, S: C.slate } : { L: C.lgray, Y: C.yellow, W: C.white, S: C.sky });
      if (br) {
        fill(AND(EL(28, 13, 4, 2.5), (x, y) => roof.t(x, y)), K);
        tape(14, 31, 13, 3); cable(9, 13, 8, 1);
      }
    });
  }

  // ---- REVİR (med bay) 48x40 · centre column 23 ----
  for (const br of [false, true]) {
    BLD['veteriner' + (br ? 'X' : '')] = offscreen(48, 40, () => {
      const V = br ? MET(true) : { hi: C.white, l: C.white, m: C.lgray, d: C.gray, k: C.dgray };
      shadow(3, 39, 42);
      // red-cross lightbox on the roof
      rect(20, 9, 7, 4, K); rect(21, 9, 5, 3, V.d);
      fill(RR(16, 0, 15, 11, 2), (x, y) => y <= 1 ? V.hi : x >= 29 ? V.m : V.l, K);
      const cr = br ? C.plum : C.red, crd = br ? C.navy : C.wine;
      rect(22, 2, 3, 7, cr); rect(20, 4, 7, 3, cr); vline(24, 3, 6, crd); hline(21, 6, 6, crd); pix(22, 2, br ? C.wine : C.salmon);
      // hull
      const body = RR(3, 12, 41, 28, 5, 0);
      fill(body, (x, y) => y <= 13 ? V.hi : y >= 35 ? V.d : x >= 41 ? V.m : x <= 4 ? V.hi : V.l, K);
      band(body, 30, 30, br ? C.plum : C.red); band(body, 31, 31, br ? C.navy : C.wine);
      band(body, 34, 34, V.m);
      // capsule windows: heart monitor + heart
      for (const wx of [6, 29]) {
        fill(RR(wx, 17, 12, 7, 3.5), (x, y) => br ? C.navy : y <= 18 ? C.cyan : C.sky, K);
        if (!br) { pix(wx + 2, 18, C.white); pix(wx + 3, 18, C.white); }
      }
      if (!br) { grid(8, 19, ['....G....', 'GGG.G.GGG', '...G.G...'], { G: C.green }); grid(33, 19, ['RR.RR', 'RRRRR', '.RRR.'], { R: C.hot }); }
      else { crack([[8, 18], [11, 21], [10, 23]], C.slate); crack([[36, 18], [33, 22]], C.slate); }
      // sliding glass door
      fill(RR(18, 23, 11, 17, 2, 0), (x, y) => x <= 19 ? V.hi : V.m, K);
      fill(RR(20, 25, 7, 15, 1, 0), (x, y) => {
        if (x === 23) return K;
        if (br) return C.navy;
        const lx = x < 23 ? x - 20 : x - 24;
        if (y >= 27 && y <= 31 && lx + (y - 27) === 2) return C.white;
        return y <= 26 ? C.cyan : C.sky;
      });
      if (!br) { hline(21, 24, 5, C.green); }
      else { tape(18, 30, 11, 3); cable(29, 11, 7, 1); crack([[6, 27], [9, 29], [8, 33]], V.k); }
    });
  }

  // ---- GÖZLEMEVİ (observatory) 46x44 · centre column 22 · star orb at (22,20) ----
  for (const br of [false, true]) {
    BLD['tapinak' + (br ? 'X' : '')] = offscreen(46, 44, () => {
      const M = MET(br);
      shadow(3, 43, 40);
      // drum
      const drum = RR(4, 25, 37, 18, 0);
      fill(drum, (x, y) => y >= 40 ? M.k : cylCol(x, 4, 37, M), K);
      band(drum, 27, 27, br ? C.slate : C.magenta); band(drum, 28, 28, br ? C.navy : C.purple);
      for (const x of [8, 12, 33, 37]) pix(x, 34, br ? C.navy : C.magenta);
      // dome
      const dome = AND(EL(22.5, 26, 19.5, 20), (x, y) => y < 26);
      fill(dome, (x, y) => {
        const dx = x + 0.5 - 22.5, dy = y + 0.5 - 26;
        if (dx + dy * 0.8 < -18) return M.hi;
        return dx > 9 ? M.m : M.l;
      }, K);
      for (let y = 8; y < 26; y++) {
        const k = Math.sqrt(Math.max(0, 1 - ((y + 0.5 - 26) / 20) * ((y + 0.5 - 26) / 20)));
        for (const f of [-0.62, 0.62]) { const x = Math.floor(22.5 + f * 19.5 * k); if (inner(dome, x, y)) pix(x, y, M.d); }
      }
      // telescope slit
      fill(RR(20, 6, 5, 11, 1), br ? M.m : C.navy, K);
      if (br) { for (let y = 8; y < 16; y += 2) hline(21, y, 3, M.d); }
      else { pix(21, 9, C.white); pix(23, 11, C.cyan); pix(21, 13, C.white); }
      // telescope tube
      for (let i = 0; i <= 10; i++) rect(23 + i, 12 - i, 3, 3, K);
      for (let i = 0; i <= 10; i++) { pix(24 + i, 13 - i, M.l); if (i < 10) pix(24 + i, 14 - i, M.m); }
      rect(33, 0, 5, 5, K); rect(34, 1, 3, 3, br ? C.slate : C.sky); pix(34, 1, br ? C.dgray : C.white); pix(35, 2, br ? C.navy : C.cyan);
      // round star window + orb
      fill(EL(22.5, 20.5, 6.5, 6.5), (x, y) => (x - 22) + (y - 20) > 0 ? M.d : M.l, K);
      fill(EL(22.5, 20.5, 5, 5), C.navy, K);
      if (!br) {
        circle(22, 20, 3, C.purple); circle(22, 20, 2, C.magenta); rect(21, 19, 2, 1, C.salmon); pix(21, 19, C.white);
        pix(18, 17, C.white); pix(26, 17, C.salmon); pix(26, 23, C.white); pix(18, 23, C.salmon); pix(22, 16, C.white);
      } else {
        circle(22, 20, 3, C.slate); pix(21, 19, C.dgray); crack([[20, 18], [22, 20], [21, 22]], C.navy);
        fill(AND(EL(11, 15, 3, 2.5), (x, y) => dome.t(x, y)), K);
        cable(31, 22, 8, 1);
      }
      // door
      fill(RR(17, 31, 11, 12, 2, 0), (x, y) => x <= 18 ? M.hi : x >= 26 ? M.m : M.l, K);
      fill(RR(19, 33, 7, 10, 1, 0), (x, y) => y <= 33 ? (br ? C.navy : C.magenta) : x === 22 ? K : x < 22 ? C.slate : C.navy);
    });
  }

  // ---- GÖREV EKRANI (holo mission screen) 26x24 ----
  BLD.pano = offscreen(26, 24, () => {
    const M = MET(false);
    // projector column + base
    rect(10, 14, 6, 7, K); rect(11, 15, 4, 6, M.m); vline(11, 15, 6, M.l);
    fill(RR(6, 20, 14, 4, 1), (x, y) => y === 21 ? M.l : M.d, K);
    pix(12, 21, C.cyan); pix(13, 21, C.cyan);
    // screen
    fill(RR(0, 0, 26, 16, 2), C.slate, K);
    rect(2, 2, 22, 12, C.navy); box(2, 2, 22, 12, C.blue);
    pix(2, 2, C.cyan); pix(23, 2, C.cyan); pix(2, 13, C.cyan); pix(23, 13, C.cyan);
    hline(4, 4, 10, C.cyan); hline(4, 5, 6, C.blue);
    grid(18, 3, ['.Y.', 'YYY', 'Y.Y'], { Y: C.yellow });
    for (const [i, ry] of [7, 10].entries()) {
      rect(4, ry, 2, 2, i === 0 ? C.green : C.sky);
      hline(7, ry, 9, C.sky); hline(7, ry + 1, 6, C.blue);
      hline(17, ry + 1, 5, C.slate); hline(17, ry + 1, i === 0 ? 5 : 2, i === 0 ? C.green : C.cyan);
    }
  });

  // ---- IŞINLANMA KAPISI (teleporter arch) 60x30 · light label plate centred at (30, 1..10) ----
  BLD.gate = offscreen(60, 30, () => {
    const M = MET(false);
    // energy curtain (translucent so the deck shows through)
    const pa = g.globalAlpha;
    for (let y = 10; y < 27; y++) { g.globalAlpha = pa * (0.42 - (y - 10) * 0.014); hline(11, y, 38, C.cyan); }
    for (let x = 11; x < 49; x++) {
      const h = hash2(x, 7); if (h > 0.42) continue;
      g.globalAlpha = pa * 0.6; vline(x, 11 + Math.floor(h * 22), 15 - Math.floor(h * 22), h < 0.12 ? C.white : C.sky);
    }
    g.globalAlpha = pa;
    for (const [x, y] of [[16, 15], [27, 19], [38, 13], [44, 21], [21, 23], [33, 24]]) pix(x, y, C.white);
    // threshold
    fill(RR(8, 26, 44, 4, 1), (x, y) => y === 27 ? C.cyan : M.d, K);
    // pylons
    for (const [x0, side] of [[1, 1], [49, -1]]) {
      const P = RR(x0, 6, 10, 24, 3, 0);
      fill(P, (x, y) => x === x0 + 1 ? M.hi : x >= x0 + 8 ? M.d : y >= 25 ? M.m : M.l, K);
      band(P, 23, 23, M.d);
      const ix = side > 0 ? x0 + 8 : x0 + 1;
      vline(ix, 9, 13, C.cyan); vline(ix - side, 9, 13, C.sky);
      fill(EL(x0 + 5, 16.5, 2.5, 2.5), C.cyan, K); pix(x0 + 4, 15, C.white);
      pix(x0 + 4, 27, C.yellow); pix(x0 + 5, 27, C.yellow);
    }
    // top beam + label plate
    fill(RR(4, 3, 52, 7, 2), (x, y) => y === 4 ? M.hi : y >= 8 ? M.d : M.l, K);
    for (const x of [7, 52]) { pix(x, 6, C.cyan); }
    fill(RR(13, 0, 34, 12, 2), (x, y) => (y === 1 || y === 10 || x === 14 || x === 45) ? M.m : y === 2 ? C.white : C.lgray, K);
    hline(15, 10, 30, C.cyan);
  });

  // ---- ZAFER VİTRİNİ (trophy case) 24x32 · centre column 12 ----
  BLD.anit = offscreen(24, 32, () => {
    const M = MET(false);
    // plinth
    fill(RR(2, 23, 21, 9, 1), (x, y) => y <= 24 ? M.l : y >= 30 ? M.d : M.m, K);
    hline(3, 25, 19, C.gold);
    fill(RR(8, 26, 9, 4, 0), C.gold, K); hline(10, 27, 5, C.orange0);
    // glass case
    fill(RR(4, 4, 17, 20, 0), (x, y) => { const d = x + y; return (d >= 22 && d <= 23) || d === 26 ? C.slate : y >= 20 ? C.navy : C.navy; }, K);
    vline(5, 5, 18, C.blue); vline(19, 5, 18, C.blue);
    // trophy on a little stand
    rect(9, 20, 7, 3, K); hline(10, 21, 5, C.gray);
    grid(7, 8, [
      '..KKKKKKK..',
      '.KKYWYGOKK.',
      'K.KYWYGOK.K',
      'K.KYYYGOK.K',
      '.KKYYGGOKK.',
      '..KKYGOKK..',
      '...KKGKK...',
      '....KGK....',
      '...KYGOK...',
      '..KYYGGOK..',
      '..KKKKKKK..'], { K, Y: C.yellow, W: C.white, G: C.gold, O: C.orange0 });
    // glints
    pix(6, 6, C.white); pix(7, 5, C.white); pix(6, 7, C.lgray);
    // cap with spotlight
    fill(RR(3, 1, 19, 4, 1), (x, y) => y <= 1 ? M.hi : M.l, K);
    pix(12, 3, C.cyan);
  });

  // ---- pet pod (ZIPZIP's home) 20x18 · centre column 9 ----
  BLD.kulube = offscreen(20, 18, () => {
    const M = MET(false);
    const dome = AND(EL(9.5, 15, 8.5, 13), (x, y) => y < 15);
    fill(dome, (x, y) => (x + 0.5 - 9.5) + (y + 0.5 - 15) * 0.7 < -10 ? M.hi : x >= 14 ? M.m : M.l, K);
    band(dome, 7, 7, C.green); band(dome, 8, 8, C.dgreen);
    rect(9, 0, 1, 3, K); pix(9, 0, C.yellow);
    fill(RR(0, 13, 19, 5, 2), (x, y) => y === 14 ? M.l : M.d, K);
    fill(RR(6, 9, 7, 7, 3.5, 0), C.navy, K);
    hline(7, 14, 5, C.dgreen); pix(9, 13, C.green);
    pix(3, 15, C.green); pix(15, 15, C.green);
  });

  // ---- neon stall helpers ----
  const awning = (x0, y0, w, h, sw) => {
    const c = (sw - 1) / 2, f = 2 / (c + 0.5);
    const tip = x => { const p = ((x - x0 - 1) % sw + sw) % sw; return Math.max(0, Math.round(2 - Math.abs(p - c) * f)); };
    const S = { b: [x0, y0, x0 + w - 1, y0 + h + 2], t: (x, y) => x >= x0 && x < x0 + w && y >= y0 && y < y0 + h + (x > x0 && x < x0 + w - 1 ? tip(x) : 0) };
    fill(S, (x, y) => {
      const s = Math.floor((x - x0 - 1) / sw) % 2;
      if (y === y0 + 1) return s ? C.magenta : C.salmon;
      if (y === y0 + h - 2) return C.cyan;
      if (y === y0 + h - 1) return C.sky;
      return s ? C.purple : C.magenta;
    }, K);
  };
  const GOODS = {
    crystal: makeSprite(['.c.', 'cwc', 'ccs', '.s.'], { c: C.cyan, w: C.white, s: C.sky }, K),
    potion: makeSprite(['.l.', '.l.', 'mmm', 'mwm', 'mmp'], { l: C.lgray, m: C.magenta, w: C.salmon, p: C.purple }, K),
    cell: makeSprite(['.g.', 'yyy', 'ywy', 'yyy', 'ooo'], { g: C.gray, y: C.yellow, w: C.white, o: C.gold }, K),
    orb: makeSprite(['.gg.', 'gwgg', 'gggd', '.dd.'], { g: C.green, w: C.white, d: C.dgreen }, K)
  };
  const putGood = (img, x, by) => spr(img, x, by - img.height + 1);

  // ---- MOKO'NUN TEZGAHI (hub stall) 42x32 · merchant stands at x 11..21 (keep clear) ----
  BLD.pazar = offscreen(42, 32, () => {
    const M = MET(false);
    for (const px of [3, 37]) { rect(px - 1, 6, 4, 26, K); vline(px, 6, 25, M.l); vline(px + 1, 6, 25, M.m); }
    awning(0, 0, 42, 7, 5);
    putGood(GOODS.crystal, 4, 20); putGood(GOODS.potion, 23, 20); putGood(GOODS.cell, 28, 20); putGood(GOODS.orb, 33, 20);
    fill(RR(1, 20, 40, 12, 1), (x, y) => y <= 21 ? M.l : y >= 29 ? C.navy : C.slate, K);
    hline(2, 24, 38, C.cyan); hline(2, 25, 38, C.sky);
    grid(18, 26, ['.MMM.', 'MWMWM', '.MMM.'], { M: C.magenta, W: C.white });
  });

  // ---- shop-scene stall (bigger) 64x44 · merchant drawn at x 27..37, y 16..31 ----
  BLD.stall = offscreen(64, 44, () => {
    const M = MET(false);
    rect(6, 12, 52, 18, K); rect(7, 13, 50, 16, C.navy);
    for (const sy of [19, 26]) hline(7, sy, 50, M.d);
    for (const [x, c] of [[9, C.cyan], [13, C.magenta], [17, C.yellow], [46, C.green], [50, C.cyan], [54, C.magenta]]) { rect(x, 16, 2, 3, c); pix(x, 16, C.white); rect(x, 23, 2, 3, c === C.cyan ? C.yellow : C.cyan); }
    for (const px of [5, 58]) { rect(px - 1, 10, 4, 34, K); vline(px, 10, 33, M.l); vline(px + 1, 10, 33, M.m); }
    awning(0, 0, 64, 11, 6);
    putGood(GOODS.crystal, 8, 30); putGood(GOODS.potion, 15, 30); putGood(GOODS.cell, 41, 30); putGood(GOODS.orb, 48, 30); putGood(GOODS.crystal, 55, 30);
    fill(RR(2, 30, 60, 14, 1), (x, y) => y <= 31 ? M.l : y >= 41 ? C.navy : C.slate, K);
    hline(3, 35, 58, C.cyan); hline(3, 36, 58, C.sky);
    grid(29, 38, ['.MMMMM.', 'MMWMWMM', '.MMMMM.'], { M: C.magenta, W: C.white });
  });

  // ---- oxygen / healing station (rest scene) 40x30 · mist rises from (20,8) ----
  BLD.fountain = offscreen(40, 30, () => {
    const M = MET(false);
    // O2 canisters behind the basin
    for (const tx of [3, 32]) {
      fill(RR(tx, 9, 5, 12, 2, 0), (x, y) => x === tx + 1 ? M.hi : x === tx + 3 ? M.m : M.l, K);
      band(RR(tx, 9, 5, 12, 2, 0), 13, 13, C.green);
      rect(tx + 1, 7, 3, 3, K); pix(tx + 2, 8, M.m);
    }
    const rim = EL(20, 20.5, 18.5, 5);
    const basin = OR(rim, AND(EL(20, 24.5, 18.5, 5), (x, y) => y >= 20));
    fill(basin, (x, y) => rim.t(x, y) ? (y <= 17 ? M.hi : M.l) : y >= 28 ? M.d : M.m, K);
    fill(EL(20, 20.5, 15.5, 3.3), (x, y) => y >= 22 ? C.sky : C.cyan, M.d);
    for (const x of [8, 14, 25, 31]) pix(x, 26, C.cyan);
    pix(10, 20, C.white); pix(11, 20, C.white); pix(28, 21, C.white); pix(25, 19, C.white);
    // glass column with bubbles
    rect(17, 9, 6, 13, K); vline(18, 9, 13, C.white); vline(19, 9, 13, C.cyan); vline(20, 9, 13, C.cyan); vline(21, 9, 13, C.sky);
    pix(19, 17, C.white); pix(20, 13, C.white); pix(19, 11, C.white);
    fill(RR(16, 18, 8, 3, 0), M.l, K); fill(RR(16, 9, 8, 3, 0), M.l, K);
    // emitter dish
    fill(EL(20, 7, 6, 2.5), (x, y) => y <= 6 ? M.hi : M.l, K);
    pix(19, 6, C.cyan); pix(20, 6, C.cyan); pix(19, 5, C.white); pix(20, 5, C.white);
  });

  // =====================================================================
  // DECOR
  // =====================================================================
  BLD.d_saman = offscreen(16, 10, () => {
    fill(RR(0, 7, 16, 3, 0), (x, y) => y === 8 ? C.gray : C.dgray, K);
    const bale = (x, y, w, h) => { rect(x, y, w, h, K); rect(x + 1, y + 1, w - 2, h - 2, C.gold); hline(x + 1, y + 1, w - 2, C.yellow); vline(x + Math.floor(w / 2), y + 1, h - 2, C.lgray); };
    bale(1, 3, 7, 5); bale(8, 3, 7, 5); bale(4, 0, 8, 4);
  });
  BLD.d_cicek = offscreen(18, 8, () => {
    fill(RR(0, 4, 18, 4, 1), (x, y) => y === 5 ? C.gray : C.dgray, K);
    for (let x = 2; x < 17; x += 4) pix(x, 6, C.cyan);
    for (const [x, col, h] of [[2, C.cyan, 2], [5, C.magenta, 3], [9, C.yellow, 2], [12, C.cyan, 3], [15, C.magenta, 2]]) {
      vline(x, 4 - h + 1, h, C.green); pix(x - 1, 3, C.dgreen);
      pix(x, 4 - h, col); pix(x + 1, 4 - h, col); if (4 - h - 1 >= 0) pix(x, 4 - h - 1, C.white);
    }
  });
  BLD.d_fener = offscreen(7, 18, () => {
    rect(2, 5, 3, 12, K); vline(3, 6, 10, C.gray); pix(3, 9, C.cyan); pix(3, 12, C.cyan);
    rect(1, 15, 5, 3, K); hline(2, 16, 3, C.lgray);
    circle(3, 3, 3, K); circle(3, 3, 2, C.yellow); pix(2, 2, C.white); pix(3, 2, C.white); pix(2, 3, C.white);
  });
  BLD.d_bayrak = offscreen(40, 10, () => {
    const yAt = x => Math.round(1 + Math.sin(x / 39 * Math.PI) * 4);
    for (let x = 0; x < 40; x++) pix(x, yAt(x), C.dgray);
    rect(0, 0, 2, 3, K); rect(38, 0, 2, 3, K);
    const cols = [C.cyan, C.magenta, C.yellow, C.green, C.hot, C.sky];
    for (let i = 0; i < 6; i++) {
      const x = 4 + i * 6, y = yAt(x), c = cols[i];
      const pa = g.globalAlpha; g.globalAlpha = pa * 0.35;
      rect(x - 2, y + 2, 1, 2, c); rect(x + 1, y + 2, 1, 2, c); rect(x - 1, y + 4, 2, 1, c);
      g.globalAlpha = pa;
      pix(x - 1, y + 1, C.slate); pix(x, y + 1, C.slate);
      rect(x - 1, y + 2, 2, 2, c); pix(x - 1, y + 2, C.white);
    }
  });
  BLD.d_agac = offscreen(16, 18, () => {
    const dome = AND(EL(8, 14, 7.5, 13.5), (x, y) => y < 14);
    fill(dome, C.navy, K);
    rect(7, 9, 2, 5, C.dbrown);
    circle(8, 7, 4, C.ddgreen); circle(8, 7, 3, C.dgreen); circle(7, 6, 2, C.green);
    pix(10, 8, C.magenta); pix(5, 7, C.cyan); pix(9, 4, C.yellow);
    pix(3, 6, C.white); pix(3, 5, C.white); pix(4, 4, C.white);
    fill(RR(0, 13, 16, 5, 1), (x, y) => y === 14 ? C.lgray : C.dgray, K);
    pix(7, 16, C.cyan); pix(8, 16, C.cyan);
  });
  BLD.d_kuyu = offscreen(16, 18, () => {
    rect(2, 12, 3, 6, K); vline(3, 12, 5, C.gray); rect(11, 12, 3, 6, K); vline(12, 12, 5, C.gray);
    fill(RR(1, 1, 14, 13, 4), (x, y) => cylCol(x, 1, 14, MET(false)), K);
    fill(RR(5, 4, 6, 8, 1), (x, y) => y >= 7 ? C.sky : C.navy, K);
    hline(6, 7, 4, C.cyan); pix(7, 9, C.white);
    rect(7, 13, 3, 3, K); pix(8, 13, C.gray); pix(8, 15, C.cyan);
  });
  BLD.d_cesme = offscreen(20, 16, () => {
    const rim = EL(10, 11.5, 9.5, 3);
    fill(OR(rim, AND(EL(10, 13, 9.5, 3), (x, y) => y >= 11)), (x, y) => rim.t(x, y) ? C.lgray : C.gray, K);
    fill(EL(10, 11.5, 7, 1.8), C.cyan);
    const pa = g.globalAlpha; g.globalAlpha = pa * 0.7;
    rect(9, 3, 2, 8, C.cyan); pix(9, 4, C.white); pix(10, 7, C.white);
    for (const s of [-1, 1]) { pix(10 + s * 2, 3, C.cyan); pix(10 + s * 4, 4, C.cyan); pix(10 + s * 5, 6, C.cyan); pix(10 + s * 6, 8, C.cyan); }
    g.globalAlpha = pa;
  });
  // golden statue of AKYEL (fist raised) on a plinth
  BLD.d_heykel = offscreen(18, 26, () => {
    fill(RR(2, 17, 14, 9, 1), (x, y) => y <= 18 ? C.lgray : y >= 24 ? C.dgray : C.gray, K);
    fill(RR(5, 20, 8, 3, 0), C.gold, K);
    grid(3, 0, [
      '.......KKK..',
      '.......KYOK.',
      '...KKK.KKGK.',
      '..KYYGK.KGK.',
      '.KYYGGOKKGK.',
      '..KYGOK.KOK.',
      '..KGGOK.KOK.',
      '...KGKKKKOK.',
      '.KKYGGGGOOK.',
      'KYKYGGGGOK..',
      'KGKYGGGOOK..',
      'KOKKGGGOK...',
      '.K.KGKKOK...',
      '...KGKKOK...',
      '...KGKKOK...',
      '..KYGKKOOK..',
      '..KKKKKKKK..'], { K, Y: C.yellow, G: C.gold, O: C.orange0 });
  });

  // =====================================================================
  // PEOPLE (9x14 art + ink outline = 11x16, like personSprite) — face right
  // =====================================================================
  PEOPLE.deniz = makeSprite([
    '...HRH...',
    '..HHRHH..',
    '..HfffH..',
    '..fefef..',
    '...fmf...',
    '...www...',
    '..wwrrr..',
    '.rrwwrrr.',
    '.frrwwrf.',
    '..rrrww..',
    '..ppppp..',
    '..pp.pp..',
    '..bb.bb..',
    '..bb.bb..'], { H: C.white, R: C.red, f: C.skin, e: K, m: C.skin2, r: C.red, w: C.white, p: C.white, b: C.navy }, K);
  PEOPLE.bip = makeSprite([
    '....a....',
    '....l....',
    '..HHHHH..',
    '.HHHHHHH.',
    '.HVVwVVH.',
    '.HVVcVVH.',
    '.HHHHHHH.',
    '...ddd...',
    '.BBBBBBB.',
    'gBBByBBBg',
    'g.BBBBB.g',
    'h.BBBBB.h',
    '.TTTTTTT.',
    '.TtTtTtT.'], { a: C.yellow, l: C.gray, H: C.lgray, V: C.navy, w: C.white, c: C.cyan, d: C.dgray, B: C.white, y: C.sky, g: C.gray, h: C.yellow, T: C.slate, t: C.dgray }, K);
  // Akyel in the red and white helmet from the old signal (station friend after the cup)
  PEOPLE.akyel = personSprite({ hat: 'helmet', hc: C.white, hc2: C.red, top: C.white, top2: C.red, bot: C.lgray });
  PEOPLE.moko = makeSprite([
    '...TTT...',
    '..TTyTT..',
    '..GGGGG..',
    '.GWKGWKG.',
    '.GWWGWWG.',
    '..GGmGG..',
    'G.RyyyR.G',
    'GGRRyRRGG',
    '..RRyRR..',
    'GGRRyRRGG',
    'G.RRyRR.G',
    '..RRyRR..',
    '.RRRyRRR.',
    '.RRRRRRR.'], { T: C.magenta, y: C.gold, G: C.green, W: C.white, K, m: C.dgreen, R: C.purple }, K);
  PEOPLE.chick = [
    makeSprite(['..r..', '.www.', 'wwwcw', 'yyyyy', 'k.k.b'], { r: C.red, w: C.white, c: C.cyan, y: C.gold, k: C.slate, b: C.sky }, K),
    makeSprite(['..r..', '.www.', 'wwwcw', 'yyyyy', '.k.kb'], { r: C.yellow, w: C.white, c: C.cyan, y: C.gold, k: C.slate, b: C.cyan }, K)
  ];
  PEOPLE.dog = [
    makeSprite(['..y..', '..a..', '.ggg.', 'gwgwg', 'gkgkg', 'ggggg', '.ddd.'], { y: C.yellow, a: C.dgreen, g: C.green, w: C.white, k: K, d: C.dgreen }, K),
    makeSprite(['.....', '.....', '..y..', '.gag.', 'gwgwg', 'gkgkg', 'ddddd'], { y: C.yellow, a: C.dgreen, g: C.green, w: C.white, k: K, d: C.dgreen }, K)
  ];

  // =====================================================================
  // PORTRAITS 28x28
  // =====================================================================
  const face = o => {
    ellipse(14, 16, 7, 8, K); ellipse(14, 16, 6, 7, o.skin);
    ellipse(16, 18, 3, 4, o.skin2); ellipse(14, 16, 5, 6, o.skin);
  };
  PORTRAIT.deniz = offscreen(28, 28, () => {
    fill(RR(3, 22, 22, 7, 5, 0), C.red, K);
    for (let i = 0; i < 6; i++) { pix(9 + i, 22 + i, C.white); pix(10 + i, 22 + i, C.white); }
    rect(12, 20, 4, 3, C.skin2);
    face({ skin: C.skin, skin2: C.skin2 });
    rect(7, 12, 2, 4, C.dbrown); rect(19, 12, 2, 4, C.dbrown);
    fill(AND(EL(14.5, 12, 9, 7.5), (x, y) => y <= 12), (x, y) => (x >= 13 && x <= 15) ? C.red : x >= 20 ? C.lgray : C.white, K);
    hline(6, 12, 17, C.red);
    fill(RR(8, 8, 5, 3, 1), C.cyan, K); fill(RR(15, 8, 5, 3, 1), C.cyan, K);
    pix(9, 9, C.white); pix(16, 9, C.white);
    hline(9, 14, 3, C.dbrown); hline(16, 14, 3, C.dbrown); pix(11, 15, C.dbrown); pix(16, 15, C.dbrown);
    rect(10, 16, 2, 2, C.white); rect(16, 16, 2, 2, C.white); pix(11, 17, K); pix(16, 17, K);
    pix(9, 19, C.salmon); pix(19, 19, C.salmon);
    hline(12, 21, 4, C.dbrown); pix(16, 20, C.dbrown);
  });
  PORTRAIT.bip = offscreen(28, 28, () => {
    fill(RR(3, 22, 22, 7, 4, 0), (x, y) => y === 23 ? C.white : C.lgray, K);
    rect(12, 24, 4, 3, C.sky); pix(13, 25, C.white);
    rect(11, 19, 6, 4, K); rect(12, 19, 4, 3, C.dgray);
    vline(14, 1, 5, K); circle(14, 1, 1, C.yellow);
    fill(RR(4, 5, 20, 16, 6), (x, y) => y <= 6 ? C.white : x >= 21 ? C.gray : C.lgray, K);
    fill(RR(6, 9, 16, 8, 3), C.navy, K);
    ring(14, 12, 3, C.blue); circle(14, 12, 2, C.cyan); pix(13, 11, C.white); pix(14, 11, C.white);
    for (const x of [11, 13, 15, 17]) pix(x, 18, C.dgray);
    circle(3, 13, 2, K); circle(25, 13, 2, K); pix(3, 13, C.gray); pix(25, 13, C.gray);
  });
  // MOKO: four-armed merchant — upper hands raised with a coin and a crystal, lower hands clasped
  PORTRAIT.moko = offscreen(28, 28, () => {
    fill(RR(3, 21, 22, 7, 5, 0), (x, y) => y === 22 ? C.magenta : x >= 20 ? C.plum : C.purple, K);
    rect(13, 21, 2, 7, C.gold); pix(13, 23, C.yellow);
    for (const ax of [4, 23]) { rect(ax - 1, 8, 3, 15, K); vline(ax, 9, 13, C.green); }
    ellipse(14, 15, 9, 8, K); ellipse(14, 15, 8, 7, C.green); ellipse(16, 18, 5, 4, C.dgreen); ellipse(14, 14, 7, 6, C.green);
    fill(RR(9, 1, 10, 8, 3, 0), (x, y) => x >= 16 ? C.purple : C.magenta, K); hline(10, 7, 8, C.gold); pix(14, 4, C.cyan); pix(13, 4, C.white);
    for (const ex of [10, 18]) { circle(ex, 14, 3, K); circle(ex, 14, 2, C.white); rect(ex - 1, 14, 2, 2, K); pix(ex - 1, 14, C.white); hline(ex - 2, 12, 5, C.dgreen); }
    hline(12, 20, 4, C.ddgreen); pix(16, 19, C.ddgreen); pix(11, 19, C.ddgreen);
    // hands (mitts) + goods
    const mitt = (x, y) => grid(x, y, ['.KKK.', 'KGGGK', 'KGGDK', '.KKK.'], { K, G: C.green, D: C.dgreen });
    mitt(2, 6); mitt(21, 6); mitt(6, 23); mitt(17, 23);
    circle(4, 3, 2, K); circle(4, 3, 1, C.gold); pix(3, 2, C.yellow);
    grid(21, 0, ['..K..', '.KCK.', 'KCWSK', '.KSK.', '..K..'], { K, C: C.cyan, W: C.white, S: C.sky });
  });
  // SUNUCU GRAX: purple three-eyed showman with a mic, gold sparkly suit and bow tie
  PORTRAIT.grax = offscreen(28, 28, () => {
    fill(RR(2, 21, 24, 7, 6, 0), (x, y) => y === 22 ? C.yellow : x >= 19 ? C.orange0 : C.gold, K);
    grid(10, 21, ['KWWWWWWWK', '.KWWWWWK.', '.KWWWWWK.', '..KWWWK..', '..KWWWK..', '...KWK...', '...KWK...'], { K, W: C.white });
    grid(11, 21, ['HH...HH', 'HHHKHHH', 'HH...HH'], { H: C.hot, K: C.wine });
    for (const [x, y] of [[4, 25], [7, 23], [6, 27], [20, 24], [23, 26], [18, 27]]) pix(x, y, C.white);
    // head + left ear fin + slick crest
    grid(1, 10, ['KK..', 'KMK.', 'KPPK', '.KPK', '..KK'], { K, M: C.magenta, P: C.purple });
    const H = EL(14, 13.5, 9.5, 8.5);
    fill(H, (x, y) => { const dx = x + 0.5 - 14, dy = y + 0.5 - 13.5; return dx + dy < -9 ? C.magenta : dx * 0.5 + dy > 4.5 ? C.plum : C.purple; }, K);
    fill(AND(EL(14, 6.5, 7, 4), (x, y) => y <= 5), (x, y) => y <= 3 ? C.salmon : C.magenta, K);
    // THREE big yellow slit-pupil eyes (forehead + pair) with villain brows
    const eye = (cx, cy) => { rect(cx - 2, cy - 1, 5, 4, K); rect(cx - 1, cy, 3, 2, C.yellow); vline(cx, cy, 2, K); pix(cx - 1, cy, C.white); };
    eye(14, 7); eye(9, 12); eye(19, 12);
    grid(6, 9, ['KK..', '..KK'], { K }); grid(18, 9, ['..KK', 'KK..'], { K });
    // wide toothy grin
    grid(6, 15, [
      'K...............K',
      'KK.............KK',
      '.KWLWLWLWLWLWLWK.',
      '..KDDDDDDDDDDDK..',
      '...KWLWLWLWLWK...',
      '....KKKKKKKKK....'], { K, W: C.white, L: C.lgray, D: C.wine });
    // microphone in his hand
    grid(22, 14, ['.KKK.', 'KLGDK', 'KGDDK', '.KKK.', '..K..', '.KPK.', 'KPPPK', 'KPMPK', '.KKK.'], { K, L: C.lgray, G: C.gray, D: C.dgray, P: C.purple, M: C.magenta });
  });
  // AKYEL: legendary jockey, silver hair, worn red/white helmet, kind but tough (scar)
  PORTRAIT.akyel = offscreen(28, 28, () => {
    fill(RR(4, 9, 20, 16, 7, 3), (x, y) => (x === 6 || x === 9 || x === 18 || x === 21) && y > 13 ? C.gray : C.lgray, K);
    fill(RR(3, 22, 22, 7, 5, 0), (x, y) => x >= 20 ? C.wine : C.red, K);
    for (let i = 0; i < 6; i++) { pix(9 + i, 22 + i, C.lgray); pix(10 + i, 22 + i, C.lgray); }
    fill(RR(4, 18, 4, 8, 2), C.lgray, K); fill(RR(20, 18, 4, 8, 2), C.lgray, K);
    vline(5, 19, 6, C.gray); vline(22, 19, 6, C.gray); pix(6, 19, C.white);
    rect(12, 20, 4, 3, C.skin2);
    face({ skin: C.skin, skin2: C.skin2 });
    rect(7, 12, 2, 5, C.lgray); rect(19, 12, 2, 5, C.lgray); pix(8, 13, C.white);
    fill(AND(EL(14.5, 12, 9, 7.5), (x, y) => y <= 12), (x, y) => (x >= 13 && x <= 15) ? C.red : x >= 20 ? C.gray : C.lgray, K);
    hline(6, 12, 17, C.wine); pix(9, 12, C.red); pix(14, 6, C.wine); pix(10, 7, C.gray); pix(11, 8, C.gray); pix(18, 9, C.dgray); pix(17, 10, C.gray);
    hline(9, 14, 3, C.gray); hline(16, 14, 3, C.gray);
    pix(10, 16, C.white); pix(11, 16, K); pix(16, 16, K); pix(17, 16, C.white);
    hline(10, 15, 2, C.skin2); hline(16, 15, 2, C.skin2); pix(9, 17, C.skin2); pix(18, 17, C.skin2); pix(9, 16, C.skin2); pix(18, 16, C.skin2);
    pix(14, 18, C.skin2);
    hline(12, 20, 4, C.dbrown); pix(11, 19, C.dbrown); pix(16, 19, C.dbrown); hline(13, 21, 2, C.salmon);
    pix(19, 18, C.salmon); pix(20, 19, C.salmon); pix(18, 17, C.salmon);
  });
}
