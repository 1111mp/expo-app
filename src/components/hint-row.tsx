import type { ReactNode } from 'react';
import { View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type HintRowProps = {
  title?: string;
  hint?: ReactNode;
};

export function HintRow({
  title = 'Try editing',
  hint = 'app/home/index.tsx',
}: HintRowProps) {
  return (
    <View className='flex-row justify-between'>
      <ThemedText type='small'>{title}</ThemedText>
      <ThemedView className='px-2 py-0.5 bg-foreground/10'>
        <ThemedText className='text-secondary'>{hint}</ThemedText>
      </ThemedView>
    </View>
  );
}
