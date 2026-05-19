import * as AppleAuthentication from 'expo-apple-authentication';
import { View } from 'react-native';
import { toast } from 'sonner-native';

import { Button } from '@/components/ui';
import { authClient } from '@/lib/better-auth/client';
import { StyledIonicons } from './styled-ionicons';

export function SocialConnections() {
  return (
    <View className='gap-2 sm:flex-row sm:gap-3'>
      <Button
        variant='outline'
        size='sm'
        className='sm:flex-1'
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
            if (credential.identityToken === null) {
              toast.error(
                "We couldn't verify your Apple account. Please try again.",
              );
              return;
            }

            await authClient.signIn.social(
              {
                provider: 'apple',
                callbackURL: '/',
                idToken: {
                  token: credential.identityToken,
                },
              },
              {
                onError: (ctx) => {
                  toast.error(ctx.error.message);
                },
              },
            );
          } catch (err: any) {
            if (err?.code === 'ERR_REQUEST_CANCELED') {
              toast.error('Sign in was cancelled.');
              return;
            }

            toast.error(
              err?.message ??
                'Something went wrong. Please try again in a moment.',
            );
          }
        }}
      >
        <StyledIonicons
          size={18}
          name='logo-apple'
          className='text-black dark:text-white'
        />
      </Button>
      <Button
        variant='outline'
        size='sm'
        className='sm:flex-1'
        onPress={async () => {
          await authClient.signIn.social(
            {
              provider: 'google',
              callbackURL: '/',
            },
            {
              onError: (ctx) => {
                toast.error(ctx.error.message);
              },
            },
          );
        }}
      >
        <StyledIonicons
          size={18}
          name='logo-google'
          className='text-black dark:text-white'
        />
      </Button>
      <Button
        variant='outline'
        size='sm'
        className='sm:flex-1'
        onPress={async () => {
          await authClient.signIn.social(
            {
              provider: 'github',
              callbackURL: '/',
            },
            {
              onError: (ctx) => {
                toast.error(ctx.error.message);
              },
            },
          );
        }}
      >
        <StyledIonicons
          size={18}
          name='logo-github'
          className='text-black dark:text-white'
        />
      </Button>
    </View>
  );
}
