// ================= RHYTHM CALIBRATION =================
// Tap along with 16 clicks; the median lag (minus the audio output latency) becomes the rhythm offset.
// Used from the station settings and from the race pause menu (headphones change mid-run).
const Calib = {
  st: null,
  start() {
    Sound.unlock(); Music.stop();
    const t0 = now() + 0.8, iv = 0.6, n = 16;
    this.st = { t0, iv, n, taps: [], result: null };
    for (let i = 0; i < n; i++) {
      const t = Sound.at(t0 + i * iv), acc = i % 4 === 0;
      Sound.tone(acc ? 1568 : 1046, 0.05, 'square', 0.22, t, null, Sound.master);
      Sound.noise(0.03, 0.25, t, 'highpass', 3000, Sound.master);
    }
  },
  tap(t) {
    const c = this.st; if (!c || c.result) return;
    const k = Math.round((t - c.t0) / c.iv);
    if (k < 2 || k >= c.n) return; // the first two clicks are only for finding the beat
    const d = t - (c.t0 + k * c.iv);
    if (Math.abs(d) < c.iv * 0.45) { c.taps.push(d); haptic('light'); }
  },
  finish() {
    const c = this.st;
    if (c.taps.length < 6) { c.result = { fail: true }; return; }
    const sorted = c.taps.slice().sort((a, b) => a - b), med = sorted[sorted.length >> 1];
    const spread = sorted[Math.floor(sorted.length * 0.8)] - sorted[Math.floor(sorted.length * 0.2)];
    const ms = clamp(Math.round((med - Sound.latency()) * 1000 / 5) * 5, -150, 150);
    c.result = { ms, med: Math.round(med * 1000), spread: Math.round(spread * 1000) };
  },
  // the whole overlay; onClose runs after KAYDET or KAPAT
  draw(onClose) {
    const c = this.st; if (!c) { onClose(); return; }
    const w = Math.min(W - 10, 226), h = 150, px = Math.round(W / 2 - w / 2), py = Math.round(SAFE.t + (H - SAFE.t - SAFE.b - h) / 2);
    const t = now(), bp = (t - c.t0) / c.iv, k = Math.floor(bp);
    if (!c.result && bp > c.n + 0.5) this.finish();
    // the whole screen takes the taps while measuring; the close button is registered after it, so it still works
    UI.block(0, 0, W, H, c.result ? null : (x, y, tt) => this.tap(tt == null ? now() : tt));
    g.globalAlpha = 0.55; rect(0, 0, W, H, C.ink); g.globalAlpha = 1;
    panel(px, py, w, h, 'RİTİM AYARI');
    const close = () => { this.st = null; onClose(); };
    button('cal_x', px + w - 14, py + 2, 11, 10, 'X', close, { kind: 'red', hitPad: 5 });
    let y = py + 19;
    textBlock(c.result ? (c.result.fail ? 'YETERİNCE DOKUNUŞ YAKALANAMADI. SESİ AÇIP TEKRAR DENE.' : 'ÖLÇÜM TAMAM!') : 'SESİ AÇ. HER TIK SESİNİ DUYDUĞUN ANDA EKRANA DOKUN. EKRANA DEĞİL, SESE GÜVEN.', px + w / 2, y, w - 20, C.lgray, 'center');
    y += 30;
    const cx = px + w / 2;
    if (!c.result) {
      const f = bp >= 0 && k < c.n ? Math.max(0, 1 - (bp - k) * 3) : 0;
      circle(cx, y + 14, 12, C.ink); circle(cx, y + 14, 11, f > 0 ? (k % 4 === 0 ? C.gold : C.sky) : C.slate);
      if (f > 0) { g.globalAlpha = f; ring(cx, y + 14, 13 + Math.round((1 - f) * 6), C.white); g.globalAlpha = 1; }
      text(bp < 0 ? 'HAZIR...' : Math.min(c.n, k + 1) + '/' + c.n, cx, y + 32, C.white, 'center');
    } else if (!c.result.fail) {
      const r = c.result;
      textO((r.ms > 0 ? '+' : '') + r.ms + ' MS', cx, y + 2, C.yellow, 'center', 2);
      text(r.ms > 10 ? 'SESİ BİRAZ GEÇ DUYUYORSUN' : r.ms < -10 ? 'SESİN ÖNÜNE GEÇİYORSUN' : 'ZAMANLAMAN TAM', cx, y + 22, C.lgray, 'center');
      text('SAPMA: ' + r.spread + ' MS' + (r.spread > 90 ? ' (TEKRAR DENE)' : ''), cx, y + 32, r.spread > 90 ? C.salmon : C.gray, 'center');
    }
    // where each tap landed: -150 ms ... +150 ms
    const lx = px + 16, lw = w - 32, ly = py + 112;
    rect(lx, ly, lw, 1, C.slate); vline(lx + lw / 2, ly - 3, 7, C.lgray);
    text('ERKEN', lx, ly + 3, C.gray); text('GEÇ', lx + lw, ly + 3, C.gray, 'right');
    for (const d of c.taps) { const x = lx + lw / 2 + clamp(d / 0.15, -1, 1) * lw / 2; vline(x, ly - 2, 5, C.cyan); }
    if (c.result) {
      const bw = Math.floor((w - 26) / 2);
      button('cal_again', px + 8, py + h - 22, bw, 15, 'TEKRAR', () => this.start(), { kind: 'secondary' });
      if (!c.result.fail) button('cal_ok', px + 18 + bw, py + h - 22, bw, 15, 'KAYDET', () => { META.settings.offset = c.result.ms; saveMeta(); toast('RİTİM GECİKMESİ: ' + c.result.ms + ' MS', C.green, 'check'); close(); }, { kind: 'green' });
    }
  }
};
