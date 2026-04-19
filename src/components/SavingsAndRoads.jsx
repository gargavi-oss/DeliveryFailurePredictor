export default function SavingsAndRoads({ stops }) {
  if (!stops || stops.length === 0) return null;

  // Calculate Money Saved. For each high risk stop predicted, assume we save ~₹500 in failed delivery costs
  const highRiskCount = stops.filter(s => s.risk === "HIGH").length;
  const moneySaved = highRiskCount * 500 + stops.length * 50;

  // Mocking average road conditions based on traffic and risk
  const avgTraffic = stops.reduce((acc, curr) => acc + (curr.traffic_index || 0.5), 0) / stops.length;
  const isThin = avgTraffic > 0.7;
  const roadCondition = isThin ? "Thin & Congested" : "Broad & Clear";
  const expectedSpeed = isThin ? "15-25 km/h" : "40-55 km/h";

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[14px]">💰</span>
        <h3 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Economics & Route</h3>
      </div>
      
      <div className="space-y-3 pt-1">
        <div className="p-2 rounded flex justify-between items-center" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <p className="text-[10px] font-semibold" style={{ color: 'var(--text-primary)' }}>Money Saved</p>
          <p className="font-mono font-bold text-lg" style={{ color: "var(--risk-low)" }}>₹{moneySaved}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
            <p className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--text-muted)' }}>Road Condition</p>
            <p className="text-[10px] font-semibold" style={{ color: "var(--text-primary)" }}>{roadCondition}</p>
          </div>
          <div className="p-2 rounded" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
            <p className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--text-muted)' }}>Max Speed</p>
            <p className="font-mono font-bold" style={{ color: "var(--text-secondary)" }}>
              {expectedSpeed}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
