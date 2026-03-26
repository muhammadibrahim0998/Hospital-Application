import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLab } from "../context/LabContext";
import { 
  FlaskConical, 
  ClipboardList, 
  User, 
  IdCard, 
  Info, 
  ArrowRight, 
  Search, 
  CheckCircle, 
  Zap, 
  Activity,
  History,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Button, Card, Form, Row, Col, Badge, Container, Table } from "react-bootstrap";

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
      navigate("/laboratory-panel");
    } catch (err) {
      console.error("Redirection or test addition failed:", err);
    }
  };

  return (
    <div className="doctor-lab-slim min-vh-100 py-3 py-md-4 px-md-4 bg-slate-50">
      {/* Ultra-Compact Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 p-3 bg-white rounded-4 shadow-sm border border-light overflow-hidden position-relative">
        <div className="d-flex align-items-center gap-3 z-index-2">
          <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary shadow-sm border border-primary border-opacity-10">
            <FlaskConical size={22} />
          </div>
          <div>
            <h5 className="fw-black mb-0 text-dark h6 tracking-tight">CLINICAL REQUISITION</h5>
            <div className="d-flex align-items-center gap-2 opacity-75 fw-bold text-muted" style={{ fontSize: '8px', letterSpacing: '0.5px' }}>
              <Zap size={10} className="text-primary" /> AUTHORIZE INVESTIGATIONS INSTANTLY
            </div>
          </div>
        </div>
        <Button variant="outline-dark" size="sm" className="rounded-pill px-3 fw-black border-2 d-flex align-items-center gap-2" style={{ fontSize: '10px' }} onClick={() => navigate("/lab-results")}>
          <History size={14} /> ARCHIVE LOG
        </Button>
      </div>

      <Row className="g-3">
        {/* Requisition Form - Compact */}
        <Col lg={7}>
          <Card className="border-0 shadow-2xl rounded-5 overflow-hidden border">
            <Card.Header className="bg-dark text-white p-3 border-0 d-flex align-items-center gap-2">
              <ShieldCheck size={16} className="text-primary" />
              <h6 className="mb-0 fw-black text-uppercase tracking-wide" style={{ fontSize: '10px' }}>New Lab Order</h6>
            </Card.Header>
            <Card.Body className="p-3">
              <Form onSubmit={handleAddTest}>
                <Row className="g-2">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-black text-muted text-uppercase mb-1" style={{ fontSize: '8px' }}>Patient Identity</Form.Label>
                      <Form.Control
                        className="border-0 bg-slate-50 rounded-3 py-2 px-3 fw-bold text-dark shadow-none border-focus"
                        style={{ fontSize: '12px' }}
                        placeholder="John Doe"
                        value={form.patient_name}
                        onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-black text-muted text-uppercase mb-1" style={{ fontSize: '8px' }}>CNIC / Passport</Form.Label>
                      <Form.Control
                        className="border-0 bg-slate-50 rounded-3 py-2 px-3 fw-bold text-dark shadow-none border-focus"
                        style={{ fontSize: '12px' }}
                        placeholder="00000-0000000-0"
                        value={form.cnic}
                        onChange={(e) => setForm({ ...form, cnic: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-black text-muted text-uppercase mb-1" style={{ fontSize: '8px' }}>Investigation Required</Form.Label>
                      <Form.Control
                        className="border-0 bg-slate-50 rounded-3 py-2 px-3 fw-black text-primary shadow-none border-focus"
                        style={{ fontSize: '13px' }}
                        placeholder="e.g. CBC, Liver Function Test, Lipid Profile"
                        value={form.test_name}
                        onChange={(e) => setForm({ ...form, test_name: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-black text-muted text-uppercase mb-1" style={{ fontSize: '8px' }}>Clinical Indications / Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        className="border-0 bg-slate-50 rounded-4 py-2 px-3 fw-bold text-muted shadow-none border-focus"
                        style={{ fontSize: '11px' }}
                        placeholder="Add specific instructions for the technician..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-black text-muted text-uppercase mb-1" style={{ fontSize: '8px' }}>Departmental Class</Form.Label>
                    <Form.Select
                      className="border-0 bg-slate-50 rounded-3 py-2 px-3 fw-bold text-dark shadow-none border-focus"
                      style={{ fontSize: '11px' }}
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="">General</option>
                      <option value="Hematology">Hematology</option>
                      <option value="Biochemistry">Biochemistry</option>
                      <option value="Microbiology">Microbiology</option>
                      <option value="Imaging">Radiology/Imaging</option>
                    </Form.Select>
                  </Col>
                  <Col md={6} className="d-flex align-items-end">
                    <Button type="submit" variant="primary" className="w-100 py-2 rounded-pill fw-black shadow-lg border-0 btn-premium-sky d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '11px' }}>
                      CONFIRM ORDER <ChevronRight size={16} />
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Status Tracker Sidebar */}
        <Col lg={5}>
          <Card className="border-0 shadow-2xl rounded-5 overflow-hidden border h-100 bg-white">
            <Card.Header className="bg-primary bg-opacity-5 p-3 border-0">
               <h6 className="fw-black text-primary text-uppercase mb-0 tracking-tight" style={{ fontSize: '10px' }}><Activity size={14} className="me-2" /> Recent Diagnostics Trace</h6>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover borderless className="align-middle mb-0 slim-table">
                  <thead className="bg-slate-50 text-muted text-uppercase fw-black" style={{ fontSize: '7.5px' }}>
                    <tr>
                      <th className="px-3 py-2">Patient</th>
                      <th className="py-2">Investigation</th>
                      <th className="py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tests.length === 0 ? (
                      <tr><td colSpan={3} className="text-center py-4 text-muted small fw-bold">No active orders.</td></tr>
                    ) : (
                      tests.slice(-6).reverse().map(t => (
                        <tr key={t.id} className="border-bottom border-light transition-all hover-lift-subtle">
                          <td className="px-3 py-2">
                            <div className="fw-black text-dark" style={{ fontSize: '10.5px' }}>{t.patient_name}</div>
                            <div className="text-muted fw-bold" style={{ fontSize: '7px' }}>#{t.id}</div>
                          </td>
                          <td className="py-2">
                            <div className="fw-bold text-dark" style={{ fontSize: '10px' }}>{t.test_name}</div>
                          </td>
                          <td className="py-2 text-center">
                            <Badge bg={t.status === "done" ? "success" : "warning"} className="bg-opacity-10 text-success fw-black rounded-1 border-0" style={{ fontSize: '6.5px', padding: '4px 8px' }}>
                              {t.status.toUpperCase()}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
              <div className="p-3 bg-slate-50 border-top mt-auto">
                 <div className="d-flex align-items-start gap-2">
                    <Info size={14} className="text-primary mt-1" />
                    <p className="small text-muted fw-bold mb-0" style={{ fontSize: '9px' }}>
                       Orders move instantly to the technician worklist. Results will appear in your clinical log once verified.
                    </p>
                 </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .doctor-lab-slim { font-family: 'Inter', sans-serif; }
        .fw-black { font-weight: 900; }
        .tracking-tight { letter-spacing: -0.5px; }
        .bg-slate-50 { background-color: #f8fafc; }
        .shadow-2xl { box-shadow: 0 15px 35px -12px rgba(0, 0, 0, 0.08); }
        
        .border-focus:focus { 
          background: white !important; 
          border: 1px solid #0d6efd !important; 
          box-shadow: 0 0 0 2px rgba(13,110,253,0.05) !important;
        }

        .slim-table thead th { border: none !important; }
        .slim-table tbody tr:hover { background-color: rgba(13,110,253,0.01) !important; }
        .hover-lift-subtle:hover { transform: translateY(-1px); }
        
        .btn-premium-sky {
          background: linear-gradient(135deg, #0d6efd 0%, #0d5be1 100%);
          letter-spacing: 0.3px;
        }
      `}</style>
    </div>
  );
}
