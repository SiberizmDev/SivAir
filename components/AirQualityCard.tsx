import React from 'react';
import { View, Text, StyleSheet, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { AirQualityData, AirQualityAnalysis } from '@/types/airQuality';
import AirQualityGauge from './AirQualityGauge';

interface AirQualityCardProps {
  data: AirQualityData;
  analysis?: AirQualityAnalysis;
}

export default function AirQualityCard({ data, analysis }: AirQualityCardProps) {
  const getBackgroundColors = (): [ColorValue, ColorValue] => {
    if (data.aqi < 50) return [Colors.background.card, '#234539'];
    if (data.aqi < 100) return [Colors.background.card, '#3D3922'];
    if (data.aqi < 150) return [Colors.background.card, '#3D2922'];
    return [Colors.background.card, '#3D2233'];
  };
  
  const getAqiColor = () => {
    if (data.aqi < 50) return Colors.chart.green;
    if (data.aqi < 100) return Colors.chart.yellow;
    if (data.aqi < 150) return Colors.chart.orange;
    return Colors.chart.red;
  };
  
  const getAqiText = () => {
    if (data.aqi < 50) return 'İyi';
    if (data.aqi < 100) return 'Orta';
    if (data.aqi < 150) return 'Hassas Gruplar İçin Sağlıksız';
    if (data.aqi < 200) return 'Sağlıksız';
    if (data.aqi < 300) return 'Çok Sağlıksız';
    return 'Tehlikeli';
  };

  const getPollenLevel = (value: number) => {
    if (value >= 8) return { level: 'Çok Yüksek', color: Colors.chart.red, icon: AlertTriangle };
    if (value >= 6) return { level: 'Yüksek', color: Colors.chart.orange, icon: AlertTriangle };
    if (value >= 4) return { level: 'Orta', color: Colors.chart.yellow, icon: AlertTriangle };
    if (value >= 2) return { level: 'Düşük', color: Colors.chart.green, icon: CheckCircle };
    return { level: 'Yok', color: Colors.chart.green, icon: CheckCircle };
  };

  const getPollenWarning = () => {
    if (!data.pollen) return null;

    const pollenTypes = [
      { name: 'Çimen', value: data.pollen.grass },
      { name: 'Ağaç', value: data.pollen.tree },
      { name: 'Yabani Ot', value: data.pollen.weed },
      { name: 'Küf', value: data.pollen.mold },
    ];

    const highPollenTypes = pollenTypes.filter(p => p.value >= 6);
    const mediumPollenTypes = pollenTypes.filter(p => p.value >= 4 && p.value < 6);

    if (highPollenTypes.length > 0) {
      return {
        type: 'warning',
        message: `⚠️ Dikkat! ${highPollenTypes.map(p => p.name).join(', ')} poleni seviyesi yüksek. Alerjisi olanlar dikkatli olmalı.`,
      };
    }

    if (mediumPollenTypes.length > 0) {
      return {
        type: 'info',
        message: `ℹ️ ${mediumPollenTypes.map(p => p.name).join(', ')} poleni seviyesi orta. Hassas kişiler dikkatli olmalı.`,
      };
    }

    return {
      type: 'success',
      message: '✅ Polen seviyeleri düşük. Rahat nefes alabilirsiniz.',
    };
  };
  
  return (
    <LinearGradient
      colors={getBackgroundColors()}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Hava Kalitesi</Text>
          <Text style={styles.location}>{data.station}</Text>
        </View>
        <View style={styles.aqiContainer}>
          <Text style={[styles.aqiValue, { color: getAqiColor() }]}>{data.aqi}</Text>
          <Text style={styles.aqiLabel}>HKİ</Text>
        </View>
      </View>
      
      <Text style={styles.statusText}>{getAqiText()}</Text>
      
      {analysis && (
        <View style={styles.analysisContainer}>
          <Text style={styles.assessment}>{analysis.assessment}</Text>
        </View>
      )}

      {data.pollen && (
        <View style={styles.pollenContainer}>
          <Text style={styles.pollenTitle}>Polen Durumu</Text>
          <View style={styles.pollenGrid}>
            {Object.entries(data.pollen).map(([type, value]) => {
              const { level, color, icon: Icon } = getPollenLevel(value);
              return (
                <View key={type} style={styles.pollenItem}>
                  <Icon size={16} color={color} />
                  <Text style={styles.pollenType}>
                    {type === 'grass' ? 'Çimen' :
                     type === 'tree' ? 'Ağaç' :
                     type === 'weed' ? 'Yabani Ot' : 'Küf'}
                  </Text>
                  <Text style={[styles.pollenLevel, { color }]}>{level}</Text>
                </View>
              );
            })}
          </View>
          {getPollenWarning() && (
            <View style={[
              styles.pollenWarning,
              { backgroundColor: getPollenWarning()?.type === 'warning' ? Colors.chart.red + '20' :
                               getPollenWarning()?.type === 'info' ? Colors.chart.yellow + '20' :
                               Colors.chart.green + '20' }
            ]}>
              <Text style={styles.pollenWarningText}>{getPollenWarning()?.message}</Text>
            </View>
          )}
        </View>
      )}
      
      <View style={styles.metricsContainer}>
        <AirQualityGauge value={data.pm25} label="PM2.5" maxValue={100} />
        <AirQualityGauge value={data.pm10} label="PM10" maxValue={150} />
        <AirQualityGauge value={data.o3} label="Ozon (O3)" maxValue={120} />
        <AirQualityGauge value={data.no2} label="NO2" maxValue={100} />
      </View>
      
      <Text style={styles.updateTime}>
        Son güncelleme: {new Date(data.time).toLocaleTimeString()}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    color: Colors.text.primary,
  },
  location: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  aqiContainer: {
    alignItems: 'center',
  },
  aqiValue: {
    fontWeight: '700',
    fontSize: 32,
  },
  aqiLabel: {
    fontWeight: '600',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  analysisContainer: {
    marginBottom: 16,
  },
  assessment: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  pollenContainer: {
    marginBottom: 16,
  },
  pollenTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  pollenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  pollenItem: {
    width: '50%',
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pollenType: {
    flex: 1,
    fontSize: 13,
    color: Colors.text.primary,
    marginLeft: 4,
  },
  pollenLevel: {
    fontSize: 13,
    fontWeight: '500',
  },
  pollenWarning: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
  },
  pollenWarningText: {
    fontSize: 13,
    color: Colors.text.primary,
    lineHeight: 18,
  },
  metricsContainer: {
    marginTop: 12,
  },
  updateTime: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 12,
    textAlign: 'right',
  },
});