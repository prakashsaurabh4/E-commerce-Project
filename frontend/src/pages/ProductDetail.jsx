import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/global.css";

// Dynamic image resolver based on item name
const getItemImage = (productName = "") => {
  const name = productName.toLowerCase();

  if (name.includes("watch")) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
  }
  if (
    name.includes("chair") ||
    name.includes("office") ||
    name.includes("desk")
  ) {
    return "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80";
  }
  if (
    name.includes("t-shirt") ||
    name.includes("shirt") ||
    name.includes("cotton")
  ) {
    return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";
  }
  if (name.includes("keyboard")) {
    return "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80";
  }
  if (name.includes("mouse")) {
    return "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80";
  }
  if (name.includes("camera")) {
    return "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80";
  }
  if (name.includes("speaker")) {
    return "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80";
  }

  // Default headphones
  return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80";
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        // Fallback for direct testing
        setProduct({
          _id: id,
          name: "Smart Fitness Watch",
          price: 1999,
          description: "Heart rate monitor, step tracker, and sleep tracking.",
          category: "Electronics",
          countInStock: 8,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const matchedImage = getItemImage(product.name);
    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const itemIndex = existingCart.findIndex(
      (item) => item._id === product._id,
    );

    if (itemIndex > -1) {
      existingCart[itemIndex].qty += qty;
    } else {
      existingCart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: matchedImage,
        qty: qty,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "#94a3b8" }}>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "#94a3b8" }}>
        Product not found.{" "}
        <Link to="/" style={{ color: "#f97316" }}>
          Go back
        </Link>
      </div>
    );
  }

  const resolvedImage = getItemImage(product.name);

  return (
    <div className="product-detail-wrapper">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/">Shop</Link>
        <span>/</span>
        <span>{product.category || "Electronics"}</span>
        <span>/</span>
        <span style={{ color: "#f8fafc" }}>{product.name}</span>
      </div>

      <div className="product-detail-container">
        <div className="product-detail-image-box">
          <img
            src={resolvedImage}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = resolvedImage;
            }}
          />
        </div>

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-price">₹{product.price}</p>
          <p className="product-detail-desc">
            {product.description ||
              "High quality product designed for everyday durability, comfort, and premium performance."}
          </p>

          <div className="product-detail-actions">
            <select
              className="qty-select"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            >
              {[...Array(Math.min(product.countInStock || 5, 10)).keys()].map(
                (x) => (
                  <option key={x + 1} value={x + 1}>
                    Qty: {x + 1}
                  </option>
                ),
              )}
            </select>

            <button onClick={handleAddToCart} className="btn-add-cart">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
