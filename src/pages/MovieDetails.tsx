
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Plus, ThumbsUp, Check } from "lucide-react";
import { 
  fetchMovieDetails, 
  fetchMovieCast, 
  MovieDetails, 
  Cast, 
  getImageUrl,
  getRatingColor
} from "@/services/movieService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { addToMyList, removeFromMyList, isInMyList } from "@/services/myListService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const MovieDetailsPage: React.FC = () => {
  const { id, type = "movie" } = useParams<{ id: string, type: string }>();
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [inMyList, setInMyList] = useState(false);
  const [loginDialog, setLoginDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [detailsData, castData] = await Promise.all([
          fetchMovieDetails(id, type || "movie"),
          fetchMovieCast(id, type || "movie")
        ]);
        
        setDetails(detailsData);
        setCast(castData.slice(0, 10)); // Get first 10 cast members
        
        // Check if movie is in My List
        setInMyList(isInMyList(Number(id), !!user));
      } catch (error) {
        console.error("Error fetching details:", error);
        toast({
          title: "Error",
          description: "Failed to load details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, type, toast, user]);

  const handleMyListClick = () => {
    if (!user) {
      setLoginDialog(true);
      return;
    }

    if (!details) return;

    if (inMyList) {
      const success = removeFromMyList(details.id, !!user);
      if (success) setInMyList(false);
    } else {
      const movieData = {
        id: details.id,
        title: details.title,
        name: details.name,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        overview: details.overview,
        release_date: details.release_date,
        first_air_date: details.first_air_date,
        vote_average: details.vote_average,
        media_type: type
      };
      
      const success = addToMyList(movieData, !!user);
      if (success) setInMyList(true);
    }
  };

  if (loading || !details) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-netflix-red border-t-transparent"></div>
      </div>
    );
  }

  const title = details.title || details.name || "";
  const releaseYear = details.release_date 
    ? new Date(details.release_date).getFullYear() 
    : details.first_air_date 
      ? new Date(details.first_air_date).getFullYear() 
      : "";

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Hero Banner */}
      <div 
        className="relative h-[70vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${getImageUrl(details.backdrop_path, "original")})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3 lg:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          
          {details.tagline && (
            <p className="text-netflix-gray text-lg italic mb-4">{details.tagline}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {releaseYear && <span className="text-netflix-light">{releaseYear}</span>}
            
            {details.vote_average && (
              <span className={`${getRatingColor(details.vote_average)} font-medium`}>
                {details.vote_average.toFixed(1)}/10
              </span>
            )}
            
            {details.runtime && (
              <span className="text-netflix-light">
                {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
              </span>
            )}
            
            {details.number_of_seasons && (
              <span className="text-netflix-light">
                {details.number_of_seasons} {details.number_of_seasons === 1 ? "Season" : "Seasons"}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <Button className="bg-netflix-red hover:bg-netflix-red/80">
              <Play className="mr-2 h-4 w-4" /> Play
            </Button>
            <Button 
              variant="secondary"
              onClick={handleMyListClick}
            >
              {inMyList ? (
                <><Check className="mr-2 h-4 w-4" /> In My List</>
              ) : (
                <><Plus className="mr-2 h-4 w-4" /> My List</>
              )}
            </Button>
            <Button variant="outline" className="border-netflix-gray text-netflix-light">
              <ThumbsUp className="mr-2 h-4 w-4" /> Rate
            </Button>
          </div>
          
          <p className="text-netflix-light line-clamp-4 md:line-clamp-none">
            {details.overview}
          </p>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Cast Section */}
        {cast.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {cast.map((person) => (
                <div key={person.id} className="bg-netflix-dark rounded-md overflow-hidden">
                  <img
                    src={getImageUrl(person.profile_path)}
                    alt={person.name}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="p-2">
                    <h3 className="font-medium line-clamp-1">{person.name}</h3>
                    <p className="text-sm text-netflix-gray line-clamp-1">{person.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Details Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Details</h2>
            <div className="bg-netflix-dark rounded-md p-4">
              {details.genres && details.genres.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-netflix-gray mb-1">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map((genre) => (
                      <span 
                        key={genre.id} 
                        className="px-3 py-1 bg-netflix-gray/20 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {details.status && (
                <div className="mb-4">
                  <h3 className="text-netflix-gray mb-1">Status</h3>
                  <p>{details.status}</p>
                </div>
              )}
              
              {details.homepage && (
                <div>
                  <h3 className="text-netflix-gray mb-1">Official Website</h3>
                  <a 
                    href={details.homepage} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-netflix-red hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Dialog */}
      <Dialog open={loginDialog} onOpenChange={setLoginDialog}>
        <DialogContent className="bg-netflix-dark border-netflix-gray text-white">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
          </DialogHeader>
          <p className="py-4">Please login to add items to your list.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setLoginDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-netflix-red hover:bg-netflix-red/80"
              onClick={() => {
                setLoginDialog(false);
                window.location.href = "/login";
              }}
            >
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MovieDetailsPage;
