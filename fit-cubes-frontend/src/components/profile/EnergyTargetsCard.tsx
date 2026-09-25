import React from 'react';
import { SelectButton } from '@/components/ui/SelectButton';
import InfoTooltip from '@/components/InfoTooltip';
import {
  WEIGHT_GOAL_OPTIONS,
  DIET_TYPE_OPTIONS,
  type WeightGoal,
  type DietType,
  WEIGHT_GOAL,
} from '@/constants';

interface EnergyTargetsCardProps {
  bmr: number;
  tdee: number;
  targetCalories: number;
  goal: WeightGoal;
  diet: DietType;
  activityFactor: number;
  onGoalChange: (goal: WeightGoal) => void;
  onDietChange: (diet: DietType) => void;
}

export const EnergyTargetsCard: React.FC<EnergyTargetsCardProps> = ({
  bmr,
  targetCalories,
  goal,
  diet,
  activityFactor,
  onGoalChange,
  onDietChange,
}) => {
  return (
    <div className="flex flex-col gap-6 rounded-[5px] border border-[#32363E] bg-[#16181D]/60 p-4 md:p-5 backdrop-blur-sm">
      {/* Target Calories Banner */}
      <div className="flex w-full flex-col justify-between rounded-[10px] bg-[#251F13]/80 p-4 shadow-md backdrop-blur-md">
        <span className="font-sans text-[14px] md:text-[16px] font-medium text-[#8E8F96]">
          Target Calories
        </span>

        <span className="my-1 font-serif text-[34px] md:text-[40px] font-medium leading-[1.2] text-[#F59F0A]">
          {targetCalories} kcal
        </span>

        <div className="flex items-center gap-2">
          <div className="flex h-[32px] items-center justify-center rounded-[5px] bg-[#4F3911]/90 px-2.5">
            <span className="font-sans text-[13px] font-medium uppercase leading-[1.35] text-[#F59F0A]">
              {goal === WEIGHT_GOAL.LOSE
                ? 'LOSS'
                : goal === WEIGHT_GOAL.GAIN
                  ? 'GAIN'
                  : 'MAINTAIN'}
            </span>
          </div>
          <span className="font-sans text-[12px] text-[#8E8F96]">
            BMR {bmr} × {activityFactor}
          </span>
        </div>
      </div>

      {/* Goal Selector */}
      <div className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <label className="form-label text-[14px] font-medium text-foreground">Goal</label>
          <InfoTooltip
            title="Goal"
            content="Defines caloric balance: Loss creates a 15% deficit, Gain creates a 15% surplus, and Maintain matches your TDEE."
            align="right"
          />
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {WEIGHT_GOAL_OPTIONS.map((opt) => (
            <SelectButton
              key={opt.id}
              isSelected={goal === opt.id}
              onClick={() => onGoalChange(opt.id)}
            >
              {opt.label}
            </SelectButton>
          ))}
        </div>
      </div>

      {/* Strategy / Diet Selector */}
      <div className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <label className="form-label text-[14px] font-medium text-foreground">Strategy</label>
          <InfoTooltip
            title="Strategy"
            content="Macro distribution preset: Balanced (40% Carbs, 30% Protein, 30% Fats), Low-Carb (25% Carbs, 40% Protein, 35% Fats), or Keto (5% Carbs, 25% Protein, 70% Fats)."
            align="right"
          />
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {DIET_TYPE_OPTIONS.map((opt) => (
            <SelectButton
              key={opt.id}
              isSelected={diet === opt.id}
              onClick={() => onDietChange(opt.id)}
            >
              {opt.label}
            </SelectButton>
          ))}
        </div>
      </div>
    </div>
  );
};
