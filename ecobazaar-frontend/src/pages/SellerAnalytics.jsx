import React, { useEffect, useState, useMemo } from 'react';
import { 
  Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ComposedChart, Line 
} from 'recharts';
import { 
  Package, CheckCircle, Leaf, TrendingUp, TrendingDown, 
  Award, AlertTriangle, Lightbulb 
} from 'lucide-react';
import API from '../api/api';

const SellerAnalytics = () => {
  const [products, setProducts] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Seller Data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const prodRes = await API.get("/api/products/seller");
        const prodArray = (prodRes.data && prodRes.data.data) ? prodRes.data.data : (prodRes.data || []);
        setProducts(prodArray);

        const revRes = await API.get("/api/orders/seller-revenue");
        setRevenueData(revRes.data || []);
      } catch (err) {
        console.error("Sync failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Export CSV
  const handleExport = () => {
    const headers = "Rank,Product Name,EcoScore,Carbon Impact(kg),Status\n";
    const csvContent = products.map((p, i) => 
      `${i+1},"${p.name}",${p.ecoScore || 0},${p.carbonImpact || 0},${p.approved ? 'Certified' : 'Pending'}`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EcoBazaar_Seller_Insights_${new Date().toLocaleDateString()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Dynamic Metrics
  const metrics = useMemo(() => {
    const total = products.length;
    const active = products.filter(p => p.approved || p.stock > 0).length;
    const avgScore = total ? (products.reduce((acc, p) => acc + (p.ecoScore || 0), 0) / total).toFixed(1) : 0;
    const totalCarbon = products.reduce((acc, p) => acc + (parseFloat(p.carbonImpact) || 0), 0).toFixed(1);
    const certPercent = total ? ((active / total) * 100).toFixed(0) : 0;

    const performanceData = products.slice(0, 6).map(p => ({
      name: p.name.length > 10 ? p.name.substring(0, 10) + '...' : p.name,
      impact: parseFloat(p.carbonImpact) || 0,
      score: p.ecoScore || 0
    }));

    const topProducts = [...products].sort((a, b) => (b.ecoScore || 0) - (a.ecoScore || 0)).slice(0, 4);
    const highImpact = [...products].sort((a, b) => (parseFloat(b.carbonImpact) || 0) - (parseFloat(a.carbonImpact) || 0)).slice(0, 3);

    return { total, active, avgScore, totalCarbon, certPercent, performanceData, topProducts, highImpact };
  }, [products]);

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: '#059669', fontWeight: 'bold' }}>Synchronizing your Eco-Insights...</div>;

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif', color: '#111827' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Seller Insights</h1>
          <button 
            onClick={handleExport}
            style={{ backgroundColor: '#059669', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
          >
            <TrendingUp size={18} /> Export Report (CSV)
          </button>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'Total Products', val: metrics.total, icon: Package, col: '#2563eb', trend: '+12%', up: true },
            { label: 'Active Listings', val: metrics.active, icon: CheckCircle, col: '#16a34a', trend: '+2%', up: true },
            { label: 'Avg EcoScore', val: `${metrics.avgScore}/100`, icon: Award, col: '#059669', trend: '+1.4', up: true },
            { label: 'Total Carbon', val: `${metrics.totalCarbon}kg`, icon: Leaf, col: '#0d9488', trend: '-14%', up: true },
            { label: 'Eco Certified', val: `${metrics.certPercent}%`, icon: CheckCircle, col: '#4f46e5', trend: 'Stable', up: true },
          ].map((s, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '8px', color: s.col }}><s.icon size={20} /></div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: 'bold', color: s.up ? '#16a34a' : '#dc2626' }}>
                  {s.trend} {s.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                </div>
              </div>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '15px 0 5px' }}>{s.label}</p>
              <h3 style={{ fontSize: '22px', margin: 0, fontWeight: '800' }}>{s.val}</h3>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          <div style={cardStyle}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Monthly Revenue Growth</h3>
            <div style={chartBoxStyle}>
              <ResponsiveContainer>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#colorRev)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>EcoScore vs Carbon Impact</h3>
            <div style={chartBoxStyle}>
              <ResponsiveContainer>
                <ComposedChart data={metrics.performanceData}>
                  <CartesianGrid stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 11}} />
                  <YAxis yAxisId="left" orientation="left" stroke="#10b981" />
                  <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="score" fill="#10b981" barSize={30} radius={[4,4,0,0]} />
                  <Line yAxisId="right" type="monotone" dataKey="impact" stroke="#f59e0b" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables + Alerts */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '30px', marginBottom: '40px' }}>
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '20px' }}>Top Eco-Friendly Products</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#9ca3af', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px' }}>Rank</th>
                  <th style={{ padding: '10px' }}>Product</th>
                  <th style={{ padding: '10px' }}>EcoScore</th>
                  <th style={{ padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {metrics.topProducts.map((p, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f9fafb' }}>
                    <td style={{ padding: '15px 10px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                    <td style={{ padding: '15px 10px', fontWeight: '600' }}>{p.name}</td>
                    <td style={{ padding: '15px 10px', color: '#059669', fontWeight: 'bold' }}>{p.ecoScore}</td>
                    <td style={{ padding: '15px 10px' }}>
                      <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>CERTIFIED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={cardStyle}>
            <h3 style={{ marginBottom: '20px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} /> Carbon Alerts
            </h3>
            {metrics.highImpact.length > 0 ? (
              metrics.highImpact.map((p, i) => (
                <div key={i} style={{ padding: '15px', backgroundColor: '#fff1f2', borderRadius: '10px', marginBottom: '12px', border: '1px solid #fee2e2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{p.name}</span>
                  <span style={{ backgroundColor: '#dc2626', color: 'white', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}>
                    {p.carbonImpact}kg CO₂
                  </span>
                </div>
              ))
            ) : (
              <p style={{color: '#9ca3af', fontSize: '14px'}}>No high-impact alerts.</p>
            )}
          </div>
        </div>

        {/* Sustainability Tips */}
        <div style={{ backgroundColor: '#111827', padding: '40px', borderRadius: '16px', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Lightbulb color="#facc15" size={24} />
            <h3 style={{ margin: 0, fontSize: '20px' }}>Sustainability Optimization Tips</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>Boost Your EcoScore</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af', lineHeight: '1.5' }}>
                Transitioning to 100% biodegradable packaging for <b>{metrics.topProducts[0]?.name || 'your items'}</b> could improve your average score by +12%.
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>Carbon Reduction</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af', lineHeight: '1.5' }}>
                Your current average footprint is {metrics.totalCarbon}kg. Reducing shipping distances for your "High Impact" items can save ~5kg CO₂ monthly.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const cardStyle = { 
  backgroundColor: 'white', 
  padding: '20px', 
  borderRadius: '12px', 
  border: '1px solid #e5e7eb', 
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
};

const chartBoxStyle = { height: '300px', width: '100%', marginTop: '20px' };

export default SellerAnalytics;