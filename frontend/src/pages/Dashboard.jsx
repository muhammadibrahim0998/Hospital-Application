import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const role = user?.role?.toLowerCase();

  if (role === "admin") {
    return <AdminDashboard />;
  } else if (role === "doctor") {
    return <DoctorDashboard />;
  } else if (role === "patient") {
    return <PatientDashboard />;
  } else {
    return (
      <div className="container mt-5 text-center">
        <h2>Welcome to CityCare Hospital</h2>
        <p>Please log in to access your dashboard.</p>
      </div>
    );
  }
}
