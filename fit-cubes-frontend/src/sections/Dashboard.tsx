import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Footprints, TrendingDown, Beef, Wheat as WheatIcon, Droplets } from 'lucide-react';
import { useStore } from '@/store/useStore.ts';
import { calculateTDEE, calculateNetDeficit, getRelativeDateLabel, formatLargeNumber } from '@/utils/calculations.ts';

export default function Dashboard() {
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

  const remaining = Math.round(tdee + totals.exercise - totals.calories);
  const caloriePercent = Math.min(
    100,
    Math.max(0, (totals.calories / (tdee + totals.exercise)) * 100)
  );
  const ringOffset = 440 - (440 * caloriePercent) / 100;

  const netDeficit = calculateNetDeficit(tdee, totals.calories, totals.exercise);

  const macroTargets = profile.macroTargets;
  const proteinPct = Math.min(100, (totals.protein / (macroTargets.protein || 1)) * 100 || 0);
  const carbsPct = Math.min(100, (totals.carbs / (macroTargets.carbs || 1)) * 100 || 0);
  const fatsPct = Math.min(100, (totals.fats / (macroTargets.fats || 1)) * 100 || 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 px-5 pt-6 pb-2">
        <p className="text-sm text-muted-foreground">{getRelativeDateLabel(selectedDate)}</p>
        <h1 className="text-2xl font-bold mt-0.5">
          {getTimeOfDay()}, {profile.name}
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6">
        {/* Calorie Ring */}
        <motion.div
          className="flex flex-col items-center mt-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-56 h-56">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                className="text-border/20"
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
              <span className="text-4xl font-bold text-foreground">
                {formatLargeNumber(remaining > 0 ? remaining : 0)}
              </span>
              <span className="text-xs text-muted-foreground mt-1 text-center">Remaining</span>
              <span className="text-sm text-primary font-medium mt-1">
                of {formatLargeNumber(tdee + totals.exercise)} kcal
              </span>
            </div>
          </div>
        </motion.div>

        {/* Macros */}
        <motion.div
          className="mt-6 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Beef className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground font-medium">Protein</span>
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
              <span className="text-sm text-muted-foreground font-medium">Carbs</span>
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
              <span className="text-sm text-muted-foreground font-medium">Fats</span>
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

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 gap-3 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
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

        {/* Deficit Card */}
        <motion.div
          className="mt-4 glass-card rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
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
        </motion.div>
      </div>
    </div>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
