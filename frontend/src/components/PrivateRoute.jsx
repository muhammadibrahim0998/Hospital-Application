import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Wait for user to be loaded from localStorage (if AuthContext handles it, 
  // but better to check directly if token exists but user is null initially)
  // For simplicity, assuming user is loaded or we check localStorage directly if context is pending
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUser = user || storedUser;

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!currentUser || !allowedRoles.map(r => r.toLowerCase()).includes(currentUser.role?.toLowerCase()))) {
    return <Navigate to="/login" replace />; // Or unauthorized page
  }

  return <Outlet />;
};

export default PrivateRoute;
