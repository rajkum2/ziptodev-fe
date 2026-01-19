export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  messageId?: string;
  error?: boolean;
}

export interface ChatContext {
  page: 'home' | 'category' | 'product' | 'cart' | 'orders' | 'profile';
  cartSummary?: {
    itemCount: number;
    total: number;
  };
  lastOrderId?: string | null;
}

export interface ChatRequest {
  sessionId: string;
  userId: string | null;
  message: string;
  context: ChatContext;
  mode?: 'chat' | 'rag' | 'auto';
  documentId?: string;
  conversationId?: string;
}

export interface ChatCard {
  [key: string]: unknown;
}

export interface ChatResponse {
  replyText: string;
  cards?: ChatCard[];
  traceId: string;
  conversationId?: string;
  messageId?: string;
  metadata?: unknown;
}

interface ChatApiPayload {
  success?: boolean;
  data?: {
    replyText?: string;
    traceId?: string;
    cards?: ChatCard[];
    error?: { message?: string };
    provider?: string;
    model?: string;
    healthy?: boolean;
    conversationId?: string;
    messageId?: string;
    metadata?: unknown;
  };
  replyText?: string;
  traceId?: string;
  cards?: ChatCard[];
  error?: { message?: string };
  message?: string;
  provider?: string;
  model?: string;
  healthy?: boolean;
  conversationId?: string;
  messageId?: string;
  metadata?: unknown;
}

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const CHAT_API_URL = `${BASE}/api/chat/message`;
const CHAT_HEALTH_URL = `${BASE}/api/chat/health`;
export const CHAT_SOCKET_URL = import.meta.env.VITE_SOCKET_URL || BASE;
const REQUEST_TIMEOUT = 45000; // 45 seconds for local AI models

function generateTraceId(): string {
  return `trace-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function generateSessionId(): string {
  return `zipto-web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function resolveTraceId(payload: ChatApiPayload | null): string {
  return (
    payload?.data?.traceId ||
    payload?.traceId ||
    generateTraceId()
  );
}

function resolveCards(payload: ChatApiPayload | null): ChatCard[] {
  return payload?.data?.cards || payload?.cards || [];
}

function resolveReplyText(payload: ChatApiPayload | null): string | undefined {
  return payload?.data?.replyText || payload?.replyText;
}

function resolveConversationId(payload: ChatApiPayload | null): string | undefined {
  return payload?.data?.conversationId || payload?.conversationId;
}

function resolveMessageId(payload: ChatApiPayload | null): string | undefined {
  return payload?.data?.messageId || payload?.messageId;
}

function resolveMetadata(payload: ChatApiPayload | null): unknown {
  return payload?.data?.metadata ?? payload?.metadata;
}

function resolveErrorMessage(payload: ChatApiPayload | null): string | undefined {
  return payload?.error?.message || payload?.message;
}

export async function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
  const preparedPayload: ChatRequest = {
    ...payload,
    sessionId: payload.sessionId?.trim() || generateSessionId(),
    mode: payload.mode ?? 'auto',  // 'auto' enables RAG when knowledge docs are available
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preparedPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = (await response.json().catch(() => null)) as ChatApiPayload | null;

    if (!response.ok || data?.success === false) {
      const traceId = resolveTraceId(data);
      const backendMessage = resolveErrorMessage(data);

      if (response.status === 429) {
        return {
          replyText: 'Too many requests. Please wait a moment and try again.',
          cards: [],
          traceId,
        };
      }

      if (response.status === 500) {
        return {
          replyText: 'Something went wrong. Please try again.',
          cards: [],
          traceId,
        };
      }

      return {
        replyText:
          backendMessage || 'Assistant is currently unavailable. Please try again.',
        cards: [],
        traceId,
      };
    }

    return {
      replyText:
        resolveReplyText(data) || 'Assistant is currently unavailable. Please try again.',
      cards: resolveCards(data),
      traceId: resolveTraceId(data),
      conversationId: resolveConversationId(data),
      messageId: resolveMessageId(data),
      metadata: resolveMetadata(data),
    };
  } catch (error) {
    console.error('Chat API error:', error);

    const isAbort = error instanceof DOMException && error.name === 'AbortError';
    const isNetwork =
      error instanceof TypeError ||
      (error && typeof error === 'object' && 'message' in error &&
        typeof (error as { message?: string }).message === 'string' &&
        (error as { message?: string }).message?.toLowerCase().includes('fetch'));

    if (isAbort) {
      return {
        replyText: 'The assistant is taking longer than usual. Please try again.',
        cards: [],
        traceId: generateTraceId(),
      };
    }

    if (isNetwork) {
      return {
        replyText: 'Assistant is currently unavailable. Please try again.',
        cards: [],
        traceId: generateTraceId(),
      };
    }

    return {
      replyText: 'Something went wrong. Please try again.',
      cards: [],
      traceId: generateTraceId(),
    };
  }
}

export interface ChatHistoryMessage {
  messageId?: string;
  conversationId?: string;
  role?: string;
  content?: string;
  message?: string;
  createdAt?: string | number;
  timestamp?: number;
  metadata?: unknown;
}

export async function fetchConversationMessages(
  conversationId: string,
  limit = 50
): Promise<ChatHistoryMessage[]> {
  try {
    const response = await fetch(
      `${BASE}/api/chat/conversation/${encodeURIComponent(conversationId)}/messages?limit=${limit}`
    );
    const data = (await response.json().catch(() => null)) as
      | { data?: ChatHistoryMessage[]; messages?: ChatHistoryMessage[] }
      | ChatHistoryMessage[]
      | null;

    if (!response.ok) {
      return [];
    }

    if (Array.isArray(data)) {
      return data;
    }

    return data?.data || data?.messages || [];
  } catch (error) {
    console.error('Chat history fetch error:', error);
    return [];
  }
}

export async function checkChatHealth(): Promise<{
  healthy: boolean;
  provider?: string;
  model?: string;
}> {
  try {
    const response = await fetch(CHAT_HEALTH_URL);
    const data = (await response.json().catch(() => null)) as ChatApiPayload | null;

    if (!response.ok) {
      return { healthy: false };
    }

    const healthPayload = data?.data || data;
    return {
      healthy: Boolean(healthPayload?.healthy ?? true),
      provider: healthPayload?.provider,
      model: healthPayload?.model,
    };
  } catch (error) {
    console.error('Chat health check error:', error);
    return { healthy: false };
  }
}
