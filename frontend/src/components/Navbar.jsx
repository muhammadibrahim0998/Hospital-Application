import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BsList, BsBell, BsSearch, BsX } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";
import "../css/Navbar.css";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const isLoggedIn = !!user;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const currentTheme = {
    navBg: "#0d6efd",
    text: "#ffffff",
    box: "#0b5ed7",
    border: "#084298",
    searchBg: "#ffffff",
    searchText: "#000",
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/doctors?search=${search}`);
    setSearch("");
    setSearchOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
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
      className="navbar navbar-expand-lg position-fixed w-100 shadow-sm navbar-custom"
      style={{
        background: currentTheme.navBg,
        borderBottom: `2px solid ${currentTheme.border}`,
      }}
    >
      <div
        className="container-fluid d-flex align-items-center justify-content-between px-3 px-md-4"
        style={{ gap: "8px" }}
      >

        {/* ── LEFT: Logo only ── */}
        <div
          className="navbar-logo"
          style={{ color: currentTheme.text, flexShrink: 0 }}
          onClick={goHome}
        >
          <div className="navbar-logo-icon">🏥</div>
          <span className="fw-bold navbar-logo-text">CityCare Hospital</span>
        </div>

        {/* ── CENTER: Animated Search Bar ── */}
        <div className={`navbar-search-wrapper ${searchOpen ? "search-expanded" : ""}`}>
          <div
            className="navbar-search-container"
            style={{
              border: `2px solid ${currentTheme.border}`,
              background: currentTheme.searchBg,
            }}
          >
            <input
              type="text"
              placeholder="Search Doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyPress}
              className="navbar-search-input"
              style={{ color: currentTheme.searchText }}
              autoFocus={searchOpen}
            />
            <button
              onClick={handleSearch}
              className="navbar-search-btn"
              style={{ background: currentTheme.box, color: currentTheme.text }}
            >
              <BsSearch size={14} />
            </button>
          </div>
        </div>

        {/* ── RIGHT: Buttons ── */}
        <div className="d-flex align-items-center" style={{ gap: "8px", flexShrink: 0 }}>

          {/* Search toggle */}
          <button
            className="navbar-action-btn"
            style={{ background: currentTheme.box, color: currentTheme.text, borderColor: currentTheme.border }}
            onClick={() => setSearchOpen(!searchOpen)}
            title="Search"
          >
            {searchOpen ? <BsX size={18} /> : <BsSearch size={16} />}
          </button>

          {/* Notification bell */}
          <div
            className="navbar-action-btn navbar-bell"
            style={{ background: currentTheme.box, color: currentTheme.text, borderColor: currentTheme.border }}
          >
            <BsBell size={16} />
          </div>

          {/* Account dropdown */}
          <div className="position-relative">
            <button
              className="navbar-action-btn navbar-account-btn"
              style={{ background: "#00c6ff", color: "#000", border: "2px solid rgba(0,0,0,0.1)" }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title="Account"
            >
              <span style={{ fontWeight: 800, fontSize: "14px" }}>
                {isLoggedIn ? user?.name?.charAt(0)?.toUpperCase() || "U" : "U"}
              </span>
            </button>

            {dropdownOpen && (
              <div
                className="position-absolute end-0 mt-2 shadow navbar-dropdown"
                style={{
                  background: currentTheme.box,
                  color: currentTheme.text,
                  borderColor: currentTheme.border,
                }}
              >
                <div
                  className="navbar-dropdown-header"
                  style={{ borderBottomColor: currentTheme.border }}
                >
                  <small>Signed in as</small>
                  <div className="fw-bold small">{user?.name || "User"}</div>
                  <div className="text-muted small text-capitalize">
                    {user?.role?.replace("_", " ")}
                  </div>
                </div>
                <button className="navbar-dropdown-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Sidebar toggle with user initial — opens/closes sidebar */}
          <button
            className="btn navbar-toggle-btn"
            style={{
              background: currentTheme.box,
              color: currentTheme.text,
              borderColor: currentTheme.border,
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Menu"
          >
            <BsList size={20} />
            <span className="navbar-toggle-initial">
              {isLoggedIn ? user?.name?.charAt(0)?.toUpperCase() || "M" : "M"}.
            </span>
          </button>

        </div>
      </div>
    </nav>
  );
}