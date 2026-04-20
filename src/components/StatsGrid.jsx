export default function StatsGrid({ stats }) {
  return (
    <div className="stats-grid">
      {stats.map((s, i) => (
        <div key={i} className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-icon">{s.icon}</span>
            {s.trend && (
              <span className={`stat-trend ${s.trend > 0 ? "up" : "down"}`}>
                {s.trend > 0 ? "↑" : "↓"} {Math.abs(s.trend)}%
              </span>
            )}
          </div>
          <p className="stat-card-value" style={{ color: s.color || "var(--text-primary)" }}>
            {s.value}
          </p>
          <p className="stat-card-label">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
