import React, { useEffect, useState } from "react";
import API from "../api/api";
// import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * SellerDashboard Component
 * Allows sellers to manage their own products, view stats, and add new listings.
 */
function SellerDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState(null);
    const [btnHover, setBtnHover] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadSellerProducts();
    }, []);

    const loadSellerProducts = async () => {
        try {
            setLoading(true);
            const response = await API.get("/api/products/seller");
            if (response.data && response.data.data) {
                setProducts(response.data.data);
            } else {
                setProducts(response.data || []);
            }
        } catch (error) {
            console.error("Error loading seller products", error);
            toast.error("❌ Failed to load your inventory.");
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this eco-product? 🌿")) return;

        try {
            await API.delete(`/api/products/${id}`);
            
            // Success Notification
            toast.warn("🗑️ Product removed from Bazaar", {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
            
            // Refresh the list
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Delete error", error);
            toast.error("❌ Failed to delete product.");
        }
    };

    return (
        <div style={styles.pageWrapper}>
            {/* <Navbar /> */}
            
            {/* Toast Notifications */}
            <ToastContainer position="top-right" autoClose={2000} theme="colored" pauseOnHover={false} />

            <div style={styles.container}>
                {/* Dashboard Header */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Seller Dashboard</h1>
                        <p style={styles.subtitle}>Manage your sustainable inventory</p>
                    </div>
                    <button 
                        onClick={() => navigate("/add-product")}
                        onMouseEnter={() => setBtnHover('add')}
                        onMouseLeave={() => setBtnHover(null)}
                        style={{
                            ...styles.addBtn,
                            transform: btnHover === 'add' ? "scale(1.05)" : "scale(1)",
                            boxShadow: btnHover === 'add' ? "0 10px 20px rgba(5, 150, 105, 0.3)" : "none"
                        }}
                    >
                        ➕ Add New Product
                    </button>
                </div>

                {/* Stats Summary Area */}
                <div style={styles.statsBar}>
                    <div style={styles.statBox}>📦 Total Items: {products.length}</div>
                    <div style={styles.statBox}>🟢 Active Listings: {products.filter(p => p.approved).length}</div>
                    <div style={styles.statBox}>🌍 Carbon Saved: {products.length * 5}kg</div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div style={styles.loadingArea}>Gathering your products...</div>
                ) : (
                    <div style={styles.grid}>
                        {products.length > 0 ? (
                            products.map(product => (
                                <div
                                    key={product.id}
                                    onMouseEnter={() => setHoveredId(product.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    style={{
                                        ...styles.card,
                                        transform: hoveredId === product.id ? "translateY(-10px)" : "translateY(0)",
                                        boxShadow: hoveredId === product.id ? "0 20px 40px rgba(0,0,0,0.1)" : "0 10px 15px rgba(0,0,0,0.05)"
                                    }}
                                >
                                    <div style={styles.imageContainer}>
                                        <img src={product.imageUrl || "https://placeholder.com"} alt={product.name} style={styles.image} />
                                    </div>

                                    <div style={styles.detailsContainer}>
                                        <h3 style={styles.prodName}>{product.name}</h3>
                                        <p style={styles.prodDesc}>
                                            {product.details ? `${product.details.substring(0, 50)}...` : "No description provided."}
                                        </p>
                                        <p style={styles.prodPrice}>₹{product.price}</p>
                                        
                                        <div style={styles.buttonGroup}>
                                            <button 
                                                onClick={() => navigate(`/update-product/${product.id}`)}
                                                style={styles.updateBtn}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => deleteProduct(product.id)}
                                                style={styles.deleteBtn}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={styles.emptyState}>
                                <h3>No products found. Start your green journey by adding one! 🍃</h3>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    pageWrapper: {
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)",
        fontFamily: "'Inter', sans-serif"
    },
    container: { padding: "40px 80px" },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
    },
    title: { color: "#064e3b", margin: 0, fontSize: "32px", fontWeight: "800" },
    subtitle: { color: "#059669", margin: "5px 0 0 0" },
    loadingArea: { textAlign: "center", padding: "50px", fontSize: "18px", color: "#059669" },
    
    addBtn: {
        padding: "12px 25px",
        background: "linear-gradient(90deg, #059669, #10b981)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "0.3s"
    },

    statsBar: {
        display: "flex",
        gap: "20px",
        marginBottom: "40px"
    },
    statBox: {
        background: "white",
        padding: "15px 25px",
        borderRadius: "15px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
        boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
        border: "1px solid #ecfdf5"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "30px"
    },
    card: {
        background: "white",
        borderRadius: "24px",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        border: "1px solid #f0fdf4",
        display: "flex",
        flexDirection: "column"
    },
    imageContainer: {
        height: "200px",
        background: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
    },
    image: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
    
    detailsContainer: { padding: "20px", textAlign: "center" },
    prodName: { margin: "0 0 10px 0", color: "#1f2937", fontSize: "20px", fontWeight: "600" },
    prodDesc: { color: "#6b7280", fontSize: "13px", height: "40px", overflow: "hidden" },
    prodPrice: { color: "#059669", fontWeight: "bold", fontSize: "22px", margin: "15px 0" },

    buttonGroup: {
        display: "flex",
        gap: "10px",
        justifyContent: "center"
    },
    updateBtn: {
        flex: 1,
        padding: "10px",
        borderRadius: "10px",
        border: "1px solid #059669",
        background: "transparent",
        color: "#059669",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "0.3s"
    },
    deleteBtn: {
        flex: 1,
        padding: "10px",
        borderRadius: "10px",
        border: "none",
        background: "#fee2e2",
        color: "#dc2626",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "0.3s"
    },
    emptyState: {
        textAlign: "center",
        gridColumn: "1 / -1",
        padding: "100px",
        color: "#9ca3af"
    }
};

export default SellerDashboard;
