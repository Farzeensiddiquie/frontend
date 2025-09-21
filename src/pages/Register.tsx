import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Eye, 
  EyeOff, 
  MessageSquare, 
  Mail, 
  Lock, 
  User as UserIcon,
  Upload,
  X
} from "lucide-react";
import { authAPI, User } from "@/lib/api";
import { setStoredAuth } from "@/lib/auth";
import { toast } from "sonner";

interface RegisterProps {
  onLogin: (user: User, token: string) => void;
}

const Register = ({ onLogin }: RegisterProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError("");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Avatar image must be less than 5MB");
        return;
      }
      
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!formData.username.trim()) {
      setError("Username is required");
      setIsLoading(false);
      return;
    }

    // Username validation rules
    const username = formData.username.trim();
    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      setIsLoading(false);
      return;
    }

    if (username.length > 20) {
      setError("Username must be less than 20 characters long");
      setIsLoading(false);
      return;
    }

    // Check for invalid characters
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError("Username can only contain letters, numbers, underscores, and hyphens");
      setIsLoading(false);
      return;
    }

    // Check for reserved words and patterns
    const reservedWords = [
      'admin', 'administrator', 'root', 'user', 'test', 'api', 'www', 'mail', 'email', 
      'support', 'help', 'about', 'contact', 'system', 'service', 'app', 'application',
      'server', 'client', 'guest', 'anonymous', 'null', 'undefined', 'true', 'false',
      'login', 'logout', 'register', 'signup', 'signin', 'profile', 'settings', 'config',
      'dashboard', 'home', 'index', 'main', 'default', 'temp', 'temporary', 'demo'
    ];
    
    // Check if username contains reserved words
    if (reservedWords.some(word => username.toLowerCase().includes(word))) {
      setError("This username contains restricted words. Please choose a different username");
      setIsLoading(false);
      return;
    }
    
    // Check for numbers at the beginning (some backends don't allow this)
    if (/^\d/.test(username)) {
      setError("Username cannot start with a number. Please choose a different username");
      setIsLoading(false);
      return;
    }
    
    // Check for consecutive numbers (some backends restrict this)
    if (/\d{4,}/.test(username)) {
      setError("Username cannot contain more than 3 consecutive numbers. Please choose a different username");
      setIsLoading(false);
      return;
    }
    
    // Check for too many repeated characters (some backends restrict this)
    if (/(.)\1{2,}/.test(username)) {
      setError("Username cannot contain more than 2 consecutive identical characters. Please choose a different username");
      setIsLoading(false);
      return;
    }
    
    // Check for common patterns that might be rejected
    if (username.toLowerCase().includes('siddiqui')) {
      setError("This username pattern is not allowed. Please try a different username");
      setIsLoading(false);
      return;
    }
    
    // Check for minimum letter requirement (some backends require at least some letters)
    if (!/[a-zA-Z]/.test(username)) {
      setError("Username must contain at least one letter");
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      // Debug: Log what we're sending from frontend (remove in production)
      console.log('Frontend FormData contents:');
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await authAPI.register(formDataToSend);
      setStoredAuth(response.user, response.token);
      onLogin(response.user, response.token);
      toast.success("Welcome to the community!");
      navigate("/feed");
    } catch (error: unknown) {
      console.error('Registration error:', error);
      
      // Handle specific error types
      if (error instanceof Error && error.message) {
        setError(error.message);
      } else if (error && typeof error === 'object' && 'response' in error) {
        const responseError = error as { response?: { data?: { message?: string; errors?: any } } };
        let errorMessage = responseError.response?.data?.message || "Registration failed. Please check your information and try again.";
        
        // Check for specific field validation errors
        if (responseError.response?.data?.errors) {
          const errors = responseError.response.data.errors;
          if (errors.username || errors.userName || errors.fullName) {
            errorMessage = `Username error: ${errors.username || errors.userName || errors.fullName}`;
          } else if (errors.email) {
            errorMessage = `Email error: ${errors.email}`;
          } else if (errors.password) {
            errorMessage = `Password error: ${errors.password}`;
          }
        }
        
        setError(errorMessage);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError("Registration failed. Please check your information and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-card">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Join the community</h2>
          <p className="mt-2 text-muted-foreground">
            Create your account and start sharing knowledge
          </p>
        </div>

        {/* Registration Form */}
        <Card className="p-8 bg-card border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="border-destructive">
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarPreview || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {formData.username.charAt(0).toUpperCase() || <UserIcon className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                
                {avatarPreview && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <Label
                  htmlFor="avatar-upload"
                  className="cursor-pointer inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload avatar (optional)
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="pl-10 bg-secondary border-border focus:border-primary"
                  placeholder="Choose a username"
                />
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                3-20 characters, start with letter, avoid repeated characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email address</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="pl-10 bg-secondary border-border focus:border-primary"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="pl-10 pr-10 bg-secondary border-border focus:border-primary"
                  placeholder="Choose a strong password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="pl-10 pr-10 bg-secondary border-border focus:border-primary"
                  placeholder="Confirm your password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity h-11"
            >
              {isLoading ? (
                <div className="animate-pulse-glow">Creating account...</div>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary-hover transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo Info */}
        <Card className="p-4 bg-secondary/50 border-border">
          <p className="text-sm text-muted-foreground text-center">
            <strong className="text-foreground">Demo:</strong> Use any valid email format and password to test the registration flow
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Register;