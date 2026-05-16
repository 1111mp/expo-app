import { MessagePrimitive, useAuiState } from '@assistant-ui/react-native';

import { StyledImage, ThemedText, ThemedView } from '@/components';
import { MessageActionBar } from './message-action-bar';
import { MessageBranchPicker } from './message-branch-picker';

function MessageError() {
  const error = useAuiState((s) => {
    const status = s.message.status;
    if (status?.type === 'incomplete' && status.reason === 'error') {
      return status.error ?? 'An error occurred';
    }
    return null;
  });

  if (!error) return null;

  return (
    <ThemedView className='pt-1'>
      <ThemedText className='text-sm leading-5'>
        {typeof error === 'string' ? error : 'An error occurred'}
      </ThemedText>
    </ThemedView>
  );
}

function TextPart({ part }: { part: { type: 'text'; text: string } }) {
  const role = useAuiState((s) => s.message.role);
  if (role === 'user') {
    return (
      <ThemedText className='text-base leading-5.5 tracking-tight text-foreground'>
        {part.text}
      </ThemedText>
    );
  }
  return (
    <ThemedText className='text-base leading-6 tracking-tight'>
      {part.text}
    </ThemedText>
  );
}

function MessageImageAttachment() {
  const attachment = useAuiState((s) => s.attachment);
  if (!attachment) return null;

  const imageContent = attachment.content?.find((c: any) => c.type === 'image');
  const uri = (imageContent as any)?.image;
  if (!uri) return null;

  return <StyledImage className='size-50 mb-1 rounded-xl' source={{ uri }} />;
}

export function MessageBubble() {
  const role = useAuiState((s) => s.message.role);
  const isRunning = useAuiState((s) => s.message.status?.type === 'running');
  const isUser = role === 'user';

  if (isUser) {
    return (
      <ThemedView className='items-end px-4 py-1.5'>
        <MessagePrimitive.Attachments>
          {() => <MessageImageAttachment />}
        </MessagePrimitive.Attachments>
        <ThemedView className='max-w-[85%] px-4 py-5 rounded-[20] rounded-br-md'>
          <MessagePrimitive.Content
            renderText={({ part }) => <TextPart part={part} />}
          />
        </ThemedView>
        <MessageBranchPicker />
      </ThemedView>
    );
  }

  return (
    <ThemedView className='items-start px-4 py-1.5'>
      <ThemedView className='max-w-[85%] px-4 py-5 rounded-[20] rounded-bl-md'>
        <MessagePrimitive.Content
          renderText={({ part }) => <TextPart part={part} />}
        />
        <MessageError />
      </ThemedView>
      {!isRunning && (
        <ThemedView className='flex-row items-center gap-1 mt-1'>
          <MessageBranchPicker />
          <MessageActionBar />
        </ThemedView>
      )}
    </ThemedView>
  );
}
