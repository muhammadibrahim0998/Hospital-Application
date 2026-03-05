import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import "../css/SuperAdminDashboard.css";
import {
    Container, Row, Col, Card, Button, Table, Badge,
    Modal, Form, Tab, Tabs, Alert, Spinner,
} from "react-bootstrap";
import {
    Building2, UserCog, Users, Plus, Trash2, Edit,
    ShieldCheck, RefreshCw, Settings, Hospital,
    Globe, LayoutDashboard, Database,
} from "lucide-react";

const api = (path) => `${API_BASE_URL}/api/super-admin${path}`;

const DEFAULT_MODULES = {
    doctors: true,
    patients: true,
    appointments: true,
    lab: true,
    appUsers: true,
};

const SuperAdminDashboard = () => {
    const { user, token } = useContext(AuthContext);

    const authHeaders = () => ({
        Authorization: `Bearer ${token}`,
    });

    /* data */
    const [hospitals, setHospitals] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [appUsers, setAppUsers] = useState([]);
    const [projectStats, setProjectStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    /* hospital modal */
    const [showHospModal, setShowHospModal] = useState(false);
    const [editHosp, setEditHosp] = useState(null);
    const [hospForm, setHospForm] = useState({ name: "", address: "", phone: "", email: "" });

    /* hospital-admin modal */
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [editAdmin, setEditAdmin] = useState(null);
    const [adminForm, setAdminForm] = useState({
        hospital_id: "", name: "", email: "", password: "", is_active: 1,
        gender: "Male", age: "", phone: "",
        modules: { ...DEFAULT_MODULES },
    });

    /* module editor modal */
    const [showModModal, setShowModModal] = useState(false);
    const [modTarget, setModTarget] = useState(null);
    const [modForm, setModForm] = useState({ ...DEFAULT_MODULES });

    /* fetch all */
    const fetchAll = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [h, a, u, s] = await Promise.all([
                axios.get(api("/hospitals"), { headers: authHeaders() }),
                axios.get(api("/hospital-admins"), { headers: authHeaders() }),
                axios.get(api("/app-users"), { headers: authHeaders() }),
                axios.get(api("/project-stats"), { headers: authHeaders() }),
            ]);
            setHospitals(h.data);
            setAdmins(a.data);
            setAppUsers(u.data);
            setProjectStats(s.data);
        } catch (err) {
            showAlert("danger", err.response?.data?.message || "Failed to load current data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchAll();
    }, [token]);

    const showAlert = (type, msg) => {
        setAlert({ type, msg });
        setTimeout(() => setAlert(null), 4000);
    };

    /* ── HOSPITAL CRUD ─────────────────────────────────── */
    const openAddHosp = () => { setEditHosp(null); setHospForm({ name: "", address: "", phone: "", email: "" }); setShowHospModal(true); };
    const openEditHosp = (h) => { setEditHosp(h); setHospForm({ name: h.name, address: h.address || "", phone: h.phone || "", email: h.email || "" }); setShowHospModal(true); };

    const saveHospital = async (e) => {
        e.preventDefault();
        try {
            if (editHosp) {
                await axios.put(api(`/hospitals/${editHosp.id}`), { ...hospForm, is_active: 1 }, { headers: authHeaders() });
                showAlert("success", "Project updated successfully");
            } else {
                await axios.post(api("/hospitals"), hospForm, { headers: authHeaders() });
                showAlert("success", "New Project created successfully");
            }
            setShowHospModal(false);
            fetchAll();
        } catch (err) {
            showAlert("danger", "Operation failed");
        }
    };

    const deleteHospital = async (id) => {
        if (!window.confirm("Delete this Project? All linked admins and statistics will be removed.")) return;
        try {
            await axios.delete(api(`/hospitals/${id}`), { headers: authHeaders() });
            showAlert("success", "Project deleted");
            fetchAll();
        } catch (err) {
            showAlert("danger", "Delete failed");
        }
    };

    /* ── HOSPITAL ADMIN CRUD ───────────────────────────── */
    const openAddAdmin = () => {
        setEditAdmin(null);
        setAdminForm({
            hospital_id: "", name: "", email: "", password: "", is_active: 1,
            gender: "Male", age: "", phone: "",
            modules: { ...DEFAULT_MODULES }
        });
        setShowAdminModal(true);
    };
    const openEditAdmin = (a) => {
        setEditAdmin(a);
        let mods = { ...DEFAULT_MODULES };
        try { mods = typeof a.modules === "string" ? JSON.parse(a.modules) : (a.modules || DEFAULT_MODULES); } catch (e) { }
        setAdminForm({
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
        setShowAdminModal(true);
    };

    const saveAdmin = async (e) => {
        e.preventDefault();
        try {
            if (editAdmin) {
                await axios.put(api(`/hospital-admins/${editAdmin.id}`), {
                    name: adminForm.name,
                    email: adminForm.email,
                    is_active: adminForm.is_active,
                    modules: adminForm.modules,
                    gender: adminForm.gender,
                    age: adminForm.age,
                    phone: adminForm.phone
                }, { headers: authHeaders() });
                showAlert("success", "Admin account updated");
            } else {
                await axios.post(api("/hospital-admins"), {
                    hospital_id: adminForm.hospital_id,
                    name: adminForm.name,
                    email: adminForm.email,
                    password: adminForm.password,
                    gender: adminForm.gender,
                    age: adminForm.age,
                }, { headers: authHeaders() });
                showAlert("success", "New Hospital Admin account created successfully.");
            }
            setShowAdminModal(false);
            fetchAll();
        } catch (err) {
            showAlert("danger", err.response?.data?.message || "Operation failed");
        }
    };

    const deleteAdmin = async (id) => {
        if (!window.confirm("Remove this Admin account? Access will be revoked immediately.")) return;
        try {
            await axios.delete(api(`/hospital-admins/${id}`), { headers: authHeaders() });
            showAlert("success", "Admin removed");
            fetchAll();
        } catch (err) {
            showAlert("danger", "Delete failed");
        }
    };

    /* ── MODULE MANAGEMENT ─────────────────────────────── */
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
        } catch (err) {
            showAlert("danger", "Failed to update permissions");
        }
    };

    /* ── ROLLUP STATS ──────────────────────────────────── */
    const stats = [
        { label: "Total Projects", val: hospitals.length, icon: <Building2 size={22} />, color: "primary", bg: "rgba(13,110,253,0.1)" },
        { label: "Active Admins", val: admins.filter(a => a.is_active).length, icon: <UserCog size={22} />, color: "warning", bg: "rgba(255,193,7,0.1)" },
        { label: "Grand Total Users", val: appUsers.length, icon: <Users size={22} />, color: "success", bg: "rgba(25,135,84,0.1)" },
        { label: "Storage Health", val: "Optimal", icon: <Database size={22} />, color: "info", bg: "rgba(13,202,240,0.1)" },
    ];

    const roleColor = (role) =>
        role === "super_admin" ? "danger" :
            role === "hospital_admin" ? "warning" :
                role === "doctor" ? "primary" :
                    role === "patient" ? "success" : "secondary";

    /* ── RENDER ─────────────────────────────────────────── */
    return (
        <Container fluid className="py-4 px-md-5 bg-light min-vh-100">

            {/* ── Header ──────────────────────────────────────── */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm">
                <div>
                    <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                        <ShieldCheck className="text-danger" size={28} /> Super Admin Dashboard
                    </h2>
                    <p className="text-muted mb-0 small">
                        Full Platform Console · <Badge bg="dark" className="rounded-pill">Super Admin</Badge>
                    </p>
                </div>
                <Button variant="light" className="rounded-pill px-3 py-2 d-flex align-items-center fw-bold text-muted border shadow-sm"
                    onClick={fetchAll} disabled={loading}>
                    <RefreshCw size={16} className={`me-2 ${loading ? "spin" : ""}`} />
                    {loading ? "Refreshing…" : "Refresh All Data"}
                </Button>
            </div>

            {/* ── Alert ───────────────────────────────────────── */}
            {alert && (
                <Alert variant={alert.type} dismissible onClose={() => setAlert(null)} className="rounded-3 mb-4 shadow-sm border-0">
                    <div className="d-flex align-items-center gap-2">
                        {alert.type === "success" ? <ShieldCheck size={20} /> : <LayoutDashboard size={20} />}
                        {alert.msg}
                    </div>
                </Alert>
            )}

            {/* ── Stat Cards ──────────────────────────────────── */}
            <Row className="g-4 mb-5">
                {stats.map((s, i) => (
                    <Col key={i} xs={12} sm={6} lg={3}>
                        <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="rounded-3 p-3" style={{ backgroundColor: s.bg, color: `var(--bs-${s.color})` }}>
                                        {s.icon}
                                    </div>
                                    <Badge bg={s.color} className="rounded-pill px-2 py-1 opacity-75">LIVE</Badge>
                                </div>
                                <h6 className="text-uppercase small fw-extrabold text-muted mb-1 ls-1">{s.label}</h6>
                                <h2 className="display-6 fw-bold mb-0 text-dark">{s.val}</h2>
                            </Card.Body>
                            <div className={`h-1 bg-${s.color} opacity-50`} />
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* ── Main Tabs ───────────────────────────────────── */}
            <Tabs defaultActiveKey="hospitals" className="mb-4 custom-tabs border-0 bg-white p-2 rounded-pill shadow-sm d-inline-flex">

                {/* ════ PROJECTS (HOSPITALS) TAB ═══════════════════ */}
                <Tab eventKey="hospitals" title={<span className="d-flex align-items-center gap-2"><Building2 size={15} />Projects</span>} className="mt-3">
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <Card.Header className="bg-white border-0 px-4 pt-3 pb-0 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">Active Projects (Hospitals)</h5>
                            <Button variant="primary" className="rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2" onClick={openAddHosp}>
                                <Plus size={18} /> Add Project
                            </Button>
                        </Card.Header>
                        <Card.Body className="p-0 mt-2">
                            <div className="table-responsive">
                                <Table hover className="align-middle mb-0">
                                    <thead className="bg-light text-muted small text-uppercase fw-bold">
                                        <tr>
                                            <th className="px-4 py-3">PROJECT NAME</th>
                                            <th className="py-3">LOCATION / CONTACT</th>
                                            <th className="py-3">ADMINS</th>
                                            <th className="py-3">USERS</th>
                                            <th className="py-3 text-end px-4">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hospitals.length === 0 ? (
                                            <tr><td colSpan={5} className="text-center py-5 text-muted">No Projects found. Click "Add Project" to begin.</td></tr>
                                        ) : hospitals.map((h) => {
                                            const stats = projectStats.find(s => s.id === h.id) || { doctor_count: 0, patient_count: 0, app_user_count: 0 };
                                            return (
                                                <tr key={h.id}>
                                                    <td className="px-4 py-3">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="rounded-3 p-2 bg-primary bg-opacity-10 text-primary">
                                                                <Hospital size={20} />
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold text-dark">{h.name}</div>
                                                                <div className="small text-muted">ID: #{h.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 small text-muted">
                                                        <div className="text-dark fw-semibold">{h.address || "No Address"}</div>
                                                        <div>{h.email || h.phone || "No Contact"}</div>
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge bg="secondary" className="rounded-pill px-3">
                                                            {admins.filter(a => a.hospital_id === h.id).length} Admin(s)
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Badge bg="info" className="rounded-pill">{stats.doctor_count} Drs</Badge>
                                                            <Badge bg="success" className="rounded-pill">{stats.patient_count} Pts</Badge>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-end px-4">
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <Button variant="light" size="sm" className="rounded-circle p-2 text-primary shadow-sm" onClick={() => openEditHosp(h)}>
                                                                <Edit size={16} />
                                                            </Button>
                                                            <Button variant="light" size="sm" className="rounded-circle p-2 text-danger shadow-sm" onClick={() => deleteHospital(h.id)}>
                                                                <Trash2 size={16} />
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
                </Tab>

                {/* ════ HOSPITAL ADMINS TAB ════════════════════════ */}
                <Tab eventKey="admins" title={<span className="d-flex align-items-center gap-2"><UserCog size={15} />Hospital Admins</span>} className="mt-3">
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <Card.Header className="bg-white border-0 px-4 pt-3 pb-0 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">Project Administrators</h5>
                            <Button variant="warning" className="rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2" onClick={openAddAdmin}>
                                <Plus size={18} /> Create Admin
                            </Button>
                        </Card.Header>
                        <Card.Body className="p-0 mt-2">
                            <div className="table-responsive">
                                <Table hover className="align-middle mb-0">
                                    <thead className="bg-light text-muted small text-uppercase fw-bold">
                                        <tr>
                                            <th className="px-4 py-3">ADMIN ACCOUNT</th>
                                            <th className="py-3">ASSIGNED PROJECT</th>
                                            <th className="py-3">MODULES</th>
                                            <th className="py-3">STATUS</th>
                                            <th className="py-3 text-end px-4">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admins.length === 0 ? (
                                            <tr><td colSpan={5} className="text-center py-5 text-muted">No Administrators found.</td></tr>
                                        ) : admins.map((a) => {
                                            let mods = DEFAULT_MODULES;
                                            try { mods = typeof a.modules === "string" ? JSON.parse(a.modules) : (a.modules || DEFAULT_MODULES); } catch { }
                                            const enabledCount = Object.values(mods).filter(Boolean).length;
                                            return (
                                                <tr key={a.id}>
                                                    <td className="px-4 py-3">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div style={{
                                                                width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#f093fb,#f5576c)",
                                                                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700
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
                                                        <Badge bg="primary" className="rounded-pill px-3 py-2 fw-semibold">
                                                            <Hospital size={12} className="me-1" /> {a.hospital_name}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className="small fw-bold text-muted">{enabledCount}/5 Enabled</span>
                                                            <Button variant="outline-dark" size="sm" className="rounded-pill px-2 py-0 border-0"
                                                                onClick={() => openModules(a)}>
                                                                <Settings size={14} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge bg={a.is_active ? "success" : "danger"} className="rounded-pill">
                                                            {a.is_active ? "Enabled" : "Blocked"}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 text-end px-4">
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <Button variant="light" size="sm" className="rounded-circle p-2 text-primary" onClick={() => openEditAdmin(a)}>
                                                                <Edit size={16} />
                                                            </Button>
                                                            <Button variant="light" size="sm" className="rounded-circle p-2 text-danger" onClick={() => deleteAdmin(a.id)}>
                                                                <Trash2 size={16} />
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
                </Tab>

                {/* ════ APP USERS TAB ═════════════════════════════ */}
                <Tab eventKey="users" title={<span className="d-flex align-items-center gap-2"><Users size={15} />App Users</span>} className="mt-3">

                    {/* Project Rollup Summary */}
                    <Row className="g-3 mb-4 px-1">
                        {projectStats.map((ps, idx) => (
                            <Col key={idx} xs={12} md={4}>
                                <div className="bg-white p-3 rounded-4 shadow-sm border-start border-4 border-primary">
                                    <div className="small fw-bold text-muted text-uppercase mb-1">{ps.name}</div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="h4 fw-bold mb-0 text-primary">{ps.app_user_count + ps.doctor_count + ps.patient_count} Users</div>
                                        <Badge bg="light" text="dark" className="border rounded-pill">Scaffolded</Badge>
                                    </div>
                                    <div className="mt-2 small text-muted">
                                        {ps.doctor_count} Doctors · {ps.patient_count} Patients
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>

                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <Card.Header className="bg-white border-0 px-4 pt-4 pb-2">
                            <h5 className="fw-bold mb-0">Platform-Wide User Directory</h5>
                            <p className="text-muted small mb-0 mt-1">Showing all accounts across all active projects.</p>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table hover className="align-middle mb-0">
                                    <thead className="bg-light text-muted small text-uppercase fw-bold">
                                        <tr>
                                            <th className="px-4 py-3">USER</th>
                                            <th className="py-3">EMAIL</th>
                                            <th className="py-3">ROLE</th>
                                            <th className="py-3">PROJECT</th>
                                            <th className="py-3">ACCOUNT AGE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appUsers.length === 0 ? (
                                            <tr><td colSpan={5} className="text-center py-5 text-muted">No platform users found.</td></tr>
                                        ) : appUsers.map((u) => (
                                            <tr key={u.id}>
                                                <td className="px-4 py-3">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div style={{
                                                            width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#667eea,#764ba2)",
                                                            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.8rem"
                                                        }}>
                                                            {u.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="fw-semibold text-dark">{u.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 small text-muted">{u.email}</td>
                                                <td className="py-3">
                                                    <Badge bg={roleColor(u.role)} className="rounded-pill px-3 py-1 text-capitalize fw-normal">{u.role}</Badge>
                                                </td>
                                                <td className="py-3">
                                                    {u.hospital_name
                                                        ? <Badge bg="light" text="dark" className="rounded-pill border px-3 fw-semibold shadow-xs">
                                                            <Globe size={10} className="me-1 text-primary" /> {u.hospital_name}
                                                        </Badge>
                                                        : <span className="text-muted small italic">System Default</span>}
                                                </td>
                                                <td className="py-3 small text-muted">
                                                    {u.created_at ? new Date(u.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "—"}
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

            {/* ════════ PROJECT MODAL ═════════════════════════════ */}
            <Modal show={showHospModal} onHide={() => setShowHospModal(false)} centered>
                <Modal.Header closeButton className="border-0 bg-primary text-white p-4">
                    <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                        <Building2 size={20} /> {editHosp ? "Edit Project Details" : "Create New Project"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-light">
                    <Form onSubmit={saveHospital}>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Project (Hospital) Name *</Form.Label>
                                <Form.Control className="border-0 shadow-sm bg-white p-3" placeholder="e.g. City General Hospital"
                                    value={hospForm.name} onChange={e => setHospForm({ ...hospForm, name: e.target.value })} required />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Address</Form.Label>
                                <Form.Control className="border-0 shadow-sm bg-white p-3" placeholder="Full Location Details"
                                    value={hospForm.address} onChange={e => setHospForm({ ...hospForm, address: e.target.value })} />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Primary Phone</Form.Label>
                                <Form.Control className="border-0 shadow-sm bg-white p-3" placeholder="03XXXXXXXXX"
                                    value={hospForm.phone} onChange={e => setHospForm({ ...hospForm, phone: e.target.value })} />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Support Email</Form.Label>
                                <Form.Control type="email" className="border-0 shadow-sm bg-white p-3" placeholder="contact@hospital.com"
                                    value={hospForm.email} onChange={e => setHospForm({ ...hospForm, email: e.target.value })} />
                            </Col>
                        </Row>
                        <Button type="submit" variant="primary" className="w-100 py-3 rounded-pill fw-bold mt-4 shadow-lg border-0">
                            {editHosp ? "SAVE PROJECT UPDATES" : "INITIALIZE PROJECT"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* ════════ ADMIN ACCOUNT MODAL ═══════════════════════ */}
            <Modal show={showAdminModal} onHide={() => setShowAdminModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 bg-warning p-4">
                    <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                        <UserCog size={20} /> {editAdmin ? "Modify Admin Account" : "Deploy Hospital Admin"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-light">
                    <Form onSubmit={saveAdmin}>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Assign to Project (Static) *</Form.Label>
                                {hospitals.length === 0 ? (
                                    <div className="p-3 border rounded-3 bg-white shadow-sm border-warning">
                                        <div className="text-danger small fw-bold mb-2">
                                            ⚠ No Projects found! You must initialize a project first.
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Form.Control
                                                size="sm"
                                                placeholder="Enter Project/Hospital Name"
                                                id="quick_proj_name"
                                            />
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="fw-bold"
                                                onClick={async () => {
                                                    const name = document.getElementById('quick_proj_name').value;
                                                    if (!name) return alert('Please enter a project name');
                                                    try {
                                                        await axios.post(api("/hospitals"), { name, address: "Default Address" }, { headers: authHeaders() });
                                                        fetchAll();
                                                        alert('Project "' + name + '" created! You can now select it.');
                                                    } catch (err) { alert('Failed to create project'); }
                                                }}
                                            >
                                                Initialize Project
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Form.Select className="border-0 shadow-sm bg-white p-3"
                                        value={adminForm.hospital_id}
                                        onChange={e => setAdminForm({ ...adminForm, hospital_id: e.target.value })}
                                        required disabled={!!editAdmin}>
                                        <option value="">— Choose Target Project —</option>
                                        {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                    </Form.Select>
                                )}
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Full Name *</Form.Label>
                                <Form.Control className="border-0 shadow-sm bg-white p-3" placeholder="Administrator Name"
                                    value={adminForm.name} onChange={e => setAdminForm({ ...adminForm, name: e.target.value })} required />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">System Email *</Form.Label>
                                <Form.Control type="email" className="border-0 shadow-sm bg-white p-3" placeholder="admin@project.system"
                                    value={adminForm.email} onChange={e => setAdminForm({ ...adminForm, email: e.target.value })} required />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Initial Password *</Form.Label>
                                <Form.Control type="password" className="border-0 shadow-sm bg-white p-3" placeholder="Set secure password"
                                    value={adminForm.password} onChange={e => setAdminForm({ ...adminForm, password: e.target.value })} required />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Gender</Form.Label>
                                <Form.Select className="border-0 shadow-sm bg-white p-3"
                                    value={adminForm.gender} onChange={e => setAdminForm({ ...adminForm, gender: e.target.value })}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Age</Form.Label>
                                <Form.Control type="number" className="border-0 shadow-sm bg-white p-3"
                                    value={adminForm.age} onChange={e => setAdminForm({ ...adminForm, age: e.target.value })} />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Phone</Form.Label>
                                <Form.Control type="text" className="border-0 shadow-sm bg-white p-3"
                                    value={adminForm.phone} onChange={e => setAdminForm({ ...adminForm, phone: e.target.value })} />
                            </Col>
                            <Col md={12}>
                                <Form.Text className="text-danger small fw-bold mt-1 d-block">
                                    ⚠ Once created, this password is required for all access to the assigned project.
                                </Form.Text>
                            </Col>
                            {editAdmin && (
                                <Col md={6}>
                                    <Form.Label className="small fw-bold text-uppercase text-muted">Access Status</Form.Label>
                                    <Form.Select className="border-0 shadow-sm bg-white p-3"
                                        value={adminForm.is_active}
                                        onChange={e => setAdminForm({ ...adminForm, is_active: parseInt(e.target.value) })}>
                                        <option value={1}>Authorized (Can Login)</option>
                                        <option value={0}>Revoked (Login Denied)</option>
                                    </Form.Select>
                                </Col>
                            )}

                            <Col md={12}>
                                <Form.Label className="small fw-bold text-uppercase text-muted mb-2 d-block">
                                    Project Module Access
                                </Form.Label>
                                <div className="d-flex flex-wrap gap-3 p-3 bg-white rounded-3 border-0 shadow-sm">
                                    {Object.keys(DEFAULT_MODULES).map(mod => (
                                        <Form.Check key={mod} type="switch" id={`mod-${mod}`}
                                            label={<span className="text-capitalize fw-bold small text-dark">{mod} Access</span>}
                                            checked={adminForm.modules[mod] ?? true}
                                            onChange={e => setAdminForm({ ...adminForm, modules: { ...adminForm.modules, [mod]: e.target.checked } })}
                                        />
                                    ))}
                                </div>
                            </Col>
                        </Row>
                        <Button type="submit" variant="warning" className="w-100 py-3 rounded-pill fw-bold mt-4 shadow-lg border-0">
                            {editAdmin ? "APPLY ADMIN CHANGES" : "PROVISION ADMIN ACCOUNT"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* ════════ PERMISSIONS MODAL ══════════════════════════ */}
            <Modal show={showModModal} onHide={() => setShowModModal(false)} centered>
                <Modal.Header closeButton className="border-0 bg-dark text-white p-4">
                    <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                        <Settings size={20} /> Permission Control
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {modTarget && (
                        <div className="mb-4">
                            <h6 className="fw-bold text-muted mb-1 text-uppercase small">Managing Permissions for:</h6>
                            <h4 className="fw-extrabold text-dark">{modTarget.name}</h4>
                            <Badge bg="primary" className="rounded-pill px-3">{modTarget.hospital_name}</Badge>
                        </div>
                    )}
                    <Form onSubmit={saveModules}>
                        <div className="d-flex flex-column gap-2">
                            {Object.keys(DEFAULT_MODULES).map(mod => (
                                <div key={mod} className="d-flex justify-content-between align-items-center p-3 bg-light rounded-4 border border-white">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={`p-2 rounded-3 ${modForm[mod] ? 'bg-primary text-white' : 'bg-secondary text-white opacity-25'}`}>
                                            <LayoutDashboard size={16} />
                                        </div>
                                        <div>
                                            <div className="fw-bold text-capitalize text-dark">{mod} Module</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Access to core {mod} features</div>
                                        </div>
                                    </div>
                                    <Form.Check type="switch" id={`modm-${mod}`}
                                        checked={modForm[mod] ?? true}
                                        onChange={e => setModForm({ ...modForm, [mod]: e.target.checked })}
                                    />
                                </div>
                            ))}
                        </div>
                        <Button type="submit" variant="dark" className="w-100 py-3 rounded-pill fw-bold mt-4 shadow-lg border-0">
                            SYNC PERMISSIONS
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <style>{`
        .custom-tabs .nav-link { border-radius:50rem!important; padding:0.6rem 1.5rem!important; color:#495057!important; font-weight:700!important; border:none!important; transition:all .2s; margin: 0 4px; }
        .custom-tabs .nav-link.active { background:var(--bs-primary)!important; color:#fff!important; box-shadow:0 8px 15px rgba(13,110,253,.2)!important; }
        .spin { animation:rotate 1s linear infinite; }
        @keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .ls-1 { letter-spacing: 1px; }
        .fw-extrabold { font-weight: 800; }
        .shadow-xs { box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
      `}</style>
        </Container>
    );
};

export default SuperAdminDashboard;
