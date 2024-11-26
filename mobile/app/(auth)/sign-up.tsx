import { useState } from 'react';
import { ScrollView, View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Text } from '~/components/ui/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Radio } from '~/components/radio';
import { router } from 'expo-router';
import { baseUrl } from '~/lib/constant';
import { Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  const [gender, setGender] = useState('');
  const [college, setCollege] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<any>(null);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);

    const formattedDob = `${dob.day}-${dob.month}-${dob.year}`;

    try {
      console.log("req data, url", username, email, password, dob, gender, college, company, baseUrl, '/api/auth/signup')

      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password)
      formData.append('dob', formattedDob);
      formData.append('gender', gender);
      formData.append('college', college);
      formData.append('company', company);

      if (image) {
        const imageUri = image.uri;
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';

        //@ts-ignore
        formData.append('image', {
          uri: imageUri,
          name: filename,
          type,
        });

      }

      if (!username && !email && !password && !dob && !gender && !college && !company) {
        Alert.alert('Error', 'Please fill in all the fields');
        return;
      }

      const response = await axios.post(baseUrl + '/api/auth/signup', formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

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
      <SafeAreaView >
        <View className="flex min-h-[80vh] justify-center w-full gap-5">
          <Text className=" text-3xl">Sign Up</Text>
          <View className="flex gap-2 w-full mt-5">

            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
              {image ? (
                <Image source={{ uri: image.uri }} style={styles.image} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text>Tap to select image</Text>
                </View>
              )}
            </TouchableOpacity>

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
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },

})
