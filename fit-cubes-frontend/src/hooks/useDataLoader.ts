import { useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import { productService } from '@/services/productService';
import { recipeService } from '@/services/recipeService';
import { exerciseService } from '@/services/exerciseService';
import {
  mapProductDtoToFoodItem,
  mapRecipeSummaryDtoToFoodItem,
} from '@/utils/apiMappers';
import type { FoodItem, ActivityConstant } from '@/types';
import type { ProductDto, RecipeSummaryDto, ActivityDto } from '@/types/api';

export function useDataLoader() {
  const { setProducts, setActivities, setActivitiesError, setIsLoadingData, isOnboarded } = useStore();

  const loadData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      let loadedProducts: FoodItem[] = [];
      let loadedRecipes: FoodItem[] = [];
      let loadedActivities: ActivityConstant[] = [];

      // 1. Always attempt to fetch from live backend REST API first (Authorization header attached automatically if token present)
      const [productsRes, recipesRes, activitiesRes] = await Promise.allSettled([
        productService.getProducts({ size: 250 }),
        recipeService.getRecipes({ size: 100 }),
        exerciseService.getActivities({ size: 100 }),
      ]);

      // Parse Products from backend (supports both PageResponse { content: [...] } and direct array [...])
      if (productsRes.status === 'fulfilled' && productsRes.value.ok && productsRes.value.data) {
        const rawData = productsRes.value.data as unknown;
        const items: ProductDto[] = Array.isArray(rawData)
          ? rawData
          : typeof rawData === 'object' && rawData !== null && 'content' in rawData && Array.isArray((rawData as { content: unknown }).content)
          ? ((rawData as { content: ProductDto[] }).content)
          : [];

        if (items.length > 0) {
          loadedProducts = items.map(mapProductDtoToFoodItem);
          console.log(`[DataLoader] Loaded ${loadedProducts.length} products from backend API`);
        }
      } else if (productsRes.status === 'fulfilled' && !productsRes.value.ok) {
        console.warn(`[DataLoader] Backend products request returned status ${productsRes.value.status}:`, productsRes.value.error);
      }

      // Parse Recipes from backend
      if (recipesRes.status === 'fulfilled' && recipesRes.value.ok && recipesRes.value.data) {
        const rawData = recipesRes.value.data as unknown;
        const items: RecipeSummaryDto[] = Array.isArray(rawData)
          ? rawData
          : typeof rawData === 'object' && rawData !== null && 'content' in rawData && Array.isArray((rawData as { content: unknown }).content)
          ? ((rawData as { content: RecipeSummaryDto[] }).content)
          : [];

        if (items.length > 0) {
          loadedRecipes = items.map(mapRecipeSummaryDtoToFoodItem);
          console.log(`[DataLoader] Loaded ${loadedRecipes.length} recipes from backend API`);
        }
      }

      // Parse Activities from backend
      if (activitiesRes.status === 'fulfilled' && activitiesRes.value.ok && activitiesRes.value.data) {
        const rawData = activitiesRes.value.data as unknown;
        const items: ActivityDto[] = Array.isArray(rawData)
          ? rawData
          : typeof rawData === 'object' && rawData !== null && 'content' in rawData && Array.isArray((rawData as { content: unknown }).content)
          ? ((rawData as { content: ActivityDto[] }).content)
          : [];

        if (items.length > 0) {
          loadedActivities = items.map((act) => ({
            id: act.id,
            name: act.name,
            metricLabel: 'minutes',
            met: act.met,
            kcalPerUnit: Math.round(((act.met * 3.5 * 70) / 200) * 10) / 10,
          }));
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

      // 2. Emergency fallback ONLY for products if backend returned 0 items
      if (loadedProducts.length === 0) {
        console.warn('[DataLoader] Backend products unavailable, using fallback static products (/data/products.json)');
        try {
          loadedProducts = await api.getStaticProducts();
        } catch {
          loadedProducts = [];
        }
      }

      // Keep user's custom products and recipes from local store
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
  }, [setProducts, setActivities, setIsLoadingData]);

  useEffect(() => {
    // Only load if onboarding is finished
    if (!isOnboarded) {
      return;
    }

    loadData();

    // Re-fetch database whenever auth state changes (login, register, logout)
    const handleAuthChange = () => {
      loadData();
    };

    window.addEventListener('fitcubes_auth_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('fitcubes_auth_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [isOnboarded, loadData]);
}
