import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  cancelAnimation,
  Easing
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';

interface LoadingViewProps {
  message?: string;
}

export default function LoadingView({ message = 'Hava kalitesi verileri yükleniyor...' }: LoadingViewProps) {
  // Animation values
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0.8);
  
  // Set up animations
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }), 
      -1, // Infinite repetitions
      false // No reverse
    );
    
    scale.value = withRepeat(
      withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, // Infinite repetitions
      true // With reverse
    );
    
    return () => {
      cancelAnimation(rotation);
      cancelAnimation(scale);
    };
  }, []);
  
  // Animated styles
  const ringStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateZ: `${rotation.value}deg` },
      ],
    };
  });
  
  const coreStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
      ],
    };
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <Animated.View style={[styles.ring, ringStyle]} />
        <Animated.View style={[styles.core, coreStyle]} />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
  loaderContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: 'transparent',
    borderTopColor: Colors.accent,
    position: 'absolute',
  },
  core: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accent,
  },
  message: {
    marginTop: 24,
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: Colors.text.primary,
  },
});