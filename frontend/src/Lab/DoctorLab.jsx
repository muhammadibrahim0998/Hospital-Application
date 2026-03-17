import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLab } from "../context/LabContext";
import { FlaskConical, ClipboardList, User, IdCard, Info, ArrowRight, Search, CheckCircle } from "lucide-react";
import { Button, Card, Form, Row, Col, Badge, Container } from "react-bootstrap";

export default function DoctorLab() {
  const { tests, addTest } = useLab();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    patient_name: "",
    patient_id: "",
    appointment_id: "",
    cnic: "",
    test_name: "",
    description: "",
    normal_range: "",
    price: "",
    category: "",
  });

  // Dynamic pre-population from state (e.g. from appointment list)
  useEffect(() => {
    if (location.state) {
      const { patient_name, cnic, patient_id, appointment_id } = location.state;
      setForm(prev => ({
        ...prev,
        patient_name: patient_name || prev.patient_name,
        cnic: location.state?.cnic || prev.cnic,
        patient_id: patient_id || prev.patient_id,
        appointment_id: appointment_id || prev.appointment_id
      }));
    }
  }, [location.state]);

  const handleAddTest = async (e) => {
    e.preventDefault();
    if (!form.patient_name || !form.test_name) return;
    try {
      await addTest(form);
      setForm({
        patient_name: "",
        patient_id: "",
        appointment_id: "",
        cnic: "",
        test_name: "",
        description: "",
        normal_range: "",
        price: "",
        category: "",
      });
      // Redirect to worklist to see status
      navigate("/laboratory-panel");
    } catch (err) {
      console.error("Redirection or test addition failed:", err);
    }
  };

  return (
    <Container fluid className="py-4 px-md-5 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 bg-white p-4 rounded-4 shadow-sm border-start border-4 border-primary">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary bg-opacity-10 p-3 rounded-3">
            <ClipboardList className="text-primary" size={26} />
          </div>
          <div>
            <h4 className="fw-bold mb-0 text-dark">Lab Requisition Portal</h4>
            <p className="text-muted mb-0 small">Authorize clinical investigations for patients</p>
          </div>
        </div>
        <Button variant="outline-primary" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => navigate("/lab-results")}>
          View Past Reports
        </Button>
      </div>

      <Row className="g-4">
        {/* Reservation Form */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-primary text-white p-4 border-0">
              <h5 className="mb-0 d-flex align-items-center gap-2">
                <FlaskConical size={20} /> New Lab Order
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleAddTest}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase">
                        <User size={14} className="me-1" /> Patient Name
                      </Form.Label>
                      <Form.Control
                        className="border-0 bg-light rounded-3 p-3 shadow-none focus-primary"
                        placeholder="Full name"
                        value={form.patient_name}
                        onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase">
                        <IdCard size={14} className="me-1" /> CNIC / ID
                      </Form.Label>
                      <Form.Control
                        className="border-0 bg-light rounded-3 p-3 shadow-none"
                        placeholder="00000-0000000-0"
                        value={form.cnic}
                        onChange={(e) => setForm({ ...form, cnic: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase">
                        <Search size={14} className="me-1" /> Test Name / Investigation
                      </Form.Label>
                      <Form.Control
                        className="border-0 bg-light rounded-3 p-3 shadow-none"
                        placeholder="e.g. CBC, Lipid Profile, Chest X-Ray"
                        value={form.test_name}
                        onChange={(e) => setForm({ ...form, test_name: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase">
                        <Info size={14} className="me-1" /> Clinical Notes
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        className="border-0 bg-light rounded-3 p-3 shadow-none"
                        placeholder="Urgent, fasting required, etc."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="small fw-bold text-muted text-uppercase">Category</Form.Label>
                    <Form.Select
                      className="border-0 bg-light rounded-3 p-3 shadow-none"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      <option value="Blood">Blood</option>
                      <option value="Urine">Urine</option>
                      <option value="Imaging">Imaging</option>
                      <option value="Special">Special Investigation</option>
                    </Form.Select>
                  </Col>
                  <Col md={6} className="d-flex align-items-end">
                    <Button type="submit" variant="primary" className="w-100 py-3 rounded-pill fw-bold shadow border-0">
                      AUTHORIZE TEST <ArrowRight size={18} className="ms-2" />
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Help / Recent Info */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 bg-primary text-white h-100 p-2">
            <Card.Body className="d-flex flex-column justify-content-center text-center">
              <div className="bg-white bg-opacity-20 rounded-circle p-4 mx-auto mb-4" style={{ width: "fit-content" }}>
                <FlaskConical size={48} />
              </div>
              <h4 className="fw-bold mb-3">Seamless Workflow</h4>
              <p className="small opacity-75 mb-4">
                Once authorized, tests appear instantly on the Lab Technician's worklist. After results are entered, you can prescribe medication directly on the dashboard.
              </p>
              <div className="bg-white bg-opacity-10 p-3 rounded-4 text-start">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-info" />
                  <span className="small fw-bold">Live Status Tracking</span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-info" />
                  <span className="small fw-bold">Digital Medication Advice</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle size={16} className="text-info" />
                  <span className="small fw-bold">Instant Sharing via WhatsApp</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* History Table Snippet */}
      <h5 className="fw-bold mt-5 mb-3 text-dark">Recent Diagnostics State</h5>
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table hover align-middle mb-0">
            <thead className="bg-white">
              <tr className="text-muted small fw-bold">
                <th className="px-4 py-3">PATIENT</th>
                <th className="py-3">TEST</th>
                <th className="py-3 text-center">STATUS</th>
                <th className="py-3">LAB FINDINGS</th>
              </tr>
            </thead>
            <tbody>
              {tests.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-4 text-muted">Awaiting first requisition...</td></tr>
              ) : (
                tests.slice(-5).reverse().map(t => (
                  <tr key={t.id} className="border-top">
                    <td className="px-4 py-3">
                      <div className="fw-bold text-dark">{t.patient_name}</div>
                      <div className="text-muted small" style={{ fontSize: "10px" }}>{t.cnic || "No ID"}</div>
                    </td>
                    <td className="py-3 fw-medium">{t.test_name}</td>
                    <td className="py-3 text-center">
                      <Badge bg={t.status === "done" ? "success" : "warning"} text={t.status === "done" ? "" : "dark"} className="rounded-pill px-3">
                        {t.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3">
                      {t.result ? (
                        <span className="text-primary fw-bold small">{t.result}</span>
                      ) : (
                        <span className="text-muted small fst-italic">Pending...</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <style>{`
        .focus-primary:focus { background: white !important; border: 1px solid #0d6efd !important; }
      `}</style>
    </Container>
  );
}
