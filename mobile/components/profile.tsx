import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, Dimensions, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Text } from '~/components/ui/text';
import axios from 'axios';
import { baseUrl } from '~/lib/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;


function ProfileCard({
  name = "Emma Johnson",
  age = 24,
  bio = "Software engineer | Travel enthusiast | Dog lover",
  imageUri,
  onSwipeLeft,
  onSwipeRight
}: any) {
  const translateX = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  const gestureHandler = useRef();

  const panGestureEvent = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotateZ: `${rotateZ.value}deg` }
      ]
    };
  });

  const handleGestureStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      if (translateX.value > SCREEN_WIDTH / 3) {
        translateX.value = withSpring(SCREEN_WIDTH, { damping: 20, stiffness: 150 }, () => {
          runOnJS(onSwipeRight)();
        });
        rotateZ.value = withSpring(15, { damping: 20, stiffness: 150 });
      } else if (translateX.value < -SCREEN_WIDTH / 3) {
        translateX.value = withSpring(-SCREEN_WIDTH, { damping: 20, stiffness: 150 }, () => {
          runOnJS(onSwipeLeft)();
        });
        rotateZ.value = withSpring(-15, { damping: 20, stiffness: 150 });
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 150 });
        rotateZ.value = withSpring(0, { damping: 20, stiffness: 150 });
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler
        ref={gestureHandler}
        onGestureEvent={(event) => {
          translateX.value = event.nativeEvent.translationX;
          rotateZ.value = event.nativeEvent.translationX / 20;
        }}
        onHandlerStateChange={handleGestureStateChange}
      >
        <Animated.View style={[
          {
            width: '100%',
            height: '85%',
            position: 'absolute'
          },
          panGestureEvent
        ]}>
          <ImageBackground
            source={imageUri}
            className='flex-1 justify-end'
            style={{ width: '100%', height: '100%' }}
          >
            <View className='bg-black/50 p-4'>
              <Text className='text-white text-2xl font-bold'>
                {name}, {age}
              </Text>
              <Text className='text-white text-base mt-2'>
                {bio}
              </Text>
            </View>
          </ImageBackground>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

function SwipeableProfileStack() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  const getToken = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      return router.push('/(auth)/sign-in');
    }
    setToken(token);
  }

  const fetchNewBatch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/profile/profiles`, {
        headers: {
          Authorization: `${token}`
        }
      });
      if (response.data && response.data.length > 0) {
        setProfiles(response.data);
      } else {
        console.log("No more profiles");
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getToken();
    fetchNewBatch();
  }, []);

  const handleSwipeRight = () => {
    console.log("right swipe");
    setProfiles((prevProfiles) => {
      const [_swipedProfile, ...rest] = prevProfiles;
      return rest;
    });
    if (profiles.length <= 1) {
      fetchNewBatch();
    }
  };

  const handleSwipeLeft = () => {
    console.log("left swipe");
    setProfiles((prevProfiles) => {
      const [_swipedProfile, ...rest] = prevProfiles;
      return rest;
    });
    if (profiles.length <= 1) {
      fetchNewBatch();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : profiles.length > 0 ? (
        <ProfileCard
          key={profiles[0].id}
          {...profiles[0]}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
        />
      ) : (
        <Text>No more profiles</Text>
      )}
    </View>
  );
}

export default SwipeableProfileStack;

