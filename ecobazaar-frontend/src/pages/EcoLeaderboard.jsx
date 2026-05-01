import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import API from "../api/api";          // ← Corrected

function EcoLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get('/api/admin/eco-leaderboard');
      setLeaderboard(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading leaderboard...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🏆 Eco Leaderboard</h1>
      <div style={styles.card}>
        {leaderboard.map((user, index) => (
          <div key={user.id || index} style={styles.leaderRow}>
            <div style={styles.rank}>
              {index === 0 ? <Trophy size={28} color="#f59e0b" /> : index + 1}
            </div>
            <div style={styles.name}>{user.name}</div>
            <div style={styles.role}>{user.role}</div>
            <div style={styles.score}>{user.ecoScore || user.score} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '30px' },
  card: { background: 'white', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' },
  leaderRow: { display: 'flex', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #f1f5f9', gap: '20px' },
  rank: { width: '50px', fontSize: '24px', fontWeight: '900', color: '#166534' },
  name: { flex: 1, fontWeight: '700', fontSize: '18px' },
  role: { color: '#64748b', fontSize: '14px' },
  score: { fontSize: '20px', fontWeight: '800', color: '#10b981' }
};

export default EcoLeaderboard;