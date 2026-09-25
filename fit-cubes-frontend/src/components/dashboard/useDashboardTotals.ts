import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { calculateTDEE, calculateTargetCalories, calculateNetDeficit } from '@/utils/calculations';

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
  const targetCalories = useMemo(
    () => calculateTargetCalories(tdee, profile.goal),
    [tdee, profile.goal]
  );

  const totalBudget = targetCalories + totals.exercise;
  const remaining = Math.round(totalBudget - totals.calories);
  const isOverLimit = remaining < 0;
  const surplus = isOverLimit ? Math.abs(remaining) : 0;

  // Gold ring percentage (0% to 100%)
  const caloriePercent = Math.min(
    100,
    Math.max(0, (totals.calories / Math.max(1, totalBudget)) * 100)
  );
  const ringOffset = 440 - (440 * caloriePercent) / 100;

  // Red surplus ring percentage (0% to 100% of budget)
  const surplusPercent = isOverLimit
    ? Math.min(100, (surplus / Math.max(1, totalBudget)) * 100)
    : 0;
  const surplusRingOffset = 440 - (440 * surplusPercent) / 100;

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
    targetCalories,
    totalBudget,
    remaining,
    isOverLimit,
    surplus,
    surplusPercent,
    surplusRingOffset,
    caloriePercent,
    ringOffset,
    netDeficit,
  };
}
