// ================= AUDIO =================
const Sound = {
  ac: null, master: null, music: null, sfx: null, noiseBuf: null, pulse: null, unlocked: false,
  unlock() {
    if (!this.ac) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      try { this.ac = new AC(); } catch (e) { return; }
      const ac = this.ac;
      this.master = ac.createGain(); this.master.gain.value = 0.9; this.master.connect(ac.destination);
      this.music = ac.createGain(); this.music.connect(this.master);
      this.sfx = ac.createGain(); this.sfx.connect(this.master);
      const len = ac.sampleRate; const b = ac.createBuffer(1, len, ac.sampleRate); const d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noiseBuf = b;
      const n = 32, real = new Float32Array(n), imag = new Float32Array(n), duty = 0.25;
      for (let k = 1; k < n; k++) real[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * duty);
      try { this.pulse = ac.createPeriodicWave(real, imag); } catch (e) { this.pulse = null; }
      this.applySettings();
    }
    if (this.ac.state !== 'running') { try { this.ac.resume(); } catch (e) { } }
    if (!this.unlocked) {
      try { const s = this.ac.createBufferSource(); s.buffer = this.ac.createBuffer(1, 1, 22050); s.connect(this.ac.destination); s.start(0); this.unlocked = true; } catch (e) { }
    }
  },
  applySettings() {
    if (!this.ac) return;
    this.music.gain.value = META.settings.music ? 0.32 : 0;
    this.sfx.gain.value = META.settings.sfx ? 0.6 : 0;
  },
  ok() { return !!(this.ac && this.ac.state === 'running'); },
  at(perfT) { return this.ac.currentTime + Math.max(0, perfT - now()); },
  latency() { if (!this.ac) return 0; return Math.min(0.12, (this.ac.outputLatency || 0) + (this.ac.baseLatency || 0)); },
  tone(freq, dur, type, vol, t0, slideTo, dest) {
    if (!this.ok()) return; const ac = this.ac; t0 = t0 || ac.currentTime;
    const o = ac.createOscillator(), gn = ac.createGain();
    if (type === 'pulse' && this.pulse) o.setPeriodicWave(this.pulse); else o.type = (type === 'pulse' ? 'square' : type) || 'square';
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gn.gain.setValueAtTime(0.0001, t0);
    gn.gain.exponentialRampToValueAtTime(vol, t0 + 0.006);
    gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(gn); gn.connect(dest || this.sfx); o.start(t0); o.stop(t0 + dur + 0.03);
  },
  voice(freq, dur, type, vol, t0, dest) {
    if (!this.ok()) return; const ac = this.ac;
    const o = ac.createOscillator(), gn = ac.createGain();
    if (type === 'pulse' && this.pulse) o.setPeriodicWave(this.pulse); else o.type = (type === 'pulse' ? 'square' : type);
    o.frequency.setValueAtTime(freq, t0);
    gn.gain.setValueAtTime(0.0001, t0);
    gn.gain.exponentialRampToValueAtTime(vol, t0 + 0.006);
    gn.gain.exponentialRampToValueAtTime(vol * 0.6, t0 + Math.min(dur, 0.08));
    gn.gain.setValueAtTime(vol * 0.6, t0 + Math.max(0.01, dur - 0.03));
    gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 0.04);
    o.connect(gn); gn.connect(dest || this.music); o.start(t0); o.stop(t0 + dur + 0.06);
  },
  noise(dur, vol, t0, ftype, freq, dest, q) {
    if (!this.ok()) return; const ac = this.ac; t0 = t0 || ac.currentTime;
    const s = ac.createBufferSource(); s.buffer = this.noiseBuf;
    const f = ac.createBiquadFilter(); f.type = ftype || 'lowpass'; f.frequency.value = freq || 1000; if (q) f.Q.value = q;
    const gn = ac.createGain(); gn.gain.setValueAtTime(vol, t0); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(gn); gn.connect(dest || this.sfx);
    s.start(t0, Math.random() * 0.5); s.stop(t0 + dur + 0.03);
  },
  kick(t, dest) {
    if (!this.ok()) return; const ac = this.ac;
    const o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine';
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    gn.gain.setValueAtTime(0.7, t); gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(gn); gn.connect(dest || this.music); o.start(t); o.stop(t + 0.2);
  },
  hoof(t, dest, vol) {
    vol = vol || 0.32;
    this.noise(0.045, vol, t, 'bandpass', 2000, dest, 4);
    this.noise(0.04, vol * 0.7, t + 0.07, 'bandpass', 1500, dest, 4);
  },
  play(name, arg) {
    if (!this.ok()) return;
    const t = this.ac.currentTime;
    switch (name) {
      case 'click': this.tone(1400, 0.03, 'square', 0.06, t); break;
      case 'select': this.tone(880, 0.05, 'pulse', 0.1, t); this.tone(1320, 0.06, 'pulse', 0.08, t + 0.04); break;
      case 'lane': this.noise(0.06, 0.1, t, 'bandpass', 3000, null, 2); break;
      case 'jump': this.tone(330, 0.15, 'pulse', 0.16, t, 760); break;
      case 'land': this.noise(0.08, 0.35, t, 'lowpass', 420); break;
      case 'coin': this.tone(1319, 0.05, 'square', 0.09, t); this.tone(1760, 0.09, 'square', 0.09, t + 0.05); break;
      case 'clover': [1047, 1319, 1568, 2093].forEach((f, i) => this.tone(f, 0.12, 'triangle', 0.2, t + i * 0.05)); break;
      case 'heart': [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, 0.12, 'triangle', 0.2, t + i * 0.06)); break;
      case 'hit': this.noise(0.25, 0.6, t, 'lowpass', 900); this.tone(200, 0.25, 'square', 0.16, t, 60); break;
      case 'bump': this.noise(0.07, 0.35, t, 'lowpass', 700); this.tone(240, 0.06, 'square', 0.08, t); break;
      case 'perfect': { const p = Math.pow(2, Math.min(arg || 0, 12) / 24); this.tone(1568 * p, 0.08, 'triangle', 0.22, t); this.tone(2093 * p, 0.1, 'triangle', 0.13, t + 0.025); break; }
      case 'good': this.tone(1175, 0.07, 'triangle', 0.16, t); break;
      case 'miss': this.tone(150, 0.08, 'square', 0.08, t, 110); break;
      case 'combo': this.tone(1047, 0.06, 'pulse', 0.14, t); this.tone(1568, 0.12, 'pulse', 0.14, t + 0.06); this.tone(2093, 0.14, 'triangle', 0.12, t + 0.12); break;
      case 'power': [523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.14, 'pulse', 0.13, t + i * 0.06)); break;
      case 'heal': [784, 988, 1175].forEach((f, i) => this.tone(f, 0.18, 'triangle', 0.18, t + i * 0.09)); break;
      case 'buy': this.tone(988, 0.06, 'square', 0.1, t); this.tone(1319, 0.06, 'square', 0.1, t + 0.06); this.tone(1976, 0.12, 'square', 0.08, t + 0.12); break;
      case 'deny': this.tone(220, 0.12, 'square', 0.1, t); this.tone(196, 0.16, 'square', 0.1, t + 0.1); break;
      case 'door': this.tone(523, 0.07, 'pulse', 0.12, t); this.tone(784, 0.1, 'pulse', 0.12, t + 0.07); break;
      case 'win': [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.16, 'pulse', 0.15, t + i * 0.11)); this.tone(1319, 0.5, 'triangle', 0.18, t + 0.46); this.tone(1047, 0.5, 'pulse', 0.1, t + 0.46); break;
      case 'lose': [392, 330, 262, 196].forEach((f, i) => this.tone(f, 0.25, 'triangle', 0.18, t + i * 0.18)); break;
      case 'warn': this.tone(880, 0.1, 'square', 0.1, t); this.tone(660, 0.1, 'square', 0.1, t + 0.14); break;
      case 'thunder': this.noise(0.9, 0.7, t, 'lowpass', 280); this.noise(0.15, 0.4, t, 'highpass', 3000); break;
      case 'splash': this.noise(0.2, 0.32, t, 'highpass', 1800); break;
      case 'dash': this.noise(0.3, 0.35, t, 'bandpass', 900, null, 1); this.tone(220, 0.25, 'sawtooth', 0.06, t, 880); break;
      case 'roar': this.tone(120, 0.45, 'sawtooth', 0.13, t, 70); this.noise(0.4, 0.2, t, 'lowpass', 500); break;
      case 'level': [523, 784, 1047, 1568, 2093].forEach((f, i) => this.tone(f, 0.16, 'triangle', 0.18, t + i * 0.07)); break;
      case 'repair': for (let i = 0; i < 4; i++) this.noise(0.05, 0.4, t + i * 0.12, 'bandpass', 2500, null, 6); this.tone(1047, 0.3, 'triangle', 0.15, t + 0.5); this.tone(1568, 0.4, 'triangle', 0.15, t + 0.6); break;
      case 'hoof': this.hoof(t, null, 0.25); break;
      case 'squeak': this.tone(1400, 0.06, 'triangle', 0.12, t, 1900); this.tone(1700, 0.08, 'triangle', 0.1, t + 0.08, 2300); break;
      case 'anvil': for (const d of [0, 0.2]) { this.tone(1760, 0.2, 'square', 0.08, t + d, 1650); this.tone(2637, 0.14, 'triangle', 0.08, t + d); this.noise(0.05, 0.3, t + d, 'highpass', 5000); } break;
      case 'revive': [262, 392, 523, 784, 1047, 1568].forEach((f, i) => this.tone(f, 0.2, 'triangle', 0.2, t + i * 0.07)); break;
      case 'talk': this.tone(500 + Math.random() * 300, 0.03, 'pulse', 0.05, t); break;
      case 'shoot': this.tone(260, 0.07, 'triangle', 0.14, t, 140); this.noise(0.05, 0.12, t, 'highpass', 4000); break;
      case 'bolt': this.tone(170, 0.09, 'square', 0.1, t, 80); this.noise(0.07, 0.18, t, 'bandpass', 1500); break;
      case 'pebble': this.tone(900, 0.03, 'square', 0.05, t, 600); break;
      case 'cannon': this.noise(0.35, 0.6, t, 'lowpass', 280); this.tone(90, 0.28, 'sawtooth', 0.14, t, 40); break;
      case 'boom': this.noise(0.4, 0.55, t, 'lowpass', 400); this.tone(70, 0.3, 'square', 0.1, t, 35); break;
      case 'ehit': this.tone(620, 0.04, 'square', 0.08, t, 320); break;
      case 'edie': this.noise(0.16, 0.32, t, 'bandpass', 1200); this.tone(420, 0.1, 'square', 0.08, t, 110); break;
      case 'caw': this.tone(760, 0.1, 'sawtooth', 0.06, t, 520); this.tone(700, 0.1, 'sawtooth', 0.05, t + 0.13, 480); break;
      case 'grunt': this.tone(115, 0.16, 'sawtooth', 0.1, t, 80); break;
      case 'hey': this.tone(330, 0.08, 'square', 0.08, t, 440); this.tone(440, 0.12, 'square', 0.08, t + 0.08, 380); break;
      case 'cheer': this.noise(1.4, 0.22, t, 'bandpass', 1300, null, 0.4); this.noise(1.2, 0.12, t + 0.2, 'bandpass', 2400, null, 0.6); break;
      case 'whoosh': this.noise(0.35, 0.3, t, 'bandpass', 700, null, 0.8); this.tone(300, 0.3, 'triangle', 0.06, t, 900); break;
      case 'medal': [1047, 1319, 1568, 2093, 2637].forEach((f, i) => this.tone(f, 0.12, 'triangle', 0.16, t + i * 0.05)); break;
      case 'nearmiss': this.noise(0.08, 0.16, t, 'highpass', 3000); this.tone(1760, 0.07, 'triangle', 0.1, t + 0.04); break;
      case 'nicker': [520, 600, 480, 560, 440].forEach((f, i) => this.tone(f, 0.05, 'square', 0.05, t + i * 0.05)); break;
      case 'bark': for (const d of [0, 0.18]) { this.noise(0.06, 0.35, t + d, 'bandpass', 800); this.tone(320, 0.07, 'square', 0.08, t + d, 200); } break;
      case 'chaos': this.tone(110, 0.7, 'sawtooth', 0.09, t, 55); this.tone(165, 0.7, 'sawtooth', 0.05, t, 82); break;
      case 'page': this.noise(0.12, 0.14, t, 'highpass', 2500); break;
      case 'gift': [880, 1175, 1568, 1760].forEach((f, i) => this.tone(f, 0.14, 'triangle', 0.15, t + i * 0.07)); break;
      case 'harvest': [523, 659, 784].forEach((f, i) => this.tone(f, 0.1, 'pulse', 0.12, t + i * 0.05)); this.noise(0.05, 0.2, t, 'bandpass', 2000); break;
      case 'sling': this.noise(0.25, 0.3, t, 'bandpass', 1500, null, 1); this.tone(440, 0.2, 'triangle', 0.1, t, 1200); break;
      case 'gate': [1047, 1568, 2093].forEach((f, i) => this.tone(f, 0.1, 'triangle', 0.14, t + i * 0.04)); this.noise(0.15, 0.12, t, 'highpass', 4000); break;
      case 'zap': this.tone(180, 0.25, 'sawtooth', 0.12, t, 60); this.noise(0.2, 0.3, t, 'bandpass', 600, null, 1); break;
    }
  }
};

// ---------- music ----------
const NOTE_BASE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function noteMidi(n) { const m = /^([A-G])(#|b)?(\d)$/.exec(n); if (!m) return 60; let v = NOTE_BASE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); return v + (parseInt(m[3], 10) + 1) * 12; }
function parseTrack(str, inst, ev) {
  for (const tok of str.trim().split(/\s+/)) { const [st, nt, ln] = tok.split(':'); const s = parseInt(st, 10); (ev[s] = ev[s] || []).push([inst, noteMidi(nt), parseInt(ln || '1', 10)]); }
}
const SONGS = {
  farm: {
    bpm: 96, len: 64,
    lead: '0:B4:4 4:D5:4 8:G5:6 14:F#5:2 16:E5:4 20:C5:4 24:E5:4 28:D5:4 32:D5:4 36:A4:4 40:F#4:4 44:A4:4 48:G4:8 56:B4:4 60:D5:4',
    bass: '0:G2:6 8:D3:6 16:C3:6 24:G2:6 32:D3:6 40:A2:6 48:G2:6 56:D3:6',
    pad: '0:D4:7 16:E4:7 32:F#4:7 48:D4:7',
    drums: { h: '..x...x...x...x.', k: 'x.......x.......' }
  },
  cayir: {
    bpm: 120, len: 64,
    lead: '0:A4:2 2:B4:2 4:A4:2 6:F#4:2 8:D5:4 12:A4:4 16:B4:2 18:D5:2 20:B4:2 22:G4:2 24:A4:4 28:B4:4 32:C#5:2 34:E5:2 36:C#5:2 38:A4:2 40:B4:4 44:C#5:2 46:E5:2 48:D5:4 52:F#5:2 54:E5:2 56:D5:6',
    bass: '0:D2:2 4:D3:2 8:D2:2 12:D3:2 16:G2:2 20:G3:2 24:G2:2 28:G3:2 32:A2:2 36:A3:2 40:A2:2 44:A3:2 48:D2:2 52:D3:2 56:D2:2 60:A2:2',
    drums: { k: 'x...x...x...x...', h: '..x...x...x...x.', s: '........x.......' }
  },
  orman: {
    bpm: 128, len: 64,
    lead: '0:A4:2 2:Bb4:2 4:C#5:4 8:D5:2 10:C#5:2 12:Bb4:2 14:A4:2 16:G4:2 18:A4:2 20:Bb4:4 24:A4:6 32:E5:2 34:D5:2 36:C#5:2 38:Bb4:2 40:C#5:4 44:A4:4 48:Bb4:2 50:A4:2 52:G4:2 54:F4:2 56:E4:4 60:A4:4',
    bass: '0:A1:2 4:A2:2 6:E2:2 8:A1:2 12:A2:2 16:A1:2 20:A2:2 24:G1:2 28:G2:2 32:A1:2 36:A2:2 38:E2:2 40:A1:2 44:A2:2 48:Bb1:2 52:Bb2:2 56:A1:2 60:E2:2',
    drums: { k: 'x...x...x...x...', h: 'x.x.x.x.x.x.x.x.', s: '....x.......x...' }
  },
  hipodrom: {
    bpm: 136, len: 64,
    lead: '0:E5:2 2:F5:2 4:E5:2 6:D5:2 8:C5:2 10:B4:2 12:C5:4 16:B4:2 18:A4:2 20:G#4:2 22:A4:2 24:B4:8 32:E5:2 34:F5:2 36:E5:2 38:C5:2 40:D5:2 42:C5:2 44:B4:4 48:A4:2 50:G#4:2 52:F4:2 54:G#4:2 56:E4:8',
    bass: '0:E2:1 2:E2:1 4:E3:1 6:E2:1 8:F2:1 10:F2:1 12:E2:1 14:E2:1 16:E2:1 18:E2:1 20:E3:1 22:E2:1 24:D2:1 26:D2:1 28:E2:1 30:E2:1 32:E2:1 34:E2:1 36:E3:1 38:E2:1 40:F2:1 42:F2:1 44:E2:1 46:E2:1 48:A1:1 50:A1:1 52:G#1:1 54:G#1:1 56:E2:1 58:E2:1 60:E2:1 62:B1:1',
    drums: { k: 'x...x...x...x...', h: 'xxx.xxx.xxx.xxx.', s: '....x.......x..x' }
  }
};
(function buildSongs() {
  for (const k in SONGS) {
    const s = SONGS[k]; s.ev = {};
    parseTrack(s.lead, 'L', s.ev); parseTrack(s.bass, 'B', s.ev); if (s.pad) parseTrack(s.pad, 'P', s.ev);
  }
})();
const Music = {
  song: null, key: null, playing: false, start: 0, step: 0, stepDur: 0.125, boss: false, timer: null, layer: 3, fever: false,
  play(key, startPerf, boss) {
    const s = SONGS[key]; if (!s) return;
    this.song = s; this.key = key; this.boss = !!boss; this.stepDur = 60 / s.bpm / 4;
    this.start = startPerf; this.step = 0; this.playing = true;
    if (!this.timer) this.timer = setInterval(() => this.tick(), 40);
    this.tick();
  },
  stop() { this.playing = false; },
  tick() {
    if (!this.playing || !Sound.ok()) return;
    const tnow = now(), ahead = tnow + 0.16;
    let guard = 0;
    while (guard++ < 64) {
      const tPerf = this.start + this.step * this.stepDur;
      if (tPerf > ahead) break;
      if (tPerf >= tnow - 0.03) this.scheduleStep(this.step, Sound.at(tPerf));
      this.step++;
    }
  },
  scheduleStep(step, t) {
    const s = this.song, st = step % s.len;
    const evs = s.ev[st], L = this.key === 'farm' ? 3 : this.layer;
    if (evs) for (const e of evs) { if (e[0] === 'L' && L < 2) continue; this.note(e, t); if (e[0] === 'L' && L >= 3) Sound.voice(440 * Math.pow(2, (e[1] + 12 - 69) / 12), e[2] * this.stepDur * 0.9, 'triangle', 0.05, t); }
    for (const k in s.drums) {
      const pat = s.drums[k], ch = pat[st % pat.length];
      if (ch === '.') continue;
      if ((k === 'h' && L < 1) || (k === 's' && L < 2)) continue;
      if (k === 'k') Sound.kick(t, Sound.music);
      else if (k === 'h') Sound.noise(0.03, 0.12, t, 'highpass', 7000, Sound.music);
      else if (k === 's') { Sound.noise(0.12, 0.28, t, 'bandpass', 1800, Sound.music, 0.8); }
    }
    if (this.key !== 'farm' && st % 4 === 0 && META && !META.settings.music) Sound.hoof(t, Sound.sfx, 0.22);
    if (this.boss) { if (st % 4 === 2) Sound.noise(0.04, 0.12, t, 'highpass', 5000, Sound.music); if (st % 16 === 0) Sound.voice(55, this.stepDur * 3, 'sawtooth', 0.08, t, Sound.music); }
    // Dörtnal mode: 16th-note hats and the lead doubled an octave up
    if (this.fever && this.key !== 'farm') {
      if (st % 2 === 1) Sound.noise(0.02, 0.07, t, 'highpass', 9000, Sound.music);
      if (evs) for (const e of evs) if (e[0] === 'L') Sound.voice(440 * Math.pow(2, (e[1] + 12 - 69) / 12), e[2] * this.stepDur * 0.8, 'pulse', 0.05, t);
    }
  },
  note(e, t) {
    const [inst, m, l] = e; const f = 440 * Math.pow(2, (m - 69) / 12); const dur = l * this.stepDur * 0.92;
    if (inst === 'L') Sound.voice(f, dur, 'pulse', 0.14, t);
    else if (inst === 'B') Sound.voice(f, dur, 'triangle', 0.3, t);
    else if (inst === 'P') Sound.voice(f, dur, 'triangle', 0.08, t);
  }
};
// beat clock (perf time domain)
const Beat = {
  bpm: 120, t0: 0,
  set(bpm, t0) { this.bpm = bpm; this.t0 = t0; },
  get iv() { return 60 / this.bpm; },
  lat() { return Sound.latency() + ((META && META.settings.offset) || 0) / 1000; },
  pos(t) { return (t - this.t0 - this.lat()) / this.iv; }
};
