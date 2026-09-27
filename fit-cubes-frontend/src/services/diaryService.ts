import { apiClient, type ApiResponse } from './apiClient';
import type {
  DiaryResponseDto,
  DiaryFoodEntryDto,
  DiaryExerciseEntryDto,
  FoodEntryRequestDto,
  FoodEntryResponseDto,
  ExerciseEntryRequestDto,
  ExerciseEntryResponseDto,
} from '@/types/api';

export const diaryService = {
  async getDayLog(date: string): Promise<ApiResponse<DiaryResponseDto>> {
    return apiClient.get<DiaryResponseDto>(`/diary/${date}`);
  },

  async addFoodEntry(
    date: string,
    entry: FoodEntryRequestDto
  ): Promise<ApiResponse<DiaryFoodEntryDto>> {
    return apiClient.post<DiaryFoodEntryDto>(`/diary/${date}/food`, entry);
  },

  async patchFoodEntry(
    entryId: number | string,
    entry: FoodEntryRequestDto
  ): Promise<ApiResponse<FoodEntryResponseDto>> {
    return apiClient.patch<FoodEntryResponseDto>(`/food-entries/${entryId}`, entry);
  },

  async removeFoodEntry(
    date: string,
    entryId: number | string
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/diary/${date}/food/${entryId}`);
  },

  async addExerciseEntry(
    date: string,
    entry: ExerciseEntryRequestDto
  ): Promise<ApiResponse<DiaryExerciseEntryDto>> {
    return apiClient.post<DiaryExerciseEntryDto>(`/diary/${date}/exercise`, entry);
  },

  async patchExerciseEntry(
    entryId: number | string,
    entry: ExerciseEntryRequestDto
  ): Promise<ApiResponse<ExerciseEntryResponseDto>> {
    return apiClient.patch<ExerciseEntryResponseDto>(`/exercise-entries/${entryId}`, entry);
  },

  async removeExerciseEntry(
    date: string,
    entryId: number | string
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/diary/${date}/exercise/${entryId}`);
  },
};
