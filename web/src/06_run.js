// ================= RUN STATE =================
let RUN = null;
const BASE_SPEED = 118;
const HAZARD = { rock: 1, hurdle: 1, log: 1, puddle: 1, bale: 1, wolf: 1, fici: 1, civi: 1, toz: 1, scan: 1 };
const JUMPABLE = { hurdle: 1, log: 1, puddle: 1, bale: 1, wolf: 1, civi: 1, toz: 1 };
const SOLID = { rock: 1, fici: 1 };
const PICKUP = { coin: 1, clover: 1, heart: 1, sugar: 1 };
// what hit you, shown next to the horse; jumpable ones remind you to jump
const HURT_LABELS = { rock: 'GÖKTAŞI!', fici: 'VARİL!', scan: 'LAZER: ŞERİDİ DEĞİŞTİR', arrow: 'PLAZMA!', bolt: 'YILDIRIM!', foe: 'DÜŞMAN!', reis: 'KAPTAN!',
  storm: 'KARA DELİK!', boss: 'FARK KAPANDI!', hurdle: 'BARİYER: SIÇRA!', log: 'BORU: SIÇRA!', bale: 'VARİL!', wolf: 'AV KÖPEĞİ!', civi: 'MAYIN: SIÇRA!', toz: 'ŞOK DALGASI: SIÇRA!',
  ice: 'BUZ SARKITI!', kum: 'KUM SOLUCANI!', icerock: 'BUZ DUVARI!' };
const FOE_TIPS = {
  karga: 'GÖZCÜ UÇAR, SIÇRAMAK İŞE YARAMAZ. VUR YA DA KAÇ!',
  domuz: 'TOSBİK ÜSTÜNE KOŞAR. ÜSTÜNDEN SIÇRA YA DA VUR!',
  eskiya: 'KORSAN ÖNÜNE DİKEN MAYIN ATAR. VUR VE KESESİNİ AL!',
  okcu: 'NİŞANCI BİR VURUŞ NİŞAN ALIR, SONRAKİ VURUŞTA ATEŞ EDER. KIRMIZI ÇİZGİDEN ÇIK!',
  kalkanli: 'KALKAN ROBOTU IŞINLARI SEKTİRİR. ALTIN NOTA, PLAZMA YA DA DELİCİ IŞINLA KIR!',
  reis: 'KORSAN KAPTANI GELDİ! YENERSEN 3 DÜŞMAN SAYILIR, KESESİ DOLUDUR.'
};

function newRun(opts) {
  opts = opts || {};
  const daily = !!opts.daily;
  RUN = {
    v: 3, seed: daily ? dailySeed() : (Math.random() * 1e9) | 0, daily, day: daily ? todayStr() : null,
    jockey: META.jockey, nal: META.nal,
    weapon: built('silahhane') && META.weapons[META.weapon] ? META.weapon : 'yay',
    food: built('ambar') ? META.food : null, food2: bl('ambar') >= 2 ? META.food2 : null,
    keepsake: META.keepsake && META.bond[META.keepsake] > 0 ? META.keepsake : null,
    runStyle: RUN_STYLES[META.runStyle] ? META.runStyle : 'dengeli', heat: META.heatUnlocked ? META.heat : 0,
    blanket: bl('ahir') >= 2 ? META.blanket : null, petted: META.petted ? (bl('ahir') >= 3 ? 10 : 5) : 0,
    boons: {}, chaos: [], mods: [], hammers: 0, region: 0, etap: 0, hp: 3, coins: 0, coinsEarned: 0, yonca: 0, seker: 0,
    perfects: 0, maxCombo: 0, kills: 0, medals: { g: 0, s: 0, b: 0 }, score: 0, nearMiss: 0, specials: 0, cleanJumps: 0, hamles: 0, holds: 0,
    bosses: 0, cleared: 0, overtakes: 0, revivesUsed: 0, rerollsUsed: 0, doorRerolls: 0, rareNext: false, bonusMaxHp: 0, shotBonus: 0,
    shopDone: {}, restDone: {}, kaosDone: {}, eventCount: {}, eventsSeen: [], tutorial: !META.tutorialDone, damage: 0, diedIn: null, doors: null,
    pendingBoon: null, pendingNode: null, pendingHammer: false, nextCombo: 0, muskaUsed: false
  };
  if (daily) RUN.tutorial = false;
  META.petted = false;
  rnd = mulberry32(RUN.seed);
  const S = computeStats(RUN);
  RUN.coins += S.startCoins;
  for (const f of [RUN.food, RUN.food2]) if (f && FOODS[f] && FOODS[f].rareFirst) RUN.rareNext = true;
  RUN.hp = S.maxHp;
}
function saveRun() { try { META.runSave = JSON.parse(JSON.stringify(RUN)); } catch (e) { META.runSave = null; } saveMeta(); }
function restoreRun() { RUN = JSON.parse(JSON.stringify(META.runSave)); rnd = mulberry32((Math.random() * 1e9) | 0); }
function firstNode() {
  if (RUN.tutorial) return { type: 'sprint', reward: { kind: 'boon', sp: 'tulpar' }, tutorial: true, weather: 'acik' };
  const sp = META.favSpirit && built('tapinak') && SPIRITS[META.favSpirit] ? META.favSpirit : R.pick(SPIRIT_KEYS);
  return { type: 'sprint', reward: { kind: 'boon', sp }, weather: 'acik' };
}
function pickWeather() {
  const w = REGIONS[RUN.region].weather; let tot = 0;
  for (const k in w) tot += w[k];
  let r = rnd() * tot;
  for (const k in w) { r -= w[k]; if (r <= 0) return k; }
  return 'acik';
}
function genReward(usedSp) {
  const r = rnd(), reg = RUN.region;
  if (r < 0.44) { const pool = SPIRIT_KEYS.filter(s => !usedSp.has(s)); const sp = R.pick(pool.length ? pool : SPIRIT_KEYS); usedSp.add(sp); return { kind: 'boon', sp }; }
  if (r < 0.6) return { kind: 'coins', n: 30 + reg * 12 + R.i(0, 15) };
  if (r < 0.76) return { kind: 'yonca', n: 4 + reg * 2 + R.i(0, 3) };
  if (r < 0.86) return { kind: 'heal', n: 2 };
  if (r < 0.94 && RUN.etap >= 1 && hammerAvailable() && !usedSp.has('cekic')) { usedSp.add('cekic'); return { kind: 'cekic', n: 1 }; }
  return { kind: 'seker', n: 1 };
}
function hammerAvailable() { return (RUN.hammers || 0) < 2 && !RUN.pendingHammer && (WEAPON_MODS[RUN.weapon] || []).some(m => RUN.mods.indexOf(m.id) < 0); }
function genDoors() {
  if (RUN.etap >= 4) return [{ type: 'boss', reward: { kind: 'boss' }, weather: 'acik' }];
  const n = R.chance(0.45) ? 3 : 2;
  const doors = [], used = new Set(), reg = RUN.region, E = RUN.etap;
  const has = t => doors.some(d => d.type === t);
  for (let i = 0; i < n; i++) {
    const roll = rnd();
    if (!RUN.shopDone[reg] && E >= 1 && roll < 0.17 && !has('panayir')) doors.push({ type: 'panayir' });
    else if (!RUN.restDone[reg] && E >= 2 && roll < 0.3 && !has('cesme')) doors.push({ type: 'cesme' });
    else if (!RUN.kaosDone[reg] && E >= 1 && META.stats.runs >= 2 && roll < 0.4 && !has('kaos')) doors.push({ type: 'kaos' });
    else if ((RUN.eventCount[reg] || 0) < 2 && E >= 1 && roll < 0.52 && !has('olay')) doors.push({ type: 'olay' });
    else {
      const pool = ['sprint', 'sprint', 'parkur', 'kovala', 'baskin'];
      if (E >= 1 && META.stats.runs >= 1 && !(RUN.duelDone || {})[reg] && !has('duello') && (NAMED_RIVALS[reg] || []).length) pool.push('duello', 'duello');
      const type = R.pick(pool);
      const door = { type, reward: genReward(used), elite: (reg > 0 || E >= 2) && R.chance(0.2), weather: pickWeather() };
      if (type === 'duello') { door.rival = pickDuelRival(); door.elite = false; }
      doors.push(door);
    }
  }
  if (!doors.some(d => d.reward)) doors[0] = { type: 'sprint', reward: genReward(used), weather: pickWeather() };
  return doors;
}
// the duel opponent: a named rival of this region whose file is still closed, if any
function pickDuelRival() {
  const list = NAMED_RIVALS[RUN.region] || NAMED_RIVALS[0];
  const nem = META.nemesis && list.find(r => r.id === META.nemesis.id);
  if (nem) return nem.id;
  const fresh = list.filter(r => !META.rivals[r.id]);
  return R.pick(fresh.length ? fresh : list).id;
}
function doorRerollCost() { return Math.round(25 * Math.pow(1.6, RUN.doorRerolls)); }
function rewardMult(elite) { return HEATS[RUN.heat].rew * (elite ? 2 : 1); }
function rewardLabel(rew, elite) {
  if (!rew) return '';
  const m = rewardMult(elite);
  if (rew.kind === 'boon') return SPIRITS[rew.sp].name;
  if (rew.kind === 'coins') return Math.round(rew.n * m) + ' SİKKE';
  if (rew.kind === 'yonca') return Math.round(rew.n * m) + ' KRİSTAL';
  if (rew.kind === 'heal') return '+' + rew.n * (elite ? 2 : 1) + ' CAN';
  if (rew.kind === 'seker') return (elite ? 2 : 1) + ' ŞEKER';
  if (rew.kind === 'cekic') return 'ÇEKİÇ';
  if (rew.kind === 'boss') return 'ROZET';
  return '';
}
function rewardIcon(rew) {
  if (!rew) return null;
  if (rew.kind === 'boon') return tinted(SPIRIT_ICON[rew.sp], SPIRITS[rew.sp].color);
  return ICONS[{ coins: 'coin0', yonca: 'clover', heal: 'heart', seker: 'seker', boss: 'crown', cekic: 'hammer' }[rew.kind]] || null;
}
function grantReward(rew, elite) {
  const mult = rewardMult(elite);
  if (!rew) { go('doors'); return; }
  if (rew.kind === 'boon') { if (elite) RUN.rareNext = true; go('boon', { sp: rew.sp }); return; }
  if (rew.kind === 'cekic') { if (elite) RUN.coins += 30; go('cekic'); return; }
  if (rew.kind === 'coins') { const n = Math.round(rew.n * mult); RUN.coins += n; RUN.coinsEarned += n; missionEvent('coins', RUN.coinsEarned); toast('+' + n + ' SİKKE', C.gold, 'coin0'); Sound.play('buy'); }
  else if (rew.kind === 'yonca') { const n = Math.round(rew.n * mult); RUN.yonca += n; missionEvent('yonca', n); toast('+' + n + ' KRİSTAL', C.cyan, 'clover'); Sound.play('clover'); }
  else if (rew.kind === 'heal') { const S = computeStats(RUN), n = rew.n * (elite ? 2 : 1); RUN.hp = Math.min(S.maxHp, RUN.hp + n); toast('+' + n + ' CAN', C.red, 'heart'); Sound.play('heart'); }
  else if (rew.kind === 'seker') { const n = elite ? 2 : 1; RUN.seker += n; toast('+' + n + ' ŞEKER', C.white, 'seker'); Sound.play('gift'); }
  go('doors');
}

// ================= RUN SCENE =================
SCENES.run = {
  enter(node) {
    this.node = node; this.type = node.type; this.elite = !!node.elite;
    this.reg = REGIONS[RUN.region]; this.S = computeStats(RUN);
    const S = this.S;
    this.weather = S.forceFog ? 'sis' : (node.weather || 'acik');
    if (this.weather === 'yagmur') S.laneTime *= 1.35;
    else if (this.weather === 'kar') S.laneTime *= 1.2;
    RUN.hp = Math.min(RUN.hp, S.maxHp);
    this.layout();
    const lenBase = { sprint: 3400, parkur: 3000, kovala: 3600, baskin: 3300, duello: 3200 };
    this.length = this.type === 'boss' ? 1e9 : lenBase[this.type] + Math.round(this.reg.tier * 260);
    this.tut = node.tutorial ? { step: 0, t: 0, hits: 0, msg: null, msgT: 0 } : null;
    if (this.tut) this.length = 4300;
    this.goal = this.type === 'baskin' ? 10 + Math.round(this.reg.tier) + (this.elite ? 3 : 0) : 0;
    this.kills = 0;
    const lx = this.laneX(2);
    this.P = {
      lane: 2, prevLane: 2, laneAt: -9, x: lx, fromX: lx, laneT: 1, dist: 0, jumpT: 0, jumping: false, jumpsLeft: 0, jumpBuf: 0, apexDone: false,
      invuln: 0, slowT: 0, slowAmt: 0, hamleT: 0, hamleCd: 0, shield: S.shield, abilityT: 0, laneInv: 0, floatT: 0, landInv: 0, cleanT: 0,
      landBoostT: 0, laneBoostT: 0, flyT: 0, ghostsT: 0, stormT: 0, slingT: 0, bounce: 0, speed: 0, blocked: 0, draft: 0, draftFull: false
    };
    let sc = S.startCombo + (RUN.nextCombo || 0); RUN.nextCombo = 0;
    if (RUN.nextShield && !node.tutorial) { this.P.shield += RUN.nextShield; RUN.nextShield = 0; }
    this.happy = 0;
    if (RUN.petted && !this.tut) { sc += RUN.petted; this.happy = RUN.petted; RUN.petted = 0; }
    this.combo = sc; this.bond = 0; this.pending = null; this.topCharge = 0;
    this.nefes = clamp(S.nefesStart, 0, 100); this.kick = 0; this.hamleShieldUsed = false;
    this.obs = []; this.foes = []; this.shots = []; this.eShots = []; this.trails = []; this.rivals = []; this.finished = []; this.bolts = []; this.lines = [];
    this.genY = 300; this.time = 0; this.state = 'intro'; this.stateT = 0; this.timeScale = 1;
    this.damaged = 0; this.coinFrac = 0; this.etapMax = 0; this.etapPerfects = 0; this.finishMsg = null; this.finishBonus = null; this.heartLost = null; this.comboBreak = 0; this.prevCombo = 0; this.paused = false; this.confirmQuit = false; this.showBoons = false;
    this.shoeFlash = 0; this.ringFlash = 0; this.judgeT = 0; this.judgeStr = ''; this.judgeCol = C.white; this.result = null; this.ghostLane = 3;
    this.storm = this.type === 'kovala' ? { gap: 115 } : null;
    this.heartPlaced = false; this.resumeT = 0; this.finalStretch = false; this.medal = null; this.medalT = 0; this.shock = null;
    this.foeTimer = 1.5; this.tutCoinY = 0; this.reis = null; this.reisDone = false; this.fogT = 0; this.bannerT = 0; this.banner = null;
    this.wind = { t: R.f(2.5, 4.5), dir: 0, left: 0 };
    this.boss = this.type === 'boss' ? this.makeBoss() : null;
    this.set = heroHorse(RUN.blanket);
    // onboarding tips decide which note types / bends this etap may use
    this.tips = this.pickTips(); this.tipKey = this.tips.length ? this.tips[0] : null;
    const seen = k => !!META.tipsSeen[k] || this.tips.indexOf(k) >= 0;
    const simple = META.settings.simpleNotes;
    this.allowA = !this.tut && seen('nota_a');
    this.allowD = !this.tut && !simple && (RUN.cleared >= 2 || RUN.region > 0) && seen('nota_d');
    this.allowH = !this.tut && !simple && (RUN.cleared >= 3 || RUN.region > 0) && seen('nota_h');
    this.allowViraj = !this.tut && (RUN.cleared >= 1 || RUN.region > 0) && seen('viraj');
    this.allowGate = !this.tut && this.type !== 'boss' && (RUN.cleared >= 2 || RUN.region > 0) && seen('rgate');
    this.allowScan = !this.tut && this.type !== 'boss' && (RUN.cleared >= 3 || RUN.region > 0) && seen('scan');
    this.genBends();
    this.resetChart();
    this.duel = null;
    if (this.type === 'sprint' && !this.tut) this.spawnRivals();
    if (this.type === 'duello') this.spawnDuel(node.rival);
    if (this.tut) this.script = this.tutScript();
    this.showInit();
    Music.layer = this.boss ? 1 : 0;
    this.clockOn = false;
    if (!this.tipKey && !this.betOffer) this.startClock(); else Music.stop();
    if (this.boss) Sound.play('roar');
  },
  resetChart() { this.chart = {}; this.chartBars = 0; this.nextTgtBeat = 0; this.targets = []; this.hold = null; },
  startClock() {
    const t0 = now() + 1.1;
    Beat.set(this.reg.bpm, t0);
    Music.play(this.reg.song, t0, this.type === 'boss');
    this.lastBeatIdx = Math.floor(Beat.pos(now()));
    this.resetChart();
    this.clockOn = true; this.stateT = 0;
  },
  pickTips() {
    if (this.tut) return [];
    const simple = META.settings.simpleNotes;
    const cand = [this.type, 'hamle', 'nota_a',
      (RUN.cleared >= 1 || RUN.region > 0) && this.type !== 'boss' ? 'reyting' : null,
      (!simple && (RUN.cleared >= 2 || RUN.region > 0)) ? 'nota_d' : null,
      (!simple && (RUN.cleared >= 3 || RUN.region > 0)) ? 'nota_h' : null,
      (RUN.cleared >= 1 || RUN.region > 0) ? 'viraj' : null,
      (RUN.cleared >= 2 || RUN.region > 0) && this.type !== 'boss' ? 'rgate' : null,
      (RUN.cleared >= 3 || RUN.region > 0) && this.type !== 'boss' ? 'scan' : null,
      this.elite ? 'zorlu' : null, this.weather !== 'acik' ? this.weather : null];
    const out = [];
    for (const k of cand) if (k && ETAP_TIPS[k] && !META.tipsSeen[k] && out.length < 2) out.push(k);
    return out;
  },
  dismissTip() {
    for (const k of this.tips) META.tipsSeen[k] = true;
    saveMeta();
    this.tipKey = null; this.tips = []; Sound.play('select');
    if (!this.betOffer) this.startClock();
  },
  resize() { this.layout(); if (this.P) { this.P.x = this.laneX(this.P.lane); this.P.fromX = this.P.x; } },
  layout() {
    this.laneW = Math.min(32, Math.floor((W - 28) / 5));
    this.trackL = Math.floor((W - this.laneW * 5) / 2);
    this.pY = Math.round(H * 0.66);
  },
  laneX(i) { return this.trackL + this.laneW * i + this.laneW / 2; },
  laneL(i) { return this.trackL + this.laneW * i; },
  sy(worldY) { return this.pY - (worldY - this.P.dist); },
  laneOfX(x) { return clamp(Math.round((x - this.trackL - this.laneW / 2) / this.laneW), 0, 4); },
  addBond(n) { this.bond = Math.min(100, this.bond + n * this.S.bondMult); },
  gainNefes(n) { this.nefes = Math.min(100, this.nefes + n * this.S.nefesGain * (RUN.runStyle === 'dengeli' ? 1.2 : 1)); },

  // ---------- setup helpers ----------
  // how many places count as a pass: crowded fields (8 racers) let the top 4 through
  passRank() { return (this.rivals.length >= 7 ? 4 : 3) + (this.S.assist > 0 ? 1 : 0); },
  spawnRivals() {
    const field = clamp(this.reg.field || 5, 5, 7);
    const speeds = this.reg.rivals.slice(0, field).sort((a, b) => b - a);
    while (speeds.length < field) speeds.push(1);
    const looks = R.shuffle(RIVAL_LOOKS.slice());
    const starts = [[0, 36], [1, 64], [3, 50], [4, 20], [2, -46], [1, -22], [3, -64]].slice(0, field);
    const pool = (NAMED_RIVALS[RUN.region] || []).slice(), nemId = META.nemesis && META.nemesis.id;
    const named = R.shuffle(pool.slice()).slice(0, RUN.etap >= 3 ? 3 : RUN.etap >= 1 ? 2 : 1);
    if (nemId && pool.some(p => p.id === nemId) && !named.some(p => p.id === nemId)) named[0] = pool.find(p => p.id === nemId);
    const rest = R.shuffle(speeds.slice(named.length));
    const hc = this.S.rivalHandicap || 0;
    const order = R.shuffle(starts.map((_, i) => i));
    for (let i = 0; i < field; i++) {
      const [lane, d] = starts[order[i]];
      const def = named[i] || null;
      const spd = (def ? speeds[i] : rest[i - named.length]) * HEATS[RUN.heat].mult * (this.elite ? 1.04 : 1);
      const r = this.makeRival(lane, d - hc, spd, def ? def.look : looks[i]);
      if (def) {
        r.name = def.name; r.style = def.style; r.id = def.id;
        const nl = this.nemesisLv(def.id); if (nl) { r.nem = nl; r.spd *= 1 + 0.03 * nl; }
        if (leagueLeader() === def.id) r.leader = true;
      }
      this.rivals.push(r);
    }
  },
  // 1v1: one named rival, a touch faster than the region's best, who plays dirty on the beat
  spawnDuel(id) {
    const def = RIVAL_BY_ID[id] || (NAMED_RIVALS[RUN.region] || NAMED_RIVALS[0])[0];
    RUN.duelDone = RUN.duelDone || {}; RUN.duelDone[RUN.region] = true;
    const spd = Math.max(...this.reg.rivals) * 1.06 * HEATS[RUN.heat].mult;
    const r = this.makeRival(3, 26 - (this.S.rivalHandicap || 0), spd, def.look);
    r.name = def.name; r.style = def.style; r.duel = true; r.id = def.id;
    const nl = this.nemesisLv(def.id); if (nl) { r.nem = nl; r.spd *= 1 + 0.03 * nl; }
    this.rivals.push(r);
    this.duel = { r, def, info: RIVAL_INFO[def.id] || {}, tauntT: 3, tele: null, nextTrick: 8, surgeT: 0, surged: 0, stunImm: 0, blockCd: 2, doneTold: false, tauntTxt: nl ? pickAny(NEMESIS_TAUNTS) : null };
  },
  makeRival(lane, dist, spd, look) {
    const x = this.laneX(lane);
    return { lane, x, fromX: x, laneT: 1, dist, spd, look, set: getMount(look), jumpT: 0, jumping: false, stun: 0, phase: rnd() * 6, ahead: dist > 0, done: false, cur: 0, cool: 0, pushCd: R.f(1, 3), name: null, style: null };
  },
  addObs(kind, lane, span, y, extra) {
    const o = Object.assign({ kind, lane, span: span || 1, y, dead: false, hit: false, jumped: false, passed: false, t: rnd() * 10, flash: 0 }, extra || {});
    this.obs.push(o); return o;
  },

  // ---------- bends (virajlar) ----------
  genBends() {
    this.bends = []; this.nextBendY = 0;
    if (!this.allowViraj) return;
    if (this.type === 'boss') { this.nextBendY = 700; return; }
    const n = R.i(1, 2) + (RUN.region >= 1 ? 1 : 0);
    let y = this.length * 0.16;
    for (let i = 0; i < n; i++) {
      y += R.f(220, 520);
      const len = R.f(480, 720);
      if (y + len > this.length * 0.9) break;
      this.bends.push({ y0: y, y1: y + len, dir: R.pick([-1, 1]), told: false });
      y += len;
    }
  },
  bendAt(wy) {
    for (const b of this.bends) if (wy >= b.y0 && wy <= b.y1) return b.dir * Math.min(1, (wy - b.y0) / 140, (b.y1 - wy) / 140);
    return 0;
  },
  bendObj(wy) { for (const b of this.bends) if (wy >= b.y0 - 260 && wy <= b.y1) return b; return null; },
  cornerMult(lane, wy) {
    const bd = this.bendAt(wy); if (!bd) return 1;
    const inner = bd < 0 ? 0 : 4, dl = Math.abs(lane - inner);
    let m = 1 + 0.06 * Math.abs(bd) * (2 - dl) / 2 * this.S.cornerMult;
    if (this.S.outerSafe && m < 1) m = 1;
    return m;
  },
  updateBends() {
    if (!this.allowViraj) return;
    const P = this.P;
    if (this.type === 'boss' && this.nextBendY && P.dist + H > this.nextBendY) {
      const len = R.f(500, 700); this.bends.push({ y0: this.nextBendY, y1: this.nextBendY + len, dir: R.pick([-1, 1]), told: false });
      this.nextBendY += len + R.f(900, 1500);
      if (this.bends.length > 4) this.bends.shift();
    }
    for (const b of this.bends) if (!b.told && P.dist > b.y0 - 240 && P.dist < b.y1) {
      b.told = true;
      this.showBanner(b.dir < 0 ? '← SOLA VİRAJ' : 'SAĞA VİRAJ →', C.yellow);
      Sound.play('warn');
    }
  },
  showBanner(txt, col) { this.banner = { txt, col }; this.bannerT = 1.6; },

  // ---------- tutorial scripts ----------
  tutScript() {
    const L = [];
    const a = (y, kind, lane, span, extra) => L.push(Object.assign({ y, kind, lane, span: span || 1 }, extra || {}));
    a(400, 'rock', 2, 1, { tutRock: true });
    for (let i = 0; i < 5; i++) a(520 + i * 14, 'coin', 1);
    a(720, 'rock', 0); a(720, 'rock', 2); a(720, 'rock', 4);
    for (let i = 0; i < 6; i++) a(860 + i * 14, 'coin', 2);
    a(1130, 'hurdle', 0, 5, { tutHurdle: true });
    for (let i = 0; i < 6; i++) a(1300 + i * 14, 'coin', 2);
    L.sort((p, q) => p.y - q.y);
    return L;
  },
  tutPhase2(d0) {
    const L = [];
    const a = (y, kind, lane, span, extra) => L.push(Object.assign({ y: d0 + y, kind, lane, span: span || 1 }, extra || {}));
    a(260, 'hurdle', 1, 2); a(420, 'rock', 0); a(420, 'rock', 4); a(560, 'puddle', 2);
    for (let i = 0; i < 5; i++) a(640 + i * 14, 'coin', 2);
    a(800, 'fici', 2, 1, { hp: 2 }); a(950, 'hurdle', 0, 5);
    for (let i = 0; i < 8; i++) a(1040 + i * 14, 'coin', [1, 3][i % 2]);
    a(1220, 'rock', 1); a(1220, 'rock', 3);
    L.sort((p, q) => p.y - q.y);
    return L;
  },

  // ---------- generation ----------
  phaseAt(y) {
    const k = y / this.length;
    return k < 0.14 ? 'warm' : k < 0.45 ? 'chal' : k < 0.55 ? 'rew' : k < 0.8 ? 'chal2' : 'final';
  },
  generate() {
    const ahead = this.P.dist + H + 40, end = this.length - 170;
    if (this.tut) {
      while (this.script.length && this.script[0].y < ahead) {
        const s = this.script.shift();
        if (s.kind === 'coin') this.addObs('coin', s.lane, 1, s.y); else this.addObs(s.kind, s.lane, s.span, s.y, s);
      }
      const st = this.tut.step;
      if (st >= 3 && st <= 4) { if (this.tutCoinY < this.P.dist + 200) this.tutCoinY = this.P.dist + 200; while (this.tutCoinY < ahead) { const l = R.i(0, 4); for (let i = 0; i < 4; i++) this.addObs('coin', l, 1, this.tutCoinY + i * 14); this.tutCoinY += 170; } }
      return;
    }
    let guard = 0;
    while (this.genY < ahead && this.genY < end && guard++ < 20) {
      const ph = this.type === 'boss' ? 'chal' : this.phaseAt(this.genY);
      const extra = this.placePattern(this.genY, ph) || 0;
      let dens = this.reg.dens * HEATS[RUN.heat].mult * ({ parkur: 1.4, boss: 0.55, baskin: 0.6, duello: 0.85 }[this.type] || 1) * (this.elite ? 1.3 : 1);
      dens *= { warm: 0.6, chal: 1, rew: 0.75, chal2: 1.15, final: 0.9 }[ph];
      if (this.bendAt(this.genY)) dens *= 0.8;
      this.genY += R.f(150, 205) / dens + extra;
    }
  },
  placePattern(y, ph) {
    const d = this.reg.tier + RUN.etap * 0.3, S = this.S;
    const wet = this.weather === 'yagmur';
    const foeW = (this.type === 'sprint' ? 0.5 : this.type === 'baskin' ? 0.6 : this.type === 'duello' ? 0.35 : 1.0) * S.moreFoes * (this.elite ? 1.5 : 1);
    let pats;
    if (ph === 'rew') pats = [['coins', 3], ['coinArc', 2], ['coinRain', 2.5], ['fici', 1], ['foe', foeW * 0.5]];
    else if (ph === 'warm') pats = [['rock1', 2], ['hurdle1', 2], ['coins', 2.5], ['puddle', wet ? 2.5 : 1], ['foe', foeW * 0.4]];
    else pats = [['rock1', 3], ['rock2', 1.4 + d], ['hurdle1', 3], ['hurdleLine', y > 700 ? 0.7 + d * 0.35 : 0], ['log', 2], ['puddle', wet ? 3 : 1.5],
      ['wall', d >= 1 ? 0.5 + d * 0.4 : 0], ['coins', ph === 'final' ? 3.2 : 2.2], ['coinArc', 1.5], ['fici', 0.8 + d * 0.2], ['foe', foeW * 1.4], ['foe2', ph === 'chal2' ? foeW * 0.6 : 0],
      ['rgate', this.allowGate && ph !== 'final' && y - this.lastGateY > 800 ? 1.1 : 0], ['scan', this.allowScan && y - this.lastScanY > 520 && !this.nearSolid(y, 80) ? 1.2 + d * 0.3 : 0]];
    let tot = 0; for (const p of pats) tot += p[1];
    let r = rnd() * tot, pick = pats[0][0];
    for (const p of pats) { r -= p[1]; if (r <= 0) { pick = p[0]; break; } }
    const L = R.i(0, 4);
    const coinLine = (lane, y0, n) => { for (let i = 0; i < n; i++) this.addObs('coin', lane, 1, y0 + i * 14); };
    let extra = 0;
    switch (pick) {
      case 'rock1': {
        const lanes = [L].concat(R.shuffle([0, 1, 2, 3, 4].filter(l => l !== L)));
        const ok = lanes.find(l => this.tryRocks([{ lane: l, y, v: R.i(0, 1) }]));
        if (ok != null && R.chance(0.45)) coinLine((ok + R.i(1, 4)) % 5, y - 20, 5); else if (ok == null) coinLine(L, y - 30, 5);
        break;
      }
      case 'rock2': { const L2 = (L + R.i(1, 4)) % 5; if (!this.tryRocks([{ lane: L, y, v: 1 }, { lane: L2, y: y + R.i(0, 1) * 30 }])) this.tryRocks([{ lane: L, y, v: 1 }]); break; }
      case 'hurdle1': { const sp = (L < 4 && R.chance(0.45)) ? 2 : 1; this.addObs('hurdle', L, sp, y); break; }
      case 'hurdleLine': this.addObs('hurdle', 0, 5, y); for (let i = 0; i < 3; i++) this.addObs('coin', R.i(0, 4), 1, y - 4 + i * 2); break;
      case 'log': { const sp = R.i(2, 3); const l0 = R.i(0, 5 - sp); this.addObs('log', l0, sp, y); break; }
      case 'puddle': this.addObs('puddle', L, 1, y, { mud: this.reg.mud }); if (R.chance(wet ? 0.7 : 0.4)) this.addObs('puddle', (L + 2) % 5, 1, y + 30, { mud: this.reg.mud }); break;
      case 'wall': {
        // one gap; the generator only keeps a gap the horse can actually reach from the rows before it
        const gapL = [L].concat(R.shuffle([0, 1, 2, 3, 4].filter(l => l !== L))).find(gl => this.tryRocks([0, 1, 2, 3, 4].filter(i => i !== gl).map(i => ({ lane: i, y, v: i % 2 }))));
        if (gapL != null) { coinLine(gapL, y - 28, 4); extra = 50; } else coinLine(L, y - 30, 7);
        break;
      }
      case 'coins': coinLine(L, y - 30, 7); break;
      case 'coinArc': this.addObs('hurdle', L, 1, y); this.addObs('coin', L, 1, y - 14); this.addObs('coin', L, 1, y); this.addObs('coin', L, 1, y + 14); break;
      case 'coinRain': for (let i = 0; i < 10; i++) this.addObs('coin', R.i(0, 4), 1, y + i * 12); break;
      case 'fici': if (this.tryRocks([{ kind: 'fici', lane: L, y, extra: { hp: 2 } }])) coinLine(L, y + 18, 3); else coinLine(L, y - 30, 5); break;
      case 'foe': this.spawnFoeAt(y); break;
      case 'foe2': this.spawnFoeAt(y); this.spawnFoeAt(y + 46); break;
      case 'rgate': this.addObs('rgate', 0, 5, y, { need: 2, charge: 0, open: false, armed: false, openT: 0 }); this.lastGateY = y; coinLine(L, y + 26, 4); extra = 60; break;
      case 'scan': this.addObs('scan', L, 1, y, { dir: R.chance(0.5) ? 1 : -1, vis: L, fromVis: L, mt: 1 }); this.lastScanY = y; extra = 50; break;
    }
    if (R.chance(ph === 'rew' ? 0.22 : 0.07)) this.addObs('clover', R.i(0, 4), 1, y + 70);
    if (ph === 'rew' && R.chance(0.05 * (this.elite ? 2 : 1))) this.addObs('sugar', R.i(0, 4), 1, y + 96);
    if (this.type === 'parkur' && !this.heartPlaced && y > this.length * 0.45) { this.heartPlaced = true; this.addObs('heart', R.i(0, 4), 1, y + 80); }
    return extra;
  },

  // ---------- rhythm chart: notes per beat ----------
  barPattern(bar) {
    if (this.tut) return 'nnnn';
    const ph = this.type === 'boss' ? 'chal' : this.phaseAt(this.P.dist + 220);
    const lvl = this.reg.tier + (RUN.heat || 0) * 0.5 + (this.elite ? 0.5 : 0);
    let pool;
    if (bar === 0) pool = NOTE_POOLS.basic;
    else if (this.allowH && this.nefes < 35 && rnd() < 0.35) pool = NOTE_POOLS.breath;
    else if (this.type === 'baskin' || ph === 'rew') pool = rnd() < 0.6 ? NOTE_POOLS.rew : NOTE_POOLS.t1;
    else if (ph === 'warm') pool = NOTE_POOLS.basic;
    else if (this.type === 'boss') pool = lvl >= 2 ? NOTE_POOLS.t3 : lvl >= 1 ? NOTE_POOLS.t2 : NOTE_POOLS.t1;
    else if (ph === 'chal') pool = lvl >= 1 ? NOTE_POOLS.t2 : NOTE_POOLS.t1;
    else if (ph === 'chal2') pool = lvl >= 1.5 ? NOTE_POOLS.t3 : NOTE_POOLS.t2;
    else pool = (lvl >= 1 && rnd() < 0.5) ? NOTE_POOLS.t3 : NOTE_POOLS.t2;
    let p = R.pick(pool);
    if (!this.allowD) p = p.replace(/d/g, 'n');
    if (!this.allowH) p = p.replace(/h_/g, 'nn').replace(/h/g, 'n').replace(/_/g, 'n');
    if (!this.allowA) p = p.replace(/a/g, 'n');
    return p;
  },
  ensureChart(upto) {
    while (this.chartBars * 4 <= upto) {
      const p = this.barPattern(this.chartBars);
      for (let i = 0; i < 4; i++) this.chart[this.chartBars * 4 + i] = p[i];
      this.chartBars++;
    }
  },
  ensureTargets(bp) {
    const upto = Math.floor(bp + 3);
    this.ensureChart(upto + 4);
    while (this.nextTgtBeat <= upto) {
      const b = this.nextTgtBeat++, ch = this.chart[b] || 'n';
      if (ch === 'n' || ch === 'a') this.targets.push({ t: b, kind: ch, done: false });
      else if (ch === 'd') { this.targets.push({ t: b, kind: 'd', done: false, pair: b }); this.targets.push({ t: b + 0.5, kind: 'd2', done: false, pair: b }); }
      else if (ch === 'h') { let len = 1; while (this.chart[b + len] === '_') len++; this.targets.push({ t: b, kind: 'h', len: Math.max(1, len), done: false }); }
    }
  },
  nextTarget(bp) {
    let best = null;
    for (const tg of this.targets) if (!tg.done && tg.t > bp - 0.3 && (!best || tg.t < best.t)) best = tg;
    return best;
  },
  updateTargets() {
    if (!this.clockOn || this.state !== 'run') return;
    const bp = Beat.pos(now());
    this.ensureTargets(bp);
    const gw = this.S.goodWin / Beat.iv;
    for (const tg of this.targets) {
      if (tg.done || bp - tg.t <= gw) continue;
      tg.done = true; tg.missed = true; this.gateMiss();
      if (this.combo > 0 && this.P.stormT <= 0) this.combo = Math.max(0, this.combo - this.S.comboDecay);
    }
    if (this.hold && bp >= this.hold.end) this.finishHold(true);
    if (this.targets.length > 40) this.targets = this.targets.filter(t => !t.done || bp - t.t < 2);
  },

  // ---------- input ----------
  down(x, y, t) {
    if (this.paused || this.state !== 'run' || !this.clockOn) return;
    const S = this.S, bp = Beat.pos(t);
    this.ensureTargets(bp);
    let best = null, bd = 1e9;
    for (const tg of this.targets) { if (tg.done) continue; const dd = Math.abs(tg.t - bp) * Beat.iv; if (dd < bd) { bd = dd; best = tg; } }
    this.missHint = null;
    if (!best) { this.pending = 'miss'; return; }
    this.lastDelta = (best.t - bp) * Beat.iv; // > 0: pressed before the note
    let pw = S.perfectWin * (S.dawnWindow && this.combo >= 20 ? 1.5 : 1);
    if (best.kind === 'a') pw *= S.accentWin;
    const gwin = Math.max(S.goodWin, pw + 0.03);
    if (bd <= pw) this.hitTarget(best, 'perfect');
    else if (bd <= gwin) this.hitTarget(best, 'good');
    else { this.pending = 'miss'; if (bd < 0.4) this.missHint = this.lastDelta > 0 ? 'ERKEN' : 'GEÇ'; }
  },
  tap() {
    if (this.paused) return;
    if (this.state === 'intro' && this.tipKey) { this.dismissTip(); return; }
    if (this.state === 'finish' && this.medal && this.stateT > 0.9) { this.stateT = 99; return; }
    if (this.pending === 'miss') this.judgeMiss();
    this.pending = null;
  },
  up(x, y, swiped) { if (swiped) this.pending = null; if (this.hold) this.finishHold(false); },
  swipe(dir) {
    if (this.paused || this.state !== 'run') return;
    const P = this.P;
    if (dir === 'left' || dir === 'right') {
      const nl = clamp(P.lane + (dir === 'left' ? -1 : 1), 0, 4);
      if (nl !== P.lane) this.changeLane(nl); else P.bounce = dir === 'left' ? -1 : 1;
    } else if (dir === 'up') this.jump();
    else if (dir === 'down') this.hamle();
  },
  key(k) {
    if (k === 'Escape' || k === 'p' || k === 'P') { this.togglePause(); return true; }
    if (k === 'e' || k === 'E' || k === 'q' || k === 'Q') { this.useAbility(); return true; }
    if ((k === 'Enter' || k === ' ') && this.state === 'intro' && this.tipKey && !this.paused) { this.dismissTip(); return true; }
    if (this.state === 'intro' && this.betOffer && !this.tipKey && !this.paused) {
      const st = this.betOffer.stakes;
      if (k === 'Enter' || k === ' ' || k === '1') { this.placeBet(0); return true; }
      if (k === '2' && st[0]) { this.placeBet(st[0]); return true; }
      if (k === '3' && st[1]) { this.placeBet(st[1]); return true; }
    }
    return false;
  },
  changeLane(nl) {
    const P = this.P, S = this.S;
    const blocker = P.flyT > 0 ? null : this.rivals.find(r => !r.done && r.lane === nl && Math.abs(r.dist - P.dist) < 15);
    if (blocker) {
      if (S.shoulder) this.pushRival(blocker, nl - P.lane);
      else { Sound.play('bump'); shake(2, 0.12); haptic('light'); P.bounce = nl > P.lane ? 1 : -1; floatText('!', P.x, this.pY - 16, C.red); return; }
    }
    if (S.shoulder && S.shoulderDmg) for (const f of this.foes) if (!f.dead && Math.abs(f.dist - P.dist) < 14 && Math.abs(f.x - this.laneX(nl)) < 11) { this.damageFoe(f, S.shoulderDmg, { breakShield: true }); f.stun = Math.max(f.stun, 0.5); }
    const old = P.lane;
    P.prevLane = old; P.laneAt = this.time;
    P.fromX = P.x; P.lane = nl; P.laneT = 0; Sound.play('lane');
    if (S.laneInvuln) P.laneInv = S.laneInvuln;
    if (S.laneFloat) P.floatT = S.laneFloat;
    if (S.laneSpeed) P.laneBoostT = 1;
    if (S.laneTrail) this.trails.push({ x: this.laneX(old), dist: P.dist, t: 1.2, dmg: S.laneTrail, hit: [] });
    if (P.draftFull && this.state === 'run') {
      P.draft = 0; P.draftFull = false; P.slingT = 1.3;
      META.stats.drafts++; missionEvent('draft', 1); this.addBond(4);
      floatText('SİPER ÇIKIŞI!', P.x, this.pY - 28, C.cyan, 1, -16, 1); this.rate(6);
      Sound.play('sling'); haptic('medium');
      for (let i = 0; i < 10; i++) this.lines.push({ x: this.trackL + rnd() * this.laneW * 5, y: rnd() * H, l: 10 + rnd() * 12, t: 0.5 });
    }
    if (this.tut && this.tut.step === 1 && this.timeScale < 1) this.tutNext('SÜPER!');
  },
  pushRival(r, dir) {
    const nl = r.lane + dir;
    if (nl >= 0 && nl <= 4) { r.fromX = r.x; r.lane = nl; r.laneT = 0; } else { r.dist -= 20; }
    r.stun = 1.2; Sound.play('bump'); shake(2, 0.15); haptic('medium');
    burst(r.x, this.sy(r.dist), 6, C.sand, 40, 0.4);
  },
  jump() {
    const P = this.P;
    if (P.flyT > 0) return;
    if (P.jumping) {
      if (P.jumpsLeft > 0) { P.jumpsLeft--; P.jumpT = 0; P.apexDone = false; Sound.play('jump'); burst(P.x, this.pY + 6, 6, C.cyan, 30, 0.35); }
      else P.jumpBuf = 0.12;
      return;
    }
    P.jumping = true; P.jumpT = 0; P.apexDone = false; P.jumpsLeft = this.S.extraJumps; Sound.play('jump');
    burst(P.x, this.pY + 10, 5, this.reg.dirtL, 25, 0.3);
    if (this.tut && this.tut.step === 2 && this.timeScale < 1) this.tutNext('UÇUYORSUN!');
  },
  land() {
    const P = this.P, S = this.S; Sound.play('land');
    burst(P.x, this.pY + 10, 6, this.reg.dirtL, 30, 0.35, 0, 1);
    if (S.landShock) {
      const rad = S.landShock * (S.landShockWide ? 2 : 1);
      for (const o of this.obs) if (!o.dead && HAZARD[o.kind] && o.kind !== 'puddle' && Math.abs(o.y - P.dist) < rad && this.overlapX(o, P.x, rad * 0.6)) { if (o.kind === 'fici') this.hitFici(o, 99); else this.breakObs(o); }
      for (const f of this.foes) if (!f.dead && Math.hypot(f.x - P.x, f.dist - P.dist) < rad) { this.damageFoe(f, 2, { breakShield: true }); if (S.landShockWide) f.stun = Math.max(f.stun, 1.2); }
      for (const r of this.rivals) if (Math.abs(r.dist - P.dist) < rad) r.stun = 1.2;
      this.shock = { x: P.x, t: 0.35, r: rad };
      shake(2, 0.15); Sound.play('boom');
    }
    if (S.landStomp) {
      for (const f of this.foes) if (!f.dead && Math.abs(f.dist - P.dist) < 24 && Math.abs(f.x - P.x) < 14) this.damageFoe(f, S.landStomp, { breakShield: true });
      for (const o of this.obs) if (!o.dead && (o.kind === 'hurdle' || o.kind === 'log' || o.kind === 'civi' || o.kind === 'toz') && Math.abs(o.y - P.dist) < 22 && this.overlapX(o, P.x, 6)) this.breakObs(o);
      burst(P.x, this.pY + 10, 10, [C.red, C.orange, C.sand], 45, 0.4);
    }
    if (S.landInvuln) P.landInv = S.landInvuln;
    if (S.landBoost) P.landBoostT = 1.5;
    if (P.jumpBuf > 0) { P.jumpBuf = 0; this.jump(); }
  },
  hamle() {
    const P = this.P, S = this.S;
    const tutHamle = this.tut && this.tut.step >= 5;
    if ((this.tut && !tutHamle) || this.state !== 'run' || this.paused || P.hamleCd > 0) return;
    const cost = S.hamleCost * (RUN.runStyle === 'onde' && P.dist < this.length * 0.5 ? 0.7 : 1);
    if (this.nefes < cost) { floatText('NEFES YETMİYOR', P.x, this.pY - 22, C.gray, 1, -10, 0.6); Sound.play('deny'); return; }
    this.nefes -= cost; P.hamleT = S.hamleDur; P.hamleCd = 0.7;
    RUN.hamles++; META.stats.hamles++; missionEvent('hamle', 1);
    Sound.play('dash'); haptic('medium');
    for (let i = 0; i < 10; i++) this.lines.push({ x: this.trackL + rnd() * this.laneW * 5, y: rnd() * H, l: 10 + rnd() * 12, t: 0.45 });
    if (S.hamleStars) this.starBurst(S.hamleStars);
    if (S.hamleShield && !this.hamleShieldUsed) { this.hamleShieldUsed = true; P.shield++; floatText('+KALKAN', P.x, this.pY - 30, C.gold, 1, -12, 0.8); }
    if (this.boss && this.boss.taunt > 0) this.breakTaunt();
    if (this.frost > 0) this.breakFrost();
    if (this.tut && this.tut.step === 5) { this.tutRivals(); this.tut.msg = 'HAMLE! NEFES HIZA DÖNÜŞTÜ'; this.tut.msgT = 1.6; Sound.play('select'); }
  },
  useAbility() {
    if (this.bond < 100 || this.state !== 'run' || this.paused) return;
    this.bond = 0; missionEvent('ability', 1); haptic('success');
    const P = this.P, S = this.S;
    if (RUN.jockey === 'ayse') { P.abilityT = 4; Sound.play('power'); flash(C.yellow, 0.25); floatText('SAKİN NEFES!', W / 2, this.pY - 50, C.yellow, 2, -10, 1.2); this.gainNefes(40); }
    else if (RUN.jockey === 'kemal') {
      P.dist += 160; P.invuln = Math.max(P.invuln, 0.9);
      if (this.boss) this.boss.gap = Math.min(99, this.boss.gap + 25);
      if (this.storm) this.storm.gap += 45;
      Sound.play('dash'); flash(C.white, 0.3); floatText('USTA ATAĞI!', W / 2, this.pY - 50, C.white, 2, -10, 1.2);
      for (let i = 0; i < 14; i++) this.lines.push({ x: this.trackL + rnd() * this.laneW * 5, y: rnd() * H, l: 12 + rnd() * 14, t: 0.6 });
    } else {
      for (const o of this.obs) if (!o.dead && HAZARD[o.kind] && o.y > P.dist - 10 && o.y < P.dist + this.pY) { if (o.kind === 'fici') this.hitFici(o, 99); else this.breakObs(o); }
      for (const f of this.foes) if (!f.dead && f.dist > P.dist - 20 && f.dist < P.dist + this.pY) { f.stun = 2; this.damageFoe(f, 1, { breakShield: true }); }
      if (this.reis && !this.reis.dead) { this.reis.stun = 2; this.damageFoe(this.reis, 2); }
      for (const r of this.rivals) if (Math.abs(r.dist - P.dist) < 160) r.stun = 1.8;
      if (this.boss) { this.boss.gap = Math.min(99, this.boss.gap + 15); this.boss.stun = 3; }
      this.bolts.length = 0; this.eShots.length = 0;
      Sound.play('roar'); shake(4, 0.4); flash(C.orange, 0.25); floatText('KÜKREME!', W / 2, this.pY - 50, C.orange, 2, -10, 1.2);
    }
    let y = this.pY - 32;
    const tag = (s, c) => { floatText(s, W / 2, y, c, 1, -10, 1.3); y -= 10; };
    if (S.abFly) { P.flyT = S.abFly; tag('TULPAR KANADI!', C.cyan); }
    if (S.abStun) {
      for (const f of this.foes) if (!f.dead) f.stun = Math.max(f.stun, 2.5);
      for (const r of this.rivals) r.stun = Math.max(r.stun, 1.5);
      if (this.boss) this.boss.stun = Math.max(this.boss.stun, 2);
      P.shield += S.abShield; tag('KÖROĞLU NARASI!', C.red); Sound.play('roar');
    }
    if (S.abGhosts) { P.ghostsT = S.abGhosts; tag('GÖLGE SÜRÜSÜ!', C.magenta); }
    if (S.abStars) {
      for (const f of this.foes) if (!f.dead && this.sy(f.dist) > -10 && this.sy(f.dist) < H) { this.damageFoe(f, S.abStars, { breakShield: true }); for (let i = 0; i < 4; i++) addPart(f.x + (rnd() - 0.5) * 8, this.sy(f.dist) - 30 - rnd() * 30, 0, 160, 0.25, C.yellow, 2, 0); }
      for (let i = 0; i < 26; i++) addPart(this.trackL + rnd() * this.laneW * 5, -rnd() * 60, (rnd() - 0.5) * 20, 220 + rnd() * 80, 1.6, i % 3 ? C.yellow : C.white, 2, 0);
      if (this.boss) this.boss.gap = Math.min(99, this.boss.gap + 4 * S.abStars);
      tag('TAKIMYILDIZ!', C.yellow); Sound.play('medal');
    }
    if (S.abStorm) { P.stormT = S.abStorm; tag('FIRTINA ATAĞI!', C.green); Sound.play('whoosh'); }
  },
  togglePause() {
    if (this.state !== 'run' && this.state !== 'intro') return;
    this.paused = !this.paused; this.confirmQuit = false; this.showBoons = false;
    if (this.paused) { Music.stop(); this.hold = null; return; }
    if (this.clockOn) {
      const t0 = now() + 0.6; Beat.set(this.reg.bpm, t0); Music.play(this.reg.song, t0, this.type === 'boss');
      this.lastBeatIdx = Math.floor(Beat.pos(now())); this.resumeT = 0.6;
      this.resetChart();
    }
  },

  // ---------- judging ----------
  judgeMiss() {
    const S = this.S, P = this.P;
    if (this.combo > 0 && P.stormT <= 0) this.combo = S.comboKeep ? Math.floor(this.combo / 2) : 0;
    this.showJudge(this.missHint ? 'ISKA · ' + this.missHint : 'ISKA', C.gray); Sound.play('miss');
    this.gateMiss();
    this.fireWeapon('miss');
  },
  hitTarget(tg, grade) {
    const S = this.S, P = this.P, perfect = grade === 'perfect';
    tg.done = true; tg.hit = grade; tg.hitAt = T;
    this.combo++; this.ringFlash = 1; this.comboPop = 0.15;
    this.gateHit();
    if (this.combo % 30 === 0) this.startFever();
    if (perfect) this.rate(0.25);
    RUN.maxCombo = Math.max(RUN.maxCombo, this.combo); this.etapMax = Math.max(this.etapMax || 0, this.combo);
    if (perfect) this.etapPerfects = (this.etapPerfects || 0) + 1;
    missionEvent('combo', this.combo);
    if (perfect) {
      RUN.perfects++; META.stats.perfects++; missionEvent('perfect', 1);
      this.addBond(7); this.shoeFlash = 1;
      Sound.play('perfect', this.combo / 2); haptic('light');
      this.showJudge('MÜKEMMEL', C.yellow);
      burst(P.x, this.pY + 9, 5, [C.yellow, C.white], 35, 0.35);
    } else { this.addBond(4); Sound.play('good'); this.showJudge(this.lastDelta > 0 ? 'İYİ · ERKEN' : 'İYİ · GEÇ', C.white); this.shoeFlash = 0.5; }
    if (this.boss) this.boss.gap = Math.min(100, this.boss.gap + (perfect ? 1.0 : 0.5) * (tg.kind === 'a' && perfect ? 1.6 : 1));
    this.gainNefes(perfect ? 1.5 : 0.75);
    if (tg.kind === 'a' && perfect) this.fireSpecial(); else this.fireWeapon(grade);
    if (tg.kind === 'd' || tg.kind === 'd2') {
      const mate = this.targets.find(o => o !== tg && o.pair === tg.pair);
      if (mate && mate.hit) { this.showJudge('ÇİFT!', C.magenta); this.addBond(3); if (S.doubleBonus) { this.fireWeapon('good'); this.gainNefes(4); } }
    }
    if (tg.kind === 'h') { this.hold = { tg, start: tg.t, end: tg.t + tg.len - 0.35 }; Sound.play('select'); }
    if (S.volley && this.combo % S.volley === 0) this.volley();
    if (this.combo % 10 === 0) {
      Sound.play('combo'); haptic('medium'); this.rate(4); if (this.combo >= 20) this.say('combo');
      // milestone text only where it adds something: 10 and 20, then every 50 (30s already show DÖRTNAL)
      if (this.combo % 30 !== 0 && (this.combo <= 20 || this.combo % 50 === 0)) floatText(this.combo + ' KOMBO!', W / 2, this.pY - 44, C.gold, 2, -12, 1.1);
    }
    if (S.starDust && this.combo % 30 === 0 && RUN.hp < S.maxHp) { RUN.hp++; floatText('+1 CAN', P.x, this.pY - 22, C.red); Sound.play('heart'); }
    if (this.tut && this.tut.step === 3) this.tut.hits++;
    if (tg.kind === 'a' && perfect && this.boss && this.boss.taunt > 0) this.breakTaunt();
    if (tg.kind === 'a' && perfect && this.frost > 0) this.breakFrost();
  },
  finishHold(auto) {
    const h = this.hold; if (!h) return;
    this.hold = null;
    const bp = Beat.pos(now()), P = this.P;
    if (auto || bp >= h.end - 0.15) {
      this.gainNefes(25); this.addBond(6); RUN.holds++; META.stats.holds++; missionEvent('nefes', 1); this.gateHit();
      this.showJudge('NEFES!', C.cyan); Sound.play('heal');
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; addPart(P.x + Math.cos(a) * 12, this.pY + Math.sin(a) * 12, -Math.cos(a) * 30, -Math.sin(a) * 30, 0.5, i % 2 ? C.cyan : C.white, 1); }
    } else { this.showJudge('BIRAKTIN', C.gray); Sound.play('miss'); }
  },
  showJudge(s, c) { this.judgeStr = s; this.judgeCol = c; this.judgeT = 0.55; },

  // ---------- weapons ----------
  fireWeapon(kind) {
    if (this.state !== 'run') return;
    const S = this.S, w = WEAPONS[S.weapon] || WEAPONS.yay, assist = S.assist > 0;
    if (w.fire === 'judged') { if (kind !== 'miss') this.shoot(Math.max(kind === 'perfect' ? 2 : 1, S.minShots), kind === 'perfect'); else if (assist) this.shoot(Math.max(1, S.minShots), false); }
    else if (w.fire === 'any') this.shoot(kind === 'miss' ? 1 : S.fanCount, kind === 'perfect');
    else if (w.fire === 'perfect') { if (kind === 'perfect' || ((assist || S.fireOnGood) && kind === 'good')) this.shoot(1, kind === 'perfect'); }
    else if (w.fire === 'bar') { if (kind !== 'miss' || assist) { this.topCharge++; if (this.topCharge >= S.barNeed) { this.topCharge = 0; this.shoot(1, kind === 'perfect'); } } }
    if (this.fever > 0 && kind !== 'miss') this.shoot(1, kind === 'perfect');
  },
  shotBase(perfect) {
    const S = this.S, w = WEAPONS[S.weapon] || WEAPONS.yay;
    let dmg = S.shotDmg;
    if (S.fullNefesDmg && this.nefes >= 80) dmg *= 1 + S.fullNefesDmg;
    return { kind: w.shot, dmg, spd: w.speed, pierce: (w.pierce || 0) + (perfect ? S.shotPierce : (S.weapon === 'sapan' ? S.shotPierce : 0)), homing: perfect && S.shotHoming, aoe: !!w.aoe, breaks: !!w.breaksRock, knock: S.knock, vx: 0,
      burn: S.burn, ric: S.ricochet, stun: S.shotStun, blast: S.miniBlast && S.weapon === 'tatar', bstun: S.blastStun, bounce: S.bounceBall };
  },
  shoot(n, perfect) {
    const S = this.S, P = this.P, base = this.shotBase(perfect);
    const y0 = P.dist + 12, fan = S.weapon === 'sapan' && n >= 3;
    for (let i = 0; i < n; i++) {
      const s = Object.assign({}, base, { x: P.x, dist: y0 - i * 6, aim: !fan || i === Math.floor(n / 2) });
      if (!fan && n >= 2) s.x += (i - (n - 1) / 2) * 5;
      if (fan) s.vx = (i - (n - 1) / 2) * (60 / (n - 1));
      this.addShot(s);
    }
    if (S.shotSpread) for (const dl of [-1, 1]) { const ln = P.lane + dl; if (ln >= 0 && ln <= 4) this.addShot(Object.assign({}, base, { x: this.laneX(ln), dist: y0, dmg: base.dmg * S.shotSpread, homing: false, aim: true })); }
    if (S.ghostShoots && S.ghost) this.addShot(Object.assign({}, base, { x: this.laneX(this.ghostLane), dist: y0, aim: true }));
    if (P.ghostsT > 0) for (const dl of [-1, 1]) { const ln = P.lane + dl; if (ln >= 0 && ln <= 4) this.addShot(Object.assign({}, base, { x: this.laneX(ln), dist: y0 - 4, aim: true })); }
    if (S.airStars && P.jumping) this.addShot({ kind: 'star', dmg: 1, spd: 300, pierce: 0, x: P.x, dist: y0, vx: (rnd() - 0.5) * 70 });
    const snd = base.kind === 'ball' ? 'cannon' : base.kind === 'bolt' ? 'bolt' : base.kind === 'pebble' ? 'pebble' : 'shoot';
    Sound.play(snd);
    if (base.kind === 'ball') { shake(2, 0.12); burst(P.x, this.pY - 8, 6, [C.gray, C.lgray, C.white], 30, 0.4); }
  },
  fireSpecial() {
    const S = this.S, P = this.P, w = S.weapon, base = this.shotBase(true), m = S.specialMult, y0 = P.dist + 12;
    RUN.specials++; META.stats.specials++; missionEvent('special', 1); this.rate(3);
    if (w === 'sapan') { for (let i = 0; i < 7; i++) this.addShot(Object.assign({}, base, { x: this.laneX(i % 5), dist: y0 + i * 9, vx: 0, dmg: base.dmg * m, aim: true, special: true })); Sound.play('pebble'); }
    else if (w === 'tatar') { this.addShot(Object.assign({}, base, { x: P.x, dist: y0, dmg: base.dmg * 2 * m, pierce: 99, breaks: true, aim: true, special: true, big: true })); Sound.play('bolt'); }
    else if (w === 'top') { this.addShot(Object.assign({}, base, { x: P.x, dist: y0, dmg: base.dmg * 1.5 * m, aoe: true, special: true, big: true })); Sound.play('cannon'); shake(2, 0.12); }
    else { for (let i = 0; i < 3; i++) this.addShot(Object.assign({}, base, { x: P.x, dist: y0 - Math.abs(i - 1) * 5, vx: (i - 1) * 45, dmg: base.dmg * 1.3 * m, aim: i === 1, special: true })); Sound.play('shoot'); }
    floatText(WEAPON_SPECIAL[w] || 'GÜÇ!', P.x, this.pY - 30, C.gold, 1, -16, 0.7);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; addPart(P.x + Math.cos(a) * 9, this.pY + Math.sin(a) * 9, Math.cos(a) * 40, Math.sin(a) * 40, 0.35, C.gold, 1); }
    haptic('medium');
  },
  volley() {
    const P = this.P, base = this.shotBase(false);
    for (let l = 0; l < 5; l++) this.addShot(Object.assign({}, base, { kind: 'arrow', x: this.laneX(l), dist: P.dist + 10 - Math.abs(l - P.lane) * 6, aoe: false }));
    floatText('IŞIK YAĞMURU!', W / 2, this.pY - 56, C.green, 1, -10, 0.9); Sound.play('whoosh');
  },
  starBurst(n) {
    const P = this.P;
    for (let i = 0; i < n; i++) this.addShot({ kind: 'star', dmg: 1, spd: 280, pierce: 1, x: P.x, dist: P.dist + 10, vx: (i - (n - 1) / 2) * 34 });
    Sound.play('perfect', 6);
  },
  addShot(s) { s.hit = []; s.life = 1.6; s.dead = false; s.d0 = s.dist; if (this.shots.length < 80) this.shots.push(s); },
  nearestFoe(x, dist, maxDx, skip) {
    let best = null, bd = 1e9;
    const consider = f => { if (!f || f.dead || f === skip) return; const dd = f.dist - dist; if (dd < -4 || dd > 220 || Math.abs(f.x - x) > maxDx) return; const sc = dd + Math.abs(f.x - x) * 2; if (sc < bd) { bd = sc; best = f; } };
    for (const f of this.foes) consider(f);
    consider(this.reis);
    return best;
  },
  shotTargets() { return this.reis && !this.reis.dead ? this.foes.concat([this.reis]) : this.foes; },
  updateShots(dt) {
    const P = this.P, B = this.boss;
    const targets = this.shotTargets();
    for (const s of this.shots) {
      if (s.dead) continue;
      s.life -= dt;
      s.dist += (P.speed + s.spd) * dt;
      if (s.homing || s.aim) { const f = this.nearestFoe(s.x, s.dist, s.homing ? 999 : this.laneW * 1.1, s.lastHit); if (f) s.vx = s.homing ? clamp((f.x - s.x) * 7, -190, 190) : clamp((f.x - s.x) * 3.5, -110, 110); }
      s.x += s.vx * dt;
      if (s.aoe && s.dist - s.d0 > 175) { this.explode(s); s.dead = true; continue; }
      if (s.life <= 0 || s.dist - P.dist > this.pY + 30 || s.x < this.trackL - 8 || s.x > this.trackL + this.laneW * 5 + 8) { s.dead = true; continue; }
      for (const f of targets) {
        if (f.dead || s.hit.indexOf(f) >= 0) continue;
        if (Math.abs(f.dist - s.dist) < 9 && Math.abs(f.x - s.x) < f.r + 2) {
          if (s.aoe) { this.explode(s); s.dead = true; break; }
          if (f.kind === 'kalkanli' && f.stun <= 0 && f.laneT >= 1 && !(s.pierce > 0 || s.special || s.breaks)) {
            s.dead = true; Sound.play('ehit'); burst(s.x, this.sy(f.dist) + 4, 5, [C.white, C.yellow], 40, 0.3); f.flash = 0.06;
            floatText('TINK', f.x, this.sy(f.dist) - 14, C.lgray, 1, -14, 0.4);
            break;
          }
          this.damageFoe(f, s.dmg, s); s.hit.push(f); s.lastHit = f;
          if (s.blast) this.explode(Object.assign({}, s, { dmg: s.dmg * 0.5, r: 18, bounce: 0 }), true);
          if (s.ric > 0) { const f2 = this.nearestFoe(s.x, s.dist - 30, 140, f); if (f2) { s.ric--; s.homing = true; s.life = 0.8; continue; } }
          if (s.pierce > 0) s.pierce--; else { s.dead = true; break; }
        }
      }
      if (s.dead) continue;
      if (this.duel && !this.duel.r.done) {
        const r = this.duel.r;
        if (Math.abs(r.dist - s.dist) < 9 && Math.abs(r.x - s.x) < 8) {
          s.dead = true; Sound.play('ehit');
          if (this.duel.stunImm <= 0) {
            r.stun = Math.max(r.stun, s.special ? 0.9 : 0.4); this.duel.stunImm = s.special ? 4 : 3;
            floatText('SERSEMLEDİ!', r.x, this.sy(r.dist) - 28, C.yellow, 1, -8, 0.7); this.rate(3);
          } else burst(s.x, this.sy(r.dist), 4, [C.white, C.cyan], 30, 0.25);
          continue;
        }
      }
      for (const o of this.obs) {
        if (o.dead || !SOLID[o.kind]) continue;
        if (Math.abs(o.y - s.dist) < 7 && this.overlapX(o, s.x, 1)) {
          if (s.aoe) { this.explode(s); s.dead = true; break; }
          if (o.kind === 'fici') this.hitFici(o, s.dmg);
          else if (s.breaks) { this.breakObs(o); Sound.play('bump'); }
          else { burst(s.x, this.sy(o.y), 4, [C.white, C.lgray], 30, 0.25); s.dead = true; break; }
          if (s.pierce > 0) s.pierce--; else { s.dead = true; break; }
        }
      }
      if (s.dead || !B || B.won) continue;
      const bd = P.dist + (this.pY - B.screenY);
      if (s.dist >= bd - 6 && s.dist < bd + 14 && Math.abs(s.x - B.x) < 10) {
        if (s.aoe) this.explode(s);
        else this.bossHit(s.dmg, s.x, !!s.special);
        s.dead = true;
      }
    }
    this.shots = this.shots.filter(s => !s.dead);
  },
  explode(s, mini) {
    const rad = s.r || 28, P = this.P;
    for (const f of this.shotTargets()) if (!f.dead && Math.hypot(f.x - s.x, f.dist - s.dist) < rad + f.r) { this.damageFoe(f, s.dmg, { breakShield: true, knock: s.knock }); if (s.bstun) f.stun = Math.max(f.stun, s.bstun); }
    if (!mini) for (const o of this.obs) if (!o.dead && HAZARD[o.kind] && o.kind !== 'puddle' && Math.abs(o.y - s.dist) < rad && this.overlapX(o, s.x, rad * 0.6)) { if (o.kind === 'fici') this.hitFici(o, 99); else this.breakObs(o); }
    const B = this.boss;
    if (B && !B.won && Math.abs(P.dist + (this.pY - B.screenY) - s.dist) < rad && Math.abs(B.x - s.x) < rad) this.bossHit(s.dmg, s.x, !!s.special);
    const sy = this.sy(s.dist);
    burst(s.x, sy, mini ? 8 : 16, [C.orange, C.yellow, C.white, C.gray], mini ? 45 : 70, 0.5, 40, 2);
    this.shock = { x: s.x, sy, t: 0.3, r: rad };
    Sound.play('boom'); if (!mini) shake(3, 0.2);
    if (s.bounce > 0 && !mini) {
      const nb = Object.assign({}, s, { dist: s.dist + 6, bounce: s.bounce - 1, vx: (rnd() - 0.5) * 60 }); nb.d0 = nb.dist; nb.hit = []; nb.life = 1.2; nb.dead = false;
      this.shots.push(nb);
    }
  },
  damageFoe(f, dmg, src) {
    if (f.dead) return;
    f.hp -= dmg; f.flash = 0.12;
    // a golden-note shot, piercing bolt, blast or ram knocks the guard's shield aside
    if (f.kind === 'kalkanli' && src && (src.breakShield || src.special || src.pierce > 0 || src.breaks || src.aoe) && f.stun < 1 && f.hp > 0.001) {
      f.stun = 1.8; floatText('KALKAN DÜŞTÜ!', f.x, this.sy(f.dist) - 18, C.gold, 1, -12, 0.7);
    }
    if (src && src.knock && f.kind !== 'reis') { f.dist += 18; f.stun = Math.max(f.stun, 0.3); }
    if (src && src.stun) f.stun = Math.max(f.stun, src.stun);
    if (src && src.burn) { f.burnT = 2; f.burnDps = src.burn; }
    if (f.hp <= 0.001) { if (f.kind === 'reis') this.killReis(); else this.killFoe(f); } else Sound.play('ehit');
  },
  killFoe(f) {
    f.dead = true; this.kills++; RUN.kills++; META.stats.kills++; missionEvent('kills', 1);
    const n = Math.max(1, Math.round(FOES[f.kind].coins * this.S.foeCoins * this.S.coinMult));
    RUN.coins += n; RUN.coinsEarned += n; missionEvent('coins', RUN.coinsEarned);
    this.addBond(3);
    const sy = this.sy(f.dist);
    floatText('+' + n, f.x, sy - 10, C.yellow);
    const cols = { karga: [C.navy, C.slate, C.white], domuz: [C.dbrown, C.brown, C.white], kalkanli: [C.gray, C.lgray, C.plum] }[f.kind] || [C.plum, C.red, C.white];
    burst(f.x, sy, 10, cols, 50, 0.5, 80, 1);
    Sound.play('edie'); haptic('light'); this.rate(2);
    if (this.kills % 5 === 0) this.say('kill');
    if (this.type === 'baskin' && this.kills === this.goal) { floatText('HEDEF TAMAM!', W / 2, this.pY - 64, C.green, 1, -8, 1.3); Sound.play('combo'); }
  },
  hitFici(o, dmg) {
    o.hp = (o.hp || 2) - dmg; o.flash = 0.12;
    if (o.hp > 0) { Sound.play('ehit'); return; }
    this.breakObs(o);
    const n = Math.max(1, Math.round(3 * this.S.coinMult));
    RUN.coins += n; RUN.coinsEarned += n; missionEvent('coins', RUN.coinsEarned);
    floatText('+' + n, this.laneX(o.lane), this.sy(o.y) - 10, C.yellow); Sound.play('edie');
  },
  onBeat(b) {
    if (this.state !== 'run' || this.paused) return;
    addPart(this.P.x + (rnd() * 6 - 3), this.pY + 12, (rnd() - 0.5) * 10, 20, 0.35, this.reg.dirtL, 1);
    if (META.settings.beatHaptic) haptic('light');
    // enemies move to the music: they act on beats, so the rhythm warns you
    for (const f of this.foes) if (!f.dead) { if (f.kind === 'okcu') this.okcuBeat(f, b); else if (f.kind === 'kalkanli') this.guardBeat(f, b); }
    if (this.reis && !this.reis.dead) this.reisBeat(b);
    if (this.boss && !this.boss.won) this.bossBeat(b);
    if (this.duel) this.duelBeat(b); else if (this.rivals.length) this.rivalBeat(b);
    this.scanBeat();
  },
  // the duel rival acts on the beat: it shows its move one beat ahead ("!"), so the music warns you
  duelBeat(b) {
    const D = this.duel, r = D.r, P = this.P;
    if (r.done || this.state !== 'run') { D.tele = null; return; }
    if (D.tele) { const t = D.tele; D.tele = null; this.duelAct(t); return; }
    if (r.stun > 0 || b < D.nextTrick) return;
    const gap = r.dist - P.dist;
    if (r.style === 'itici' && Math.abs(gap) < 24 && Math.abs(r.lane - P.lane) === 1 && r.laneT >= 1 && P.flyT <= 0) {
      D.tele = { kind: 'push', lane: P.lane }; D.nextTrick = b + 6; Sound.play('hey');
    } else if (r.style === 'onde' && gap > 45 && gap < 230 && P.dist < this.length * 0.92) {
      D.tele = { kind: 'drop' }; D.nextTrick = b + 7; Sound.play('hey');
    } else if (r.style === 'sondan' && this.finalStretch && !D.surged) {
      D.surged = 1; D.surgeT = 3.2; D.nextTrick = b + 8;
      this.banner = { txt: r.name + ' ATAĞA KALKTI!', col: C.salmon }; this.bannerT = 1.6; Sound.play('roar');
    } else if (r.style === 'atici' && gap > 40 && gap < 220 && r.laneT >= 1 && P.dist < this.length * 0.94) {
      D.tele = { kind: 'shot', lane: P.lane }; D.nextTrick = b + 5; Sound.play('warn');
    } else if (r.style === 'zikzak' && gap > 6 && gap < 64 && Math.abs(r.lane - P.lane) === 1 && r.laneT >= 1 && this.laneFree(P.lane, r.dist, r)) {
      D.tele = { kind: 'cut', lane: P.lane }; D.nextTrick = b + 4; Sound.play('hey');
    } else if (gap > 6 && gap < 55 && Math.abs(r.lane - P.lane) === 1 && r.laneT >= 1 && D.blockCd <= 0 && this.laneFree(P.lane, r.dist, r)) {
      // cuts in front of you: go around it (being behind it still fills your draft)
      r.fromX = r.x; r.lane = P.lane; r.laneT = 0; r.cool = 1; D.blockCd = 3.5; D.nextTrick = b + 4;
      floatText('ÖNÜNÜ KESTİ!', r.x, this.sy(r.dist) - 28, C.salmon, 1, -8, 0.8);
    }
  },
  duelAct(t) {
    const D = this.duel, r = D.r, P = this.P, S = this.S;
    if (r.done || r.stun > 0) return;
    if (t.kind === 'push') {
      if (P.lane === t.lane && Math.abs(r.dist - P.dist) < 26 && P.flyT <= 0 && !P.jumping && !this.invulnerable()) {
        if (S.shoulder) { this.pushRival(r, r.lane - P.lane); floatText('KARŞILADIN!', P.x, this.pY - 18, C.green); }
        else {
          P.slowT = 0.7; P.slowAmt = 0.32 * (1 - Math.min(0.8, S.slowResist)); P.bounce = r.lane < P.lane ? 1 : -1;
          this.nefes = Math.max(0, this.nefes - 8);
          floatText('İTTİ!', P.x, this.pY - 18, C.salmon); Sound.play('bump'); shake(3, 0.16); haptic('medium');
        }
      } else { r.stun = 0.8; floatText('BOŞA ÇIKTI!', r.x, this.sy(r.dist) - 28, C.green, 1, -8, 0.8); Sound.play('whoosh'); this.addBond(4); this.rate(6); }
    } else this.rivalAct(r, t);
  },
  updateLayer() {
    let L = this.combo >= 20 ? 3 : this.combo >= 10 ? 2 : this.combo >= 4 ? 1 : 0;
    if (this.boss) L = Math.max(1, L);
    if (this.finalStretch) L = Math.min(3, L + 1);
    if (this.P.stormT > 0 || this.P.abilityT > 0 || this.kick > 0) L = 3;
    Music.layer = L;
  },

  // ---------- damage ----------
  invulnerable() {
    const P = this.P, S = this.S;
    return P.invuln > 0 || P.laneInv > 0 || P.landInv > 0 || P.flyT > 0 || (P.abilityT > 0 && RUN.jockey === 'ayse') || (P.hamleT > 0 && (S.hamleInv || S.hamleAir));
  },
  hurt(src) {
    const P = this.P, S = this.S;
    if (src === 'scan' && this.state === 'run' && !this.invulnerable()) RUN.scanHits = (RUN.scanHits || 0) + 1;
    if (this.state !== 'run' || window.__god) return false;
    if (this.invulnerable()) return false;
    if (S.assist > 0 && src !== 'rank' && src !== 'raid' && src !== 'boss' && src !== 'storm' && rnd() < S.assist) {
      P.invuln = 0.5; floatText('YARDIM!', P.x, this.pY - 22, C.sky); Sound.play('bump'); shake(1, 0.1); return false;
    }
    if (P.shield > 0) { P.shield--; P.invuln = 0.6; floatText('KALKAN!', P.x, this.pY - 22, C.gold); Sound.play('bump'); shake(2, 0.15); haptic('medium'); return false; }
    RUN.hp--; RUN.damage++; this.damaged++;
    this.heartLost = { i: RUN.hp, t: 0.8 };
    const cause = HURT_LABELS[src]; if (cause) floatText(cause, P.x, this.pY - 30, C.salmon, 1, -14, 1.1);
    P.invuln = 1.25; P.slowT = 0.9; P.slowAmt = 0.45 * (1 - Math.min(0.8, S.slowResist));
    if (this.combo > 0 && P.stormT <= 0) this.combo = S.comboKeep ? Math.floor(this.combo / 2) : 0;
    this.nefes = Math.max(0, this.nefes - 12); this.hold = null;
    FX.freeze = 0.075; shake(4, 0.28); flash(C.red, 0.18); haptic('heavy'); Sound.play('hit');
    burst(P.x, this.pY, 10, [C.white, C.yellow, C.sand], 55, 0.5, 60, 1);
    if (this.boss) this.boss.gap = Math.max(0, this.boss.gap - 12);
    this.rate(-15); this.say('hurt', true);
    if (RUN.hp <= 0) {
      if (S.muska && !RUN.muskaUsed) {
        RUN.muskaUsed = true; RUN.hp = S.muska >= 2 ? 2 : 1; P.invuln = S.muska >= 3 ? 2.2 : 1.5;
        flash(C.magenta, 0.5); Sound.play('revive'); haptic('success');
        floatText('BİP\'İN YEDEK PİLİ!', W / 2, this.pY - 50, C.magenta, 1, -10, 1.4);
      } else if (RUN.revivesUsed < S.revives) {
        RUN.revivesUsed++; RUN.hp = S.reviveHp; P.invuln = 2.4;
        flash(C.white, 0.5); Sound.play('revive'); haptic('success');
        floatText('İKİNCİ NEFES!', W / 2, this.pY - 50, C.cyan, 2, -10, 1.4);
      } else this.die();
    }
    return true;
  },
  die() {
    this.state = 'dead'; this.stateT = 0; Music.stop(); Sound.play('lose'); haptic('error'); this.hold = null; this.endFever();
    const B = this.boss;
    RUN.diedIn = { type: this.type, region: RUN.region, etap: RUN.etap, boss: B ? B.key : null, gap: B ? Math.round(B.gap) : null, pct: this.type !== 'boss' ? Math.round(this.P.dist / this.length * 100) : null };
    if (B) META.flags['lost_' + B.key] = true;
  },
  breakObs(o) {
    o.dead = true; const sy = this.sy(o.y);
    const x0 = this.laneL(o.lane), w = o.span * this.laneW;
    const col = o.kind === 'rock' ? [C.gray, C.dgray, C.lgray] : o.kind === 'puddle' ? [C.sky, C.white] : o.kind === 'fici' ? [C.brown, C.dbrown, C.gray] : o.kind === 'civi' ? [C.gray, C.lgray] : o.kind === 'toz' ? [C.tan, C.sand] : o.kind === 'scan' ? [C.red, C.salmon, C.white] : [C.brown, C.white, C.red];
    for (let i = 0; i < Math.min(14, 4 + o.span * 3); i++) addPart(x0 + rnd() * w, sy + (rnd() * 6 - 3), (rnd() - 0.5) * 80, -30 - rnd() * 50, 0.6, col[i % col.length], 2, 160);
  },
  overlapX(o, x, half) {
    if (o.kind === 'wolf') return Math.abs(o.x - x) < 6 + half;
    const pad = o.kind === 'civi' ? 5 : 3;
    const x0 = this.laneL(o.lane) + pad, x1 = this.laneL(o.lane + o.span) - pad;
    return x + half > x0 && x - half < x1;
  },
  nearMiss() {
    RUN.nearMiss++; META.stats.nearMiss++; missionEvent('nearmiss', 1);
    const n = Math.max(1, Math.round(2 * this.S.coinMult));
    RUN.coins += n; RUN.coinsEarned += n;
    this.addBond(5); this.gainNefes(4);
    floatText('KIL PAYI! +' + n, this.P.x, this.pY - 26, C.cyan, 1, -18, 0.85);
    Sound.play('nearmiss'); haptic('light');
    this.rate(8); this.say('nearmiss');
  },
  judgeJump(o) {
    const P = this.P, S = this.S;
    if (!P.jumping) return;
    const k = P.jumpT / S.jumpTime;
    if (k < 0.14) { this.nearMiss(); return; }
    if (k >= 0.28 && k <= 0.72) {
      RUN.cleanJumps++; META.stats.cleanJumps++; missionEvent('temiz', 1);
      P.cleanT = 0.8; this.addBond(2); this.gainNefes(2 + S.cleanNefes);
      floatText('TEMİZ!', P.x, this.pY - 26, C.green, 1, -14, 0.6); Sound.play('select'); this.rate(4);
      if (S.cleanStars) this.starBurst(S.cleanStars);
      if (S.cleanHamle) P.hamleT = Math.max(P.hamleT, 0.6);
    } else if (k > 0.82) {
      if (P.slowT <= 0.05) P.slowAmt = 0.15;
      P.slowT = Math.max(P.slowT, 0.35);
      floatText('SIYIRDI', P.x, this.pY - 20, C.salmon, 1, -10, 0.5); Sound.play('bump');
    }
  },

  // ---------- update ----------
  update(dt) {
    if (this.paused) return;
    this.stateT += dt;
    if (this.resumeT > 0) this.resumeT -= dt;
    if (this.clockOn) {
      const fl = Math.floor(Beat.pos(now()));
      if (fl > this.lastBeatIdx) { for (let b = this.lastBeatIdx + 1; b <= fl; b++) this.onBeat(b); this.lastBeatIdx = fl; }
    }
    this.shoeFlash = Math.max(0, this.shoeFlash - dt * 4);
    if (this.comboPop > 0) this.comboPop -= dt;
    if (this.heartLost) { this.heartLost.t -= dt; if (this.heartLost.t <= 0) this.heartLost = null; }
    if (this.comboBreak > 0) this.comboBreak -= dt;
    if ((this.prevCombo || 0) >= 8 && this.combo < this.prevCombo - 2 && this.state === 'run') { this.comboBreak = 0.9; this.brokenCombo = this.prevCombo; }
    this.prevCombo = this.combo;
    this.ringFlash = Math.max(0, this.ringFlash - dt * 5);
    this.judgeT = Math.max(0, this.judgeT - dt);
    if (this.bannerT > 0) this.bannerT -= dt;
    if (this.medal) this.medalT += dt;
    if (this.shock) { this.shock.t -= dt; if (this.shock.t <= 0) this.shock = null; }
    if (this.state === 'intro') {
      if (this.clockOn && now() >= Beat.t0 - 0.05) {
        this.state = 'run'; this.stateT = 0; this.onRaceStart();
        if (this.happy) { floatText('MUTLU YILDIZ! +' + this.happy + ' KOMBO', W / 2, this.pY - 52, C.salmon, 1, -10, 1.6); Sound.play('nicker'); }
      }
      if (window.__auto && this.tipKey && this.stateT > 0.4) this.dismissTip();
      else if (window.__auto && this.betOffer && this.stateT > 0.3) this.placeBet(window.__autoBet ? (this.betOffer.stakes[0] || 0) : 0);
      updateFX(dt); return;
    }
    if (FX.freeze > 0) { FX.freeze -= dt; return; }
    if (this.state === 'dead') {
      this.timeScale = Math.max(0.15, this.timeScale - dt * 1.5);
      this.P.speed *= 0.94;
      if (this.stateT > 1.8) { saveMeta(); go('results', { won: false }); this.state = 'gone'; }
    }
    if (this.state === 'finish' && this.stateT > (this.medal ? 2.6 : 1.5)) { this.state = 'gone'; this.complete(); }
    this.updateTargets();
    if (this.tut) this.updateTut(dt);
    if (window.__auto && this.state === 'run') this.autoPlay();
    this.updateLayer();
    this.updateWorld(dt * this.timeScale);
    updateFX(dt);
  },
  updateWorld(dt) {
    const P = this.P, S = this.S;
    this.time += dt;
    const dec = k => { if (P[k] > 0) P[k] = Math.max(0, P[k] - dt); };
    ['invuln', 'slowT', 'hamleT', 'hamleCd', 'abilityT', 'laneInv', 'floatT', 'landInv', 'landBoostT', 'laneBoostT', 'flyT', 'ghostsT', 'stormT', 'slingT', 'jumpBuf', 'cleanT'].forEach(dec);
    if (this.fogT > 0) this.fogT -= dt;
    if (this.frost > 0) this.frost -= dt;
    if (P.laneT < 1) { P.laneT = Math.min(1, P.laneT + dt / (S.laneTime * (this.frost > 0 ? 1.8 : 1))); P.x = lerp(P.fromX, this.laneX(P.lane), Ease.outQuad(P.laneT)); }
    else P.x = this.laneX(P.lane) + (P.bounce ? P.bounce * 3 * Math.sin(Math.min(1, Math.abs(P.bounce)) * Math.PI) : 0);
    if (P.bounce) { P.bounce *= 0.8; if (Math.abs(P.bounce) < 0.05) P.bounce = 0; }
    if (P.jumping) {
      P.jumpT += dt;
      if (!P.apexDone && P.jumpT >= S.jumpTime / 2) { P.apexDone = true; if (S.jumpStars && this.state === 'run') this.starBurst(S.jumpStars); }
      if (P.jumpT >= S.jumpTime) { P.jumping = false; this.land(); }
    }
    if (this.state === 'run') P.speed = this.playerSpeed();
    else if (this.state === 'finish') P.speed = Math.max(40, P.speed * 0.985);
    P.blocked = 0; let drafting = false;
    for (const r of this.rivals) {
      if (r.done || r.lane !== P.lane || r.laneT < 0.6 || P.jumping || P.flyT > 0) continue;
      const d = r.dist - P.dist;
      if (d > 0 && d < 17) {
        if (S.shoulder && this.state === 'run') this.pushRival(r, R.chance(0.5) ? 1 : -1);
        else if (P.hamleT > 0 && (S.hamleInv || S.hamleAir)) { /* slip through */ }
        else { P.speed = Math.min(P.speed, r.cur * 0.97); P.blocked = 1; }
      }
      if (d > 0 && d < 64) drafting = true;
    }
    if (drafting && this.state === 'run') {
      P.draft = Math.min(1, P.draft + dt * 0.5); this.gainNefes(8 * dt);
      if (P.draft >= 1 && !P.draftFull) { P.draftFull = true; floatText('SİPER DOLU: YANA ÇIK!', P.x, this.pY + 22, C.cyan, 1, 6, 1); Sound.play('select'); }
    } else if (!P.draftFull) P.draft = Math.max(0, P.draft - dt * 0.6);
    else { P.draft = Math.max(0, P.draft - dt * 0.25); if (P.draft <= 0) P.draftFull = false; }
    if (this.kick > 0 && this.state === 'run') this.nefes = Math.max(0, this.nefes - 22 * dt);
    const cm = this.state === 'run' ? this.cornerMult(P.lane, P.dist) : 1;
    P.cornerM = cm;
    P.dist += P.speed * dt * cm;
    if (this.state === 'run' || this.state === 'finish') this.generate();
    if (this.state === 'run') this.updateBends();
    if (this.type === 'baskin' && this.state === 'run' && P.dist < this.length - 260) {
      this.foeTimer -= dt;
      if (this.foeTimer <= 0) { this.foeTimer = R.f(0.85, 1.4) / (S.moreFoes * (this.elite ? 1.3 : 1) * (1 + 0.12 * this.reg.tier)); this.spawnFoeAt(P.dist + this.pY + 30); }
      if (!this.reisDone && P.dist > this.length * 0.5) this.spawnReis();
    }
    this.updateObs(dt);
    this.updateFoes(dt);
    this.updateReis(dt);
    this.updateEShots(dt);
    this.updateShots(dt);
    this.updateTrails(dt);
    this.updateRivals(dt);
    if (this.storm && this.state === 'run') this.updateStorm(dt);
    if (this.boss) this.updateBoss(dt);
    this.updateBolts(dt);
    this.updateWind(dt);
    this.updateShow(dt);
    for (let i = this.lines.length - 1; i >= 0; i--) { const l = this.lines[i]; l.t -= dt; l.y += 260 * dt; if (l.t <= 0) this.lines.splice(i, 1); }
    if ((this.combo >= 12 || P.hamleT > 0 || P.abilityT > 0 || P.slingT > 0 || P.stormT > 0 || this.kick > 0) && rnd() < dt * (8 + this.combo * 0.3)) this.lines.push({ x: this.trackL + rnd() * this.laneW * 5, y: -10, l: 6 + rnd() * 8, t: 1.2 });
    if (S.ghost) this.ghostLane = P.lane < 4 ? P.lane + 1 : P.lane - 1;
    if (!this.finalStretch && this.type !== 'boss' && !this.tut && this.state === 'run' && P.dist >= this.length * 0.8) this.startFinalStretch();
    if (this.state === 'run' && this.type !== 'boss' && P.dist >= this.length && (!this.tut || this.tut.step >= 6)) this.finishLine();
  },
  startFinalStretch() {
    this.finalStretch = true;
    floatText('SON DÜZLÜK!', W / 2, this.pY - 64, C.yellow, 2, -8, 1.3); Sound.play('cheer'); this.say('final', true);
    if (this.nefes > 1) {
      this.kick = (0.03 + 0.12 * this.nefes / 100) * this.S.kickMult * (RUN.runStyle === 'sondan' ? 1.5 : 1);
      META.stats.kicks++;
      floatText('SON ATAK! +%' + Math.round(this.kick * 100) + ' HIZ', W / 2, this.pY - 42, C.cyan, 1, -8, 1.4);
      flash(C.cyan, 0.2); haptic('success');
    }
    if (RUN.runStyle === 'sondan') floatText('SONDAN GELİYORSUN!', W / 2, this.pY - 30, C.green, 1, -8, 1.3);
    if (this.type === 'baskin' && this.kills < this.goal) floatText((this.goal - this.kills) + ' DÜŞMAN DAHA!', W / 2, this.pY - 18, C.salmon, 1, -8, 1.5);
  },
  playerSpeed() {
    const S = this.S, P = this.P;
    let sp = BASE_SPEED * this.reg.speed * S.speed;
    const combo = P.stormT > 0 ? S.comboCap : this.combo;
    sp *= 1 + Math.min(combo, S.comboCap) * S.comboPer;
    if (S.stormBonus && (this.combo >= 20 || P.stormT > 0)) sp *= 1 + S.stormBonus;
    if (S.lowHpSpeed && RUN.hp === 1) sp *= 1 + S.lowHpSpeed;
    if (P.slowT > 0) sp *= 1 - P.slowAmt * Math.min(1, P.slowT / 0.4);
    if (P.hamleT > 0) sp *= 1 + S.hamleSpd;
    if (P.abilityT > 0 && RUN.jockey === 'ayse') sp *= 1.25;
    if (P.landBoostT > 0) sp *= 1 + S.landBoost;
    if (P.laneBoostT > 0) sp *= 1 + S.laneSpeed;
    if (P.slingT > 0) sp *= 1.22;
    if (P.stormT > 0) sp *= 1.08;
    if (P.cleanT > 0) sp *= 1.06;
    if (this.kick > 0) sp *= 1 + this.kick;
    if (this.fever > 0) sp *= 1.08;
    if (this.type !== 'boss' && !this.tut) {
      const k = P.dist / this.length, st = RUN.runStyle;
      if (st === 'onde') sp *= k < 0.5 ? 1.08 : k > 0.8 ? 0.96 : 1;
      else if (st === 'sondan') sp *= k < 0.5 ? 0.96 : 1;
    }
    if (this.wind.left > 0) sp *= 1 + this.wind.dir * 0.12;
    return sp;
  },
  updateObs(dt) {
    const P = this.P, S = this.S, half = 4;
    const flying = P.flyT > 0 || (P.hamleT > 0 && S.hamleAir);
    for (const o of this.obs) {
      if (o.dead) continue;
      o.t += dt; if (o.flash > 0) o.flash -= dt;
      if (o.kind === 'bale') o.y += (o.vy || -60) * dt;
      if (o.kind === 'wolf') { o.x += o.vx * dt; if (o.x < this.trackL - 20 || o.x > this.trackL + this.laneW * 5 + 20) o.dead = true; }
      if (o.kind === 'scan' && o.mt < 1) { o.mt = Math.min(1, o.mt + dt / 0.12); o.vis = lerp(o.fromVis, o.lane, Ease.outQuad(o.mt)); }
      const dy = o.y - P.dist, ly = o.ly; o.ly = dy;
      if (dy < -40) { if (o.jumped) { missionEvent('jump', 1); META.stats.jumps++; } o.dead = true; continue; }
      if (o.kind === 'rgate') { this.updateGate(o, dy, dt); continue; }
      if (!o.passed && dy < -4) {
        o.passed = true;
        if (!o.hit && SOLID[o.kind] && this.state === 'run' && P.prevLane >= o.lane && P.prevLane < o.lane + o.span && P.lane !== P.prevLane && this.time - P.laneAt < 0.4) this.nearMiss();
      }
      if (dy > 12 || dy < -10) continue;
      if (PICKUP[o.kind]) {
        const ghostHit = S.ghost && o.kind === 'coin' && o.lane === this.ghostLane && Math.abs(dy) < 8;
        if ((Math.abs(this.laneX(o.lane) - P.x) < this.laneW * 0.45 && Math.abs(dy) < 8) || ghostHit) this.collect(o);
        continue;
      }
      if (o.hit || flying || !this.overlapX(o, P.x, half)) continue;
      const depth = o.kind === 'log' ? 6 : 5;
      // a slow frame can step right over the contact band: count a crossing from in front to behind as contact
      if (Math.abs(dy) > depth && !(ly != null && ly > depth && dy < -depth)) continue;
      if (JUMPABLE[o.kind] && (P.jumping || (P.floatT > 0 && o.kind !== 'bale'))) {
        if (!o.jumped) { o.jumped = true; if (P.jumping && o.kind !== 'puddle') this.judgeJump(o); }
        continue;
      }
      if (o.kind === 'puddle') {
        o.hit = true;
        if (!S.puddleImmune && !(P.hamleT > 0 && S.hamleInv)) { P.slowT = 0.7; P.slowAmt = 0.38 * (1 - Math.min(0.8, S.slowResist)); Sound.play('splash'); }
        burst(P.x, this.pY + 4, 8, o.mud ? [C.brown, C.dbrown] : [C.sky, C.white], 40, 0.4, 80);
        continue;
      }
      if (P.hamleT > 0 && S.hamleInv) continue;
      if ((P.hamleT > 0 && S.hamleRam) || (P.abilityT > 0 && RUN.jockey === 'ayse') || this.fever > 0) { if (o.kind === 'fici') this.hitFici(o, 99); else this.breakObs(o); Sound.play('bump'); continue; }
      if (S.comboTrample && this.combo >= S.comboTrample && o.kind !== 'wolf') { if (o.kind === 'fici') this.hitFici(o, 99); else this.breakObs(o); Sound.play('bump'); shake(2, 0.1); continue; }
      if ((o.kind === 'rock' || o.kind === 'fici') && S.rockBreaker) { if (o.kind === 'fici') this.hitFici(o, 99); else this.breakObs(o); P.slowT = 0.35; P.slowAmt = 0.25; Sound.play('bump'); shake(2, 0.12); continue; }
      o.hit = true;
      if (this.hurt(o.kum ? 'kum' : o.ice ? 'icerock' : o.kind)) { if (o.kind === 'fici') this.hitFici(o, 99); else this.breakObs(o); }
    }
    if (this.obs.length > 160) this.obs = this.obs.filter(o => !o.dead);
  },
  collect(o) {
    const P = this.P, S = this.S; o.dead = true;
    if (o.kind === 'coin') {
      const groove = this.combo >= 20 ? 1.5 : this.combo >= 10 ? 1.25 : 1;
      const v = S.coinMult * groove * (S.airCoins && P.jumping ? 2 : 1) * (this.fever > 0 ? 2 : 1);
      this.coinFrac += v; const n = Math.floor(this.coinFrac); this.coinFrac -= n;
      RUN.coins += n; RUN.coinsEarned += n; this.addBond(0.6);
      if (n > 0) missionEvent('coins', RUN.coinsEarned);
      Sound.play('coin'); addPart(this.laneX(o.lane), this.pY - 4, 0, -30, 0.3, C.yellow, 1);
    } else if (o.kind === 'clover') {
      RUN.yonca++; missionEvent('yonca', 1); Sound.play('clover'); haptic('light');
      floatText('+1 KRİSTAL', P.x, this.pY - 22, C.cyan); burst(P.x, this.pY - 6, 8, [C.cyan, C.white], 40, 0.5);
    } else if (o.kind === 'heart') {
      if (RUN.hp < S.maxHp) RUN.hp++; Sound.play('heart'); floatText('+1 CAN', P.x, this.pY - 22, C.red); burst(P.x, this.pY - 6, 8, [C.red, C.salmon], 40, 0.5);
    } else if (o.kind === 'sugar') {
      RUN.seker++; Sound.play('gift'); haptic('success'); floatText('+1 ŞEKER', P.x, this.pY - 22, C.white); burst(P.x, this.pY - 6, 10, [C.white, C.lgray, C.yellow], 40, 0.5);
    }
  },
  updateTrails(dt) {
    for (const t of this.trails) {
      t.t -= dt;
      for (const f of this.foes) if (!f.dead && t.hit.indexOf(f) < 0 && Math.abs(f.x - t.x) < 9 && f.dist > t.dist - 14 && f.dist < t.dist + 26) { t.hit.push(f); this.damageFoe(f, t.dmg); }
    }
    this.trails = this.trails.filter(t => t.t > 0);
  },
  obsAhead(lane, dist, range) {
    let best = null;
    for (const o of this.obs) {
      if (o.dead || !HAZARD[o.kind] || o.kind === 'wolf') continue;
      if (lane < o.lane || lane >= o.lane + o.span) continue;
      const d = o.y - dist; if (d < -2 || d > range) continue;
      if (!best || o.y < best.y) best = o;
    }
    return best;
  },
  laneFree(lane, dist, self) {
    if (lane < 0 || lane > 4) return false;
    if (this.obs.some(o => !o.dead && SOLID[o.kind] && o.lane === lane && o.y - dist > -10 && o.y - dist < 80)) return false;
    if (this.P.lane === lane && Math.abs(this.P.dist - dist) < 20) return false;
    return !this.rivals.some(r => r !== self && !r.done && r.lane === lane && Math.abs(r.dist - dist) < 20);
  },
  updateRivals(dt) {
    const P = this.P;
    for (const r of this.rivals) {
      if (r.done) { r.dist += r.cur * 0.6 * dt; continue; }
      r.stun = Math.max(0, r.stun - dt); r.cool = Math.max(0, r.cool - dt); r.pushCd = Math.max(0, r.pushCd - dt);
      let sp = BASE_SPEED * this.reg.speed * r.spd * (1 + 0.035 * Math.sin(this.time * 0.7 + r.phase));
      const k = r.dist / this.length;
      if (r.style === 'onde') sp *= k < 0.5 ? 1.07 : k > 0.75 ? 0.95 : 1;
      else if (r.style === 'sondan') sp *= k < 0.5 ? 0.94 : k > 0.75 ? 1.09 : 1;
      if (r.duel) {
        const D = this.duel, gap = r.dist - P.dist;
        D.tauntT -= dt; D.surgeT -= dt; D.stunImm -= dt; D.blockCd -= dt;
        if (this.state === 'run') sp *= gap > 150 ? 0.92 : gap > 90 ? 0.96 : gap < -180 ? 1.18 : gap < -120 ? 1.12 : gap < -60 ? 1.06 : 1;
        if (D.surgeT > 0) sp *= 1.1;
      }
      if (r.stun > 0) sp *= 0.55;
      if (r.laneT < 1) { r.laneT = Math.min(1, r.laneT + dt / 0.22); r.x = lerp(r.fromX, this.laneX(r.lane), Ease.outQuad(r.laneT)); } else r.x = this.laneX(r.lane);
      if (r.jumping) { r.jumpT += dt; if (r.jumpT >= 0.5) r.jumping = false; }
      const ob = this.obsAhead(r.lane, r.dist, 75);
      if (ob && r.laneT >= 1) {
        if (SOLID[ob.kind] && r.cool <= 0) {
          for (const nl of R.shuffle([r.lane - 1, r.lane + 1])) if (this.laneFree(nl, r.dist, r)) { r.fromX = r.x; r.lane = nl; r.laneT = 0; r.cool = 0.3; break; }
        } else if (JUMPABLE[ob.kind] && ob.y - r.dist < 20 && !r.jumping) { r.jumping = true; r.jumpT = 0; }
      }
      // rivals hug the inner rail in bends
      const bd = this.bendAt(r.dist + 60);
      if (bd && r.cool <= 0 && r.laneT >= 1 && !ob) { const nl = r.lane + (bd < 0 ? -1 : 1); if (nl >= 0 && nl <= 4 && this.laneFree(nl, r.dist, r)) { r.fromX = r.x; r.lane = nl; r.laneT = 0; r.cool = 1.4; } }
      for (const o of this.obs) if (!o.dead && (SOLID[o.kind] || o.kind === 'scan') && o.lane === r.lane && Math.abs(o.y - r.dist) < 5 && !o.rivalHit) { o.rivalHit = true; r.stun = 0.8; }
      // shoulder barge: a short "!" warning first, so a quick lane change (or a jump) dodges it
      if (r.pushWarn > 0) {
        r.pushWarn -= dt;
        if (r.pushWarn <= 0) {
          if (this.state === 'run' && r.stun <= 0 && Math.abs(r.lane - P.lane) === 1 && Math.abs(r.dist - P.dist) < 16 && P.flyT <= 0 && !P.jumping && !this.invulnerable()) {
            if (this.S.shoulder) this.pushRival(r, r.lane - P.lane);
            else {
              P.slowT = 0.45; P.slowAmt = 0.25 * (1 - Math.min(0.8, this.S.slowResist)); P.bounce = r.lane < P.lane ? 1 : -1;
              floatText('İTTİ!', P.x, this.pY - 18, C.salmon); Sound.play('bump'); shake(2, 0.12); haptic('light');
            }
          } else if (this.state === 'run') { floatText('BOŞA ÇIKTI!', r.x, this.sy(r.dist) - 28, C.green, 1, -8, 0.7); this.rate(4); }
        }
      } else if (r.style === 'itici' && !r.duel && r.pushCd <= 0 && r.laneT >= 1 && r.stun <= 0 && this.state === 'run' && Math.abs(r.lane - P.lane) === 1 && Math.abs(r.dist - P.dist) < 12 && P.flyT <= 0) {
        r.pushCd = R.f(3, 5); r.pushWarn = 0.42; Sound.play('hey');
      }
      let front = null;
      if (P.lane === r.lane && P.dist > r.dist && P.dist - r.dist < 17) front = P.speed;
      for (const q of this.rivals) if (q !== r && !q.done && q.lane === r.lane && q.dist > r.dist && q.dist - r.dist < 17) front = Math.min(front == null ? 1e9 : front, q.cur);
      if (front != null && front < sp) {
        sp = front * 0.98;
        if (r.cool <= 0 && r.laneT >= 1) { for (const nl of R.shuffle([r.lane - 1, r.lane + 1])) if (this.laneFree(nl, r.dist, r)) { r.fromX = r.x; r.lane = nl; r.laneT = 0; r.cool = 0.8; break; } }
      }
      r.cur = sp; r.dist += sp * dt * this.cornerMult(r.lane, r.dist);
      if (r.dist >= this.length) {
        r.done = true; this.finished.push(r);
        if (r.duel && this.state === 'run') { this.banner = { txt: r.name + ' BİTİRDİ!', col: C.red }; this.bannerT = 1.6; Sound.play('hey'); }
      }
      const ahead = r.dist > P.dist;
      if (r.ahead && !ahead && this.state === 'run') { RUN.overtakes++; missionEvent('overtake', 1); this.addBond(3); this.rate(r.nem ? 10 : 5); this.say('overtake'); }
      r.ahead = ahead;
    }
  },
  updateStorm(dt) {
    const st = this.storm, P = this.P;
    const sp = BASE_SPEED * this.reg.speed * 1.05 * HEATS[RUN.heat].mult * (this.elite ? 1.04 : 1);
    st.gap = Math.min(150, st.gap + (P.speed * (P.cornerM || 1) - sp) * dt * 0.6);
    if (st.gap <= 0) { this.hurt('storm'); st.gap = 70; Sound.play('thunder'); }
  },
  updateWind(dt) {
    const w = this.wind;
    if ((this.weather !== 'ruzgar' && this.weather !== 'kumf') || this.state !== 'run') { w.left = Math.max(0, w.left - dt); return; }
    if (w.left > 0) { w.left -= dt; if (w.left <= 0) w.t = R.f(3, 6); return; }
    w.t -= dt;
    if (w.t <= 0) {
      w.dir = R.chance(0.5) ? 1 : -1; w.left = 2.2; Sound.play('whoosh');
      floatText(w.dir > 0 ? 'ARKA RÜZGAR!' : 'KARŞI RÜZGAR!', W / 2, this.pY - 74, w.dir > 0 ? C.green : C.salmon, 1, -8, 1.1);
    }
  }
};
