import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8001/api";

export default function AlertCenter() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios.get(`${API}/fleet/alerts`)
      .then(r => setAlerts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const severityConfig = {
    critical: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: "🔴", label: "Critical" },
    warning: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: "🟡", label: "Warning" },
    info: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)", icon: "🔵", label: "Info" },
  };

  const typeIcons = {
    weather: "🌦️", traffic: "🚦", vehicle: "🚛",
    driver: "👤", sla: "⏰", cost: "💰", region: "📍"
  };

  const filtered = filter === "all"
    ? alerts
    : alerts.filter(a => a.severity === filter);

  const counts = {
    all: alerts.length,
    critical: alerts.filter(a => a.severity === "critical").length,
    warning: alerts.filter(a => a.severity === "warning").length,
    info: alerts.filter(a => a.severity === "info").length,
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Alert <span className="accent-text">Center</span></h1>
          <p className="page-subtitle">Real-time alerts and notifications for delivery operations</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 rounded-full font-semibold"
            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
            {counts.critical} Critical
          </span>
          <span className="text-[10px] px-3 py-1 rounded-full font-semibold"
            style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
            {counts.warning} Warnings
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {["all", "critical", "warning", "info"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize"
            style={{
              background: filter === f ? "var(--accent)" : "var(--bg-subtle)",
              color: filter === f ? "#fff" : "var(--text-muted)",
              border: `1px solid ${filter === f ? "var(--accent)" : "var(--border)"}`,
            }}>
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-3 w-32 bg-gray-300/20 rounded mb-2" />
              <div className="h-2 w-64 bg-gray-300/10 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((alert) => {
            const sev = severityConfig[alert.severity] || severityConfig.info;
            return (
              <div key={alert.id} className="card overflow-hidden transition-all hover:shadow-lg"
                style={{ borderLeft: `3px solid ${sev.color}` }}>
                <div className="p-4 flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: sev.bg }}>
                    {typeIcons[alert.type] || "📋"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                        {alert.title}
                      </h3>
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: sev.bg, color: sev.color }}>
                        {sev.icon} {sev.label}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {alert.message}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-[9px] font-mono" style={{ color: "var(--text-muted)" }}>
                      {alert.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="card p-12 text-center">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                No alerts in this category
              </p>
              <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                All systems operating normally
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
