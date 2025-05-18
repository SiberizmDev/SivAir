import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useLocation from '@/hooks/useLocation';
import { getAirQualityByGeo } from '@/api/airQualityApi';
import { AirQualityData } from '@/types/airQuality';
import Colors from '@/constants/Colors';
import { MapPin } from 'lucide-react-native';

// Components
import Header from '@/components/Header';
import LoadingView from '@/components/LoadingView';
import AirQualityGauge from '@/components/AirQualityGauge';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  
  // Location state
  const { location, loading: locationLoading } = useLocation();
  
  // Air quality data state
  const [nearbyLocations, setNearbyLocations] = useState<{ location: string; data: AirQualityData }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Generate mock nearby locations
  const generateNearbyLocations = useCallback(async () => {
    if (!location) return;
    
    try {
      setLoading(true);
      
      // For a real app, you would use an API to get data for nearby locations
      // Here we'll create some mock data with slight variations from the user's location
      
      // Get base data for current location
      const baseData = await getAirQualityByGeo(location.latitude, location.longitude);
      
      // Generate mock data for "nearby" locations
      const mockLocations = [
        {
          name: 'Şehir Merkezi',
          lat: location.latitude + 0.015,
          lng: location.longitude + 0.02,
          variation: 1.15, // 15% higher
        },
        {
          name: 'Şehir Parkı',
          lat: location.latitude - 0.01,
          lng: location.longitude + 0.01,
          variation: 0.85, // 15% lower
        },
        {
          name: 'Sanayi Bölgesi',
          lat: location.latitude + 0.03,
          lng: location.longitude - 0.02,
          variation: 1.3, // 30% higher
        },
        {
          name: 'Banliyö Bölgesi',
          lat: location.latitude - 0.025,
          lng: location.longitude - 0.015,
          variation: 0.9, // 10% lower
        },
      ];
      
      // Create variations of the base data
      const locations = mockLocations.map(loc => {
        const variationData = { ...baseData };
        
        // Modify AQI and pollutant levels based on the variation factor
        variationData.aqi = Math.round(baseData.aqi * loc.variation);
        variationData.pm25 = +(baseData.pm25 * loc.variation).toFixed(1);
        variationData.pm10 = +(baseData.pm10 * loc.variation).toFixed(1);
        variationData.o3 = +(baseData.o3 * loc.variation).toFixed(1);
        variationData.station = `${loc.name}, ${location.city}`;
        
        return {
          location: loc.name,
          data: variationData,
        };
      });
      
      // Add current location to the top
      locations.unshift({
        location: 'Konumunuz',
        data: baseData,
      });
      
      setNearbyLocations(locations);
    } catch (error) {
      console.error('Error generating nearby locations:', error);
    } finally {
      setLoading(false);
    }
  }, [location]);
  
  // Load data when location is available
  useEffect(() => {
    if (location) {
      generateNearbyLocations();
    }
  }, [location, generateNearbyLocations]);
  
  // Show loading view
  if (locationLoading || !location || loading) {
    return <LoadingView message="Yakındaki hava kalitesi analiz ediliyor..." />;
  }
  
  // Get color based on AQI
  const getAqiColor = (aqi: number) => {
    if (aqi < 50) return Colors.chart.green;
    if (aqi < 100) return Colors.chart.yellow;
    if (aqi < 150) return Colors.chart.orange;
    return Colors.chart.red;
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header location={location} />
      
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Hava Kalitesi Haritası</Text>
        
        {/* In a real app, this would be a map with air quality overlays */}
        {/* For our example, we're just showing a placeholder */}
        
        <View style={styles.mapMarkers}>
          {nearbyLocations.slice(0, 3).map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.mapMarker,
                { 
                  top: 50 + (index * 70),
                  left: 50 + (index * 80),
                }
              ]}
            >
              <LinearGradient
                colors={[getAqiColor(item.data.aqi), Colors.background.primary]}
                style={styles.mapMarkerGradient}
              >
                <Text style={styles.markerAqi}>{item.data.aqi}</Text>
                <MapPin size={14} color={Colors.text.primary} />
              </LinearGradient>
            </View>
          ))}
        </View>
      </View>
      
      <Text style={styles.nearbyTitle}>Yakındaki Hava Kalitesi</Text>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        {nearbyLocations.map((item, index) => (
          <View key={index} style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Text style={styles.locationName}>{item.location}</Text>
              <Text 
                style={[
                  styles.locationAqi,
                  { color: getAqiColor(item.data.aqi) }
                ]}
              >
                {item.data.aqi} HKİ
              </Text>
            </View>
            
            <View style={styles.metricsContainer}>
              <View style={styles.metricColumn}>
                <AirQualityGauge value={item.data.pm25} label="PM2.5" maxValue={100} />
              </View>
              <View style={styles.metricColumn}>
                <AirQualityGauge value={item.data.pm10} label="PM10" maxValue={150} />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  mapPlaceholder: {
    height: 220,
    backgroundColor: Colors.background.secondary,
    margin: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  mapText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: Colors.text.secondary,
    position: 'absolute',
    top: 16,
    left: 16,
  },
  mapMarkers: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  mapMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  mapMarkerGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerAqi: {
    fontFamily: 'Roboto-Bold',
    fontSize: 12,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  nearbyTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  locationCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: Colors.text.primary,
  },
  locationAqi: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
  },
  metricColumn: {
    flex: 1,
  },
});