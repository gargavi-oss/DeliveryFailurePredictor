import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
  AreaChart, Area
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '8px 12px', boxShadow: 'var(--shadow-md)',
    }}>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 12, fontWeight: 700, color: p.color || 'var(--text-primary)' }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function ChartsPanel({ stops }) {
  if (!stops || stops.length === 0) return null;

  const riskCounts = [
    { name: "HIGH", value: stops.filter(s => s.risk === "HIGH").length, color: "#dc2626" },
    { name: "MEDIUM", value: stops.filter(s => s.risk === "MEDIUM").length, color: "#d97706" },
    { name: "LOW", value: stops.filter(s => s.risk === "LOW").length, color: "#16a34a" },
  ];

  const bins = [
    { range: "0-20%", count: 0, color: "#16a34a" },
    { range: "20-40%", count: 0, color: "#65a30d" },
    { range: "40-60%", count: 0, color: "#d97706" },
    { range: "60-80%", count: 0, color: "#ea580c" },
    { range: "80-100%", count: 0, color: "#dc2626" },
  ];
  stops.forEach(s => {
    const p = s.prob;
    if (p < 0.2) bins[0].count++;
    else if (p < 0.4) bins[1].count++;
    else if (p < 0.6) bins[2].count++;
    else if (p < 0.8) bins[3].count++;
    else bins[4].count++;
  });

  const trend = stops.map(s => ({
    stop: `Stop ${s.id}`,
    risk: +(s.prob * 100).toFixed(1),
    traffic: +(s.traffic_index * 100).toFixed(1),
  }));

  const axisStyle = { stroke: '#9ca3af', fontSize: 10, tickLine: false, axisLine: false };
  const maxRisk = Math.max(...riskCounts.map(r => r.value), 1);
  const maxBin = Math.max(...bins.map(b => b.count), 1);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>

      {/* Risk Distribution */}
      <div className="card" style={{ padding: 16 }}>
        <ChartTitle icon="📊" text="Risk Distribution" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={riskCounts} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="name" {...axisStyle} />
            <YAxis {...axisStyle} allowDecimals={false} domain={[0, maxRisk + 1]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={42} name="Count">
              {riskCounts.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Failure Probability Histogram */}
      <div className="card" style={{ padding: 16 }}>
        <ChartTitle icon="📈" text="Failure Probability" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={bins} barCategoryGap="12%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="range" {...axisStyle} fontSize={9} />
            <YAxis {...axisStyle} allowDecimals={false} domain={[0, maxBin + 1]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={36} name="Deliveries">
              {bins.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk vs Traffic Trend */}
      {trend.length > 1 && (
        <div className="card" style={{ padding: 16 }}>
          <ChartTitle icon="🔄" text="Risk vs Traffic" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="stop" {...axisStyle} />
              <YAxis {...axisStyle} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="risk" stroke="#dc2626" strokeWidth={2.5}
                fill="url(#riskGrad)" name="Risk %"
                dot={{ r: 4, fill: '#dc2626', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#dc2626' }}
              />
              <Area type="monotone" dataKey="traffic" stroke="#2563eb" strokeWidth={2}
                fill="url(#trafficGrad)" name="Traffic %"
                dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#2563eb' }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />
              Risk
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
              Traffic
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ChartTitle({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{text}</h3>
    </div>
  );
}