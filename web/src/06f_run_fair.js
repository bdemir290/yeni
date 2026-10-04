// ================= RUN SCENE: FAIR TRACK (v5) =================
// Every solid thing (asteroids, crates, meteor and worm landings, ice walls) is placed only if a horse can still
// weave through: rows of solids are walked in order and the set of reachable lanes may spread by one lane per
// `laneStep()` of track. If a new piece would close every lane, the generator picks another lane or drops it.
Object.assign(SCENES.run, {
  // world px the horse needs to shift one lane at top speed, with a little reaction time on top
  laneStep() {
    const S = this.S, top = BASE_SPEED * this.reg.speed * S.speed * (1 + S.comboCap * S.comboPer) * 1.1;
    return Math.max(30, top * (S.laneTime + 0.14));
  },
  solidRows(y0, y1, extra) {
    const rows = [];
    const add = (lane, y, span) => {
      let row = rows.find(r => Math.abs(r.y - y) < 14);
      if (!row) { row = { y, b: new Set() }; rows.push(row); }
      for (let l = lane; l < lane + (span || 1); l++) row.b.add(l);
    };
    for (const o of this.obs) if (!o.dead && SOLID[o.kind] && o.y >= y0 && o.y <= y1) add(o.lane, o.y, o.span);
    for (const m of this.meteors || []) if (m.y >= y0 && m.y <= y1) add(m.lane, m.y, 1);
    for (const e of extra) add(e.lane, e.y, 1);
    rows.sort((a, b) => a.y - b.y);
    return rows;
  },
  // can the horse still get through if `extra` solids are added? fromLane/fromY: start from the horse itself
  passable(extra, fromLane, fromY) {
    if (!extra.length) return true;
    let lo = 1e9, hi = -1e9;
    for (const e of extra) { lo = Math.min(lo, e.y); hi = Math.max(hi, e.y); }
    const start = fromY != null ? fromY : lo - 300;
    const rows = this.solidRows(start, hi + 300, extra), step = this.laneStep();
    let reach = fromLane != null ? [fromLane] : [0, 1, 2, 3, 4], py = fromY != null ? fromY : -1e9;
    for (const row of rows) {
      if (row.y <= start) continue;
      const spread = Math.floor((row.y - py) / step), next = [];
      for (let l = 0; l < 5; l++) if (!row.b.has(l) && reach.some(r => Math.abs(r - l) <= spread)) next.push(l);
      if (!next.length) return false;
      reach = next; py = row.y;
    }
    return true;
  },
  // scanner lasers sweep across lanes, so keep solids out of their way
  nearScan(y, d) { return this.obs.some(o => !o.dead && o.kind === 'scan' && Math.abs(o.y - y) < d); },
  nearSolid(y, d) { return this.obs.some(o => !o.dead && SOLID[o.kind] && Math.abs(o.y - y) < d); },
  // place a group of rocks only if the track stays passable
  tryRocks(list, extra) {
    if (list.some(e => this.nearScan(e.y, 70))) return false;
    if (!this.passable(list)) return false;
    for (const e of list) this.addObs(e.kind || 'rock', e.lane, 1, e.y, Object.assign({ v: e.v || 0 }, extra || {}, e.extra || {}));
    return true;
  },
  // lanes for things that land near the horse (meteors, worm, ice walls): keep a way out from where it is now
  pickSafeLanes(n, y, prefer) {
    const P = this.P, out = [];
    const lanes = R.shuffle([0, 1, 2, 3, 4]);
    if (prefer != null) lanes.sort((a, b) => Math.abs(a - prefer) - Math.abs(b - prefer));
    for (const l of lanes) {
      if (out.length >= n) break;
      const trial = out.concat([{ lane: l, y }]);
      if (this.passable(trial, P.lane, P.dist + 20)) out.push({ lane: l, y });
    }
    return out.map(e => e.lane);
  }
});
