export default function InsightPanel({ stops, beforeRoute }) {
  if (!stops || stops.length === 0) return null;

  const high = stops.filter(s => s.risk === "HIGH");
  const avgRisk = stops.reduce((a, b) => a + b.prob, 0) / stops.length;
  const critical = stops.reduce((m, s) => s.prob > m.prob ? s : m);

  let moved = "";
  if (beforeRoute?.length) {
    const bi = beforeRoute.findIndex(s => s.id === critical.id);
    const ai = stops.findIndex(s => s.id === critical.id);
    if (ai < bi) moved = `Stop ${critical.id} moved earlier`;
  }

  return (
    <div className="card p-4 h-1/2 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">🧠</span>
        <h3 className="text-xs font-semibold accent-text">AI Insights</h3>
        {high.length > 0 && <span className="risk-badge high ml-auto">{high.length} alert{high.length > 1 ? 's' : ''}</span>}
      </div>

      <div className="space-y-1.5 flex-1 text-[11px]">
        <Row icon="⚠️" text={`${high.length} high-risk deliver${high.length === 1 ? 'y' : 'ies'}`} color="var(--risk-high)" urgent={high.length > 0} />
        <Row icon="📊" text={`Avg risk: ${(avgRisk * 100).toFixed(1)}%`} color={avgRisk > 0.6 ? 'var(--risk-med)' : 'var(--risk-low)'} />
        <Row icon="🔍" text={`Critical: Stop ${critical.id} (${(critical.prob * 100).toFixed(0)}%)`} color="var(--risk-high)" />
        {moved && <Row icon="📍" text={moved} color="var(--accent)" />}
        <Row icon="🎯" text="Risk → Traffic → Distance" color="var(--text-secondary)" />
      </div>
    </div>
  );
}

function Row({ icon, text, color, urgent }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
      style={{
        background: urgent ? 'var(--risk-high-bg)' : 'transparent',
      }}
    >
      <span className="text-xs flex-shrink-0">{icon}</span>
      <span style={{ color }}>{text}</span>
    </div>
  );
}