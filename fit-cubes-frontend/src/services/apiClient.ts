export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  errors?: string[];
  status: number;
  ok: boolean;
}

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

class ApiClient {
  private getAuthToken(): string | null {
    try {
      return localStorage.getItem('fitcubes_auth_token') || localStorage.getItem('token');
    } catch {
      return null;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${cleanEndpoint}`;
    const isPublicAuthEndpoint =
      cleanEndpoint.startsWith('/auth/login') ||
      cleanEndpoint.startsWith('/auth/register');
    const token = isPublicAuthEndpoint ? null : this.getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      let data: T | undefined;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      let errorMessage: string | undefined;
      let fieldErrors: string[] | undefined;

      if (!response.ok) {
        const errPayload = data as { message?: string; errors?: string[] } | undefined;
        if (errPayload?.errors && Array.isArray(errPayload.errors) && errPayload.errors.length > 0) {
          fieldErrors = errPayload.errors;
          errorMessage = errPayload.errors.join('; ');
        } else if (errPayload?.message) {
          errorMessage = errPayload.message;
        } else {
          errorMessage = `HTTP error ${response.status}`;
        }
      }

      return {
        data,
        status: response.status,
        ok: response.ok,
        error: errorMessage,
        errors: fieldErrors,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network request failed';
      console.warn(`[ApiClient] Request to ${url} failed (Backend might be offline):`, errorMessage);
      return {
        status: 0,
        ok: false,
        error: errorMessage,
      };
    }
  }

  public get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
