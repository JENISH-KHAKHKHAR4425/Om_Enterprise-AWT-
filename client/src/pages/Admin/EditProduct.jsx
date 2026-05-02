import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", price: "", category: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    API.get("/api/products").then((res) => {
      const product = res.data.find((p) => p._id === id);
      if (product) setForm(product);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handle = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const update = async () => {
    setSaving(true);
    try {
      await API.put(`/api/products/${id}`, form);
      setSuccess(true);
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch {
      setSaving(false);
    }
  };

  const fields = [
    { key: "name",     label: "Product Name",  placeholder: "e.g. Premium Steel Pipe",     icon: "📦", type: "text" },
    { key: "price",    label: "Price (₹)",      placeholder: "e.g. 1299",                   icon: "₹",  type: "number" },
    { key: "category", label: "Category",       placeholder: "e.g. Pipes & Fittings",       icon: "🏷", type: "text" },
    { key: "image",    label: "Image URL",      placeholder: "https://example.com/img.jpg", icon: "🖼", type: "url" },
  ];

  return (
    <div className="ep-root">

      {/* BG */}
      <div className="ep-bg">
        <div className="ep-blob ep-blob1" />
        <div className="ep-blob ep-blob2" />
        <div className="ep-grid" />
      </div>

      {/* NAVBAR */}
      <header className="ep-navbar">
        <div className="ep-nav-brand">
          <span className="ep-brand-dot" />
          <span className="ep-brand-name">Om Enterprise</span>
          <span className="ep-admin-tag">Admin</span>
        </div>
        <button className="ep-back-btn" onClick={() => navigate("/admin/dashboard")}>
          ← Back
        </button>
      </header>

      <div className="ep-body">

        {/* LEFT */}
        <div className="ep-left">
          <div className="ep-left-inner">
            <div className="ep-icon-ring">
              <span className="ep-big-icon">✏️</span>
            </div>
            <h2 className="ep-left-title">Edit Product</h2>
            <p className="ep-left-sub">
              Update the details of an existing product. Changes will reflect
              immediately across the storefront.
            </p>
            <div className="ep-divider" />

            {/* Current snapshot */}
            {!loading && form.image && (
              <div className="ep-snapshot">
                <span className="ep-snapshot-label">Current Image</span>
                <div className="ep-snapshot-img-wrap">
                  <img
                    className="ep-snapshot-img"
                    src={form.image}
                    alt={form.name}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
                {form.name && <p className="ep-snapshot-name">{form.name}</p>}
                {form.price && <p className="ep-snapshot-price">₹{form.price}</p>}
              </div>
            )}

            <ul className="ep-tips">
              <li><span className="ep-tip-dot" />Only change what needs updating</li>
              <li><span className="ep-tip-dot" />Price must be in Indian Rupees (₹)</li>
              <li><span className="ep-tip-dot" />Use a direct image link (jpg/png/webp)</li>
              <li><span className="ep-tip-dot" />Changes save instantly on submit</li>
            </ul>
          </div>
        </div>

        {/* RIGHT */}
        <div className="ep-right">
          <div className="ep-card">
            <div className="ep-card-header">
              <h1 className="ep-card-title">Update Details</h1>
              <p className="ep-card-sub">Editing product ID: <span className="ep-id-chip">{id?.slice(-8)}</span></p>
            </div>

            {loading ? (
              <div className="ep-load-state">
                <div className="ep-spinner" />
                <p>Loading product…</p>
              </div>
            ) : (
              <div className="ep-form">
                {fields.map(({ key, label, placeholder, icon, type }) => (
                  <div
                    key={key}
                    className={`ep-field ${focused === key ? "focused" : ""} ${form[key] ? "has-value" : ""}`}
                  >
                    <label className="ep-label">
                      <span className="ep-label-icon">{icon}</span>
                      {label}
                    </label>
                    <div className="ep-input-wrap">
                      <input
                        className="ep-input"
                        type={type}
                        placeholder={placeholder}
                        value={form[key] || ""}
                        onChange={handle(key)}
                        onFocus={() => setFocused(key)}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                  </div>
                ))}

                {/* Live image preview on URL change */}
                {form.image && (
                  <div className="ep-preview">
                    <span className="ep-preview-label">Preview</span>
                    <div className="ep-preview-img-wrap">
                      <img
                        className="ep-preview-img"
                        src={form.image}
                        alt="Preview"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                  </div>
                )}

                <div className="ep-actions">
                  <button
                    className="ep-cancel-btn"
                    onClick={() => navigate("/admin/dashboard")}
                    disabled={saving || success}
                  >
                    Cancel
                  </button>
                  <button
                    className={`ep-submit ${saving ? "saving" : ""} ${success ? "done" : ""}`}
                    onClick={update}
                    disabled={saving || success}
                  >
                    {success
                      ? <><span className="ep-check">✓</span> Updated!</>
                      : saving
                      ? <><span className="ep-spin" /> Saving…</>
                      : "Save Changes →"
                    }
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ep-root {
          min-height: 100vh;
          background: #0f0f13;
          font-family: 'DM Sans', sans-serif;
          color: #f0ece4;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        /* BG */
        .ep-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .ep-blob {
          position: absolute; border-radius: 50%;
          filter: blur(100px); opacity: 0.1;
        }
        .ep-blob1 {
          width: 500px; height: 500px; background: #e8b86d;
          top: -150px; right: -100px;
          animation: blobFloat 10s ease-in-out infinite;
        }
        .ep-blob2 {
          width: 380px; height: 380px; background: #c87b5a;
          bottom: -100px; left: -80px;
          animation: blobFloat 13s ease-in-out infinite reverse;
        }
        @keyframes blobFloat {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(20px,-20px); }
        }
        .ep-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* NAVBAR */
        .ep-navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(15,15,19,0.9);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 32px;
        }
        .ep-nav-brand { display: flex; align-items: center; gap: 10px; }
        .ep-brand-dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: #e8b86d; box-shadow: 0 0 10px #e8b86d;
        }
        .ep-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #f0ece4;
        }
        .ep-admin-tag {
          font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: #0f0f13;
          background: #e8b86d; border-radius: 20px; padding: 3px 9px;
        }
        .ep-back-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(240,236,228,0.6);
          border-radius: 20px; padding: 9px 18px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          cursor: pointer; transition: all 0.25s;
        }
        .ep-back-btn:hover {
          background: rgba(255,255,255,0.1); color: #f0ece4;
          transform: translateX(-2px);
        }

        /* BODY */
        .ep-body {
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
        .ep-left {
          padding-right: 48px;
          animation: fadeUp 0.5s ease both;
        }
        .ep-left-inner { position: sticky; top: 100px; }
        .ep-icon-ring {
          width: 72px; height: 72px; border-radius: 20px;
          background: rgba(232,184,109,0.08);
          border: 1px solid rgba(232,184,109,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; margin-bottom: 24px;
          box-shadow: 0 0 30px rgba(232,184,109,0.06);
        }
        .ep-left-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px; font-weight: 900; color: #f0ece4;
          line-height: 1.15; margin-bottom: 14px;
        }
        .ep-left-sub {
          font-size: 14px; color: rgba(240,236,228,0.45); line-height: 1.7;
        }
        .ep-divider {
          width: 40px; height: 2px;
          background: linear-gradient(90deg, #e8b86d, transparent);
          margin: 28px 0;
        }

        /* Snapshot */
        .ep-snapshot {
          background: rgba(232,184,109,0.05);
          border: 1px solid rgba(232,184,109,0.15);
          border-radius: 16px; padding: 16px;
          margin-bottom: 24px;
          animation: fadeUp 0.4s ease both;
        }
        .ep-snapshot-label {
          font-size: 10px; font-weight: 700; letter-spacing: 1.2px;
          text-transform: uppercase; color: rgba(232,184,109,0.5);
          display: block; margin-bottom: 10px;
        }
        .ep-snapshot-img-wrap {
          width: 64px; height: 64px; border-radius: 10px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08); margin-bottom: 10px;
          background: rgba(255,255,255,0.03);
        }
        .ep-snapshot-img { width: 100%; height: 100%; object-fit: cover; }
        .ep-snapshot-name {
          font-size: 13px; font-weight: 600; color: #f0ece4; margin-bottom: 3px;
        }
        .ep-snapshot-price {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #e8b86d;
        }

        .ep-tips { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .ep-tips li {
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: rgba(240,236,228,0.4);
        }
        .ep-tip-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #e8b86d; flex-shrink: 0;
          box-shadow: 0 0 6px #e8b86d;
        }

        /* RIGHT / CARD */
        .ep-right { animation: fadeUp 0.5s 0.1s ease both; }
        .ep-card {
          background: #1c1c26;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 36px 40px;
        }
        .ep-card-header { margin-bottom: 32px; }
        .ep-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700; color: #f0ece4; margin-bottom: 6px;
        }
        .ep-card-sub {
          font-size: 13px; color: rgba(240,236,228,0.35);
          display: flex; align-items: center; gap: 8px;
        }
        .ep-id-chip {
          font-family: monospace; font-size: 12px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px; padding: 2px 8px;
          color: rgba(232,184,109,0.7); letter-spacing: 1px;
        }

        /* LOAD STATE */
        .ep-load-state {
          display: flex; flex-direction: column;
          align-items: center; gap: 14px;
          padding: 60px 20px; color: rgba(240,236,228,0.4);
          font-size: 14px;
        }
        .ep-spinner {
          width: 34px; height: 34px;
          border: 3px solid rgba(232,184,109,0.2);
          border-top-color: #e8b86d; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* FORM */
        .ep-form { display: flex; flex-direction: column; gap: 24px; }
        .ep-field {
          display: flex; flex-direction: column; gap: 8px;
          transition: transform 0.2s;
        }
        .ep-field.focused { transform: translateX(3px); }
        .ep-label {
          display: flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; color: rgba(240,236,228,0.4);
          transition: color 0.2s;
        }
        .ep-field.focused .ep-label { color: #e8b86d; }
        .ep-label-icon { font-size: 14px; }
        .ep-input-wrap { position: relative; }
        .ep-input {
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
        .ep-input::-webkit-outer-spin-button,
        .ep-input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .ep-input::placeholder { color: rgba(240,236,228,0.2); }
        .ep-input:focus {
          border-color: rgba(232,184,109,0.45);
          background: rgba(232,184,109,0.04);
          box-shadow: 0 0 0 3px rgba(232,184,109,0.08);
        }
        .ep-field.has-value .ep-input { border-color: rgba(232,184,109,0.2); }

        /* PREVIEW */
        .ep-preview {
          display: flex; flex-direction: column; gap: 10px;
          animation: fadeUp 0.35s ease both;
        }
        .ep-preview-label {
          font-size: 11px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; color: rgba(240,236,228,0.3);
        }
        .ep-preview-img-wrap {
          width: 80px; height: 80px; border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(232,184,109,0.2);
          background: rgba(255,255,255,0.03);
        }
        .ep-preview-img { width: 100%; height: 100%; object-fit: cover; }

        /* ACTIONS */
        .ep-actions { display: flex; gap: 12px; margin-top: 8px; }
        .ep-cancel-btn {
          flex: 0 0 auto; padding: 14px 24px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; color: rgba(240,236,228,0.6);
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .ep-cancel-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.1); color: #f0ece4;
        }
        .ep-cancel-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .ep-submit {
          flex: 1; padding: 14px 24px;
          background: #e8b86d;
          border: none; border-radius: 14px;
          color: #0f0f13;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .ep-submit:hover:not(:disabled) {
          background: #f0c980;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(232,184,109,0.3);
        }
        .ep-submit.saving {
          background: rgba(232,184,109,0.5); cursor: not-allowed;
        }
        .ep-submit.done {
          background: #4caf7d; cursor: default;
          box-shadow: 0 8px 24px rgba(76,175,125,0.3);
        }
        .ep-submit:disabled { cursor: not-allowed; }
        .ep-spin {
          width: 16px; height: 16px;
          border: 2px solid rgba(15,15,19,0.3);
          border-top-color: #0f0f13;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        .ep-check { font-size: 18px; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* RESPONSIVE */
        @media (max-width: 800px) {
          .ep-body {
            grid-template-columns: 1fr;
            padding: 0 16px 40px;
            margin: 24px auto;
          }
          .ep-left { padding-right: 0; margin-bottom: 32px; }
          .ep-left-inner { position: static; }
          .ep-left-title { font-size: 28px; }
          .ep-card { padding: 24px 20px; }
          .ep-navbar { padding: 12px 16px; }
        }
      `}</style>
    </div>
  );
}

export default EditProduct;
