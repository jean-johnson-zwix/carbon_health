import { Link, NavLink } from "react-router-dom";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-semibold text-foreground hover:text-foreground/80">
          <span className="text-xl"><span className="font-bold">E</span>miscope</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <NavLink to="/login" className={({isActive}) => isActive ? "text-foreground" : "hover:text-foreground"}>Login</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <button 
            aria-label="Toggle theme" 
            className="rounded-lg border border-border px-2 py-1 hover:bg-muted"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
        </div>
      </div>
    </header>
  );
}