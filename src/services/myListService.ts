
import { Movie } from "./movieService";
import { toast } from "sonner";

export interface MyListItem extends Movie {
  addedAt: number;
}

export const addToMyList = (movie: Movie, isAuthenticated: boolean): boolean => {
  if (!isAuthenticated) {
    toast.error("Please login to add items to your list");
    return false;
  }

  try {
    // Get current list from localStorage
    const listJson = localStorage.getItem("cinemaflix_mylist") || "[]";
    const currentList: MyListItem[] = JSON.parse(listJson);
    
    // Check if movie is already in the list
    const exists = currentList.some(item => item.id === movie.id);
    
    if (exists) {
      toast.info("This title is already in your list");
      return false;
    }
    
    // Add to list with timestamp
    const newItem: MyListItem = {
      ...movie,
      addedAt: Date.now()
    };
    
    const newList = [newItem, ...currentList];
    localStorage.setItem("cinemaflix_mylist", JSON.stringify(newList));
    
    toast.success("Added to My List");
    return true;
  } catch (error) {
    console.error("Error adding to My List:", error);
    toast.error("Failed to add to My List");
    return false;
  }
};

export const removeFromMyList = (movieId: number, isAuthenticated: boolean): boolean => {
  if (!isAuthenticated) {
    toast.error("Please login to manage your list");
    return false;
  }

  try {
    const listJson = localStorage.getItem("cinemaflix_mylist") || "[]";
    const currentList: MyListItem[] = JSON.parse(listJson);
    
    const newList = currentList.filter(item => item.id !== movieId);
    localStorage.setItem("cinemaflix_mylist", JSON.stringify(newList));
    
    toast.success("Removed from My List");
    return true;
  } catch (error) {
    console.error("Error removing from My List:", error);
    toast.error("Failed to remove from My List");
    return false;
  }
};

export const getMyList = (isAuthenticated: boolean): MyListItem[] => {
  if (!isAuthenticated) {
    return [];
  }

  try {
    const listJson = localStorage.getItem("cinemaflix_mylist") || "[]";
    return JSON.parse(listJson);
  } catch (error) {
    console.error("Error getting My List:", error);
    return [];
  }
};

export const isInMyList = (movieId: number, isAuthenticated: boolean): boolean => {
  if (!isAuthenticated) {
    return false;
  }

  try {
    const listJson = localStorage.getItem("cinemaflix_mylist") || "[]";
    const currentList: MyListItem[] = JSON.parse(listJson);
    return currentList.some(item => item.id === movieId);
  } catch (error) {
    console.error("Error checking My List:", error);
    return false;
  }
};
