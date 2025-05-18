import Constants from 'expo-constants';
import { AirQualityData } from '@/types/airQuality';

const API_KEY = Constants.expoConfig?.extra?.airQualityApiKey || process.env.EXPO_PUBLIC_AIR_QUALITY_API_KEY;
const BASE_URL = 'https://api.waqi.info';

export async function getAirQualityByGeo(latitude: number, longitude: number): Promise<AirQualityData> {
  try {
    const response = await fetch(
      `${BASE_URL}/feed/geo:${latitude};${longitude}/?token=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch air quality data: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error('Invalid response from air quality API');
    }
    
    // Extract and format the relevant data
    return {
      aqi: data.data.aqi,
      station: data.data.city?.name || 'Unknown location',
      time: data.data.time?.iso || new Date().toISOString(),
      pm25: data.data.iaqi?.pm25?.v || 0,
      pm10: data.data.iaqi?.pm10?.v || 0,
      o3: data.data.iaqi?.o3?.v || 0,
      no2: data.data.iaqi?.no2?.v || 0,
      temperature: data.data.iaqi?.t?.v || 0,
      humidity: data.data.iaqi?.h?.v || 0,
      wind: data.data.iaqi?.w?.v || 0,
      pollen: {
        grass: Math.floor(Math.random() * 10), // 0-9 arası rastgele değer
        tree: Math.floor(Math.random() * 10),
        weed: Math.floor(Math.random() * 10),
        mold: Math.floor(Math.random() * 10)
      }
    };
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    
    // Return mock data if API fails
    return getMockAirQualityData();
  }
}

export async function getHistoricalData(stationId: string, days: number = 7): Promise<any> {
  try {
    // This endpoint might require a different API or approach
    // For now, we'll return mock historical data
    return getMockHistoricalData(days);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return getMockHistoricalData(days);
  }
}

// Mock data functions
function getMockAirQualityData(): AirQualityData {
  return {
    aqi: 75,
    station: 'Demo Location',
    time: new Date().toISOString(),
    pm25: 25.5,
    pm10: 48.2,
    o3: 42.1,
    no2: 15.3,
    temperature: 24.5,
    humidity: 55,
    wind: 3.2,
    pollen: {
      grass: Math.floor(Math.random() * 10),
      tree: Math.floor(Math.random() * 10),
      weed: Math.floor(Math.random() * 10),
      mold: Math.floor(Math.random() * 10)
    }
  };
}

function getMockHistoricalData(days: number) {
  const data = [];
  const endDate = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(endDate.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      aqi: Math.floor(50 + Math.random() * 50),
      pm25: Math.floor(15 + Math.random() * 20),
      pm10: Math.floor(30 + Math.random() * 30),
    });
  }
  
  return data;
}