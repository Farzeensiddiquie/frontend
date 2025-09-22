// src/utils/auth.ts
export interface User {
  id: string;
  userName: string;
  avatar?: string;
}

type AuthChangeListener = (user: User | null) => void;

export class AuthUtils {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user_data';
  private static eventTarget = new EventTarget();

  // ---------------- Token management ----------------
  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // ---------------- User management ----------------
  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.emitChange(user);
  }

  static getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData || userData === 'undefined' || userData === 'null') {
      this.removeUser();
      return null;
    }
    try {
      const parsed = JSON.parse(userData);
      // Validate that the parsed data has required fields
      if (!parsed || typeof parsed !== 'object' || !parsed.id || !parsed.userName) {
        console.warn('Invalid user data structure, clearing...');
        this.removeUser();
        return null;
      }
      return parsed;
    } catch (error) {
      console.warn('Failed to parse stored user data, clearing...', error);
      this.removeUser();
      return null;
    }
  }

  static removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
    this.emitChange(null);
  }

  // ---------------- Auth state ----------------
  static isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  static logout(): void {
    this.removeToken();
    this.removeUser();
  }

  // Clear all auth data (useful for debugging or fixing corrupted data)
  static clearAllAuthData(): void {
    this.removeToken();
    this.removeUser();
    // Also clear any other auth-related keys that might exist
    const keysToRemove = ['auth_token', 'user_data', 'auth_user', 'auth_token_key'];
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });
  }

  // ---------------- Auth headers ----------------
  static getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // ---------------- Token utils ----------------
  static isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  static getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.sub || null;
    } catch {
      return null;
    }
  }

  // ---------------- Reactive auth ----------------
  private static emitChange(user: User | null) {
    this.eventTarget.dispatchEvent(new CustomEvent('authChange', { detail: user }));
  }

  static onAuthChange(listener: AuthChangeListener) {
    const callback = (e: Event) => listener((e as CustomEvent).detail);
    this.eventTarget.addEventListener('authChange', callback);
    return () => this.eventTarget.removeEventListener('authChange', callback);
  }

  // ---------------- Debug utilities ----------------
  static debugAuthState() {
    console.log('=== Auth Debug Info ===');
    console.log('Token:', this.getToken());
    console.log('User:', this.getUser());
    console.log('Is Authenticated:', this.isAuthenticated());
    console.log('Is Token Expired:', this.isTokenExpired());
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('========================');
  }
}

// Make debug function available globally for console debugging
if (typeof window !== 'undefined') {
  (window as any).debugAuth = () => AuthUtils.debugAuthState();
  (window as any).clearAuth = () => AuthUtils.clearAllAuthData();
}
