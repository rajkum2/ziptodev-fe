import { motion } from 'framer-motion';
import { Package, DollarSign, Search, MessageCircle } from 'lucide-react';

interface ChatQuickChipsProps {
  onChipClick: (text: string) => void;
  visible: boolean;
}

const QUICK_ACTIONS = [
  { icon: Package, text: 'Track my order' },
  { icon: DollarSign, text: 'Refund status' },
  { icon: Search, text: 'Help me find products' },
  { icon: MessageCircle, text: 'Talk to support' },
];

export function ChatQuickChips({ onChipClick, visible }: ChatQuickChipsProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-wrap gap-2 mb-3"
    >
      {QUICK_ACTIONS.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.text}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChipClick(action.text)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-green-600 hover:text-green-600 transition-colors shadow-sm"
          >
            <Icon className="w-4 h-4" />
            <span>{action.text}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
