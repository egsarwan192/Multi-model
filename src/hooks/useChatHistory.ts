'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChatHistory, ChatMessage } from '@/types/chat';
import {
  getAllChats,
  saveChat,
  loadChat,
  deleteChat,
  generateId,
} from '@/lib/chatHistory';

export function useChatHistory() {
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Load chats from local storage on mount
  useEffect(() => {
    try {
      const loadedChats = getAllChats();
      setChats(loadedChats);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh chats from local storage
  const refreshChats = useCallback(() => {
    try {
      const loadedChats = getAllChats();
      setChats(loadedChats);
    } catch (error) {
      console.error('Failed to refresh chat history:', error);
    }
  }, []);

  // Create a new chat
  const createChat = useCallback((model: string): string => {
    const chatId = generateId();

    try {
      const newChat: ChatHistory = {
        id: chatId,
        title: 'New Chat',
        messages: [],
        model,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const existingChats = getAllChats();
      const updatedChats = [newChat, ...existingChats];

      localStorage.setItem('chat-history', JSON.stringify(updatedChats));
      setChats(updatedChats);

      return chatId;
    } catch (error) {
      console.error('Failed to create new chat:', error);
      throw error;
    }
  }, []);

  // Save chat messages
  const saveChatMessages = useCallback((chatId: string, messages: ChatMessage[], model: string) => {
    try {
      saveChat(chatId, messages, model);
      refreshChats();
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  }, [refreshChats]);

  // Load a specific chat
  const loadChatById = useCallback((chatId: string): ChatHistory | null => {
    try {
      return loadChat(chatId);
    } catch (error) {
      console.error('Failed to load chat:', error);
      return null;
    }
  }, []);

  // Delete a chat
  const deleteChatById = useCallback((chatId: string) => {
    try {
      deleteChat(chatId);
      refreshChats();
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  }, [refreshChats]);

  // Get chat by ID
  const getChatById = useCallback((chatId: string): ChatHistory | undefined => {
    return chats.find(chat => chat.id === chatId);
  }, [chats]);

  // Clear all chats
  const clearAllChats = useCallback(() => {
    try {
      localStorage.removeItem('chat-history');
      setChats([]);
    } catch (error) {
      console.error('Failed to clear all chats:', error);
    }
  }, []);

  return {
    chats,
    loading,
    refreshChats,
    createChat,
    saveChatMessages,
    loadChatById,
    deleteChatById,
    getChatById,
    clearAllChats,
  };
}