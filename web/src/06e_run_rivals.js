// ================= RUN SCENE: RIVAL TRICKS (v5) =================
// Named rivals in sprints play on the beat like the duel rival: one beat of warning ("!"), then the move.
// onde drops a mine, atici fires a slow plasma down your lane, zikzak cuts in front of you, itici barges (06_run).
// Only one rival may telegraph at a time and tricks are spaced out, so two tricks never stack into an unfair spot.
Object.assign(SCENES.run, {
  rivalBeat(b) {
    if (this.state !== 'run' || this.tut) return;
    const P = this.P;
    for (const r of this.rivals) if (r.tele) { const t = r.tele; r.tele = null; if (!r.done && r.stun <= 0) this.rivalAct(r, t); return; }
    if (b < (this.trickBeat || 0)) return;
    const cands = [];
    for (const r of this.rivals) {
      if (r.done || !r.style || r.duel || r.stun > 0 || r.laneT < 1 || b < (r.nextTrick || 0)) continue;
      const gap = r.dist - P.dist, dl = Math.abs(r.lane - P.lane);
      if (r.style === 'atici' && gap > 50 && gap < 210 && dl <= 2 && P.dist < this.length * 0.92) cands.push([r, { kind: 'shot', lane: P.lane }, 8]);
      else if (r.style === 'onde' && gap > 55 && gap < 220 && dl <= 1 && P.dist < this.length * 0.9) cands.push([r, { kind: 'drop' }, 9]);
      else if (r.style === 'zikzak') {
        if (gap > 10 && gap < 70 && dl === 1 && this.laneFree(P.lane, r.dist, r)) cands.push([r, { kind: 'cut', lane: P.lane }, 6]);
        else if (rnd() < 0.25) { // restless lane hops (harmless, but you can never quite predict them)
          const nl = r.lane + R.pick([-1, 1]);
          if (this.laneFree(nl, r.dist, r)) { r.fromX = r.x; r.lane = nl; r.laneT = 0; r.cool = 0.6; }
        }
      }
    }
    if (!cands.length) return;
    const [r, t, cd] = R.pick(cands);
    r.tele = t; r.nextTrick = b + cd; this.trickBeat = b + 3;
    Sound.play(t.kind === 'shot' ? 'warn' : 'hey');
  },
  rivalAct(r, t) {
    const P = this.P;
    if (t.kind === 'shot') {
      this.eShots.push({ x: this.laneX(t.lane), lane: t.lane, dist: r.dist - 10, v: -170, dead: false, rival: true });
      Sound.play('shoot'); this.say('rivalTrick');
    } else if (t.kind === 'drop') {
      const kind = rnd() < 0.5 ? 'civi' : 'puddle';
      this.addObs(kind, r.lane, 1, r.dist - 22, kind === 'puddle' ? { mud: this.reg.mud } : null);
      floatText(kind === 'civi' ? TX('MAYIN!') : TX('JÖLE!'), r.x, this.sy(r.dist) + 2, C.salmon, 1, -6, 0.8); Sound.play('pebble');
    } else if (t.kind === 'cut') {
      const gap = r.dist - P.dist;
      if (gap > 4 && gap < 90 && this.laneFree(t.lane, r.dist, r)) {
        r.fromX = r.x; r.lane = t.lane; r.laneT = 0; r.cool = 1;
        floatText(TX('ÖNÜNÜ KESTİ!'), r.x, this.sy(r.dist) - 28, C.salmon, 1, -8, 0.8); this.say('rivalTrick');
      }
    }
  },
  // the "!" over a rival and the lane it is about to hit
  drawRivalTele(r, x, y) {
    const t = r.tele; if (!t || Math.floor(T * 10) % 2) return;
    textO('!', x, y - 36, C.red, 'center', 2);
    if (t.kind === 'cut') textO(t.lane < r.lane ? '←' : '→', x + (t.lane < r.lane ? -12 : 12), y - 4, C.red, 'center');
    else if (t.kind === 'drop') textO('↓', x, y + 14, C.red, 'center');
  }
});
