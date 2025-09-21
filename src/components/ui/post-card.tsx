import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VoteButton } from "@/components/ui/vote-button";
import { MessageCircle, Clock } from "lucide-react";
import { Post } from "@/lib/api";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onVote?: (postId: string, voteType: 'up' | 'down') => void;
  userVote?: 'up' | 'down' | null;
  showFullContent?: boolean;
  className?: string;
}

export const PostCard = ({
  post,
  onVote,
  userVote,
  showFullContent = false,
  className,
}: PostCardProps) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const truncateContent = (content: string, maxLength = 200) => {
    if (showFullContent || content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <Card className={cn(
      "p-4 bg-card border-border hover:bg-card-hover transition-all duration-200 animate-fade-in",
      "hover:shadow-card-hover",
      className
    )}>
      <div className="flex gap-3">
        {/* Vote Section */}
        {onVote && (
          <VoteButton
            votes={post.votes}
            userVote={userVote}
            onVote={(voteType) => onVote(post.id, voteType)}
            className="flex-shrink-0"
          />
        )}
        
        {/* Content Section */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {post.author.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Link 
              to={`/profile/${post.author.id}`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              u/{post.author.username}
            </Link>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(post.createdAt)}
            </div>
          </div>

          {/* Title */}
          <Link to={`/post/${post.id}`} className="block group">
            <h2 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
              {post.title}
            </h2>
          </Link>

          {/* Content */}
          <div className="text-muted-foreground mb-3 leading-relaxed">
            <p className={showFullContent ? "" : "line-clamp-3"}>
              {truncateContent(post.content)}
            </p>
          </div>

          {/* Image */}
          {post.image && (
            <div className="mb-3 rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-secondary hover:bg-secondary-hover transition-colors"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              to={`/post/${post.id}`}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Comments</span>
            </Link>
            
            {!showFullContent && (
              <Link
                to={`/post/${post.id}`}
                className="text-primary hover:text-primary-hover transition-colors font-medium"
              >
                Read more
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};