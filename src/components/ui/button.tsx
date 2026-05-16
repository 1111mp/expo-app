import { cva, type VariantProps } from 'class-variance-authority';
import { Pressable, PressableProps, Text } from 'react-native';

import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-md px-5 py-3 mb-4 border',
  {
    variants: {
      theme: {
        primary: 'bg-primary border-primary',
        secondary: 'bg-white border-gray-300',
        tertiary: 'bg-transparent border-transparent',
      },
      disabled: {
        true: 'opacity-50',
      },
    },
    defaultVariants: {
      theme: 'primary',
    },
  },
);

const buttonTextVariants = cva('font-semibold text-lg tracking-wider', {
  variants: {
    theme: {
      primary: 'text-white',
      secondary: 'text-black',
      tertiary: 'text-gray-800',
    },
  },
  defaultVariants: {
    theme: 'primary',
  },
});

type ButtonProps = {
  title: string;
  onPress?: () => void;
  theme?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
} & PressableProps &
  VariantProps<typeof buttonVariants>;

export function Button({
  title,
  onPress,
  theme = 'primary',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(buttonVariants({ theme, disabled }))}
      disabled={disabled}
      {...rest}
    >
      <Text className={cn(buttonTextVariants({ theme }))}>{title}</Text>
    </Pressable>
  );
}
