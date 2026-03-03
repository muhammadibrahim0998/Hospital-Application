import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import {
    Container, Row, Col, Card, Button, Table,
    Badge, Tabs, Tab, Alert, Spinner, Modal, Form,
} from "react-bootstrap";
import {
    Users, UserPlus, Calendar, FlaskConical, Activity,
    ShieldAlert, RefreshCw, Edit, Trash2, UserCheck2,
} from "lucide-react";
import { useDoctors } from "../context/DoctorContext";

/* ─── helpers ───────────────────────────────────────── */
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

const HospitalAdminDashboard = () => {
    const { user, hasModule } = useContext(AuthContext);
    const { addDoctor, updateDoctor, removeDoctor, toggleStatus, fetchDoctors: refreshDoctors } = useDoctors();

    /* state */
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [appUsers, setAppUsers] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [labStats, setLabStats] = useState({ total: 0, pending: 0 });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    /* doctor modals */
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [newDoctor, setNewDoctor] = useState({
        name: "", email: "", password: "", specialization: "", contact_info: "",
        image: null, departmentId: 1, fieldId: 1, phone: "", fee: 500, whatsappNumber: "",
    });

    const showAlert = (type, msg) => {
        setAlert({ type, msg });
        setTimeout(() => setAlert(null), 4000);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const results = await Promise.allSettled([
                hasModule("doctors") ? axios.get(`${API_BASE_URL}/api/admin/doctors`, { headers: authHeaders() }) : Promise.resolve({ status: "fulfilled", value: { data: [] } }),
                hasModule("patients") ? axios.get(`${API_BASE_URL}/api/admin/patients`, { headers: authHeaders() }) : Promise.resolve({ status: "fulfilled", value: { data: [] } }),
                hasModule("appointments") ? axios.get(`${API_BASE_URL}/api/admin/appointments`, { headers: authHeaders() }) : Promise.resolve({ status: "fulfilled", value: { data: [] } }),
                hasModule("appUsers") ? axios.get(`${API_BASE_URL}/api/admin/app-users`, { headers: authHeaders() }) : Promise.resolve({ status: "fulfilled", value: { data: [] } }),
                hasModule("lab") ? axios.get(`${API_BASE_URL}/api/lab/tests`, { headers: authHeaders() }) : Promise.resolve({ status: "fulfilled", value: { data: [] } }),
            ]);

            const [d, p, a, u, l] = results;
            if (d.status === "fulfilled") setDoctors(d.value.data);
            if (p.status === "fulfilled") setPatients(p.value.data);
            if (a.status === "fulfilled") setAppointments(a.value.data);
            if (u.status === "fulfilled") setAppUsers(u.value.data);
            if (l.status === "fulfilled") {
                const tests = l.value.data || [];
                setLabTests(tests);
                const total = tests.length;
                const pending = tests.filter(t => t.status !== "done").length;
                setLabStats({ total, pending });
            }
        } catch (err) {
            showAlert("danger", "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    /* ── Doctor CRUD ─────────────────────────────────── */
    const handleAddDoctor = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(newDoctor).forEach(key => {
            if (key === "image") formData.append("image", newDoctor.image);
            else formData.append(key, newDoctor[key]);
        });
        try {
            await addDoctor(formData);
            setShowAddModal(false);
            setNewDoctor({ name: "", email: "", password: "", specialization: "", contact_info: "", image: null, departmentId: 1, fieldId: 1, phone: "", fee: 500, whatsappNumber: "" });
            showAlert("success", "Doctor added successfully");
            fetchData();
        } catch {
            showAlert("danger", "Failed to add doctor");
        }
    };

    const handleEditDoctor = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("specialization", editingDoctor.specialization);
        formData.append("contact_info", editingDoctor.contact_info);
        formData.append("departmentId", editingDoctor.department_id);
        formData.append("fieldId", editingDoctor.field_id);
        formData.append("phone", editingDoctor.phone);
        formData.append("fee", editingDoctor.fee);
        formData.append("whatsappNumber", editingDoctor.whatsapp_number || "");
        if (editingDoctor.imageFile) formData.append("image", editingDoctor.imageFile);
        try {
            await updateDoctor(editingDoctor.id, formData);
            setShowEditModal(false);
            setEditingDoctor(null);
            showAlert("success", "Doctor updated");
            fetchData();
        } catch {
            showAlert("danger", "Failed to update doctor");
        }
    };

    /* ── Stat Cards ──────────────────────────────────── */
    const stats = [
        { label: "Doctors", val: doctors.length, icon: <UserCheck2 size={22} />, color: "primary", bg: "rgba(13,110,253,0.1)", show: hasModule("doctors") },
        { label: "Patients", val: patients.length, icon: <Users size={22} />, color: "success", bg: "rgba(25,135,84,0.1)", show: hasModule("patients") },
        { label: "Appointments", val: appointments.length, icon: <Calendar size={22} />, color: "info", bg: "rgba(13,202,240,0.1)", show: hasModule("appointments") },
        { label: "Lab Tests", val: labStats.total, icon: <FlaskConical size={22} />, color: "warning", bg: "rgba(255,193,7,0.1)", show: hasModule("lab") },
    ].filter(s => s.show);

    const roleColor = (role) =>
        role === "doctor" ? "primary" :
            role === "patient" ? "success" : "secondary";

    return (
        <Container fluid className="py-4 px-md-5 bg-light min-vh-100">

            {/* ── Header ──────────────────────────────────── */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm">
                <div>
                    <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                        <ShieldAlert className="text-warning" size={26} /> Hospital Admin Dashboard
                    </h2>
                    <p className="text-muted mb-0 small">
                        {user?.hospitalName ? <><strong>{user.hospitalName}</strong> · </> : ""}
                        Logged in as <strong>{user?.name}</strong>
                    </p>
                </div>
                <Button variant="light" className="rounded-pill px-3 py-2 d-flex align-items-center fw-bold text-muted border shadow-sm"
                    onClick={fetchData} disabled={loading}>
                    <RefreshCw size={16} className={`me-2 ${loading ? "spin" : ""}`} />
                    {loading ? "Syncing…" : "Refresh"}
                </Button>
            </div>

            {alert && (
                <Alert variant={alert.type} dismissible onClose={() => setAlert(null)} className="rounded-3 mb-4">
                    {alert.msg}
                </Alert>
            )}

            {/* ── Stats ────────────────────────────────────── */}
            {stats.length > 0 && (
                <Row className="g-4 mb-5">
                    {stats.map((s, i) => (
                        <Col key={i} xs={12} sm={6} lg={3}>
                            <Card className="border-0 shadow-sm rounded-4 h-100">
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="rounded-3 p-3" style={{ backgroundColor: s.bg, color: `var(--bs-${s.color})` }}>
                                            {s.icon}
                                        </div>
                                        <Badge bg={s.color} className="rounded-pill px-2 py-1 opacity-75">
                                            <Activity size={12} className="me-1" />View
                                        </Badge>
                                    </div>
                                    <h6 className="text-uppercase small fw-bold text-muted mb-1">{s.label}</h6>
                                    <h2 className="display-6 fw-bold mb-0 text-dark">{s.val}</h2>
                                </Card.Body>
                                <div className={`h-1 bg-${s.color} opacity-50`} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* ── Tabs — only show enabled modules ─────────── */}
            <Tabs defaultActiveKey={hasModule("doctors") ? "doctors" : hasModule("patients") ? "patients" : "appUsers"}
                className="mb-4 custom-tabs border-0 bg-white p-2 rounded-pill shadow-sm d-inline-flex">

                {/* ── Doctors Tab ─────────────────────────────── */}
                {hasModule("doctors") && (
                    <Tab eventKey="doctors" title="Doctors" className="mt-3">
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                            <Card.Header className="bg-white border-0 px-4 pt-3 pb-0 d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0">Healthcare Providers</h5>
                                <Button variant="primary" size="sm" className="rounded-pill px-3 d-flex align-items-center gap-2"
                                    onClick={() => setShowAddModal(true)}>
                                    <UserPlus size={15} /> Add Doctor
                                </Button>
                            </Card.Header>
                            <Card.Body className="p-0 mt-2">
                                <div className="table-responsive">
                                    <Table hover className="align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3">PROVIDER</th>
                                                <th className="py-3">SPECIALIZATION</th>
                                                <th className="py-3">PHONE</th>
                                                <th className="py-3">STATUS</th>
                                                <th className="py-3 text-end px-4">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {doctors.length === 0 ? (
                                                <tr><td colSpan={5} className="text-center py-5 text-muted">No doctors in this hospital yet.</td></tr>
                                            ) : doctors.map(doc => (
                                                <tr key={doc.id}>
                                                    <td className="px-4 py-3">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <img src={doc.image ? `${API_BASE_URL}${doc.image}` : "https://img.icons8.com/color/96/doctor-male.png"}
                                                                alt="" className="rounded-circle border" style={{ width: 40, height: 40, objectFit: "cover" }} />
                                                            <div>
                                                                <div className="fw-bold">{doc.name}</div>
                                                                <div className="small text-muted">{doc.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><Badge bg="primary-subtle" text="primary" className="rounded-pill px-3">{doc.specialization}</Badge></td>
                                                    <td className="small text-muted">{doc.phone || "—"}</td>
                                                    <td>
                                                        <div className="form-check form-switch p-0 d-flex align-items-center gap-2">
                                                            <input className="form-check-input ms-0" type="checkbox" role="switch"
                                                                checked={doc.status === "active"}
                                                                onChange={() => toggleStatus(doc.id, doc.status)} />
                                                            <span className={`small fw-bold ${doc.status === "active" ? "text-success" : "text-danger"}`}>
                                                                {doc.status?.toUpperCase() || "ACTIVE"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="text-end px-4">
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <Button variant="light" size="sm" className="rounded-circle p-2 text-primary border-0"
                                                                onClick={() => { setEditingDoctor(doc); setShowEditModal(true); }}>
                                                                <Edit size={15} />
                                                            </Button>
                                                            <Button variant="light" size="sm" className="rounded-circle p-2 text-danger border-0"
                                                                onClick={() => removeDoctor(doc.id)}>
                                                                <Trash2 size={15} />
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
                )}

                {/* ── Patients Tab ─────────────────────────────── */}
                {hasModule("patients") && (
                    <Tab eventKey="patients" title="Patients" className="mt-3">
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                            <Card.Body className="p-0">
                                <div className="table-responsive">
                                    <Table hover className="align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3">PATIENT</th>
                                                <th className="py-3">EMAIL</th>
                                                <th className="py-3">CONTACT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {patients.length === 0 ? (
                                                <tr><td colSpan={3} className="text-center py-5 text-muted">No patients registered yet.</td></tr>
                                            ) : patients.map(p => (
                                                <tr key={p.id}>
                                                    <td className="px-4 py-3 fw-semibold">{p.name}</td>
                                                    <td className="text-muted small">{p.email}</td>
                                                    <td className="text-muted small">{p.contact_info || "—"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Tab>
                )}

                {/* ── Appointments Tab ─────────────────────────── */}
                {hasModule("appointments") && (
                    <Tab eventKey="appointments" title="Appointments" className="mt-3">
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                            <Card.Body className="p-0">
                                <div className="table-responsive">
                                    <Table hover className="align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3">PATIENT</th>
                                                <th className="py-3">DOCTOR</th>
                                                <th className="py-3">DATE</th>
                                                <th className="py-3">STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.length === 0 ? (
                                                <tr><td colSpan={4} className="text-center py-5 text-muted">No appointments found.</td></tr>
                                            ) : appointments.map(a => (
                                                <tr key={a.id}>
                                                    <td className="px-4 py-3 fw-semibold">{a.Patient || "—"}</td>
                                                    <td className="text-muted small">{a.Doctor || "—"}</td>
                                                    <td className="text-muted small">{a.Date} {a.Time}</td>
                                                    <td>
                                                        <Badge bg={a.status === "scheduled" ? "info" : a.status === "completed" ? "success" : "danger"}
                                                            className="rounded-pill text-capitalize">{a.status}</Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Tab>
                )}

                {/* ── App Users Tab ─────────────────────────────── */}
                {hasModule("appUsers") && (
                    <Tab eventKey="appUsers" title="App Users" className="mt-3">
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                            <Card.Header className="bg-white border-0 px-4 pt-3 pb-2">
                                <h5 className="fw-bold mb-0">
                                    App Users — {user?.hospitalName || "This Hospital"}{" "}
                                    <Badge bg="secondary" className="ms-2 rounded-pill">{appUsers.length}</Badge>
                                </h5>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <div className="table-responsive">
                                    <Table hover className="align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3">ID</th>
                                                <th className="py-3">FULL NAME</th>
                                                <th className="py-3">EMAIL</th>
                                                <th className="py-3">ROLE</th>
                                                <th className="py-3">REGISTERED</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appUsers.length === 0 ? (
                                                <tr><td colSpan={5} className="text-center py-5 text-muted">No users found for this hospital.</td></tr>
                                            ) : appUsers.map(u => (
                                                <tr key={u.id}>
                                                    <td className="px-4 py-3 text-muted small">#{u.id}</td>
                                                    <td className="fw-semibold">{u.name}</td>
                                                    <td className="text-muted small">{u.email}</td>
                                                    <td>
                                                        <Badge bg={roleColor(u.role)} className="rounded-pill text-capitalize">{u.role}</Badge>
                                                    </td>
                                                    <td className="text-muted small">
                                                        {u.created_at ? new Date(u.created_at).toLocaleDateString("en-PK") : "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Tab>
                )}

                {/* ── Lab Management Tab ─────────────────────────── */}
                {hasModule("lab") && (
                    <Tab eventKey="lab" title="Laboratory" className="mt-3">
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                            <Card.Header className="bg-white border-0 px-4 pt-3 pb-2">
                                <h5 className="fw-bold mb-0">Lab Test Worklist</h5>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <div className="table-responsive">
                                    <Table hover className="align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3">TEST ID</th>
                                                <th className="py-3">PATIENT</th>
                                                <th className="py-3">REPORT TYPE</th>
                                                <th className="py-3 text-center">STATUS</th>
                                                <th className="py-3 text-end px-4">RESULT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {labTests.length === 0 ? (
                                                <tr><td colSpan={5} className="text-center py-5 text-muted">No lab tests found.</td></tr>
                                            ) : labTests.map(test => (
                                                <tr key={test.id}>
                                                    <td className="px-4 py-3 text-muted small">#L-{test.id}</td>
                                                    <td className="fw-semibold">{test.patient_name}</td>
                                                    <td>{test.test_name}</td>
                                                    <td className="text-center">
                                                        <Badge bg={test.status === "done" ? "success" : "warning"} className="rounded-pill text-capitalize">
                                                            {test.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="text-end px-4">
                                                        {test.status === "done" ? (
                                                            <div className="fw-bold text-primary small text-truncate" style={{ maxWidth: 150 }}>{test.result}</div>
                                                        ) : (
                                                            <span className="text-muted small">Awaiting...</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Tab>
                )}
            </Tabs>

            {/* ── Add Doctor Modal (reused from AdminDashboard) ── */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton className="border-0 bg-primary text-white p-4">
                    <Modal.Title className="fw-bold"><UserPlus className="me-2" />Register Provider</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-light">
                    <Form onSubmit={handleAddDoctor}>
                        <Row className="g-3">
                            <Col md={12}><Form.Label className="small fw-bold text-muted text-uppercase">Profile Picture</Form.Label>
                                <Form.Control type="file" className="border-0 shadow-sm bg-white" accept="image/*"
                                    onChange={e => setNewDoctor({ ...newDoctor, image: e.target.files[0] })} required /></Col>
                            <Col md={12}><Form.Label className="small fw-bold text-muted text-uppercase">Full Name</Form.Label>
                                <Form.Control className="border-0 shadow-sm bg-white" placeholder="Dr. Name"
                                    value={newDoctor.name} onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })} required /></Col>
                            <Col md={12}><Form.Label className="small fw-bold text-muted text-uppercase">Email</Form.Label>
                                <Form.Control type="email" className="border-0 shadow-sm bg-white" placeholder="Email"
                                    value={newDoctor.email} onChange={e => setNewDoctor({ ...newDoctor, email: e.target.value })} required /></Col>
                            <Col md={6}><Form.Label className="small fw-bold text-muted text-uppercase">Password</Form.Label>
                                <Form.Control type="password" className="border-0 shadow-sm bg-white" placeholder="••••••••"
                                    value={newDoctor.password} onChange={e => setNewDoctor({ ...newDoctor, password: e.target.value })} required /></Col>
                            <Col md={6}><Form.Label className="small fw-bold text-muted text-uppercase">Specialization</Form.Label>
                                <Form.Control className="border-0 shadow-sm bg-white" placeholder="Cardiology"
                                    value={newDoctor.specialization} onChange={e => setNewDoctor({ ...newDoctor, specialization: e.target.value })} required /></Col>
                            <Col md={12}><Form.Label className="small fw-bold text-muted text-uppercase">Phone</Form.Label>
                                <Form.Control className="border-0 shadow-sm bg-white" placeholder="03001234567"
                                    value={newDoctor.phone} onChange={e => setNewDoctor({ ...newDoctor, phone: e.target.value, contact_info: e.target.value })} required /></Col>
                            <Col md={6}><Form.Label className="small fw-bold text-muted text-uppercase">Fee (PKR)</Form.Label>
                                <Form.Control type="number" className="border-0 shadow-sm bg-white"
                                    value={newDoctor.fee} onChange={e => setNewDoctor({ ...newDoctor, fee: e.target.value })} required /></Col>
                            <Col md={6}><Form.Label className="small fw-bold text-muted text-uppercase">WhatsApp</Form.Label>
                                <Form.Control className="border-0 shadow-sm bg-white" placeholder="+92300…"
                                    value={newDoctor.whatsappNumber} onChange={e => setNewDoctor({ ...newDoctor, whatsappNumber: e.target.value })} /></Col>
                        </Row>
                        <Button type="submit" variant="primary" className="w-100 py-3 rounded-pill fw-bold mt-4">
                            REGISTER PROVIDER
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* ── Edit Doctor Modal ─── */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton className="border-0 bg-primary text-white p-4">
                    <Modal.Title className="fw-bold"><Edit className="me-2" />Edit Provider</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-light">
                    {editingDoctor && (
                        <Form onSubmit={handleEditDoctor}>
                            <Row className="g-3">
                                <Col md={12}><Form.Label className="small fw-bold text-muted text-uppercase">Update Picture</Form.Label>
                                    <Form.Control type="file" className="border-0 shadow-sm bg-white" accept="image/*"
                                        onChange={e => setEditingDoctor({ ...editingDoctor, imageFile: e.target.files[0] })} /></Col>
                                <Col md={12}><Form.Label className="small fw-bold text-muted text-uppercase">Specialization</Form.Label>
                                    <Form.Control className="border-0 shadow-sm bg-white"
                                        value={editingDoctor.specialization} onChange={e => setEditingDoctor({ ...editingDoctor, specialization: e.target.value })} required /></Col>
                                <Col md={12}><Form.Label className="small fw-bold text-muted text-uppercase">Phone</Form.Label>
                                    <Form.Control className="border-0 shadow-sm bg-white"
                                        value={editingDoctor.phone} onChange={e => setEditingDoctor({ ...editingDoctor, phone: e.target.value, contact_info: e.target.value })} required /></Col>
                                <Col md={6}><Form.Label className="small fw-bold text-muted text-uppercase">Fee</Form.Label>
                                    <Form.Control type="number" className="border-0 shadow-sm bg-white"
                                        value={editingDoctor.fee} onChange={e => setEditingDoctor({ ...editingDoctor, fee: e.target.value })} required /></Col>
                                <Col md={6}><Form.Label className="small fw-bold text-muted text-uppercase">WhatsApp</Form.Label>
                                    <Form.Control className="border-0 shadow-sm bg-white"
                                        value={editingDoctor.whatsapp_number || ""} onChange={e => setEditingDoctor({ ...editingDoctor, whatsapp_number: e.target.value })} /></Col>
                            </Row>
                            <Button type="submit" variant="primary" className="w-100 py-3 rounded-pill fw-bold mt-4">
                                UPDATE PROVIDER
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            <style>{`
        .custom-tabs .nav-link { border-radius:50rem!important; padding:0.5rem 1.2rem!important; color:#6c757d!important; font-weight:600!important; border:none!important; }
        .custom-tabs .nav-link.active { background:var(--bs-primary)!important; color:#fff!important; box-shadow:0 4px 12px rgba(13,110,253,.25)!important; }
        .spin { animation:rotate 1s linear infinite; }
        @keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
        </Container>
    );
};

export default HospitalAdminDashboard;
