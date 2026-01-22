import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [sidebarOpen, setSidebarOpen] = useState(
    !isHome && window.innerWidth > 768,
  );

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setSidebarOpen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => {
    if (windowWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="d-flex flex-grow-1">
        {/* ================= SIDEBAR ================= */}
        <div
          className="bg-primary text-white position-fixed top-5 start-0 h-100"
          style={{
            width: sidebarOpen ? "200px" : "0",
            transition: "width 0.35s",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {sidebarOpen && (
            <ul className="nav flex-column mt-5">
              {/* 🔹 ADMIN & USER LINKS */}
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/admin"
                  onClick={handleLinkClick}
                >
                  Admin
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/user"
                  onClick={handleLinkClick}
                >
                  User
                </Link>
              </li>

              <hr className="text-white" />

              {/* EXISTING MENU */}
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/dashboard"
                  onClick={handleLinkClick}
                >
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/appointments"
                  onClick={handleLinkClick}
                >
                  Appointments
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/doctors"
                  onClick={handleLinkClick}
                >
                  Doctors
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/reports"
                  onClick={handleLinkClick}
                >
                  Reports
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/doctor-lab"
                  onClick={handleLinkClick}
                >
                  Doctor → Lab Tests
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/laboratory-panel"
                  onClick={handleLinkClick}
                >
                  Laboratory Panel
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/lab-results"
                  onClick={handleLinkClick}
                >
                  Lab Results
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div
          className="flex-grow-1"
          style={{
            marginLeft: sidebarOpen ? "220px" : "0",
            transition: "margin-left 0.3s",
            padding: "1rem",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
