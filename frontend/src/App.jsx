import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppointmentProvider } from "./context/AppointmentContext";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import Reports from "./pages/Reports";
import Home from "./components/Home";
import Logout from "./pages/Logout";
import PrivateRoute from "./components/PrivateRoute";
import { DoctorProvider } from "./context/DoctorContext";

function App() {
  return (
    <DoctorProvider>
      <AppointmentProvider>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="doctors" element={<Doctors />} />
                <Route path="doctor/:id" element={<DoctorProfile />} />
                <Route path="reports" element={<Reports />} />
                <Route path="logout" element={<Logout />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AppointmentProvider>
    </DoctorProvider>
  );
}

export default App;
