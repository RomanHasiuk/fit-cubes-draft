import type { UserProfile } from '@/types';
import type {
  UpdateProfilePayload,
  UserProfileDto,
  GenderApi,
  GoalApi,
  DietStrategyApi,
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
