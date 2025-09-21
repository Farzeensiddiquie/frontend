// Re-export everything from the new API structure
export * from '../../api';

// Legacy API functions for backward compatibility
import { 
  AuthService, 
  PostService, 
  CommentService, 
  UserService, 
  LeaderboardService,
  API_CONFIG 
} from '../../api';

// Legacy API functions for backward compatibility
export const authAPI = {
  register: async (formData: FormData): Promise<{ user: User; token: string }> => {
    // Convert FormData to RegisterData format
    const userData = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      avatar: formData.get('avatar') as File || undefined,
    };
    return AuthService.register(userData);
  },

  login: async (credentials: { email: string; password: string }): Promise<{ user: User; token: string }> => {
    return AuthService.login(credentials);
  },

  logout: async (token: string): Promise<void> => {
    return AuthService.logout();
  },

  getProfile: async (token: string): Promise<User> => {
    return AuthService.getProfile();
  },
};

// Posts API functions
export const postsAPI = {
  getAllPosts: async (page = 1, search = ''): Promise<{ posts: Post[]; total: number }> => {
    const response = await PostService.getAllPosts({ page, search });
    return { posts: response.data, total: response.total };
  },

  getPostById: async (id: string): Promise<Post> => {
    return PostService.getPostById(id);
  },

  getUserPosts: async (userId: string): Promise<Post[]> => {
    const response = await PostService.getUserPosts(userId);
    return response.data;
  },

  createPost: async (formData: FormData, token: string): Promise<Post> => {
    const postData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      image: formData.get('image') as File || undefined,
    };
    return PostService.createPost(postData);
  },

  updatePost: async (id: string, formData: FormData, token: string): Promise<Post> => {
    const postData: Record<string, unknown> = {};
    if (formData.get('title')) postData.title = formData.get('title') as string;
    if (formData.get('content')) postData.content = formData.get('content') as string;
    if (formData.get('tags')) postData.tags = JSON.parse(formData.get('tags') as string);
    if (formData.get('image')) postData.image = formData.get('image') as File;
    
    return PostService.updatePost(id, postData);
  },

  deletePost: async (id: string, token: string): Promise<void> => {
    return PostService.deletePost(id);
  },

  toggleLike: async (id: string, token: string): Promise<Post> => {
    return PostService.toggleLike(id);
  },

  votePost: async (id: string, voteType: 'up' | 'down', token: string): Promise<Post> => {
    return PostService.votePost(id, voteType);
  },
};

// Comments API functions
export const commentsAPI = {
  getCommentsByPost: async (postId: string): Promise<Comment[]> => {
    const response = await CommentService.getCommentsByPost(postId);
    return response.data;
  },

  getUserComments: async (userId: string): Promise<Comment[]> => {
    const response = await CommentService.getUserComments(userId);
    return response.data;
  },

  createComment: async (comment: { content: string; postId: string }, token: string): Promise<Comment> => {
    return CommentService.createComment(comment);
  },

  updateComment: async (id: string, content: string, token: string): Promise<Comment> => {
    return CommentService.updateComment(id, { content });
  },

  deleteComment: async (id: string, token: string): Promise<void> => {
    return CommentService.deleteComment(id);
  },

  voteComment: async (id: string, voteType: 'up' | 'down', token: string): Promise<Comment> => {
    return CommentService.voteComment(id, voteType);
  },
};

// Users API functions
export const usersAPI = {
  getUserById: async (userId: string): Promise<User> => {
    return UserService.getUserById(userId);
  },

  updateAvatar: async (formData: FormData, token: string): Promise<User> => {
    const avatarFile = formData.get('avatar') as File;
    return UserService.updateAvatar(avatarFile);
  },

  updateProfile: async (profile: { username?: string; bio?: string }, token: string): Promise<User> => {
    return UserService.updateProfile(profile);
  },
};

// Leaderboard API function
export const leaderboardAPI = {
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    return LeaderboardService.getLeaderboard();
  },
};

// Statistics API function
export const statsAPI = {
  getStats: async (): Promise<{ users: number; posts: number; totalScore: number }> => {
    try {
      // Get leaderboard to count users and calculate total score
      const leaderboard = await leaderboardAPI.getLeaderboard();
      const users = leaderboard.length;
      const totalScore = leaderboard.reduce((sum, entry) => sum + entry.score, 0);
      
      // Get posts to count total posts
      const postsData = await postsAPI.getAllPosts(1);
      const posts = postsData.total;
      
      return { users, posts, totalScore };
    } catch (error) {
      // Return fallback data if API calls fail
      return { users: 0, posts: 0, totalScore: 0 };
    }
  },
};