# SivAir Nedir?

SivAir, SivasAI Hackathon 2025 yarışmasında geliştirilen yapay zeka destekli yerel hava indexi ölçme programıdır. Sadece indexi ölçmekle kalmayıp Yapay Zeka'nın yorumlarıyla özellikle alerjik ve bağışıklık sistemi düşük insanlar için önemli önerilerde bulunur.

Temeli Expo'ya dayanır. React Native ile çalışan Expo, node modülleriyle çalışır. Gemini 2.5 ve Air Quality API'larından güç alır

![[Pasted image 20250518020210.png]]

Ana sayfada aktif ölçüm gerçekleşirken yine yapay zeka destekli sohbet sayfası ile de çeşitli sorularınıza yanıt bulmanız mümkündür. Kısaca ana sayfayı açıklayayım;

- PM2.5: Solunabilir 2.5 mikrometre buyutunda olan parçacıkları ifade eder, birikerek sağlık sorunlarına neden olabilir
- PM10: Solunabilir 10 mikrometre buyutunda olan parçacıkları ifade eder, birikerek sağlık sorunlarına neden olabilir
- O3: Yani Ozon. Hava kirliliğini ifade eder. Yüksek konsantrasyonlarda solunumda solunum yollarını tahriş edebilir
- NO2: Azot Dioksit. Motorlu taşıtların egzozlarından ve sanayi faaliyetlerinden havaya salınan gazlardır. Yüksek seviyelerde solunum rahatsızlıklarına neden olabilmektedir

Devam etmeden önce:

# Tema İle Ne İlgisi Var?

Temamız 'Sivas'ın yerel sorunlarına yapay zeka destekli çözümler' olarak belirlenmişti. Bu temadan yola çıktığımız zaman Sivas'ın yerel sorunların arasında hava kalitesi de yer almakta. Özellikle merkeze indiğimiz zaman sanayi ortamlarının yerel yapılaşmanın içinde kaldığını görebiliriz. Hava kalitesini doğrudan etkileyen sanayi ortamları bazı rahatsızlığa sahip olan insanlar için risk taşıyabiliyor. Ayrıca alerjik reaksiyonlar gösterenler içinde 4 ayrı polen türü için ölçüm verileri de bulunuyor

Bu sorundan yola çıkarak da SivAir, yani Sivas Havası anlamına gelen Sivas Air uygulaması ortaya çıkmıştır.

# Devam Edelim

Sohbet sayfası demiştim. Basit bir modlama yöntemiyle Gemini yapısını uygulamama özel hale getirdim. Yapay zekanın adı ise Sivo olarak belirlendi. Aynı zamanda maskotun adı da Sivo olarak kaldı.

![[Pasted image 20250518020953.png]]

Sivo, konumuza erişerek sizlere daha detaylı yardım etmeyi hedefliyor. Örneğin Polen durumu nasıl? sorusu sorulduğunda ana sayfada olan önerilerden daha detaylı bilgi ve öneri verebiliyor. Çok bir muhabbeti yok aslında sor cevaplasın. Klasik dil modeli.

# Harita

Harita sayfası ise yakın mesafedeki ölçümleri sunuyor

![[Pasted image 20250518021245.png]]

Popüler alanları tespit ederek hava kalite değerini ona göre veriyor

# İstatistik

İstatistik sayfasına geldiğimiz geçmiş 30 güne kadar hava kalitesindeki farkları grafikde gösteriyor

![[Pasted image 20250518021401.png]]

3 gün, 1 hafta, 2 hafta ve 1 aylık seçim seçeneği sunuyor. Garfiğin altında ise özet bilgiler bulunuyor ve ortalama değerleri sunuyor. Ancak sadece 7 günlük verileri sağlıyor

# Ayarlar

![[Pasted image 20250518021605.png]]

Aslında bu sayfa build alınmış sürümde daha sağlıklı çalışıyor. Ancak build için yeterince zamanım olmadığından canlı demo ile göstermek zoundayım
