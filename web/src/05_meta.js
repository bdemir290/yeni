// ================= META / SAVE / UI WIDGETS =================
const SAVE_KEY = 'dortnala_save_v1';
function defaultMeta() {
  return {
    v: 5, yonca: 0, rozet: 0, seker: 0, xp: 0, level: 1, points: 0,
    skills: {},
    blv: { ev: 1, ahir: 1, pano: 1, ambar: 0, silahhane: 0, nalbant: 0, tapinak: 0, jokey: 0, veteriner: 0, bahce: 0 },
    nals: { demir: true }, nal: 'demir', foods: {}, food: null, food2: null,
    weapons: { yay: true }, weapon: 'yay', wlv: { yay: 1 },
    jockey: 'ayse', heat: 0, heatUnlocked: false, runStyle: 'dengeli', keepsake: null,
    bond: { bip: 0, ayse: 0, kemal: 0, tayfun: 0, moko: 0 },
    decor: {}, farmPerks: 0, favSpirit: null, crops: [0, 0, 0], blanket: null, blankets: {},
    missions: [], missionSeq: 0,
    stats: { runs: 0, wins: 0, bestRegion: 0, bestProgress: 0, bestCombo: 0, perfects: 0, jumps: 0, boons: 0, duos: 0, kills: 0, nearMiss: 0, drafts: 0, events: 0, golds: 0, medals: { g: 0, s: 0, b: 0 }, bossWins: {}, cleanJumps: 0, holds: 0, specials: 0, hamles: 0, reisKills: 0, kicks: 0, hammers: 0, duels: 0, revenges: 0, fevers: 0, sponsors: 0, gates: 0, betWins: 0, betOffers: 0 },
    daily: { last: '', count: 0, pending: false },
    dailyRun: { best: {}, log: [] },
    seen: {}, flags: {}, memRead: {}, tipsSeen: {}, assistLv: 0, petted: false, rivals: {}, rivalRead: {}, nemesis: null,
    settings: { music: true, sfx: true, haptics: true, shake: true, left: false, wide: false, offset: 0, assist: false, beatHaptic: false, simpleNotes: false },
    introDone: false, tutorialDone: false, runSave: null
  };
}
let META = null;
function mergeInto(def, src) {
  if (!src || typeof src !== 'object') return def;
  for (const k in def) {
    if (!(k in src)) continue;
    const dv = def[k], sv = src[k];
    if (dv && typeof dv === 'object' && !Array.isArray(dv)) def[k] = mergeInto(dv, sv);
    else if (Array.isArray(dv)) { if (Array.isArray(sv)) def[k] = sv; }
    else if (dv === null || typeof sv === typeof dv) def[k] = sv;
  }
  for (const k in src) if (!(k in def)) def[k] = src[k];
  return def;
}
function loadMeta(hot) {
  let raw = null;
  if (hot && typeof hot.save === 'string') raw = hot.save;
  if (!raw && typeof window.__NATIVE_SAVE__ === 'string' && window.__NATIVE_SAVE__.length > 2) raw = window.__NATIVE_SAVE__;
  if (!raw) { try { raw = localStorage.getItem(SAVE_KEY); } catch (e) { } }
  let obj = null;
  if (raw) { try { obj = JSON.parse(raw); } catch (e) { obj = null; } }
  META = mergeInto(defaultMeta(), obj || {});
  // migrate v1 saves (built flags) to building levels
  if (META.built) {
    for (const k in META.built) if (META.built[k] && META.blv[k] !== undefined) META.blv[k] = Math.max(META.blv[k], 1);
    if (META.vetLv) META.blv.veteriner = Math.max(META.blv.veteriner, META.vetLv);
    delete META.built; delete META.vetLv;
  }
  if (META.runSave && (!META.runSave.weapon || META.runSave.v !== 3)) META.runSave = null;
  // v4: the story moved to space. Old farm friends become station friends; the new intro and logbook play from the start.
  if (obj && (obj.v || 0) < 4) {
    const b = META.bond;
    if (b.teyze != null) { b.bip = Math.max(b.bip || 0, b.teyze); delete b.teyze; }
    if (b.hasan != null) { b.moko = Math.max(b.moko || 0, b.hasan); delete b.hasan; }
    if (META.keepsake === 'teyze') META.keepsake = 'bip'; else if (META.keepsake === 'hasan') META.keepsake = 'moko';
    if (META.flags.hasan) META.flags.moko = true;
    META.introDone = false; META.seen = {}; META.memRead = {}; META.runSave = null; META.v = 4;
  }
  // v5: two planets now sit between Mantar Ayı and the arena; move v4 region indices to their new place
  if (obj && (obj.v || 0) < 5) {
    const map = i => REGION_V4[clamp(i | 0, 0, REGION_V4.length - 1)];
    META.stats.bestRegion = map(META.stats.bestRegion);
    if (META.stats.bestProgress >= 10) META.stats.bestProgress += 10;
    const rs = META.runSave;
    if (rs) {
      rs.region = map(rs.region);
      for (const k of ['shopDone', 'restDone', 'kaosDone', 'eventCount', 'duelDone']) {
        const o = rs[k]; if (!o) continue;
        const n = {}; for (const r in o) n[map(+r)] = o[r]; rs[k] = n;
      }
      if (rs.diedIn && rs.diedIn.region != null) rs.diedIn.region = map(rs.diedIn.region);
    }
    META.v = 5;
  }
  fixCrops();
}
function saveMeta() {
  const s = JSON.stringify(META);
  try { localStorage.setItem(SAVE_KEY, s); } catch (e) { }
  try { const mh = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.save; if (mh) mh.postMessage(s); } catch (e) { }
}
const bl = k => (META.blv[k] || 0);
const built = k => bl(k) >= 1;
function plotCount() { return [0, 3, 5, 7][bl('bahce')] || 0; }
function fixCrops() { const n = Math.max(3, plotCount()); while (META.crops.length < n) META.crops.push(0); }
function npcAvailable(k) {
  if (k === 'bip' || k === 'ayse') return true;
  if (k === 'kemal') return META.rozet >= 1 && built('jokey');
  if (k === 'tayfun') return META.rozet >= 2 && built('jokey');
  if (k === 'moko') return !!META.flags.moko;
  return false;
}

function computeStats(run) {
  const S = baseStats();
  for (const sk of SKILLS) { const r = META.skills[sk.id] || 0; if (r) sk.apply(S, r); }
  (NALS[run ? run.nal : META.nal] || NALS.demir).apply(S);
  if (bl('nalbant') >= 2) S.speed *= 1.05;
  if (bl('nalbant') >= 3) S.maxHp += 1;
  (JOCKEYS[run ? run.jockey : META.jockey] || JOCKEYS.ayse).apply(S);
  if (bl('jokey') >= 2) S.bondMult = bl('jokey') >= 3 ? 1.5 : 1.25;
  const foods = run ? [run.food, run.food2] : [META.food, META.food2];
  for (const f of foods) if (f && FOODS[f]) FOODS[f].apply(S);
  const vl = bl('veteriner'); if (vl > 0) { S.revives = vl >= 3 ? 2 : 1; S.reviveHp = vl >= 2 ? 2 : 1; }
  const wk = run ? run.weapon : META.weapon;
  S.weapon = WEAPONS[wk] ? wk : 'yay';
  S.shotDmg = WEAPONS[S.weapon].dmg * (1 + 0.25 * ((META.wlv[S.weapon] || 1) - 1));
  if (bl('silahhane') >= 2) S.shotDmg *= bl('silahhane') >= 3 ? 1.4 : 1.2;
  if (bl('tapinak') >= 2) S.duoChance = 0.6;
  if (bl('tapinak') >= 3) S.luck += 0.15;
  const kp = run ? run.keepsake : META.keepsake;
  if (kp && KEEPSAKES[kp] && META.bond[kp] > 0) KEEPSAKES[kp].apply(S, META.bond[kp]);
  if (run && run.mods) for (const id of run.mods) { const m = MOD_BY_ID[id]; if (m && m.w === S.weapon) m.apply(S); }
  if (run) for (const id in run.boons) { const b = BOON_BY_ID[id]; if (b) b.apply(S, run.boons[id]); }
  if (run && run.chaos) for (const c of run.chaos) { const e = CHAOS_BY_ID[c.left > 0 ? c.curse : c.bless]; if (e) e.apply(S); }
  if (run && run.bonusMaxHp) S.maxHp += run.bonusMaxHp;
  if (run && run.shotBonus) S.shotDmg *= 1 + run.shotBonus;
  if (META.settings.assist) S.assist = Math.min(0.6, 0.2 + 0.02 * META.assistLv);
  S.maxHp = clamp(S.maxHp, 1, 12);
  if (META.settings.wide) { S.perfectWin *= 1.5; S.goodWin *= 1.3; }
  S.perfectWin = Math.min(S.perfectWin, 0.2); S.goodWin = Math.max(S.goodWin, S.perfectWin + 0.05);
  S.discount = clamp(S.discount, -1, 0.6);
  S.hamleCost = Math.max(8, S.hamleCost);
  return S;
}
const xpNeed = lv => 50 + (lv - 1) * 30;
function addXP(n) {
  const ups = []; META.xp += n;
  while (META.level < 40 && META.xp >= xpNeed(META.level)) { META.xp -= xpNeed(META.level); META.level++; META.points++; ups.push(META.level); }
  return ups;
}
function missionSlots() { return bl('pano') >= 2 ? 4 : 3; }
function newMission() {
  const tier = Math.min(3, Math.floor((META.level - 1) / 3));
  const active = META.missions.map(m => m.k);
  const pool = MISSION_POOL.filter(p => active.indexOf(p.k) < 0 && (!p.minLv || META.level >= p.minLv));
  const p = pool[Math.floor(Math.random() * pool.length)] || MISSION_POOL[0];
  const ti = Math.min(p.n.length - 1, tier);
  META.missionSeq++;
  return { id: META.missionSeq, k: p.k, n: p.n[ti], p: 0, yonca: 6 + ti * 5, xp: 25 + ti * 20, seker: (ti >= 1 && Math.random() < 0.35) ? 1 : 0, done: false };
}
function ensureMissions() { while (META.missions.length < missionSlots()) META.missions.push(newMission()); }
function missionText(m) { const p = MISSION_POOL.find(x => x.k === m.k); return p ? p.t(m.n) : '?'; }
function missionEvent(k, amount) {
  const done = [];
  for (const m of META.missions) {
    if (m.done || m.k !== k) continue;
    const p = MISSION_POOL.find(x => x.k === k);
    if (p && p.run) m.p = Math.max(m.p, amount); else m.p += amount;
    if (m.p >= m.n) { m.p = m.n; m.done = true; done.push(m); }
  }
  for (const m of done) toast('GÖREV TAMAM: ' + missionText(m), C.green, 'check');
  return done;
}
function todayStr() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
function dailySeed() { const d = new Date(); return ((d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) * 31337) >>> 0; }
function checkDaily() { if (META.daily.last !== todayStr()) META.daily.pending = true; return META.daily.pending; }
function claimDaily() {
  const idx = META.daily.count % 7, amt = DAILY[idx], sg = DAILY_SUGAR[idx];
  META.yonca += amt; META.seker += sg; META.daily.count++; META.daily.last = todayStr(); META.daily.pending = false; saveMeta();
  return { amt, sg };
}
function farmLevel() { let s = 0; for (const k in META.blv) s += META.blv[k]; return s + Object.keys(META.decor).length; }
function checkFarmPerks() {
  const earned = Math.floor(farmLevel() / 5);
  if (earned > META.farmPerks) {
    const n = earned - META.farmPerks; META.farmPerks = earned; META.points += n;
    toast('ÜS PUANI ' + farmLevel() + '! +' + n + ' SEVİYE PUANI', C.yellow, 'house'); saveMeta();
  }
}
function unlockedMemories() { return MEMORIES.filter(m => m.cond()); }
function unreadMemories() { return unlockedMemories().filter(m => !META.memRead[m.id]).length + Object.keys(META.rivals).filter(id => RIVAL_BY_ID[id] && !META.rivalRead[id]).length; }
function nextGoal() {
  if (META.daily.pending) return { text: 'GÜNLÜK ERZAĞINI AL', target: 'pano', icon: 'clover' };
  if (META.missions.some(m => m.done)) return { text: 'GÖREV ÖDÜLÜNÜ AL', target: 'pano', icon: 'check' };
  if (META.points > 0) return { text: 'AHIRDA ' + META.points + ' PUAN BEKLİYOR', target: 'ahir', icon: 'star' };
  if (unreadMemories() > 0) return { text: 'SEYİR DEFTERİNDE YENİ SAYFA', target: 'ev', icon: 'book' };
  if (built('bahce') && META.crops.slice(0, plotCount()).some(c => c > 0 && c % 10 === 3)) return { text: 'SERADA HASAT VAR', target: 'bahce', icon: 'clover' };
  if (META.seker > 0 && Object.keys(NPC_NAMES).some(k => npcAvailable(k) && META.bond[k] < 3)) return { text: 'DOSTLARINA ŞEKER HEDİYE ET', target: 'npc', icon: 'seker' };
  if (META.nemesis && RIVAL_BY_ID[META.nemesis.id]) return { text: 'RÖVANŞ: ' + RIVAL_BY_ID[META.nemesis.id].name, target: 'gate', icon: 'crown' };
  for (const k of BUILD_ORDER) {
    if (built(k)) continue;
    const b = BUILDINGS[k];
    if (b.rozet && META.rozet < b.rozet) continue;
    if (b.needBoon && META.stats.boons === 0) continue;
    return { text: b.name + ' ONAR', target: k, cur: META.yonca, need: b.up[0], icon: 'hammer' };
  }
  if (!META.stats.bossWins.pirlanta) return { text: 'PRENS KRİSTALO\'YU YEN', target: 'gate', icon: 'crown' };
  if (!built('jokey')) return { text: 'JOKEY KOĞUŞUNU ONAR', target: 'jokey', cur: META.yonca, need: BUILDINGS.jokey.up[0], icon: 'hammer' };
  for (const k of ['silahhane', 'ahir', 'pano', 'nalbant', 'veteriner', 'jokey', 'bahce', 'tapinak', 'ambar']) {
    const b = BUILDINGS[k], lv = bl(k);
    if (lv >= 1 && lv < b.max) return { text: b.name + ' SEVİYE ' + (lv + 1), target: k, cur: META.yonca, need: b.up[lv], icon: 'hammer' };
  }
  if (!META.stats.bossWins.kurt) return { text: 'ULUYAN GORM\'U YEN', target: 'gate', icon: 'crown' };
  if (!META.stats.bossWins.niva) return { text: 'BUZ KRALİÇESİ NİVA\'YI YEN', target: 'gate', icon: 'crown' };
  if (!META.stats.bossWins.zarg) return { text: 'KUM SOLUCANI ZARG\'I YEN', target: 'gate', icon: 'crown' };
  if (!META.stats.wins) return { text: 'GALAKSİ KUPASINI KAZAN', target: 'gate', icon: 'crown' };
  return { text: 'ZOR PİSTTE KUPAYI KAZAN', target: 'gate', icon: 'crown' };
}

// ---------- FX ----------
const FX = { parts: [], texts: [], shakeT: 0, shakeMag: 0, flashT: 0, flashMax: 1, flashCol: null, freeze: 0 };
function addPart(x, y, vx, vy, life, color, size, grav) { if (FX.parts.length < 400) FX.parts.push({ x, y, vx, vy, life, max: life, color, size: size || 1, grav: grav || 0 }); }
function burst(x, y, n, color, speed, life, grav, size) {
  for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = speed * (0.35 + Math.random() * 0.65); addPart(x, y, Math.cos(a) * s, Math.sin(a) * s, life * (0.6 + Math.random() * 0.4), Array.isArray(color) ? color[i % color.length] : color, size, grav); }
}
function floatText(str, x, y, color, scale, vy, life) { FX.texts.push({ str, x, y, color, scale: scale || 1, vy: vy == null ? -20 : vy, life: life || 0.9, max: life || 0.9 }); }
function shake(mag, t) { if (META && !META.settings.shake) return; FX.shakeMag = Math.max(FX.shakeMag, mag); FX.shakeT = Math.max(FX.shakeT, t); }
function flash(col, t) { FX.flashCol = col; FX.flashT = t; FX.flashMax = t; }
function clearFX() { FX.parts.length = 0; FX.texts.length = 0; FX.shakeT = 0; FX.flashT = 0; FX.freeze = 0; }
function updateFX(dt) {
  for (let i = FX.parts.length - 1; i >= 0; i--) { const p = FX.parts[i]; p.life -= dt; if (p.life <= 0) { FX.parts.splice(i, 1); continue; } p.vy += p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
  for (let i = FX.texts.length - 1; i >= 0; i--) { const t = FX.texts[i]; t.life -= dt; if (t.life <= 0) { FX.texts.splice(i, 1); continue; } t.y += t.vy * dt; t.vy *= 0.92; }
  if (FX.shakeT > 0) FX.shakeT -= dt;
  if (FX.flashT > 0) FX.flashT -= dt;
}
function shakeOffset() { if (FX.shakeT <= 0) return [0, 0]; const m = FX.shakeMag * Math.min(1, FX.shakeT * 4); return [Math.round((Math.random() * 2 - 1) * m), Math.round((Math.random() * 2 - 1) * m)]; }
function drawParts(ox, oy) { for (const p of FX.parts) { const a = clamp(p.life / p.max * 1.6, 0, 1); g.globalAlpha = a; rect(p.x + (ox || 0), p.y + (oy || 0), p.size, p.size, p.color); } g.globalAlpha = 1; }
function drawTexts() { for (const t of FX.texts) { g.globalAlpha = clamp(t.life / t.max * 2.2, 0, 1); textO(t.str, t.x, t.y, t.color, 'center', t.scale); } g.globalAlpha = 1; }
function drawFlash() { if (FX.flashT > 0 && FX.flashCol) { g.globalAlpha = clamp(FX.flashT / FX.flashMax, 0, 1) * 0.45; rect(0, 0, W, H, FX.flashCol); g.globalAlpha = 1; } }

// ---------- toasts ----------
const TOASTS = [];
function toast(str, color, icon) { TOASTS.push({ str, color: color || C.white, icon, t: 0 }); if (TOASTS.length > 3) TOASTS.shift(); }
function drawToasts(dt) {
  let y = SAFE.t + 62;
  for (let i = 0; i < TOASTS.length; i++) {
    const t = TOASTS[i]; t.t += dt;
    if (t.t > 2.6) { TOASTS.splice(i, 1); i--; continue; }
    const k = t.t < 0.2 ? Ease.outBack(t.t / 0.2) : t.t > 2.3 ? 1 - (t.t - 2.3) / 0.3 : 1;
    const lines = wrapText(t.str, W - 44);
    const w = Math.min(W - 16, Math.max(...lines.map(l => textWidth(l))) + (t.icon ? 26 : 14));
    const h = lines.length * 9 + 8;
    const x = Math.round(W / 2 - w / 2), yy = Math.round(y - (1 - k) * 20);
    g.globalAlpha = clamp(k, 0, 1);
    rrect(x - 1, yy - 1, w + 2, h + 2, C.ink); rrect(x, yy, w, h, C.navy); hline(x + 1, yy, w - 2, t.color);
    if (t.icon && ICONS[t.icon]) spr(ICONS[t.icon], x + 4, yy + Math.round(h / 2 - ICONS[t.icon].height / 2));
    lines.forEach((ln, j) => text(ln, x + (t.icon ? 18 : 7), yy + 2 + j * 9, t.color));
    g.globalAlpha = 1;
    y += h + 4;
  }
}

// ---------- widgets ----------
function panel(x, y, w, h, title, titleCol) {
  x = Math.round(x); y = Math.round(y);
  g.globalAlpha = 0.5; rect(x + 2, y + 3, w, h, C.ink); g.globalAlpha = 1;
  rrect(x - 1, y - 1, w + 2, h + 2, C.ink); rrect(x, y, w, h, C.navy);
  hline(x + 2, y + 1, w - 4, C.slate);
  if (title) { rect(x + 1, y + 1, w - 2, 13, C.slate); hline(x + 1, y + 14, w - 2, C.ink); text(title, x + w / 2, y + 3, titleCol || C.yellow, 'center'); }
}
const BTN_COLS = {
  primary: [C.gold, C.yellow, C.orange0, C.ink], green: [C.dgreen, C.green, C.ddgreen, C.white],
  secondary: [C.slate, C.dgray, C.navy, C.white], red: [C.wine, C.red, C.plum, C.white],
  disabled: [C.slate, C.slate, C.navy, C.dgray], blue: [C.blue, C.sky, C.navy, C.white]
};
function button(id, x, y, w, h, label, fn, opts) {
  opts = opts || {}; x = Math.round(x); y = Math.round(y);
  const pressed = UI.pressed === id;
  const [b, l, d, tc] = BTN_COLS[opts.disabled ? 'disabled' : (opts.kind || 'primary')];
  const oy = pressed ? 1 : 0;
  rrect(x - 1, y - 1, w + 2, h + 2, C.ink);
  rect(x, y, w, h, d);
  rect(x, y + oy, w, h - 2, b); hline(x + 1, y + oy, w - 2, l);
  const ic = opts.icon && ICONS[opts.icon];
  const lw = label ? textWidth(label, opts.scale || 1) : 0;
  const total = lw + (ic ? ic.width + (label ? 3 : 0) : 0);
  let cx = x + Math.round(w / 2 - total / 2);
  const cy = y + oy + Math.round((h - 2) / 2);
  if (ic) { spr(ic, cx, cy - Math.floor(ic.height / 2)); cx += ic.width + 3; }
  if (label) text(label, cx, cy - 4 * (opts.scale || 1), opts.disabled ? C.dgray : tc, 'left', opts.scale || 1);
  if (opts.disabled) UI.add(id, x, y, w, h, () => { Sound.play('deny'); if (opts.onDeny) opts.onDeny(); }, { deny: true });
  else UI.add(id, x, y, w, h, fn, opts);
}
function iconBtn(id, x, y, icon, fn, size) {
  size = size || 15; const pressed = UI.pressed === id;
  rrect(x - 1, y - 1, size + 2, size + 2, C.ink); rrect(x, y + (pressed ? 1 : 0), size, size - (pressed ? 1 : 0), C.slate); hline(x + 1, y + (pressed ? 1 : 0), size - 2, C.dgray);
  const ic = ICONS[icon]; if (ic) spr(ic, x + Math.round(size / 2 - ic.width / 2), y + (pressed ? 1 : 0) + Math.round(size / 2 - ic.height / 2));
  UI.add(id, x - 3, y - 3, size + 6, size + 6, fn);
}
function bar(x, y, w, h, frac, col, bg) { rect(x - 1, y - 1, w + 2, h + 2, C.ink); rect(x, y, w, h, bg || C.slate); rect(x, y, Math.round(w * clamp(frac, 0, 1)), h, col); if (h > 2) hline(x, y, Math.round(w * clamp(frac, 0, 1)), 'rgba(255,255,255,0.35)'); }
function iconNum(icon, n, x, y, col) { const ic = ICONS[icon]; spr(ic, x, y); return text(String(n), x + ic.width + 2, y + Math.round(ic.height / 2) - 5, col || C.white) + ic.width + 2; }
function triDown(x, y, c) { hline(x, y, 5, c); hline(x + 1, y + 1, 3, c); pix(x + 2, y + 2, c); }

// ---------- dialog ----------
const Dialog = {
  queue: [], cur: null, chars: 0, onDone: null, lines: null,
  start(lines, onDone) { this.queue = lines.slice(); this.onDone = onDone || null; this.next(); },
  next() {
    this.cur = this.queue.shift() || null; this.chars = 0; this.lines = null;
    if (!this.cur) { const d = this.onDone; this.onDone = null; if (d) d(); }
  },
  active() { return !!this.cur; },
  update(dt) {
    if (!this.cur) return;
    const full = trUp(this.cur[1]).length;
    const prev = Math.floor(this.chars);
    this.chars = Math.min(full, this.chars + dt * 48);
    if (Math.floor(this.chars) !== prev && Math.floor(this.chars) % 4 === 0) Sound.play('talk');
  },
  draw() {
    if (!this.cur) return;
    const [who, txt] = this.cur;
    const bw = Math.min(W - 12, 240), x = Math.round(W / 2 - bw / 2);
    if (!this.lines) this.lines = wrapText(txt, bw - 50);
    const bh = Math.max(46, 20 + this.lines.length * 9 + 6), y = H - SAFE.b - bh - 10;
    UI.block(0, 0, W, H, () => { const full = trUp(txt).length; if (this.chars < full) this.chars = full; else { Sound.play('click'); this.next(); } });
    g.globalAlpha = 0.35; rect(0, 0, W, H, C.ink); g.globalAlpha = 1;
    panel(x, y, bw, bh);
    rect(x + 5, y + 6, 30, 30, C.ink); rect(x + 6, y + 7, 28, 28, C.slate);
    if (PORTRAIT[who]) spr(PORTRAIT[who], x + 6, y + 7);
    text(SPEAKERS[who] || who, x + 41, y + 4, C.yellow);
    let left = Math.floor(this.chars);
    this.lines.forEach((ln, i) => { if (left <= 0) return; const s = ln.slice(0, left); left -= ln.length + 1; text(s, x + 41, y + 15 + i * 9, C.white); });
    if (this.chars >= trUp(txt).length && Math.floor(T * 3) % 2 === 0) triDown(x + bw - 11, y + bh - 8, C.yellow);
  }
};

// ---------- transitions ----------
const SCENES = {};
const Trans = { t: 0, dir: 0, next: null, arg: null };
function go(name, arg) { if (Trans.dir === 1) return; Trans.dir = 1; Trans.t = 0; Trans.next = name; Trans.arg = arg; }
function goNow(name, arg) {
  clearFX(); UI.pressed = null;
  scene = SCENES[name]; scene.name = name;
  if (scene.enter) scene.enter(arg);
}
function updateTrans(dt) {
  if (Trans.dir === 1) { Trans.t += dt / 0.2; if (Trans.t >= 1) { Trans.t = 1; goNow(Trans.next, Trans.arg); Trans.dir = -1; } }
  else if (Trans.dir === -1) { Trans.t -= dt / 0.25; if (Trans.t <= 0) { Trans.t = 0; Trans.dir = 0; } }
}
function drawTrans() {
  if (Trans.t <= 0) return;
  const k = Trans.t;
  for (let y = 0; y < H; y += 10) rect(0, y, W, Math.ceil(10 * k), C.ink);
  if (Trans.dir) UI.block(0, 0, W, H, null);
}
