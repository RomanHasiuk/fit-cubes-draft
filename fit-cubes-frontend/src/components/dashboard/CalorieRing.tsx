import { useStore } from "@/store/useStore";
import { calculateTDEE, formatLargeNumber } from "@/utils/calculations"
import { motion } from "framer-motion"
import { useMemo } from "react";

export const CalorieRing: React.FC = () => {
          const profile = useStore((state) => state.profile);
          const dailyLogs = useStore((state) => state.dailyLogs);
            const selectedDate = useStore((state) => state.selectedDate);
      const dayLog = useMemo(
    () => dailyLogs.find((l) => l.date === selectedDate),
    [dailyLogs, selectedDate]
  );
      const totals = useMemo(() => {
    if (!dayLog) return { calories: 0, protein: 0, carbs: 0, fats: 0, exercise: 0 };
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
    Math.max(0, (totals.calories / (tdee + totals.exercise)) * 100)
  );
      const ringOffset = 440 - (440 * caloriePercent) / 100;
    return (
      <motion.div
          className="flex flex-col items-center mt-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-[288px] h-[288px] md:w-[314px] md:h-[314px]">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                className="text-border/80"
                strokeWidth="10"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                className="text-primary"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="440"
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: ringOffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl text-foreground">
                {formatLargeNumber(remaining > 0 ? remaining : 0)}
              </span>
              <span className="text-xs text-muted-foreground mt-1 text-center">Remaining</span>
              <span className="text-sm text-primary font-medium mt-1">
                of {formatLargeNumber(tdee + totals.exercise)} kcal
              </span>
            </div>
          </div>
        </motion.div>
    )
}