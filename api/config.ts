// API Configuration
// Note: This will be overridden by the environment config in src/config/env.ts
export const API_CONFIG = {
  BASE_URL: '/api', // Use relative path for Vite proxy
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    PROFILE: '/users/profile/me',
  },
  
  // User endpoints
  USERS: {
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE_AVATAR: '/users/profile/avatar',
    UPDATE_PROFILE: '/users/profile',
    ALL: '/users'
  },
  

  
  // Post endpoints
  POSTS: {
    ALL: '/posts',
    BY_ID: (id: string) => `/posts/${id}`,
    BY_USER: (userId: string) => `/posts/user/${userId}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    VOTE: (id: string) => `/posts/${id}/vote`,
  },
  
  // Comment endpoints
  COMMENTS: {
    ALL: '/comments',
    BY_ID: (id: string) => `/comments/${id}`,
    BY_POST: (postId: string) => `/comments/post/${postId}`,
    BY_USER: (userId: string) => `/comments/user/${userId}`,
    VOTE: (id: string) => `/comments/${id}/vote`,
  },
  
  // Leaderboard endpoint
  LEADERBOARD: '/posts/leaderboard',
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const;
