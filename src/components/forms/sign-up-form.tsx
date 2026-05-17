import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, TextInput, View } from 'react-native';
import z from 'zod';

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
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores';
import { zodResolver } from '@hookform/resolvers/zod';
import { TabKey } from './types';

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Invalid password'),
});

type Props = {
  onChangeTab?: (value: TabKey) => void;
};

export function SignUpForm({ onChangeTab }: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const { logIn } = useAuthStore();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const passwordInputRef = useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

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
                    onSubmitEditing={handleSubmit(logIn)}
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

          <Button className='w-full' onPress={handleSubmit(logIn)}>
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
