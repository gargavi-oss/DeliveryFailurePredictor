import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// Layout
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import FleetManagement from "./pages/FleetManagement";
import WeatherDashboard from "./pages/WeatherDashboard";
import AlertCenter from "./pages/AlertCenter";
import Settings from "./pages/Settings";

function AppContent() {
  const location = useLocation();
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true; // default dark for SaaS
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Public routes (no sidebar)
  const isPublicRoute = location.pathname === "/" || location.pathname === "/login";

  if (isPublicRoute) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    );
  }

  // App layout (sidebar + topbar)
  return (
    <div className="app-layout">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="app-main" style={{ marginLeft: sidebarCollapsed ? 68 : 240 }}>
        <TopBar dark={dark} setDark={setDark} />
        <div className="app-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/fleet" element={<FleetManagement />} />
            <Route path="/weather" element={<WeatherDashboard />} />
            <Route path="/alerts" element={<AlertCenter />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}