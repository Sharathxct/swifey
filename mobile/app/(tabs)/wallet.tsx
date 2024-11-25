import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Button } from '~/components/ui/button';

export default function WalletScreen() {

  return (
    <ScrollView>
      <SafeAreaView>
        <Text className='text-3xl fonst-weight-[600]'>Wallet</Text>
        <View className='flex-col h-[200px] items-center justify-center'>
          <Text className='text-2xl'>0.00</Text>
          <View className='flex-row  items-center justify-center'>
            <Button className='mt-4'>
              <Text>Deposit</Text>
            </Button>
            <Button className='mt-4'>
              <Text>Withdraw</Text>
            </Button>
          </View>
        </View>
        <View className='flex'>
          <Text className='text-3xl fonst-weight-[600]'>Transactions</Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}


