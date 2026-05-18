import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { isWeb } from '@/constants/platform';
import { authClient } from '@/lib/better-auth/client';

export function AppStack() {
  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = !!session;

  useEffect(() => {
    if (!isPending) {
      SplashScreen.hideAsync();
    }
  }, [isPending]);

  if (isWeb) {
    return null;
  }

  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen
          name='(protected)'
          options={{
            animation: 'fade',
            animationDuration: 300,
            headerShown: false,
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen
          name='sign-in'
          options={{
            animation: 'fade',
            animationDuration: 300,
            headerShown: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
