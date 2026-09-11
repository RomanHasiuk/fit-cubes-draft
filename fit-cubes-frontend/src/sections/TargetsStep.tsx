import { OnboardingCardLayout } from '@/components/onboarding/OnboardingCardLayout';

interface TargetsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function TargetsStep({ onNext, onBack }: TargetsStepProps) {
  return <OnboardingCardLayout step="targets" onNext={onNext} onBack={onBack} />;
}
