import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

// ── STEP 1: Signup Form  |  STEP 2: OTP Verification ─────────────────────────
function UserSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const strength = form.password.length === 0 ? 0
    : form.password.length < 4 ? 1
    : form.password.length < 7 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", "#ff6b6b", "#e8b86d", "#6bffb8"];

  // ── STEP 1 SUBMIT ──────────────────────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirm)
      return setError("Please fill in all fields.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm)
      return setError("Passwords do not match.");

    setLoading(true);
    try {
      await API.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setStep(2);
      setResendCooldown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP INPUT HANDLING ─────────────────────────────────────────────────────
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  // ── STEP 2 SUBMIT ──────────────────────────────────────────────────────────
  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return setError("Enter all 6 digits.");
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/verify-otp", { email: form.email, otp: code });
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code. Try again.");
      setLoading(false);
    }
  };

  // ── RESEND OTP ─────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    try {
      await API.post("/auth/resend-otp", { email: form.email });
      setOtp(["", "", "", "", "", ""]);
      setResendCooldown(60);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError("Could not resend. Try again.");
    }
  };

  return (
    <div className="us-root">

      {/* BG */}
      <div className="us-bg">
        <div className="us-blob us-blob1" />
        <div className="us-blob us-blob2" />
        <div className="us-blob us-blob3" />
        <div className="us-grid" />
      </div>

      <div className="us-layout">

        {/* LEFT */}
        <div className="us-left">
          <div className="us-left-inner">
            <div className="us-brand">
              <span className="us-brand-dot" />
              <span className="us-brand-name">Om Enterprise</span>
            </div>
            <h2 className="us-left-title">
              Join Our<br />
              <span className="us-left-accent">Wholesale</span><br />
              Network
            </h2>
            <p className="us-left-desc">
              Create your account to access exclusive wholesale
              pricing on premium cosmetics and beauty products.
            </p>
            <div className="us-steps">
              {[
                { n: "01", t: "Create Account",       s: "Fill in your details" },
                { n: "02", t: "Verify Email",          s: "Enter the OTP we send" },
                { n: "03", t: "Access Catalogue",      s: "Explore 60+ products" },
              ].map((st, i) => (
                <React.Fragment key={i}>
                  <div className={`us-step ${step === i + 1 ? "active" : ""}`}>
                    <span className="us-step-num">{st.n}</span>
                    <div>
                      <div className="us-step-title">{st.t}</div>
                      <div className="us-step-sub">{st.s}</div>
                    </div>
                  </div>
                  {i < 2 && <div className="us-step-line" />}
                </React.Fragment>
              ))}
            </div>
            <div className="us-left-badge">⚠ Wholesale Only — No Retail Sales</div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="us-right">
          <div className="us-card">

            {/* Mobile brand */}
            <div className="us-mobile-brand">
              <span className="us-brand-dot" />
              <span className="us-brand-name">Om Enterprise</span>
            </div>
            <div className="us-mobile-divider" />

            {/* ── STEP 1: SIGNUP FORM ── */}
            {step === 1 && (
              <>
                <div className="us-welcome-tag">✦ Get Started</div>
                <h1 className="us-title">Create Account</h1>
                <p className="us-subtitle">Join the wholesale network</p>

                <form onSubmit={handleSignup} className="us-form">
                  {/* Name */}
                  <div className="us-field">
                    <label className="us-label">Full Name</label>
                    <div className="us-input-wrap">
                      <span className="us-input-icon">👤</span>
                      <input className="us-input" type="text" placeholder="Your full name"
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="us-field">
                    <label className="us-label">Email</label>
                    <div className="us-input-wrap">
                      <span className="us-input-icon">✉</span>
                      <input className="us-input" type="email" placeholder="your@email.com"
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="us-field">
                    <label className="us-label">Password</label>
                    <div className="us-input-wrap">
                      <span className="us-input-icon">🔒</span>
                      <input className="us-input" type={showPass ? "text" : "password"}
                        placeholder="Min. 6 characters" value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })} required />
                      <button type="button" className="us-eye" onClick={() => setShowPass(!showPass)}>
                        {showPass ? "🙈" : "👁"}
                      </button>
                    </div>
                    {form.password.length > 0 && (
                      <div className="us-strength">
                        <div className="us-strength-bars">
                          {[1,2,3].map(i => (
                            <div key={i} className="us-strength-bar"
                              style={{ background: i <= strength ? strengthColor[strength] : "rgba(255,255,255,0.1)" }} />
                          ))}
                        </div>
                        <span className="us-strength-label" style={{ color: strengthColor[strength] }}>
                          {strengthLabel[strength]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm */}
                  <div className="us-field">
                    <label className="us-label">Confirm Password</label>
                    <div className="us-input-wrap">
                      <span className="us-input-icon">🔑</span>
                      <input className="us-input" type={showConfirm ? "text" : "password"}
                        placeholder="Repeat your password" value={form.confirm}
                        onChange={e => setForm({ ...form, confirm: e.target.value })} required />
                      <button type="button" className="us-eye" onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? "🙈" : "👁"}
                      </button>
                    </div>
                    {form.confirm.length > 0 && (
                      <div className="us-match" style={{ color: form.password === form.confirm ? "#6bffb8" : "#ff6b6b" }}>
                        {form.password === form.confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
                      </div>
                    )}
                  </div>

                  {error && <div className="us-error">⚠ {error}</div>}

                  <button type="submit" className="us-btn" disabled={loading}>
                    {loading
                      ? <span className="us-spinner" />
                      : <>Send Verification Code <span className="us-btn-arrow">→</span></>}
                  </button>
                </form>

                <div className="us-or">
                  <span className="us-or-line" />
                  <span className="us-or-text">Already have an account?</span>
                  <span className="us-or-line" />
                </div>
                <Link to="/" className="us-login-btn">Sign In</Link>
                <p className="us-footer-note">🛍 Wholesale enquiries only — Not for retail buyers</p>
              </>
            )}

            {/* ── STEP 2: OTP VERIFICATION ── */}
            {step === 2 && (
              <>
                <div className={`us-otp-wrap ${success ? "verified" : ""}`}>
                  {success ? (
                    <div className="us-success-state">
                      <div className="us-success-ring">✓</div>
                      <h2 className="us-success-title">Account Verified!</h2>
                      <p className="us-success-sub">Redirecting you to Sign In…</p>
                    </div>
                  ) : (
                    <>
                      <div className="us-otp-icon">✉️</div>
                      <h1 className="us-title" style={{ marginBottom: 6 }}>Check Your Email</h1>
                      <p className="us-subtitle" style={{ marginBottom: 4 }}>
                        We sent a 6-digit code to
                      </p>
                      <p className="us-otp-email">{form.email}</p>

                      {/* OTP boxes */}
                      <div className="us-otp-boxes" onPaste={handleOtpPaste}>
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            ref={el => otpRefs.current[i] = el}
                            className={`us-otp-box ${digit ? "filled" : ""}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleOtpChange(i, e.target.value)}
                            onKeyDown={e => handleOtpKeyDown(i, e)}
                          />
                        ))}
                      </div>

                      {error && <div className="us-error" style={{ marginBottom: 0 }}>⚠ {error}</div>}

                      <button className="us-btn" onClick={handleVerify} disabled={loading}>
                        {loading
                          ? <span className="us-spinner" />
                          : <>Verify & Create Account <span className="us-btn-arrow">→</span></>}
                      </button>

                      {/* Resend */}
                      <div className="us-resend">
                        <span>Didn't receive it? </span>
                        <button
                          className={`us-resend-btn ${resendCooldown > 0 ? "disabled" : ""}`}
                          onClick={handleResend}
                          disabled={resendCooldown > 0}
                        >
                          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                        </button>
                      </div>

                      <button className="us-back-link" onClick={() => { setStep(1); setError(""); setOtp(["","","","","",""]); }}>
                        ← Change email
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .us-root {
          min-height: 100vh; background: #0f0f13;
          display: flex; align-items: stretch;
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow: hidden;
        }

        /* BG */
        .us-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .us-blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.12; }
        .us-blob1 { width: 480px; height: 480px; background: #6bffb8; top: -140px; left: -120px; animation: blobFloat 9s ease-in-out infinite; }
        .us-blob2 { width: 400px; height: 400px; background: #e8b86d; bottom: -100px; right: -80px; animation: blobFloat 11s ease-in-out infinite reverse; }
        .us-blob3 { width: 260px; height: 260px; background: #c87b5a; top: 45%; left: 38%; animation: blobFloat 14s ease-in-out infinite; }
        @keyframes blobFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(22px,-22px) scale(1.06); }
        }
        .us-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* LAYOUT */
        .us-layout { position: relative; z-index: 1; display: flex; width: 100%; min-height: 100vh; }

        /* LEFT */
        .us-left {
          display: none; flex: 1;
          background: linear-gradient(160deg, rgba(107,255,184,0.05), rgba(232,184,109,0.06));
          border-right: 1px solid rgba(255,255,255,0.06);
          padding: 60px 56px; flex-direction: column; justify-content: center;
        }
        .us-left-inner { max-width: 420px; }
        .us-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 52px; }
        .us-brand-dot { width: 10px; height: 10px; border-radius: 50%; background: #e8b86d; box-shadow: 0 0 14px #e8b86d; }
        .us-brand-name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #f0ece4; }
        .us-left-title { font-family: 'Playfair Display', serif; font-size: clamp(32px,3.2vw,50px); font-weight: 900; color: #f0ece4; line-height: 1.12; margin-bottom: 20px; }
        .us-left-accent { color: #e8b86d; font-style: italic; }
        .us-left-desc { font-size: 15px; color: rgba(240,236,228,0.48); line-height: 1.8; margin-bottom: 40px; }

        .us-steps { display: flex; flex-direction: column; gap: 0; margin-bottom: 40px; }
        .us-step { display: flex; align-items: flex-start; gap: 16px; opacity: 0.45; transition: opacity 0.3s; }
        .us-step.active { opacity: 1; }
        .us-step-line { width: 2px; height: 28px; background: linear-gradient(to bottom, rgba(232,184,109,0.3), transparent); margin-left: 17px; }
        .us-step-num {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(232,184,109,0.1); border: 1px solid rgba(232,184,109,0.25);
          color: #e8b86d; font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; letter-spacing: 1px;
        }
        .us-step.active .us-step-num { background: rgba(232,184,109,0.2); border-color: #e8b86d; box-shadow: 0 0 12px rgba(232,184,109,0.3); }
        .us-step-title { font-size: 14px; font-weight: 600; color: #f0ece4; margin-bottom: 2px; }
        .us-step-sub { font-size: 12px; color: rgba(240,236,228,0.4); }
        .us-left-badge { display: inline-block; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #e8b86d; border: 1px solid rgba(232,184,109,0.28); border-radius: 20px; padding: 6px 16px; }

        /* RIGHT */
        .us-right { flex: 0 0 100%; display: flex; align-items: center; justify-content: center; padding: 32px 20px; }
        .us-card {
          width: 100%; max-width: 440px;
          background: #1c1c26; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 40px 32px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
          animation: cardIn 0.5s ease both;
        }
        @keyframes cardIn { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .us-mobile-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .us-mobile-divider { height: 1px; background: linear-gradient(to right, rgba(232,184,109,0.4), transparent); margin-bottom: 22px; }

        .us-welcome-tag { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #e8b86d; margin-bottom: 8px; }
        .us-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 900; color: #f0ece4; margin-bottom: 4px; }
        .us-subtitle { font-size: 14px; color: rgba(240,236,228,0.4); margin-bottom: 24px; }

        /* FORM */
        .us-form { display: flex; flex-direction: column; gap: 16px; }
        .us-field { display: flex; flex-direction: column; gap: 6px; }
        .us-label { font-size: 11px; font-weight: 600; letter-spacing: 1.4px; text-transform: uppercase; color: rgba(240,236,228,0.42); }
        .us-input-wrap { position: relative; display: flex; align-items: center; }
        .us-input-icon { position: absolute; left: 14px; font-size: 14px; pointer-events: none; opacity: 0.4; }
        .us-input {
          width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px; padding: 12px 44px; color: #f0ece4;
          font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: all 0.25s;
        }
        .us-input::placeholder { color: rgba(240,236,228,0.2); }
        .us-input:focus { border-color: rgba(232,184,109,0.5); background: rgba(255,255,255,0.08); box-shadow: 0 0 0 3px rgba(232,184,109,0.1); }
        .us-eye { position: absolute; right: 12px; background: none; border: none; cursor: pointer; font-size: 15px; opacity: 0.4; transition: opacity 0.2s; padding: 4px; }
        .us-eye:hover { opacity: 1; }

        .us-strength { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
        .us-strength-bars { display: flex; gap: 4px; flex: 1; }
        .us-strength-bar { flex: 1; height: 3px; border-radius: 4px; transition: background 0.3s; }
        .us-strength-label { font-size: 11px; font-weight: 600; min-width: 36px; }
        .us-match { font-size: 12px; font-weight: 500; margin-top: 5px; }

        .us-error {
          background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.25);
          border-radius: 10px; padding: 11px 14px; font-size: 13px; color: #ff8080;
          animation: shake 0.4s ease; margin-bottom: 4px;
        }
        @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }

        .us-btn {
          background: linear-gradient(135deg, #e8b86d, #d4a055); border: none; border-radius: 12px;
          padding: 14px; color: #0f0f13; font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.25s;
          display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 4px; width: 100%;
        }
        .us-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(232,184,109,0.35); }
        .us-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .us-btn-arrow { font-size: 18px; transition: transform 0.2s; }
        .us-btn:hover .us-btn-arrow { transform: translateX(3px); }

        .us-spinner { width: 20px; height: 20px; border: 2.5px solid rgba(15,15,19,0.3); border-top-color: #0f0f13; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .us-or { display: flex; align-items: center; gap: 12px; margin: 20px 0 14px; }
        .us-or-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .us-or-text { font-size: 12px; color: rgba(240,236,228,0.3); white-space: nowrap; }
        .us-login-btn {
          display: block; width: 100%; text-align: center; padding: 12px; border-radius: 12px;
          border: 1px solid rgba(232,184,109,0.3); color: #e8b86d;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.25s;
        }
        .us-login-btn:hover { background: rgba(232,184,109,0.08); border-color: rgba(232,184,109,0.55); transform: translateY(-1px); }
        .us-footer-note { margin-top: 18px; text-align: center; font-size: 12px; color: rgba(240,236,228,0.25); }

        /* OTP STEP */
        .us-otp-wrap { display: flex; flex-direction: column; align-items: center; gap: 18px; animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .us-otp-icon { font-size: 44px; }
        .us-otp-email { font-size: 14px; font-weight: 600; color: #e8b86d; margin-top: -10px; margin-bottom: 4px; word-break: break-all; text-align: center; }

        .us-otp-boxes { display: flex; gap: 10px; justify-content: center; margin: 4px 0; }
        .us-otp-box {
          width: 48px; height: 56px; border-radius: 12px; text-align: center;
          font-size: 22px; font-weight: 700; color: #f0ece4;
          background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1);
          outline: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
          caret-color: #e8b86d;
        }
        .us-otp-box:focus { border-color: #e8b86d; background: rgba(232,184,109,0.07); box-shadow: 0 0 0 3px rgba(232,184,109,0.12); }
        .us-otp-box.filled { border-color: rgba(232,184,109,0.4); color: #e8b86d; }

        .us-resend { font-size: 13px; color: rgba(240,236,228,0.4); text-align: center; }
        .us-resend-btn { background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 600; color: #e8b86d; padding: 0; transition: opacity 0.2s; font-family: 'DM Sans', sans-serif; }
        .us-resend-btn.disabled { opacity: 0.4; cursor: not-allowed; color: rgba(240,236,228,0.4); }
        .us-back-link { background: none; border: none; cursor: pointer; font-size: 13px; color: rgba(240,236,228,0.35); font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
        .us-back-link:hover { color: rgba(240,236,228,0.7); }

        /* SUCCESS */
        .us-success-state { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 20px 0; animation: fadeUp 0.4s ease both; }
        .us-success-ring {
          width: 72px; height: 72px; border-radius: 50%;
          background: rgba(107,255,184,0.1); border: 2px solid #6bffb8;
          color: #6bffb8; font-size: 32px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 30px rgba(107,255,184,0.2);
          animation: pulse 1.5s ease infinite;
        }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 20px rgba(107,255,184,0.2); } 50% { box-shadow: 0 0 40px rgba(107,255,184,0.4); } }
        .us-success-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: #f0ece4; }
        .us-success-sub { font-size: 14px; color: rgba(240,236,228,0.4); }

        /* DESKTOP */
        @media (min-width: 900px) {
          .us-left  { display: flex; }
          .us-right { flex: 0 0 500px; padding: 40px 56px; }
          .us-card  { background: transparent; border: none; border-radius: 0; box-shadow: none; padding: 0; max-width: 100%; }
          .us-mobile-brand, .us-mobile-divider { display: none; }
        }
        @media (max-width: 400px) {
          .us-card { padding: 24px 16px; }
          .us-title { font-size: 24px; }
          .us-otp-box { width: 40px; height: 48px; font-size: 18px; }
          .us-otp-boxes { gap: 6px; }
        }
      `}</style>
    </div>
  );
}

export default UserSignup;