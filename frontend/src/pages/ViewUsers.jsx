import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Container, Row, Col, Card, Button, Table, Badge, Form, Modal, Alert } from "react-bootstrap";
import { Users, Search, Filter, Download, MoreVertical, Globe, MapPin, Edit, Trash2, Save, UserCog } from "lucide-react";

/**
 * ViewUsers Component
 * Displays a table with Client Name, Contact, Gender, Age - Matching user screenshots
 */
const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [alert, setAlert] = useState(null);

    // Edit Modal State
    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState({
        id: "", name: "", email: "", role: "", hospital_id: "",
        gender: "", age: "", phone: ""
    });
    const [roleFilter, setRoleFilter] = useState("All");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [userRes, hospRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/super-admin/app-users`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                }),
                axios.get(`${API_BASE_URL}/api/super-admin/hospitals`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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

    useEffect(() => { fetchData(); }, []);

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
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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
        const matchesRole = roleFilter === "All" || u.role === roleFilter;
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
        <>
            <Container fluid className="py-4 px-md-5 bg-light min-vh-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0">REGISTERED USERS DIRECTORY</h4>
                    <div className="d-flex gap-2">
                        <Button variant="white" className="border shadow-sm rounded-3 px-3 d-flex align-items-center gap-2" onClick={exportToCSV}>
                            <Download size={18} /> Export CSV
                        </Button>
                    </div>
                </div>

                {alert && (
                    <Alert variant={alert.type} dismissible onClose={() => setAlert(null)} className="rounded-3 shadow-sm border-0 mb-4">
                        {alert.msg}
                    </Alert>
                )}

                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <Card.Header className="bg-white border-0 p-4">
                        <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-3">
                                <div className="small fw-bold text-muted text-uppercase">Role:</div>
                                <Form.Select
                                    className="w-auto border-0 bg-light rounded-3 fw-bold small"
                                    value={roleFilter}
                                    onChange={e => setRoleFilter(e.target.value)}
                                >
                                    <option value="All">All Roles</option>
                                    <option value="patient">Patients</option>
                                    <option value="doctor">Doctors</option>
                                    <option value="hospital_admin">Admins</option>
                                </Form.Select>
                            </div>
                            <div style={{ position: "relative", width: "300px" }}>
                                <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#999" }} size={16} />
                                <Form.Control
                                    className="ps-5 border-0 bg-light rounded-pill p-2"
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body className="p-0 mt-2">
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="bg-light text-muted small text-uppercase">
                                    <tr>
                                        <th className="px-4 py-3 border-0">Client Name</th>
                                        <th className="py-3 border-0">Contact</th>
                                        <th className="py-3 border-0 text-center">Gender</th>
                                        <th className="py-3 border-0 text-center">Age</th>
                                        <th className="py-3 border-0 text-center">Role</th>
                                        <th className="py-3 border-0">Project / Hospital</th>
                                        <th className="py-3 border-0 text-center">Unique-ID</th>
                                        <th className="py-3 border-0 text-end px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={6} className="text-center py-5">Loading users...</td></tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center py-5 text-muted">No clients matching your search.</td></tr>
                                    ) : filteredUsers.map((u, i) => (
                                        <tr key={u.id}>
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div style={{
                                                        width: 32, height: 32, borderRadius: 10,
                                                        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                                                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700"
                                                    }}>
                                                        {u.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="fw-bold">{u.name}</div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <div className="text-dark fw-semibold">{u.phone || "Not Provided"}</div>
                                                <div className="small text-muted">{u.email}</div>
                                            </td>
                                            <td className="py-3 text-center">
                                                <Badge bg={u.gender === 'Female' ? 'danger' : 'primary'} className="bg-opacity-10 text-dark border px-3 rounded-pill">
                                                    {u.gender || "Male"}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-center fw-bold">{u.age || "N/A"}</td>
                                            <td className="py-3 text-center">
                                                <Badge bg={u.role === 'hospital_admin' ? 'warning' : u.role === 'doctor' ? 'info' : u.role === 'patient' ? 'success' : 'secondary'}
                                                    text={u.role === 'hospital_admin' ? 'dark' : 'white'}
                                                    className="rounded-pill px-3 py-2 text-capitalize">
                                                    {u.role?.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                {u.hospital_name ? (
                                                    <Badge bg="light" text="dark" className="border px-3 rounded-pill fw-semibold shadow-xs d-inline-flex align-items-center gap-1">
                                                        <MapPin size={10} className="text-primary" /> {u.hospital_name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted small italic">Global System</span>
                                                )}
                                            </td>
                                            <td className="py-3 text-center">
                                                <code className="text-muted fw-bold small">#{u.id}</code>
                                            </td>
                                            <td className="py-3 text-end px-4">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <Button variant="light" size="sm" className="rounded-circle p-2 text-primary border-0" onClick={() => handleEdit(u)}>
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button variant="light" size="sm" className="rounded-circle p-2 text-danger border-0" onClick={() => handleDelete(u.id, u.role)}>
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
            </Container>

            {/* ══ EDIT USER MODAL ══ */}
            <Modal show={showEdit} onHide={() => setShowEdit(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 bg-primary text-white p-4">
                    <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                        <UserCog size={20} /> Manage App User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-light">
                    <Form onSubmit={handleUpdate}>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Assign to Hospital / Project</Form.Label>
                                <Form.Select className="border-0 shadow-sm bg-white p-3"
                                    value={editForm.hospital_id}
                                    onChange={e => setEditForm({ ...editForm, hospital_id: e.target.value })}>
                                    <option value="">— Global / No Project —</option>
                                    {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Full Name</Form.Label>
                                <Form.Control className="border-0 shadow-sm bg-white p-3" value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Email</Form.Label>
                                <Form.Control className="border-0 shadow-sm bg-white p-3" value={editForm.email}
                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Gender</Form.Label>
                                <Form.Select className="border-0 shadow-sm bg-white p-3" value={editForm.gender}
                                    onChange={e => setEditForm({ ...editForm, gender: e.target.value })}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Age</Form.Label>
                                <Form.Control type="number" className="border-0 shadow-sm bg-white p-3" value={editForm.age}
                                    onChange={e => setEditForm({ ...editForm, age: e.target.value })} />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small fw-bold text-uppercase text-muted">Phone</Form.Label>
                                <Form.Control className="border-0 shadow-sm bg-white p-3" value={editForm.phone}
                                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                            </Col>
                            <Form.Label className="small fw-bold text-uppercase text-muted">System Role</Form.Label>
                            <Form.Select className="border-0 shadow-sm bg-white p-3" value={editForm.role}
                                onChange={e => setEditForm({ ...editForm, role: e.target.value })}>
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                                <option value="hospital_admin">Hospital Admin</option>
                                <option value="super_admin">Super Admin</option>
                            </Form.Select>
                        </Row>
                        <Button type="submit" variant="primary" className="w-100 py-3 rounded-pill fw-bold mt-4 shadow-sm">
                            <Save size={18} className="me-2" /> SAVE USER CHANGES
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ViewUsers;
