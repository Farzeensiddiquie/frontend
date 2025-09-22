import { httpClient } from '../utils/httpClient.js';
import { AuthUtils, User } from '../utils/auth.js';
import { API_ENDPOINTS } from '../config.js';
import { LoginCredentials, RegisterData, AuthResponse } from '../types.js';

export class AuthService {
  // ---------------- Register ----------------
  static async register(userData: RegisterData): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('userName', userData.userName); // Fixed: match backend expectation
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    if (userData.avatar) {
      formData.append('avatar', userData.avatar);
    }

    const response = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      formData
    );

    // Save token and user reactively
    AuthUtils.setToken(response.data.accessToken);
    AuthUtils.setUser(response.data.user);

    return response.data;
  }

  // ---------------- Login ----------------
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    AuthUtils.setToken(response.data.accessToken);
    AuthUtils.setUser(response.data.user);

    return response.data;
  }

  // ---------------- Logout ----------------
  static async logout(): Promise<void> {
    const token = AuthUtils.getToken();
    if (!token) return;

    try {
      await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, AuthUtils.getAuthHeaders());
    } finally {
      AuthUtils.logout(); // triggers reactive auth change
    }
  }

  // ---------------- Current profile ----------------
  static async getProfile(): Promise<User> {
    const response = await httpClient.get<User>(
      API_ENDPOINTS.AUTH.PROFILE,
      AuthUtils.getAuthHeaders()
    );

    AuthUtils.setUser(response.data); // reactive update
    return response.data;
  }

  // ---------------- Helpers ----------------
  static isAuthenticated(): boolean {
    return AuthUtils.isAuthenticated() && !AuthUtils.isTokenExpired();
  }

  static getCurrentUser(): User | null {
    return AuthUtils.getUser() as User | null;
  }

  static getToken(): string | null {
    return AuthUtils.getToken();
  }

  // ---------------- Reactive auth listener ----------------
  static onAuthChange(listener: (user: User | null) => void) {
    return AuthUtils.onAuthChange(listener);
  }

  // ---------------- Token utilities ----------------
  static isTokenExpired(): boolean {
    return AuthUtils.isTokenExpired();
  }

  static clearAllAuthData(): void {
    AuthUtils.clearAllAuthData();
  }

  static getCurrentUser(): User | null {
    return AuthUtils.getUser();
  }
}
