import { Stack } from 'expo-router';
import { Platform } from 'react-native';

// export const unstable_settings = {
//   initialRouteName: '(tabs)', // anchor
// };

export default function ProtectedLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='(tabs)'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='assistant'
        options={{
          title: '',
          headerShadowVisible: false,
          headerBackTitle: 'Home',
          headerBackButtonDisplayMode: 'minimal',
          ...Platform.select({
            ios: {
              headerTransparent: true,
              headerLargeTitleShadowVisible: false,
              headerLargeStyle: { backgroundColor: 'transparent' },
            },
            default: {
              statusBarTranslucent: true,
              statusBarStyle: 'auto',
            },
          }),
        }}
      />
    </Stack>
  );
}
