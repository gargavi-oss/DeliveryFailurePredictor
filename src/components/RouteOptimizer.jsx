import { useState } from "react";

export default function RouteOptimizer({ stops, setStops, setBeforeRoute }) {
  const [optimized, setOptimized] = useState(false);
  const [before, setBefore] = useState([]);

  const calcDist = (r) => {
    let t = 0;
    for (let i = 0; i < r.length - 1; i++) {
      const dx = r[i].lat - r[i + 1].lat, dy = r[i].lng - r[i + 1].lng;
      t += Math.sqrt(dx * dx + dy * dy);
    }
    return t;
  };

  const optimize = () => {
    if (!stops.length) return;
    setBefore([...stops]); setBeforeRoute([...stops]);
    let rem = [...stops], route = [], cur = rem.shift();
    route.push(cur);
    while (rem.length) {
      let bi = 0, bs = -Infinity;
      rem.forEach((s, i) => {
        const d = Math.sqrt((s.lat - cur.lat) ** 2 + (s.lng - cur.lng) ** 2);
        const sc = (s.risk === "HIGH" ? 2 : s.risk === "MEDIUM" ? 1.2 : 0.6) + (s.traffic_index || 0.5) * 0.5 - d * 1.2;
        if (sc > bs) { bs = sc; bi = i; }
      });
      cur = rem.splice(bi, 1)[0];
      route.push(cur);
    }
    setStops(route); setOptimized(true);
    setTimeout(() => setOptimized(false), 2500);
  };

  const bd = before.length ? calcDist(before) : 0;
  const ad = stops.length ? calcDist(stops) : 0;
  const imp = bd > 0 ? (((bd - ad) / bd) * 100).toFixed(1) : 0;

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>🗺️ Route Optimizer</h3>
        <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
          <span>{stops.length} stops</span>
          <span className="font-semibold" style={{ color: 'var(--risk-high)' }}>{stops.filter(s => s.risk === "HIGH").length} high</span>
        </div>
      </div>

      <button onClick={optimize} disabled={!stops.length}
        className="w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2"
        style={{
          background: optimized ? 'var(--risk-low-bg)' : 'var(--accent)',
          color: optimized ? 'var(--risk-low)' : '#fff',
          border: optimized ? '1px solid var(--risk-low)' : 'none',
          opacity: !stops.length ? 0.4 : 1,
        }}
      >
        {optimized ? "✓ Optimized" : "⚡ Optimize Route"}
      </button>

      {before.length > 0 && (
        <div className="space-y-2 text-[11px]">
          <div className="px-2.5 py-2 rounded-lg" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Before: </span>
            <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{before.map(s => s.id).join(" → ")}</span>
          </div>
          <div className="px-2.5 py-2 rounded-lg" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)' }}>After: </span>
            <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{stops.map(s => s.id).join(" → ")}</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 px-2.5 py-2 rounded-lg" style={{ background: 'var(--bg-subtle)' }}>
              <p className="text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>Time Saved</p>
              <p className="font-bold font-mono" style={{ color: 'var(--risk-low)' }}>~{Math.round(imp * 2)} min</p>
            </div>
            <div className="flex-1 px-2.5 py-2 rounded-lg" style={{ background: 'var(--bg-subtle)' }}>
              <p className="text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>Improved</p>
              <p className="font-bold font-mono accent-text">{imp}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}