import { useState } from "react";
import PredictionForm from "../components/PredictionForm";
import RiskCard from "../components/RiskCard";
import MapView from "../components/MapView";
import RouteOptimizer from "../components/RouteOptimizer";
import ChartsPanel from "../components/ChartsPanel";
import InsightPanel from "../components/InsightPanel";
import Chatbot from "../components/Chatbot";

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [stops, setStops] = useState([]);
  const [beforeRoute, setBeforeRoute] = useState([]);
  const [activeTab, setActiveTab] = useState("predict");
  const [demoLoaded, setDemoLoaded] = useState(false);

  // 🔥 Load demo data on button click
  const loadDemo = () => {
    setStops([
      { id: 1, lat: 28.61, lng: 77.20, prob: 0.92, risk: "HIGH", traffic_index: 0.9 },
      { id: 2, lat: 28.70, lng: 77.25, prob: 0.65, risk: "MEDIUM", traffic_index: 0.6 },
      { id: 3, lat: 28.55, lng: 77.10, prob: 0.30, risk: "LOW", traffic_index: 0.4 },
      { id: 4, lat: 28.48, lng: 77.30, prob: 0.80, risk: "HIGH", traffic_index: 0.8 },
      { id: 5, lat: 28.66, lng: 77.18, prob: 0.50, risk: "MEDIUM", traffic_index: 0.5 }
    ]);
    setDemoLoaded(true);
  };

  // 📊 Stats
  const highRisk = stops.filter(s => s.risk === "HIGH").length;
  const medRisk = stops.filter(s => s.risk === "MEDIUM").length;
  const lowRisk = stops.filter(s => s.risk === "LOW").length;
  const avgRisk = stops.length
    ? stops.reduce((a, b) => a + b.prob, 0) / stops.length
    : 0;

  return (
    <div className="max-w-[1360px] mx-auto px-6 py-6">

      {/* ─── HEADER ─── */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Delivery <span className="accent-text">Intelligence</span>
          </h1>
          <p className="text-xs mt-1 text-[var(--text-muted)]">
            Real-time failure prediction • Route optimization • AI insights
          </p>
        </div>

        {/* DEMO BUTTON */}
        <button
          onClick={loadDemo}
          disabled={demoLoaded}
          className="px-3 py-1.5 text-xs rounded-lg border transition"
          style={{
            background: "var(--bg-subtle)",
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
            opacity: demoLoaded ? 0.6 : 1
          }}
        >
          {demoLoaded ? "Demo Loaded" : "Load Demo"}
        </button>
      </div>

      {/* ─── KPI ROW ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KPICard label="Total Stops" value={stops.length} />
        <KPICard label="High Risk" value={highRisk} variant="high" />
        <KPICard label="Medium Risk" value={medRisk} variant="med" />
        <KPICard label="Avg Score" value={`${(avgRisk * 100).toFixed(1)}%`} variant="accent" />
      </div>

      {/* ─── MAIN GRID ─── */}
      <div className="grid grid-cols-12 gap-4">

        {/* LEFT */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-3">

          {/* Tabs */}
          <div className="card p-1 flex gap-1">
            <TabBtn active={activeTab === "predict"} onClick={() => setActiveTab("predict")}>
              ⚡ Predict
            </TabBtn>
            <TabBtn active={activeTab === "route"} onClick={() => setActiveTab("route")}>
              🗺️ Routes
            </TabBtn>
          </div>

          {activeTab === "predict" ? (
            <PredictionForm setResult={setResult} setStops={setStops} />
          ) : (
            <RouteOptimizer
              stops={stops}
              setStops={setStops}
              setBeforeRoute={setBeforeRoute}
            />
          )}

          {result && <RiskCard result={result} />}
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-4">

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-1">
              <InsightPanel stops={stops} />
            </div>
            <div className="xl:col-span-2">
              <MapView stops={stops} beforeRoute={beforeRoute} />
            </div>
          </div>

          <ChartsPanel stops={stops} />
        </div>
      </div>

      <Chatbot />
    </div>
  );
}

/* ─── KPI CARD ─── */
function KPICard({ label, value, variant }) {
  const colorMap = {
    high: "var(--risk-high)",
    med: "var(--risk-med)",
    accent: "var(--accent)",
  };

  const valueColor = colorMap[variant] || "var(--text-primary)";

  return (
    <div className="card p-4">
      <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)] mb-1.5">
        {label}
      </p>
      <p className="text-xl font-bold font-mono" style={{ color: valueColor }}>
        {value}
      </p>
    </div>
  );
}

/* ─── TAB BUTTON ─── */
function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all"
      style={{
        background: active ? "var(--accent)" : "transparent",
        color: active ? "#fff" : "var(--text-muted)",
      }}
    >
      {children}
    </button>
  );
}