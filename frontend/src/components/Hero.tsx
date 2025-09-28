import { useState } from 'react';
import { Sun, Moon, Calculator, Info, BookOpen } from 'lucide-react';

interface HeroProps {
  onStart?: () => void;
  onOpenFactors?: () => void;
}

export function Hero({ onStart, onOpenFactors }: HeroProps) {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-card border-b backdrop-blur-md">
        <div className="max-w-[1120px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="font-sora font-bold text-xl text-primary">
              Emiscope
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={onOpenFactors}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Calculator className="h-4 w-4" />
                <span>Calculator</span>
              </button>
              <button 
                onClick={onOpenFactors}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>Factors</span>
              </button>
              <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                <Info className="h-4 w-4" />
                <span>About</span>
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button 
                onClick={onStart}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-[1120px] mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-accent bg-clip-text text-transparent">
            Track. Understand. Reduce.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Take control of your carbon footprint with AI-powered insights and personalized recommendations for a more sustainable lifestyle.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105"
            >
              Start Tracking
            </button>
            <button 
              onClick={onOpenFactors}
              className="px-8 py-4 border border-border rounded-xl font-semibold text-lg hover:bg-muted transition-all hover:scale-105"
            >
              See Factors
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}