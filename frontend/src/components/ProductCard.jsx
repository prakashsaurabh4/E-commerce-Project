import React from "react";
import { Link } from "react-router-dom";
import "../styles/productCard.css";

const getItemImage = (product) => {
  const name = (product.name || "").toLowerCase();

  if (name.includes("watch")) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
  }
  if (
    name.includes("t-shirt") ||
    name.includes("shirt") ||
    name.includes("cotton")
  ) {
    return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80";
  }
  if (
    name.includes("chair") ||
    name.includes("office") ||
    name.includes("desk")
  ) {
    // New reliable office chair photo
    return "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=80";
  }
  if (name.includes("keyboard")) {
    return "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80";
  }
  if (name.includes("mouse")) {
    return "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80";
  }
  if (name.includes("camera")) {
    return "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80";
  }
  if (name.includes("speaker")) {
    return "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80";
  }

  // Default headphones
  return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80";
};

const ProductCard = ({ product }) => {
  const dynamicImage = getItemImage(product);

  // If the product is a chair, override broken db links directly with the fresh image
  const isChair = (product.name || "").toLowerCase().includes("chair");
  const isValidUrl =
    product.image &&
    product.image.startsWith("http") &&
    !product.image.includes("placeholder") &&
    !isChair;
  const initialSrc = isValidUrl ? product.image : dynamicImage;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={initialSrc}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = dynamicImage;
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>
        <p className="product-price">₹{product.price}</p>
        <Link to={`/product/${product._id}`} className="product-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
