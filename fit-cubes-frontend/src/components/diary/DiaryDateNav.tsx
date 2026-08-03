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
    <div className="shrink-0 flex items-center justify-between px-5 pt-6 pb-4 border-b border-white/5">
      <button
        type="button"
        onClick={onPrevDay}
        className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="text-center">
        <p className="text-lg font-bold">{getRelativeDateLabel(selectedDate)}</p>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {formatLargeNumber(caloriesIn)} kcal in · {formatLargeNumber(caloriesOut)} kcal out
        </p>
      </div>
      <button
        type="button"
        onClick={onNextDay}
        className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default DiaryDateNav;
