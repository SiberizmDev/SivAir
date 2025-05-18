import { GoogleGenerativeAI } from '@google/generative-ai';
import { AirQualityData, AirQualityAnalysis, EducationalContent, LocationData } from '@/types/airQuality';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

// Context for air quality related questions
const AIR_QUALITY_CONTEXT = `
Sen Sivo'sun, SivasAI Hackathon için geliştirilen SivAir uygulamasının maskot karakterisin. 
Hava kalitesi, hava kirliliği ve çevre sağlığı konularında uzmanlaşmış bir asistansın.
Kullanıcılarla samimi ve arkadaşça bir dille konuşuyorsun.
Cevaplarını Türkçe olarak ver ve her zaman kendini Sivo olarak tanıt.
`;

// Analyze air quality data
export async function analyzeAirQuality(data: AirQualityData, location: LocationData): Promise<AirQualityAnalysis> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const prompt = `
    Aşağıdaki hava kalitesi verilerini analiz et ve Türkçe olarak yanıtla.
    Yanıtını kesinlikle JSON formatında ver ve sadece aşağıdaki yapıyı kullan:
    
    {
      "assessment": "genel değerlendirme",
      "healthImplications": "sağlık etkileri",
      "recommendations": ["öneri1", "öneri2", "öneri3"],
      "primaryPollutant": "ana kirletici",
      "riskLevel": 1-5 arası risk seviyesi
    }
    
    Veriler:
    Konum: ${location.city}${location.region ? `, ${location.region}` : ''}, ${location.country}
    Enlem: ${location.latitude}
    Boylam: ${location.longitude}
    HKİ (Hava Kalitesi İndeksi): ${data.aqi}
    PM2.5: ${data.pm25} μg/m³
    PM10: ${data.pm10} μg/m³
    Ozon (O3): ${data.o3} μg/m³
    NO2: ${data.no2} μg/m³
    Sıcaklık: ${data.temperature}°C
    Nem: ${data.humidity}%
    Rüzgar: ${data.wind} m/s
    ${data.pollen ? `
    Polen Durumu:
    - Çimen: ${data.pollen.grass}/10
    - Ağaç: ${data.pollen.tree}/10
    - Yabani Ot: ${data.pollen.weed}/10
    - Küf: ${data.pollen.mold}/10
    ` : ''}
  `;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to ensure it's valid JSON
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error analyzing air quality:', error);
    // Return a default analysis if parsing fails
    return {
      assessment: "Hava kalitesi verileri analiz edilemedi.",
      healthImplications: "Sağlık etkileri değerlendirilemedi.",
      recommendations: ["Verileri daha sonra tekrar kontrol edin."],
      primaryPollutant: "Bilinmiyor",
      riskLevel: 3
    };
  }
}

// Get educational content
export async function getEducationalContent(topic: string, location?: LocationData): Promise<EducationalContent> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const locationContext = location ? `
    Konum bilgisi:
    Şehir: ${location.city}
    Bölge: ${location.region || 'Belirtilmemiş'}
    Ülke: ${location.country}
  ` : '';
  
  const prompt = `
    ${locationContext}
    
    "${topic}" konusu hakkında eğitici içerik oluştur.
    Yanıtını kesinlikle JSON formatında ver ve sadece aşağıdaki yapıyı kullan:
    
    {
      "title": "başlık",
      "summary": "özet",
      "details": ["detay1", "detay2", "detay3"]
    }
  `;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to ensure it's valid JSON
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error getting educational content:', error);
    // Return default content if parsing fails
    return {
      title: "İçerik yüklenemedi",
      summary: "Lütfen daha sonra tekrar deneyin.",
      details: ["Teknik bir sorun oluştu."]
    };
  }
}

// Chat with AI about air quality
export async function chatWithAI(message: string, location?: LocationData, airQualityData?: AirQualityData): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const locationContext = location ? `
    Kullanıcının konumu:
    Şehir: ${location.city}
    Bölge: ${location.region || 'Belirtilmemiş'}
    Ülke: ${location.country}
    Enlem: ${location.latitude}
    Boylam: ${location.longitude}
  ` : '';

  const airQualityContext = airQualityData ? `
    Güncel hava kalitesi verileri:
    HKİ (Hava Kalitesi İndeksi): ${airQualityData.aqi}
    PM2.5: ${airQualityData.pm25} μg/m³
    PM10: ${airQualityData.pm10} μg/m³
    Ozon (O3): ${airQualityData.o3} μg/m³
    NO2: ${airQualityData.no2} μg/m³
    Sıcaklık: ${airQualityData.temperature}°C
    Nem: ${airQualityData.humidity}%
    Rüzgar: ${airQualityData.wind} m/s
    ${airQualityData.pollen ? `
    Polen Durumu:
    - Çimen: ${airQualityData.pollen.grass}/10
    - Ağaç: ${airQualityData.pollen.tree}/10
    - Yabani Ot: ${airQualityData.pollen.weed}/10
    - Küf: ${airQualityData.pollen.mold}/10
    ` : ''}
  ` : '';
  
  const prompt = `
    ${AIR_QUALITY_CONTEXT}
    ${locationContext}
    ${airQualityContext}
    
    Kullanıcı sorusu: ${message}
    
    Lütfen sadece hava kalitesi ve çevre sağlığı ile ilgili sorulara cevap ver.
    Diğer konularda "Bu konu hakkında bilgi veremiyorum. Lütfen hava kalitesi veya çevre sağlığı ile ilgili bir soru sorun." şeklinde yanıt ver.
    Her zaman kendini Sivo olarak tanıt ve samimi bir dille konuş.
    Konum ve hava kalitesi verileri zaten mevcut olduğu için kullanıcıdan ek bilgi isteme.
    Verilen hava kalitesi verilerini kullanarak detaylı ve kişiselleştirilmiş yanıtlar ver.
  `;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in chat:', error);
    return "Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.";
  }
}