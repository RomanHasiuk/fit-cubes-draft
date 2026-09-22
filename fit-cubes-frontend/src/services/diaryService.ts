import { apiClient, type ApiResponse } from './apiClient';
import type {
  DiaryResponseDto,
  DiaryFoodEntryDto,
  DiaryExerciseEntryDto,
  FoodEntryRequestDto,
  ExerciseEntryRequestDto,
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

  async removeExerciseEntry(
    date: string,
    entryId: number | string
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/diary/${date}/exercise/${entryId}`);
  },
};
