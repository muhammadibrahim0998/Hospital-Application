import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppointmentProvider } from "./context/AppointmentContext.jsx";
import { DoctorProvider } from "./context/DoctorContext.jsx";
import { DepartmentProvider } from "./context/DepartmentContext.jsx";

import Layout from "./components/Layout.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

import Home from "./components/Home.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Appointments from "./pages/Appointments.jsx";
import Doctors from "./pages/Doctors.jsx";
import DoctorProfile from "./pages/DoctorProfile.jsx";
import Reports from "./pages/Reports.jsx";
import Logout from "./pages/Logout.jsx";
import DepartmentDetails from "./pages/DepartmentDetails.jsx";
import FieldDetails from "./pages/FieldDetails.jsx";
import About  from "./components/About.jsx";

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
            <Route path="/department/:id" element={<DepartmentDetails />} />
            <Route path="/field/:id" element={<FieldDetails />} />
            <Route path="contact" element={<Contact />} />
            <Route path="/about" element={<About />} />

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
