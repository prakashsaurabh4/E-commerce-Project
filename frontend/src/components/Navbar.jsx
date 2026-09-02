import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [totalItems, setTotalItems] = useState(0);

  // Sync cart count whenever route changes or localStorage updates
  const calculateCartCount = () => {
    try {
      const items = JSON.parse(localStorage.getItem("cartItems")) || [];
      const count = items.reduce(
        (acc, item) => acc + (Number(item.qty) || 1),
        0,
      );
      setTotalItems(count);
    } catch (err) {
      setTotalItems(0);
    }
  };

  useEffect(() => {
    calculateCartCount();

    window.addEventListener("cartUpdated", calculateCartCount);
    window.addEventListener("storage", calculateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", calculateCartCount);
      window.removeEventListener("storage", calculateCartCount);
    };
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Resilient admin check covering both schema styles
  const isAdmin =
    user?.role === "admin" ||
    user?.isAdmin === true ||
    user?.isAdmin === "true";

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
          }}
        >
          <img
            src="/logo.png"
            alt="FastShop"
            style={{
              height: "38px",
              width: "38px",
              borderRadius: "8px",
              objectFit: "contain",
              filter: "drop-shadow(0 2px 10px rgba(249, 115, 22, 0.45))",
            }}
          />
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.45rem",
              letterSpacing: "-0.5px",
              color: "#fafafa",
            }}
          >
            FastShop
          </span>
        </Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/">Shop</Link>
        </li>
        <li>
          <Link to="/cart" className="cart-link">
            <span className="cart-icon">🛒</span>
            <span>Cart</span>
            <span className="cart-count">{totalItems}</span>
          </Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/profile">Hi, {user.name}</Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  to="/admin/dashboard"
                  style={{
                    color: "#f97316",
                    fontWeight: "700",
                  }}
                >
                  Admin
                </Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
