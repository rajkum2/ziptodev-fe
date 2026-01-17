import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, RotateCcw, AlertCircle } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useCartStore } from '../../stores/cartStore';
import { ChatMessageList } from './ChatMessageList';
import { ChatQuickChips } from './ChatQuickChips';
import type { ChatContext } from '../../api/chat';

export function ChatDrawerModal() {
  const { isOpen, close, messages, isLoading, lastError, sendMessage, reset, retry } =
    useChatStore();
  const { items } = useCartStore();
  const [input, setInput] = useState('');
  const [showQuickChips, setShowQuickChips] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setShowQuickChips(false);
    }
  }, [messages.length]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const getCurrentContext = (): ChatContext => {
    const path = window.location.pathname;
    let page: ChatContext['page'] = 'home';

    if (path.includes('/category')) page = 'category';
    else if (path.includes('/p/')) page = 'product';
    else if (path.includes('/cart')) page = 'cart';
    else if (path.includes('/orders')) page = 'orders';
    else if (path.includes('/account')) page = 'profile';

    const cartSummary = {
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    return {
      page,
      cartSummary,
      lastOrderId: null,
    };
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const context = getCurrentContext();
    await sendMessage(input, context);
    setInput('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = async (text: string) => {
    const context = getCurrentContext();
    await sendMessage(text, context);
  };

  const handleReset = () => {
    reset();
    setShowQuickChips(true);
    setShowResetConfirm(false);
  };

  const handleRetry = async () => {
    const context = getCurrentContext();
    await retry(context);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    e.target.style.height = 'auto';
    const newHeight = Math.min(e.target.scrollHeight, 80);
    e.target.style.height = `${newHeight}px`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full sm:w-[480px] sm:max-w-[90vw] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col"
          style={{ height: 'calc(100vh - 80px)', maxHeight: '700px' }}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Zipto Assistant</h2>
              <p className="text-xs text-gray-600">Get help in seconds</p>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="New chat"
                >
                  <RotateCcw className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <button
                onClick={close}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {showResetConfirm && (
            <div className="absolute inset-0 bg-white/95 z-10 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm">
                <h3 className="text-lg font-semibold mb-2">Start new chat?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This will clear your current conversation history.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Start New
                  </button>
                </div>
              </div>
            </div>
          )}

          <ChatMessageList messages={messages} isLoading={isLoading} />

          {lastError && (
            <div className="px-4 pb-2">
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 mb-2">{lastError}</p>
                  <button
                    onClick={handleRetry}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 p-4">
            <ChatQuickChips onChipClick={handleChipClick} visible={showQuickChips} />

            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  rows={1}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  style={{ maxHeight: '80px' }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="shrink-0 w-11 h-11 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2 text-center">
              Do not share sensitive information. For urgent issues, contact support.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
