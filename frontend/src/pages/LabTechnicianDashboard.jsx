import React, { useContext } from "react";
import { Container, Row, Col, Card, Badge, Table, Button } from "react-bootstrap";
import { Microscope, Clock, CheckCircle, FlaskConical, RefreshCw, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLab } from "../context/LabContext";

export default function LabTechnicianDashboard() {
  const { user } = useContext(AuthContext);
  const { tests, loading, fetchTests } = useLab();

  const pending = tests.filter(t => t.status !== "done");
  const done    = tests.filter(t => t.status === "done");

  return (
    <Container fluid className="lab-dashboard-slim min-vh-100 py-3 py-md-4">
      {/* Premium Compact Header */}
      <div className="archive-compact-header mb-4 p-3 rounded-4 bg-white shadow-2xl position-relative overflow-hidden border">
        <div className="accent-blur"></div>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 position-relative z-index-2">
          <div className="d-flex align-items-center gap-3">
             <div className="lab-logo-box bg-dark text-primary p-2 rounded-3 shadow-lg">
                <Microscope size={24} strokeWidth={2.5} />
             </div>
             <div>
                <h2 className="fw-black mb-0 tracking-tight text-dark h4">Lab Control Center</h2>
                <div className="d-flex align-items-center gap-2 mt-0">
                   <div className="d-flex align-items-center gap-1 text-muted fw-bold" style={{ fontSize: '10px' }}>
                     Welcome, <span className="text-primary">{user?.name?.toUpperCase()}</span> · SMART PATHOLOGY HUB
                   </div>
                </div>
             </div>
          </div>
          <Button 
            variant="primary" 
            className="rounded-pill px-4 py-2 fw-black shadow-lg btn-premium-sky border-0 d-flex align-items-center gap-2"
            onClick={fetchTests}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} /> {loading ? "Syncing..." : "SYNC DATABASE"}
          </Button>
        </div>
      </div>

      {/* Analytics Stats */}
      <Row className="g-4 mb-4">
        {[
          { label: "Total Investigations", value: tests.length, icon: <FlaskConical size={24} />, color: "primary", gradient: "linear-gradient(135deg, #0d6efd, #0d5be1)" },
          { label: "Critical Pending", value: tests.filter(t => t.status !== 'done').length, icon: <Clock size={24} />, color: "warning", gradient: "linear-gradient(135deg, #ffc107, #ff9800)" },
          { label: "Verified Results", value: tests.filter(t => t.status === 'done').length, icon: <CheckCircle size={24} />, color: "success", gradient: "linear-gradient(135deg, #198754, #146c43)" },
        ].map((s, i) => (
          <Col key={i} xs={12} md={4}>
            <Card className="border-0 shadow-2xl rounded-4 overflow-hidden stat-card-hover">
              <div className="p-3 d-flex align-items-center gap-3 bg-white">
                <div className="p-3 rounded-4 shadow-sm text-white" style={{ background: s.gradient }}>{s.icon}</div>
                <div>
                  <div className="text-muted fw-black text-uppercase tracking-tight" style={{ fontSize: '9px' }}>{s.label}</div>
                  <h2 className="fw-black mb-0 text-dark h3">{s.value}</h2>
                </div>
              </div>
              <div style={{ height: '4px', background: s.gradient, opacity: 0.6 }}></div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Worklist Overview */}
      <Card className="border-0 shadow-2xl rounded-4 overflow-hidden border">
        <Card.Header className="bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
           <h5 className="fw-black mb-0 text-dark text-uppercase tracking-tight h6">
              <Zap size={18} className="text-warning me-2" /> Live Diagnostic Worklist
           </h5>
           <Link to="/laboratory-panel" className="btn btn-dark btn-sm rounded-pill px-4 fw-black border-0 shadow-sm" style={{ fontSize: '10px' }}>
              RE-DIRECT TO LAB PANEL <ArrowRight size={14} className="ms-1" />
           </Link>
        </Card.Header>
        <Card.Body className="p-0">
           <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                 <thead className="bg-slate-50 text-muted text-uppercase fw-black" style={{ fontSize: '9px' }}>
                    <tr>
                       <th className="px-4 py-3">Patient Profile</th>
                       <th className="py-3">Investigation</th>
                       <th className="py-3">Requested By</th>
                       <th className="py-3">Clinical Date</th>
                       <th className="py-3 text-center">Protocol</th>
                    </tr>
                 </thead>
                 <tbody>
                    {tests.filter(t => t.status !== 'done').length === 0 ? (
                       <tr><td colSpan={5} className="text-center py-5 text-muted fw-bold">Live worklist is empty. System synchronized.</td></tr>
                    ) : tests.filter(t => t.status !== 'done').slice(0, 10).map(t => (
                       <tr key={t.id} className="border-bottom border-light">
                          <td className="px-4 py-3">
                             <div className="fw-black text-dark" style={{ fontSize: '13px' }}>{t.patient_name || "GUEST"}</div>
                             <div className="text-muted fw-bold" style={{ fontSize: '9px' }}>CNIC: {t.cnic || "---"}</div>
                          </td>
                          <td className="py-3">
                             <Badge bg="primary" className="bg-opacity-10 text-primary fw-black rounded-1 border-0" style={{ fontSize: '9px' }}>{t.test_name}</Badge>
                          </td>
                          <td className="py-3">
                             <div className="fw-bold text-dark small">DR. {t.doctor_name?.toUpperCase() || 'RESIDENT'}</div>
                             <div className="text-muted fw-bold" style={{ fontSize: '8px' }}>CONSULTANT</div>
                          </td>
                          <td className="py-3">
                             <div className="small fw-black text-muted">{new Date(t.date || t.created_at).toLocaleDateString()}</div>
                          </td>
                          <td className="py-3 text-center">
                             <Link to="/laboratory-panel" className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-black border-2" style={{ fontSize: '9px' }}>
                                PROCESS RESULTS
                             </Link>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </Table>
           </div>
        </Card.Body>
      </Card>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .lab-dashboard-slim { font-family: 'Inter', sans-serif; background: #f1f5f9; }
        .fw-black { font-weight: 900; }
        .tracking-tight { letter-spacing: -1px; }
        .shadow-2xl { box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.08); }
        .bg-slate-50 { background: #f8fafc; }
        .btn-premium-sky { background: linear-gradient(135deg, #0d6efd, #0d5be1); }
        .stat-card-hover { transition: all 0.3s ease; }
        .stat-card-hover:hover { transform: translateY(-5px); box-shadow: 0 30px 60px -20px rgba(0,0,0,0.15); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .accent-blur {
          position: absolute; top: -50px; right: -50px; width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(13,110,253,0.08) 0%, transparent 70%); z-index: 0;
        }
      `}</style>
    </Container>
  );
}
