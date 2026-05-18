import { PropsWithChildren, useState } from 'react';
import { Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { StyledSymbolView, ThemedText, ThemedView } from '@/components';

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemedView>
      <Pressable
        className='flex-row items-center gap-2 active:opacity-70'
        onPress={() => setIsOpen((value) => !value)}
      >
        <ThemedView className='size-6 justify-center items-center rounded-xl bg-secondary'>
          <StyledSymbolView
            name={{
              ios: 'chevron.right',
              android: 'chevron_right',
              web: 'chevron_right',
            }}
            size={14}
            weight='bold'
            data-state={isOpen ? 'open' : 'closed'}
            className='data-[state=open]:-rotate-90 data-[state=closed]:rotate-90'
            tintColorClassName='accent-foreground'
          />
        </ThemedView>

        <ThemedText type='small'>{title}</ThemedText>
      </Pressable>
      {isOpen && (
        <Animated.View entering={FadeIn.duration(200)}>
          <ThemedView className='p-6 mt-4 ml-6 rounded-2xl bg-secondary'>
            {children}
          </ThemedView>
        </Animated.View>
      )}
    </ThemedView>
  );
}
