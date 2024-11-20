import { View } from 'react-native';
import { Text } from '~/components/ui/text';

export default function HomeScreen() {

  return (
    <View className='flex-1 min-h-[90vh] justify-between w-full  gap-5 p-6 bg-secondary/30'>
      <Text className='text-3xl'>Home Screen</Text>
    </View>
  );
}

