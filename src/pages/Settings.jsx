import { useState } from "react";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [riskThresholds, setRiskThresholds] = useState({ high: 70, medium: 45 });
  const [notifications, setNotifications] = useState({
    email: true, push: true, sms: false,
    highRisk: true, weather: true, sla: false
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: "profile", icon: "👤", label: "Profile" },
    { id: "notifications", icon: "🔔", label: "Notifications" },
    { id: "thresholds", icon: "🎚️", label: "Risk Thresholds" },
    { id: "api", icon: "🔑", label: "API Keys" },
    { id: "export", icon: "📥", label: "Export Data" },
    { id: "appearance", icon: "🎨", label: "Appearance" },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your DeliveryAI platform preferences</p>
        </div>
        {saved && (
          <span className="text-xs px-3 py-1.5 rounded-lg font-semibold"
            style={{ background: "var(--risk-low-bg)", color: "var(--risk-low)" }}>
            ✓ Saved successfully
          </span>
        )}
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <div className="card overflow-hidden">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium transition-colors text-left"
                style={{
                  background: activeSection === s.id ? "var(--accent-soft)" : "transparent",
                  color: activeSection === s.id ? "var(--accent)" : "var(--text-secondary)",
                  borderBottom: "1px solid var(--border)"
                }}>
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="col-span-12 lg:col-span-9">
          {activeSection === "profile" && (
            <div className="card p-6 space-y-5">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Profile Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingField label="Full Name" value="Avi Garg" />
                <SettingField label="Email" value="avi@deliveryai.com" />
                <SettingField label="Company" value="Productivity Technologies" />
                <SettingField label="Role" value="Admin" />
              </div>
              <button onClick={handleSave} className="btn-primary text-xs !w-auto px-6">Save Changes</button>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="card p-6 space-y-5">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Notification Preferences</h2>
              <div className="space-y-3">
                <h3 className="text-[10px] uppercase font-semibold tracking-wider"
                  style={{ color: "var(--text-muted)" }}>Channels</h3>
                <Toggle label="Email notifications" checked={notifications.email}
                  onChange={v => setNotifications({ ...notifications, email: v })} />
                <Toggle label="Push notifications" checked={notifications.push}
                  onChange={v => setNotifications({ ...notifications, push: v })} />
                <Toggle label="SMS alerts" checked={notifications.sms}
                  onChange={v => setNotifications({ ...notifications, sms: v })} />
              </div>
              <div className="space-y-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                <h3 className="text-[10px] uppercase font-semibold tracking-wider"
                  style={{ color: "var(--text-muted)" }}>Alert Types</h3>
                <Toggle label="High risk delivery alerts" checked={notifications.highRisk}
                  onChange={v => setNotifications({ ...notifications, highRisk: v })} />
                <Toggle label="Weather warnings" checked={notifications.weather}
                  onChange={v => setNotifications({ ...notifications, weather: v })} />
                <Toggle label="SLA breach alerts" checked={notifications.sla}
                  onChange={v => setNotifications({ ...notifications, sla: v })} />
              </div>
              <button onClick={handleSave} className="btn-primary text-xs !w-auto px-6">Save Preferences</button>
            </div>
          )}

          {activeSection === "thresholds" && (
            <div className="card p-6 space-y-5">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Risk Threshold Configuration</h2>
              <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                Configure the failure probability thresholds that classify deliveries as High, Medium, or Low risk.
              </p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span style={{ color: "var(--risk-high)" }}>High Risk Threshold</span>
                    <span className="font-mono font-bold" style={{ color: "var(--risk-high)" }}>{riskThresholds.high}%</span>
                  </div>
                  <input type="range" min="50" max="90" value={riskThresholds.high}
                    onChange={e => setRiskThresholds({ ...riskThresholds, high: +e.target.value })}
                    className="w-full accent-red-500" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span style={{ color: "var(--risk-med)" }}>Medium Risk Threshold</span>
                    <span className="font-mono font-bold" style={{ color: "var(--risk-med)" }}>{riskThresholds.medium}%</span>
                  </div>
                  <input type="range" min="20" max="60" value={riskThresholds.medium}
                    onChange={e => setRiskThresholds({ ...riskThresholds, medium: +e.target.value })}
                    className="w-full accent-yellow-500" />
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ background: "var(--risk-high)" }} />
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      High ({riskThresholds.high}%+)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ background: "var(--risk-med)" }} />
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      Medium ({riskThresholds.medium}-{riskThresholds.high}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ background: "var(--risk-low)" }} />
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      Low (0-{riskThresholds.medium}%)
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary text-xs !w-auto px-6">Apply Thresholds</button>
            </div>
          )}

          {activeSection === "api" && (
            <div className="card p-6 space-y-5">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>API Key Management</h2>
              <div className="p-4 rounded-xl" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-semibold tracking-wider"
                      style={{ color: "var(--text-muted)" }}>Production Key</p>
                    <p className="text-xs font-mono mt-1" style={{ color: "var(--text-primary)" }}>
                      dai_prod_••••••••••••jK9m
                    </p>
                  </div>
                  <button className="text-[10px] px-3 py-1 rounded-lg"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                    Copy
                  </button>
                </div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-semibold tracking-wider"
                      style={{ color: "var(--text-muted)" }}>Test Key</p>
                    <p className="text-xs font-mono mt-1" style={{ color: "var(--text-primary)" }}>
                      dai_test_••••••••••••aB2x
                    </p>
                  </div>
                  <button className="text-[10px] px-3 py-1 rounded-lg"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                    Copy
                  </button>
                </div>
              </div>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Rate limit: 1,000 requests/minute • 25,000 predictions/month
              </p>
            </div>
          )}

          {activeSection === "export" && (
            <div className="card p-6 space-y-5">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Export Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: "Prediction History", desc: "All prediction logs with risk scores", icon: "📊" },
                  { label: "Route Optimizations", desc: "Before/after route comparison data", icon: "🗺️" },
                  { label: "Fleet Performance", desc: "Vehicle and driver analytics", icon: "🚛" },
                  { label: "Weather Correlation", desc: "Weather-delivery failure analysis", icon: "🌦️" },
                ].map((e, i) => (
                  <div key={i} className="p-4 rounded-xl flex items-center justify-between"
                    style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{e.icon}</span>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{e.label}</p>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{e.desc}</p>
                      </div>
                    </div>
                    <button className="text-[10px] px-3 py-1 rounded-lg font-semibold"
                      style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                      Export CSV
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="card p-6 space-y-5">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Appearance</h2>
              <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                Theme and display preferences. Use the theme toggle in the top bar to switch between light and dark mode.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl text-center cursor-pointer"
                  style={{ background: "#ffffff", border: "2px solid var(--accent)" }}>
                  <p className="text-xs font-semibold" style={{ color: "#0f172a" }}>☀️ Light</p>
                </div>
                <div className="p-4 rounded-xl text-center cursor-pointer"
                  style={{ background: "#0f172a", border: "2px solid var(--border)" }}>
                  <p className="text-xs font-semibold" style={{ color: "#f1f5f9" }}>🌙 Dark</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingField({ label, value }) {
  const [val, setVal] = useState(value);
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1.5"
        style={{ color: "var(--text-muted)" }}>{label}</label>
      <input type="text" value={val} onChange={e => setVal(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-xs"
        style={{
          background: "var(--bg-subtle)", border: "1px solid var(--border)",
          color: "var(--text-primary)", outline: "none"
        }} />
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs" style={{ color: "var(--text-primary)" }}>{label}</span>
      <button onClick={() => onChange(!checked)}
        className="w-9 h-5 rounded-full transition-colors relative"
        style={{ background: checked ? "var(--accent)" : "var(--bg-subtle)" }}>
        <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
          style={{ left: checked ? 18 : 2 }} />
      </button>
    </div>
  );
}
