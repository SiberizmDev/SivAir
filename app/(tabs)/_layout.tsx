import { Tabs } from 'expo-router';
import { StyleSheet, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { AirVent, Compass, ChartBar as BarChart3, MessageCircle, MapPin, Settings } from 'lucide-react-native';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.secondary,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Gösterge Paneli',
          tabBarIcon: ({ color, size }) => <AirVent size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Asistan',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Harita',
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'İstatistikler',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.primary,
    borderTopWidth: 0,
    elevation: 0,
    paddingTop: 6,
  },
  tabLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
  },
});