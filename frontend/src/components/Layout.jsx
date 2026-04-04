import React, { useState, useEffect, useContext } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext";

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
  BsHospital,
  BsShieldLock,
  BsPersonGear,
  BsPeopleFill,
  BsGrid,
  BsPersonCircle,
} from "react-icons/bs";
import { FaFlask, FaMicroscope } from "react-icons/fa";

export default function Layout() {
  const { user, hasModule: authHasModule } = useContext(AuthContext);
  const location = useLocation();

  const isHome = location.pathname === "/";

  const [sidebarOpen, setSidebarOpen] = useState(
    !isHome && window.innerWidth > 768,
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else if (!isHome) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [isHome]);

  const handleLinkClick = () => {
    if (windowWidth <= 768) setSidebarOpen(false);
  };

  const role = user?.role?.toLowerCase();
  const userName = user?.name || "User";

  const hasModule = (m) => {
    if (authHasModule) return authHasModule(m);
    // Fallback if not provided by context
    if (role === "super_admin") return true;
    if (role === "hospital_admin") {
      const raw = user?.modules;
      const modules = typeof raw === "string" ? JSON.parse(raw) : (raw || {});
      return modules[m] !== false;
    }
    return true;
  };

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

  const iconStyle = { fontSize: "1.1rem", flexShrink: 0 };

  const sectionLabel = {
    color: "rgba(255,255,255,0.3)",
    fontSize: "0.7rem",
    fontWeight: "700",
    letterSpacing: "1.5px",
    padding: "16px 18px 8px",
    textTransform: "uppercase",
  };

  const firstSectionLabel = { ...sectionLabel, paddingTop: "8px" };

  // Role badge color
  const roleBadgeColor =
    role === "super_admin" ? "#ff4757" :
      role === "hospital_admin" ? "#ffa502" :
        role === "admin" ? "#ff6b81" :
          role === "doctor" ? "#17a2b8" : "#2ed573";

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

              {/* ── User Profile ────────────────────────────── */}
              <div
                className="px-3 mb-3 pb-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* Menu label */}
                <div className="mb-2">
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    Menu
                  </span>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: "42px", height: "42px", borderRadius: "12px",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: "700", fontSize: "1rem",
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: "600", fontSize: "0.9rem" }}>
                      {userName}
                    </div>
                    <div style={{
                      color: roleBadgeColor,
                      fontSize: "0.72rem",
                      textTransform: "capitalize",
                      fontWeight: "600",
                    }}>
                      {role === "super_admin" ? "⚡ Super Admin" :
                        role === "hospital_admin" ? "🏥 Hospital Admin" :
                          role || "User"}
                    </div>
                  </div>
                </div>
              </div>


              {/* ── Navigation ──────────────────────────────── */}
              <div className="flex-grow-1 px-3" style={{ overflowY: "auto" }}>

                {/* ══ SUPER ADMIN MENU (MATCHING SCREENSHOTS) ════════════ */}
                {role === "super_admin" && (
                  <>
                    <div style={firstSectionLabel}>PLATFORM CONTROL</div>

                    <Link to="/super-admin/dashboard" onClick={handleLinkClick} style={linkStyle("/super-admin/dashboard")}>
                      <BsGrid style={iconStyle} /> Dashboard
                    </Link>

                    <div style={sectionLabel}>USER MANAGEMENT</div>
                    <div style={{ marginLeft: "15px" }}>
                      <Link to="/super-admin/create-roles" onClick={handleLinkClick} style={{ ...linkStyle("/super-admin/create-roles"), fontSize: "0.85rem", padding: "8px 10px" }}>
                        <BsShieldLock style={{ marginRight: '8px' }} /> Create Roles
                      </Link>
                      <Link to="/super-admin/edit-roles" onClick={handleLinkClick} style={{ ...linkStyle("/super-admin/edit-roles"), fontSize: "0.85rem", padding: "8px 10px" }}>
                        <BsPersonGear style={{ marginRight: '8px' }} /> Edit Roles
                      </Link>
                      <Link to="/super-admin/user-management" onClick={handleLinkClick} style={{ ...linkStyle("/super-admin/user-management"), fontSize: "0.85rem", padding: "8px 10px" }}>
                        <BsPersonCircle style={{ marginRight: '8px' }} /> Create Users
                      </Link>
                      <Link to="/super-admin/view-users" onClick={handleLinkClick} style={{ ...linkStyle("/super-admin/view-users"), fontSize: "0.85rem", padding: "8px 10px" }}>
                        <BsPeopleFill style={{ marginRight: '8px' }} /> App Users
                      </Link>
                    </div>

                    <div style={sectionLabel}>REGISTER BUSINESS</div>
                    <div style={{ marginLeft: "15px" }}>
                      <Link to="/super-admin/register-business" onClick={handleLinkClick} style={{ ...linkStyle("/super-admin/register-business"), fontSize: "0.85rem", padding: "8px 10px" }}>
                        <BsBuilding style={{ marginRight: '8px' }} /> Register Business
                      </Link>
                      <Link to="/super-admin/dashboard" onClick={handleLinkClick} style={{ ...linkStyle("/super-admin/dashboard"), fontSize: "0.85rem", padding: "8px 10px" }}>
                        <BsHospital style={{ marginRight: '8px' }} /> View Register Business
                      </Link>
                    </div>

                    <div style={sectionLabel}>SYSTEM</div>
                    <Link to="/" onClick={handleLinkClick} style={linkStyle("/")}>
                      <BsHouseDoor style={iconStyle} /> Home
                    </Link>
                  </>
                )}

                {/* ══ HOSPITAL ADMIN MENU ═══════════════════ */}
                {role === "hospital_admin" && (
                  <>
                    <div style={firstSectionLabel}>My Hospital</div>

                    <Link to="/hospital-admin/dashboard" onClick={handleLinkClick}
                      style={linkStyle("/hospital-admin/dashboard")}>
                      <BsHospital style={{ ...iconStyle, color: "#ffa502" }} />
                      Dashboard
                    </Link>

                    <Link to="/" onClick={handleLinkClick} style={linkStyle("/")}>
                      <BsHouseDoor style={{ ...iconStyle, color: "#2ed573" }} />
                      Home
                    </Link>

                    {hasModule("doctors") && (
                      <>
                        <div style={sectionLabel}>Management</div>
                        <Link to="/hospital-admin/dashboard" onClick={handleLinkClick}
                          style={linkStyle("/hospital-admin/dashboard")}>
                          <BsPersonGear style={{ ...iconStyle, color: "#17a2b8" }} />
                          Doctors
                        </Link>
                      </>
                    )}

                    {hasModule("appUsers") && (
                      <Link to="/hospital-admin/dashboard" onClick={handleLinkClick}
                        style={linkStyle("")}>
                        <BsPeopleFill style={{ ...iconStyle, color: "#a55eea" }} />
                        App Users
                      </Link>
                    )}

                    <div style={sectionLabel}>Info</div>
                    <Link to="/about" onClick={handleLinkClick} style={linkStyle("/about")}>
                      <BsInfoCircle style={{ ...iconStyle, color: "#74b9ff" }} />
                      About
                    </Link>
                    <Link to="/contact" onClick={handleLinkClick} style={linkStyle("/contact")}>
                      <BsTelephone style={{ ...iconStyle, color: "#55efc4" }} />
                      Contact
                    </Link>
                  </>
                )}

                {/* ══ LAB TECHNICIAN MENU ═══════════════════ */}
                {role === "lab_technician" && (
                  <>
                    <div style={firstSectionLabel}>Main Menu</div>

                    <Link to="/lab-tech/dashboard" onClick={handleLinkClick} style={linkStyle("/lab-tech/dashboard")}>
                      <BsSpeedometer2 style={{ ...iconStyle, color: "#ffa502" }} />
                      Dashboard
                    </Link>

                    <div style={sectionLabel}>Laboratory Control</div>
                    <Link to="/laboratory-panel" onClick={handleLinkClick} style={linkStyle("/laboratory-panel")}>
                      <FaMicroscope style={{ ...iconStyle, color: "#a29bfe" }} />
                      Lab Worklist & Panel
                    </Link>
                    <Link to="/lab-results" onClick={handleLinkClick} style={linkStyle("/lab-results")}>
                      <BsFileEarmarkText style={{ ...iconStyle, color: "#a55eea" }} />
                      Completed Reports
                    </Link>

                    <div style={sectionLabel}>Other</div>
                    <Link to="/about" onClick={handleLinkClick} style={linkStyle("/about")}>
                      <BsInfoCircle style={{ ...iconStyle, color: "#74b9ff" }} /> About Hospital
                    </Link>
                  </>
                )}

                {/* ══ STANDARD ROLES (admin, doctor, patient) ══ */}
                {role !== "super_admin" && role !== "hospital_admin" && role !== "lab_technician" && (
                  <>
                    <div style={firstSectionLabel}>Main Menu</div>

                    <Link 
                      to={
                        role === "doctor" ? "/doctor/dashboard" : 
                        role === "admin" ? "/admin/dashboard" : 
                        role === "patient" ? "/patient/dashboard" :
                        role === "super_admin" ? "/super-admin/dashboard" :
                        role === "hospital_admin" ? "/hospital-admin/dashboard" :
                        role === "lab_technician" ? "/lab-tech/dashboard" : "/patient/dashboard"
                      } 
                      onClick={handleLinkClick} 
                      style={linkStyle(
                        role === "doctor" ? "/doctor/dashboard" : 
                        role === "admin" ? "/admin/dashboard" : 
                        role === "patient" ? "/patient/dashboard" :
                        role === "super_admin" ? "/super-admin/dashboard" :
                        role === "hospital_admin" ? "/hospital-admin/dashboard" :
                        role === "lab_technician" ? "/lab-tech/dashboard" : "/patient/dashboard"
                      )}
                    >
                      <BsSpeedometer2 style={{ ...iconStyle, color: "#ffa502" }} />
                      Dashboard
                    </Link>

                    <Link to="/appointments" onClick={handleLinkClick} style={linkStyle("/appointments")}>
                      <BsCalendarCheck style={{ ...iconStyle, color: "#2ed573" }} />
                      {role === "doctor" ? "Doctor Appointments" : "My Appointments"}
                    </Link>

                    <Link to="/" onClick={handleLinkClick} style={linkStyle("/")}>
                      <BsHouseDoor style={{ ...iconStyle, color: "#2ed573" }} />
                      Home
                    </Link>

                    {(role === "patient" || role === "admin" || role === "doctor" || !role) && (
                      <>
                        <div style={sectionLabel}>
                           {(role === "doctor" || role === "admin") ? "Diagnostics" : "Patient Services"}
                        </div>
                        <Link to="/lab-results" onClick={handleLinkClick} style={linkStyle("/lab-results")}>
                          <BsFileEarmarkText style={{ ...iconStyle, color: "#a55eea" }} />
                          Lab Results
                        </Link>
                        <Link to="/doctors" onClick={handleLinkClick} style={linkStyle("/doctors")}>
                          <BsPeople style={{ ...iconStyle, color: "#eccc68" }} />
                          Find Doctors
                        </Link>
                      </>
                    )}

                    {(role === "doctor" || role === "admin") && (
                      <>
                        <div style={sectionLabel}>Diagnostic Tools</div>
                        <Link to="/doctor-lab" state={{ doctor_name: user?.name }} onClick={handleLinkClick} style={linkStyle("/doctor-lab")}>
                          <FaFlask style={{ ...iconStyle, color: "#17a2b8" }} />
                          Laboratory Services
                        </Link>
                        {role === "admin" && (
                          <Link to="/laboratory-panel" onClick={handleLinkClick} style={linkStyle("/laboratory-panel")}>
                            <FaMicroscope style={{ ...iconStyle, color: "#a29bfe" }} />
                            Worklist Lab Panel
                          </Link>
                        )}
                      </>
                    )}

                    {role === "admin" && (
                      <>
                        <div style={sectionLabel}>Administration</div>
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

                    <div style={sectionLabel}>Other</div>
                    <Link to="/about" onClick={handleLinkClick} style={linkStyle("/about")}>
                      <BsInfoCircle style={{ ...iconStyle, color: "#74b9ff" }} />
                      About Hospital
                    </Link>
                    <Link to="/contact" onClick={handleLinkClick} style={linkStyle("/contact")}>
                      <BsTelephone style={{ ...iconStyle, color: "#55efc4" }} />
                      Contact Us
                    </Link>
                  </>
                )}
              </div>

              {/* ── Logout ──────────────────────────────────── */}
              <div
                className="px-3 pt-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Link
                  to="/logout"
                  onClick={handleLinkClick}
                  style={{ ...linkStyle("/logout"), color: "#ff6b6b" }}
                >
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
            marginLeft: (sidebarOpen && windowWidth > 768) ? "250px" : "0",
            width: (sidebarOpen && windowWidth > 768) ? "calc(100% - 250px)" : "100%",
            transition: "all 0.3s ease",
            padding: "1.5rem",
            background: "#f0f2f5",
            minHeight: "calc(100vh - 56px)",
            overflowX: "hidden", // Ensure no horizontal scrolling happens
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
