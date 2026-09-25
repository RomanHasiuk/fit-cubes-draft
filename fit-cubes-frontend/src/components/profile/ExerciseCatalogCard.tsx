import React from 'react';
import { Dumbbell } from 'lucide-react';
import InfoTooltip from '@/components/InfoTooltip';
import type { ActivityConstant } from '@/constants';

interface ExerciseCatalogCardProps {
  activities: ActivityConstant[];
  weightKg: number;
}

export const ExerciseCatalogCard: React.FC<ExerciseCatalogCardProps> = ({
  activities,
  weightKg,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-[5px] border border-[#32363E] bg-[#16181D]/60 p-4 md:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-[#32363E]/60 pb-3">
        <h3 className="font-sans text-[16px] font-semibold text-foreground">
          Exercise Metrics (MET Reference)
        </h3>
        <InfoTooltip
          title="What is MET?"
          content="1 MET is resting metabolic expenditure. Higher MET corresponds to higher intensity and calorie expenditure."
          align="right"
        />
      </div>

      <div className="divide-y divide-[#32363E]/60 overflow-hidden rounded-[5px]">
        {activities.map((item) => {
          let displayKcal = item.kcalPerUnit;
          if (displayKcal === 0) {
            displayKcal = (item.met * 3.5 * (weightKg || 75)) / 200;
          }
          return (
            <div
              key={item.name}
              className="flex items-center justify-between py-3 px-1 transition-colors hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F59F0A]/10 text-[#F59F0A]">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-sans text-[14px] font-medium text-foreground">{item.name}</p>
                  <p className="text-[12px] text-[#8E8F96]">
                    {parseFloat(displayKcal.toFixed(1))} kcal / {item.metricLabel}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="rounded-[4px] border border-[#4F3911] bg-[#251F13] px-2 py-0.5 font-sans text-[12px] font-semibold text-[#F59F0A]">
                  MET {item.met}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
