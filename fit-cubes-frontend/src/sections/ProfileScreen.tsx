import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
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
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { EnergyTargetsCard } from '@/components/profile/EnergyTargetsCard';
import { BodyMetricsCard } from '@/components/profile/BodyMetricsCard';
import { MacroAdjustmentCard } from '@/components/profile/MacroAdjustmentCard';
import InfoTooltip from '@/components/InfoTooltip';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { weightService } from '@/services/weightService';
import {
  mapProfileDtoToUserProfile,
  mapProfileToUpdatePayload,
} from '@/utils/apiMappers';

export default function ProfileScreen() {
  const profile = useStore((state) => state.profile);
  const setTheme = useStore((state) => state.setTheme);
  const updateProfile = useStore((state) => state.updateProfile);

  const [isLoading, setIsLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
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
        } else if (!res.ok) {
          console.warn('Failed to load profile from backend:', res.error);
        }
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
    const updatedDraft = { ...draft, weightKg };
    const newTdee = Math.round(calculateTDEE(updatedDraft));
    const newTargetCals = calculateTargetCalories(newTdee, updatedDraft.goal);
    const newMacros = generateMacroTargets(
      newTargetCals,
      updatedDraft.diet || DIET_TYPE.BALANCED,
      weightKg,
      updatedDraft.goal || WEIGHT_GOAL.MAINTAIN
    );
    setDraft({
      ...updatedDraft,
      targetCalories: newTargetCals,
      macroTargets: newMacros,
    });
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

  const handleSave = async () => {
    updateProfile(draft);

    if (authService.isAuthenticated()) {
      const payload = mapProfileToUpdatePayload(draft);
      const res = await userService.updateProfile(payload);
      if (!res.ok) {
        console.error('Failed to sync profile update to backend:', res.error);
        setSyncError(res.error || 'Failed to sync profile with server');
        setTimeout(() => setSyncError(null), 3000);
      }

      if (draft.weightKg && draft.weightKg !== profile.weightKg) {
        const weightRes = await weightService.logWeight({
          weight: draft.weightKg,
          loggedAt: new Date(Date.now() - 5000).toISOString(),
        });
        if (!weightRes.ok) {
          console.error('Failed to log weight to backend:', weightRes.error);
        }
      }
    }
  };

  const handleCancel = () => {
    setDraft(profile);
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-[1016px] flex-col relative px-4 md:px-8 pt-[102px] md:pt-[126px] pb-16">
      <AnimatePresence>
        {syncError && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-xl text-xs font-semibold shadow-lg backdrop-blur"
          >
            {syncError}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-[5px] border border-[#32363E] bg-[#0F1114]/80 backdrop-blur-md p-5 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#32363E]/60 pb-5">
          <div className="flex flex-col">
            <h1 className="heading-h2 text-[#F5F6FA]">Profile & Goals</h1>
            <p className="font-sans text-[14px] text-[#8E8F96] mt-0.5">
              Manage your biometric parameters, targets and nutritional strategy
            </p>
          </div>

          {/* Compact Theme Switcher with v2 Tooltips for locked modes */}
          <div className="flex items-center gap-1 self-start rounded-[5px] border border-[#32363E] bg-[#16181D]/80 p-1 backdrop-blur-md">
            {/* Light Mode - Coming in v2 */}
            <InfoTooltip
              title="Coming in v2"
              content="Light theme is in development for FitCubes v2. The app is currently optimized for Dark Mode."
              align="left"
              position="bottom"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[4px] opacity-40 cursor-not-allowed text-[#8E8F96] hover:text-[#F5F6FA] hover:opacity-75 transition-all select-none"
                title="Light Mode (Coming in v2)"
              >
                <Sun className="h-4 w-4" />
              </div>
            </InfoTooltip>

            {/* Dark Mode - Active */}
            <button
              type="button"
              title="Dark Mode (Active)"
              onClick={() => setTheme('dark')}
              className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#4F3911] bg-[#251F13] text-[#F59F0A] shadow-sm transition-all cursor-pointer"
            >
              <Moon className="h-4 w-4" />
            </button>

            {/* System Mode - Coming in v2 */}
            <InfoTooltip
              title="Coming in v2"
              content="System theme synchronization will be available in FitCubes v2. Dark mode is currently active."
              align="right"
              position="bottom"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[4px] opacity-40 cursor-not-allowed text-[#8E8F96] hover:text-[#F5F6FA] hover:opacity-75 transition-all select-none"
                title="System Default (Coming in v2)"
              >
                <Monitor className="h-4 w-4" />
              </div>
            </InfoTooltip>
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
    </div>
  );
}
