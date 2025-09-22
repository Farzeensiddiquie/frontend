const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Types for API responses
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

export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: User;
  votes: number;
  likedBy: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  votes: number;
  votedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  user: User;
  rank: number;
  score: number;
}

// Auth API functions
export const authAPI = {
  register: async (formData: FormData): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  login: async (credentials: { email: string; password: string }): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  logout: async (token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Logout failed');
  },

  getProfile: async (token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/profile/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to get profile');
    return response.json();
  },
};

// Posts API functions
export const postsAPI = {
  getAllPosts: async (page = 1, search = ''): Promise<{ posts: Post[]; total: number }> => {
    const params = new URLSearchParams({ page: page.toString(), search });
    const response = await fetch(`${API_BASE_URL}/posts?${params}`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  getPostById: async (id: string): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return response.json();
  },

  getUserPosts: async (userId: string): Promise<Post[]> => {
    const response = await fetch(`${API_BASE_URL}/posts/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user posts');
    return response.json();
  },

  createPost: async (formData: FormData, token: string): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },

  updatePost: async (id: string, formData: FormData, token: string): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update post');
    return response.json();
  },

  deletePost: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete post');
  },

  toggleLike: async (id: string, token: string): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to toggle like');
    return response.json();
  },
};

// Comments API functions
export const commentsAPI = {
  getCommentsByPost: async (postId: string): Promise<Comment[]> => {
    const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  },

  getUserComments: async (userId: string): Promise<Comment[]> => {
    const response = await fetch(`${API_BASE_URL}/comments/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user comments');
    return response.json();
  },

  createComment: async (comment: { content: string; postId: string }, token: string): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(comment),
    });
    if (!response.ok) throw new Error('Failed to create comment');
    return response.json();
  },

  updateComment: async (id: string, content: string, token: string): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Failed to update comment');
    return response.json();
  },

  deleteComment: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete comment');
  },

  voteComment: async (id: string, voteType: 'up' | 'down', token: string): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/comments/${id}/vote`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ voteType }),
    });
    if (!response.ok) throw new Error('Failed to vote comment');
    return response.json();
  },
};

// Users API functions
export const usersAPI = {
  getUserById: async (userId: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  updateAvatar: async (formData: FormData, token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/profile/avatar`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update avatar');
    return response.json();
  },

  updateProfile: async (profile: { username?: string; bio?: string }, token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },
};

// Leaderboard API function (assuming it exists)
export const leaderboardAPI = {
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await fetch(`${API_BASE_URL}/leaderboard`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
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