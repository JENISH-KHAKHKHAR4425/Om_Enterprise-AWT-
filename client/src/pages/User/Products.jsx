import { useEffect, useState } from "react";
import API from "../../services/api";
import ProductCard from "../../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // FILTER by search
  const filteredProducts = products.filter((p) =>
    p?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="productsPage">

      {/* ================= HEADER ================= */}
      <div className="header">
        <h2>🛍 All Products</h2>
        <p>Wholesale collection by Om Enterprise</p>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="searchBox"
        />
      </div>

      {/* ================= STATES ================= */}
      {loading && <p className="center">Loading products...</p>}

      {/* ================= PRODUCTS GRID ================= */}
      {!loading && (
        <div className="grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p, i) => (
              <div className="cardWrap" key={p._id || i}>
                <ProductCard product={p} />
              </div>
            ))
          ) : (
            <p className="center">No products found 😔</p>
          )}
        </div>
      )}

      {/* ================= STYLES ================= */}
      <style>{`
        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: #f5f7fa;
        }

        .productsPage {
          padding: 20px;
        }

        /* HEADER */
        .header {
          text-align: center;
          margin-bottom: 20px;
        }

        .header h2 {
          margin: 0;
          font-size: 26px;
          color: #ff4d6d;
        }

        .header p {
          color: #666;
          margin-top: 5px;
        }

        /* SEARCH */
        .searchBox {
          margin-top: 15px;
          padding: 10px 15px;
          width: 100%;
          max-width: 400px;
          border: 1px solid #ddd;
          border-radius: 25px;
          outline: none;
          transition: 0.3s;
        }

        .searchBox:focus {
          border-color: #ff4d6d;
          box-shadow: 0 0 10px rgba(255,77,109,0.2);
        }

        /* GRID */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
          margin-top: 20px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .cardWrap {
          animation: fadeUp 0.4s ease;
        }

        /* STATES */
        .center {
          text-align: center;
          margin-top: 40px;
          color: #666;
        }

        /* ANIMATION */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* MOBILE */
        @media (max-width: 600px) {
          .header h2 {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}

export default Products;