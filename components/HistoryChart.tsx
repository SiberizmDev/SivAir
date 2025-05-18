import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Colors from '@/constants/Colors';
import { AirQualityHistoryItem } from '@/types/airQuality';

interface HistoryChartProps {
  data: AirQualityHistoryItem[];
  title?: string;
}

export default function HistoryChart({ data, title = 'Hava Kalitesi Geçmişi' }: HistoryChartProps) {
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
  };
  
  // Prepare data for chart
  const chartData = {
    labels: data.map(item => formatDate(item.date)),
    datasets: [
      {
        data: data.map(item => item.aqi),
        color: () => Colors.chart.purple,
        strokeWidth: 2,
      },
      {
        data: data.map(item => item.pm25),
        color: () => Colors.chart.red,
        strokeWidth: 2,
      },
    ],
    legend: ['HKİ', 'PM2.5'],
  };
  
  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: Colors.background.card,
    backgroundGradientTo: Colors.background.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(158, 158, 158, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
    },
    propsForLabels: {
      fontFamily: 'Roboto-Regular',
      fontSize: 10,
    },
  };
  
  // Calculate screen width considering margins
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.max(screenWidth - 32, data.length * 60);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withDots={true}
          withShadow={false}
          withInnerLines={false}
          withOuterLines={true}
          yAxisLabel=""
          yAxisSuffix=""
          formatYLabel={(value) => parseInt(value).toString()}
          segments={5}
        />
      </ScrollView>
      
      <View style={styles.legendContainer}>
        {chartData.legend.map((label, index) => (
          <View key={index} style={styles.legendItem}>
            <View 
              style={[
                styles.legendColor, 
                { backgroundColor: index === 0 ? Colors.chart.purple : Colors.chart.red }
              ]}
            />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
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
  chart: {
    borderRadius: 16,
    paddingRight: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
});