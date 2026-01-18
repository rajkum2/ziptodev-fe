import { io, Socket } from 'socket.io-client';
import { CHAT_SOCKET_URL, type ChatHistoryMessage } from '../api/chat';

export interface SupportMessagePayload {
  conversationId?: string;
  messageId?: string;
  role?: string;
  content?: string;
  message?: ChatHistoryMessage;
  createdAt?: string | number;
  timestamp?: number;
  metadata?: unknown;
}

type SupportMessageHandler = (payload: SupportMessagePayload) => void;

let socket: Socket | null = null;
const SESSION_KEY = 'zipto-chat-session';

function getSessionIdFromStorage(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

function getSocket(): Socket {
  if (!socket) {
    socket = io(CHAT_SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
    socket.on('connect', () => {
      console.info('[chatSocket] connected');
    });
    socket.on('connect_error', (error) => {
      console.warn('[chatSocket] connect error', error);
    });
  }
  return socket;
}

export function ensureChatSocketConnected(): Socket {
  const activeSocket = getSocket();
  if (!activeSocket.connected) {
    const sessionId = getSessionIdFromStorage();
    if (sessionId) {
      activeSocket.auth = { sessionId };
    }
    activeSocket.connect();
  }
  return activeSocket;
}

export function joinSupportConversation(conversationId: string) {
  if (!conversationId) return;
  const activeSocket = ensureChatSocketConnected();
  activeSocket.emit('support:join_conversation', { conversationId });
}

export function onSupportMessage(handler: SupportMessageHandler) {
  const activeSocket = getSocket();
  activeSocket.on('conversation:new_message', handler);
  return () => {
    activeSocket.off('conversation:new_message', handler);
  };
}

export function disconnectChatSocket() {
  socket?.disconnect();
}

