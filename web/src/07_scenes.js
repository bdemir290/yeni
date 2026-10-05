// ================= TITLE =================
SCENES.title = {
  enter() { this.t = 0; this.scroll = 0; this.set = heroHorse(null); this.riv = [getMount('r3'), getMount('r1')]; Music.stop(); },
  update(dt) { this.t += dt; this.scroll += dt * 120; updateFX(dt); },
  start() {
    Sound.unlock();
    if (META.runSave) return;
    if (!META.introDone) {
      Dialog.start(INTRO, () => { META.introDone = true; saveMeta(); newRun(); go('run', firstNode()); });
      return;
    }
    go('farm', {});
  },
  tap() { if (!META.runSave && !Dialog.active()) this.start(); },
  key(k) { if (k === 'Enter') { this.tap(); return true; } return false; },
  draw() {
    rect(0, 0, W, H, C.ink);
    // starfield drifting past
    for (let i = 0; i < 70; i++) {
      const h = hash2(i, 13), sp = 10 + h * 40, x = (hash2(i, 14) * W) | 0, y = ((hash2(i, 15) * H + this.scroll * sp / 120) % H) | 0;
      pix(x, y, i % 7 === 0 ? C.cyan : i % 5 === 0 ? C.magenta : h > 0.5 ? C.white : C.slate);
    }
    // a ringed planet peeking in from the right and a far Earth on the left
    const px = W - 18, py = Math.round(H * 0.3);
    const ringArc = front => { for (let a = 0; a < Math.PI * 2; a += 0.03) { const sn = Math.sin(a); if (front ? sn < 0 : sn >= 0) continue; const x = Math.round(px + Math.cos(a) * 26), y = Math.round(py + sn * 5); pix(x, y, C.tan); pix(x, y + 1, C.orange0); } };
    ringArc(false);
    circle(px, py, 16, C.ink); circle(px, py, 15, C.purple); circle(px - 3, py - 3, 11, C.magenta); circle(px - 7, py - 7, 4, C.salmon);
    for (let i = -12; i <= 12; i += 6) hline(px - 14, py + i, 28, 'rgba(24,20,37,0.18)');
    ringArc(true);
    const ex = 14, ey = Math.round(H * 0.5);
    circle(ex, ey, 6, C.ink); circle(ex, ey, 5, C.blue); rect(ex - 3, ey - 2, 3, 2, C.green); rect(ex + 1, ey + 1, 2, 2, C.green); pix(ex - 2, ey - 4, C.white);
    // the neon racetrack
    const tw = Math.min(124, W - 66), tx = Math.round(W / 2 - tw / 2);
    g.globalAlpha = 0.8; rect(tx - 2, 0, tw + 4, H, C.navy); g.globalAlpha = 1;
    rect(tx - 4, 0, 2, H, C.cyan); rect(tx + tw + 2, 0, 2, H, C.cyan);
    const off = this.scroll % 16;
    g.globalAlpha = 0.5; for (let i = 1; i < 5; i++) for (let y = -16 + off; y < H; y += 16) rect(tx + Math.round(i * tw / 5), y, 1, 7, C.slate); g.globalAlpha = 1;
    for (let y = -24 + (this.scroll % 24); y < H; y += 24) { pix(tx - 3, y, C.white); pix(tx + tw + 3, y + 12, C.white); }
    const fr = Math.floor(this.t * 10) % 4;
    const hy = H * 0.68;
    // a watching eyeball and a light arrow
    const ax = ((this.t * 70) % (W + 60)) - 30;
    spr(FOE_SPR.karga[Math.floor(this.t * 8) % 2], ax, hy - 84 + Math.sin(this.t * 3) * 6);
    if (Math.floor(this.t * 2) % 3 === 0) spr(PROJ.arrow, W / 2 - 1, hy - 26 - ((this.t * 300) % 60));
    g.globalAlpha = 0.33; ellipse(W / 2, hy + 9, 6, 3, C.cyan); g.globalAlpha = 1;
    sprC(this.set.frames[fr], W / 2, hy);
    const r1 = this.riv[0], r2 = this.riv[1];
    sprC(r1.frames[(fr + 1) % 4], W / 2 - tw / 5 * 1.5, hy + 30 + Math.sin(this.t) * 6);
    sprC(r2.frames[(fr + 2) % 4], W / 2 + tw / 5 * 1.5, hy + 22 + Math.cos(this.t * 0.8) * 6);
    const sc = W >= 176 ? 4 : 3;
    const ly = Math.round(H * 0.17);
    g.globalAlpha = 0.65; rect(0, ly - 10, W, 70, C.ink); g.globalAlpha = 1;
    for (const [dx, dy] of [[-sc, 0], [sc, 0], [0, -sc], [0, sc * 2], [-sc, sc], [sc, sc]]) text('DÖRTNALA', W / 2 + dx, ly + dy, C.ink, 'center', sc);
    text('DÖRTNALA', W / 2, ly + sc, C.rust, 'center', sc);
    text('DÖRTNALA', W / 2, ly, C.yellow, 'center', sc);
    g.globalAlpha = 0.5; text('DÖRTNALA', W / 2, ly - Math.round(sc / 2), C.white, 'center', sc); g.globalAlpha = 1;
    text('DÖRTNALA', W / 2, ly, C.yellow, 'center', sc);
    textO('GALAKSİ KUPASI', W / 2, ly + 38, C.cyan, 'center');
    text('UZAYIN EN HIZLI ATI SENİNKİ', W / 2, ly + 50, C.lgray, 'center');
    if (META.runSave) {
      const bw = Math.min(150, W - 30), bx = Math.round(W / 2 - bw / 2);
      button('t_cont', bx, H * 0.42, bw, 20, 'KOŞUYA DEVAM ET', () => { restoreRun(); go('doors'); });
      button('t_farm', bx, H * 0.42 + 26, bw, 18, 'KOŞUYU BIRAK', () => { META.runSave = null; saveMeta(); go('farm', {}); }, { kind: 'secondary' });
    } else if (!Dialog.active() && Math.floor(this.t * 2) % 2 === 0) textO('BAŞLAMAK İÇİN DOKUN', W / 2, H * 0.47, C.white, 'center');
    text('V5.3', W - SAFE.r - 4, H - SAFE.b - 10, C.slate, 'right');
  }
};

// ================= DOORS =================
function bottomBar(by, extraFn) {
  rrect(5, by - 2, W - 10, 28, C.ink); rrect(6, by - 1, W - 12, 26, C.navy);
  const S = computeStats(RUN);
  let hx = 10;
  for (let i = 0; i < S.maxHp; i++) { spr(i < RUN.hp ? ICONS.heart : ICONS.heartE, hx, by + 2); hx += 9; }
  let x = 10;
  x += iconNum('coin0', RUN.coins, x, by + 13, C.yellow) + 6;
  x += iconNum('clover', RUN.yonca, x, by + 12, C.green) + 6;
  if (RUN.seker) x += iconNum('seker', RUN.seker, x, by + 13, C.white) + 6;
  const ch = RUN.chaos.filter(c => c.left > 0);
  if (ch.length) { spr(ICONS.swirl, x, by + 12); text(String(Math.max(...ch.map(c => c.left))), x + 10, by + 13, C.magenta); }
  if (extraFn) extraFn();
}
SCENES.doors = {
  enter() {
    if (!RUN.doors) RUN.doors = genDoors();
    this.doors = RUN.doors; this.t = 0; this.sel = -1; this.showBoons = false; this.showLeague = false;
    this.reg = REGIONS[RUN.region]; this.S = computeStats(RUN);
    RUN.hp = Math.min(RUN.hp, this.S.maxHp);
    Music.layer = 3; Music.play(this.reg.song, now() + 0.2, false);
    saveRun();
    this.newRegion = RUN.etap === 0 && RUN.region > 0;
    if (this.newRegion) toast('YENİ PİST: ' + this.reg.name, C.yellow, 'crown');
  },
  pick(i) {
    if (this.sel >= 0) return;
    this.sel = i; this.selT = 0; Sound.play('door'); haptic('light');
  },
  reroll() {
    const c = doorRerollCost();
    if (RUN.coins < c || this.sel !== -1) { Sound.play('deny'); return; }
    RUN.coins -= c; RUN.doorRerolls++; RUN.doors = genDoors(); this.doors = RUN.doors; this.t = 0;
    Sound.play('whoosh'); haptic('medium'); saveRun();
  },
  update(dt) {
    this.t += dt; updateFX(dt);
    if (this.sel >= 0) {
      this.selT += dt;
      if (this.selT > 0.55) {
        const d = this.doors[this.sel]; RUN.doors = null; this.sel = -2;
        const to = { panayir: 'shop', cesme: 'rest', kaos: 'kaos', olay: 'event' }[d.type];
        if (to) go(to); else go('run', d);
      }
    }
    if (window.__auto && this.sel === -1 && this.t > 0.6) {
      let i = this.doors.findIndex(d => d.reward && d.reward.kind === 'boon');
      if (i < 0) i = this.doors.findIndex(d => d.type === window.__autoDoor);
      if (window.__autoRandom) i = Math.floor(Math.random() * this.doors.length);
      this.pick(Math.max(0, i));
    }
  },
  key(k) { const n = parseInt(k, 10); if (n >= 1 && n <= this.doors.length) { this.pick(n - 1); return true; } return false; },
  draw() {
    const reg = this.reg;
    rect(0, 0, W, H, reg.grass);
    for (let y = 0; y < H; y += 6) for (let x = 0; x < W; x += 6) { const h = hash2(x + 9, y + 3); if (h < 0.3) rect(x + (h * 31 | 0) % 5, y + 2, 2, 1, reg.grass2); else if (h > 0.985) pix(x + 2, y + 2, C.white); }
    const n = this.doors.length, gap = 8, dw = Math.min(54, Math.floor((W - 16 - (n - 1) * gap) / n));
    const total = n * dw + (n - 1) * gap, x0 = Math.round(W / 2 - total / 2);
    const dy = Math.round(H * 0.3), dh = 64, baseY = dy + dh;
    const hx = W / 2, hy = H * 0.72;
    for (let i = 0; i < n; i++) {
      const cx = x0 + i * (dw + gap) + dw / 2;
      const steps = Math.ceil(Math.hypot(cx - hx, baseY - hy) / 2);
      for (let s = 0; s <= steps; s++) { const k = s / steps; const px = lerp(hx, cx, k), py = lerp(hy, baseY, k), hw = 8 - k * 3; rect(px - hw - 1, py, hw * 2 + 2, 3, reg.dirtD); }
      for (let s = 0; s <= steps; s++) { const k = s / steps; const px = lerp(hx, cx, k), py = lerp(hy, baseY, k), hw = 8 - k * 3; rect(px - hw, py, hw * 2, 3, reg.dirt); }
    }
    if (reg.night) { g.globalAlpha = 0.25; rect(0, 0, W, H, C.navy); g.globalAlpha = 1; }
    const top = SAFE.t + 6;
    textO(reg.name, W / 2, top, C.yellow, 'center');
    const dotsW = 5 * 14, dx0 = Math.round(W / 2 - dotsW / 2);
    for (let i = 0; i < 5; i++) {
      const cx = dx0 + i * 14 + 7, cy = top + 17;
      if (i === 4) { spr(i <= RUN.etap ? ICONS.crown : tinted('crown', C.slate), cx - 5, cy - 3); continue; }
      circle(cx, cy, 4, C.ink); circle(cx, cy, 3, i < RUN.etap ? C.green : i === RUN.etap ? C.yellow : C.slate);
      if (i < 3) hline(cx + 5, cy, 4, C.ink);
    }
    textO(this.doors[0].type === 'boss' ? 'ŞAMPİYON SENİ BEKLİYOR' : 'YOLUNU SEÇ', W / 2, top + 26, C.white, 'center');
    if (RUN.league && Object.keys(RUN.league).length) {
      const rk = leagueRank(), lt = leagueTable(), lb = 'LİG ' + rk + '. · ' + (lt[rk - 1] ? lt[rk - 1].pts : 0) + ' P', lw = textWidth(lb) + 24;
      button('league', W / 2 - lw / 2, top + 37, lw, 14, lb, () => { this.showLeague = true; }, { kind: rk === 1 ? 'primary' : 'secondary', icon: 'crown' });
    }
    for (let i = 0; i < n; i++) {
      const d = this.doors[i], x = x0 + i * (dw + gap);
      const hov = this.sel === i;
      const bob = hov ? -Math.round(Math.sin(Math.min(1, this.selT * 4) * Math.PI) * 3) : 0;
      const k = clamp((this.t - i * 0.07) / 0.25, 0, 1);
      g.globalAlpha = k;
      this.drawDoor(d, x, dy + bob + Math.round((1 - Ease.outCubic(k)) * 12), dw, dh, hov);
      g.globalAlpha = 1;
      UI.add('door' + i, x, dy - 18, dw, dh + 40, () => this.pick(i));
    }
    const set = heroHorse(RUN.blanket);
    let hxx = hx, hyy = hy;
    if (this.sel >= 0) { const cx = x0 + this.sel * (dw + gap) + dw / 2; const k = Ease.inOut(Math.min(1, this.selT / 0.55)); hxx = lerp(hx, cx, k); hyy = lerp(hy, baseY + 4, k); }
    g.globalAlpha = 0.33; ellipse(hxx, hyy + 9, 6, 3, C.ink); g.globalAlpha = 1;
    sprC(set.frames[this.sel >= 0 ? Math.floor(this.t * 12) % 4 : 1], hxx, hyy);
    const by = H - SAFE.b - 30;
    if (this.doors[0].type !== 'boss' && this.sel === -1) {
      const c = doorRerollCost(), bw = 112;
      button('reroll', W / 2 - bw / 2, by - 24, bw, 16, 'YOLU DEĞİŞTİR ' + c, () => this.reroll(), { kind: 'secondary', icon: 'dice', disabled: RUN.coins < c });
    }
    bottomBar(by, () => {
      const bc = Object.keys(RUN.boons).length + (RUN.mods || []).length;
      button('myboons', W - 64, by + 3, 54, 16, 'GÜÇ ' + bc, () => { this.showBoons = true; }, { kind: 'blue' });
    });
    drawParts(0, 0); drawTexts();
    if (this.showBoons) drawBoonList(() => { this.showBoons = false; });
    if (this.showLeague) drawLeague(() => { this.showLeague = false; });
  },
  drawDoor(d, x, y, w, h, hot) {
    const kaos = d.type === 'kaos', boss = d.type === 'boss';
    const field = boss ? C.wine : kaos ? C.purple : C.blue;
    // energy field
    g.globalAlpha = 0.6; rect(x + 4, y + 5, w - 8, h - 5, C.ink); g.globalAlpha = 0.45; rect(x + 4, y + 5, w - 8, h - 5, field); g.globalAlpha = 1;
    for (let i = 0; i < 4; i++) { const yy = y + 6 + ((T * 30 + i * (h / 4)) % (h - 6)); g.globalAlpha = 0.35; hline(x + 4, Math.round(yy), w - 8, kaos ? C.magenta : boss ? C.red : C.cyan); }
    g.globalAlpha = 1;
    if (kaos) { for (let i = 0; i < 3; i++) { g.globalAlpha = 0.4; ring(x + w / 2, y + h / 2 + 2, 6 + i * 6 + Math.round(Math.sin(T * 3 + i) * 2), C.magenta); } g.globalAlpha = 1; }
    const rv = d.type === 'duello' && RIVAL_BY_ID[d.rival];
    if (rv) {
      // the rival waits inside the gate, its file stamp shows whether you already beat it
      const set = getMount(rv.look), img = set.stand, a = g.globalAlpha;
      g.globalAlpha = a * 0.9; spr(img, Math.round(x + w / 2 - img.width / 2), Math.round(y + h / 2 - img.height / 2 + 2)); g.globalAlpha = a;
      const nm = textWidth(rv.name) <= w - 6 ? rv.name : rv.name.split(' ')[0];
      textO(nm, x + w / 2, y + 7, C.salmon, 'center');
      if (META.rivals[rv.id]) spr(ICONS.book, x + w - 13, y + h - 12);
    }
    // metal pylons and lintel
    rect(x, y, 4, h, C.ink); rect(x + 1, y, 2, h, C.gray); pix(x + 1, y + 8, C.cyan); pix(x + 1, y + h - 8, C.cyan);
    rect(x + w - 4, y, 4, h, C.ink); rect(x + w - 3, y, 2, h, C.gray); pix(x + w - 3, y + 8, C.cyan); pix(x + w - 3, y + h - 8, C.cyan);
    rect(x - 2, y - 2, w + 4, 7, C.ink); rect(x - 1, y - 1, w + 2, 5, kaos ? C.plum : C.slate); hline(x - 1, y - 1, w + 2, kaos ? C.magenta : C.lgray);
    for (let i = 0; i < w; i += 6) pix(x + 1 + i, y + 1, Math.floor(T * 3 + i) % 3 === 0 ? C.yellow : C.dgray);
    if (hot) { g.globalAlpha = 0.4; rect(x + 4, y + 5, w - 8, h - 5, C.yellow); g.globalAlpha = 1; }
    if (d.elite) { rect(x - 2, y + 6, w + 4, 9, C.ink); rect(x - 1, y + 7, w + 2, 7, C.wine); text('ZORLU', x + w / 2, y + 6, C.white, 'center'); }
    const sx = x + w / 2, sy = y - 16;
    const col = d.reward && d.reward.kind === 'boon' ? SPIRITS[d.reward.sp].color : d.type === 'boss' ? C.red : kaos ? C.magenta : d.type === 'olay' ? C.sand : C.gold;
    circle(sx, sy, 10, C.ink); circle(sx, sy, 9, C.navy); ring(sx, sy, 8, col);
    const ic = d.reward ? rewardIcon(d.reward) : ICONS[ETAP_INFO[d.type].icon];
    if (ic) sprC(ic, sx, sy + 1);
    const wic = d.weather && WEATHERS[d.weather] && WEATHERS[d.weather].icon;
    if (wic && ICONS[wic]) { circle(x + w - 2, y + 8 + (d.elite ? 10 : 0), 6, C.ink); sprC(ICONS[wic], x + w - 2, y + 8 + (d.elite ? 10 : 0)); }
    const info = ETAP_INFO[d.type];
    const nm = textWidth(info.name) > w + 6 ? (info.tiny || info.name) : info.name;
    textO(nm, sx, y + h + 4, C.white, 'center');
    let rl = d.reward ? rewardLabel(d.reward, d.elite) : info.short;
    if (textWidth(rl) > w + 10 && d.reward && d.reward.kind === 'boon') rl = SPIRITS[d.reward.sp].name.split(' ')[0];
    textO(rl, sx, y + h + 14, col, 'center');
    if (d.reward && d.type !== 'boss' && d.type !== 'duello' && textWidth(info.short) <= w - 8) text(info.short, sx, y + h - 12, C.lgray, 'center');
    else if (!d.reward && textWidth(info.short) > w + 10) { /* label already shown */ }
  }
};
function drawBoonList(onClose) {
  const ids = Object.keys(RUN.boons), mods = (RUN.mods || []).filter(id => MOD_BY_ID[id]);
  const rowH = ids.length + mods.length > 11 ? 19 : 22;
  const w = Math.min(W - 10, 226), h = Math.min(H - SAFE.t - SAFE.b - 10, 30 + Math.max(1, ids.length + mods.length) * rowH);
  const x = Math.round(W / 2 - w / 2), y = Math.round(SAFE.t + (H - SAFE.t - SAFE.b - h) / 2);
  UI.block(0, 0, W, H, onClose);
  g.globalAlpha = 0.55; rect(0, 0, W, H, C.ink); g.globalAlpha = 1;
  panel(x, y, w, h, 'YILDIZ GÜÇLERİN');
  if (!ids.length && !mods.length) text('HENÜZ GÜÇ YOK', x + w / 2, y + 22, C.gray, 'center');
  mods.forEach((id, j) => {
    const m = MOD_BY_ID[id], yy = y + 18 + (ids.length + j) * rowH;
    spr(ICONS.hammer, x + 7, yy); text(m.name, x + 20, yy, C.orange);
    text('ÇEKİÇ', x + w - 8, yy, C.lgray, 'right');
    text(wrapText(m.desc, w - 26)[0], x + 20, yy + 9, C.lgray);
  });
  ids.forEach((id, i) => {
    const b = BOON_BY_ID[id], lv = RUN.boons[id];
    const yy = y + 18 + i * rowH;
    if (b.duo) { const a = SPIRITS[b.duo[0]], c = SPIRITS[b.duo[1]]; spr(tinted(SPIRIT_ICON[b.duo[0]], a.color), x + 4, yy); spr(tinted(SPIRIT_ICON[b.duo[1]], c.color), x + 9, yy + 3); text(b.name, x + 20, yy, C.gold); }
    else { const sp = SPIRITS[b.sp]; spr(tinted(SPIRIT_ICON[b.sp], sp.color), x + 6, yy); text(b.name + (b.max > 1 ? ' ' + lv + '/' + b.max : ''), x + 20, yy, sp.color); }
    if (b.slot) text(SLOTS[b.slot], x + w - 8, yy, C.lgray, 'right');
    text(wrapText(b.desc(lv), w - 26)[0], x + 20, yy + 9, C.lgray);
  });
}

// ================= BOON CHOICE =================
SCENES.boon = {
  enter(arg) {
    this.sp = arg.sp; this.after = arg.afterBoss; this.t = 0; this.chosen = -1;
    this.S = computeStats(RUN);
    this.roll();
    Sound.play('power'); Music.layer = 3;
  },
  roll() {
    const sp = this.sp;
    const pool = R.shuffle(BOONS.filter(b => b.sp === sp && (RUN.boons[b.id] || 0) < b.max));
    let opts = pool.slice(0, 3);
    if (opts.length < 3) { const extra = R.shuffle(BOONS.filter(b => b.sp !== sp && (RUN.boons[b.id] || 0) < b.max)); opts = opts.concat(extra.slice(0, 3 - opts.length)); }
    const have = s => Object.keys(RUN.boons).some(id => BOON_BY_ID[id] && BOON_BY_ID[id].sp === s);
    const duos = DUOS.filter(d => d.duo.indexOf(sp) >= 0 && !RUN.boons[d.id] && d.duo.every(have));
    this.hasDuo = false;
    if (duos.length && rnd() < this.S.duoChance) { opts[Math.min(2, opts.length - 1)] = R.pick(duos); this.hasDuo = true; }
    const luck = this.S.luck;
    this.opts = opts.map(b => {
      const r = rnd(); let rar = r < 0.05 + luck * 0.5 ? 2 : r < 0.27 + luck ? 1 : 0;
      if (RUN.rareNext && rar < 1) rar = 1;
      const cur = RUN.boons[b.id] || 0;
      const gain = Math.max(1, Math.min(RARITY[rar].lv, b.max - cur));
      let replaces = null;
      if (b.slot) for (const id in RUN.boons) { const ob = BOON_BY_ID[id]; if (ob && ob.slot === b.slot && id !== b.id) replaces = ob; }
      return { b, rar: b.max > 1 ? rar : -1, cur, gain, replaces };
    });
    if (this.hasDuo) Sound.play('medal');
  },
  choose(i) {
    if (this.chosen >= 0) return;
    const o = this.opts[i]; if (!o) return;
    this.chosen = i; this.cT = 0;
    if (o.replaces) delete RUN.boons[o.replaces.id];
    RUN.boons[o.b.id] = o.cur + o.gain;
    if (o.b.onPick) o.b.onPick(RUN, o.gain);
    RUN.rareNext = false;
    META.stats.boons++; missionEvent('boons', 1);
    if (o.b.duo) META.stats.duos++;
    Sound.play('select'); haptic('success');
  },
  update(dt) {
    this.t += dt; updateFX(dt);
    if (this.chosen >= 0) { this.cT += dt; if (this.cT > 0.7) { this.chosen = -2; const S = computeStats(RUN); RUN.hp = Math.min(RUN.hp, S.maxHp); go('doors'); } }
    if (window.__auto && this.chosen === -1 && this.t > 0.5) this.choose(0);
  },
  key(k) { const n = parseInt(k, 10); if (n >= 1 && n <= 3) { this.choose(n - 1); return true; } return false; },
  draw() {
    const sp = SPIRITS[this.sp];
    rect(0, 0, W, H, C.ink);
    for (let i = 0; i < 40; i++) { const h = hash2(i, 5); const x = (h * W) | 0, y = ((hash2(i, 6) * H + T * 8 * (0.5 + h)) % H) | 0; pix(x, y, i % 3 ? C.slate : sp.dark); }
    const ch = 58, contentH = 62 + 3 * (ch + 6) + 24;
    const top = Math.max(SAFE.t + 8, Math.round((H - contentH) / 2) - 10);
    const oy = top + 16;
    for (let r = 26, i = 0; r > 12; r -= 5, i++) { g.globalAlpha = 0.25 - i * 0.06; ring(W / 2, oy, r + Math.round(Math.sin(T * 3 + i) * 2), sp.color); }
    g.globalAlpha = 1; circle(W / 2, oy, 12, C.ink); circle(W / 2, oy, 11, sp.dark); circle(W / 2, oy, 9, sp.color);
    sprC(tinted(SPIRIT_ICON[this.sp], C.ink), W / 2, oy);
    textO(sp.name, W / 2, oy + 20, sp.color, 'center', 2);
    text(this.after ? 'ŞAMPİYONU GEÇTİN! BİR GÜÇ SEÇ' : (this.hasDuo ? 'İKİ RUH BİRLİKTE KONUŞUYOR!' : sp.desc + ' RUHU SANA GÜÇ SUNUYOR'), W / 2, oy + 40, this.hasDuo ? C.gold : C.lgray, 'center');
    const cw = Math.min(W - 14, 230), cx = Math.round(W / 2 - cw / 2);
    let y = oy + 52;
    this.opts.forEach((o, i) => {
      const k = clamp((this.t - i * 0.08) / 0.25, 0, 1);
      const yy = Math.round(y + (1 - Ease.outCubic(k)) * 30);
      g.globalAlpha = k * (this.chosen >= 0 && this.chosen !== i ? 0.35 : 1);
      this.drawCard(o, cx, yy, cw, ch, this.chosen === i, i);
      g.globalAlpha = 1;
      UI.add('card' + i, cx, yy, cw, ch, () => this.choose(i));
      y += ch + 6;
    });
    const left = this.S.rerolls - RUN.rerollsUsed;
    if (left > 0 && this.chosen === -1) button('reroll', W / 2 - 45, y + 2, 90, 16, 'YENİLE (' + left + ')', () => { RUN.rerollsUsed++; this.roll(); this.t = 0.1; Sound.play('select'); }, { kind: 'blue' });
    drawParts(0, 0); drawTexts();
  },
  drawCard(o, x, y, w, h, sel, i) {
    const b = o.b, duo = !!b.duo;
    const spA = SPIRITS[duo ? b.duo[0] : b.sp], spB = duo ? SPIRITS[b.duo[1]] : spA;
    const rc = duo ? C.gold : o.rar >= 0 ? RARITY[o.rar].color : spA.color;
    rrect(x - 1, y - 1, w + 2, h + 2, sel ? C.yellow : duo ? C.gold : C.ink);
    rrect(x, y, w, h, sel ? C.slate : C.navy);
    if (duo) { rect(x, y + 1, 3, Math.floor(h / 2) - 1, spA.color); rect(x, y + Math.floor(h / 2), 3, Math.ceil(h / 2) - 1, spB.color); }
    else rect(x, y + 1, 3, h - 2, rc);
    circle(x + 18, y + 17, 11, C.ink); circle(x + 18, y + 17, 10, spA.dark); circle(x + 18, y + 17, 8, C.ink);
    if (duo) { sprC(tinted(SPIRIT_ICON[b.duo[0]], spA.color), x + 15, y + 14); sprC(tinted(SPIRIT_ICON[b.duo[1]], spB.color), x + 21, y + 20); }
    else sprC(tinted(SPIRIT_ICON[b.sp], spA.color), x + 18, y + 17);
    text(b.name, x + 34, y + 4, duo ? C.gold : C.yellow);
    const lvTxt = duo ? 'İKİLİ' : o.cur === 0 ? 'YENİ' : 'SV ' + o.cur + '→' + (o.cur + o.gain);
    text(lvTxt, x + w - 6, y + 4, duo ? C.gold : o.cur === 0 ? C.green : C.sky, 'right');
    const lines = wrapText(b.desc(o.cur + o.gain), w - 42);
    lines.slice(0, o.replaces ? 2 : 3).forEach((ln, j) => text(ln, x + 34, y + 14 + j * 9, C.lgray));
    if (o.replaces) text('YERİNE: ' + o.replaces.name, x + 34, y + 32, C.salmon);
    if (b.slot) { const tw = textWidth(SLOTS[b.slot]) + 6; rect(x + 34, y + h - 12, tw, 9, C.ink); text(SLOTS[b.slot], x + 37, y + h - 12, C.cyan); }
    if (o.rar >= 0) text(RARITY[o.rar].name, x + w - 6, y + h - 11, rc, 'right');
    text(String(i + 1), x + 16, y + h - 13, C.dgray, 'center');
  }
};

// ================= SHOP (PANAYIR) =================
SCENES.shop = {
  enter() {
    RUN.shopDone[RUN.region] = true;
    this.S = computeStats(RUN); this.t = 0;
    if (!META.flags.moko) { META.flags.moko = true; saveMeta(); this.firstMeet = true; } else this.firstMeet = false;
    const disc = 1 - Math.min(0.5, this.S.discount);
    const sps = R.shuffle(SPIRIT_KEYS.slice());
    const boonFor = sp => { const pool = R.shuffle(BOONS.filter(b => b.sp === sp && (RUN.boons[b.id] || 0) < b.max)); return pool[0] || null; };
    this.items = [];
    for (let i = 0; i < 2; i++) { const b = boonFor(sps[i]); if (b) this.items.push({ kind: 'boon', b, price: Math.round((70 + i * 25 + RUN.region * 15) * disc), sold: false }); }
    this.items.push({ kind: 'heal', price: Math.round(35 * disc), sold: false });
    this.items.push({ kind: 'sharp', price: Math.round((60 + RUN.region * 10) * disc), sold: false });
    this.items.push({ kind: 'maxhp', price: Math.round((110 + RUN.region * 20) * disc), sold: false });
    if (hammerAvailable()) this.items.push({ kind: 'cekic', price: Math.round((95 + RUN.region * 15) * disc), sold: false });
    Music.layer = 3; Music.play(REGIONS[RUN.region].song, now() + 0.2, false);
  },
  leave() { if (RUN.pendingHammer) go('cekic'); else go('doors'); },
  buy(it) {
    if (it.sold || RUN.coins < it.price) { Sound.play('deny'); return; }
    RUN.coins -= it.price; it.sold = true; missionEvent('shop', 1);
    if (it.kind === 'boon') {
      if (it.b.slot) for (const id in RUN.boons) { const ob = BOON_BY_ID[id]; if (ob && ob.slot === it.b.slot && id !== it.b.id) delete RUN.boons[id]; }
      RUN.boons[it.b.id] = (RUN.boons[it.b.id] || 0) + 1; if (it.b.onPick) it.b.onPick(RUN, 1); META.stats.boons++; missionEvent('boons', 1);
    }
    else if (it.kind === 'heal') RUN.hp = Math.min(computeStats(RUN).maxHp, RUN.hp + 1);
    else if (it.kind === 'maxhp') { RUN.bonusMaxHp++; RUN.hp++; }
    else if (it.kind === 'sharp') RUN.shotBonus = (RUN.shotBonus || 0) + 0.3;
    else if (it.kind === 'cekic') { RUN.pendingHammer = true; this.S = computeStats(RUN); Sound.play('anvil'); haptic('success'); toast('ÇEKİÇ ALINDI: ÇIKIŞTA ÖRSE!', C.orange, 'hammer'); return; }
    this.S = computeStats(RUN);
    Sound.play('buy'); haptic('success'); toast('SATIN ALINDI!', C.green, 'bag');
  },
  update(dt) { this.t += dt; updateFX(dt); if (window.__auto && this.t > 0.6) { this.t = -99; if (window.__autoBuy) { for (const it of this.items) if (!it.sold && RUN.coins >= it.price) this.buy(it); } this.leave(); } },
  draw() {
    stationFloor();
    const top = SAFE.t + 6;
    spr(PEOPLE.moko, W / 2 - 5, top + 22);
    spr(BLD.stall, W / 2 - 32, top + 8);
    textO('UZAY PAZARI', W / 2, top, C.yellow, 'center');
    const by = top + 56;
    panel(6, by, W - 12, 26);
    rect(11, by + 4, 18, 18, C.ink); spr(PORTRAIT.moko, 6, by - 1);
    text('MOKO:', 34, by + 5, C.yellow);
    text(this.firstMeet ? 'BÖLMENE DE TEZGAH KURARIM!' : 'GEL DÜNYALI, TAZE GÜÇLER VAR!', 34, by + 14, C.white);
    let y = by + 32;
    const w = W - 12, n = this.items.length, dw = w - 86;
    const rows = this.items.map(it => {
      let name, desc, ic;
      if (it.kind === 'boon') { const sp = SPIRITS[it.b.sp]; name = it.b.name; desc = it.b.desc((RUN.boons[it.b.id] || 0) + 1); ic = tinted(SPIRIT_ICON[it.b.sp], sp.color); if (it.b.slot) name += ' · ' + SLOTS[it.b.slot]; }
      else if (it.kind === 'heal') { name = 'ŞİFA JELİ'; desc = '1 CAN YENİLE'; ic = ICONS.heart; }
      else if (it.kind === 'sharp') { name = 'ODAK LENSİ'; desc = 'ATIŞ HASARI +%30 (BU KOŞU)'; ic = ICONS[(WEAPONS[RUN.weapon] || WEAPONS.yay).icon]; }
      else if (it.kind === 'cekic') { name = 'DEMİRCİ ÇEKİCİ'; desc = 'SİLAHINI DÖV: YENİ ÖZELLİK KAZAN'; ic = ICONS.hammer; }
      else { name = 'ENERJİ YEMİ'; desc = '+1 AZAMİ CAN (BU KOŞU)'; ic = ICONS.heartG; }
      return { name, ic, lines: wrapText(desc, dw) };
    });
    // row heights: uniform when there is room, otherwise each row gets what its text needs
    const avail = H - SAFE.b - 30 - y - n * 3;
    let hs = rows.map(() => clamp(Math.floor(avail / n), 26, 36));
    if (hs[0] < 36) {
      const want = rows.map(r => r.lines.length >= 3 ? 35 : r.lines.length === 2 ? 30 : 26);
      const sum = want.reduce((a, b) => a + b, 0);
      if (sum <= avail) { const ex = Math.floor((avail - sum) / n); hs = want.map(v => Math.min(36, v + ex)); }
      else hs = want.map(v => Math.max(26, Math.floor(v * avail / sum)));
    }
    for (let i = 0; i < n; i++) {
      const it = this.items[i], r = rows[i], ih = hs[i];
      rrect(5, y - 1, w + 2, ih + 2, C.ink); rrect(6, y, w, ih, it.sold ? C.navy : C.slate);
      spr(r.ic, 11, y + Math.round(ih / 2) - 4);
      text(r.name, 24, y + 3, it.sold ? C.gray : C.yellow);
      const dl = r.lines.slice(), maxL = ih >= 34 ? 3 : 2;
      if (dl.length > maxL) { let l2 = dl[maxL - 1]; while (l2.length && textWidth(l2 + '..') > dw) l2 = l2.slice(0, l2.lastIndexOf(' ') > 0 ? l2.lastIndexOf(' ') : l2.length - 1); dl.length = maxL; dl[maxL - 1] = l2 + '..'; }
      dl.forEach((ln, j) => text(ln, 24, y + 12 + j * 8, C.lgray));
      if (it.sold) text('SATILDI', W - 34, y + ih / 2 - 4, C.gray, 'center');
      else button('buy' + i, W - 58, y + Math.round(ih / 2) - 8, 48, 16, String(it.price), () => this.buy(it), { icon: 'coin0', disabled: RUN.coins < it.price });
      y += ih + 3;
    }
    iconNum('coin0', RUN.coins, 10, y + 4, C.yellow);
    button('shop_out', W - 82, y + 1, 72, 18, RUN.pendingHammer ? 'ÖRSE GİT' : 'YOLA DEVAM', () => this.leave(), { kind: 'green' });
    drawParts(0, 0); drawTexts();
  }
};

// ================= DEMİRCİ ÇEKİCİ (run-only weapon mods, max 2 per run) =================
let HAMMER_BIG = null;
SCENES.cekic = {
  enter() {
    this.t = 0; this.chosen = -1; this.cT = 0; RUN.pendingHammer = false;
    this.w = WEAPONS[RUN.weapon] ? RUN.weapon : 'yay';
    this.opts = R.shuffle((WEAPON_MODS[this.w] || []).filter(m => RUN.mods.indexOf(m.id) < 0)).slice(0, 3);
    this.empty = !this.opts.length;
    if (this.empty) { RUN.coins += 40; RUN.coinsEarned += 40; }
    if (!HAMMER_BIG) HAMMER_BIG = scaleSprite(ICONS.hammer, 2);
    this.hitT = 0; Sound.play('anvil'); Music.layer = 1;
  },
  choose(i) {
    if (this.chosen >= 0) return;
    const m = this.opts[i]; if (!m) return;
    this.chosen = i; this.cT = 0;
    RUN.mods.push(m.id); RUN.hammers = (RUN.hammers || 0) + 1;
    META.stats.hammers = (META.stats.hammers || 0) + 1; missionEvent('hammer', 1);
    Sound.play('anvil'); setTimeout(() => Sound.play('power'), 260); haptic('success'); flash(C.orange, 0.25); shake(3, 0.25);
    burst(W / 2, this.anvilY || H * 0.25, 26, [C.yellow, C.orange, C.white], 95, 0.8, 140, 2);
    toast(m.name + ': SİLAHIN DÖVÜLDÜ!', C.orange, 'hammer');
  },
  next() {
    if (RUN.pendingNode) { const n = RUN.pendingNode; RUN.pendingNode = null; go('run', n); return; }
    go('doors');
  },
  update(dt) {
    this.t += dt; updateFX(dt);
    const ay = this.anvilY || H * 0.25;
    // the smith's hammer falls on every beat-ish; sparks fly on impact
    const ph = (this.t * 1.6) % 1;
    if (ph < this.lastPh) { this.hitT = 0.12; for (let i = 0; i < 6; i++) addPart(W / 2 + (Math.random() - 0.5) * 10, ay - 8, (Math.random() - 0.5) * 90, -40 - Math.random() * 70, 0.6, Math.random() < 0.5 ? C.yellow : C.orange, 1, 160); }
    this.lastPh = ph; if (this.hitT > 0) this.hitT -= dt;
    if (this.chosen >= 0) { this.cT += dt; if (this.cT > 1.0) { this.chosen = -2; this.next(); } }
    if (window.__auto && this.chosen === -1 && this.t > 0.5) { if (!this.empty) this.choose(0); else { this.chosen = -2; this.next(); } }
  },
  key(k) {
    const n = parseInt(k, 10);
    if (n >= 1 && n <= this.opts.length) { this.choose(n - 1); return true; }
    if (k === 'Enter' && this.empty) { this.chosen = -2; this.next(); return true; }
    return false;
  },
  draw() {
    rect(0, 0, W, H, C.plum);
    for (let i = 0; i < 10; i++) { g.globalAlpha = 0.16 - i * 0.015; rect(0, H - SAFE.b - 34 - (i + 1) * 12, W, 12, C.rust); }
    g.globalAlpha = 0.18; rect(0, H - SAFE.b - 34, W, SAFE.b + 34, C.rust);
    g.globalAlpha = 1;
    for (let y = 0; y < H; y += 8) for (let x = 0; x < W; x += 8) { const h = hash2(x + 3, y + 11); if (h < 0.12) rect(x + (h * 40 | 0) % 6, y + 3, 3, 1, C.ink); }
    const n = this.empty ? 1 : this.opts.length;
    const contentH = 44 + 62 + 14 + n * 48 + 12;
    const off = Math.max(0, Math.floor((H - SAFE.b - 34 - SAFE.t - 8 - contentH) / 3));
    const top = SAFE.t + 8 + off;
    textO('DEMİRCİ ÇEKİCİ', W / 2, top, C.orange, 'center', 2);
    const wp = WEAPONS[this.w];
    text('SİLAHIN: ' + wp.name, W / 2, top + 20, C.sand, 'center');
    text('BU KOŞUDA ÇEKİÇ: ' + Math.min(2, RUN.hammers) + '/2', W / 2, top + 30, C.lgray, 'center');
    // anvil with the weapon glowing on it
    const ay = top + 44 + 44; this.anvilY = ay; const cx = W / 2;
    g.globalAlpha = 0.25 + 0.1 * Math.sin(T * 5); circle(cx, ay - 6, 22, C.orange); g.globalAlpha = 1;
    rect(cx - 11, ay + 7, 22, 6, C.ink); rect(cx - 10, ay + 8, 20, 4, C.dgray);
    rect(cx - 5, ay - 1, 10, 9, C.ink); rect(cx - 4, ay, 8, 8, C.slate);
    rect(cx - 16, ay - 8, 31, 8, C.ink); rect(cx - 15, ay - 7, 29, 6, C.gray); hline(cx - 15, ay - 7, 29, C.lgray);
    rect(cx - 22, ay - 7, 7, 4, C.ink); hline(cx - 21, ay - 6, 6, C.gray);
    const wic = ICONS[wp.icon];
    if (wic) { spr(tinted(wp.icon, C.orange), cx - wic.width / 2, ay - 8 - wic.height); g.globalAlpha = 0.5 + 0.5 * Math.sin(T * 9); spr(tinted(wp.icon, C.yellow), cx - wic.width / 2, ay - 8 - wic.height); g.globalAlpha = 1; }
    const ph = (this.t * 1.6) % 1, lift = Math.round(Math.pow(Math.sin(ph * Math.PI), 0.7) * 10);
    spr(HAMMER_BIG, cx + 6, ay - 26 - lift);
    if (this.hitT > 0) { g.globalAlpha = this.hitT / 0.12; ring(cx + 2, ay - 10, 9, C.yellow); g.globalAlpha = 1; }
    drawParts(0, 0);
    const cw = Math.min(W - 14, 230), x = Math.round(W / 2 - cw / 2);
    let y = ay + 26;
    if (this.empty) {
      textBlock('ÖRS SUSTU: BU SİLAHA DÖVÜLECEK BİR ŞEY KALMADI. DEMİRCİ +40 SİKKE VERDİ.', x + 6, y, cw - 12, C.lgray);
      button('ck_out', W / 2 - 40, y + 40, 80, 18, 'DEVAM', () => { this.chosen = -2; this.next(); }, { kind: 'green' });
    } else {
      text(RUN.mods.length && this.chosen < 0 ? 'BİR DEĞİŞİKLİK DAHA SEÇ' : 'BİR DEĞİŞİKLİK SEÇ', W / 2, y, C.white, 'center');
      y += 12;
      const ch = 42;
      this.opts.forEach((m, i) => {
        const k = clamp((this.t - i * 0.08) / 0.25, 0, 1), yy = Math.round(y + (1 - Ease.outCubic(k)) * 24);
        const sel = this.chosen === i;
        g.globalAlpha = k * (this.chosen >= 0 && !sel ? 0.35 : 1);
        rrect(x - 1, yy - 1, cw + 2, ch + 2, sel ? C.yellow : C.orange0); rrect(x, yy, cw, ch, sel ? C.slate : C.navy);
        rect(x, yy + 1, 3, ch - 2, C.orange);
        circle(x + 15, yy + ch / 2, 9, C.ink); circle(x + 15, yy + ch / 2, 8, C.dbrown);
        if (wic) sprC(wic, x + 15, yy + ch / 2);
        text(m.name, x + 30, yy + 5, C.gold);
        text(String(i + 1), x + cw - 6, yy + 5, C.dgray, 'right');
        wrapText(m.desc, cw - 38).slice(0, 3).forEach((ln, j) => text(ln, x + 30, yy + 16 + j * 9, C.lgray));
        g.globalAlpha = 1;
        UI.add('ck' + i, x, yy, cw, ch, () => this.choose(i));
        y += ch + 6;
      });
      if (RUN.mods.length) {
        const had = RUN.mods.filter((id, j) => !(this.chosen >= 0 && j === RUN.mods.length - 1)).map(id => MOD_BY_ID[id] ? MOD_BY_ID[id].name : id);
        if (had.length) text('DÖVÜLMÜŞ: ' + had.join(', '), W / 2, y + 2, C.orange0, 'center');
      }
    }
    bottomBar(H - SAFE.b - 30);
    drawTexts(); drawFlash();
  }
};

// ================= REST (ÇEŞME) =================
SCENES.rest = {
  enter() { RUN.restDone[RUN.region] = true; this.S = computeStats(RUN); this.done = false; this.t = 0; this.leaveT = 0; Music.layer = 3; },
  pick(k) {
    if (this.done) return; this.done = true; this.leaveT = 0.5;
    if (k === 'heal') { RUN.hp = Math.min(this.S.maxHp, RUN.hp + 2); toast('+2 CAN', C.red, 'heart'); Sound.play('heal'); }
    else if (k === 'max') { RUN.bonusMaxHp++; toast('+1 AZAMİ CAN', C.gold, 'heartG'); Sound.play('heal'); }
    else { RUN.yonca += 6; missionEvent('yonca', 6); toast('+6 KRİSTAL', C.cyan, 'clover'); Sound.play('clover'); }
    haptic('success');
  },
  update(dt) {
    this.t += dt; updateFX(dt);
    if (this.done && this.leaveT > 0) { this.leaveT -= dt; if (this.leaveT <= 0) go('doors'); }
    if (Math.random() < dt * 20) addPart(W / 2 + (Math.random() - 0.5) * 4, this.fy || 100, (Math.random() - 0.5) * 30, -30 - Math.random() * 20, 0.8, Math.random() < 0.5 ? C.cyan : C.white, 1, 70);
    if (window.__auto && !this.done && this.t > 0.5) this.pick('heal');
  },
  draw() {
    stationFloor();
    const top = SAFE.t + 6;
    textO('DİNLENME KAPSÜLÜ', W / 2, top, C.cyan, 'center', 2);
    text('TEMİZ HAVA, KISA BİR MOLA...', W / 2, top + 20, C.white, 'center');
    const fy = top + 40; this.fy = fy + 8;
    spr(BLD.fountain, W / 2 - 20, fy);
    drawParts(0, 0);
    const set = heroHorse(RUN.blanket);
    sprC(set.stand, W / 2 + 30, fy + 22);
    let hx = W / 2 - this.S.maxHp * 4.5;
    for (let i = 0; i < this.S.maxHp; i++) { spr(i < RUN.hp ? ICONS.heart : ICONS.heartE, hx, fy + 40); hx += 9; }
    const bw = Math.min(W - 20, 200), bx = Math.round(W / 2 - bw / 2);
    let y = fy + 58;
    const opts = [['heal', 'ŞİFA BUHARI', '2 CAN YENİLE', 'heart'], ['max', 'KAPSÜLDE UYU', '+1 AZAMİ CAN', 'heartG'], ['yonca', 'YILDIZLARA BAK', '+6 KRİSTAL', 'clover']];
    for (const [k, a, b, ic] of opts) {
      button('rest_' + k, bx, y, bw, 24, '', () => this.pick(k), { kind: 'secondary', disabled: this.done });
      spr(ICONS[ic], bx + 8, y + 7); text(a, bx + 24, y + 4, C.yellow); text(b, bx + 24, y + 13, C.lgray);
      y += 30;
    }
    drawTexts();
  }
};

// ================= CHAOS GATE =================
SCENES.kaos = {
  enter() {
    RUN.kaosDone[RUN.region] = true; this.t = 0; this.done = false; this.leaveT = 0;
    const cu = R.shuffle(CHAOS_CURSES.slice()), bl2 = R.shuffle(CHAOS_BLESS.slice());
    this.offers = [0, 1, 2].map(i => ({ curse: cu[i].id, bless: bl2[i].id }));
    Music.stop(); Sound.play('chaos');
  },
  choose(i) {
    if (this.done) return;
    if (RUN.hp <= 1) { Sound.play('deny'); toast('KAOS BEDELİ İÇİN CANIN YETMİYOR', C.salmon, 'heart'); return; }
    const o = this.offers[i];
    this.done = true; this.pickI = i; this.leaveT = 1.0;
    RUN.hp--; RUN.chaos.push({ curse: o.curse, bless: o.bless, left: 3 }); missionEvent('kaos', 1);
    Sound.play('chaos'); flash(C.magenta, 0.4); haptic('heavy'); shake(3, 0.3);
    burst(W / 2, H / 2, 30, [C.magenta, C.purple, C.white], 90, 1, 0, 2);
  },
  update(dt) {
    this.t += dt; updateFX(dt);
    if (this.done) { this.leaveT -= dt; if (this.leaveT <= 0 && this.leaveT > -1) { this.leaveT = -9; go('doors'); } }
    if (Math.random() < dt * 12) { const a = Math.random() * Math.PI * 2; addPart(W / 2 + Math.cos(a) * 80, H * 0.2 + Math.sin(a) * 30, -Math.cos(a) * 30, -Math.sin(a) * 12, 1.5, Math.random() < 0.5 ? C.magenta : C.purple, 1, 0); }
    if (window.__auto && !this.done && this.t > 0.6) { if (RUN.hp > 1) this.choose(0); else { this.done = true; go('doors'); } }
  },
  draw() {
    rect(0, 0, W, H, C.ink);
    for (let r = 10; r < 90; r += 12) { g.globalAlpha = 0.12; ring(W / 2, H * 0.2, r + Math.round(Math.sin(T * 2 + r) * 3), C.magenta); }
    g.globalAlpha = 1;
    drawParts(0, 0);
    const top = SAFE.t + 8;
    textO('KAOS KAPISI', W / 2, top, C.magenta, 'center', 2);
    text('BİR CAN VER, BİR PAZARLIK SEÇ', W / 2, top + 20, C.lgray, 'center');
    text('ÖNCE 3 ETAP LANET, SONRA KALICI LÜTUF', W / 2, top + 30, C.gray, 'center');
    const cw = Math.min(W - 14, 230), cx = Math.round(W / 2 - cw / 2), ch = 50;
    let y = top + 46;
    this.offers.forEach((o, i) => {
      const cu = CHAOS_BY_ID[o.curse], bs = CHAOS_BY_ID[o.bless];
      const k = clamp((this.t - i * 0.1) / 0.3, 0, 1), yy = Math.round(y + (1 - Ease.outCubic(k)) * 20);
      g.globalAlpha = k * (this.done && this.pickI !== i ? 0.3 : 1);
      rrect(cx - 1, yy - 1, cw + 2, ch + 2, this.pickI === i ? C.magenta : C.ink); rrect(cx, yy, cw, ch, C.navy);
      rect(cx, yy + 1, 3, ch - 2, C.magenta);
      text('LANET', cx + 8, yy + 4, C.red); text(cu.name, cx + 46, yy + 4, C.salmon); text(cu.desc, cx + 46, yy + 13, C.lgray);
      hline(cx + 8, yy + 24, cw - 16, C.slate);
      text('LÜTUF', cx + 8, yy + 29, C.green); text(bs.name, cx + 46, yy + 29, C.yellow); text(bs.desc, cx + 46, yy + 38, C.lgray);
      g.globalAlpha = 1;
      UI.add('kc' + i, cx, yy, cw, ch, () => this.choose(i));
      y += ch + 6;
    });
    text('BEDEL: 1 CAN', W / 2, y + 2, RUN.hp > 1 ? C.red : C.salmon, 'center');
    let hx = W / 2 - computeStats(RUN).maxHp * 4.5;
    for (let i = 0; i < computeStats(RUN).maxHp; i++) { spr(i < RUN.hp ? ICONS.heart : ICONS.heartE, hx, y + 12); hx += 9; }
    if (!this.done) button('k_out', W / 2 - 40, y + 26, 80, 16, 'VAZGEÇ', () => { this.done = true; go('doors'); }, { kind: 'secondary' });
    drawTexts(); drawFlash();
  }
};

// ================= ROAD EVENT =================
SCENES.event = {
  enter() {
    const reg = RUN.region; RUN.eventCount[reg] = (RUN.eventCount[reg] || 0) + 1;
    const here = EVENTS.filter(e => !e.reg || e.reg.indexOf(REGIONS[reg].id) >= 0);
    let pool = here.filter(e => RUN.eventsSeen.indexOf(e.id) < 0); if (!pool.length) pool = here;
    this.ev = R.pick(pool); RUN.eventsSeen.push(this.ev.id);
    this.result = null; this.t = 0; this.reg = REGIONS[reg];
    Sound.play('page'); Music.layer = 1;
  },
  choose(c) {
    if (this.result) return;
    if (c.req && !c.req(RUN)) { Sound.play('deny'); return; }
    this.result = c.fn(RUN);
    const S = computeStats(RUN); RUN.hp = clamp(RUN.hp, 1, S.maxHp);
    META.stats.events++; missionEvent('event', 1); saveMeta(); Sound.play('select'); haptic('light');
  },
  next() {
    if (RUN.pendingHammer) { go('cekic'); return; }
    if (RUN.pendingNode) { const n = RUN.pendingNode; RUN.pendingNode = null; go('run', n); return; }
    if (RUN.pendingBoon) { const sp = RUN.pendingBoon; RUN.pendingBoon = null; go('boon', { sp }); return; }
    go('doors');
  },
  update(dt) {
    this.t += dt; updateFX(dt);
    if (window.__auto && this.t > 0.6) { if (!this.result) { const c = this.ev.choices.find(q => !q.req || q.req(RUN)); this.choose(c); this.t = 0; } else if (this.t > 0.4) { this.t = -99; this.next(); } }
  },
  draw() {
    const reg = this.reg;
    rect(0, 0, W, H, C.ink);
    for (let i = 0; i < 50; i++) { const x = (hash2(i, 31) * W) | 0, y = (hash2(i, 32) * H) | 0; pix(x, y, Math.sin(T * 2 + i) > 0 ? C.white : C.slate); }
    drawPlanet(W - 26, SAFE.t + 42, 20, RUN.region);
    rect(W / 2 - 14, 0, 28, H, C.slate); rect(W / 2 - 12, 0, 24, H, C.dgray); for (let y = Math.round(T * 30) % 12 - 12; y < H; y += 12) { pix(W / 2 - 13, y, C.cyan); pix(W / 2 + 12, y + 6, C.cyan); }
    if (reg.night) { g.globalAlpha = 0.25; rect(0, 0, W, H, C.navy); g.globalAlpha = 1; }
    const set = heroHorse(RUN.blanket);
    sprC(set.stand, W / 2, H - SAFE.b - 60);
    const ev = this.ev, pw = Math.min(W - 12, 226), px = Math.round(W / 2 - pw / 2);
    const lines = wrapText(this.result || ev.text, pw - 20);
    const nC = this.result ? 0 : ev.choices.length;
    const ph = 40 + lines.length * 9 + (this.result ? 30 : nC * 30) + 6;
    const py = Math.round(Math.max(SAFE.t + 10, (H - SAFE.b - 90 - ph) / 2));
    panel(px, py, pw, ph, 'YOL OLAYI');
    const ic = ICONS[ev.icon];
    if (ic) spr(ic, px + 10, py + 20);
    text(ev.title, px + 24, py + 21, C.yellow);
    lines.forEach((ln, i) => text(ln, px + 10, py + 34 + i * 9, this.result ? C.white : C.lgray));
    let y = py + 38 + lines.length * 9;
    if (this.result) button('ev_next', px + pw / 2 - 40, y + 4, 80, 18, 'DEVAM', () => this.next(), { kind: 'green' });
    else ev.choices.forEach((c, i) => {
      const ok = !c.req || c.req(RUN);
      button('evc' + i, px + 8, y, pw - 16, 26, '', () => this.choose(c), { kind: ok ? 'secondary' : 'disabled', disabled: !ok });
      text(c.label, px + 16, y + 4, ok ? C.yellow : C.dgray); text(c.desc, px + 16, y + 14, ok ? C.lgray : C.dgray);
      y += 30;
    });
    bottomBar(H - SAFE.b - 30);
    drawParts(0, 0); drawTexts();
  }
};

// ================= RESULTS =================
function growCrops() {
  let grew = 0;
  for (let i = 0; i < plotCount(); i++) {
    const c = META.crops[i]; if (!c) continue;
    const tp = Math.floor(c / 10), st = c % 10; if (st >= 3) continue;
    if (tp === 2 && META.stats.runs % 2 === 1) continue;
    META.crops[i] = c + 1; grew++;
  }
  return grew;
}
SCENES.results = {
  enter(arg) {
    this.won = !!arg.won; this.quit = !!arg.quit; this.t = 0; Music.stop();
    const mult = HEATS[RUN.heat].rew;
    const xp = Math.round((14 * RUN.cleared + 45 * RUN.bosses + Math.floor(RUN.maxCombo * 0.6) + RUN.kills + (this.won ? 120 : 0)) * mult);
    this.xp = xp; this.conv = Math.floor(RUN.coins / 10); this.yonca = RUN.yonca + this.conv; this.seker = RUN.seker;
    const st = META.stats;
    st.runs++; if (this.won) { st.wins++; META.heatUnlocked = true; }
    if (!RUN.daily) st.earlyLoss = (!this.won && !this.quit && RUN.region === 0) ? (st.earlyLoss || 0) + 1 : 0;
    st.bestCombo = Math.max(st.bestCombo, RUN.maxCombo);
    const prog = RUN.region * 5 + RUN.etap;
    this.record = prog > st.bestProgress && st.runs > 1;
    st.bestProgress = Math.max(st.bestProgress, prog);
    st.bestRegion = Math.max(st.bestRegion, Math.min(LAST_REGION, RUN.region));
    META.yonca += this.yonca; META.seker += this.seker;
    if (this.conv) missionEvent('yonca', this.conv);
    this.lvBefore = META.level; this.xpBefore = META.xp;
    this.ups = addXP(xp);
    this.grew = growCrops();
    this.assistUp = false;
    if (!this.won && META.settings.assist && META.assistLv < 20) { META.assistLv++; this.assistUp = true; }
    this.daily = null;
    if (RUN.daily) {
      const score = RUN.score + RUN.maxCombo * 3 + (this.won ? 1000 : 0), best = META.dailyRun.best[RUN.day] || 0;
      META.dailyRun.best[RUN.day] = Math.max(best, score);
      const keys = Object.keys(META.dailyRun.best); if (keys.length > 10) for (const k of keys.slice(0, keys.length - 10)) delete META.dailyRun.best[k];
      this.daily = { score, best: score > best };
    }
    META.runSave = null;
    // what happened, for the station's reaction when we get home
    const dI = RUN.diedIn || {};
    META.lastRun = { won: this.won, quit: this.quit, region: RUN.region, etap: RUN.etap, type: dI.type || null, boss: !this.won && dI.boss ? dI.boss : null,
      duelLost: RUN.duelLost || (dI.type === 'duello' ? RUN.lastDuel : null) || null, nemesis: RUN.nemesisNew || null, revenge: !!RUN.revenged,
      league: RUN.league && Object.keys(RUN.league).length ? leagueRank() : 0, sGrades: (RUN.grades && RUN.grades.S) || 0, daily: !!RUN.daily, told: false };
    if (this.won) META.freeTokens = (META.freeTokens || 0) + 1;
    this.league = RUN.league && Object.keys(RUN.league).length ? leagueRank() : 0;
    if (this.league === 1 && this.won) META.stats.leagueWins = (META.stats.leagueWins || 0) + 1;
    this.done = META.missions.filter(m => m.done).length;
    this.where = this.won ? 'GALAKSİ KUPASI' : REGIONS[Math.min(LAST_REGION, RUN.region)].name + ' · ' + (RUN.etap >= 4 ? 'ŞAMPİYON' : 'ETAP ' + (RUN.etap + 1));
    const di = RUN.diedIn;
    this.near = null;
    if (!this.won && di) {
      if (di.boss && di.gap != null) this.near = trAcc(BOSSES[di.boss].name.split(' ').pop()) + ' GEÇMENE %' + Math.max(0, 100 - di.gap) + ' KALDI';
      else if (di.pct != null) this.near = 'ETABIN %' + di.pct + '\'İNİ KOŞTUN';
    }
    checkFarmPerks();
    saveMeta();
    if (this.won) Sound.play('win');
    this.levelSounded = false;
  },
  update(dt) {
    this.t += dt; updateFX(dt);
    if (this.won && Math.random() < dt * 30) addPart(Math.random() * W, -4, (Math.random() - 0.5) * 20, 40 + Math.random() * 40, 3, [C.yellow, C.red, C.sky, C.green, C.white, C.magenta][(Math.random() * 6) | 0], 2, 10);
    if (this.ups.length && !this.levelSounded && this.t > 2.0) { this.levelSounded = true; Sound.play('level'); haptic('success'); }
    if (window.__auto && this.t > 1.5) { this.t = -99; go('farm', { fromRun: true }); }
  },
  key(k) { if (k === 'Enter' && this.t > 1) { go('farm', { fromRun: true }); return true; } return false; },
  draw() {
    rect(0, 0, W, H, this.won ? C.navy : C.ink);
    const top = SAFE.t + 14;
    textO(this.won ? 'KUPA SENİN!' : RUN.daily ? 'GÜNÜN KOŞUSU' : this.quit ? 'KOŞU BİTTİ' : 'SEZON BİTTİ', W / 2, top, this.won ? C.yellow : RUN.daily ? C.cyan : C.salmon, 'center', 2);
    if (this.won) spr(ICONS.crown, W / 2 - 5, top - 10);
    text(this.where, W / 2, top + 21, C.lgray, 'center');
    const lines = [
      ['EN İYİ KOMBO', String(RUN.maxCombo), C.yellow],
      ['MÜKEMMEL RİTİM', String(RUN.perfects), C.yellow],
      ['VURULAN DÜŞMAN', String(RUN.kills), C.white],
      ['MADALYA', null, C.white],
      ['SİKKE → KRİSTAL', RUN.coins + ' → ' + this.conv, C.gold],
      ['TOPLAM KRİSTAL', '+' + this.yonca, C.cyan],
      ['KAZANILAN XP', '+' + this.xp, C.sky]
    ];
    if (this.seker) lines.splice(6, 0, ['ŞEKER', '+' + this.seker, C.white]);
    const pw = Math.min(W - 20, 200), px = Math.round(W / 2 - pw / 2);
    let y = top + 36;
    lines.forEach((ln, i) => {
      const k = clamp((this.t - 0.3 - i * 0.15) / 0.2, 0, 1); if (k <= 0) { y += 13; return; }
      g.globalAlpha = k;
      text(ln[0], px + 4, y, C.lgray);
      if (ln[1] != null) text(ln[1], px + pw - 4, y, ln[2], 'right');
      else { let mx = px + pw - 4; for (const m of ['b', 's', 'g']) { const s = String(RUN.medals[m]); mx -= textWidth(s); text(s, mx, y, MEDAL_COLS[m]); mx -= 11; spr(MEDAL[m], mx, y - 2); mx -= 5; } }
      hline(px, y + 10, pw, C.slate);
      g.globalAlpha = 1; y += 13;
    });
    y += 6;
    const k = clamp((this.t - 1.4) / 1.0, 0, 1);
    const lvShown = k >= 1 ? META.level : this.lvBefore;
    const frac = k >= 1 ? META.xp / xpNeed(META.level) : lerp(this.xpBefore / xpNeed(this.lvBefore), this.ups.length ? 1 : META.xp / xpNeed(META.level), Ease.outCubic(k));
    text('SEVİYE ' + lvShown, px, y, C.white);
    bar(px + 52, y + 2, pw - 52, 4, frac, C.sky);
    y += 13;
    const notes = [];
    if (this.ups.length && this.t > 2) notes.push(['SEVİYE ATLADIN! +' + this.ups.length + ' PUAN', C.yellow, true]);
    if (this.daily && this.t > 2.1) notes.push(['SKOR: ' + this.daily.score + (this.daily.best ? '  BUGÜNÜN REKORU!' : ''), C.cyan, true]);
    if (this.record && this.t > 2.2) notes.push(['YENİ REKOR!', C.gold, true]);
    if (this.near && this.t > 2.3) notes.push([this.near, C.salmon]);
    if (this.grew && this.t > 2.4) notes.push(['SERADA ÜRÜNLER BÜYÜDÜ', C.green]);
    if (this.assistUp && this.t > 2.4) notes.push(['YARDIM MODU BİRAZ GÜÇLENDİ', C.sky]);
    if (RUN.grades && this.t > 2.42) { const gs = ['S', 'A', 'B'].filter(k => RUN.grades[k]).map(k => RUN.grades[k] + ' ' + k).join(' · '); if (gs) notes.push(['RİTİM NOTLARI: ' + gs, C.gold]); }
    if (this.league && this.t > 2.45) notes.push(['GALAKSİ LİGİ: ' + this.league + '. SIRA', this.league === 1 ? C.gold : C.lgray, this.league === 1]);
    if (this.done && this.t > 2.5) notes.push([this.done + ' GÖREV TAMAM: PANODAN AL', C.green]);
    for (const [s, c, o] of notes) { if (o) textO(s, W / 2, y, c, 'center'); else text(s, W / 2, y, c, 'center'); y += 11; }
    const btnY = H - SAFE.b - 38;
    const artY = Math.max(y + 34, btnY - 50);
    if (artY + 22 < btnY) {
      const set = heroHorse(RUN.blanket);
      const img = this.won ? set.frames[Math.floor(T * 10) % 4] : set.stand;
      g.globalAlpha = 0.33; ellipse(W / 2, artY + 20, 14, 5, C.ink); g.globalAlpha = 1;
      g.drawImage(img, Math.round(W / 2 - img.width), Math.round(artY - img.height + 18), img.width * 2, img.height * 2);
      if (this.won) spr(ICONS.crown, W / 2 - 5, artY - img.height + 8 - Math.round(Math.abs(Math.sin(this.t * 4)) * 3));
      else for (let i = 0; i < 3; i++) { const kk = (this.t * 0.6 + i / 3) % 1; g.globalAlpha = 1 - kk; text('Z', W / 2 + 14 + kk * 10, artY - 18 - kk * 16, C.lgray); g.globalAlpha = 1; }
    }
    if (this.t > 1.0) { const bw = Math.min(W - 30, 160); const lib = this.won && META.freeTokens > 0 && freeCandidates().length; button('res_farm', W / 2 - bw / 2, btnY, bw, 22, lib ? 'KAPI AÇIK: BİRİNİ EVE GÖNDER' : 'İSTASYONA DÖN', () => go(lib ? 'liberate' : 'farm', { fromRun: true }), { kind: 'primary' }); }
    drawParts(0, 0); drawTexts();
  }
};

// metal deck used by the indoor station scenes (shop, rest)
function stationFloor() {
  rect(0, 0, W, H, C.navy);
  for (let y = 0; y < H; y += 16) {
    const row = y / 16 | 0, off = (row % 2) * 12;
    hline(0, y, W, C.ink); hline(0, y + 1, W, C.slate);
    for (let x = off - 24; x < W; x += 24) { vline(x, y, 16, C.ink); pix(x + 3, y + 4, C.slate); pix(x + 20, y + 12, C.slate); }
  }
}

// the planet of the current cup leg, as seen from the shuttle walkway
const PLANET_PAL = [
  [C.plum, C.purple, C.magenta, C.salmon],   // Lumo Çayırı
  [C.teal, C.ddgreen, C.dgreen, C.green],    // Mantar Ayı
  [C.blue, C.sky, C.cyan, C.white],          // Buz Halkası
  [C.dbrown, C.rust, C.orange0, C.tan],      // Kızıl Kum
  [C.rust, C.orange0, C.tan, C.sand]         // Galaksi Arenası
];
function drawPlanet(x, y, r, reg) {
  const p = PLANET_PAL[clamp(reg | 0, 0, PLANET_PAL.length - 1)], ringed = reg === 2 || reg >= LAST_REGION;
  const ringArc = front => { for (let a = 0; a < Math.PI * 2; a += 0.025) { const sn = Math.sin(a); if (front ? sn < 0 : sn >= 0) continue; pix(Math.round(x + Math.cos(a) * r * 1.7), Math.round(y + sn * r * 0.3), C.cyan); } };
  if (ringed) { g.globalAlpha = 0.6; ringArc(false); g.globalAlpha = 1; }
  circle(x, y, r + 1, C.ink); circle(x, y, r, p[0]); circle(x - 2, y - 2, r - 3, p[1]); circle(x - 5, y - 5, Math.round(r * 0.45), p[2]); circle(x - 7, y - 8, Math.max(1, Math.round(r * 0.15)), p[3]);
  // soft bands / craters so it does not read as a flat disc
  g.globalAlpha = 0.25;
  for (let i = -r + 4; i < r - 2; i += 6) { const dx = Math.floor(Math.sqrt(r * r - i * i)) - 2; if (dx > 2) hline(x - dx, y + i, dx * 2, p[0]); }
  g.globalAlpha = 1;
  if (reg === 1) { circle(x + 6, y + 5, 3, p[0]); circle(x - 8, y + 9, 2, p[0]); circle(x + 9, y - 6, 2, p[0]); }
  if (ringed) ringArc(true);
}

// ================= LIBERATION (v5.3, after Pyre's liberation rites) =================
// Each cup win opens the gate once more: pick one rival whose file you opened and send them home.
// They leave the races for good (one fewer opponent), say goodbye, and leave a gift behind.
SCENES.liberate = {
  enter(arg) {
    this.t = 0; this.sel = arg && arg.pick ? arg.pick : null; this.done = false; this.scroll = 0;
    this.list = freeCandidates();
    if (!this.list.length || !(META.freeTokens > 0)) { go('farm', { fromRun: true }); return; }
    if (this.sel && !this.list.some(r => r.id === this.sel)) this.sel = null;
    Music.layer = 1; Music.play('farm', now() + 0.2, false);
  },
  free(id) {
    if (this.done) return;
    const r = RIVAL_BY_ID[id]; if (!r) return;
    this.done = true;
    META.freed = META.freed || {}; META.freed[id] = true; META.freeTokens = Math.max(0, (META.freeTokens || 0) - 1);
    if (META.nemesis && META.nemesis.id === id) META.nemesis = null;
    META.yonca += 12; META.seker += 1; saveMeta();
    Sound.play('gate'); haptic('success'); flash(C.cyan, 0.3);
    const lines = [[id, RIVAL_BYE[id] || 'HOŞÇA KAL DÜNYALI.']];
    lines.push([npcAvailable('akyel') ? 'akyel' : 'bip', freedCount() >= NAMED_RIVALS.flat().length ? 'SONUNCUSU DA GİTTİ. ARTIK GRAX\'IN ŞOVUNDA KİMSE ZORLA KOŞMUYOR.' : r.name + ' EVİNDE. GERİDE ' + (NAMED_RIVALS.flat().length - freedCount()) + ' KİŞİ KALDI.']);
    Dialog.start(lines, () => { toast('VEDA HEDİYESİ: +12 KRİSTAL +1 ŞEKER', C.cyan, 'gift'); go('farm', { fromRun: true }); });
  },
  update(dt) { this.t += dt; updateFX(dt); },
  key(k) { if (k === 'Escape') { go('farm', { fromRun: true }); return true; } return false; },
  draw() {
    rect(0, 0, W, H, C.ink);
    for (let i = 0; i < 60; i++) { const x = (hash2(i, 61) * W) | 0, y = (hash2(i, 62) * H + T * 6) % H; pix(x, y, i % 4 ? C.slate : C.cyan); }
    // the gate, glowing
    const gx = W / 2, gy = SAFE.t + 54;
    for (let r = 30, i = 0; r > 10; r -= 5, i++) { g.globalAlpha = 0.18 + 0.06 * i + 0.05 * Math.sin(T * 3 + i); ring(gx, gy, r, C.cyan); }
    g.globalAlpha = 1; circle(gx, gy, 9, C.white); circle(gx, gy, 7, C.cyan);
    textO('KAPI AÇIK', W / 2, gy + 36, C.cyan, 'center', 2);
    textBlock('KUPA KAPIYI BİR KEZ DAHA AÇTI. DOSYASINI AÇTIĞIN BİR RAKİBİ EVİNE GÖNDER. GİDEN BİR DAHA PİSTE ÇIKMAZ.', W / 2, gy + 56, W - 24, C.lgray, 'center');
    const top = gy + 88, rowH = 30, bw = Math.min(W - 16, 220), bx = Math.round(W / 2 - bw / 2);
    const maxRows = Math.max(3, Math.floor((H - SAFE.b - 60 - top) / rowH));
    this.list.slice(0, maxRows).forEach((r, i) => {
      const y = top + i * rowH, info = RIVAL_INFO[r.id] || {}, sel = this.sel === r.id;
      rrect(bx - 1, y - 1, bw + 2, rowH - 2, sel ? C.cyan : C.ink); rrect(bx, y, bw, rowH - 4, sel ? C.slate : C.navy);
      if (PORTRAIT[r.id]) { const p = PORTRAIT[r.id]; g.drawImage(p, 6, 2, 16, 20, bx + 3, y + 2, 16, 20); }
      text(r.name, bx + 24, y + 3, STYLE_COL[r.style] || C.white);
      text(info.home || '', bx + 24, y + 13, C.gray);
      UI.add('lib_' + r.id, bx, y, bw, rowH - 4, () => { this.sel = r.id; Sound.play('select'); });
    });
    const by = H - SAFE.b - 34, half = Math.floor((bw - 6) / 2);
    button('lib_later', bx, by, half, 20, 'SONRA', () => go('farm', { fromRun: true }), { kind: 'secondary' });
    button('lib_go', bx + half + 6, by, half, 20, 'EVE GÖNDER', () => this.free(this.sel), { kind: 'green', disabled: !this.sel || this.done });
    text('EVE GÖNDERME HAKKI: ' + (META.freeTokens || 0), W / 2, by - 12, C.yellow, 'center');
    drawParts(0, 0); drawTexts(); drawFlash();
  }
};
