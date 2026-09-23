import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Plus, Trash2 } from 'lucide-react';
import { formatLargeNumber } from '@/utils/calculations';
import type { ExerciseEntry } from '@/types';

interface ExerciseSectionProps {
  entries: ExerciseEntry[];
  onAddExercise: () => void;
  onEditExercise: (entry: ExerciseEntry) => void;
  onDeleteExercise: (entry: ExerciseEntry) => void;
}

export const ExerciseSection: React.FC<ExerciseSectionProps> = ({
  entries,
  onAddExercise,
  onEditExercise,
  onDeleteExercise,
}) => {
  const totalBurnedCalories = entries.reduce((acc, entry) => acc + entry.caloriesBurned, 0);

  return (
    <div className="rounded-[5px] border border-[#32363E] bg-[#16181D]/60 backdrop-blur-sm overflow-hidden transition-all hover:border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between px-2.5 py-2.5">
        <div className="flex items-center gap-2.5">
          <Dumbbell className="w-5 h-5 text-[#F59F0A]" />
          <span className="font-medium text-[16px] text-[#F5F6FA] font-sans tracking-tight">Exercise</span>
        </div>
        <button
          type="button"
          onClick={onAddExercise}
          className="p-1 rounded-[5px] text-[#8E8F96] hover:text-[#F5F6FA] hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Add exercise"
        >
          <Plus className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* Exercise Entries List */}
      <div className="divide-y divide-[#32363E]/40 border-t border-[#32363E]/40">
        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between px-2.5 py-2.5 hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => onEditExercise(entry)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{entry.activityType}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-medium">
                  {formatLargeNumber(entry.metric)} {entry.metricLabel}
                  {entry.rpe ? ` · RPE ${entry.rpe}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-primary">
                  +{formatLargeNumber(entry.caloriesBurned)}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteExercise(entry);
                  }}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Exercise Total Footer */}
      {entries.length > 0 && (
        <div className="px-2.5 py-2 bg-black/5 dark:bg-white/5 text-right">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Total Burned: -{formatLargeNumber(totalBurnedCalories)} kcal
          </span>
        </div>
      )}
    </div>
  );
};

export default ExerciseSection;
