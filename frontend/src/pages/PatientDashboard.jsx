// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { API_BASE_URL } from "../config";

// const PatientDashboard = () => {
//   const [appointments, setAppointments] = useState([]);
//   const token = localStorage.getItem("token");
//   const headers = { Authorization: `Bearer ${token}` };

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/patient/appointments`, {
//         headers,
//       });
//       setAppointments(res.data);
//     } catch (err) {
//       console.error("Error fetching appointments", err);
//     }
//   };

//   const linkData = [
//     {
//       label: "Find Doctor",
//       path: "/find-doctor",
//       bgColor: "primary",
//       svg: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="48"
//           height="48"
//           fill="white"
//           viewBox="0 0 16 16"
//         >
//           <path d="M8 0a5 5 0 0 0-5 5v1h10V5a5 5 0 0 0-5-5zM3 6v7a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6H3z" />
//         </svg>
//       ),
//     },
//     {
//       label: "My Appointments",
//       path: "/appointments",
//       bgColor: "info",
//       svg: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="48"
//           height="48"
//           fill="white"
//           viewBox="0 0 16 16"
//         >
//           <path d="M3 0a1 1 0 0 0-1 1v1h12V1a1 1 0 0 0-1-1H3zM0 4v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4H0zm2 2h12v9H2V6z" />
//         </svg>
//       ),
//     },
//     {
//       label: "Lab Results",
//       path: "/lab-results",
//       bgColor: "success",
//       svg: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="48"
//           height="48"
//           fill="white"
//           viewBox="0 0 16 16"
//         >
//           <path d="M6.5 0a.5.5 0 0 1 .5.5V1h2v-.5a.5.5 0 0 1 1 0V1h1a1 1 0 0 1 1 1v1h-12V2a1 1 0 0 1 1-1h1V.5a.5.5 0 0 1 .5-.5zM0 4h16v1H0V4zm2 2h12v9H2V6z" />
//         </svg>
//       ),
//     },
//     {
//       label: "Reports",
//       path: "/reports",
//       bgColor: "warning",
//       svg: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="48"
//           height="48"
//           fill="white"
//           viewBox="0 0 16 16"
//         >
//           <path d="M4 0h8a1 1 0 0 1 1 1v14l-5-5-5 5V1a1 1 0 0 1 1-1z" />
//         </svg>
//       ),
//     },
//   ];

//   return (
//     <div className="container mt-4">
//       <h2 className="fw-bold mb-4 text-center">Patient Dashboard</h2>

//       <div className="row justify-content-center mb-5">
//         {linkData.map((link) => (
//           <div key={link.label} className="col-6 col-md-3 mb-4 text-center">
//             <Link
//               to={link.path}
//               className={`d-flex flex-column align-items-center justify-content-center rounded-circle shadow-lg mx-auto text-white transition-transform`}
//               style={{
//                 width: "180px",
//                 height: "180px",
//                 backgroundColor: `var(--bs-${link.bgColor})`,
//                 transition: "all 0.4s ease",
//               }}
//             >
//               <div className="mb-2" style={{ width: "60px", height: "60px" }}>
//                 {link.svg}
//               </div>
//               <span className="fw-bold">{link.label}</span>
//             </Link>
//           </div>
//         ))}
//       </div>

//       {/* Extra CSS animation */}
//       <style>{`
//         a.rounded-circle:hover {
//           transform: scale(1.1);
//           box-shadow: 0 0 20px rgba(0,0,0,0.3);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PatientDashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { API_BASE_URL } from "../config";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/patient/appointments`, {
        headers,
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Dynamic Counts =====
  const totalAppointments = appointments.length;
  const pending = appointments.filter((a) => a.status === "scheduled").length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

  // ===== Quick Circle Links =====
  const quickLinks = [
    { label: "Find Doctor", path: "/find-doctor", color: "#0d6efd" },
    { label: "My Appointments", path: "/appointments", color: "#0dcaf0" },
    { label: "Lab Results", path: "/lab-results", color: "#198754" },
    { label: "Reports", path: "/reports", color: "#ffc107" },
  ];

  // ===== Line Chart =====
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Appointments",
        data: [5, 8, 6, 10, 7, 4, 9],
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13,110,253,0.2)",
        tension: 0.4,
      },
    ],
  };

  // ===== Doughnut Chart =====
  const doughnutData = {
    labels: ["Completed", "Pending", "Cancelled"],
    datasets: [
      {
        data: [completed, pending, cancelled],
        backgroundColor: ["#198754", "#0dcaf0", "#dc3545"],
      },
    ],
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <h3 className="fw-bold mb-4">Patient Dashboard</h3>

      {/* ===== Stats Cards ===== */}
      <div className="row mb-4">
        <StatCard title="Total" value={totalAppointments} color="primary" />
        <StatCard title="Completed" value={completed} color="success" />
        <StatCard title="Scheduled" value={pending} color="info" />
        <StatCard title="Cancelled" value={cancelled} color="danger" />
      </div>

      {/* ===== Circle Quick Actions ===== */}
      <div className="row text-center mb-5">
        {quickLinks.map((item) => (
          <div key={item.label} className="col-6 col-md-3 mb-4">
            <Link
              to={item.path}
              className="d-flex flex-column align-items-center justify-content-center mx-auto shadow-lg text-white fw-bold"
              style={{
                width: "150px",
                height: "200px",
                borderRadius: "50%",
                backgroundColor: item.color,
                transition: "0.4s",
              }}
            >
              {item.label}
            </Link>
          </div>
        ))}
      </div>

      {/* ===== Middle Section ===== */}
      <div className="row">
        {/* Today Appointments */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow border-0">
            <div className="card-header bg-white fw-bold">
              Today Appointments
            </div>
            <div className="card-body">
              {appointments.slice(0, 5).map((appt) => (
                <div
                  key={appt._id}
                  className="d-flex justify-content-between align-items-center mb-3 p-2 border rounded"
                >
                  <div>
                    <h6 className="mb-0">{appt.Doctor}</h6>
                    <small className="text-muted">
                      {appt.Date}
                    </small>
                  </div>
                  <span
                    className={`badge bg-${appt.status === "completed"
                        ? "success"
                        : appt.status === "scheduled"
                          ? "info"
                          : "danger"
                      }`}
                  >
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow border-0">
            <div className="card-header bg-white fw-bold">
              Appointment Status
            </div>
            <div className="card-body">
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom Section ===== */}
      <div className="row">
        <div className="col-lg-12">
          <div className="card shadow border-0">
            <div className="card-header bg-white fw-bold">Weekly Analysis</div>
            <div className="card-body">
              <Line data={lineData} />
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <style>
        {`
          a:hover {
            transform: scale(1.1);
            box-shadow: 0 0 25px rgba(0,0,0,0.3);
          }
        `}
      </style>
    </div>
  );
};

// ===== Reusable Stat Card =====
const StatCard = ({ title, value, color }) => (
  <div className="col-md-3 mb-3">
    <div className={`card text-white bg-${color} shadow border-0`}>
      <div className="card-body">
        <h4 className="fw-bold">{value}</h4>
        <p className="mb-0">{title}</p>
      </div>
    </div>
  </div>
);

export default PatientDashboard;