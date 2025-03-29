
import React from "react";
import { Link } from "react-router-dom";
import { Movie, getImageUrl, getFullYear } from "@/services/movieService";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const title = movie.title || movie.name || "Untitled";
  const releaseDate = movie.release_date || movie.first_air_date;
  const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie");
  
  return (
    <Link to={`/details/${mediaType}/${movie.id}`} className="movie-card min-w-[180px]">
      <img
        src={getImageUrl(movie.poster_path)}
        alt={title}
        className="movie-poster rounded w-full h-[270px] object-cover bg-gray-800"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
      <div className="movie-overlay">
        <h3 className="text-sm font-medium line-clamp-1">{title}</h3>
        {releaseDate && (
          <p className="text-xs text-gray-400">{getFullYear(releaseDate)}</p>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
