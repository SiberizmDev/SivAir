import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Colors from '@/constants/Colors';

interface AirQualityGaugeProps {
  value: number;
  label: string;
  maxValue: number;
  colorScheme?: 'standard' | 'reversed';
}

export default function AirQualityGauge({ 
  value, 
  label, 
  maxValue, 
  colorScheme = 'standard' 
}: AirQualityGaugeProps) {
  // Calculate percentage with safety bounds
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);
  
  // Animated value
  const widthAnim = useSharedValue(0);
  
  // Update animation when value changes
  React.useEffect(() => {
    widthAnim.value = withTiming(percentage, { duration: 1000 });
  }, [percentage]);
  
  // Animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${widthAnim.value}%`,
    };
  });
  
  // Determine colors based on value and color scheme
  const getGradientColors = () => {
    if (colorScheme === 'reversed') {
      // For metrics where lower is better
      if (percentage < 30) return [Colors.chart.red, Colors.chart.orange];
      if (percentage < 60) return [Colors.chart.orange, Colors.chart.yellow];
      return [Colors.chart.yellow, Colors.chart.green];
    } else {
      // For metrics where higher is worse
      if (percentage < 30) return [Colors.chart.green, Colors.chart.yellow];
      if (percentage < 60) return [Colors.chart.yellow, Colors.chart.orange];
      if (percentage < 80) return [Colors.chart.orange, Colors.chart.red];
      return [Colors.chart.red, Colors.chart.purple];
    }
  };
  
  // Get quality text
  const getQualityText = () => {
    if (colorScheme === 'reversed') {
      if (percentage < 30) return 'Poor';
      if (percentage < 60) return 'Moderate';
      return 'Good';
    } else {
      if (percentage < 30) return 'Good';
      if (percentage < 60) return 'Moderate';
      if (percentage < 80) return 'Unhealthy';
      return 'Hazardous';
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value.toFixed(1)}</Text>
      </View>
      
      <View style={styles.gaugeContainer}>
        <Animated.View style={[styles.gaugeBar, animatedStyle]}>
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
      
      <Text style={styles.qualityText}>{getQualityText()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: Colors.text.primary,
  },
  value: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  gaugeContainer: {
    height: 6,
    backgroundColor: Colors.secondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  gaugeBar: {
    height: '100%',
  },
  gradient: {
    flex: 1,
    borderRadius: 3,
  },
  qualityText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
    textAlign: 'right',
  },
});