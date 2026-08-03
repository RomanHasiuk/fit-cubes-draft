import type { StateCreator } from 'zustand';
import type { UserProfile } from '@/types';
import type { StoreState } from '../useStore.ts';
import { generateMacroTargets, calculateTargetCalories } from '@/utils/calculations.ts';
import { WEIGHT_GOAL, DIET_TYPE } from '@/constants';

export interface ProfileSlice {
  profile: UserProfile;
  isOnboarded: boolean;
  updateProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
}

const initialTDEE = Math.round((10 * 85.5 + 6.25 * 180 - 5 * 28 + 5) * 1.55);
const initialTargetCalories = calculateTargetCalories(initialTDEE, WEIGHT_GOAL.MAINTAIN);

const defaultProfile: UserProfile = {
  name: '',
  gender: 'male',
  age: 28,
  weightKg: 85.5,
  heightCm: 180,
  activityFactor: 1.5,
  theme: 'system',
  goal: WEIGHT_GOAL.MAINTAIN,
  diet: DIET_TYPE.BALANCED,
  macroTargets: generateMacroTargets(initialTargetCalories, DIET_TYPE.BALANCED, 85.5, WEIGHT_GOAL.MAINTAIN),
};

export const createProfileSlice: StateCreator<StoreState, [], [], ProfileSlice> = (set) => ({
  profile: defaultProfile,
  isOnboarded: false,
  updateProfile: (updates) =>
    set((state) => ({ profile: { ...state.profile, ...updates } })),
  completeOnboarding: () => set({ isOnboarded: true }),
});
