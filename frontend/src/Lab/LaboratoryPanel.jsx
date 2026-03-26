import React, { useState, useContext, useMemo, useEffect } from "react";
import { useLab } from "../context/LabContext";
import { AuthContext } from "../context/AuthContext";
import { Container, Card, Table, Badge, Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import { 
  FlaskConical, 
  CheckCircle, 
  Clock, 
  Search, 
  Microscope, 
  Info, 
  ClipboardList, 
  User, 
  Calendar, 
  ExternalLink,
  Filter,
  Zap,
  Activity
} from "lucide-react";

export default function LaboratoryPanel() {
  const { tests, performTest, fetchTests } = useLab();
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [resultInput, setResultInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const pendingTests = useMemo(() => tests.filter((t) => t.status !== "done"), [tests]);
  const doneTests = useMemo(() => tests.filter((t) => t.status === "done"), [tests]);

  const filtered = useMemo(() => {
    const list = activeTab === "pending" ? pendingTests : doneTests;
    return list.filter(t =>
      (t.patient_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.test_name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeTab, pendingTests, doneTests, searchTerm]);

  const openResultModal = (test) => {
    setSelectedTest(test);
    setResultInput("");
    setShowModal(true);
  };

  const handlePerform = async () => {
    if (!resultInput.trim()) return;
    setSubmitting(true);
    try {
      await performTest(selectedTest.id, resultInput.trim());
      setShowModal(false);
      setResultInput("");
      setSelectedTest(null);
      await fetchTests();
    } catch (err) {
      alert("Error submitting result.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid className="lab-panel-ultra-slim py-2 py-md-3 px-md-4">
      {/* Ultra-Compact Header */}
      <div className="compact-header mb-3 p-3 rounded-4 shadow-sm bg-white position-relative overflow-hidden border">
        <div className="header-bg-accent"></div>
        <Row className="align-items-center g-2 position-relative">
          <Col md={7}>
            <div className="d-flex align-items-center gap-3">
              <div className="icon-box bg-dark text-primary p-2 rounded-3 shadow-lg">
                <Microscope size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="fw-black mb-0 tracking-tight text-dark h5" style={{ fontSize: '1.2rem' }}>Clinical Worklist</h3>
                <div className="d-flex align-items-center gap-2 mt-0">
                   <div className="d-flex align-items-center gap-1 text-muted fw-bold" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>
                     OFFICER: <span className="text-primary">{user?.name?.toUpperCase()}</span>
                   </div>
                   <div className="d-flex align-items-center gap-1 text-success fw-bold" style={{ fontSize: '9px' }}>
                      <Activity size={10} /> SYSTEM ACTIVE
                   </div>
                </div>
              </div>
            </div>
          </Col>
          <Col md={5} className="text-md-end">
            <div className="d-inline-flex gap-2">
              <Badge bg="warning" className="bg-opacity-10 text-warning px-2 py-1 rounded-1 border-0 fw-black d-flex align-items-center gap-1" style={{ fontSize: '8px' }}>
                <Clock size={10} /> {pendingTests.length} PENDING
              </Badge>
              <Badge bg="success" className="bg-opacity-10 text-success px-2 py-1 rounded-1 border-0 fw-black d-flex align-items-center gap-1" style={{ fontSize: '8px' }}>
                <CheckCircle size={10} /> {doneTests.length} VERIFIED
              </Badge>
            </div>
          </Col>
        </Row>
      </div>

      {/* Ultra-Compact Controls */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2">
        <div className="tab-group bg-white p-1 rounded-3 d-flex border shadow-sm" style={{ maxHeight: '35px' }}>
          <button
            className={`tab-btn px-3 py-1 rounded-2 border-0 transition-all ${activeTab === "pending" ? "bg-primary text-white shadow-sm fw-black" : "bg-transparent text-muted small fw-bold"}`}
            style={{ fontSize: '10px' }}
            onClick={() => setActiveTab("pending")}
          >
            ACTIVE QUEUE
          </button>
          <button
            className={`tab-btn px-3 py-1 rounded-2 border-0 transition-all ${activeTab === "done" ? "bg-success text-white shadow-sm fw-black" : "bg-transparent text-muted small fw-bold"}`}
            style={{ fontSize: '10px' }}
            onClick={() => setActiveTab("done")}
          >
            ARCHIVE
          </button>
        </div>
        
        <InputGroup className="shadow-sm rounded-pill overflow-hidden border border-light" style={{ maxWidth: '200px' }}>
          <InputGroup.Text className="bg-white border-0 ps-3">
            <Search size={14} className="text-muted" />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search..."
            className="border-0 bg-white py-1 fw-medium shadow-none"
            style={{ fontSize: '11px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      {/* Ultra-Compact Table */}
      <Card className="border-0 shadow-2xl rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover borderless className="align-middle mb-0 slim-table">
              <thead>
                <tr className="bg-slate-50 text-muted text-uppercase fw-black border-bottom border-light" style={{ fontSize: '8px', letterSpacing: '1px' }}>
                   <th className="py-2 px-4" style={{ width: '50px' }}>NO</th>
                   <th className="py-2">PATIENT IDENTITY</th>
                   <th className="py-2">INVESTIGATION</th>
                   <th className="py-2">REFERRAL MD</th>
                   <th className="py-2 text-center">STATUS</th>
                   {activeTab === "done" ? <th className="py-2 text-center">RESULT</th> : <th className="py-2 text-end px-4">ACTION</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <div className="opacity-20 mb-2">
                        <ClipboardList size={40} className="mx-auto" />
                      </div>
                      <h6 className="fw-black text-dark">Queue Empty</h6>
                    </td>
                  </tr>
                ) : (
                  filtered.map((t, i) => (
                    <tr key={t.id} className="border-bottom border-light transition-all hover-lift">
                      <td className="px-4 py-2 text-muted fw-bold" style={{ fontSize: '10px' }}>{String(i + 1).padStart(2, '0')}</td>
                      <td className="py-2">
                        <div className="fw-black text-dark" style={{ fontSize: '11.5px' }}>{t.patient_name?.toUpperCase() || "NAME"}</div>
                        <div className="text-muted fw-bold opacity-75" style={{ fontSize: '8.5px' }}>PID: {t.patient_id || "555"} • CNIC: {t.cnic || "—"}</div>
                      </td>
                      <td className="py-2">
                        <div className="fw-bold text-dark" style={{ fontSize: '11px' }}>{t.test_name}</div>
                        <div className="text-muted fw-bold opacity-75" style={{ fontSize: '8px', letterSpacing: '0.5px' }}>{t.category?.toUpperCase() || "GENERAL"}</div>
                      </td>
                      <td className="py-2">
                        <div className="small fw-black text-dark mb-0 d-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                          DR. {t.doctor_name?.toUpperCase() || "PRACTITIONER"}
                        </div>
                      </td>
                      <td className="py-2 text-center">
                        <Badge
                          bg={t.status === "done" ? "success" : "warning"}
                          className={`bg-opacity-10 text-${t.status === 'done' ? 'success' : 'warning'} fw-black rounded-1 border-0`}
                          style={{ fontSize: '7.5px' }}
                        >
                          {t.status === "done" ? "VERIFIED" : "PENDING"}
                        </Badge>
                      </td>
                      {activeTab === "done" ? (
                        <td className="py-2 text-center">
                          <div className="value-label d-inline-block px-3 py-1 rounded-pill fw-black text-white" style={{ fontSize: '11px', background: '#0d6efd', minWidth: '50px' }}>
                            {t.result}
                          </div>
                        </td>
                      ) : (
                        <td className="py-2 text-end px-4">
                          <Button
                            variant="primary"
                            size="sm"
                            className="rounded-pill px-3 py-1 fw-black border-0 shadow-lg btn-premium-sky"
                            style={{ fontSize: '8.5px' }}
                            onClick={() => openResultModal(t)}
                          >
                            ENTER DATA
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Slim Result Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="sm">
        <Modal.Header closeButton className="border-0 bg-dark text-white p-3">
          <Modal.Title className="fw-black text-uppercase letter-spacing-2 h6 mb-0" style={{ fontSize: '11px' }}>
            <FlaskConical className="me-2 text-primary" size={16} /> DATA ENTRY PROTOCOL
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3 bg-light">
          {selectedTest && (
            <>
              <div className="bg-white p-3 rounded-3 mb-3 border shadow-sm">
                <Badge bg="primary" className="mb-1 rounded-0 fw-bold" style={{ fontSize: '7.5px' }}>DIAGNOSTICS</Badge>
                <h6 className="fw-black text-dark mb-0 h6">{selectedTest.test_name}</h6>
                <p className="text-muted fw-bold mb-0" style={{ fontSize: '8px' }}>CLIENT: {selectedTest.patient_name?.toUpperCase()}</p>
              </div>
              
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={2}
                  className="border-0 shadow-inner rounded-3 p-2 fw-black text-dark"
                  style={{ fontSize: '13px', backgroundColor: '#fff' }}
                  placeholder="RESULT VALUE"
                  value={resultInput}
                  onChange={e => setResultInput(e.target.value)}
                  autoFocus
                />
              </Form.Group>
              
              <Button
                variant="primary"
                className="w-100 py-2 rounded-pill fw-black border-0 shadow-lg btn-premium-sky"
                style={{ fontSize: '10px' }}
                onClick={handlePerform}
                disabled={submitting || !resultInput.trim()}
              >
                {submitting ? "PUBLISHING..." : "VERIFY & PUBLISH"}
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .lab-panel-ultra-slim { font-family: 'Inter', sans-serif; background-color: #f1f5f9; }
        .fw-black { font-weight: 900; }
        .tracking-tight { letter-spacing: -0.5px; }
        .bg-slate-50 { background-color: #f8fafc; }
        
        .header-bg-accent {
          position: absolute; top: -30px; right: -30px;
          width: 100px; height: 100px;
          background: radial-gradient(circle, rgba(13,110,253,0.05) 0%, transparent 70%);
        }
        
        .slim-table thead th { border: none !important; }
        .slim-table tbody tr:hover { background-color: rgba(13,110,253,0.01) !important; }
        
        .btn-premium-sky {
          background: linear-gradient(135deg, #0d6efd 0%, #0d5be1 100%);
          letter-spacing: 0.3px;
        }
        
        .shadow-2xl { box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08); }
        .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05); }
        
        .hover-lift:hover { transform: translateY(-1.5px); }
      `}</style>
    </Container>
  );
}
