import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import {
    Container, Row, Col, Card, Button, Table,
    Badge, Modal, Form, Alert,
} from "react-bootstrap";
import {
    UserCog, Plus, Trash2, Edit, ShieldCheck,
    RefreshCw, Hospital, Settings, Users,
} from "lucide-react";

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});
const api = (path) => `${API_BASE_URL}/api/super-admin${path}`;

const DEFAULT_MODULES = {
    doctors: true,
    patients: true,
    appointments: true,
    lab: true,
    appUsers: true,
};

const UserManagement = () => {
    const { user } = useContext(AuthContext);

    const [admins, setAdmins] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState({
        hospital_id: "", name: "", email: "", password: "",
        is_active: 1, gender: "Male", age: "", phone: "",
        modules: { ...DEFAULT_MODULES },
    });

    const [showModModal, setShowModModal] = useState(false);
    const [modTarget, setModTarget] = useState(null);
    const [modForm, setModForm] = useState({ ...DEFAULT_MODULES });

    const showAlert = (type, msg) => {
        setAlert({ type, msg });
        setTimeout(() => setAlert(null), 4000);
    };

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [h, a] = await Promise.all([
                axios.get(api("/hospitals"), { headers: authHeaders() }),
                axios.get(api("/hospital-admins"), { headers: authHeaders() }),
            ]);
            setHospitals(h.data);
            setAdmins(a.data);
        } catch {
            showAlert("danger", "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    /* ── Open add / edit ─── */
    const openAdd = () => {
        setEditTarget(null);
        setForm({
            hospital_id: "", name: "", email: "", password: "",
            is_active: 1, gender: "Male", age: "", phone: "",
            modules: { ...DEFAULT_MODULES }
        });
        setShowModal(true);
    };

    const openEdit = (a) => {
        setEditTarget(a);
        let mods = DEFAULT_MODULES;
        try { mods = typeof a.modules === "string" ? JSON.parse(a.modules) : (a.modules || DEFAULT_MODULES); } catch { }
        setForm({
            hospital_id: a.hospital_id,
            name: a.name,
            email: a.email,
            password: "",
            is_active: a.is_active,
            gender: a.gender || "Male",
            age: a.age || "",
            phone: a.phone || "",
            modules: mods
        });
        setShowModal(true);
    };

    /* ── Save ─── */
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editTarget) {
                await axios.put(api(`/hospital-admins/${editTarget.id}`), {
                    name: form.name, email: form.email,
                    is_active: form.is_active, modules: form.modules,
                    gender: form.gender, age: form.age, phone: form.phone
                }, { headers: authHeaders() });
                showAlert("success", "Hospital Admin updated successfully");
            } else {
                await axios.post(api("/hospital-admins"), {
                    hospital_id: form.hospital_id, name: form.name,
                    email: form.email, password: form.password,
                    modules: form.modules,
                    gender: form.gender, age: form.age, phone: form.phone
                }, { headers: authHeaders() });
                showAlert("success", "Hospital Admin created. They can now login with their credentials.");
            }
            setShowModal(false);
            fetchAll();
        } catch (err) {
            showAlert("danger", err.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Remove Hospital Admin "${name}"? This cannot be undone.`)) return;
        try {
            await axios.delete(api(`/hospital-admins/${id}`), { headers: authHeaders() });
            showAlert("success", "Hospital Admin removed");
            fetchAll();
        } catch {
            showAlert("danger", "Delete failed");
        }
    };

    /* ── Module editor ─── */
    const openModules = (a) => {
        setModTarget(a);
        let mods = DEFAULT_MODULES;
        try { mods = typeof a.modules === "string" ? JSON.parse(a.modules) : (a.modules || DEFAULT_MODULES); } catch { }
        setModForm({ ...DEFAULT_MODULES, ...mods });
        setShowModModal(true);
    };

    const saveModules = async (e) => {
        e.preventDefault();
        try {
            await axios.put(api(`/hospital-admins/${modTarget.id}/modules`), { modules: modForm }, { headers: authHeaders() });
            showAlert("success", `Modules updated for ${modTarget.name}`);
            setShowModModal(false);
            fetchAll();
        } catch {
            showAlert("danger", "Failed to update modules");
        }
    };

    /* ── Render ─── */
    return (
        <Container fluid className="py-4 px-md-5 bg-light min-vh-100">

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm">
                <div>
                    <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                        <Users className="text-warning" size={28} /> User Management
                    </h2>
                    <p className="text-muted mb-0 small">
                        Create and manage Hospital Admin accounts · Only Super Admin can access this page.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="light" className="rounded-pill px-3 py-2 d-flex align-items-center fw-bold text-muted border shadow-sm"
                        onClick={fetchAll} disabled={loading}>
                        <RefreshCw size={16} className={`me-2 ${loading ? "spin" : ""}`} />
                        {loading ? "Loading…" : "Refresh"}
                    </Button>
                    <Button variant="warning" className="rounded-pill px-4 py-2 d-flex align-items-center fw-bold shadow"
                        onClick={openAdd}>
                        <Plus size={18} className="me-2" /> Create Hospital Admin
                    </Button>
                </div>
            </div>

            {alert && (
                <Alert variant={alert.type} dismissible onClose={() => setAlert(null)} className="rounded-3 mb-4">
                    {alert.msg}
                </Alert>
            )}

            {/* Stats */}
            <Row className="g-4 mb-4">
                <Col xs={12} sm={6} lg={3}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-3 p-3" style={{ background: "rgba(255,193,7,0.1)", color: "#ffc107" }}>
                                    <UserCog size={24} />
                                </div>
                                <div>
                                    <div className="text-muted small fw-bold text-uppercase">Total Admins</div>
                                    <div className="display-6 fw-bold">{admins.length}</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={6} lg={3}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-3 p-3" style={{ background: "rgba(25,135,84,0.1)", color: "#198754" }}>
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <div className="text-muted small fw-bold text-uppercase">Active Admins</div>
                                    <div className="display-6 fw-bold">{admins.filter(a => a.is_active).length}</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={6} lg={3}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-3 p-3" style={{ background: "rgba(13,110,253,0.1)", color: "#0d6efd" }}>
                                    <Hospital size={24} />
                                </div>
                                <div>
                                    <div className="text-muted small fw-bold text-uppercase">Hospitals</div>
                                    <div className="display-6 fw-bold">{hospitals.length}</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Admin Table */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Header className="bg-white border-0 px-4 pt-4 pb-2">
                    <h5 className="fw-bold mb-0">
                        Hospital Admin Accounts
                        <Badge bg="warning" text="dark" className="ms-2 rounded-pill">{admins.length}</Badge>
                    </h5>
                    <p className="text-muted small mb-0 mt-1">
                        Only accounts listed here can log in as Hospital Admins. Each admin is strictly bound to one hospital.
                    </p>
                </Card.Header>
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3">ADMIN ACCOUNT</th>
                                    <th className="py-3">HOSPITAL</th>
                                    <th className="py-3">MODULES</th>
                                    <th className="py-3">ACCESS</th>
                                    <th className="py-3 text-end px-4">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-5 text-muted">
                                            <UserCog size={32} className="mb-3 opacity-25 d-block mx-auto" />
                                            No Hospital Admins yet. Click <strong>"Create Hospital Admin"</strong> to add one.
                                        </td>
                                    </tr>
                                ) : admins.map((a) => {
                                    let mods = DEFAULT_MODULES;
                                    try { mods = typeof a.modules === "string" ? JSON.parse(a.modules) : (a.modules || DEFAULT_MODULES); } catch { }
                                    const enabledCount = Object.values(mods).filter(Boolean).length;
                                    return (
                                        <tr key={a.id}>
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div style={{
                                                        width: 40, height: 40, borderRadius: 10,
                                                        background: "linear-gradient(135deg,#f093fb,#f5576c)",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        color: "#fff", fontWeight: 700, fontSize: "1.1rem",
                                                    }}>
                                                        {a.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{a.name}</div>
                                                        <div className="small text-muted">{a.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <Badge bg="primary" className="rounded-pill px-3 py-2">
                                                    <Hospital size={12} className="me-1" />{a.hospital_name}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="small text-muted">{enabledCount}/5 enabled</div>
                                                    <Button variant="outline-secondary" size="sm"
                                                        className="rounded-pill px-2 py-0 small d-flex align-items-center gap-1"
                                                        onClick={() => openModules(a)}>
                                                        <Settings size={11} /> Manage
                                                    </Button>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <Badge bg={a.is_active ? "success" : "danger"} className="rounded-pill">
                                                    {a.is_active ? "🟢 Active" : "🔴 Disabled"}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-end px-4">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Button variant="light" size="sm" className="rounded-circle p-2 text-primary border-0"
                                                        onClick={() => openEdit(a)} title="Edit">
                                                        <Edit size={15} />
                                                    </Button>
                                                    <Button variant="light" size="sm" className="rounded-circle p-2 text-danger border-0"
                                                        onClick={() => handleDelete(a.id, a.name)} title="Delete">
                                                        <Trash2 size={15} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Create / Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 bg-warning p-4">
                    <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                        <UserCog size={20} /> {editTarget ? "Edit Hospital Admin" : "Create New Hospital Admin"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-light">
                    <Form onSubmit={handleSave}>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">
                                    Assign to Hospital *
                                </Form.Label>
                                <Form.Select className="border-0 shadow-sm bg-white"
                                    value={form.hospital_id}
                                    onChange={e => setForm({ ...form, hospital_id: e.target.value })}
                                    required disabled={!!editTarget}>
                                    <option value="">— Select Hospital —</option>
                                    {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                </Form.Select>
                                {hospitals.length === 0 && (
                                    <div className="text-danger small mt-1">
                                        ⚠ No hospitals found. Please create a hospital first from the Super Admin Console.
                                    </div>
                                )}
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Full Name *</Form.Label>
                                <Form.Control className="border-0 shadow-sm bg-white" placeholder="Admin full name"
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Email Address *</Form.Label>
                                <Form.Control type="email" className="border-0 shadow-sm bg-white" placeholder="admin@hospital.com"
                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                            </Col>
                            {!editTarget && (
                                <Col md={12}>
                                    <Form.Label className="small fw-bold text-uppercase text-muted">Login Password *</Form.Label>
                                    <Form.Control type="password" className="border-0 shadow-sm bg-white"
                                        placeholder="Set a secure password for this admin"
                                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                                </Col>
                            )}
                            <Col md={4}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Gender</Form.Label>
                                <Form.Select className="border-0 shadow-sm bg-white"
                                    value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Age</Form.Label>
                                <Form.Control type="number" className="border-0 shadow-sm bg-white"
                                    value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Phone</Form.Label>
                                <Form.Control className="border-0 shadow-sm bg-white"
                                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </Col>
                            {editTarget && (
                                <Col md={6}>
                                    <Form.Label className="small fw-bold text-uppercase text-muted">Account Status</Form.Label>
                                    <Form.Select className="border-0 shadow-sm bg-white"
                                        value={form.is_active}
                                        onChange={e => setForm({ ...form, is_active: parseInt(e.target.value) })}>
                                        <option value={1}>Active — Can log in</option>
                                        <option value={0}>Disabled — Login blocked</option>
                                    </Form.Select>
                                </Col>
                            )}
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-uppercase text-muted d-block mb-2">
                                    Dashboard Module Access
                                </Form.Label>
                                <div className="d-flex flex-wrap gap-3 p-3 bg-white rounded-3 shadow-sm">
                                    {Object.keys(DEFAULT_MODULES).map(mod => (
                                        <Form.Check key={mod} type="switch" id={`new-mod-${mod}`}
                                            label={<span className="text-capitalize fw-semibold small">{mod}</span>}
                                            checked={form.modules[mod] ?? true}
                                            onChange={e => setForm({ ...form, modules: { ...form.modules, [mod]: e.target.checked } })}
                                        />
                                    ))}
                                </div>
                            </Col>
                        </Row>
                        <Button type="submit" variant="warning" className="w-100 py-3 rounded-pill fw-bold mt-4">
                            {editTarget ? "UPDATE HOSPITAL ADMIN" : "CREATE HOSPITAL ADMIN ACCOUNT"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Module Manager Modal */}
            <Modal show={showModModal} onHide={() => setShowModModal(false)} centered>
                <Modal.Header closeButton className="border-0 bg-dark text-white p-4">
                    <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                        <Settings size={20} /> Module Permissions
                        {modTarget && <Badge bg="warning" text="dark" className="ms-2">{modTarget.name}</Badge>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <p className="text-muted small mb-4">
                        Disabled modules will be hidden from <strong>{modTarget?.name}</strong>'s dashboard sidebar.
                    </p>
                    <Form onSubmit={saveModules}>
                        <div className="d-flex flex-column gap-3">
                            {Object.keys(DEFAULT_MODULES).map(mod => (
                                <div key={mod} className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                                    <div>
                                        <div className="fw-semibold text-capitalize">{mod}</div>
                                        <div className="small text-muted">
                                            {mod === "doctors" && "Manage hospital doctors"}
                                            {mod === "patients" && "Manage hospital patients"}
                                            {mod === "appointments" && "View and manage appointments"}
                                            {mod === "lab" && "Lab tests and reports"}
                                            {mod === "appUsers" && "View registered app users"}
                                        </div>
                                    </div>
                                    <Form.Check type="switch" id={`modm-${mod}`}
                                        checked={modForm[mod] ?? true}
                                        onChange={e => setModForm({ ...modForm, [mod]: e.target.checked })}
                                    />
                                </div>
                            ))}
                        </div>
                        <Button type="submit" variant="dark" className="w-100 py-3 rounded-pill fw-bold mt-4">
                            SAVE PERMISSIONS
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <style>{`
        .spin { animation: rotate 1s linear infinite; }
        @keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
        </Container>
    );
};

export default UserManagement;
