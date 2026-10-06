// ================= CORE =================
// Endesga 32 palette
const C = {
  rust: '#be4a2f', orange0: '#d77643', sand: '#ead4aa', tan: '#e4a672', brown: '#b86f50', dbrown: '#733e39',
  plum: '#3e2731', wine: '#a22633', red: '#e43b44', orange: '#f77622', gold: '#feae34', yellow: '#fee761',
  green: '#63c74d', dgreen: '#3e8948', ddgreen: '#265c42', teal: '#193c3e', blue: '#124e89', sky: '#0099db',
  cyan: '#2ce8f5', white: '#ffffff', lgray: '#c0cbdc', gray: '#8b9bb4', dgray: '#5a6988', slate: '#3a4466',
  navy: '#262b44', ink: '#181425', hot: '#ff0044', purple: '#68386c', magenta: '#b55088', salmon: '#f6757a',
  skin: '#e8b796', skin2: '#c28569'
};

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const Ease = {
  outCubic: t => 1 - Math.pow(1 - t, 3),
  outQuad: t => 1 - (1 - t) * (1 - t),
  inOut: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
};
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
let rnd = mulberry32((Math.random() * 1e9) | 0);
const R = {
  f: (a, b) => a + (b - a) * rnd(),
  i: (a, b) => Math.floor(a + (b - a + 1) * rnd()),
  pick: arr => arr[Math.floor(rnd() * arr.length)],
  chance: p => rnd() < p,
  shuffle: arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
};
function hash2(x, y) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
// Turkish upper-casing is slow and text is drawn every frame: remember recent results
const TRUP_CACHE = new Map();
const trUp = s => {
  s = String(s); let u = TRUP_CACHE.get(s);
  if (u === undefined) { u = s.toLocaleUpperCase('tr-TR'); if (TRUP_CACHE.size > 2000) TRUP_CACHE.clear(); TRUP_CACHE.set(s, u); }
  return u;
};

// Turkish accusative suffix with vowel harmony: ZARG → ZARG'I, NİVA → NİVA'YI, KRİSTALO → KRİSTALO'YU
function trAcc(name) {
  const up = trUp(name), V = 'AEIİOÖUÜ', m = { A: 'I', I: 'I', E: 'İ', İ: 'İ', O: 'U', U: 'U', Ö: 'Ü', Ü: 'Ü' };
  let last = 'A'; for (const ch of up) if (V.indexOf(ch) >= 0) last = ch;
  return up + '\'' + (V.indexOf(up[up.length - 1]) >= 0 ? 'Y' : '') + m[last];
}
// ---------- canvas ----------
const cvs = document.getElementById('game');
const ctx = cvs.getContext('2d', { alpha: false });
const buf = document.createElement('canvas');
let g = buf.getContext('2d');
// render into an offscreen canvas using the same draw helpers
function offscreen(w, h, fn) {
  const c = document.createElement('canvas'); c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0);
  const prev = g; g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  try { fn(c); } finally { g = prev; }
  return c;
}
let W = 180, H = 320, SCALE = 1, DPR = 1;
const SAFE = { t: 0, b: 0, l: 0, r: 0 };
let scene = null;

// The iOS app also reports the real insets (notch, Dynamic Island, home indicator) because a WKWebView
// whose scroll view ignores content insets can report env(safe-area-inset-*) as 0.
const NATIVE_SAFE = { t: 0, r: 0, b: 0, l: 0 };
window.__setNativeSafe = (t, r, b, l) => {
  const n = v => Math.max(0, +v || 0);
  NATIVE_SAFE.t = n(t); NATIVE_SAFE.r = n(r); NATIVE_SAFE.b = n(b); NATIVE_SAFE.l = n(l);
  if (typeof cvs !== 'undefined' && cvs) resize();
};
function measureSafe() {
  const el = document.getElementById('safe');
  const cs = el ? getComputedStyle(el) : null;
  const f = v => parseFloat(v) || 0;
  // insets are measured from the screen edge; the canvas may sit a few pixels in from it
  const offX = parseFloat(cvs.style.left) || 0, offY = parseFloat(cvs.style.top) || 0;
  const toL = (v, off) => Math.max(0, Math.ceil((v - off) * DPR / SCALE));
  SAFE.t = toL(Math.max(cs ? f(cs.paddingTop) : 0, NATIVE_SAFE.t), offY);
  SAFE.b = toL(Math.max(cs ? f(cs.paddingBottom) : 0, NATIVE_SAFE.b), offY);
  SAFE.l = toL(Math.max(cs ? f(cs.paddingLeft) : 0, NATIVE_SAFE.l), offX);
  SAFE.r = toL(Math.max(cs ? f(cs.paddingRight) : 0, NATIVE_SAFE.r), offX);
}

function resize() {
  DPR = window.devicePixelRatio || 1;
  const cw = Math.max(1, window.innerWidth), ch = Math.max(1, window.innerHeight);
  const pw = Math.round(cw * DPR), ph = Math.round(ch * DPR);
  SCALE = Math.max(1, Math.floor(Math.min(pw / 180, ph / 300)));
  let w = Math.floor(pw / SCALE), h = Math.floor(ph / SCALE);
  const maxW = Math.floor(h * 0.8);
  if (w > maxW) w = maxW;
  W = Math.max(150, w); H = Math.max(240, h);
  buf.width = W; buf.height = H;
  cvs.width = W * SCALE; cvs.height = H * SCALE;
  const cssW = W * SCALE / DPR, cssH = H * SCALE / DPR;
  cvs.style.width = cssW + 'px';
  cvs.style.height = cssH + 'px';
  cvs.style.left = (Math.round((cw - cssW) / 2 * DPR) / DPR) + 'px';
  cvs.style.top = (Math.round((ch - cssH) / 2 * DPR) / DPR) + 'px';
  g.imageSmoothingEnabled = false; ctx.imageSmoothingEnabled = false;
  measureSafe();
  if (scene && scene.resize) scene.resize();
}

// ---------- draw helpers ----------
function rect(x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function pix(x, y, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), 1, 1); }
function hline(x, y, w, c) { rect(x, y, w, 1, c); }
function vline(x, y, h, c) { rect(x, y, 1, h, c); }
function box(x, y, w, h, c) { hline(x, y, w, c); hline(x, y + h - 1, w, c); vline(x, y, h, c); vline(x + w - 1, y, h, c); }
// rounded (corner-cut) filled rect
function rrect(x, y, w, h, c) { x = Math.round(x); y = Math.round(y); rect(x + 1, y, w - 2, h, c); rect(x, y + 1, w, h - 2, c); }
function circle(cx, cy, r, c) {
  cx = Math.round(cx); cy = Math.round(cy);
  g.fillStyle = c;
  for (let dy = -r; dy <= r; dy++) { const dx = Math.round(Math.sqrt(r * r - dy * dy)); g.fillRect(cx - dx, cy + dy, dx * 2 + 1, 1); }
}
function ring(cx, cy, r, c) {
  cx = Math.round(cx); cy = Math.round(cy); g.fillStyle = c;
  let x = r, y = 0, err = 1 - r;
  while (x >= y) {
    const pts = [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]];
    for (const p of pts) g.fillRect(cx + p[0], cy + p[1], 1, 1);
    y++; if (err < 0) err += 2 * y + 1; else { x--; err += 2 * (y - x) + 1; }
  }
}
function ellipse(cx, cy, rx, ry, c) {
  g.fillStyle = c; cx = Math.round(cx); cy = Math.round(cy);
  for (let dy = -ry; dy <= ry; dy++) { const dx = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry)))); g.fillRect(cx - dx, cy + dy, dx * 2 + 1, 1); }
}
function alpha(a, fn) { const p = g.globalAlpha; g.globalAlpha = p * a; fn(); g.globalAlpha = p; }
function spr(img, x, y) { if (img) g.drawImage(img, Math.round(x), Math.round(y)); }
function sprC(img, cx, cy) { if (img) g.drawImage(img, Math.round(cx - img.width / 2), Math.round(cy - img.height / 2)); }

// ---------- time / loop ----------
let T = 0;               // seconds since start (real)
const now = () => performance.now() / 1000;

// ---------- haptics ----------
function haptic(kind) {
  if (typeof META !== 'undefined' && META && !META.settings.haptics) return;
  try {
    const mh = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.haptic;
    if (mh) { mh.postMessage(kind); return; }
  } catch (e) { }
  try { if (navigator.vibrate) navigator.vibrate(kind === 'heavy' ? 28 : kind === 'medium' ? 16 : kind === 'success' ? [12, 40, 18] : 8); } catch (e) { }
}

// ---------- UI hit registry (immediate mode) ----------
const UI = {
  rects: [], prev: [], pressed: null,
  begin() { this.prev = this.rects; this.rects = []; },
  add(id, x, y, w, h, fn, opts) { this.rects.push({ id, x, y, w, h, fn, opts: opts || {} }); },
  block(x, y, w, h, fn) { this.rects.push({ id: '__block' + this.rects.length, x, y, w, h, fn: fn || null, opts: { block: true } }); },
  hit(px, py) {
    for (let i = this.prev.length - 1; i >= 0; i--) {
      const r = this.prev[i];
      if (px >= r.x && px < r.x + r.w && py >= r.y && py < r.y + r.h) return r;
    }
    return null;
  },
  inside(r, p) { return p.x >= r.x - 4 && p.x < r.x + r.w + 4 && p.y >= r.y - 4 && p.y < r.y + r.h + 4; }
};

// ---------- input ----------
const Input = { id: null, sx: 0, sy: 0, ax: 0, ay: 0, t0: 0, swiped: false, swipedV: false, btn: null, x: 0, y: 0, down: false };
const SWIPE_TH = 9;
function toLogical(e) {
  const r = cvs.getBoundingClientRect();
  return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height };
}
function evTime(e) {
  const n = performance.now();
  let t = (e && typeof e.timeStamp === 'number') ? e.timeStamp : n;
  if (t > n + 50 || t < n - 1000) t = n;
  return t / 1000;
}
function onPointerDown(e) {
  e.preventDefault();
  Sound.unlock();
  if (Input.id !== null) return;
  Input.id = e.pointerId;
  try { cvs.setPointerCapture(e.pointerId); } catch (_) { }
  const p = toLogical(e);
  Input.sx = Input.ax = Input.x = p.x; Input.sy = Input.ay = Input.y = p.y; Input.t0 = now();
  Input.swiped = false; Input.swipedV = false; Input.down = true; Input.hCount = 0;
  const b = UI.hit(p.x, p.y);
  if (b) {
    Input.btn = b;
    if (b.opts.block) { if (b.fn) b.fn(p.x, p.y, evTime(e)); return; }
    UI.pressed = b.id;
    if (b.opts.onDown) { b.fn(); UI.pressed = null; Input.btn = { id: '__done', opts: { block: true } }; Sound.play('click'); }
    return;
  }
  Input.btn = null;
  if (scene && scene.down) scene.down(p.x, p.y, evTime(e));
}
function onPointerMove(e) {
  if (e.pointerId !== Input.id) return;
  e.preventDefault();
  const p = toLogical(e); Input.x = p.x; Input.y = p.y;
  if (Input.btn) {
    if (!Input.btn.opts.block) UI.pressed = UI.inside(Input.btn, p) ? Input.btn.id : null;
    return;
  }
  const dx = p.x - Input.ax, dy = p.y - Input.ay;
  if (!Input.swipedV && Math.abs(dy) > SWIPE_TH && Math.abs(dy) > Math.abs(dx) * 1.1) {
    Input.swipedV = true; Input.swiped = true; Input.ax = p.x; Input.ay = p.y;
    if (scene && scene.swipe) scene.swipe(dy < 0 ? 'up' : 'down');
  } else if (Math.abs(dx) > (Input.hCount ? 24 : SWIPE_TH) && Math.abs(dx) >= Math.abs(dy)) {
    Input.swiped = true; Input.ax = p.x; Input.ay = p.y; Input.hCount++;
    if (scene && scene.swipe) scene.swipe(dx < 0 ? 'left' : 'right');
  }
  if (scene && scene.drag) scene.drag(p.x, p.y);
}
function onPointerUp(e) {
  Sound.unlock();
  if (e.pointerId !== Input.id) return;
  e.preventDefault();
  const p = toLogical(e);
  const b = Input.btn;
  Input.id = null; Input.btn = null; Input.down = false;
  if (b) {
    if (!b.opts.block && e.type === 'pointerup' && UI.inside(b, p) && b.fn) { Sound.play('click'); haptic('light'); b.fn(); }
    UI.pressed = null;
    return;
  }
  const dist = Math.hypot(p.x - Input.sx, p.y - Input.sy);
  if (!Input.swiped && dist < SWIPE_TH && e.type === 'pointerup') { if (scene && scene.tap) scene.tap(p.x, p.y); }
  if (scene && scene.up) scene.up(p.x, p.y, Input.swiped);
}
cvs.addEventListener('pointerdown', onPointerDown, { passive: false });
cvs.addEventListener('pointermove', onPointerMove, { passive: false });
cvs.addEventListener('pointerup', onPointerUp, { passive: false });
cvs.addEventListener('pointercancel', onPointerUp, { passive: false });
document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('touchend', () => Sound.unlock(), { passive: true });
document.addEventListener('contextmenu', e => e.preventDefault());

const KEYMAP = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down' };
let spaceScene = null; // space = press on keydown, release on keyup (so hold notes work on a keyboard)
window.addEventListener('keydown', e => {
  if (e.repeat) { if (e.key === ' ') e.preventDefault(); return; }
  Sound.unlock();
  if (scene && scene.key && scene.key(e.key)) { e.preventDefault(); return; }
  if (KEYMAP[e.key] && scene && scene.swipe) { scene.swipe(KEYMAP[e.key]); e.preventDefault(); return; }
  if (e.key === ' ' && scene) {
    spaceScene = scene;
    if (scene.down) scene.down(W / 2, H / 2, evTime(e));
    e.preventDefault();
  }
});
window.addEventListener('keyup', e => {
  if (e.key !== ' ' || !spaceScene) return;
  const sc = spaceScene; spaceScene = null;
  if (sc !== scene) return;
  if (sc.tap) sc.tap(W / 2, H / 2);
  if (sc.up) sc.up(W / 2, H / 2, false);
  e.preventDefault();
});

// ---------- error overlay ----------
let LAST_ERROR = null;
window.addEventListener('error', e => { LAST_ERROR = String(e.message || e.error || e); });
function reportError(err) { console.error(err); LAST_ERROR = String(err && err.stack ? err.stack.split('\n').slice(0, 2).join(' ') : err); }
