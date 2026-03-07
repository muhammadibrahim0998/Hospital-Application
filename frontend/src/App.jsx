import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useContext } from "react";

import { AppointmentProvider } from "./context/AppointmentContext.jsx";
import { DoctorProvider } from "./context/DoctorContext.jsx";
import { DepartmentProvider } from "./context/DepartmentContext.jsx";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { LabProvider } from "./context/LabContext.jsx";

import AddDoctor from "./pages/AddDoctor";
import Layout from "./components/Layout.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

import Home from "./components/Home.jsx";
import Contact from "./components/Contact.jsx";
import About from "./components/About.jsx";
import Admin from "./pages/Admin";
import User from "./pages/User";
import Login from "./Signup/Login.jsx";
import Register from "./Signup/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Appointments from "./pages/Appointments.jsx";
import Doctors from "./pages/Doctors.jsx";
import DoctorProfile from "./pages/DoctorProfile.jsx";
import Chat from "./pages/Chat.jsx";
import Logout from "./Signup/Logout.jsx";
import DepartmentDetails from "./pages/DepartmentDetails.jsx";
import FieldDetails from "./pages/FieldDetails.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";

import DoctorLab from "./Lab/DoctorLab.jsx";
import LabResults from "./Lab/LabResults.jsx";
import LaboratoryPanel from "./Lab/LaboratoryPanel.jsx";
import LaboratoryServices from "./Lab/LaboratoryServices.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import HospitalAdminDashboard from "./pages/HospitalAdminDashboard.jsx";
import UserManagement from "./pages/UserManagement.jsx";
import RegisterBusiness from "./pages/RegisterBusiness.jsx";
import CreateRoles from "./pages/CreateRoles.jsx";
import ViewUsers from "./pages/ViewUsers.jsx";

// ─── Global Auth Guard ────────────────────────────────────────────────────────
// Single source of truth for authentication.
// Routes only render AFTER session restore is done — no flash, no race condition.
function AppContent() {
  const { user, token, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return; // wait for session restore

    const PUBLIC_PATHS = ["/login", "/register"];
    const isPublicPath = PUBLIC_PATHS.includes(location.pathname.toLowerCase());
    const isRootPath = location.pathname === "/";

    // --------------------------------------------------------------
    // Unauthenticated visitors should always land on the login page.
    //
    // * opening a fresh tab (root or deep link) when there is no
    //   token in storage should never render a protected component
    //   first.  The previous implementation only redirected if the
    //   path wasn't public, which is fine, but the root route itself
    //   rendered <Home /> briefly before the effect ran.  This
    //   version makes the intent explicit and guards the root path
    //   as well.
    // --------------------------------------------------------------
    if (!token) {
      if (!isPublicPath) {
        navigate("/login", { replace: true });
        return;
      }
      // if we're already on /login or /register we can stay there.
    }

    // --------------------------------------------------------------
    // If the user *is* authenticated and they are currently sitting on
    // a public route (login/register) or the root path, send them to
    // their role-specific dashboard.
    // --------------------------------------------------------------
    if (token && user && (isPublicPath || isRootPath)) {
      const role = user.role?.toLowerCase();
      if (role === "super_admin")
        navigate("/super-admin/dashboard", { replace: true });
      else if (role === "hospital_admin")
        navigate("/hospital-admin/dashboard", { replace: true });
      else if (role === "admin")
        navigate("/admin/dashboard", { replace: true });
      else if (role === "doctor")
        navigate("/doctor/dashboard", { replace: true });
      else navigate("/patient/dashboard", { replace: true });
    }
  }, [loading, token, user, location.pathname, navigate]);

  // ── Show spinner while session is being restored ──────────────────────────
  // Routes are NOT rendered until loading is done — prevents any page flash.
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f1128",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "4px solid rgba(102,126,234,0.3)",
              borderTop: "4px solid #667eea",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.9rem",
              margin: 0,
            }}
          >
            Verifying session…
          </p>
        </div>
      </div>
    );
  }
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Routes>
      {/* root path: decide based on auth state, avoids flashing home while effect runs */}
      <Route
        path="/"
        element={
          token ? (
            <Navigate to={`/${user?.role?.toLowerCase()}/dashboard`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="find-doctor" element={<Doctors />} />
          <Route path="doctor/:id" element={<DoctorProfile />} />
          <Route path="doctor-lab" element={<LaboratoryServices />} />
          <Route path="lab-results" element={<LabResults />} />
          <Route path="laboratory-panel" element={<LaboratoryPanel />} />
          <Route path="/admin/add-doctor" element={<AddDoctor />} />
          <Route path="department/:id" element={<DepartmentDetails />} />
          <Route path="field/:id" element={<FieldDetails />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Route>

      {/* Role-based Dashboards */}

      {/* Super Admin — full platform control */}
      <Route element={<PrivateRoute allowedRoles={["super_admin"]} />}>
        <Route path="/super-admin" element={<Layout />}>
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="create-roles" element={<CreateRoles />} />
          <Route path="edit-roles" element={<CreateRoles />} />
          <Route path="register-business" element={<RegisterBusiness />} />
          <Route path="view-businesses" element={<SuperAdminDashboard />} />
          <Route path="view-users" element={<ViewUsers />} />
        </Route>
      </Route>

      {/* Hospital Admin — scoped to one hospital */}
      <Route element={<PrivateRoute allowedRoles={["hospital_admin"]} />}>
        <Route path="/hospital-admin" element={<Layout />}>
          <Route path="dashboard" element={<HospitalAdminDashboard />} />
        </Route>
      </Route>

      {/* Admin Dashboard */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<Layout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Doctor Dashboard */}
      <Route element={<PrivateRoute allowedRoles={["doctor"]} />}>
        <Route path="/doctor" element={<Layout />}>
          <Route path="dashboard" element={<DoctorDashboard />} />
        </Route>
      </Route>

      {/* Patient Dashboard */}
      <Route element={<PrivateRoute allowedRoles={["patient"]} />}>
        <Route path="/patient" element={<Layout />}>
          <Route path="dashboard" element={<PatientDashboard />} />
        </Route>
      </Route>

      {/* Chat Route */}
      <Route
        element={<PrivateRoute allowedRoles={["patient", "doctor", "admin"]} />}
      >
        <Route path="/chat" element={<Layout />}>
          <Route path=":userId" element={<Chat />} />
        </Route>
      </Route>
    </Routes>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  return (
    <Router>
      <AuthProvider>
        <DoctorProvider>
          <AppointmentProvider>
            <DepartmentProvider>
              <LabProvider>
                <AppContent />
              </LabProvider>
            </DepartmentProvider>
          </AppointmentProvider>
        </DoctorProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
