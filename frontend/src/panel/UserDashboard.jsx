import React from "react";

export default function UserDashboard() {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">User Dashboard</h2>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow text-center p-3">
            <i className="bi bi-calendar-plus fs-1 text-primary"></i>
            <h5 className="mt-2">Book Appointment</h5>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow text-center p-3">
            <i className="bi bi-file-earmark-medical fs-1 text-success"></i>
            <h5 className="mt-2">My Reports</h5>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow text-center p-3">
            <i className="bi bi-activity fs-1 text-danger"></i>
            <h5 className="mt-2">Lab Results</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
