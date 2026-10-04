// ================= RUN SCENE: FOES, BOSS, ENDINGS, TUTORIAL =================
Object.assign(SCENES.run, {
  // ---------- foes ----------
  pickFoe() {
    const w = this.reg.foes; let tot = 0;
    for (const k in w) tot += w[k];
    let r = rnd() * tot;
    for (const k in w) { r -= w[k]; if (r <= 0) return (k === 'kalkanli' && RUN.region === 0 && RUN.cleared < 2) ? 'domuz' : k; }
    return 'karga';
  },
  makeFoe(kind, lane, dist, extra) {
    const x = this.laneX(lane), def = FOES[kind];
    const hp = Math.round(def.hp * (1 + 0.15 * this.reg.tier) * (this.elite ? 1.3 : 1) * 10) / 10;
    const f = Object.assign({ kind, lane, x, bx: x, fromX: x, laneT: 1, dist, hp, maxHp: hp, t: 0, ph: rnd() * 6, flash: 0, stun: 0, dead: false, r: (kind === 'eskiya' || kind === 'okcu') ? 7 : 6, seen: false, hitP: 0, passed: false, amp: 0.9, burnT: 0, burnDps: 0 }, extra || {});
    if (kind === 'karga') { f.v = -12; f.rel = 0.55; }
    else if (kind === 'domuz') f.v = -75;
    else if (kind === 'kalkanli') { f.v = -14; f.r = 7; }
    else if (kind === 'okcu') { f.v = 0; f.life = R.f(12, 16); f.gapT = R.f(115, 150); f.laneTimer = R.f(1, 2); f.cool = R.i(2, 3); f.aim = false; }
    else { f.v = 0; f.life = R.f(11, 15); f.gapT = R.f(72, 100); f.laneTimer = R.f(0.8, 1.6); f.dropT = R.f(1.4, 2.2); }
    return f;
  },
  spawnFoeAt(y, kind) {
    kind = kind || this.pickFoe();
    const alive = k => this.foes.filter(f => f.kind === k && !f.dead).length;
    const cap = this.type === 'baskin' ? 2 : 1;
    if ((kind === 'eskiya' || kind === 'okcu') && alive(kind) >= cap) kind = 'karga';
    if (kind === 'kalkanli' && alive('kalkanli') >= 2) kind = 'domuz';
    this.foes.push(this.makeFoe(kind, R.i(0, 4), y));
  },
  foeTip(kind) {
    const k = 'foe_' + kind;
    if (META.tipsSeen[k]) return;
    META.tipsSeen[k] = true; toast(FOE_TIPS[kind], C.yellow, 'target');
  },
  spawnTutCrows() {
    const P = this.P;
    [95, 130, 165].forEach(off => this.foes.push(this.makeFoe('karga', P.lane, P.dist + off + 80, { tut: true, hover: off, amp: 0.22, seen: true })));
  },
  riderMove(f, dt) {
    const P = this.P;
    f.life -= dt;
    const target = P.dist + (f.life > 0 ? f.gapT : 320);
    const v = clamp(P.speed + (target - f.dist) * 1.3, P.speed * 0.55, P.speed * 1.6);
    f.dist += v * dt * (f.stun > 0 ? 0.5 : 1);
    f.laneTimer -= dt;
    if (f.kind === 'eskiya') {
      if (f.laneTimer <= 0 && f.laneT >= 1 && f.stun <= 0) {
        f.laneTimer = R.f(1.4, 2.4);
        const dir = Math.sign(P.lane - f.lane) || R.pick([-1, 1]);
        const nl = clamp(f.lane + dir, 0, 4);
        if (nl !== f.lane) { f.fromX = f.x; f.lane = nl; f.laneT = 0; }
      }
      f.dropT -= dt;
      if (f.dropT <= 0 && f.life > 0 && f.dist - P.dist > 45 && f.stun <= 0) { f.dropT = R.f(2.0, 3.0); this.addObs('civi', f.lane, 1, f.dist - 10); }
    } else if (f.laneTimer <= 0 && f.laneT >= 1 && f.stun <= 0 && !f.aim) {
      f.laneTimer = R.f(1.6, 2.8);
      const dir = Math.sign(P.lane - f.lane);
      if (dir) { f.fromX = f.x; f.lane += dir; f.laneT = 0; }
    }
    if (f.dist - P.dist > this.pY + 60) f.dead = true;
  },
  okcuBeat(f) {
    if (f.life <= 0 || f.stun > 0 || this.state !== 'run') { f.aim = false; return; }
    if (f.aim) {
      f.aim = false; f.cool = R.i(3, 4);
      this.eShots.push({ x: this.laneX(f.aimLane), lane: f.aimLane, dist: f.dist - 10, v: -220, dead: false });
      Sound.play('shoot');
    } else if (--f.cool <= 0 && f.dist - this.P.dist > 60 && f.laneT >= 1) { f.aim = true; f.aimLane = f.lane; Sound.play('warn'); }
  },
  guardBeat(f, b) {
    if (f.stun > 0 || b % 2 !== 0) return;
    const P = this.P, dy = f.dist - P.dist;
    if (dy > 30 && dy < 230 && f.laneT >= 1 && f.lane !== P.lane) { f.fromX = f.x; f.lane += Math.sign(P.lane - f.lane); f.laneT = 0; }
  },
  updateFoes(dt) {
    const P = this.P;
    for (const f of this.foes) {
      if (f.dead) continue;
      f.t += dt; f.flash = Math.max(0, f.flash - dt); f.stun = Math.max(0, f.stun - dt); f.hitP = Math.max(0, f.hitP - dt);
      if (f.burnT > 0) {
        f.burnT -= dt; f.hp -= f.burnDps * dt;
        if (rnd() < dt * 12) addPart(f.x + (rnd() - 0.5) * 8, this.sy(f.dist) - 4, 0, -20, 0.4, rnd() < 0.5 ? C.orange : C.yellow, 1);
        if (f.hp <= 0.001) { this.killFoe(f); continue; }
      }
      const st = f.stun > 0 ? 0.2 : 1;
      if (f.hover) {
        f.dist = lerp(f.dist, P.dist + f.hover, Math.min(1, dt * 2.5));
        f.bx = lerp(f.bx, P.x, Math.min(1, dt * 1.6));
        f.x = f.bx + Math.sin(f.t * 2.6 + f.ph) * this.laneW * f.amp;
        continue;
      }
      if (f.kind === 'karga') { f.dist += (f.v + (f.stun > 0 ? 0 : P.speed * f.rel)) * dt; f.zz = (f.zz || 0) + dt * 2.6 * st; f.x = clamp(f.bx + Math.sin(f.zz + f.ph) * this.laneW * f.amp, this.trackL + 4, this.trackL + this.laneW * 5 - 4); }
      else if (f.kind === 'domuz' || f.kind === 'kalkanli') f.dist += f.v * dt * st;
      else this.riderMove(f, dt);
      if (f.dead) continue;
      if (f.kind !== 'karga' && f.laneT < 1) { f.laneT = Math.min(1, f.laneT + dt / (f.kind === 'kalkanli' ? 0.25 : 0.3)); f.x = lerp(f.fromX, this.laneX(f.lane), Ease.outQuad(f.laneT)); }
      const dy = f.dist - P.dist;
      if (dy < -50) { f.dead = true; continue; }
      if (!f.seen && dy < this.pY - 10) {
        f.seen = true; this.foeTip(f.kind);
        Sound.play(f.kind === 'domuz' ? 'grunt' : f.kind === 'karga' ? 'caw' : 'hey');
      }
      if (!f.passed && dy < -6) {
        f.passed = true;
        if (f.hitP <= 0 && this.state === 'run' && P.lane !== P.prevLane && this.time - P.laneAt < 0.45 && Math.abs(f.x - this.laneX(P.prevLane)) < this.laneW * 0.6) this.nearMiss();
      }
      if (this.state !== 'run' || f.hitP > 0 || Math.abs(dy) > 9 || Math.abs(f.x - P.x) > f.r + 3) continue;
      this.foeContact(f);
    }
    if (this.foes.length > 30 || this.foes.some(f => f.dead)) this.foes = this.foes.filter(f => !f.dead);
  },
  foeContact(f) {
    const P = this.P, S = this.S;
    if (P.flyT > 0 || (P.hamleT > 0 && S.hamleAir)) return;
    if ((P.hamleT > 0 && S.hamleRam) || (P.abilityT > 0 && RUN.jockey === 'ayse')) { this.damageFoe(f, Math.max(3, S.hamleRam), { breakShield: true }); f.hitP = 0.5; return; }
    if (P.hamleT > 0 && S.hamleInv) return;
    if (f.kind === 'domuz' && (P.jumping || P.floatT > 0)) {
      if (!f.jumped) { f.jumped = true; META.stats.jumps++; missionEvent('jump', 1); if (P.jumping) this.judgeJump(f); }
      return;
    }
    if (f.kind === 'eskiya' || f.kind === 'okcu') {
      f.hitP = 0.8;
      if (S.shoulder) { this.damageFoe(f, Math.max(1, S.shoulderDmg)); f.dist += 24; f.stun = 0.6; }
      else { P.slowT = 0.5; P.slowAmt = 0.3 * (1 - Math.min(0.8, S.slowResist)); P.bounce = R.pick([-1, 1]); floatText('!', P.x, this.pY - 16, C.red); }
      Sound.play('bump'); shake(2, 0.12); haptic('light');
      return;
    }
    f.hitP = 1;
    if (this.hurt('foe')) this.damageFoe(f, 1);
  },
  updateEShots(dt) {
    const P = this.P;
    for (const s of this.eShots) {
      if (s.dead) continue;
      s.dist += s.v * dt;
      if (s.dist < P.dist - 30) { s.dead = true; if (s.rival && this.state === 'run') { this.rate(4); this.say('dodge'); } continue; }
      if (this.state === 'run' && Math.abs(s.dist - P.dist) < 7 && Math.abs(s.x - P.x) < 7) { s.dead = true; this.hurt('arrow'); }
    }
    if (this.eShots.length) this.eShots = this.eShots.filter(s => !s.dead);
  },

  // ---------- bandit chief (mini-boss of the raid) ----------
  spawnReis() {
    this.reisDone = true;
    const P = this.P, def = FOES.reis;
    const hp = Math.round(def.hp * (1 + 0.4 * this.reg.tier) * (this.elite ? 1.3 : 1));
    const lane = clamp(P.lane + R.pick([-1, 1]), 0, 4), x = this.laneX(lane);
    this.reis = { kind: 'reis', lane, x, fromX: x, laneT: 1, dist: P.dist + this.pY + 40, hp, maxHp: hp, t: 0, ph: 0, flash: 0, stun: 0, dead: false, r: 8, gapT: 120, charge: 0, atkIdx: 0, aimLanes: null, burnT: 0, burnDps: 0, hitP: 0 };
    this.showBanner('KORSAN KAPTANI!', C.red); this.foeTip('reis'); Sound.play('roar'); shake(3, 0.3);
  },
  updateReis(dt) {
    const Rz = this.reis; if (!Rz || Rz.dead) return;
    const P = this.P;
    Rz.t += dt; Rz.flash = Math.max(0, Rz.flash - dt); Rz.stun = Math.max(0, Rz.stun - dt); Rz.hitP = Math.max(0, Rz.hitP - dt);
    if (Rz.burnT > 0) { Rz.burnT -= dt; Rz.hp -= Rz.burnDps * dt; if (Rz.hp <= 0) { this.killReis(); return; } }
    let gap = Rz.gapT;
    if (Rz.charge > 0) { Rz.charge -= dt; if (Rz.charge > 0.7) gap = 12; }
    const fleeing = P.dist > this.length - 260 || this.state !== 'run';
    if (fleeing) gap = 420;
    const target = P.dist + gap;
    const v = clamp(P.speed + (target - Rz.dist) * (Rz.charge > 0.7 ? 2.6 : 1.4), P.speed * 0.3, P.speed * 1.8);
    Rz.dist += v * dt * (Rz.stun > 0 ? 0.5 : 1);
    if (Rz.laneT < 1) { Rz.laneT = Math.min(1, Rz.laneT + dt / 0.28); Rz.x = lerp(Rz.fromX, this.laneX(Rz.lane), Ease.outQuad(Rz.laneT)); }
    if (Rz.dist - P.dist > this.pY + 80) { Rz.dead = true; this.reis = null; if (fleeing && this.state === 'run') floatText('KAPTAN KAÇTI!', W / 2, this.pY - 70, C.salmon, 1, -8, 1.2); return; }
    const dy = Rz.dist - P.dist;
    if (this.state === 'run' && Rz.hitP <= 0 && Math.abs(dy) < 10 && Math.abs(Rz.x - P.x) < 10) {
      Rz.hitP = 1;
      if (P.hamleT > 0 && this.S.hamleRam) this.damageFoe(Rz, this.S.hamleRam * 2);
      else if (!(P.flyT > 0 || (P.hamleT > 0 && (this.S.hamleAir || this.S.hamleInv)))) this.hurt('reis');
    }
  },
  reisBeat(b) {
    const Rz = this.reis, P = this.P;
    if (Rz.stun > 0 || this.state !== 'run' || P.dist > this.length - 260) { Rz.aimLanes = null; return; }
    if (Rz.aimLanes) { for (const l of Rz.aimLanes) this.eShots.push({ x: this.laneX(l), lane: l, dist: Rz.dist - 10, v: -230, dead: false }); Rz.aimLanes = null; Sound.play('shoot'); return; }
    if (b % 2 === 0 && Rz.laneT >= 1 && Rz.charge <= 0) { const dir = Math.sign(P.lane - Rz.lane); if (dir) { Rz.fromX = Rz.x; Rz.lane += dir; Rz.laneT = 0; } }
    if (b % 4 !== 0) return;
    const atk = ['civi', 'karga', 'ok', 'hucum'][Rz.atkIdx++ % 4];
    if (atk === 'civi') { for (let l = P.lane - 1; l <= P.lane + 1; l++) if (l >= 0 && l <= 4) this.addObs('civi', l, 1, Rz.dist - 14); Sound.play('hey'); }
    else if (atk === 'karga') { for (const dl of [-1, 1]) this.foes.push(this.makeFoe('karga', clamp(Rz.lane + dl, 0, 4), Rz.dist + 10, { seen: true })); Sound.play('caw'); }
    else if (atk === 'ok') { Rz.aimLanes = [P.lane, clamp(P.lane + R.pick([-1, 1]), 0, 4)]; Sound.play('warn'); }
    else { Rz.charge = 1.7; Rz.fromX = Rz.x; Rz.lane = P.lane; Rz.laneT = 0; floatText('HÜCUM!', Rz.x, this.sy(Rz.dist) - 24, C.red, 1, -10, 0.9); Sound.play('roar'); }
  },
  killReis() {
    const Rz = this.reis; if (!Rz) return;
    Rz.dead = true; this.reis = null;
    this.kills += 3; RUN.kills += 3; META.stats.kills += 3; META.stats.reisKills++; missionEvent('kills', 3); missionEvent('reis', 1);
    const n = Math.round(FOES.reis.coins * this.S.foeCoins * this.S.coinMult);
    RUN.coins += n; RUN.coinsEarned += n; missionEvent('coins', RUN.coinsEarned);
    this.addObs(R.chance(0.3) ? 'sugar' : 'heart', Rz.lane, 1, Rz.dist - 30);
    const sy = this.sy(Rz.dist);
    burst(Rz.x, sy, 30, [C.wine, C.gold, C.white, C.red], 80, 0.9, 80, 2);
    floatText('KAPTAN DÜŞTÜ! +' + n, W / 2, this.pY - 70, C.gold, 1, -8, 1.5);
    Sound.play('win'); shake(4, 0.35); flash(C.gold, 0.25); haptic('success');
    if (this.type === 'baskin' && this.kills >= this.goal && this.kills - 3 < this.goal) { floatText('HEDEF TAMAM!', W / 2, this.pY - 54, C.green, 1, -8, 1.3); }
  },

  // ---------- boss ----------
  makeBoss() {
    const key = this.reg.boss, def = BOSSES[key], x = this.laneX(2);
    return { key, def, gap: 35, lane: 2, x, fromX: x, laneT: 1, laneTimer: 2, stun: 0, won: false, screenY: 0, set: def.horse ? getHorse(def.horse[0], def.horse[1]) : getMount(def.look), wob: 0, flash: 0,
      phase: 1, nextAtk: 4, nextTaunt: 14, taunt: 0, tired: 0 };
  },
  updateBoss(dt) {
    const B = this.boss, S = this.S, P = this.P;
    B.flash = Math.max(0, B.flash - dt); if (B.tired > 0) B.tired -= dt;
    // a hit may have pushed the gap to 100 since the last frame: win before this frame's drain pulls it back
    if (!B.won && this.state === 'run' && B.gap >= 100) this.bossWin();
    if (!B.won && this.state === 'run') {
      const drain = B.taunt > 0 ? 0 : B.def.drain * HEATS[RUN.heat].mult * (1 - S.assist * 0.5) * (1 + 0.12 * (B.phase - 1));
      B.gap -= drain * dt;
      B.gap += Math.min(3, (P.speed * (P.cornerM || 1) / (BASE_SPEED * this.reg.speed) - 1) * 4) * dt;
      B.gap = Math.min(100, B.gap);
      const ph = B.gap >= 75 ? 3 : B.gap >= 50 ? 2 : 1;
      if (ph > B.phase) { B.phase = ph; B.gap -= 5; this.showBanner(ph + '. AŞAMA!', B.def.color); Sound.play('roar'); flash(B.def.color, 0.2); shake(3, 0.3); B.nextAtk = Math.min(B.nextAtk, this.lastBeatIdx + 2); }
      if (B.gap >= 100) { this.bossWin(); }
      else if (B.gap <= 0) {
        B.gap = 30; floatText(B.def.name + ' KAÇIYOR!', W / 2, this.pY - 60, C.red, 1, -10, 1.2);
        P.invuln = 0; P.laneInv = 0; P.landInv = 0; this.hurt('boss');
      }
      if (B.taunt > 0) { B.taunt -= dt; if (B.taunt <= 0) { B.gap = Math.max(1, B.gap - 5); floatText('HA HA HA!', B.x, B.screenY - 22, B.def.color, 1, -10, 1); } }
      B.laneTimer -= dt;
      if (B.laneTimer <= 0 && B.taunt <= 0) { B.laneTimer = R.f(1.1, 2.4); const nl = clamp(B.lane + R.pick([-1, 1, -2, 2]), 0, 4); B.fromX = B.x; B.lane = nl; B.laneT = 0; }
      if (B.stun > 0) B.stun -= dt;
    }
    if (B.laneT < 1) { B.laneT = Math.min(1, B.laneT + dt / 0.3); B.x = lerp(B.fromX, this.laneX(B.lane), Ease.outQuad(B.laneT)); }
    let target = B.won ? this.pY + 60 : this.pY - 34 - (100 - B.gap) * 1.45;
    if (B.taunt > 0) target = this.pY - 16;
    B.screenY = B.screenY ? lerp(B.screenY, target, Math.min(1, dt * 4)) : target;
  },
  bossBeat(b) {
    const B = this.boss;
    if (this.state !== 'run' || B.stun > 0 || B.taunt > 0) return;
    if (B.def.sig === 'kibir' && b >= B.nextTaunt) { this.startTaunt(); B.nextTaunt = b + R.i(14, 20); return; }
    if (B.def.sig === 'ayaz' && b >= B.nextTaunt) { this.startFrost(); B.nextTaunt = b + R.i(16, 22); return; }
    if (B.def.sig === 'kum' && b >= B.nextTaunt) {
      B.nextTaunt = b + R.i(18, 24); this.fogT = 3.2; this.burrow(1);
      floatText('KUM FIRTINASI!', W / 2, this.pY - 74, C.tan, 1, -6, 1.4); Sound.play('whoosh'); return;
    }
    if (b >= B.nextAtk) {
      B.nextAtk = b + Math.max(2, [4, 3, 2][B.phase - 1] - (RUN.heat >= 2 ? 1 : 0));
      this.bossAttack();
    }
  },
  startTaunt() {
    const B = this.boss, P = this.P;
    B.taunt = 2.6; const nl = P.lane > 0 ? P.lane - 1 : 1; B.fromX = B.x; B.lane = nl; B.laneT = 0;
    floatText('KİBİR! HAMLE YAP YA DA ALTIN NOTAYI VUR', W / 2, this.pY - 74, C.magenta, 1, -6, 1.8);
    Sound.play('hey');
  },
  // Niva's frost: lane changes slow down until a dash or a golden note breaks the ice
  startFrost() {
    this.frost = 3.6; this.showBanner('AYAZ!', C.cyan);
    floatText('HAMLE YAP YA DA ALTIN NOTAYI VUR', W / 2, this.pY - 74, C.cyan, 1, -6, 1.8);
    Sound.play('zap'); flash(C.cyan, 0.2);
  },
  breakFrost() {
    if (!(this.frost > 0)) return;
    this.frost = 0; if (this.boss) this.boss.gap = Math.min(100, this.boss.gap + 6);
    floatText('BUZU KIRDIN!', W / 2, this.pY - 60, C.white, 1, -10, 1.2); Sound.play('combo'); haptic('success');
    burst(this.P.x, this.pY, 14, [C.white, C.cyan, C.sky], 60, 0.5, 60, 1);
  },
  // Zarg's worm breaks the surface: sand rings mark the lanes first, the horse always keeps a way through
  burrow(n) {
    const P = this.P, y = P.dist + 230;
    const lanes = this.pickSafeLanes(n, y);
    lanes.forEach((lane, i) => { const t0 = 0.95 + i * 0.1; this.meteors.push({ lane, y: y + i * 6, t: t0, t0, kind: 'kum' }); });
    if (lanes.length) Sound.play('warn');
  },
  breakTaunt() {
    const B = this.boss; if (!B || B.taunt <= 0) return;
    B.taunt = 0; B.stun = 1.6; B.gap = Math.min(100, B.gap + 8);
    floatText('KİBRİNİ KIRDIN!', W / 2, this.pY - 60, C.gold, 1, -10, 1.4); Sound.play('combo'); flash(C.gold, 0.2); haptic('success');
  },
  bossHit(dmg, x, special) {
    const B = this.boss;
    const mult = (B.tired > 0 ? 2 : 1) * (special ? 1.5 : 1);
    B.gap = Math.min(100, B.gap + 0.4 * dmg * mult); B.flash = 0.12; Sound.play('ehit');
    burst(x, B.screenY, 4, [C.white, B.def.color], 30, 0.3);
  },
  bossAttack() {
    const B = this.boss, P = this.P;
    let pool = B.def.attacks.slice();
    if (B.phase >= 2) pool = pool.concat(B.def.attacks2 || []);
    if (B.phase >= 3) pool = pool.concat(B.def.attacks3 || [], B.def.attacks3 || []);
    const atk = R.pick(pool);
    const wy = P.dist + (this.pY - B.screenY) - 8;
    const gapLane = () => R.i(0, 4);
    switch (atk) {
      case 'mud': this.addObs('puddle', B.lane, 1, wy, { mud: true }); if (R.chance(0.6)) this.addObs('puddle', clamp(B.lane + R.pick([-1, 1]), 0, 4), 1, wy - 26, { mud: true }); burst(B.x, B.screenY + 10, 8, [C.brown, C.dbrown], 40, 0.5, 60); Sound.play('splash'); break;
      case 'mudrow': { const gl = gapLane(); for (let l = 0; l < 5; l++) if (l !== gl) this.addObs('puddle', l, 1, wy - 10, { mud: true }); Sound.play('splash'); break; }
      case 'bale': this.addObs('bale', B.lane, 1, wy, { vy: -55 }); Sound.play('bump'); break;
      case 'log': { const l0 = clamp(B.lane - 1, 0, 2); this.addObs('log', l0, 3, wy); Sound.play('bump'); break; }
      case 'wolf': {
        const left = R.chance(0.5);
        this.addObs('wolf', 0, 1, P.dist + R.f(140, 200), { x: left ? this.trackL - 12 : this.trackL + this.laneW * 5 + 12, vx: (left ? 1 : -1) * R.f(42, 62) });
        Sound.play('roar'); break;
      }
      case 'howl': {
        this.fogT = 4; floatText('ULUMA!', B.x, B.screenY - 24, C.lgray, 1, -10, 1.1); Sound.play('roar');
        for (let i = 0; i < 2; i++) { const left = i === 0; this.addObs('wolf', 0, 1, P.dist + 150 + i * 60, { x: left ? this.trackL - 12 : this.trackL + this.laneW * 5 + 12, vx: (left ? 1 : -1) * R.f(45, 60) }); }
        break;
      }
      case 'stomp': this.addObs('toz', 0, 5, wy - 20); floatText('ŞOK DALGASI: SIÇRA!', W / 2, this.pY - 70, C.tan, 1, -8, 1.1); Sound.play('boom'); shake(3, 0.25); break;
      case 'bolt': case 'bolt3': {
        const lanes = [P.lane];
        const extra = atk === 'bolt3' ? 2 : (R.chance(0.5) ? 1 : 0);
        const others = R.shuffle([0, 1, 2, 3, 4].filter(l => l !== P.lane));
        for (let i = 0; i < extra; i++) lanes.push(others[i]);
        for (const l of lanes) this.bolts.push({ lane: l, t: 0.95, strike: 0 });
        Sound.play('warn'); break;
      }
      case 'karga': case 'karga3': {
        const n = atk === 'karga3' ? 3 : 2;
        for (let i = 0; i < n; i++) this.foes.push(this.makeFoe('karga', clamp(B.lane + i - Math.floor(n / 2), 0, 4), wy + 10 + i * 20, { seen: true }));
        Sound.play('caw'); break;
      }
      case 'domuz': this.foes.push(this.makeFoe('domuz', B.lane, wy, { seen: true })); Sound.play('grunt'); break;
      case 'eskiya': case 'okcu': {
        if (!this.foes.some(f => f.kind === atk && !f.dead)) { this.foes.push(this.makeFoe(atk, clamp(B.lane + R.pick([-1, 1]), 0, 4), wy, { seen: true })); Sound.play('hey'); }
        else { this.addObs('bale', B.lane, 1, wy, { vy: -55 }); Sound.play('bump'); }
        break;
      }
      case 'icicle': case 'icicle3': {
        const lanes = [P.lane], extra = atk === 'icicle3' ? 2 : (R.chance(0.5) ? 1 : 0);
        const others = R.shuffle([0, 1, 2, 3, 4].filter(l => l !== P.lane));
        for (let i = 0; i < extra; i++) lanes.push(others[i]);
        for (const l of lanes) this.bolts.push({ lane: l, t: 1.0, strike: 0, ice: true });
        Sound.play('warn'); break;
      }
      case 'icerow': {
        if (this.frost > 0) { this.addObs('bale', B.lane, 1, wy, { vy: -55 }); break; }
        const y = Math.max(wy, P.dist + 180);
        const gaps = R.shuffle([0, 1, 2, 3, 4].filter(l => Math.abs(l - P.lane) <= 2));
        for (const gl of gaps) {
          const row = [0, 1, 2, 3, 4].filter(l => l !== gl).map(l => ({ lane: l, y }));
          if (this.passable(row, P.lane, P.dist + 20)) { for (const e of row) this.addObs('rock', e.lane, 1, y, { v: 1, ice: true }); break; }
        }
        floatText('BUZ DUVARI!', B.x, B.screenY - 24, C.cyan, 1, -10, 1); Sound.play('boom'); break;
      }
      case 'burrow': case 'burrow2': this.burrow(atk === 'burrow2' ? 3 : 2); break;
      case 'sandwave': this.addObs('toz', 0, 5, wy - 20); floatText('KUM DALGASI: SIÇRA!', W / 2, this.pY - 70, C.tan, 1, -8, 1.1); Sound.play('boom'); shake(3, 0.25); break;
      case 'civirow': { const gl = gapLane(); for (let l = 0; l < 5; l++) if (l !== gl) this.addObs('civi', l, 1, wy - 12); floatText('HİLE!', B.x, B.screenY - 24, C.red, 1, -10, 1); Sound.play('hey'); break; }
    }
    if (B.phase >= 2 && rnd() < 0.3) { B.tired = 2; floatText('YORULDU! ŞİMDİ VUR!', B.x, B.screenY - 30, C.yellow, 1, -10, 1.2); }
  },
  updateBolts(dt) {
    for (let i = this.bolts.length - 1; i >= 0; i--) {
      const b = this.bolts[i];
      if (b.strike > 0) { b.strike -= dt; if (b.strike <= 0) this.bolts.splice(i, 1); continue; }
      b.t -= dt;
      if (b.t <= 0) {
        b.strike = 0.25; Sound.play('thunder'); flash(C.white, 0.15); shake(3, 0.2);
        if (this.P.lane === b.lane && this.state === 'run') this.hurt(b.ice ? 'ice' : 'bolt');
      }
    }
  },

  // ---------- endings ----------
  bossWin() {
    const B = this.boss; B.won = true; B.taunt = 0; this.endFever();
    this.state = 'finish'; this.stateT = 0; this.result = { boss: true }; this.hold = null;
    Sound.play('win'); haptic('success'); flash(C.white, 0.3);
    this.finishMsg = B.def.name + ' GEÇİLDİ!';
    burst(W / 2, this.pY - 40, 30, [C.yellow, C.red, C.sky, C.green, C.white], 90, 1.2, 90, 2);
    this.giveMedal(this.damaged === 0 ? 'g' : this.damaged <= 2 ? 's' : 'b');
  },
  finishLine() {
    this.state = 'finish'; this.stateT = 0; this.hold = null;
    const rank = this.finished.length + 1;
    this.result = { rank, ok: true };
    this.settleRace(rank);
    const failRank = this.type === 'sprint' && !this.tut && rank > this.passRank();
    const failRaid = this.type === 'baskin' && this.kills < this.goal;
    const failDuel = this.type === 'duello' && rank > 1;
    if (failRank || failRaid || failDuel) {
      this.result.ok = false;
      if (failDuel) { floatText(this.duel.def.name + ' KAZANDI', W / 2, this.pY - 70, C.red, 2, -6, 1.5); floatText('DÜELLOYU KAYBETTİN: -1 CAN', W / 2, this.pY - 48, C.salmon, 1, -6, 1.5); }
      else if (failRank) { floatText(rank + '. OLDUN', W / 2, this.pY - 70, C.red, 2, -6, 1.5); floatText('İLK ' + this.passRank() + '\'E GİREMEDİN: -1 CAN', W / 2, this.pY - 48, C.salmon, 1, -6, 1.5); }
      else { floatText(this.kills + '/' + this.goal + ' DÜŞMAN', W / 2, this.pY - 70, C.red, 2, -6, 1.5); floatText('BASKIN PÜSKÜRTÜLEMEDİ: -1 CAN', W / 2, this.pY - 48, C.salmon, 1, -6, 1.5); }
      this.P.invuln = 0; this.P.laneInv = 0; this.P.landInv = 0; this.P.flyT = 0; this.P.hamleT = 0;
      this.state = 'run'; this.hurt(failRaid ? 'raid' : 'rank');
      if (this.state === 'run') { this.state = 'finish'; this.stateT = 0; }
      return;
    }
    Sound.play('win'); haptic('success');
    const msg = this.tut ? 'ISINMA TAMAM!' : this.type === 'duello' ? 'DÜELLO SENİN!' : this.type === 'sprint' ? (rank === 1 ? 'BİRİNCİ!' : rank + '. OLDUN!') : this.type === 'parkur' ? (this.damaged ? 'PARKUR TAMAM!' : 'KUSURSUZ!') : this.type === 'baskin' ? 'BASKIN PÜSKÜRTÜLDÜ!' : 'KAÇTIN!';
    this.finishMsg = msg; flash(C.white, 0.12);
    burst(W / 2, this.pY - 50, 24, [C.yellow, C.red, C.sky, C.green, C.white], 80, 1.1, 90, 2);
    if (this.type === 'parkur' && !this.damaged) { RUN.coins += 20; RUN.coinsEarned += 20; this.finishBonus = '+20 SİKKE'; }
    if (this.type === 'sprint' && rank === 1 && this.kick > 0.08) missionEvent('kick', 1);
    let m;
    if (this.type === 'sprint') m = rank === 1 ? 'g' : rank === 2 ? 's' : 'b';
    else if (this.type === 'duello') m = this.damaged === 0 ? 'g' : 's';
    else if (this.type === 'baskin') m = (this.damaged === 0 || this.kills >= this.goal + 5) ? 'g' : 's';
    else m = this.damaged === 0 ? 'g' : this.damaged === 1 ? 's' : 'b';
    this.giveMedal(m);
  },
  giveMedal(m) {
    this.medal = m; this.medalT = 0;
    RUN.medals[m]++; META.stats.medals[m]++;
    if (m === 'g') {
      RUN.yonca += 3; missionEvent('yonca', 3); META.stats.golds++; missionEvent('medal', 1);
      if (META.stats.golds % 3 === 0) { RUN.seker++; toast('3 ALTIN MADALYA: +1 ŞEKER', C.white, 'seker'); }
    } else if (m === 's') { RUN.yonca += 1; missionEvent('yonca', 1); }
    setTimeout(() => Sound.play('medal'), 350);
  },
  complete() {
    RUN.cleared++; RUN.etap++; Music.fever = false;
    const ey = this.elite ? 2 : 1; RUN.yonca += ey; missionEvent('yonca', ey);
    if (!this.damaged) { missionEvent('clean', 1); if (this.type === 'kovala') missionEvent('chase', 1); }
    if (this.type === 'sprint' && this.result && this.result.rank === 1) missionEvent('sprint1', 1);
    if (this.tut) { META.tutorialDone = true; RUN.tutorial = false; }
    RUN.score += 100 + ({ g: 60, s: 30, b: 10 }[this.medal] || 0) + this.kills * 5 + (this.elite ? 50 : 0);
    for (const c of RUN.chaos) {
      if (c.left > 0) { c.left--; if (c.left === 0) { const b = CHAOS_BY_ID[c.bless]; toast('KAOS LÜTFU: ' + b.name, C.magenta, 'swirl'); if (b.onActive) b.onActive(RUN); } }
    }
    const S = computeStats(RUN);
    if (S.etapHeal && RUN.hp < S.maxHp) { RUN.hp = Math.min(S.maxHp, RUN.hp + S.etapHeal); toast('KAOS ŞİFASI: +1 CAN', C.red, 'heart'); }
    RUN.hp = Math.min(RUN.hp, S.maxHp);
    if (this.type === 'boss') {
      RUN.bosses++;
      const key = this.reg.boss, first = !META.stats.bossWins[key];
      META.stats.bossWins[key] = (META.stats.bossWins[key] || 0) + 1; missionEvent('boss', 1);
      if (first) { META.rozet++; toast('ŞAMPİYON ROZETİ KAZANDIN!', C.sky, 'rozet'); }
      const yon = Math.round((BOSS_CRYSTALS[RUN.region] || 25) * HEATS[RUN.heat].rew);
      RUN.yonca += yon; missionEvent('yonca', yon); toast('+' + yon + ' KRİSTAL', C.cyan, 'clover');
      RUN.score += 400;
      if (S.bossHeal) RUN.hp = Math.min(S.maxHp, RUN.hp + 1);
      RUN.region++; RUN.etap = 0;
      META.stats.bestRegion = Math.max(META.stats.bestRegion, Math.min(LAST_REGION, RUN.region));
      saveMeta();
      if (RUN.region >= REGIONS.length) { go('results', { won: true }); return; }
      go('boon', { sp: R.pick(SPIRIT_KEYS), afterBoss: true });
      return;
    }
    if (this.type === 'duello' && this.duel && this.result && this.result.ok) {
      const id = this.duel.def.id, first = !META.rivals[id];
      META.rivals[id] = (META.rivals[id] || 0) + 1; META.stats.duels++; missionEvent('duel', 1);
      const bonus = 2 + RUN.region; RUN.yonca += bonus; missionEvent('yonca', bonus); RUN.score += 60;
      if (first) {
        toast('YENİ DOSYA: ' + this.duel.def.name, C.salmon, 'book');
        const lines = ((RIVAL_INFO[id] || {}).lose || []).map(t => [id, t]);
        saveMeta();
        if (lines.length && !window.__auto) { Dialog.start(lines, () => grantReward(this.node.reward, this.elite)); return; }
      }
    }
    saveMeta();
    grantReward(this.node.reward, this.elite);
  },

  // ---------- tutorial ----------
  tutNext(msg) { this.timeScale = 1; this.tut.step++; this.tut.t = 0; if (msg) { this.tut.msg = msg; this.tut.msgT = 1.2; } Sound.play('select'); },
  updateTut(dt) {
    const tu = this.tut, P = this.P;
    tu.t += dt; if (tu.msgT > 0) tu.msgT -= dt;
    if (this.bond >= 100 && !tu.abTold && tu.step >= 3) { tu.abTold = true; tu.msg = 'TEKNİK HAZIR! ' + (META.settings.left ? 'SOL' : 'SAĞ') + ' ALTTAKİ JOKEYE BAS'; tu.msgT = 2.6; }
    if (tu.step === 0) { if (tu.t > 2.4) { tu.step = 1; tu.t = 0; } }
    else if (tu.step === 1) {
      const rock = this.obs.find(o => o.tutRock && !o.dead);
      if (rock) {
        const d = rock.y - P.dist;
        if (d < 95 && d > 0 && P.lane === rock.lane) this.timeScale = 0.06;
        else if (d <= 0 || P.lane !== rock.lane) { this.timeScale = 1; if (d < 0) { tu.step = 2; tu.t = 0; } }
      } else if (P.dist > 420) { tu.step = 2; tu.t = 0; }
    } else if (tu.step === 2) {
      const h = this.obs.find(o => o.tutHurdle && !o.dead);
      if (h) { const d = h.y - P.dist; if (d < 80 && d > 2 && !P.jumping) this.timeScale = 0.06; }
      if (P.dist > 1200) { this.timeScale = 1; tu.step = 3; tu.t = 0; tu.hits = 0; }
    } else if (tu.step === 3) {
      if (tu.hits >= 4 || tu.t > 16) {
        tu.step = 4; tu.t = 0; tu.msg = tu.hits >= 4 ? 'HARİKA! RİTİM = HIZ' : 'RİTMİ ZAMANLA ÖĞRENİRSİN'; tu.msgT = 1.6;
        Sound.play('combo'); this.spawnTutCrows();
      }
    } else if (tu.step === 4) {
      const alive = this.foes.filter(f => f.tut && !f.dead).length;
      if (alive === 0 || tu.t > 20) {
        for (const f of this.foes) if (f.tut) { f.dead = true; burst(f.x, this.sy(f.dist), 6, [C.navy, C.slate], 40, 0.4); }
        tu.step = 5; tu.t = 0; tu.msg = alive === 0 ? 'TAM İSABET!' : 'NİŞAN ALMA, RİTMİ YAKALA'; tu.msgT = 1.4;
        this.nefes = 100; Sound.play('combo');
      }
    } else if (tu.step === 5) {
      // breath burst: the bar is full, the world waits until you swipe down (or tap the button)
      this.timeScale = tu.t > 1.4 && tu.t < 14 ? 0.06 : 1;
      if (tu.t > 14) this.tutRivals();
    } else if (tu.step === 6 && tu.t > 1.8 && !tu.said) { tu.said = true; tu.msg = 'RAKİPLERİ GEÇ, BİTİŞE KOŞ!'; tu.msgT = 2.2; }
  },
  tutRivals() {
    const tu = this.tut, P = this.P;
    tu.step = 6; tu.t = 0; this.timeScale = 1;
    this.rivals.push(this.makeRival(1, P.dist + 150, 0.78, RIVAL_LOOKS[0]));
    this.rivals.push(this.makeRival(3, P.dist + 230, 0.8, RIVAL_LOOKS[2]));
    this.script = this.script.concat(this.tutPhase2(P.dist));
    this.length = Math.max(this.length, P.dist + 1500);
  }
});
