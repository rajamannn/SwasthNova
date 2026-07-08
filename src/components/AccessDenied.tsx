import React from "react";
import { ShieldAlert, ArrowLeft, Home, UserCheck } from "lucide-react";
import { UserRole } from "../types";

interface AccessDeniedProps {
  requiredRole: string;
  currentRole: UserRole;
  onBackToAllowed: () => void;
  onSwitchProfile: () => void;
}

export default function AccessDenied({
  requiredRole,
  currentRole,
  onBackToAllowed,
  onSwitchProfile
}: AccessDeniedProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[70vh]" id="access-denied-root">
      <div className="bg-slate-900/80 border border-rose-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-fade-in relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-rose-500/10 rounded-full blur-2xl" />

        <div className="p-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl w-max mx-auto">
          <ShieldAlert className="h-10 w-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-white">403 Access Denied</h3>
          <p className="text-xs text-rose-300 font-bold uppercase tracking-wider">Security Access Limit Exceeded</p>
        </div>

        <div className="p-4 bg-[#0b1220]/50 border border-white/5 rounded-2xl text-left text-xs font-medium text-slate-300 leading-relaxed space-y-2">
          <p>
            Your current operational login role (<span className="text-amber-400 font-extrabold">{currentRole}</span>) is unauthorized to access the requested view or action.
          </p>
          <p>
            Security Level: <span className="text-rose-400 font-bold uppercase tracking-wider">{requiredRole} Access Only</span>.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={onBackToAllowed}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold uppercase py-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          <button
            onClick={onSwitchProfile}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <UserCheck className="h-4 w-4" />
            <span>Switch Role</span>
          </button>
        </div>

        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider pt-2 border-t border-white/5">
          Roster Telemetry Audit Registered
        </div>

      </div>
    </div>
  );
}
