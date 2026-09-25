import React from 'react';
import { Scale, UtensilsCrossed } from 'lucide-react';
import InfoTooltip from '@/components/InfoTooltip';
import { blockInvalidIntegerInput } from '@/utils/inputHandlers';

interface RecipeWeightSectionProps {
  rawWeight: number;
  finalWeight: number | '';
  onCookedWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCookedWeightBlur: () => void;
}

export const RecipeWeightSection: React.FC<RecipeWeightSectionProps> = ({
  rawWeight,
  finalWeight,
  onCookedWeightChange,
  onCookedWeightBlur,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Raw Weight Card */}
      <div className="flex flex-col justify-between rounded-[5px] border border-[#32363E] bg-[#16181D]/60 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[13px] font-medium text-[#8E8F96]">
            Total Raw Mass
          </span>
          <Scale className="h-4 w-4 text-[#8E8F96]" />
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-serif text-[28px] font-bold text-foreground">
            {Math.round(rawWeight)}
          </span>
          <span className="font-sans text-[14px] text-[#8E8F96]">g</span>
        </div>
        <p className="mt-1 font-sans text-[11px] text-[#8E8F96]">
          Sum of all individual ingredient weights
        </p>
      </div>

      {/* Cooked / Yield Weight Card */}
      <div className="flex flex-col justify-between rounded-[5px] border border-[#4F3911] bg-[#251F13]/70 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-sans text-[13px] font-medium text-[#F59F0A]">
              Finished Cooked Mass
            </span>
            <InfoTooltip
              title="Cooked Weight"
              content="Food loses or gains water during cooking (boiling, baking, frying). Weigh your finished dish to get the exact nutritional density per 100g."
              align="right"
            />
          </div>
          <UtensilsCrossed className="h-4 w-4 text-[#F59F0A]" />
        </div>

        <div className="mt-2 flex items-center gap-1">
          <input
            type="text"
            inputMode="numeric"
            onKeyDown={blockInvalidIntegerInput}
            value={finalWeight === 0 ? '' : finalWeight}
            placeholder={Math.round(rawWeight).toString()}
            onChange={onCookedWeightChange}
            onBlur={onCookedWeightBlur}
            className="w-full bg-transparent font-serif text-[28px] font-bold text-[#F59F0A] outline-none placeholder:text-[#F59F0A]/40"
          />
          <span className="font-sans text-[14px] font-medium text-[#F59F0A]">g</span>
        </div>
        <p className="mt-1 font-sans text-[11px] text-[#F59F0A]/80">
          Defaults to raw weight if left unadjusted
        </p>
      </div>
    </div>
  );
};
