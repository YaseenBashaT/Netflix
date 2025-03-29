
const API_KEY = "0ee1c64df87d55dcebc6bd638e415d73"; // Updated TMDB API key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: string;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  tagline?: string;
  homepage?: string;
  status?: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

// Fallback data in case the API fails
const fallbackMovies: Movie[] = [
  {
    id: 1,
    title: "Fallback Movie 1",
    poster_path: "/placeholder.svg",
    backdrop_path: "/placeholder.svg",
    overview: "This is a fallback movie provided because the API could not be reached.",
    release_date: "2023-01-01",
    vote_average: 7.5,
    media_type: "movie"
  },
  {
    id: 2,
    title: "Fallback Movie 2",
    poster_path: "/placeholder.svg",
    backdrop_path: "/placeholder.svg",
    overview: "This is another fallback movie provided because the API could not be reached.",
    release_date: "2023-02-15",
    vote_average: 8.0,
    media_type: "movie"
  },
  {
    id: 3,
    name: "Fallback TV Show",
    poster_path: "/placeholder.svg",
    backdrop_path: "/placeholder.svg",
    overview: "This is a fallback TV show provided because the API could not be reached.",
    first_air_date: "2023-03-10",
    vote_average: 8.2,
    media_type: "tv"
  }
];

export const fetchTrending = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    
    if (data.success === false) {
      console.warn("API Error:", data.status_message);
      return fallbackMovies;
    }
    
    return data.results;
  } catch (error) {
    console.error("Error fetching trending data:", error);
    return fallbackMovies;
  }
};

export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    
    if (data.success === false) {
      console.warn("API Error:", data.status_message);
      return fallbackMovies.filter(movie => movie.title);
    }
    
    return data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return fallbackMovies.filter(movie => movie.title);
  }
};

export const fetchTVShows = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    
    if (data.success === false) {
      console.warn("API Error:", data.status_message);
      return fallbackMovies.filter(movie => movie.name);
    }
    
    return data.results;
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    return fallbackMovies.filter(movie => movie.name);
  }
};

export const fetchMovieDetails = async (id: string, type: string): Promise<MovieDetails> => {
  const response = await fetch(
    `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();
  return data;
};

export const fetchMovieCast = async (id: string, type: string): Promise<Cast[]> => {
  const response = await fetch(
    `${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();
  return data.credits?.cast || data.cast || [];
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  const response = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
      query
    )}&page=1&include_adult=false`
  );
  const data = await response.json();
  return data.results;
};

export const getImageUrl = (path: string, size: string = "w500") => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getFullYear = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).getFullYear();
};

export const getRatingColor = (rating: number) => {
  if (rating >= 7) return "text-green-500";
  if (rating >= 5) return "text-yellow-500";
  return "text-red-500";
};
