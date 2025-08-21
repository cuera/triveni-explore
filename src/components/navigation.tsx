import { useState } from "react";
import { Home, BookOpen, Clock, Map, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Navigation({ currentPath, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/departments", label: "Departments", icon: BookOpen },
    { path: "/timeline", label: "Timeline", icon: Clock },
    { path: "/map", label: "Map", icon: Map }
  ];

  const handleNavigate = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border/20 shadow-elegant z-50 lg:hidden">
        <div className="flex items-center justify-around p-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Button
              key={path}
              variant={currentPath === path ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigate(path)}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-0",
                currentPath === path ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium truncate">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Desktop Navigation Header */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border/20 shadow-elegant z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">Triveni</h1>
              <p className="text-xs text-muted-foreground">School Exhibition</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={currentPath === path ? "default" : "ghost"}
                onClick={() => handleNavigate(path)}
                className={cn(
                  "flex items-center gap-2",
                  currentPath === path && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border/20 shadow-elegant z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Triveni</h1>
              <p className="text-xs text-muted-foreground">School Exhibition</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border/20 p-4">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Button
                  key={path}
                  variant={currentPath === path ? "default" : "outline"}
                  onClick={() => handleNavigate(path)}
                  className="flex items-center gap-2 justify-start"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed navigation */}
      <div className="h-16 lg:h-16" />
      <div className="h-16 lg:h-0" />
    </>
  );
}