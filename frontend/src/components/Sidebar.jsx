import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-light vh-100 p-3 shadow">
      <h5>{user?.name}</h5>
      <hr />

      {user?.role === "admin" && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <br />
          <Link to="/doctors">Doctors</Link>
          <br />
          <Link to="/schedule">Schedule</Link>
          <br />
          <Link to="/appointments">Appointments</Link>
          <br />
          <Link to="/patients">Patients</Link>
          <br />
        </>
      )}

      {user?.role === "doctor" && (
        <>
          <Link to="/appointments">My Appointments</Link>
          <br />
          <Link to="/patients">Patients</Link>
          <br />
        </>
      )}

      {user?.role === "user" && (
        <>
          <Link to="/my-appointments">My Bookings</Link>
          <br />
          <Link to="/tests">My Tests</Link>
          <br />
        </>
      )}

      <button className="btn btn-danger mt-3" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
