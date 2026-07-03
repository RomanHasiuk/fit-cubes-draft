import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, Dumbbell, Footprints, Timer, Flame } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { calculateExerciseCalories } from '@/utils/calculations';
import type { ExerciseEntry } from '@/types';
import InfoTooltip from '@/components/InfoTooltip';

interface ExerciseLoggerProps {
  onClose: () => void;
  editEntry?: ExerciseEntry;
}

const ICONS: Record<string, typeof Dumbbell> = {
  'Push-ups': Dumbbell,
  'Squats': Dumbbell,
  'Jumping Jacks': Flame,
  'Plank': Timer,
  'Steps': Footprints,
  'Housework': Flame,
};

export default function ExerciseLogger({ onClose, editEntry }: ExerciseLoggerProps) {
  const selectedDate = useStore((state) => state.selectedDate);
  const addExerciseEntry = useStore((state) => state.addExerciseEntry);
  const updateExerciseEntry = useStore((state) => state.updateExerciseEntry);
  const activities = useStore((state) => state.activities);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(editEntry?.activityType || null);
  const [metric, setMetric] = useState(editEntry ? String(editEntry.metric) : '');
  const [rpe, setRpe] = useState<number>(editEntry?.rpe || 5);

  const profile = useStore((state) => state.profile);
  const activity = activities.find((a) => a.name === selectedActivity);
  const calories = activity
    ? calculateExerciseCalories(activity, parseFloat(metric) || 0, profile.weightKg, rpe)
    : 0;

  const handleSave = () => {
    if (!activity || !metric || parseFloat(metric) <= 0) return;

    // Determine intensity based on MET value
    const intensityValue: 'low' | 'medium' | 'high' =
      activity.met < 4 ? 'low' : activity.met < 8 ? 'medium' : 'high';

    const entry: ExerciseEntry = {
      id: editEntry ? editEntry.id : `ex_${Date.now()}_${crypto.randomUUID().slice(0, 5)}`,
      activityType: activity.name,
      metric: parseFloat(metric),
      metricLabel: activity.metricLabel,
      caloriesBurned: Math.round(calories * 100) / 100,
      met: activity.met,
      intensity: intensityValue,
      rpe,
      timestamp: editEntry ? editEntry.timestamp : Date.now(),
    };

    if (editEntry) {
      updateExerciseEntry(selectedDate, editEntry.id, entry);
    } else {
      addExerciseEntry(selectedDate, entry);
    }
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-2 flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-2 rounded-lg active:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        {selectedActivity && (
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary rounded-xl text-primary-foreground text-sm font-medium active:scale-95 transition-transform"
          >
            <Check className="w-4 h-4" />
            Save
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
        {!selectedActivity ? (
          <>
            <h2 className="text-xl font-bold mb-4">Log Exercise</h2>
            <div className="space-y-2">
              {activities.map((act, idx) => {
                const Icon = ICONS[act.name] || Dumbbell;
                return (
                  <motion.button
                    key={act.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedActivity(act.name)}
                    className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border text-left active:bg-secondary/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{act.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {act.kcalPerUnit} kcal/{act.metricLabel} · MET {act.met}
                      </p>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-muted-foreground -rotate-180" />
                  </motion.button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Selected Activity Detail */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                {(() => {
                  const Icon = ICONS[activity?.name || ''] || Dumbbell;
                  return <Icon className="w-6 h-6 text-primary" />;
                })()}
              </div>
              <div>
                <h2 className="text-xl font-bold">{activity?.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {activity?.kcalPerUnit} kcal per {activity?.metricLabel} · MET{' '}
                  {activity?.met}
                </p>
              </div>
            </div>

            {/* Metric Input */}
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block">
                {activity?.metricLabel === 'reps'
                  ? 'Number of Reps'
                  : activity?.metricLabel === 'minutes'
                    ? 'Duration (minutes)'
                    : activity?.metricLabel === 'steps'
                      ? 'Number of Steps'
                      : 'Amount'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                  placeholder="0"
                  autoFocus
                  className="w-full h-16 bg-card border border-border rounded-xl text-3xl font-bold text-center text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                  {activity?.metricLabel}
                </span>
              </div>

              {/* Quick select */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {activity?.metricLabel === 'reps'
                  ? [10, 20, 30, 50, 60].map((v) => (
                      <button
                        key={v}
                        onClick={() => setMetric(String(v))}
                        className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                          metric === String(v)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {v}
                      </button>
                    ))
                  : activity?.metricLabel === 'minutes'
                    ? [1, 2, 5, 10, 15].map((v) => (
                        <button
                          key={v}
                          onClick={() => setMetric(String(v))}
                          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                            metric === String(v)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          {v} min
                        </button>
                      ))
                    : null}
              </div>
            </div>

            {/* RPE Selector */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium">
                  Rate of Perceived Exertion (RPE)
                </label>
                <InfoTooltip 
                  title="RPE (1-10)" 
                  content="How hard you feel your body working. 1 is very easy (like watching TV), 10 is max effort. Higher RPE slightly increases calorie burn (+/- 20%)." 
                  align="left" 
                />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                  <button
                    key={v}
                    onClick={() => setRpe(v)}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-colors ${
                      rpe === v
                        ? 'bg-primary text-primary-foreground'
                        : v <= 3
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : v <= 6
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-red-500/15 text-red-400'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {rpe
                  ? rpe <= 3
                    ? 'Light — Easy recovery'
                    : rpe <= 6
                      ? 'Moderate — Working effort'
                      : 'Hard — High intensity'
                  : 'Tap a number to rate difficulty'}
              </p>
            </div>

            {/* Calories Preview */}
            {calories > 0 && (
              <motion.div
                className="mt-6 bg-primary/10 rounded-xl p-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm text-muted-foreground">Calories Burned</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  +{Math.round(calories * 10) / 10}
                </p>
              </motion.div>
            )}

            {/* Back to list */}
            <button
              onClick={() => {
                setSelectedActivity(null);
                setMetric('');
                setRpe(5);
              }}
              className="w-full mt-6 py-3 text-sm text-muted-foreground text-center"
            >
              Choose different exercise
            </button>
          </>
        )}
      </div>
    </div>
  );
}
