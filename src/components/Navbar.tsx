
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, X, Menu, Film, Tv, TrendingUp, User, LogOut, ListPlus } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Navbar: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-netflix-black/90 shadow-md" : "bg-gradient-to-b from-netflix-black/90 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-netflix-red">CinemaFlix</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-4">
              <Link to="/" className="text-netflix-light hover:text-netflix-red px-2 py-1 rounded">
                Home
              </Link>
              <Link to="/movies" className="text-netflix-light hover:text-netflix-red px-2 py-1 rounded">
                Movies
              </Link>
              <Link to="/tvshows" className="text-netflix-light hover:text-netflix-red px-2 py-1 rounded">
                TV Shows
              </Link>
              <Link to="/trending" className="text-netflix-light hover:text-netflix-red px-2 py-1 rounded">
                Trending
              </Link>
              {user && (
                <Link to="/mylist" className="text-netflix-light hover:text-netflix-red px-2 py-1 rounded">
                  My List
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center">
            {/* Search Bar */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Titles, people, genres..."
                  className="w-full md:w-60 h-9 pl-10 pr-10 bg-netflix-dark"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-netflix-dark text-netflix-light"
              >
                <Search className="h-5 w-5" />
              </button>
            )}

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-4 flex items-center focus:outline-none">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src="" alt={user.name || user.email} />
                      <AvatarFallback className="bg-netflix-red">
                        {user.name?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-netflix-dark border-netflix-gray">
                  <DropdownMenuLabel className="text-netflix-light">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-netflix-gray/20" />
                  <DropdownMenuItem className="text-netflix-light hover:text-white cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/mylist")}
                    className="text-netflix-light hover:text-white cursor-pointer"
                  >
                    <ListPlus className="mr-2 h-4 w-4" /> My List
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-netflix-light hover:text-white cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="ml-4 flex space-x-2">
                <Link to="/login">
                  <Button variant="outline" className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="hidden md:block">
                  <Button className="bg-netflix-red hover:bg-netflix-red/80">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-4 md:hidden p-2 rounded-full hover:bg-netflix-dark text-netflix-light"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-netflix-dark">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="flex items-center text-netflix-light hover:text-netflix-red block px-3 py-2 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              <TrendingUp className="mr-2 h-4 w-4" /> Home
            </Link>
            <Link
              to="/movies"
              className="flex items-center text-netflix-light hover:text-netflix-red block px-3 py-2 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Film className="mr-2 h-4 w-4" /> Movies
            </Link>
            <Link
              to="/tvshows"
              className="flex items-center text-netflix-light hover:text-netflix-red block px-3 py-2 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Tv className="mr-2 h-4 w-4" /> TV Shows
            </Link>
            <Link
              to="/trending"
              className="flex items-center text-netflix-light hover:text-netflix-red block px-3 py-2 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              <TrendingUp className="mr-2 h-4 w-4" /> Trending
            </Link>
            {user && (
              <Link
                to="/mylist"
                className="flex items-center text-netflix-light hover:text-netflix-red block px-3 py-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListPlus className="mr-2 h-4 w-4" /> My List
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
