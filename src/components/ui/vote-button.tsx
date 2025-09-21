import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  votes: number;
  userVote?: 'up' | 'down' | null;
  onVote: (voteType: 'up' | 'down') => void;
  disabled?: boolean;
  className?: string;
}

export const VoteButton = ({
  votes,
  userVote,
  onVote,
  disabled = false,
  className,
}: VoteButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleVote = (voteType: 'up' | 'down') => {
    if (disabled) return;
    
    setIsAnimating(true);
    onVote(voteType);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote('up')}
        disabled={disabled}
        className={cn(
          "h-8 w-8 p-0 rounded-lg transition-all duration-200",
          userVote === 'up' 
            ? "bg-upvote text-white hover:bg-upvote-hover" 
            : "hover:bg-secondary hover:text-upvote",
          isAnimating && userVote === 'up' && "animate-vote-bounce"
        )}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      
      <span className={cn(
        "text-sm font-medium transition-colors duration-200",
        userVote === 'up' ? "text-upvote" : 
        userVote === 'down' ? "text-downvote" : 
        "text-muted-foreground"
      )}>
        {votes}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote('down')}
        disabled={disabled}
        className={cn(
          "h-8 w-8 p-0 rounded-lg transition-all duration-200",
          userVote === 'down' 
            ? "bg-downvote text-white hover:bg-downvote-hover" 
            : "hover:bg-secondary hover:text-downvote",
          isAnimating && userVote === 'down' && "animate-vote-bounce"
        )}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};