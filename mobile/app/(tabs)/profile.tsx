import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView>
      <View className='flex'>
        <Text className='text-3xl fonst-weight-[600]'>Profile</Text>
      </View>
    </SafeAreaView>
  );
}


