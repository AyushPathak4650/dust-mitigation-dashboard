import { describe, test, expect } from 'vitest';
import { calculateShearStress, calculateDustSuspension, calculateRoi, calculateDriftVelocity } from '../../src/utils/mathHelpers';
import { RoiInput } from '../../src/types';

describe('Aerodynamic & Physical Math Calculations', () => {
  test('calculateShearStress matches quadratic wind speed scaling', () => {
    // 50 km/h baseline
    const baselineShear = calculateShearStress(50, false);
    // 50 km/h with UCD active (exit velocity drops to 33.5 km/h)
    const shieldedShear = calculateShearStress(50, true);

    expect(baselineShear).toBeGreaterThan(0.2);
    expect(shieldedShear).toBeLessThan(baselineShear);
    // Shield should reduce shear stress by ~56%
    const ratio = shieldedShear / baselineShear;
    expect(ratio).toBeCloseTo(0.44, 2);
  });

  test('calculateDustSuspension enforces lifting threshold boundaries', () => {
    // Below threshold shear stress (0.15 N/m2) -> zero dust lift-off
    const lowSiltPct = calculateDustSuspension(0.05, 5, false);
    expect(lowSiltPct).toBe(0);

    // High shear stress lifts dust
    const highSiltPct = calculateDustSuspension(1.5, 6.5, false);
    expect(highSiltPct).toBeGreaterThan(0);

    // Shielding caps lift-off and captures particles
    const shieldedPct = calculateDustSuspension(1.5, 6.5, true);
    expect(shieldedPct).toBeLessThan(highSiltPct);
  });

  test('calculateDriftVelocity models particle drift parameters', () => {
    // drift velocity of PM2.5 particle
    // v_d = q * E / (3 * pi * mu * dp)
    const q = 1.6e-15; // charge
    const E = 150000; // field strength (150 kV/m)
    const dp = 2.5e-6; // PM2.5 (2.5 micrometers)
    
    const v_d = calculateDriftVelocity(q, E, dp);
    expect(v_d).toBeCloseTo(0.56, 1);
  });
});

describe('Socioeconomic & Financial Calculations', () => {
  test('calculateRoi calculates payback period and capex correctly', () => {
    const input: RoiInput = {
      trucks: 10000,
      dailyKm: 120,
      dieselPrice: 95,
      subsidyPct: 0.30,
      materialType: 'hdpe'
    };

    const result = calculateRoi(input);

    // HDPE unit cost: 16500
    // After 30% subsidy: 11550
    // For 10,000 trucks: 115,500,000 INR -> 11.55 Crores
    expect(result.capexCr).toBeCloseTo(11.55, 2);
    expect(result.capexPerTruck).toBe(11550);

    // Payback should be under 1 year
    expect(result.paybackMonths).toBeGreaterThan(0);
    expect(result.paybackMonths).toBeLessThan(12);

    // Carbon reduction must be positive
    expect(result.co2SavedTonnes).toBeGreaterThan(100);
  });
});
