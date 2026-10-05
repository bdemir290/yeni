// ================= GAME DATA =================
const SPIRITS = {
  tulpar: { name: 'TULPAR', color: C.cyan, dark: C.sky, desc: 'HAVA VE SIÇRAYIŞ' },
  kirat: { name: 'KIRAT', color: C.red, dark: C.wine, desc: 'GÜÇ VE CESARET' },
  sleipnir: { name: 'SLEİPNİR', color: C.magenta, dark: C.purple, desc: 'ÇOKLU HAREKET' },
  pegasus: { name: 'PEGASUS', color: C.yellow, dark: C.gold, desc: 'IŞIK VE RİTİM' },
  ruzgar: { name: 'RÜZGAR KISRAĞI', color: C.green, dark: C.dgreen, desc: 'HIZ' }
};
const SPIRIT_KEYS = Object.keys(SPIRITS);
const SLOTS = { serit: 'ŞERİT', sicra: 'SIÇRAYIŞ', ritim: 'RİTİM', hamle: 'HAMLE', cagri: 'ÇAĞRI' };

function baseStats() {
  return {
    maxHp: 3, speed: 1, jumpTime: 0.56, laneTime: 0.13, perfectWin: 0.09, goodWin: 0.17, comboPer: 0.012, comboCap: 25,
    coinMult: 1, slowResist: 0, puddleImmune: false, airCoins: false, shield: 0, lowHpSpeed: 0, shoulder: false, shoulderDmg: 0,
    rockBreaker: false, extraJumps: 0, laneInvuln: 0, ghost: false,
    starDust: false, comboKeep: false, stormBonus: 0, landShock: 0, rerolls: 0, discount: 0, luck: 0,
    startCombo: 0, bossHeal: 0, revives: 0, reviveHp: 1, comboDecay: 2,
    // weapons
    weapon: 'yay', shotDmg: 1, shotPierce: 0, shotSpread: false, shotHoming: false, knock: false, volley: 0,
    // verb hooks
    landStomp: 0, landInvuln: 0, landBoost: 0, jumpStars: 0, laneFloat: 0, laneTrail: 0, laneSpeed: 0,
    abFly: 0, abStun: false, abShield: 0, abGhosts: 0, abStars: false, abStorm: 0,
    // duos and misc
    airStars: false, landShockWide: false, comboTrample: 0, ghostShoots: false, foeCoins: 1,
    dawnWindow: false, bondMult: 1, rivalHandicap: 0, muska: 0, startCoins: 0, etapHeal: 0, forceFog: false,
    moreFoes: 1, duoChance: 0.3, assist: 0, bossDrainMult: 1,
    // breath (nefes), hamle burst, final kick, bends, notes
    nefesStart: 50, nefesGain: 1, hamleCost: 30, hamleDur: 1.0, hamleSpd: 0.35, hamleInv: false, hamleAir: false, hamleRam: 0, hamleStars: 0, hamleShield: false,
    kickMult: 1, cornerMult: 1, outerSafe: false, accentWin: 1, specialMult: 1, cleanStars: 0, cleanNefes: 0, cleanHamle: false, doubleBonus: false, fullNefesDmg: 0,
    // weapon mods (Demirci Çekici)
    minShots: 0, burn: 0, ricochet: 0, shotStun: 0, fanCount: 3, fireOnGood: false, miniBlast: false, barNeed: 4, blastStun: 0, bounceBall: 0
  };
}

// ---------- spirit boons: one boon per action slot (like Hades) plus passive boons ----------
const BOONS = [
  // TULPAR
  { id: 't_sicra', sp: 'tulpar', slot: 'sicra', name: 'GÖK DARBESİ', max: 3, desc: l => 'İNİŞTE ' + (30 + l * 10) + ' ADIM ÇEVREDEKİ ENGEL VE DÜŞMANLAR PARÇALANIR', apply: (S, l) => { S.landShock = 30 + l * 10; } },
  { id: 't_serit', sp: 'tulpar', slot: 'serit', name: 'SÜZÜLEN ADIM', max: 3, desc: l => 'ŞERİT DEĞİŞTİRİRKEN ' + (0.2 + l * 0.1).toFixed(1) + ' SN YERDEN KESİLİRSİN: BARİYER VE JÖLE ETKİLEMEZ', apply: (S, l) => { S.laneFloat = 0.2 + l * 0.1; } },
  { id: 't_ritim', sp: 'tulpar', slot: 'ritim', name: 'RÜZGAR OKU', max: 3, desc: l => 'MÜKEMMEL ATIŞLAR ' + l + ' DÜŞMANIN İÇİNDEN GEÇER', apply: (S, l) => { S.shotPierce += l; } },
  { id: 't_cagri', sp: 'tulpar', slot: 'cagri', name: 'TULPAR KANADI', max: 3, desc: l => 'TEKNİKLE ' + (2 + l) + ' SN UÇARSIN, HİÇBİR ŞEY DOKUNAMAZ', apply: (S, l) => { S.abFly = 2 + l; } },
  { id: 't_hamle', sp: 'tulpar', slot: 'hamle', name: 'SÜZÜLEN HAMLE', max: 3, desc: l => 'HAMLEDE HAVAYA YÜKSELİRSİN, HİÇBİR ŞEY DOKUNAMAZ. SÜRE +%' + (20 * l), apply: (S, l) => { S.hamleAir = true; S.hamleDur *= 1 + 0.2 * l; } },
  { id: 't_temiz', sp: 'tulpar', name: 'TEMİZ KANAT', max: 2, desc: l => 'TEMİZ ATLAYIŞTA ' + (1 + l) + ' YILDIZ FIRLATIR, +5 NEFES ALIRSIN', apply: (S, l) => { S.cleanStars = 1 + l; S.cleanNefes += 5; } },
  { id: 't_suzulme', sp: 'tulpar', name: 'SÜZÜLME', max: 3, desc: l => 'SIÇRAYIŞ SÜRESİ +%' + (25 * l), apply: (S, l) => { S.jumpTime *= 1 + 0.25 * l; } },
  { id: 't_cift', sp: 'tulpar', name: 'ÇİFT SIÇRAYIŞ', max: 1, desc: () => 'HAVADAYKEN BİR KEZ DAHA SIÇRAYABİLİRSİN', apply: S => { S.extraJumps += 1; } },
  { id: 't_bulut', sp: 'tulpar', name: 'BULUT ADIMI', max: 1, desc: () => 'JÖLE SENİ YAVAŞLATMAZ, HAVADA ALINAN SİKKE X2', apply: S => { S.puddleImmune = true; S.airCoins = true; } },
  // KIRAT
  { id: 'k_sicra', sp: 'kirat', slot: 'sicra', name: 'KIRAT TOYNAĞI', max: 3, desc: l => 'İNDİĞİN YERDEKİ DÜŞMANLAR ' + (1 + l) + ' HASAR ALIR, BARİYERLER KIRILIR', apply: (S, l) => { S.landStomp = 1 + l; } },
  { id: 'k_serit', sp: 'kirat', slot: 'serit', name: 'OMUZ DARBESİ', max: 3, desc: l => 'ŞERİT DEĞİŞTİRİRKEN ÇARPTIĞIN RAKİBİ İTER, DÜŞMANA ' + l + ' HASAR VERİRSİN', apply: (S, l) => { S.shoulder = true; S.shoulderDmg = l; } },
  { id: 'k_ritim', sp: 'kirat', slot: 'ritim', name: 'AĞIR OK', max: 3, desc: l => 'ATIŞ HASARI +%' + (40 * l) + ', VURDUĞUN GERİ SAVRULUR', apply: (S, l) => { S.shotDmg *= 1 + 0.4 * l; S.knock = true; } },
  { id: 'k_cagri', sp: 'kirat', slot: 'cagri', name: 'KÖROĞLU NARASI', max: 3, desc: l => 'TEKNİK TÜM DÜŞMANLARI SERSEMLETİR VE ' + l + ' KALKAN VERİR', apply: (S, l) => { S.abStun = true; S.abShield = l; } },
  { id: 'k_hamle', sp: 'kirat', slot: 'hamle', name: 'KOÇBAŞI', max: 3, desc: l => 'HAMLE ÖNÜNDEKİ ENGELLERİ PARÇALAR, DÜŞMANLARA ' + (1 + l) + ' HASAR VERİR', apply: (S, l) => { S.hamleRam = 1 + l; } },
  { id: 'k_nefes', sp: 'kirat', name: 'ATEŞLİ NEFES', max: 2, desc: l => 'NEFES 80 VE ÜSTÜYKEN ATIŞ HASARI +%' + (25 * l), apply: (S, l) => { S.fullNefesDmg = 0.25 * l; } },
  { id: 'k_demir', sp: 'kirat', name: 'DEMİR GÖĞÜS', max: 2, desc: l => 'HER ETAPTA İLK ' + l + ' ÇARPMA CAN GÖTÜRMEZ', apply: (S, l) => { S.shield += l; } },
  { id: 'k_ofke', sp: 'kirat', name: 'KÖROĞLU ÖFKESİ', max: 2, desc: l => 'TEK CANIN KALINCA HIZ +%' + (20 * l), apply: (S, l) => { S.lowHpSpeed += 0.2 * l; } },
  { id: 'k_kaya', sp: 'kirat', name: 'GÖKTAŞI KIRAN', max: 1, desc: () => 'GÖKTAŞLARI ÇARPINCA KIRILIR, CAN GİTMEZ', apply: S => { S.rockBreaker = true; } },
  { id: 'k_yigit', sp: 'kirat', name: 'YİĞİT YÜREK', max: 3, desc: () => '+1 AZAMİ CAN VE 1 CAN YENİLE', apply: (S, l) => { S.maxHp += l; }, onPick: (run, lv) => { run.hp += lv; } },
  // SLEIPNIR
  { id: 's_sicra', sp: 'sleipnir', slot: 'sicra', name: 'SEKİZ AYAK', max: 3, desc: l => 'İNİŞTEN SONRA ' + (0.2 + 0.2 * l).toFixed(1) + ' SN DOKUNULMAZSIN', apply: (S, l) => { S.landInvuln = 0.2 + 0.2 * l; } },
  { id: 's_serit', sp: 'sleipnir', slot: 'serit', name: 'HAYALET ADIM', max: 3, desc: l => 'ŞERİT DEĞİŞTİRİNCE ' + (0.15 + 0.15 * l).toFixed(2) + ' SN DOKUNULMAZSIN', apply: (S, l) => { S.laneInvuln = 0.15 + 0.15 * l; } },
  { id: 's_ritim', sp: 'sleipnir', slot: 'ritim', name: 'ÇATAL OK', max: 3, desc: l => 'ATIŞLAR YAN ŞERİTLERE DE GİDER (%' + (40 + 20 * l) + ' HASAR)', apply: (S, l) => { S.shotSpread = 0.4 + 0.2 * l; } },
  { id: 's_cagri', sp: 'sleipnir', slot: 'cagri', name: 'GÖLGE SÜRÜSÜ', max: 3, desc: l => 'TEKNİKLE ' + (3 + 2 * l) + ' SN İKİ GÖLGE AT YANINDA KOŞUP ATEŞ EDER', apply: (S, l) => { S.abGhosts = 3 + 2 * l; } },
  { id: 's_hamle', sp: 'sleipnir', slot: 'hamle', name: 'GÖLGE HAMLESİ', max: 3, desc: l => 'HAMLEDE DOKUNULMAZSIN, ENGELLERDEN GEÇERSİN. NEFES BEDELİ -%' + (15 * l), apply: (S, l) => { S.hamleInv = true; S.hamleCost *= 1 - 0.15 * l; } },
  { id: 's_cift', sp: 'sleipnir', name: 'ÇİFT TOYNAK', max: 1, desc: () => 'ÇİFT NOTANIN İKİSİNİ DE VURURSAN EK ATIŞ VE +4 NEFES', apply: S => { S.doubleBonus = true; } },
  { id: 's_sekiz', sp: 'sleipnir', name: 'SEKİZ TOYNAK', max: 1, desc: () => 'ŞERİT DEĞİŞTİRME 2 KAT HIZLI', apply: S => { S.laneTime *= 0.5; } },
  { id: 's_golge', sp: 'sleipnir', name: 'GÖLGE İKİZİ', max: 1, desc: () => 'YAN ŞERİTTE BİR GÖLGE AT SİKKE TOPLAR', apply: S => { S.ghost = true; } },
  // PEGASUS
  { id: 'p_sicra', sp: 'pegasus', slot: 'sicra', name: 'YILDIZ SIÇRAYIŞI', max: 3, desc: l => 'SIÇRAYIŞIN TEPESİNDE ÖNÜNE ' + (2 + l) + ' YILDIZ FIRLATIRSIN', apply: (S, l) => { S.jumpStars = 2 + l; } },
  { id: 'p_serit', sp: 'pegasus', slot: 'serit', name: 'IŞIK İZİ', max: 3, desc: l => 'ŞERİT DEĞİŞTİRİNCE ARKANDA KALAN IŞIK DÜŞMANA ' + l + ' HASAR VERİR', apply: (S, l) => { S.laneTrail = l; } },
  { id: 'p_ritim', sp: 'pegasus', slot: 'ritim', name: 'PARLAK OK', max: 3, desc: l => 'MÜKEMMEL ATIŞLAR EN YAKIN DÜŞMANA YÖNELİR, HASAR +%' + (15 * l), apply: (S, l) => { S.shotHoming = true; S.shotDmg *= 1 + 0.15 * l; } },
  { id: 'p_cagri', sp: 'pegasus', slot: 'cagri', name: 'TAKIMYILDIZ', max: 3, desc: l => 'TEKNİK EKRANA YILDIZ YAĞDIRIR: DÜŞMANLARA ' + (1 + l) + ' HASAR', apply: (S, l) => { S.abStars = 1 + l; } },
  { id: 'p_hamle', sp: 'pegasus', slot: 'hamle', name: 'IŞIK HAMLESİ', max: 3, desc: l => 'HAMLEYE BAŞLARKEN ÖNÜNE ' + (2 + l) + ' YILDIZ FIRLATIRSIN', apply: (S, l) => { S.hamleStars = 2 + l; } },
  { id: 'p_vurgu', sp: 'pegasus', name: 'VURGU IŞIĞI', max: 2, desc: l => 'ALTIN NOTALARDA MÜKEMMEL PENCERE +%' + (30 * l) + ', ÖZEL ATIŞ +%' + (40 * l), apply: (S, l) => { S.accentWin = 1 + 0.3 * l; S.specialMult *= 1 + 0.4 * l; } },
  { id: 'p_parlak', sp: 'pegasus', name: 'PARLAK TOYNAK', max: 2, desc: l => 'MÜKEMMEL RİTİM PENCERESİ +%' + (30 * l), apply: (S, l) => { S.perfectWin *= 1 + 0.3 * l; } },
  { id: 'p_yildiz', sp: 'pegasus', name: 'YILDIZ TOZU', max: 1, desc: () => 'HER 30 KOMBODA 1 CAN YENİLENİR', apply: S => { S.starDust = true; } },
  { id: 'p_altin', sp: 'pegasus', name: 'ALTIN NAL', max: 3, desc: l => 'SİKKE KAZANCI +%' + (40 * l), apply: (S, l) => { S.coinMult += 0.4 * l; } },
  // RUZGAR
  { id: 'r_sicra', sp: 'ruzgar', slot: 'sicra', name: 'KASIRGA SIÇRAYIŞI', max: 3, desc: l => 'İNİŞTE 1.5 SN %' + (10 + 5 * l) + ' HIZ PATLAMASI', apply: (S, l) => { S.landBoost = 0.1 + 0.05 * l; } },
  { id: 'r_serit', sp: 'ruzgar', slot: 'serit', name: 'YAN RÜZGAR', max: 3, desc: l => 'ŞERİT DEĞİŞTİRİNCE 1 SN %' + (6 + 4 * l) + ' HIZ', apply: (S, l) => { S.laneSpeed = 0.06 + 0.04 * l; } },
  { id: 'r_ritim', sp: 'ruzgar', slot: 'ritim', name: 'HIZLI YAY', max: 3, desc: l => 'HER ' + [8, 6, 4][l - 1] + ' KOMBODA BEŞ IŞINLIK YAĞMUR', apply: (S, l) => { S.volley = [8, 6, 4][l - 1]; } },
  { id: 'r_cagri', sp: 'ruzgar', slot: 'cagri', name: 'FIRTINA ATAĞI', max: 3, desc: l => 'TEKNİK ' + (2 + l) + ' SN EN YÜKSEK HIZ VE KOMBO KORUMASI VERİR', apply: (S, l) => { S.abStorm = 2 + l; } },
  { id: 'r_hamle', sp: 'ruzgar', slot: 'hamle', name: 'FIRTINA HAMLESİ', max: 3, desc: l => 'HAMLE SÜRESİ +%' + (30 * l) + ', HAMLE HIZI +%' + (5 * l), apply: (S, l) => { S.hamleDur *= 1 + 0.3 * l; S.hamleSpd += 0.05 * l; } },
  { id: 'r_soluk', sp: 'ruzgar', name: 'İKİNCİ SOLUK', max: 2, desc: l => 'NEFES KAZANCI +%' + (40 * l) + ', SON ATAK +%' + (40 * l), apply: (S, l) => { S.nefesGain *= 1 + 0.4 * l; S.kickMult *= 1 + 0.4 * l; } },
  { id: 'r_viraj', sp: 'ruzgar', name: 'VİRAJ USTASI', max: 1, desc: () => 'VİRAJDA İÇ KULVAR AVANTAJI İKİ KAT, DIŞTA YAVAŞLAMAZSIN', apply: S => { S.cornerMult *= 2; S.outerSafe = true; } },
  { id: 'r_ruzgar', sp: 'ruzgar', name: 'ARKA RÜZGAR', max: 3, desc: l => 'TABAN HIZ +%' + (6 * l), apply: (S, l) => { S.speed *= 1 + 0.06 * l; } },
  { id: 'r_kesintisiz', sp: 'ruzgar', name: 'KESİNTİSİZ', max: 1, desc: () => 'ISKA KOMBOYU SIFIRLAMAZ, YARIYA İNDİRİR', apply: S => { S.comboKeep = true; } },
  { id: 'r_firtina', sp: 'ruzgar', name: 'TAM GAZ', max: 1, desc: () => 'KOMBO 20 VE ÜSTÜYKEN EKSTRA HIZ +%12', apply: S => { S.stormBonus = 0.12; } },
  { id: 'r_hafif', sp: 'ruzgar', name: 'HAFİF AYAK', max: 1, desc: () => 'ÇARPMA VE JÖLE YAVAŞLATMASI %50 AZALIR', apply: S => { S.slowResist += 0.5; } }
];
// duo boons need one boon from each of the two spirits
const DUOS = [
  { id: 'd_tk', duo: ['tulpar', 'kirat'], name: 'GÖK GÜRÜLTÜSÜ', desc: () => 'İNİŞ DALGASI İKİ KAT GENİŞ OLUR VE DÜŞMANLARI SERSEMLETİR', apply: S => { S.landShockWide = true; if (!S.landShock) S.landShock = 30; } },
  { id: 'd_tp', duo: ['tulpar', 'pegasus'], name: 'IŞIK YAĞMURU', desc: () => 'HAVADAYKEN HER VURUŞTA BİR YILDIZ ATARSIN', apply: S => { S.airStars = true; } },
  { id: 'd_kr', duo: ['kirat', 'ruzgar'], name: 'GÖKTAŞI FIRTINASI', desc: () => 'KOMBO 20 ÜSTÜNDEYKEN GÖKTAŞI VE KAPSÜLLERİ EZİP GEÇERSİN', apply: S => { S.comboTrample = 20; } },
  { id: 'd_sp', duo: ['sleipnir', 'pegasus'], name: 'AY GÖLGESİ', desc: () => 'YANINDAKİ GÖLGE AT DA ATEŞ EDER', apply: S => { S.ghost = true; S.ghostShoots = true; } },
  { id: 'd_sr', duo: ['sleipnir', 'ruzgar'], name: 'SEKİZ RÜZGAR', desc: () => 'HAMLE NEFESİN YARISINA MAL OLUR, HAMLEDE DÜŞMANLARI EZERSİN', apply: S => { S.hamleCost *= 0.5; S.hamleRam = Math.max(S.hamleRam, 2); } },
  { id: 'd_tr', duo: ['tulpar', 'ruzgar'], name: 'GÖK KOŞUSU', desc: () => 'TEMİZ ATLAYIŞ SANA BEDAVA BİR KISA HAMLE VERİR', apply: S => { S.cleanHamle = true; } },
  { id: 'd_ks', duo: ['kirat', 'sleipnir'], name: 'DEMİR GÖLGE', desc: () => 'HAMLE SIRASINDA ÇARPTIĞIN HER ŞEY KIRILIR VE 1 KALKAN KAZANIRSIN', apply: S => { S.hamleShield = true; S.hamleRam = Math.max(S.hamleRam, 1); } },
  { id: 'd_pk', duo: ['pegasus', 'kirat'], name: 'ALTIN TOYNAK', desc: () => 'DÜŞMANLAR 2 KAT SİKKE DÜŞÜRÜR', apply: S => { S.foeCoins *= 2; } },
  { id: 'd_ts', duo: ['tulpar', 'sleipnir'], name: 'BULUT SÜRÜSÜ', desc: () => '+1 SIÇRAYIŞ VE İNİŞTE KISA DOKUNULMAZLIK', apply: S => { S.extraJumps += 1; S.landInvuln = Math.max(S.landInvuln, 0.4); } },
  { id: 'd_rp', duo: ['ruzgar', 'pegasus'], name: 'ŞAFAK KOŞUSU', desc: () => 'KOMBO 20 ÜSTÜNDE MÜKEMMEL PENCERE +%50', apply: S => { S.dawnWindow = true; } }
];
const BOON_BY_ID = {}; BOONS.forEach(b => BOON_BY_ID[b.id] = b); DUOS.forEach(d => { d.max = 1; BOON_BY_ID[d.id] = d; });
const RARITY = [
  { name: 'SIRADAN', color: C.lgray, lv: 1 },
  { name: 'NADİR', color: C.sky, lv: 2 },
  { name: 'DESTANSI', color: C.magenta, lv: 3 }
];

// ---------- saddle weapons ----------
const WEAPONS = {
  yay: { name: 'IŞIK YAYI', desc: 'HER RİTİM VURUŞUNDA IŞIK OKU, MÜKEMMELDE İKİ OK', cost: 0, dmg: 1, speed: 340, fire: 'judged', icon: 'w_yay', shot: 'arrow' },
  sapan: { name: 'ŞOK SAPANI', desc: 'HER DOKUNUŞTA ŞOK TOPU; RİTİMDE ÜÇ TANE', cost: 45, dmg: 0.7, speed: 320, fire: 'any', icon: 'w_sapan', shot: 'pebble' },
  tatar: { name: 'RAY ARBALETİ', desc: 'SADECE MÜKEMMELDE: DELİCİ IŞIN, GÖKTAŞI KIRAR', cost: 70, dmg: 2.4, speed: 400, fire: 'perfect', pierce: 2, breaksRock: true, icon: 'w_tatar', shot: 'bolt' },
  top: { name: 'PLAZMA TOPU', desc: 'HER 4 VURUŞTA BİR PLAZMA: GENİŞ PATLAMA', cost: 110, dmg: 3, speed: 260, fire: 'bar', aoe: true, breaksRock: true, icon: 'w_top', shot: 'ball' }
};
const WEAPON_UP = [0, 40, 90]; // cost of level 2 and 3 (index = current level)
const WEAPON_SPECIAL = { yay: 'ÜÇLÜ IŞIN', sapan: 'ŞOK FIRTINASI', tatar: 'ZIRH DELEN', top: 'DEV PLAZMA' };
// Demirci Çekici: run-only weapon modifications (max 2 per run, like Hades' hammers)
const WEAPON_MODS = {
  yay: [
    { id: 'y_cift', name: 'ÇİFT KİRİŞ', desc: 'HER VURUŞTA EN AZ İKİ IŞIK OKU', apply: S => { S.minShots = 2; } },
    { id: 'y_alev', name: 'ALEVLİ OK', desc: 'VURDUĞUN DÜŞMAN 2 SN YANAR', apply: S => { S.burn = Math.max(S.burn, 0.8); } },
    { id: 'y_sekme', name: 'SEKEN OK', desc: 'OK VURDUKTAN SONRA YAKINDAKİ BİR DÜŞMANA SEKER', apply: S => { S.ricochet += 1; } }
  ],
  sapan: [
    { id: 's_iri', name: 'AĞIR ŞOK', desc: 'ŞOK TOPLARI SERSEMLETİR, HASAR +%30', apply: S => { S.shotStun = 0.6; S.shotDmg *= 1.3; } },
    { id: 's_torba', name: 'DOLU ŞARJ', desc: 'RİTİMDE 3 YERİNE 5 ŞOK TOPU', apply: S => { S.fanCount = 5; } },
    { id: 's_sivri', name: 'DELİCİ ŞOK', desc: 'ŞOK TOPLARI BİR DÜŞMANI DELİP GEÇER', apply: S => { S.shotPierce += 1; } }
  ],
  tatar: [
    { id: 't_kurma', name: 'HIZLI ŞARJ', desc: 'İYİ VURUŞTA DA ATEŞ EDER', apply: S => { S.fireOnGood = true; } },
    { id: 't_patla', name: 'PATLAYAN UÇ', desc: 'IŞIN İSABET EDİNCE KÜÇÜK BİR PATLAMA', apply: S => { S.miniBlast = true; } },
    { id: 't_menzil', name: 'UZUN MENZİL', desc: 'IŞIN HERKESİN İÇİNDEN GEÇER, HASAR +%20', apply: S => { S.shotPierce += 9; S.shotDmg *= 1.2; } }
  ],
  top: [
    { id: 'o_namlu', name: 'ÇİFT NAMLU', desc: 'PLAZMA 4 YERİNE 3 VURUŞTA', apply: S => { S.barNeed = 3; } },
    { id: 'o_sis', name: 'ŞOK PLAZMASI', desc: 'PATLAMA DÜŞMANLARI 2 SN SERSEMLETİR', apply: S => { S.blastStun = 2; } },
    { id: 'o_seken', name: 'SEKEN PLAZMA', desc: 'PLAZMA PATLADIKTAN SONRA BİR KEZ DAHA SEKER', apply: S => { S.bounceBall += 1; } }
  ]
};
const MOD_BY_ID = {}; for (const w in WEAPON_MODS) for (const m of WEAPON_MODS[w]) { m.w = w; MOD_BY_ID[m.id] = m; }

// ---------- enemies ----------
const FOES = {
  karga: { name: 'GÖZCÜ', hp: 1, coins: 2, w: 10 },
  domuz: { name: 'TOSBİK', hp: 2, coins: 3, w: 10 },
  eskiya: { name: 'KORSAN', hp: 4, coins: 6, w: 12 },
  okcu: { name: 'NİŞANCI', hp: 3, coins: 5, w: 12 },
  kalkanli: { name: 'KALKAN ROBOTU', hp: 3, coins: 7, w: 12 },
  reis: { name: 'KORSAN KAPTANI', hp: 14, coins: 20, w: 14 }
};

const NALS = {
  demir: { name: 'DEMİR NAL', desc: 'DENGELİ, GÜVENİLİR', cost: 0, apply: () => { } },
  ruzgar: { name: 'İYON NALI', desc: 'HIZ +%10, AZAMİ CAN -1', cost: 60, apply: S => { S.speed *= 1.1; S.maxHp -= 1; } },
  tas: { name: 'METEOR NALI', desc: 'AZAMİ CAN +1, YAVAŞLAMA -%30, HIZ -%5', cost: 60, apply: S => { S.maxHp += 1; S.slowResist += 0.3; S.speed *= 0.95; } },
  ritim: { name: 'RİTİM NALI', desc: 'MÜKEMMEL PENCERE +%25, KOMBO HIZI +%50', cost: 90, apply: S => { S.perfectWin *= 1.25; S.comboPer *= 1.5; } }
};
const JOCKEYS = {
  ayse: { name: 'AYŞE', silk: 'ayse', passive: 'KOMBO YAVAŞ SÖNER', ability: 'SAKİN NEFES', abDesc: '4 SN DOKUNULMAZLIK VE EKSTRA HIZ', rozet: 0, apply: S => { S.comboDecay = 1; } },
  kemal: { name: 'KEMAL USTA', silk: 'kemal', passive: '+1 AZAMİ CAN', ability: 'USTA ATAĞI', abDesc: 'ANINDA İLERİ FIRLA, FARKI KAPAT', rozet: 1, apply: S => { S.maxHp += 1; } },
  tayfun: { name: 'ÇILGIN TAYFUN', silk: 'tayfun', passive: 'HEP OMUZ DARBESİ', ability: 'KÜKREME', abDesc: 'ÖNÜNDEKİ ENGELLER KIRILIR, DÜŞMANLAR SERSEMLER', rozet: 2, apply: S => { S.shoulder = true; S.shoulderDmg = Math.max(S.shoulderDmg, 1); } }
};
const FOODS = {
  havuc: { name: 'HAVUÇ', desc: 'KOŞUYA +1 AZAMİ CANLA BAŞLA', cost: 0, apply: S => { S.maxHp += 1; } },
  yulaf: { name: 'YULAF', desc: 'HIZ +%5', cost: 30, apply: S => { S.speed *= 1.05; } },
  seker: { name: 'KESME ŞEKER', desc: 'KOŞUYA 60 SİKKEYLE BAŞLA', cost: 40, apply: S => { S.startCoins += 60; } },
  elma: { name: 'ELMA', desc: 'İLK RUH GÜCÜ EN AZ NADİR', cost: 45, apply: () => { }, rareFirst: true }
};
const SKILLS = [
  { id: 'h1', br: 0, name: 'GÜÇLÜ BACAKLAR', max: 3, cost: 1, desc: 'HIZ +%3', apply: (S, r) => { S.speed *= 1 + 0.03 * r; } },
  { id: 'h2', br: 0, name: 'RİTİM DUYGUSU', max: 2, cost: 1, desc: 'MÜKEMMEL PENCERE +%10', apply: (S, r) => { S.perfectWin *= 1 + 0.1 * r; } },
  { id: 'h3', br: 0, name: 'HIZLI KALKIŞ', max: 1, cost: 2, desc: 'ETAPLARA 5 KOMBOYLA BAŞLA', apply: (S, r) => { S.startCombo += 5 * r; } },
  { id: 'd1', br: 1, name: 'SAĞLAM YAPI', max: 2, cost: 2, desc: 'AZAMİ CAN +1', apply: (S, r) => { S.maxHp += r; } },
  { id: 'd2', br: 1, name: 'KALIN DERİ', max: 2, cost: 1, desc: 'YAVAŞLAMA -%15', apply: (S, r) => { S.slowResist += 0.15 * r; } },
  { id: 'd3', br: 1, name: 'TOPARLANMA', max: 1, cost: 2, desc: 'BOSS YENİNCE 1 CAN YENİLE', apply: (S, r) => { S.bossHeal = r; } },
  { id: 'z1', br: 2, name: 'SEÇİCİ', max: 2, cost: 1, desc: 'KOŞU BAŞI +1 GÜÇ YENİLEME', apply: (S, r) => { S.rerolls += r; } },
  { id: 'z2', br: 2, name: 'PAZARLIKÇI', max: 2, cost: 1, desc: 'PAZARDA -%15 FİYAT', apply: (S, r) => { S.discount += 0.15 * r; } },
  { id: 'z3', br: 2, name: 'ŞANSLI', max: 2, cost: 1, desc: 'NADİR GÜÇ ŞANSI ARTAR', apply: (S, r) => { S.luck += 0.1 * r; } }
];
const BRANCHES = [{ name: 'HIZ', color: C.sky }, { name: 'DAYANIKLILIK', color: C.red }, { name: 'ZEKA', color: C.gold }];

// ---------- farm buildings (level 0 = ruined, 1 = repaired, 2-3 = upgrades) ----------
const BUILDINGS = {
  ev: { name: 'KAMARA', max: 1, up: [0], upDesc: ['SEYİR DEFTERİ'], desc: 'DENİZ\'İN KAMARASI. SEYİR DEFTERİNDE BU TUHAF YOLCULUK YAZILI.' },
  ahir: { name: 'AHIR MODÜLÜ', max: 3, up: [0, 80, 160], upDesc: ['ANTRENMAN PLANI', '+1 PUAN VE BATTANİYE RENKLERİ', '+1 PUAN, SEVİLEN YILDIZ İKİ KAT GÜÇLÜ'], desc: 'YILDIZ\'IN CAM KUBBELİ AHIRI. SEVİYE PUANLARINI ANTRENMANDA HARCA.' },
  pano: { name: 'GÖREV EKRANI', max: 3, up: [0, 60, 140], upDesc: ['3 GÖREV', '4. GÖREV YUVASI', 'GÖREV ÖDÜLLERİ +%50'], desc: 'GÖREVLER, GÜNLÜK ERZAK VE GÜNÜN KOŞUSU.' },
  ambar: { name: 'YEM DEPOSU', max: 2, up: [20, 90], upDesc: ['KOŞUDAN ÖNCE YEM SEÇ', 'İKİNCİ YEM YUVASI'], desc: 'DÜNYA\'DAN GETİRİLEN YEMLER. KOŞUDAN ÖNCE BİRİNİ SEÇ, AVANTAJLA BAŞLA.' },
  silahhane: { name: 'CEPHANELİK', max: 3, up: [30, 100, 200], upDesc: ['SİLAH SEÇ VE GELİŞTİR', 'TÜM ATIŞLAR +%20 HASAR', 'TÜM ATIŞLAR +%40 HASAR'], desc: 'EYERE TAKILAN SİLAHLAR. RİTİMLE DOKUNDUĞUNDA ATEŞ EDER.' },
  nalbant: { name: 'NAL ATÖLYESİ', max: 3, up: [50, 100, 180], upDesc: ['NAL SEÇ', 'HER NALDA +%5 HIZ', 'HER NALDA +1 AZAMİ CAN'], desc: 'FARKLI NALLAR DÖV, OYUN TARZINI DEĞİŞTİR.' },
  tapinak: { name: 'GÖZLEMEVİ', max: 3, up: [60, 120, 220], needBoon: true, upDesc: ['GÖZDE TAKIMYILDIZINI SEÇ', 'İKİLİ GÜÇ ŞANSI 2 KAT', 'NADİR GÜÇ ŞANSI +%15'], desc: 'TELESKOP YILDIZ ATLARINA ÇEVRİLİ. GÖZDE TAKIMYILDIZININ İLK GÜCÜ SENİN OLUR.' },
  jokey: { name: 'JOKEY KOĞUŞU', max: 3, up: [40, 90, 170], rozet: 1, upDesc: ['TEKNİK SEÇ', 'TEKNİK %25 HIZLI DOLAR', 'TEKNİK %50 HIZLI DOLAR'], desc: 'TUTSAK DÜNYALI JOKEYLER SANA TEKNİKLERİNİ ÖĞRETİR.' },
  veteriner: { name: 'REVİR', max: 3, up: [80, 150, 220], upDesc: ['1 KEZ, 1 CANLA KALK', '1 KEZ, 2 CANLA KALK', '2 KEZ, 2 CANLA KALK'], desc: 'İKİNCİ NEFES: YORGUN DÜŞTÜĞÜNDE AYAĞA KALK.' },
  bahce: { name: 'SERA', max: 3, up: [25, 90, 180], upDesc: ['3 TEPSİ', '5 TEPSİ', '7 TEPSİ'], desc: 'HER KOŞUDAN SONRA ÜRÜNLER BÜYÜR. HAVUÇ KRİSTAL, PANCAR ŞEKER VERİR.' }
};
const BUILD_ORDER = ['ambar', 'silahhane', 'bahce', 'nalbant', 'jokey', 'tapinak', 'veteriner'];
const DECOR = {
  saman: { name: 'SAMAN BALYALARI', cost: 10 },
  cicek: { name: 'UZAY ÇİÇEKLERİ', cost: 15 },
  fener: { name: 'NEON LAMBA', cost: 20 },
  bayrak: { name: 'IŞIK DİZİSİ', cost: 25 },
  agac: { name: 'KUBBELİ AĞAÇ', cost: 30 },
  kuyu: { name: 'SU TANKI', cost: 35 },
  cesme: { name: 'HOLOGRAM ÇEŞME', cost: 60 },
  heykel: { name: 'AKYEL HEYKELİ', cost: 90, needWin: true }
};
const HEATS = [{ name: 'NORMAL', mult: 1, rew: 1 }, { name: 'METEORLU PİST', mult: 1.12, rew: 1.5 }, { name: 'KARA DELİK PİSTİ', mult: 1.24, rew: 2 }];
const RUN_STYLES = {
  onde: { name: 'ÖNDE KOŞ', desc: 'İLK YARIDA +%8 HIZ VE UCUZ HAMLE, SONDA -%4' },
  dengeli: { name: 'DENGELİ', desc: 'SABİT TEMPO, NEFES KAZANCI +%20' },
  sondan: { name: 'SONDAN GEL', desc: 'BAŞTA -%4, SON ATAK 1.5 KAT GÜÇLÜ' }
};

const REGIONS = [
  { id: 'cayir', name: 'LUMO ÇAYIRI', song: 'cayir', bpm: 120, speed: 1.0, dens: 1.0, rivals: [0.86, 0.92, 0.97, 1.02, 1.07], boss: 'pirlanta',
    grass: C.purple, grass2: C.plum, grassD: C.magenta, dirt: C.tan, dirtD: C.brown, dirtL: C.sand, rail: C.cyan, post: C.lgray, deco: 'meadow', mud: false,
    foes: { karga: 1, domuz: 0.6, kalkanli: 0.25 }, weather: { acik: 7, yagmur: 2, ruzgar: 1 } },
  { id: 'orman', name: 'MANTAR AYI', song: 'orman', bpm: 128, speed: 1.08, dens: 1.18, rivals: [0.9, 0.95, 1.0, 1.05, 1.1], boss: 'kurt',
    grass: C.teal, grass2: C.ddgreen, grassD: C.navy, dirt: C.dgray, dirtD: C.slate, dirtL: C.gray, rail: C.magenta, post: C.purple, deco: 'forest', mud: true,
    foes: { karga: 1, domuz: 1.2, eskiya: 0.5, okcu: 0.45, kalkanli: 0.35 }, weather: { acik: 4, sis: 4, yagmur: 2 } },
  { id: 'buz', name: 'BUZ HALKASI', song: 'buz', bpm: 132, speed: 1.11, dens: 1.24, rivals: [0.91, 0.96, 1.0, 1.04, 1.08, 0.94, 0.98], boss: 'niva', tier: 1.5, field: 6,
    grass: C.blue, grass2: C.navy, grassD: C.sky, dirt: C.gray, dirtD: C.dgray, dirtL: C.lgray, rail: C.white, post: C.cyan, deco: 'ice', mud: false,
    foes: { karga: 1, domuz: 0.9, kalkanli: 0.6, okcu: 0.5, eskiya: 0.35 }, weather: { acik: 5, kar: 3, sis: 1, ruzgar: 1 } },
  { id: 'kum', name: 'KIZIL KUM', song: 'kum', bpm: 134, speed: 1.14, dens: 1.3, rivals: [0.92, 0.97, 1.01, 1.05, 1.1, 0.95, 0.99], boss: 'zarg', tier: 2, field: 7,
    grass: C.rust, grass2: C.dbrown, grassD: C.orange0, dirt: C.sand, dirtD: C.tan, dirtL: C.white, rail: C.orange, post: C.dbrown, deco: 'desert', mud: false,
    foes: { karga: 0.8, domuz: 1.0, eskiya: 0.9, okcu: 0.7, kalkanli: 0.4 }, weather: { acik: 5, kumf: 3, ruzgar: 2 } },
  { id: 'hipodrom', name: 'GALAKSİ ARENASI', song: 'hipodrom', bpm: 136, speed: 1.17, dens: 1.36, rivals: [0.93, 0.98, 1.03, 1.07, 1.12, 0.96, 1.0], boss: 'simsek', tier: 2.4, field: 7,
    grass: C.navy, grass2: C.slate, grassD: C.ink, dirt: C.orange0, dirtD: C.rust, dirtL: C.tan, rail: C.cyan, post: C.lgray, deco: 'stadium', mud: false, night: true,
    foes: { karga: 0.8, domuz: 0.8, eskiya: 1.0, okcu: 0.8, kalkanli: 0.5 }, weather: { acik: 6, yagmur: 3, ruzgar: 2 } }
];
REGIONS[0].tier = 0; REGIONS[0].field = 5; REGIONS[1].tier = 1; REGIONS[1].field = 5;
// v5 put two planets between Mantar Ayı and the arena: saves from v4 map their region index through this table
const LAST_REGION = REGIONS.length - 1;
const REGION_V4 = [0, 1, LAST_REGION];
const regionIdx = id => REGIONS.findIndex(r => r.id === id);
const BOSS_CRYSTALS = [10, 15, 18, 21, 25];
const BOSSES = {
  pirlanta: { name: 'PRENS KRİSTALO', look: 'kristalo', drain: 2.0, attacks: ['mud', 'bale', 'karga'], attacks2: ['karga3', 'mud'], attacks3: ['mudrow', 'bale'], sig: 'kibir', taunt: 'IŞILTIMA BAK DÜNYALI. SONRA TOZUMU YUT.', color: C.magenta, title: 'LUMO\'NUN KİBİRLİ KRİSTAL PRENSİ' },
  kurt: { name: 'ULUYAN GORM', look: 'gorm', drain: 2.4, attacks: ['log', 'wolf', 'domuz'], attacks2: ['howl', 'wolf'], attacks3: ['stomp', 'domuz'], sig: 'uluma', taunt: 'AUUU! BU ORMANDA BENDEN HIZLISI YOK!', color: C.green, title: 'MANTAR AYI\'NIN YENİLMEZİ' },
  niva: { name: 'BUZ KRALİÇESİ NİVA', look: 'niva', drain: 2.5, attacks: ['icicle', 'karga', 'bale'], attacks2: ['icerow', 'icicle'], attacks3: ['icicle3', 'icerow'], sig: 'ayaz', taunt: 'BURADA HER ŞEY DONAR. SEN DE.', color: C.cyan, title: 'BUZ HALKASI\'NIN SOĞUK HÜKÜMDARI' },
  zarg: { name: 'KUM SOLUCANI ZARG', look: 'zarg', drain: 2.65, attacks: ['burrow', 'eskiya', 'domuz'], attacks2: ['sandwave', 'burrow', 'okcu'], attacks3: ['burrow2', 'sandwave'], sig: 'kum', taunt: 'KUMUN ALTINDAN SENİ İZLİYORUM...', color: C.orange, title: 'KIZIL KUM\'UN ÇÖL CANAVARI' },
  simsek: { name: 'VOLTRAK', horse: ['robot', 'voltrak'], drain: 2.8, attacks: ['bolt', 'bale', 'eskiya'], attacks2: ['bolt3', 'okcu'], attacks3: ['civirow', 'bolt3'], sig: 'hile', taunt: 'HESAPLAMA: KAZANMA İHTİMALİN %0.', color: C.red, title: 'GRAX\'IN ROBOT ŞAMPİYONU' }
};
const RIVAL_LOOKS = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15', 'r16'];
// named rivals per region (index = region). style: sondan / onde / itici / atici (shoots on the beat) / zikzak (cuts in)
const NAMED_RIVALS = [
  [{ id: 'glorb', name: 'GLORB', style: 'sondan', look: 'n5' }, { id: 'vuum', name: 'KIZIL VUUM', style: 'itici', look: 'n1' }, { id: 'pip', name: 'PİP-PİP', style: 'zikzak', look: 'n7' }],
  [{ id: 'gece', name: 'GECE KANADI', style: 'onde', look: 'n6' }, { id: 'kiskac', name: 'DEMİR KISKAÇ', style: 'itici', look: 'n3' }, { id: 'mantis', name: 'SİSLİ MANTİS', style: 'atici', look: 'n8' }],
  [{ id: 'buzdis', name: 'BUZDİŞ', style: 'itici', look: 'n9' }, { id: 'aurora', name: 'AURORA', style: 'onde', look: 'n10' }, { id: 'kar', name: 'KAR TANESİ', style: 'zikzak', look: 'n14' }],
  [{ id: 'tozkiran', name: 'TOZKIRAN', style: 'atici', look: 'n11' }, { id: 'zib', name: 'ÜÇ GÖZ ZİB', style: 'sondan', look: 'n12' }, { id: 'serap', name: 'SERAP', style: 'onde', look: 'n15' }],
  [{ id: 'alev', name: 'ALEV KUYRUK', style: 'onde', look: 'n4' }, { id: 'golge', name: 'GRAX\'IN GÖLGESİ', style: 'sondan', look: 'n2' }, { id: 'nova', name: 'NOVA', style: 'zikzak', look: 'n13' }]
];
const STYLE_COL = { itici: C.salmon, onde: C.sky, sondan: C.green, atici: C.gold, zikzak: C.magenta };
const STYLE_SHORT = { sondan: 'SONDAN GELİR', onde: 'ÖNDE KAÇAR', itici: 'OMUZ ATAR', atici: 'PLAZMA ATAR', zikzak: 'ÖNÜNÜ KESER' };
const STYLE_TRICK = { atici: 'NİŞAN ALIR, "!" SONRA PLAZMA ATAR', zikzak: 'ŞERİT ŞERİT KAYAR, ÖNÜNÜ KESER' };
const RIVAL_BY_ID = {};
NAMED_RIVALS.forEach((list, reg) => list.forEach(r => { r.region = reg; RIVAL_BY_ID[r.id] = r; }));
// Rakip dosyaları: a 1v1 duel win opens the rival's page in the logbook and their side of the story
const RIVAL_INFO = {
  glorb: { race: 'JÖLE BEYİNLİ BİLGİN', home: 'KÜTÜPHANE GEZEGENİ ZİLA', trick: 'SONDAN GELİR, SONDA ATAKLAR',
    taunt: 'HESAPLARIMA GÖRE KAYBEDECEKSİN.',
    lose: ['HESAPLARIM YANLIŞMIŞ. SENİN RİTMİN DENKLEMDE YOKTU.', 'KÜTÜPHANEMİ ÖZLÜYORUM DÜNYALI. KUPAYI ALIRSAN KAPIYI AÇIK BIRAK, OLUR MU?'],
    text: 'GLORB, ZİLA\'NIN EN GENÇ BİLGİNİYDİ. YARIŞ HESAPLARINI İNCELEMEK İÇİN TRİBÜNE GELDİ; GRAX ONU HESAPLARIYLA BİRLİKTE PİSTE ATTI. HER YARIŞTAN SONRA NOT TUTUYOR: BİR GÜN DENKLEMİ ÇÖZÜP EVE DÖNECEK.' },
  vuum: { race: 'DOKUZ KOLLU VATOZ SÜRÜCÜSÜ', home: 'OKYANUS AYI TALASSA', trick: 'YANAŞIR, "!" SONRA OMUZ ATAR',
    taunt: 'YOLUMDAN ÇEKİL, YOKSA İTERİM!',
    lose: ['İTEMEDİM Mİ? VAY... EYERE SAĞLAM OTURUYORSUN.', 'YEDİ YAVRUM VAR, HER BİRİNE BİR KOL. HEPSİNE SENİ ANLATACAĞIM.'],
    text: 'VUUM, TALASSA\'DA KARGO ÇEKEN BİR VATOZ SÜRÜCÜSÜYDÜ. DENİZ TRAFİĞİNDE İTİŞEREK BÜYÜDÜ, PİSTTE DE ÖYLE YAPIYOR. GRAX ONU "SEYİRCİ KAVGA SEVER" DİYE SEÇTİ. OYSA TEK İSTEDİĞİ YEDİ YAVRUSUNA DÖNMEK.' },
  gece: { race: 'GECE GÖZLÜ YARASA HALKI', home: 'GÜNEŞSİZ GEZEGEN NOKS', trick: 'ÖNDE KAÇAR, MAYIN BIRAKIR',
    taunt: 'ÖNÜMÜ GÖREMEZSİN BİLE.',
    lose: ['GÖLGEMİ YAKALADIN DÜNYALI. KİMSE YAPAMAMIŞTI.', 'TRİBÜNDE BENİM GİBİ KULAKLI BİR KIZ GÖRÜRSEN... EL SALLA. KIZ KARDEŞİM O.'],
    text: 'GECE KANADI, GÜNEŞİN HİÇ DOĞMADIĞI NOKS\'TAN. ARENA IŞIKLARI GÖZLERİNİ YAKIYOR, O YÜZDEN HEP EN ÖNDE KAÇIYOR. KAÇIRILDIĞI GECE KIZ KARDEŞİ DE YANINDAYDI; ONU HÂLÂ TRİBÜNLERDE ARIYOR.' },
  kiskac: { race: 'MADEN ROBOTU', home: 'ASTEROİT KUŞAĞI K-7', trick: 'YANAŞIR, "!" SONRA KISKACIYLA İTER',
    taunt: 'HEDEF: DÜNYALI. İŞLEM: EZ.',
    lose: ['HATA. HATA. İKİNCİ OLMAK PROGRAMIMDA YOK.', 'BİP-0 BANA YENİ BİR KELİME ÖĞRETTİ: ARKADAŞ. SEN... ARKADAŞ MISIN?'],
    text: 'DEMİR KISKAÇ, ASTEROİT KUŞAĞINDA TEK BAŞINA KAZI YAPAN BİR MADEN ROBOTUYDU. GRAX\'IN GEMİSİ ONU HURDA DİYE TOPLADI. PROGRAMINDA TEK BİR EMİR VAR: KAZAN. BİP-0 ONA GİZLİCE YENİ KELİMELER ÖĞRETİYOR.' },
  alev: { race: 'ATEŞ KUŞU BİNİCİSİ', home: 'YANARDAĞ GEZEGENİ PİRA', trick: 'ÖNDE KAÇAR, MAYIN BIRAKIR',
    taunt: 'PİRA\'DA KİMSE BENİ GEÇEMEZDİ!',
    lose: ['ÜÇ SEZONDUR İLK KEZ BİRİ BANA ARKASINI GÖSTERDİ.', 'BİR SIR VEREYİM DÜNYALI: KUPAYI KAZANAN DEĞİL, KUPAYI AÇAN EVE DÖNER.'],
    text: 'ALEV KUYRUK, PİRA\'NIN YENİLMEZ ŞAMPİYONUYDU. ARENADA ÜÇ SEZONDUR HEP İKİNCİ. GURURU KUŞUNUN KUYRUĞU KADAR PARLAK AMA BİR ŞEY BİLİYOR: KUPA BİR ÖDÜL DEĞİL, BİR ANAHTAR.' },
  golge: { race: 'GRAX\'IN İLK TUTSAĞI', home: 'BİLİNMİYOR', trick: 'SONDAN GELİR, SONDA ATAKLAR',
    taunt: 'BEN BU PİSTİN KENDİSİYİM.',
    lose: ['YİRMİ YIL ÖNCE BİR DÜNYALI DA BENİ BÖYLE GEÇMİŞTİ. AYNI GÖZLER.', 'ANNEN YAŞIYOR DENİZ. GRAX ONU HER GECE TRİBÜNE OTURTUYOR. KUPAYI AL.'],
    text: 'GÖLGE, GRAX\'IN KAÇIRDIĞI İLK YARIŞÇI; ADINI KİMSE HATIRLAMIYOR. YİRMİ YIL ÖNCEKİ FİNALDE AKYEL\'İN YANINDA KOŞTU. IŞIKLAR SÖNMEDEN ÖNCE ONU ÖNDE GÖRDÜ. O GECEDEN BERİ GRAX İÇİN KOŞUYOR AMA ONA İNANMIYOR.' },
  pip: { race: 'MİNİK KUŞ HALKI', home: 'AĞAÇ GEZEGENİ TİRİ', trick: STYLE_TRICK.zikzak,
    taunt: 'PİP! YAKALA BENİ YAKALAYABİLİRSEN!',
    lose: ['PİP... SEN BENDEN BİLE HIZLI ŞERİT DEĞİŞTİRİYORSUN!', 'ANNEM HEP "UÇMAYI ÖĞREN" DERDİ. BEN KOŞMAYI SEÇTİM. SENİ GÖRÜNCE İYİ Kİ DEDİM.'],
    text: 'PİP-PİP, TİRİ\'NİN DEV AĞAÇLARINDA YAŞAYAN MİNİK KUŞ HALKINDAN. HENÜZ UÇAMIYOR, O YÜZDEN DURMADAN KOŞUYOR. GRAX ONU "SEYİRCİ ŞİRİNLİK SEVER" DİYE KAFESİNE ATTI. HER YARIŞTA ŞERİTTEN ŞERİDE ZIPLIYOR, KİMSE ONU ÖNCEDEN TAHMİN EDEMİYOR.' },
  mantis: { race: 'SİS ORMANI AVCISI', home: 'NEM GEZEGENİ HUMA', trick: STYLE_TRICK.atici,
    taunt: 'SİSİN İÇİNDEN SENİ GÖRÜYORUM.',
    lose: ['NİŞANIM HİÇ ŞAŞMAZDI. SEN RİTİMLE KAÇIYORSUN, BU ADİL DEĞİL... AMA GÜZEL.', 'HUMA\'DA YAĞMUR HİÇ DİNMEZ. KUPAYI ALIRSAN BİRAZ GÜNEŞ GETİR BANA.'],
    text: 'SİSLİ MANTİS, HUMA\'NIN SİSLİ ORMANLARINDA AV PEŞİNDEN KOŞAN SABIRLI BİR AVCI. BİR VURUŞ BEKLER, NİŞAN ALIR, SONRA ATAR. GRAX ONA PLAZMA TÜFEĞİ VERDİ; O İSE SADECE ORMANINI ÖZLÜYOR.' },
  buzdis: { race: 'BUZUL DEVİ', home: 'DONMUŞ AY GLASİ', trick: 'YANAŞIR, "!" SONRA OMUZ ATAR',
    taunt: 'SOĞUK SENİ YAVAŞLATACAK DÜNYALI.',
    lose: ['BUZUM ÇATLADI... BÖYLE SICAK BİR RİTİM HİÇ GÖRMEMİŞTİM.', 'GLASİ\'DE KARDEŞLERİM BENİ BEKLİYOR. HER KIŞ BİR HEYKEL YAPARLAR. BU KIŞ SENİNKİNİ YAPSINLAR.'],
    text: 'BUZDİŞ, GLASİ AYININ DEV BUZUL HALKINDAN. ADIMLARI YAVAŞ AMA OMUZLARI DAĞ GİBİ. GRAX ONU BUZUN İÇİNDE UYURKEN BULDU VE UYANDIRDI. O GÜNDEN BERİ PİSTTE KİMSEYE YOL VERMİYOR.' },
  aurora: { race: 'IŞIK SÜZÜCÜ', home: 'KUTUP GEZEGENİ LUMEN', trick: 'ÖNDE KAÇAR, MAYIN BIRAKIR',
    taunt: 'IŞIĞIMI KOVALA, YETİŞEBİLİRSEN.',
    lose: ['IŞIĞIMI GEÇTİN. GÖKYÜZÜ SANA DA RENK VERDİ DEMEK.', 'LUMEN\'DE GECELER YEŞİL PARLAR. SENİN DÜNYANDA DA ÖYLE Mİ?'],
    text: 'AURORA, LUMEN\'İN KUTUP IŞIKLARINDAN DOĞAN BİR IŞIK SÜZÜCÜ. KOŞARKEN ARKASINDA RENKLİ BİR İZ BIRAKIR. GRAX ONU "EN GÜZEL YAYIN GÖRÜNTÜSÜ" DİYE TOPLADI; KANATLARI KAFESTE SOLUYOR.' },
  kar: { race: 'KRİSTAL CİN', home: 'BUZ HALKASI', trick: STYLE_TRICK.zikzak,
    taunt: 'HER KAR TANESİ FARKLIDIR. BEN EN HIZLISIYIM!',
    lose: ['ERİDİM Mİ? HAYIR... SADECE BİRAZ UTANDIM.', 'NİVA KRALİÇE BENİ HER GECE DONDURUR, SABAH ÇÖZER. BİR GÜN SICAK BİR YERDE UYANMAK İSTİYORUM.'],
    text: 'KAR TANESİ, BUZ HALKASI\'NIN KRİSTAL CİNLERİNDEN. NİVA\'NIN SARAYINDA DOĞDU, ONUN EMRİNDE KOŞUYOR. ŞERİT ŞERİT SÜZÜLÜR, ÖNÜNE GEÇİP SENİ YAVAŞLATMAYI SEVER. KİMSE ONUN GÜLDÜĞÜNÜ GÖRMEDİ.' },
  tozkiran: { race: 'ÇÖL HAYDUDU', home: 'KIZIL KUM', trick: STYLE_TRICK.atici,
    taunt: 'KUM GÖZÜNE KAÇMASIN DÜNYALI!',
    lose: ['NİŞANIM KUMA GÖMÜLDÜ. SENİ VURAMADIM, HELAL OLSUN.', 'BİR ZAMANLAR KERVANLARI KORURDUM. GRAX BENİ HAYDUT YAPTI. BELKİ SEN BİZİ YENİDEN İYİ YAPARSIN.'],
    text: 'TOZKIRAN, KIZIL KUM\'UN KERVAN YOLLARINI KORUYAN BİR MUHAFIZDI. ZARG ÇÖLÜ YUTUNCA GRAX\'IN ŞOVUNA SATILDI. ARTIK PİSTTE KUM KADAR SICAK PLAZMA ATIYOR, AMA HÂLÂ KERVAN ŞARKILARI MIRILDANIYOR.' },
  zib: { race: 'ÜÇ GÖZLÜ TÜCCAR', home: 'PAZAR GEZEGENİ OBO', trick: 'SONDAN GELİR, SONDA ATAKLAR',
    taunt: 'ÜÇ GÖZÜM VAR, ÜÇÜ DE KAZANMAMI GÖRÜYOR.',
    lose: ['ÜÇ GÖZÜM DE AYNI ŞEYİ GÖRDÜ: SENİN SIRTINI.', 'MOKO BENİM KUZENİM. ONA SÖYLE, BORCUMU UNUTMADIM.'],
    text: 'ZİB, OBO PAZARININ EN PAZARLIKÇI TÜCCARIYDI. GRAX\'LA BİR BAHSE GİRDİ VE KAYBETTİ; ŞİMDİ BORCUNU PİSTTE ÖDÜYOR. YARIŞI HEP SONA SAKLAR, ÇÜNKÜ "EN İYİ FİYAT SON ANDA ÇIKAR" DER.' },
  serap: { race: 'SERAP RUHU', home: 'BİLİNMİYOR', trick: 'ÖNDE KAÇAR, MAYIN BIRAKIR',
    taunt: 'GÖRDÜĞÜN BEN MİYİM, YOKSA SERAP MI?',
    lose: ['DEMEK GERÇEKTİM. SEN DE ÖYLEYMİŞSİN.', 'ÇÖLDE BİR KAPI GÖRDÜM DENİZ. IŞIKLI BİR KAPI. SERAP DEĞİLDİ, EMİNİM.'],
    text: 'SERAP, KIZIL KUM\'UN SICAĞINDA TİTREŞEN BİR RUH. KİMİ ONU GÖRDÜĞÜNÜ SANIR, KİMİ GÖRMEZ. GRAX BİLE ONU NASIL YAKALADIĞINI BİLMİYOR. ÖNDE KAÇAR VE ARKASINDA KUM MAYINLARI BIRAKIR.' },
  nova: { race: 'YILDIZ ÇOCUĞU', home: 'SÖNMÜŞ YILDIZ VEGA-9', trick: STYLE_TRICK.zikzak,
    taunt: 'BEN BİR YILDIZDAN DOĞDUM. SEN BİR ATTAN!',
    lose: ['BİR AT BİR YILDIZI GEÇTİ. BUNU YILDIZLARA ANLATACAĞIM.', 'GRAX\'IN TAHTININ ARKASINDA BİR KAPI VAR. KUPA ONUN ANAHTARI. UNUTMA.'],
    text: 'NOVA, SÖNEN BİR YILDIZIN SON IŞIĞINDAN DOĞDU. GRAX ONU ARENA\'NIN TAVANINDAN SARKITIR, SEYİRCİ YILDIZ GİBİ PARLADIĞINI SANSIN DİYE. HIZLI DÜŞÜNÜR, DAHA HIZLI ŞERİT DEĞİŞTİRİR.' }
};
const ETAP_INFO = {
  sprint: { name: 'SPRİNT', short: 'İLK SIRALARA GİR', icon: 'run' },
  parkur: { name: 'ENGEL PARKURU', tiny: 'PARKUR', short: 'HASARSIZ GEÇ', icon: 'shoe' },
  kovala: { name: 'KARA DELİK KAÇIŞI', tiny: 'KAÇIŞ', short: 'KARA DELİKTEN KAÇ', icon: 'swirl' },
  baskin: { name: 'KORSAN BASKINI', tiny: 'BASKIN', short: 'KORSANLARI VUR', icon: 'w_yay' },
  panayir: { name: 'UZAY PAZARI', tiny: 'PAZAR', short: 'ALIŞVERİŞ', icon: 'stall' },
  cesme: { name: 'DİNLENME KAPSÜLÜ', tiny: 'KAPSÜL', short: 'DİNLEN', icon: 'fountain' },
  kaos: { name: 'KAOS KAPISI', tiny: 'KAOS', short: '1 CAN VER', icon: 'swirl' },
  olay: { name: 'YOL OLAYI', tiny: 'OLAY', short: 'BİR SEÇİM', icon: 'scroll' },
  duello: { name: 'DÜELLO', short: 'RAKİBİ GEÇ', icon: 'duel' },
  boss: { name: 'ŞAMPİYON YARIŞI', tiny: 'ŞAMPİYON', short: 'ŞAMPİYONU GEÇ', icon: 'crown' }
};
const ETAP_TIPS = {
  sprint: 'İLK SIRALARA GİR! RİTİMLE HIZLAN. RAKİBİN ARKASINDA KALIRSAN RÜZGAR SİPERİ DOLAR, SONRA YANA ÇIK.',
  parkur: 'ENGELLER SIK. ENGELE YAKLAŞINCA SIÇRA: TEMİZ ATLAYIŞ HIZ VERİR, ERKEN SIÇRARSAN SIYIRIRSIN. HASARSIZ BİTİRİRSEN ALTIN MADALYA.',
  kovala: 'KARA DELİK ARKANDA! YAVAŞLARSAN SENİ YUTAR. KOMBOYU KORU.',
  reyting: 'KIL PAYI, SOLLAMA, TEMİZ ATLAYIŞ VE KOMBO SEYİRCİYİ COŞTURUR. DOLUNCA SPONSOR HEDİYE ATAR; UZUN SÜRE SIFIRDA KALIRSAN GRAX METEOR YAĞDIRIR.',
  rgate: 'YAKLAŞIRKEN 2 NOTA VUR, KAPININ IŞIKLARI YANSIN. AÇIK KAPI HIZ VE NEFES VERİR; ISKALARSAN SAYAÇ SIFIRLANIR, KAPALI KAPIDA YAVAŞLARSIN.',
  scan: 'HER VURUŞTA BİR ŞERİT KAYAR, KENARA GELİNCE DÖNER. MÜZİĞİ DİNLE, NEREDE OLACAĞINI TAHMİN ET. ÜSTÜNDEN SIÇRANMAZ.',
  duello: 'BİRE BİR YARIŞ! RAKİPTEN ÖNCE BİTİR, YOKSA 1 CAN GİDER. ARKASINDA KALIRSAN SİPER DOLAR; ATIŞLARIN ONU BİR AN SERSEMLETİR.',
  baskin: 'UZAY KORSANLARI SALDIRIYOR! RİTİMLE DOKUN, EYERDEKİ SİLAH ATEŞ ETSİN. YOLUN YARISINDA KAPTANLARI GELİR.',
  boss: 'FARK ÇUBUĞUNU DOLDUR: RİTİMLE VUR, ATEŞ ET, HAMLE YAP. ŞAMPİYONUN 3 AŞAMASI VAR; YORULUNCA ATIŞLARIN İKİ KAT İŞLER.',
  zorlu: 'ZORLU ETAP: DAHA SIK ENGEL VE DÜŞMAN, İKİ KAT ÖDÜL.',
  yagmur: 'ASİT YAĞMURU: ŞERİT DEĞİŞTİRMEK YAVAŞLAR, JÖLE BİRİKİNTİSİ ÇOK.',
  sis: 'NEBULA SİSİ: ENGELLERİ GEÇ GÖRÜRSÜN. KULAĞIN RİTİMDE OLSUN.',
  ruzgar: 'GÜNEŞ RÜZGARI: ARKADAN ESİNCE HIZLANIR, ÖNDEN ESİNCE YAVAŞLARSIN.',
  kar: 'KAR FIRTINASI: PİST KAYGAN, ŞERİT DEĞİŞTİRMEK BİRAZ YAVAŞ. ENGELE ERKEN HAZIRLAN.',
  kumf: 'KUM FIRTINASI: UZAĞI GÖREMEZSİN VE RÜZGAR ESER. RİTMİ DİNLE, ARKA RÜZGARI YAKALA.',
  hamle: 'NEFES: AŞAĞI KAYDIR YA DA ALTTAKİ ÇİFT OKA BAS, HAMLE YAP. SAKLADIĞIN NEFES SON DÜZLÜKTE SON ATAĞA DÖNÜŞÜR.',
  nota_a: 'ALTIN NOTAYI MÜKEMMEL VURURSAN SİLAHIN ÖZEL ATIŞ YAPAR. NOTA OLMAYAN BOŞLUKTA DOKUNMA, RAHATÇA ŞERİT DEĞİŞTİR.',
  nota_d: 'ÇİFT NOTA: İKİ İŞARET ART ARDA GELİR. VURUŞTA VE ARADA İKİ KEZ DOKUN.',
  nota_h: 'UZUN NOTA: VURUŞTA BAS VE PARMAĞINI KALDIRMA, NEFES TOPLA. BASILIYKEN KAYDIRARAK YÖN DE DEĞİŞTİREBİLİRSİN.',
  viraj: 'VİRAJ: İÇ KULVAR DAHA KISA. OKLARIN GÖSTERDİĞİ İÇ TARAFA GEÇ, DIŞTA KALAN GERİDE KALIR.'
};
const TIP_TITLES = { reyting: 'REYTİNG', rgate: 'RİTİM KAPISI', scan: 'TARAYICI LAZER', hamle: 'NEFES VE HAMLE', nota_a: 'ALTIN NOTA VE ES', nota_d: 'ÇİFT NOTA', nota_h: 'UZUN NOTA', viraj: 'VİRAJ', zorlu: 'ZORLU ETAP' };
// rhythm charts: one char per beat in a 4/4 bar. n normal, a accent (gold), d double (beat + half beat), h hold start, _ hold continues, - rest
const NOTE_POOLS = {
  tut: ['nnnn'],
  basic: ['annn', 'annn', 'anan', 'ann-', 'an-n'],
  t1: ['annn', 'anan', 'ann-', 'an-n', 'andn', 'and-', 'adnn', 'ah_n', 'anh_'],
  t2: ['andn', 'and-', 'adan', 'ah_n', 'anh_', 'h_an', 'an-d', 'adnd', 'a-dn'],
  t3: ['adad', 'adnd', 'adh_', 'h_ad', 'adan', 'ad-d', 'dndn'],
  rew: ['anan', 'a-a-', 'anan', 'a-an', 'aaan'],
  breath: ['h_h_', 'h_an', 'anh_']
};
const WEATHERS = {
  acik: { name: 'AÇIK GÖK', icon: null },
  yagmur: { name: 'ASİT YAĞMURU', icon: 'rain' },
  sis: { name: 'NEBULA SİSİ', icon: 'fog' },
  ruzgar: { name: 'GÜNEŞ RÜZGARI', icon: 'gust' },
  kar: { name: 'KAR FIRTINASI', icon: 'spark' },
  kumf: { name: 'KUM FIRTINASI', icon: 'wind' }
};

// ---------- chaos gate: a curse for 3 stages, then a blessing ----------
const CHAOS_CURSES = [
  { id: 'agir', name: 'AĞIR TOYNAK', desc: 'HIZ -%10', apply: S => { S.speed *= 0.9; } },
  { id: 'dar', name: 'DAR PENCERE', desc: 'RİTİM PENCERESİ -%30', apply: S => { S.perfectWin *= 0.7; S.goodWin *= 0.85; } },
  { id: 'kirik', name: 'KIRIK LENS', desc: 'ATIŞ HASARI -%50', apply: S => { S.shotDmg *= 0.5; } },
  { id: 'sis', name: 'NEBULA SİSİ', desc: 'HER ETAP SİSLİ', apply: S => { S.forceFog = true; } },
  { id: 'pahali', name: 'PAHALI YOL', desc: 'PAZAR +%60 PAHALI', apply: S => { S.discount -= 0.6; } },
  { id: 'kalabalik', name: 'KALABALIK', desc: 'DÜŞMANLAR %50 FAZLA', apply: S => { S.moreFoes *= 1.5; } }
];
const CHAOS_BLESS = [
  { id: 'hiz', name: 'KAOS HIZI', desc: 'HIZ +%12', apply: S => { S.speed *= 1.12; } },
  { id: 'can', name: 'KAOS YÜREĞİ', desc: 'AZAMİ CAN +2', apply: S => { S.maxHp += 2; }, onActive: r => { r.hp += 2; } },
  { id: 'ok', name: 'KAOS IŞINI', desc: 'ATIŞ HASARI +%80', apply: S => { S.shotDmg *= 1.8; } },
  { id: 'kese', name: 'KAOS KESESİ', desc: 'SİKKE KAZANCI X2', apply: S => { S.coinMult *= 2; } },
  { id: 'kalkan', name: 'KAOS KALKANI', desc: 'HER ETAP 1 KALKAN', apply: S => { S.shield += 1; } },
  { id: 'sifa', name: 'KAOS ŞİFASI', desc: 'ETAP SONU +1 CAN', apply: S => { S.etapHeal = 1; } }
];
const CHAOS_BY_ID = {}; CHAOS_CURSES.concat(CHAOS_BLESS).forEach(c => CHAOS_BY_ID[c.id] = c);

// ---------- road events (between tracks, in deep space) ----------
const EVENTS = [
  { id: 'tay', title: 'SIKIŞMIŞ YAVRU', icon: 'heart', text: 'HURDA YIĞININA SIKIŞMIŞ MİNİCİK BİR UZAYLI YAVRUSU. ANNESİ ORTALIKTA YOK.',
    choices: [
      { label: 'ÇEKİP ÇIKAR', desc: '+1 AZAMİ CAN', fn: r => { r.bonusMaxHp++; r.hp++; return 'YAVRU SEVİNÇLE IŞILDADI. KALBİN ISINDI.'; } },
      { label: '20 SİKKE BIRAK', desc: '+8 KRİSTAL', req: r => r.coins >= 20, fn: r => { r.coins -= 20; r.yonca += 8; return 'BİR DEVRİYE YAVRUYU ALDI, SANA KRİSTAL VERDİ.'; } },
      { label: 'YOLUNA DEVAM ET', desc: 'HİÇBİR ŞEY', fn: () => 'ARKANDAN İNCE BİR BİPLEME DUYDUN...' }
    ] },
  { id: 'kumar', title: 'ÜÇ GÖZLÜ KUMARBAZ', icon: 'coin0', text: 'ÜÇ ZAR, ÜÇ GÖZ! İKİSİ YILDIZ GELİRSE SİKKEN İKİ KATINA ÇIKAR!',
    choices: [
      { label: '30 SİKKE YATIR', desc: '%50 ŞANS: +30', req: r => r.coins >= 30, fn: r => { if (rnd() < 0.5) { r.coins += 30; return 'İKİ YILDIZ! KAZANDIN.'; } r.coins -= 30; return 'KARA DELİK... KUMARBAZ ÜÇ GÖZÜYLE GÜLÜMSEDİ.'; } },
      { label: 'HEPSİNİ YATIR', desc: '%45 ŞANS: İKİ KAT', req: r => r.coins >= 10, fn: r => { if (rnd() < 0.45) { r.coins *= 2; return 'İNANILMAZ! KESEN DOLDU.'; } r.coins = 0; return 'KESEN BOŞALDI. DERS OLSUN.'; } },
      { label: 'UZAK DUR', desc: 'HİÇBİR ŞEY', fn: () => 'AKILLICA.' }
    ] },
  { id: 'okcu', title: 'EMEKLİ NİŞANCI', icon: 'w_yay', text: 'IŞIK YAYI MI O? BEN ONLARI PİLLER İCAT EDİLMEDEN KULLANIRDIM. VER, BİR BAKAYIM.',
    choices: [
      { label: '40 SİKKEYE AYARLAT', desc: 'ATIŞ HASARI +%50 (BU KOŞU)', req: r => r.coins >= 40, fn: r => { r.coins -= 40; r.shotBonus = (r.shotBonus || 0) + 0.5; return 'LENSLER JİLET GİBİ PARLADI.'; } },
      { label: 'TAVSİYE İSTE', desc: 'SONRAKİ ETAP 15 KOMBOYLA BAŞLA', fn: r => { r.nextCombo = 15; return '"NEFES AL, VURUŞU BEKLE, BIRAK. UZAYDA DA ÖYLE."'; } }
    ] },
  { id: 'sunak', title: 'YILDIZ SUNAĞI', icon: 'swirl', text: 'BOŞLUKTA SÜZÜLEN BİR SUNAK. ÜSTÜNDE TOYNAK İZİ ŞEKLİNDE BİR TAKIMYILDIZ PARLIYOR.',
    choices: [
      { label: '1 CAN ADA', desc: 'EN AZ NADİR BİR YILDIZ GÜCÜ', req: r => r.hp > 1, fn: r => { r.hp--; r.rareNext = true; r.pendingBoon = R.pick(SPIRIT_KEYS); return 'SUNAK PARLADI. BİR TAKIMYILDIZ SENİ SEÇTİ.'; } },
      { label: 'DİLEK TUT', desc: '+1 CAN', fn: r => { r.hp++; r.healCap = true; return 'İÇİNİ BİR SERİNLİK KAPLADI.'; } }
    ] },
  { id: 'iz', title: 'ESKİ BİR SİNYAL', icon: 'shoe', text: 'TELSİZDE CIZIRTILI BİR SES: "BURASI AKYEL... DUYAN VAR MI?" SİNYAL YİRMİ YILLIK.',
    choices: [
      { label: 'SİNYALİ TAKİP ET', desc: '+6 KRİSTAL', fn: r => { r.yonca += 6; META.flags.izler = true; return 'SİNYAL BİR ENKAZDA KESİLDİ. İÇERİDE KIRMIZI BEYAZ ESKİ BİR KASK VARDI.'; } },
      { label: 'YOLUNA DÖN', desc: '+15 SİKKE', fn: r => { r.coins += 15; return 'ENKAZDA BİR KESE SİKKE BULDUN.'; } }
    ] },
  { id: 'demirci', title: 'GEZGİN DEMİRCİ', icon: 'hammer', text: 'KARGO GEMİSİNDE ÖRSÜ OLAN DÖRT KOLLU BİR DEMİRCİ: SİLAHINA BİR ÇEKİÇ VURAYIM MI?',
    choices: [
      { label: '50 SİKKE VER', desc: 'DEMİRCİ ÇEKİCİ: SİLAHINI DEĞİŞTİR', req: r => r.coins >= 50 && (r.hammers || 0) < 2, fn: r => { r.coins -= 50; r.pendingHammer = true; return 'ÖRS ÇINLADI, KIVILCIMLAR BOŞLUĞA SAÇILDI.'; } },
      { label: 'SOLUKLAN', desc: '+1 CAN', fn: r => { r.hp++; return 'DEMİRCİ SANA SU VERDİ. BİRAZ DİNLENDİN.'; } }
    ] },
  { id: 'tuzak', title: 'KORSAN PUSUSU', icon: 'skull', text: 'YOLU KESEN UZAY KORSANLARI BAĞIRIYOR: KESEYİ VER, GEÇ!',
    choices: [
      { label: 'SAVAŞ', desc: 'BASKIN ETABI, ÖDÜL X2', fn: r => { r.pendingNode = { type: 'baskin', reward: { kind: 'coins', n: 50 }, elite: true, weather: 'acik' }; return 'YILDIZ ŞAHLANDI!'; } },
      { label: '30 SİKKE ÖDE', desc: 'SORUNSUZ GEÇ', req: r => r.coins >= 30, fn: r => { r.coins -= 30; return 'KORSANLAR GÜLEREK YOLU AÇTI.'; } },
      { label: 'KAÇMAYI DENE', desc: '%50: 1 CAN KAYBI', fn: r => { if (rnd() < 0.5) { r.hp = Math.max(1, r.hp - 1); return 'BİR LAZER SIYIRDI. -1 CAN.'; } return 'TOZU DUMANA KATTIN, KAÇTIN!'; } }
    ] }
];

// v5.1 · planet events (reg: only on these planets) and a station-wide one
EVENTS.push(
  { id: 'kargo', reg: ['buz'], title: 'DONMUŞ KARGO', icon: 'gift', text: 'BUZ HALKASINDA DONMUŞ BİR KARGO KAPSÜLÜ. İÇİNDEN TIKIRTI GELİYOR.',
    choices: [
      { label: '20 SİKKEYE ISIT', desc: 'GÜVENLİ: KRİSTAL, BELKİ ŞEKER', req: r => r.coins >= 20, fn: r => { r.coins -= 20; r.yonca += 6; if (rnd() < 0.5) { r.seker++; return 'BUZ ERİDİ: İÇİNDE KRİSTALLER VE BİR KESME ŞEKER!'; } return 'BUZ ERİDİ: KAPSÜL KRİSTAL DOLUYMUŞ.'; } },
      { label: 'TEKMEYLE KIR', desc: '%50: +35 SİKKE, %50: -1 CAN', fn: r => { if (rnd() < 0.5) { r.coins += 35; return 'KAPSÜL PATLADI, SİKKELER SAÇILDI!'; } r.hp = Math.max(1, r.hp - 1); return 'BİR BUZ PARÇASI SEKTİ. -1 CAN.'; } },
      { label: 'DOKUNMA', desc: 'HİÇBİR ŞEY', fn: () => 'TIKIRTI ARKANDA KALDI...' }
    ] },
  { id: 'kartanesi', reg: ['buz'], title: 'KAR TANESİ\'NİN SIRRI', icon: 'spark', text: 'KRİSTAL CİN KAR TANESİ YOLUNU KESTİ: "NİVA\'NIN AYAZI NASIL KIRILIR, BİLİYOR MUSUN?"',
    choices: [
      { label: 'DİNLE', desc: 'SONRAKİ ETAP 12 KOMBOYLA BAŞLA', fn: r => { r.nextCombo = 12; return '"ALTIN NOTAYI TAM VUR, BUZ ÇATLAR. KRALİÇEYE SÖYLEME!"'; } },
      { label: 'YARIŞA DAVET ET', desc: 'LİGDE +4 PUAN', fn: r => { leagueAdd('deniz', 4); return 'KAR TANESİ GÜLDÜ, SANA BİR LİG PUANI JETONU ATTI.'; } }
    ] },
  { id: 'vaha', reg: ['kum'], title: 'ÇÖLDE BİR VAHA', icon: 'fountain', text: 'KIZIL KUMUN ORTASINDA MAVİ BİR SU. YILDIZ KULAKLARINI DİKTİ.',
    choices: [
      { label: 'SU İÇ', desc: '+2 CAN', fn: r => { r.hp += 2; r.healCap = true; return 'SU SERİNDİ. YILDIZ DA KANA KANA İÇTİ.'; } },
      { label: 'YAKINDAN BAK', desc: '%50: ŞEKER, %50: SERAP', fn: r => { if (rnd() < 0.5) { r.seker++; return 'SUYUN DİBİNDE PARLAYAN BİR KESME ŞEKER!'; } r.coins = Math.max(0, r.coins - 10); return 'SERAPMIŞ... KUMA BATTIN, 10 SİKKE DÜŞÜRDÜN.'; } }
    ] },
  { id: 'kervan', reg: ['kum'], title: 'TOZKIRAN\'IN KERVANI', icon: 'stall', text: 'ESKİ BİR KERVAN, KORSANLARDAN KAÇIYOR. TOZKIRAN EL SALLIYOR: "YARDIM ET DÜNYALI!"',
    choices: [
      { label: 'KERVANI KORU', desc: 'BASKIN ETABI, 60 SİKKE X2', fn: r => { r.pendingNode = { type: 'baskin', reward: { kind: 'coins', n: 60 }, elite: true, weather: 'ruzgar' }; return 'YILDIZ KERVANIN ÖNÜNE GEÇTİ!'; } },
      { label: '30 SİKKEYE TAKAS', desc: 'BİR YILDIZ GÜCÜ', req: r => r.coins >= 30, fn: r => { r.coins -= 30; r.pendingBoon = R.pick(SPIRIT_KEYS); return 'KERVANDA YILDIZ TOZU DOLU BİR ŞİŞE BULDUN.'; } }
    ] },
  { id: 'bop', title: 'BOP-1', icon: 'gear', text: 'BİP\'İN KUZENİ BOP-1 ENKAZDAN BAŞINI KALDIRDI: "BOP! KALKAN JENERATÖRÜM ÇALIŞIYOR. YAKITIM BİTTİ AMA."',
    choices: [
      { label: '25 SİKKE VER', desc: 'SONRAKİ ETAP +2 KALKAN', req: r => r.coins >= 25, fn: r => { r.coins -= 25; r.nextShield = (r.nextShield || 0) + 2; return 'BOP! KALKANLAR ŞARJ OLDU. BİP\'E SELAM SÖYLE.'; } },
      { label: 'SOHBET ET', desc: '+4 KRİSTAL', fn: r => { r.yonca += 4; return '"BİP HEP SENDEN BAHSEDİYOR." BOP SANA BİR KRİSTAL KUTUSU VERDİ.'; } }
    ] }
);

// ---------- keepsakes from station friends (gift Earth sugar cubes) ----------
const KEEPSAKES = {
  bip: { name: 'BİP\'İN YEDEK PİLİ', desc: l => 'BİR KEZ ÖLÜMCÜL DARBEYİ ' + (l >= 2 ? 2 : 1) + ' CANLA ATLAT' + (l >= 3 ? ', 2 SN DOKUNULMAZ' : ''), apply: (S, l) => { S.muska = l; } },
  ayse: { name: 'AYŞE\'NİN KURDELESİ', desc: l => 'ETAPLARA ' + [3, 6, 10][l - 1] + ' KOMBOYLA BAŞLA', apply: (S, l) => { S.startCombo += [3, 6, 10][l - 1]; } },
  kemal: { name: 'KEMAL\'İN KRONOMETRESİ', desc: l => 'SPRİNT VE DÜELLODA RAKİPLER ' + [25, 40, 60][l - 1] + ' ADIM GERİDEN BAŞLAR', apply: (S, l) => { S.rivalHandicap = [25, 40, 60][l - 1]; } },
  tayfun: { name: 'TAYFUN\'UN GÖZLÜĞÜ', desc: l => 'DÜŞMANLAR %' + [50, 75, 100][l - 1] + ' FAZLA SİKKE DÜŞÜRÜR', apply: (S, l) => { S.foeCoins *= 1 + [0.5, 0.75, 1][l - 1]; } },
  moko: { name: 'MOKO\'NUN KESESİ', desc: l => 'KOŞUYA ' + [25, 40, 60][l - 1] + ' SİKKEYLE BAŞLA, PAZAR -%' + [10, 15, 20][l - 1], apply: (S, l) => { S.startCoins += [25, 40, 60][l - 1]; S.discount += [0.1, 0.15, 0.2][l - 1]; } }
};
const NPC_LINES = {
  bip: { gift: ['ŞEKER Mİ? BİP! YİYEMEM AMA SAKLARIM. AL, YEDEK PİLİM SENDE DURSUN.', 'PİLİ ŞARJ ETTİM. ŞEKERİ DE KOLEKSİYONUMA KOYDUM.', 'SEN BU İSTASYONUN YILDIZISIN DENİZ. BİP.'],
    chat: ['YILDIZ\'IN YEMİNİ TAZELEDİM. BİP BİP.', 'GRAX\'IN ŞOVU 9.000 GEZEGENDE CANLI YAYINDA. GÜLÜMSE!', 'KAYITLARIMDA AKYEL ADINDA BİR JOKEY VAR. DOSYA... KİLİTLİ.'] },
  ayse: { gift: ['DÜNYA ŞEKERİ! AL, KURDELEMİ YILDIZ\'IN YELESİNE BAĞLAYAYIM.', 'KURDELEYİ YENİLEDİM, ŞİMDİ DAHA HIZLIYIZ!', 'BİRLİKTE EVE DÖNECEĞİZ DENİZ.'],
    chat: ['RİTİM! TOYNAK SESİNİ DİNLE, UZAYDA BİLE AYNI.', 'DÜŞMANLARA NİŞAN ALMA, VURUŞU YAKALA, IŞIN KENDİ GİDER.', 'ÜÇ SEZONDUR BURADAYIM. SEN GELİNCE İLK KEZ UMUTLANDIM.'] },
  kemal: { gift: ['ŞEKER HA... BU KRONOMETRE KIRK YILDIR BENİMLE. SENİN OLSUN.', 'ZAMANI SENİN İÇİN AYARLADIM. BURADA GÜNLER 30 SAAT, DİKKAT.', 'AKYEL\'LE AYNI PİSTTE KOŞTUM. SEN ONUN KADAR İYİSİN.'],
    chat: ['ACELE ETME, SON DÜZLÜK YARIŞIN YARISIDIR.', 'RAKİBİN ARKASINA SAKLAN, SONRA YANA ÇIK.', 'VOLTRAK HİLE YAPMADAN KAZANAMAZ, BUNU HERKES BİLİR.'] },
  tayfun: { gift: ['ŞEKER! AL GÖZLÜĞÜMÜ, KORSANLARI UZAKTAN GÖR!', 'GÖZLÜĞE BİR CİLA ÇEKTİM, NEBULADA BİLE PARLIYOR!', 'SEN DELİ BİR JOKEYSİN DENİZ, BAYILIYORUM!'],
    chat: ['VUR, KIR, DAĞIT! SONRA SİKKELERİ TOPLA.', 'KÜKREMEYİ DOĞRU ANDA KULLAN.', 'BİR GÜN GRAX\'IN MİKROFONUNU ÇALACAĞIM.'] },
  moko: { gift: ['VAY, ŞEKER! DÖRT KOLUMLA SARILIRIM. AL ŞU KESEYİ, İÇİ BOŞ AMA UĞURLUDUR.', 'KESEYE BİR İKİ SİKKE KOYDUM, GRAX\'A SÖYLEME.', 'GALAKSİNİN EN İYİ MÜŞTERİSİ SENSİN, DÜNYALI.'],
    chat: ['TAZE SÜSLER GELDİ, DÖRT KOLUMLA TAŞIDIM!', 'BÖLMEN GÜZELLEŞTİKÇE SEYİRCİN ARTIYOR.', 'PAZARDA SENİ BEKLİYORUM.'] }
};
const NPC_NAMES = { bip: 'BİP-0', ayse: 'AYŞE', kemal: 'KEMAL USTA', tayfun: 'TAYFUN', moko: 'MOKO' };

// ---------- the logbook: pages unlocked by progress ----------
const MEMORIES = [
  { id: 1, title: 'IŞIK', hint: 'BAŞLANGIÇ', cond: () => true,
    text: 'ALTIN NAL KUPASI\'NI ÜÇÜNCÜ KEZ KAZANDIĞIN GECE HİPODROMUN ÜSTÜNDE SESSİZ BİR IŞIK BELİRDİ. YILDIZ KİŞNEDİ, SEN DİZGİNLERİ SIKTIN. GÖZÜNÜ AÇTIĞINDA YILDIZLARIN ARASINDAYDIN.' },
  { id: 2, title: 'GALAKSİ KUPASI', hint: 'İLK YILDIZ GÜCÜNÜ AL', cond: () => META.stats.boons > 0,
    text: 'ARENA-9, GALAKSİNİN EN BÜYÜK YARIŞ ŞOVU. SUNUCU GRAX HER SEZON BAŞKA GEZEGENLERDEN ŞAMPİYON KAÇIRIR. KUPAYI KAZANAN EVE DÖNER, DİYOR. BUGÜNE KADAR KİMSE DÖNMEDİ.' },
  { id: 3, title: 'KAYIP JOKEY', hint: 'İLK ŞAMPİYONLA KARŞILAŞ', cond: () => !!(META.stats.bossWins.pirlanta || META.flags.lost_pirlanta),
    text: 'BİP\'İN KAYITLARINDA YİRMİ YIL ÖNCEKİ BİR FİNAL VAR: DÜNYALI BİR JOKEY, SON DÜZLÜKTE VOLTRAK\'I GEÇMEK ÜZERE. GÖRÜNTÜ ORADA KESİLİYOR. JOKEYİN ADI AKYEL. ANNENİN ADI.' },
  { id: 4, title: 'TUTSAK ŞAMPİYONLAR', hint: 'MANTAR AYI\'NA ULAŞ', cond: () => META.stats.bestRegion >= 1,
    text: 'PRENS KRİSTALO YENİLİNCE KULAĞINA FISILDADI: "BEN DE KAÇIRILDIM. HEPİMİZ GRAX\'IN ŞOVUNDAYIZ." RAKİPLERİN DÜŞMAN DEĞİL, AYNI KAFESTEKİ KUŞLAR.' },
  { id: 5, title: 'YILDIZ ATLARI', hint: 'İKİLİ GÜÇ YA DA 12 GÜÇ AL', cond: () => META.stats.duos > 0 || META.stats.boons >= 12,
    text: 'TULPAR, KIRAT, SLEİPNİR, PEGASUS VE RÜZGAR KISRAĞI... DÜNYADAN BAKINCA BİRER TAKIMYILDIZ. BURADAN BAKINCA YILDIZ\'LA KONUŞAN DOSTLAR. ANNEN DE ONLARI DUYARMIŞ.' },
  { id: 6, title: 'GRAX\'IN SIRRI', hint: 'GALAKSİ ARENASI\'NA ULAŞ', cond: () => META.stats.bestRegion >= LAST_REGION,
    text: 'KUPA BİR ÖDÜL DEĞİL, BİR ANAHTAR: EVE GİDEN IŞINLANMA KAPISINI AÇIYOR. GRAX BU YÜZDEN KİMSENİN KAZANMASINA İZİN VERMİYOR. VOLTRAK\'IN TOYNAKLARINDAKİ KIVILCIMLAR: HİLE.' },
  { id: 7, title: 'EVE DÖNÜŞ', hint: 'GALAKSİ KUPASI\'NI KAZAN', cond: () => META.stats.wins > 0,
    text: 'KUPAYI KALDIRDIĞINDA KAPI AÇILDI. TRİBÜNDEN GRİ SAÇLI BİR KADIN İNDİ: AKYEL. YİRMİ YILDIR SENİ İZLİYORMUŞ. YILDIZ ONU HEMEN TANIDI. ARTIK HERKES İSTEDİĞİ YERDE KOŞABİLİR.' }
];

const MISSION_POOL = [
  { k: 'combo', t: n => 'BİR KOŞUDA ' + n + ' KOMBO YAP', n: [12, 20, 30, 45], run: true },
  { k: 'perfect', t: n => n + ' MÜKEMMEL RİTİM YAKALA', n: [30, 60, 120, 200] },
  { k: 'jump', t: n => n + ' ENGELİN ÜSTÜNDEN SIÇRA', n: [12, 25, 50, 80] },
  { k: 'sprint1', t: () => 'BİR SPRİNTİ BİRİNCİ BİTİR', n: [1] },
  { k: 'clean', t: n => n + ' ETABI HASARSIZ BİTİR', n: [1, 2, 4] },
  { k: 'coins', t: n => 'BİR KOŞUDA ' + n + ' SİKKE TOPLA', n: [60, 120, 200, 300], run: true },
  { k: 'yonca', t: n => n + ' KRİSTAL TOPLA', n: [10, 20, 35] },
  { k: 'boons', t: n => n + ' YILDIZ GÜCÜ SEÇ', n: [3, 6, 10] },
  { k: 'boss', t: () => 'BİR ŞAMPİYON YARIŞINI KAZAN', n: [1], minLv: 3 },
  { k: 'shop', t: () => 'UZAY PAZARINDAN ALIŞVERİŞ YAP', n: [1] },
  { k: 'chase', t: () => 'KARA DELİK KAÇIŞINI HASARSIZ BİTİR', n: [1] },
  { k: 'overtake', t: n => n + ' RAKİP GEÇ', n: [8, 20, 40] },
  { k: 'ability', t: n => 'TEKNİĞİNİ ' + n + ' KEZ KULLAN', n: [2, 4, 8] },
  { k: 'kills', t: n => n + ' DÜŞMAN VUR', n: [10, 25, 50, 90] },
  { k: 'medal', t: n => n + ' ALTIN MADALYA KAZAN', n: [1, 3, 6] },
  { k: 'nearmiss', t: n => n + ' KEZ KIL PAYI GEÇ', n: [3, 8, 15] },
  { k: 'draft', t: n => n + ' KEZ SİPERDEN FIRLA', n: [2, 5, 9] },
  { k: 'event', t: () => 'BİR YOL OLAYINDA SEÇİM YAP', n: [1] },
  { k: 'kaos', t: () => 'BİR KAOS KAPISINDAN GEÇ', n: [1], minLv: 2 },
  { k: 'temiz', t: n => n + ' TEMİZ ATLAYIŞ YAP', n: [5, 12, 25] },
  { k: 'hamle', t: n => n + ' KEZ HAMLE YAP', n: [4, 10, 20] },
  { k: 'special', t: n => n + ' ÖZEL ATIŞ YAP', n: [5, 12, 25] },
  { k: 'nefes', t: n => n + ' UZUN NOTAYI SONUNA KADAR TUT', n: [3, 8, 15], minLv: 2 },
  { k: 'reis', t: () => 'BİR KORSAN KAPTANINI YEN', n: [1], minLv: 3 },
  { k: 'kick', t: () => 'SON ATAKLA BİR SPRİNTİ KAZAN', n: [1], minLv: 2 },
  { k: 'duel', t: n => n === 1 ? 'BİR DÜELLO KAZAN' : n + ' DÜELLO KAZAN', n: [1, 2, 4], minLv: 2 },
  { k: 'gate', t: n => n + ' RİTİM KAPISI AÇ', n: [3, 6, 12], minLv: 2 },
  { k: 'sponsor', t: n => n === 1 ? 'BİR SPONSOR HEDİYESİ KAZAN' : n + ' SPONSOR HEDİYESİ KAZAN', n: [1, 3, 5] },
  { k: 'fever', t: n => n === 1 ? 'DÖRTNAL MODUNA GİR' : n + ' KEZ DÖRTNAL MODUNA GİR', n: [1, 3, 6] },
  { k: 'bet', t: () => 'MOKO\'NUN MASASINDA BİR BAHİS KAZAN', n: [1], minLv: 2 },
  { k: 'revenge', t: () => 'BİR RÖVANŞÇIDAN RÖVANŞ AL', n: [1], minLv: 3 },
  { k: 'league', t: () => 'BİR GEZEGENİ LİG LİDERİ BİTİR', n: [1], minLv: 2 },
  { k: 'dodge', t: n => n + ' RAKİP ATIŞINDAN KAÇ', n: [3, 8, 15], minLv: 2 },
  { k: 'ahead', t: n => n + ' İSİMLİ RAKİBİN ÖNÜNDE BİTİR', n: [4, 10, 20] },
  { k: 'adim', t: n => n + ' RİTMİK ADIM AT (NOTA ANINDA KAYDIR)', n: [10, 25, 50] },
  { k: 'sgrade', t: n => n === 1 ? 'BİR ETABI S RİTİM NOTUYLA BİTİR' : n + ' ETABI S RİTİM NOTUYLA BİTİR', n: [1, 3, 6] }
];
const DAILY = [10, 15, 20, 25, 30, 40, 60];
const DAILY_SUGAR = [0, 0, 1, 0, 0, 0, 2];

const STORY = [
  { id: 'firstRun', cond: () => META.stats.runs >= 1, lines: [['bip', 'BİP! YORULMAK AYIP DEĞİL DENİZ. GRAX\'IN ŞOVUNDA HERKES İLK SEZONU KAYBEDER.'], ['ayse', 'TOPLADIĞIN KRİSTALLERLE BÖLMEYİ ONARABİLİRİZ. ÜSTTEKİ HEDEFE BAK!']] },
  { id: 'points', cond: () => META.points > 0, lines: [['ayse', 'SEVİYE ATLADIN! AHIR MODÜLÜNE GİT, ANTRENMANDA KALICI BİR GÜÇ SEÇ.']] },
  { id: 'firstBoon', cond: () => META.stats.boons > 0, lines: [['bip', 'TAKIMYILDIZLAR MI KONUŞTU? KAYITLARIMDA ONLARI DUYAN BİR DÜNYALI DAHA VAR. KAMARANDAKİ SEYİR DEFTERİNE BAK.']] },
  { id: 'pet', cond: () => META.stats.runs >= 2, lines: [['ayse', 'YARIŞTAN ÖNCE YILDIZ\'I SEV! ÜSTÜNE DOKUN, MUTLU AT KOŞUYA KOMBOYLA BAŞLAR.']] },
  { id: 'dog', cond: () => META.stats.runs >= 3, lines: [['bip', 'BAK KİM GELDİ! HAVALANDIRMADA BULDUM BU ZIPLAYANI. ADINI ZIPZIP KOYDUM.'], ['ayse', 'ZIPZIP HER GÜN ETRAFI KOKLAR, BAZEN KRİSTAL BULUR. ONU SEVMEYİ UNUTMA!']] },
  { id: 'moko', cond: () => !!META.flags.moko, lines: [['moko', 'SELAM DÜNYALI! BÖLMENE BİR TEZGAH KURDUM. SÜSLERİMLE BURASI ŞENLENİR!'], ['bip', 'BÖLME GÜZELLEŞTİKÇE ÜS PUANI ARTAR. HER 5 PUANDA YILDIZ BİR SEVİYE PUANI KAZANIR.']] },
  { id: 'silahhane', cond: () => built('silahhane'), lines: [['tayfun', 'CEPHANELİK AÇILDI! IŞIK YAYININ YANINDA ŞOK SAPANI, RAY ARBALETİ, HATTA PLAZMA TOPU BİLE VAR!'], ['ayse', 'UNUTMA, EYERDEKİ SİLAH RİTİMLE ATEŞ EDER.']] },
  { id: 'seker', cond: () => META.seker > 0, lines: [['bip', 'DÜNYA ŞEKERİ! BURADA ÇOK NADİR. DOSTLARINA HEDİYE ET, KARŞILIĞINDA HATIRALARINI VERİRLER.']] },
  { id: 'lostPirlanta', cond: () => META.flags.lost_pirlanta, lines: [['ayse', 'PRENS KRİSTALO ÇOK KİBİRLİ. RİTMİ TUTARSAN VE ATEŞ EDERSEN FARKI KAPATIRSIN.']] },
  { id: 'winPirlanta', cond: () => META.stats.bossWins.pirlanta, lines: [['kemal', 'KRİSTALO\'YU GEÇEN DÜNYALIYI GÖRMEYE GELDİM. BEN KEMAL. BENİ DE YILLAR ÖNCE KAÇIRDILAR.'], ['grax', 'ŞANS ESERİ BİR GALİBİYET! SEYİRCİLER BAYILDI. AMA KUPA... ASLA SENİN OLMAYACAK.'], ['bip', 'BİP. GRAX GİTTİ. DENİZ, ONA GÖSTER.']] },
  { id: 'region2', cond: () => META.stats.bestRegion >= 1, lines: [['ayse', 'MANTAR AYI... ULUYAN GORM KİMSEYİ GEÇİRMEZMİŞ. KORSANLARA DA DİKKAT.']] },
  { id: 'winKurt', cond: () => META.stats.bossWins.kurt, lines: [['tayfun', 'VAY! GORM\'U GEÇTİN HA? BEN TAYFUN, DÖRT SEZONDUR BURADAYIM. BENİ DE TAKIMA AL!']] },
  { id: 'regionBuz', cond: () => META.stats.bestRegion >= 2, lines: [['tayfun', 'BUZ HALKASI! ORADA NİVA DİYE BİR KRALİÇE VARMIŞ, NEFESİYLE PİSTİ DONDURUYORMUŞ.'], ['bip', 'AYAZ GELİNCE ŞERİT DEĞİŞTİRMEK ZORLAŞIR. HAMLE YAP YA DA ALTIN NOTAYI VUR, BUZU KIR. BİP.']] },
  { id: 'winNiva', cond: () => META.stats.bossWins.niva, lines: [['ayse', 'NİVA\'YI GEÇTİN! KRALİÇE BİLE ŞAŞIRDI, TAHTINDAN İNİP SENİ ALKIŞLADI.'], ['grax', 'BUZ ERİDİ DİYE SEVİNME DÜNYALI. ÇÖLDE SENİ KUM YUTACAK!']] },
  { id: 'regionKum', cond: () => META.stats.bestRegion >= 3, lines: [['kemal', 'KIZIL KUM... ZARG DENEN SOLUCAN PİSTİN ALTINDAN ÇIKAR. KUMDA HALKA GÖRÜRSEN O ŞERİTTEN UZAKLAŞ.']] },
  { id: 'winZarg', cond: () => META.stats.bossWins.zarg, lines: [['tayfun', 'SOLUCANI KUMA GÖMDÜN! ŞİMDİ SIRA VOLTRAK\'TA!'], ['bip', 'ARENA\'YA GİDEN YOL AÇIK. ANNENİN İZİ ORADA.']] },
  { id: 'region3', cond: () => META.stats.bestRegion >= LAST_REGION, lines: [['bip', 'GALAKSİ ARENASI... KAYITLARA GÖRE ANNEN SON KEZ ORADA KOŞMUŞ.']] },
  { id: 'lostSimsek', cond: () => META.flags.lost_simsek, lines: [['kemal', 'VOLTRAK HİLE YAPMADAN KAZANAMAZ. SEN ONDAN HIZLISIN.']] },
  { id: 'assistHint', cond: () => (META.stats.earlyLoss || 0) >= 3 && !META.settings.assist && !META.settings.wide, lines: [['bip', 'BİP! İLK PİSTTE ÜST ÜSTE ZORLANDIN. AYARLARDA GENİŞ RİTİM PENCERESİ VE YARDIM MODU VAR. UTANILACAK ŞEY DEĞİL!'], ['ayse', 'BİR DE RİTMİ ÖLÇ: KULAKLIĞIN SESİ GEÇ VERİYOR OLABİLİR. SAĞ ÜSTTEKİ DİŞLİYE BAS.']] },
  { id: 'win', cond: () => META.stats.wins > 0, lines: [['bip', 'KUPA BİZİM! KAPI AÇILDI! BİP BİP BİP!'], ['akyel', '...DENİZ. YİRMİ YILDIR SENİ İZLİYORUM. NE KADAR BÜYÜMÜŞSÜN.'], ['ayse', 'ARTIK KAPIDA PİST ZORLUĞU SEÇEBİLİRSİN. DAHA ZOR, DAHA ÇOK KRİSTAL!'], ['akyel', 'AMA PİSTTEKİLER DE KAÇIRILMIŞTI DENİZ. HER KUPADA KAPI YİNE AÇILIR: DOSYASINI AÇTIĞIN BİR RAKİBİ EVİNE GÖNDEREBİLİRSİN.']] }
];
const TIPS = [
  ['bip', 'HALKA ATIN ETRAFINDA KAPANDIĞI AN DOKUN. RİTİM HIZDIR. BİP.'],
  ['ayse', 'GÖKTAŞLARININ ÜSTÜNDEN SIÇRAYAMAZSIN, YANINDAN DOLAŞ.'],
  ['bip', 'KAPILARIN ÜSTÜNDEKİ İŞARETLERE BAK. ÖDÜLÜ SEN SEÇERSİN.'],
  ['ayse', 'GÖREV EKRANINA UĞRA, BİTEN GÖREVLER KRİSTAL VERİYOR!'],
  ['bip', 'SPRİNTTE İLK SIRALARA GİREMEZSEN BİR CAN GİDER. KALABALIK PİSTLERDE İLK 4 YETER.'],
  ['ayse', 'TEKNİK GÖSTERGESİ DOLUNCA ALTTAKİ DÜĞMEYE BAS.'],
  ['kemal', 'RAKİBİN ARKASINDA KALIRSAN SİPER DOLAR. YANA ÇIKINCA FIRLARSIN.'],
  ['tayfun', 'GÖKTAŞININ YANINDAN SON ANDA GEÇERSEN KIL PAYI SİKKESİ ALIRSIN!'],
  ['ayse', 'SİKKELERİN BOŞA GİTMEZ: KOŞU SONUNDA 10 SİKKE 1 KRİSTAL OLUR.'],
  ['kemal', 'NEFESİNİ HER YERDE HARCAMA. SON DÜZLÜKTE SAKLADIĞIN NEFES SENİ UÇURUR.'],
  ['ayse', 'VİRAJDA İÇ KULVARA YAPIŞ, DIŞTAN DÖNEN HEP GERİDE KALIR.'],
  ['tayfun', 'ALTIN NOTAYI TAM VURURSAN SİLAH ÇILDIRIR! ÜÇLÜ IŞIN, PLAZMA, NE VARSA!'],
  ['kemal', 'NİŞANCI ATMADAN ÖNCE NİŞAN ALIR. KIRMIZI ÇİZGİYİ GÖRÜNCE KULVAR DEĞİŞTİR.'],
  ['moko', 'RAKİPLERİNİN HEPSİ BİR YERLERDEN KAÇIRILMIŞ. KİMSE BURADA OLMAK İSTEMEZ, DÜNYALI.'],
  ['kemal', 'DÜELLODA RAKİBİN ARKASINA SAKLAN, SİPERİN DOLSUN. SON DÜZLÜKTE YANA ÇIK VE GEÇ.'],
  ['bip', 'DÜELLO KAZANDIĞIN HER RAKİBİN DOSYASI SEYİR DEFTERİNE EKLENİR. BİP.']
];
// Sunucu Grax's live commentary during races (picked at random per event)
const GRAX_LINES = {
  start: ['İŞTE BAŞLIYORUZ GALAKSİ!', 'DÜNYALI PİSTTE, GÖZLER ONDA!', 'IŞIKLAR YANDI, KAMERALAR HAZIR!'],
  overtake: ['MÜTHİŞ SOLLAMA!', 'BİRİNİ DAHA GEÇTİ!', 'SEYİRCİLER AYAKTA!'],
  nearmiss: ['KIL PAYI! KALBİM DURDU!', 'TÜYLERİM DİKEN DİKEN!', 'BU NE CESARET!'],
  hurt: ['AH! BU ACITTI!', 'DÜNYALI SENDELİYOR!', 'REYTİNGLER... AŞAĞI!'],
  combo: ['RİTİM MAKİNESİ!', 'BU DÜNYALI DURMUYOR!', 'MÜZİĞİ YUTUYOR!'],
  final: ['SON DÜZLÜK! KİM KAZANACAK?', 'SON METRELER, NEFESLER TUTULDU!'],
  sponsor: ['SPONSORUMUZDAN BİR HEDİYE!', 'SEYİRCİ SENİ SEVDİ, AL BAKALIM!'],
  bored: ['SEYİRCİ ESNİYOR! BİRAZ HEYECAN!', 'SIKICI! METEORLARI SALIN!'],
  fever: ['DÖRTNAL MODU! EKRANLAR YANIYOR!', 'BU HIZ YASAL MI?'],
  gateOpen: ['KAPIYI RİTİMLE AÇTI!', 'TAM VURUŞ, KAPI AÇIK!'],
  gateShut: ['KAPIYA TOSLADI!', 'RİTMİ KAÇIRDI, KAPI KAPALI!'],
  duel: ['BÜYÜK DÜELLO BAŞLIYOR!', 'BİRE BİR! BAHİSLER MASADA!'],
  nemesis: ['RÖVANŞ GECESİ! HESAPLAR GÖRÜLECEK!', 'ESKİ DÜŞMANLAR YİNE KARŞI KARŞIYA!'],
  revenge: ['RÖVANŞ ALINDI! İNANILMAZ!', 'İNTİKAM SOĞUK YENİR, GALAKSİ!'],
  betWin: ['BAHSİ KAZANDI! MOKO AĞLIYOR!', 'KASA PATLADI!'],
  boss: ['ŞAMPİYON SAHNEDE! REKOR YAYIN!', 'İŞTE BÜYÜK KAPIŞMA!'],
  rivalTrick: ['KİRLİ OYUN! SEYİRCİ BAYILIYOR!', 'BU HAMLEYİ GÖRDÜNÜZ MÜ?', 'KAÇABİLECEK Mİ?'],
  dodge: ['ŞIK KAÇIŞ!', 'RAKİBİ BOŞA ÇIKARDI!', 'REFLEKSLERE BAK!'],
  kill: ['VUR GALAKSİ, VUR!', 'BİR KORSAN DAHA GİTTİ!']
};
const NEMESIS_TAUNTS = ['YİNE Mİ SEN?', 'BU SEFER DE GEÇEMEZSİN!', 'SENİ BEKLİYORDUM DÜNYALI.'];
const INTRO = [
  ['deniz', 'ALTIN NAL KUPASI YİNE BİZİM, YILDIZ. HADİ EVE GİDELİM...'],
  ['deniz', '...BU IŞIK DA NE? YILDIZ, SAKİN OL!'],
  ['grax', 'İYİ AKŞAMLAR GALAKSİ! BU SEZONUN YENİ YILDIZI: DÜNYALI JOKEY DENİZ VE TUHAF HAYVANI!'],
  ['grax', 'KURAL BASİT: GALAKSİ KUPASI\'NI KAZANAN EVİNE DÖNER. KAYBEDEN... GELECEK SEZONA KADAR BİZİMLE!'],
  ['bip', 'BİP! BEN BİP-0, DÜNYA BÖLMESİ\'NİN BAKICISI. KORKMA, ÖNCE BİR ISINMA TURU ATALIM.']
];
const SPEAKERS = { deniz: 'DENİZ', bip: 'BİP-0', ayse: 'AYŞE', kemal: 'KEMAL USTA', tayfun: 'TAYFUN', moko: 'MOKO', grax: 'SUNUCU GRAX', akyel: 'AKYEL' };
for (const id in RIVAL_BY_ID) SPEAKERS[id] = RIVAL_BY_ID[id].name;
