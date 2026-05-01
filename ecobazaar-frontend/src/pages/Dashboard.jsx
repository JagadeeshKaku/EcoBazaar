import { useEffect, useState, useCallback } from "react";
import API from "../api/api";
// import Navbar from "../components/Navbar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, totalCarbon: 0, rank: "Eco Explorer" });
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await API.get("/api/orders/stats");
      const data = res.data.data;
      
      setStats(data);
      setBarData([
        { name: "Orders", value: data.totalOrders || 0 },
        { name: "Carbon", value: data.totalCarbon || 0 }
      ]);
      
      // Calculate dynamic Eco Distribution
      setPieData([
        { name: "Eco Friendly", value: data.totalCarbon > 100 ? 75 : 45 },
        { name: "Standard", value: data.totalCarbon > 100 ? 25 : 55 }
      ]);
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Live sync every 10s
    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <div style={styles.pageWrapper}>
      {/* <Navbar /> */}

      <div style={styles.container}>
        <div style={styles.topHeader}>
          <div>
            <h1 style={styles.mainTitle}>Carbon Insights</h1>
            <p style={styles.subTitle}>Monitoring your environmental footprint in real-time.</p>
          </div>
          <div style={styles.liveIndicator}>
            <span style={styles.pulseDot}></span> System Live
          </div>
        </div>

        {/* 🏆 BENTO GRID STATS */}
        <div style={styles.bentoGrid}>
          
          {/* Card 1: Orders (Blue) */}
          <div 
            onMouseEnter={() => setHoveredCard(1)} onMouseLeave={() => setHoveredCard(null)}
            style={{...styles.statCard, background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", transform: hoveredCard === 1 ? "translateY(-10px)" : "none"}}
          >
            <div style={{...styles.iconBox, background: "#3b82f6"}}>📦</div>
            <p style={styles.cardLabel}>LIFETIME ORDERS</p>
            <h2 style={styles.cardValue}>{stats.totalOrders}</h2>
            <div style={styles.miniProgress}><div style={{...styles.progressFill, width: "60%", background: "#3b82f6"}}></div></div>
          </div>

          {/* Card 2: Carbon (Green) */}
          <div 
            onMouseEnter={() => setHoveredCard(2)} onMouseLeave={() => setHoveredCard(null)}
            style={{...styles.statCard, background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", transform: hoveredCard === 2 ? "translateY(-10px)" : "none"}}
          >
            <div style={{...styles.iconBox, background: "#10b981"}}>📉</div>
            <p style={styles.cardLabel}>CARBON OFFSET</p>
            <h2 style={{...styles.cardValue, color: "#065f46"}}>{stats.totalCarbon} <span style={{fontSize: "14px"}}>kg</span></h2>
            <div style={styles.miniProgress}><div style={{...styles.progressFill, width: "85%", background: "#10b981"}}></div></div>
          </div>

          {/* Card 3: Rank (Gold) */}
          <div 
            onMouseEnter={() => setHoveredCard(3)} onMouseLeave={() => setHoveredCard(null)}
            style={{...styles.statCard, background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", transform: hoveredCard === 3 ? "translateY(-10px)" : "none"}}
          >
            <div style={{...styles.iconBox, background: "#f59e0b"}}>🏆</div>
            <p style={styles.cardLabel}>COMMUNITY RANK</p>
            <h2 style={{...styles.cardValue, color: "#92400e", fontSize: "24px"}}>{stats.rank || "High Impact"}</h2>
            <p style={{fontSize: "11px", fontWeight: "bold", color: "#b45309", marginTop: "10px"}}>TOP 5% GLOBALLY</p>
          </div>

        </div>

        {/* 📊 ANALYTICS SECTION */}
        <div style={styles.chartsWrapper}>
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Consumption vs. Impact</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={styles.tooltipStyle} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}> {/* ✅ Fixed: Added values for rounded corners */}

                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#3b82f6" : "#10b981"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Eco-Sustainability Distribution</h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={pieData} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                  <Cell fill="#10b981" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip contentStyle={styles.tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div style={styles.legendRow}>
              <span style={{color: "#10b981"}}>● Eco-Friendly</span>
              <span style={{color: "#f43f5e"}}>● Non-Eco</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PREMIUM DESIGN STYLES ---
const styles = {
  pageWrapper: { minHeight: "100vh", background: "#f8fafc", fontFamily: "'Plus Jakarta Sans', sans-serif" },
  container: { padding: "40px 10%" },
  topHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
  mainTitle: { fontSize: "32px", fontWeight: "900", color: "#0f172a", margin: 0 },
  subTitle: { color: "#64748b", fontSize: "14px", marginTop: "5px" },
  liveIndicator: { background: "#fff", padding: "8px 16px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", fontWeight: "800", boxShadow: "0 4px 10px rgba(0,0,0,0.04)" },
  pulseDot: { width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%", boxShadow: "0 0 10px #ef4444" },

  bentoGrid: { display: "flex", gap: "25px", marginBottom: "40px" },
  statCard: { flex: 1, padding: "30px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.5)", transition: "0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" },
  iconBox: { width: "50px", height: "50px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "20px", color: "#fff", boxShadow: "0 10px 15px rgba(0,0,0,0.05)" },
  cardLabel: { fontSize: "11px", fontWeight: "900", color: "#64748b", letterSpacing: "1.5px", marginBottom: "10px" },
  cardValue: { fontSize: "42px", fontWeight: "950", color: "#1e293b", margin: 0 },
  miniProgress: { height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "10px", marginTop: "20px", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: "10px", transition: "1s ease" },

  chartsWrapper: { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px" },
  chartContainer: { background: "#fff", padding: "35px", borderRadius: "40px", border: "1px solid #f1f5f9", boxShadow: "0 20px 40px rgba(0,0,0,0.03)" },
  chartTitle: { fontSize: "18px", fontWeight: "800", color: "#334155", marginBottom: "30px" },
  tooltipStyle: { borderRadius: "16px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", fontWeight: "bold" },
  legendRow: { display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px", fontSize: "12px", fontWeight: "800" }
};

export default Dashboard;
