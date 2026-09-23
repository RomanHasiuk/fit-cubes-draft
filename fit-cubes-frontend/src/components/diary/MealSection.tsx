import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Sun, Moon, Apple, Plus, Trash2 } from 'lucide-react';
import { formatLargeNumber } from '@/utils/calculations';
import type { FoodEntry, MealType } from '@/types';
import { MEAL_TYPE } from '@/constants';

interface MealSectionProps {
  mealKey: MealType;
  mealLabel: string;
  entries: FoodEntry[];
  onAddFood: (mealKey: MealType) => void;
  onEditEntry: (entry: FoodEntry) => void;
  onDeleteEntry: (entry: FoodEntry) => void;
}

const getMealIcon = (key: MealType) => {
  switch (key) {
    case MEAL_TYPE.BREAKFAST:
      return Utensils;
    case MEAL_TYPE.LUNCH:
      return Sun;
    case MEAL_TYPE.DINNER:
      return Moon;
    case MEAL_TYPE.SNACKS:
      return Apple;
    default:
      return Utensils;
  }
};

export const MealSection: React.FC<MealSectionProps> = ({
  mealKey,
  mealLabel,
  entries,
  onAddFood,
  onEditEntry,
  onDeleteEntry,
}) => {
  const totalMealCalories = entries.reduce((acc, entry) => acc + entry.calories, 0);
  const IconComponent = getMealIcon(mealKey);

  return (
    <div className="rounded-[5px] border border-[#32363E] bg-[#16181D]/60 backdrop-blur-sm overflow-hidden transition-all hover:border-white/20">
      {/* Meal Header */}
      <div className="flex items-center justify-between px-2.5 py-2.5">
        <div className="flex items-center gap-2.5">
          <IconComponent className="w-5 h-5 text-[#F59F0A]" />
          <span className="font-medium text-[16px] text-[#F5F6FA] font-sans tracking-tight">
            {mealLabel}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAddFood(mealKey)}
          className="p-1 rounded-[5px] text-[#8E8F96] hover:text-[#F5F6FA] hover:bg-white/10 transition-colors cursor-pointer"
          aria-label={`Add food to ${mealLabel}`}
        >
          <Plus className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* Food Entries List */}
      <div className="divide-y divide-[#32363E]/40 border-t border-[#32363E]/40">
        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between px-2.5 py-2.5 hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => onEditEntry(entry)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{entry.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-medium">
                  {formatLargeNumber(entry.weightGrams)}g · P:{formatLargeNumber(entry.protein)}g{' '}
                  C:{formatLargeNumber(entry.carbs)}g F:{formatLargeNumber(entry.fats)}g
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold">{formatLargeNumber(entry.calories)}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteEntry(entry);
                  }}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Meal Total Footer */}
      {entries.length > 0 && (
        <div className="px-2.5 py-2 bg-black/5 dark:bg-white/5 text-right">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Total: {formatLargeNumber(totalMealCalories)} kcal
          </span>
        </div>
      )}
    </div>
  );
};

export default MealSection;
