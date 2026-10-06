# PixelLab ilerleme raporu — 4 Ekim 2026

Bu çalışma sırasında:

- Yeşil kertenkele r1'in önceden başlatılan sıçraması tamamlanmış bulundu. Beş orijinal kare saklandı; üçüncü indeksli havadaki kare seçildi. Duruş, dört koşu karesi, sıçrama ve hasar parlaması oyuna bağlandı.
- Grax, MOKO ve BİP-0 için üç yeni şeffaf portre üretildi, 28×28 oyun ölçüsüne hazırlanıp oyuna bağlandı.
- Ahır için bir aday üretildi ve saklandı. İzometrik kamera açısı mevcut üs binalarına uymadığı için oyuna bağlanmadı.
- Bu turda dört yeni PixelLab üretimi başlatıldı; her birinin düğmesinde 1 generation yazıyordu (toplam gösterilen maliyet 4). Yeni karakter animasyonu üretilmedi; mevcut sonuç kullanıldı.
- Yıldız'ın daha önce bağlanan duruş/koşu/sıçrama seti korundu.

## Doğrulama

Web derlemesi ve JavaScript sözdizimi kontrolü başarılı. Son Xcode iOS Simulator derlemesi BUILD SUCCEEDED. Tarayıcıda açılış, yarış/sıçrama ve üs ekranı denendi; son üs kontrolünde hata yok. Fiziksel iPhone testi yapılmadı.

## Dosyalar

- Orijinaller: web/assets/pixellab/originals/
- Bağlı asset listesi: web/assets/pixellab/manifest.json
- Önce/sonra incelemesi: web/art-review.html (yerel HTTP sunucusu üzerinden açılır)
- Xcode'un kullandığı güncel oyun: Dortnala/index.html

## Sıradaki işler

Ahırı mevcut üs kamerasına uygun referansla yeniden üretmek, sağlam/hasarlı eşini hazırlamak; ardından diğer binalar ve rakipler. Rehberdeki 216 promptun tamamı üretilmedi. Rehberde r1 için yazan eski 'henüz bağlanmadı' durumu artık geçerli değil; bu rapor güncel durumu verir.

Kullanım sınırına yaklaşınca yeni üretimler kesildi. Başlangıçta 5 saatlik Codex hakkı %74, son rapor hazırlığı öncesinde %10 kalmıştı. Son canlı ölçüm sohbetin sonuç mesajında belirtilir.

# Güncelleme — 5 Ekim 2026

PixelLab galerisindeki 50 görsel (beyblade hariç) piksel piksel aynı olacak şekilde indirildi. Yeni üretim yapılmadı, abonelik hakkı harcanmadı.

- Bağlananlar: 11 portre, 5 yem, 4 nal, 4 silah, 5 hatıra, 5 ruh amblemi. Liste `web/assets/pixellab/manifest.json` içinde; galeri kimlikleri `originals/production-notes.json` içinde.
- Bağlanmayanlar: 8 izometrik bina ve 3 hasarlı eşi (`originals/buildings/`). Üs önden çizildiği için açıları uymuyor; ayrıca 44–56 piksele küçülünce detay kayboluyor. Önden (front view) yeniden üretilirse bağlanabilir.
- PixelLab karakterleri (at ve kertenkele setleri) zaten bağlı olanlarla aynı; değişiklik yok.

# Güncelleme — 5 Ekim 2026 (ikinci tur)

Bu turda kullanıcının onayıyla yeni üretim yapıldı.

- Zemin dokuları: 12 Pixen görseli (9 yüzey, 3 yeniden deneme). Oyunun paletine çevrilip ek yersiz hale getirildi. Kaynaklar `originals/env/`.
- Yarışçılar: 37 karakter, v3 modu (karakter başına 2) ile 4 karelik koşu ve 5 karelik sıçrama (her biri 1). Yanlış yöne bakan 14 karakter yeniden üretildi, 4'ü üçüncü kez. Kaynak zip dosyaları `originals/mounts/`; karakter kimlikleri `originals/production-notes.json` içinde.
- Binalar: Mevcut binayı başlangıç görseli olarak verme, düzenleme ve sıfırdan önden çizim yöntemleri denendi (8 üretim). Hiçbiri mevcut çizimlerden iyi değildi, bağlanmadı. Denemeler `originals/buildings_trials/`.

# Güncelleme — 6 Ekim 2026 (v6.0)

- Hikaye çizimleri Pixflux ile oyunun 32 renklik paletine kilitli üretildi: 7 prolog, 3 final, 7 şampiyon kartı, 13 seyir defteri çizimi (`assets/pixellab/story/`). Grax, Bölme ve Akyel sahneleri bir kez yeniden üretildi.
- 23 portre Pixen ile (9 eksik isimli rakip, 7 şampiyon, 6 yeni rakip ve Zib'in yenisi), 32'den 28'e en yakın piksel küçültmesiyle.
- Yeni gezegenler: 4 zemin dokusu, 8 yarışçı (v3 karakter ve koşu/sıçrama). Oniks'in koşusu bir kez yeniden istendi.
