import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config';
import { LeaderboardEntry, ApiResponse } from '../types';

export class LeaderboardService {
  // Get leaderboard
  static async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await httpClient.get<LeaderboardEntry[]>(
      API_ENDPOINTS.LEADERBOARD
    );
    return response.data;
  }

  // Get leaderboard with pagination
  static async getLeaderboardPaginated(page: number = 1, limit: number = 50): Promise<{
    data: LeaderboardEntry[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await httpClient.get<{
      data: LeaderboardEntry[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`${API_ENDPOINTS.LEADERBOARD}?${params}`);
    
    return response.data;
  }

  // Get leaderboard by time period
  static async getLeaderboardByPeriod(period: 'daily' | 'weekly' | 'monthly' | 'all'): Promise<LeaderboardEntry[]> {
    const params = new URLSearchParams({
      period,
    });

    const response = await httpClient.get<LeaderboardEntry[]>(
      `${API_ENDPOINTS.LEADERBOARD}?${params}`
    );
    return response.data;
  }

  // Get user's rank
  static async getUserRank(userId: string): Promise<{
    rank: number;
    score: number;
    totalUsers: number;
  }> {
    const response = await httpClient.get<{
      rank: number;
      score: number;
      totalUsers: number;
    }>(`${API_ENDPOINTS.LEADERBOARD}/user/${userId}/rank`);
    
    return response.data;
  }

  // Get top users by category
  static async getTopUsersByCategory(category: 'posts' | 'comments' | 'votes' | 'score'): Promise<LeaderboardEntry[]> {
    const params = new URLSearchParams({
      category,
    });

    const response = await httpClient.get<LeaderboardEntry[]>(
      `${API_ENDPOINTS.LEADERBOARD}?${params}`
    );
    return response.data;
  }

  // Get leaderboard statistics
  static async getLeaderboardStats(): Promise<{
    totalUsers: number;
    averageScore: number;
    highestScore: number;
    activeUsers: number;
  }> {
    const response = await httpClient.get<{
      totalUsers: number;
      averageScore: number;
      highestScore: number;
      activeUsers: number;
    }>(`${API_ENDPOINTS.LEADERBOARD}/stats`);
    
    return response.data;
  }
}
