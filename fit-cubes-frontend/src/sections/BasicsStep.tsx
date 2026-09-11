import { OnboardingCardLayout } from '@/components/onboarding/OnboardingCardLayout';

interface BasicsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function BasicsStep({ onNext, onBack }: BasicsStepProps) {
  return <OnboardingCardLayout step="basics" onNext={onNext} onBack={onBack} />;
}
