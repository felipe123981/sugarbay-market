import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import sugarbayLogo from "@/assets/sugarbay-logo.png"; // Import the logo
import {
  ShoppingCart,
  User,
  LogIn,
  Menu,
  X,
  Bell,
  Package,
  LayoutDashboard,
  Settings,
  FileText,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
  Heart,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";
import { useNotificationContext } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );
  const { unreadCount: unreadNotifications } = useNotificationContext(); // Use context
  const navigate = useNavigate();

  const { user, customer, isAuthenticated, isValidating, signOut } = useAuth();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleNotificationsClick = () => {
    navigate("/settings?tab=notifications");
  };

  // Removed useEffect for window event listener as context handles updates

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors hover:text-primary flex items-center ${isActive ? "text-primary" : "text-muted-foreground"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-2 text-base font-medium rounded-md ${isActive
      ? "bg-primary text-primary-foreground"
      : "text-foreground hover:bg-accent"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={sugarbayLogo}
              alt="SugarBay Logo"
              className="h-16 sm:h-16 md:h-18 w-auto"
            />{" "}
            {/* Adjusted logo size */}
            <span className="font-bold hidden sm:inline-block">
              Marketplace
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <nav className="hidden md:flex items-center space-x-6 mr-6">
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            onClick={handleNotificationsClick}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
              >
                {unreadNotifications}
              </Badge>
            )}
          </Button>

          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {isAuthenticated && user && !isValidating ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.name} />}
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <Badge variant="secondary" className="px-1 text-xs">
                        ⭐ {customer?.rating ? Number(customer.rating).toFixed(1) : '0.0'}
                      </Badge>
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Seller Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard?tab=invoices" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>My Invoices</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/favorites" className="flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>My Favorites</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={signOut}
                  className="flex items-center text-red-500 cursor-pointer hover:text-red-600 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t"
          >
            <nav className="flex flex-col space-y-1 p-4">
              <NavLink
                to="/products"
                className={mobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Package className="mr-2 h-4 w-4 inline-block" /> Products
              </NavLink>
              <NavLink
                to="/favorites"
                className={mobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="mr-2 h-4 w-4 inline-block" /> My Favorites
              </NavLink>
              {!isAuthenticated && (
                <>
                  <NavLink
                    to="/login"
                    className={mobileNavLinkClass}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={mobileNavLinkClass}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </NavLink>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
