import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu } from 'lucide-react-native';
import { Wallet } from 'lucide-react-native';
import ProfileCard from '~/components/profile';

export default function HomeScreen() {
  console.log("HomeScreen");

  return (
    <SafeAreaView>
      <View className='flex w-full'>

        <View className='flex-row w-full items-center justify-between px-4'>
          <Menu />
          <Text className='text-3xl text-center tracking-widest ml-4'>Swifey</Text>
          <View className='flex-row  items-center justify-center gap-2'>
            <Wallet className='text-sm' size={14} />
            <Text className='text-sm'>5.10</Text>
          </View>
        </View>
        <View className='h-full mt-4 pt-4 px-2' >
          <ProfileCard />
        </View>
      </View>
    </SafeAreaView >
  );
}

