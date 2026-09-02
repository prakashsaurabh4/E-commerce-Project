import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/global.css";

const OrderSuccess = () => {
  const location = useLocation();
  const orderId =
    location.state?.orderId ||
    "FS-" + Math.floor(100000 + Math.random() * 900000);

  // Approximate delivery date (+4 days)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const formattedDate = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="auth-container">
      <div
        className="auth-card"
        style={{
          maxWidth: "520px",
          textAlign: "center",
          padding: "48px 32px",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(34, 197, 94, 0.15)",
            border: "2px solid #22c55e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            color: "#22c55e",
            margin: "0 auto 24px auto",
            boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
          }}
        >
          ✓
        </div>

        <h2 style={{ fontSize: "1.8rem", marginBottom: "8px", paddingLeft: 0 }}>
          Order Confirmed!
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "1rem", margin: "0 0 24px 0" }}>
          Thank you for your purchase. We have received your order and are
          preparing it for shipment.
        </p>

        <div
          style={{
            background: "#11131c",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            marginBottom: "28px",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.95rem",
            }}
          >
            <span style={{ color: "#94a3b8" }}>Order ID:</span>
            <span style={{ color: "#f8fafc", fontWeight: "700" }}>
              #{orderId}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.95rem",
            }}
          >
            <span style={{ color: "#94a3b8" }}>Estimated Delivery:</span>
            <span style={{ color: "#f97316", fontWeight: "600" }}>
              {formattedDate}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.95rem",
            }}
          >
            <span style={{ color: "#94a3b8" }}>Status:</span>
            <span style={{ color: "#22c55e", fontWeight: "600" }}>
              Processing
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            to="/profile"
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: "700",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(249, 115, 22, 0.35)",
            }}
          >
            View My Orders
          </Link>

          <Link
            to="/"
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              background: "transparent",
              color: "#94a3b8",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              fontWeight: "600",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
