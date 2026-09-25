import type { FoodItem, UserProfile, FoodEntry, ExerciseEntry, ActivityConstant } from '@/types';
import type {
  UpdateProfilePayload,
  UserProfileDto,
  GenderApi,
  GoalApi,
  DietStrategyApi,
  ProductDto,
  ProductCategoryApi,
  RecipeSummaryDto,
  RecipeDto,
  CreateRecipeDto,
  DiaryFoodEntryDto,
  DiaryExerciseEntryDto,
  FoodEntryRequestDto,
  SourceTypeApi,
  MealTypeApi,
  ActivityDto,
} from '@/types/api';
import {
  WEIGHT_GOAL,
  DIET_TYPE,
  MEAL_TYPE,
  type WeightGoal,
  type DietType,
  type MealType,
} from '@/constants';

export function mapProfileToUpdatePayload(profile: UserProfile): UpdateProfilePayload {
  const cleanName = (profile.name || '').trim();
  const nameParts = cleanName.split(/\s+/);
  const firstName = nameParts[0] || undefined;
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

  const genderApi: GenderApi = profile.gender === 'female' ? 'FEMALE' : 'MALE';

  const goalMap: Record<WeightGoal, GoalApi> = {
    [WEIGHT_GOAL.LOSE]: 'WEIGHT_LOSS',
    [WEIGHT_GOAL.MAINTAIN]: 'MAINTENANCE',
    [WEIGHT_GOAL.GAIN]: 'MUSCLE_GAIN',
  };

  const dietMap: Record<DietType, DietStrategyApi> = {
    [DIET_TYPE.BALANCED]: 'BALANCED',
    [DIET_TYPE.LOW_CARB]: 'LOW_CARB',
    [DIET_TYPE.KETO]: 'KETO',
    [DIET_TYPE.HIGH_PROTEIN]: 'BALANCED',
  };

  const rawFactor = profile.activityFactor || 1.5;
  const safeActivity = Number(Math.min(1.9, Math.max(1.2, rawFactor)).toFixed(2));

  const safeHeight = profile.heightCm ? Math.round(profile.heightCm) : undefined;
  const safeProtein = profile.macroTargets?.protein !== undefined ? Math.round(profile.macroTargets.protein) : 0;
  const safeCarbs = profile.macroTargets?.carbs !== undefined ? Math.round(profile.macroTargets.carbs) : 0;
  const safeFats = profile.macroTargets?.fats !== undefined ? Math.round(profile.macroTargets.fats) : 0;

  return {
    firstName,
    lastName,
    gender: genderApi,
    age: profile.age ? Math.round(profile.age) : undefined,
    height: safeHeight,
    currentWeight: profile.weightKg || undefined,
    activityLevel: safeActivity,
    goal: profile.goal ? goalMap[profile.goal] : 'MAINTENANCE',
    dietStrategy: profile.diet ? dietMap[profile.diet] : 'BALANCED',
    proteinTargetGrams: safeProtein,
    carbsTargetGrams: safeCarbs,
    fatsTargetGrams: safeFats,
  };
}

export function mapProfileDtoToUserProfile(
  dto: UserProfileDto,
  current: UserProfile
): UserProfile {
  const reverseDietMap: Record<DietStrategyApi, DietType> = {
    BALANCED: DIET_TYPE.BALANCED,
    LOW_CARB: DIET_TYPE.LOW_CARB,
    KETO: DIET_TYPE.KETO,
  };

  return {
    ...current,
    name: dto.name || current.name,
    weightKg: dto.weightKg ?? current.weightKg,
    heightCm: dto.heightCm ?? current.heightCm,
    activityFactor: dto.activityFactor ?? current.activityFactor,
    diet: dto.dietStrategy ? reverseDietMap[dto.dietStrategy] : current.diet,
    targetCalories: dto.macroTargets?.calories ?? current.targetCalories,
    macroTargets: {
      protein: dto.macroTargets?.proteinGrams ?? current.macroTargets.protein,
      carbs: dto.macroTargets?.carbsGrams ?? current.macroTargets.carbs,
      fats: dto.macroTargets?.fatsGrams ?? current.macroTargets.fats,
    },
  };
}

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategoryApi, string> = {
  DAIRY_AND_CHEESE: 'Dairy & Cheese',
  MEAT_AND_POULTRY: 'Meat & Poultry',
  FISH_AND_SEAFOOD: 'Fish & Seafood',
  VEGETABLES: 'Vegetables',
  FRUITS: 'Fruits',
  GRAINS_AND_CEREALS: 'Grains & Cereals',
  NUTS_AND_SEEDS: 'Nuts & Seeds',
  SWEETS_AND_SPREADS: 'Sweets & Spreads',
  PREPARED_MEALS: 'Prepared Meals',
  OTHER: 'Other',
};

export function formatRecipeCategory(category?: string | null): string {
  if (!category) return 'Recipe';
  if (category in PRODUCT_CATEGORY_LABELS) {
    return PRODUCT_CATEGORY_LABELS[category as ProductCategoryApi];
  }
  return category
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function mapCategoryToApiCategory(category?: string | null): ProductCategoryApi {
  if (!category) return 'OTHER';
  const clean = category.trim();
  const normalized = clean.toUpperCase().replace(/[\s&]+/g, '_');

  const validCategories: ProductCategoryApi[] = [
    'DAIRY_AND_CHEESE',
    'MEAT_AND_POULTRY',
    'FISH_AND_SEAFOOD',
    'VEGETABLES',
    'FRUITS',
    'GRAINS_AND_CEREALS',
    'NUTS_AND_SEEDS',
    'SWEETS_AND_SPREADS',
    'PREPARED_MEALS',
    'OTHER',
  ];

  if (validCategories.includes(normalized as ProductCategoryApi)) {
    return normalized as ProductCategoryApi;
  }

  for (const [key, label] of Object.entries(PRODUCT_CATEGORY_LABELS)) {
    if (label.toLowerCase() === clean.toLowerCase()) {
      return key as ProductCategoryApi;
    }
  }

  const lower = clean.toLowerCase();
  if (lower.includes('dairy') || lower.includes('cheese') || lower.includes('milk')) return 'DAIRY_AND_CHEESE';
  if (lower.includes('meat') || lower.includes('poultry') || lower.includes('chicken') || lower.includes('beef')) return 'MEAT_AND_POULTRY';
  if (lower.includes('fish') || lower.includes('seafood')) return 'FISH_AND_SEAFOOD';
  if (lower.includes('veg') || lower.includes('salad')) return 'VEGETABLES';
  if (lower.includes('fruit') || lower.includes('berry')) return 'FRUITS';
  if (lower.includes('grain') || lower.includes('cereal') || lower.includes('bread') || lower.includes('rice') || lower.includes('porridge')) return 'GRAINS_AND_CEREALS';
  if (lower.includes('nut') || lower.includes('seed')) return 'NUTS_AND_SEEDS';
  if (lower.includes('sweet') || lower.includes('dessert') || lower.includes('snack')) return 'SWEETS_AND_SPREADS';
  if (lower.includes('meal') || lower.includes('dish') || lower.includes('recipe')) return 'PREPARED_MEALS';

  return 'OTHER';
}

export function mapProductDtoToFoodItem(dto: ProductDto): FoodItem {
  return {
    id: String(dto.id),
    name: dto.name,
    category: PRODUCT_CATEGORY_LABELS[dto.category] || dto.category,
    caloriesPer100g: Number(dto.caloriesPer100g) || 0,
    proteinPer100g: Number(dto.proteinPer100g) || 0,
    carbsPer100g: Number(dto.carbsPer100g) || 0,
    fatsPer100g: Number(dto.fatsPer100g) || 0,
  };
}

export function mapRecipeSummaryDtoToFoodItem(dto: RecipeSummaryDto): FoodItem {
  return {
    id: `recipe_${dto.id}`,
    name: dto.name,
    category: formatRecipeCategory(dto.category),
    caloriesPer100g: Number(dto.caloriesPer100g) || 0,
    proteinPer100g: Number(dto.proteinPer100g) || 0,
    carbsPer100g: Number(dto.carbsPer100g) || 0,
    fatsPer100g: Number(dto.fatsPer100g) || 0,
    rawWeight: dto.rawWeight,
    cookedWeight: dto.cookedWeight,
  };
}

export function mapRecipeDtoToFoodItem(dto: RecipeDto): FoodItem {
  return {
    id: `recipe_${dto.id}`,
    name: dto.name,
    category: formatRecipeCategory(dto.category),
    caloriesPer100g: Number(dto.caloriesPer100g) || 0,
    proteinPer100g: Number(dto.proteinPer100g) || 0,
    carbsPer100g: Number(dto.carbsPer100g) || 0,
    fatsPer100g: Number(dto.fatsPer100g) || 0,
    rawWeight: dto.rawWeight,
    cookedWeight: dto.cookedWeight,
    ingredients: (dto.ingredients || []).map((ing) => ({
      foodItemId: String(ing.foodItemId),
      name: ing.name,
      weight: ing.weight,
      calories: Number(ing.caloriesPer100g) || 0,
      protein: Number(ing.proteinPer100g) || 0,
      carbs: Number(ing.carbsPer100g) || 0,
      fats: Number(ing.fatsPer100g) || 0,
    })),
  };
}

export function mapFoodItemToCreateRecipeDto(
  recipe: FoodItem,
  servings = 1
): CreateRecipeDto {
  const ingredients = (recipe.ingredients || []).map((ing) => {
    const rawId = String(ing.foodItemId).replace(/\D/g, '');
    const numId = Number(rawId) || 1;
    return {
      foodItemId: numId,
      name: ing.name,
      weight: Number(ing.weight) || 100,
      caloriesPer100g: Number(ing.calories) || 0,
      proteinPer100g: Number(ing.protein) || 0,
      carbsPer100g: Number(ing.carbs) || 0,
      fatsPer100g: Number(ing.fats) || 0,
    };
  });

  return {
    name: recipe.name.trim(),
    category: recipe.category || 'RECIPE',
    description: '',
    servings: Math.max(1, servings),
    rawWeight: recipe.rawWeight || 100,
    cookedWeight: recipe.cookedWeight || recipe.rawWeight || 100,
    caloriesPer100g: Number(recipe.caloriesPer100g.toFixed(1)),
    proteinPer100g: Number(recipe.proteinPer100g.toFixed(1)),
    carbsPer100g: Number(recipe.carbsPer100g.toFixed(1)),
    fatsPer100g: Number(recipe.fatsPer100g.toFixed(1)),
    ingredients,
  };
}

export const FRONTEND_TO_API_MEAL_MAP: Record<MealType, MealTypeApi> = {
  [MEAL_TYPE.BREAKFAST]: 'BREAKFAST',
  [MEAL_TYPE.LUNCH]: 'LUNCH',
  [MEAL_TYPE.DINNER]: 'DINNER',
  [MEAL_TYPE.SNACKS]: 'SNACK',
};

export const API_TO_FRONTEND_MEAL_MAP: Record<MealTypeApi, MealType> = {
  BREAKFAST: MEAL_TYPE.BREAKFAST,
  LUNCH: MEAL_TYPE.LUNCH,
  DINNER: MEAL_TYPE.DINNER,
  SNACK: MEAL_TYPE.SNACKS,
  DESSERT: MEAL_TYPE.SNACKS,
};

export function mapMealTypeToApiMealType(mealType: string): MealTypeApi {
  const normalized = mealType.trim().toLowerCase() as MealType;
  if (normalized in FRONTEND_TO_API_MEAL_MAP) {
    return FRONTEND_TO_API_MEAL_MAP[normalized];
  }
  return 'SNACK';
}

export function mapApiMealTypeToFrontend(apiMealType?: string | null): MealType {
  if (!apiMealType) return MEAL_TYPE.SNACKS;
  const upper = apiMealType.trim().toUpperCase() as MealTypeApi;
  if (upper in API_TO_FRONTEND_MEAL_MAP) {
    return API_TO_FRONTEND_MEAL_MAP[upper];
  }
  return MEAL_TYPE.SNACKS;
}

export function mapDiaryFoodEntryDtoToFoodEntry(dto: DiaryFoodEntryDto): FoodEntry {
  return {
    id: String(dto.id),
    foodItemId: String(dto.id),
    name: dto.name,
    mealType: mapApiMealTypeToFrontend(dto.mealType),
    timestamp: Date.now(),
    weightGrams: dto.weightGrams,
    calories: dto.calories,
    protein: dto.protein,
    carbs: dto.carbs,
    fats: dto.fats,
  };
}

export function mapDiaryExerciseEntryDtoToExerciseEntry(dto: DiaryExerciseEntryDto): ExerciseEntry {
  return {
    id: String(dto.id),
    activityType: dto.name,
    metric: dto.durationMinutes,
    metricLabel: 'minutes',
    caloriesBurned: dto.caloriesBurned,
    timestamp: Date.now(),
    met: 0,
    intensity: 'medium',
  };
}

export function buildFoodEntryRequest(
  food: FoodItem,
  weightGrams: number,
  mealType: MealType,
  selectedDate: string
): FoodEntryRequestDto {
  const isRecipe = food.id.startsWith('recipe_');
  const isCustom = food.id.startsWith('custom_');

  let sourceType: SourceTypeApi = 'PRODUCT';
  let productId: number | undefined;
  let recipeId: number | undefined;
  let customName: string | undefined;
  let customCalories: number | undefined;
  let customProtein: number | undefined;
  let customCarbs: number | undefined;
  let customFat: number | undefined;

  const calculateCustomMacros = () => {
    customName = food.name;
    customCalories = Math.round((food.caloriesPer100g * weightGrams) / 100);
    customProtein = Number(((food.proteinPer100g * weightGrams) / 100).toFixed(1));
    customCarbs = Number(((food.carbsPer100g * weightGrams) / 100).toFixed(1));
    customFat = Number(((food.fatsPer100g * weightGrams) / 100).toFixed(1));
  };

  if (isRecipe) {
    const rawRecipeId = Number(food.id.replace('recipe_', ''));
    if (!isNaN(rawRecipeId) && rawRecipeId > 0) {
      sourceType = 'RECIPE';
      recipeId = rawRecipeId;
    } else {
      sourceType = 'CUSTOM';
      calculateCustomMacros();
    }
  } else if (isCustom) {
    sourceType = 'CUSTOM';
    calculateCustomMacros();
  } else {
    const rawProductId = Number(food.id);
    if (!isNaN(rawProductId) && rawProductId > 0) {
      sourceType = 'PRODUCT';
      productId = rawProductId;
    } else {
      sourceType = 'CUSTOM';
      calculateCustomMacros();
    }
  }

  const now = new Date();
  const isToday = selectedDate === now.toISOString().split('T')[0];
  const loggedAt = isToday
    ? new Date(Date.now() - 60000).toISOString()
    : `${selectedDate}T12:00:00.000Z`;

  return {
    sourceType,
    productId,
    recipeId,
    customName,
    customCalories,
    customProtein,
    customCarbs,
    customFat,
    quantity: weightGrams,
    mealType: FRONTEND_TO_API_MEAL_MAP[mealType] || 'SNACK',
    loggedAt,
  };
}

// Extracts items from PageResponse or raw array
export function extractApiItems<T>(rawData: unknown): T[] {
  if (Array.isArray(rawData)) return rawData as T[];
  if (
    typeof rawData === 'object' &&
    rawData !== null &&
    'content' in rawData &&
    Array.isArray((rawData as { content: unknown }).content)
  ) {
    return (rawData as { content: T[] }).content;
  }
  return [];
}

// Maps ActivityDto to ActivityConstant
export function mapActivityDtoToActivityConstant(dto: ActivityDto): ActivityConstant {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.category,
    primaryMuscles: dto.primaryMuscles,
    metricLabel: 'minutes',
    met: dto.met,
    kcalPerUnit: Math.round(((dto.met * 3.5 * 70) / 200) * 10) / 10,
  };
}
