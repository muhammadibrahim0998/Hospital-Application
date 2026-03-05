
import React, { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import "../css/PatientDashboard.css";
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
import { AuthContext } from "../context/AuthContext";

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
  const [doctors, setDoctors] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState({
    appointments: true,
    doctors: true,
    reports: true,
  });
  const { token } = useContext(AuthContext);

  // ===== Fetch All Data =====
  useEffect(() => {
    if (token) {
      fetchAppointments();
      fetchDoctors();
      fetchReports();
    }
  }, [token]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/patient/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Error loading appointments", err);
    } finally {
      setLoading((prev) => ({ ...prev, appointments: false }));
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/patient/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Error loading doctors", err);
    } finally {
      setLoading((prev) => ({ ...prev, doctors: false }));
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/patient/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data || []);
    } catch (err) {
      console.error("Error loading reports", err);
    } finally {
      setLoading((prev) => ({ ...prev, reports: false }));
    }
  };

  // ===== Stats =====
  const stats = useMemo(() => {
    const total = appointments.length;
    const completed = appointments.filter(
      (a) => a.status === "completed" || a.status === "Completed",
    ).length;
    const scheduled = appointments.filter(
      (a) =>
        a.status === "scheduled" ||
        a.status === "Scheduled" ||
        a.status === "pending",
    ).length;
    const cancelled = appointments.filter(
      (a) => a.status === "cancelled" || a.status === "Cancelled",
    ).length;

    return { total, completed, scheduled, cancelled };
  }, [appointments]);

  // ===== Reports Stats =====
  const reportsStats = useMemo(() => {
    const total = reports.length;
    const recent = reports.filter((r) => {
      const reportDate = new Date(r.date || r.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return reportDate >= thirtyDaysAgo;
    }).length;

    return { total, recent };
  }, [reports]);

  // ===== Weekly Chart =====
  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = new Array(7).fill(0);

    appointments.forEach((appt) => {
      if (appt.date) {
        const day = new Date(appt.date).getDay();
        counts[day]++;
      }
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
        borderWidth: 0,
      },
    ],
  };

  // ===== Quick Links with Dynamic Numbers =====
  const quickLinks = [
    {
      label: "Find Doctor",
      path: "/find-doctor",
      color: "primary",
      icon: "👨‍⚕️",
      count: doctors.length,
      loading: loading.doctors,
    },
    {
      label: "My Appointments",
      path: "/appointments",
      color: "info",
      icon: "📅",
      count: stats.total,
      loading: loading.appointments,
    },
    {
      label: "Reports & Results",
      path: "/reports",
      color: "warning",
      icon: "📊",
      count: reportsStats.total,
      loading: loading.reports,
    },
  ];

  // ===== Format Date Helper =====
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // ===== Get Status Badge Color =====
  const getStatusColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    switch (statusLower) {
      case "completed":
        return "success";
      case "scheduled":
      case "pending":
        return "info";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="patient-dashboard container-fluid p-3 p-md-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">👋 Welcome, Patient</h2>
        <div className="text-muted">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="row g-3 mb-4">
        <StatCard
          title="Total Appointments"
          value={stats.total}
          color="primary"
          icon="📅"
          loading={loading.appointments}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          color="success"
          icon="✅"
          loading={loading.appointments}
        />
        <StatCard
          title="Upcoming"
          value={stats.scheduled}
          color="info"
          icon="⏳"
          loading={loading.appointments}
        />
        <StatCard
          title="Available Doctors"
          value={doctors.length}
          color="warning"
          icon="👨‍⚕️"
          loading={loading.doctors}
        />
      </div>

      {/* ===== Quick Actions ===== */}
      <div className="row g-3 mb-5">
        {quickLinks.map((link) => (
          <div key={link.label} className="col-6 col-md-4">
            <Link
              to={link.path}
              className={`quick-action-card btn btn-${link.color} w-100 p-3 p-md-4 shadow-sm`}
              style={{
                borderRadius: "20px",
                fontWeight: "bold",
                textDecoration: "none",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `var(--bs-${link.color})`,
                color: "white",
                border: "none",
              }}
            >
              <span className="fs-1 mb-2">{link.icon}</span>
              <span className="fs-6">{link.label}</span>
              {link.loading ? (
                <div
                  className="spinner-border spinner-border-sm text-light mt-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <span className="fw-bold fs-3 mt-2">{link.count}</span>
              )}
            </Link>
          </div>
        ))}
      </div>

      <div className="row">
        {/* Recent Appointments */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 fw-bold py-3">
              <span className="fs-5">📋 Recent Appointments</span>
              {appointments.length > 0 && (
                <Link
                  to="/appointments"
                  className="small text-primary float-end mt-1"
                >
                  View All
                </Link>
              )}
            </div>
            <div className="card-body">
              {loading.appointments ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-2">No appointments found</p>
                  <Link
                    to="/find-doctor"
                    className="btn btn-primary btn-sm rounded-pill px-4"
                  >
                    Book Appointment
                  </Link>
                </div>
              ) : (
                appointments.slice(0, 5).map((appt) => (
                  <div
                    key={appt._id || appt.id}
                    className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3"
                  >
                    <div>
                      <h6 className="mb-1 fw-bold">
                        {appt.doctorName || appt.doctor?.name || "Doctor"}
                      </h6>
                      <small className="text-muted">
                        {formatDate(appt.date)} {appt.time && `at ${appt.time}`}
                      </small>
                    </div>
                    <span
                      className={`badge bg-${getStatusColor(appt.status)} rounded-pill px-3 py-2`}
                    >
                      {appt.status || "Scheduled"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Status Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 fw-bold py-3">
              <span className="fs-5">📊 Appointment Status</span>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              {stats.total === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No data to display</p>
                </div>
              ) : (
                <div style={{ maxHeight: "250px", maxWidth: "250px" }}>
                  <Doughnut
                    data={doughnutData}
                    options={{
                      cutout: "60%",
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { boxWidth: 12 },
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="card shadow-sm border-0 mt-2">
        <div className="card-header bg-white border-0 fw-bold py-3">
          <span className="fs-5">📈 Weekly Appointment Analysis</span>
        </div>
        <div className="card-body">
          {stats.total === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">
                No appointment data available for chart
              </p>
            </div>
          ) : (
            <Line
              data={weeklyData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ===== Reusable Stat Card =====
const StatCard = ({ title, value, color, icon, loading }) => (
  <div className="col-md-3 col-6">
    <div className={`card stat-card border-0 shadow-sm`}>
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p className="text-muted small mb-1">{title}</p>
            {loading ? (
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <h3 className="fw-bold mb-0">{value}</h3>
            )}
          </div>
          <div className={`stat-icon bg-${color} bg-opacity-10 p-3 rounded-3`}>
            <span className={`fs-4`}>{icon}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PatientDashboard;