import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Clock, 
  Globe, 
  Shield,
  ChevronRight,
  Info,
  User
} from 'lucide-react-native';
import { getEducationalContent } from '@/api/geminiApi';
import Colors from '@/constants/Colors';
import { EducationalContent } from '@/types/airQuality';

export default function SettingsScreen() {
  // Settings state
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [dailyUpdates, setDailyUpdates] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [useMetric, setUseMetric] = useState<boolean>(true);
  const [educationalContent, setEducationalContent] = useState<EducationalContent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Handle educational content request
  const handleEducationalRequest = async (topic: string) => {
    try {
      setLoading(true);
      const content = await getEducationalContent(topic);
      setEducationalContent(content);
      
      // In a real app, you would show a modal or navigate to a detail screen
      // For this example, we'll just show an alert
      Alert.alert(
        content.title,
        content.summary + '\n\n' + content.details.join('\n\n'),
        [{ text: 'Kapat', style: 'cancel' }]
      );
    } catch (error) {
      console.error('Error getting educational content:', error);
      Alert.alert('Hata', 'Eğitim içeriği yüklenemedi');
    } finally {
      setLoading(false);
    }
  };
  
  // Setting groups
  const settingsGroups = [
    {
      title: 'Bildirimler',
      icon: <Bell size={20} color={Colors.text.primary} />,
      settings: [
        {
          title: 'Anlık Bildirimler',
          description: 'Kötü hava kalitesi için uyarılar alın',
          type: 'switch',
          value: pushNotifications,
          onValueChange: setPushNotifications,
        },
        {
          title: 'Günlük Hava Kalitesi Güncellemeleri',
          description: 'Her gün saat 08:00\'de özet alın',
          type: 'switch',
          value: dailyUpdates,
          onValueChange: setDailyUpdates,
        },
      ],
    },
    {
      title: 'Görünüm',
      icon: <Globe size={20} color={Colors.text.primary} />,
      settings: [
        {
          title: 'Karanlık Mod',
          description: 'Karanlık temayı kullan',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          title: 'Birimler',
          description: useMetric ? 'Metrik birimler kullanılıyor (°C, km)' : 'İmparatorluk birimleri kullanılıyor (°F, mi)',
          type: 'switch',
          value: useMetric,
          onValueChange: setUseMetric,
        },
      ],
    },
    {
      title: 'Hava Kalitesi Hakkında Bilgi Edin',
      icon: <Info size={20} color={Colors.text.primary} />,
      settings: [
        {
          title: 'HKİ\'yi Anlamak',
          description: 'Hava Kalitesi İndeksi ne anlama geliyor',
          type: 'action',
          onPress: () => handleEducationalRequest('Hava Kalitesi İndeksi'),
        },
        {
          title: 'PM2.5 ve Sağlık',
          description: 'İnce parçacıklar sağlığınızı nasıl etkiler',
          type: 'action',
          onPress: () => handleEducationalRequest('PM2.5 hava kirliliği ve sağlık etkileri'),
        },
        {
          title: 'Ozon Kirliliği',
          description: 'Yer seviyesi ozonun etkileri',
          type: 'action',
          onPress: () => handleEducationalRequest('Yer seviyesi ozon kirliliği ve sağlık etkileri'),
        },
      ],
    },
    {
      title: 'Hakkında',
      icon: <User size={20} color={Colors.text.primary} />,
      settings: [
        {
          title: 'Uygulama Versiyonu',
          description: '1.0.0',
          type: 'info',
        },
        {
          title: 'Gizlilik Politikası',
          description: 'Gizlilik politikamızı okuyun',
          type: 'action',
          onPress: () => Alert.alert('Gizlilik Politikası', 'Bu gizlilik politikasını açacak'),
        },
        {
          title: 'Kullanım Koşulları',
          description: 'Kullanım koşullarımızı okuyun',
          type: 'action',
          onPress: () => Alert.alert('Kullanım Koşulları', 'Bu kullanım koşullarını açacak'),
        },
      ],
    },
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SettingsIcon size={24} color={Colors.text.primary} />
        <Text style={styles.title}>Ayarlar</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <View style={styles.groupHeader}>
              {group.icon}
              <Text style={styles.groupTitle}>{group.title}</Text>
            </View>
            
            {group.settings.map((setting, settingIndex) => (
              <View 
                key={settingIndex} 
                style={[
                  styles.settingItem,
                  settingIndex === group.settings.length - 1 && styles.settingItemLast,
                ]}
              >
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                
                {setting.type === 'switch' && (
                  <Switch
                    value={setting.value}
                    onValueChange={setting.onValueChange}
                    trackColor={{ false: Colors.secondary, true: Colors.accent }}
                    thumbColor={Colors.text.primary}
                  />
                )}
                
                {setting.type === 'action' && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={setting.onPress}
                    disabled={loading}
                  >
                    <ChevronRight size={20} color={Colors.text.secondary} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    color: Colors.text.primary,
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  settingsGroup: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  groupTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    color: Colors.text.secondary,
  },
  actionButton: {
    padding: 8,
  },
});