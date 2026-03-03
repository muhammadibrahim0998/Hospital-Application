import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    gender: "Male",
    age: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Try again.";
      setError(msg);
      console.error("Registration Error:", err.response?.data || err.message);
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
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "18px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: "1rem", fontSize: "2rem"
          }}>🏥</div>
          <h1 style={{ color: "#fff", fontWeight: "700", fontSize: "1.6rem", margin: 0 }}>Create Account</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", marginTop: "0.4rem" }}>
            Join our platform as a patient
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "2rem",
          backdropFilter: "blur(20px)"
        }}>
          {error && (
            <div style={{
              background: "rgba(220,53,69,0.15)", border: "1px solid rgba(220,53,69,0.3)",
              borderRadius: "10px", padding: "0.75rem 1rem", marginBottom: "1.5rem",
              color: "#ff6b6b", fontSize: "0.875rem"
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.1rem" }}>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ex. John Doe"
                style={{
                  width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff", fontSize: "0.95rem", outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "1.1rem" }}>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@email.com"
                style={{
                  width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff", fontSize: "0.95rem", outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "1.1rem" }}>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                Create Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff", fontSize: "0.95rem", outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{
                    width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", cursor: "pointer"
                  }}
                >
                  <option value="Male" style={{ background: "#1a1f37" }}>Male</option>
                  <option value="Female" style={{ background: "#1a1f37" }}>Female</option>
                  <option value="Other" style={{ background: "#1a1f37" }}>Other</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  placeholder="25"
                  style={{
                    width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff", fontSize: "0.95rem", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.75rem" }}>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                Contact Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="03XXXXXXXXX"
                style={{
                  width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff", fontSize: "0.95rem", outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "0.85rem", borderRadius: "12px",
                background: loading ? "rgba(102,126,234,0.5)" : "linear-gradient(135deg, #667eea, #764ba2)",
                border: "none", color: "#fff", fontWeight: "700", fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Creating Account…" : "Register Now"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem", color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
