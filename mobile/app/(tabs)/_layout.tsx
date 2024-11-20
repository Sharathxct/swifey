import { View, } from "react-native";
import { Text } from '~/components/ui/text';

const TabsLayout = () => {
  return (
    <>
      <View className='flex-1 justify-center items-center gap-5 p-6 bg-secondary/30'>
        <Text>Tabs Screen</Text>
      </View>
    </>
  );
};

export default TabsLayout;
