import { useState } from 'react';
import { WelcomeStep } from './WelcomeStep';
import { ReadyStep } from './ReadyStep';
import {
  OnboardingCardLayout,
  type WizardStepKey,
} from '@/components/onboarding/OnboardingCardLayout';
import { useStore } from '@/store/useStore';

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = ['welcome', 'auth', 'basics', 'targets', 'ready'] as const;

const isWizardStep = (step: string): step is WizardStepKey =>
  step === 'auth' || step === 'basics' || step === 'targets';

export default function Onboarding({ onComplete }: OnboardingProps) {
  const completeOnboarding = useStore((state) => state.completeOnboarding);
  const [step, setStep] = useState(0);
  const currentStep = STEPS[step];

  const handleNext = (isLogin?: boolean) => {
    if (isLogin) {
      completeOnboarding();
      onComplete();
      return;
    }

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="dark min-h-[100dvh] w-full">
      {/* 1. Hero Splash Screen */}
      {currentStep === 'welcome' && <WelcomeStep onNext={handleNext} />}

      {/* 2. Unified 1192x650 Wizard (Auth -> Basics -> Targets) */}
      {isWizardStep(currentStep) && (
        <OnboardingCardLayout
          step={currentStep}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {/* 3. Celebration Screen */}
      {currentStep === 'ready' && (
        <ReadyStep onComplete={handleNext} onBack={handleBack} />
      )}
    </div>
  );
}
