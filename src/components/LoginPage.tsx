import React, { useState } from "react";
import { 
  HeartPulse, 
  Bot, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Globe, 
  Sun, 
  Moon, 
  ShieldAlert, 
  TrendingUp, 
  Activity, 
  Layers, 
  ChevronRight,
  Eye,
  EyeOff,
  UserPlus
} from "lucide-react";
import { motion } from "motion/react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { Language, UserRole } from "../types";
import { translations } from "../data/translations";
import { SwasthNovaLogo } from "./SwasthNovaLogo";

interface LoginPageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onClose: () => void;
  isLargeText: boolean;
}

export default function LoginPage({
  language,
  setLanguage,
  onClose,
  isLargeText
}: LoginPageProps) {
  const t = translations[language];
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Custom Registration Fields
  const [signUpName, setSignUpName] = useState("");
  const [signUpRole, setSignUpRole] = useState<UserRole>("DistrictAdmin");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpHealthCentre, setSignUpHealthCentre] = useState("District General Hospital, Alibag");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Dark mode simulation or actual style support
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        // Save details to Firestore
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          name: signUpName || "Officer",
          email: email,
          role: signUpRole,
          roles: [signUpRole],
          district: "Alibag District",
          healthCentre: signUpHealthCentre,
          department: signUpRole === "DistrictAdmin" ? "General Administration" : signUpRole === "PHCAdmin" ? "PHC Administration" : signUpRole === "Doctor" ? "Clinical Services" : "Lab Services",
          permissions: signUpRole === "DistrictAdmin" 
            ? ["all_permissions", "approve_transfers", "edit_inventory", "edit_beds", "edit_staff"] 
            : ["limited_permissions"],
          language: language,
          status: "active",
          photoURL: signUpRole === "Doctor" ? "👨‍⚕️" : signUpRole === "LabTech" ? "🧑‍🔬" : "🏢",
          lastLogin: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
          phoneNumber: signUpPhone || "",
          notificationPreferences: {
            email: true,
            sms: true,
            push: true
          },
          isOnboarded: true
        });
        setMessage("Account created and roster details registered successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Authenticated successfully! Verifying role...");
      }
    } catch (err: any) {
      console.error("Authentication Error:", err);
      // Friendly messages
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password credentials. Please verify your department login details.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email address is already registered in the district roster.");
      } else if (err.code === "auth/weak-password") {
        setError("Security alert: Enterprise passwords must be at least 6 characters long.");
      } else {
        setError(err.message || "An unexpected security system error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your registered email address first to receive a security reset token.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Security reset token dispatched. Please verify your inbox & spam folders.");
    } catch (err: any) {
      console.error("Reset Error:", err);
      setError(err.message || "Failed to issue password recovery token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen grid grid-cols-1 lg:grid-cols-12 ${isDarkMode ? "bg-[#060a13] text-slate-100" : "bg-slate-50 text-slate-800"}`} id="login-container">
      
      {/* LEFT SIDE: Premium interactive clinical illustration */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#0c1322] to-[#04070d] border-r border-white/5 p-12 flex-col justify-between relative overflow-hidden" id="login-left">
        <div className="absolute top-[-20%] left-[-25%] w-[60vw] h-[60vw] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

        {/* Top brand */}
        <div className="flex items-center space-x-3 z-10">
          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-colors mr-1 cursor-pointer"
            title="Go back to Home"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="p-0.5 bg-white rounded-lg shadow-sm shrink-0">
            <SwasthNovaLogo size={28} />
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight block">SwasthNova</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none block">National Health Portal</span>
          </div>
        </div>

        {/* Middle graphics block */}
        <div className="space-y-8 z-10 my-auto">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white leading-tight">
              Empowering Smarter Public Healthcare through Artificial Intelligence
            </h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Secure Operations Command Suite
            </p>
          </div>

          {/* Core Telemetry Features List */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
              <Activity className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-xs">Real-time Telemetry Tracking</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Secure, low-latency live operations registry of regional hospitals & clinics.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
              <TrendingUp className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-xs">Smart AI Logistics Optimization</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Gemini models audit critical clinical shortages & recommend redistributions.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
              <Layers className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-xs">Biometric Specialist Scheduling</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Automated clinician rotas triggered by clinical outbreak surges.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
              <Globe className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-xs">Multilingual Operations Desk</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Immediate localization support in 10 prominent Indian regional languages.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Left Bottom */}
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider z-10 flex items-center justify-between">
          <span>Node Status: Secure</span>
          <span>SLA Level: Government Rota</span>
        </div>
      </div>

      {/* RIGHT SIDE: Premium Login Card & Auth Controls */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 md:p-12 relative" id="login-right">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between self-end space-x-4 w-full sm:w-auto" id="login-top-controls">
          <button
            onClick={onClose}
            className="lg:hidden p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-colors mr-auto cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center space-x-3">
            {/* Lang switcher */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5" id="login-lang-select">
              <Globe className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-[11px] font-bold outline-none cursor-pointer text-slate-300"
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

            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer"
              title="Toggle Interface Mode"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Center Card */}
        <div className="my-auto max-w-md w-full mx-auto space-y-6" id="login-card-section">
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight text-white">
              {isSignUp ? "Register Roster Account" : "Enterprise Secure Login"}
            </h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              {isSignUp 
                ? "Configure your regional clinical profile credentials to access operations command." 
                : "Enter your registered credentials. Access permissions are mapped directly."}
            </p>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 font-bold text-xs rounded-xl flex items-start space-x-2 animate-fade-in">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold text-xs rounded-xl animate-fade-in">
              ✓ {message}
            </div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4" id="login-form">
            
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Roster Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. adirector@nha.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {isSignUp && (
              <>
                <div className="flex flex-col space-y-1 animate-fade-in">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Patil"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="flex flex-col space-y-1 animate-fade-in">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    className="w-full text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="flex flex-col space-y-1 animate-fade-in">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Primary Roster Role</label>
                  <select
                    value={signUpRole}
                    onChange={(e) => setSignUpRole(e.target.value as UserRole)}
                    className="w-full text-xs font-semibold bg-[#0b1220] border border-white/10 text-white rounded-xl px-3 py-3 outline-none focus:border-emerald-500/50 cursor-pointer"
                  >
                    <option value="DistrictAdmin">District Administrator</option>
                    <option value="PHCAdmin">PHC / CHC Officer</option>
                    <option value="Doctor">Clinical Physician / Doctor</option>
                    <option value="LabTech">Laboratory Specialist</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1 animate-fade-in">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Health Centre</label>
                  <select
                    value={signUpHealthCentre}
                    onChange={(e) => setSignUpHealthCentre(e.target.value)}
                    className="w-full text-xs font-semibold bg-[#0b1220] border border-white/10 text-white rounded-xl px-3 py-3 outline-none focus:border-emerald-500/50 cursor-pointer"
                  >
                    <option value="District General Hospital, Alibag">District General Hospital, Alibag</option>
                    <option value="CHC Karjat">CHC Karjat</option>
                    <option value="PHC Poynad">PHC Poynad</option>
                    <option value="PHC Revdanda">PHC Revdanda</option>
                    <option value="PHC Mandwa">PHC Mandwa</option>
                  </select>
                </div>
              </>
            )}

            <div className="flex flex-col space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-10 py-3 outline-none focus:border-emerald-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between text-xs" id="remember-me-container">
              <label className="flex items-center space-x-2 text-slate-400 font-bold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="rounded border-white/10 bg-white/5 text-emerald-600 focus:ring-0 cursor-pointer"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 cursor-pointer flex items-center justify-center space-x-2"
              id="login-submit-btn"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? "Authorize Roster Profile" : "Secure Sign-In"}</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch view text */}
          <div className="text-center text-xs font-semibold text-slate-400">
            {isSignUp ? (
              <span>Already have an operational roster?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-emerald-400 font-extrabold hover:underline cursor-pointer"
                >
                  Enter Portal credentials
                </button>
              </span>
            ) : (
              <span>New to SwasthNova district telemetry?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-emerald-400 font-extrabold hover:underline cursor-pointer"
                >
                  Create Operations Account
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-500 space-y-2 mt-8 md:mt-0" id="login-footer">
          <div className="flex items-center justify-center space-x-4 font-bold uppercase tracking-wider">
            <a href="#privacy" className="hover:text-emerald-400">Security SLA</a>
            <span className="text-white/10">•</span>
            <a href="#terms" className="hover:text-emerald-400">System Code Audit</a>
            <span className="text-white/10">•</span>
            <a href="#notice" className="hover:text-emerald-400">NHA Notice</a>
          </div>
          <p className="max-w-md mx-auto leading-relaxed">
            Warning: This computer system is protected by national digital health protocols. Unauthorized login, operations sabotage, or credential theft will trigger telemetry audit alerts.
          </p>
        </div>

      </div>
    </div>
  );
}
