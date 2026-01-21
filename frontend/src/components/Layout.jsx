import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [sidebarOpen, setSidebarOpen] = useState(
    !isHome && window.innerWidth > 768,
  );

  // Track window width for responsive auto-hide
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

  // Function to handle sidebar link click
  const handleLinkClick = () => {
    // Auto-hide sidebar if screen width <= 768px (mobile/tablet)
    if (windowWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div
          className="bg-primary text-white position-fixed top-5 start-0 h-100 "
          style={{
            width: sidebarOpen ? "200px" : "0",
            transition: "width 0.35",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {sidebarOpen && (
            <ul className="nav flex-column mt-5">
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

        {/* Main Content */}
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
