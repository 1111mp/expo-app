import '@/global.css';

import { PortalHost } from '@rn-primitives/portal';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaListener } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';

import { AnimatedSplashOverlay, AppStack } from '@/components';
import { isWeb } from '@/constants/platform';

if (!isWeb) {
  SplashScreen.preventAutoHideAsync();
}

export default function RootLayout() {
  return (
    <SafeAreaListener
      onChange={({ insets }) => {
        Uniwind.updateInsets(insets);
      }}
    >
      <AnimatedSplashOverlay />
      <AppStack />
      <PortalHost />
    </SafeAreaListener>
  );
}
