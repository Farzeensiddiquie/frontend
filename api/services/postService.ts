import { httpClient } from '../utils/httpClient';
import { AuthUtils } from '../utils/auth';
import { API_ENDPOINTS } from '../config';
import { 
  Post, 
  CreatePostData, 
  UpdatePostData, 
  PostFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '../types';

export class PostService {
  // Get all posts with filters
  static async getAllPosts(filters: PostFilters = {}): Promise<PaginatedResponse<Post>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters.authorId) params.append('authorId', filters.authorId);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const queryString = params.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.POSTS.ALL}?${queryString}` : API_ENDPOINTS.POSTS.ALL;

    const response = await httpClient.get<PaginatedResponse<Post>>(endpoint);
    return response.data;
  }

  // Get post by ID
  static async getPostById(postId: string): Promise<Post> {
    const response = await httpClient.get<Post>(
      API_ENDPOINTS.POSTS.BY_ID(postId)
    );
    return response.data;
  }

  // Get posts by user ID
  static async getUserPosts(userId: string, page: number = 1): Promise<PaginatedResponse<Post>> {
    const params = new URLSearchParams({
      page: page.toString(),
    });

    const response = await httpClient.get<PaginatedResponse<Post>>(
      `${API_ENDPOINTS.POSTS.BY_USER(userId)}?${params}`
    );
    return response.data;
  }

  // Create new post
  static async createPost(postData: CreatePostData): Promise<Post> {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('tags', JSON.stringify(postData.tags));
    
    if (postData.image) {
      formData.append('image', postData.image);
    }

    const response = await httpClient.post<Post>(
      API_ENDPOINTS.POSTS.ALL,
      formData,
      AuthUtils.getAuthHeaders()
    );
    return response.data;
  }

  // Update post
  static async updatePost(postId: string, postData: UpdatePostData): Promise<Post> {
    const formData = new FormData();
    
    if (postData.title) formData.append('title', postData.title);
    if (postData.content) formData.append('content', postData.content);
    if (postData.tags) formData.append('tags', JSON.stringify(postData.tags));
    if (postData.image) formData.append('image', postData.image);

    const response = await httpClient.put<Post>(
      API_ENDPOINTS.POSTS.BY_ID(postId),
      formData,
      AuthUtils.getAuthHeaders()
    );
    return response.data;
  }

  // Delete post
  static async deletePost(postId: string): Promise<void> {
    await httpClient.delete(
      API_ENDPOINTS.POSTS.BY_ID(postId),
      AuthUtils.getAuthHeaders()
    );
  }

  // Like/Unlike post
  static async toggleLike(postId: string): Promise<Post> {
    const response = await httpClient.post<Post>(
      API_ENDPOINTS.POSTS.LIKE(postId),
      {},
      AuthUtils.getAuthHeaders()
    );
    return response.data;
  }

  // Vote on post (upvote/downvote)
  static async votePost(postId: string, voteType: 'up' | 'down'): Promise<Post> {
    const response = await httpClient.post<Post>(
      API_ENDPOINTS.POSTS.VOTE(postId),
      { voteType },
      AuthUtils.getAuthHeaders()
    );
    return response.data;
  }

  // Get trending posts
  static async getTrendingPosts(limit: number = 10): Promise<Post[]> {
    const params = new URLSearchParams({
      trending: 'true',
      limit: limit.toString(),
    });

    const response = await httpClient.get<Post[]>(
      `${API_ENDPOINTS.POSTS.ALL}?${params}`
    );
    return response.data;
  }

  // Get posts by tag
  static async getPostsByTag(tag: string, page: number = 1): Promise<PaginatedResponse<Post>> {
    const params = new URLSearchParams({
      tag,
      page: page.toString(),
    });

    const response = await httpClient.get<PaginatedResponse<Post>>(
      `${API_ENDPOINTS.POSTS.ALL}?${params}`
    );
    return response.data;
  }

  // Get popular tags
  static async getPopularTags(limit: number = 20): Promise<{ tag: string; count: number }[]> {
    const response = await httpClient.get<{ tag: string; count: number }[]>(
      `${API_ENDPOINTS.POSTS.ALL}/tags?limit=${limit}`
    );
    return response.data;
  }

  // Search posts
  static async searchPosts(query: string, page: number = 1): Promise<PaginatedResponse<Post>> {
    return this.getAllPosts({ search: query, page });
  }
}
