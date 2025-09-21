import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { getStoredAuth, clearStoredAuth } from "@/lib/auth";
import { User } from "@/lib/api";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getStoredAuth();
    if (auth.isAuthenticated) {
      setUser(auth.user);
      setToken(auth.token);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    clearStoredAuth();
    setUser(null);
    setToken(null);
  };

  const handleLogin = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-glow">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navbar user={user} onLogout={handleLogout} />
            <main className="pb-8">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/post/:id" element={<PostDetail user={user} token={token} />} />
                <Route path="/create" element={<CreatePost user={user} token={token} />} />
                <Route path="/edit/:id" element={<CreatePost user={user} token={token} isEdit />} />
                <Route path="/profile/:userId" element={<Profile currentUser={user} />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register onLogin={handleLogin} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
