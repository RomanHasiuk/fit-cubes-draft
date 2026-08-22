import { cn } from '@/lib/utils';

interface SocialAuthButtonsProps {
  onSocialAuth: (provider: 'Apple' | 'Google' | 'Facebook') => void;
  isLoading?: boolean;
  className?: string;
}

export function SocialAuthButtons({
  onSocialAuth,
  isLoading,
  className,
}: SocialAuthButtonsProps) {
  return (
    <div className={cn('flex flex-col gap-3 w-full', className)}>
      {/* Apple Button */}
      <button
        type="button"
        disabled={isLoading}
        onClick={() => onSocialAuth('Apple')}
        className={cn(
          'w-full h-[46px] px-4 rounded-[10px] border border-white/10 bg-[#16191E]/60 backdrop-blur-sm',
          'text-white text-sm font-medium flex items-center justify-center gap-3',
          'hover:bg-[#16191E] hover:border-white/20 active:bg-[#111317]',
          'transition-all cursor-pointer touch-manipulation select-none disabled:opacity-50'
        )}
      >
        <img
          src="/icons/apple-icons.svg"
          alt="Apple"
          className="w-5 h-5 pointer-events-none object-contain"
        />
        <span>Continue with Apple</span>
      </button>

      {/* Google Button */}
      <button
        type="button"
        disabled={isLoading}
        onClick={() => onSocialAuth('Google')}
        className={cn(
          'w-full h-[46px] px-4 rounded-[10px] border border-white/10 bg-[#16191E]/60 backdrop-blur-sm',
          'text-white text-sm font-medium flex items-center justify-center gap-3',
          'hover:bg-[#16191E] hover:border-white/20 active:bg-[#111317]',
          'transition-all cursor-pointer touch-manipulation select-none disabled:opacity-50'
        )}
      >
        <img
          src="/icons/Google-icon.svg"
          alt="Google"
          className="w-5 h-5 pointer-events-none object-contain"
        />
        <span>Continue with Google</span>
      </button>

      {/* Facebook Button */}
      <button
        type="button"
        disabled={isLoading}
        onClick={() => onSocialAuth('Facebook')}
        className={cn(
          'w-full h-[46px] px-4 rounded-[10px] border border-white/10 bg-[#16191E]/60 backdrop-blur-sm',
          'text-white text-sm font-medium flex items-center justify-center gap-3',
          'hover:bg-[#16191E] hover:border-white/20 active:bg-[#111317]',
          'transition-all cursor-pointer touch-manipulation select-none disabled:opacity-50'
        )}
      >
        <img
          src="/icons/facebook-icon.svg"
          alt="Facebook"
          className="w-5 h-5 pointer-events-none object-contain"
        />
        <span>Continue with Facebook</span>
      </button>
    </div>
  );
}
