import React, { useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import InfoTooltip from '@/components/InfoTooltip';
import { blockInvalidIntegerInput, sanitizePositiveInt } from '@/utils/inputHandlers';

interface MacroAdjustmentCardProps {
  macroTargets: { protein: number; carbs: number; fats: number };
  targetCalories: number;
  weightKg: number;
  onProteinChange: (protein: number) => void;
}

export const MacroAdjustmentCard: React.FC<MacroAdjustmentCardProps> = ({
  macroTargets,
  targetCalories,
  weightKg,
  onProteinChange,
}) => {
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

  const handleProteinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = sanitizePositiveInt(e.target.value);
    onProteinChange(typeof val === 'number' ? val : 0);
  };

  const ratio = weightKg > 0 ? macroTargets.protein / weightKg : 0;
  const ratioStr = (Math.round(ratio * 10) / 10).toFixed(1);

  return (
    <div className="flex flex-col gap-6 rounded-[5px] border border-[#32363E] bg-[#16181D]/60 p-4 md:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-[#32363E]/60 pb-3">
        <h3 className="font-sans text-[16px] font-semibold text-foreground">
          Macronutrient Targets
        </h3>
        <InfoTooltip
          title="Macro Targets"
          content="You can manually adjust protein. Carbs and fats will be automatically rebalanced according to your selected diet strategy and target calories."
          align="right"
        />
      </div>

      {/* 3 Macro Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Protein (Editable) */}
        <div className="flex flex-col gap-1.5">
          <label className="form-label text-[13px] font-medium text-foreground">Protein</label>
          <div className="flex h-[44px] w-full items-center justify-center rounded-[5px] border border-[#F59F0A] bg-[#16181D]/90 px-2 font-sans text-[14px] text-foreground shadow-sm">
            <input
              type="text"
              inputMode="numeric"
              value={macroTargets.protein || ''}
              onKeyDown={blockInvalidIntegerInput}
              onChange={handleProteinInputChange}
              className="w-10 bg-transparent text-center font-semibold text-[#F59F0A] outline-none"
              maxLength={4}
            />
            <span className="pointer-events-none select-none text-[12px] text-[#8E8F96]">
              g (~{macroPercentages.protein}%)
            </span>
          </div>
        </div>

        {/* Carbs (Calculated) */}
        <div className="flex flex-col gap-1.5">
          <label className="form-label text-[13px] font-medium text-foreground">Carbs</label>
          <div className="flex h-[44px] w-full select-none items-center justify-center rounded-[5px] border border-[#32363E] bg-[#16181D]/60 px-2 font-sans text-[14px] text-foreground backdrop-blur-sm">
            <span className="font-semibold text-foreground">{macroTargets.carbs}</span>
            <span className="text-[12px] text-[#8E8F96] ml-1">g (~{macroPercentages.carbs}%)</span>
          </div>
        </div>

        {/* Fats (Calculated) */}
        <div className="flex flex-col gap-1.5">
          <label className="form-label text-[13px] font-medium text-foreground">Fats</label>
          <div className="flex h-[44px] w-full select-none items-center justify-center rounded-[5px] border border-[#32363E] bg-[#16181D]/60 px-2 font-sans text-[14px] text-foreground backdrop-blur-sm">
            <span className="font-semibold text-foreground">{macroTargets.fats}</span>
            <span className="text-[12px] text-[#8E8F96] ml-1">g (~{macroPercentages.fats}%)</span>
          </div>
        </div>
      </div>

      {/* Protein Recommendation Feedback */}
      {ratio < 1.2 ? (
        <div className="flex items-center gap-2.5 rounded-[10px] border border-amber-500/20 bg-amber-500/10 p-3 text-amber-500">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="font-sans text-[14px] font-semibold">
              Too little protein ({ratioStr} g/kg)
            </span>
            <span className="text-[12px] text-amber-500/80">
              The recommended minimum to preserve muscle mass is 1.2 g per 1 kg of body weight.
            </span>
          </div>
        </div>
      ) : ratio > 2.5 ? (
        <div className="flex items-center gap-2.5 rounded-[10px] border border-red-500/20 bg-red-500/10 p-3 text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="font-sans text-[14px] font-semibold">
              Too much protein ({ratioStr} g/kg)
            </span>
            <span className="text-[12px] text-red-400/80">
              Consuming over 2.5 g/kg provides diminishing returns and increases metabolic load.
            </span>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center gap-3 rounded-[10px] border border-[#1A3831] bg-[#0F221F]/85 p-3 shadow-sm backdrop-blur-md">
          <img
            src="/icons/Logo-green.svg"
            alt="Optimal protein"
            className="pointer-events-none h-[28px] w-[28px] shrink-0 select-none"
          />
          <div className="flex flex-col text-left">
            <span className="font-sans text-[15px] font-medium leading-tight text-foreground">
              Optimal! ({ratioStr} g/kg)
            </span>
            <span className="mt-0.5 font-sans text-[13px] leading-tight text-[#8E8F96]">
              Ideal protein range to support your body composition and goals.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
