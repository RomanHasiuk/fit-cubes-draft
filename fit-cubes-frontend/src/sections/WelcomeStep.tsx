import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';

interface WelcomeStepProps {
  onNext: () => void;
}

const BRAND_NAME = 'FitCubes';

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      key="welcome"
      className="relative flex min-h-[100dvh] w-full select-none flex-col items-center justify-between overflow-hidden bg-[#0F1114]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* Background Hero Image with Smooth Zoom Effect & Centered Focus */}
      <motion.img
        src="/img/welcome-bg-gym-b-desktop.webp"
        alt="Gym Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[52%_center] sm:object-center"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3.5, ease: 'easeOut' }}
      />

      {/* Dark Vignette Overlay with Blur for Optimal Contrast */}
      <div className="pointer-events-none absolute inset-0 bg-black/60 backdrop-blur-[1.5px]" />

      {/* Center Hero Content (Logo + Animated Typography) */}
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-start px-6 pt-[130px]">
        {/* Animated 3-Ring Golden Logo */}
        <div className="mb-6 flex items-center justify-center md:mb-10">
          <Logo
            className="h-[134px] w-[134px] transition-all duration-300 md:h-[254px] md:w-[254px]"
            variant="draw"
            pulse={true}
          />
        </div>

        {/* Responsive Heading */}
        <h1 className="flex flex-col items-center justify-center text-center font-serif text-[28px] font-semibold tracking-tight text-white sm:flex-row sm:text-4xl md:text-5xl md:leading-[1.2]">
          <span className="text-white/95 sm:mr-2">Welcome to</span>
          <span className="inline-flex items-center font-semibold text-[#F59F0A]">
            {BRAND_NAME.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ color: '#ffffff' }}
                animate={{ color: '#F59F0A' }}
                transition={{
                  delay: 0.6 + index * 0.35,
                  duration: 0.8,
                  ease: 'easeInOut',
                }}
              >
                {char}
              </motion.span>
            ))}
            <span className="ml-0.5 font-medium text-white/95">!</span>
          </span>
        </h1>
      </div>

      {/* Bottom Action Area */}
      <div className="relative z-10 mt-auto flex w-full justify-center px-4 pb-[76px] sm:px-6 md:pb-24 lg:pb-[108px]">
        <Button
          variant="default"
          className="w-full max-w-[552px] antialiased"
          onClick={() => onNext()}
        >
          Get Started!
        </Button>
      </div>
    </motion.div>
  );
}
