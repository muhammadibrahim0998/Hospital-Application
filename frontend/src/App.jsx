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
import LabTechnicianDashboard from "./pages/LabTechnicianDashboard";

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

// ─── Helper: map a role to its home dashboard path ───────────────────────────
function getDashboardPath(role) {
  const r = role?.toLowerCase();
  if (r === "super_admin") return "/super-admin/dashboard";
  if (r === "hospital_admin") return "/hospital-admin/dashboard";
  if (r === "admin") return "/admin/dashboard";
  if (r === "lab_technician") return "/lab-tech/dashboard";
  if (r === "doctor") return "/doctor/dashboard";
  if (r === "patient") return "/patient/dashboard";
  return "/patient/dashboard"; // Default to patient dashboard for guest
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── Global Auth Guard ────────────────────────────────────────────────────────
// All decisions are made at RENDER TIME (no useEffect, no flash).
// Routes are only mounted after session restore completes.
function AppContent() {
  const { user, token, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return; // wait for session restore

    const PUBLIC_PATHS = ["/login", "/register"];
    const isPublicPath = PUBLIC_PATHS.includes(location.pathname.toLowerCase());
    const isRootPath = location.pathname === "/";

    if (!token) {
      if (!isPublicPath && !isRootPath) { // allow root path (home)
        navigate("/login", { replace: true });
        return;
      }
    }

    // Role-based redirection from login/register
    if (token && user && isPublicPath) {
      const role = user.role?.toLowerCase();
      if (role === "super_admin")
        navigate("/super-admin/dashboard", { replace: true });
      else if (role === "hospital_admin")
        navigate("/hospital-admin/dashboard", { replace: true });
      else if (role === "admin")
        navigate("/admin/dashboard", { replace: true });
      else if (role === "lab_technician")
        navigate("/lab-tech/dashboard", { replace: true });
      else if (role === "doctor")
        navigate("/doctor/dashboard", { replace: true });
      else navigate("/patient/dashboard", { replace: true });
    }
  }, [loading, token, user, location.pathname, navigate]);
  // ── Show spinner while session is being restored ──────────────────────────
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

  const PUBLIC_PATHS = ["/login", "/register"];
  const isPublicPath = PUBLIC_PATHS.includes(location.pathname.toLowerCase());

  // Skip login for patient dashboard and find-doctor to allow "Direct Access"
  const isPatientPath = location.pathname.startsWith("/patient") ||
                        location.pathname.startsWith("/find-doctor") ||
                        location.pathname.startsWith("/doctors") ||
                        location.pathname === "/";

  // Not logged in + trying to access any non-public page AND not a patient path → go to login
  if (!token && !isPublicPath && !isPatientPath) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Logged in + on a public page (login/register) → go to own dashboard
  if (token && user && isPublicPath) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  // Special case: If at root and logged in but NOT a patient, go to dashboard
  if (token && user && location.pathname === "/" && user.role?.toLowerCase() !== "patient") {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Routes>
      {/* root path: now shows Home to everyone */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="find-doctor" element={<Doctors />} />
          <Route path="doctor/:id" element={<DoctorProfile />} />
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

      {/* Shared Lab Routes — Ensures visibility for all relevant roles */}
      <Route element={<PrivateRoute allowedRoles={["doctor", "lab_technician", "admin", "hospital_admin"]} />}>
        <Route path="/" element={<Layout />}>
          <Route path="lab-results" element={<LabResults />} />
        </Route>
      </Route>

      {/* Public Patient Access — No PrivateRoute for these specific paths */}
      <Route path="/" element={<Layout />}>
        <Route path="patient/dashboard" element={<PatientDashboard />} />
        <Route path="lab-results" element={<LabResults />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="find-doctor" element={<Doctors />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["doctor", "lab_technician", "admin", "hospital_admin"]} />}>
        <Route path="/" element={<Layout />}>
          <Route path="laboratory-panel" element={<LaboratoryPanel />} />
          <Route path="doctor-lab" element={<LaboratoryServices />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["doctor"]} />}>
        <Route path="/doctor" element={<Layout />}>
          <Route path="dashboard" element={<DoctorDashboard />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["lab_technician"]} />}>
        <Route path="/lab-tech" element={<Layout />}>
          <Route path="dashboard" element={<LabTechnicianDashboard />} />
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
