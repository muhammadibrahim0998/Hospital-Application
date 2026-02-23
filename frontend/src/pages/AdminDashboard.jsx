import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDoctors } from "../context/DoctorContext";
import { API_BASE_URL } from "../config";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Badge,
  Alert,
  Tabs,
  Tab,
  Modal,
} from "react-bootstrap";
import {
  Users,
  UserPlus,
  Calendar,
  FlaskConical,
  Activity,
  ShieldCheck,
  RefreshCw,
  MoreVertical,
  UserCheck,
  UserCheck2,
  UserX,
  Settings,
  Edit,
  Trash2
} from "lucide-react";

const AdminDashboard = () => {
  const { doctors: ctxDoctors, updateDoctor, removeDoctor, addDoctor, toggleStatus, fetchDoctors: refreshDoctors } = useDoctors();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [labStats, setLabStats] = useState({ total: 0, pending: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    contact_info: "",
    image: null,
    departmentId: 1,
    fieldId: 1,
    phone: "",
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pats, apps, labs] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/admin/patients`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/appointments`, { headers }),
        axios.get(`${API_BASE_URL}/api/lab/tests`, { headers }),
      ]);

      if (pats.status === "fulfilled") setPatients(pats.value.data);
      if (apps.status === "fulfilled") setAppointments(apps.value.data);

      if (labs.status === "fulfilled") {
        const total = labs.value.data?.length || 0;
        const pending =
          labs.value.data?.filter((t) => t.status !== "done").length || 0;
        setLabStats({ total, pending });
      }
      await refreshDoctors();
    } catch (err) {
      console.error("Error fetching admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newDoctor).forEach((key) => {
      formData.append(key, newDoctor[key]);
    });

    await addDoctor(formData);
    setShowAddModal(false);
    setNewDoctor({ name: "", email: "", password: "", specialization: "", contact_info: "", image: null, departmentId: 1, fieldId: 1, phone: "" });
  };

  const handleEditDoctor = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("specialization", editingDoctor.specialization);
    formData.append("contact_info", editingDoctor.contact_info);
    formData.append("departmentId", editingDoctor.department_id);
    formData.append("fieldId", editingDoctor.field_id);
    formData.append("phone", editingDoctor.phone);
    if (editingDoctor.imageFile) {
      formData.append("image", editingDoctor.imageFile);
    }

    await updateDoctor(editingDoctor.id, formData);
    setShowEditModal(false);
    setEditingDoctor(null);
  };

  const stats = [
    { label: "Providers", val: ctxDoctors.length, icon: <UserCheck2 size={24} />, color: "primary", bg: "rgba(13, 110, 253, 0.1)" },
    { label: "Patients", val: patients.length, icon: <Users size={24} />, color: "success", bg: "rgba(25, 135, 84, 0.1)" },
    { label: "Appointments", val: appointments.length, icon: <Calendar size={24} />, color: "info", bg: "rgba(13, 202, 240, 0.1)" },
    { label: "Lab Tests", val: labStats.total, icon: <FlaskConical size={24} />, color: "warning", bg: "rgba(255, 193, 7, 0.1)" },
  ];

  return (
    <Container fluid className="py-4 px-md-5 bg-light min-vh-100">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border-0">
        <div>
          <h2 className="fw-bold text-dark mb-1 d-flex align-items-center">
            <ShieldCheck className="text-primary me-2" /> Admin Dashboard
          </h2>
          <p className="text-muted mb-0">Manage healthcare providers, patients, and clinical operations.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="light" className="rounded-pill px-3 py-2 d-flex align-items-center fw-bold text-muted border shadow-sm" onClick={fetchData} disabled={loading}>
            <RefreshCw size={18} className={`me-2 ${loading ? "spin" : ""}`} /> {loading ? "Syncing..." : "Refresh"}
          </Button>
          <Button variant="primary" className="rounded-pill px-4 py-2 d-flex align-items-center fw-bold shadow-lg" onClick={() => setShowAddModal(true)}>
            <UserPlus size={18} className="me-2" /> Add Provider
          </Button>
        </div>
      </div>

      <Row className="g-4 mb-5">
        {stats.map((s, i) => (
          <Col key={i} xs={12} sm={6} lg={3}>
            <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden transform-hover-up transition-all">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="rounded-3 p-3" style={{ backgroundColor: s.bg, color: `var(--bs-${s.color})` }}>{s.icon}</div>
                  <Badge bg={s.color} className="rounded-pill px-2 py-1 opacity-75"><Activity size={12} className="me-1" /> View</Badge>
                </div>
                <h6 className="text-uppercase small fw-bold text-muted tracking-wider mb-1">{s.label}</h6>
                <h2 className="display-6 fw-bold mb-0 text-dark">{s.val}</h2>
              </Card.Body>
              <div className={`h-1 bg-${s.color} opacity-50`}></div>
            </Card>
          </Col>
        ))}
      </Row>

      <Tabs defaultActiveKey="providers" className="mb-4 custom-tabs border-0 bg-white p-2 rounded-pill shadow-sm d-inline-flex">
        <Tab eventKey="providers" title="Healthcare Providers" className="mt-3">
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="align-middle mb-0 custom-table">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3">PROVIDER</th>
                      <th className="py-3">SPECIALIZATION</th>
                      <th className="py-3">PHONE</th>
                      <th className="py-3">STATUS</th>
                      <th className="py-3 text-end px-4">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ctxDoctors.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <img src={doc.image ? `${API_BASE_URL}${doc.image}` : "https://img.icons8.com/color/96/doctor-male.png"} alt="Doctor" className="rounded-circle border" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                            <div>
                              <div className="fw-bold text-dark">{doc.name}</div>
                              <div className="small text-muted">{doc.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge bg="primary-subtle" className="text-primary px-3 py-2 rounded-pill fw-medium">{doc.specialization}</Badge>
                        </td>
                        <td className="py-3 text-muted small">{doc.phone || "N/A"}</td>
                        <td className="py-3">
                          <div className="form-check form-switch p-0 d-flex align-items-center gap-2">
                            <input className="form-check-input ms-0 shadow-none clickable" type="checkbox" role="switch" checked={doc.status === "active"} onChange={() => toggleStatus(doc.id, doc.status)} />
                            <span className={`small fw-bold ${doc.status === "active" ? "text-success" : "text-danger"}`}>{doc.status?.toUpperCase() || "ACTIVE"}</span>
                          </div>
                        </td>
                        <td className="py-3 text-end px-4">
                          <div className="d-flex justify-content-end gap-2">
                            <Button variant="light" size="sm" className="rounded-circle p-2 text-primary border-0 shadow-none" onClick={() => { setEditingDoctor(doc); setShowEditModal(true); }}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="light" size="sm" className="rounded-circle p-2 text-danger border-0 shadow-none" onClick={() => removeDoctor(doc.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Add Doctor Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered className="border-0">
        <Modal.Header closeButton className="border-0 bg-primary text-white p-4">
          <Modal.Title className="fw-bold"><UserPlus className="me-2" /> Register Provider</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 bg-light">
          <Form onSubmit={handleAddDoctor}>
            <Row className="g-3">
              <Col md={12}>
                <Form.Label className="small fw-bold text-muted mb-1 text-uppercase tracking-wider">Profile Picture</Form.Label>
                <Form.Control type="file" className="border-0 shadow-sm px-3 py-2 bg-white" accept="image/*" onChange={(e) => setNewDoctor({ ...newDoctor, image: e.target.files[0] })} required />
              </Col>
              <Col md={12}><Form.Label className="small fw-bold text-muted mb-1 text-uppercase tracking-wider">Full Name</Form.Label><Form.Control className="border-0 shadow-sm px-3 py-2 bg-white" placeholder="e.g. Dr. Sarah Jenkins" value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} required /></Col>
              <Col md={12}><Form.Label className="small fw-bold text-muted mb-1 text-uppercase tracking-wider">Email Address</Form.Label><Form.Control type="email" className="border-0 shadow-sm px-3 py-2 bg-white" placeholder="doctor@citycare.com" value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} required /></Col>
              <Col md={6}><Form.Label className="small fw-bold text-muted mb-1 text-uppercase tracking-wider">Access Password</Form.Label><Form.Control type="password" className="border-0 shadow-sm px-3 py-2 bg-white" placeholder="••••••••" value={newDoctor.password} onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })} required /></Col>
              <Col md={6}><Form.Label className="small fw-bold text-muted mb-1 text-uppercase tracking-wider">Specialization</Form.Label><Form.Control className="border-0 shadow-sm px-3 py-2 bg-white" placeholder="e.g. Cardiology" value={newDoctor.specialization} onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })} required /></Col>
              <Col md={12}><Form.Label className="small fw-bold text-muted mb-1 text-uppercase tracking-wider">Phone</Form.Label><Form.Control className="border-0 shadow-sm px-3 py-2 bg-white" placeholder="e.g. 03001234567" value={newDoctor.phone} onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value, contact_info: e.target.value })} required /></Col>
              <Col md={6}><Form.Label className="small fw-bold text-muted mb-1 text-uppercase tracking-wider">Dept ID</Form.Label><Form.Control type="number" className="border-0 shadow-sm px-3 py-2 bg-white" value={newDoctor.departmentId} onChange={(e) => setNewDoctor({ ...newDoctor, departmentId: e.target.value })} required /></Col>
              <Col md={6}><Form.Label className="small fw-bold text-muted mb-1 text-uppercase tracking-wider">Field ID</Form.Label><Form.Control type="number" className="border-0 shadow-sm px-3 py-2 bg-white" value={newDoctor.fieldId} onChange={(e) => setNewDoctor({ ...newDoctor, fieldId: e.target.value })} required /></Col>
            </Row>
            <Button type="submit" variant="primary" className="w-100 py-3 rounded-pill fw-bold shadow-lg mt-4">REGISTER CLINICAL PROVIDER</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered className="border-0">
        <Modal.Header closeButton className="border-0 bg-primary text-white p-4">
          <Modal.Title className="fw-bold"><Edit className="me-2" /> Edit Provider</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 bg-light">
          {editingDoctor && (
            <Form onSubmit={handleEditDoctor}>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Label className="small fw-bold text-muted mb-1 text-uppercase tracking-wider">Update Picture (Optional)</Form.Label>
                  <Form.Control type="file" className="border-0 shadow-sm px-3 py-2 bg-white" accept="image/*" onChange={(e) => setEditingDoctor({ ...editingDoctor, imageFile: e.target.files[0] })} />
                </Col>
                <Col md={12}><Form.Label className="small fw-bold text-muted mb-1 text-uppercase tracking-wider">Specialization</Form.Label><Form.Control className="border-0 shadow-sm px-3 py-2 bg-white" value={editingDoctor.specialization} onChange={(e) => setEditingDoctor({ ...editingDoctor, specialization: e.target.value })} required /></Col>
                <Col md={12}><Form.Label className="small fw-bold text-muted mb-1 text-uppercase tracking-wider">Phone</Form.Label><Form.Control className="border-0 shadow-sm px-3 py-2 bg-white" value={editingDoctor.phone} onChange={(e) => setEditingDoctor({ ...editingDoctor, phone: e.target.value, contact_info: e.target.value })} required /></Col>
                <Col md={6}><Form.Label className="small fw-bold text-muted mb-1 text-uppercase tracking-wider">Dept ID</Form.Label><Form.Control type="number" className="border-0 shadow-sm px-3 py-2 bg-white" value={editingDoctor.department_id} onChange={(e) => setEditingDoctor({ ...editingDoctor, department_id: e.target.value })} required /></Col>
                <Col md={6}><Form.Label className="small fw-bold text-muted mb-1 text-uppercase tracking-wider">Field ID</Form.Label><Form.Control type="number" className="border-0 shadow-sm px-3 py-2 bg-white" value={editingDoctor.field_id} onChange={(e) => setEditingDoctor({ ...editingDoctor, field_id: e.target.value })} required /></Col>
              </Row>
              <Button type="submit" variant="primary" className="w-100 py-3 rounded-pill fw-bold shadow-lg mt-4">UPDATE PROVIDER</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <style>{`
        .custom-tabs .nav-link { border-radius: 50rem !important; padding: 0.5rem 1.5rem !important; color: #6c757d !important; font-weight: 600 !important; border: none !important; transition: all 0.3s ease; }
        .custom-tabs .nav-link.active { background-color: var(--bs-primary) !important; color: white !important; box-shadow: 0 4px 10px rgba(13, 110, 253, 0.2) !important; }
        .spin { animation: rotate 1s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .transform-hover-up:hover { transform: translateY(-5px); }
      `}</style>
    </Container>
  );
};

export default AdminDashboard;
