// Main API exports
export * from './config';
export * from './types';
export * from './utils/httpClient';
export * from './utils/auth';

// Service exports
export { AuthService } from './services/authService';
export { UserService } from './services/userService';
export { PostService } from './services/postService';
export { CommentService } from './services/commentService';
export { LeaderboardService } from './services/leaderboardService';

// Re-export commonly used types for convenience
export type {
  User,
  Post,
  Comment,
  LeaderboardEntry,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  CreatePostData,
  UpdatePostData,
  CreateCommentData,
  UpdateCommentData,
  PostFilters,
  CommentFilters,
  ApiResponse,
  PaginatedResponse,
  ApiError,
} from './types';
