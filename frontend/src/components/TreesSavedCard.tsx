import { Trees, Leaf } from 'lucide-react';

interface TreesSavedCardProps {
  trees: number;
  weeklyProgressPct: number;
  annualOffsetKg: number;
}

export function TreesSavedCard({ trees, weeklyProgressPct, annualOffsetKg }: TreesSavedCardProps) {
  // Generate tree icons based on the number
  const wholeTreesCount = Math.floor(trees);
  const hasPartialTree = trees % 1 > 0;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Trees className="h-5 w-5 text-success" />
        <h3 className="text-lg font-semibold">Tree Equivalency</h3>
      </div>
      
      <div className="space-y-6">
        {/* Tree visualization */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            {/* Whole trees */}
            {Array.from({ length: wholeTreesCount }, (_, index) => (
              <Trees 
                key={index} 
                className="h-8 w-8 text-success" 
                fill="currentColor" 
              />
            ))}
            
            {/* Partial tree */}
            {hasPartialTree && (
              <Trees 
                className="h-8 w-8 text-success/50" 
                fill="currentColor" 
              />
            )}
          </div>
          
          <div className="text-center">
            <div className="text-lg">
              <span className="font-semibold">Your week ≈ </span>
              <span className="text-xl font-bold font-sora text-success">
                {trees.toFixed(1)} trees
              </span>
              <span className="font-semibold"> to offset</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Based on average tree CO₂ absorption
            </div>
          </div>
        </div>

        {/* Progress towards annual goal */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Annual offset progress</span>
            <span className="text-muted-foreground">{weeklyProgressPct}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-success to-primary transition-all duration-500"
              style={{ width: `${weeklyProgressPct}%` }}
            />
          </div>
          <div className="text-center text-xs text-muted-foreground">
            Projected annual offset: {annualOffsetKg} kg CO₂e
          </div>
        </div>

        {/* Fun fact */}
        <div className="bg-success/10 border border-success/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Leaf className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
            <div className="text-sm text-success">
              <strong>Did you know?</strong> A mature tree absorbs about 22 kg of CO₂ per year.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}