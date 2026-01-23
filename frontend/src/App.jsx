import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppointmentProvider } from "./context/AppointmentContext.jsx";
import { DoctorProvider } from "./context/DoctorContext.jsx";
import { DepartmentProvider } from "./context/DepartmentContext.jsx";

import Layout from "./components/Layout.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

import Home from "./components/Home.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

import Register from "../src/Signup/Register.jsx";
import Login from "../src/Signup/Login.jsx";
import Logout from "../src/Signup/Logout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Appointments from "./pages/Appointments.jsx";
import Doctors from "./pages/Doctors.jsx";
import DoctorProfile from "./pages/DoctorProfile.jsx";
import Reports from "./pages/Reports.jsx";

import DepartmentDetails from "./pages/DepartmentDetails.jsx";
import FieldDetails from "./pages/FieldDetails.jsx";
import About  from "./components/About.jsx";

import { LabProvider } from "./context/LabContext.jsx"; 
import DoctorLab from "../src/Lab/DoctorLab.jsx";   
import LabPanel from "../src/Lab/LabPanel.jsx";   
import LabResults from "../src/Lab/LabResults.jsx"; 
import LaboratoryPanel from "./Lab/LaboratoryPanel.jsx";
import Admin from "./pages/Admin.jsx";
import User from "./pages/User.jsx";


function AppContent() {
  const userRole = "doctor";
  return (
    <>
      <LabProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="/department/:id" element={<DepartmentDetails />} />
              <Route path="/field/:id" element={<FieldDetails />} />
              <Route path="contact" element={<Contact />} />
              <Route path="/about" element={<About />} />

              <Route path="doctors" element={<Doctors />} />
              <Route path="doctor/:id" element={<DoctorProfile />} />
              <Route path="reports" element={<Reports />} />
              <Route path="logout" element={<Logout />} />
              <Route path="/doctor-lab" element={<DoctorLab />} />
              <Route path="/lab-panel" element={<LabPanel />} />
              <Route path="/lab-results" element={<LabResults />} />
              <Route path="/laboratory-panel" element={<LaboratoryPanel />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/user" element={<User />} />
            </Route>
          </Route>
        </Routes>
      </LabProvider>

      {/* Footer on all pages */}
      <Footer />
    </>
  );
}

function App() {
  return (
    <DoctorProvider>
      <AppointmentProvider>
        <DepartmentProvider>
          <Router>
            <AppContent />
          </Router>
        </DepartmentProvider>
      </AppointmentProvider>
    </DoctorProvider>
  );
}

export default App;
