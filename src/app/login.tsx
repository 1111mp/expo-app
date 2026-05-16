import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/stores';

export default function LoginScreen() {
  const { logIn } = useAuthStore();

  return (
    <ThemedView className='flex px-4 gap-2'>
      <ThemedText>Login Screen</ThemedText>
      <Button title='Login' onPress={logIn} />
    </ThemedView>
  );
}
