import { apiClient, type ApiResponse } from './apiClient';
import type { DayLog, FoodEntry, ExerciseEntry } from '@/types';

export const diaryService = {
  async getDayLog(date: string): Promise<ApiResponse<DayLog>> {
    return apiClient.get<DayLog>(`/diary/${date}`);
  },

  async addFoodEntry(date: string, entry: Omit<FoodEntry, 'id'>): Promise<ApiResponse<FoodEntry>> {
    return apiClient.post<FoodEntry>(`/diary/${date}/food`, entry);
  },

  async removeFoodEntry(date: string, entryId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/diary/${date}/food/${entryId}`);
  },

  async addExerciseEntry(date: string, entry: Omit<ExerciseEntry, 'id'>): Promise<ApiResponse<ExerciseEntry>> {
    return apiClient.post<ExerciseEntry>(`/diary/${date}/exercise`, entry);
  },

  async removeExerciseEntry(date: string, entryId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/diary/${date}/exercise/${entryId}`);
  },
};
