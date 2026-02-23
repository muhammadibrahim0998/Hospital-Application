import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import {
    User,
    Settings,
    Calendar,
    MessageSquare,
    FlaskConical,
    ShieldCheck,
    ClipboardCheck,
    UserX,
    Camera,
    CheckCircle,
    Clock
} from "lucide-react";
import { Modal, Button, Form, Row, Col, Badge, Card } from "react-bootstrap";

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [profile, setProfile] = useState({});
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [editingProfile, setEditingProfile] = useState({
        specialization: "",
        contact_info: "",
        departmentId: "",
        fieldId: "",
        phone: "",
        imageFile: null
    });

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const appRes = await axios.get(`${API_BASE_URL}/api/doctor/appointments`, { headers });
            const profileRes = await axios.get(`${API_BASE_URL}/api/doctor/profile`, { headers });
            setAppointments(appRes.data);
            setProfile(profileRes.data);
            setEditingProfile({
                specialization: profileRes.data.specialization || "",
                contact_info: profileRes.data.contact_info || "",
                departmentId: profileRes.data.department_id || "",
                fieldId: profileRes.data.field_id || "",
                phone: profileRes.data.phone || "",
                imageFile: null
            });
        } catch (err) {
            console.error("Error fetching doctor data", err);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`${API_BASE_URL}/api/doctor/appointments/${id}/status`, { status }, { headers });
            fetchData();
        } catch (err) {
            alert("Error updating status");
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("specialization", editingProfile.specialization);
        formData.append("contact_info", editingProfile.contact_info);
        formData.append("departmentId", editingProfile.departmentId);
        formData.append("fieldId", editingProfile.fieldId);
        formData.append("phone", editingProfile.phone);
        if (editingProfile.imageFile) {
            formData.append("image", editingProfile.imageFile);
        }

        try {
            await axios.put(`${API_BASE_URL}/api/doctor/profile`, formData, {
                headers: { ...headers, "Content-Type": "multipart/form-data" }
            });
            setShowProfileModal(false);
            fetchData();
        } catch (err) {
            alert("Error updating profile");
        }
    };

    return (
        <div className="container-fluid py-4 px-md-5 bg-light min-vh-100">
            {/* Top Bar / Welcome */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3 bg-white p-4 rounded-4 shadow-sm border-0">
                <div className="d-flex align-items-center gap-3">
                    <img
                        src={profile.image ? `${API_BASE_URL}${profile.image}` : "https://img.icons8.com/color/96/doctor-male.png"}
                        alt="Doctor"
                        className="rounded-circle border border-3 border-primary p-1"
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Welcome, Dr. {profile.name}</h2>
                        <div className="d-flex align-items-center gap-2">
                            <Badge bg="primary-subtle" className="text-primary px-3 py-2 rounded-pill fw-medium">
                                {profile.specialization || "General Physician"}
                            </Badge>
                            <span className="text-muted small">| Hospital Management System Provider</span>
                        </div>
                    </div>
                </div>
                <Button variant="outline-primary" className="rounded-pill px-4 py-2 d-flex align-items-center fw-bold" onClick={() => setShowProfileModal(true)}>
                    <Settings size={18} className="me-2" /> Manage Profile
                </Button>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-lg-8">
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                        <Card.Header className="bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 d-flex align-items-center">
                                <Calendar className="text-primary me-2" size={20} /> Upcoming Appointments
                            </h5>
                            <Badge bg="light" className="text-muted border rounded-pill px-3 py-2">
                                {appointments.filter(a => a.status === 'scheduled').length} Scheduled
                            </Badge>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0 custom-table">
                                    <thead className="bg-light text-muted small text-uppercase fw-bold">
                                        <tr>
                                            <th className="px-4 py-3">Patient</th>
                                            <th className="py-3">Date & Time</th>
                                            <th className="py-3">Status</th>
                                            <th className="py-3 text-end px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">No appointments found.</td>
                                            </tr>
                                        ) : (
                                            appointments.map((app) => (
                                                <tr key={app.id}>
                                                    <td className="px-4 py-3">
                                                        <div className="fw-bold text-dark">{app.Patient || app.patient_name}</div>
                                                        <div className="small text-muted">ID: #{app.patient_id || 'N/A'}</div>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="d-flex align-items-center text-muted small">
                                                            <Clock size={14} className="me-1" />
                                                            {new Date(app.Date || app.appointment_date).toLocaleString()}
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge
                                                            bg={app.status === 'completed' ? 'success' : app.status === 'cancelled' ? 'danger' : 'warning'}
                                                            className="rounded-pill px-3 py-2 fw-medium opacity-75"
                                                        >
                                                            {app.status?.toUpperCase()}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 text-end px-4">
                                                        <div className="d-flex justify-content-end gap-2">
                                                            {app.status === 'scheduled' && (
                                                                <>
                                                                    <Button variant="success" size="sm" className="rounded-circle p-2 shadow-sm border-0" onClick={() => handleStatusUpdate(app.id, 'completed')}>
                                                                        <CheckCircle size={16} />
                                                                    </Button>
                                                                    <Button variant="danger" size="sm" className="rounded-circle p-2 shadow-sm border-0" onClick={() => handleStatusUpdate(app.id, 'cancelled')}>
                                                                        <UserX size={16} />
                                                                    </Button>
                                                                </>
                                                            )}
                                                            <Link to={`/chat/${app.patient_id}`} className="btn btn-primary btn-sm rounded-circle p-2 shadow-sm border-0">
                                                                <MessageSquare size={16} />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                <div className="col-lg-4">
                    <Card className="border-0 shadow-sm rounded-4 bg-primary text-white p-2 mb-4">
                        <Card.Body className="p-4">
                            <div className="bg-white bg-opacity-25 rounded-3 p-3 mb-3 d-inline-block">
                                <FlaskConical size={24} />
                            </div>
                            <h4 className="fw-bold mb-2">Clinical Diagnostics</h4>
                            <p className="small mb-4 opacity-75">Access lab panels, diagnostic tools, and medication systems for your patients.</p>
                            <Link to="/doctor-lab" className="btn btn-white text-primary fw-bold rounded-pill px-4 w-100 shadow-sm">
                                Open Lab Panel
                            </Link>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <Card.Body className="p-4">
                            <h6 className="text-uppercase fw-bold text-muted small mb-4 tracking-wider">Professional Profile</h6>
                            <div className="mb-3">
                                <label className="text-muted small mb-1">Email Address</label>
                                <div className="fw-bold">{profile.email || "N/A"}</div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small mb-1">Consultation Contact</label>
                                <div className="fw-bold">{profile.phone || "N/A"}</div>
                            </div>
                            <div className="mb-0">
                                <label className="text-muted small mb-1">Office Details</label>
                                <div className="fw-bold">{profile.contact_info || "Hospital OPD"}</div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Profile Update Modal */}
            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered className="border-0">
                <Modal.Header closeButton className="border-0 bg-primary text-white p-4">
                    <Modal.Title className="fw-bold"><Settings className="me-2" /> Update Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-light">
                    <Form onSubmit={handleProfileUpdate}>
                        <Row className="g-3">
                            <Col md={12}>
                                <div className="text-center mb-4 position-relative">
                                    <img
                                        src={profile.image ? `${API_BASE_URL}${profile.image}` : "https://img.icons8.com/color/96/doctor-male.png"}
                                        alt="Current"
                                        className="rounded-circle border border-3 border-white shadow-sm"
                                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                    />
                                    <label htmlFor="image-upload" className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 start-50 translate-middle-x mb-n2 shadow-sm p-2 border-white border-2">
                                        <Camera size={16} />
                                    </label>
                                    <input id="image-upload" type="file" className="d-none" accept="image/*" onChange={(e) => setEditingProfile({ ...editingProfile, imageFile: e.target.files[0] })} />
                                </div>
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">Specialization</Form.Label>
                                <Form.Control className="border-0 shadow-sm px-3 py-2" value={editingProfile.specialization} onChange={(e) => setEditingProfile({ ...editingProfile, specialization: e.target.value })} required />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">Public Phone</Form.Label>
                                <Form.Control className="border-0 shadow-sm px-3 py-2" value={editingProfile.phone} onChange={(e) => setEditingProfile({ ...editingProfile, phone: e.target.value })} required />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">Contact / Clinic Info</Form.Label>
                                <Form.Control as="textarea" rows={2} className="border-0 shadow-sm px-3 py-2" value={editingProfile.contact_info} onChange={(e) => setEditingProfile({ ...editingProfile, contact_info: e.target.value })} required />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">Dept ID</Form.Label>
                                <Form.Control type="number" className="border-0 shadow-sm px-3 py-2" value={editingProfile.departmentId} onChange={(e) => setEditingProfile({ ...editingProfile, departmentId: e.target.value })} required />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">Field ID</Form.Label>
                                <Form.Control type="number" className="border-0 shadow-sm px-3 py-2" value={editingProfile.fieldId} onChange={(e) => setEditingProfile({ ...editingProfile, fieldId: e.target.value })} required />
                            </Col>
                        </Row>
                        <Button type="submit" variant="primary" className="w-100 py-3 rounded-pill fw-bold shadow-lg mt-4">SAVE CHANGES</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <style>{`
                .custom-table tr { transition: all 0.2s ease; cursor: default; }
                .custom-table tr:hover { background-color: rgba(0, 0, 0, 0.01) !important; }
                .btn-white { background-color: white !important; }
                .btn-white:hover { background-color: #f8f9fa !important; }
                .mb-n2 { margin-bottom: -0.5rem; }
            `}</style>
        </div>
    );
};

export default DoctorDashboard;
