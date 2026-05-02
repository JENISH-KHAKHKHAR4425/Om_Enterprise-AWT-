import React, { useState } from "react";

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="pc-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE */}
      <div className="pc-img-wrap">
        <img
          src={
            imgError || !product?.image
              ? "https://via.placeholder.com/300x300?text=No+Image"
              : product.image
          }
          alt={product?.name || "Product"}
          className="pc-img"
          onError={() => setImgError(true)}
        />
        {/* Category badge over image */}
        <span className="pc-cat-badge">
          {product?.category || "Uncategorized"}
        </span>

        {/* Hover overlay */}
        <div className={`pc-overlay ${hovered ? "visible" : ""}`}>
          <span className="pc-overlay-text">Wholesale Only</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="pc-body">
        <h3 className="pc-name">{product?.name || "Unnamed Product"}</h3>

        <div className="pc-divider" />

        <div className="pc-footer">
          <div className="pc-price-wrap">
            <span className="pc-price-label">Price</span>
            <span className="pc-price">₹{product?.price ?? 0}</span>
          </div>
          <div className="pc-dot-glow" />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .pc-card {
          background: #1c1c26;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }

        .pc-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(232,184,109,0.25);
          border-color: rgba(232,184,109,0.25);
        }

        /* IMAGE */
        .pc-img-wrap {
          position: relative;
          width: 100%;
          height: 210px;
          overflow: hidden;
          background: #13131a;
        }

        .pc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
          display: block;
        }

        .pc-card:hover .pc-img {
          transform: scale(1.07);
        }

        /* Category badge */
        .pc-cat-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(15,15,19,0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(232,184,109,0.3);
          color: #e8b86d;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
        }

        /* Hover overlay */
        .pc-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(232,184,109,0.18) 0%,
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 14px;
        }
        .pc-overlay.visible {
          opacity: 1;
        }
        .pc-overlay-text {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #e8b86d;
        }

        /* BODY */
        .pc-body {
          padding: 16px 16px 14px;
        }

        .pc-name {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 700;
          color: #f0ece4;
          margin: 0 0 12px 0;
          line-height: 1.35;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pc-divider {
          height: 1px;
          background: linear-gradient(
            to right,
            rgba(232,184,109,0.4),
            transparent
          );
          margin-bottom: 12px;
        }

        .pc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pc-price-wrap {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .pc-price-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(240,236,228,0.35);
        }

        .pc-price {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #e8b86d;
          line-height: 1;
        }

        /* Glowing dot indicator */
        .pc-dot-glow {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e8b86d;
          box-shadow: 0 0 8px #e8b86d, 0 0 16px rgba(232,184,109,0.4);
          animation: pulse 2.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
}

export default ProductCard;