import type { StateCreator } from 'zustand';
import type { UserProfile } from '@/types';
import type { StoreState } from '../useStore.ts';
import { generateMacroTargets } from '@/utils/calculations.ts';

export interface ProfileSlice {
  profile: UserProfile;
  isOnboarded: boolean;
  updateProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
}

const initialTDEE = Math.round((10 * 85.5 + 6.25 * 180 - 5 * 28 + 5) * 1.55);

const defaultProfile: UserProfile = {
  name: '',
  gender: 'male',
  age: 28,
  weightKg: 85.5,
  heightCm: 180,
  activityFactor: 1.5,
  theme: 'system',
  goal: 'maintain',
  diet: 'balanced',
  macroTargets: generateMacroTargets(initialTDEE, 'balanced', 85.5, 'maintain'),
};

export const createProfileSlice: StateCreator<StoreState, [], [], ProfileSlice> = (set) => ({
  profile: defaultProfile,
  isOnboarded: false,
  updateProfile: (updates) =>
    set((state) => ({ profile: { ...state.profile, ...updates } })),
  completeOnboarding: () => set({ isOnboarded: true }),
});
