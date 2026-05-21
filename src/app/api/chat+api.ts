import { deepseek } from '@ai-sdk/deepseek';
import { frontendTools } from '@assistant-ui/react-ai-sdk';
import { convertToModelMessages, streamText } from 'ai';

export async function POST(request: Request) {
  const { messages, tools } = await request.json();
  const result = streamText({
    model: deepseek('deepseek-chat'),
    messages: await convertToModelMessages(messages),
    tools: {
      ...frontendTools(tools),
    },
  });
  return result.toUIMessageStreamResponse();
}
