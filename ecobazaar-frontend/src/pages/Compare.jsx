import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

function Compare() {

  const { id1, id2 } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get(`/api/products/compare?id1=${id1}&id2=${id2}`)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, [id1, id2]);

  if (!data) return <h2 style={{textAlign:"center"}}>Loading...</h2>;

  const { product1: p1, product2: p2, betterProduct } = data;

  return (
    <div style={{ background:"#f5f7fa", minHeight:"100vh" }}>
      <Navbar />

      <h2 style={{ textAlign:"center", marginTop:"20px" }}>
        🔥 Compare Products
      </h2>

      <div style={styles.container}>

        {/* PRODUCT 1 */}
        <div style={{
          ...styles.card,
          border: betterProduct === p1.name ? "3px solid green" : "none"
        }}>
          <img src={p1.imageUrl} style={styles.img} />
          <h3>{p1.name}</h3>
          <p>₹{p1.price}</p>

          <div style={styles.metric}>
            🍃 EcoScore: <b>{p1.ecoScore}</b>
          </div>

          <div style={styles.metric}>
            🌍 Carbon: <b>{p1.carbonImpact} kg</b>
          </div>

          {betterProduct === p1.name && <span style={styles.badge}>BEST 🌿</span>}
        </div>

        {/* VS */}
        <div style={styles.vs}>VS</div>

        {/* PRODUCT 2 */}
        <div style={{
          ...styles.card,
          border: betterProduct === p2.name ? "3px solid green" : "none"
        }}>
          <img src={p2.imageUrl} style={styles.img} />
          <h3>{p2.name}</h3>
          <p>₹{p2.price}</p>

          <div style={styles.metric}>
            🍃 EcoScore: <b>{p2.ecoScore}</b>
          </div>

          <div style={styles.metric}>
            🌍 Carbon: <b>{p2.carbonImpact} kg</b>
          </div>

          {betterProduct === p2.name && <span style={styles.badge}>BEST 🌿</span>}
        </div>

      </div>

      <h2 style={{ textAlign:"center", color:"green" }}>
        Winner: {betterProduct} 🏆
      </h2>

    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "40px",
    marginTop: "40px"
  },
  card: {
    width: "260px",
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
  },
  img: {
    width: "100%",
    height: "180px",
    objectFit: "contain"
  },
  metric: {
    marginTop: "10px"
  },
  badge: {
    display: "inline-block",
    marginTop: "10px",
    background: "green",
    color: "white",
    padding: "5px 10px",
    borderRadius: "10px"
  },
  vs: {
    fontSize: "28px",
    fontWeight: "bold"
  }
};

export default Compare;