import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChatBubble } from './ChatBubble';
import { ChatTypingIndicator } from './ChatTypingIndicator';
import type { ChatMessage } from '../../api/chat';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Welcome to Zipto Assistant
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Ask me anything about your orders, products, or how I can help you today.
            </p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </AnimatePresence>

      {isLoading && <ChatTypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
}
