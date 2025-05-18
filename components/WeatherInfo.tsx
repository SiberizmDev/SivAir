import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Thermometer, Droplets, Wind } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { AirQualityData } from '@/types/airQuality';

interface WeatherInfoProps {
  data: AirQualityData;
}

export default function WeatherInfo({ data }: WeatherInfoProps) {
  // Check if weather data is available
  const hasWeatherData = !!(
    data.temperature !== undefined && 
    data.humidity !== undefined &&
    data.wind !== undefined
  );
  
  if (!hasWeatherData) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hava Durumu</Text>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Thermometer size={20} color={Colors.chart.orange} />
          <Text style={styles.metricValue}>{data.temperature}°C</Text>
          <Text style={styles.metricLabel}>Sıcaklık</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Droplets size={20} color={Colors.chart.blue} />
          <Text style={styles.metricValue}>{data.humidity}%</Text>
          <Text style={styles.metricLabel}>Nem</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Wind size={20} color={Colors.text.secondary} />
          <Text style={styles.metricValue}>{data.wind} m/s</Text>
          <Text style={styles.metricLabel}>Rüzgar</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
});