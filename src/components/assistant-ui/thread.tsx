import { ThreadPrimitive } from '@assistant-ui/react-native';
import { KeyboardAvoidingView } from 'react-native';

import { StyledSafeAreaView, ThemedText, ThemedView } from '@/components';
import { withUniwind } from 'uniwind';
import { Composer } from './composer';
import { MessageBubble } from './message';

const StyledThreadMessages = withUniwind(ThreadPrimitive.Messages);

function EmptyState() {
  return (
    <ThemedView className='flex-1 justify-center items-center p-10'>
      <ThemedView className='justify-center items-center size-18 mb-5 rounded-full bg-blue-100'>
        <ThemedText className='text-3xl'>💭</ThemedText>
      </ThemedView>
      <ThemedText className='text-2xl font-semibold mb-2 tracking-tight'>
        How can I help?
      </ThemedText>
      <ThemedText className='text-sm text-center tracking-tight'>
        Send a message to start chatting
      </ThemedText>
    </ThemedView>
  );
}

export function Thread() {
  return (
    <ThemedView className='flex-1'>
      <StyledSafeAreaView className='flex-1'>
        <KeyboardAvoidingView className='flex-1'>
          <ThemedView className='flex-1'>
            <ThreadPrimitive.Empty>
              <EmptyState />
            </ThreadPrimitive.Empty>
            <ThreadPrimitive.If empty={false}>
              <StyledThreadMessages
                contentContainerClassName='px-1 py-5'
                showsVerticalScrollIndicator={true}
                components={{ Message: MessageBubble }}
              />
            </ThreadPrimitive.If>
          </ThemedView>
          <ThemedView>
            <Composer />
          </ThemedView>
        </KeyboardAvoidingView>
      </StyledSafeAreaView>
    </ThemedView>
  );
}
