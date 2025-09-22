import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '@/lib/api';

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  userPosts: Post[];
  trendingPosts: Post[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    total: number;
    hasMore: boolean;
  };
}

const initialState: PostState = {
  posts: [],
  currentPost: null,
  userPosts: [],
  trendingPosts: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    total: 0,
    hasMore: false,
  },
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      state.error = null;
    },
    
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    
    updatePost: (state, action: PayloadAction<{ postId: string; updates: Partial<Post> }>) => {
      const { postId, updates } = action.payload;
      
      const updatePostInArray = (postArray: Post[]) =>
        postArray.map(post => post.id === postId ? { ...post, ...updates } : post);

      state.posts = updatePostInArray(state.posts);
      state.userPosts = updatePostInArray(state.userPosts);
      state.trendingPosts = updatePostInArray(state.trendingPosts);
      
      if (state.currentPost?.id === postId) {
        state.currentPost = { ...state.currentPost, ...updates };
      }
    },
    
    removePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      state.posts = state.posts.filter(post => post.id !== postId);
      state.userPosts = state.userPosts.filter(post => post.id !== postId);
      state.trendingPosts = state.trendingPosts.filter(post => post.id !== postId);
      
      if (state.currentPost?.id === postId) {
        state.currentPost = null;
      }
    },
    
    setCurrentPost: (state, action: PayloadAction<Post | null>) => {
      state.currentPost = action.payload;
      state.error = null;
    },
    
    setUserPosts: (state, action: PayloadAction<Post[]>) => {
      state.userPosts = action.payload;
      state.error = null;
    },
    
    setTrendingPosts: (state, action: PayloadAction<Post[]>) => {
      state.trendingPosts = action.payload;
      state.error = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    setPagination: (state, action: PayloadAction<Partial<PostState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    clearPosts: (state) => {
      state.posts = [];
      state.currentPost = null;
      state.userPosts = [];
      state.trendingPosts = [];
      state.error = null;
      state.pagination = { page: 1, total: 0, hasMore: false };
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setPosts,
  addPost,
  updatePost,
  removePost,
  setCurrentPost,
  setUserPosts,
  setTrendingPosts,
  setLoading,
  setError,
  setPagination,
  clearPosts,
  clearError,
} = postSlice.actions;

// Selectors
export const selectPosts = (state: { posts: PostState }) => state.posts.posts;
export const selectCurrentPost = (state: { posts: PostState }) => state.posts.currentPost;
export const selectUserPosts = (state: { posts: PostState }) => state.posts.userPosts;
export const selectTrendingPosts = (state: { posts: PostState }) => state.posts.trendingPosts;
export const selectPostsLoading = (state: { posts: PostState }) => state.posts.isLoading;
export const selectPostsError = (state: { posts: PostState }) => state.posts.error;
export const selectPagination = (state: { posts: PostState }) => state.posts.pagination;

export default postSlice.reducer;
