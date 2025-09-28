interface HeroProps {
  onStart?: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-[1120px] mx-auto px-4 md:px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-accent bg-clip-text text-transparent">
          Track. Understand. Reduce.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Take control of your carbon footprint with AI-powered insights and personalized recommendations for a more sustainable lifestyle.
        </p>
        
        {onStart && (
          <div className="flex justify-center">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105"
            >
              Start Tracking
            </button>
          </div>
        )}
      </div>
    </section>
  );
}