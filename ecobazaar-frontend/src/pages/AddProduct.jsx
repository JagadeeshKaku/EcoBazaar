// import React, { useState } from "react";
// import API from "../api/api";
// import Navbar from "../components/Navbar";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function AddProduct() {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [details, setDetails] = useState("");
//   const [price, setPrice] = useState("");
//   const [ecoCertified, setEcoCertified] = useState(false);
//   const [carbonImpact, setCarbonImpact] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [focused, setFocused] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/api/products", {
//         name,
//         details,
//         price,
//         ecoCertified,
//         carbonImpact,
//         imageUrl
//       });

//       toast.success("Product launched successfully! 🚀", {
//         onClose: () => navigate("/seller"),
//         autoClose: 1500
//       });

//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to add product. Please check all fields.");
//     }
//   };

//   return (
//     <div style={styles.pageWrapper}>
//       <Navbar />
//       <ToastContainer theme="colored" position="top-center" />

//       {/* Decorative Orbs */}
//       <div style={styles.orb1}></div>
//       <div style={styles.orb2}></div>

//       <div style={styles.container}>
//         <div style={styles.glassCard}>
          
//           {/* LEFT: LIVE PREVIEW */}
//           <div style={styles.previewSide}>
//              <h3 style={styles.previewTitle}>Live Listing Preview</h3>
//              <div style={styles.previewCard}>
//                 <div style={styles.imagePlaceholder}>
//                    {imageUrl ? (
//                      <img src={imageUrl} alt="Preview" style={styles.previewImg} />
//                    ) : (
//                      <span style={{color: '#94a3b8'}}>Image Preview will appear here</span>
//                    )}
//                 </div>
//                 <div style={styles.previewInfo}>
//                    <p style={styles.prevName}>{name || "Product Name"}</p>
//                    <p style={styles.prevPrice}>₹{price || "0"}</p>
//                    {ecoCertified && <span style={styles.ecoBadge}>🍃 Eco Verified</span>}
//                 </div>
//              </div>
//              <p style={styles.previewNote}>This is how customers will see your product in the Bazaar.</p>
//           </div>

//           {/* RIGHT: FORM */}
//           <div style={styles.formSide}>
//             <h2 style={styles.title}>🌿 List New Product</h2>
            
//             <form onSubmit={handleSubmit} style={styles.form}>
//               <div style={styles.inputGroup}>
//                 <label style={styles.label}>PRODUCT TITLE</label>
//                 <input
//                   type="text"
//                   placeholder="e.g. Organic Bamboo Bottle"
//                   value={name}
//                   onFocus={() => setFocused("name")}
//                   onBlur={() => setFocused("")}
//                   onChange={(e) => setName(e.target.value)}
//                   style={{...styles.input, border: focused === 'name' ? '1px solid #059669' : '1px solid #e2e8f0'}}
//                   required
//                 />
//               </div>

//               <div style={styles.inputGroup}>
//                 <label style={styles.label}>DESCRIPTION</label>
//                 <textarea
//                   placeholder="Tell customers why this is sustainable..."
//                   value={details}
//                   onFocus={() => setFocused("details")}
//                   onBlur={() => setFocused("")}
//                   onChange={(e) => setDetails(e.target.value)}
//                   style={{...styles.textarea, border: focused === 'details' ? '1px solid #059669' : '1px solid #e2e8f0'}}
//                   required
//                 />
//               </div>

//               <div style={styles.row}>
//                 <div style={{...styles.inputGroup, flex: 1}}>
//                   <label style={styles.label}>PRICE (₹)</label>
//                   <input
//                     type="number"
//                     value={price}
//                     onChange={(e) => setPrice(e.target.value)}
//                     style={styles.input}
//                     required
//                   />
//                 </div>
//                 <div style={{...styles.inputGroup, flex: 1}}>
//                   <label style={styles.label}>CARBON IMPACT (kg)</label>
//                   <input
//                     type="number"
//                     placeholder="e.g. 2.5"
//                     value={carbonImpact}
//                     onChange={(e) => setCarbonImpact(e.target.value)}
//                     style={styles.input}
//                   />
//                 </div>
//               </div>

//               <div style={styles.inputGroup}>
//                 <label style={styles.label}>IMAGE URL</label>
//                 <input
//                   type="text"
//                   placeholder="Paste direct image link"
//                   value={imageUrl}
//                   onChange={(e) => setImageUrl(e.target.value)}
//                   style={styles.input}
//                   required
//                 />
//               </div>

//               <label style={styles.checkboxContainer}>
//                 <input
//                   type="checkbox"
//                   checked={ecoCertified}
//                   onChange={(e) => setEcoCertified(e.target.checked)}
//                   style={styles.checkbox}
//                 />
//                 <span style={styles.checkboxLabel}>This product is Eco-Certified 🍃</span>
//               </label>

//               <button type="submit" style={styles.submitBtn}>
//                 Launch Product — 🚀
//               </button>
//             </form>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   pageWrapper: { minHeight: "100vh", background: "#f8fafc", position: "relative", overflow: "hidden", fontFamily: "'Inter', sans-serif" },
//   orb1: { position: "absolute", top: "-10%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", filter: "blur(80px)" },
//   orb2: { position: "absolute", bottom: "10%", left: "5%", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(250, 204, 21, 0.1)", filter: "blur(80px)" },
  
//   container: { display: "flex", justifyContent: "center", padding: "60px 20px", position: "relative", zIndex: 1 },
//   glassCard: { 
//     display: "flex", background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(20px)", 
//     borderRadius: "32px", width: "1000px", border: "1px solid #fff", boxShadow: "0 20px 50px rgba(0,0,0,0.05)", overflow: "hidden" 
//   },

//   // Preview Section
//   previewSide: { flex: 1, background: "#f1f5f9", padding: "40px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" },
//   previewTitle: { fontSize: "14px", fontWeight: "800", color: "#64748b", marginBottom: "30px", textTransform: "uppercase", letterSpacing: "1px" },
//   previewCard: { background: "#fff", borderRadius: "24px", padding: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
//   imagePlaceholder: { width: "100%", height: "200px", background: "#f8fafc", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px", overflow: "hidden" },
//   previewImg: { width: "100%", height: "100%", objectFit: "contain" },
//   previewInfo: { textAlign: "left" },
//   prevName: { fontSize: "18px", fontWeight: "700", margin: "0", color: "#1e293b" },
//   prevPrice: { fontSize: "20px", fontWeight: "800", color: "#059669", marginTop: "5px" },
//   ecoBadge: { display: "inline-block", background: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", marginTop: "10px" },
//   previewNote: { marginTop: "30px", fontSize: "12px", color: "#94a3b8" },

//   // Form Section
//   formSide: { flex: 1.4, padding: "50px" },
//   title: { fontSize: "32px", fontWeight: "900", color: "#1e293b", marginBottom: "30px" },
//   form: { display: "flex", flexDirection: "column", gap: "20px" },
//   inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
//   label: { fontSize: "10px", fontWeight: "800", color: "#94a3b8", letterSpacing: "1px" },
//   input: { padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", transition: "0.3s", fontSize: "15px" },
//   textarea: { padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", minHeight: "100px", fontFamily: "inherit" },
//   row: { display: "flex", gap: "20px" },
  
//   checkboxContainer: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginTop: "10px" },
//   checkbox: { width: "18px", height: "18px", accentColor: "#059669" },
//   checkboxLabel: { fontSize: "14px", color: "#475569", fontWeight: "600" },

//   submitBtn: { 
//     marginTop: "20px", padding: "16px", borderRadius: "15px", border: "none", 
//     background: "linear-gradient(90deg, #059669, #10b981)", color: "white", 
//     fontWeight: "900", fontSize: "16px", cursor: "pointer", transition: "0.3s", boxShadow: "0 10px 20px rgba(5, 150, 105, 0.2)" 
//   }
// };

// export default AddProduct;


import React, { useState } from "react";
import API from "../api/api";
// import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [ecoCertified, setEcoCertified] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [manufacturingImpact, setManufacturingImpact] = useState("");
  const [transportImpact, setTransportImpact] = useState("");
  const [packagingImpact, setPackagingImpact] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await API.post("/api/products", {
      name,
      details,
      price: parseFloat(price), // ✅ FIX

      ecoCertified,
      imageUrl,

      manufacturingImpact: manufacturingImpact ? parseFloat(manufacturingImpact) : 0,
      transportImpact: transportImpact ? parseFloat(transportImpact) : 0,
      packagingImpact: packagingImpact ? parseFloat(packagingImpact) : 0
    });

    toast.success("Product launched successfully! 🚀", {
      onClose: () => navigate("/seller"),
      autoClose: 1500
    });

  } catch (error) {
    console.error(error);
    toast.error("Failed to add product ❌");
  }
};

  return (
    <div style={styles.pageWrapper}>
      {/* <Navbar /> */}
      <ToastContainer theme="colored" position="top-center" />

      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>🌿 Add New Eco-Product</h2>
          <p style={styles.subtitle}>List your sustainable products and track their impact.</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.section}>
              <label style={styles.label}>Product Name</label>
              <input
                type="text"
                placeholder="e.g. Bamboo Toothbrush"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.section}>
              <label style={styles.label}>Description</label>
              <textarea
                placeholder="Tell buyers why this is eco-friendly..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                style={styles.textarea}
                required
              />
            </div>

            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.carbonBox}>
              <h3 style={styles.carbonTitle}>🌱 Carbon Impact Breakdown</h3>
              <div style={styles.grid}>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Manufacturing (kg)"
                  value={manufacturingImpact}
                  onChange={(e) => setManufacturingImpact(e.target.value)}
                  style={styles.impactInput}
                />
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Transport (kg)"
                  value={transportImpact}
                  onChange={(e) => setTransportImpact(e.target.value)}
                  style={styles.impactInput}
                />
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Packaging (kg)"
                  value={packagingImpact}
                  onChange={(e) => setPackagingImpact(e.target.value)}
                  style={styles.impactInput}
                />
              </div>
            </div>

            <label style={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={ecoCertified}
                onChange={(e) => setEcoCertified(e.target.checked)}
                style={styles.checkbox}
              />
              <span style={{ fontSize: "14px", color: "#374151" }}>This product is Eco-Certified 🍃</span>
            </label>

            <button type="submit" style={styles.button}>
              Launch Product 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
    padding: "80px 20px 40px"
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto"
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#065f46",
    textAlign: "center",
    margin: "0 0 8px 0"
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: "30px",
    fontSize: "15px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginLeft: "4px"
  },
  row: {
    display: "flex",
    gap: "15px"
  },
  input: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #e5e7eb",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box"
  },
  textarea: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #e5e7eb",
    fontSize: "15px",
    minHeight: "100px",
    outline: "none",
    resize: "vertical"
  },
  carbonBox: {
    background: "#f9fafb",
    padding: "20px",
    borderRadius: "16px",
    border: "1px dashed #10b981"
  },
  carbonTitle: {
    fontSize: "16px",
    color: "#047857",
    margin: "0 0 15px 0",
    fontWeight: "600"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px"
  },
  impactInput: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "13px",
    width: "100%",
    boxSizing: "border-box"
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    padding: "5px"
  },
  checkbox: {
    width: "18px",
    height: "18px",
    accentColor: "#10b981"
  },
  button: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#10b981",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.4)",
    transition: "transform 0.2s, background 0.2s"
  }
};

export default AddProduct;
