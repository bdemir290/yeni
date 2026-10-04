# Dörtnala — ilk PixelLab üretim seti

Durum (4 Ekim 2026): Yıldız duruş/koşu/sıçrama seti oyuna bağlandı. r1 duruş ve koşu dosyaları mevcut; entegrasyonu tamamlanmadı. Kullanıcının isteğiyle yeni üretim durduruldu. Ayrıntılı kullanıcı rehberi: [PixelLab rehberi](../PIXELLAB_REHBERI.md), [arama ve kopyalama düğmeli sürüm](../PIXELLAB_REHBERI.html). Aşağıdaki metin ilk üretim planının kaydıdır.

## Ortak görsel kurallar

- Mevcut Endesga tabanlı paleti referans al: `src/00_core.js`, `C`.
- Oyun sprite'ları yukarı/kuzeye bakmalı; atın ve jokeyin sırtı görünmeli.
- Şeffaf PNG; keskin piksel kenarları; yumuşatma, yazı ve zemine gömülü gölge yok.
- Animasyon boyunca aynı tuval, aynı merkez ve aynı karakter ölçeği kullanılmalı.
- Büyük bir görselin küçük oyunda okunaklı kalacağı varsayılmamalı; gerçek çizim boyutunda kontrol edilmeli.

## 1. Deniz ve Yıldız

Mevcut bağlantı: `src/02_sprites.js`, `getHorse('bay', 'deniz', blanket)` / `heroHorse`.

Yıldız kahverengi, koyu yeleli; Deniz kırmızı-beyaz yarış kıyafetli. İlk set: dört koşu karesi, bir sıçrama, bir duruş. Beyaz hasar parlaması mevcut `tintSprite` ile yeni kareden türetilecek. Battaniye varyasyonlarının davranışı korunacak.

Başlangıç üretim metni:

> A compact pixel art game sprite of a bay horse with a dark mane and tail, carrying a jockey in red and white racing silks and a red helmet. Directly facing north, away from the viewer, viewed from above in a top-down racing game. Horse and rider form one clear narrow silhouette. Hand-placed pixel clusters, dark plum outline, warm brown and tan horse shading, limited Endesga-style palette. Full body centered, transparent background, no ground, no text, no side view, no perspective horizon.

Koşu hareketi: yerinde dört karelik dörtnal; gövde merkezi sabit, bacak fazları farklı, kuyruk hafif hareketli. Sıçrama: bacaklar gövdeye çekilmiş. Son boyut mevcut sprite ve çarpışma alanıyla birlikte doğrulanacak.

## 2. İlk uzaylı rakip: r1

Mevcut bağlantı: `src/02d_racer_art.js`, `ALIEN_LOOKS.r1`, `getMount('r1')`.

Yeşil kertenkele binek, sarı vurgular, turuncu desen; somon tenli, mor kıyafetli, sarı süslü antenli jokey. Ana karakterle aynı kamera. Dört koşu karesi, sıçrama ve duruş.

Başlangıç üretim metni:

> A compact top-down pixel art racing sprite, facing north away from the viewer: a green alien racing lizard with yellow highlights and orange markings, carrying a salmon-pink alien jockey with eye stalks, a purple racing suit and yellow trim. Full mounted character, narrow readable silhouette, dark plum outline, limited Endesga-style palette, crisp pixel clusters, transparent background, no ground, no text. Match the camera and pixel density of the reference horse racer.

## 3. Sonraki statik örnekler

- Grax portresi: `PORTRAIT.grax`, oyun içi 28×28. Üretimden önce mevcut karakter görünüşü referans alınacak.
- Ahır Modülü: `BLD.ahir` ve `BLD.ahirX`, 56×48. Sağlam ve hasarlı varyant aynı geometriyi paylaşacak.

## Entegrasyon ve kontrol

1. Orijinal PixelLab çıktıları ve üretim ayarları `web/assets/pixellab/` altında saklanacak.
2. Kareler aynı boyuta ve merkeze hizalanacak; oyundaki gerçek ölçekte incelenecek.
3. PNG verileri tek dosyalı/offline yapıyı koruyacak şekilde derlemeye gömülecek; başlangıçta görsellerin yüklenmesi beklenecek.
4. At ve rakip sprite setleri mevcut `frames`, `jump`, `stand`, `white` sözleşmesini koruyacak.
5. `python3 web/build.py` ile Xcode'un kullandığı `Dortnala/index.html` yeniden üretilecek.
6. Açılış, koşu animasyonu, sıçrama, hasar parlaması, üs görünümü ve offline açılış doğrulanacak.
