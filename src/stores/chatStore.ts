import { create } from 'zustand';
import { sendChatMessage, type ChatMessage, type ChatContext } from '../api/chat';

interface ChatStore {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  sessionId: string;
  lastError: string | null;

  open: () => void;
  close: () => void;
  sendMessage: (content: string, context: ChatContext) => Promise<void>;
  retry: (context: ChatContext) => Promise<void>;
  reset: () => void;
  loadMessages: () => void;
}

const STORAGE_KEY = 'zipto-chat-messages';
const SESSION_KEY = 'zipto-chat-session';

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function loadMessagesFromStorage(): ChatMessage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load chat messages:', error);
  }
  return [];
}

function saveMessagesToStorage(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save chat messages:', error);
  }
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: loadMessagesFromStorage(),
  isOpen: false,
  isLoading: false,
  sessionId: getSessionId(),
  lastError: null,

  open: () => set({ isOpen: true }),

  close: () => set({ isOpen: false }),

  sendMessage: async (content: string, context: ChatContext) => {
    const { messages, sessionId } = get();

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    set({ messages: newMessages, isLoading: true, lastError: null });
    saveMessagesToStorage(newMessages);

    try {
      const response = await sendChatMessage({
        sessionId,
        userId: null,
        message: content,
        context,
      });

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.replyText,
        timestamp: Date.now(),
      };

      const updatedMessages = [...newMessages, assistantMessage];
      set({ messages: updatedMessages, isLoading: false });
      saveMessagesToStorage(updatedMessages);
    } catch (error) {
      set({
        isLoading: false,
        lastError: 'Failed to send message. Please try again.',
      });
    }
  },

  retry: async (context: ChatContext) => {
    const { messages } = get();

    // Find the last user message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');

    if (lastUserMessage) {
      // Remove any error messages after the last user message
      const filteredMessages = messages.filter(m =>
        m.timestamp <= lastUserMessage.timestamp || !m.error
      );

      set({ messages: filteredMessages, lastError: null });
      saveMessagesToStorage(filteredMessages);

      // Retry sending the last user message
      await get().sendMessage(lastUserMessage.content, context);
    }
  },

  reset: () => {
    const newSessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, newSessionId);
    localStorage.removeItem(STORAGE_KEY);
    set({
      messages: [],
      sessionId: newSessionId,
      lastError: null,
      isLoading: false,
    });
  },

  loadMessages: () => {
    const messages = loadMessagesFromStorage();
    set({ messages });
  },
}));
