// import { useEffect, useState } from "react";
// import API from "../api/api";
// import Navbar from "../components/Navbar";

// function UserDashboard() {
//   const [stats, setStats] = useState({ orders: 0, carbon: 0 });
//   const [hoveredCard, setHoveredCard] = useState(null);

//   useEffect(() => {
//     loadStats();
//   }, []);

//   const loadStats = async () => {
//     try {
//       const response = await API.get("/api/user/dashboard");
//       setStats(response.data);
//     } catch (error) {
//       console.error("Dashboard API Error:", error);
//       setStats({ orders: 0, carbon: 0 });
//     }
//   };

//   // Logic for dynamic Eco Rank based on Carbon
//   const getEcoRank = (carbon) => {
//     if (carbon > 50) return { title: "Carbon Warrior", color: "#16a34a", icon: "🛡️" };
//     if (carbon > 20) return { title: "Green Shopper", color: "#22c55e", icon: "🌱" };
//     return { title: "Eco Beginner", color: "#84cc16", icon: "🥚" };
//   };

//   const rank = getEcoRank(stats.carbon || 0);

//   return (
//     <div style={styles.pageWrapper}>
//       <Navbar />
      
//       {/* Background Glows */}
//       <div style={styles.glow1}></div>
//       <div style={styles.glow2}></div>

//       <div style={styles.container}>
//         <div style={styles.headerArea}>
//           <h2 style={styles.mainTitle}>🌍 Carbon Insights Dashboard</h2>
//           <p style={styles.subtitle}>Real-time analytics of your environmental footprint.</p>
//         </div>

//         <div style={styles.statsGrid}>
//           {/* Card 1: Total Orders */}
//           <div 
//             onMouseEnter={() => setHoveredCard(1)}
//             onMouseLeave={() => setHoveredCard(null)}
//             style={{...styles.statCard, ...(hoveredCard === 1 ? styles.cardHover : {})}}
//           >
//             <div style={styles.cardHeader}>
//               <span style={styles.iconBox}>📦</span>
//               <span style={styles.cardLabel}>SHOPPING HISTORY</span>
//             </div>
//             <h2 style={styles.statNumber}>{stats.orders || 0}</h2>
//             <p style={styles.statDesc}>Total Orders Placed</p>
//             <div style={styles.progressBar}><div style={{...styles.progressFill, width: '65%', background: '#3b82f6'}}></div></div>
//           </div>

//           {/* Card 2: Carbon Impact */}
//           <div 
//             onMouseEnter={() => setHoveredCard(2)}
//             onMouseLeave={() => setHoveredCard(null)}
//             style={{...styles.statCard, ...(hoveredCard === 2 ? styles.cardHover : {})}}
//           >
//             <div style={styles.cardHeader}>
//               <span style={{...styles.iconBox, background: '#dcfce7'}}>📉</span>
//               <span style={styles.cardLabel}>CARBON SAVED</span>
//             </div>
//             <h2 style={{...styles.statNumber, color: '#059669'}}>{stats.carbon || 0}<span style={styles.unit}>kg</span></h2>
//             <p style={styles.statDesc}>CO₂ prevented from entering atmosphere</p>
//             <div style={styles.progressBar}><div style={{...styles.progressFill, width: '85%', background: '#059669'}}></div></div>
//           </div>

//           {/* Card 3: Eco Rank */}
//           <div 
//             onMouseEnter={() => setHoveredCard(3)}
//             onMouseLeave={() => setHoveredCard(null)}
//             style={{...styles.statCard, ...(hoveredCard === 3 ? styles.cardHover : {})}}
//           >
//             <div style={styles.cardHeader}>
//               <span style={{...styles.iconBox, background: '#fef3c7'}}>{rank.icon}</span>
//               <span style={styles.cardLabel}>YOUR STATUS</span>
//             </div>
//             <h2 style={{...styles.statNumber, color: rank.color, fontSize: '28px'}}>{rank.title}</h2>
//             <p style={styles.statDesc}>Based on your sustainable choices</p>
//             <div style={styles.rankBadge}>Level 4 Sustainability</div>
//           </div>
//         </div>

//         {/* Tip of the Day */}
//         <div style={styles.ecoTipBox}>
//           <span style={{fontSize: '24px'}}>💡</span>
//           <p><b>Eco Tip:</b> Buying locally produced items reduces transport carbon by up to 30%!</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   pageWrapper: { minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden" },
//   container: { padding: "50px 10%", position: "relative", zIndex: 1 },
//   headerArea: { marginBottom: "40px" },
//   mainTitle: { fontSize: "32px", fontWeight: "900", color: "#1e293b", margin: 0 },
//   subtitle: { color: "#64748b", marginTop: "8px" },

//   statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" },
  
//   statCard: { 
//     background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)", padding: "30px", 
//     borderRadius: "28px", border: "1px solid rgba(255, 255, 255, 0.6)", transition: "0.3s ease",
//     boxShadow: "0 10px 25px rgba(0,0,0,0.02)"
//   },
//   cardHover: { transform: "translateY(-8px)", boxShadow: "0 20px 40px rgba(0,0,0,0.06)", border: "1px solid #059669" },
  
//   cardHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" },
//   iconBox: { width: "40px", height: "40px", borderRadius: "12px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" },
//   cardLabel: { fontSize: "12px", fontWeight: "800", color: "#94a3b8", letterSpacing: "1px" },
  
//   statNumber: { fontSize: "42px", fontWeight: "900", color: "#1e293b", margin: "10px 0" },
//   unit: { fontSize: "18px", color: "#94a3b8", marginLeft: "5px" },
//   statDesc: { fontSize: "14px", color: "#64748b", margin: 0 },

//   progressBar: { height: "8px", background: "#f1f5f9", borderRadius: "10px", marginTop: "20px", overflow: "hidden" },
//   progressFill: { height: "100%", borderRadius: "10px", transition: "width 1s ease-in-out" },

//   rankBadge: { marginTop: "20px", display: "inline-block", padding: "6px 15px", background: "#1e293b", color: "#fff", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },

//   ecoTipBox: { marginTop: "40px", background: "#fff", padding: "20px 30px", borderRadius: "24px", display: "flex", alignItems: "center", gap: "20px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" },

//   glow1: { position: "absolute", top: "10%", left: "10%", width: "400px", height: "400px", background: "rgba(5, 150, 105, 0.08)", filter: "blur(100px)", borderRadius: "50%" },
//   glow2: { position: "absolute", bottom: "10%", right: "10%", width: "400px", height: "400px", background: "rgba(59, 130, 246, 0.08)", filter: "blur(100px)", borderRadius: "50%" },
// };

// export default UserDashboard;
