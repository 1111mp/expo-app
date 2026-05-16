import {
  AssistantChatTransport,
  useChatRuntime,
} from '@assistant-ui/react-ai-sdk';
import { lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { useMemo } from 'react';

const CHAT_API = 'http://localhost:3000/api/chat';

export function useAppRuntime() {
  const transport = useMemo(
    () => new AssistantChatTransport({ api: CHAT_API }),
    [],
  );
  return useChatRuntime({
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });
}
