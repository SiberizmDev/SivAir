import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Modal, TouchableOpacity, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useLocation from '@/hooks/useLocation';
import { getAirQualityByGeo } from '@/api/airQualityApi';
import { analyzeAirQuality } from '@/api/geminiApi';
import { AirQualityData, AirQualityAnalysis, LocationData } from '@/types/airQuality';
import Colors from '@/constants/Colors';

// Components
import Header from '@/components/Header';
import LoadingView from '@/components/LoadingView';
import AirQualityCard from '@/components/AirQualityCard';
import RecommendationCard from '@/components/RecommendationCard';
import WeatherInfo from '@/components/WeatherInfo';
import Welcome from '@/components/Welcome';

// Minimum time between updates (5 minutes)
const MIN_UPDATE_INTERVAL = 5 * 60 * 1000;

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [showWelcome, setShowWelcome] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Location state
  const { location, loading: locationLoading, errorMsg } = useLocation();
  
  // Air quality data state
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [analysis, setAnalysis] = useState<AirQualityAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  
  // Load air quality data
  const loadAirQuality = useCallback(async (loc: LocationData, force: boolean = false) => {
    const now = Date.now();
    
    // Check if enough time has passed since last update
    if (!force && now - lastUpdateTime < MIN_UPDATE_INTERVAL) {
      console.log('Skipping update - too soon since last update');
      return;
    }
    
    try {
      setLoading(true);
      
      // Get air quality data
      const aqData = await getAirQualityByGeo(loc.latitude, loc.longitude);
      setAirQualityData(aqData);
      
      // Get AI analysis
      const aiAnalysis = await analyzeAirQuality(aqData, loc);
      setAnalysis(aiAnalysis);
      
      // Update last update time
      setLastUpdateTime(now);
      
    } catch (error) {
      console.error('Error loading air quality data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [lastUpdateTime]);
  
  // Load data when location is available
  useEffect(() => {
    if (location) {
      loadAirQuality(location, true); // Force initial load
    }
  }, [location, loadAirQuality]);
  
  // Refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (location && !loading) {
        loadAirQuality(location);
      }
      
      return () => {};
    }, [location, loading, loadAirQuality])
  );
  
  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    if (location) {
      setRefreshing(true);
      loadAirQuality(location, true); // Force refresh on manual pull
    }
  }, [location, loadAirQuality]);

  useEffect(() => {
    if (showWelcome) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showWelcome]);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowWelcome(false);
    });
  };

  const renderContent = () => {
    if (locationLoading || !location || (loading && !airQualityData)) {
      return <LoadingView message="Konumunuz ve hava kalitesi verileri alınıyor..." />;
    }

    return (
      <>
        <Header 
          location={location}
          onRefresh={handleRefresh}
          loading={refreshing}
        />
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.accent]}
              tintColor={Colors.accent}
              progressBackgroundColor={Colors.background.secondary}
            />
          }
        >
          {airQualityData && (
            <>
              <AirQualityCard 
                data={airQualityData} 
                analysis={analysis || undefined} 
              />
              
              {analysis && (
                <RecommendationCard analysis={analysis} />
              )}
              
              <WeatherInfo data={airQualityData} />
            </>
          )}
        </ScrollView>
      </>
    );
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {renderContent()}

      <Modal
        visible={showWelcome}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWelcome(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Welcome onClose={() => setShowWelcome(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: Colors.background.primary,
    borderRadius: 20,
    overflow: 'hidden',
  },
});