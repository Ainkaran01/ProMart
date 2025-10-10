import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/promart-logo.png";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from "react";

interface NavbarProps {
  unreadCount?: number;
  onNotificationsClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  unreadCount = 0,
  onNotificationsClick,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Common navigation links for non-admin users and logged out users
  const commonLinks = [
    { to: "/", label: "Home" },
    { to: "/listings", label: "Browse Listings" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
  ];

  const renderDesktopNav = () => {
    if (!user) {
      return (
        <>
          {commonLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                {link.label}
              </Button>
            </Link>
          ))}
          <Link to="/login">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="hidden sm:flex">
              Register
            </Button>
          </Link>
          <ThemeToggle />
        </>
      );
    }

    if (user.role === "admin") {
      return (
        <>
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          {onNotificationsClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNotificationsClick}
              className="relative hidden sm:flex"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          )}

          <div className="hidden sm:flex items-center gap-2 border-l pl-4">
            <div className="text-sm">
              <div className="font-medium text-foreground">
                {user.companyName || "Admin"}
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {user.role}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </>
      );
    }

    // Company user
    return (
      <>
        {commonLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              {link.label}
            </Button>
          </Link>
        ))}
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>

        {onNotificationsClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNotificationsClick}
            className="relative hidden sm:flex"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        )}

        <div className="hidden sm:flex items-center gap-2 border-l pl-4">
          <div className="text-sm">
            <div className="font-medium text-foreground">
              {user.companyName}
            </div>
            <div className="text-xs text-muted-foreground capitalize">
              {user.role}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </>
    );
  };

  const renderMobileMenu = () => {
    if (!user) {
      return (
        <div className="space-y-4">
          {commonLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={handleNavClick}>
              <Button variant="ghost" className="w-full justify-start">
                {link.label}
              </Button>
            </Link>
          ))}
          <div className="flex gap-2 pt-4 border-t">
            <Link to="/login" className="flex-1" onClick={handleNavClick}>
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
            <Link to="/register" className="flex-1" onClick={handleNavClick}>
              <Button className="w-full">Register</Button>
            </Link>
          </div>
          <div className="flex justify-center pt-4">
            <ThemeToggle />
          </div>
        </div>
      );
    }

    if (user.role === "admin") {
      return (
        <div className="space-y-4">
          <Link to="/admin" onClick={handleNavClick}>
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          {onNotificationsClick && (
            <Button
              variant="ghost"
              onClick={() => {
                onNotificationsClick();
                handleNavClick();
              }}
              className="w-full justify-start relative"
            >
              <Bell className="mr-2 h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-destructive">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          )}

          <div className="pt-4 border-t">
            <div className="text-sm mb-4">
              <div className="font-medium text-foreground">
                {user.companyName || "Admin"}
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {user.role}
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      );
    }

    // Company user mobile menu
    return (
      <div className="space-y-4">
        {commonLinks.map((link) => (
          <Link key={link.to} to={link.to} onClick={handleNavClick}>
            <Button variant="ghost" className="w-full justify-start">
              {link.label}
            </Button>
          </Link>
        ))}
        <Link to="/dashboard" onClick={handleNavClick}>
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>

        {onNotificationsClick && (
          <Button
            variant="ghost"
            onClick={() => {
              onNotificationsClick();
              handleNavClick();
            }}
            className="w-full justify-start relative"
          >
            <Bell className="mr-2 h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-destructive">
                {unreadCount}
              </Badge>
            )}
          </Button>
        )}

        <div className="pt-4 border-t">
          <div className="text-sm mb-4">
            <div className="font-medium text-foreground">
              {user.companyName}
            </div>
            <div className="text-xs text-muted-foreground capitalize">
              {user.role}
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    );
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b bg-card sticky top-0 z-50"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="ProMart" className="h-40 sm:h-40" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-2">
          {renderDesktopNav()}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 sm:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-4 right-4 bg-card border rounded-lg shadow-lg z-50 sm:hidden p-4"
            >
              {renderMobileMenu()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;