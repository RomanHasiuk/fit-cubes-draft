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
  const outerRef = useRef<HTMLDivElement>(null);
  const contentColRef = useRef<HTMLDivElement>(null);

  // Reset scroll smoothly ONLY when the exiting step animation has completely finished
  const handleExitComplete = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (outerRef.current) outerRef.current.scrollTop = 0;
    if (contentColRef.current) contentColRef.current.scrollTop = 0;
  };

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
    <div
      ref={outerRef}
      className="relative flex min-h-[100dvh] w-full select-none flex-col items-center overflow-y-auto bg-[#08090B] p-0 text-white [-ms-overflow-style:none] [scrollbar-width:none] lg:p-10 [&::-webkit-scrollbar]:hidden"
    >
      {/* Main Split Frame */}
      <div className="relative m-auto flex min-h-[100dvh] w-full max-w-[1192px] shrink-0 overflow-hidden rounded-none lg:h-[650px] lg:min-h-0 lg:rounded-[5px]">
        <motion.img
          src="/img/welcome-bg-gym-c-desktop02-bl_or.webp"
          alt="Athletic Lifestyle"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[75%_center] lg:object-center"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

        {/* Content Column */}
        <div
          ref={contentColRef}
          onScroll={handleScroll}
          data-scrolling={isScrolling ? 'true' : undefined}
          className="page-padding pt-safe pb-safe custom-scrollbar relative z-10 flex h-full w-full flex-col justify-between overflow-y-auto md:pt-[188px] lg:w-1/2 lg:pb-6 lg:pr-3 lg:pt-6"
        >
          <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="flex min-h-full w-full flex-col justify-between"
            >
              {step === 'auth' && <AuthForm onSuccess={onNext} />}
              {step === 'basics' && (
                <BasicsForm onNext={onNext} onBack={onBack} />
              )}
              {step === 'targets' && (
                <TargetsForm onNext={onNext} onBack={onBack} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pointer-events-none hidden h-full w-1/2 lg:block" />
      </div>
    </div>
  );
}
