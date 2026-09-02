import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/global.css";

const getItemImage = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("watch")) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
  }
  if (n.includes("headphone")) {
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80";
  }
  if (n.includes("chair")) {
    return "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=80";
  }
  if (n.includes("shirt") || n.includes("cotton")) {
    return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80";
  }
  return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80";
};

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(items);
  }, []);

  const updateQuantity = (id, newQty) => {
    const updated = cartItems.map((item) =>
      item._id === id ? { ...item, qty: Math.max(1, newQty) } : item,
    );
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.qty || 1),
    0,
  );

  const handleCheckout = () => {
    // Navigate straight to Checkout address form
    navigate("/checkout");
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ color: "#f8fafc", marginBottom: "24px" }}>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div
          style={{
            background: "rgba(22, 25, 38, 0.7)",
            padding: "48px 20px",
            borderRadius: "16px",
            textAlign: "center",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <p
            style={{
              color: "#94a3b8",
              fontSize: "1.1rem",
              marginBottom: "20px",
            }}
          >
            Your cart is currently empty.
          </p>
          <Link
            to="/"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              display: "inline-block",
            }}
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "30px",
          }}
        >
          {/* Cart Item List */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {cartItems.map((item) => {
              const displayImg = getItemImage(item.name);
              return (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#161926",
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <img
                    src={displayImg}
                    alt={item.name}
                    style={{
                      width: "72px",
                      height: "72px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      background: "#11131c",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = displayImg;
                    }}
                  />
                  <div style={{ flex: 1, marginLeft: "18px" }}>
                    <h4
                      style={{
                        color: "#f8fafc",
                        margin: "0 0 6px 0",
                        fontSize: "1rem",
                      }}
                    >
                      {item.name}
                    </h4>
                    <p
                      style={{ color: "#f97316", fontWeight: "700", margin: 0 }}
                    >
                      ₹{item.price}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <select
                      value={item.qty}
                      onChange={(e) =>
                        updateQuantity(item._id, Number(e.target.value))
                      }
                      style={{
                        background: "#11131c",
                        color: "#fafafa",
                        border: "1px solid rgba(255,255,255,0.15)",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeItem(item._id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        padding: "4px 8px",
                      }}
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div
            style={{
              background: "#161926",
              padding: "24px",
              borderRadius: "14px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              height: "fit-content",
            }}
          >
            <h3
              style={{ color: "#f8fafc", marginTop: 0, marginBottom: "18px" }}
            >
              Order Summary
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#94a3b8",
                marginBottom: "20px",
              }}
            >
              <span>
                Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items)
              </span>
              <span
                style={{
                  color: "#f97316",
                  fontWeight: "700",
                  fontSize: "1.25rem",
                }}
              >
                ₹{subtotal}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                color: "#fff",
                border: "none",
                padding: "14px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(249, 115, 22, 0.35)",
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
