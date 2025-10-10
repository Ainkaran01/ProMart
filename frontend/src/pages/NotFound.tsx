import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/promart-logo.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <img src={logo} alt="ProMart" className="mx-auto mb-8 h-16" />
        <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">Oops! Page not found</p>
        <Link to="/">
          <Button size="lg">Return to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
