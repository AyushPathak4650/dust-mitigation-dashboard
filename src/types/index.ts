export interface District {
  name: string;
  type: string;
  pm10: number;
  pm25: number;
  trucks: number;
  pop: string;
  settle: string;
  roi: string;
  desc: string;
  colorClass: string;
}

export interface Hotspot {
  location: string;
  district: string;
  pm10: number;
  status: string;
  class: string;
}

export interface SimConfig {
  shieldEnabled: boolean;
  speed: number;
  silt: number;
  roadType: string;
}

export interface SimMetrics {
  airspeed: number;
  shear: number;
  drag: number;
  pmPct: number;
}

export interface RoiInput {
  trucks: number;
  dailyKm: number;
  dieselPrice: number;
  subsidyPct: number;
  materialType: 'hdpe' | 'stainless' | 'aluminum';
}

export interface RoiOutput {
  capexCr: number;
  capexPerTruck: number;
  fuelSavingsCr: number;
  fuelSavingsPerTruck: number;
  paybackMonths: number;
  co2SavedTonnes: number;
  healthSavingsCr: number;
  socialRoiPct: number;
}

export interface TimelineItem {
  title: string;
  description: string;
  status: 'completed' | 'active' | 'future';
}
