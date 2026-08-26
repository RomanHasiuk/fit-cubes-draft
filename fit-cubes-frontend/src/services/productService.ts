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
  /**
   * Fetches all products from backend DB.
   * Maps to Spring Boot GET /api/v1/products (KAN-43, KAN-47).
   */
  async getProducts(): Promise<ApiResponse<FoodItem[]>> {
    return apiClient.get<FoodItem[]>('/products');
  },

  /**
   * Search products with optional category filter.
   */
  async searchProducts(query: string, category?: string): Promise<ApiResponse<FoodItem[]>> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category && category !== 'All') params.append('category', category);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<FoodItem[]>(`/products/search${queryString}`);
  },

  /**
   * Creates a custom user food item in the database.
   * Maps to Spring Boot POST /api/v1/products.
   */
  async createProduct(payload: CreateProductPayload): Promise<ApiResponse<FoodItem>> {
    return apiClient.post<FoodItem>('/products', payload);
  },

  /**
   * Updates an existing product.
   */
  async updateProduct(id: string, payload: Partial<CreateProductPayload>): Promise<ApiResponse<FoodItem>> {
    return apiClient.put<FoodItem>(`/products/${id}`, payload);
  },

  /**
   * Deletes a custom product.
   */
  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/products/${id}`);
  },
};
