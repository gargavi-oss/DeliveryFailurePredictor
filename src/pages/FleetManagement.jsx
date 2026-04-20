import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8001/api";

export default function FleetManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("vehicles");

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/fleet/vehicles`),
      axios.get(`${API}/fleet/drivers`),
    ]).then(([v, d]) => {
      setVehicles(v.data);
      setDrivers(d.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const vehicleIcons = {
    bike: "🏍️", "ev van": "🔋", truck: "🚛", van: "🚐",
    "ev bike": "⚡", scooter: "🛵", unknown: "🚗"
  };

  const statusColor = {
    Active: "var(--risk-low)", Maintenance: "var(--risk-med)", Inactive: "var(--risk-high)"
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fleet <span className="accent-text">Management</span></h1>
          <p className="page-subtitle">Vehicle fleet overview and driver performance tracking</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-1 flex gap-1 mb-6" style={{ maxWidth: 300 }}>
        <button onClick={() => setTab("vehicles")}
          className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-colors"
          style={{
            background: tab === "vehicles" ? "var(--accent)" : "transparent",
            color: tab === "vehicles" ? "#fff" : "var(--text-muted)"
          }}>🚛 Vehicles</button>
        <button onClick={() => setTab("drivers")}
          className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-colors"
          style={{
            background: tab === "drivers" ? "var(--accent)" : "transparent",
            color: tab === "drivers" ? "#fff" : "var(--text-muted)"
          }}>👤 Drivers</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-10 w-10 bg-gray-300/20 rounded-xl mb-3" />
              <div className="h-3 w-20 bg-gray-300/20 rounded mb-2" />
              <div className="h-4 w-12 bg-gray-300/30 rounded" />
            </div>
          ))}
        </div>
      ) : tab === "vehicles" ? (
        /* Vehicle Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.map((v, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: "var(--accent-soft)" }}>
                    {vehicleIcons[v.type] || "🚗"}
                  </div>
                  <div>
                    <p className="text-xs font-semibold capitalize"
                      style={{ color: "var(--text-primary)" }}>{v.type}</p>
                    <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                      {v.count.toLocaleString()} deliveries
                    </p>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: `${statusColor[v.status]}15`,
                    color: statusColor[v.status]
                  }}>{v.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg" style={{ background: "var(--bg-subtle)" }}>
                  <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>Success Rate</p>
                  <p className="text-sm font-bold font-mono"
                    style={{ color: v.success_rate > 75 ? "var(--risk-low)" : "var(--risk-med)" }}>
                    {v.success_rate}%
                  </p>
                </div>
                <div className="p-2 rounded-lg" style={{ background: "var(--bg-subtle)" }}>
                  <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>Reliability</p>
                  <p className="text-sm font-bold font-mono"
                    style={{ color: "var(--accent)" }}>
                    {v.avg_reliability}%
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[9px] mb-1" style={{ color: "var(--text-muted)" }}>
                  <span>Avg Cost</span>
                  <span className="font-mono">₹{v.avg_cost}</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--bg-subtle)" }}>
                  <div className="h-full rounded-full"
                    style={{
                      width: `${v.success_rate}%`,
                      background: v.success_rate > 75 ? "var(--risk-low)" : "var(--risk-med)"
                    }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Driver Leaderboard */
        <div className="card overflow-hidden">
          <div className="px-5 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Driver Leaderboard
            </h2>
            <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
              {drivers.length} drivers
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Rank", "Driver", "Deliveries", "Success Rate", "Rating", "Delay Rate", "Region"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drivers.map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}
                  className="transition-colors hover:opacity-80">
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold font-mono"
                      style={{ color: d.rank <= 3 ? "var(--accent)" : "var(--text-muted)" }}>
                      #{d.rank}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                        {d.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                        {d.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                    {d.deliveries}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full overflow-hidden"
                        style={{ background: "var(--bg-subtle)" }}>
                        <div className="h-full rounded-full" style={{
                          width: `${d.success_rate}%`,
                          background: d.success_rate > 75 ? "var(--risk-low)" : "var(--risk-med)"
                        }} />
                      </div>
                      <span className="text-xs font-mono font-semibold"
                        style={{ color: d.success_rate > 75 ? "var(--risk-low)" : "var(--risk-med)" }}>
                        {d.success_rate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs font-mono" style={{ color: "#f59e0b" }}>
                    ★ {d.rating}
                  </td>
                  <td className="px-5 py-3 text-xs font-mono"
                    style={{ color: d.avg_delay_rate > 0.3 ? "var(--risk-high)" : "var(--text-muted)" }}>
                    {(d.avg_delay_rate * 100).toFixed(1)}%
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] px-2 py-1 rounded-full capitalize"
                      style={{ background: "var(--bg-subtle)", color: "var(--text-secondary)" }}>
                      {d.region}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
