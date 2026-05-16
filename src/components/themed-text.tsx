import { cva, type VariantProps } from 'class-variance-authority';
import { Text, type TextProps } from 'react-native';

import { cn } from '@/utils/cn';

export type ThemedTextProps = TextProps & VariantProps<typeof textVariants>;

const textVariants = cva('text-foreground', {
  variants: {
    type: {
      default: 'text-base leading-6 font-medium',
      title: 'text-5xl leading-13 font-semibold',
      small: 'text-sm leading-5 font-medium',
      'small-bold': 'text-sm leading-5 font-bold',
      subtitle: 'text-3xl leading-11 font-semibold',
      link: 'text-sm leading-7.5',
      'link-primary': 'text-sm leading-7.5 text-primary',
      code: 'text-xs font-mono font-medium android:font-bold',
    },
  },
});

export function ThemedText({
  className,
  type = 'default',
  ...props
}: ThemedTextProps) {
  return <Text className={cn(textVariants({ type, className }))} {...props} />;
}
