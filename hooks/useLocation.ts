import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { LocationData } from '@/types/airQuality';

export default function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        
        // Request permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Get current position
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        // Get location details using reverse geocoding
        const [locationDetails] = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        // Format the location data
        setLocation({
          city: locationDetails.city || 'Unknown city',
          region: locationDetails.region || '',
          country: locationDetails.country || '',
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Could not determine your location');
        
        // Set fallback location
        setLocation({
          city: 'San Francisco',
          region: 'CA',
          country: 'United States',
          latitude: 37.7749,
          longitude: -122.4194,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { location, errorMsg, loading };
}