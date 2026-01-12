import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppointmentProvider } from "./context/AppointmentContext";
import { DoctorProvider } from "./context/DoctorContext";

import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./components/Home";
import Contact from "./components/contact";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import Reports from "./pages/Reports";
import Logout from "./pages/Logout";

function AppContent() {
  return (
    <>
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
            <Route path="/contact" element={<Contact />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="doctor/:id" element={<DoctorProfile />} />
            <Route path="reports" element={<Reports />} />
            <Route path="logout" element={<Logout />} />
          </Route>
        </Route>
      </Routes>

      {/* Footer on all pages */}
      <Footer />
    </>
  );
}

function App() {
  return (
    <DoctorProvider>
      <AppointmentProvider>
        <Router>
          <AppContent />
        </Router>
      </AppointmentProvider>
    </DoctorProvider>
  );
}

export default App;
