import React, { useState } from "react";
import { 
  Building2, 
  Users, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Globe, 
  Bell, 
  Type, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { Language, UserRole, AlertNotification, FirestoreUser } from "../types";
import { translations } from "../data/translations";
import ProfileMenu from "./ProfileMenu";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLargeText: boolean;
  setIsLargeText: (large: boolean) => void;
  speechEnabled: boolean;
  setSpeechEnabled: (enabled: boolean) => void;
  alerts: AlertNotification[];
  onMarkAllAsRead: () => void;
  onSelectAlert: (centreId: string) => void;
  userProfile?: FirestoreUser | null;
  onLogout?: () => void;
}

const languagesList: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" }
];

const rolesList: { code: UserRole; labelKey: string }[] = [
  { code: "DistrictAdmin", labelKey: "districtAdmin" },
  { code: "PHCAdmin", labelKey: "phcAdmin" },
  { code: "Doctor", labelKey: "doctor" },
  { code: "LabTech", labelKey: "labTech" }
];

export default function Header({
  language,
  setLanguage,
  role,
  setRole,
  isLargeText,
  setIsLargeText,
  speechEnabled,
  setSpeechEnabled,
  alerts,
  onMarkAllAsRead,
  onSelectAlert,
  userProfile,
  onLogout
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const t = translations[language];

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/40 backdrop-blur-md shadow-lg" id="app-header">
      <div className="flex h-16 items-center justify-between px-6">
        
        {/* Brand Logo & Slogan */}
        <div className="flex items-center space-x-3" id="brand-logo">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 shadow-lg shadow-emerald-600/20 transition-transform duration-300 hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className={`font-bold tracking-tight text-white transition-all ${isLargeText ? 'text-2xl' : 'text-lg'}`}>
              {t.title}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Action Controls & Interactive Parameters */}
        <div className="flex items-center space-x-4" id="header-controls">
          
          {/* Active Profile Menu with role switcher or active selector fallback */}
          {userProfile ? (
            <ProfileMenu
              userProfile={userProfile}
              currentActiveRole={role}
              onSwitchRole={setRole}
              onLogout={onLogout || (() => {})}
              language={language}
              setLanguage={setLanguage}
            />
          ) : (
            <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg p-1" id="role-selector">
              <span className="text-[10px] font-bold text-slate-400 uppercase px-2 hidden sm:inline-block">{t.activeRole}:</span>
              {rolesList.map(r => (
                <button
                  key={r.code}
                  onClick={() => setRole(r.code)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    role === r.code 
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  id={`role-${r.code}`}
                  title={t[r.labelKey]}
                >
                  {r.code === "DistrictAdmin" && "Admin"}
                  {r.code === "PHCAdmin" && "PHC"}
                  {r.code === "Doctor" && "Doctor"}
                  {r.code === "LabTech" && "Lab"}
                </button>
              ))}
            </div>
          )}

          {/* Language Switcher */}
          <div className="relative group flex items-center" id="language-dropdown-container">
            <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 hover:bg-white/10 transition-colors cursor-pointer">
              <Globe className="h-4 w-4 text-slate-400" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="text-xs font-semibold text-slate-200 bg-transparent outline-hidden cursor-pointer"
                id="language-select-dropdown"
              >
                {languagesList.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-[#0b1220] text-slate-100">
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Accessibility: Large Text Mode Toggle */}
          <button
            onClick={() => setIsLargeText(!isLargeText)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isLargeText 
                ? "bg-emerald-600/30 border-emerald-500 text-emerald-300" 
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
            }`}
            title={t.accessibilityMode}
            id="accessibility-text-mode-btn"
          >
            <Type className="h-4 w-4" />
          </button>

          {/* Accessibility: Text-to-Speech Toggle */}
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              speechEnabled 
                ? "bg-amber-600/30 border-amber-500 text-amber-300" 
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
            }`}
            title={t.voiceOutput}
            id="accessibility-audio-mode-btn"
          >
            {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Real-time Dynamic Notification Dropdown */}
          <div className="relative" id="notifications-container">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg border relative transition-colors cursor-pointer ${
                showNotifications 
                  ? "bg-emerald-600/30 border-emerald-500 text-emerald-300" 
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
              }`}
              id="notifications-bell-btn"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-96 rounded-xl border border-white/15 bg-[#0d1424]/95 backdrop-blur-xl shadow-2xl z-50 divide-y divide-white/10"
                id="notifications-dropdown-menu"
              >
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-t-xl">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="h-4 w-4 text-rose-400" />
                    <span className="font-bold text-sm text-white">{t.notifications}</span>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => {
                        onMarkAllAsRead();
                        setShowNotifications(false);
                      }}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                      id="mark-all-read-btn"
                    >
                      Mark All Read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-white/10" id="notification-items-list">
                  {alerts.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
                      <CheckCircle className="h-8 w-8 text-slate-500" />
                      <p className="font-medium text-slate-400">{t.allSystemsNominal}</p>
                    </div>
                  ) : (
                    alerts.map(alert => (
                      <div 
                      key={alert.id}
                      onClick={() => {
                        onSelectAlert(alert.centreId);
                        setShowNotifications(false);
                      }}
                      className={`p-3.5 hover:bg-white/5 transition-colors flex space-x-3 cursor-pointer ${
                        !alert.isRead ? "bg-emerald-500/10 font-medium" : ""
                      }`}
                      id={`notification-${alert.id}`}
                    >
                      <div className="mt-0.5">
                        {alert.severity === "critical" ? (
                          <AlertTriangle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
                        ) : alert.severity === "warning" ? (
                          <AlertTriangle className="h-4.5 w-4.5 text-amber-400 shrink-0" />
                        ) : (
                          <Info className="h-4.5 w-4.5 text-blue-400 shrink-0" />
                        )}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-xs text-slate-300 leading-relaxed">
                          <span className="font-bold text-white block mb-0.5">{alert.centreName}</span>
                          {alert.message}
                        </p>
                        <span className="text-[10px] text-slate-400 block pt-1">{alert.timestamp}</span>
                      </div>
                      {!alert.isRead && (
                        <div className="h-2 w-2 rounded-full bg-rose-500 self-center shrink-0" />
                      )}
                    </div>
                  ))
                  )}
                </div>

                <div className="p-3 text-center rounded-b-xl bg-white/5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    SwasthNova Telemetry Engine
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
