import { motion } from 'framer-motion';
import { AuthForm } from '@/components/auth/AuthForm';

interface AuthStepProps {
  onSuccess: () => void;
  onSkip?: () => void;
}

export function AuthStep({ onSuccess, onSkip }: AuthStepProps) {
  return (
    <motion.div
      key="auth-step"
      className="relative w-full h-[100dvh] min-h-[100dvh] bg-[#0F1114] text-white flex items-center justify-center p-0 lg:p-6 xl:p-10 overflow-hidden select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Main Card Container (Full-bleed on mobile, 50/50 Split Card on Desktop) */}
      <div className="relative w-full h-full min-h-[100dvh] lg:min-h-0 lg:max-h-[820px] max-w-6xl lg:max-w-[1280px] rounded-none lg:rounded-2xl overflow-hidden flex bg-[#0F1114] border-0 lg:border lg:border-white/10 shadow-none lg:shadow-2xl">
        
        {/* Background Gym Image: centered on girl (75%) on mobile, full-scene on desktop */}
        <motion.img
          src="/img/welcome-bg-gym-c-desktop02-bl_or.webp"
          alt="Gym Background"
          className="block absolute inset-0 w-full h-full object-cover object-[75%_center] lg:object-center pointer-events-none"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />

        {/* Global Darkening & Soft Readability Blur on Mobile, 40% clean on Desktop */}
        <div className="block absolute inset-0 bg-black/60 lg:bg-black/40 backdrop-blur-[1px] lg:backdrop-blur-none pointer-events-none" />

        {/* Left Panel: Centered on mobile, exactly 50% with glassmorphism on desktop */}
        <div className="relative z-10 w-full lg:w-1/2 h-full bg-transparent lg:bg-black/40 lg:backdrop-blur-[2px] flex flex-col justify-center lg:justify-start items-center lg:items-start lg:pr-[50px] lg:[mask-image:linear-gradient(to_right,black_90%,transparent_100%)] overflow-y-auto">
          {/* Inner Form Box: max-w on mobile for optimal comfort, 100% on desktop */}
          <div className="w-full max-w-[440px] lg:max-w-none flex flex-col px-4 pt-6 lg:pt-0 pb-6 my-auto lg:my-0">
            <AuthForm onSuccess={onSuccess} onSkip={onSkip} />
          </div>
        </div>

        {/* Right Panel: remaining 50% for crisp gym photo / subject on Desktop */}
        <div className="hidden lg:block w-1/2 h-full pointer-events-none" />

      </div>
    </motion.div>
  );
}
