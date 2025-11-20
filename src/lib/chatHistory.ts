import { ChatHistory, ChatMessage } from '@/types/chat';

const CHAT_HISTORY_KEY = 'chat-history';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function generateChatTitle(messages: ChatMessage[]): string {
  if (messages.length === 0) return 'New Chat';

  const firstUserMessage = messages.find(msg => msg.role === 'user');
  if (!firstUserMessage) return 'New Chat';

  // Take first 50 characters of the first user message
  const title = firstUserMessage.content.substring(0, 50);
  return title.length < 50 ? title : title + '...';
}

export function saveChat(chatId: string, messages: ChatMessage[], model: string): void {
  try {
    const existingChats = getAllChats();
    const now = new Date();

    const chat: ChatHistory = {
      id: chatId,
      title: generateChatTitle(messages),
      messages,
      model,
      createdAt: now,
      updatedAt: now,
    };

    const updatedChats = existingChats.filter(chat => chat.id !== chatId);
    updatedChats.push(chat);

    // Sort by updated date (newest first)
    updatedChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedChats));
  } catch (error) {
    console.error('Failed to save chat:', error);
  }
}

export function loadChat(chatId: string): ChatHistory | null {
  try {
    const chats = getAllChats();
    return chats.find(chat => chat.id === chatId) || null;
  } catch (error) {
    console.error('Failed to load chat:', error);
    return null;
  }
}

export function deleteChat(chatId: string): void {
  try {
    const existingChats = getAllChats();
    const updatedChats = existingChats.filter(chat => chat.id !== chatId);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedChats));
  } catch (error) {
    console.error('Failed to delete chat:', error);
  }
}

export function getAllChats(): ChatHistory[] {
  try {
    const data = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!data) return [];

    const chats = JSON.parse(data) as ChatHistory[];

    // Convert date strings back to Date objects
    return chats.map(chat => ({
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
      messages: chat.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [];
  }
}

export function clearAllChats(): void {
  try {
    localStorage.removeItem(CHAT_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear chat history:', error);
  }
}