# Dörtnala — basit PixelLab üretim rehberi

Bu dosyada her assetin ayrı, doğrudan kopyalanabilir İngilizce promptu var. Açıklamalar Türkçe. **Hepsini birden üretmen gerekmiyor.** Önce aşağıdaki küçük başlangıç listesini tamamla; çıkan görselleri oyunda kontrol ettikten sonra devam et.

## Önce bunları bil

- **Yıldız hazır ve oyuna bağlı:** duruş, dört koşu karesi ve sıçrama var. Tekrar üretme.
- **Yeşil kertenkele r1:** duruş ve koşu dosyaları hazır, oyuna henüz bağlı değil. Sıçrama daha önce başlatıldı; PixelLab hesabında sonucu kontrol et. Bu rehber hazırlanırken yeni üretim başlatılmadı.
- Diğer kartlar bir üretim planıdır; hazır oldukları anlamına gelmez. Yeni ayrıntılar, özellikle evcil hayvan ve Voltrak tasarımı, öneridir.
- PixelLab kredisi ile Codex kullanım hakkı ayrıdır. Üretmeden önce düğmede yazan kredi maliyetine bak; burada sabit fiyat veya kaç üretim hakkın kaldığı varsayılmıyor.
- Görsel tutarlılığı kaliteli görünmenin anahtarıdır. Güzel tek bir resim, diğerleriyle kamera ve ölçü olarak uyuşmazsa oyunu iyileştirmeyebilir.

## İlk yapacağın 5 iş

1. PixelLab’de mevcut Yıldız karakterini aç; referans olarak kullanacağın görsel bu olsun.
2. **Grax — portre** kartını üret.
3. **Ahır Modülü** kartını üret. Beğendiğinde aynı resmi referans verip **Ahır Modülü — hasarlı** kartını üret.
4. **MOKO — portre** ve **BİP-0 — portre** kartlarını üret.
5. PNG dosyalarını adlarıyla bir klasöre koy ve bana ver. İlk sonuçlar oyunda uygun görünürse diğer binalara, sonra rakiplere geç.

İlk aşamada bütün rakipleri, bütün ikonları veya sekiz yön animasyonlarını üretme. Oyundaki küçük simgelerin çoğu zaten kodla çiziliyor; en büyük farkı karakterler, portreler ve binalar yaratır.

## Nereye ne yazacağım?

PixelLab’i aç: https://www.pixellab.ai

### A — Yarış karakterinin duruşu

1. **Character Creator** bölümünü aç.
2. Kartın promptunu karakter açıklamasına yapıştır.
3. Yıldız için **Quadruped → Horse**; uzaylı binekler için **Custom** seç.
4. Boyut **32 px**, kamera **High Top-Down** olsun. Önceki çalışmada Pro kullanıldı; üretim düğmesindeki maliyeti kontrol et.
5. Stil/referans alanında **Choose from my characters** ile mevcut Yıldız’ı seç.
6. Üret. Yarışta kullanacağımız yön **North**: karakter yukarı gider, sırtını görürüz.
7. PNG/ZIP çıktısını indir. Karakter oluşturucu birden fazla yön üretebilir; bu oyunun yarışı için hepsini ayrıca animasyonlandırma.

### B — Koşu veya sıçrama

1. Önce ilgili karakterin oluşturulmuş sayfasını aç. Sıfırdan karakter oluşturma.
2. **Add Animation** bölümünde yönü **North** seç. Kart özellikle güney diyorsa **South** seç.
3. **Custom Animation / V3** içindeki **Action Description** alanına hareket promptunu yapıştır.
4. **Frame Count: 4**. Koşuda **Keep first frame (idle)** kapalı olsun. Sıçramada açık kalabilir.
5. Üretim maliyetini kontrol edip üret. Koşu önizlemesinde döngünün takılmadığını kontrol et.
6. Kareleri ayrı PNG veya ZIP olarak indir. Sıçramada tek bir iyi havadaki kare de oyuna bağlamak için yeterli olabilir; animasyonu sakla.

Yıldız’ın mevcut koşusu Skeleton v3 → Running → Run (4 frames) ile üretildi. Hazır sonucu tekrar üretmene gerek yok. Tek sıçrama pozu için bütün yönlerde **Create State** üretmek yerine önce mevcut animasyonu kullan.

### C — Portre, bina, eşya ve dekor

1. **Simple Creator / Create Image** gibi tek görsel üretme bölümünü aç. Arayüzde isim değişirse açıklama yazılan tek resim aracını kullan.
2. Kartta yazan boyutu seç veya en yakın desteklenen küçük boyutu kullan.
3. Promptu açıklama alanına yapıştır. Referans eklenebiliyorsa aynı kategoriden beğendiğin ilk resmi ekle.
4. Arka planı **Transparent / şeffaf** seç. Tek resim üret.
5. İndirirken **PNG** kullan. Bina, portre ve ikon için Character Creator’ın sekiz yönlü üretimine gerek yok.

### D — Hasarlı bina veya alternatif durum

1. Önce sağlam/normal halini üret ve indir.
2. Görsel düzenleme veya referansla üretme alanına bu resmi yükle.
3. İlgili hasarlı/alternatif promptunu yapıştır; tuval boyutunu değiştirme.
4. İki görselde kapı, taban ve dış sınırlar aynı yerde olmalı. Kaymışsa yeni bina gibi kullanma; hizalama gerekeceğini not et.

### E — Tekrarlanan zemin

1. Tek resim/texture üretme aracında **32 × 32** seç.
2. Varsa **seamless / tileable** seçeneğini aç; promptu yapıştır.
3. Bu kategoride arka plan **opak**, yani dolu olacak. Şeffaf zemin istemiyoruz.
4. Yan yana ve alt alta tekrarlandığında çizgi oluşmamalı. Yol dokusuna taş, çiçek veya karakter ekleme; bunlar ayrı assetler.

## İndirince ne yapacağım?

- Her karttaki dosya adı bir **kaydetme önerisidir**. PixelLab’in farklı adla indirdiği dosyayı buna göre yeniden adlandırabilirsin.
- Tüm çıktıları `web/assets/pixellab/incoming/` klasörüne, karttaki alt klasörlerle koy. İstersen tek ZIP olarak bana da verebilirsin.
- Orijinalleri sakla. Animasyon karelerini tek tek kırpma veya farklı boyutlara getirme; merkezleri kayar. PNG’yi JPEG’e dönüştürme.
- Buradaki boyutlar **üretim boyutlarıdır**; oyundaki son çizim ölçüsü değildir. Entegrasyonda küçük ölçüye uygun hale getirilecek.
- **Dosyayı klasöre koymak tek başına oyunu değiştirmez.** Ben dosyaları kodda doğru karaktere bağlayıp animasyon, boyut ve Xcode paketini kontrol edeceğim.
- Hasar parlaması, gölge, yağmur, sis, parçacıklar, ritim notaları, metinler, can/enerji çubukları ve basit ayar/duraklat/onay/iptal simgelerini şimdilik kodda bırak. Bunlara kredi harcaman gerekmez.

## Üretimden sonra 20 saniyelik kontrol

1. Arka plan gerçekten şeffaf mı, yoksa dama deseni resmin içine mi çizilmiş?
2. Yarış karakterinin sırtı görünüyor ve yukarı mı bakıyor?
3. Küçük boyutta bakınca karakterin ne olduğu anlaşılıyor mu?
4. Koşuda renk, binici, bacak sayısı ve tuval merkezi değişiyor mu?
5. Bina diğer binalarla aynı kamerada mı? Hasarlı hali sağlam haliyle hizalı mı?

Başarısız bir sonuçta sürekli yeni üretim yapmak yerine promptu ve görseli sakla; neyin düzeltilmesi gerektiğini birlikte belirleyebiliriz.

## Hazır PixelLab sayfaları

- Yıldız: https://www.pixellab.ai/create-character/0842a4f4-7151-49ff-a62d-47209de8bdfb
- Yıldız sıçrama durumu: https://www.pixellab.ai/create-character/68a4b4e8-8f13-4265-9ad9-7693e076ef44
- Yeşil kertenkele: https://www.pixellab.ai/create-character/b69e1164-055c-4e7e-9f7d-118752eda497

## Ayrı ayrı promptlar

Her kutuyu bütünüyle kopyala. Ortak stil cümleleri her prompta dahil; başka yerden metin eklemene gerek yok. Animasyon ve hasarlı sürüm promptları **referans görsel ister**.

## 1 · Yarış karakterleri

### 1. Deniz ve Yıldız — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/yildiz/idle-north.png`
- Not: Hazır: duruş, 4 koşu karesi ve sıçrama oyuna bağlı. Yeniden üretme.

```text
A complete mounted racer: a warm bay horse with dark mane and tail carrying Deniz, a jockey in red and white racing silks and a red helmet. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 2. Deniz ve Yıldız — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/yildiz/run-north.zip`
- Not: Hazır: duruş, 4 koşu karesi ve sıçrama oyuna bağlı. Yeniden üretme.

```text
Animate the supplied reference of a warm bay horse with dark mane and tail carrying Deniz, a jockey in red and white racing silks and a red helmet. Four-frame seamless racing loop facing north, viewed from high top-down. Use a clear galloping cycle with alternating leg positions. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 3. Deniz ve Yıldız — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/yildiz/jump-north.zip`
- Not: Hazır: duruş, 4 koşu karesi ve sıçrama oyuna bağlı. Yeniden üretme.

```text
Animate the supplied reference of a warm bay horse with dark mane and tail carrying Deniz, a jockey in red and white racing silks and a red helmet making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 4. Yeşil kertenkele — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/r1/idle-north.png`
- Not: Duruş ve koşu dosyaları hazır; henüz oyuna bağlı değil. Sıçrama üretimi daha önce başlatıldı; hesabındaki sonucu kontrol et, yeniden başlatma.

```text
A complete mounted racer: a green alien racing lizard with yellow highlights, orange markings and yellow eyes, carrying a salmon-pink eye-stalk alien jockey in a purple suit with yellow trim. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 5. Yeşil kertenkele — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r1/run-north.zip`
- Not: Duruş ve koşu dosyaları hazır; henüz oyuna bağlı değil. Sıçrama üretimi daha önce başlatıldı; hesabındaki sonucu kontrol et, yeniden başlatma.

```text
Animate the supplied reference of a green alien racing lizard with yellow highlights, orange markings and yellow eyes, carrying a salmon-pink eye-stalk alien jockey in a purple suit with yellow trim. Four-frame seamless racing loop facing north, viewed from high top-down. Use a clear galloping cycle with alternating leg positions. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 6. Yeşil kertenkele — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r1/jump-north.zip`
- Not: Duruş ve koşu dosyaları hazır; henüz oyuna bağlı değil. Sıçrama üretimi daha önce başlatıldı; hesabındaki sonucu kontrol et, yeniden başlatma.

```text
Animate the supplied reference of a green alien racing lizard with yellow highlights, orange markings and yellow eyes, carrying a salmon-pink eye-stalk alien jockey in a purple suit with yellow trim making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 7. Kırmızı böcek — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/r2/idle-north.png`

```text
A complete mounted racer: a red and salmon armored racing beetle with wine-colored shadows and yellow eyes, carrying a three-eyed green alien jockey in a gold suit with white trim. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 8. Kırmızı böcek — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r2/run-north.zip`

```text
Animate the supplied reference of a red and salmon armored racing beetle with wine-colored shadows and yellow eyes, carrying a three-eyed green alien jockey in a gold suit with white trim. Four-frame seamless racing loop facing north, viewed from high top-down. Use a clear galloping cycle with alternating leg positions. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 9. Kırmızı böcek — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r2/jump-north.zip`

```text
Animate the supplied reference of a red and salmon armored racing beetle with wine-colored shadows and yellow eyes, carrying a three-eyed green alien jockey in a gold suit with white trim making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 10. Mavi vatoz — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/r3/idle-north.png`

```text
A complete mounted racer: a sky-blue and cyan hovering racing ray with white accents and yellow eyes, carrying a green dome-headed alien jockey in an orange suit with yellow trim, a salmon glass dome enclosing a magenta brain. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 11. Mavi vatoz — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r3/run-north.zip`

```text
Animate the supplied reference of a sky-blue and cyan hovering racing ray with white accents and yellow eyes, carrying a green dome-headed alien jockey in an orange suit with yellow trim, a salmon glass dome enclosing a magenta brain. Four-frame seamless racing loop facing north, viewed from high top-down. Use smooth hovering forward motion, small wing undulation. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 12. Mavi vatoz — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r3/jump-north.zip`

```text
Animate the supplied reference of a sky-blue and cyan hovering racing ray with white accents and yellow eyes, carrying a green dome-headed alien jockey in an orange suit with yellow trim, a salmon glass dome enclosing a magenta brain making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 13. Pembe kuş — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/r4/idle-north.png`

```text
A complete mounted racer: a salmon-pink racing bird with sand highlights, magenta shadows, cyan accents and golden legs, carrying a cyan fin-headed alien jockey in a blue suit with yellow trim. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 14. Pembe kuş — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r4/run-north.zip`

```text
Animate the supplied reference of a salmon-pink racing bird with sand highlights, magenta shadows, cyan accents and golden legs, carrying a cyan fin-headed alien jockey in a blue suit with yellow trim. Four-frame seamless racing loop facing north, viewed from high top-down. Use a clear galloping cycle with alternating leg positions. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 15. Pembe kuş — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r4/jump-north.zip`

```text
Animate the supplied reference of a salmon-pink racing bird with sand highlights, magenta shadows, cyan accents and golden legs, carrying a cyan fin-headed alien jockey in a blue suit with yellow trim making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 16. Mor canavar — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/r5/idle-north.png`

```text
A complete mounted racer: a magenta racing beast with salmon highlights and purple shadows, carrying a silver robot jockey with a cyan eye in an orange suit with yellow trim. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 17. Mor canavar — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r5/run-north.zip`

```text
Animate the supplied reference of a magenta racing beast with salmon highlights and purple shadows, carrying a silver robot jockey with a cyan eye in an orange suit with yellow trim. Four-frame seamless racing loop facing north, viewed from high top-down. Use a clear galloping cycle with alternating leg positions. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 18. Mor canavar — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r5/jump-north.zip`

```text
Animate the supplied reference of a magenta racing beast with salmon highlights and purple shadows, carrying a silver robot jockey with a cyan eye in an orange suit with yellow trim making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 19. Turuncu kertenkele — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/r6/idle-north.png`

```text
A complete mounted racer: an orange racing lizard with gold highlights, rust shadows and cyan eyes, carrying a blue horned alien jockey in a white suit with blue trim and yellow horns. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 20. Turuncu kertenkele — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r6/run-north.zip`

```text
Animate the supplied reference of an orange racing lizard with gold highlights, rust shadows and cyan eyes, carrying a blue horned alien jockey in a white suit with blue trim and yellow horns. Four-frame seamless racing loop facing north, viewed from high top-down. Use a clear galloping cycle with alternating leg positions. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 21. Turuncu kertenkele — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r6/jump-north.zip`

```text
Animate the supplied reference of an orange racing lizard with gold highlights, rust shadows and cyan eyes, carrying a blue horned alien jockey in a white suit with blue trim and yellow horns making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 22. Altın böcek — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/r7/idle-north.png`

```text
A complete mounted racer: a gold and yellow racing beetle with orange shadows, blue accents and cyan eyes, carrying a green cyclops jockey in a purple suit with cyan trim and one red eye. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 23. Altın böcek — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r7/run-north.zip`

```text
Animate the supplied reference of a gold and yellow racing beetle with orange shadows, blue accents and cyan eyes, carrying a green cyclops jockey in a purple suit with cyan trim and one red eye. Four-frame seamless racing loop facing north, viewed from high top-down. Use a clear galloping cycle with alternating leg positions. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 24. Altın böcek — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r7/jump-north.zip`

```text
Animate the supplied reference of a gold and yellow racing beetle with orange shadows, blue accents and cyan eyes, carrying a green cyclops jockey in a purple suit with cyan trim and one red eye making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 25. Gümüş kuş — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/r8/idle-north.png`

```text
A complete mounted racer: a silver and white racing bird with gray shadows, sky-blue accents and orange legs, carrying a green long-eared alien jockey in a red suit with yellow trim. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 26. Gümüş kuş — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r8/run-north.zip`

```text
Animate the supplied reference of a silver and white racing bird with gray shadows, sky-blue accents and orange legs, carrying a green long-eared alien jockey in a red suit with yellow trim. Four-frame seamless racing loop facing north, viewed from high top-down. Use smooth hovering forward motion, small wing undulation. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 27. Gümüş kuş — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/r8/jump-north.zip`

```text
Animate the supplied reference of a silver and white racing bird with gray shadows, sky-blue accents and orange legs, carrying a green long-eared alien jockey in a red suit with yellow trim making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 28. Glorb — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/n5/idle-north.png`

```text
A complete mounted racer: a cyan horned racing beetle with white highlights, blue shadows, magenta accents and yellow eyes, carrying a yellow dome-headed alien jockey in a magenta suit with white trim, green glass over a yellow brain. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 29. Glorb — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/n5/run-north.zip`

```text
Animate the supplied reference of a cyan horned racing beetle with white highlights, blue shadows, magenta accents and yellow eyes, carrying a yellow dome-headed alien jockey in a magenta suit with white trim, green glass over a yellow brain. Four-frame seamless racing loop facing north, viewed from high top-down. Use a clear galloping cycle with alternating leg positions. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 30. Glorb — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/n5/jump-north.zip`

```text
Animate the supplied reference of a cyan horned racing beetle with white highlights, blue shadows, magenta accents and yellow eyes, carrying a yellow dome-headed alien jockey in a magenta suit with white trim, green glass over a yellow brain making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 31. Kızıl Vuum — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/n1/idle-north.png`

```text
A complete mounted racer: an orange striped hovering racing ray with gold highlights and rust shadows, carrying a magenta squid alien jockey in a navy suit with gold trim. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 32. Kızıl Vuum — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/n1/run-north.zip`

```text
Animate the supplied reference of an orange striped hovering racing ray with gold highlights and rust shadows, carrying a magenta squid alien jockey in a navy suit with gold trim. Four-frame seamless racing loop facing north, viewed from high top-down. Use smooth hovering forward motion, small wing undulation. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 33. Kızıl Vuum — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/n1/jump-north.zip`

```text
Animate the supplied reference of an orange striped hovering racing ray with gold highlights and rust shadows, carrying a magenta squid alien jockey in a navy suit with gold trim making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 34. Gece Kanadı — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/n6/idle-north.png`

```text
A complete mounted racer: a navy and slate hovering racing ray with luminous gold edges and gold eyes, carrying a silver long-eared alien jockey in a wine-red suit with gold trim. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 35. Gece Kanadı — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/n6/run-north.zip`

```text
Animate the supplied reference of a navy and slate hovering racing ray with luminous gold edges and gold eyes, carrying a silver long-eared alien jockey in a wine-red suit with gold trim. Four-frame seamless racing loop facing north, viewed from high top-down. Use smooth hovering forward motion, small wing undulation. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 36. Gece Kanadı — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/n6/jump-north.zip`

```text
Animate the supplied reference of a navy and slate hovering racing ray with luminous gold edges and gold eyes, carrying a silver long-eared alien jockey in a wine-red suit with gold trim making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 37. Demir Kıskaç — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/n3/idle-north.png`

```text
A complete mounted racer: a blue and cyan racing lizard with a yellow dorsal sail and hot-pink eyes, carrying a gold robot jockey in a navy suit with yellow trim and a pink eye. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 38. Demir Kıskaç — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/n3/run-north.zip`

```text
Animate the supplied reference of a blue and cyan racing lizard with a yellow dorsal sail and hot-pink eyes, carrying a gold robot jockey in a navy suit with yellow trim and a pink eye. Four-frame seamless racing loop facing north, viewed from high top-down. Use a clear galloping cycle with alternating leg positions. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 39. Demir Kıskaç — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/n3/jump-north.zip`

```text
Animate the supplied reference of a blue and cyan racing lizard with a yellow dorsal sail and hot-pink eyes, carrying a gold robot jockey in a navy suit with yellow trim and a pink eye making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 40. Alev Kuyruk — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/n4/idle-north.png`

```text
A complete mounted racer: a gold and yellow racing bird with orange shadows, cyan accents and a spectacular blue tail, carrying a purple eye-stalk alien jockey in a sky-blue suit with white trim. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 41. Alev Kuyruk — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/n4/run-north.zip`

```text
Animate the supplied reference of a gold and yellow racing bird with orange shadows, cyan accents and a spectacular blue tail, carrying a purple eye-stalk alien jockey in a sky-blue suit with white trim. Four-frame seamless racing loop facing north, viewed from high top-down. Use a clear galloping cycle with alternating leg positions. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 42. Alev Kuyruk — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/n4/jump-north.zip`

```text
Animate the supplied reference of a gold and yellow racing bird with orange shadows, cyan accents and a spectacular blue tail, carrying a purple eye-stalk alien jockey in a sky-blue suit with white trim making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 43. Grax’ın Gölgesi — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/n2/idle-north.png`

```text
A complete mounted racer: a silver and white spiked racing beast with blue accents and cyan eyes, carrying a blue fin-headed alien jockey in a white suit with cyan trim. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 44. Grax’ın Gölgesi — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/n2/run-north.zip`

```text
Animate the supplied reference of a silver and white spiked racing beast with blue accents and cyan eyes, carrying a blue fin-headed alien jockey in a white suit with cyan trim. Four-frame seamless racing loop facing north, viewed from high top-down. Use a clear galloping cycle with alternating leg positions. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 45. Grax’ın Gölgesi — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/n2/jump-north.zip`

```text
Animate the supplied reference of a silver and white spiked racing beast with blue accents and cyan eyes, carrying a blue fin-headed alien jockey in a white suit with cyan trim making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 46. Prens Kristalo — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/kristalo/idle-north.png`

```text
A complete mounted racer: a magenta crystalline hovering racing ray with salmon highlights, purple shadows and cyan accents, carrying a silver crystal-headed royal jockey in a white suit with magenta trim and a cyan cape. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 47. Prens Kristalo — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/kristalo/run-north.zip`

```text
Animate the supplied reference of a magenta crystalline hovering racing ray with salmon highlights, purple shadows and cyan accents, carrying a silver crystal-headed royal jockey in a white suit with magenta trim and a cyan cape. Four-frame seamless racing loop facing north, viewed from high top-down. Use smooth hovering forward motion, small wing undulation. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 48. Prens Kristalo — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/kristalo/jump-north.zip`

```text
Animate the supplied reference of a magenta crystalline hovering racing ray with salmon highlights, purple shadows and cyan accents, carrying a silver crystal-headed royal jockey in a white suit with magenta trim and a cyan cape making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 49. Uluyan Gorm — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/gorm/idle-north.png`

```text
A complete mounted racer: a massive dark-green racing beast with silver accents and yellow eyes, carrying a gray brute jockey with sand-colored horns in a dark-green suit with silver trim. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 50. Uluyan Gorm — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/gorm/run-north.zip`

```text
Animate the supplied reference of a massive dark-green racing beast with silver accents and yellow eyes, carrying a gray brute jockey with sand-colored horns in a dark-green suit with silver trim. Four-frame seamless racing loop facing north, viewed from high top-down. Use smooth hovering forward motion, small wing undulation. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 51. Uluyan Gorm — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/gorm/jump-north.zip`

```text
Animate the supplied reference of a massive dark-green racing beast with silver accents and yellow eyes, carrying a gray brute jockey with sand-colored horns in a dark-green suit with silver trim making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 52. Voltrak — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/voltrak/idle-north.png`
- Not: Önerilen yeni görünüm; varsa mevcut Voltrak görselini stil referansı olarak ekle.

```text
A complete mounted racer: a silver robotic racehorse with electric red accents carrying an armored robotic champion jockey, compact mechanical joints and a menacing visor. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 53. Voltrak — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/voltrak/run-north.zip`
- Not: Önerilen yeni görünüm; varsa mevcut Voltrak görselini stil referansı olarak ekle.

```text
Animate the supplied reference of a silver robotic racehorse with electric red accents carrying an armored robotic champion jockey, compact mechanical joints and a menacing visor. Four-frame seamless racing loop facing north, viewed from high top-down. Use a clear galloping cycle with alternating leg positions. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 54. Voltrak — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/voltrak/jump-north.zip`
- Not: Önerilen yeni görünüm; varsa mevcut Voltrak görselini stil referansı olarak ekle.

```text
Animate the supplied reference of a silver robotic racehorse with electric red accents carrying an armored robotic champion jockey, compact mechanical joints and a menacing visor making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 55. Korsan — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/korsan/idle-north.png`

```text
A complete mounted racer: a slate-gray racing lizard with navy shadows, wine-red markings and red eyes, carrying a green hooded pirate jockey in a plum suit with gold trim and red hood. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 56. Korsan — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/korsan/run-north.zip`

```text
Animate the supplied reference of a slate-gray racing lizard with navy shadows, wine-red markings and red eyes, carrying a green hooded pirate jockey in a plum suit with gold trim and red hood. Four-frame seamless racing loop facing north, viewed from high top-down. Use smooth hovering forward motion, small wing undulation. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 57. Korsan — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/korsan/jump-north.zip`

```text
Animate the supplied reference of a slate-gray racing lizard with navy shadows, wine-red markings and red eyes, carrying a green hooded pirate jockey in a plum suit with gold trim and red hood making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 58. Nişancı — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/nisanci/idle-north.png`

```text
A complete mounted racer: a teal racing bird with deep-green shadows, cyan accents and gold legs, carrying a dark-green cyclops gunner jockey in a slate suit with green trim and one red eye. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 59. Nişancı — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/nisanci/run-north.zip`

```text
Animate the supplied reference of a teal racing bird with deep-green shadows, cyan accents and gold legs, carrying a dark-green cyclops gunner jockey in a slate suit with green trim and one red eye. Four-frame seamless racing loop facing north, viewed from high top-down. Use a clear galloping cycle with alternating leg positions. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 60. Nişancı — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/nisanci/jump-north.zip`

```text
Animate the supplied reference of a teal racing bird with deep-green shadows, cyan accents and gold legs, carrying a dark-green cyclops gunner jockey in a slate suit with green trim and one red eye making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 61. Korsan Kaptanı — duruş

- Yöntem: **A** · Boyut: **32 × 32**
- Dosya: `characters/kaptan/idle-north.png`

```text
A complete mounted racer: a wine-red racing beast with plum shadows, salmon highlights and yellow eyes, carrying a green pirate captain jockey in a navy suit with gold trim and a black tricorn hat. High top-down view, directly facing north, away from the viewer; the backs of rider and mount are visible. Narrow vertical silhouette, entire mount and rider inside the canvas. Match the reference Yildiz racer camera and scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 62. Korsan Kaptanı — koşu

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/kaptan/run-north.zip`

```text
Animate the supplied reference of a wine-red racing beast with plum shadows, salmon highlights and yellow eyes, carrying a green pirate captain jockey in a navy suit with gold trim and a black tricorn hat. Four-frame seamless racing loop facing north, viewed from high top-down. Use a clear galloping cycle with alternating leg positions. Keep the body centered, orientation and apparent size fixed. No camera movement, no translation across the canvas, no design changes. Keep rider stable with subtle bounce. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 63. Korsan Kaptanı — sıçrama

- Yöntem: **B** · Boyut: **4 kare; aynı tuval**
- Dosya: `characters/kaptan/jump-north.zip`

```text
Animate the supplied reference of a wine-red racing beast with plum shadows, salmon highlights and yellow eyes, carrying a green pirate captain jockey in a navy suit with gold trim and a black tricorn hat making one short obstacle jump while facing north, viewed from high top-down. Four phases: prepare, rise, clear airborne pose with legs tucked or wings lifted, land. Keep the entire sprite inside the canvas and preserve its design and colors. Fixed camera. Make the airborne pose easy to read at tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

## 2 · Portreler ve üs sakinleri

### 64. Deniz — portre

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `portraits/deniz.png`

```text
Head-and-shoulders portrait of a young human jockey, brown hair, red and white racing suit, red helmet and cyan goggles. Front-facing three-quarter expression, face large and legible, centered, no frame. Match the supplied in-game character reference when available. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 65. Deniz — üs karakteri

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `hub/deniz.png`

```text
Full-body standing sprite of a young human jockey, brown hair, red and white racing suit, red helmet and cyan goggles. High three-quarter top-down view, facing south toward viewer, suitable for a space-station hub. Short readable proportions. Match the portrait reference. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 66. BİP-0 — portre

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `portraits/bip.png`

```text
Head-and-shoulders portrait of a friendly silver and white caretaker robot, dark visor with one cyan lens, yellow antenna and blue chest panel. Front-facing three-quarter expression, face large and legible, centered, no frame. Match the supplied in-game character reference when available. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 67. BİP-0 — üs karakteri

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `hub/bip.png`

```text
Full-body standing sprite of a friendly silver and white caretaker robot, dark visor with one cyan lens, yellow antenna and blue chest panel. High three-quarter top-down view, facing south toward viewer, suitable for a space-station hub. Short readable proportions. Match the portrait reference. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 68. MOKO — portre

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `portraits/moko.png`

```text
Head-and-shoulders portrait of a friendly green four-armed alien merchant, magenta hat with gold band and cyan jewel, purple robe with gold trim; upper hands hold a coin and crystal, lower hands are clasped. Front-facing three-quarter expression, face large and legible, centered, no frame. Match the supplied in-game character reference when available. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 69. MOKO — üs karakteri

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `hub/moko.png`

```text
Full-body standing sprite of a friendly green four-armed alien merchant, magenta hat with gold band and cyan jewel, purple robe with gold trim; upper hands hold a coin and crystal, lower hands are clasped. High three-quarter top-down view, facing south toward viewer, suitable for a space-station hub. Short readable proportions. Match the portrait reference. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 70. Grax — portre

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `portraits/grax.png`

```text
Head-and-shoulders portrait of a purple three-eyed alien television host with yellow slit pupils, slick magenta crest, sparkling gold suit, white shirt, hot-pink bow tie, microphone and wide toothy grin. Front-facing three-quarter expression, face large and legible, centered, no frame. Match the supplied in-game character reference when available. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 71. Akyel — portre

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `portraits/akyel.png`

```text
Head-and-shoulders portrait of a legendary older female jockey with silver hair, a small facial scar and a kind determined expression, worn red and white helmet and matching racing suit. Front-facing three-quarter expression, face large and legible, centered, no frame. Match the supplied in-game character reference when available. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 72. Ayşe — portre

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `portraits/ayse.png`

```text
Head-and-shoulders portrait of a female jockey wearing a red and gold racing outfit. Front-facing three-quarter expression, face large and legible, centered, no frame. Match the supplied in-game character reference when available. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 73. Ayşe — üs karakteri

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `hub/ayse.png`

```text
Full-body standing sprite of a female jockey wearing a red and gold racing outfit. High three-quarter top-down view, facing south toward viewer, suitable for a space-station hub. Short readable proportions. Match the portrait reference. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 74. Kemal Usta — portre

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `portraits/kemal.png`

```text
Head-and-shoulders portrait of a older veteran male jockey wearing blue and white racing silks. Front-facing three-quarter expression, face large and legible, centered, no frame. Match the supplied in-game character reference when available. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 75. Kemal Usta — üs karakteri

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `hub/kemal.png`

```text
Full-body standing sprite of a older veteran male jockey wearing blue and white racing silks. High three-quarter top-down view, facing south toward viewer, suitable for a space-station hub. Short readable proportions. Match the portrait reference. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 76. Tayfun — portre

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `portraits/tayfun.png`

```text
Head-and-shoulders portrait of a energetic jockey wearing orange and navy racing silks and racing goggles. Front-facing three-quarter expression, face large and legible, centered, no frame. Match the supplied in-game character reference when available. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 77. Tayfun — üs karakteri

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `hub/tayfun.png`

```text
Full-body standing sprite of a energetic jockey wearing orange and navy racing silks and racing goggles. High three-quarter top-down view, facing south toward viewer, suitable for a space-station hub. Short readable proportions. Match the portrait reference. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 78. Glorb — portre

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `portraits/n5.png`

```text
Head-and-shoulders portrait of a yellow dome-headed alien jockey in a magenta suit with white trim, green glass over a yellow brain. Show only the jockey, without the mount. Expressive rival face, front-facing, no frame. Match the supplied mounted character reference. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 79. Kızıl Vuum — portre

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `portraits/n1.png`

```text
Head-and-shoulders portrait of a magenta squid alien jockey in a navy suit with gold trim. Show only the jockey, without the mount. Expressive rival face, front-facing, no frame. Match the supplied mounted character reference. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 80. Gece Kanadı — portre

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `portraits/n6.png`

```text
Head-and-shoulders portrait of a silver long-eared alien jockey in a wine-red suit with gold trim. Show only the jockey, without the mount. Expressive rival face, front-facing, no frame. Match the supplied mounted character reference. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 81. Demir Kıskaç — portre

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `portraits/n3.png`

```text
Head-and-shoulders portrait of a gold robot jockey in a navy suit with yellow trim and a pink eye. Show only the jockey, without the mount. Expressive rival face, front-facing, no frame. Match the supplied mounted character reference. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 82. Alev Kuyruk — portre

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `portraits/n4.png`

```text
Head-and-shoulders portrait of a purple eye-stalk alien jockey in a sky-blue suit with white trim. Show only the jockey, without the mount. Expressive rival face, front-facing, no frame. Match the supplied mounted character reference. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 83. Grax’ın Gölgesi — portre

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `portraits/n2.png`

```text
Head-and-shoulders portrait of a blue fin-headed alien jockey in a white suit with cyan trim. Show only the jockey, without the mount. Expressive rival face, front-facing, no frame. Match the supplied mounted character reference. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 84. Zıpzıp

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `hub/dog.png`
- Not: Evcil hayvan renkleri için önerilen tasarım; mevcut görünümü korumak istersen ekran görüntüsünü referans ekle.

```text
Full-body idle sprite of a friendly small space puppy with a tiny cyan collar. High three-quarter top-down view, facing south. Match existing in-game reference if supplied. Cute and readable at small scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 85. Uzay civcivi

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `hub/chick.png`
- Not: Evcil hayvan renkleri için önerilen tasarım; mevcut görünümü korumak istersen ekran görüntüsünü referans ekle.

```text
Full-body idle sprite of a tiny friendly alien hatchling with a bright yellow body and a cyan crest. High three-quarter top-down view, facing south. Match existing in-game reference if supplied. Cute and readable at small scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 86. Binicisiz Yıldız

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `hub/yildiz-unmounted.png`
- Not: Evcil hayvan renkleri için önerilen tasarım; mevcut görünümü korumak istersen ekran görüntüsünü referans ekle.

```text
Full-body idle sprite of a warm bay horse with dark mane and tail, red saddle blanket, no rider. High three-quarter top-down view, facing south. Match existing in-game reference if supplied. Cute and readable at small scale. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

## 3 · Üs binaları

### 87. Kamara

- Yöntem: **C** · Boyut: **64 × 64**
- Dosya: `buildings/ev.png`

```text
A compact cozy astronaut cabin with a rounded airlock, blue windows and a small red roof panel. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 88. Ahır Modülü

- Yöntem: **C** · Boyut: **64 × 64**
- Dosya: `buildings/ahir.png`

```text
A space horse stable with a wide open stall entrance, horse emblem without text, metal roof and warm interior light. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 89. Ahır Modülü — hasarlı

- Yöntem: **D** · Boyut: **64 × 64**
- Dosya: `buildings/ahir-broken.png`

```text
Edit the supplied intact reference of the space horse stable with a wide open stall entrance, horse emblem without text, metal roof and warm interior light into its abandoned damaged version. Preserve EXACT canvas size, camera, outline footprint, doorway position and overall geometry. Add a few cracks, dark windows, loose metal panels and light rust. No explosion, no extra terrain. It must align perfectly with the intact sprite. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 90. Yem Deposu

- Yöntem: **C** · Boyut: **64 × 64**
- Dosya: `buildings/ambar.png`

```text
A space feed silo with a cylindrical grain tank, feed bags and a small loading door. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 91. Yem Deposu — hasarlı

- Yöntem: **D** · Boyut: **64 × 64**
- Dosya: `buildings/ambar-broken.png`

```text
Edit the supplied intact reference of the space feed silo with a cylindrical grain tank, feed bags and a small loading door into its abandoned damaged version. Preserve EXACT canvas size, camera, outline footprint, doorway position and overall geometry. Add a few cracks, dark windows, loose metal panels and light rust. No explosion, no extra terrain. It must align perfectly with the intact sprite. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 92. Nal Atölyesi

- Yöntem: **C** · Boyut: **64 × 64**
- Dosya: `buildings/nalbant.png`

```text
A space horseshoe workshop with a tiny anvil, glowing orange forge and horseshoe emblem. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 93. Nal Atölyesi — hasarlı

- Yöntem: **D** · Boyut: **64 × 64**
- Dosya: `buildings/nalbant-broken.png`

```text
Edit the supplied intact reference of the space horseshoe workshop with a tiny anvil, glowing orange forge and horseshoe emblem into its abandoned damaged version. Preserve EXACT canvas size, camera, outline footprint, doorway position and overall geometry. Add a few cracks, dark windows, loose metal panels and light rust. No explosion, no extra terrain. It must align perfectly with the intact sprite. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 94. Cephanelik

- Yöntem: **C** · Boyut: **64 × 64**
- Dosya: `buildings/silahhane.png`

```text
A compact futuristic armory with reinforced door, cyan energy cells and orderly weapon racks. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 95. Cephanelik — hasarlı

- Yöntem: **D** · Boyut: **64 × 64**
- Dosya: `buildings/silahhane-broken.png`

```text
Edit the supplied intact reference of the compact futuristic armory with reinforced door, cyan energy cells and orderly weapon racks into its abandoned damaged version. Preserve EXACT canvas size, camera, outline footprint, doorway position and overall geometry. Add a few cracks, dark windows, loose metal panels and light rust. No explosion, no extra terrain. It must align perfectly with the intact sprite. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 96. Jokey Koğuşu

- Yöntem: **C** · Boyut: **64 × 64**
- Dosya: `buildings/jokey.png`

```text
A space jockey dormitory with twin blue windows, compact bunk module and red racing pennant. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 97. Jokey Koğuşu — hasarlı

- Yöntem: **D** · Boyut: **64 × 64**
- Dosya: `buildings/jokey-broken.png`

```text
Edit the supplied intact reference of the space jockey dormitory with twin blue windows, compact bunk module and red racing pennant into its abandoned damaged version. Preserve EXACT canvas size, camera, outline footprint, doorway position and overall geometry. Add a few cracks, dark windows, loose metal panels and light rust. No explosion, no extra terrain. It must align perfectly with the intact sprite. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 98. Revir

- Yöntem: **C** · Boyut: **64 × 64**
- Dosya: `buildings/veteriner.png`

```text
A friendly space veterinary clinic with cyan medical symbol, white panels and a mint-green window. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 99. Revir — hasarlı

- Yöntem: **D** · Boyut: **64 × 64**
- Dosya: `buildings/veteriner-broken.png`

```text
Edit the supplied intact reference of the friendly space veterinary clinic with cyan medical symbol, white panels and a mint-green window into its abandoned damaged version. Preserve EXACT canvas size, camera, outline footprint, doorway position and overall geometry. Add a few cracks, dark windows, loose metal panels and light rust. No explosion, no extra terrain. It must align perfectly with the intact sprite. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 100. Gözlemevi

- Yöntem: **C** · Boyut: **64 × 64**
- Dosya: `buildings/tapinak.png`

```text
A small space observatory with a rounded dome, short telescope and purple star ornament. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 101. Gözlemevi — hasarlı

- Yöntem: **D** · Boyut: **64 × 64**
- Dosya: `buildings/tapinak-broken.png`

```text
Edit the supplied intact reference of the small space observatory with a rounded dome, short telescope and purple star ornament into its abandoned damaged version. Preserve EXACT canvas size, camera, outline footprint, doorway position and overall geometry. Add a few cracks, dark windows, loose metal panels and light rust. No explosion, no extra terrain. It must align perfectly with the intact sprite. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 102. Görev Ekranı

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `buildings/gorev.png`

```text
A freestanding holographic mission terminal with a dark blank screen and cyan frame. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 103. Yarış Portalı

- Yöntem: **C** · Boyut: **64 × 64**
- Dosya: `buildings/portal.png`

```text
A wide futuristic race departure gate with two pillars and a glowing cyan portal arch, empty passage. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 104. Akyel Anıtı

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `buildings/anit.png`

```text
A small respectful memorial to a legendary female jockey, silver helmet on a pedestal, blank plaque. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 105. Zıpzıp Kulübesi

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `buildings/kulube.png`

```text
A tiny space doghouse with a rounded doorway and cyan roof. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 106. Moko Pazarı

- Yöntem: **C** · Boyut: **64 × 64**
- Dosya: `buildings/moko-stall.png`

```text
A colorful alien merchant booth with purple canopy, gold trim, coins and crystals, no merchant. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 107. Pist Alışveriş Tezgâhı

- Yöntem: **C** · Boyut: **64 × 64**
- Dosya: `buildings/stall.png`

```text
A wide sci-fi pit-stop shop counter with compact supplies and a magenta awning, no characters. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 108. Dinlenme Kapsülü

- Yöntem: **C** · Boyut: **64 × 64**
- Dosya: `buildings/fountain.png`

```text
A compact restorative space capsule with cyan glass, rounded metal base and soft green energy core. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 109. Sera Tarhı

- Yöntem: **C** · Boyut: **32 × 32**
- Dosya: `buildings/bahce.png`

```text
A single rectangular space greenhouse planting bed with dark soil, metal border and tiny irrigation pipe, no crops. Three-quarter top-down game prop, front doorway visible, orthographic projection, modest depth, no surrounding terrain, complete structure in frame. Modular space-station architecture, silver metal with colorful accents. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

## 4 · Dekor ve tarla

### 110. Uzay samanı

- Yöntem: **C** · Boyut: **32 × 32; zincir 64 × 16**
- Dosya: `decor/saman.png`

```text
A game prop showing two small bundled golden feed bales with metal straps. Three-quarter top-down camera matching the station buildings. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 111. Çiçeklik

- Yöntem: **C** · Boyut: **32 × 32; zincir 64 × 16**
- Dosya: `decor/cicek.png`

```text
A game prop showing a shallow silver planter with cyan and magenta alien flowers. Three-quarter top-down camera matching the station buildings. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 112. Neon fener

- Yöntem: **C** · Boyut: **32 × 32; zincir 64 × 16**
- Dosya: `decor/fener.png`

```text
A game prop showing a thin upright station lamp with a cyan glowing bulb. Three-quarter top-down camera matching the station buildings. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 113. Işık zinciri

- Yöntem: **C** · Boyut: **32 × 32; zincir 64 × 16**
- Dosya: `decor/bayrak.png`

```text
A game prop showing a horizontal short string of tiny colorful space-station lights. Three-quarter top-down camera matching the station buildings. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 114. Kubbeli ağaç

- Yöntem: **C** · Boyut: **32 × 32; zincir 64 × 16**
- Dosya: `decor/agac.png`

```text
A game prop showing a small green tree in a rounded transparent biosphere dome. Three-quarter top-down camera matching the station buildings. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 115. Su tankı

- Yöntem: **C** · Boyut: **32 × 32; zincir 64 × 16**
- Dosya: `decor/kuyu.png`

```text
A game prop showing a compact silver water tank with a cyan gauge. Three-quarter top-down camera matching the station buildings. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 116. Hologram çeşmesi

- Yöntem: **C** · Boyut: **32 × 32; zincir 64 × 16**
- Dosya: `decor/cesme.png`

```text
A game prop showing a small round station fountain with a cyan holographic water jet. Three-quarter top-down camera matching the station buildings. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 117. Akyel heykeli

- Yöntem: **C** · Boyut: **32 × 32; zincir 64 × 16**
- Dosya: `decor/heykel.png`

```text
A game prop showing a small silver statue of a female jockey on a compact pedestal. Three-quarter top-down camera matching the station buildings. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 118. Havuç — aşama 1

- Yöntem: **C** · Boyut: **16 × 16**
- Dosya: `crops/carrot-1.png`

```text
One orange carrot with green leaves crop in growth stage: tiny planted seed mound with one green sprout. High top-down view. Same centered root position and scale as the other growth stages, no planting bed, isolated plant. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 119. Havuç — aşama 2

- Yöntem: **C** · Boyut: **16 × 16**
- Dosya: `crops/carrot-2.png`

```text
One orange carrot with green leaves crop in growth stage: small young plant with two leaves. High top-down view. Same centered root position and scale as the other growth stages, no planting bed, isolated plant. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 120. Havuç — aşama 3

- Yöntem: **C** · Boyut: **16 × 16**
- Dosya: `crops/carrot-3.png`

```text
One orange carrot with green leaves crop in growth stage: growing leafy plant with a hint of root. High top-down view. Same centered root position and scale as the other growth stages, no planting bed, isolated plant. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 121. Havuç — aşama 4

- Yöntem: **C** · Boyut: **16 × 16**
- Dosya: `crops/carrot-4.png`

```text
One orange carrot with green leaves crop in growth stage: fully mature harvest-ready plant with visible root. High top-down view. Same centered root position and scale as the other growth stages, no planting bed, isolated plant. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 122. Pancar — aşama 1

- Yöntem: **C** · Boyut: **16 × 16**
- Dosya: `crops/beet-1.png`

```text
One purple beetroot with green leaves crop in growth stage: tiny planted seed mound with one green sprout. High top-down view. Same centered root position and scale as the other growth stages, no planting bed, isolated plant. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 123. Pancar — aşama 2

- Yöntem: **C** · Boyut: **16 × 16**
- Dosya: `crops/beet-2.png`

```text
One purple beetroot with green leaves crop in growth stage: small young plant with two leaves. High top-down view. Same centered root position and scale as the other growth stages, no planting bed, isolated plant. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 124. Pancar — aşama 3

- Yöntem: **C** · Boyut: **16 × 16**
- Dosya: `crops/beet-3.png`

```text
One purple beetroot with green leaves crop in growth stage: growing leafy plant with a hint of root. High top-down view. Same centered root position and scale as the other growth stages, no planting bed, isolated plant. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 125. Pancar — aşama 4

- Yöntem: **C** · Boyut: **16 × 16**
- Dosya: `crops/beet-4.png`

```text
One purple beetroot with green leaves crop in growth stage: fully mature harvest-ready plant with visible root. High top-down view. Same centered root position and scale as the other growth stages, no planting bed, isolated plant. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

## 5 · Düşmanlar ve pist engelleri

### 126. Gözcü

- Yöntem: **C** · Boyut: **24 × 24**
- Dosya: `enemies/karga/idle.png`

```text
Full-body sprite of a floating white alien eyeball with red iris, black pupil and purple bat wings. High top-down camera, facing SOUTH down toward viewer. Clear compact silhouette. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 127. Gözcü — hareket

- Yöntem: **B** · Boyut: **4 kare**
- Dosya: `enemies/karga/move.zip`

```text
Animate the supplied reference of a floating white alien eyeball with red iris, black pupil and purple bat wings. Four-frame seamless motion loop, facing south in high top-down view. Flap the wings symmetrically. Fixed camera, stable scale and canvas center. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 128. Tosbik

- Yöntem: **C** · Boyut: **24 × 24**
- Dosya: `enemies/domuz/idle.png`

```text
Full-body sprite of a charging red horned beetle with salmon shell highlights, wine shadows, brown head, pale horn and yellow eyes. High top-down camera, facing SOUTH down toward viewer. Clear compact silhouette. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 129. Tosbik — hareket

- Yöntem: **B** · Boyut: **4 kare**
- Dosya: `enemies/domuz/move.zip`

```text
Animate the supplied reference of a charging red horned beetle with salmon shell highlights, wine shadows, brown head, pale horn and yellow eyes. Four-frame seamless motion loop, facing south in high top-down view. Use readable small movement appropriate to this subject; barrel rolls, beetle runs, robot marches. Fixed camera, stable scale and canvas center. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 130. Kalkan Robotu

- Yöntem: **C** · Boyut: **24 × 24**
- Dosya: `enemies/kalkanli/idle.png`

```text
Full-body sprite of a small boxy silver robot holding a translucent cyan energy shield in front. High top-down camera, facing SOUTH down toward viewer. Clear compact silhouette. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 131. Kalkan Robotu — hareket

- Yöntem: **B** · Boyut: **4 kare**
- Dosya: `enemies/kalkanli/move.zip`

```text
Animate the supplied reference of a small boxy silver robot holding a translucent cyan energy shield in front. Four-frame seamless motion loop, facing south in high top-down view. Use readable small movement appropriate to this subject; barrel rolls, beetle runs, robot marches. Fixed camera, stable scale and canvas center. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 132. Yuvarlanan varil

- Yöntem: **C** · Boyut: **24 × 24**
- Dosya: `enemies/fici/idle.png`

```text
Full-body sprite of a compact cylindrical silver space barrel with dark metal bands. High top-down camera, facing SOUTH down toward viewer. Clear compact silhouette. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 133. Yuvarlanan varil — hareket

- Yöntem: **B** · Boyut: **4 kare**
- Dosya: `enemies/fici/move.zip`

```text
Animate the supplied reference of a compact cylindrical silver space barrel with dark metal bands. Four-frame seamless motion loop, facing south in high top-down view. Use readable small movement appropriate to this subject; barrel rolls, beetle runs, robot marches. Fixed camera, stable scale and canvas center. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 134. Kalkan Robotu — sersemlemiş

- Yöntem: **D** · Boyut: **24 × 24**
- Dosya: `enemies/kalkanli/stunned.png`

```text
Edit the supplied shield robot reference: energy shield switched off, arms lowered, slightly dazed pose. Preserve the robot design, south-facing camera, size, center and canvas. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 135. Meteor taşı

- Yöntem: **C** · Boyut: **32 × 32; geniş engel 64 × 32**
- Dosya: `track/rock.png`
- Not: Lazer hareketi, çarpışma ve ritim işaretleri kodda kalır; PNG yalnızca görseldir.

```text
A top-down racing obstacle: a small dark gray jagged meteor rock. Camera high overhead. Strong readable silhouette, contained within canvas. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 136. Kristal kaya

- Yöntem: **C** · Boyut: **32 × 32; geniş engel 64 × 32**
- Dosya: `track/rock2.png`
- Not: Lazer hareketi, çarpışma ve ritim işaretleri kodda kalır; PNG yalnızca görseldir.

```text
A top-down racing obstacle: a small jagged rock with bright cyan crystals. Camera high overhead. Strong readable silhouette, contained within canvas. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 137. Yosunlu kaya

- Yöntem: **C** · Boyut: **32 × 32; geniş engel 64 × 32**
- Dosya: `track/mossrock.png`
- Not: Lazer hareketi, çarpışma ve ritim işaretleri kodda kalır; PNG yalnızca görseldir.

```text
A top-down racing obstacle: a small rock covered in purple alien moss. Camera high overhead. Strong readable silhouette, contained within canvas. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 138. Enerji varili

- Yöntem: **C** · Boyut: **32 × 32; geniş engel 64 × 32**
- Dosya: `track/bale.png`
- Not: Lazer hareketi, çarpışma ve ritim işaretleri kodda kalır; PNG yalnızca görseldir.

```text
A top-down racing obstacle: a horizontal metallic energy drum with cyan glowing bands. Camera high overhead. Strong readable silhouette, contained within canvas. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 139. Dikenli uzay engeli

- Yöntem: **C** · Boyut: **32 × 32; geniş engel 64 × 32**
- Dosya: `track/wolf.png`
- Not: Lazer hareketi, çarpışma ve ritim işaretleri kodda kalır; PNG yalnızca görseldir.

```text
A top-down racing obstacle: a small compact alien spiked hazard with purple armor and cyan spikes. Camera high overhead. Strong readable silhouette, contained within canvas. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 140. Lazer bariyeri

- Yöntem: **C** · Boyut: **32 × 32; geniş engel 64 × 32**
- Dosya: `track/hurdle.png`
- Not: Lazer hareketi, çarpışma ve ritim işaretleri kodda kalır; PNG yalnızca görseldir.

```text
A top-down racing obstacle: a horizontal low race hurdle with silver posts and a red laser beam. Camera high overhead. Strong readable silhouette, contained within canvas. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 141. Boru engeli

- Yöntem: **C** · Boyut: **32 × 32; geniş engel 64 × 32**
- Dosya: `track/log.png`
- Not: Lazer hareketi, çarpışma ve ritim işaretleri kodda kalır; PNG yalnızca görseldir.

```text
A top-down racing obstacle: a short horizontal broken industrial pipe with orange warning bands. Camera high overhead. Strong readable silhouette, contained within canvas. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 142. Uzay jölesi

- Yöntem: **C** · Boyut: **32 × 32; geniş engel 64 × 32**
- Dosya: `track/puddle.png`
- Not: Lazer hareketi, çarpışma ve ritim işaretleri kodda kalır; PNG yalnızca görseldir.

```text
A top-down racing obstacle: a small flat translucent magenta alien jelly puddle. Camera high overhead. Strong readable silhouette, contained within canvas. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 143. Dikenli mayın

- Yöntem: **C** · Boyut: **32 × 32; geniş engel 64 × 32**
- Dosya: `track/civi.png`
- Not: Lazer hareketi, çarpışma ve ritim işaretleri kodda kalır; PNG yalnızca görseldir.

```text
A top-down racing obstacle: a small metallic spike mine with red warning light. Camera high overhead. Strong readable silhouette, contained within canvas. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 144. Tarayıcı çerçevesi

- Yöntem: **C** · Boyut: **32 × 32; geniş engel 64 × 32**
- Dosya: `track/scan-frame.png`
- Not: Lazer hareketi, çarpışma ve ritim işaretleri kodda kalır; PNG yalnızca görseldir.

```text
A top-down racing obstacle: two narrow silver scanner pillars with cyan tips and an empty gap, without laser beam. Camera high overhead. Strong readable silhouette, contained within canvas. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 145. Ritim kapısı çerçevesi

- Yöntem: **C** · Boyut: **32 × 32; geniş engel 64 × 32**
- Dosya: `track/gate-frame.png`
- Not: Lazer hareketi, çarpışma ve ritim işaretleri kodda kalır; PNG yalnızca görseldir.

```text
A top-down racing obstacle: a colorful race gate frame with empty center and small cyan light sockets, without symbols or text. Camera high overhead. Strong readable silhouette, contained within canvas. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

## 6 · Pist çevresi ve zeminler

### 146. Mor pist çiçeği

- Yöntem: **C** · Boyut: **32 × 32; ağaç/mantar 64 × 64**
- Dosya: `scenery/flower-purple.png`

```text
A separate scenery sprite of one small purple alien flower. High top-down game camera. No surrounding landscape. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 147. Camgöbeği pist çiçeği

- Yöntem: **C** · Boyut: **32 × 32; ağaç/mantar 64 × 64**
- Dosya: `scenery/flower-cyan.png`

```text
A separate scenery sprite of one small cyan alien flower. High top-down game camera. No surrounding landscape. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 148. Mor ot

- Yöntem: **C** · Boyut: **32 × 32; ağaç/mantar 64 × 64**
- Dosya: `scenery/tuft-purple.png`

```text
A separate scenery sprite of a small tuft of purple alien grass. High top-down game camera. No surrounding landscape. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 149. Koyu yeşil ot

- Yöntem: **C** · Boyut: **32 × 32; ağaç/mantar 64 × 64**
- Dosya: `scenery/tuft-green.png`

```text
A separate scenery sprite of a small tuft of dark-green alien grass. High top-down game camera. No surrounding landscape. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 150. Uzay çalısı

- Yöntem: **C** · Boyut: **32 × 32; ağaç/mantar 64 × 64**
- Dosya: `scenery/bush.png`

```text
A separate scenery sprite of a magenta alien bush with cyan highlights. High top-down game camera. No surrounding landscape. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 151. Uzay ağacı

- Yöntem: **C** · Boyut: **32 × 32; ağaç/mantar 64 × 64**
- Dosya: `scenery/tree.png`

```text
A separate scenery sprite of a compact alien tree with purple foliage and cyan crystal fruit. High top-down game camera. No surrounding landscape. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 152. Küçük mantar

- Yöntem: **C** · Boyut: **32 × 32; ağaç/mantar 64 × 64**
- Dosya: `scenery/mushroom.png`

```text
A separate scenery sprite of a small cyan bioluminescent mushroom. High top-down game camera. No surrounding landscape. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 153. Dev mantar

- Yöntem: **C** · Boyut: **32 × 32; ağaç/mantar 64 × 64**
- Dosya: `scenery/giant-mushroom.png`

```text
A separate scenery sprite of a tall alien mushroom with a broad purple cap, cyan spots and pale stem. High top-down game camera. No surrounding landscape. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 154. Arena kenar paneli

- Yöntem: **C** · Boyut: **32 × 32; ağaç/mantar 64 × 64**
- Dosya: `scenery/barrier.png`

```text
A separate scenery sprite of a modular horizontal silver arena side barrier with cyan neon accents. High top-down game camera. No surrounding landscape. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 155. Bitiş şeridi

- Yöntem: **C** · Boyut: **32 × 32; ağaç/mantar 64 × 64**
- Dosya: `scenery/finish.png`

```text
A separate scenery sprite of a horizontal black and white checkered race finish strip, straight and perfectly flat. High top-down game camera. No surrounding landscape. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 156. Lumo — mor çimen

- Yöntem: **E** · Boyut: **32 × 32**
- Dosya: `tiles/lumo-grass.png`
- Not: Şeffaflık kullanılmaz. Yol dikey tekrarlandığında birleşim çizgisi görünmemeli.

```text
Seamless tileable 32x32 pixel art texture of muted purple alien meadow grass with sparse tiny darker flecks. Strict overhead orthographic view. Low contrast so racers remain legible. Match a limited Endesga-inspired palette. Crisp pixel clusters, no antialiasing. Fill the entire canvas with opaque pixels. Opposite edges match perfectly. No objects, characters, obstacles, text, perspective or lighting gradient.
```

### 157. Lumo — yol

- Yöntem: **E** · Boyut: **32 × 32**
- Dosya: `tiles/lumo-road.png`
- Not: Şeffaflık kullanılmaz. Yol dikey tekrarlandığında birleşim çizgisi görünmemeli.

```text
Seamless tileable 32x32 pixel art texture of warm muted tan compact racing dirt. Strict overhead orthographic view. Low contrast so racers remain legible. Match a limited Endesga-inspired palette. Crisp pixel clusters, no antialiasing. Fill the entire canvas with opaque pixels. Opposite edges match perfectly. No objects, characters, obstacles, text, perspective or lighting gradient.
```

### 158. Mantar Ayı — zemin

- Yöntem: **E** · Boyut: **32 × 32**
- Dosya: `tiles/moon-ground.png`
- Not: Şeffaflık kullanılmaz. Yol dikey tekrarlandığında birleşim çizgisi görünmemeli.

```text
Seamless tileable 32x32 pixel art texture of muted blue-gray lunar soil with tiny shallow craters. Strict overhead orthographic view. Low contrast so racers remain legible. Match a limited Endesga-inspired palette. Crisp pixel clusters, no antialiasing. Fill the entire canvas with opaque pixels. Opposite edges match perfectly. No objects, characters, obstacles, text, perspective or lighting gradient.
```

### 159. Mantar Ayı — yol

- Yöntem: **E** · Boyut: **32 × 32**
- Dosya: `tiles/moon-road.png`
- Not: Şeffaflık kullanılmaz. Yol dikey tekrarlandığında birleşim çizgisi görünmemeli.

```text
Seamless tileable 32x32 pixel art texture of smooth gray lunar racing track. Strict overhead orthographic view. Low contrast so racers remain legible. Match a limited Endesga-inspired palette. Crisp pixel clusters, no antialiasing. Fill the entire canvas with opaque pixels. Opposite edges match perfectly. No objects, characters, obstacles, text, perspective or lighting gradient.
```

### 160. Galaksi Arenası — dış zemin

- Yöntem: **E** · Boyut: **32 × 32**
- Dosya: `tiles/arena-ground.png`
- Not: Şeffaflık kullanılmaz. Yol dikey tekrarlandığında birleşim çizgisi görünmemeli.

```text
Seamless tileable 32x32 pixel art texture of dark navy futuristic arena flooring with subtle geometric joints. Strict overhead orthographic view. Low contrast so racers remain legible. Match a limited Endesga-inspired palette. Crisp pixel clusters, no antialiasing. Fill the entire canvas with opaque pixels. Opposite edges match perfectly. No objects, characters, obstacles, text, perspective or lighting gradient.
```

### 161. Galaksi Arenası — yol

- Yöntem: **E** · Boyut: **32 × 32**
- Dosya: `tiles/arena-road.png`
- Not: Şeffaflık kullanılmaz. Yol dikey tekrarlandığında birleşim çizgisi görünmemeli.

```text
Seamless tileable 32x32 pixel art texture of dark desaturated blue racing surface with subtle horizontal panel seams. Strict overhead orthographic view. Low contrast so racers remain legible. Match a limited Endesga-inspired palette. Crisp pixel clusters, no antialiasing. Fill the entire canvas with opaque pixels. Opposite edges match perfectly. No objects, characters, obstacles, text, perspective or lighting gradient.
```

### 162. İstasyon — döşeme

- Yöntem: **E** · Boyut: **32 × 32**
- Dosya: `tiles/station-floor.png`
- Not: Şeffaflık kullanılmaz. Yol dikey tekrarlandığında birleşim çizgisi görünmemeli.

```text
Seamless tileable 32x32 pixel art texture of silver-blue space station floor panels with subtle seams. Strict overhead orthographic view. Low contrast so racers remain legible. Match a limited Endesga-inspired palette. Crisp pixel clusters, no antialiasing. Fill the entire canvas with opaque pixels. Opposite edges match perfectly. No objects, characters, obstacles, text, perspective or lighting gradient.
```

### 163. İstasyon — duvar

- Yöntem: **E** · Boyut: **32 × 32**
- Dosya: `tiles/station-wall.png`
- Not: Şeffaflık kullanılmaz. Yol dikey tekrarlandığında birleşim çizgisi görünmemeli.

```text
Seamless tileable 32x32 pixel art texture of modular silver-blue station wall panel with a narrow cyan light strip. Strict overhead orthographic view. Low contrast so racers remain legible. Match a limited Endesga-inspired palette. Crisp pixel clusters, no antialiasing. Fill the entire canvas with opaque pixels. Opposite edges match perfectly. No objects, characters, obstacles, text, perspective or lighting gradient.
```

## 7 · Eşyalar ve küçük simgeler

### 164. Can

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/heart.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a red heart. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 165. Kredi

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/coin.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a gold space coin. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 166. Kristal

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/crystal.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a bright cyan crystal. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 167. Rozet

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/rozet.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a gold racing badge. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 168. Yıldız

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/star.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a gold five-pointed star. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 169. Nal

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/shoe.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a silver horseshoe. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 170. Çekiç

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/hammer.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a compact workshop hammer. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 171. Taç

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/crown.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a gold alien champion crown. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 172. Alev

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/flame.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a red-orange flame. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 173. Enerji

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/bolt.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a yellow lightning bolt. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 174. Tehlike

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/skull.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a small stylized alien skull. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 175. Kanat

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/wing.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a white wing. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 176. Çanta

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/bag.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a small purple supply bag. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 177. Düello

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/duel.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of two crossed futuristic racing pennants. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 178. Grax simgesi

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/grax.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a purple three-eyed alien face with a gold collar. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 179. Yayın

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/tv.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a tiny retro-futuristic television with cyan screen. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 180. Havuç yemi

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/havuc.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of an orange carrot with green leaves. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 181. Yulaf

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/yulaf.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a small sack of golden oats. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 182. Şeker

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/seker.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of two white sugar cubes. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 183. Elma

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/elma.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a shiny red apple. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 184. Pancar ürünü

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/pancar.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a purple beetroot with green leaves. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 185. Demir nal

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/demir.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a plain iron horseshoe. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 186. İyon nalı

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/iyon.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a cyan glowing ion horseshoe. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 187. Meteor nalı

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/meteor.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a dark meteor-metal horseshoe with orange cracks. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 188. Ritim nalı

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/ritim.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a magenta horseshoe with two small cyan rhythm sparks. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 189. BİP pili

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/bip-battery.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a small silver battery with cyan energy core. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 190. Ayşe kurdelesi

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/ayse-ribbon.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a red and gold racing ribbon. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 191. Kemal kronometresi

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/kemal-watch.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a silver stopwatch with blue face, no numbers. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 192. Tayfun gözlüğü

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/tayfun-goggles.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of orange racing goggles with navy strap. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 193. Moko kesesi

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/moko-pouch.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a purple coin pouch with gold drawstring. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 194. Tulpar ruhu

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/tulpar.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a cyan winged horse head emblem representing air and jumping. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 195. Kırat ruhu

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/kirat.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a red and wine-colored horse head emblem representing strength. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 196. Sleipnir ruhu

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/sleipnir.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a purple eight-legged mythical horse silhouette emblem. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 197. Pegasus ruhu

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/pegasus.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a gold and white winged horse emblem representing light and rhythm. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 198. Rüzgâr Kısrağı ruhu

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/ruzgar.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a green horse head with flowing wind-shaped mane. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 199. Altın madalya

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/medal-gold.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a gold medal with red ribbon. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 200. Gümüş madalya

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/medal-silver.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a silver medal with blue ribbon. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 201. Bronz madalya

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/medal-bronze.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a bronze medal with purple ribbon. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 202. Kupa

- Yöntem: **C** · Boyut: **16 × 16; ruhlar 24 × 24**
- Dosya: `icons/trophy.png`
- Not: Düşük öncelik: mevcut simge iyi görünüyorsa kredi harcama.

```text
A single UI inventory icon of a gold space racing trophy. Front-facing iconic view. Large simple silhouette occupying most of the canvas. At most three shades per main color. Readable at actual tiny size. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

## 8 · Silahlar ve mermiler

### 203. Işık yayı

- Yöntem: **C** · Boyut: **24 × 24**
- Dosya: `weapons/w_yay.png`

```text
A single inventory icon of a futuristic compact cyan light bow. Three-quarter view, recognizable silhouette, one weapon only. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 204. Şok sapanı

- Yöntem: **C** · Boyut: **24 × 24**
- Dosya: `weapons/w_sapan.png`

```text
A single inventory icon of a silver slingshot with yellow energy band. Three-quarter view, recognizable silhouette, one weapon only. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 205. Raylı arbalet

- Yöntem: **C** · Boyut: **24 × 24**
- Dosya: `weapons/w_tatar.png`

```text
A single inventory icon of a silver and blue compact rail crossbow with cyan rail. Three-quarter view, recognizable silhouette, one weapon only. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 206. Plazma topu

- Yöntem: **C** · Boyut: **24 × 24**
- Dosya: `weapons/w_top.png`

```text
A single inventory icon of a compact silver plasma cannon with magenta energy core. Three-quarter view, recognizable silhouette, one weapon only. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 207. Işık oku

- Yöntem: **C** · Boyut: **16 × 16**
- Dosya: `projectiles/arrow.png`

```text
A tiny game projectile: a white and cyan glowing light arrow pointing north. Straight overhead view, centered, compact glow represented by solid pixel colors, no blurred halo. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 208. Ray mermisi

- Yöntem: **C** · Boyut: **16 × 16**
- Dosya: `projectiles/bolt.png`

```text
A tiny game projectile: a thin cyan rail projectile pointing north. Straight overhead view, centered, compact glow represented by solid pixel colors, no blurred halo. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 209. Şok küresi

- Yöntem: **C** · Boyut: **16 × 16**
- Dosya: `projectiles/pebble.png`

```text
A tiny game projectile: a small yellow-green electric orb. Straight overhead view, centered, compact glow represented by solid pixel colors, no blurred halo. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 210. Plazma küresi

- Yöntem: **C** · Boyut: **16 × 16**
- Dosya: `projectiles/ball.png`

```text
A tiny game projectile: a purple and magenta plasma orb. Straight overhead view, centered, compact glow represented by solid pixel colors, no blurred halo. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 211. Düşman lazeri

- Yöntem: **C** · Boyut: **16 × 16**
- Dosya: `projectiles/earrow.png`

```text
A tiny game projectile: a thin red laser projectile pointing south. Straight overhead view, centered, compact glow represented by solid pixel colors, no blurred halo. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

## 9 · İsteğe bağlı arayüz

### 212. Boş diyalog paneli

- Yöntem: **C** · Boyut: **Panel 128 × 64; buton 64 × 32**
- Dosya: `ui/panel.png`
- Not: En son yap. Yazılar ve dinamik göstergeler oyun kodunda kalacak; entegrasyonda kenarlar korunarak boyutlandırılır.

```text
A pixel art UI element: an empty dark navy rectangular dialogue panel with silver corners and a thin cyan pixel border. Flat front view, straight edges, symmetrical corners. Completely empty interior, absolutely no text or symbols. Match the other UI reference variants exactly. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 213. Buton — normal

- Yöntem: **C** · Boyut: **Panel 128 × 64; buton 64 × 32**
- Dosya: `ui/button-normal.png`
- Not: En son yap. Yazılar ve dinamik göstergeler oyun kodunda kalacak; entegrasyonda kenarlar korunarak boyutlandırılır.

```text
A pixel art UI element: an empty rounded rectangular navy button with silver border. Flat front view, straight edges, symmetrical corners. Completely empty interior, absolutely no text or symbols. Match the other UI reference variants exactly. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 214. Buton — seçili

- Yöntem: **C** · Boyut: **Panel 128 × 64; buton 64 × 32**
- Dosya: `ui/button-hover.png`
- Not: En son yap. Yazılar ve dinamik göstergeler oyun kodunda kalacak; entegrasyonda kenarlar korunarak boyutlandırılır.

```text
A pixel art UI element: an empty rounded rectangular navy button with bright cyan selected border. Flat front view, straight edges, symmetrical corners. Completely empty interior, absolutely no text or symbols. Match the other UI reference variants exactly. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 215. Buton — basılı

- Yöntem: **C** · Boyut: **Panel 128 × 64; buton 64 × 32**
- Dosya: `ui/button-pressed.png`
- Not: En son yap. Yazılar ve dinamik göstergeler oyun kodunda kalacak; entegrasyonda kenarlar korunarak boyutlandırılır.

```text
A pixel art UI element: an empty rounded rectangular navy button with silver border and a slightly recessed center. Flat front view, straight edges, symmetrical corners. Completely empty interior, absolutely no text or symbols. Match the other UI reference variants exactly. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```

### 216. Buton — kapalı

- Yöntem: **C** · Boyut: **Panel 128 × 64; buton 64 × 32**
- Dosya: `ui/button-disabled.png`
- Not: En son yap. Yazılar ve dinamik göstergeler oyun kodunda kalacak; entegrasyonda kenarlar korunarak boyutlandırılır.

```text
A pixel art UI element: an empty rounded rectangular muted gray button with a dim border. Flat front view, straight edges, symmetrical corners. Completely empty interior, absolutely no text or symbols. Match the other UI reference variants exactly. Crisp low-resolution pixel art for a colorful sci-fi racing game. Limited Endesga-inspired palette, dark plum outlines, clean readable pixel clusters, restrained shading, consistent light from upper left. Transparent background, no ground shadow, no text, no letters, no watermark, no antialiasing or blur. One centered isolated asset with clear padding.
```
