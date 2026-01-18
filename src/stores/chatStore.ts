import { create } from 'zustand';
import {
  sendChatMessage,
  fetchConversationMessages,
  type ChatMessage,
  type ChatContext,
  type ChatHistoryMessage,
} from '../api/chat';
import { joinSupportConversation, onSupportMessage } from '../realtime/chatSocket';

interface ChatStore {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  sessionId: string;
  conversationId: string | null;
  lastError: string | null;

  open: () => void;
  close: () => void;
  sendMessage: (content: string, context: ChatContext) => Promise<void>;
  retry: (context: ChatContext) => Promise<void>;
  reset: () => void;
  loadMessages: () => void;
  setConversationId: (conversationId: string | null) => void;
  appendMessage: (message: ChatMessage) => void;
}

const STORAGE_KEY = 'zipto-chat-messages';
const SESSION_KEY = 'zipto-chat-session';
const CONVERSATION_KEY = 'zipto-chat-conversation';
const DEDUPE_WINDOW_MS = 1500;

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

function getConversationId(): string | null {
  return localStorage.getItem(CONVERSATION_KEY);
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

function mapBackendRoleToUiRole(role?: string): ChatMessage['role'] {
  if (role === 'customer' || role === 'user') return 'user';
  if (role === 'assistant') return 'assistant';
  return 'assistant';
}

function resolveMessageContent(payload: {
  content?: string;
  message?: string;
}): string {
  return payload.content || payload.message || '';
}

function resolveMessageTimestamp(payload: {
  createdAt?: string | number;
  timestamp?: number;
}): number {
  if (typeof payload.timestamp === 'number') return payload.timestamp;
  if (typeof payload.createdAt === 'number') return payload.createdAt;
  if (typeof payload.createdAt === 'string') {
    const parsed = Date.parse(payload.createdAt);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return Date.now();
}

function buildChatMessageFromBackend(payload: ChatHistoryMessage): ChatMessage {
  const timestamp = resolveMessageTimestamp(payload);
  const messageId = payload.messageId;
  return {
    id: messageId || `support-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    role: mapBackendRoleToUiRole(payload.role),
    content: resolveMessageContent(payload),
    timestamp,
    messageId,
  };
}

function isDuplicateMessage(existing: ChatMessage, incoming: ChatMessage): boolean {
  if (incoming.messageId && existing.messageId === incoming.messageId) {
    return true;
  }
  return (
    existing.role === incoming.role &&
    existing.content === incoming.content &&
    Math.abs(existing.timestamp - incoming.timestamp) <= DEDUPE_WINDOW_MS
  );
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: loadMessagesFromStorage(),
  isOpen: false,
  isLoading: false,
  sessionId: getSessionId(),
  conversationId: getConversationId(),
  lastError: null,

  open: () => set({ isOpen: true }),

  close: () => set({ isOpen: false }),

  sendMessage: async (content: string, context: ChatContext) => {
    const { messages, sessionId, conversationId } = get();

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
        conversationId: conversationId ?? undefined,
      });

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: response.messageId || `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.replyText,
        timestamp: Date.now(),
        messageId: response.messageId,
      };

      get().appendMessage(assistantMessage);
      set({ isLoading: false });

      if (response.conversationId && !conversationId) {
        get().setConversationId(response.conversationId);
      }
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
    localStorage.removeItem(CONVERSATION_KEY);
    set({
      messages: [],
      sessionId: newSessionId,
      conversationId: null,
      lastError: null,
      isLoading: false,
    });
  },

  loadMessages: () => {
    const messages = loadMessagesFromStorage();
    set({ messages });
  },

  setConversationId: (conversationId: string | null) => {
    if (conversationId) {
      localStorage.setItem(CONVERSATION_KEY, conversationId);
      joinSupportConversation(conversationId);
    } else {
      localStorage.removeItem(CONVERSATION_KEY);
    }
    set({ conversationId });
  },

  appendMessage: (message: ChatMessage) => {
    const { messages } = get();
    if (messages.some(existing => isDuplicateMessage(existing, message))) {
      return;
    }
    const updatedMessages = [...messages, message];
    set({ messages: updatedMessages });
    saveMessagesToStorage(updatedMessages);
  },
}));

let socketInitialized = false;

function initializeChatSocket() {
  if (socketInitialized) return;
  socketInitialized = true;

  onSupportMessage((payload) => {
    const currentConversationId = useChatStore.getState().conversationId;
    if (!currentConversationId || payload.conversationId !== currentConversationId) {
      return;
    }

    const backendMessage = payload.message;
    if (!backendMessage || backendMessage.role === 'internal_note') {
      return;
    }

    const message = buildChatMessageFromBackend(backendMessage);
    if (!message.content) {
      return;
    }

    useChatStore.getState().appendMessage(message);
  });

  const initialConversationId = useChatStore.getState().conversationId;
  if (initialConversationId) {
    joinSupportConversation(initialConversationId);
  }

  let lastConversationId = initialConversationId;
  useChatStore.subscribe((state) => {
    if (state.conversationId && state.conversationId !== lastConversationId) {
      joinSupportConversation(state.conversationId);
    }
    lastConversationId = state.conversationId;
  });
}

async function hydrateConversationHistory() {
  const { conversationId, messages } = useChatStore.getState();
  if (!conversationId || messages.length > 0) return;

  const history = await fetchConversationMessages(conversationId, 50);
  if (!history.length) return;

  const mappedMessages = history
    .map(buildChatMessageFromBackend)
    .filter(message => message.content);

  if (!mappedMessages.length) return;

  useChatStore.setState({ messages: mappedMessages });
  saveMessagesToStorage(mappedMessages);
}

initializeChatSocket();
void hydrateConversationHistory();
