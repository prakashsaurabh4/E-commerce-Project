import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products"); // 'products' | 'orders' | 'users'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    imageUrl: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const loadAllData = async () => {
    setLoading(true);
    const authHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const [resOrders, resProducts, resUsers] = await Promise.all([
        fetch("/api/orders", { headers: authHeaders }),
        fetch("/api/products", { headers: authHeaders }),
        fetch("/api/auth", { headers: authHeaders }),
      ]);

      if (resOrders.ok) {
        const orderData = await resOrders.json();
        setOrders(orderData);
      }
      if (resProducts.ok) {
        const productData = await resProducts.json();
        setProducts(productData);
      }
      if (resUsers.ok) {
        const userData = await resUsers.json();
        setUsers(userData);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o,
          ),
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Error updating order: " + err.message);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewProduct({
          name: "",
          price: "",
          category: "",
          stock: "",
          description: "",
          imageUrl: "",
        });
        loadAllData();
      } else {
        const data = await res.json();
        alert(data.message || "Could not add product");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Permanently delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.totalPrice || o.totalAmount || 0),
    0,
  );

  return (
    <div
      style={{
        backgroundColor: "#030303",
        minHeight: "100vh",
        color: "#ffffff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      }}
    >
      {/* Top Navbar with FastShop Logo */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 48px",
          borderBottom: "1px solid #141416",
        }}
      >
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
              height: "36px",
              width: "36px",
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
            FastShop<span style={{ color: "#f97316" }}>.</span>
          </span>
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            fontSize: "0.9rem",
          }}
        >
          <Link to="/" style={{ color: "#c2c2c2", textDecoration: "none" }}>
            Shop
          </Link>
          <Link to="/cart" style={{ color: "#c2c2c2", textDecoration: "none" }}>
            Cart (0)
          </Link>
          <span style={{ color: "#c2c2c2" }}>
            Hi, {storedUser.name || "Admin User"}
          </span>
          <span style={{ color: "#f97316", fontWeight: "700" }}>Admin</span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              color: "#ef4444",
              border: "1px solid #3b1114",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "35px auto 60px auto",
          padding: "0 24px",
        }}
      >
        {/* Metric Cards Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          {/* Total Orders */}
          <div
            style={{
              backgroundColor: "#0d0e12",
              border: "1px solid #191b22",
              borderRadius: "14px",
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#9aa0a6",
                fontSize: "0.88rem",
                fontWeight: "600",
                marginBottom: "14px",
              }}
            >
              Total Orders
            </div>
            <div
              style={{
                fontSize: "2.4rem",
                fontWeight: "700",
                color: "#ff6200",
              }}
            >
              {orders.length}
            </div>
          </div>

          {/* Total Products */}
          <div
            style={{
              backgroundColor: "#0d0e12",
              border: "1px solid #191b22",
              borderRadius: "14px",
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#9aa0a6",
                fontSize: "0.88rem",
                fontWeight: "600",
                marginBottom: "14px",
              }}
            >
              Total Products
            </div>
            <div
              style={{
                fontSize: "2.4rem",
                fontWeight: "700",
                color: "#ff6200",
              }}
            >
              {products.length}
            </div>
          </div>

          {/* Total Users */}
          <div
            style={{
              backgroundColor: "#0d0e12",
              border: "1px solid #191b22",
              borderRadius: "14px",
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#9aa0a6",
                fontSize: "0.88rem",
                fontWeight: "600",
                marginBottom: "14px",
              }}
            >
              Total Users
            </div>
            <div
              style={{
                fontSize: "2.4rem",
                fontWeight: "700",
                color: "#ff6200",
              }}
            >
              {users.length || 1}
            </div>
          </div>

          {/* Total Revenue */}
          <div
            style={{
              backgroundColor: "#0d0e12",
              border: "1px solid #191b22",
              borderRadius: "14px",
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#9aa0a6",
                fontSize: "0.88rem",
                fontWeight: "600",
                marginBottom: "14px",
              }}
            >
              Total Revenue
            </div>
            <div
              style={{
                fontSize: "2.4rem",
                fontWeight: "700",
                color: "#ff6200",
              }}
            >
              ₹{totalRevenue.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Administrative Controls Section */}
        <div
          style={{
            backgroundColor: "#0d0e12",
            border: "1px solid #191b22",
            borderRadius: "14px",
            padding: "24px 28px",
            marginBottom: "38px",
          }}
        >
          <div
            style={{
              color: "#ff6200",
              fontWeight: "700",
              fontSize: "0.95rem",
              marginBottom: "18px",
              letterSpacing: "-0.2px",
            }}
          >
            Administrative Controls
          </div>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: "#ff6200",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 22px",
                fontWeight: "600",
                fontSize: "0.92rem",
                cursor: "pointer",
              }}
            >
              + Add Product
            </button>

            <button
              onClick={() => setActiveTab("products")}
              style={{
                backgroundColor:
                  activeTab === "products" ? "#1f222e" : "#14161d",
                color: "#ffffff",
                border:
                  activeTab === "products"
                    ? "1px solid #ff6200"
                    : "1px solid #252834",
                borderRadius: "8px",
                padding: "10px 20px",
                fontWeight: "600",
                fontSize: "0.92rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>📦</span> Manage Products
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              style={{
                backgroundColor: activeTab === "orders" ? "#1f222e" : "#14161d",
                color: "#ffffff",
                border:
                  activeTab === "orders"
                    ? "1px solid #ff6200"
                    : "1px solid #252834",
                borderRadius: "8px",
                padding: "10px 20px",
                fontWeight: "600",
                fontSize: "0.92rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🚚</span> Manage Orders
            </button>

            <button
              onClick={() => setActiveTab("users")}
              style={{
                backgroundColor: activeTab === "users" ? "#1f222e" : "#14161d",
                color: "#ffffff",
                border:
                  activeTab === "users"
                    ? "1px solid #ff6200"
                    : "1px solid #252834",
                borderRadius: "8px",
                padding: "10px 20px",
                fontWeight: "600",
                fontSize: "0.92rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>👥</span> Users Directory
            </button>
          </div>
        </div>

        {/* Section Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              width: "4px",
              height: "30px",
              backgroundColor: "#ff6200",
              borderRadius: "2px",
              display: "inline-block",
            }}
          ></span>
          <h2
            style={{
              fontSize: "2.1rem",
              fontWeight: "700",
              margin: 0,
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            {activeTab === "products" && "Manage Products"}
            {activeTab === "orders" && "Manage Orders"}
            {activeTab === "users" && "Users Directory"}
          </h2>
        </div>

        {/* Main Content Tables */}
        {loading ? (
          <p style={{ color: "#777" }}>Loading dashboard records...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            {/* Manage Products Table */}
            {activeTab === "products" && (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid #16181f",
                      color: "#8a909a",
                      fontSize: "0.82rem",
                      fontWeight: "700",
                      letterSpacing: "0.6px",
                    }}
                  >
                    <th style={{ padding: "16px 12px" }}>PRODUCT NAME</th>
                    <th style={{ padding: "16px 12px" }}>CATEGORY</th>
                    <th style={{ padding: "16px 12px" }}>PRICE</th>
                    <th style={{ padding: "16px 12px" }}>STOCK</th>
                    <th style={{ padding: "16px 12px" }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          padding: "30px 12px",
                          textAlign: "center",
                          color: "#666",
                        }}
                      >
                        No products listed yet.
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr
                        key={p._id}
                        style={{
                          borderBottom: "1px solid #121318",
                          fontSize: "0.95rem",
                          color: "#d8dce2",
                        }}
                      >
                        <td style={{ padding: "18px 12px" }}>{p.name}</td>
                        <td style={{ padding: "18px 12px" }}>{p.category}</td>
                        <td style={{ padding: "18px 12px", color: "#ff6200" }}>
                          ₹{p.price}
                        </td>
                        <td style={{ padding: "18px 12px" }}>{p.stock}</td>
                        <td style={{ padding: "18px 12px" }}>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            style={{
                              backgroundColor: "#dc2626",
                              color: "#ffffff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.82rem",
                              fontWeight: "600",
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Manage Orders Table */}
            {activeTab === "orders" && (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid #16181f",
                      color: "#8a909a",
                      fontSize: "0.82rem",
                      fontWeight: "700",
                      letterSpacing: "0.6px",
                    }}
                  >
                    <th style={{ padding: "16px 12px" }}>ORDER ID</th>
                    <th style={{ padding: "16px 12px" }}>USER</th>
                    <th style={{ padding: "16px 12px" }}>TOTAL</th>
                    <th style={{ padding: "16px 12px" }}>DATE</th>
                    <th style={{ padding: "16px 12px" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          padding: "30px 12px",
                          textAlign: "center",
                          color: "#666",
                        }}
                      >
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const shortId = `${order._id.substring(0, 8)}...`;
                      const userName =
                        order.user?.name ||
                        order.shippingAddress?.fullName ||
                        "Deleted User";
                      const orderDate = new Date(
                        order.createdAt,
                      ).toLocaleDateString("en-US");
                      const currentStatus = order.status || "Pending";

                      return (
                        <tr
                          key={order._id}
                          style={{
                            borderBottom: "1px solid #121318",
                            fontSize: "0.95rem",
                            color: "#d8dce2",
                          }}
                        >
                          <td style={{ padding: "18px 12px" }}>{shortId}</td>
                          <td style={{ padding: "18px 12px" }}>{userName}</td>
                          <td style={{ padding: "18px 12px" }}>
                            ₹
                            {Number(
                              order.totalPrice || order.totalAmount || 0,
                            ).toFixed(2)}
                          </td>
                          <td style={{ padding: "18px 12px" }}>{orderDate}</td>
                          <td style={{ padding: "18px 12px" }}>
                            <select
                              value={currentStatus}
                              onChange={(e) =>
                                handleStatusChange(order._id, e.target.value)
                              }
                              style={{
                                backgroundColor: "#0b0c10",
                                color: "#ffffff",
                                border: "1px solid #262934",
                                borderRadius: "4px",
                                padding: "6px 14px",
                                fontSize: "0.85rem",
                                cursor: "pointer",
                                outline: "none",
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}

            {/* Users Directory Table */}
            {activeTab === "users" && (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid #16181f",
                      color: "#8a909a",
                      fontSize: "0.82rem",
                      fontWeight: "700",
                      letterSpacing: "0.6px",
                    }}
                  >
                    <th style={{ padding: "16px 12px" }}>USER ID</th>
                    <th style={{ padding: "16px 12px" }}>NAME</th>
                    <th style={{ padding: "16px 12px" }}>EMAIL</th>
                    <th style={{ padding: "16px 12px" }}>ROLE</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          padding: "30px 12px",
                          textAlign: "center",
                          color: "#666",
                        }}
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr
                        key={u._id}
                        style={{
                          borderBottom: "1px solid #121318",
                          fontSize: "0.95rem",
                          color: "#d8dce2",
                        }}
                      >
                        <td
                          style={{ padding: "18px 12px" }}
                        >{`${u._id.substring(0, 8)}...`}</td>
                        <td style={{ padding: "18px 12px" }}>{u.name}</td>
                        <td style={{ padding: "18px 12px" }}>{u.email}</td>
                        <td style={{ padding: "18px 12px" }}>
                          {u.role || "user"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#0d0e12",
              border: "1px solid #222530",
              borderRadius: "12px",
              padding: "28px",
              width: "420px",
            }}
          >
            <h3 style={{ margin: "0 0 16px 0", color: "#ffffff" }}>
              Add New Product
            </h3>
            <form
              onSubmit={handleCreateProduct}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <input
                type="text"
                placeholder="Product Name"
                required
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  backgroundColor: "#161820",
                  border: "1px solid #282c3c",
                  color: "#fff",
                }}
              />
              <input
                type="number"
                placeholder="Price (₹)"
                required
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  backgroundColor: "#161820",
                  border: "1px solid #282c3c",
                  color: "#fff",
                }}
              />
              <input
                type="text"
                placeholder="Category"
                required
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  backgroundColor: "#161820",
                  border: "1px solid #282c3c",
                  color: "#fff",
                }}
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                required
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  backgroundColor: "#161820",
                  border: "1px solid #282c3c",
                  color: "#fff",
                }}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newProduct.imageUrl}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, imageUrl: e.target.value })
                }
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  backgroundColor: "#161820",
                  border: "1px solid #282c3c",
                  color: "#fff",
                }}
              />
              <textarea
                placeholder="Description"
                rows="3"
                required
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  backgroundColor: "#161820",
                  border: "1px solid #282c3c",
                  color: "#fff",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#222530",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ff6200",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
