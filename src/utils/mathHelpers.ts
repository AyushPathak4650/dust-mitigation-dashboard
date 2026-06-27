import { RoiInput, RoiOutput } from '../types';

/**
 * Calculates aerodynamic wind shear stress on the road surface
 * Formula: tau = Cf * 0.5 * rho * U^2
 * @param speedKmh Vehicle speed in km/h
 * @param hasShield Whether the AeroDust-Shield is enabled (reduces velocity by 33%)
 * @returns Shear stress in N/m2
 */
export function calculateShearStress(speedKmh: number, hasShield: boolean): number {
  const exitSpeedKmh = hasShield ? speedKmh * 0.67 : speedKmh;
  const u_ms = exitSpeedKmh / 3.6; // Convert to m/s
  const Cf = 0.005; // Skin friction coefficient
  const rho = 1.2; // Density of air (kg/m3)
  return Cf * 0.5 * rho * u_ms * u_ms;
}

/**
 * Calculates particulate suspension estimation index based on shear stress and road silt
 * @param shear N/m2 shear stress
 * @param silt g/m2 road silt load
 * @param hasShield Whether shield is enabled (blocks lateral dispersion)
 * @returns Percentage of dust suspended
 */
export function calculateDustSuspension(shear: number, silt: number, hasShield: boolean): number {
  const thresholdShear = 0.15; // N/m2 threshold for silt resuspension
  if (shear <= thresholdShear) return 0;
  
  let pmLevel = (shear - thresholdShear) * silt * 12;
  let pmPct = Math.min(Math.round(pmLevel), 100);
  
  if (hasShield) {
    // Shield captures 78% of dual tire dust
    pmPct = Math.round(pmPct * 0.22);
  }
  return pmPct;
}

/**
 * Computes financial ROI model and carbon reduction outputs
 * @param input Planner input settings
 * @returns Complete ROI output results
 */
export function calculateRoi(input: RoiInput): RoiOutput {
  const { trucks, dailyKm, dieselPrice, subsidyPct, materialType } = input;

  // Material cost pricing matrix
  let baseUnitCost = 16500;
  if (materialType === 'stainless') baseUnitCost = 24000;
  else if (materialType === 'aluminum') baseUnitCost = 21500;

  // Subsidy calculations
  const subsidyAmount = baseUnitCost * subsidyPct;
  const capexPerTruck = baseUnitCost - subsidyAmount;
  const totalCapex = capexPerTruck * trucks;
  const capexCr = totalCapex / 10000000;

  // Fuel savings: 12% Drag reduction -> 3.5% Fuel efficiency gain
  // Consumption rate: 35 L / 100 km -> 0.35 L / km
  // 300 active operational days per year
  const baseLitersPerTruckPerYear = dailyKm * 300 * 0.35;
  const savedLitersPerTruckPerYear = baseLitersPerTruckPerYear * 0.035;

  const fuelSavingsPerTruck = savedLitersPerTruckPerYear * dieselPrice;
  const totalFuelSavings = fuelSavingsPerTruck * trucks;
  const fuelSavingsCr = totalFuelSavings / 10000000;

  // Payback period (Months)
  // Capex per truck / annual savings per truck * 12 months
  const paybackMonths = fuelSavingsPerTruck > 0 ? (capexPerTruck / fuelSavingsPerTruck) * 12 : 0;

  // CO2 savings: 1 Liter of diesel produces ~2.68 kg CO2
  const co2SavedTonnes = (savedLitersPerTruckPerYear * 2.68 * trucks) / 1000;

  // Social public health savings: Estimating ₹30,000 health costs reduction per retrofitted truck per year in mining belts
  const healthSavingsCr = (trucks * 30000) / 10000000;

  // 5-Year Social ROI: (Cumulative fuel savings + health savings - Actual system cost) / Actual system cost * 100
  const total5YrBenefit = (totalFuelSavings + (trucks * 30000)) * 5;
  const actualSystemCost = baseUnitCost * trucks;
  const socialRoiPct = actualSystemCost > 0 ? ((total5YrBenefit - actualSystemCost) / actualSystemCost) * 100 : 0;

  return {
    capexCr,
    capexPerTruck,
    fuelSavingsCr,
    fuelSavingsPerTruck,
    paybackMonths,
    co2SavedTonnes,
    healthSavingsCr,
    socialRoiPct
  };
}

/**
 * Calculates the electrostatic drift velocity of a dust particle
 * Formula: v_d = (q * E) / (3 * pi * mu * dp)
 * @param q Particle charge in Coulombs
 * @param E Electric field in V/m
 * @param dp Particle diameter in meters
 * @returns Drift velocity in m/s
 */
export function calculateDriftVelocity(q: number, E: number, dp: number): number {
  const airViscosity = 1.81e-5; // Pa.s at room temp
  const dragForceDenominator = 3 * Math.PI * airViscosity * dp;
  return dragForceDenominator > 0 ? (q * E) / dragForceDenominator : 0;
}
export function formatCurrencyCr(val: number): string {
  return `₹${val.toFixed(1)} Cr`;
}

export function formatCurrency(val: number): string {
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
}
