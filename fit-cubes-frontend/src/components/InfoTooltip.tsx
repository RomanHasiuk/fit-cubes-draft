import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  title: string;
  content: string;
  children?: React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

export default function InfoTooltip({
  title,
  content,
  children,
  align = 'center'
}: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Position logic to prevent clipping
  const positionClasses = {
    left: 'left-0 origin-bottom-left',
    right: 'right-0 origin-bottom-right',
    center: 'left-1/2 -translate-x-1/2 origin-bottom'
  };

  const arrowClasses = {
    left: 'left-4',
    right: 'right-4',
    center: 'left-1/2 -translate-x-1/2'
  };

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
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{
              opacity: 1,
              scale: [0.5, 1.1, 1], // Springy "pop-in" effect
              y: 0
            }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20
            }}
            className={`absolute bottom-full mb-2 w-64 z-[100] pointer-events-none ${positionClasses[align]}`}
          >
            <div className="p-4 rounded-2xl shadow-xl border border-border/40 glass backdrop-blur-md text-popover-foreground">
              <h4 className="font-bold text-sm mb-1 text-foreground">{title}</h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {content}
              </p>
              {/* Arrow */}
              <div className={`absolute top-full border-8 border-transparent border-t-background/60 ${arrowClasses[align]}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
