import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet } from 'lucide-react-native';
import ProfileCard from '~/components/profile';
import { LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { baseUrl } from '~/lib/constant';
import axios from 'axios';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const [balance, setBalance] = useState(0);
  console.log("HomeScreen");
  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      console.log(token)
      if (!token) {
        router.push('/(auth)/sign-in');
      }
    };
    checkSession();
    const checkBalance = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      console.log(token)
      if (!token) {
        router.push('/(auth)/sign-in');
      }
      const response = await axios.get(baseUrl + '/api/sol/balance', {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log(response.data);
      setBalance(response.data);
    };
    checkBalance();
  }, []);

  return (
    <SafeAreaView>
      <View className='flex w-full'>
        <View className='flex-row w-full items-center justify-between px-4'>
          <TouchableOpacity onPress={async () => {
            await AsyncStorage.removeItem('auth_token');
            router.push('/(auth)/sign-in');
          }}>
            <LogOut />
          </TouchableOpacity>
          <Text className='text-3xl text-center tracking-widest ml-4'>Swifey</Text>
          <View className='flex-row  items-center justify-center gap-2'>
            <Wallet className='text-sm' size={14} />
            <Text className='text-sm'>{balance}</Text>
          </View>
        </View>
        <View className='h-full mt-4 pt-4 px-2' >
          <ProfileCard />
        </View>
      </View>
    </SafeAreaView >
  );
}

