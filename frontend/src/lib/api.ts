import { DiaryInput, CalcResponse, RecommendationList } from '@/types';

const BASE = import.meta.env.VITE_API_BASE as string;
const USE_MOCKS = (import.meta.env.VITE_USE_MOCKS ?? 'false') === 'true';

export const FACTORS = {
  transport: { car: 0.404, bus: 0.089, rail: 0.041, walk: 0 },
  energy: { electricity: 0.38 },
  diet: { beef: 2.70, pork: 1.21, chicken: 0.69 },
};

function mockCalc(data: DiaryInput): CalcResponse {
  
  const transport = data.trips.reduce((s, t) => s + (FACTORS.transport[t.mode] ?? 0) * t.miles, 0);
  const power = data.power_use.reduce((s, p) => s + FACTORS.energy.electricity * p.usage, 0);
  const meal = data.meals.reduce((s, m) => s + (FACTORS.diet[m.meat] ?? 0) * m.servings, 0);
  const total = transport + power + meal;
  return {
    total_co2: +total.toFixed(3),
    date: data.date,
    transport_total: +transport.toFixed(3),
    meal_total: +meal.toFixed(3),
    power_total: +power.toFixed(3),
  };
}

export async function postDiary(data: DiaryInput, token: string): Promise<CalcResponse> {

  console.log(token)
  try {
    const r = await fetch(`/api/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization':`Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  } catch {
    return mockCalc(data); // graceful offline fallback
  }
}

export async function getRecommendation(username: string, token: string): Promise<RecommendationList> {

  console.log(token)
    const r = await fetch(`/api/recommendation/${username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization':`Bearer ${token}` },
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
 
}

export const getFactors = () => FACTORS;