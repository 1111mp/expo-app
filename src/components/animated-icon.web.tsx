import { View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { StyledImage } from './styled-image';

const DURATION = 300;

export function AnimatedSplashOverlay() {
  return null;
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: 0 }],
  },
  60: {
    transform: [{ scale: 1.2 }],
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(1.2),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    opacity: 0,
  },
  60: {
    transform: [{ scale: 1.2 }],
    opacity: 0,
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(1.2),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: '-180deg' }, { scale: 0.8 }],
    opacity: 0,
  },
  [DURATION / 1000]: {
    transform: [{ rotateZ: '0deg' }, { scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(0.7),
  },
  100: {
    transform: [{ rotateZ: '7200deg' }],
  },
});

export function AnimatedIcon() {
  return (
    <View className='justify-center items-center size-32'>
      <Animated.View
        className='absolute size-[201]'
        entering={glowKeyframe.duration(60 * 1000 * 4)}
      >
        <StyledImage
          className='absolute size-[201]'
          source={require('@/assets/images/logo-glow.png')}
        />
      </Animated.View>

      <Animated.View
        className='absolute size-32'
        entering={keyframe.duration(DURATION)}
      >
        <div className='size-32 rounded-[40] bg-linear-[linear-gradient(180deg,#3C9FFE,#0274DF)]' />
      </Animated.View>

      <Animated.View
        className='justify-center items-center'
        entering={logoKeyframe.duration(DURATION)}
      >
        <StyledImage
          className='absolute w-19 h-18'
          source={require('@/assets/images/expo-logo.png')}
        />
      </Animated.View>
    </View>
  );
}
