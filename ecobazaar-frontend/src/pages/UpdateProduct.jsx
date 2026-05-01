import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
// import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("0");
  const [imageUrl, setImageUrl] = useState("");
  const [ecoCertified, setEcoCertified] = useState(false);
  
  // Carbon Metrics States
  const [manufacturingImpact, setManufacturingImpact] = useState("0");
  const [transportImpact, setTransportImpact] = useState("0");
  const [packagingImpact, setPackagingImpact] = useState("0");
  const [carbonImpact, setCarbonImpact] = useState("0");
  const [ecoScore, setEcoScore] = useState(0);

  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  // 🧠 Smart Calculation: Total Carbon & Dynamic Eco-Score
  useEffect(() => {
    const totalCarbon = 
      parseFloat(manufacturingImpact || 0) + 
      parseFloat(transportImpact || 0) + 
      parseFloat(packagingImpact || 0);
    
    setCarbonImpact(totalCarbon.toFixed(2));

    // Logical Rule: Base 100 for Certified, Base 70 for Standard
    // Penalty: Subtract 2 points for every 1kg of Carbon
    let base = ecoCertified ? 100 : 70;
    let calculatedScore = base - (totalCarbon * 2); 
    
    setEcoScore(Math.max(1, Math.min(100, Math.round(calculatedScore))));
  }, [manufacturingImpact, transportImpact, packagingImpact, ecoCertified]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/products/${id}`);
        const p = response.data.data || response.data; 
        
        setName(p.name || "");
        setDetails(p.details || "");
        setPrice(p.price || "0");
        setImageUrl(p.imageUrl || "");
        setEcoCertified(p.ecoCertified || false);
        setManufacturingImpact(p.manufacturingImpact || "0");
        setTransportImpact(p.transportImpact || "0");
        setPackagingImpact(p.packagingImpact || "0");
      } catch (error) {
        toast.error("❌ Could not fetch product details.");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Force numbers to be numbers using Number() or parseFloat()
    const payload = { 
      name, 
      details, 
      price: Number(price), 
      imageUrl, 
      carbonImpact: Number(carbonImpact), 
      manufacturingImpact: Number(manufacturingImpact), 
      transportImpact: Number(transportImpact), 
      packagingImpact: Number(packagingImpact), 
      ecoCertified: Boolean(ecoCertified), 
      ecoScore: Number(ecoScore) // Ensure this is a clean Integer
    };

    await API.put(`/api/products/${id}`, payload);

    toast.success("🌿 Bazaar Updated Successfully!", {
      onClose: () => navigate("/seller"),
      autoClose: 1500
    });
  } catch (error) {
    toast.error("❌ Failed to update product.");
  }
};


  if (loading) return <div style={styles.loader}>🌱 Loading Eco-Data...</div>;

  return (
    <div style={styles.pageWrapper}>
      {/* <Navbar /> */}
      <ToastContainer position="top-right" autoClose={1500} theme="colored" />
      
      <div style={styles.mainContent}>
        {/* --- LEFT: LIVE PREVIEW --- */}
        <div style={styles.previewSection}>
          <p style={styles.previewLabel}>LIVE PREVIEW</p>
          <div style={styles.previewCard}>
            <div style={styles.imgPlaceholder}>
              {imageUrl ? <img src={imageUrl} alt="Preview" style={styles.previewImg} /> : "No Image"}
            </div>
            <div style={styles.previewDetails}>
              <h3 style={styles.previewName}>{name || "Product Name"}</h3>
              <p style={styles.previewPrice}>₹{price}</p>
              <div style={styles.tagRow}>
                {ecoCertified && <span style={styles.ecoTag}>🌿 Certified</span>}
                <span style={{...styles.scoreTag, background: ecoScore > 60 ? '#dcfce7' : '#fee2e2'}}>
                  ⭐ Score: {ecoScore}
                </span>
              </div>
              <div style={styles.previewCarbon}>Total Carbon: {carbonImpact}kg</div>
            </div>
          </div>
          <p style={styles.calcNote}>*Eco-score is dynamic based on carbon and certification.</p>
        </div>

        {/* --- RIGHT: FORM --- */}
        <div style={styles.formSection}>
          <h2 style={styles.formTitle}>✏️ Update Listing</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>PRODUCT NAME</label>
              <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div style={styles.row}>
              <div style={{...styles.inputGroup, flex: 1}}>
                <label style={styles.label}>PRICE (₹)</label>
                <input style={styles.input} type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div style={{...styles.inputGroup, flex: 1.5}}>
                <label style={styles.label}>IMAGE URL</label>
                <input style={styles.input} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </div>
            </div>

            <div style={styles.carbonBox}>
              <label style={styles.carbonLabel}>🌱 CARBON BREAKDOWN (KG)</label>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.subLabel}>MFG</label>
                  <input style={styles.input} type="number" step="0.1" value={manufacturingImpact} onChange={(e) => setManufacturingImpact(e.target.value)} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.subLabel}>TRANS</label>
                  <input style={styles.input} type="number" step="0.1" value={transportImpact} onChange={(e) => setTransportImpact(e.target.value)} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.subLabel}>PKG</label>
                  <input style={styles.input} type="number" step="0.1" value={packagingImpact} onChange={(e) => setPackagingImpact(e.target.value)} />
                </div>
              </div>
            </div>

            <div style={styles.row}>
              <div style={{...styles.inputGroup, flex: 1}}>
                <label style={styles.label}>CALCULATED SCORE</label>
                <div style={styles.readOnlyScore}>{ecoScore} / 100</div>
              </div>
              <label style={styles.checkboxArea}>
                <input type="checkbox" checked={ecoCertified} onChange={(e) => setEcoCertified(e.target.checked)} />
                <span style={styles.checkboxText}>Eco-Certified ✔️</span>
              </label>
            </div>

            <button 
              type="submit" 
              onMouseEnter={() => setIsHovered(true)} 
              onMouseLeave={() => setIsHovered(false)}
              style={{...styles.updateBtn, background: isHovered ? "#059669" : "#10b981"}}
            >
              Update Listing — 🚀
            </button>
            <button type="button" onClick={() => navigate("/seller")} style={styles.cancelLink}>Discard Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  loader: { textAlign: 'center', marginTop: '100px', color: '#059669', fontSize: '20px', fontWeight: 'bold' },
  mainContent: { display: "flex", maxWidth: "1100px", margin: "40px auto", background: "#fff", borderRadius: "30px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" },
  previewSection: { flex: 1, background: "#f1f5f9", padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRight: "1px solid #e2e8f0" },
  previewLabel: { fontWeight: "800", color: "#64748b", fontSize: "11px", marginBottom: "20px" },
  previewCard: { width: "250px", background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" },
  imgPlaceholder: { height: "160px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: '#94a3b8' },
  previewImg: { width: "100%", height: "100%", objectFit: "contain" },
  previewDetails: { padding: "15px" },
  previewName: { margin: "0", fontSize: "16px", color: "#1e293b", fontWeight: '700' },
  previewPrice: { fontSize: "18px", fontWeight: "bold", color: "#10b981", margin: "5px 0" },
  tagRow: { display: "flex", gap: "5px", marginBottom: "10px" },
  ecoTag: { fontSize: "9px", color: "#059669", background: "#dcfce7", padding: "2px 5px", borderRadius: "4px", fontWeight: 'bold' },
  scoreTag: { fontSize: "9px", color: "#1e293b", padding: "2px 5px", borderRadius: "4px", fontWeight: 'bold' },
  previewCarbon: { fontSize: "10px", color: "#64748b" },
  calcNote: { fontSize: "10px", color: "#94a3b8", marginTop: "20px", textAlign: 'center' },
  formSection: { flex: 1.4, padding: "40px" },
  formTitle: { fontSize: "24px", fontWeight: "900", marginBottom: "25px", color: "#0f172a" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "5px", flex: 1 },
  label: { fontSize: "10px", fontWeight: "800", color: "#64748b" },
  subLabel: { fontSize: "9px", fontWeight: "700", color: "#94a3b8" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" },
  carbonBox: { background: "#f8fafc", padding: "15px", borderRadius: "12px", border: "1px solid #f1f5f9" },
  carbonLabel: { fontSize: "11px", fontWeight: "800", color: "#059669", marginBottom: "10px", display: "block" },
  row: { display: "flex", gap: "15px", alignItems: 'center' },
  readOnlyScore: { padding: "10px", background: "#f1f5f9", borderRadius: "8px", fontWeight: "bold", color: "#0f172a", textAlign: 'center' },
  checkboxArea: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", flex: 1 },
  checkboxText: { fontSize: "13px", fontWeight: "600" },
  updateBtn: { padding: "16px", borderRadius: "12px", border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer", transition: "0.3s", marginTop: "10px" },
  cancelLink: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", textDecoration: "underline", fontSize: "12px", textAlign: 'center', display: 'block', marginTop: '10px' }
};

export default UpdateProduct;
