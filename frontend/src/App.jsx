
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppointmentProvider } from "./context/AppointmentContext.jsx";
import { DoctorProvider } from "./context/DoctorContext.jsx";
import { DepartmentProvider } from "./context/DepartmentContext.jsx";
import { AuthProvider } from "./context/AuthContext";

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
import Reports from "./pages/Reports.jsx";
import Logout from "./Signup/Logout.jsx";
import DepartmentDetails from "./pages/DepartmentDetails.jsx";
import FieldDetails from "./pages/FieldDetails.jsx";

import { LabProvider } from "./context/LabContext.jsx";
import DoctorLab from "./Lab/DoctorLab.jsx";
import LabPanel from "./Lab/LabPanel.jsx";
import LabResults from "./Lab/LabResults.jsx";
import LaboratoryPanel from "./Lab/LaboratoryPanel.jsx";

import { useState } from "react";

function AppContent() {
  // ✅ User permissions state (controlled by admin)
  const [userPermissions, setUserPermissions] = useState({
    viewAppointments: true,
    bookAppointments: true,
    requestLabTests: true,
    viewLabResults: true,
  });

  return (
    <AuthProvider>
      <LabProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected → global */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="doctor/:id" element={<DoctorProfile />} />
              <Route path="reports" element={<Reports />} />

              <Route path="department/:id" element={<DepartmentDetails />} />
              <Route path="field/:id" element={<FieldDetails />} />

              <Route path="contact" element={<Contact />} />
              <Route path="about" element={<About />} />

              <Route path="doctor-lab" element={<DoctorLab />} />
              <Route path="lab-panel" element={<LabPanel />} />
              <Route path="lab-results" element={<LabResults />} />
              <Route path="laboratory-panel" element={<LaboratoryPanel />} />

              {/* ✅ Admin/User routes with permissions */}
              <Route
                path="admin"
                element={<Admin onPermissionsChange={setUserPermissions} />}
              />
              <Route
                path="user"
                element={<User permissions={userPermissions} />}
              />

              <Route path="logout" element={<Logout />} />
            </Route>
          </Route>
        </Routes>
      </LabProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <DoctorProvider>
        <AppointmentProvider>
          <DepartmentProvider>
            <Router>
              <AppContent />
            </Router>
          </DepartmentProvider>
        </AppointmentProvider>
      </DoctorProvider>
    </AuthProvider>
  );
}

export default App;
