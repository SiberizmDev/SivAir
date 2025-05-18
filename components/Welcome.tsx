import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface WelcomeProps {
  onClose?: () => void;
}

const Welcome = ({ onClose }: WelcomeProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color={Colors.text.primary} />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Image
            source={require('../assets/images/sivo.png')}
            style={styles.image}
            resizeMode="contain"
          />
          
          <Text style={styles.title}>Merhaba! Ben Sivo 👋</Text>
          
          <Text style={styles.description}>
            SivasAI Hackathon için geliştirilen SivAir'a hazırlanmış maskot karekterim. Uygulamayı tanıtmak amacıyla size bu yolculukta rehberlik edeceğim.
          </Text>
          
          <Text style={styles.description}>
            Bu uygulama ile:
          </Text>
          
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>• Anlık hava kalitesi bilgilerini</Text>
            <Text style={styles.featureItem}>• Detaylı hava durumu tahminlerini</Text>
            <Text style={styles.featureItem}>• Sağlık önerilerini</Text>
            <Text style={styles.featureItem}>• Geçmiş verileri</Text>
          </View>
          
          <Text style={styles.description}>
            yapay zeka desteği ile kolayca takip edebilirsiniz. Ayrıca Gemini tabanlı olan Sivo ile dinamik önlem uyarıları alabilir, sohbet sayfası ile Sivo'ya soracağınız soruların cevabını hızlıca alabilirsiniz
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    color: Colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  featuresList: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  featureItem: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'left',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 1,
  },
});

export default Welcome; 