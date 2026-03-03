import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * PrivateRoute
 * allowedRoles — optional array of roles that may access the route.
 * If not provided, any authenticated user is allowed.
 *
 * Role hierarchy:
 *   super_admin  — bypasses ALL role restrictions.
 *   hospital_admin — must be in allowedRoles explicitly.
 *   admin / doctor / patient — standard behaviour.
 */
const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Fall back to localStorage while context is still hydrating
  let currentUser = user;
  if (!currentUser) {
    try {
      const stored = localStorage.getItem("user");
      if (stored) currentUser = JSON.parse(stored);
    } catch {/* ignore */ }
  }

  // Not logged in → redirect to login
  if (!token || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = currentUser.role?.toLowerCase();

  // super_admin bypasses every role check
  if (role === "super_admin") return <Outlet />;

  // Role restriction check
  if (allowedRoles) {
    const allowed = allowedRoles.map((r) => r.toLowerCase());
    if (!allowed.includes(role)) {
      // Redirect to their correct dashboard instead of login
      if (role === "hospital_admin") return <Navigate to="/hospital-admin/dashboard" replace />;
      if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
      if (role === "doctor") return <Navigate to="/doctor/dashboard" replace />;
      return <Navigate to="/patient/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
