import { motion, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { authItemVariants, authLayoutTransition } from './authAnimations';
import type { SocialProvider } from '@/services/authService';

interface SocialAuthButtonsProps {
  onSocialAuth: (provider: SocialProvider) => void;
  isLoading?: boolean;
  className?: string;
  itemVariants?: Variants;
}

const SOCIAL_PROVIDERS: ReadonlyArray<{
  provider: SocialProvider;
  label: string;
  icon: string;
}> = [
  { provider: 'apple', label: 'Continue with Apple', icon: '/icons/apple-icons.svg' },
  { provider: 'google', label: 'Continue with Google', icon: '/icons/Google-icon.svg' },
  { provider: 'facebook', label: 'Continue with Facebook', icon: '/icons/facebook-icon.svg' },
];

export function SocialAuthButtons({
  onSocialAuth,
  isLoading,
  className,
  itemVariants = authItemVariants,
}: SocialAuthButtonsProps) {
  return (
    <div className={cn('flex flex-col gap-3 w-full', className)}>
      {SOCIAL_PROVIDERS.map(({ provider, label, icon }) => (
        <motion.div
          key={provider}
          variants={itemVariants}
          layout
          transition={{ layout: authLayoutTransition }}
        >
          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={() => onSocialAuth(provider)}
            className="w-full gap-3"
          >
            <img
              src={icon}
              alt={provider}
              className="w-6 h-6 pointer-events-none object-contain"
            />
            <span>{label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
