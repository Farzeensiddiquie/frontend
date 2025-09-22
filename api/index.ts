// Main API exports
export * from './config.js';
export * from './types.js';
export * from './utils/httpClient.js';
export * from './utils/auth.js';

// Service exports
export { AuthService } from './services/authService.js';
export { UserService } from './services/userService.js';
export { PostService } from './services/postService.js';
export { CommentService } from './services/commentService.js';
export { LeaderboardService } from './services/leaderboardService.js';

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
} from './types.js';
