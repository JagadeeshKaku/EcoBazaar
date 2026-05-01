// import { useEffect, useState, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import API from "../api/api";
// import Navbar from "../components/Navbar";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function Products() {
//   const [products, setProducts] = useState([]);
//   const [keyword, setKeyword] = useState("");
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [filterType, setFilterType] = useState("all");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [sortOrder, setSortOrder] = useState("");
//   const [hoveredId, setHoveredId] = useState(null);

//   const navigate = useNavigate();
//   const location = useLocation();

//   const loadProducts = useCallback(async () => {
//     try {
//       let params = { page, size: 9 };

//       if (filterType === "search" && keyword) params.keyword = keyword;

//       // 🎯 LOGIC FIX: Ensure "Eco Certified" only shows products with score >= 80
//       if (filterType === "eco") {
//         params.ecoCertified = true;
//         params.minEcoScore = 80; 
//       }

//       if (filterType === "price") {
//         if (minPrice) params.minPrice = minPrice;
//         if (maxPrice) params.maxPrice = maxPrice;
//       }
//       if (filterType === "ecoScore") params.sort = "ecoScore,desc";
//       if (sortOrder) params.sort = sortOrder;

//       const res = await API.get("/api/products", { params });
//       setProducts(res.data.data.content || []);
//       setTotalPages(res.data.data.totalPages);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     }
//   }, [page, filterType, keyword, minPrice, maxPrice, sortOrder]);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const keywordFromURL = params.get("keyword");
//     if (keywordFromURL) {
//       setKeyword(keywordFromURL);
//       setFilterType("search");
//     }
//     loadProducts();
//   }, [loadProducts, location.search]);

//   const addToCart = async (id) => {
//     try {
//       await API.post(`/api/cart/add/${id}`);
//       // ✅ SUCCESS TOAST
//       toast.success("Added to your green collection! 🌿🛒", {
//         position: "bottom-right",
//         autoClose: 2000,
//         theme: "colored",
//       });
//     } catch (err) { 
//       toast.error("Failed to add item ❌"); 
//     }
//   };

//   return (
//     <div style={styles.pageWrapper}>
//       <Navbar />
//       <ToastContainer hideProgressBar />

//       <div style={styles.mainLayout}>
//         {/* 🌿 SIDEBAR FILTERS */}
//         <div style={styles.sidebar}>
//           <h3 style={styles.sideTitle}>Refine Search</h3>

//           <div style={styles.filterGroup}>
//             <button 
//               style={{...styles.filterBtn, 
//                 background: filterType === "all" ? "#059669" : "#fff", 
//                 color: filterType === "all" ? "#fff" : "#334155",
//                 transform: filterType === "all" ? "scale(1.05)" : "scale(1)"
//               }} 
//               onClick={() => { setFilterType("all"); setSortOrder(""); setPage(0); }}
//             >
//               All Products
//             </button>
//             <button 
//               style={{...styles.filterBtn, 
//                 background: filterType === "eco" ? "#059669" : "#fff", 
//                 color: filterType === "eco" ? "#fff" : "#334155",
//                 transform: filterType === "eco" ? "scale(1.05)" : "scale(1)"
//               }} 
//               onClick={() => { setFilterType("eco"); setPage(0); }}
//             >
//               🍃 Verified Eco
//             </button>
//             <button 
//               style={{...styles.filterBtn, 
//                 background: filterType === "ecoScore" ? "#059669" : "#fff", 
//                 color: filterType === "ecoScore" ? "#fff" : "#334155",
//                 transform: filterType === "ecoScore" ? "scale(1.05)" : "scale(1)"
//               }} 
//               onClick={() => { setFilterType("ecoScore"); setPage(0); }}
//             >
//               📈 Top EcoScore
//             </button>
//           </div>

//           <div style={styles.divider} />
//           <h4 style={styles.subTitle}>Sort by Price</h4>
//           <select style={styles.select} value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setPage(0); }}>
//             <option value="">Default</option>
//             <option value="price,asc">Price: Low to High</option>
//             <option value="price,desc">Price: High to Low</option>
//           </select>

//           <div style={styles.divider} />
//           <h4 style={styles.subTitle}>Price Range</h4>
//           <div style={styles.priceInputs}>
//             <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={styles.priceInput} />
//             <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={styles.priceInput} />
//           </div>
//           <button style={styles.applyBtn} onClick={() => { setFilterType("price"); setPage(0); }}>Apply Filter</button>
//         </div>

//         {/* 🛍️ PRODUCT GRID */}
//         <div style={styles.content}>
//           <div style={styles.grid}>
//             {products.map(p => (
//               <div 
//                 key={p.id} 
//                 onMouseEnter={() => setHoveredId(p.id)}
//                 onMouseLeave={() => setHoveredId(null)}
//                 style={{
//                   ...styles.card,
//                   transform: hoveredId === p.id ? "translateY(-10px)" : "none",
//                   boxShadow: hoveredId === p.id ? "0 20px 40px rgba(0,0,0,0.08)" : "0 4px 15px rgba(0,0,0,0.03)"
//                 }}
//                 onClick={() => navigate(`/product/${p.id}`)}
//               >
//                 <div style={styles.imgContainer}>
//                   <img src={p.imageUrl} alt={p.name} style={{
//                     ...styles.image,
//                     transform: hoveredId === p.id ? "scale(1.1)" : "scale(1)"
//                   }} />
//                   {p.ecoScore >= 80 && <span style={styles.ecoBadge}>Verified Eco Choice</span>}
//                 </div>
//                 <div style={styles.cardInfo}>
//                   <h4 style={styles.prodName}>{p.name}</h4>
//                   <p style={styles.prodDesc}>{p.details?.substring(0, 45)}...</p>
//                   <div style={styles.priceRow}>
//                     <span style={styles.priceText}>₹{p.price}</span>
//                     <span style={{
//                       ...styles.scoreText, 
//                       color: p.ecoScore >= 80 ? "#059669" : "#64748b"
//                     }}>
//                       {p.ecoScore >= 80 ? "🍃" : "📦"} {p.ecoScore}
//                     </span>
//                   </div>
//                   <button 
//                     style={{
//                       ...styles.cartBtn,
//                       opacity: hoveredId === p.id ? 1 : 0.9,
//                       transform: hoveredId === p.id ? "scale(1.02)" : "scale(1)"
//                     }} 
//                     onClick={(e) => { e.stopPropagation(); addToCart(p.id); }}
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* 📄 PAGINATION */}
//           <div style={styles.pagination}>
//             <button disabled={page === 0} onClick={() => setPage(page - 1)} style={styles.pageBtn}>← Prev</button>
//             <span style={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
//             <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} style={styles.pageBtn}>Next →</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   pageWrapper: { background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
//   mainLayout: { display: "flex", padding: "40px 5%", gap: "30px" },
//   sidebar: { width: "280px", background: "#fff", padding: "30px", borderRadius: "24px", height: "fit-content", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", position: "sticky", top: "100px", border: "1px solid #f1f5f9" },
//   sideTitle: { margin: "0 0 20px 0", color: "#1e293b", fontSize: "20px", fontWeight: "800" },
//   filterGroup: { display: "flex", flexDirection: "column", gap: "10px" },
//   filterBtn: { padding: "12px", border: "1px solid #f1f5f9", borderRadius: "12px", cursor: "pointer", textAlign: "left", fontWeight: "700", transition: "0.4s ease" },
//   divider: { height: "1px", background: "#f1f5f9", margin: "20px 0" },
//   subTitle: { fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", fontWeight: "bold" },
//   select: { width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #f1f5f9", outline: "none", cursor: "pointer", fontWeight: "600" },
//   priceInputs: { display: "flex", gap: "10px", marginBottom: "10px" },
//   priceInput: { width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #f1f5f9", outline: "none" },
//   applyBtn: { width: "100%", padding: "12px", border: "none", borderRadius: "12px", background: "#1e293b", color: "#fff", fontWeight: "700", cursor: "pointer", transition: "0.3s" },

//   content: { flex: 1 },
//   grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "35px" },
//   card: { background: "#fff", borderRadius: "28px", overflow: "hidden", transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)", cursor: "pointer", border: "1px solid #f1f5f9" },
//   imgContainer: { position: "relative", height: "200px", background: "#f9fafb", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
//   image: { width: "100%", height: "100%", objectFit: "contain", transition: "0.5s ease" },
//   ecoBadge: { position: "absolute", top: "15px", left: "15px", background: "#dcfce7", color: "#166534", padding: "6px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: "900", zIndex: 2 },
//   cardInfo: { padding: "25px" },
//   prodName: { margin: "0 0 8px 0", fontSize: "19px", color: "#1e293b", fontWeight: "800" },
//   prodDesc: { fontSize: "13px", color: "#64748b", margin: "0 0 15px 0", height: "35px", lineHeight: "1.5" },
//   priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
//   priceText: { fontSize: "22px", fontWeight: "900", color: "#0f172a" },
//   scoreText: { fontSize: "14px", fontWeight: "800" },
//   cartBtn: { width: "100%", padding: "14px", border: "none", borderRadius: "16px", background: "linear-gradient(90deg, #059669, #10b981)", color: "#fff", fontWeight: "bold", cursor: "pointer", transition: "0.3s", boxShadow: "0 4px 10px rgba(5, 150, 105, 0.2)" },

//   pagination: { marginTop: "50px", display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" },
//   pageBtn: { padding: "10px 25px", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: "700", transition: "0.3s" },
//   pageInfo: { fontWeight: "bold", color: "#64748b", fontSize: "15px" }
// };

// export default Products;
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
// import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterType, setFilterType] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [compareList, setCompareList] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const loadProducts = useCallback(async () => {
    try {
      let params = { page, size: 10 };
      if (filterType === "search" && keyword) params.keyword = keyword;
      if (filterType === "eco") params.ecoCertified = true;
      if (filterType === "price") {
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
      }

      // ✅ Sorting Logic: Handles Price or EcoScore (asc/desc)
      if (sortOrder) params.sort = sortOrder;

      const res = await API.get("/api/products", { params });
      setProducts(res.data.data.content || []);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  }, [page, filterType, keyword, minPrice, maxPrice, sortOrder]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keywordFromURL = params.get("keyword");
    if (keywordFromURL) {
      setKeyword(keywordFromURL);
      setFilterType("search");
    }
    loadProducts();
  }, [loadProducts, location.search]);

  const addToCart = async (id) => {
    try {
      await API.post(`/api/cart/add/${id}`);
      toast.success("Added to your eco-collection! 🌿🛒", {
        position: "bottom-center",
        autoClose: 1500,
        theme: "colored",
      });
    } catch (err) {
      toast.error("Failed to add item ❌");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* <Navbar /> */}
      <ToastContainer hideProgressBar />

      <div style={styles.mainLayout}>
        {/* 🌿 SIDEBAR FILTERS */}
        <div style={styles.sidebar}>
          <h3 style={styles.sideTitle}>Refine Search</h3>

          <div style={styles.filterGroup}>
            <button
              style={{ ...styles.filterBtn, background: filterType === "all" ? "#059669" : "#fff", color: filterType === "all" ? "#fff" : "#334155" }}
              onClick={() => { setFilterType("all"); setSortOrder(""); setPage(0); }}
            >
              🛍️ All Products
            </button>
            <button
              style={{ ...styles.filterBtn, background: filterType === "eco" ? "#059669" : "#fff", color: filterType === "eco" ? "#fff" : "#334155" }}
              onClick={() => { setFilterType("eco"); setPage(0); }}
            >
              🍃 Verified Eco
            </button>
          </div>

          <div style={styles.divider} />

          {/* 📊 ECOSCORE SORTING (Added Low to High) */}
          <h4 style={styles.subTitle}>ECOSCORE SORTING</h4>
          <div style={styles.sortBtnGroup}>
            <button
              style={{
                ...styles.sortOptionBtn,
                background: sortOrder === "ecoScore,desc" ? "#059669" : "#fff",
                color: sortOrder === "ecoScore,desc" ? "#fff" : "#334155",
                borderColor: sortOrder === "ecoScore,desc" ? "#059669" : "#e2e8f0"
              }}
              onClick={() => { setSortOrder("ecoScore,desc"); setPage(0); }}
            >
              <span style={{ marginRight: '8px' }}>🍃</span> Top EcoScore (High)
            </button>
            <button
              style={{
                ...styles.sortOptionBtn,
                background: sortOrder === "ecoScore,asc" ? "#059669" : "#fff",
                color: sortOrder === "ecoScore,asc" ? "#fff" : "#334155",
                borderColor: sortOrder === "ecoScore,asc" ? "#059669" : "#e2e8f0"
              }}
              onClick={() => { setSortOrder("ecoScore,asc"); setPage(0); }}
            >
              <span style={{ marginRight: '8px' }}>📉</span> Lowest Impact (Low)
            </button>
          </div>

          <div style={styles.divider} />

          {/* 💰 SORT BY PRICE */}
          <h4 style={styles.subTitle}>SORT BY PRICE</h4>
          <select
            style={styles.select}
            value={sortOrder.includes("price") ? sortOrder : ""}
            onChange={(e) => { setSortOrder(e.target.value); setPage(0); }}
          >
            <option value="">Default</option>
            <option value="price,asc">Price: Low to High</option>
            <option value="price,desc">Price: High to Low</option>
          </select>

          <div style={styles.divider} />

          <h4 style={styles.subTitle}>Price Range</h4>
          <div style={styles.priceInputs}>
            <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={styles.priceInput} />
            <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={styles.priceInput} />
          </div>
          <button style={styles.applyBtn} onClick={() => { setFilterType("price"); setPage(0); }}>Apply Range</button>
        </div>

        {/* 🛍️ PRODUCT GRID */}
        <div style={styles.content}>
          <div style={styles.grid}>
            {products.map(p => (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  ...styles.card,
                  transform: hoveredId === p.id ? "translateY(-10px)" : "none",
                  boxShadow: hoveredId === p.id ? "0 20px 40px rgba(0,0,0,0.06)" : "0 4px 15px rgba(0,0,0,0.02)"
                }}
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <div style={styles.imgContainer}>
                  <img src={p.imageUrl} alt={p.name} style={styles.image} />
                  {(p.ecoCertified === true || p.ecoCertified === 1) ? (
                    <span style={styles.ecoBadge}>Verified Eco Choice ✅</span>
                  ) : (
                    <span style={styles.stdBadge}>Standard Choice 📦</span>
                  )}
                </div>
                <div style={styles.cardInfo}>
                  <h4 style={styles.prodName}>{p.name}</h4>
                  <p style={styles.prodDesc}>{p.details?.substring(0, 45)}...</p>
                  <div style={styles.priceRow}>
                    <span style={styles.priceText}>₹{p.price}</span>
                    <span style={{ ...styles.scoreText, color: p.ecoScore >= 80 ? "#059669" : "#64748b" }}>
                      🍃 {p.ecoScore}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      if (compareList.includes(p.id)) {
                        setCompareList(compareList.filter(id => id !== p.id));
                      } else {
                        if (compareList.length < 2) {
                          setCompareList([...compareList, p.id]);
                        } else {
                          toast.error("Only 2 products allowed");
                        }
                      }
                    }}
                  >
                    {compareList.includes(p.id) ? "Selected ✅" : "Compare"}
                  </button>
                  <button
                    style={styles.cartBtn}
                    onClick={(e) => { e.stopPropagation(); addToCart(p.id); }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {compareList.length === 2 && (
            <button
              style={{
                marginTop: "20px",
                padding: "12px",
                background: "green",
                color: "white",
                border: "none",
                borderRadius: "10px"
              }}
              onClick={() => navigate(`/compare/${compareList[0]}/${compareList[1]}`)}
            >
              Compare Now 🚀
            </button>
          )}

          <div style={styles.pagination}>
            <button disabled={page === 0} onClick={() => setPage(page - 1)} style={styles.pageBtn}>← Prev</button>
            <span style={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} style={styles.pageBtn}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { background: "#fcfcfc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  mainLayout: { display: "flex", padding: "40px 6%", gap: "40px" },
  sidebar: { width: "280px", background: "#fff", padding: "30px", borderRadius: "28px", height: "fit-content", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", position: "sticky", top: "100px", border: "1px solid #f1f5f9" },
  sideTitle: { margin: "0 0 25px 0", color: "#1e293b", fontSize: "22px", fontWeight: "900" },
  filterGroup: { display: "flex", flexDirection: "column", gap: "10px" },
  filterBtn: { padding: "12px 20px", border: "1px solid #f1f5f9", borderRadius: "14px", cursor: "pointer", textAlign: "left", fontWeight: "700", transition: "0.3s" },
  divider: { height: "1px", background: "#f1f5f9", margin: "25px 0" },
  subTitle: { fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px", fontWeight: "800" },
  sortBtnGroup: { display: "flex", flexDirection: "column", gap: "10px" },
  sortOptionBtn: { display: "flex", alignItems: "center", width: "100%", padding: "14px 20px", borderRadius: "15px", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "0.3s", textAlign: "left", border: "1px solid #e2e8f0" },
  select: { width: "100%", padding: "12px", borderRadius: "15px", border: "1px solid #e2e8f0", outline: "none", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  priceInputs: { display: "flex", gap: "10px", marginBottom: "10px" },
  priceInput: { width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #f1f5f9", outline: "none", fontSize: "14px" },
  applyBtn: { width: "100%", padding: "14px", border: "none", borderRadius: "14px", background: "#1e293b", color: "#fff", fontWeight: "700", cursor: "pointer", transition: "0.3s" },
  content: { flex: 1 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "35px" },
  card: { background: "#fff", borderRadius: "32px", overflow: "hidden", transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)", cursor: "pointer", border: "1px solid #f1f5f9" },
  imgContainer: { position: "relative", height: "200px", background: "#f9fafb", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" },
  image: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
  ecoBadge: { position: "absolute", top: "15px", left: "15px", background: "#dcfce7", color: "#166534", padding: "6px 14px", borderRadius: "12px", fontSize: "11px", fontWeight: "900" },
  stdBadge: { position: "absolute", top: "15px", left: "15px", background: "#f1f5f9", color: "#64748b", padding: "6px 14px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" },
  cardInfo: { padding: "25px" },
  prodName: { margin: "0 0 8px 0", fontSize: "20px", color: "#1e293b", fontWeight: "800" },
  prodDesc: { fontSize: "13px", color: "#64748b", margin: "0 0 15px 0", height: "35px", lineHeight: "1.5" },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  priceText: { fontSize: "22px", fontWeight: "900", color: "#0f172a" },
  scoreText: { fontSize: "14px", fontWeight: "800" },
  cartBtn: { width: "100%", padding: "14px", border: "none", borderRadius: "16px", background: "linear-gradient(90deg, #059669, #10b981)", color: "#fff", fontWeight: "bold", cursor: "pointer", transition: "0.3s", boxShadow: "0 4px 10px rgba(5, 150, 105, 0.2)" },
  pagination: { marginTop: "60px", display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" },
  pageBtn: { padding: "12px 24px", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: "700", transition: "0.3s" },
  pageInfo: { fontWeight: "800", color: "#94a3b8", fontSize: "15px" }
};

export default Products;

