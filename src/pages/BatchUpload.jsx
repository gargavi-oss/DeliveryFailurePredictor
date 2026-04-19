import axios from "axios";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BatchUpload() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    const fd = new FormData(); fd.append("file", file);
    try { setLoading(true); const r = await axios.post("http://127.0.0.1:8001/predict-batch", fd); setData(r.data); }
    catch { alert("Upload failed"); }
    finally { setLoading(false); }
  };

  const getRisk = (p) => p > 0.7 ? "HIGH" : p > 0.4 ? "MEDIUM" : "LOW";

  const summary = data.length ? {
    total: data.length,
    high: data.filter(r => getRisk(r.failure_probability) === "HIGH").length,
    med: data.filter(r => getRisk(r.failure_probability) === "MEDIUM").length,
    low: data.filter(r => getRisk(r.failure_probability) === "LOW").length,
    avg: (data.reduce((a, r) => a + r.failure_probability, 0) / data.length * 100).toFixed(1),
  } : null;

  return (
    <div className="max-w-[1360px] mx-auto px-6 py-6 space-y-6">

      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Batch <span className="accent-text">Prediction</span>
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Upload CSV to predict delivery failure risk across multiple orders</p>
      </div>

      {/* Upload */}
      <div className="card p-8 text-center transition-all"
        style={{ borderColor: dragOver ? 'var(--accent)' : undefined, background: dragOver ? 'var(--accent-light)' : undefined }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); }}
      >
        <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl"
          style={{ background: 'var(--bg-subtle)' }}>📁</div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {dragOver ? "Drop your CSV here" : "Drag & drop CSV file"}
        </p>
        <p className="text-xs mt-1 mb-4" style={{ color: 'var(--text-muted)' }}>or click to browse</p>
        <button type="button" onClick={() => fileRef.current?.click()} className="btn-primary !w-auto !inline-flex px-6 text-sm">
          Choose File
        </button>
        <input ref={fileRef} type="file" accept=".csv" onChange={e => processFile(e.target.files[0])} className="hidden" />
        {fileName && (
          <p className="text-xs mt-3 font-mono" style={{ color: 'var(--risk-low)' }}>✓ {fileName}</p>
        )}
        {loading && <p className="text-xs mt-3 accent-text">Processing...</p>}
      </div>

      {/* Summary */}
      <AnimatePresence>
        {summary && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <SC label="Total" value={summary.total} />
            <SC label="High Risk" value={summary.high} color="var(--risk-high)" />
            <SC label="Medium" value={summary.med} color="var(--risk-med)" />
            <SC label="Low Risk" value={summary.low} color="var(--risk-low)" />
            <SC label="Avg Risk" value={`${summary.avg}%`} color="var(--accent)" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <AnimatePresence>
        {data.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Results</h2>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{data.length} rows</span>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {["#", "Probability", "Risk", "Severity"].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => {
                  const risk = getRisk(row.failure_probability);
                  const prob = (row.failure_probability * 100).toFixed(1);
                  const riskColor = risk === "HIGH" ? 'var(--risk-high)' : risk === "MEDIUM" ? 'var(--risk-med)' : 'var(--risk-low)';
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
                      className="transition-colors hover:opacity-80">
                      <td className="px-5 py-3 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
                            <div className="h-full rounded-full" style={{ width: `${prob}%`, background: riskColor }} />
                          </div>
                          <span className="text-xs font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{prob}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3"><span className={`risk-badge ${risk.toLowerCase()}`}>{risk}</span></td>
                      <td className="px-5 py-3">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(d => (
                            <div key={d} className="w-1.5 h-1.5 rounded-full"
                              style={{ background: d <= Math.ceil(row.failure_probability * 5) ? riskColor : 'var(--border)' }} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SC({ label, value, color }) {
  return (
    <div className="card p-3">
      <p className="section-label mb-1">{label}</p>
      <p className="text-lg font-bold font-mono" style={{ color: color || 'var(--text-primary)' }}>{value}</p>
    </div>
  );
}