// ================= HUB: ARENA-9 STATION, EARTH MODULE (scene key stays 'farm') =================
const BLANKETS = [null, C.red, C.sky, C.green, C.purple, C.gold, C.white, C.ink];
const CROP_BIG = {};
function cropBig(type, st) { const k = type + st; return CROP_BIG[k] || (CROP_BIG[k] = scaleSprite(CROP[type][st], 2)); }
const CROP_TYPES = [null, 'havuc', 'pancar'];

const MAP_NAMES = { ev: 'KAMARA', ahir: 'AHIR', pano: 'GÖREVLER', ambar: 'YEM DEPOSU', silahhane: 'CEPHANELİK', nalbant: 'NAL ATÖLYESİ', tapinak: 'GÖZLEMEVİ',
  jokey: 'KOĞUŞ', veteriner: 'REVİR', pazar: 'MOKO', anit: 'VİTRİN' };
SCENES.farm = {
  enter(arg) {
    this.arg = arg || {}; this.panel = null; this.page = null; this.walk = null; this.t = 0; this.confirmReset = false;
    this.fx = null; this.dragS = null; this.vy = 0; this.hearts = []; this.seed = this.seed || 'havuc';
    const hr = new Date().getHours(); this.night = window.__night != null ? !!window.__night : (hr >= 20 || hr < 6);
    this.layout();
    this.hx = this.L.yard.x; this.hy = this.L.yard.y; this.dir = 2;
    this.camY = clamp(this.hy - H * 0.6, 0, this.maxCam);
    if (this.arg.fromRun) this.camY = this.maxCam;
    this.chicks = [0, 1, 2].map(i => ({ x: W * (0.25 + i * 0.25), y: this.L.yard.y - 6 + i * 5, vx: 0, vy: 0, t: rnd() * 3, f: 0 }));
    this.dog = { x: this.L.kulube.x + 10, y: this.L.kulube.y + 26, vx: 0, vy: 0, t: 1, f: 0 };
    Music.layer = 3; Music.play('farm', now() + 0.15, false);
    ensureMissions(); checkDaily(); fixCrops(); saveMeta();
    this.introAt = 0.45; this.introDone = false;
  },
  resize() { this.layout(); this.camY = clamp(this.camY, 0, this.maxCam); },
  hasDog() { return META.stats.runs >= 3; },
  bImg(k) {
    if (k === 'ev' || k === 'pano' || k === 'gate' || k === 'anit' || k === 'kulube') return BLD[k];
    if (k === 'pazar') return BLD.pazar;
    return BLD[k + (built(k) ? '' : 'X')];
  },
  layout() {
    const cx = Math.round(W / 2); this.colX = cx;
    const top = SAFE.t + 44;
    const L = this.L = {};
    const put = (k, x, y) => { const img = this.bImg(k); L[k] = { x: Math.round(x), y: Math.round(y), w: img.width, h: img.height }; };
    const R1 = top, R2 = top + 64, R3 = top + 130, R4 = top + 194, R5 = top + 256, R6 = top + 318;
    put('ev', 3, R1); put('ahir', W - 59, R1 - 4);
    put('ambar', 3, R2 - 6); put('nalbant', W - 51, R2); put('pano', cx - 38, R2 + 16);
    put('silahhane', 3, R3); put('jokey', W - 49, R3);
    put('veteriner', 3, R4); put('tapinak', W - 49, R4 - 4);
    L.bahce = { x: 4, y: R5, w: 62, h: 44 };
    put('pazar', W - 47, R5 + 6); put('kulube', cx + 8, R5 - 4);
    put('anit', cx - 44, R6); put('gate', cx - 30, R6 + 50);
    for (const k in L) L[k].door = { x: Math.round(L[k].x + L[k].w / 2), y: L[k].y + L[k].h + 5 };
    L.gate.door = { x: cx, y: L.gate.y - 6 };
    L.bahce.door = { x: L.bahce.x + L.bahce.w / 2, y: L.bahce.y + L.bahce.h + 4 };
    L.yard = { x: cx + 26, y: R6 + 26 };
    this.decorPos = {
      cicek: [6, R1 + 47], saman: [W - 23, R1 + 47], fener: [cx - 15, R3 + 18], bayrak: [cx - 20, L.gate.y - 13],
      agac: [W - 26, R6 + 2], kuyu: [cx + 26, R6 - 2], cesme: [cx + 48, R6 + 24], heykel: [6, R6 + 2]
    };
    this.worldH = L.gate.y + L.gate.h + 44 + SAFE.b;
    this.maxCam = Math.max(0, this.worldH - H);
  },
  // ---------- navigation ----------
  walkTo(k, then) {
    if (this.walk || this.panel || Dialog.active()) return;
    const d = this.L[k].door, pts = [];
    if (Math.abs(this.hx - this.colX) > 2) pts.push({ x: this.colX, y: this.hy });
    pts.push({ x: this.colX, y: d.y }); pts.push({ x: d.x, y: d.y });
    this.walk = { pts, then }; Sound.play('hoof');
  },
  trotTo(x, y) {
    if (this.walk || this.panel) return;
    this.walk = { pts: [{ x: clamp(x, 8, W - 8), y: clamp(y, this.L.ev.y + 50, this.worldH - 40) }], then: null };
  },
  open(k) {
    if (k === 'gate') { this.panel = 'gate'; return; }
    if (k === 'pazar' && !META.flags.moko) { Dialog.start([['bip', 'BU KÖŞE BOŞ. UZAY PAZARINDA MOKO\'YLA TANIŞIRSAN BURAYA BİR TEZGAH KURAR.']]); return; }
    if (k === 'kulube') { this.petDog(); return; }
    if (BUILDINGS[k] && !built(k)) { this.panel = 'repair:' + k; return; }
    this.panel = k;
  },
  focusGoal() {
    const gl = nextGoal(), t = gl.target;
    if (t === 'gate') { this.panel = 'gate'; return; }
    if (t === 'npc') { const k = Object.keys(NPC_NAMES).find(n => npcAvailable(n) && META.bond[n] < 3); if (k) this.panel = 'npc:' + k; return; }
    if (t === 'ev' && gl.text.startsWith('KAPI AÇIK')) this.defTab = 'rakip';
    if (this.L[t]) { this.camY = clamp(this.L[t].y - H * 0.4, 0, this.maxCam); this.walkTo(t, () => this.open(t)); }
  },
  npcSpots() {
    const L = this.L, out = [];
    out.push({ k: 'bip', x: L.ev.x + 42, y: L.ev.y + 30 });
    out.push({ k: 'ayse', x: L.gate.x + 70, y: L.gate.y + 10 });
    const others = ['kemal', 'tayfun'].filter(k => npcAvailable(k));
    others.forEach((k, i) => out.push({ k, x: L.jokey.x - 8 + i * 12, y: L.jokey.y + 30 + i * 4 }));
    if (META.flags.moko) out.push({ k: 'moko', x: L.pazar.x + 16, y: L.pazar.y + 8 });
    if (npcAvailable('akyel')) out.push({ k: 'akyel', x: L.anit.x + 34, y: L.anit.y + 6 });
    return out;
  },
  petHorse() {
    Sound.play('nicker'); haptic('light');
    for (let i = 0; i < 4; i++) this.hearts.push({ x: this.hx + (rnd() - 0.5) * 14, y: this.hy - 12 - rnd() * 6, t: 1.2 + rnd() * 0.4 });
    if (!META.petted) { META.petted = true; saveMeta(); toast('YILDIZ MUTLU! SONRAKİ KOŞU +' + [5, 5, 5, 10, 15][bl('ahir')] + ' KOMBOYLA BAŞLAR', C.salmon, 'heartS'); }
  },
  petDog() {
    if (!this.hasDog()) return;
    Sound.play('squeak'); haptic('light');
    for (let i = 0; i < 3; i++) this.hearts.push({ x: this.dog.x + (rnd() - 0.5) * 10, y: this.dog.y - 8, t: 1 + rnd() * 0.4 });
    if (META.flags.dogDay !== todayStr()) {
      META.flags.dogDay = todayStr(); const n = 2 + Math.floor(Math.random() * 3); META.yonca += n; saveMeta();
      toast('ZIPZIP ETRAFI KOKLADI: +' + n + ' KRİSTAL!', C.cyan, 'clover'); Sound.play('clover');
    }
  },
  // ---------- input ----------
  down(x, y) { this.dragS = { y0: y, cam0: this.camY, ly: y, lt: now(), v: 0 }; this.vy = 0; },
  drag(x, y) {
    const d = this.dragS; if (!d || this.panel || Dialog.active()) return;
    const t = now(), dt = Math.max(0.001, t - d.lt);
    d.v = lerp(d.v, -(y - d.ly) / dt, 0.5); d.ly = y; d.lt = t;
    this.camY = clamp(d.cam0 - (y - d.y0), 0, this.maxCam);
  },
  up(x, y, swiped) { if (this.dragS && swiped && !this.panel) this.vy = clamp(this.dragS.v, -900, 900); this.dragS = null; },
  tap(x, y) {
    if (this.panel || Dialog.active()) return;
    const wy = y + this.camY;
    const hitBox = (cx, cy, w, h) => x >= cx - w / 2 && x <= cx + w / 2 && wy >= cy - h / 2 && wy <= cy + h / 2;
    if (hitBox(this.hx, this.hy, 22, 22)) { this.petHorse(); return; }
    for (const n of this.npcSpots()) if (hitBox(n.x, n.y + 6, 16, 22)) { this.panel = 'npc:' + n.k; Sound.play('select'); return; }
    if (this.hasDog() && hitBox(this.dog.x, this.dog.y, 14, 14)) { this.petDog(); return; }
    const L = this.L;
    const keys = ['ev', 'ahir', 'ambar', 'nalbant', 'pano', 'silahhane', 'jokey', 'veteriner', 'tapinak', 'bahce', 'pazar', 'kulube', 'anit', 'gate'];
    const order = keys.filter(k => L[k]).sort((a, b) => (L[b].y + L[b].h) - (L[a].y + L[a].h));
    for (const k of order) {
      const b = L[k];
      if (x >= b.x && x <= b.x + b.w && wy >= b.y && wy <= b.y + b.h + 4) {
        if (k === 'kulube' && !this.hasDog()) continue;
        this.fx = { k, t: 0.4 };
        if (k === 'ev' || k === 'anit') { this.panel = k; Sound.play('select'); return; }
        this.walkTo(k, () => this.open(k));
        return;
      }
    }
    this.trotTo(x, wy);
  },
  key(k) {
    if (k === 'Escape') { this.panel = null; this.page = null; return true; }
    if (k === 'Enter' && !this.panel) { this.panel = 'gate'; return true; }
    if (k === 'ArrowDown' && !this.panel) { this.camY = clamp(this.camY + 40, 0, this.maxCam); return true; }
    if (k === 'ArrowUp' && !this.panel) { this.camY = clamp(this.camY - 40, 0, this.maxCam); return true; }
    return false;
  },
  swipe() { },
  // ---------- update ----------
  update(dt) {
    this.t += dt;
    if (!this.introDone && this.t > this.introAt && Trans.dir === 0) {
      this.introDone = true;
      const st = STORY.find(s => !META.seen[s.id] && s.cond());
      let react = null;
      const afterDlg = () => { if (META.daily.pending) this.panel = 'daily'; };
      if (st) { META.seen[st.id] = true; saveMeta(); Dialog.start(st.lines, afterDlg); }
      else if (this.arg.fromRun && (react = pickReaction())) { saveMeta(); Dialog.start(react, afterDlg); }
      else if (this.arg.fromRun && Math.random() < 0.4) Dialog.start([TIPS[Math.floor(Math.random() * TIPS.length)]], afterDlg);
      else afterDlg();
    }
    if (!this.dragS && Math.abs(this.vy) > 4) { this.camY = clamp(this.camY + this.vy * dt, 0, this.maxCam); this.vy *= Math.pow(0.04, dt); if (this.camY <= 0 || this.camY >= this.maxCam) this.vy = 0; }
    if (this.walk) {
      const p = this.walk.pts[0], sp = 280 * dt;
      const dx = p.x - this.hx, dy = p.y - this.hy, d = Math.hypot(dx, dy);
      if (d <= sp) { this.hx = p.x; this.hy = p.y; this.walk.pts.shift(); if (!this.walk.pts.length) { const th = this.walk.then; this.walk = null; this.dir = 2; if (th) th(); } }
      else { this.hx += dx / d * sp; this.hy += dy / d * sp; this.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0); }
      if (!this.dragS) { const want = clamp(this.hy - H * 0.55, 0, this.maxCam); if (Math.abs(want - this.camY) > H * 0.25) this.camY = lerp(this.camY, want, Math.min(1, dt * 4)); }
    }
    const Ly = this.L.yard.y;
    for (const c of this.chicks) {
      c.t -= dt;
      if (c.t <= 0) { c.t = 1 + Math.random() * 2.5; const a = Math.random() * Math.PI * 2; const s = Math.random() < 0.4 ? 0 : 14; c.vx = Math.cos(a) * s; c.vy = Math.sin(a) * s * 0.5; }
      c.x = clamp(c.x + c.vx * dt, 12, W - 12); c.y = clamp(c.y + c.vy * dt, Ly - 22, Ly + 14);
      c.f = (c.vx || c.vy) ? Math.floor(this.t * 8) % 2 : 0;
    }
    if (this.hasDog()) {
      const d = this.dog, home = this.L.kulube;
      d.t -= dt;
      if (d.t <= 0) { d.t = 1.5 + Math.random() * 3; const a = Math.random() * Math.PI * 2, s = Math.random() < 0.5 ? 0 : 22; d.vx = Math.cos(a) * s; d.vy = Math.sin(a) * s * 0.6; }
      d.x = clamp(d.x + d.vx * dt, home.x - 30, home.x + 50); d.y = clamp(d.y + d.vy * dt, home.y + 20, home.y + 46);
      d.f = (d.vx || d.vy) ? Math.floor(this.t * 9) % 2 : 0;
    }
    for (const h of this.hearts) { h.t -= dt; h.y -= 14 * dt; }
    this.hearts = this.hearts.filter(h => h.t > 0);
    if (built('nalbant') && Math.random() < dt * 5) { const L = this.L.nalbant; addPart(L.x + 38, L.y + 1, (Math.random() - 0.3) * 4, -10 - Math.random() * 6, 1.6, Math.random() < 0.5 ? C.lgray : C.gray, 2, -2); }
    if (META.decor.cesme && Math.random() < dt * 14) { const p = this.decorPos.cesme; addPart(p[0] + 10, p[1] + 3, (Math.random() - 0.5) * 16, -16 - Math.random() * 10, 0.6, Math.random() < 0.5 ? C.cyan : C.white, 1, 60); }
    if (built('tapinak') && Math.random() < dt * 3) { const L = this.L.tapinak; addPart(L.x + 23 + (Math.random() - 0.5) * 8, L.y + 22, 0, -12, 1.2, Math.random() < 0.5 ? C.magenta : C.white, 1, -4); }
    if (this.fx) { this.fx.t -= dt; if (this.fx.t <= 0) this.fx = null; }
    if (this.upFx) { this.upFx.t -= dt; if (this.upFx.t <= 0) this.upFx = null; }
    updateFX(dt);
  },
  // ---------- drawing ----------
  draw() {
    const L = this.L, oy = -Math.round(this.camY);
    this.drawDeck(oy);
    // walkways with floor lights
    const walkV = (x, ya, yb) => { const t = Math.min(ya, yb), hh = Math.abs(yb - ya); rect(x - 5, t + oy, 10, hh, C.ink); rect(x - 4, t + oy, 8, hh, C.dgray); for (let y = Math.ceil(t / 6) * 6; y < t + hh; y += 6) pix(x, y + oy, C.gray); };
    const walkH = (y, xa, xb) => { const l = Math.min(xa, xb), w = Math.abs(xb - xa); rect(l, y - 5 + oy, w, 10, C.ink); rect(l, y - 4 + oy, w, 8, C.dgray); for (let x = Math.ceil(l / 6) * 6; x < l + w; x += 6) pix(x, y + oy, C.gray); };
    walkV(this.colX, L.ev.door.y - 4, L.gate.y + 34);
    for (const k of ['ev', 'ahir', 'ambar', 'nalbant', 'silahhane', 'jokey', 'veteriner', 'tapinak', 'pazar', 'bahce']) { walkH(L[k].door.y, L[k].door.x, this.colX); walkV(L[k].door.x, L[k].door.y - 6, L[k].door.y + 4); }
    for (let y = Math.ceil((L.ev.door.y - 4) / 16) * 16; y < L.gate.y + 34; y += 16) { const on = Math.floor(T * 2 + y / 16) % 3 !== 0; pix(this.colX - 5, y + oy, on ? C.cyan : C.slate); pix(this.colX + 4, y + 8 + oy, on ? C.cyan : C.slate); }
    // landing pad where Yıldız waits
    const yd = L.yard;
    ellipse(yd.x, yd.y + 7 + oy, 14, 6, C.ink); ellipse(yd.x, yd.y + 7 + oy, 13, 5, C.slate); ellipse(yd.x, yd.y + 7 + oy, 10, 3, C.dgray);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; pix(yd.x + Math.round(Math.cos(a) * 12), yd.y + 7 + Math.round(Math.sin(a) * 5) + oy, i % 2 ? C.yellow : C.ink); }
    // a window to space below the railing: Earth is a tiny blue dot out there
    const fy = L.gate.y + 20;
    this.drawSpaceWindow(fy + 3, oy);
    // railing
    for (let x = 2; x < W - 2; x += 8) { if (x > L.gate.x - 4 && x < L.gate.x + 62) continue; rect(x, fy - 6 + oy, 2, 9, C.gray); pix(x, fy - 6 + oy, C.lgray); }
    rect(0, fy - 4 + oy, L.gate.x, 1, C.cyan); rect(L.gate.x + 60, fy - 4 + oy, W, 1, C.cyan);
    rect(0, fy + oy, L.gate.x, 1, C.slate); rect(L.gate.x + 60, fy + oy, W, 1, C.slate);
    // actors sorted by y
    const actors = [];
    for (const k of ['ev', 'ahir', 'ambar', 'nalbant', 'pano', 'silahhane', 'jokey', 'veteriner', 'tapinak', 'pazar', 'anit']) actors.push({ y: L[k].y + L[k].h, k });
    if (this.hasDog()) { actors.push({ y: L.kulube.y + L.kulube.h, k: 'kulube' }); actors.push({ y: this.dog.y + 3, dog: true }); }
    actors.push({ y: L.bahce.y + L.bahce.h, bahce: true });
    for (const d in META.decor) if (this.decorPos[d] && BLD['d_' + d]) actors.push({ y: this.decorPos[d][1] + BLD['d_' + d].height, decor: d });
    actors.push({ y: this.hy + 8, horse: true });
    for (const c of this.chicks) actors.push({ y: c.y + 3, chick: c });
    for (const n of this.npcSpots()) actors.push({ y: n.y + 14, npc: n });
    actors.push({ y: L.gate.y + 30, gate: true });
    actors.sort((a, b) => a.y - b.y);
    for (const a of actors) {
      if (a.k) this.drawBuilding(a.k, oy);
      else if (a.bahce) this.drawGarden(oy);
      else if (a.decor) { const p = this.decorPos[a.decor]; spr(BLD['d_' + a.decor], p[0], p[1] + oy); }
      else if (a.horse) {
        const fr = this.walk ? Math.floor(this.t * 10) % 4 : -1;
        const img = horseDirB(META.blanket && bl('ahir') >= 2 ? META.blanket : null, fr, this.dir);
        g.globalAlpha = 0.3; ellipse(this.hx, this.hy + 8 + oy, 7, 3, C.ink); g.globalAlpha = 1;
        spr(img, Math.round(this.hx - img.width / 2), Math.round(this.hy - img.height / 2 - (this.walk ? (Math.floor(this.t * 10) % 2) : 0)) + oy);
        if (!META.petted && !this.walk && !this.panel && Math.floor(this.t * 1.5) % 3 === 0) spr(ICONS.heartS, this.hx + 6, this.hy - 16 + oy);
      } else if (a.chick) { const c = a.chick; let img = PEOPLE.chick[c.f]; if (c.vx < 0) img = flipCached(img); spr(img, c.x - 3, c.y - 3 + oy); }
      else if (a.dog) { const d = this.dog; let img = PEOPLE.dog[d.f]; if (d.vx < 0) img = flipCached(img); spr(img, d.x - 3, d.y - 4 + oy); }
      else if (a.npc) {
        const n = a.npc, img = PEOPLE[n.k]; spr(img, n.x - 5, n.y + oy + (Math.floor(this.t * 2 + n.x) % 2 ? 0 : -1));
        const canGift = META.seker > 0 && META.bond[n.k] < 3;
        if (canGift && Math.floor(this.t * 2) % 2 === 0) spr(ICONS.gift, n.x - 3, n.y - 9 + oy);
      } else if (a.gate) {
        spr(BLD.gate, L.gate.x, L.gate.y + oy);
        text('YARIŞ', L.gate.x + 30, L.gate.y + 2 + oy, C.wine, 'center');
      }
    }
    drawParts(0, oy);
    for (const h of this.hearts) { g.globalAlpha = clamp(h.t, 0, 1); spr(ICONS.heartS, h.x - 3, h.y + oy); g.globalAlpha = 1; }
    if (this.night) this.drawNight(oy);
    this.drawHUD();
    drawTexts();
    if (!this.panel) {
      const bw = 92, bx = Math.round(W / 2 - bw / 2), by = H - SAFE.b - 30;
      // a run left at the path choice waits here: continue it instead of starting over by accident
      if (META.runSave) button('kos', bx - 14, by, bw + 28, 22, 'KOŞUYA DEVAM ET', () => { restoreRun(); go('doors'); }, { kind: 'primary' });
      else button('kos', bx, by, bw, 22, 'YARIŞA ÇIK', () => { this.panel = 'gate'; }, { kind: 'primary' });
      if (this.maxCam > 4) { const k = this.camY / this.maxCam; rect(W - 3, SAFE.t + 40 + k * (H - SAFE.t - 80), 2, 26, C.ddgreen); }
    }
    if (this.panel) this.drawPanel();
  },
  drawDeck(oy) {
    rect(0, 0, W, H, C.navy);
    const PH = 24, PW = 32, y0 = Math.floor(this.camY / PH) * PH;
    for (let y = y0; y < this.camY + H + PH; y += PH) {
      const row = y / PH | 0, sy = y + oy, off = (row % 2) * 16;
      g.globalAlpha = 0.55; hline(0, sy, W, C.ink); g.globalAlpha = 1;
      for (let x = off - PW; x < W; x += PW) {
        g.globalAlpha = 0.55; vline(x, sy, PH, C.ink); g.globalAlpha = 1;
        hline(x + 1, sy + 1, 5, C.slate); vline(x + 1, sy + 1, 3, C.slate);
        pix(x + 4, sy + 4, C.slate); pix(x + PW - 4, sy + 4, C.slate); pix(x + 4, sy + PH - 4, C.slate); pix(x + PW - 4, sy + PH - 4, C.slate);
        const h = hash2(row, x + 40);
        if (h < 0.05) { // glass floor panel: the stars below
          rect(x + 7, sy + 6, 18, 12, C.ink);
          for (let i = 0; i < 5; i++) { const sx = x + 8 + ((hash2(row + i, x) * 16) | 0), syy = sy + 7 + ((hash2(x + i, row) * 10) | 0); pix(sx, syy, Math.sin(T * 2 + i + row) > 0 ? C.white : C.gray); }
          box(x + 7, sy + 6, 18, 12, C.slate);
        } else if (h > 0.95) { g.globalAlpha = 0.7; for (let i = 0; i < 4; i++) hline(x + 9, sy + 7 + i * 3, 14, C.ink); g.globalAlpha = 1; }
      }
    }
  },
  drawSpaceWindow(wy, oy) {
    const top = wy + oy, bot = this.worldH + oy + 2;
    if (top > H || bot < 0) return;
    rect(0, top, W, bot - top, C.ink);
    for (let i = 0; i < 40; i++) {
      const x = (hash2(i, 91) * W) | 0, y = top + 2 + ((hash2(i, 92) * Math.max(1, bot - top - 4)) | 0);
      pix(x, y, Math.sin(T * 1.5 + i * 1.7) > -0.2 ? (i % 5 ? C.lgray : C.white) : C.slate);
    }
    const ex = W - 30, ey = top + 20;
    circle(ex, ey, 5, C.ink); circle(ex, ey, 4, C.blue); pix(ex - 2, ey - 1, C.green); pix(ex - 1, ey - 1, C.green); pix(ex + 1, ey + 1, C.green); pix(ex - 1, ey - 3, C.white);
    hline(0, top, W, C.slate);
  },
  drawNight(oy) {
    g.globalCompositeOperation = 'multiply'; rect(0, 0, W, H, '#5d6a9e'); g.globalCompositeOperation = 'source-over';
    const L = this.L;
    const glow = (x, y, r) => { g.globalAlpha = 0.3 + 0.06 * Math.sin(T * 3 + x); circle(x, y + oy, r, C.yellow); g.globalAlpha = 0.6; circle(x, y + oy, Math.max(1, r - 3), C.white); g.globalAlpha = 1; };
    glow(L.ev.x + 13, L.ev.y + 22, 5); glow(L.ev.x + 41, L.ev.y + 22, 5);
    if (built('ahir')) glow(L.ahir.x + 27, L.ahir.y + 14, 5);
    if (META.decor.fener) { const p = this.decorPos.fener; glow(p[0] + 3, p[1] + 3, 7); }
    const cyanGlow = (x, y) => { g.globalAlpha = 0.25 + 0.1 * Math.sin(T * 4 + y); circle(x, y + oy, 3, C.cyan); g.globalAlpha = 1; };
    for (let y = Math.ceil((L.ev.door.y - 4) / 32) * 32; y < L.gate.y + 34; y += 32) cyanGlow(this.colX - 5, y);
  },
  drawBuilding(k, oy) {
    const L = this.L[k], img = this.bImg(k);
    let yo = 0;
    if (this.upFx && this.upFx.k === k) yo = -Math.round(Math.sin((1 - this.upFx.t) * Math.PI * 3) * 3 * this.upFx.t);
    else if (this.fx && this.fx.k === k) yo = -Math.round(Math.sin(this.fx.t / 0.4 * Math.PI) * 2);
    const x = L.x, y = L.y + oy + yo;
    if (k === 'pazar' && !META.flags.moko) {
      rect(x + 2, y + 14, L.w - 4, L.h - 14, C.ink); rect(x + 3, y + 15, L.w - 6, L.h - 16, C.slate);
      for (let i = 0; i < L.w - 6; i += 4) { pix(x + 3 + i, y + 15, C.yellow); pix(x + 4 + i, y + 15, C.ink); }
      vline(x + 8, y + 4, 14, C.gray); rect(x + 3, y + 2, 12, 7, C.ink); rect(x + 4, y + 3, 10, 5, C.dgray); text('?', x + 9, y + 1, C.cyan, 'center');
      return;
    }
    spr(img, x, y);
    if (k === 'jokey' && built('jokey')) { const f = Math.floor(this.t * 4) % 2; const s = SILKS.deniz; rect(x + 42, y + 1 + f, 8, 3, s.s); rect(x + 42, y + 4 + f, 8 - f, 3, s.h); }
    if (k === 'anit' && META.stats.wins > 0) spr(ICONS.crown, x + 7, y - 4 + Math.round(Math.sin(this.t * 3)));
    const b = BUILDINGS[k];
    if (b) {
      const lv = bl(k);
      if (lv === 0) {
        const can = META.yonca >= b.up[0] && (!b.rozet || META.rozet >= b.rozet) && (!b.needBoon || META.stats.boons > 0);
        const bx = Math.round(x + L.w / 2 - 14), by = y + Math.round(L.h / 2) - 4;
        rrect(bx - 1, by - 1, 30, 12, C.ink); rrect(bx, by, 28, 10, can ? C.gold : C.navy);
        spr(ICONS.hammer, bx + 2, by + 1);
        text(String(b.up[0]), bx + 18, by + 1, can ? C.ink : C.lgray, 'center');
        if ((b.rozet && META.rozet < b.rozet) || (b.needBoon && META.stats.boons === 0)) spr(ICONS.lock, bx + 24, by - 6);
      } else if (b.max > 1) {
        for (let i = 0; i < b.max; i++) { rect(x + L.w - 4 - (b.max - i) * 4, y + L.h - 4, 3, 3, C.ink); pix(x + L.w - 3 - (b.max - i) * 4, y + L.h - 3, i < lv ? C.yellow : C.slate); }
        if (lv < b.max && META.yonca >= b.up[lv] && !(lv === 3 && META.rozet < LV4_ROZET) && Math.floor(this.t * 2) % 2 === 0) { const ax = x + L.w - 6, ay = y + L.h - 12; text('↑', ax, ay, C.green, 'center'); }
      }
    }
    // name plate so every module says what it is at a glance
    const nm = MAP_NAMES[k];
    if (nm && !(k === 'pazar' && !META.flags.moko)) {
      const tw = textWidth(nm) + 4, px = Math.round(clamp(x + L.w / 2 - tw / 2, 1, W - tw - 1)), py = y + L.h - 2;
      g.globalAlpha = 0.75; rect(px, py, tw, 8, C.ink); g.globalAlpha = 1;
      text(nm, px + 2, py - 1, b && bl(k) === 0 ? C.gray : C.lgray);
    }
    if (k === 'pano' && (META.missions.some(m => m.done) || META.daily.pending)) this.badge(x + L.w - 4, y - 8 + Math.round(Math.sin(this.t * 6)), C.red, '!');
    if (k === 'ahir' && META.points > 0) spr(ICONS.star, x + L.w - 12, y - 2 + Math.round(Math.sin(this.t * 6)));
    if (k === 'ev' && unreadMemories() > 0) spr(ICONS.book, x + 4, y + 4 + Math.round(Math.sin(this.t * 6)));
  },
  badge(x, y, col, ch) { circle(x, y, 5, C.ink); circle(x, y, 4, col); text(ch, x, y - 5, C.white, 'center'); },
  drawGarden(oy) {
    const B = this.L.bahce, x = B.x, y = B.y + oy, lv = bl('bahce');
    rect(x, y + 1, B.w, B.h - 1, C.ink);
    rect(x + 1, y + 2, B.w - 2, B.h - 3, lv ? C.slate : C.navy);
    rect(x + 1, y + 2, B.w - 2, 4, lv ? C.sky : C.dgray); hline(x + 1, y + 2, B.w - 2, lv ? C.cyan : C.slate);
    for (let i = 7; i < B.w - 2; i += 10) vline(x + i, y + 2, 4, C.ink);
    if (!lv) {
      for (let i = 0; i < 9; i++) spr(OB.tuftD, x + 4 + (i * 13) % (B.w - 10), y + 10 + ((i * 7) % (B.h - 18)));
      for (const [cx, cy] of [[12, 3], [35, 4], [48, 2]]) { pix(x + cx, y + cy, C.ink); pix(x + cx + 1, y + cy + 1, C.ink); }
      const can = META.yonca >= BUILDINGS.bahce.up[0];
      const bx = Math.round(x + B.w / 2 - 14), by = y + Math.round(B.h / 2) - 2;
      rrect(bx - 1, by - 1, 30, 12, C.ink); rrect(bx, by, 28, 10, can ? C.gold : C.navy); spr(ICONS.hammer, bx + 2, by + 1); text(String(BUILDINGS.bahce.up[0]), bx + 18, by + 1, can ? C.ink : C.lgray, 'center');
      return;
    }
    if (Math.floor(this.t * 2) % 2 === 0) { pix(x + 3, y + B.h - 3, C.green); pix(x + B.w - 4, y + B.h - 3, C.green); }
    const n = plotCount();
    for (let i = 0; i < 7; i++) {
      const cx = x + 4 + (i % 4) * 14, cy = y + 8 + Math.floor(i / 4) * 17;
      if (i >= n) continue;
      rect(cx, cy + 6, 12, 8, C.ink); rect(cx + 1, cy + 7, 10, 6, C.navy); hline(cx + 1, cy + 9, 10, C.teal); hline(cx + 1, cy + 11, 10, C.teal);
      const c = META.crops[i] || 0;
      if (c > 0) { const tp = CROP_TYPES[Math.floor(c / 10)], st = c % 10; if (tp) { const img = CROP[tp][st]; spr(img, cx + 6 - Math.floor(img.width / 2), cy + 8 - img.height + 3 + (st === 3 ? Math.round(Math.sin(this.t * 4 + i)) : 0)); } }
    }
    { const tw = textWidth('SERA') + 4; g.globalAlpha = 0.75; rect(x + 2, y + B.h - 2, tw, 8, C.ink); g.globalAlpha = 1; text('SERA', x + 4, y + B.h - 3, lv ? C.lgray : C.gray); }
    if (META.crops.slice(0, n).some(c => c > 0 && c % 10 === 3)) this.badge(x + B.w - 4, y - 2 + Math.round(Math.sin(this.t * 6)), C.green, '!');
  },
  drawHUD() {
    const top = SAFE.t + 3;
    rect(0, 0, W, top + 16, C.ink); hline(0, top + 16, W, C.slate);
    let x = 4 + SAFE.l;
    x += iconNum('clover', META.yonca, x, top + 3, C.green) + 7;
    x += iconNum('rozet', META.rozet, x, top + 2, C.sky) + 7;
    if (META.seker > 0 || META.stats.runs > 0) x += iconNum('seker', META.seker, x, top + 4, C.white) + 7;
    const lx = x; text('SV' + META.level, lx, top + 3, C.yellow);
    const lw = textWidth('SV' + META.level);
    bar(lx + lw + 3, top + 6, Math.max(14, W - SAFE.r - 22 - (lx + lw + 3)), 3, META.xp / xpNeed(META.level), C.yellow);
    iconBtn('settings', W - SAFE.r - 17, top, 'gear', () => { if (!this.walk) this.panel = 'settings'; }, 14);
    const gl = nextGoal(); const by = top + 20;
    const bw = Math.min(W - 10, 200), bx = Math.round(W / 2 - bw / 2);
    rrect(bx - 1, by - 1, bw + 2, 15, C.ink); rrect(bx, by, bw, 13, C.navy);
    const ic = ICONS[gl.icon]; if (ic) spr(ic, bx + 3, by + Math.round(6.5 - ic.height / 2));
    const label = 'HEDEF: ' + gl.text, maxw = bw - (gl.need ? 20 + textWidth(gl.need + '/' + gl.need) + 6 : 20);
    text(textWidth(label) > maxw ? gl.text : label, bx + 16, by + 1, C.white);
    // goal progress: numbers on the right, a thin fill along the bottom edge
    if (gl.need) { const ok = gl.cur >= gl.need; text(Math.min(gl.cur, gl.need) + '/' + gl.need, bx + bw - 4, by + 1, ok ? C.green : C.gold, 'right'); hline(bx + 1, by + 12, Math.round((bw - 2) * clamp(gl.cur / gl.need, 0, 1)), ok ? C.green : C.gold); }
    UI.add('goal', bx, by, bw, 13, () => this.focusGoal());
  },
  // ---------- panels ----------
  panelBox(title, h, w) {
    w = w || Math.min(W - 10, 226);
    h = Math.min(h, H - SAFE.t - SAFE.b - 8);
    const x = Math.round(W / 2 - w / 2), y = Math.round(SAFE.t + (H - SAFE.t - SAFE.b - h) / 2);
    UI.block(0, 0, W, H, (px, py) => { if (px < x || px > x + w || py < y || py > y + h) this.closePanel(); });
    g.globalAlpha = 0.55; rect(0, 0, W, H, C.ink); g.globalAlpha = 1;
    panel(x, y, w, h, title);
    button('pclose', x + w - 14, y + 2, 11, 10, 'X', () => this.closePanel(), { kind: 'red', hitPad: 5 });
    return { x, y, w, h };
  },
  closePanel() { if (this.panel === 'calib') { Calib.st = null; Music.play('farm', now() + 0.2, false); } this.panel = null; this.page = null; this.confirmReset = false; this.defTab = null; },
  drawPanel() {
    const p = this.panel;
    if (p.startsWith('repair:')) return this.pRepair(p.slice(7));
    if (p.startsWith('npc:')) return this.pNpc(p.slice(4));
    const fn = {
      ahir: this.pAhir, pano: this.pPano, ambar: this.pAmbar, nalbant: this.pNalbant, jokey: this.pJokey, veteriner: this.pVet, gate: this.pGate,
      settings: this.pSettings, daily: this.pDaily, calib: this.pCalib, silahhane: this.pSilah, tapinak: this.pTapinak, bahce: this.pBahce, pazar: this.pPazar, anit: this.pAnit, ev: this.pEv
    }[p];
    if (fn) fn.call(this);
  },
  // building upgrades: the next level (what it does, what it costs, how much is missing) and the road after it
  upgradeInfo(k) {
    const b = BUILDINGS[k], lv = bl(k), pw = Math.min(W - 10, 226);
    if (lv >= b.max) return { lv, max: true };
    const next = wrapText('SV' + (lv + 1) + ': ' + b.upDesc[lv], pw - 84);
    const later = [];
    for (let i = lv + 1; i < b.max; i++) later.push(...wrapText('SV' + (i + 1) + ' (' + b.up[i] + '): ' + b.upDesc[i], pw - 16));
    return { lv, next, later, cost: b.up[lv] };
  },
  upgradeH(k) { const u = this.upgradeInfo(k); if (u.max) return 18; return 16 + Math.max(2, u.next.length) * 9 + u.later.length * 9 + 2; },
  upgradeRow(P, k, y) {
    const b = BUILDINGS[k], u = this.upgradeInfo(k), lv = u.lv;
    hline(P.x + 6, y, P.w - 12, C.slate); y += 5;
    for (let i = 0; i < b.max; i++) { rect(P.x + 8 + i * 6, y + 1, 5, 5, C.ink); rect(P.x + 9 + i * 6, y + 2, 3, 3, i < lv ? C.yellow : C.slate); }
    text('SEVİYE ' + lv + '/' + b.max, P.x + 12 + b.max * 6, y, C.lgray);
    if (u.max) { text('EN ÜST!', P.x + P.w - 8, y, C.green, 'right'); return y + 12; }
    u.next.forEach((ln, i) => text(ln, P.x + 8, y + 10 + i * 9, C.sky));
    const lock = lv === 3 && META.rozet < LV4_ROZET, can = META.yonca >= u.cost && !lock;
    button('up_' + k, P.x + P.w - 66, y + 2, 58, 15, String(u.cost), () => this.doUpgrade(k), { icon: lock ? 'lock' : 'clover', disabled: !can });
    text(lock ? LV4_ROZET + ' ROZET GEREK' : can ? 'YÜKSELT' : (u.cost - META.yonca) + ' EKSİK', P.x + P.w - 37, y + 19, can ? C.green : C.salmon, 'center');
    y += 10 + Math.max(2, u.next.length) * 9 + 2;
    u.later.forEach((ln, i) => text(ln, P.x + 8, y + i * 9, C.gray));
    return y + u.later.length * 9;
  },
  doUpgrade(k) {
    const b = BUILDINGS[k], lv = bl(k), cost = b.up[lv];
    if (lv >= b.max || META.yonca < cost || (lv === 3 && META.rozet < LV4_ROZET)) return;
    META.yonca -= cost; META.blv[k] = lv + 1;
    if (k === 'ambar' && lv === 0) { META.foods.havuc = true; if (!META.food) META.food = 'havuc'; }
    if (k === 'ahir' && lv >= 1) { META.points++; toast('+1 SEVİYE PUANI', C.yellow, 'star'); }
    if (k === 'bahce') fixCrops();
    saveMeta(); this.layout();
    Sound.play('repair'); haptic('success');
    const Lb = this.L[k]; if (Lb) burst(Lb.x + Lb.w / 2, Lb.y + Lb.h / 2, 30, [C.yellow, C.white, C.gold, C.green], 70, 1, 60, 2);
    this.upFx = { k, t: 1 };
    toast(lv === 0 ? b.name + ' ONARILDI!' : b.name + ' SEVİYE ' + (lv + 1) + '!', C.green, 'hammer');
    checkFarmPerks();
    if (lv === 0) this.panel = null;
  },
  pRepair(k) {
    const b = BUILDINGS[k], img = k === 'bahce' ? null : this.bImg(k), ih = img ? img.height : 0;
    const lines = wrapText(b.desc, Math.min(W - 10, 226) - 20);
    const later = []; for (let i = 1; i < b.max; i++) later.push(...wrapText('SV' + (i + 1) + ' (' + b.up[i] + ' KRİSTAL): ' + b.upDesc[i], Math.min(W - 10, 226) - 16));
    const h = 30 + ih + lines.length * 9 + 64 + later.length * 9;
    const P = this.panelBox(b.name + ' (ARIZALI)', h);
    if (img) spr(img, P.x + P.w / 2 - img.width / 2, P.y + 20);
    let y = P.y + 24 + ih;
    lines.forEach((ln, i) => text(ln, P.x + P.w / 2, y + i * 9, C.lgray, 'center'));
    y += lines.length * 9 + 3;
    text('ONARINCA: ' + b.upDesc[0], P.x + P.w / 2, y, C.sky, 'center'); y += 10;
    for (const ln of later) { text(ln, P.x + P.w / 2, y, C.gray, 'center'); y += 9; }
    y += 3;
    const needR = b.rozet && META.rozet < b.rozet, needB = b.needBoon && META.stats.boons === 0;
    const cost = b.up[0], can = META.yonca >= cost && !needR && !needB;
    const msg = needR ? 'ÖNCE ' + b.rozet + ' ŞAMPİYON ROZETİ GEREKİR' : needB ? 'ÖNCE BİR YILDIZ GÜCÜ KAZAN' : (can ? 'ONARIM BEDELİ' : (cost - META.yonca) + ' KRİSTAL DAHA LAZIM');
    text(msg, P.x + P.w / 2, y, (needR || needB || !can) ? C.salmon : C.white, 'center');
    button('repair', P.x + P.w / 2 - 45, y + 12, 90, 18, 'ONAR ' + cost, () => this.doUpgrade(k), { icon: 'clover', disabled: !can });
  },
  pAhir() {
    const rowH = 17, lv = bl('ahir');
    const extra = (lv >= 2 ? 24 : 0) + this.upgradeH('ahir') + 4;
    const P = this.panelBox('AHIR MODÜLÜ · ANTRENMAN', 44 + 3 * 11 + SKILLS.length * rowH + 22 + extra);
    let y = P.y + 18;
    text('SEVİYE ' + META.level, P.x + 8, y, C.white);
    bar(P.x + 62, y + 3, P.w - 130, 3, META.xp / xpNeed(META.level), C.yellow);
    text(META.xp + '/' + xpNeed(META.level), P.x + P.w - 64, y, C.lgray);
    y += 11;
    text('PUAN: ' + META.points, P.x + 8, y, META.points ? C.yellow : C.gray);
    const spent = SKILLS.reduce((a, s) => a + (META.skills[s.id] || 0) * s.cost, 0);
    button('sk_reset', P.x + P.w - 60, y - 2, 52, 12, 'SIFIRLA', () => { META.points += spent; META.skills = {}; saveMeta(); Sound.play('select'); }, { kind: 'secondary', disabled: spent === 0 });
    y += 13;
    for (let br = 0; br < 3; br++) {
      text(BRANCHES[br].name, P.x + 8, y, BRANCHES[br].color); hline(P.x + 10 + textWidth(BRANCHES[br].name), y + 4, P.w - 20 - textWidth(BRANCHES[br].name), C.slate);
      y += 11;
      for (const sk of SKILLS.filter(s => s.br === br)) {
        const r = META.skills[sk.id] || 0, maxed = r >= sk.max;
        text(sk.name, P.x + 10, y, C.white);
        text(sk.desc, P.x + 10, y + 8, C.gray);
        for (let i = 0; i < sk.max; i++) { rect(P.x + P.w - 60 + i * 6, y + 2, 5, 5, C.ink); rect(P.x + P.w - 59 + i * 6, y + 3, 3, 3, i < r ? BRANCHES[br].color : C.slate); }
        button('sk_' + sk.id, P.x + P.w - 28, y + 1, 20, 12, maxed ? 'OK' : '+' + (sk.cost > 1 ? sk.cost : ''), () => {
          META.points -= sk.cost; META.skills[sk.id] = r + 1; saveMeta(); Sound.play('power'); haptic('medium');
        }, { disabled: maxed || META.points < sk.cost, kind: 'green' });
        y += rowH;
      }
    }
    if (lv >= 2) {
      text('BATTANİYE', P.x + 8, y + 5, C.lgray);
      BLANKETS.forEach((c, i) => {
        const bx = P.x + 64 + i * 15, by = y + 1, sel = (META.blanket || null) === c;
        rect(bx - 1, by - 1, 14, 14, sel ? C.yellow : C.ink); rect(bx, by, 12, 12, c || C.brown);
        if (!c) { pix(bx + 3, by + 3, C.red); pix(bx + 8, by + 8, C.red); hline(bx + 2, by + 6, 8, C.red); }
        UI.add('bl' + i, bx - 2, by - 2, 16, 16, () => { META.blanket = c; saveMeta(); Sound.play('select'); });
      });
      y += 22;
    }
    this.upgradeRow(P, 'ahir', y + 2);
  },
  pPano() {
    const slots = META.missions.length;
    const showDaily = META.tutorialDone;
    const P = this.panelBox('GÖREV EKRANI', 20 + slots * 30 + 52 + (showDaily ? 30 : 0) + this.upgradeH('pano') + 8);
    let y = P.y + 18;
    const bonus = [1, 1, 1, 1.5, 2][bl('pano')];
    for (const m of META.missions) {
      const lines = wrapText(missionText(m), P.w - 76);
      lines.slice(0, 2).forEach((ln, i) => text(ln, P.x + 8, y + i * 9, m.done ? C.green : C.white));
      bar(P.x + 8, y + 20, P.w - 82, 3, m.p / m.n, m.done ? C.green : C.sky);
      text(Math.floor(m.p) + '/' + m.n, P.x + P.w - 72, y + 17, C.gray);
      const yon = Math.round(m.yonca * bonus);
      if (m.done) button('m_' + m.id, P.x + P.w - 42, y + 3, 34, 16, 'AL', () => {
        META.yonca += yon; META.seker += m.seker || 0; const ups = addXP(m.xp);
        META.missions = META.missions.filter(q => q !== m); ensureMissions(); saveMeta();
        Sound.play('buy'); haptic('success'); toast('+' + yon + ' KRİSTAL  +' + m.xp + ' XP' + (m.seker ? '  +1 ŞEKER' : ''), C.cyan, 'clover');
        if (ups.length) { Sound.play('level'); toast('SEVİYE ' + META.level + '! AHIRDA PUAN SENİ BEKLİYOR', C.yellow, 'star'); }
      }, { kind: 'green' });
      else {
        spr(ICONS.clover, P.x + P.w - 42, y + 1); text(String(yon), P.x + P.w - 32, y + 1, C.green);
        text(m.xp + 'XP', P.x + P.w - 42, y + 10, C.yellow);
        if (m.seker) spr(ICONS.seker, P.x + P.w - 16, y + 10);
      }
      y += 30;
    }
    text('GÜNLÜK ERZAK', P.x + 8, y, C.yellow); y += 11;
    const bw = Math.floor((P.w - 16 - 6 * 3) / 7), cur = META.daily.count % 7;
    for (let i = 0; i < 7; i++) {
      const bx = P.x + 8 + i * (bw + 3), isToday = i === cur && META.daily.pending;
      rrect(bx, y, bw, 22, isToday ? C.gold : i < cur ? C.ddgreen : C.slate);
      text(String(i + 1), bx + bw / 2, y + 1, isToday ? C.ink : C.lgray, 'center');
      text(String(DAILY[i]), bx + bw / 2, y + 11, isToday ? C.ink : C.white, 'center');
      if (DAILY_SUGAR[i]) spr(ICONS.seker, bx + bw - 7, y - 3);
    }
    y += 26;
    if (META.daily.pending) button('dly', P.x + P.w / 2 - 40, y, 80, 14, 'ERZAĞI AL', () => this.claimDailyFx(), { kind: 'green' });
    else text('YARIN YİNE GEL!', P.x + P.w / 2, y + 3, C.gray, 'center');
    y += 18;
    if (showDaily) {
      const best = META.dailyRun.best[todayStr()] || 0;
      hline(P.x + 6, y, P.w - 12, C.slate); y += 4;
      text('GÜNÜN KOŞUSU', P.x + 8, y + 1, C.cyan);
      text(best ? 'BUGÜN EN İYİ: ' + best : 'AYNI YOL, TEK SKOR', P.x + 8, y + 11, C.lgray);
      button('dailyrun', P.x + P.w - 62, y + 2, 54, 16, 'KOŞ', () => { this.panel = null; META.runSave = null; newRun({ daily: true }); saveMeta(); go('run', firstNode()); }, { kind: 'blue' });
      y += 26;
    }
    this.upgradeRow(P, 'pano', y);
  },
  claimDailyFx() {
    const a = claimDaily(); Sound.play('clover'); haptic('success');
    toast('+' + a.amt + ' KRİSTAL' + (a.sg ? '  +' + a.sg + ' ŞEKER' : ''), C.cyan, 'clover');
  },
  listRows(P, items, y, rowH) {
    rowH = rowH || 30;
    for (const it of items) {
      if (it.icon2) spr(it.icon2, P.x + 8, y + (it.icon2.height > 12 ? 1 : 2));
      const tx = P.x + (it.icon2 ? it.icon2.width + 12 : 10);
      text(it.name, tx, y, it.sel ? C.yellow : C.white);
      const lines = wrapText(it.desc, P.w - (tx - P.x) - 70);
      lines.slice(0, 2).forEach((ln, i) => text(ln, tx, y + 9 + i * 8, C.gray));
      button(it.id, P.x + P.w - 62, y + 2, 54, 15, it.label, it.fn, { kind: it.kind || 'primary', disabled: it.disabled, icon: it.icon });
      y += rowH;
    }
    return y;
  },
  pAmbar() {
    const keys = Object.keys(FOODS), two = bl('ambar') >= 2;
    const P = this.panelBox('YEM DEPOSU', 30 + keys.length * 30 + this.upgradeH('ambar') + 10);
    text(two ? 'İKİ YEM SEÇEBİLİRSİN' : 'KOŞUDAN ÖNCE BİR YEM SEÇ', P.x + P.w / 2, P.y + 18, C.lgray, 'center');
    const y = this.listRows(P, keys.map(k => {
      const f = FOODS[k], own = !!META.foods[k], s1 = META.food === k, s2 = META.food2 === k;
      if (own) {
        const label = s1 ? 'YEM 1' : s2 ? 'YEM 2' : 'SEÇ';
        return { id: 'f_' + k, name: f.name, desc: f.desc, icon2: itemArt('food_' + k), sel: s1 || s2, label, kind: (s1 || s2) ? 'secondary' : 'green', fn: () => {
          if (s1) { META.food = null; if (two && META.food2) { META.food = META.food2; META.food2 = null; } }
          else if (s2) META.food2 = null;
          else if (!META.food) META.food = k;
          else if (two && !META.food2) META.food2 = k;
          else META.food = k;
          saveMeta(); Sound.play('select');
        } };
      }
      return { id: 'f_' + k, name: f.name, desc: f.desc, icon2: itemArt('food_' + k), label: String(f.cost), icon: 'clover', disabled: META.yonca < f.cost, fn: () => { META.yonca -= f.cost; META.foods[k] = true; if (!META.food) META.food = k; else if (two && !META.food2) META.food2 = k; saveMeta(); Sound.play('buy'); haptic('success'); } };
    }), P.y + 30);
    this.upgradeRow(P, 'ambar', y + 2);
  },
  pNalbant() {
    const keys = Object.keys(NALS);
    const P = this.panelBox('NAL ATÖLYESİ', 30 + keys.length * 30 + this.upgradeH('nalbant') + 10);
    text('NAL OYUN TARZINI DEĞİŞTİRİR', P.x + P.w / 2, P.y + 18, C.lgray, 'center');
    const y = this.listRows(P, keys.map(k => {
      const n = NALS[k], own = !!META.nals[k], sel = META.nal === k;
      if (own) return { id: 'n_' + k, name: n.name, desc: n.desc, icon2: itemArt('nal_' + k), sel, label: sel ? 'TAKILI' : 'TAK', kind: sel ? 'secondary' : 'green', fn: () => { META.nal = k; saveMeta(); Sound.play('select'); } };
      return { id: 'n_' + k, name: n.name, desc: n.desc, icon2: itemArt('nal_' + k), label: String(n.cost), icon: 'clover', disabled: META.yonca < n.cost, fn: () => { META.yonca -= n.cost; META.nals[k] = true; META.nal = k; saveMeta(); Sound.play('repair'); haptic('success'); } };
    }), P.y + 30);
    this.upgradeRow(P, 'nalbant', y + 2);
  },
  pSilah() {
    const keys = Object.keys(WEAPONS);
    const P = this.panelBox('CEPHANELİK', 30 + keys.length * 38 + this.upgradeH('silahhane') + 10);
    text('EYERDEKİ SİLAH RİTİMLE ATEŞ EDER', P.x + P.w / 2, P.y + 18, C.lgray, 'center');
    let y = P.y + 30;
    for (const k of keys) {
      const w = WEAPONS[k], own = !!META.weapons[k], sel = META.weapon === k, lv = META.wlv[k] || 1;
      const wart = itemArt('w_' + k);
      if (wart) { if (sel) rrect(P.x + 5, y - 1, 18, 18, C.slate); spr(wart, P.x + 6, y); }
      else { circle(P.x + 14, y + 8, 8, C.ink); circle(P.x + 14, y + 8, 7, sel ? C.slate : C.navy); sprC(ICONS[w.icon], P.x + 14, y + 8); }
      text(w.name, P.x + 26, y, sel ? C.yellow : C.white);
      if (own) for (let i = 0; i < 3; i++) { rect(P.x + 28 + textWidth(w.name) + i * 5, y + 2, 4, 4, C.ink); pix(P.x + 29 + textWidth(w.name) + i * 5, y + 3, i < lv ? C.yellow : C.slate); }
      wrapText(w.desc, P.w - 34).slice(0, 2).forEach((ln, i) => text(ln, P.x + 26, y + 20 + i * 8, C.gray));
      if (!own) button('w_' + k, P.x + P.w - 62, y + 3, 54, 15, String(w.cost), () => { META.yonca -= w.cost; META.weapons[k] = true; META.wlv[k] = 1; META.weapon = k; saveMeta(); Sound.play('repair'); haptic('success'); toast(w.name + ' EYERE TAKILDI!', C.yellow, w.icon); }, { icon: 'clover', disabled: META.yonca < w.cost });
      else {
        button('ws_' + k, P.x + P.w - 80, y + 3, 34, 15, sel ? 'TAKILI' : 'TAK', () => { META.weapon = k; saveMeta(); Sound.play('select'); }, { kind: sel ? 'secondary' : 'green' });
        if (lv < 3) { const c = WEAPON_UP[lv]; button('wu_' + k, P.x + P.w - 42, y + 3, 34, 15, String(c), () => { META.yonca -= c; META.wlv[k] = lv + 1; saveMeta(); Sound.play('repair'); haptic('success'); toast(w.name + ' SEVİYE ' + (lv + 1) + ': HASAR +%25', C.yellow, w.icon); }, { icon: 'clover', disabled: META.yonca < c }); }
        else text('MAKS', P.x + P.w - 25, y + 7, C.green, 'center');
      }
      y += 38;
    }
    this.upgradeRow(P, 'silahhane', y);
  },
  pTapinak() {
    const P = this.panelBox('GÖZLEMEVİ', 108 + this.upgradeH('tapinak'));
    textBlock('GÖZDE TAKIMYILDIZINI SEÇ: İLK KAPI ONUN GÜCÜNÜ SUNAR.', P.x + P.w / 2, P.y + 18, P.w - 20, C.lgray, 'center');
    const fsel = () => !!(META.favSpirit && SPIRITS[META.favSpirit]);
    const n = SPIRIT_KEYS.length, cw = Math.min(34, Math.floor((P.w - 16) / n)), x0 = Math.round(P.x + P.w / 2 - n * cw / 2), y = P.y + 44;
    SPIRIT_KEYS.forEach((sp, i) => {
      const s = SPIRITS[sp], cx = x0 + i * cw + cw / 2, sel = META.favSpirit === sp;
      if (sel) { g.globalAlpha = 0.5 + 0.3 * Math.sin(T * 5); circle(cx, y + 10, 13, s.color); g.globalAlpha = 1; }
      circle(cx, y + 10, 11, C.ink); circle(cx, y + 10, 10, sel ? s.color : s.dark);
      const art = spiritArt(sp, 20);
      if (art) { if (!sel && fsel()) g.globalAlpha = 0.55; sprC(art, cx, y + 10); g.globalAlpha = 1; }
      else sprC(tinted(SPIRIT_ICON[sp], sel ? C.ink : s.color), cx, y + 10);
      UI.add('fs_' + sp, cx - cw / 2, y - 2, cw, 26, () => { META.favSpirit = sel ? null : sp; saveMeta(); Sound.play('power'); });
    });
    const fs = META.favSpirit && SPIRITS[META.favSpirit];
    text(fs ? 'GÖZDE: ' + fs.name + ' · ' + fs.desc : 'HENÜZ SEÇİLMEDİ', P.x + P.w / 2, y + 28, fs ? fs.color : C.gray, 'center');
    this.upgradeRow(P, 'tapinak', y + 42);
  },
  pJokey() {
    const keys = Object.keys(JOCKEYS);
    const P = this.panelBox('JOKEY KOĞUŞU', 34 + keys.length * 46 + this.upgradeH('jokey') + 6);
    text('TUTSAK JOKEYLER TEKNİKLERİNİ ÖĞRETİR', P.x + P.w / 2, P.y + 18, C.lgray, 'center');
    let y = P.y + 30;
    for (const k of keys) {
      const j = JOCKEYS[k], open = META.rozet >= j.rozet, sel = META.jockey === k;
      rect(P.x + 7, y, 24, 24, C.ink); rect(P.x + 8, y + 1, 22, 22, C.slate); spr(PORTRAIT[k], P.x + 5, y - 2);
      text(j.name, P.x + 36, y, sel ? C.yellow : C.white);
      text(j.passive, P.x + 36, y + 9, C.gray);
      wrapText(j.ability + ': ' + j.abDesc, P.w - 44).slice(0, 2).forEach((ln, i) => text(ln, P.x + 36, y + 19 + i * 8, C.sky));
      if (open) button('j_' + k, P.x + P.w - 50, y, 42, 14, sel ? 'TAKILI' : 'ÖĞREN', () => { META.jockey = k; saveMeta(); Sound.play('select'); }, { kind: sel ? 'secondary' : 'green' });
      else { spr(ICONS.lock, P.x + P.w - 50, y + 2); text(j.rozet + ' ROZET', P.x + P.w - 40, y + 2, C.salmon); }
      y += 46;
    }
    this.upgradeRow(P, 'jokey', y);
  },
  pVet() {
    const b = BUILDINGS.veteriner, lv = bl('veteriner');
    const P = this.panelBox('REVİR', 44 + b.max * 20 + this.upgradeH('veteriner') + 4);
    textBlock('İKİNCİ NEFES: CANIN BİTİNCE YORGUN DÜŞMEK YERİNE AYAĞA KALKARSIN.', P.x + P.w / 2, P.y + 18, P.w - 20, C.lgray, 'center');
    let y = P.y + 40;
    for (let i = 0; i < b.max; i++) {
      const got = lv > i;
      rrect(P.x + 8, y, P.w - 16, 16, got ? C.ddgreen : C.slate);
      text('SEVİYE ' + (i + 1) + ': ' + b.upDesc[i], P.x + 14, y + 4, got ? C.green : C.lgray);
      if (got) spr(ICONS.check, P.x + P.w - 20, y + 4);
      y += 20;
    }
    this.upgradeRow(P, 'veteriner', y);
  },
  pBahce() {
    const n = plotCount(), rows = Math.ceil(n / 4);
    const P = this.panelBox('SERA', 58 + rows * 44 + 20 + this.upgradeH('bahce'));
    let y = P.y + 18;
    const seeds = [['havuc', 'HAVUÇ', '6 KRİSTAL · 3 KOŞU'], ['pancar', 'PANCAR', '1 ŞEKER · 6 KOŞU']];
    const sw = Math.floor((P.w - 22) / 2);
    seeds.forEach(([k, nm, d], i) => {
      const bx = P.x + 8 + i * (sw + 6), sel = this.seed === k;
      rrect(bx - 1, y - 1, sw + 2, 26, sel ? C.yellow : C.ink); rrect(bx, y, sw, 24, sel ? C.slate : C.navy);
      spr(CROP[k][3], bx + 4, y + 5); text(nm, bx + 14, y + 3, sel ? C.yellow : C.white); text(d, bx + 14, y + 13, C.lgray);
      UI.add('seed_' + k, bx, y, sw, 24, () => { this.seed = k; Sound.play('select'); });
    });
    y += 32;
    const cw = 40, gap = 4, x0 = Math.round(P.x + P.w / 2 - (Math.min(4, n) * cw + (Math.min(4, n) - 1) * gap) / 2);
    for (let i = 0; i < n; i++) {
      const cx = x0 + (i % 4) * (cw + gap), cy = y + Math.floor(i / 4) * 44;
      const c = META.crops[i] || 0, tp = c > 0 ? CROP_TYPES[Math.floor(c / 10)] : null, st = c % 10, ripe = tp && st === 3;
      rrect(cx - 1, cy - 1, cw + 2, 40, ripe ? C.green : C.ink); rrect(cx, cy, cw, 38, C.dbrown);
      hline(cx + 2, cy + 22, cw - 4, C.plum); hline(cx + 2, cy + 26, cw - 4, C.plum);
      if (tp) { const img = cropBig(tp, st); spr(img, cx + cw / 2 - img.width / 2, cy + 26 - img.height + (ripe ? Math.round(Math.sin(this.t * 4 + i)) : 0)); }
      else text('+', cx + cw / 2, cy + 10, C.tan, 'center', 2);
      const lab = !tp ? 'EK' : ripe ? 'HASAT!' : 'BÜYÜYOR';
      text(lab, cx + cw / 2, cy + 29, ripe ? C.yellow : C.lgray, 'center');
      UI.add('plot' + i, cx, cy, cw, 38, () => this.plotTap(i));
    }
    y += rows * 44;
    if (META.crops.slice(0, n).some(c => c > 0 && c % 10 === 3)) button('harvestAll', P.x + P.w / 2 - 50, y, 100, 15, 'HEPSİNİ HASAT ET', () => { for (let i = 0; i < n; i++) if (META.crops[i] > 0 && META.crops[i] % 10 === 3) this.harvest(i); }, { kind: 'green' });
    else text('ÜRÜNLER HER KOŞUDAN SONRA BÜYÜR', P.x + P.w / 2, y + 3, C.gray, 'center');
    this.upgradeRow(P, 'bahce', y + 20);
  },
  plotTap(i) {
    const c = META.crops[i] || 0;
    if (!c) { META.crops[i] = (this.seed === 'pancar' ? 2 : 1) * 10; saveMeta(); Sound.play('harvest'); return; }
    if (c % 10 === 3) { this.harvest(i); return; }
    Sound.play('deny'); toast('DAHA OLGUNLAŞMADI. KOŞMAYA DEVAM!', C.lgray, 'clover');
  },
  harvest(i) {
    const c = META.crops[i], tp = CROP_TYPES[Math.floor(c / 10)];
    META.crops[i] = 0;
    if (tp === 'havuc') { META.yonca += 6; toast('+6 KRİSTAL', C.cyan, 'clover'); }
    else { META.seker += 1; toast('+1 ŞEKER', C.white, 'seker'); }
    Sound.play('harvest'); haptic('success'); saveMeta();
  },
  pPazar() {
    const keys = Object.keys(DECOR);
    const P = this.panelBox('MOKO\'NUN TEZGAHI', 34 + keys.length * 20 + 8);
    text('SÜS AL, ÜS PUANI KAZAN!', P.x + P.w / 2, P.y + 18, C.lgray, 'center');
    let y = P.y + 30;
    for (const k of keys) {
      const d = DECOR[k], own = !!META.decor[k], lock = d.needWin && !META.stats.wins;
      text(d.name, P.x + 10, y + 3, own ? C.green : C.white);
      if (own) text('BÖLMEDE', P.x + P.w - 36, y + 3, C.green, 'center');
      else if (lock) { spr(ICONS.lock, P.x + P.w - 62, y + 2); text('KUPA', P.x + P.w - 30, y + 3, C.salmon, 'center'); }
      else button('dc_' + k, P.x + P.w - 62, y, 54, 15, String(d.cost), () => {
        META.yonca -= d.cost; META.decor[k] = true; saveMeta(); Sound.play('buy'); haptic('success');
        toast(d.name + ' BÖLMEYE YERLEŞTİ!', C.yellow, 'house'); checkFarmPerks();
        const p = this.decorPos[k]; if (p) burst(p[0] + 8, p[1] + 6, 20, [C.yellow, C.white, C.green], 50, 0.9, 40, 2);
      }, { icon: 'clover', disabled: META.yonca < d.cost });
      y += 20;
    }
  },
  pAnit() {
    const st = META.stats;
    const rows = [
      ['KOŞU', st.runs], ['ZAFER', st.wins], ['EN UZAK', REGIONS[Math.min(LAST_REGION, st.bestRegion)].name], ['EN İYİ KOMBO', st.bestCombo],
      ['MÜKEMMEL', st.perfects], ['VURULAN DÜŞMAN', st.kills], ['KIL PAYI', st.nearMiss], ['SİPER ÇIKIŞI', st.drafts],
      ['TEMİZ ATLAYIŞ', st.cleanJumps || 0], ['HAMLE', st.hamles || 0], ['SON ATAK', st.kicks || 0], ['ÖZEL ATIŞ', st.specials || 0], ['DEVRİLEN KAPTAN', st.reisKills || 0], ['KAZANILAN DÜELLO', st.duels || 0], ['ALINAN RÖVANŞ', st.revenges || 0], ['DÖRTNAL MODU', st.fevers || 0],
      ['ÜS PUANI', farmLevel()], ['EVE DÖNEN RAKİP', freedCount() + '/' + NAMED_RIVALS.flat().length]
    ];
    const dbest = Math.max(0, ...Object.values(META.dailyRun.best || {}));
    if (dbest) rows.push(['GÜNÜN KOŞUSU REKORU', dbest]);
    const P = this.panelBox('ZAFER VİTRİNİ', 24 + rows.length * 11 + 56);
    let y = P.y + 20;
    for (const [a, b] of rows) { text(a, P.x + 10, y, C.lgray); text(String(b), P.x + P.w - 10, y, C.white, 'right'); y += 11; }
    y += 4; hline(P.x + 6, y, P.w - 12, C.slate); y += 6;
    let x = P.x + 10;
    for (const m of ['g', 's', 'b']) { spr(MEDAL[m], x, y); text(String(st.medals[m] || 0), x + 12, y + 2, MEDAL_COLS[m]); x += 34; }
    y += 16;
    x = P.x + 10;
    for (const reg of REGIONS) { const k = reg.boss, n = st.bossWins[k] || 0; spr(n ? ICONS.crown : tinted('crown', C.slate), x, y); text(String(n), x + 13, y, n ? C.yellow : C.gray); x += Math.floor((P.w - 20) / REGIONS.length); }
  },
  pEv() {
    if (typeof this.page === 'string') return this.pRival(this.page);
    if (this.page) return this.pPage(this.page);
    const rivals = NAMED_RIVALS.flat(), nOpen = rivals.filter(r => META.rivals[r.id]).length;
    const unreadR = rivals.some(r => META.rivals[r.id] && !META.rivalRead[r.id]);
    if (!this.defTab) this.defTab = unreadR && !MEMORIES.some(m => m.cond() && !META.memRead[m.id]) ? 'rakip' : 'gunluk';
    const tab = this.defTab === 'rakip' ? 'rakip' : 'gunluk';
    const avail = H - SAFE.t - SAFE.b - 8, rh = clamp(Math.floor((avail - 64) / rivals.length), 13, 20);
    const P = this.panelBox('SEYİR DEFTERİ', 52 + Math.max(MEMORIES.length * 20, rivals.length * rh) + 6);
    const tw = Math.floor((P.w - 16) / 2);
    button('tab_g', P.x + 6, P.y + 16, tw, 14, 'GÜNLÜK', () => { this.defTab = 'gunluk'; Sound.play('page'); }, { kind: tab === 'gunluk' ? 'primary' : 'secondary' });
    button('tab_r', P.x + 10 + tw, P.y + 16, tw, 14, 'RAKİPLER ' + nOpen + '/' + rivals.length, () => { this.defTab = 'rakip'; Sound.play('page'); }, { kind: tab === 'rakip' ? 'primary' : 'secondary' });
    if (unreadR && tab !== 'rakip') { circle(P.x + 10 + tw * 2 - 3, P.y + 17, 3, C.ink); circle(P.x + 10 + tw * 2 - 3, P.y + 17, 2, C.yellow); }
    let y = P.y + 36;
    if (tab === 'gunluk') {
      text('DENİZ VE YILDIZ\'IN YOLCULUĞU', P.x + P.w / 2, y, C.lgray, 'center'); y += 12;
      for (const m of MEMORIES) {
        const open = m.cond(), unread = open && !META.memRead[m.id];
        rrect(P.x + 6, y, P.w - 12, 17, open ? (unread ? C.purple : C.slate) : C.navy);
        text((MEMORIES.indexOf(m) + 1) + '.', P.x + 12, y + 5, open ? C.yellow : C.dgray);
        if (open) {
          text(m.title, P.x + 26, y + 5, C.white);
          if (unread) text('YENİ', P.x + P.w - 12, y + 5, C.yellow, 'right');
          UI.add('mem' + m.id, P.x + 6, y, P.w - 12, 17, () => { this.page = m.id; META.memRead[m.id] = true; saveMeta(); Sound.play('page'); });
        } else { spr(ICONS.lock, P.x + 26, y + 4); text(m.hint, P.x + 37, y + 5, C.dgray); }
        y += 20;
      }
      return;
    }
    text('DÜELLODA YENDİĞİN RAKİPLERİN DOSYALARI', P.x + P.w / 2, y, C.lgray, 'center'); y += 12;
    for (const r of rivals) {
      const open = !!META.rivals[r.id], unread = open && !META.rivalRead[r.id], nem = META.nemesis && META.nemesis.id === r.id;
      rrect(P.x + 6, y, P.w - 12, rh - 3, open ? (unread ? C.purple : C.slate) : nem ? C.plum : C.navy);
      const ty = y + Math.round((rh - 3) / 2) - 3;
      const reg = nem ? 'RÖVANŞÇI' : REGIONS[r.region].name.split(' ')[0];
      if (open) {
        circle(P.x + 14, y + 8, 3, C.ink); circle(P.x + 14, y + rh / 2, 2, STYLE_COL[r.style] || C.green);
        text(r.name, P.x + 22, ty, C.white);
        text(unread ? 'YENİ' : isFreed(r.id) ? 'EVE DÖNDÜ' : reg, P.x + P.w - 12, ty, unread ? C.yellow : isFreed(r.id) ? C.green : nem ? C.red : C.gray, 'right');
        UI.add('riv_' + r.id, P.x + 6, y, P.w - 12, rh - 3, () => { this.page = r.id; META.rivalRead[r.id] = true; saveMeta(); Sound.play('page'); });
      } else {
        spr(ICONS.lock, P.x + 11, ty - 1); text(nem ? r.name : '???', P.x + 22, ty, nem ? C.salmon : C.dgray);
        text(nem ? 'RÖVANŞÇI' : reg + ' DÜELLOSU', P.x + P.w - 12, ty, nem ? C.red : C.dgray, 'right');
      }
      y += rh;
    }
  },
  pRival(id) {
    const r = RIVAL_BY_ID[id], info = RIVAL_INFO[id];
    if (!r || !info) { this.page = null; return; }
    const w = Math.min(W - 10, 226), lines = wrapText(info.text, w - 30);
    const P = this.panelBox('RAKİP DOSYASI', 96 + lines.length * 10 + 30, w);
    rect(P.x + 7, P.y + 18, 30, 30, C.ink); rect(P.x + 8, P.y + 19, 28, 28, C.slate);
    if (PORTRAIT[id]) spr(PORTRAIT[id], P.x + 8, P.y + 19);
    text(r.name, P.x + 44, P.y + 19, C.yellow);
    text(info.race, P.x + 44, P.y + 29, C.lgray);
    text(info.home, P.x + 44, P.y + 39, C.gray);
    text('TARZI: ' + info.trick, P.x + 10, P.y + 54, STYLE_COL[r.style] || C.green);
    text('YENİLDİ: ' + (META.rivals[id] || 0) + ' KEZ', P.x + 10, P.y + 64, C.gray);
    if (META.nemesis && META.nemesis.id === id) text('RÖVANŞÇI · SV ' + META.nemesis.lv, P.x + P.w - 10, P.y + 64, C.red, 'right');
    if (isFreed(id)) text('EVE DÖNDÜ', P.x + P.w - 10, P.y + 64, C.green, 'right');
    else if (META.freeTokens > 0) button('pg_free', P.x + P.w / 2 - 34, P.y + P.h - 22, 68, 15, 'EVE GÖNDER', () => { this.panel = null; this.page = null; go('liberate', { pick: id }); }, { kind: 'green' });
    rect(P.x + 6, P.y + 76, P.w - 12, P.h - 102, C.sand); hline(P.x + 6, P.y + 76, P.w - 12, C.white);
    lines.forEach((ln, i) => text(ln, P.x + 15, P.y + 82 + i * 10, C.dbrown));
    const opened = NAMED_RIVALS.flat().filter(q => META.rivals[q.id]);
    const idx = opened.findIndex(q => q.id === id);
    button('pg_back', P.x + 8, P.y + P.h - 22, 54, 15, '< LİSTE', () => { this.page = null; Sound.play('page'); }, { kind: 'secondary' });
    if (idx >= 0 && idx < opened.length - 1) button('pg_next', P.x + P.w - 62, P.y + P.h - 22, 54, 15, 'SONRAKİ >', () => { const nx = opened[idx + 1]; this.page = nx.id; META.rivalRead[nx.id] = true; saveMeta(); Sound.play('page'); }, { kind: 'blue' });
  },
  pPage(id) {
    const m = MEMORIES.find(q => q.id === id);
    const w = Math.min(W - 10, 226), lines = wrapText(m.text, w - 30);
    const P = this.panelBox('SAYFA ' + id, 48 + lines.length * 10 + 30, w);
    rect(P.x + 6, P.y + 18, P.w - 12, P.h - 44, C.sand); hline(P.x + 6, P.y + 18, P.w - 12, C.white);
    text(m.title, P.x + P.w / 2, P.y + 23, C.wine, 'center');
    lines.forEach((ln, i) => text(ln, P.x + 15, P.y + 36 + i * 10, C.dbrown));
    const opened = MEMORIES.filter(q => q.cond());
    const idx = opened.indexOf(m);
    button('pg_back', P.x + 8, P.y + P.h - 22, 54, 15, '< LİSTE', () => { this.page = null; Sound.play('page'); }, { kind: 'secondary' });
    if (idx >= 0 && idx < opened.length - 1) button('pg_next', P.x + P.w - 62, P.y + P.h - 22, 54, 15, 'SONRAKİ >', () => { const nx = opened[idx + 1]; this.page = nx.id; META.memRead[nx.id] = true; saveMeta(); Sound.play('page'); }, { kind: 'blue' });
  },
  pNpc(k) {
    const kp = KEEPSAKES[k], lv = META.bond[k] || 0, name = NPC_NAMES[k];
    const desc = lv > 0 ? kp.desc(lv) : 'ŞEKER VER, HATIRASINI AL: ' + kp.desc(1);
    const w = Math.min(W - 10, 226), lines = wrapText(desc, w - 20);
    const P = this.panelBox(name, 74 + lines.length * 9 + 30, w);
    rect(P.x + 7, P.y + 18, 30, 30, C.ink); rect(P.x + 8, P.y + 19, 28, 28, C.slate); spr(PORTRAIT[k], P.x + 8, P.y + 19);
    text('DOSTLUK', P.x + 44, P.y + 20, C.lgray);
    for (let i = 0; i < 3; i++) spr(i < lv ? ICONS.heartS : tinted('heartS', C.slate), P.x + 44 + i * 9, P.y + 31);
    iconNum('seker', META.seker, P.x + P.w - 30, P.y + 20, C.white);
    const eq = META.keepsake === k;
    const kart = itemArt('kp_' + k);
    if (kart) { if (lv < 1) g.globalAlpha = 0.45; spr(kart, P.x + P.w - 26, P.y + 32); g.globalAlpha = 1; }
    text(kp.name, P.x + 10, P.y + 54, lv > 0 ? C.yellow : C.gray);
    lines.forEach((ln, i) => text(ln, P.x + 10, P.y + 64 + i * 9, C.lgray));
    const by = P.y + P.h - 22, bw = Math.floor((P.w - 24) / 3);
    button('gift', P.x + 8, by, bw, 16, lv >= 3 ? 'TAM DOST' : 'ŞEKER VER', () => {
      META.seker--; META.bond[k] = lv + 1; if (!META.keepsake) META.keepsake = k; saveMeta();
      Sound.play('gift'); haptic('success');
      toast(NPC_NAMES[k] + ' İLE DOSTLUK ' + (lv + 1) + '/3', C.salmon, 'heartS');
      Dialog.start([[k, NPC_LINES[k].gift[lv]]]);
    }, { kind: 'green', disabled: lv >= 3 || META.seker < 1 });
    button('equip', P.x + 12 + bw, by, bw, 16, eq ? 'TAKILI' : 'TAK', () => { META.keepsake = eq ? null : k; saveMeta(); Sound.play('select'); }, { kind: eq ? 'secondary' : 'blue', disabled: lv < 1 });
    button('chat', P.x + 16 + bw * 2, by, bw, 16, 'SOHBET', () => { const ls = NPC_LINES[k].chat; Dialog.start([[k, ls[Math.floor(Math.random() * ls.length)]]]); }, { kind: 'secondary' });
  },
  cycle(list, cur, dir) { let i = list.indexOf(cur); if (i < 0) i = 0; return list[(i + dir + list.length) % list.length]; },
  gateRows() {
    const rows = [];
    const jks = Object.keys(JOCKEYS).filter(k => k === 'ayse' || (built('jokey') && META.rozet >= JOCKEYS[k].rozet));
    if (jks.indexOf(META.jockey) < 0) META.jockey = 'ayse';
    const J = JOCKEYS[META.jockey];
    rows.push({ label: 'TEKNİK', val: J.ability, desc: J.abDesc + ' (' + J.name + ')', list: jks, key: 'jockey' });
    const nls = Object.keys(NALS).filter(k => META.nals[k]);
    rows.push({ label: 'NAL', val: NALS[META.nal].name, desc: NALS[META.nal].desc, list: nls, key: 'nal' });
    const wps = Object.keys(WEAPONS).filter(k => META.weapons[k]);
    if (built('silahhane') || wps.length > 1) { const w = WEAPONS[META.weapon] || WEAPONS.yay; rows.push({ label: 'SİLAH', val: w.name + ' SV' + (META.wlv[META.weapon] || 1), desc: w.desc, list: wps, key: 'weapon' }); }
    else rows.push({ label: 'SİLAH', val: WEAPONS.yay.name, desc: WEAPONS.yay.desc + ' (CEPHANELİKTE YENİLERİ VAR)', list: ['yay'], key: 'weapon' });
    if (built('ambar')) {
      const owned = Object.keys(FOODS).filter(k => META.foods[k]);
      rows.push({ label: 'YEM', val: META.food ? FOODS[META.food].name : 'YOK', desc: META.food ? FOODS[META.food].desc : 'YEM SEÇİLMEDİ', list: [null].concat(owned.filter(k => k !== META.food2)), key: 'food' });
      if (bl('ambar') >= 2) rows.push({ label: 'YEM 2', val: META.food2 ? FOODS[META.food2].name : 'YOK', desc: META.food2 ? FOODS[META.food2].desc : 'İKİNCİ YEM YUVASI', list: [null].concat(owned.filter(k => k !== META.food)), key: 'food2' });
    }
    const kps = Object.keys(KEEPSAKES).filter(k => META.bond[k] > 0);
    if (kps.length) rows.push({ label: 'HATIRA', val: META.keepsake ? KEEPSAKES[META.keepsake].name : 'YOK', desc: META.keepsake ? KEEPSAKES[META.keepsake].desc(META.bond[META.keepsake]) : 'DOSTLARINDAN BİR HATIRA TAK', list: [null].concat(kps), key: 'keepsake' });
    if (META.tutorialDone) rows.push({ label: 'STİL', val: RUN_STYLES[META.runStyle].name, desc: RUN_STYLES[META.runStyle].desc, list: ['dengeli', 'onde', 'sondan'], key: 'runStyle' });
    if (META.heatUnlocked) rows.push({ label: 'PİST', val: HEATS[META.heat].name, desc: META.heat ? 'ÖDÜLLER X' + HEATS[META.heat].rew : 'STANDART ZORLUK', list: [0, 1, 2], key: 'heat' });
    return rows;
  },
  pGate() {
    const rows = this.gateRows();
    const avail = H - SAFE.t - SAFE.b - 8 - 58;
    const rowH = clamp(Math.floor(avail / rows.length), 24, 36), two = rowH >= 33;
    const P = this.panelBox('YARIŞA HAZIR MISIN?', 22 + rows.length * rowH + 34);
    let y = P.y + 19;
    for (const r of rows) {
      text(r.label, P.x + 8, y + 3, C.gray);
      if (r.list.length > 1) {
        button('gl_' + r.key, P.x + 44, y, 14, 13, '<', () => { META[r.key] = this.cycle(r.list, META[r.key], -1); saveMeta(); Sound.play('select'); }, { kind: 'secondary' });
        button('gr_' + r.key, P.x + P.w - 22, y, 14, 13, '>', () => { META[r.key] = this.cycle(r.list, META[r.key], 1); saveMeta(); Sound.play('select'); }, { kind: 'secondary' });
      }
      text(r.val, P.x + (P.w + 36) / 2, y + 3, C.yellow, 'center');
      wrapText(r.desc, P.w - 20).slice(0, two ? 2 : 1).forEach((dl, i) => text(dl, P.x + P.w / 2, y + 15 + i * 8, C.lgray, 'center'));
      y += rowH;
    }
    if (META.runSave) {
      button('run_cont', P.x + 14, P.y + P.h - 26, Math.floor((P.w - 32) / 2), 20, 'DEVAM ET', () => { this.panel = null; restoreRun(); go('doors'); }, { kind: 'blue' });
      button('run_go', P.x + 18 + Math.floor((P.w - 32) / 2), P.y + P.h - 26, Math.ceil((P.w - 32) / 2), 20, this.confirmNew ? 'EMİN MİSİN?' : 'YENİ KOŞU', () => {
        if (!this.confirmNew) { this.confirmNew = true; Sound.play('deny'); return; }
        this.confirmNew = false; this.panel = null; META.runSave = null; newRun(); saveMeta(); go('run', firstNode());
      }, { kind: 'secondary' });
    } else button('run_go', P.x + 14, P.y + P.h - 26, P.w - 28, 20, 'KOŞ!', () => { this.panel = null; newRun(); saveMeta(); go('run', firstNode()); });
  },
  pSettings() {
    const s = META.settings;
    const items = [['MÜZİK', 'music'], ['EFEKTLER', 'sfx'], ['TİTREŞİM', 'haptics'], ['RİTİM TİTREŞİMİ', 'beatHaptic'], ['EKRAN SARSINTISI', 'shake'], ['SOL EL MODU', 'left'], ['GENİŞ RİTİM PENCERESİ', 'wide'], ['SADE RİTİM', 'simpleNotes'], ['YARDIM MODU', 'assist']];
    if (window.__NATIVE__) items.splice(2, 0, ['SESSİZ MODDA DA ÇAL', 'loudSilent']);
    const P = this.panelBox('AYARLAR', 20 + items.length * 17 + 102);
    let y = P.y + 19;
    for (const [lab, key] of items) {
      text(lab, P.x + 10, y + 3, key === 'assist' && s.assist ? C.sky : C.white);
      button('set_' + key, P.x + P.w - 50, y, 42, 13, s[key] ? 'AÇIK' : 'KAPALI', () => { s[key] = !s[key]; Sound.applySettings(); if (key === 'loudSilent') nativeAudio(); saveMeta(); }, { kind: s[key] ? 'green' : 'secondary' });
      y += 17;
    }
    if (s.assist) text('YARDIM: %' + Math.round(Math.min(0.6, 0.2 + 0.02 * META.assistLv) * 100) + ' KORUMA', P.x + 10, y, C.sky);
    y += 10;
    text('RİTİM GECİKMESİ', P.x + 10, y + 3, C.white);
    button('off_m', P.x + P.w - 72, y, 14, 14, '-', () => { s.offset = clamp(s.offset - 10, -150, 150); saveMeta(); }, { kind: 'secondary' });
    text(s.offset + 'MS', P.x + P.w - 36, y + 3, C.yellow, 'center');
    button('off_p', P.x + P.w - 22, y, 14, 14, '+', () => { s.offset = clamp(s.offset + 10, -150, 150); saveMeta(); }, { kind: 'secondary' });
    y += 20;
    button('calib', P.x + 10, y, P.w - 20, 15, 'RİTMİ ÖLÇ: DOKUNARAK AYARLA', () => this.startCalib(), { kind: 'blue' });
    y += 20;
    button('tutagain', P.x + 10, y, P.w - 20, 15, META.tutorialDone ? 'ISINMA TURUNU TEKRAR OYNA' : 'SONRAKİ KOŞU ISINMA TURUYLA BAŞLAR', () => {
      if (!META.tutorialDone) return;
      META.tutorialDone = false; saveMeta(); toast('SONRAKİ KOŞU ISINMA TURUYLA BAŞLAR', C.green, 'check');
    }, { kind: META.tutorialDone ? 'blue' : 'secondary' });
    y += 20;
    button('reset', P.x + 10, y, P.w - 20, 15, this.confirmReset ? 'EMİN MİSİN? TÜM İLERLEME SİLİNİR' : 'İLERLEMEYİ SIFIRLA', () => {
      if (!this.confirmReset) { this.confirmReset = true; return; }
      const keep = META.settings; META = defaultMeta(); META.settings = keep; saveMeta(); this.confirmReset = false; this.panel = null; go('title');
    }, { kind: 'red' });
  },
  // ---------- rhythm calibration (shared with the pause menu, see Calib in 05b_calib.js) ----------
  startCalib() { Calib.start(); this.panel = 'calib'; },
  pCalib() {
    Calib.draw(() => { this.panel = 'settings'; Music.play('farm', now() + 0.2, false); });
  },
  pDaily() {
    const P = this.panelBox('GÜNLÜK ERZAK', 104);
    const cur = META.daily.count % 7;
    textBlock('HER GÜN UĞRA, ERZAK ARTARAK GELSİN. GÜN KAÇIRSAN DA SERİ SIFIRLANMAZ.', P.x + P.w / 2, P.y + 18, P.w - 20, C.lgray, 'center');
    const bw = Math.floor((P.w - 16 - 18) / 7), y = P.y + 44;
    for (let i = 0; i < 7; i++) {
      const bx = P.x + 8 + i * (bw + 3); rrect(bx, y, bw, 22, i === cur ? C.gold : i < cur ? C.ddgreen : C.slate);
      text(String(DAILY[i]), bx + bw / 2, y + 7, i === cur ? C.ink : C.white, 'center');
      if (DAILY_SUGAR[i]) spr(ICONS.seker, bx + bw - 7, y - 3);
    }
    button('dly2', P.x + P.w / 2 - 45, P.y + P.h - 24, 90, 18, 'AL: ' + DAILY[cur], () => { this.claimDailyFx(); this.panel = null; }, { icon: 'clover', kind: 'green' });
  }
};
const HDIR_CACHE = {};
function horseDirB(blanket, frameIdx, dir) {
  const key = (blanket || '-') + frameIdx + '_' + dir;
  if (HDIR_CACHE[key]) return HDIR_CACHE[key];
  const set = heroHorse(blanket); // Deniz rides Yıldız around the module
  const base = frameIdx < 0 ? set.stand : set.frames[frameIdx];
  return (HDIR_CACHE[key] = rotSprite(base, dir));
}
