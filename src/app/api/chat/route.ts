import { streamText } from 'ai';
import { openrouter } from '@/lib/openrouter';
import { ChatMessage } from '@/types/chat';

export async function POST(req: Request) {
  try {
    const { messages, model }: { messages: ChatMessage[]; model: string } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Messages are required and must be a non-empty array' },
        { status: 400 }
      );
    }

    if (!model) {
      return Response.json(
        { error: 'Model is required' },
        { status: 400 }
      );
    }

    // Convert messages to the format expected by the AI SDK
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const result = streamText({
      model: openrouter(model),
      messages: formattedMessages,
      temperature: 0.7,
    });

    return result.toAIStreamResponse();

  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof Error) {
      // Handle specific OpenRouter errors
      if (error.message.includes('API key')) {
        return Response.json(
          { error: 'Invalid API key. Please check your OpenRouter API key.' },
          { status: 401 }
        );
      }

      if (error.message.includes('rate limit')) {
        return Response.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      if (error.message.includes('model')) {
        return Response.json(
          { error: 'Invalid model specified.' },
          { status: 400 }
        );
      }
    }

    return Response.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}