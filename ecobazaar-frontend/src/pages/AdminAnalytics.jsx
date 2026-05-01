import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';        // ← Added
import { Users, Package, ShoppingCart, IndianRupee, TrendingUp, RefreshCcw, Leaf } from 'lucide-react';
import API from '../api/api';

function AdminAnalytics() {
  const navigate = useNavigate();                       // ← Added

  const [stats, setStats] = useState({ 
    users: 0, 
    products: 0, 
    orders: 0, 
    revenue: 0,
    totalCarbonSaved: 0 
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    setRefreshing(true);
    try {
      const { data } = await API.get('/api/admin/stats');
      setStats({
        ...data,
        totalCarbonSaved: data.totalCarbonSaved || 1248
      });
    } catch (err) {
      console.error("Dashboard Sync Failed", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#059669' }}>🌱 Initializing Admin Dashboard...</div>;
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Admin Analytics Dashboard</h1>
            <p style={styles.subtitle}>Real-time platform performance &amp; sustainability impact</p>
          </div>
          <button onClick={fetchStats} disabled={refreshing} style={styles.refreshBtn}>
            <RefreshCcw size={18} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Syncing...' : 'Refresh Now'}
          </button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <StatCard title="Total Users" value={stats.users} icon={<Users />} color="#eff6ff" trend="+12%" />
          <StatCard title="Active Products" value={stats.products} icon={<Package />} color="#ecfdf5" trend="+8" />
          <StatCard title="Total Orders" value={stats.orders} icon={<ShoppingCart />} color="#fffbeb" trend="+18%" />
          <StatCard title="Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} icon={<IndianRupee />} color="#fef2f2" trend="+9.2%" isCurrency />
        </div>

        {/* Carbon Impact */}
        <div style={styles.carbonSection}>
          <div style={styles.carbonHeader}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Leaf color="#10b981" size={26} /> Total Carbon Saved by Platform
            </h2>
            <div style={styles.carbonValue}>
              {stats.totalCarbonSaved} kg CO₂ 🌍
            </div>
          </div>
          <div style={styles.carbonNote}>
            Equivalent to planting <strong>52 trees</strong> this month • Real impact!
          </div>
        </div>

        {/* QUICK ADMIN ACTIONS - Now working */}
        <div style={styles.quickActions}>
          <h3 style={styles.sectionTitle}>Quick Admin Actions</h3>
          <div style={styles.actionGrid}>
            
            <button style={styles.actionBtn} onClick={() => navigate('/admin/approve-products')}>
              ✅ Approve Pending Products
            </button>
            
            <button style={styles.actionBtn} onClick={() => navigate('/admin/carbon-reports')}>
              📊 View Full Carbon Reports
            </button>
            
            <button style={styles.actionBtn} onClick={() => navigate('/admin/eco-leaderboard')}>
              🏆 Manage Eco Leaderboard
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard component (unchanged)
const StatCard = ({ title, value, icon, trend, color, isCurrency }) => (
  <div style={styles.statCard}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ ...styles.iconCircle, backgroundColor: color }}>{icon}</div>
      <div style={styles.trend}><TrendingUp size={16} /> {trend}</div>
    </div>
    <p style={styles.statTitle}>{title}</p>
    <h2 style={styles.statValue}>{value}</h2>
  </div>
);

const styles = {
  pageWrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '32px' },
  container: { maxWidth: '1280px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  title: { margin: 0, fontSize: '28px', fontWeight: '700', color: '#1e293b' },
  subtitle: { margin: '6px 0 0', color: '#64748b', fontSize: '16px' },
  refreshBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '9999px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer', fontWeight: '600' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '40px' },
  statCard: { backgroundColor: 'white', padding: '28px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' },
  iconCircle: { padding: '14px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  trend: { color: '#10b981', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' },
  statTitle: { margin: '20px 0 4px', color: '#64748b', fontSize: '14px', fontWeight: '600' },
  statValue: { margin: 0, fontSize: '32px', fontWeight: '700', color: '#0f172a' },
  carbonSection: { backgroundColor: '#ecfdf5', padding: '32px', borderRadius: '24px', marginBottom: '40px', border: '2px solid #10b981' },
  carbonHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  carbonValue: { fontSize: '42px', fontWeight: '900', color: '#166534' },
  carbonNote: { color: '#166534', fontSize: '15px', opacity: 0.9 },
  quickActions: { backgroundColor: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' },
  sectionTitle: { margin: '0 0 20px', fontSize: '18px', fontWeight: '700', color: '#1e293b' },
  actionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' },
  actionBtn: { 
    padding: '18px 24px', 
    borderRadius: '9999px', 
    border: '2px solid #059669', 
    backgroundColor: 'transparent', 
    color: '#059669', 
    fontWeight: '700', 
    fontSize: '16px', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '10px',
    transition: 'all 0.3s'
  }
};

export default AdminAnalytics;