import { useState } from 'react';
import { ScrollView, View, TextInput, Button, Alert } from 'react-native';
import { Text } from '~/components/ui/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Radio } from '~/components/radio';
import { router } from 'expo-router';
import { baseUrl } from '~/lib/constant';
import { Link } from 'expo-router';

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  const [gender, setGender] = useState('');
  const [college, setCollege] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);

    const formattedDob = `${dob.day}-${dob.month}-${dob.year}`;

    try {
      console.log("req data, url", username, email, password, dob, gender, college, company, baseUrl, '/api/auth/signup')
      const response = await axios.post(baseUrl + '/api/auth/signup', {
        username,
        email,
        password,
        dob: formattedDob,
        gender,
        college,
        company,
      });
      console.log("response", response)

      const { token } = response.data;
      await AsyncStorage.setItem('auth_token', token);
      console.log(token)

      router.push('/(auth)/verify');
    } catch (error) {
      console.error('Sign-up error', error);
      Alert.alert('Error', 'There was an issue signing you up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView >
      <View className="flex min-h-[80vh] justify-center w-full gap-5">
        <Text className=" text-3xl">Sign Up</Text>
        <View className="flex gap-2 w-full mt-5">
          <Text>Username</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 20, paddingLeft: 10 }}
            className=' text-foreground'
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
          />

          <Text>Email</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 20, paddingLeft: 10 }}
            className=' text-foreground'
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <Text>Password</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 20, paddingLeft: 10 }}
            className=' text-foreground'
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          <Text>Date of Birth</Text>
          <View className="flex pt-2 flex-row gap-2 w-full justify-around">
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 20, paddingLeft: 10, flex: 1 }}
              className=' text-foreground'
              value={dob.day}
              onChangeText={(text) => setDob({ ...dob, day: text })}
              placeholder="DD"
              keyboardType="numeric"
            />
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 20, paddingLeft: 10, flex: 1 }}
              className=' text-foreground'
              value={dob.month}
              onChangeText={(text) => setDob({ ...dob, month: text })}
              placeholder="MM"
              keyboardType="numeric"
            />
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 20, paddingLeft: 10, flex: 2 }}
              className=' text-foreground'
              value={dob.year}
              onChangeText={(text) => setDob({ ...dob, year: text })}
              placeholder="YYYY"
              keyboardType="numeric"
            />
          </View>

          <Text className="pt-4">Gender</Text>
          <Radio value={gender} setValue={setGender} />

          <Text className="pt-4">College</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 20, paddingLeft: 10 }}
            className=' text-foreground'
            value={college}
            onChangeText={setCollege}
            placeholder="Enter your college"
          />

          <Text className="pt-4">Company</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 20, paddingLeft: 10 }}
            className=' text-foreground'
            value={company}
            onChangeText={setCompany}
            placeholder="Enter your company"
          />
        </View>

        <Button
          title={isLoading ? 'Signing Up...' : 'Sign Up'}
          onPress={handleSignUp}
          disabled={isLoading}
        />

        <Text className="text-center">
          Have an account?{' '}
          <Link className='underline' href='/(auth)/sign-in'>Sign In</Link>
        </Text>
      </View>
    </ScrollView>
  );
}

