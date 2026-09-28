import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  title: string;
  content: string;
  children?: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  position?: 'top' | 'bottom';
}

interface TooltipCoords {
  top: number;
  left: number;
  width: number;
  placement: 'top' | 'bottom';
  origin: string;
}

export default function InfoTooltip({
  title,
  content,
  children,
  align = 'center',
  position = 'top',
}: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<TooltipCoords | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = window.innerWidth < 640 ? 180 : 195;
    const padding = 12;

    // Automatic collision detection & smart auto-flip
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const desiredPlacement = position;

    let placement: 'top' | 'bottom' = desiredPlacement;
    if (desiredPlacement === 'top' && spaceAbove < 160 && spaceBelow >= 120) {
      placement = 'bottom';
    } else if (desiredPlacement === 'bottom' && spaceBelow < 160 && spaceAbove >= 120) {
      placement = 'top';
    }

    // Vertical anchor calculation
    const top = placement === 'top' ? rect.top - 8 : rect.bottom + 8;

    // Horizontal anchor calculation
    let left: number;
    let originX: string;
    if (align === 'right') {
      left = rect.right - tooltipWidth;
      originX = 'right';
    } else if (align === 'left') {
      left = rect.left;
      originX = 'left';
    } else {
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
      originX = 'center';
    }

    // Clamp inside viewport bounds
    if (left < padding) {
      left = padding;
      originX = 'left';
    } else if (left + tooltipWidth > window.innerWidth - padding) {
      left = window.innerWidth - tooltipWidth - padding;
      originX = 'right';
    }

    const originY = placement === 'top' ? 'bottom' : 'top';

    setCoords({
      top,
      left,
      width: tooltipWidth,
      placement,
      origin: `${originY} ${originX}`,
    });
  }, [align, position]);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleClickOutside = (e: PointerEvent) => {
      if (triggerRef.current && triggerRef.current.contains(e.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, updatePosition]);

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={triggerRef}
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
                ? 'text-primary drop-shadow-[0_0_6px_rgba(245,159,10,0.8)]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          />
        )}
      </button>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && coords && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.94,
                  y: coords.placement === 'top' ? -4 : 4,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.94,
                  y: coords.placement === 'top' ? -4 : 4,
                }}
                transition={{
                  duration: 0.18,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'fixed',
                  top: coords.top,
                  left: coords.left,
                  width: coords.width,
                  transform: coords.placement === 'top' ? 'translateY(-100%)' : 'none',
                  transformOrigin: coords.origin,
                  zIndex: 9999,
                }}
                className="pointer-events-none"
              >
                <div className="py-[11px] md:py-4 px-3 rounded-[5px] bg-[#16191E]/95 border border-white/15 backdrop-blur-md shadow-2xl text-foreground font-medium relative">
                  <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] mb-1.5 text-foreground">
                    {title}
                  </h4>
                  <p className="font-sans text-[12px] sm:text-[13px] leading-[1.35] text-muted-foreground font-normal">
                    {content}
                  </p>
                  <div
                    className={`absolute border-4 border-transparent ${
                      coords.placement === 'top'
                        ? 'top-full border-t-[#16191E]'
                        : 'bottom-full border-b-[#16191E]'
                    } ${
                      align === 'right'
                        ? 'right-3'
                        : align === 'left'
                          ? 'left-3'
                          : 'left-1/2 -translate-x-1/2'
                    }`}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
