import { OnboardingCardLayout } from '@/components/onboarding/OnboardingCardLayout';

interface AuthStepProps {
  onSuccess: (isLogin?: boolean) => void;
}

export function AuthStep({ onSuccess }: AuthStepProps) {
  return <OnboardingCardLayout step="auth" onNext={onSuccess} onBack={() => {}} />;
}
