export async function postDiary(data: any) {
  return fetch(`${import.meta.env.VITE_API_BASE}/v1/calc/diary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());
}

export async function getCarbonData(date: string) {
  return fetch(`${import.meta.env.VITE_API_BASE}/v1/calc/data?date=${date}`)
    .then(r => r.json());
}

export async function getWeeklyTrend(startDate: string) {
  return fetch(`${import.meta.env.VITE_API_BASE}/v1/calc/trend?start=${startDate}`)
    .then(r => r.json());
}