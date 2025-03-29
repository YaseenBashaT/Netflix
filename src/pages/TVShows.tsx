
import React, { useState, useEffect } from "react";
import MovieRow from "@/components/MovieRow";
import { fetchTVShows, Movie } from "@/services/movieService";
import { useToast } from "@/hooks/use-toast";

const TVShows: React.FC = () => {
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchTVShows();
        setTvShows(data || []);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
        toast({
          title: "Error",
          description: "Failed to load TV shows. The API key may be invalid.",
          variant: "destructive",
        });
        setTvShows([]);
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
    <div className="min-h-screen bg-netflix-black pt-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">TV Shows</h1>
        
        {tvShows.length === 0 ? (
          <div className="p-6 bg-gray-800 rounded">
            <p className="text-gray-400">No TV shows available at this time. There might be an issue with the API connection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {tvShows.map((show) => (
              <div key={show.id} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  className="movie-poster rounded"
                />
                <div className="movie-overlay">
                  <h3 className="text-sm font-medium line-clamp-1">{show.name}</h3>
                  {show.first_air_date && (
                    <p className="text-xs text-gray-400">{new Date(show.first_air_date).getFullYear()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShows;
