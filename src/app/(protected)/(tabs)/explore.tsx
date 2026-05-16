import { Platform, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ExternalLink,
  StyledImage,
  StyledSymbolView,
  ThemedText,
  ThemedView,
  WebBadge,
} from '@/components';
import { Collapsible } from '@/components/ui';

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className='flex-1 light:bg-white dark:bg-black'
      contentInset={insets}
      contentContainerClassName='flex-row justify-center android:p-safe web:pt-16 web:pb-6'
    >
      <ThemedView className='grow max-w-3xl'>
        <ThemedView className='gap-4 items-center px-6 py-16'>
          <ThemedText type='subtitle'>Explore</ThemedText>
          <ThemedText className='text-center text-muted-foreground'>
            This starter app includes example{'\n'}code to help you get started.
          </ThemedText>

          <ExternalLink href='https://docs.expo.dev' asChild>
            <Pressable className='active:opacity-70'>
              <ThemedView className='flex-row justify-center items-center gap-1 px-6 py-2 rounded-4xl bg-secondary'>
                <ThemedText type='link'>Expo documentation</ThemedText>
                <StyledSymbolView
                  tintColorClassName='accent-black dark:accent-white'
                  name={{
                    ios: 'arrow.up.right.square',
                    android: 'link',
                    web: 'link',
                  }}
                  size={12}
                />
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>

        <ThemedView className='gap-8 px-6 pt-4'>
          <Collapsible title='File-based routing'>
            <ThemedText type='small'>
              This app has two screens:{' '}
              <ThemedText type='code'>src/app/index.tsx</ThemedText> and{' '}
              <ThemedText type='code'>src/app/explore.tsx</ThemedText>
            </ThemedText>
            <ThemedText type='small'>
              The layout file in{' '}
              <ThemedText type='code'>src/app/_layout.tsx</ThemedText> sets up
              the tab navigator.
            </ThemedText>
            <ExternalLink href='https://docs.expo.dev/router/introduction'>
              <ThemedText type='link-primary'>Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title='Android, iOS, and web support'>
            <ThemedView className='items-center'>
              <ThemedText type='small'>
                You can open this project on Android, iOS, and the web. To open
                the web version, press{' '}
                <ThemedText type='small-bold'>w</ThemedText> in the terminal
                running this project.
              </ThemedText>
              <StyledImage
                className='w-full mt-2 aspect-296/171 rounded-2xl'
                source={require('@/assets/images/tutorial-web.png')}
              />
            </ThemedView>
          </Collapsible>

          <Collapsible title='Images'>
            <ThemedText type='small'>
              For static images, you can use the{' '}
              <ThemedText type='code'>@2x</ThemedText> and{' '}
              <ThemedText type='code'>@3x</ThemedText> suffixes to provide files
              for different screen densities.
            </ThemedText>
            <StyledImage
              className='w-[100] h-[100] self-center'
              source={require('@/assets/images/react-logo.png')}
            />
            <ExternalLink href='https://reactnative.dev/docs/images'>
              <ThemedText type='link-primary'>Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title='Light and dark mode components'>
            <ThemedText type='small'>
              This template has light and dark mode support. The{' '}
              <ThemedText type='code'>useColorScheme()</ThemedText> hook lets
              you inspect what the user&apos;s current color scheme is, and so
              you can adjust UI colors accordingly.
            </ThemedText>
            <ExternalLink href='https://docs.expo.dev/develop/user-interface/color-themes/'>
              <ThemedText type='link-primary'>Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title='Animations'>
            <ThemedText type='small'>
              This template includes an example of an animated component. The{' '}
              <ThemedText type='code'>
                src/components/ui/collapsible.tsx
              </ThemedText>{' '}
              component uses the powerful{' '}
              <ThemedText type='code'>react-native-reanimated</ThemedText>{' '}
              library to animate opening this hint.
            </ThemedText>
          </Collapsible>
        </ThemedView>
        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}
