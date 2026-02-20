import { useCallback, useEffect, useState } from 'react';
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

const Chat = ({ route, navigation }) => {
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

  const onSend = useCallback((newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  }, []);

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

  useEffect(() => {
    navigation.setOptions({ title: name });
    setMessages([
      {
        _id: 1,
        text: 'Hello Beautiful Soul, welcome to Plaudern!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'You have entered the chat',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, [name, navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
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
          <TouchableOpacity style={styles.sendButton} onPress={handleManualSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
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
