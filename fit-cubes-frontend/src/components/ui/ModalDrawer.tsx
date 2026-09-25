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
          className="fixed inset-0 z-[100] bg-black/40 dark:bg-black/60 backdrop-blur-[2px] flex justify-center items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`w-full ${maxWidth} h-[90dvh] max-h-[90dvh] md:h-[800px] rounded-[16px] md:rounded-[5px] border border-[#32363E] bg-[#0F1114]/95 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col ${className}`}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
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
