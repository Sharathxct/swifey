import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { ScrollView } from 'react-native';
import { Input } from '~/components/ui/input';
import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router';

interface Message {
  from: 'me' | 'you';
  to: 'me' | 'you';
  content: string;
  type: 'text';
}

interface MessageProps {
  message: Message;
}

function MessageComp({ message }: MessageProps) {
  const isMe = message.from === 'me';


  return (
    <View className={`flex-row ${isMe ? 'justify-end' : 'justify-start'} my-1 px-4`}>
      <View
        className={`${isMe ? 'bg-blue-500' : 'bg-gray-200'
          } px-4 py-2 rounded-2xl max-w-[80%]`}
      >
        <Text
          className={`${isMe ? 'text-white' : 'text-gray-800'
            } text-sm`}
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [inputMessage, setInputMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const { id } = useLocalSearchParams();
  const { gId } = useGlobalSearchParams();
  console.log("id", id)
  console.log("gId", gId)
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'me',
      to: 'you',
      content: 'Hello',
      type: 'text',
    },
    {
      from: 'you',
      to: 'me',
      content: 'Hi there! How are you?',
      type: 'text',
    },
    {
      from: 'me',
      to: 'you',
      content: 'Im doing great, thanks for asking!',
      type: 'text',
    },
    {
      from: 'you',
      to: 'me',
      content: id.toString(),
      type: 'text',
    }
  ]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      from: 'me',
      to: 'you',
      content: inputMessage.trim(),
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    setTimeout(() => {
      const response: Message = {
        from: 'you',
        to: 'me',
        content: 'Thanks for your message!',
        type: 'text',
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View className="flex-1 ">
      <View className="flex-1 ">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerClassName="py-4"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message, index) => (
            <MessageComp message={message} key={index} />
          ))}
        </ScrollView>
      </View>

      <View className="flex-row items-center p-2  border-gray-200">
        <Input
          value={inputMessage}
          onChangeText={setInputMessage}
          className="flex-1 h-10 mr-2 rounded-full border-gray-200"
          placeholder="Type your message"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="w-10 h-10 items-center justify-center rounded-full bg-blue-500"
        >
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
