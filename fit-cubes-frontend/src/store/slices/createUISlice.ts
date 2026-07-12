import type { StateCreator } from 'zustand';
import type { StoreState } from '../useStore.ts';
import type { FoodItem } from '@/types';

export interface UISlice {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  pendingFoodLog: { food: FoodItem; mealType: string } | null;
  setPendingFoodLog: (log: { food: FoodItem; mealType: string } | null) => void;
}

export const createUISlice: StateCreator<StoreState, [], [], UISlice> = (set) => ({
  theme: 'system',
  pendingFoodLog: null,
  setPendingFoodLog: (log) => set({ pendingFoodLog: log }),
  setTheme: (theme) => {
    set({ theme });
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  },
});
