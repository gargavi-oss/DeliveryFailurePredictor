export default function DriverPerformance({ stops }) {
  if (!stops || stops.length === 0) return null;

  const avgDelay = Math.round(12 + (stops.length * 1.5));
  const hs = stops.filter(s => s.risk === "HIGH").length;
  const ms = stops.filter(s => s.risk === "MEDIUM").length;
  const efficiency = Math.max(0, 100 - (hs * 15) - (ms * 5));

  const avgTraffic = stops.reduce((acc, curr) => acc + (curr.traffic_index || 0.5), 0) / stops.length;
  const roadCondition = avgTraffic > 0.7 ? "Thin/Con." : "Broad/Clear";
  const expectedSpeed = avgTraffic > 0.7 ? "15-25 kmh" : "40-55 kmh";
  
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[14px]">🧑‍🚀</span>
          <h3 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Driver Performance</h3>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
          Active
        </span>
      </div>
      
      <div className="space-y-4 pt-1">
        <div>
          <div className="flex justify-between text-[10px] mb-1.5" style={{ color: 'var(--text-muted)' }}>
            <span>Efficiency Score</span>
            <span className="font-mono font-bold" style={{ color: '#2563eb' }}>{efficiency}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ width: `${efficiency}%`, background: '#2563eb' }} 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
            <p className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--text-muted)' }}>Road Type</p>
            <p className="font-mono text-[11px] font-bold" style={{ color: "var(--text-primary)" }}>{roadCondition}</p>
          </div>
          <div className="p-2 rounded" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
            <p className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--text-muted)' }}>Max Speed</p>
            <p className="font-mono text-[11px] font-bold" style={{ color: "var(--text-secondary)" }}>{expectedSpeed}</p>
          </div>
          <div className="p-2 rounded" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
            <p className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--text-muted)' }}>Est. Delay</p>
            <p className="font-mono text-[11px] font-bold" style={{ color: "var(--text-primary)" }}>{avgDelay} min</p>
          </div>
          <div className="p-2 rounded" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
            <p className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--text-muted)' }}>Workload</p>
            <p className="font-mono text-[11px] font-bold" style={{ color: hs > 1 ? 'var(--risk-high)' : 'var(--risk-med)' }}>
              {hs > 1 ? 'HEAVY' : 'NORMAL'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
