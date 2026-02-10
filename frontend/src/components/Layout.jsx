
import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

// Icons
import {
  BsSpeedometer2,
  BsCalendarCheck,
  BsPeople,
  BsFileEarmarkText,
  BsClipboardData,
  BsBuilding,
  BsPersonBadge,
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

  // ✅ Custom colors for each icon
  const iconColors = {
    admin: "#ff4757", // red
    user: "#1e90ff", // blue
    dashboard: "#ffa502", // orange
    appointments: "#2ed573", // green
    doctors: "#eccc68", // yellow
    reports: "#a55eea", // purple
    doctorLab: "#17a2b8", // teal
    labPanel: "#ff6b81", // pink
    labResults: "#ff7f50", // coral
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
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
              {/* ADMIN */}
            {/* <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/admin"
                  onClick={handleLinkClick}
                >
                  <BsPersonBadge
                    className="me-2"
                    style={{ color: iconColors.admin, verticalAlign: "middle" }}
                  />
                  Admin
                </Link>
              </li>

             
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/user"
                  onClick={handleLinkClick}
                >
                  <BsPeople
                    className="me-2"
                    style={{ color: iconColors.user, verticalAlign: "middle" }}
                  />
                  User
                </Link>
              </li>  */}

              <hr className="text-white" />

              {/* DASHBOARD */}
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/dashboard"
                  onClick={handleLinkClick}
                >
                  <BsSpeedometer2
                    className="me-2"
                    style={{
                      color: iconColors.dashboard,
                      verticalAlign: "middle",
                    }}
                  />
                  Dashboard
                </Link>
              </li>

              {/* APPOINTMENTS */}
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/appointments"
                  onClick={handleLinkClick}
                >
                  <BsCalendarCheck
                    className="me-2"
                    style={{
                      color: iconColors.appointments,
                      verticalAlign: "middle",
                    }}
                  />
                  Appointments
                </Link>
              </li>

              {/* DOCTORS */}
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/doctors"
                  onClick={handleLinkClick}
                >
                  <BsPeople
                    className="me-2"
                    style={{
                      color: iconColors.doctors,
                      verticalAlign: "middle",
                    }}
                  />
                  Doctors
                </Link>
              </li>

              {/* REPORTS */}
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/reports"
                  onClick={handleLinkClick}
                >
                  <BsFileEarmarkText
                    className="me-2"
                    style={{
                      color: iconColors.reports,
                      verticalAlign: "middle",
                    }}
                  />
                  Reports
                </Link>
              </li>

              {/* DOCTOR LAB */}
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/doctor-lab"
                  onClick={handleLinkClick}
                >
                  <FaFlask
                    className="me-2"
                    style={{
                      color: iconColors.doctorLab,
                      verticalAlign: "middle",
                    }}
                  />
                  Doctor → Lab Tests
                </Link>
              </li>

              {/* LAB PANEL */}
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/laboratory-panel"
                  onClick={handleLinkClick}
                >
                  <BsBuilding
                    className="me-2"
                    style={{
                      color: iconColors.labPanel,
                      verticalAlign: "middle",
                    }}
                  />
                  Laboratory Panel
                </Link>
              </li>

              {/* LAB RESULTS */}
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/lab-results"
                  onClick={handleLinkClick}
                >
                  <BsClipboardData
                    className="me-2"
                    style={{
                      color: iconColors.labResults,
                      verticalAlign: "middle",
                    }}
                  />
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
