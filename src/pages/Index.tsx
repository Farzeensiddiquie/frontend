import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/ui/post-card";
import { ArrowRight, TrendingUp, Users, MessageSquare, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { postsAPI, statsAPI } from "@/lib/api";

const Index = () => {
  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts', 1],
    queryFn: () => postsAPI.getAllPosts(1),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => statsAPI.getStats(),
  });

  const featuredPosts = postsData?.posts?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-background/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Developer
              </span>
              <br />
              <span className="text-foreground">Community</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-up">
              Share knowledge, discover insights, and connect with fellow developers
              in our thriving community platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Button 
                size="lg" 
                asChild
                className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-4 h-auto"
              >
                <Link to="/feed" className="flex items-center gap-2">
                  Explore Posts
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="border-border hover:bg-secondary text-lg px-8 py-4 h-auto"
              >
                <Link to="/register">Join Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center bg-card border-border hover:bg-card-hover transition-all duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {statsLoading ? (
                  <div className="h-8 bg-muted rounded w-16 mx-auto animate-pulse" />
                ) : (
                  `${statsData?.users || 0}${statsData?.users && statsData.users > 999 ? '+' : ''}`
                )}
              </h3>
              <p className="text-muted-foreground">Active Developers</p>
            </Card>
            
            <Card className="p-6 text-center bg-card border-border hover:bg-card-hover transition-all duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-accent rounded-lg mb-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {statsLoading ? (
                  <div className="h-8 bg-muted rounded w-16 mx-auto animate-pulse" />
                ) : (
                  `${statsData?.posts || 0}${statsData?.posts && statsData.posts > 999 ? '+' : ''}`
                )}
              </h3>
              <p className="text-muted-foreground">Posts Shared</p>
            </Card>
            
            <Card className="p-6 text-center bg-card border-border hover:bg-card-hover transition-all duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mb-4">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {statsLoading ? (
                  <div className="h-8 bg-muted rounded w-16 mx-auto animate-pulse" />
                ) : (
                  `${statsData?.totalScore || 0}${statsData?.totalScore && statsData.totalScore > 999 ? '+' : ''}`
                )}
              </h3>
              <p className="text-muted-foreground">Knowledge Points</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Trending Posts</h2>
              <p className="text-muted-foreground">
                Discover the most popular discussions in our community
              </p>
            </div>
            
            <Button asChild variant="outline" className="border-border hover:bg-secondary">
              <Link to="/feed" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                View All
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-muted rounded w-16" />
                    <div className="h-5 bg-muted rounded w-20" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {featuredPosts.map((post, index) => (
                <div key={post.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
          
          {featuredPosts.length === 0 && !isLoading && (
            <Card className="p-12 text-center bg-card border-border">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share something amazing with the community!
              </p>
              <Button asChild className="bg-gradient-primary hover:opacity-90">
                <Link to="/create">Create First Post</Link>
              </Button>
            </Card>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-card to-secondary border-t border-border">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Join the Conversation?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Share your knowledge, learn from others, and grow together as developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-4 h-auto">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-border hover:bg-card text-lg px-8 py-4 h-auto">
              <Link to="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
