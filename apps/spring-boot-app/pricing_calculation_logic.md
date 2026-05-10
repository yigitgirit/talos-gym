# Talos Gym Fiyatlandırma Motoru (Pricing Engine) Mantığı

Bu doküman, `PricingEngine` sınıfı içerisinde yer alan ve sistemdeki abonelik paketlerinin (Plan) fiyatlarını dinamik olarak hesaplayan iş kurallarını (business logic) açıklamaktadır.

Talos Gym uygulamasında fiyatlandırma, esnek ve kural tabanlı bir mimariye oturtulmuştur. Sabit fiyatlar yerine, tek bir "Taban Fiyat" (Base Price) üzerinden farklı abonelik tiplerine (Aylık, Yıllık Peşin, Yıllık Taksitli vb.) göre dinamik fiyat seçenekleri üretilir.

## ⚙️ Hesaplama Akışı

Fiyat hesaplaması, `calculatePaymentOptions(Offer offer)` metodu üzerinden tetiklenir ve sırasıyla aşağıdaki adımlardan geçer:

### Adım 1: Konfigürasyonların Çekilmesi
Seçilen teklife (Offer) bağlı olan paketin (Plan), veritabanında tanımlanmış tüm ödeme kuralları (`PlanSubscriptionConfig`) çekilir. Her bir kural, farklı bir abonelik modelini temsil eder (Örn: Taahhütsüz Aylık, 12 Ay Taahhütlü, Yıllık Peşin).

### Adım 2: Taban Fiyatın Alınması
Teklifte yer alan `basePrice` (Örn: 1000 TL), hesaplamanın başlangıç noktası olarak kabul edilir.

### Adım 3: Çarpan (Multiplier) Uygulaması
Taban fiyat, ilgili konfigürasyonun çarpanı ile çarpılır.
> **Örnek:** Aylık taahhütsüz paketlerde risk daha yüksek olduğu için çarpan `1.2` olabilir. Bu durumda 1000 TL'lik taban fiyat, bu kural için 1200 TL olarak güncellenir.
```java
BigDecimal multipliedPrice = basePrice.multiply(config.getMultiplier());
```

### Adım 4: Ham Toplam Fiyatın Bulunması
Çarpan uygulanmış fiyat, aboneliğin süresiyle (ay bazında) çarpılarak indirimsiz toplam fiyat bulunur.
> **Örnek:** Yıllık bir paket için `intervalMonths` 12'dir. 1000 TL x 12 = 12.000 TL ham fiyat elde edilir.
```java
BigDecimal rawTotalPrice = multipliedPrice.multiply(BigDecimal.valueOf(config.getSubscriptionType().getIntervalMonths()));
```

### Adım 5: İndirim (Discount) Uygulaması
Eğer konfigürasyonda bir indirim oranı (`discountRate`) tanımlanmışsa (sıfırdan büyükse), ham toplam fiyat üzerinden bu oranda indirim uygulanır.
> **Örnek:** Yıllık peşin ödemelerde `%15` (0.15) indirim tanımlanmışsa, 12.000 TL'nin %15'i (1800 TL) düşülür ve nihai toplam fiyat **10.200 TL** olur.
```java
BigDecimal discountAmount = rawTotalPrice.multiply(config.getDiscountRate());
totalPrice = rawTotalPrice.subtract(discountAmount);
```

### Adım 6: Taksit ve Aylık Görünüm Hesaplaması
Kullanıcılara "Aylık şu kadara geliyor" diyebilmek için nihai toplam fiyat bölünür. Bölme işlemi her zaman `RoundingMode.HALF_UP` (yakın olana yuvarlama) ile yapılır.
- **Taksitli Seçenek:** Eğer konfigürasyonda taksit tanımlıysa (`installments > 0`), toplam fiyat taksit sayısına bölünür.
- **Peşin Seçenek:** Taksit yoksa (peşin ödeme), toplam fiyat aboneliğin ay sayısına bölünerek "Aylık maliyet" olarak gösterilir.

### Adım 7: Pazarlama ve Açıklama Metinlerinin Üretilmesi
Frontend'de kullanıcıya sunulacak açıklayıcı rozetler/metinler dinamik olarak oluşturulur:
- `ANNUAL_PREPAID` (İndirimli): *"%X Avantajlı Peşin Ödeme"*
- `MONTHLY`: *"Taahhütsüz, İstediğin Zaman İptal Et"*
- Diğer (Standart Taahhütlü): *"12 Ay Sözünüze Sabit Fiyat"*

---

## 📊 Örnek Senaryo: "Pro Paket"

**Girdi:**
- Taban Fiyat (Base Price): `1000 TL`

**Hesaplanan Seçenekler:**

| Abonelik Tipi | Çarpan (Multiplier) | İndirim Oranı | Taksit | Süre (Ay) | Toplam Fiyat | Aylık Görünüm | Frontend Açıklaması |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Aylık Taahhütsüz** | 1.2 | Yok | Yok | 1 | **1200 TL** | 1200 TL | *Taahhütsüz, İstediğin Zaman İptal Et* |
| **12 Ay Taahhütlü** | 1.0 | Yok | 12 | 12 | **12.000 TL** | 1000 TL | *12 Ay Sözünüze Sabit Fiyat* |
| **Yıllık Peşin** | 1.0 | %15 (0.15) | Yok | 12 | **10.200 TL** | 850 TL | *%15 Avantajlı Peşin Ödeme* |

## 🛠 Mimari Notlar
- Tüm para ve küsurat hesaplamaları hassasiyet kaybını önlemek adına `BigDecimal` sınıfı kullanılarak yapılmaktadır.
- Tasarım, veri tabanına eklenecek yeni abonelik tiplerine (`PlanSubscriptionConfig`) kod değişikliği gerektirmeden anında uyum sağlayacak şekilde "Open/Closed Principle" (Gelişime açık, değişime kapalı) yapısında kurgulanmıştır.
