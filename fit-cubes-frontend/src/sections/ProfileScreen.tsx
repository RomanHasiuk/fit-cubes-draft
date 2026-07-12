import { motion } from 'framer-motion';
import { OptionSelector } from '@/components/profile/OptionSelector.tsx';
import {
  LogOut,
  Sun,
  Moon,
  Monitor,
  Dumbbell,
  TrendingDown
} from 'lucide-react';

import { useStore } from '@/store/useStore.ts';
import { calculateBMR, calculateTDEE, generateMacroTargets, adjustMacrosForProtein, type DietType, type WeightGoal } from '@/utils/calculations.ts';
import InfoTooltip from '@/components/InfoTooltip.tsx';
import React, { useState, useEffect } from 'react';
import { MetricInput } from '@/components/profile/MetricInput.tsx';
import { ProteinIndicator } from '@/components/profile/ProteinIndicator.tsx';

export default function ProfileScreen() {
  const profile = useStore((state) => state.profile);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const activities = useStore((state) => state.activities);
  const updateProfile = useStore((state) => state.updateProfile);
  
  // Use profile values as initial state, fallback to defaults
  const [goal, setGoal] = useState<WeightGoal>((profile.goal as WeightGoal) || 'maintain');
  const [diet, setDiet] = useState<DietType>((profile.diet as DietType) || 'balanced');

  const bmr = Math.round(calculateBMR(profile));
  const tdeeBase = Math.round(calculateTDEE(profile));
  const targetCalories = Math.round(goal === 'lose' ? tdeeBase * 0.85 : goal === 'gain' ? tdeeBase * 1.15 : tdeeBase);

  // Sync macros when goal/diet changes
  const applyPreset = React.useCallback((currentDiet: DietType, currentGoal: WeightGoal) => {
    const macros = generateMacroTargets(targetCalories, currentDiet, profile.weightKg || 0, currentGoal);
    updateProfile({ 
      macroTargets: macros,
      goal: currentGoal,
      diet: currentDiet
    });
  }, [targetCalories, profile.weightKg, updateProfile]);

  const handleManualProteinChange = (newProtein: number) => {
    const macros = adjustMacrosForProtein(targetCalories, newProtein, diet);
    updateProfile({ macroTargets: macros });
  };

  useEffect(() => {
    applyPreset(diet, goal);
  }, [goal, diet, tdeeBase, applyPreset]);



  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 px-5 pt-6 pb-2 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your body metrics and goals
          </p>
        </div>

        {/* Compact Theme Switcher */}
        <div className="flex bg-secondary/30 p-1 rounded-xl border border-white/5 backdrop-blur-md">
          {[
            { key: 'light', icon: Sun },
            { key: 'dark', icon: Moon },
            { key: 'system', icon: Monitor },
          ].map((t) => (
            <button
              key={t.key}
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
              selectedValue={goal}
              onSelect={setGoal}
              options={[
                { id: 'lose', label: 'Loss', tip: 'Deficit: ~15% daily' },
                { id: 'maintain', label: 'Maintain', tip: 'Base level: no changes' },
                { id: 'gain', label: 'Gain', tip: 'Surplus: ~15% daily. Requires adequate protein intake' }
              ]}
            />

            <OptionSelector
              label="Strategy"
              selectedValue={diet}
              onSelect={setDiet}
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
                value={profile.age || ''}
                onChange={(val) => updateProfile({ age: val })}
                tooltipTitle="Age"
                tooltipContent="Metabolism slows down with age, reducing calorie needs."
                align="left"
              />
              <MetricInput
                label="Weight (kg)"
                value={profile.weightKg || ''}
                onChange={(val) => updateProfile({ weightKg: val })}
                tooltipTitle="Weight"
                tooltipContent="More weight requires more energy to sustain."
                step="0.1"
                align="center"
              />
              <MetricInput
                label="Height (cm)"
                value={profile.heightCm || ''}
                onChange={(val) => updateProfile({ heightCm: val })}
                tooltipTitle="Height"
                tooltipContent="Height affects metabolic rate."
                align="right"
              />
            </div>

            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center justify-between mb-2 px-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Activity</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">{profile.activityFactor}</span>
                  <InfoTooltip title="Activity" content="Multiplier from 1.2 (sedentary) to 1.9 (daily heavy lifting). Greatly impacts target calories." align="right" />
                </div>
              </div>
              <input
                type="range"
                min="1.2"
                max="1.9"
                step="0.05"
                value={profile.activityFactor}
                onChange={(e) => updateProfile({ activityFactor: parseFloat(e.target.value) })}
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
                  value={profile.macroTargets?.[m.key as keyof typeof profile.macroTargets] || ''}
                  readOnly={m.key !== 'protein'}
                  onChange={(e) => {
                    if (m.key === 'protein') {
                      let newProtein = parseInt(e.target.value) || 0;
                      const maxProtein = Math.round(profile.weightKg * 2.5);
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
            protein={profile.macroTargets?.protein || 0}
            weight={profile.weightKg}
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
                      {item.kcalPerUnit} kcal / {item.metricLabel}
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
          <button className="w-full flex items-center justify-center gap-2 py-4 text-destructive font-bold glass-card rounded-2xl hover:bg-destructive/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Reset App Data
          </button>
        </div>
      </div>
    </div>
  );
}
