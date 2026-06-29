import type { StateCreator } from 'zustand';
import type { UserProfile } from '@/types';
import type { StoreState } from '../useStore';

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
  activityFactor: 1.55,
  theme: 'system',
  macroTargets: {
    protein: Math.round((initialTDEE * 0.4) / 4),
    carbs: Math.round((initialTDEE * 0.4) / 4),
    fats: Math.round((initialTDEE * 0.2) / 9),
  },
};

export const createProfileSlice: StateCreator<StoreState, [], [], ProfileSlice> = (set) => ({
  profile: defaultProfile,
  isOnboarded: false,
  updateProfile: (updates) =>
    set((state) => ({ profile: { ...state.profile, ...updates } })),
  completeOnboarding: () => set({ isOnboarded: true }),
});
