import { View, Image } from 'react-native';
import { Text } from '~/components/ui/text';
import { ScrollView } from 'react-native';
import { Heart, XIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { baseUrl } from '~/lib/constant';
import axios from 'axios';

export default function ProfileCard({ token }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [profile, setProfile] = useState({
    name: 'Sharath Chandra',
    dob: 25,
    gender: 'Male',
    college: 'IIIT',
    mongoId: '62a1f8d0b0f1b2c6b5e5c0a0',
    company: 'Swifey',
    username: 'sharathchandra',
    email: 'sharathchandra@gmail.com',
    phone: '+91 987654321',
    uri: 'https://reactnative.dev/img/tiny_logo.png',
  });

  async function handleLeftIconPress() {
    console.log("left icon pressed")
    const res = await axios.post(baseUrl + '/api/swipe/left',
      { receiver: profile.mongoId },
      {
        headers: {
          Authorization: `${token}`,
        }
      });
    console.log(res.data)
    await updateProfile()
  }

  async function handleRightIconPress() {
    console.log("right icon pressed")
    const res = await axios.post(baseUrl + '/api/swipe/right',
      {
        receiver: profile.mongoId,
      },
      {
        headers: {
          Authorization: `${token}`,
        }
      });
    console.log(res.data)
    await updateProfile()
  }

  const fallbackUri = 'https://reactnative.dev/img/tiny_logo.png';

  async function updateProfile() {
    console.log("updating profile")
    console.log(baseUrl)
    const res = await axios.get(baseUrl + '/api/profile', {
      headers: {
        Authorization: `${token}`,
      },
    });
    console.log("response", res.data[0])
    if (res.data.length > 0) {
      setProfile(res.data[0])
    } else {
      setError(true)
    }
  }

  useEffect(() => {
    updateProfile()
  }, [])

  if (error) {
    return (
      <View className='flex-col items-center justify-center w-full h-full'>
        <Text className='text-center text-2xl font-bold mt-4'>No profiles found</Text>
      </View>
    )
  }
  else {
    return (
      < ScrollView >
        <View className='flex-col items-center justify-between w-full h-full  '>
          <View className='flex-col border-2 h-full items-center justify-center'>
            <Image
              source={
                { uri: fallbackUri }
              }
              className='w-[200px] h-[200px] mt-4'
            />
            <Text className='text-center text-2xl font-bold mt-4'>{profile.username}</Text>
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
      </ScrollView >
    );
  }

}

