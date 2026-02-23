import React from "react";
import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role?.toLowerCase();

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
