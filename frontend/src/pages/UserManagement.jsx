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
    RefreshCw, Hospital, Settings, Users, Phone, MapPin, Hash
} from "lucide-react";

const api = (path) => `${API_BASE_URL}/api/super-admin${path}`;

const DEFAULT_MODULES = {
    doctors: true,
    patients: true,
    appointments: true,
    lab: true,
    appUsers: true,
};

const UserManagement = () => {
    const { token } = useContext(AuthContext);

    const authHeaders = () => ({
        Authorization: `Bearer ${token}`,
    });

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
        if (!token) return;
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

    useEffect(() => {
        if (token) fetchAll();
    }, [token]);

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
                showAlert("success", "Hospital Admin created successfully.");
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

    return (
        <Container fluid className="py-4 px-md-5 bg-light min-vh-100">

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3 bg-glass p-4 rounded-5 border border-dark-subtle shadow-lg">
                <div>
                    <h2 className="fw-black text-dark mb-1 d-flex align-items-center gap-2 tracking-tight">
                        <Users className="text-dark" size={32} /> User Management
                    </h2>
                    <p className="text-muted mb-0 small fw-bold">
                        Create & Manage Infrastructure Admins · <Badge bg="dark" className="rounded-1 px-3 py-1 fw-black">CONTROL PANEL</Badge>
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="light" className="rounded-pill px-3 py-1 d-flex align-items-center fw-black text-muted border shadow-sm hover-lift"
                        style={{ fontSize: '10px' }}
                        onClick={fetchAll} disabled={loading}>
                        <RefreshCw size={14} className={`me-2 ${loading ? "spin" : ""}`} />
                        {loading ? "SYNCING..." : "REFRESH"}
                    </Button>
                    <Button variant="warning" className="rounded-2 px-3 py-1 d-flex align-items-center fw-black shadow-lg border-0 btn-premium-navy text-white text-uppercase"
                        style={{ fontSize: '10px' }}
                        onClick={openAdd}>
                        <Plus size={14} className="me-2" /> CREATE HOSPITAL ADMIN
                    </Button>
                </div>
            </div>

            {alert && (
                <Alert variant={alert.type} dismissible onClose={() => setAlert(null)} className="rounded-4 mb-4 border-0 shadow-sm px-4 py-3 fw-bold">
                    {alert.msg}
                </Alert>
            )}

            {/* Stats Section (Desktop Only) */}
            <Row className="g-4 mb-5 d-none d-md-flex">
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-5 h-100 bg-glass-stat hover-lift transition-all border border-primary border-opacity-10 stat-card-premium">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(5, 44, 101, 0.1)', color: '#052c65', width: '42px', height: '42px' }}>
                                    <UserCog size={20} />
                                </div>
                                <div>
                                    <div className="text-muted small fw-black text-uppercase tracking-widest" style={{fontSize: '9px'}}>Total Admins</div>
                                    <div className="h4 fw-black mb-0 text-dark">{admins.length}</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-5 h-100 bg-glass-stat hover-lift transition-all border border-primary border-opacity-10 stat-card-premium">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)', color: '#198754', width: '42px', height: '42px' }}>
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <div className="text-muted small fw-black text-uppercase tracking-widest" style={{fontSize: '9px'}}>Active Admins</div>
                                    <div className="h4 fw-black mb-0 text-dark">{admins.filter(a => a.is_active).length}</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-5 h-100 bg-glass-stat hover-lift transition-all border border-primary border-opacity-10 stat-card-premium">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(13, 110, 253, 0.1)', color: '#0d6efd', width: '42px', height: '42px' }}>
                                    <Hospital size={20} />
                                </div>
                                <div>
                                    <div className="text-muted small fw-black text-uppercase tracking-widest" style={{fontSize: '9px'}}>Registered Nodes</div>
                                    <div className="h4 fw-black mb-0 text-dark">{hospitals.length}</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Desktop View: Premium Table */}
            <div className="d-none d-lg-block">
                <Card className="border-0 shadow-2xl rounded-5 overflow-hidden bg-white border border-primary border-2">
                    <Card.Header className="bg-white border-0 px-4 pt-4 pb-0 d-flex justify-content-between align-items-center">
                        <h5 className="fw-black mb-0 tracking-tight text-dark h4">HOSPITAL ADMIN DIRECTORY</h5>
                        <Badge bg="primary" className="rounded-pill px-3 py-2 fw-black shadow-xs" style={{fontSize: '10px'}}>SYSTEM CONTROL</Badge>
                    </Card.Header>
                    <Card.Body className="p-2">
                        <Table hover responsive className="align-middle mb-0 border-0">
                            <thead className="bg-light text-muted small text-uppercase fw-black">
                                <tr>
                                    <th className="px-4 py-4 border-0">ADMIN ACCOUNT</th>
                                    <th className="py-4 border-0">ASSIGNED PROJECT</th>
                                    <th className="py-4 border-0 text-center">MODULES</th>
                                    <th className="py-4 border-0 text-center">IDENTITY</th>
                                    <th className="py-4 border-0 text-center">STATUS</th>
                                    <th className="py-4 border-0 text-end px-4">MANAGEMENT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((a) => {
                                    let mods = DEFAULT_MODULES;
                                    try { mods = typeof a.modules === "string" ? JSON.parse(a.modules) : (a.modules || DEFAULT_MODULES); } catch { }
                                    const enabledCount = Object.values(mods).filter(Boolean).length;
                                    return (
                                        <tr key={a.id} className="border-bottom border-light">
                                            <td className="px-4 py-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div style={{
                                                        width: 42, height: 42, borderRadius: '50%',
                                                        background: "rgba(5, 44, 101, 0.05)",
                                                        color: "#052c65", display: "flex", alignItems: "center", justifyContent: "center", 
                                                        fontWeight: "900", border: '2px solid #052c65'
                                                    }}>
                                                        {a.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="fw-black text-dark mb-0">{a.name}</div>
                                                        <div className="small text-muted fw-bold" style={{fontSize: '10px'}}>{a.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="d-flex align-items-center gap-2 small fw-black text-primary">
                                                    <Hospital size={14} /> {a.hospital_name}
                                                </div>
                                                <div className="small text-muted fw-bold mt-1" style={{fontSize: '9px'}}>ID: {a.id}</div>
                                            </td>
                                            <td className="py-4 text-center">
                                                <div className="d-flex align-items-center justify-content-center gap-2">
                                                    <span className="small fw-black text-dark">{enabledCount}/5 Active</span>
                                                    <Button variant="light" size="sm" className="rounded-2 p-1 text-dark border-0 bg-light shadow-xs" onClick={() => openModules(a)}>
                                                        <Settings size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                            <td className="py-4 text-center">
                                                <div className="small fw-bold text-dark">{a.gender || "Male"}</div>
                                                <div className="small text-muted fw-black text-uppercase" style={{fontSize: '8px'}}>{a.age || "N/A"} YEARS</div>
                                            </td>
                                            <td className="py-4 text-center">
                                                <Badge bg={a.is_active ? "success" : "danger"} className="rounded-pill px-3 py-2 fw-black shadow-xs" style={{fontSize: '9px'}}>
                                                    {a.is_active ? "ENABLED" : "BLOCKED"}
                                                </Badge>
                                            </td>
                                            <td className="py-4 text-end px-4">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Button variant="light" size="sm" className="rounded-3 p-2 text-primary border shadow-xs bg-white hover-lift" onClick={() => openEdit(a)}>
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button variant="light" size="sm" className="rounded-circle p-2 text-danger border shadow-xs bg-white hover-lift" onClick={() => handleDelete(a.id, a.name)}>
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </div>

            {/* Mobile View: Modern Cards */}
            <div className="d-lg-none">
                <Row className="g-4">
                    {admins.map((a) => {
                        let mods = DEFAULT_MODULES;
                        try { mods = typeof a.modules === "string" ? JSON.parse(a.modules) : (a.modules || DEFAULT_MODULES); } catch { }
                        const enabledCount = Object.values(mods).filter(Boolean).length;
                        return (
                            <Col key={a.id} xs={12} sm={6}>
                                <Card className="border-0 shadow-sm rounded-5 overflow-hidden bg-white hover-lift transition-all user-modern-card" style={{ border: '2px solid rgba(5, 44, 101, 0.15)' }}>
                                    <Card.Body className="p-4">
                                        <div className="d-flex align-items-start justify-content-between mb-4">
                                            <div style={{
                                                width: 48, height: 48, borderRadius: '50%',
                                                background: "rgba(5, 44, 101, 0.05)",
                                                color: "#052c65", display: "flex", alignItems: "center", justifyContent: "center", 
                                                fontWeight: "900", border: '2px solid #052c65',
                                                boxShadow: '0 4px 10px rgba(5, 44, 101, 0.15)'
                                            }}>
                                                {a.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <Badge bg={a.is_active ? "success" : "danger"} className="rounded-pill px-3 py-2 text-capitalize fw-black shadow-sm border-0" style={{ fontSize: '10px' }}>
                                                {a.is_active ? "Active" : "Revoked"}
                                            </Badge>
                                        </div>
                                        <div className="mb-4 text-center">
                                            <h5 className="fw-black text-dark mb-1">{a.name}</h5>
                                            <div className="small text-muted fw-bold">{a.email}</div>
                                        </div>
                                        <div className="p-3 bg-light rounded-4 mb-4 border border-white d-flex flex-column gap-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="fw-black text-muted text-uppercase" style={{fontSize: '8px', letterSpacing: '0.5px'}}>NODE:</div>
                                                <div className="small fw-black text-primary d-flex align-items-center gap-1">
                                                    <Hospital size={10} /> {a.hospital_name}
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="fw-black text-muted text-uppercase" style={{fontSize: '8px', letterSpacing: '0.5px'}}>PERMISSIONS:</div>
                                                <div className="small fw-bold text-dark d-flex align-items-center gap-2">
                                                    {enabledCount}/5 Active 
                                                    <Button variant="white" size="sm" className="p-1 border shadow-xs bg-white" onClick={() => openModules(a)}>
                                                        <Settings size={10} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center border-top border-white border-opacity-50 pt-2 mt-1">
                                                <div className="fw-black text-muted text-uppercase" style={{fontSize: '8px', letterSpacing: '0.5px'}}>IDENTITY:</div>
                                                <div className="small fw-bold text-dark">{a.gender || "Male"} · {a.age || "N/A"} YRS</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center pt-3 border-top border-light">
                                            <div className="small text-muted fw-black d-flex align-items-center gap-1">
                                                <Hash size={12} /> {a.id?.toString().slice(-6)}
                                            </div>
                                            <div className="d-flex gap-2">
                                                <Button variant="light" size="sm" className="rounded-3 p-2 text-primary border shadow-xs bg-white hover-lift" onClick={() => openEdit(a)}>
                                                    <Edit size={16} />
                                                </Button>
                                                <Button variant="light" size="sm" className="rounded-3 p-2 text-danger border shadow-xs bg-white hover-lift" onClick={() => handleDelete(a.id, a.name)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </div>

            {/* Create / Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="md" contentClassName="rounded-5 border-0 shadow-lg overflow-hidden mt-5">
                <Modal.Header closeButton className="border-0 bg-warning p-3">
                    <Modal.Title className="fw-black d-flex align-items-center gap-2" style={{fontSize: '15px'}}>
                        <UserCog size={18} /> {editTarget ? "MODIFY ADMIN IDENTITY" : "DEPLOY NEW ADMIN"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3 bg-light">
                    <div className="smart-card-body p-3 rounded-4 border-primary border-top border-5 bg-white shadow-sm">
                        <Form onSubmit={handleSave}>
                            <Row className="g-2">
                                <Col md={12}>
                                    <Form.Label className="fw-black text-muted mb-1" style={{fontSize: '9px'}}>NODE ASSIGNMENT</Form.Label>
                                    <Form.Select size="sm" className="border-0 shadow-sm bg-light p-2 rounded-3 fw-bold" style={{fontSize: '11px'}}
                                        value={form.hospital_id}
                                        onChange={e => setForm({ ...form, hospital_id: e.target.value })}
                                        required disabled={!!editTarget}>
                                        <option value="">— Choose Cluster Profile —</option>
                                        {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="fw-black text-muted mb-1" style={{fontSize: '9px'}}>FULL NAME</Form.Label>
                                    <Form.Control size="sm" className="border-0 shadow-sm bg-light p-2 rounded-3 fw-bold" style={{fontSize: '11px'}} value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })} required />
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="fw-black text-muted mb-1" style={{fontSize: '9px'}}>SEARCHABLE EMAIL</Form.Label>
                                    <Form.Control size="sm" type="email" className="border-0 shadow-sm bg-light p-2 rounded-3 fw-bold" style={{fontSize: '11px'}} value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })} required />
                                </Col>
                                {!editTarget && (
                                    <Col md={12}>
                                        <Form.Label className="fw-black text-muted mb-1" style={{fontSize: '9px'}}>ACCESS KEY (SECRET)</Form.Label>
                                        <Form.Control size="sm" type="password" className="border-0 shadow-sm bg-light p-2 rounded-3 fw-bold" style={{fontSize: '11px'}} placeholder="Set secure password"
                                            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                                    </Col>
                                )}
                                <Col md={4}>
                                    <Form.Label className="fw-black text-muted mb-1" style={{fontSize: '9px'}}>GENDER</Form.Label>
                                    <Form.Select size="sm" className="border-0 shadow-sm bg-light p-2 rounded-3 fw-bold" style={{fontSize: '11px'}} 
                                        value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </Form.Select>
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="fw-black text-muted mb-1" style={{fontSize: '9px'}}>AGE</Form.Label>
                                    <Form.Control size="sm" type="number" className="border-0 shadow-sm bg-light p-2 rounded-3 fw-bold" style={{fontSize: '11px'}}
                                        value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="fw-black text-muted mb-1" style={{fontSize: '9px'}}>PHONE</Form.Label>
                                    <Form.Control size="sm" className="border-0 shadow-sm bg-light p-2 rounded-3 fw-bold" style={{fontSize: '11px'}}
                                        value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                </Col>
                                <Col md={12} className="mt-3">
                                    <Form.Label className="fw-black text-muted mb-2 d-block" style={{fontSize: '9px'}}>MODULE ACCESS GRID</Form.Label>
                                    <div className="d-flex flex-wrap gap-2 p-2 bg-light rounded-3 shadow-sm border border-primary border-opacity-10">
                                        {Object.keys(DEFAULT_MODULES).map(mod => (
                                            <Form.Check key={mod} type="switch" id={`new-mod-${mod}`}
                                                label={<span className="text-capitalize fw-bold text-dark" style={{fontSize: '9px'}}>{mod}</span>}
                                                checked={form.modules[mod] ?? true}
                                                onChange={e => setForm({ ...form, modules: { ...form.modules, [mod]: e.target.checked } })}
                                            />
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                            <div className="text-center mt-3">
                                <Button type="submit" variant="warning" className="px-5 py-2 rounded-2 fw-black shadow-lg border-0 btn-premium-navy text-white text-uppercase" style={{fontSize: '10px', letterSpacing: '1px'}}>
                                    {editTarget ? "SYNC IDENTITY" : "DEPLOY ADMIN"}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Module Manager Modal */}
            <Modal show={showModModal} onHide={() => setShowModModal(false)} centered size="md" contentClassName="rounded-5 border-0 shadow-lg overflow-hidden">
                <Modal.Header closeButton className="border-0 bg-dark text-white p-3">
                    <Modal.Title className="fw-black d-flex align-items-center gap-2" style={{fontSize: '15px'}}>
                        <Settings size={18} /> PERMISSION CONTROL GRID
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3 bg-light">
                    <div className="mb-3 text-center border-bottom pb-2">
                        <div className="fw-black text-dark h6 mb-0">{modTarget?.name}</div>
                        <div className="small text-muted fw-bold">{modTarget?.hospital_name} Node</div>
                    </div>
                    <Form onSubmit={saveModules}>
                        <div className="d-flex flex-column gap-2">
                            {Object.keys(DEFAULT_MODULES).map(mod => (
                                <div key={mod} className="d-flex justify-content-between align-items-center p-3 bg-white rounded-3 shadow-xs border border-light">
                                    <div>
                                        <div className="fw-black text-dark small text-uppercase" style={{fontSize: '10px'}}>{mod} Access</div>
                                        <div className="small text-muted fw-bold" style={{fontSize: '9px'}}>Core {mod} management features</div>
                                    </div>
                                    <Form.Check type="switch" id={`modm-${mod}`}
                                        checked={modForm[mod] ?? true}
                                        onChange={e => setModForm({ ...modForm, [mod]: e.target.checked })}
                                    />
                                </div>
                            ))}
                        </div>
                        <Button type="submit" variant="dark" className="w-100 py-3 rounded-pill fw-black mt-4 shadow-lg border-0 text-uppercase" style={{fontSize: '11px', letterSpacing: '1px'}}>
                            COMMIT PERMISSIONS
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                body { font-family: 'Inter', sans-serif; background: #f8f9fa; }
                .fw-black { font-weight: 900; }
                .tracking-tight { letter-spacing: -1.2px; }
                .tracking-widest { letter-spacing: 2px; }
                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08); }
                .shadow-xs { box-shadow: 0 2px 4px rgba(0,0,0,0.03); }
                .bg-glass { background: rgba(255, 255, 255, 0.7) !important; backdrop-filter: blur(20px); }
                .bg-glass-stat { background: rgba(255, 255, 255, 0.4) !important; backdrop-filter: blur(10px); }
                .hover-lift { transition: all 0.3s ease; }
                .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(5, 44, 101, 0.1) !important; }
                .btn-premium-navy { background: #052c65 !important; transition: all 0.3s ease; }
                .btn-premium-navy:hover { background: #031633 !important; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(5, 44, 101, 0.3) !important; }
                .transition-all { transition: all 0.3s ease; }
                .spin { animation: rotate 1s linear infinite; }
                @keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                .stat-card-premium:hover { border-color: rgba(5, 44, 101, 0.4) !important; box-shadow: 0 15px 30px rgba(5, 44, 101, 0.15) !important; }
            `}</style>
        </Container>
    );
};

export default UserManagement;
