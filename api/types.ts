// API Response Types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  postsCount: number;
  commentsCount: number;
  joinedAt: string;
}

// Post Types
export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: User;
  votes: number;
  likedBy: string[];
  upvotes: number;
  downvotes: number;
  votedBy: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  tags: string[];
  image?: File;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  tags?: string[];
  image?: File;
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  votes: number;
  upvotes: number;
  downvotes: number;
  votedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
  postId: string;
}

export interface UpdateCommentData {
  content: string;
}

// Leaderboard Types
export interface LeaderboardEntry {
  user: User;
  rank: number;
  score: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  avatar?: File;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Search and Filter Types
export interface PostFilters {
  page?: number;
  search?: string;
  tags?: string[];
  authorId?: string;
  sortBy?: 'newest' | 'oldest' | 'mostVoted' | 'mostCommented';
}

export interface CommentFilters {
  page?: number;
  sortBy?: 'newest' | 'oldest' | 'mostVoted';
}

// Error Types
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
