import type { StateCreator } from 'zustand';
import type { StoreState } from '../useStore';
import type { FoodItem, MealType } from '@/types';

export interface UISlice {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  pendingFoodLog: { food: FoodItem; mealType: MealType } | null;
  setPendingFoodLog: (log: { food: FoodItem; mealType: MealType } | null) => void;
  openModalCount: number;
  incrementOpenModals: () => void;
  decrementOpenModals: () => void;
}

export const createUISlice: StateCreator<StoreState, [], [], UISlice> = (set) => ({
  theme: 'system',
  pendingFoodLog: null,
  setPendingFoodLog: (log) => set({ pendingFoodLog: log }),
  openModalCount: 0,
  incrementOpenModals: () => set((state) => ({ openModalCount: state.openModalCount + 1 })),
  decrementOpenModals: () => set((state) => ({ openModalCount: Math.max(0, state.openModalCount - 1) })),
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
