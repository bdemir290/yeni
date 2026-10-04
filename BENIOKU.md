# Dörtnala – iOS prototipi (v4.2 · Galaksi Kupası)

Hades tarzı, üslü roguelike at yarışı. Pixel art, dikey ekran, tek elle oynanır.

Sen Deniz'sin, dünyanın en ünlü jokeyi. Altın Nal Kupası'nı üçüncü kez kazandığın gece bir ışık seni ve atın Yıldız'ı kaçırıyor. Gözünü ARENA-9 uzay istasyonunda açıyorsun: Sunucu Grax'ın galaksi çapındaki yarış şovu, Galaksi Kupası. Kupayı kazanan evine dönecek, diyor Grax. Bugüne kadar kimse dönmedi.

Rakiplerinin hepsi uzaylı: kertenkele, böcek, vatoz, kuş ve canavar sırtında yarışan bir sürü ırk. Gezegen gezegen (Lumo Çayırı, Mantar Ayı, Galaksi Arenası) koşup şampiyonları yeneceksin: Prens Kristalo, Uluyan Gorm ve Grax'ın robot şampiyonu Voltrak. Yanında yalnız değilsin: istasyondaki Dünya Bölmesi'nde bakıcı robot BİP-0, tüccar MOKO ve senin gibi kaçırılmış jokeyler Ayşe, Kemal Usta ve Tayfun var; sana tekniklerini öğretiyorlar. Seyir Defteri'nde 7 sayfalık hikaye, kayıp jokey Akyel'in izini sürüyor.

## Simülatörde çalıştırma

1. `Dortnala.xcodeproj` dosyasını Xcode ile aç.
2. Üstteki cihaz listesinden bir iPhone simülatörü seç.
3. ▶ düğmesine bas (⌘R).

## Kendi iPhone'unda çalıştırma

1. Soldaki listede **Dortnala** projesine tıkla, TARGETS altında **Dortnala** → **Signing & Capabilities**.
2. **Team** kısmından Apple ID'nle oluşan kişisel takımını seç (ücretsiz hesap yeterli).
3. "Bundle Identifier" hatası çıkarsa kendine özel yap, örneğin `com.adin.dortnala`.
4. iPhone'u kabloyla bağla. Telefonda **Ayarlar > Gizlilik ve Güvenlik > Geliştirici Modu**'nu aç.
5. Cihazı Xcode'da seçip çalıştır. "Güvenilmeyen geliştirici" uyarısı çıkarsa **Ayarlar > Genel > VPN ve Cihaz Yönetimi**'nden kendi hesabına güven.

Ücretsiz Apple hesabıyla yüklenen uygulama 7 gün sonra Xcode'dan yeniden yüklenmek ister.

Eski sürümden kalan kayıt korunur: seviye, binalar, dostluklar ve yonca (artık KRİSTAL) taşınır. Yeni hikaye baştan izlensin diye giriş sahnesi ve Seyir Defteri sayfaları yeniden açılır; yarım kalmış eski bir koşu varsa o koşu silinir.

## Nasıl oynanır

| Hareket | Ne yapar |
| --- | --- |
| Sola / sağa kaydır | Şerit değiştir |
| Yukarı kaydır | Lazer bariyer, boru, jöle, diken mayın, şok dalgası ve tosbiğin üstünden sıçra |
| Aşağı kaydır ya da sol alttaki düğme | Hamle: nefes harcayıp kısa bir hız patlaması |
| Notalar ortadaki nalda buluşunca dokun | Ritim: kombo, hız, nefes; eyerdeki silah ateş eder |
| Altın nota (mükemmel vuruş) | Silahın özel atışı (üçlü ışın, şok fırtınası, zırh delen, dev plazma) |
| Çift nota | Vuruşta ve yarım vuruşta iki kez dokun |
| Uzun nota | Bas ve parmağını kaldırma: nefes toplar (basılıyken kaydırabilirsin) |
| Sağ alttaki jokey düğmesi | Gösterge dolunca öğrendiğin teknik (+ varsa ÇAĞRI gücü) |

Göktaşlarından, kristal kayalardan ve varillerden sıçranamaz; yanından dolaş ya da vur. Gözcüler uçar, sıçramak işe yaramaz.
Bilgisayarda: ok tuşları / WASD, boşluk = ritim (uzun notada basılı tut), aşağı ok = hamle, E = teknik, Esc = mola.

## v4'te neler değişti (yeni hikaye)

- **Uzay istasyonu üssü:** çiftliğin yerini ARENA-9'daki Dünya Bölmesi aldı. Kamara, Ahır Modülü, Görev Ekranı, Yem Deposu, Cephanelik, Nal Atölyesi, Gözlemevi (yıldız atları), Jokey Koğuşu, Revir, Sera, Moko'nun tezgahı ve Akyel heykeli; zemin plakaları, cam paneller ve pencereden görünen Dünya. Köpek Karabaş'ın yerinde uzay yavrusu Zıpzıp var.
- **Rakiplerin hepsi uzaylı:** 8 farklı uzaylı jokey ve 5 binek türü (kertenkele, böcek, vatoz, kuş, canavar); isimli rakipler Glorb, Kızıl Vuum, Gece Kanadı, Demir Kıskaç, Alev Kuyruk ve Grax'ın Gölgesi.
- **Yeni pistler:** Lumo Çayırı (mor çimen), Mantar Ayı (dev mantarlar, gri pist) ve gece ışıklı Galaksi Arenası. Hava durumları da uzaya taşındı: asit yağmuru, nebula sisi, güneş rüzgarı. Kovalamaca etabında peşindeki fırtına artık bir kara delik.
- **Yeni düşmanlar ve silahlar:** gözcü, tosbik, korsan, nişancı, kalkan robotu ve Korsan Kaptanı; ışık yayı, şok sapanı, ray arbaleti ve plazma topu.
- **Para birimi KRİSTAL:** yonca kristale döndü, Çiftlik Puanı artık Üs Puanı, günlük yem de Günlük Erzak.
- Oynanış (nota çeşitleri, nefes ve hamle, virajlar, temiz atlayış, Demirci Çekici, üç aşamalı şampiyonlar) v3'teki gibi duruyor.

## v4.1: Düello

- **Düello etabı:** isimli bir uzaylı rakiple bire bir yarış. İlk koşudan sonra, her pistte ilk etaptan sonra en fazla bir kez kapı olarak çıkar; rakip kapının içinde görünür. Kazanırsan kapı ödülüne ek kristal alırsın, kaybedersen 1 can gider.
- **Rakip ritimle oynar:** her hamlesini bir vuruş önce "!" ile gösterir. Kızıl Vuum ve Demir Kıskaç yanaşıp omuz atar, Gece Kanadı ve Alev Kuyruk önde kaçıp mayın ve jöle bırakır, Glorb ve Grax'ın Gölgesi son düzlükte atağa kalkar.
- **Taktik:** arkasında kalmak siper doldurur, atışların rakibi kısa süre sersemletir (sonra 3 saniye etkilenmez). Rakip çok geride kalırsa hızlanır, çok önde kaçarsa yavaşlar; yarış kafa kafaya biter.
- **Rakip dosyaları:** bir rakibi ilk kez yenince konuşur ve hikayesi Seyir Defteri'nin RAKİPLER sekmesine eklenir (6 dosya). Grax'ın Gölgesi'nin dosyası annen Akyel hakkında bir ipucu taşır.
- Yeni görev (düello kazan), Zafer Vitrini'nde düello sayacı ve eski hikayeden kalan birkaç yazı düzeltildi.

## v4.2: Şov dinamikleri

- **Reyting:** sol üstteki televizyonlu gösterge seyirciyi gösterir. Kıl payı geçiş, sollama, temiz atlayış, siper çıkışı, özel atış ve kombo onu doldurur; ritim tek başına yetmez, bir süre gösteri yapmazsan düşer. Dolunca Grax sponsor hediyesi atar (sikke yağmuru, kalkan, nefes tüpü ya da şifa). Uzun süre sıfırda kalırsan Grax "seyirci sıkıldı" deyip piste meteor yağdırır; düşecekleri yer kırmızı halkayla önceden belli olur.
- **Grax'ın spikerliği:** sollama, kıl payı, çarpma, son düzlük, düello ve rövanş anlarında üstte Grax'ın anlık yorumları çıkar.
- **Ritim kapısı:** pisti boydan boya kesen enerji kapısı. Yaklaşırken 2 nota vurursan ışıkları yanar ve açılır, içinden geçince hız ve nefes verir. Iskalarsan sayaç sıfırlanır; kapalı kapıdan geçersen yavaşlar ve kombonu kaybedersin (can gitmez).
- **Tarayıcı lazer:** her vuruşta bir şerit kayan, kenara gelince dönen lazer. Bir sonraki durağı soluk bir çerçeveyle gösterilir; üstünden sıçranmaz, müziği dinleyip doğru şeride geç.
- **Dörtnal modu:** her 30 komboda 5 saniye: hız, çift atış, engelleri kırarak geçme, iki kat sikke; müzik hızlanır, ekran kenarı yanar.
- **Moko'nun bahis masası:** bazı sprint ve düellolardan önce Moko oran verir (birincilik 2,5 kat, düello 2 kat, rövanş 3 kat). 15 ya da 40 sikke yatırabilir ya da pas geçebilirsin.
- **Rövanşçı rakip:** seni düelloda yenen ya da sprinti senden önce birinci bitiren isimli rakip rövanşçın olur. Bir sonraki karşılaşmada kırmızı taçla gelir, laf atar ve her yenilgide biraz daha hızlanır (en fazla 3 seviye). Onu geçersen rövanş alınır: kristal, seviye 2'den sonra bir de şeker. İstasyondaki hedef satırı ve Seyir Defteri'ndeki rakip dosyası kimin rövanşçın olduğunu gösterir.
- Yeni görevler (kapı aç, sponsor hediyesi, dörtnal modu, bahis, rövanş) ve Zafer Vitrini'nde rövanş ve dörtnal sayaçları.

## Proje yapısı

- `Dortnala/index.html` – oyunun tamamı (tek dosya, internet gerekmez).
- `Dortnala/GameView.swift` – tam ekran WKWebView kabuğu; titreşim (Taptic) ve kayıt köprüsü.
- `Dortnala/DortnalaApp.swift` – uygulama girişi, ses oturumu, ekranın kararmasını engelleme.
- `web/src/` – oyunun kaynak kodu (motor, pixel art, istasyon ve uzaylı çizimleri, sesler, veri, koşu, düşmanlar, üs, sahneler).

Kaynak kodu değiştirdikten sonra proje klasöründe şunu çalıştır, `Dortnala/index.html` otomatik güncellenir:

```
python3 web/build.py
```

## Hata ayıklama

iOS 16.4 ve üstünde Safari > Geliştirme menüsünden simülatördeki veya telefondaki oyuna bağlanıp konsolu görebilirsin.

## Kayıt

İlerleme cihazda (UserDefaults) saklanır. Sıfırlamak için istasyondayken sağ üstteki dişliye bas, sonra İlerlemeyi sıfırla.
