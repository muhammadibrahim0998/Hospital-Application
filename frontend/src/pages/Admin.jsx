import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Admin() {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "admin") {
    return <div className="p-4 text-danger">Access Denied</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-danger fw-bold">🔑 ADMIN ROLE</h2>
      <p>
        You are logged in as <strong>Admin</strong>
      </p>

      {/* Example admin-only sections */}
      <div className="mt-3">
        <h4>Manage Doctors</h4>
        <ul>
          <li>Add Doctor</li>
          <li>Edit Doctor</li>
          <li>Delete Doctor</li>
        </ul>

        <h4>Reports</h4>
        <ul>
          <li>View All Reports</li>
          <li>Generate Reports</li>
        </ul>

        <h4>Laboratory Panel</h4>
        <ul>
          <li>View All Lab Tests</li>
          <li>Approve Test Results</li>
        </ul>
      </div>
    </div>
  );
}

export default Admin;
