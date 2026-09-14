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
  async getActivities(): Promise<ApiResponse<ActivityConstant[]>> {
    return apiClient.get<ActivityConstant[]>('/activities');
  },

  async searchActivities(query: string, category?: string): Promise<ApiResponse<ActivityConstant[]>> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category && category !== 'All') params.append('category', category);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<ActivityConstant[]>(`/activities/search${queryString}`);
  },

  async createActivity(payload: CreateExercisePayload): Promise<ApiResponse<ActivityConstant>> {
    return apiClient.post<ActivityConstant>('/activities', payload);
  },

  async updateActivity(id: string, payload: Partial<CreateExercisePayload>): Promise<ApiResponse<ActivityConstant>> {
    return apiClient.put<ActivityConstant>(`/activities/${id}`, payload);
  },

  async deleteActivity(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/activities/${id}`);
  },
};
