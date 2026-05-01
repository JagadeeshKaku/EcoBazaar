import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnHover, setBtnHover] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      const rawRole = res.data.role || res.data.user?.role || "USER";
      const cleanRole = typeof rawRole === "string" 
        ? rawRole.replace("ROLE_", "").toUpperCase().trim() 
        : "USER";
      
      localStorage.setItem("role", cleanRole);

      toast.success("Login Successful! 🚀 Redirecting...", {
        onClose: () => {
          if (cleanRole === "ADMIN") navigate("/admin");
          else if (cleanRole === "SELLER") navigate("/seller");
          else navigate("/dashboard");
          window.location.reload();
        },
        autoClose: 1500
      });

    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Login Failed ❌ Check your email or password.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <ToastContainer position="top-right" theme="colored" pauseOnHover={false} />

      {/* Background Decorative Orbs */}
      <div style={{ ...styles.orb, top: "10%", left: "20%", background: "#6366f1" }}></div>
      <div style={{ ...styles.orb, bottom: "10%", right: "20%", background: "#f43f5e" }}></div>
      <div style={{ ...styles.orb, top: "40%", right: "10%", background: "#a855f7" }}></div>

      <form onSubmit={handleLogin} style={styles.glassCard}>
        <div style={styles.headerSection}>
          <h2 style={styles.titleStyle}>🔑 Welcome Back</h2>
          <p style={styles.subtitleStyle}>Sign in to your Eco Dashboard</p>
        </div>

        <input 
          type="email"
          placeholder="Email Address" 
          value={email} 
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField("")}
          onChange={(e) => setEmail(e.target.value)} 
          style={{ ...styles.inputStyle, ...(focusedField === "email" ? styles.inputFocus : {}) }} 
          required
        />

        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField("")}
          onChange={(e) => setPassword(e.target.value)} 
          style={{ ...styles.inputStyle, ...(focusedField === "password" ? styles.inputFocus : {}) }} 
          required
        />

        {/* Forgot Password Link - NEW */}
        <div style={styles.forgotContainer}>
          <span 
            onClick={() => navigate("/forgot-password")} 
            style={styles.forgotLink}
          >
            Forgot Password?
          </span>
        </div>

        <button 
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{ 
            ...styles.submitButton, 
            ...(btnHover ? styles.buttonHoverStyle : {}) 
          }}
        >
          Login
        </button>

        <p style={styles.footerText}>
          New user? <span onClick={() => navigate("/signup")} style={styles.linkStyle}>Create Account</span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  pageContainer: {
    height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
    overflow: "hidden", position: "relative", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    fontFamily: "'Inter', sans-serif"
  },
  orb: { position: "absolute", width: "350px", height: "350px", borderRadius: "50%", filter: "blur(80px)", opacity: "0.2", zIndex: "0" },
  glassCard: {
    position: "relative", zIndex: "1", background: "rgba(255, 255, 255, 0.4)",
    backdropFilter: "blur(20px)", padding: "45px 40px", borderRadius: "30px",
    width: "360px", boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)", border: "1px solid rgba(255, 255, 255, 0.6)", textAlign: "center"
  },
  headerSection: { marginBottom: "25px" },
  titleStyle: { fontSize: "28px", fontWeight: "800", color: "#059669", margin: "0" },
  subtitleStyle: { color: "#64748b", fontSize: "13px", marginTop: "8px" },
  inputStyle: {
    width: "100%", padding: "14px", margin: "10px 0", borderRadius: "15px", border: "1px solid rgba(0, 0, 0, 0.05)",
    background: "rgba(255, 255, 255, 0.7)", fontSize: "14px", outline: "none", transition: "0.3s", boxSizing: "border-box", color: "#333"
  },
  inputFocus: { background: "#ffffff", transform: "translateY(-2px)", boxShadow: "0 8px 20px rgba(5, 150, 105, 0.15)", border: "1px solid #059669" },

  /* Forgot Password Link */
  forgotContainer: {
    textAlign: "right",
    marginTop: "8px",
    marginBottom: "15px"
  },
  forgotLink: {
    color: "#059669",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    transition: "0.3s"
  },

  submitButton: {
    width: "100%", marginTop: "10px", padding: "14px", borderRadius: "15px", border: "none",
    background: "linear-gradient(45deg, #059669, #10b981)", color: "white", fontWeight: "bold",
    fontSize: "16px", cursor: "pointer", transition: "all 0.4s ease", boxShadow: "0 10px 20px rgba(5, 150, 105, 0.3)"
  },
  buttonHoverStyle: { transform: "translateY(-4px)", boxShadow: "0 15px 25px rgba(5, 150, 105, 0.4)" },
  footerText: { marginTop: "25px", fontSize: "13px", color: "#666" },
  linkStyle: { color: "#059669", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }
};

export default Login;