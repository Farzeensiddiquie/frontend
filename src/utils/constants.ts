// Application constants

// API Configuration
export const API_CONSTANTS = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RATE_LIMIT: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 60000, // 1 minute
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  DEFAULT_PAGE: 1,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_AVATAR_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
} as const;

// Validation
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  POST: {
    TITLE_MAX_LENGTH: 200,
    CONTENT_MAX_LENGTH: 10000,
    TAGS_MAX_COUNT: 5,
    TAG_MAX_LENGTH: 20,
  },
  COMMENT: {
    MAX_LENGTH: 2000,
  },
} as const;

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  FEED: '/feed',
  CREATE_POST: '/create',
  EDIT_POST: '/edit',
  POST_DETAIL: '/post',
  PROFILE: '/profile',
  LEADERBOARD: '/leaderboard',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

// Query Keys
export const QUERY_KEYS = {
  POSTS: 'posts',
  POST: 'post',
  COMMENTS: 'comments',
  USERS: 'users',
  USER: 'user',
  LEADERBOARD: 'leaderboard',
  STATS: 'stats',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_REQUIRED: 'Please log in to continue.',
  ACCESS_DENIED: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  POST_CREATED: 'Post created successfully!',
  POST_UPDATED: 'Post updated successfully!',
  POST_DELETED: 'Post deleted successfully!',
  COMMENT_ADDED: 'Comment added successfully!',
  COMMENT_UPDATED: 'Comment updated successfully!',
  COMMENT_DELETED: 'Comment deleted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Welcome to the community!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
  THEME: 'theme',
  PREFERENCES: 'preferences',
} as const;

// Feature Flags
export const FEATURES = {
  AI_DRAFT: false,
  AI_SUMMARIZE: false,
  NOTIFICATIONS: true,
  DARK_MODE: true,
  OFFLINE_SUPPORT: false,
} as const;
