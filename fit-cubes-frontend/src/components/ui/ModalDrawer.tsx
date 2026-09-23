import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: string;
  className?: string;
  children: React.ReactNode;
}

export const ModalDrawer: React.FC<ModalDrawerProps> = ({
  isOpen,
  onClose,
  maxWidth = 'max-w-[500px]',
  className = '',
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/25 dark:bg-black/35 backdrop-blur-[2px] flex justify-center items-end md:items-center p-0 md:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`w-full ${maxWidth} h-[90dvh] max-h-[90dvh] md:h-[800px] rounded-t-3xl md:rounded-[5px] border border-[#32363E] bg-[#0F1114]/90 backdrop-blur-md shadow-2xl overflow-hidden ${className}`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalDrawer;
