import { Link } from "expo-router";
import { View, Text } from "react-native";
import { verifyInstallation } from 'nativewind';

export default function App() {
  verifyInstallation();
  return (
    <View className="flex-1 items-center justify-center">
      <Text className='text-3xl'>Open up!</Text>
    </View>
  );
}
