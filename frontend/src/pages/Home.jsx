import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/global.css";
import "../styles/productCard.css";

const fallbackList = [
  {
    _id: "1",
    name: "Wireless Headphones",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  },
  {
    _id: "2",
    name: "Smart Fitness Watch",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
  },
  {
    _id: "3",
    name: "RGB Gaming Keyboard",
    price: 3299,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
  },
  {
    _id: "4",
    name: "Ergonomic Office Chair",
    price: 6499,
    image:
      "https://images.unsplash.com/photo-1580481077195-c328a37ea71a?w=600&auto=format&fit=crop&q=80",
  },
  {
    _id: "5",
    name: "Wireless Gaming Mouse",
    price: 1899,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
  },
  {
    _id: "6",
    name: "Ultra-HD 4K Camera",
    price: 6999,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
  },
  {
    _id: "7",
    name: "Bluetooth Speaker",
    price: 2199,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
  },
  {
    _id: "8",
    name: "Smart Desk Lamp",
    price: 1699,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const dbList = Array.isArray(data) ? data : data.products || [];
        setProducts(
          dbList.length > 0
            ? [...dbList, ...fallbackList.slice(dbList.length)]
            : fallbackList,
        );
      } catch (err) {
        setProducts(fallbackList);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div
      className="home-container"
      style={{ maxWidth: "1240px", margin: "0 auto", padding: "40px 20px" }}
    >
      <div className="hero-banner">
        <h1>Welcome to FastShop</h1>
        <p>Discover the best products at unbeatable prices.</p>
      </div>

      <h2>Featured Products</h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#a1a1aa" }}>
          Loading...
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "24px",
            width: "100%",
          }}
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
