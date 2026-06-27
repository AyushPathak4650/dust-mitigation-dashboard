import React, { useState } from 'react';
import OverviewDashboard from './features/dashboard/OverviewDashboard';
import DistrictGisMap from './features/map/DistrictGisMap';
import AeroSimulator from './features/simulator/AeroSimulator';
import RoiPlanner from './features/planner/RoiPlanner';
import TechnicalReportViewer from './features/report/TechnicalReportViewer';
import { useRoiCalculator } from './hooks/useRoiCalculator';
import './styles/App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { inputs, outputs, updateInput } = useRoiCalculator();

  const handleExportData = () => {
    // Export simulation & financial reports safely in CSV
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Retrofitted Trucks,${inputs.trucks}\n`
      + `Payback Period (Months),${outputs.paybackMonths.toFixed(1)}\n`
      + `CO2 Mitigated (Tonnes),${Math.round(outputs.co2SavedTonnes)}\n`
      + `State CAPEX (Cr),${outputs.capexCr.toFixed(2)}\n`
      + `Annual Savings (Cr),${outputs.fuelSavingsCr.toFixed(2)}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aerodust_shield_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const titles: Record<string, string> = {
    dashboard: "Executive Overview",
    map: "Interactive GIS Map",
    simulator: "Aero Simulator & Physics Engine",
    planner: "ROI & Rollout Planner",
    report: "Technical Engineering Report"
  };

  const subtitles: Record<string, string> = {
    dashboard: "Real-time air quality metrics, heavy vehicle deployment statistics, and socioeconomic impact tracker.",
    map: "GIS heat map visualizing particulate pollution (PM10), industrial corridors, and heavy truck density across Chhattisgarh.",
    simulator: "Aerodynamic airflow and dust particle tracking simulation. Toggle the AeroDust-Shield to observe physics parameters.",
    planner: "Adjust target fleets, daily travel distances, and material compositions to calculate financial return (ROI) and public health savings.",
    report: "Complete 16-section engineering research and policy report for the AeroDust-Shield dust mitigation system."
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-icon">
            <i className="fa-solid fa-wind text-accent"></i>
          </div>
          <div className="brand-text">
            <h1>AeroDust-Shield</h1>
            <span>CG Dust Mitigation Portal</span>
          </div>
        </div>
        
        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            aria-label="Navigate to Executive Overview"
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Executive Overview</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
            aria-label="Navigate to Interactive GIS Map"
          >
            <i className="fa-solid fa-map-location-dot"></i>
            <span>Interactive GIS Map</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
            aria-label="Navigate to Aero Simulator"
          >
            <i className="fa-solid fa-gauge-high"></i>
            <span>Aero Simulator</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'planner' ? 'active' : ''}`}
            onClick={() => setActiveTab('planner')}
            aria-label="Navigate to ROI and Rollout Planner"
          >
            <i className="fa-solid fa-calculator"></i>
            <span>ROI & Rollout Planner</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
            aria-label="Navigate to Technical Report"
          >
            <i className="fa-solid fa-file-invoice"></i>
            <span>Technical Report</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="version">v1.2.0 (Build 2026)</div>
          <div className="org">Developed for CECB & MoRTH</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="app-header">
          <div className="header-title">
            <h2>{titles[activeTab]}</h2>
            <p>{subtitles[activeTab]}</p>
          </div>
          <div className="header-actions">
            <div className="system-status">
              <span className="status-indicator online"></span>
              <span>CECB Node Active</span>
            </div>
            <button className="btn btn-primary" onClick={handleExportData} aria-label="Export Data Report">
              <i className="fa-solid fa-download"></i> Export Data
            </button>
          </div>
        </header>

        {/* Tab Views */}
        <div className="view-container">
          {activeTab === 'dashboard' && (
            <OverviewDashboard inputs={inputs} outputs={outputs} />
          )}
          {activeTab === 'map' && (
            <DistrictGisMap />
          )}
          {activeTab === 'simulator' && (
            <AeroSimulator />
          )}
          {activeTab === 'planner' && (
            <RoiPlanner inputs={inputs} outputs={outputs} updateInput={updateInput} />
          )}
          {activeTab === 'report' && (
            <TechnicalReportViewer />
          )}
        </div>
      </main>
    </div>
  );
}
export default App;
