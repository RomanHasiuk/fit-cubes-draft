import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createProfileSlice, type ProfileSlice, defaultProfile } from './slices/createProfileSlice';
import { createDataSlice, type DataSlice } from './slices/createDataSlice';
import { createLogSlice, type LogSlice, getTodayString } from './slices/createLogSlice';
import { createUISlice, type UISlice } from './slices/createUISlice';

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
        theme: state.theme,
        customCategories: state.customCategories,
        favoriteProductIds: state.favoriteProductIds,
        products: state.products.filter(p => p.id.startsWith('custom_') || p.id.startsWith('recipe_')),
      }),
    }
  )
);

/**
 * Completely purges all user data and resets store to pristine initial state.
 * Clears both in-memory state and localStorage persist container.
 */
export const resetStore = (): void => {
  useStore.setState({
    profile: defaultProfile,
    isOnboarded: false,
    products: [],
    productsError: null,
    activities: [],
    activitiesError: null,
    isLoadingData: false,
    editingRecipe: null,
    customCategories: [],
    favoriteProductIds: [],
    dailyLogs: [],
    selectedDate: getTodayString(),
    pendingFoodLog: null,
    openModalCount: 0,
  });

  try {
    useStore.persist.clearStorage();
  } catch (err) {
    console.warn('[useStore] Failed to clear persistent storage:', err);
  }
};

