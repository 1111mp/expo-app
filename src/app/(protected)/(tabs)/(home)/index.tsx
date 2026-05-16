import * as Device from 'expo-device';
import { Link, useRouter } from 'expo-router';
import { Suspense } from 'react';
import { ActivityIndicator, Platform, Pressable } from 'react-native';

import {
  AnimatedIcon,
  HintRow,
  PostList,
  StyledSafeAreaView,
  ThemedText,
  ThemedView,
  WebBadge,
} from '@/components';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/stores';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type='small'>use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type='small'>
        shake device or press <ThemedText type='code'>m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type='small'>
      press <ThemedText type='code'>{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { logOut } = useAuthStore();

  return (
    <ThemedView className='flex-1 justify-center flex-row'>
      <StyledSafeAreaView className='flex-1 items-center gap-4 max-w-3xl px-6 pb-6'>
        <ThemedView className='flex-1 items-center justify-center gap-6 px-6'>
          <AnimatedIcon />
          <ThemedText type='title' className='text-center'>
            Welcome to&nbsp;Expo
          </ThemedText>
        </ThemedView>

        <Button title='Logout' onPress={logOut} />

        <Pressable
          onPress={() => {
            router.navigate('/explore');
          }}
        >
          <ThemedText>Explore</ThemedText>
        </Pressable>
        <Link href='/assistant'>
          <ThemedText>Assistant</ThemedText>
        </Link>

        <Suspense fallback={<ActivityIndicator />}>
          <PostList />
        </Suspense>

        <ThemedText type='code' className='uppercase'>
          get started
        </ThemedText>

        <ThemedView className='gap-4 px-4 py-6 rounded-3xl self-stretch bg-secondary'>
          <HintRow
            title='Try editing'
            hint={<ThemedText type='code'>src/app/index.tsx</ThemedText>}
          />
          <HintRow title='Dev tools' hint={getDevMenuHint()} />
          <HintRow
            title='Fresh start'
            hint={<ThemedText type='code'>npm run reset-project</ThemedText>}
          />
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </StyledSafeAreaView>
    </ThemedView>
  );
}
