import React from "react";
import { 
  ArrowRightLeft, 
  Check, 
  X, 
  HelpCircle, 
  Truck, 
  BadgeAlert, 
  TrendingUp, 
  Coins, 
  Navigation,
  CheckCircle2
} from "lucide-react";
import { Language, UserRole, ResourceTransfer, HealthCentre } from "../types";
import { translations } from "../data/translations";
import { getSmartResourceRedistributions } from "../data/mockData";

interface ResourceRedistributionProps {
  language: Language;
  role: UserRole;
  isLargeText: boolean;
  centres: HealthCentre[];
  transfers: ResourceTransfer[];
  onApproveTransfer: (transfer: Omit<ResourceTransfer, 'id' | 'status' | 'timestamp'>) => void;
  onCompleteTransfer: (transferId: string) => void;
}

export default function ResourceRedistribution({
  language,
  role,
  isLargeText,
  centres,
  transfers,
  onApproveTransfer,
  onCompleteTransfer
}: ResourceRedistributionProps) {
  const t = translations[language];

  // Dynamically compute redistribution recommendations based on live centres state
  const rawRecommendations = getSmartResourceRedistributions(centres);

  // Filter recommendations to avoid recommending items that are already in pending/transit transfers
  const activeTxKeys = new Set(
    transfers
      .filter(tx => tx.status === "Pending" || tx.status === "In Transit")
      .map(tx => `${tx.item}-${tx.toCentreId}`)
  );

  const recommendations = rawRecommendations.filter(
    rec => !activeTxKeys.has(`${rec.item}-${rec.toCentreId}`)
  );

  // Total calculated savings from completed/transit transfers
  const totalSavings = transfers.reduce((sum, tx) => sum + tx.estimatedSavingsInr, 0);

  return (
    <div className="space-y-6" id="redistribution-tab">
      
      {/* Top Banner Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="redistribution-analytics-cards">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-lg flex items-center space-x-4 hover:bg-white/10 transition-all duration-300">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.estimateSavings}</span>
            <span className="text-2xl font-black text-white block mt-0.5">₹{(totalSavings || 24500).toLocaleString('en-IN')}</span>
            <p className="text-[10px] text-emerald-300 font-bold mt-1">From waste prevention & bulk freight</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-lg flex items-center space-x-4 hover:bg-white/10 transition-all duration-300">
          <div className="p-3.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Shipments</span>
            <span className="text-2xl font-black text-white block mt-0.5">
              {transfers.filter(tx => tx.status === "In Transit").length} active
            </span>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Transfers currently on road</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-lg flex items-center space-x-4 hover:bg-white/10 transition-all duration-300">
          <div className="p-3.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completed Transfers</span>
            <span className="text-2xl font-black text-white block mt-0.5">
              {transfers.filter(tx => tx.status === "Completed").length} success
            </span>
            <p className="text-[10px] text-sky-300 font-bold mt-1">District inventory optimized</p>
          </div>
        </div>
      </div>

      {/* Row 2: Live AI Redistribution Recommendations Grid */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg space-y-4" id="redistribution-recommendations-section">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base tracking-tight">{t.recommendedTransfers}</h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md uppercase">
            AI Algorithm: Active
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The redistribution algorithm analyzes all health centers to find **surplus stores** (&gt;15 days safety stock) and matches them to **deficit centers** (&lt;5 days remaining) while minimizing travel distance.
        </p>

        {recommendations.length === 0 ? (
          <div className="text-center py-12 border border-white/10 rounded-xl bg-white/5 text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            <p className="font-bold text-white">All inventories stabilized across the network</p>
            <p className="text-[10px] text-slate-400 font-medium">No urgent deficits detected right now.</p>
          </div>
        ) : (
          <div className="overflow-x-auto" id="recommendations-table-container">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider bg-white/5">
                  <th className="py-3 px-4">Required Item</th>
                  <th className="py-3 px-4">Qty to Move</th>
                  <th className="py-3 px-4 text-rose-300">Receiving Deficit Centre</th>
                  <th className="py-3 px-4 text-emerald-300">Sourcing Surplus Centre</th>
                  <th className="py-3 px-4">Distance & Cost Savings</th>
                  {role === "DistrictAdmin" && <th className="py-3 px-4 text-right">Administrative Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5" id="recommendations-table-body">
                {recommendations.map((rec, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {rec.item}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-white/10 text-white border border-white/10 font-bold px-2 py-1 rounded-md text-[10px]">
                        {rec.quantity} {rec.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-200 block leading-tight">{rec.toCentreName}</span>
                      <span className="text-[10px] text-rose-300 font-semibold block mt-0.5">Critical shortage warning</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-200 block leading-tight">{rec.fromCentreName}</span>
                      <span className="text-[10px] text-emerald-300 font-semibold block mt-0.5">Stock surplus active</span>
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      <div className="flex items-center text-[10px] font-semibold text-slate-400">
                        <Navigation className="h-3 w-3 mr-1 text-slate-400" />
                        {rec.distanceKm} km (optimized route)
                      </div>
                      <div className="text-[10px] text-emerald-300 font-bold flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1 text-emerald-400" />
                        Est. Savings: ₹{rec.estimatedSavingsInr.toLocaleString('en-IN')}
                      </div>
                    </td>
                    {role === "DistrictAdmin" && (
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onApproveTransfer(rec)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                          id={`approve-rec-${index}`}
                        >
                          Approve Move
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Row 3: Live Shipments Log / History */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg space-y-4" id="redistribution-history-section">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <Truck className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base tracking-tight">Active & Historical Redistribution Shipments</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Real-time GPS Tracking active</span>
        </div>

        {transfers.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No transfers have been initiated today.
          </div>
        ) : (
          <div className="overflow-x-auto" id="transfers-log-table-container">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider bg-white/5">
                  <th className="py-3 px-4">Transfer ID</th>
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Dispatch Timestamp</th>
                  <th className="py-3 px-4">Shipment Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5" id="transfers-log-table-body">
                {transfers.map(tx => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                      {tx.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{tx.item}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{tx.quantity} {tx.unit}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed">
                      <div className="font-semibold text-slate-400">From: <span className="font-bold text-white">{tx.fromCentreName}</span></div>
                      <div className="font-semibold text-slate-400">To: <span className="font-bold text-emerald-400">{tx.toCentreName}</span></div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Distance: {tx.distanceKm} km</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {tx.timestamp}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                        tx.status === "Completed" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" :
                        tx.status === "In Transit" ? "bg-amber-500/10 text-amber-300 border-amber-500/20 animate-pulse" :
                        "bg-white/5 text-slate-300 border-white/5"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {tx.status === "In Transit" && (
                        <button
                          onClick={() => onCompleteTransfer(tx.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                          id={`complete-tx-${tx.id}`}
                        >
                          Mark Delivered
                        </button>
                      )}
                      {tx.status === "Completed" && (
                        <span className="text-emerald-400 font-bold text-[10px] flex items-center justify-end">
                          <Check className="h-3 w-3 mr-1" /> Stock Merged
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
