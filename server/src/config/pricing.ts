/** "From" prices (ZAR) for each repair issue shown in the booking wizard. 0 = priced after diagnosis. */
export const REPAIR_FROM_PRICES: Record<string, number> = {
  'Cracked screen': 1299,
  'Battery drains fast': 799,
  "Won't charge": 649,
  'Back glass': 999,
  'Camera issue': 899,
  'Water damage': 1199,
  'Something else': 0,
};

/** Grade A, 256GB trade-in value (ZAR) per model. */
const BASE_CREDIT: Record<string, number> = {
  'iPhone 16 Pro': 14000,
  'iPhone 15 Pro': 11500,
  'iPhone 14': 8500,
  'iPhone 13': 6200,
  'Galaxy S24': 7500,
  Other: 2500,
};

const STORAGE_FACTOR: Record<string, number> = { '128GB': 0.9, '256GB': 1, '512GB': 1.12, '1TB': 1.25 };
const GRADE_FACTOR = { A: 1, B: 0.72, C: 0.35 } as const;

export const TRADE_IN_MODELS = Object.keys(BASE_CREDIT);
export const TRADE_IN_STORAGE = Object.keys(STORAGE_FACTOR);

export type Grade = keyof typeof GRADE_FACTOR;

export function gradeFromAnswers(a: { cracked: boolean; damage: boolean; powers: boolean }): Grade {
  if (!a.powers) return 'C';
  if (a.cracked || a.damage) return 'B';
  return 'A';
}

const round50 = (n: number) => Math.round(n / 50) * 50;

export function estimateCredit(model: string, storage: string, grade: Grade) {
  const base = (BASE_CREDIT[model] ?? BASE_CREDIT.Other) * (STORAGE_FACTOR[storage] ?? 1) * GRADE_FACTOR[grade];
  return { min: round50(base * 0.92), max: round50(base * 1.05) };
}
