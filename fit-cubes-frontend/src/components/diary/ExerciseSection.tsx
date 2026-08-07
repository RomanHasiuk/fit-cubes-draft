import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Plus, Trash2 } from 'lucide-react';
import { formatLargeNumber } from '@/utils/calculations';
import type { ExerciseEntry } from '@/types';

interface ExerciseSectionProps {
  entries: ExerciseEntry[];
  onAddExercise: () => void;
  onEditExercise: (entry: ExerciseEntry) => void;
  onDeleteExercise: (entryId: string) => void;
}

export const ExerciseSection: React.FC<ExerciseSectionProps> = ({
  entries,
  onAddExercise,
  onEditExercise,
  onDeleteExercise,
}) => {
  const totalBurnedCalories = entries.reduce((acc, entry) => acc + entry.caloriesBurned, 0);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-white/5">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm tracking-tight">Exercise</span>
        </div>
        <button
          type="button"
          onClick={onAddExercise}
          className="p-1.5 rounded-lg bg-primary/20 text-primary hover:scale-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Exercise Entries List */}
      <div className="divide-y divide-white/5">
        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer"
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
                    onDeleteExercise(entry.id);
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

      {/* Exercise Total Footer */}
      {entries.length > 0 && (
        <div className="px-4 py-2 bg-black/5 dark:bg-white/5 text-right">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Total Burned: -{formatLargeNumber(totalBurnedCalories)} kcal
          </span>
        </div>
      )}
    </div>
  );
};

export default ExerciseSection;
