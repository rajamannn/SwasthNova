import React, { useState } from "react";
import { 
  BedDouble, 
  Activity, 
  Settings, 
  TrendingUp, 
  CheckCircle, 
  Sliders, 
  Hourglass, 
  Thermometer, 
  AlertTriangle,
  HeartPulse,
  SlidersHorizontal,
  Layers,
  Wrench,
  Clock,
  ShieldCheck,
  Zap
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from "recharts";
import { HealthCentre, Language, UserRole, LabTest, BedCategory } from "../types";
import { translations } from "../data/translations";
import { useI18n } from "./I18nProvider";

interface ClinicalBedMgmtProps {
  language: Language;
  role: UserRole;
  isLargeText: boolean;
  centres: HealthCentre[];
  selectedCentreId: string;
  onSelectCentreId: (id: string) => void;
  onUpdateBeds: (centreId: string, bedType: 'icu' | 'emergency' | 'maternity' | 'isolation', newOccupied: number) => void;
  onUpdateLabTest: (centreId: string, testId: string, isAvailable: boolean, waitingTime: number, status: 'Operational' | 'Under Maintenance' | 'Down') => void;
}

export default function ClinicalBedMgmt({
  language,
  role,
  isLargeText,
  centres,
  selectedCentreId,
  onSelectCentreId,
  onUpdateBeds,
  onUpdateLabTest
}: ClinicalBedMgmtProps) {
  const t = translations[language];
  const { translateData } = useI18n();

  const activeCentre = centres.find(c => c.id === selectedCentreId) || centres[0];

  // Selected bed type to adjust in form
  const [bedTypeToAdjust, setBedTypeToAdjust] = useState<'icu' | 'emergency' | 'maternity' | 'isolation'>("emergency");
  const [newOccupiedCount, setNewOccupiedCount] = useState("");

  // Recharts: Mock Hourly Patient footfall trends
  const hourlyFootfallData = [
    { hour: "08:00 AM", Patients: 18, "Average Wait Min": 15 },
    { hour: "10:00 AM", Patients: 62, "Average Wait Min": 35 },
    { hour: "12:00 PM", Patients: 85, "Average Wait Min": 50 }, // Peak OPD hours
    { hour: "02:00 PM", Patients: 44, "Average Wait Min": 30 },
    { hour: "04:00 PM", Patients: 32, "Average Wait Min": 20 },
    { hour: "06:00 PM", Patients: 51, "Average Wait Min": 25 },
    { hour: "08:00 PM", Patients: 22, "Average Wait Min": 15 },
  ];

  // Bed details calculations
  const bedTypes: { key: 'icu' | 'emergency' | 'maternity' | 'isolation'; label: string }[] = [
    { key: "icu", label: "ICU Beds" },
    { key: "emergency", label: "Emergency Beds" },
    { key: "maternity", label: "Maternity Beds" },
    { key: "isolation", label: "Isolation Wards" },
  ];

  // Handle Bed Update Form
  const handleBedUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOccupiedCount) return;
    const occupiedNum = parseInt(newOccupiedCount, 10);
    const cat = activeCentre.beds[bedTypeToAdjust];

    if (isNaN(occupiedNum) || occupiedNum < 0 || occupiedNum > cat.total) {
      alert(`Error: Occupied beds cannot exceed total capacity of ${cat.total} beds.`);
      return;
    }

    onUpdateBeds(activeCentre.id, bedTypeToAdjust, occupiedNum);
    setNewOccupiedCount("");
    alert(`Success: Occupied ${bedTypeToAdjust.toUpperCase()} beds updated to ${occupiedNum}/${cat.total} at ${activeCentre.name}.`);
  };

  // Handle Lab Test Status updates (Lab Tech Role)
  const handleLabTestChange = (
    testId: string, 
    isAvailable: boolean, 
    waitingTime: number, 
    status: 'Operational' | 'Under Maintenance' | 'Down'
  ) => {
    onUpdateLabTest(activeCentre.id, testId, isAvailable, waitingTime, status);
  };

  return (
    <div className="space-y-6" id="clinical-tab">
      
      {/* Selector Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10" id="clinical-centre-header">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <BedDouble className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight">{t.clinicalBeds}</h3>
            <p className="text-xs text-slate-400 font-medium">Real-time bed availability audit, clinical overcrowding forecasts, and laboratory test diagnostics.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2" id="clinical-centre-selector">
          <span className="text-xs text-slate-400 font-bold uppercase mr-1">Select Centre:</span>
          <select
            value={selectedCentreId}
            onChange={(e) => onSelectCentreId(e.target.value)}
            className="text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 cursor-pointer outline-hidden focus:border-emerald-500/50"
            id="clinical-centre-dropdown"
          >
            {centres.map(c => (
              <option key={c.id} value={c.id} className="bg-[#0b1220] text-slate-100">{c.name} ({c.type})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Clinical Beds Audit & Bed release Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="beds-and-patient-rush">
        
        {/* Left Bed Capacity grid (Span 2) */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col justify-between" id="beds-inventory-grid">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
              <h4 className="font-bold text-white text-sm flex items-center">
                <ShieldCheck className="mr-2 h-4.5 w-4.5 text-emerald-400" />
                Bed Allocation Ledger: {activeCentre.name}
              </h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Interactive Status</span>
            </div>

            {/* Grid of Bed Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="bed-cards-container">
              {bedTypes.map(type => {
                const cat = activeCentre.beds[type.key];
                if (cat.total === 0) {
                  return (
                    <div key={type.key} className="p-4 bg-white/5 border border-white/10 rounded-xl text-center text-slate-400 flex flex-col items-center justify-center space-y-1">
                      <BedDouble className="h-5 w-5 text-slate-400" />
                      <span className="font-bold text-xs text-slate-300">{type.label}</span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Not Equipped</span>
                    </div>
                  );
                }

                const occupancyRate = cat.occupied / cat.total;
                const isFull = cat.available === 0;

                return (
                  <div key={type.key} className={`p-4 rounded-xl border relative overflow-hidden transition-all hover:shadow-lg hover:bg-white/10 duration-200 ${
                    isFull ? 'bg-rose-500/10 border-rose-500/20' : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-bold text-slate-200">{type.label}</span>
                        <div className="flex items-baseline space-x-1.5 mt-1">
                          <span className="text-xl font-black text-white">{cat.available}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Available</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-slate-300">{cat.occupied} / {cat.total} occupied</span>
                        <span className={`text-[10px] font-bold uppercase block mt-1 ${
                          isFull ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                        }`}>
                          {isFull ? 'At Capacity' : 'Optimal'}
                        </span>
                      </div>
                    </div>

                    {/* Progress slider bar */}
                    <div className="w-full bg-white/10 rounded-full h-2 mt-4">
                      <div 
                        className={`h-2 rounded-full ${isFull ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.round(occupancyRate * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Bed Update Form for Doctor/Admin role */}
          {role === "Doctor" || role === "DistrictAdmin" ? (
            <form onSubmit={handleBedUpdate} className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-end gap-3" id="bed-adjust-form">
              <div className="flex-1 min-w-44 flex flex-col space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Select Bed Category:</span>
                <select
                  value={bedTypeToAdjust}
                  onChange={(e) => setBedTypeToAdjust(e.target.value as any)}
                  className="text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-2 cursor-pointer outline-hidden focus:border-emerald-500/50"
                  id="adjust-bed-type-dropdown"
                >
                  {bedTypes.filter(t => activeCentre.beds[t.key].total > 0).map(t => (
                    <option key={t.key} value={t.key} className="bg-[#0b1220] text-white">{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="w-40 flex flex-col space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">New Occupied Count:</span>
                <input
                  type="number"
                  placeholder="e.g. 5"
                  value={newOccupiedCount}
                  onChange={(e) => setNewOccupiedCount(e.target.value)}
                  required
                  min="0"
                  className="text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 outline-hidden focus:border-emerald-500/50"
                  id="adjust-bed-occupied-input"
                />
              </div>

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-4 py-2.5 rounded-lg transition-all shrink-0 cursor-pointer shadow-lg shadow-emerald-600/20"
                id="adjust-bed-submit-btn"
              >
                Set Occupancy
              </button>
            </form>
          ) : (
            <div className="mt-6 pt-4 border-t border-white/10 text-[10px] text-slate-400 text-center font-semibold">
              🔒 Switch to **Medical Doctor** role in the header to check patients in/out of clinical beds.
            </div>
          )}

        </div>

        {/* Right Patient Footfall peak waves chart */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col justify-between" id="footfall-analytics-panel">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-emerald-400 animate-pulse" />
                <h3 className="font-bold text-white text-sm tracking-tight">OPD Footfall Waves</h3>
              </div>
              <span className="text-[9px] font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                Peak Warning
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time patient flow log. Peak OPD waves occur between **10:00 AM - 1:00 PM**, stretching test queues and waiting thresholds.
            </p>

            {/* Recharts line chart */}
            <div className="h-44 w-full p-2 border border-white/10 rounded-xl bg-white/5" id="footfall-recharts-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyFootfallData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.15)", color: "#fff" }} />
                  <Line type="monotone" dataKey="Patients" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Average Wait Min" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="3 3" />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-300 leading-relaxed font-semibold">
              <span className="font-bold block text-amber-400 mb-0.5 flex items-center">
                <Zap className="h-3.5 w-3.5 mr-1 text-amber-400 shrink-0 animate-pulse" /> AI Scheduling Directive:
              </span>
              OPD surge anticipated in 2 hours. Recommend opening **OPD Ticket Counter 3** and transferring 1 nurse from pediatrics.
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-3 border-t border-white/10 mt-5">
            Gemini Flow-Wave Engine
          </div>
        </div>

      </div>

      {/* Row 3: Laboratory test status (For Lab Technicians) */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg space-y-4" id="lab-test-availability-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base tracking-tight">{t.labTestMonitoring}</h3>
          </div>
          <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md uppercase">
            Lab Tech Console Active
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Monitor blood screenings, radiographies, and scanner equipment operations. Lockout tests immediately when diagnostics hardware is out of order.
        </p>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="lab-tests-settings-grid">
          {activeCentre.labTests.map(test => {
            const isLabTech = role === "LabTech";
            
            // Equipment status colors
            let statusColor = "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
            if (test.equipmentStatus === 'Down') statusColor = "bg-rose-500/15 text-rose-300 border-rose-500/20 animate-pulse";
            else if (test.equipmentStatus === 'Under Maintenance') statusColor = "bg-amber-500/15 text-amber-300 border-amber-500/20";

            return (
              <div 
                key={test.id} 
                className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between hover:shadow-lg hover:bg-white/10 transition-all duration-200"
                id={`lab-card-${test.id}`}
              >
                <div>
                  {/* Card header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-xs text-white">{translateData(test.name)}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border block w-max mt-1.5 ${statusColor}`}>
                        {translateData(test.equipmentStatus)}
                      </span>
                    </div>
                    
                    {/* Lab Tech Toggle button */}
                    {isLabTech ? (
                      <button
                        onClick={() => handleLabTestChange(test.id, !test.isAvailable, test.waitingTimeMin, test.equipmentStatus)}
                        className={`px-2.5 py-1 text-[9px] font-bold rounded-lg border-0 cursor-pointer transition-all ${
                          test.isAvailable 
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                            : 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                        }`}
                        id={`toggle-lab-${test.id}`}
                      >
                        {test.isAvailable ? 'Online' : 'Offline'}
                      </button>
                    ) : (
                      <span className={`px-2 py-1 text-[9px] font-bold rounded-md border ${
                        test.isAvailable ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                      }`}>
                        {test.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    )}
                  </div>

                  {/* Waiting Time Slider (Interactive for Lab Tech) */}
                  <div className="space-y-1 mt-4">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Waiting Threshold</span>
                      <span className="text-white">{test.isAvailable ? `${test.waitingTimeMin} ${t.minutes}` : "Suspended"}</span>
                    </div>
                    {isLabTech && test.isAvailable ? (
                      <input
                        type="range"
                        min="5"
                        max="120"
                        step="5"
                        value={test.waitingTimeMin}
                        onChange={(e) => handleLabTestChange(test.id, test.isAvailable, parseInt(e.target.value, 10), test.equipmentStatus)}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        id={`slider-lab-${test.id}`}
                      />
                    ) : (
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-emerald-500 h-1.5 rounded-full" 
                          style={{ width: `${test.isAvailable ? Math.min(100, (test.waitingTimeMin / 120) * 100) : 0}%` }} 
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Lab Tech Equipment Status dropdown selection */}
                {isLabTech && (
                  <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-400 uppercase text-[8px]">Diagnostics Rig:</span>
                    <select
                      value={test.equipmentStatus}
                      onChange={(e) => handleLabTestChange(test.id, test.isAvailable, test.waitingTimeMin, e.target.value as any)}
                      className="text-[10px] font-bold bg-white/5 border border-white/10 text-white rounded-md px-1.5 py-1 cursor-pointer outline-hidden focus:border-emerald-500/50"
                      id={`select-status-lab-${test.id}`}
                    >
                      <option value="Operational" className="bg-[#0b1220] text-white">Operational</option>
                      <option value="Under Maintenance" className="bg-[#0b1220] text-white">Maintenance</option>
                      <option value="Down" className="bg-[#0b1220] text-white">Hardware Failure</option>
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
