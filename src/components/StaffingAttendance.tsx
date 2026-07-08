import React, { useState } from "react";
import { 
  UserCheck, 
  Users, 
  Clock, 
  ShieldAlert, 
  Plus, 
  MapPin, 
  CheckCircle, 
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Sliders,
  Award,
  Zap,
  Info
} from "lucide-react";
import { HealthCentre, Language, UserRole } from "../types";
import { translations } from "../data/translations";
import { useI18n } from "./I18nProvider";

interface StaffingAttendanceProps {
  language: Language;
  role: UserRole;
  isLargeText: boolean;
  centres: HealthCentre[];
  selectedCentreId: string;
  onSelectCentreId: (id: string) => void;
  onUpdateStaff: (centreId: string, deltaDoctors: number, deltaNurses: number) => void;
}

interface StaffLog {
  id: string;
  name: string;
  role: string;
  shift: string;
  checkIn: string;
  status: "Present" | "Late" | "On Leave" | "Absent";
}

export default function StaffingAttendance({
  language,
  role,
  isLargeText,
  centres,
  selectedCentreId,
  onSelectCentreId,
  onUpdateStaff
}: StaffingAttendanceProps) {
  const t = translations[language];
  const { translateData } = useI18n();

  const activeCentre = centres.find(c => c.id === selectedCentreId) || centres[0];

  const [staffAction, setStaffAction] = useState<"checkin" | "checkout">("checkin");
  const [selectedStaffRole, setSelectedStaffRole] = useState<"Doctor" | "Nurse">("Doctor");
  const [staffLogName, setStaffLogName] = useState("");

  // Attendance registry log
  const [attendanceRegistry, setAttendanceRegistry] = useState<StaffLog[]>([
    { id: "STA-01", name: "Dr. Rajesh Patil", role: "Medical Officer", shift: "08:00 AM - 04:00 PM", checkIn: "08:02 AM", status: "Present" },
    { id: "STA-02", name: "Dr. Sunita Deshmukh", role: "Pediatrician", shift: "08:00 AM - 04:00 PM", checkIn: "08:42 AM", status: "Late" },
    { id: "STA-03", name: "Nurse Kavita Mhatre", role: "Staff Nurse G-II", shift: "08:00 AM - 04:00 PM", checkIn: "07:55 AM", status: "Present" },
    { id: "STA-04", name: "Nurse Priya Thakur", role: "OPD Head Nurse", shift: "08:00 AM - 04:00 PM", checkIn: "08:05 AM", status: "Present" },
    { id: "STA-05", name: "Dr. Amit Gaikwad", role: "General Surgeon", shift: "12:00 PM - 08:00 PM", checkIn: "--", status: "Absent" },
  ]);

  // Rotational Scheduling Recommendations
  const rotationalRecommendations = [
    {
      id: "REC-S1",
      item: "Doctor Rotational Shift",
      fromCentreName: "District General Hospital Alibag",
      toCentreName: "PHC Uran",
      reason: "PHC Uran OPD caseload exceeded critical levels (+120%) while General Hospital maintains 8 surgeons on standby.",
      savings: "₹18,000 in travel/overtime compensations",
      distance: "28 km"
    },
    {
      id: "REC-S2",
      item: "Nurse Rotational Shift",
      fromCentreName: "CHC Roha",
      toCentreName: "PHC Pen",
      reason: "PHC Pen has only 2 active nurses on duty. High fever vaccination surge is causing severe testing wait-times.",
      savings: "₹8,500 in district-funded emergency hires",
      distance: "42 km"
    }
  ];

  // Handle Sign Staff In/Out form
  const handleStaffToggle = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isCheckIn = staffAction === "checkin";
    const delta = isCheckIn ? 1 : -1;

    // Check boundary
    if (!isCheckIn) {
      if (selectedStaffRole === "Doctor" && activeCentre.availableDoctors <= 0) {
        alert("Error: No doctors available on duty to check out.");
        return;
      }
      if (selectedStaffRole === "Nurse" && activeCentre.nursesOnDuty <= 0) {
        alert("Error: No nurses available on duty to check out.");
        return;
      }
    }

    // Call state update
    onUpdateStaff(
      activeCentre.id, 
      selectedStaffRole === "Doctor" ? delta : 0, 
      selectedStaffRole === "Nurse" ? delta : 0
    );

    // Add to local registry if checkin
    if (isCheckIn && staffLogName) {
      const newLog: StaffLog = {
        id: `STA-${Math.floor(100 + Math.random() * 900)}`,
        name: staffLogName,
        role: selectedStaffRole === "Doctor" ? "Medical Officer" : "OPD Duty Nurse",
        shift: "08:00 AM - 04:00 PM",
        checkIn: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        status: "Present"
      };
      setAttendanceRegistry([newLog, ...attendanceRegistry]);
    }

    setStaffLogName("");
    alert(`Success: ${selectedStaffRole} ${isCheckIn ? 'checked in' : 'checked out'} successfully at ${activeCentre.name}.`);
  };

  return (
    <div className="space-y-6" id="staffing-tab">
      
      {/* Selector Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10" id="staffing-centre-header">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight">{t.staffingAttendance}</h3>
            <p className="text-xs text-slate-400 font-medium">Daily attendance registry log, emergency rotas, and AI medical staff allocation intelligence.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2" id="staffing-centre-selector">
          <span className="text-xs text-slate-400 font-bold uppercase mr-1">Select Centre:</span>
          <select
            value={selectedCentreId}
            onChange={(e) => onSelectCentreId(e.target.value)}
            className="text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 cursor-pointer outline-hidden focus:border-emerald-500/50"
            id="staffing-centre-dropdown"
          >
            {centres.map(c => (
              <option key={c.id} value={c.id} className="bg-[#0b1220] text-slate-100">{c.name} ({c.type})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Attendance Registry List & Sign In Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="attendance-and-rotas">
        
        {/* Left Attendance Log Table (Span 2) */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col justify-between" id="attendance-registry-panel">
          <div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
              <h4 className="font-bold text-white text-sm flex items-center">
                <Users className="mr-2 h-4.5 w-4.5 text-emerald-400" />
                Staff Attendance Registry: {activeCentre.name}
              </h4>
              <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-sm font-bold">
                Live Register
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Active medical professionals registered on duty today. There are currently <span className="font-bold text-white">{activeCentre.availableDoctors} doctors</span> and <span className="font-bold text-white">{activeCentre.nursesOnDuty} nurses</span> logged in at {activeCentre.name}.
            </p>

            <div className="overflow-x-auto" id="attendance-table-container">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider bg-white/5">
                    <th className="py-2.5 px-3">Professional ID</th>
                    <th className="py-2.5 px-3">Staff Name</th>
                    <th className="py-2.5 px-3">Designated Role</th>
                    <th className="py-2.5 px-3">Registered Shift</th>
                    <th className="py-2.5 px-3 text-right">Check-in Time</th>
                    <th className="py-2.5 px-3 text-center">Duty Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium text-slate-300" id="attendance-table-body">
                  {attendanceRegistry.map(log => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="py-3 px-3 font-mono text-slate-400 font-bold">
                        {log.id}
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        {log.name}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {translateData(log.role)}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {log.shift}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-300">
                        {log.checkIn}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          log.status === "Present" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" :
                          log.status === "Late" ? "bg-amber-500/15 text-amber-300 border-amber-500/20" :
                          "bg-rose-500/15 text-rose-300 border-rose-500/20"
                        }`}>
                          {log.status === "Late" ? t.lateArrival : log.status === "Present" ? (t.present || "On Duty") : translateData(log.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-white/10 pt-4 mt-4 font-bold uppercase">
            <span>District Central Staff Registry</span>
            <span className="text-emerald-400">Secure Biometric Integration Active</span>
          </div>
        </div>

        {/* Right staff check in/out form */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col justify-between" id="staff-attendance-form-panel">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm tracking-tight">{t.dutyLogger}</h3>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Medical Professionals or PHC Admins can log daily attendance shifts, check into active rotas, or check out when relieving duty.
            </p>

            {role === "Doctor" || role === "PHCAdmin" || role === "DistrictAdmin" ? (
              <form onSubmit={handleStaffToggle} className="space-y-4" id="staff-checkin-form">
                
                <div className="flex flex-col space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Select Action Type:</span>
                  <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setStaffAction("checkin")}
                      className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        staffAction === "checkin" 
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Check In
                    </button>
                    <button
                      type="button"
                      onClick={() => setStaffAction("checkout")}
                      className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        staffAction === "checkout" 
                          ? "bg-rose-600 text-white shadow-md shadow-rose-600/20" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Check Out
                    </button>
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Professional Category:</span>
                  <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setSelectedStaffRole("Doctor")}
                      className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        selectedStaffRole === "Doctor" 
                          ? "bg-[#0b1220] border border-white/15 text-white" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Doctor / Officer
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStaffRole("Nurse")}
                      className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        selectedStaffRole === "Nurse" 
                          ? "bg-[#0b1220] border border-white/15 text-white" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Staff Nurse
                    </button>
                  </div>
                </div>

                {staffAction === "checkin" && (
                  <div className="flex flex-col space-y-1.5 animate-fade-in">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Enter Full Staff Name:</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Anand Kumar"
                      value={staffLogName}
                      onChange={(e) => setStaffLogName(e.target.value)}
                      required
                      className="text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 outline-hidden focus:border-emerald-500/50"
                      id="staff-checkin-name-input"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    staffAction === "checkin" 
                      ? "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20" 
                      : "bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20"
                  }`}
                  id="staff-logger-submit-btn"
                >
                  <span>{staffAction === "checkin" ? "Log Duty Check-In" : "Log Duty Check-Out"}</span>
                </button>
              </form>
            ) : (
              <div className="p-8 text-center border border-dashed border-white/10 bg-white/5 text-slate-400 text-xs rounded-xl font-medium">
                🔒 Editing locked. Switch to **Medical Doctor** or **PHC Administrator** role in the header to check staff in/out.
              </div>
            )}
          </div>

          <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider border-t border-white/10 pt-4 mt-5">
            Registry Authentication Code Block
          </div>
        </div>

      </div>

      {/* Row 3: Rotational Scheduling Recommendations (Relocation) */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg space-y-4" id="staff-rotational-recommendations-section">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base tracking-tight">{t.rotationalScheduling}</h3>
          </div>
          <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 uppercase">
            AI Workforce Optimizer
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The rotational scheduling model compares clinic understaffing thresholds (doctors present vs active patient load) and automatically recommends transferring specialists from low-caseload hospitals to clinical hotspots.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="rotations-recommendations-grid">
          {rotationalRecommendations.map((rec, index) => (
            <div key={rec.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between hover:shadow-lg hover:bg-white/10 transition-all duration-200">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase">
                    Rotation Rule {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Distance: {rec.distance}</span>
                </div>
                
                <h4 className="font-bold text-white text-sm">{rec.item}</h4>
                
                <div className="flex items-center space-x-3 text-xs" id="rotation-centers-flow">
                  <span className="font-bold text-slate-300">{rec.fromCentreName}</span>
                  <ArrowRight className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-emerald-300">{rec.toCentreName}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  <span className="font-bold text-slate-300 block mb-0.5">Trigger Condition:</span>
                  {rec.reason}
                </p>
              </div>

              <div className="border-t border-white/10 pt-3.5 mt-4 flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-300 flex items-center">
                  <Award className="h-4 w-4 mr-1 text-emerald-400 shrink-0" /> {rec.savings}
                </span>
                
                {role === "DistrictAdmin" && (
                  <button
                    onClick={() => {
                      // Adjust staffing
                      // Subtract 1 doctor from "from" and add to "to"
                      const fromC = centres.find(c => c.name === rec.fromCentreName);
                      const toC = centres.find(c => c.name === rec.toCentreName);
                      if (fromC && toC) {
                        onUpdateStaff(fromC.id, -1, 0);
                        onUpdateStaff(toC.id, 1, 0);
                        alert(`Rotation Approved: Dr. transferred from '${rec.fromCentreName}' to '${rec.toCentreName}' successfully.`);
                      }
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    Authorize Shift
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
