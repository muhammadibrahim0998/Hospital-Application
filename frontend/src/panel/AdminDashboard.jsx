import React from "react";

export default function AdminDashboard() {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="card shadow text-center p-3">
            <i className="bi bi-people-fill fs-1 text-primary"></i>
            <h5 className="mt-2">Manage Users</h5>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center p-3">
            <i className="bi bi-person-badge-fill fs-1 text-success"></i>
            <h5 className="mt-2">Doctors</h5>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center p-3">
            <i className="bi bi-calendar-check-fill fs-1 text-warning"></i>
            <h5 className="mt-2">Appointments</h5>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center p-3">
            <i className="bi bi-bar-chart-fill fs-1 text-danger"></i>
            <h5 className="mt-2">Reports</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
