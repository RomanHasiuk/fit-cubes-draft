import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { calculateTDEE, calculateNetDeficit } from '@/utils/calculations';

export function useDashboardTotals() {
  const profile = useStore((state) => state.profile);
  const dailyLogs = useStore((state) => state.dailyLogs);
  const selectedDate = useStore((state) => state.selectedDate);

  const dayLog = useMemo(
    () => dailyLogs.find((l) => l.date === selectedDate),
    [dailyLogs, selectedDate]
  );

  const totals = useMemo(() => {
    if (!dayLog) {
      return { calories: 0, protein: 0, carbs: 0, fats: 0, exercise: 0 };
    }

    const food = dayLog.foodEntries.reduce(
      (acc, e) => ({
        calories: acc.calories + e.calories,
        protein: acc.protein + e.protein,
        carbs: acc.carbs + e.carbs,
        fats: acc.fats + e.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    const exercise = dayLog.exerciseEntries.reduce(
      (acc, e) => acc + e.caloriesBurned,
      0
    );

    return { ...food, exercise };
  }, [dayLog]);

  const tdee = useMemo(() => calculateTDEE(profile), [profile]);

  const remaining = Math.round(tdee + totals.exercise - totals.calories);

  const caloriePercent = Math.min(
    100,
    Math.max(0, (totals.calories / Math.max(1, tdee + totals.exercise)) * 100)
  );

  const ringOffset = 440 - (440 * caloriePercent) / 100;

  const netDeficit = calculateNetDeficit(
    tdee,
    totals.calories,
    totals.exercise
  );

  return {
    profile,
    selectedDate,
    dayLog,
    totals,
    tdee,
    remaining,
    caloriePercent,
    ringOffset,
    netDeficit,
  };
}
