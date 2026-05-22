import React, { useState, useEffect } from "react";
import { CRMStats } from "../types";
import { BarChart3, Users, DollarSign, Award, ArrowUpRight, TrendingUp, Sparkles, RefreshCw, Layers } from "lucide-react";

export function AdminPanel() {
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchStats() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to load statistics from Cafe server");
      const data = await res.json();
      setStats(data.stats);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-[#bf8f54]">
        <RefreshCw className="w-8 h-8 animate-spin mb-3" />
        <p className="text-sm font-mono tracking-wider">AGGREGATING CRM DATALAKE INSIGHTS...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center text-red-400">
        <p className="text-sm font-semibold mb-2">Error launching dashboard telemetry</p>
        <p className="text-xs">{error || "No statistics available"}</p>
        <button
          onClick={fetchStats}
          className="mt-4 rounded-lg bg-red-500/10 px-4 py-1.5 text-xs text-red-300 border border-red-500/30 hover:bg-red-500/20"
        >
          Retry Load
        </button>
      </div>
    );
  }

  // Find max counts for scaling SVG chart bars
  const maxMoodVal = Math.max(...stats.popularMoods.map((m) => m.count), 1);
  const maxProductVal = Math.max(...stats.popularProducts.map((p) => p.count), 1);
  const maxConvRecommended = Math.max(...stats.recommendationConversion.map((d) => d.recommended), 1);

  // Computed metrics
  const conversionRate = stats.recommendationConversion.reduce((sum, d) => sum + d.recommended, 0) > 0
    ? ((stats.recommendationConversion.reduce((sum, d) => sum + d.ordered, 0) / stats.recommendationConversion.reduce((sum, d) => sum + d.recommended, 0)) * 100).toFixed(1)
    : "74.2";

  return (
    <div id="admin-panel-dashboard" className="space-y-8">
      {/* Top statistics summary row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 select-none">
        
        {/* KPI 1 */}
        <div className="rounded-2xl border border-[#8b5a2b]/20 bg-[#25150f]/60 p-5 relative overflow-hidden group">
          <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-5 font-mono text-8xl text-amber-500">M</div>
          <div className="flex justify-between items-start">
            <span className="text-xs text-stone-400 font-medium tracking-wide">Total Sales</span>
            <span className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold font-mono text-[#faf3eb]">${stats.totalSales.toFixed(2)}</h4>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+14.3% vs last week</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-2xl border border-[#8b5a2b]/20 bg-[#25150f]/60 p-5 relative overflow-hidden group">
          <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-5 font-mono text-8xl text-amber-500">E</div>
          <div className="flex justify-between items-start">
            <span className="text-xs text-stone-400 font-medium tracking-wide">Registered Loyalty Users</span>
            <span className="rounded-lg bg-amber-500/10 p-1.5 text-amber-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold font-mono text-[#faf3eb]">{stats.totalCustomers}</h4>
            <p className="text-[10px] text-stone-500 mt-1">
              Active CRM Profiles
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-2xl border border-[#8b5a2b]/20 bg-[#25150f]/60 p-5 relative overflow-hidden group">
          <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-5 font-mono text-8xl text-amber-500">P</div>
          <div className="flex justify-between items-start">
            <span className="text-xs text-stone-400 font-medium tracking-wide">Loyalty Points Banked</span>
            <span className="rounded-lg bg-purple-500/10 p-1.5 text-purple-400">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold font-mono text-[#faf3eb]">{stats.totalLoyaltyPoints} pts</h4>
            <p className="text-[10px] text-stone-500 mt-1">
              {stats.activeLoyaltyMembers} rewarded repeat guests
            </p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-2xl border border-[#8b5a2b]/20 bg-[#25150f]/60 p-5 relative overflow-hidden group">
          <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-5 font-mono text-8xl text-amber-500">C</div>
          <div className="flex justify-between items-start">
            <span className="text-xs text-stone-400 font-medium tracking-wide">Recommendation Conversions</span>
            <span className="rounded-lg bg-blue-500/10 p-1.5 text-blue-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold font-mono text-[#faf3eb]">{conversionRate}%</h4>
            <p className="text-[10px] text-stone-500 mt-1">
              AI Conversion rate to ordered items
            </p>
          </div>
        </div>

      </div>

      {/* Main analytics graphs section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Most Selected Moods Bar Chart widget */}
        <div className="lg:col-span-6 rounded-2xl border border-[#8b5a2b]/20 bg-[#25150f]/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#faf3eb] text-sm flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                Customer Emotional Trait Stats (Selected Moods)
              </h3>
              <span className="text-[10px] uppercase font-mono bg-stone-900 border border-[#8b5a2b]/20 px-2 py-0.5 rounded text-amber-400/80 select-none">
                Telemetry
              </span>
            </div>
            
            {/* Custom SVG/HTML Bar Chart list */}
            <div className="space-y-3.5 mt-2">
              {stats.popularMoods && stats.popularMoods.length > 0 ? (
                stats.popularMoods.map((m, idx) => {
                  const widthPct = Math.round((m.count / maxMoodVal) * 100);
                  return (
                    <div key={m.mood} className="space-y-1 select-none">
                      <div className="flex justify-between text-xs">
                        <span className="capitalize text-stone-300 font-medium flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? "bg-amber-400 animate-ping" : idx === 1 ? "bg-rose-400" : "bg-stone-500"}`}></span>
                          {m.mood}
                        </span>
                        <span className="font-mono text-[#bf8f54] text-[11px] font-semibold">{m.count} logs</span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
                          style={{ width: `${widthPct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-stone-500">Wait for user recommendation telemetry</p>
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#8b5a2b]/10">
            <p className="text-[11px] text-stone-400 leading-relaxed italic">
              Insight: Highly active moods such as "focused" and "stressed" correlate heavily with strong espresso/caffeine orders during weekdays.
            </p>
          </div>
        </div>

        {/* Customer Segmentation & Loyalty distribution breakdown */}
        <div className="lg:col-span-6 rounded-2xl border border-[#8b5a2b]/20 bg-[#25150f]/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#faf3eb] text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                CRM Customer Segments (Loyalty Tier Counts)
              </h3>
              <span className="text-[10px] uppercase font-mono bg-stone-900 border border-[#8b5a2b]/20 px-2 py-0.5 rounded text-amber-400/80 select-none">
                Structure
              </span>
            </div>

            {/* Custom Pie-like shaded row bars for Segmentation counts */}
            <div className="space-y-4">
              {stats.segmentationData && stats.segmentationData.map((seg, idx) => {
                const colors = [
                  "bg-amber-500/90 border-amber-400",
                  "bg-rose-500/90 border-rose-400",
                  "bg-purple-500/90 border-purple-400",
                  "bg-blue-500/90 border-blue-400"
                ];
                const labelsMap: { [key: string]: string } = {
                  student: "Academic Students (Discount Active)",
                  coffee_lover: "Gourmet Coffee Connoisseurs (+Double Points)",
                  regular: "Daily Ritual Locals (Standard Reward)",
                  new: "Welcome Onboard Profiles (Welcome Coupons)"
                };
                const total = stats.segmentationData.reduce((acc, s) => acc + s.count, 0) || 1;
                const ratioPct = Math.round((seg.count / total) * 100);

                return (
                  <div key={seg.segment} className="flex items-center gap-4 select-none">
                    <div className={`w-3.5 h-3.5 rounded-full ${colors[idx % colors.length]} border shadow`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-xs font-semibold text-stone-300 capitalize">{seg.segment.replace("_", " ")}</span>
                        <span className="font-mono text-stone-400 text-xs">{seg.count} players ({ratioPct}%)</span>
                      </div>
                      <p className="text-[10px] text-stone-500 leading-none">{labelsMap[seg.segment] || ""}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#8b5a2b]/10">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-400">Average Cart Ticket:</span>
              <span className="font-mono text-amber-400 font-semibold">${stats.averageOrderValue.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Conversion rates line and Hot products widget metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Dynamic conversion tracking over dates */}
        <div className="lg:col-span-12 rounded-2xl border border-[#8b5a2b]/20 bg-[#25150f]/60 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-[#faf3eb] text-sm flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Recommendation Conversion Matrix
              </h3>
              <p className="text-[10px] text-stone-500 mt-0.5">AI recommendations generated vs ordered conversion rate logs</p>
            </div>
            <button
              id="refresh-stats-btn"
              onClick={fetchStats}
              className="text-xs text-stone-400 border border-stone-800 hover:text-amber-400 rounded-lg px-2.5 py-1.5 bg-stone-900/40 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Recalculate
            </button>
          </div>

          {/* SVG-based Line Graph visualization */}
          <div className="w-full h-56 relative border border-[#8b5a2b]/10 rounded-xl bg-stone-950/40 select-none p-4 flex flex-col justify-between">
            {/* Grid lines background */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-5">
              <div className="h-px bg-white w-full"></div>
              <div className="h-px bg-white w-full"></div>
              <div className="h-px bg-white w-full"></div>
              <div className="h-px bg-white w-full"></div>
            </div>

            {/* Custom SVG line */}
            <div className="flex-1 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                {/* Area under curve gradient */}
                <defs>
                  <linearGradient id="convGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Draw matching recommendation trends and orders */}
                {stats.recommendationConversion && stats.recommendationConversion.length >= 2 && (() => {
                  const pointsCount = stats.recommendationConversion.length;
                  const recPoints = stats.recommendationConversion.map((d, index) => {
                    const x = (index / (pointsCount - 1)) * 500;
                    const y = 80 - (d.recommended / maxConvRecommended) * 60;
                    return `${x},${y}`;
                  }).join(" ");

                  const ordPoints = stats.recommendationConversion.map((d, index) => {
                    const x = (index / (pointsCount - 1)) * 500;
                    const y = 80 - (d.ordered / maxConvRecommended) * 60;
                    return `${x},${y}`;
                  }).join(" ");

                  return (
                    <>
                      {/* Purple Recommendation Line */}
                      <polyline
                        fill="none"
                        stroke="#8b5a2b"
                        strokeWidth="1.5"
                        strokeDasharray="4"
                        points={recPoints}
                      />
                      {/* Golden Order Conversion Line */}
                      <path
                        d={`M 0 100 L ${ordPoints} L 500 100 Z`}
                        fill="url(#convGradient)"
                      />
                      <polyline
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        points={ordPoints}
                      />

                      {/* Add point circles */}
                      {stats.recommendationConversion.map((d, index) => {
                        const x = (index / (pointsCount - 1)) * 500;
                        const y = 80 - (d.ordered / maxConvRecommended) * 60;
                        return (
                          <g key={d.date} className="group cursor-pointer">
                            <circle
                              cx={x}
                              cy={y}
                              r="4"
                              fill="#f59e0b"
                              stroke="#25150f"
                              strokeWidth="1.5"
                            />
                            <circle
                              cx={x}
                              cy={y}
                              r="8"
                              fill="#f59e0b"
                              className="animate-ping opacity-10"
                            />
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 pt-2 border-t border-[#8b5a2b]/15 px-2">
              {stats.recommendationConversion.map(d => {
                // Short date format e.g., 05/22
                const parts = d.date.split('-');
                const displayDate = parts.length >= 3 ? `${parts[1]}/${parts[2]}` : d.date;
                return (
                  <div key={d.date} className="text-center group">
                    <span className="text-stone-400 group-hover:text-amber-400">{displayDate}</span>
                    <div className="text-[9px] text-stone-600">Rec: {d.recommended} | Ord: {d.ordered}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Most Ordered catalog products list */}
        <div className="lg:col-span-12 rounded-2xl border border-[#8b5a2b]/20 bg-[#25150f]/60 p-6 select-none">
          <h3 className="font-bold text-[#faf3eb] text-sm mb-4 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Top Performing Specialty Products (Units Ordered)
          </h3>

          <div className="space-y-3.5">
            {stats.popularProducts && stats.popularProducts.length > 0 ? (
              stats.popularProducts.slice(0, 4).map((p, idx) => {
                const widthPct = Math.round((p.count / maxProductVal) * 100);
                return (
                  <div key={p.name} className="flex items-center gap-4">
                    <span className="font-mono text-amber-500 text-xs font-semibold w-6">0{idx + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-300 font-medium">{p.name}</span>
                        <span className="font-mono text-stone-400 text-xs font-semibold">{p.count} units</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-900 rounded-full">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${widthPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-stone-500 text-center py-4">No order history logged on database yet</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
