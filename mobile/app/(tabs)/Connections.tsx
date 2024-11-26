import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, AvatarImage } from '~/components/ui/avatar';
import { X, Check } from 'lucide-react-native';
import { ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { baseUrl } from '~/lib/constant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

export default function Connections() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [profiles, setProfiles] = useState<any[]>([]);

  async function handleAccept(id: string) {
    console.log("accept", id);
    console.log("token", token)
    const res = await axios.post(baseUrl + '/api/swipe/accept',
      { conId: id },
      {
        headers: {
          Authorization: `${token}`,
        }
      });
    console.log("response", res)
    await getProfiles()
  }

  async function handleReject(id: string) {
    console.log("rejected", id);
    try {
      const res = await axios.post(baseUrl + '/api/swipe/reject',
        { conId: id },
        {
          headers: {
            Authorization: `${token}`,
          }
        });
      console.log("response", res)
    } catch (e: any) {
      console.log(e)
    }
    await getProfiles()
  }

  async function getProfiles() {
    setIsLoading(true);
    try {
      const res = await axios.get(baseUrl + '/api/profile/MyConnections', {
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
        await getProfiles();
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
    <ScrollView>
      <SafeAreaView>
        <View className='flex-col items-center justify-between w-full h-full'>
          <View className='flex-col h-full items-center justify-center'>
            <Text className='text-center text-2xl font-bold mt-4'>Connections</Text>
          </View>

          {profiles.map((profile: any, index: number) => (
            <View className='flex-row gap-2 w-full items-center justify-between border-b border-gray-200 h-[60px] py-4 pl-4' key={profile.mongoId || index}>
              <View className='flex-row gap-2 items-center border-b border-gray-200 h-[60px] py-4'>
                <Avatar className='h-[40px] w-[40px]' alt='pp'>
                  <AvatarImage
                    source={{
                      uri: profile.imageUrl || 'default-avatar-url',
                    }}
                  />
                </Avatar>
                <Text className='text-center text-xl font-bold'>{profile.username}</Text>
              </View>
              <View className='flex-row gap-4 items-center py-4 mr-4'>
                <TouchableOpacity onPress={() => handleAccept(profile.connectionId)}>
                  <Check className='text-xl' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleReject(profile.connectionId)}>
                  <X className='text-xl' />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

