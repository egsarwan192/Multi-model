'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import clsx from 'clsx';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className={clsx(
                'w-full px-4 py-3 pr-12 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
                'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600',
                'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              style={{
                minHeight: '52px',
                maxHeight: '120px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
              {message.length}
            </div>
          </div>

          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className={clsx(
              'p-3 rounded-lg transition-colors duration-200 flex items-center justify-center',
              'bg-green-600 hover:bg-green-700 text-white',
              'disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed',
              'min-w-[52px] min-h-[52px]'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </form>
    </div>
  );
}