import { StreakDay } from '../types';
import { Flame, Award, Target } from 'lucide-react';

interface StreakTrackerProps {
  days: StreakDay[];
  currentStreak: number;
  bestStreak: number;
  successRatePct: number;
}

export function StreakTracker({ days, currentStreak, bestStreak, successRatePct }: StreakTrackerProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-6">Streak Tracker</h3>
      
      <div className="space-y-6">
        {/* Day dots */}
        <div className="flex justify-center space-x-3">
          {days.map((day, index) => (
            <div key={index} className="text-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  day.achieved 
                    ? 'bg-success text-white shadow-lg shadow-success/30' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {day.label}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="h-5 w-5 text-warning" />
            </div>
            <div className="text-xl font-bold font-sora">{currentStreak}</div>
            <div className="text-xs text-muted-foreground">Current</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-5 w-5 text-warning" />
            </div>
            <div className="text-xl font-bold font-sora">{bestStreak}</div>
            <div className="text-xs text-muted-foreground">Best</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="text-xl font-bold font-sora">{successRatePct}%</div>
            <div className="text-xs text-muted-foreground">Success</div>
          </div>
        </div>

        {/* Achievement message */}
        {currentStreak >= 3 && (
          <div className="text-center p-3 bg-success/10 border border-success/20 rounded-lg">
            <div className="text-sm font-medium text-success">
              🎉 Great streak! Keep it up!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}