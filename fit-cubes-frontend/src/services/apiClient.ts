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
      return localStorage.getItem('fitcubes_auth_token');
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
      Accept: 'application/json, application/problem+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    if (options.signal) {
      if (options.signal.aborted) {
        controller.abort();
      } else {
        options.signal.addEventListener('abort', () => controller.abort());
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      let data: T | undefined;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('json')) {
        try {
          data = await response.json();
        } catch {
          data = undefined;
        }
      }

      let errorMessage: string | undefined;
      let fieldErrors: string[] | undefined;

      if (!response.ok) {
        if (response.status === 401 && !isPublicAuthEndpoint) {
          console.warn(`[ApiClient] Received 401 Unauthorized for ${endpoint}. Session expired.`);
          try {
            localStorage.removeItem('fitcubes_auth_token');
            localStorage.removeItem('fitcubes_auth_user');
            window.dispatchEvent(new Event('fitcubes_auth_change'));
          } catch {
            // Ignore localStorage errors
          }
        }

        const errPayload = data as {
          message?: string;
          detail?: string;
          title?: string;
          errors?: string[] | Record<string, string>;
        } | undefined;

        if (errPayload?.errors) {
          if (Array.isArray(errPayload.errors) && errPayload.errors.length > 0) {
            fieldErrors = errPayload.errors;
            errorMessage = errPayload.errors.join('; ');
          } else if (typeof errPayload.errors === 'object') {
            fieldErrors = Object.values(errPayload.errors);
            errorMessage = fieldErrors.join('; ');
          }
        } else if (errPayload?.detail) {
          errorMessage = errPayload.detail;
        } else if (errPayload?.message) {
          errorMessage = errPayload.message;
        } else if (errPayload?.title) {
          errorMessage = errPayload.title;
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
      const isAbort = err instanceof Error && err.name === 'AbortError';
      const errorMessage = isAbort
        ? 'Request timed out after 15 seconds'
        : err instanceof Error
          ? err.message
          : 'Network request failed';
      console.warn(`[ApiClient] Request to ${url} failed (Backend might be offline):`, errorMessage);
      return {
        status: 0,
        ok: false,
        error: errorMessage,
      };
    } finally {
      clearTimeout(timeoutId);
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
