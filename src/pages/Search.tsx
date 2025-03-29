
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies, Movie, getImageUrl } from "@/services/movieService";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      try {
        setLoading(true);
        const data = await searchMovies(query);
        setResults(data);
      } catch (error) {
        console.error("Error searching:", error);
        toast({
          title: "Error",
          description: "Failed to search. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, toast]);

  return (
    <div className="min-h-screen bg-netflix-black pt-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-netflix-gray mb-6">
          {results.length} {results.length === 1 ? "result" : "results"} for "{query}"
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-netflix-red border-t-transparent"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item) => {
              const title = item.title || item.name || "Untitled";
              const releaseDate = item.release_date || item.first_air_date;
              const mediaType = item.media_type || (item.first_air_date ? "tv" : "movie");
              
              return (
                <Link key={item.id} to={`/details/${mediaType}/${item.id}`} className="movie-card">
                  <img
                    src={getImageUrl(item.poster_path)}
                    alt={title}
                    className="movie-poster rounded"
                  />
                  <div className="movie-overlay">
                    <h3 className="text-sm font-medium line-clamp-1">{title}</h3>
                    {releaseDate && (
                      <p className="text-xs text-netflix-gray">
                        {new Date(releaseDate).getFullYear()}
                      </p>
                    )}
                    <p className="text-xs text-netflix-red capitalize">{mediaType}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-netflix-gray text-lg mb-4">No results found for "{query}"</p>
            <p className="text-netflix-gray text-sm">
              Try adjusting your search or browse our categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
