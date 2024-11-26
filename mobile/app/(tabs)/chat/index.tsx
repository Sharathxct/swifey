import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useState } from 'react';
import { Avatar, AvatarImage } from '~/components/ui/avatar';
import { Link } from 'expo-router';
import { baseUrl } from '~/lib/constant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export default function ChatScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [profiles, setProfiles] = useState<any[]>([]);

  async function getChats() {
    setIsLoading(true);
    try {
      const res = await axios.get(baseUrl + '/api/profile/MyChats', {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log("response of connections", res.data);
      if (res.data.length > 0) {
        setProfiles(res.data);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching profiles", error);
      setError(true);
    }
    setIsLoading(false);
  }

  async function getToken() {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      setToken(token);
    } else {
      setError(true);
    }
  }

  useEffect(() => {
    async function setup() {
      await getToken();
      if (token) {
        await getChats();
      }
    }

    setup();
  }, [token]);

  if (isLoading) {
    return (
      <View className='flex-col items-center justify-center w-full h-full'>
        <Text className='text-center text-2xl font-bold mt-4'>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className='flex-col items-center justify-center w-full h-full'>
        <Text className='text-center text-2xl font-bold mt-4'>No requests found</Text>
      </View>
    );
  }



  return (
    <ScrollView >
      <SafeAreaView>
        <View className='flex'>
          <Text className='text-3xl fonst-weight-[600]'>Chats</Text>
        </View>
        <View className='flex-col w-full items-center  py-2 mt-4'>
          {profiles.map((profile, index) => (
            < Link href={`/chat/${profile._id}`} key={index}>
              <View className='flex-row gap-2 w-full items-center border-b border-gray-200  h-[60px] py-4 px-4' key={index} >
                <Avatar className='h-[40px] w-[40px]' alt='pp'  >
                  <AvatarImage
                    source={
                      { uri: profile.imageUrl }
                    }
                  />
                </Avatar>
                <Text className='text-center text-xl ml-4 font-bold'>{profile.username}</Text>
              </View>
            </Link>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView >
  );
}

