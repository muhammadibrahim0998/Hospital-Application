import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Container, Row, Col, Card, Button, Table, Badge, Form, Modal, Alert } from "react-bootstrap";
import { Users, Search, Filter, Download, MoreVertical, Globe, MapPin, Edit, Trash2, Save, UserCog, Phone, User, Calendar, Shield, Hash } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const ViewUsers = () => {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [alert, setAlert] = useState(null);

    // Edit Modal State
    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState({
        id: "", name: "", email: "", role: "", hospital_id: "" ,
        gender: "", age: "", phone: ""
    });
    const [roleFilter, setRoleFilter] = useState("All");

    const authHeaders = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [userRes, hospRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/super-admin/app-users`, {
                    headers: authHeaders
                }),
                axios.get(`${API_BASE_URL}/api/super-admin/hospitals`, {
                    headers: authHeaders
                })
            ]);
            setUsers(userRes.data);
            setHospitals(hospRes.data);
        } catch (err) {
            console.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const handleEdit = (u) => {
        setEditForm({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            hospital_id: u.hospital_id || "",
            gender: u.gender || "Male",
            age: u.age || "",
            phone: u.phone || ""
        });
        setShowEdit(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/api/super-admin/app-users/${editForm.id}`, editForm, {
                headers: authHeaders
            });
            setShowEdit(false);
            setAlert({ type: "success", msg: "User updated successfully!" });
            fetchData();
        } catch (err) {
            setAlert({ type: "danger", msg: "Failed to update user" });
        }
    };

    const handleDelete = async (id, role) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/super-admin/app-users/${id}?role=${role}`, {
                headers: authHeaders
            });
            setAlert({ type: "success", msg: "User removed successfully" });
            fetchData();
        } catch (err) {
            setAlert({ type: "danger", msg: "Delete failed" });
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = u.role === "hospital_admin";
        return matchesSearch && matchesRole;
    });

    const exportToCSV = () => {
        const headers = ["ID", "Name", "Email", "Phone", "Gender", "Age", "Role", "Hospital"];
        const rows = filteredUsers.map(u => [
            u.id, u.name, u.email, u.phone || "", u.gender, u.age, u.role, u.hospital_name || "Global"
        ]);
        const content = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "app_users_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Container fluid className="py-4 px-md-5 bg-light min-vh-100">
            {/* Header Area */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3 bg-white p-4 rounded-5 shadow-sm border border-light">
                <div>
                    <h2 className="fw-black text-dark mb-1 d-flex align-items-center gap-2 tracking-tight">
                        <Users className="text-primary" size={32} /> REGISTERED USERS DIRECTORY
                    </h2>
                    <p className="text-muted mb-0 small fw-bold">
                        Global User Registry · <Badge bg="primary" className="rounded-1 px-3 py-1 fw-bold">ADMIN CONSOLE</Badge>
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="white" className="rounded-3 px-3 py-2 d-flex align-items-center fw-bold text-muted border shadow-sm hover-lift bg-white"
                        style={{ fontSize: '12px' }}
                        onClick={exportToCSV}>
                        <Download size={16} className="me-2" /> EXPORT DATA
                    </Button>
                </div>
            </div>

            {alert && (
                <Alert variant={alert.type} dismissible onClose={() => setAlert(null)} className="rounded-4 shadow-sm border-0 mb-4 px-4 py-3">
                    <div className="d-flex align-items-center gap-2 fw-bold">
                        {alert.type === 'success' ? '✓' : '⚠'} {alert.msg}
                    </div>
                </Alert>
            )}

            {/* Filter Bar */}
            <Card className="border-0 shadow-sm rounded-5 mb-5 overflow-hidden">
                <Card.Body className="p-4 bg-white">
                    <Row className="g-3 align-items-center">
                        <Col xs={12} md={4} lg={3}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="small fw-black text-muted text-uppercase tracking-widest" style={{ fontSize: '10px' }}>Filter by Role:</div>
                                <Form.Select
                                    className="border-0 bg-light rounded-3 fw-bold small py-2"
                                    value={roleFilter}
                                    onChange={e => setRoleFilter(e.target.value)}
                                >
                                    <option value="All">All Admins Only</option>
                                    <option value="hospital_admin">System Admins</option>
                                </Form.Select>
                            </div>
                        </Col>
                        <Col xs={12} md={8} lg={9}>
                            <div className="position-relative">
                                <Search className="position-absolute" style={{ left: "15px", top: "50%", transform: "translateY(-50%)", color: "var(--bs-primary)" }} size={18} />
                                <Form.Control
                                    className="ps-5 border-0 bg-light rounded-4 py-3 fw-semibold shadow-none"
                                    placeholder="Instant search by name, email or identification..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Responsive Content */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="mt-3 fw-bold text-muted">SYNCHRONIZING REGISTRY...</div>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-5 text-muted bg-white rounded-5 shadow-sm">
                    <Users size={64} className="mb-3 opacity-25" />
                    <h4 className="fw-black text-dark">No Matching Profiles Found</h4>
                    <p className="fw-bold">Adjust your filters or try a different search term.</p>
                </div>
            ) : (
                <>
                    {/* Desktop View: Premium Table */}
                    <div className="d-none d-lg-block">
                        <Card className="border-0 shadow-sm rounded-5 overflow-hidden bg-white">
                            <Card.Body className="p-0">
                                <Table hover responsive className="align-middle mb-0">
                                    <thead className="bg-light text-muted small fw-black text-uppercase border-bottom">
                                        <tr>
                                            <th className="px-4 py-4 border-0">IDENTIFIER</th>
                                            <th className="py-4 border-0 text-center">ROLE</th>
                                            <th className="py-4 border-0">CONTACT / NODE</th>
                                            <th className="py-4 border-0 text-center">IDENTITY</th>
                                            <th className="py-4 border-0 text-end px-4">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((u) => (
                                            <tr key={u.id} className="border-bottom border-light">
                                                <td className="px-4 py-3">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div style={{
                                                            width: 40, height: 40, borderRadius: '50%',
                                                            background: "rgba(13, 110, 253, 0.05)",
                                                            color: "#0d6efd", display: "flex", alignItems: "center", justifyContent: "center", 
                                                            fontWeight: "900", fontSize: '1rem', border: '2px solid #0d6efd'
                                                        }}>
                                                            {u.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="fw-black text-dark mb-0">{u.name}</div>
                                                            <div className="small text-muted fw-bold">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <Badge bg={u.role === 'hospital_admin' ? 'warning' : 'primary'}
                                                        text={u.role === 'hospital_admin' ? 'dark' : 'white'}
                                                        className="rounded-pill px-3 py-2 fw-black shadow-xs border-0" style={{fontSize: '9px'}}>
                                                        {u.role?.replace('_', ' ').toUpperCase()}
                                                    </Badge>
                                                </td>
                                                <td className="py-3">
                                                    <div className="d-flex align-items-center gap-2 small fw-bold text-dark">
                                                        <Phone size={12} className="text-primary" /> {u.phone || "N/A"}
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 small fw-black text-primary mt-1">
                                                        <MapPin size={12} /> {u.hospital_name || "GLOBAL SYSTEM"}
                                                    </div>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <div className="small fw-bold text-dark">{u.gender || "Male"}</div>
                                                    <div className="small text-muted fw-black text-uppercase" style={{fontSize: '8px'}}>{u.age || "N/A"} YEARS</div>
                                                </td>
                                                <td className="py-3 text-end px-4">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <Button variant="light" size="sm" className="rounded-3 p-2 text-primary border shadow-xs bg-white hover-lift" onClick={() => handleEdit(u)}>
                                                            <Edit size={16} />
                                                        </Button>
                                                        <Button variant="light" size="sm" className="rounded-circle p-2 text-danger border shadow-xs bg-white hover-lift" onClick={() => handleDelete(u.id, u.role)}>
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </div>

                    {/* Mobile View: Modern Cards */}
                    <div className="d-lg-none">
                        <Row className="g-4">
                            {filteredUsers.map((u) => (
                                <Col key={u.id} xs={12} sm={6}>
                                    <Card className="border-0 shadow-sm rounded-5 h-100 overflow-hidden bg-white border-2 border-transparent hover-lift transition-all user-modern-card" style={{ border: '2px solid rgba(13, 110, 253, 0.15)' }}>
                                        <Card.Body className="p-4">
                                            <div className="d-flex align-items-start justify-content-between mb-4">
                                                <div style={{
                                                    width: 48, height: 48, borderRadius: '50%',
                                                    background: "rgba(13, 110, 253, 0.05)",
                                                    color: "#0d6efd", display: "flex", alignItems: "center", justifyContent: "center", 
                                                    fontWeight: "900", fontSize: '1.1rem', border: '2px solid #0d6efd',
                                                    boxShadow: '0 4px 10px rgba(13, 110, 253, 0.15)'
                                                }}>
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <Badge bg={u.role === 'hospital_admin' ? 'warning' : 'primary'}
                                                    text={u.role === 'hospital_admin' ? 'dark' : 'white'}
                                                    className="rounded-pill px-3 py-2 text-capitalize fw-black shadow-sm border-0"
                                                    style={{ fontSize: '10px' }}>
                                                    {u.role?.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <div className="mb-4">
                                                <h5 className="fw-black text-dark mb-1 text-truncate">{u.name}</h5>
                                                <div className="small text-muted text-truncate fw-bold">{u.email}</div>
                                            </div>
                                            <div className="p-3 bg-light rounded-4 mb-4 border border-white d-flex flex-column gap-2">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="fw-black text-muted text-uppercase" style={{fontSize: '8px', letterSpacing: '0.5px'}}>CONTACT:</div>
                                                    <div className="small fw-bold text-dark d-flex align-items-center gap-1">
                                                        <Phone size={10} className="text-primary" /> {u.phone || "N/A"}
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="fw-black text-muted text-uppercase" style={{fontSize: '8px', letterSpacing: '0.5px'}}>GENDER:</div>
                                                    <div className="small fw-bold text-dark">{u.gender || "Male"}</div>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="fw-black text-muted text-uppercase" style={{fontSize: '8px', letterSpacing: '0.5px'}}>AGE:</div>
                                                    <div className="small fw-bold text-dark">{u.age || "N/A"} yrs</div>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center pt-2 border-top border-white border-opacity-50 mt-1">
                                                    <div className="fw-black text-muted text-uppercase" style={{fontSize: '8px', letterSpacing: '0.5px'}}>NODE:</div>
                                                    <div className="small fw-black text-primary text-truncate ms-2 text-end" style={{maxWidth: '120px'}}>
                                                        {u.hospital_name || "GLOBAL"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center pt-3 border-top border-light">
                                                <div className="small text-muted fw-black d-flex align-items-center gap-1">
                                                    <Hash size={12} /> {u.id?.toString().slice(-6)}
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <Button variant="light" size="sm" className="rounded-3 p-2 text-primary border shadow-xs bg-white hover-lift" onClick={() => handleEdit(u)}>
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button variant="light" size="sm" className="rounded-3 p-2 text-danger border shadow-xs bg-white hover-lift" onClick={() => handleDelete(u.id, u.role)}>
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </>
            )}

            {/* ══ EDIT USER MODAL ══ */}
            <Modal show={showEdit} onHide={() => setShowEdit(false)} centered size="md" contentClassName="rounded-5 border-0 shadow-lg overflow-hidden mt-5">
                <Modal.Header closeButton className="border-0 bg-primary text-white p-3">
                    <Modal.Title className="fw-black d-flex align-items-center gap-2 tracking-tight" style={{fontSize: '15px'}}>
                        <UserCog size={18} /> MODIFY USER IDENTITY
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3 bg-light">
                    <div className="smart-card-body p-3 rounded-4 border-primary border-top border-5 bg-white shadow-sm">
                        <Form onSubmit={handleUpdate}>
                            <Row className="g-2">
                                <Col md={12}>
                                    <Form.Label className="fw-black text-muted mb-1" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>NODE ASSIGNMENT</Form.Label>
                                    <Form.Select size="sm" className="border-0 shadow-sm bg-light p-2 rounded-3 fw-bold" style={{fontSize: '11px'}}
                                        value={editForm.hospital_id}
                                        onChange={e => setEditForm({ ...editForm, hospital_id: e.target.value })}>
                                        <option value="">— Global Network / No Project —</option>
                                        {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="fw-black text-muted mb-1" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>LEGAL NAME</Form.Label>
                                    <Form.Control size="sm" className="border-0 shadow-sm bg-light p-2 rounded-3 fw-bold" style={{fontSize: '11px'}} value={editForm.name}
                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="fw-black text-muted mb-1" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>PRIMARY EMAIL</Form.Label>
                                    <Form.Control size="sm" className="border-0 shadow-sm bg-light p-2 rounded-3 fw-bold" style={{fontSize: '11px'}} value={editForm.email}
                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="fw-black text-muted mb-1" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>GENDER</Form.Label>
                                    <Form.Select size="sm" className="border-0 shadow-sm bg-light p-2 rounded-3 fw-bold" style={{fontSize: '11px'}} value={editForm.gender}
                                        onChange={e => setEditForm({ ...editForm, gender: e.target.value })}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </Form.Select>
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="fw-black text-muted mb-1" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>AGE</Form.Label>
                                    <Form.Control size="sm" type="number" className="border-0 shadow-sm bg-light p-2 rounded-3 fw-bold" style={{fontSize: '11px'}} value={editForm.age}
                                        onChange={e => setEditForm({ ...editForm, age: e.target.value })} />
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="fw-black text-muted mb-1" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>PHONE</Form.Label>
                                    <Form.Control size="sm" className="border-0 shadow-sm bg-light p-2 rounded-3 fw-bold" style={{fontSize: '11px'}} value={editForm.phone}
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                                </Col>
                                <Col md={12}>
                                    <Form.Label className="fw-black text-muted mb-1" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>SYSTEM ROLE</Form.Label>
                                    <Form.Select size="sm" className="border-0 shadow-sm bg-light p-2 rounded-3 fw-bold" style={{fontSize: '11px'}} value={editForm.role}
                                        onChange={e => setEditForm({ ...editForm, role: e.target.value })}>
                                        <option value="patient">Patient Profile</option>
                                        <option value="doctor">Medical Practitioner</option>
                                        <option value="hospital_admin">Administrative Control</option>
                                        <option value="super_admin">Root Access (Super Admin)</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <div className="text-center mt-3">
                                <Button type="submit" variant="primary" className="px-5 py-2 rounded-2 fw-black shadow-lg border-0 btn-premium-blue text-white text-uppercase" style={{fontSize: '10px', letterSpacing: '1px'}}>
                                    <Save size={14} className="me-2" /> SYNC IDENTITY
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                body { font-family: 'Inter', sans-serif; background-color: #f8f9fa; }
                .fw-black { font-weight: 900; }
                .tracking-tight { letter-spacing: -1.2px; }
                .tracking-widest { letter-spacing: 2px; }
                .shadow-xs { box-shadow: 0 2px 4px rgba(0,0,0,0.03); }
                .hover-lift { transition: all 0.3s ease; }
                .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(13, 110, 253, 0.1) !important; }
                .transition-all { transition: all 0.3s ease; }
                .user-modern-card:hover { border-color: #0d6efd !important; }
                .btn-premium-blue { background: #0d6efd !important; transition: all 0.3s ease; }
                .btn-premium-blue:hover { background: #0a58ca !important; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(13, 110, 253, 0.3) !important; }
                .smart-card-body { transition: all 0.3s ease; }
            `}</style>
        </Container>
    );
};

export default ViewUsers;
