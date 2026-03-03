import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      const role = res.data.user.role?.toLowerCase();
      // DYNAMIC ROLE REDIRECTION
      login(res.data.user, res.data.token);

      if (role === "super_admin") {
        navigate("/super-admin/dashboard");
      } else if (role === "hospital_admin") {
        navigate("/hospital-admin/dashboard");
      } else if (role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (role === "patient") {
        navigate("/patient/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f1128 0%, #1a1f37 50%, #0d1f3c 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo/Brand */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "18px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: "1rem", fontSize: "2rem",
          }}>🏥</div>
          <h1 style={{ color: "#fff", fontWeight: "700", fontSize: "1.6rem", margin: 0 }}>
            Hospital Management
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", marginTop: "0.4rem" }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "2rem",
          backdropFilter: "blur(20px)",
        }}>
          {error && (
            <div style={{
              background: "rgba(220,53,69,0.15)", border: "1px solid rgba(220,53,69,0.3)",
              borderRadius: "10px", padding: "0.75rem 1rem", marginBottom: "1.5rem",
              color: "#ff6b6b", fontSize: "0.875rem",
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{
                color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", fontWeight: "600",
                letterSpacing: "0.5px", textTransform: "uppercase", display: "block", marginBottom: "0.5rem"
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@hospital.com"
                style={{
                  width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff", fontSize: "0.95rem", outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(102,126,234,0.7)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
              />
            </div>

            <div style={{ marginBottom: "1.75rem" }}>
              <label style={{
                color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", fontWeight: "600",
                letterSpacing: "0.5px", textTransform: "uppercase", display: "block", marginBottom: "0.5rem"
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff", fontSize: "0.95rem", outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(102,126,234,0.7)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "0.85rem", borderRadius: "12px",
                background: loading ? "rgba(102,126,234,0.5)" : "linear-gradient(135deg, #667eea, #764ba2)",
                border: "none", color: "#fff", fontWeight: "700", fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s", letterSpacing: "0.5px",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem", color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
