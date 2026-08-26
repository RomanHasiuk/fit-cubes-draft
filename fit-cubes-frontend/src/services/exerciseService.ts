import { apiClient, type ApiResponse } from './apiClient';
import type { ActivityConstant } from '@/types';

export interface CreateExercisePayload {
  name: string;
  category: 'cardio' | 'strength' | 'bodyweight' | 'other' | string;
  met: number;
  metricLabel: string;
  defaultMetric: number;
}

export const exerciseService = {
  /**
   * Fetches the complete catalog of physical activities and exercises from the DB.
   * Maps to Spring Boot GET /api/v1/activities (KAN-11, KAN-45).
   */
  async getActivities(): Promise<ApiResponse<ActivityConstant[]>> {
    return apiClient.get<ActivityConstant[]>('/activities');
  },

  /**
   * Search activities by name or category.
   */
  async searchActivities(query: string, category?: string): Promise<ApiResponse<ActivityConstant[]>> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category && category !== 'All') params.append('category', category);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<ActivityConstant[]>(`/activities/search${queryString}`);
  },

  /**
   * Creates a custom exercise or activity in the database.
   * Maps to Spring Boot POST /api/v1/activities (KAN-45).
   */
  async createActivity(payload: CreateExercisePayload): Promise<ApiResponse<ActivityConstant>> {
    return apiClient.post<ActivityConstant>('/activities', payload);
  },

  /**
   * Updates an existing custom activity.
   */
  async updateActivity(id: string, payload: Partial<CreateExercisePayload>): Promise<ApiResponse<ActivityConstant>> {
    return apiClient.put<ActivityConstant>(`/activities/${id}`, payload);
  },

  /**
   * Deletes a custom activity.
   */
  async deleteActivity(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/activities/${id}`);
  },
};
