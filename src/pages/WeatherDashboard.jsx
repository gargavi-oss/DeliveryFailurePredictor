import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
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

export default function WeatherDashboard() {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/analytics/weather-impact`)
      .then(r => setWeather(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const icons = {
    clear: "☀️", rainy: "🌧️", foggy: "🌫️", stormy: "⛈️",
    cold: "❄️", hot: "🌡️", unknown: "🌤️"
  };

  const colors = {
    clear: "#22c55e", rainy: "#3b82f6", foggy: "#94a3b8",
    stormy: "#ef4444", cold: "#06b6d4", hot: "#f59e0b", unknown: "#6b7280"
  };

  const radarData = weather.map(w => ({
    condition: w.weather_condition,
    failure_rate: w.failure_rate,
    avg_risk: w.avg_risk,
    avg_traffic: w.avg_traffic,
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Weather <span className="accent-text">Intelligence</span></h1>
          <p className="page-subtitle">Weather-correlated delivery risk analysis and recommendations</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-8 w-8 bg-gray-300/20 rounded-xl mb-3" />
              <div className="h-3 w-20 bg-gray-300/20 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Weather cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
            {weather.map((w, i) => (
              <div key={i} className="card p-4 text-center space-y-2">
                <span className="text-2xl">{icons[w.weather_condition] || "🌤️"}</span>
                <p className="text-[10px] font-semibold capitalize"
                  style={{ color: "var(--text-primary)" }}>
                  {w.weather_condition}
                </p>
                <p className="text-lg font-bold font-mono"
                  style={{
                    color: w.failure_rate > 35 ? "var(--risk-high)"
                      : w.failure_rate > 20 ? "var(--risk-med)" : "var(--risk-low)"
                  }}>
                  {w.failure_rate}%
                </p>
                <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>failure rate</p>
                <div className="w-full h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--bg-subtle)" }}>
                  <div className="h-full rounded-full" style={{
                    width: `${w.failure_rate}%`,
                    background: colors[w.weather_condition] || "#6b7280"
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-12 gap-5">

            {/* Bar chart */}
            <div className="col-span-12 lg:col-span-7 card p-5">
              <h3 className="text-xs font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                📊 Failure Rate by Weather Condition
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weather} barCategoryGap="16%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="weather_condition" tick={{ fontSize: 10, fill: "#9ca3af" }}
                    style={{ textTransform: "capitalize" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="failure_rate" radius={[6, 6, 0, 0]} maxBarSize={48} name="Failure %">
                    {weather.map((w, i) => (
                      <Cell key={i} fill={colors[w.weather_condition] || "#6b7280"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar chart */}
            <div className="col-span-12 lg:col-span-5 card p-5">
              <h3 className="text-xs font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                🎯 Multi-Metric Radar
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="condition" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                  <PolarRadiusAxis tick={{ fontSize: 9, fill: "#9ca3af" }} />
                  <Radar name="Failure %" dataKey="failure_rate"
                    stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                  <Radar name="Avg Risk" dataKey="avg_risk"
                    stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
                  <Radar name="Traffic" dataKey="avg_traffic"
                    stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-3 justify-center">
                {[["Failure", "#ef4444"], ["Risk", "#f59e0b"], ["Traffic", "#3b82f6"]].map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1.5 text-[10px]"
                    style={{ color: "var(--text-muted)" }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: c }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card p-5 mt-5">
            <h3 className="text-xs font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              💡 Weather-Based Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {weather.filter(w => w.failure_rate > 20).map((w, i) => (
                <div key={i} className="p-3 rounded-xl flex items-start gap-3"
                  style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                  <span className="text-lg">{icons[w.weather_condition]}</span>
                  <div>
                    <p className="text-[11px] font-semibold capitalize"
                      style={{ color: "var(--text-primary)" }}>
                      {w.weather_condition} Conditions
                    </p>
                    <p className="text-[10px] mt-1" style={{ color: "var(--text-secondary)" }}>
                      {w.failure_rate > 35
                        ? "⚠️ Critical: Schedule backup drivers. Avoid long-distance routes."
                        : w.failure_rate > 25
                          ? "🔶 Elevated risk: Add 30-min buffer per stop. Prioritize nearby routes."
                          : "📋 Monitor: Standard precautions recommended."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
