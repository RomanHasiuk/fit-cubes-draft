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
      className="relative w-full min-h-[100dvh] flex flex-col items-center justify-between overflow-hidden bg-[#0F1114] select-none"
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
      <div className="relative z-10 flex flex-col items-center justify-start w-full flex-1 px-6 max-w-xl mx-auto pt-[130px]">
        {/* Animated 3-Ring Golden Logo */}
        <div className="mb-6 md:mb-10 flex items-center justify-center">
          <Logo
            className="w-[134px] h-[134px] md:w-[254px] md:h-[254px] transition-all duration-300"
            variant="draw"
            pulse={true}
          />
        </div>

        {/* Responsive Heading */}
        <h1 className="text-[28px] md:leading-[1.2] sm:text-4xl md:text-5xl font-serif text-white flex flex-col sm:flex-row items-center justify-center tracking-tight font-semibold text-center">
          <span className="text-white/95 sm:mr-2">Welcome to</span>
          <span className="inline-flex items-center font-semibold text-[#F59F0A]">
            {BRAND_NAME.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ color: "#ffffff" }}
                animate={{ color: "#F59F0A" }}
                transition={{ delay: 0.6 + index * 0.35, duration: 0.8, ease: "easeInOut" }}
              >
                {char}
              </motion.span>
            ))}
            <span className="text-white/95 font-medium ml-0.5">!</span>
          </span>
        </h1>
      </div>

      {/* Bottom Action Area */}
      <div className="relative z-10 w-full px-4 sm:px-6 pb-[76px] md:pb-24 lg:pb-[108px] flex justify-center mt-auto">
        <Button
          variant="default"
          className="w-full max-w-[552px] antialiased"
          onClick={onNext}
        >
          Get Started!
        </Button>
      </div>
    </motion.div>
  );
}
