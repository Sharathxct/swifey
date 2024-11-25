import { View, Image } from 'react-native';
import { Text } from '~/components/ui/text';
import { ScrollView } from 'react-native';
import { Heart, XIcon } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';

export default function ProfileCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [profile, setProfile] = useState({
    name: 'Sharath Chandra',
    age: 25,
    gender: 'Male',
    college: 'IIIT',
    company: 'Swifey',
    dob: '20/12/1995',
    email: 'sharathchandra@gmail.com',
    phone: '+91 987654321',
    uri: 'https://reactnative.dev/img/tiny_logo.png',
  });

  async function handleLeftIconPress() {
    console.log("left icon pressed")
    updateProfile()
  }

  async function handleRightIconPress() {
    console.log("right icon pressed")
    updateProfile()
  }

  function updateProfile() {

  }

  return (
    <ScrollView >
      <View className='flex-col items-center justify-between w-full h-full  '>
        <View className='flex-col border-2 h-full items-center justify-center'>
          <Image
            source={
              { uri: profile.uri }
            }
            className='w-[200px] h-[200px] mt-4'
          />
          <Text className='text-center text-2xl font-bold mt-4'>Sharath Chandra</Text>

          <View className='flex-row gap-4 mt-4  justify-around '>
            <TouchableOpacity onPress={handleLeftIconPress}>
              <XIcon className='text-xl' />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRightIconPress}>
              <Heart className='text-xl' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

