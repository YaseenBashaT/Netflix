
import React from "react";
import MovieCard from "./MovieCard";
import { Movie } from "@/services/movieService";

interface MovieRowProps {
  title: string;
  movies: Movie[] | undefined;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="movie-row mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="p-4 bg-gray-800 rounded">
          <p className="text-gray-400">No movies available at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-row mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
