import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { chatWithAI } from '@/api/geminiApi';
import useLocation from '@/hooks/useLocation';
import { getAirQualityByGeo } from '@/api/airQualityApi';
import { AirQualityData } from '@/types/airQuality';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { location } = useLocation();
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);

  // Load air quality data when location is available
  useEffect(() => {
    const loadAirQuality = async () => {
      if (location) {
        try {
          const data = await getAirQualityByGeo(location.latitude, location.longitude);
          setAirQualityData(data);
        } catch (error) {
          console.error('Error loading air quality data:', error);
        }
      }
    };

    loadAirQuality();
  }, [location]);

  // Add welcome message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: 'Merhaba! Ben Sivo 👋 SivasAI Hackathon için geliştirilen SivAir uygulamasının Gemini tabanlı yapay zeka asistanıyım. Hava kalitesi, hava kirliliği ve çevre sağlığı konularında sana yardımcı olmak için buradayım. Sorularını yanıtlamaktan mutluluk duyarım!',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatWithAI(inputText.trim(), location || undefined, airQualityData || undefined);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Hava Kalitesi Asistanı</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(message => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isUser ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
            <Text style={styles.timestamp}>
              {message.timestamp.toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.accent} />
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Hava kalitesi hakkında bir soru sorun..."
          placeholderTextColor={Colors.text.secondary}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Send
            size={20}
            color={inputText.trim() ? Colors.accent : Colors.text.secondary}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: Colors.accent,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: Colors.background.card,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  timestamp: {
    fontFamily: 'Roboto-Regular',
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    padding: 8,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.secondary,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 40,
    maxHeight: 100,
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: Colors.text.primary,
  },
  sendButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
}); 