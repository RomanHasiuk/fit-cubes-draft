import { useStore } from "@/store/useStore";
import { formatLargeNumber } from "@/utils/calculations"
import { motion } from "framer-motion"
import { Beef, Droplets, WheatIcon } from "lucide-react"
import { useMemo } from "react";

export const MacroBars: React.FC = () => {
    const dailyLogs = useStore((state) => state.dailyLogs);
    const selectedDate = useStore((state) => state.selectedDate);
    const profile = useStore((state) => state.profile);
      const macroTargets = profile.macroTargets;
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
        const proteinPct = Math.min(100, (totals.protein / (macroTargets.protein || 1)) * 100 || 0);
  const carbsPct = Math.min(100, (totals.carbs / (macroTargets.carbs || 1)) * 100 || 0);
  const fatsPct = Math.min(100, (totals.fats / (macroTargets.fats || 1)) * 100 || 0);
    return (
                <motion.div
          className="mt-6 space-y-3  mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Beef className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Protein</span>
            </div>
            <span className="text-sm font-medium">
              {formatLargeNumber(totals.protein)}g / {formatLargeNumber(macroTargets.protein)}g
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${proteinPct}%` }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <WheatIcon className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">Carbs</span>
            </div>
            <span className="text-sm font-medium">
              {formatLargeNumber(totals.carbs)}g / {formatLargeNumber(macroTargets.carbs)}g
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${carbsPct}%` }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium">Fats</span>
            </div>
            <span className="text-sm font-medium">
              {formatLargeNumber(totals.fats)}g / {formatLargeNumber(macroTargets.fats)}g
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orange-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${fatsPct}%` }}
              transition={{ duration: 0.6, delay: 0.5 }}
            />
          </div>
        </motion.div>
    )
}