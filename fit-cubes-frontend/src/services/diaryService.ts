import { apiClient, type ApiResponse } from './apiClient';
import type { DayLog, FoodEntry, ExerciseEntry } from '@/types';

export const diaryService = {
  /**
   * Fetches the complete daily log for a specific date (YYYY-MM-DD).
   * Maps to Spring Boot GET /api/v1/diary/{date} (KAN-42, KAN-48).
   */
  async getDayLog(date: string): Promise<ApiResponse<DayLog>> {
    return apiClient.get<DayLog>(`/diary/${date}`);
  },

  /**
   * Adds a food entry to a specific day's log.
   * Maps to Spring Boot POST /api/v1/diary/{date}/food.
   */
  async addFoodEntry(date: string, entry: Omit<FoodEntry, 'id'>): Promise<ApiResponse<FoodEntry>> {
    return apiClient.post<FoodEntry>(`/diary/${date}/food`, entry);
  },

  /**
   * Removes a food entry from a specific day.
   * Maps to Spring Boot DELETE /api/v1/diary/{date}/food/{entryId}.
   */
  async removeFoodEntry(date: string, entryId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/diary/${date}/food/${entryId}`);
  },

  /**
   * Logs an exercise/activity session for a specific day.
   * Maps to Spring Boot POST /api/v1/diary/{date}/exercise (KAN-45).
   */
  async addExerciseEntry(date: string, entry: Omit<ExerciseEntry, 'id'>): Promise<ApiResponse<ExerciseEntry>> {
    return apiClient.post<ExerciseEntry>(`/diary/${date}/exercise`, entry);
  },

  /**
   * Removes an exercise entry from a specific day.
   * Maps to Spring Boot DELETE /api/v1/diary/{date}/exercise/{entryId}.
   */
  async removeExerciseEntry(date: string, entryId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/diary/${date}/exercise/${entryId}`);
  },
};
