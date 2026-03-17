import React, { useContext } from "react";
import { Container, Row, Col, Card, Badge, Table, Button } from "react-bootstrap";
import { Microscope, Clock, CheckCircle, FlaskConical, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLab } from "../context/LabContext";

export default function LabTechnicianDashboard() {
  const { user } = useContext(AuthContext);
  const { tests, loading, fetchTests } = useLab();

  const pending = tests.filter(t => t.status !== "done");
  const done    = tests.filter(t => t.status === "done");

  return (
    <Container fluid className="py-4 px-md-5 bg-light min-vh-100">

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 bg-white p-4 rounded-4 shadow-sm">
        <div>
          <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <Microscope className="text-primary" size={26} /> Lab Technician Dashboard
          </h2>
          <p className="text-muted mb-0 small">
            Welcome, <strong>{user?.name}</strong> · Smart Pathology Lab
          </p>
        </div>
        <Button
          variant="light"
          className="rounded-pill px-3 py-2 d-flex align-items-center fw-bold text-muted border shadow-sm"
          onClick={fetchTests}
          disabled={loading}
        >
          <RefreshCw size={16} className={`me-2 ${loading ? "spin" : ""}`} />
          {loading ? "Syncing…" : "Refresh"}
        </Button>
      </div>

      {/* Stats */}
      <Row className="g-4 mb-4">
        {[
          { label: "Total Tests", value: tests.length, icon: <FlaskConical size={22} />, color: "primary", bg: "rgba(13,110,253,0.1)" },
          { label: "Pending",     value: pending.length, icon: <Clock size={22} />,       color: "warning", bg: "rgba(255,193,7,0.1)" },
          { label: "Completed",   value: done.length,    icon: <CheckCircle size={22} />, color: "success", bg: "rgba(25,135,84,0.1)" },
        ].map((s, i) => (
          <Col key={i} xs={12} sm={6} lg={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="rounded-3 p-3" style={{ backgroundColor: s.bg, color: `var(--bs-${s.color})` }}>
                    {s.icon}
                  </div>
                </div>
                <h6 className="text-uppercase small fw-bold text-muted mb-1">{s.label}</h6>
                <h2 className="display-6 fw-bold mb-0 text-dark">{s.value}</h2>
              </Card.Body>
              <div className={`h-1 bg-${s.color} opacity-50`} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pending Tests Overview */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <Card.Header className="bg-white border-0 px-4 pt-3 pb-2 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <Clock className="text-warning" size={18} /> Pending Tests
            <Badge bg="warning" text="dark" className="rounded-pill ms-2">{pending.length}</Badge>
          </h5>
          <Link to="/laboratory-panel" className="btn btn-primary btn-sm rounded-pill px-4 fw-bold border-0">
            Open Lab Panel →
          </Link>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light">
                <tr className="text-uppercase text-muted fw-bold" style={{ fontSize: "11px" }}>
                  <th className="px-4 py-3">Patient</th>
                  <th className="py-3">Test</th>
                  <th className="py-3">Ordered By</th>
                  <th className="py-3">Date</th>
                  <th className="py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-5 text-muted">No pending tests. All clear!</td></tr>
                ) : pending.slice(0, 10).map(t => (
                  <tr key={t.id} className="border-bottom border-light">
                    <td className="px-4 py-3">
                      <div className="fw-bold text-dark" style={{ fontSize: "14px" }}>{t.patient_name || "—"}</div>
                      <div className="text-muted" style={{ fontSize: "11px" }}>{t.cnic || ""}</div>
                    </td>
                    <td className="py-3 fw-medium">{t.test_name || "—"}</td>
                    <td className="py-3 small text-muted">{t.doctor_name || "—"}</td>
                    <td className="py-3 small text-muted">{t.date ? new Date(t.date).toLocaleDateString("en-PK") : "—"}</td>
                    <td className="py-3 text-center">
                      <Link
                        to="/laboratory-panel"
                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                        style={{ fontSize: "11px" }}
                      >
                        Process
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
        .spin { animation: rotate 1s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .h-1 { height: 4px; }
      `}</style>
    </Container>
  );
}
