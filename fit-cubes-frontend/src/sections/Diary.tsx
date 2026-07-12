import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  UtensilsCrossed,
  Dumbbell,
} from 'lucide-react';
import { useStore } from '@/store/useStore.ts';
import { addDays, getRelativeDateLabel } from '@/utils/calculations.ts';
import FoodSearch from './FoodSearch.tsx';
import FoodAdd from './FoodAdd.tsx';
import ExerciseLogger from './ExerciseLogger.tsx';
import type { FoodItem, FoodEntry, ExerciseEntry } from '@/types';

const MEAL_TYPES = [
  { key: 'breakfast' as const, label: 'Breakfast' },
  { key: 'lunch' as const, label: 'Lunch' },
  { key: 'dinner' as const, label: 'Dinner' },
  { key: 'snacks' as const, label: 'Snacks' },
];

export default function Diary() {
  const selectedDate = useStore((state) => state.selectedDate);
  const setSelectedDate = useStore((state) => state.setSelectedDate);
  const dailyLogs = useStore((state) => state.dailyLogs);
  const products = useStore((state) => state.products);
  const removeFoodEntry = useStore((state) => state.removeFoodEntry);
  const removeExerciseEntry = useStore((state) => state.removeExerciseEntry);
  const pendingFoodLog = useStore((state) => state.pendingFoodLog);
  const setPendingFoodLog = useStore((state) => state.setPendingFoodLog);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [showExercise, setShowExercise] = useState(false);
  const [directFoodAdd, setDirectFoodAdd] = useState<{ food: FoodItem; mealType: string; existingEntry?: FoodEntry } | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<FoodEntry | null>(null);
  const [editExercise, setEditExercise] = useState<ExerciseEntry | null>(null);

  useEffect(() => {
    if (pendingFoodLog) {
      const timer = setTimeout(() => {
        setDirectFoodAdd(pendingFoodLog);
        setPendingFoodLog(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pendingFoodLog, setPendingFoodLog]);

  const dayLog = useMemo(
    () => dailyLogs.find((l) => l.date === selectedDate),
    [dailyLogs, selectedDate]
  );

  const totals = useMemo(() => {
    if (!dayLog) return { calories: 0, exercise: 0 };
    const cal = dayLog.foodEntries.reduce((a, e) => a + e.calories, 0);
    const ex = dayLog.exerciseEntries.reduce((a, e) => a + e.caloriesBurned, 0);
    return { calories: Math.round(cal), exercise: Math.round(ex) };
  }, [dayLog]);

  const handleAddFood = (meal: string) => {
    setSelectedMeal(meal);
    setShowFoodSearch(true);
  };

  const getMealEntries = (meal: string): FoodEntry[] => {
    if (!dayLog) return [];
    return dayLog.foodEntries.filter((e) => e.mealType === meal);
  };

  const handleEditEntry = (entry: FoodEntry) => {
    let originalProduct = products.find(p => p.id === entry.foodItemId);
    
    if (!originalProduct) {
      // Fallback for custom recipes or older legacy entries
      originalProduct = products.find(p => p.name === entry.name);
      
      if (!originalProduct) {
         // Create a temporary FoodItem from entry macros
         const factor = entry.weightGrams > 0 ? 100 / entry.weightGrams : 1;
        originalProduct = {
           id: entry.foodItemId || `temp_${entry.name}_${entry.weightGrams}`,
           name: entry.name,
           category: 'Recovered product',
           caloriesPer100g: entry.calories * factor,
           proteinPer100g: entry.protein * factor,
           carbsPer100g: entry.carbs * factor,
           fatsPer100g: entry.fats * factor,
         };
      }
    }
    setDirectFoodAdd({ food: originalProduct, mealType: entry.mealType, existingEntry: entry });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Date Navigation */}
      <div className="shrink-0 flex items-center justify-between px-5 pt-6 pb-4 border-b border-white/5">
        <button
          onClick={() => setSelectedDate(addDays(selectedDate, -1))}
          className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-lg font-bold">{getRelativeDateLabel(selectedDate)}</p>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {totals.calories} kcal in · {totals.exercise} kcal out
          </p>
        </div>
        <button
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4 space-y-4">
        {/* Meals */}
        {MEAL_TYPES.map((meal) => (
          <div key={meal.key} className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 bg-white/5">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm tracking-tight">{meal.label}</span>
              </div>
              <button
                onClick={() => handleAddFood(meal.key)}
                className="p-1.5 rounded-lg bg-primary/20 text-primary hover:scale-110 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-white/5">
              <AnimatePresence>
                {getMealEntries(meal.key).map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => handleEditEntry(entry)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{entry.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">
                        {Math.round(entry.weightGrams)}g · P:{Math.round(entry.protein)}g
                        C:{Math.round(entry.carbs)}g F:{Math.round(entry.fats)}g
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">{Math.round(entry.calories)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEntryToDelete(entry);
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

            {getMealEntries(meal.key).length > 0 && (
              <div className="px-4 py-2 bg-black/5 dark:bg-white/5 text-right">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Total: {Math.round(
                    getMealEntries(meal.key).reduce((a, e) => a + e.calories, 0)
                  )}{' '}
                  kcal
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Exercise Section */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 bg-white/5">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm tracking-tight">Exercise</span>
            </div>
            <button
              onClick={() => setShowExercise(true)}
              className="p-1.5 rounded-lg bg-primary/20 text-primary hover:scale-110 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

                  <div className="divide-y divide-white/5">
            <AnimatePresence>
              {dayLog?.exerciseEntries.map((entry: ExerciseEntry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => {
                    setEditExercise(entry);
                    setShowExercise(true);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{entry.activityType}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">
                      {entry.metric} {entry.metricLabel}
                      {entry.rpe ? ` · RPE ${entry.rpe}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">
                      +{Math.round(entry.caloriesBurned)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExerciseEntry(selectedDate, entry.id);
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
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showFoodSearch && (
          <motion.div
            className="fixed inset-0 z-[100] bg-background/40 backdrop-blur-3xl flex justify-center items-end md:items-center p-0 md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-full max-w-[500px] h-[90vh] md:h-[800px] glass rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <FoodSearch
                mealType={selectedMeal}
                onClose={() => setShowFoodSearch(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExercise && (
          <motion.div
            className="fixed inset-0 z-[100] bg-background/40 backdrop-blur-3xl flex justify-center items-end md:items-center p-0 md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-full max-w-[500px] h-[90vh] md:h-[800px] glass rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <ExerciseLogger 
                onClose={() => {
                  setShowExercise(false);
                  setEditExercise(null);
                }} 
                editEntry={editExercise || undefined} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {directFoodAdd && (
          <motion.div
            className="fixed inset-0 z-[100] bg-background/40 backdrop-blur-3xl flex justify-center items-end md:items-center p-0 md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-full max-w-[500px] h-[90vh] md:h-[800px] glass rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden bg-background"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <FoodAdd
                food={directFoodAdd.food}
                mealType={directFoodAdd.mealType}
                existingEntry={directFoodAdd.existingEntry}
                onClose={() => setDirectFoodAdd(null)}
                onDone={() => setDirectFoodAdd(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diary Deletion Confirmation Modal */}
      <AnimatePresence>
        {entryToDelete && (
          <motion.div
            className="fixed inset-0 z-[110] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass border border-white/10 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-bold mb-2">Remove food?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to remove <strong>"{entryToDelete.name}"</strong> from the diary?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setEntryToDelete(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    removeFoodEntry(selectedDate, entryToDelete.id);
                    setEntryToDelete(null);
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
