/**
 * FitCubes Backend REST API Data Transfer Objects (DTOs) & Contracts
 */

// ─── Core API Enums ─────────────────────────────────────────────────────────────

export type GenderApi = 'MALE' | 'FEMALE';
export type GoalApi = 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'MAINTENANCE';
export type DietStrategyApi = 'BALANCED' | 'LOW_CARB' | 'KETO';

export type ProductCategoryApi =
  | 'DAIRY_AND_CHEESE'
  | 'MEAT_AND_POULTRY'
  | 'FISH_AND_SEAFOOD'
  | 'VEGETABLES'
  | 'FRUITS'
  | 'GRAINS_AND_CEREALS'
  | 'NUTS_AND_SEEDS'
  | 'SWEETS_AND_SPREADS'
  | 'PREPARED_MEALS'
  | 'OTHER';

export type ExerciseCategoryApi = 'CARDIO' | 'STRENGTH' | 'YOGA' | 'HIIT';

export type SourceTypeApi = 'PRODUCT' | 'RECIPE' | 'CUSTOM';
export type MealTypeApi =
  'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'DESSERT';

// ─── Spring Data Pagination ─────────────────────────────────────────────────────

export interface PageableSort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface PageableObject {
  pageNumber: number;
  pageSize: number;
  sort: PageableSort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageable?: PageableObject;
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  numberOfElements?: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface PageQueryParams {
  page?: number;
  size?: number;
  sort?: string;
}

// ─── User Profile DTOs ───────────────────────────────────────────────────────────

export interface UserMacroTargetsDto {
  calories: number | null;
  proteinGrams: number | null;
  carbsGrams: number | null;
  fatsGrams: number | null;
}

export interface UserProfileDto {
  id: number;
  email: string;
  name: string | null;
  weightKg: number | null;
  heightCm: number | null;
  activityFactor: number | null;
  dietStrategy: DietStrategyApi | null;
  macroTargets: UserMacroTargetsDto | null;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  gender?: GenderApi;
  age?: number;
  height?: number;
  currentWeight?: number;
  targetWeight?: number;
  activityLevel?: number;
  goal?: GoalApi;
  dietStrategy?: DietStrategyApi;
  proteinTargetGrams?: number;
  carbsTargetGrams?: number;
  fatsTargetGrams?: number;
}

// ─── Product DTOs ───────────────────────────────────────────────────────────────

export interface ProductDto {
  id: number;
  name: string;
  category: ProductCategoryApi;
  caloriesPer100g: number;
  fatsPer100g: number;
  carbsPer100g: number;
  proteinPer100g: number;
  proteinCaloriesPer100g?: number;
}

export interface CreateProductDto {
  name: string;
  category: ProductCategoryApi;
  caloriesPer100g: number;
  fatsPer100g: number;
  carbsPer100g: number;
  proteinPer100g: number;
}

export type UpdateProductDto = Partial<CreateProductDto>;

// ─── Recipe DTOs ────────────────────────────────────────────────────────────────

export interface RecipeIngredientDto {
  id?: number;
  foodItemId: number;
  name: string;
  weight: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatsPer100g: number;
  proteinCaloriesPer100g?: number;
}

export interface RecipeSummaryDto {
  id: number;
  userId: number | null;
  name: string;
  category: string;
  servings: number;
  rawWeight: number;
  cookedWeight: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatsPer100g: number;
  ingredientsCount: number;
}

export interface RecipeDto extends RecipeSummaryDto {
  description?: string;
  proteinCaloriesPer100g?: number;
  ingredients: RecipeIngredientDto[];
}

export interface CreateRecipeDto {
  name: string;
  category: string;
  description?: string;
  servings: number;
  rawWeight: number;
  cookedWeight: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatsPer100g: number;
  ingredients: Array<
    Omit<RecipeIngredientDto, 'id' | 'proteinCaloriesPer100g'>
  >;
}

export type UpdateRecipeDto = Partial<CreateRecipeDto>;

// ─── Diary & Food Entries DTOs ──────────────────────────────────────────────────

export interface DiaryFoodEntryDto {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  weightGrams: number;
  mealType: string;
}

export interface DiaryExerciseEntryDto {
  id: number;
  name: string;
  caloriesBurned: number;
  durationMinutes: number;
}

export interface DiaryResponseDto {
  date: string;
  foodEntries: DiaryFoodEntryDto[];
  exerciseEntries: DiaryExerciseEntryDto[];
}

export interface FoodEntryRequestDto {
  sourceType: SourceTypeApi;
  productId?: number;
  recipeId?: number;
  customName?: string;
  customCalories?: number;
  customProtein?: number;
  customCarbs?: number;
  customFat?: number;
  quantity: number;
  mealType: MealTypeApi;
  loggedAt: string;
  label?: string;
}

export interface FoodEntryResponseDto {
  id: number;
  sourceType: SourceTypeApi;
  productId: number | null;
  recipeId: number | null;
  nameSnapshot: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: MealTypeApi;
  loggedAt: string;
}

// ─── Activities & Exercise Entries DTOs ─────────────────────────────────────────

export interface ActivityDto {
  id: number;
  name: string;
  category: ExerciseCategoryApi;
  primaryMuscles: string;
  met: number;
}

export interface ExerciseEntryRequestDto {
  exerciseId: number;
  durationMinutes: number;
  loggedAt: string;
}

export interface ExerciseEntryResponseDto {
  id: number;
  exerciseId: number;
  nameSnapshot: string;
  durationMinutes: number;
  caloriesBurned: number;
  loggedAt: string;
}

// ─── Weight Logs & Dashboard DTOs ───────────────────────────────────────────────

export interface WeightLogRequestDto {
  weight: number;
  loggedAt: string;
}

export interface WeightLogResponseDto {
  id: number;
  weight: number;
  loggedAt: string;
}

export interface WeightProgressDto {
  startingWeight: number;
  currentWeight: number;
  targetWeight: number;
  totalChange: number;
  remainingToGoal: number;
}

export interface DailySummaryDto {
  targetCalories: number;
  consumed: number;
  burned: number;
  remaining: number;
}

export interface PredictedWeightChangeDto {
  averageDailyDeficit: number;
  predictedWeeklyChangeKg: number;
}
