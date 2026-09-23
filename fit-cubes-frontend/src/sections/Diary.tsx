import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useModalOpen } from '@/hooks/useModalOpen';
import { addDays } from '@/utils/calculations';
import { MEAL_TYPE, MEAL_TYPE_OPTIONS, type MealType } from '@/constants';
import { DiaryDateNav } from '@/components/diary/DiaryDateNav';
import { MealSection } from '@/components/diary/MealSection';
import { MealSectionSkeleton } from '@/components/diary/MealSectionSkeleton';
import { ExerciseSection } from '@/components/diary/ExerciseSection';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ModalDrawer } from '@/components/ui/ModalDrawer';
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
  const [selectedMeal, setSelectedMeal] = useState<MealType>(MEAL_TYPE.BREAKFAST);
  const [showExercise, setShowExercise] = useState(false);
  const [directFoodAdd, setDirectFoodAdd] = useState<{
    food: FoodItem;
    mealType: MealType;
    existingEntry?: FoodEntry;
  } | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<FoodEntry | null>(null);
  const [exerciseToDelete, setExerciseToDelete] = useState<ExerciseEntry | null>(null);
  const [editExercise, setEditExercise] = useState<ExerciseEntry | null>(null);
  const [isDiaryLoading, setIsDiaryLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

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

  const handleAddFood = (meal: MealType) => {
    setSelectedMeal(meal);
    setShowFoodSearch(true);
  };

  const getMealEntries = (meal: MealType): FoodEntry[] => {
    if (!dayLog) return [];
    return dayLog.foodEntries.filter((e) => e.mealType === meal);
  };

  const handleEditEntry = (entry: FoodEntry) => {
    let originalProduct = products.find((p) => p.id === entry.foodItemId);

    if (!originalProduct) {
      originalProduct = products.find(
        (p) => p.name.trim().toLowerCase() === entry.name.trim().toLowerCase()
      );

      if (!originalProduct) {
        const factor = entry.weightGrams > 0 ? 100 / entry.weightGrams : 1;
        originalProduct = {
          id: `custom_recovered_${entry.id}`,
          name: entry.name,
          category: 'Recovered product',
          caloriesPer100g: Number((entry.calories * factor).toFixed(1)),
          proteinPer100g: Number((entry.protein * factor).toFixed(1)),
          carbsPer100g: Number((entry.carbs * factor).toFixed(1)),
          fatsPer100g: Number((entry.fats * factor).toFixed(1)),
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

  const handleConfirmDeleteExercise = () => {
    if (!exerciseToDelete) return;
    const entry = exerciseToDelete;
    setExerciseToDelete(null);
    removeExerciseEntry(selectedDate, entry.id);

    if (authService.isAuthenticated()) {
      // Only sync with backend if entry has a numeric DB ID
      if (!entry.id.startsWith('ex_') && /^\d+$/.test(entry.id)) {
        diaryService.removeExerciseEntry(selectedDate, entry.id).catch((err) => {
          console.error('Failed to delete exercise entry from backend:', err);
          setSyncError('Could not sync exercise removal with server.');
          setTimeout(() => setSyncError(null), 3000);
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
          setSyncError('Could not sync food removal with server.');
          setTimeout(() => setSyncError(null), 3000);
        });
      }
    }
  };

  const handleCancelDeleteFood = () => {
    setEntryToDelete(null);
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[1016px] flex-col relative px-4 md:px-8 pt-[102px] md:pt-[126px] pb-12">
      {/* Network Sync Feedback */}
      <AnimatePresence>
        {syncError && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-xl text-xs font-semibold shadow-lg backdrop-blur"
          >
            {syncError}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-[5px] border border-[#32363E] bg-[#0F1114]/80 backdrop-blur-md px-2.5 pt-2 pb-2.5 min-h-[500px] shadow-2xl space-y-2.5">
        <DiaryDateNav
          selectedDate={selectedDate}
          caloriesIn={totals.calories}
          caloriesOut={totals.exercise}
          onPrevDay={() => setSelectedDate(addDays(selectedDate, -1))}
          onNextDay={() => setSelectedDate(addDays(selectedDate, 1))}
        />

        <div className="space-y-3">
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
                onDeleteExercise={setExerciseToDelete}
              />
            </>
          )}
        </div>
      </div>

      {/* Modals via reusable ModalDrawer */}
      <ModalDrawer
        isOpen={showFoodSearch}
        onClose={() => setShowFoodSearch(false)}
        maxWidth="w-full mx-4 md:max-w-[1016px]"
      >
        <FoodSearch
          mealType={selectedMeal}
          onClose={() => setShowFoodSearch(false)}
        />
      </ModalDrawer>

      <ModalDrawer
        isOpen={showExercise}
        onClose={() => {
          setShowExercise(false);
          setEditExercise(null);
        }}
        maxWidth="w-full mx-12 md:max-w-2xl"
      >
        <ExerciseLogger
          onClose={() => {
            setShowExercise(false);
            setEditExercise(null);
          }}
          editEntry={editExercise || undefined}
        />
      </ModalDrawer>

      <ModalDrawer
        isOpen={!!directFoodAdd}
        onClose={() => setDirectFoodAdd(null)}
        maxWidth="w-full max-w-[500px]"
      >
        {directFoodAdd && (
          <FoodAdd
            food={directFoodAdd.food}
            mealType={directFoodAdd.mealType}
            existingEntry={directFoodAdd.existingEntry}
            onClose={() => setDirectFoodAdd(null)}
            onDone={() => setDirectFoodAdd(null)}
          />
        )}
      </ModalDrawer>

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

      {/* Universal Exercise Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={!!exerciseToDelete}
        title="Remove exercise?"
        description={
          exerciseToDelete && (
            <>
              Are you sure you want to remove <strong>"{exerciseToDelete.activityType}"</strong> from the diary?
            </>
          )
        }
        confirmText="Remove"
        variant="destructive"
        onConfirm={handleConfirmDeleteExercise}
        onCancel={() => setExerciseToDelete(null)}
      />
    </div>
  );
}
