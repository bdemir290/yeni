// ================= SPRITES v2: weapons, foes, new buildings, decor =================
const ICON2_ROWS = {
  w_yay: ['.bb.....', 'b..s....', 'b...s...', 'b....s..', 'b....s..', 'b...s...', 'b..s....', '.bb.....'],
  w_tatar: ['...g....', 'bbbgbbb.', 'b..g..b.', '...g....', '...b....', '...b....', '..bbb...'],
  w_sapan: ['b.....b', 'brrrrrb', '.b...b.', '..bbb..', '...b...', '...b...', '..bbb..'],
  w_top: ['..gggg..', '.gddddg.', 'gddddddg', 'gddddddg', '.gddddg.', 'bbggggbb', '.b....b.'],
  seker: ['..wwww', '.wwwwg', 'wwwwgg', 'llllgg', 'llllg.', 'llll..'],
  gift: ['.r..r.', '..rr..', 'yyrryy', 'yyrryy', 'yyrryy', 'yyrryy'],
  book: ['bbbbbbb', 'bwwbwwb', 'bwwbwwb', 'bwwbwwb', 'bwwbwwb', 'bbbbbbb'],
  swirl: ['.ppppp.', 'p.....p', 'p.ppp.p', 'p.p.p.p', 'p.p...p', 'p.pppp.', '.p.....'],
  scroll: ['.ssss..', 's.ww.s.', '.swwws.', '.swwws.', '.swwws.', '.s.ww.s', '..ssss.'],
  rain: ['.cccc.', 'cccccc', '.cccc.', 'b.b.b.', '.b.b.b', 'b.b.b.'],
  fog: ['ggggg.', '......', '.ggggg', '......', 'ggggg.'],
  house: ['..r..', '.rrr.', 'rrrrr', '.www.', '.wbw.'],
  heartS: ['rr.rr', 'rrrrr', '.rrr.', '..r..'],
  target: ['.rrr.', 'rwwwr', 'rwrwr', 'rwwwr', '.rrr.'],
  dice: ['wwwww', 'wbwbw', 'wwwww', 'wbwbw', 'wwwww']
};
const ICON2_PAL = { b: C.brown, s: C.sand, g: C.gray, d: C.slate, r: C.red, w: C.white, y: C.gold, p: C.magenta, c: C.lgray };
const ICON2_OV = { w_tatar: { b: C.dbrown, g: C.lgray }, w_sapan: { b: C.dbrown, r: C.salmon }, w_top: { g: C.gray, d: C.navy, b: C.dbrown },
  seker: { w: C.white, l: C.lgray, g: C.gray }, book: { b: C.wine, w: C.sand }, rain: { c: C.lgray, b: C.sky }, fog: { g: C.lgray }, house: { r: C.rust, w: C.sand, b: C.dbrown },
  scroll: { s: C.tan, w: C.sand }, dice: { w: C.white, b: C.ink } };
const PROJ = {};
const FOE_SPR = {};
const CROP = { havuc: [], pancar: [] };
const MEDAL = {};
function buildArt2() {
  for (const k in ICON2_ROWS) ICONS[k] = makeSprite(ICON2_ROWS[k], Object.assign({}, ICON2_PAL, ICON2_OV[k] || {}), k === 'fog' ? null : C.ink);
  // a recurve bow with a nocked arrow (drawn procedurally so the curve reads at 9px)
  ICONS.w_yay = offscreen(11, 11, c => {
    for (let a = 0; a <= 16; a++) { const t = Math.PI + a / 16 * Math.PI / 2; pix(Math.round(9 + 7.5 * Math.cos(t)), Math.round(9 + 7.5 * Math.sin(t)), C.brown); }
    for (let i = 0; i <= 7; i++) pix(2 + i, 9 - i, C.sand);
    for (let i = 0; i <= 5; i++) pix(3 + i, 3 + i, C.lgray);
    pix(2, 2, C.white); pix(3, 2, C.white); pix(2, 3, C.white); pix(8, 9, C.red); pix(9, 8, C.red); pix(9, 9, C.red);
    addOutline(c, C.ink);
  });
  // medals (gold / silver / bronze)
  const medal = (a, b, c) => makeSprite(['rr...rr', '.rr.rr.', '..rrr..', '.aaaaa.', 'aabaaac', 'aaaaaac', 'aaaaaac', '.aaaac.', '..ccc..'], { r: C.sky, a, b, c }, C.ink);
  MEDAL.g = medal(C.gold, C.yellow, C.orange0); MEDAL.s = medal(C.lgray, C.white, C.gray); MEDAL.b = medal(C.orange0, C.tan, C.rust);
  MEDAL.big = { g: scaleSprite(MEDAL.g, 2), s: scaleSprite(MEDAL.s, 2), b: scaleSprite(MEDAL.b, 2) };
  // projectiles
  PROJ.arrow = makeSprite(['.w.', 'www', '.s.', '.s.', '.s.', '.s.', 'r.r'], { w: C.white, s: C.sand, r: C.red }, null);
  PROJ.bolt = makeSprite(['.w.', 'www', 'ggg', '.g.', '.g.', '.g.', 'bgb'], { w: C.white, g: C.lgray, b: C.dbrown }, C.ink);
  PROJ.pebble = makeSprite(['gg', 'gd'], { g: C.lgray, d: C.gray }, C.ink);
  PROJ.ball = makeSprite(['.bbbb.', 'bwwbbb', 'bwbbbb', 'bbbbbb', 'bbbbbb', '.bbbb.'], { b: C.navy, w: C.gray }, C.ink);
  PROJ.star = makeSprite(['..y..', '.yyy.', 'yywyy', '.yyy.', '..y..'], { y: C.yellow, w: C.white }, null);
  // foes
  FOE_SPR.karga = [
    makeSprite(['kk.......kk', '.kkk...kkk.', '...kkkkk...', '....kek....', '.....y.....'], { k: C.navy, e: C.red, y: C.gold }, C.ink),
    makeSprite(['...........', '..kk...kk..', '...kkkkk...', '...kkekk...', '.....y.....'], { k: C.navy, e: C.red, y: C.gold }, C.ink)
  ];
  const boar = ['....d....', '...bbb...', '..bbbbb..', '.bbbdbbb.', '.bbbbbbb.', '.bbbdbbb.', '.bbbbbbb.', '..bbbbb..', '..bdbdb..', '..bbbbb..', '.w.bbb.w.', '...ppp...'];
  FOE_SPR.domuz = [makeSprite(boar, { b: C.dbrown, d: C.plum, w: C.white, p: C.salmon }, C.ink), makeSprite(boar.map((r, i) => i === 3 || i === 5 ? r.replace('d', 'b') : r), { b: C.dbrown, d: C.plum, w: C.white, p: C.salmon }, C.ink)];
  FOE_SPR.eskiya = getHorse('black', 'eskiya');
  FOE_SPR.okcu = getHorse('chestnut', 'okcu');
  FOE_SPR.reis = getHorse('black', 'reis');
  // shield guard on foot, facing the player: big tower shield up / knocked aside
  const KP = { h: C.lgray, H: C.white, a: C.slate, S: C.wine, r: C.gold, e: C.yellow, p: C.brown, t: C.lgray, l: C.dgray, b: C.dbrown };
  FOE_SPR.kalkanli = [
    makeSprite(['..........t..', '....hhh...t..', '...hHhhh..p..', '..aahhhhaap..', '.rrrrrrrrrrr.', '.rSSSSSSSSSr.', '.rSSSSeSSSSr.', '.rSSSeeeSSSr.', '.rSSSSeSSSSr.', '.rSSSSSSSSSr.', '..rSSSSSSSr..', '...rrrrrrr...'], KP, C.ink),
    makeSprite(['.............', '....hhh......', '...hHhhh.....', '..aahhhhaa...', '.aaaaaaaaaa..', '.aaabbbbaaa.r', '..aaabbaaa.rS', '...aa..aa..rS', '...ll..ll..rS', '...........rr', 'pppppt.......'], KP, C.ink)
  ];
  // enemy arrow flying down toward the player
  PROJ.earrow = makeSprite(['r.r', '.s.', '.s.', '.s.', '.s.', 'www', '.w.'], { w: C.lgray, s: C.dbrown, r: C.red }, C.ink);
  FOE_SPR.fici = offscreen(12, 12, () => { circle(6, 6, 5, C.ink); circle(6, 6, 4, C.brown); ring(6, 6, 3, C.gray); circle(6, 6, 1, C.dbrown); pix(4, 4, C.tan); });
  // crops: 4 growth stages
  const mkCrop = (leaf, root) => [
    makeSprite(['.....', '..d..', '.ddd.'], { d: C.dbrown }, null),
    makeSprite(['..g..', '.gdg.', '.ddd.'], { g: leaf, d: C.dbrown }, null),
    makeSprite(['g.g.g', '.ggg.', '..g..', '.ddd.'], { g: leaf, d: C.dbrown }, null),
    makeSprite(['g.g.g', '.ggg.', '..r..', '.rrr.', '..r..'], { g: leaf, r: root }, C.ink)
  ];
  CROP.havuc = mkCrop(C.green, C.orange); CROP.pancar = mkCrop(C.dgreen, C.magenta);
  buildBuildings2();
  buildPeople2();
}
function scaleSprite(img, k) { return offscreen(img.width * k, img.height * k, () => { g.drawImage(img, 0, 0, img.width * k, img.height * k); }); }

function buildBuildings2() {
  // RUH SUNAĞI (spirit shrine)
  for (const broken of [false, true]) {
    BLD['tapinak' + (broken ? 'X' : '')] = offscreen(46, 44, () => {
      const st = broken ? C.dgray : C.lgray, sd = broken ? C.slate : C.gray;
      rect(2, 34, 42, 9, C.ink); rect(3, 35, 40, 7, sd); hline(3, 35, 40, st);
      rect(6, 30, 34, 5, C.ink); rect(7, 31, 32, 3, st);
      for (const px of [8, 34]) { rect(px - 1, 8, 6, 23, C.ink); rect(px, 8, 4, 23, st); vline(px + 3, 8, 23, sd); if (broken && px === 34) { rect(px - 1, 8, 6, 9, 'rgba(0,0,0,0)'); } }
      rect(4, 3, 38, 7, C.ink); rect(5, 4, 36, 5, broken ? sd : C.sand); hline(5, 4, 36, broken ? st : C.white);
      if (!broken) { circle(23, 22, 6, C.ink); circle(23, 22, 5, C.purple); circle(23, 22, 3, C.magenta); pix(22, 20, C.white); }
      else { rect(18, 26, 10, 4, C.slate); pix(36, 10, C.ink); pix(37, 12, C.ink); }
    });
  }
  // SİLAHHANE (armory)
  for (const broken of [false, true]) {
    BLD['silahhane' + (broken ? 'X' : '')] = offscreen(48, 42, () => {
      const wall = broken ? C.dgray : C.tan, plank = broken ? C.slate : C.brown, roof = broken ? C.navy : C.wine;
      roofTri(22, 2, 12, 8, 1.3, roof, C.ink);
      rect(3, 14, 38, 27, C.ink); rect(4, 14, 36, 26, wall);
      for (let x = 7; x < 40; x += 4) vline(x, 15, 25, plank);
      rect(15, 26, 14, 14, C.ink); rect(16, 27, 12, 13, broken ? C.navy : C.plum);
      if (!broken) { // crossed arrows sign
        rect(14, 16, 16, 8, C.ink); rect(15, 17, 14, 6, C.sand);
        for (let i = 0; i < 10; i++) { pix(17 + i, 18 + Math.floor(i / 2.5), C.dbrown); pix(26 - i, 18 + Math.floor(i / 2.5), C.dbrown); }
      } else { rect(14, 30, 16, 2, C.brown); }
      // target board
      circle(43, 30, 5, C.ink); circle(43, 30, 4, broken ? C.slate : C.white); circle(43, 30, 2, broken ? C.dgray : C.red); vline(43, 35, 6, C.dbrown);
      hline(3, 41, 38, C.ink);
    });
  }
  // ZAFER ANITI (trophy statue)
  BLD.anit = offscreen(24, 32, () => {
    rect(3, 22, 18, 9, C.ink); rect(4, 23, 16, 7, C.gray); hline(4, 23, 16, C.lgray);
    rect(7, 8, 10, 15, C.ink); rect(8, 9, 8, 13, C.lgray); vline(15, 9, 13, C.gray);
    rect(9, 2, 6, 7, C.ink); rect(10, 3, 4, 5, C.lgray); pix(13, 4, C.ink); rect(9, 1, 3, 2, C.ink);
  });
  // KÖPEK KULÜBESİ
  BLD.kulube = offscreen(20, 18, () => {
    roofTri(10, 0, 7, 4, 1.0, C.wine, C.ink);
    rect(2, 7, 16, 10, C.ink); rect(3, 7, 14, 9, C.brown); rect(7, 10, 6, 7, C.ink); hline(3, 7, 14, C.tan);
  });
  // PAZAR TEZGAHI (Hasan's market stall)
  BLD.pazar = offscreen(42, 32, () => {
    rect(3, 8, 2, 24, C.ink); rect(37, 8, 2, 24, C.ink);
    rect(0, 0, 42, 10, C.ink);
    for (let x = 1; x < 41; x++) vline(x, 1, 7, Math.floor((x - 1) / 5) % 2 ? C.white : C.green);
    rect(1, 20, 40, 12, C.ink); rect(2, 21, 38, 10, C.brown); hline(2, 21, 38, C.tan);
    for (let x = 5; x < 38; x += 8) { rect(x, 16, 5, 5, C.ink); rect(x + 1, 17, 3, 3, [C.yellow, C.salmon, C.sky, C.green, C.orange][(x / 8 | 0) % 5]); }
  });
  // decor
  BLD.d_saman = offscreen(16, 10, () => { for (const [x, y] of [[0, 3], [6, 3], [3, 0]]) { rect(x, y, 9, 7, C.ink); rect(x + 1, y + 1, 7, 5, C.gold); hline(x + 1, y + 3, 7, C.orange0); } });
  BLD.d_cicek = offscreen(18, 8, () => { rect(0, 3, 18, 5, C.ink); rect(1, 4, 16, 3, C.dbrown); for (let x = 2; x < 16; x += 3) { pix(x, 2, [C.red, C.yellow, C.salmon, C.white, C.magenta][(x / 3 | 0) % 5]); pix(x, 3, C.green); } });
  BLD.d_fener = offscreen(7, 18, () => { rect(2, 4, 3, 14, C.ink); vline(3, 5, 13, C.slate); rect(0, 0, 7, 6, C.ink); rect(1, 1, 5, 4, C.yellow); pix(2, 2, C.white); });
  BLD.d_bayrak = offscreen(40, 10, () => { for (let x = 0; x < 40; x++) pix(x, Math.round(2 + Math.sin(x / 40 * Math.PI) * 3), C.dbrown); for (let i = 0; i < 6; i++) { const x = 3 + i * 6, y = Math.round(3 + Math.sin(x / 40 * Math.PI) * 3); rect(x, y, 3, 3, [C.red, C.yellow, C.sky, C.green, C.white, C.magenta][i]); pix(x + 1, y + 3, [C.red, C.yellow, C.sky, C.green, C.white, C.magenta][i]); } });
  BLD.d_agac = offscreen(16, 18, () => { spr(OB.tree, 0, 0); for (const [x, y] of [[4, 4], [9, 6], [6, 8], [11, 3]]) pix(x, y, C.red); });
  BLD.d_kuyu = offscreen(16, 18, () => { rect(1, 9, 14, 9, C.ink); rect(2, 10, 12, 7, C.gray); for (let x = 3; x < 14; x += 4) vline(x, 10, 7, C.dgray); rect(3, 1, 2, 9, C.ink); rect(11, 1, 2, 9, C.ink); rect(1, 0, 14, 3, C.ink); rect(2, 1, 12, 1, C.wine); ellipse(8, 10, 5, 1, C.navy); });
  BLD.d_cesme = offscreen(20, 16, () => { ellipse(10, 11, 9, 4, C.ink); ellipse(10, 11, 8, 3, C.gray); ellipse(10, 10, 6, 2, C.sky); rect(8, 2, 4, 9, C.ink); rect(9, 2, 2, 9, C.lgray); });
  BLD.d_heykel = offscreen(18, 26, () => {
    rect(2, 17, 14, 9, C.ink); rect(3, 18, 12, 7, C.gray); hline(3, 18, 12, C.lgray);
    // horse head facing right in white stone
    rect(5, 3, 6, 15, C.ink); rect(6, 4, 4, 13, C.white); rect(8, 1, 7, 6, C.ink); rect(9, 2, 5, 4, C.white); pix(11, 3, C.ink); rect(6, 0, 2, 3, C.ink); vline(5, 5, 10, C.lgray);
  });
}
function buildPeople2() {
  PEOPLE.dog = [
    makeSprite(['k...k', 'kk.kk', 'kwwwk', 'kwkwk', '.www.', 'kkkkk', 'k...k'], { k: C.ink, w: C.white }, null),
    makeSprite(['k...k', 'kk.kk', 'kwwwk', 'kwkwk', '.www.', 'kkkkk', '.k.k.'], { k: C.ink, w: C.white }, null)
  ];
  PORTRAIT.akyele = offscreen(28, 28, () => {
    for (let r = 13; r > 6; r -= 2) { g.globalAlpha = 0.18; circle(14, 14, r, C.cyan); }
    g.globalAlpha = 1;
    // white horse head facing left, glowing
    const rows = ['.......mm.......', '......mwwm......', '.....mwwwwm.....', '....mwwwwwwm....', '...mwwwkwwwwm...', '..mwwwwwwwwwwm..', '.mwwwwwwwwwwwwm.', 'mwwwwwwwwwwwwwwm', 'mnwwwwwwwwwwwwm.', '.mnnwwwwwwwwwm..', '..mmmwwwwwwwm...', '.....mwwwwwm....', '.....mwwwwwm....', '.....mwwwwwm....'];
    rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const ch = row[x]; if (ch === '.') continue; pix(6 + x, 7 + y, ch === 'w' ? C.white : ch === 'k' ? C.ink : ch === 'n' ? C.lgray : C.cyan); } });
  });
  PORTRAIT.baron = offscreen(28, 28, () => {
    drawFace({ skin: C.skin, skin2: C.skin2, mouth: C.plum });
    rect(7, 2, 14, 9, C.ink); rect(8, 3, 12, 7, C.navy); hline(8, 8, 12, C.wine); rect(4, 10, 20, 2, C.ink); // top hat
    ring(17, 17, 2, C.gold); pix(19, 19, C.gold); // monocle
    rect(9, 20, 11, 2, C.ink); pix(8, 19, C.ink); pix(20, 19, C.ink); // mustache
    rect(4, 25, 20, 3, C.ink); rect(12, 25, 4, 3, C.wine);
  });
}
