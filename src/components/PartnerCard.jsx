export default function PartnerCard({ partner }) {
  if (!partner) return null;

  const getGrade = (rate) =>
    rate >= 85 ? "A+" : rate >= 75 ? "A" : rate >= 65 ? "B" : rate >= 55 ? "C" : "D";

  const gradeColor = (rate) =>
    rate >= 85 ? "var(--risk-low)" : rate >= 75 ? "#22d3ee" : rate >= 65 ? "var(--risk-med)" : "var(--risk-high)";

  return (
    <div className="card p-4 space-y-3 partner-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
            🏢
          </div>
          <div>
            <p className="text-xs font-semibold capitalize"
              style={{ color: "var(--text-primary)" }}>
              {partner.delivery_partner}
            </p>
            <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>
              {partner.total} deliveries
            </p>
          </div>
        </div>
        <div className="text-center">
          <span className="text-sm font-bold font-mono"
            style={{ color: gradeColor(partner.success_rate) }}>
            {getGrade(partner.success_rate)}
          </span>
          <p className="text-[8px]" style={{ color: "var(--text-muted)" }}>Grade</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-1.5 rounded text-center" style={{ background: "var(--bg-subtle)" }}>
          <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>Success</p>
          <p className="text-[11px] font-bold font-mono"
            style={{ color: "var(--risk-low)" }}>
            {partner.success_rate}%
          </p>
        </div>
        <div className="p-1.5 rounded text-center" style={{ background: "var(--bg-subtle)" }}>
          <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>Avg Cost</p>
          <p className="text-[11px] font-bold font-mono"
            style={{ color: "var(--text-primary)" }}>
            ₹{partner.avg_cost}
          </p>
        </div>
        <div className="p-1.5 rounded text-center" style={{ background: "var(--bg-subtle)" }}>
          <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>Reliability</p>
          <p className="text-[11px] font-bold font-mono"
            style={{ color: "var(--accent)" }}>
            {partner.avg_reliability}%
          </p>
        </div>
      </div>

      {/* Success bar */}
      <div>
        <div className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--bg-subtle)" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${partner.success_rate}%`,
              background: gradeColor(partner.success_rate)
            }} />
        </div>
      </div>
    </div>
  );
}
