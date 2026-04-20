export default function WeatherWidget({ data }) {
  if (!data || data.length === 0) return null;

  const icons = {
    clear: "☀️", rainy: "🌧️", foggy: "🌫️", stormy: "⛈️",
    cold: "❄️", hot: "🌡️", unknown: "🌤️"
  };

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">🌦️</span>
        <h3 className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
          Weather Impact
        </h3>
      </div>
      <div className="space-y-2">
        {data.slice(0, 5).map((w, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg"
            style={{ background: "var(--bg-subtle)" }}>
            <div className="flex items-center gap-2">
              <span className="text-sm">{icons[w.weather_condition] || "🌤️"}</span>
              <span className="text-[11px] font-medium capitalize"
                style={{ color: "var(--text-primary)" }}>
                {w.weather_condition}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-1.5 rounded-full overflow-hidden"
                style={{ background: "var(--border)" }}>
                <div className="h-full rounded-full" style={{
                  width: `${w.failure_rate}%`,
                  background: w.failure_rate > 35
                    ? "var(--risk-high)" : w.failure_rate > 20
                      ? "var(--risk-med)" : "var(--risk-low)"
                }} />
              </div>
              <span className="text-[10px] font-mono font-bold"
                style={{
                  color: w.failure_rate > 35
                    ? "var(--risk-high)" : w.failure_rate > 20
                      ? "var(--risk-med)" : "var(--risk-low)"
                }}>
                {w.failure_rate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
