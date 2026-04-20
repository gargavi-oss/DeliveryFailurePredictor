import { useState, useEffect } from "react";
import axios from "axios";
import StatsGrid from "../components/StatsGrid";
import PartnerCard from "../components/PartnerCard";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, AreaChart, Area, PieChart, Pie
} from "recharts";

const API = "http://127.0.0.1:8001/api";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '8px 12px', boxShadow: 'var(--shadow-md)',
    }}>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 12, fontWeight: 700, color: p.color || 'var(--text-primary)' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [weather, setWeather] = useState([]);
  const [partners, setPartners] = useState([]);
  const [regions, setRegions] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/analytics/overview`),
      axios.get(`${API}/analytics/trends`),
      axios.get(`${API}/analytics/weather-impact`),
      axios.get(`${API}/analytics/partner-performance`),
      axios.get(`${API}/analytics/region-heatmap`),
      axios.get(`${API}/analytics/hourly-pattern`),
    ]).then(([ov, tr, we, pa, re, hr]) => {
      setOverview(ov.data);
      setTrends(tr.data);
      setWeather(we.data);
      setPartners(pa.data);
      setRegions(re.data);
      setHourly(hr.data);
    }).catch(err => console.error("Analytics load error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Analytics</h1>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-3 w-20 bg-gray-300/20 rounded mb-3" />
              <div className="h-6 w-16 bg-gray-300/30 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = overview ? [
    { icon: "📦", value: overview.total_deliveries.toLocaleString(), label: "Total Deliveries", trend: 12, color: "var(--accent)" },
    { icon: "❌", value: `${overview.failure_rate}%`, label: "Failure Rate", trend: -8, color: "var(--risk-high)" },
    { icon: "💰", value: `₹${(overview.estimated_savings / 1000).toFixed(0)}K`, label: "Est. Savings", trend: 24, color: "var(--risk-low)" },
    { icon: "⚠️", value: overview.high_risk_count.toLocaleString(), label: "High Risk Stops", trend: -5, color: "var(--risk-med)" },
  ] : [];

  const regionColors = ["#2563eb", "#7c3aed", "#06b6d4", "#f59e0b", "#ef4444", "#22c55e"];
  const weatherColors = {
    clear: "#22c55e", rainy: "#3b82f6", foggy: "#94a3b8",
    stormy: "#ef4444", cold: "#06b6d4", hot: "#f59e0b", unknown: "#6b7280"
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics <span className="accent-text">Dashboard</span></h1>
          <p className="page-subtitle">Comprehensive delivery intelligence insights from 25,000 records</p>
        </div>
      </div>

      {/* KPI Cards */}
      <StatsGrid stats={stats} />

      {/* Row 1: Trends + Weather */}
      <div className="grid grid-cols-12 gap-5 mt-6">

        {/* Trends Chart */}
        <div className="col-span-12 lg:col-span-8 card p-5">
          <h3 className="text-xs font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            📈 Failure Rate Trend (30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trends.slice(-30)}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date_str" tick={{ fontSize: 9, fill: "#9ca3af" }}
                tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="failure_rate" stroke="#2563eb" strokeWidth={2.5}
                fill="url(#trendGrad)" name="Failure %" dot={{ r: 3, fill: "#2563eb" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weather Impact */}
        <div className="col-span-12 lg:col-span-4 card p-5">
          <h3 className="text-xs font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            🌦️ Weather Impact
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weather} layout="vertical" barCategoryGap="16%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="weather_condition" tick={{ fontSize: 10, fill: "#9ca3af" }}
                width={60} style={{ textTransform: "capitalize" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="failure_rate" radius={[0, 6, 6, 0]} maxBarSize={24} name="Failure %">
                {weather.map((w, i) => (
                  <Cell key={i} fill={weatherColors[w.weather_condition] || "#6b7280"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Hourly Pattern + Region Distribution */}
      <div className="grid grid-cols-12 gap-5 mt-5">

        {/* Hourly */}
        <div className="col-span-12 lg:col-span-7 card p-5">
          <h3 className="text-xs font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            🕐 Failure Rate by Hour
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourly} barCategoryGap="8%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickFormatter={v => `${v}:00`} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="failure_rate" radius={[4, 4, 0, 0]} maxBarSize={28} name="Failure %">
                {hourly.map((h, i) => (
                  <Cell key={i} fill={h.failure_rate > 30 ? "#ef4444" : h.failure_rate > 20 ? "#f59e0b" : "#22c55e"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Region */}
        <div className="col-span-12 lg:col-span-5 card p-5">
          <h3 className="text-xs font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            🗺️ Regional Distribution
          </h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={regions} dataKey="total" nameKey="region" cx="50%" cy="50%"
                  innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {regions.map((r, i) => (
                    <Cell key={i} fill={regionColors[i % regionColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {regions.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full"
                      style={{ background: regionColors[i % regionColors.length] }} />
                    <span className="capitalize" style={{ color: "var(--text-primary)" }}>{r.region}</span>
                  </div>
                  <span className="font-mono font-semibold" style={{
                    color: r.failure_rate > 30 ? "var(--risk-high)" : "var(--text-muted)"
                  }}>{r.failure_rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Partner Performance */}
      <div className="mt-5">
        <h3 className="text-xs font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          🏢 Partner Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {partners.map((p, i) => (
            <PartnerCard key={i} partner={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
