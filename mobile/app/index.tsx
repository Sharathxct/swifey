import { router } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';


export default function Screen() {
  const onPress = () => {
    router.push('/(auth)/sign-in');
  };
  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      console.log(token)
      if (token) {
        router.push('/(tabs)/home');  // Redirect to home if token exists
      }
    };
    checkSession();
  }, []);


  return (
    <View className='flex h-full justify-between items-center gap-5 p-6 bg-secondary/30'>
      <View className='w-full my-8 '>
        <Text className='text-5xl mt-10 text-center'>Swifey</Text>
        <Text className='text-3xl text-center mt-4'>A dating app</Text>
      </View>
      <View className='w-full gap-4'>
        <Button
          className='bg-primary text-primary w-full'
          onPress={onPress}
        >
          <Text>Continue</Text>
        </Button>
        <Text className='text-sm pt-0 mt-[-3]' >
          By continuing you accept to our terms and conditions.
          <Text className='underline'>Terms and Conditions</Text>
        </Text>
      </View>
    </View>
  );
}
