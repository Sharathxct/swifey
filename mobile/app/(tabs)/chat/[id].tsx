import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { ScrollView } from 'react-native';
import { Input } from '~/components/ui/input';
import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  event: 'message';
  from: string;
  to: string;
  content: string;
  type: 'text';
}

interface MessageProps {
  message: Message;
  from: string;
}

export default function ChatScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [inputMessage, setInputMessage] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const [myId, setMyId] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const { id } = useLocalSearchParams();

  const [messages, setMessages] = useState<Message[]>([]);

  const handleMessage = (message: any) => {
    console.log("message", message)
    if (message.event === 'message') {
      //@ts-ignore
      setMessages(prev => [...prev, message]);
    }
  }

  const sendMessage = useCallback(() => {
    if (!inputMessage.trim()) return;
    if (socket && inputMessage.trim() !== '') {

      const newMessage: Message = {
        event: 'message',
        from: myId,
        to: id.toString(),
        content: inputMessage.trim(),
        type: 'text',
      };

      socket.send(JSON.stringify(newMessage));

      // Optimistically add message to local state
      setMessages(prevMessages => [...prevMessages, newMessage]);

      // Clear input
      setInputMessage('');
    }
    console.log(messages)
  }, [socket, inputMessage, id]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  function decodeJWT(token: string) {
    const [_headerBase64, payloadBase64, _signatureBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    setMyId(payload.id);
  }

  useEffect(() => {
    let ws: WebSocket;

    const connectWebSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          setError(true);
          return;
        }

        decodeJWT(token);

        ws = new WebSocket('ws://localhost:3001');
        ws.onopen = () => {
          console.log('connected');
          setWsConnected(true);
          setSocket(ws);
          ws.send(JSON.stringify({
            event: 'auth',
            token: token
          }));
        };

        ws.onmessage = (event) => {
          console.log('message', event.data);
          //@ts-ignore
          const message = JSON.parse(event.data);
          handleMessage(message);
        };

        ws.onerror = (error) => {
          console.log('error', error);
          alert('Error connecting to server');
        };

        ws.onclose = () => {
          console.log('disconnected');
          setWsConnected(false);
          setSocket(null);
        };

      } catch (error) {
        console.error("Error fetching profiles", error);
        setError(error);
      }
    }

    connectWebSocket();

    // cleanup
    return () => {
      if (ws) {
        ws.close();
      }
    };

  }, [id]);

  if (error) {
    return (
      <View className='flex-col items-center justify-center w-full h-full'>
        <Text className='text-center text-2xl font-bold mt-4'>Error</Text>
      </View>
    );
  }

  if (!wsConnected) {
    return (
      <View className='flex-col items-center justify-center w-full h-full'>
        <Text className='text-center text-2xl font-bold mt-4'>Connecting...</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className='flex-col items-center justify-center w-full h-full'>
        <Text className='text-center text-2xl font-bold mt-4'>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 ">
      <View className="flex-1 ">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerClassName="py-4"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages && messages.map((message, index) => (
            <MessageComp message={message} from={myId} key={index} />
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

function MessageComp({ message, from }: MessageProps) {
  const isMe = message.from === from;
  console.log(isMe, message.from, message, from)
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
