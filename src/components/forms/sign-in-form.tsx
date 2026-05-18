import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, type TextInput, View } from 'react-native';
import { toast } from 'sonner-native';
import z from 'zod';

import { StyledIonicons } from '@/components';
import { SocialConnections } from '@/components/social-connections';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Text,
} from '@/components/ui';
import { authClient } from '@/lib/better-auth/client';
import { cn } from '@/lib/utils';
import { TabKey } from './types';

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Invalid password'),
});

type Props = {
  onChangeTab?: (value: TabKey) => void;
};

export function SignInForm({ onChangeTab }: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const router = useRouter();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const passwordInputRef = useRef<TextInput>(null);

  const onEmailSubmitEditing = () => {
    passwordInputRef.current?.focus();
  };

  const onSubmit = async (value: z.infer<typeof schema>) => {
    await authClient.signIn.email(
      {
        email: value.email,
        password: value.password,
      },
      {
        onSuccess: () => {
          router.replace('/');
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <Card className='border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5 bg-background'>
      <CardHeader>
        <CardTitle className='text-xl text-left'>Sign in to your app</CardTitle>
        <CardDescription className='text-left'>
          Welcome back! Please sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent className='gap-6'>
        <View className='gap-4'>
          <Controller
            name='email'
            control={control}
            render={({ field, fieldState }) => (
              <View className='gap-1'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  value={field.value}
                  className={cn(
                    fieldState.invalid && 'text-destructive border-destructive',
                  )}
                  placeholder='m@example.com'
                  keyboardType='email-address'
                  autoComplete='email'
                  autoCapitalize='none'
                  returnKeyType='next'
                  submitBehavior='submit'
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  onSubmitEditing={onEmailSubmitEditing}
                />
                <Text
                  className={cn(
                    'text-sm text-muted-foreground',
                    fieldState.invalid && 'text-destructive',
                  )}
                >
                  We'll never share your email with anyone else.
                </Text>
                {fieldState.invalid && (
                  <Text className='text-sm text-destructive'>
                    {fieldState.error?.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            name='password'
            control={control}
            render={({ field, fieldState }) => (
              <View className='gap-1'>
                <View className='flex-row items-center'>
                  <Label htmlFor='password'>Password</Label>
                  <Button
                    variant='link'
                    size='sm'
                    className='web:h-fit ml-auto h-4 px-1 py-0 sm:h-4 active:opacity-70'
                    onPress={() => {
                      // TODO: Navigate to forgot password screen
                    }}
                  >
                    <Text className='font-normal leading-4 underline'>
                      Forgot your password?
                    </Text>
                  </Button>
                </View>
                <View className='flex-row items-center'>
                  <Input
                    ref={passwordInputRef}
                    id='password'
                    value={field.value}
                    className={cn(
                      fieldState.invalid &&
                        'text-destructive border-destructive',
                    )}
                    secureTextEntry={!isPasswordVisible}
                    returnKeyType='send'
                    placeholder='Enter your password'
                    onBlur={field.onBlur}
                    onChangeText={field.onChange}
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                  <Button
                    variant='ghost'
                    className='absolute right-0 active:opacity-70'
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <StyledIonicons
                      name={
                        isPasswordVisible ? 'eye-off-outline' : 'eye-outline'
                      }
                      size={16}
                      className='text-muted-foreground'
                    />
                  </Button>
                </View>
                <Text
                  className={cn(
                    'text-sm text-muted-foreground',
                    fieldState.invalid && 'text-destructive',
                  )}
                >
                  Password must be at least 6 characters.
                </Text>
                {fieldState.invalid && (
                  <Text className='text-sm text-destructive'>
                    {fieldState.error?.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Button className='w-full' onPress={handleSubmit(onSubmit)}>
            <Text>Continue</Text>
          </Button>
        </View>
        <Text className='text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Pressable
            onPress={() => {
              onChangeTab?.(TabKey.SignUpForm);
            }}
          >
            <Text className='text-sm underline underline-offset-4'>
              Sign up
            </Text>
          </Pressable>
        </Text>
        <View className='flex-row items-center'>
          <Separator className='flex-1' />
          <Text className='text-muted-foreground px-4 text-sm'>or</Text>
          <Separator className='flex-1' />
        </View>
        <SocialConnections />
      </CardContent>
    </Card>
  );
}
