# API Documentation

This document outlines all available API endpoints for the frontend application.

## Base URL
```
http://localhost:8000/api
```

## Authentication
Most endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## API Endpoints

### 🔐 Authentication (`/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users/register` | Register new user with avatar | No |
| POST | `/users/login` | Login user | No |
| POST | `/users/logout` | Logout user | Yes |
| GET | `/users/profile/me` | Get current user profile | Yes |
| PUT | `/users/profile/avatar` | Update user avatar | Yes |
| PUT | `/users/profile` | Update user profile | Yes |
| GET | `/users/:userId` | Get user by ID (public profile) | No |

### 📝 Posts (`/posts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/posts` | Get all posts with pagination/search | No |
| GET | `/posts/leaderboard` | Get leaderboard of posts by votes | No |
| GET | `/posts/:id` | Get post by ID | No |
| GET | `/posts/user/:userId` | Get posts by user ID | No |
| POST | `/posts` | Create new post | Yes |
| PUT | `/posts/:id` | Update post | Yes |
| DELETE | `/posts/:id` | Delete post | Yes |
| POST | `/posts/:id/like` | Like/Unlike post | Yes |
| POST | `/posts/:id/vote` | Vote on post (upvote/downvote) | Yes |

### 💬 Comments (`/comments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/comments/post/:postId` | Get comments by post ID | No |
| GET | `/comments/user/:userId` | Get comments by user ID | No |
| POST | `/comments` | Create new comment | Yes |
| PUT | `/comments/:id` | Update comment | Yes |
| DELETE | `/comments/:id` | Delete comment | Yes |
| POST | `/comments/:id/vote` | Vote on comment | Yes |

## Usage Examples

### Authentication
```typescript
import { AuthService } from './api';

// Register
const user = await AuthService.register({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123',
  avatar: file // optional File object
});

// Login
const authResponse = await AuthService.login({
  email: 'john@example.com',
  password: 'password123'
});

// Get profile
const profile = await AuthService.getProfile();
```

### Posts
```typescript
import { PostService } from './api';

// Get all posts
const posts = await PostService.getAllPosts({
  page: 1,
  search: 'react',
  sortBy: 'newest'
});

// Create post
const newPost = await PostService.createPost({
  title: 'My Post',
  content: 'Post content',
  tags: ['react', 'javascript'],
  image: file // optional
});

// Vote on post
const updatedPost = await PostService.votePost('post-id', 'up');
```

### Comments
```typescript
import { CommentService } from './api';

// Get comments for a post
const comments = await CommentService.getCommentsByPost('post-id');

// Create comment
const newComment = await CommentService.createComment({
  content: 'Great post!',
  postId: 'post-id'
});

// Vote on comment
const updatedComment = await CommentService.voteComment('comment-id', 'up');
```

### Users
```typescript
import { UserService } from './api';

// Get user by ID
const user = await UserService.getUserById('user-id');

// Update avatar
const updatedUser = await UserService.updateAvatar(file);

// Update profile
const updatedProfile = await UserService.updateProfile({
  username: 'new_username',
  bio: 'Updated bio'
});
```

## Error Handling

All API calls return a standardized response format:

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}
```

Errors are thrown as `ApiError` instances with the following structure:

```typescript
interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}
```

## Pagination

Paginated endpoints return data in this format:

```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## File Uploads

File uploads are handled using `FormData`:

```typescript
// For posts with images
const formData = new FormData();
formData.append('title', 'Post Title');
formData.append('content', 'Post Content');
formData.append('tags', JSON.stringify(['tag1', 'tag2']));
formData.append('image', file);

const post = await PostService.createPost(formData);
```

## Rate Limiting

Some endpoints may have rate limiting applied. Check the backend documentation for specific limits.

## CORS

The API is configured to accept requests from `http://localhost:3000` (or your frontend URL). Make sure your frontend is running on the expected port.
