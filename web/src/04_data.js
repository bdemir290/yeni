// ================= GAME DATA =================
const SPIRITS = {
  tulpar: { name: TX('TULPAR'), color: C.cyan, dark: C.sky, desc: TX('HAVA VE SIÇRAYIŞ') },
  kirat: { name: TX('KIRAT'), color: C.red, dark: C.wine, desc: TX('GÜÇ VE CESARET') },
  sleipnir: { name: TX('SLEİPNİR'), color: C.magenta, dark: C.purple, desc: TX('ÇOKLU HAREKET') },
  pegasus: { name: TX('PEGASUS'), color: C.yellow, dark: C.gold, desc: TX('IŞIK VE RİTİM') },
  ruzgar: { name: TX('RÜZGAR KISRAĞI'), color: C.green, dark: C.dgreen, desc: TX('HIZ') }
};
const SPIRIT_KEYS = Object.keys(SPIRITS);
const SLOTS = { serit: TX('ŞERİT'), sicra: TX('SIÇRAYIŞ'), ritim: TX('RİTİM'), hamle: TX('HAMLE'), cagri: TX('ÇAĞRI') };

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
  { id: 't_sicra', sp: 'tulpar', slot: 'sicra', name: TX('GÖK DARBESİ'), max: 3, desc: l => TX('İNİŞTE ') + (30 + l * 10) + TX(' ADIM ÇEVREDEKİ ENGEL VE DÜŞMANLAR PARÇALANIR'), apply: (S, l) => { S.landShock = 30 + l * 10; } },
  { id: 't_serit', sp: 'tulpar', slot: 'serit', name: TX('SÜZÜLEN ADIM'), max: 3, desc: l => TX('ŞERİT DEĞİŞTİRİRKEN ') + (0.2 + l * 0.1).toFixed(1) + TX(' SN YERDEN KESİLİRSİN: BARİYER VE JÖLE ETKİLEMEZ'), apply: (S, l) => { S.laneFloat = 0.2 + l * 0.1; } },
  { id: 't_ritim', sp: 'tulpar', slot: 'ritim', name: TX('RÜZGAR OKU'), max: 3, desc: l => TX('MÜKEMMEL ATIŞLAR ') + l + TX(' DÜŞMANIN İÇİNDEN GEÇER'), apply: (S, l) => { S.shotPierce += l; } },
  { id: 't_cagri', sp: 'tulpar', slot: 'cagri', name: TX('TULPAR KANADI'), max: 3, desc: l => TX('TEKNİKLE ') + (2 + l) + TX(' SN UÇARSIN, HİÇBİR ŞEY DOKUNAMAZ'), apply: (S, l) => { S.abFly = 2 + l; } },
  { id: 't_hamle', sp: 'tulpar', slot: 'hamle', name: TX('SÜZÜLEN HAMLE'), max: 3, desc: l => TX('HAMLEDE HAVAYA YÜKSELİRSİN, HİÇBİR ŞEY DOKUNAMAZ. SÜRE +%') + (20 * l), apply: (S, l) => { S.hamleAir = true; S.hamleDur *= 1 + 0.2 * l; } },
  { id: 't_temiz', sp: 'tulpar', name: TX('TEMİZ KANAT'), max: 2, desc: l => TX('TEMİZ ATLAYIŞTA ') + (1 + l) + TX(' YILDIZ FIRLATIR, +5 NEFES ALIRSIN'), apply: (S, l) => { S.cleanStars = 1 + l; S.cleanNefes += 5; } },
  { id: 't_suzulme', sp: 'tulpar', name: TX('SÜZÜLME'), max: 3, desc: l => TX('SIÇRAYIŞ SÜRESİ +%') + (25 * l), apply: (S, l) => { S.jumpTime *= 1 + 0.25 * l; } },
  { id: 't_cift', sp: 'tulpar', name: TX('ÇİFT SIÇRAYIŞ'), max: 1, desc: () => TX('HAVADAYKEN BİR KEZ DAHA SIÇRAYABİLİRSİN'), apply: S => { S.extraJumps += 1; } },
  { id: 't_bulut', sp: 'tulpar', name: TX('BULUT ADIMI'), max: 1, desc: () => TX('JÖLE SENİ YAVAŞLATMAZ, HAVADA ALINAN SİKKE X2'), apply: S => { S.puddleImmune = true; S.airCoins = true; } },
  // KIRAT
  { id: 'k_sicra', sp: 'kirat', slot: 'sicra', name: TX('KIRAT TOYNAĞI'), max: 3, desc: l => TX('İNDİĞİN YERDEKİ DÜŞMANLAR ') + (1 + l) + TX(' HASAR ALIR, BARİYERLER KIRILIR'), apply: (S, l) => { S.landStomp = 1 + l; } },
  { id: 'k_serit', sp: 'kirat', slot: 'serit', name: TX('OMUZ DARBESİ'), max: 3, desc: l => TX('ŞERİT DEĞİŞTİRİRKEN ÇARPTIĞIN RAKİBİ İTER, DÜŞMANA ') + l + TX(' HASAR VERİRSİN'), apply: (S, l) => { S.shoulder = true; S.shoulderDmg = l; } },
  { id: 'k_ritim', sp: 'kirat', slot: 'ritim', name: TX('AĞIR OK'), max: 3, desc: l => TX('ATIŞ HASARI +%') + (40 * l) + TX(', VURDUĞUN GERİ SAVRULUR'), apply: (S, l) => { S.shotDmg *= 1 + 0.4 * l; S.knock = true; } },
  { id: 'k_cagri', sp: 'kirat', slot: 'cagri', name: TX('KÖROĞLU NARASI'), max: 3, desc: l => TX('TEKNİK TÜM DÜŞMANLARI SERSEMLETİR VE ') + l + TX(' KALKAN VERİR'), apply: (S, l) => { S.abStun = true; S.abShield = l; } },
  { id: 'k_hamle', sp: 'kirat', slot: 'hamle', name: TX('KOÇBAŞI'), max: 3, desc: l => TX('HAMLE ÖNÜNDEKİ ENGELLERİ PARÇALAR, DÜŞMANLARA ') + (1 + l) + TX(' HASAR VERİR'), apply: (S, l) => { S.hamleRam = 1 + l; } },
  { id: 'k_nefes', sp: 'kirat', name: TX('ATEŞLİ NEFES'), max: 2, desc: l => TX('NEFES 80 VE ÜSTÜYKEN ATIŞ HASARI +%') + (25 * l), apply: (S, l) => { S.fullNefesDmg = 0.25 * l; } },
  { id: 'k_demir', sp: 'kirat', name: TX('DEMİR GÖĞÜS'), max: 2, desc: l => TX('HER ETAPTA İLK ') + l + TX(' ÇARPMA CAN GÖTÜRMEZ'), apply: (S, l) => { S.shield += l; } },
  { id: 'k_ofke', sp: 'kirat', name: TX('KÖROĞLU ÖFKESİ'), max: 2, desc: l => TX('TEK CANIN KALINCA HIZ +%') + (20 * l), apply: (S, l) => { S.lowHpSpeed += 0.2 * l; } },
  { id: 'k_kaya', sp: 'kirat', name: TX('GÖKTAŞI KIRAN'), max: 1, desc: () => TX('GÖKTAŞLARI ÇARPINCA KIRILIR, CAN GİTMEZ'), apply: S => { S.rockBreaker = true; } },
  { id: 'k_yigit', sp: 'kirat', name: TX('YİĞİT YÜREK'), max: 3, desc: () => TX('+1 AZAMİ CAN VE 1 CAN YENİLE'), apply: (S, l) => { S.maxHp += l; }, onPick: (run, lv) => { run.hp += lv; } },
  // SLEIPNIR
  { id: 's_sicra', sp: 'sleipnir', slot: 'sicra', name: TX('SEKİZ AYAK'), max: 3, desc: l => TX('İNİŞTEN SONRA ') + (0.2 + 0.2 * l).toFixed(1) + TX(' SN DOKUNULMAZSIN'), apply: (S, l) => { S.landInvuln = 0.2 + 0.2 * l; } },
  { id: 's_serit', sp: 'sleipnir', slot: 'serit', name: TX('HAYALET ADIM'), max: 3, desc: l => TX('ŞERİT DEĞİŞTİRİNCE ') + (0.15 + 0.15 * l).toFixed(2) + TX(' SN DOKUNULMAZSIN'), apply: (S, l) => { S.laneInvuln = 0.15 + 0.15 * l; } },
  { id: 's_ritim', sp: 'sleipnir', slot: 'ritim', name: TX('ÇATAL OK'), max: 3, desc: l => TX('ATIŞLAR YAN ŞERİTLERE DE GİDER (%') + (40 + 20 * l) + TX(' HASAR)'), apply: (S, l) => { S.shotSpread = 0.4 + 0.2 * l; } },
  { id: 's_cagri', sp: 'sleipnir', slot: 'cagri', name: TX('GÖLGE SÜRÜSÜ'), max: 3, desc: l => TX('TEKNİKLE ') + (3 + 2 * l) + TX(' SN İKİ GÖLGE AT YANINDA KOŞUP ATEŞ EDER'), apply: (S, l) => { S.abGhosts = 3 + 2 * l; } },
  { id: 's_hamle', sp: 'sleipnir', slot: 'hamle', name: TX('GÖLGE HAMLESİ'), max: 3, desc: l => TX('HAMLEDE DOKUNULMAZSIN, ENGELLERDEN GEÇERSİN. NEFES BEDELİ -%') + (15 * l), apply: (S, l) => { S.hamleInv = true; S.hamleCost *= 1 - 0.15 * l; } },
  { id: 's_cift', sp: 'sleipnir', name: TX('ÇİFT TOYNAK'), max: 1, desc: () => TX('ÇİFT NOTANIN İKİSİNİ DE VURURSAN EK ATIŞ VE +4 NEFES'), apply: S => { S.doubleBonus = true; } },
  { id: 's_sekiz', sp: 'sleipnir', name: TX('SEKİZ TOYNAK'), max: 1, desc: () => TX('ŞERİT DEĞİŞTİRME 2 KAT HIZLI'), apply: S => { S.laneTime *= 0.5; } },
  { id: 's_golge', sp: 'sleipnir', name: TX('GÖLGE İKİZİ'), max: 1, desc: () => TX('YAN ŞERİTTE BİR GÖLGE AT SİKKE TOPLAR'), apply: S => { S.ghost = true; } },
  // PEGASUS
  { id: 'p_sicra', sp: 'pegasus', slot: 'sicra', name: TX('YILDIZ SIÇRAYIŞI'), max: 3, desc: l => TX('SIÇRAYIŞIN TEPESİNDE ÖNÜNE ') + (2 + l) + TX(' YILDIZ FIRLATIRSIN'), apply: (S, l) => { S.jumpStars = 2 + l; } },
  { id: 'p_serit', sp: 'pegasus', slot: 'serit', name: TX('IŞIK İZİ'), max: 3, desc: l => TX('ŞERİT DEĞİŞTİRİNCE ARKANDA KALAN IŞIK DÜŞMANA ') + l + TX(' HASAR VERİR'), apply: (S, l) => { S.laneTrail = l; } },
  { id: 'p_ritim', sp: 'pegasus', slot: 'ritim', name: TX('PARLAK OK'), max: 3, desc: l => TX('MÜKEMMEL ATIŞLAR EN YAKIN DÜŞMANA YÖNELİR, HASAR +%') + (15 * l), apply: (S, l) => { S.shotHoming = true; S.shotDmg *= 1 + 0.15 * l; } },
  { id: 'p_cagri', sp: 'pegasus', slot: 'cagri', name: TX('TAKIMYILDIZ'), max: 3, desc: l => TX('TEKNİK EKRANA YILDIZ YAĞDIRIR: DÜŞMANLARA ') + (1 + l) + TX(' HASAR'), apply: (S, l) => { S.abStars = 1 + l; } },
  { id: 'p_hamle', sp: 'pegasus', slot: 'hamle', name: TX('IŞIK HAMLESİ'), max: 3, desc: l => TX('HAMLEYE BAŞLARKEN ÖNÜNE ') + (2 + l) + TX(' YILDIZ FIRLATIRSIN'), apply: (S, l) => { S.hamleStars = 2 + l; } },
  { id: 'p_vurgu', sp: 'pegasus', name: TX('VURGU IŞIĞI'), max: 2, desc: l => TX('ALTIN NOTALARDA MÜKEMMEL PENCERE +%') + (30 * l) + TX(', ÖZEL ATIŞ +%') + (40 * l), apply: (S, l) => { S.accentWin = 1 + 0.3 * l; S.specialMult *= 1 + 0.4 * l; } },
  { id: 'p_parlak', sp: 'pegasus', name: TX('PARLAK TOYNAK'), max: 2, desc: l => TX('MÜKEMMEL RİTİM PENCERESİ +%') + (30 * l), apply: (S, l) => { S.perfectWin *= 1 + 0.3 * l; } },
  { id: 'p_yildiz', sp: 'pegasus', name: TX('YILDIZ TOZU'), max: 1, desc: () => TX('HER 30 KOMBODA 1 CAN YENİLENİR'), apply: S => { S.starDust = true; } },
  { id: 'p_altin', sp: 'pegasus', name: TX('ALTIN NAL'), max: 3, desc: l => TX('SİKKE KAZANCI +%') + (40 * l), apply: (S, l) => { S.coinMult += 0.4 * l; } },
  // RUZGAR
  { id: 'r_sicra', sp: 'ruzgar', slot: 'sicra', name: TX('KASIRGA SIÇRAYIŞI'), max: 3, desc: l => TX('İNİŞTE 1.5 SN %') + (10 + 5 * l) + TX(' HIZ PATLAMASI'), apply: (S, l) => { S.landBoost = 0.1 + 0.05 * l; } },
  { id: 'r_serit', sp: 'ruzgar', slot: 'serit', name: TX('YAN RÜZGAR'), max: 3, desc: l => TX('ŞERİT DEĞİŞTİRİNCE 1 SN %') + (6 + 4 * l) + TX(' HIZ'), apply: (S, l) => { S.laneSpeed = 0.06 + 0.04 * l; } },
  { id: 'r_ritim', sp: 'ruzgar', slot: 'ritim', name: TX('HIZLI YAY'), max: 3, desc: l => TX('HER ') + [8, 6, 4][l - 1] + TX(' KOMBODA BEŞ IŞINLIK YAĞMUR'), apply: (S, l) => { S.volley = [8, 6, 4][l - 1]; } },
  { id: 'r_cagri', sp: 'ruzgar', slot: 'cagri', name: TX('FIRTINA ATAĞI'), max: 3, desc: l => TX('TEKNİK ') + (2 + l) + TX(' SN EN YÜKSEK HIZ VE KOMBO KORUMASI VERİR'), apply: (S, l) => { S.abStorm = 2 + l; } },
  { id: 'r_hamle', sp: 'ruzgar', slot: 'hamle', name: TX('FIRTINA HAMLESİ'), max: 3, desc: l => TX('HAMLE SÜRESİ +%') + (30 * l) + TX(', HAMLE HIZI +%') + (5 * l), apply: (S, l) => { S.hamleDur *= 1 + 0.3 * l; S.hamleSpd += 0.05 * l; } },
  { id: 'r_soluk', sp: 'ruzgar', name: TX('İKİNCİ SOLUK'), max: 2, desc: l => TX('NEFES KAZANCI +%') + (40 * l) + TX(', SON ATAK +%') + (40 * l), apply: (S, l) => { S.nefesGain *= 1 + 0.4 * l; S.kickMult *= 1 + 0.4 * l; } },
  { id: 'r_viraj', sp: 'ruzgar', name: TX('VİRAJ USTASI'), max: 1, desc: () => TX('VİRAJDA İÇ KULVAR AVANTAJI İKİ KAT, DIŞTA YAVAŞLAMAZSIN'), apply: S => { S.cornerMult *= 2; S.outerSafe = true; } },
  { id: 'r_ruzgar', sp: 'ruzgar', name: TX('ARKA RÜZGAR'), max: 3, desc: l => TX('TABAN HIZ +%') + (6 * l), apply: (S, l) => { S.speed *= 1 + 0.06 * l; } },
  { id: 'r_kesintisiz', sp: 'ruzgar', name: TX('KESİNTİSİZ'), max: 1, desc: () => TX('ISKA KOMBOYU SIFIRLAMAZ, YARIYA İNDİRİR'), apply: S => { S.comboKeep = true; } },
  { id: 'r_firtina', sp: 'ruzgar', name: TX('TAM GAZ'), max: 1, desc: () => TX('KOMBO 20 VE ÜSTÜYKEN EKSTRA HIZ +%12'), apply: S => { S.stormBonus = 0.12; } },
  { id: 'r_hafif', sp: 'ruzgar', name: TX('HAFİF AYAK'), max: 1, desc: () => TX('ÇARPMA VE JÖLE YAVAŞLATMASI %50 AZALIR'), apply: S => { S.slowResist += 0.5; } }
];
// duo boons need one boon from each of the two spirits
const DUOS = [
  { id: 'd_tk', duo: ['tulpar', 'kirat'], name: TX('GÖK GÜRÜLTÜSÜ'), desc: () => TX('İNİŞ DALGASI İKİ KAT GENİŞ OLUR VE DÜŞMANLARI SERSEMLETİR'), apply: S => { S.landShockWide = true; if (!S.landShock) S.landShock = 30; } },
  { id: 'd_tp', duo: ['tulpar', 'pegasus'], name: TX('IŞIK YAĞMURU'), desc: () => TX('HAVADAYKEN HER VURUŞTA BİR YILDIZ ATARSIN'), apply: S => { S.airStars = true; } },
  { id: 'd_kr', duo: ['kirat', 'ruzgar'], name: TX('GÖKTAŞI FIRTINASI'), desc: () => TX('KOMBO 20 ÜSTÜNDEYKEN GÖKTAŞI VE KAPSÜLLERİ EZİP GEÇERSİN'), apply: S => { S.comboTrample = 20; } },
  { id: 'd_sp', duo: ['sleipnir', 'pegasus'], name: TX('AY GÖLGESİ'), desc: () => TX('YANINDAKİ GÖLGE AT DA ATEŞ EDER'), apply: S => { S.ghost = true; S.ghostShoots = true; } },
  { id: 'd_sr', duo: ['sleipnir', 'ruzgar'], name: TX('SEKİZ RÜZGAR'), desc: () => TX('HAMLE NEFESİN YARISINA MAL OLUR, HAMLEDE DÜŞMANLARI EZERSİN'), apply: S => { S.hamleCost *= 0.5; S.hamleRam = Math.max(S.hamleRam, 2); } },
  { id: 'd_tr', duo: ['tulpar', 'ruzgar'], name: TX('GÖK KOŞUSU'), desc: () => TX('TEMİZ ATLAYIŞ SANA BEDAVA BİR KISA HAMLE VERİR'), apply: S => { S.cleanHamle = true; } },
  { id: 'd_ks', duo: ['kirat', 'sleipnir'], name: TX('DEMİR GÖLGE'), desc: () => TX('HAMLE SIRASINDA ÇARPTIĞIN HER ŞEY KIRILIR VE 1 KALKAN KAZANIRSIN'), apply: S => { S.hamleShield = true; S.hamleRam = Math.max(S.hamleRam, 1); } },
  { id: 'd_pk', duo: ['pegasus', 'kirat'], name: TX('ALTIN TOYNAK'), desc: () => TX('DÜŞMANLAR 2 KAT SİKKE DÜŞÜRÜR'), apply: S => { S.foeCoins *= 2; } },
  { id: 'd_ts', duo: ['tulpar', 'sleipnir'], name: TX('BULUT SÜRÜSÜ'), desc: () => TX('+1 SIÇRAYIŞ VE İNİŞTE KISA DOKUNULMAZLIK'), apply: S => { S.extraJumps += 1; S.landInvuln = Math.max(S.landInvuln, 0.4); } },
  { id: 'd_rp', duo: ['ruzgar', 'pegasus'], name: TX('ŞAFAK KOŞUSU'), desc: () => TX('KOMBO 20 ÜSTÜNDE MÜKEMMEL PENCERE +%50'), apply: S => { S.dawnWindow = true; } }
];
const BOON_BY_ID = {}; BOONS.forEach(b => BOON_BY_ID[b.id] = b); DUOS.forEach(d => { d.max = 1; BOON_BY_ID[d.id] = d; });
const RARITY = [
  { name: TX('SIRADAN'), color: C.lgray, lv: 1 },
  { name: TX('NADİR'), color: C.sky, lv: 2 },
  { name: TX('DESTANSI'), color: C.magenta, lv: 3 }
];

// ---------- saddle weapons ----------
const WEAPONS = {
  yay: { name: TX('IŞIK YAYI'), desc: TX('HER RİTİM VURUŞUNDA IŞIK OKU, MÜKEMMELDE İKİ OK'), cost: 0, dmg: 1, speed: 340, fire: 'judged', icon: 'w_yay', shot: 'arrow' },
  sapan: { name: TX('ŞOK SAPANI'), desc: TX('HER DOKUNUŞTA ŞOK TOPU; RİTİMDE ÜÇ TANE'), cost: 45, dmg: 0.7, speed: 320, fire: 'any', icon: 'w_sapan', shot: 'pebble' },
  tatar: { name: TX('RAY ARBALETİ'), desc: TX('SADECE MÜKEMMELDE: DELİCİ IŞIN, GÖKTAŞI KIRAR'), cost: 70, dmg: 2.4, speed: 400, fire: 'perfect', pierce: 2, breaksRock: true, icon: 'w_tatar', shot: 'bolt' },
  top: { name: TX('PLAZMA TOPU'), desc: TX('HER 4 VURUŞTA BİR PLAZMA: GENİŞ PATLAMA'), cost: 110, dmg: 3, speed: 260, fire: 'bar', aoe: true, breaksRock: true, icon: 'w_top', shot: 'ball' }
};
const WEAPON_UP = [0, 40, 90]; // cost of level 2 and 3 (index = current level)
const WEAPON_SPECIAL = { yay: TX('ÜÇLÜ IŞIN'), sapan: TX('ŞOK FIRTINASI'), tatar: TX('ZIRH DELEN'), top: TX('DEV PLAZMA') };
// Demirci Çekici: run-only weapon modifications (max 2 per run, like Hades' hammers)
const WEAPON_MODS = {
  yay: [
    { id: 'y_cift', name: TX('ÇİFT KİRİŞ'), desc: TX('HER VURUŞTA EN AZ İKİ IŞIK OKU'), apply: S => { S.minShots = 2; } },
    { id: 'y_alev', name: TX('ALEVLİ OK'), desc: TX('VURDUĞUN DÜŞMAN 2 SN YANAR'), apply: S => { S.burn = Math.max(S.burn, 0.8); } },
    { id: 'y_sekme', name: TX('SEKEN OK'), desc: TX('OK VURDUKTAN SONRA YAKINDAKİ BİR DÜŞMANA SEKER'), apply: S => { S.ricochet += 1; } }
  ],
  sapan: [
    { id: 's_iri', name: TX('AĞIR ŞOK'), desc: TX('ŞOK TOPLARI SERSEMLETİR, HASAR +%30'), apply: S => { S.shotStun = 0.6; S.shotDmg *= 1.3; } },
    { id: 's_torba', name: TX('DOLU ŞARJ'), desc: TX('RİTİMDE 3 YERİNE 5 ŞOK TOPU'), apply: S => { S.fanCount = 5; } },
    { id: 's_sivri', name: TX('DELİCİ ŞOK'), desc: TX('ŞOK TOPLARI BİR DÜŞMANI DELİP GEÇER'), apply: S => { S.shotPierce += 1; } }
  ],
  tatar: [
    { id: 't_kurma', name: TX('HIZLI ŞARJ'), desc: TX('İYİ VURUŞTA DA ATEŞ EDER'), apply: S => { S.fireOnGood = true; } },
    { id: 't_patla', name: TX('PATLAYAN UÇ'), desc: TX('IŞIN İSABET EDİNCE KÜÇÜK BİR PATLAMA'), apply: S => { S.miniBlast = true; } },
    { id: 't_menzil', name: TX('UZUN MENZİL'), desc: TX('IŞIN HERKESİN İÇİNDEN GEÇER, HASAR +%20'), apply: S => { S.shotPierce += 9; S.shotDmg *= 1.2; } }
  ],
  top: [
    { id: 'o_namlu', name: TX('ÇİFT NAMLU'), desc: TX('PLAZMA 4 YERİNE 3 VURUŞTA'), apply: S => { S.barNeed = 3; } },
    { id: 'o_sis', name: TX('ŞOK PLAZMASI'), desc: TX('PATLAMA DÜŞMANLARI 2 SN SERSEMLETİR'), apply: S => { S.blastStun = 2; } },
    { id: 'o_seken', name: TX('SEKEN PLAZMA'), desc: TX('PLAZMA PATLADIKTAN SONRA BİR KEZ DAHA SEKER'), apply: S => { S.bounceBall += 1; } }
  ]
};
const MOD_BY_ID = {}; for (const w in WEAPON_MODS) for (const m of WEAPON_MODS[w]) { m.w = w; MOD_BY_ID[m.id] = m; }

// ---------- enemies ----------
const FOES = {
  karga: { name: TX('GÖZCÜ'), hp: 1, coins: 2, w: 10 },
  domuz: { name: TX('TOSBİK'), hp: 2, coins: 3, w: 10 },
  eskiya: { name: TX('KORSAN'), hp: 4, coins: 6, w: 12 },
  okcu: { name: TX('NİŞANCI'), hp: 3, coins: 5, w: 12 },
  kalkanli: { name: TX('KALKAN ROBOTU'), hp: 3, coins: 7, w: 12 },
  reis: { name: TX('KORSAN KAPTANI'), hp: 14, coins: 20, w: 14 }
};

const NALS = {
  demir: { name: TX('DEMİR NAL'), desc: TX('DENGELİ, GÜVENİLİR'), cost: 0, apply: () => { } },
  ruzgar: { name: TX('İYON NALI'), desc: TX('HIZ +%10, AZAMİ CAN -1'), cost: 60, apply: S => { S.speed *= 1.1; S.maxHp -= 1; } },
  tas: { name: TX('METEOR NALI'), desc: TX('AZAMİ CAN +1, YAVAŞLAMA -%30, HIZ -%5'), cost: 60, apply: S => { S.maxHp += 1; S.slowResist += 0.3; S.speed *= 0.95; } },
  ritim: { name: TX('RİTİM NALI'), desc: TX('MÜKEMMEL PENCERE +%25, KOMBO HIZI +%50'), cost: 90, apply: S => { S.perfectWin *= 1.25; S.comboPer *= 1.5; } }
};
const JOCKEYS = {
  ayse: { name: TX('AYŞE'), silk: 'ayse', passive: TX('KOMBO YAVAŞ SÖNER'), ability: TX('SAKİN NEFES'), abDesc: TX('4 SN DOKUNULMAZLIK VE EKSTRA HIZ'), rozet: 0, apply: S => { S.comboDecay = 1; } },
  kemal: { name: TX('KEMAL USTA'), silk: 'kemal', passive: TX('+1 AZAMİ CAN'), ability: TX('USTA ATAĞI'), abDesc: TX('ANINDA İLERİ FIRLA, FARKI KAPAT'), rozet: 1, apply: S => { S.maxHp += 1; } },
  tayfun: { name: TX('ÇILGIN TAYFUN'), silk: 'tayfun', passive: TX('HEP OMUZ DARBESİ'), ability: TX('KÜKREME'), abDesc: TX('ÖNÜNDEKİ ENGELLER KIRILIR, DÜŞMANLAR SERSEMLER'), rozet: 2, apply: S => { S.shoulder = true; S.shoulderDmg = Math.max(S.shoulderDmg, 1); } }
};
const FOODS = {
  havuc: { name: TX('HAVUÇ'), desc: TX('KOŞUYA +1 AZAMİ CANLA BAŞLA'), cost: 0, apply: S => { S.maxHp += 1; } },
  yulaf: { name: TX('YULAF'), desc: TX('HIZ +%5'), cost: 30, apply: S => { S.speed *= 1.05; } },
  seker: { name: TX('KESME ŞEKER'), desc: TX('KOŞUYA 60 SİKKEYLE BAŞLA'), cost: 40, apply: S => { S.startCoins += 60; } },
  elma: { name: TX('ELMA'), desc: TX('İLK RUH GÜCÜ EN AZ NADİR'), cost: 45, apply: () => { }, rareFirst: true }
};
const SKILLS = [
  { id: 'h1', br: 0, name: TX('GÜÇLÜ BACAKLAR'), max: 3, cost: 1, desc: TX('HIZ +%3'), apply: (S, r) => { S.speed *= 1 + 0.03 * r; } },
  { id: 'h2', br: 0, name: TX('RİTİM DUYGUSU'), max: 2, cost: 1, desc: TX('MÜKEMMEL PENCERE +%10'), apply: (S, r) => { S.perfectWin *= 1 + 0.1 * r; } },
  { id: 'h3', br: 0, name: TX('HIZLI KALKIŞ'), max: 1, cost: 2, desc: TX('ETAPLARA 5 KOMBOYLA BAŞLA'), apply: (S, r) => { S.startCombo += 5 * r; } },
  { id: 'd1', br: 1, name: TX('SAĞLAM YAPI'), max: 2, cost: 2, desc: TX('AZAMİ CAN +1'), apply: (S, r) => { S.maxHp += r; } },
  { id: 'd2', br: 1, name: TX('KALIN DERİ'), max: 2, cost: 1, desc: TX('YAVAŞLAMA -%15'), apply: (S, r) => { S.slowResist += 0.15 * r; } },
  { id: 'd3', br: 1, name: TX('TOPARLANMA'), max: 1, cost: 2, desc: TX('BOSS YENİNCE 1 CAN YENİLE'), apply: (S, r) => { S.bossHeal = r; } },
  { id: 'z1', br: 2, name: TX('SEÇİCİ'), max: 2, cost: 1, desc: TX('KOŞU BAŞI +1 GÜÇ YENİLEME'), apply: (S, r) => { S.rerolls += r; } },
  { id: 'z2', br: 2, name: TX('PAZARLIKÇI'), max: 2, cost: 1, desc: TX('PAZARDA -%15 FİYAT'), apply: (S, r) => { S.discount += 0.15 * r; } },
  { id: 'z3', br: 2, name: TX('ŞANSLI'), max: 2, cost: 1, desc: TX('NADİR GÜÇ ŞANSI ARTAR'), apply: (S, r) => { S.luck += 0.1 * r; } }
];
const BRANCHES = [{ name: TX('HIZ'), color: C.sky }, { name: TX('DAYANIKLILIK'), color: C.red }, { name: TX('ZEKA'), color: C.gold }];

// ---------- farm buildings (level 0 = ruined, 1 = repaired, 2-3 = upgrades) ----------
const BUILDINGS = {
  ev: { name: TX('KAMARA'), max: 1, up: [0], upDesc: [TX('SEYİR DEFTERİ')], desc: TX('DENİZ\'İN KAMARASI. SEYİR DEFTERİNDE BU TUHAF YOLCULUK YAZILI.') },
  ahir: { name: TX('AHIR MODÜLÜ'), max: 4, up: [0, 80, 160, 280], upDesc: [TX('ANTRENMAN PLANI'), TX('+1 PUAN VE BATTANİYE RENKLERİ'), TX('+1 PUAN, SEVİLEN YILDIZ İKİ KAT GÜÇLÜ'), TX('+1 PUAN, SEVİLEN YILDIZ 15 KOMBOYLA BAŞLAR')], desc: TX('YILDIZ\'IN CAM KUBBELİ AHIRI. SEVİYE PUANLARINI ANTRENMANDA HARCA.') },
  pano: { name: TX('GÖREV EKRANI'), max: 4, up: [0, 60, 140, 260], upDesc: [TX('3 GÖREV'), TX('4. GÖREV YUVASI'), TX('GÖREV ÖDÜLLERİ +%50'), TX('GÖREV ÖDÜLLERİ İKİ KAT')], desc: TX('GÖREVLER, GÜNLÜK ERZAK VE GÜNÜN KOŞUSU.') },
  ambar: { name: TX('YEM DEPOSU'), max: 2, up: [20, 90], upDesc: [TX('KOŞUDAN ÖNCE YEM SEÇ'), TX('İKİNCİ YEM YUVASI')], desc: TX('DÜNYA\'DAN GETİRİLEN YEMLER. KOŞUDAN ÖNCE BİRİNİ SEÇ, AVANTAJLA BAŞLA.') },
  silahhane: { name: TX('CEPHANELİK'), max: 4, up: [30, 100, 200, 350], upDesc: [TX('SİLAH SEÇ VE GELİŞTİR'), TX('TÜM ATIŞLAR +%20 HASAR'), TX('TÜM ATIŞLAR +%40 HASAR'), TX('TÜM ATIŞLAR +%60 HASAR')], desc: TX('EYERE TAKILAN SİLAHLAR. RİTİMLE DOKUNDUĞUNDA ATEŞ EDER.') },
  nalbant: { name: TX('NAL ATÖLYESİ'), max: 4, up: [50, 100, 180, 300], upDesc: [TX('NAL SEÇ'), TX('HER NALDA +%5 HIZ'), TX('HER NALDA +1 AZAMİ CAN'), TX('HER NALDA YAVAŞLAMA -%20')], desc: TX('FARKLI NALLAR DÖV, OYUN TARZINI DEĞİŞTİR.') },
  tapinak: { name: TX('GÖZLEMEVİ'), max: 3, up: [60, 120, 220], needBoon: true, upDesc: [TX('GÖZDE TAKIMYILDIZINI SEÇ'), TX('İKİLİ GÜÇ ŞANSI 2 KAT'), TX('NADİR GÜÇ ŞANSI +%15')], desc: TX('TELESKOP YILDIZ ATLARINA ÇEVRİLİ. GÖZDE TAKIMYILDIZININ İLK GÜCÜ SENİN OLUR.') },
  jokey: { name: TX('JOKEY KOĞUŞU'), max: 4, up: [40, 90, 170, 300], rozet: 1, upDesc: [TX('TEKNİK SEÇ'), TX('TEKNİK %25 HIZLI DOLAR'), TX('TEKNİK %50 HIZLI DOLAR'), TX('TEKNİK %75 HIZLI DOLAR')], desc: TX('TUTSAK DÜNYALI JOKEYLER SANA TEKNİKLERİNİ ÖĞRETİR.') },
  veteriner: { name: TX('REVİR'), max: 4, up: [80, 150, 220, 380], upDesc: [TX('1 KEZ, 1 CANLA KALK'), TX('1 KEZ, 2 CANLA KALK'), TX('2 KEZ, 2 CANLA KALK'), TX('3 KEZ, 2 CANLA KALK')], desc: TX('İKİNCİ NEFES: YORGUN DÜŞTÜĞÜNDE AYAĞA KALK.') },
  bahce: { name: TX('SERA'), max: 3, up: [25, 90, 180], upDesc: [TX('3 TEPSİ'), TX('5 TEPSİ'), TX('7 TEPSİ')], desc: TX('HER KOŞUDAN SONRA ÜRÜNLER BÜYÜR. HAVUÇ KRİSTAL, PANCAR ŞEKER VERİR.') }
};
// the 4th level of a building is late game: it needs this many champion badges
const LV4_ROZET = 3;
const BUILD_ORDER = ['ambar', 'silahhane', 'bahce', 'nalbant', 'jokey', 'tapinak', 'veteriner'];
const DECOR = {
  saman: { name: TX('SAMAN BALYALARI'), cost: 10 },
  cicek: { name: TX('UZAY ÇİÇEKLERİ'), cost: 15 },
  fener: { name: TX('NEON LAMBA'), cost: 20 },
  bayrak: { name: TX('IŞIK DİZİSİ'), cost: 25 },
  agac: { name: TX('KUBBELİ AĞAÇ'), cost: 30 },
  kuyu: { name: TX('SU TANKI'), cost: 35 },
  cesme: { name: TX('HOLOGRAM ÇEŞME'), cost: 60 },
  heykel: { name: TX('AKYEL HEYKELİ'), cost: 90, needWin: true }
};
const HEATS = [{ name: TX('NORMAL'), mult: 1, rew: 1 }, { name: TX('METEORLU PİST'), mult: 1.12, rew: 1.5 }, { name: TX('KARA DELİK PİSTİ'), mult: 1.24, rew: 2 }];
const RUN_STYLES = {
  onde: { name: TX('ÖNDE KOŞ'), desc: TX('İLK YARIDA +%8 HIZ VE UCUZ HAMLE, SONDA -%4') },
  dengeli: { name: TX('DENGELİ'), desc: TX('SABİT TEMPO, NEFES KAZANCI +%20') },
  sondan: { name: TX('SONDAN GEL'), desc: TX('BAŞTA -%4, SON ATAK 1.5 KAT GÜÇLÜ') }
};

const REGIONS = [
  { id: 'cayir', name: TX('LUMO ÇAYIRI'), song: 'cayir', bpm: 120, speed: 1.0, dens: 1.0, rivals: [0.86, 0.92, 0.97, 1.02, 1.07], boss: 'pirlanta',
    grass: C.purple, grass2: C.plum, grassD: C.magenta, dirt: C.tan, dirtD: C.brown, dirtL: C.sand, rail: C.cyan, post: C.lgray, deco: 'meadow', mud: false,
    foes: { karga: 1, domuz: 0.6, kalkanli: 0.25 }, weather: { acik: 7, yagmur: 2, ruzgar: 1 } },
  { id: 'orman', name: TX('MANTAR AYI'), song: 'orman', bpm: 128, speed: 1.08, dens: 1.18, rivals: [0.9, 0.95, 1.0, 1.05, 1.1], boss: 'kurt',
    grass: C.teal, grass2: C.ddgreen, grassD: C.navy, dirt: C.dgray, dirtD: C.slate, dirtL: C.gray, rail: C.magenta, post: C.purple, deco: 'forest', mud: true,
    foes: { karga: 1, domuz: 1.2, eskiya: 0.5, okcu: 0.45, kalkanli: 0.35 }, weather: { acik: 4, sis: 4, yagmur: 2 } },
  { id: 'buz', name: TX('BUZ HALKASI'), song: 'buz', bpm: 132, speed: 1.11, dens: 1.24, rivals: [0.91, 0.96, 1.0, 1.04, 1.08, 0.94, 0.98], boss: 'niva', tier: 1.5, field: 6,
    grass: C.blue, grass2: C.navy, grassD: C.sky, dirt: C.gray, dirtD: C.dgray, dirtL: C.lgray, rail: C.white, post: C.cyan, deco: 'ice', mud: false,
    foes: { karga: 1, domuz: 0.9, kalkanli: 0.6, okcu: 0.5, eskiya: 0.35 }, weather: { acik: 5, kar: 3, sis: 1, ruzgar: 1 } },
  { id: 'kum', name: TX('KIZIL KUM'), song: 'kum', bpm: 134, speed: 1.14, dens: 1.3, rivals: [0.92, 0.97, 1.01, 1.05, 1.1, 0.95, 0.99], boss: 'zarg', tier: 2, field: 7,
    grass: C.rust, grass2: C.dbrown, grassD: C.orange0, dirt: C.sand, dirtD: C.tan, dirtL: C.white, rail: C.orange, post: C.dbrown, deco: 'desert', mud: false,
    foes: { karga: 0.8, domuz: 1.0, eskiya: 0.9, okcu: 0.7, kalkanli: 0.4 }, weather: { acik: 5, kumf: 3, ruzgar: 2 } },
  { id: 'bulut', name: TX('FIRTINA DEVİ'), song: 'bulut', bpm: 135, speed: 1.15, dens: 1.32, rivals: [0.92, 0.97, 1.02, 1.06, 1.11, 0.95, 0.99], boss: 'bora', tier: 2.15, field: 6,
    grass: C.slate, grass2: C.navy, grassD: C.purple, dirt: C.lgray, dirtD: C.gray, dirtL: C.white, rail: C.yellow, post: C.lgray, deco: 'cloud', mud: false,
    foes: { karga: 1.2, domuz: 0.7, kalkanli: 0.6, okcu: 0.8, eskiya: 0.5 }, weather: { acik: 4, yagmur: 3, ruzgar: 3 } },
  { id: 'kor', name: TX('KOR AY'), song: 'kor', bpm: 137, speed: 1.16, dens: 1.34, rivals: [0.93, 0.98, 1.02, 1.06, 1.11, 0.96, 1.0], boss: 'korhan', tier: 2.3, field: 7,
    grass: C.wine, grass2: C.plum, grassD: C.orange, dirt: C.dgray, dirtD: C.slate, dirtL: C.orange, rail: C.orange, post: C.wine, deco: 'lava', mud: false,
    foes: { karga: 0.9, domuz: 1.1, eskiya: 1.0, okcu: 0.8, kalkanli: 0.6 }, weather: { acik: 5, sis: 2, ruzgar: 1 } },
  { id: 'hipodrom', name: TX('GALAKSİ ARENASI'), song: 'hipodrom', bpm: 138, speed: 1.18, dens: 1.37, rivals: [0.94, 0.99, 1.03, 1.07, 1.12, 0.97, 1.01], boss: 'simsek', tier: 2.45, field: 6, pass: 4,
    grass: C.navy, grass2: C.slate, grassD: C.ink, dirt: C.orange0, dirtD: C.rust, dirtL: C.tan, rail: C.cyan, post: C.lgray, deco: 'stadium', mud: false, night: true,
    foes: { karga: 0.8, domuz: 0.8, eskiya: 1.0, okcu: 0.8, kalkanli: 0.5 }, weather: { acik: 6, yagmur: 3, ruzgar: 2 } }
];
REGIONS[0].tier = 0; REGIONS[0].field = 5; REGIONS[1].tier = 1; REGIONS[1].field = 5;
// v5 put two planets between Mantar Ayı and the arena: saves from v4 map their region index through this table
// (to the v5 layout; the v6 step below then moves the arena again)
const LAST_REGION = REGIONS.length - 1;
const REGION_V4 = [0, 1, 4];
// v6 put Fırtına Devi and Kor Ay between Kızıl Kum and the arena
const REGION_V5 = [0, 1, 2, 3, LAST_REGION];
const regionIdx = id => REGIONS.findIndex(r => r.id === id);
const BOSS_CRYSTALS = [10, 15, 18, 21, 23, 25, 28];
const BOSSES = {
  pirlanta: { name: TX('PRENS KRİSTALO'), look: 'kristalo', drain: 2.0, attacks: ['mud', 'bale', 'karga'], attacks2: ['karga3', 'mud'], attacks3: ['mudrow', 'bale'], sig: 'kibir', taunt: TX('IŞILTIMA BAK DÜNYALI. SONRA TOZUMU YUT.'), color: C.magenta, title: TX('LUMO\'NUN KİBİRLİ KRİSTAL PRENSİ') },
  kurt: { name: TX('ULUYAN GORM'), look: 'gorm', drain: 2.4, attacks: ['log', 'wolf', 'domuz'], attacks2: ['howl', 'wolf'], attacks3: ['stomp', 'domuz'], sig: 'uluma', taunt: TX('AUUU! BU ORMANDA BENDEN HIZLISI YOK!'), color: C.green, title: TX('MANTAR AYI\'NIN YENİLMEZİ') },
  niva: { name: TX('BUZ KRALİÇESİ NİVA'), look: 'niva', drain: 2.5, attacks: ['icicle', 'karga', 'bale'], attacks2: ['icerow', 'icicle'], attacks3: ['icicle3', 'icerow'], sig: 'ayaz', taunt: TX('BURADA HER ŞEY DONAR. SEN DE.'), color: C.cyan, title: TX('BUZ HALKASI\'NIN SOĞUK HÜKÜMDARI') },
  zarg: { name: TX('KUM SOLUCANI ZARG'), look: 'zarg', drain: 2.65, attacks: ['burrow', 'eskiya', 'domuz'], attacks2: ['sandwave', 'burrow', 'okcu'], attacks3: ['burrow2', 'sandwave'], sig: 'kum', taunt: TX('KUMUN ALTINDAN SENİ İZLİYORUM...'), color: C.orange, title: TX('KIZIL KUM\'UN ÇÖL CANAVARI') },
  bora: { name: TX('BULUT ÇOBANI BORA'), look: 'bora', drain: 2.7, attacks: ['bolt', 'karga', 'bale'], attacks2: ['bolt3', 'cloudrow'], attacks3: ['bolt3', 'cloudrow', 'thunder'], sig: 'firtina', taunt: TX('BULUTLARIM SENİ YUTACAK, DÜNYALI.'), color: C.sky, title: TX('FIRTINA DEVİ\'NİN YAŞLI ÇOBANI') },
  korhan: { name: TX('DEMİRCİ KORHAN'), look: 'korhan', drain: 2.75, attacks: ['ember', 'domuz', 'eskiya'], attacks2: ['ember3', 'lavarow'], attacks3: ['ember3', 'lavarow', 'lavawave'], sig: 'ocak', taunt: TX('ÖRSÜMDE NE DÖVDÜĞÜMÜ BİLMEK İSTEMEZSİN.'), color: C.orange, title: TX('KOR AY\'IN ZİNCİRLİ DEMİRCİSİ') },
  simsek: { name: TX('VOLTRAK'), horse: ['robot', 'voltrak'], drain: 2.8, attacks: ['bolt', 'bale', 'eskiya'], attacks2: ['bolt3', 'okcu'], attacks3: ['civirow', 'bolt3'], sig: 'hile', taunt: TX('HESAPLAMA: KAZANMA İHTİMALİN %0.'), color: C.red, title: TX('GRAX\'IN ROBOT ŞAMPİYONU') }
};
const RIVAL_LOOKS = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15', 'r16'];
// named rivals per region (index = region). style: sondan / onde / itici / atici (shoots on the beat) / zikzak (cuts in)
const NAMED_RIVALS = [
  [{ id: 'glorb', name: TX('GLORB'), style: 'sondan', look: 'n5' }, { id: 'vuum', name: TX('KIZIL VUUM'), style: 'itici', look: 'n1' }, { id: 'pip', name: TX('PİP-PİP'), style: 'zikzak', look: 'n7' }],
  [{ id: 'gece', name: TX('GECE KANADI'), style: 'onde', look: 'n6' }, { id: 'kiskac', name: TX('DEMİR KISKAÇ'), style: 'itici', look: 'n3' }, { id: 'mantis', name: TX('SİSLİ MANTİS'), style: 'atici', look: 'n8' }],
  [{ id: 'buzdis', name: TX('BUZDİŞ'), style: 'itici', look: 'n9' }, { id: 'aurora', name: TX('AURORA'), style: 'onde', look: 'n10' }, { id: 'kar', name: TX('KAR TANESİ'), style: 'zikzak', look: 'n14' }],
  [{ id: 'tozkiran', name: TX('TOZKIRAN'), style: 'atici', look: 'n11' }, { id: 'zib', name: TX('ÜÇ GÖZ ZİB'), style: 'sondan', look: 'n12' }, { id: 'serap', name: TX('SERAP'), style: 'onde', look: 'n15' }],
  [{ id: 'zefir', name: TX('ZEFİR'), style: 'onde', look: 'n16' }, { id: 'gumbur', name: TX('GÜMBÜR'), style: 'itici', look: 'n17' }, { id: 'damla', name: TX('DAMLA'), style: 'sondan', look: 'n18' }],
  [{ id: 'kivilcim', name: TX('KIVILCIM'), style: 'zikzak', look: 'n19' }, { id: 'curuf', name: TX('CÜRUF'), style: 'itici', look: 'n20' }, { id: 'oniks', name: TX('ONİKS'), style: 'atici', look: 'n21' }],
  [{ id: 'alev', name: TX('ALEV KUYRUK'), style: 'onde', look: 'n4' }, { id: 'golge', name: TX('GRAX\'IN GÖLGESİ'), style: 'sondan', look: 'n2' }, { id: 'nova', name: TX('NOVA'), style: 'zikzak', look: 'n13' }]
];
const STYLE_COL = { itici: C.salmon, onde: C.sky, sondan: C.green, atici: C.gold, zikzak: C.magenta };
const STYLE_SHORT = { sondan: TX('SONDAN GELİR'), onde: TX('ÖNDE KAÇAR'), itici: TX('OMUZ ATAR'), atici: TX('PLAZMA ATAR'), zikzak: TX('ÖNÜNÜ KESER') };
const STYLE_TRICK = { atici: TX('NİŞAN ALIR, "!" SONRA PLAZMA ATAR'), zikzak: TX('ŞERİT ŞERİT KAYAR, ÖNÜNÜ KESER') };
const RIVAL_BY_ID = {};
NAMED_RIVALS.forEach((list, reg) => list.forEach(r => { r.region = reg; RIVAL_BY_ID[r.id] = r; }));
// Rakip dosyaları: a 1v1 duel win opens the rival's page in the logbook and their side of the story
const RIVAL_INFO = {
  glorb: { race: TX('JÖLE BEYİNLİ BİLGİN'), home: TX('KÜTÜPHANE GEZEGENİ ZİLA'), trick: TX('SONDAN GELİR, SONDA ATAKLAR'),
    taunt: TX('HESAPLARIMA GÖRE KAYBEDECEKSİN.'),
    lose: [TX('HESAPLARIM YANLIŞMIŞ. SENİN RİTMİN DENKLEMDE YOKTU.'), TX('KÜTÜPHANEMİ ÖZLÜYORUM DÜNYALI. KUPAYI ALIRSAN KAPIYI AÇIK BIRAK, OLUR MU?')],
    text: TX('GLORB, ZİLA\'NIN EN GENÇ BİLGİNİYDİ. YARIŞ HESAPLARINI İNCELEMEK İÇİN TRİBÜNE GELDİ; GRAX ONU HESAPLARIYLA BİRLİKTE PİSTE ATTI. HER YARIŞTAN SONRA NOT TUTUYOR: BİR GÜN DENKLEMİ ÇÖZÜP EVE DÖNECEK.') },
  vuum: { race: TX('DOKUZ KOLLU VATOZ SÜRÜCÜSÜ'), home: TX('OKYANUS AYI TALASSA'), trick: TX('YANAŞIR, "!" SONRA OMUZ ATAR'),
    taunt: TX('YOLUMDAN ÇEKİL, YOKSA İTERİM!'),
    lose: [TX('İTEMEDİM Mİ? VAY... EYERE SAĞLAM OTURUYORSUN.'), TX('YEDİ YAVRUM VAR, HER BİRİNE BİR KOL. HEPSİNE SENİ ANLATACAĞIM.')],
    text: TX('VUUM, TALASSA\'DA KARGO ÇEKEN BİR VATOZ SÜRÜCÜSÜYDÜ. DENİZ TRAFİĞİNDE İTİŞEREK BÜYÜDÜ, PİSTTE DE ÖYLE YAPIYOR. GRAX ONU "SEYİRCİ KAVGA SEVER" DİYE SEÇTİ. OYSA TEK İSTEDİĞİ YEDİ YAVRUSUNA DÖNMEK.') },
  gece: { race: TX('GECE GÖZLÜ YARASA HALKI'), home: TX('GÜNEŞSİZ GEZEGEN NOKS'), trick: TX('ÖNDE KAÇAR, MAYIN BIRAKIR'),
    taunt: TX('ÖNÜMÜ GÖREMEZSİN BİLE.'),
    lose: [TX('GÖLGEMİ YAKALADIN DÜNYALI. KİMSE YAPAMAMIŞTI.'), TX('TRİBÜNDE BENİM GİBİ KULAKLI BİR KIZ GÖRÜRSEN... EL SALLA. KIZ KARDEŞİM O.')],
    text: TX('GECE KANADI, GÜNEŞİN HİÇ DOĞMADIĞI NOKS\'TAN. ARENA IŞIKLARI GÖZLERİNİ YAKIYOR, O YÜZDEN HEP EN ÖNDE KAÇIYOR. KAÇIRILDIĞI GECE KIZ KARDEŞİ DE YANINDAYDI; ONU HÂLÂ TRİBÜNLERDE ARIYOR.') },
  kiskac: { race: TX('MADEN ROBOTU'), home: TX('ASTEROİT KUŞAĞI K-7'), trick: TX('YANAŞIR, "!" SONRA KISKACIYLA İTER'),
    taunt: TX('HEDEF: DÜNYALI. İŞLEM: EZ.'),
    lose: [TX('HATA. HATA. İKİNCİ OLMAK PROGRAMIMDA YOK.'), TX('BİP-0 BANA YENİ BİR KELİME ÖĞRETTİ: ARKADAŞ. SEN... ARKADAŞ MISIN?')],
    text: TX('DEMİR KISKAÇ, ASTEROİT KUŞAĞINDA TEK BAŞINA KAZI YAPAN BİR MADEN ROBOTUYDU. GRAX\'IN GEMİSİ ONU HURDA DİYE TOPLADI. PROGRAMINDA TEK BİR EMİR VAR: KAZAN. BİP-0 ONA GİZLİCE YENİ KELİMELER ÖĞRETİYOR.') },
  alev: { race: TX('ATEŞ KUŞU BİNİCİSİ'), home: TX('YANARDAĞ GEZEGENİ PİRA'), trick: TX('ÖNDE KAÇAR, MAYIN BIRAKIR'),
    taunt: TX('PİRA\'DA KİMSE BENİ GEÇEMEZDİ!'),
    lose: [TX('ÜÇ SEZONDUR İLK KEZ BİRİ BANA ARKASINI GÖSTERDİ.'), TX('BİR SIR VEREYİM DÜNYALI: KUPAYI KAZANAN DEĞİL, KUPAYI AÇAN EVE DÖNER.')],
    text: TX('ALEV KUYRUK, PİRA\'NIN YENİLMEZ ŞAMPİYONUYDU. ARENADA ÜÇ SEZONDUR HEP İKİNCİ. GURURU KUŞUNUN KUYRUĞU KADAR PARLAK AMA BİR ŞEY BİLİYOR: KUPA BİR ÖDÜL DEĞİL, BİR ANAHTAR.') },
  golge: { race: TX('GRAX\'IN İLK TUTSAĞI'), home: TX('BİLİNMİYOR'), trick: TX('SONDAN GELİR, SONDA ATAKLAR'),
    taunt: TX('BEN BU PİSTİN KENDİSİYİM.'),
    lose: [TX('YİRMİ YIL ÖNCE BİR DÜNYALI DA BENİ BÖYLE GEÇMİŞTİ. AYNI GÖZLER.'), TX('ANNEN YAŞIYOR DENİZ. GRAX ONU HER GECE TRİBÜNE OTURTUYOR. KUPAYI AL.')],
    text: TX('GÖLGE, GRAX\'IN KAÇIRDIĞI İLK YARIŞÇI; ADINI KİMSE HATIRLAMIYOR. YİRMİ YIL ÖNCEKİ FİNALDE AKYEL\'İN YANINDA KOŞTU. IŞIKLAR SÖNMEDEN ÖNCE ONU ÖNDE GÖRDÜ. O GECEDEN BERİ GRAX İÇİN KOŞUYOR AMA ONA İNANMIYOR.') },
  pip: { race: TX('MİNİK KUŞ HALKI'), home: TX('AĞAÇ GEZEGENİ TİRİ'), trick: STYLE_TRICK.zikzak,
    taunt: TX('PİP! YAKALA BENİ YAKALAYABİLİRSEN!'),
    lose: [TX('PİP... SEN BENDEN BİLE HIZLI ŞERİT DEĞİŞTİRİYORSUN!'), TX('ANNEM HEP "UÇMAYI ÖĞREN" DERDİ. BEN KOŞMAYI SEÇTİM. SENİ GÖRÜNCE İYİ Kİ DEDİM.')],
    text: TX('PİP-PİP, TİRİ\'NİN DEV AĞAÇLARINDA YAŞAYAN MİNİK KUŞ HALKINDAN. HENÜZ UÇAMIYOR, O YÜZDEN DURMADAN KOŞUYOR. GRAX ONU "SEYİRCİ ŞİRİNLİK SEVER" DİYE KAFESİNE ATTI. HER YARIŞTA ŞERİTTEN ŞERİDE ZIPLIYOR, KİMSE ONU ÖNCEDEN TAHMİN EDEMİYOR.') },
  mantis: { race: TX('SİS ORMANI AVCISI'), home: TX('NEM GEZEGENİ HUMA'), trick: STYLE_TRICK.atici,
    taunt: TX('SİSİN İÇİNDEN SENİ GÖRÜYORUM.'),
    lose: [TX('NİŞANIM HİÇ ŞAŞMAZDI. SEN RİTİMLE KAÇIYORSUN, BU ADİL DEĞİL... AMA GÜZEL.'), TX('HUMA\'DA YAĞMUR HİÇ DİNMEZ. KUPAYI ALIRSAN BİRAZ GÜNEŞ GETİR BANA.')],
    text: TX('SİSLİ MANTİS, HUMA\'NIN SİSLİ ORMANLARINDA AV PEŞİNDEN KOŞAN SABIRLI BİR AVCI. BİR VURUŞ BEKLER, NİŞAN ALIR, SONRA ATAR. GRAX ONA PLAZMA TÜFEĞİ VERDİ; O İSE SADECE ORMANINI ÖZLÜYOR.') },
  buzdis: { race: TX('BUZUL DEVİ'), home: TX('DONMUŞ AY GLASİ'), trick: TX('YANAŞIR, "!" SONRA OMUZ ATAR'),
    taunt: TX('SOĞUK SENİ YAVAŞLATACAK DÜNYALI.'),
    lose: [TX('BUZUM ÇATLADI... BÖYLE SICAK BİR RİTİM HİÇ GÖRMEMİŞTİM.'), TX('GLASİ\'DE KARDEŞLERİM BENİ BEKLİYOR. HER KIŞ BİR HEYKEL YAPARLAR. BU KIŞ SENİNKİNİ YAPSINLAR.')],
    text: TX('BUZDİŞ, GLASİ AYININ DEV BUZUL HALKINDAN. ADIMLARI YAVAŞ AMA OMUZLARI DAĞ GİBİ. GRAX ONU BUZUN İÇİNDE UYURKEN BULDU VE UYANDIRDI. O GÜNDEN BERİ PİSTTE KİMSEYE YOL VERMİYOR.') },
  aurora: { race: TX('IŞIK SÜZÜCÜ'), home: TX('KUTUP GEZEGENİ LUMEN'), trick: TX('ÖNDE KAÇAR, MAYIN BIRAKIR'),
    taunt: TX('IŞIĞIMI KOVALA, YETİŞEBİLİRSEN.'),
    lose: [TX('IŞIĞIMI GEÇTİN. GÖKYÜZÜ SANA DA RENK VERDİ DEMEK.'), TX('LUMEN\'DE GECELER YEŞİL PARLAR. SENİN DÜNYANDA DA ÖYLE Mİ?')],
    text: TX('AURORA, LUMEN\'İN KUTUP IŞIKLARINDAN DOĞAN BİR IŞIK SÜZÜCÜ. KOŞARKEN ARKASINDA RENKLİ BİR İZ BIRAKIR. GRAX ONU "EN GÜZEL YAYIN GÖRÜNTÜSÜ" DİYE TOPLADI; KANATLARI KAFESTE SOLUYOR.') },
  kar: { race: TX('KRİSTAL CİN'), home: TX('BUZ HALKASI'), trick: STYLE_TRICK.zikzak,
    taunt: TX('HER KAR TANESİ FARKLIDIR. BEN EN HIZLISIYIM!'),
    lose: [TX('ERİDİM Mİ? HAYIR... SADECE BİRAZ UTANDIM.'), TX('NİVA KRALİÇE BENİ HER GECE DONDURUR, SABAH ÇÖZER. BİR GÜN SICAK BİR YERDE UYANMAK İSTİYORUM.')],
    text: TX('KAR TANESİ, BUZ HALKASI\'NIN KRİSTAL CİNLERİNDEN. NİVA\'NIN SARAYINDA DOĞDU, ONUN EMRİNDE KOŞUYOR. ŞERİT ŞERİT SÜZÜLÜR, ÖNÜNE GEÇİP SENİ YAVAŞLATMAYI SEVER. KİMSE ONUN GÜLDÜĞÜNÜ GÖRMEDİ.') },
  tozkiran: { race: TX('ÇÖL HAYDUDU'), home: TX('KIZIL KUM'), trick: STYLE_TRICK.atici,
    taunt: TX('KUM GÖZÜNE KAÇMASIN DÜNYALI!'),
    lose: [TX('NİŞANIM KUMA GÖMÜLDÜ. SENİ VURAMADIM, HELAL OLSUN.'), TX('BİR ZAMANLAR KERVANLARI KORURDUM. GRAX BENİ HAYDUT YAPTI. BELKİ SEN BİZİ YENİDEN İYİ YAPARSIN.')],
    text: TX('TOZKIRAN, KIZIL KUM\'UN KERVAN YOLLARINI KORUYAN BİR MUHAFIZDI. ZARG ÇÖLÜ YUTUNCA GRAX\'IN ŞOVUNA SATILDI. ARTIK PİSTTE KUM KADAR SICAK PLAZMA ATIYOR, AMA HÂLÂ KERVAN ŞARKILARI MIRILDANIYOR.') },
  zib: { race: TX('ÜÇ GÖZLÜ TÜCCAR'), home: TX('PAZAR GEZEGENİ OBO'), trick: TX('SONDAN GELİR, SONDA ATAKLAR'),
    taunt: TX('ÜÇ GÖZÜM VAR, ÜÇÜ DE KAZANMAMI GÖRÜYOR.'),
    lose: [TX('ÜÇ GÖZÜM DE AYNI ŞEYİ GÖRDÜ: SENİN SIRTINI.'), TX('MOKO BENİM KUZENİM. ONA SÖYLE, BORCUMU UNUTMADIM.')],
    text: TX('ZİB, OBO PAZARININ EN PAZARLIKÇI TÜCCARIYDI. GRAX\'LA BİR BAHSE GİRDİ VE KAYBETTİ; ŞİMDİ BORCUNU PİSTTE ÖDÜYOR. YARIŞI HEP SONA SAKLAR, ÇÜNKÜ "EN İYİ FİYAT SON ANDA ÇIKAR" DER.') },
  serap: { race: TX('SERAP RUHU'), home: TX('BİLİNMİYOR'), trick: TX('ÖNDE KAÇAR, MAYIN BIRAKIR'),
    taunt: TX('GÖRDÜĞÜN BEN MİYİM, YOKSA SERAP MI?'),
    lose: [TX('DEMEK GERÇEKTİM. SEN DE ÖYLEYMİŞSİN.'), TX('ÇÖLDE BİR KAPI GÖRDÜM DENİZ. IŞIKLI BİR KAPI. SERAP DEĞİLDİ, EMİNİM.')],
    text: TX('SERAP, KIZIL KUM\'UN SICAĞINDA TİTREŞEN BİR RUH. KİMİ ONU GÖRDÜĞÜNÜ SANIR, KİMİ GÖRMEZ. GRAX BİLE ONU NASIL YAKALADIĞINI BİLMİYOR. ÖNDE KAÇAR VE ARKASINDA KUM MAYINLARI BIRAKIR.') },
  nova: { race: TX('YILDIZ ÇOCUĞU'), home: TX('SÖNMÜŞ YILDIZ VEGA-9'), trick: STYLE_TRICK.zikzak,
    taunt: TX('BEN BİR YILDIZDAN DOĞDUM. SEN BİR ATTAN!'),
    lose: [TX('BİR AT BİR YILDIZI GEÇTİ. BUNU YILDIZLARA ANLATACAĞIM.'), TX('GRAX\'IN TAHTININ ARKASINDA BİR KAPI VAR. KUPA ONUN ANAHTARI. UNUTMA.')],
    text: TX('NOVA, SÖNEN BİR YILDIZIN SON IŞIĞINDAN DOĞDU. GRAX ONU ARENA\'NIN TAVANINDAN SARKITIR, SEYİRCİ YILDIZ GİBİ PARLADIĞINI SANSIN DİYE. HIZLI DÜŞÜNÜR, DAHA HIZLI ŞERİT DEĞİŞTİRİR.') }
};
const ETAP_INFO = {
  sprint: { name: TX('SPRİNT'), short: TX('İLK SIRALARA GİR'), icon: 'run' },
  parkur: { name: TX('ENGEL PARKURU'), tiny: TX('PARKUR'), short: TX('HASARSIZ GEÇ'), icon: 'shoe' },
  kovala: { name: TX('KARA DELİK KAÇIŞI'), tiny: TX('KAÇIŞ'), short: TX('KARA DELİKTEN KAÇ'), icon: 'swirl' },
  baskin: { name: TX('KORSAN BASKINI'), tiny: TX('BASKIN'), short: TX('KORSANLARI VUR'), icon: 'w_yay' },
  panayir: { name: TX('UZAY PAZARI'), tiny: TX('PAZAR'), short: TX('ALIŞVERİŞ'), icon: 'stall' },
  cesme: { name: TX('DİNLENME KAPSÜLÜ'), tiny: TX('KAPSÜL'), short: TX('DİNLEN'), icon: 'fountain' },
  kaos: { name: TX('KAOS KAPISI'), tiny: TX('KAOS'), short: TX('1 CAN VER'), icon: 'swirl' },
  olay: { name: TX('YOL OLAYI'), tiny: TX('OLAY'), short: TX('BİR SEÇİM'), icon: 'scroll' },
  duello: { name: TX('DÜELLO'), short: TX('RAKİBİ GEÇ'), icon: 'duel' },
  boss: { name: TX('ŞAMPİYON YARIŞI'), tiny: TX('ŞAMPİYON'), short: TX('ŞAMPİYONU GEÇ'), icon: 'crown' }
};
const ETAP_TIPS = {
  sprint: TX('İLK SIRALARA GİR! RİTİMLE HIZLAN. RAKİBİN ARKASINDA KALIRSAN RÜZGAR SİPERİ DOLAR, SONRA YANA ÇIK.'),
  parkur: TX('ENGELLER SIK. ENGELE YAKLAŞINCA SIÇRA: TEMİZ ATLAYIŞ HIZ VERİR, ERKEN SIÇRARSAN SIYIRIRSIN. HASARSIZ BİTİRİRSEN ALTIN MADALYA.'),
  kovala: TX('KARA DELİK ARKANDA! YAVAŞLARSAN SENİ YUTAR. KOMBOYU KORU.'),
  reyting: TX('KIL PAYI, SOLLAMA, TEMİZ ATLAYIŞ VE KOMBO SEYİRCİYİ COŞTURUR. DOLUNCA SPONSOR HEDİYE ATAR; UZUN SÜRE SIFIRDA KALIRSAN GRAX METEOR YAĞDIRIR.'),
  rgate: TX('YAKLAŞIRKEN 2 NOTA VUR, KAPININ IŞIKLARI YANSIN. AÇIK KAPI HIZ VE NEFES VERİR; ISKALARSAN SAYAÇ SIFIRLANIR, KAPALI KAPIDA YAVAŞLARSIN.'),
  scan: TX('HER VURUŞTA BİR ŞERİT KAYAR, KENARA GELİNCE DÖNER. MÜZİĞİ DİNLE, NEREDE OLACAĞINI TAHMİN ET. ÜSTÜNDEN SIÇRANMAZ.'),
  duello: TX('BİRE BİR YARIŞ! RAKİPTEN ÖNCE BİTİR, YOKSA 1 CAN GİDER. ARKASINDA KALIRSAN SİPER DOLAR; ATIŞLARIN ONU BİR AN SERSEMLETİR.'),
  baskin: TX('UZAY KORSANLARI SALDIRIYOR! RİTİMLE DOKUN, EYERDEKİ SİLAH ATEŞ ETSİN. YOLUN YARISINDA KAPTANLARI GELİR.'),
  boss: TX('FARK ÇUBUĞUNU DOLDUR: RİTİMLE VUR, ATEŞ ET, HAMLE YAP. ŞAMPİYONUN 3 AŞAMASI VAR; YORULUNCA ATIŞLARIN İKİ KAT İŞLER.'),
  zorlu: TX('ZORLU ETAP: DAHA SIK ENGEL VE DÜŞMAN, İKİ KAT ÖDÜL.'),
  yagmur: TX('ASİT YAĞMURU: ŞERİT DEĞİŞTİRMEK YAVAŞLAR, JÖLE BİRİKİNTİSİ ÇOK.'),
  sis: TX('NEBULA SİSİ: ENGELLERİ GEÇ GÖRÜRSÜN. KULAĞIN RİTİMDE OLSUN.'),
  ruzgar: TX('GÜNEŞ RÜZGARI: ARKADAN ESİNCE HIZLANIR, ÖNDEN ESİNCE YAVAŞLARSIN.'),
  kar: TX('KAR FIRTINASI: PİST KAYGAN, ŞERİT DEĞİŞTİRMEK BİRAZ YAVAŞ. ENGELE ERKEN HAZIRLAN.'),
  kumf: TX('KUM FIRTINASI: UZAĞI GÖREMEZSİN VE RÜZGAR ESER. RİTMİ DİNLE, ARKA RÜZGARI YAKALA.'),
  hamle: TX('NEFES: AŞAĞI KAYDIR YA DA ALTTAKİ ÇİFT OKA BAS, HAMLE YAP. SAKLADIĞIN NEFES SON DÜZLÜKTE SON ATAĞA DÖNÜŞÜR.'),
  nota_a: TX('ALTIN NOTAYI MÜKEMMEL VURURSAN SİLAHIN ÖZEL ATIŞ YAPAR. NOTA OLMAYAN BOŞLUKTA DOKUNMA, RAHATÇA ŞERİT DEĞİŞTİR.'),
  nota_d: TX('ÇİFT NOTA: İKİ İŞARET ART ARDA GELİR. VURUŞTA VE ARADA İKİ KEZ DOKUN.'),
  nota_h: TX('UZUN NOTA: VURUŞTA BAS VE PARMAĞINI KALDIRMA, NEFES TOPLA. BASILIYKEN KAYDIRARAK YÖN DE DEĞİŞTİREBİLİRSİN.'),
  viraj: TX('VİRAJ: İÇ KULVAR DAHA KISA. OKLARIN GÖSTERDİĞİ İÇ TARAFA GEÇ, DIŞTA KALAN GERİDE KALIR.')
};
const TIP_TITLES = { reyting: TX('REYTİNG'), rgate: TX('RİTİM KAPISI'), scan: TX('TARAYICI LAZER'), hamle: TX('NEFES VE HAMLE'), nota_a: TX('ALTIN NOTA VE ES'), nota_d: TX('ÇİFT NOTA'), nota_h: TX('UZUN NOTA'), viraj: TX('VİRAJ'), zorlu: TX('ZORLU ETAP') };
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
  acik: { name: TX('AÇIK GÖK'), icon: null },
  yagmur: { name: TX('ASİT YAĞMURU'), icon: 'rain' },
  sis: { name: TX('NEBULA SİSİ'), icon: 'fog' },
  ruzgar: { name: TX('GÜNEŞ RÜZGARI'), icon: 'gust' },
  kar: { name: TX('KAR FIRTINASI'), icon: 'spark' },
  kumf: { name: TX('KUM FIRTINASI'), icon: 'wind' }
};

// ---------- chaos gate: a curse for 3 stages, then a blessing ----------
const CHAOS_CURSES = [
  { id: 'agir', name: TX('AĞIR TOYNAK'), desc: TX('HIZ -%10'), apply: S => { S.speed *= 0.9; } },
  { id: 'dar', name: TX('DAR PENCERE'), desc: TX('RİTİM PENCERESİ -%30'), apply: S => { S.perfectWin *= 0.7; S.goodWin *= 0.85; } },
  { id: 'kirik', name: TX('KIRIK LENS'), desc: TX('ATIŞ HASARI -%50'), apply: S => { S.shotDmg *= 0.5; } },
  { id: 'sis', name: TX('NEBULA SİSİ'), desc: TX('HER ETAP SİSLİ'), apply: S => { S.forceFog = true; } },
  { id: 'pahali', name: TX('PAHALI YOL'), desc: TX('PAZAR +%60 PAHALI'), apply: S => { S.discount -= 0.6; } },
  { id: 'kalabalik', name: TX('KALABALIK'), desc: TX('DÜŞMANLAR %50 FAZLA'), apply: S => { S.moreFoes *= 1.5; } }
];
const CHAOS_BLESS = [
  { id: 'hiz', name: TX('KAOS HIZI'), desc: TX('HIZ +%12'), apply: S => { S.speed *= 1.12; } },
  { id: 'can', name: TX('KAOS YÜREĞİ'), desc: TX('AZAMİ CAN +2'), apply: S => { S.maxHp += 2; }, onActive: r => { r.hp += 2; } },
  { id: 'ok', name: TX('KAOS IŞINI'), desc: TX('ATIŞ HASARI +%80'), apply: S => { S.shotDmg *= 1.8; } },
  { id: 'kese', name: TX('KAOS KESESİ'), desc: TX('SİKKE KAZANCI X2'), apply: S => { S.coinMult *= 2; } },
  { id: 'kalkan', name: TX('KAOS KALKANI'), desc: TX('HER ETAP 1 KALKAN'), apply: S => { S.shield += 1; } },
  { id: 'sifa', name: TX('KAOS ŞİFASI'), desc: TX('ETAP SONU +1 CAN'), apply: S => { S.etapHeal = 1; } }
];
const CHAOS_BY_ID = {}; CHAOS_CURSES.concat(CHAOS_BLESS).forEach(c => CHAOS_BY_ID[c.id] = c);

// ---------- road events (between tracks, in deep space) ----------
const EVENTS = [
  { id: 'tay', title: TX('SIKIŞMIŞ YAVRU'), icon: 'heart', text: TX('HURDA YIĞININA SIKIŞMIŞ MİNİCİK BİR UZAYLI YAVRUSU. ANNESİ ORTALIKTA YOK.'),
    choices: [
      { label: TX('ÇEKİP ÇIKAR'), desc: TX('+1 AZAMİ CAN'), fn: r => { r.bonusMaxHp++; r.hp++; return TX('YAVRU SEVİNÇLE IŞILDADI. KALBİN ISINDI.'); } },
      { label: TX('20 SİKKE BIRAK'), desc: TX('+8 KRİSTAL'), req: r => r.coins >= 20, fn: r => { r.coins -= 20; r.yonca += 8; return TX('BİR DEVRİYE YAVRUYU ALDI, SANA KRİSTAL VERDİ.'); } },
      { label: TX('YOLUNA DEVAM ET'), desc: TX('HİÇBİR ŞEY'), fn: () => TX('ARKANDAN İNCE BİR BİPLEME DUYDUN...') }
    ] },
  { id: 'kumar', title: TX('ÜÇ GÖZLÜ KUMARBAZ'), icon: 'coin0', text: TX('ÜÇ ZAR, ÜÇ GÖZ! İKİSİ YILDIZ GELİRSE SİKKEN İKİ KATINA ÇIKAR!'),
    choices: [
      { label: TX('30 SİKKE YATIR'), desc: TX('%50 ŞANS: +30'), req: r => r.coins >= 30, fn: r => { if (rnd() < 0.5) { r.coins += 30; return TX('İKİ YILDIZ! KAZANDIN.'); } r.coins -= 30; return TX('KARA DELİK... KUMARBAZ ÜÇ GÖZÜYLE GÜLÜMSEDİ.'); } },
      { label: TX('HEPSİNİ YATIR'), desc: TX('%45 ŞANS: İKİ KAT'), req: r => r.coins >= 10, fn: r => { if (rnd() < 0.45) { r.coins *= 2; return TX('İNANILMAZ! KESEN DOLDU.'); } r.coins = 0; return TX('KESEN BOŞALDI. DERS OLSUN.'); } },
      { label: TX('UZAK DUR'), desc: TX('HİÇBİR ŞEY'), fn: () => 'AKILLICA.' }
    ] },
  { id: 'okcu', title: TX('EMEKLİ NİŞANCI'), icon: 'w_yay', text: TX('IŞIK YAYI MI O? BEN ONLARI PİLLER İCAT EDİLMEDEN KULLANIRDIM. VER, BİR BAKAYIM.'),
    choices: [
      { label: TX('40 SİKKEYE AYARLAT'), desc: TX('ATIŞ HASARI +%50 (BU KOŞU)'), req: r => r.coins >= 40, fn: r => { r.coins -= 40; r.shotBonus = (r.shotBonus || 0) + 0.5; return TX('LENSLER JİLET GİBİ PARLADI.'); } },
      { label: TX('TAVSİYE İSTE'), desc: TX('SONRAKİ ETAP 15 KOMBOYLA BAŞLA'), fn: r => { r.nextCombo = 15; return TX('"NEFES AL, VURUŞU BEKLE, BIRAK. UZAYDA DA ÖYLE."'); } }
    ] },
  { id: 'sunak', title: TX('YILDIZ SUNAĞI'), icon: 'swirl', text: TX('BOŞLUKTA SÜZÜLEN BİR SUNAK. ÜSTÜNDE TOYNAK İZİ ŞEKLİNDE BİR TAKIMYILDIZ PARLIYOR.'),
    choices: [
      { label: TX('1 CAN ADA'), desc: TX('EN AZ NADİR BİR YILDIZ GÜCÜ'), req: r => r.hp > 1, fn: r => { r.hp--; r.rareNext = true; r.pendingBoon = R.pick(SPIRIT_KEYS); return TX('SUNAK PARLADI. BİR TAKIMYILDIZ SENİ SEÇTİ.'); } },
      { label: TX('DİLEK TUT'), desc: TX('+1 CAN'), fn: r => { r.hp++; r.healCap = true; return TX('İÇİNİ BİR SERİNLİK KAPLADI.'); } }
    ] },
  { id: 'iz', title: TX('ESKİ BİR SİNYAL'), icon: 'shoe', text: TX('TELSİZDE CIZIRTILI BİR SES: "BURASI AKYEL... DUYAN VAR MI?" SİNYAL YİRMİ YILLIK.'),
    choices: [
      { label: TX('SİNYALİ TAKİP ET'), desc: TX('+6 KRİSTAL'), fn: r => { r.yonca += 6; META.flags.izler = true; return TX('SİNYAL BİR ENKAZDA KESİLDİ. İÇERİDE KIRMIZI BEYAZ ESKİ BİR KASK VARDI.'); } },
      { label: TX('YOLUNA DÖN'), desc: TX('+15 SİKKE'), fn: r => { r.coins += 15; return TX('ENKAZDA BİR KESE SİKKE BULDUN.'); } }
    ] },
  { id: 'demirci', title: TX('GEZGİN DEMİRCİ'), icon: 'hammer', text: TX('KARGO GEMİSİNDE ÖRSÜ OLAN DÖRT KOLLU BİR DEMİRCİ: SİLAHINA BİR ÇEKİÇ VURAYIM MI?'),
    choices: [
      { label: TX('50 SİKKE VER'), desc: TX('DEMİRCİ ÇEKİCİ: SİLAHINI DEĞİŞTİR'), req: r => r.coins >= 50 && (r.hammers || 0) < 2, fn: r => { r.coins -= 50; r.pendingHammer = true; return TX('ÖRS ÇINLADI, KIVILCIMLAR BOŞLUĞA SAÇILDI.'); } },
      { label: TX('SOLUKLAN'), desc: TX('+1 CAN'), fn: r => { r.hp++; return TX('DEMİRCİ SANA SU VERDİ. BİRAZ DİNLENDİN.'); } }
    ] },
  { id: 'tuzak', title: TX('KORSAN PUSUSU'), icon: 'skull', text: TX('YOLU KESEN UZAY KORSANLARI BAĞIRIYOR: KESEYİ VER, GEÇ!'),
    choices: [
      { label: TX('SAVAŞ'), desc: TX('BASKIN ETABI, ÖDÜL X2'), fn: r => { r.pendingNode = { type: 'baskin', reward: { kind: 'coins', n: 50 }, elite: true, weather: 'acik' }; return TX('YILDIZ ŞAHLANDI!'); } },
      { label: TX('30 SİKKE ÖDE'), desc: TX('SORUNSUZ GEÇ'), req: r => r.coins >= 30, fn: r => { r.coins -= 30; return TX('KORSANLAR GÜLEREK YOLU AÇTI.'); } },
      { label: TX('KAÇMAYI DENE'), desc: TX('%50: 1 CAN KAYBI'), fn: r => { if (rnd() < 0.5) { r.hp = Math.max(1, r.hp - 1); return TX('BİR LAZER SIYIRDI. -1 CAN.'); } return TX('TOZU DUMANA KATTIN, KAÇTIN!'); } }
    ] }
];

// v5.1 · planet events (reg: only on these planets) and a station-wide one
EVENTS.push(
  { id: 'kargo', reg: ['buz'], title: TX('DONMUŞ KARGO'), icon: 'gift', text: TX('BUZ HALKASINDA DONMUŞ BİR KARGO KAPSÜLÜ. İÇİNDEN TIKIRTI GELİYOR.'),
    choices: [
      { label: TX('20 SİKKEYE ISIT'), desc: TX('GÜVENLİ: KRİSTAL, BELKİ ŞEKER'), req: r => r.coins >= 20, fn: r => { r.coins -= 20; r.yonca += 6; if (rnd() < 0.5) { r.seker++; return TX('BUZ ERİDİ: İÇİNDE KRİSTALLER VE BİR KESME ŞEKER!'); } return TX('BUZ ERİDİ: KAPSÜL KRİSTAL DOLUYMUŞ.'); } },
      { label: TX('TEKMEYLE KIR'), desc: TX('%50: +35 SİKKE, %50: -1 CAN'), fn: r => { if (rnd() < 0.5) { r.coins += 35; return TX('KAPSÜL PATLADI, SİKKELER SAÇILDI!'); } r.hp = Math.max(1, r.hp - 1); return TX('BİR BUZ PARÇASI SEKTİ. -1 CAN.'); } },
      { label: TX('DOKUNMA'), desc: TX('HİÇBİR ŞEY'), fn: () => TX('TIKIRTI ARKANDA KALDI...') }
    ] },
  { id: 'kartanesi', reg: ['buz'], title: TX('KAR TANESİ\'NİN SIRRI'), icon: 'spark', text: TX('KRİSTAL CİN KAR TANESİ YOLUNU KESTİ: "NİVA\'NIN AYAZI NASIL KIRILIR, BİLİYOR MUSUN?"'),
    choices: [
      { label: TX('DİNLE'), desc: TX('SONRAKİ ETAP 12 KOMBOYLA BAŞLA'), fn: r => { r.nextCombo = 12; return TX('"ALTIN NOTAYI TAM VUR, BUZ ÇATLAR. KRALİÇEYE SÖYLEME!"'); } },
      { label: TX('YARIŞA DAVET ET'), desc: TX('LİGDE +4 PUAN'), fn: r => { leagueAdd('deniz', 4); return TX('KAR TANESİ GÜLDÜ, SANA BİR LİG PUANI JETONU ATTI.'); } }
    ] },
  { id: 'vaha', reg: ['kum'], title: TX('ÇÖLDE BİR VAHA'), icon: 'fountain', text: TX('KIZIL KUMUN ORTASINDA MAVİ BİR SU. YILDIZ KULAKLARINI DİKTİ.'),
    choices: [
      { label: TX('SU İÇ'), desc: TX('+2 CAN'), fn: r => { r.hp += 2; r.healCap = true; return TX('SU SERİNDİ. YILDIZ DA KANA KANA İÇTİ.'); } },
      { label: TX('YAKINDAN BAK'), desc: TX('%50: ŞEKER, %50: SERAP'), fn: r => { if (rnd() < 0.5) { r.seker++; return TX('SUYUN DİBİNDE PARLAYAN BİR KESME ŞEKER!'); } r.coins = Math.max(0, r.coins - 10); return TX('SERAPMIŞ... KUMA BATTIN, 10 SİKKE DÜŞÜRDÜN.'); } }
    ] },
  { id: 'kervan', reg: ['kum'], title: TX('TOZKIRAN\'IN KERVANI'), icon: 'stall', text: TX('ESKİ BİR KERVAN, KORSANLARDAN KAÇIYOR. TOZKIRAN EL SALLIYOR: "YARDIM ET DÜNYALI!"'),
    choices: [
      { label: TX('KERVANI KORU'), desc: TX('BASKIN ETABI, 60 SİKKE X2'), fn: r => { r.pendingNode = { type: 'baskin', reward: { kind: 'coins', n: 60 }, elite: true, weather: 'ruzgar' }; return TX('YILDIZ KERVANIN ÖNÜNE GEÇTİ!'); } },
      { label: TX('30 SİKKEYE TAKAS'), desc: TX('BİR YILDIZ GÜCÜ'), req: r => r.coins >= 30, fn: r => { r.coins -= 30; r.pendingBoon = R.pick(SPIRIT_KEYS); return TX('KERVANDA YILDIZ TOZU DOLU BİR ŞİŞE BULDUN.'); } }
    ] },
  { id: 'bop', title: TX('BOP-1'), icon: 'gear', text: TX('BİP\'İN KUZENİ BOP-1 ENKAZDAN BAŞINI KALDIRDI: "BOP! KALKAN JENERATÖRÜM ÇALIŞIYOR. YAKITIM BİTTİ AMA."'),
    choices: [
      { label: TX('25 SİKKE VER'), desc: TX('SONRAKİ ETAP +2 KALKAN'), req: r => r.coins >= 25, fn: r => { r.coins -= 25; r.nextShield = (r.nextShield || 0) + 2; return TX('BOP! KALKANLAR ŞARJ OLDU. BİP\'E SELAM SÖYLE.'); } },
      { label: TX('SOHBET ET'), desc: TX('+4 KRİSTAL'), fn: r => { r.yonca += 4; return TX('"BİP HEP SENDEN BAHSEDİYOR." BOP SANA BİR KRİSTAL KUTUSU VERDİ.'); } }
    ] }
);

// ---------- keepsakes from station friends (gift Earth sugar cubes) ----------
const KEEPSAKES = {
  bip: { name: TX('BİP\'İN YEDEK PİLİ'), desc: l => TX('BİR KEZ ÖLÜMCÜL DARBEYİ ') + (l >= 2 ? 2 : 1) + TX(' CANLA ATLAT') + (l >= 3 ? TX(', 2 SN DOKUNULMAZ') : ''), apply: (S, l) => { S.muska = l; } },
  ayse: { name: TX('AYŞE\'NİN KURDELESİ'), desc: l => TX('ETAPLARA ') + [3, 6, 10][l - 1] + TX(' KOMBOYLA BAŞLA'), apply: (S, l) => { S.startCombo += [3, 6, 10][l - 1]; } },
  kemal: { name: TX('KEMAL\'İN KRONOMETRESİ'), desc: l => TX('SPRİNT VE DÜELLODA RAKİPLER ') + [25, 40, 60][l - 1] + TX(' ADIM GERİDEN BAŞLAR'), apply: (S, l) => { S.rivalHandicap = [25, 40, 60][l - 1]; } },
  tayfun: { name: TX('TAYFUN\'UN GÖZLÜĞÜ'), desc: l => TX('DÜŞMANLAR %') + [50, 75, 100][l - 1] + TX(' FAZLA SİKKE DÜŞÜRÜR'), apply: (S, l) => { S.foeCoins *= 1 + [0.5, 0.75, 1][l - 1]; } },
  moko: { name: TX('MOKO\'NUN KESESİ'), desc: l => TX('KOŞUYA ') + [25, 40, 60][l - 1] + TX(' SİKKEYLE BAŞLA, PAZAR -%') + [10, 15, 20][l - 1], apply: (S, l) => { S.startCoins += [25, 40, 60][l - 1]; S.discount += [0.1, 0.15, 0.2][l - 1]; } }
};
const NPC_LINES = {
  bip: { gift: [TX('ŞEKER Mİ? BİP! YİYEMEM AMA SAKLARIM. AL, YEDEK PİLİM SENDE DURSUN.'), TX('PİLİ ŞARJ ETTİM. ŞEKERİ DE KOLEKSİYONUMA KOYDUM.'), TX('SEN BU İSTASYONUN YILDIZISIN DENİZ. BİP.')],
    chat: [TX('YILDIZ\'IN YEMİNİ TAZELEDİM. BİP BİP.'), TX('GRAX\'IN ŞOVU 9.000 GEZEGENDE CANLI YAYINDA. GÜLÜMSE!'), TX('KAYITLARIMDA AKYEL ADINDA BİR JOKEY VAR. DOSYA... KİLİTLİ.')] },
  ayse: { gift: [TX('DÜNYA ŞEKERİ! AL, KURDELEMİ YILDIZ\'IN YELESİNE BAĞLAYAYIM.'), TX('KURDELEYİ YENİLEDİM, ŞİMDİ DAHA HIZLIYIZ!'), TX('BİRLİKTE EVE DÖNECEĞİZ DENİZ.')],
    chat: [TX('RİTİM! TOYNAK SESİNİ DİNLE, UZAYDA BİLE AYNI.'), TX('DÜŞMANLARA NİŞAN ALMA, VURUŞU YAKALA, IŞIN KENDİ GİDER.'), TX('ÜÇ SEZONDUR BURADAYIM. SEN GELİNCE İLK KEZ UMUTLANDIM.')] },
  kemal: { gift: [TX('ŞEKER HA... BU KRONOMETRE KIRK YILDIR BENİMLE. SENİN OLSUN.'), TX('ZAMANI SENİN İÇİN AYARLADIM. BURADA GÜNLER 30 SAAT, DİKKAT.'), TX('AKYEL\'LE AYNI PİSTTE KOŞTUM. SEN ONUN KADAR İYİSİN.')],
    chat: [TX('ACELE ETME, SON DÜZLÜK YARIŞIN YARISIDIR.'), TX('RAKİBİN ARKASINA SAKLAN, SONRA YANA ÇIK.'), TX('VOLTRAK HİLE YAPMADAN KAZANAMAZ, BUNU HERKES BİLİR.')] },
  tayfun: { gift: [TX('ŞEKER! AL GÖZLÜĞÜMÜ, KORSANLARI UZAKTAN GÖR!'), TX('GÖZLÜĞE BİR CİLA ÇEKTİM, NEBULADA BİLE PARLIYOR!'), TX('SEN DELİ BİR JOKEYSİN DENİZ, BAYILIYORUM!')],
    chat: [TX('VUR, KIR, DAĞIT! SONRA SİKKELERİ TOPLA.'), TX('KÜKREMEYİ DOĞRU ANDA KULLAN.'), TX('BİR GÜN GRAX\'IN MİKROFONUNU ÇALACAĞIM.')] },
  moko: { gift: [TX('VAY, ŞEKER! DÖRT KOLUMLA SARILIRIM. AL ŞU KESEYİ, İÇİ BOŞ AMA UĞURLUDUR.'), TX('KESEYE BİR İKİ SİKKE KOYDUM, GRAX\'A SÖYLEME.'), TX('GALAKSİNİN EN İYİ MÜŞTERİSİ SENSİN, DÜNYALI.')],
    chat: [TX('TAZE SÜSLER GELDİ, DÖRT KOLUMLA TAŞIDIM!'), TX('BÖLMEN GÜZELLEŞTİKÇE SEYİRCİN ARTIYOR.'), TX('PAZARDA SENİ BEKLİYORUM.')] }
};
const NPC_NAMES = { bip: TX('BİP-0'), ayse: TX('AYŞE'), kemal: TX('KEMAL USTA'), tayfun: TX('TAYFUN'), moko: TX('MOKO') };

// ---------- the logbook: pages unlocked by progress ----------
const MEMORIES = [
  { id: 1, title: TX('IŞIK'), hint: TX('BAŞLANGIÇ'), cond: () => true,
    text: TX('ALTIN NAL KUPASI\'NI ÜÇÜNCÜ KEZ KAZANDIĞIN GECE HİPODROMUN ÜSTÜNDE SESSİZ BİR IŞIK BELİRDİ. YILDIZ KİŞNEDİ, SEN DİZGİNLERİ SIKTIN. GÖZÜNÜ AÇTIĞINDA YILDIZLARIN ARASINDAYDIN.') },
  { id: 2, title: TX('GALAKSİ KUPASI'), hint: TX('İLK YILDIZ GÜCÜNÜ AL'), cond: () => META.stats.boons > 0,
    text: TX('ARENA-9, GALAKSİNİN EN BÜYÜK YARIŞ ŞOVU. SUNUCU GRAX HER SEZON BAŞKA GEZEGENLERDEN ŞAMPİYON KAÇIRIR. KUPAYI KAZANAN EVE DÖNER, DİYOR. BUGÜNE KADAR KİMSE DÖNMEDİ.') },
  { id: 3, title: TX('KAYIP JOKEY'), hint: TX('İLK ŞAMPİYONLA KARŞILAŞ'), cond: () => !!(META.stats.bossWins.pirlanta || META.flags.lost_pirlanta),
    text: TX('BİP\'İN KAYITLARINDA YİRMİ YIL ÖNCEKİ BİR FİNAL VAR: DÜNYALI BİR JOKEY, SON DÜZLÜKTE VOLTRAK\'I GEÇMEK ÜZERE. GÖRÜNTÜ ORADA KESİLİYOR. JOKEYİN ADI AKYEL. ANNENİN ADI.') },
  { id: 4, title: TX('TUTSAK ŞAMPİYONLAR'), hint: TX('MANTAR AYI\'NA ULAŞ'), cond: () => META.stats.bestRegion >= 1,
    text: TX('PRENS KRİSTALO YENİLİNCE KULAĞINA FISILDADI: "BEN DE KAÇIRILDIM. HEPİMİZ GRAX\'IN ŞOVUNDAYIZ." RAKİPLERİN DÜŞMAN DEĞİL, AYNI KAFESTEKİ KUŞLAR.') },
  { id: 5, title: TX('YILDIZ ATLARI'), hint: TX('İKİLİ GÜÇ YA DA 12 GÜÇ AL'), cond: () => META.stats.duos > 0 || META.stats.boons >= 12,
    text: TX('TULPAR, KIRAT, SLEİPNİR, PEGASUS VE RÜZGAR KISRAĞI... DÜNYADAN BAKINCA BİRER TAKIMYILDIZ. BURADAN BAKINCA YILDIZ\'LA KONUŞAN DOSTLAR. ANNEN DE ONLARI DUYARMIŞ.') },
  { id: 6, title: TX('GRAX\'IN SIRRI'), hint: TX('GALAKSİ ARENASI\'NA ULAŞ'), cond: () => META.stats.bestRegion >= LAST_REGION,
    text: TX('KUPA BİR ÖDÜL DEĞİL, BİR ANAHTAR: EVE GİDEN IŞINLANMA KAPISINI AÇIYOR. GRAX BU YÜZDEN KİMSENİN KAZANMASINA İZİN VERMİYOR. VOLTRAK\'IN TOYNAKLARINDAKİ KIVILCIMLAR: HİLE.') },
  { id: 7, title: TX('EVE DÖNÜŞ'), hint: TX('GALAKSİ KUPASI\'NI KAZAN'), cond: () => META.stats.wins > 0,
    text: TX('KUPAYI KALDIRDIĞINDA KAPI AÇILDI. TRİBÜNDEN GRİ SAÇLI BİR KADIN İNDİ: AKYEL. YİRMİ YILDIR SENİ İZLİYORMUŞ. YILDIZ ONU HEMEN TANIDI. ARTIK HERKES İSTEDİĞİ YERDE KOŞABİLİR.') }
];

const MISSION_POOL = [
  { k: 'combo', t: n => TX('BİR KOŞUDA ') + n + TX(' KOMBO YAP'), n: [12, 20, 30, 45], run: true },
  { k: 'perfect', t: n => n + TX(' MÜKEMMEL RİTİM YAKALA'), n: [30, 60, 120, 200] },
  { k: 'jump', t: n => n + TX(' ENGELİN ÜSTÜNDEN SIÇRA'), n: [12, 25, 50, 80] },
  { k: 'sprint1', t: () => TX('BİR SPRİNTİ BİRİNCİ BİTİR'), n: [1] },
  { k: 'clean', t: n => n + TX(' ETABI HASARSIZ BİTİR'), n: [1, 2, 4] },
  { k: 'coins', t: n => TX('BİR KOŞUDA ') + n + TX(' SİKKE TOPLA'), n: [60, 120, 200, 300], run: true },
  { k: 'yonca', t: n => n + TX(' KRİSTAL TOPLA'), n: [10, 20, 35] },
  { k: 'boons', t: n => n + TX(' YILDIZ GÜCÜ SEÇ'), n: [3, 6, 10] },
  { k: 'boss', t: () => TX('BİR ŞAMPİYON YARIŞINI KAZAN'), n: [1], minLv: 3 },
  { k: 'shop', t: () => TX('UZAY PAZARINDAN ALIŞVERİŞ YAP'), n: [1] },
  { k: 'chase', t: () => TX('KARA DELİK KAÇIŞINI HASARSIZ BİTİR'), n: [1] },
  { k: 'overtake', t: n => n + TX(' RAKİP GEÇ'), n: [8, 20, 40] },
  { k: 'ability', t: n => TX('TEKNİĞİNİ ') + n + TX(' KEZ KULLAN'), n: [2, 4, 8] },
  { k: 'kills', t: n => n + TX(' DÜŞMAN VUR'), n: [10, 25, 50, 90] },
  { k: 'medal', t: n => n + TX(' ALTIN MADALYA KAZAN'), n: [1, 3, 6] },
  { k: 'nearmiss', t: n => n + TX(' KEZ KIL PAYI GEÇ'), n: [3, 8, 15] },
  { k: 'draft', t: n => n + TX(' KEZ SİPERDEN FIRLA'), n: [2, 5, 9] },
  { k: 'event', t: () => TX('BİR YOL OLAYINDA SEÇİM YAP'), n: [1] },
  { k: 'kaos', t: () => TX('BİR KAOS KAPISINDAN GEÇ'), n: [1], minLv: 2 },
  { k: 'temiz', t: n => n + TX(' TEMİZ ATLAYIŞ YAP'), n: [5, 12, 25] },
  { k: 'hamle', t: n => n + TX(' KEZ HAMLE YAP'), n: [4, 10, 20] },
  { k: 'special', t: n => n + TX(' ÖZEL ATIŞ YAP'), n: [5, 12, 25] },
  { k: 'nefes', t: n => n + TX(' UZUN NOTAYI SONUNA KADAR TUT'), n: [3, 8, 15], minLv: 2 },
  { k: 'reis', t: () => TX('BİR KORSAN KAPTANINI YEN'), n: [1], minLv: 3 },
  { k: 'kick', t: () => TX('SON ATAKLA BİR SPRİNTİ KAZAN'), n: [1], minLv: 2 },
  { k: 'duel', t: n => n === 1 ? TX('BİR DÜELLO KAZAN') : n + TX(' DÜELLO KAZAN'), n: [1, 2, 4], minLv: 2 },
  { k: 'gate', t: n => n + TX(' RİTİM KAPISI AÇ'), n: [3, 6, 12], minLv: 2 },
  { k: 'sponsor', t: n => n === 1 ? TX('BİR SPONSOR HEDİYESİ KAZAN') : n + TX(' SPONSOR HEDİYESİ KAZAN'), n: [1, 3, 5] },
  { k: 'fever', t: n => n === 1 ? TX('DÖRTNAL MODUNA GİR') : n + TX(' KEZ DÖRTNAL MODUNA GİR'), n: [1, 3, 6] },
  { k: 'bet', t: () => TX('MOKO\'NUN MASASINDA BİR BAHİS KAZAN'), n: [1], minLv: 2 },
  { k: 'revenge', t: () => TX('BİR RÖVANŞÇIDAN RÖVANŞ AL'), n: [1], minLv: 3 },
  { k: 'league', t: () => TX('BİR GEZEGENİ LİG LİDERİ BİTİR'), n: [1], minLv: 2 },
  { k: 'dodge', t: n => n + TX(' RAKİP ATIŞINDAN KAÇ'), n: [3, 8, 15], minLv: 2 },
  { k: 'ahead', t: n => n + TX(' İSİMLİ RAKİBİN ÖNÜNDE BİTİR'), n: [4, 10, 20] },
  { k: 'adim', t: n => n + TX(' RİTMİK ADIM AT (NOTA ANINDA KAYDIR)'), n: [10, 25, 50] },
  { k: 'sgrade', t: n => n === 1 ? TX('BİR ETABI S RİTİM NOTUYLA BİTİR') : n + TX(' ETABI S RİTİM NOTUYLA BİTİR'), n: [1, 3, 6] }
];
const DAILY = [10, 15, 20, 25, 30, 40, 60];
const DAILY_SUGAR = [0, 0, 1, 0, 0, 0, 2];

const STORY = [
  { id: 'firstRun', cond: () => META.stats.runs >= 1, lines: [['bip', TX('BİP! YORULMAK AYIP DEĞİL DENİZ. GRAX\'IN ŞOVUNDA HERKES İLK SEZONU KAYBEDER.')], ['ayse', TX('TOPLADIĞIN KRİSTALLERLE BÖLMEYİ ONARABİLİRİZ. ÜSTTEKİ HEDEFE BAK!')]] },
  { id: 'points', cond: () => META.points > 0, lines: [['ayse', TX('SEVİYE ATLADIN! AHIR MODÜLÜNE GİT, ANTRENMANDA KALICI BİR GÜÇ SEÇ.')]] },
  { id: 'firstBoon', cond: () => META.stats.boons > 0, lines: [['bip', TX('TAKIMYILDIZLAR MI KONUŞTU? KAYITLARIMDA ONLARI DUYAN BİR DÜNYALI DAHA VAR. KAMARANDAKİ SEYİR DEFTERİNE BAK.')]] },
  { id: 'pet', cond: () => META.stats.runs >= 2, lines: [['ayse', TX('YARIŞTAN ÖNCE YILDIZ\'I SEV! ÜSTÜNE DOKUN, MUTLU AT KOŞUYA KOMBOYLA BAŞLAR.')]] },
  { id: 'dog', cond: () => META.stats.runs >= 3, lines: [['bip', TX('BAK KİM GELDİ! HAVALANDIRMADA BULDUM BU ZIPLAYANI. ADINI ZIPZIP KOYDUM.')], ['ayse', TX('ZIPZIP HER GÜN ETRAFI KOKLAR, BAZEN KRİSTAL BULUR. ONU SEVMEYİ UNUTMA!')]] },
  { id: 'moko', cond: () => !!META.flags.moko, lines: [['moko', TX('SELAM DÜNYALI! BÖLMENE BİR TEZGAH KURDUM. SÜSLERİMLE BURASI ŞENLENİR!')], ['bip', TX('BÖLME GÜZELLEŞTİKÇE ÜS PUANI ARTAR. HER 5 PUANDA YILDIZ BİR SEVİYE PUANI KAZANIR.')]] },
  { id: 'silahhane', cond: () => built('silahhane'), lines: [['tayfun', TX('CEPHANELİK AÇILDI! IŞIK YAYININ YANINDA ŞOK SAPANI, RAY ARBALETİ, HATTA PLAZMA TOPU BİLE VAR!')], ['ayse', TX('UNUTMA, EYERDEKİ SİLAH RİTİMLE ATEŞ EDER.')]] },
  { id: 'seker', cond: () => META.seker > 0, lines: [['bip', TX('DÜNYA ŞEKERİ! BURADA ÇOK NADİR. DOSTLARINA HEDİYE ET, KARŞILIĞINDA HATIRALARINI VERİRLER.')]] },
  { id: 'lostPirlanta', cond: () => META.flags.lost_pirlanta, lines: [['ayse', TX('PRENS KRİSTALO ÇOK KİBİRLİ. RİTMİ TUTARSAN VE ATEŞ EDERSEN FARKI KAPATIRSIN.')]] },
  { id: 'winPirlanta', cond: () => META.stats.bossWins.pirlanta, lines: [['kemal', TX('KRİSTALO\'YU GEÇEN DÜNYALIYI GÖRMEYE GELDİM. BEN KEMAL. BENİ DE YILLAR ÖNCE KAÇIRDILAR.')], ['grax', TX('ŞANS ESERİ BİR GALİBİYET! SEYİRCİLER BAYILDI. AMA KUPA... ASLA SENİN OLMAYACAK.')], ['bip', TX('BİP. GRAX GİTTİ. DENİZ, ONA GÖSTER.')]] },
  { id: 'region2', cond: () => META.stats.bestRegion >= 1, lines: [['ayse', TX('MANTAR AYI... ULUYAN GORM KİMSEYİ GEÇİRMEZMİŞ. KORSANLARA DA DİKKAT.')]] },
  { id: 'winKurt', cond: () => META.stats.bossWins.kurt, lines: [['tayfun', TX('VAY! GORM\'U GEÇTİN HA? BEN TAYFUN, DÖRT SEZONDUR BURADAYIM. BENİ DE TAKIMA AL!')]] },
  { id: 'regionBuz', cond: () => META.stats.bestRegion >= 2, lines: [['tayfun', TX('BUZ HALKASI! ORADA NİVA DİYE BİR KRALİÇE VARMIŞ, NEFESİYLE PİSTİ DONDURUYORMUŞ.')], ['bip', TX('AYAZ GELİNCE ŞERİT DEĞİŞTİRMEK ZORLAŞIR. HAMLE YAP YA DA ALTIN NOTAYI VUR, BUZU KIR. BİP.')]] },
  { id: 'winNiva', cond: () => META.stats.bossWins.niva, lines: [['ayse', TX('NİVA\'YI GEÇTİN! KRALİÇE BİLE ŞAŞIRDI, TAHTINDAN İNİP SENİ ALKIŞLADI.')], ['grax', TX('BUZ ERİDİ DİYE SEVİNME DÜNYALI. ÇÖLDE SENİ KUM YUTACAK!')]] },
  { id: 'regionKum', cond: () => META.stats.bestRegion >= 3, lines: [['kemal', TX('KIZIL KUM... ZARG DENEN SOLUCAN PİSTİN ALTINDAN ÇIKAR. KUMDA HALKA GÖRÜRSEN O ŞERİTTEN UZAKLAŞ.')]] },
  { id: 'winZarg', cond: () => META.stats.bossWins.zarg, lines: [['tayfun', TX('SOLUCANI KUMA GÖMDÜN! ŞİMDİ SIRA VOLTRAK\'TA!')], ['bip', TX('ARENA\'YA GİDEN YOL AÇIK. ANNENİN İZİ ORADA.')]] },
  { id: 'region3', cond: () => META.stats.bestRegion >= LAST_REGION, lines: [['bip', TX('GALAKSİ ARENASI... KAYITLARA GÖRE ANNEN SON KEZ ORADA KOŞMUŞ.')]] },
  { id: 'lostSimsek', cond: () => META.flags.lost_simsek, lines: [['kemal', TX('VOLTRAK HİLE YAPMADAN KAZANAMAZ. SEN ONDAN HIZLISIN.')]] },
  { id: 'assistHint', cond: () => (META.stats.earlyLoss || 0) >= 3 && !META.settings.assist && !META.settings.wide, lines: [['bip', TX('BİP! İLK PİSTTE ÜST ÜSTE ZORLANDIN. AYARLARDA GENİŞ RİTİM PENCERESİ VE YARDIM MODU VAR. UTANILACAK ŞEY DEĞİL!')], ['ayse', TX('BİR DE RİTMİ ÖLÇ: KULAKLIĞIN SESİ GEÇ VERİYOR OLABİLİR. SAĞ ÜSTTEKİ DİŞLİYE BAS.')]] },
  { id: 'win', cond: () => META.stats.wins > 0, lines: [['bip', TX('KUPA BİZİM! KAPI AÇILDI! BİP BİP BİP!')], ['akyel', TX('...DENİZ. YİRMİ YILDIR SENİ İZLİYORUM. NE KADAR BÜYÜMÜŞSÜN.')], ['ayse', TX('ARTIK KAPIDA PİST ZORLUĞU SEÇEBİLİRSİN. DAHA ZOR, DAHA ÇOK KRİSTAL!')], ['akyel', TX('AMA PİSTTEKİLER DE KAÇIRILMIŞTI DENİZ. HER KUPADA KAPI YİNE AÇILIR: DOSYASINI AÇTIĞIN BİR RAKİBİ EVİNE GÖNDEREBİLİRSİN.')]] }
];
const TIPS = [
  ['bip', TX('HALKA ATIN ETRAFINDA KAPANDIĞI AN DOKUN. RİTİM HIZDIR. BİP.')],
  ['ayse', TX('GÖKTAŞLARININ ÜSTÜNDEN SIÇRAYAMAZSIN, YANINDAN DOLAŞ.')],
  ['bip', TX('KAPILARIN ÜSTÜNDEKİ İŞARETLERE BAK. ÖDÜLÜ SEN SEÇERSİN.')],
  ['ayse', TX('GÖREV EKRANINA UĞRA, BİTEN GÖREVLER KRİSTAL VERİYOR!')],
  ['bip', TX('SPRİNTTE İLK SIRALARA GİREMEZSEN BİR CAN GİDER. KALABALIK PİSTLERDE İLK 4 YETER.')],
  ['ayse', TX('TEKNİK GÖSTERGESİ DOLUNCA ALTTAKİ DÜĞMEYE BAS.')],
  ['kemal', TX('RAKİBİN ARKASINDA KALIRSAN SİPER DOLAR. YANA ÇIKINCA FIRLARSIN.')],
  ['tayfun', TX('GÖKTAŞININ YANINDAN SON ANDA GEÇERSEN KIL PAYI SİKKESİ ALIRSIN!')],
  ['ayse', TX('SİKKELERİN BOŞA GİTMEZ: KOŞU SONUNDA İLK 500 SİKKE 10\'A 1, FAZLASI 20\'YE 1 KRİSTAL OLUR. PAZARDA HARCAMAYI UNUTMA!')],
  ['kemal', TX('NEFESİNİ HER YERDE HARCAMA. SON DÜZLÜKTE SAKLADIĞIN NEFES SENİ UÇURUR.')],
  ['ayse', TX('VİRAJDA İÇ KULVARA YAPIŞ, DIŞTAN DÖNEN HEP GERİDE KALIR.')],
  ['tayfun', TX('ALTIN NOTAYI TAM VURURSAN SİLAH ÇILDIRIR! ÜÇLÜ IŞIN, PLAZMA, NE VARSA!')],
  ['kemal', TX('NİŞANCI ATMADAN ÖNCE NİŞAN ALIR. KIRMIZI ÇİZGİYİ GÖRÜNCE KULVAR DEĞİŞTİR.')],
  ['moko', TX('RAKİPLERİNİN HEPSİ BİR YERLERDEN KAÇIRILMIŞ. KİMSE BURADA OLMAK İSTEMEZ, DÜNYALI.')],
  ['kemal', TX('DÜELLODA RAKİBİN ARKASINA SAKLAN, SİPERİN DOLSUN. SON DÜZLÜKTE YANA ÇIK VE GEÇ.')],
  ['bip', TX('DÜELLO KAZANDIĞIN HER RAKİBİN DOSYASI SEYİR DEFTERİNE EKLENİR. BİP.')]
];
// Sunucu Grax's live commentary during races (picked at random per event)
const GRAX_LINES = {
  start: [TX('İŞTE BAŞLIYORUZ GALAKSİ!'), TX('DÜNYALI PİSTTE, GÖZLER ONDA!'), TX('IŞIKLAR YANDI, KAMERALAR HAZIR!')],
  overtake: [TX('MÜTHİŞ SOLLAMA!'), TX('BİRİNİ DAHA GEÇTİ!'), TX('SEYİRCİLER AYAKTA!')],
  nearmiss: [TX('KIL PAYI! KALBİM DURDU!'), TX('TÜYLERİM DİKEN DİKEN!'), TX('BU NE CESARET!')],
  hurt: [TX('AH! BU ACITTI!'), TX('DÜNYALI SENDELİYOR!'), TX('REYTİNGLER... AŞAĞI!')],
  combo: [TX('RİTİM MAKİNESİ!'), TX('BU DÜNYALI DURMUYOR!'), TX('MÜZİĞİ YUTUYOR!')],
  final: [TX('SON DÜZLÜK! KİM KAZANACAK?'), TX('SON METRELER, NEFESLER TUTULDU!')],
  sponsor: [TX('SPONSORUMUZDAN BİR HEDİYE!'), TX('SEYİRCİ SENİ SEVDİ, AL BAKALIM!')],
  bored: [TX('SEYİRCİ ESNİYOR! BİRAZ HEYECAN!'), TX('SIKICI! METEORLARI SALIN!')],
  fever: [TX('DÖRTNAL MODU! EKRANLAR YANIYOR!'), TX('BU HIZ YASAL MI?')],
  gateOpen: [TX('KAPIYI RİTİMLE AÇTI!'), TX('TAM VURUŞ, KAPI AÇIK!')],
  gateShut: [TX('KAPIYA TOSLADI!'), TX('RİTMİ KAÇIRDI, KAPI KAPALI!')],
  duel: [TX('BÜYÜK DÜELLO BAŞLIYOR!'), TX('BİRE BİR! BAHİSLER MASADA!')],
  nemesis: [TX('RÖVANŞ GECESİ! HESAPLAR GÖRÜLECEK!'), TX('ESKİ DÜŞMANLAR YİNE KARŞI KARŞIYA!')],
  revenge: [TX('RÖVANŞ ALINDI! İNANILMAZ!'), TX('İNTİKAM SOĞUK YENİR, GALAKSİ!')],
  betWin: [TX('BAHSİ KAZANDI! MOKO AĞLIYOR!'), TX('KASA PATLADI!')],
  boss: [TX('ŞAMPİYON SAHNEDE! REKOR YAYIN!'), TX('İŞTE BÜYÜK KAPIŞMA!')],
  rivalTrick: [TX('KİRLİ OYUN! SEYİRCİ BAYILIYOR!'), TX('BU HAMLEYİ GÖRDÜNÜZ MÜ?'), TX('KAÇABİLECEK Mİ?')],
  dodge: [TX('ŞIK KAÇIŞ!'), TX('RAKİBİ BOŞA ÇIKARDI!'), TX('REFLEKSLERE BAK!')],
  kill: [TX('VUR GALAKSİ, VUR!'), TX('BİR KORSAN DAHA GİTTİ!')]
};
const NEMESIS_TAUNTS = [TX('YİNE Mİ SEN?'), TX('BU SEFER DE GEÇEMEZSİN!'), TX('SENİ BEKLİYORDUM DÜNYALI.')];
const INTRO = [
  ['deniz', TX('ALTIN NAL KUPASI YİNE BİZİM, YILDIZ. HADİ EVE GİDELİM...')],
  ['deniz', TX('...BU IŞIK DA NE? YILDIZ, SAKİN OL!')],
  ['grax', TX('İYİ AKŞAMLAR GALAKSİ! BU SEZONUN YENİ YILDIZI: DÜNYALI JOKEY DENİZ VE TUHAF HAYVANI!')],
  ['grax', TX('KURAL BASİT: GALAKSİ KUPASI\'NI KAZANAN EVİNE DÖNER. KAYBEDEN... GELECEK SEZONA KADAR BİZİMLE!')],
  ['bip', TX('BİP! BEN BİP-0, DÜNYA BÖLMESİ\'NİN BAKICISI. KORKMA, ÖNCE BİR ISINMA TURU ATALIM.')]
];
const SPEAKERS = { deniz: TX('DENİZ'), bip: TX('BİP-0'), ayse: TX('AYŞE'), kemal: TX('KEMAL USTA'), tayfun: TX('TAYFUN'), moko: TX('MOKO'), grax: TX('SUNUCU GRAX'), akyel: TX('AKYEL') };
for (const id in RIVAL_BY_ID) SPEAKERS[id] = RIVAL_BY_ID[id].name;
