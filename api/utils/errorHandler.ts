// Global error handling utilities
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error types
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Error handler for API responses
export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  // Network errors
  if (!navigator.onLine) {
    return new AppError('No internet connection', 0, true);
  }

  // Fetch errors
  if (error instanceof Error && error.name === 'TypeError' && error.message.includes('fetch')) {
    return new AppError('Network request failed', 0, true);
  }

  // HTTP errors
  if (error && typeof error === 'object' && 'status' in error) {
    const statusCode = (error as { status: number }).status;
    let message = (error as { message?: string }).message || 'An error occurred';

    switch (statusCode) {
      case 400:
        message = 'Invalid request. Please check your input.';
        break;
      case 401:
        message = 'Authentication required. Please log in.';
        break;
      case 403:
        message = 'Access denied. You do not have permission.';
        break;
      case 404:
        message = 'The requested resource was not found.';
        break;
      case 409:
        message = 'Conflict. The resource already exists.';
        break;
      case 422:
        message = 'Validation failed. Please check your input.';
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      default:
        message = `Request failed with status ${statusCode}`;
    }

    return new AppError(message, statusCode, true);
  }

  // Unknown errors
  return new AppError(
    error instanceof Error ? error.message : 'An unexpected error occurred',
    500,
    false
  );
};

// Global error handler for unhandled promise rejections
export const setupGlobalErrorHandling = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // You can add error reporting here (e.g., Sentry)
    // reportError(event.reason);
    
    // Prevent the default behavior (logging to console)
    event.preventDefault();
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // You can add error reporting here (e.g., Sentry)
    // reportError(event.error);
  });
};

// Error reporting function (placeholder for services like Sentry)
export const reportError = (error: unknown, context?: unknown) => {
  // In production, you would send this to your error reporting service
  console.error('Error reported:', { error, context });
  
  // Example for Sentry:
  // Sentry.captureException(error, { extra: context });
};

// Retry logic for failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error instanceof AppError && error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
};
