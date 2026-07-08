import React, { useState } from "react";
import { 
  HeartPulse, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Layers, 
  Activity, 
  User, 
  Phone, 
  Globe, 
  Bell,
  ArrowRight,
  Briefcase
} from "lucide-react";
import { motion } from "motion/react";
import { SwasthNovaLogo } from "./SwasthNovaLogo";
import { Language, UserRole, FirestoreUser } from "../types";

interface OnboardingProps {
  currentUserEmail: string;
  currentUserId: string;
  onComplete: (onboardData: Omit<FirestoreUser, "uid" | "email">) => void;
  language: Language;
}

export default function Onboarding({
  currentUserEmail,
  currentUserId,
  onComplete,
  language
}: OnboardingProps) {
  // Fields to collect
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [preferredRole, setPreferredRole] = useState<UserRole>("DistrictAdmin");
  
  // Multiple roles allocation option (optional)
  const [assignedRoles, setAssignedRoles] = useState<UserRole[]>(["DistrictAdmin"]);
  
  const [department, setDepartment] = useState("General Administration");
  const [district, setDistrict] = useState("Alibag District");
  const [healthCentre, setHealthCentre] = useState("District Hospital Alibag");
  const [preferredLang, setPreferredLang] = useState<Language>(language);
  const [avatar, setAvatar] = useState("👨‍⚕️");

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(true);
  const [notifPush, setNotifPush] = useState(true);

  const [loading, setLoading] = useState(false);

  const avatarsList = ["👨‍⚕️", "👩‍⚕️", "🧑‍🔬", "🛡️", "🏢", "🩺", "🧪"];

  const handleToggleRole = (roleOption: UserRole) => {
    if (assignedRoles.includes(roleOption)) {
      if (assignedRoles.length > 1) {
        setAssignedRoles(assignedRoles.filter(r => r !== roleOption));
      }
    } else {
      setAssignedRoles([...assignedRoles, roleOption]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const onboardData: Omit<FirestoreUser, "uid" | "email"> = {
      name: name || "Officer",
      role: preferredRole,
      roles: assignedRoles.length > 0 ? assignedRoles : [preferredRole],
      district,
      healthCentre,
      department,
      permissions: assignedRoles.includes("DistrictAdmin") 
        ? ["all_permissions", "approve_transfers", "edit_inventory", "edit_beds", "edit_staff"] 
        : ["limited_permissions"],
      language: preferredLang,
      status: "active",
      photoURL: avatar,
      lastLogin: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      phoneNumber,
      notificationPreferences: {
        email: notifEmail,
        sms: notifSms,
        push: notifPush
      },
      isOnboarded: true
    };

    setTimeout(() => {
      onComplete(onboardData);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-slate-100 p-6 md:p-12 flex items-center justify-center relative overflow-hidden" id="onboarding-root">
      
      {/* Background ambient light */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="bg-slate-900/85 border border-white/10 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative z-10 space-y-6" id="onboarding-card">
        
        {/* Onboarding Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center space-x-3 text-left">
            <div className="p-0.5 bg-white rounded-lg shadow-sm shrink-0">
              <SwasthNovaLogo size={32} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                SwasthNova <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/10 px-1.5 py-0.5 rounded">Roster Onboarding</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">National Health Mission</p>
            </div>
          </div>
          
          <div className="inline-flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Profile Configuration</span>
          </div>
        </div>

        <div className="text-left space-y-2">
          <h3 className="text-base font-black text-white">Configure Your Secure Health Account</h3>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Welcome to SwasthNova district command platform. Please finalize your clinical roster fields. Your access capabilities are computed dynamically.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-left" id="onboarding-form">
          
          {/* Row 1: Profile Name, Phone & Avatar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            
            {/* Avatar picker (Col span 4) */}
            <div className="md:col-span-4 flex flex-col space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Profile Icon</label>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center space-y-3">
                <div className="text-4xl p-3.5 bg-[#0b1220] rounded-2xl border border-emerald-500/30 w-16 h-16 flex items-center justify-center">
                  {avatar}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {avatarsList.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAvatar(a)}
                      className={`text-lg p-1 hover:scale-110 active:scale-95 transition-all rounded ${avatar === a ? "bg-emerald-500/20 border border-emerald-500/40" : "bg-transparent border border-transparent"}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Inputs (Col span 8) */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Your Official Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Official Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Roles Allocation (Multiple roles support!) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">Assign System Roles</label>
              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wide bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Multi-role Enabled</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal font-medium mb-3">
              Check the structural roles assigned to you. You can switch between assigned roles inside your active Profile dashboard at any point.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(["DistrictAdmin", "PHCAdmin", "Doctor", "LabTech"] as UserRole[]).map(r => {
                const isAssigned = assignedRoles.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleToggleRole(r)}
                    className={`p-3 rounded-xl border text-left transition-all text-xs font-bold uppercase cursor-pointer flex flex-col justify-between h-20 ${
                      isAssigned 
                        ? "bg-emerald-600/15 border-emerald-500/50 text-white" 
                        : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="text-[10px] block font-semibold">{r}</span>
                    <span className="text-[8px] tracking-normal font-medium lowercase text-slate-400 block mt-1">
                      {r === "DistrictAdmin" && "full controls"}
                      {r === "PHCAdmin" && "facility admin"}
                      {r === "Doctor" && "beds & specialists"}
                      {r === "LabTech" && "lab test telemetry"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Choose default active role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-2">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Default Active Role</label>
                <select
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value as UserRole)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-xs font-bold text-slate-200 cursor-pointer"
                >
                  {assignedRoles.map(r => (
                    <option key={r} value={r} className="bg-[#0b1220] text-white font-bold">{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Preferred Interface Language</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <select
                    value={preferredLang}
                    onChange={(e) => setPreferredLang(e.target.value as Language)}
                    className="w-full text-xs font-bold bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none cursor-pointer"
                  >
                    <option value="en" className="bg-[#0b1220] text-slate-200">English</option>
                    <option value="hi" className="bg-[#0b1220] text-slate-200">हिन्दी (Hindi)</option>
                    <option value="ta" className="bg-[#0b1220] text-slate-200">தமிழ் (Tamil)</option>
                    <option value="te" className="bg-[#0b1220] text-slate-200">తెలుగు (Telugu)</option>
                    <option value="kn" className="bg-[#0b1220] text-slate-200">ಕನ್ನಡ (Kannada)</option>
                    <option value="ml" className="bg-[#0b1220] text-slate-200">മലയാളം (Malayalam)</option>
                    <option value="mr" className="bg-[#0b1220] text-slate-200">मराठी (Marathi)</option>
                    <option value="gu" className="bg-[#0b1220] text-slate-200">ગુજરાતી (Gujarati)</option>
                    <option value="pa" className="bg-[#0b1220] text-slate-200">ਪੰਜਾਬੀ (Punjabi)</option>
                    <option value="bn" className="bg-[#0b1220] text-slate-200">বাংলা (Bengali)</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Row 3: Geographical Coordinates & Facility */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Clinical Department</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs font-bold bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none cursor-pointer"
                >
                  <option className="bg-[#0b1220]" value="General Administration">General Administration</option>
                  <option className="bg-[#0b1220]" value="Emergency">Emergency Room</option>
                  <option className="bg-[#0b1220]" value="General OPD">General OPD</option>
                  <option className="bg-[#0b1220]" value="Pediatrics">Pediatrics Department</option>
                  <option className="bg-[#0b1220]" value="Gynaecology">Gynaecology Department</option>
                  <option className="bg-[#0b1220]" value="Lab Services">Laboratory Services</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Assigned District</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs font-bold bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none cursor-pointer"
                >
                  <option className="bg-[#0b1220]" value="Alibag District">Alibag District</option>
                  <option className="bg-[#0b1220]" value="Raigad District">Raigad District</option>
                  <option className="bg-[#0b1220]" value="Mumbai South">Mumbai South District</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Facility Health Centre</label>
              <div className="relative">
                <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <select
                  value={healthCentre}
                  onChange={(e) => setHealthCentre(e.target.value)}
                  className="w-full text-xs font-bold bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none cursor-pointer"
                >
                  <option className="bg-[#0b1220]" value="District Hospital Alibag">District Hospital Alibag</option>
                  <option className="bg-[#0b1220]" value="CHC Roha">CHC Roha</option>
                  <option className="bg-[#0b1220]" value="PHC Karjat">PHC Karjat</option>
                  <option className="bg-[#0b1220]" value="PHC Pen">PHC Pen</option>
                  <option className="bg-[#0b1220]" value="PHC Poynad">PHC Poynad</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 4: Notification Preferences */}
          <div className="space-y-2 border-t border-white/5 pt-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-emerald-400" /> Secure Notification Subscriptions
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center space-x-2.5 p-3 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 select-none text-xs font-bold">
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={() => setNotifEmail(!notifEmail)}
                  className="rounded border-white/10 bg-white/5 text-emerald-600 focus:ring-0"
                />
                <span>Email Roster Alerts</span>
              </label>

              <label className="flex items-center space-x-2.5 p-3 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 select-none text-xs font-bold">
                <input
                  type="checkbox"
                  checked={notifSms}
                  onChange={() => setNotifSms(!notifSms)}
                  className="rounded border-white/10 bg-white/5 text-emerald-600 focus:ring-0"
                />
                <span>SMS Telemetry</span>
              </label>

              <label className="flex items-center space-x-2.5 p-3 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 select-none text-xs font-bold">
                <input
                  type="checkbox"
                  checked={notifPush}
                  onChange={() => setNotifPush(!notifPush)}
                  className="rounded border-white/10 bg-white/5 text-emerald-600 focus:ring-0"
                />
                <span>Browser Push</span>
              </label>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 cursor-pointer flex items-center justify-center space-x-2 border border-emerald-500/45 mt-4"
            id="onboarding-submit-btn"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Commit Roster Profiles</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

        </form>

        {/* Notice */}
        <div className="text-center text-[9px] text-slate-500 flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider border-t border-white/5 pt-4">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Encrypted with National Public Health Registry Safeguards</span>
        </div>

      </div>
    </div>
  );
}
