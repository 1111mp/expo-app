import { ThreadPrimitive, useAui } from '@assistant-ui/react-native';
import { useHeaderHeight } from 'expo-router/build/react-navigation';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

import { StyledSafeAreaView, ThemedText, ThemedView } from '@/components';
import { withUniwind } from 'uniwind';
import { Composer } from './composer';
import { MessageBubble } from './message';

const StyledThreadMessages = withUniwind(ThreadPrimitive.Messages);

function SuggestionChip({ title, prompt }: { title: string; prompt: string }) {
  const aui = useAui();

  return (
    <Pressable
      onPress={() => aui.thread().append(prompt)}
      className='px-4 py-2.5 rounded-2xl bg-secondary'
    >
      <ThemedText className='text-sm tracking-tight'>{title}</ThemedText>
    </Pressable>
  );
}

const defaultSuggestions = [
  {
    title: "What's the weather in Tokyo?",
    prompt: "What's the weather in Tokyo?",
  },
  { title: 'Tell me a joke', prompt: 'Tell me a joke' },
  { title: 'Help me write an email', prompt: 'Help me write an email' },
];

function Suggestions() {
  return (
    <View className='flex-row flex-wrap justify-center gap-2 mt-5 px-4'>
      {defaultSuggestions.map((s, i) => (
        <SuggestionChip key={i} title={s.title} prompt={s.prompt} />
      ))}
    </View>
  );
}

function EmptyState() {
  return (
    <View className='flex-1 justify-center items-center p-10'>
      <View className='justify-center items-center size-18 mb-5 rounded-full bg-blue-100'>
        <ThemedText className='text-3xl'>💭</ThemedText>
      </View>
      <ThemedText className='text-2xl font-semibold mb-2 tracking-tight'>
        How can I help?
      </ThemedText>
      <ThemedText className='text-sm text-center tracking-tight'>
        Send a message to start chatting
      </ThemedText>
      <Suggestions />
    </View>
  );
}

export function Thread() {
  const headerHeight = useHeaderHeight();

  return (
    <ThemedView className='flex-1'>
      <StyledSafeAreaView
        className='flex-1'
        edges={['bottom', 'left', 'right']}
      >
        <KeyboardAvoidingView
          className='flex-1'
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View className='flex-1'>
            <ThreadPrimitive.Empty>
              <EmptyState />
            </ThreadPrimitive.Empty>
            <ThreadPrimitive.If empty={false}>
              <StyledThreadMessages
                showsVerticalScrollIndicator={true}
                components={{ Message: MessageBubble }}
                contentContainerClassName='min-h-full px-1 pb-6'
                contentContainerStyle={{ paddingTop: headerHeight }}
              />
            </ThreadPrimitive.If>
          </View>
          <View>
            <Composer />
          </View>
        </KeyboardAvoidingView>
      </StyledSafeAreaView>
    </ThemedView>
  );
}
