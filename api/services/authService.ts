import { httpClient } from '../utils/httpClient';
import { AuthUtils } from '../utils/auth';
import { API_ENDPOINTS } from '../config';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User, 
  ApiResponse 
} from '../types';

export class AuthService {
  // Register new user
  static async register(userData: RegisterData): Promise<AuthResponse> {
    const formData = new FormData();
    // Try different field name variations for username
    formData.append('username', userData.username);
    formData.append('userName', userData.username);
    formData.append('fullName', userData.username); // Some backends expect fullName instead of username
    formData.append('name', userData.username); // Alternative field name
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    if (userData.avatar) {
      formData.append('avatar', userData.avatar);
    }

    // Debug: Log what we're sending (remove in production)
    console.log('Registration FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      formData
    );

    // Store auth data
    AuthUtils.setToken(response.data.token);
    AuthUtils.setUser(response.data.user);

    return response.data;
  }

  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // Store auth data
    AuthUtils.setToken(response.data.token);
    AuthUtils.setUser(response.data.user);

    return response.data;
  }

  // Logout user
  static async logout(): Promise<void> {
    const token = AuthUtils.getToken();
    if (!token) return;

    try {
      await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, AuthUtils.getAuthHeaders());
    } finally {
      // Always clear local auth data
      AuthUtils.logout();
    }
  }

  // Get current user profile
  static async getProfile(): Promise<User> {
    const response = await httpClient.get<User>(
      API_ENDPOINTS.AUTH.PROFILE,
      AuthUtils.getAuthHeaders()
    );

    // Update stored user data
    AuthUtils.setUser(response.data);

    return response.data;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return AuthUtils.isAuthenticated() && !AuthUtils.isTokenExpired();
  }

  // Get current user
  static getCurrentUser(): User | null {
    return AuthUtils.getUser();
  }

  // Get auth token
  static getToken(): string | null {
    return AuthUtils.getToken();
  }
}
