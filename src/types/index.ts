export interface UserProfile {
  name: string;
  gender: 'male' | 'female';
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
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
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

export type Tab = 'dashboard' | 'diary' | 'progress' | 'profile';

export interface ActivityConstant {
  name: string;
  metricLabel: string;
  kcalPerUnit: number;
  met: number;
}

export const ACTIVITY_CONSTANTS: ActivityConstant[] = [
  { name: 'Push-ups', metricLabel: 'reps', kcalPerUnit: 0.45, met: 12.0 },
  { name: 'Squats', metricLabel: 'reps', kcalPerUnit: 0.40, met: 8.0 },
  { name: 'Jumping Jacks', metricLabel: 'reps', kcalPerUnit: 0.22, met: 10.0 },
  { name: 'Plank', metricLabel: 'minutes', kcalPerUnit: 10.00, met: 3.8 },
  { name: 'Steps', metricLabel: 'steps', kcalPerUnit: 0.03, met: 3.5 },
  { name: 'Housework', metricLabel: 'minutes', kcalPerUnit: 3.40, met: 3.0 },
];
