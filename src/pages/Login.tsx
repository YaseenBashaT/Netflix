
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://assets.nflxext.com/ffe/siteui/vlv3/32c47234-8398-4a4f-a6b5-6803881d38bf/eed3a573-8db7-47ca-a99c-434d3481e3f0/US-en-20240923-popsignuptwoweeks-perspective_alpha_website_medium.jpg')" }}
    >
      <div className="bg-black/75 p-8 rounded-md max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-netflix-red">CinemaFlix</h1>
        </div>
        
        <h2 className="text-3xl font-bold mb-6">Sign In</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-2 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-netflix-dark"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-netflix-dark"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-netflix-red hover:bg-netflix-red/80"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 accent-netflix-red"
              />
              <Label htmlFor="remember" className="text-netflix-gray text-sm">Remember me</Label>
            </div>
            
            <a href="#" className="text-netflix-gray text-sm hover:underline">
              Need help?
            </a>
          </div>
        </form>
        
        <div className="mt-8">
          <p className="text-netflix-gray">
            New to CinemaFlix?{" "}
            <Link to="/signup" className="text-white hover:underline">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
