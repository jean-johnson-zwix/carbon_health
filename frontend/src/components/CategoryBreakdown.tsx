import { ComponentState, CategoryData } from '../types';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface CategoryBreakdownProps {
  items: CategoryData[];
  state?: ComponentState;
}

export function CategoryBreakdown({ items, state = 'success' }: CategoryBreakdownProps) {
  if (state === 'loading') {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No category data available</p>
          <button className="text-primary hover:underline">Add some activities</button>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        <div className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-error mb-2 mx-auto" />
          <p className="text-muted-foreground mb-4">Failed to load breakdown</p>
          <button className="flex items-center space-x-2 text-primary hover:underline mx-auto">
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.kg, 0);

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-6">Category Breakdown</h3>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{item.label}</span>
              <div className="text-right">
                <div className="text-sm font-semibold">{item.kg.toFixed(1)} kg</div>
                <div className="text-xs text-muted-foreground">{item.pct}% of total</div>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-700"
                style={{ 
                  width: `${(item.kg / total) * 100}%`,
                  backgroundColor: item.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}