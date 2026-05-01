import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import API from "../api/api";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [currentRole, setCurrentRole] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);

  // Wrapped in useCallback to prevent re-render loops in useEffect
  const fetchCartCount = useCallback(async () => {
    try {
      const res = await API.get("/api/cart");
      const items = res.data.items || [];
      const totalQty = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

      if (totalQty !== cartCount) {
        setCartAnimate(true);
        setTimeout(() => setCartAnimate(false), 500);
      }
      setCartCount(totalQty);
    } catch (err) {
      console.error("Cart sync failed");
    }
  }, [cartCount]);

  // Sync Role and Auth State
  useEffect(() => {
    if (token) {
      const rawRole = localStorage.getItem("role") || "";
      const cleanedRole = rawRole.replace("ROLE_", "").toUpperCase().trim();
      setCurrentRole(cleanedRole);

      // Only fetch cart for regular Users
      if (!cleanedRole.includes("ADMIN") && !cleanedRole.includes("SELLER")) {
        fetchCartCount();
      }
    }
  }, [token, fetchCartCount]); // Fixed dependency array syntax

  const logout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const handleSearch = () => navigate(`/products?keyword=${search}`);

  const handleLogoClick = () => {
    if (!token) return navigate("/");
    if (currentRole.includes("ADMIN")) return navigate("/admin");
    if (currentRole.includes("SELLER")) return navigate("/seller");
    return navigate("/dashboard");
  };

  const NavLink = ({ label, path, id }) => (
    <div
      onMouseEnter={() => setHoveredItem(id)}
      onMouseLeave={() => setHoveredItem(null)}
      onClick={() => navigate(path)}
      style={styles.navItemWrapper}
    >
      <span style={{ ...styles.navText, color: hoveredItem === id ? "#facc15" : "#fff" }}>
        {label}
      </span>
      <div style={{ ...styles.underline, width: hoveredItem === id ? "100%" : "0%" }} />
    </div>
  );

  return (
    <div style={styles.navContainer}>
      {/* 🌿 LOGO */}
      <div style={styles.logoContainer} onClick={handleLogoClick}>
        <span style={{ fontSize: "26px" }}>🌱</span>
        <h2 style={styles.logoText}>EcoBazaar</h2>
      </div>

      {/* 🔍 SEARCH */}
      <div style={{
        ...styles.searchContainer,
        border: (hoveredItem === 'search' || isSearchFocused) ? "2px solid #facc15" : "2px solid #059669"
      }} onMouseEnter={() => setHoveredItem('search')} onMouseLeave={() => setHoveredItem(null)}>
        <input
          value={search}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sustainable products..."
          style={styles.searchInput}
        />
        <button onClick={handleSearch} style={styles.searchButton}>🔍</button>
      </div>

      {/* 🚀 MENU */}
      <div style={styles.menuGroup}>
        {token ? (
          <>
            {/* ADMIN VIEW */}
            {currentRole.includes("ADMIN") && (
              <>
                <NavLink label="Admin Panel" path="/admin" id="admin" />
                <NavLink label="System Analytics" path="/admin-analytics" id="admin-analytics" />
              </>
            )}

            {/* SELLER VIEW */}
            {currentRole.includes("SELLER") && (
              <>
                <NavLink label="Inventory" path="/seller" id="seller" />
                <NavLink label="Analytics" path="/seller-analytics" id="seller-analytics" />
              </>
            )}

            {/* USER VIEW */}
            {currentRole.includes("USER") && !currentRole.includes("SELLER") && !currentRole.includes("ADMIN") && (
              <>
                <NavLink label="Products" path="/products" id="products" />
                <NavLink label="Orders" path="/orders" id="orders" />
                <NavLink label="Impact" path="/dashboard" id="userdash" />
              </>
            )}

            {/* 🛒 CART (Hidden for Admins and Sellers) */}
            {currentRole !== "ADMIN" && currentRole !== "SELLER" && (
              <div
                style={{ 
                  ...styles.cartWrapper, 
                  transform: cartAnimate ? "scale(1.2)" : "scale(1)",
                  color: hoveredItem === 'cart' ? "#facc15" : "#fff"
                }}
                onMouseEnter={() => setHoveredItem('cart')}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => navigate("/cart")}
              >
                <span style={{ fontSize: "22px" }}>🛒</span>
                {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
              </div>
            )}

            <button onClick={logout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <NavLink label="Login" path="/" id="login" />
            <NavLink label="Signup" path="/signup" id="signup" />
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  navContainer: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 50px", background: "linear-gradient(90deg, #111827 0%, #064e3b 100%)", position: "sticky", top: 0, zIndex: 1000, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" },
  logoContainer: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  logoText: { margin: 0, color: "#facc15", fontWeight: "900", fontSize: "22px" },
  searchContainer: { display: "flex", width: "30%", borderRadius: "25px", overflow: "hidden", background: "#fff", transition: "0.3s" },
  searchInput: { width: "100%", padding: "10px 20px", border: "none", outline: "none" },
  searchButton: { padding: "0 20px", border: "none", background: "#facc15", cursor: "pointer" },
  menuGroup: { display: "flex", gap: "25px", alignItems: "center" },
  navItemWrapper: { position: "relative", cursor: "pointer" },
  navText: { fontWeight: "600", fontSize: "14px", transition: "0.3s" },
  underline: { position: "absolute", bottom: "-4px", left: 0, height: "3px", background: "#facc15", transition: "0.3s", borderRadius: "10px" },
  cartWrapper: { position: "relative", cursor: "pointer", transition: "0.3s" },
  cartBadge: { position: "absolute", top: "-10px", right: "-12px", background: "#ef4444", color: "white", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold", border: "2px solid #064e3b" },
  logoutBtn: { background: "transparent", border: "1px solid #ef4444", padding: "8px 18px", borderRadius: "20px", color: "#ef4444", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }
};

export default Navbar;
