// Security utilities for the application

// XSS prevention - sanitize user input
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// XSS prevention - escape HTML
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// CSRF token generation (if needed)
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Secure token storage
export const secureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      // In production, consider using a more secure storage method
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to store item securely:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Failed to retrieve item securely:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove item securely:', error);
    }
  }
};

// Content Security Policy helpers
export const getCSPNonce = (): string => {
  // Generate a nonce for inline scripts/styles
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

// Rate limiting helper (client-side)
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests: number[] = [];
  
  return (): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Remove old requests outside the window
    while (requests.length > 0 && requests[0] < windowStart) {
      requests.shift();
    }
    
    if (requests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    requests.push(now);
    return true; // Request allowed
  };
};

// Input validation for forms
export const validateFormInput = (input: unknown, rules: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
}): { isValid: boolean; error: string } => {
  if (rules.required && (!input || input.toString().trim() === '')) {
    return { isValid: false, error: 'This field is required' };
  }
  
  if (rules.minLength && input.toString().length < rules.minLength) {
    return { isValid: false, error: `Minimum length is ${rules.minLength} characters` };
  }
  
  if (rules.maxLength && input.toString().length > rules.maxLength) {
    return { isValid: false, error: `Maximum length is ${rules.maxLength} characters` };
  }
  
  if (rules.pattern && !rules.pattern.test(input.toString())) {
    return { isValid: false, error: 'Invalid format' };
  }
  
  if (rules.custom && !rules.custom(input)) {
    return { isValid: false, error: 'Invalid input' };
  }
  
  return { isValid: true, error: '' };
};

// Secure URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// File type validation
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

// File size validation
export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};
