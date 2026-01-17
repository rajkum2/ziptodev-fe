import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { ChatDrawerModal } from './ChatDrawerModal';

export function ChatFab() {
  const { open, messages } = useChatStore();
  const hasUnreadMessages = messages.length > 0;

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={open}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium text-sm hidden sm:inline">Ask Zipto</span>
        {hasUnreadMessages && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          />
        )}
      </motion.button>

      <ChatDrawerModal />
    </>
  );
}
