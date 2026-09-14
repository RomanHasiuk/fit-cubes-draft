import { apiClient, type ApiResponse } from './apiClient';
import type { FoodItem } from '@/types';

export interface CreateProductPayload {
  name: string;
  category: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatsPer100g: number;
  rawWeight?: number;
  cookedWeight?: number;
}

export const productService = {
  async getProducts(): Promise<ApiResponse<FoodItem[]>> {
    return apiClient.get<FoodItem[]>('/products');
  },

  async searchProducts(query: string, category?: string): Promise<ApiResponse<FoodItem[]>> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category && category !== 'All') params.append('category', category);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<FoodItem[]>(`/products/search${queryString}`);
  },

  async createProduct(payload: CreateProductPayload): Promise<ApiResponse<FoodItem>> {
    return apiClient.post<FoodItem>('/products', payload);
  },

  async updateProduct(id: string, payload: Partial<CreateProductPayload>): Promise<ApiResponse<FoodItem>> {
    return apiClient.patch<FoodItem>(`/products/${id}`, payload);
  },

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/products/${id}`);
  },
};
