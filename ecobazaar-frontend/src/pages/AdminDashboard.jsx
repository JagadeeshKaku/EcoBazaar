import React, { useEffect, useState } from "react";
import API from "../api/api";
// import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * AdminDashboard Component
 * Handles product moderation: viewing, approving, and deleting items.
 */
function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/products/admin/all");
      // Assuming response structure is { data: { data: [...] } } based on your snippet
      setProducts(response.data.data || response.data); 
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("❌ Failed to fetch products from server.");
    } finally {
      setLoading(false);
    }
  };

  const approveProduct = async (id) => {
    try {
      await API.put(`/api/products/admin/approve/${id}`);
      
      // Optimistic UI Update
      setProducts(prev => 
        prev.map(p => (p.id === id ? { ...p, approved: true } : p))
      );
      
      toast.success("✅ Product Approved and Live!", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    } catch (error) {
      toast.error("❌ Approval failed. Try again.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("⚠️ Permanent Action: Delete this product?")) return;

    try {
      await API.delete(`/api/products/admin/${id}`);
      
      // Remove from UI
      setProducts(prev => prev.filter(p => p.id !== id));
      
      toast.warn("🗑️ Product Removed Successfully", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    } catch (error) {
      toast.error("❌ Delete failed. Unauthorized or server error.");
    }
  };

  return (
    <div style={styles.pageBackground}>
      {/* <Navbar /> */}
      
      {/* Centralized Toast Notification System */}
      <ToastContainer position="top-right" autoClose={2000} theme="colored" pauseOnHover={false} />

      <div style={styles.contentWrapper}>
        <div style={styles.headerArea}>
          <div style={styles.titleGroup}>
            <h2 style={styles.mainTitle}>🛡️ Admin Control Panel</h2>
            <p style={styles.subTitle}>Moderate and manage eco-friendly listings</p>
          </div>
          
          <div style={styles.statsRow}>
            <div style={styles.statChip}>Total: {products.length}</div>
            <div style={{ ...styles.statChip, background: "#fef3c7", color: "#b45309" }}>
              Pending: {products.filter(p => !p.approved).length}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={styles.loaderBox}>
            <p>Loading Dashboard Data...</p>
          </div>
        ) : (
          <div style={styles.productGrid}>
            {products.length > 0 ? (
              products.map((product) => (
                <div 
                  key={product.id} 
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ 
                    ...styles.adminCard, 
                    transform: hoveredId === product.id ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                    boxShadow: hoveredId === product.id ? "0 20px 30px rgba(0,0,0,0.12)" : "0 10px 15px rgba(0,0,0,0.05)"
                  }}
                >
                  <div style={styles.ecoBadge}>🍃 Score: {product.ecoScore}</div>
                  
                  <div style={styles.imageBox}>
                    <img 
                      src={product.imageUrl || "https://placeholder.com"} 
                      alt={product.name} 
                      style={styles.productImg} 
                    />
                  </div>

                  <div style={styles.infoBox}>
                    <h3 style={styles.productName}>{product.name}</h3>
                    <p style={styles.priceTag}>₹{product.price}</p>
                    
                    <span style={{ 
                      ...styles.statusTag, 
                      background: product.approved ? "#dcfce7" : "#ffedd5", 
                      color: product.approved ? "#166534" : "#9a3412" 
                    }}>
                      {product.approved ? "✅ Verified" : "⏳ Pending"}
                    </span>

                    <div style={styles.actionRow}>
                      {!product.approved && (
                        <button 
                          onClick={() => approveProduct(product.id)} 
                          style={styles.approveBtn}
                        >
                          Approve
                        </button>
                      )}
                      <button 
                        onClick={() => deleteProduct(product.id)} 
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>No products found in the database.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageBackground: { 
    minHeight: "100vh", 
    background: "#f8fafc", 
    fontFamily: "'Inter', sans-serif" 
  },
  contentWrapper: { 
    padding: "40px 60px" 
  },
  headerArea: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "40px", 
    borderBottom: "2px solid #e2e8f0", 
    paddingBottom: "20px" 
  },
  titleGroup: { display: "flex", flexDirection: "column" },
  mainTitle: { color: "#1e293b", margin: 0, fontSize: "28px", fontWeight: "800" },
  subTitle: { color: "#64748b", margin: "5px 0 0 0", fontSize: "14px" },
  statsRow: { display: "flex", gap: "15px" },
  statChip: { 
    padding: "8px 16px", 
    background: "#e2e8f0", 
    borderRadius: "20px", 
    fontSize: "14px", 
    fontWeight: "600", 
    color: "#475569" 
  },
  loaderBox: { textAlign: "center", padding: "100px", fontSize: "18px", color: "#64748b" },
  emptyState: { textAlign: "center", gridColumn: "1 / -1", padding: "50px", color: "#94a3b8" },
  productGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
    gap: "30px" 
  },
  adminCard: { 
    background: "#fff", 
    borderRadius: "24px", 
    overflow: "hidden", 
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", 
    position: "relative", 
    border: "1px solid #f1f5f9" 
  },
  ecoBadge: { 
    position: "absolute", 
    top: "15px", 
    right: "15px", 
    background: "rgba(255, 255, 255, 0.9)", 
    backdropFilter: "blur(5px)", 
    padding: "5px 12px", 
    borderRadius: "12px", 
    fontSize: "12px", 
    fontWeight: "700", 
    color: "#059669", 
    zIndex: 2, 
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)" 
  },
  imageBox: { 
    height: "200px", 
    background: "#fdfdfd", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: "20px" 
  },
  productImg: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
  infoBox: { padding: "20px", textAlign: "center" },
  productName: { margin: "0 0 8px 0", fontSize: "18px", color: "#334155", fontWeight: "600" },
  priceTag: { fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "5px 0" },
  statusTag: { 
    display: "inline-block", 
    padding: "4px 12px", 
    borderRadius: "8px", 
    fontSize: "12px", 
    fontWeight: "bold", 
    marginBottom: "15px" 
  },
  actionRow: { display: "flex", gap: "10px", marginTop: "10px" },
  approveBtn: { 
    flex: 1, 
    background: "linear-gradient(135deg, #10b981, #059669)", 
    color: "white", 
    border: "none", 
    padding: "10px", 
    borderRadius: "12px", 
    fontWeight: "bold", 
    cursor: "pointer", 
    transition: "0.3s" 
  },
  deleteBtn: { 
    flex: 1, 
    background: "#fff", 
    color: "#ef4444", 
    border: "1px solid #fee2e2", 
    padding: "10px", 
    borderRadius: "12px", 
    fontWeight: "bold", 
    cursor: "pointer", 
    transition: "0.3s" 
  }
};

export default AdminDashboard;
