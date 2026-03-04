import React, { useState, useEffect, useMemo } from "react";
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

import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

// ... (imports remain)

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/patient/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Error loading appointments", err);
    }
  };

  // ===== Stats =====
  const stats = useMemo(() => {
    const total = appointments.length;
    const completed = appointments.filter(
      (a) => a.status === "completed",
    ).length;
    const scheduled = appointments.filter(
      (a) => a.status === "scheduled",
    ).length;
    const cancelled = appointments.filter(
      (a) => a.status === "cancelled",
    ).length;

    return { total, completed, scheduled, cancelled };
  }, [appointments]);

  // ===== Weekly Chart =====
  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = new Array(7).fill(0);

    appointments.forEach((appt) => {
      const day = new Date(appt.date).getDay();
      counts[day]++;
    });

    return {
      labels: days,
      datasets: [
        {
          label: "Appointments",
          data: counts,
          borderColor: "#0d6efd",
          backgroundColor: "rgba(13,110,253,0.2)",
          tension: 0.4,
        },
      ],
    };
  }, [appointments]);

  // ===== Doughnut Chart =====
  const doughnutData = {
    labels: ["Completed", "Scheduled", "Cancelled"],
    datasets: [
      {
        data: [stats.completed, stats.scheduled, stats.cancelled],
        backgroundColor: ["#198754", "#0dcaf0", "#dc3545"],
      },
    ],
  };

  // ===== Quick Links with Numbers =====
  const quickLinks = [
    {
      label: "Find Doctor",
      path: "/find-doctor",
      color: "primary",
      count: 1,
    },
    {
      label: "My Appointments",
      path: "/appointments",
      color: "info",
      count: stats.total,
    },
    {
      label: "Reports",
      path: "/reports",
      color: "warning",
      count: stats.completed,
    },
  ];

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <h2 className="fw-bold mb-4">Patient Dashboard</h2>

      {/* ===== Stats Cards ===== */}
      <div className="row mb-4">
        <StatCard title="Total" value={stats.total} color="primary" />
        <StatCard title="Completed" value={stats.completed} color="success" />
        <StatCard title="Scheduled" value={stats.scheduled} color="info" />
        <StatCard title="Cancelled" value={stats.cancelled} color="danger" />
      </div>

      {/* ===== Quick Actions ===== */}
      <div className="row text-center mb-5">
        {quickLinks.map((link) => (
          <div key={link.label} className="col-6 col-md-4 mb-4">
            <Link
              to={link.path}
              className={`btn btn-${link.color} w-100 py-4 shadow`}
              style={{ borderRadius: "20px", fontWeight: "bold" }}
            >
              {link.label}
              <div className="fw-bold fs-4 mt-2">{link.count}</div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row">
        {/* Recent Appointments */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow border-0">
            <div className="card-header fw-bold">Recent Appointments</div>
            <div className="card-body">
              {appointments.length === 0 && (
                <p className="text-muted text-center">No appointments found.</p>
              )}

              {appointments.slice(0, 5).map((appt) => (
                <div
                  key={appt._id}
                  className="d-flex justify-content-between align-items-center mb-3 p-2 border rounded"
                >
                  <div>
                    <h6 className="mb-0">{appt.doctorName}</h6>
                    <small className="text-muted">
                      {new Date(appt.date).toLocaleDateString()}
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

        {/* Status Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow border-0">
            <div className="card-header fw-bold">Appointment Status</div>
            <div className="card-body">
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="card shadow border-0">
        <div className="card-header fw-bold">Weekly Appointment Analysis</div>
        <div className="card-body">
          <Line data={weeklyData} />
        </div>
      </div>
    </div>
  );
};

// ===== Reusable Stat Card =====
const StatCard = ({ title, value, color }) => (
  <div className="col-md-3 mb-3">
    <div className={`card bg-${color} text-white shadow border-0`}>
      <div className="card-body">
        <h4 className="fw-bold">{value}</h4>
        <p className="mb-0">{title}</p>
      </div>
    </div>
  </div>
);

export default PatientDashboard;
