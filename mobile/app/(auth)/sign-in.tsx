import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';

export default function SignInScreen() {
  return (
    <View className='flex-1 min-h-[90vh] justify-center w-full  gap-5 p-6 bg-secondary/30'>
      <Text className='text-primary'>Logo</Text>
      <View className='flex-1 gap-2 w-full'>
        <Text>Username</Text>
        <Input className='rounded-full border-none bg-transparent text-primary placeholder:text-muted-foreground' />
        <Text>Password</Text>
        <Input className='rounded-full border-none bg-transparent text-primary placeholder:text-muted-foreground' />
      </View>
      <Button
        className='bg-primary rounded-full text-primary w-full'
      >
        <Text>Continue</Text>
      </Button>
    </View>
  );
}
