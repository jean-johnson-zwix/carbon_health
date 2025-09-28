import { TrendingDown, TrendingUp, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { ComponentState } from '../types';

interface TodayCarbonCardProps {
  valueKg: number;
  goalKg: number;
  deltaPct: number;
  state?: ComponentState;
}

export function TodayCarbonCard({ valueKg, goalKg, deltaPct, state = 'success' }: TodayCarbonCardProps) {
  const progressPct = Math.min((valueKg / goalKg) * 100, 100);
  const isPositive = deltaPct > 0;

  if (state === 'loading') {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="glass-card p-6 text-center">
        <div className="h-32 flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-4">No data for today yet</p>
          <button className="text-primary hover:underline">Start tracking</button>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="glass-card p-6 text-center">
        <div className="h-32 flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-error mb-2" />
          <p className="text-muted-foreground mb-4">Failed to load data</p>
          <button className="flex items-center space-x-2 text-primary hover:underline">
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">Today's Carbon</h3>
      
      <div className="space-y-4">
        {/* Main Value */}
        <div className="text-center">
          <div className="text-3xl font-bold font-sora">
            {valueKg.toFixed(1)} <span className="text-xl font-normal text-muted-foreground">kg CO₂e</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress to goal</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-primary to-primary-accent transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-right text-xs text-muted-foreground">
            Goal: {goalKg} kg
          </div>
        </div>

        {/* Delta */}
        <div className="flex items-center justify-center">
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
            isPositive 
              ? 'bg-error/10 text-error' 
              : 'bg-success/10 text-success'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{Math.abs(deltaPct)}% vs yesterday</span>
          </div>
        </div>
      </div>
    </div>
  );
}