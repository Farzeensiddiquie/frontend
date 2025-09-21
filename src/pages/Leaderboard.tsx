import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  Star,
  TrendingUp,
  Users,
  ArrowUp
} from "lucide-react";
import { leaderboardAPI, LeaderboardEntry } from "@/lib/api";

const Leaderboard = () => {
  const { data: leaderboard, isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: leaderboardAPI.getLeaderboard,
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "Champion";
      case 2:
        return "Expert";
      case 3:
        return "Specialist";
      default:
        return `Rank #${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500 to-amber-500";
      case 2:
        return "bg-gradient-to-r from-gray-400 to-slate-500";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-orange-500";
      default:
        return "bg-gradient-primary";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-6">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Community Leaderboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Celebrating our top contributors who make our developer community amazing
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="p-6 text-center bg-card border-border hover:bg-card-hover transition-all duration-200">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mb-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {leaderboard?.length || 0}
          </h3>
          <p className="text-muted-foreground">Top Contributors</p>
        </Card>
        
        <Card className="p-6 text-center bg-card border-border hover:bg-card-hover transition-all duration-200">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-accent rounded-lg mb-4">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {leaderboard?.[0]?.score || 0}
          </h3>
          <p className="text-muted-foreground">Highest Score</p>
        </Card>
        
        <Card className="p-6 text-center bg-card border-border hover:bg-card-hover transition-all duration-200">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mb-4">
            <Star className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Weekly</h3>
          <p className="text-muted-foreground">Updated</p>
        </Card>
      </div>

      {/* Leaderboard */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
                <div className="h-6 bg-muted rounded w-20" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="p-12 text-center bg-card border-border">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Error loading leaderboard</h3>
          <p className="text-muted-foreground">
            Something went wrong while fetching the leaderboard. Please try again.
          </p>
        </Card>
      ) : leaderboard && leaderboard.length > 0 ? (
        <div className="space-y-4">
          {leaderboard.map((entry: LeaderboardEntry, index: number) => (
            <Card 
              key={entry.user.id} 
              className={`p-6 bg-card border-border hover:bg-card-hover transition-all duration-200 animate-slide-up ${
                entry.rank <= 3 ? 'ring-2 ring-primary/20' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-6">
                {/* Rank */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary">
                    {getRankIcon(entry.rank)}
                  </div>
                  <span className="text-lg font-bold text-foreground">
                    #{entry.rank}
                  </span>
                </div>

                {/* Avatar */}
                <Link to={`/profile/${entry.user.id}`} className="group">
                  <Avatar className="h-16 w-16 ring-2 ring-border group-hover:ring-primary transition-all">
                    <AvatarImage src={entry.user.avatar} />
                    <AvatarFallback className={`text-xl text-white ${getRankColor(entry.rank)}`}>
                      {entry.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Link 
                      to={`/profile/${entry.user.id}`}
                      className="text-xl font-bold text-foreground hover:text-primary transition-colors truncate"
                    >
                      {entry.user.username}
                    </Link>
                    
                    <Badge 
                      className={`text-white ${getRankColor(entry.rank)} border-none`}
                    >
                      {getRankBadge(entry.rank)}
                    </Badge>
                  </div>
                  
                  {entry.user.bio && (
                    <p className="text-muted-foreground text-sm truncate">
                      {entry.user.bio}
                    </p>
                  )}
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                    <ArrowUp className="h-5 w-5" />
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </div>

              {/* Top 3 Special Styling */}
              {entry.rank <= 3 && (
                <div className={`mt-4 h-1 rounded-full ${getRankColor(entry.rank)}`} />
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center bg-card border-border">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No rankings yet</h3>
          <p className="text-muted-foreground mb-4">
            Be the first to contribute and claim the top spot!
          </p>
          <Link 
            to="/create"
            className="inline-flex items-center gap-2 bg-gradient-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Contributing
          </Link>
        </Card>
      )}

      {/* Footer Info */}
      <div className="mt-12 text-center">
        <Card className="p-6 bg-secondary/50 border-border">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">How points are calculated</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Points are awarded for creating posts, receiving upvotes, and engaging with the community. 
            The leaderboard is updated weekly to reflect the most active contributors.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;