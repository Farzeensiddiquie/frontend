import { API_CONFIG, CONTENT_TYPES } from '../config';
import { ENV_CONFIG } from '../../src/config/env';
import { ApiError, ApiResponse } from '../types';

class HttpClient {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;

  constructor() {
    this.baseURL = ENV_CONFIG.API_BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Only set default Content-Type if not already set and not FormData
    const defaultHeaders: HeadersInit = {};
    if (!options.headers?.['Content-Type'] && (!options.body || !(options.body instanceof FormData))) {
      defaultHeaders['Content-Type'] = CONTENT_TYPES.JSON;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              console.log('API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                errorData: errorData
              });
              throw new ApiError(
                errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                response.status,
                errorData.code,
                errorData
              );
            }

      const data = await response.json();
      return {
        data,
        success: true,
        status: response.status,
        message: data.message,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Retry logic for network errors
      if (attempt < this.retryAttempts && this.isRetryableError(error)) {
        await this.delay(1000 * attempt); // Exponential backoff
        return this.makeRequest<T>(endpoint, options, attempt + 1);
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout', 408);
        }
        throw new ApiError(error.message, 0);
      }

      throw new ApiError('Unknown error occurred', 0);
    }
  }

  private isRetryableError(error: unknown): boolean {
    return (
      error instanceof TypeError ||
      (error instanceof Error && (error.name === 'NetworkError' || error.name === 'AbortError'))
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET request
  async get<T>(endpoint: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET', headers });
  }

  // POST request
  async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const contentType = data instanceof FormData ? undefined : CONTENT_TYPES.JSON;
    
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body,
      headers: {
        ...headers,
        ...(contentType && { 'Content-Type': contentType }),
      },
    });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const contentType = data instanceof FormData ? undefined : CONTENT_TYPES.JSON;
    
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body,
      headers: {
        ...headers,
        ...(contentType && { 'Content-Type': contentType }),
      },
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE', headers });
  }

  // PATCH request
  async patch<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const contentType = data instanceof FormData ? undefined : CONTENT_TYPES.JSON;
    
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body,
      headers: {
        ...headers,
        ...(contentType && { 'Content-Type': contentType }),
      },
    });
  }
}

// Create and export a singleton instance
export const httpClient = new HttpClient();

// Export the class for testing purposes
export { HttpClient };
