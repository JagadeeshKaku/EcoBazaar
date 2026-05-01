import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);

    try {
      await API.post("/api/auth/forgot-password", { email });

      toast.success("✅ Reset link sent to your email!", {
        autoClose: 2500,
        onClose: () => navigate("/login")
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <ToastContainer position="top-right" theme="colored" pauseOnHover={false} />

      {/* Background Orbs */}
      <div style={{ ...styles.orb, top: "10%", left: "20%", background: "#6366f1" }}></div>
      <div style={{ ...styles.orb, bottom: "10%", right: "20%", background: "#f43f5e" }}></div>
      <div style={{ ...styles.orb, top: "40%", right: "10%", background: "#a855f7" }}></div>

      <form onSubmit={handleSubmit} style={styles.glassCard}>
        <div style={styles.headerSection}>
          <h2 style={styles.titleStyle}>🔑 Forgot Password?</h2>
          <p style={styles.subtitleStyle}>
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField("")}
          onChange={(e) => setEmail(e.target.value)}
          style={{ ...styles.inputStyle, ...(focusedField === "email" ? styles.inputFocus : {}) }}
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.submitButton,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Sending Reset Link..." : "Send Reset Link"}
        </button>

        <p style={styles.footerText}>
          Remember your password?{" "}
          <span onClick={() => navigate("/login")} style={styles.linkStyle}>
            Back to Login
          </span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  pageContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    fontFamily: "'Inter', sans-serif"
  },
  orb: {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: "0.2",
    zIndex: "0"
  },
  glassCard: {
    position: "relative",
    zIndex: "1",
    background: "rgba(255, 255, 255, 0.4)",
    backdropFilter: "blur(20px)",
    padding: "45px 40px",
    borderRadius: "30px",
    width: "380px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    textAlign: "center"
  },
  headerSection: { marginBottom: "30px" },
  titleStyle: { fontSize: "28px", fontWeight: "800", color: "#059669", margin: "0" },
  subtitleStyle: { color: "#64748b", fontSize: "14px", marginTop: "8px", lineHeight: "1.4" },
  inputStyle: {
    width: "100%",
    padding: "14px",
    margin: "10px 0",
    borderRadius: "15px",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    background: "rgba(255, 255, 255, 0.7)",
    fontSize: "14px",
    outline: "none",
    transition: "0.3s",
    boxSizing: "border-box",
    color: "#333"
  },
  inputFocus: {
    background: "#ffffff",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(5, 150, 105, 0.15)",
    border: "1px solid #059669"
  },
  submitButton: {
    width: "100%",
    marginTop: "20px",
    padding: "14px",
    borderRadius: "15px",
    border: "none",
    background: "linear-gradient(45deg, #059669, #10b981)",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.4s ease",
    boxShadow: "0 10px 20px rgba(5, 150, 105, 0.3)"
  },
  footerText: { marginTop: "25px", fontSize: "13px", color: "#666" },
  linkStyle: { color: "#059669", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }
};

export default ForgotPassword;