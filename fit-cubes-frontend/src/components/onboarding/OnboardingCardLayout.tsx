import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthForm } from '@/components/auth/AuthForm';
import { BasicsForm } from '@/components/basics/BasicsForm';
import { TargetsForm } from '@/components/targets/TargetsForm';

export type WizardStepKey = 'auth' | 'basics' | 'targets';

interface OnboardingCardLayoutProps {
  step: WizardStepKey;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingCardLayout({
  step,
  onNext,
  onBack,
}: OnboardingCardLayoutProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full min-h-[100dvh] bg-[#08090B] text-white flex flex-col items-center p-0 lg:p-10 overflow-y-auto select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Main Split Frame */}
      <div className="relative w-full m-auto min-h-[100dvh] lg:min-h-0 lg:h-[650px] max-w-[1192px] rounded-none lg:rounded-[5px] overflow-hidden flex shrink-0">
        <motion.img
          src="/img/welcome-bg-gym-c-desktop02-bl_or.webp"
          alt="Athletic Lifestyle"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] lg:object-center pointer-events-none"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] pointer-events-none" />

        {/* Content Column */}
        <div
          onScroll={handleScroll}
          data-scrolling={isScrolling ? 'true' : undefined}
          className="relative z-10 w-full lg:w-1/2 h-full flex flex-col justify-between overflow-y-auto page-padding pt-safe pb-safe md:pt-[188px] lg:pt-6 lg:pb-6 lg:pr-3 custom-scrollbar"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full h-full flex flex-col justify-between"
            >
              {step === 'auth' && <AuthForm onSuccess={onNext} />}
              {step === 'basics' && <BasicsForm onNext={onNext} onBack={onBack} />}
              {step === 'targets' && <TargetsForm onNext={onNext} onBack={onBack} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden lg:block w-1/2 h-full pointer-events-none" />
      </div>
    </div>
  );
}
