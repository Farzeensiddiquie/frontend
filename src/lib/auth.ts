import { User } from './api';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Auth utilities
export const getStoredAuth = (): AuthState => {
  try {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    
    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error parsing stored auth:', error);
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

export const setStoredAuth = (user: User, token: string): void => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};