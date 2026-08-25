import { motion } from 'framer-motion';
import { AuthForm } from '@/components/auth/AuthForm';

interface AuthStepProps {
  onSuccess: () => void;
}

export function AuthStep({ onSuccess }: AuthStepProps) {
  return (
    <motion.div
      key="auth-step"
      className="relative w-full min-h-[100dvh] bg-[#08090B] text-white flex flex-col items-center p-0 lg:p-10 overflow-y-auto select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative w-full m-auto min-h-[100dvh] lg:min-h-0 lg:h-[650px] max-w-[1192px] rounded-none lg:rounded-[5px] overflow-hidden flex bg-[#0F1114] border-0 lg:border lg:border-white/10 shadow-none lg:shadow-2xl shrink-0">
        
        <motion.img
          src="/img/welcome-bg-gym-c-desktop02-bl_or.webp"
          alt="Gym Background"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] lg:object-center pointer-events-none"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] pointer-events-none" />
        <div className="relative z-10 w-full lg:w-1/2 h-full flex flex-col items-center lg:items-start overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="w-full flex flex-col page-padding lg:pr-0">
            <AuthForm onSuccess={onSuccess} />
          </div>
        </div>

        <div className="hidden lg:block w-1/2 h-full pointer-events-none" />
      </div>
    </motion.div>
  );
}
