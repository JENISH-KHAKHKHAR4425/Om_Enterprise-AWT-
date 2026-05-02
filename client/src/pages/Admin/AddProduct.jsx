import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function AddProduct() {
  const [form, setForm] = useState({ name: "", price: "", category: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();

  const handle = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/products", form);
      setSuccess(true);
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name",     label: "Product Name",  placeholder: "e.g. Premium Steel Pipe",     icon: "📦", type: "text" },
    { key: "price",    label: "Price (₹)",      placeholder: "e.g. 1299",                   icon: "₹",  type: "number" },
    { key: "category", label: "Category",       placeholder: "e.g. Pipes & Fittings",       icon: "🏷", type: "text" },
    { key: "image",    label: "Image URL",      placeholder: "https://example.com/img.jpg", icon: "🖼", type: "url" },
  ];

  return (
    <div className="ap-root">

      {/* BG */}
      <div className="ap-bg">
        <div className="ap-blob ap-blob1" />
        <div className="ap-blob ap-blob2" />
        <div className="ap-grid" />
      </div>

      {/* NAVBAR */}
      <header className="ap-navbar">
        <div className="ap-nav-brand">
          <span className="ap-brand-dot" />
          <span className="ap-brand-name">Om Enterprise</span>
          <span className="ap-admin-tag">Admin</span>
        </div>
        <button className="ap-back-btn" onClick={() => navigate("/admin/dashboard")}>
          ← Back
        </button>
      </header>

      <div className="ap-body">

        {/* LEFT — decorative panel */}
        <div className="ap-left">
          <div className="ap-left-inner">
            <div className="ap-icon-ring">
              <span className="ap-big-icon">📦</span>
            </div>
            <h2 className="ap-left-title">New Product</h2>
            <p className="ap-left-sub">
              Add a new item to your catalogue. Fill in the details and it'll
              appear instantly in the storefront.
            </p>
            <div className="ap-divider" />
            <ul className="ap-tips">
              <li><span className="ap-tip-dot" />Use a clear, descriptive name</li>
              <li><span className="ap-tip-dot" />Enter price in Indian Rupees (₹)</li>
              <li><span className="ap-tip-dot" />Add a high-quality image URL</li>
              <li><span className="ap-tip-dot" />Assign the right category</li>
            </ul>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="ap-right">
          <div className="ap-card">
            <div className="ap-card-header">
              <h1 className="ap-card-title">Add Product</h1>
              <p className="ap-card-sub">Fill in all fields to create a new listing</p>
            </div>

            <form className="ap-form" onSubmit={submit}>
              {fields.map(({ key, label, placeholder, icon, type }) => (
                <div
                  key={key}
                  className={`ap-field ${focused === key ? "focused" : ""} ${form[key] ? "has-value" : ""}`}
                >
                  <label className="ap-label">
                    <span className="ap-label-icon">{icon}</span>
                    {label}
                  </label>
                  <div className="ap-input-wrap">
                    <input
                      className="ap-input"
                      type={type}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={handle(key)}
                      onFocus={() => setFocused(key)}
                      onBlur={() => setFocused(null)}
                      required
                    />
                    <span className="ap-input-line" />
                  </div>
                </div>
              ))}

              {/* Image preview */}
              {form.image && (
                <div className="ap-preview">
                  <span className="ap-preview-label">Preview</span>
                  <div className="ap-preview-img-wrap">
                    <img
                      className="ap-preview-img"
                      src={form.image}
                      alt="Preview"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                </div>
              )}

              <button
                className={`ap-submit ${loading ? "loading" : ""} ${success ? "done" : ""}`}
                type="submit"
                disabled={loading || success}
              >
                {success
                  ? <><span className="ap-check">✓</span> Product Added!</>
                  : loading
                  ? <><span className="ap-spinner" /> Adding…</>
                  : "Add Product →"
                }
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ap-root {
          min-height: 100vh;
          background: #0f0f13;
          font-family: 'DM Sans', sans-serif;
          color: #f0ece4;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        /* BG */
        .ap-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .ap-blob {
          position: absolute; border-radius: 50%;
          filter: blur(100px); opacity: 0.1;
        }
        .ap-blob1 {
          width: 500px; height: 500px; background: #e8b86d;
          top: -150px; right: -100px;
          animation: blobFloat 10s ease-in-out infinite;
        }
        .ap-blob2 {
          width: 380px; height: 380px; background: #c87b5a;
          bottom: -100px; left: -80px;
          animation: blobFloat 13s ease-in-out infinite reverse;
        }
        @keyframes blobFloat {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(20px,-20px); }
        }
        .ap-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* NAVBAR */
        .ap-navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(15,15,19,0.9);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 32px;
        }
        .ap-nav-brand { display: flex; align-items: center; gap: 10px; }
        .ap-brand-dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: #e8b86d; box-shadow: 0 0 10px #e8b86d;
        }
        .ap-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #f0ece4;
        }
        .ap-admin-tag {
          font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: #0f0f13;
          background: #e8b86d; border-radius: 20px; padding: 3px 9px;
        }
        .ap-back-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(240,236,228,0.6);
          border-radius: 20px; padding: 9px 18px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          cursor: pointer; transition: all 0.25s;
        }
        .ap-back-btn:hover {
          background: rgba(255,255,255,0.1); color: #f0ece4;
          transform: translateX(-2px);
        }

        /* BODY */
        .ap-body {
          position: relative; z-index: 1;
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 0;
          max-width: 1100px;
          margin: 48px auto;
          padding: 0 32px 60px;
          width: 100%;
          align-items: start;
        }

        /* LEFT */
        .ap-left {
          padding-right: 48px;
          animation: fadeUp 0.5s ease both;
        }
        .ap-left-inner {
          position: sticky; top: 100px;
        }
        .ap-icon-ring {
          width: 72px; height: 72px; border-radius: 20px;
          background: rgba(232,184,109,0.08);
          border: 1px solid rgba(232,184,109,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; margin-bottom: 24px;
          box-shadow: 0 0 30px rgba(232,184,109,0.06);
        }
        .ap-left-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px; font-weight: 900; color: #f0ece4;
          line-height: 1.15; margin-bottom: 14px;
        }
        .ap-left-sub {
          font-size: 14px; color: rgba(240,236,228,0.45);
          line-height: 1.7;
        }
        .ap-divider {
          width: 40px; height: 2px;
          background: linear-gradient(90deg, #e8b86d, transparent);
          margin: 28px 0;
        }
        .ap-tips { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .ap-tips li {
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: rgba(240,236,228,0.4);
        }
        .ap-tip-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #e8b86d; flex-shrink: 0;
          box-shadow: 0 0 6px #e8b86d;
        }

        /* RIGHT / CARD */
        .ap-right {
          animation: fadeUp 0.5s 0.1s ease both;
        }
        .ap-card {
          background: #1c1c26;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 36px 40px;
        }
        .ap-card-header { margin-bottom: 32px; }
        .ap-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700; color: #f0ece4;
          margin-bottom: 6px;
        }
        .ap-card-sub {
          font-size: 13px; color: rgba(240,236,228,0.35);
        }

        /* FORM */
        .ap-form { display: flex; flex-direction: column; gap: 24px; }

        .ap-field {
          display: flex; flex-direction: column; gap: 8px;
          transition: transform 0.2s;
        }
        .ap-field.focused { transform: translateX(3px); }

        .ap-label {
          display: flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; color: rgba(240,236,228,0.4);
          transition: color 0.2s;
        }
        .ap-field.focused .ap-label { color: #e8b86d; }
        .ap-label-icon { font-size: 14px; }

        .ap-input-wrap { position: relative; }
        .ap-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 13px 16px;
          color: #f0ece4;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: all 0.25s;
          -moz-appearance: textfield;
        }
        .ap-input::-webkit-outer-spin-button,
        .ap-input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .ap-input::placeholder { color: rgba(240,236,228,0.2); }
        .ap-input:focus {
          border-color: rgba(232,184,109,0.45);
          background: rgba(232,184,109,0.04);
          box-shadow: 0 0 0 3px rgba(232,184,109,0.08);
        }
        .ap-field.has-value .ap-input {
          border-color: rgba(232,184,109,0.2);
        }

        /* PREVIEW */
        .ap-preview {
          display: flex; flex-direction: column; gap: 10px;
          animation: fadeUp 0.35s ease both;
        }
        .ap-preview-label {
          font-size: 11px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; color: rgba(240,236,228,0.3);
        }
        .ap-preview-img-wrap {
          width: 80px; height: 80px; border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(232,184,109,0.2);
          background: rgba(255,255,255,0.03);
        }
        .ap-preview-img {
          width: 100%; height: 100%; object-fit: cover;
        }

        /* SUBMIT */
        .ap-submit {
          margin-top: 8px;
          width: 100%; padding: 15px 24px;
          background: #e8b86d;
          border: none; border-radius: 14px;
          color: #0f0f13;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          letter-spacing: 0.3px;
        }
        .ap-submit:hover:not(:disabled) {
          background: #f0c980;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(232,184,109,0.3);
        }
        .ap-submit:active:not(:disabled) { transform: translateY(0); }
        .ap-submit.loading {
          background: rgba(232,184,109,0.5); cursor: not-allowed;
        }
        .ap-submit.done {
          background: #4caf7d; cursor: default;
          box-shadow: 0 8px 24px rgba(76,175,125,0.3);
        }
        .ap-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(15,15,19,0.3);
          border-top-color: #0f0f13;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ap-check { font-size: 18px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* RESPONSIVE */
        @media (max-width: 800px) {
          .ap-body {
            grid-template-columns: 1fr;
            padding: 0 16px 40px;
            margin: 24px auto;
          }
          .ap-left { padding-right: 0; margin-bottom: 32px; }
          .ap-left-inner { position: static; }
          .ap-left-title { font-size: 28px; }
          .ap-card { padding: 24px 20px; }
          .ap-navbar { padding: 12px 16px; }
        }
      `}</style>
    </div>
  );
}

export default AddProduct;