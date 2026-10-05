// ================= AUTOPLAY (testing) =================
// window.__autoSkill (0..1) makes the bot miss some notes; window.__autoNoHamle turns off bursts.
SCENES.run.autoPlay = function () {
  const P = this.P, S = this.S, skill = window.__autoSkill == null ? 1 : window.__autoSkill;
  // ---- rhythm: press near the note centre, keep holds pressed until they end ----
  if (this.clockOn) {
    const bp = Beat.pos(now());
    this.ensureTargets(bp);
    const tg = this.nextTarget(bp);
    if (tg && !tg.done && tg !== this.autoSkip && Math.abs(tg.t - bp) * Beat.iv < S.perfectWin * 0.5) {
      if (Math.random() < skill) { this.down(P.x, this.pY, now()); this.tap(); }
      else this.autoSkip = tg;
    }
    if (this.hold && bp >= this.hold.end - 0.08) this.up(P.x, this.pY, false);
  }
  if (this.bond >= 100 && (this.boss || this.reis || this.foes.length > 1 || this.storm)) this.useAbility();
  // ---- breath bursts ----
  const cost = this.hamleCostNow();
  if (!window.__autoNoHamle && P.hamleT <= 0 && P.hamleCd <= 0 && this.nefes >= cost && !this.tut) {
    const B = this.boss;
    if ((B && B.taunt > 0) || (this.storm && this.storm.gap < 45) || (B && this.nefes >= 75) ||
      (this.type !== 'boss' && this.nefes >= 92 && P.dist < this.length * 0.72)) this.hamle();
  }
  if (P.laneT < 1) return;
  const lx = l => this.laneX(l);
  // how soon (in px) something nasty reaches us in this lane; 999 = clear
  const danger = lane => {
    if (lane < 0 || lane > 4) return -1;
    let d = 999;
    const o = this.obsAhead(lane, P.dist, 90);
    if (o && SOLID[o.kind]) d = o.y - P.dist;
    for (const f of this.foes) {
      if (f.dead || f.tut || f.kind === 'domuz') continue;
      const fd = f.dist - P.dist; if (fd < -2 || fd > 95) continue;
      if (Math.abs(f.x - lx(lane)) < 12) d = Math.min(d, fd);
    }
    for (const f of this.foes) if (!f.dead && f.kind === 'okcu' && f.aim && f.aimLane === lane) d = Math.min(d, 25);
    for (const s of this.eShots) { const sd = s.dist - P.dist; if (sd > -6 && sd < 170 && Math.abs(s.x - lx(lane)) < 9) d = Math.min(d, Math.max(4, sd * 0.4)); }
    const Rz = this.reis;
    if (Rz && !Rz.dead) {
      if (Rz.aimLanes && Rz.aimLanes.indexOf(lane) >= 0) d = Math.min(d, 25);
      const rd = Rz.dist - P.dist;
      if (Math.abs(Rz.x - lx(lane)) < 13 && rd > -8 && rd < (Rz.charge > 0.7 ? 170 : 55)) d = Math.min(d, Math.max(4, rd));
      if (Rz.charge > 0.7 && Rz.lane === lane) d = Math.min(d, 20);
    }
    for (const b of this.bolts) if (b.lane === lane && b.strike <= 0) d = Math.min(d, 15);
    for (const o of this.obs) {
      if (o.dead || o.kind !== 'scan') continue;
      const dd = o.y - P.dist; if (dd < -4 || dd > 120) continue;
      if (o.lane === lane) d = Math.min(d, Math.max(4, dd));
      else if (o.lane + o.dir === lane || (o.lane + o.dir < 0 || o.lane + o.dir > 4) && o.lane - o.dir === lane) d = Math.min(d, Math.max(6, dd + 10));
    }
    return d;
  };
  const d0 = danger(P.lane);
  if (d0 < 80) {
    const opts = [P.lane - 1, P.lane + 1].filter(l => l >= 0 && l <= 4).sort((a, b) => danger(b) - danger(a));
    if (opts.length && danger(opts[0]) > d0) { this.changeLane(opts[0]); return; }
  }
  // ---- jumps, timed for a clean landing over the middle ----
  if (!P.jumping && P.flyT <= 0) {
    const jd = P.speed * S.jumpTime * 0.42 + 6;
    for (const o of this.obs) {
      if (o.dead || !JUMPABLE[o.kind]) continue;
      const dy = o.y - P.dist, rel = o.kind === 'bale' ? jd * 1.35 : jd;
      if (dy > 1 && dy < rel && this.overlapX(o, P.x, 4)) { this.jump(); return; }
    }
    for (const f of this.foes) {
      if (f.dead || f.kind !== 'domuz') continue;
      const dy = f.dist - P.dist, rel = (P.speed + 75) * S.jumpTime * 0.42 + 8;
      if (dy > 1 && dy < rel && Math.abs(f.x - P.x) < 10) { this.jump(); return; }
    }
  }
  if ((this.autoCd || 0) > this.time) return;
  const move = nl => { this.autoCd = this.time + 0.3; this.changeLane(nl); };
  if (P.draftFull) { const opts = [P.lane - 1, P.lane + 1].filter(l => l >= 0 && l <= 4 && danger(l) > 90); if (opts.length) { move(opts[0]); return; } }
  // ---- hunt foes (raids first), otherwise hug the inner rail in bends ----
  const bend = this.bendAt(P.dist + 90);
  let tgt = null;
  if (this.type === 'baskin' || !bend) {
    for (const f of this.foes) {
      if (f.dead || f.tut || (f.kind === 'kalkanli' && f.stun <= 0 && S.weapon === 'yay')) continue;
      const fd = f.dist - P.dist; if (fd < 45 || fd > 230) continue;
      if (!tgt || fd < tgt.dist - P.dist) tgt = f;
    }
    const Rz = this.reis; if (!tgt && Rz && !Rz.dead && Rz.charge <= 0 && Rz.dist - P.dist > 60) tgt = Rz;
  }
  if (tgt) {
    const tl = this.laneOfX(tgt.x);
    if (tl !== P.lane) { const nl = P.lane + Math.sign(tl - P.lane); if (danger(nl) > 90) { move(nl); return; } }
  } else if (bend) {
    const inner = bend < 0 ? 0 : 4;
    if (P.lane !== inner) { const nl = P.lane + Math.sign(inner - P.lane); if (danger(nl) > 100) { move(nl); return; } }
  }
};

// ================= MAIN LOOP =================
function update(dt) {
  updateTrans(dt);
  Dialog.update(dt);
  if (scene && scene.update) scene.update(dt);
  Music.tick();
}
function render(dt) {
  UI.begin();
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
  if (scene && scene.draw) scene.draw();
  Dialog.draw();
  drawToasts(dt);
  drawTrans();
  if (LAST_ERROR) { g.globalAlpha = 1; rect(0, H - 44, W, 44, C.ink); textBlock('HATA: ' + LAST_ERROR.slice(0, 160), 4, H - 42, W - 8, C.red); }
  ctx.drawImage(buf, 0, 0, W * SCALE, H * SCALE);
}
let lastFrame = 0;
function frame(ts) {
  requestAnimationFrame(frame);
  const t = ts / 1000;
  let dt = lastFrame ? t - lastFrame : 1 / 60;
  lastFrame = t;
  if (dt > 0.05) dt = 0.05; if (dt < 0) dt = 0;
  dt *= (window.__speed || 1);
  T += dt;
  try { update(dt); render(dt); } catch (e) { reportError(e); }
}
function onVisibility() {
  if (document.hidden) {
    if (META) saveMeta();
    if (scene === SCENES.run && !SCENES.run.paused && (SCENES.run.state === 'run' || SCENES.run.state === 'intro')) SCENES.run.togglePause();
    else Music.stop();
  } else {
    try { if (Sound.ac && Sound.ac.state !== 'running') Sound.ac.resume(); } catch (e) { }
    if (scene === SCENES.farm) Music.play('farm', now() + 0.2, false);
    else if (scene === SCENES.doors || scene === SCENES.shop || scene === SCENES.boon || scene === SCENES.event || scene === SCENES.cekic) Music.play(REGIONS[RUN.region].song, now() + 0.2, false);
  }
}
function boot() {
  const hot = window.claude && window.claude.hot;
  const start = async data => {
    loadMeta(data || {});
    nativeAudio();
    await loadPixelLabArt();
    buildArt();
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 250));
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', () => { if (META) saveMeta(); });
    if (hot && hot.snapshot) { try { hot.snapshot(() => ({ save: JSON.stringify(META) })); } catch (e) { } }
    goNow('title');
    requestAnimationFrame(frame);
  };
  if (hot && hot.ready) hot.ready(start); else start((hot && hot.data) || {});
}

// debug / test hooks
window.__dortnala = {
  meta: () => META, run: () => RUN, scene: () => scene && scene.name, sceneObj: () => scene,
  go: (n, a) => goNow(n, a),
  start: (node, opts) => { newRun(opts); goNow('run', node || firstNode()); },
  newRun: opts => newRun(opts),
  set: patch => { mergeInto(META, patch); saveMeta(); },
  size: () => ({ W, H, SCALE, SAFE }),
  error: () => LAST_ERROR,
  beat: () => Beat.pos(now()), iv: () => Beat.iv, stats: () => computeStats(RUN),
  art: () => { const RACERS = {}; for (const k in ALIEN_LOOKS) RACERS[k] = getMount(k); RACERS.voltrak = getHorse('robot', 'voltrak'); RACERS.deniz = getHorse('bay', 'deniz'); return { BLD, PEOPLE, PORTRAIT, OB, FOE_SPR, ICONS, PROJ, MEDAL, RACERS }; },
  calib: () => Calib.st,
  rects: () => UI.prev.map(r => ({ id: r.id, x: r.x, y: r.y, w: r.w, h: r.h }))
};
boot();
