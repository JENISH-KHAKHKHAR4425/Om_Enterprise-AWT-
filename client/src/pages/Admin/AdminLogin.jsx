import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ADMIN_EMAIL = "admin@om.com";
  const ADMIN_PASSWORD = "admin123";

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="al-root">

      {/* ── BACKGROUND ── */}
      <div className="al-bg">
        <div className="al-blob al-blob1" />
        <div className="al-blob al-blob2" />
        <div className="al-blob al-blob3" />
        <div className="al-grid" />
      </div>

      {/* ── SPLIT LAYOUT ── */}
      <div className="al-layout">

        {/* LEFT PANEL — visible on laptop only */}
        <div className="al-left">
          <div className="al-left-inner">
            <div className="al-brand">
              <span className="al-brand-dot" />
              <span className="al-brand-name">Om Enterprise</span>
            </div>

            <h2 className="al-left-title">
              Wholesale<br />
              <span className="al-left-accent">Cosmetics</span><br />
              Management
            </h2>

            <p className="al-left-desc">
              Manage your product catalogue, update prices,
              and control your inventory — all in one place.
            </p>

            <div className="al-features">
              <div className="al-feat">
                <span className="al-feat-icon">📦</span>
                <span>Add &amp; remove products</span>
              </div>
              <div className="al-feat">
                <span className="al-feat-icon">💰</span>
                <span>Update wholesale prices</span>
              </div>
              <div className="al-feat">
                <span className="al-feat-icon">🗂</span>
                <span>Manage categories</span>
              </div>
            </div>

            <div className="al-left-badge">
              ⚠ Wholesale Only — No Retail Sales
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — login form */}
        <div className="al-right">
          <div className="al-card">

            {/* Mobile-only brand header */}
            <div className="al-mobile-brand">
              <span className="al-brand-dot" />
              <span className="al-brand-name">Om Enterprise</span>
            </div>
            <div className="al-mobile-divider" />

            <h1 className="al-title">Admin Portal</h1>
            <p className="al-subtitle">Sign in to manage your products</p>

            <form onSubmit={handleLogin} className="al-form">

              <div className="al-field">
                <label className="al-label">Email</label>
                <div className="al-input-wrap">
                  <span className="al-input-icon">✉</span>
                  <input
                    className="al-input"
                    type="email"
                    placeholder="admin@om.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="al-field">
                <label className="al-label">Password</label>
                <div className="al-input-wrap">
                  <span className="al-input-icon">🔒</span>
                  <input
                    className="al-input"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="al-eye"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="al-error">⚠ {error}</div>
              )}

              <button type="submit" className="al-btn" disabled={loading}>
                {loading ? (
                  <span className="al-spinner" />
                ) : (
                  <>Sign In <span className="al-btn-arrow">→</span></>
                )}
              </button>
            </form>

            <p className="al-footer-note">
              🔐 Restricted access — Authorized personnel only
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .al-root {
          min-height: 100vh;
          background: #0f0f13;
          display: flex;
          align-items: stretch;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* BG */
        .al-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .al-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.13;
        }
        .al-blob1 {
          width: 520px; height: 520px;
          background: #e8b86d;
          top: -160px; left: -160px;
          animation: blobFloat 9s ease-in-out infinite;
        }
        .al-blob2 {
          width: 400px; height: 400px;
          background: #c87b5a;
          bottom: -100px; right: -80px;
          animation: blobFloat 11s ease-in-out infinite reverse;
        }
        .al-blob3 {
          width: 280px; height: 280px;
          background: #7b5ac8;
          top: 50%; left: 40%;
          animation: blobFloat 13s ease-in-out infinite;
        }
        @keyframes blobFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(24px,-24px) scale(1.07); }
        }
        .al-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* LAYOUT */
        .al-layout {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
          min-height: 100vh;
        }

        /* LEFT — hidden on mobile, shown on desktop */
        .al-left {
          display: none;
          flex: 1;
          background: linear-gradient(160deg, rgba(232,184,109,0.07), rgba(200,123,90,0.05));
          border-right: 1px solid rgba(255,255,255,0.06);
          padding: 60px 56px;
          flex-direction: column;
          justify-content: center;
        }
        .al-left-inner { max-width: 420px; }

        .al-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 52px;
        }
        .al-brand-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #e8b86d;
          box-shadow: 0 0 14px #e8b86d;
        }
        .al-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #f0ece4;
          letter-spacing: 0.5px;
        }

        .al-left-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 3.2vw, 50px);
          font-weight: 900;
          color: #f0ece4;
          line-height: 1.12;
          margin-bottom: 20px;
        }
        .al-left-accent { color: #e8b86d; font-style: italic; }

        .al-left-desc {
          font-size: 15px;
          color: rgba(240,236,228,0.48);
          line-height: 1.8;
          margin-bottom: 36px;
        }

        .al-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 40px;
        }
        .al-feat {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 14px;
          color: rgba(240,236,228,0.65);
        }
        .al-feat-icon {
          font-size: 17px;
          width: 38px; height: 38px;
          background: rgba(232,184,109,0.09);
          border: 1px solid rgba(232,184,109,0.18);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .al-left-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #e8b86d;
          border: 1px solid rgba(232,184,109,0.28);
          border-radius: 20px;
          padding: 6px 16px;
        }

        /* RIGHT */
        .al-right {
          flex: 0 0 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
        }

        .al-card {
          width: 100%;
          max-width: 420px;
          background: #1c1c26;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 40px 32px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
          animation: cardIn 0.5s ease both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Mobile brand (inside card) */
        .al-mobile-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .al-mobile-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(232,184,109,0.4), transparent);
          margin-bottom: 24px;
        }

        .al-title {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 900;
          color: #f0ece4;
          margin-bottom: 6px;
        }
        .al-subtitle {
          font-size: 14px;
          color: rgba(240,236,228,0.4);
          margin-bottom: 28px;
        }

        /* FORM */
        .al-form { display: flex; flex-direction: column; gap: 18px; }
        .al-field { display: flex; flex-direction: column; gap: 7px; }
        .al-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: rgba(240,236,228,0.42);
        }
        .al-input-wrap { position: relative; display: flex; align-items: center; }
        .al-input-icon {
          position: absolute;
          left: 14px;
          font-size: 15px;
          pointer-events: none;
          opacity: 0.4;
        }
        .al-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 13px 44px;
          color: #f0ece4;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: all 0.25s;
        }
        .al-input::placeholder { color: rgba(240,236,228,0.2); }
        .al-input:focus {
          border-color: rgba(232,184,109,0.5);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 3px rgba(232,184,109,0.1);
        }
        .al-eye {
          position: absolute; right: 12px;
          background: none; border: none;
          cursor: pointer; font-size: 16px;
          opacity: 0.4; transition: opacity 0.2s; padding: 4px;
        }
        .al-eye:hover { opacity: 1; }

        .al-error {
          background: rgba(255,80,80,0.1);
          border: 1px solid rgba(255,80,80,0.25);
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 13px;
          color: #ff8080;
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-6px); }
          75%      { transform: translateX(6px); }
        }

        .al-btn {
          background: linear-gradient(135deg, #e8b86d, #d4a055);
          border: none; border-radius: 12px;
          padding: 15px; color: #0f0f13;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          cursor: pointer; transition: all 0.25s;
          display: flex; align-items: center;
          justify-content: center; gap: 8px; margin-top: 4px;
        }
        .al-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(232,184,109,0.35);
        }
        .al-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .al-btn-arrow { font-size: 18px; transition: transform 0.2s; }
        .al-btn:hover .al-btn-arrow { transform: translateX(3px); }

        .al-spinner {
          width: 20px; height: 20px;
          border: 2.5px solid rgba(15,15,19,0.3);
          border-top-color: #0f0f13;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .al-footer-note {
          margin-top: 22px;
          text-align: center;
          font-size: 12px;
          color: rgba(240,236,228,0.28);
        }

        /* DESKTOP: show left panel */
        @media (min-width: 900px) {
          .al-left  { display: flex; }
          .al-right { flex: 0 0 480px; padding: 48px 56px; }
          .al-card  {
            background: transparent;
            border: none;
            border-radius: 0;
            box-shadow: none;
            padding: 0;
            max-width: 100%;
          }
          .al-mobile-brand,
          .al-mobile-divider { display: none; }
        }

        /* SMALL MOBILE */
        @media (max-width: 400px) {
          .al-card  { padding: 28px 18px; }
          .al-title { font-size: 26px; }
        }
      `}</style>
    </div>
  );
}

export default AdminLogin;