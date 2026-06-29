import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingDown, Scale, Flame, Target } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { calculateTDEE, calculateNetDeficit, calculateRollingAverage, getLast7Days } from '@/utils/calculations';
import InfoTooltip from '@/components/InfoTooltip';

const TIMEFRAMES = [
  { key: '1W', label: '7 Days', days: 7 },
  { key: '2W', label: '14 Days', days: 14 },
  { key: '1M', label: '30 Days', days: 30 },
];

export default function ProgressScreen() {
  const profile = useStore((state) => state.profile);
  const dailyLogs = useStore((state) => state.dailyLogs);
  const [timeframe, setTimeframe] = useState('1W');

  const days = TIMEFRAMES.find((t) => t.key === timeframe)?.days || 7;

  const chartData = (() => {
    const lastDays = getLast7Days();
    let datesToProcess = lastDays;

    if (days > 7) {
      const allDays: string[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        allDays.push(
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        );
      }
      datesToProcess = allDays;
    }

    let cumulativeFatChange = 0;
    
    const deficits = datesToProcess.map((date) => {
      const log = dailyLogs.find((l) => l.date === date);
      if (!log) {
        return { date, deficit: 0, calories: 0, weight: null, fatChange: 0, cumulativeFatChange: Math.round(cumulativeFatChange) };
      }
      const intake = log.foodEntries.reduce((a, e) => a + e.calories, 0);
      const exercise = log.exerciseEntries.reduce((a, e) => a + e.caloriesBurned, 0);
      const tdee = calculateTDEE(profile);
      const deficit = calculateNetDeficit(tdee, intake, exercise);
      
      const fatChange = deficit / 7.7;
      const newCumulative = cumulativeFatChange - fatChange;
      cumulativeFatChange = newCumulative; // Safe mutation inside useMemo loop

      return {
        date,
        deficit,
        calories: Math.round(intake),
        weight: log.weight || null,
        fatChange: Math.round(fatChange),
        cumulativeFatChange: Math.round(newCumulative),
      };
    });

    const deficitValues = deficits.map((d) => d.deficit);
    const rolling = calculateRollingAverage(deficitValues, days > 7 ? 7 : 3);

    return deficits.map((d, i) => ({
      ...d,
      label: d.date.slice(5),
      rollingAvg: rolling[i],
    }));
  })();

  const stats = useMemo(() => {
    const totalDeficit = chartData.reduce((a, d) => a + Math.max(0, d.deficit), 0);
    const avgDailyDeficit = chartData.length > 0 ? totalDeficit / chartData.length : 0;
    const projectedWeeklyLoss = (avgDailyDeficit * 7) / 7700;
    const totalExercise = dailyLogs
      .filter((l) => chartData.some((c) => c.date === l.date))
      .reduce((a, l) => a + l.exerciseEntries.reduce((b, e) => b + e.caloriesBurned, 0), 0);

    return {
      totalDeficit: Math.round(totalDeficit),
      avgDailyDeficit: Math.round(avgDailyDeficit),
      projectedLoss: Math.round(projectedWeeklyLoss * 1000) / 1000,
      totalExercise: Math.round(totalExercise),
    };
  }, [chartData, dailyLogs]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track your deficit and weight trajectory
        </p>
      </div>

      {/* Timeframe Toggle */}
      <div className="shrink-0 px-5 pb-3">
        <div className="flex bg-secondary/50 backdrop-blur-lg rounded-xl p-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.key}
              onClick={() => setTimeframe(tf.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                timeframe === tf.key
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:bg-white/5'
              }`}
            >
              {tf.key}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-10">
        {/* Deficit Chart */}
        <motion.div
          className="glass-card rounded-2xl p-4 mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Daily Deficit</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="deficitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'currentColor' }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'currentColor' }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-card p-3 rounded-xl shadow-xl text-xs">
                          <p className="font-bold mb-1 opacity-70">{label}</p>
                          {payload.map((p, i) => (
                            <p key={i} style={{ color: p.color }}>
                              {p.name}: {p.value}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="deficit"
                  stroke="hsl(var(--primary))"
                  fill="url(#deficitGrad)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="rollingAvg"
                  stroke="#FBBF24"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1 rounded-full bg-primary" />
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Daily</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1 rounded-full bg-amber-400" style={{ borderStyle: 'dashed' }} />
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Rolling Avg</span>
            </div>
          </div>
        </motion.div>

        {/* restored Calorie Intake Chart */}
        <motion.div
          className="glass-card rounded-2xl p-4 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">Calorie Intake</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'currentColor' }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'currentColor' }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-card p-3 rounded-xl shadow-xl text-xs">
                          <p className="font-bold mb-1 opacity-70">{label}</p>
                          {payload.map((p, i) => (
                            <p key={i} style={{ color: p.color }}>
                              {p.name}: {p.value}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#f97316' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Projected Weight Change Chart */}
        <motion.div
          className="glass-card rounded-2xl p-4 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">Expected weight change</span>
            <div className="ml-auto">
              <InfoTooltip 
                title="Expected weight change" 
                content="This chart shows theoretical cumulative weight change based on: 1g fat ≈ 7.7 kcal deficit. This is a mathematical model under ideal conditions." 
                align="right"
              />
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'currentColor' }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'currentColor' }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  tickFormatter={(val) => `${val > 0 ? '+' : ''}${val}g`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const val = Number(payload[0].value || 0);
                      const fatChange = Number(payload[0].payload.fatChange || 0);
                      return (
                        <div className="glass-card p-3 rounded-xl shadow-xl text-xs">
                          <p className="font-bold mb-1 opacity-70">{label}</p>
                          <p className="text-emerald-500 font-bold">
                            Total: {val > 0 ? '+' : ''}{val} g
                          </p>
                          <p className="text-muted-foreground mt-1">
                            (Per day: {fatChange > 0 ? '-' : '+'}{Math.abs(fatChange)} g)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeFatChange"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 gap-3 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground font-medium">Total Deficit</span>
            </div>
            <p className="text-xl font-bold mt-2">{stats.totalDeficit}</p>
            <span className="text-[10px] text-muted-foreground uppercase">kcal burned</span>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground font-medium">Daily Avg</span>
            </div>
            <p className="text-xl font-bold mt-2">{stats.avgDailyDeficit}</p>
            <span className="text-[10px] text-muted-foreground uppercase">kcal/day</span>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground font-medium">Weekly Loss</span>
            </div>
            <p className="text-xl font-bold mt-2">{stats.projectedLoss} kg</p>
            <span className="text-[10px] text-muted-foreground uppercase">projected</span>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-muted-foreground font-medium">Exercise Burn</span>
            </div>
            <p className="text-xl font-bold mt-2">{stats.totalExercise}</p>
            <span className="text-[10px] text-muted-foreground uppercase">kcal total</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
