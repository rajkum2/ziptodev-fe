import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
}: DrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full',
  };

  const getVariants = () => {
    if (position === 'bottom') {
      return {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
      };
    }
    if (position === 'left') {
      return {
        initial: { x: '-100%' },
        animate: { x: 0 },
        exit: { x: '-100%' },
      };
    }
    return {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    };
  };

  const getPositionStyles = () => {
    if (position === 'bottom') {
      return 'bottom-0 left-0 right-0 rounded-t-2xl max-h-[90vh]';
    }
    if (position === 'left') {
      return 'left-0 top-0 bottom-0 h-full';
    }
    return 'right-0 top-0 bottom-0 h-full';
  };

  const variants = getVariants();

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 bg-black/50"
        >
          <motion.div
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={clsx(
              'absolute bg-white shadow-xl flex flex-col',
              getPositionStyles(),
              position !== 'bottom' && sizes[size]
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
