// ─── Meal Types ───────────────────────────────────────────────
export const MEAL_TYPE = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACKS: 'snacks',
} as const;

/** Union type derived from MEAL_TYPE values — single source of truth */
export type MealType = typeof MEAL_TYPE[keyof typeof MEAL_TYPE];

/** Ordered list of meal types with display labels, used in Diary UI */
export const MEAL_TYPE_OPTIONS: ReadonlyArray<{ key: MealType; label: string }> = [
  { key: MEAL_TYPE.BREAKFAST, label: 'Breakfast' },
  { key: MEAL_TYPE.LUNCH, label: 'Lunch' },
  { key: MEAL_TYPE.DINNER, label: 'Dinner' },
  { key: MEAL_TYPE.SNACKS, label: 'Snacks' },
];

// ─── Gender ───────────────────────────────────────────────────
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
} as const;

/** Union type derived from GENDER values */
export type Gender = typeof GENDER[keyof typeof GENDER];

export const GENDER_OPTIONS: ReadonlyArray<{ id: Gender; label: string; tip: string }> = [
  { id: GENDER.MALE, label: 'Male', tip: 'Calculation using male Mifflin-St Jeor formula (+5 kcal)' },
  { id: GENDER.FEMALE, label: 'Female', tip: 'Calculation using female Mifflin-St Jeor formula (-161 kcal)' },
];

// ─── Weight Goals ─────────────────────────────────────────────
export const WEIGHT_GOAL = {
  LOSE: 'lose',
  MAINTAIN: 'maintain',
  GAIN: 'gain',
} as const;

/** Union type derived from WEIGHT_GOAL values */
export type WeightGoal = typeof WEIGHT_GOAL[keyof typeof WEIGHT_GOAL];

export const WEIGHT_GOAL_OPTIONS: ReadonlyArray<{ id: WeightGoal; label: string; tip: string }> = [
  { id: WEIGHT_GOAL.LOSE, label: 'Loss', tip: 'Deficit: ~15% daily' },
  { id: WEIGHT_GOAL.MAINTAIN, label: 'Maintain', tip: 'Base level: no changes' },
  { id: WEIGHT_GOAL.GAIN, label: 'Gain', tip: 'Surplus: ~15% daily' },
];

// ─── Diet Types ───────────────────────────────────────────────
export const DIET_TYPE = {
  BALANCED: 'balanced',
  LOW_CARB: 'low-carb',
  KETO: 'keto',
  HIGH_PROTEIN: 'high-protein',
} as const;

/** Union type derived from DIET_TYPE values */
export type DietType = typeof DIET_TYPE[keyof typeof DIET_TYPE];

export const DIET_TYPE_OPTIONS: ReadonlyArray<{ id: DietType; label: string; tip: string }> = [
  { id: DIET_TYPE.BALANCED, label: 'Balanced', tip: 'Optimal macronutrient ratio' },
  { id: DIET_TYPE.LOW_CARB, label: 'Low-carb', tip: 'Reduced carbs in favor of protein and fats' },
  { id: DIET_TYPE.KETO, label: 'Keto', tip: 'Minimum carbs, maximum fats' },
];

// ─── Calorie Adjustment Factors ──────────────────────────────
export const CALORIE_ADJUSTMENT = {
  /** -15% for weight loss */
  DEFICIT_FACTOR: 0.85,
  /** +15% for weight gain */
  SURPLUS_FACTOR: 1.15,
} as const;

// ─── Activity Constants ──────────────────────────────────────
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
