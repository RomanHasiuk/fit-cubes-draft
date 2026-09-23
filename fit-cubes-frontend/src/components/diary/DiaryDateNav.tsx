import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getRelativeDateLabel, formatLargeNumber } from '@/utils/calculations';

interface DiaryDateNavProps {
  selectedDate: string;
  caloriesIn: number;
  caloriesOut: number;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export const DiaryDateNav: React.FC<DiaryDateNavProps> = ({
  selectedDate,
  caloriesIn,
  caloriesOut,
  onPrevDay,
  onNextDay,
}) => {
  return (
    <div className="shrink-0 flex items-center justify-between pb-4 border-b border-[#32363E]/40 mb-2">
      <button
        type="button"
        onClick={onPrevDay}
        className="p-1.5 rounded-[5px] text-[#8E8F96] hover:text-[#F5F6FA] hover:bg-white/5 transition-colors cursor-pointer"
        aria-label="Previous day"
      >
        <ChevronLeft className="w-6 h-6 stroke-[2]" />
      </button>
      <div className="text-center">
        <h2 className="heading-h2 font-serif text-[24px] md:text-[26px] font-semibold text-[#F5F6FA] leading-tight">
          {getRelativeDateLabel(selectedDate)}
        </h2>
        <div className="flex items-center justify-center gap-2.5 text-sm md:text-[16px] font-medium text-[#B6B6BC] mt-1 font-sans">
          <span>{formatLargeNumber(caloriesIn)} kcal in</span>
          <span className="text-xs text-[#8E8F96] leading-none">•</span>
          <span>{formatLargeNumber(caloriesOut)} kcal out</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onNextDay}
        className="p-1.5 rounded-[5px] text-[#8E8F96] hover:text-[#F5F6FA] hover:bg-white/5 transition-colors cursor-pointer"
        aria-label="Next day"
      >
        <ChevronRight className="w-6 h-6 stroke-[2]" />
      </button>
    </div>
  );
};

export default DiaryDateNav;
