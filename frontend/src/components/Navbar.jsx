// import React, { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   BsList,
//   BsBell,
//   BsSearch,
//   BsMoon,
//   BsSun,
//   BsMoonStars,
// } from "react-icons/bs";
// import { AuthContext } from "../context/AuthContext";

// export default function Navbar({ sidebarOpen, setSidebarOpen }) {
//   const navigate = useNavigate();
//   const { user, logout } = useContext(AuthContext);

//   const isLoggedIn = !!user;

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [theme, setTheme] = useState("black");
//   const [search, setSearch] = useState("");

//   // ===== THEMES =====
//   const themes = {
//     blue: {
//       navBg: "#0d6efd",
//       text: "#ffffff",
//       box: "#0b5ed7",
//       border: "#084298",
//       searchBg: "#ffffff",
//       searchText: "#000",
//     },
//     black: {
//       navBg: "#000000",
//       text: "#ffffff",
//       box: "#111111",
//       border: "#222",
//       searchBg: "#ffffff",
//       searchText: "#000",
//     },
//     white: {
//       navBg: "#ffffff",
//       text: "#000000",
//       box: "#ffffff",
//       border: "#cccccc",
//       searchBg: "#ffffff",
//       searchText: "#000",
//     },
//   };

//   const currentTheme = themes[theme];

//   // ===== SEARCH FUNCTION =====
//   const handleSearch = () => {
//     if (!search.trim()) return;
//     navigate(`/doctors?search=${search}`);
//     setSearch("");
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     setDropdownOpen(false);
//     navigate("/login");
//   };

//   const goHome = () => {
//     navigate("/");
//     setDropdownOpen(false);
//   };

//   // Icon for theme switching
//   const getThemeIcon = () => {
//     switch (theme) {
//       case "blue":
//         return <BsMoonStars size={16} />;
//       case "black":
//         return <BsMoon size={16} />;
//       case "white":
//         return <BsSun size={16} />;
//       default:
//         return <BsMoon size={16} />;
//     }
//   };

//   return (
//     <nav
//       className="navbar navbar-expand-lg position-fixed w-100 shadow-sm"
//       style={{
//         zIndex: 1100,
//         height: "60px",
//         background: currentTheme.navBg,
//         borderBottom: `2px solid ${currentTheme.border}`,
//         transition: "0.3s",
//       }}
//     >
//       <div className="container-fluid d-flex align-items-center justify-content-between px-4">
//         {/* LEFT SIDE */}
//         <div className="d-flex align-items-center gap-3">
//           <button
//             className="btn"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             style={{
//               background: currentTheme.box,
//               color: currentTheme.text,
//               border: `1px solid ${currentTheme.border}`,
//               borderRadius: "8px",
//             }}
//           >
//             <BsList size={20} />
//           </button>

//           <div
//             className="d-flex align-items-center gap-2"
//             style={{ cursor: "pointer", color: currentTheme.text }}
//             onClick={goHome}
//           >
//             <div
//               style={{
//                 width: "32px",
//                 height: "32px",
//                 borderRadius: "6px",
//                 background: "#00c6ff",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontWeight: "bold",
//                 color: "#000",
//               }}
//             >
//               🏥
//             </div>
//             <span className="fw-bold">CityCare Hospital</span>
//           </div>
//         </div>

//         {/* CENTER SEARCH BAR */}
//         <div className="flex-grow-1 d-flex justify-content-center">
//           <div
//             className="d-flex align-items-center"
//             style={{
//               maxWidth: "420px",
//               width: "100%",
//               border: `4px solid ${currentTheme.border}`,
//               borderRadius: "50px", // circle shape
//               overflow: "hidden",
//               background: currentTheme.searchBg,
//             }}
//           >
//             <input
//               type="text"
//               placeholder="Search Doctor..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onKeyDown={handleKeyPress}
//               style={{
//                 flex: 1,
//                 border: "none",
//                 padding: "8px 15px",
//                 outline: "none",
//                 background: "transparent",
//                 color: currentTheme.searchText,
//                 borderRadius: "50px 0 0 50px",
//               }}
//             />

//             <button
//               onClick={handleSearch}
//               style={{
//                 background: currentTheme.box,
//                 border: "none",
//                 padding: "8px 18px",
//                 cursor: "pointer",
//                 color: currentTheme.text,
//                 borderRadius: "0 50px 50px 0",
//               }}
//             >
//               <BsSearch />
//             </button>
//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="d-flex align-items-center gap-3">
//           {/* Theme switch icon */}
//           <div
//             onClick={() => {
//               // Cycle theme: blue -> black -> white -> blue
//               if (theme === "blue") setTheme("black");
//               else if (theme === "black") setTheme("white");
//               else if (theme === "white") setTheme("blue");
//             }}
//             style={{
//               width: "36px",
//               height: "36px",
//               borderRadius: "50%",
//               background: currentTheme.box,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//               color: currentTheme.text,
//               border: `3px solid ${currentTheme.border}`,
//               transition: "0.3s",
//             }}
//             title={`Current theme: ${theme}`}
//           >
//             {getThemeIcon()}
//           </div>

//           {/* Notification bell */}
//           <div
//             style={{
//               width: "36px",
//               height: "36px",
//               borderRadius: "50%",
//               background: currentTheme.box,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//               color: currentTheme.text,
//               border: `5px solid ${currentTheme.border}`,
//             }}
//           >
//             <BsBell size={18} />
//           </div>

//           {/* User dropdown */}
//           <div className="position-relative">
//             <div
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//               style={{
//                 width: "36px",
//                 height: "36px",
//                 borderRadius: "50%",
//                 background: "#00c6ff",
//                 color: "#000",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontWeight: "bold",
//                 cursor: "pointer",
//               }}
//             >
//               {isLoggedIn ? user?.name?.charAt(0)?.toUpperCase() || "U" : "U"}
//             </div>

//             {dropdownOpen && (
//               <div
//                 className="position-absolute end-0 mt-3 shadow px-1"
//                 style={{
//                   width: "150px",
//                   borderRadius: "10px",
//                   overflow: "hidden",
//                   background: currentTheme.box,
//                   color: currentTheme.text,
//                   border: `5px solid ${currentTheme.border}`,
//                 }}
//               >
//                 <div className="px-4 py-1 border-bottom ">
//                   <small>Signed in as</small>
//                   <div className="fw-bold small">{user?.name || "User"}</div>
//                   <div className="text-muted small text-capitalize">
//                     {user?.role?.replace("_", " ")}
//                   </div>
//                 </div>

//                 <button
//                   className="dropdown-item py-1 px-5 text-danger "
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsList,
  BsBell,
  BsSearch,
} from "react-icons/bs";
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
      className="navbar navbar-expand-lg position-fixed w-100 shadow-sm navbar-custom"
      style={{
        background: currentTheme.navBg,
        borderBottom: `2px solid ${currentTheme.border}`,
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between px-4">
        {/* LEFT SIDE — logo only */}
        <div className="d-flex align-items-center gap-3">
          <div
            className="navbar-logo"
            style={{ color: currentTheme.text }}
            onClick={goHome}
          >
            <div className="navbar-logo-icon">🏥</div>
            <span className="fw-bold">CityCare Hospital</span>
          </div>
        </div>

        {/* CENTER SEARCH BAR */}
        <div className="flex-grow-1 d-flex justify-content-center">
          <div
            className="navbar-search-container"
            style={{
              border: `4px solid ${currentTheme.border}`,
              background: currentTheme.searchBg,
            }}
          >
            <input
              type="text"
              placeholder="Search Doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyPress}
              className="navbar-search-input"
              style={{ color: currentTheme.searchText }}
            />
            <button
              onClick={handleSearch}
              className="navbar-search-btn"
              style={{
                background: currentTheme.box,
                color: currentTheme.text,
              }}
            >
              <BsSearch />
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="d-flex align-items-center gap-3">

          {/* Notification bell */}
          <div
            className="navbar-icon navbar-bell"
            style={{
              background: currentTheme.box,
              color: currentTheme.text,
              borderColor: currentTheme.border,
            }}
          >
            <BsBell size={18} />
          </div>

          {/* Toggle button — RIGHT side with user initial */}
          <button
            className="btn navbar-btn"
            style={{
              background: currentTheme.box,
              color: currentTheme.text,
              borderColor: currentTheme.border,
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <BsList size={20} />
            <span style={{ fontSize: "13px", fontWeight: 700 }}>
              {isLoggedIn ? user?.name?.charAt(0)?.toUpperCase() || "M" : "M"}.
            </span>
          </button>

          {/* User dropdown */}
          <div className="position-relative">
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="navbar-icon"
              style={{ background: "#00c6ff", color: "#000" }}
            >
              {isLoggedIn ? user?.name?.charAt(0)?.toUpperCase() || "U" : "U"}
            </div>

            {dropdownOpen && (
              <div
                className="position-absolute end-0 mt-3 shadow navbar-dropdown"
                style={{
                  background: currentTheme.box,
                  color: currentTheme.text,
                  borderColor: currentTheme.border,
                }}
              >
                <div
                  className="navbar-dropdown-header"
                  style={{ borderBottomColor: currentTheme.border }}
                >
                  <small>Signed in as</small>
                  <div className="fw-bold small">{user?.name || "User"}</div>
                  <div className="text-muted small text-capitalize">
                    {user?.role?.replace("_", " ")}
                  </div>
                </div>

                <button
                  className="navbar-dropdown-button"
                  onClick={handleLogout}
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