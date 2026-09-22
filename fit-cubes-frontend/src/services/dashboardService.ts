import { apiClient, type ApiResponse } from './apiClient';
import type { DailySummaryDto, PredictedWeightChangeDto } from '@/types/api';

export interface DateRangeParams {
  from: string;
  to: string;
}

export const dashboardService = {
  async getDailySummary(params: DateRangeParams): Promise<ApiResponse<DailySummaryDto>> {
    const searchParams = new URLSearchParams({
      from: params.from,
      to: params.to,
    });
    return apiClient.get<DailySummaryDto>(`/dashboard/daily-summary?${searchParams.toString()}`);
  },

  async getPredictedWeightChange(
    params: DateRangeParams
  ): Promise<ApiResponse<PredictedWeightChangeDto>> {
    const searchParams = new URLSearchParams({
      from: params.from,
      to: params.to,
    });
    return apiClient.get<PredictedWeightChangeDto>(
      `/dashboard/predicted-weight-change?${searchParams.toString()}`
    );
  },
};
