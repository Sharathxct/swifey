import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Example from '~/components/Example';

export default function SignUpScreen() {
  const onPress = () => {
    router.push('/(tabs)/home');
  };

  return (
    <View className='flex-1 min-h-[90vh] justify-between w-full  gap-5 p-6 bg-secondary/30'>
      <View className='flex min-h-[80vh] justify-center w-full  gap-5  '>
        <Text className='text-primary text-4xl mb-3'>Logo</Text>
        <Text className='text-primary text-3xl'>Sign Up</Text>
        <View className='flex gap-2 w-full'>
          <Text>Username</Text>
          <Input className='rounded-full border-none bg-transparent text-primary placeholder:text-muted-foreground pl-5 p-2' />
          <Text>Password</Text>
          <Input className='rounded-full border-none bg-transparent text-primary placeholder:text-muted-foreground  p-2' />
          <Text>Date of Birth</Text>
          <RNDateTimePicker value={new Date()} display="spinner" />


          <Text>Gender</Text>
          <Example />

          <Text>College</Text>
          <Input className='rounded-full border-none bg-transparent text-primary placeholder:text-muted-foreground  p-2' />

          <Text>Company</Text>
          <Input className='rounded-full border-none bg-transparent text-primary placeholder:text-muted-foreground  p-2' />

        </View>
        <Button className='bg-primary rounded-full text-primary w-full' onPress={onPress} >
          <Text>Continue</Text>
        </Button>
        <Text className='text-center'>Have an account? <Link className='underline' href='/(auth)/sign-in'>Sign In</Link></Text>
      </View>
    </View>
  );
}

// username text
// dob date
// Gender dropdown
// College text
// company text
