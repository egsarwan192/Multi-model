'use client';

import { useState, useCallback } from 'react';
import { ChatMessage, ChatState } from '@/types/chat';
import { generateId } from '@/lib/chatHistory';

interface UseChatProps {
  initialModel: string;
  onChatUpdate?: (messages: ChatMessage[], model: string) => void;
}

export function useChat({ initialModel, onChatUpdate }: UseChatProps) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    currentModel: initialModel,
  });

  const updateState = useCallback((updates: Partial<ChatState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date(),
    };

    setState(prev => {
      const updatedMessages = [...prev.messages, newMessage];
      onChatUpdate?.(updatedMessages, prev.currentModel);
      return {
        ...prev,
        messages: updatedMessages,
      };
    });
  }, [onChatUpdate]);

  const updateLastMessage = useCallback((content: string) => {
    setState(prev => {
      const messages = [...prev.messages];
      const lastMessage = messages[messages.length - 1];

      if (lastMessage && lastMessage.role === 'assistant') {
        messages[messages.length - 1] = {
          ...lastMessage,
          content,
        };
        onChatUpdate?.(messages, prev.currentModel);
      }

      return {
        ...prev,
        messages,
      };
    });
  }, [onChatUpdate]);

  const sendMessage = useCallback(async (content: string) => {
    if (state.isLoading) return;

    try {
      // Add user message
      addMessage({
        role: 'user',
        content,
      });

      // Clear any previous errors and set loading state
      updateState({
        isLoading: true,
        error: null,
      });

      // Add empty assistant message for streaming
      addMessage({
        role: 'assistant',
        content: '',
      });

      // Prepare messages for API
      const messagesForApi = state.messages.concat({
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(),
      });

      // Call the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesForApi,
          model: state.currentModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('0:')) {
            // Remove the "0:" prefix and parse JSON
            try {
              const jsonStr = line.slice(2);
              const data = JSON.parse(jsonStr);
              if (data.type === 'text-delta' && data.textDelta) {
                accumulatedContent += data.textDelta;
                updateLastMessage(accumulatedContent);
              }
            } catch {
              // Skip invalid JSON
              continue;
            }
          }
        }
      }

      updateState({ isLoading: false });

    } catch (error) {
      console.error('Chat error:', error);

      // Remove the empty assistant message if streaming failed
      setState(prev => ({
        ...prev,
        messages: prev.messages.slice(0, -1),
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }));
    }
  }, [state.isLoading, state.messages, state.currentModel, addMessage, updateState, updateLastMessage]);

  const retryLastMessage = useCallback(() => {
    if (state.messages.length < 2) return;

    // Remove the last assistant message and the user message before it
    const userMessage = state.messages[state.messages.length - 2];

    setState(prev => ({
      ...prev,
      messages: prev.messages.slice(0, -2),
      error: null,
    }));

    if (userMessage && userMessage.role === 'user') {
      sendMessage(userMessage.content);
    }
  }, [state.messages, sendMessage]);

  const setMessages = useCallback((messages: ChatMessage[]) => {
    setState(prev => ({
      ...prev,
      messages,
    }));
  }, []);

  const setCurrentModel = useCallback((model: string) => {
    setState(prev => ({
      ...prev,
      currentModel: model,
    }));
    onChatUpdate?.(state.messages, model);
  }, [state.messages, onChatUpdate]);

  const clearChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
      error: null,
    }));
    onChatUpdate?.([], state.currentModel);
  }, [state.currentModel, onChatUpdate]);

  return {
    ...state,
    sendMessage,
    retryLastMessage,
    setMessages,
    setCurrentModel,
    clearChat,
  };
}