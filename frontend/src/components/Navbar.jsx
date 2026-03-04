import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsList, BsBell, BsSearch } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const isLoggedIn = !!user;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState("black");
  const [search, setSearch] = useState("");

  // ===== THEMES =====
  const themes = {
    blue: {
      navBg: "#0d6efd",
      text: "#ffffff",
      box: "#0b5ed7",
      border: "#084298",
      searchBg: "#ffffff",
      searchText: "#000",
    },
    white: {
      navBg: "#ffffff",
      text: "#000000",
      box: "#f1f1f1",
      border: "#ddd",
      searchBg: "#ffffff",
      searchText: "#000",
    },
    black: {
      navBg: "#000000",
      text: "#ffffff",
      box: "#111111",
      border: "#222",
      searchBg: "#ffffff",
      searchText: "#000",
    },
    dark: {
      navBg: "#ffffff",
      text: "#000000",
      box: "#ffffff",
      border: "#000000",
      searchBg: "#ffffff",
      searchText: "#000",
    },
  };

  const currentTheme = themes[theme];

  // ===== SEARCH FUNCTION =====
  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/doctors?search=${search}`);
    setSearch("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const goHome = () => {
    navigate("/");
    setDropdownOpen(false);
  };

  return (
    <nav
      className="navbar navbar-expand-lg position-fixed w-100 shadow-sm"
      style={{
        zIndex: 1100,
        height: "60px",
        background: currentTheme.navBg,
        borderBottom: `2px solid ${currentTheme.border}`,
        transition: "0.3s",
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between px-4">
        {/* LEFT */}
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: currentTheme.box,
              color: currentTheme.text,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: "8px",
            }}
          >
            <BsList size={20} />
          </button>

          <div
            className="d-flex align-items-center gap-2"
            style={{ cursor: "pointer", color: currentTheme.text }}
            onClick={goHome}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                background: "#00c6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "#000",
              }}
            >
              🏥
            </div>
            <span className="fw-bold">CityCare Hospital</span>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="flex-grow-1 d-flex justify-content-center">
          <div
            className="d-flex align-items-center"
            style={{
              maxWidth: "420px",
              width: "100%",
              border: `1px solid ${currentTheme.border}`,
              borderRadius: "20px",
              overflow: "hidden",
              background: currentTheme.searchBg,
            }}
          >
            <input
              type="text"
              placeholder="Search Doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                flex: 1,
                border: "none",
                padding: "6px 15px",
                outline: "none",
                background: "transparent",
                color: currentTheme.searchText,
              }}
            />

            <button
              onClick={handleSearch}
              style={{
                background: currentTheme.box,
                border: "none",
                padding: "6px 12px",
                cursor: "pointer",
                color: currentTheme.text,
              }}
            >
              <BsSearch />
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="d-flex align-items-center gap-3">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="form-select form-select-sm"
            style={{
              width: "120px",
              borderRadius: "20px",
              background: currentTheme.box,
              color: currentTheme.text,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            <option value="blue">Blue</option>
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="dark">Dark</option>
          </select>

          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: currentTheme.box,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: currentTheme.text,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            <BsBell size={18} />
          </div>

          <div className="position-relative">
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#00c6ff",
                color: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {isLoggedIn ? user?.name?.charAt(0)?.toUpperCase() || "U" : "U"}
            </div>

            {dropdownOpen && (
              <div
                className="position-absolute end-0 mt-2 shadow"
                style={{
                  width: "200px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: currentTheme.box,
                  color: currentTheme.text,
                  border: `1px solid ${currentTheme.border}`,
                }}
              >
                <div className="px-3 py-2 border-bottom">
                  <small>Signed in as</small>
                  <div className="fw-bold small">{user?.name || "User"}</div>
                  <div className="text-muted small text-capitalize">{user?.role?.replace('_', ' ')}</div>
                </div>

                <Link
                  className="dropdown-item py-2"
                  to="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>

                <button
                  className="dropdown-item py-2 text-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
