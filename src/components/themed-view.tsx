import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

export type ThemedViewProps = ViewProps & {};

export function ThemedView({ className, ...props }: ThemedViewProps) {
  return <View className={cn('bg-background', className)} {...props} />;
}
