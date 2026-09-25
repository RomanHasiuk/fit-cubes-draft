import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, RotateCcw } from 'lucide-react';
import { useStore } from '@/store/useStore';
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  generateMacroTargets,
  adjustMacrosForProtein,
} from '@/utils/calculations';
import {
  WEIGHT_GOAL,
  DIET_TYPE,
  type WeightGoal,
  type DietType,
  type Gender,
} from '@/constants';
import { sanitizeNameInput } from '@/utils/inputHandlers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { EnergyTargetsCard } from '@/components/profile/EnergyTargetsCard';
import { BodyMetricsCard } from '@/components/profile/BodyMetricsCard';
import { MacroAdjustmentCard } from '@/components/profile/MacroAdjustmentCard';
import { ExerciseCatalogCard } from '@/components/profile/ExerciseCatalogCard';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { weightService } from '@/services/weightService';
import {
  mapProfileDtoToUserProfile,
  mapProfileToUpdatePayload,
} from '@/utils/apiMappers';

export default function ProfileScreen() {
  const profile = useStore((state) => state.profile);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const activities = useStore((state) => state.activities);
  const updateProfile = useStore((state) => state.updateProfile);

  const [isLoading, setIsLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [draft, setDraft] = useState(profile);

  // Synchronize draft with global store
  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  // Load profile from Spring Boot backend on mount if authenticated
  useEffect(() => {
    let isCancelled = false;

    if (!authService.isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    userService
      .getProfile()
      .then((res) => {
        if (isCancelled) return;
        if (res.ok && res.data) {
          const mapped = mapProfileDtoToUserProfile(res.data, profile);
          updateProfile(mapped);
          setDraft(mapped);
        }
      })
      .catch((err) => {
        console.error('Failed to load profile from backend:', err);
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Metabolic calculations from unified calculations.ts
  const bmr = useMemo(() => Math.round(calculateBMR(draft)), [draft]);
  const tdee = useMemo(() => Math.round(calculateTDEE(draft)), [draft]);
  const targetCalories = useMemo(
    () => calculateTargetCalories(tdee, draft.goal),
    [tdee, draft.goal]
  );

  // Synchronize macros when draft biometrics, activity, or calories change
  const applyPreset = useCallback(
    (currentDiet: DietType, currentGoal: WeightGoal, cals: number, weight: number) => {
      const macros = generateMacroTargets(cals, currentDiet, weight, currentGoal);
      setDraft((prev) => ({
        ...prev,
        macroTargets: macros,
        goal: currentGoal,
        diet: currentDiet,
      }));
    },
    []
  );

  const handleGoalChange = (newGoal: WeightGoal) => {
    const newTargetCals = calculateTargetCalories(tdee, newGoal);
    applyPreset(
      draft.diet || DIET_TYPE.BALANCED,
      newGoal,
      newTargetCals,
      draft.weightKg || 0
    );
  };

  const handleDietChange = (newDiet: DietType) => {
    applyPreset(
      newDiet,
      draft.goal || WEIGHT_GOAL.MAINTAIN,
      targetCalories,
      draft.weightKg || 0
    );
  };

  const handleGenderChange = (gender: Gender) => {
    setDraft((prev) => ({ ...prev, gender }));
  };

  const handleAgeChange = (age: number) => {
    setDraft((prev) => ({ ...prev, age }));
  };

  const handleWeightChange = (weightKg: number) => {
    setDraft((prev) => ({ ...prev, weightKg }));
  };

  const handleHeightChange = (heightCm: number) => {
    setDraft((prev) => ({ ...prev, heightCm }));
  };

  const handleActivityChange = (factor: number) => {
    setDraft((prev) => ({ ...prev, activityFactor: factor }));
  };

  const handleProteinChange = (newProtein: number) => {
    const macros = adjustMacrosForProtein(
      targetCalories,
      newProtein,
      draft.diet || DIET_TYPE.BALANCED
    );
    setDraft((prev) => ({ ...prev, macroTargets: macros }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft((prev) => ({ ...prev, name: sanitizeNameInput(e.target.value) }));
  };

  const hasChanges = useMemo(
    () => JSON.stringify(profile) !== JSON.stringify(draft),
    [profile, draft]
  );

  const handleSave = () => {
    updateProfile(draft);

    if (authService.isAuthenticated()) {
      const payload = mapProfileToUpdatePayload(draft);
      userService.updateProfile(payload).catch((err) => {
        console.error('Failed to sync profile update to backend:', err);
      });

      if (draft.weightKg && draft.weightKg !== profile.weightKg) {
        weightService
          .logWeight({
            weight: draft.weightKg,
            loggedAt: new Date(Date.now() - 60000).toISOString(),
          })
          .catch((err) => {
            console.error('Failed to log weight to backend:', err);
          });
      }
    }
  };

  const handleCancel = () => {
    setDraft(profile);
  };

  const handleResetAppData = () => {
    localStorage.removeItem('fitcubes-storage');
    localStorage.removeItem('fitcubes_auth_token');
    localStorage.removeItem('fitcubes_auth_user');
    window.location.reload();
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-[1016px] flex-col relative px-4 md:px-8 pt-[102px] md:pt-[126px] pb-16">
      <div className="rounded-[5px] border border-[#32363E] bg-[#0F1114]/80 backdrop-blur-md p-5 md:p-8 shadow-2xl space-y-6">
        {/* Header: Title, Description & Theme Switcher */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#32363E]/60 pb-5">
          <div className="flex flex-col">
            <h1 className="heading-h2 text-foreground">Profile & Goals</h1>
            <p className="font-sans text-[14px] text-[#8E8F96] mt-0.5">
              Manage your biometric parameters, targets and nutritional strategy
            </p>
          </div>

          {/* Compact Theme Switcher */}
          <div className="flex items-center gap-1 self-start rounded-[5px] border border-[#32363E] bg-[#16181D]/80 p-1 backdrop-blur-md">
            {([
              { key: 'light', icon: Sun, label: 'Light Mode' },
              { key: 'dark', icon: Moon, label: 'Dark Mode' },
              { key: 'system', icon: Monitor, label: 'System Default' },
            ] as const).map((t) => (
              <button
                key={t.key}
                type="button"
                title={t.label}
                onClick={() => setTheme(t.key)}
                className={`flex h-8 w-8 items-center justify-center rounded-[4px] transition-all ${
                  theme === t.key
                    ? 'border border-[#4F3911] bg-[#251F13] text-[#F59F0A] shadow-sm'
                    : 'text-[#8E8F96] hover:text-foreground'
                }`}
              >
                <t.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* User Full Name Input */}
        <div className="flex flex-col gap-1.5">
          <Input
            label="Full Name"
            type="text"
            value={draft.name || ''}
            onChange={handleNameChange}
            placeholder="Your Name"
            maxLength={50}
          />
        </div>

        {/* 1. Energy & Calorie Targets */}
        <EnergyTargetsCard
          bmr={bmr}
          tdee={tdee}
          targetCalories={targetCalories}
          goal={draft.goal || WEIGHT_GOAL.MAINTAIN}
          diet={draft.diet || DIET_TYPE.BALANCED}
          activityFactor={draft.activityFactor || 1.5}
          onGoalChange={handleGoalChange}
          onDietChange={handleDietChange}
        />

        {/* 2. Body Metrics */}
        <BodyMetricsCard
          gender={draft.gender}
          age={draft.age || 25}
          weightKg={draft.weightKg || 70}
          heightCm={draft.heightCm || 175}
          activityFactor={draft.activityFactor || 1.5}
          onGenderChange={handleGenderChange}
          onAgeChange={handleAgeChange}
          onWeightChange={handleWeightChange}
          onHeightChange={handleHeightChange}
          onActivityChange={handleActivityChange}
        />

        {/* 3. Macronutrient Targets */}
        <MacroAdjustmentCard
          macroTargets={draft.macroTargets || { protein: 140, carbs: 220, fats: 65 }}
          targetCalories={targetCalories}
          weightKg={draft.weightKg || 70}
          onProteinChange={handleProteinChange}
        />

        {/* 4. Exercise MET Catalog */}
        <ExerciseCatalogCard
          activities={activities}
          weightKg={draft.weightKg || 70}
        />

        {/* Danger Zone: Reset App Data */}
        <div className="pt-2 border-t border-[#32363E]/60">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] border border-red-500/20 bg-red-500/10 font-sans text-[14px] font-semibold text-red-400 transition-all hover:bg-red-500/20 active:scale-[0.99]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset App Data
          </button>
        </div>
      </div>

      {/* Floating Save / Cancel Bar */}
      <AnimatePresence>
        {hasChanges && (
          <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
            <motion.div
              className="w-full max-w-[460px] rounded-[10px] border border-[#F59F0A]/40 bg-[#16181D]/95 backdrop-blur-xl p-3.5 flex items-center justify-between shadow-2xl pointer-events-auto"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
            >
              <div className="flex flex-col">
                <span className="font-sans text-[14px] font-bold text-foreground">
                  Unsaved changes
                </span>
                <span className="font-sans text-[12px] text-[#8E8F96]">
                  Click Save to apply your metrics
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="h-9 px-3.5 text-[14px]"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="h-9 px-4 text-[14px]"
                >
                  Save
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unified Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset App Data?"
        description="This action cannot be undone. All your logs, custom foods, and settings will be permanently deleted."
        confirmText="Yes, Reset"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleResetAppData}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}
