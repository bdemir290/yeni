// ================= STORY v5.3 · reactions, champions, liberation =================
// Supergiant-style storytelling (Hades, Pyre): every run is a story beat. Friends react to how the last run went,
// beaten champions tell their side, and after the cup each win can send one captured rival home.

// ---------- champions: portraits are built from these looks, lines play after the first win against them ----------
const BOSS_PEOPLE = { pirlanta: 'kristalo', kurt: 'gorm', niva: 'niva', zarg: 'zarg', bora: 'bora', korhan: 'korhan', simsek: 'voltrak' };
const BOSS_PORTRAIT_LOOKS = {
  kristalo: 'kristalo', gorm: 'gorm', niva: 'niva', zarg: 'zarg', bora: 'bora', korhan: 'korhan',
  voltrak: { mount: 'beast', c: C.dgray, l: C.gray, d: C.slate, a: C.red, eye: C.red, rider: 'robo', skin: C.lgray, suit: C.wine, trim: C.yellow, reye: C.red }
};
const BOSS_LORE = {
  pirlanta: [['kristalo', 'BEN... BİR PRENSTİM. LUMO\'NUN KRİSTAL SARAYINDA DOĞDUM. GRAX BENİ TAÇ GİYME TÖRENİMDE KAÇIRDI.'],
    ['kristalo', 'KİBRİM KALKANIMDI DÜNYALI. ONSUZ KORKAKTIM. SEN BANA KORKMADAN KOŞMAYI GÖSTERDİN.'],
    ['ayse', 'GÖRDÜN MÜ DENİZ? ŞAMPİYONLAR BİLE GRAX\'IN TUTSAĞI.']],
  kurt: [['gorm', 'AUUU... YENİLDİM. MANTAR AYI\'NDA SÜRÜM BENİ BEKLİYOR. GRAX ONLARI KAFESTE TUTUYOR.'],
    ['gorm', 'KAZANDIKÇA YAVRULARIMI GÖRMEME İZİN VERİYORDU. ARTIK... SEN KAZAN DENİZ. HEPİMİZ İÇİN.'],
    ['tayfun', 'ULUYAN GORM AĞLIYOR MU? BU ŞOVDA KİMSE KÖTÜ DEĞİL GALİBA. SADECE GRAX.']],
  niva: [['niva', 'BUZUM ERİDİ... YILLARDIR KENDİMİ DONDURUYORDUM DÜNYALI. DONMUŞ BİR KALP EVİNİ ÖZLEMEZ.'],
    ['niva', 'GRAX GEZEGENİMİ ISITACAĞINI SÖZ VERDİ. YALAN. KUPA BİR ANAHTAR, SADECE KAZANANIN KAPISINI AÇAR.'],
    ['bip', 'BİP. KRALİÇE NİVA SANA BİR BUZ ÇİÇEĞİ BIRAKTI. KAYITLARA EKLEDİM.']],
  zarg: [['zarg', '...KRRRRR... KRRR...'],
    ['bip', 'BİP! BAŞINDAKİ ÇİP KIRILMIŞ! ZARG KONUŞAMIYOR AMA SİNYALİ ÇÖZDÜM: "TEŞEKKÜRLER." GRAX ONU ÇİPLE YÖNETİYORMUŞ!'],
    ['kemal', 'DEMEK ŞAMPİYONLARIN BİR KISMI İPLE OYNATILAN KUKLA. VOLTRAK DA ÖYLE Mİ ACABA?']],
  bora: [['bora', 'RÜZGARIN DÖNDÜ, ÇOCUK. YİRMİ YIL ÖNCE DE BÖYLE DÖNMÜŞTÜ...'],
    ['bora', 'O FİNALDE ANNENLE AYNI PİSTTEYDİM. FIRTINAYI BEN GETİRDİM DEDİLER. HAYIR. SON DÜZLÜKTE VOLTRAK\'IN NALLARINDAN KIVILCIM SAÇILDIĞINI GÖRDÜM.'],
    ['bora', 'KİMSE BENİ DİNLEMEDİ. GRAX SÜRÜMÜ ALIP SUSMAMI İSTEDİ. ARTIK SUSMAYACAĞIM. KOR AY\'A GİT, DEMİRCİYİ BUL.'],
    ['kemal', 'KIVILCIM... AKYEL\'İN ATI O GECE TÖKEZLEMİŞTİ. HEPİMİZ KAZA SANDIK.']],
  korhan: [['korhan', 'ÖRSÜM SUSTU. YÜZ YILDIR İLK KEZ BİRİ BENİ YENDİ, DÜNYALI.'],
    ['korhan', 'GRAX OCAĞIMI ZİNCİRLEDİ. BANA KIVILCIM SAÇAN NALLAR DÖVDÜRDÜ. İLKİNİ YİRMİ YIL ÖNCE, BİR FİNAL GECESİ İÇİN.'],
    ['korhan', 'AL. BU O NALIN KALIBI. ÜSTÜNDE GRAX\'IN MÜHRÜ VAR. ARENA\'DA HERKES GÖRSÜN.'],
    ['bip', 'BİP. KANIT KAYDEDİLDİ. DENİZ... ANNEN KAYBETMEDİ. ONU DÜŞÜRDÜLER.']],
  simsek: [['voltrak', 'HATA. HATA. PROGRAM: KAZAN. DURUM: KAYBETTİ. YENİ GÖREV ARANIYOR...'],
    ['voltrak', 'KAYIT 2006-FİNAL: AKYEL ÖNDE. GRAX KOMUTU: PİSTE KIVILCIM AT. KOMUT UYGULANDI. ÖZÜR... DİLERİM?'],
    ['grax', 'YETER! KUPA... KUPA SENİN DÜNYALI. AMA KAPI SANDIĞIN KADAR KOLAY AÇILMAZ!']]
};

// ---------- the logbook grows: two new planets and the time after the cup ----------
MEMORIES.push(
  { id: 8, title: 'DONMUŞ TAHT', hint: 'BUZ HALKASI\'NA ULAŞ', cond: () => META.stats.bestRegion >= 2,
    text: 'BUZ HALKASI\'NDA KRALİÇE NİVA HÜKÜM SÜRÜYOR. GEZEGENİ GÜNEŞİNİ KAYBETTİĞİNDE GRAX ONA SICAKLIK SÖZÜ VERDİ. NİVA O GÜNDEN BERİ KENDİNİ DONDURUYOR: DONMUŞ BİR KALP EVİNİ ÖZLEMEZ, DİYOR.' },
  { id: 9, title: 'KUMUN ALTINDAKİ ÇİP', hint: 'KUM SOLUCANI ZARG\'I YEN', cond: () => !!META.stats.bossWins.zarg,
    text: 'ZARG\'IN BAŞINDA GRAX\'IN ÇİPİ VARDI. ŞAMPİYONLARIN BAZILARI GÖNÜLLÜ DEĞİL, KUKLA. BİP SİNYALİ ÇÖZDÜ: AYNI ÇİPTEN BİRİ DE VOLTRAK\'IN İÇİNDE ATIYOR.' },
  { id: 10, title: 'AÇIK KAPI', hint: 'BİR RAKİBİ EVE GÖNDER', cond: () => freedCount() >= 1,
    text: 'KAPI AÇILDI AMA DENİZ GEÇMEDİ. TRİBÜNDEKİ HER YÜZ, PİSTTEKİ HER RAKİP BİR YERDEN KAÇIRILMIŞTI. KUPA HER KAZANILDIĞINDA KAPI BİR KEZ DAHA AÇILIYOR. ARTIK YARIŞMAK İÇİN DEĞİL, BAŞKALARINI EVE GÖNDERMEK İÇİN KOŞUYORUZ.' },
  { id: 11, title: 'HERKES EVİNE', hint: 'BÜTÜN RAKİPLERİ EVE GÖNDER', cond: () => freedCount() >= NAMED_RIVALS.flat().length,
    text: 'SON RAKİP DE KAPIDAN GEÇTİ. GRAX\'IN ŞOVU BOMBOŞ BİR STADYUMDA YAYINLANIYOR. AKYEL YILDIZ\'IN YELESİNİ OKŞADI: "ŞİMDİ EVE GİDEBİLİRİZ." DENİZ GÜLÜMSEDİ: "BİR TUR DAHA, ANNE. SADECE ZEVK İÇİN."' }
);
// v6: two more planets before the arena, and the evidence of the 2006 final
MEMORIES.push(
  { id: 12, title: 'FIRTINA ÇOBANI', hint: 'FIRTINA DEVİ\'NE ULAŞ', cond: () => META.stats.bestRegion >= regionIdx('bulut'),
    text: 'FIRTINA DEVİ\'NİN BULUTLARINDA DEV GÖK BALİNALARI YÜZER. ÇOBANLARI BORA, YİRMİ YIL ÖNCEKİ FİNALDE ANNENLE AYNI PİSTTEYDİ. O GECE BİR FIRTINA KOPTU VE AKYEL\'İN ATI TÖKEZLEDİ. HERKES BORA\'YI SUÇLADI. BORA İSE YILLARDIR SUSUYOR.' },
  { id: 13, title: 'GRAX\'IN MÜHRÜ', hint: 'DEMİRCİ KORHAN\'I YEN', cond: () => !!META.stats.bossWins.korhan,
    text: 'KORHAN, KOR AY\'IN SON DEMİRCİSİ. GRAX OCAĞINI ZİNCİRLEDİ VE ONA KIVILCIM SAÇAN NALLAR DÖVDÜRDÜ. YENİLİNCE SANA İLK NALIN KALIBINI VERDİ; ÜSTÜNDE GRAX\'IN MÜHRÜ VAR. ANNEN KAYBETMEDİ. ONU DÜŞÜRDÜLER.' }
);
// story order for the logbook (ids stay for the save; the number shown is the place in this order)
const MEMORY_ORDER = [1, 2, 3, 4, 5, 8, 9, 12, 13, 6, 7, 10, 11];
MEMORIES.sort((a, b) => MEMORY_ORDER.indexOf(a.id) - MEMORY_ORDER.indexOf(b.id));

// ---------- Akyel joins the station after the cup ----------
NPC_NAMES.akyel = 'AKYEL';
NPC_LINES.akyel = {
  gift: ['DÜNYA ŞEKERİ... SEN KÜÇÜKKEN CEBİNDE HEP BUNDAN TAŞIRDIN. AL, ESKİ NALIM SENDE DURSUN.', 'NALI PARLATTIM. VOLTRAK ONU YİRMİ YIL ÖNCE KIRMIŞTI, KEMAL USTA ONARDI.', 'SENİNLE GURUR DUYUYORUM DENİZ. HER TURDA.'],
  chat: ['YİRMİ YIL TRİBÜNDEN İZLEDİM. GRAX HER GECE YANIMA OTURUP "OĞLUN GELMEYECEK" DERDİ. GELDİN.', 'YILDIZ\'IN ANNESİNİ BEN YETİŞTİRDİM. AYNI İNATÇI KULAKLAR.', 'VOLTRAK KÖTÜ DEĞİL. ONU KÖTÜ YAPAN KOMUTLARDI.', 'ŞAMPİYONLARIN SIRRI BASİT: SON DÜZLÜKTE NEFESİNİ SAKLA.']
};
KEEPSAKES.akyel = { name: 'AKYEL\'İN NALI', desc: l => 'ŞAMPİYON YARIŞINDA FARK %' + [10, 20, 30][l - 1] + ' DAHA YAVAŞ KAPANIR', apply: (S, l) => { S.bossDrainMult *= 1 - [0.1, 0.2, 0.3][l - 1]; } };
for (const k in BOSS_PEOPLE) SPEAKERS[BOSS_PEOPLE[k]] = BOSSES[k].name;

// ---------- liberation: after each cup win one rival with an open file may go home ----------
function freedCount() { return Object.keys(META.freed || {}).filter(id => RIVAL_BY_ID[id]).length; }
function isFreed(id) { return !!(META.freed && META.freed[id]); }
function activeRivals(reg) { return (NAMED_RIVALS[reg] || []).filter(r => !isFreed(r.id)); }
function freeCandidates() { return NAMED_RIVALS.flat().filter(r => META.rivals[r.id] && !isFreed(r.id)); }
const RIVAL_BYE = {
  zefir: 'BULUTLARIM BENİ BEKLİYOR. HER RÜZGAR ESTİĞİNDE ADINI FISILDAYACAĞIM, DENİZ.',
  gumbur: 'GÜM! GÜM! BU SEFER SEVİNÇTEN GÜRLÜYORUM DÜNYALI!',
  damla: 'YAĞMUR OLUP YAĞACAĞIM. BİR GÜN DÜNYADA ISLANIRSAN, O BENİM.',
  kivilcim: 'SÖNMEDEN EVE VARACAĞIM! SEN DE SÖNME, DÜNYALI!',
  curuf: 'KORHAN USTAYA SÖYLE: OCAK YENİDEN YANACAK. BEN YAKACAĞIM.',
  oniks: 'NİŞANIMI HİÇ ŞAŞIRMAMIŞTIM. SENİN KALBİNE DE ŞAŞIRMADIM.',
  glorb: 'DENKLEMİ ÇÖZDÜN DÜNYALI: EVE GİDEN YOLUN DEĞİŞKENİ DOSTLUKMUŞ. ZİLA\'DA ADINA BİR KİTAP YAZACAĞIM.',
  vuum: 'YEDİ YAVRUMA DOKUZ KOLUMLA SARILACAĞIM! BİR KOLUM DA SENİN İÇİN, DENİZ.',
  pip: 'PİP PİP! BELKİ EVDE UÇMAYI DA ÖĞRENİRİM. ÖĞRENMESEM DE OLUR, KOŞMAYI SEN ÖĞRETTİN.',
  gece: 'KIZ KARDEŞİMİ TRİBÜNDE BULDUM, O DA GELİYOR! NOKS\'UN KARANLIĞINDA SENİN IŞIĞIN YANACAK.',
  kiskac: 'YENİ PROGRAM YÜKLENDİ: ARKADAŞLIK. HEDEF: ASTEROİT KUŞAĞI. NOT: BİP\'E SELAM.',
  mantis: 'HUMA\'DA YAĞMUR YİNE YAĞIYOR OLMALI. BU SEFER SEVİNEREK ISLANACAĞIM.',
  buzdis: 'KARDEŞLERİM BU KIŞ SENİN HEYKELİNİ YAPACAK. ATIN DA OLACAK, SÖZ.',
  aurora: 'KANATLARIM YİNE RENKLENDİ. LUMEN\'İN GÖĞÜNE BAKARSAN YEŞİL BİR IŞIK GÖRÜRSÜN: O BENİM.',
  kar: 'SICAK BİR YERDE UYANACAĞIM SONUNDA. ERİRSEM DE MUTLU ERİRİM!',
  tozkiran: 'KERVANLAR YİNE YOLA ÇIKACAK. ŞARKININ YENİ KITASI SENİNLE İLGİLİ DÜNYALI.',
  zib: 'BORCUM KAPANDI! MOKO\'YA SÖYLE: KUZENİ SONUNDA EVDE, DÜKKANINI AÇIYOR.',
  serap: 'DEMEK GERÇEK BİR KAPI VARMIŞ. BEN DE GERÇEKMİŞİM. HOŞÇA KAL, DENİZ.',
  alev: 'PİRA\'YA DÖNÜYORUM AMA ŞAMPİYON OLARAK DEĞİL. ARTIK KİMSENİN ÖNÜNDE KOŞMAK ZORUNDA DEĞİLİM.',
  golge: 'ADIMI HATIRLADIM: RÜZGAR. YİRMİ YIL ÖNCE AKYEL\'E BORÇLANDIM. BORCUMU OĞLUNA ÖDEDİM.',
  nova: 'YILDIZIMA DÖNÜYORUM. SÖNMÜŞ OLABİLİR AMA BEN HÂLÂ PARLIYORUM. SEN DE PARLA.'
};

// ---------- after-run reactions (storylets): someone at the station always has a word about the last run ----------
// cond(i) reads META.lastRun; prio decides; once = only the first time; lines may be a function of the run info
const RUN_REACTIONS = [
  { id: 'cupAgain', prio: 90, cond: i => i.won && META.stats.wins > 1 && META.freeTokens > 0, lines: () => [['akyel', 'BİR KUPA DAHA! KAPI YİNE AÇIK. SEYİR DEFTERİNDEN BİR RAKİP SEÇ, EVİNE GÖNDERELİM.']] },
  { id: 'cupFreed', prio: 89, cond: i => i.won && META.stats.wins > 1 && !(META.freeTokens > 0), lines: () => [['bip', 'KAPIDAN BİRİ DAHA GEÇTİ. İSTASYON SESSİZLEŞİYOR AMA GÜZEL BİR SESSİZLİK. BİP.']] },
  { id: 'bossLoss_pirlanta', prio: 70, cond: i => i.boss === 'pirlanta', lines: () => [['ayse', 'KRİSTALO KİBİRLENİNCE DURUR. O AN HAMLE YAP YA DA ALTIN NOTAYI VUR, KİBRİNİ KIR!']] },
  { id: 'bossLoss_kurt', prio: 70, cond: i => i.boss === 'kurt', lines: () => [['ayse', 'GORM ULUYUNCA SİS ÇÖKER VE KURTLAR YANDAN GELİR. KULAĞIN RİTİMDE OLSUN, GÖZÜN KENARLARDA.']] },
  { id: 'bossLoss_niva', prio: 70, cond: i => i.boss === 'niva', lines: () => [['bip', 'BİP. NİVA\'NIN AYAZINDA ŞERİT DEĞİŞTİRMEK YAVAŞLAR. BUZU HAMLEYLE YA DA ALTIN NOTAYLA KIR.'], ['tayfun', 'SARKITLARIN DÜŞTÜĞÜ ŞERİT KIRMIZI YANAR. ORADAN UZAK DUR, YETER!']] },
  { id: 'bossLoss_zarg', prio: 70, cond: i => i.boss === 'zarg', lines: () => [['kemal', 'KUMDA TURUNCU HALKA GÖRDÜĞÜN AN O ŞERİTTEN ÇIK. SOLUCAN ORADAN FIRLAR.']] },
  { id: 'bossLoss_simsek', prio: 70, cond: i => i.boss === 'simsek', lines: () => [[META.stats.wins ? 'akyel' : 'kemal', 'VOLTRAK YİNE HİLE YAPTI, DEĞİL Mİ? KIVILCIMLARIN DÜŞECEĞİ ŞERİT ÖNCE KIZARIR. BEKLEME, KAÇ.']] },
  { id: 'duelLoss', prio: 60, cond: i => !!i.duelLost, lines: i => [['kemal', i.duelLost + ' SENİ DÜELLODA GEÇTİ. ARKASINA SAKLAN, SİPERİN DOLSUN, SON DÜZLÜKTE YANA ÇIK.']] },
  { id: 'nemesisNew', prio: 58, once: true, cond: i => !!i.nemesis, lines: i => [['tayfun', i.nemesis + ' ARTIK RÖVANŞÇIN! KIRMIZI TAÇLA GELECEK. ONU GEÇERSEN KESEN DOLAR!']] },
  { id: 'revenge', prio: 55, cond: i => i.revenge, lines: () => [['tayfun', 'RÖVANŞI ALDIN HA! GRAX\'IN SURATINI GÖRMELİYDİN, MİKROFONU DÜŞÜRDÜ!']] },
  { id: 'leagueTop', prio: 50, cond: i => i.league === 1 && !i.won, lines: () => [['moko', 'LİG LİDERİ DÜNYALI! BAHİS MASAMDA ORANLARIN DÜŞTÜ, BUNU İYİ ANLAMDA SÖYLÜYORUM.']] },
  { id: 'sGrades', prio: 45, cond: i => i.sGrades >= 3, lines: i => [['ayse', i.sGrades + ' ETAPTA S NOTU! TOYNAKLARIN MÜZİĞİN İÇİNDEYDİ BUGÜN.']] },
  { id: 'chaseLoss', prio: 40, cond: i => i.type === 'kovala', lines: () => [['bip', 'KARA DELİK SENİ YAKALADI. KOMBO HIZDIR: RİTMİ BOZMA, HAMLEYİ SON ANA SAKLA.']] },
  { id: 'raidLoss', prio: 40, cond: i => i.type === 'baskin', lines: () => [['tayfun', 'KORSANLAR FAZLA MI GELDİ? RİTİMLE VUR, SİLAH KENDİ NİŞAN ALIR. KAPTANI ÖZEL ATIŞLA DÜŞÜR!']] },
  { id: 'sprintLoss', prio: 35, cond: i => i.type === 'sprint', lines: () => [['ayse', 'SPRİNTTE GERİDE KALINCA NEFESİN DAHA HIZLI DOLAR. O NEFESİ HAMLEYE ÇEVİR!']] },
  { id: 'parkurLoss', prio: 35, cond: i => i.type === 'parkur', lines: () => [['kemal', 'PARKURDA ACELE ETME. ENGEL SENE YAKLAŞINCA SIÇRA, ERKEN DEĞİL. TEMİZ ATLAYIŞ HIZ VERİR.']] },
  { id: 'quit', prio: 30, cond: i => i.quit, lines: () => [['bip', 'KOŞUYU BIRAKMAK DA BİR SEÇİM. YILDIZ DİNLENDİ, SEN DE DİNLEN. BİP.']] },
  { id: 'early', prio: 20, cond: i => !i.won && i.region === 0 && i.etap <= 1, lines: () => [['ayse', 'HERKES BURADAN BAŞLADI DENİZ. NOTA ORTADA BULUŞUNCA DOKUN, GERİSİ GELİR.']] },
  { id: 'farther', prio: 15, cond: i => !i.won && i.region >= 2, lines: i => [['moko', 'BU SEFER ' + REGIONS[Math.min(LAST_REGION, i.region)].name + ' GEZEGENİNE KADAR GİTTİN! TEZGAHIMDA SENİN ADINA BİR SÜS ASTIM.']] }
];
function pickReaction() {
  const i = META.lastRun; if (!i || i.told) return null;
  i.told = true;
  META.seenReact = META.seenReact || {};
  const ok = r => r.cond(i) && (!r.once || !META.seenReact[r.id]);
  const lines = r => (typeof r.lines === 'function' ? r.lines(i) : r.lines).filter(l => l[0] !== 'kemal' && l[0] !== 'tayfun' && l[0] !== 'moko' && l[0] !== 'akyel' || npcAvailable(l[0]));
  const pool = RUN_REACTIONS.filter(ok).sort((a, b) => b.prio - a.prio);
  for (const r of pool) {
    // a line heard last time waits a turn, unless it is the only fitting one
    if (META.lastReact === r.id && pool.length > 1) continue;
    const ls = lines(r); if (!ls.length) continue;
    META.seenReact[r.id] = (META.seenReact[r.id] || 0) + 1; META.lastReact = r.id;
    return ls;
  }
  return null;
}

// ---------- v6: the riders of Fırtına Devi and Kor Ay ----------
Object.assign(RIVAL_INFO, {
  zefir: { race: 'RÜZGAR PERİSİ', home: 'FIRTINA DEVİ', trick: 'ÖNDE KAÇAR, MAYIN BIRAKIR',
    taunt: 'RÜZGARI YAKALAYAMAZSIN!',
    lose: ['RÜZGARI YAKALADIN. BUNU KİMSEYE SÖYLEME, UTANIRIM.', 'BORA USTA ESKİDEN BİZE MASAL ANLATIRDI. SONRA BİR GECE SUSTU.'],
    text: 'ZEFİR, BULUTLARIN ARASINDA DOĞAN BİR RÜZGAR PERİSİ. BORA\'NIN SÜRÜSÜNE ÇOBANLIK EDERDİ. GRAX BALİNALARI ALINCA ONU DA ALDI. HEP ÖNDE KOŞAR, ÇÜNKÜ DURURSA DAĞILACAĞINDAN KORKAR.' },
  gumbur: { race: 'GÖK GÜRÜLTÜSÜ KOÇU', home: 'FIRTINA DEVİ', trick: 'YANAŞIR, "!" SONRA OMUZ ATAR',
    taunt: 'GÜM! YOLDAN ÇEKİL!',
    lose: ['GÜM... BU SEFER SESİM ÇIKMADI.', 'BULUTLARDA KARDEŞLERİM VAR. HER BİRİ BİR FIRTINA. ONLARA SENİ ANLATACAĞIM.'],
    text: 'GÜMBÜR, FIRTINA DEVİ\'NİN GÖK GÜRÜLTÜSÜ KOÇLARINDAN. BOYNUZLARINI ÇARPTIRINCA ŞİMŞEK ÇAKAR. GRAX ONU "SEYİRCİ GÜRÜLTÜ SEVER" DİYE SEÇTİ. ASLINDA ÇOK UTANGAÇ; SADECE YARIŞTA BAĞIRIYOR.' },
  damla: { race: 'YAĞMUR RUHU', home: 'FIRTINA DEVİ', trick: 'SONDAN GELİR, SONDA ATAKLAR',
    taunt: 'BEN SABIRLIYIM. SONUNDA HERKES ISLANIR.',
    lose: ['SABRIM TÜKENDİ, DÜNYALI. İLK KEZ.', 'BULUTA DÖNMEK İSTİYORUM. ORADA KİMSE BENİ YARIŞTIRMAZ.'],
    text: 'DAMLA, BİR BULUTUN İÇİNDE YÜZ YIL BEKLEYİP SONUNDA DÜŞEN BİR YAĞMUR RUHU. GRAX ONU YERE DEĞMEDEN YAKALADI. YARIŞIN SONUNA KADAR BEKLER, SONRA SAĞANAK GİBİ İNER.' },
  kivilcim: { race: 'KIVILCIM CİNİ', home: 'KOR AY', trick: STYLE_TRICK.zikzak,
    taunt: 'TUTUŞTURURUM SENİ!',
    lose: ['SÖNDÜM... AMA SADECE BİRAZ.', 'KORHAN USTANIN OCAĞINDA DOĞDUM. GRAX ONU ZİNCİRLEDİĞİNDEN BERİ HER YER SOĞUK.'],
    text: 'KIVILCIM, KORHAN\'IN ÖRSÜNDEN SIÇRAYIP CANLANAN BİR KIVILCIM CİNİ. YERİNDE DURAMAZ, ŞERİTTEN ŞERİDE SEKER. GRAX\'IN KIVILCIMLI NALLARINDAN NEFRET EDER: "ONLAR BENİM KARDEŞLERİM DEĞİL, ZİNCİRLİ ESİRLER."' },
  curuf: { race: 'CÜRUF GOLEMİ', home: 'KOR AY', trick: 'YANAŞIR, "!" SONRA OMUZ ATAR',
    taunt: 'EZİLMEK İSTEMİYORSAN KENARA!',
    lose: ['AĞIR OLDUĞUM İÇİN YAVAŞ DEĞİLİM. AMA SEN HIZLISIN.', 'USTAM KORHAN BENİ ARTAKALAN DEMİRDEN YAPTI. ATILAN ŞEYLERDEN DE GÜZEL ŞEYLER ÇIKAR, DERDİ.'],
    text: 'CÜRUF, KORHAN\'IN OCAĞINDA ARTAKALAN DEMİRDEN DÖVÜLMÜŞ BİR GOLEM. USTASINI ÇOK SEVER. GRAX ONU ÖRSÜN BAŞINDAN KOPARDI; KORHAN İTAAT ETSİN DİYE REHİN TUTUYOR.' },
  oniks: { race: 'OBSİDYEN NİŞANCI', home: 'KOR AY', trick: STYLE_TRICK.atici,
    taunt: 'TEK ATIŞ. TEK ŞANS.',
    lose: ['NİŞANIM ŞAŞTI. YA DA SEN ÇOK HIZLIYDIN.', 'KARA CAMDAN DOĞDUM. İÇİMDE YANSIMALAR VAR: SENİNKİ EVİNE BAKIYOR.'],
    text: 'ONİKS, KOR AY\'IN KARA CAM VADİLERİNDE AVLANAN SESSİZ BİR NİŞANCI. ATEŞİN İÇİNDE BİLE ÜŞÜR. GRAX ONA PLAZMA VERDİ; O İSE HER ATIŞTAN ÖNCE KORHAN İÇİN DUA EDİYOR.' }
});
STORY.push(
  { id: 'v6news', cond: () => !!META.flags.v6news, lines: [['bip', 'BİP! KAYITLARIMI ONARDIM: SEYİR DEFTERİNDE YOLCULUĞUN BAŞINI ÇİZİMLERLE İZLEYEBİLİRSİN.'], ['kemal', 'BİR DE HARİTAYA BAK DENİZ. KIZIL KUM\'DAN SONRA İKİ GEZEGEN DAHA VAR: FIRTINA DEVİ VE KOR AY.']] },
  { id: 'regionBulut', cond: () => META.stats.bestRegion >= regionIdx('bulut'), lines: [['kemal', 'FIRTINA DEVİ... BORA\'YI TANIRIM. ANNENLE AYNI FİNALDE KOŞTU. ONA SORACAKLARIN VAR, DENİZ.'], ['bip', 'BULUT PİSTİNDE YILDIRIMLAR ŞERİTLERE DÜŞER. KIRMIZI ŞERİDİ GÖRÜNCE KAÇ. BİP.']] },
  { id: 'winBora', cond: () => !!META.stats.bossWins.bora, lines: [['ayse', 'BORA NE DEDİ? KIVILCIM MI? DEMEK O GECE FIRTINA DEĞİLDİ...'], ['grax', 'ESKİ HİKAYELER, DÜNYALI! SEYİRCİ YENİ SKANDAL İSTER. KOR AY\'DA SENİ YAKACAĞIZ!']] },
  { id: 'regionKor', cond: () => META.stats.bestRegion >= regionIdx('kor'), lines: [['tayfun', 'KOR AY! LAV DALGASI GELİNCE SIÇRA, YOKSA TOYNAKLAR YANAR!'], ['moko', 'DEMİRCİ KORHAN... GRAX ONU ZİNCİRLEDİ DİYORLAR. ZİNCİRLİ BİRİ EN TEHLİKELİSİDİR, DÜNYALI.']] },
  { id: 'winKorhan', cond: () => !!META.stats.bossWins.korhan, lines: [['kemal', 'BU KALIP... VOLTRAK\'IN NALLARI! GRAX\'IN MÜHRÜ ÜSTÜNDE!'], ['bip', 'BİP. KANIT KAYDEDİLDİ. ARENA\'DA HERKES GÖRECEK.'], ['ayse', 'ŞİMDİ GİT VE KAZAN DENİZ. ANNEN İÇİN.']] }
);
