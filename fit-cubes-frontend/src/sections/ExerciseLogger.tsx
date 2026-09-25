import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Dumbbell,
  Footprints,
  Timer,
  Flame,
  Loader2,
  ChevronRight,
  AlertTriangle,
  WifiOff,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { calculateExerciseCalories, generateSafeId } from '@/utils/calculations';
import type { ExerciseEntry } from '@/types';
import InfoTooltip from '@/components/InfoTooltip';
import FoodItemCardSkeleton from '@/components/food/FoodItemCardSkeleton';
import { blockInvalidIntegerInput, blockInvalidNumberInput } from '@/utils/inputHandlers';
import { authService } from '@/services/authService';
import { diaryService } from '@/services/diaryService';
import { exerciseService } from '@/services/exerciseService';
import { Button } from '@/components/ui/button';

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
  const activitiesError = useStore((state) => state.activitiesError);
  const setActivities = useStore((state) => state.setActivities);
  const setActivitiesError = useStore((state) => state.setActivitiesError);
  const isLoadingData = useStore((state) => state.isLoadingData);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(editEntry?.activityType || null);
  const [metric, setMetric] = useState(editEntry ? String(editEntry.metric) : '');
  const [rpe, setRpe] = useState<number>(editEntry?.rpe || 5);
  const [isSaving, setIsSaving] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetryActivities = async () => {
    setIsRetrying(true);
    try {
      const res = await exerciseService.getActivities({ size: 100 });
      if (res.ok && res.data) {
        const rawData = res.data as unknown;
        const items = Array.isArray(rawData)
          ? rawData
          : typeof rawData === 'object' && rawData !== null && 'content' in rawData && Array.isArray((rawData as { content: unknown }).content)
          ? ((rawData as { content: any[] }).content)
          : [];

        if (items.length > 0) {
          const loaded = items.map((act) => ({
            id: act.id,
            name: act.name,
            metricLabel: 'minutes',
            met: act.met,
            kcalPerUnit: Math.round(((act.met * 3.5 * 70) / 200) * 10) / 10,
          }));
          setActivities(loaded);
          setActivitiesError(null);
        } else {
          setActivitiesError('EMPTY_DATABASE');
        }
      } else {
        const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
        setActivitiesError(isOffline ? 'NO_INTERNET' : 'SERVER_ERROR');
      }
    } catch {
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
      setActivitiesError(isOffline ? 'NO_INTERNET' : 'SERVER_ERROR');
    } finally {
      setIsRetrying(false);
    }
  };

  const profile = useStore((state) => state.profile);
  const activity = activities.find((a) => a.name === selectedActivity);
  const calories = activity
    ? calculateExerciseCalories(activity, parseFloat(metric) || 0, profile.weightKg, rpe)
    : 0;

  const handleMetricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const isMinutes = activity?.metricLabel?.toLowerCase().includes('min');

    if (isMinutes) {
      let clean = raw.replace(/,/g, '.').replace(/[^0-9.]/g, '');
      const parts = clean.split('.');
      if (parts.length > 2) {
        clean = parts[0] + '.' + parts.slice(1).join('');
      }
      if (parts[1]?.length > 1) {
        clean = parts[0] + '.' + parts[1].slice(0, 1);
      }
      if (clean.length > 1 && clean.startsWith('0') && clean[1] !== '.') {
        clean = clean.replace(/^0+/, '');
      }
      if (parseFloat(clean) > 1440) clean = '1440';
      setMetric(clean);
    } else {
      let clean = raw.replace(/\D/g, '').replace(/^0+/, '');
      const num = Number(clean);
      if (activity?.metricLabel === 'reps' && num > 10000) clean = '10000';
      else if (activity?.metricLabel === 'steps' && num > 100000) clean = '100000';
      else if (num > 100000) clean = '100000';
      setMetric(clean);
    }
  };

  const handleSave = async () => {
    if (!activity || !metric || parseFloat(metric) <= 0 || isSaving) return;

    setIsSaving(true);

    const metricValue = parseFloat(metric);

    // Determine intensity based on MET value
    const intensityValue: 'low' | 'medium' | 'high' =
      activity.met < 4 ? 'low' : activity.met < 8 ? 'medium' : 'high';

    const entry: ExerciseEntry = {
      id: editEntry ? editEntry.id : generateSafeId('ex'),
      activityType: activity.name,
      metric: metricValue,
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

    if (authService.isAuthenticated()) {
      const exerciseId = activity.id || 1;
      const isMinutes = activity.metricLabel.toLowerCase().includes('min');
      let durationMinutes = Math.max(1, Math.round(metricValue));

      if (!isMinutes) {
        if (activity.metricLabel.toLowerCase().includes('rep')) {
          durationMinutes = Math.max(1, Math.round(metricValue / 10));
        } else if (activity.metricLabel.toLowerCase().includes('step')) {
          durationMinutes = Math.max(1, Math.round(metricValue / 100));
        }
      }

      const now = new Date();
      const isToday = selectedDate === now.toISOString().split('T')[0];
      const loggedAt = isToday
        ? new Date(Date.now() - 60000).toISOString()
        : `${selectedDate}T12:00:00.000Z`;

      const isExistingBackendEntry =
        editEntry && !editEntry.id.startsWith('ex_') && /^\d+$/.test(editEntry.id);

      try {
        if (isExistingBackendEntry) {
          await diaryService.removeExerciseEntry(selectedDate, editEntry.id);
        }

        const res = await diaryService.addExerciseEntry(selectedDate, {
          exerciseId,
          durationMinutes,
          loggedAt,
        });

        if (res.ok && res.data) {
          updateExerciseEntry(selectedDate, entry.id, {
            ...entry,
            id: String(res.data.id),
          });
        }
      } catch (err) {
        console.error('Failed to sync exercise entry to backend:', err);
      }
    }

    setIsSaving(false);
    onClose();
  };

  const handleBack = () => {
    if (selectedActivity && !editEntry) {
      setSelectedActivity(null);
      setMetric('');
      setRpe(5);
    } else {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0F1114]">
      {/* Header */}
      <div className="shrink-0 px-3 sm:px-4 pt-safe pb-2.5 flex items-center justify-between border-b border-[#32363E]/60">
        <button
          type="button"
          onClick={handleBack}
          className="flex h-[32px] w-[32px] sm:h-[36px] sm:w-[36px] cursor-pointer touch-manipulation items-center justify-center rounded-full border border-white/10 bg-[#16191E]/80 backdrop-blur-sm transition-all hover:border-white/20 active:scale-95"
          title="Back"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-foreground/80" />
        </button>

        <h2 className="heading-h2 text-[17px] sm:text-[18px] md:text-[20px] text-foreground text-center truncate max-w-[180px] sm:max-w-none">
          {selectedActivity ? activity?.name : 'Exercise'}
        </h2>

        {selectedActivity ? (
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !metric || parseFloat(metric) <= 0}
            className="h-[30px] sm:h-[34px] px-2.5 sm:px-3 text-[12px] sm:text-[13px]"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Save
          </Button>
        ) : (
          <div className="h-[32px] w-[32px] sm:h-[36px] sm:w-[36px] opacity-0 pointer-events-none" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 sm:px-5 py-3 sm:py-4" data-scrolling="true">
        {!selectedActivity ? (
          <div className="space-y-2">
            {isLoadingData && activities.length === 0 ? (
              <FoodItemCardSkeleton variant="exercise" count={6} />
            ) : activities.length === 0 || activitiesError ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 mb-3.5">
                  {activitiesError === 'NO_INTERNET' || (typeof navigator !== 'undefined' && !navigator.onLine) ? (
                    <WifiOff className="h-6 w-6" />
                  ) : (
                    <AlertTriangle className="h-6 w-6" />
                  )}
                </div>

                <h3 className="font-sans text-[16px] sm:text-[18px] font-semibold text-foreground mb-1.5">
                  {activitiesError === 'NO_INTERNET' || (typeof navigator !== 'undefined' && !navigator.onLine)
                    ? 'No Internet Connection'
                    : 'Exercise Service Unavailable'}
                </h3>

                <p className="font-sans text-[13px] sm:text-[14px] text-[#8E8F96] max-w-sm mb-5 leading-relaxed">
                  {activitiesError === 'NO_INTERNET' || (typeof navigator !== 'undefined' && !navigator.onLine)
                    ? 'You appear to be offline. Please check your network connection and try again.'
                    : 'Unable to connect to the exercise database (Server Error 500). The service is temporarily undergoing maintenance. Please try again later.'}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetryActivities}
                  disabled={isRetrying}
                  className="border-[#32363E] text-foreground hover:bg-white/5 cursor-pointer h-9 px-4 text-[13px]"
                >
                  {isRetrying ? (
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 mr-2" />
                  )}
                  Retry Connection
                </Button>
              </div>
            ) : (
              activities.map((act) => {
                const Icon = ICONS[act.name] || Dumbbell;
                const estimatedKcal =
                  Math.round(
                    (act.kcalPerUnit > 0
                      ? act.kcalPerUnit
                      : (act.met * 3.5 * (profile.weightKg || 70)) / 200) * 10
                  ) / 10;

                return (
                  <motion.button
                    key={act.name}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => setSelectedActivity(act.name)}
                    className="w-full flex items-center justify-between p-3 rounded-[5px] border border-[#32363E] bg-[#16181D]/60 hover:border-[#F59F0A]/50 backdrop-blur-sm text-left transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-[#4F3911] bg-[#251F13] text-[#F59F0A]">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <p className="font-sans text-[15px] sm:text-[16px] font-medium text-foreground leading-snug">
                          {act.name}
                        </p>
                        <p className="font-sans text-[12px] sm:text-[13px] text-[#8E8F96] mt-0.5">
                          {estimatedKcal} kcal/{act.metricLabel} • MET {act.met}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 text-[#8E8F96]" />
                  </motion.button>
                );
              })
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Metric Input Card */}
            <div className="flex flex-col gap-1.5 rounded-[5px] border border-[#32363E] bg-[#16181D]/60 p-3 sm:p-4 backdrop-blur-sm">
              <label className="form-label text-[15px] sm:text-[16px]">
                {activity?.metricLabel === 'reps'
                  ? 'Number of Repetitions'
                  : activity?.metricLabel === 'minutes'
                    ? 'Duration in Minutes'
                    : activity?.metricLabel === 'steps'
                      ? 'Total Step Count'
                      : 'Amount'}
              </label>

              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  onKeyDown={
                    activity?.metricLabel?.toLowerCase().includes('min')
                      ? blockInvalidNumberInput
                      : blockInvalidIntegerInput
                  }
                  value={metric}
                  onChange={handleMetricChange}
                  placeholder="0"
                  autoFocus
                  className="w-full h-11 sm:h-12 rounded-[5px] border border-[#32363E] bg-[#16181D]/90 px-14 text-center font-serif text-[22px] sm:text-[24px] font-bold text-[#F59F0A] outline-none transition-colors focus:border-[#F59F0A]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-sans text-[12px] sm:text-[13px] font-medium text-[#8E8F96] pointer-events-none">
                  {activity?.metricLabel}
                </span>
              </div>
            </div>

            {/* RPE Selector */}
            <div className="flex flex-col gap-2 rounded-[5px] border border-[#32363E] bg-[#16181D]/60 p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <label className="form-label text-[15px] sm:text-[16px]">
                  Perceived Exertion (RPE 1-10)
                </label>
                <InfoTooltip
                  title="RPE (Rate of Perceived Exertion)"
                  content="Scale from 1 (sedentary resting) to 10 (maximum physical capacity). Slightly scales calorie burn based on intensity (+/- 20%)."
                  align="right"
                  position="bottom"
                />
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-0.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setRpe(v)}
                    className={`flex h-8 sm:h-9 cursor-pointer items-center justify-center rounded-[5px] font-sans text-[12px] sm:text-[13px] font-medium transition-all active:scale-95 ${
                      rpe === v
                        ? 'border-2 border-[#F59F0A] bg-[#251F13] font-bold text-[#F59F0A] shadow-[0_0_8px_rgba(245,159,10,0.3)]'
                        : 'border border-[#32363E] bg-[#16181D]/80 text-[#8E8F96] hover:border-white/20 hover:text-foreground'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <p className="mt-0.5 text-center font-sans text-[11px] sm:text-[12px] text-[#8E8F96]">
                {rpe <= 3
                  ? 'Light — Easy aerobic recovery'
                  : rpe <= 6
                    ? 'Moderate — Active steady working effort'
                    : 'Intense — High heart rate and effort'}
              </p>
            </div>

            {/* Calories Preview Banner */}
            {calories > 0 && (
              <motion.div
                className="flex flex-col items-center justify-center rounded-[10px] border border-[#4F3911] bg-[#251F13]/80 p-3 sm:p-4 shadow-md backdrop-blur-md"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="font-sans text-[11px] sm:text-[12px] font-medium text-[#8E8F96]">
                  Estimated Energy Expenditure
                </span>
                <span className="mt-0.5 font-serif text-[24px] sm:text-[30px] font-medium leading-none text-[#F59F0A]">
                  +{Math.round(calories * 10) / 10} kcal
                </span>
              </motion.div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-col gap-1.5 pt-1">
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !metric || parseFloat(metric) <= 0}
                className="w-full h-10 sm:h-11 text-[14px] sm:text-[15px]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Log Activity
              </Button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full py-1.5 text-center font-sans text-[12px] text-[#8E8F96] hover:text-foreground transition-colors cursor-pointer"
              >
                Choose a different exercise
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
