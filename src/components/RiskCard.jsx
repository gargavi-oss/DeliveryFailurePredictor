import { motion } from "framer-motion";

export default function RiskCard({ result }) {
  const cfg = {
    HIGH:   { color: 'var(--risk-high)', bg: 'var(--risk-high-bg)', icon: '🔴' },
    MEDIUM: { color: 'var(--risk-med)',  bg: 'var(--risk-med-bg)',  icon: '🟡' },
    LOW:    { color: 'var(--risk-low)',  bg: 'var(--risk-low-bg)',  icon: '🟢' },
  };
  const c = cfg[result.risk_level] || cfg.LOW;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card overflow-hidden"
    >
      <div className="h-1" style={{ background: c.color }} />
      <div className="p-4 space-y-3">

        <div className="flex items-center justify-between">
          <div>
            <p className="section-label mb-1">Risk Assessment</p>
            <div className="flex items-center gap-2">
              <span>{c.icon}</span>
              <h3 className="text-xl font-bold" style={{ color: c.color }}>{result.risk_level}</h3>
            </div>
          </div>

          {/* Ring */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="var(--border)" strokeWidth="3" />
              <circle cx="24" cy="24" r="20" fill="none" stroke={c.color} strokeWidth="3"
                strokeLinecap="round" strokeDasharray={`${result.failure_probability * 125.6} 125.6`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                {(result.failure_probability * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <MiniCard label="Action" value={result.recommended_action} />
          <MiniCard label="Priority" value={result.route_priority} />
        </div>

        {result.explanation && (
          <div className="rounded-lg p-2.5" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
            <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>💡 {result.explanation}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MiniCard({ label, value }) {
  return (
    <div className="rounded-lg p-2" style={{ background: 'var(--bg-subtle)' }}>
      <p className="text-[9px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-[11px] font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{value}</p>
    </div>
  );
}