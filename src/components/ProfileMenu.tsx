import React, { useState } from "react";
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  Languages, 
  Bell, 
  Activity, 
  Briefcase, 
  HeartPulse, 
  MapPin, 
  Check,
  AlertCircle
} from "lucide-react";
import { UserRole, FirestoreUser, Language } from "../types";

interface ProfileMenuProps {
  userProfile: FirestoreUser;
  currentActiveRole: UserRole;
  onSwitchRole: (newRole: UserRole) => void;
  onLogout: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function ProfileMenu({
  userProfile,
  currentActiveRole,
  onSwitchRole,
  onLogout,
  language,
  setLanguage
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Settings preferences state
  const [emailNotif, setEmailNotif] = useState(userProfile.notificationPreferences?.email ?? true);
  const [smsNotif, setSmsNotif] = useState(userProfile.notificationPreferences?.sms ?? true);
  const [pushNotif, setPushNotif] = useState(userProfile.notificationPreferences?.push ?? true);

  // Available roles for user
  const assignedRoles = userProfile.roles || [userProfile.role];

  return (
    <div className="relative inline-block text-left" id="profile-menu-container">
      
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-3.5 py-1.5 transition-all text-left outline-none cursor-pointer"
        id="profile-avatar-btn"
      >
        <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center font-extrabold text-base text-emerald-400 select-none">
          {userProfile.photoURL || "👨‍⚕️"}
        </div>
        <div className="hidden sm:block">
          <span className="text-xs font-bold text-white block max-w-[120px] truncate leading-none">
            {userProfile.name}
          </span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
            {currentActiveRole === "DistrictAdmin" && "Admin"}
            {currentActiveRole === "PHCAdmin" && "PHC"}
            {currentActiveRole === "Doctor" && "Doctor"}
            {currentActiveRole === "LabTech" && "Lab"}
          </span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop overlay for clicking out */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div 
            className="absolute right-0 mt-2.5 w-72 origin-top-right rounded-2xl border border-white/15 bg-[#0d1424]/95 backdrop-blur-xl shadow-2xl z-50 divide-y divide-white/5 animate-fade-in"
            id="profile-dropdown-menu"
          >
            {/* Header info */}
            <div className="p-4 flex items-center space-x-3 text-left">
              <div className="text-3xl p-2 bg-[#0b1220] rounded-xl border border-white/10">
                {userProfile.photoURL || "👨‍⚕️"}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-xs text-white truncate">{userProfile.name}</h4>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{userProfile.email}</p>
                <div className="inline-flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold text-emerald-400 uppercase tracking-wide mt-1.5">
                  <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />
                  <span>Authorized</span>
                </div>
              </div>
            </div>

            {/* Core list */}
            <div className="py-2 text-left">
              
              {/* Switch Role option */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowSwitchModal(true);
                }}
                className="w-full px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 flex items-center space-x-3 transition-colors text-left cursor-pointer"
              >
                <Briefcase className="h-4 w-4 text-emerald-400 shrink-0" />
                <div className="flex-1">
                  <span className="block font-bold">Switch Operational Role</span>
                  <span className="text-[9px] text-slate-400 font-medium lowercase">Switch active credentials</span>
                </div>
              </button>

              {/* Settings option */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowSettingsModal(true);
                }}
                className="w-full px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 flex items-center space-x-3 transition-colors text-left cursor-pointer"
              >
                <Settings className="h-4 w-4 text-emerald-400 shrink-0" />
                <div className="flex-1">
                  <span className="block font-bold">Roster Settings</span>
                  <span className="text-[9px] text-slate-400 font-medium lowercase">Language & alerts preferences</span>
                </div>
              </button>

            </div>

            {/* Actions list */}
            <div className="py-2 text-left">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full px-4 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 flex items-center space-x-3 transition-colors text-left cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-rose-400 shrink-0" />
                <span>Exit Administration Portal</span>
              </button>
            </div>

          </div>
        </>
      )}

      {/* 1. SWITCH ROLE MODAL */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" id="switch-role-modal">
          <div className="bg-[#0c1322] border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl text-left space-y-6">
            
            <div className="flex items-center space-x-3 pb-3 border-b border-white/5">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Switch Operational Role</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Enterprise RBAC validation</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              You are assigned multiple authorized roles in the district database roster. Select the active scope you would like to run:
            </p>

            <div className="space-y-2.5">
              {(["DistrictAdmin", "PHCAdmin", "Doctor", "LabTech"] as UserRole[]).map(r => {
                const isAssigned = assignedRoles.includes(r);
                const isActive = currentActiveRole === r;

                return (
                  <button
                    key={r}
                    disabled={!isAssigned}
                    onClick={() => {
                      onSwitchRole(r);
                      setShowSwitchModal(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isActive 
                        ? "bg-emerald-600/15 border-emerald-500/60 text-white cursor-default" 
                        : isAssigned 
                          ? "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 cursor-pointer" 
                          : "bg-slate-950/40 border-white/5 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-1.5 rounded-lg text-xs ${isActive ? "bg-emerald-600 text-white" : "bg-[#0b1220] text-slate-400"}`}>
                        {r === "DistrictAdmin" && "AD"}
                        {r === "PHCAdmin" && "PH"}
                        {r === "Doctor" && "DR"}
                        {r === "LabTech" && "LB"}
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{r}</span>
                        <span className="text-[9px] text-slate-400 lowercase font-semibold block">
                          {r === "DistrictAdmin" && "Full administrative telemetry and smart approvals"}
                          {r === "PHCAdmin" && "Facility-specific logistics and duty registries"}
                          {r === "Doctor" && "Critical beds vacancy allocation controls"}
                          {r === "LabTech" && "Equipment availability testing configurations"}
                        </span>
                      </div>
                    </div>
                    {isActive ? (
                      <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    ) : !isAssigned ? (
                      <span className="text-[8px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded font-extrabold uppercase">Locked</span>
                    ) : (
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-extrabold uppercase">Switch</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-[9px] text-slate-500 font-bold uppercase flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
                Unauthorized role changes are blocked.
              </span>
              <button
                onClick={() => setShowSwitchModal(false)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold uppercase px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Close Dialog
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. ROSTER SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" id="roster-settings-modal">
          <div className="bg-[#0c1322] border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl text-left space-y-6">
            
            <div className="flex items-center space-x-3 pb-3 border-b border-white/5">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Roster Profile Settings</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Configure system parameters</p>
              </div>
            </div>

            {/* Language Preference */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <Languages className="h-4 w-4 text-emerald-400" /> Preferred Interface Language
              </label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { code: "en", name: "English" },
                  { code: "hi", name: "हिन्दी (Hindi)" },
                  { code: "ta", name: "தமிழ் (Tamil)" },
                  { code: "te", name: "తెలుగు (Telugu)" },
                  { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
                  { code: "ml", name: "മലയാളം (Malayalam)" },
                  { code: "mr", name: "मराठी (Marathi)" },
                  { code: "gu", name: "ગુજરાતી (Gujarati)" },
                  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
                  { code: "bn", name: "বাংলা (Bengali)" }
                ]).map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as Language)}
                    className={`p-2.5 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      language === lang.code 
                        ? "bg-emerald-600/15 border-emerald-500/50 text-white" 
                        : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification preferences */}
            <div className="space-y-3 border-t border-white/5 pt-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <Bell className="h-4 w-4 text-emerald-400" /> Dispatch Alerts Channels
              </label>
              
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 select-none text-xs font-bold">
                  <span className="text-slate-300">Roster Email Dispatches</span>
                  <input
                    type="checkbox"
                    checked={emailNotif}
                    onChange={() => setEmailNotif(!emailNotif)}
                    className="rounded border-white/10 bg-white/5 text-emerald-600 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 select-none text-xs font-bold">
                  <span className="text-slate-300">Biometric SMS Notifications</span>
                  <input
                    type="checkbox"
                    checked={smsNotif}
                    onChange={() => setSmsNotif(!smsNotif)}
                    className="rounded border-white/10 bg-white/5 text-emerald-600 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 select-none text-xs font-bold">
                  <span className="text-slate-300">Live Browser Push Telemetry</span>
                  <input
                    type="checkbox"
                    checked={pushNotif}
                    onChange={() => setPushNotif(!pushNotif)}
                    className="rounded border-white/10 bg-white/5 text-emerald-600 focus:ring-0"
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/5">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
