import React from "react";

function Admin() {
  return (
    <div className="p-4">
      <h2 className="text-danger fw-bold">🔑 ADMIN ROLE</h2>
      <p>
        You are logged in as <strong>Admin</strong>
      </p>

      {/* Example Admin Sections */}
      <div className="mt-3">
        <h4>Manage Doctors</h4>
        <ul>
          <li>Add Doctor</li>
          <li>Edit Doctor</li>
          <li>Delete Doctor</li>
        </ul>

        <h4>Reports</h4>
        <ul>
          <li>View Reports</li>
          <li>Generate Reports</li>
        </ul>

        <h4>Laboratory Panel</h4>
        <ul>
          <li>View Lab Tests</li>
          <li>Approve Results</li>
        </ul>
      </div>
    </div>
  );
}

export default Admin;
