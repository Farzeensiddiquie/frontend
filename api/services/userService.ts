import { httpClient } from '../utils/httpClient';
import { AuthUtils } from '../utils/auth';
import { API_ENDPOINTS } from '../config';
import { User, UserProfile, ApiResponse, PaginatedResponse } from '../types';

export class UserService {
  // Get user by ID
  static async getUserById(userId: string): Promise<User> {
    const response = await httpClient.get<User>(
      API_ENDPOINTS.USERS.BY_ID(userId)
    );
    return response.data;
  }

  // Update user avatar
  static async updateAvatar(avatarFile: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await httpClient.put<User>(
      API_ENDPOINTS.USERS.UPDATE_AVATAR,
      formData,
      AuthUtils.getAuthHeaders()
    );

    // Update stored user data
    const currentUser = AuthUtils.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...response.data };
      AuthUtils.setUser(updatedUser);
    }

    return response.data;
  }

  // Update user profile
  static async updateProfile(profileData: {
    username?: string;
    bio?: string;
  }): Promise<User> {
    const response = await httpClient.put<User>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      profileData,
      AuthUtils.getAuthHeaders()
    );

    // Update stored user data
    const currentUser = AuthUtils.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...response.data };
      AuthUtils.setUser(updatedUser);
    }

    return response.data;
  }

  // Search users
  static async searchUsers(query: string, page: number = 1): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      search: query,
      page: page.toString(),
    });

    const response = await httpClient.get<PaginatedResponse<User>>(
      `${API_ENDPOINTS.USERS.ALL}?${params}`
    );
    return response.data;
  }

  // Get user statistics
  static async getUserStats(userId: string): Promise<{
    postsCount: number;
    commentsCount: number;
    totalVotes: number;
    joinDate: string;
  }> {
    const response = await httpClient.get<{
      postsCount: number;
      commentsCount: number;
      totalVotes: number;
      joinDate: string;
    }>(`${API_ENDPOINTS.USERS.BY_ID(userId)}/stats`);
    
    return response.data;
  }

  // Follow/Unfollow user (if this feature exists)
  static async toggleFollow(userId: string): Promise<{ isFollowing: boolean }> {
    const response = await httpClient.post<{ isFollowing: boolean }>(
      `${API_ENDPOINTS.USERS.BY_ID(userId)}/follow`,
      {},
      AuthUtils.getAuthHeaders()
    );
    return response.data;
  }

  // Get user's followers
  static async getFollowers(userId: string, page: number = 1): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
    });

    const response = await httpClient.get<PaginatedResponse<User>>(
      `${API_ENDPOINTS.USERS.BY_ID(userId)}/followers?${params}`
    );
    return response.data;
  }

  // Get user's following
  static async getFollowing(userId: string, page: number = 1): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
    });

    const response = await httpClient.get<PaginatedResponse<User>>(
      `${API_ENDPOINTS.USERS.BY_ID(userId)}/following?${params}`
    );
    return response.data;
  }
}
