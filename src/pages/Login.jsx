import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock auth — just navigate to dashboard
    localStorage.setItem("deliveryai_user", JSON.stringify({ email, name: "Avi Garg" }));
    navigate("/dashboard");
  };

  const handleDemo = () => {
    localStorage.setItem("deliveryai_user", JSON.stringify({ email: "demo@deliveryai.com", name: "Demo User" }));
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left - branding */}
        <div className="login-brand">
          <div className="login-brand-inner">
            <div className="login-brand-logo">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl text-white"
                style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}>🚚</div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Delivery<span style={{ color: "#60a5fa" }}>AI</span>
                </h1>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest">Intelligence Platform</p>
              </div>
            </div>
            <div className="login-brand-stats">
              <div className="login-brand-stat">
                <span className="login-brand-stat-val">25K+</span>
                <span className="login-brand-stat-label">Daily predictions</span>
              </div>
              <div className="login-brand-stat">
                <span className="login-brand-stat-val">40%</span>
                <span className="login-brand-stat-label">Fewer failures</span>
              </div>
              <div className="login-brand-stat">
                <span className="login-brand-stat-val">120+</span>
                <span className="login-brand-stat-label">Companies</span>
              </div>
            </div>
            <p className="text-xs text-blue-100/70 mt-6 leading-relaxed">
              "DeliveryAI reduced our last-mile failures by 38% in the first month. 
              The route optimization alone saved us ₹12 lakhs."
            </p>
            <p className="text-[10px] text-blue-200/50 mt-2">— Logistics Head, BlueDart</p>
          </div>
          <div className="login-brand-glow" />
        </div>

        {/* Right - form */}
        <div className="login-form-wrapper">
          <div className="login-form-inner">
            <h2 className="login-form-title">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h2>
            <p className="login-form-sub">
              {isSignUp ? "Start your free trial today" : "Sign in to your dashboard"}
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              {isSignUp && (
                <div className="login-field">
                  <label>Full Name</label>
                  <input type="text" placeholder="Enter your name" required />
                </div>
              )}
              <div className="login-field">
                <label>Email</label>
                <input type="email" placeholder="name@company.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="login-field">
                <label>Password</label>
                <input type="password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              <button type="submit" className="login-submit">
                {isSignUp ? "Create Account" : "Sign In"} →
              </button>
            </form>

            <div className="login-divider">
              <span>or</span>
            </div>

            <button onClick={handleDemo} className="login-demo-btn">
              🚀 Launch Demo Mode
            </button>

            <p className="login-switch">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Sign in" : "Sign up free"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
