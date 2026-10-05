# Dörtnala – iOS prototipi (v5.6 · Galaksi Kupası)

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

## v5.0: Yeni gezegenler ve kalabalık pistler

- **İki yeni gezegen:** Mantar Ayı ile Galaksi Arenası arasında artık **Buz Halkası** ve **Kızıl Kum** var. Bir koşu 15 yerine 25 etap sürüyor. Her gezegenin kendi müziği, pist rengi ve kenar süsleri (buz kuleleri, kaktüsler, dev kaburgalar) var.
- **Yeni şampiyonlar:** *Buz Kraliçesi Niva* buz sarkıtı düşürür, buz duvarı örer ve **AYAZ** ile şerit değiştirmeyi yavaşlatır; hamle ya da mükemmel altın nota buzu kırar. *Kum Solucanı Zarg* kumdan çıkar (önce turuncu halka belirir), kum dalgası yollar, kum fırtınası çıkarır.
- **Daha çok uzaylı rakip:** isimli rakip 6'dan 15'e, genel uzaylı görünümü 8'den 16'ya çıktı; her gezegende üç isimli rakip ve kendi dosyaları var. Yeni tarzlar: **atıcı** (bir vuruş önce "!" ve kırmızı çizgi, sonra plazma) ve **zikzak** (şerit şerit kayar, önünü keser). Sprintte isimli rakipler de ritimle hamle yapar; her hamle bir vuruş önceden "!" ile görünür ve aynı anda yalnızca biri gelir. Omuz atan rakip de artık önce uyarır.
- **Kalabalık sprintler:** Buz Halkası'nda 6, Kızıl Kum ve Arena'da 7 rakip var; 8 yarışçılı sprintlerde ilk 4 geçer.
- **Adil pist:** göktaşları, variller, meteor ve solucan çıkışları, buz duvarları yerleşmeden önce kontrol edilir; her zaman ulaşılabilir bir geçit kalır. Zorluk bölge sırasına değil her gezegenin kendi kademesine bağlı.
- **Geri bildirim:** "İYİ · ERKEN/GEÇ" ve "ISKA · ERKEN/GEÇ" ipuçları, kırılan kombo, neye çarptığını söyleyen yazı ("GÖKTAŞI!", "BARİYER: SIÇRA!"), kaybedilen kalbin animasyonu ve bitişte tek bir sonuç kartı (sıra, hasar, mükemmel, en iyi kombo). Üst üste binen yazılar ayrılır, ekranda en fazla 7 yazı kalır.
- **Isınma turu:** hamle adımı, teknik ipucu ve sonunda kontrol özeti eklendi. Ayarlar'dan **Isınma turunu tekrar oyna** seçilebilir.
- **Üs ekranı:** her bina panelinde sıradaki seviyenin etkisi, bedeli, eksik kristal ve sonraki seviyeler yazıyor; haritada bina isimleri, hedef çubuğunda sayısal ilerleme (örn. 45/60) var.
- **iPhone:** küçük butonların dokunma alanı büyüdü, rakip isimleri ekrandan taşmıyor, metin çizimi önbelleğe alındı (kare süresi yaklaşık %25 kısaldı).
- Eski kayıtlar taşınır: v4 kaydındaki bölge ilerlemesi ve yarım kalan koşu yeni gezegen sırasına göre güncellenir.

## v5.1: Galaksi Ligi ve ritim ayarı

- **Ritim ayarı (kalibrasyon):** Ayarlar > *Ritmi ölç*. 16 tık sesine dokunursun, oyun gecikmeni ölçüp ritim gecikmesini otomatik ayarlar (Bluetooth kulaklıkta özellikle işe yarar). Dokunuşların erken/geç çizelgesinde görünür.
- **Galaksi Ligi:** her sprintte bitiriş sırasına göre (10, 7, 5, 4, 3, 2, 1) sen ve isimli uzaylılar puan toplar; düelloyu kazanan 8, kaybeden 3 puan alır. Kapı ekranındaki *LİG* düğmesi tabloyu açar. Her gezegen sonunda ligde 1. +6, 2. +3, 3. +1 kristal kazanır. Lider rakibin adının yanında yıldız durur; sonuç ekranı ligdeki sıranı gösterir.
- **Yeni yol olayları:** Buz Halkası'nda *Donmuş Kargo* ve *Kar Tanesi'nin Sırrı*, Kızıl Kum'da *Çölde Bir Vaha* ve *Tozkıran'ın Kervanı*, her yerde *BOP-1* (sonraki etaba kalkan). Gezegene özel olaylar yalnızca o gezegende çıkar.
- **Yeni görevler:** bir gezegeni lig lideri bitir, rakip atışlarından kaç, isimli rakiplerin önünde bitir.
- **Şampiyonlar konuşur:** her şampiyon yarışın başında laf atar.

## v5.2: Daha keyifli oynanış (oyun hissi araştırmasından)

- **Affedici kontroller:** engele değdiğin anda ya da en fazla ~5 kare (0,09 sn) sonra yukarı kaydırırsan sıçrama yine sayılır ("SON ANDA!", kıl payı ödülüyle). Bir engelin şeridinden çıkmaya temas öncesinde başladıysan kaçış sayılır.
- **Ritmik adım:** notaya dokunduğun parmakla kaydırırsan (şerit ya da sıçrama) hareketin de ritme oturur: kısa bir hız artışı ve "RİTMİK ADIM" yazısı. Yeni görev: ritmik adım at.
- **Ritim notu:** her etabın sonunda isabete göre S / A / B / C / D notu. S 15, A 8 sikke verir; sonuç ekranında koşunun notları listelenir. Yeni görev: S notuyla bitir.
- **Takip yardımı:** sprintte geçme sırasının dışındaysan nefes ve siper %50 daha hızlı dolar ("TAKİPTE"). Çok geride kalan rakipler biraz hızlanır, yarış kalabalık ve çekişmeli kalır.
- **Müzikle yaşayan dünya:** rakiplerin dörtnalı, sikkelerin zıplaması ve arenadaki seyirci vuruşa göre hareket eder.
- **Yardım önerisi:** ilk pistte üst üste 3 kez kaybedersen BİP geniş ritim penceresini, yardım modunu ve ritim ölçümünü önerir.

## v5.3: Hikaye (Hades ve Pyre'den ilham)

- **Koşu sonrası tepkiler:** istasyona dönünce dostların son koşuna göre konuşur: hangi şampiyona yenildiğin (ve ona karşı ipucu), hangi rakibe düelloyu kaybettiğin, yeni rövanşçın, alınan rövanş, lig liderliği, S notları, kaçırdığın kara delik, baskın ya da parkur... Aynı söz arka arkaya gelmez.
- **Şampiyonların hikayesi:** her şampiyon ilk yenilgisinden sonra konuşur (portreleriyle): kaçırılmış Prens Kristalo, sürüsü kafeste tutulan Gorm, kendini donduran Niva, kafasındaki çipi kırılan Zarg ve yirmi yıl önceki finalde Akyel'e hile yaptığını itiraf eden Voltrak.
- **Seyir Defteri büyüdü:** "Donmuş Taht", "Kumun Altındaki Çip", "Açık Kapı" ve "Herkes Evine" sayfaları; sayfalar hikaye sırasına göre numaralanır.
- **Kapı Açık (kurtuluş):** her kupa kazancı kapıyı bir kez daha açar. Düelloda dosyasını açtığın bir rakibi evine gönderirsin: veda eder, veda hediyesi bırakır (+12 kristal, +1 şeker) ve bir daha piste çıkmaz. Hakkını hemen kullanmazsan Seyir Defteri'ndeki rakip sayfasından da kullanabilirsin. Zafer Vitrini ve Seyir Defteri eve dönenleri gösterir; hepsi dönünce son sayfa açılır.
- **Akyel istasyonda:** kupadan sonra annen Akyel vitrinin yanında durur. Sohbet eder; şeker verirsen hatırası *Akyel'in Nalı* şampiyon yarışlarında farkın daha yavaş kapanmasını sağlar.

## v5.4: İç denetim sonrası

- **iOS:** müzik varsayılan olarak sessiz modda da çalar (ritim oyunu için gerekli); Ayarlar > *Sessiz modda da çal* ile kapatılabilir. iOS oyunun web sürecini kapatırsa oyun en güncel kayıtla yeniden yüklenir.
- **Ekonomi:** koşu sonunda ilk 500 sikke 10'a 1, fazlası 20'ye 1 kristal olur (pazarda harcamak daha değerli). Altı binaya pahalı 4. seviye geldi (3 şampiyon rozeti gerekir): Ahır (+1 puan, sevilen Yıldız 15 komboyla başlar), Görev Ekranı (ödüller iki kat), Cephanelik (atışlar +%60), Nal Atölyesi (yavaşlama -%20), Jokey Koğuşu (teknik %75 hızlı), Revir (3 kez kalk).
- **Galaksi Arenası:** sprintte 6 rakip, ilk 4 geçer (önceden 7 rakip).
- **Mola menüsünde ritim ölçümü:** kulaklık değişince koşudan çıkmadan yeniden ölç.
- Düzeltmeler: lig bonusu puan almadan verilmez, sıçrama toleransında şerit değiştirerek kaçış hasarsız, Türkçe ek hataları, hedef çubuğu kullanılmamış eve gönderme hakkını gösterir.

## v5.5: PixelLab görselleri bağlandı

- PixelLab galerisindeki hazır görseller piksel piksel indirildi; yeni üretim yapılmadı.
- 11 yeni portre: Deniz, Akyel, Ayşe, Kemal Usta, Tayfun ve rakipler Glorb, Kızıl Vuum, Gece Kanadı, Demir Kıskaç, Alev Kuyruk, Grax'ın Gölgesi (28×28).
- Eşya görselleri: yem deposunda yemler, nal atölyesinde nallar, cephanelikte silahlar, dost panelinde hatıralar (16×16).
- Ruh amblemleri: gözlemevinde (20×20), güç kartlarında (16×16) ve güç sahnesinin ortasında (32×32).
- İzometrik bina seti ve hasarlı eşleri `web/assets/pixellab/originals/buildings/` altında saklandı, üsse bağlanmadı: açı önden çizilen üsle uyuşmuyor, üs ölçüsüne küçülünce okunmuyor, 8 binanın yalnızca 3'ünün hasarlı hali var.
- Bir görsel yüklenemezse eski çizim kullanılır.

## v5.6: Yeni ortamlar ve yarışçılar (PixelLab)

- Her gezegenin pisti ve pist dışı alanı için zemin dokusu: çayırda toprak ve mor çimen, ormanda çakıl ve yosun, buzda kar ve çatlak buz, çölde rüzgâr izli kum ve kızıl kaya, arenada kil. Dokular oyunun paletine çevrildi, ek yeri görünmeden döşenir, yarışla kayar ve virajda pistle bükülür.
- 37 uzaylı yarışçının hepsine (isimsiz ve isimli rakipler, şampiyonlar, korsan binicileri) arkadan görünen 4 karelik koşu ve sıçrama seti. Voltrak robot at olduğu için kendi çizimiyle kaldı.
- Binalar için üç yöntem denendi; hiçbiri mevcut çizimlerden iyi olmadığı için bağlanmadı. Denemeler `originals/buildings_trials/` altında.

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
