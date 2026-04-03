
import React, { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
import { 
  ExternalLink, 
  Clipboard, 
  FileText, 
  FlaskConical, 
  ClipboardList, 
  Activity, 
  Pill, 
  Stethoscope, 
  ChevronRight,
  Zap,
  CheckCircle,
  Thermometer,
  ShieldCheck
} from "lucide-react";
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
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const displayUser = user || { name: "Guest Patient", role: "patient" };

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [reports, setReports] = useState([]);
  const [searchCnic, setSearchCnic] = useState("");
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState({
    appointments: true,
    doctors: true,
    reports: false, // Don't load guest reports automatically
  });
  // const userName = user?.name || "Patient"; // This line is replaced by displayUser

  // ===== Fetch All Data =====
  useEffect(() => {
    if (token) {
      setLoading(prev => ({ ...prev, reports: true }));
      fetchAppointments();
      fetchDoctors();
      fetchReports();
    } else {
      // Guest: only fetch doctors
      fetchDoctors();
      setLoading(prev => ({ ...prev, appointments: false }));
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
      // Fetch public doctors list without any Authorization header
      // This prevents 403 errors if the token is invalid/expired
      const res = await axios.get(`${API_BASE_URL}/api/patient/doctors`);
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Error loading doctors", err);
    } finally {
      setLoading((prev) => ({ ...prev, doctors: false }));
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/lab/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter for 'done' reports if not an admin/staff (though this is patient dashboard)
      const finalizedOnly = (res.data || []).filter(r => r.status === 'done');
      setReports(finalizedOnly);
    } catch (err) {
      console.error("Error loading reports", err);
    } finally {
      setLoading((prev) => ({ ...prev, reports: false }));
    }
  };

  const handlePublicSearch = async () => {
    if (!searchCnic.trim()) return alert("Please enter your CNIC");
    setSearching(true);
    setLoading(prev => ({ ...prev, reports: true }));
    try {
      const res = await axios.get(`${API_BASE_URL}/api/lab/public/check-result/${searchCnic}`);
      setReports(res.data || []);
      if ((res.data || []).length === 0) {
        alert("No finalized results found for this CNIC.");
      }
    } catch (err) {
      console.error("Error searching reports", err);
      alert("Search failed. Please try again.");
    } finally {
      setSearching(false);
      setLoading(prev => ({ ...prev, reports: false }));
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
    // Correctly filter reports for this patient
    // If guest, we already have filtered list (from search) or empty list
    const patientReports = token ? reports.filter(r => {
      const matchUserId = (user?.id && (String(r.patient_id) === String(user.id) || String(r.user_id) === String(user.id))) || 
                          (user?._id && (String(r.patient_id) === String(user._id) || String(r.user_id) === String(user._id)));
      const matchCnic = user?.cnic && r.cnic && (r.cnic.replace(/\D/g, "") === user.cnic.replace(/\D/g, ""));
      const matchPhone = user?.phone && r.phone && (r.phone.replace(/\D/g, "") === user.phone.replace(/\D/g, ""));
      return matchUserId || matchCnic || matchPhone;
    }) : reports;

    const total = patientReports.length;
    const recent = patientReports.filter((r) => {
      const reportDate = new Date(r.date || r.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return reportDate >= thirtyDaysAgo;
    }).length;

    return { total, recent, list: patientReports };
  }, [reports, user, token]);

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
      label: "Lab Results",
      path: "/lab-results",
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
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">👋 Welcome, {displayUser.name}</h2>
          <p className="text-muted small mb-0">{token ? "Your personalized health overview" : "Access your lab results and find doctors easily"}</p>
        </div>
        {!token && (
          <div className="bg-white p-3 rounded-4 shadow-sm border-start border-4 border-warning d-flex align-items-center gap-2" style={{ maxWidth: '400px', flex: '1 1 auto' }}>
             <div className="flex-grow-1">
               <label className="small fw-bold text-muted text-uppercase mb-1 d-block" style={{ fontSize: '10px' }}>Check Lab Results</label>
               <input 
                 type="text" 
                 className="form-control form-control-sm border-0 bg-light rounded-pill" 
                 placeholder="Enter CNIC (e.g. 1234567890123)"
                 value={searchCnic}
                 onChange={(e) => setSearchCnic(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handlePublicSearch()}
               />
             </div>
             <button 
               className="btn btn-warning btn-sm rounded-circle p-2 mt-3" 
               onClick={handlePublicSearch}
               disabled={searching}
             >
               {searching ? "..." : "🔍"}
             </button>
          </div>
        )}
        <div className="text-muted small">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* ===== LATEST FINALIZED REPORT ALERT ===== */}
      {reportsStats.total > 0 && reportsStats.list.some(r => r.status === 'done' && r.appointment_id) && (
        <div className="border-0 shadow-lg rounded-5 mb-5 overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a4da4 100%)' }}>
           <div className="p-4 p-md-5 position-relative">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-4 position-relative">
                 <div className="d-flex align-items-center gap-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-4">
                       <ClipboardList size={40} />
                    </div>
                    <div>
                        <h2 className="fw-bold mb-1" style={{ letterSpacing: '1px' }}>LATEST MEDICAL CHART IS READY!</h2>
                        <p className="mb-0 opacity-75 fw-medium">Your tests, prescriptions, and radiology reports have been unified for your review.</p>
                    </div>
                 </div>
                 <button 
                    className="btn btn-light rounded-pill px-5 py-3 fw-bold text-primary shadow-lg"
                    onClick={() => {
                        const latest = reportsStats.list.find(r => r.status === 'done' && r.appointment_id);
                        window.open(`/medical-report/${latest.appointment_id}`, '_blank');
                    }}
                 >
                    VIEW FINAL CHART
                 </button>
              </div>
              <div className="position-absolute top-0 end-0 p-5 opacity-10">
                 <FlaskConical size={120} />
              </div>
           </div>
        </div>
      )}

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

        {/* Recent Lab Reports - Redesigned 'khkuly' Premium View */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-2xl border-0 h-100 rounded-5 overflow-hidden">
            <div className="card-header bg-white border-0 fw-black py-3 d-flex justify-content-between align-items-center">
              <span className="fs-6 text-dark tracking-tight d-flex align-items-center gap-2">
                <Activity size={18} className="text-primary" /> RECENT CLINICAL INSIGHTS
              </span>
              {reports.length > 0 && (
                <Link
                  to="/lab-results"
                  className="fw-black text-primary text-uppercase"
                  style={{ fontSize: '10px', textDecoration: 'none' }}
                >
                  Archive Log <ChevronRight size={12} />
                </Link>
              )}
            </div>
            <div className="card-body p-2">
              {loading.reports ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-5 bg-slate-50 rounded-4 m-2 border border-dashed">
                  <ClipboardList size={40} className="text-muted opacity-25 mb-3" />
                  <p className="text-muted fw-bold mb-1">No reports pending</p>
                  <p className="small text-muted px-4">When investigations are finalized, your health trace will appear here.</p>
                </div>
              ) : (
                <div className="px-2">
                  {reportsStats.list.slice(0, 6).map((report) => (
                    <div
                      key={report.id}
                      className="d-flex align-items-center mb-2 p-2 rounded-4 border border-light bg-white hover-lift transition-all shadow-sm"
                    >
                      <div className="flex-shrink-0 bg-primary bg-opacity-10 p-2 rounded-3 text-primary me-3">
                         {report.test_name?.toLowerCase().includes('blood') ? <FlaskConical size={18} /> : 
                          report.test_name?.toLowerCase().includes('temp') ? <Thermometer size={18} /> :
                          <Activity size={18} />}
                      </div>
                      
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="d-flex align-items-center gap-2 mb-0">
                           <h6 className="mb-0 fw-black text-dark tracking-tight text-truncate" style={{ fontSize: '11px' }}>
                             {report.test_name}
                           </h6>
                           {report.medication_given && (
                             <span className="badge text-success fw-black rounded-1" style={{ fontSize: '7px', background: 'rgba(25,135,84,0.1)' }}>
                               <Pill size={8} className="me-1" /> RX PRESCRIBED
                             </span>
                           )}
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                           <div className="fw-bold text-primary" style={{ fontSize: '10px' }}>{report.result || "Pending"}</div>
                           <div className="bg-light rounded-pill" style={{ width: '40px', height: '4px' }}>
                              <div className="bg-primary rounded-pill h-100" style={{ width: report.result?.includes('%') ? report.result : '60%' }}></div>
                           </div>
                        </div>
                      </div>

                      <div className="ms-auto d-flex align-items-center gap-2">
                        {report.status === 'done' ? (
                          <div className="text-success" title="Finalized">
                            <ShieldCheck size={16} />
                          </div>
                        ) : (
                          <div className="text-warning spin-slow">
                            <Zap size={14} />
                          </div>
                        )}
                        
                        {report.status === 'done' && report.appointment_id && (
                          <button 
                            
                            
                            className="btn btn-primary btn-sm rounded-pill p-1 shadow-sm btn-premium-sky border-0 border-focus"
                            onClick={() => window.open(`/medical-report/${report.appointment_id}`, '_blank')}
                          >
                            <ExternalLink size={12} className="text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {reports.length > 0 && (
              <div className="card-footer bg-slate-50 border-0 p-3 text-center">
                 <p className="small text-muted fw-bold mb-0" style={{ fontSize: '9px' }}>
                    <Zap size={10} className="text-primary me-1" /> Tap the icon to view complete digital medical charts
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Chart - Only for Logged In Patients with data */}
      {token && stats.total > 0 && (
        <div className="card shadow-sm border-0 mt-2">
          <div className="card-header bg-white border-0 fw-bold py-3">
            <span className="fs-5">📈 Weekly Appointment Analysis</span>
          </div>
          <div className="card-body">
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
          </div>
        </div>
      )}
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

// Add high-density styles
const dashboardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  
  .patient-dashboard { font-family: 'Inter', sans-serif; }
  .fw-black { font-weight: 900; }
  .tracking-tight { letter-spacing: -0.5px; }
  .shadow-2xl { box-shadow: 0 15px 35px -12px rgba(0, 0, 0, 0.08); }
  .bg-slate-50 { background-color: #f8fafc; }
  
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
  .transition-all { transition: all 0.2s ease-in-out; }
  
  .btn-premium-sky {
    background: linear-gradient(135deg, #0d6efd 0%, #0d5be1 100%);
    color: white;
  }
  
  .spin-slow {
    animation: spin 3s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .border-focus:focus { 
    box-shadow: 0 0 0 2px rgba(13,110,253,0.15) !important;
  }
`;

// Inject styles once
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = dashboardStyles;
  document.head.appendChild(style);
}
