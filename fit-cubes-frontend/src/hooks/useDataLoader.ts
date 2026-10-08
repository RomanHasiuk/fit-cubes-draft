import { useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { authService } from '@/services/authService';
import { productService } from '@/services/productService';
import { recipeService } from '@/services/recipeService';
import { exerciseService } from '@/services/exerciseService';
import {
  mapProductDtoToFoodItem,
  mapRecipeSummaryDtoToFoodItem,
  mapActivityDtoToActivityConstant,
  extractApiItems,
} from '@/utils/apiMappers';
import type { FoodItem, ActivityConstant } from '@/types';
import type { ProductDto, RecipeSummaryDto, ActivityDto } from '@/types/api';

export function useDataLoader() {
  const {
    setProducts,
    setProductsError,
    setActivities,
    setActivitiesError,
    setIsLoadingData,
    isOnboarded,
  } = useStore();

  const loadData = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    try {
      let loadedProducts: FoodItem[] = [];
      let loadedRecipes: FoodItem[] = [];
      let loadedActivities: ActivityConstant[] = [];

      const [productsRes, recipesRes, activitiesRes] = await Promise.allSettled([
        productService.getAllProducts(1000),
        recipeService.getRecipes({ size: 200 }),
        exerciseService.getActivities({ size: 200 }),
      ]);

      if (productsRes.status === 'fulfilled' && productsRes.value.ok && productsRes.value.data) {
        const items = extractApiItems<ProductDto>(productsRes.value.data);
        if (items.length > 0) {
          loadedProducts = items.map(mapProductDtoToFoodItem);
          setProductsError(null);
          console.log(`[DataLoader] Loaded ${loadedProducts.length} products from backend API`);
        } else {
          setProductsError('EMPTY_DATABASE');
        }
      } else {
        const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
        const errType = isOffline ? 'NO_INTERNET' : 'SERVER_ERROR';
        setProductsError(errType);
        console.warn(`[DataLoader] Backend products unavailable (${errType})`);
      }

      if (recipesRes.status === 'fulfilled' && recipesRes.value.ok && recipesRes.value.data) {
        const items = extractApiItems<RecipeSummaryDto>(recipesRes.value.data);
        if (items.length > 0) {
          loadedRecipes = items.map(mapRecipeSummaryDtoToFoodItem);
          console.log(`[DataLoader] Loaded ${loadedRecipes.length} recipes from backend API`);
        }
      }

      if (activitiesRes.status === 'fulfilled' && activitiesRes.value.ok && activitiesRes.value.data) {
        const items = extractApiItems<ActivityDto>(activitiesRes.value.data);
        if (items.length > 0) {
          loadedActivities = items.map(mapActivityDtoToActivityConstant);
          setActivitiesError(null);
          console.log(`[DataLoader] Loaded ${loadedActivities.length} activities from backend API`);
        } else {
          setActivitiesError('EMPTY_DATABASE');
        }
      } else {
        const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
        const errType = isOffline ? 'NO_INTERNET' : 'SERVER_ERROR';
        setActivitiesError(errType);
        console.warn(`[DataLoader] Backend activities unavailable (${errType})`);
      }

      // Merge user custom/recipe items from local storage
      const currentProducts = useStore.getState().products;
      const customProducts = currentProducts.filter(
        (p) => p.id.startsWith('custom_') || p.id.startsWith('recipe_')
      );

      const combinedProducts = [
        ...customProducts,
        ...loadedRecipes,
        ...loadedProducts,
      ];

      const uniqueProducts = Array.from(
        new Map(combinedProducts.map((item) => [item.id, item])).values()
      );

      setProducts(uniqueProducts);
      setActivities(loadedActivities);
    } catch (error) {
      console.error('Error loading nutritional data:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, [setProducts, setProductsError, setActivities, setActivitiesError, setIsLoadingData]);

  useEffect(() => {
    if (!isOnboarded || !authService.isAuthenticated()) {
      return;
    }

    loadData();

    // Re-fetch database whenever auth state changes (login, register)
    const handleAuthChange = () => {
      if (authService.isAuthenticated()) {
        loadData();
      }
    };

    window.addEventListener('fitcubes_auth_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('fitcubes_auth_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [isOnboarded, loadData]);
}
