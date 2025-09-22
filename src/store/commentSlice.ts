import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '@/lib/api';

interface CommentState {
  comments: Comment[];
  userComments: Comment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  userComments: [],
  isLoading: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload;
      state.error = null;
    },
    
    addComment: (state, action: PayloadAction<Comment>) => {
      state.comments.unshift(action.payload);
    },
    
    updateComment: (state, action: PayloadAction<{ commentId: string; updates: Partial<Comment> }>) => {
      const { commentId, updates } = action.payload;
      
      const updateCommentInArray = (commentArray: Comment[]) =>
        commentArray.map(comment => comment.id === commentId ? { ...comment, ...updates } : comment);

      state.comments = updateCommentInArray(state.comments);
      state.userComments = updateCommentInArray(state.userComments);
    },
    
    removeComment: (state, action: PayloadAction<string>) => {
      const commentId = action.payload;
      state.comments = state.comments.filter(comment => comment.id !== commentId);
      state.userComments = state.userComments.filter(comment => comment.id !== commentId);
    },
    
    setUserComments: (state, action: PayloadAction<Comment[]>) => {
      state.userComments = action.payload;
      state.error = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearComments: (state) => {
      state.comments = [];
      state.userComments = [];
      state.error = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setComments,
  addComment,
  updateComment,
  removeComment,
  setUserComments,
  setLoading,
  setError,
  clearComments,
  clearError,
} = commentSlice.actions;

// Selectors
export const selectComments = (state: { comments: CommentState }) => state.comments.comments;
export const selectUserComments = (state: { comments: CommentState }) => state.comments.userComments;
export const selectCommentsLoading = (state: { comments: CommentState }) => state.comments.isLoading;
export const selectCommentsError = (state: { comments: CommentState }) => state.comments.error;

export default commentSlice.reducer;
