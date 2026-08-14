import type { MealType, WeightGoal, DietType, Gender } from '@/constants';

export type { MealType, WeightGoal, DietType, Gender };
export { ACTIVITY_CONSTANTS, GENDER_OPTIONS, type ActivityConstant } from '@/constants';

export interface UserProfile {
  name: string;
  gender: Gender;
  age: number;
  weightKg: number;
  heightCm: number;
  activityFactor: number;
  targetCalories?: number;
  theme: 'light' | 'dark' | 'system';
  macroTargets: {
    protein: number;
    carbs: number;
    fats: number;
  };
  goal?: WeightGoal;
  diet?: DietType;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatsPer100g: number;
  rawWeight?: number;
  cookedWeight?: number;
  recipeIngredients?: Ingredients[];
  isFavorite?: boolean;
}

export interface FoodEntry {
  id: string;
  foodItemId: string;
  name: string;
  mealType: MealType;
  timestamp: number;
  weightGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  isCooked?: boolean;
  isRecipe?: boolean;
  ingredients?: Ingredients[];
  rawWeight?: number;
  cookedWeight?: number;
}

export interface Ingredients {
  foodItemId: string;
  name: string;
  weight: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface ExerciseEntry {
  id: string;
  activityType: string;
  metric: number;
  metricLabel: string;
  caloriesBurned: number;
  rpe?: number;
  timestamp: number;
  met: number;
  intensity: 'low' | 'medium' | 'high';
}

export interface DayLog {
  date: string;
  foodEntries: FoodEntry[];
  exerciseEntries: ExerciseEntry[];
  weight?: number;
  notes?: string;
}


