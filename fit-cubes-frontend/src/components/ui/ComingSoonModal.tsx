import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Dumbbell, Sparkles } from 'lucide-react';
import { useModalOpen } from '@/hooks/useModalOpen';
import { Button } from '@/components/ui/button';

export type ComingSoonFeature = 'body' | 'exercise';

export interface ComingSoonModalProps {
  isOpen: boolean;
  feature: ComingSoonFeature | null;
  onClose: () => void;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  feature,
  onClose,
}) => {
  useModalOpen(isOpen);

  if (!feature) return null;

  const isBody = feature === 'body';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-[4px] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md bg-card/95 text-foreground border border-border rounded-[5px] p-6 shadow-2xl overflow-hidden flex flex-col"
            initial={{ scale: 0.94, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  {isBody ? <Ruler className="w-5 h-5" /> : <Dumbbell className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-serif text-[18px] sm:text-[20px] font-semibold text-foreground leading-tight">
                    {isBody ? 'Body Metrics' : 'Exercise Metrics'}
                  </h3>
                  <span className="text-[11px] font-sans uppercase tracking-wider text-primary font-medium flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                    Roadmap • Phase 2
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Close"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
              <div className="p-3.5 rounded-[5px] bg-secondary/80 border border-border/50 text-foreground/90 space-y-1.5">
                <h4 className="text-foreground font-semibold text-xs sm:text-sm">
                  {isBody ? 'Circumference & Dynamics Tracking' : 'Strength & Performance Analytics'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {isBody
                    ? 'Log circumference measurements for waist, chest, biceps, and thighs to monitor true body recomposition progress even when scale weight fluctuates.'
                    : 'Track personal bests (1RM), calculate total training volume load, and monitor weekly workout intensity and endurance graphs.'}
                </p>
              </div>

              <p className="text-[12px] text-muted-foreground/80 italic">
                This feature is actively being developed as part of our Post-MVP roadmap. Your core nutrition, calorie budget, and activity logs remain fully accessible in Phase 1.
              </p>
            </div>

            <div className="pt-3 border-t border-border/60 flex justify-end shrink-0">
              <Button
                type="button"
                onClick={onClose}
                className="px-5 h-9 text-xs sm:text-sm font-semibold rounded-[5px] cursor-pointer"
              >
                Got it
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComingSoonModal;
