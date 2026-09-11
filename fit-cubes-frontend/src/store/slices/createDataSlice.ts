import type { StateCreator } from 'zustand';
import type { FoodItem, ActivityConstant } from '@/types';
import type { StoreState } from '../useStore';

export interface DataSlice {
  products: FoodItem[];
  activities: ActivityConstant[];
  isLoadingData: boolean;
  editingRecipe: FoodItem | null;
  customCategories: string[];
  favoriteProductIds: string[];
  setProducts: (products: FoodItem[]) => void;
  setActivities: (activities: ActivityConstant[]) => void;
  setIsLoadingData: (loading: boolean) => void;
  addProduct: (product: FoodItem) => void;
  updateProduct: (id: string, updates: Partial<FoodItem>) => void;
  deleteProduct: (id: string) => void;
  setEditingRecipe: (recipe: FoodItem | null) => void;
  addCustomCategory: (category: string) => void;
  deleteCustomCategory: (category: string) => void;
  toggleFavorite: (id: string) => void;
}

export const createDataSlice: StateCreator<StoreState, [], [], DataSlice> = (set) => ({
  products: [],
  activities: [],
  isLoadingData: false,
  editingRecipe: null,
  customCategories: [],
  favoriteProductIds: [],
  setProducts: (products) => set({ products }),
  setActivities: (activities) => set({ activities }),
  setIsLoadingData: (isLoadingData) => set({ isLoadingData }),
  addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id),
    dailyLogs: state.dailyLogs.map((log) => ({
      ...log,
      foodEntries: log.foodEntries.filter((entry) => entry.foodItemId !== id),
    })),
  })),
  setEditingRecipe: (recipe) => set({ editingRecipe: recipe }),
  addCustomCategory: (category) => set((state) => ({
    customCategories: state.customCategories.includes(category) 
      ? state.customCategories 
      : [...state.customCategories, category]
  })),
  deleteCustomCategory: (category) => set((state) => ({
    customCategories: state.customCategories.filter(c => c !== category)
  })),
  toggleFavorite: (id) => set((state) => ({
    favoriteProductIds: state.favoriteProductIds.includes(id)
      ? state.favoriteProductIds.filter(fId => fId !== id)
      : [...state.favoriteProductIds, id]
  })),
});
