import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-full glass flex items-center justify-center">
        <div className="w-5 h-5 bg-muted rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-12 h-12 rounded-full glass glow-primary flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 text-primary rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 text-accent rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
    </button>
  );
};

export default ThemeToggle;
