import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import { productService } from '@/services/productService';
import { recipeService } from '@/services/recipeService';
import { exerciseService } from '@/services/exerciseService';
import { authService } from '@/services/authService';
import {
  mapProductDtoToFoodItem,
  mapRecipeSummaryDtoToFoodItem,
} from '@/utils/apiMappers';
import { ACTIVITY_CONSTANTS } from '@/constants';
import type { FoodItem, ActivityConstant } from '@/types';

export function useDataLoader() {
  const { products, setProducts, setActivities, setIsLoadingData, isOnboarded } = useStore();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Do not load products during onboarding wizard steps
    if (!isOnboarded) {
      return;
    }

    async function loadData() {
      setIsLoadingData(true);
      try {
        let loadedProducts: FoodItem[] = [];
        let loadedRecipes: FoodItem[] = [];
        let loadedActivities: ActivityConstant[] = [];

        const isAuthenticated = authService.isAuthenticated();

        if (isAuthenticated) {
          const [productsRes, recipesRes, activitiesRes] = await Promise.allSettled([
            productService.getProducts({ size: 500 }),
            recipeService.getRecipes({ size: 100 }),
            exerciseService.getActivities({ size: 100 }),
          ]);

          if (
            productsRes.status === 'fulfilled' &&
            productsRes.value.ok &&
            productsRes.value.data?.content
          ) {
            loadedProducts = productsRes.value.data.content.map(mapProductDtoToFoodItem);
          }

          if (
            recipesRes.status === 'fulfilled' &&
            recipesRes.value.ok &&
            recipesRes.value.data?.content
          ) {
            loadedRecipes = recipesRes.value.data.content.map(mapRecipeSummaryDtoToFoodItem);
          }

          if (
            activitiesRes.status === 'fulfilled' &&
            activitiesRes.value.ok &&
            activitiesRes.value.data?.content?.length
          ) {
            loadedActivities = activitiesRes.value.data.content.map((act) => ({
              id: act.id,
              name: act.name,
              metricLabel: 'minutes',
              met: act.met,
              kcalPerUnit: Math.round(((act.met * 3.5 * 70) / 200) * 10) / 10,
            }));
          }
        }

        // Fallback only if no products could be loaded from backend
        if (loadedProducts.length === 0) {
          try {
            loadedProducts = await api.getStaticProducts();
          } catch {
            loadedProducts = [];
          }
        }

        if (loadedActivities.length === 0) {
          try {
            loadedActivities = await api.getActivities();
          } catch {
            loadedActivities = ACTIVITY_CONSTANTS;
          }
        }

        // Keep local custom products/recipes
        const customProducts = products.filter(
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
        hasLoadedRef.current = true;
      } catch (error) {
        console.error('Error loading nutritional data:', error);
      } finally {
        setIsLoadingData(false);
      }
    }

    if (!hasLoadedRef.current) {
      loadData();
    }
  }, [isOnboarded, setProducts, setActivities, setIsLoadingData]);
}
