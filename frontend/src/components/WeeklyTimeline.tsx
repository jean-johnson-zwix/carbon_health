import { ComponentState, TimelineDay } from '../types';
import { TrendingUp, TrendingDown, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface WeeklyTimelineProps {
  days: TimelineDay[];
  trendPct?: number;
  state?: ComponentState;
}

export function WeeklyTimeline({ days, trendPct, state = 'success' }: WeeklyTimelineProps) {
  if (state === 'loading') {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Timeline</h3>
        <div className="flex items-center justify-center h-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Timeline</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No timeline data available</p>
          <button className="text-primary hover:underline">Track your first day</button>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Timeline</h3>
        <div className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-error mb-2 mx-auto" />
          <p className="text-muted-foreground mb-4">Failed to load timeline</p>
          <button className="flex items-center space-x-2 text-primary hover:underline mx-auto">
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...days.map(d => d.kg));
  const minValue = Math.min(...days.map(d => d.kg));

  // Create SVG path for sparkline
  const createPath = () => {
    const width = 280;
    const height = 60;
    const padding = 10;
    
    const points = days.map((day, index) => {
      const x = padding + (index * (width - 2 * padding)) / (days.length - 1);
      const y = padding + ((maxValue - day.kg) / (maxValue - minValue)) * (height - 2 * padding);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Weekly Timeline</h3>
        {trendPct !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${
            trendPct > 0 ? 'text-error' : 'text-success'
          }`}>
            {trendPct > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{Math.abs(trendPct)}%</span>
          </div>
        )}
      </div>

      {/* Sparkline Chart */}
      <div className="mb-4">
        <svg width="100%" height="60" viewBox="0 0 280 60" className="overflow-visible">
          <defs>
            <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Fill area */}
          <path
            d={`${createPath()} L 270,60 L 10,60 Z`}
            fill="url(#sparklineGradient)"
          />
          
          {/* Line */}
          <path
            d={createPath()}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />
          
          {/* Data points */}
          {days.map((day, index) => {
            const x = 10 + (index * 260) / (days.length - 1);
            const y = 10 + ((maxValue - day.kg) / (maxValue - minValue)) * 40;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="hsl(var(--primary))"
                className="drop-shadow-sm"
              />
            );
          })}
        </svg>
      </div>

      {/* Day labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        {days.map((day, index) => (
          <div key={index} className="text-center">
            <div className="font-medium">{day.label}</div>
            <div className="mt-1">{day.kg.toFixed(1)}kg</div>
          </div>
        ))}
      </div>
    </div>
  );
}