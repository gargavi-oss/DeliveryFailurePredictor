import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import BatchUpload from "./pages/BatchUpload";

function AppContent() {
  const location = useLocation();
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const isActive = (p) => location.pathname === p;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* ─── NAVBAR ─── */}
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        }}
      >
        <div className="max-w-[1360px] mx-auto px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-white"
              style={{ background: '#dc2626' }}
            >
              🚚
            </div>
            <div>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Delivery<span className="accent-text">AI</span>
              </span>
              <span className="block text-[8px] font-medium uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                Intelligence
              </span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <NavLink to="/" active={isActive("/")}>Dashboard</NavLink>
            <NavLink to="/batch" active={isActive("/batch")}>Batch</NavLink>

            {/* Divider */}
            <div className="w-px h-5 mx-2" style={{ background: 'var(--border)' }} />

            {/* Theme toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
              }}
              title={dark ? "Switch to Light" : "Switch to Dark"}
            >
              {dark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: 'var(--text-secondary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: 'var(--text-secondary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Live */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'var(--risk-low-bg)' }}
            >
              <div className="live-dot" />
              <span className="text-[10px] font-semibold" style={{ color: 'var(--risk-low)' }}>Live</span>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/batch" element={<BatchUpload />} />
      </Routes>
    </div>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
      style={{
        background: active ? '#dc2626' : 'transparent',
        color: active ? '#ffffff' : '#6b7280',
      }}
    >
      {children}
    </Link>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}