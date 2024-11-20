import { router } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';


export default function Screen() {
  const onPress = () => {
    router.push('/(auth)/sign-in');
  };

  return (
    <View className='flex-1 justify-center items-center gap-5 p-6 bg-secondary/30'>
      <Text className='text-3xl'>Logo</Text>
      <Text>Onboarding Screen</Text>
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
  );
}
