import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useState } from 'react';
import { Avatar, AvatarImage } from '~/components/ui/avatar';
import { Link } from 'expo-router';

export default function ChatScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [profiles, setProfiles] = useState([
    {
      name: 'Sharath Chandra',
      age: 25,
      gender: 'Male',
      college: 'IIIT',
      company: 'Swifey',
      dob: '20/12/1995',
      email: 'sharathchandra@gmail.com',
      phone: '+91 987654321',
      uri: 'https://reactnative.dev/img/tiny_logo.png',
    }, {
      name: 'Kirat ',
      age: 25,
      gender: 'Male',
      college: 'IIIT',
      company: 'Swifey',
      dob: '20/12/1995',
      email: 'sharathchandra@gmail.com',
      phone: '+91 987654321',
      uri: 'https://reactnative.dev/img/tiny_logo.png',
    }
  ])


  return (
    <ScrollView >
      <SafeAreaView>
        <View className='flex'>
          <Text className='text-3xl fonst-weight-[600]'>Chats</Text>
        </View>
        <View className='flex-col w-full items-center  py-2 mt-4'>
          {profiles.map((profile, index) => (
            <Link href={`/chat/${index}`} key={index}>
              <View className='flex-row gap-2 w-full items-center border-b border-gray-200  h-[60px] py-4' key={index} >
                <Avatar className='h-[40px] w-[40px]' alt='pp'  >
                  <AvatarImage
                    source={
                      { uri: profile.uri }
                    }
                  />
                </Avatar>
                <Text className='text-center text-xl font-bold'>{profile.name}</Text>
              </View>
            </Link>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

