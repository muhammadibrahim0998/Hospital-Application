import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const isLoggedIn = !!sessionStorage.getItem("token");


  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  // Logo OR Home click → Home page
  const goHome = () => {
    navigate("/");
    setMenuOpen(false);
    setSidebarOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark shadow position-fixed w-100"
      style={{ zIndex: 1100 }}
    >
      <div className="container d-flex align-items-center justify-content-between">
        {/* Left side */}
        <div className="d-flex align-items-center">
          {/* Sidebar toggle */}
          <button
            className="btn btn-outline-light me-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            &#x22EE;
          </button>

          {/* Logo */}
          <span
            className="navbar-brand fw-bold cursor-pointer"
            onClick={goHome}
          >
            🏥 CityCare Hospital
          </span>
        </div>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            {/* ✅ Home link */}
            <li className="nav-item">
              <span className="nav-link cursor-pointer" onClick={goHome}>
                Home
              </span>
            </li>

            {/* ✅ Contact link */}
            <li className="nav-item">
              <Link
                to="/contact"
                className="nav-link"
                onClick={() => {
                  setMenuOpen(false);
                  setSidebarOpen(false);
                  setDropdownOpen(false);
                }}
              >
                Contact
              </Link>
            </li>
            {/* ✅about link */}
            <li className="nav-item">
              <Link
                to="/about"
                className="nav-link"
                onClick={() => {
                  setMenuOpen(false);
                  setSidebarOpen(false);
                  setDropdownOpen(false);
                }}
              >
                About
              </Link>
            </li>

            {/* Account dropdown */}
            <li className="nav-item dropdown">
              <button
                className="btn btn-primary dropdown-toggle ms-2"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {isLoggedIn ? "My Account" : "Account"}
              </button>

              <ul
                className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""
                  }`}
              >
                {!isLoggedIn && (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/login">Login</Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/register">Register</Link>
                    </li>
                  </>
                )}

                {isLoggedIn && (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/register">
                        Register
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={logout}>
                        Logout
                      </button>
                    </li>
                  </>
                )}

              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
