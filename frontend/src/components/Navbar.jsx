import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BsList, BsSearch } from "react-icons/bs";
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
      <div className="navbar-inner d-flex justify-content-between w-100">

        {/* ── LEFT: Toggle + Desktop Logo ── */}
        <div className="navbar-left d-flex align-items-center">
          <button
            className="navbar-toggle"
            style={{ background: currentTheme.box, borderColor: currentTheme.border }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <BsList size={20} color="#fff" />
          </button>

          {/* Logo visible on desktop (hidden on mobile) */}
          <div className="navbar-brand d-none d-sm-flex ms-2" onClick={goHome}>
            <div className="navbar-brand-icon">🏥</div>
            <span className="navbar-brand-name">CityCare Hospital</span>
          </div>
        </div>

        {/* ── CENTER: Search Bar ── */}
        {/* Added d-flex to guarantee search bar shows in the center on mobile */}
        <div className="navbar-center d-flex flex-grow-1 px-2 px-sm-4">
          <div
            className="navbar-search w-100"
            style={{ borderColor: currentTheme.border, maxWidth: "400px", margin: "0 auto" }}
          >
            <input
              type="text"
              placeholder="Search Doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyPress}
              className="navbar-search-input text-truncate"
            />
            <button
              onClick={handleSearch}
              className="navbar-search-btn flex-shrink-0"
              style={{ background: currentTheme.box }}
            >
              <BsSearch size={14} color="#fff" />
            </button>
          </div>
        </div>

        {/* ── RIGHT: Mobile Logo + User Account ── */}
        <div className="navbar-right d-flex align-items-center">

          {/* Mobile Logo: Shown on the right side only on mobile screens */}
          <div className="navbar-brand d-flex d-sm-none me-2" onClick={goHome} style={{ cursor: "pointer" }}>
            <div className="navbar-brand-icon" style={{ width: "28px", height: "28px", fontSize: "14px" }}>🏥</div>
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