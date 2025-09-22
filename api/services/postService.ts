import { httpClient } from '../utils/httpClient.js';
import { AuthUtils } from '../utils/auth.js';
import { API_ENDPOINTS } from '../config.js';
import { 
  Post, 
  CreatePostData, 
  UpdatePostData, 
  PostFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '../types.js';

export class PostService {
  // Get all posts (return just the posts array)
  static async getAllPosts(filters: PostFilters = {}): Promise<Post[]> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters.authorId) params.append('authorId', filters.authorId);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.POSTS.ALL}?${queryString}` 
      : API_ENDPOINTS.POSTS.ALL;

    const response = await httpClient.get<Post[]>(endpoint);
    return response.data; // Backend returns posts directly
  }

  // Get post by ID
  static async getPostById(postId: string): Promise<Post> {
    const response = await httpClient.get<Post>(
      API_ENDPOINTS.POSTS.BY_ID(postId)
    );
    return response.data;
  }

  // Get posts by user ID (return just posts array)
  static async getUserPosts(userId: string, page: number = 1): Promise<Post[]> {
    const params = new URLSearchParams({ page: page.toString() });
    const response = await httpClient.get<Post[]>(
      `${API_ENDPOINTS.POSTS.BY_USER(userId)}?${params}`
    );
    return response.data; // Backend returns posts directly
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

    const response = await httpClient.post<{ message: string; post: Post }>(
      API_ENDPOINTS.POSTS.ALL,
      formData,
      AuthUtils.getAuthHeaders()
    );
    return response.data.post;
  }

  // Update post
  static async updatePost(postId: string, postData: UpdatePostData): Promise<Post> {
    const formData = new FormData();
    
    if (postData.title) formData.append('title', postData.title);
    if (postData.content) formData.append('content', postData.content);
    if (postData.tags) formData.append('tags', JSON.stringify(postData.tags));
    if (postData.image) formData.append('image', postData.image);

    const response = await httpClient.put<{ message: string; post: Post }>(
      API_ENDPOINTS.POSTS.BY_ID(postId),
      formData,
      AuthUtils.getAuthHeaders()
    );
    return response.data.post;
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
    const response = await httpClient.post<{ message: string; likes: string[] }>(
      API_ENDPOINTS.POSTS.LIKE(postId),
      {},
      AuthUtils.getAuthHeaders()
    );
    // Return the post with updated likes - we'll need to refetch the post
    return PostService.getPostById(postId);
  }

  // Vote on post (upvote/downvote)
  static async votePost(postId: string, voteType: 'up' | 'down'): Promise<Post> {
    const response = await httpClient.post<{ message: string; votes: number }>(
      API_ENDPOINTS.POSTS.VOTE(postId),
      { type: voteType },
      AuthUtils.getAuthHeaders()
    );
    // Return the post with updated votes - we'll need to refetch the post
    return PostService.getPostById(postId);
  }

  // Get trending posts (just posts array)
  static async getTrendingPosts(limit: number = 10): Promise<Post[]> {
    const params = new URLSearchParams({
      trending: 'true',
      limit: limit.toString(),
    });

    const response = await httpClient.get<Post[]>(
      `${API_ENDPOINTS.POSTS.ALL}?${params}`
    );
    return response.data; // Backend returns posts directly
  }

  // Get posts by tag (just posts array)
  static async getPostsByTag(tag: string, page: number = 1): Promise<Post[]> {
    const params = new URLSearchParams({
      tag,
      page: page.toString(),
    });

    const response = await httpClient.get<Post[]>(
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

  // Search posts (just posts array)
  static async searchPosts(query: string, page: number = 1): Promise<Post[]> {
    return this.getAllPosts({ search: query, page });
  }
}
