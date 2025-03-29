
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-netflix-black">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-netflix-red mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Lost your way?</h2>
        <p className="text-netflix-gray max-w-md mx-auto mb-8">
          Sorry, we can't find that page. You'll find lots to explore on the home page.
        </p>
        <Link to="/">
          <Button className="bg-netflix-red hover:bg-netflix-red/80">
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
