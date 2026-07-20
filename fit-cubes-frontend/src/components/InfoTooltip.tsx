import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  title: string;
  content: string;
  children?: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  position?: 'top' | 'bottom';
}

export default function InfoTooltip({
  title,
  content,
  children,
  align = 'center',
  position = 'top'
}: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const alignClasses = {
    top: {
      left: 'bottom-full mb-2 left-0 origin-bottom-left',
      right: 'bottom-full mb-2 right-0 origin-bottom-right',
      center: 'bottom-full mb-2 left-1/2 -translate-x-1/2 origin-bottom'
    },
    bottom: {
      left: 'top-full mt-2 left-0 origin-top-left',
      right: 'top-full mt-2 right-0 origin-top-right',
      center: 'top-full mt-2 left-1/2 -translate-x-1/2 origin-top'
    }
  };

  const arrowClasses = {
    top: {
      left: 'top-full left-4 border-t-background/60',
      right: 'top-full right-4 border-t-background/60',
      center: 'top-full left-1/2 -translate-x-1/2 border-t-background/60'
    },
    bottom: {
      left: 'bottom-full left-4 border-b-background/60',
      right: 'bottom-full right-4 border-b-background/60',
      center: 'bottom-full left-1/2 -translate-x-1/2 border-b-background/60'
    }
  };

  const initialY = position === 'top' ? 10 : -10;

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-secondary rounded-full transition-colors"
      >
        {children || <Info className="w-4 h-4 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: initialY }}
            animate={{
              opacity: 1,
              scale: [0.5, 1.1, 1],
              y: 0
            }}
            exit={{ opacity: 0, scale: 0.5, y: initialY }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20
            }}
            className={`absolute w-64 z-[100] pointer-events-none ${alignClasses[position][align]}`}
          >
            <div className="p-4 rounded-2xl shadow-xl border border-border/40 glass backdrop-blur-md text-popover-foreground relative">
              <h4 className="font-bold text-sm mb-1 text-foreground">{title}</h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {content}
              </p>
              {/* Arrow */}
              <div className={`absolute border-8 border-transparent ${arrowClasses[position][align]}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
