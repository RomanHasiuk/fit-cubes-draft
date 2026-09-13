import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { calculateTDEE, calculateTargetCalories } from '@/utils/calculations';

interface ReadyStepProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function ReadyStep({ onComplete }: ReadyStepProps) {
  const profile = useStore((state) => state.profile);

  const tdeeBase = calculateTDEE(profile);
  const targetCalories = calculateTargetCalories(tdeeBase, profile.goal);
  const macroTargets = profile.macroTargets || {
    protein: 154,
    carbs: 307,
    fats: 102,
  };
  const macroItems = [
    { label: 'Protein', value: `${macroTargets.protein}g` },
    { label: 'Carbs', value: `${macroTargets.carbs}g` },
    { label: 'Fats', value: `${macroTargets.fats}g` },
  ];

  return (
    <motion.div
      key="ready"
      className="relative flex min-h-[100dvh] w-full select-none flex-col items-center justify-between overflow-hidden bg-[#0F1114] p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* Background Hero Image */}
      <motion.img
        src="/img/welcome-bg-gym-b-desktop.webp"
        alt="Gym Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[52%_center] sm:object-center"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3.5, ease: 'easeOut' }}
      />

      {/* Dark Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/60 backdrop-blur-[1.5px]" />

      {/* Center Hero Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[522px] flex-1 flex-col items-center justify-start px-4 pt-[64px] md:px-6 md:pt-[140px] lg:pt-24">
        {/* Animated 3-Ring Golden Logo */}
        <div className="mb-8 flex items-center justify-center">
          <Logo
            className="h-[134px] w-[134px] transition-all duration-300 md:h-[254px] md:w-[254px]"
            variant="draw"
            pulse={true}
          />
        </div>

        {/* Heading */}
        <h1 className="heading-h1 mb-6 text-center tracking-normal text-foreground">
          You're All Set!
        </h1>

        {/* Subtitle */}
        <p className="mb-6 text-center font-sans text-[14px] font-medium leading-[1.35] text-[#8F9296] md:mb-14 md:text-[16px]">
          Your calorie budget is ready (
          <span className="font-medium text-[#3B82F6]">
            {targetCalories.toLocaleString()} kcal
          </span>
          ).
          <br />
          Start tracking and stay on target.
        </p>

        {/* 3 Macro Summary Boxes */}
        <div className="mb-6 grid w-full grid-cols-3 gap-2.5 p-2 sm:gap-3 md:mb-[94px]">
          {macroItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center gap-1 rounded-[5px] border border-[#32363E] bg-[#16181D]/75 px-2 py-1.5 shadow-sm backdrop-blur-md md:py-3"
            >
              <span className="heading-h2">{item.value}</span>
              <span className="font-sans text-[14px] leading-[1.35] text-[#8E8F96] md:text-[16px]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="w-full">
          <Button type="button" className="w-full" onClick={onComplete}>
            Start My Journey!
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
