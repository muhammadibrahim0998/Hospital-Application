// import React, { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// function User() {
//   const { user } = useContext(AuthContext);

//   if (!user || user.role !== "user") {
//     return <div className="p-4 text-danger mt-2">Access Denied</div>;
//   }

//   return (
//     <div className="p-4 mt-2">
//       <h2 className="text-success fw-bold">👤 USER ROLE</h2>

//       <div className="form-check mt-3">
//         <input className="form-check-input" type="checkbox" checked readOnly />
//         <label className="form-check-label fw-bold">User Mode Enabled</label>
//       </div>

//       {/* Example user-only sections */}
//       <div className="mt-3">
//         <h4>My Appointments</h4>
//         <ul>
//           <li>View Appointments</li>
//           <li>Book Appointment</li>
//         </ul>

//         <h4>Lab Tests</h4>
//         <ul>
//           <li>Request Lab Tests</li>
//           <li>View Lab Results</li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default User;
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function User({ permissions }) {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "user") {
    return <div className="p-4 text-danger mt-2">Access Denied</div>;
  }

  return (
    <div className="p-4 mt-2">
      <h2 className="text-success fw-bold">👤 USER ROLE</h2>

      <h4 className="mt-3">Your Allowed Actions</h4>
      {Object.keys(permissions).map((key) => (
        <div className="form-check" key={key}>
          <input
            type="checkbox"
            className="form-check-input"
            checked={permissions[key]}
            readOnly
          />
          <label className="form-check-label">{key}</label>
        </div>
      ))}
    </div>
  );
}

export default User;

