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

  /**
   * Fetches all products across all pages from the backend REST API.
   * Requests page 0 with size=1000. If the backend caps page size (totalPages > 1),
   * fetches remaining pages in parallel so that 100% of products are loaded.
   */
  async getAllProducts(pageSize = 1000): Promise<ApiResponse<ProductDto[]>> {
    const firstRes = await this.getProducts({ page: 0, size: pageSize });
    if (!firstRes.ok || !firstRes.data) {
      return {
        ok: false,
        status: firstRes.status,
        error: firstRes.error,
        errors: firstRes.errors,
      };
    }

    const firstPage = firstRes.data;
    const allItems: ProductDto[] = Array.isArray(firstPage)
      ? [...firstPage]
      : Array.isArray(firstPage.content)
        ? [...firstPage.content]
        : [];

    const totalPages =
      firstPage && typeof firstPage === 'object' && 'totalPages' in firstPage
        ? Number(firstPage.totalPages) || 1
        : 1;

    if (totalPages > 1) {
      const pagePromises: Promise<ApiResponse<PageResponse<ProductDto>>>[] = [];
      for (let p = 1; p < totalPages; p++) {
        pagePromises.push(this.getProducts({ page: p, size: pageSize }));
      }

      const subsequentPages = await Promise.allSettled(pagePromises);
      for (const pageRes of subsequentPages) {
        if (pageRes.status === 'fulfilled' && pageRes.value.ok && pageRes.value.data) {
          const pageData = pageRes.value.data;
          const items: ProductDto[] = Array.isArray(pageData)
            ? pageData
            : Array.isArray(pageData.content)
              ? pageData.content
              : [];
          allItems.push(...items);
        }
      }
    }

    return {
      ok: true,
      status: firstRes.status,
      data: allItems,
    };
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
