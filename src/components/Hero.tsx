
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";
import { Movie, getImageUrl } from "@/services/movieService";
import { Link } from "react-router-dom";

interface HeroProps {
  movie: Movie;
}

const Hero: React.FC<HeroProps> = ({ movie }) => {
  const title = movie?.title || movie?.name || "";
  const mediaType = movie?.media_type || (movie?.first_air_date ? "tv" : "movie");
  
  return (
    <div className="hero-section" style={{ backgroundImage: `url(${getImageUrl(movie?.backdrop_path, "original")})` }}>
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-gray-300 line-clamp-3 mb-4">{movie?.overview}</p>
        <div className="flex gap-3">
          <Link to={`/details/${mediaType}/${movie?.id}`}>
            <Button className="bg-netflix-red hover:bg-netflix-red/80">
              <Play className="mr-2 h-4 w-4" /> Play
            </Button>
          </Link>
          <Link to={`/details/${mediaType}/${movie?.id}`}>
            <Button variant="secondary">
              <Info className="mr-2 h-4 w-4" /> More Info
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
