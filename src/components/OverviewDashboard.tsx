import React, { useState } from "react";
import { 
  Building2, 
  Users, 
  HeartPulse, 
  Activity, 
  TrendingUp, 
  Award, 
  Plus, 
  Search, 
  Sliders, 
  HelpCircle,
  Truck,
  FileCheck,
  AlertOctagon,
  CheckCircle,
  Info,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { HealthCentre, Language, UserRole } from "../types";
import { translations } from "../data/translations";
import { calculatePerformanceScore, getOutbreakPredictions } from "../data/mockData";

interface OverviewDashboardProps {
  language: Language;
  role: UserRole;
  isLargeText: boolean;
  centres: HealthCentre[];
  onSelectCentre: (centreId: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function OverviewDashboard({
  language,
  role,
  isLargeText,
  centres,
  onSelectCentre,
  onNavigateToTab
}: OverviewDashboardProps) {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");

  const outbreakPredicts = getOutbreakPredictions(centres);

  // Dynamic calculations based on live centres state
  const totalPatients = centres.reduce((sum, c) => sum + c.totalPatientsToday, 0);
  const totalDoctors = centres.reduce((sum, c) => sum + c.availableDoctors, 0);
  const totalNurses = centres.reduce((sum, c) => sum + c.nursesOnDuty, 0);
  
  const avgDistrictScore = Math.round(
    centres.reduce((sum, c) => sum + calculatePerformanceScore(c), 0) / centres.length
  );

  // Filter centers
  const filteredCentres = centres.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Sort centers by score to detect underperforming
  const rankedCentres = [...centres].map(c => ({
    ...c,
    score: calculatePerformanceScore(c)
  })).sort((a, b) => a.score - b.score); // worst score first

  const criticalCentres = rankedCentres.filter(c => c.score < 70);

  // AI-generated suggestions
  const aiInsights = [
    { text: "Dengue outbreak warning at PHC Uran: cases up 40% in coastal sectors. Allocate 150 mosquito nets and fever drugs immediately.", type: "critical" },
    { text: "Critical shortage of BCG Vaccine at CHC Karjat (5 days left). Transfer surplus vaccine stock from District General Hospital.", type: "warning" },
    { text: "Understaffing detected: PHC Pen operates with only 1 active OPD doctor. Recommend temporary nurse/doctor rotational shift from Alibag Town.", type: "warning" },
    { text: "Oxygen Cylinders optimal: Roha CHC maintains 24 days buffer. Redistribution recommendations calculated in 'Smart Redistribution' tab.", type: "info" }
  ];

  return (
    <div className="space-y-6" id="overview-dashboard-tab">
      
      {/* Top Welcome & KPI Metrics banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" id="district-kpi-cards">
        
        {/* District Performance Scorecard */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-lg flex items-center space-x-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
          <div className="p-3.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <Award className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.overallHealth}</span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-extrabold text-white">{avgDistrictScore}%</span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-sm flex items-center border border-emerald-500/30">
                <TrendingUp className="h-3 w-3 mr-0.5" /> High
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${avgDistrictScore}%` }}></div>
            </div>
          </div>
        </div>

        {/* Patients Active today */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-lg flex items-center space-x-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
          <div className="p-3.5 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.totalPatients}</span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-extrabold text-white">{totalPatients}</span>
              <span className="text-xs text-slate-400 font-medium">District Caseload</span>
            </div>
            <p className="text-[10px] text-sky-300 font-bold mt-2">Peak expected: 10:00 AM - 1:00 PM</p>
          </div>
        </div>

        {/* Available Doctors */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-lg flex items-center space-x-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
          <div className="p-3.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.availableDoctors}</span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-extrabold text-white">{totalDoctors}</span>
              <span className="text-xs text-slate-400 font-medium">On Duty Today</span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium mt-2">Nurses Active: <span className="font-bold text-white">{totalNurses}</span></p>
          </div>
        </div>

        {/* Emergency Ambulance Coverage */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-lg flex items-center space-x-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
          <div className="p-3.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.ambulanceStatus}</span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-extrabold text-white">83%</span>
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/25 px-1.5 rounded border border-emerald-500/30">Active</span>
            </div>
            <p className="text-[10px] text-amber-300 font-bold mt-2">5 of 6 Fleets ready for dispatch</p>
          </div>
        </div>

      </div>

      {/* Row 2: AI Actionable Insights (Dengue outbreaks, stock outs, etc.) */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 relative overflow-hidden animate-fade-in" id="ai-insights-ticker">
        <div className="absolute right-0 top-0 opacity-5 transform translate-x-12 -translate-y-12">
          <Building2 className="h-64 w-64 text-emerald-400" />
        </div>
        <div className="flex items-center space-x-2 mb-4 relative z-10">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">SwasthNova Live Directives</span>
        </div>
        <h3 className="text-lg font-bold mb-3 tracking-tight text-white relative z-10">Active Operations Intelligence Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10" id="insights-grid">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start space-x-3 hover:bg-white/10 transition-all duration-300">
              {insight.type === "critical" ? (
                <span className="flex h-5 w-5 shrink-0 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 items-center justify-center font-extrabold text-xs">!</span>
              ) : insight.type === "warning" ? (
                <span className="flex h-5 w-5 shrink-0 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 items-center justify-center font-extrabold text-xs">▲</span>
              ) : (
                <span className="flex h-5 w-5 shrink-0 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 items-center justify-center font-extrabold text-xs">i</span>
              )}
              <p className="text-xs text-slate-300 leading-relaxed font-medium">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Live Health Centre Grid + Filters */}
      <div className="space-y-4" id="health-centre-grid-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchCentres}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white outline-hidden focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              id="centre-search-input"
            />
          </div>
          <div className="flex items-center space-x-2" id="filter-buttons">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Filter:</span>
            {["All", "District Hospital", "CHC", "PHC"].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                  typeFilter === type 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                    : "bg-white/5 text-slate-300 border border-white/5 hover:bg-white/10 hover:text-white"
                }`}
                id={`filter-${type}`}
              >
                {type === "District Hospital" ? t.districtHospital : type === "CHC" ? t.chc : type === "PHC" ? t.phc : "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="health-centre-cards">
          {filteredCentres.map(centre => {
            const score = calculatePerformanceScore(centre);
            const scoreColor = score >= 85 ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" : 
                               score >= 70 ? "text-amber-300 bg-amber-500/10 border-amber-500/20" : 
                               "text-rose-300 bg-rose-500/10 border-rose-500/20";

            const criticalMeds = centre.inventory.filter(i => i.quantity < i.criticalLevel).length;

            return (
              <div 
                key={centre.id}
                onClick={() => onSelectCentre(centre.id)}
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer p-5 flex flex-col justify-between group"
                id={`card-centre-${centre.id}`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{centre.type}</span>
                      <h4 className="font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors leading-tight mt-0.5">
                        {centre.name}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center mt-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                        {centre.location}
                      </p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg border text-center font-bold text-xs ${scoreColor}`}>
                      {score}%
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/10 my-4" />

                  {/* Core Metrics Quick List */}
                  <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                    <div>
                      <span className="text-slate-400 font-semibold block">Patients Today</span>
                      <span className="font-bold text-slate-200 text-sm mt-0.5 block">{centre.totalPatientsToday}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Doctors Active</span>
                      <span className={`font-bold text-sm mt-0.5 block ${centre.availableDoctors === 0 ? "text-rose-400" : "text-slate-200"}`}>
                        {centre.availableDoctors} present
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Critical Shortages</span>
                      <span className={`font-bold text-sm mt-0.5 block ${criticalMeds > 0 ? "text-rose-400 font-extrabold" : "text-emerald-400"}`}>
                        {criticalMeds} alerts
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Ambulance</span>
                      <span className={`font-bold text-sm mt-0.5 block ${
                        centre.ambulanceStatus === "Available" ? "text-emerald-400" :
                        centre.ambulanceStatus === "On Trip" ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {centre.ambulanceStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Progress Indicators */}
                <div className="space-y-3 pt-3 border-t border-white/10 text-[11px]" id="card-footer-indicators">
                  {/* Bed Occupancy rate */}
                  <div>
                    <div className="flex justify-between font-semibold text-slate-400 mb-1">
                      <span>Bed Availability</span>
                      <span className="text-slate-200 font-bold">
                        {Object.values(centre.beds).reduce((acc, cat) => acc + cat.available, 0)} available
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      {/* Calculate total bed occupancy */}
                      {(() => {
                        const occupied = Object.values(centre.beds).reduce((acc, cat) => acc + cat.occupied, 0);
                        const total = occupied + Object.values(centre.beds).reduce((acc, cat) => acc + cat.available, 0);
                        const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
                        return (
                          <div className={`h-1.5 rounded-full ${pct > 90 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                        );
                      })()}
                    </div>
                  </div>

                  {/* Vaccination Progress bar */}
                  <div>
                    <div className="flex justify-between font-semibold text-slate-400 mb-1">
                      <span>{t.vaccinationProgress}</span>
                      <span className="text-slate-200 font-bold">
                        {centre.vaccinationStatus.vaccinatedToday} / {centre.vaccinationStatus.targetToday}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      {(() => {
                        const pct = Math.min(100, Math.round((centre.vaccinationStatus.vaccinatedToday / centre.vaccinationStatus.targetToday) * 100));
                        return (
                          <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                        );
                      })()}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Row 4: Side-by-Side: Underperforming Centre Detection & Outbreak Forecasting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="critical-warnings-block">
        
        {/* Underperforming Centers Scorecard */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col justify-between" id="underperforming-scorecard">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertOctagon className="h-5 w-5 text-rose-400" />
                <h3 className="font-bold text-white tracking-tight">{t.underperformingCenters}</h3>
              </div>
              <span className="text-xs text-rose-300 bg-rose-500/10 font-bold px-2 py-0.5 rounded-md border border-rose-500/20">
                Action Required
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Centers scoring below **70%** trigger immediate administrative alerts. Risk Scores are computed based on vaccine shortages, understaffing, and excessive waiting lists.
            </p>

            <div className="space-y-3.5" id="critical-centres-list">
              {rankedCentres.map((centre, idx) => {
                const isCritical = centre.score < 70;
                return (
                  <div 
                    key={centre.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      isCritical 
                        ? "bg-rose-500/5 border-rose-500/20 text-rose-200" 
                        : "bg-white/5 border-white/5 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-extrabold text-sm text-slate-500">#{idx + 1}</span>
                      <div>
                        <h4 className="font-bold text-xs text-white leading-snug">{centre.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{centre.type} • Score: {centre.score}%</p>
                      </div>
                    </div>
                    {isCritical ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCentre(centre.id);
                        }}
                        className="text-[10px] bg-rose-600 hover:bg-rose-500 text-white font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Troubleshoot
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                        Stable
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">District Scorecard</span>
            <button 
              onClick={() => onNavigateToTab("redistribution")}
              className="text-emerald-400 hover:text-emerald-300 flex items-center cursor-pointer"
            >
              See Redistribution Solutions →
            </button>
          </div>
        </div>

        {/* AI Outbreak Watch card */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col justify-between" id="outbreak-watchlist">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <HeartPulse className="h-5 w-5 text-emerald-400 animate-pulse" />
                <h3 className="font-bold text-white tracking-tight">{t.outbreakPrediction}</h3>
              </div>
              <span className="text-xs text-emerald-300 bg-emerald-500/10 font-bold px-2 py-0.5 rounded-md border border-emerald-500/20">
                Predictive AI Watch
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Early outbreak warnings are computed by comparing district weather changes, seasonal indicators, and sudden spikes in clinical OPD records over the last 72 hours.
            </p>

            <div className="space-y-4" id="outbreak-cards-list">
              {outbreakPredicts.map(pred => (
                <div key={pred.id} className="p-3.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-xs text-white">{pred.disease}</h4>
                      <p className="text-[10px] text-emerald-300 font-bold mt-0.5">Target: {pred.targetCentreName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm block ${
                        pred.riskLevel === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {pred.riskLevel} Risk
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1">Confidence: {pred.confidenceScore}%</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-2 font-medium">
                    <span className="font-bold text-slate-300">Triggers: </span>{pred.triggerFactors.join(", ")}
                  </p>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg text-[10px] text-emerald-300 leading-relaxed font-semibold">
                    <span className="font-bold block text-emerald-400 mb-0.5">AI Intervention Recommendation:</span>
                    {pred.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">Seasonal Epizootic Watch</span>
            <span className="text-slate-400 font-semibold">Updated 10 mins ago</span>
          </div>
        </div>

      </div>

    </div>
  );
}
