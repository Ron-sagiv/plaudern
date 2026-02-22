import { useEffect, useState } from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'rgb(74, 82, 82)',
          },
          left: {
            backgroundColor: 'rgb(221, 247, 245)',
          },
        }}
      />
    );
  };

  const onSend = (newMessages) => {
    addDoc(collection(db, 'messages'), newMessages[0]);
  };

  const handleManualSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    onSend([
      {
        _id: Date.now(),
        text: trimmed,
        createdAt: new Date(),
        user: { _id: 1, name: name || 'You' },
      },
    ]);
    setInputText('');
  };

  let unsubMessages;

  useEffect(() => {
    navigation.setOptions({ title: name });
    if (isConnected) {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubMessages = onSnapshot(q, async (docs) => {
        let newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem('messages');
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
      }
    } catch (error) {
      console.error('Messages failed to load from AsyncStorage', error);
    }
  };

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.error('Failed to cache messages', error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      accessible={false}
      importantForAccessibility="no"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 86 : 0}
      >
        <View style={styles.messagesWrap}>
          <GiftedChat
            messages={messages}
            user={{ _id: 1 }}
            renderBubble={renderBubble}
            renderInputToolbar={() => null}
            minInputToolbarHeight={0}
            listViewProps={{ keyboardShouldPersistTaps: 'handled' }}
          />
        </View>

        {isConnected && (
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="rgba(117,112,131,0.6)"
              returnKeyType="send"
              onSubmitEditing={handleManualSend}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleManualSend}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  messagesWrap: { flex: 1 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 14,
    color: '#111',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Chat;
