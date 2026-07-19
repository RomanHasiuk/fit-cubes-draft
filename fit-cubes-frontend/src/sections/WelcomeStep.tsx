import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      key="welcome"
      className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background Image with Zoom Out */}
      <motion.img
        src="/img/welcome-bg-gym-c-21.webp"
        alt="Gym Background"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4.0, ease: "easeOut" }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full flex-1 pt-20">
        
        {/* Animated Logo */}
        <Logo
          className="mb-8"
          variant="draw"
          pulse={true}
        />
        
        {/* Text Animation */}
        <div
          className="text-[32px] text-white flex flex-wrap items-center justify-center tracking-tight"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span className="mr-2 font-medium">Welcome to</span>
          <span className="inline-flex font-semibold">
            {"FitCubes".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ color: "#ffffff" }}
                animate={{ color: "#F59F0A" }}
                transition={{ delay: 0.5 + index * 0.4, duration: 0.7 }}
              >
                {char}
              </motion.span>
            ))}
          </span>
          <span className="font-medium">!</span>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="relative z-10 w-full px-6 pb-12 mt-auto">
        <Button
          className="w-full h-14 text-lg font-bold bg-[#F59F0A] hover:bg-[#F59F0A]/90 text-white rounded-lg shadow-lg"
          onClick={onNext}
        >
          Get Started!
        </Button>
      </div>
    </motion.div>
  );
}
