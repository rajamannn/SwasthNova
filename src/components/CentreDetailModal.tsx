import React from "react";
import { 
  X, 
  MapPin, 
  Users, 
  Package, 
  BedDouble, 
  HeartPulse, 
  Activity, 
  TrendingUp, 
  Sliders, 
  Clock,
  Info,
  Thermometer,
  UserPlus,
  AlertTriangle
} from "lucide-react";
import { HealthCentre, Language, UserRole } from "../types";
import { translations } from "../data/translations";
import { calculatePerformanceScore } from "../data/mockData";
import { useI18n } from "./I18nProvider";

interface CentreDetailModalProps {
  language: Language;
  role: UserRole;
  centre: HealthCentre;
  onClose: () => void;
  isLargeText: boolean;
}

export default function CentreDetailModal({
  language,
  role,
  centre,
  onClose,
  isLargeText
}: CentreDetailModalProps) {
  const t = translations[language];
  const { translateData } = useI18n();

  const score = calculatePerformanceScore(centre);
  
  let scoreColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (score < 70) scoreColor = "text-rose-400 bg-rose-500/15 border-rose-500/20";
  else if (score < 85) scoreColor = "text-amber-400 bg-amber-500/15 border-amber-500/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 overflow-y-auto" id="centre-detail-modal-overlay">
      <div 
        className="relative w-full max-w-4xl bg-[#0c1322]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in"
        id="centre-detail-modal-container"
      >
        
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10 bg-white/5 rounded-t-3xl" id="modal-header">
          <div className="space-y-1">
            <span className="text-[10px] bg-white/5 border border-white/10 text-slate-300 font-bold uppercase px-2.5 py-1 rounded-md block w-max">
              {translateData(centre.type)}
            </span>
            <h3 className="font-bold text-white text-xl tracking-tight leading-tight pt-1">{centre.name}</h3>
            <p className="text-xs text-slate-400 font-semibold flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1 text-slate-400" />
              {centre.location} (Alibag District, Maharashtra)
            </p>
          </div>

          <div className="flex items-center space-x-3" id="modal-header-score">
            <div className={`px-3.5 py-1.5 rounded-xl border text-center font-bold text-sm ${scoreColor}`}>
              <span className="text-[10px] block font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1">Index Score</span>
              {score}%
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              id="close-modal-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Stage */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" id="modal-body-content">
          
          {/* Row 1: Quick Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="modal-quick-stats">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patients Logged Today</span>
              <span className="text-xl font-black text-white block mt-1">{centre.totalPatientsToday}</span>
              <span className="text-[10px] text-emerald-300 font-bold mt-1 block">OPD active</span>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Doctors on Duty</span>
              <span className="text-xl font-black text-white block mt-1">{centre.availableDoctors} present</span>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">Scheduled: 2</span>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nurses on Duty</span>
              <span className="text-xl font-black text-white block mt-1">{centre.nursesOnDuty} present</span>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">Scheduled: 4</span>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ambulance Fleet</span>
              <span className="text-xl font-black text-white block mt-1">{centre.ambulanceStatus}</span>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">GPS dispatch online</span>
            </div>
          </div>

          {/* Row 2: Beds Breakdown & Vaccinations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="modal-beds-and-vaccines">
            
            {/* Beds Allotment */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center">
                <BedDouble className="mr-2 h-4 w-4 text-emerald-400" />
                Hospital Beds Occupancy Audit
              </h4>
              <div className="space-y-3.5">
                {Object.entries(centre.beds).map(([key, cat]) => (
                  <div key={key} className="p-3 bg-white/5 rounded-xl border border-white/5 animate-fade-in">
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                      <span className="font-bold uppercase text-[10px] text-slate-300">{key} Beds</span>
                      <span className="text-white font-extrabold">{cat.available} available / {cat.total} total</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      {(() => {
                        const rate = cat.total > 0 ? (cat.occupied / cat.total) * 100 : 0;
                        return (
                          <div className={`h-1.5 rounded-full ${rate > 85 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${rate}%` }} />
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vaccination Progress Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center">
                <HeartPulse className="mr-2 h-4 w-4 text-emerald-400" />
                {t.vaccinationProgress}
              </h4>
              
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3">
                <span className="text-xs text-slate-300 font-bold uppercase tracking-wider block">Immunization Milestone Status</span>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-3xl font-black text-emerald-400">{centre.vaccinationStatus.vaccinatedToday}</span>
                  <span className="text-sm font-semibold text-slate-400">/ {centre.vaccinationStatus.targetToday} doses</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  {(() => {
                    const pct = Math.min(100, Math.round((centre.vaccinationStatus.vaccinatedToday / centre.vaccinationStatus.targetToday) * 100));
                    return (
                      <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    );
                  })()}
                </div>
                <p className="text-[10px] text-emerald-300 font-bold">Vaccine Stocks Optimal. Rotational campaigns logged daily.</p>
              </div>
            </div>

          </div>

          {/* Row 3: Medicine Stocks Details */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4" id="modal-inventory-section">
            <h4 className="font-bold text-white text-sm flex items-center">
              <Package className="mr-2 h-4 w-4 text-emerald-400" />
              Stock Ledger & Shortage Forecasts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="modal-inventory-grid">
              {centre.inventory.map(item => {
                const isCritical = item.quantity < item.criticalLevel || item.daysRemaining <= 4;
                const isWarning = !isCritical && item.daysRemaining <= 10;
                
                let cardStyle = "bg-white/5 border-white/5 text-slate-300";
                if (isCritical) cardStyle = "bg-rose-500/10 border-rose-500/20 text-rose-300";
                else if (isWarning) cardStyle = "bg-amber-500/10 border-amber-500/20 text-amber-300";

                return (
                  <div key={item.name} className={`p-3 rounded-xl border flex flex-col justify-between animate-fade-in ${cardStyle}`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-white leading-tight">{translateData(item.name)}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase shrink-0 ml-1">{translateData(item.category)}</span>
                      </div>
                      <span className="text-sm font-black text-white block mt-1.5">
                        {item.quantity.toLocaleString()} {translateData(item.unit)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-white/5 text-[10px] font-semibold text-slate-400">
                      <span>Daily: {item.avgDailyConsumption} {translateData(item.unit)}</span>
                      <span className={isCritical ? "text-rose-400 font-black" : isWarning ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                        {Math.round(item.daysRemaining)} days left
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 4: Lab diagnostics hardware tests */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4" id="modal-labs-section">
            <h4 className="font-bold text-white text-sm flex items-center">
              <Sliders className="mr-2 h-4 w-4 text-emerald-400" />
              Laboratory Diagnostics Rig Watch
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="modal-labs-grid">
              {centre.labTests.map(test => (
                <div key={test.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between animate-fade-in">
                  <div>
                    <span className="font-bold text-xs text-white block">{test.name}</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Queue wait: {test.isAvailable ? `${test.waitingTimeMin} min` : "Suspended"}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    test.equipmentStatus === 'Operational' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                    test.equipmentStatus === 'Under Maintenance' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                    'bg-rose-500/15 text-rose-300 border-rose-500/20 animate-pulse'
                  }`}>
                    {test.equipmentStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex justify-end rounded-b-3xl" id="modal-footer">
          <button 
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-505 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
            id="close-modal-footer-btn"
          >
            Close Profile Registry
          </button>
        </div>

      </div>
    </div>
  );
}
