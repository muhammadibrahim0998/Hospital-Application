import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BsList, BsBell, BsSearch } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";
import "../css/Navbar.css";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const isLoggedIn = !!user;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

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
      className="navbar-custom"
      style={{
        background: currentTheme.navBg,
        borderBottom: `2px solid ${currentTheme.border}`,
      }}
    >
      <div className="navbar-inner">

        {/* ── LEFT: Toggle + Logo ── */}
        <div className="navbar-left">
          <button
            className="navbar-toggle"
            style={{ background: currentTheme.box, borderColor: currentTheme.border }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <BsList size={20} color="#fff" />
          </button>

          <div className="navbar-brand" onClick={goHome}>
            <div className="navbar-brand-icon">🏥</div>
            <span className="navbar-brand-name">CityCare Hospital</span>
          </div>
        </div>

        {/* ── CENTER: Search Bar (hidden on mobile) ── */}
        <div className="navbar-center">
          <div
            className="navbar-search"
            style={{ borderColor: currentTheme.border }}
          >
            <input
              type="text"
              placeholder="Search Doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyPress}
              className="navbar-search-input"
            />
            <button
              onClick={handleSearch}
              className="navbar-search-btn"
              style={{ background: currentTheme.box }}
            >
              <BsSearch size={14} color="#fff" />
            </button>
          </div>
        </div>

        {/* ── RIGHT: Bell + User ── */}
        <div className="navbar-right">

          {/* Bell */}
          <div
            className="navbar-icon-btn"
            style={{ background: currentTheme.box, borderColor: currentTheme.border }}
          >
            <BsBell size={17} color="#fff" />
          </div>

          {/* User avatar + dropdown */}
          <div className="navbar-user-wrap">
            <div
              className="navbar-avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title={user?.name || "Account"}
            >
              {isLoggedIn ? user?.name?.charAt(0)?.toUpperCase() || "U" : "U"}
            </div>

            {dropdownOpen && (
              <div className="navbar-dropdown">
                <div className="navbar-dropdown-info">
                  <small className="navbar-dropdown-label">Signed in as</small>
                  <div className="navbar-dropdown-name">{user?.name || "User"}</div>
                  <div className="navbar-dropdown-role">
                    {user?.role?.replace("_", " ")}
                  </div>
                </div>
                <button className="navbar-dropdown-logout" onClick={handleLogout}>
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