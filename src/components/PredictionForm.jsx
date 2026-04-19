import axios from "axios";
import { useState } from "react";

export default function PredictionForm({ setResult, setStops }) {
  const [formValues, setFormValues] = useState({});
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("form");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { ...formValues };
    ["distance_km","order_volume","delivery_cost","traffic_index","hub_dwell_minutes","driver_delay_rate","vehicle_reliability","time_buffer_hours"]
      .forEach(k => data[k] = Number(data[k]));

    try {
      const res = await axios.post("http://127.0.0.1:8001/predict", data);
      setResult(res.data);
      setStops(prev => [...prev, {
        id: prev.length + 1,
        lat: 28.6 + Math.random() * 0.25,
        lng: 77.2 + Math.random() * 0.25,
        prob: res.data.failure_probability,
        risk: res.data.risk_level,
        traffic_index: data.traffic_index
      }]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const update = (k, v) => setFormValues({ ...formValues, [k]: v });

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    outline: 'none',
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    paddingRight: '28px',
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: 16 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>New Delivery</h3>
        <button type="button" onClick={() => setMode(mode === "form" ? "json" : "form")}
          style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 6, cursor: 'pointer',
            background: 'var(--bg-subtle)', color: 'var(--text-muted)',
            border: '1px solid var(--border)',
          }}
        >
          {mode === "form" ? "{ } JSON" : "📝 Form"}
        </button>
      </div>

      {mode === "json" ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Paste delivery JSON...'
            style={{
              ...inputStyle, height: 140, resize: 'none',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            }}
          />
          <button type="button"
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: 12,
            }}
            onClick={() => { try { setFormValues(JSON.parse(jsonInput)); setMode("form"); } catch { alert("Invalid JSON"); } }}
          >
            Apply & Switch to Form
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Date */}
          <input type="datetime-local" value={formValues.delivery_time || ""}
            onChange={e => update("delivery_time", e.target.value)}
            style={inputStyle} required
          />

          {/* Numeric fields - 2 col */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              ["distance_km","Distance (km)"],["order_volume","Volume"],
              ["delivery_cost","Cost (₹)"],["traffic_index","Traffic (0-1)"],
              ["hub_dwell_minutes","Hub Dwell (min)"],["driver_delay_rate","Delay Rate"],
              ["vehicle_reliability","Reliability"],["time_buffer_hours","Buffer (hrs)"]
            ].map(([k, l]) => (
              <input key={k} placeholder={l} value={formValues[k] || ""}
                onChange={e => update(k, e.target.value)}
                style={inputStyle} required
              />
            ))}
          </div>

          {/* Dropdowns - 2 col */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              ["delivery_partner",["amazon","flipkart","dhl"]],
              ["package_type",["fragile","standard","heavy"]],
              ["vehicle_type",["bike","van","truck"]],
              ["delivery_mode",["express","normal"]],
              ["region",["urban","semi-urban","rural"]],
              ["weather_condition",["clear","rain","fog"]]
            ].map(([f, opts]) => (
              <select key={f} value={formValues[f] || opts[0]}
                onChange={e => update(f, e.target.value)} style={selectStyle}>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={loading}
        style={{
          width: '100%', marginTop: 12, padding: '10px 20px',
          borderRadius: 10, border: 'none', cursor: loading ? 'wait' : 'pointer',
          background: 'var(--accent)', color: '#fff',
          fontWeight: 600, fontSize: 13, fontFamily: 'Inter, sans-serif',
          opacity: loading ? 0.6 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
      {loading ? (
  <span className="flex items-center gap-2 text-red-500">
    <span className="w-3 h-3 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
    Analyzing...
  </span>
) : (
  "⚡ Predict Risk"
)}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}