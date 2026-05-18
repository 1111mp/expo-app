import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  disableDefaultFetchPlugins: true,
  plugins: [
    expoClient({
      scheme: 'expoapp',
      storagePrefix: 'withbetterauth',
      storage: SecureStore,
    }),
  ],
});

function getBaseURL() {
  if (process.env.NODE_ENV === 'development') {
    // Android emulator cannot access "localhost" of the host machine directly,
    // so we must use the special alias 10.0.2.2 to reach the host computer.
    if (Platform.OS === 'android') return 'http://10.0.2.2:8081';
    // iOS simulator and web can access the host machine via localhost
    return 'http://localhost:8081';
  }

  // Fallback base URL for production (should be replaced with real API endpoint later)
  return 'http://localhost:8081';
}
