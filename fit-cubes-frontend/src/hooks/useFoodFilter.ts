import { useState, useMemo } from 'react';
import type { FoodItem, DailyLog } from '@/types';

export const SORT_OPTIONS = [
  { key: 'usage', label: 'Most Used' },
  { key: 'name', label: 'By name' },
  { key: 'calories', label: 'Calories' },
  { key: 'proteinRatio', label: 'Protein density (P/kcal)' },
  { key: 'protein', label: 'Protein' },
  { key: 'fats', label: 'Fats' },
  { key: 'carbs', label: 'Carbs' },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]['key'];
export type SortDirection = 'asc' | 'desc';

interface UseFoodFilterProps {
  products: FoodItem[];
  dailyLogs: DailyLog[];
  customCategories: string[];
  favoriteProductIds: string[];
}

export function useFoodFilter({
  products,
  dailyLogs,
  customCategories,
  favoriteProductIds,
}: UseFoodFilterProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortKey>('usage');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Calculate product usage frequency across all daily logs
  const usageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dailyLogs.forEach((log) => {
      log.foodEntries.forEach((entry) => {
        counts[entry.foodItemId] = (counts[entry.foodItemId] || 0) + 1;
      });
    });
    return counts;
  }, [dailyLogs]);

  // Aggregate standard and custom categories
  const uniqueCategories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    customCategories.forEach((cat) => cats.add(cat));
    return ['All', 'Favorites', ...Array.from(cats)];
  }, [products, customCategories]);

  // Memoized search, filter, and sort pipeline
  const filteredFoods = useMemo(() => {
    let foods = [...products];

    // 1. Text Search Filter
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      foods = foods.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (selectedCategory === 'Favorites') {
      foods = foods.filter((f) => favoriteProductIds.includes(f.id));
    } else if (selectedCategory !== 'All') {
      foods = foods.filter((f) => f.category === selectedCategory);
    }

    // 3. Sorting Strategy
    foods.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      switch (sortBy) {
        case 'calories':
          valA = a.caloriesPer100g;
          valB = b.caloriesPer100g;
          break;
        case 'protein':
          valA = a.proteinPer100g;
          valB = b.proteinPer100g;
          break;
        case 'proteinRatio':
          valA = a.caloriesPer100g > 0 ? a.proteinPer100g / a.caloriesPer100g : 0;
          valB = b.caloriesPer100g > 0 ? b.proteinPer100g / b.caloriesPer100g : 0;
          break;
        case 'fats':
          valA = a.fatsPer100g;
          valB = b.fatsPer100g;
          break;
        case 'carbs':
          valA = a.carbsPer100g;
          valB = b.carbsPer100g;
          break;
        case 'usage': {
          const countA = usageCounts[a.id] || 0;
          const countB = usageCounts[b.id] || 0;
          if (countA !== countB) {
            return countB - countA; // Higher usage first
          }
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        }
        case 'name':
        default:
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return foods;
  }, [
    products,
    query,
    selectedCategory,
    sortBy,
    sortDirection,
    favoriteProductIds,
    usageCounts,
  ]);

  return {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    usageCounts,
    uniqueCategories,
    filteredFoods,
  };
}
