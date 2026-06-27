import React, { useState, useRef } from 'react';
import { useAeroSimulator } from '../../hooks/useAeroSimulator';
import { calculateShearStress, calculateDustSuspension } from '../../utils/mathHelpers';
import { SimConfig } from '../../types';
import './Simulator.css';

export default function AeroSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<SimConfig>({
    shieldEnabled: false,
    speed: 50,
    silt: 6.5,
    roadType: 'industrial'
  });

  // Attach Canvas animation loop hook
  useAeroSimulator(canvasRef, config);

  const handleShieldToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({
      ...prev,
      shieldEnabled: e.target.checked
    }));
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({
      ...prev,
      speed: parseInt(e.target.value)
    }));
  };

  const handleSiltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({
      ...prev,
      silt: parseFloat(e.target.value)
    }));
  };

  const handleRoadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roadType = e.target.value;
    let silt = 6.5;
    if (roadType === 'unpaved') silt = 12.0;
    else if (roadType === 'highway') silt = 2.0;
    
    setConfig(prev => ({
      ...prev,
      roadType,
      silt
    }));
  };

  // Math equations execution for live dashboard telemetry
  const underChassisSpeed = config.shieldEnabled ? config.speed * 0.67 : config.speed;
  const shearStress = calculateShearStress(config.speed, config.shieldEnabled);
  const suspendedPct = calculateDustSuspension(shearStress, config.silt, config.shieldEnabled);

  return (
    <div className="simulator-layout">
      {/* Settings Control Panel */}
      <div className="sim-controls-panel">
        <div className="card height-full">
          <div className="card-header">
            <h4>Simulation Settings</h4>
          </div>
          <div className="card-body">
            <div className="control-group">
              <label htmlFor="sim-device-toggle">AeroDust-Shield Status</label>
              <div className="toggle-switch-container">
                <span className={`toggle-label ${config.shieldEnabled ? 'text-success' : 'text-red'}`}>
                  {config.shieldEnabled ? 'ENABLED (Mitigation Active)' : 'DISABLED (Baseline)'}
                </span>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    id="sim-device-toggle"
                    checked={config.shieldEnabled}
                    onChange={handleShieldToggle}
                    aria-label="Toggle AeroDust-Shield status"
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="slider-speed">Vehicle Speed: <span>{config.speed}</span> km/h</label>
              <input 
                type="range" 
                id="slider-speed" 
                min="30" 
                max="80" 
                value={config.speed}
                onChange={handleSpeedChange}
                className="input-slider"
                aria-label="Set vehicle speed"
              />
            </div>

            <div className="control-group">
              <label htmlFor="slider-silt">Road Silt Loading: <span>{config.silt.toFixed(1)}</span> g/m²</label>
              <input 
                type="range" 
                id="slider-silt" 
                min="1.0" 
                max="15.0" 
                step="0.5" 
                value={config.silt}
                onChange={handleSiltChange}
                className="input-slider"
                aria-label="Set road silt loading"
              />
              <span className="subtext">Silt level impacts particle density and lift-off.</span>
            </div>

            <div className="control-group">
              <label htmlFor="select-road-type">Road Surface Condition</label>
              <select 
                id="select-road-type" 
                value={config.roadType}
                onChange={handleRoadChange}
                className="input-select"
                aria-label="Select road surface condition"
              >
                <option value="unpaved">Mining Pit Road (Unpaved, High Silt)</option>
                <option value="industrial">Industrial Corridor (Paved, Medium Silt)</option>
                <option value="highway">National Highway (Paved, Clean/Dry)</option>
              </select>
            </div>

            <hr className="divider" />

            <div className="sim-metrics-box">
              <h5>Live Aero Metrics</h5>
              <div className="sim-metric-row">
                <span>Under-Chassis Air Speed:</span>
                <span className={config.shieldEnabled ? 'text-success font-bold' : 'text-red font-bold'}>
                  {underChassisSpeed.toFixed(1)} km/h
                </span>
              </div>
              <div className="sim-metric-row">
                <span>Road Shear Stress:</span>
                <span className={config.shieldEnabled ? 'text-success font-bold' : 'text-red font-bold'}>
                  {shearStress.toFixed(2)} N/m²
                </span>
              </div>
              <div className="sim-metric-row">
                <span>Aerodynamic Drag Coeff:</span>
                <span className={config.shieldEnabled ? 'text-success font-bold' : 'text-red font-bold'}>
                  {config.shieldEnabled ? '0.58' : '0.68'}
                </span>
              </div>
              <div className="sim-metric-row">
                <span>Estimated PM10 Suspended:</span>
                <span className={config.shieldEnabled ? 'text-success font-bold' : 'text-red font-bold'}>
                  {suspendedPct}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Canvas Rendering target */}
      <div className="sim-render-area">
        <div className="card height-full">
          <div className="card-header">
            <h4>Fluid Dynamics & Particle Tracking Visualizer</h4>
            <span className="badge badge-accent">Interactive Canvas Render</span>
          </div>
          <div className="card-body relative-body">
            <canvas id="sim-canvas" ref={canvasRef} aria-label="Aerodynamic airflow simulation"></canvas>
            <div className="canvas-legend">
              <span className="legend-item"><span className="particle-dot red-dot"></span> Fine Dust (PM2.5/PM10)</span>
              <span className="legend-item"><span className="line-indicator blue-line"></span> Air Streamlines</span>
              <span className="legend-item"><span className="zone-indicator purple-zone"></span> Turbulent Toroidal Wake</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
