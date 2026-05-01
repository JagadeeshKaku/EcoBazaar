import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalCarbon, setTotalCarbon] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();

  const dispatchCartUpdate = () => {
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const fetchCart = useCallback(async () => {
    try {
      const response = await API.get("/api/cart");
      const items = response.data.items || [];
      setCartItems(items);
      setTotal(response.data.totalPrice || 0);
      setTotalCarbon(response.data.totalCarbon || 0);
      dispatchCartUpdate(); 
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // 🚀 Optimistic Update: Updates UI immediately before API call finishes
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    // 1. Calculate local changes immediately
    const updatedItems = cartItems.map(item => {
      if (item.id === cartItemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    // 2. Recalculate Totals Locally for instant feedback
    const newTotal = updatedItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const newCarbon = updatedItems.reduce((acc, item) => acc + (item.product.carbonImpact * item.quantity), 0);

    setCartItems(updatedItems);
    setTotal(newTotal);
    setTotalCarbon(newCarbon);

    try {
      await API.put(`/api/cart/update/${cartItemId}`, { quantity: newQuantity });
      // Sync with server in background to ensure data integrity
      dispatchCartUpdate(); 
    } catch (error) {
      toast.error("Failed to update quantity");
      fetchCart(); // Revert to server state on error
    }
  };

  const removeItem = async (id) => {
    // Optimistic remove
    const filteredItems = cartItems.filter(item => item.id !== id);
    setCartItems(filteredItems);
    
    try {
      await API.delete(`/api/cart/remove/${id}`);
      toast.info("Item removed");
      fetchCart();
    } catch (error) { 
      console.error(error);
      fetchCart(); 
    }
  };

  const checkout = async () => {
    if(isSyncing) return;
    setIsSyncing(true);
    try {
      await API.post("/api/orders/checkout");
      
      setCartItems([]);
      setTotal(0);
      setTotalCarbon(0);
      dispatchCartUpdate(); 

      toast.success("Order placed successfully! 🌿", {
        position: "top-center",
        autoClose: 1000,
        onClose: () => navigate("/orders")
      });
      
    } catch (error) { 
      toast.error("Checkout failed.");
      setIsSyncing(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <ToastContainer theme="colored" pauseOnHover={false} autoClose={1000} />

      <div style={styles.contentLayout}>
        <div style={styles.itemsSection}>
          <h2 style={styles.title}>Your Green Cart</h2>
          
          {cartItems.length === 0 ? (
            <div style={styles.emptyState}>
               <p style={{fontSize: "50px", margin: "0"}}>🍃</p>
               <h3>Your cart is empty</h3>
               <p>Looks like you haven't added any sustainable choices yet.</p>
               <button onClick={() => navigate("/products")} style={styles.shopBtn}>Browse Products</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} style={styles.cartCard}>
                <img src={item.product.imageUrl} alt={item.product.name} style={styles.itemImg} />
                
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.product.name}</h3>
                  <div style={styles.qtyContainer}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={styles.qtyBtn}>−</button>
                    <span style={styles.qtyText}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={styles.qtyBtn}>+</button>
                  </div>
                  <span style={styles.carbonBadge}>🌿 {(item.product.carbonImpact * item.quantity).toFixed(1)}kg Saved</span>
                </div>

                <div style={styles.priceSection}>
                  <p style={styles.itemPrice}>₹{item.product.price * item.quantity}</p>
                  <button onClick={() => removeItem(item.id)} style={styles.removeBtn}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={styles.summarySidebar}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryHeading}>Order Summary</h3>
            <div style={styles.summaryRow}>
              <span>Subtotal ({cartItems.length} items)</span>
              <span style={styles.grayText}>₹{total}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Eco-Shipping</span>
              <span style={{color: '#22c55e', fontWeight: 'bold'}}>FREE</span>
            </div>
            
            <div style={styles.totalRow}>
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <div style={styles.carbonImpactBox}>
                <p style={{margin: 0, fontSize: '11px', opacity: 0.9}}>Your Total Carbon Impact</p>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '5px'}}>
                    <span style={{fontSize: '24px'}}>📉</span>
                    <h2 style={{margin: 0, fontSize: '24px'}}>{totalCarbon.toFixed(2)}kg CO₂</h2>
                </div>
            </div>

            {cartItems.length > 0 ? (
                <button onClick={checkout} style={styles.confirmBtn} disabled={isSyncing}>
                    {isSyncing ? "Processing..." : "Confirm Purchase"}
                </button>
            ) : (
                <button onClick={() => navigate("/products")} style={styles.confirmBtn}>
                    Start Shopping
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: "100vh", background: "#fcfcfc", fontFamily: "'Inter', sans-serif" },
  contentLayout: { display: "flex", gap: "30px", padding: "40px 8%", alignItems: "flex-start" },
  itemsSection: { flex: 2 },
  title: { fontSize: "28px", fontWeight: "900", color: "#0f172a", marginBottom: "30px" },
  cartCard: { display: "flex", background: "#fff", padding: "20px", borderRadius: "20px", marginBottom: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", alignItems: "center" },
  itemImg: { width: "110px", height: "110px", borderRadius: "15px", objectFit: "cover", background: "#f8fafc" },
  itemInfo: { flex: 1, paddingLeft: "25px" },
  itemName: { margin: "0 0 10px 0", fontSize: "20px", fontWeight: "700" },
  qtyContainer: { display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: "10px", width: "fit-content", padding: "4px 10px", marginBottom: "12px" },
  qtyBtn: { background: "none", border: "none", fontSize: "18px", color: "#059669", cursor: "pointer", fontWeight: "bold" },
  qtyText: { fontSize: "15px", fontWeight: "800", color: "#1e293b", padding: "0 12px" },
  carbonBadge: { background: "#dcfce7", color: "#166534", padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "800" },
  priceSection: { textAlign: "right" },
  itemPrice: { fontSize: "24px", fontWeight: "900", margin: 0 },
  removeBtn: { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "13px", fontWeight: "700", textDecoration: "underline", marginTop: "10px" },
  summarySidebar: { flex: 1, position: "sticky", top: "100px" },
  summaryCard: { background: "#fff", padding: "35px", borderRadius: "30px", boxShadow: "0 15px 30px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" },
  summaryHeading: { fontSize: "22px", margin: "0 0 25px 0", fontWeight: "800" },
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "#64748b", fontSize: "15px" },
  grayText: { color: "#94a3b8" },
  totalRow: { display: "flex", justifyContent: "space-between", fontSize: "26px", fontWeight: "900", margin: "30px 0", borderTop: "1px solid #f1f5f9", paddingTop: "20px" },
  carbonImpactBox: { background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)", color: "white", padding: "20px", borderRadius: "20px", textAlign: "center", marginBottom: "25px" },
  confirmBtn: { width: "100%", padding: "18px", borderRadius: "15px", border: "none", background: "#0f172a", color: "white", fontWeight: "800", cursor: "pointer", fontSize: "16px" },
  emptyState: { textAlign: "center", padding: "80px 20px", color: "#94a3b8", background: "#fff", borderRadius: "30px", border: "2px dashed #e2e8f0" },
  shopBtn: { marginTop: "20px", padding: "12px 30px", borderRadius: "10px", border: "none", background: "#059669", color: "#fff", fontWeight: "700", cursor: "pointer" }
};

export default Cart;