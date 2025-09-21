import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCard } from "@/components/ui/post-card";
import { 
  User as UserIcon, 
  MapPin, 
  Calendar, 
  Trophy, 
  MessageSquare,
  FileText,
  Edit,
  ArrowLeft
} from "lucide-react";
import { usersAPI, postsAPI, commentsAPI, User, Post, Comment } from "@/lib/api";

interface ProfileProps {
  currentUser: User | null;
}

const Profile = ({ currentUser }: ProfileProps) => {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState("posts");

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersAPI.getUserById(userId!),
    enabled: !!userId,
  });

  const { data: userPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['user-posts', userId],
    queryFn: () => postsAPI.getUserPosts(userId!),
    enabled: !!userId && activeTab === 'posts',
  });

  const { data: userComments, isLoading: commentsLoading } = useQuery({
    queryKey: ['user-comments', userId],
    queryFn: () => commentsAPI.getUserComments(userId!),
    enabled: !!userId && activeTab === 'comments',
  });

  const isOwnProfile = currentUser && user && currentUser.id === user.id;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  if (userLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 animate-pulse">
          <div className="flex gap-6">
            <div className="w-24 h-24 bg-muted rounded-full" />
            <div className="flex-1">
              <div className="h-8 bg-muted rounded w-1/3 mb-2" />
              <div className="h-4 bg-muted rounded w-1/4 mb-4" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-12 text-center bg-card border-border">
          <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">User not found</h3>
          <p className="text-muted-foreground mb-4">
            The user profile you're looking for doesn't exist.
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

      {/* Profile Header */}
      <Card className="p-8 mb-8 bg-card border-border">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {isOwnProfile && (
              <Button variant="outline" size="sm" className="border-border">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {user.username}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    <span>{user.score} points</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {user.bio && (
              <p className="text-foreground leading-relaxed mb-4">
                {user.bio}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-foreground">
                  {userPosts?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-foreground">
                  {userComments?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-primary">
                  {user.score}
                </div>
                <div className="text-sm text-muted-foreground">Reputation</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Posts ({userPosts?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments ({userComments?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {postsLoading ? (
            <div className="space-y-6">
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
          ) : userPosts && userPosts.length > 0 ? (
            <div className="space-y-6">
              {userPosts.map((post: Post, index: number) => (
                <div key={post.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-card border-border">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                {isOwnProfile 
                  ? "Share your first post with the community!" 
                  : `${user.username} hasn't posted anything yet.`}
              </p>
              {isOwnProfile && (
                <Button asChild className="bg-gradient-primary hover:opacity-90">
                  <Link to="/create">Create Your First Post</Link>
                </Button>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comments">
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
          ) : userComments && userComments.length > 0 ? (
            <div className="space-y-4">
              {userComments.map((comment: Comment, index: number) => (
                <Card key={comment.id} className="p-6 bg-card border-border animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="mb-3">
                    <Link 
                      to={`/post/${comment.postId}`}
                      className="text-sm text-primary hover:text-primary-hover transition-colors"
                    >
                      View original post →
                    </Link>
                  </div>
                  <div className="text-foreground leading-relaxed">
                    {comment.content}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      <span>{comment.votes} votes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-card border-border">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No comments yet</h3>
              <p className="text-muted-foreground">
                {isOwnProfile 
                  ? "Join the conversation by commenting on posts!" 
                  : `${user.username} hasn't commented on any posts yet.`}
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;