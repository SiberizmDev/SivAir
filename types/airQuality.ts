export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  temperature?: number;
  humidity?: number;
  wind?: number;
  station: string;
  time: string;
  pollen?: {
    grass: number;
    tree: number;
    weed: number;
    mold: number;
  };
}

export interface AirQualityAnalysis {
  assessment: string;
  healthImplications: string;
  recommendations: string[];
  primaryPollutant: string;
  riskLevel: number;
}

export interface EducationalContent {
  title: string;
  summary: string;
  details: string[];
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  region?: string;
  country: string;
}

export interface AirQualityHistoryItem {
  date: string;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
}