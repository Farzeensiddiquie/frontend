import { httpClient } from '../utils/httpClient';
import { AuthUtils } from '../utils/auth';
import { API_ENDPOINTS } from '../config';
import { 
  Comment, 
  CreateCommentData, 
  UpdateCommentData, 
  CommentFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '../types';

export class CommentService {
  // Get comments by post ID
  static async getCommentsByPost(postId: string, filters: CommentFilters = {}): Promise<PaginatedResponse<Comment>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.COMMENTS.BY_POST(postId)}?${queryString}` 
      : API_ENDPOINTS.COMMENTS.BY_POST(postId);

    const response = await httpClient.get<PaginatedResponse<Comment>>(endpoint);
    return response.data;
  }

  // Get comments by user ID
  static async getUserComments(userId: string, page: number = 1): Promise<PaginatedResponse<Comment>> {
    const params = new URLSearchParams({
      page: page.toString(),
    });

    const response = await httpClient.get<PaginatedResponse<Comment>>(
      `${API_ENDPOINTS.COMMENTS.BY_USER(userId)}?${params}`
    );
    return response.data;
  }

  // Create new comment
  static async createComment(commentData: CreateCommentData): Promise<Comment> {
    const response = await httpClient.post<Comment>(
      API_ENDPOINTS.COMMENTS.ALL,
      commentData,
      AuthUtils.getAuthHeaders()
    );
    return response.data;
  }

  // Update comment
  static async updateComment(commentId: string, commentData: UpdateCommentData): Promise<Comment> {
    const response = await httpClient.put<Comment>(
      API_ENDPOINTS.COMMENTS.BY_ID(commentId),
      commentData,
      AuthUtils.getAuthHeaders()
    );
    return response.data;
  }

  // Delete comment
  static async deleteComment(commentId: string): Promise<void> {
    await httpClient.delete(
      API_ENDPOINTS.COMMENTS.BY_ID(commentId),
      AuthUtils.getAuthHeaders()
    );
  }

  // Vote on comment
  static async voteComment(commentId: string, voteType: 'up' | 'down'): Promise<Comment> {
    const response = await httpClient.post<Comment>(
      API_ENDPOINTS.COMMENTS.VOTE(commentId),
      { voteType },
      AuthUtils.getAuthHeaders()
    );
    return response.data;
  }

  // Get comment by ID
  static async getCommentById(commentId: string): Promise<Comment> {
    const response = await httpClient.get<Comment>(
      API_ENDPOINTS.COMMENTS.BY_ID(commentId)
    );
    return response.data;
  }

  // Get recent comments
  static async getRecentComments(limit: number = 10): Promise<Comment[]> {
    const params = new URLSearchParams({
      recent: 'true',
      limit: limit.toString(),
    });

    const response = await httpClient.get<Comment[]>(
      `${API_ENDPOINTS.COMMENTS.ALL}?${params}`
    );
    return response.data;
  }

  // Get comment replies (if nested comments are supported)
  static async getCommentReplies(commentId: string, page: number = 1): Promise<PaginatedResponse<Comment>> {
    const params = new URLSearchParams({
      page: page.toString(),
    });

    const response = await httpClient.get<PaginatedResponse<Comment>>(
      `${API_ENDPOINTS.COMMENTS.BY_ID(commentId)}/replies?${params}`
    );
    return response.data;
  }

  // Create comment reply
  static async createCommentReply(parentCommentId: string, content: string): Promise<Comment> {
    const response = await httpClient.post<Comment>(
      `${API_ENDPOINTS.COMMENTS.BY_ID(parentCommentId)}/replies`,
      { content },
      AuthUtils.getAuthHeaders()
    );
    return response.data;
  }
}
