import { router } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Screen() {
  const onPress = () => {
    router.push('/(auth)/sign-in');
  };

  return (
    <View className='flex h-full justify-between items-center gap-5 p-6 bg-secondary/30'>
      <View className='w-full my-8 '>
        <Text className='text-5xl mt-5 text-center'>Swifey</Text>
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
