// ================= RUN SCENE: DRAWING =================
const WHITE_CACHE = new Map();
function whiteOf(img) { let w = WHITE_CACHE.get(img); if (!w) { w = tintSprite(img, C.white); WHITE_CACHE.set(img, w); } return w; }
const MEDAL_NAMES = { g: 'ALTIN MADALYA', s: 'GÜMÜŞ MADALYA', b: 'BRONZ MADALYA' };
const MEDAL_COLS = { g: C.yellow, s: C.lgray, b: C.orange0 };
const NOTE_COLS = { n: C.white, a: C.gold, d: C.magenta, d2: C.magenta, h: C.cyan };

Object.assign(SCENES.run, {
  beatFrac() { return this.clockOn ? ((Beat.pos(now()) % 1) + 1) % 1 : 0.5; },
  // bends: the track ahead (and behind) curves toward the inner side, OutRun-style accumulation
  computeOffsets() {
    const n = H, P = this.P;
    if (!this.rowOff || this.rowOff.length !== n) this.rowOff = new Float32Array(n);
    const ro = this.rowOff;
    this.hasOff = false;
    if (!this.bends || !this.bends.length) return;
    const K = 0.00085, pY = Math.round(this.pY);
    let slope = 0, off = 0, any = false;
    ro[clamp(pY, 0, n - 1)] = 0;
    for (let y = pY - 1; y >= 0; y--) { const c = this.bendAt(P.dist + (pY - y)); if (c) any = true; slope += c * K; off += slope; ro[y] = off; }
    slope = 0; off = 0;
    for (let y = pY + 1; y < n; y++) { const c = this.bendAt(P.dist - (y - pY)); if (c) any = true; slope += c * K; off += slope; ro[y] = off; }
    this.hasOff = any;
  },
  offY(sy) {
    if (!this.hasOff) return 0;
    const n = this.rowOff.length, i = sy < 0 ? 0 : sy >= n ? n - 1 : sy | 0;
    return Math.round(this.rowOff[i]);
  },
  draw() {
    const [ox, oy] = shakeOffset();
    this.computeOffsets();
    this.drawTrack(ox, oy);
    this.drawWorld(ox, oy);
    this.drawShots(ox, oy);
    this.drawEnemyFire(ox, oy);
    if (this.storm) this.drawStorm(ox, oy);
    this.drawBolts(ox, oy);
    drawParts(ox, oy);
    for (const l of this.lines) { g.globalAlpha = clamp(l.t * 2, 0, 0.6); rect(l.x + ox, l.y + oy, 1, l.l, C.white); }
    g.globalAlpha = 1;
    this.drawWeather(ox, oy);
    this.drawShowFX(ox, oy);
    drawFlash();
    this.drawHUD();
    drawTexts();
    if (this.medal) this.drawMedal();
    if (this.tut) this.drawTut();
    if (this.state === 'intro') this.drawIntro();
    if (this.state === 'dead') this.drawDead();
    if (this.paused) this.drawPause();
  },
  drawTrack(ox, oy) {
    const reg = this.reg, P = this.P, tx = this.trackL, tw = this.laneW * 5;
    rect(0, 0, W, H, reg.grass);
    const tile = 8;
    const topWorld = P.dist + this.pY + 40, botWorld = P.dist - (H - this.pY) - 40;
    const r0 = Math.floor(botWorld / tile), r1 = Math.ceil(topWorld / tile);
    for (let r = r0; r <= r1; r++) {
      const sy = Math.round(this.sy(r * tile)) + oy, o = this.offY(sy);
      for (let cx = -16; cx < W + 16; cx += tile) {
        if (cx + tile > tx - 4 && cx < tx + tw + 4) continue;
        const h = hash2(r, cx), x = cx + o + ox;
        if (h < 0.4) rect(x + ((h * 37) | 0) % 7, sy, 2, 1, reg.grass2);
        else if (h > 0.93) rect(x + ((h * 53) | 0) % 6, sy + 3, 1, 2, reg.grassD);
        if (reg.deco === 'meadow') {
          if (h > 0.4 && h < 0.45) spr(OB.flowers[(r + cx) & 3], x + 2, sy);
          else if (h > 0.6 && h < 0.63) spr(OB.tuft, x + 2, sy);
        } else if (reg.deco === 'forest') {
          if (h > 0.6 && h < 0.63) spr(OB.tuftD, x + 2, sy);
          else if (h > 0.45 && h < 0.46) spr(OB.mushroom, x + 2, sy);
        } else if (reg.deco === 'ice') {
          if (h > 0.6 && h < 0.625) spr(OB.flake, x + 2, sy);
          else if (h > 0.45 && h < 0.46) spr(OB.iceShard, x + 2, sy);
        } else if (reg.deco === 'desert') {
          if (h > 0.6 && h < 0.618) spr(OB.dune, x, sy);
          else if (h > 0.45 && h < 0.455) spr(OB.ribs, x, sy);
        }
      }
    }
    if (reg.deco === 'forest' || reg.deco === 'meadow' || reg.deco === 'ice' || reg.deco === 'desert') {
      const step = 26; const s0 = Math.floor(botWorld / step), s1 = Math.ceil(topWorld / step);
      for (let s = s0; s <= s1; s++) for (const side of [0, 1]) {
        const h = hash2(s * 7 + side, 991);
        const sy = Math.round(this.sy(s * step)) + oy, o = this.offY(sy) + ox;
        if (reg.deco === 'forest') {
          if (h < 0.75) { const img = h < 0.4 ? OB.tree : OB.pine; const x = side ? tx + tw + 4 + (h * 20 | 0) % Math.max(1, W - tx - tw - 10) - 2 : tx - 4 - img.width - ((h * 20) | 0) % Math.max(1, tx - 6) + 4; spr(img, x + o, sy - img.height); }
        } else if (reg.deco === 'ice' || reg.deco === 'desert') {
          const img = reg.deco === 'ice' ? (h < 0.22 ? OB.iceSpire : h < 0.3 ? OB.iceShard : null) : (h < 0.16 ? OB.cactus : h < 0.24 ? OB.sandRock : null);
          if (img) { const x = side ? tx + tw + 5 + ((h * 90) | 0) % Math.max(1, W - tx - tw - img.width - 6) : ((h * 90) | 0) % Math.max(1, tx - img.width - 5); spr(img, x + o, sy - img.height); }
        } else if (h < 0.16) { const x = side ? tx + tw + 6 + ((h * 90) | 0) % Math.max(1, W - tx - tw - 16) : ((h * 90) | 0) % Math.max(1, tx - 16); spr(OB.bush, x + o, sy - 6); }
      }
    }
    if (reg.deco === 'stadium') this.drawStands(ox, oy, botWorld, topWorld);
    const wet = this.weather === 'yagmur', pulse = this.state === 'run' ? Math.max(0, 1 - this.beatFrac() * 3) : 0;
    if (!this.hasOff) {
      rect(tx - 2 + ox, 0, tw + 4, H, reg.dirtD);
      rect(tx + ox, 0, tw, H, wet ? reg.dirtD : reg.dirt);
      if (wet) { g.globalAlpha = 0.55; rect(tx + ox, 0, tw, H, reg.dirt); g.globalAlpha = 1; }
      rect(tx - 4 + ox, 0, 2, H, reg.rail); rect(tx + tw + 2 + ox, 0, 2, H, reg.rail);
      if (pulse > 0) { g.globalAlpha = pulse * 0.5; rect(tx - 4 + ox, 0, 2, H, C.yellow); rect(tx + tw + 2 + ox, 0, 2, H, C.yellow); g.globalAlpha = 1; }
    } else {
      for (let y = 0; y < H; y += 2) {
        const o = this.offY(y + 1) + ox;
        rect(tx - 2 + o, y, tw + 4, 2, reg.dirtD);
        rect(tx + o, y, tw, 2, wet ? reg.dirtD : reg.dirt);
        rect(tx - 4 + o, y, 2, 2, reg.rail); rect(tx + tw + 2 + o, y, 2, 2, reg.rail);
      }
      if (wet) { g.globalAlpha = 0.55; for (let y = 0; y < H; y += 2) rect(tx + this.offY(y + 1) + ox, y, tw, 2, reg.dirt); g.globalAlpha = 1; }
      if (pulse > 0) { g.globalAlpha = pulse * 0.5; for (let y = 0; y < H; y += 2) { const o = this.offY(y + 1) + ox; rect(tx - 4 + o, y, 2, 2, C.yellow); rect(tx + tw + 2 + o, y, 2, 2, C.yellow); } g.globalAlpha = 1; }
    }
    const c0 = Math.floor(botWorld / 6), c1 = Math.ceil(topWorld / 6);
    for (let r = c0; r <= c1; r++) {
      const sy = Math.round(this.sy(r * 6)) + oy, o = this.offY(sy) + ox;
      for (let cx = 0; cx < tw; cx += 6) {
        const h = hash2(r + 7777, cx);
        if (h < 0.22) pix(tx + cx + ((h * 41) | 0) % 6 + o, sy, reg.dirtD);
        else if (h > 0.9) pix(tx + cx + ((h * 29) | 0) % 6 + o, sy + 2, reg.dirtL);
      }
    }
    const dashOff = ((P.dist % 16) + 16) % 16;
    g.globalAlpha = 0.4 + 0.4 * pulse;
    for (let i = 1; i < 5; i++) for (let y = -16 + dashOff; y < H; y += 16) rect(tx + i * this.laneW + this.offY(y + 3) + ox, y + oy, 1, 7, pulse > 0.5 ? C.white : reg.dirtL);
    g.globalAlpha = 1;
    const pOff = ((P.dist % 24) + 24) % 24;
    for (let y = -24 + pOff; y < H + 24; y += 24) { const o = this.offY(y) + ox; rect(tx - 5 + o, y + oy, 4, 3, reg.post); rect(tx + tw + 1 + o, y + oy, 4, 3, reg.post); pix(tx - 5 + o, y + 3 + oy, C.ink); pix(tx + tw + 4 + o, y + 3 + oy, C.ink); }
    // bend chevrons on the inner rail
    for (const b of this.bends || []) {
      for (let wy = b.y0 - 200; wy < b.y1; wy += 34) {
        const sy = Math.round(this.sy(wy)) + oy; if (sy < -8 || sy > H + 8) continue;
        const o = this.offY(sy) + ox, inner = b.dir < 0, x = inner ? tx - 13 + o : tx + tw + 6 + o, col = wy < b.y0 ? C.orange : C.yellow;
        rect(x - 1, sy - 4, 9, 9, C.ink); rect(x, sy - 3, 7, 7, col);
        for (let k = 0; k < 3; k++) { pix(inner ? x + 4 - k : x + 2 + k, sy - 2 + k, C.ink); pix(inner ? x + 4 - k : x + 2 + k, sy + 2 - k, C.ink); }
      }
    }
    const lines = [0];
    if (this.type !== 'boss') lines.push(this.length);
    for (const ly of lines) {
      const sy = Math.round(this.sy(ly)) + oy;
      if (sy < -30 || sy > H + 10) continue;
      const o = this.offY(sy) + ox;
      for (let x = 0; x < tw; x += 4) for (let k = 0; k < 2; k++) rect(tx + x + o, sy + k * 4 - 4, 4, 4, ((x / 4 + k) % 2) ? C.ink : C.white);
      if (ly > 0) { rect(tx - 6 + o, sy - 22, 2, 24, C.lgray); rect(tx + tw + 4 + o, sy - 22, 2, 24, C.lgray); rect(tx - 6 + o, sy - 24, tw + 12, 7, C.ink); rect(tx - 5 + o, sy - 23, tw + 10, 5, C.red); text('BİTİŞ', tx + tw / 2 + o, sy - 25, C.white, 'center'); }
    }
    if (this.type !== 'boss' && !this.tut) {
      const sy = Math.round(this.sy(this.length * 0.8)) + oy;
      if (sy > -10 && sy < H + 10) { const o = this.offY(sy) + ox; for (const x of [tx - 7, tx + tw + 3]) { vline(x + 1 + o, sy - 10, 12, C.lgray); rect(x + 2 + o, sy - 10, 5, 4, C.yellow); } }
    }
    if (reg.deco === 'forest') { for (let i = 0; i < 6; i++) { g.globalAlpha = 0.07 * (6 - i); rect(0, i * 10, W, 10, C.lgray); } g.globalAlpha = 1; }
    if (reg.night) { g.globalAlpha = 0.22; rect(0, 0, W, H, C.navy); g.globalAlpha = 1; }
  },
  drawStands(ox, oy, botWorld, topWorld) {
    const tx = this.trackL, tw = this.laneW * 5;
    const leftW = tx - 6, rightX = tx + tw + 6;
    if (!this.hasOff) { rect(0, 0, leftW, H, C.slate); rect(rightX, 0, W - rightX, H, C.slate); rect(leftW - 2, 0, 2, H, C.navy); rect(rightX, 0, 2, H, C.navy); }
    else for (let y = 0; y < H; y += 2) { const o = this.offY(y); rect(0, y, Math.max(0, leftW + o), 2, C.slate); rect(rightX + o, y, W + 20, 2, C.slate); rect(leftW - 2 + o, y, 2, 2, C.navy); rect(rightX + o, y, 2, 2, C.navy); }
    const step = 4; const s0 = Math.floor(botWorld / step), s1 = Math.ceil(topWorld / step);
    const cols = [C.red, C.yellow, C.sky, C.white, C.green, C.salmon, C.gold, C.magenta];
    const skins = [C.green, C.cyan, C.lgray, C.magenta, C.yellow, C.salmon];
    const cheer = this.finalStretch ? 20 : 10;
    for (let s = s0; s <= s1; s++) {
      const sy = Math.round(this.sy(s * step)) + oy, o = this.offY(sy);
      if (s % 6 === 0) { rect(0, sy, leftW + o - 2, 1, C.navy); rect(rightX + o + 2, sy, W, 1, C.navy); continue; }
      for (let x = 1; x < leftW - 3; x += 3) { const h = hash2(s, x); if (h < 0.75) { const bob = (Math.sin(T * cheer + h * 20) > 0.6) ? -1 : 0; pix(x + o + ox, sy + bob, skins[(h * 47 | 0) % 6]); pix(x + o + ox, sy + 1 + bob, cols[(h * 80 | 0) % 8]); } }
      for (let x = rightX + 3; x < W + 8; x += 3) { const h = hash2(s, x); if (h < 0.75) { const bob = (Math.sin(T * cheer + h * 20) > 0.6) ? -1 : 0; pix(x + o + ox, sy + bob, skins[(h * 47 | 0) % 6]); pix(x + o + ox, sy + 1 + bob, cols[(h * 80 | 0) % 8]); } }
    }
  },
  drawWorld(ox, oy) {
    const P = this.P;
    const items = [];
    for (const t of this.trails) {
      const sy = this.sy(t.dist) + oy, o = this.offY(sy) + ox; g.globalAlpha = clamp(t.t, 0, 1) * 0.7;
      rect(t.x - 2 + o, sy - 20, 4, 30, C.yellow); rect(t.x - 1 + o, sy - 22, 2, 34, C.white); g.globalAlpha = 1;
    }
    for (const o of this.obs) {
      if (o.dead) continue;
      const sy = this.sy(o.y); if (sy < -30 || sy > H + 30) continue;
      if (o.kind === 'puddle' || o.kind === 'civi' || o.kind === 'toz') this.drawObs(o, sy, ox + this.offY(sy), oy); else items.push({ y: sy, o });
    }
    for (const f of this.foes) { if (f.dead) continue; const sy = this.sy(f.dist); if (sy > -30 && sy < H + 30) items.push({ y: sy + (f.kind === 'karga' ? 20 : 0), f, sy }); }
    if (this.reis && !this.reis.dead) { const sy = this.sy(this.reis.dist); if (sy > -40 && sy < H + 30) items.push({ y: sy, reis: this.reis, sy }); }
    for (const r of this.rivals) { const sy = this.sy(r.dist); if (sy > -30 && sy < H + 30) items.push({ y: sy, r }); }
    if (this.boss) items.push({ y: this.boss.screenY, b: this.boss });
    items.push({ y: this.pY, p: true });
    items.sort((a, b) => a.y - b.y);
    const gallop = Math.floor(((this.clockOn ? Beat.pos(now()) : T * 2) % 1 + 1) % 1 * 8) % 4;
    for (const it of items) {
      if (it.o) this.drawObs(it.o, it.y, ox + this.offY(it.y), oy);
      else if (it.f) this.drawFoe(it.f, it.sy, ox + this.offY(it.sy), oy);
      else if (it.reis) this.drawReis(it.reis, it.sy, ox + this.offY(it.sy), oy);
      else if (it.r) {
        const r = it.r, o = this.offY(it.y) + ox; const fr = Math.floor(this.time * 10 * r.spd + r.phase) % 4;
        this.drawHorse(r.set, r.x + o, it.y + oy, fr, r.jumping, r.jumping ? r.jumpT / 0.5 : 0, r.stun > 0 && Math.floor(T * 10) % 2 === 0);
        if (r.name && !r.done) {
          const c = r.nem ? C.red : STYLE_COL[r.style] || C.green;
          // names stay on screen, and fade out for rivals far behind you (they would sit under the bottom HUD)
          const nw = textWidth(r.name), behind = it.y - this.pY;
          if (behind < 60) { g.globalAlpha = behind > 20 ? 1 - (behind - 20) / 40 : 1; textO(r.name, clamp(r.x + o, nw / 2 + 2, W - nw / 2 - 2), it.y + oy - 24, c, 'center'); g.globalAlpha = 1; }
          if (r.nem) { spr(tinted('crown', C.red), r.x + o - 5, it.y + oy - 33); if (this.nemTaunt && !r.duel && (this.state === 'intro' || this.nemTaunt.t > 0)) this.speech(this.nemTaunt.txt, r.x + o, it.y + oy - 36); }
        }
        if (r.duel && this.duel && !r.done) this.drawDuelMarks(r, r.x + o, it.y + oy);
        else if (!r.done) { this.drawRivalTele(r, r.x + o, it.y + oy); if (r.pushWarn > 0 && Math.floor(T * 12) % 2 === 0) { textO('!', r.x + o, it.y + oy - 34, C.red, 'center', 2); textO(r.lane < this.P.lane ? '→' : '←', r.x + o + (r.lane < this.P.lane ? 12 : -12), it.y + oy - 4, C.red, 'center'); } }
      } else if (it.b) this.drawBoss(it.b, ox + this.offY(it.y), oy);
      else if (it.p) this.drawPlayer(ox, oy, gallop);
    }
    if (this.shock) {
      const s = this.shock, k = 1 - s.t / 0.35, sy = s.sy != null ? s.sy : this.pY + 6, o = this.offY(sy) + ox;
      g.globalAlpha = clamp(1 - k, 0, 1) * 0.8; ring(s.x + o, sy + oy, Math.max(2, Math.round(s.r * (0.3 + k * 0.7))), C.white); ring(s.x + o, sy + oy, Math.max(1, Math.round(s.r * (0.2 + k * 0.6))), C.yellow); g.globalAlpha = 1;
    }
  },
  drawDuelMarks(r, x, y) {
    const D = this.duel;
    if (D.surgeT > 0) { g.globalAlpha = 0.35 + 0.2 * Math.sin(T * 20); ellipse(x, y, 10, 14, C.salmon); g.globalAlpha = 1; }
    if (D.tele && Math.floor(T * 10) % 2 === 0) {
      textO('!', x, y - 36, C.red, 'center', 2);
      if (D.tele.kind === 'push' || D.tele.kind === 'cut') textO(D.tele.lane < r.lane ? '←' : '→', x + (D.tele.lane < r.lane ? -12 : 12), y - 4, C.red, 'center');
      else if (D.tele.kind === 'drop') textO('↓', x, y + 14, C.red, 'center');
    }
    const tt = D.tauntTxt || D.info.taunt;
    if ((this.state === 'intro' || D.tauntT > 0) && tt) this.speech(tt, x, y - (r.nem ? 40 : 34));
  },
  // white speech bubble whose tail points at (x, y)
  speech(txt, x, y) {
    const lines = wrapText(txt, Math.min(110, W - 30)), w = Math.max(...lines.map(l => textWidth(l))) + 8, h = lines.length * 9 + 4;
    const bx = Math.round(clamp(x - w / 2, 3, W - w - 3)), by = Math.round(y - h - 3);
    rrect(bx - 1, by - 1, w + 2, h + 2, C.ink); rrect(bx, by, w, h, C.white);
    const tx = Math.round(clamp(x, bx + 3, bx + w - 4));
    rect(tx - 1, by + h, 3, 1, C.white); pix(tx, by + h + 1, C.white); pix(tx - 2, by + h, C.ink); pix(tx + 2, by + h, C.ink); pix(tx - 1, by + h + 1, C.ink); pix(tx + 1, by + h + 1, C.ink); pix(tx, by + h + 2, C.ink);
    lines.forEach((l, i) => text(l, bx + 4, by + 2 + i * 9, C.ink));
  },
  drawBoss(B, ox, oy) {
    const fr = Math.floor(this.time * 12) % 4, y = B.screenY;
    g.globalAlpha = 0.35 + 0.15 * Math.sin(T * 6); ellipse(B.x + ox, y + oy, 10, 14, B.tired > 0 ? C.yellow : B.def.color); g.globalAlpha = 1;
    if (B.flash > 0) { const img = B.set.white; spr(img, B.x + ox - img.width / 2, y + oy - img.height / 2); }
    else this.drawHorse(B.set, B.x + ox, y + oy, fr, false, 0, B.stun > 0 && Math.floor(T * 10) % 2 === 0);
    spr(ICONS.crown, B.x + ox - 5, y + oy - 22);
    if (B.tired > 0) for (let i = 0; i < 3; i++) { const k = (T * 1.5 + i / 3) % 1; g.globalAlpha = 1 - k; pix(B.x + ox - 8 + i * 8, y + oy - 14 + k * 10, C.cyan); g.globalAlpha = 1; }
    if (B.taunt > 0) { textO('KİBİR!', B.x + ox, y + oy - 34 + Math.round(Math.sin(T * 10)), C.magenta, 'center'); g.globalAlpha = 0.4 + 0.3 * Math.sin(T * 14); ring(B.x + ox, y + oy, 14, C.magenta); g.globalAlpha = 1; }
  },
  drawPlayer(ox, oy, gallop) {
    const P = this.P, S = this.S;
    if (S.ghost) { g.globalAlpha = 0.35; this.drawHorse(this.set, this.laneX(this.ghostLane) + ox, this.pY + oy + 4, gallop, false, 0, false); g.globalAlpha = 1; }
    if (P.ghostsT > 0) for (const dl of [-1, 1]) {
      const ln = P.lane + dl; if (ln < 0 || ln > 4) continue;
      const gx = this.laneX(ln) + ox, img = this.set.frames[(gallop + 2) % 4], tint = tintedHorse(this.set, C.magenta);
      g.globalAlpha = 0.5; spr(img, gx - img.width / 2, this.pY + oy + 2 - img.height / 2);
      g.globalAlpha = 0.35 + 0.1 * Math.sin(T * 12); spr(tint, gx - tint.width / 2, this.pY + oy + 2 - tint.height / 2); g.globalAlpha = 1;
      if (rnd() < 0.3) addPart(gx + (rnd() - 0.5) * 8, this.pY + 10, 0, 25, 0.4, C.magenta, 1);
    }
    const cx = P.x + ox, cy = this.pY + oy + 1;
    // rhythm ring: closes on the horse for the next note, colored by the note type
    if (this.clockOn && (this.state === 'run' || this.state === 'intro')) {
      const bp = Beat.pos(now()), nt = this.nextTarget(bp);
      if (nt && nt.t - bp < 1.05) {
        const d = Math.max(0, nt.t - bp), rr = Math.round(10 + d * 12);
        g.globalAlpha = 0.2 + (1 - Math.min(1, d)) * 0.6; ring(cx, cy, rr, NOTE_COLS[nt.kind] || C.white);
        if (nt.kind === 'a') ring(cx, cy, rr + 1, C.gold);
        g.globalAlpha = 1;
      }
      if (this.hold) {
        const h = this.hold, k = clamp((bp - h.start) / Math.max(0.1, h.end - h.start), 0, 1);
        for (let a = 0; a < k * Math.PI * 2; a += 0.1) pix(cx + Math.round(Math.sin(a) * 13), cy - Math.round(Math.cos(a) * 13), C.cyan);
        g.globalAlpha = 0.25 + 0.15 * Math.sin(T * 16); circle(cx, cy, 11, C.cyan); g.globalAlpha = 1;
      }
      if (this.ringFlash > 0) { g.globalAlpha = this.ringFlash; ring(cx, cy, 11, C.yellow); ring(cx, cy, 12, C.white); g.globalAlpha = 1; }
    }
    const blink = P.invuln > 0 && Math.floor(T * 14) % 2 === 0;
    const hamleOn = P.hamleT > 0;
    if (P.abilityT > 0 || hamleOn || P.stormT > 0 || this.kick > 0) { g.globalAlpha = 0.35 + 0.2 * Math.sin(T * 20); ellipse(cx, this.pY + oy, 10, 14, hamleOn ? (S.hamleInv ? C.magenta : C.cyan) : P.stormT > 0 ? C.green : this.kick > 0 ? C.sky : C.yellow); g.globalAlpha = 1; }
    if (hamleOn && rnd() < 0.6) addPart(P.x + (rnd() - 0.5) * 8, this.pY + 12, 0, 70, 0.3, C.white, 1);
    if (P.floatT > 0) { g.globalAlpha = 0.5; ellipse(cx, this.pY + oy + 9, 7, 3, C.cyan); g.globalAlpha = 1; }
    const air = P.flyT > 0 || (hamleOn && S.hamleAir);
    if (air) {
      const lift = 12 + Math.round(Math.sin(T * 6) * 2);
      g.globalAlpha = 0.25; ellipse(cx, this.pY + oy + 9, 4, 2, C.ink); g.globalAlpha = 1;
      const img = this.set.jump; spr(img, cx - img.width / 2, this.pY + oy - img.height / 2 - lift);
      for (const s of [-1, 1]) { g.globalAlpha = 0.7; spr(s < 0 ? ICONS.wing : flipCached(ICONS.wing), cx + (s < 0 ? -15 : 6), this.pY + oy - lift - 4 + Math.round(Math.sin(T * 14) * 2)); g.globalAlpha = 1; }
      if (rnd() < 0.4) addPart(P.x + (rnd() - 0.5) * 10, this.pY - lift + 8, 0, 30, 0.4, C.cyan, 1);
    } else {
      const st = this.state === 'intro' ? -1 : gallop;
      this.drawHorse(this.set, cx, this.pY + oy, st, P.jumping, P.jumping ? P.jumpT / this.S.jumpTime : 0, blink);
    }
    if (P.draft > 0.05 && this.state === 'run') {
      const full = P.draftFull, bw = 16, bx = Math.round(P.x - bw / 2) + ox, by = this.pY + 14 + oy;
      if (!full || Math.floor(T * 8) % 2 === 0) bar(bx, by, bw, 2, P.draft, full ? C.white : C.cyan);
      if (full) for (const s of [-1, 1]) textO(s < 0 ? '←' : '→', cx + s * 15, this.pY + oy - 4, C.cyan, 'center');
    }
    if (P.cornerM && P.cornerM !== 1 && this.state === 'run' && Math.floor(T * 4) % 2 === 0) textO(P.cornerM > 1 ? 'İÇ!' : 'DIŞ', cx, this.pY + oy + 15, P.cornerM > 1 ? C.green : C.salmon, 'center');
  },
  drawHorse(set, x, sy, frame, jumping, jk, blink) {
    const lift = jumping ? Math.round(Math.sin(Math.PI * clamp(jk, 0, 1)) * 9) : 0;
    const sh = jumping ? 1 - Math.sin(Math.PI * clamp(jk, 0, 1)) * 0.35 : 1;
    const a = g.globalAlpha;
    g.globalAlpha = a * 0.33; ellipse(x, sy + 9, Math.max(2, Math.round(6 * sh)), Math.max(1, Math.round(3 * sh)), C.ink); g.globalAlpha = a;
    const img = jumping ? set.jump : frame < 0 ? set.stand : set.frames[frame];
    if (blink) { g.globalAlpha = a * 0.6; spr(set.white, x - img.width / 2, sy - img.height / 2 - lift); g.globalAlpha = a; return; }
    spr(img, x - img.width / 2, sy - img.height / 2 - lift);
  },
  drawObs(o, sy, ox, oy) {
    const x0 = this.laneL(o.lane) + ox; sy = Math.round(sy) + oy;
    const lw = this.laneW;
    switch (o.kind) {
      case 'rock': { const img = o.ice ? OB.rock2 : o.kum || this.reg.deco === 'desert' ? OB.sandRock : o.v ? OB.rock2 : (this.reg.deco === 'forest' ? OB.mossrock : OB.rock); g.globalAlpha = 0.3; ellipse(x0 + lw / 2, sy + 4, 7, 2, C.ink); g.globalAlpha = 1; spr(img, x0 + lw / 2 - img.width / 2, sy - img.height + 4); break; }
      case 'hurdle': { for (let i = 0; i < o.span; i++) { const img = hurdleSprite(lw - 4); spr(img, x0 + i * lw + 2, sy - 5); } break; }
      case 'log': { const img = logSprite(o.span * lw - 4); spr(img, x0 + 2, sy - 5); break; }
      case 'puddle': { const img = puddleSprite(lw - 4, o.mud); spr(img, x0 + 2, sy - 5); break; }
      case 'bale': { const img = OB.bale[Math.floor(o.t * 8) % 2]; spr(img, x0 + lw / 2 - img.width / 2, sy - 6); break; }
      case 'wolf': { let img = OB.wolf[Math.floor(o.t * 10) % 2]; if (o.vx < 0) img = flipCached(img); spr(img, o.x + ox - img.width / 2, sy - 4); break; }
      case 'coin': { const img = OB.coin[Math.floor(T * 8 + o.y * 0.05) % 4]; spr(img, x0 + lw / 2 - img.width / 2, sy - 4 + Math.round(Math.sin(T * 5 + o.y) * 1)); break; }
      case 'clover': { const img = OB.clover; g.globalAlpha = 0.35 + 0.2 * Math.sin(T * 6); circle(x0 + lw / 2, sy, 6, C.cyan); g.globalAlpha = 1; spr(img, x0 + lw / 2 - Math.floor(img.width / 2), sy - Math.floor(img.height / 2) - 1 + Math.round(Math.sin(T * 4 + o.y))); break; }
      case 'heart': { g.globalAlpha = 0.35 + 0.2 * Math.sin(T * 6); circle(x0 + lw / 2, sy, 6, C.salmon); g.globalAlpha = 1; spr(OB.heart, x0 + lw / 2 - 4, sy - 4); break; }
      case 'sugar': { g.globalAlpha = 0.4 + 0.25 * Math.sin(T * 7); circle(x0 + lw / 2, sy, 7, C.white); g.globalAlpha = 1; spr(ICONS.seker, x0 + lw / 2 - 4, sy - 4 + Math.round(Math.sin(T * 4))); break; }
      case 'fici': { const img = o.flash > 0 ? whiteOf(FOE_SPR.fici) : FOE_SPR.fici; g.globalAlpha = 0.3; ellipse(x0 + lw / 2, sy + 4, 6, 2, C.ink); g.globalAlpha = 1; spr(img, x0 + lw / 2 - 6, sy - 9); break; }
      case 'civi': { const blink = Math.floor(T * 4 + o.y) % 2 === 0; for (let i = 0; i < 3; i++) { const cx = Math.round(x0 + 6 + i * ((lw - 12) / 2)), cy = sy - 1; for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) pix(cx + dx, cy + dy, C.lgray); circle(cx, cy, 1, C.ink); pix(cx, cy, blink ? C.red : C.wine); } break; }
      case 'rgate': this.drawGate(o, sy, ox); break;
      case 'scan': this.drawScan(o, sy, ox); break;
      case 'toz': {
        const w = o.span * lw;
        for (let i = 0; i < w; i += 6) {
          const wob = Math.round(Math.sin(T * 12 + i * 0.7) * 1.5);
          g.globalAlpha = 0.6; ellipse(x0 + i + 3, sy - 2 + wob, 5, 3, C.blue);
          g.globalAlpha = 0.9; ellipse(x0 + i + 3, sy - 3 + wob, 4, 2, C.cyan);
        }
        g.globalAlpha = 0.5 + 0.5 * Math.sin(T * 20); hline(x0, sy - 3, w, C.white);
        g.globalAlpha = 1; hline(x0, sy + 2, w, C.navy);
        break;
      }
    }
  },
  drawFoe(f, sy, ox, oy) {
    const x = Math.round(f.x) + ox; sy = Math.round(sy) + oy;
    const wf = f.flash > 0;
    if (f.kind === 'karga') {
      const lift = 10;
      g.globalAlpha = 0.25; ellipse(x, sy + 4, 4, 1, C.ink); g.globalAlpha = 1;
      let img = FOE_SPR.karga[Math.floor(f.t * (f.stun > 0 ? 3 : 9)) % 2]; if (wf) img = whiteOf(img);
      spr(img, x - img.width / 2, sy - lift - img.height / 2);
    } else if (f.kind === 'domuz') {
      g.globalAlpha = 0.3; ellipse(x, sy + 6, 5, 2, C.ink); g.globalAlpha = 1;
      let img = FOE_SPR.domuz[Math.floor(f.t * 10) % 2]; if (wf) img = whiteOf(img);
      spr(img, x - img.width / 2, sy - img.height / 2);
      if (f.t < 0.9 && f.dist > this.P.dist && Math.floor(T * 8) % 2 === 0) textO('!', x, sy - 18, C.red, 'center');
      if (f.stun > 0) { pix(x - 3, sy - 9, C.yellow); pix(x + 3, sy - 10, C.yellow); }
    } else if (f.kind === 'kalkanli') {
      g.globalAlpha = 0.3; ellipse(x, sy + 7, 6, 2, C.ink); g.globalAlpha = 1;
      const down = f.stun > 0, img = FOE_SPR.kalkanli[down ? 1 : 0];
      const step = down ? 0 : (Math.floor(f.t * 4) % 2 ? -1 : 0);
      spr(wf ? whiteOf(img) : img, Math.round(x - img.width / 2), Math.round(sy - img.height / 2) + step + (f.laneT < 1 ? -1 : 0));
      if (down) { pix(x - 3, sy - 10, C.yellow); pix(x + 4, sy - 11, C.yellow); }
    } else {
      const set = f.kind === 'okcu' ? FOE_SPR.okcu : FOE_SPR.eskiya; const fr = Math.floor(this.time * 11 + f.ph) % 4;
      if (wf) { spr(set.white, x - set.white.width / 2, sy - set.white.height / 2); }
      else this.drawHorse(set, x, sy, fr, false, 0, f.stun > 0 && Math.floor(T * 10) % 2 === 0);
      if (f.kind === 'okcu') { spr(ICONS.target, x - 3, sy - 21); if (f.aim) { textO('!', x + 7, sy - 22, C.red, 'center'); } }
      else if (f.life > 0 && f.dist > this.P.dist) { rect(x - 1, sy - 17, 3, 3, C.ink); pix(x, sy - 16, C.red); }
    }
    if (f.burnT > 0 && rnd() < 0.5) pix(x + (rnd() - 0.5) * 8, sy - 6 - rnd() * 6, C.orange);
    if (f.hp < f.maxHp && f.hp > 0) { const bw = 12; rect(x - bw / 2 - 1, sy - 24, bw + 2, 3, C.ink); rect(x - bw / 2, sy - 23, Math.max(1, Math.round(bw * f.hp / f.maxHp)), 1, C.red); }
  },
  drawReis(Rz, sy, ox, oy) {
    const x = Math.round(Rz.x) + ox; sy = Math.round(sy) + oy;
    const set = FOE_SPR.reis, fr = Math.floor(this.time * 12) % 4;
    g.globalAlpha = 0.3 + 0.15 * Math.sin(T * 7); ellipse(x, sy, 11, 15, Rz.charge > 0.7 ? C.red : C.wine); g.globalAlpha = 1;
    if (Rz.flash > 0) spr(set.white, x - set.white.width / 2, sy - set.white.height / 2);
    else this.drawHorse(set, x, sy, fr, false, 0, Rz.stun > 0 && Math.floor(T * 10) % 2 === 0);
    // banner pole with a skull flag
    vline(x + 7, sy - 26, 14, C.dbrown); rect(x + 8, sy - 26, 6, 5, C.ink); rect(x + 9, sy - 25, 4, 3, C.wine); pix(x + 10, sy - 24, C.white);
    if (Rz.charge > 0.7 && Math.floor(T * 10) % 2 === 0) textO('!', x, sy - 30, C.red, 'center');
  },
  drawEnemyFire(ox, oy) {
    const P = this.P;
    const tele = (lane, fromSy) => {
      const x = this.laneX(lane), a = 0.35 + 0.25 * Math.sin(T * 24);
      g.globalAlpha = a;
      for (let y = Math.max(0, Math.round(fromSy)); y < this.pY + 6; y += 6) rect(x - 1 + this.offY(y) + ox, y + oy, 2, 4, C.red);
      g.globalAlpha = 1;
    };
    for (const f of this.foes) if (!f.dead && f.kind === 'okcu' && f.aim) tele(f.aimLane, this.sy(f.dist));
    if (this.reis && !this.reis.dead && this.reis.aimLanes) for (const l of this.reis.aimLanes) tele(l, this.sy(this.reis.dist));
    for (const r of this.rivals) {
      const t = r.duel && this.duel ? this.duel.tele : r.tele;
      if (t && t.kind === 'shot' && !r.done) tele(t.lane, this.sy(r.dist));
    }
    for (const s of this.eShots) {
      const sy = Math.round(this.sy(s.dist)) + oy; if (sy < -10 || sy > H + 10) continue;
      const x = Math.round(s.x) + this.offY(sy) + ox, img = PROJ.earrow;
      g.globalAlpha = 0.35; vline(x, sy - 9, 6, C.salmon); g.globalAlpha = 1;
      spr(img, x - Math.floor(img.width / 2), sy - Math.floor(img.height / 2));
    }
    void P;
  },
  drawShots(ox, oy) {
    for (const s of this.shots) {
      const sy = Math.round(this.sy(s.dist)) + oy;
      if (sy < -10 || sy > H + 10) continue;
      const x = Math.round(s.x) + this.offY(sy) + ox;
      const img = PROJ[s.kind] || PROJ.arrow;
      if (s.special) { g.globalAlpha = 0.35 + 0.2 * Math.sin(T * 30); circle(x, sy, s.big ? 6 : 4, C.gold); g.globalAlpha = 1; }
      if (s.kind === 'arrow' || s.kind === 'bolt') { g.globalAlpha = 0.35; vline(x, sy + 4, 6, s.burn ? C.orange : C.white); g.globalAlpha = 1; }
      if (s.kind === 'star') { g.globalAlpha = 0.4; circle(x, sy, 4, C.yellow); g.globalAlpha = 1; }
      if (s.kind === 'ball') { g.globalAlpha = 0.3; ellipse(x, sy + 8, 3, 1, C.ink); g.globalAlpha = 1; }
      spr(img, x - Math.floor(img.width / 2), sy - Math.floor(img.height / 2));
    }
  },
  drawWeather(ox, oy) {
    const wx = this.weather;
    if (wx === 'yagmur') {
      g.globalAlpha = 0.1; rect(0, 0, W, H, C.ddgreen); g.globalAlpha = 0.55;
      for (let i = 0; i < 46; i++) {
        const h = hash2(i, 31), h2 = hash2(i, 77);
        const x = ((h * (W + 40) + T * 60) % (W + 40)) - 20, y = ((h2 * (H + 20) + T * 330 * (0.8 + h * 0.4)) % (H + 20)) - 10;
        pix(x, y, C.green); pix(x - 1, y + 1, C.green); pix(x - 2, y + 2, C.dgreen);
      }
      g.globalAlpha = 1;
    }
    if (wx === 'sis' || this.fogT > 0) {
      const k = wx === 'sis' ? 1 : clamp(this.fogT / 0.6, 0, 1);
      g.globalAlpha = 0.1 * k; rect(0, 0, W, this.pY - 40, C.purple); g.globalAlpha = 1;
      const fogEnd = this.pY - 70;
      for (let y = 0; y < fogEnd; y += 4) { g.globalAlpha = clamp(0.95 - y / fogEnd * 0.95, 0, 0.92) * k; rect(0, y, W, 4, C.lgray); }
      g.globalAlpha = 0.18 * k;
      for (let i = 0; i < 5; i++) { const x = ((hash2(i, 9) * W + T * (8 + i * 3)) % (W + 80)) - 40, y = fogEnd - 10 + i * 18; ellipse(x, y, 30, 6, C.white); }
      g.globalAlpha = 1;
    } else if (wx === 'ruzgar' && this.wind.left > 0) {
      const dir = this.wind.dir, k = clamp(this.wind.left / 0.4, 0, 1) * clamp((2.2 - this.wind.left) / 0.3, 0, 1);
      g.globalAlpha = 0.45 * k;
      for (let i = 0; i < 22; i++) {
        const h = hash2(i, 5), x = (h * W) | 0, len = 6 + (hash2(i, 6) * 10 | 0);
        const y = dir > 0 ? ((hash2(i, 7) * H + T * 420) % H) : (H - ((hash2(i, 7) * H + T * 300) % H));
        rect(x, y, 1, len, C.white);
      }
      g.globalAlpha = 1;
    }
  },
  drawStorm(ox, oy) {
    const st = this.storm; const top = this.pY + 10 + st.gap * 0.9;
    if (top > H + 10) return;
    // stars spiralling into the hole
    for (let i = 0; i < 22; i++) {
      const k = (T * 0.5 + hash2(i, 77)) % 1, x0 = hash2(i, 3) * W;
      const x = x0 + Math.sin(k * 9 + i) * 12 * (1 - k), y = top - 46 + k * 52;
      g.globalAlpha = k; pix(x + ox, y + oy, i % 3 ? C.white : C.magenta); g.globalAlpha = 1;
    }
    // swirling event horizon
    for (let x = -6; x < W + 8; x += 8) {
      const wob = Math.sin(T * 4 + x * 0.35) * 3, r = 7 + Math.round(Math.sin(T * 6 + x) * 1.5);
      g.globalAlpha = 0.8; circle(x + ox, top + wob + oy, r + 2, C.magenta);
      g.globalAlpha = 1; circle(x + ox, top + 3 + wob + oy, r, C.purple); circle(x + 4 + ox, top + 7 + wob + oy, r, C.plum);
    }
    rect(0, top + 8 + oy, W, H, C.ink);
    for (let i = 0; i < 12; i++) { const a = T * 2.4 + i * 0.52, x = W / 2 + Math.cos(a) * W * 0.46, y = top + 22 + Math.sin(a) * 9; pix(x + ox, y + oy, i % 2 ? C.purple : C.magenta); }
    if (st.gap < 40 && Math.floor(T * 5) % 2 === 0) textO('KARA DELİK YAKLAŞIYOR!', W / 2, this.pY + 30, C.magenta, 'center');
  },
  drawBolts(ox, oy) {
    for (const b of this.bolts) {
      const lw = this.laneW, xc = this.laneL(b.lane) + lw / 2 + ox;
      if (b.strike > 0) {
        g.globalAlpha = 0.8;
        for (let y = 0; y < this.pY + 12; y += 6) { const o = this.offY(y); rect(xc - 2 + o, y, 4, 6, C.white); rect(xc - 1 + o, y, 2, 6, b.ice ? C.cyan : C.yellow); }
        g.globalAlpha = 1;
        burst(xc, this.pY + 10, 2, [C.yellow, C.white], 60, 0.3);
      } else {
        const on = Math.floor(T * 12) % 2 === 0;
        g.globalAlpha = on ? 0.35 : 0.18;
        for (let y = this.pY - 70; y < this.pY + 20; y += 5) rect(xc - lw / 2 + 1 + this.offY(y), y + oy, lw - 2, 5, b.ice ? C.sky : C.red);
        g.globalAlpha = 1;
        if (b.ice) { const ix = xc + this.offY(this.pY - 80), iy = this.pY - 84 + oy + Math.round((1 - b.t) * 6); spr(OB.iceShard, ix - 1, iy); spr(OB.flake, ix - 1, iy - 5); }
        else spr(ICONS.bolt, xc - 3 + this.offY(this.pY - 80), this.pY - 80 + oy);
      }
    }
  },
  etapLabel() {
    if (this.tut) return 'ISINMA TURU';
    const info = ETAP_INFO[this.type];
    const full = info.name + ' · ' + this.reg.name.split(' ')[0];
    return textWidth(full) <= W - 80 ? full : (info.tiny || info.name);
  },
  drawHUD() {
    const S = this.S, P = this.P, top = SAFE.t + 4;
    let hx = 4 + SAFE.l;
    for (let i = 0; i < S.maxHp; i++) {
      const lost = this.heartLost && this.heartLost.i === i;
      spr(i < RUN.hp ? ICONS.heart : ICONS.heartE, hx, top);
      // the heart you just lost pops off and fades, so the damage reads even in a busy moment
      if (lost) { const k = 1 - this.heartLost.t / 0.8; g.globalAlpha = 1 - k; spr(ICONS.heart, hx, top - Math.round(k * 8)); g.globalAlpha = 1; if (Math.floor(T * 16) % 2 === 0) ring(hx + 4, top + 4, 5 + Math.round(k * 4), C.red); }
      hx += 9;
    }
    for (let i = 0; i < P.shield; i++) { spr(ICONS.heartG, hx, top); hx += 9; }
    // second row: weapon (+charge) and chaos
    let x2 = 4 + SAFE.l;
    const w = WEAPONS[S.weapon] || WEAPONS.yay, wic = ICONS[w.icon];
    if (wic) {
      spr(wic, x2, top + 10);
      x2 += wic.width + 2;
      if (w.fire === 'bar') { for (let i = 0; i < S.barNeed; i++) rect(x2 + i * 4, top + 14, 3, 3, i < this.topCharge ? C.orange : C.slate); x2 += S.barNeed * 4 + 2; }
      if (RUN.mods && RUN.mods.length) { spr(ICONS.hammer, x2, top + 10); x2 += 8; }
    }
    const cur = RUN.chaos.filter(c => c.left > 0);
    if (cur.length) { spr(ICONS.swirl, x2 + 2, top + 10); textO(String(Math.max(...cur.map(c => c.left))), x2 + 12, top + 10, C.magenta); }
    const px = W - SAFE.r - 18;
    iconBtn('pause', px, top - 1, 'pauseO', () => this.togglePause(), 14);
    const cs = String(RUN.coins); const cw = textWidth(cs) + 9;
    spr(ICONS.coin0, px - cw - 6, top + 1); textO(cs, px - cw + 3, top, C.yellow);
    const cx = W / 2;
    if (this.type === 'boss') {
      const B = this.boss; const bw = Math.min(110, W - 110), bx = Math.round(cx - bw / 2), by = top + 13;
      textO(B.def.name, cx, top, C.salmon, 'center');
      bar(bx, by, bw, 5, B.gap / 100, B.gap > 70 ? C.green : B.gap > 30 ? C.gold : C.red);
      for (const th of [50, 75]) vline(bx + Math.round(bw * th / 100), by - 1, 7, C.ink);
      spr(ICONS.crown, bx + bw + 3, by - 1);
      textO('FARK', bx - 2, by - 2, C.lgray, 'right');
      for (let i = 0; i < 3; i++) rect(bx + i * 6, by + 8, 4, 3, i < B.phase ? B.def.color : C.slate);
      if (B.tired > 0) textO('YORGUN: X2', bx + bw, by + 7, C.yellow, 'right');
    } else {
      textO(this.etapLabel(), cx, top, this.elite ? C.salmon : C.white, 'center');
      const bw = Math.min(90, W - 120), bx = Math.round(cx - bw / 2);
      bar(bx, top + 12, bw, 3, P.dist / this.length, this.finalStretch ? C.yellow : C.green);
      if (!this.tut) vline(bx + Math.round(bw * 0.8), top + 10, 7, C.yellow);
      for (const b of this.bends || []) { const a = Math.round(bw * b.y0 / this.length), c = Math.round(bw * b.y1 / this.length); hline(bx + a, top + 16, Math.max(1, c - a), C.orange); }
      const wic2 = WEATHERS[this.weather] && WEATHERS[this.weather].icon;
      if (wic2 && ICONS[wic2]) spr(ICONS[wic2], bx - ICONS[wic2].width - 4, top + 10);
      if (this.elite) spr(ICONS.skull, bx + bw + 4, top + 10);
      if (this.type === 'sprint' && this.rivals.length) {
        let rank = 1; for (const r of this.rivals) if (r.done || r.dist > P.dist) rank++;
        const ok = rank <= this.passRank();
        textO(rank + '/' + (this.rivals.length + 1), cx, top + 19, ok ? C.yellow : C.red, 'center', 2);
      } else if (this.type === 'duello' && this.duel) {
        const r = this.duel.r, gap = Math.round((P.dist - Math.min(r.dist, this.length)) / 10), lead = gap >= 0 && !(r.done && this.state === 'run');
        rect(bx + Math.round(bw * clamp(r.dist / this.length, 0, 1)) - 1, top + 9, 2, 8, C.salmon);
        if (this.result && this.state !== 'run') textO(this.result.ok ? 'KAZANDIN' : 'KAYBETTİN', cx, top + 20, this.result.ok ? C.green : C.red, 'center', 2);
        else {
          textO((gap > 0 ? '+' : '') + gap, cx, top + 19, lead ? C.green : C.red, 'center', 2);
          textO(lead ? 'ÖNDESİN' : 'GERİDESİN', cx, top + 34, lead ? C.green : C.salmon, 'center');
        }
      } else if (this.type === 'baskin') {
        const s = this.kills + '/' + this.goal, ok = this.kills >= this.goal, w2 = textWidth(s, 2);
        spr(ICONS.target, cx - w2 / 2 - 10, top + 23);
        textO(s, cx + 4, top + 19, ok ? C.green : C.white, 'center', 2);
      }
    }
    if (this.reis && !this.reis.dead) {
      const Rz = this.reis, bw = Math.min(100, W - 90), bx = Math.round(cx - bw / 2), by = top + 49;
      textO('KORSAN KAPTANI', cx, by - 9, C.red, 'center');
      bar(bx, by, bw, 3, Rz.hp / Rz.maxHp, C.red);
    }
    if (this.bannerT > 0 && this.banner) {
      const k = clamp(this.bannerT / 0.3, 0, 1) * clamp((1.6 - this.bannerT) / 0.15, 0, 1);
      g.globalAlpha = k; textO(this.banner.txt, cx, Math.round(H * 0.24), this.banner.col, 'center', 2); g.globalAlpha = 1;
    }
    // bottom: note strip, breath, combo, ability, hamle
    const ry = H - SAFE.b - 24, rx = W / 2;
    this.drawNoteStrip(rx, ry);
    if (this.comboBreak > 0 && this.combo < 3) {
      g.globalAlpha = clamp(this.comboBreak * 2, 0, 1);
      textO(String(this.brokenCombo), rx, ry - 46 + Math.round((0.9 - this.comboBreak) * 10), C.red, 'center', 2);
      textO('KOMBO KIRILDI', rx, ry - 31, C.salmon, 'center'); g.globalAlpha = 1;
    } else if (this.combo > 0) {
      textO(String(this.combo), rx, ry - 46 - (this.comboPop > 0 ? 1 : 0), this.comboPop > 0.08 ? C.white : this.combo >= 20 ? C.gold : this.combo >= 10 ? C.yellow : C.white, 'center', 2);
      textO('KOMBO', rx, ry - 31, C.lgray, 'center');
      if (this.combo >= 10) spr(ICONS.flame, rx + textWidth(String(this.combo), 2) / 2 + 3, ry - 44);
    }
    const showNefes = !this.tut || this.tut.step >= 5;
    if (showNefes) {
      const bw = 60, bx = Math.round(rx - bw / 2), by = ry - 18;
      const cost = S.hamleCost * (RUN.runStyle === 'onde' && P.dist < this.length * 0.5 ? 0.7 : 1);
      bar(bx, by, bw, 3, this.nefes / 100, this.kick > 0 ? C.sky : this.nefes >= cost ? C.cyan : C.gray);
      vline(bx + Math.round(bw * Math.min(1, cost / 100)), by - 1, 5, C.white);
    }
    if (this.judgeT > 0) { g.globalAlpha = clamp(this.judgeT * 3, 0, 1); textO(this.judgeStr, rx, ry + 11 - (0.55 - this.judgeT) * 10, this.judgeCol, 'center'); g.globalAlpha = 1; }
    const left = META.settings.left;
    const abx = left ? 22 + SAFE.l : W - 22 - SAFE.r, aby = H - SAFE.b - 26;
    const full = this.bond >= 100;
    circle(abx, aby, 13, C.ink); circle(abx, aby, 12, full ? C.gold : C.slate);
    const ang = this.bond / 100 * Math.PI * 2;
    for (let a = 0; a < ang; a += 0.12) pix(abx + Math.round(Math.sin(a) * 11), aby - Math.round(Math.cos(a) * 11), full ? C.yellow : C.sky);
    spr(PEOPLE.deniz || PEOPLE.ayse, abx - 5, aby - 8);
    const cg = Object.keys(RUN.boons).map(id => BOON_BY_ID[id]).find(b => b && b.slot === 'cagri');
    if (cg) { circle(abx + 10, aby - 10, 3, C.ink); circle(abx + 10, aby - 10, 2, SPIRITS[cg.sp].color); }
    if (full) { g.globalAlpha = 0.5 + 0.5 * Math.sin(T * 8); ring(abx, aby, 15, C.yellow); g.globalAlpha = 1; textO('BAS!', abx, aby - 24, C.yellow, 'center'); }
    UI.add('ability', abx - 16, aby - 16, 32, 32, () => this.useAbility(), { onDown: true });
    if (showNefes) {
      const hx2 = left ? W - 22 - SAFE.r : 22 + SAFE.l, hy = aby;
      const cost = S.hamleCost * (RUN.runStyle === 'onde' && P.dist < this.length * 0.5 ? 0.7 : 1);
      const ready = this.nefes >= cost && P.hamleCd <= 0;
      circle(hx2, hy, 12, C.ink); circle(hx2, hy, 11, P.hamleT > 0 ? C.white : ready ? C.blue : C.slate);
      const fr = Math.min(1, this.nefes / cost);
      for (let a = 0; a < fr * Math.PI * 2; a += 0.14) pix(hx2 + Math.round(Math.sin(a) * 10), hy - Math.round(Math.cos(a) * 10), ready ? C.cyan : C.gray);
      const col = ready ? C.white : C.dgray;
      for (let k = 0; k < 2; k++) for (let i = 0; i < 4; i++) { pix(hx2 - i, hy - 3 + k * 4 + i, col); pix(hx2 + i, hy - 3 + k * 4 + i, col); }
      const hb = Object.keys(RUN.boons).map(id => BOON_BY_ID[id]).find(b => b && b.slot === 'hamle');
      if (hb) { circle(hx2 + 9, hy - 9, 3, C.ink); circle(hx2 + 9, hy - 9, 2, SPIRITS[hb.sp].color); }
      UI.add('hamle', hx2 - 15, hy - 15, 30, 30, () => this.hamle(), { onDown: true });
    }
    this.drawShowHUD();
  },
  drawNoteStrip(rx, ry) {
    const half = Math.max(30, Math.min(64, Math.floor(W / 2) - 40)), look = 2, ppb = half / look;
    g.globalAlpha = 0.55; rect(rx - half, ry - 5, half * 2, 10, C.ink); g.globalAlpha = 1;
    hline(rx - half, ry - 6, half * 2, C.slate); hline(rx - half, ry + 5, half * 2, C.slate);
    if (this.clockOn && (this.state === 'run' || this.state === 'intro' || this.state === 'finish')) {
      const bp = Beat.pos(now());
      // faint beat grid so rests read as "no note here"
      for (let b = Math.ceil(bp); b <= bp + look; b++) {
        const ch = this.chart[b];
        if (ch === '-' || ch === '_') { const d = (b - bp) * ppb; g.globalAlpha = 0.5; pix(rx - d, ry, C.dgray); pix(rx + d, ry, C.dgray); g.globalAlpha = 1; }
      }
      if (this.hold) {
        const d = Math.max(0, this.hold.end - bp) * ppb;
        g.globalAlpha = 0.85; rect(rx - d, ry - 2, d * 2, 4, C.cyan); g.globalAlpha = 1;
      }
      for (const tg of this.targets) {
        const dt = tg.t - bp;
        if (tg.done) {
          if (tg.hit && T - tg.hitAt < 0.18) { g.globalAlpha = 1 - (T - tg.hitAt) / 0.18; ring(rx, ry, 10 + Math.round((T - tg.hitAt) * 40), NOTE_COLS[tg.kind]); g.globalAlpha = 1; }
          continue;
        }
        if (dt < -0.35 || dt > look) continue;
        const d = Math.max(0, dt) * ppb;
        if (tg.kind === 'h') { const tl = Math.min(half, d + tg.len * ppb); g.globalAlpha = 0.5; rect(rx + d, ry - 2, tl - d, 4, C.cyan); rect(rx - tl, ry - 2, tl - d, 4, C.cyan); g.globalAlpha = 1; }
        for (const sd of [-1, 1]) this.drawNote(tg.kind, rx + sd * d, ry, dt < 0);
      }
    }
    circle(rx, ry, 9, C.ink); circle(rx, ry, 8, this.shoeFlash > 0 ? C.white : C.slate);
    const sh = ICONS.shoe; spr(this.shoeFlash > 0.5 ? tinted('shoe', C.yellow) : sh, rx - sh.width / 2, ry - sh.height / 2);
  },
  drawNote(kind, x, y, late) {
    x = Math.round(x);
    const col = late ? C.gray : NOTE_COLS[kind] || C.white;
    if (kind === 'a') { rect(x - 1, y - 5, 3, 11, C.ink); for (let i = 0; i < 4; i++) hline(x - i, y - 3 + i, i * 2 + 1, col); for (let i = 0; i < 3; i++) hline(x - 2 + i, y + 1 + i, 5 - i * 2, col); }
    else if (kind === 'h') { rect(x - 2, y - 5, 5, 11, C.ink); rect(x - 1, y - 4, 3, 9, col); }
    else if (kind === 'd' || kind === 'd2') { rect(x - 1, y - 4, 3, 9, C.ink); vline(x, y - 3, 7, col); }
    else { rect(x - 1, y - 5, 3, 11, C.ink); vline(x, y - 4, 9, col); }
  },
  // finish card: what you achieved this etap in one calm panel (instead of a pile of floating texts)
  drawMedal() {
    if (this.state !== 'finish' && this.state !== 'gone') return;
    const m = this.medal, k = clamp(this.medalT / 0.35, 0, 1), img = MEDAL.big[m];
    const top = Math.round(Math.max(SAFE.t + 44, H * 0.2) + (1 - Ease.outBack(k)) * 24);
    const stat = [];
    if (this.type === 'sprint' && this.result && this.result.rank) stat.push('SIRA ' + this.result.rank + '/' + (this.rivals.length + 1));
    else if (this.type === 'baskin') stat.push('DÜŞMAN ' + this.kills + '/' + this.goal);
    else if (this.type === 'duello' && this.duel) stat.push('FARK +' + Math.max(0, Math.round((this.P.dist - Math.min(this.duel.r.dist, this.length)) / 10)));
    stat.push('HASAR ' + this.damaged);
    let line2 = 'MÜKEMMEL ' + (this.etapPerfects || 0) + ' · EN İYİ KOMBO ' + (this.etapMax || 0);
    if (this.tut) { stat.length = 0; stat.push('← → ŞERİT · ↑ SIÇRA · ↓ HAMLE'); line2 = 'NOTADA DOKUN: HIZ, KOMBO VE ATEŞ'; }
    const h = 30 + img.height + 34 + (this.finishBonus ? 10 : 0);
    g.globalAlpha = 0.55 * k; rect(0, top, W, h, C.ink); g.globalAlpha = k;
    hline(0, top, W, MEDAL_COLS[m]); hline(0, top + h - 1, W, MEDAL_COLS[m]);
    if (this.finishMsg) textO(this.finishMsg, W / 2, top + 5, C.gold, 'center', textWidth(this.finishMsg, 2) <= W - 8 ? 2 : 1);
    const my = top + 25;
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + T * 1.5; pix(W / 2 + Math.cos(a) * 18, my + 9 + Math.sin(a) * 18, MEDAL_COLS[m]); }
    spr(img, W / 2 - img.width / 2, my);
    let y = my + img.height + 3;
    textO(MEDAL_NAMES[m] + (m !== 'b' ? '  ' + (m === 'g' ? '+3' : '+1') + ' KRİSTAL' : ''), W / 2, y, MEDAL_COLS[m], 'center'); y += 11;
    text(stat.join(' · '), W / 2, y, this.damaged ? C.lgray : C.green, 'center'); y += 10;
    text(line2, W / 2, y, C.lgray, 'center'); y += 10;
    if (this.finishBonus) text(this.finishBonus, W / 2, y, C.yellow, 'center');
    g.globalAlpha = 1;
  },
  drawTut() {
    const tu = this.tut;
    let msg = null, arrow = null;
    if (tu.step === 0) msg = 'YILDIZ\'I SEN SÜRÜYORSUN, DENİZ!';
    else if (tu.step === 1 && this.timeScale < 1) { msg = '← → KAYDIR: ŞERİT DEĞİŞTİR'; arrow = 'h'; }
    else if (tu.step === 2 && this.timeScale < 1) { msg = '↑ YUKARI KAYDIR: SIÇRA'; arrow = 'v'; }
    else if (tu.step === 3) { msg = 'İŞARETLER ORTADA BULUŞUNCA DOKUN! (' + Math.min(4, tu.hits) + '/4)'; arrow = 'r'; }
    else if (tu.step === 4) { const left = this.foes.filter(f => f.tut && !f.dead).length; msg = 'RİTİMLE DOKUN, IŞIK YAYI ATEŞ ETSİN! (' + (3 - left) + '/3)'; arrow = 'r'; }
    else if (tu.step === 5 && tu.t > 1.4) { msg = '↓ AŞAĞI KAYDIR YA DA ' + (META.settings.left ? 'SAĞ' : 'SOL') + ' ALTTAKİ DÜĞMEYE BAS: HAMLE!'; arrow = 'd'; }
    if (tu.msgT > 0 && tu.msg) msg = tu.msg;
    if (!msg) return;
    const lines = wrapText(msg, W - 30);
    const w = Math.min(W - 12, Math.max(...lines.map(l => textWidth(l))) + 16), x = Math.round(W / 2 - w / 2), y = SAFE.t + 44, h = lines.length * 9 + 8;
    panel(x, y, w, h); lines.forEach((ln, i) => text(ln, W / 2, y + 4 + i * 9, C.yellow, 'center'));
    const P = this.P, wob = Math.round(Math.sin(T * 8) * 2);
    if (arrow === 'h') { textO('←', P.x - 18 - wob, this.pY - 6, C.yellow, 'center', 2); textO('→', P.x + 18 + wob, this.pY - 6, C.yellow, 'center', 2); }
    if (arrow === 'v') textO('↑', P.x, this.pY - 34 - wob, C.yellow, 'center', 2);
    if (arrow === 'd') {
      textO('↓', P.x, this.pY + 22 + wob, C.yellow, 'center', 2);
      const hx = META.settings.left ? W - 22 - SAFE.r : 22 + SAFE.l, hy = H - SAFE.b - 26;
      g.globalAlpha = 0.6 + 0.4 * Math.sin(T * 8); ring(hx, hy, 15 + Math.abs(wob), C.yellow); g.globalAlpha = 1;
    }
    if (arrow === 'r') { const ry = H - SAFE.b - 24; textO('↓', W / 2, ry - 26 + wob, C.yellow, 'center', 2); }
  },
  drawIntro() {
    if (this.tipKey) return this.drawTip();
    if (this.betOffer) return this.drawBet();
    const k = clamp(this.stateT / 0.3, 0, 1);
    const title = this.type === 'boss' ? this.boss.def.name : this.tut ? 'ISINMA TURU' : ETAP_INFO[this.type].name;
    let sub = this.type === 'boss' ? this.boss.def.title : this.tut ? 'TEMEL HAREKETLER' : ETAP_INFO[this.type].short;
    if (this.type === 'baskin') sub = this.goal + ' DÜŞMAN VUR';
    if (this.type === 'sprint' && !this.tut) sub = 'İLK ' + this.passRank() + '\'E GİR · ' + (this.rivals.length + 1) + ' YARIŞÇI';
    if (this.duel) sub = this.duel.def.name + ' İLE BİRE BİR';
    const tags = [];
    if (this.duel && this.duel.info.trick) tags.push([this.duel.info.trick, C.salmon]);
    if (this.elite) tags.push(['ZORLU · ÖDÜL X2', C.salmon]);
    if (this.weather !== 'acik') tags.push([WEATHERS[this.weather].name, C.sky]);
    if (this.bends && this.bends.length) tags.push([this.bends.length + ' VİRAJ', C.orange]);
    if (RUN.runStyle !== 'dengeli' && this.type !== 'boss' && !this.tut) tags.push([RUN_STYLES[RUN.runStyle].name, C.green]);
    const bh = 44 + tags.length * 10;
    g.globalAlpha = 0.5 * k; rect(0, H * 0.3, W, bh, C.ink); g.globalAlpha = 1;
    textO(title, W / 2, H * 0.3 + 6, this.type === 'boss' ? C.salmon : C.yellow, 'center', 2);
    textO(sub, W / 2, H * 0.3 + 28, C.white, 'center');
    tags.forEach((t, i) => textO(t[0], W / 2, H * 0.3 + 40 + i * 10, t[1], 'center'));
    const left = Beat.t0 - now();
    if (this.clockOn && left < 0.5) textO('KOŞ!', W / 2, H * 0.3 + bh + 8, C.green, 'center', 2);
  },
  tipTitle(key) { return ETAP_INFO[key] ? ETAP_INFO[key].name : TIP_TITLES[key] ? TIP_TITLES[key] : WEATHERS[key] ? WEATHERS[key].name : ''; },
  tipIcon(key) {
    if (ETAP_INFO[key]) return ICONS[ETAP_INFO[key].icon];
    if (key === 'zorlu') return ICONS.skull;
    if (key === 'reyting') return ICONS.tv;
    if (key === 'rgate') return ICONS.door;
    if (key === 'scan') return ICONS.bolt;
    if (WEATHERS[key]) return ICONS[WEATHERS[key].icon];
    return null;
  },
  drawTip() {
    const pw = Math.min(W - 20, 214);
    const blocks = this.tips.map(key => ({ key, title: this.tipTitle(key), ic: this.tipIcon(key), lines: wrapText(ETAP_TIPS[key], pw - 20) }));
    const ph = 24 + blocks.reduce((a, b) => a + 16 + b.lines.length * 9 + 6, 0) + 14;
    const px = Math.round(W / 2 - pw / 2), py = Math.round(Math.max(SAFE.t + 30, H * 0.42 - ph / 2));
    g.globalAlpha = 0.45; rect(0, 0, W, H, C.ink); g.globalAlpha = 1;
    panel(px, py, pw, ph, 'YENİ!', C.yellow);
    let y = py + 20;
    for (const b of blocks) {
      if (b.ic) spr(b.ic, W / 2 - textWidth(b.title) / 2 - b.ic.width - 4, y + 1);
      if (b.key.startsWith('nota_')) this.drawNote(b.key === 'nota_a' ? 'a' : b.key === 'nota_d' ? 'd' : 'h', W / 2 - textWidth(b.title) / 2 - 8, y + 4, false);
      if (b.key === 'hamle') { const hx = Math.round(W / 2 - textWidth(b.title) / 2 - 9), hy = y + 2; for (let k = 0; k < 2; k++) for (let i = 0; i < 4; i++) { pix(hx - i, hy + k * 4 + i, C.cyan); pix(hx + i, hy + k * 4 + i, C.cyan); } }
      text(b.title, W / 2, y, C.white, 'center');
      b.lines.forEach((ln, i) => text(ln, W / 2, y + 13 + i * 9, C.lgray, 'center'));
      y += 16 + b.lines.length * 9 + 6;
    }
    g.globalAlpha = 0.6 + 0.4 * Math.sin(T * 6); textO('DOKUN VE BAŞLA', W / 2, py + ph - 14, C.green, 'center'); g.globalAlpha = 1;
  },
  drawDead() {
    const k = clamp(this.stateT / 0.5, 0, 1);
    g.globalAlpha = 0.5 * k; rect(0, 0, W, H, C.ink); g.globalAlpha = 1;
    textO('YORGUN DÜŞTÜN', W / 2, H * 0.36, C.salmon, 'center', 2);
  },
  drawPause() {
    UI.block(0, 0, W, H, null);
    g.globalAlpha = 0.6; rect(0, 0, W, H, C.ink); g.globalAlpha = 1;
    const pw = Math.min(W - 24, 170), ph = 152, px = Math.round(W / 2 - pw / 2), py = Math.round(H / 2 - ph / 2);
    panel(px, py, pw, ph, 'MOLA');
    button('p_resume', px + 10, py + 22, pw - 20, 18, 'DEVAM ET', () => this.togglePause());
    button('p_boons', px + 10, py + 46, pw - 20, 16, 'GÜÇLERİM (' + (Object.keys(RUN.boons).length + (RUN.mods ? RUN.mods.length : 0)) + ')', () => { this.showBoons = true; }, { kind: 'blue' });
    button('p_music', px + 10, py + 66, pw - 20, 16, 'MÜZİK: ' + (META.settings.music ? 'AÇIK' : 'KAPALI'), () => { META.settings.music = !META.settings.music; Sound.applySettings(); saveMeta(); }, { kind: 'secondary' });
    button('p_sfx', px + 10, py + 86, pw - 20, 16, 'EFEKTLER: ' + (META.settings.sfx ? 'AÇIK' : 'KAPALI'), () => { META.settings.sfx = !META.settings.sfx; Sound.applySettings(); saveMeta(); }, { kind: 'secondary' });
    button('p_quit', px + 10, py + 114, pw - 20, 18, this.confirmQuit ? 'EMİN MİSİN? TEKRAR BAS' : 'KOŞUYU BIRAK', () => {
      if (!this.confirmQuit) { this.confirmQuit = true; return; }
      this.paused = false; this.state = 'gone'; Music.fever = false; RUN.diedIn = { type: 'quit', region: RUN.region, etap: RUN.etap }; go('results', { won: false, quit: true });
    }, { kind: 'red' });
    if (this.showBoons) drawBoonList(() => { this.showBoons = false; });
  }
});
const FLIP_CACHE = new Map();
function flipCached(img) { let f = FLIP_CACHE.get(img); if (!f) { f = flipSprite(img); FLIP_CACHE.set(img, f); } return f; }
const TH_CACHE = new Map();
function tintedHorse(set, col) { const k = col; let m = TH_CACHE.get(set); if (!m) { m = {}; TH_CACHE.set(set, m); } return m[k] || (m[k] = tintSprite(set.frames[0], col)); }
