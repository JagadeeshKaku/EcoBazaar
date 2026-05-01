import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Corrected Path

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnHover, setBtnHover] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/auth/signup", { name, email, password, role: "USER" });
      
      toast.success("Account created successfully! ✨ Welcome.", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/") 
      });

    } catch (err) {
      toast.error("Signup failed. That email might already be in use! ❌");
    }
  };

  return (
    <div style={signupStyles.pageContainer}>
      <ToastContainer theme="colored" />
      <div style={{ ...signupStyles.orb, top: "15%", left: "25%", background: "#ff9a9e" }}></div>
      <div style={{ ...signupStyles.orb, bottom: "15%", right: "25%", background: "#a1c4fd" }}></div>
      <div style={{ ...signupStyles.orb, top: "45%", right: "5%", background: "#fbc2eb" }}></div>

      <form onSubmit={handleSignup} style={signupStyles.glassCard}>
        <div style={signupStyles.headerSection}>
          <h2 style={signupStyles.titleStyle}>✨ Create Account</h2>
          <p style={signupStyles.subtitleStyle}>Experience the magic of our platform</p>
        </div>

        <input 
          placeholder="Your Name" value={name} 
          onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField("")}
          onChange={(e) => setName(e.target.value)} 
          style={{ ...signupStyles.inputStyle, ...(focusedField === "name" ? signupStyles.inputFocus : {}) }} 
          required
        />

        <input 
          type="email" placeholder="Email Address" value={email} 
          onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField("")}
          onChange={(e) => setEmail(e.target.value)} 
          style={{ ...signupStyles.inputStyle, ...(focusedField === "email" ? signupStyles.inputFocus : {}) }} 
          required
        />

        <input 
          type="password" placeholder="Create Password" value={password} 
          onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField("")}
          onChange={(e) => setPassword(e.target.value)} 
          style={{ ...signupStyles.inputStyle, ...(focusedField === "password" ? signupStyles.inputFocus : {}) }} 
          required
        />

        <button 
          onMouseEnter={() => setBtnHover(true)} onMouseLeave={() => setBtnHover(false)}
          style={{ ...signupStyles.submitButton, ...(btnHover ? signupStyles.buttonHoverStyle : {}) }}
        >
          Sign Up Now
        </button>

        <p style={signupStyles.footerText}>
          Already have an account? <span onClick={() => navigate("/")} style={signupStyles.linkStyle}>Log In</span>
        </p>
      </form>
    </div>
  );
}

const signupStyles = {
  pageContainer: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", position: "relative", background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)", fontFamily: "'Poppins', sans-serif" },
  orb: { position: "absolute", width: "350px", height: "350px", borderRadius: "50%", filter: "blur(70px)", opacity: "0.4", zIndex: "0" },
  glassCard: { position: "relative", zIndex: "1", background: "rgba(255, 255, 255, 0.3)", backdropFilter: "blur(20px)", padding: "40px", borderRadius: "30px", width: "360px", boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)", border: "1px solid rgba(255, 255, 255, 0.5)", textAlign: "center" },
  headerSection: { marginBottom: "25px" },
  titleStyle: { fontSize: "28px", fontWeight: "800", background: "linear-gradient(to right, #fa709a 0%, #fee140 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0" },
  subtitleStyle: { color: "#777", fontSize: "13px", marginTop: "8px" },
  inputStyle: { width: "100%", padding: "14px", margin: "10px 0", borderRadius: "15px", border: "1px solid rgba(255, 255, 255, 0.8)", background: "rgba(255, 255, 255, 0.6)", fontSize: "14px", outline: "none", transition: "all 0.3s ease", boxSizing: "border-box", color: "#333" },
  inputFocus: { background: "#ffffff", transform: "translateY(-2px)", boxShadow: "0 8px 20px rgba(250, 112, 154, 0.2)", border: "1px solid #fa709a" },
  submitButton: { width: "100%", marginTop: "20px", padding: "14px", borderRadius: "15px", border: "none", background: "linear-gradient(90deg, #fa709a 0%, #fee140 100%)", color: "white", fontWeight: "bold", fontSize: "16px", cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 10px 20px rgba(250, 112, 154, 0.3)" },
  buttonHoverStyle: { transform: "scale(1.03)", filter: "brightness(1.05)", boxShadow: "0 15px 25px rgba(250, 112, 154, 0.4)" },
  footerText: { marginTop: "20px", fontSize: "13px", color: "#666" },
  linkStyle: { color: "#fa709a", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }
};

export default Signup;
