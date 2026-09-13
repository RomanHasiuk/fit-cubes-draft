import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import InfoTooltip from '@/components/InfoTooltip';
import { blockInvalidIntegerInput } from '@/utils/inputHandlers';
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  generateMacroTargets,
  adjustMacrosForProtein,
} from '@/utils/calculations';
import {
  WEIGHT_GOAL,
  DIET_TYPE,
  type DietType,
  type WeightGoal,
} from '@/constants';
import { SelectButton } from '@/components/ui/SelectButton';

const GOAL_OPTIONS = [
  { value: WEIGHT_GOAL.LOSE, label: 'Loss' },
  { value: WEIGHT_GOAL.MAINTAIN, label: 'Maintain' },
  { value: WEIGHT_GOAL.GAIN, label: 'Gain' },
] as const;

const STRATEGY_OPTIONS = [
  { value: DIET_TYPE.BALANCED, label: 'Balanced' },
  { value: DIET_TYPE.LOW_CARB, label: 'Low-Carb' },
  { value: DIET_TYPE.KETO, label: 'Keto' },
] as const;

interface TargetsFormProps {
  onNext: () => void;
  onBack: () => void;
}

export function TargetsForm({ onNext, onBack }: TargetsFormProps) {
  const profile = useStore((state) => state.profile);
  const updateProfile = useStore((state) => state.updateProfile);

  const proteinInputRef = useRef<HTMLInputElement>(null);

  const [goal, setGoal] = useState<WeightGoal>(
    profile.goal || WEIGHT_GOAL.MAINTAIN
  );
  const [diet, setDiet] = useState<DietType>(
    profile.diet || DIET_TYPE.BALANCED
  );
  const [error, setError] = useState<string | null>(null);

  // Core metabolic calculations
  const bmr = calculateBMR(profile);
  const tdeeBase = calculateTDEE(profile);
  const targetCalories = calculateTargetCalories(tdeeBase, goal);

  // Auto-generate macro targets when goal/diet/calories change
  useEffect(() => {
    const macros = generateMacroTargets(
      targetCalories,
      diet,
      profile.weightKg,
      goal
    );
    updateProfile({ macroTargets: macros, goal, diet });
  }, [targetCalories, diet, profile.weightKg, goal, updateProfile]);

  const macroTargets = profile.macroTargets || {
    protein: 154,
    carbs: 307,
    fats: 102,
  };

  const macroPercentages = useMemo(() => {
    if (!targetCalories || targetCalories <= 0) {
      return { protein: 0, carbs: 0, fats: 0 };
    }
    return {
      protein: Math.round(((macroTargets.protein * 4) / targetCalories) * 100),
      carbs: Math.round(((macroTargets.carbs * 4) / targetCalories) * 100),
      fats: Math.round(((macroTargets.fats * 9) / targetCalories) * 100),
    };
  }, [macroTargets, targetCalories]);

  const handleGoalChange = (newGoal: WeightGoal) => {
    if (error) setError(null);
    setGoal(newGoal);
    const newTargetCals = calculateTargetCalories(tdeeBase, newGoal);
    const newMacros = generateMacroTargets(
      newTargetCals,
      diet,
      profile.weightKg,
      newGoal
    );
    updateProfile({ goal: newGoal, macroTargets: newMacros });
  };

  const handleDietChange = (newDiet: DietType) => {
    if (error) setError(null);
    setDiet(newDiet);
    const newMacros = generateMacroTargets(
      targetCalories,
      newDiet,
      profile.weightKg,
      goal
    );
    updateProfile({ diet: newDiet, macroTargets: newMacros });
  };

  const handleProteinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const validProtein = isNaN(val) ? 0 : Math.max(0, val);
    const updated = adjustMacrosForProtein(targetCalories, validProtein, diet);
    updateProfile({ macroTargets: updated });
  };

  const optimalProteinPerKg =
    profile.weightKg > 0
      ? (macroTargets.protein / profile.weightKg).toFixed(1)
      : '1.8';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      macroTargets.protein <= 0 ||
      macroTargets.carbs < 0 ||
      macroTargets.fats < 0
    ) {
      setError('Please ensure valid macronutrient targets.');
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div className="flex h-full w-full flex-col justify-between">
      {/* Header */}
      <div className="mb-3 flex h-[34px] w-full items-center justify-between sm:mb-12 md:mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex h-[34px] w-[34px] cursor-pointer touch-manipulation items-center justify-center rounded-full border border-white/10 bg-[#16191E]/80 backdrop-blur-sm transition-all hover:border-white/20 active:scale-95"
          title="Back"
          aria-label="Back"
        >
          <ArrowLeft className="pointer-events-none h-6 w-6 text-foreground/80" />
        </button>

        <h2 className="heading-h2 text-center">Choose Your Goal</h2>

        <div className="pointer-events-none h-[34px] w-[34px] opacity-0" />
      </div>

      {/* Form Content */}
      <form
        id="targets-form"
        noValidate
        onSubmit={handleSubmit}
        className="mb-[18px] flex w-full flex-col gap-8"
      >
        {/* 1. Target Calories Banner */}
        <div className="flex w-full flex-col justify-between rounded-[10px] bg-[#251F13]/80 p-4 shadow-md backdrop-blur-md">
          <span className="font-sans text-[16px] font-medium text-[#8E8F96]">
            Target Calories
          </span>

          <span className="my-1 font-serif text-[40px] font-medium leading-[1.2] text-[#F59F0A]">
            {targetCalories} kcal
          </span>

          <div className="flex items-center gap-2">
            <div className="flex h-[34px] items-center justify-center rounded-[5px] bg-[#4F3911]/90 p-2">
              <span className="font-sans text-[14px] font-medium uppercase leading-[1.35] text-[#F59F0A]">
                {goal === WEIGHT_GOAL.LOSE
                  ? 'LOSS'
                  : goal === WEIGHT_GOAL.GAIN
                    ? 'GAIN'
                    : 'MAINTAIN'}
              </span>
            </div>
            <span className="font-sans text-[12px] text-[#8E8F96]">
              BMR {Math.round(bmr)} × {profile.activityFactor}
            </span>
          </div>
        </div>

        {/* 2. Goal Selector (Loss, Maintain, Gain) */}
        <div className="flex flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <label className="form-label">Goal</label>
            <InfoTooltip
              title="Goal"
              content="Defines caloric balance: Loss creates a 15% deficit, Gain creates a 15% surplus, and Maintain matches your TDEE."
              align="left"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {GOAL_OPTIONS.map((opt) => (
              <SelectButton
                key={opt.value}
                isSelected={goal === opt.value}
                onClick={() => handleGoalChange(opt.value)}
              >
                {opt.label}
              </SelectButton>
            ))}
          </div>
        </div>

        {/* 3. Strategy / Diet Selector (Balanced, Low-Carb, KETO) */}
        <div className="flex flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <label className="form-label">Strategy</label>
            <InfoTooltip
              title="Strategy"
              content="Macro distribution preset: Balanced (40% Carbs, 30% Protein, 30% Fats), Low-Carb (25% Carbs, 40% Protein, 35% Fats), or Keto (5% Carbs, 25% Protein, 70% Fats)."
              align="left"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {STRATEGY_OPTIONS.map((opt) => (
              <SelectButton
                key={opt.value}
                isSelected={diet === opt.value}
                onClick={() => handleDietChange(opt.value)}
              >
                {opt.label}
              </SelectButton>
            ))}
          </div>
        </div>

        {/* 4. Manual Protein Adjustment */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <div className="flex w-full items-center justify-between">
              <span className="font-serif text-[16px] font-medium leading-[1.15] text-foreground lg:text-[22px]">
                Manual protein adjustment
              </span>
              <InfoTooltip
                title="Protein Adjustment"
                content="Fine-tune your daily protein in grams. Remaining calories will automatically balance across carbohydrates and fats."
                align="right"
              />
            </div>
            <span className="font-sans text-[14px] leading-tight text-[#8E8F96]">
              Can be changed later
            </span>
          </div>
          <div className="grid grid-cols-3 items-start gap-3">
            {/* Protein */}
            <div className="flex flex-col gap-2">
              <span className="form-label pl-0.5 text-left">Protein</span>
              <div
                onClick={() => proteinInputRef.current?.focus()}
                className="flex h-[44px] w-full cursor-text items-center justify-center rounded-[5px] border border-[#32363E] bg-[#16181D]/60 px-2.5 font-sans text-[14px] backdrop-blur-sm transition-all focus-within:border-[#F59F0A] focus-within:ring-1 focus-within:ring-[#F59F0A]/50 sm:text-[15px]"
              >
                <input
                  ref={proteinInputRef}
                  type="text"
                  inputMode="numeric"
                  value={macroTargets.protein}
                  onKeyDown={blockInvalidIntegerInput}
                  onChange={handleProteinInputChange}
                  className="m-0 bg-transparent p-0 text-right font-medium text-foreground outline-none"
                  style={{
                    width: `${Math.max(1, String(macroTargets.protein).length)}ch`,
                  }}
                />
                <span className="pointer-events-none select-none text-[#8E8F96]">
                  (~{macroPercentages.protein}%)
                </span>
              </div>
            </div>

            {/* Carbs */}
            <div className="flex flex-col gap-2">
              <span className="form-label pl-0.5 text-left">Carbs</span>
              <div className="flex h-[44px] w-full select-none items-center justify-center rounded-[5px] border border-[#32363E] bg-[#16181D]/60 px-2.5 font-sans text-[14px] backdrop-blur-sm sm:text-[15px]">
                <span className="font-medium text-foreground">
                  {macroTargets.carbs}
                </span>
                <span className="text-[#8E8F96]">
                  (~{macroPercentages.carbs}%)
                </span>
              </div>
            </div>

            {/* Fats */}
            <div className="flex flex-col gap-2">
              <span className="form-label pl-0.5 text-left">Fats</span>
              <div className="flex h-[44px] w-full select-none items-center justify-center rounded-[5px] border border-[#32363E] bg-[#16181D]/60 px-2.5 font-sans text-[14px] backdrop-blur-sm sm:text-[15px]">
                <span className="font-medium text-foreground">
                  {macroTargets.fats}
                </span>
                <span className="text-[#8E8F96]">
                  (~{macroPercentages.fats}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Optimal Protein Recommendation Badge */}
        <div className="flex w-full items-center gap-3 rounded-[10px] bg-[#0F221F]/85 p-3 shadow-sm backdrop-blur-md">
          <img
            src="/icons/Logo-green.svg"
            alt="Optimal protein"
            className="pointer-events-none h-[29px] w-[29px] shrink-0 select-none"
          />

          <div className="flex flex-col text-left">
            <span className="font-sans text-[16px] font-medium leading-tight text-foreground">
              Optimal! ({optimalProteinPerKg}g/kg).
            </span>
            <span className="mt-0.5 font-sans text-[14px] leading-tight text-[#8E8F96]">
              Ideal protein range to reach your goals.
            </span>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex items-center gap-2 rounded-[5px] border border-red-500/20 bg-red-500/10 p-2.5 text-xs font-medium text-red-400"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      <div className="pt-1">
        <Button form="targets-form" type="submit" className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}
