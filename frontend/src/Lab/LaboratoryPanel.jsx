import React, { useState, useContext } from "react";
import { useLab } from "../context/LabContext";
import { AuthContext } from "../context/AuthContext";
import { Container, Card, Table, Badge, Button, Modal, Form } from "react-bootstrap";
import { FlaskConical, CheckCircle, Clock, Search, Microscope } from "lucide-react";

export default function LaboratoryPanel() {
  const { tests, performTest, fetchTests } = useLab();
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [resultInput, setResultInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pendingTests = tests.filter((t) => t.status !== "done");
  const doneTests = tests.filter((t) => t.status === "done");

  const filtered = (activeTab === "pending" ? pendingTests : doneTests).filter(t =>
    (t.patient_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.test_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openResultModal = (test) => {
    setSelectedTest(test);
    setResultInput("");
    setShowModal(true);
  };

  const handlePerform = async () => {
    if (!resultInput.trim()) return alert("Please enter the result/finding.");
    setSubmitting(true);
    try {
      await performTest(selectedTest.id, resultInput.trim());
      setShowModal(false);
      setResultInput("");
      setSelectedTest(null);
      await fetchTests();
    } catch (err) {
      alert("Error submitting result. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid className="py-4 px-md-5 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 bg-white p-4 rounded-4 shadow-sm border-start border-4 border-primary">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary bg-opacity-10 p-3 rounded-3">
            <Microscope className="text-primary" size={26} />
          </div>
          <div>
            <h4 className="fw-bold mb-0 text-dark">Lab Worklist Panel</h4>
            <p className="text-muted mb-0 small">
              {user?.name} · <span className="text-capitalize fw-bold">{user?.role?.replace("_", " ")}</span>
            </p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
          <Badge bg="warning" text="dark" className="rounded-pill px-3 py-2 fw-bold">
            <Clock size={13} className="me-1" />{pendingTests.length} Pending
          </Badge>
          <Badge bg="success" className="rounded-pill px-3 py-2 fw-bold">
            <CheckCircle size={13} className="me-1" />{doneTests.length} Completed
          </Badge>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div className="d-flex gap-2">
          <Button
            variant={activeTab === "pending" ? "primary" : "outline-secondary"}
            size="sm"
            className="rounded-pill px-4 fw-bold"
            onClick={() => setActiveTab("pending")}
          >
            Pending Tests
          </Button>
          <Button
            variant={activeTab === "done" ? "success" : "outline-secondary"}
            size="sm"
            className="rounded-pill px-4 fw-bold"
            onClick={() => setActiveTab("done")}
          >
            Completed
          </Button>
        </div>
        <div className="position-relative" style={{ width: "220px" }}>
          <Search className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" size={14} />
          <Form.Control
            size="sm"
            placeholder="Search patient or test..."
            className="ps-4 border-0 bg-white rounded-pill shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tests Table */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light">
                <tr className="text-uppercase text-muted fw-bold" style={{ fontSize: "11px" }}>
                  <th className="px-4 py-3">#</th>
                  <th className="py-3">Patient</th>
                  <th className="py-3">Test</th>
                  <th className="py-3">Ordered By</th>
                  <th className="py-3">Date</th>
                  <th className="py-3 text-center">Status</th>
                  {activeTab === "done" && <th className="py-3">Result</th>}
                  {activeTab === "pending" && <th className="py-3 text-center">Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      <FlaskConical size={32} className="mb-2 opacity-25" /><br />
                      {activeTab === "pending" ? "No pending tests. All clear!" : "No completed tests yet."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((t, i) => (
                    <tr key={t.id} className="border-bottom border-light">
                      <td className="px-4 py-3 text-muted small">#{i + 1}</td>
                      <td className="py-3">
                        <div className="fw-bold text-dark" style={{ fontSize: "14px" }}>{t.patient_name || "—"}</div>
                        <div className="text-muted" style={{ fontSize: "11px" }}>{t.cnic || ""}</div>
                      </td>
                      <td className="py-3">
                        <span className="fw-medium text-dark">{t.test_name || "—"}</span>
                        {t.category && (
                          <div><Badge bg="secondary" className="bg-opacity-10 text-secondary border-0 fw-normal" style={{ fontSize: "9px" }}>{t.category}</Badge></div>
                        )}
                      </td>
                      <td className="py-3 small text-muted">{t.doctor_name || "—"}</td>
                      <td className="py-3 small text-muted">
                        {t.date ? new Date(t.date).toLocaleDateString("en-PK") : "—"}
                      </td>
                      <td className="py-3 text-center">
                        <Badge
                          bg={t.status === "done" ? "success" : "warning"}
                          text={t.status === "done" ? undefined : "dark"}
                          className="rounded-pill px-3 py-1 fw-bold"
                          style={{ fontSize: "10px" }}
                        >
                          {t.status === "done" ? "✓ Done" : "⏳ Pending"}
                        </Badge>
                      </td>
                      {activeTab === "done" && (
                        <td className="py-3">
                          <span className="fw-bold text-primary">{t.result || "—"}</span>
                        </td>
                      )}
                      {activeTab === "pending" && (
                        <td className="py-3 text-center">
                          <Button
                            variant="primary"
                            size="sm"
                            className="rounded-pill px-3 fw-bold border-0 shadow-sm"
                            style={{ fontSize: "11px" }}
                            onClick={() => openResultModal(t)}
                          >
                            Enter Result
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

      {/* Enter Result Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 bg-primary text-white p-4">
          <Modal.Title className="fw-bold h6 mb-0">
            <FlaskConical className="me-2" size={18} />Enter Lab Result
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 bg-light">
          {selectedTest && (
            <>
              <div className="bg-white p-3 rounded-3 mb-3 border-start border-4 border-primary shadow-sm">
                <div className="fw-bold text-dark">{selectedTest.test_name}</div>
                <div className="small text-muted">Patient: <strong>{selectedTest.patient_name}</strong></div>
                {selectedTest.normal_range && (
                  <div className="small text-muted">Normal Range: <span className="text-success fw-bold">{selectedTest.normal_range}</span></div>
                )}
              </div>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase">Result / Findings</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className="border-0 shadow-sm rounded-4 bg-white"
                  style={{ fontSize: '14px' }}
                  placeholder="e.g. 95 mg/dL — Normal Range (Reference: 70-110)"
                  value={resultInput}
                  onChange={e => setResultInput(e.target.value)}
                />
              </Form.Group>
              <div className="mt-2 small text-muted fst-italic">
                <Info size={12} className="me-1" /> Results are automatically synced with the physician's dashboard.
              </div>
              <Button
                variant="primary"
                className="w-100 py-3 rounded-pill fw-bold mt-3 border-0 shadow"
                onClick={handlePerform}
                disabled={submitting || !resultInput.trim()}
              >
                {submitting ? "Submitting..." : "✓ Submit Result"}
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>

      <style>{`
        .table-hover tbody tr:hover { background: rgba(13,110,253,0.03) !important; }
      `}</style>
    </Container>
  );
}
