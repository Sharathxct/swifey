import React, { useRef } from 'react';
import { View, ImageBackground, Dimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Text } from '~/components/ui/text';
import girl from '../assets/images/girl.png';
import girl2 from '../assets/images/girl2.avif';
import girl3 from '../assets/images/girl3.webp';

const SCREEN_WIDTH = Dimensions.get('window').width;

function TinderCard({
  name = "Emma Johnson",
  age = 24,
  bio = "Software engineer | Travel enthusiast | Dog lover",
  imageUri = girl,
  onSwipeLeft,
  onSwipeRight
}) {
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

  const handleGestureStateChange = (event) => {
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
  const [profiles, setProfiles] = React.useState([
    {
      id: '1',
      name: "Emma Johnson",
      age: 24,
      bio: "Software engineer | Travel enthusiast",
      imageUri: girl
    },
    {
      id: '2',
      name: "Shristi",
      age: 24,
      bio: "Software engineer | Travel enthusiast",
      imageUri: girl2
    },
    {
      id: '3',
      name: "Anushka",
      age: 24,
      bio: "Software engineer | Travel enthusiast",
      imageUri: girl3
    },
  ]);

  const handleSwipeRight = () => {
    console.log("right swipe");
    setProfiles(prev => {
      const [_current, ...rest] = prev;
      return rest;
    });
  };

  const handleSwipeLeft = () => {
    console.log("left swipe");
    setProfiles(prev => {
      const [_current, ...rest] = prev;
      return rest;
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {profiles.length > 0 ? (
        <TinderCard
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

