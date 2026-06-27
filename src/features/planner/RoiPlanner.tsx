import React from 'react';
import { RoiInput, RoiOutput } from '../../types';
import './Planner.css';

interface PlannerProps {
  inputs: RoiInput;
  outputs: RoiOutput;
  updateInput: <K extends keyof RoiInput>(key: K, value: RoiInput[K]) => void;
}

export default function RoiPlanner({ inputs, outputs, updateInput }: PlannerProps) {
  // Convert payback period to percentage (0 - 18 months maps to 0 - 100%)
  const paybackPct = Math.min((outputs.paybackMonths / 18) * 100, 100);

  const getPaybackBarColor = (months: number) => {
    if (months < 6) return 'bg-green';
    if (months < 12) return 'bg-cyan';
    return 'bg-red';
  };

  return (
    <div className="planner-layout">
      {/* Inputs controls sidebar */}
      <div className="planner-inputs">
        <div className="card">
          <div className="card-header">
            <h4>Regional Rollout Inputs</h4>
          </div>
          <div className="card-body">
            <div className="control-group">
              <label htmlFor="plan-trucks">Statewide Fleet to Retrofit: <span>{inputs.trucks.toLocaleString('en-IN')}</span> trucks</label>
              <input 
                type="range" 
                id="plan-trucks" 
                min="5000" 
                max="200000" 
                step="5000" 
                value={inputs.trucks}
                onChange={(e) => updateInput('trucks', parseInt(e.target.value))}
                className="input-slider"
                aria-label="Retrofit fleet size"
              />
            </div>

            <div className="control-group">
              <label htmlFor="plan-daily-km">Average Daily Run: <span>{inputs.dailyKm}</span> km</label>
              <input 
                type="range" 
                id="plan-daily-km" 
                min="60" 
                max="250" 
                step="10" 
                value={inputs.dailyKm}
                onChange={(e) => updateInput('dailyKm', parseInt(e.target.value))}
                className="input-slider"
                aria-label="Average daily mileage"
              />
            </div>

            <div className="control-group">
              <label htmlFor="plan-diesel-price">Diesel Fuel Cost: <span>{inputs.dieselPrice}</span> ₹/L</label>
              <input 
                type="range" 
                id="plan-diesel-price" 
                min="85" 
                max="110" 
                step="1" 
                value={inputs.dieselPrice}
                onChange={(e) => updateInput('dieselPrice', parseInt(e.target.value))}
                className="input-slider"
                aria-label="Diesel cost per liter"
              />
            </div>

            <div className="control-group">
              <label htmlFor="plan-subsidy">CECB/NCAP Purchase Subsidy: <span>{Math.round(inputs.subsidyPct * 100)}</span>%</label>
              <input 
                type="range" 
                id="plan-subsidy" 
                min="0" 
                max="0.50" 
                step="0.05" 
                value={inputs.subsidyPct}
                onChange={(e) => updateInput('subsidyPct', parseFloat(e.target.value))}
                className="input-slider"
                aria-label="Government subsidy percentage"
              />
              <span className="subtext">Subsidy lowers capex for fleet owners. Funded by DMF/NCAP.</span>
            </div>

            <div className="control-group">
              <label htmlFor="plan-material">Primary Shield Material</label>
              <select 
                id="plan-material" 
                value={inputs.materialType}
                onChange={(e) => updateInput('materialType', e.target.value as RoiInput['materialType'])}
                className="input-select"
                aria-label="Select device build material"
              >
                <option value="hdpe">Recycled HDPE & EPDM Rubber (Recommended - ₹16,500)</option>
                <option value="stainless">Stainless Steel Brackets & EPDM (Heavy Duty - ₹24,000)</option>
                <option value="aluminum">Aluminum Alloy Brackets & EPDM (Lightweight - ₹21,500)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic calculation results */}
      <div className="planner-outputs">
        <div className="card height-full">
          <div className="card-header">
            <h4>Financial Modeling & Social Impact Estimates</h4>
          </div>
          <div className="card-body">
            <div className="outputs-grid">
              <div className="output-card card-blue">
                <span className="label">Total Capital Expenditure (CAPEX)</span>
                <span className="value">₹{outputs.capexCr.toFixed(1)} Crores</span>
                <span className="sub">Cost per truck: ₹{Math.round(outputs.capexPerTruck).toLocaleString('en-IN')} (after subsidy)</span>
              </div>
              
              <div className="output-card card-green">
                <span className="label">Annual Fuel Cost Savings (State)</span>
                <span className="value">₹{outputs.fuelSavingsCr.toFixed(1)} Crores</span>
                <span className="sub">Savings per truck: ₹{Math.round(outputs.fuelSavingsPerTruck).toLocaleString('en-IN')}/yr</span>
              </div>

              <div className="output-card card-cyan">
                <span className="label">Payback Period (Fleet Owner)</span>
                <span className="value">{outputs.paybackMonths.toFixed(1)} Months</span>
                <div className="progress-bar-container mt-1">
                  <div className={`progress-bar ${getPaybackBarColor(outputs.paybackMonths)}`} style={{ width: `${paybackPct}%` }}></div>
                </div>
              </div>

              <div className="output-card card-yellow">
                <span className="label">Annual CO₂ Emissions Prevented</span>
                <span className="value">{Math.round(outputs.co2SavedTonnes).toLocaleString('en-IN')} Tonnes</span>
                <span className="sub">Equivalent to planting 6.7M trees</span>
              </div>
            </div>

            <div className="social-impact-calculator-card mt-2">
              <h5>Estimated Public Health Savings (Statewide)</h5>
              <p className="description">
                Based on standard WHO disability-adjusted life years (DALYs) cost models for PM2.5 ambient reduction in Chhattisgarh:
              </p>
              <div className="health-savings-row">
                <div className="health-metric">
                  <span className="label">Annual Public Health Savings</span>
                  <span className="value text-accent">₹{outputs.healthSavingsCr.toFixed(1)} Crores</span>
                </div>
                <div className="health-metric border-left">
                  <span className="label">Net Social ROI (5-Year)</span>
                  <span className="value text-success">{Math.round(outputs.socialRoiPct)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
