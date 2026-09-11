import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import {
  calculateTDEE,
  calculateTargetCalories,
} from '@/utils/calculations';

interface ReadyStepProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function ReadyStep({ onComplete }: ReadyStepProps) {
  const profile = useStore((state) => state.profile);

  const tdeeBase = calculateTDEE(profile);
  const targetCalories = calculateTargetCalories(tdeeBase, profile.goal);
  const macroTargets = profile.macroTargets || { protein: 154, carbs: 307, fats: 102 };

  return (
    <motion.div
      key="ready"
      className="relative w-full min-h-[100dvh] flex flex-col items-center justify-between overflow-hidden bg-[#0F1114] select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Background Hero Image */}
      <motion.img
        src="/img/welcome-bg-gym-b-desktop.webp"
        alt="Gym Background"
        className="absolute inset-0 w-full h-full object-cover object-[52%_center] sm:object-center pointer-events-none"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3.5, ease: "easeOut" }}
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1.5px] pointer-events-none" />

      {/* Center Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-start w-full flex-1 px-6 max-w-xl mx-auto pt-[88px]">
        
        {/* Animated 3-Ring Golden Logo */}
        <div className="mb-8 flex items-center justify-center">
          <Logo
            className="w-[134px] h-[134px] md:w-[254px] md:h-[254px] transition-all duration-300"
            variant="draw"
            pulse={true}
          />
        </div>

        {/* Heading */}
        <h1 className="heading-h1 text-foreground text-center tracking-normal mb-6">
          You're All Set!
        </h1>

        {/* Subtitle */}
        <p className="text-[14px] font-sans font-medium leading-[1.35] text-[#8F9296] text-center max-w-[320px] mb-6">
          Your calorie budget is ready (<span className="text-[#3B82F6] font-medium">{targetCalories.toLocaleString()} kcal</span>).<br />
          Start tracking and stay on target.
        </p>

        {/* 3 Macro Summary Boxes */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-[440px] mb-6">
          {/* Protein */}
          <div className="h-[64px] bg-[#16181D]/75 backdrop-blur-md border border-[#32363E] rounded-[8px] px-2 py-1.5 flex flex-col items-center justify-center shadow-sm">
            <span className="font-sans font-semibold text-[17px] text-foreground leading-tight">
              {macroTargets.protein}g
            </span>
            <span className="font-sans text-[12px] text-[#8E8F96] leading-tight mt-0.5">
              Protein
            </span>
          </div>

          {/* Carbs */}
          <div className="h-[64px] bg-[#16181D]/75 backdrop-blur-md border border-[#32363E] rounded-[8px] px-2 py-1.5 flex flex-col items-center justify-center shadow-sm">
            <span className="font-sans font-semibold text-[17px] text-foreground leading-tight">
              {macroTargets.carbs}g
            </span>
            <span className="font-sans text-[12px] text-[#8E8F96] leading-tight mt-0.5">
              Carbs
            </span>
          </div>

          {/* Fats */}
          <div className="h-[64px] bg-[#16181D]/75 backdrop-blur-md border border-[#32363E] rounded-[8px] px-2 py-1.5 flex flex-col items-center justify-center shadow-sm">
            <span className="font-sans font-semibold text-[17px] text-foreground leading-tight">
              {macroTargets.fats}g
            </span>
            <span className="font-sans text-[12px] text-[#8E8F96] leading-tight mt-0.5">
              Fats
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full max-w-[440px]">
          <Button
            type="button"
            variant="default"
            size="default"
            className="w-full h-[44px] rounded-[5px] font-sans font-medium text-[16px] bg-[#F59F0A] hover:bg-[#EA580C] text-white shadow-lg shadow-[#F59F0A]/20 transition-all cursor-pointer touch-manipulation antialiased"
            onClick={onComplete}
          >
            Start My Journey!
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
