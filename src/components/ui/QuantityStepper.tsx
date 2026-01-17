import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { clsx } from 'clsx';

interface QuantityStepperProps {
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'sm' | 'md';
  variant?: 'default' | 'compact';
}

export function QuantityStepper({
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
  size = 'md',
  variant = 'default',
}: QuantityStepperProps) {
  const sizes = {
    sm: {
      button: 'h-7 text-sm',
      stepper: 'h-7 text-sm',
      icon: 'w-3.5 h-3.5',
    },
    md: {
      button: 'h-9 text-sm',
      stepper: 'h-9 text-sm',
      icon: 'w-4 h-4',
    },
  };

  const config = sizes[size];

  if (quantity === 0) {
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onAdd();
        }}
        className={clsx(
          'px-4 font-semibold rounded-lg border-2 border-green-600 text-green-600 bg-white hover:bg-green-50 transition-colors',
          config.button
        )}
      >
        ADD
      </motion.button>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={clsx(
          'flex items-center rounded-lg overflow-hidden border-2 border-green-600 bg-green-600',
          variant === 'compact' ? 'gap-0' : 'gap-1'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            onDecrement();
          }}
          className={clsx(
            'flex items-center justify-center text-white hover:bg-green-700 transition-colors',
            config.stepper,
            variant === 'compact' ? 'w-7' : 'w-8'
          )}
        >
          <Minus className={config.icon} />
        </button>
        <span
          className={clsx(
            'flex items-center justify-center font-semibold text-white min-w-[24px]',
            config.stepper
          )}
        >
          {quantity}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            onIncrement();
          }}
          className={clsx(
            'flex items-center justify-center text-white hover:bg-green-700 transition-colors',
            config.stepper,
            variant === 'compact' ? 'w-7' : 'w-8'
          )}
        >
          <Plus className={config.icon} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
