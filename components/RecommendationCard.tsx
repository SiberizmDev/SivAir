import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shield, CircleAlert as AlertCircle, ThumbsUp } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { AirQualityAnalysis } from '@/types/airQuality';

interface RecommendationCardProps {
  analysis: AirQualityAnalysis;
}

export default function RecommendationCard({ analysis }: RecommendationCardProps) {
  // Icon based on risk level
  const getIcon = () => {
    if (analysis.riskLevel <= 2) {
      return <ThumbsUp size={24} color={Colors.chart.green} />;
    } else if (analysis.riskLevel <= 3) {
      return <AlertCircle size={24} color={Colors.chart.yellow} />;
    } else {
      return <Shield size={24} color={Colors.chart.red} />;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yapay Zeka Önerileri</Text>
        {getIcon()}
      </View>
      
      <Text style={styles.healthText}>{analysis.healthImplications}</Text>
      
      <View style={styles.recommendationsContainer}>
        {analysis.recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>{index + 1}</Text>
            </View>
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        ))}
      </View>
      
      {analysis.primaryPollutant && (
        <View style={styles.pollutantContainer}>
          <Text style={styles.pollutantLabel}>Ana Kirletici:</Text>
          <Text style={styles.pollutantValue}>{analysis.primaryPollutant}</Text>
        </View>
      )}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  healthText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 16,
    lineHeight: 20,
  },
  recommendationsContainer: {
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  bullet: {
    backgroundColor: Colors.accent,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  bulletText: {
    color: Colors.primary,
    fontFamily: 'Roboto-Bold',
    fontSize: 12,
  },
  recommendationText: {
    flex: 1,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  pollutantContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    alignItems: 'center',
  },
  pollutantLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginRight: 8,
  },
  pollutantValue: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: Colors.accent,
  },
});