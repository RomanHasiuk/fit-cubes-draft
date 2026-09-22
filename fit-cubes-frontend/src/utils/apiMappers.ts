import type { FoodItem, UserProfile, FoodEntry, ExerciseEntry } from '@/types';
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
} from '@/types/api';
import { WEIGHT_GOAL, DIET_TYPE, type WeightGoal, type DietType } from '@/constants';

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
      calories: Math.round((ing.caloriesPer100g * ing.weight) / 100),
      protein: Number(((ing.proteinPer100g * ing.weight) / 100).toFixed(1)),
      carbs: Number(((ing.carbsPer100g * ing.weight) / 100).toFixed(1)),
      fats: Number(((ing.fatsPer100g * ing.weight) / 100).toFixed(1)),
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

export function mapDiaryFoodEntryDtoToFoodEntry(dto: DiaryFoodEntryDto): FoodEntry {
  return {
    id: String(dto.id),
    foodItemId: String(dto.id),
    name: dto.name,
    mealType: dto.mealType.toLowerCase() as FoodEntry['mealType'],
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
  mealType: string,
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

  if (isRecipe) {
    sourceType = 'RECIPE';
    recipeId = Number(food.id.replace('recipe_', '')) || undefined;
  } else if (isCustom) {
    sourceType = 'CUSTOM';
    customName = food.name;
    customCalories = Math.round((food.caloriesPer100g * weightGrams) / 100);
    customProtein = Number(((food.proteinPer100g * weightGrams) / 100).toFixed(1));
    customCarbs = Number(((food.carbsPer100g * weightGrams) / 100).toFixed(1));
    customFat = Number(((food.fatsPer100g * weightGrams) / 100).toFixed(1));
  } else {
    sourceType = 'PRODUCT';
    productId = Number(food.id) || undefined;
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
    mealType: mealType.toUpperCase() as MealTypeApi,
    loggedAt,
  };
}
