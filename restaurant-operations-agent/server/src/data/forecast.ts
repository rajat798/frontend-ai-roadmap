export type DemandForecast = {
  date: string;
  expectedCovers: number;
  confidence: number;
};

export const tonightForecast: DemandForecast = {
  date: "2026-10-21",
  expectedCovers: 180,
  confidence: 0.88,
};