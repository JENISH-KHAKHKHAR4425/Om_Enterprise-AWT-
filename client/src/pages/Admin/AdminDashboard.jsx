import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const confirmDelete = (id) => setDeleteId(id);

  const handleDelete = async () => {
    await API.delete(`/products/${deleteId}`);
    setProducts(products.filter((p) => p._id !== deleteId));
    setDeleteId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin");
  };

  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products
    .filter((p) => selectedCategory === "All" || p.category === selectedCategory)
    .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="ad-root">

      {/* BG */}
      <div className="ad-bg">
        <div className="ad-blob ad-blob1" />
        <div className="ad-blob ad-blob2" />
        <div className="ad-grid" />
      </div>

      {/* ── NAVBAR ── */}
      <header className="ad-navbar">
        <div className="ad-nav-brand">
          <span className="ad-brand-dot" />
          <span className="ad-brand-name">Om Enterprise</span>
          <span className="ad-admin-tag">Admin</span>
        </div>
        <div className="ad-nav-right">
          <Link to="/admin/add" className="ad-add-btn">
            + Add Product
          </Link>
          <button className="ad-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="ad-body">

        {/* ── STATS ROW ── */}
        <div className="ad-stats">
          <div className="ad-stat-card">
            <span className="ad-stat-num">{products.length}</span>
            <span className="ad-stat-label">Total Products</span>
          </div>
          <div className="ad-stat-card">
            <span className="ad-stat-num">{categories.length - 1}</span>
            <span className="ad-stat-label">Categories</span>
          </div>
          <div className="ad-stat-card">
            <span className="ad-stat-num">
              ₹{products.length > 0 ? Math.min(...products.map(p => p.price || 0)) : 0}
            </span>
            <span className="ad-stat-label">Lowest Price</span>
          </div>
          <div className="ad-stat-card">
            <span className="ad-stat-num">
              ₹{products.length > 0 ? Math.max(...products.map(p => p.price || 0)) : 0}
            </span>
            <span className="ad-stat-label">Highest Price</span>
          </div>
        </div>

        {/* ── FILTER BAR ── */}
        <div className="ad-filter-bar">
          <div className="ad-search-wrap">
            <span className="ad-search-icon">⌕</span>
            <input
              className="ad-search"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="ad-cat-scroll">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={`ad-cat-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── RESULT COUNT ── */}
        <p className="ad-result-count">{filtered.length} products</p>

        {/* ── LOADING ── */}
        {loading && (
          <div className="ad-state">
            <div className="ad-spinner" />
            <p>Loading products…</p>
          </div>
        )}

        {/* ── PRODUCT TABLE ── */}
        {!loading && (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((p, i) => (
                  <tr key={p._id} style={{ animationDelay: `${i * 0.03}s` }} className="ad-row">
                    <td>
                      <div className="ad-thumb-wrap">
                        <img
                          className="ad-thumb"
                          src={p.image || "https://via.placeholder.com/60x60?text=?"}
                          alt={p.name}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/60x60?text=?"; }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="ad-product-name">{p.name}</span>
                    </td>
                    <td>
                      <span className="ad-cat-badge">{p.category || "—"}</span>
                    </td>
                    <td>
                      <span className="ad-price">₹{p.price}</span>
                    </td>
                    <td>
                      <div className="ad-actions">
                        <Link to={`/admin/edit/${p._id}`} className="ad-edit-btn">
                          ✏ Edit
                        </Link>
                        <button
                          className="ad-delete-btn"
                          onClick={() => confirmDelete(p._id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="ad-empty">No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteId && (
        <div className="ad-overlay" onClick={() => setDeleteId(null)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-icon">🗑</div>
            <h3 className="ad-modal-title">Delete Product?</h3>
            <p className="ad-modal-sub">This action cannot be undone.</p>
            <div className="ad-modal-actions">
              <button className="ad-modal-cancel" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="ad-modal-confirm" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ad-root {
          min-height: 100vh;
          background: #0f0f13;
          font-family: 'DM Sans', sans-serif;
          color: #f0ece4;
          position: relative;
        }

        /* BG */
        .ad-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .ad-blob {
          position: absolute; border-radius: 50%;
          filter: blur(100px); opacity: 0.1;
        }
        .ad-blob1 {
          width: 500px; height: 500px; background: #e8b86d;
          top: -150px; right: -100px;
          animation: blobFloat 10s ease-in-out infinite;
        }
        .ad-blob2 {
          width: 380px; height: 380px; background: #c87b5a;
          bottom: -100px; left: -80px;
          animation: blobFloat 13s ease-in-out infinite reverse;
        }
        @keyframes blobFloat {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(20px,-20px); }
        }
        .ad-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* NAVBAR */
        .ad-navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(15,15,19,0.9);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 32px;
        }
        .ad-nav-brand { display: flex; align-items: center; gap: 10px; }
        .ad-brand-dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: #e8b86d; box-shadow: 0 0 10px #e8b86d;
        }
        .ad-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #f0ece4;
        }
        .ad-admin-tag {
          font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: #0f0f13;
          background: #e8b86d; border-radius: 20px; padding: 3px 9px;
        }
        .ad-nav-right { display: flex; align-items: center; gap: 12px; }
        .ad-add-btn {
          background: #e8b86d; color: #0f0f13;
          border: none; border-radius: 20px;
          padding: 9px 20px; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          text-decoration: none; transition: all 0.25s;
        }
        .ad-add-btn:hover {
          background: #f0c980; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(232,184,109,0.3);
        }
        .ad-logout-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(240,236,228,0.6);
          border-radius: 20px; padding: 9px 18px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          cursor: pointer; transition: all 0.25s;
        }
        .ad-logout-btn:hover {
          background: rgba(255,80,80,0.1);
          border-color: rgba(255,80,80,0.3); color: #ff8080;
        }

        /* BODY */
        .ad-body {
          position: relative; z-index: 1;
          padding: 28px 32px 60px;
          max-width: 1300px; margin: auto;
        }

        /* STATS */
        .ad-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px; margin-bottom: 28px;
        }
        .ad-stat-card {
          background: #1c1c26;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 20px 24px;
          display: flex; flex-direction: column; gap: 4px;
          transition: border-color 0.25s;
        }
        .ad-stat-card:hover { border-color: rgba(232,184,109,0.25); }
        .ad-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 700; color: #e8b86d;
        }
        .ad-stat-label {
          font-size: 12px; color: rgba(240,236,228,0.4);
          text-transform: uppercase; letter-spacing: 1px;
        }

        /* FILTER BAR */
        .ad-filter-bar {
          background: #1c1c26;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 16px 20px;
          margin-bottom: 16px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .ad-search-wrap { position: relative; display: flex; align-items: center; }
        .ad-search-icon {
          position: absolute; left: 14px; font-size: 20px;
          color: rgba(240,236,228,0.3); pointer-events: none;
        }
        .ad-search {
          width: 100%; max-width: 360px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 25px; padding: 10px 18px 10px 42px;
          color: #f0ece4; font-family: 'DM Sans', sans-serif;
          font-size: 14px; outline: none; transition: all 0.25s;
        }
        .ad-search::placeholder { color: rgba(240,236,228,0.25); }
        .ad-search:focus {
          border-color: rgba(232,184,109,0.4);
          box-shadow: 0 0 0 3px rgba(232,184,109,0.08);
        }
        .ad-cat-scroll {
          display: flex; gap: 8px; overflow-x: auto;
          scrollbar-width: none;
        }
        .ad-cat-scroll::-webkit-scrollbar { display: none; }
        .ad-cat-pill {
          flex-shrink: 0; padding: 6px 16px; border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent; color: rgba(240,236,228,0.55);
          font-family: 'DM Sans', sans-serif; font-size: 12px;
          font-weight: 500; cursor: pointer; transition: all 0.2s;
          white-space: nowrap;
        }
        .ad-cat-pill:hover { border-color: rgba(232,184,109,0.35); color: #e8b86d; }
        .ad-cat-pill.active {
          background: #e8b86d; border-color: #e8b86d;
          color: #0f0f13; font-weight: 700;
        }

        .ad-result-count {
          font-size: 13px; color: rgba(240,236,228,0.35);
          margin-bottom: 12px;
        }

        /* STATE */
        .ad-state {
          display: flex; flex-direction: column;
          align-items: center; gap: 14px;
          padding: 80px 20px; color: rgba(240,236,228,0.4);
        }
        .ad-spinner {
          width: 34px; height: 34px;
          border: 3px solid rgba(232,184,109,0.2);
          border-top-color: #e8b86d; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* TABLE */
        .ad-table-wrap {
          background: #1c1c26;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; overflow: hidden;
        }
        .ad-table {
          width: 100%; border-collapse: collapse;
        }
        .ad-table thead tr {
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .ad-table th {
          text-align: left; padding: 14px 20px;
          font-size: 11px; font-weight: 600;
          letter-spacing: 1.3px; text-transform: uppercase;
          color: rgba(240,236,228,0.35);
        }
        .ad-row {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s;
          animation: fadeUp 0.4s ease both;
        }
        .ad-row:last-child { border-bottom: none; }
        .ad-row:hover { background: rgba(255,255,255,0.02); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ad-table td { padding: 14px 20px; vertical-align: middle; }

        .ad-thumb-wrap {
          width: 52px; height: 52px; border-radius: 10px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .ad-thumb { width: 100%; height: 100%; object-fit: cover; }

        .ad-product-name {
          font-weight: 600; font-size: 14px; color: #f0ece4;
        }

        .ad-cat-badge {
          display: inline-block; font-size: 10px; font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase;
          color: #e8b86d; background: rgba(232,184,109,0.1);
          border: 1px solid rgba(232,184,109,0.2);
          border-radius: 20px; padding: 3px 10px;
        }

        .ad-price {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #e8b86d;
        }

        .ad-actions { display: flex; gap: 8px; align-items: center; }
        .ad-edit-btn {
          background: rgba(232,184,109,0.1);
          border: 1px solid rgba(232,184,109,0.25);
          color: #e8b86d; border-radius: 8px;
          padding: 7px 14px; font-size: 12px; font-weight: 600;
          text-decoration: none; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .ad-edit-btn:hover {
          background: rgba(232,184,109,0.2); transform: translateY(-1px);
        }
        .ad-delete-btn {
          background: rgba(255,80,80,0.08);
          border: 1px solid rgba(255,80,80,0.2);
          color: #ff8080; border-radius: 8px;
          padding: 7px 14px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .ad-delete-btn:hover {
          background: rgba(255,80,80,0.18); transform: translateY(-1px);
        }

        .ad-empty {
          text-align: center; padding: 60px;
          color: rgba(240,236,228,0.3); font-size: 15px;
        }

        /* DELETE MODAL */
        .ad-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .ad-modal {
          background: #1c1c26;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px; padding: 40px 36px;
          max-width: 360px; width: 90%;
          text-align: center;
          animation: scaleIn 0.25s ease;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        .ad-modal-icon { font-size: 40px; margin-bottom: 14px; }
        .ad-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #f0ece4; margin-bottom: 8px;
        }
        .ad-modal-sub {
          font-size: 14px; color: rgba(240,236,228,0.4); margin-bottom: 28px;
        }
        .ad-modal-actions { display: flex; gap: 12px; }
        .ad-modal-cancel {
          flex: 1; padding: 13px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: rgba(240,236,228,0.7);
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .ad-modal-cancel:hover { background: rgba(255,255,255,0.1); }
        .ad-modal-confirm {
          flex: 1; padding: 13px;
          background: rgba(255,80,80,0.15);
          border: 1px solid rgba(255,80,80,0.3);
          border-radius: 12px; color: #ff6b6b;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 700; cursor: pointer; transition: all 0.2s;
        }
        .ad-modal-confirm:hover { background: rgba(255,80,80,0.28); }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .ad-stats { grid-template-columns: repeat(2, 1fr); }
          .ad-navbar { padding: 12px 16px; }
          .ad-body  { padding: 20px 16px 40px; }
          .ad-table th:nth-child(1),
          .ad-table td:nth-child(1) { display: none; }
        }
        @media (max-width: 600px) {
          .ad-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .ad-brand-name { font-size: 15px; }
          .ad-table th:nth-child(4),
          .ad-table td:nth-child(4) { display: none; }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;