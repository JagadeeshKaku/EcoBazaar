import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import API from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/api/products/${id}`);
      const data = res.data.data || res.data;
      setProduct(data);

      if (data?.ecoScore) {
        const recRes = await API.get(`/api/products/recommend/${data.ecoScore}`);
        setRecommendations(recRes.data || []);
      }
    } catch (err) {
      toast.error("Failed to load product ❌");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [fetchProduct]);

  const addToCart = async () => {
    if (!product) return;
    try {
      setIsAdding(true);
      await API.post(`/api/cart/add/${product.id}`);
      toast.success("Added to your green collection! 🌿");
    } catch (err) {
      toast.error("Failed to add to cart ❌");
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) return <div style={styles.loader}>🌱 Loading your green choice...</div>;
  if (!product) return <div style={styles.loader}>Product not found</div>;

  const carbonData = {
    labels: ['Manufacturing', 'Transport', 'Packaging'],
    datasets: [{
      label: 'kg CO₂',
      data: [
        product.manufacturingImpact || 0,
        product.transportImpact || 0,
        product.packagingImpact || 0
      ],
      backgroundColor: ['#10b981', '#34d399', '#a3e4c8'],
      borderRadius: 8,
    }]
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="bottom-right" />

      <div style={styles.mainContainer}>
        
        {/* LEFT: IMAGE + NEW ECO BENEFITS SECTION */}
        <div style={styles.imageSection}>
          <div style={styles.imageWrapper}>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              style={styles.mainImage} 
            />
          </div>
          
          {/* Badge */}
          <div style={product.ecoCertified ? styles.ecoBadge : styles.stdBadge}>
            {product.ecoCertified ? "🍃 Verified Eco Choice" : "Standard Product"}
          </div>

          {/* NEW: Eco Benefits - Below Image */}
          <div style={styles.benefitsSection}>
            <h4 style={styles.benefitsTitle}>Why This Product is Better 🌱</h4>
            <div style={styles.benefitsGrid}>
              <div style={styles.benefitItem}>
                <span style={styles.benefitIcon}>♻️</span>
                <span>Recyclable</span>
              </div>
              <div style={styles.benefitItem}>
                <span style={styles.benefitIcon}>🌍</span>
                <span>Low Carbon</span>
              </div>
              <div style={styles.benefitItem}>
                <span style={styles.benefitIcon}>🧴</span>
                <span>Non-Toxic</span>
              </div>
              <div style={styles.benefitItem}>
                <span style={styles.benefitIcon}>🌿</span>
                <span>Biodegradable</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div style={styles.detailsSection}>
          <h1 style={styles.title}>{product.name}</h1>
          <div style={styles.price}>₹{product.price}</div>

          <p style={styles.description}>{product.details}</p>

          <div style={styles.scoreGrid}>
            <div style={styles.scoreCard}>
              <span style={styles.scoreLabel}>Eco Score</span>
              <span style={styles.scoreValue}>{product.ecoScore || 0}/100</span>
            </div>
            <div style={styles.scoreCard}>
              <span style={styles.scoreLabel}>Carbon Impact</span>
              <span style={{ ...styles.scoreValue, color: '#10b981' }}>
                {product.carbonImpact || 0} kg CO₂
              </span>
            </div>
          </div>

          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>🌍 Carbon Breakdown</h4>
            <Bar data={carbonData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>

          <button
            onClick={addToCart}
            disabled={isAdding}
            style={isAdding ? { ...styles.addButton, opacity: 0.7 } : styles.addButton}
          >
            {isAdding ? "Adding to Cart..." : "Add to Cart — 🛒"}
          </button>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div style={styles.recommendSection}>
          <h2 style={styles.sectionTitle}>🌿 Better Alternatives for the Planet</h2>
          <div style={styles.recommendGrid}>
            {recommendations.map((item) => (
              <div
                key={item.id}
                style={styles.recommendCard}
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img src={item.imageUrl} alt={item.name} style={styles.recommendImage} />
                <h4 style={styles.recommendName}>{item.name}</h4>
                <div style={styles.recommendFooter}>
                  <span style={styles.recommendPrice}>₹{item.price}</span>
                  <span style={styles.recommendScore}>🍃 {item.ecoScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { 
    background: '#f8fafc', 
    minHeight: '100vh', 
    padding: '40px 8%', 
    fontFamily: "'Inter', sans-serif" 
  },
  mainContainer: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1.35fr', 
    gap: '70px', 
    maxWidth: '1280px', 
    margin: '0 auto',
    background: '#fff',
    padding: '50px',
    borderRadius: '32px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.07)'
  },
  imageSection: { position: 'relative' },
  imageWrapper: {
    background: '#fff',
    borderRadius: '28px',
    padding: '30px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
    overflow: 'hidden'
  },
  mainImage: { 
    width: '100%', 
    height: '520px', 
    objectFit: 'contain', 
    borderRadius: '20px',
    transition: 'transform 0.4s ease'
  },
  ecoBadge: { 
    position: 'absolute', top: '35px', left: '35px', 
    background: '#dcfce7', color: '#166534', 
    padding: '10px 22px', borderRadius: '9999px', 
    fontWeight: '700', fontSize: '15px',
    boxShadow: '0 6px 15px rgba(16,185,129,0.3)'
  },
  stdBadge: { 
    position: 'absolute', top: '35px', left: '35px', 
    background: '#f1f5f9', color: '#475569', 
    padding: '10px 22px', borderRadius: '9999px', 
    fontWeight: '600', fontSize: '15px' 
  },

  /* === NEW ECO BENEFITS SECTION BELOW IMAGE === */
  benefitsSection: {
    marginTop: '30px',
    background: '#f8fafc',
    padding: '20px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0'
  },
  benefitsTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#166534',
    marginBottom: '15px',
    textAlign: 'center'
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px'
  },
  benefitItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155'
  },
  benefitIcon: {
    fontSize: '24px'
  },

  detailsSection: { flex: 1 },
  title: { fontSize: '42px', fontWeight: '900', marginBottom: '8px' },
  price: { fontSize: '32px', fontWeight: '700', color: '#059669', marginBottom: '20px' },
  description: { lineHeight: '1.7', color: '#475569', fontSize: '17px', marginBottom: '30px' },
  scoreGrid: { display: 'flex', gap: '20px', marginBottom: '30px' },
  scoreCard: { 
    flex: 1, background: '#f8fafc', padding: '20px', borderRadius: '20px', 
    border: '1px solid #e2e8f0', textAlign: 'center' 
  },
  scoreLabel: { fontSize: '13px', color: '#94a3b8', fontWeight: '600' },
  scoreValue: { fontSize: '26px', fontWeight: '800', display: 'block', marginTop: '6px' },
  chartCard: { background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', marginBottom: '30px' },
  chartTitle: { marginBottom: '15px', color: '#166534', fontWeight: '700' },
  addButton: { 
    width: '100%', padding: '18px', background: 'linear-gradient(90deg, #059669, #10b981)', 
    color: 'white', border: 'none', borderRadius: '9999px', fontSize: '18px', 
    fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 20px rgba(5,150,105,0.3)' 
  },
  recommendSection: { marginTop: '80px', maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto' },
  sectionTitle: { fontSize: '26px', marginBottom: '25px', textAlign: 'center' },
  recommendGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' },
  recommendCard: { 
    background: '#fff', borderRadius: '20px', overflow: 'hidden', 
    boxShadow: '0 8px 20px rgba(0,0,0,0.06)', cursor: 'pointer', transition: '0.3s' 
  },
  recommendImage: { width: '100%', height: '200px', objectFit: 'contain', background: '#f8fafc' },
  recommendName: { padding: '15px 15px 5px', fontSize: '18px', fontWeight: '700' },
  recommendFooter: { padding: '0 15px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  recommendPrice: { fontSize: '20px', fontWeight: '700', color: '#059669' },
  recommendScore: { background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '9999px', fontSize: '14px', fontWeight: '700' },
  loader: { textAlign: 'center', marginTop: '120px', fontSize: '1.3rem', color: '#059669' }
};

export default ProductDetails;