import React from "react";
import { 
  BarChart3, 
  Map, 
  ArrowLeftRight, 
  Package, 
  BedDouble, 
  UserCheck, 
  Bot, 
  Sparkles
} from "lucide-react";
import { Language, UserRole } from "../types";
import { translations } from "../data/translations";

interface SidebarProps {
  language: Language;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  role: UserRole;
  isLargeText: boolean;
}

export default function Sidebar({
  language,
  activeTab,
  setActiveTab,
  role,
  isLargeText
}: SidebarProps) {
  const t = translations[language];

  // List of tabs
  const navigationItems = [
    { id: "overview", labelKey: "overview", icon: BarChart3 },
    { id: "map", labelKey: "mapDashboard", icon: Map },
    { id: "redistribution", labelKey: "smartRedistribution", icon: ArrowLeftRight },
    { id: "inventory", labelKey: "inventoryStock", icon: Package },
    { id: "clinical", labelKey: "clinicalBeds", icon: BedDouble },
    { id: "staffing", labelKey: "staffingAttendance", icon: UserCheck },
    { id: "ai", labelKey: "aiAssistant", icon: Bot },
  ];

  const getRoleBadgeColor = () => {
    switch (role) {
      case "DistrictAdmin": return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "PHCAdmin": return "bg-sky-500/10 text-sky-300 border-sky-500/30";
      case "Doctor": return "bg-indigo-500/10 text-indigo-300 border-indigo-500/30";
      case "LabTech": return "bg-amber-500/10 text-amber-300 border-amber-500/30";
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case "DistrictAdmin": return t.districtAdmin;
      case "PHCAdmin": return t.phcAdmin;
      case "Doctor": return t.doctor;
      case "LabTech": return t.labTech;
    }
  };

  return (
    <aside className="w-64 border-r border-white/10 bg-slate-950/20 backdrop-blur-xl flex flex-col justify-between" id="app-sidebar">
      <div className="flex-1 py-6 px-4 space-y-7 overflow-y-auto">
        
        {/* Active Role Indicator */}
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center space-y-1.5" id="sidebar-role-indicator">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.activeRole}</span>
          <span className={`text-xs px-2.5 py-1 font-bold rounded-full border text-center leading-tight transition-all ${getRoleBadgeColor()}`} id="sidebar-active-role-badge">
            {getRoleLabel()}
          </span>
        </div>

        {/* Tab Navigation links */}
        <nav className="space-y-1" id="sidebar-navigation">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  isActive 
                    ? "bg-emerald-600/80 text-white border border-emerald-500/40 shadow-lg shadow-emerald-500/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
                id={`tab-btn-${item.id}`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                <span className={`transition-all truncate ${isLargeText ? 'text-base' : 'text-sm'}`}>
                  {t[item.labelKey]}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Branding */}
      <div className="p-4 border-t border-white/10" id="sidebar-footer">
        <div className="flex items-center space-x-2 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
          <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">AI-Power Status</span>
            <span className="text-[10px] text-slate-400 truncate block font-medium">Gemini Telemetry Connected</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
