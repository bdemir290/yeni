// ================= RUN SCENE: SHOW DYNAMICS (v4.2) =================
// Grax's show leaks into the race: an audience rating (reyting) that sponsors reward and boredom
// punishes, live commentary, rhythm gates and scanner lasers that move with the music,
// Dörtnal mode at every 30 combo, Moko's betting table and the nemesis (rövanşçı rakip).
const pickAny = a => a[Math.floor(Math.random() * a.length)];
const fmtOdds = o => String(o).replace('.', ',');

Object.assign(SCENES.run, {
  // called from enter(), after rivals are spawned and tips are picked
  showInit() {
    this.rating = 35; this.ratingIdle = 0; this.ratingZeroT = 0; this.ratingPulse = 0;
    this.ratingOn = !this.tut && (!!META.tipsSeen.reyting || this.tips.indexOf('reyting') >= 0);
    this.grax = null; this.graxCd = 1.2;
    this.fever = 0; Music.fever = false;
    this.frost = 0; this.trickBeat = 0;
    this.lastGateY = -9999; this.lastScanY = -9999; this.meteors = [];
    this.nemRival = this.rivals.find(r => r.nem) || null;
    this.nemTaunt = this.nemRival && !this.nemRival.duel ? { txt: pickAny(NEMESIS_TAUNTS), t: 3 } : null;
    this.bet = null; this.betOffer = this.makeBetOffer();
  },
  onRaceStart() {
    if (this.tut) return;
    if (this.nemRival) {
      this.banner = { txt: 'RÖVANŞ GECESİ!', col: C.red }; this.bannerT = 1.6;
      floatText(this.nemRival.name + ' GERİ DÖNDÜ', W / 2, Math.round(H * 0.24) + 22, C.salmon, 1, -6, 1.6);
      this.say('nemesis', true);
    } else if (this.boss) this.say('boss', true);
    else if (this.duel) this.say('duel', true);
    else this.say('start', true);
  },

  // ---------- Grax ----------
  say(key, force) {
    if (this.tut || (!force && this.graxCd > 0)) return;
    const pool = GRAX_LINES[key]; if (!pool) return;
    this.grax = { txt: pickAny(pool), t: 2.4 }; this.graxCd = force ? 2.6 : 5;
  },

  // ---------- audience rating ----------
  rate(n) {
    if (!this.ratingOn || this.state !== 'run') return;
    if (n >= 1) { this.ratingIdle = 0; this.ratingPulse = 0.25; } // a plain perfect hit is not a show moment
    this.rating = clamp(this.rating + n, 0, 100);
    if (this.rating >= 100) this.sponsorGift();
  },
  updateShow(dt) {
    const P = this.P;
    if (this.grax) { this.grax.t -= dt; if (this.grax.t <= 0) this.grax = null; }
    if (this.graxCd > 0) this.graxCd -= dt;
    if (this.ratingPulse > 0) this.ratingPulse -= dt;
    if (this.nemTaunt && this.state === 'run') { this.nemTaunt.t -= dt; if (this.nemTaunt.t <= 0) this.nemTaunt = null; }
    if (this.fever > 0) {
      this.fever -= dt;
      if (Math.random() < dt * 40) addPart(P.x + (Math.random() - 0.5) * 8, this.pY + 10, (Math.random() - 0.5) * 24, 60 + Math.random() * 40, 0.5, [C.magenta, C.cyan, C.yellow, C.green][Math.floor(T * 20) % 4], 1);
      if (this.fever <= 0 || this.state !== 'run') this.endFever();
    }
    // meteors: a growing shadow, then the rock lands (never right on top of the horse)
    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const m = this.meteors[i]; m.t -= dt;
      if (m.t > 0) continue;
      this.meteors.splice(i, 1);
      if (m.y - P.dist < 45) continue;
      this.addObs('rock', m.lane, 1, m.y, { v: 1, kum: m.kind === 'kum' });
      if (m.kind === 'kum') { burst(this.laneX(m.lane), this.sy(m.y), 12, [C.sand, C.tan, C.orange0], 55, 0.6, 80, 2); shake(2, 0.12); Sound.play('boom'); continue; }
      burst(this.laneX(m.lane), this.sy(m.y), 10, [C.orange, C.yellow, C.gray], 60, 0.5, 60, 2); shake(2, 0.12); Sound.play('boom');
    }
    if (!this.ratingOn || this.state !== 'run') return;
    this.ratingIdle += dt;
    if (this.ratingIdle > 1.5) this.rating = Math.max(0, this.rating - dt * (this.type === 'boss' ? 1.5 : 3));
    if (this.rating <= 0 && this.type !== 'boss') { this.ratingZeroT += dt; if (this.ratingZeroT > 5) this.boredEvent(); }
    else this.ratingZeroT = 0;
  },
  sponsorGift() {
    const P = this.P, S = this.S;
    this.rating = 40; META.stats.sponsors = (META.stats.sponsors || 0) + 1; missionEvent('sponsor', 1);
    const opts = ['coins', 'nefes', 'shield']; if (RUN.hp < S.maxHp) opts.push('heart');
    const k = pickAny(opts); let label;
    if (k === 'coins') { const l = Math.floor(Math.random() * 4); for (let i = 0; i < 12; i++) this.addObs('coin', l + (i % 2), 1, P.dist + 110 + i * 12); label = 'SİKKE YAĞMURU'; }
    else if (k === 'nefes') { this.nefes = Math.min(100, this.nefes + 50); label = 'NEFES TÜPÜ: +50 NEFES'; }
    else if (k === 'shield') { P.shield++; label = 'KALKAN'; }
    else { RUN.hp = Math.min(S.maxHp, RUN.hp + 1); label = 'ŞİFA JELİ: +1 CAN'; }
    this.banner = { txt: 'SPONSOR HEDİYESİ!', col: C.gold }; this.bannerT = 1.6;
    floatText(label, W / 2, Math.round(H * 0.24) + 22, C.yellow, 1, -6, 1.5);
    Sound.play('gift'); haptic('success');
    for (let i = 0; i < 14; i++) addPart(W / 2 + (Math.random() - 0.5) * 60, SAFE.t + 30, (Math.random() - 0.5) * 80, 40 + Math.random() * 60, 0.8, [C.gold, C.yellow, C.white][i % 3], 2);
    this.say('sponsor', true);
  },
  boredEvent() {
    const P = this.P, n = RUN.region >= 1 ? 3 : 2;
    this.ratingZeroT = 0; this.rating = 30; RUN.bored = (RUN.bored || 0) + 1;
    // each landing spot must leave the horse a way through (see 06f_run_fair)
    for (let i = 0; i < n; i++) {
      const y = P.dist + 260 + i * 45, lane = this.pickSafeLanes(1, y)[0];
      if (lane == null) continue;
      const t0 = 0.8 + i * 0.15; this.meteors.push({ lane, y, t: t0, t0 });
    }
    this.banner = { txt: 'METEOR YAĞMURU!', col: C.salmon }; this.bannerT = 1.6;
    Sound.play('warn'); this.say('bored', true);
  },

  // ---------- Dörtnal mode ----------
  startFever() {
    if (this.tut || this.fever > 0 || this.state !== 'run') return;
    this.fever = 5; Music.fever = true; RUN.fevers = (RUN.fevers || 0) + 1;
    META.stats.fevers = (META.stats.fevers || 0) + 1; missionEvent('fever', 1);
    Sound.play('power'); flash(C.magenta, 0.25); haptic('success');
    this.banner = { txt: 'DÖRTNAL MODU!', col: C.magenta }; this.bannerT = 1.6;
    if (!META.tipsSeen.fever) { META.tipsSeen.fever = true; toast('DÖRTNAL: 5 SN HIZ, ÇİFT ATIŞ, ENGELLER KIRILIR', C.magenta, 'flame'); }
    this.rate(10); this.say('fever', true);
  },
  endFever() {
    const was = this.fever > 0 || Music.fever;
    this.fever = 0; Music.fever = false;
    this.frost = 0; this.trickBeat = 0;
    if (was && this.state === 'run') floatText('DÖRTNAL BİTTİ', W / 2, this.pY - 40, C.lgray, 1, -8, 0.8);
  },

  // ---------- rhythm gates: hit 2 notes on the approach and the gate opens ----------
  updateGate(o, dy, dt) {
    const P = this.P;
    if (o.open && o.openT > 0) o.openT -= dt;
    if (!o.armed && !o.passed && dy > 0 && dy < this.pY + 6) { o.armed = true; o.charge = 0; o.missed = false; }
    if (o.passed || dy >= 2) return;
    o.passed = true;
    // few notes on the approach (holds, rests, high speed): an unbroken streak still opens it
    if (!o.open && o.armed && o.charge >= 1 && !o.missed) this.openGate(o);
    if (o.open) {
      P.cleanT = Math.max(P.cleanT, 1); this.gainNefes(6); this.addBond(4);
      floatText('TAM RİTİM!', P.x, this.pY - 26, C.green, 1, -14, 0.7); Sound.play('sling');
      this.rate(8);
    } else if (P.flyT > 0 || this.fever > 0 || this.invulnerable()) {
      floatText('GEÇTİN', P.x, this.pY - 22, C.lgray, 1, -10, 0.5);
    } else {
      P.slowT = 0.75; P.slowAmt = 0.4 * (1 - Math.min(0.8, this.S.slowResist));
      this.nefes = Math.max(0, this.nefes - 10);
      if (this.combo > 0 && P.stormT <= 0) this.combo = 0;
      o.flash = 0.4; shake(3, 0.2); flash(C.red, 0.12); haptic('heavy'); Sound.play('zap'); RUN.gateShut = (RUN.gateShut || 0) + 1;
      floatText('KAPI KAPALI!', P.x, this.pY - 26, C.red, 1, -14, 0.8);
      this.rate(-10); this.say('gateShut', true);
    }
  },
  gateHit() {
    for (const o of this.obs) {
      if (o.dead || o.kind !== 'rgate' || !o.armed || o.open || o.passed) continue;
      o.charge++;
      if (o.charge >= o.need) this.openGate(o);
    }
  },
  gateMiss() {
    for (const o of this.obs) if (!o.dead && o.kind === 'rgate' && o.armed && !o.open && !o.passed) { o.missed = true; if (o.charge > 0) { o.charge = 0; o.flash = 0.25; } }
  },
  openGate(o) {
    o.open = true; o.openT = 0.5;
    const sy = this.sy(o.y);
    for (let i = 0; i < 16; i++) addPart(this.trackL + Math.random() * this.laneW * 5, sy - 5, (Math.random() - 0.5) * 60, -20 - Math.random() * 40, 0.6, i % 2 ? C.cyan : C.white, 1);
    Sound.play('gate'); RUN.gates = (RUN.gates || 0) + 1; META.stats.gates = (META.stats.gates || 0) + 1; missionEvent('gate', 1);
    floatText('KAPI AÇILDI!', W / 2, clamp(sy - 24, SAFE.t + 60, this.pY - 40), C.cyan, 1, -10, 0.8);
    this.say('gateOpen');
  },

  // ---------- scanner lasers: one lane per beat, bouncing at the rails ----------
  scanBeat() {
    const P = this.P;
    for (const o of this.obs) {
      if (o.dead || o.kind !== 'scan') continue;
      const dy = o.y - P.dist; if (dy < -20 || dy > this.pY + 80) continue;
      let nl = o.lane + o.dir;
      if (nl < 0 || nl > 4) { o.dir = -o.dir; nl = o.lane + o.dir; }
      o.fromVis = o.vis; o.lane = nl; o.mt = 0;
    }
  },

  // ---------- Moko's betting table (sprints and duels) ----------
  makeBetOffer() {
    if (this.tut || (this.type !== 'sprint' && this.type !== 'duello') || RUN.coins < 15) return null;
    if ((META.stats.betOffers || 0) > 0 && Math.random() > 0.6) return null;
    META.stats.betOffers = (META.stats.betOffers || 0) + 1;
    const nem = !!this.nemRival;
    return { odds: nem ? 3 : this.type === 'duello' ? 2 : 2.5, stakes: [15, 40].filter(s => RUN.coins >= s), nem };
  },
  placeBet(stake) {
    if (!this.betOffer) return;
    if (stake > 0 && RUN.coins >= stake) {
      RUN.coins -= stake; this.bet = { stake, odds: this.betOffer.odds };
      Sound.play('buy'); floatText('BAHİS: ' + stake + ' SİKKE', W / 2, this.pY - 50, C.yellow, 1, -10, 1);
    } else Sound.play('select');
    this.betOffer = null;
    if (!this.tipKey) this.startClock();
  },
  settleBet(won) {
    const b = this.bet; if (!b) return;
    this.bet = null;
    if (won) {
      const pay = Math.round(b.stake * b.odds);
      RUN.coins += pay; RUN.coinsEarned += pay; missionEvent('coins', RUN.coinsEarned);
      META.stats.betWins = (META.stats.betWins || 0) + 1; missionEvent('bet', 1);
      floatText('BAHİS: +' + pay + ' SİKKE', W / 2, this.pY - 30, C.yellow, 1, -8, 1.5); Sound.play('buy');
      this.say('betWin', true);
    } else floatText('BAHİS GİTTİ', W / 2, this.pY - 30, C.salmon, 1, -8, 1.3);
  },

  // ---------- nemesis ----------
  nemesisLv(id) { const N = META.nemesis; return N && N.id === id ? N.lv : 0; },
  markNemesis(id) {
    if (!id || !RIVAL_BY_ID[id]) return;
    const N = META.nemesis;
    if (N && N.id !== id) return;
    if (N) { N.lv = Math.min(3, N.lv + 1); N.wins = (N.wins || 0) + 1; } else META.nemesis = { id, lv: 1, wins: 1 };
    const lv = META.nemesis.lv;
    toast('RÖVANŞÇI: ' + RIVAL_BY_ID[id].name + (lv > 1 ? ' SV ' + lv : ''), C.red, 'crown');
    saveMeta();
  },
  takeRevenge() {
    const N = META.nemesis; if (!N) return;
    const yon = 8 + 6 * N.lv;
    RUN.yonca += yon; missionEvent('yonca', yon);
    if (N.lv >= 2) RUN.seker++;
    META.nemesis = null; META.stats.revenges = (META.stats.revenges || 0) + 1; missionEvent('revenge', 1);
    this.banner = { txt: 'RÖVANŞ ALINDI!', col: C.gold }; this.bannerT = 1.8;
    floatText('+' + yon + ' KRİSTAL' + (N.lv >= 2 ? ' +1 ŞEKER' : ''), W / 2, Math.round(H * 0.24) + 22, C.cyan, 1, -6, 1.6);
    Sound.play('medal'); this.say('revenge', true); saveMeta();
  },
  // after the player crosses the line: bets, revenge, new nemesis
  settleRace(rank) {
    if (this.tut) return;
    const won = rank === 1;
    if (this.type === 'sprint' || this.type === 'duello') this.settleBet(won);
    if (this.type === 'duello' && this.duel) {
      if (won && this.duel.r.nem) this.takeRevenge();
      else if (!won) this.markNemesis(this.duel.def.id);
    } else if (this.type === 'sprint') {
      const nr = this.nemRival;
      if (nr && this.finished.indexOf(nr) < 0) this.takeRevenge();
      else if (!won && this.finished[0] && this.finished[0].id) this.markNemesis(this.finished[0].id);
    }
  },

  // ---------- drawing ----------
  drawGate(o, sy, ox) {
    const x0 = this.trackL + ox, w = this.laneW * 5;
    const col = o.open ? C.green : o.flash > 0 ? C.red : C.cyan;
    for (const px of [x0 - 3, x0 + w]) { rect(px, sy - 12, 3, 14, C.ink); rect(px + 1, sy - 11, 1, 12, C.gray); pix(px + 1, sy - 12, col); }
    const a = o.open ? clamp((o.openT || 0) * 2, 0, 1) : 1;
    if (a > 0) {
      const pulse = 0.25 + 0.3 * (1 - this.beatFrac());
      g.globalAlpha = pulse * a; rect(x0, sy - 10, w, 10, col);
      g.globalAlpha = 0.3 * a; for (let yy = sy - 9 + Math.floor(T * 12) % 3; yy < sy; yy += 3) hline(x0, yy, w, C.white);
      g.globalAlpha = a; hline(x0, sy - 11, w, col); hline(x0, sy, w, col); g.globalAlpha = 1;
    }
    if (o.passed) return;
    const cx = Math.round(x0 + w / 2);
    for (let i = 0; i < o.need; i++) {
      const lx = cx - (o.need - 1) * 6 + i * 12, on = o.open || i < o.charge;
      circle(lx, sy - 16, 4, C.ink); circle(lx, sy - 16, 3, on ? (o.open ? C.green : C.yellow) : C.slate);
      if (on) pix(lx - 1, sy - 17, C.white);
    }
    if (o.armed && !o.open) textO((o.need - o.charge) + ' VURUŞ', cx, sy - 30, C.cyan, 'center');
  },
  drawScan(o, sy, ox) {
    const x0 = this.trackL + ox, lw = this.laneW, w = lw * 5, vis = o.vis == null ? o.lane : o.vis;
    g.globalAlpha = 0.5; hline(x0, sy, w, C.wine); g.globalAlpha = 1;
    for (const px of [x0 - 4, x0 + w + 1]) { rect(px, sy - 6, 3, 8, C.ink); pix(px + 1, sy - 5, C.red); pix(px + 1, sy - 3, C.salmon); }
    // where it goes on the next beat, as a faint outline
    let nl = o.lane + o.dir; if (nl < 0 || nl > 4) nl = o.lane - o.dir;
    g.globalAlpha = 0.3 + 0.3 * this.beatFrac(); box(Math.round(x0 + nl * lw) + 3, sy - 17, lw - 6, 19, C.red); g.globalAlpha = 1;
    // the beam fills its lane
    const bx = Math.round(x0 + vis * lw), cx = bx + Math.floor(lw / 2);
    g.globalAlpha = 0.3; rect(bx + 2, sy - 18, lw - 4, 21, C.red);
    g.globalAlpha = 0.7 + 0.3 * Math.sin(T * 30); rect(bx + 5, sy - 18, lw - 10, 21, C.red);
    g.globalAlpha = 1; rect(cx - 2, sy - 18, 4, 21, C.salmon); vline(cx, sy - 18, 21, C.white);
    pix(cx + o.dir * 6, sy - 22, C.salmon); pix(cx + o.dir * 5, sy - 23, C.salmon); pix(cx + o.dir * 5, sy - 21, C.salmon);
  },
  drawShowFX(ox, oy) {
    for (const m of this.meteors) {
      const sy = Math.round(this.sy(m.y)) + oy, k = 1 - m.t / m.t0, x = this.laneX(m.lane) + ox + this.offY(sy);
      if (m.kind === 'kum') { // the worm bulges up through the sand
        g.globalAlpha = 0.35 + 0.4 * k; ellipse(x, sy + 2, 5 + Math.round(4 * k), 2 + Math.round(2 * k), C.tan);
        g.globalAlpha = Math.floor(T * 10) % 2 ? 0.9 : 0.45; ring(x, sy + 2, Math.max(3, 9 - Math.round(4 * k)), C.orange); g.globalAlpha = 1;
        if (rnd() < 0.5) addPart(x + (rnd() - 0.5) * 10, sy, (rnd() - 0.5) * 20, -20 - rnd() * 20, 0.4, C.sand, 1, 60);
        continue;
      }
      g.globalAlpha = 0.3 + 0.4 * k; ellipse(x, sy + 2, 4 + Math.round(5 * k), 2 + Math.round(2 * k), C.ink);
      g.globalAlpha = Math.floor(T * 10) % 2 ? 0.9 : 0.4; ring(x, sy + 2, Math.max(3, 10 - Math.round(5 * k)), C.red); g.globalAlpha = 1;
      const fx = x + Math.round((1 - k) * 24), fy = sy - Math.round((1 - k) * 90);
      for (let i = 1; i < 7; i++) { pix(fx + i * 2, fy - i * 3, i < 3 ? C.yellow : i < 5 ? C.orange : C.rust); pix(fx + i * 2 + 1, fy - i * 3, C.orange0); }
      circle(fx, fy, 4, C.rust); circle(fx, fy, 3, C.orange); circle(fx - 1, fy - 1, 1, C.yellow);
    }
    if (this.frost > 0) { // frost creeps in from the edges
      const k = clamp(this.frost / 0.5, 0, 1);
      g.globalAlpha = 0.35 * k; rect(0, 0, W, 4, C.white); rect(0, H - 4, W, 4, C.white); rect(0, 0, 4, H, C.white); rect(W - 4, 0, 4, H, C.white);
      g.globalAlpha = 0.18 * k; rect(0, 0, W, H, C.sky); g.globalAlpha = 1;
      for (let i = 0; i < 10; i++) { const fx = hash2(i, 3) * W, fy = (hash2(i, 4) * H + T * 20) % H; spr(OB.flake, fx, fy); }
    }
    if (this.fever > 0) {
      const c = Math.floor(T * 8) % 2 ? C.yellow : C.cyan;
      g.globalAlpha = 0.55 + 0.2 * Math.sin(T * 12);
      rect(0, 0, W, 3, c); rect(0, H - 3, W, 3, c); rect(0, 0, 3, H, c); rect(W - 3, 0, 3, H, c);
      g.globalAlpha = 0.25; rect(3, 3, W - 6, 2, C.white); rect(3, H - 5, W - 6, 2, C.white); rect(3, 3, 2, H - 6, C.white); rect(W - 5, 3, 2, H - 6, C.white);
      g.globalAlpha = 1;
    }
  },
  drawShowHUD() {
    const top = SAFE.t + 4;
    if (this.ratingOn) {
      const x = 4 + SAFE.l, y = top + 24, col = this.rating >= 70 ? C.gold : this.rating >= 25 ? C.cyan : C.salmon;
      spr(ICONS.tv, x, y - 2);
      bar(x + 11, y, 30, 3, this.rating / 100, this.ratingPulse > 0 && Math.floor(T * 20) % 2 ? C.white : col);
      if (this.ratingZeroT > 2 && Math.floor(T * 6) % 2 === 0) textO('SIKICI!', x + 11, y + 5, C.salmon);
    }
    if (this.bet) textO(this.bet.stake + 'X' + fmtOdds(this.bet.odds), W - SAFE.r - 20, top + 11, C.yellow, 'right');
    if (this.fever > 0) {
      const rx = W / 2, ry = H - SAFE.b - 24;
      textO('DÖRTNAL', rx, ry - 64, Math.floor(T * 10) % 2 ? C.magenta : C.salmon, 'center');
      bar(rx - 20, ry - 55, 40, 2, this.fever / 5, C.magenta);
    }
    if (this.grax && !TOASTS.length) { // a tip toast takes the same strip: Grax waits
      const g0 = this.grax, k = clamp(g0.t / 0.25, 0, 1) * clamp((2.4 - g0.t) / 0.15, 0, 1);
      const tw = Math.min(W - 8, textWidth(g0.txt) + 16), x = Math.round(W / 2 - tw / 2), y = top + (this.reis && !this.reis.dead ? 60 : 46);
      g.globalAlpha = 0.8 * k; rrect(x, y, tw, 11, C.ink);
      g.globalAlpha = k; spr(ICONS.grax, x + 2, y + 1); text(g0.txt, x + 13, y + 2, C.yellow);
      g.globalAlpha = 1;
    }
  },
  drawBet() {
    const B = this.betOffer, pw = Math.min(W - 16, 214), odds = fmtOdds(B.odds);
    const msg = (B.nem ? 'RÖVANŞ GECESİ, ORANLAR YÜKSEK! ' : '') + (this.type === 'duello' ? 'DÜELLOYU KAZANIRSAN' : 'BİRİNCİ GELİRSEN') + ' SİKKENİ ' + odds + ' KATINA ÇIKARIRIM. VAR MISIN DÜNYALI?';
    const lines = wrapText(msg, pw - 52), n = 1 + B.stakes.length;
    const ph = 26 + Math.max(30, lines.length * 9) + 30;
    const px = Math.round(W / 2 - pw / 2), py = Math.round(Math.max(SAFE.t + 30, H * 0.4 - ph / 2));
    g.globalAlpha = 0.45; rect(0, 0, W, H, C.ink); g.globalAlpha = 1;
    panel(px, py, pw, ph, 'MOKO\'NUN BAHİS MASASI', C.yellow);
    rect(px + 7, py + 18, 30, 30, C.ink); rect(px + 8, py + 19, 28, 28, C.slate); spr(PORTRAIT.moko, px + 8, py + 19);
    lines.forEach((ln, i) => text(ln, px + 44, py + 20 + i * 9, C.white));
    const by = py + ph - 24, gap = 6, bw = Math.floor((pw - 16 - (n - 1) * gap) / n);
    button('bet_pas', px + 8, by, bw, 16, 'PAS', () => this.placeBet(0), { kind: 'secondary' });
    B.stakes.forEach((st, i) => button('bet_' + st, px + 8 + (i + 1) * (bw + gap), by, bw, 16, String(st), () => this.placeBet(st), { icon: 'coin0', kind: 'primary' }));
    iconNum('coin0', RUN.coins, px + 10, by - 11, C.yellow);
  }
});
