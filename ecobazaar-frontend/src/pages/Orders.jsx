import React, { useEffect, useState } from "react";
import API from "../api/api";
// import Navbar from "../components/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get("/api/orders");
      // Sort: Newest first based on any available date field
      const sorted = (response.data || []).sort((a, b) => 
        new Date(b.date || b.createdAt || b.orderDate) - new Date(a.date || a.createdAt || a.orderDate)
      );
      setOrders(sorted);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  // Logic for the Summary Stats
  const totalOrdersCount = orders.length;
  const totalLifetimeCarbon = orders.reduce((acc, order) => 
    acc + order.items.reduce((sum, item) => sum + (item.product.carbonImpact * item.quantity), 0), 0
  ).toFixed(1);

  const formatDate = (order) => {
    const dateval = order.date || order.createdAt || order.orderDate;
    if (!dateval) return "Processing"; 
    
    return new Date(dateval).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div style={styles.pageWrapper}>
      {/* <Navbar /> */}
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Order History</h1>
            <p style={styles.subtitle}>Review your sustainable purchases and their positive impact.</p>
          </div>
          
          {/* 🎯 NEW: Global Stats Summary */}
          <div style={styles.globalStats}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>TOTAL ORDERS</span>
              <span style={styles.statValue}>{totalOrdersCount}</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statLabel}>TOTAL SAVED</span>
              <span style={styles.statValue}>{totalLifetimeCarbon} kg</span>
            </div>
          </div>
        </header>

        {orders.map((order) => (
          <div 
            key={order.id} 
            onMouseEnter={() => setHoveredId(order.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              ...styles.card,
              transform: hoveredId === order.id ? "translateY(-5px)" : "none",
              boxShadow: hoveredId === order.id ? "0 30px 60px rgba(0,0,0,0.08)" : "0 4px 20px rgba(0,0,0,0.02)"
            }}
          >
            {/* Top Minimal Info Bar */}
            <div style={styles.topInfo}>
              <div style={styles.infoGroup}>
                <span style={styles.label}>ORDER PLACED</span>
                <span style={styles.val}>{formatDate(order)}</span>
              </div>
              <div style={styles.infoGroup}>
                <span style={styles.label}>ORDER ID</span>
                <span style={styles.val}>#EB-{order.id.toString().padStart(5, '0')}</span>
              </div>
            </div>

            {/* Product Content Area */}
            <div style={styles.cardBody}>
              {order.items.map((item) => (
                <div key={item.id} style={styles.itemRow}>
                  <div style={styles.imageWrapper}>
                    <img src={item.product.imageUrl} alt="" style={styles.image} />
                  </div>
                  <div style={styles.details}>
                    <h3 style={styles.itemName}>{item.product.name}</h3>
                    <p style={styles.itemMeta}>Quantity: {item.quantity} • Verified Eco-Choice ✅</p>
                    <p style={styles.unitPrice}>₹{item.product.price} / unit</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Premium Bottom Footer with Total & Carbon */}
            <div style={styles.cardFooter}>
               <div style={styles.carbonBox}>
                <span style={styles.ecoEmoji}>🌍</span>
                <div>
                  <p style={styles.carbonLabel}>CARBON FOOTPRINT SAVED</p>
                  <p style={styles.carbonVal}>
                    {order.items.reduce((acc, item) => 
                      acc + (item.product.carbonImpact * item.quantity), 0
                    ).toFixed(1)} kg CO2e
                  </p>
                </div>
              </div>

               <div style={styles.totalBox}>
                  <span style={styles.totalLabel}>ORDER TOTAL</span>
                  <span style={styles.totalPrice}>₹{order.totalAmount}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { 
    minHeight: "100vh", 
    background: "#fbfbfd", 
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#1d1d1f"
  },
  container: { padding: "80px 20px", maxWidth: "950px", margin: "0 auto" },
  header: { 
    marginBottom: "60px", 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: "20px"
  },
  title: { fontSize: "44px", fontWeight: "700", letterSpacing: "-0.02em", margin: "0 0 10px 0" },
  subtitle: { fontSize: "21px", color: "#86868b", fontWeight: "400", maxWidth: "500px" },

  // New Summary Header Styles
  globalStats: { 
    display: "flex", 
    background: "#ffffff", 
    padding: "15px 30px", 
    borderRadius: "24px", 
    border: "1px solid #e5e5e7",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
  },
  statItem: { display: "flex", flexDirection: "column", alignItems: "center" },
  statLabel: { fontSize: "9px", fontWeight: "800", color: "#86868b", marginBottom: "4px" },
  statValue: { fontSize: "22px", fontWeight: "700", color: "#1d1d1f" },
  statDivider: { width: "1px", background: "#e5e5e7", margin: "0 25px" },

  card: {
    background: "#ffffff",
    borderRadius: "32px",
    marginBottom: "50px",
    overflow: "hidden",
    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    border: "1px solid #e5e5e7"
  },
  topInfo: {
    display: "flex",
    padding: "20px 40px",
    background: "#f5f5f7",
    gap: "50px",
    borderBottom: "1px solid #e5e5e7"
  },
  infoGroup: { display: "flex", flexDirection: "column", gap: "2px" },
  label: { fontSize: "10px", fontWeight: "700", color: "#86868b", letterSpacing: "0.02em" },
  val: { fontSize: "14px", fontWeight: "500", color: "#1d1d1f" },

  cardBody: { padding: "40px" },
  itemRow: { display: "flex", alignItems: "center", gap: "35px" },
  imageWrapper: { 
    width: "110px", height: "110px", background: "#fff", 
    borderRadius: "24px", padding: "10px", display: "flex", 
    alignItems: "center", justifyContent: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
    border: "1px solid #f2f2f2"
  },
  image: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
  
  details: { flex: 1 },
  itemName: { fontSize: "22px", fontWeight: "600", margin: "0 0 8px 0" },
  itemMeta: { fontSize: "15px", color: "#86868b", margin: "0 0 12px 0" },
  unitPrice: { fontSize: "14px", color: "#1d1d1f", fontWeight: "500" },

  cardFooter: { 
    padding: "30px 40px", 
    background: "#fdfdfd", 
    borderTop: "1px solid #f2f2f2",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  carbonBox: { display: "flex", alignItems: "center", gap: "15px" },
  ecoEmoji: { fontSize: "28px" },
  carbonLabel: { margin: 0, fontSize: "10px", fontWeight: "700", color: "#06c", letterSpacing: "0.05em" },
  carbonVal: { margin: 0, fontSize: "18px", fontWeight: "700", color: "#000" },

  totalBox: { textAlign: "right" },
  totalLabel: { display: "block", fontSize: "11px", fontWeight: "700", color: "#86868b", marginBottom: "4px" },
  totalPrice: { fontSize: "32px", fontWeight: "800", color: "#1d1d1f", letterSpacing: "-0.03em" }
};

export default Orders;
