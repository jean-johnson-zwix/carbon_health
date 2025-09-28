export type DiaryInput = {
  date: string;
  trips: { miles: number; mode: 'car' | 'bus' | 'rail' | 'walk' }[];
  power_use: { usage: number; device: 'phone' | 'tv' | 'computer' }[];
  meals: { servings: number; meat: 'beef' | 'pork' | 'chicken' }[];
};

export type CalcResponse = {
  total_co2: number | string;
  date: string;
  transport_total: number;
  meal_total: number;
  power_total: number;
};

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