import React, { useState } from 'react';
import { DISTRICT_DATA, DISTRICT_MAP_PATHS } from '../../constants';
import './Map.css';

export default function DistrictGisMap() {
  const [selectedKey, setSelectedKey] = useState<string>('korba');
  const d = DISTRICT_DATA[selectedKey];

  // Calculate percentage limits for visual display
  const pm10Pct = Math.min((d.pm10 / 250) * 100, 100);
  const pm25Pct = Math.min((d.pm25 / 120) * 100, 100);

  const getBarColor = (val: number, isPm25 = false) => {
    const limit = isPm25 ? 80 : 180;
    const warningLimit = isPm25 ? 50 : 120;
    if (val > limit) return 'bg-red';
    if (val > warningLimit) return 'bg-yellow';
    return 'bg-green';
  };

  return (
    <div className="map-view-container">
      {/* Sidebar Details Panel */}
      <div className="map-sidebar">
        <div className="card no-border height-full">
          <div className="card-header">
            <h4>{d.name}</h4>
            <span className="badge badge-accent">{d.type}</span>
          </div>
          <div className="card-body">
            <p className="description">{d.desc}</p>
            <hr className="divider" />
            
            <div className="metric-group-vertical">
              <div className="metric-row">
                <span className="label"><i className="fa-solid fa-smog"></i> PM10 Concentration</span>
                <span className="value">{d.pm10} <span className="unit">µg/m³</span></span>
              </div>
              <div className="progress-bar-container">
                <div className={`progress-bar ${getBarColor(d.pm10)}`} style={{ width: `${pm10Pct}%` }}></div>
              </div>
              
              <div className="metric-row">
                <span className="label"><i className="fa-solid fa-mask-face"></i> PM2.5 Concentration</span>
                <span className="value">{d.pm25} <span className="unit">µg/m³</span></span>
              </div>
              <div className="progress-bar-container">
                <div className={`progress-bar ${getBarColor(d.pm25, true)}`} style={{ width: `${pm25Pct}%` }}></div>
              </div>

              <div className="metric-row">
                <span className="label"><i className="fa-solid fa-truck-moving"></i> Daily Heavy Trucks</span>
                <span className="value">{d.trucks.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="metric-row">
                <span className="label"><i className="fa-solid fa-hand-holding-hand"></i> Population Exposure</span>
                <span className="value">{d.pop}</span>
              </div>
            </div>

            <div className="district-forecast-card mt-2">
              <h5>Estimated Retrofit Impact</h5>
              <div className="forecast-row">
                <div className="forecast-box">
                  <span className="label">Dust Settle</span>
                  <span className="value text-success">{d.settle}</span>
                </div>
                <div className="forecast-box border-left">
                  <span className="label">Annual ROI</span>
                  <span className="value text-accent">{d.roi}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Rendering Panel */}
      <div className="map-render-area">
        <div className="map-card card height-full">
          <div className="map-legend-floating">
            <strong>PM10 Level Key</strong>
            <div className="legend-color-ramp">
              <span className="ramp-color bg-legend-good"></span>
              <span className="ramp-color bg-legend-mod"></span>
              <span class="ramp-color bg-legend-poor"></span>
              <span className="ramp-color bg-legend-vpoor"></span>
            </div>
            <div className="legend-labels">
              <span>Satisfactory</span>
              <span>Moderate</span>
              <span>Poor</span>
              <span>Severe</span>
            </div>
          </div>
          
          <div className="svg-map-wrapper">
            <svg viewBox="0 0 350 600" width="100%" height="100%" style={{ maxHeight: '100%' }} aria-label="Interactive map of Chhattisgarh districts">
              {DISTRICT_MAP_PATHS.map((item) => {
                const districtItem = DISTRICT_DATA[item.key];
                return (
                  <g key={item.key}>
                    <path
                      d={item.path}
                      className={`district-path ${districtItem.colorClass} ${selectedKey === item.key ? 'selected' : ''}`}
                      onClick={() => setSelectedKey(item.key)}
                      onMouseEnter={() => setSelectedKey(item.key)}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      aria-label={`Select ${districtItem.name}`}
                    />
                    {/* Programmatic label placement */}
                    <text
                      x={calculateTextCenter(item.path).x}
                      y={calculateTextCenter(item.path).y}
                      fill="#94a3b8"
                      fontSize="10"
                      fontFamily="var(--font-display)"
                      fontWeight="bold"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {districtItem.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// Computes approximate midpoint of paths for SVG text alignment
function calculateTextCenter(path: string): { x: number; y: number } {
  const coords = path.replace(/[A-Z]/gi, '').trim().split(/\s+/).map(c => c.split(','));
  let xSum = 0, ySum = 0;
  coords.forEach(pt => {
    xSum += parseFloat(pt[0]);
    ySum += parseFloat(pt[1]);
  });
  return {
    x: xSum / coords.length,
    y: ySum / coords.length
  };
}
