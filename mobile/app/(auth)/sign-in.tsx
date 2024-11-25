import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { baseUrl } from '~/lib/constant';
import { Link } from 'expo-router';


export default function SignInScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      console.log(token)
      if (token) {
        router.push('/(tabs)/home');
      }
    };
    checkSession();
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(baseUrl + '/api/auth/signin', {
        username,
        password,
      });

      const { token } = response.data;
      console.log(token)
      await AsyncStorage.setItem('auth_token', token);

      router.push('/(tabs)/home');
    } catch (error) {
      console.error('Sign-in error', error);
      Alert.alert('Error', 'There was an issue signing you in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 min-h-[90vh] justify-between w-full gap-5 p-6 bg-secondary/30">
      <View className="flex min-h-[80vh] justify-center w-full gap-5">
        <Text className="text-primary text-4xl mb-3">Log In</Text>

        <View className="flex gap-2 w-full">
          <Text>Username</Text>
          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 20,
              paddingLeft: 10,
            }}
            className=' text-foreground'
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
          />

          <Text>Password</Text>
          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 20,
              paddingLeft: 10,
            }}
            className=' text-foreground'
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />
        </View>

        <Button onPress={handleSignIn} disabled={isLoading}>
          <Text>Log In</Text>
        </Button>

        <Text className="text-center">
          Don't have an account?{' '}
          <Link className='underline' href='/(auth)/sign-up'>Sign Up</Link>
        </Text>
      </View>
    </View>
  );
}

