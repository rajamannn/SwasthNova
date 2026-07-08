import React, { useState } from "react";
import { 
  Bot, 
  HeartPulse, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  MapPin, 
  Layers, 
  Award, 
  Activity, 
  Phone, 
  Mail, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  Globe,
  PlusCircle,
  HelpCircle,
  Clock,
  Briefcase,
  ExternalLink
} from "lucide-react";
import { motion } from "motion/react";
import { Language } from "../types";
import { translations } from "../data/translations";
import { SwasthNovaLogo } from "./SwasthNovaLogo";

interface LandingPageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenLogin: () => void;
  isLargeText: boolean;
}

export default function LandingPage({
  language,
  setLanguage,
  onOpenLogin,
  isLargeText
}: LandingPageProps) {
  const t = translations[language];
  const [activeSolutionsTab, setActiveSolutionsTab] = useState<"district" | "phc" | "clinical">("district");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-slate-100 font-sans flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300" id="landing-root">
      
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" id="landing-gradients">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-emerald-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-sky-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] left-[30%] w-[50vw] h-[50vw] bg-teal-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header / Nav Bar */}
      <header className="sticky top-0 z-50 bg-[#060a13]/80 backdrop-blur-md border-b border-white/5 px-6 md:px-12 py-4 flex items-center justify-between" id="landing-header">
        <div className="flex items-center space-x-3">
          <div className="p-1 bg-white rounded-xl shadow-md shrink-0">
            <SwasthNovaLogo size={36} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-none flex items-center gap-1.5">
              SwasthNova <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">AI</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">National Health Mission</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-slate-300 uppercase tracking-wider" id="landing-nav">
          <a href="#home" className="hover:text-emerald-400 transition-colors">Home</a>
          <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
          <a href="#solutions" className="hover:text-emerald-400 transition-colors">Solutions</a>
          <a href="#mission" className="hover:text-emerald-400 transition-colors">NHM Mission</a>
          <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
        </nav>

        {/* Controls */}
        <div className="flex items-center space-x-3" id="landing-controls">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5" id="language-switcher">
            <Globe className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-[11px] font-bold text-white outline-none cursor-pointer"
            >
              <option value="en" className="bg-[#0b1220] text-white">English</option>
              <option value="hi" className="bg-[#0b1220] text-white">हिन्दी (Hindi)</option>
              <option value="ta" className="bg-[#0b1220] text-white">தமிழ் (Tamil)</option>
              <option value="te" className="bg-[#0b1220] text-white">తెలుగు (Telugu)</option>
              <option value="kn" className="bg-[#0b1220] text-white">ಕನ್ನಡ (Kannada)</option>
              <option value="ml" className="bg-[#0b1220] text-white">മലയാളം (Malayalam)</option>
              <option value="mr" className="bg-[#0b1220] text-white">मराठी (Marathi)</option>
              <option value="gu" className="bg-[#0b1220] text-white">ગુજરાતી (Gujarati)</option>
              <option value="pa" className="bg-[#0b1220] text-white">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="bn" className="bg-[#0b1220] text-white">বাংলা (Bengali)</option>
            </select>
          </div>

          <button
            onClick={onOpenLogin}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95 cursor-pointer"
            id="landing-login-btn"
          >
            Access Portal
          </button>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="flex-1 space-y-24 pb-16 z-10" id="landing-main">
        
        {/* Section 1: Hero Section */}
        <section id="home" className="relative px-6 md:px-12 pt-16 md:pt-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400">
              <Sparkles className="h-4 w-4" />
              <span>Next-Gen Enterprise Health Telemetry Platform</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
              Empowering Smarter <span className="text-emerald-400">Public Healthcare</span> through AI
            </h2>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl font-medium">
              SwasthNova is the central public healthcare operations command platform for India. Fully integrated with ABDM (Ayushman Bharat Digital Mission), it leverages advanced Gemini intelligence to optimize emergency beds, balance critical vaccine stocks, predict regional epidemics, and facilitate instantaneous specialist redistributions.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenLogin}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-extrabold uppercase px-8 py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-xl shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                id="hero-cta-btn"
              >
                <span>Enter Administration Suite</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
              
              <a
                href="#features"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-sm font-bold uppercase px-8 py-4 rounded-2xl flex items-center justify-center transition-all cursor-pointer"
              >
                Explore Operations Model
              </a>
            </div>

            {/* Quick trust stamps */}
            <div className="flex flex-wrap items-center gap-6 pt-6 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>ABDM Aligned</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-emerald-400" />
                <span>National Health Mission</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span>99.9% Operational Uptime</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Floating Interactive Dashboard Graphics */}
          <div className="lg:col-span-5 relative" id="hero-graphic-panel">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-2xl opacity-40 animate-pulse" />
            <div className="relative bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
              
              {/* Telemetry Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-300">Live Operation Registry</span>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold px-2 py-0.5 rounded">Alibag District</span>
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Critical Beds Available</span>
                  <span className="text-xl font-extrabold text-white block mt-1">42 / 120</span>
                  <div className="w-full bg-white/10 h-1 rounded-full mt-2">
                    <div className="bg-rose-500 h-1 rounded-full w-2/3" />
                  </div>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Vaccines Stock Level</span>
                  <span className="text-xl font-extrabold text-emerald-400 block mt-1">94% Optimal</span>
                  <div className="w-full bg-white/10 h-1 rounded-full mt-2">
                    <div className="bg-emerald-400 h-1 rounded-full w-[94%]" />
                  </div>
                </div>
              </div>

              {/* Mini activity row */}
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-300">
                  <span>Smart Redistribute Proposal</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal font-medium">
                  Transfer 500 Paracetamol units from District Hospital Alibag to CHC Roha. Saves ₹14,200 travel compensations.
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase pt-1">
                <span>Govt Server Node: Connected</span>
                <span>UTC Time: 08:45</span>
              </div>

            </div>
          </div>
        </section>

        {/* Section 2: Stats Cards Grid */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto" id="landing-stats">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center space-x-4">
              <div className="p-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Centres Integrated</span>
                <span className="text-2xl font-black text-white block">15 PHC / CHC</span>
              </div>
            </div>
            
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center space-x-4">
              <div className="p-3.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Stock Availability Rate</span>
                <span className="text-2xl font-black text-white block">98.2% Optimal</span>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center space-x-4">
              <div className="p-3.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-xl">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Daily Patient Registries</span>
                <span className="text-2xl font-black text-white block">1,420 Patients</span>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center space-x-4">
              <div className="p-3.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">AI Audited Shipments</span>
                <span className="text-2xl font-black text-white block">348 Decided</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Platform Introduction & Features */}
        <section id="features" className="px-6 md:px-12 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Operational Core</span>
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">AI-Powered Features for Smarter Operations</h3>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto font-medium">
              We replace obsolete spreadsheets and disconnected phone logs with centralized, sub-second operations analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-emerald-500/30 transition-all group">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl w-max mb-5">
                <Bot className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Gemini Operations Assistant</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Our conversational copilot parses live district datasets instantly to identify underperforming facilities, audit vaccine critical counts, and predict active outbreak vulnerabilities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-emerald-500/30 transition-all group">
              <div className="p-3 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-2xl w-max mb-5">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Resource Redistribution Engine</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Utilizes mathematical optimizations to propose smart stock redistribution transfers. Automatically matches source excess with target deficit to minimize emergency purchasing overheads.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-emerald-500/30 transition-all group">
              <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl w-max mb-5">
                <Layers className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Clinical Bed Allocation Audit</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Real-time mapping of ICU, Emergency, Maternity, and Isolation beds across facilities. Prevents bottlenecks during seasonal surges, securing instant bed routing coordinates.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-emerald-500/30 transition-all group">
              <div className="p-3 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-2xl w-max mb-5">
                <Globe className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Multilingual Localizations</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Comprehensive support for English, Hindi, Tamil, Telugu, Kannada, Malayalam, Gujarati, Marathi, Punjabi, and Bengali. Facilitates instant switching for ground officers.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-emerald-500/30 transition-all group">
              <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl w-max mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Biometric Duty attendance</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Real-time duty registration logs for clinical specialists. Facilitates emergency specialist rotational scheduling rules based on high-caseload primary clinical surges.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-emerald-500/30 transition-all group">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl w-max mb-5">
                <Activity className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Epidemic outbreak forecasting</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Analyzes climate parameters, vector densities, and OPD fever surge rates to notify authorities about active dengue and malaria hotspot warnings ahead of time.
              </p>
            </div>

          </div>
        </section>

        {/* Section 4: AI Capabilities & Solutions */}
        <section id="solutions" className="px-6 md:px-12 max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Solutions Matrix</span>
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">Tailored for Every Public Healthcare stakeholder</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                SwasthNova adapts dynamically to the authorized logins. No more cluttered, confusing universal dashboards. Get precisely the tools you need to optimize operations.
              </p>

              {/* Tabs list */}
              <div className="flex flex-col space-y-3" id="solutions-tabs">
                <button
                  onClick={() => setActiveSolutionsTab("district")}
                  className={`p-4 rounded-xl border text-left transition-all text-xs font-bold uppercase flex items-center space-x-3 cursor-pointer ${
                    activeSolutionsTab === "district"
                      ? "bg-emerald-600/15 border-emerald-500/40 text-white"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <Briefcase className="h-4.5 w-4.5 text-emerald-400" />
                  <div>
                    <span>District Administration Suite</span>
                    <span className="text-[10px] block font-medium text-slate-400 lowercase mt-0.5">High-level telemetry, policy-making summaries and authorization</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveSolutionsTab("phc")}
                  className={`p-4 rounded-xl border text-left transition-all text-xs font-bold uppercase flex items-center space-x-3 cursor-pointer ${
                    activeSolutionsTab === "phc"
                      ? "bg-emerald-600/15 border-emerald-500/40 text-white"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <MapPin className="h-4.5 w-4.5 text-emerald-400" />
                  <div>
                    <span>PHC & Facility Administration</span>
                    <span className="text-[10px] block font-medium text-slate-400 lowercase mt-0.5">Biometric registrations, stock ledger logging and facility tracking</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveSolutionsTab("clinical")}
                  className={`p-4 rounded-xl border text-left transition-all text-xs font-bold uppercase flex items-center space-x-3 cursor-pointer ${
                    activeSolutionsTab === "clinical"
                      ? "bg-emerald-600/15 border-emerald-500/40 text-white"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <HeartPulse className="h-4.5 w-4.5 text-emerald-400" />
                  <div>
                    <span>Doctors & Clinical Specialists</span>
                    <span className="text-[10px] block font-medium text-slate-400 lowercase mt-0.5">Critical beds allocation audits and diagnostics queues control</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[360px] flex flex-col justify-between">
              <div className="absolute top-4 right-4 text-[10px] bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                Active View Simulation
              </div>

              {activeSolutionsTab === "district" && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-emerald-400" /> District Admin Module
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    As a District Health Director, you maintain full structural authority. Read consolidated health scores across 15 clinics, analyze regional outbreak indices, and approve high-impact drug redistributions in seconds.
                  </p>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Consolidated Policy Audits</span>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">Average Hospital Score:</span>
                      <span className="text-emerald-400 font-black">92.4% Optimal</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSolutionsTab === "phc" && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-400" /> PHC Administrator Dashboard
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Ground-level facility management is secure and simple. Log daily biometric staff attendance registers, verify vaccine cold-chain status, and trigger emergency stock-replenishment requests directly.
                  </p>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Active Facility Status</span>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">Duty Registrations Logged:</span>
                      <span className="text-emerald-400 font-black">12 Professionals Present</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSolutionsTab === "clinical" && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-emerald-400" /> Doctor & Clinical Duty Desk
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Clinical specialists can bypass heavy administrative spreadsheets. Direct control over critical ICU and emergency beds counts, and instantaneous reporting of high-fever patient queues.
                  </p>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Beds Occupancy Audit</span>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">Available ICU Beds:</span>
                      <span className="text-rose-400 font-black">4 Critical Beds Left</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-white/5 pt-6 flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                <span>Secure RBAC Authentication Active</span>
                <button onClick={onOpenLogin} className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer">
                  <span>Enter Portal</span> <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* Section 5: Government Healthcare Mission (Grounding/Realism) */}
        <section id="mission" className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-600/15 to-blue-600/15 border border-white/10 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-emerald-500/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-sky-500/10 rounded-full blur-[80px]" />
            
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-slate-300">
              <Award className="h-4.5 w-4.5 text-emerald-400" />
              <span>National Digital Health Ecosystem Integration</span>
            </div>

            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
              Empowering India's Digital Healthcare Mission
            </h3>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto font-medium">
              SwasthNova operates in direct alignment with the National Health Authority (NHA) and National Health Mission (NHM). By facilitating seamless telemetry exchanges, biometric registries, and drug inventory transparency, we build the technological foundation for smart, secure, and resilient rural and district healthcare delivery models.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>● ABHA INTEGRATED</span>
              <span>● NATIONAL HEALTH STACK READY</span>
              <span>● GOVT SECURITY STANDARD CERTIFIED</span>
            </div>
          </div>
        </section>

        {/* Section 6: Why Choose SwasthNova */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto text-center space-y-12" id="landing-why-choose">
          <div className="space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">System Strengths</span>
            <h3 className="text-3xl font-black text-white tracking-tight">The SwasthNova Operational Advantage</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
              <span className="text-xl font-black text-emerald-400 block">01</span>
              <h4 className="font-bold text-white text-base">Real-time Visibility</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Eliminate telemetry reporting lags. Centralized tracking ensures that district directors and ground staff observe exact stock quantities, bed vacancies, and laboratory wait times instantaneously.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
              <span className="text-xl font-black text-emerald-400 block">02</span>
              <h4 className="font-bold text-white text-base">Mathematical Auditing</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Our smart algorithms do not just count items; they predict run-out timelines based on daily average clinical consumption and trigger secure, localized stock transfer recommendations.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
              <span className="text-xl font-black text-emerald-400 block">03</span>
              <h4 className="font-bold text-white text-base">Ground-Up Resilience</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Built specifically to survive and operate in low-bandwidth rural clinical environments. Fully localized languages, responsive layouts, and simple biometric registrations empower clinical staff on duty.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Testimonials */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto space-y-12" id="landing-testimonials">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Field Endorsements</span>
            <h3 className="text-3xl font-black text-white tracking-tight">Trusted by Medical Directors & Operatives</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4 text-left">
              <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
                "Before SwasthNova, balancing vaccine and drug stockouts across the district required hundreds of manual WhatsApp lists and phone audits. Now, our operations command has comprehensive telemetry. The smart stock redistribution recommended an optimized Paracetamol transfer that saved our facility from severe emergency hire expenses."
              </p>
              <div className="flex items-center space-x-3 border-t border-white/5 pt-4">
                <div className="h-10 w-10 rounded-full bg-[#0b1220] border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-400 uppercase shrink-0">
                  AP
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Dr. Anand Patil</h4>
                  <span className="text-[10px] text-slate-400 block font-medium uppercase">District Medical Officer, Alibag</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4 text-left">
              <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
                "The biometric check-in registry and the ICU Bed Occupancy telemetry inside SwasthNova have changed the operations at our PHC. I can update our clinical available bed count on my phone in seconds. Authorized transfers are immediate and transparent."
              </p>
              <div className="flex items-center space-x-3 border-t border-white/5 pt-4">
                <div className="h-10 w-10 rounded-full bg-[#0b1220] border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-400 uppercase shrink-0">
                  KM
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Nurse Kavita Mhatre</h4>
                  <span className="text-[10px] text-slate-400 block font-medium uppercase">OPD Head Nurse, Roha PHC</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Contact Section */}
        <section id="contact" className="px-6 md:px-12 max-w-3xl mx-auto space-y-8 text-center">
          <div className="space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Inquiries</span>
            <h3 className="text-3xl font-black text-white tracking-tight">Get in Touch with Administration</h3>
            <p className="text-xs text-slate-400 font-medium">For integration requests, security audits, and deployment instructions, send us a secure brief.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-4 text-left shadow-xl">
            {contactSuccess ? (
              <div className="p-6 text-center bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-300 font-bold text-xs animate-fade-in">
                ✓ Message sent successfully! Our administrative team will respond within 24 hours.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Kumar"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Your Official Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rkumar@nha.gov.in"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Secure Message / Request</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter your integration inquiry or district deployment request..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  Send Inquiry Message
                </button>
              </>
            )}
          </form>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-12 px-6 md:px-12 text-center text-xs text-slate-500 space-y-6 z-10" id="landing-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="p-0.5 bg-white rounded-lg shadow-sm">
              <SwasthNovaLogo size={24} />
            </div>
            <span className="font-extrabold text-white text-sm">SwasthNova AI Dashboard</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold uppercase tracking-wider text-[10px]">
            <a href="#home" className="hover:text-emerald-400">Privacy Policy</a>
            <a href="#features" className="hover:text-emerald-400">Terms of Service</a>
            <a href="#solutions" className="hover:text-emerald-400">Government SLA</a>
            <a href="#mission" className="hover:text-emerald-400">ABDM Specifications</a>
          </div>
        </div>

        <div className="max-w-4xl mx-auto border-t border-white/5 pt-6 text-[10px] text-slate-500 leading-relaxed space-y-2">
          <p>© 2026 National Health Authority / Ministry of Health and Family Welfare, Government of India. Developed for regional public healthcare intelligence.</p>
          <p className="font-bold text-slate-400">Important Government Notice: This system contains secure clinical operations metrics and telemetry data. Unauthorized access is strictly prohibited and governed by the National Digital Health Act.</p>
        </div>
      </footer>

    </div>
  );
}
