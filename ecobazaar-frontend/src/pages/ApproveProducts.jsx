import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Package } from 'lucide-react';
import API from "../api/api";

function ApproveProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingProducts = async () => {
    try {
      const res = await API.get('/api/admin/pending-products');
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this product?")) return;
    try {
      await API.put(`/api/admin/products/${id}/approve`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) { alert("Failed to approve"); }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this product?")) return;
    try {
      await API.delete(`/api/admin/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) { alert("Failed to reject"); }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading pending products...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Approve Pending Products</h1>
      
      {products.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontSize: '18px' }}>
          No pending products to approve 🎉
        </p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Seller</th>
                <th>Carbon Impact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={styles.row}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Package size={20} color="#10b981" />
                    {p.name}
                  </td>
                  <td>{p.sellerName || p.seller || '—'}</td>
                  <td>{p.carbonImpact || p.carbon_impact || 0} kg CO₂</td>
                  <td>
                    <button onClick={() => handleApprove(p.id)} style={styles.approveBtn}>
                      <CheckCircle size={18} /> Approve
                    </button>
                    <button onClick={() => handleReject(p.id)} style={styles.rejectBtn}>
                      <XCircle size={18} /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '30px' },
  tableContainer: { background: 'white', borderRadius: '20px', padding: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  row: { borderBottom: '1px solid #f1f5f9' },
  approveBtn: { background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '9999px', marginRight: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' },
  rejectBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '9999px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }
};

export default ApproveProducts;