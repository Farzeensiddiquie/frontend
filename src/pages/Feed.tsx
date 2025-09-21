import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostCard } from "@/components/ui/post-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp, MessageSquare } from "lucide-react";
import { postsAPI } from "@/lib/api";
import { toast } from "sonner";

const Feed = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const queryClient = useQueryClient();

  const { data: postsData, isLoading, error } = useQuery({
    queryKey: ['posts', currentPage, searchQuery],
    queryFn: () => postsAPI.getAllPosts(currentPage, searchQuery),
  });

  const voteMutation = useMutation({
    mutationFn: ({ postId, voteType }: { postId: string; voteType: 'up' | 'down' }) => 
      postsAPI.votePost(postId, voteType, ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => {
      toast.error("Failed to vote. Please try again.");
    },
  });

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    voteMutation.mutate({ postId, voteType });
  };

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
      setLocalSearch(search);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setCurrentPage(1);
    if (localSearch) {
      setSearchParams({ search: localSearch });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
    setCurrentPage(1);
    setSearchParams({});
  };

  const posts = postsData?.posts || [];
  const totalPages = Math.ceil((postsData?.total || 0) / 10);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Community Feed</h1>
        <p className="text-muted-foreground">
          Discover and engage with the latest posts from our developer community
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 mb-8 bg-card border-border">
        <form onSubmit={handleSearch} className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search posts..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 bg-secondary border-border focus:border-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <Button type="submit" className="bg-gradient-primary hover:opacity-90">
            Search
          </Button>
          
          {searchQuery && (
            <Button variant="outline" onClick={clearSearch} className="border-border">
              Clear
            </Button>
          )}
        </form>

        {searchQuery && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Searching for:</span>
            <Badge variant="secondary" className="bg-secondary">
              {searchQuery}
            </Badge>
          </div>
        )}
      </Card>

      {/* Posts */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-muted rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-muted rounded w-16" />
                    <div className="h-5 bg-muted rounded w-20" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="p-12 text-center bg-card border-border">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Error loading posts</h3>
          <p className="text-muted-foreground">
            Something went wrong while fetching the posts. Please try again.
          </p>
        </Card>
      ) : posts.length === 0 ? (
        <Card className="p-12 text-center bg-card border-border">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchQuery ? 'No posts found' : 'No posts yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? 'Try adjusting your search terms or browse all posts'
              : 'Be the first to share something amazing with the community!'
            }
          </p>
          {searchQuery && (
            <Button onClick={clearSearch} variant="outline" className="border-border mr-4">
              Show All Posts
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div className="space-y-6">
            {posts.map((post, index) => (
              <div key={post.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <PostCard 
                  post={post} 
                  onVote={handleVote}
                  userVote={null} // You can implement user vote tracking later
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="border-border"
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  const isActive = page === currentPage;
                  
                  return (
                    <Button
                      key={page}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={isActive ? "bg-gradient-primary" : ""}
                    >
                      {page}
                    </Button>
                  );
                })}
                
                {totalPages > 5 && (
                  <>
                    <span className="text-muted-foreground px-2">...</span>
                    <Button
                      variant={currentPage === totalPages ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className={currentPage === totalPages ? "bg-gradient-primary" : ""}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="border-border"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Feed;