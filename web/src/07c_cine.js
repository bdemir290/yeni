// ================= CINEMATICS (v6) =================
// Illustrated story panels: the prologue before the first race and the finale after the first cup.
// Each panel pans slowly over a PixelLab painting while subtitles type out under it; a tap finishes the line,
// the next tap moves on. Missing art falls back to a starfield, so the story still reads without images.
const CINE = {
  prolog: [
    { img: 'p_kupa', cap: 'DÜNYA · ALTIN NAL KUPASI FİNALİ', fx: 'confetti', lines: [
      [null, 'TRİBÜNLER AYAKTA. ALTIN NAL KUPASI ÜÇÜNCÜ KEZ AYNI İKİLİNİN: DENİZ VE YILDIZ.'],
      ['deniz', 'BU KUPA SENİN, YILDIZ. HER ZAMANKİ GİBİ.']] },
    { img: 'p_ahir', cap: 'O GECE · AHIR', fx: 'dust', lines: [
      [null, 'KALABALIK DAĞILINCA DENİZ YİNE AHIRA DÖNDÜ. DUVARDA ESKİ BİR FOTOĞRAF ASILI.'],
      ['deniz', 'ANNEM DE BU PİSTTE KOŞARDI, YILDIZ. YİRMİ YIL ÖNCE BİR FİNAL GECESİ ORTADAN KAYBOLDU.'],
      ['deniz', 'HERKES KAZA DEDİ. AMA KİMSE ONU BULAMADI.']] },
    { img: 'p_isik', cap: 'GECE YARISI', fx: 'rise', lines: [
      [null, 'HİPODROMUN ÜSTÜNDE SESSİZ BİR IŞIK BELİRDİ. NE BİR SES VARDI, NE DE RÜZGAR.'],
      ['deniz', 'YILDIZ? SAKİN OL... BU IŞIK DA NE?']] },
    { img: 'p_yolculuk', cap: 'YUKARI', fx: 'stars', lines: [
      [null, 'SAMAN, FENER, YILDIZ VE DENİZ. HER ŞEY IŞIĞIN İÇİNDE YUKARI SÜZÜLDÜ.'],
      [null, 'AŞAĞIDA DÜNYA BİR BİLYE KADAR KÜÇÜLDÜ.']] },
    { img: 'p_arena', cap: 'ARENA-9 · GALAKSİNİN MERKEZİ', fx: 'twinkle', lines: [
      [null, 'GÖZÜNÜ AÇTIĞINDA DEV BİR STADYUMUN IŞIKLARI ALTINDAYDIN.'],
      [null, 'ARENA-9: GALAKSİNİN EN BÜYÜK YARIŞ ŞOVU. HER SEZON BAŞKA GEZEGENLERDEN ŞAMPİYONLAR KAÇIRILIR.']] },
    { img: 'p_grax', cap: 'CANLI YAYIN', fx: 'spot', lines: [
      ['grax', 'İYİ AKŞAMLAR GALAKSİ! BU SEZONUN YENİ YILDIZI: DÜNYALI JOKEY DENİZ VE TUHAF HAYVANI!'],
      ['grax', 'KURAL BASİT: GALAKSİ KUPASI\'NI KAZANAN EVİNE DÖNER. KAYBEDEN... GELECEK SEZONA KADAR BİZİMLE!'],
      ['grax', 'DÜNYALILAR HEP ÇOK EĞLENCELİ OLMUŞTUR. SONUNCUSU... NEYSE! REKLAMLAR!']] },
    { img: 'p_bolme', cap: 'DÜNYA BÖLMESİ', fx: 'dust', lines: [
      ['bip', 'BİP! BEN BİP-0, BU BÖLMENİN BAKICISIYIM. SENDEN ÖNCE DE DÜNYALILAR GELDİ.'],
      ['bip', 'HİÇBİRİ EVE DÖNEMEDİ. BİRİNİN DOSYASI HÂLÂ KİLİTLİ... NEYSE.'],
      ['bip', 'ÖNCE BİR ISINMA TURU ATALIM. TOYNAK SESİNİ DİNLE, DENİZ. RİTİM HIZDIR.']] },
    { title: true, cap: '', fx: 'stars', lines: [[null, 'KAZAN VE EVE DÖN.']] }
  ],
  final: [
    { img: 'e_kupa', cap: 'GALAKSİ KUPASI', fx: 'confetti', lines: [
      [null, 'SON DÜZLÜK. VOLTRAK\'IN KIVILCIMLARI SÖNDÜ. YILDIZ BİR BAŞ ÖNDE.'],
      ['grax', 'BU... BU OLAMAZ! KUPA... DÜNYALININ!']] },
    { img: 'e_kapi', cap: 'KAPI', fx: 'rise', lines: [
      [null, 'KUPA HAVAYA KALKINCA ARENANIN ORTASINDA DEV BİR KAPI AÇILDI. ÖTESİNDE MAVİ BİR GEZEGEN PARLIYORDU.'],
      ['bip', 'BİP... BU DÜNYA! KAPI AÇIK, DENİZ!']] },
    { img: 'e_akyel', cap: 'YİRMİ YIL SONRA', fx: 'dust', lines: [
      [null, 'TRİBÜNDEN GRİ SAÇLI BİR KADIN İNDİ. YILDIZ ONU DENİZ\'DEN ÖNCE TANIDI.'],
      ['akyel', 'DENİZ... YİRMİ YILDIR SENİ İZLİYORUM. NE KADAR BÜYÜMÜŞSÜN.'],
      ['deniz', 'ANNE?'],
      [null, 'AMA PİSTTEKİLER DE KAÇIRILMIŞTI. KAPI HER KUPADA YENİDEN AÇILACAKTI. YOLCULUK BİTMEMİŞTİ.']] }
  ]
};

SCENES.cine = {
  enter(arg) {
    arg = arg || {};
    this.script = CINE[arg.script] || CINE.prolog; this.key = arg.script || 'prolog';
    this.then = arg.then || null; this.i = -1; this.fade = 0; this.parts = [];
    Music.stop();
    this.nextPanel();
  },
  nextPanel() {
    this.i++;
    if (this.i >= this.script.length) { this.finish(); return; }
    this.p = this.script[this.i]; this.t = 0; this.li = 0; this.chars = 0; this.fade = 1; this.parts = [];
    Sound.play(this.i === 0 ? 'whoosh' : 'page');
  },
  finish() {
    if (this.done) return; this.done = true;
    META.seen['cine_' + this.key] = true; saveMeta();
    const t = this.then;
    if (typeof t === 'function') t(); else if (t) go(t[0], t[1]); else go('farm', {});
  },
  line() { return this.p.lines[this.li]; },
  tap() {
    const ln = this.line(); if (!ln) return;
    const full = trUp(ln[1]).length;
    if (this.chars < full) { this.chars = full; return; }
    Sound.play('click');
    if (this.li < this.p.lines.length - 1) { this.li++; this.chars = 0; } else this.nextPanel();
  },
  key(k) { if (k === 'Enter' || k === ' ') { this.tap(); return true; } if (k === 'Escape') { this.finish(); return true; } return false; },
  update(dt) {
    this.t += dt; this.fade = Math.max(0, this.fade - dt * 2.2);
    const ln = this.line();
    if (ln) { const full = trUp(ln[1]).length, prev = Math.floor(this.chars); this.chars = Math.min(full, this.chars + dt * 40); if (Math.floor(this.chars) !== prev && Math.floor(this.chars) % 5 === 0) Sound.play('talk'); }
    // a few particles per panel give the paintings some life
    const fx = this.p && this.p.fx, ps = this.parts;
    if (fx && ps.length < 26 && Math.random() < dt * 14) {
      const r = Math.random();
      if (fx === 'confetti') ps.push({ x: r * 224, y: -4, vx: (Math.random() - 0.5) * 10, vy: 18 + Math.random() * 14, c: [C.red, C.yellow, C.cyan, C.white, C.green][Math.floor(Math.random() * 5)], life: 9 });
      else if (fx === 'rise') ps.push({ x: 90 + r * 50, y: 165, vx: (Math.random() - 0.5) * 4, vy: -(10 + Math.random() * 10), c: Math.random() < 0.5 ? C.sand : C.white, life: 9 });
      else if (fx === 'stars') ps.push({ x: r * 224, y: Math.random() * 160, vx: -30 - Math.random() * 30, vy: 0, c: C.white, life: 3 });
      else if (fx === 'twinkle' || fx === 'spot') ps.push({ x: r * 224, y: Math.random() * 100, vx: 0, vy: 0, c: fx === 'spot' ? C.yellow : C.cyan, life: 0.6 });
      else if (fx === 'dust') ps.push({ x: r * 224, y: Math.random() * 160, vx: 2 + Math.random() * 3, vy: -1 - Math.random() * 2, c: C.sand, life: 4 });
    }
    for (let k = ps.length - 1; k >= 0; k--) { const q = ps[k]; q.x += q.vx * dt; q.y += q.vy * dt; q.life -= dt; if (q.life <= 0 || q.y > 170 || q.y < -10) ps.splice(k, 1); }
  },
  draw() {
    rect(0, 0, W, H, C.ink);
    const p = this.p; if (!p) return;
    if (p.title) return this.drawTitle(p);
    const img = IMPORTED_ART.story[p.img];
    const iw = img ? img.width : 224, ih = img ? img.height : 160;
    const ln = this.line();
    const lines = ln ? wrapText(ln[1], ln[0] ? W - 60 : W - 24) : [];
    const textH = 74, blockH = 16 + ih + 8 + textH;
    const top = Math.max(SAFE.t + 4, Math.round(SAFE.t + (H - SAFE.t - SAFE.b - blockH) / 2));
    const iy = top + 16;
    // slow pan across the painting (it is a little wider than the screen)
    const span = Math.max(0, iw - W), dur = 4 + p.lines.length * 3.2;
    const k = Math.min(1, this.t / dur), ix = Math.round(W / 2 - iw / 2 + (span / 2) * (1 - 2 * Ease.inOut(k)) * (this.i % 2 ? -1 : 1));
    if (img) spr(img, ix, iy);
    else { for (let i = 0; i < 60; i++) pix((hash2(i, 3) * W) | 0, iy + ((hash2(i, 4) * ih) | 0), i % 5 ? C.slate : C.white); }
    for (const q of this.parts) { g.globalAlpha = Math.min(1, q.life); pix(Math.round(ix + q.x), Math.round(iy + q.y), q.c); }
    g.globalAlpha = 1;
    if (p.fx === 'spot') { g.globalAlpha = 0.08 + 0.06 * Math.sin(this.t * 7); rect(0, iy, W, ih, C.yellow); g.globalAlpha = 1; }
    // letterbox edges and caption
    rect(0, iy - 1, W, 1, C.ink); rect(0, iy + ih, W, 1, C.ink);
    textO(p.cap, W / 2, top + 2, C.yellow, 'center');
    // progress dots
    const n = this.script.length, dx0 = Math.round(W / 2 - (n * 6) / 2);
    for (let i = 0; i < n; i++) rect(dx0 + i * 6, iy + ih + 4, 4, 2, i < this.i ? C.gray : i === this.i ? C.yellow : C.slate);
    // subtitles: narration is centred without a face, dialogue gets its portrait
    const ty = iy + ih + 12;
    if (ln) {
      let left = Math.floor(this.chars);
      if (!ln[0]) {
        lines.forEach((s, i) => { if (left <= 0) return; const part = s.slice(0, left); left -= s.length + 1; text(part, W / 2 - textWidth(s) / 2, ty + 4 + i * 10, C.lgray); });
      } else {
        rect(10, ty, 30, 30, C.ink); rect(11, ty + 1, 28, 28, C.slate);
        if (PORTRAIT[ln[0]]) spr(PORTRAIT[ln[0]], 11, ty + 1);
        text(SPEAKERS[ln[0]] || ln[0], 46, ty, C.yellow);
        lines.forEach((s, i) => { if (left <= 0) return; const part = s.slice(0, left); left -= s.length + 1; text(part, 46, ty + 11 + i * 9, C.white); });
      }
      if (this.chars >= trUp(ln[1]).length && Math.floor(T * 3) % 2 === 0) triDown(W - 14, Math.min(H - SAFE.b - 10, ty + textH - 12), C.yellow);
    }
    this.drawControls();
  },
  drawTitle(p) {
    // closing card: the game's name over drifting stars
    for (let i = 0; i < 90; i++) { const h = hash2(i, 31), sp = 6 + h * 30; pix((hash2(i, 32) * W) | 0, ((hash2(i, 33) * H + this.t * sp) % H) | 0, i % 9 === 0 ? C.cyan : h > 0.6 ? C.white : C.slate); }
    const sc = W >= 176 ? 4 : 3, ly = Math.round(H * 0.38), a = Math.min(1, this.t / 1.2);
    g.globalAlpha = a;
    for (const [dx, dy] of [[-sc, 0], [sc, 0], [0, -sc], [0, sc * 2]]) text('DÖRTNALA', W / 2 + dx, ly + dy, C.ink, 'center', sc);
    text('DÖRTNALA', W / 2, ly + sc, C.rust, 'center', sc); text('DÖRTNALA', W / 2, ly, C.yellow, 'center', sc);
    textO('GALAKSİ KUPASI', W / 2, ly + 38, C.cyan, 'center');
    g.globalAlpha = Math.max(0, Math.min(1, (this.t - 1) / 0.8));
    const ln = this.line(); if (ln) textO(trUp(ln[1]).slice(0, Math.floor(this.chars)), W / 2, ly + 62, C.white, 'center');
    g.globalAlpha = 1;
    if (this.t > 4.5) this.nextPanel();
    this.drawControls();
  },
  drawControls() {
    UI.block(0, 0, W, H, () => this.tap());
    button('cine_skip', W - SAFE.r - 46, SAFE.t + 4, 42, 14, 'ATLA', () => this.finish(), { kind: 'secondary' });
    if (this.fade > 0) { g.globalAlpha = this.fade; rect(0, 0, W, H, C.ink); g.globalAlpha = 1; }
  }
};
