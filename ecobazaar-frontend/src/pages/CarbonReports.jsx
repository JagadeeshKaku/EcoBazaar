import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import API from "../api/api";          // ← Corrected

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

function CarbonReports() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [totalSaved, setTotalSaved] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCarbonData = async () => {
    try {
      const res = await API.get('/api/admin/carbon-reports');
      const data = res.data;

      setTotalSaved(data.totalCarbonSaved || 0);

      setChartData({
        labels: data.months || ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{
          label: 'Carbon Saved (kg)',
          data: data.carbonSavedPerMonth || [320, 450, 680, 1248],
          backgroundColor: '#10b981',
          borderRadius: 8,
        }]
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarbonData();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading carbon reports...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🌍 Platform Carbon Reports</h1>
      <div style={styles.card}>
        <h2>Total Carbon Saved This Year</h2>
        <h3 style={styles.bigNumber}>{totalSaved} kg CO₂</h3>
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '30px' },
  card: { background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' },
  bigNumber: { fontSize: '52px', fontWeight: '900', color: '#166534', margin: '20px 0' }
};

export default CarbonReports;