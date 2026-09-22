import { apiClient, type ApiResponse } from './apiClient';
import type {
  ProductDto,
  CreateProductDto,
  UpdateProductDto,
  PageResponse,
  PageQueryParams,
} from '@/types/api';

export const productService = {
  async getProducts(params?: PageQueryParams): Promise<ApiResponse<PageResponse<ProductDto>>> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', String(params.page));
    if (params?.size !== undefined) searchParams.append('size', String(params.size));
    if (params?.sort) searchParams.append('sort', params.sort);

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get<PageResponse<ProductDto>>(`/products${queryString}`);
  },

  async getProductById(id: number | string): Promise<ApiResponse<ProductDto>> {
    return apiClient.get<ProductDto>(`/products/${id}`);
  },

  async createProduct(payload: CreateProductDto): Promise<ApiResponse<ProductDto>> {
    const safePayload: CreateProductDto = {
      name: payload.name.trim(),
      category: payload.category,
      caloriesPer100g: Number(payload.caloriesPer100g) || 0,
      fatsPer100g: Number(payload.fatsPer100g) || 0,
      carbsPer100g: Number(payload.carbsPer100g) || 0,
      proteinPer100g: Number(payload.proteinPer100g) || 0,
    };
    return apiClient.post<ProductDto>('/products', safePayload);
  },

  async updateProduct(
    id: number | string,
    payload: UpdateProductDto
  ): Promise<ApiResponse<ProductDto>> {
    return apiClient.patch<ProductDto>(`/products/${id}`, payload);
  },

  async deleteProduct(id: number | string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/products/${id}`);
  },
};
