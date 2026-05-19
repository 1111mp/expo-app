import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, TextInput, View } from 'react-native';
import { toast } from 'sonner-native';

import { StyledIonicons } from '@/components';
import { SocialConnections } from '@/components/social-connections';
import {
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
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/better-auth/client';
import { cn } from '@/lib/utils';
import { z } from '@/lib/zod';
import { TabKey } from './types';

const schema = z.object({
  name: z.string().min(4, 'Invalid name').max(12, 'Invalid name'),
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Invalid password'),
});

type Props = {
  onChangeTab?: (value: TabKey) => void;
};

export function SignUpForm({ onChangeTab }: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const router = useRouter();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const passwordInputRef = useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  const onSubmit = async (value: z.infer<typeof schema>) => {
    await authClient.signUp.email(
      {
        name: value.name,
        email: value.email,
        password: value.password,
      },
      {
        onSuccess() {
          router.replace('/');
        },
        onError(ctx) {
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <Card className='border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5 bg-background'>
      <CardHeader>
        <CardTitle className='text-xl text-left'>Create your account</CardTitle>
        <CardDescription className='text-left'>
          Welcome! Please fill in the details to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className='gap-6'>
        <View className='gap-4'>
          <Controller
            name='name'
            control={control}
            render={({ field, fieldState }) => (
              <View className='gap-1'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  value={field.value}
                  className={cn(
                    fieldState.invalid && 'text-destructive border-destructive',
                  )}
                  placeholder='Enter your name'
                  autoComplete='username-new'
                  autoCapitalize='words'
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
                  Name must be between 4 and 12 characters.
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
                <Label htmlFor='password'>Password</Label>
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
          Already have an account?{' '}
          <Pressable
            onPress={() => {
              onChangeTab?.(TabKey.SignInForm);
            }}
          >
            <Text className='text-sm underline underline-offset-4'>
              Sign in
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
