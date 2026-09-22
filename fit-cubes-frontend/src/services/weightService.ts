import { apiClient, type ApiResponse } from './apiClient';
import type { WeightLogRequestDto, WeightLogResponseDto, WeightProgressDto } from '@/types/api';

export const weightService = {
  async logWeight(payload: WeightLogRequestDto): Promise<ApiResponse<WeightLogResponseDto>> {
    return apiClient.post<WeightLogResponseDto>('/weight-logs', payload);
  },

  async getWeightProgress(): Promise<ApiResponse<WeightProgressDto>> {
    return apiClient.get<WeightProgressDto>('/weight-logs/progress');
  },
};
