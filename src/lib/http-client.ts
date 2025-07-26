// HTTP client with automatic token refresh
import { useUserStore } from '@/stores/user-store';

interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

class HttpClient {
  private baseURL = 'http://192.168.100.108:7000/api/v1';

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { getValidToken } = useUserStore.getState();
    const token = getValidToken();
    
    return {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async makeRequest(config: RequestConfig): Promise<Response> {
    const { url, method = 'GET', body, headers = {}, requiresAuth = true } = config;
    
    const requestHeaders = requiresAuth 
      ? { ...await this.getAuthHeaders(), ...headers }
      : { 'Content-Type': 'application/json', 'accept': 'application/json', ...headers };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    return fetch(`${this.baseURL}${url}`, requestConfig);
  }

  async get(url: string, requiresAuth = true): Promise<Response> {
    return this.makeRequest({ url, method: 'GET', requiresAuth });
  }

  async post(url: string, body?: any, requiresAuth = true): Promise<Response> {
    return this.makeRequest({ url, method: 'POST', body, requiresAuth });
  }

  async put(url: string, body?: any, requiresAuth = true): Promise<Response> {
    return this.makeRequest({ url, method: 'PUT', body, requiresAuth });
  }

  async patch(url: string, body?: any, requiresAuth = true): Promise<Response> {
    return this.makeRequest({ url, method: 'PATCH', body, requiresAuth });
  }

  async delete(url: string, body?: any, requiresAuth = true): Promise<Response> {
    return this.makeRequest({ url, method: 'DELETE', body, requiresAuth });
  }
}

export const httpClient = new HttpClient();

// Utility function for handling API responses
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Generic API call wrapper
export const apiCall = async <T>(
  requestFn: () => Promise<Response>,
  errorMessage = 'API call failed'
): Promise<T> => {
  try {
    const response = await requestFn();
    return await handleApiResponse<T>(response);
  } catch (error) {
    console.error(errorMessage, error);
    throw error instanceof Error ? error : new Error(errorMessage);
  }
};
