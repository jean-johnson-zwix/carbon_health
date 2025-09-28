export type Trip = { miles: number; mode: 'car' | 'bus' | 'rail' | 'walk' };
export type PowerUse = { usage: number; device: 'phone' | 'tv' | 'computer' };
export type Meal = { servings: number; meat: 'beef' | 'pork' | 'chicken' };

export type DiaryInput = {
  date: string; // YYYY-MM-DD
  trips: Trip[];
  power_use: PowerUse[];
  meals: Meal[];
  username: string;
};

export type CalcResponse = {
  total_emission: number | string;
  date: string;
  transport_emission: number;
  meal_emission: number;
  power_emission: number;
};

export type RecommendationList = {
  recommendations: Recommendation[];
}

export type Recommendation = {
  recommendation: string;
  impact: string;
}

export type CategoryData = {
  label: 'Transport' | 'Energy' | 'Diet';
  kg: number;
  pct: number;
  color: string;
};

export type LegendItem = {
  label: string;
  color: string;
};

export type TimelineDay = {
  label: string;
  kg: number;
};

export type StreakDay = {
  label: 'M' | 'T' | 'W' | 'T' | 'F' | 'S' | 'S';
  achieved: boolean;
};

export type ComponentState = 'loading' | 'empty' | 'error' | 'success';