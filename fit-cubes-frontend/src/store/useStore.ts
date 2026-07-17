import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createProfileSlice, type ProfileSlice } from './slices/createProfileSlice.ts';
import { createDataSlice, type DataSlice } from './slices/createDataSlice.ts';
import { createLogSlice, type LogSlice } from './slices/createLogSlice.ts';
import { createUISlice, type UISlice } from './slices/createUISlice.ts';

export type StoreState = ProfileSlice & DataSlice & LogSlice & UISlice;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createProfileSlice(...a),
      ...createDataSlice(...a),
      ...createLogSlice(...a),
      ...createUISlice(...a),
    }),
    {
      name: 'fitcubes-storage',
      partialize: (state) => ({
        profile: state.profile,
        dailyLogs: state.dailyLogs,
        isOnboarded: state.isOnboarded,
        selectedDate: state.selectedDate,
        theme: state.theme,
        customCategories: state.customCategories,
        favoriteProductIds: state.favoriteProductIds,
        products: state.products.filter(p => p.id.startsWith('custom_') || p.id.startsWith('recipe_')),
      }),
    }
  )
);
