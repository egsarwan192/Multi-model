'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import Message from './Message';
import ChatInput from './ChatInput';
import { Bot, Loader2 } from 'lucide-react';

interface ChatContainerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentModel: string;
  onSendMessage: (message: string) => void;
  onRetry?: () => void;
}

export default function ChatContainer({
  messages,
  isLoading,
  error,
  currentModel,
  onSendMessage,
  onRetry,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-lg mx-auto px-4">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <Bot className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              How can I help you today?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Ask me anything! I'm here to assist with information, creative tasks, analysis, and more.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              Using: <span className="font-medium">{currentModel}</span>
            </div>
          </div>
        </div>
        <ChatInput
          onSendMessage={onSendMessage}
          disabled={isLoading}
          placeholder="Start a conversation..."
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <Message
            key={message.id}
            message={message}
            streaming={isLoading && index === messages.length - 1 && message.role === 'assistant'}
          />
        ))}

        {isLoading && (
          <div className="w-full px-4 py-6 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-700 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Assistant
                </div>
                <div className="text-gray-800 dark:text-gray-200">
                  <span className="inline-block w-2 h-4 bg-gray-400 dark:bg-gray-600 mr-1 animate-pulse" />
                  <span className="inline-block w-2 h-4 bg-gray-400 dark:bg-gray-600 mr-1 animate-pulse" />
                  <span className="inline-block w-2 h-4 bg-gray-400 dark:bg-gray-600 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="w-full px-4 py-6 bg-red-50 dark:bg-red-900/20 border-t border-b border-red-200 dark:border-red-800">
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-100 dark:bg-red-800 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <h3 className="text-red-800 dark:text-red-200 font-medium mb-2">
                  Something went wrong
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                  {error}
                </p>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={onSendMessage}
        disabled={isLoading}
        placeholder={messages.length === 0 ? "Start a conversation..." : "Type your message..."}
      />
    </div>
  );
}