import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  X, 
  Tag,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { postsAPI, User } from "@/lib/api";
import { toast } from "sonner";

interface CreatePostProps {
  user: User | null;
  token: string | null;
  isEdit?: boolean;
}

const CreatePost = ({ user, token, isEdit = false }: CreatePostProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing post data if editing
  const { data: existingPost } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsAPI.getPostById(id!),
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (isEdit && existingPost) {
      setFormData({
        title: existingPost.title,
        content: existingPost.content,
        tags: existingPost.tags || [],
      });
      if (existingPost.image) {
        setImagePreview(existingPost.image);
      }
    }
  }, [isEdit, existingPost]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [user, token, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image must be less than 5MB");
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const handleGenerateDraftWithAI = () => {
    toast.info("AI Draft Generation feature coming soon!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;
    
    setIsLoading(true);
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required");
      setIsLoading(false);
      return;
    }

    if (!formData.content.trim()) {
      setError("Content is required");
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('content', formData.content.trim());
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      
      if (image) {
        formDataToSend.append('image', image);
      }

      if (isEdit && id) {
        await postsAPI.updatePost(id, formDataToSend, token);
        toast.success("Post updated successfully!");
        navigate(`/post/${id}`);
      } else {
        const newPost = await postsAPI.createPost(formDataToSend, token);
        toast.success("Post created successfully!");
        navigate(`/post/${newPost.id}`);
      }
    } catch (error) {
      setError(isEdit ? "Failed to update post" : "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !token) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" asChild className="hover:bg-secondary">
            <Link to="/feed">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              {isEdit ? "Edit Post" : "Create New Post"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Share your knowledge with the developer community
            </p>
          </div>
        </div>

        <Button 
          onClick={handleGenerateDraftWithAI}
          variant="outline"
          className="border-border hover:bg-secondary"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Draft with AI
        </Button>
      </div>

      {/* Form */}
      <Card className="p-8 bg-card border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert className="border-destructive">
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Title
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="text-lg bg-secondary border-border focus:border-primary"
              placeholder="What's your post about?"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-foreground">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={12}
              className="bg-secondary border-border focus:border-primary resize-none"
              placeholder="Share your knowledge, insights, or ask a question..."
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <Label className="text-foreground flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Image (optional)
            </Label>
            
            {imagePreview ? (
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-w-full h-48 object-cover rounded-lg border border-border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Upload className="h-8 w-8" />
                  <span>Click to upload an image</span>
                  <span className="text-sm">PNG, JPG, GIF up to 5MB</span>
                </Label>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <Label className="text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags (up to 5)
            </Label>
            
            <div className="flex gap-2 items-center">
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyPress}
                placeholder="Add a tag..."
                className="flex-1 bg-secondary border-border focus:border-primary"
                disabled={formData.tags.length >= 5}
              />
              <Button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim() || formData.tags.length >= 5}
                variant="outline"
                className="border-border"
              >
                Add
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-secondary text-foreground flex items-center gap-1"
                  >
                    #{tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(tag)}
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-primary hover:opacity-90 transition-opacity px-8 py-3 h-auto"
            >
              {isLoading ? (
                <div className="animate-pulse-glow">
                  {isEdit ? "Updating..." : "Publishing..."}
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  {isEdit ? "Update Post" : "Publish Post"}
                </span>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreatePost;