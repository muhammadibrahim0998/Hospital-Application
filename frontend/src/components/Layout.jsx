import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [sidebarOpen, setSidebarOpen] = useState(
    !isHome && window.innerWidth > 768
  );

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div
          className="bg-primary text-white position-fixed top-5 start-0 h-100 p-3"
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
                <Link className="nav-link text-white" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/appointments">
                  Appointments
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/doctors">
                  Doctors
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/reports">
                  Reports
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/doctor-lab">
                  Doctor → Lab Tests
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/laboratory-panel">
                  Laboratory Panel
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/lab-results">
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
