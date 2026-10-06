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
  pirlanta: [['kristalo', TX('BEN... BİR PRENSTİM. LUMO\'NUN KRİSTAL SARAYINDA DOĞDUM. GRAX BENİ TAÇ GİYME TÖRENİMDE KAÇIRDI.')],
    ['kristalo', TX('KİBRİM KALKANIMDI DÜNYALI. ONSUZ KORKAKTIM. SEN BANA KORKMADAN KOŞMAYI GÖSTERDİN.')],
    ['ayse', TX('GÖRDÜN MÜ DENİZ? ŞAMPİYONLAR BİLE GRAX\'IN TUTSAĞI.')]],
  kurt: [['gorm', TX('AUUU... YENİLDİM. MANTAR AYI\'NDA SÜRÜM BENİ BEKLİYOR. GRAX ONLARI KAFESTE TUTUYOR.')],
    ['gorm', TX('KAZANDIKÇA YAVRULARIMI GÖRMEME İZİN VERİYORDU. ARTIK... SEN KAZAN DENİZ. HEPİMİZ İÇİN.')],
    ['tayfun', TX('ULUYAN GORM AĞLIYOR MU? BU ŞOVDA KİMSE KÖTÜ DEĞİL GALİBA. SADECE GRAX.')]],
  niva: [['niva', TX('BUZUM ERİDİ... YILLARDIR KENDİMİ DONDURUYORDUM DÜNYALI. DONMUŞ BİR KALP EVİNİ ÖZLEMEZ.')],
    ['niva', TX('GRAX GEZEGENİMİ ISITACAĞINI SÖZ VERDİ. YALAN. KUPA BİR ANAHTAR, SADECE KAZANANIN KAPISINI AÇAR.')],
    ['bip', TX('BİP. KRALİÇE NİVA SANA BİR BUZ ÇİÇEĞİ BIRAKTI. KAYITLARA EKLEDİM.')]],
  zarg: [['zarg', '...KRRRRR... KRRR...'],
    ['bip', TX('BİP! BAŞINDAKİ ÇİP KIRILMIŞ! ZARG KONUŞAMIYOR AMA SİNYALİ ÇÖZDÜM: "TEŞEKKÜRLER." GRAX ONU ÇİPLE YÖNETİYORMUŞ!')],
    ['kemal', TX('DEMEK ŞAMPİYONLARIN BİR KISMI İPLE OYNATILAN KUKLA. VOLTRAK DA ÖYLE Mİ ACABA?')]],
  bora: [['bora', TX('RÜZGARIN DÖNDÜ, ÇOCUK. YİRMİ YIL ÖNCE DE BÖYLE DÖNMÜŞTÜ...')],
    ['bora', TX('O FİNALDE ANNENLE AYNI PİSTTEYDİM. FIRTINAYI BEN GETİRDİM DEDİLER. HAYIR. SON DÜZLÜKTE VOLTRAK\'IN NALLARINDAN KIVILCIM SAÇILDIĞINI GÖRDÜM.')],
    ['bora', TX('KİMSE BENİ DİNLEMEDİ. GRAX SÜRÜMÜ ALIP SUSMAMI İSTEDİ. ARTIK SUSMAYACAĞIM. KOR AY\'A GİT, DEMİRCİYİ BUL.')],
    ['kemal', TX('KIVILCIM... AKYEL\'İN ATI O GECE TÖKEZLEMİŞTİ. HEPİMİZ KAZA SANDIK.')]],
  korhan: [['korhan', TX('ÖRSÜM SUSTU. YÜZ YILDIR İLK KEZ BİRİ BENİ YENDİ, DÜNYALI.')],
    ['korhan', TX('GRAX OCAĞIMI ZİNCİRLEDİ. BANA KIVILCIM SAÇAN NALLAR DÖVDÜRDÜ. İLKİNİ YİRMİ YIL ÖNCE, BİR FİNAL GECESİ İÇİN.')],
    ['korhan', TX('AL. BU O NALIN KALIBI. ÜSTÜNDE GRAX\'IN MÜHRÜ VAR. ARENA\'DA HERKES GÖRSÜN.')],
    ['bip', TX('BİP. KANIT KAYDEDİLDİ. DENİZ... ANNEN KAYBETMEDİ. ONU DÜŞÜRDÜLER.')]],
  simsek: [['voltrak', TX('HATA. HATA. PROGRAM: KAZAN. DURUM: KAYBETTİ. YENİ GÖREV ARANIYOR...')],
    ['voltrak', TX('KAYIT 2006-FİNAL: AKYEL ÖNDE. GRAX KOMUTU: PİSTE KIVILCIM AT. KOMUT UYGULANDI. ÖZÜR... DİLERİM?')],
    ['grax', TX('YETER! KUPA... KUPA SENİN DÜNYALI. AMA KAPI SANDIĞIN KADAR KOLAY AÇILMAZ!')]]
};

// ---------- the logbook grows: two new planets and the time after the cup ----------
MEMORIES.push(
  { id: 8, title: TX('DONMUŞ TAHT'), hint: TX('BUZ HALKASI\'NA ULAŞ'), cond: () => META.stats.bestRegion >= 2,
    text: TX('BUZ HALKASI\'NDA KRALİÇE NİVA HÜKÜM SÜRÜYOR. GEZEGENİ GÜNEŞİNİ KAYBETTİĞİNDE GRAX ONA SICAKLIK SÖZÜ VERDİ. NİVA O GÜNDEN BERİ KENDİNİ DONDURUYOR: DONMUŞ BİR KALP EVİNİ ÖZLEMEZ, DİYOR.') },
  { id: 9, title: TX('KUMUN ALTINDAKİ ÇİP'), hint: TX('KUM SOLUCANI ZARG\'I YEN'), cond: () => !!META.stats.bossWins.zarg,
    text: TX('ZARG\'IN BAŞINDA GRAX\'IN ÇİPİ VARDI. ŞAMPİYONLARIN BAZILARI GÖNÜLLÜ DEĞİL, KUKLA. BİP SİNYALİ ÇÖZDÜ: AYNI ÇİPTEN BİRİ DE VOLTRAK\'IN İÇİNDE ATIYOR.') },
  { id: 10, title: TX('AÇIK KAPI'), hint: TX('BİR RAKİBİ EVE GÖNDER'), cond: () => freedCount() >= 1,
    text: TX('KAPI AÇILDI AMA DENİZ GEÇMEDİ. TRİBÜNDEKİ HER YÜZ, PİSTTEKİ HER RAKİP BİR YERDEN KAÇIRILMIŞTI. KUPA HER KAZANILDIĞINDA KAPI BİR KEZ DAHA AÇILIYOR. ARTIK YARIŞMAK İÇİN DEĞİL, BAŞKALARINI EVE GÖNDERMEK İÇİN KOŞUYORUZ.') },
  { id: 11, title: TX('HERKES EVİNE'), hint: TX('BÜTÜN RAKİPLERİ EVE GÖNDER'), cond: () => freedCount() >= NAMED_RIVALS.flat().length,
    text: TX('SON RAKİP DE KAPIDAN GEÇTİ. GRAX\'IN ŞOVU BOMBOŞ BİR STADYUMDA YAYINLANIYOR. AKYEL YILDIZ\'IN YELESİNİ OKŞADI: "ŞİMDİ EVE GİDEBİLİRİZ." DENİZ GÜLÜMSEDİ: "BİR TUR DAHA, ANNE. SADECE ZEVK İÇİN."') }
);
// v6: two more planets before the arena, and the evidence of the 2006 final
MEMORIES.push(
  { id: 12, title: TX('FIRTINA ÇOBANI'), hint: TX('FIRTINA DEVİ\'NE ULAŞ'), cond: () => META.stats.bestRegion >= regionIdx('bulut'),
    text: TX('FIRTINA DEVİ\'NİN BULUTLARINDA DEV GÖK BALİNALARI YÜZER. ÇOBANLARI BORA, YİRMİ YIL ÖNCEKİ FİNALDE ANNENLE AYNI PİSTTEYDİ. O GECE BİR FIRTINA KOPTU VE AKYEL\'İN ATI TÖKEZLEDİ. HERKES BORA\'YI SUÇLADI. BORA İSE YILLARDIR SUSUYOR.') },
  { id: 13, title: TX('GRAX\'IN MÜHRÜ'), hint: TX('DEMİRCİ KORHAN\'I YEN'), cond: () => !!META.stats.bossWins.korhan,
    text: TX('KORHAN, KOR AY\'IN SON DEMİRCİSİ. GRAX OCAĞINI ZİNCİRLEDİ VE ONA KIVILCIM SAÇAN NALLAR DÖVDÜRDÜ. YENİLİNCE SANA İLK NALIN KALIBINI VERDİ; ÜSTÜNDE GRAX\'IN MÜHRÜ VAR. ANNEN KAYBETMEDİ. ONU DÜŞÜRDÜLER.') }
);
// story order for the logbook (ids stay for the save; the number shown is the place in this order)
const MEMORY_ORDER = [1, 2, 3, 4, 5, 8, 9, 12, 13, 6, 7, 10, 11];
MEMORIES.sort((a, b) => MEMORY_ORDER.indexOf(a.id) - MEMORY_ORDER.indexOf(b.id));

// ---------- Akyel joins the station after the cup ----------
NPC_NAMES.akyel = TX('AKYEL');
NPC_LINES.akyel = {
  gift: [TX('DÜNYA ŞEKERİ... SEN KÜÇÜKKEN CEBİNDE HEP BUNDAN TAŞIRDIN. AL, ESKİ NALIM SENDE DURSUN.'), TX('NALI PARLATTIM. VOLTRAK ONU YİRMİ YIL ÖNCE KIRMIŞTI, KEMAL USTA ONARDI.'), TX('SENİNLE GURUR DUYUYORUM DENİZ. HER TURDA.')],
  chat: [TX('YİRMİ YIL TRİBÜNDEN İZLEDİM. GRAX HER GECE YANIMA OTURUP "OĞLUN GELMEYECEK" DERDİ. GELDİN.'), TX('YILDIZ\'IN ANNESİNİ BEN YETİŞTİRDİM. AYNI İNATÇI KULAKLAR.'), TX('VOLTRAK KÖTÜ DEĞİL. ONU KÖTÜ YAPAN KOMUTLARDI.'), TX('ŞAMPİYONLARIN SIRRI BASİT: SON DÜZLÜKTE NEFESİNİ SAKLA.')]
};
KEEPSAKES.akyel = { name: TX('AKYEL\'İN NALI'), desc: l => TX('ŞAMPİYON YARIŞINDA FARK %') + [10, 20, 30][l - 1] + TX(' DAHA YAVAŞ KAPANIR'), apply: (S, l) => { S.bossDrainMult *= 1 - [0.1, 0.2, 0.3][l - 1]; } };
for (const k in BOSS_PEOPLE) SPEAKERS[BOSS_PEOPLE[k]] = BOSSES[k].name;

// ---------- liberation: after each cup win one rival with an open file may go home ----------
function freedCount() { return Object.keys(META.freed || {}).filter(id => RIVAL_BY_ID[id]).length; }
function isFreed(id) { return !!(META.freed && META.freed[id]); }
function activeRivals(reg) { return (NAMED_RIVALS[reg] || []).filter(r => !isFreed(r.id)); }
function freeCandidates() { return NAMED_RIVALS.flat().filter(r => META.rivals[r.id] && !isFreed(r.id)); }
const RIVAL_BYE = {
  zefir: TX('BULUTLARIM BENİ BEKLİYOR. HER RÜZGAR ESTİĞİNDE ADINI FISILDAYACAĞIM, DENİZ.'),
  gumbur: TX('GÜM! GÜM! BU SEFER SEVİNÇTEN GÜRLÜYORUM DÜNYALI!'),
  damla: TX('YAĞMUR OLUP YAĞACAĞIM. BİR GÜN DÜNYADA ISLANIRSAN, O BENİM.'),
  kivilcim: TX('SÖNMEDEN EVE VARACAĞIM! SEN DE SÖNME, DÜNYALI!'),
  curuf: TX('KORHAN USTAYA SÖYLE: OCAK YENİDEN YANACAK. BEN YAKACAĞIM.'),
  oniks: TX('NİŞANIMI HİÇ ŞAŞIRMAMIŞTIM. SENİN KALBİNE DE ŞAŞIRMADIM.'),
  glorb: TX('DENKLEMİ ÇÖZDÜN DÜNYALI: EVE GİDEN YOLUN DEĞİŞKENİ DOSTLUKMUŞ. ZİLA\'DA ADINA BİR KİTAP YAZACAĞIM.'),
  vuum: TX('YEDİ YAVRUMA DOKUZ KOLUMLA SARILACAĞIM! BİR KOLUM DA SENİN İÇİN, DENİZ.'),
  pip: TX('PİP PİP! BELKİ EVDE UÇMAYI DA ÖĞRENİRİM. ÖĞRENMESEM DE OLUR, KOŞMAYI SEN ÖĞRETTİN.'),
  gece: TX('KIZ KARDEŞİMİ TRİBÜNDE BULDUM, O DA GELİYOR! NOKS\'UN KARANLIĞINDA SENİN IŞIĞIN YANACAK.'),
  kiskac: TX('YENİ PROGRAM YÜKLENDİ: ARKADAŞLIK. HEDEF: ASTEROİT KUŞAĞI. NOT: BİP\'E SELAM.'),
  mantis: TX('HUMA\'DA YAĞMUR YİNE YAĞIYOR OLMALI. BU SEFER SEVİNEREK ISLANACAĞIM.'),
  buzdis: TX('KARDEŞLERİM BU KIŞ SENİN HEYKELİNİ YAPACAK. ATIN DA OLACAK, SÖZ.'),
  aurora: TX('KANATLARIM YİNE RENKLENDİ. LUMEN\'İN GÖĞÜNE BAKARSAN YEŞİL BİR IŞIK GÖRÜRSÜN: O BENİM.'),
  kar: TX('SICAK BİR YERDE UYANACAĞIM SONUNDA. ERİRSEM DE MUTLU ERİRİM!'),
  tozkiran: TX('KERVANLAR YİNE YOLA ÇIKACAK. ŞARKININ YENİ KITASI SENİNLE İLGİLİ DÜNYALI.'),
  zib: TX('BORCUM KAPANDI! MOKO\'YA SÖYLE: KUZENİ SONUNDA EVDE, DÜKKANINI AÇIYOR.'),
  serap: TX('DEMEK GERÇEK BİR KAPI VARMIŞ. BEN DE GERÇEKMİŞİM. HOŞÇA KAL, DENİZ.'),
  alev: TX('PİRA\'YA DÖNÜYORUM AMA ŞAMPİYON OLARAK DEĞİL. ARTIK KİMSENİN ÖNÜNDE KOŞMAK ZORUNDA DEĞİLİM.'),
  golge: TX('ADIMI HATIRLADIM: RÜZGAR. YİRMİ YIL ÖNCE AKYEL\'E BORÇLANDIM. BORCUMU OĞLUNA ÖDEDİM.'),
  nova: TX('YILDIZIMA DÖNÜYORUM. SÖNMÜŞ OLABİLİR AMA BEN HÂLÂ PARLIYORUM. SEN DE PARLA.')
};

// ---------- after-run reactions (storylets): someone at the station always has a word about the last run ----------
// cond(i) reads META.lastRun; prio decides; once = only the first time; lines may be a function of the run info
const RUN_REACTIONS = [
  { id: 'cupAgain', prio: 90, cond: i => i.won && META.stats.wins > 1 && META.freeTokens > 0, lines: () => [['akyel', TX('BİR KUPA DAHA! KAPI YİNE AÇIK. SEYİR DEFTERİNDEN BİR RAKİP SEÇ, EVİNE GÖNDERELİM.')]] },
  { id: 'cupFreed', prio: 89, cond: i => i.won && META.stats.wins > 1 && !(META.freeTokens > 0), lines: () => [['bip', TX('KAPIDAN BİRİ DAHA GEÇTİ. İSTASYON SESSİZLEŞİYOR AMA GÜZEL BİR SESSİZLİK. BİP.')]] },
  { id: 'bossLoss_pirlanta', prio: 70, cond: i => i.boss === 'pirlanta', lines: () => [['ayse', TX('KRİSTALO KİBİRLENİNCE DURUR. O AN HAMLE YAP YA DA ALTIN NOTAYI VUR, KİBRİNİ KIR!')]] },
  { id: 'bossLoss_kurt', prio: 70, cond: i => i.boss === 'kurt', lines: () => [['ayse', TX('GORM ULUYUNCA SİS ÇÖKER VE KURTLAR YANDAN GELİR. KULAĞIN RİTİMDE OLSUN, GÖZÜN KENARLARDA.')]] },
  { id: 'bossLoss_niva', prio: 70, cond: i => i.boss === 'niva', lines: () => [['bip', TX('BİP. NİVA\'NIN AYAZINDA ŞERİT DEĞİŞTİRMEK YAVAŞLAR. BUZU HAMLEYLE YA DA ALTIN NOTAYLA KIR.')], ['tayfun', TX('SARKITLARIN DÜŞTÜĞÜ ŞERİT KIRMIZI YANAR. ORADAN UZAK DUR, YETER!')]] },
  { id: 'bossLoss_zarg', prio: 70, cond: i => i.boss === 'zarg', lines: () => [['kemal', TX('KUMDA TURUNCU HALKA GÖRDÜĞÜN AN O ŞERİTTEN ÇIK. SOLUCAN ORADAN FIRLAR.')]] },
  { id: 'bossLoss_simsek', prio: 70, cond: i => i.boss === 'simsek', lines: () => [[META.stats.wins ? 'akyel' : 'kemal', TX('VOLTRAK YİNE HİLE YAPTI, DEĞİL Mİ? KIVILCIMLARIN DÜŞECEĞİ ŞERİT ÖNCE KIZARIR. BEKLEME, KAÇ.')]] },
  { id: 'duelLoss', prio: 60, cond: i => !!i.duelLost, lines: i => [['kemal', i.duelLost + TX(' SENİ DÜELLODA GEÇTİ. ARKASINA SAKLAN, SİPERİN DOLSUN, SON DÜZLÜKTE YANA ÇIK.')]] },
  { id: 'nemesisNew', prio: 58, once: true, cond: i => !!i.nemesis, lines: i => [['tayfun', i.nemesis + TX(' ARTIK RÖVANŞÇIN! KIRMIZI TAÇLA GELECEK. ONU GEÇERSEN KESEN DOLAR!')]] },
  { id: 'revenge', prio: 55, cond: i => i.revenge, lines: () => [['tayfun', TX('RÖVANŞI ALDIN HA! GRAX\'IN SURATINI GÖRMELİYDİN, MİKROFONU DÜŞÜRDÜ!')]] },
  { id: 'leagueTop', prio: 50, cond: i => i.league === 1 && !i.won, lines: () => [['moko', TX('LİG LİDERİ DÜNYALI! BAHİS MASAMDA ORANLARIN DÜŞTÜ, BUNU İYİ ANLAMDA SÖYLÜYORUM.')]] },
  { id: 'sGrades', prio: 45, cond: i => i.sGrades >= 3, lines: i => [['ayse', i.sGrades + TX(' ETAPTA S NOTU! TOYNAKLARIN MÜZİĞİN İÇİNDEYDİ BUGÜN.')]] },
  { id: 'chaseLoss', prio: 40, cond: i => i.type === 'kovala', lines: () => [['bip', TX('KARA DELİK SENİ YAKALADI. KOMBO HIZDIR: RİTMİ BOZMA, HAMLEYİ SON ANA SAKLA.')]] },
  { id: 'raidLoss', prio: 40, cond: i => i.type === 'baskin', lines: () => [['tayfun', TX('KORSANLAR FAZLA MI GELDİ? RİTİMLE VUR, SİLAH KENDİ NİŞAN ALIR. KAPTANI ÖZEL ATIŞLA DÜŞÜR!')]] },
  { id: 'sprintLoss', prio: 35, cond: i => i.type === 'sprint', lines: () => [['ayse', TX('SPRİNTTE GERİDE KALINCA NEFESİN DAHA HIZLI DOLAR. O NEFESİ HAMLEYE ÇEVİR!')]] },
  { id: 'parkurLoss', prio: 35, cond: i => i.type === 'parkur', lines: () => [['kemal', TX('PARKURDA ACELE ETME. ENGEL SENE YAKLAŞINCA SIÇRA, ERKEN DEĞİL. TEMİZ ATLAYIŞ HIZ VERİR.')]] },
  { id: 'quit', prio: 30, cond: i => i.quit, lines: () => [['bip', TX('KOŞUYU BIRAKMAK DA BİR SEÇİM. YILDIZ DİNLENDİ, SEN DE DİNLEN. BİP.')]] },
  { id: 'early', prio: 20, cond: i => !i.won && i.region === 0 && i.etap <= 1, lines: () => [['ayse', TX('HERKES BURADAN BAŞLADI DENİZ. NOTA ORTADA BULUŞUNCA DOKUN, GERİSİ GELİR.')]] },
  { id: 'farther', prio: 15, cond: i => !i.won && i.region >= 2, lines: i => [['moko', TX('BU SEFER ') + REGIONS[Math.min(LAST_REGION, i.region)].name + TX(' GEZEGENİNE KADAR GİTTİN! TEZGAHIMDA SENİN ADINA BİR SÜS ASTIM.')]] }
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
  zefir: { race: TX('RÜZGAR PERİSİ'), home: TX('FIRTINA DEVİ'), trick: TX('ÖNDE KAÇAR, MAYIN BIRAKIR'),
    taunt: TX('RÜZGARI YAKALAYAMAZSIN!'),
    lose: [TX('RÜZGARI YAKALADIN. BUNU KİMSEYE SÖYLEME, UTANIRIM.'), TX('BORA USTA ESKİDEN BİZE MASAL ANLATIRDI. SONRA BİR GECE SUSTU.')],
    text: TX('ZEFİR, BULUTLARIN ARASINDA DOĞAN BİR RÜZGAR PERİSİ. BORA\'NIN SÜRÜSÜNE ÇOBANLIK EDERDİ. GRAX BALİNALARI ALINCA ONU DA ALDI. HEP ÖNDE KOŞAR, ÇÜNKÜ DURURSA DAĞILACAĞINDAN KORKAR.') },
  gumbur: { race: TX('GÖK GÜRÜLTÜSÜ KOÇU'), home: TX('FIRTINA DEVİ'), trick: TX('YANAŞIR, "!" SONRA OMUZ ATAR'),
    taunt: TX('GÜM! YOLDAN ÇEKİL!'),
    lose: [TX('GÜM... BU SEFER SESİM ÇIKMADI.'), TX('BULUTLARDA KARDEŞLERİM VAR. HER BİRİ BİR FIRTINA. ONLARA SENİ ANLATACAĞIM.')],
    text: TX('GÜMBÜR, FIRTINA DEVİ\'NİN GÖK GÜRÜLTÜSÜ KOÇLARINDAN. BOYNUZLARINI ÇARPTIRINCA ŞİMŞEK ÇAKAR. GRAX ONU "SEYİRCİ GÜRÜLTÜ SEVER" DİYE SEÇTİ. ASLINDA ÇOK UTANGAÇ; SADECE YARIŞTA BAĞIRIYOR.') },
  damla: { race: TX('YAĞMUR RUHU'), home: TX('FIRTINA DEVİ'), trick: TX('SONDAN GELİR, SONDA ATAKLAR'),
    taunt: TX('BEN SABIRLIYIM. SONUNDA HERKES ISLANIR.'),
    lose: [TX('SABRIM TÜKENDİ, DÜNYALI. İLK KEZ.'), TX('BULUTA DÖNMEK İSTİYORUM. ORADA KİMSE BENİ YARIŞTIRMAZ.')],
    text: TX('DAMLA, BİR BULUTUN İÇİNDE YÜZ YIL BEKLEYİP SONUNDA DÜŞEN BİR YAĞMUR RUHU. GRAX ONU YERE DEĞMEDEN YAKALADI. YARIŞIN SONUNA KADAR BEKLER, SONRA SAĞANAK GİBİ İNER.') },
  kivilcim: { race: TX('KIVILCIM CİNİ'), home: TX('KOR AY'), trick: STYLE_TRICK.zikzak,
    taunt: TX('TUTUŞTURURUM SENİ!'),
    lose: [TX('SÖNDÜM... AMA SADECE BİRAZ.'), TX('KORHAN USTANIN OCAĞINDA DOĞDUM. GRAX ONU ZİNCİRLEDİĞİNDEN BERİ HER YER SOĞUK.')],
    text: TX('KIVILCIM, KORHAN\'IN ÖRSÜNDEN SIÇRAYIP CANLANAN BİR KIVILCIM CİNİ. YERİNDE DURAMAZ, ŞERİTTEN ŞERİDE SEKER. GRAX\'IN KIVILCIMLI NALLARINDAN NEFRET EDER: "ONLAR BENİM KARDEŞLERİM DEĞİL, ZİNCİRLİ ESİRLER."') },
  curuf: { race: TX('CÜRUF GOLEMİ'), home: TX('KOR AY'), trick: TX('YANAŞIR, "!" SONRA OMUZ ATAR'),
    taunt: TX('EZİLMEK İSTEMİYORSAN KENARA!'),
    lose: [TX('AĞIR OLDUĞUM İÇİN YAVAŞ DEĞİLİM. AMA SEN HIZLISIN.'), TX('USTAM KORHAN BENİ ARTAKALAN DEMİRDEN YAPTI. ATILAN ŞEYLERDEN DE GÜZEL ŞEYLER ÇIKAR, DERDİ.')],
    text: TX('CÜRUF, KORHAN\'IN OCAĞINDA ARTAKALAN DEMİRDEN DÖVÜLMÜŞ BİR GOLEM. USTASINI ÇOK SEVER. GRAX ONU ÖRSÜN BAŞINDAN KOPARDI; KORHAN İTAAT ETSİN DİYE REHİN TUTUYOR.') },
  oniks: { race: TX('OBSİDYEN NİŞANCI'), home: TX('KOR AY'), trick: STYLE_TRICK.atici,
    taunt: TX('TEK ATIŞ. TEK ŞANS.'),
    lose: [TX('NİŞANIM ŞAŞTI. YA DA SEN ÇOK HIZLIYDIN.'), TX('KARA CAMDAN DOĞDUM. İÇİMDE YANSIMALAR VAR: SENİNKİ EVİNE BAKIYOR.')],
    text: TX('ONİKS, KOR AY\'IN KARA CAM VADİLERİNDE AVLANAN SESSİZ BİR NİŞANCI. ATEŞİN İÇİNDE BİLE ÜŞÜR. GRAX ONA PLAZMA VERDİ; O İSE HER ATIŞTAN ÖNCE KORHAN İÇİN DUA EDİYOR.') }
});
STORY.push(
  { id: 'v6news', cond: () => !!META.flags.v6news, lines: [['bip', TX('BİP! KAYITLARIMI ONARDIM: SEYİR DEFTERİNDE YOLCULUĞUN BAŞINI ÇİZİMLERLE İZLEYEBİLİRSİN.')], ['kemal', TX('BİR DE HARİTAYA BAK DENİZ. KIZIL KUM\'DAN SONRA İKİ GEZEGEN DAHA VAR: FIRTINA DEVİ VE KOR AY.')]] },
  { id: 'regionBulut', cond: () => META.stats.bestRegion >= regionIdx('bulut'), lines: [['kemal', TX('FIRTINA DEVİ... BORA\'YI TANIRIM. ANNENLE AYNI FİNALDE KOŞTU. ONA SORACAKLARIN VAR, DENİZ.')], ['bip', TX('BULUT PİSTİNDE YILDIRIMLAR ŞERİTLERE DÜŞER. KIRMIZI ŞERİDİ GÖRÜNCE KAÇ. BİP.')]] },
  { id: 'winBora', cond: () => !!META.stats.bossWins.bora, lines: [['ayse', TX('BORA NE DEDİ? KIVILCIM MI? DEMEK O GECE FIRTINA DEĞİLDİ...')], ['grax', TX('ESKİ HİKAYELER, DÜNYALI! SEYİRCİ YENİ SKANDAL İSTER. KOR AY\'DA SENİ YAKACAĞIZ!')]] },
  { id: 'regionKor', cond: () => META.stats.bestRegion >= regionIdx('kor'), lines: [['tayfun', TX('KOR AY! LAV DALGASI GELİNCE SIÇRA, YOKSA TOYNAKLAR YANAR!')], ['moko', TX('DEMİRCİ KORHAN... GRAX ONU ZİNCİRLEDİ DİYORLAR. ZİNCİRLİ BİRİ EN TEHLİKELİSİDİR, DÜNYALI.')]] },
  { id: 'winKorhan', cond: () => !!META.stats.bossWins.korhan, lines: [['kemal', TX('BU KALIP... VOLTRAK\'IN NALLARI! GRAX\'IN MÜHRÜ ÜSTÜNDE!')], ['bip', TX('BİP. KANIT KAYDEDİLDİ. ARENA\'DA HERKES GÖRECEK.')], ['ayse', TX('ŞİMDİ GİT VE KAZAN DENİZ. ANNEN İÇİN.')]] }
);
