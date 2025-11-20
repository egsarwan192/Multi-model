'use client';

import { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useChatHistory } from '@/hooks/useChatHistory';
import { DEFAULT_MODEL } from '@/lib/openrouter';
import Sidebar from '@/components/layout/Sidebar';
import ChatContainer from '@/components/chat/ChatContainer';
import ModelSelector from '@/components/chat/ModelSelector';

export default function Home() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const chatHistory = useChatHistory();
  const chat = useChat({
    initialModel: DEFAULT_MODEL,
    onChatUpdate: (messages, model) => {
      if (currentChatId) {
        chatHistory.saveChatMessages(currentChatId, messages, model);
      }
    },
  });

  // Load chat on mount or when chat ID changes
  useEffect(() => {
    if (currentChatId) {
      const loadedChat = chatHistory.loadChatById(currentChatId);
      if (loadedChat) {
        chat.setMessages(loadedChat.messages);
        chat.setCurrentModel(loadedChat.model);
      }
    } else {
      chat.clearChat();
    }
  }, [currentChatId, chatHistory, chat.setMessages, chat.setCurrentModel, chat.clearChat]);

  const handleNewChat = () => {
    const newChatId = chatHistory.createChat(chat.currentModel);
    setCurrentChatId(newChatId);
    chat.clearChat();
    setIsSidebarCollapsed(true); // Close sidebar on mobile after creating new chat
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setIsSidebarCollapsed(true); // Close sidebar on mobile after selecting chat
  };

  const handleDeleteChat = (chatId: string) => {
    chatHistory.deleteChatById(chatId);

    if (currentChatId === chatId) {
      setCurrentChatId(null);
      chat.clearChat();
    }
  };

  const handleSelectModel = (modelId: string) => {
    chat.setCurrentModel(modelId);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar
        chats={chatHistory.chats}
        currentChatId={currentChatId}
        currentModel={chat.currentModel}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onOpenModelSelector={() => setIsModelSelectorOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatContainer
          messages={chat.messages}
          isLoading={chat.isLoading}
          error={chat.error}
          currentModel={chat.currentModel}
          onSendMessage={chat.sendMessage}
          onRetry={chat.retryLastMessage}
        />
      </div>

      {/* Model Selector Modal */}
      <ModelSelector
        isOpen={isModelSelectorOpen}
        onClose={() => setIsModelSelectorOpen(false)}
        onSelectModel={handleSelectModel}
        currentModel={chat.currentModel}
      />
    </div>
  );
}
