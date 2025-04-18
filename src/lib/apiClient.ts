const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...restOptions } = options;
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : '';
    const url = `${API_BASE_URL}${endpoint}${queryString}`;

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers: {
          'Content-Type': 'application/json',
          ...restOptions.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
} 