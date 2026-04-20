import { NavLink } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { path: "/dashboard", icon: "📊", label: "Dashboard" },
  { path: "/analytics", icon: "📈", label: "Analytics" },
  { path: "/fleet", icon: "🚛", label: "Fleet" },
  { path: "/weather", icon: "🌦️", label: "Weather" },
  { path: "/alerts", icon: "🔔", label: "Alerts" },
  { path: "/settings", icon: "⚙️", label: "Settings" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className="sidebar"
      style={{ width: collapsed ? 68 : 240 }}
    >
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🚚</div>
          {!collapsed && (
            <div className="sidebar-logo-text">
              <span className="sidebar-brand">
                Delivery<span className="accent-text">AI</span>
              </span>
              <span className="sidebar-subtitle">Intelligence Platform</span>
            </div>
          )}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">
          {!collapsed && "MAIN MENU"}
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-link-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-plan-badge">
            <div className="sidebar-plan-dot" />
            <div>
              <span className="sidebar-plan-name">Pro Plan</span>
              <span className="sidebar-plan-info">25K predictions/mo</span>
            </div>
          </div>
        )}
        <div className="sidebar-user">
          <div className="sidebar-avatar">AG</div>
          {!collapsed && (
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">Avi Garg</span>
              <span className="sidebar-user-role">Admin</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
