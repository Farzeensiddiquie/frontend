import { toast } from 'sonner';
import { store } from '../store/store';
import { selectToken } from '../store/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Get auth headers
const getAuthHeaders = (token?: string) => {
  const authToken = token ?? selectToken(store.getState());
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

// Generic API request for JSON endpoints
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...getAuthHeaders(token),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  // Registration (FormData)
  register: async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      body: formData, 
      credentials: 'include',// ✅ Do NOT set Content-Type manually for FormData
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }

    return res.json();
  },

  // Login (JSON)
  login: (credentials: { email: string; password: string }) =>
    apiRequest<{ user: any; accessToken: string }>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  // Logout
  logout: (token?: string) =>
    token
      ? apiRequest('/users/logout', { method: 'POST' }, token)
      : Promise.resolve(),

  // Get profile
  getProfile: (token?: string) =>
    apiRequest('/users/profile/me', { method: 'GET' }, token),

  // Update profile (JSON)
  updateProfile: (profileData: any, token?: string) =>
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }, token),

  // Update avatar (FormData)
  updateAvatar: async (formData: FormData, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/users/profile/avatar`, {
      method: 'PUT',
      body: formData,
      headers: getAuthHeaders(token), // ✅ No Content-Type
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Avatar update failed');
    }

    return res.json();
  },
};

// Generic error handling wrapper
export const withErrorHandling = <T extends any[], R>(fn: (...args: T) => Promise<R>) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toast.error(message);
      throw err;
    }
  };
};

// Wrap auth API for error handling
export const api = {
  auth: {
    register: withErrorHandling(authAPI.register),
    login: withErrorHandling(authAPI.login),
    logout: withErrorHandling(authAPI.logout),
    getProfile: withErrorHandling(authAPI.getProfile),
    updateProfile: withErrorHandling(authAPI.updateProfile),
    updateAvatar: withErrorHandling(authAPI.updateAvatar),
  },
};
