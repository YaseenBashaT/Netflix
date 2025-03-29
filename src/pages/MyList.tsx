
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyList, MyListItem } from "@/services/myListService";
import { getImageUrl } from "@/services/movieService";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MyListPage: React.FC = () => {
  const { user } = useAuth();
  const [myList, setMyList] = useState<MyListItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setMyList(getMyList(!!user));
    }
  }, [user, navigate]);

  const handleRemove = (id: number) => {
    const updatedList = myList.filter(item => item.id !== id);
    setMyList(updatedList);
    localStorage.setItem("cinemaflix_mylist", JSON.stringify(updatedList));
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-netflix-black pt-20 px-4 md:px-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">My List</h1>
        
        {myList.length === 0 ? (
          <Alert className="bg-netflix-dark border-netflix-gray mb-8">
            <AlertDescription>
              Your list is empty. Browse movies and TV shows and add them to your list.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {myList.map((item) => (
              <div key={item.id} className="bg-netflix-dark rounded-md overflow-hidden group relative">
                <Link to={`/details/${item.media_type || 'movie'}/${item.id}`}>
                  <img
                    src={getImageUrl(item.poster_path)}
                    alt={item.title || item.name}
                    className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="p-2">
                  <h3 className="font-medium line-clamp-1">{item.title || item.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-netflix-gray">
                      {new Date(item.addedAt).toLocaleDateString()}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemove(item.id)}
                      className="h-8 w-8 text-netflix-gray hover:text-netflix-red"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListPage;
