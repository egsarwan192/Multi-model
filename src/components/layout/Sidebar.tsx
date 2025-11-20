'use client';

import { useState } from 'react';
import { Plus, Settings, MessageSquare, Trash2, Menu, X } from 'lucide-react';
import { ChatHistory } from '@/types/chat';
import { getModelById } from '@/lib/openrouter';
import clsx from 'clsx';

interface SidebarProps {
  chats: ChatHistory[];
  currentChatId: string | null;
  currentModel: string;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onOpenModelSelector: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  chats,
  currentChatId,
  currentModel,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onOpenModelSelector,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const currentModelInfo = getModelById(currentModel);
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (deleteConfirmId === chatId) {
      onDeleteChat(chatId);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(chatId);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed left-0 top-0 h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-50',
          'w-80',
          isCollapsed ? '-translate-x-full' : 'translate-x-0',
          'lg:relative lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Multi-LLM Chat
              </h1>
              <button
                onClick={onToggleCollapse}
                className="lg:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>

            <button
              onClick={onOpenModelSelector}
              className="w-full mt-3 flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                  {currentModelInfo?.name || 'Select Model'}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {currentModelInfo?.free ? 'Free' : 'Paid'}
              </div>
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-4">
            {chats.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No chat history yet
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Start a new conversation to see it here
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={clsx(
                      'group relative p-3 rounded-lg cursor-pointer transition-all duration-200',
                      currentChatId === chat.id
                        ? 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
                    )}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {chat.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(chat.updatedAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className={clsx(
                          'p-1 rounded transition-colors opacity-0 group-hover:opacity-100',
                          deleteConfirmId === chat.id
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500'
                        )}
                      >
                        {deleteConfirmId === chat.id ? (
                          <Trash2 className="w-3 h-3" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    {deleteConfirmId === chat.id && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        Click again to confirm delete
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full flex items-center justify-center gap-2 p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      {!isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
        >
          <Menu className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      )}
    </>
  );
}