# Dörtnala translation brief

Dörtnala is a pixel-art rhythm horse-racing roguelike for iPhone. A young Earth jockey and their horse YILDIZ ("Star")
are abducted by aliens to race in ARENA-9, a galactic TV show hosted by GRAX. Winning the Galaxy Cup opens the door home.
The jockey's mother (a legendary jockey) vanished at a final 20 years ago. Tone: warm, funny, a bit dramatic; short punchy lines.

## Files
- Source chunks: `web/i18n/work/src_1.json` … `src_4.json`. Each item: `{ "tr": "<Turkish line>", "ctx": ["file:line  <code line>"] }`.
- Write your output per chunk to `web/i18n/work/<lang>_<n>.json` as ONE JSON object: `{ "<tr exactly as given>": "<translation>", ... }`.
  Every `tr` of the chunk must appear as a key, copied byte for byte (including spaces, quotes, apostrophes).

## Hard rules (the game font only has these characters)
1. ALL CAPS only. No lowercase letters at all.
2. Allowed characters: A–Z, 0–9, space and `. , ! ? : ; - + = / % ' " ( ) < > # * · ← → ↑ ↓ ♥`
   plus, only in these languages: German `Ä Ö Ü` (write ß as `SS`), Spanish `Á É Í Ó Ú Ñ Ü ¿ ¡`.
   English and Indonesian: no accented letters. Never use Turkish letters (İ Ş Ğ Ç I-without-dot etc.) in other languages,
   never use curly quotes, en/em dashes (use `-`), ellipsis character (use `...`).
3. Keep leading and trailing spaces exactly as in the Turkish line (`' · '`, `' İLE '`, `': '` …). They glue fragments together.
4. Many lines are FRAGMENTS joined in code with numbers or names, e.g. `TX('İLK ') + rank + TX('\'E GİR · ')`.
   Read the `ctx` code line. The pieces are always concatenated in that order, so phrase each fragment so the whole
   sentence reads naturally in your language in that same order (rephrase freely, use `:` or `-` if word order differs).
   Turkish suffixes glued to names/numbers (`'E`, `'IN`, `'YI`, `'DA` …) must disappear; never leave an apostrophe suffix.
5. Length: these are tiny screens (≈190 px, 4–5 px per character). Short UI labels (buttons, titles, names, tags ≤ 16 chars)
   must not be longer than the Turkish + 2 characters; abbreviate if needed (e.g. `MAX`, `LV`). Longer sentences:
   aim for ≤ 120% of the Turkish length.
6. Keep game terms consistent within your language. Decide them once (write `web/i18n/work/<lang>_glossary.md` first) and reuse:
   KRİSTAL (crystal, the meta currency), SİKKE (coin, run currency), KOMBO, MÜKEMMEL (perfect hit), HAMLE (dash),
   NEFES (breath/stamina), SİPER (draft/slipstream), ETAP (stage), KAPI (gate/door), YILDIZ GÜCÜ (star power / boon),
   ŞAMPİYON (champion), SPRİNT, DÜELLO (duel), SEYİR DEFTERİ (logbook), İSTASYON / BÖLME (station / Earth compartment),
   ROZET (badge), ŞEKER (sugar cube), GÖREV (mission), LİG (league), PİST (track), RİTİM (rhythm), TEKNİK (technique/ability).
7. Numbers, `%`, `+`, `-`, `X2`, `SV` (level → use your language's short form, e.g. EN `LV`), arrows and `·` stay.

## Character names: localize the Turkish humans (this is part of the job)
Translate the names everywhere they appear, including inside sentences, possessives and SPEAKER labels.

| Turkish | en | de | es | id |
|---|---|---|---|---|
| DENİZ (hero, unisex) | MORGAN | KAI | ARIEL | TIRTA |
| AKYEL (hero's mother) | GALE | GRETA | ROCÍO | SEKAR |
| AYŞE | AMY | ANNA | LUCÍA | AYU |
| KEMAL / KEMAL USTA | KEN / OLD KEN | KURT / MEISTER KURT | RAMÓN / DON RAMÓN | KARTO / PAK KARTO |
| TAYFUN / ÇILGIN TAYFUN | TYLER / WILD TYLER | TIMO / WILDER TIMO | TOÑO / TOÑO EL LOCO | TOPAN / TOPAN SI GILA |
| KORHAN / DEMİRCİ KORHAN | CINDER / CINDER THE SMITH | GLUTHARD / SCHMIED GLUTHARD | TIZÓN / TIZÓN EL HERRERO | BARA / BARA SI PANDAI BESI |
| YILDIZ (the horse, means "star") | STAR | STERN | ESTRELLA | BINTANG |

Do not translate invented alien/robot names: GRAX, BİP-0 (write `BIP-0` without the Turkish dot), BOP-1, MOKO, GLORB, VUUM,
PİP-PİP (`PIP-PIP`), ZİB (`ZIB`), NOVA, VOLTRAK, KRİSTALO (`KRISTALO`), GORM, NİVA (`NIVA`), ZARG, BORA, AURORA, TULPAR, KIRAT,
SLEIPNIR, PEGASUS, ZIPZIP (the station pet), ARENA-9, LUMO.
Alien names that are Turkish words SHOULD be translated into evocative names in your language, e.g. GECE KANADI (night wing),
DEMİR KISKAÇ (iron claw), SİSLİ MANTİS (misty mantis), BUZDİŞ (ice tooth), KAR TANESİ (snowflake), TOZKIRAN (dust breaker),
ÜÇ GÖZ ZİB (three-eye Zib), SERAP (mirage), ALEV KUYRUK (flame tail), GRAX'IN GÖLGESİ (Grax's shadow), ZEFİR (zephyr),
GÜMBÜR (rumble), DAMLA (droplet), KIVILCIM (spark), CÜRUF (slag), ONİKS (onyx), KIZIL VUUM (crimson Vuum),
RÜZGAR KISRAĞI (wind mare), PRENS KRİSTALO, ULUYAN GORM (howling Gorm), BUZ KRALİÇESİ NİVA, KUM SOLUCANI ZARG,
BULUT ÇOBANI BORA (cloud shepherd Bora). Places too: LUMO ÇAYIRI (Lumo meadow), MANTAR AYI (mushroom moon), BUZ HALKASI
(ice ring), KIZIL KUM (red sands), FIRTINA DEVİ (storm giant), KOR AY (ember moon), GALAKSİ ARENASI, ALTIN NAL KUPASI
(Golden Horseshoe Cup), GALAKSİ KUPASI (Galaxy Cup). Turkish folk references (e.g. KÖROĞLU NARASI) → a local equivalent
(e.g. a legendary hero's war cry in your culture) that fits the game.

## Quality
Natural, idiomatic, game-like. Funny lines stay funny, story lines stay emotional. Grax talks like a flashy TV host,
BIP-0 says "BIP!" like a cute robot, the mother speaks warmly. Keep the 2006 date and story facts. Check every chunk file
parses as JSON before moving on.
