import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RefreshCcw } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { LocationData } from '@/types/airQuality';

interface HeaderProps {
  location: LocationData;
  onRefresh?: () => void;
  loading?: boolean;
}

export default function Header({ location, onRefresh, loading = false }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Hava Kalitesi</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>
            {location.city}, {location.region || location.country}
          </Text>
        </View>
      </View>
      
      {onRefresh && (
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={loading}
        >
          <RefreshCcw 
            size={20} 
            color={Colors.text.primary} 
            style={loading ? styles.rotating : undefined} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    color: Colors.text.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotating: {
    transform: [{ rotate: '45deg' }],
  },
});