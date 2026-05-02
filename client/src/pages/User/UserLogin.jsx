import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function UserLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      navigate("/home");
    }, 800);
  };

  return (
    <div className="ul-root">

      {/* ── BACKGROUND ── */}
      <div className="ul-bg">
        <div className="ul-blob ul-blob1" />
        <div className="ul-blob ul-blob2" />
        <div className="ul-blob ul-blob3" />
        <div className="ul-grid" />
      </div>

      {/* ── SPLIT LAYOUT ── */}
      <div className="ul-layout">

        {/* LEFT PANEL — desktop only */}
        <div className="ul-left">
          <div className="ul-left-inner">
            <div className="ul-brand">
              <span className="ul-brand-dot" />
              <span className="ul-brand-name">Om Enterprise</span>
            </div>

            <h2 className="ul-left-title">
              Premium<br />
              <span className="ul-left-accent">Beauty</span><br />
              Collection
            </h2>

            <p className="ul-left-desc">
              Explore our curated range of wholesale cosmetics
              and skincare products at the best prices.
            </p>

            <div className="ul-perks">
              <div className="ul-perk">
                <span className="ul-perk-icon">✨</span>
                <span>Premium quality products</span>
              </div>
              <div className="ul-perk">
                <span className="ul-perk-icon">💎</span>
                <span>Wholesale prices only</span>
              </div>
              <div className="ul-perk">
                <span className="ul-perk-icon">🛍</span>
                <span>Wide range of categories</span>
              </div>
            </div>

            <div className="ul-left-badge">
              ⚠ Wholesale Only — No Retail Sales
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — login form */}
        <div className="ul-right">
          <div className="ul-card">

            {/* Mobile-only brand */}
            <div className="ul-mobile-brand">
              <span className="ul-brand-dot" />
              <span className="ul-brand-name">Om Enterprise</span>
            </div>
            <div className="ul-mobile-divider" />

            <div className="ul-welcome-tag">✦ Welcome Back</div>
            <h1 className="ul-title">Sign In</h1>
            <p className="ul-subtitle">Access the wholesale catalogue</p>

            <form onSubmit={handleLogin} className="ul-form">

              <div className="ul-field">
                <label className="ul-label">Email</label>
                <div className="ul-input-wrap">
                  <span className="ul-input-icon">✉</span>
                  <input
                    className="ul-input"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="ul-field">
                <label className="ul-label">Password</label>
                <div className="ul-input-wrap">
                  <span className="ul-input-icon">🔒</span>
                  <input
                    className="ul-input"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="ul-eye"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="ul-error">⚠ {error}</div>
              )}

              <button type="submit" className="ul-btn" disabled={loading}>
                {loading ? (
                  <span className="ul-spinner" />
                ) : (
                  <>Sign In <span className="ul-btn-arrow">→</span></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="ul-or">
              <span className="ul-or-line" />
              <span className="ul-or-text">New here?</span>
              <span className="ul-or-line" />
            </div>

            <Link to="/signup" className="ul-signup-btn">
              Create an Account
            </Link>

            <p className="ul-footer-note">
              🛍 Wholesale enquiries only — Not for retail buyers
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ul-root {
          min-height: 100vh;
          background: #0f0f13;
          display: flex;
          align-items: stretch;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* BG */
        .ul-bg {
          position: fixed;
          inset: 0; z-index: 0;
          pointer-events: none;
        }
        .ul-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.13;
        }
        .ul-blob1 {
          width: 500px; height: 500px;
          background: #e8b86d;
          top: -140px; right: -100px;
          animation: blobFloat 9s ease-in-out infinite;
        }
        .ul-blob2 {
          width: 420px; height: 420px;
          background: #c87b5a;
          bottom: -120px; left: -120px;
          animation: blobFloat 11s ease-in-out infinite reverse;
        }
        .ul-blob3 {
          width: 260px; height: 260px;
          background: #5a8ac8;
          top: 40%; right: 35%;
          animation: blobFloat 14s ease-in-out infinite;
        }
        @keyframes blobFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(22px,-22px) scale(1.06); }
        }
        .ul-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* LAYOUT */
        .ul-layout {
          position: relative; z-index: 1;
          display: flex; width: 100%; min-height: 100vh;
        }

        /* LEFT — desktop only */
        .ul-left {
          display: none;
          flex: 1;
          background: linear-gradient(160deg, rgba(232,184,109,0.07), rgba(90,138,200,0.05));
          border-right: 1px solid rgba(255,255,255,0.06);
          padding: 60px 56px;
          flex-direction: column;
          justify-content: center;
        }
        .ul-left-inner { max-width: 420px; }

        .ul-brand {
          display: flex; align-items: center;
          gap: 10px; margin-bottom: 52px;
        }
        .ul-brand-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #e8b86d;
          box-shadow: 0 0 14px #e8b86d;
        }
        .ul-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700;
          color: #f0ece4; letter-spacing: 0.5px;
        }

        .ul-left-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 3.2vw, 50px);
          font-weight: 900; color: #f0ece4;
          line-height: 1.12; margin-bottom: 20px;
        }
        .ul-left-accent { color: #e8b86d; font-style: italic; }

        .ul-left-desc {
          font-size: 15px;
          color: rgba(240,236,228,0.48);
          line-height: 1.8; margin-bottom: 36px;
        }

        .ul-perks {
          display: flex; flex-direction: column;
          gap: 16px; margin-bottom: 40px;
        }
        .ul-perk {
          display: flex; align-items: center;
          gap: 14px; font-size: 14px;
          color: rgba(240,236,228,0.65);
        }
        .ul-perk-icon {
          font-size: 17px;
          width: 38px; height: 38px;
          background: rgba(232,184,109,0.09);
          border: 1px solid rgba(232,184,109,0.18);
          border-radius: 10px;
          display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
        }

        .ul-left-badge {
          display: inline-block;
          font-size: 11px; font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase;
          color: #e8b86d;
          border: 1px solid rgba(232,184,109,0.28);
          border-radius: 20px; padding: 6px 16px;
        }

        /* RIGHT */
        .ul-right {
          flex: 0 0 100%;
          display: flex; align-items: center;
          justify-content: center; padding: 32px 20px;
        }

        .ul-card {
          width: 100%; max-width: 420px;
          background: #1c1c26;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 40px 32px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
          animation: cardIn 0.5s ease both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Mobile brand */
        .ul-mobile-brand {
          display: flex; align-items: center;
          gap: 10px; margin-bottom: 16px;
        }
        .ul-mobile-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(232,184,109,0.4), transparent);
          margin-bottom: 24px;
        }

        .ul-welcome-tag {
          font-size: 11px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          color: #e8b86d; margin-bottom: 10px;
        }
        .ul-title {
          font-family: 'Playfair Display', serif;
          font-size: 30px; font-weight: 900;
          color: #f0ece4; margin-bottom: 6px;
        }
        .ul-subtitle {
          font-size: 14px;
          color: rgba(240,236,228,0.4);
          margin-bottom: 28px;
        }

        /* FORM */
        .ul-form { display: flex; flex-direction: column; gap: 18px; }
        .ul-field { display: flex; flex-direction: column; gap: 7px; }
        .ul-label {
          font-size: 11px; font-weight: 600;
          letter-spacing: 1.4px; text-transform: uppercase;
          color: rgba(240,236,228,0.42);
        }
        .ul-input-wrap {
          position: relative; display: flex; align-items: center;
        }
        .ul-input-icon {
          position: absolute; left: 14px;
          font-size: 15px; pointer-events: none; opacity: 0.4;
        }
        .ul-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px; padding: 13px 44px;
          color: #f0ece4;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; outline: none; transition: all 0.25s;
        }
        .ul-input::placeholder { color: rgba(240,236,228,0.2); }
        .ul-input:focus {
          border-color: rgba(232,184,109,0.5);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 3px rgba(232,184,109,0.1);
        }
        .ul-eye {
          position: absolute; right: 12px;
          background: none; border: none;
          cursor: pointer; font-size: 16px;
          opacity: 0.4; transition: opacity 0.2s; padding: 4px;
        }
        .ul-eye:hover { opacity: 1; }

        .ul-error {
          background: rgba(255,80,80,0.1);
          border: 1px solid rgba(255,80,80,0.25);
          border-radius: 10px; padding: 11px 14px;
          font-size: 13px; color: #ff8080;
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-6px); }
          75%      { transform: translateX(6px); }
        }

        .ul-btn {
          background: linear-gradient(135deg, #e8b86d, #d4a055);
          border: none; border-radius: 12px;
          padding: 15px; color: #0f0f13;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          cursor: pointer; transition: all 0.25s;
          display: flex; align-items: center;
          justify-content: center; gap: 8px; margin-top: 4px;
        }
        .ul-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(232,184,109,0.35);
        }
        .ul-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .ul-btn-arrow { font-size: 18px; transition: transform 0.2s; }
        .ul-btn:hover .ul-btn-arrow { transform: translateX(3px); }

        .ul-spinner {
          width: 20px; height: 20px;
          border: 2.5px solid rgba(15,15,19,0.3);
          border-top-color: #0f0f13; border-radius: 50%;
          animation: spin 0.7s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* OR divider */
        .ul-or {
          display: flex; align-items: center;
          gap: 12px; margin: 24px 0 16px;
        }
        .ul-or-line {
          flex: 1; height: 1px;
          background: rgba(255,255,255,0.08);
        }
        .ul-or-text {
          font-size: 12px;
          color: rgba(240,236,228,0.3);
          white-space: nowrap;
        }

        /* Signup button */
        .ul-signup-btn {
          display: block; width: 100%;
          text-align: center;
          padding: 13px;
          border-radius: 12px;
          border: 1px solid rgba(232,184,109,0.3);
          color: #e8b86d;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          text-decoration: none;
          transition: all 0.25s;
        }
        .ul-signup-btn:hover {
          background: rgba(232,184,109,0.08);
          border-color: rgba(232,184,109,0.55);
          transform: translateY(-1px);
        }

        .ul-footer-note {
          margin-top: 20px; text-align: center;
          font-size: 12px; color: rgba(240,236,228,0.25);
        }

        /* DESKTOP */
        @media (min-width: 900px) {
          .ul-left  { display: flex; }
          .ul-right { flex: 0 0 480px; padding: 48px 56px; }
          .ul-card  {
            background: transparent; border: none;
            border-radius: 0; box-shadow: none;
            padding: 0; max-width: 100%;
          }
          .ul-mobile-brand,
          .ul-mobile-divider { display: none; }
        }

        /* SMALL MOBILE */
        @media (max-width: 400px) {
          .ul-card  { padding: 28px 18px; }
          .ul-title { font-size: 26px; }
        }
      `}</style>
    </div>
  );
}

export default UserLogin;