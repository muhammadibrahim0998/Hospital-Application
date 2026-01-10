// Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // ✅ Desktop: sidebar visible, Mobile: hidden
  const [sidebarOpen, setSidebarOpen] = useState(
    !isHome && window.innerWidth > 768
  );

  // Handle window resize to auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* ===== NAVBAR ===== */}
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showSidebarToggle={true}
      />

      <div className="d-flex flex-grow-1">
        {/* ===== SIDEBAR ===== */}
        <div
          className={`bg-primary text-white position-fixed top-5 start-0 h-100 p-3`}
          style={{
            width: sidebarOpen ? "220px" : "0",
            transition: "width 0.3s",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {sidebarOpen && (
            <ul className="nav flex-column mt-5">
              <li className="nav-item">
                <a className="nav-link text-white" href="/dashboard">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/appointments">
                  Appointments
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/doctors">
                  Doctors
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/reports">
                  Reports
                </a>
              </li>
            </ul>
          )}
        </div>

        {/* ===== MAIN CONTENT ===== */}
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
