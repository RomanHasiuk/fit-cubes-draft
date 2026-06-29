import type { UserProfile, FoodItem, ActivityConstant } from '@/types';

// 1. BMR - Mifflin-St Jeor
export function calculateBMR(profile: UserProfile): number {
  const s = profile.gender === 'male' ? 5 : -161;
  return 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + s;
}

// 2. TDEE
export function calculateTDEE(profile: UserProfile): number {
  return Math.round(calculateBMR(profile) * profile.activityFactor);
}

// 3. Exercise calories
export function calculateExerciseCalories(
  activity: ActivityConstant,
  metric: number
): number {
  return Math.round(activity.kcalPerUnit * metric * 100) / 100;
}

// 4. Raw-to-cooked conversion
export function calculateCookedNutrition(
  food: FoodItem,
  cookedWeightGrams: number
): { calories: number; protein: number; carbs: number; fats: number } {
  if (!food.rawWeight || !food.cookedWeight || food.rawWeight === 0) {
    return {
      calories: (food.caloriesPer100g * cookedWeightGrams) / 100,
      protein: (food.proteinPer100g * cookedWeightGrams) / 100,
      carbs: (food.carbsPer100g * cookedWeightGrams) / 100,
      fats: (food.fatsPer100g * cookedWeightGrams) / 100,
    };
  }
  // Density factor: how many times more dense cooked food is
  const densityFactor = food.rawWeight / food.cookedWeight;
  return {
    calories: (food.caloriesPer100g * cookedWeightGrams * densityFactor) / 100,
    protein: (food.proteinPer100g * cookedWeightGrams * densityFactor) / 100,
    carbs: (food.carbsPer100g * cookedWeightGrams * densityFactor) / 100,
    fats: (food.fatsPer100g * cookedWeightGrams * densityFactor) / 100,
  };
}

// 5. Portion nutrition (raw weight)
export function calculatePortionNutrition(
  food: FoodItem,
  weightGrams: number
): { calories: number; protein: number; carbs: number; fats: number } {
  return {
    calories: (food.caloriesPer100g * weightGrams) / 100,
    protein: (food.proteinPer100g * weightGrams) / 100,
    carbs: (food.carbsPer100g * weightGrams) / 100,
    fats: (food.fatsPer100g * weightGrams) / 100,
  };
}

// 6. Net deficit
export function calculateNetDeficit(
  tdee: number,
  intakeCalories: number,
  exerciseCalories: number
): number {
  return Math.round(tdee - intakeCalories + exerciseCalories);
}

// 7. 7-day rolling average
export function calculateRollingAverage(
  values: number[],
  windowSize: number = 7
): number[] {
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const slice = values.slice(start, i + 1);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    result.push(Math.round(avg * 100) / 100);
  }
  return result;
}

// 8. Projected weight loss
export function projectWeightLoss(
  currentWeight: number,
  weeklyDeficit: number
): number {
  // 7700 kcal = 1kg of fat
  const kgLoss = weeklyDeficit / 7700;
  return Math.round((currentWeight - kgLoss) * 10) / 10;
}

// Date helpers
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getRelativeDateLabel(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = dateStr.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return 'Today';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays === 1) return 'Tomorrow';
  return formatDate(dateStr);
}

export function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getLast7Days(): string[] {
  const result: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    result.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    );
  }
  return result;
}

// 9. Macro Target Generator
export type DietType = 'balanced' | 'low-carb' | 'keto';
export type WeightGoal = 'lose' | 'maintain' | 'gain';

export function generateMacroTargets(
  targetCalories: number,
  dietType: DietType,
  weightKg: number
): { protein: number; carbs: number; fats: number } {
  // Protein is calculated based on weight (1.8g/kg for balanced, 2.0g/kg for low-carb/keto)
  const proteinFactor = dietType === 'balanced' ? 1.8 : 2.0;
  const proteinGrams = Math.round(weightKg * proteinFactor);
  const proteinCals = proteinGrams * 4;

  let remainingCals = targetCalories - proteinCals;
  if (remainingCals < 0) remainingCals = 0;

  let cRatio = 4, fRatio = 3;
  if (dietType === 'low-carb') {
    cRatio = 1; fRatio = 2;
  } else if (dietType === 'keto') {
    cRatio = 1; fRatio = 11;
  }

  const totalRatio = cRatio + fRatio;
  const carbsCals = remainingCals * (cRatio / totalRatio);
  const fatsCals = remainingCals * (fRatio / totalRatio);

  return {
    protein: proteinGrams,
    carbs: Math.round(carbsCals / 4),
    fats: Math.round(fatsCals / 9),
  };
}

export function adjustMacrosForProtein(
  targetCalories: number,
  proteinGrams: number,
  dietType: DietType
): { protein: number; carbs: number; fats: number } {
  const proteinCals = proteinGrams * 4;
  let remainingCals = targetCalories - proteinCals;
  if (remainingCals < 0) remainingCals = 0;

  // Base ratios for remaining (Carbs vs Fats) based on diet type
  // balanced: carbs 40%, fats 30% -> ratio 4:3
  // low-carb: carbs 20%, fats 40% -> ratio 1:2
  // keto: carbs 5%, fats 55% -> ratio 1:11
  let cRatio = 4, fRatio = 3;
  if (dietType === 'low-carb') {
    cRatio = 1; fRatio = 2;
  } else if (dietType === 'keto') {
    cRatio = 1; fRatio = 11;
  }

  const totalRatio = cRatio + fRatio;
  const carbsCals = remainingCals * (cRatio / totalRatio);
  const fatsCals = remainingCals * (fRatio / totalRatio);

  return {
    protein: proteinGrams,
    carbs: Math.round(carbsCals / 4),
    fats: Math.round(fatsCals / 9),
  };
}

export function calculatePortionOrCookedNutrition(
  food: FoodItem,
  weight: number,
  isCooked: boolean,
  hasConversion: boolean
) {
  if (isCooked && hasConversion) {
    return calculateCookedNutrition(food, weight);
  }
  return calculatePortionNutrition(food, weight);
}

