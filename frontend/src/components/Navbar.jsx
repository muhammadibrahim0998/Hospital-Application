// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { BsList, BsBell } from "react-icons/bs";

// export default function Navbar({ sidebarOpen, setSidebarOpen }) {
//   const navigate = useNavigate();
//   const isLoggedIn = !!sessionStorage.getItem("token");
//   const user = JSON.parse(sessionStorage.getItem("user") || "{}");

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const logout = () => {
//     sessionStorage.removeItem("user");
//     sessionStorage.removeItem("token");
//     navigate("/login");
//     setDropdownOpen(false);
//     setMenuOpen(false);
//   };

//   const goHome = () => {
//     navigate("/");
//     setMenuOpen(false);
//     setSidebarOpen(false);
//     setDropdownOpen(false);
//   };

//   return (
//     <nav
//       className="navbar navbar-expand-lg shadow-sm position-fixed w-100"
//       style={{
//         zIndex: 1100,
//         background: "#1a1f37",
//         borderBottom: "1px solid rgba(255,255,255,0.05)",
//         height: "56px",
//       }}
//     >
//       <div className="container-fluid d-flex align-items-center justify-content-between px-3">
//         {/* Left side */}
//         <div className="d-flex align-items-center">
//           {/* Sidebar toggle */}
//           <button
//             className="btn me-3 d-flex align-items-center justify-content-center"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             style={{
//               width: "36px",
//               height: "36px",
//               borderRadius: "10px",
//               border: "1px solid rgba(255,255,255,0.1)",
//               color: "rgba(255,255,255,0.7)",
//               background: "rgba(255,255,255,0.05)",
//             }}
//           >
//             <BsList style={{ fontSize: "1.2rem" }} />
//           </button>

//           {/* Logo */}
//           <span
//             className="fw-bold"
//             onClick={goHome}
//             style={{
//               cursor: "pointer",
//               color: "#fff",
//               fontSize: "1.1rem",
//               letterSpacing: "0.5px",
//             }}
//           >
//             <span style={{ color: "#667eea" }}>🏥</span> CityCare Hospital
//           </span>
//         </div>

//         {/* Mobile toggle */}
//         <button
//           className="navbar-toggler border-0"
//           type="button"
//           onClick={() => setMenuOpen(!menuOpen)}
//           style={{ color: "rgba(255,255,255,0.7)" }}
//         >
//           <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
//         </button>

//         {/* Menu */}
//         <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
//           <ul className="navbar-nav ms-auto align-items-center gap-1">
//             <li className="nav-item">
//               <span
//                 className="nav-link"
//                 onClick={goHome}
//                 style={{ cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}
//               >
//                 Home
//               </span>
//             </li>

//             <li className="nav-item">
//               <Link
//                 to="/contact"
//                 className="nav-link"
//                 onClick={() => { setMenuOpen(false); setSidebarOpen(false); setDropdownOpen(false); }}
//                 style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}
//               >
//                 Contact
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link
//                 to="/about"
//                 className="nav-link"
//                 onClick={() => { setMenuOpen(false); setSidebarOpen(false); setDropdownOpen(false); }}
//                 style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}
//               >
//                 About
//               </Link>
//             </li>

//             {/* Account dropdown */}
//             <li className="nav-item dropdown ms-2">
//               <button
//                 className="btn dropdown-toggle d-flex align-items-center gap-2"
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 style={{
//                   background: "linear-gradient(135deg, #667eea, #764ba2)",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "10px",
//                   padding: "6px 16px",
//                   fontSize: "0.85rem",
//                   fontWeight: "500",
//                 }}
//               >
//                 {isLoggedIn ? (user.name || "My Account") : "Account"}
//               </button>

//               <ul
//                 className={`dropdown-menu dropdown-menu-end shadow border-0 ${dropdownOpen ? "show" : ""}`}
//                 style={{ borderRadius: "12px", marginTop: "8px" }}
//               >
//                 {!isLoggedIn && (
//                   <>
//                     <li>
//                       <Link className="dropdown-item py-2" to="/login" onClick={() => setDropdownOpen(false)}>Login</Link>
//                     </li>
//                     <li>
//                       <Link className="dropdown-item py-2" to="/register" onClick={() => setDropdownOpen(false)}>Register</Link>
//                     </li>
//                   </>
//                 )}

//                 {isLoggedIn && (
//                   <>
//                     <li className="px-3 py-2">
//                       <small className="text-muted">Signed in as</small>
//                       <div className="fw-bold small">{user.name || "User"}</div>
//                       <small className="text-muted text-capitalize">{user.role || ""}</small>
//                     </li>
//                     <li><hr className="dropdown-divider" /></li>
//                     <li>
//                       <Link className="dropdown-item py-2" to="/dashboard" onClick={() => setDropdownOpen(false)}>
//                         Dashboard
//                       </Link>
//                     </li>
//                     <li>
//                       <Link className="dropdown-item py-2" to="/register" onClick={() => setDropdownOpen(false)}>
//                         Register
//                       </Link>
//                     </li>
//                     <li><hr className="dropdown-divider" /></li>
//                     <li>
//                       <button className="dropdown-item py-2 text-danger" onClick={logout}>
//                         Logout
//                       </button>
//                     </li>
//                   </>
//                 )}
//               </ul>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsList, BsBell, BsSearch } from "react-icons/bs";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState("black");
  const [search, setSearch] = useState("");

  // ===== THEMES =====
  const themes = {
    blue: {
      navBg: "#0d6efd",
      text: "#ffffff",
      box: "#0b5ed7",
      border: "#084298",
      searchBg: "#ffffff",
      searchText: "#000",
    },
    white: {
      navBg: "#ffffff",
      text: "#000000",
      box: "#f1f1f1",
      border: "#ddd",
      searchBg: "#ffffff",
      searchText: "#000",
    },
    black: {
      navBg: "#000000",
      text: "#ffffff",
      box: "#111111",
      border: "#222",
      searchBg: "#ffffff",
      searchText: "#000",
    },
    dark: {
      navBg: "#ffffff", // inside white
      text: "#000000",
      box: "#ffffff",
      border: "#000000", // black border
      searchBg: "#ffffff",
      searchText: "#000",
    },
  };

  const currentTheme = themes[theme];

  // ===== SEARCH FUNCTION =====
  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/doctors?search=${search}`);
    setSearch("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const goHome = () => {
    navigate("/");
    setDropdownOpen(false);
  };

  return (
    <nav
      className="navbar navbar-expand-lg position-fixed w-100 shadow-sm"
      style={{
        zIndex: 1100,
        height: "60px",
        background: currentTheme.navBg,
        borderBottom: `2px solid ${currentTheme.border}`,
        transition: "0.3s",
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between px-4">
        {/* LEFT */}
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: currentTheme.box,
              color: currentTheme.text,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: "8px",
            }}
          >
            <BsList size={20} />
          </button>

          <div
            className="d-flex align-items-center gap-2"
            style={{ cursor: "pointer", color: currentTheme.text }}
            onClick={goHome}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                background: "#00c6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "#000",
              }}
            >
              🏥
            </div>
            <span className="fw-bold">CityCare Hospital</span>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="flex-grow-1 d-flex justify-content-center">
          <div
            className="d-flex align-items-center"
            style={{
              maxWidth: "420px",
              width: "100%",
              border: `1px solid ${currentTheme.border}`,
              borderRadius: "20px",
              overflow: "hidden",
              background: currentTheme.searchBg,
            }}
          >
            <input
              type="text"
              placeholder="Search Doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                flex: 1,
                border: "none",
                padding: "6px 15px",
                outline: "none",
                background: "transparent",
                color: currentTheme.searchText,
              }}
            />

            {/* Small Search Button */}
            <button
              onClick={handleSearch}
              style={{
                background: currentTheme.box,
                border: "none",
                padding: "6px 12px",
                cursor: "pointer",
                color: currentTheme.text,
              }}
            >
              <BsSearch />
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="d-flex align-items-center gap-3">
          {/* Theme Switcher */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="form-select form-select-sm"
            style={{
              width: "120px",
              borderRadius: "20px",
              background: currentTheme.box,
              color: currentTheme.text,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            <option value="blue">Blue</option>
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="dark">Dark</option>
          </select>

          {/* Notification */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: currentTheme.box,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: currentTheme.text,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            <BsBell size={18} />
          </div>

          {/* Profile */}
          <div className="position-relative">
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#00c6ff",
                color: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {isLoggedIn ? user?.name?.charAt(0)?.toUpperCase() || "U" : "U"}
            </div>

            {dropdownOpen && (
              <div
                className="position-absolute end-0 mt-2 shadow"
                style={{
                  width: "200px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: currentTheme.box,
                  color: currentTheme.text,
                  border: `1px solid ${currentTheme.border}`,
                }}
              >
                <div className="px-3 py-2 border-bottom">
                  <small>Signed in as</small>
                  <div className="fw-bold small">{user.name || "User"}</div>
                </div>

                <Link
                  className="dropdown-item py-2"
                  to="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>

                <button
                  className="dropdown-item py-2 text-danger"
                  onClick={logout}
                >
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

