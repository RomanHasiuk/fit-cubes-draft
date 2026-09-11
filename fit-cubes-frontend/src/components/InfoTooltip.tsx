import React, { useState, useRef, useEffect } from 'react';
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
  position = 'top',
}: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close tooltip on click/tap outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [isOpen]);

  const alignClasses = {
    top: {
      left: 'bottom-full mb-2 left-0 origin-bottom-left',
      right: 'bottom-full mb-2 right-0 origin-bottom-right',
      center: 'bottom-full mb-2 left-1/2 -translate-x-1/2 origin-bottom',
    },
    bottom: {
      left: 'top-full mt-2 left-0 origin-top-left',
      right: 'top-full mt-2 right-0 origin-top-right',
      center: 'top-full mt-2 left-1/2 -translate-x-1/2 origin-top',
    },
  };

  const arrowClasses = {
    top: {
      left: 'top-full left-2 border-t-[#16191E]',
      right: 'top-full right-2 border-t-[#16191E]',
      center: 'top-full left-1/2 -translate-x-1/2 border-t-[#16191E]',
    },
    bottom: {
      left: 'bottom-full left-2 border-b-[#16191E]',
      right: 'bottom-full right-2 border-b-[#16191E]',
      center: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#16191E]',
    },
  };

  const initialY = position === 'top' ? 6 : -6;

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-0.5 rounded-full transition-all flex items-center justify-center cursor-pointer focus:outline-none touch-manipulation select-none"
        aria-label={`Info about ${title}`}
      >
        {children || (
          <Info
            className={`w-[20px] h-[20px] transition-all duration-200 ${
              isOpen
                ? 'text-[#F59F0A] drop-shadow-[0_0_6px_rgba(245,159,10,0.8)]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: initialY }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: initialY }}
            transition={{
              type: 'spring',
              stiffness: 450,
              damping: 25,
            }}
            className={`absolute w-[180px] sm:w-[195px] max-w-[calc(100vw-32px)] z-[100] pointer-events-none ${alignClasses[position][align]}`}
          >
            <div className="py-[11px] px-2 rounded-[10px] bg-[#16191E]/95 border border-white/15 backdrop-blur-md shadow-2xl text-foreground relative">
              {/* Serif Title */}
              <h4 className="font-serif font-bold text-[16px] leading-tight mb-1 text-foreground">
                {title}
              </h4>
              {/* Sans-serif Body Content */}
              <p className="font-sans text-[12px] leading-relaxed text-foreground/60 font-normal">
                {content}
              </p>
              {/* Arrow Indicator */}
              <div
                className={`absolute border-4 border-transparent ${arrowClasses[position][align]}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
