
import React, { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import { fetchTrending, fetchMovies, fetchTVShows, Movie } from "@/services/movieService";
import { useToast } from "@/hooks/use-toast";

const Index: React.FC = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data concurrently, but handle failures gracefully
        const results = await Promise.allSettled([
          fetchTrending(),
          fetchMovies(),
          fetchTVShows()
        ]);
        
        // Handle the results safely
        if (results[0].status === 'fulfilled') {
          setTrending(results[0].value);
          // Set random trending movie as hero if data exists
          if (results[0].value && results[0].value.length > 0) {
            const randomIndex = Math.floor(Math.random() * Math.min(5, results[0].value.length));
            setHeroMovie(results[0].value[randomIndex]);
          }
        }
        
        if (results[1].status === 'fulfilled') {
          setMovies(results[1].value);
        }
        
        if (results[2].status === 'fulfilled') {
          setTvShows(results[2].value);
        }
        
        // Check if all requests failed
        const allFailed = results.every(result => result.status === 'rejected');
        if (allFailed) {
          console.error("Error fetching data: All API requests failed");
          toast({
            title: "API Error",
            description: "There was an issue connecting to the movie database. The API key may be invalid.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load content. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-netflix-red border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {heroMovie && <Hero movie={heroMovie} />}
      
      <div className="container mx-auto px-4 py-8 movie-rows">
        <MovieRow title="Trending Now" movies={trending} />
        <MovieRow title="Popular Movies" movies={movies} />
        <MovieRow title="Popular TV Shows" movies={tvShows} />
      </div>
    </div>
  );
};

export default Index;
