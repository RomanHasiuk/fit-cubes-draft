import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';

interface WelcomeStepProps {
  onNext: () => void;
}

const BRAND_NAME = "FitCubes";

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      key="welcome"
      className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-between overflow-hidden bg-[#0F1114] select-none pt-safe pb-safe"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Background Hero Image with Smooth Zoom Effect & Centered Focus */}
      <motion.img
        src="/img/welcome-bg-gym-b-desktop.webp"
        alt="Gym Background"
        className="absolute inset-0 w-full h-full object-cover object-[52%_center] sm:object-center pointer-events-none"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3.5, ease: "easeOut" }}
      />

      {/* Dark Vignette Overlay with Blur for Optimal Contrast */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1.5px] pointer-events-none" />

      {/* Center Hero Content (Logo + Animated Typography) */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full flex-1 px-6 max-w-xl mx-auto pt-16 sm:pt-20">
        {/* Animated 3-Ring Golden Logo */}
        <div className="mb-6 sm:mb-8 md:mb-10 scale-100 sm:scale-115 md:scale-135 lg:scale-150 transition-transform flex items-center justify-center">
          <Logo
            variant="draw"
            pulse={true}
          />
        </div>

        {/* Responsive Heading */}
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white flex flex-wrap items-center justify-center tracking-tight font-medium text-center leading-snug"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span className="mr-2 text-white/95">Welcome to</span>
          <span className="inline-flex font-semibold text-[#F59F0A]">
            {BRAND_NAME.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ color: "#ffffff" }}
                animate={{ color: "#F59F0A" }}
                transition={{ delay: 0.4 + index * 0.12, duration: 0.5 }}
              >
                {char}
              </motion.span>
            ))}
          </span>
          <span className="text-white/95">!</span>
        </h1>
      </div>

      {/* Bottom Action Area (Responsive Width: 320px on Mobile up to 552px on Tablet/Web) */}
      <div className="relative z-10 w-full px-6 pb-10 sm:pb-12 md:pb-16 flex justify-center mt-auto">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-[552px]">
          <Button
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-[#F59F0A] hover:bg-[#F59F0A]/90 text-white rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
            onClick={onNext}
          >
            Get Started!
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
