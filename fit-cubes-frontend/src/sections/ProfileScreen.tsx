import { motion, AnimatePresence } from 'framer-motion';
import { OptionSelector } from '@/components/profile/OptionSelector';
import {
  LogOut,
  Sun,
  Moon,
  Monitor,
  Dumbbell,
  TrendingDown
} from 'lucide-react';

import { useStore } from '@/store/useStore';
import { calculateBMR, calculateTDEE, generateMacroTargets, adjustMacrosForProtein, type DietType, type WeightGoal } from '@/utils/calculations';
import InfoTooltip from '@/components/InfoTooltip';
import React, { useState, useEffect } from 'react';
import { MetricInput } from '@/components/profile/MetricInput';
import { ProteinIndicator } from '@/components/profile/ProteinIndicator';

export default function ProfileScreen() {
  const profile = useStore((state) => state.profile);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const activities = useStore((state) => state.activities);
  const updateProfile = useStore((state) => state.updateProfile);
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Use a local draft for editing
  const [draft, setDraft] = useState(profile);

  // Sync draft when profile changes externally (like after Reset)
  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const updateDraft = (changes: Partial<typeof draft>) => {
    setDraft((prev) => ({ ...prev, ...changes }));
  };

  const bmr = Math.round(calculateBMR(draft));
  const tdeeBase = Math.round(calculateTDEE(draft));
  const targetCalories = Math.round(
    draft.goal === 'lose' ? tdeeBase * 0.85 : draft.goal === 'gain' ? tdeeBase * 1.15 : tdeeBase
  );

  // Sync macros when goal/diet changes
  const applyPreset = React.useCallback(
    (currentDiet: DietType, currentGoal: WeightGoal) => {
      const macros = generateMacroTargets(targetCalories, currentDiet, draft.weightKg || 0, currentGoal);
      updateDraft({
        macroTargets: macros,
        goal: currentGoal,
        diet: currentDiet,
      });
    },
    [targetCalories, draft.weightKg]
  );

  const handleManualProteinChange = (newProtein: number) => {
    const macros = adjustMacrosForProtein(targetCalories, newProtein, draft.diet as DietType);
    updateDraft({ macroTargets: macros });
  };

  useEffect(() => {
    applyPreset(draft.diet as DietType, draft.goal as WeightGoal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.goal, draft.diet, tdeeBase]);

  const hasChanges = JSON.stringify(profile) !== JSON.stringify(draft);



  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 px-5 pt-6 pb-2 flex items-start justify-between">
        <div className="flex-1 mr-4">
          <input
            type="text"
            value={draft.name || ''}
            onChange={(e) => updateDraft({ name: e.target.value })}
            placeholder="Your Name"
            className="bg-transparent text-2xl font-bold outline-none placeholder:text-muted-foreground/50 w-full"
          />
          <p className="text-sm text-muted-foreground mt-0.5">
            Your body metrics and goals
          </p>
        </div>

        {/* Compact Theme Switcher */}
        <div className="flex bg-secondary/30 p-1 rounded-xl border border-white/5 backdrop-blur-md">
          {[
            { key: 'light', icon: Sun, label: 'Light Mode' },
            { key: 'dark', icon: Moon, label: 'Dark Mode' },
            { key: 'system', icon: Monitor, label: 'System Default' },
          ].map((t) => (
            <button
              key={t.key}
              title={t.label}
              onClick={() => setTheme(t.key as any)}
              className={`p-2 rounded-lg transition-all ${
                theme === t.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-8">
        {/* BMR/TDEE Card */}
        <motion.div
          className="glass-card rounded-2xl p-5 mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown
              className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Energy expenditure</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/30 rounded-xl p-3 text-center relative border border-white/5">
              <div className="absolute top-1 right-1">
                <InfoTooltip
                  title="BMR (Basal Metabolic Rate)"
                  content="This is the energy your body uses at rest. BMR decreases with age due to muscle loss."
                  align="left"
                />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-tighter">BMR</p>
              <p className="text-xl font-bold mt-1">{bmr}</p>
              <p className="text-[10px] text-muted-foreground uppercase">kcal/day</p>
            </div>
            <div className="bg-primary/10 rounded-xl p-3 text-center relative border border-primary/20">
              <div className="absolute top-1 right-1">
                <InfoTooltip
                  title="Target Calories"
                  content="Your current calorie target accounting for deficit or surplus."
                  align="right"
                />
              </div>
              <p className="text-xs text-primary uppercase tracking-tighter">Target</p>
              <p className="text-xl font-bold mt-1 text-primary">{targetCalories}</p>
              <p className="text-[10px] text-primary/60 uppercase font-medium">kcal/day</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <OptionSelector
              label="Goal"
              selectedValue={draft.goal || ''}
              onSelect={(val) => updateDraft({ goal: val as WeightGoal })}
              options={[
                { id: 'lose', label: 'Loss', tip: 'Deficit: ~15% daily' },
                { id: 'maintain', label: 'Maintain', tip: 'Base level: no changes' },
                { id: 'gain', label: 'Gain', tip: 'Surplus: ~15% daily. Requires adequate protein intake' }
              ]}
            />

            <OptionSelector
              label="Strategy"
              selectedValue={draft.diet || ''}
              onSelect={(val) => updateDraft({ diet: val as DietType })}
              options={[
                { id: 'balanced', label: 'Balanced', tip: 'Optimal macronutrient ratio' },
                { id: 'low-carb', label: 'Low-carb', tip: 'Reduced carbs in favor of protein and fats' },
                { id: 'keto', label: 'Keto', tip: 'Minimum carbs, maximum fats' }
              ]}
            />
          </div>
        </motion.div>

        {/* Body Metrics Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1 mb-3">
            Body Metrics
          </h3>
          <div className="glass-card rounded-2xl p-4 space-y-4">
            <div className="flex gap-3">
              <MetricInput
                label="Age"
                value={draft.age || ''}
                onChange={(val) => updateDraft({ age: val })}
                tooltipTitle="Age"
                tooltipContent="Metabolism slows down with age, reducing calorie needs."
                align="left"
              />
              <MetricInput
                label="Weight (kg)"
                value={draft.weightKg || ''}
                onChange={(val) => updateDraft({ weightKg: val })}
                tooltipTitle="Weight"
                tooltipContent="More weight requires more energy to sustain."
                step="0.1"
                align="center"
              />
              <MetricInput
                label="Height (cm)"
                value={draft.heightCm || ''}
                onChange={(val) => updateDraft({ heightCm: val })}
                tooltipTitle="Height"
                tooltipContent="Height affects metabolic rate."
                align="right"
              />
            </div>

            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center justify-between mb-2 px-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Activity</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">{draft.activityFactor}</span>
                  <InfoTooltip title="Activity" content="Multiplier from 1.2 (sedentary) to 1.9 (daily heavy lifting). Greatly impacts target calories." align="right" />
                </div>
              </div>
              <input
                type="range"
                min="1.2"
                max="1.9"
                step="0.05"
                value={draft.activityFactor}
                onChange={(e) => updateDraft({ activityFactor: parseFloat(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1">
                <span>Sedentary</span>
                <span>Very active</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Manual Macros */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between px-1 mb-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Manual Protein Adjustment
            </h3>
            <InfoTooltip
              title="Balance"
              content="Enter your desired protein amount, and we will automatically adjust fats and carbs to match your current target and strategy."
              align="right"
            />
          </div>
          <div className="glass-card rounded-2xl p-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Protein', key: 'protein', color: 'text-emerald-400' },
              { label: 'Carbs', key: 'carbs', color: 'text-blue-400' },
              { label: 'Fats', key: 'fats', color: 'text-amber-400' },
            ].map((m) => (
              <div key={m.key}>
                <label className={`text-[10px] font-bold ${m.color} uppercase mb-1 block text-center`}>{m.label}</label>
                <input
                  type="number"
                  value={
                    m.key === 'protein'
                      ? draft.macroTargets?.protein || ''
                      : draft.macroTargets?.[m.key as keyof typeof draft.macroTargets] ?? 0
                  }
                  readOnly={m.key !== 'protein'}
                  onKeyDown={(e) => {
                    if (m.key === 'protein') {
                      if (['-', 'e', 'E', '+', '.', ','].includes(e.key)) {
                        e.preventDefault();
                      }
                    }
                  }}
                  onChange={(e) => {
                    if (m.key === 'protein') {
                      let newProtein = Math.max(0, parseInt(e.target.value) || 0);
                      const maxProtein = Math.round((draft.weightKg || 0) * 2.5);
                      if (newProtein > maxProtein) newProtein = maxProtein;
                      handleManualProteinChange(newProtein);
                    }
                  }}
                  className={`w-full h-10 ${m.key !== 'protein' ? 'bg-secondary/20 opacity-70 cursor-not-allowed' : 'bg-secondary/50'} border border-white/5 rounded-lg text-center text-sm font-bold outline-none`}
                />
              </div>
            ))}
          </div>

          {/* Protein Info/Warning */}
          <ProteinIndicator
            protein={draft.macroTargets?.protein || 0}
            weight={draft.weightKg || 0}
          />
        </motion.div>

        {/* Exercise Constants Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between px-1 mb-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Exercise Metrics
            </h3>
            <InfoTooltip
              title="What is MET?"
              content="1 MET is resting energy. More intense exercise means higher MET and more calories burned."
              align="right"
            />
          </div>
          <div className="glass-card rounded-2xl divide-y divide-white/5 overflow-hidden">
            {activities.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {parseFloat(item.kcalPerUnit.toFixed(2))} kcal / {item.metricLabel}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">
                    MET {item.met}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Logout Placeholder */}
        <div className="mt-8 mb-4">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-4 text-destructive font-bold glass-card rounded-2xl hover:bg-destructive/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Reset App Data
          </button>
        </div>
      </div>

      {/* Floating Save Bar */}
      <AnimatePresence>
        {hasChanges && (
          <div className="fixed bottom-[90px] left-0 right-0 z-40 flex justify-center pointer-events-none px-5">
            <motion.div
              className="w-full max-w-[calc(430px-2.5rem)] glass-card rounded-2xl p-4 flex items-center justify-between shadow-2xl border border-primary/20 bg-background/80 backdrop-blur-xl pointer-events-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold">Unsaved changes</span>
                <span className="text-xs text-muted-foreground">Don't forget to save!</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setDraft(profile)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateProfile(draft)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card w-full max-w-[calc(430px-2.5rem)] rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col relative"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-destructive/20 flex items-center justify-center mb-6 mx-auto">
                <LogOut className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Reset App Data?</h3>
              <p className="text-sm text-center text-muted-foreground mb-8">
                This action cannot be undone. All your logs, custom foods, and settings will be permanently deleted.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3.5 rounded-xl font-bold bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('fitcubes-storage');
                    window.location.reload();
                  }}
                  className="flex-1 py-3.5 rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg shadow-destructive/20"
                >
                  Yes, Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
