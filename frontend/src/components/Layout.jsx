
import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

// Icons
import {
  BsSpeedometer2,
  BsCalendarCheck,
  BsPeople,
  BsFileEarmarkText,
  BsBuilding,
  BsPersonBadge,
  BsBoxArrowRight,
  BsHouseDoor,
  BsInfoCircle,
  BsTelephone,
} from "react-icons/bs";
import { FaFlask } from "react-icons/fa";

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
    if (windowWidth <= 768) setSidebarOpen(false);
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role?.toLowerCase();
  const userName = user.name || "User";

  // Check if current path matches
  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    padding: "10px 18px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    color: isActive(path) ? "#fff" : "rgba(255,255,255,0.7)",
    background: isActive(path) ? "rgba(255,255,255,0.15)" : "transparent",
    transition: "all 0.2s",
    fontSize: "0.9rem",
    fontWeight: isActive(path) ? "600" : "400",
  });

  const iconStyle = {
    fontSize: "1.1rem",
    flexShrink: 0,
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="d-flex flex-grow-1" style={{ paddingTop: "56px" }}>
        {/* Sidebar */}
        <div
          style={{
            width: sidebarOpen ? "250px" : "0",
            minWidth: sidebarOpen ? "250px" : "0",
            background: "linear-gradient(180deg, #1a1f37 0%, #0f1128 100%)",
            transition: "all 0.3s ease",
            overflow: "hidden",
            position: "fixed",
            top: "56px",
            left: 0,
            height: "calc(100vh - 56px)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {sidebarOpen && (
            <div className="d-flex flex-column h-100 py-3">
              {/* User Profile Section */}
              <div className="px-3 mb-3 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: "700",
                      fontSize: "1rem",
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: "600", fontSize: "0.9rem" }}>{userName}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", textTransform: "capitalize" }}>{role || "User"}</div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-grow-1 px-3" style={{ overflowY: "auto" }}>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontWeight: "700", letterSpacing: "1.5px", padding: "8px 18px", textTransform: "uppercase" }}>
                  Main Menu
                </div>

                <Link to="/dashboard" onClick={handleLinkClick} style={linkStyle("/dashboard")}>
                  <BsSpeedometer2 style={{ ...iconStyle, color: "#ffa502" }} />
                  Dashboard
                </Link>

                <Link to="/" onClick={handleLinkClick} style={linkStyle("/")}>
                  <BsHouseDoor style={{ ...iconStyle, color: "#2ed573" }} />
                  Home
                </Link>

                {(role === "patient" || role === "admin") && (
                  <>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontWeight: "700", letterSpacing: "1.5px", padding: "16px 18px 8px", textTransform: "uppercase" }}>
                      Patient Services
                    </div>

                    <Link to="/appointments" onClick={handleLinkClick} style={linkStyle("/appointments")}>
                      <BsCalendarCheck style={{ ...iconStyle, color: "#2ed573" }} />
                      My Appointments
                    </Link>

                    <Link to="/lab-results" onClick={handleLinkClick} style={linkStyle("/lab-results")}>
                      <BsFileEarmarkText style={{ ...iconStyle, color: "#a55eea" }} />
                      Lab Reports
                    </Link>

                    <Link to="/doctors" onClick={handleLinkClick} style={linkStyle("/doctors")}>
                      <BsPeople style={{ ...iconStyle, color: "#eccc68" }} />
                      Find Doctors
                    </Link>
                  </>
                )}

                {(role === "doctor" || role === "admin") && (
                  <>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontWeight: "700", letterSpacing: "1.5px", padding: "16px 18px 8px", textTransform: "uppercase" }}>
                      Doctor Tools
                    </div>

                    <Link to="/doctor-lab" onClick={handleLinkClick} style={linkStyle("/doctor-lab")}>
                      <FaFlask style={{ ...iconStyle, color: "#17a2b8" }} />
                      Lab Management
                    </Link>


                  </>
                )}

                {role === "admin" && (
                  <>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontWeight: "700", letterSpacing: "1.5px", padding: "16px 18px 8px", textTransform: "uppercase" }}>
                      Administration
                    </div>

                    <Link to="/admin/dashboard" onClick={handleLinkClick} style={linkStyle("/admin/dashboard")}>
                      <BsPersonBadge style={{ ...iconStyle, color: "#ff4757" }} />
                      Admin Console
                    </Link>

                    <Link to="/laboratory-panel" onClick={handleLinkClick} style={linkStyle("/laboratory-panel")}>
                      <BsBuilding style={{ ...iconStyle, color: "#ff6b81" }} />
                      Lab Worklist
                    </Link>
                  </>
                )}

                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontWeight: "700", letterSpacing: "1.5px", padding: "16px 18px 8px", textTransform: "uppercase" }}>
                  Other
                </div>

                <Link to="/about" onClick={handleLinkClick} style={linkStyle("/about")}>
                  <BsInfoCircle style={{ ...iconStyle, color: "#74b9ff" }} />
                  About Hospital
                </Link>

                <Link to="/contact" onClick={handleLinkClick} style={linkStyle("/contact")}>
                  <BsTelephone style={{ ...iconStyle, color: "#55efc4" }} />
                  Contact Us
                </Link>
              </div>

              {/* Logout */}
              <div className="px-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <Link to="/logout" onClick={handleLinkClick} style={{ ...linkStyle("/logout"), color: "#ff6b6b" }}>
                  <BsBoxArrowRight style={{ ...iconStyle, color: "#ff6b6b" }} />
                  Logout
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div
          className="flex-grow-1"
          style={{
            marginLeft: sidebarOpen ? "250px" : "0",
            transition: "margin-left 0.3s",
            padding: "1.5rem",
            background: "#f0f2f5",
            minHeight: "calc(100vh - 56px)",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
