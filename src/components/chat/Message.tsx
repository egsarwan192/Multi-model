'use client';

import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '@/types/chat';
import clsx from 'clsx';

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface AnchorProps {
  href?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface MessageProps {
  message: ChatMessage;
  streaming?: boolean;
}

export default function Message({ message, streaming }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={clsx(
        'w-full px-4 py-6',
        isUser ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
      )}
    >
      <div className="max-w-3xl mx-auto flex gap-4">
        <div
          className={clsx(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0',
            isUser
              ? 'bg-green-600 text-white'
              : 'bg-gray-600 dark:bg-gray-700 text-white'
          )}
        >
          {isUser ? 'U' : 'AI'}
        </div>

        <div className="flex-1 space-y-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {message.role === 'user' ? 'You' : 'Assistant'}
            <span className="ml-2">
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div
            className={clsx(
              'prose prose-sm max-w-none dark:prose-invert',
              isUser
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-800 dark:text-gray-200'
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <>
                <ReactMarkdown
                  components={{
                    code: ({ inline, className, children, ...props }: CodeProps) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code
                          className={clsx(
                            'bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm',
                            className
                          )}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    a: ({ href, children, ...props }: AnchorProps) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {streaming && (
                  <span className="inline-block w-2 h-4 bg-gray-400 dark:bg-gray-600 ml-1 animate-pulse" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}