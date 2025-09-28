import { LegendItem } from '../types';

interface GoalRingProps {
  valueKg: number;
  goalKg: number;
  percent: number;
  legend: LegendItem[];
}

export function GoalRing({ valueKg, goalKg, percent, legend }: GoalRingProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (percent / 100) * circumference;

  // Mock 7-day trend data
  const trendData = [7.2, 6.8, 8.1, 5.9, 7.5, 6.2, 8.3];
  const maxTrend = Math.max(...trendData);

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-6">Goal</h3>
      
      <div className="space-y-6">
        {/* Progress Ring */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-xl font-bold font-sora">{percent}%</div>
              <div className="text-xs text-muted-foreground">of goal</div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <div className="text-2xl font-bold font-sora">
              {valueKg} <span className="text-sm font-normal text-muted-foreground">kg CO₂e</span>
            </div>
            <div className="text-sm text-muted-foreground">weekly average</div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {legend.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* 7-day trend */}
        <div>
          <div className="text-sm font-medium mb-3">7-day trend</div>
          <div className="flex items-end space-x-1 h-8">
            {trendData.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-primary/30 rounded-sm min-h-[4px]"
                style={{ 
                  height: `${(value / maxTrend) * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}