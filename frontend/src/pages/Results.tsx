import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TipCard } from '@/components/TipCard';
import { GoalRing } from '@/components/GoalRing';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { WeeklyTimeline } from '@/components/WeeklyTimeline';
import { TreesSavedCard } from '@/components/TreesSavedCard';
import { WhatIfSimulator } from '@/components/WhatIfSimulator';
import { ArrowLeft, RefreshCw, Home } from 'lucide-react';
import { CalcResponse, CategoryData, TimelineDay, LegendItem } from '@/types';
import { useState } from 'react';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const calc = location.state?.calc as CalcResponse;
  const [whatIfData, setWhatIfData] = useState({
    bikeMi: 5,
    carMi: 25,
    kwh: 12,
    meatServings: 4,
    projectedSavingsKg: 3.2
  });

  if (!calc) {
    return (
      <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-16">
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No results to display</h2>
          <p className="text-muted-foreground mb-6">
            It looks like you haven't calculated your emissions yet.
          </p>
          <Button onClick={() => navigate('/calculator')}>
            Go to Calculator
          </Button>
        </div>
      </div>
    );
  }

  const total = Number(calc.total_co2);
  const impactLevel = total < 8 ? 'Low' : total < 16 ? 'Medium' : 'High';
  const impactColor = total < 8 ? 'success' : total < 16 ? 'warning' : 'destructive';

  // Generate category breakdown
  const categoryData: CategoryData[] = [
    {
      label: 'Transport',
      kg: calc.transport_total,
      pct: Math.round((calc.transport_total / total) * 100),
      color: 'hsl(var(--transport))'
    },
    {
      label: 'Energy',
      kg: calc.power_total,
      pct: Math.round((calc.power_total / total) * 100),
      color: 'hsl(var(--energy))'
    },
    {
      label: 'Diet',
      kg: calc.meal_total,
      pct: Math.round((calc.meal_total / total) * 100),
      color: 'hsl(var(--diet))'
    }
  ];

  // Generate simple weekly timeline (distribute total across 7 days with variation)
  const generateTimeline = (total: number): TimelineDay[] => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const baseDaily = total / 7;
    return days.map(day => ({
      label: day,
      kg: baseDaily * (0.8 + Math.random() * 0.4) // Add some variation
    }));
  };

  const timelineData = generateTimeline(total);

  // Goal ring data
  const goalData = {
    valueKg: total,
    goalKg: 11.3, // Default weekly goal
    percent: Math.min(Math.round((total / 11.3) * 100), 100),
    legend: [
      { label: 'Transport', color: 'hsl(var(--transport))' },
      { label: 'Energy', color: 'hsl(var(--energy))' },
      { label: 'Diet', color: 'hsl(var(--diet))' }
    ] as LegendItem[]
  };

  // Trees calculation (assume 22kg CO2 per tree per year)
  const treesEquivalent = (total * 52) / 22; // Weekly to annual, then divide by tree absorption
  const treesData = {
    trees: treesEquivalent,
    weeklyProgressPct: Math.min(Math.round((total / 11.3) * 100), 100),
    annualOffsetKg: Math.round(total * 52)
  };

  // Simple tip based on dominant category
  const dominantCategory = categoryData.reduce((prev, current) => 
    current.kg > prev.kg ? current : prev
  );
  
  const tips = {
    Transport: "Consider cycling or public transport for short trips to reduce transport emissions.",
    Energy: "Switch to LED bulbs and unplug devices when not in use to reduce energy consumption.",
    Diet: "Try reducing meat consumption by one serving per week for lower diet emissions."
  };

  const tipData = {
    tip: tips[dominantCategory.label],
    savingsKg: dominantCategory.kg * 0.3, // Estimate 30% potential savings
    badges: ['Personalized']
  };

  const handleWhatIfChange = (partial: Partial<typeof whatIfData>) => {
    setWhatIfData(prev => ({ ...prev, ...partial }));
  };

  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-sora">Your Carbon Results</h1>
              <p className="text-muted-foreground">Week of {calc.date}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate('/calculator')}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Recalculate
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>

        {/* Main Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Total Emissions Card */}
            <div className="glass-card p-6">
              <div className="text-center">
                <div className="text-4xl font-bold font-sora text-primary mb-2">
                  {total.toFixed(1)} kg CO₂e
                </div>
                <div className="text-muted-foreground mb-4">Total emissions this week</div>
                <Badge variant={impactColor as any} className="text-sm">
                  {impactLevel} Impact
                </Badge>
              </div>
            </div>
            
            {/* Category Breakdown */}
            <CategoryBreakdown items={categoryData} />
            
            {/* AI Tip */}
            <TipCard {...tipData} />
            
            {/* Weekly Timeline */}
            <WeeklyTimeline days={timelineData} />
            
            {/* What-If Simulator */}
            <WhatIfSimulator 
              {...whatIfData}
              onChange={handleWhatIfChange}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Goal Ring */}
            <GoalRing {...goalData} />
            
            {/* Trees Saved */}
            <TreesSavedCard {...treesData} />
          </div>
        </div>
    </div>
  );
}