import React from "react";

function User() {
  return (
    <div className="p-4">
      <h2 className="text-success fw-bold">👤 USER ROLE</h2>

      <div className="form-check mt-3">
        <input className="form-check-input" type="checkbox" checked readOnly />
        <label className="form-check-label fw-bold">User Mode Enabled</label>
      </div>

      {/* Example User Sections */}
      <div className="mt-3">
        <h4>My Appointments</h4>
        <ul>
          <li>View Appointments</li>
          <li>Book Appointment</li>
        </ul>

        <h4>Lab Tests</h4>
        <ul>
          <li>Request Lab Tests</li>
          <li>View Lab Results</li>
        </ul>
      </div>
    </div>
  );
}

export default User;
