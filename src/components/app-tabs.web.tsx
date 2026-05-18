import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, View } from 'react-native';

import { cn } from '@/lib/utils';
import { ExternalLink } from './external-link';
import { StyledSymbolView } from './styled-symbol-view';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot className='h-full' />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name='home' href='/' asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name='explore' href='/explore' asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  ...props
}: TabTriggerSlotProps) {
  return (
    <Pressable {...props} className='active:opacity-70'>
      <ThemedView
        className={cn(
          'px-4 py-1 rounded-2xl',
          isFocused ? 'bg-foreground/10' : 'bg-secondary',
        )}
      >
        <ThemedText
          type='small'
          className={isFocused ? 'text-foreground' : 'text-secondary'}
        >
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View
      {...props}
      className='absolute w-full flex-row justify-center items-center p-4'
    >
      <ThemedView className='max-w-3xl flex-row items-center gap-2 grow px-8 py-2 rounded-4xl bg-secondary'>
        <ThemedText type='small-bold' className='mr-auto'>
          Expo Starter
        </ThemedText>

        {props.children}

        <ExternalLink href='https://docs.expo.dev' asChild>
          <Pressable className='flex-row justify-center items-center gap-1 ml-4'>
            <ThemedText type='link'>Docs</ThemedText>
            <StyledSymbolView
              tintColorClassName='accent-black dark:accent-white'
              name={{ ios: 'arrow.up.right.square', web: 'link' }}
              size={12}
            />
          </Pressable>
        </ExternalLink>
      </ThemedView>
    </View>
  );
}
