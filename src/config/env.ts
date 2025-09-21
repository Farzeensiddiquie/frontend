// Environment configuration for Vite
export const ENV_CONFIG = {
  API_BASE_URL: '/api', // Always use relative path for Vite proxy
  APP_NAME: import.meta.env.VITE_APP_NAME || 'DevCommunity',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;
