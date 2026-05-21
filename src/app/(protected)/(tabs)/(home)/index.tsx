import { useQuery, useQueryErrorResetBoundary } from '@tanstack/react-query';
import * as Device from 'expo-device';
import { type ErrorBoundaryProps, Link, useRouter } from 'expo-router';
import { Suspense } from 'react';
import { ActivityIndicator, Platform, Pressable } from 'react-native';
import { toast } from 'sonner-native';

import {
  AnimatedIcon,
  HintRow,
  PostList,
  StyledSafeAreaView,
  ThemedText,
  ThemedView,
  WebBadge,
} from '@/components';
import { Button, Text } from '@/components/ui';
import { authClient } from '@/lib/better-auth/client';
import { useApi } from '@/trpc/react';

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

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  const handleRetry = async () => {
    reset();
    await retry();
  };

  return (
    <ThemedView className='flex-1 items-center justify-center gap-4 px-6'>
      <ThemedText>Error: {error.message}</ThemedText>
      <Button onPress={handleRetry}>
        <Text>Try again</Text>
      </Button>
    </ThemedView>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const api = useApi();
  const {
    data: latestPosts,
    isLoading,
    refetch,
  } = useQuery({
    ...api.post.getLatest.queryOptions(),
    enabled: false, // disable automatic query on mount
    retry: false, // disable retries to see errors immediately
  });

  console.log('isLoading:', isLoading);
  console.log('Latest posts:', latestPosts);

  return (
    <ThemedView className='flex-1 justify-center flex-row'>
      <StyledSafeAreaView className='flex-1 items-center gap-4 max-w-3xl px-6 pb-6'>
        <ThemedView className='flex-1 items-center justify-center gap-6 px-6'>
          <AnimatedIcon />
          <ThemedText type='title' className='text-center'>
            Welcome to&nbsp;Expo
          </ThemedText>
        </ThemedView>

        <Button
          onPress={() => {
            refetch();
          }}
        >
          <Text>Get Latest Post</Text>
        </Button>

        <Button
          onPress={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.dismissTo('/sign-in');
                },
                onError: (ctx) => {
                  toast.error(ctx.error.message);
                },
              },
            });
          }}
        >
          <Text>Logout</Text>
        </Button>

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
