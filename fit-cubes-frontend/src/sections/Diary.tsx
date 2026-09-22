import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useModalOpen } from '@/hooks/useModalOpen';
import { addDays } from '@/utils/calculations';
import { MEAL_TYPE_OPTIONS } from '@/constants';
import { DiaryDateNav } from '@/components/diary/DiaryDateNav';
import { MealSection } from '@/components/diary/MealSection';
import { MealSectionSkeleton } from '@/components/diary/MealSectionSkeleton';
import { ExerciseSection } from '@/components/diary/ExerciseSection';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import FoodSearch from './FoodSearch';
import FoodAdd from './FoodAdd';
import ExerciseLogger from './ExerciseLogger';
import { authService } from '@/services/authService';
import { diaryService } from '@/services/diaryService';
import {
  mapDiaryFoodEntryDtoToFoodEntry,
  mapDiaryExerciseEntryDtoToExerciseEntry,
} from '@/utils/apiMappers';
import type { FoodItem, FoodEntry, ExerciseEntry } from '@/types';

export default function Diary() {
  const selectedDate = useStore((state) => state.selectedDate);
  const setSelectedDate = useStore((state) => state.setSelectedDate);
  const dailyLogs = useStore((state) => state.dailyLogs);
  const products = useStore((state) => state.products);
  const removeFoodEntry = useStore((state) => state.removeFoodEntry);
  const removeExerciseEntry = useStore((state) => state.removeExerciseEntry);
  const syncDayLog = useStore((state) => state.syncDayLog);
  const pendingFoodLog = useStore((state) => state.pendingFoodLog);
  const setPendingFoodLog = useStore((state) => state.setPendingFoodLog);

  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [showExercise, setShowExercise] = useState(false);
  const [directFoodAdd, setDirectFoodAdd] = useState<{
    food: FoodItem;
    mealType: string;
    existingEntry?: FoodEntry;
  } | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<FoodEntry | null>(null);
  const [editExercise, setEditExercise] = useState<ExerciseEntry | null>(null);
  const [isDiaryLoading, setIsDiaryLoading] = useState(true);

  useModalOpen(showFoodSearch);
  useModalOpen(showExercise);
  useModalOpen(!!directFoodAdd);

  // Fetch diary entries from live Spring Boot backend on date change
  useEffect(() => {
    let isCancelled = false;

    if (!authService.isAuthenticated()) {
      setIsDiaryLoading(false);
      return;
    }

    setIsDiaryLoading(true);

    diaryService
      .getDayLog(selectedDate)
      .then((res) => {
        if (isCancelled) return;
        if (res.ok && res.data) {
          const mappedFoods = (res.data.foodEntries || []).map(mapDiaryFoodEntryDtoToFoodEntry);
          const mappedExercises = (res.data.exerciseEntries || []).map(
            mapDiaryExerciseEntryDtoToExerciseEntry
          );
          syncDayLog(selectedDate, mappedFoods, mappedExercises);
        }
      })
      .catch((err) => {
        console.error('Failed to load day log from backend:', err);
      })
      .finally(() => {
        if (!isCancelled) {
          setIsDiaryLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedDate, syncDayLog]);

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
    let originalProduct = products.find((p) => p.id === entry.foodItemId);

    if (!originalProduct) {
      originalProduct = products.find((p) => p.name === entry.name);

      if (!originalProduct) {
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
    setDirectFoodAdd({
      food: originalProduct,
      mealType: entry.mealType,
      existingEntry: entry,
    });
  };

  const handleAddExercise = () => {
    setEditExercise(null);
    setShowExercise(true);
  };

  const handleEditExercise = (entry: ExerciseEntry) => {
    setEditExercise(entry);
    setShowExercise(true);
  };

  const handleDeleteExercise = (id: string) => {
    removeExerciseEntry(selectedDate, id);
    if (authService.isAuthenticated()) {
      // Only sync with backend if entry has a numeric DB ID
      if (!id.startsWith('ex_') && /^\d+$/.test(id)) {
        diaryService.removeExerciseEntry(selectedDate, id).catch((err) => {
          console.error('Failed to delete exercise entry from backend:', err);
        });
      }
    }
  };

  const handleConfirmDeleteFood = () => {
    if (!entryToDelete) return;
    const entry = entryToDelete;
    setEntryToDelete(null);
    removeFoodEntry(selectedDate, entry.id);

    if (authService.isAuthenticated()) {
      // Only sync with backend if entry has a numeric DB ID
      if (!entry.id.startsWith('fe_') && /^\d+$/.test(entry.id)) {
        diaryService.removeFoodEntry(selectedDate, entry.id).catch((err) => {
          console.error('Failed to delete food entry from backend:', err);
        });
      }
    }
  };

  const handleCancelDeleteFood = () => {
    setEntryToDelete(null);
  };

  return (
    <div className="flex flex-col h-full">
      <DiaryDateNav
        selectedDate={selectedDate}
        caloriesIn={totals.calories}
        caloriesOut={totals.exercise}
        onPrevDay={() => setSelectedDate(addDays(selectedDate, -1))}
        onNextDay={() => setSelectedDate(addDays(selectedDate, 1))}
      />

      <div className="glass-card mx-10 flex-1 px-5 py-4 space-y-4">
        {isDiaryLoading ? (
          <>
            <MealSectionSkeleton itemCount={2} />
            <MealSectionSkeleton itemCount={1} />
            <MealSectionSkeleton itemCount={2} />
            <MealSectionSkeleton itemCount={1} />
          </>
        ) : (
          <>
            {MEAL_TYPE_OPTIONS.map((meal) => (
              <MealSection
                key={meal.key}
                mealKey={meal.key}
                mealLabel={meal.label}
                entries={getMealEntries(meal.key)}
                onAddFood={handleAddFood}
                onEditEntry={handleEditEntry}
                onDeleteEntry={setEntryToDelete}
              />
            ))}

            <ExerciseSection
              entries={dayLog?.exerciseEntries || []}
              onAddExercise={handleAddExercise}
              onEditExercise={handleEditExercise}
              onDeleteExercise={handleDeleteExercise}
            />
          </>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showFoodSearch && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/80 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:pt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full mx-10  h-[90dvh] max-h-[90dvh] md:h-[800px] glass rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden bg-background"
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

        {showExercise && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/80 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full h-[90dvh] max-h-[90dvh] md:h-[800px] glass rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden bg-background mx-12"
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

        {directFoodAdd && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/80 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-[500px] h-[90dvh] max-h-[90dvh] md:h-[800px] glass rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden bg-background"
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

      {/* Universal Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={!!entryToDelete}
        title="Remove food?"
        description={
          entryToDelete && (
            <>
              Are you sure you want to remove <strong>"{entryToDelete.name}"</strong> from the diary?
            </>
          )
        }
        confirmText="Remove"
        variant="destructive"
        onConfirm={handleConfirmDeleteFood}
        onCancel={handleCancelDeleteFood}
      />
    </div>
  );
}
