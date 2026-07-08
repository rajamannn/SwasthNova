import React, { useState } from "react";
import { 
  Map, 
  Layers, 
  MapPin, 
  Activity, 
  TrendingUp, 
  ShieldAlert, 
  Truck, 
  ArrowRightLeft, 
  Plus, 
  Minus,
  Maximize2
} from "lucide-react";
import { HealthCentre, Language, ResourceTransfer } from "../types";
import { translations } from "../data/translations";
import { calculatePerformanceScore } from "../data/mockData";

interface MapDashboardProps {
  language: Language;
  centres: HealthCentre[];
  transfers: ResourceTransfer[];
  onSelectCentre: (centreId: string) => void;
  isLargeText: boolean;
}

type HeatmapMode = "None" | "PatientLoad" | "BedOccupancy" | "StockShortage";

export default function MapDashboard({
  language,
  centres,
  transfers,
  onSelectCentre,
  isLargeText
}: MapDashboardProps) {
  const t = translations[language];
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>("None");
  const [selectedCentre, setSelectedCentre] = useState<HealthCentre | null>(centres[0]);

  // Handle active transfer animations
  const activeTransfers = transfers.filter(tx => tx.status === "In Transit");

  const getHeatmapColor = (centre: HealthCentre) => {
    if (heatmapMode === "None") return "";
    
    if (heatmapMode === "PatientLoad") {
      const load = centre.totalPatientsToday;
      if (load > 200) return "rgba(239, 68, 68, 0.45)"; // critical red
      if (load > 100) return "rgba(245, 158, 11, 0.4)"; // warning amber
      return "rgba(16, 185, 129, 0.2)"; // stable green
    }

    if (heatmapMode === "BedOccupancy") {
      const occupied = Object.values(centre.beds).reduce((acc, cat) => acc + cat.occupied, 0);
      const total = occupied + Object.values(centre.beds).reduce((acc, cat) => acc + cat.available, 0);
      const rate = total > 0 ? occupied / total : 0;
      if (rate > 0.85) return "rgba(239, 68, 68, 0.5)"; // red
      if (rate > 0.5) return "rgba(245, 158, 11, 0.4)"; // amber
      return "rgba(16, 185, 129, 0.2)";
    }

    if (heatmapMode === "StockShortage") {
      const score = calculatePerformanceScore(centre);
      if (score < 65) return "rgba(239, 68, 68, 0.5)";
      if (score < 80) return "rgba(245, 158, 11, 0.4)";
      return "rgba(16, 185, 129, 0.2)";
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="map-dashboard-tab">
      
      {/* GIS Interactive Map Canvas (Span 2) */}
      <div className="xl:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex flex-col justify-between shadow-lg relative h-[560px]" id="gis-map-canvas-container">
        
        {/* Map Headers and Heatmap Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10" id="map-layer-controls">
          <div>
            <h3 className="font-bold text-white tracking-tight flex items-center">
              <Map className="mr-2 h-4.5 w-4.5 text-emerald-400" />
              Alibag District Health GIS Network
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">Click on centers to view live telemetry and active transport routes.</p>
          </div>

          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xl p-1" id="heatmap-overlay-selector">
            <span className="text-[9px] font-bold text-slate-400 uppercase px-2">Overlay:</span>
            {(["None", "PatientLoad", "BedOccupancy", "StockShortage"] as HeatmapMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setHeatmapMode(mode)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                  heatmapMode === mode 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                    : "text-slate-400 hover:text-white"
                }`}
                id={`heatmap-mode-${mode}`}
              >
                {mode === "None" && "Normal"}
                {mode === "PatientLoad" && "Patient Load"}
                {mode === "BedOccupancy" && "Bed Occupancy"}
                {mode === "StockShortage" && "Resource Alert"}
              </button>
            ))}
          </div>
        </div>

        {/* Vector SVG Map Stage */}
        <div className="flex-1 relative mt-4 border border-white/10 rounded-xl bg-white/5 overflow-hidden shadow-inner flex items-center justify-center" id="svg-map-stage">
          
          {/* Custom Stylized Background Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }} />

          {/* District Outline and Administrative Boundaries */}
          <svg className="w-full h-full min-h-[400px]" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Outline path */}
            <path 
              d="M15,20 C30,10 65,12 85,25 C95,35 88,65 75,85 C60,95 30,90 12,75 C5,65 8,35 15,20 Z" 
              fill="rgba(16, 185, 129, 0.01)" 
              stroke="rgba(255, 255, 255, 0.15)" 
              strokeWidth="0.8" 
              strokeDasharray="2"
            />
            
            {/* Roads & Transport Connections */}
            <path d="M45,55 L78,35" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.3" strokeDasharray="1" />
            <path d="M45,55 L30,38" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.3" strokeDasharray="1" />
            <path d="M45,55 L62,22" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.3" strokeDasharray="1" />
            <path d="M45,55 L20,65" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.3" strokeDasharray="1" />
            <path d="M45,55 L42,82" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.3" strokeDasharray="1" />
            <path d="M30,38 L20,65" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.3" strokeDasharray="1" />
            <path d="M78,35 L62,22" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.3" strokeDasharray="1" />

            {/* Active In-Transit transfers dot animation path */}
            {activeTransfers.map(tx => {
              const fromC = centres.find(c => c.id === tx.fromCentreId);
              const toC = centres.find(c => c.id === tx.toCentreId);
              if (fromC && toC) {
                return (
                  <g key={tx.id}>
                    {/* Animated moving dot representing the supply truck */}
                    <circle r="1" fill="#f59e0b">
                      <animateMotion 
                        path={`M${fromC.coordinates.x},${fromC.coordinates.y} L${toC.coordinates.x},${toC.coordinates.y}`} 
                        dur="6s" 
                        repeatCount="indefinite" 
                      />
                    </circle>
                    {/* Pulsing halo around delivery truck */}
                    <circle r="2.5" fill="#f59e0b" opacity="0.3">
                      <animateMotion 
                        path={`M${fromC.coordinates.x},${fromC.coordinates.y} L${toC.coordinates.x},${toC.coordinates.y}`} 
                        dur="6s" 
                        repeatCount="indefinite" 
                      />
                      <animate attributeName="r" values="1.5;3;1.5" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              }
              return null;
            })}
          </svg>

          {/* Plotting Health Centres as Interactive HTML nodes */}
          {centres.map(centre => {
            const score = calculatePerformanceScore(centre);
            const isSelected = selectedCentre?.id === centre.id;
            
            // Marker color
            let markerColor = "bg-emerald-500 border-emerald-100 ring-emerald-500/20";
            if (score < 70) markerColor = "bg-rose-500 border-rose-100 ring-rose-500/20";
            else if (score < 85) markerColor = "bg-amber-500 border-amber-100 ring-amber-500/20";

            return (
              <div 
                key={centre.id}
                style={{ left: `${centre.coordinates.x}%`, top: `${centre.coordinates.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                onClick={() => setSelectedCentre(centre)}
                id={`marker-${centre.id}`}
              >
                {/* Heatmap glow overlay background */}
                {heatmapMode !== "None" && (
                  <div 
                    className="absolute inset-0 rounded-full blur-xl scale-[4] transition-all duration-500 pointer-events-none animate-pulse"
                    style={{ backgroundColor: getHeatmapColor(centre) }}
                  />
                )}

                {/* Marker body */}
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ring-4 transition-all duration-300 ${markerColor} ${
                  isSelected ? 'scale-125 border-white ring-white/25' : 'hover:scale-115'
                }`}>
                  {/* Pulse wave animation */}
                  <span className={`absolute inset-0 rounded-full ring-4 animate-ping opacity-15 ${
                    score < 70 ? 'ring-rose-500' : 'ring-emerald-500'
                  }`} />
                  {centre.type === "District Hospital" && (
                    <span className="text-[8px] font-extrabold text-white">H</span>
                  )}
                </div>

                {/* Micro Tooltip */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-slate-950/90 border border-white/15 text-white text-[9px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md truncate max-w-40 z-50">
                  {centre.name}
                </div>
              </div>
            );
          })}

          {/* Compass layout indicator */}
          <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md p-2 rounded-lg border border-white/10 text-[9px] font-bold text-slate-300 flex flex-col space-y-1">
            <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5" />Stable (&gt;85%)</span>
            <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-amber-500 mr-1.5" />Warning (70%-84%)</span>
            <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-rose-500 mr-1.5" />Critical (&lt;70%)</span>
          </div>

          {/* In Transit legend indicator */}
          {activeTransfers.length > 0 && (
            <div className="absolute bottom-4 right-4 bg-slate-950/80 border border-white/10 text-white p-2.5 rounded-lg text-[9px] font-bold flex items-center space-x-2 animate-pulse">
              <Truck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Smart redistribution trucks active in network</span>
            </div>
          )}
        </div>

        {/* Dynamic Map Footer Status */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-3 border-t border-white/10 mt-4">
          <span className="font-bold uppercase tracking-wider">Map Scale: 1 unit = 0.8 km</span>
          <span className="font-semibold text-slate-400 flex items-center">
            <Layers className="h-3.5 w-3.5 mr-1 text-emerald-400" /> Dynamic GIS layer active
          </span>
        </div>

      </div>

      {/* Selected Centre Live Profile (Span 1) */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col justify-between" id="gis-sidebar-profile">
        {selectedCentre ? (
          <div className="space-y-5" id="centre-profile-details">
            <div>
              <span className="text-[10px] bg-white/5 border border-white/10 text-slate-300 font-bold uppercase tracking-widest px-2.5 py-1 rounded-md block w-max mb-2.5">
                {selectedCentre.type}
              </span>
              <h3 className="font-bold text-white text-base leading-tight tracking-tight">{selectedCentre.name}</h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center font-medium">
                <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                {selectedCentre.location}
              </p>
            </div>

            {/* Overall score bar */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-400">{t.overallHealth}</span>
                <span className={`text-sm font-extrabold ${
                  calculatePerformanceScore(selectedCentre) >= 85 ? 'text-emerald-400' :
                  calculatePerformanceScore(selectedCentre) >= 70 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {calculatePerformanceScore(selectedCentre)}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    calculatePerformanceScore(selectedCentre) >= 85 ? 'bg-emerald-500' :
                    calculatePerformanceScore(selectedCentre) >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${calculatePerformanceScore(selectedCentre)}%` }}
                />
              </div>
            </div>

            {/* Quick Profile stats */}
            <div className="grid grid-cols-2 gap-4" id="centre-profile-stats">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Patients</span>
                <span className="text-lg font-black text-white mt-1 block">{selectedCentre.totalPatientsToday}</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Doctors Active</span>
                <span className="text-lg font-black text-white mt-1 block">{selectedCentre.availableDoctors}</span>
              </div>
            </div>

            {/* Clinical bed availability */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bed Allotment Status</h4>
              <div className="grid grid-cols-2 gap-2 text-xs" id="bed-status-profile">
                {Object.entries(selectedCentre.beds).map(([key, cat]) => (
                  <div key={key} className="p-2.5 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center">
                    <span className="font-bold text-slate-400 uppercase text-[9px]">{key}</span>
                    <span className={`font-extrabold text-[11px] ${cat.available === 0 ? "text-rose-400 font-black" : "text-white"}`}>
                      {cat.available} free
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Alerts section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Stock Shortage Telemetry</h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1" id="stock-alerts-profile">
                {selectedCentre.inventory.filter(i => i.quantity < i.criticalLevel).length === 0 ? (
                  <div className="text-center py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-300 font-semibold flex items-center justify-center">
                    ✓ Inventory Stock levels optimal
                  </div>
                ) : (
                  selectedCentre.inventory.filter(i => i.quantity < i.criticalLevel).map(item => (
                    <div key={item.name} className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg flex justify-between items-center text-[10px] text-rose-300 animate-fade-in">
                      <span className="font-bold">{item.name}</span>
                      <span className="font-extrabold text-rose-400 shrink-0">
                        {item.quantity} {item.unit} ({Math.round(item.daysRemaining)}d left)
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Call to action */}
            <button 
              onClick={() => onSelectCentre(selectedCentre.id)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              <span>See Full Operational Profile</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-24 text-slate-400 text-xs" id="no-centre-selected">
            No health centre selected.
          </div>
        )}

        <div className="text-center border-t border-white/10 pt-4 mt-5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          District Operations Portal
        </div>
      </div>

    </div>
  );
}
