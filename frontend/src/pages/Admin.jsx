// import React, { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// function Admin() {
//   const { user } = useContext(AuthContext);

//   if (!user || user.role !== "admin") {
//     return <div className="p-4 text-danger mt-2">Access Denied</div>;
//   }

//   return (
//     <div className="p-4 mt-2">
//       <h2 className="text-danger fw-bold">🔑 ADMIN ROLE</h2>
//       <p>
//         You are logged in as <strong>Admin</strong>
//       </p>

//       {/* Example admin-only sections */}
//       <div className="mt-3">
//         <h4>Manage Doctors</h4>
//         <ul>
//           <li>Add Doctor</li>
//           <li>Edit Doctor</li>
//           <li>Delete Doctor</li>
//         </ul>

//         <h4>Reports</h4>
//         <ul>
//           <li>View All Reports</li>
//           <li>Generate Reports</li>
//         </ul>

//         <h4>Laboratory Panel</h4>
//         <ul>
//           <li>View All Lab Tests</li>
//           <li>Approve Test Results</li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Admin;
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Admin({ onPermissionsChange }) {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "admin") {
    return <div className="p-4 text-danger mt-2">Access Denied</div>;
  }

  // ✅ Default all permissions enabled for admin
  const [permissions, setPermissions] = useState({
    viewAppointments: true,
    bookAppointments: true,
    requestLabTests: true,
    viewLabResults: true,
  });

  const togglePermission = (key) => {
    const updated = { ...permissions, [key]: !permissions[key] };
    setPermissions(updated);
    onPermissionsChange(updated); // send updated permissions to parent
  };

  return (
    <div className="p-4 mt-2">
      <h2 className="text-danger fw-bold">🔑 ADMIN ROLE</h2>
      <p>
        You are logged in as <strong>Admin</strong>
      </p>

      <div className="mt-3">
        <h4>Set User Permissions</h4>
        {Object.keys(permissions).map((key) => (
          <div className="form-check" key={key}>
            <input
              type="checkbox"
              className="form-check-input"
              checked={permissions[key]}
              onChange={() => togglePermission(key)}
            />
            <label className="form-check-label">{key}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;



