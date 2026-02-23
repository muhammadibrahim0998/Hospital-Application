import React from "react";

export default function DoctorDashboard() {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Doctor Dashboard</h2>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow text-center p-3">
            <i className="bi bi-calendar-week fs-1 text-primary"></i>
            <h5 className="mt-2">My Appointments</h5>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow text-center p-3">
            <i className="bi bi-file-medical fs-1 text-success"></i>
            <h5 className="mt-2">Patient Reports</h5>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow text-center p-3">
            <i className="bi bi-clipboard-data fs-1 text-warning"></i>
            <h5 className="mt-2">Lab Requests</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
