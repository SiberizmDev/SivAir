import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useLocation from '@/hooks/useLocation';
import { getHistoricalData } from '@/api/airQualityApi';
import { AirQualityHistoryItem } from '@/types/airQuality';
import Colors from '@/constants/Colors';

// Components
import Header from '@/components/Header';
import LoadingView from '@/components/LoadingView';
import HistoryChart from '@/components/HistoryChart';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  
  // Location state
  const { location, loading: locationLoading } = useLocation();
  
  // Stats state
  const [historyData, setHistoryData] = useState<AirQualityHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<number>(7); // Days
  
  // Load historical data
  const loadHistoricalData = useCallback(async () => {
    if (!location) return;
    
    try {
      setLoading(true);
      
      // In a real app, you'd use the station ID from the location
      // For our example, we'll use a mock function
      const histData = await getHistoricalData('demo-station', timeRange);
      
      setHistoryData(histData);
    } catch (error) {
      console.error('Error loading historical data:', error);
    } finally {
      setLoading(false);
    }
  }, [location, timeRange]);
  
  // Load data when location is available
  useEffect(() => {
    if (location) {
      loadHistoricalData();
    }
  }, [location, loadHistoricalData]);
  
  // Show loading view
  if (locationLoading || !location || loading) {
    return <LoadingView message="Geçmiş hava kalitesi verileri yükleniyor..." />;
  }
  
  // Calculate stats
  const calculateStats = () => {
    if (!historyData.length) return null;
    
    const aqiValues = historyData.map(item => item.aqi);
    const pm25Values = historyData.map(item => item.pm25);
    
    return {
      aqi: {
        avg: +(aqiValues.reduce((sum, val) => sum + val, 0) / aqiValues.length).toFixed(1),
        max: Math.max(...aqiValues),
        min: Math.min(...aqiValues),
      },
      pm25: {
        avg: +(pm25Values.reduce((sum, val) => sum + val, 0) / pm25Values.length).toFixed(1),
        max: Math.max(...pm25Values),
        min: Math.min(...pm25Values),
      },
    };
  };
  
  const stats = calculateStats();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header location={location} />
      
      <View style={styles.timeRangeContainer}>
        <Text style={styles.timeRangeLabel}>Zaman Aralığı:</Text>
        <View style={styles.timeRangeButtons}>
          {[3, 7, 14, 30].map(days => (
            <TouchableOpacity
              key={days}
              style={[
                styles.timeRangeButton,
                timeRange === days && styles.timeRangeButtonActive
              ]}
              onPress={() => setTimeRange(days)}
            >
              <Text
                style={[
                  styles.timeRangeButtonText,
                  timeRange === days && styles.timeRangeButtonTextActive
                ]}
              >
                {days}g
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        <HistoryChart data={historyData} />
        
        {stats && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>İstatistiksel Özet</Text>
            
            <View style={styles.statSection}>
              <Text style={styles.statSectionTitle}>Hava Kalitesi İndeksi (HKİ)</Text>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.aqi.avg}</Text>
                  <Text style={styles.statLabel}>Ortalama</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.aqi.max}</Text>
                  <Text style={styles.statLabel}>Maksimum</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.aqi.min}</Text>
                  <Text style={styles.statLabel}>Minimum</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.statSection}>
              <Text style={styles.statSectionTitle}>PM2.5 (μg/m³)</Text>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.pm25.avg}</Text>
                  <Text style={styles.statLabel}>Ortalama</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.pm25.max}</Text>
                  <Text style={styles.statLabel}>Maksimum</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.pm25.min}</Text>
                  <Text style={styles.statLabel}>Minimum</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.timeRangeInfo}>
              Son {timeRange} günlük verilere dayalı istatistikler
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  timeRangeLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginRight: 12,
  },
  timeRangeButtons: {
    flexDirection: 'row',
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: Colors.background.secondary,
  },
  timeRangeButtonActive: {
    backgroundColor: Colors.accent,
  },
  timeRangeButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  timeRangeButtonTextActive: {
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  statsCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  statsTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  statSection: {
    marginBottom: 16,
  },
  statSectionTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  timeRangeInfo: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});