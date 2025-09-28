import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { SeasonalBanner } from '@/components/SeasonalBanner';
import { TodayCarbonCard } from '@/components/TodayCarbonCard';
import { GoalRing } from '@/components/GoalRing';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { TipCard } from '@/components/TipCard';
import { WeeklyTimeline } from '@/components/WeeklyTimeline';
import { StreakTracker } from '@/components/StreakTracker';
import { WhatIfSimulator } from '@/components/WhatIfSimulator';
import { TreesSavedCard } from '@/components/TreesSavedCard';
import { FactorsDialog } from '@/components/FactorsDialog';
import { Footer } from '@/components/Footer';
import {
  mockTodayData,
  mockGoalData,
  mockCategoryData,
  mockTipData,
  mockTimelineData,
  mockStreakData,
  mockWhatIfData,
  mockTreesData,
  mockSeasonalBanner
} from '@/mockData';

export default function Landing() {
  const navigate = useNavigate();
  const [factorsDialogOpen, setFactorsDialogOpen] = useState(false);
  const [whatIfData, setWhatIfData] = useState(mockWhatIfData);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const handleWhatIfChange = (partial: Partial<typeof mockWhatIfData>) => {
    setWhatIfData(prev => ({ ...prev, ...partial }));
  };

  const handleStartTracking = () => {
    navigate('/calculator');
  };

  const handleOpenFactors = () => {
    setFactorsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        onStart={handleStartTracking}
        onOpenFactors={handleOpenFactors}
      />

      {/* Seasonal Banner */}
      {!bannerDismissed && (
        <SeasonalBanner 
          message={mockSeasonalBanner.message}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

      {/* Main Dashboard */}
      <div className="max-w-[1120px] mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Carbon */}
            <TodayCarbonCard {...mockTodayData} />
            
            {/* Category Breakdown */}
            <CategoryBreakdown items={mockCategoryData} />
            
            {/* AI Tip */}
            <TipCard {...mockTipData} />
            
            {/* Weekly Timeline */}
            <WeeklyTimeline days={mockTimelineData} trendPct={-8} />
            
            {/* What-If Simulator */}
            <WhatIfSimulator 
              {...whatIfData}
              onChange={handleWhatIfChange}
            />
          </div>

          {/* Right Column - Sidebar Cards */}
          <div className="space-y-6">
            {/* Goal Ring */}
            <GoalRing {...mockGoalData} />
            
            {/* Streak Tracker */}
            <StreakTracker 
              days={mockStreakData}
              currentStreak={5}
              bestStreak={12}
              successRatePct={76}
            />
            
            {/* Trees Saved */}
            <TreesSavedCard {...mockTreesData} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Factors Dialog */}
      <FactorsDialog 
        open={factorsDialogOpen}
        onOpenChange={setFactorsDialogOpen}
      />
    </div>
  );
}