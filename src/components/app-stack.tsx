import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { isWeb } from '@/constants/platform';
import { useAuthStore } from '@/stores';

export function AppStack() {
  const { isLoggedIn, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (_hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [_hasHydrated]);

  if (!_hasHydrated && !isWeb) {
    return null;
  }

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen
          name='(protected)'
          options={{
            animation: 'fade',
            animationDuration: 300,
            headerShown: false,
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen
          name='login'
          options={{ animation: 'fade', animationDuration: 300 }}
        />
      </Stack.Protected>
    </Stack>
  );
}
