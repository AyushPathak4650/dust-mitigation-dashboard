import { RoiInput, RoiOutput } from '../../types';
import { HOTSPOT_DATA, TIMELINE_DATA } from '../../constants';
import { formatCurrency, formatCurrencyCr } from '../../utils/mathHelpers';
import './Dashboard.css';

interface DashboardProps {
  inputs: RoiInput;
  outputs: RoiOutput;
}

export default function OverviewDashboard({ inputs, outputs }: DashboardProps) {
  return (
    <div className="dashboard-view">
      {/* Top Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <i className="fa-solid fa-truck"></i>
          </div>
          <div className="stat-info">
            <h3>Vehicles Retrofitted</h3>
            <div className="value">{inputs.trucks.toLocaleString('en-IN')}</div>
            <p className="trend positive"><i className="fa-solid fa-arrow-trend-up"></i> +8.2% this month</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon icon-green">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div className="stat-info">
            <h3>Est. Dust Settle Rate</h3>
            <div className="value">78.5%</div>
            <p className="trend positive"><i className="fa-solid fa-check"></i> Within target zone</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-yellow">
            <i className="fa-solid fa-leaf"></i>
          </div>
          <div className="stat-info">
            <h3>CO₂ Emissions Saved</h3>
            <div className="value">{Math.round(outputs.co2SavedTonnes).toLocaleString('en-IN')} t</div>
            <p className="trend positive"><i className="fa-solid fa-arrow-trend-up"></i> 1.15 t/truck/year</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-red">
            <i className="fa-solid fa-heart-pulse"></i>
          </div>
          <div className="stat-info">
            <h3>Health Savings (Est.)</h3>
            <div className="value">{formatCurrencyCr(outputs.healthSavingsCr)}</div>
            <p className="trend positive"><i className="fa-solid fa-user-doctor"></i> Reduced PM2.5 exposure</p>
          </div>
        </div>
      </div>

      {/* Middle Row Grid */}
      <div className="dashboard-grid">
        {/* AQI Chart */}
        <div className="card card-large">
          <div className="card-header">
            <h4>Ambient Air Quality Index (AQI) Trends</h4>
            <div className="card-actions">
              <span className="badge badge-warning">Winter Peak Baseline Included</span>
            </div>
          </div>
          <div className="card-body">
            <div className="aqi-tracker-container">
              <div className="aqi-metrics">
                <div className="aqi-metric-box">
                  <span className="label">State Average AQI</span>
                  <span className="value text-warning">182</span>
                  <span className="status">Moderately Poor</span>
                </div>
                <div className="aqi-metric-box border-left">
                  <span className="label">Target AQI (Post-Rollout)</span>
                  <span className="value text-success">115</span>
                  <span className="status">Satisfactory</span>
                </div>
                <div className="aqi-metric-box border-left">
                  <span className="label">Avg PM10 reduction</span>
                  <span className="value text-accent">-64.2%</span>
                  <span className="status">Vehicular Wake Dust Only</span>
                </div>
              </div>

              {/* Bar Chart Graphics */}
              <div className="custom-chart-container">
                <div className="chart-y-axis">
                  <span>300</span>
                  <span>200</span>
                  <span>100</span>
                  <span>0</span>
                </div>
                <div className="chart-bars">
                  <div className="bar-group">
                    <div className="bar bar-before" style={{ height: '70%' }} data-value="210"></div>
                    <div className="bar bar-after" style={{ height: '38%' }} data-value="115"></div>
                    <span className="bar-label">Raipur</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar bar-before" style={{ height: '85%' }} data-value="255"></div>
                    <div className="bar bar-after" style={{ height: '45%' }} data-value="135"></div>
                    <span className="bar-label">Korba</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar bar-before" style={{ height: '62%' }} data-value="185"></div>
                    <div className="bar bar-after" style={{ height: '33%' }} data-value="100"></div>
                    <span className="bar-label">Raigarh</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar bar-before" style={{ height: '58%' }} data-value="175"></div>
                    <div className="bar bar-after" style={{ height: '30%' }} data-value="90"></div>
                    <span className="bar-label">Bhilai-Durg</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar bar-before" style={{ height: '50%' }} data-value="150"></div>
                    <div className="bar bar-after" style={{ height: '25%' }} data-value="75"></div>
                    <span className="bar-label">Bilaspur</span>
                  </div>
                </div>
                <div className="chart-legend">
                  <span className="legend-item"><span className="legend-color color-before"></span> Before AeroDust-Shield</span>
                  <span className="legend-item"><span className="legend-color color-after"></span> After AeroDust-Shield</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Infographic Graphic Card */}
        <div className="card card-small">
          <div className="card-header">
            <h4>AeroDust-Shield System Layout</h4>
          </div>
          <div className="card-body centered-flex">
            <div className="device-infographic">
              <div className="infographic-image">
                <svg viewBox="0 0 400 200" width="100%" height="100%" className="truck-svg">
                  <defs>
                    <linearGradient id="truck-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2c3e50" />
                      <stop offset="100%" stopColor="#34495e" />
                    </linearGradient>
                    <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#4facfe" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  <line x1="10" y1="170" x2="390" y2="170" stroke="#7f8c8d" strokeWidth="3" strokeDasharray="8,6" />
                  <rect x="60" y="40" width="220" height="90" rx="4" fill="url(#truck-body-grad)" />
                  <rect x="280" y="70" width="60" height="60" rx="6" fill="#1a252f" />
                  <rect x="305" y="80" width="30" height="30" rx="3" fill="#00f2fe" opacity="0.3" />
                  <circle cx="100" cy="150" r="22" fill="#111" stroke="#333" strokeWidth="3" />
                  <circle cx="100" cy="150" r="10" fill="#7f8c8d" />
                  <circle cx="210" cy="150" r="22" fill="#111" stroke="#333" strokeWidth="3" />
                  <circle cx="210" cy="150" r="10" fill="#7f8c8d" />
                  <circle cx="260" cy="150" r="22" fill="#111" stroke="#333" strokeWidth="3" />
                  <circle cx="260" cy="150" r="10" fill="#7f8c8d" />
                  
                  <rect x="128" y="125" width="60" height="20" rx="2" fill="url(#shield-grad)" className="pulse-element" />
                  <text x="158" y="137" fill="#fff" fontSize="7" fontWeight="bold" textAnchor="middle">FSS SKIRTS</text>
                  
                  <path d="M 282,130 L 315,142 L 315,148 L 282,135 Z" fill="url(#shield-grad)" className="pulse-element" />
                  <text x="298" y="152" fill="#00f2fe" fontSize="7" fontWeight="bold" textAnchor="middle">UCD DIFFUSER</text>
                  
                  <rect x="272" y="120" width="16" height="30" rx="2" fill="#ff4b5c" className="pulse-element" />
                  <text x="280" y="163" fill="#ff4b5c" fontSize="7" fontWeight="bold" textAnchor="middle">T-TEB TRAP</text>
                </svg>
              </div>
              <div className="infographic-details">
                <div className="info-item">
                  <span className="color-dot bg-blue"></span>
                  <div>
                    <strong>FSS Side Skirts:</strong> Restricts lateral cross-winds and channels airflow.
                  </div>
                </div>
                <div className="info-item">
                  <span className="color-dot bg-cyan"></span>
                  <div>
                    <strong>UCD Rear Diffuser:</strong> Converts kinetic energy to pressure, reducing road shear.
                  </div>
                </div>
                <div className="info-item">
                  <span className="color-dot bg-red"></span>
                  <div>
                    <strong>T-TEB Electrostatic Trap:</strong> Captures dual-tire road dust via triboelectric charging.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid Row */}
      <div className="dashboard-grid grid-3">
        {/* Hotspots */}
        <div className="card">
          <div className="card-header">
            <h4>High Impact Zones (Hotspots)</h4>
          </div>
          <div className="card-body no-padding">
            <ul className="list-items">
              {HOTSPOT_DATA.map((h, i) => (
                <li key={i} className="list-item">
                  <div>
                    <div className="list-item-title">{h.location}</div>
                    <div className="list-item-sub">District: {h.district} | Heavy Traffic Zone</div>
                  </div>
                  <div className="list-item-badge">
                    <span className={`value ${h.class}`}>{h.pm10}</span>
                    <span className={`status-text ${h.class}`}>{h.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="card">
          <div className="card-header">
            <h4>Adoption Timeline Progress</h4>
          </div>
          <div className="card-body">
            <div className="timeline-compact">
              {TIMELINE_DATA.map((t, i) => (
                <div key={i} className={`timeline-item ${t.status}`}>
                  <div className="time-bullet"></div>
                  <div className="time-content">
                    <h5>{t.title}</h5>
                    <p>{t.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="card">
          <div className="card-header">
            <h4>Socioeconomic Key Performance Indicators</h4>
          </div>
          <div className="card-body">
            <div className="kpi-metrics-list">
              <div className="kpi-item">
                <span className="kpi-label">Annual Diesel Saved per Truck</span>
                <span className="kpi-value text-success">
                  {Math.round(outputs.fuelSavingsPerTruck / inputs.dieselPrice)} L
                </span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">Fuel Cost Savings per Truck</span>
                <span className="kpi-value text-success">
                  {formatCurrency(outputs.fuelSavingsPerTruck)}
                </span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">Payback Period per Unit</span>
                <span className="kpi-value text-accent">
                  {outputs.paybackMonths.toFixed(1)} Months
                </span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">Dermatological & Respiratory Reduction</span>
                <span className="kpi-value text-accent">-32.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
