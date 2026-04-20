import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Landing() {
  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm text-white"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}>🚚</div>
            <div>
              <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                Delivery<span className="accent-text">AI</span>
              </span>
              <span className="block text-[8px] font-medium uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}>Intelligence Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="landing-nav-link">Log In</Link>
            <Link to="/dashboard" className="landing-nav-cta">Start Free →</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-badge">
            <span className="landing-badge-dot" />
            Trusted by 120+ logistics companies
          </div>
          <h1 className="landing-h1">
            Predict Delivery Failures<br />
            <span className="landing-h1-accent">Before They Happen</span>
          </h1>
          <p className="landing-subtitle">
            AI-powered last-mile intelligence that cuts delivery failures by 40%,
            saves ₹500+ per failed stop, and optimizes routes in real-time.
          </p>
          <div className="landing-hero-actions">
            <Link to="/dashboard" className="landing-btn-primary">
              Launch Dashboard →
            </Link>
            <Link to="/login" className="landing-btn-secondary">
              Watch Demo
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="landing-hero-stats">
            <HeroStat value="25K+" label="Predictions/day" />
            <HeroStat value="40%" label="Fewer failures" />
            <HeroStat value="₹2.4Cr" label="Saved annually" />
            <HeroStat value="98.5%" label="Model accuracy" />
          </div>
        </div>

        {/* Glow effects */}
        <div className="landing-glow landing-glow-1" />
        <div className="landing-glow landing-glow-2" />
      </section>

      {/* FEATURES */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <h2 className="landing-h2">Everything you need for<br /><span className="accent-text">smarter deliveries</span></h2>
          <div className="landing-features-grid">
            <FeatureCard icon="⚡" title="Risk Prediction"
              desc="ML-powered failure probability scoring for every delivery stop before dispatch." />
            <FeatureCard icon="🗺️" title="Route Optimization"
              desc="Automatic route resequencing that prioritizes high-risk stops for early delivery." />
            <FeatureCard icon="🌦️" title="Weather Intelligence"
              desc="Real-time weather overlays that adjust risk scores based on conditions." />
            <FeatureCard icon="📊" title="Analytics Dashboard"
              desc="Comprehensive analytics with trends, partner comparison, and regional heatmaps." />
            <FeatureCard icon="🚛" title="Fleet Management"
              desc="Vehicle reliability tracking, driver leaderboards, and maintenance alerts." />
            <FeatureCard icon="🤖" title="AI Assistant"
              desc="Natural language chatbot for instant logistics insights and recommendations." />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-section" style={{ background: "var(--bg-subtle)" }}>
        <div className="landing-section-inner">
          <h2 className="landing-h2">How it works</h2>
          <div className="landing-steps">
            <Step num="1" title="Upload Data" desc="Feed historical delivery records, geocodes, and partner data." />
            <Step num="2" title="AI Analysis" desc="Our XGBoost + SHAP engine scores every stop for failure risk." />
            <Step num="3" title="Route Resequence" desc="Routes auto-optimize to handle high-risk stops early." />
            <Step num="4" title="Save Money" desc="Reduce failed deliveries by 40% and save ₹500+ per stop." />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <h2 className="landing-h2">Simple, transparent pricing</h2>
          <div className="landing-pricing-grid">
            <PricingCard
              name="Starter" price="Free" period=""
              features={["500 predictions/month", "Basic analytics", "1 user", "Email support"]}
              cta="Get Started" highlighted={false}
            />
            <PricingCard
              name="Pro" price="₹4,999" period="/month"
              features={["25,000 predictions/month", "Full analytics suite", "10 users", "API access", "Priority support", "Custom alerts"]}
              cta="Start Free Trial" highlighted={true}
            />
            <PricingCard
              name="Enterprise" price="Custom" period=""
              features={["Unlimited predictions", "Dedicated infrastructure", "SSO & RBAC", "SLA guarantee", "Custom integrations", "24/7 support"]}
              cta="Contact Sales" highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="flex items-center gap-2">
            <span className="text-sm">🚚</span>
            <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
              Delivery<span className="accent-text">AI</span>
            </span>
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            © 2025 DeliveryAI. Built for the future of logistics.
          </p>
        </div>
      </footer>
    </div>
  );
}

function HeroStat({ value, label }) {
  return (
    <div className="landing-hero-stat">
      <p className="landing-hero-stat-value">{value}</p>
      <p className="landing-hero-stat-label">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="landing-feature-card">
      <div className="landing-feature-icon">{icon}</div>
      <h3 className="landing-feature-title">{title}</h3>
      <p className="landing-feature-desc">{desc}</p>
    </div>
  );
}

function Step({ num, title, desc }) {
  return (
    <div className="landing-step">
      <div className="landing-step-num">{num}</div>
      <h3 className="landing-step-title">{title}</h3>
      <p className="landing-step-desc">{desc}</p>
    </div>
  );
}

function PricingCard({ name, price, period, features, cta, highlighted }) {
  return (
    <div className={`landing-pricing-card ${highlighted ? "highlighted" : ""}`}>
      {highlighted && <div className="landing-pricing-badge">Most Popular</div>}
      <h3 className="landing-pricing-name">{name}</h3>
      <div className="landing-pricing-price">
        <span>{price}</span>
        {period && <span className="landing-pricing-period">{period}</span>}
      </div>
      <ul className="landing-pricing-features">
        {features.map((f, i) => (
          <li key={i}>✓ {f}</li>
        ))}
      </ul>
      <Link to="/dashboard"
        className={highlighted ? "landing-btn-primary w-full" : "landing-btn-secondary w-full"}
        style={{ textAlign: "center", display: "block" }}>
        {cta}
      </Link>
    </div>
  );
}
