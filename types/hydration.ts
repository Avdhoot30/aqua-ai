export type BeverageType =
  | "water"
  | "tea"
  | "coffee"
  | "milk"
  | "electrolyte"
  | "other";

export type WaterLog = {
  id: string;
  amount_ml: number;
  beverage_type: BeverageType;
  logged_at: string;
  source: string;
};

export type HydrationSummary = {
  totalMl: number;
  goalMl: number;
  percentage: number;
  remainingMl: number;
  logs: WaterLog[];
};