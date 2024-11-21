import { StatusBar } from "expo-status-bar";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { Home } from "~/lib/icons/Home";
import { MessageCircle, User, Wallet } from "lucide-react-native";

const TabLayout = () => {

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View className="flex items-center justify-center gap-2 w-12">
                <Home color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "Wallet",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View className="flex items-center justify-center gap-2 w-12">
                <Wallet color={color} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View className="flex items-center justify-center gap-2 w-12">
                <User color={color} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View className="flex items-center justify-center gap-2 w-12">
                <MessageCircle color={color} />
              </View>
            ),
          }}
        />

      </Tabs>

      <StatusBar backgroundColor="#161622" />
    </>
  );
};

export default TabLayout;
