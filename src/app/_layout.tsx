import '@/global.css';

import { PortalHost } from '@rn-primitives/portal';
import { BlurView } from 'expo-blur';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaListener } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { Uniwind } from 'uniwind';

import { AnimatedSplashOverlay, AppStack } from '@/components';
import { isWeb } from '@/constants/platform';

if (!isWeb) {
  SplashScreen.preventAutoHideAsync();
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SafeAreaListener
        onChange={({ insets }) => {
          Uniwind.updateInsets(insets);
        }}
      >
        <AnimatedSplashOverlay />
        <AppStack />
        <PortalHost />
        <Toaster
          toastOptions={{
            backgroundComponent: (
              <BlurView
                intensity={80}
                blurMethod='dimezisBlurView'
                style={StyleSheet.absoluteFill}
              />
            ),
          }}
        />
      </SafeAreaListener>
    </GestureHandlerRootView>
  );
}
