import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import ProductCard from "../../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("oe_wishlist")) || []; }
    catch { return []; }
  });
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlistToast, setWishlistToast] = useState(null); // { msg, type }
  const gridRef = useRef(null);
  const categoryMenuRef = useRef(null);

  useEffect(() => {
    API.get("/api/products")
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target))
        setShowCategoryMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Persist wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("oe_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Auto-hide toast
  useEffect(() => {
    if (!wishlistToast) return;
    const t = setTimeout(() => setWishlistToast(null), 2200);
    return () => clearTimeout(t);
  }, [wishlistToast]);

  const toggleWishlist = (product) => {
    const id = product?._id;
    if (!id) return;
    const exists = wishlist.some((w) => w._id === id);
    if (exists) {
      setWishlist((prev) => prev.filter((w) => w._id !== id));
      setWishlistToast({ msg: "Removed from wishlist", type: "remove" });
    } else {
      setWishlist((prev) => [...prev, product]);
      setWishlistToast({ msg: "Added to wishlist ♥", type: "add" });
    }
  };

  const isWishlisted = (id) => wishlist.some((w) => w._id === id);

  const categories = [
    "All",
    ...new Set(products.map((p) => p?.category).filter(Boolean)),
  ];

  const filteredProducts = products
    .filter((p) => selectedCategory === "All" || p?.category === selectedCategory)
    .filter((p) => p?.name?.toLowerCase().includes(search.toLowerCase()));

  const wishlistFiltered = wishlist.filter((p) =>
    p?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home">

      {/* ── TOAST ── */}
      {wishlistToast && (
        <div className={`wl-toast ${wishlistToast.type}`}>
          <span className="wl-toast-icon">{wishlistToast.type === "add" ? "♥" : "♡"}</span>
          {wishlistToast.msg}
        </div>
      )}

      {/* ── NAVBAR ── */}
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-brand">
          <span className="brand-dot" />
          <span className="brand-name">Om Enterprise</span>
        </div>
        <div className="nav-right">
          <span className="wholesale-badge">Wholesale Only</span>

          {/* Wishlist trigger */}
          <button className="wl-nav-btn" onClick={() => setShowWishlist(true)}>
            <span className="wl-heart-icon">♥</span>
            <span className="wl-nav-label">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="wl-nav-count">{wishlist.length}</span>
            )}
          </button>

          <button className="contact-btn" onClick={() => setShowContact(true)}>
            Contact Us
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="blob blob1" />
          <div className="blob blob2" />
          <div className="blob blob3" />
          <div className="grid-overlay" />
        </div>
        <div className="hero-content">
          <div className="hero-tag">✦ Premium Wholesale Cosmetics</div>
          <h1 className="hero-title">
            Beauty Products<br />
            <span className="hero-accent">At Wholesale Price</span>
          </h1>
          <p className="hero-sub">
            Curated collection of premium cosmetics &amp; skincare.<br />
            <strong>We do not sell retail.</strong>
          </p>
          <button
            className="hero-cta"
            onClick={() => gridRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            Browse Collection ↓
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-num">{products.length}+</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{categories.length - 1}+</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">100%</span>
            <span className="stat-label">Authentic</span>
          </div>
          <div className="stat-card wl-stat-card" onClick={() => setShowWishlist(true)}>
            <span className="stat-num wl-stat-num">{wishlist.length}</span>
            <span className="stat-label">Saved ♥</span>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div className="filter-section" ref={gridRef}>
        <div className="filter-top">
          <h2 className="section-title">Our Collection</h2>
          <div className="filter-controls">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="cat-dropdown-wrap" ref={categoryMenuRef}>
              <button
                className={`cat-filter-btn ${showCategoryMenu ? "open" : ""}`}
                onClick={() => setShowCategoryMenu((v) => !v)}
              >
                <span className="cat-filter-icon">▤</span>
                <span>{selectedCategory === "All" ? "All Categories" : selectedCategory}</span>
                <span className={`cat-filter-arrow ${showCategoryMenu ? "up" : ""}`}>▾</span>
              </button>
              {showCategoryMenu && (
                <div className="cat-dropdown">
                  <div className="cat-dropdown-header">
                    <span>Select Category</span>
                    {selectedCategory !== "All" && (
                      <button className="cat-clear-btn" onClick={() => { setSelectedCategory("All"); setShowCategoryMenu(false); }}>
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="cat-grid">
                    {categories.map((cat, i) => (
                      <button
                        key={i}
                        className={`cat-grid-item ${selectedCategory === cat ? "active" : ""}`}
                        onClick={() => { setSelectedCategory(cat); setShowCategoryMenu(false); }}
                      >
                        <span className="cat-check">{selectedCategory === cat ? "✓" : ""}</span>
                        <span className="cat-grid-name">{cat}</span>
                        <span className="cat-grid-count">
                          {cat === "All" ? products.length : products.filter((p) => p?.category === cat).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {selectedCategory !== "All" && (
          <div className="active-filter-row">
            <span className="active-filter-label">Filtering by:</span>
            <span className="active-filter-tag">
              {selectedCategory}
              <button className="active-filter-remove" onClick={() => setSelectedCategory("All")}>✕</button>
            </span>
          </div>
        )}
      </div>

      {/* ── PRODUCT GRID ── */}
      <div className="grid-section">
        {loading && (
          <div className="state-box">
            <div className="spinner" />
            <p>Loading products…</p>
          </div>
        )}
        {error && <div className="state-box error-state">⚠ {error}</div>}
        {!loading && !error && (
          <>
            <p className="result-count">
              {filteredProducts.length} products found
              {selectedCategory !== "All" && ` in "${selectedCategory}"`}
            </p>
            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p, i) => (
                  <div
                    className="card-animate card-wrap"
                    key={p?._id || i}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {/* Wishlist heart button overlaid on card */}
                    <button
                      className={`wl-heart-btn ${isWishlisted(p?._id) ? "active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                      title={isWishlisted(p?._id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isWishlisted(p?._id) ? "♥" : "♡"}
                    </button>
                    <ProductCard product={p} />
                  </div>
                ))
              ) : (
                <div className="state-box">No products found 😔</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-brand">Om Enterprise</div>
        <p className="footer-note">Premium Wholesale Cosmetics · Rajkot, Gujarat</p>
        <p className="footer-note" style={{ opacity: 0.5, fontSize: "12px" }}>
          We do not sell retail. Wholesale enquiries only.
        </p>
      </footer>

      {/* ── CONTACT MODAL ── */}
      {showContact && (
        <div className="modal-overlay" onClick={() => setShowContact(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowContact(false)}>✕</button>
            <div className="modal-icon">📞</div>
            <h3 className="modal-title">Contact Us</h3>
            <div className="modal-info">
              <div className="info-row">
                <span className="info-icon">📱</span>
                <span>+91 94844 64405</span>
              </div>
              <div className="info-row">
                <span className="info-icon">📍</span>
                <span>Rajkot, Gujarat, India</span>
              </div>
              <div className="info-row">
                <span className="info-icon">⚠️</span>
                <span>Wholesale enquiries only — No retail sales</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WISHLIST DRAWER ── */}
      {showWishlist && (
        <div className="wl-overlay" onClick={() => setShowWishlist(false)}>
          <div className="wl-drawer" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="wl-header">
              <div className="wl-header-left">
                <span className="wl-header-icon">♥</span>
                <div>
                  <div className="wl-header-title">My Wishlist</div>
                  <div className="wl-header-sub">{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved</div>
                </div>
              </div>
              <button className="wl-close" onClick={() => setShowWishlist(false)}>✕</button>
            </div>

            {/* Empty state */}
            {wishlist.length === 0 ? (
              <div className="wl-empty">
                <div className="wl-empty-heart">♡</div>
                <div className="wl-empty-title">Your wishlist is empty</div>
                <div className="wl-empty-sub">Tap the ♡ on any product to save it here</div>
                <button className="wl-empty-cta" onClick={() => setShowWishlist(false)}>
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                <div className="wl-list">
                  {wishlist.map((p, i) => (
                    <div className="wl-item" key={p._id || i} style={{ animationDelay: `${i * 0.04}s` }}>
                      {/* Product image or placeholder */}
                      <div className="wl-item-img">
                        {p?.image
                          ? <img src={p.image} alt={p.name} />
                          : <span className="wl-item-img-placeholder">✦</span>
                        }
                      </div>
                      <div className="wl-item-info">
                        <div className="wl-item-name">{p?.name || "Product"}</div>
                        {p?.category && <div className="wl-item-cat">{p.category}</div>}
                        {p?.price && <div className="wl-item-price">₹{p.price}</div>}
                      </div>
                      <button
                        className="wl-item-remove"
                        onClick={() => toggleWishlist(p)}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer actions */}
                <div className="wl-footer">
                  <button
                    className="wl-clear-btn"
                    onClick={() => { setWishlist([]); setWishlistToast({ msg: "Wishlist cleared", type: "remove" }); }}
                  >
                    Clear All
                  </button>
                  <button className="wl-enquire-btn" onClick={() => { setShowWishlist(false); setShowContact(true); }}>
                    Enquire About These →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0f0f13; color: #f0ece4; min-height: 100vh; }

        /* NAVBAR */
        .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; display: flex; justify-content: space-between; align-items: center; padding: 18px 32px; transition: all 0.3s ease; }
        .navbar.scrolled { background: rgba(15,15,19,0.92); backdrop-filter: blur(14px); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 12px 32px; }
        .nav-brand { display: flex; align-items: center; gap: 10px; }
        .brand-dot { width: 10px; height: 10px; border-radius: 50%; background: #e8b86d; box-shadow: 0 0 12px #e8b86d; }
        .brand-name { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #f0ece4; letter-spacing: 0.5px; }
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .wholesale-badge { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #e8b86d; border: 1px solid rgba(232,184,109,0.35); padding: 5px 12px; border-radius: 20px; }
        .contact-btn { background: #e8b86d; color: #0f0f13; border: none; padding: 9px 20px; border-radius: 25px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; }
        .contact-btn:hover { background: #f0c980; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,184,109,0.35); }

        /* WISHLIST NAV BUTTON */
        .wl-nav-btn { position: relative; display: flex; align-items: center; gap: 7px; background: rgba(232,184,109,0.08); border: 1px solid rgba(232,184,109,0.3); color: #e8b86d; padding: 8px 16px; border-radius: 25px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.25s; }
        .wl-nav-btn:hover { background: rgba(232,184,109,0.16); border-color: rgba(232,184,109,0.6); transform: translateY(-1px); }
        .wl-heart-icon { font-size: 15px; }
        .wl-nav-label { font-weight: 500; }
        .wl-nav-count { position: absolute; top: -6px; right: -6px; background: #e8b86d; color: #0f0f13; font-size: 10px; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }

        /* HERO */
        .hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 120px 24px 80px; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; z-index: 0; }
        .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.18; }
        .blob1 { width: 500px; height: 500px; background: #e8b86d; top: -100px; left: -100px; animation: floatBlob 8s ease-in-out infinite; }
        .blob2 { width: 400px; height: 400px; background: #c87b5a; bottom: -80px; right: -80px; animation: floatBlob 10s ease-in-out infinite reverse; }
        .blob3 { width: 300px; height: 300px; background: #9b5de5; top: 50%; left: 60%; animation: floatBlob 12s ease-in-out infinite; }
        @keyframes floatBlob { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-30px) scale(1.08); } }
        .grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 50px 50px; }
        .hero-content { position: relative; z-index: 1; max-width: 680px; }
        .hero-tag { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #e8b86d; margin-bottom: 24px; animation: fadeUp 0.6s ease both; }
        .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(42px, 7vw, 72px); font-weight: 900; line-height: 1.1; color: #f0ece4; margin-bottom: 24px; animation: fadeUp 0.6s ease 0.1s both; }
        .hero-accent { color: #e8b86d; font-style: italic; }
        .hero-sub { font-size: 17px; color: rgba(240,236,228,0.65); line-height: 1.7; margin-bottom: 36px; animation: fadeUp 0.6s ease 0.2s both; }
        .hero-sub strong { color: #e8b86d; }
        .hero-cta { background: transparent; border: 1.5px solid rgba(232,184,109,0.6); color: #e8b86d; padding: 14px 32px; border-radius: 30px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.3s; animation: fadeUp 0.6s ease 0.3s both; }
        .hero-cta:hover { background: rgba(232,184,109,0.12); border-color: #e8b86d; transform: translateY(-2px); }
        .hero-stats { position: relative; z-index: 1; display: flex; gap: 16px; margin-top: 60px; animation: fadeUp 0.6s ease 0.4s both; flex-wrap: wrap; justify-content: center; }
        .stat-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(10px); border-radius: 16px; padding: 16px 28px; text-align: center; }
        .wl-stat-card { cursor: pointer; border-color: rgba(232,184,109,0.2); transition: all 0.25s; }
        .wl-stat-card:hover { background: rgba(232,184,109,0.08); border-color: rgba(232,184,109,0.4); transform: translateY(-2px); }
        .stat-num { display: block; font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #e8b86d; }
        .wl-stat-num { color: #e8b86d; }
        .stat-label { font-size: 12px; color: rgba(240,236,228,0.5); text-transform: uppercase; letter-spacing: 1px; }

        /* FILTER SECTION */
        .filter-section { background: #16161e; border-top: 1px solid rgba(255,255,255,0.06); padding: 28px 32px 20px; position: sticky; top: 57px; z-index: 100; }
        .filter-top { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #f0ece4; }
        .filter-controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .search-wrap { position: relative; display: flex; align-items: center; }
        .search-icon { position: absolute; left: 14px; font-size: 20px; color: rgba(240,236,228,0.35); pointer-events: none; }
        .search-input { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 25px; padding: 10px 18px 10px 42px; color: #f0ece4; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; width: 220px; transition: all 0.3s; }
        .search-input::placeholder { color: rgba(240,236,228,0.35); }
        .search-input:focus { border-color: rgba(232,184,109,0.5); background: rgba(255,255,255,0.08); box-shadow: 0 0 0 3px rgba(232,184,109,0.1); }
        .cat-dropdown-wrap { position: relative; }
        .cat-filter-btn { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: rgba(240,236,228,0.85); padding: 10px 18px; border-radius: 25px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.25s; white-space: nowrap; }
        .cat-filter-btn:hover, .cat-filter-btn.open { border-color: rgba(232,184,109,0.5); background: rgba(232,184,109,0.08); color: #e8b86d; }
        .cat-filter-icon { font-size: 16px; }
        .cat-filter-arrow { font-size: 12px; transition: transform 0.25s; display: inline-block; }
        .cat-filter-arrow.up { transform: rotate(180deg); }
        .cat-dropdown { position: absolute; top: calc(100% + 10px); right: 0; background: #1e1e2a; border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 16px; width: 360px; z-index: 500; box-shadow: 0 20px 60px rgba(0,0,0,0.5); animation: dropDown 0.2s ease; }
        @keyframes dropDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .cat-dropdown-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.07); font-size: 12px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: rgba(240,236,228,0.4); }
        .cat-clear-btn { background: rgba(232,184,109,0.12); border: 1px solid rgba(232,184,109,0.3); color: #e8b86d; padding: 3px 10px; border-radius: 10px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .cat-clear-btn:hover { background: rgba(232,184,109,0.2); }
        .cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; max-height: 340px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(232,184,109,0.3) transparent; }
        .cat-grid::-webkit-scrollbar { width: 4px; }
        .cat-grid::-webkit-scrollbar-thumb { background: rgba(232,184,109,0.3); border-radius: 4px; }
        .cat-grid-item { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 9px 10px; cursor: pointer; transition: all 0.2s; text-align: left; font-family: 'DM Sans', sans-serif; }
        .cat-grid-item:hover { background: rgba(232,184,109,0.08); border-color: rgba(232,184,109,0.3); }
        .cat-grid-item.active { background: rgba(232,184,109,0.15); border-color: rgba(232,184,109,0.5); }
        .cat-check { width: 14px; flex-shrink: 0; font-size: 11px; font-weight: 700; color: #e8b86d; }
        .cat-grid-name { flex: 1; font-size: 12px; font-weight: 500; color: rgba(240,236,228,0.8); line-height: 1.3; }
        .cat-grid-item.active .cat-grid-name { color: #e8b86d; }
        .cat-grid-count { font-size: 10px; font-weight: 600; color: rgba(240,236,228,0.3); background: rgba(255,255,255,0.05); padding: 1px 5px; border-radius: 8px; flex-shrink: 0; }
        .cat-grid-item.active .cat-grid-count { color: #e8b86d; background: rgba(232,184,109,0.15); }
        .active-filter-row { display: flex; align-items: center; gap: 8px; margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.06); }
        .active-filter-label { font-size: 12px; color: rgba(240,236,228,0.35); }
        .active-filter-tag { display: flex; align-items: center; gap: 6px; background: rgba(232,184,109,0.12); border: 1px solid rgba(232,184,109,0.35); color: #e8b86d; font-size: 12px; font-weight: 600; padding: 4px 10px 4px 12px; border-radius: 20px; }
        .active-filter-remove { background: none; border: none; color: #e8b86d; cursor: pointer; font-size: 10px; padding: 0; opacity: 0.7; transition: opacity 0.2s; }
        .active-filter-remove:hover { opacity: 1; }

        /* PRODUCT GRID */
        .grid-section { background: #0f0f13; padding: 28px 32px 60px; min-height: 400px; }
        .result-count { font-size: 13px; color: rgba(240,236,228,0.4); margin-bottom: 20px; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 20px; max-width: 1300px; margin: auto; }
        .card-wrap { position: relative; }
        .card-animate { animation: fadeUp 0.5s ease both; }

        /* WISHLIST HEART ON CARD */
        .wl-heart-btn { position: absolute; top: 10px; right: 10px; z-index: 10; width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.15); background: rgba(15,15,19,0.75); backdrop-filter: blur(6px); color: rgba(240,236,228,0.5); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1); line-height: 1; }
        .wl-heart-btn:hover { border-color: rgba(232,184,109,0.5); color: #e8b86d; transform: scale(1.12); background: rgba(15,15,19,0.9); }
        .wl-heart-btn.active { background: rgba(232,184,109,0.15); border-color: rgba(232,184,109,0.6); color: #e8b86d; }
        .wl-heart-btn.active:hover { background: rgba(220,80,80,0.15); border-color: rgba(220,80,80,0.5); color: #e06060; }

        /* STATES */
        .state-box { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 80px 20px; color: rgba(240,236,228,0.45); font-size: 15px; grid-column: 1 / -1; }
        .error-state { color: #ff6b6b; }
        .spinner { width: 36px; height: 36px; border: 3px solid rgba(232,184,109,0.2); border-top-color: #e8b86d; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* FOOTER */
        .footer { background: #0a0a0e; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; padding: 40px 20px; }
        .footer-brand { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #e8b86d; margin-bottom: 8px; }
        .footer-note { font-size: 13px; color: rgba(240,236,228,0.4); margin-top: 6px; }

        /* CONTACT MODAL */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); z-index: 2000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease; }
        .modal { background: #1c1c26; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 40px; max-width: 380px; width: 90%; position: relative; animation: scaleIn 0.25s ease; }
        .modal-close { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.08); border: none; color: #f0ece4; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }
        .modal-icon { font-size: 36px; margin-bottom: 12px; }
        .modal-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: #f0ece4; margin-bottom: 24px; }
        .modal-info { display: flex; flex-direction: column; gap: 16px; }
        .info-row { display: flex; align-items: flex-start; gap: 12px; font-size: 15px; color: rgba(240,236,228,0.8); }
        .info-icon { font-size: 18px; flex-shrink: 0; }

        /* WISHLIST DRAWER */
        .wl-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(8px); z-index: 3000; display: flex; justify-content: flex-end; animation: fadeIn 0.2s ease; }
        .wl-drawer { width: 420px; max-width: 100vw; height: 100%; background: #16161e; border-left: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; animation: slideInRight 0.3s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        .wl-header { display: flex; align-items: center; justify-content: space-between; padding: 28px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .wl-header-left { display: flex; align-items: center; gap: 14px; }
        .wl-header-icon { font-size: 28px; color: #e8b86d; line-height: 1; }
        .wl-header-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #f0ece4; }
        .wl-header-sub { font-size: 12px; color: rgba(240,236,228,0.4); margin-top: 2px; }
        .wl-close { background: rgba(255,255,255,0.07); border: none; color: rgba(240,236,228,0.6); width: 34px; height: 34px; border-radius: 50%; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
        .wl-close:hover { background: rgba(255,255,255,0.12); color: #f0ece4; }

        /* Empty state */
        .wl-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; }
        .wl-empty-heart { font-size: 64px; color: rgba(232,184,109,0.25); margin-bottom: 20px; animation: pulse 2.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.25; } 50% { transform: scale(1.08); opacity: 0.4; } }
        .wl-empty-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #f0ece4; margin-bottom: 10px; }
        .wl-empty-sub { font-size: 14px; color: rgba(240,236,228,0.4); line-height: 1.6; margin-bottom: 28px; }
        .wl-empty-cta { background: rgba(232,184,109,0.1); border: 1px solid rgba(232,184,109,0.35); color: #e8b86d; padding: 11px 28px; border-radius: 25px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.25s; }
        .wl-empty-cta:hover { background: rgba(232,184,109,0.18); transform: translateY(-1px); }

        /* Wishlist items list */
        .wl-list { flex: 1; overflow-y: auto; padding: 16px 24px; display: flex; flex-direction: column; gap: 10px; scrollbar-width: thin; scrollbar-color: rgba(232,184,109,0.2) transparent; }
        .wl-list::-webkit-scrollbar { width: 4px; }
        .wl-list::-webkit-scrollbar-thumb { background: rgba(232,184,109,0.2); border-radius: 4px; }
        .wl-item { display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 12px 14px; animation: fadeUp 0.35s ease both; transition: border-color 0.2s; }
        .wl-item:hover { border-color: rgba(232,184,109,0.25); }
        .wl-item-img { width: 52px; height: 52px; border-radius: 10px; background: rgba(232,184,109,0.08); border: 1px solid rgba(232,184,109,0.15); overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .wl-item-img img { width: 100%; height: 100%; object-fit: cover; }
        .wl-item-img-placeholder { font-size: 20px; color: rgba(232,184,109,0.4); }
        .wl-item-info { flex: 1; min-width: 0; }
        .wl-item-name { font-size: 14px; font-weight: 500; color: #f0ece4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .wl-item-cat { font-size: 11px; color: rgba(240,236,228,0.4); margin-top: 3px; text-transform: uppercase; letter-spacing: 0.8px; }
        .wl-item-price { font-size: 13px; color: #e8b86d; font-weight: 600; margin-top: 4px; }
        .wl-item-remove { background: none; border: none; color: rgba(240,236,228,0.25); font-size: 13px; cursor: pointer; padding: 6px; flex-shrink: 0; transition: color 0.2s; border-radius: 6px; }
        .wl-item-remove:hover { color: #ff6b6b; background: rgba(255,107,107,0.1); }

        /* Drawer footer */
        .wl-footer { padding: 16px 24px 28px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; gap: 10px; }
        .wl-clear-btn { flex: 0 0 auto; background: none; border: 1px solid rgba(255,255,255,0.12); color: rgba(240,236,228,0.5); padding: 11px 18px; border-radius: 25px; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .wl-clear-btn:hover { border-color: #ff6b6b; color: #ff6b6b; background: rgba(255,107,107,0.08); }
        .wl-enquire-btn { flex: 1; background: #e8b86d; color: #0f0f13; border: none; padding: 12px 20px; border-radius: 25px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; }
        .wl-enquire-btn:hover { background: #f0c980; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,184,109,0.3); }

        /* TOAST */
        .wl-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); background: #1e1e2a; border: 1px solid rgba(232,184,109,0.35); color: #f0ece4; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; padding: 11px 22px; border-radius: 30px; display: flex; align-items: center; gap: 8px; z-index: 9999; box-shadow: 0 8px 30px rgba(0,0,0,0.4); animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both; white-space: nowrap; }
        .wl-toast.add { border-color: rgba(232,184,109,0.5); }
        .wl-toast.remove { border-color: rgba(255,255,255,0.15); color: rgba(240,236,228,0.7); }
        .wl-toast-icon { font-size: 15px; color: #e8b86d; }
        @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.9); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }

        /* ANIMATIONS */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }

        /* RESPONSIVE */
        @media (max-width: 640px) {
          .navbar { padding: 14px 16px; }
          .wholesale-badge { display: none; }
          .wl-nav-label { display: none; }
          .hero-stats { flex-wrap: wrap; justify-content: center; }
          .filter-section { padding: 20px 16px 16px; top: 48px; }
          .filter-top { flex-direction: column; align-items: flex-start; }
          .filter-controls { width: 100%; }
          .search-input { width: 100%; }
          .cat-dropdown { width: calc(100vw - 32px); right: auto; left: 0; }
          .cat-grid { grid-template-columns: 1fr 1fr; }
          .grid-section { padding: 20px 16px 40px; }
          .products-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; }
          .wl-drawer { width: 100vw; }
          .wl-toast { bottom: 16px; font-size: 12px; padding: 10px 18px; }
        }
      `}</style>
    </div>
  );
}

export default Home;
