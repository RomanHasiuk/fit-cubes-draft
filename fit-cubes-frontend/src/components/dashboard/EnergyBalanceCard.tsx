import { useStore } from "@/store/useStore";
import { calculateNetDeficit, calculateTDEE, formatLargeNumber } from "@/utils/calculations"
import { motion } from "framer-motion"
import { Flame, Footprints, TrendingDown } from "lucide-react"
import { useMemo } from "react";

export const EnergyBalanceCard: React.FC = () => {
    const profile = useStore((state) => state.profile);
    const dailyLogs = useStore((state) => state.dailyLogs);
    const selectedDate = useStore((state) => state.selectedDate);
    const tdee = useMemo(() => calculateTDEE(profile), [profile]);
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
    const netDeficit = calculateNetDeficit(tdee, totals.calories, totals.exercise);
    return (
<motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 mx-4 z-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        > <div className="glass-card rounded-2xl p-4 col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Energy Balance</span>
          </div>
          <p
            className={`text-2xl font-bold mt-1 ${netDeficit > 0 ? 'text-primary' : netDeficit < 0 ? 'text-destructive' : 'text-muted-foreground'}`}
          >
            {netDeficit > 0 ? `-${formatLargeNumber(netDeficit)} kcal` : netDeficit < 0 ? `+${formatLargeNumber(Math.abs(netDeficit))} kcal` : '0 kcal'}
          </p>
          <span className="text-sm font-medium mt-2 block">
            {netDeficit > 50
              ? `Expected fat loss: ~${formatLargeNumber(netDeficit / 7.7)} g 📉`
              : netDeficit < -50
              ? `Expected fat gain: ~${formatLargeNumber(Math.abs(netDeficit / 7.7))} g 📈`
              : 'Maintaining current weight ⚖️'}
          </span>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-muted-foreground font-medium">Eaten</span>
            </div>
            <p className="text-xl font-bold mt-1">{formatLargeNumber(totals.calories)}</p>
            <span className="text-xs text-muted-foreground">kcal</span>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground font-medium">Burned</span>
            </div>
            <p className="text-xl font-bold mt-1">{formatLargeNumber(totals.exercise)}</p>
            <span className="text-xs text-muted-foreground">kcal</span>
          </div>
        </motion.div>
    )
}