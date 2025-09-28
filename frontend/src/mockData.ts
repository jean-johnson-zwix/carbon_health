import { CategoryData, LegendItem, TimelineDay, StreakDay } from './types';

export const mockTodayData = {
  valueKg: 6.2,
  goalKg: 8.5,
  deltaPct: -12
};

export const mockGoalData = {
  valueKg: 8.5,
  goalKg: 8.5,
  percent: 75,
  legend: [
    { label: 'Transport', color: 'hsl(var(--transport))' },
    { label: 'Energy', color: 'hsl(var(--energy))' },
    { label: 'Diet', color: 'hsl(var(--diet))' }
  ] as LegendItem[]
};

export const mockCategoryData: CategoryData[] = [
  { label: 'Transport', kg: 3.2, pct: 52, color: 'hsl(var(--transport))' },
  { label: 'Energy', kg: 1.8, pct: 29, color: 'hsl(var(--energy))' },
  { label: 'Diet', kg: 1.2, pct: 19, color: 'hsl(var(--diet))' }
];

export const mockTipData = {
  tip: "Switch to cycling for trips under 3 miles to reduce your weekly transport emissions by up to 2.1 kg CO₂e",
  savingsKg: 2.1,
  badges: ['Gemini', 'Personalized']
};

export const mockTimelineData: TimelineDay[] = [
  { label: 'Mon', kg: 7.2 },
  { label: 'Tue', kg: 6.8 },
  { label: 'Wed', kg: 8.1 },
  { label: 'Thu', kg: 5.9 },
  { label: 'Fri', kg: 7.5 },
  { label: 'Sat', kg: 6.2 },
  { label: 'Sun', kg: 8.3 }
];

export const mockStreakData: StreakDay[] = [
  { label: 'M', achieved: true },
  { label: 'T', achieved: true },
  { label: 'W', achieved: false },
  { label: 'T', achieved: true },
  { label: 'F', achieved: true },
  { label: 'S', achieved: true },
  { label: 'S', achieved: false }
];

export const mockWhatIfData = {
  bikeMi: 5,
  carMi: 25,
  kwh: 12,
  meatServings: 4,
  projectedSavingsKg: 3.2
};

export const mockTreesData = {
  trees: 2.3,
  weeklyProgressPct: 65,
  annualOffsetKg: 428
};

export const mockSeasonalBanner = {
  message: "🍂 Fall season: Track your heating usage as temperatures drop"
};