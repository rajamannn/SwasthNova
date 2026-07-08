import React, { useState } from "react";
import { 
  Package, 
  Search, 
  TrendingUp, 
  ShieldAlert, 
  Plus, 
  Edit3, 
  Clock, 
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from "recharts";
import { HealthCentre, Language, UserRole, InventoryItem } from "../types";
import { translations } from "../data/translations";
import { useI18n } from "./I18nProvider";

interface InventoryStockProps {
  language: Language;
  role: UserRole;
  isLargeText: boolean;
  centres: HealthCentre[];
  selectedCentreId: string;
  onSelectCentreId: (id: string) => void;
  onUpdateInventory: (centreId: string, itemName: string, newQty: number) => void;
}

export default function InventoryStock({
  language,
  role,
  isLargeText,
  centres,
  selectedCentreId,
  onSelectCentreId,
  onUpdateInventory
}: InventoryStockProps) {
  const t = translations[language];
  const { translateData } = useI18n();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [selectedItemName, setSelectedItemName] = useState<string>("Paracetamol 500mg");
  const [forecastDays, setForecastDays] = useState<7 | 30 | 90>(30);
  
  // PHC Admin Update Form State
  const [updateItemName, setUpdateItemName] = useState("");
  const [updateQty, setUpdateQty] = useState("");

  const activeCentre = centres.find(c => c.id === selectedCentreId) || centres[0];

  const categories = [
    "All", "Medicine", "Vaccine", "Emergency Drug", "IV Fluid", "PPE Kit", "Oxygen Cylinder", "Blood Unit"
  ];

  // Expiry Predictions calculations
  const expiringItems = activeCentre.inventory.filter(item => {
    const expDate = new Date(item.expiryDate);
    const limitDate = new Date("2026-10-30"); // Expiring within ~90 days in simulation
    return expDate < limitDate;
  });

  // Filtered Inventory items
  const filteredInventory = activeCentre.inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Recharts: Generate AI demand forecast mock data based on item consumption
  const generateForecastData = () => {
    const item = activeCentre.inventory.find(i => i.name === selectedItemName) || activeCentre.inventory[0];
    const data = [];
    const baseConsumption = item.avgDailyConsumption;
    
    let days = forecastDays;
    let factor = 1;

    // Apply simulation trends depending on seasonality/epidemics (e.g. Dengue, monsoon, etc.)
    if (item.name.includes("Paracetamol")) factor = 1.35; // high seasonal OPD fever caseload
    if (item.name.includes("BCG")) factor = 0.95;
    if (item.name.includes("COVID-19")) factor = 1.15;
    if (item.name.includes("Oxygen")) factor = 1.4; // dengue chest infection/respiratory surges

    const today = new Date();
    
    // Increment points
    const step = days === 7 ? 1 : days === 30 ? 3 : 7;
    for (let i = 0; i <= days; i += step) {
      const dateStr = new Date(today.getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const predicted = Math.round(baseConsumption * factor * (1 + Math.sin(i / 10) * 0.12 + (i / days) * 0.15));
      const confidenceUpper = Math.round(predicted * 1.12);
      const confidenceLower = Math.round(predicted * 0.88);
      
      data.push({
        day: dateStr,
        "Predicted Daily Demand": predicted,
        "Lower Bound": confidenceLower,
        "Upper Bound": confidenceUpper
      });
    }

    return data;
  };

  const chartData = generateForecastData();

  // Handle Form Submission
  const handleFormUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateItemName || !updateQty) return;
    const qtyNum = parseInt(updateQty, 10);
    if (isNaN(qtyNum) || qtyNum < 0) return;

    onUpdateInventory(activeCentre.id, updateItemName, qtyNum);
    setUpdateQty("");
    alert(`Success: Inventory for '${updateItemName}' updated to ${qtyNum} ${activeCentre.inventory.find(i => i.name === updateItemName)?.unit || 'units'} at ${activeCentre.name}.`);
  };

  return (
    <div className="space-y-6" id="inventory-tab">
      
      {/* Target Health Centre selector Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10" id="inventory-centre-header">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight">{t.inventoryStock}</h3>
            <p className="text-xs text-slate-400 font-medium">Dynamic audit of medicine stocks, life-saving drugs, and predictive supply logistics.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2" id="centre-dropdown-container">
          <span className="text-xs text-slate-400 font-bold uppercase mr-1">Select Centre:</span>
          <select
            value={selectedCentreId}
            onChange={(e) => onSelectCentreId(e.target.value)}
            className="text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 cursor-pointer outline-hidden focus:border-emerald-500/50"
            id="inventory-centre-dropdown"
          >
            {centres.map(c => (
              <option key={c.id} value={c.id} className="bg-[#0b1220] text-slate-100">{c.name} ({c.type})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Side-by-Side: Detailed stock grid & AI demand chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="inventory-grid-and-chart">
        
        {/* Left deep-dive stock grid (Span 2) */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col justify-between" id="inventory-grid-panel">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
              <h4 className="font-bold text-white text-sm flex items-center">
                <RefreshCw className="mr-2 h-4 w-4 text-emerald-400" />
                Live Stock Ledger for {activeCentre.name}
              </h4>
              <div className="relative" id="inventory-search">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search stock ledgers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-[11px] bg-white/5 border border-white/10 text-white rounded-lg outline-hidden focus:border-emerald-500/50 w-44"
                  id="inventory-item-search-input"
                />
              </div>
            </div>

            {/* Category filter tabs */}
            <div className="flex flex-wrap gap-1.5" id="inventory-category-tabs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                    categoryFilter === cat 
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                      : "bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                  id={`inventory-cat-${cat}`}
                >
                  {cat === "All" ? (t.allCentres || "All Supplies") : translateData(cat)}
                </button>
              ))}
            </div>

            {/* Stock Ledgers list */}
            <div className="overflow-x-auto" id="stock-ledger-table-container">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider bg-white/5">
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-right">Available Stock</th>
                    <th className="py-2.5 px-3 text-right">Avg Consumption / Day</th>
                    <th className="py-2.5 px-3 text-right">Buffer Remaining</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium text-slate-300" id="stock-ledger-table-body">
                  {filteredInventory.map(item => {
                    const isCritical = item.quantity < item.criticalLevel || item.daysRemaining <= 4;
                    const isWarning = !isCritical && item.daysRemaining <= 10;
                    
                    let statusLabel = t.normal;
                    let statusStyle = "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
                    if (isCritical) {
                      statusLabel = t.critical;
                      statusStyle = "bg-rose-500/15 text-rose-300 border-rose-500/20";
                    } else if (isWarning) {
                      statusLabel = t.warning;
                      statusStyle = "bg-amber-500/15 text-amber-300 border-amber-500/20";
                    }

                    return (
                      <tr 
                        key={item.name} 
                        onClick={() => setSelectedItemName(item.name)}
                        className={`hover:bg-white/5 cursor-pointer transition-colors ${
                          selectedItemName === item.name ? "bg-emerald-500/10 hover:bg-emerald-500/15" : ""
                        }`}
                        id={`stock-row-${item.name.replace(/\s+/g, '-')}`}
                      >
                        <td className="py-3 px-3">
                          <span className="font-bold text-white block leading-tight">{translateData(item.name)}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{translateData(item.category)}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-black text-white">
                          {item.quantity.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold">{translateData(item.unit)}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-400">
                          {item.avgDailyConsumption} {translateData(item.unit)}
                        </td>
                        <td className="py-3 px-3 text-right font-bold">
                          {item.quantity === 0 ? (
                            <span className="text-rose-400 font-black">STOCKOUT</span>
                          ) : (
                            <span className={isCritical ? "text-rose-400 font-black" : isWarning ? "text-amber-400" : "text-emerald-400"}>
                              {Math.round(item.daysRemaining)} {t.daysRemaining}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusStyle}`}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-white/10 pt-4 mt-4 font-bold uppercase">
            <span>District Central Stock Audit</span>
            <span className="text-slate-400 font-semibold text-right">Click items to forecast demand trends</span>
          </div>
        </div>

        {/* Right deep-dive AI demand chart (Span 1) */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col justify-between" id="inventory-demand-forecasting-panel">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm tracking-tight">{t.demandForecast}</h3>
              </div>
              <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 uppercase tracking-widest">
                Confidence 91%
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Forecasting model computes future consumption of **{selectedItemName}** based on local patient inflow rates, monsoon rain indices, and clinical trends.
            </p>

            {/* Chart controls */}
            <div className="flex items-center space-x-2" id="forecast-days-selector">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Interval:</span>
              {([7, 30, 90] as const).map(days => (
                <button
                  key={days}
                  onClick={() => setForecastDays(days)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                    forecastDays === days 
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                      : "bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                  id={`forecast-days-${days}`}
                >
                  {days}-Day
                </button>
              ))}
            </div>

            {/* Recharts responsive container */}
            <div className="h-48 w-full border border-white/10 rounded-xl bg-white/5 p-2" id="forecast-recharts-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.15)", color: "#fff" }} />
                  <Area type="monotone" dataKey="Predicted Daily Demand" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorDemand)" />
                  <Area type="monotone" dataKey="Upper Bound" stroke="#34d399" strokeDasharray="3 3" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg text-[10px] text-emerald-300 leading-relaxed font-semibold">
              <span className="font-bold block text-emerald-400 mb-0.5">AI Proactive Stock Directive:</span>
              Maintain safety buffer of at least **{Math.round((activeCentre.inventory.find(i => i.name === selectedItemName)?.avgDailyConsumption || 50) * 12)}** {activeCentre.inventory.find(i => i.name === selectedItemName)?.unit || 'vials'} to survive next week's monsoon surge blocks.
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-3 border-t border-white/10 mt-5">
            Gemini Forecasting Core
          </div>
        </div>

      </div>

      {/* Row 3: Admin Actions & Expiry Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="inventory-admin-and-expiry-actions">
        
        {/* Update inventory levels form (For PHC Administrators and Lab Techs) */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col justify-between" id="inventory-update-form-panel">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Edit3 className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white tracking-tight">{t.updateStock}</h3>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              As a **{role === "PHCAdmin" ? "PHC Administrator" : "District Administrator"}**, you have credentials to log daily stock takes, adjust vaccine levels, or log new cylinder shipments manually.
            </p>

            {role === "PHCAdmin" || role === "DistrictAdmin" ? (
              <form onSubmit={handleFormUpdate} className="space-y-4" id="inventory-edit-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Select Stock Item:</label>
                    <select
                      value={updateItemName}
                      onChange={(e) => setUpdateItemName(e.target.value)}
                      required
                      className="text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 outline-hidden focus:border-emerald-500 cursor-pointer"
                      id="update-stock-item-dropdown"
                    >
                      <option value="" className="bg-[#0b1220] text-slate-400">-- Choose Item --</option>
                      {activeCentre.inventory.map(i => (
                        <option key={i.name} value={i.name} className="bg-[#0b1220] text-white">{i.name} ({i.quantity} current)</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">New Physical Quantity:</label>
                    <input
                      type="number"
                      placeholder="e.g. 5200"
                      value={updateQty}
                      onChange={(e) => setUpdateQty(e.target.value)}
                      required
                      min="0"
                      className="text-xs font-semibold bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 outline-hidden focus:border-emerald-500"
                      id="update-stock-qty-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
                  id="update-stock-submit-btn"
                >
                  <span>Update Stock Level Ledger</span>
                </button>
              </form>
            ) : (
              <div className="p-8 text-center border border-dashed border-white/10 bg-white/5 text-slate-400 text-xs rounded-xl font-medium">
                🔒 Editing locked. Switch to **PHC Administrator** role in the header to modify stock levels.
              </div>
            )}
          </div>

          <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider border-t border-white/10 pt-4 mt-5">
            District Registry Authentication Block
          </div>
        </div>

        {/* Expiry predictions watch block */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col justify-between" id="expiry-watchlist-panel">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white tracking-tight">{t.expiryPrediction}</h3>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Proactive waste mitigation: Identifies drug/vaccine batches expiring within **90 days** so they can be dispatched to high-OPD centers prior to expiration.
            </p>

            <div className="space-y-3" id="expiring-items-list">
              {expiringItems.length === 0 ? (
                <div className="text-center py-6 text-emerald-300 font-bold text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  ✓ No batches expiring within 90 days.
                </div>
              ) : (
                expiringItems.map(item => (
                  <div key={item.name} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between animate-fade-in">
                    <div>
                      <h4 className="font-bold text-xs text-white leading-tight">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Expiry Date: <span className="font-bold text-amber-300">{item.expiryDate}</span></p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-300 font-bold block">{item.quantity} {item.unit}</span>
                      <span className="text-[9px] font-bold uppercase text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-sm block mt-1">
                        Expiring Soon
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="uppercase tracking-wider text-[10px]">mitigate waste directives</span>
            <span>AI Automated warning</span>
          </div>
        </div>

      </div>

    </div>
  );
}
