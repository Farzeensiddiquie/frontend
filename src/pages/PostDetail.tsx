import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostCard } from "@/components/ui/post-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VoteButton } from "@/components/ui/vote-button";
import { 
  ArrowLeft, 
  MessageCircle, 
  Sparkles, 
  Edit, 
  Trash2,
  Clock
} from "lucide-react";
import { postsAPI, commentsAPI, User, Comment } from "@/lib/api";
import { toast } from "sonner";

interface PostDetailProps {
  user: User | null;
  token: string | null;
}

const PostDetail = ({ user, token }: PostDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const { data: post, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsAPI.getPostById(id!),
    enabled: !!id,
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => commentsAPI.getCommentsByPost(id!),
    enabled: !!id,
  });

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => commentsAPI.createComment({ content, postId: id! }, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setNewComment("");
      toast.success("Comment added successfully!");
    },
    onError: () => {
      toast.error("Failed to add comment. Please try again.");
    },
  });

  const votePostMutation = useMutation({
    mutationFn: (voteType: 'up' | 'down') => postsAPI.votePost(id!, voteType, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      toast.success("Vote recorded!");
    },
    onError: () => {
      toast.error("Failed to vote. Please try again.");
    },
  });

  const voteCommentMutation = useMutation({
    mutationFn: ({ commentId, voteType }: { commentId: string; voteType: 'up' | 'down' }) => 
      commentsAPI.voteComment(commentId, voteType, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      toast.success("Vote recorded!");
    },
    onError: () => {
      toast.error("Failed to vote. Please try again.");
    },
  });

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !token) return;
    
    setIsCommentLoading(true);
    try {
      await createCommentMutation.mutateAsync(newComment);
    } finally {
      setIsCommentLoading(false);
    }
  };

  const handleSummarizeWithAI = () => {
    toast.info("AI Summarization feature coming soon!");
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (postLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-4" />
          <div className="h-4 bg-muted rounded w-1/2 mb-6" />
          <div className="space-y-3">
            <div className="h-3 bg-muted rounded" />
            <div className="h-3 bg-muted rounded w-5/6" />
            <div className="h-3 bg-muted rounded w-4/5" />
          </div>
        </Card>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-12 text-center bg-card border-border">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Post not found</h3>
          <p className="text-muted-foreground mb-4">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild variant="outline" className="border-border">
            <Link to="/feed">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Feed
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const isPostOwner = user && post.author.id === user.id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="hover:bg-secondary">
          <Link to="/feed">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feed
          </Link>
        </Button>
      </div>

      {/* Post Content */}
      <div className="mb-8">
        <PostCard 
          post={post} 
          showFullContent 
          onVote={(postId, voteType) => {
            if (user && token) {
              votePostMutation.mutate(voteType);
            } else {
              toast.error("Please sign in to vote");
            }
          }}
          userVote={null} // You can implement user vote tracking later
        />
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <Button 
            onClick={handleSummarizeWithAI}
            className="bg-gradient-accent hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Summarize with AI
          </Button>
          
          {isPostOwner && (
            <>
              <Button variant="outline" asChild className="border-border">
                <Link to={`/edit/${post.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Post
                </Link>
              </Button>
              
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Comments</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{comments?.length || 0} comments</span>
          </div>
        </div>

        {/* Add Comment Form */}
        {user && token ? (
          <Card className="p-6 bg-card border-border">
            <div className="flex gap-4">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] bg-secondary border-border focus:border-primary resize-none"
                />
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isCommentLoading}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {isCommentLoading ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 bg-card border-border text-center">
            <p className="text-muted-foreground mb-4">
              Please sign in to join the discussion
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild variant="outline" className="border-border">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-primary hover:opacity-90">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          </Card>
        )}

        {/* Comments List */}
        {commentsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment: Comment, index: number) => (
              <Card key={comment.id} className="p-6 bg-card border-border animate-slide-up" 
                style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {comment.author.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Comment Vote Button */}
                    <VoteButton
                      votes={comment.votes}
                      onVote={(voteType) => {
                        if (user && token) {
                          voteCommentMutation.mutate({ commentId: comment.id, voteType });
                        } else {
                          toast.error("Please sign in to vote");
                        }
                      }}
                      className="scale-75"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Link 
                        to={`/profile/${comment.author.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        u/{comment.author.username}
                      </Link>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(comment.createdAt)}
                      </div>
                    </div>
                    
                    <div className="text-foreground leading-relaxed">
                      {comment.content}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-card border-border">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No comments yet</h3>
            <p className="text-muted-foreground">
              Be the first to share your thoughts on this post!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PostDetail;