import { View, Image } from 'react-native';
import { Text } from '~/components/ui/text';
import { ScrollView } from 'react-native';
import { Heart, XIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { baseUrl } from '~/lib/constant';
import axios from 'axios';

export default function ProfileCard({ token }: any) {
  const [error, setError] = useState<boolean>(false);
  const [noBalance, setNoBalance] = useState(false);
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
    imageUrl: 'https://reactnative.dev/img/tiny_logo.png',
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
    console.log(res)
    await updateProfile()
  }

  async function handleRightIconPress() {
    console.log("right icon pressed")
    console.log("token", token)
    try {
      await axios.post(baseUrl + '/api/swipe/right',
        { receiver: profile.mongoId },
        {
          headers: {
            Authorization: `${token}`,
          }
        });
      await updateProfile()
    } catch (e: any) {
      if (e.response.status === 400 && e.response.data === "Insufficient balance") {
        setNoBalance(true)
      }
    }
  }

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

  useEffect(() => {
    if (noBalance) {
      alert("Insufficient balance")
    }
    setNoBalance(false)
  }, [noBalance])

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
          <View className='flex-col  h-full items-center justify-center'>
            <Image
              source={
                { uri: profile.imageUrl }
              }
              className='w-[80vw] h-[65vh] mt-4'
            />
            <Text className=' text-2xl font-bold mt-4'>{profile.username}</Text>
            <View className='flex-row gap-4 mt-4 w-full px-4 justify-between '>
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

